// חיבור MetaMask בטופס הגשת פרויקט

// דגל לניהול הודעות הצלחה
let walletConnectSuccessShown = false;

document.addEventListener('DOMContentLoaded', function() {
    // בדיקה אם אנחנו בדף הגשת פרויקט
    if (document.getElementById('submit-project')) {
        initProjectWalletConnection();
    }
    
    // מאזין לשינוי סקשיינים
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail && e.detail.sectionId === 'submit-project') {
            initProjectWalletConnection();
        }
    });
});

function initProjectWalletConnection() {
    const connectWalletBtn = document.getElementById('connectWalletForProject');
    const ethereumAddressInput = document.getElementById('ethereumAddress');
    
    if (connectWalletBtn && ethereumAddressInput) {
        // בדיקה אם יש כבר חיבור קיים
        if (window.ethereum && window.userWalletAddress) {
            ethereumAddressInput.value = window.userWalletAddress;
            
            // עדכון טקסט הכפתור כשיש כבר חיבור
            updateButtonToConnected(connectWalletBtn, window.userWalletAddress);
        }
        
        // מאזין לכפתור חיבור ארנק
        connectWalletBtn.addEventListener('click', async function() {
            try {
                // בדיקה אם MetaMask מותקן
                if (typeof window.ethereum === 'undefined') {
                    window.open('https://metamask.io/download.html', '_blank');
                    showNotification('error', 'MetaMask אינו מותקן. אנא התקן אותו תחילה.');
                    return;
                }
                
                // איפוס הדגל בתחילת החיבור
                walletConnectSuccessShown = false;
                
                // הצגת מצב טעינה
                this.disabled = true;
                this.innerHTML = '<div class="loader-inline"></div> מתחבר...';
                
                // בקשת חיבור לחשבונות
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                if (accounts.length > 0) {
                    // שמירת הכתובת בשדה הטופס
                    ethereumAddressInput.value = accounts[0];
                    window.userWalletAddress = accounts[0];
                    
                    // הצגת הודעת הצלחה רק אם הדגל לא הוגדר
                    if (!walletConnectSuccessShown) {
                        showNotification('success', 'הארנק חובר בהצלחה!');
                        walletConnectSuccessShown = true;
                    }
                    
                    // עדכון טקסט הכפתור לאחר חיבור מוצלח
                    updateButtonToConnected(this, accounts[0]);
                } else {
                    // אם אין חשבונות, החזרת הכפתור למצב הרגיל
                    this.disabled = false;
                    this.innerHTML = '<i class="fas fa-link"></i> <span data-translate="connect-wallet">Connect MetaMask</span>';
                }
                
            } catch (error) {
                console.error('Error connecting wallet:', error);
                showNotification('error', 'חיבור הארנק נכשל: ' + error.message);
                
                // החזרת הכפתור למצב הרגיל
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-link"></i> <span data-translate="connect-wallet">Connect MetaMask</span>';
            }
        });
        
        // מאזין לשינויי חשבון ב-MetaMask
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', function (accounts) {
                if (accounts.length > 0 && ethereumAddressInput) {
                    ethereumAddressInput.value = accounts[0];
                    window.userWalletAddress = accounts[0];
                    
                    // עדכון טקסט הכפתור בעת שינוי חשבון
                    if (connectWalletBtn) {
                        updateButtonToConnected(connectWalletBtn, accounts[0]);
                    }
                } else {
                    // אם התנתק, החזר את הכפתור למצב הרגיל
                    if (connectWalletBtn) {
                        connectWalletBtn.disabled = false;
                        connectWalletBtn.innerHTML = '<i class="fas fa-link"></i> <span data-translate="connect-wallet">Connect MetaMask</span>';
                    }
                }
            });
        }
    }
}
// פונקציה חדשה לעדכון טקסט הכפתור כשמתחבר
function updateButtonToConnected(button, walletAddress) {
    if (!button) return;
    
    button.disabled = false;
    
    // מציג כפתור עם קיצור הכתובת
    const shortAddress = walletAddress.substring(0, 6) + '...' + walletAddress.substring(walletAddress.length - 4);
    button.innerHTML = '<i class="fas fa-check-circle"></i> <span>wallet connected</span>';
    
    // מוסיף סגנון לכפתור מחובר
    button.classList.add('wallet-connected');
}