from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CourseCreate(BaseModel):
    course_name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = None
    level: Optional[str] = Field(default=None, max_length=50)
    is_active: bool = True


class CourseUpdate(BaseModel):
    course_name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = None
    level: Optional[str] = Field(default=None, max_length=50)
    is_active: Optional[bool] = None


class CourseOut(BaseModel):
    course_id: int
    course_name: str
    description: Optional[str] = None
    price: Optional[float] = None
    level: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
