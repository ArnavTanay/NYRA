import os

from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

async def save_memory(user_id, content, embedding):
    try:
        supabase.table("memories").insert({"user_id": user_id, "content" : content, "embedding": embedding}).execute()
        print("Memory saved successfully")
    except Exception as e:
        print(f"Error saving memory: {e}")

async def retrieve_memories(user_id, query_embedding, match_count=5):
    try:
        result = supabase.rpc("match_memories", {"query_embedding": query_embedding, "match_count": match_count, "match_user_id": user_id}).execute()
        return result.data
    except Exception as e:
        print(f"Error retrieving memories: {e}")
        return []

