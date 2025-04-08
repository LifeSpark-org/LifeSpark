// Enhanced Form Interactions
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all form elements
    initializeFormToggles();
    initializeFormSubmissions();
    initializePasswordStrength();
    initializeAccordion();
    initializeAmountSuggestions();
    initializeDonationSummary();
    checkAuthState();
});

// Authentication Section Toggles
function initializeFormToggles() {
    const showRegisterButton = document.getElementById('showRegisterButton');
    const showLoginButton = document.getElementById('showLoginButton');
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');

    showRegisterButton?.addEventListener('click', () => {
        if (loginSection && registerSection) {
            loginSection.style.display = 'none';
            registerSection.style.display = 'block';
            
            // Animate entrance
            registerSection.classList.add('fade-in');
            setTimeout(() => {
                registerSection.classList.remove('fade-in');
            }, 500);
            
            // איפוס CAPTCHA
            resetCaptcha();
        }
    });

    showLoginButton?.addEventListener('click', () => {
        if (loginSection && registerSection) {
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
            
            // Animate entrance
            loginSection.classList.add('fade-in');
            setTimeout(() => {
                loginSection.classList.remove('fade-in');
            }, 500);
            
            // איפוס CAPTCHA
            resetCaptcha();
        }
    });
}

// Password strength meter
function initializePasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    const strengthSegments = document.querySelectorAll('.strength-segment');
    const strengthText = document.querySelector('.strength-text');
    
    if (!passwordInput || !strengthSegments.length || !strengthText) return;
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        // Reset segments
        strengthSegments.forEach(segment => {
            segment.classList.remove('weak', 'medium', 'strong', 'very-strong');
        });
        
        if (password.length === 0) {
            strengthText.textContent = 'Password strength';
            strengthText.className = 'strength-text';
            return;
        }
        
        // Length check
        if (password.length >= 8) strength += 1;
        
        // Complexity checks
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Update strength meter
        for (let i = 0; i < strength; i++) {
            if (strengthSegments[i]) {
                switch(strength) {
                    case 1:
                        strengthSegments[i].classList.add('weak');
                        break;
                    case 2:
                        strengthSegments[i].classList.add('medium');
                        break;
                    case 3:
                        strengthSegments[i].classList.add('strong');
                        break;
                    case 4:
                        strengthSegments[i].classList.add('very-strong');
                        break;
                }
            }
        }
        
        // Update text
        switch(strength) {
            case 1:
                strengthText.textContent = 'Weak';
                strengthText.className = 'strength-text weak';
                break;
            case 2:
                strengthText.textContent = 'Medium';
                strengthText.className = 'strength-text medium';
                break;
            case 3:
                strengthText.textContent = 'Strong';
                strengthText.className = 'strength-text strong';
                break;
            case 4:
                strengthText.textContent = 'Very Strong';
                strengthText.className = 'strength-text very-strong';
                break;
        }
    });
}

// Initialize accordion for FAQs
function initializeAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        const icon = item.querySelector('.accordion-icon i');
        
        if (header && content && icon) {
            header.addEventListener('click', () => {
                // Toggle active class
                item.classList.toggle('active');
                
                // Toggle icon
                if (item.classList.contains('active')) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                    content.style.maxHeight = '0';
                }
            });
        }
    });
}

// Initialize amount suggestions for donation
function initializeAmountSuggestions() {
    const suggestionButtons = document.querySelectorAll('.amount-suggestion');
    const amountInput = document.getElementById('amount');
    
    if (!suggestionButtons.length || !amountInput) return;
    
    suggestionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            if (value) {
                amountInput.value = value;
                
                // Update summary
                updateDonationSummary();
                
                // Highlight selected button
                suggestionButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            }
        });
    });
    
    // Listen for direct input changes
    amountInput.addEventListener('input', () => {
        // Remove highlight from buttons when manually entering amount
        suggestionButtons.forEach(btn => btn.classList.remove('active'));
        
        // Update summary
        updateDonationSummary();
    });
}

// Initialize donation summary
function initializeDonationSummary() {
    const amountInput = document.getElementById('amount');
    const regionInputs = document.querySelectorAll('input[name="region"]');
    
    if (!amountInput) return;
    
    // Initial update
    updateDonationSummary();
    
    // Listen for region selection changes
    regionInputs.forEach(input => {
        input.addEventListener('change', updateDonationSummary);
    });
}

// Update donation summary
function updateDonationSummary() {
    const amountInput = document.getElementById('amount');
    const selectedRegion = document.querySelector('input[name="region"]:checked');
    const summaryRegion = document.getElementById('summaryRegion');
    const summaryAmount = document.getElementById('summaryAmount');
    const summaryGasFee = document.getElementById('summaryGasFee');
    const summaryTotal = document.getElementById('summaryTotal');
    
    if (!amountInput || !selectedRegion || !summaryAmount || !summaryTotal) return;
    
    const amount = parseFloat(amountInput.value) || 0;
    const gasFee = 0.001; // Estimated gas fee in ETH
    const total = amount + gasFee;
    
    // Update region name in summary
    if (summaryRegion) {
        const regionLabel = selectedRegion.parentElement.querySelector('h4')?.textContent || selectedRegion.value;
        summaryRegion.textContent = regionLabel;
    }
    
    // Update amount values
    summaryAmount.textContent = `${amount.toFixed(4)} ETH`;
    if (summaryGasFee) summaryGasFee.textContent = `~ ${gasFee.toFixed(4)} ETH`;
    summaryTotal.textContent = `${total.toFixed(4)} ETH`;
}

// Region selection function
function selectRegion(region) {
    const radioInput = document.getElementById(`region${region.charAt(0).toUpperCase() + region.slice(1)}`);
    if (radioInput) {
        radioInput.checked = true;
        
        // Highlight the selected region card
        const regionCards = document.querySelectorAll('.region-card');
        regionCards.forEach(card => {
            card.classList.remove('selected');
        });
        
        radioInput.parentElement.querySelector('.region-card').classList.add('selected');
        
        // Update the summary
        updateDonationSummary();
    }
}

// פונקציה לאיפוס ה-CAPTCHA
function resetCaptcha() {
    if (typeof grecaptcha !== 'undefined') {
        try {
            grecaptcha.reset(0); // איפוס CAPTCHA בטופס הרשמה
            grecaptcha.reset(1); // איפוס CAPTCHA בטופס התחברות
        } catch (e) {
            console.log('Error resetting CAPTCHA:', e);
        }
    }
}

// Form submissions
function initializeFormSubmissions() {
    // Registration form handler
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const contactForm = document.getElementById('contactForm');
    const loginEmailInput = document.getElementById('loginEmail');
    
    // Registration form
    registerForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // בדיקת CAPTCHA
        const recaptchaResponse = grecaptcha.getResponse(0); // משתמש בתיבת ה-CAPTCHA הראשונה
        if (!recaptchaResponse) {
            document.getElementById('registerCaptchaError').style.display = 'block';
            return;
        } else {
            document.getElementById('registerCaptchaError').style.display = 'none';
        }
        
        showFormLoading(registerForm);
        
        const formData = {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value,
            recaptcha: recaptchaResponse  // הוספת תגובת ה-CAPTCHA לנתונים שנשלחים
        };

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();

            if (response.ok) {
                const verificationModal = createVerificationModal(formData.email);
                document.body.appendChild(verificationModal);
                showModal(verificationModal);
                
                // Add event listener for verification code submission
                const verifyForm = verificationModal.querySelector('#verificationForm');
                verifyForm?.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const codeInput = verificationModal.querySelector('#verificationCode');
                    
                    if (codeInput) {
                        const code = codeInput.value;
                        
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
                            hideModal(verificationModal);
                            showNotification('success', 'Registration successful!');
                            
                            // Switch to login section with the email pre-filled
                            const registerSection = document.getElementById('registerSection');
                            const loginSection = document.getElementById('loginSection');
                            if (registerSection && loginSection && loginEmailInput) {
                                registerSection.style.display = 'none';
                                loginSection.style.display = 'block';
                                loginEmailInput.value = formData.email;
                            }
                        } else {
                            showNotification('error', verifyResult.error || 'Invalid verification code');
                        }
                    }
                });
            } else {
                showNotification('error', result.error || 'Registration failed');
            }
        } catch (error) {
            showNotification('error', 'An error occurred during registration');
        }
        
        hideFormLoading(registerForm);
    });

    // Login form handler
    loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // בדיקת CAPTCHA
        const recaptchaResponse = grecaptcha.getResponse(1); // משתמש בתיבת ה-CAPTCHA השנייה
        if (!recaptchaResponse) {
            document.getElementById('loginCaptchaError').style.display = 'block';
            return;
        } else {
            document.getElementById('loginCaptchaError').style.display = 'none';
        }
        
        showFormLoading(loginForm);
        
        const formData = {
            email: loginEmailInput.value,
            password: document.getElementById('loginPassword').value,
            recaptcha: recaptchaResponse  // הוספת תגובת ה-CAPTCHA לנתונים שנשלחים
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
                
                // Store basic user data
                const userData = {
                    name: result.name,
                    email: formData.email
                };
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Update auth menu
                updateAuthMenu(userData);
                
                showNotification('success', 'Login successful!');
                
                // Redirect to home page
                setTimeout(() => {
                    showSection('home');
                }, 1000);
            } else {
                showNotification('error', result.error || 'Login failed');
            }
        } catch (error) {
            showNotification('error', 'An error occurred during login');
        }
        
        hideFormLoading(loginForm);
    });
    
    // Contact form handler
    contactForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        showFormLoading(contactForm);
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject')?.value || 'Contact Form Submission',
            message: document.getElementById('message').value
        };
        
        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        const formStatus = document.getElementById('formStatus');
        if (formStatus) {
            formStatus.className = 'form-status success';
            formStatus.textContent = 'Message sent successfully! We will get back to you soon.';
            
            // Clear form
            contactForm.reset();
            
            // Hide status after 5 seconds
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        }
        
        hideFormLoading(contactForm);
    });
}

// Show loading state on form
function showFormLoading(form) {
    if (!form) return;
    
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        
        // Store original text
        submitButton.dataset.originalText = submitButton.innerHTML;
        
        // Replace with loader
        submitButton.innerHTML = '<div class="loader-inline"></div> Processing...';
    }
    
    // Disable all inputs
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.disabled = true;
    });
}

// Hide loading state on form
function hideFormLoading(form) {
    if (!form) return;
    
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = false;
        
        // Restore original text
        if (submitButton.dataset.originalText) {
            submitButton.innerHTML = submitButton.dataset.originalText;
        }
    }
    
    // Enable all inputs
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.disabled = false;
    });
}

// Create verification modal
function createVerificationModal(email) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'verificationModal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Verify Your Email</h3>
                <button class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <p>We've sent a verification code to <strong>${email}</strong>.</p>
                <p>Please enter the 6-digit code below:</p>
                
                <form id="verificationForm" class="verification-form">
                    <div class="verification-code-input">
                        <input type="text" id="verificationCode" maxlength="6" placeholder="000000" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Verify</button>
                </form>
                
                <div class="resend-link">
                    <p>Didn't receive the code? <a href="#" id="resendCodeLink">Resend code</a></p>
                </div>
            </div>
        </div>
    `;
    
    // Add event listener for closing the modal
    const closeButton = modal.querySelector('.close-button');
    closeButton?.addEventListener('click', () => {
        hideModal(modal);
    });
    
    // Add event listener for clicking outside the modal
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal(modal);
        }
    });
    
    // Add event listener for resending code
    const resendLink = modal.querySelector('#resendCodeLink');
    resendLink?.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Disable the link temporarily
        resendLink.style.pointerEvents = 'none';
        resendLink.textContent = 'Sending...';
        
        // Simulate resending code (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        resendLink.textContent = 'Code resent!';
        
        // Reset the link after 3 seconds
        setTimeout(() => {
            resendLink.textContent = 'Resend code';
            resendLink.style.pointerEvents = 'auto';
        }, 3000);
    });
    
    return modal;
}

// Show modal
function showModal(modal) {
    if (!modal) return;
    
    document.body.style.overflow = 'hidden';
    modal.style.display = 'flex';
    
    // Animate entrance
    setTimeout(() => {
        modal.style.opacity = '1';
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'translateY(0)';
        }
    }, 10);
}

// Hide modal
function hideModal(modal) {
    if (!modal) return;
    
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.transform = 'translateY(-20px)';
    }
    
    modal.style.opacity = '0';
    
    // Remove after animation completes
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Optional: remove from DOM
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// Show notification
function showNotification(type, message) {
    // Check if a notification container exists, if not create one
    let notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle"></i>';
            break;
    }
    
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">${message}</div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Add event listener for closing
    const closeButton = notification.querySelector('.notification-close');
    closeButton?.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Show notification with animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Automatically close after 5 seconds for success/info
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            closeNotification(notification);
        }, 5000);
    }
}

// Close notification
function closeNotification(notification) {
    if (!notification) return;
    
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    // Remove after animation completes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Update auth menu based on login state
function updateAuthMenu(userData = null) {
    const authMenu = document.getElementById('authMenu');
    if (!authMenu) return;
    
    if (userData) {
        // Display for logged-in user
        const greeting = translations[currentLanguage]?.['hello-user'] || 'Hello, {name}';
        const formattedGreeting = greeting.replace('{name}', userData.name);
        
        authMenu.innerHTML = `
            <li class="user-greeting">${formattedGreeting}</li>
            <li><button onclick="logout()" class="logout-button"><i class="fas fa-sign-out-alt"></i> <span data-translate="logout">Logout</span></button></li>
        `;
    } else {
        // Display for non-logged-in user
        authMenu.innerHTML = `
            <li><a href="#" onclick="showSection('login')" data-translate="login-register"><i class="fas fa-user"></i> Login / Register</a></li>
        `;
    }
    
    // Update translations after menu change
    updateContent();
}

// Logout function
async function logout() {
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
        
        // Show notification
        showNotification('success', 'Logged out successfully!');
        
        // Navigate to home page
        showSection('home');
        
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('error', 'Error during logout');
    }
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
                
                // Save data to localStorage for offline access
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Update auth menu
                updateAuthMenu(userData);
            } else {
                // Token invalid or expired
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                updateAuthMenu();
            }
        } catch (error) {
            console.error('Auth check error:', error);
            
            // If offline, try to use cached user data
            const cachedUserData = localStorage.getItem('userData');
            if (cachedUserData) {
                try {
                    const userData = JSON.parse(cachedUserData);
                    updateAuthMenu(userData);
                } catch (e) {
                    // Invalid JSON, clear data
                    localStorage.removeItem('userData');
                    updateAuthMenu();
                }
            } else {
                updateAuthMenu();
            }
        }
    } else {
        updateAuthMenu();
    }
}

// הוסף פונקציה חדשה לביצוע reCAPTCHA v3
async function executeRecaptcha(action) {
    return new Promise((resolve) => {
        grecaptcha.ready(function() {
            grecaptcha.execute('6Le3fw4rAAAAAK3_rqyMtMcd0ierf1yIzlc8zwVe', {action: action})
            .then(function(token) {
                resolve(token);
            });
        });
    });
}

// עדכן את הטיפול בטופס ההרשמה
registerForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    showFormLoading(registerForm);
    
    try {
        // קבלת טוקן reCAPTCHA v3
        const recaptchaToken = await executeRecaptcha('register');
        
        const formData = {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value,
            recaptcha: recaptchaToken  // הוספת תגובת ה-CAPTCHA לנתונים שנשלחים
        };
        
        // שאר הקוד נשאר זהה
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        // המשך כמו קודם...
    } catch (error) {
        showNotification('error', 'An error occurred during registration');
    } finally {
        hideFormLoading(registerForm);
    }
});

// עדכן את הטיפול בטופס ההתחברות באופן דומה
loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    showFormLoading(loginForm);
    
    try {
        // קבלת טוקן reCAPTCHA v3
        const recaptchaToken = await executeRecaptcha('login');
        
        const formData = {
            email: loginEmailInput.value,
            password: document.getElementById('loginPassword').value,
            recaptcha: recaptchaToken  // הוספת תגובת ה-CAPTCHA לנתונים שנשלחים
        };
        
        // שאר הקוד נשאר זהה...
    } catch (error) {
        showNotification('error', 'An error occurred during login');
    } finally {
        hideFormLoading(loginForm);
    }
});