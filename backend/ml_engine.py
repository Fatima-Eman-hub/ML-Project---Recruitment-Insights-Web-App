from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pdfplumber
import docx2txt
import re

print("⏳ Loading ML Models... (This may take a moment on first run)")
# Load a lightweight but powerful model for semantic similarity
model = SentenceTransformer('all-MiniLM-L6-v2') 
print("✅ ML Models Loaded!")

def get_embedding(text: str) -> list:
    """Generates a vector embedding for the given text."""
    if not text:
        return []
    # Normalize text
    text = text.replace("\n", " ").strip()
    return model.encode(text).tolist()

def calculate_similarity(embedding1: list, embedding2: list) -> float:
    """Calculates cosine similarity between two embeddings (0-100)."""
    if not embedding1 or not embedding2:
        return 0.0
    
    vec1 = np.array(embedding1).reshape(1, -1)
    vec2 = np.array(embedding2).reshape(1, -1)
    
    score = cosine_similarity(vec1, vec2)[0][0]
    return float(score * 100)

def parse_resume(file_path: str) -> str:
    """Extracts text from PDF or DOCX."""
    text = ""
    if file_path.endswith('.pdf'):
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
    elif file_path.endswith('.docx'):
        text = docx2txt.process(file_path)
    
    return clean_text(text)

def clean_text(text: str) -> str:
    """Cleans extracted text."""
    # Remove special characters, multiple spaces, etc.
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s@.]', '', text) # Keep text, spaces, emails, dots
    return text.strip()

def extract_skills_simple(text: str) -> list:
    """
    A simple rule-based skill extractor. 
    In a real production app, we would use a Named Entity Recognition (NER) model here.
    """
    common_skills = {
        "python", "java", "c++", "javascript", "react", "node", "sql", "nosql",
        "mongodb", "aws", "docker", "kubernetes", "tensorflow", "pytorch", 
        "scikit-learn", "pandas", "numpy", "html", "css", "git", "linux",
        "agile", "scrum", "machine learning", "deep learning", "nlp", "fastapi"
    }
    
    found_skills = []
    text_lower = text.lower()
    for skill in common_skills:
        # Regex to find whole words only
        if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
            found_skills.append(skill)
            
    return found_skills
