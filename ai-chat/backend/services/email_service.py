import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv
from email.mime.text import MIMEText

load_dotenv()


def send_email(sender, recipient, subject, body):
    try:
        EMAIL = os.getenv("EMAIL_ADDRESS")
        PASSWORD = os.getenv("EMAIL_PASSWORD")

        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = EMAIL
        msg["To"] = recipient

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL, PASSWORD)
            server.send_message(msg)

        print("✅ Email sent successfully")
        return True

    except Exception as e:
        print("❌ Email error:", e)
        return False