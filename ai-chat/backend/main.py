from fastapi import FastAPI
from api.chat_api import router as chat_router
from fastapi.middleware.cors import CORSMiddleware
from api.auth_api import router as auth_router
from api import email_api
from db.base import Base
from db.database import engine
import models

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(email_api.router)
app.include_router(chat_router)

@app.get("/")
def home():
    return {"message": "AI Portfolio backend running"}


app.include_router(auth_router)