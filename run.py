from app import create_app
from web3 import Web3
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)