// Global variable for current language
let currentLanguage = 'en';

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Hide all sections initially
    const sections = document.querySelectorAll("section");
    sections.forEach(section => {
        section.style.display = "none";
        section.classList.remove('active');
    });
    
    // Show home section
    const homeSection = document.getElementById("home");
    homeSection.style.display = "block";
    setTimeout(() => {
        homeSection.classList.add('active');
    }, 10);

    // Initialize language selector
    initializeLanguageSelector();
    
    // Load saved language preference if exists
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
        document.getElementById('languageSelector').value = savedLanguage;
        updateLanguageDirection(savedLanguage);
    }
    
    // Initialize first content update
    updateContent();
});

// Navigation between sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        setTimeout(() => {
            targetSection.classList.add('active');
        }, 10);
        window.scrollTo(0, 0);
    }
}

// Language handling
function initializeLanguageSelector() {
    const languageSelector = document.getElementById('languageSelector');
    if (!languageSelector) return;

    languageSelector.addEventListener('change', (event) => {
        currentLanguage = event.target.value;
        localStorage.setItem('preferredLanguage', currentLanguage);
        updateLanguageDirection(currentLanguage);
        updateContent();
    });
}

function updateLanguageDirection(language) {
    document.documentElement.lang = language;
    if (language === 'he' || language === 'ar') {
        document.documentElement.dir = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
    }
}

// Update content based on selected language
function updateContent() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[currentLanguage][key];
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });

    // Update auth menu if exists
    const authMenu = document.getElementById('authMenu');
    if (authMenu) {
        const token = localStorage.getItem('token');
        if (token) {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData) {
                updateAuthMenu(userData);
            }
        }
    }

    // Dispatch event for other components that might need to update
    document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: currentLanguage }
    }));
}