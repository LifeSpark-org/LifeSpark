// Login/Register Toggle
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const showRegisterButton = document.getElementById('showRegisterButton');
const showLoginButton = document.getElementById('showLoginButton');
const loginEmailInput = document.getElementById('loginEmail');

function updateAuthMenu(userData = null) {
    const authMenu = document.getElementById('authMenu');
    if (userData) {
        // Display for logged-in user
        const greeting = translations[currentLanguage]['hello-user'].replace('{name}', userData.name);
        authMenu.innerHTML = `
            <li class="user-greeting">Hello, ${userData.name}</li>
            <li><button onclick="logout()" class="logout-button">Logout</button></li>
        `;
    } else {
        // Display for non-logged-in user
        authMenu.innerHTML = `
            <li><a href="#" onclick="showSection('login')" data-translate="login-register">Login / Register</a></li>
        `;
    }
    // Update translations after menu change
    updateContent();
}

async function logout() {
    try {
        // Remove token from localStorage
        localStorage.removeItem('token');
        
        // Update display
        updateAuthMenu();
        
        // Navigate to home page
        showSection('home');
        
        alert('Logged out successfully!');
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error during logout');
    }
}

function initializeFormToggles() {
    showRegisterButton?.addEventListener('click', () => {
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
    });

    showLoginButton?.addEventListener('click', () => {
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
    });
}

function initializeFormSubmissions() {
    // Registration form handler
    const registerForm = document.getElementById('registerForm');
    registerForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value
        };

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();

            if (response.ok) {
                const code = prompt('Please enter the verification code sent to your email:');
                
                if (code) {
                    const verifyResponse = await fetch('/verify-code', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: formData.email,
                            code: code
                        })
                    });
                    const verifyResult = await verifyResponse.json();
                    
                    if (verifyResponse.ok) {
                        alert('Registration successful!');
                        registerSection.style.display = 'none';
                        loginSection.style.display = 'block';
                        loginEmailInput.value = formData.email;
                    } else {
                        alert(verifyResult.error || 'Invalid verification code');
                    }
                }
            } else {
                alert(result.error || 'Registration failed');
            }
        } catch (error) {
            alert('An error occurred during registration');
        }
    });

    // Login form handler
    const loginForm = document.getElementById('loginForm');
    loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = {
            email: loginEmailInput.value,
            password: document.getElementById('loginPassword').value
        };

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('token', result.token);
                updateAuthMenu({ name: result.name });
                alert('Login successful!');
                showSection('home');
            } else {
                alert(result.error || 'Login failed');
            }
        } catch (error) {
            alert('An error occurred during login');
        }
    });
}

// Check auth state on page load
async function checkAuthState() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch('/check-auth', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                updateAuthMenu(userData);
            } else {
                localStorage.removeItem('token');
                updateAuthMenu();
            }
        } catch (error) {
            console.error('Auth check error:', error);
            localStorage.removeItem('token');
            updateAuthMenu();
        }
    } else {
        updateAuthMenu();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeFormToggles();
    initializeFormSubmissions();
    checkAuthState();
});