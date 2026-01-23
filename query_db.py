#!/usr/bin/env python3
import os
os.environ['DATABASE_URL'] = 'postgresql+pg8000://imc_user:Ibrahim_26!db@127.0.0.1:5432/imc_db'

from sqlalchemy import create_engine, text

engine = create_engine(os.environ['DATABASE_URL'])

print("=== Tables in imc schema ===")
with engine.connect() as conn:
    result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'imc' ORDER BY table_name"))
    for row in result:
        print(f"  - {row[0]}")

print("\n=== Columns with 'password' ===")
with engine.connect() as conn:
    result = conn.execute(text("SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'imc' AND column_name ILIKE '%password%'"))
    rows = result.fetchall()
    if rows:
        for table, col in rows:
            print(f"  {table}.{col}")
    else:
        print("  (none found)")

print("\n=== User record for asif.parent@demo.com ===")
with engine.connect() as conn:
    result = conn.execute(text("SELECT * FROM imc.users WHERE email = 'asif.parent@demo.com'"))
    row = result.fetchone()
    if row:
        print(f"  {row}")
    else:
        print("  User not found")
