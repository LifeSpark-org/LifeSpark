// Handle Terms of Service and Privacy Policy modals
document.addEventListener('DOMContentLoaded', function() {
    // Find all legal links in the registration form
    const legalLinks = document.querySelectorAll('.terms-link');
    
    legalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the link type from data attribute or href
            const linkType = this.getAttribute('data-type') || 
                             (this.href.includes('privacy-policy') ? 'privacy' : 'terms');
            
            // Create and show the appropriate modal
            const modal = createLegalModal(linkType);
            document.body.appendChild(modal);
            showModal(modal);
        });
    });
});

// Create legal content modal
function createLegalModal(type) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal legal-modal';
    modal.id = type === 'privacy' ? 'privacyPolicyModal' : 'termsOfServiceModal';
    
    // Set title based on type
    const title = type === 'privacy' ? 'Privacy Policy' : 'Terms of Service';
    const contentPath = type === 'privacy' ? '/privacy-policy' : '/terms-of-service';
    
    // Create modal content with iframe
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-button">&times;</button>
            </div>
            <div class="modal-body legal-modal-body">
                <iframe src="${contentPath}" frameborder="0"></iframe>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary accept-legal">I Accept</button>
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
    
    // Add event listener for accept button
    const acceptButton = modal.querySelector('.accept-legal');
    acceptButton?.addEventListener('click', () => {
        // Check the acceptance checkbox automatically
        const checkbox = document.getElementById('acceptTerms');
        if (checkbox) {
            checkbox.checked = true;
        }
        hideModal(modal);
    });
    
    return modal;
}