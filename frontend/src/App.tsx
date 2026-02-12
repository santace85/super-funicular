import { useEffect } from "react";
import Demo from "./pages/Demo";
import "./App.css";

function App() {
  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.text())
      .then(console.log);
  }, []);

  return <Demo />;
}

export default App;
