from ai.openai_client import ask_ai
from services.email_service import send_email
from db.database import get_user_by_email  # make sure this exists
import re
import random

# Temporary storage (in-memory)
otp_store = {}
pending_email_requests = {}


# =========================
# 1. Detect email intent
# =========================
def detect_email_intent(message):
    keywords = ["send email", "send an email", "email to", "send message"]
    return any(k in message.lower() for k in keywords)


# =========================
# 2. Extract email + message
# =========================
def extract_email_data(message):
    email_match = re.search(r"\S+@\S+\.\S+", message)

    if not email_match:
        return None, None

    recipient_email = email_match.group()

    # Remove email from message
    cleaned = message.replace(recipient_email, "")

    # Remove keywords
    for word in ["send", "email", "message", "to", "tell"]:
        cleaned = cleaned.replace(word, "")

    email_body = cleaned.strip()

    return recipient_email, email_body


# =========================
# 3. MAIN FUNCTION
# =========================
async def process_message(message, user=None):

    # =========================
    # STEP 1: OTP VERIFICATION
    # =========================
    if user and user in otp_store:

        if message.strip() == otp_store[user]["otp"]:

            data = otp_store[user]

            send_email(
                sender=user,
                recipient=data["email"],
                subject="Message from AI Agent",
                body=f"From user: {user}\n\nMessage:\n{data['message']}"
            )

            del otp_store[user]

            return "✅ Email sent successfully!"

        else:
            return "❌ Incorrect OTP. Please try again."


    # =========================
    # STEP 2: EMAIL INTENT
    # =========================
    if detect_email_intent(message):

        recipient_email, email_body = extract_email_data(message)

        if not recipient_email:
            return "❌ I couldn't find the recipient email."

        if not email_body:
            return "❌ What message do you want to send?"

        # =========================
        # CASE A: USER LOGGED IN
        # =========================
        if user:

            otp = str(random.randint(100000, 999999))

            otp_store[user] = {
                "otp": otp,
                "email": recipient_email,
                "message": email_body
            }

            send_email(
                sender=user,
                recipient=user,
                subject="Your OTP Code",
                body=f"Your verification code is: {otp}"
            )

            return "🔐 I sent you an OTP code. Please enter it to confirm."

        # =========================
        # CASE B: USER NOT LOGGED IN
        # =========================
        else:
            pending_email_requests["guest"] = {
                "email": recipient_email,
                "message": email_body
            }

            return "⚠️ You are not logged in. Please enter your registered email."


    # =========================
    # STEP 3: USER ENTERS EMAIL (GUEST FLOW)
    # =========================
    if "guest" in pending_email_requests and not user:

        email_input = message.strip()

        user_record = get_user_by_email(email_input)

        if not user_record:
            return "❌ This email is not registered. Please sign up first."

        # Generate OTP
        otp = str(random.randint(100000, 999999))

        otp_store[email_input] = {
            "otp": otp,
            "email": pending_email_requests["guest"]["email"],
            "message": pending_email_requests["guest"]["message"]
        }

        send_email(
            sender=email_input,
            recipient=email_input,
            subject="Your OTP Code",
            body=f"Your verification code is: {otp}"
        )

        del pending_email_requests["guest"]

        return "🔐 OTP sent to your email. Please enter it to confirm."


    # =========================
    # STEP 4: OTP FOR GUEST USER
    # =========================
    for stored_user in otp_store:

        if message.strip() == otp_store[stored_user]["otp"]:

            data = otp_store[stored_user]

            send_email(
                sender=stored_user,
                recipient=data["email"],
                subject="Message from AI Agent",
                body=f"From user: {stored_user}\n\nMessage:\n{data['message']}"
            )

            del otp_store[stored_user]

            return "✅ Email sent successfully!"


    # =========================
    # STEP 5: NORMAL AI RESPONSE
    # =========================
    return ask_ai(message)