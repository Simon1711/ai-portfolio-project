from fastapi import FastAPI
from api.chat_api import router as chat_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(chat_router)

@app.get("/")
def home():
    return {"message": "AI Portfolio backend running"}