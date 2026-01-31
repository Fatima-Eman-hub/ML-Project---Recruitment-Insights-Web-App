from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/recruitment_db")

client = AsyncIOMotorClient(MONGODB_URL)
db = client.get_database()

# Collections
job_collection = db["jobs"]
resume_collection = db["resumes"]
user_collection = db["users"]
match_collection = db["matches"]

async def check_db_connection():
    try:
        # The ismaster command is cheap and does not require auth.
        await client.admin.command('ismaster')
        print("✅ MongoDB Connected Successfully!")
        return True
    except Exception as e:
        print(f"❌ MongoDB Connection Failed: {e}")
        print("Check if MongoDB service is started (Services.msc -> MongoDB Server)")
        return False
