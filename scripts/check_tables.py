from sqlalchemy import create_engine, text

engine = create_engine('postgresql+pg8000://imc_user:Ibrahim_26!db@127.0.0.1:5432/imc_db')
conn = engine.connect()
result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'imc' ORDER BY table_name"))
print('Tables in imc schema:')
for r in result:
    print(f'  - {r.table_name}')
conn.close()
