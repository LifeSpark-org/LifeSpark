// metamask.js

// Smart contract settings - global
// Main update: The new address matches the address in Config.py
window.CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";
window.CONTRACT_ABI = [
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
];

// Global variable for wallet address
window.userWalletAddress = null;

function resetConnection() {
    window.userWalletAddress = null;
    const walletStatus = document.getElementById('walletStatus');
    if (walletStatus) {
        walletStatus.textContent = 'Not connected';
        walletStatus.classList.remove('connected');
    }
    const connectButton = document.getElementById('connectWallet');
    if (connectButton) {
        connectButton.style.display = 'block';
    }
}

function checkMetaMask() {
    if (typeof window.ethereum === 'undefined') {
        window.open('https://metamask.io/download.html', '_blank');
        showNotification('error', 'MetaMask is not installed. Please install it to donate.');
        return false;
    }
    return true;
}

async function connectWallet() {
    // Check if user is logged in - if not, show message and redirect to login page
    if (!isUserLoggedIn()) {
        showNotification('error', 'You must log in to the system before connecting a wallet');
        setTimeout(() => {
            showSection('login');
        }, 1500);
        return;
    }

    if (!checkMetaMask()) {
        return;
    }

    try {
        // Show loading indicator
        const connectButton = document.getElementById('connectWallet');
        if (connectButton) {
            connectButton.disabled = true;
            connectButton.innerHTML = '<div class="loader-inline"></div> Connecting...';
        }

        // Request new connection
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        window.userWalletAddress = accounts[0];
        
        // Update user interface
        const walletStatus = document.getElementById('walletStatus');
        if (walletStatus) {
            walletStatus.textContent = 'Connected: ' + window.userWalletAddress.substring(0, 6) + '...';
            walletStatus.classList.add('connected');
        }

        if (connectButton) {
            connectButton.style.display = 'none';
            connectButton.disabled = false;
            connectButton.innerHTML = '<i class="fas fa-link"></i> <span data-translate="donate-connect-wallet">Connect to wallet</span>';
        }
        
        // Show success message
        showNotification('success', 'Wallet connected successfully!');
            
    } catch (error) {
        showNotification('error', 'Wallet connection failed: ' + error.message);
        
        // Reset the button
        const connectButton = document.getElementById('connectWallet');
        if (connectButton) {
            connectButton.disabled = false;
            connectButton.innerHTML = '<i class="fas fa-link"></i> <span data-translate="donate-connect-wallet">Connect to wallet</span>';
        }
        
        // In case of error, make sure the state is reset
        resetConnection();
    }
}

// Function to check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Listen for account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length === 0) {
            resetConnection();
            showNotification('info', 'Wallet disconnected');
        } else {
            window.userWalletAddress = accounts[0];
            const walletStatus = document.getElementById('walletStatus');
            if (walletStatus) {
                walletStatus.textContent = 'Connected: ' + window.userWalletAddress.substring(0, 6) + '...';
                walletStatus.classList.add('connected');
            }
            showNotification('info', 'Wallet account changed');
        }
    });
    
    // Listen for network change
    window.ethereum.on('chainChanged', function () {
        showNotification('info', 'Blockchain network changed, refreshing page...');
        // It's common to refresh the browser when the network changes
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    // First reset the connection
    resetConnection();
    
    // Check for existing connection
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });
            
            if (accounts.length > 0) {
                // If there's an existing connection, update the interface
                window.userWalletAddress = accounts[0];
                
                const walletStatus = document.getElementById('walletStatus');
                if (walletStatus) {
                    walletStatus.textContent = 'Connected: ' + window.userWalletAddress.substring(0, 6) + '...';
                    walletStatus.classList.add('connected');
                }
                
                const connectButton = document.getElementById('connectWallet');
                if (connectButton) {
                    connectButton.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error checking existing connection:', error);
        }
    }
    
    const connectButton = document.getElementById('connectWallet');
    if (connectButton) {
        connectButton.addEventListener('click', connectWallet);
    }
});