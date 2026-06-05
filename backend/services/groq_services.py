from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_response(messages: list) -> str:
    print("Calling Groq API...")
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages
    )
    print("Got response!")
    return response.choices[0].message.content