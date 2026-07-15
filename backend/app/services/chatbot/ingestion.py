from pathlib import Path

from sqlalchemy.orm import Session

from app.models.employee import PolicyDocument, PolicyChunk
from app.services.chatbot.embeddings import EmbeddingService
from app.services.chatbot.vector_store import VectorStore


class IngestionService:

    def __init__(self, db: Session):
        self.db = db
        self.embedding_service = EmbeddingService()

    def chunk_text(self, text: str, chunk_size: int = 300):
        words = text.split()

        return [
            " ".join(words[i:i + chunk_size])
            for i in range(0, len(words), chunk_size)
        ]

    def ingest(self, policies_path: str, vector_store_path: str):

        # Clear existing policy data (POC approach)
        self.db.query(PolicyChunk).delete()
        self.db.query(PolicyDocument).delete()
        self.db.commit()

        documents = []
        metadata = []

        policy_files = list(Path(policies_path).glob("*.md"))

        if not policy_files:
            return {
                "status": "failed",
                "message": "No policy documents found."
            }

        for file in policy_files:

            content = file.read_text(encoding="utf-8")

            policy = PolicyDocument(
                title=file.stem.replace("-", " ").title(),
                filename=file.name,
            )

            self.db.add(policy)
            self.db.flush()

            chunks = self.chunk_text(content)

            for index, chunk in enumerate(chunks):

                chunk_row = PolicyChunk(
                    document_id=policy.id,
                    content=chunk,
                    chunk_index=str(index),
                )

                self.db.add(chunk_row)
                self.db.flush()

                documents.append(chunk)

                metadata.append(
                    {
                        "document": file.name,
                        "chunk_id": chunk_row.id,
                        "content": chunk,
                    }
                )

        self.db.commit()

        embeddings = self.embedding_service.embed_documents(documents)

# all-MiniLM-L6-v2 produces 384-dimensional embeddings
        vector_store = VectorStore(384)
        vector_store.add(
            embeddings,
            metadata,
        )

        vector_store.save(vector_store_path)

        return {
            "status": "success",
            "documents": len(policy_files),
            "chunks": len(documents),
        }