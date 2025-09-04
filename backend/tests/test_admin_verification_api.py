import pytest
import uuid
from unittest.mock import MagicMock, PropertyMock
from app.main import create_app

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app()
    app.config.update({"TESTING": True, "SUPABASE_URL": "http://test.supabase.co", "SUPABASE_KEY": "test-key"})
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def mock_supabase_client(mocker):
    """Fixture to mock the Supabase client."""
    mock_client = MagicMock()
    mocker.patch('app.core.security.get_supabase', return_value=mock_client)
    mocker.patch('app.services.verification_service.get_supabase', return_value=mock_client)
    return mock_client

def test_get_pending_applications_success(client, mock_supabase_client):
    """Test GET /admin/verification/pending with admin privileges."""
    admin_id = str(uuid.uuid4())

    # Mock Auth
    mock_user = MagicMock()
    type(mock_user).id = PropertyMock(return_value=admin_id)
    mock_supabase_client.auth.get_user.return_value = MagicMock(user=mock_user)

    # Mock DB calls
    profile_mock = MagicMock()
    (profile_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'role': 'admin'})

    pending_apps_data = [{'id': str(uuid.uuid4()), 'status': 'submitted'}]
    apps_mock = MagicMock()
    (apps_mock.select.return_value.eq.return_value
     .execute.return_value) = MagicMock(data=pending_apps_data)

    def table_side_effect(table_name):
        if table_name == 'profiles': return profile_mock
        if table_name == 'verification_applications': return apps_mock
        return MagicMock()
    mock_supabase_client.table.side_effect = table_side_effect

    response = client.get('/admin/verification/pending', headers={'Authorization': 'Bearer fake-token'})
    assert response.status_code == 200
    assert response.get_json() == pending_apps_data

def test_get_pending_applications_unauthorized_non_admin(client, mock_supabase_client):
    """Test GET /admin/verification/pending with non-admin privileges."""
    user_id = str(uuid.uuid4())
    mock_user = MagicMock()
    type(mock_user).id = PropertyMock(return_value=user_id)
    mock_supabase_client.auth.get_user.return_value = MagicMock(user=mock_user)

    profile_mock = MagicMock()
    (profile_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'role': 'customer'})
    mock_supabase_client.table.side_effect = lambda table_name: profile_mock if table_name == 'profiles' else MagicMock()

    response = client.get('/admin/verification/pending', headers={'Authorization': 'Bearer fake-token'})
    assert response.status_code == 403

def test_get_pending_applications_unauthorized_no_token(client):
    response = client.get('/admin/verification/pending')
    assert response.status_code == 401

def test_review_application_success(client, mock_supabase_client):
    """Test POST /admin/verification/{id}/review for successful submission."""
    admin_id = str(uuid.uuid4())
    app_id = str(uuid.uuid4())

    mock_user = MagicMock()
    type(mock_user).id = PropertyMock(return_value=admin_id)
    mock_supabase_client.auth.get_user.return_value = MagicMock(user=mock_user)

    profile_mock = MagicMock()
    (profile_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'role': 'admin'})

    app_check_mock = MagicMock()
    (app_check_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'id': app_id})

    upsert_result = {"application_id": app_id, "admin_id": admin_id, "identity_verified": True}
    checklist_upsert_mock = MagicMock()
    (checklist_upsert_mock.upsert.return_value
     .execute.return_value) = MagicMock(data=[upsert_result])

    def table_side_effect(table_name):
        if table_name == 'profiles': return profile_mock
        if table_name == 'verification_applications': return app_check_mock
        if table_name == 'verification_checklist': return checklist_upsert_mock
        return MagicMock()
    mock_supabase_client.table.side_effect = table_side_effect

    checklist_data = {"identity_verified": True, "notes": "Looks good."}
    response = client.post(f'/admin/verification/{app_id}/review',
                           json=checklist_data,
                           headers={'Authorization': 'Bearer fake-token'})
    assert response.status_code == 200
    assert response.get_json()['identity_verified'] is True

def test_review_application_not_found(client, mock_supabase_client):
    """Test POST /admin/verification/{id}/review for a non-existent application."""
    admin_id = str(uuid.uuid4())
    app_id = str(uuid.uuid4())

    mock_user = MagicMock()
    type(mock_user).id = PropertyMock(return_value=admin_id)
    mock_supabase_client.auth.get_user.return_value = MagicMock(user=mock_user)

    profile_mock = MagicMock()
    (profile_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'role': 'admin'})

    app_check_mock = MagicMock()
    (app_check_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data=None)

    def table_side_effect(table_name):
        if table_name == 'profiles': return profile_mock
        if table_name == 'verification_applications': return app_check_mock
        return MagicMock()
    mock_supabase_client.table.side_effect = table_side_effect

    response = client.post(f'/admin/verification/{app_id}/review',
                           json={"identity_verified": True},
                           headers={'Authorization': 'Bearer fake-token'})
    assert response.status_code == 404


def test_approve_application_success(client, mock_supabase_client):
    """Test POST /admin/verification/{id}/approve for successful approval."""
    admin_id = str(uuid.uuid4())
    app_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())

    mock_user = MagicMock()
    type(mock_user).id = PropertyMock(return_value=admin_id)
    mock_supabase_client.auth.get_user.return_value = MagicMock(user=mock_user)

    # --- Set up mocks for the sequence of DB calls ---
    # 1. Decorator: checks admin role
    profile_role_mock = MagicMock()
    (profile_role_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'role': 'admin'})

    # 2. Service: checks for checklist
    checklist_check_mock = MagicMock()
    (checklist_check_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'id': 'a-checklist-id'})

    # 3. Service: gets app details
    app_details_mock = MagicMock()
    (app_details_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'user_id': user_id, 'application_type': 'basic'})

    # 4. Service: updates user's profile
    profile_update_mock = MagicMock()
    (profile_update_mock.update.return_value.eq.return_value
     .execute.return_value) = MagicMock(data=[{'verification_tier': 'basic'}])

    # 5. Service: updates application status
    app_update_mock = MagicMock()
    (app_update_mock.update.return_value.eq.return_value
     .execute.return_value) = MagicMock(data=[{'status': 'approved'}])

    # Corrected robust approach:
    # The order of table access is: profiles, verification_checklist, verification_applications, profiles, verification_applications
    mock_supabase_client.table.side_effect = [
        profile_role_mock,      # For decorator's role check
        checklist_check_mock,   # For service's checklist check
        app_details_mock,       # For service's app details fetch
        profile_update_mock,    # For service's profile tier update
        app_update_mock         # For service's final app status update
    ]

    response = client.post(f'/admin/verification/{app_id}/approve', headers={'Authorization': 'Bearer fake-token'})

    assert response.status_code == 200
    assert response.get_json()['status'] == 'approved'

def test_reject_application_success(client, mock_supabase_client):
    """Test POST /admin/verification/{id}/reject for successful rejection."""
    admin_id = str(uuid.uuid4())
    app_id = str(uuid.uuid4())

    mock_user = MagicMock()
    type(mock_user).id = PropertyMock(return_value=admin_id)
    mock_supabase_client.auth.get_user.return_value = MagicMock(user=mock_user)

    profile_mock = MagicMock()
    (profile_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'role': 'admin'})

    app_update_mock = MagicMock()
    (app_update_mock.update.return_value.eq.return_value
     .execute.return_value) = MagicMock(data=[{'status': 'rejected'}])

    def table_side_effect(table_name):
        if table_name == 'profiles': return profile_mock
        if table_name == 'verification_applications': return app_update_mock
        return MagicMock()

    mock_supabase_client.table.side_effect = table_side_effect

    response = client.post(f'/admin/verification/{app_id}/reject',
                           json={'rejection_reason': 'Info mismatch'},
                           headers={'Authorization': 'Bearer fake-token'})

    assert response.status_code == 200
    assert response.get_json()['status'] == 'rejected'
