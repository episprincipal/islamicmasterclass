from sqlalchemy import create_engine, text
import os

DATABASE_URL = "postgresql+pg8000://imc_user:Ibrahim_26!db@127.0.0.1:5432/imc_db"
engine = create_engine(DATABASE_URL)

print("=== TABLES IN IMC SCHEMA ===")
with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema='imc' 
        ORDER BY table_name
    """))
    tables = [row[0] for row in result]
    for table in tables:
        print(f"  - {table}")

print("\n=== CHECKING FOR LESSON/QUIZ TABLES ===")
lesson_related = ['lessons', 'lesson_contents', 'lesson_progress', 'quizzes', 'questions', 'quiz_attempts']
for table in lesson_related:
    if table in tables:
        print(f"  ✓ {table} EXISTS")
    else:
        print(f"  ✗ {table} NOT FOUND")

print("\n=== COURSE COLUMNS ===")
with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema='imc' AND table_name='courses'
        ORDER BY ordinal_position
    """))
    for row in result:
        print(f"  - {row[0]}: {row[1]}")
