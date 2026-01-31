from fastapi import FastAPI, UploadFile, File, HTTPException, Body, Query, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import shutil
import os
import csv
from typing import List, Optional
from bson import ObjectId

from database import resume_collection, job_collection, match_collection, user_collection, check_db_connection
from models import ResumeBase, JobBase, MatchScore, UserCreate, UserLogin
from ml_engine import parse_resume, get_embedding, calculate_similarity, extract_skills_simple

app = FastAPI(
    title="Recruitment Insights API",
    description="Backend for the Recruiter-Obliterating Web App",
    version="1.0.0"
)

# CORS Middleware (Allow Frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all
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
    return {"message": "Recruitment AI is Online 🌸", "docs": "/docs"}

# --- AUTH ENDPOINTS ---

@app.post("/register")
async def register(user: UserCreate):
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user.dict()
    # In a real app, hash password here: user_dict["password"] = pwd_context.hash(user.password)
    new_user = await user_collection.insert_one(user_dict)
    return {"id": str(new_user.inserted_id), "message": "User registered successfully"}

@app.post("/login")
async def login(credentials: UserLogin):
    user = await user_collection.find_one({"email": credentials.email, "password": credentials.password})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "id": str(user["_id"]),
        "full_name": user["full_name"],
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
        # Remove embedding from response to save bandwidth
        job.pop("embedding", None)
        jobs.append(job)
    return jobs

@app.post("/import_csv_jobs")
async def import_csv_jobs(limit: int = 100):
    """Imports jobs from the resume_data.csv file."""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.path.join(base_dir, "resume_data.csv")
    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail=f"CSV file not found at {csv_path}")
    
    count = 0
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if count >= limit:
                break
            
            # Map CSV columns to Job model
            # Based on preview: address, career_objective, experience, education, skills, job_title
            job_data = {
                "title": row.get("job_title", "Unknown Position"),
                "company": "Tech Corp", # Mock company for now
                "location": row.get("address", "Remote"),
                "description": row.get("career_objective", ""),
                "skills_required": extract_skills_simple(row.get("skills", "")),
                "experience_level": row.get("experience", "Not specified"),
                "url": "https://example.com/apply"
            }
            
            # Check if job already exists (very basic check)
            exists = await job_collection.find_one({"title": job_data["title"], "description": job_data["description"]})
            if not exists:
                job_data["embedding"] = get_embedding(job_data["description"])
                await job_collection.insert_one(job_data)
                count += 1
                
    return {"message": f"Successfully imported {count} jobs from CSV!"}

# --- RESUME & MATCHING ---

@app.post("/upload_resume")
async def upload_resume(user_id: str = Form(...), file: UploadFile = File(...)):
    """
    Uploads a resume, parses it, and links it to a user.
    """
    file_path = os.path.join(UPLOAD_DIR, f"{user_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    parsed_text = parse_resume(file_path)
    embedding = get_embedding(parsed_text)
    skills = extract_skills_simple(parsed_text)
    
    resume_data = {
        "user_id": user_id,
        "filename": file.filename,
        "file_path": file_path,
        "parsed_text": parsed_text,
        "extracted_skills": skills,
        "embedding": embedding
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
        
    resume_embedding = resume.get("embedding", [])
    resume_skills = set(resume.get("extracted_skills", []))
    
    matches = []
    async for job in job_collection.find().limit(50): # Limit to 50 matches for performance
        job_embedding = job.get("embedding", [])
        if not job_embedding: continue
        
        semantic_score = calculate_similarity(resume_embedding, job_embedding)
        
        job_skills = set(job.get("skills_required", []))
        skill_score = (len(resume_skills.intersection(job_skills)) / len(job_skills) * 100) if job_skills else 0
            
        final_score = (semantic_score * 0.7) + (skill_score * 0.3)
        
        matches.append({
            "job_id": str(job["_id"]),
            "job_title": job["title"],
            "company": job["company"],
            "match_score": round(final_score, 1),
            "semantic_score": round(semantic_score, 1),
            "skill_match": round(skill_score, 1),
            "missing_skills": list(job_skills - resume_skills),
            "location": job["location"]
        })
        
    matches.sort(key=lambda x: x["match_score"], reverse=True)
    return {"matches": matches[:10]} # Return top 10

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
