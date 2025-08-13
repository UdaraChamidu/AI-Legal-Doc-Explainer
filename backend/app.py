from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import fitz
import os
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware


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
    prompt = f"""
    Summarize this legal document in simple, easy-to-understand language.
    Also, extract key clauses and highlight any risks or red flags.
    Document:
    {text}
    """
    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)
    return response.text

def gemini_answer(question, context):
    prompt = f"""
    You are an AI legal assistant. Based on the document below, answer the user's question clearly.
    If not sure, say you are not certain.
    Document:
    {context}

    Question: {question}
    """
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    return response.text

@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    global DOCUMENT_TEXT
    contents = await file.read()
    DOCUMENT_TEXT = extract_text_from_pdf(contents)
    summary_output = gemini_summarize(DOCUMENT_TEXT)

    # Very simple text split — ideally parse JSON from AI
    return {
        "summary": summary_output,
        "highlights": ["Example clause 1", "Example clause 2"],  # Replace with parsed
        "risks": ["Example risk 1", "Example risk 2"]           # Replace with parsed
    }

class QuestionRequest(BaseModel):
    question: str

@app.post("/ask/")
async def ask_question(req: QuestionRequest):
    global DOCUMENT_TEXT
    answer = gemini_answer(req.question, DOCUMENT_TEXT)
    return {"answer": answer}
