// metamask.js

// הגדרות החוזה החכם - גלובליות
// העדכון העיקרי: הכתובת החדשה תואמת את הכתובת בקובץ Config.py
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

// משתנה גלובלי לכתובת הארנק
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
        showNotification('error', 'MetaMask אינו מותקן. אנא התקן אותו כדי לתרום.');
        return false;
    }
    return true;
}

async function connectWallet() {
    // בדיקה אם המשתמש מחובר - אם לא, נציג הודעה ונעביר אותו לדף ההתחברות
    if (!isUserLoggedIn()) {
        showNotification('error', 'עליך להתחבר למערכת לפני חיבור ארנק');
        setTimeout(() => {
            showSection('login');
        }, 1500);
        return;
    }

    if (!checkMetaMask()) {
        return;
    }

    try {
        // הצגת חיווי טעינה
        const connectButton = document.getElementById('connectWallet');
        if (connectButton) {
            connectButton.disabled = true;
            connectButton.innerHTML = '<div class="loader-inline"></div> מתחבר...';
        }

        // בקשת התחברות חדשה
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        window.userWalletAddress = accounts[0];
        
        // עדכון ממשק המשתמש
        const walletStatus = document.getElementById('walletStatus');
        if (walletStatus) {
            walletStatus.textContent = 'Connected: ' + window.userWalletAddress.substring(0, 6) + '...';
            walletStatus.classList.add('connected');
        }

        if (connectButton) {
            connectButton.style.display = 'none';
            connectButton.disabled = false;
            connectButton.innerHTML = '<i class="fas fa-link"></i> <span data-translate="donate-connect-wallet">התחבר לארנק</span>';
        }
        
        // הצגת הודעה מוצלחת
        showNotification('success', 'הארנק חובר בהצלחה!');
            
    } catch (error) {
        console.error('Error connecting to wallet:', error);
        showNotification('error', 'חיבור הארנק נכשל: ' + error.message);
        
        // איפוס הכפתור
        const connectButton = document.getElementById('connectWallet');
        if (connectButton) {
            connectButton.disabled = false;
            connectButton.innerHTML = '<i class="fas fa-link"></i> <span data-translate="donate-connect-wallet">התחבר לארנק</span>';
        }
        
        // במקרה של שגיאה, נוודא שהמצב מאופס
        resetConnection();
    }
}

// פונקציה לבדיקה האם המשתמש מחובר
function isUserLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// האזנה לשינויים בחשבונות
if (window.ethereum) {
    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length === 0) {
            resetConnection();
            showNotification('info', 'הארנק נותק');
        } else {
            window.userWalletAddress = accounts[0];
            const walletStatus = document.getElementById('walletStatus');
            if (walletStatus) {
                walletStatus.textContent = 'Connected: ' + window.userWalletAddress.substring(0, 6) + '...';
                walletStatus.classList.add('connected');
            }
            showNotification('info', 'חשבון הארנק שונה');
        }
    });
    
    // האזנה לשינוי רשת
    window.ethereum.on('chainChanged', function () {
        showNotification('info', 'רשת הבלוקצ\'יין השתנתה, מרענן דף...');
        // מקובל לרענן את הדפדפן בעת שינוי רשת
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    });
}

// אתחול בטעינת העמוד
document.addEventListener('DOMContentLoaded', async function() {
    // קודם כל נאפס את החיבור
    resetConnection();
    
    // בדיקת חיבור קיים
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });
            
            if (accounts.length > 0) {
                // אם יש חיבור קיים, נעדכן את הממשק
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