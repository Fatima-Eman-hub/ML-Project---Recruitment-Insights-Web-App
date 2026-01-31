import re
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

# Load a lightweight model for semantic similarity
print("⏳ Loading Transformer Embeddings...")
model = SentenceTransformer('all-MiniLM-L6-v2')

SKILLS_DATABASE = {
    "python", "java", "c++", "c#", "javascript", "typescript", "react", "next.js", 
    "angular", "vue", "node.js", "express", "go", "ruby", "sql", "nosql", "mongodb", 
    "postgresql", "mysql", "aws", "azure", "gcp", "docker", "kubernetes", "tensorflow", 
    "pytorch", "scikit-learn", "pandas", "numpy", "html", "css", "git", "linux", 
    "agile", "scrum", "machine learning", "deep learning", "nlp", "fastapi", "flask", 
    "django", "rest api", "graphql", "devops", "cicd", "microservices", "rust", "swift"
}

def extract_skills(text: str) -> list:
    """
    Extracts skills from text based on a predefined database.
    """
    if not text:
        return []
    text_lower = text.lower()
    found_skills = set()
    for skill in SKILLS_DATABASE:
        # Match whole words or phrase
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.add(skill)
    return list(found_skills)

def extract_experience_years(text: str) -> int:
    """
    Simple heuristic to extract years of experience from text.
    Looks for patterns like "X years of experience" or variations.
    """
    if not text:
        return 0
    # Search for patterns like "5 years", "10+ years", "3 yrs"
    patterns = [
        r'(\d+)\+?\s*year',
        r'(\d+)\+?\s*yr'
    ]
    matches = []
    for pattern in patterns:
        matches.extend(re.findall(pattern, text.lower()))
    
    if not matches:
        return 0
    
    # Convert to int and find max as a heuristic
    try:
        years = [int(m) for m in matches]
        return max(years) if years else 0
    except:
        return 0

def get_bert_embeddings(text: str):
    """
    Generates sentence-BERT embeddings.
    """
    if not text:
        return np.zeros(384) # Default size for MiniLM
    return model.encode(text)

def get_tfidf_vectors(corpus: list):
    """
    Generates TF-IDF vectors for a list of texts.
    """
    vectorizer = TfidfVectorizer(stop_words='english')
    return vectorizer.fit_transform(corpus), vectorizer
