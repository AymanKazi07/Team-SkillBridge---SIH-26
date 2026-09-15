from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, String, JSON
from sqlalchemy.orm import declarative_base, sessionmaker

# Amazon RDS Connection String format:
# dialect+driver://username:password@rds-endpoint:port/database_name

# Example for MySQL:
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://admin:YourPassword123@skillbridge-db.c123456789.us-east-1.rds.amazonaws.com:3306/skillbridge"

# Example for PostgreSQL:
# SQLALCHEMY_DATABASE_URL = "postgresql://admin:YourPassword123@skillbridge-db.c123456789.us-east-1.rds.amazonaws.com:5432/skillbridge"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class UserDB(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    domain = Column(String(50))
    skills = Column(JSON)
    projects = Column(JSON)

# Automatically creates tables in your Amazon RDS instance on startup
Base.metadata.create_all(bind=engine)

class EvaluateRequest(BaseModel):
    name: str
    domain: str
    skills: List[str]
    projects: List[str]