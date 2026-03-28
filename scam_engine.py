import pytesseract
from PIL import Image
import pdfplumber
import re
from flask import jsonify


SCAM_KEYWORDS = [
    "registration fee",
    "processing fee",
    "security deposit",
    "immediate joining",
    "urgent hiring",
    "limited slots",
    "pay to proceed",
    "training fee",
    "no interview",
    "direct offer",
    "whatsapp only",
    "upi",
    "refundable",
    "reinforcement"
]

def extract_text_from_file(filepath):
    text = ""

    if filepath.lower().endswith(".pdf"):
        try:
            with pdfplumber.open(filepath) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text
        except Exception as e:
            print("PDF ERROR:", e)

    else:
        try:
            img = Image.open(filepath)
            text = pytesseract.image_to_string(img)
        except Exception as e:
            print("IMAGE OCR ERROR:", e)

    return text.lower()


def analyze_document(text):
    found = []

    for word in SCAM_KEYWORDS:
        if word in text:
            found.append(word)

    score = min(len(found) * 15, 60)

    return {
        "doc_score": score,
        "patterns": found
    }

