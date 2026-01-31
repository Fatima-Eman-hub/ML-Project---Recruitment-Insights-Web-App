import re
import pdfplumber
import docx2txt
import os

def clean_text(text: str) -> str:
    """
    Cleans extracted text by removing extra whitespaces and non-essential characters.
    """
    if not text:
        return ""
    # Remove multiple spaces/newlines
    text = re.sub(r'\s+', ' ', text)
    # Basic cleaning but keeping punctuation that might be relevant for skills (e.g., C++)
    text = re.sub(r'[^\w\s@.+#]', '', text) 
    return text.strip()

def parse_resume(file_path: str) -> str:
    """
    Extracts text from PDF or DOCX and cleans it.
    """
    text = ""
    try:
        if file_path.endswith('.pdf'):
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    content = page.extract_text()
                    if content:
                        text += content + " "
        elif file_path.endswith('.docx'):
            text = docx2txt.process(file_path)
        else:
            # Fallback for plain text or other extensions
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()
    except Exception as e:
        print(f"Error parsing file {file_path}: {e}")
        return ""

    return clean_text(text)
