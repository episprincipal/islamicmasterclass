"""
Script to create an admin user in the database
"""
import sys
import os
from datetime import datetime

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pg8000
from app.auth import hash_password

def create_admin_user():
    """Create admin user with specified details"""
    
    # Admin details
    email = "episprincipal@gmail.com"
    password = "Ibrahim_26!"
    first_name = "Admin"
    last_name = "EPIS"
    phone = "(763) 339-2998"
    address = "11543 K-Tel Dr, Minnetonka, MN 55343"
    gender = "male"
    dob = "1980-01-01"  # Default admin DOB
    
    # Hash the password
    hashed_password = hash_password(password)
    
    # Connect to database
    conn = pg8000.connect(
        host="127.0.0.1",
        port=5432,
        database="imc_db",
        user="imc_user",
        password="Ibrahim_26!db"
    )
    
    try:
        cur = conn.cursor()
        
        # Check if admin role exists
        cur.execute("SELECT role_id FROM imc.roles WHERE role_name = 'admin'")
        admin_role = cur.fetchone()
        
        if not admin_role:
            print("Creating admin role...")
            cur.execute("""
                INSERT INTO imc.roles (role_name, description)
                VALUES ('admin', 'Administrator with full system access')
                RETURNING role_id
            """)
            admin_role_id = cur.fetchone()[0]
        else:
            admin_role_id = admin_role[0]
        
        # Check if user already exists
        cur.execute("SELECT user_id FROM imc.users WHERE email = %s", (email,))
        existing_user = cur.fetchone()
        
        if existing_user:
            print(f"User {email} already exists with user_id: {existing_user[0]}")
            user_id = existing_user[0]
        else:
            # Create user
            print(f"Creating admin user: {email}")
            cur.execute("""
                INSERT INTO imc.users (
                    email, password_hash, first_name, last_name, 
                    phone, address, gender, dob, created_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING user_id
            """, (
                email, hashed_password, first_name, last_name,
                phone, address, gender, dob, datetime.now()
            ))
            user_id = cur.fetchone()[0]
            print(f"Created user with user_id: {user_id}")
        
        # Check if user already has admin role
        cur.execute("""
            SELECT * FROM imc.user_roles 
            WHERE user_id = %s AND role_id = %s
        """, (user_id, admin_role_id))
        
        if not cur.fetchone():
            # Assign admin role to user
            cur.execute("""
                INSERT INTO imc.user_roles (user_id, role_id)
                VALUES (%s, %s)
            """, (user_id, admin_role_id))
            print(f"Assigned admin role to user")
        else:
            print("User already has admin role")
        
        conn.commit()
        print("\n✅ Admin user created successfully!")
        print(f"Email: {email}")
        print(f"Password: {password}")
        print(f"User ID: {user_id}")
        print(f"Role ID: {admin_role_id}")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Error creating admin user: {e}")
        raise
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    create_admin_user()
