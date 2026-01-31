from fastapi import FastAPI, UploadFile, File, HTTPException, Body, Query, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import shutil
import os
import csv
from typing import List, Optional
from bson import ObjectId

from database import resume_collection, job_collection, match_collection, user_collection, check_db_connection
from models import ResumeBase, JobBase, MatchScore, UserCreate, UserLogin

# New Modular Imports
import preprocessing
import feature_extraction
import scoring

app = FastAPI(
    title="Recruitment Insights API",
    description="AI-Powered Recruitment Agent Backend",
    version="1.1.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.on_event("startup")
async def startup_db_client():
    await check_db_connection()

@app.get("/")
async def root():
    return {"message": "Recruitment AI is Online 🌸", "status": "active"}

# --- AUTH ENDPOINTS ---

@app.post("/register")
async def register(user: UserCreate):
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user.dict()
    new_user = await user_collection.insert_one(user_dict)
    return {"id": str(new_user.inserted_id), "message": "User registered successfully"}

@app.post("/login")
async def login(credentials: UserLogin):
    user = await user_collection.find_one({"email": credentials.email, "password": credentials.password})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "id": str(user["_id"]),
        "full_name": user.get("full_name", "User"),
        "email": user["email"],
        "message": "Login successful"
    }

# --- JOB ENDPOINTS ---

@app.get("/jobs")
async def get_jobs(
    q: Optional[str] = None, 
    location: Optional[str] = None,
    limit: int = 20,
    skip: int = 0
):
    query = {}
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"skills_required": {"$regex": q, "$options": "i"}}
        ]
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    
    cursor = job_collection.find(query).skip(skip).limit(limit)
    jobs = []
    async for job in cursor:
        job["_id"] = str(job["_id"])
        job.pop("embedding", None)
        jobs.append(job)
    return jobs

@app.post("/import_csv_jobs")
async def import_csv_jobs(limit: int = 100):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.path.join(base_dir, "resume_data.csv")
    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail="CSV file not found")
    
    count = 0
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if count >= limit: break
            
            job_data = {
                "title": row.get("job_title", "Unknown Position"),
                "company": "Tech Corp",
                "location": row.get("address", "Remote"),
                "description": row.get("career_objective", ""),
                "skills_required": feature_extraction.extract_skills(row.get("skills", "")),
                "experience_level": row.get("experience", "Not specified"),
                "url": "https://example.com/apply"
            }
            
            exists = await job_collection.find_one({"title": job_data["title"], "description": job_data["description"]})
            if not exists:
                # We save the embedding for faster semantic matching later
                job_data["embedding"] = feature_extraction.get_bert_embeddings(job_data["description"]).tolist()
                await job_collection.insert_one(job_data)
                count += 1
                
    return {"message": f"Successfully imported {count} jobs!"}

# --- RESUME & MATCHING ---

@app.post("/upload_resume")
async def upload_resume(user_id: str = Form("anonymous"), file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, f"{user_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    parsed_text = preprocessing.parse_resume(file_path)
    skills = feature_extraction.extract_skills(parsed_text)
    
    resume_data = {
        "user_id": user_id,
        "filename": file.filename,
        "file_path": file_path,
        "parsed_text": parsed_text,
        "extracted_skills": skills,
        "embedding": feature_extraction.get_bert_embeddings(parsed_text).tolist()
    }
    
    new_resume = await resume_collection.insert_one(resume_data)
    return {
        "id": str(new_resume.inserted_id),
        "filename": file.filename,
        "skills_detected": skills
    }

@app.get("/matches/{resume_id}")
async def find_matches(resume_id: str):
    try:
        resume = await resume_collection.find_one({"_id": ObjectId(resume_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid Resume ID")
        
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    resume_text = resume.get("parsed_text", "")
    
    matches = []
    async for job in job_collection.find().limit(50):
        jd_text = job.get("description", "")
        if not jd_text: continue
        
        # Phase 4: Decision Intelligence Scoring
        analysis = scoring.calculate_final_score(resume_text, jd_text)
        
        matches.append({
            "job_id": str(job["_id"]),
            "job_title": job["title"],
            "company": job["company"],
            "location": job["location"],
            "score": analysis["score"],
            "breakdown": analysis["breakdown"],
            "details": analysis["details"],
            "suggestions": analysis["suggestions"]
        })
        
    matches.sort(key=lambda x: x["score"], reverse=True)
    return {"matches": matches[:10]}

# --- PHASE 1 SPECIFIC TEST ENDPOINTS ---

@app.post("/test_baseline")
async def test_baseline(resume: str = Body(...), jd: str = Body(...)):
    score = scoring.baseline_fit_score(resume, jd)
    return {"score": score, "method": "Keyword Overlap (Baseline)"}

@app.post("/test_tfidf")
async def test_tfidf(resume: str = Body(...), jd: str = Body(...)):
    score = scoring.tfidf_fit_score(resume, jd)
    return {"score": score, "method": "TF-IDF + Cosine"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
