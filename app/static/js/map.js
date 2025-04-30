// קובץ map.js מפושט ביותר
let mapInstance = null;

document.addEventListener('DOMContentLoaded', function() {
    // מאזין ללחיצות על הניווט של המפה
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('[onclick*="showSection(\'map\'"]') || 
            e.target.closest('[onclick*="showSection(\'map\'"]')) {
            setTimeout(function() {
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
            center: [31.0461, 34.8516],
            zoom: 7,
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
        
        // הוספת סמנים בסיסיים
        L.marker([31.255, 34.278]).addTo(mapInstance).bindPopup("באר שבע");
        L.marker([32.794, 35.047]).addTo(mapInstance).bindPopup("חיפה");
        L.marker([31.423, 34.591]).addTo(mapInstance).bindPopup("שדרות");
        L.marker([33.223, 35.571]).addTo(mapInstance).bindPopup("קרית שמונה");
        
        // אזור דרום
        L.polygon([
            [31.255, 34.278],
            [31.680, 34.560],
            [31.423, 34.591],
            [30.608, 34.803],
            [29.557, 34.952],
            [31.255, 34.278]
        ], {
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.2
        }).addTo(mapInstance);
        
        // אזור צפון
        L.polygon([
            [32.794, 35.047],
            [32.921, 35.308],
            [33.223, 35.571],
            [32.701, 35.371],
            [32.794, 35.047]
        ], {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.2
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

// פונקציה שמאפשרת לרענן את המפה מבחוץ
function refreshMap() {
    if (mapInstance) {
        mapInstance.invalidateSize();
        
        // ניקוי סמנים קיימים
        projectMarkers.forEach(marker => {
            mapInstance.removeLayer(marker);
        });
        projectMarkers.length = 0;
        
        // טעינה מחדש של פרויקטים
        loadProjectsToMap();
        
        console.log("מפה רועננה עם פרויקטים");
    }
}






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
            // סופרים פרויקטים עם מיקום
            const projectsWithLocation = data.projects.filter(
                p => p.location_lat && p.location_lng && 
                p.location_lat !== 0 && p.location_lng !== 0
            );
            
            console.log(`נמצאו ${projectsWithLocation.length} פרויקטים עם מיקום מתוך ${data.projects.length} פרויקטים מאושרים`);
            
            // מוסיפים סמנים למפה עבור כל פרויקט עם מיקום
            projectsWithLocation.forEach(project => {
                addProjectMarker(project);
            });
            
            // אם יש סמנים, התמקד במרכז שלהם
            if (projectsWithLocation.length > 0) {
                const projectBounds = L.featureGroup(projectMarkers).getBounds();
                mapInstance.fitBounds(projectBounds, { padding: [50, 50] });
            }
        }
    } catch (error) {
        console.error("שגיאה בטעינת פרויקטים למפה:", error);
    }
}

// מערך לשמירת כל הסמנים של פרויקטים במפה
const projectMarkers = [];

// פונקציה להוספת סמן פרויקט למפה
function addProjectMarker(project) {
    if (!mapInstance || !project.location_lat || !project.location_lng) {
        return;
    }
    
    // יצירת סמן מותאם לפי האזור
    const markerIcon = L.divIcon({
        className: `project-marker ${project.region}`,
        html: `<i class="fas fa-map-marker-alt"></i>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });
    
    // יצירת הסמן והוספתו למפה
    const marker = L.marker(
        [project.location_lat, project.location_lng],
        { icon: markerIcon }
    ).addTo(mapInstance);
    
    // חישוב אחוז ההתקדמות
    const progress = project.goal_amount ? 
        Math.min(100, Math.round((project.current_amount || 0) / project.goal_amount * 100)) : 0;
    
    // הוספת חלון קופץ לסמן
    marker.bindPopup(`
        <div class="project-popup">
            <h4>${project.title}</h4>
            <p class="project-location">${project.location_name}</p>
            <div class="project-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="progress-text">
                    ${project.current_amount || 0} / ${project.goal_amount} ETH (${progress}%)
                </div>
            </div>
            <p class="project-description">${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}</p>
            <button class="btn btn-sm btn-primary view-project-btn" 
                    onclick="viewProjectDetails('${project._id}')">
                <i class="fas fa-eye"></i> צפייה בפרויקט
            </button>
        </div>
    `);
    
    // שמירת הסמן במערך
    projectMarkers.push(marker);
}

// פונקציה לצפייה בפרטי פרויקט (פותחת את מודל הפרויקט)
function viewProjectDetails(projectId) {
    // כדי להימנע מבעיות עם מסגרת האייפריים, נסגור את החלון הקופץ
    mapInstance.closePopup();
    
    // נעבור לעמוד התרומה ונפתח את מודל הפרטים של הפרויקט
    showSection('donate');
    
    // מחכים שהדף יטען ואז פותחים את המודל
    setTimeout(() => {
        // אם קיימת פונקציה לפתיחת מודל פרטי פרויקט, נשתמש בה
        if (typeof showProjectDetails === 'function') {
            // מחפשים את הפרויקט בקרוסלה
            const projectSlide = document.querySelector(`.project-slide[data-project-id="${projectId}"]`);
            if (projectSlide) {
                const selectBtn = projectSlide.querySelector('.project-select-btn');
                if (selectBtn) {
                    selectBtn.click();
                }
            } else {
                console.error("הפרויקט לא נמצא בקרוסלה");
            }
        }
    }, 500);
}
