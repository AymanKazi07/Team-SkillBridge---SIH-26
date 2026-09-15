from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    "host": "localhost",      # <-- MUST be localhost (NOT "root")
    "port": 5432,
    "user": "postgres",          # Change to "postgres" if you didn't create an "admin" user
    "password": "sk26db",     # Your database password
    "dbname": "postgres"       # Database name
}

@app.get("/api/candidates")
def get_candidates():
    conn = None
    cursor = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute(
            "SELECT id, name, department, readiness_score, ayush_enrolled FROM candidates;"
        )
        candidates = cursor.fetchall()
        return candidates

    except Exception as e:
        # This will show the EXACT reason directly in the browser!
        print(f"\n[ERROR OCCURRED]: {e}\n")
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()