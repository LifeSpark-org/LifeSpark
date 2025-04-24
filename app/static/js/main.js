// Global variables
let pageLoaded = false;
let themeMode = localStorage.getItem('themeMode') || 'light';

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Show loading screen
    showLoading();
    
    // Initialize UI components
    initializeTheme();
    initializeSections();
    initializeBackToTop();
    initializeRegionSelection();
    
    // Initialize mobile menu - IMPORTANT: Call this function explicitly
    initializeMobileMenu();

    
    // Initialize first content update
    
    // Hide loading screen after everything is initialized
    setTimeout(() => {
        hideLoading();
        pageLoaded = true;
        
        // Add page transition class to body
        document.body.classList.add('page-loaded');
        
        // Initialize AOS animations after page load
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 800);
});

// Loading screen functions
function showLoading() {
    // Check if loading screen exists
    let loadingScreen = document.getElementById('loadingScreen');
    
    if (!loadingScreen) {
        // Create loading screen
        loadingScreen = document.createElement('div');
        loadingScreen.id = 'loadingScreen';
        loadingScreen.className = 'loading-screen';
        
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <div class="loading-logo">life<span>Spark</span></div>
                <div class="loading-spinner">
                    <div class="spinner"></div>
                </div>
                <div class="loading-text">Loading...</div>
            </div>
        `;
        
        document.body.appendChild(loadingScreen);
    }
    
    // Show loading screen
    loadingScreen.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (loadingScreen) {
        // Fade out loading screen
        loadingScreen.style.opacity = '0';
        
        // Remove loading screen after animation
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = '';
            
            // Optional: remove from DOM
            loadingScreen.parentNode.removeChild(loadingScreen);
        }, 500);
    }
}

// Initialize theme mode (light/dark)
function initializeTheme() {
    // Apply saved theme mode
    applyTheme(themeMode);
    
    // Create theme toggle button if it doesn't exist
    let themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) {
        themeToggle = document.createElement('button');
        themeToggle.id = 'themeToggle';
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        themeToggle.innerHTML = `
            <i class="fas fa-sun sun-icon"></i>
            <i class="fas fa-moon moon-icon"></i>
        `;
        
        // Append to body
        document.body.appendChild(themeToggle);
    }
    
    // Add click event listener
    themeToggle.addEventListener('click', toggleTheme);
}

// Apply theme
function applyTheme(mode) {
    if (mode === 'dark') {
        document.documentElement.classList.add('dark-theme');
        themeMode = 'dark';
    } else {
        document.documentElement.classList.remove('dark-theme');
        themeMode = 'light';
    }
    
    // Save preference to localStorage
    localStorage.setItem('themeMode', themeMode);
}

// Toggle theme mode
function toggleTheme() {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    applyTheme(newMode);
    
    // Animate the toggle button
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.classList.add('theme-toggled');
    
    // Remove animation class after animation completes
    setTimeout(() => {
        themeToggle.classList.remove('theme-toggled');
    }, 500);
}

// Initialize sections
function initializeSections() {
    // Hide all sections initially
    const sections = document.querySelectorAll("section");
    sections.forEach(section => {
        section.style.display = "none";
        section.classList.remove('active');
    });
    
    // Show home section
    const homeSection = document.getElementById("home");
    if (homeSection) {
        homeSection.style.display = "block";
        setTimeout(() => {
            homeSection.classList.add('active');
        }, 10);
    }
}

// Initialize "Back to Top" button
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    if (backToTopBtn) {
        // Initially hide the button
        backToTopBtn.style.display = 'none';
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'block';
                setTimeout(() => {
                    backToTopBtn.style.opacity = '1';
                }, 10);
            } else {
                backToTopBtn.style.opacity = '0';
                setTimeout(() => {
                    backToTopBtn.style.display = 'none';
                }, 300);
            }
        });
        
        // Scroll to top when button is clicked
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize region selection in donation form
function initializeRegionSelection() {
    const regionOptions = document.querySelectorAll('.region-option');
    
    regionOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Get the radio input inside this option
            const radioInput = this.querySelector('input[type="radio"]');
            
            if (radioInput) {
                radioInput.checked = true;
                
                // Trigger the change event to update summary
                const event = new Event('change');
                radioInput.dispatchEvent(event);
                
                // Update UI to show selection
                regionOptions.forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
            }
        });
    });
}

// Enhanced mobile menu function with safe listener binding
function initializeMobileMenu() {
    console.log("Initializing mobile menu...");
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const leftMenu = document.querySelector('.left-menu');
    const rightMenu = document.querySelector('.right-menu');

    if (mobileMenuBtn && leftMenu && rightMenu) {
        console.log("Mobile menu elements found");

        // Clone the button to remove all previous listeners
        const cleanBtn = mobileMenuBtn.cloneNode(true);
        mobileMenuBtn.parentNode.replaceChild(cleanBtn, mobileMenuBtn);

        // Toggle mobile menu on button click
        cleanBtn.addEventListener('click', function () {
            console.log("Mobile menu button clicked");
            document.body.classList.toggle('mobile-menu-open');
            leftMenu.classList.toggle('active');
            rightMenu.classList.toggle('active');

            const expanded = leftMenu.classList.contains('active');
            cleanBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });

        // Create backdrop element if it doesn't exist
        let backdrop = document.querySelector('.mobile-menu-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'mobile-menu-backdrop';
            document.body.appendChild(backdrop);
        }

        // Close menu when clicking on backdrop
        backdrop.addEventListener('click', function () {
            document.body.classList.remove('mobile-menu-open');
            leftMenu.classList.remove('active');
            rightMenu.classList.remove('active');
            cleanBtn.setAttribute('aria-expanded', 'false');
        });

        // Close menu when clicking on links
        const menuLinks = document.querySelectorAll('.left-menu a, .right-menu a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function () {
                document.body.classList.remove('mobile-menu-open');
                leftMenu.classList.remove('active');
                rightMenu.classList.remove('active');
                cleanBtn.setAttribute('aria-expanded', 'false');
            });
        });
    } else {
        console.error("Mobile menu elements not found:",
            mobileMenuBtn ? "Button OK" : "Button missing",
            leftMenu ? "Left menu OK" : "Left menu missing",
            rightMenu ? "Right menu OK" : "Right menu missing"
        );
    }
}


// Enhanced section navigation with smoother transitions
function showSection(sectionId) {
    console.log("Showing section:", sectionId);
    
    // Hide all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active', 'fade-out');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        // Make sure the section is displayed
        targetSection.style.display = 'block';
        
        // Slight delay to ensure display change is processed
        setTimeout(() => {
            // Add active class to trigger animation
            targetSection.classList.add('active');
            
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // On mobile, close the menu if open
            if (window.innerWidth <= 768) {
                const leftMenu = document.querySelector('.left-menu');
                const rightMenu = document.querySelector('.right-menu');
                
                document.body.classList.remove('mobile-menu-open');
                if (leftMenu) leftMenu.classList.remove('active');
                if (rightMenu) rightMenu.classList.remove('active');
                
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                if (mobileMenuBtn) {
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            }
            
            // Animate child elements with staggered delay
            const animateItems = targetSection.querySelectorAll('.animate-on-scroll');
            animateItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animated');
                }, 100 + (index * 80));
            });
            
            // If this is the map section, refresh the map
            if (sectionId === 'map' && typeof refreshMap === 'function') {
                setTimeout(refreshMap, 500);
            }
            
            // Refresh AOS animations
            if (typeof AOS !== 'undefined' && AOS.refresh) {
                AOS.refresh();
            }
        }, 50);
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
        // Remove active class from all links
        link.classList.remove('active-link');
        
        // Check if this link points to the current section
        if (link.getAttribute('onclick') && 
            link.getAttribute('onclick').includes(`showSection('${sectionId}')`)) {
            link.classList.add('active-link');
        }
    });
}

// Function to help with debugging if needed
function debugSections() {
    const sections = document.querySelectorAll('section');
    console.log("All sections:");
    sections.forEach(section => {
        console.log(`${section.id}: display=${section.style.display}, active=${section.classList.contains('active')}`);
    });
}

// Can be called from browser console for debugging
window.debugSections = debugSections;

// Preload images for better performance
function preloadImages() {
    const imagesToPreload = [
        '/static/images/hero-bg.jpg',
        '/static/images/about-image.jpg',
        '/static/images/south-region.jpg',
        '/static/images/north-region.jpg'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}
// Google Translate Integration
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google Translate Widget
    initGoogleTranslate();
    
    // Coordinate Google Translate with our custom language selector
    coordinateTranslationSystems();
});

// Initialize Google Translate functionality
function initGoogleTranslate() {
    // The main initialization happens through the googleTranslateElementInit function
    // which is called by the Google Translate script
    
    // Add event listener to detect when Google Translate finishes loading
    const translateObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && document.querySelector('.goog-te-menu-frame')) {
                console.log('Google Translate widget loaded');
                
                // Apply custom styling to Google Translate elements
                styleGoogleTranslate();
                
                // Stop observing once loaded
                translateObserver.disconnect();
            }
        });
    });
    
    // Start observing
    translateObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Apply additional styling to Google Translate elements that are loaded dynamically
function styleGoogleTranslate() {
    // Hide Google translate top bar if it appears
    const translateBar = document.getElementById(':1.container');
    if (translateBar) {
        translateBar.style.display = 'none';
    }
    
    // Remove any top margin added by Google Translate
    document.body.style.top = '0px !important';
    
    // Apply dark theme styling if in dark mode
    if (document.documentElement.classList.contains('dark-theme')) {
        const translateElements = document.querySelectorAll('.goog-te-gadget-simple');
        translateElements.forEach(element => {
            element.style.backgroundColor = '#1e293b';
            element.style.borderColor = '#334155';
            element.style.color = '#e2e8f0';
        });
    }
}

// Coordinate our native language selector with Google Translate
function coordinateTranslationSystems() {
    const languageSelector = document.getElementById('languageSelector');
    
    if (languageSelector) {
        // Listen for changes to our custom language selector
        languageSelector.addEventListener('change', function(e) {
            // When user changes our language selector, handle Google Translate visibility
            const googleTranslateContainer = document.querySelector('.google-translate-container');
            
            if (e.target.value !== 'en') {
                // Hide Google Translate when using our built-in translations
                if (googleTranslateContainer) {
                    googleTranslateContainer.style.display = 'none';
                }
                
                // Reset Google Translate to English if it was active
                const googleFrame = document.querySelector('.goog-te-menu-frame');
                if (googleFrame) {
                    // This attempts to reset Google Translate
                    const translateElement = google.translate.TranslateElement.getInstance();
                    if (translateElement) {
                        translateElement.restore();
                    }
                }
            } else {
                // Show Google Translate when in English mode
                if (googleTranslateContainer) {
                    googleTranslateContainer.style.display = 'inline-block';
                }
            }
        });
        
        // Initially check language state
        if (languageSelector.value !== 'en') {
            const googleTranslateContainer = document.querySelector('.google-translate-container');
            if (googleTranslateContainer) {
                googleTranslateContainer.style.display = 'none';
            }
        }
    }
    
    // Watch for theme changes to update Google Translate styling
    const themeObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class' && 
                mutation.target === document.documentElement) {
                styleGoogleTranslate();
            }
        });
    });
    
    // Start observing theme changes
    themeObserver.observe(document.documentElement, { attributes: true });
}
// Export for global access
window.showSection = showSection;
window.initializeMobileMenu = initializeMobileMenu;