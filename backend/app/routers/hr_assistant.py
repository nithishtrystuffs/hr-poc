from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.chatbot import ChatRequest, ChatResponse
from app.services.chatbot.chatbot_service import ChatbotService
from app.services.chatbot.ingestion import IngestionService
from app.models.employee import Conversation, Message


router = APIRouter(
    prefix="/hr-assistant",
    tags=["HR Assistant"]
)


@router.post("/ingest")
def ingest_policies(db: Session = Depends(get_db)):
    """
    Read all policy documents and build the FAISS index.
    """

    service = IngestionService(db)

    result = service.ingest(
        policies_path="policies",
        vector_store_path="storage/faiss"
    )

    return result


@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):

    service = ChatbotService(db)

    return service.chat(
        employee_id=request.employee_id,
        question=request.question,
        conversation_id=request.conversation_id,
    )


@router.get("/history/{conversation_id}")
def get_history(
    conversation_id: str,
    db: Session = Depends(get_db)
):

    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id)
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
        .all()
    )

    return {
        "conversation_id": conversation_id,
        "messages": [
            {
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at,
            }
            for msg in messages
        ],
    }