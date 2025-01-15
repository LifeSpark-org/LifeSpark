from web3 import Web3
from ..config import Config

class BlockchainService:
    def __init__(self):
        self.web3 = Web3(Web3.HTTPProvider(Config.BLOCKCHAIN_URL))
        self.contract = self.web3.eth.contract(
            address=Config.CONTRACT_ADDRESS,
            abi=Config.CONTRACT_ABI
        )
        
    def check_balance_and_donate(self, region, amount):
        balance = self.web3.eth.get_balance(self.sender_address)
        gas = 200000
        gas_price = self.web3.to_wei('50', 'gwei')
        value = self.web3.to_wei(amount, 'ether')
        total_cost = gas * gas_price + value
        
        if balance < total_cost:
            raise ValueError("Insufficient funds in wallet")
            
        return self.donate_to_region(region, amount)
        
    def donate_to_region(self, region, amount):
        nonce = self.web3.eth.get_transaction_count(self.sender_address)
        
        transaction = self.contract.functions.donate(region).build_transaction({
            'chainId': Config.CHAIN_ID,
            'gas': 200000,
            'gasPrice': self.web3.to_wei('50', 'gwei'),
            'nonce': nonce,
            'value': self.web3.to_wei(amount, 'ether')
        })
        
        signed_tx = self.web3.eth.account.sign_transaction(
            transaction,
        )
        
        tx_hash = self.web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        return self.web3.to_hex(tx_hash)

# יצירת מופע יחיד של השירות
blockchain_service = BlockchainService()

# פונקציות עוטפות להקלה על השימוש
def check_balance_and_donate(region, amount):
    return blockchain_service.check_balance_and_donate(region, amount)

def donate_to_region(region, amount):
    return blockchain_service.donate_to_region(region, amount)
