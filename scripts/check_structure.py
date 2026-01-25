from sqlalchemy import create_engine, text
import os

DATABASE_URL = "postgresql+pg8000://imc_user:Ibrahim_26!db@127.0.0.1:5432/imc_db"
engine = create_engine(DATABASE_URL)

tables_to_check = [
    'courses',
    'course_chapters',
    'chapter_quizzes',
    'quiz_questions',
    'quiz_answers',
    'quiz_attempts',
    'chapter_progress',
    'course_progress',
    'enrollments'
]

for table in tables_to_check:
    print(f"\n{'='*60}")
    print(f"TABLE: imc.{table}")
    print('='*60)
    
    with engine.connect() as conn:
        result = conn.execute(text(f"""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_schema='imc' AND table_name='{table}'
            ORDER BY ordinal_position
        """))
        
        for row in result:
            nullable = "NULL" if row[2] == 'YES' else "NOT NULL"
            default = f" DEFAULT {row[3]}" if row[3] else ""
            print(f"  {row[0]:25} {row[1]:20} {nullable}{default}")

# Check sample data
print("\n" + "="*60)
print("SAMPLE DATA - COURSES (first 3)")
print("="*60)
with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT course_id, course_name, lessons_count 
        FROM imc.courses 
        LIMIT 3
    """))
    for row in result:
        print(f"  {row[0]}: {row[1]} ({row[2]} lessons)")

print("\n" + "="*60)
print("SAMPLE DATA - COURSE CHAPTERS (first 5)")
print("="*60)
with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT chapter_id, course_id, chapter_order, title 
        FROM imc.course_chapters 
        ORDER BY course_id, chapter_order
        LIMIT 5
    """))
    for row in result:
        print(f"  Chapter {row[0]}: Course {row[1]}, Order#{row[2]} - {row[3]}")

print("\n" + "="*60)
print("SAMPLE DATA - CHAPTER QUIZZES (first 5)")
print("="*60)
with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT quiz_id, chapter_id, title 
        FROM imc.chapter_quizzes 
        LIMIT 5
    """))
    for row in result:
        print(f"  Quiz {row[0]}: Chapter {row[1]} - {row[2]}")
