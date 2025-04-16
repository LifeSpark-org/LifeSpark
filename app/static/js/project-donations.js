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
    
    // Set up carousel navigation
    const prevBtn = document.getElementById('prevProject');
    const nextBtn = document.getElementById('nextProject');
    
    if (prevBtn && nextBtn) {
        console.log("✅ כפתורי ניווט קרוסלה נמצאו ואירועים מתווספים");
        prevBtn.addEventListener('click', () => {
            console.log("👆 לחיצה על כפתור הקודם");
            scrollCarousel('prev');
        });
        
        nextBtn.addEventListener('click', () => {
            console.log("👆 לחיצה על כפתור הבא");
            scrollCarousel('next');
        });
    } else {
        console.error("❌ כפתורי ניווט קרוסלה חסרים", {prevBtn, nextBtn});
    }
    
    // Add event listener for tab switching
    const projectsTab = document.getElementById('projectsTab');
    const regionsTab = document.getElementById('regionsTab');
    
    if (projectsTab && regionsTab) {
        console.log("✅ נמצאו כרטיסיות, מוסיף מאזיני אירועים");
        projectsTab.addEventListener('click', function() {
            console.log("👆 לחיצה על כרטיסיית פרויקטים");
            switchDonationTab('projects');
        });
        
        regionsTab.addEventListener('click', function() {
            console.log("👆 לחיצה על כרטיסיית אזורים");
            switchDonationTab('regions');
        });
    } else {
        console.error("❌ כרטיסיות חסרות", {projectsTab, regionsTab});
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
            <p data-translate="loading-projects">Loading projects...</p>
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

// הצגת הודעה שאין פרויקטים
function showNoProjectsMessage() {
    console.log("⚠️ אין פרויקטים להצגה");
    const projectsCarousel = document.getElementById('approvedProjectsCarousel');
    
    if (!projectsCarousel) return;
    
    projectsCarousel.innerHTML = `
        <div class="empty-projects">
            <p>No approved projects found in the database. Please try again later.</p>
        </div>
    `;
    
    // מעבר לכרטיסיית האזורים
    switchDonationTab('regions');
}

// פונקציה להצגת פרויקטים בקרוסלה
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
            
            // טקסט אזור לפי שפה
            const regionText = project.region === 'south'
                ? (translations?.[currentLanguage]?.['donate-region-south'] || 'Southern Israel')
                : (translations?.[currentLanguage]?.['donate-region-north'] || 'Northern Israel');

            // בניית אלמנט הפרויקט
            const projectSlide = document.createElement('div');
            projectSlide.className = 'project-slide';
            projectSlide.dataset.projectId = project._id;
            projectSlide.dataset.projectTitle = project.title || 'Unnamed Project';
            projectSlide.dataset.projectRegion = project.region || 'south';

            projectSlide.innerHTML = `
                <input type="radio" name="project" id="project-${project._id}" value="${project._id}">
                <label for="project-${project._id}" class="approved-project-card">
                    <div class="project-image ${regionClass}">
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
                            <span data-translate="select-project">Select Project</span>
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
        
        slide.addEventListener('click', function() {
            console.log(`👆 לחיצה על שקופית פרויקט`, this.dataset);
            const projectId = this.dataset.projectId;
            const projectTitle = this.dataset.projectTitle;
            const projectRegion = this.dataset.projectRegion;
            
            selectProject(projectId, projectTitle, projectRegion);
        });
        
        // Also add event listener to the button inside
        const selectBtn = slide.querySelector('.project-select-btn');
        if (selectBtn) {
            selectBtn.addEventListener('click', function(e) {
                console.log(`👆 לחיצה על כפתור בחירת פרויקט`);
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

// Function to switch between projects and regions tabs
function switchDonationTab(tabType) {
    console.log(`🔄 החלפת כרטיסייה לסוג: ${tabType}`);
    const projectsTab = document.getElementById('projectsTab');
    const regionsTab = document.getElementById('regionsTab');
    const projectsContent = document.getElementById('projectsDonationContent');
    const regionsContent = document.getElementById('regionsDonationContent');
    
    if (!projectsTab || !regionsTab || !projectsContent || !regionsContent) {
        console.error("❌ אחד או יותר מאלמנטי הכרטיסיות חסרים");
        return;
    }
    
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
    console.log(`📝 עדכון סיכום תרומה עם פרויקט: ${projectTitle}, אזור: ${projectRegion}`);
    const summaryProject = document.getElementById('summaryProject');
    const amountInput = document.getElementById('amount');
    const summaryAmount = document.getElementById('summaryAmount');
    const summaryGasFee = document.getElementById('summaryGasFee');
    const summaryTotal = document.getElementById('summaryTotal');
    
    if (!summaryProject || !summaryAmount || !summaryTotal) {
        console.error("❌ אלמנטי סיכום חסרים");
        return;
    }
    
    const amount = parseFloat(amountInput?.value) || 0;
    const gasFee = 0.001; // Estimated gas fee in ETH
    const total = amount + gasFee;
    
    // Display project name and region in summary
    const regionText = projectRegion === 'south' ? 
        (translations?.[currentLanguage]?.['donate-region-south'] || 'Southern Israel') : 
        (translations?.[currentLanguage]?.['donate-region-north'] || 'Northern Israel');
    
    summaryProject.textContent = `${projectTitle} (${regionText})`;
    
    // Update amount values
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
    const regionText = selectedRegion.value === 'south' ? 
        (translations[currentLanguage]?.['donate-region-south'] || 'Southern Israel') : 
        (translations[currentLanguage]?.['donate-region-north'] || 'Northern Israel');
    
    summaryProject.textContent = `General - ${regionText}`;
    summaryAmount.textContent = `${amount.toFixed(4)} ETH`;
    if (summaryGasFee) summaryGasFee.textContent = `~ ${gasFee.toFixed(4)} ETH`;
    summaryTotal.textContent = `${total.toFixed(4)} ETH`;
}

// Process donation to project (תרומה לפרויקט ספציפי)
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
        const projectResponse = await fetch(`/projects/${projectId}`, {
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
        setTimeout(manuallyLoadProjects, 2000);
        
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

// Process donation to region (תרומה לאזור)
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

console.log("===== project-donations.js טעינה הסתיימה =====");