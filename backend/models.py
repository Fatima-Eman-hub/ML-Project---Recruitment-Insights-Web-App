from pydantic import BaseModel, Field, BeforeValidator, ConfigDict
from typing import List, Optional, Dict, Any, Annotated
from datetime import datetime

# Helper for MongoDB ObjectIDs
PyObjectId = Annotated[str, BeforeValidator(str)]

class MongoBaseModel(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "_id": "651a2b3c4d5e6f7g8h9i0j1k"
            }
        }
    )

# --- USER MODELS ---
class UserBase(MongoBaseModel):
    full_name: str
    email: str
    password: str # In a real app, hash this!
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# --- JOB MODELS ---
class JobBase(MongoBaseModel):
    title: str
    company: str
    location: str
    description: str
    skills_required: List[str] = []
    experience_level: Optional[str] = None
    salary_range: Optional[str] = None
    job_board_source: str = "manual"
    url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    embedding: Optional[List[float]] = None 

class JobCreate(BaseModel):
    title: str
    company: str
    location: str
    description: str
    skills_required: List[str] = []

# --- RESUME MODELS ---
class ResumeBase(MongoBaseModel):
    user_id: str
    filename: str
    file_path: str
    parsed_text: str
    extracted_skills: List[str] = []
    experience_years: Optional[float] = 0.0
    education: List[str] = []
    embedding: Optional[List[float]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# --- MATCH MODELS ---
class MatchScore(MongoBaseModel):
    job_id: str
    resume_id: str
    user_id: str
    score: float 
    details: Dict[str, Any] 
    created_at: datetime = Field(default_factory=datetime.utcnow)
