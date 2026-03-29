import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

def ask_ai(message: str):

    completion = client.chat.completions.create(
        model="mistralai/ministral-14b-2512",
        messages=[
            {
                "role": "system",
                "content": "You are an assistant for a personal portfolio website. Be concise and friendly."
            },
            {
                "role": "user",
                "content": message
            }
        ]
    )

    return completion.choices[0].message.content