import React, { useState } from "react";
import { askQuestion } from "../api";

export default function QASection() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]); // store chat history
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    // Add user's message
    const userMessage = { type: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion(""); // clear input
    setLoading(true);

    try {
      const result = await askQuestion(userMessage.text);

      // Extract only the answer text (avoid showing JSON)
      const answerText =
        typeof result === "string"
          ? result
          : result?.answer || "No answer available";

      const botMessage = { type: "bot", text: answerText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = {
        type: "bot",
        text: "Error: Could not get answer. Try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "10px", maxWidth: "800px", margin: "auto" }}>
      <h3>Ask a Question</h3>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.type === "user" ? "right" : "left",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "15px",
                backgroundColor: msg.type === "user" ? "#4caf50" : "#e0e0e0",
                color: msg.type === "user" ? "#fff" : "#000",
                maxWidth: "80%",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <p>Loading...</p>}
      </div>

      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question..."
        style={{ width: "70%", padding: "8px" }}
        onKeyDown={(e) => e.key === "Enter" && handleAsk()}
      />
      <button
        onClick={handleAsk}
        style={{ padding: "8px 16px", marginLeft: "8px" }}
      >
        Ask
      </button>
    </div>
  );
}
