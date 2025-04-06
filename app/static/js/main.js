// Global variables
let currentLanguage = 'en';
let pageLoaded = false;
let themeMode = localStorage.getItem('themeMode') || 'light';

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Show loading screen
    showLoading();
    
    // Initialize UI components
    initializeTheme();
    initializeSections();
    initializeLanguageSelector();
    initializeBackToTop();
    initializeRegionSelection();
    
    // Load saved language preference if exists
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
        document.getElementById('languageSelector').value = savedLanguage;
        updateLanguageDirection(savedLanguage);
    }
    
    // Initialize first content update
    updateContent();
    
    // Hide loading screen after everything is initialized
    setTimeout(() => {
        hideLoading();
        pageLoaded = true;
        
        // Add page transition class to body
        document.body.classList.add('page-loaded');
        
        // Initialize AOS animations after page load
        AOS.refresh();
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

// Initialize language selector
function initializeLanguageSelector() {
    const languageSelector = document.getElementById('languageSelector');
    if (!languageSelector) return;

    languageSelector.addEventListener('change', (event) => {
        const newLanguage = event.target.value;
        
        // Only update if language is actually changed
        if (newLanguage !== currentLanguage) {
            // Show mini-loading indicator
            showLanguageChangeLoading();
            
            // Update language with slight delay to show loading effect
            setTimeout(() => {
                currentLanguage = newLanguage;
                localStorage.setItem('preferredLanguage', currentLanguage);
                updateLanguageDirection(currentLanguage);
                updateContent();
                
                // Hide mini-loading
                hideLanguageChangeLoading();
            }, 500);
        }
    });
}

// Show language change loading indicator
function showLanguageChangeLoading() {
    let languageLoading = document.getElementById('languageLoading');
    
    if (!languageLoading) {
        languageLoading = document.createElement('div');
        languageLoading.id = 'languageLoading';
        languageLoading.className = 'language-loading';
        languageLoading.innerHTML = `
            <div class="spinner-mini"></div>
            <span>Changing language...</span>
        `;
        
        document.body.appendChild(languageLoading);
    }
    
    languageLoading.style.display = 'flex';
    setTimeout(() => {
        languageLoading.style.opacity = '1';
    }, 10);
}

// Hide language change loading indicator
function hideLanguageChangeLoading() {
    const languageLoading = document.getElementById('languageLoading');
    
    if (languageLoading) {
        languageLoading.style.opacity = '0';
        
        setTimeout(() => {
            languageLoading.style.display = 'none';
            
            // Optional: remove from DOM
            if (languageLoading.parentNode) {
                languageLoading.parentNode.removeChild(languageLoading);
            }
        }, 300);
    }
}

// Update language direction
function updateLanguageDirection(language) {
    document.documentElement.lang = language;
    
    // RTL languages: Hebrew and Arabic
    if (language === 'he' || language === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.classList.add('rtl');
    } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.classList.remove('rtl');
    }
}

// Update content based on selected language
function updateContent() {
    if (!translations[currentLanguage]) {
        console.error(`Translations not found for language: ${currentLanguage}`);
        return;
    }
    
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.getAttribute('placeholder')) {
                    element.placeholder = translations[currentLanguage][key];
                }
            } else {
                // Special handling for elements with icons
                if (element.innerHTML.includes('<i class="fa')) {
                    // Extract icon HTML
                    const iconMatch = element.innerHTML.match(/<i class="[^"]*"><\/i>/);
                    const iconHtml = iconMatch ? iconMatch[0] : '';
                    
                    // Replace text but keep icon
                    if (iconHtml) {
                        element.innerHTML = iconHtml + ' ' + translations[currentLanguage][key];
                    } else {
                        element.textContent = translations[currentLanguage][key];
                    }
                } else {
                    element.textContent = translations[currentLanguage][key];
                }
            }
        }
    });

    // Dispatch event for other components that might need to update
    document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: currentLanguage }
    }));
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

// Enhanced section navigation with smoother transitions
function showSection(sectionId) {
    // First, hide all sections with a fade-out effect
    const sections = document.querySelectorAll('section');
    const currentSection = document.querySelector('section.active');
    
    // If a section is currently active, fade it out first
    if (currentSection) {
        currentSection.classList.add('fade-out');
        
        // Wait for fade-out animation to complete
        setTimeout(() => {
            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active', 'fade-out');
            });
            
            // Show the target section
            showTargetSection(sectionId);
        }, 300);
    } else {
        // If no section is active, just show the target section
        showTargetSection(sectionId);
    }
    
    // Update active state in navigation
    updateActiveNavLink(sectionId);
}

// Helper function to show target section
function showTargetSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    
    if (targetSection) {
        // Display the section
        targetSection.style.display = 'block';
        
        // Slight delay to ensure display change is processed
        setTimeout(() => {
            // Add active class to trigger entrance animation
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
            
            // Refresh AOS animations
            AOS.refresh();
        }, 10);
    }
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