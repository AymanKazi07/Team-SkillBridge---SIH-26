from pydantic import BaseModel
from typing import List

class EvaluateRequest(BaseModel):
    skills: List[str]
    projects: List[str]