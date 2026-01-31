from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.models import CourseChapter
from app.schemas.chapter import ChapterCreate, ChapterOut
from app.db.session import get_db

router = APIRouter()

@router.post("/", response_model=ChapterOut, status_code=status.HTTP_201_CREATED)
def create_chapter(payload: ChapterCreate, db: Session = Depends(get_db)):
    chapter = CourseChapter(
        course_id=payload.course_id,
        title=payload.title,
        chapter_order=payload.chapter_order
    )
    db.add(chapter)
    db.commit()
    db.refresh(chapter)
    return chapter

@router.get("/course/{course_id}", response_model=list[ChapterOut])
def list_chapters(course_id: int, db: Session = Depends(get_db)):
    chapters = db.scalars(
        select(CourseChapter).where(CourseChapter.course_id == course_id).order_by(CourseChapter.chapter_order)
    ).all()
    return chapters
