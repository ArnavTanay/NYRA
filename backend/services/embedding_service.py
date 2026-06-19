import requests
import os
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

def get_embedding(text: str) -> list:
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    response = requests.post(
        "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
        headers=headers,
        json={"inputs": text}
    )
    return response.json()