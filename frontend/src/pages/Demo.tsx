import { useState } from "react";
import { generateCoverLetter } from "../api/aiAPI";

const Demo = () => {
  const [resume, setResume] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!resume || !jobTitle) {
      setError("Please enter resume and job title.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult("");

      const response = await generateCoverLetter({
        resumeSummary: resume,
        jobDescription: jobTitle,
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
    <div style={{ maxWidth: "900px", margin: "auto", padding: "2rem" }}>
      <h1>AI Career Toolkit Demo</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>Resume</label>
        <textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          rows={8}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Job Title</label>
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Cover Letter"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Result</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f5f5f5",
              padding: "1rem",
              color: "black"
            }}
          >
            {result}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Demo;
