import axios from "axios";

const API_BASE = "https://legal-doc-explainer.up.railway.app";
//"http://localhost:8000"; // Change to your backend URL in production

export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post(`${API_BASE}/upload-pdf/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const askQuestion = async (question) => {
  const res = await axios.post(`${API_BASE}/ask/`, { question });
  return res.data;
};
