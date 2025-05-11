// Global variables
let selectedProjectId = null;
let selectedRegion = 'south'; // Default region
let donationType = 'projects'; // Default donation type (projects or regions)
// Called when document is ready
document.addEventListener('DOMContentLoaded', function() {    
    // Check existence of critical elements
    const projectsCarousel = document.getElementById('approvedProjectsCarousel');
    setTimeout(() => {
        const selectedProjectFromMap = localStorage.getItem('selectedProjectFromMap');
        if (selectedProjectFromMap) {            
            // Clear this info so it doesn't highlight again in future loads
            localStorage.removeItem('selectedProjectFromMap');
            
            // Wait for projects to load and then highlight
            setTimeout(() => {
                if (typeof highlightProjectInCarousel === 'function') {
                    highlightProjectInCarousel(selectedProjectFromMap);
                } else if (typeof window.highlightProjectInCarousel === 'function') {
                    window.highlightProjectInCarousel(selectedProjectFromMap);
                } else {
                    console.error("Project highlight function not available");
                }
            }, 1000);
        }
    }, 500);

    // Set up carousel navigation
    const prevBtn = document.getElementById('prevProject');
    const nextBtn = document.getElementById('nextProject');

    // Function to highlight project in carousel
    function highlightProjectInCarousel(projectId) {
        // Try to find the project in carousel
        const projectSlides = document.querySelectorAll('.project-slide');
        
        let foundProject = false;
        
        projectSlides.forEach(slide => {
            if (slide.dataset.projectId === projectId) {
                foundProject = true;
                
                // Scroll to the project
                const carousel = document.getElementById('approvedProjectsCarousel');
                if (carousel) {
                    // Calculate scroll position
                    const slideLeft = slide.offsetLeft;
                    const carouselWidth = carousel.offsetWidth;
                    const scrollPosition = slideLeft - (carouselWidth / 2) + (slide.offsetWidth / 2);
                    
                    // Smooth scroll to project
                    carousel.scrollTo({
                        left: scrollPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Highlight project with animation
                slide.classList.add('selected-from-map');
                
                // Add blinking animation to draw attention
                slide.style.animation = 'pulse-highlight 2s ease-in-out';
                
                // Select the project
                const radioInput = slide.querySelector('input[type="radio"]');
                if (radioInput) {
                    radioInput.checked = true;
                    
                    // Trigger change event to update interface
                    const event = new Event('change');
                    radioInput.dispatchEvent(event);
                }
                
                // If selection button exists, click it automatically
                const selectBtn = slide.querySelector('.project-select-btn');
                if (selectBtn) {
                    setTimeout(() => {
                        selectBtn.click();
                    }, 800);
                }
            }
        });
        
        if (!foundProject) {
            console.warn(`Project with ID ${projectId} not found in carousel`);
        }
    }


    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            scrollCarousel('prev');
        });
        
        nextBtn.addEventListener('click', () => {
            scrollCarousel('next');
        });
    } else {
        console.error("❌ Carousel navigation buttons missing", {prevBtn, nextBtn});
    }
    
    try {        
        // Call the internal function directly instead of calling the external function that might fail
        manuallyLoadProjects();
    } catch (error) {
        console.error("❌❌❌ Severe error loading projects:", error);
    }

});

// Manual function to load projects (workaround solution)
function manuallyLoadProjects() {
    const projectsCarousel = document.getElementById('approvedProjectsCarousel');
    if (!projectsCarousel) {
        return;
    }
    // Show loading screen
    projectsCarousel.innerHTML = `
        <div class="loading-placeholder">
            <div class="spinner"></div>
            <p>Loading projects...</p>
        </div>
    `;
    
    // Try each path separately and in a controlled manner
    fetch('/projects/approved')
        .then(response => {
            console.log("📊 Response from /projects/approved:", {
                status: response.status,
                ok: response.ok
            });
            
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.projects && Array.isArray(data.projects)) {
                if (data.projects.length > 0) {
                    renderProjects(data.projects, projectsCarousel);
                    setupProjectSelection();
                    return;
                }
            } else if (data && Array.isArray(data)) {
                if (data.length > 0) {
                    renderProjects(data, projectsCarousel);
                    setupProjectSelection();
                    return;
                }
            }
            
            // If we got here, there were no projects
            showNoProjectsMessage();
        })
        .catch(error => {
            showNoProjectsMessage();
        });
}

function showNoProjectsMessage() {
    const projectsCarousel = document.getElementById('approvedProjectsCarousel');
    
    if (!projectsCarousel) return;
    
    projectsCarousel.innerHTML = `
        <div class="empty-projects">
            <p>No approved projects are currently available. Please check back later or submit your own project.</p>
            <div class="empty-projects-actions">
                <button class="btn btn-primary btn-sm" onclick="showSection('submit-project')">
                    <i class="fas fa-plus-circle"></i> Submit New Project
                </button>
            </div>
        </div>
    `;
}

function renderProjects(projects, container) {    
    try {
        container.innerHTML = '';
        projects.forEach((project, index) => {
            // Check ID
            if (!project._id) {
                console.warn(`⚠️ Project without ID, using temporary ID`, project);
                project._id = `temp-${index}`;
            }
            
            // Calculate progress percentage
            let progress = 0;
            if (project.goal_amount && project.goal_amount > 0) {
                progress = Math.min(100, Math.round((project.current_amount || 0) / project.goal_amount * 100));
            }

            // Set region class
            const regionClass = project.region === 'south' ? 'south' : 'north';
            
            // Region text - using direct text
            const regionText = project.region === 'south' ? 'Southern Israel' : 'Northern Israel';

            // Prepare image style
            let projectImageStyle = '';
            if (project.project_image) {
                // If there's a project image, use it as background
                projectImageStyle = `background-image: url('${project.project_image}'); background-size: cover; background-position: center;`;
            } else {
                // Otherwise use default image based on region
                projectImageStyle = `background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/static/images/${regionClass}-project.jpg');`;
            }

            // Build project element
            const projectSlide = document.createElement('div');
            projectSlide.className = 'project-slide';
            projectSlide.dataset.projectId = project._id;
            projectSlide.dataset.ethereumAddress = project.ethereum_address;
            projectSlide.dataset.projectTitle = project.title || 'Unnamed Project';
            projectSlide.dataset.projectRegion = project.region || 'south';

            projectSlide.innerHTML = `
                <input type="radio" name="project" id="project-${project._id}" value="${project._id}">
                <label for="project-${project._id}" class="approved-project-card">
                    <div class="project-image" style="${projectImageStyle}">
                        <div class="project-badge ${regionClass}">${regionText}</div>
                    </div>
                    <div class="project-content">
                        <h4 class="project-title">${project.title || 'Unnamed Project'}</h4>
                        <p class="project-description">${project.description || 'No description available'}</p>
                        <div class="project-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <div class="progress-stats">
                                <span>${project.current_amount || 0} / ${project.goal_amount || 0} ETH</span>
                                <span>${progress}%</span>
                            </div>
                        </div>
                        <button type="button" class="project-select-btn" data-project-id="${project._id}">
                            Select Project
                        </button>
                    </div>
                </label>
            `;

            container.appendChild(projectSlide);
        });

        if (projects.length === 0) {
            container.innerHTML = `
                <div class="empty-projects">
                    <p>No projects available at this time.</p>
                </div>
            `;
        }
        
    } catch (error) {
        container.innerHTML = `
            <div class="empty-projects">
                <p>Error displaying projects: ${error.message}</p>
            </div>
        `;
    }
}
// Set up project selection
function setupProjectSelection() {
    // Add click event to project cards
    const projectSlides = document.querySelectorAll('.project-slide');
    projectSlides.forEach((slide, index) => {
        
        // Very important: Add event listener to selection button
        const selectBtn = slide.querySelector('.project-select-btn');
        if (selectBtn) {
            // Remove previous event listeners if any
            const newBtn = selectBtn.cloneNode(true);
            if (selectBtn.parentNode) {
                selectBtn.parentNode.replaceChild(newBtn, selectBtn);
            }
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
    // updateDonationSummaryWithProject(projectTitle, projectRegion);
 }
 
 // Function to scroll the carousel
 function scrollCarousel(direction) {
    const carousel = document.getElementById('approvedProjectsCarousel');
    if (!carousel) {
        return;
    }
    
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