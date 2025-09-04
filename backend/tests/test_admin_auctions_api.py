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
    mocker.patch('app.services.auction_service.get_supabase', return_value=mock_client)
    return mock_client

def test_create_auction_success(client, mock_supabase_client):
    """Test POST /auctions for successful creation by an admin."""
    admin_id = str(uuid.uuid4())
    vehicle_id = str(uuid.uuid4())

    # Mock Auth
    mock_user = MagicMock()
    type(mock_user).id = PropertyMock(return_value=admin_id)
    mock_supabase_client.auth.get_user.return_value = MagicMock(user=mock_user)

    # --- Set up mocks for the sequence of DB calls ---
    # 1. Decorator: checks admin role
    profile_mock = MagicMock()
    (profile_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'role': 'admin'})

    # 2. Service: checks vehicle status
    vehicle_select_mock = MagicMock()
    (vehicle_select_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'id': vehicle_id, 'status': 'Available'})

    # 3. Service: inserts new auction
    auction_insert_mock = MagicMock()
    auction_result = {'id': str(uuid.uuid4()), 'vehicle_id': vehicle_id}
    (auction_insert_mock.insert.return_value
     .execute.return_value) = MagicMock(data=[auction_result])

    # 4. Service: updates vehicle status
    vehicle_update_mock = MagicMock()
    (vehicle_update_mock.update.return_value.eq.return_value
     .execute.return_value) = MagicMock(data=[{'status': 'Pending'}])

    # Assign mocks to be consumed in order by the `table` call
    mock_supabase_client.table.side_effect = [
        profile_mock,
        vehicle_select_mock,
        auction_insert_mock,
        vehicle_update_mock
    ]

    auction_data = {
        "vehicle_id": vehicle_id,
        "starting_bid": 50000,
        "starts_at": "2025-10-01T12:00:00Z",
        "ends_at": "2025-10-08T12:00:00Z"
    }
    response = client.post('/auctions', json=auction_data, headers={'Authorization': 'Bearer fake-token'})

    assert response.status_code == 201
    assert response.get_json()['vehicle_id'] == vehicle_id


def test_create_auction_unauthorized(client, mock_supabase_client):
    """Test POST /auctions by a non-admin user."""
    user_id = str(uuid.uuid4())
    # Mock as a regular customer
    mock_user = MagicMock()
    type(mock_user).id = PropertyMock(return_value=user_id)
    mock_supabase_client.auth.get_user.return_value = MagicMock(user=mock_user)

    profile_mock = MagicMock()
    (profile_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'role': 'customer'})
    mock_supabase_client.table.side_effect = lambda table_name: profile_mock if table_name == 'profiles' else MagicMock()

    response = client.post('/auctions', json={}, headers={'Authorization': 'Bearer fake-token'})
    assert response.status_code == 403

def test_create_auction_vehicle_not_available(client, mock_supabase_client):
    """Test POST /auctions for a vehicle that is not available."""
    admin_id = str(uuid.uuid4())
    vehicle_id = str(uuid.uuid4())

    mock_user = MagicMock()
    type(mock_user).id = PropertyMock(return_value=admin_id)
    mock_supabase_client.auth.get_user.return_value = MagicMock(user=mock_user)

    profile_mock = MagicMock()
    (profile_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'role': 'admin'})

    # Mock vehicle check to return a non-available vehicle
    vehicle_mock = MagicMock()
    (vehicle_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'id': vehicle_id, 'status': 'Sold'})

    def table_side_effect(table_name):
        if table_name == 'profiles': return profile_mock
        if table_name == 'vehicles': return vehicle_mock
        return MagicMock()
    mock_supabase_client.table.side_effect = table_side_effect

    auction_data = {"vehicle_id": vehicle_id, "starting_bid": 100}
    response = client.post('/auctions', json=auction_data, headers={'Authorization': 'Bearer fake-token'})

    assert response.status_code == 400
    assert "not available for auction" in response.get_json()['message']
