from fastapi import APIRouter, HTTPException, Depends
from app.schemas.auth import RegisterRequest, RegisterResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.schemas.auth import (
    LoginRequest, LoginResponse,
    RegisterRequest, RegisterResponse
)
from app.auth import verify_password, create_access_token, get_password_hash
from app.db.session import get_db

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.execute(
        text("""
            SELECT user_id, email, password_hash
            FROM imc.users
            WHERE lower(email) = lower(:email)
            LIMIT 1
        """),
        {"email": payload.email},
    ).mappings().first()

    if not user or not user.get("password_hash"):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    role = db.execute(
        text("""
            SELECT r.role_name
            FROM imc.user_roles ur
            JOIN imc.roles r ON r.role_id = ur.role_id
            WHERE ur.user_id = :uid
            LIMIT 1
        """),
        {"uid": user["user_id"]},
    ).scalar() or "student"

    token = create_access_token(
        subject=str(user["user_id"]),
        extra={"role": role, "email": user["email"]},
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"user_id": user["user_id"], "email": user["email"], "role": role},
    }

def _users_table_columns(db: Session) -> set[str]:
    rows = db.execute(
        text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema='imc' AND table_name='users'
        """)
    ).scalars().all()
    return set(rows)


@router.post("/register", response_model=RegisterResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()

    # 1) Duplicate email check
    existing = db.execute(
        text("""
            SELECT user_id
            FROM imc.users
            WHERE lower(email) = lower(:email)
            LIMIT 1
        """),
        {"email": email},
    ).scalar()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered.")

    # 2) Resolve role (prefer role_id else role_name; safe allowlist)
    allowed_roles = {"parent", "student"}
    role_row = None

    if payload.role_id is not None:
        role_row = db.execute(
            text("""SELECT role_id, role_name FROM imc.roles WHERE role_id = :rid LIMIT 1"""),
            {"rid": payload.role_id},
        ).mappings().first()
    else:
        requested = (payload.role_name or "student").strip().lower()
        if requested not in allowed_roles:
            raise HTTPException(status_code=400, detail="role_name must be parent or student.")
        role_row = db.execute(
            text("""SELECT role_id, role_name FROM imc.roles WHERE role_name = :rn LIMIT 1"""),
            {"rn": requested},
        ).mappings().first()

    if not role_row:
        raise HTTPException(status_code=400, detail="Invalid role (not found in roles table).")

    role_id = role_row["role_id"]
    role_name = role_row["role_name"]

    # 3) Insert user using your REAL schema
    full_name = f"{payload.first_name.strip()} {payload.last_name.strip()}".strip()
    pw_hash = get_password_hash(payload.password)

    user_row = db.execute(
        text("""
            INSERT INTO imc.users (full_name, email, phone, dob, gender, address, password_hash)
            VALUES (:full_name, :email, :phone, :dob, :gender, :address, :password_hash)
            RETURNING user_id, email
        """),
        {
            "full_name": full_name,
            "email": email,
            "phone": payload.phone.strip() if payload.phone else None,
            "dob": payload.dob,  # should be "YYYY-MM-DD" from UI
            "gender": payload.gender,
            "address": payload.address.strip() if payload.address else None,
            "password_hash": pw_hash,
        },
    ).mappings().first()

    user_id = user_row["user_id"]

    # 4) Insert into user_roles
    db.execute(
        text("""
            INSERT INTO imc.user_roles (user_id, role_id)
            VALUES (:uid, :rid)
        """),
        {"uid": user_id, "rid": role_id},
    )

    db.commit()

    # 5) Auto-login token
    token = create_access_token(
        subject=str(user_id),
        extra={"role": role_name, "email": email},
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"user_id": user_id, "email": email, "role": role_name},
    }