import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import SummaryView from "./components/SummaryView";
import QASection from "./components/QASection";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>AI Legal Document Explainer</h1>

      {/* File Upload */}
      <FileUpload onResult={setResult} />

      {/* Display results if available */}
      {result && (
        <>
          <SummaryView
            summary={result.summary}
            highlights={result.highlights}
            risks={result.risks}
          />
          <QASection />
        </>
      )}
    </div>
  );
}

export default App;
