from flask import Blueprint, request, jsonify
from ..services.blockchain import check_balance_and_donate

donations_bp = Blueprint('donations', __name__)

@donations_bp.route('/donate', methods=['POST'])
def donate():
    data = request.json
    region = data.get('region')
    amount = data.get('amount')
    
    try:
        tx_hash = check_balance_and_donate(region, amount)
        return jsonify({
            "status": "success",
            "transaction": tx_hash
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400