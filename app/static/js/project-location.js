// Improved project-location.js with address search
document.addEventListener('DOMContentLoaded', function() {
    initLocationFeatures();
    
    // Listen for section changes
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
    const locationNameInput = document.getElementById('projectLocationName');
    const addressSearchInput = document.getElementById('addressSearch');
    
    if (!locationMapElement) {
        return;
    }
    
    // Initialize the map
    const locationMap = L.map(locationMapElement).setView([31.5, 34.75], 7);
    
    // Add tile layer to map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(locationMap);
    
    let locationMarker = null;
    
    // Add Geocoding control for address search
    const geocoder = L.Control.geocoder({
        defaultMarkGeocode: false
    }).on('markgeocode', function(e) {
        const latlng = e.geocode.center;
        const locationName = e.geocode.name;
        
        // Update form values
        locationLatInput.value = latlng.lat.toFixed(6);
        locationLngInput.value = latlng.lng.toFixed(6);
        locationNameInput.value = locationName;
        
        // Update map
        updateLocationMap(latlng.lat, latlng.lng);
        
        // Show success notification
        showNotification('success', 'מיקום נקבע: ' + locationName);
    }).addTo(locationMap);
    
    // Add custom search field
    if (addressSearchInput) {
        addressSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                
                const address = this.value.trim();
                if (address) {
                    // Use Nominatim API to geocode the address
                    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`)
                        .then(response => response.json())
                        .then(data => {
                            if (data && data.length > 0) {
                                const lat = parseFloat(data[0].lat);
                                const lng = parseFloat(data[0].lon);
                                const name = data[0].display_name;
                                
                                // Update form values
                                locationLatInput.value = lat.toFixed(6);
                                locationLngInput.value = lng.toFixed(6);
                                locationNameInput.value = name.split(',')[0]; // Take first part of address (city)
                                
                                // Update map
                                updateLocationMap(lat, lng);
                                
                                // Show success notification
                                showNotification('success', 'מיקום נקבע: ' + name);
                            } else {
                                showNotification('error', 'לא נמצאה כתובת. נסה לחפש בצורה מפורטת יותר.');
                            }
                        })
                        .catch(error => {
                            console.error('Error geocoding address:', error);
                            showNotification('error', 'שגיאה בחיפוש הכתובת. נסה שוב.');
                        });
                }
            }
        });
    }
    
    // Add search button
    const searchButton = document.getElementById('searchAddressBtn');
    if (searchButton && addressSearchInput) {
        searchButton.addEventListener('click', function() {
            const address = addressSearchInput.value.trim();
            if (address) {
                // Use Nominatim API to geocode the address
                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.length > 0) {
                            const lat = parseFloat(data[0].lat);
                            const lng = parseFloat(data[0].lon);
                            const name = data[0].display_name;
                            
                            // Update form values
                            locationLatInput.value = lat.toFixed(6);
                            locationLngInput.value = lng.toFixed(6);
                            locationNameInput.value = name.split(',')[0]; // Take first part of address (city)
                            
                            // Update map
                            updateLocationMap(lat, lng);
                            
                            // Show success notification
                            showNotification('success', 'מיקום נקבע: ' + name);
                        } else {
                            showNotification('error', 'לא נמצאה כתובת. נסה לחפש בצורה מפורטת יותר.');
                        }
                    })
                    .catch(error => {
                        console.error('Error geocoding address:', error);
                        showNotification('error', 'שגיאה בחיפוש הכתובת. נסה שוב.');
                    });
            }
        });
    }
    
    
    // Modified listener for "Get Current Location" button
    if (getCurrentLocationBtn) {
        getCurrentLocationBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                getCurrentLocationBtn.disabled = true;
                getCurrentLocationBtn.innerHTML = '<div class="loader-inline"></div> מאתר את המיקום שלך...';
                
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        
                        // Show confirmation dialog with improved phrasing
                        if (confirm("שים לב: האם אתה פיזית נמצא במיקום הפרויקט עכשיו?\n\nלחץ 'אישור' רק אם אתה נמצא כרגע במיקום שבו הפרויקט יתבצע.\nלחץ 'ביטול' אם אתה נמצא במקום אחר ותרצה להזין את המיקום הנכון של הפרויקט בדרך אחרת.")) {
                            // User confirmed they are at project location - set coordinates
                            locationLatInput.value = lat;
                            locationLngInput.value = lng;
                            
                            // Get location name using reverse geocoding
                            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
                                .then(response => response.json())
                                .then(data => {
                                    if (data && data.display_name) {
                                        locationNameInput.value = data.address.city || data.address.town || data.address.village || data.address.hamlet || data.display_name.split(',')[0];
                                    }
                                })
                                .catch(err => {
                                    console.error("Error in reverse geocoding:", err);
                                });
                            
                            // Update map
                            updateLocationMap(lat, lng);
                            
                            // Success notification
                            showNotification('success', 'מיקום הפרויקט נקבע למיקומך הנוכחי');
                        } else {
                            // User is not at project location
                            showNotification('info', 'אנא הזן את מיקום הפרויקט באמצעות חיפוש כתובת, בחירה במפה, או בחירה בעיר מהרשימה');
                            
                            // Just center map on their location without setting form values
                            if (locationMarker) {
                                locationMap.removeLayer(locationMarker);
                            }
                            
                            // Center map on their location but with a temporary marker
                            locationMap.setView([lat, lng], 10);
                            
                            // Add a temporary marker that shows their current position
                            const tempMarker = L.marker([lat, lng], {
                                icon: L.divIcon({
                                    html: '<i class="fas fa-map-pin" style="color: gray;"></i>',
                                    className: 'temp-location-marker',
                                    iconSize: [25, 25],
                                    iconAnchor: [12, 25]
                                })
                            }).addTo(locationMap)
                            .bindPopup('המיקום הנוכחי שלך (לא נבחר כמיקום הפרויקט)').openPopup();
                            
                            // Remove temp marker after 5 seconds
                            setTimeout(() => {
                                locationMap.removeLayer(tempMarker);
                            }, 5000);
                        }
                        
                        // Restore button state
                        getCurrentLocationBtn.disabled = false;
                        getCurrentLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> <span data-translate="get-current-location">מיקום נוכחי</span>';
                    },
                    function(error) {
                        console.error('Error locating position:', error);
                        
                        // Restore button state
                        getCurrentLocationBtn.disabled = false;
                        getCurrentLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> <span data-translate="get-current-location">מיקום נוכחי</span>';
                        
                        // Error notification
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
    }
    
    // Add click event to map for manual location selection
    locationMap.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        // Update form inputs
        locationLatInput.value = lat.toFixed(6);
        locationLngInput.value = lng.toFixed(6);
        
        // Get location name using reverse geocoding
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
            .then(response => response.json())
            .then(data => {
                if (data && data.display_name) {
                    locationNameInput.value = data.address.city || data.address.town || data.address.village || data.address.hamlet || data.display_name.split(',')[0];
                }
            })
            .catch(err => {
                console.error("Error in reverse geocoding:", err);
            });
        
        // Update map marker
        updateLocationMap(lat, lng);
        
        // Show success notification
        showNotification('success', 'מיקום הפרויקט נבחר מהמפה');
    });
    
    // Listeners for input field changes
    if (locationLatInput && locationLngInput) {
        locationLatInput.addEventListener('input', updateMapFromInputs);
        locationLngInput.addEventListener('input', updateMapFromInputs);
    }
    
    // Function to update map from input fields
    function updateMapFromInputs() {
        const lat = parseFloat(locationLatInput.value);
        const lng = parseFloat(locationLngInput.value);
        
        if (!isNaN(lat) && !isNaN(lng)) {
            updateLocationMap(lat, lng);
        }
    }
    
    // Function to update the map marker
    function updateLocationMap(lat, lng) {
        console.log(`עדכון מיקום במפה: [${lat}, ${lng}]`);
        
        // Remove existing marker if any
        if (locationMarker) {
            locationMap.removeLayer(locationMarker);
        }
        
        // Add new marker
        locationMarker = L.marker([lat, lng], {
            icon: L.divIcon({
                html: '<i class="fas fa-map-marker-alt" style="color: #2563eb; font-size: 25px;"></i>',
                className: 'project-location-marker',
                iconSize: [25, 25],
                iconAnchor: [12, 25]
            })
        }).addTo(locationMap);
        
        // Update map center and zoom
        locationMap.setView([lat, lng], 12);
    }
    
    // Initialize with existing values if present
    const initialLat = parseFloat(locationLatInput.value);
    const initialLng = parseFloat(locationLngInput.value);
    
    if (!isNaN(initialLat) && !isNaN(initialLng) && initialLat !== 0 && initialLng !== 0) {
        updateLocationMap(initialLat, initialLng);
    } else {
        // Default - center of Israel
        updateLocationMap(31.5, 34.75);
        locationMap.setZoom(7);
    }
    
    setTimeout(function() {
        locationMap.invalidateSize();
    }, 500);
}

// Function for geolocation error messages
function getGeolocationErrorMessage(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            return "דחית את בקשת הרשאת המיקום";
        case error.POSITION_UNAVAILABLE:
            return "מידע המיקום אינו זמין";
        case error.TIMEOUT:
            return "הבקשה לאיתור המיקום נכשלה בשל פסק זמן";
        case error.UNKNOWN_ERROR:
            return "אירעה שגיאה לא ידועה";
        default:
            return "שגיאה באיתור המיקום";
    }
}