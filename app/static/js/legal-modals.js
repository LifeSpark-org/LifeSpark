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
    
    // Set title and content based on type
    const title = type === 'privacy' ? 'Privacy Policy' : 'Terms of Service';
    let content = '';
    
    if (type === 'privacy') {
        content = `
            <h2>1. Introduction</h2>
            <p>This Privacy Policy describes how lifeSpark ("we", "our", or "us") collects, uses, and discloses information about you when you access or use our website, services, and applications (collectively, the "Service").</p>
            <p>We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. Please read this Privacy Policy carefully. By using the Service, you agree to the collection and use of information in accordance with this policy.</p>
            
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul>
                <li>Register for an account</li>
                <li>Submit a project for funding</li>
                <li>Make a donation</li>
                <li>Contact us</li>
                <li>Participate in surveys or promotions</li>
                <li>Subscribe to newsletters</li>
            </ul>
            <p>This personal information may include:</p>
            <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Organization name</li>
                <li>Ethereum wallet address</li>
                <li>Payment information</li>
                <li>Any other information you choose to provide</li>
            </ul>
            
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including to:</p>
            <ul>
                <li>Provide, maintain, and improve our Service</li>
                <li>Process and manage donations and projects</li>
                <li>Communicate with you about your account, donations, or projects</li>
                <li>Send you technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our Service</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations</li>
            </ul>
            
            <p>For full details of our Privacy Policy, please visit our website.</p>
        `;
    } else {
        content = `
            <h2>1. Introduction</h2>
            <p>These Terms of Service ("Terms") govern your access to and use of the lifeSpark platform, including our website, services, and applications (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not access or use our Service.</p>
            <p>lifeSpark is a blockchain-based donation platform that facilitates transparent giving to communities in need in Israel. These Terms constitute a legally binding agreement between you and lifeSpark regarding your use of the Service.</p>
            
            <h2>2. Eligibility</h2>
            <p>To use the Service, you must be at least 18 years old and capable of forming a binding contract. By accessing or using our Service, you represent and warrant that you meet all eligibility requirements.</p>
            
            <h2>3. Account Registration</h2>
            <h3>3.1 User Account</h3>
            <p>To access certain features of the Service, you must register for an account. When registering, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            
            <h3>3.2 Account Security</h3>
            <p>You are solely responsible for maintaining the security of your account and password. lifeSpark cannot and will not be liable for any loss or damage resulting from your failure to comply with this security obligation.</p>
            
            <h2>4. Donations and Financial Transactions</h2>
            <h3>4.1 Cryptocurrency Donations</h3>
            <p>The Service enables users to make donations using cryptocurrency (primarily Ethereum). By making a donation, you acknowledge and agree to the following:</p>
            <ul>
                <li>Cryptocurrency transactions are irreversible once confirmed on the blockchain</li>
                <li>The value of cryptocurrency may fluctuate</li>
                <li>You are responsible for ensuring the accuracy of all transaction details</li>
                <li>There may be network fees associated with transactions that are separate from your donation amount</li>
            </ul>
            
            <p>For full details of our Terms of Service, please visit our website.</p>
        `;
    }
    
    // Create modal content with direct content (no iframe)
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-button">&times;</button>
            </div>
            <div class="modal-body legal-modal-body">
                <div class="legal-content-scroll">
                    ${content}
                </div>
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