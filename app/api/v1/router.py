from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, roles, courses, parent

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(courses.router, prefix="/courses", tags=["Courses"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(parent.router, prefix="/parent", tags=["Parent"])
api_router.include_router(roles.router, tags=["Roles"])
