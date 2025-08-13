import React, { useState } from "react";
//import { askQuestion } from "../../../frontend/src/api";
import { askQuestion } from "../api";

export default function QASection() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    const result = await askQuestion(question);
    setAnswer(result.answer);
  };

  return (
    <div style={{ padding: "10px" }}>
      <h3>Ask a Question</h3>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question..."
        style={{ width: "80%" }}
      />
      <button onClick={handleAsk}>Ask</button>
      {answer && (
        <div>
          <h4>Answer:</h4>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
