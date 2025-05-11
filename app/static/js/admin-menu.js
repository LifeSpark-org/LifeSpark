// Admin Menu Visibility Script
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin menu should be shown
    checkAdminMenuVisibility();
    
    // Also check when auth state changes
    document.addEventListener('authStateChanged', checkAdminMenuVisibility);
});

// Function to check and update admin menu visibility
async function checkAdminMenuVisibility() {
    const adminMenuLink = document.getElementById('adminMenuLink');
    if (!adminMenuLink) {
        return;
    }
    
    try {
        // First check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            adminMenuLink.style.display = 'none';
            return;
        }
                
        // Check if user is admin
        const isAdmin = await checkIsAdminUser();
        
        // Show admin menu if user is admin
        adminMenuLink.style.display = isAdmin ? 'block' : 'none';
    } catch (error) {
        adminMenuLink.style.display = 'none';
    }
}

// Check if current user is an admin
async function checkIsAdminUser() {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            return false;
        }
        
        // Try direct user data check first (might be faster)
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.is_admin === true) {
                    return true;
                }
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
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
            console.log('Admin check response data:', result);
            return result.is_admin === true;
        }
        console.log('Admin check failed with status:', response.status);
        return false;
    } catch (error) {
        console.error('Admin check error:', error);
        return false;
    }
}