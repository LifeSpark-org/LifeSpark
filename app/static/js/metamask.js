// metamask.js

// הגדרות החוזה החכם - גלובליות
window.CONTRACT_ADDRESS = "0x54B942Bf5a6D83acEc459828d273Ee9a9046c86A";
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

// משתנה גלובלי לכתובת הארנק
window.userWalletAddress = null;

function resetConnection() {
    window.userWalletAddress = null;
    document.getElementById('walletStatus').textContent = 'Not connected';
    const connectButton = document.getElementById('connectWallet');
    if (connectButton) {
        connectButton.style.display = 'block';
    }
}

function checkMetaMask() {
    if (typeof window.ethereum === 'undefined') {
        window.open('https://metamask.io/download.html', '_blank');
        return false;
    }
    return true;
}

async function connectWallet() {
    if (!checkMetaMask()) {
        return;
    }

    try {
        // ראשית, נתנתק מכל חיבור קיים
        await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{
                eth_accounts: {}
            }]
        });
        
        // עכשיו נבקש חיבור חדש
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        window.userWalletAddress = accounts[0];
        document.getElementById('walletStatus').textContent = 
            'Connected: ' + window.userWalletAddress.substring(0, 6) + '...';
            
        document.getElementById('connectWallet').style.display = 'none';
            
    } catch (error) {
        console.error('Error connecting to wallet:', error);
        document.getElementById('walletStatus').textContent = 'Connection failed';
        // במקרה של שגיאה, נוודא שהמצב מאופס
        resetConnection();
    }
}

// האזנה לשינויים בחשבונות
if (window.ethereum) {
    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length === 0) {
            resetConnection();
        } else {
            window.userWalletAddress = accounts[0];
            document.getElementById('walletStatus').textContent = 
                'Connected: ' + window.userWalletAddress.substring(0, 6) + '...';
        }
    });
}

// אתחול בטעינת העמוד
document.addEventListener('DOMContentLoaded', async function() {
    // קודם כל נאפס את החיבור
    resetConnection();
    
    // ננסה לנתק כל חיבור קיים
    if (window.ethereum) {
        try {
            await window.ethereum.request({
                method: 'eth_accounts'
            }).then(accounts => {
                if (accounts.length > 0) {
                    // אם יש חיבור קיים, נאפס אותו
                    resetConnection();
                }
            });
        } catch (error) {
            console.error('Error checking existing connection:', error);
        }
    }
    
    const connectButton = document.getElementById('connectWallet');
    if (connectButton) {
        connectButton.addEventListener('click', connectWallet);
    }
});