"""Check enrollments table columns"""
import os
from sqlalchemy import create_engine, text

# Use database URL from environment
db_url = os.getenv('DATABASE_URL', 'postgresql+pg8000://imc_user:Ibrahim_26!db@127.0.0.1:5432/imc_db')
engine = create_engine(db_url)

with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'imc' AND table_name = 'enrollments' 
        ORDER BY ordinal_position
    """))
    
    print("Enrollments table columns:")
    print("-" * 40)
    for row in result:
        print(f"{row[0]}: {row[1]}")
