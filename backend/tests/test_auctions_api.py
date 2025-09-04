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
    mocker.patch('app.services.auction_service.get_supabase', return_value=mock_client)
    return mock_client

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


def test_get_bid_history_success(client, mock_supabase_client):
    """Test GET /auctions/{id}/bid-history for successful retrieval."""
    auction_id = str(uuid.uuid4())
    bid_history_data = [
        {'id': str(uuid.uuid4()), 'amount': 1100, 'bid_time': '2025-10-01T12:05:00Z'},
        {'id': str(uuid.uuid4()), 'amount': 1000, 'bid_time': '2025-10-01T12:00:00Z'}
    ]

    (mock_supabase_client.table.return_value
     .select.return_value.eq.return_value.order.return_value
     .execute.return_value) = MagicMock(data=bid_history_data)

    response = client.get(f'/auctions/{auction_id}/bid-history')

    assert response.status_code == 200
    json_data = response.get_json()
    assert len(json_data) == 2
    assert json_data[0]['amount'] == 1100
