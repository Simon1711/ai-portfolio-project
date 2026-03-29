from fastapi import APIRouter, Depends
from pydantic import BaseModel
from auth.auth import get_current_user
from services.email_service import send_email
from fastapi import HTTPException


router = APIRouter()


class EmailRequest(BaseModel):
    to: str
    message: str


@router.post("/send-email")
def send_email_endpoint(req: EmailRequest, user=Depends(get_current_user)):

    success = send_email(
        sender=user,
        recipient=req.to,
        subject="Message from AI Portfolio",
        body=req.message
    )

    if not success:
        raise HTTPException(status_code=500, detail="Email failed")

    return {"message": "Email sent successfully"}