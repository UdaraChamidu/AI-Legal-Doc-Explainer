import React from "react";
import ReactMarkdown from "react-markdown";

function SummaryView({ summary, highlights, risks }) {
  return (
    <div
      className="summary-view"
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        borderRadius: "10px",
        marginTop: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h2 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>
        Summary
      </h2>
      <ReactMarkdown>{summary || "No summary available."}</ReactMarkdown>

      <h2
        style={{
          borderBottom: "1px solid #ccc",
          paddingBottom: "5px",
          marginTop: "15px",
        }}
      >
        Key Clauses
      </h2>
      {highlights.length > 0 ? (
        highlights.map((clause, idx) => (
          <ReactMarkdown key={idx}>{`- ${clause}`}</ReactMarkdown>
        ))
      ) : (
        <p>No key clauses identified.</p>
      )}

      <h2
        style={{
          borderBottom: "1px solid #ccc",
          paddingBottom: "5px",
          marginTop: "15px",
        }}
      >
        Risks / Red Flags
      </h2>
      {risks.length > 0 ? (
        risks.map((risk, idx) => (
          <ReactMarkdown key={idx}>{`- ${risk}`}</ReactMarkdown>
        ))
      ) : (
        <p>No major risks detected.</p>
      )}
    </div>
  );
}

export default SummaryView;
