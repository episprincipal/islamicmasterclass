import os

DB_NAME = os.getenv("DB_NAME", "imc_db")
DB_USER = os.getenv("DB_USER", "imc_user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "")
DB_PORT = os.getenv("DB_PORT", "5432")

DATABASE_URL = os.getenv("DATABASE_URL", "")


def get_database_url() -> str:
    # Preferred: set DATABASE_URL directly (Cloud Run / Secret Manager)
    if DATABASE_URL:
        return DATABASE_URL

    # Cloud SQL Unix socket
    if DB_HOST.startswith("/cloudsql/"):
        return (
            f"postgresql+pg8000://{DB_USER}:{DB_PASSWORD}@/{DB_NAME}"
            f"?unix_sock={DB_HOST}/.s.PGSQL.5432"
        )
    # Standard TCP
    elif DB_HOST:
        return f"postgresql+pg8000://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

    # No DB configured
    return ""
