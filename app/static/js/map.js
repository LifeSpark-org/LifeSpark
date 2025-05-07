// קובץ map.js מפושט ביותר
let mapInstance = null;

document.addEventListener('DOMContentLoaded', function() {
    // מאזין ללחיצות על הניווט של המפה
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('[onclick*="showSection(\'map\'"]') || 
            e.target.closest('[onclick*="showSection(\'map\'"]')) {
            setTimeout(function() {
                console.log("יזמתי טעינת מפה בעקבות ניווט");
                initMap();
                // קורא לפונקציית הגודל פעמיים, בהפרש זמנים
                if (mapInstance) {
                    mapInstance.invalidateSize();
                    setTimeout(function() {
                        mapInstance.invalidateSize();
                        loadProjectsToMap();
                    }, 500);
                }
            }, 100);
        }
    });
    
    // בודק אם אנחנו בדף המפה ישירות
    if (window.location.hash === '#map' || document.getElementById('map').classList.contains('active')) {
        setTimeout(initMap, 100);
    }
});

function initMap() {
    const mapContainer = document.getElementById('leafletMap');
    if (!mapContainer) {
        console.error("מיכל המפה לא נמצא!");
        return;
    }
    
    // אם המפה כבר מאותחלת, רק נרענן את הגודל שלה
    if (mapInstance) {
        console.log("המפה כבר קיימת, מרענן גודל...");
        mapInstance.invalidateSize();
        return;
    }
    
    console.log("מאתחל מפה חדשה...");
    
    try {
        // ניסיון פשוט למפה בסיסית עם אריח אחד
        mapInstance = L.map('leafletMap', {
            center: [31.4117, 35.0818], // מרכז ישראל
            zoom: 8, // רמת זום שמראה את רוב המדינה
            zoomControl: true
        });
        
        // רענון גודל המפה
        setTimeout(function() {
            mapInstance.invalidateSize();
        }, 100);
        
        // הוספת שכבת אריחים
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);
        

        
        // עדכון אזור במידע צד
        updateRegionInfo('south');
        
        console.log("המפה אותחלה בהצלחה!");
        
        // רענון נוסף לאחר 1 שניה
        setTimeout(function() {
            mapInstance.invalidateSize();
            console.log("גודל המפה רוענן שוב");
        }, 1000);
        
    } catch (error) {
        console.error("שגיאה באתחול המפה:", error);
    }
}

function updateRegionInfo(region) {
    const regionInfoElement = document.getElementById('regionInfo');
    if (!regionInfoElement) return;
    
    if (region === 'south') {
        regionInfoElement.innerHTML = `
            <h4>אזור הדרום</h4>
            <p>אזור הדרום כולל ערים כמו באר שבע, אשקלון ושדרות. התרומות שלנו מתמקדות בשיקום בתים, אספקת ציוד רפואי וחלוקת מזון.</p>
            <div class="region-info-stats">
                <div class="info-stat">
                    <span class="stat-value">8</span>
                    <span class="stat-label">פרויקטים</span>
                </div>
                <div class="info-stat">
                    <span class="stat-value">180+</span>
                    <span class="stat-label">מוטבים</span>
                </div>
                <div class="info-stat">
                    <span class="stat-value">3.2 ETH</span>
                    <span class="stat-label">גויסו</span>
                </div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="showSection('donate')">
                <i class="fas fa-heart"></i> תרום לאזור הדרום
            </button>
        `;
    } else {
        regionInfoElement.innerHTML = `
            <h4>אזור הצפון</h4>
            <p>אזור הצפון כולל ערים כמו חיפה, קרית שמונה ונצרת. התרומות שלנו תומכות במתקנים רפואיים, סיוע במזון ושיקום קהילתי.</p>
            <div class="region-info-stats">
                <div class="info-stat">
                    <span class="stat-value">7</span>
                    <span class="stat-label">פרויקטים</span>
                </div>
                <div class="info-stat">
                    <span class="stat-value">140+</span>
                    <span class="stat-label">מוטבים</span>
                </div>
                <div class="info-stat">
                    <span class="stat-value">2.8 ETH</span>
                    <span class="stat-label">גויסו</span>
                </div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="showSection('donate')">
                <i class="fas fa-heart"></i> תרום לאזור הצפון
            </button>
        `;
    }
}

// עדכון המפה בזמן שינוי גודל החלון
window.addEventListener('resize', function() {
    if (mapInstance) {
        mapInstance.invalidateSize();
    }
});


// Update projects list
function updateProjectsList(markers) {
    const projectsList = document.getElementById('mapProjectsList');
    
    if (!projectsList) return;
    
    if (markers.length === 0) {
        projectsList.innerHTML = `
            <div class="empty-projects">
                <p data-translate="no-matching-projects">No matching projects found. Try changing your filters.</p>
            </div>
        `;
        return;
    }
    
    let projectsHtml = '';
    
    markers.forEach(marker => {
        const project = marker.options.projectData || {};
        if (!project.title) return; // Skip markers without proper data
        
        const progressPercent = Math.min(100, Math.round((project.current_amount || 0) / (project.goal_amount || 1) * 100));
        const regionClass = project.region || 'south';
        const regionText = project.region === 'south' ? 'Southern Israel' : 'Northern Israel';
        
        // Default background or use project image if available
        let backgroundStyle = `background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/static/images/${regionClass}-project.jpg');`;
        if (project.project_image) {
            backgroundStyle = `background-image: url('${project.project_image}');`;
        }
        
        projectsHtml += `
            <div class="map-project-card" data-project-id="${project._id || project.id}" onclick="highlightProjectOnMap('${project._id || project.id}')">
                <div class="map-project-image" style="${backgroundStyle}">
                    <div class="map-project-badge ${regionClass}">${regionText}</div>
                </div>
                <div class="map-project-content">
                    <h4 class="map-project-title">${project.title}</h4>
                    <p class="map-project-description">${project.description || 'No description available'}</p>
                    <div class="map-project-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                        <div class="progress-stats">
                            <span>${project.current_amount || 0} / ${project.goal_amount || 0} ETH</span>
                            <span>${progressPercent}%</span>
                        </div>
                    </div>
                    <div class="map-project-footer">
                        <div class="map-project-location">
                            <i class="fas fa-map-marker-alt"></i> ${project.location_name || 'Unknown Location'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    projectsList.innerHTML = projectsHtml;
}

// Highlight project on map
function highlightProjectOnMap(projectId) {
    if (!mapInstance) return;
    
    // Find the marker for this project
    const projectMarker = projectMarkers.find(marker => {
        const data = marker.options.projectData || {};
        return (data._id === projectId || data.id === projectId);
    });
    
    if (projectMarker) {
        // Center map on this marker and zoom in
        mapInstance.setView(projectMarker.getLatLng(), 13);
        
        // Open popup
        projectMarker.openPopup();
        
        // Show project details in sidebar
        showProjectInSidebar(projectMarker.options.projectData);
    }
}

// Show project in sidebar
function showProjectInSidebar(project) {
    if (!project) return;
    
    const sidebarContainer = document.getElementById('selectedProjectInfo');
    const detailsContainer = document.getElementById('selectedProjectDetails');
    
    if (!sidebarContainer || !detailsContainer) return;
    
    // Make container visible
    sidebarContainer.style.display = 'block';
    
    const progressPercent = Math.min(100, Math.round((project.current_amount || 0) / (project.goal_amount || 1) * 100));
    const regionText = project.region === 'south' ? 'Southern Israel' : 'Northern Israel';
    
    detailsContainer.innerHTML = `
        <div class="selected-project-header">
            <h5>${project.title}</h5>
            <span class="project-region">${regionText}</span>
        </div>
        
        <div class="project-quick-stats">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <div class="progress-stats">
                <span>${project.current_amount || 0} / ${project.goal_amount || 0} ETH</span>
                <span>${progressPercent}%</span>
            </div>
        </div>
        
        <div class="project-location-info">
            <i class="fas fa-map-marker-alt"></i> ${project.location_name || 'Unknown Location'}
        </div>
    `;
    
    // Store selected project ID for donation page
    localStorage.setItem('selectedProjectFromMap', project._id || project.id);
}


// Modify the loadProjectsToMap function to update projects list
const originalLoadProjectsToMap = loadProjectsToMap;
loadProjectsToMap = async function() {
    await originalLoadProjectsToMap();
    
    // Update projects list with all markers
    updateProjectsList(projectMarkers);
};


// הוסף את הלוגים האלה בפונקציית refreshMap (בערך שורה 190) ב-app/static/js/map.js:
function refreshMap() {
    if (mapInstance) {
        console.log("מרענן את המפה...");
        mapInstance.invalidateSize();
        
        // ניקוי סמנים קיימים
        console.log(`מנקה ${projectMarkers.length} סמנים קודמים...`);
        projectMarkers.forEach(marker => {
            mapInstance.removeLayer(marker);
        });
        projectMarkers.length = 0;
        
        // טעינה מחדש של פרויקטים
        console.log("מתחיל טעינה מחדש של פרויקטים למפה...");
        loadProjectsToMap();
        
        console.log("מפה רועננה");
    } else {
        console.warn("לא ניתן לרענן את המפה - המפה לא אותחלה");
    }
}





// תקן את הפונקציה loadProjectsToMap (בערך שורה 216) ב-app/static/js/map.js:
async function loadProjectsToMap() {
    console.log("טוען פרויקטים למפה...");
    if (!mapInstance) {
        console.error("המפה לא אותחלה עדיין!");
        return;
    }
    
    try {
        const response = await fetch('/projects/approved');
        
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.projects && Array.isArray(data.projects)) {
            console.log("דוגמא של פרויקט ראשון:", data.projects[0]);
            
            // סופרים פרויקטים עם מיקום
            const projectsWithLocation = data.projects.filter(project => {
                // המרה לערכים מספריים
                const lat = typeof project.location_lat === 'number' ? project.location_lat : parseFloat(project.location_lat);
                const lng = typeof project.location_lng === 'number' ? project.location_lng : parseFloat(project.location_lng);
                
                // בדיקה מפורטת יותר
                const hasValidLocation = !isNaN(lat) && !isNaN(lng) && 
                                       lat !== 0 && lng !== 0 &&
                                       lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
                
                console.log(`פרויקט ${project.title}: מיקום [${lat}, ${lng}], תקין: ${hasValidLocation}`);
                
                return hasValidLocation;
            });
            
            console.log(`נמצאו ${projectsWithLocation.length} פרויקטים עם מיקום מתוך ${data.projects.length} פרויקטים מאושרים`);
            console.log("פרויקטים עם מיקום:", projectsWithLocation);
            
            // מוסיפים סמנים למפה עבור כל פרויקט עם מיקום
            projectsWithLocation.forEach(project => {
                addProjectMarker(project);
            });
            
            // אם יש סמנים, התמקד במרכז שלהם
            // if (projectMarkers.length > 0) {
            //     const projectBounds = L.featureGroup(projectMarkers).getBounds();
            //     mapInstance.fitBounds(projectBounds, { padding: [50, 50] });
            // }
        }
    } catch (error) {
        console.error("שגיאה בטעינת פרויקטים למפה:", error);
    }
}
// מערך לשמירת כל הסמנים של פרויקטים במפה
const projectMarkers = [];

// פונקציה להוספת סמן פרויקט למפה
// תקן את הפונקציה addProjectMarker (בערך שורה 299) ב-app/static/js/map.js:
function addProjectMarker(project) {
    if (!mapInstance) return;
    
    // ודא שיש ערכי מיקום תקינים
    const lat = typeof project.location_lat === 'number' ? project.location_lat : parseFloat(project.location_lat);
    const lng = typeof project.location_lng === 'number' ? project.location_lng : parseFloat(project.location_lng);
    console.log(`מנסה להוסיף סמן בנקודה [${lat}, ${lng}] לפרויקט ${project.title}`);

    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
        console.warn(`סמן לא תקין עבור פרויקט ${project.title}: [${lat}, ${lng}]`);
        return;
    }
    try {
        // יצירת סמן מותאם לפי האזור
        const markerIcon = L.divIcon({
            className: `project-marker ${project.region || 'south'}`, // ברירת מחדל: דרום
            html: `<i class="fas fa-map-marker-alt"></i>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });
        // יצירת הסמן והוספתו למפה
        console.log(`יוצר סמן במיקום [${lat}, ${lng}]`);
        const marker = L.marker(
            [lat, lng],
            { icon: markerIcon }
        ).addTo(mapInstance);

        projectMarkers.push(marker);
        console.log(`הוספת סמן למפה בהצלחה`);

    
        // חישוב אחוז ההתקדמות
        const progress = project.goal_amount ? 
            Math.min(100, Math.round((project.current_amount || 0) / project.goal_amount * 100)) : 0;
        
        // הוספת חלון קופץ לסמן
        marker.bindPopup(`
            <div class="project-popup">
                <h4>${project.title || 'פרויקט ללא שם'}</h4>
                <p class="project-location">${project.location_name || 'מיקום לא צוין'}</p>
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">
                        ${project.current_amount || 0} / ${project.goal_amount || 0} ETH (${progress}%)
                    </div>
                </div>
                <p class="project-description">${project.description ? (project.description.substring(0, 100) + (project.description.length > 100 ? '...' : '')) : 'אין תיאור'}</p>
            </div>
        `);
        
        // שמירת הסמן במערך
        projectMarkers.push(marker);
        console.log(`סמן נוסף בהצלחה למפה עבור פרויקט ${project.title}`);
    } catch (error) {
        console.error(`שגיאה ביצירת סמן לפרויקט ${project.title}:`, error);
    }
}

function viewProjectDetails(projectId) {
    console.log(`צפייה בפרויקט ${projectId} מהמפה`);
    
    // סגירת החלון הקופץ
    if (mapInstance) {
        mapInstance.closePopup();
    }
    
    // שמירת מזהה הפרויקט בלוקל סטורג' כדי שנוכל לגשת אליו מעמוד התרומה
    localStorage.setItem('selectedProjectFromMap', projectId);
    
    // מעבר לעמוד התרומה
    console.log("מעבר לעמוד התרומה...");
    showSection('donate');
    
    // מחכים שהעמוד יטען ואז מפעילים את הדגשת הפרויקט
    setTimeout(() => {
        try {
            highlightProjectInCarousel(projectId);
        } catch (error) {
            console.error("שגיאה בהדגשת הפרויקט:", error);
        }
    }, 800);
}

// פונקציה להדגשת הפרויקט בקרוסלה
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

// הוספת הפונקציות למרחב הגלובלי
window.viewProjectDetails = viewProjectDetails;
window.highlightProjectInCarousel = highlightProjectInCarousel;