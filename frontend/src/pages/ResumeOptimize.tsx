import { useState, useEffect, useRef } from "react";
import { optimizeResume, tailorResume } from "../api/aiAPI";
import ResumeInput from "../components/common/ResumeInput";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import type { StructuredResume } from "../types/structuredResume";
import ResumeRenderer from "../components/common/ResumeRenderer";

const ResumeOptimize = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tailorMode, setTailorMode] = useState(false);
  const [atsOptimized, setAtsOptimized] = useState(true);
  const [structured, setStructured] = useState<StructuredResume | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const handleGenerate = async () => {
    if (!resumeText) {
      setError("Please upload or paste your resume.");
      return;
    }

    if (tailorMode && !jobDescription) {
      setError("Please provide a job description for tailoring.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setStructured(null);

      const response = tailorMode
        ? await tailorResume({
            resumeText,
            jobDescription,
            atsOptimized,
          })
        : await optimizeResume({
            resumeText,
            atsOptimized,
          });

      setStructured(response);
      console.log("Structured Resume:", response);
    } catch (err) {
      console.error(err);
      setError("Failed to generate resume optimization.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!structured) return;

    const text = structured.sections
      .map((section) => {
        if (section.type === "paragraph")
          return `${section.title}\n${section.content}`;

        if (section.type === "list")
          return `${section.title}\n${section.items.join("\n")}`;

        if (section.type === "experience")
          return (
            section.title +
            "\n" +
            section.items
              .map(
                (e) =>
                  `${e.heading}\n${e.subheading ?? ""}\n${e.bullets.join("\n")}`,
              )
              .join("\n\n")
          );

        return "";
      })
      .join("\n\n");

    await navigator.clipboard.writeText(text);
  };

  const buildDocx = async (resume: StructuredResume) => {
    const children: Paragraph[] = [];

    // HEADER (not Word header)
    if (resume.header?.name) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resume.header.name,
              bold: true,
              size: 36,
            }),
          ],
          alignment: "center",
        }),
      );

      const contactLine = [
        resume.header.email,
        resume.header.phone,
        resume.header.location,
      ]
        .filter(Boolean)
        .join(" • ");

      if (contactLine) {
        children.push(
          new Paragraph({
            text: contactLine,
            alignment: "center",
          }),
        );
      }

      children.push(new Paragraph(""));
    }

    // SECTIONS
    resume.sections.forEach((section) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: section.title, bold: true })],
          spacing: { before: 300 },
        }),
      );

      if (section.type === "paragraph") {
        children.push(new Paragraph(section.content));
      }

      if (section.type === "list") {
        section.items.forEach((item) => {
          children.push(
            new Paragraph({
              text: item,
              bullet: { level: 0 },
            }),
          );
        });
      }

      if (section.type === "experience") {
        section.items.forEach((exp) => {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: exp.heading, bold: true })],
            }),
          );

          if (exp.subheading) {
            children.push(new Paragraph(exp.subheading));
          }

          exp.bullets.forEach((b) => {
            children.push(
              new Paragraph({
                text: b,
                bullet: { level: 0 },
              }),
            );
          });
        });
      }
    });

    const doc = new Document({
      sections: [{ children }],
    });

    return doc;
  };

  const downloadAsDocx = async () => {
    if (!structured) return;

    const doc = await buildDocx(structured);
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "professional_resume.docx");
  };

  useEffect(() => {
    if (structured && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [structured]);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Resume Optimizer</h2>
        <p className="text-gray-400">
          Transform your resume into a results-driven, recruiter-ready document.
        </p>
      </div>

      <ResumeInput
        onChange={(payload) => payload && setResumeText(payload.text)}
      />

      {/* Options Panel */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={tailorMode}
              onChange={() => setTailorMode(!tailorMode)}
              className="accent-blue-600"
            />
            <span className="text-gray-300 font-medium">
              Tailor to Job Description
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={atsOptimized}
              onChange={() => setAtsOptimized(!atsOptimized)}
              className="accent-blue-600"
            />
            <span className="text-gray-300 font-medium">
              ATS Optimized Mode
            </span>
          </label>
        </div>

        {tailorMode && (
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            placeholder="Paste job description here..."
            className="w-full rounded-lg border border-gray-600 p-3 bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
      >
        {loading ? "Optimizing..." : "Generate Optimized Resume"}
      </button>

      {error && (
        <div className="bg-red-700 text-red-200 p-3 rounded-lg">{error}</div>
      )}

      {structured && (
        <div
          ref={resultRef}
          className="space-y-4 bg-gray-800 border border-gray-700 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white">Optimized Resume</h3>

          <ResumeRenderer resume={structured} />

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={downloadAsDocx}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
            >
              Download .docx
            </button>

            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                copied ? "bg-emerald-500" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {copied ? "Copied ✓" : "Copy to Clipboard"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeOptimize;
