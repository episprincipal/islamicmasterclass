from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.db.session import get_db

router = APIRouter()


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
