// Custom CAPTCHA handling

// Load CAPTCHA images when login/register forms are shown
document.addEventListener('DOMContentLoaded', () => {
    // Initialize captcha for login form if visible
    if (document.getElementById('loginSection').style.display !== 'none') {
        loadCaptcha('login');
    }
    
    // Setup refresh buttons for captchas
    setupCaptchaRefresh();
    
    // Handle form toggle for loading appropriate captcha
    const showRegisterButton = document.getElementById('showRegisterButton');
    const showLoginButton = document.getElementById('showLoginButton');
    
    if (showRegisterButton) {
        showRegisterButton.addEventListener('click', () => {
            loadCaptcha('register');
        });
    }
    
    if (showLoginButton) {
        showLoginButton.addEventListener('click', () => {
            loadCaptcha('login');
        });
    }
});

// Function to load a new CAPTCHA
function loadCaptcha(formType) {
    const captchaImage = document.getElementById(`${formType}CaptchaImage`);
    
    if (!captchaImage) return;
    
    // Show loading state
    captchaImage.src = '';
    captchaImage.classList.add('loading');
    
    // Fetch new CAPTCHA from server
    fetch('/generate-captcha')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load CAPTCHA');
            }
            return response.json();
        })
        .then(data => {
            captchaImage.src = data.image;
            captchaImage.classList.remove('loading');
        })
        .catch(error => {
            console.error('Error loading CAPTCHA:', error);
            captchaImage.classList.remove('loading');
            // Fallback message on error
            captchaImage.alt = 'CAPTCHA loading failed. Please refresh.';
        });
}

// Setup refresh buttons for captchas
function setupCaptchaRefresh() {
    const refreshLoginButton = document.getElementById('refreshLoginCaptcha');
    const refreshRegisterButton = document.getElementById('refreshRegisterCaptcha');
    
    if (refreshLoginButton) {
        refreshLoginButton.addEventListener('click', (e) => {
            e.preventDefault();
            loadCaptcha('login');
        });
    }
    
    if (refreshRegisterButton) {
        refreshRegisterButton.addEventListener('click', (e) => {
            e.preventDefault();
            loadCaptcha('register');
        });
    }
}

// Function to check if CAPTCHA is filled
function validateCaptcha(formType) {
    const captchaInput = document.getElementById(`${formType}Captcha`);
    const captchaError = document.getElementById(`${formType}CaptchaError`);
    
    if (!captchaInput || !captchaError) return true;
    
    if (!captchaInput.value.trim()) {
        captchaError.style.display = 'block';
        captchaInput.focus();
        return false;
    }
    
    captchaError.style.display = 'none';
    return true;
}