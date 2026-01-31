# 🌸 recruit.ai - AI-Powered Recruitment Insights

[![GitHub License](https://img.shields.io/github/license/Fatima-Eman-hub/ML-Project---Recruitment-Insights-Web-App?style=flat-square&color=ffb7b2)](https://github.com/Fatima-Eman-hub/ML-Project---Recruitment-Insights-Web-App/blob/main/LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-b5ead7?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React-b2e2f2?style=flat-square&logo=react)](https://react.dev)
[![ML](https://img.shields.io/badge/ML-Sentence--BERT-e2cfea?style=flat-square)](https://www.sbert.net)

**recruit.ai** is a "Recruiter-Obliterating" end-to-end recruitment system designed to bridge the gap between candidate resumes and job requirements using state-of-the-art Natural Language Processing (NLP). It features a stunning pastel-themed UI, interactive data visualizations, and a gamified "swipe-to-match" experience.

---

## ✨ Key Features

-   **🧠 Semantic Matching Engine**: Uses `Sentence-BERT` to understand the *context* of a resume, not just keywords.
-   **🔥 Tinder-Style Job Board**: Swipe right to apply and left to pass on AI-curated job matches.
-   **📊 Insightful Dashboard**: Interactive radar charts for skill gap analysis and area charts for application tracking.
-   **📄 Smart Parser**: Extracts skills and experience directly from PDF and DOCX resumes.
-   **🎨 Premium UI/UX**: Built with Framer Motion, Tailwind CSS, and a soft pastel design system (Glassmorphism).
-   **📈 Gamified Experience**: Earn "Recruitment Points" and unlock badges as you progress in your job search.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Gamification**: Canvas-Confetti

### Backend
- **API**: FastAPI (Python)
- **Database**: MongoDB (Motor for Async)
- **ML Engine**: 
    - `Sentence-Transformers` (MiniLM-L6) for embeddings.
    - `Scikit-learn` for Cosine Similarity.
    - `pdfplumber` / `docx2txt` for parsing.

---

## 🚀 How It Works (Internal Logic)

1.  **Parsing Phase**: When a user uploads a resume, the system extracts raw text and uses a rule-based engine to verify skills.
2.  **Embedding Phase**: The text is passed through the `all-MiniLM-L6-v2` transformer model to generate a 384-dimensional vector representing the candidate's profile.
3.  **Matching Algorithm**:
    -   **Semantic Score (70%)**: Measures the "distance" between candidate intent and job description.
    -   **Skill Score (30%)**: Measures the hard-count overlap of verified technical skills.
4.  **Visualization**: Results are pushed to the frontend where the Radar Chart physically adjusts its shape based on the candidate's strengths.

---

## 🏃‍♂️ Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB running locally (default: `mongodb://localhost:27017`)

### 1. Setup Backend
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate 
# Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Initialize Data
Once the server is running, you can seed the real jobs from the CSV dataset by calling:
`POST http://localhost:8000/import_csv_jobs?limit=50`

---

## 📸 Preview

*(Add screenshots here after deploying or running locally)*

- **Dashboard**: Skill gap visualization.
- **Swipe Board**: The interactive matching interface.
- **Profile**: Resume analysis and skill detection.

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

---
**Created with 💖 by Fatima Eman**
