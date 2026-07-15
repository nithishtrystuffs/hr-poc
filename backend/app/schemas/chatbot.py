from typing import List, Optional
from pydantic import BaseModel


class ChatRequest(BaseModel):
    employee_id: str
    question: str
    conversation_id: Optional[str] = None


class IngestRequest(BaseModel):
    rebuild_index: bool = False


class Source(BaseModel):
    document: str
    chunk_id: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]
    conversation_id: str


class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: str


class ConversationResponse(BaseModel):
    conversation_id: str
    messages: List[MessageResponse]