"""Check chapters and lessons table structure"""
import os
from sqlalchemy import create_engine, text

# Use database URL from environment
db_url = os.getenv('DATABASE_URL', 'postgresql+pg8000://imc_user:Ibrahim_26!db@127.0.0.1:5432/imc_db')
engine = create_engine(db_url)

with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT table_name, column_name, data_type, character_maximum_length, is_nullable 
        FROM information_schema.columns 
        WHERE table_schema = 'imc' AND table_name IN ('chapters', 'lessons')
        ORDER BY table_name, ordinal_position
    """))
    
    current_table = None
    for row in result:
        if current_table != row[0]:
            current_table = row[0]
            print(f"\n{current_table.upper()} Table:")
            print("-" * 70)
        max_len = f"({row[3]})" if row[3] else ""
        print(f"{row[1]:30} {row[2]:20} {max_len:10} {row[4]}")
