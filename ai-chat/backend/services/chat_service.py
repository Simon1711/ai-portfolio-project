from ai.openai_client import ask_ai
from services.email_service import send_email

async def process_message(message: str) -> str:

    # 🔹 1. Detect email intent
    if "send email" in message.lower():

        try:
            # 🔹 2. Extract content after colon
            content = message.split(":", 1)[1].strip()

            # 🔹 3. Send email
            send_email(
                "sfeirbadran@gmail.com",
                "Message from AI Assistant",
                content
            )

            return "Email sent successfully ✅"

        except Exception as e:
            print("EMAIL ERROR:", e)
            return "Failed to send email ❌"

    # 🔹 4. Otherwise → normal AI response
    response = await ask_ai(message)
    return response