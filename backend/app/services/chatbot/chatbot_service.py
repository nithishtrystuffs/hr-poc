import os
from sqlalchemy.orm import Session

from app.ai_client import call_ollama_text, OllamaError
from app.models.employee import Conversation, Message
from app.services.chatbot.prompt_builder import PromptBuilder
from app.services.chatbot.retriever import Retriever


class ChatbotService:

    def __init__(self, db: Session):
        self.db = db

        vector_path = os.path.join(
            "storage",
            "faiss"
        )

        self.retriever = Retriever(vector_path)

    def chat(
        self,
        employee_id: str,
        question: str,
        conversation_id: str | None = None,
    ):

        # Create a new conversation if one doesn't exist
        if conversation_id is None:

            conversation = Conversation(
                employee_id=employee_id
            )

            self.db.add(conversation)
            self.db.commit()
            self.db.refresh(conversation)

            conversation_id = conversation.id

        # Save user's question
        self.db.add(
            Message(
                conversation_id=conversation_id,
                role="user",
                content=question,
            )
        )
        self.db.commit()

        # Retrieve relevant policy chunks
        chunks = self.retriever.retrieve(
            question=question,
            top_k=3
        )

        # Build LLM prompt
        prompt = PromptBuilder.build(
            question=question,
            chunks=chunks,
        )

        # Generate answer
        try:
            answer = call_ollama_text(prompt)

        except OllamaError:
            answer = (
                "Sorry, I'm unable to answer your question right now. "
                "Please try again later."
            )

        # Save assistant response
        self.db.add(
            Message(
                conversation_id=conversation_id,
                role="assistant",
                content=answer,
            )
        )
        self.db.commit()

        # Remove duplicate source documents
        unique_sources = []
        seen = set()

        for chunk in chunks:

            document = chunk.get("document")

            if document not in seen:

                seen.add(document)

                unique_sources.append(
                    {
                        "document": document,
                        "chunk_id": chunk.get("chunk_id"),
                    }
                )

        return {
            "conversation_id": conversation_id,
            "answer": answer,
            "sources": unique_sources,
        }