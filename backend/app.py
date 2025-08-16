from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import fitz
import os
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
import json
import re

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
    """Extract raw text from uploaded PDF file."""
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    return full_text


def safe_json_loads(text: str):
    """
    Try to extract valid JSON from AI response.
    Handles cases where Gemini wraps in ```json ... ``` blocks or adds extra text.
    """
    try:
        # Remove markdown code fences if present
        cleaned = re.sub(r"```(?:json)?", "", text).strip()
        return json.loads(cleaned)
    except Exception:
        return None


def gemini_summarize(text):
    """
    Use Gemini to summarize the legal document into structured JSON.
    """
    prompt = f"""
    You are an AI legal document explainer.
    Carefully read the document and return results ONLY in valid JSON format with this structure:

    {{
      "summary": "Plain English summary of the document",
      "highlights": ["Important clause 1", "Important clause 2"],
      "risks": ["Risk 1", "Risk 2"],
      "confidence": "High/Medium/Low",
      "advice": "If the document is complex, suggest consulting a lawyer"
    }}

    Do not include any text outside of the JSON.
    Use a professional way to give answers like using paragraphs, points, lists, or tables.

    Document:
    {text}
    """

    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)

    parsed = safe_json_loads(response.text)
    if not parsed:
        # fallback if Gemini doesn’t return clean JSON
        parsed = {
            "summary": response.text.strip(),
            "highlights": [],
            "risks": [],
            "confidence": "Unknown",
            "advice": "Consider consulting a lawyer for clarification."
        }
    return parsed

def gemini_answer(question, context):
    """
    Use Gemini to answer user questions based on uploaded document.
    Return structured Markdown for better readability.
    """
    prompt = f"""
    You are an AI legal assistant.
    - Answer the user's question strictly based on the given document.
    - Use paragraphs, bullet points, numbered lists, or tables where appropriate.
    - Be clear, professional, and user-friendly.
    - If uncertain, say "I'm not certain, please consult a lawyer."
    - behave in a user-friendly manner.

    Return ONLY the answer in Markdown format (no JSON, no extra text).

    Document:
    {context}

    Question: {question}
    """

    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)

    # Return raw Markdown string
    return response.text.strip()


@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a legal document PDF and return structured summary, highlights, and risks.
    """
    global DOCUMENT_TEXT
    contents = await file.read()
    DOCUMENT_TEXT = extract_text_from_pdf(contents)
    summary_output = gemini_summarize(DOCUMENT_TEXT)
    return summary_output

class QuestionRequest(BaseModel):
    question: str

@app.post("/ask/")
async def ask_question(req: QuestionRequest):
    """
    Ask a specific question about the uploaded document.
    """
    global DOCUMENT_TEXT
    answer = gemini_answer(req.question, DOCUMENT_TEXT)
    return answer


