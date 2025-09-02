import pytest
import uuid
from unittest.mock import MagicMock
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
    # Patch the lookup in the service module where it's used
    mocker.patch('app.services.auction_service.get_supabase', return_value=mock_client)
    return mock_client

def test_get_live_auctions_success(client, mock_supabase_client):
    """Test GET /auctions/live for successful retrieval of live auctions."""
    live_auctions_data = [
        {"id": str(uuid.uuid4()), "status": "live", "current_bid": 75000},
        {"id": str(uuid.uuid4()), "status": "live", "current_bid": 22000}
    ]

    # Mock the database response
    (mock_supabase_client.table.return_value
     .select.return_value.eq.return_value
     .execute.return_value) = MagicMock(data=live_auctions_data)

    response = client.get('/auctions/live')

    assert response.status_code == 200
    json_data = response.get_json()
    assert len(json_data) == 2
    assert json_data[0]['status'] == 'live'
    assert json_data[1]['current_bid'] == 22000


def test_get_auction_success(client, mock_supabase_client):
    """Test GET /auctions/{id} for successful retrieval."""
    auction_id = str(uuid.uuid4())
    auction_data = {"id": auction_id, "status": "live", "current_bid": 12345}

    (mock_supabase_client.table.return_value
     .select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data=auction_data)

    response = client.get(f'/auctions/{auction_id}')

    assert response.status_code == 200
    assert response.get_json() == auction_data

def test_get_auction_not_found(client, mock_supabase_client):
    """Test GET /auctions/{id} for a non-existent auction."""
    auction_id = str(uuid.uuid4())

    (mock_supabase_client.table.return_value
     .select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data=None)

    response = client.get(f'/auctions/{auction_id}')

    assert response.status_code == 404
    assert "not found" in response.get_json()['message']
