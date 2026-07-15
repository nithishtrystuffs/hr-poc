class PromptBuilder:

    @staticmethod
    def build(question: str, chunks: list):

        context = "\n\n".join(
            chunk["content"]
            for chunk in chunks
        )

        return f"""
You are the HR Assistant for this company.

Rules:
- Answer ONLY using the provided context.
- Do NOT make up company policies.
- If the answer is not present in the context, reply:
  "I couldn't find that information in the company policy documents."
- Keep answers concise and professional.

Context:
{context}

Question:
{question}

Answer:
"""