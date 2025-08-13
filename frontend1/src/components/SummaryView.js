import React from "react";

export default function SummaryView({ summary, highlights, risks }) {
  return (
    <div style={{ padding: "10px" }}>
      <h3>Summary</h3>
      <p>{summary}</p>

      <h3>Key Clauses</h3>
      <ul>
        {highlights?.map((clause, i) => <li key={i}>{clause}</li>)}
      </ul>

      <h3>Risks / Red Flags</h3>
      <ul>
        {risks?.map((risk, i) => <li key={i}>{risk}</li>)}
      </ul>
    </div>
  );
}
