from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.db.models import Course
from app.schemas.course import CourseOut, CourseCreate, CourseUpdate

router = APIRouter()


@router.get("", response_model=List[CourseOut])
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

    return q.order_by(Course.course_id.desc()).offset(offset).limit(limit).all()


@router.get("/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.post("", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(payload: CourseCreate, db: Session = Depends(get_db)):
    course = Course(
        course_name=payload.course_name,
        description=payload.description,
        price=payload.price,
        level=payload.level,
        is_active=payload.is_active,
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.put("/{course_id}", response_model=CourseOut)
def update_course(course_id: int, payload: CourseUpdate, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(course, k, v)

    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    db.delete(course)
    db.commit()
    return None
