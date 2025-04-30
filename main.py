from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from ollama import Client
import os

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
client = Client(host=OLLAMA_HOST)

class ChatRequest(BaseModel):
    prompt: str

def query_llama(prompt: str) -> str:
    messages = [
        {"role": "system", "content": "Ти — корисний чат-бот для підтримки психічного здоров'я. Відповідай тільки українською. "},
        {"role": "user", "content": prompt}
    ]
    try:
        response = client.chat(model="llama2", messages=messages)
        if "message" in response and "content" in response["message"]:
            return response["message"]["content"]
    except Exception as e:
        print("[ERROR] Ollama call failed:", e)
    return "На жаль, я не зміг отримати відповідь. Перевірте підключення до моделі."

@app.get("/", response_class=HTMLResponse)
async def get_chat(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/chat", response_class=JSONResponse)
async def chat_api(request: ChatRequest):
    bot_response = query_llama(request.prompt)
    return {"response": bot_response}
