// קובץ project-location.js
// פונקציונליות מיקום בטופס הגשת פרויקט

document.addEventListener('DOMContentLoaded', function() {
    initLocationFeatures();
    
    // מאזין לשינוי סקשיינים
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail && e.detail.sectionId === 'submit-project') {
            initLocationFeatures();
        }
    });
});

function initLocationFeatures() {
    const getCurrentLocationBtn = document.getElementById('getCurrentLocation');
    const locationLatInput = document.getElementById('projectLocationLat');
    const locationLngInput = document.getElementById('projectLocationLng');
    const locationMapElement = document.getElementById('locationPreviewMap');
    
    if (!getCurrentLocationBtn || !locationLatInput || !locationLngInput || !locationMapElement) {
        return;
    }
    
    // אתחול המפה
    const locationMap = L.map(locationMapElement).setView([31.5, 34.75], 7);
    
    // הוספת שכבת אריחים למפה
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(locationMap);
    
    let locationMarker = null;
    
    // מאזין ללחצן 'קבל מיקום נוכחי'
    getCurrentLocationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            getCurrentLocationBtn.disabled = true;
            getCurrentLocationBtn.innerHTML = '<div class="loader-inline"></div> מאתר מיקום...';
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // עדכון שדות הקלט
                    locationLatInput.value = lat;
                    locationLngInput.value = lng;
                    
                    // עדכון המפה
                    updateLocationMap(lat, lng);
                    
                    // שחזור מצב הכפתור
                    getCurrentLocationBtn.disabled = false;
                    getCurrentLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> <span data-translate="get-current-location">קבל מיקום נוכחי</span>';
                    
                    // הודעת הצלחה
                    showNotification('success', 'המיקום הנוכחי שלך נקלט בהצלחה!');
                },
                function(error) {
                    console.error('שגיאה באיתור מיקום:', error);
                    
                    // שחזור מצב הכפתור
                    getCurrentLocationBtn.disabled = false;
                    getCurrentLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> <span data-translate="get-current-location">קבל מיקום נוכחי</span>';
                    
                    // הודעת שגיאה
                    showNotification('error', 'לא ניתן לאתר את מיקומך: ' + getGeolocationErrorMessage(error));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            showNotification('error', 'הדפדפן שלך אינו תומך באיתור מיקום');
        }
    });
    
    // מאזינים לשינויים בשדות הקלט
    locationLatInput.addEventListener('input', updateMapFromInputs);
    locationLngInput.addEventListener('input', updateMapFromInputs);
    
    // פונקציה לעדכון המפה משדות הקלט
    function updateMapFromInputs() {
        const lat = parseFloat(locationLatInput.value);
        const lng = parseFloat(locationLngInput.value);
        
        if (!isNaN(lat) && !isNaN(lng)) {
            updateLocationMap(lat, lng);
        }
    }
    
    // פונקציה לעדכון המפה
    function updateLocationMap(lat, lng) {
        // אם כבר יש סמן, הסר אותו
        if (locationMarker) {
            locationMap.removeLayer(locationMarker);
        }
        
        // הוסף סמן חדש
        locationMarker = L.marker([lat, lng]).addTo(locationMap);
        
        // עדכן את המרכז של המפה
        locationMap.setView([lat, lng], 12);
    }
    
    // אם כבר יש ערכים בשדות, עדכן את המפה
    const initialLat = parseFloat(locationLatInput.value);
    const initialLng = parseFloat(locationLngInput.value);
    
    if (!isNaN(initialLat) && !isNaN(initialLng) && initialLat !== 0 && initialLng !== 0) {
        updateLocationMap(initialLat, initialLng);
    } else {
        // ברירת מחדל - מרכז ישראל
        updateLocationMap(31.5, 34.75);
        locationMap.setZoom(7);
    }
    
    // תיקון גודל המפה לאחר הרנדור
    setTimeout(function() {
        locationMap.invalidateSize();
    }, 500);
}

// פונקציה לקבלת הודעת שגיאה מובנת עבור שגיאות איתור מיקום
function getGeolocationErrorMessage(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            return "המשתמש דחה את בקשת המיקום";
        case error.POSITION_UNAVAILABLE:
            return "מידע המיקום אינו זמין";
        case error.TIMEOUT:
            return "פג הזמן לבקשת המיקום";
        case error.UNKNOWN_ERROR:
            return "אירעה שגיאה לא ידועה";
        default:
            return "אירעה שגיאה באיתור המיקום";
    }
}