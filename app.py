import os
import joblib
import numpy as np
import re
import random
from flask import Flask, render_template, request, jsonify
from tensorflow.keras.models import load_model
from scam_engine import extract_text_from_file, analyze_document

app = Flask(__name__)
offer_history = []


UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load trained model & scaler ONCE
model = load_model("fraud_nn_model.h5")
scaler = joblib.load("scaler.pkl")

# -------------------- ROUTES --------------------

# Home page
@app.route("/")
def index():
    return render_template("index.html")

# Job scam page
@app.route("/job-scam")
def job_scam():
    return render_template("job-scam.html")

# UPI scam page
@app.route("/upi-scam")
def upi_scam():
    return render_template("upi-scam.html")

# Offer scam page
@app.route("/offer-scam")
def offer_scam():
    return render_template("offer-scam.html")

# -------------------- JOB ANALYSIS --------------------

@app.route("/analyze-job", methods=["POST"])
def analyze_job():
    data = request.form
    file = request.files.get("docs")

    score = 0
    reasons = []

    if data.get("payment") == "yes":
        score += 50
        reasons.append("Recruiter asked for money (Major Red Flag)")

    email = data.get("email", "").lower()
    if any(domain in email for domain in ["gmail.com", "yahoo.com", "outlook.com"]):
        score += 20
        reasons.append("Personal email domain used")

    company = data.get("company", "").lower()
    if company in ["abc solution", "xyz tech", "fake company"]:
        score += 10
        reasons.append("Suspicious company name")

    if file:
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(filepath)

        extracted_text = extract_text_from_file(filepath)
        doc_result = analyze_document(extracted_text)

        if doc_result["patterns"]:
            score += 20
            reasons.append("Scam-related keywords found")

        os.remove(filepath)

    score = min(score, 100)

    if score < 10:
        status = "SAFE"
    elif score <= 50:
        status = "SUSPICIOUS"
    else:
        status = "SCAM"

    return jsonify({
        "score": score,
        "status": status,
        "reasons": reasons
    })

# -------------------- UPI PREDICTION --------------------
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    upi_id = data.get('upi_id', '')
    location = data.get('location', 'Unknown')

    amount = float(data.get('amount', 0))
    location_risk = float(data.get('location_risk', 0))
    is_new_upi = int(data.get('is_new_upi', 0))
    is_blacklisted = int(data.get('is_blacklisted', 0))
    night_transaction = int(data.get('night_transaction', 0))

    # Only rule-based logic (disable ML temporarily)
    upi_risk, upi_reasons = analyze_upi_id(upi_id)

    # Simple risk formula
    model_risk = (
        amount / 1000 +
        is_new_upi * 20 +
        is_blacklisted * 40 +
        night_transaction * 15 +
        location_risk
    )

    final_risk = min(100, (model_risk * 0.6) + (upi_risk * 0.4))

    return jsonify({
        "risk": float(final_risk),
        "status": "SCAM" if final_risk > 60 else "SAFE",
        "reasons": upi_reasons,
        "location": location
    })

reported_upi_database = [
    "fraud123@upi",
    "quickloan@paytm",
    "moneyfast@oksbi"
]

def analyze_upi_id(upi_id):
    risk = 0
    reasons = []

    # Format check
    if not re.match(r'^[\w\.-]+@[\w\.-]+$', upi_id):
        risk += 40
        reasons.append("Invalid UPI format")

    # Suspicious keywords
    suspicious_words = ["loan", "fast", "win", "offer", "gift", "cash"]
    if any(word in upi_id.lower() for word in suspicious_words):
        risk += 30
        reasons.append("Suspicious keyword in UPI ID")

    # Reported check
    if upi_id.lower() in reported_upi_database:
        risk += 50
        reasons.append("UPI ID previously reported")

    # Random new account simulation
    if random.random() > 0.7:
        risk += 20
        reasons.append("UPI ID appears newly created")

    risk = min(risk, 100)

    return risk, reasons
@app.route('/predict-offer', methods=['POST'])
def predict_offer():

    data = request.get_json()

    title = data.get("offer_title", "").lower()
    website = data.get("website", "").lower()
    description = data.get("description", "").lower()
    discount = float(data.get("discount", 0))
    asks_otp = int(data.get("asks_otp", 0))
    asks_payment = int(data.get("asks_payment", 0))
    limited_time = int(data.get("limited_time", 0))

    risk = 0
    reasons = []

    # NLP keyword detection
    scam_keywords = [
        "free", "winner", "congratulations",
        "click here", "urgent", "limited offer",
        "claim now", "guaranteed", "100% free"
    ]

    for word in scam_keywords:
        if word in description or word in title:
            risk += 10
            reasons.append(f"Suspicious keyword: {word}")

    if discount > 70:
        risk += 25

    if asks_otp:
        risk += 30

    if asks_payment:
        risk += 40

    if limited_time:
        risk += 20

    if any(domain in website for domain in ["xyz", "cheap", "freeoffer"]):
        risk += 20

    risk = min(risk, 100)

    status = "SAFE" if risk < 30 else "RISK" if risk < 60 else "SCAM"

    offer_history.append({
        "title": title,
        "risk": risk
    })

    return jsonify({
        "risk": risk,
        "status": status,
        "reasons": reasons,
        "history": offer_history[-10:]
    })




if __name__ == "__main__":
    app.run(debug=True)
