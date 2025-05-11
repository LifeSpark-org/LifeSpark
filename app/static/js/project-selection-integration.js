// project-selection-integration.js
// This file adds project selection functionality and integrates with the existing system

document.addEventListener('DOMContentLoaded', function() {
    // Add the project details script if it doesn't already exist
    if (!document.getElementById('project-detail-script')) {
        const script = document.createElement('script');
        script.id = 'project-detail-script';
        script.src = '/static/js/project-detail-modal.js';
        document.body.appendChild(script);
    }
    
    // Wait for relevant parts of the page to load
    const waitForElements = setInterval(function() {
        const projectsCarousel = document.getElementById('approvedProjectsCarousel');
        if (projectsCarousel) {
            clearInterval(waitForElements);
            enhanceProjectSelection();
        }
    }, 500);
});

// Function to improve user experience in project selection
function enhanceProjectSelection() {    
    // Enhance project cards
    enhanceProjectCards();
    
    // Add listener for loading new projects
    observeProjectCarousel();
}

// Enhance current project cards
function enhanceProjectCards() {
    const projectSlides = document.querySelectorAll('.project-slide');
    
    projectSlides.forEach(slide => {
        // Make the entire card clickable
        makeCardClickable(slide);
        
        // Add hover event for animation
        addHoverEffect(slide);
    });
}

// Make the entire card clickable
function makeCardClickable(slide) {
    const card = slide.querySelector('.approved-project-card');
    if (!card) return;
    
    // Add event listener to the entire card (not just the button)
    card.addEventListener('click', function(e) {
        // Ignore clicks on the button (it already has a listener)
        if (e.target.closest('.project-select-btn')) {
            return;
        }
        
        // Simulate click on the select button
        const selectButton = slide.querySelector('.project-select-btn');
        if (selectButton) {
            selectButton.click();
        }
    });
    
    // Add cursor to indicate card is clickable
    card.style.cursor = 'pointer';
}

// Add hover effect to cards
function addHoverEffect(slide) {
    const card = slide.querySelector('.approved-project-card');
    if (!card) return;
    
    // Add event listeners for hover
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = 'var(--box-shadow-lg)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
}

// Listen for changes in projects carousel
function observeProjectCarousel() {
    const carousel = document.getElementById('approvedProjectsCarousel');
    if (!carousel) return;
    
    // Create mutation observer
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // When new projects are added, enhance them
                enhanceProjectCards();
            }
        });
    });
    
    // Start observing changes
    observer.observe(carousel, {
        childList: true,
        subtree: true
    });
}