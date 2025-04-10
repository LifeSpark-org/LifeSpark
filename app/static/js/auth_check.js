// Check auth status when donation section is shown
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for navigation to the donate section
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('[onclick*="showSection(\'donate\'"]') || 
            e.target.closest('[onclick*="showSection(\'donate\'"]')) {
            setTimeout(checkDonationAuth, 100);
        }
    });
    
    // Also check on page load if we're starting on the donation page
    if (window.location.hash === '#donate' || document.getElementById('donate').classList.contains('active')) {
        setTimeout(checkDonationAuth, 100);
    }
});

// Function to check auth state for donation page
function checkDonationAuth() {
    const donationAuthCheck = document.getElementById('donationAuthCheck');
    const donationOptionsContainer = document.getElementById('donationOptionsContainer');
    
    if (!donationAuthCheck || !donationOptionsContainer) return;
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('token') !== null;
    
    if (isLoggedIn) {
        // User is logged in, show donation options
        donationAuthCheck.style.display = 'none';
        donationOptionsContainer.style.display = 'block';
        donationOptionsContainer.classList.remove('disabled-donation-form');
    } else {
        // User is not logged in, show auth message
        donationAuthCheck.style.display = 'block';
        donationOptionsContainer.style.display = 'none';
    }
}

// Add this function to the global scope so it can be called from other places
window.checkDonationAuth = checkDonationAuth;

// Also check donation auth after login/logout
document.addEventListener('authStateChanged', function() {
    // If we're on the donation page, check auth
    if (document.getElementById('donate').classList.contains('active')) {
        checkDonationAuth();
    }
});

// Extend the login success handler to emit the event
const originalLoginSuccess = function(userData) {
    // Store the original behavior we need to preserve
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userData', JSON.stringify(userData));
    updateAuthMenu(userData);
    showNotification('success', 'Login successful!');
    
    // Dispatch auth state changed event
    document.dispatchEvent(new CustomEvent('authStateChanged'));
    
    // Redirect to home page
    setTimeout(() => {
        showSection('home');
    }, 1000);
};

// Override the forms.js login form handler
const originalLoginFormHandler = document.getElementById('loginForm')?.onsubmit;
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').onsubmit = async function(event) {
        event.preventDefault();
        
        // Validate CAPTCHA input
        if (!validateCaptcha('login')) {
            return;
        }
        
        showFormLoading(this);
        
        const formData = {
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value,
            captcha: document.getElementById('loginCaptcha').value
        };

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();

            if (response.ok) {
                // Use our custom handler
                originalLoginSuccess(result);
            } else {
                // If CAPTCHA verification failed, load a new one
                if (result.error && result.error.includes('CAPTCHA')) {
                    loadCaptcha('login');
                    document.getElementById('loginCaptchaError').style.display = 'block';
                } else {
                    showNotification('error', result.error || 'Login failed');
                }
            }
        } catch (error) {
            showNotification('error', 'An error occurred during login');
            loadCaptcha('login');
        }
        
        hideFormLoading(this);
    };
}

// Override the logout function to dispatch event when user logs out
const originalLogout = window.logout;
window.logout = async function() {
    try {
        // Show loading indicator
        const logoutButton = document.querySelector('.logout-button');
        const originalText = logoutButton?.innerHTML || '';
        
        if (logoutButton) {
            logoutButton.disabled = true;
            logoutButton.innerHTML = '<div class="loader-inline"></div> Logging out...';
        }
        
        // Simulate API call (for demonstration)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Remove token and user data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        
        // Update auth menu
        updateAuthMenu();
        
        // Dispatch auth state changed event
        document.dispatchEvent(new CustomEvent('authStateChanged'));
        
        // Show notification
        showNotification('success', 'Logged out successfully!');
        
        // Navigate to home page
        showSection('home');
        
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('error', 'Error during logout');
    }
};