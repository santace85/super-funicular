import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import CoverLetter from "./pages/CoverLetter";
import ResumeOptimize from "./pages/ResumeOptimize";
import InterviewHelper from "./pages/InterviewHelper";

function App() {
  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.text())
      .then(console.log);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cover-letter" element={<CoverLetter />} />
          <Route path="/resume-optimize" element={<ResumeOptimize />} />
          <Route path="/interview-helper" element={<InterviewHelper />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
