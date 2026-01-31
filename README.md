# Implementation Plan - Recruitment Insights Web App

## Phase 1: Foundation & Setup
- [ ] **Project Structure**: Initialize `frontend` (React + Vite) and `backend` (FastAPI).
- [ ] **Database Decision**: Confirm MongoDB setup (Atlas vs Local).
- [ ] **Environment**: Setup Python venv and install dependencies (`fastapi`, `pymongo`, `uvicorn`).
- [ ] **Basic Connectivity**: Connect Frontend to Backend to Database.

## Phase 2: Frontend "Wow" Framework
- [ ] **Design System**: Setup Tailwind CSS with "Pastel" palette config.
- [ ] **Animation & Theming**: Install `framer-motion` and `next-themes`.
- [ ] **Layout**: Create the responsive sidebar, animated background blobs, and navigation.
- [ ] **Mockups**: Create static versions of Dashboard, Job Search, and Profile to validate aesthetics.

## Phase 3: Data Pipeline (Backend)
- [ ] **Resume Parsing**: Implement `files` endpoint to accept PDF/DOCX and extract text (`pdfplumber`).
- [ ] **Job Scraping**: Create a modular scraper (e.g., using `Playwright` or `BeautifulSoup`) for checking job boards.
- [ ] **Data Models**: Define Pydantic models for Jobs, Candidates, and Matches.

## Phase 4: Intelligence Layer (ML)
- [ ] **Embeddings**: Integrate `Sentence-BERT` to convert text to vectors.
- [ ] **Matching Logic**: Implement Cosine Similarity search.
- [ ] **Explainability**: Create simple logic to explain scores (e.g., keyword overlap, missing skills).

## Phase 5: Integration & Gamification
- [ ] **Interactive Dashboard**: Connect backend data to the React charts.
- [ ] **Swipe Interface**: Build the "Tinder for Jobs" card stack.
- [ ] **Gamification**: Add badges, points, and confetti triggers.
- [ ] **Final Polish**: Ensure mobile responsiveness and dark mode perfection.


A "Recruiter-Obliterating" end-to-end recruitment system powered by AI, designed to provide data-driven insights with a beautiful, pastel-themed, interactive experience.

## 🚀 Project Goal
Build a system that:
1.  **Scrapes** job boards for postings.
2.  **Parses** resumes (PDF/DOCX).
3.  **Matches** candidates to jobs using **semantic embeddings**.
4.  **Scores** fit quantitatively & explainably.
5.  **Visualizes** data on a stunning web dashboard.

## 🛠 Tech Stack
-   **Frontend**: React (Vite) + Tailwind CSS + Framer Motion (for animations) + Lucide React (icons).
-   **Backend**: FastAPI (Python) - High performance, easy ML integration.
-   **Database**: MongoDB (Stores jobs, resumes, and user data).
-   **ML/AI**:
    -   `Sentence-BERT` for embeddings.
    -   `scikit-learn` for similarity.
    -   `BeautifulSoup/Playwright` for scraping.
    -   `pdfplumber/docx2txt` for parsing.

## 🎨 Design Philosophy
-   **Theme**: Soft Pastel Palette (Pink, Lavender, Mint, Peach) with a Dark/Light mode toggle.
-   **Interactivity**: Highly animated comparisons, swipeable job cards, confetti rewards, and glassmorphism.
-   **UX**: "Recruiter-Obliterating" polish - clean, fast, and delightful.

## 📂 Structure
-   `/frontend`: React Web Application.
-   `/backend`: Python API & ML Workers.
-   `/data`: Local storage for dataset caching (if needed).

## 🏃‍♂️ How to Run

### 0. Prerequisite: MongoDB
*Ensuring MongoDB is installed and running...*

### 1. Backend (Python API)
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
*Runs on http://localhost:8000*
*First time? Run this to populate dummy jobs:*
```bash
curl -X POST http://localhost:8000/seed_jobs
```

### 2. Frontend (React App)
```bash
cd frontend
npm install
npm run dev
```
*Runs on http://localhost:5173*

## 🚧 Status: Phase 3 Complete (Full Stack)
- ✅ **Frontend**: Complete with Animations & Pastel Theme.
- ✅ **Backend**: FastAPI with ML Engine (Sentence-BERT).
- ✅ **Database**: MongoDB (Local) setup.
- ✅ **Intelligence**: Resume Parsing & Semantic Matching implemented.


