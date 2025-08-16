import React, { useState, useRef } from "react";
import { uploadPDF } from "../api";

export default function FileUpload({ onResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
    setUploadedFileName(null); // reset after selecting new file
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file!");
    setLoading(true);

    try {
      const result = await uploadPDF(file);
      onResult(result);
      setUploadedFileName(file.name);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Error uploading file. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "30px", textAlign: "center" }}>
      {/* User-friendly description */}
      <p
        style={{
          fontSize: "16px",
          color: "#333",
          marginBottom: "20px",
          lineHeight: "1.5",
        }}
      >
        Welcome! This AI Legal Document Explainer helps you quickly analyze your
        legal PDFs. Simply upload your document to get a <b>clear summary</b>,
        identify <b>key clauses</b> and <b>potential risks</b>, and{" "}
        <b>ask questions</b>
        in natural language. Our AI provides easy-to-understand answers,
        highlights important points, and presents information in lists,
        paragraphs, or tables for better clarity.
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
          Process
        </button>
      </div>

      {/* Upload progress */}
      {loading && (
        <p style={{ color: "#1976d2", marginTop: "10px" }}>
          Uploading PDF, please wait...
        </p>
      )}

      {/* Uploaded file confirmation */}
      {uploadedFileName && !loading && (
        <p style={{ color: "#4caf50", marginTop: "10px" }}>
          Your PDF <strong>{uploadedFileName}</strong> was processed
          successfully. Now can see <strong>Details</strong> and{" "}
          <strong>chat</strong>.
        </p>
      )}
    </div>
  );
}
