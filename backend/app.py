import os
from fastapi import FastAPI, UploadFile, File
import fitz  # PyMuPDF
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

GEN_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEN_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")
genai.configure(api_key=GEN_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

def extract_text_from_pdf(file_bytes):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    return "".join(page.get_text() for page in doc)

@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    document_text = extract_text_from_pdf(contents)

    prompt_text = (
        "You are a helpful AI that summarizes legal documents in simple, clear language.\n\n"
        "Document Text:\n" + document_text + "\n\nSummary:"
    )

    response = model.generate_content(prompt_text)
    summary = response.text.strip()

    return {"filename": file.filename, "summary": summary}
