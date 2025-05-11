// Global variables
let selectedProjectId = null;
let selectedRegion = 'south'; // Default region
let donationType = 'projects'; // Default donation type (projects or regions)
// נקרא כשהמסמך מוכן
document.addEventListener('DOMContentLoaded', function() {    
    // בדיקת קיום אלמנטים קריטיים
    const projectsCarousel = document.getElementById('approvedProjectsCarousel');
    setTimeout(() => {
        const selectedProjectFromMap = localStorage.getItem('selectedProjectFromMap');
        if (selectedProjectFromMap) {            
            // ננקה את המידע הזה כדי שלא ידגיש שוב בטעינות עתידיות
            localStorage.removeItem('selectedProjectFromMap');
            
            // מחכים שהפרויקטים יטענו ואז מדגישים
            setTimeout(() => {
                if (typeof highlightProjectInCarousel === 'function') {
                    highlightProjectInCarousel(selectedProjectFromMap);
                } else if (typeof window.highlightProjectInCarousel === 'function') {
                    window.highlightProjectInCarousel(selectedProjectFromMap);
                } else {
                    console.error("פונקציית הדגשת הפרויקט אינה זמינה");
                }
            }, 1000);
        }
    }, 500);

    // Set up carousel navigation
    const prevBtn = document.getElementById('prevProject');
    const nextBtn = document.getElementById('nextProject');

    // פונקציה להדגשת פרויקט בקרוסלה
    function highlightProjectInCarousel(projectId) {
        // ננסה למצוא את הפרויקט בקרוסלה
        const projectSlides = document.querySelectorAll('.project-slide');
        
        let foundProject = false;
        
        projectSlides.forEach(slide => {
            if (slide.dataset.projectId === projectId) {
                foundProject = true;
                
                // גלילה אל הפרויקט
                const carousel = document.getElementById('approvedProjectsCarousel');
                if (carousel) {
                    // חישוב המיקום לגלילה
                    const slideLeft = slide.offsetLeft;
                    const carouselWidth = carousel.offsetWidth;
                    const scrollPosition = slideLeft - (carouselWidth / 2) + (slide.offsetWidth / 2);
                    
                    // גלילה חלקה אל הפרויקט
                    carousel.scrollTo({
                        left: scrollPosition,
                        behavior: 'smooth'
                    });
                }
                
                // הדגשת הפרויקט עם אנימציה
                slide.classList.add('selected-from-map');
                
                // הוספת אנימציה מהבהבת כדי למשוך תשומת לב
                slide.style.animation = 'pulse-highlight 2s ease-in-out';
                
                // בחירת הפרויקט
                const radioInput = slide.querySelector('input[type="radio"]');
                if (radioInput) {
                    radioInput.checked = true;
                    
                    // הפעלת אירוע שינוי כדי לעדכן את הממשק
                    const event = new Event('change');
                    radioInput.dispatchEvent(event);
                }
                
                // אם קיים כפתור בחירה, נלחץ עליו אוטומטית
                const selectBtn = slide.querySelector('.project-select-btn');
                if (selectBtn) {
                    setTimeout(() => {
                        selectBtn.click();
                    }, 800);
                }
            }
        });
        
        if (!foundProject) {
            console.warn(`לא נמצא פרויקט עם מזהה ${projectId} בקרוסלה`);
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
        console.error("❌ כפתורי ניווט קרוסלה חסרים", {prevBtn, nextBtn});
    }
    
    try {        
        // נקרא ישירות לפונקציה פנימית במקום לקרוא לפונקציה החיצונית שאולי נכשלת
        manuallyLoadProjects();
    } catch (error) {
        console.error("❌❌❌ שגיאה חמורה בטעינת פרויקטים:", error);
    }

});

// פונקציה ידנית לטעינת פרויקטים (פתרון עוקף)
function manuallyLoadProjects() {
    const projectsCarousel = document.getElementById('approvedProjectsCarousel');
    if (!projectsCarousel) {
        return;
    }
    // הצג מסך טעינה
    projectsCarousel.innerHTML = `
        <div class="loading-placeholder">
            <div class="spinner"></div>
            <p>Loading projects...</p>
        </div>
    `;
    
    // נסה כל אחד מהנתיבים בנפרד ובצורה מבוקרת
    fetch('/projects/approved')
        .then(response => {
            console.log("📊 תשובה מ-/projects/approved:", {
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
            
            // אם הגענו לכאן, לא היו פרויקטים
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
            <p>אין פרויקטים מאושרים זמינים כרגע. אנא בקר/י באתר מאוחר יותר או הגש/י פרויקט משלך.</p>
            <div class="empty-projects-actions">
                <button class="btn btn-primary btn-sm" onclick="showSection('submit-project')">
                    <i class="fas fa-plus-circle"></i> הגשת פרויקט חדש
                </button>
            </div>
        </div>
    `;
}

function renderProjects(projects, container) {    
    try {
        container.innerHTML = '';
        projects.forEach((project, index) => {
            // בדיקת מזהה
            if (!project._id) {
                console.warn(`⚠️ פרויקט ללא מזהה, משתמש במזהה זמני`, project);
                project._id = `temp-${index}`;
            }
            
            // חישוב אחוזי התקדמות
            let progress = 0;
            if (project.goal_amount && project.goal_amount > 0) {
                progress = Math.min(100, Math.round((project.current_amount || 0) / project.goal_amount * 100));
            }

            // קביעת מחלקת אזור
            const regionClass = project.region === 'south' ? 'south' : 'north';
            
            // טקסט אזור - using direct text
            const regionText = project.region === 'south' ? 'Southern Israel' : 'Northern Israel';

            // הכנת סגנון התמונה
            let projectImageStyle = '';
            if (project.project_image) {
                // אם יש תמונת פרויקט, השתמש בה כרקע
                projectImageStyle = `background-image: url('${project.project_image}'); background-size: cover; background-position: center;`;
            } else {
                // אחרת השתמש בתמונת ברירת המחדל לפי האזור
                projectImageStyle = `background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/static/images/${regionClass}-project.jpg');`;
            }

            // בניית אלמנט הפרויקט
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
        
        // חשוב מאוד: הוסף מאזין אירוע לכפתור בחירה
        const selectBtn = slide.querySelector('.project-select-btn');
        if (selectBtn) {
            // הסר מאזיני אירועים קודמים אם יש
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
