import { useState } from "react";
import { generateCoverLetter } from "../api/aiAPI";
import ResumeInput, {
  type ResumePayload,
} from "../components/common/ResumeInput";

const Demo = () => {
  const [resume, setResume] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [resumePayload, setResumePayload] = useState<ResumePayload | null>(
    null,
  );

  const handleGenerate = async () => {
    if (!resumePayload || !jobDescription) {
      setError("Please enter both resume and job description.");
      return;
    }

    let resumeSummary = "";

    if (resumePayload.type === "text") {
      resumeSummary = resumePayload.data;
    } else {
      resumeSummary = "Uploaded file: " + resumePayload.data.name;
    }

    try {
      setLoading(true);
      setError("");
      setResult("");

      const response = await generateCoverLetter({
        resumeSummary,
        jobDescription: jobDescription,
        isDemo: true,
      });

      setResult(response.result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate cover letter.");
    } finally {
      setLoading(false);
    }
  };

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
        <ResumeInput onChange={setResumePayload} />

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
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-gray-100">
              Generated Cover Letter
            </h3>
            <pre className="whitespace-pre-wrap text-gray-200">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Demo;
