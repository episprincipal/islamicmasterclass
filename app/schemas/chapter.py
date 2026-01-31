from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ChapterCreate(BaseModel):
    course_id: int = Field(...)
    title: str = Field(..., min_length=2, max_length=255)
    chapter_order: int = Field(..., ge=1)

class ChapterOut(BaseModel):
    chapter_id: int
    course_id: int
    title: str
    chapter_order: int
    created_at: datetime
