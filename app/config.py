import os
from datetime import timedelta


class Config:
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    
    # MongoDB
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/lifeSparkDB'

    # Email settings
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'lifesparkAuth@gmail.com'  # שנה לאימייל שלך
    MAIL_PASSWORD = 'qzjk zcta qtmq otqf'     # שנה לסיסמת האפליקציה שלך
    MAIL_DEFAULT_SENDER = 'lifesparkAuth@gmail.com'    
    
    # Blockchain
    BLOCKCHAIN_URL = os.environ.get('BLOCKCHAIN_URL') or 'http://127.0.0.1:7545'
    CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138"
    CHAIN_ID = 1337

    # Google reCAPTCHA v2 - עדכון למפתחות גרסה 2
    RECAPTCHA_SITE_KEY = '6LeYjA4rAAAAACw9czE2uPiE6jyHJuB8QhOda8-y'  # יש להחליף במפתח האמיתי שלך
    RECAPTCHA_SECRET_KEY = '6LeYjA4rAAAAACJo0geQstFMrDSoreqhVuGzULmT'  # יש להחליף במפתח האמיתי שלך
   
    # Contract ABI
    CONTRACT_ABI = [
 {
        "inputs": [
            {"internalType": "string", "name": "region", "type": "string"}
        ],
        "name": "donate",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "region", "type": "string"}
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "", "type": "string"}
        ],
        "name": "balances",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "region", "type": "string"}
        ],
        "name": "getBalance",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {"internalType": "address", "name": "", "type": "address"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]