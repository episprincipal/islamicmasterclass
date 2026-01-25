from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CourseCreate(BaseModel):
    course_name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = None
    level: Optional[str] = Field(default=None, max_length=50)
    category: Optional[str] = Field(default=None, max_length=100)
    min_age: Optional[int] = None
    age_max: Optional[int] = None
    is_active: bool = True


class CourseUpdate(BaseModel):
    course_name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = None
    level: Optional[str] = Field(default=None, max_length=50)
    category: Optional[str] = Field(default=None, max_length=100)
    min_age: Optional[int] = None
    age_max: Optional[int] = None
    is_active: Optional[bool] = None


class CourseOut(BaseModel):
    id: int = Field(..., validation_alias="course_id", serialization_alias="id")
    title: str = Field(..., validation_alias="course_name", serialization_alias="title")
    description: Optional[str] = None
    price: Optional[float] = None
    level: Optional[str] = None
    category: Optional[str] = None
    lessons: Optional[int] = Field(default=0, serialization_alias="lessons")
    minAge: Optional[int] = Field(default=None, validation_alias="min_age", serialization_alias="minAge")
    maxAge: Optional[int] = Field(default=None, validation_alias="age_max", serialization_alias="maxAge")
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True, "populate_by_name": True}
