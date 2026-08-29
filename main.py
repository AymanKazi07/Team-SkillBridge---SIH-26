from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from models import EvaluateRequest
from ai_engine import evaluate_submission

app = FastAPI(title="SkillBridge API")

# Allows the frontend HTML to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "SkillBridge Backend is Operational"}

@app.post("/api/assess")
def run_assessment(domain: str, payload: EvaluateRequest):
    return evaluate_submission(domain, payload.skills, payload.projects)

handler = Mangum(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)