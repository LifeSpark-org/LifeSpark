// Admin Project Management Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin project management
    initAdminProjects();
    
    // Add listener for navigation to admin projects section
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('[onclick*="showSection(\'admin-projects\'"]') || 
            e.target.closest('[onclick*="showSection(\'admin-projects\'"]')) {
            setTimeout(checkAdminAccess, 100);
        }
    });
    
    // Check admin access on page load if we're starting on the admin projects page
    if (window.location.hash === '#admin-projects' || 
        document.getElementById('admin-projects')?.classList.contains('active')) {
        setTimeout(checkAdminAccess, 100);
    }
    
    // Make sure the approve/reject buttons work properly
    const approveBtn = document.getElementById('approveProjectBtn');
    const rejectBtn = document.getElementById('rejectProjectBtn');
    
    if (approveBtn) {
        approveBtn.addEventListener('click', approveProject);
        console.log("Set up approve button event listener");
    }
    
    if (rejectBtn) {
        rejectBtn.addEventListener('click', rejectProject);
        console.log("Set up reject button event listener");
    }
    
    // Tab switching functionality
    const adminTabs = document.querySelectorAll('.admin-tab');
    
    adminTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab
            adminTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all tab content
            document.querySelectorAll('.admin-tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Show selected tab content
            document.getElementById(tabName).style.display = 'block';
            
            // Load relevant project data
            if (tabName === 'pending-projects') {
                loadPendingProjects();
            } else if (tabName === 'approved-projects') {
                loadApprovedProjects();
            } else if (tabName === 'rejected-projects') {
                loadRejectedProjects();
            }
        });
    });
    
    // Refresh buttons
    document.getElementById('refreshPendingBtn')?.addEventListener('click', loadPendingProjects);
    document.getElementById('refreshApprovedBtn')?.addEventListener('click', loadApprovedProjects);
    document.getElementById('refreshRejectedBtn')?.addEventListener('click', loadRejectedProjects);
    
    // Modal close button
    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                hideModal(modal);
            }
        });
    });
    
    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(this);
            }
        });
    });
    
    // Approve and reject buttons in modal
    document.getElementById('approveProjectBtn')?.addEventListener('click', approveProject);
    document.getElementById('rejectProjectBtn')?.addEventListener('click', rejectProject);
});

// Initialize admin projects
function initAdminProjects() {
    console.log("Initializing admin projects interface");
    
    // Set up event listeners for the approve and reject buttons again
    // This redundancy helps ensure the buttons always work
    const approveProjectBtn = document.getElementById('approveProjectBtn');
    const rejectProjectBtn = document.getElementById('rejectProjectBtn');
    
    if (approveProjectBtn) {
        approveProjectBtn.addEventListener('click', approveProject);
    }
    
    if (rejectProjectBtn) {
        rejectProjectBtn.addEventListener('click', rejectProject);
    }
}

// Check if user has admin access
function checkAdminAccess() {
    const adminAccessCheck = document.getElementById('adminAccessCheck');
    const adminProjectContent = document.getElementById('adminProjectContent');
    
    if (!adminAccessCheck || !adminProjectContent) return;
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('token') !== null;
    
    if (!isLoggedIn) {
        // User is not logged in
        adminAccessCheck.style.display = 'block';
        adminProjectContent.style.display = 'none';
        return;
    }
    
    // Check if user has admin role
    checkIsAdmin().then(isAdmin => {
        if (isAdmin) {
            // User is admin, show admin content
            adminAccessCheck.style.display = 'none';
            adminProjectContent.style.display = 'block';
            
            // Load pending projects by default
            loadPendingProjects();
        } else {
            // User is not admin, show access check message
            adminAccessCheck.style.display = 'block';
            adminProjectContent.style.display = 'none';
        }
    }).catch(error => {
        console.error('Error checking admin status:', error);
        // Show access check message on error
        adminAccessCheck.style.display = 'block';
        adminProjectContent.style.display = 'none';
    });
}

// Check if current user is an admin
async function checkIsAdmin() {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            return false;
        }
        
        // Make request to admin check endpoint
        const response = await fetch('/admin/check', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            return result.is_admin === true;
        }
        
        return false;
    } catch (error) {
        console.error('Admin check error:', error);
        return false;
    }
}

// Load pending projects
async function loadPendingProjects() {
    const pendingList = document.getElementById('pendingProjectsList');
    const pendingCount = document.getElementById('pendingCount');
    
    if (!pendingList) return;
    
    // Show loading state
    pendingList.innerHTML = `
        <div class="loading-placeholder">
            <div class="spinner"></div>
            <p data-translate="loading-projects">Loading projects...</p>
        </div>
    `;
    
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Authentication required');
        }
        
        // Fetch pending projects
        const response = await fetch('/admin/projects/pending', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (response.ok) {
            const projects = result.projects || [];
            
            // Update count badge
            if (pendingCount) {
                pendingCount.textContent = projects.length;
            }
            
            if (projects.length === 0) {
                // No pending projects
                pendingList.innerHTML = `
                    <div class="empty-list">
                        <i class="fas fa-inbox"></i>
                        <p data-translate="no-pending-projects">No pending projects to review</p>
                    </div>
                `;
                return;
            }
            
            // Build project list
            let projectsHtml = '';
            
            projects.forEach(project => {
                const formattedDate = new Date(project.created_at).toLocaleDateString();
                const regionClass = project.region === 'south' ? 'south' : 'north';
                const regionText = project.region === 'south' ? 
                    (translations[currentLanguage]?.['donate-region-south'] || 'Southern Israel') : 
                    (translations[currentLanguage]?.['donate-region-north'] || 'Northern Israel');
                
                projectsHtml += `
                    <div class="admin-project-item" data-project-id="${project._id}">
                        <div class="project-item-header">
                            <div>
                                <h4 class="project-item-title">${project.title}</h4>
                                <div class="project-item-meta">
                                    ${translations[currentLanguage]?.['submitted-on'] || 'Submitted on'}: ${formattedDate}
                                </div>
                            </div>
                            <span class="project-item-region ${regionClass}">${regionText}</span>
                        </div>
                        
                        <div class="project-item-description">
                            ${project.description}
                        </div>
                        
                        <div class="project-item-footer">
                            <div class="project-item-funding">
                                <span class="project-item-goal">${project.goal_amount} ETH</span>
                                <span data-translate="funding-goal">funding goal</span>
                            </div>
                            
                            <div class="project-item-actions">
                                <button class="btn btn-sm btn-primary review-project-btn" data-project-id="${project._id}">
                                    <i class="fas fa-search"></i> <span data-translate="review">Review</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            pendingList.innerHTML = projectsHtml;
            
            // Add event listeners to review buttons
            document.querySelectorAll('.review-project-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const projectId = this.getAttribute('data-project-id');
                    openProjectReviewModal(projectId);
                });
            });
        } else {
            throw new Error(result.message || 'Failed to load pending projects');
        }
    } catch (error) {
        console.error('Load pending projects error:', error);
        
        pendingList.innerHTML = `
            <div class="empty-list error">
                <i class="fas fa-exclamation-circle"></i>
                <p>${error.message || 'Failed to load projects'}</p>
            </div>
        `;
    }
}

// Load approved projects
async function loadApprovedProjects() {
    const approvedList = document.getElementById('approvedProjectsList');
    
    if (!approvedList) return;
    
    // Show loading state
    approvedList.innerHTML = `
        <div class="loading-placeholder">
            <div class="spinner"></div>
            <p data-translate="loading-projects">Loading projects...</p>
        </div>
    `;
    
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Authentication required');
        }
        
        // Fetch approved projects
        const response = await fetch('/projects/approved', {
            method: 'GET'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            const projects = result.projects || [];
            
            if (projects.length === 0) {
                // No approved projects
                approvedList.innerHTML = `
                    <div class="empty-list">
                        <i class="fas fa-check-circle"></i>
                        <p data-translate="no-approved-projects">No approved projects</p>
                    </div>
                `;
                return;
            }
            
            // Build project list
            let projectsHtml = '';
            
            projects.forEach(project => {
                const formattedDate = new Date(project.approved_at).toLocaleDateString();
                const regionClass = project.region === 'south' ? 'south' : 'north';
                const regionText = project.region === 'south' ? 
                    (translations[currentLanguage]?.['donate-region-south'] || 'Southern Israel') : 
                    (translations[currentLanguage]?.['donate-region-north'] || 'Northern Israel');
                
                const progressPercent = Math.min(100, Math.round((project.current_amount / project.goal_amount) * 100));
                
                projectsHtml += `
                    <div class="admin-project-item" data-project-id="${project._id}">
                        <div class="project-item-header">
                            <div>
                                <h4 class="project-item-title">${project.title}</h4>
                                <div class="project-item-meta">
                                    ${translations[currentLanguage]?.['approved-on'] || 'Approved on'}: ${formattedDate}
                                </div>
                            </div>
                            <span class="project-item-region ${regionClass}">${regionText}</span>
                        </div>
                        
                        <div class="project-item-description">
                            ${project.description}
                        </div>
                        
                        <div class="project-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercent}%"></div>
                            </div>
                            <div class="progress-stats">
                                <span>${project.current_amount} / ${project.goal_amount} ETH</span>
                                <span>${progressPercent}%</span>
                            </div>
                        </div>
                        
                        <div class="project-item-footer">
                            <div class="project-item-funding">
                                <span class="project-item-goal">${project.goal_amount} ETH</span>
                                <span data-translate="funding-goal">funding goal</span>
                            </div>
                            
                            <div class="project-item-actions">
                                <button class="btn btn-sm btn-primary view-project-btn" data-project-id="${project._id}">
                                    <i class="fas fa-eye"></i> <span data-translate="view-details">View Details</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            approvedList.innerHTML = projectsHtml;
            
            // Add event listeners to view buttons
            document.querySelectorAll('.view-project-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const projectId = this.getAttribute('data-project-id');
                    viewProjectDetails(projectId);
                });
            });
        } else {
            throw new Error(result.message || 'Failed to load approved projects');
        }
    } catch (error) {
        console.error('Load approved projects error:', error);
        
        approvedList.innerHTML = `
            <div class="empty-list error">
                <i class="fas fa-exclamation-circle"></i>
                <p>${error.message || 'Failed to load projects'}</p>
            </div>
        `;
    }
}

// Load rejected projects
async function loadRejectedProjects() {
    const rejectedList = document.getElementById('rejectedProjectsList');
    
    if (!rejectedList) return;
    
    // Show loading state
    rejectedList.innerHTML = `
        <div class="loading-placeholder">
            <div class="spinner"></div>
            <p data-translate="loading-projects">Loading projects...</p>
        </div>
    `;
    
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Authentication required');
        }
        
        // Fetch rejected projects
        const response = await fetch('/admin/projects/rejected', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (response.ok) {
            const projects = result.projects || [];
            
            if (projects.length === 0) {
                // No rejected projects
                rejectedList.innerHTML = `
                    <div class="empty-list">
                        <i class="fas fa-times-circle"></i>
                        <p data-translate="no-rejected-projects">No rejected projects</p>
                    </div>
                `;
                return;
            }
            
            // Build project list
            let projectsHtml = '';
            
            projects.forEach(project => {
                const formattedDate = new Date(project.rejected_at).toLocaleDateString();
                const regionClass = project.region === 'south' ? 'south' : 'north';
                const regionText = project.region === 'south' ? 
                    (translations[currentLanguage]?.['donate-region-south'] || 'Southern Israel') : 
                    (translations[currentLanguage]?.['donate-region-north'] || 'Northern Israel');
                
                projectsHtml += `
                    <div class="admin-project-item" data-project-id="${project._id}">
                        <div class="project-item-header">
                            <div>
                                <h4 class="project-item-title">${project.title}</h4>
                                <div class="project-item-meta">
                                    ${translations[currentLanguage]?.['rejected-on'] || 'Rejected on'}: ${formattedDate}
                                </div>
                            </div>
                            <span class="project-item-region ${regionClass}">${regionText}</span>
                        </div>
                        
                        <div class="project-item-description">
                            ${project.description}
                        </div>
                        
                        <div class="rejection-notes">
                            <strong data-translate="rejection-reason">Rejection Reason:</strong>
                            <p>${project.status_notes || 'No reason provided'}</p>
                        </div>
                        
                        <div class="project-item-footer">
                            <div class="project-item-funding">
                                <span class="project-item-goal">${project.goal_amount} ETH</span>
                                <span data-translate="funding-goal">funding goal</span>
                            </div>
                            
                            <div class="project-item-actions">
                                <button class="btn btn-sm btn-primary view-project-btn" data-project-id="${project._id}">
                                    <i class="fas fa-eye"></i> <span data-translate="view-details">View Details</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            rejectedList.innerHTML = projectsHtml;
            
            // Add event listeners to view buttons
            document.querySelectorAll('.view-project-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const projectId = this.getAttribute('data-project-id');
                    viewProjectDetails(projectId);
                });
            });
            
            console.log("Loaded rejected projects successfully");
        } else {
            throw new Error(result.message || 'Failed to load rejected projects');
        }
    } catch (error) {
        console.error('Load rejected projects error:', error);
        
        rejectedList.innerHTML = `
            <div class="empty-list error">
                <i class="fas fa-exclamation-circle"></i>
                <p>${error.message || 'Failed to load projects'}</p>
            </div>
        `;
    }
}

// Open project review modal
async function openProjectReviewModal(projectId) {
    console.log("Opening review modal for project:", projectId);
    const reviewModal = document.getElementById('projectReviewModal');
    const reviewContent = document.getElementById('projectReviewContent');
    
    if (!reviewModal || !reviewContent) {
        console.error("Review modal or content not found");
        return;
    }
    
    // Show loading state
    reviewContent.innerHTML = `
        <div class="loading-placeholder">
            <div class="spinner"></div>
            <p data-translate="loading-project">Loading project details...</p>
        </div>
    `;
    
    // Show modal
    showModal(reviewModal);
    
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Authentication required');
        }
        
        // Fetch project details
        const response = await fetch(`/admin/projects/${projectId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (response.ok) {
            const project = result.project;
            
            if (!project) {
                throw new Error('Project not found');
            }
            
            // Set current project ID for approve/reject buttons
            reviewModal.setAttribute('data-project-id', project._id);
            
            // Format dates
            const submittedDate = new Date(project.created_at).toLocaleDateString();
            
            const regionText = project.region === 'south' ? 
                (translations[currentLanguage]?.['donate-region-south'] || 'Southern Israel') : 
                (translations[currentLanguage]?.['donate-region-north'] || 'Northern Israel');
            
            // Build documents list
            let documentsHtml = '';
            
            if (project.proof_documents && project.proof_documents.length > 0) {
                project.proof_documents.forEach(doc => {
                    // Get file extension
                    const ext = doc.split('.').pop().toLowerCase();
                    
                    // Determine file icon
                    let fileIcon = 'file';
                    if (['pdf'].includes(ext)) {
                        fileIcon = 'file-pdf';
                    } else if (['doc', 'docx'].includes(ext)) {
                        fileIcon = 'file-word';
                    } else if (['jpg', 'jpeg', 'png'].includes(ext)) {
                        fileIcon = 'file-image';
                    }
                    
                    // Get filename from path
                    const fileName = doc.split('/').pop();
                    
                    documentsHtml += `
                        <a href="${doc}" target="_blank" class="document-item">
                            <i class="fas fa-${fileIcon}"></i>
                            <span class="document-name">${fileName}</span>
                        </a>
                    `;
                });
            } else {
                documentsHtml = '<p data-translate="no-documents">No supporting documents provided</p>';
            }
            
            // Build review content
            const reviewHtml = `
                <div class="project-review-header">
                    <div>
                        <h3 class="project-review-title">${project.title}</h3>
                        <div class="project-review-meta">
                            ${translations[currentLanguage]?.['submitted-on'] || 'Submitted on'}: ${submittedDate}
                            <span class="project-review-region">${regionText}</span>
                        </div>
                    </div>
                    <div class="project-review-funding">
                        ${project.goal_amount} ETH
                    </div>
                </div>
                
                <div class="project-review-section">
                    <h4 data-translate="project-description">Project Description</h4>
                    <p>${project.description}</p>
                </div>
                
                <div class="project-review-section">
                    <h4 data-translate="project-contact-info">Contact Information</h4>
                    <div class="project-review-contact">
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>${project.contact_email}</span>
                        </div>
                        ${project.contact_phone ? `
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>${project.contact_phone}</span>
                        </div>` : ''}
                        ${project.organization ? `
                        <div class="contact-item">
                            <i class="fas fa-building"></i>
                            <span>${project.organization}</span>
                        </div>` : ''}
                    </div>
                </div>
                
                <div class="project-review-section">
                    <h4 data-translate="supporting-documents">Supporting Documents</h4>
                    <div class="documents-list">
                        ${documentsHtml}
                    </div>
                </div>
            `;
            
            reviewContent.innerHTML = reviewHtml;
            
            // Make sure approve/reject buttons are properly bound
            const approveBtn = document.getElementById('approveProjectBtn');
            const rejectBtn = document.getElementById('rejectProjectBtn');
            
            if (approveBtn) {
                // Re-bind to ensure the event listener works
                approveBtn.onclick = approveProject;
            }
            
            if (rejectBtn) {
                // Re-bind to ensure the event listener works
                rejectBtn.onclick = rejectProject;
            }
            
        } else {
            throw new Error(result.message || 'Failed to load project details');
        }
    } catch (error) {
        console.error('Load project details error:', error);
        
        reviewContent.innerHTML = `
            <div class="empty-list error">
                <i class="fas fa-exclamation-circle"></i>
                <p>${error.message || 'Failed to load project details'}</p>
            </div>
        `;
    }
}

// View approved/rejected project details
function viewProjectDetails(projectId) {
    // Similar to openProjectReviewModal but without approve/reject options
    openProjectReviewModal(projectId);
    
    // Hide admin decision section
    const adminDecision = document.querySelector('.admin-decision');
    if (adminDecision) {
        adminDecision.style.display = 'none';
    }
}

// Approve project
async function approveProject() {
    console.log("Approve project function called");
    const modal = document.getElementById('projectReviewModal');
    const projectId = modal.getAttribute('data-project-id');
    const notes = document.getElementById('adminNotes').value;
    
    if (!projectId) {
        console.error("No project ID found in modal");
        return;
    }
    
    console.log("Approving project ID:", projectId);
    
    // Disable buttons to prevent double-submit
    const approveBtn = document.getElementById('approveProjectBtn');
    const rejectBtn = document.getElementById('rejectProjectBtn');
    
    if (approveBtn) approveBtn.disabled = true;
    if (rejectBtn) rejectBtn.disabled = true;
    
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Authentication required');
        }
        
        console.log("Sending approval request to server");
        
        // Send approve request
        const response = await fetch(`/admin/projects/${projectId}/approve`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notes })
        });
        
        console.log("Server response status:", response.status);
        const result = await response.json();
        console.log("Server response:", result);
        
        if (response.ok) {
            // Show success notification
            showNotification('success', result.message || 'Project approved successfully');
            
            // Close modal
            hideModal(modal);
            
            // Refresh project lists
            loadPendingProjects();
            loadApprovedProjects();
        } else {
            throw new Error(result.message || 'Failed to approve project');
        }
    } catch (error) {
        console.error('Approve project error:', error);
        showNotification('error', error.message || 'Failed to approve project');
    } finally {
        // Re-enable buttons
        if (approveBtn) approveBtn.disabled = false;
        if (rejectBtn) rejectBtn.disabled = false;
    }
}

// Reject project
async function rejectProject() {
    console.log("Reject project function called");
    const modal = document.getElementById('projectReviewModal');
    const projectId = modal.getAttribute('data-project-id');
    const notes = document.getElementById('adminNotes').value;
    
    if (!projectId) {
        console.error("No project ID found in modal");
        return;
    }
    
    // Make sure rejection reason is provided
    if (!notes.trim()) {
        showNotification('error', 'Please provide a reason for rejection');
        document.getElementById('adminNotes').focus();
        return;
    }
    
    // Disable buttons to prevent double-submit
    const approveBtn = document.getElementById('approveProjectBtn');
    const rejectBtn = document.getElementById('rejectProjectBtn');
    
    if (approveBtn) approveBtn.disabled = true;
    if (rejectBtn) rejectBtn.disabled = true;
    
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Authentication required');
        }
        
        console.log("Sending rejection request to server");
        
        // Send reject request
        const response = await fetch(`/admin/projects/${projectId}/reject`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notes })
        });
        
        console.log("Server response status:", response.status);
        const result = await response.json();
        console.log("Server response:", result);
        
        if (response.ok) {
            // Show success notification
            showNotification('success', result.message || 'Project rejected successfully');
            
            // Close modal
            hideModal(modal);
            
            // Refresh project lists
            loadPendingProjects();
            loadRejectedProjects();
        } else {
            throw new Error(result.message || 'Failed to reject project');
        }
    } catch (error) {
        console.error('Reject project error:', error);
        showNotification('error', error.message || 'Failed to reject project');
    } finally {
        // Re-enable buttons
        if (approveBtn) approveBtn.disabled = false;
        if (rejectBtn) rejectBtn.disabled = false;
    }
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
        
        // Clear notes field
        const adminNotes = document.getElementById('adminNotes');
        if (adminNotes) {
            adminNotes.value = '';
        }
        
        // Show admin decision section (in case it was hidden)
        const adminDecision = document.querySelector('.admin-decision');
        if (adminDecision) {
            adminDecision.style.display = 'block';
        }
    }, 300);
}