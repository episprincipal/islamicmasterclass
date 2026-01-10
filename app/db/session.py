from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import get_database_url  # <-- new helper (you must add it)

DATABASE_URL = get_database_url()

if DATABASE_URL:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Print a safe redacted URL
    try:
        safe = DATABASE_URL.split("@")[0] + "@<redacted>"
    except Exception:
        safe = "<redacted>"
    print("DATABASE_URL (safe):", safe)
else:
    engine = None
    SessionLocal = None
    print("DATABASE_URL (safe): <missing>")

def get_db():
    if SessionLocal is None:
        raise RuntimeError(
            "Database is not configured. Set DATABASE_URL (recommended) or DB_* env vars in Cloud Run."
        )
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
