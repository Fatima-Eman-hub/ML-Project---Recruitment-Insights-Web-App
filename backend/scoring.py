from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from .feature_extraction import extract_skills, extract_experience_years, get_bert_embeddings, get_tfidf_vectors

def baseline_fit_score(resume_text: str, jd_text: str) -> float:
    """
    Keyword Overlap Baseline (Phase 1).
    Score = (# matched skills / # required skills) * 100
    """
    resume_skills = set(extract_skills(resume_text))
    jd_skills = set(extract_skills(jd_text))
    
    if not jd_skills:
        return 70.0 # Default if no skills detected in JD
        
    overlap = resume_skills.intersection(jd_skills)
    score = (len(overlap) / len(jd_skills)) * 100
    return min(score, 100.0)

def tfidf_fit_score(resume_text: str, jd_text: str) -> float:
    """
    TF-IDF + Cosine Similarity (Phase 1).
    """
    if not resume_text or not jd_text:
        return 0.0
    
    vectors, _ = get_tfidf_vectors([resume_text, jd_text])
    score = cosine_similarity(vectors[0], vectors[1])[0][0]
    return float(score * 100)

def calculate_final_score(resume_text: str, jd_text: str):
    """
    Weighted scoring system with decision intelligence (Phase 4).
    Components:
    - Skill Match (40%)
    - Experience Match (25%)
    - Education Match (15%) - Placeholder logic
    - Semantic Similarity (20%)
    """
    # 1. Skill Match
    resume_skills = set(extract_skills(resume_text))
    jd_skills = set(extract_skills(jd_text))
    overlap = resume_skills.intersection(jd_skills)
    missing = list(jd_skills - resume_skills)
    strengths = list(overlap)
    
    skill_score = (len(overlap) / len(jd_skills)) * 100 if jd_skills else 70.0
    
    # 2. Experience Match
    resume_exp = extract_experience_years(resume_text)
    jd_exp = extract_experience_years(jd_text)
    
    if jd_exp == 0 or resume_exp >= jd_exp:
        exp_score = 100.0
    else:
        exp_score = (resume_exp / jd_exp) * 100
        
    # 3. Education Match (Heuristic: Look for degree keywords if JD mentions them)
    edu_keywords = ["phd", "master", "bachelor", "degree", "mba", "bsc", "msc"]
    jd_edu = [k for k in edu_keywords if k in jd_text.lower()]
    resume_edu = [k for k in edu_keywords if k in resume_text.lower()]
    
    if not jd_edu:
        edu_score = 100.0
    else:
        match_count = len(set(jd_edu).intersection(resume_edu))
        edu_score = 100.0 if match_count > 0 else 50.0 # Partial credit for related context

    # 4. Semantic Similarity (BERT)
    res_emb = get_bert_embeddings(resume_text).reshape(1, -1)
    jd_emb = get_bert_embeddings(jd_text).reshape(1, -1)
    semantic_score = float(cosine_similarity(res_emb, jd_emb)[0][0] * 100)
    
    # Weighted calculation
    final_score = (
        0.40 * skill_score +
        0.25 * exp_score +
        0.15 * edu_score +
        0.20 * semantic_score
    )
    
    return {
        "score": round(final_score, 1),
        "breakdown": {
            "skills": round(skill_score, 1),
            "experience": round(exp_score, 1),
            "education": round(edu_score, 1),
            "semantic": round(semantic_score, 1)
        },
        "details": {
            "strengths": strengths,
            "missing_skills": missing,
            "years_found": resume_exp,
            "years_required": jd_exp
        },
        "suggestions": generate_suggestions(missing, resume_exp, jd_exp)
    }

def generate_suggestions(missing, resume_exp, jd_exp):
    suggestions = []
    if missing:
        top_missing = missing[:3]
        suggestions.append(f"Consider learning or highlighting these skills: {', '.join(top_missing)}.")
    if resume_exp < jd_exp:
        suggestions.append(f"Highlight specific projects to compensate for the {jd_exp - resume_exp} year(s) experience gap.")
    if not suggestions:
        suggestions.append("Your profile is a strong match. Ensure your bullet points are outcome-oriented!")
    return suggestions
