from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_services import get_response
import asyncio

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ConversationRequest(BaseModel):
    messages: list[ChatMessage]

@router.post("/chat")
async def chat(request: ConversationRequest):
    messages = [{"role": m.role, "content": m.content} for m in request.messages]
    response = await asyncio.to_thread(get_response, messages)
    return {"response": response}