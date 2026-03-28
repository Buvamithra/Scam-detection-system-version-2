# Scam-detection-system-version-2
# 🛡️ Job Scam Detection System (ML + Full Stack)

## 📌 Overview

The **Job Scam Detection System** is a full-stack application that detects fraudulent job postings using a combination of **Machine Learning** and **rule-based filtering**.

It analyzes job descriptions, messages, and documents to identify suspicious patterns such as fake offers, phishing attempts, and scam keywords.

---

## 🚀 Features

* 🔍 Detects spam/fraudulent job postings
* 🤖 Machine Learning-based classification
* 📊 Rule-based keyword filtering
* 📄 PDF & image text extraction using OCR
* 🌐 Full-stack web interface
* 🧠 High accuracy detection (~93%)

---

## 🛠️ Tech Stack

### 👨‍💻 Backend

* Python
* Flask
* SQL (MySQL / PostgreSQL)

### 🤖 Machine Learning

* Scikit-learn
* NLP (TF-IDF / Count Vectorizer)

### 📄 Data Processing

* pytesseract (OCR)
* Pillow (Image Processing)
* pdfplumber (PDF Extraction)

### 🌐 Frontend

* HTML
* CSS
* JavaScript

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/job-scam-detector.git
cd job-scam-detector
```

### 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Install Tesseract OCR

Download and install:
👉 https://github.com/tesseract-ocr/tesseract

Then add path in your code:

```python
pytesseract.pytesseract.tesseract_cmd = r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"
```

---

## ▶️ Run the Application

```bash
python app.py
```

Open in browser:

```
http://127.0.0.1:5000/
```

---

## 📂 Project Structure

```
job-scam-detector/
│
├── static/              # CSS, JS files
├── templates/           # HTML pages
├── analyzer/            # Core ML & detection logic
├── uploads/             # Uploaded files
├── app.py               # Main Flask app
├── requirements.txt     # Dependencies
└── README.md
```

---

## 🧠 How It Works

1. User inputs job description / uploads file
2. Text is extracted (OCR for images/PDFs)
3. Preprocessing (cleaning, tokenization)
4. ML model predicts spam/real
5. Rule-based system checks suspicious keywords
6. Final result displayed to user

---

## 🚨 Spam Indicators Used

* "Work from home"
* "Earn money easily"
* "No experience required"
* "Registration fee"
* "WhatsApp interview"
* "Guaranteed job"

---

## 📈 Future Improvements

* 🔐 User authentication system
* ☁️ Cloud deployment (AWS / Azure)
* 📊 Dashboard with analytics
* 🤖 Deep Learning (BERT model)
* 📱 Mobile app integration

---

## 👤 Author

**Buvamithra Ulagarajan**

---

## ⭐ Support

If you like this project:

* ⭐ Star this repository
* 🍴 Fork and contribute

---

## 📜 License

This project is open-source and available under the MIT License.

