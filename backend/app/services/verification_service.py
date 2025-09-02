from typing import List, Dict, Any

# This is a placeholder. In a real implementation, this would likely be
# a dataclass or a Pydantic model representing an uploaded file.
class Document:
    def __init__(self, file_name: str, content: bytes):
        self.file_name = file_name
        self.content = content

from ..core.db import get_supabase

class VerificationEngine:
    """
    Handles the business logic for the user verification system.
    This class will interact with the database and other services
    to manage verification workflows.
    """

    def submit_application(self, user_id: str, application_type: str) -> Dict[str, Any]:
        """
        Submits a new verification application for a user.

        - Validates user eligibility.
        - Creates a new application record in the database.
        - Returns the newly created application's details.
        """
        supabase = get_supabase()

        # 1. Validate user eligibility (user exists, not already verified/pending).
        existing_apps = supabase.table('verification_applications') \
            .select('id, status') \
            .eq('user_id', user_id) \
            .in_('status', ['submitted', 'under_review', 'approved']) \
            .execute()

        if len(existing_apps.data) > 0:
            raise ValueError(f"User {user_id} already has an active or approved verification application.")

        # 2. Create verification_applications record in the database.
        new_application_data = {
            "user_id": user_id,
            "application_type": application_type,
            "status": "submitted",
            "submitted_at": "now()"
        }

        insert_response = supabase.table('verification_applications') \
            .insert(new_application_data) \
            .execute()

        if not insert_response.data:
            raise Exception("Failed to create verification application.")

        # TODO: 3. Generate notification for admin review.

        return insert_response.data[0]

    def get_application(self, user_id: str, application_id: str) -> Dict[str, Any]:
        """
        Retrieves a single verification application.
        Ensures the user requesting the application is the owner.
        """
        supabase = get_supabase()

        app_response = supabase.table('verification_applications') \
            .select('*') \
            .eq('id', application_id) \
            .eq('user_id', user_id) \
            .single() \
            .execute()

        if not app_response.data:
            raise ValueError("Application not found or access denied.")

        return app_response.data

    def upload_document(self, user_id: str, app_id: str, file_name: str, file_body: bytes, document_type: str, mime_type: str) -> Dict[str, Any]:
        """
        Uploads a verification document for an application.

        - Verifies ownership of the application.
        - Uploads the file to Supabase Storage.
        - Creates a record in the verification_documents table.
        """
        # 1. Verify the user owns the application
        self.get_application(user_id=user_id, application_id=app_id)

        supabase = get_supabase()
        bucket_name = 'verification-documents'
        file_path_in_bucket = f"{user_id}/{app_id}/{file_name}"

        # 2. Upload to Supabase Storage
        # Note: supabase-py storage API is a bit basic. This is a conceptual implementation.
        # In a real scenario, you might need to handle content-type more explicitly.
        supabase.storage.from_(bucket_name).upload(file_path_in_bucket, file_body)

        # 3. Create record in verification_documents table
        doc_data = {
            "application_id": app_id,
            "document_type": document_type,
            "file_path": file_path_in_bucket,
            "file_name": file_name,
            "mime_type": mime_type,
            "file_size": len(file_body)
        }
        insert_response = supabase.table('verification_documents').insert(doc_data).execute()

        if not insert_response.data:
            raise Exception("Failed to create verification document record.")

        return insert_response.data[0]

    def submit_appeal(self, user_id: str, app_id: str, appeal_reason: str) -> Dict[str, Any]:
        """
        Submits an appeal for a rejected verification application.
        """
        # 1. Verify ownership and get the application
        application = self.get_application(user_id=user_id, application_id=app_id)

        # 2. Check if the application status is 'rejected'
        if application.get('status') != 'rejected':
            raise ValueError("Only rejected applications can be appealed.")

        supabase = get_supabase()

        # 3. Update the application status to 'appealing'
        supabase.table('verification_applications') \
            .update({'status': 'appealing'}) \
            .eq('id', app_id) \
            .execute()

        # 4. Create a new record in the verification_appeals table
        appeal_data = {
            "application_id": app_id,
            "user_id": user_id,
            "appeal_reason": appeal_reason,
            "status": "submitted"
        }
        insert_response = supabase.table('verification_appeals').insert(appeal_data).execute()

        if not insert_response.data:
            raise Exception("Failed to create appeal record.")

        return insert_response.data[0]

    def get_pending_applications(self) -> List[Dict[str, Any]]:
        """
        Retrieves a list of all verification applications with 'submitted' status.
        """
        supabase = get_supabase()
        response = supabase.table('verification_applications') \
            .select('*') \
            .eq('status', 'submitted') \
            .execute()

        return response.data

    def admin_review_application(self, admin_id: str, app_id: str, checklist_data: dict) -> Dict[str, Any]:
        """
        Allows an admin to review a verification application.

        - Verifies admin permissions.
        - Updates the application status and checklist in the database.
        - Sends a notification to the user.
        """
        # TODO:
        # 1. Verify admin_id has admin privileges.
        # 2. Find the application by app_id.
        # 3. Create/update verification_checklist record.
        # 4. Update verification_applications status.
        # 5. Update profiles table with new verification_tier if approved.
        # 6. Send notification to the user.
        print(f"Admin {admin_id} reviewing application {app_id} with data: {checklist_data}")

        # Placeholder response
        return {"application_id": app_id, "status": "under_review"}

    def get_user_access_level(self, user_id: str) -> Dict[str, Any]:
        """
        Determines what features a user can access based on their verification tier.
        """
        # TODO:
        # 1. Fetch user from profiles table by user_id.
        # 2. Read their verification_tier.
        # 3. Return permissions based on the VERIFICATION_TIERS constant.
        print(f"Getting access level for user {user_id}")

        # Placeholder response
        return {
            'user_id': user_id,
            'verification_tier': 'none',
            'can_bid': False,
            'can_sell': False,
            'search_visibility': ['public'],
            'bid_limits': 0
        }
