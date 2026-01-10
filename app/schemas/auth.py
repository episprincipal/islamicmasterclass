from pydantic import BaseModel, EmailStr, Field


# =========================
# LOGIN (existing)
# =========================
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginUser(BaseModel):
    user_id: int
    email: EmailStr
    role: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: LoginUser


# =========================
# REGISTER (new)
# =========================
class RegisterRequest(BaseModel):
    first_name: str = Field(min_length=1)
    last_name: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=8)

    phone: str | None = None
    dob: str | None = None         # "YYYY-MM-DD"
    gender: str | None = None      # "male" | "female" | "other" | etc.
    address: str | None = None

    role_name: str | None = None
    role_id: int | None = None


class RegisterUser(BaseModel):
    user_id: int
    email: EmailStr
    role: str


class RegisterResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: RegisterUser
