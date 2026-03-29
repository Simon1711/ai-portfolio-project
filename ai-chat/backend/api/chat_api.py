from fastapi import APIRouter
from pydantic import BaseModel
from services.chat_service import process_message
from auth.auth import get_current_user
from fastapi import Depends
from auth.auth import get_current_user

router = APIRouter()

class ChatRequest(BaseModel):
    message: str



@router.post("/chat")
async def chat(req: ChatRequest, user=Depends(get_current_user)):
    reply = await process_message(req.message, user)
    return {"reply": reply}