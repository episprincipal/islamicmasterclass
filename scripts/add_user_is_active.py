"""Add is_active column to users table"""
import pg8000

conn = pg8000.connect(
    host='127.0.0.1',
    port=5432,
    database='imc_db',
    user='imc_user',
    password='Ibrahim_26!db'
)

try:
    cur = conn.cursor()
    
    # Check if column exists
    cur.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'imc' 
        AND table_name = 'users' 
        AND column_name = 'is_active'
    """)
    
    if cur.fetchone():
        print("Column 'is_active' already exists in users table")
    else:
        # Add is_active column
        print("Adding 'is_active' column to users table...")
        cur.execute("""
            ALTER TABLE imc.users 
            ADD COLUMN is_active BOOLEAN DEFAULT true NOT NULL
        """)
        conn.commit()
        print("✅ Column 'is_active' added successfully!")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
    conn.rollback()
    conn.close()
