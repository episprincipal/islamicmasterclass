from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, roles
# If you already have these endpoint files under app/api/v1/endpoints/, uncomment:
# from app.api.v1.endpoints import health, users

api_router = APIRouter()

#api_router.include_router(health.router, tags=["Health"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(roles.router, tags=["Roles"])