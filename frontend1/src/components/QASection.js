import React, { useState, useRef, useEffect } from "react";
import { askQuestion } from "../api";
import ReactMarkdown from "react-markdown";

export default function QASection() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = { type: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const result = await askQuestion(userMessage.text);
      const botMessage = { type: "bot", text: result || "No answer" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = {
        type: "bot",
        text: "Error: Could not get answer.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#fafafa",
        padding: "10px",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Document Q&A</h3>

      <div
        style={{
          flexGrow: 1,
          minHeight: "400px",
          maxHeight: "60vh",
          overflowY: "auto",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fff",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                backgroundColor: msg.type === "user" ? "#4caf50" : "#e0e0e0",
                color: msg.type === "user" ? "#fff" : "#000",
                padding: "8px 12px",
                borderRadius: "15px",
                maxWidth: "75%",
                wordBreak: "break-word",
              }}
            >
              {msg.type === "bot" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {loading && <p>Loading...</p>}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question..."
          style={{
            flexGrow: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
        />
        <button
          onClick={handleAsk}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Ask
        </button>
      </div>
    </div>
  );
}
