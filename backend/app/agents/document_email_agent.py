"""
Drafts the missing-documents request email -- revived from an earlier
version of this project (was removed when document handling was
simplified to presence/absence tracking, now needed again for real
send + reply workflow). Ollama writes the content; falls back to a
plain template if Ollama is unavailable.
"""
from app.ai_client import call_ollama_json, OllamaError

PROMPT_TEMPLATE = """Write a short, polite HR onboarding email to {name}
requesting these missing documents: {missing_docs}. Ask them to reply
directly to this email with the document(s) attached (PDF or image).
Keep it under 100 words, professional but warm tone. Respond ONLY with
JSON in this exact shape:
{{"subject": "<email subject line>", "body": "<email body text>"}}
"""


def _fallback_template(name: str, missing_docs: list[str]) -> dict:
    doc_list = "\n".join(f"- {d}" for d in missing_docs)
    return {
        "subject": "Action Required: Missing Onboarding Documents",
        "body": (
            f"Hi {name},\n\nTo complete your onboarding, we still need the following "
            f"document(s) from you:\n{doc_list}\n\nPlease reply directly to this email "
            f"with the document(s) attached (PDF or image) at your earliest convenience.\n\n"
            f"Thanks,\nHR Team"
        ),
    }


def draft_document_request_email(name: str, missing_docs: list[str]) -> dict:
    try:
        result = call_ollama_json(PROMPT_TEMPLATE.format(name=name, missing_docs=", ".join(missing_docs)))
        if "subject" not in result or "body" not in result:
            raise OllamaError("missing expected keys in model output")
        return result
    except OllamaError:
        return _fallback_template(name, missing_docs)
