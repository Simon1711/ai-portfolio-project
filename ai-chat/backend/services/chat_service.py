from ai.openai_client import ask_ai

async def process_message(message: str) -> str:

    # later we can add routing, memory, etc
    response = await ask_ai(message)

    return response