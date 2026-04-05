from fastapi import APIRouter
from pydantic import BaseModel
from services.chat_service import process_message
from auth.auth import get_current_user
from fastapi import Depends
from auth.auth import get_current_user
from fastapi import Request


router = APIRouter()

class ChatRequest(BaseModel):
    message: str



@router.post("/chat")
async def chat(req: ChatRequest, request: Request):
    
    token = request.headers.get("authorization")
    user = None

    if token:
        try:
            user = get_current_user(token.split(" ")[1])
        except:
            user = None

    reply = await process_message(req.message, user)
    return {"reply": reply}