import { generateCoverLetter } from "../api/aiAPI";
import ResumeInput from "../components/common/ResumeInput";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { useState, useRef, useEffect } from "react";

const CoverLetter = () => {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);

      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("Copy failed — browser blocked clipboard.");
    }
  };

  const downloadAsDocx = async () => {
    if (!result) return;

    const safeTitle = jobTitle
      ? jobTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()
      : "cover_letter";

    const paragraphs = result.split("\n").map(
      (line) =>
        new Paragraph({
          children: [new TextRun(line)],
        }),
    );

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);

    saveAs(blob, `${safeTitle}_cover_letter.docx`);
  };

  const handleGenerate = async () => {
    if (!resumeText || !jobDescription) {
      setError("Please provide resume and job description.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult("");

      const response = await generateCoverLetter({
        resumeSummary: resumeText,
        jobDescription,
      });

      setResult(response.result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate cover letter.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 text-gray-200">
      <div className="bg-gray-800 shadow-xl rounded-2xl w-full max-w-6xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-100">
            AI Career Toolkit
          </h1>
          <p className="text-gray-400">
            Generate personalized cover letters in seconds
          </p>
        </div>

        {/* Resume Input Component */}
        <ResumeInput
          onChange={(payload) => {
            if (payload) {
              setResumeText(payload.text);
            }
          }}
        />

        {/* Job Title */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-200">Job Title</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            className="w-full rounded-lg border border-gray-600 p-3 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Job Input */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-200">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            placeholder="Enter job description or title..."
            className="w-full rounded-lg border border-gray-600 p-3 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Cover Letter"}
        </button>

        {/* Error Message */}
        {error && (
          <div className="bg-red-700 text-red-200 p-3 rounded-lg">{error}</div>
        )}

        {/* Result */}
        {result && (
          <div
            ref={resultRef}
            className="space-y-4 bg-gray-700 border border-gray-600 rounded-lg p-4 animate-[fadeIn_.35s_ease]"
          >
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
              <h3 className="font-semibold text-gray-100 mb-2">
                Generated Cover Letter
              </h3>
              <pre className="whitespace-pre-wrap text-gray-200">{result}</pre>
            </div>

            <button
              onClick={downloadAsDocx}
              className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-green-500/30"
            >
              Download Cover Letter
            </button>

            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 ml-1 rounded-lg font-semibold transition border
      ${
        copied
          ? "bg-emerald-500 text-white border-emerald-400"
          : "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700"
      }`}
            >
              {copied ? "Copied ✓" : "Copy to Clipboard"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetter;
