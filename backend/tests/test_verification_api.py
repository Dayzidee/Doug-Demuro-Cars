import pytest
import uuid
from unittest.mock import MagicMock, PropertyMock
from app.main import create_app

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SUPABASE_URL": "http://test.supabase.co",
        "SUPABASE_KEY": "test-key"
    })
    yield app

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

@pytest.fixture
def mock_supabase_client(mocker):
    """Fixture to mock the Supabase client."""
    mock_client = MagicMock()
    mocker.patch('app.core.security.get_supabase', return_value=mock_client)
    mocker.patch('app.services.verification_service.get_supabase', return_value=mock_client)
    return mock_client

# Helper to mock the authentication part
def mock_auth(mock_client, user_id):
    mock_user = MagicMock()
    type(mock_user).id = PropertyMock(return_value=user_id)
    mock_auth_response = MagicMock()
    type(mock_auth_response).user = mock_user
    mock_client.auth.get_user.return_value = mock_auth_response

def test_submit_application_success(client, mock_supabase_client):
    """Test POST /verification/applications for successful submission."""
    user_id = str(uuid.uuid4())
    mock_auth(mock_supabase_client, user_id)

    (mock_supabase_client.table.return_value
     .select.return_value.eq.return_value.in_.return_value
     .execute.return_value) = MagicMock(data=[])

    insert_result = {"id": str(uuid.uuid4()), "user_id": user_id, "status": "submitted"}
    (mock_supabase_client.table.return_value
     .insert.return_value
     .execute.return_value) = MagicMock(data=[insert_result])

    response = client.post('/verification/applications',
                           json={'application_type': 'basic'},
                           headers={'Authorization': 'Bearer fake-token'})
    assert response.status_code == 201
    assert response.get_json()['user_id'] == user_id

def test_submit_application_unauthorized(client):
    response = client.post('/verification/applications', json={'application_type': 'basic'})
    assert response.status_code == 401

def test_submit_application_existing(client, mock_supabase_client):
    user_id = str(uuid.uuid4())
    mock_auth(mock_supabase_client, user_id)

    (mock_supabase_client.table.return_value
     .select.return_value.eq.return_value.in_.return_value
     .execute.return_value) = MagicMock(data=[{"id": "existing-app-uuid"}])

    response = client.post('/verification/applications',
                           json={'application_type': 'basic'},
                           headers={'Authorization': 'Bearer fake-token'})
    assert response.status_code == 409
    assert "already has an active" in response.get_json()['message']

def test_get_application_success(client, mock_supabase_client):
    user_id = str(uuid.uuid4())
    app_id = str(uuid.uuid4())
    mock_auth(mock_supabase_client, user_id)

    get_result = {"id": app_id, "user_id": user_id}
    (mock_supabase_client.table.return_value
     .select.return_value.eq.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data=get_result)

    response = client.get(f'/verification/applications/{app_id}',
                          headers={'Authorization': 'Bearer fake-token'})

    assert response.status_code == 200
    assert response.get_json()['id'] == app_id
    assert response.get_json()['user_id'] == user_id

def test_get_application_not_found(client, mock_supabase_client):
    user_id = str(uuid.uuid4())
    app_id = str(uuid.uuid4())
    mock_auth(mock_supabase_client, user_id)

    (mock_supabase_client.table.return_value
     .select.return_value.eq.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data=None)

    response = client.get(f'/verification/applications/{app_id}',
                          headers={'Authorization': 'Bearer fake-token'})
    assert response.status_code == 404


def test_submit_appeal_success(client, mock_supabase_client):
    """Test POST /verification/appeals/{app_id} for successful submission."""
    user_id = str(uuid.uuid4())
    app_id = str(uuid.uuid4())
    mock_auth(mock_supabase_client, user_id)

    # 1. Mock get_application to return a rejected application
    (mock_supabase_client.table.return_value
     .select.return_value.eq.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={"id": app_id, "user_id": user_id, "status": "rejected"})

    # 2. Mock the update call for the application status
    (mock_supabase_client.table.return_value
     .update.return_value.eq.return_value
     .execute.return_value) = MagicMock(data=[{"status": "appealing"}])

    # 3. Mock the insert call for the new appeal
    appeal_result = {"id": str(uuid.uuid4()), "application_id": app_id, "status": "submitted"}
    (mock_supabase_client.table.return_value
     .insert.return_value
     .execute.return_value) = MagicMock(data=[appeal_result])

    response = client.post(f'/verification/appeals/{app_id}',
                           json={'appeal_reason': 'I provided new documents.'},
                           headers={'Authorization': 'Bearer fake-token'})

    assert response.status_code == 201
    assert response.get_json()['status'] == 'submitted'

def test_submit_appeal_not_rejected(client, mock_supabase_client):
    """Test POST /verification/appeals/{app_id} for an application that is not rejected."""
    user_id = str(uuid.uuid4())
    app_id = str(uuid.uuid4())
    mock_auth(mock_supabase_client, user_id)

    # Mock get_application to return an approved application
    (mock_supabase_client.table.return_value
     .select.return_value.eq.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={"id": app_id, "user_id": user_id, "status": "approved"})

    response = client.post(f'/verification/appeals/{app_id}',
                           json={'appeal_reason': 'I want to appeal anyway.'},
                           headers={'Authorization': 'Bearer fake-token'})

    assert response.status_code == 400
    assert "Only rejected applications can be appealed" in response.get_json()['message']


def test_upload_document_success(client, mock_supabase_client):
    """Test POST /verification/documents/{app_id} for successful upload."""
    import io

    user_id = str(uuid.uuid4())
    app_id = str(uuid.uuid4())
    mock_auth(mock_supabase_client, user_id)

    # 1. Mock the ownership check (get_application)
    (mock_supabase_client.table.return_value
     .select.return_value.eq.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={"id": app_id, "user_id": user_id})

    # 2. Mock the storage upload call
    # The actual call is supabase.storage.from_('...').upload(...)
    # We can mock the final 'upload' part of the chain.
    mock_storage_from = MagicMock()
    mock_supabase_client.storage.from_ = mock_storage_from
    mock_storage_from.return_value.upload.return_value = {"id": "storage-object-id"}

    # 3. Mock the database insert call for the document record
    doc_result = {"id": str(uuid.uuid4()), "application_id": app_id, "file_path": "some/path"}
    (mock_supabase_client.table.return_value
     .insert.return_value
     .execute.return_value) = MagicMock(data=[doc_result])

    # 4. Prepare request data
    data = {
        'document_type': 'government_id',
        'file': (io.BytesIO(b"this is a test file"), 'test.jpg')
    }

    response = client.post(f'/verification/documents/{app_id}',
                           data=data,
                           content_type='multipart/form-data',
                           headers={'Authorization': 'Bearer fake-token'})

    assert response.status_code == 201
    json_data = response.get_json()
    assert json_data['application_id'] == app_id
    assert json_data['file_path'] == "some/path"
