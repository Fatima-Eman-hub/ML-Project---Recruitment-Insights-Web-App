# Recruitech: AI-Driven Recruitment Intelligence System

## Executive Summary
Recruitech is a high-performance, full-stack recruitment platform that utilizes advanced Natural Language Processing (NLP) and Machine Learning (ML) to automate the candidate-to-job matching process. By leveraging semantic embeddings and weighted scoring algorithms, the system provides recruiters and candidates with high-fidelity matching insights, reducing the average time-to-hire and increasing placement accuracy.

---

## 🏗 System Architecture

The application is built on a decoupled architecture, ensuring scalability and maintainability.

### 1. Frontend (Interface Layer)
*   **Framework**: React 19 with Vite for optimized build performance.
*   **State Management**: React Hooks and Context API for synchronized user sessions.
    *   **Data Visualization**: Recharts for real-time skill parity and application analytics.
*   **Design System**: Tailwind CSS with a custom-engineered Pastel-Glassmorphism aesthetic for a premium user experience.
*   **Animations**: Framer Motion for high-fidelity micro-interactions and transitions.

### 2. Backend (Logic & ML Layer)
*   **Engine**: Python-based FastAPI for high-concurrency asynchronous processing.
    *   **Database**: MongoDB (NoSQL) with Motor for non-blocking I/O operations.
*   **ML Integration**:
    *   **Text Representation**: Sentence-BERT (`all-MiniLM-L6-v2`) for generating fixed-dimensional dense vectors from unstructured job and resume data.
    *   **Similarity Computation**: Cosine Similarity via Scikit-learn for high-dimensional vector comparison.
    *   **Parser**: Automated text extraction from complex `PDF` and `DOCX` structures using `pdfplumber` and `docx2txt`.

### 3. Data Layer
*   **Dataset Integration**: Automated ingestion pipeline for large-scale CSV job datasets.
*   **Storage**: Persistent storage of user profiles, resumes, job metadata, and semantic embeddings.

---

## 📈 Technical Implementation

### Semantic Matching Logic
The system computes a composite **Match Score** using the following weighted algorithm:
- **Semantic Vector Similarity (70%)**: Measures the deep contextual alignment between a candidate's career trajectory and the job objective.
- **Skill Overlap Parity (30%)**: A rule-based extraction system that verifies the presence of specific technical keywords and proficiencies.

### Core Endpoints
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/register` | POST | User onboarding and credential encryption. |
| `/upload_resume` | POST | Multi-stage parsing, embedding generation, and skill extraction. |
| `/jobs` | GET | Paginated retrieval with regex-supported keyword and location filtering. |
| `/matches/{id}` | GET | Real-time computation of job matches for a specific resume ID. |
| `/import_csv_jobs` | POST | Bulk data ingestion pipeline from CSV source to MongoDB. |

---

## 🛠 Deployment & Execution Guide

### Infrastructure Requirements
- **Runtime**: Python 3.9+, Node.js 18+
- **Environment**: MongoDB Community Server 7.0+ (Running on default port `27017`)

### Installation Procedure

#### Phase 1: Backend Setup
```powershell
cd backend
python -m venv venv
# Activation
.\venv\Scripts\activate
# Installation
pip install -r requirements.txt
# Execution
python main.py
```

#### Phase 2: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Phase 3: Data Ingestion
To verify the system with the provided dataset (`resume_data.csv`), execute the following administrative trigger:
`http://localhost:8000/import_csv_jobs?limit=50`

---

## 📄 Documentation & Compliance
- **Authentication**: JWT-inspired session persistence via local storage.
- **Data Privacy**: Local parsing and isolated upload directories for document security.
- **License**: Licensed under the MIT Standard.

---

**Developed by Fatima Eman**  
*Lead System Architect & ML Engineer*
