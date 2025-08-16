import React from "react";

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
      <h2 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>Summary</h2>
      <p>{summary}</p>

      <h2 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px", marginTop: "15px" }}>Key Clauses</h2>
      {highlights.length > 0 ? (
        <ul>
          {highlights.map((clause, idx) => (
            <li key={idx}>{clause}</li>
          ))}
        </ul>
      ) : (
        <p>No key clauses identified.</p>
      )}

      <h2 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px", marginTop: "15px" }}>Risks / Red Flags</h2>
      {risks.length > 0 ? (
        <ul>
          {risks.map((risk, idx) => (
            <li key={idx}>{risk}</li>
          ))}
        </ul>
      ) : (
        <p>No major risks detected.</p>
      )}
    </div>
  );
}

export default SummaryView;
