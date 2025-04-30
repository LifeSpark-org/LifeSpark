// Project Submission Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the project submission form
    initProjectSubmission();
    
    // Add listener for navigation to project submission section
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('[onclick*="showSection(\'submit-project\'"]') || 
            e.target.closest('[onclick*="showSection(\'submit-project\'"]')) {
            setTimeout(checkProjectAuth, 100);
        }
    });
    
    // Check auth on page load if we're starting on the project submission page
    if (window.location.hash === '#submit-project' || 
        document.getElementById('submit-project')?.classList.contains('active')) {
        setTimeout(checkProjectAuth, 100);
    }
    
    // File upload handling
    const fileInput = document.getElementById('projectDocuments');
    const fileNames = document.getElementById('uploadedFileNames');
    
    if (fileInput && fileNames) {
        fileInput.addEventListener('change', function() {
            // Display selected file names
            fileNames.innerHTML = '';
            
            if (this.files.length > 0) {
                for (let i = 0; i < this.files.length; i++) {
                    const file = this.files[i];
                    
                    // Check file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        showNotification('error', `File too large: ${file.name}. Maximum size is 5MB.`);
                        continue;
                    }
                    
                    // Create file item
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    
                    // Determine file icon based on extension
                    let fileIcon = 'file';
                    const ext = file.name.split('.').pop().toLowerCase();
                    
                    if (['pdf'].includes(ext)) {
                        fileIcon = 'file-pdf';
                    } else if (['doc', 'docx'].includes(ext)) {
                        fileIcon = 'file-word';
                    } else if (['jpg', 'jpeg', 'png'].includes(ext)) {
                        fileIcon = 'file-image';
                    }
                    
                    // Format file size
                    const fileSize = formatFileSize(file.size);
                    
                    fileItem.innerHTML = `
                        <div class="file-name"><i class="fas fa-${fileIcon}"></i> ${file.name}</div>
                        <div class="file-size">${fileSize}</div>
                    `;
                    
                    fileNames.appendChild(fileItem);
                }
            } else {
                fileNames.innerHTML = '<div class="file-empty">No files selected</div>';
            }
        });
    }
});

// Format file size for display
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Check if user is authenticated for project submission
function checkProjectAuth() {
    const projectAuthCheck = document.getElementById('projectAuthCheck');
    const projectFormContainer = document.getElementById('projectFormContainer');
    
    if (!projectAuthCheck || !projectFormContainer) return;
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('token') !== null;
    
    if (isLoggedIn) {
        // User is logged in, show project submission form
        projectAuthCheck.style.display = 'none';
        projectFormContainer.style.display = 'block';
    } else {
        // User is not logged in, show auth message
        projectAuthCheck.style.display = 'block';
        projectFormContainer.style.display = 'none';
    }
}

// Initialize project submission form
function initProjectSubmission() {
    const projectForm = document.getElementById('projectSubmissionForm');
    
    if (!projectForm) return;
    
    // תצוגה מקדימה של תמונת הפרויקט
    const projectImage = document.getElementById('projectImage');
    const imagePreview = document.getElementById('projectImagePreview');

    if (projectImage && imagePreview) {
        projectImage.addEventListener('change', function() {
            // נקה את התצוגה המקדימה הקודמת
            imagePreview.innerHTML = '';
            
            if (this.files.length > 0) {
                const file = this.files[0];
                
                // בדוק גודל קובץ (מקסימום 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    showNotification('error', 'Image too large. Maximum size is 2MB.');
                    this.value = '';
                    return;
                }
                
                // תצוגה מקדימה של התמונה
                const img = document.createElement('img');
                img.file = file;
                imagePreview.appendChild(img);
                
                const reader = new FileReader();
                reader.onload = (function(aImg) { 
                    return function(e) { 
                        aImg.src = e.target.result; 
                    }; 
                })(img);
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    projectForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Client-side validation
        const title = document.getElementById('projectTitle').value.trim();
        const description = document.getElementById('projectDescription').value.trim();
        const region = document.getElementById('projectRegion').value;
        const goalAmount = document.getElementById('projectGoalAmount').value.trim();
        const contactEmail = document.getElementById('projectEmail').value.trim();
        
        // Check required fields
        let isValid = true;
        let errorMessage = "Please fill in all required fields:";
        
        if (!title) {
            isValid = false;
            errorMessage += " Title,";
            document.getElementById('projectTitle').classList.add('input-error');
        }
        
        if (!description) {
            isValid = false;
            errorMessage += " Description,";
            document.getElementById('projectDescription').classList.add('input-error');
        }
        
        if (!region) {
            isValid = false;
            errorMessage += " Region,";
            document.getElementById('projectRegion').classList.add('input-error');
        }
        
        if (!goalAmount) {
            isValid = false;
            errorMessage += " Funding Goal,";
            document.getElementById('projectGoalAmount').classList.add('input-error');
        }
        
        if (!contactEmail) {
            isValid = false;
            errorMessage += " Contact Email,";
            document.getElementById('projectEmail').classList.add('input-error');
        }
        
        if (!isValid) {
            errorMessage = errorMessage.replace(/,$/, "");
            showNotification('error', errorMessage);
            hideFormLoading(projectForm);
            return;
        }
        
        // Remove any error classes
        document.querySelectorAll('.input-error').forEach(input => {
            input.classList.remove('input-error');
        });
        
        // Show loading state
        showFormLoading(projectForm);
        
        try {
            // יצירת FormData לטיפול בקבצים
            const formData = new FormData();
            const locationLat = parseFloat(document.getElementById('projectLocationLat').value);
            const locationLng = parseFloat(document.getElementById('projectLocationLng').value);
            console.log(`שולח מיקום בטופס: [${locationLat}, ${locationLng}]`);
            // הוסף את כל שדות הטופס הרגילים
            formData.append('title', title);
            formData.append('description', description);
            formData.append('region', region);
            formData.append('goal_amount', goalAmount);
            formData.append('contact_email', contactEmail);
            formData.append('location_lat', locationLat);
            formData.append('location_lng', locationLng);
            
            // הוסף שדות אופציונליים
            const contactPhone = document.getElementById('projectPhone')?.value || '';
            const organization = document.getElementById('projectOrganization')?.value || '';
            formData.append('contact_phone', contactPhone);
            formData.append('organization', organization);
            // לאחר הוספת שדות אחרים ל-formData
            formData.append('ethereum_address', document.getElementById('ethereumAddress')?.value || '');
            // הוסף את תמונת הפרויקט אם קיימת
            if (projectImage && projectImage.files.length > 0) {
                formData.append('project_image', projectImage.files[0]);
            }
            
            // הוסף מסמכים תומכים אם קיימים
            const projectDocuments = document.getElementById('projectDocuments');
            if (projectDocuments && projectDocuments.files.length > 0) {
                for (let i = 0; i < projectDocuments.files.length; i++) {
                    formData.append('proof_documents', projectDocuments.files[i]);
                }
            }
            
            // Get token from localStorage
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('Authentication required');
            }
            
            // Submit project using FormData
            const response = await fetch('/submit-project', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // אין להגדיר Content-Type כאן כי FormData יגדיר אותו אוטומטית
                },
                body: formData
            });
            const result = await response.json();
            
            if (response.ok) {
                // Show success message
                const submissionStatus = document.getElementById('submissionStatus');
                
                if (submissionStatus) {
                    submissionStatus.className = 'submission-status success';
                    submissionStatus.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        <h4>Project Submitted Successfully</h4>
                        <p>Your project has been submitted and is pending review.</p>
                    `;
                    submissionStatus.style.display = 'block';
                }
                
                // Clear form
                projectForm.reset();
                document.getElementById('uploadedFileNames').innerHTML = '';
                
                // נקה את תצוגת התמונה המקדימה
                if (imagePreview) {
                    imagePreview.innerHTML = '';
                }
                
                // Scroll to status message
                submissionStatus.scrollIntoView({ behavior: 'smooth' });
                
                // Show notification
                showNotification('success', 'Project submitted successfully and pending review.');
            } else {
                // Try to get more detailed error message
                let errorMessage = result.message || 'Failed to submit project';
                console.error('Full error response:', result);
                
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Project submission error:', error);
            
            // Show error message
            const submissionStatus = document.getElementById('submissionStatus');
            
            if (submissionStatus) {
                submissionStatus.className = 'submission-status error';
                submissionStatus.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <h4>Submission Error</h4>
                    <p>${error.message}</p>
                `;
                submissionStatus.style.display = 'block';
                
                // Scroll to status message
                submissionStatus.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Show notification
            showNotification('error', error.message || 'An error occurred while submitting your project.');
        } finally {
            // Hide loading state
            hideFormLoading(projectForm);
        }
    });
}

// Add this function to the global scope so it can be called from other places
window.checkProjectAuth = checkProjectAuth;

// Check project auth after login/logout
document.addEventListener('authStateChanged', function() {
    // If we're on the project submission page, check auth
    if (document.getElementById('submit-project')?.classList.contains('active')) {
        checkProjectAuth();
    }
});