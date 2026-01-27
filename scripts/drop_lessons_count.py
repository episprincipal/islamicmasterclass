from sqlalchemy import create_engine, text
import os

DATABASE_URL = "postgresql+pg8000://imc_user:Ibrahim_26!db@127.0.0.1:5432/imc_db"
engine = create_engine(DATABASE_URL)

print("Dropping lessons_count column from imc.courses table...")

with engine.connect() as conn:
    # Drop the lessons_count column
    conn.execute(text("""
        ALTER TABLE imc.courses 
        DROP COLUMN IF EXISTS lessons_count
    """))
    conn.commit()
    print("✓ Column dropped successfully")

# Verify the change
print("\nVerifying courses table structure:")
with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema='imc' AND table_name='courses'
        ORDER BY ordinal_position
    """))
    print("\nColumns in courses table:")
    for row in result:
        print(f"  - {row[0]}: {row[1]}")

print("\n✓ Migration complete!")
