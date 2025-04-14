// Admin Debug Tool
// Add this to your browser console to diagnose and fix admin issues

// Check if currently logged in user is an admin
async function checkIfAdmin() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('%c⚠️ Not logged in', 'color: orange; font-weight: bold');
        return false;
    }
    
    try {
        const response = await fetch('/admin/check', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Admin check response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log(`%c${result.is_admin ? '✅ User is an admin' : '❌ User is NOT an admin'}`, 
                        `color: ${result.is_admin ? 'green' : 'red'}; font-weight: bold`);
            return result.is_admin;
        } else {
            console.log('%c❌ Failed to check admin status', 'color: red; font-weight: bold');
            return false;
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Examine the token to see user ID
function examineToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('%c⚠️ No token found', 'color: orange; font-weight: bold');
        return;
    }
    
    try {
        // JWT tokens are base64 encoded with 3 parts: header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.log('%c❌ Invalid token format', 'color: red; font-weight: bold');
            return;
        }
        
        // Decode the payload (second part)
        const payload = JSON.parse(atob(parts[1]));
        console.log('Token payload:', payload);
        console.log('User ID:', payload.user_id);
        
        // Check expiration
        const expirationDate = new Date(payload.exp * 1000);
        const now = new Date();
        if (expirationDate < now) {
            console.log('%c❌ Token expired on ' + expirationDate.toLocaleString(), 'color: red; font-weight: bold');
        } else {
            console.log('%c✅ Token valid until ' + expirationDate.toLocaleString(), 'color: green; font-weight: bold');
        }
    } catch (error) {
        console.error('Error decoding token:', error);
    }
}

// Force reload pending projects
async function forceLoadPendingProjects() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('%c⚠️ Not logged in', 'color: orange; font-weight: bold');
        return;
    }
    
    try {
        console.log('Fetching pending projects...');
        const response = await fetch('/admin/projects/pending', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Pending projects:', result);
            console.log(`Found ${result.projects?.length || 0} pending projects`);
            
            // Display projects in readable format
            if (result.projects && result.projects.length > 0) {
                console.log('%c==== Pending Projects ====', 'color: blue; font-weight: bold');
                result.projects.forEach((project, index) => {
                    console.log(`%c[${index + 1}] ${project.title}`, 'color: blue; font-weight: bold');
                    console.log(`Region: ${project.region}`);
                    console.log(`Description: ${project.description}`);
                    console.log(`Goal: ${project.goal_amount} ETH`);
                    console.log(`Created: ${new Date(project.created_at).toLocaleString()}`);
                    console.log('--------------------------');
                });
            } else {
                console.log('%c❌ No pending projects found', 'color: orange; font-weight: bold');
            }
            
            return result.projects || [];
        } else {
            const errorData = await response.json();
            console.log('%c❌ Failed to load pending projects', 'color: red; font-weight: bold');
            console.log('Error:', errorData);
            return [];
        }
    } catch (error) {
        console.error('Error loading pending projects:', error);
        return [];
    }
}

// Test the UI update
function refreshAdminUI() {
    if (typeof loadPendingProjects === 'function') {
        loadPendingProjects();
        console.log('%c✅ Refreshed admin UI', 'color: green; font-weight: bold');
    } else {
        console.log('%c❌ loadPendingProjects function not found', 'color: red; font-weight: bold');
    }
}

// Create a debug panel for more convenient access
function showDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'admin-debug-panel';
    panel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #ffffff;
        border: 2px solid #4f46e5;
        border-radius: 5px;
        padding: 10px;
        z-index: 9999;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        width: 250px;
    `;
    
    panel.innerHTML = `
        <h3 style="margin-top: 0; color: #4f46e5;">Admin Debug</h3>
        <button id="debug-check-admin">Check Admin Status</button>
        <button id="debug-examine-token">Examine Token</button>
        <button id="debug-load-projects">Load Projects</button>
        <button id="debug-refresh-ui">Refresh Admin UI</button>
        <button id="debug-close" style="background: #ef4444; color: white; margin-top: 10px;">Close</button>
    `;
    
    document.body.appendChild(panel);
    
    // Add button styles
    const buttons = panel.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.cssText = `
            display: block;
            width: 100%;
            margin-bottom: 5px;
            padding: 5px 10px;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 3px;
            cursor: pointer;
        `;
    });
    
    // Add event listeners
    document.getElementById('debug-check-admin').addEventListener('click', checkIfAdmin);
    document.getElementById('debug-examine-token').addEventListener('click', examineToken);
    document.getElementById('debug-load-projects').addEventListener('click', forceLoadPendingProjects);
    document.getElementById('debug-refresh-ui').addEventListener('click', refreshAdminUI);
    document.getElementById('debug-close').addEventListener('click', () => panel.remove());
}

// Register debug commands
console.log('%c==== Admin Debug Tools Loaded ====', 'color: blue; font-weight: bold');
console.log('Available commands:');
console.log('- checkIfAdmin(): Check if current user is admin');
console.log('- examineToken(): Examine JWT token');
console.log('- forceLoadPendingProjects(): Manually fetch pending projects');
console.log('- refreshAdminUI(): Update the UI with pending projects');
console.log('- showDebugPanel(): Show debug panel with buttons');

// Return an object with all debug functions
const adminDebug = {
    checkIfAdmin,
    examineToken,
    forceLoadPendingProjects,
    refreshAdminUI,
    showDebugPanel
};

// You can call adminDebug.showDebugPanel() to show the panel
showDebugPanel();