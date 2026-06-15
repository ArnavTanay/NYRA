from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def classify_emotion(user_message: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": """You are an emotion classifier. 
            Given a message, return exactly one word from this list: 
            Joy, Sadness, Fear, Anger, Loneliness, Numbness. 
            Return nothing else.
            """},
            {"role": "user", "content": user_message}
        ]
    )
    return response.choices[0].message.content.strip().lower()