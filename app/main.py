from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
import os

# Load .env.local before importing config
load_dotenv()

from app.api.v1.router import api_router

app = FastAPI(title="IMC FastAPI Starter", version="0.1.0")

# Add session middleware for OAuth
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("JWT_SECRET", "change-me-in-secret-manager")
)

# CORS origins - support both local dev and production
DEFAULT_LOCAL_ORIGINS = [
    "https://imc-ui-dev-479617-bucket.storage.googleapis.com",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8080",
    "http://localhost:8081",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:8081",
]

# Production UI URL(s) from environment, comma-separated
PRODUCTION_ORIGINS = os.getenv('ALLOWED_ORIGINS', '').split(',')
PRODUCTION_ORIGINS = [url.strip() for url in PRODUCTION_ORIGINS if url.strip()]

# Combine local dev origins with production origins
ALLOWED_ORIGINS = DEFAULT_LOCAL_ORIGINS + PRODUCTION_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"^https://.*\.cloudshell\.dev$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "FastAPI is running 🚀", "docs": "/docs"}
