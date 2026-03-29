from db.database import engine

try:
    conn = engine.connect()
    print("DB Connected ✅")
    conn.close()
except Exception as e:
    print("DB Error:", e)