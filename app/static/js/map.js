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
        return;
    }
    
    // אם המפה כבר מאותחלת, רק נרענן את הגודל שלה
    if (mapInstance) {
        mapInstance.invalidateSize();
        return;
    }
    
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

        
    } catch (error) {
        console.error("שגיאה באתחול המפה:", error);
    }
}


// עדכון המפה בזמן שינוי גודל החלון
window.addEventListener('resize', function() {
    if (mapInstance) {
        mapInstance.invalidateSize();
    }
});

// הוסף את הלוגים האלה בפונקציית refreshMap (בערך שורה 190) ב-app/static/js/map.js:
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
        
    } else {
        console.warn("לא ניתן לרענן את המפה - המפה לא אותחלה");
    }
}


async function loadProjectsToMap() {
    if (!mapInstance) {
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
            const projectsWithLocation = data.projects.filter(project => {
                // המרה לערכים מספריים
                const lat = typeof project.location_lat === 'number' ? project.location_lat : parseFloat(project.location_lat);
                const lng = typeof project.location_lng === 'number' ? project.location_lng : parseFloat(project.location_lng);
                
                // בדיקה מפורטת יותר
                const hasValidLocation = !isNaN(lat) && !isNaN(lng) && 
                                       lat !== 0 && lng !== 0 &&
                                       lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;                
                return hasValidLocation;
            });

            
            // מוסיפים סמנים למפה עבור כל פרויקט עם מיקום
            projectsWithLocation.forEach(project => {
                addProjectMarker(project);
            });
            
        }
    } catch (error) {
        console.error("שגיאה בטעינת פרויקטים למפה:", error);
    }
}
// מערך לשמירת כל הסמנים של פרויקטים במפה
const projectMarkers = [];

// פונקציה להוספת סמן פרויקט למפה

function addProjectMarker(project) {
    if (!mapInstance) return;
    
    // ודא שיש ערכי מיקום תקינים
    const lat = typeof project.location_lat === 'number' ? project.location_lat : parseFloat(project.location_lat);
    const lng = typeof project.location_lng === 'number' ? project.location_lng : parseFloat(project.location_lng);

    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
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
        const marker = L.marker(
            [lat, lng],
            { icon: markerIcon }
        ).addTo(mapInstance);

        projectMarkers.push(marker);

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
    } catch (error) {
        console.error(`שגיאה ביצירת סמן לפרויקט ${project.title}:`, error);
    }
}
