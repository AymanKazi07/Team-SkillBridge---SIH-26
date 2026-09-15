from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from sqlalchemy import text
from sqlalchemy.orm import Session

from ai_engine import evaluate_submission
from models import (
    EvaluateRequest,
    EvaluateResponse,
    SessionLocal,
    UserDB,
    UserResponse,
    init_db,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on application startup
    init_db()
    yield


app = FastAPI(
    title="SkillBridge API",
    description="Backend API for SkillBridge NEP 2020 student assessment and portfolio management.",
    version="1.0.0",
    lifespan=lifespan,
)

# Allows the frontend HTML/JS client to communicate with this backend cleanly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency to open and close the database session safely
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/", tags=["Health"])
def read_root():
    return {
        "status": "SkillBridge Backend is Operational",
        "service": "SkillBridge API",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connectivity failure: {str(e)}",
        )

    return {
        "status": "healthy",
        "database": db_status,
    }


@app.post(
    "/api/assess",
    response_model=EvaluateResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Assessment"],
)
def run_assessment(payload: EvaluateRequest, db: Session = Depends(get_db)):
    # 1. Run the AI evaluation engine
    ai_result = evaluate_submission(
        domain=payload.domain,
        skills=payload.skills,
        projects=payload.projects,
        research=payload.research,
        github=payload.github,
    )

    # 2. Create database record
    new_user = UserDB(
        name=payload.name,
        domain=payload.domain,
        sub_domain=payload.sub_domain,
        apaar_id=payload.apaar_id,
        skills=payload.skills,
        projects=payload.projects,
        research=payload.research,
        github=payload.github,
        score=ai_result.get("score"),
        level=ai_result.get("level"),
    )

    # 3. Save to database safely
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to persist assessment data: {str(e)}",
        )

    return EvaluateResponse(
        db_id=new_user.id,
        name=new_user.name,
        domain=new_user.domain,
        assessment=ai_result,
    )


@app.get(
    "/api/users",
    response_model=List[UserResponse],
    tags=["Users"],
)
def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    users = db.query(UserDB).offset(skip).limit(limit).all()
    return users


@app.get(
    "/api/users/{user_id}",
    response_model=UserResponse,
    tags=["Users"],
)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found",
        )
    return user


@app.delete(
    "/api/users/{user_id}",
    status_code=status.HTTP_200_OK,
    tags=["Users"],
)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found",
        )
    try:
        db.delete(user)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete user: {str(e)}",
        )
    return {"message": f"User {user_id} deleted successfully"}


handler = Mangum(app)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)