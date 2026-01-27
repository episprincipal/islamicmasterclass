import json
from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.core.security import get_current_user  # adjust
from app.models.course import Course            # adjust: your Course model/table uses course_id, course_name, price, level
from app.models.course_asset import CourseAsset # the new table we discussed
from app.services.storage_gcs import upload_file_to_gcs
from app.utils.youtube import extract_youtube_id  # you can place helper anywhere

router = APIRouter(prefix="/admin/courses", tags=["Admin Courses"])


def require_admin():
    return {"role": "admin", "id": 1}


@router.post("/submit", status_code=status.HTTP_201_CREATED)
async def submit_course(
    request: Request,
    payload: str = Form(...),
    # allow multiple files under arbitrary keys
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    """
    One API does everything:
    - Create course
    - Upload files to GCS (pdf/mp4)
    - Insert course_assets (upload/youtube)
    All inside a DB transaction.
    """

    # ---- 1) Parse JSON payload
    try:
        data = json.loads(payload)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON in payload")

    course_data = data.get("course") or {}
    assets = data.get("assets") or []

    # ---- 2) Basic course validation (align with your ERD: courses(course_name, price, level))
    course_name = (course_data.get("course_name") or "").strip()
    if not course_name:
        raise HTTPException(status_code=400, detail="course.course_name is required")

    price = course_data.get("price")
    level = course_data.get("level")

    # ---- 3) Collect uploaded files by form key
    # This grabs ALL form files regardless of name
    form = await request.form()
    uploaded_files: dict[str, UploadFile] = {}
    for key, value in form.multi_items():
        if isinstance(value, UploadFile):
            uploaded_files[key] = value

    # ---- 4) Begin transaction: create course + assets
    try:
        # Create course
        course = Course(
            course_name=course_name,
            price=price,
            level=level,
        )
        db.add(course)
        db.flush()  # ensures course.course_id available without committing

        # Create assets
        for a in assets:
            asset_kind = (a.get("asset_kind") or "").lower().strip()  # video/pdf
            source_type = (a.get("source_type") or "").lower().strip()  # upload/youtube
            title = a.get("title")
            sort_order = int(a.get("sort_order") or 0)

            if asset_kind not in {"video", "pdf"}:
                raise HTTPException(status_code=400, detail=f"Invalid asset_kind: {asset_kind}")
            if source_type not in {"upload", "youtube"}:
                raise HTTPException(status_code=400, detail=f"Invalid source_type: {source_type}")

            if source_type == "youtube":
                url = (a.get("url") or "").strip()
                yt_id = extract_youtube_id(url)
                if not yt_id:
                    raise HTTPException(status_code=400, detail="Invalid YouTube URL")

                asset = CourseAsset(
                    course_id=course.course_id,
                    asset_kind="video",
                    source_type="youtube",
                    title=title,
                    sort_order=sort_order,
                    url=url,
                    youtube_id=yt_id,
                    created_by=getattr(admin, "user_id", None) or getattr(admin, "id", None),
                )
                db.add(asset)

            else:
                # upload
                file_key = (a.get("file_key") or "").strip()
                if not file_key:
                    raise HTTPException(status_code=400, detail="upload asset missing file_key")

                up = uploaded_files.get(file_key)
                if not up:
                    raise HTTPException(status_code=400, detail=f"Missing file for file_key={file_key}")

                # validate content type
                ctype = (up.content_type or "").lower()
                if asset_kind == "pdf" and ctype != "application/pdf":
                    raise HTTPException(status_code=400, detail=f"{file_key} must be a PDF")
                if asset_kind == "video" and not ctype.startswith("video/"):
                    raise HTTPException(status_code=400, detail=f"{file_key} must be a video file")

                meta = upload_file_to_gcs(
                    course_id=course.course_id,
                    asset_type=asset_kind,
                    filename=up.filename or file_key,
                    fileobj=up.file,
                    content_type=up.content_type or "application/octet-stream",
                )

                asset = CourseAsset(
                    course_id=course.course_id,
                    asset_kind=asset_kind,
                    source_type="upload",
                    title=title,
                    sort_order=sort_order,
                    gcs_bucket=meta["bucket"],
                    gcs_object=meta["object_name"],
                    file_url=meta["public_url"],
                    mime_type=meta["content_type"],
                    size_bytes=meta["size"],
                    created_by=getattr(admin, "user_id", None) or getattr(admin, "id", None),
                )
                db.add(asset)

        db.commit()
        return {
            "course_id": course.course_id,
            "message": "Course submitted successfully",
        }

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Submit failed: {str(e)}")
