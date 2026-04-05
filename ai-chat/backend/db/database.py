from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.user import User   # 👈 make sure you have this model

DATABASE_URL = "postgresql://postgres:Serge1simon2@localhost:5432/ai_portfolio"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# 🔥 ADD THESE FUNCTIONS

def get_user_by_email(email: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        return user
    finally:
        db.close()