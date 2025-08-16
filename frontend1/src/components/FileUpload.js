import React, { useState, useRef } from "react";
import { uploadPDF } from "../api";

export default function FileUpload({ onResult }) {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file!");
    try {
      const result = await uploadPDF(file);
      onResult(result);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Error uploading file. Check console.");
    }
  };

  return (
    <div
      style={{
        marginBottom: "30px",
        textAlign: "center",
      }}
    >
      {/* User-friendly description */}
      <p
        style={{
          fontSize: "16px",
          color: "#333",
          marginBottom: "20px",
          lineHeight: "1.5",
        }}
      >
        Welcome ! This AI Legal Document Explainer helps you quickly analyze
        your legal PDFs. Simply upload your document to get a{" "}
        <b>clear summary</b>, identify <b>key clauses</b> and{" "}
        <b>potential risks</b>, and <b>ask questions</b> in natural language.
        Our AI provides easy to understand answers, highlights important points,
        and even presents information in lists, paragraphs or tables for better
        clarity.
      </p>

      {/* Buttons container */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        {/* Hidden native file input */}
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />

        {/* Styled label acting as button */}
        <button
          onClick={() => fileInputRef.current.click()}
          style={{
            padding: "10px 25px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {file ? file.name : "Upload your Document..."}
        </button>

        {/* Upload & Process button */}
        <button
          onClick={handleUpload}
          style={{
            padding: "10px 25px",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Upload & Process
        </button>
      </div>
    </div>
  );
}
