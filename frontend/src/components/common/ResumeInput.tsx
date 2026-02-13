import React, { useState, type DragEvent } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export type ResumePayload = {
  text: string;
};

interface ResumeInputProps {
  onChange: (payload: ResumePayload | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ResumeInput: React.FC<ResumeInputProps> = ({ onChange }) => {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [parsing, setParsing] = useState(false);

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const getFileBadge = (fileName: string) => {
    if (fileName.endsWith(".pdf")) return "PDF";
    if (fileName.endsWith(".docx")) return "DOCX";
    return "FILE";
  };

  const validateFile = (selected: File) => {
    if (!allowedTypes.includes(selected.type)) {
      setError("Only PDF or DOCX files are allowed.");
      return false;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setError("File size must be under 5MB.");
      return false;
    }

    setError("");
    return true;
  };

  const handleFileSelect = async (selected: File) => {
    if (!validateFile(selected)) {
      setFile(null);
      setPreviewText("");
      onChange(null);
      return;
    }

    setFile(selected);

    let extracted = "";

    if (selected.type === "application/pdf") {
      extracted = await extractPdfText(selected);
    } else {
      extracted = await extractDocxText(selected);
    }

    setPreviewText(extracted.slice(0, 1500));

    // 🔥 Send extracted text upward
    onChange({ text: extracted });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleTextChange = (value: string) => {
    setResumeText(value);
    onChange(value.trim() ? { text: value } : null);
  };

  const extractPdfText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    const pagesToRead = Math.min(pdf.numPages, 2);

    for (let i = 1; i <= pagesToRead; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const pageText = content.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ");

      fullText += pageText + "\n\n";
    }

    return fullText;
  };

  const extractDocxText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-6 transition hover:shadow-2xl hover:shadow-blue-500/10">
      {/* Header + Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-100">Resume Input</h3>

        <div className="flex bg-gray-700 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`px-4 py-1 rounded-md text-sm transition ${
              mode === "text"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Paste Text
          </button>

          <button
            type="button"
            onClick={() => setMode("file")}
            className={`px-4 py-1 rounded-md text-sm transition ${
              mode === "file"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Upload File
          </button>
        </div>
      </div>

      {/* TEXT MODE */}
      {mode === "text" && (
        <>
          <textarea
            rows={8}
            placeholder="Paste your resume here..."
            value={resumeText}
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-full rounded-xl bg-gray-700 border border-gray-600 p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </>
      )}

      {/* FILE MODE */}
      {mode === "file" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
            dragging
              ? "border-blue-500 bg-gray-700 scale-[1.02]"
              : "border-gray-600 bg-gray-800 hover:border-blue-400"
          }`}
        >
          <input
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            id="resumeUpload"
            onChange={(e) =>
              e.target.files && handleFileSelect(e.target.files[0])
            }
          />

          <label htmlFor="resumeUpload" className="cursor-pointer block">
            <p className="text-gray-300 font-medium">
              Drag & drop your resume here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse (PDF or DOCX, max 5MB)
            </p>
          </label>

          {file && (
            <div className="mt-4 flex justify-center items-center gap-3">
              <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-600 text-white">
                {getFileBadge(file.name)}
              </span>

              <span className="text-sm text-green-400">{file.name}</span>
            </div>
          )}

          {parsing && (
            <p className="text-sm text-blue-400 mt-3">Parsing PDF...</p>
          )}

          {previewText && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm text-gray-300 whitespace-pre-wrap max-h-64 overflow-y-auto mt-4">
              <div className="text-xs uppercase text-gray-500 mb-2">
                Resume Preview
              </div>
              {previewText}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-600/20 border border-red-500 text-red-300 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default ResumeInput;
