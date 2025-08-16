import React from "react";

function SummaryView({ summary, highlights, risks }) {
  return (
    <div className="summary-view">
      <h2>Summary</h2>
      <p>{summary}</p>

      <h2>Key Clauses</h2>
      {highlights.length > 0 ? (
        <ul>
          {highlights.map((clause, idx) => (
            <li key={idx}>{clause}</li>
          ))}
        </ul>
      ) : (
        <p>No key clauses identified.</p>
      )}

      <h2>Risks / Red Flags</h2>
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
