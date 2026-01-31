from datetime import datetime
import asyncio
from bson import ObjectId

class MockCollection:
    def __init__(self, name):
        self.name = name
        self.data = {} # Dict[str, dict]

    async def insert_one(self, document):
        if "_id" not in document:
            document["_id"] = ObjectId()
        
        doc_id = str(document["_id"])
        self.data[doc_id] = document
        
        class InsertResult:
            inserted_id = document["_id"]
        return InsertResult()

    async def find_one(self, query):
        # Very basic query matching (exact match only for demo)
        for doc in self.data.values():
            match = True
            for k, v in query.items():
                if k == "_id":
                    if str(doc.get("_id")) != str(v):
                        match = False
                        break
                elif doc.get(k) != v:
                    match = False
                    break
            if match:
                return doc
        return None

    async def find(self):
        # Returns an async generator
        for doc in self.data.values():
            yield doc
    
    # Helper to return list immediately for simple use cases
    async def get_all(self):
        return list(self.data.values())

class MockDB:
    def __init__(self):
        self.jobs = MockCollection("jobs")
        self.resumes = MockCollection("resumes")
        self.matches = MockCollection("matches")
        self.users = MockCollection("users")

    def __getitem__(self, item):
        return getattr(self, item)

mock_db_instance = MockDB()
