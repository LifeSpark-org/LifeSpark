// חיבור MetaMask בטופס הגשת פרויקט

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
                
                // הצגת מצב טעינה
                this.disabled = true;
                this.innerHTML = '<div class="loader-inline"></div> מתחבר...';
                
                // בקשת חיבור לחשבונות
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                if (accounts.length > 0) {
                    // שמירת הכתובת בשדה הטופס
                    ethereumAddressInput.value = accounts[0];
                    window.userWalletAddress = accounts[0];
                    
                    // הצגת הודעת הצלחה
                    showNotification('success', 'הארנק חובר בהצלחה!');
                }
                
                // החזרת הכפתור למצב הרגיל
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-link"></i> <span data-translate="connect-wallet">Connect MetaMask</span>';
                
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
                }
            });
        }
    }
}