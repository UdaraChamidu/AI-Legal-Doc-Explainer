import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import SummaryView from "./components/SummaryView";
import QASection from "./components/QASection";
import "./App.css";

function App() {
  const [result, setResult] = useState(null);

  const handleResult = (data) => {
    let parsed = data;
    if (typeof data === "string") {
      try {
        parsed = JSON.parse(data);
      } catch (e) {
        console.error("Failed to parse response:", e);
      }
    }
    setResult(parsed);
  };

  return (
    <div
      className="app-container"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        maxWidth: "1200px",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        AI Legal Document Explainer
      </h1>

      <FileUpload onResult={handleResult} />

      {result && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "20px",
            flexGrow: 1,
          }}
        >
          <SummaryView
            summary={result.summary || "No summary available"}
            highlights={result.highlights || []}
            risks={result.risks || []}
          />
          <QASection />
        </div>
      )}
    </div>
  );
}

export default App;
