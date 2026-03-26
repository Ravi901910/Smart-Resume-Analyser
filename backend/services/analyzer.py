"""
Resume Analyzer Service
Extracts structured information, calculates scores, and generates suggestions.
Uses heuristic/rule-based NLP for local analysis without external API keys.
"""
import re
from typing import Optional


# ── Common skill keywords categorized ──────────────────────────────────────────
SKILL_CATEGORIES = {
    "Programming Languages": [
        "python", "java", "javascript", "typescript", "c++", "c#", "go", "rust",
        "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "perl", "dart"
    ],
    "Web Development": [
        "html", "css", "react", "angular", "vue", "nextjs", "next.js", "node.js",
        "nodejs", "express", "django", "flask", "fastapi", "spring", "bootstrap",
        "tailwind", "sass", "jquery", "webpack", "vite"
    ],
    "Data Science & ML": [
        "machine learning", "deep learning", "tensorflow", "pytorch", "keras",
        "scikit-learn", "pandas", "numpy", "matplotlib", "nlp", "computer vision",
        "data analysis", "data science", "statistics", "ai", "neural networks"
    ],
    "Databases": [
        "sql", "mysql", "postgresql", "mongodb", "redis", "firebase", "dynamodb",
        "sqlite", "oracle", "cassandra", "elasticsearch"
    ],
    "Cloud & DevOps": [
        "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins",
        "ci/cd", "linux", "git", "github", "gitlab", "devops", "nginx", "ansible"
    ],
    "Tools & Others": [
        "jira", "agile", "scrum", "figma", "photoshop", "excel", "tableau",
        "power bi", "rest api", "graphql", "microservices", "blockchain"
    ],
}

ALL_SKILLS = []
for category, skills in SKILL_CATEGORIES.items():
    ALL_SKILLS.extend(skills)

# ── ATS keywords ───────────────────────────────────────────────────────────────
ATS_KEYWORDS = [
    "experience", "education", "skills", "projects", "certifications",
    "achievements", "summary", "objective", "references", "work experience",
    "professional experience", "technical skills", "responsibilities",
    "accomplishments", "leadership", "volunteer"
]

ACTION_VERBS = [
    "led", "developed", "managed", "designed", "implemented", "created",
    "built", "achieved", "improved", "increased", "reduced", "delivered",
    "launched", "coordinated", "analyzed", "optimized", "engineered",
    "architected", "mentored", "streamlined", "configured", "automated"
]


def extract_email(text: str) -> Optional[str]:
    match = re.search(r'[\w.+-]+@[\w-]+\.[\w.-]+', text)
    return match.group(0) if match else None


def extract_phone(text: str) -> Optional[str]:
    match = re.search(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}', text)
    return match.group(0).strip() if match else None


def extract_name(text: str) -> str:
    """Attempt to extract name from the first few lines of the resume."""
    lines = text.strip().split('\n')
    for line in lines[:5]:
        line = line.strip()
        # Skip empty lines, emails, phones, URLs
        if not line:
            continue
        if '@' in line or re.search(r'\d{3,}', line) or 'http' in line.lower():
            continue
        if len(line) < 3 or len(line) > 50:
            continue
        # Likely a name if it's mostly letters and short
        if re.match(r'^[A-Za-z\s.\'-]+$', line) and len(line.split()) <= 4:
            return line
    return "Unknown"


def extract_skills(text: str) -> list[dict]:
    """Find skills mentioned in the text and assign estimated proficiency."""
    text_lower = text.lower()
    found_skills = []
    seen = set()

    for skill in ALL_SKILLS:
        # Use word boundary matching for short skills
        if len(skill) <= 2:
            pattern = rf'\b{re.escape(skill)}\b'
            if re.search(pattern, text_lower):
                if skill not in seen:
                    seen.add(skill)
                    count = len(re.findall(pattern, text_lower))
                    proficiency = min(95, 50 + count * 10)
                    found_skills.append({"name": skill.title(), "proficiency": proficiency})
        else:
            if skill in text_lower and skill not in seen:
                seen.add(skill)
                count = text_lower.count(skill)
                proficiency = min(95, 50 + count * 10)
                found_skills.append({"name": skill.title(), "proficiency": proficiency})

    # Sort by proficiency and take top 8
    found_skills.sort(key=lambda x: x["proficiency"], reverse=True)
    return found_skills[:8]


def extract_education(text: str) -> Optional[str]:
    """Extract education information."""
    education_keywords = [
        r"(?:bachelor|master|ph\.?d|b\.?tech|m\.?tech|b\.?sc|m\.?sc|b\.?e|m\.?e|mba|bca|mca|b\.?a|m\.?a)"
        r".*?(?:\n|$)"
    ]
    for pattern in education_keywords:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(0).strip()[:120]
    return None


def extract_experience(text: str) -> Optional[str]:
    """Extract experience summary."""
    exp_match = re.search(r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)', text, re.IGNORECASE)
    if exp_match:
        return f"{exp_match.group(1)}+ years of experience"

    # Try to find job titles
    title_patterns = [
        r"((?:senior|junior|lead|staff|principal)?\s*(?:software|web|full\s*stack|front\s*end|back\s*end|data|ml|devops|cloud|mobile)?\s*(?:engineer|developer|architect|analyst|scientist|manager|designer|intern))",
    ]
    for pattern in title_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(0).strip()
    return None


def extract_location(text: str) -> Optional[str]:
    """Try to extract location from the header area."""
    lines = text.strip().split('\n')[:10]
    for line in lines:
        line = line.strip()
        # Look for common location patterns (City, State / City, Country)
        loc_match = re.search(r'([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z][a-z]+(?:\s[A-Z][a-z]+)*)', line)
        if loc_match:
            return loc_match.group(0)
    return None


def calculate_ats_score(text: str) -> int:
    """Calculate ATS compatibility score based on section headers and formatting."""
    text_lower = text.lower()
    score = 0
    max_points = 100
    found_sections = 0

    # Check for standard sections (40 pts)
    for keyword in ATS_KEYWORDS:
        if keyword in text_lower:
            found_sections += 1
    section_score = min(40, (found_sections / len(ATS_KEYWORDS)) * 80)
    score += section_score

    # Check for contact info (20 pts)
    if extract_email(text):
        score += 10
    if extract_phone(text):
        score += 10

    # Check for action verbs (20 pts)
    verb_count = sum(1 for verb in ACTION_VERBS if verb in text_lower)
    score += min(20, verb_count * 3)

    # Check for quantified achievements (10 pts)
    numbers = re.findall(r'\d+%|\$[\d,]+|\d+\+', text)
    score += min(10, len(numbers) * 2)

    # Length check (10 pts) — ideal 300-1200 words
    word_count = len(text.split())
    if 300 <= word_count <= 1200:
        score += 10
    elif 200 <= word_count <= 1500:
        score += 5

    return min(100, int(score))


def calculate_resume_score(text: str, skills_count: int, ats_score: int) -> int:
    """Calculate an overall resume quality score."""
    score = 0

    # Skills component (25 pts)
    score += min(25, skills_count * 4)

    # ATS component (25 pts)
    score += int(ats_score * 0.25)

    # Content richness (25 pts)
    word_count = len(text.split())
    if word_count > 500:
        score += 15
    elif word_count > 300:
        score += 10
    elif word_count > 100:
        score += 5

    # Formatting (10 pts) — check for bullet points, sections
    if re.search(r'[•\-\*]', text):
        score += 5
    if '\n\n' in text:
        score += 5

    # Education present
    if extract_education(text):
        score += 8

    # Experience present
    if extract_experience(text):
        score += 7

    return min(100, score)


def generate_suggestions(text: str, skills: list, ats_score: int) -> list[dict]:
    """Generate actionable resume improvement suggestions."""
    suggestions = []
    text_lower = text.lower()
    word_count = len(text.split())

    # ── Positive feedback ──
    if len(skills) >= 5:
        suggestions.append({
            "type": "positive",
            "text": f"Great job! Your resume showcases {len(skills)} relevant technical skills, which demonstrates strong expertise."
        })

    if ats_score >= 70:
        suggestions.append({
            "type": "positive",
            "text": f"Your ATS compatibility score is {ats_score}/100 — your resume is well-structured for automated screening systems."
        })

    if extract_email(text) and extract_phone(text):
        suggestions.append({
            "type": "positive",
            "text": "Contact information is clearly visible, making it easy for recruiters to reach you."
        })

    # ── Improvements ──
    verb_count = sum(1 for verb in ACTION_VERBS if verb in text_lower)
    if verb_count < 3:
        suggestions.append({
            "type": "improvement",
            "text": "Use more action verbs (e.g., 'Led', 'Developed', 'Implemented', 'Achieved') to make your experience bullets more impactful."
        })

    numbers = re.findall(r'\d+%|\$[\d,]+|\d+\+', text)
    if len(numbers) < 3:
        suggestions.append({
            "type": "improvement",
            "text": "Add quantifiable achievements (e.g., 'Increased conversion by 25%', 'Managed a team of 8') to demonstrate measurable impact."
        })

    if 'summary' not in text_lower and 'objective' not in text_lower and 'about' not in text_lower:
        suggestions.append({
            "type": "improvement",
            "text": "Consider adding a professional summary or objective at the top of your resume to quickly convey your value proposition."
        })

    if 'project' not in text_lower:
        suggestions.append({
            "type": "improvement",
            "text": "Adding a 'Projects' section can showcase practical experience and problem-solving abilities, especially for students or early-career professionals."
        })

    if 'certification' not in text_lower and 'certified' not in text_lower:
        suggestions.append({
            "type": "improvement",
            "text": "Consider adding relevant certifications (e.g., AWS Certified, Google Cloud, PMP) to boost credibility."
        })

    # ── Warnings ──
    if word_count < 150:
        suggestions.append({
            "type": "warning",
            "text": "Your resume appears too short. Aim for 300-800 words to provide enough detail about your qualifications."
        })
    elif word_count > 1500:
        suggestions.append({
            "type": "warning",
            "text": "Your resume is quite long. Consider condensing it to 1-2 pages for maximum recruiter impact."
        })

    if not extract_email(text):
        suggestions.append({
            "type": "warning",
            "text": "No email address detected. Make sure your contact information is clearly visible at the top."
        })

    if len(skills) < 3:
        suggestions.append({
            "type": "warning",
            "text": "Very few technical skills detected. Make sure to list relevant skills clearly in a dedicated 'Skills' section."
        })

    return suggestions


def analyze_resume(text: str) -> dict:
    """Main analysis function — returns extracted info + AI analysis."""
    # Extract structured info
    name = extract_name(text)
    email = extract_email(text)
    phone = extract_phone(text)
    location = extract_location(text)
    education = extract_education(text)
    experience = extract_experience(text)
    skills = extract_skills(text)
    skill_names = [s["name"] for s in skills]

    # Calculate scores
    ats_score = calculate_ats_score(text)
    resume_score = calculate_resume_score(text, len(skills), ats_score)
    keyword_match = min(100, int((len(skills) / max(len(ALL_SKILLS) * 0.05, 1)) * 100))
    impact_score = min(100, resume_score - 5 + (len(re.findall(r'\d+%|\$[\d,]+', text)) * 8))

    # Generate suggestions
    suggestions = generate_suggestions(text, skills, ats_score)

    return {
        "extracted_info": {
            "name": name,
            "email": email,
            "phone": phone,
            "location": location,
            "education": education,
            "experience": experience,
            "skills": skill_names,
        },
        "analysis": {
            "resume_score": resume_score,
            "ats_score": ats_score,
            "keyword_match": keyword_match,
            "impact_score": impact_score,
            "skills_proficiency": skills,
            "suggestions": suggestions,
        },
    }
