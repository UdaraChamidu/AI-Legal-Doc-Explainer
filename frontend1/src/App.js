import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import SummaryView from "./components/SummaryView";
import QASection from "./components/QASection";

function App() {
  const [result, setResult] = useState(null);

  // Normalize backend response
  const handleResult = (data) => {
    let parsed = data;

    // If backend sends a stringified JSON, parse it
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
    <div className="app-container">
      <h1>AI Legal Document Explainer</h1>
      <FileUpload onResult={handleResult} />
      {result && (
        <>
          <SummaryView
            summary={result.summary || "No summary available"}
            highlights={result.highlights || []}
            risks={result.risks || []}
          />
          <QASection />
        </>
      )}
    </div>
  );
}

export default App;
