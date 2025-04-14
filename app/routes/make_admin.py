# make_admin.py
# Run this script to make a user an admin

from pymongo import MongoClient
import sys

def make_admin(email):
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    db = client['lifeSparkDB']
    
    # Find the user by email
    user = db.users.find_one({'email': email})
    
    if not user:
        print(f"User with email {email} not found")
        return False
    
    # Update user to be an admin
    result = db.users.update_one(
        {'email': email},
        {'$set': {'is_admin': True}}
    )
    
    if result.modified_count > 0:
        print(f"User {email} is now an admin")
        return True
    else:
        print(f"Could not update user {email}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python make_admin.py user@example.com")
        sys.exit(1)
    
    email = sys.argv[1]
    make_admin(email)