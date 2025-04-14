from datetime import datetime
from bson.objectid import ObjectId

class Project:
    """Model for donation projects"""
    
    STATUS_PENDING = 'pending'
    STATUS_APPROVED = 'approved'
    STATUS_REJECTED = 'rejected'
    
    REGION_SOUTH = 'south'
    REGION_NORTH = 'north'
    
    @classmethod
    def create(cls, mongo, project_data):
        """Create a new project in pending status"""
        project = {
            'title': project_data.get('title'),
            'description': project_data.get('description'),
            'region': project_data.get('region'),
            'goal_amount': float(project_data.get('goal_amount', 0)),
            'current_amount': 0.0,
            'user_id': project_data.get('user_id'),  # ID of user who submitted
            'contact_email': project_data.get('contact_email'),
            'contact_phone': project_data.get('contact_phone'),
            'organization': project_data.get('organization', ''),
            'proof_documents': project_data.get('proof_documents', []),  # URLs or IDs of uploaded documents
            'status': cls.STATUS_PENDING,
            'status_notes': '',  # Admin notes on approval/rejection
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'approved_at': None,
            'rejected_at': None,
            'admin_id': None  # ID of admin who approved/rejected
        }
        
        result = mongo.db.projects.insert_one(project)
        project['_id'] = result.inserted_id
        return project
    
    @classmethod
    def get_by_id(cls, mongo, project_id):
        """Get a project by its ID"""
        try:
            return mongo.db.projects.find_one({'_id': ObjectId(project_id)})
        except:
            return None
    
    @classmethod
    def get_pending_projects(cls, mongo):
        """Get all pending projects for admin review"""
        return list(mongo.db.projects.find({'status': cls.STATUS_PENDING}).sort('created_at', -1))
    
    @classmethod
    def get_approved_projects(cls, mongo):
        """Get all approved (public) projects"""
        return list(mongo.db.projects.find({'status': cls.STATUS_APPROVED}).sort('created_at', -1))
    
    @classmethod
    def get_user_projects(cls, mongo, user_id):
        """Get all projects submitted by a specific user"""
        return list(mongo.db.projects.find({'user_id': user_id}).sort('created_at', -1))
    
    @classmethod
    def approve_project(cls, mongo, project_id, admin_id, notes=''):
        """Approve a pending project"""
        result = mongo.db.projects.update_one(
            {'_id': ObjectId(project_id), 'status': cls.STATUS_PENDING},
            {'$set': {
                'status': cls.STATUS_APPROVED,
                'status_notes': notes,
                'approved_at': datetime.utcnow(),
                'admin_id': admin_id,
                'updated_at': datetime.utcnow()
            }}
        )
        return result.modified_count > 0
    
    @classmethod
    def reject_project(cls, mongo, project_id, admin_id, notes=''):
        """Reject a pending project"""
        result = mongo.db.projects.update_one(
            {'_id': ObjectId(project_id), 'status': cls.STATUS_PENDING},
            {'$set': {
                'status': cls.STATUS_REJECTED,
                'status_notes': notes,
                'rejected_at': datetime.utcnow(),
                'admin_id': admin_id,
                'updated_at': datetime.utcnow()
            }}
        )
        return result.modified_count > 0
    
    @classmethod
    def update_donation_amount(cls, mongo, project_id, amount):
        """Update project's current donation amount"""
        result = mongo.db.projects.update_one(
            {'_id': ObjectId(project_id)},
            {'$inc': {'current_amount': amount}}
        )
        return result.modified_count > 0