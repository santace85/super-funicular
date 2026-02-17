import { useState, useEffect, useRef } from "react";
import { generateInterviewAnswer } from "../api/aiAPI";

const InterviewHelper = () => {
  const [question, setQuestion] = useState("");
  const [tone, setTone] = useState("confident");
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const handleGenerate = async () => {
    if (!question) return;

    setLoading(true);
    setResult("");

    try {
      const response = await generateInterviewAnswer({
        question,
        tone,
        experienceLevel,
      });

      setResult(response.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">
          Interview Answer Helper
        </h2>
        <p className="text-gray-400">
          Generate structured, high-impact responses using STAR methodology.
        </p>
      </div>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={5}
        placeholder="Enter interview question..."
        className="w-full rounded-lg border border-gray-600 p-3 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
      />

      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-100">
          Customize Your Answer
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Tone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Tone
            </label>
            <p className="text-xs text-gray-500">
              Controls the voice and style of the response.
            </p>

            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="confident">Confident</option>
              <option value="technical">Technical</option>
              <option value="leadership">Leadership</option>
              <option value="concise">Concise</option>
            </select>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Experience Level
            </label>
            <p className="text-xs text-gray-500">
              Adjusts depth and seniority of the response.
            </p>

            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior</option>
              <option value="executive">Executive</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold"
      >
        {loading ? "Generating..." : "Generate Answer"}
      </button>

      {result && (
        <div
          ref={resultRef}
          className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-4"
        >
          <h3 className="text-xl font-semibold text-white">Generated Answer</h3>

          <pre className="whitespace-pre-wrap text-gray-200">{result}</pre>

          <button
            onClick={copyToClipboard}
            className={`px-4 py-2 rounded-lg font-semibold ${
              copied ? "bg-emerald-500" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {copied ? "Copied ✓" : "Copy to Clipboard"}
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewHelper;
