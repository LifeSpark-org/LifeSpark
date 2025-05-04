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
    
    // מאזינים לשינויים בשדות הקלט עם השהייה
    locationLatInput.addEventListener('input', debounceUpdateMap);
    locationLngInput.addEventListener('input', debounceUpdateMap);

    // פונקציית השהייה כדי למנוע עדכונים תכופים מדי
    let debounceTimeout;
    function debounceUpdateMap() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(updateMapFromInputs, 500);
    }
    
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
                    
                    // עדכון המפה ישירות
                    updateLocationMap(lat, lng);
                    
                    // הפעלת אירוע change כדי לוודא שטפסים יתייחסו לשינוי
                    const event = new Event('change');
                    locationLatInput.dispatchEvent(event);
                    locationLngInput.dispatchEvent(event);
                    
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
        console.log(`עדכון מפת המיקום: [${lat}, ${lng}]`);
        if (locationMarker) {
            locationMap.removeLayer(locationMarker);
        }
        
        // הוסף סמן חדש
        locationMarker = L.marker([lat, lng]).addTo(locationMap);
        
        // עדכן את המרכז של המפה
        locationMap.setView([lat, lng], 12);
    }
    
    // הוספת אפשרות לחיצה על המפה
    locationMap.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        // עדכון שדות הקלט
        locationLatInput.value = lat.toFixed(6);
        locationLngInput.value = lng.toFixed(6);
        
        // עדכון המפה
        updateLocationMap(lat, lng);
        
        // הפעלת אירוע change כדי לוודא שטפסים יתייחסו לשינוי
        const event = new Event('change');
        locationLatInput.dispatchEvent(event);
        locationLngInput.dispatchEvent(event);
    });
    
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