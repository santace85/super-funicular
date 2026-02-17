import { useEffect } from "react";
import CoverLetter from "./pages/CoverLetter";
import "./App.css";

function App() {
  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.text())
      .then(console.log);
  }, []);

  return <CoverLetter />;
}

export default App;
