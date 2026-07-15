from app.services.chatbot.embeddings import EmbeddingService
from app.services.chatbot.vector_store import VectorStore


class Retriever:

    def __init__(self, vector_store_path: str):
        self.embedding_service = EmbeddingService()

        # MiniLM produces 384-dimensional embeddings
        self.vector_store = VectorStore(384)
        self.vector_store.load(vector_store_path)

    def retrieve(self, question: str, top_k: int = 3):

        embedding = self.embedding_service.embed_text(question)

        results = self.vector_store.search(
            embedding,
            top_k=top_k
        )

        return results