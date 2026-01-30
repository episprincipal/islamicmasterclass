"""Check users table columns"""
import pg8000

conn = pg8000.connect(
    host='127.0.0.1',
    port=5432,
    database='imc_db',
    user='imc_user',
    password='Ibrahim_26!db'
)

cur = conn.cursor()
cur.execute("""
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'imc' AND table_name = 'users' 
    ORDER BY ordinal_position
""")

print("Columns in users table:")
for row in cur.fetchall():
    print(f"  - {row[0]} ({row[1]})")

cur.close()
conn.close()
