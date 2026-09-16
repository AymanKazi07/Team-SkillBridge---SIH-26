from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import psycopg2
from psycopg2.extras import RealDictCursor
import json

app = FastAPI(title="SkillBridge Backend API")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "user": "postgres",
    "password": "admin123",  # <-- Put your PostgreSQL password here
    "dbname": "postgres"
}

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

# ==================== AUTO-INIT DATABASE TABLES ====================
def init_db():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 1. Users Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password VARCHAR(150) NOT NULL,
                role VARCHAR(50) NOT NULL,
                apaar_id VARCHAR(50),
                domain VARCHAR(50),
                sub_domain VARCHAR(150),
                target_role VARCHAR(150),
                match_score INT DEFAULT 85,
                skills TEXT DEFAULT '',
                projects TEXT DEFAULT '',
                research_papers TEXT DEFAULT '',
                github VARCHAR(255) DEFAULT '',
                level VARCHAR(50) DEFAULT 'Advanced (NHEQF Level 7)',
                abc_credits INT DEFAULT 24,
                institution VARCHAR(255),
                company VARCHAR(255),
                assessment JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # 2. Courses Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS courses (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(150) NOT NULL,
                domain VARCHAR(50) NOT NULL,
                level VARCHAR(50) DEFAULT 'Advanced',
                nep_credits INT DEFAULT 4,
                deadline VARCHAR(50),
                description TEXT,
                quiz JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # 3. Jobs & Internships Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                type VARCHAR(50) NOT NULL,
                company VARCHAR(150) NOT NULL,
                title VARCHAR(255) NOT NULL,
                domain VARCHAR(50) NOT NULL,
                location VARCHAR(150),
                stipend_salary VARCHAR(100),
                duration VARCHAR(50),
                description TEXT,
                skills TEXT,
                requirements TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # Seed Default Users if empty
        cursor.execute("SELECT COUNT(*) FROM users;")
        if cursor.fetchone()[0] == 0:
            cursor.execute("""
                INSERT INTO users (name, email, password, role, apaar_id, domain, sub_domain, target_role, match_score, skills, projects, abc_credits)
                VALUES 
                ('Aaditya Sharma', 'student@demo.com', 'demo123', 'student', '8942-7712-4401', 'ayush', 'Ayurvedic Pharmacognosy', 'Senior Clinical AYUSH Researcher', 88, 'Herb Standardization, Clinical Trials, Pharmacovigilance', 'Ayurvedic Herbal Compound Quality Database', 28),
                ('Prof. (Dr.) V. K. Joshi', 'academic@demo.com', 'demo123', 'academician', NULL, 'ayush', NULL, NULL, 0, 'Dravyaguna, Integrative Medicine', '', 0),
                ('Dabur India R&D Labs', 'industry@demo.com', 'demo123', 'industrialist', NULL, 'ayush', NULL, NULL, 0, 'Phytomedicine R&D, Quality Assurance', '', 0);
            """)

        # Seed Default Courses if empty
        cursor.execute("SELECT COUNT(*) FROM courses;")
        if cursor.fetchone()[0] == 0:
            sample_quiz = json.dumps([
                {"q": "Which statutory body regulates ASU drugs quality in India?", "options": ["PCIM&H", "TRAI", "SEBI"], "answer": 0},
                {"q": "What is the minimum marker content requirement for high-potency Curcumin extracts?", "options": ["95%", "40%", "10%"], "answer": 0}
            ])
            cursor.execute("""
                INSERT INTO courses (title, author, domain, level, nep_credits, deadline, description, quiz)
                VALUES 
                ('Pharmacovigilance & Quality Control in AYUSH Drugs', 'Prof. (Dr.) V. K. Joshi', 'ayush', 'Advanced', 4, '2026-09-30', 'Comprehensive analysis of Ayurvedic formulations, TLC/HPLC methods, and WHO GACP.', %s),
                ('Edge AI & Cloud Telemedicine Architecture', 'Dr. M. S. Swaminathan Tech Cell', 'engineering', 'Intermediate', 3, '2026-10-15', 'Design distributed architectures for remote health monitoring and microservices.', %s);
            """, (sample_quiz, sample_quiz))

        # Seed Default Jobs if empty
        cursor.execute("SELECT COUNT(*) FROM jobs;")
        if cursor.fetchone()[0] == 0:
            cursor.execute("""
                INSERT INTO jobs (type, company, title, domain, location, stipend_salary, duration, description, skills, requirements)
                VALUES 
                ('internship', 'Dabur India R&D Labs', 'Ayush Phytopharmacy Intern', 'ayush', 'New Delhi / Hybrid', '₹30,000 / month', '6 Months', 'Standardize herbal extracts using HPTLC and spectrophotometry.', 'Herb Standardization, HPLC/GC-MS, AYUSH GCP', 'B.Pharm / M.Pharm or relevant background'),
                ('placement', 'Patanjali & Himalaya Health', 'Senior AYUSH Regulatory Associate', 'ayush', 'Haridwar / New Delhi', '₹14.5 LPA', 'Full-time', 'Lead compliance audits and clinical trial documentation.', 'Pharmacovigilance, Standardization, Clinical Trials', 'Post-graduate degree in AYUSH or clinical research');
            """)

        conn.commit()
        cursor.close()
        print("✅ Database tables successfully verified & initialized.")
    except Exception as e:
        print(f"⚠️ [Database Init Error]: {e}")
    finally:
        if conn:
            conn.close()

init_db()

# ==================== REQUEST SCHEMAS ====================
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str
    apaarId: Optional[str] = None
    institution: Optional[str] = None
    company: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str

class ProfileUpdateRequest(BaseModel):
    id: int
    domain: str
    subDomain: str
    targetRole: str
    apaarId: str
    github: Optional[str] = ""
    skills: List[str]
    projects: List[str]
    researchPapers: List[str]
    matchScore: int
    level: str
    assessment: dict

class CourseCreateRequest(BaseModel):
    title: str
    domain: str
    nepCredits: int
    deadline: str
    description: str
    author: str

class JobCreateRequest(BaseModel):
    type: str
    title: str
    domain: str
    location: str
    salary: str
    description: str
    company: str
    skills: Optional[str] = "Core Competencies"
    requirements: Optional[str] = "Verified APAAR Profile"

class AddCreditsRequest(BaseModel):
    studentId: int
    credits: int

# ==================== API ENDPOINTS ====================

@app.post("/api/register")
def register_user(req: RegisterRequest):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("SELECT id FROM users WHERE LOWER(email) = LOWER(%s);", (req.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="An account with this email already exists.")

        cursor.execute("""
            INSERT INTO users (name, email, password, role, apaar_id, institution, company)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id, name, email, role, apaar_id, domain, sub_domain, target_role, match_score, abc_credits;
        """, (req.name, req.email, req.password, req.role, req.apaarId, req.institution, req.company))
        
        user = cursor.fetchone()
        conn.commit()
        return {"success": True, "user": user}
    except HTTPException as he:
        raise he
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.post("/api/login")
def login_user(req: LoginRequest):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("""
            SELECT id, name, email, role, apaar_id, domain, sub_domain, target_role, 
                   match_score, skills, projects, research_papers, github, level, abc_credits, 
                   institution, company, assessment 
            FROM users 
            WHERE LOWER(email) = LOWER(%s) AND password = %s AND role = %s;
        """, (req.email, req.password, req.role))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email, password, or role selected.")
        
        # Parse text lists back to arrays for frontend
        if user.get("skills"):
            user["skills"] = [s.strip() for s in user["skills"].split(",") if s.strip()]
        else:
            user["skills"] = []

        if user.get("projects"):
            user["projects"] = [p.strip() for p in user["projects"].split(",") if p.strip()]
        else:
            user["projects"] = []

        if user.get("research_papers"):
            user["researchPapers"] = [r.strip() for r in user["research_papers"].split(",") if r.strip()]
        else:
            user["researchPapers"] = []

        return {"success": True, "user": user}
    finally:
        cursor.close()
        conn.close()

@app.put("/api/student/profile")
def update_student_profile(req: ProfileUpdateRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        skills_str = ", ".join(req.skills)
        projects_str = ", ".join(req.projects)
        research_str = ", ".join(req.researchPapers)

        cursor.execute("""
            UPDATE users SET 
                domain = %s, sub_domain = %s, target_role = %s, apaar_id = %s,
                github = %s, skills = %s, projects = %s, research_papers = %s,
                match_score = %s, level = %s, assessment = %s
            WHERE id = %s;
        """, (
            req.domain, req.subDomain, req.targetRole, req.apaarId,
            req.github, skills_str, projects_str, research_str,
            req.matchScore, req.level, json.dumps(req.assessment), req.id
        ))
        conn.commit()
        return {"success": True, "message": "Profile updated in PostgreSQL."}
    finally:
        cursor.close()
        conn.close()

@app.get("/api/candidates")
def get_candidates():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("""
            SELECT id, name, domain as department, match_score as readiness_score, 
                   (domain = 'ayush') as ayush_enrolled, skills, target_role, apaar_id
            FROM users 
            WHERE role = 'student';
        """)
        candidates = cursor.fetchall()
        return candidates
    finally:
        cursor.close()
        conn.close()

@app.get("/api/courses")
def get_courses():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("SELECT id, title, author, domain, level, nep_credits as \"nepCredits\", deadline, description, quiz FROM courses ORDER BY id DESC;")
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

@app.post("/api/courses")
def create_course(c: CourseCreateRequest):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        default_quiz = json.dumps([
            {"q": f"Assessment for {c.title}", "options": ["Correct Option", "Alternative Option"], "answer": 0}
        ])
        cursor.execute("""
            INSERT INTO courses (title, domain, nep_credits, deadline, description, author, quiz)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id, title, domain, nep_credits as "nepCredits", deadline, description, author;
        """, (c.title, c.domain, c.nepCredits, c.deadline, c.description, c.author, default_quiz))
        new_course = cursor.fetchone()
        conn.commit()
        return {"success": True, "course": new_course}
    finally:
        cursor.close()
        conn.close()

@app.get("/api/jobs")
def get_jobs():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("SELECT id, type, company, title, domain, location, stipend_salary as stipend, stipend_salary as salary, duration, description, skills, requirements FROM jobs ORDER BY id DESC;")
        jobs = cursor.fetchall()
        for j in jobs:
            if isinstance(j.get("skills"), str):
                j["skills"] = [s.strip() for s in j["skills"].split(",") if s.strip()]
            if isinstance(j.get("requirements"), str):
                j["requirements"] = [r.strip() for r in j["requirements"].split(",") if r.strip()]
        return jobs
    finally:
        cursor.close()
        conn.close()

@app.post("/api/jobs")
def create_job(j: JobCreateRequest):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("""
            INSERT INTO jobs (type, title, domain, location, stipend_salary, description, company, skills, requirements)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, type, title, domain, location, stipend_salary as stipend, stipend_salary as salary, description, company;
        """, (j.type, j.title, j.domain, j.location, j.salary, j.description, j.company, j.skills, j.requirements))
        new_job = cursor.fetchone()
        conn.commit()
        return {"success": True, "job": new_job}
    finally:
        cursor.close()
        conn.close()

@app.delete("/api/jobs/{job_id}")
def delete_job(job_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM jobs WHERE id = %s;", (job_id,))
        conn.commit()
        return {"success": True, "message": "Job deleted"}
    finally:
        cursor.close()
        conn.close()

@app.post("/api/student/credits")
def add_credits(req: AddCreditsRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE users SET abc_credits = abc_credits + %s WHERE id = %s;", (req.credits, req.studentId))
        conn.commit()
        return {"success": True, "message": "Credits updated in PostgreSQL"}
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)