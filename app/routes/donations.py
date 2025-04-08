from flask import Blueprint, request, jsonify
from ..services.blockchain import blockchain_service, check_balance_and_donate, set_sender_address

donations_bp = Blueprint('donations', __name__)

@donations_bp.route('/donate', methods=['POST'])
def donate():
    data = request.json
    region = data.get('region')
    amount = data.get('amount')
    sender_address = data.get('sender_address')
    
    if not region or not amount or not sender_address:
        return jsonify({
            "status": "error",
            "message": "חסרים פרטים נדרשים (אזור, סכום או כתובת השולח)"
        }), 400
    
    try:
        # הגדרת כתובת השולח בשירות הבלוקצ'יין
        set_sender_address(sender_address)
        
        # בדיקת יתרה וביצוע תרומה
        tx_hash = check_balance_and_donate(region, amount)
        
        return jsonify({
            "status": "success",
            "transaction": tx_hash
        })
    except ValueError as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"שגיאה בלתי צפויה: {str(e)}"
        }), 500

@donations_bp.route('/get_transaction', methods=['POST'])
def get_transaction():
    """יצירת עסקה לחתימה בצד הלקוח"""
    data = request.json
    region = data.get('region')
    amount = data.get('amount')
    sender_address = data.get('sender_address')
    
    if not region or not amount or not sender_address:
        return jsonify({
            "status": "error",
            "message": "חסרים פרטים נדרשים (אזור, סכום או כתובת השולח)"
        }), 400
    
    try:
        # הגדרת כתובת השולח בשירות הבלוקצ'יין
        set_sender_address(sender_address)
        
        # יצירת עסקה (ללא חתימה או שליחה)
        transaction = blockchain_service.donate_to_region(region, amount)
        
        # החזרת נתוני העסקה כדי שהלקוח יוכל לחתום עליה
        return jsonify({
            "status": "success",
            "transaction": transaction
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400