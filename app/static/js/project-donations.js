// Project Donation System

// Global variables
let selectedProjectId = null;
let selectedRegion = 'south'; // Default region
let donationType = 'projects'; // Default donation type (projects or regions)

// Initialize project carousel when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Set up carousel navigation
    const prevBtn = document.getElementById('prevProject');
    const nextBtn = document.getElementById('nextProject');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            scrollCarousel('prev');
        });
        
        nextBtn.addEventListener('click', () => {
            scrollCarousel('next');
        });
    }
    
    // Add event listener for tab switching
    const projectsTab = document.getElementById('projectsTab');
    const regionsTab = document.getElementById('regionsTab');
    
    if (projectsTab && regionsTab) {
        projectsTab.addEventListener('click', function() {
            switchDonationTab('projects');
        });
        
        regionsTab.addEventListener('click', function() {
            switchDonationTab('regions');
        });
    }
    
    // Add event listener for donation form to include project info
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        // Preserve the original submit handler
        const originalSubmitHandler = donationForm.onsubmit;
        
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const amount = document.getElementById('amount').value;
            const message = document.getElementById('message')?.value || '';
            
            if (!amount || parseFloat(amount) <= 0) {
                showNotification('error', 'Please enter a valid donation amount');
                return;
            }
            
            // Check if wallet is connected
            if (!window.userWalletAddress) {
                showNotification('error', 'Please connect your wallet first');
                const connectWalletButton = document.getElementById('connectWallet');
                if (connectWalletButton) {
                    connectWalletButton.scrollIntoView({ behavior: 'smooth' });
                }
                return;
            }
            
            // Process donation based on type
            if (donationType === 'projects' && selectedProjectId) {
                // Donate to specific project
                processDonateToProject(selectedProjectId, amount, message);
            } else {
                // Use the original donation logic for regions
                const region = document.querySelector('input[name="region"]:checked')?.value || 'south';
                processDonateToRegion(region, amount, message);
            }
        });
    }
    
    // Check if we're on the donate section, and if so, load projects
    if (document.getElementById('donate').classList.contains('active')) {
        loadApprovedProjects();
    }
    
    // Add event listener to load projects when navigating to the donate section
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('[onclick*="showSection(\'donate\'"]') || 
            e.target.closest('[onclick*="showSection(\'donate\'"]')) {
            setTimeout(loadApprovedProjects, 100);
        }
    });
});

// Function to process donation to a project
async function processDonateToProject(projectId, amount, message = '') {
    try {
        // Show processing notification
        showNotification('info', 'מעבד את התרומה שלך...');
        
        // Display loading indicator on submit button
        const submitButton = document.querySelector('#donationForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<div class="loader-inline"></div> מעבד...';
        }
        
        // Get project information to know which region to donate to
        const token = localStorage.getItem('token');
        const projectResponse = await fetch(`/admin/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${token || ''}`
            }
        });
        
        if (!projectResponse.ok) {
            throw new Error('לא ניתן לקבל מידע על הפרויקט');
        }
        
        const projectData = await projectResponse.json();
        const region = projectData.project.region;
        
        // Perform the blockchain donation to the region
        const txHash = await donateToBlockchain(region, amount, message);
        
        // After successful blockchain donation, update the project in our database
        const updateResponse = await fetch(`/projects/${projectId}/update-donation`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token || ''}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: parseFloat(amount),
                txHash: txHash,
                message: message
            })
        });
        
        if (!updateResponse.ok) {
            console.warn('Project donation was recorded on blockchain but not updated in database');
        }
        
        // Show success notification
        showNotification('success', `התרומה בוצעה בהצלחה! מזהה עסקה: ${txHash.substring(0, 10)}...`);
        
        // Reset form
        document.getElementById('donationForm').reset();
        updateDonationSummary();
        
        // Reset submit button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-heart"></i> תרום עכשיו';
        }
        
        // Refresh the projects to show updated funding
        setTimeout(loadApprovedProjects, 2000);
        
    } catch (error) {
        console.error('Error processing project donation:', error);
        showNotification('error', `שגיאה: ${error.message}`);
        
        // Reset submit button
        const submitButton = document.querySelector('#donationForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-heart"></i> תרום עכשיו';
        }
    }
}

// Function to process donation to a region (using existing code)
async function processDonateToRegion(region, amount, message = '') {
    try {
        // Show processing notification
        showNotification('info', 'מעבד את התרומה שלך...');
        
        // Display loading indicator on submit button
        const submitButton = document.querySelector('#donationForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<div class="loader-inline"></div> מעבד...';
        }
        
        // Use existing blockchain donation function
        const txHash = await donateToBlockchain(region, amount, message);
        
        // Show success notification
        showNotification('success', `התרומה בוצעה בהצלחה! מזהה עסקה: ${txHash.substring(0, 10)}...`);
        
        // Reset form
        document.getElementById('donationForm').reset();
        updateDonationSummary();
        
        // Reset submit button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-heart"></i> תרום עכשיו';
        }
        
    } catch (error) {
        console.error('Error processing region donation:', error);
        showNotification('error', `שגיאה: ${error.message}`);
        
        // Reset submit button
        const submitButton = document.querySelector('#donationForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-heart"></i> תרום עכשיו';
        }
    }
}

// Function to load approved projects
function loadApprovedProjects() {
    const projectsCarousel = document.getElementById('approvedProjectsCarousel');
    
    if (!projectsCarousel) return;
    
    // Show loading indicator
    projectsCarousel.innerHTML = `
        <div class="loading-placeholder">
            <div class="spinner"></div>
            <p data-translate="loading-projects">Loading projects...</p>
        </div>
    `;
    
    // Get the token from local storage
    const token = localStorage.getItem('token');
    
    // Fetch approved projects from the server
    fetch('/admin/projects/approved', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token || ''}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success' && data.projects && data.projects.length > 0) {
            // Render projects
            renderProjects(data.projects, projectsCarousel);
            
            // Add event listeners to project slides
            setupProjectSelection();
            
            // Select the first project by default
            if (data.projects.length > 0) {
                selectProject(data.projects[0]._id, data.projects[0].title, data.projects[0].region);
            }
        } else {
            // No projects found
            projectsCarousel.innerHTML = `
                <div class="empty-projects">
                    <p data-translate="no-approved-projects">No approved projects found</p>
                </div>
            `;
            // Default to regions tab
            switchDonationTab('regions');
        }
    })
    .catch(error => {
        console.error('Error loading projects:', error);
        projectsCarousel.innerHTML = `
            <div class="empty-projects">
                <p>Error loading projects. Please try again later.</p>
            </div>
        `;
        // Default to regions tab on error
        switchDonationTab('regions');
    });
}

// Function to render projects in the carousel
function renderProjects(projects, container) {
    // Clear loading indicator
    container.innerHTML = '';
    
    // Add projects to carousel
    projects.forEach(project => {
        const progress = project.current_amount ? Math.min(100, Math.round((project.current_amount / project.goal_amount) * 100)) : 0;
        const regionClass = project.region === 'south' ? 'south' : 'north';
        const regionText = project.region === 'south' ? 
            (translations[currentLanguage]?.['donate-region-south'] || 'Southern Israel') : 
            (translations[currentLanguage]?.['donate-region-north'] || 'Northern Israel');
        
        const projectSlide = document.createElement('div');
        projectSlide.className = 'project-slide';
        projectSlide.dataset.projectId = project._id;
        projectSlide.dataset.projectTitle = project.title;
        projectSlide.dataset.projectRegion = project.region;
        
        projectSlide.innerHTML = `
            <input type="radio" name="project" id="project-${project._id}" value="${project._id}">
            <label for="project-${project._id}" class="approved-project-card">
                <div class="project-image ${regionClass}">
                    <div class="project-badge ${regionClass}">${regionText}</div>
                </div>
                <div class="project-content">
                    <h4 class="project-title">${project.title}</h4>
                    <p class="project-description">${project.description}</p>
                    <div class="project-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="progress-stats">
                            <span>${project.current_amount || 0} / ${project.goal_amount} ETH</span>
                            <span>${progress}%</span>
                        </div>
                    </div>
                    <button type="button" class="project-select-btn" data-project-id="${project._id}">
                        <span data-translate="select-project">Select Project</span>
                    </button>
                </div>
            </label>
        `;
        
        container.appendChild(projectSlide);
    });
}

// Set up project selection
function setupProjectSelection() {
    // Add click event to project cards
    const projectSlides = document.querySelectorAll('.project-slide');
    
    projectSlides.forEach(slide => {
        slide.addEventListener('click', function() {
            const projectId = this.dataset.projectId;
            const projectTitle = this.dataset.projectTitle;
            const projectRegion = this.dataset.projectRegion;
            
            selectProject(projectId, projectTitle, projectRegion);
        });
        
        // Also add event listener to the button inside
        const selectBtn = slide.querySelector('.project-select-btn');
        if (selectBtn) {
            selectBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent bubbling to the slide
                const projectId = this.getAttribute('data-project-id');
                const projectSlide = this.closest('.project-slide');
                const projectTitle = projectSlide.dataset.projectTitle;
                const projectRegion = projectSlide.dataset.projectRegion;
                
                selectProject(projectId, projectTitle, projectRegion);
            });
        }
    });
}

// Function to select a project
function selectProject(projectId, projectTitle, projectRegion) {
    // Update global variables
    selectedProjectId = projectId;
    selectedRegion = projectRegion;
    donationType = 'projects';
    
    // Update UI to show selected project
    const projectSlides = document.querySelectorAll('.project-slide');
    
    projectSlides.forEach(slide => {
        if (slide.dataset.projectId === projectId) {
            slide.classList.add('selected');
            const radioBtn = slide.querySelector('input[type="radio"]');
            if (radioBtn) {
                radioBtn.checked = true;
            }
        } else {
            slide.classList.remove('selected');
            const radioBtn = slide.querySelector('input[type="radio"]');
            if (radioBtn) {
                radioBtn.checked = false;
            }
        }
    });
    
    // Update donation summary
    updateDonationSummaryWithProject(projectTitle, projectRegion);
}

// Function to scroll the carousel
function scrollCarousel(direction) {
    const carousel = document.getElementById('approvedProjectsCarousel');
    if (!carousel) return;
    
    const scrollAmount = 300; // Adjust this value as needed
    const currentScroll = carousel.scrollLeft;
    
    if (direction === 'prev') {
        carousel.scrollTo({
            left: currentScroll - scrollAmount,
            behavior: 'smooth'
        });
    } else {
        carousel.scrollTo({
            left: currentScroll + scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Function to switch between projects and regions tabs
function switchDonationTab(tabType) {
    const projectsTab = document.getElementById('projectsTab');
    const regionsTab = document.getElementById('regionsTab');
    const projectsContent = document.getElementById('projectsDonationContent');
    const regionsContent = document.getElementById('regionsDonationContent');
    
    if (!projectsTab || !regionsTab || !projectsContent || !regionsContent) return;
    
    if (tabType === 'projects') {
        // Show projects tab
        projectsTab.classList.add('active');
        regionsTab.classList.remove('active');
        projectsContent.style.display = 'block';
        regionsContent.style.display = 'none';
        donationType = 'projects';
        
        // If there's a selected project, update summary
        if (selectedProjectId) {
            const selectedSlide = document.querySelector(`.project-slide[data-project-id="${selectedProjectId}"]`);
            if (selectedSlide) {
                updateDonationSummaryWithProject(
                    selectedSlide.dataset.projectTitle,
                    selectedSlide.dataset.projectRegion
                );
            }
        }
    } else {
        // Show regions tab
        regionsTab.classList.add('active');
        projectsTab.classList.remove('active');
        regionsContent.style.display = 'block';
        projectsContent.style.display = 'none';
        donationType = 'regions';
        
        // Update summary with selected region
        updateDonationSummary();
    }
}

// Update donation summary with project information
function updateDonationSummaryWithProject(projectTitle, projectRegion) {
    const summaryProject = document.getElementById('summaryProject');
    const amountInput = document.getElementById('amount');
    const summaryAmount = document.getElementById('summaryAmount');
    const summaryGasFee = document.getElementById('summaryGasFee');
    const summaryTotal = document.getElementById('summaryTotal');
    
    if (!summaryProject || !summaryAmount || !summaryTotal) return;
    
    const amount = parseFloat(amountInput?.value) || 0;
    const gasFee = 0.001; // Estimated gas fee in ETH
    const total = amount + gasFee;
    
    // Display project name and region in summary
    const regionText = projectRegion === 'south' ? 
        (translations[currentLanguage]?.['donate-region-south'] || 'Southern Israel') : 
        (translations[currentLanguage]?.['donate-region-north'] || 'Northern Israel');
    
    summaryProject.textContent = `${projectTitle} (${regionText})`;
    
    // Update amount values
    summaryAmount.textContent = `${amount.toFixed(4)} ETH`;
    if (summaryGasFee) summaryGasFee.textContent = `~ ${gasFee.toFixed(4)} ETH`;
    summaryTotal.textContent = `${total.toFixed(4)} ETH`;
}