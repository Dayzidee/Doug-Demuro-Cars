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
        Allows an admin to submit a review checklist for a verification application.
        This creates or updates the checklist record.
        """
        supabase = get_supabase()

        # 1. Ensure the application exists
        app_response = supabase.table('verification_applications').select('id').eq('id', app_id).single().execute()
        if not app_response.data:
            raise ValueError(f"Application with id {app_id} not found.")

        # 2. Prepare and upsert the checklist data
        checklist_record = {
            "application_id": app_id,
            "admin_id": admin_id,
            "identity_verified": checklist_data.get('identity_verified', False),
            "income_verified": checklist_data.get('income_verified', False),
            "address_verified": checklist_data.get('address_verified', False),
            "banking_verified": checklist_data.get('banking_verified', False),
            "background_check_passed": checklist_data.get('background_check_passed', False),
            "notes": checklist_data.get('notes'),
            "completed_at": "now()"
        }

        # Upsert into the checklist table. If a record for this application_id exists, it's updated.
        # Otherwise, it's created.
        upsert_response = supabase.table('verification_checklist').upsert(checklist_record).execute()

        if not upsert_response.data:
            raise Exception("Failed to create or update verification checklist record.")

        # Note: This step does not change the application status itself.
        # That is handled by the approve/reject endpoints.
        return upsert_response.data[0]

    def approve_application(self, app_id: str) -> Dict[str, Any]:
        """
        Approves a verification application.
        - Ensures a checklist exists.
        - Updates application status to 'approved'.
        - Updates the user's profile with the new verification tier.
        """
        supabase = get_supabase()

        # 1. Ensure a checklist exists for this application
        checklist_response = supabase.table('verification_checklist').select('id').eq('application_id', app_id).single().execute()
        if not checklist_response.data:
            raise ValueError(f"Cannot approve application {app_id}: a review checklist must be completed first.")

        # 2. Get application type to determine the new tier and user_id
        app_response = supabase.table('verification_applications').select('user_id, application_type').eq('id', app_id).single().execute()
        if not app_response.data:
            raise ValueError(f"Application {app_id} not found.")

        user_id = app_response.data['user_id']
        new_tier = app_response.data['application_type'] # 'basic' or 'premium'

        # 3. Update the user's profile
        supabase.table('profiles') \
            .update({'verification_tier': new_tier, 'verification_status': f'{new_tier}_verified'}) \
            .eq('id', user_id) \
            .execute()

        # 4. Update the application status
        update_response = supabase.table('verification_applications') \
            .update({'status': 'approved', 'reviewed_at': 'now()'}) \
            .eq('id', app_id) \
            .execute()

        if not update_response.data:
            raise Exception("Failed to approve application.")

        return update_response.data[0]

    def reject_application(self, app_id: str, reason: str) -> Dict[str, Any]:
        """
        Rejects a verification application.
        """
        supabase = get_supabase()
        update_data = {'status': 'rejected', 'rejection_reason': reason, 'reviewed_at': 'now()'}

        response = supabase.table('verification_applications') \
            .update(update_data) \
            .eq('id', app_id) \
            .execute()

        if not response.data:
            raise Exception("Failed to reject application.")

        return response.data[0]

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
