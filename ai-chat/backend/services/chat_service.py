from ai.openai_client import ask_ai
from services.email_service import send_email
import re


from services.email_service import send_email

async def process_message(message, user):

    message_lower = message.lower()

    # 👉 EMAIL COMMAND DETECTION
    if "send email" in message_lower or "send an email" in message_lower:

        try:
            # Example:
            # "send email to test@gmail.com saying hello bro"

            parts = message.split("saying")

            recipient_part = parts[0]
            message_part = parts[1]

            # Extract email
            words = recipient_part.split()
            recipient_email = None

            for word in words:
                if "@" in word:
                    recipient_email = word
                    break

            if not recipient_email:
                return "I couldn't find the email address."

            email_body = message_part.strip()

            send_email(
                sender=user,
                recipient=recipient_email,
                subject="Message from AI",
                body=email_body
            )

            return f"Email sent to {recipient_email} ✅"

        except Exception as e:
            print("Error:", e)
            return "Failed to send email ❌"

    # 👉 NORMAL AI RESPONSE
    response = ask_ai(message)
    return response



def handle_email_command(message, user):

    if not user:
        return "❌ You must be logged in to send emails."

    try:
        # 🔥 Extract email using regex
        email_match = re.search(r"\S+@\S+\.\S+", message)

        if not email_match:
            return "❌ No email found in message."

        recipient_email = email_match.group()

        # Extract message after "saying"
        parts = message.split("saying")

        if len(parts) < 2:
            return "❌ Please include 'saying' and your message."

        email_body = parts[1].strip()

        send_email(
            sender=user,
            recipient=recipient_email,
            subject="Message from AI Agent",
            body=email_body
        )

        return f"✅ Email sent to {recipient_email}!"

    except Exception as e:
        print("Email error:", e)
        return "❌ Failed to send email."