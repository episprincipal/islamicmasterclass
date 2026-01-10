from fastapi import APIRouter

router = APIRouter()

@router.get("/hello", tags=["demo"])
def hello():
    return {"message": "Hello from FastAPI"}
