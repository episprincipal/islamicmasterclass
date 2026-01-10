import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any

from jose import jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

JWT_SECRET = os.getenv("JWT_SECRET", "change-me-in-secret-manager")
JWT_ALG = os.getenv("JWT_ALG", "HS256")
JWT_EXPIRE_MIN = int(os.getenv("JWT_EXPIRE_MIN", "120"))

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def get_password_hash(password: str) -> str:
    # alias for register endpoint imports
    return hash_password(password)

def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)

def create_access_token(subject: str, extra: Optional[Dict[str, Any]] = None) -> str:
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=JWT_EXPIRE_MIN)
    payload: Dict[str, Any] = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }
    if extra:
        payload.update(extra)
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)
