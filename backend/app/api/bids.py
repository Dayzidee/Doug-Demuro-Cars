from flask import Blueprint

# The blueprint variable is named 'bids'
bids = Blueprint('bids', __name__)

@bids.route('/bids', methods=['GET'])
def get_all_bids():
    return "List of bids"
