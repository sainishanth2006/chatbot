from pydantic import BaseModel
from typing import List,Optional

class ChatRequest(BaseModel):
    question: str
    session_id: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]

class UploadResponse(BaseModel):
    message: str
    status: str
    chunks_created : int
    session_id: str
