import os
from fastapi import FastAPI, UploadFile, File
import fitz  # PyMuPDF
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()  # Load .env file with GEMINI_API_KEY

app = FastAPI()

# Configure Gemini API key
GEN_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEN_API_KEY)

def extract_text_from_pdf(file_bytes):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    return full_text

@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    document_text = extract_text_from_pdf(contents)

    # Use Gemini to summarize the extracted text
    prompt_text = (
        "You are a helpful AI that summarizes legal documents in simple, clear language.\n\n"
        "Document Text:\n" + document_text + "\n\nSummary:"
    )

    response = genai.generate_text(
        model="models/text-bison-001",
        prompt=prompt_text,
        max_tokens=500,
    )

    summary = response.text.strip()

    return {
        "filename": file.filename,
        "summary": summary
    }
