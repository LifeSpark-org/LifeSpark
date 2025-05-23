from web3 import Web3
from ..config import Config

class BlockchainService:
    def __init__(self):
        self.web3 = Web3(Web3.HTTPProvider(Config.BLOCKCHAIN_URL))
        self.contract = self.web3.eth.contract(
            address=Config.CONTRACT_ADDRESS,
            abi=Config.CONTRACT_ABI
        )
        # משתנה לשמירת כתובת השולח - יוגדר ע"י המשתמש דרך ממשק המשתמש
        self.sender_address = None
        
    def set_sender_address(self, address):
        """מגדיר את כתובת השולח לשימוש בעסקאות"""
        self.sender_address = address
        return self.sender_address
        
    def check_balance_and_donate(self, region, amount):
        """בודק את היתרה בארנק ומבצע תרומה"""
        if not self.sender_address:
            raise ValueError("Error: Sender address not defined")
            
        balance = self.web3.eth.get_balance(self.sender_address)
        gas = 200000
        gas_price = self.web3.to_wei('50', 'gwei')
        value = self.web3.to_wei(amount, 'ether')
        total_cost = gas * gas_price + value
        
        if balance < total_cost:
            raise ValueError("Insufficient funds in wallet")
            
        return self.donate_to_region(region, amount)
        

# שירות בלוקצ'יין יחיד
blockchain_service = BlockchainService()

# פונקציות עוטפות
def set_sender_address(address):
    return blockchain_service.set_sender_address(address)

def check_balance_and_donate(region, amount):
    # כאן אנחנו מניחים שהכתובת כבר הוגדרה קודם לכן דרך set_sender_address
    return blockchain_service.check_balance_and_donate(region, amount)

def donate_to_region(region, amount):
    return blockchain_service.donate_to_region(region, amount)

def register_project(self, project_id, beneficiary, goal_amount, region):
    """Register a new project in the smart contract"""
    if not self.sender_address:
        raise ValueError("Error: Sender address not set")
        
    # Ensure the address is a valid string
    if not Web3.is_address(beneficiary):
        raise ValueError(f"Invalid wallet address: {beneficiary}")
    
    nonce = self.web3.eth.get_transaction_count(self.sender_address)
    
    # Convert goal amount to wei
    goal_amount_wei = self.web3.to_wei(goal_amount, 'ether')
    
    # Call registerProject function in the contract
    transaction = self.contract.functions.registerProject(
        project_id,
        beneficiary,
        goal_amount_wei,
        region
    ).build_transaction({
        'chainId': Config.CHAIN_ID,
        'gas': 200000,
        'gasPrice': self.web3.to_wei('50', 'gwei'),
        'nonce': nonce,
        'from': self.sender_address
    })
    return transaction

def register_project(project_id, beneficiary, goal_amount, region):
    return blockchain_service.register_project(project_id, beneficiary, goal_amount, region)