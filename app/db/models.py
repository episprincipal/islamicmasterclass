from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Integer, DateTime, Numeric
from sqlalchemy import func

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "imc"} 

    user_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

# --- Course model ---
from sqlalchemy import Boolean, BigInteger, Text

class Course(Base):
    __tablename__ = "courses"
    __table_args__ = {"schema": "imc"}

    course_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    course_name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String, nullable=True)

    # Numeric is safest for money values in Postgres
    price: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)

    level: Mapped[str | None] = mapped_column(String(50), nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")

    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    
