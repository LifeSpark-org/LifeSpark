// Project Donation System
console.log("===== project-donations.js מתחיל לטעון =====");

// Global variables
let selectedProjectId = null;
let selectedRegion = 'south'; // Default region
let donationType = 'projects'; // Default donation type (projects or regions)

// נקרא כשהמסמך מוכן
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM נטען, מתחיל אתחול מערכת תרומות הפרויקט");
    
    // בדיקת קיום אלמנטים קריטיים
    const projectsCarousel = document.getElementById('approvedProjectsCarousel');
    console.log("🔍 אלמנט הקרוסלה קיים?", projectsCarousel ? "כן" : "לא");
    

    setTimeout(() => {
        const selectedProjectFromMap = localStorage.getItem('selectedProjectFromMap');
        if (selectedProjectFromMap) {
            console.log(`יש להדגיש פרויקט מהמפה: ${selectedProjectFromMap}`);
            
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
    
    const selectedProjectFromMap = localStorage.getItem('selectedProjectFromMap');
    if (selectedProjectFromMap) {
        console.log(`יש להדגיש פרויקט מהמפה: ${selectedProjectFromMap}`);
        
        // ננקה את המידע הזה כדי שלא ידגיש שוב בטעינות עתידיות
        localStorage.removeItem('selectedProjectFromMap');
        
        // מחכים שהפרויקטים יטענו ואז מדגישים
        setTimeout(() => {
            highlightProjectInCarousel(selectedProjectFromMap);
        }, 1000);
    }

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
        console.log("✅ כפתורי ניווט קרוסלה נמצאו ואירועים מתווספים");
        prevBtn.addEventListener('click', () => {
            console.log("👆 לחיצה על כפתור הקודם");
            scrollCarousel('prev');
        });
        
        nextBtn.addEventListener('click', () => {
            console.log("👆ֶֶ לחיצה על כפתור הבא");
            scrollCarousel('next');
        });
    } else {
        console.error("❌ כפתורי ניווט קרוסלה חסרים", {prevBtn, nextBtn});
    }
    
    
    // טעינה ראשונית של פרויקטים
    console.log("⏳ מתחיל טעינת פרויקטים עם השהייה קצרה...");
    
    try {
        console.log("🚀 מתחיל טעינת פרויקטים מאושרים");
        
        // נקרא ישירות לפונקציה פנימית במקום לקרוא לפונקציה החיצונית שאולי נכשלת
        manuallyLoadProjects();
    } catch (error) {
        console.error("❌❌❌ שגיאה חמורה בטעינת פרויקטים:", error);
    }
});

// פונקציה ידנית לטעינת פרויקטים (פתרון עוקף)
function manuallyLoadProjects() {
    console.log("🔄 טעינת פרויקטים ידנית");
    const projectsCarousel = document.getElementById('approvedProjectsCarousel');
    
    if (!projectsCarousel) {
        console.error("❌ מכיל קרוסלת פרויקטים לא נמצא");
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
    console.log("🔎 מתחיל לבדוק נתיבי API שונים");
    
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
            console.log("✅ נתונים התקבלו:", data);
            
            if (data && data.projects && Array.isArray(data.projects)) {
                if (data.projects.length > 0) {
                    renderProjects(data.projects, projectsCarousel);
                    setupProjectSelection();
                    
                    if (data.projects[0]) {
                        selectProject(
                            data.projects[0]._id,
                            data.projects[0].title,
                            data.projects[0].region
                        );
                    }
                    return;
                }
            } else if (data && Array.isArray(data)) {
                if (data.length > 0) {
                    renderProjects(data, projectsCarousel);
                    setupProjectSelection();
                    
                    if (data[0]) {
                        selectProject(
                            data[0]._id,
                            data[0].title,
                            data[0].region
                        );
                    }
                    return;
                }
            }
            
            // אם הגענו לכאן, לא היו פרויקטים
            tryBackupEndpoint();
        })
        .catch(error => {
            console.error("❌ שגיאה בקריאה לנתיב הראשי:", error);
            tryBackupEndpoint();
        });
}

// נסיון לנתיב גיבוי
function tryBackupEndpoint() {
    console.log("🔄 מנסה נתיב גיבוי");
    const projectsCarousel = document.getElementById('approvedProjectsCarousel');
    
    if (!projectsCarousel) return;
    
    fetch('/api/projects?status=approved')
        .then(response => {
            console.log("📊 תשובה מנתיב גיבוי:", {
                status: response.status,
                ok: response.ok
            });
            
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }
            
            return response.json();
        })
        .then(data => {
            console.log("✅ נתונים התקבלו מנתיב גיבוי:", data);
            
            if (data && data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
                renderProjects(data.projects, projectsCarousel);
                setupProjectSelection();
                
                if (data.projects[0]) {
                    selectProject(
                        data.projects[0]._id,
                        data.projects[0].title,
                        data.projects[0].region
                    );
                }
            } else if (data && Array.isArray(data) && data.length > 0) {
                renderProjects(data, projectsCarousel);
                setupProjectSelection();
                
                if (data[0]) {
                    selectProject(
                        data[0]._id,
                        data[0].title,
                        data[0].region
                    );
                }
            } else {
                showNoProjectsMessage();
            }
        })
        .catch(error => {
            console.error("❌ שגיאה בקריאה לנתיב גיבוי:", error);
            showNoProjectsMessage();
        });
}

function showNoProjectsMessage() {
    console.log("⚠️ אין פרויקטים להצגה");
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
    console.log("🎨 מציג פרויקטים בקרוסלה, מספר פרויקטים:", projects.length);
    
    try {
        container.innerHTML = '';

        projects.forEach((project, index) => {
            console.log(`🏗️ מייצר תצוגת פרויקט ${index + 1}`);
            
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
        
        console.log("✅ הצגת פרויקטים הושלמה בהצלחה");
    } catch (error) {
        console.error("❌ שגיאה בהצגת פרויקטים:", error);
        container.innerHTML = `
            <div class="empty-projects">
                <p>Error displaying projects: ${error.message}</p>
            </div>
        `;
    }
}
// Set up project selection
function setupProjectSelection() {
    console.log("🔄 מגדיר בחירת פרויקטים");
    
    // Add click event to project cards
    const projectSlides = document.querySelectorAll('.project-slide');
    
    projectSlides.forEach((slide, index) => {
        console.log(`📌 מגדיר אירועי בחירה לפרויקט ${index + 1}`);
        
        slide.addEventListener('click', function(e) {
            // מונע התנגשות עם מאזיני אירועים אחרים
            if (e.target.classList.contains('project-select-btn') || 
                e.target.closest('.project-select-btn')) {
                return; // נאפשר לכפתור לטפל באירוע בעצמו
            }
            
            console.log(`👆 לחיצה על שקופית פרויקט`, this.dataset);
            const projectId = this.dataset.projectId;
            const projectTitle = this.dataset.projectTitle;
            const projectRegion = this.dataset.projectRegion;
            
            selectProject(projectId, projectTitle, projectRegion);
        });
        
        // חשוב מאוד: הוסף מאזין אירוע לכפתור בחירה
        const selectBtn = slide.querySelector('.project-select-btn');
        if (selectBtn) {
            // הסר מאזיני אירועים קודמים אם יש
            const newBtn = selectBtn.cloneNode(true);
            if (selectBtn.parentNode) {
                selectBtn.parentNode.replaceChild(newBtn, selectBtn);
            }
            
            // הוסף מאזין חדש
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // מנע בועה למעלה
                
                console.log(`👆 לחיצה על כפתור בחירת פרויקט`);
                const projectId = this.getAttribute('data-project-id');
                const projectSlide = this.closest('.project-slide');
                
                if (!projectSlide) {
                    console.error("לא נמצאה שקופית פרויקט", this);
                    return;
                }
                
                const projectTitle = projectSlide.dataset.projectTitle;
                const projectRegion = projectSlide.dataset.projectRegion;
                
                console.log("נתוני פרויקט:", {
                    id: projectId,
                    title: projectTitle,
                    region: projectRegion
                });
                
                // קריאה לפונקציה להצגת פרטי הפרויקט
                if (typeof showProjectDetails === 'function') {
                    // נסה להשיג מידע נוסף על הפרויקט
                    fetchProjectDetails(projectId)
                        .then(project => {
                            if (project) {
                                showProjectDetails(project);
                            } else {
                                // אם לא הצלחנו להשיג מידע מלא, נשתמש במה שיש
                                showProjectDetails({
                                    id: projectId,
                                    title: projectTitle,
                                    description: projectSlide.querySelector('.project-description')?.textContent || '',
                                    region: projectRegion,
                                    // מידע נוסף שקיים בשקופית
                                    progressPercent: parseInt(projectSlide.querySelector('.progress-fill')?.style.width || '0'),
                                    goalAmount: parseFloat(projectSlide.querySelector('.progress-stats')?.textContent.match(/\d+(\.\d+)?/g)?.[1] || 0),
                                    currentAmount: parseFloat(projectSlide.querySelector('.progress-stats')?.textContent.match(/\d+(\.\d+)?/g)?.[0] || 0)
                                });
                            }
                        });
                } else {
                    console.error("פונקציית showProjectDetails לא קיימת!");
                    // נסה פתרון חלופי
                    if (typeof initProjectDetailModal === 'function' && typeof window.showProjectDetails === 'function') {
                        initProjectDetailModal();
                        window.showProjectDetails({
                            id: projectId,
                            title: projectTitle,
                            description: projectSlide.querySelector('.project-description')?.textContent || '',
                            region: projectRegion
                        });
                    } else {
                        console.error("לא נמצאו פונקציות חלופיות להצגת פרטי פרויקט");
                    }
                }
            });
        }
    });
}

// פונקציה חדשה לקבלת פרטי פרויקט מהשרת
// פונקציה לקבלת פרטי פרויקט מהשרת
async function fetchProjectDetails(projectId) {
    try {
        console.log("מנסה לקבל פרטי פרויקט מהשרת:", projectId);
        const response = await fetch(`/projects/${projectId}`);
        if (response.ok) {
            const data = await response.json();
            console.log("פרטי פרויקט שהתקבלו:", data);
            
            if (data.status === 'success' && data.project) {
                // וודא שיש שדה ethereum_address, אפילו אם הוא ריק
                if (!data.project.ethereum_address) {
                    data.project.ethereum_address = '';
                    console.warn("הפרויקט חסר כתובת ארנק:", data.project);
                }
                
                return data.project;
            }
        }
        
        console.warn("לא הצלחנו לקבל פרטי פרויקט מהשרת", response);
        return null;
    } catch (error) {
        console.error("שגיאה בקבלת פרטי פרויקט:", error);
        return null;
    }
}


// Function to select a project
function selectProject(projectId, projectTitle, projectRegion) {
    console.log(`🎯 בחירת פרויקט: ID=${projectId}, כותרת=${projectTitle}, אזור=${projectRegion}`);
    
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
    console.log(`🔄 גלילת קרוסלה: ${direction}`);
    const carousel = document.getElementById('approvedProjectsCarousel');
    if (!carousel) {
        console.error("❌ אלמנט קרוסלה לא נמצא");
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

// עדכון סיכום תרומה עם פרויקט
function updateDonationSummaryWithProject(projectTitle, projectRegion) {
    console.log(`📝 עדכון סיכום תרומה עם פרויקט: ${projectTitle}, אזור: ${projectRegion}`);
    const summaryProject = document.getElementById('summaryProject');
    const summaryAmount = document.getElementById('summaryAmount');
    const summaryGasFee = document.getElementById('summaryGasFee');
    const summaryTotal = document.getElementById('summaryTotal');
    const amountInput = document.getElementById('amount');
    
    // אם אחד מהאלמנטים חסר, יצא מהפונקציה ללא שגיאות
    if (!summaryProject || !summaryAmount || !summaryTotal || !amountInput) {
        console.warn("אחד או יותר מאלמנטי הסיכום חסרים", {
            summaryProject, summaryAmount, summaryGasFee, summaryTotal, amountInput
        });
        return;
    }
    
    const amount = parseFloat(amountInput.value) || 0;
    const gasFee = 0.001; // עמלת גז משוערת באת'ר
    const total = amount + gasFee;
    
    // הצגת שם הפרויקט והאזור בסיכום
    const regionText = projectRegion === 'south' ? 'Southern Israel' : 'Northern Israel';
    
    summaryProject.textContent = `${projectTitle} (${regionText})`;
    
    // עדכון ערכי הסכומים
    summaryAmount.textContent = `${amount.toFixed(4)} ETH`;
    if (summaryGasFee) summaryGasFee.textContent = `~ ${gasFee.toFixed(4)} ETH`;
    summaryTotal.textContent = `${total.toFixed(4)} ETH`;
}

// רק עבור שלמות - פונקציות עבור בחירה לפי אזורים
function updateDonationSummary() {
    const selectedRegion = document.querySelector('input[name="region"]:checked');
    const amountInput = document.getElementById('amount');
    const summaryProject = document.getElementById('summaryProject');
    const summaryAmount = document.getElementById('summaryAmount');
    const summaryGasFee = document.getElementById('summaryGasFee');
    const summaryTotal = document.getElementById('summaryTotal');
    
    if (!selectedRegion || !summaryProject || !summaryAmount || !summaryTotal) {
        return;
    }
    
    const amount = parseFloat(amountInput?.value) || 0;
    const gasFee = 0.001; // Estimated gas fee in ETH
    const total = amount + gasFee;
    
    // Get region name
    const regionText = selectedRegion.value === 'south' ? 'Southern Israel' : 'Northern Israel';
    
    summaryProject.textContent = `General - ${regionText}`;
    summaryAmount.textContent = `${amount.toFixed(4)} ETH`;
    if (summaryGasFee) summaryGasFee.textContent = `~ ${gasFee.toFixed(4)} ETH`;
    summaryTotal.textContent = `${total.toFixed(4)} ETH`;
}

// Process donation to project (תרומה לפרויקט ספציפי)
async function processDonateToProject(projectId, amount, message = '') {
    try {
        // Show processing notification
        showNotification('info', 'Processing your donation...');
        
        // Display loading indicator on submit button
        const submitButton = document.querySelector('#donationForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<div class="loader-inline"></div> Processing...';
        }
        
        // Get project information to know which region to donate to
        const token = localStorage.getItem('token');
        const projectResponse = await fetch(`/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${token || ''}`
            }
        });
        
        if (!projectResponse.ok) {
            throw new Error('Cannot get project information');
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
        showNotification('success', `Donation successful! Transaction: ${txHash.substring(0, 10)}...`);
        
        // Reset form
        document.getElementById('donationForm').reset();
        updateDonationSummary();
        
        // Reset submit button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-heart"></i> Donate Now';
        }
        
        // Refresh the projects to show updated funding
        setTimeout(manuallyLoadProjects, 2000);
        
    } catch (error) {
        console.error('Error processing project donation:', error);
        showNotification('error', `Error: ${error.message}`);
        
        // Reset submit button
        const submitButton = document.querySelector('#donationForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-heart"></i> Donate Now';
        }
    }
}

// Process donation to region (תרומה לאזור)
async function processDonateToRegion(region, amount, message = '') {
    try {
        // Show processing notification
        showNotification('info', 'Processing your donation...');
        
        // Display loading indicator on submit button
        const submitButton = document.querySelector('#donationForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<div class="loader-inline"></div> Processing...';
        }
        
        // Use existing blockchain donation function
        const txHash = await donateToBlockchain(region, amount, message);
        
        // Show success notification
        showNotification('success', `Donation successful! Transaction: ${txHash.substring(0, 10)}...`);
        
        // Reset form
        document.getElementById('donationForm').reset();
        updateDonationSummary();
        
        // Reset submit button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-heart"></i> Donate Now';
        }
        
    } catch (error) {
        console.error('Error processing region donation:', error);
        showNotification('error', `Error: ${error.message}`);
        
        // Reset submit button
        const submitButton = document.querySelector('#donationForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-heart"></i> Donate Now';
        }
    }
}

console.log("===== project-donations.js טעינה הסתיימה =====");