"""
Admin endpoints for dashboard statistics and management
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db

router = APIRouter()


@router.get("/users")
def get_all_users(
    search: str = None,
    role: str = None,
    status: str = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    Get all users with optional filtering
    """
    try:
        # Build query
        query = """
            SELECT 
                u.user_id,
                u.email,
                u.first_name,
                u.last_name,
                u.phone,
                u.gender,
                u.address,
                u.created_at,
                u.is_active,
                COALESCE(r.role_name, 'student') as role
            FROM imc.users u
            LEFT JOIN imc.user_roles ur ON u.user_id = ur.user_id
            LEFT JOIN imc.roles r ON ur.role_id = r.role_id
            WHERE 1=1
        """
        
        params = {}
        
        # Add search filter
        if search:
            query += """ AND (
                LOWER(u.email) LIKE LOWER(:search) OR
                LOWER(u.first_name) LIKE LOWER(:search) OR
                LOWER(u.last_name) LIKE LOWER(:search) OR
                LOWER(u.phone) LIKE LOWER(:search)
            )"""
            params["search"] = f"%{search}%"
        
        # Add role filter
        if role:
            query += " AND r.role_name = :role"
            params["role"] = role
        
        # Order and pagination
        query += " ORDER BY u.created_at DESC LIMIT :limit OFFSET :offset"
        params["limit"] = limit
        params["offset"] = offset
        
        users = db.execute(text(query), params).mappings().all()
        
        # Get total count
        count_query = """
            SELECT COUNT(DISTINCT u.user_id)
            FROM imc.users u
            LEFT JOIN imc.user_roles ur ON u.user_id = ur.user_id
            LEFT JOIN imc.roles r ON ur.role_id = r.role_id
            WHERE 1=1
        """
        
        count_params = {}
        if search:
            count_query += """ AND (
                LOWER(u.email) LIKE LOWER(:search) OR
                LOWER(u.first_name) LIKE LOWER(:search) OR
                LOWER(u.last_name) LIKE LOWER(:search) OR
                LOWER(u.phone) LIKE LOWER(:search)
            )"""
            count_params["search"] = f"%{search}%"
        
        if role:
            count_query += " AND r.role_name = :role"
            count_params["role"] = role
        
        total = db.execute(text(count_query), count_params).scalar() or 0
        
        return {
            "users": [dict(user) for user in users],
            "total": total,
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")


@router.get("/users/stats")
def get_users_stats(db: Session = Depends(get_db)):
    """
    Get user statistics for manage users page
    """
    try:
        # Total users
        total = db.execute(text("SELECT COUNT(*) FROM imc.users")).scalar() or 0
        
        # Active users (users with enrollments)
        active = db.execute(text("""
            SELECT COUNT(DISTINCT user_id) 
            FROM imc.enrollments 
            WHERE status = 'active'
        """)).scalar() or 0
        
        # By role
        by_role = db.execute(text("""
            SELECT r.role_name, COUNT(DISTINCT u.user_id) as count
            FROM imc.users u
            LEFT JOIN imc.user_roles ur ON u.user_id = ur.user_id
            LEFT JOIN imc.roles r ON ur.role_id = r.role_id
            GROUP BY r.role_name
        """)).mappings().all()
        
        role_counts = {row["role_name"] or "student": row["count"] for row in by_role}
        
        # New users this month
        new_this_month = db.execute(text("""
            SELECT COUNT(*) 
            FROM imc.users 
            WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
        """)).scalar() or 0
        
        return {
            "total": total,
            "active": active,
            "byRole": role_counts,
            "newThisMonth": new_this_month
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user stats: {str(e)}")


@router.get("/users/{user_id}")
def get_user_detail(user_id: int, db: Session = Depends(get_db)):
    """
    Get detailed information for a specific user
    """
    try:
        user = db.execute(
            text("""
                SELECT 
                    u.user_id,
                    u.email,
                    u.first_name,
                    u.last_name,
                    u.phone,
                    u.gender,
                    u.address,
                    u.dob,
                    u.created_at,
                    u.updated_at,
                    u.is_active,
                    COALESCE(r.role_name, 'student') as role
                FROM imc.users u
                LEFT JOIN imc.user_roles ur ON u.user_id = ur.user_id
                LEFT JOIN imc.roles r ON ur.role_id = r.role_id
                WHERE u.user_id = :user_id
            """),
            {"user_id": user_id}
        ).mappings().first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return dict(user)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")


@router.patch("/users/{user_id}")
def update_user(user_id: int, user_data: dict, db: Session = Depends(get_db)):
    """
    Update user information
    """
    try:
        # Check if user exists
        existing = db.execute(
            text("SELECT user_id FROM imc.users WHERE user_id = :user_id"),
            {"user_id": user_id}
        ).scalar()
        
        if not existing:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Build update query dynamically based on provided fields
        update_fields = []
        params = {"user_id": user_id}
        
        allowed_fields = ["first_name", "last_name", "phone", "gender", "address", "dob", "email"]
        
        for field in allowed_fields:
            if field in user_data:
                update_fields.append(f"{field} = :{field}")
                params[field] = user_data[field]
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        # Add updated_at
        update_fields.append("updated_at = CURRENT_TIMESTAMP")
        
        query = f"""
            UPDATE imc.users 
            SET {', '.join(update_fields)}
            WHERE user_id = :user_id
        """
        
        db.execute(text(query), params)
        db.commit()
        
        return {"message": "User updated successfully", "user_id": user_id}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")


@router.patch("/users/{user_id}/toggle-active")
def toggle_user_active(user_id: int, db: Session = Depends(get_db)):
    """
    Toggle user active status (activate/deactivate)
    """
    try:
        # Get current status
        current = db.execute(
            text("SELECT is_active FROM imc.users WHERE user_id = :user_id"),
            {"user_id": user_id}
        ).scalar()
        
        if current is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Toggle status
        new_status = not current
        db.execute(
            text("UPDATE imc.users SET is_active = :status WHERE user_id = :user_id"),
            {"status": new_status, "user_id": user_id}
        )
        db.commit()
        
        return {
            "user_id": user_id,
            "is_active": new_status,
            "message": f"User {'activated' if new_status else 'deactivated'} successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error toggling user status: {str(e)}")


@router.get("/dashboard/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    """
    Get statistics for admin dashboard
    """
    try:
        # Total users
        total_users = db.execute(
            text("SELECT COUNT(*) FROM imc.users")
        ).scalar() or 0
        
        # Total courses
        total_courses = db.execute(
            text("SELECT COUNT(*) FROM imc.courses WHERE is_active = true")
        ).scalar() or 0
        
        # Total enrollments
        total_enrollments = db.execute(
            text("SELECT COUNT(*) FROM imc.enrollments WHERE status = 'active'")
        ).scalar() or 0
        
        # Active students (users with student role and active enrollments)
        active_students = db.execute(
            text("""
                SELECT COUNT(DISTINCT u.user_id)
                FROM imc.users u
                JOIN imc.user_roles ur ON u.user_id = ur.user_id
                JOIN imc.roles r ON ur.role_id = r.role_id
                JOIN imc.enrollments e ON u.user_id = e.user_id
                WHERE r.role_name = 'student' AND e.status = 'active'
            """)
        ).scalar() or 0
        
        return {
            "totalUsers": total_users,
            "totalCourses": total_courses,
            "totalEnrollments": total_enrollments,
            "activeStudents": active_students
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching admin stats: {str(e)}")


@router.get("/dashboard/recent-activity")
def get_recent_activity(limit: int = 10, db: Session = Depends(get_db)):
    """
    Get recent activity for admin dashboard
    Returns a list of recent activities including:
    - New user registrations
    - New course enrollments
    - Course completions
    """
    try:
        activities = []
        
        # Get recent user registrations
        recent_users = db.execute(
            text("""
                SELECT 
                    u.user_id,
                    u.first_name,
                    u.last_name,
                    u.email,
                    u.created_at,
                    'user_registered' as activity_type
                FROM imc.users u
                ORDER BY u.created_at DESC
                LIMIT :limit
            """),
            {"limit": limit}
        ).mappings().all()
        
        for user in recent_users:
            activities.append({
                "id": f"user_{user['user_id']}_{user['created_at']}",
                "type": "user_registered",
                "title": "New User Registration",
                "description": f"{user['first_name']} {user['last_name']} ({user['email']}) joined the platform",
                "timestamp": user['created_at'].isoformat() if user['created_at'] else None,
                "user": {
                    "id": user['user_id'],
                    "name": f"{user['first_name']} {user['last_name']}",
                    "email": user['email']
                }
            })
        
        # Get recent enrollments
        recent_enrollments = db.execute(
            text("""
                SELECT 
                    e.enrollment_id,
                    e.user_id,
                    e.course_id,
                    e.enrollment_date,
                    u.first_name,
                    u.last_name,
                    u.email,
                    c.course_name as course_title,
                    'enrollment' as activity_type
                FROM imc.enrollments e
                JOIN imc.users u ON e.user_id = u.user_id
                JOIN imc.courses c ON e.course_id = c.course_id
                WHERE e.status = 'active'
                ORDER BY e.enrollment_date DESC
                LIMIT :limit
            """),
            {"limit": limit}
        ).mappings().all()
        
        for enrollment in recent_enrollments:
            activities.append({
                "id": f"enrollment_{enrollment['enrollment_id']}_{enrollment['enrollment_date']}",
                "type": "enrollment",
                "title": "New Course Enrollment",
                "description": f"{enrollment['first_name']} {enrollment['last_name']} enrolled in {enrollment['course_title']}",
                "timestamp": enrollment['enrollment_date'].isoformat() if enrollment['enrollment_date'] else None,
                "user": {
                    "id": enrollment['user_id'],
                    "name": f"{enrollment['first_name']} {enrollment['last_name']}",
                    "email": enrollment['email']
                },
                "course": {
                    "id": enrollment['course_id'],
                    "title": enrollment['course_title']
                }
            })
        
        # Sort all activities by timestamp (most recent first)
        activities.sort(key=lambda x: x['timestamp'] if x['timestamp'] else '', reverse=True)
        
        # Return only the requested limit
        return {
            "activities": activities[:limit],
            "total": len(activities[:limit])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recent activity: {str(e)}")
