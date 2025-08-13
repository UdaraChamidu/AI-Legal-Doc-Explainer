import React, { useState } from "react";
//import { uploadPDF } from "../../../frontend/src/api";
import { uploadPDF } from "../api";  // relative to src/components/

export default function FileUpload({ onResult }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF");
    try {
      const result = await uploadPDF(file);
      onResult(result);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Error uploading file. Check console for details.");
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload}>Upload & Process</button>
    </div>
  );
}
