from fastapi import APIRouter
<<<<<<< Updated upstream
from app.api.v1.endpoints import auth, users, roles, courses, parent, student
=======
from app.api.v1.endpoints import auth, users, roles, courses, admin_course_submit
>>>>>>> Stashed changes

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(courses.router, prefix="/courses", tags=["Courses"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
<<<<<<< Updated upstream
api_router.include_router(parent.router, prefix="/parent", tags=["Parent"])
api_router.include_router(student.router, prefix="/student", tags=["Student"])
api_router.include_router(roles.router, tags=["Roles"])
=======
api_router.include_router(roles.router, tags=["Roles"])
>>>>>>> Stashed changes
