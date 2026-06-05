from fastapi import FastAPI
from routes.chat import router

app = FastAPI()
app.include_router(router)

@app.get("/test")
async def test():
    return {"status": "ok"}