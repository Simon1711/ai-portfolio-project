from fastapi import APIRouter
from pydantic import BaseModel
from services.chat_service import process_message

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat(req: ChatRequest):
    reply = await process_message(req.message)
    return {"reply": reply}