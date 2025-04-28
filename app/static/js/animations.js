// Enhanced animations and interactive effects
document.addEventListener('DOMContentLoaded', function() {
    console.log("animations.js loaded");
    // Initialize scrolling animations
    initScrollAnimations();
    
    // Initialize navbar effects
    initNavbarEffects();
    
    // Initialize section transitions
    initSectionTransitions();
    
    // אנימציית הלוגו בכניסה
    const heroLogo = document.querySelector('.hero-logo');
    if (heroLogo) {
        setTimeout(() => {
            heroLogo.classList.add('animated-logo');
        }, 500);
    }
});

// Animate elements as they come into viewport
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Optionally stop observing after animation
                // observer.unobserve(entry.target);
            } else {
                entry.target.classList.remove('animated');
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Apply effects to navbar on scroll
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}


// Smooth section transitions
function initSectionTransitions() {
    // Add animated classes to stat items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        item.classList.add('animate-on-scroll');
        item.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Add animated classes to features
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.classList.add('animate-on-scroll');
        feature.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Enhanced section display function
function showSection(sectionId) {
    // First, hide all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    // Then show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Slight delay before adding the active class to ensure proper animation
        setTimeout(() => {
            targetSection.classList.add('active');
            
            // Animate child elements with staggered delay
            const animateItems = targetSection.querySelectorAll('.animate-on-scroll');
            animateItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animated');
                }, 100 + (index * 80));
            });
            
            // Scroll to top with smooth behavior
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Dispatch event that section was changed - this is the new addition
            document.dispatchEvent(new CustomEvent('sectionChanged', {
                detail: { sectionId: sectionId }
            }));
            
        }, 10);
    } else {
        console.error("Section not found:", sectionId);
    }
    
    // Update active state in navigation
    updateActiveNavLink(sectionId);
}

// Update active navigation link
function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.navbar a');
    
    navLinks.forEach(link => {
        link.classList.remove('active-link');
        
        // Check if this link points to the current section
        if (link.getAttribute('onclick') && 
            link.getAttribute('onclick').includes(`showSection('${sectionId}')`)) {
            link.classList.add('active-link');
        }
    });
}

// Add parallax effect to home section
function initParallaxEffect() {
    const homeSection = document.getElementById('home');
    if (homeSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            
            // Only apply effect if we're near the home section
            if (scrollPosition < window.innerHeight) {
                const parallaxElements = homeSection.querySelectorAll('.parallax');
                parallaxElements.forEach(element => {
                    const speed = element.getAttribute('data-speed') || 0.5;
                    element.style.transform = `translateY(${scrollPosition * speed}px)`;
                });
            }
        });
    }
}

// Interactive form effects
function initFormEffects() {
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    
    formInputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        // Remove focus effect
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            
            // Add filled class if input has value
            if (this.value.trim() !== '') {
                this.parentElement.classList.add('filled');
            } else {
                this.parentElement.classList.remove('filled');
            }
        });
        
        // Check initial state
        if (input.value.trim() !== '') {
            input.parentElement.classList.add('filled');
        }
    });
}

// Make functions available globally if needed
window.showSection = showSection;
