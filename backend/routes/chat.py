from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_services import get_response
import asyncio

from services.embedding_service import get_embedding
from services.memory_service import save_memory, retrieve_memories

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ConversationRequest(BaseModel):
    messages: list[ChatMessage]
    user_id: str

@router.post("/chat")
async def chat(request: ConversationRequest):
    messages = [{"role": m.role, "content": m.content} for m in request.messages]
    last_message = messages[-1]["content"]
    query_embedding = get_embedding(last_message)

    retrieved = await retrieve_memories(request.user_id, query_embedding)

    memory_text = "\n".join([f"Memory: {m['content']}" for m in retrieved])

    response = await asyncio.to_thread(get_response, messages, memory_text)
    chunk = f"User: {last_message} | NYRA: {response}"
    chunk_embed = get_embedding(chunk)
    await save_memory(request.user_id, chunk, chunk_embed)
    return {"response": response}

