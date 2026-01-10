from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import get_db

router = APIRouter()

@router.get("/roles")
def list_roles(db: Session = Depends(get_db)):
    rows = db.execute(
        text("""
            SELECT role_id, role_name
            FROM imc.roles
            ORDER BY role_id ASC
        """)
    ).mappings().all()

    return [dict(r) for r in rows]
