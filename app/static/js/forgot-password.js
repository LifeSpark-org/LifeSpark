// הוספת פונקציונליות לכפתור "שכחתי סיסמה"
document.addEventListener('DOMContentLoaded', function() {
    // קישור לפתיחת מודל "שכחתי סיסמה"
    const forgotPasswordLink = document.querySelector('.forgot-password');
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // יצירת מודל שכחתי סיסמה
            const modal = createForgotPasswordModal();
            document.body.appendChild(modal);
            showModal(modal);
        });
    }
});

// פונקציית עזר לניקוי שדות הטופס
function clearResetPasswordFields(modalElement) {
    const resetCode = modalElement.querySelector('#resetCode');
    const newPassword = modalElement.querySelector('#newPassword');
    const confirmNewPassword = modalElement.querySelector('#confirmNewPassword');
    
    if (resetCode) resetCode.value = '';
    if (newPassword) newPassword.value = '';
    if (confirmNewPassword) confirmNewPassword.value = '';
}

// פונקציה ליצירת מודל שכחתי סיסמה
function createForgotPasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'forgotPasswordModal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 data-translate="forgot-password-title">Password Reset</h3>
                <button class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <p data-translate="forgot-password-instruction">Please enter your email address and we'll send you a password reset code:</p>
                
                <div id="forgotPasswordStep1">
                    <form id="forgotPasswordForm" class="auth-form">
                        <div class="form-group">
                            <label for="resetEmail" data-translate="login-email">Email:</label>
                            <div class="input-with-icon">
                                <input type="email" id="resetEmail" required>
                                <i class="fas fa-envelope input-icon"></i>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary" data-translate="forgot-password-submit">
                            <i class="fas fa-paper-plane"></i> Send reset code
                        </button>
                    </form>
                </div>
                
                <div id="forgotPasswordStep2" style="display: none;">
                    <form id="resetPasswordForm" class="auth-form">
                        <div class="form-group">
                            <label for="resetCode" data-translate="reset-code">Reset code:</label>
                            <div class="input-with-icon">
                                <input type="text" id="resetCode" required autocomplete="new-password">
                                <i class="fas fa-key input-icon"></i>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="newPassword" data-translate="new-password">New password:</label>
                            <div class="input-with-icon password-input-container">
                                <input type="password" id="newPassword" required autocomplete="new-password">
                                <i class="fas fa-eye password-toggle" onclick="togglePasswordVisibility('newPassword')"></i>
                            </div>
                            <div class="password-strength">
                                <div class="strength-meter">
                                    <div class="strength-segment"></div>
                                    <div class="strength-segment"></div>
                                    <div class="strength-segment"></div>
                                    <div class="strength-segment"></div>
                                </div>
                                <span class="strength-text">Password strength</span>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="confirmNewPassword" data-translate="confirm-new-password">Confirm new password:</label>
                            <div class="input-with-icon password-input-container">
                                <input type="password" id="confirmNewPassword" required autocomplete="new-password">
                                <i class="fas fa-eye password-toggle" onclick="togglePasswordVisibility('confirmNewPassword')"></i>
                            </div>
                            <div class="password-error" id="newPasswordMatchError" style="display: none; color: red;">
                                <small data-translate="register-password-mismatch">Passwords do not match</small>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary" data-translate="reset-password-submit">
                            <i class="fas fa-save"></i> Update password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // נקה את השדות מיד לאחר יצירת המודל
    setTimeout(() => {
        clearResetPasswordFields(modal);
    }, 10);
    
    // הוספת מאזינים לאירועים
    setTimeout(() => {
        // כפתור סגירה 
        const closeButton = modal.querySelector('.close-button');
        closeButton?.addEventListener('click', () => {
            hideModal(modal);
        });
        
        // לחיצה על הרקע
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                hideModal(modal);
            }
        });
        
        // טופס שלב 1: בקשת קוד איפוס
        const forgotPasswordForm = modal.querySelector('#forgotPasswordForm');
        forgotPasswordForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // הצגת מצב טעינה
            showFormLoading(forgotPasswordForm);
            
            const email = document.getElementById('resetEmail').value;
            
            try {
                // שליחת בקשה לשרת
                const response = await fetch('/reset-password-request', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // מעבר לשלב 2 - ניקוי השדות של שלב 2 לפני הצגה
                    document.getElementById('forgotPasswordStep1').style.display = 'none';
                    
                    // נקה את השדות לפני המעבר לשלב 2
                    clearResetPasswordFields(modal);
                    
                    document.getElementById('forgotPasswordStep2').style.display = 'block';
                    // שמירת האימייל לשלב הבא
                    document.getElementById('resetPasswordForm').dataset.email = email;
                    
                    showNotification('success', 'Reset code sent to your email');
                } else {
                    showNotification('error', result.error || 'Error sending reset code');
                }
            } catch (error) {
                showNotification('error', 'An error occurred during the password reset process');
            } finally {
                hideFormLoading(forgotPasswordForm);
            }
        });
        
        // טופס שלב 2: הזנת קוד ועדכון סיסמה
        const resetPasswordForm = modal.querySelector('#resetPasswordForm');
        resetPasswordForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // בדיקת התאמת סיסמאות
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmNewPassword').value;
            
            if (newPassword !== confirmPassword) {
                document.getElementById('newPasswordMatchError').style.display = 'block';
                return;
            } else {
                document.getElementById('newPasswordMatchError').style.display = 'none';
            }
            
            // הצגת מצב טעינה
            showFormLoading(resetPasswordForm);
            
            const email = resetPasswordForm.dataset.email;
            const resetCode = document.getElementById('resetCode').value;
            
            try {
                // שליחת בקשה לשרת
                const response = await fetch('/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        email, 
                        reset_code: resetCode,
                        new_password: newPassword 
                    })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    showNotification('success', 'Password updated successfully');
                    
                    // סגירת המודל
                    hideModal(modal);
                    
                    // מילוי אוטומטי של שם המשתמש בטופס ההתחברות
                    const loginEmailInput = document.getElementById('loginEmail');
                    if (loginEmailInput) {
                        loginEmailInput.value = email;
                    }
                } else {
                    if (result.error && result.error.includes('same as current')) {
                        showNotification('error', 'The new password must be different from the current password');
                        document.getElementById('newPassword').value = '';
                        document.getElementById('confirmNewPassword').value = '';
                        document.getElementById('newPassword').focus();
                    } else {
                        showNotification('error', result.error || 'Error resetting password');
                    }
                }
            } catch (error) {
                showNotification('error', 'An error occurred during the password update process');
            } finally {
                hideFormLoading(resetPasswordForm);
            }
        });
        
        // מאזין לשינויים בשדה אימות סיסמה
        const newPassword = document.getElementById('newPassword');
        const confirmNewPassword = document.getElementById('confirmNewPassword');
        
        if (newPassword && confirmNewPassword) {
            // פונקציה להשוואת סיסמאות
            const validatePasswordMatch = () => {
                if (confirmNewPassword.value.length === 0) {
                    document.getElementById('newPasswordMatchError').style.display = 'none';
                    return;
                }
                
                if (newPassword.value !== confirmNewPassword.value) {
                    document.getElementById('newPasswordMatchError').style.display = 'block';
                } else {
                    document.getElementById('newPasswordMatchError').style.display = 'none';
                }
            };
            
            // הפעלת בדיקת התאמה כאשר אחד מהשדות משתנה
            confirmNewPassword.addEventListener('input', validatePasswordMatch);
            newPassword.addEventListener('input', validatePasswordMatch);
            
            // הוספת בדיקת חוזק סיסמה (דומה לטופס ההרשמה)
            newPassword.addEventListener('input', function() {
                const password = this.value;
                const strengthSegments = modal.querySelectorAll('.strength-segment');
                const strengthText = modal.querySelector('.strength-text');
                
                if (!strengthSegments.length || !strengthText) return;
                
                let strength = 0;
                
                // איפוס סגמנטים
                strengthSegments.forEach(segment => {
                    segment.classList.remove('weak', 'medium', 'strong', 'very-strong');
                });
                
                if (password.length === 0) {
                    strengthText.textContent = 'Password strength';
                    strengthText.className = 'strength-text';
                    return;
                }
                
                // בדיקת אורך
                if (password.length >= 8) strength += 1;
                
                // בדיקות מורכבות
                if (/[A-Z]/.test(password)) strength += 1;
                if (/[0-9]/.test(password)) strength += 1;
                if (/[^A-Za-z0-9]/.test(password)) strength += 1;
                
                // עדכון מד העוצמה
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
                
                // עדכון טקסט
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
    }, 0);
    
    return modal;
}

// שכתוב הפונקציה showModal בכדי לנקות את השדות של המודל
// אם הפונקציה הזו מוגדרת במקום אחר, יש להוסיף את הקוד הבא בתוכה
const originalShowModal = window.showModal;
window.showModal = function(modal) {
    // בדיקה אם זה מודל איפוס סיסמה
    if (modal && modal.id === 'forgotPasswordModal') {
        // ניקוי שדות
        clearResetPasswordFields(modal);
    }
    
    // קריאה לפונקציה המקורית אם קיימת
    if (typeof originalShowModal === 'function') {
        return originalShowModal(modal);
    } else {
        // אחרת, יישום בסיסי של הצגת מודל
        document.body.style.overflow = 'hidden';
        modal.style.display = 'flex';
        
        // אנימציה
        setTimeout(() => {
            modal.style.opacity = '1';
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'translateY(0)';
            }
        }, 10);
    }
};