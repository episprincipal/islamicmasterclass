import pg8000
import os

# Read from environment variables (same as your app)
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_NAME = os.getenv("DB_NAME", "imc_db")
DB_USER = os.getenv("DB_USER", "imc_user")
DB_PASS = os.getenv("DB_PASS", "")

print("Connecting to DB...")
print(f"Host={DB_HOST}, Port={DB_PORT}, DB={DB_NAME}, User={DB_USER}")

try:
    conn = pg8000.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        timeout=5,
    )

    cursor = conn.cursor()
    cursor.execute("SELECT 1;")
    result = cursor.fetchone()

    print("✅ DB connection successful!")
    print("Query result:", result)

    cursor.close()
    conn.close()

except Exception as e:
    print("❌ DB connection failed")
    print(type(e).__name__, e)
