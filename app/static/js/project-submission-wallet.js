// MetaMask connection in project submission form

// Flag for managing success messages
let walletConnectSuccessShown = false;

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the project submission page
    if (document.getElementById('submit-project')) {
        initProjectWalletConnection();
    }
    
    // Listen for section changes
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
        // Check if there's already an existing connection
        if (window.ethereum && window.userWalletAddress) {
            ethereumAddressInput.value = window.userWalletAddress;
            
            // Update button text when there's already a connection
            updateButtonToConnected(connectWalletBtn, window.userWalletAddress);
        }
        
        // Listener for wallet connection button
        connectWalletBtn.addEventListener('click', async function() {
            try {
                // Check if MetaMask is installed
                if (typeof window.ethereum === 'undefined') {
                    window.open('https://metamask.io/download.html', '_blank');
                    showNotification('error', 'MetaMask is not installed. Please install it first.');
                    return;
                }
                
                // Reset flag at start of connection
                walletConnectSuccessShown = false;
                
                // Show loading state
                this.disabled = true;
                this.innerHTML = '<div class="loader-inline"></div> Connecting...';
                
                // Request connection to accounts
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                if (accounts.length > 0) {
                    // Save address in form field
                    ethereumAddressInput.value = accounts[0];
                    window.userWalletAddress = accounts[0];
                    
                    // Show success message only if flag not set
                    if (!walletConnectSuccessShown) {
                        showNotification('success', 'Wallet connected successfully!');
                        walletConnectSuccessShown = true;
                    }
                    
                    // Update button text after successful connection
                    updateButtonToConnected(this, accounts[0]);
                } else {
                    // If no accounts, restore button to normal state
                    this.disabled = false;
                    this.innerHTML = '<i class="fas fa-link"></i> <span data-translate="connect-wallet">Connect MetaMask</span>';
                }
                
            } catch (error) {
                showNotification('error', 'Wallet connection failed: ' + error.message);
                
                // Restore button to normal state
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-link"></i> <span data-translate="connect-wallet">Connect MetaMask</span>';
            }
        });
        
        // Listen for account changes in MetaMask
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', function (accounts) {
                if (accounts.length > 0 && ethereumAddressInput) {
                    ethereumAddressInput.value = accounts[0];
                    window.userWalletAddress = accounts[0];
                    
                    // Update button text when account changes
                    if (connectWalletBtn) {
                        updateButtonToConnected(connectWalletBtn, accounts[0]);
                    }
                } else {
                    // If disconnected, restore button to normal state
                    if (connectWalletBtn) {
                        connectWalletBtn.disabled = false;
                        connectWalletBtn.innerHTML = '<i class="fas fa-link"></i> <span data-translate="connect-wallet">Connect MetaMask</span>';
                    }
                }
            });
        }
    }
}
// New function to update button text when connected
function updateButtonToConnected(button, walletAddress) {
    if (!button) return;
    
    button.disabled = false;
    
    // Display button with shortened address
    const shortAddress = walletAddress.substring(0, 6) + '...' + walletAddress.substring(walletAddress.length - 4);
    button.innerHTML = '<i class="fas fa-check-circle"></i> <span>wallet connected</span>';
    
    // Add style to connected button
    button.classList.add('wallet-connected');
}