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
    # Patch lookup in security module for decorators
    mocker.patch('app.core.security.get_supabase', return_value=mock_client)
    # Patch lookup in service module for business logic
    mocker.patch('app.services.verification_service.get_supabase', return_value=mock_client)
    return mock_client

# Helper to mock auth and role check for admin endpoints
def mock_admin_auth(mock_client, role='admin'):
    # Mock JWT user lookup
    mock_user = MagicMock()
    type(mock_user).id = PropertyMock(return_value=str(uuid.uuid4()))
    mock_auth_response = MagicMock()
    type(mock_auth_response).user = mock_user
    mock_client.auth.get_user.return_value = mock_auth_response

    # Mock profile role lookup
    (mock_client.table.return_value
     .select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'role': role})

def test_get_pending_applications_success(client, mock_supabase_client):
    """Test GET /admin/verification/pending with admin privileges."""
    mock_admin_auth(mock_supabase_client, role='admin')

    # Mock the service call's DB query
    pending_apps_data = [{'id': str(uuid.uuid4()), 'status': 'submitted'}]
    (mock_supabase_client.table.return_value
     .select.return_value.eq.return_value
     .execute.return_value) = MagicMock(data=pending_apps_data)

    response = client.get('/admin/verification/pending', headers={'Authorization': 'Bearer fake-token'})

    assert response.status_code == 200
    assert response.get_json() == pending_apps_data

def test_get_pending_applications_unauthorized_non_admin(client, mock_supabase_client):
    """Test GET /admin/verification/pending with non-admin privileges."""
    mock_admin_auth(mock_supabase_client, role='customer') # Mock a customer user

    response = client.get('/admin/verification/pending', headers={'Authorization': 'Bearer fake-token'})

    assert response.status_code == 403
    assert "Administrator or staff access required" in response.get_json()['message']

def test_get_pending_applications_unauthorized_no_token(client):
    """Test GET /admin/verification/pending without a token."""
    response = client.get('/admin/verification/pending')
    assert response.status_code == 401
