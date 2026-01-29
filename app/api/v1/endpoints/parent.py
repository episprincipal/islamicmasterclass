from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel

from app.db.session import get_db
from app.auth import create_access_token

router = APIRouter()


class AddChildRequest(BaseModel):
    first_name: str
    last_name: str
    dob: str
    gender: str


@router.post("/children")
def add_child(parent_id: int, payload: AddChildRequest, db: Session = Depends(get_db)):
    """
    Add a child to a parent's account
    Copies address from parent and creates parent-student link
    """
    # Get parent info
    parent = db.execute(
        text("""
            SELECT user_id, address
            FROM imc.users
            WHERE user_id = :parent_id
        """),
        {"parent_id": parent_id},
    ).mappings().first()

    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")

    # Generate a temporary email for the child
    import time
    temp_email = f"student_{parent_id}_{int(time.time())}@imc.local"

    # Create child user with copied address
    child_row = db.execute(
        text("""
            INSERT INTO imc.users (first_name, last_name, email, dob, gender, address)
            VALUES (:first_name, :last_name, :email, :dob, :gender, :address)
            RETURNING user_id
        """),
        {
            "first_name": payload.first_name.strip(),
            "last_name": payload.last_name.strip(),
            "email": temp_email,
            "dob": payload.dob,
            "gender": payload.gender,
            "address": parent.get("address"),
        },
    ).mappings().first()

    child_id = child_row["user_id"]

    # Assign student role
    student_role = db.execute(
        text("""SELECT role_id FROM imc.roles WHERE role_name = 'student' LIMIT 1""")
    ).scalar()

    if not student_role:
        raise HTTPException(status_code=500, detail="Student role not found")

    db.execute(
        text("""
            INSERT INTO imc.user_roles (user_id, role_id)
            VALUES (:uid, :rid)
        """),
        {"uid": child_id, "rid": student_role},
    )

    # Link child to parent
    db.execute(
        text("""
            INSERT INTO imc.parent_student (parent_user_id, student_user_id, relationship_type)
            VALUES (:parent_id, :student_id, :relationship_type)
        """),
        {"parent_id": parent_id, "student_id": child_id, "relationship_type": "parent"},
    )

    db.commit()

    return {
        "id": child_id,
        "first_name": payload.first_name.strip(),
        "last_name": payload.last_name.strip(),
        "name": f"{payload.first_name.strip()} {payload.last_name.strip()}",
        "email": None,
        "course_count": 0,
        "avg_progress": 0,
    }


@router.post("/children/{child_id}/login")
def login_as_child(parent_id: int, child_id: int, db: Session = Depends(get_db)):
    """
    Generate a login token for a child so parent can access their dashboard
    Verifies parent-child relationship before generating token
    """
    # Verify parent-child relationship
    relation = db.execute(
        text("""
            SELECT 1 FROM imc.parent_student
            WHERE parent_user_id = :parent_id AND student_user_id = :child_id
            LIMIT 1
        """),
        {"parent_id": parent_id, "child_id": child_id},
    ).scalar()

    if not relation:
        raise HTTPException(status_code=403, detail="Not authorized - no parent-child relationship found")

    # Get child info
    child = db.execute(
        text("""
            SELECT u.user_id, u.email, u.first_name, u.last_name
            FROM imc.users u
            WHERE u.user_id = :child_id
        """),
        {"child_id": child_id},
    ).mappings().first()

    if not child:
        raise HTTPException(status_code=404, detail="Child not found")

    # Get child's role
    role = db.execute(
        text("""
            SELECT r.role_name
            FROM imc.user_roles ur
            JOIN imc.roles r ON r.role_id = ur.role_id
            WHERE ur.user_id = :uid
            LIMIT 1
        """),
        {"uid": child_id},
    ).scalar() or "student"

    # Create access token for the child
    token = create_access_token(
        subject=str(child["user_id"]),
        extra={"role": role, "email": child["email"]},
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "user_id": child["user_id"],
            "email": child["email"],
            "role": role,
            "first_name": child.get("first_name"),
            "last_name": child.get("last_name"),
        },
    }



@router.get("/children")
def get_parent_children(parent_id: int, db: Session = Depends(get_db)):
    """
    Get all children of a parent
    Returns list of children with basic info and enrollment status
    """
    children = db.execute(
        text("""
            SELECT 
                u.user_id,
                u.email,
                u.first_name,
                u.last_name,
                (SELECT COUNT(*) FROM imc.enrollments e WHERE e.user_id = u.user_id AND e.status = 'active') as course_count,
                (SELECT ROUND(AVG(cp.progress_percent)::numeric, 2) FROM imc.course_progress cp WHERE cp.user_id = u.user_id) as avg_progress
            FROM imc.users u
            JOIN imc.parent_student ps ON u.user_id = ps.student_user_id
            WHERE ps.parent_user_id = :parent_id
            ORDER BY u.first_name, u.last_name
        """),
        {"parent_id": parent_id},
    ).mappings().all()

    return [
        {
            "id": child["user_id"],
            "name": f"{child['first_name']} {child['last_name']}".strip(),
            "email": child["email"],
            "course_count": child["course_count"] or 0,
            "avg_progress": child["avg_progress"] or 0,
        }
        for child in children
    ]


@router.get("/children/{child_id}/courses")
def get_child_courses(parent_id: int, child_id: int, db: Session = Depends(get_db)):
    """
    Get all enrolled courses for a child
    Includes progress, quiz status, and performance metrics
    """
    # Verify parent-child relationship
    relation = db.execute(
        text("""
            SELECT 1 FROM imc.parent_student
            WHERE parent_user_id = :parent_id AND student_user_id = :child_id
            LIMIT 1
        """),
        {"parent_id": parent_id, "child_id": child_id},
    ).scalar()

    if not relation:
        raise HTTPException(status_code=403, detail="Not authorized")

    courses = db.execute(
        text("""
            SELECT 
                e.course_id,
                c.course_name,
                c.level,
                c.description,
                e.status,
                e.enrollment_date,
                COALESCE(cp.progress_percent, 0) as progress_percent
            FROM imc.enrollments e
            JOIN imc.courses c ON e.course_id = c.course_id
            LEFT JOIN imc.course_progress cp ON cp.user_id = e.user_id AND cp.course_id = e.course_id
            WHERE e.user_id = :child_id AND e.status = 'active'
            ORDER BY c.course_id
        """),
        {"child_id": child_id},
    ).mappings().all()

    result = []
    for course in courses:
        result.append(
            {
                "id": course["course_id"],
                "title": course["course_name"],
                "level": course["level"],
                "description": course["description"],
                "status": course["status"],
                "enrolled_at": course["enrollment_date"],
                "progress": float(course["progress_percent"] or 0),
                "quiz": {
                    "correct": 0,
                    "total": 0,
                    "score": 0,
                    "status": "Not Started",
                },
            }
        )

    return result


@router.get("/children/{child_id}/summary")
def get_child_summary(parent_id: int, child_id: int, db: Session = Depends(get_db)):
    """
    Get a summary of a child's performance
    Includes overall progress, assessments, and key metrics
    """
    # Verify parent-child relationship
    relation = db.execute(
        text("""
            SELECT 1 FROM imc.parent_student
            WHERE parent_user_id = :parent_id AND student_user_id = :child_id
            LIMIT 1
        """),
        {"parent_id": parent_id, "child_id": child_id},
    ).scalar()

    if not relation:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Get child info
    child = db.execute(
        text("""
            SELECT user_id, first_name, last_name, email, created_at
            FROM imc.users
            WHERE user_id = :child_id
        """),
        {"child_id": child_id},
    ).mappings().first()

    if not child:
        raise HTTPException(status_code=404, detail="Child not found")

    # Get course stats
    stats = db.execute(
        text("""
            SELECT 
                COUNT(DISTINCT e.course_id) as total_courses,
                ROUND(AVG(cp.progress_percent)::numeric, 2) as avg_progress,
                COUNT(DISTINCT CASE WHEN qat.score >= qat.max_score * 0.7 THEN qat.id END) as quizzes_passed,
                COUNT(DISTINCT qat.id) as total_quizzes
            FROM imc.users u
            LEFT JOIN imc.enrollments e ON u.user_id = e.user_id AND e.status = 'active'
            LEFT JOIN imc.course_progress cp ON u.user_id = cp.user_id
            LEFT JOIN imc.quiz_attempts qat ON u.user_id = qat.user_id
            WHERE u.user_id = :child_id
        """),
        {"child_id": child_id},
    ).mappings().first()

    return {
        "id": child["user_id"],
        "name": f"{child['first_name']} {child['last_name']}".strip(),
        "email": child["email"],
        "joined": child["created_at"],
        "total_courses": stats["total_courses"] or 0,
        "avg_progress": round(stats["avg_progress"] or 0, 2),
        "quizzes_passed": stats["quizzes_passed"] or 0,
        "total_quizzes": stats["total_quizzes"] or 0,
    }
