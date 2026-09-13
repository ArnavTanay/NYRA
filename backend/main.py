from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import router

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "healthy", "message": "Backend is running!"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://nyra-045r.onrender.com", "https://nyra-navy.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/test")
async def test():
    return {"status": "ok"}