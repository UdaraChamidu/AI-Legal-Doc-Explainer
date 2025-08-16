# AI Legal Document Explainer

**AI Legal Document Explainer** is a web application that allows users to upload legal documents (like contracts, lease agreements, or terms & conditions) and get a simplified explanation of the content using AI. It also highlights important clauses, risks, and allows you to ask specific questions about the document.

## Try : https://ai-legal-doc-explainer-two.vercel.app
---

## 🌟 Features

1. **PDF Upload**

   - Upload legal documents in PDF format.
   - Extracts all text from the PDF.

2. **Document Summary**

   - AI-generated plain-English summary of your document.
   - Highlights key clauses and obligations.
   - Flags potential risks or unusual terms (e.g., penalties, auto-renewals, one-sided terms).
   - Confidence level provided along with optional advice for consulting a lawyer.

3. **Ask Questions**

   - Type questions like: _“Can I terminate this contract early?”_
   - AI provides context-based answers derived from your uploaded document.
   - Confidence level included.

4. **Structured Output**
   - All outputs are returned in clean, structured JSON:
     - `summary`
     - `highlights`
     - `risks`
     - `confidence`
     - `advice`

---

## 🛠 Tech Stack

- **Backend:** FastAPI, Python
- **Frontend:** React.js
- **AI:** Google Gemini API
- **PDF Parsing:** PyMuPDF (`fitz`)
- **HTTP Requests:** Axios
- **Environment:** `.env` for API keys

---

## 📁 Project Structure

```
AI-Legal-Doc-Explainer/
│
├─ backend/
│ ├─ app.py 
│ ├─ requirements.txt 
│ └─ .env 
│
├─ frontend/
│ ├─ src/
│ │ ├─ components/
│ │ │ ├─ FileUpload.js
│ │ │ ├─ SummaryView.js
│ │ │ └─ QASection.js
│ │ ├─ api.js # Axios calls to backend
│ │ └─ App.js
│ └─ package.json
│
└─ README.md
```

## How to Run

### frontend

```
cd frontend
npm install axios
npm install
npm start
```

### backend

```
python -m venv env
env\Scripts\activate
GEMINI_API_KEY=your_api_key_here
uvicorn app:app --reload
(uvicorn app:app --reload --port 8000)
```

## 🖥 How to Use

1. Open the frontend app in your browser.
2. Upload a legal PDF document using the file upload section.
3. Wait for the AI to process the document — you will see:
   - Summary
   - Key Clauses
   - Risks / Flags
   - Confidence level & advice

4. Ask questions in the chat section. Example:
   - “Can I terminate this contract early?”
   - “Are there any auto-renewal clauses?”

## ⚙️ Notes & Tips

- The AI uses Google Gemini models to analyze legal documents.
- Ensure your .env API key is valid.
- Supported file type: .pdf only.
- Large PDFs may take a few seconds for processing.
- The AI outputs JSON internally, but the frontend displays it in a user-friendly format.
- If AI is uncertain, it recommends consulting a lawyer.

## 💻 Screenshots

### summary and other parts
<img width="1570" height="846" alt="image" src="https://github.com/user-attachments/assets/46669b0a-a1db-4500-bc5f-57cfd29830b3" />

### chatting part
<img width="1528" height="813" alt="image" src="https://github.com/user-attachments/assets/54aff81a-2249-4dc3-aaa1-67b3c6084fbc" />

## Collabarators
- Ashan Sanjana
- 
- 
