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
    # Patch the lookup in both the security and service modules
    mocker.patch('app.core.security.get_supabase', return_value=mock_client)
    mocker.patch('app.services.auction_service.get_supabase', return_value=mock_client)
    return mock_client

# Helper to mock the authentication part
def mock_auth(mock_client, user_id, role='customer'):
    mock_user = MagicMock()
    type(mock_user).id = PropertyMock(return_value=user_id)
    mock_auth_response = MagicMock()
    type(mock_auth_response).user = mock_user
    mock_client.auth.get_user.return_value = mock_auth_response

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


def test_place_bid_success(client, mock_supabase_client):
    """Test POST /auctions/{id}/bids for a successful bid."""
    user_id = str(uuid.uuid4())
    auction_id = str(uuid.uuid4())

    # Mock Auth
    mock_user = MagicMock()
    type(mock_user).id = PropertyMock(return_value=user_id)
    mock_supabase_client.auth.get_user.return_value = MagicMock(user=mock_user)

    # --- Mock the sequence of DB calls ---
    # 1. Get auction details
    auction_details_mock = MagicMock()
    (auction_details_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={
         'id': auction_id, 'status': 'live', 'current_bid': 1000, 'min_verification_tier': 'basic'
     })

    # 2. Get user profile
    profile_mock = MagicMock()
    (profile_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'verification_tier': 'basic'})

    # 3. Insert new bid
    bid_insert_mock = MagicMock()
    (bid_insert_mock.insert.return_value
     .execute.return_value) = MagicMock(data=[{'id': 'new-bid-id', 'amount': 1100}])

    # 4. Update auction
    auction_update_mock = MagicMock()
    (auction_update_mock.update.return_value.eq.return_value
     .execute.return_value) = MagicMock(data=[{'current_bid': 1100}])

    mock_supabase_client.table.side_effect = [
        auction_details_mock,
        profile_mock,
        bid_insert_mock,
        auction_update_mock
    ]

    response = client.post(f'/auctions/{auction_id}/bids',
                           json={'amount': 1100},
                           headers={'Authorization': 'Bearer fake-token'})

    assert response.status_code == 201
    assert response.get_json()['amount'] == 1100


def test_place_bid_too_low(client, mock_supabase_client):
    """Test bidding less than or equal to the current bid."""
    user_id = str(uuid.uuid4())
    auction_id = str(uuid.uuid4())
    mock_auth(mock_supabase_client, user_id)

    auction_details_mock = MagicMock()
    (auction_details_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'id': auction_id, 'status': 'live', 'current_bid': 1000})

    profile_mock = MagicMock()
    (profile_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'verification_tier': 'basic'})

    mock_supabase_client.table.side_effect = [auction_details_mock, profile_mock]

    response = client.post(f'/auctions/{auction_id}/bids',
                           json={'amount': 1000},
                           headers={'Authorization': 'Bearer fake-token'})

    assert response.status_code == 400
    assert "must be greater than the current bid" in response.get_json()['message']

def test_place_bid_on_closed_auction(client, mock_supabase_client):
    """Test bidding on an auction that is not live."""
    user_id = str(uuid.uuid4())
    auction_id = str(uuid.uuid4())
    mock_auth(mock_supabase_client, user_id)

    auction_details_mock = MagicMock()
    (auction_details_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'id': auction_id, 'status': 'ended', 'current_bid': 1000})

    profile_mock = MagicMock()
    (profile_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'verification_tier': 'basic'})

    mock_supabase_client.table.side_effect = [auction_details_mock, profile_mock]

    response = client.post(f'/auctions/{auction_id}/bids',
                           json={'amount': 1100},
                           headers={'Authorization': 'Bearer fake-token'})

    assert response.status_code == 400
    assert "only be placed on live auctions" in response.get_json()['message']

def test_place_bid_user_not_verified(client, mock_supabase_client):
    """Test bidding when user verification is too low."""
    user_id = str(uuid.uuid4())
    auction_id = str(uuid.uuid4())
    mock_auth(mock_supabase_client, user_id, 'none') # User has no verification tier

    auction_details_mock = MagicMock()
    (auction_details_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={
         'id': auction_id, 'status': 'live', 'current_bid': 1000, 'min_verification_tier': 'basic'
     })

    profile_mock = MagicMock()
    (profile_mock.select.return_value.eq.return_value.single.return_value
     .execute.return_value) = MagicMock(data={'verification_tier': 'none'})

    mock_supabase_client.table.side_effect = [auction_details_mock, profile_mock]

    response = client.post(f'/auctions/{auction_id}/bids',
                           json={'amount': 1100},
                           headers={'Authorization': 'Bearer fake-token'})

    assert response.status_code == 400
    assert "does not meet the minimum requirement" in response.get_json()['message']
