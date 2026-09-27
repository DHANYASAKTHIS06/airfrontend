import pymongo

uri = "mongodb+srv://2403717620522007_db_user:SK1468aywO8rM2PA@cluster0.u2nb8ei.mongodb.net/?appName=Cluster0"

try:
    client = pymongo.MongoClient(uri, serverSelectionTimeoutMS=10000)
    dbs = client.list_database_names()
    print("Databases:", dbs)
    for db_name in dbs:
        if db_name in ['admin', 'local']: continue
        db = client[db_name]
        cols = db.list_collection_names()
        print(f"\nDatabase [{db_name}] Collections:", cols)
        for c in cols:
            count = db[c].count_documents({})
            sample = list(db[c].find().limit(3))
            print(f"  Collection '{c}' ({count} docs) Sample:", sample)
except Exception as e:
    print("MongoDB Error:", e)
