from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.db.models import User
from app.schemas.user import UserOut

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/{user_id}", response_model=UserOut)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("", response_model=UserOut)
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    stmt = select(User).where(User.email == email)
    user = db.execute(stmt).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
