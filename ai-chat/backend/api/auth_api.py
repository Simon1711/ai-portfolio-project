from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.database import SessionLocal
from auth.auth import hash_password, verify_password, create_access_token

router = APIRouter()


# 🔹 DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔹 Request Models
class UserCreate(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str
    
    
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    # Check if user exists
    existing_user = db.execute(
        text("SELECT * FROM users WHERE email = :email"),
        {"email": user.email}
    ).fetchone()
    print("Existing user:", existing_user)
    
    if existing_user:
        return {"error": "User already exists"}

    hashed_password = hash_password(user.password)

    db.execute(
        text("INSERT INTO users (email, password) VALUES (:email, :password)"),
        {"email": user.email, "password": hashed_password}
    )
    db.commit()

    return {"message": "User registered successfully"}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.execute(
        text("SELECT * FROM users WHERE email = :email"),
        {"email": user.email}
    ).fetchone()

    if not db_user:
        return {"error": "Invalid credentials"}

    if not verify_password(user.password, db_user.password):
        return {"error": "Invalid credentials"}

    token = create_access_token({"sub": user.email})

    # Update last login
    db.execute(
        text("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = :email"),
        {"email": user.email}
    )
    db.commit()

    return {"access_token": token}