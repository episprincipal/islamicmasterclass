from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional

from app.db.session import get_db
from app.db.models import Course
from app.schemas.course import CourseOut, CourseCreate, CourseUpdate

router = APIRouter()


@router.get("")
def list_courses(
    db: Session = Depends(get_db),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    active_only: bool = False,
    search: Optional[str] = None,
):
    q = db.query(Course)

    if active_only:
        q = q.filter(Course.is_active.is_(True))

    if search:
        like = f"%{search.strip()}%"
        q = q.filter(Course.course_name.ilike(like))

    courses = q.order_by(Course.course_id.desc()).offset(offset).limit(limit).all()
    
    # Fetch actual chapter counts for all courses
    course_ids = [c.course_id for c in courses]
    chapter_counts = {}
    
    if course_ids:
        result = db.execute(text("""
            SELECT course_id, COUNT(*) as chapter_count
            FROM imc.course_chapters
            WHERE course_id = ANY(:course_ids)
            GROUP BY course_id
        """), {"course_ids": course_ids})
        
        for row in result:
            chapter_counts[row[0]] = row[1]
    
    # Convert to output format and inject actual chapter count
    output = []
    for c in courses:
        course_dict = CourseOut.model_validate(c).model_dump(by_alias=True)
        # Override lessons_count with actual chapter count
        course_dict['lessons'] = chapter_counts.get(c.course_id, 0)
        output.append(course_dict)
    
    return output


@router.get("/{course_id}")
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Get actual chapter count
    chapter_count = db.execute(text("""
        SELECT COUNT(*) 
        FROM imc.course_chapters 
        WHERE course_id = :course_id
    """), {"course_id": course_id}).scalar() or 0
    
    course_dict = CourseOut.model_validate(course).model_dump(by_alias=True)
    course_dict['lessons'] = chapter_count
    
    return course_dict


@router.post("", status_code=status.HTTP_201_CREATED)
def create_course(payload: CourseCreate, db: Session = Depends(get_db)):
    course = Course(
        course_name=payload.course_name,
        description=payload.description,
        price=payload.price,
        level=payload.level,
        category=payload.category,
        min_age=payload.min_age,
        age_max=payload.age_max,
        is_active=payload.is_active,
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return CourseOut.model_validate(course).model_dump(by_alias=True)


@router.put("/{course_id}")
def update_course(course_id: int, payload: CourseUpdate, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(course, k, v)

    db.commit()
    db.refresh(course)
    return CourseOut.model_validate(course).model_dump(by_alias=True)


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    db.delete(course)
    db.commit()
    return None
