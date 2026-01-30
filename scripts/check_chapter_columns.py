from sqlalchemy import create_engine, text

engine = create_engine('postgresql+pg8000://imc_user:Ibrahim_26!db@127.0.0.1:5432/imc_db')
conn = engine.connect()
result = conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'imc' AND table_name = 'course_chapters' ORDER BY ordinal_position"))
print('Columns in course_chapters table:')
for r in result:
    print(f'  - {r.column_name} ({r.data_type})')
conn.close()
