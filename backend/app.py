from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import fitz
import os
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
import json

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store last uploaded text for Q&A
DOCUMENT_TEXT = ""

def extract_text_from_pdf(file_bytes):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    return full_text

def gemini_summarize(text):
    """
    Ask Gemini to return a JSON with summary, highlights, risks, and optional advice.
    """
    prompt = f"""
    You are an AI legal document explainer. 
    Carefully read the document and return results ONLY in valid JSON format with this structure:

    {{
      "summary": "Plain English summary of the document",
      "highlights": ["Important clause 1", "Important clause 2", "..."],
      "risks": ["Risk 1", "Risk 2", "..."],
      "confidence": "High/Medium/Low",
      "advice": "If the document is complex, suggest consulting a lawyer"
    }}

    Document:
    {text}
    """

    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)

    # Try parsing JSON safely
    try:
        data = json.loads(response.text)
    except Exception:
        # fallback in case AI doesn't return clean JSON
        data = {
            "summary": response.text.strip(),
            "highlights": [],
            "risks": [],
            "confidence": "Unknown",
            "advice": "Consider consulting a lawyer for clarification."
        }
    return data

def gemini_answer(question, context):
    """
    Ask Gemini to answer user questions based on uploaded document.
    """
    prompt = f"""
    You are an AI legal assistant. 
    Answer the user's question based strictly on the given document context. 
    Be clear and concise. 
    If uncertain, say "I'm not certain, please consult a lawyer."

    Return JSON only in this format:
    {{
      "answer": "Answer text here",
      "confidence": "High/Medium/Low"
    }}

    Document:
    {context}

    Question: {question}
    """

    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)

    try:
        data = json.loads(response.text)
    except Exception:
        data = {
            "answer": response.text.strip(),
            "confidence": "Unknown"
        }
    return data

@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    global DOCUMENT_TEXT
    contents = await file.read()
    DOCUMENT_TEXT = extract_text_from_pdf(contents)
    summary_output = gemini_summarize(DOCUMENT_TEXT)

    return summary_output

class QuestionRequest(BaseModel):
    question: str

@app.post("/ask/")
async def ask_question(req: QuestionRequest):
    global DOCUMENT_TEXT
    answer = gemini_answer(req.question, DOCUMENT_TEXT)
    return answer
