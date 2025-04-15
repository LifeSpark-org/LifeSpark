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

// פונקציה ליצירת מודל שכחתי סיסמה
function createForgotPasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'forgotPasswordModal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 data-translate="forgot-password-title">איפוס סיסמה</h3>
                <button class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <p data-translate="forgot-password-instruction">אנא הזן את כתובת האימייל שלך ונשלח לך קוד לאיפוס הסיסמה:</p>
                
                <div id="forgotPasswordStep1">
                    <form id="forgotPasswordForm" class="auth-form">
                        <div class="form-group">
                            <label for="resetEmail" data-translate="login-email">אימייל:</label>
                            <div class="input-with-icon">
                                <input type="email" id="resetEmail" required>
                                <i class="fas fa-envelope input-icon"></i>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary" data-translate="forgot-password-submit">
                            <i class="fas fa-paper-plane"></i> שלח קוד איפוס
                        </button>
                    </form>
                </div>
                
                <div id="forgotPasswordStep2" style="display: none;">
                    <form id="resetPasswordForm" class="auth-form">
                        <div class="form-group">
                            <label for="resetCode" data-translate="reset-code">קוד איפוס:</label>
                            <div class="input-with-icon">
                                <input type="text" id="resetCode" required>
                                <i class="fas fa-key input-icon"></i>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="newPassword" data-translate="new-password">סיסמה חדשה:</label>
                            <div class="input-with-icon password-input-container">
                                <input type="password" id="newPassword" required>
                                <i class="fas fa-eye password-toggle" onclick="togglePasswordVisibility('newPassword')"></i>
                            </div>
                            <div class="password-strength">
                                <div class="strength-meter">
                                    <div class="strength-segment"></div>
                                    <div class="strength-segment"></div>
                                    <div class="strength-segment"></div>
                                    <div class="strength-segment"></div>
                                </div>
                                <span class="strength-text">עוצמת הסיסמה</span>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="confirmNewPassword" data-translate="confirm-new-password">אימות סיסמה חדשה:</label>
                            <div class="input-with-icon password-input-container">
                                <input type="password" id="confirmNewPassword" required>
                                <i class="fas fa-eye password-toggle" onclick="togglePasswordVisibility('confirmNewPassword')"></i>
                            </div>
                            <div class="password-error" id="newPasswordMatchError" style="display: none; color: red;">
                                <small data-translate="register-password-mismatch">הסיסמאות אינן תואמות</small>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary" data-translate="reset-password-submit">
                            <i class="fas fa-save"></i> עדכן סיסמה
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
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
                    // מעבר לשלב 2
                    document.getElementById('forgotPasswordStep1').style.display = 'none';
                    document.getElementById('forgotPasswordStep2').style.display = 'block';
                    // שמירת האימייל לשלב הבא
                    document.getElementById('resetPasswordForm').dataset.email = email;
                    
                    showNotification('success', 'קוד איפוס נשלח לאימייל שלך');
                } else {
                    showNotification('error', result.error || 'שגיאה בשליחת קוד איפוס');
                }
            } catch (error) {
                showNotification('error', 'אירעה שגיאה בתהליך איפוס הסיסמה');
                console.error('Error requesting password reset:', error);
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
                    showNotification('success', 'הסיסמה עודכנה בהצלחה');
                    
                    // סגירת המודל
                    hideModal(modal);
                    
                    // מילוי אוטומטי של שם המשתמש בטופס ההתחברות
                    const loginEmailInput = document.getElementById('loginEmail');
                    if (loginEmailInput) {
                        loginEmailInput.value = email;
                    }
                } else {
                    showNotification('error', result.error || 'שגיאה באיפוס סיסמה');
                }
            } catch (error) {
                showNotification('error', 'אירעה שגיאה בתהליך עדכון הסיסמה');
                console.error('Error resetting password:', error);
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
                    strengthText.textContent = 'עוצמת הסיסמה';
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
                        strengthText.textContent = 'חלשה';
                        strengthText.className = 'strength-text weak';
                        break;
                    case 2:
                        strengthText.textContent = 'בינונית';
                        strengthText.className = 'strength-text medium';
                        break;
                    case 3:
                        strengthText.textContent = 'חזקה';
                        strengthText.className = 'strength-text strong';
                        break;
                    case 4:
                        strengthText.textContent = 'חזקה מאוד';
                        strengthText.className = 'strength-text very-strong';
                        break;
                }
            });
        }
    }, 0);
    
    return modal;
}