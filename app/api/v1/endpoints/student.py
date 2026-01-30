from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.db.session import get_db

router = APIRouter()


@router.get("/courses")
def get_student_courses(student_id: int, db: Session = Depends(get_db)):
    """
    Get all enrolled courses for a student with progress
    Returns course details, progress percentage, and enrollment info
    """
    courses = db.execute(
        text("""
            SELECT 
                c.course_id,
                c.course_name as title,
                c.level,
                c.description,
                e.status,
                e.enrollment_date,
                COALESCE(cp.progress_percent, 0) as progress_percent
            FROM imc.enrollments e
            JOIN imc.courses c ON e.course_id = c.course_id
            LEFT JOIN imc.course_progress cp ON e.user_id = cp.user_id AND e.course_id = cp.course_id
            WHERE e.user_id = :student_id AND e.status = 'active'
            ORDER BY e.enrollment_date DESC
        """),
        {"student_id": student_id},
    ).mappings().all()

    return [
        {
            "id": course["course_id"],
            "title": course["title"],
            "level": course["level"],
            "description": course["description"],
            "status": course["status"],
            "progress": float(course["progress_percent"]),
            "enrolled_at": course["enrollment_date"],
            "category": course["level"],  # Using level as category for now
            "nextLesson": "Continue Learning"  # Placeholder - needs lesson table
        }
        for course in courses
    ]


@router.get("/dashboard")
def get_student_dashboard(student_id: int, db: Session = Depends(get_db)):
    """
    Get student dashboard overview with statistics
    Returns enrolled courses count, progress stats, and goals
    """
    # Get enrollment count
    enrollment_count = db.execute(
        text("""
            SELECT COUNT(*) as count
            FROM imc.enrollments
            WHERE user_id = :student_id AND status = 'active'
        """),
        {"student_id": student_id},
    ).scalar()

    # Get average progress
    avg_progress = db.execute(
        text("""
            SELECT COALESCE(ROUND(AVG(progress_percent)::numeric, 2), 0) as avg
            FROM imc.course_progress
            WHERE user_id = :student_id
        """),
        {"student_id": student_id},
    ).scalar()

    # Get completed courses count
    completed_count = db.execute(
        text("""
            SELECT COUNT(*) as count
            FROM imc.course_progress
            WHERE user_id = :student_id AND progress_percent = 100
        """),
        {"student_id": student_id},
    ).scalar()

    # Get in-progress courses count
    in_progress_count = db.execute(
        text("""
            SELECT COUNT(*) as count
            FROM imc.course_progress
            WHERE user_id = :student_id AND progress_percent > 0 AND progress_percent < 100
        """),
        {"student_id": student_id},
    ).scalar()

    return {
        "enrolledCourses": enrollment_count or 0,
        "completedLessons": 0,  # Placeholder - needs lesson_progress table
        "totalLessons": 0,  # Placeholder - needs lessons table
        "averageProgress": float(avg_progress or 0),
        "completedCourses": completed_count or 0,
        "inProgressCourses": in_progress_count or 0,
        "upcomingQuiz": None,  # Placeholder - needs quiz scheduling
        "weeklyGoal": 5,  # Hardcoded for now
        "weeklyProgress": 0,  # Placeholder - needs activity tracking
        "currentStreak": 0,  # Placeholder - needs activity tracking
    }


@router.get("/chapters/upcoming")
def get_upcoming_chapters(student_id: int, db: Session = Depends(get_db)):
    """
    Get upcoming chapters for the student
    Returns chapters from enrolled courses that are not yet completed
    """
    chapters = db.execute(
        text("""
            SELECT 
                ch.chapter_id,
                ch.title,
                ch.chapter_order,
                c.course_name,
                c.course_id,
                COALESCE(cp.status, 'not_started') as progress_status,
                COALESCE(cp.progress_percent, 0) as progress_percent
            FROM imc.enrollments e
            JOIN imc.courses c ON e.course_id = c.course_id
            JOIN imc.course_chapters ch ON c.course_id = ch.course_id
            LEFT JOIN imc.chapter_progress cp ON ch.chapter_id = cp.chapter_id AND cp.user_id = :student_id
            WHERE e.user_id = :student_id 
                AND e.status = 'active'
                AND COALESCE(cp.status, 'not_started') != 'completed'
            ORDER BY c.course_id, ch.chapter_order
            LIMIT 5
        """),
        {"student_id": student_id},
    ).mappings().all()

    return [
        {
            "id": chapter["chapter_id"],
            "course": chapter["course_name"],
            "title": chapter["title"],
            "chapter_order": chapter["chapter_order"],
            "progress": float(chapter["progress_percent"]),
            "status": chapter["progress_status"],
        }
        for chapter in chapters
    ]
