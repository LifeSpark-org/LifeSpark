// Simplified project-location.js implementation
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
    
    if (!getCurrentLocationBtn || !locationLatInput || !locationLngInput || !locationMapElement) {
        return;
    }
    
    // Initialize the map
    const locationMap = L.map(locationMapElement).setView([31.5, 34.75], 7);
    
    // Add tile layer to map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(locationMap);
    
    let locationMarker = null;
    
    // Add some predefined locations for major cities in the affected regions
    const predefinedLocations = {
        'Sderot': [31.525, 34.596],
        'Ashkelon': [31.669, 34.571],
        'Beer Sheva': [31.252, 34.791],
        'Kiryat Shmona': [33.208, 35.570],
        'Haifa': [32.794, 34.989],
        'Metula': [33.280, 35.580]
    };
    
    // Create location buttons
    const locationButtonsContainer = document.getElementById('predefinedLocationsContainer');
    if (locationButtonsContainer) {
        Object.keys(predefinedLocations).forEach(city => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-sm btn-outline location-preset-btn';
            btn.textContent = city;
            btn.addEventListener('click', function() {
                const [lat, lng] = predefinedLocations[city];
                locationLatInput.value = lat;
                locationLngInput.value = lng;
                updateLocationMap(lat, lng);
                showNotification('success', `Set location to ${city}`);
            });
            locationButtonsContainer.appendChild(btn);
        });
    }
    
    // Modified listener for "Get Current Location" button
    getCurrentLocationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            getCurrentLocationBtn.disabled = true;
            getCurrentLocationBtn.innerHTML = '<div class="loader-inline"></div> Finding your location...';
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // Show confirmation dialog
                    if (confirm("IMPORTANT: Are you physically at the project location right now?\n\nClick 'OK' only if your current location is the same as the project location.\nClick 'Cancel' if you need to select a different location for the project.")) {
                        // User confirmed they are at project location - set coordinates
                        locationLatInput.value = lat;
                        locationLngInput.value = lng;
                        
                        // Update map
                        updateLocationMap(lat, lng);
                        
                        // Success notification
                        showNotification('success', 'Project location set to your current location');
                    } else {
                        // User is not at project location
                        showNotification('info', 'Please click directly on the map to select the project location, or use one of the preset locations');
                        
                        // Just show their location on map without setting form values
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
                        }).addTo(locationMap);
                        
                        // Remove temp marker after 5 seconds
                        setTimeout(() => {
                            locationMap.removeLayer(tempMarker);
                        }, 5000);
                    }
                    
                    // Restore button state
                    getCurrentLocationBtn.disabled = false;
                    getCurrentLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> <span data-translate="get-current-location">Get Current Location</span>';
                },
                function(error) {
                    console.error('Error locating position:', error);
                    
                    // Restore button state
                    getCurrentLocationBtn.disabled = false;
                    getCurrentLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> <span data-translate="get-current-location">Get Current Location</span>';
                    
                    // Error notification
                    showNotification('error', 'Could not determine your location: ' + getGeolocationErrorMessage(error));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            showNotification('error', 'Your browser does not support geolocation');
        }
    });
    
    // Add click event to map for manual location selection
    locationMap.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        // Update form inputs
        locationLatInput.value = lat.toFixed(6);
        locationLngInput.value = lng.toFixed(6);
        
        // Update map marker
        updateLocationMap(lat, lng);
        
        // Show success notification
        showNotification('success', 'Project location selected from map');
    });
    
    // Listeners for input field changes
    locationLatInput.addEventListener('input', updateMapFromInputs);
    locationLngInput.addEventListener('input', updateMapFromInputs);
    
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
        console.log(`Updating location map: [${lat}, ${lng}]`);
        const locationLat = document.getElementById('projectLocationLat').value;
        const locationLng = document.getElementById('projectLocationLng').value;
        console.log(`Form location: [${locationLat}, ${locationLng}]`);
        
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
        
        // Update map center
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
    
    // Fix map size after rendering
    setTimeout(function() {
        locationMap.invalidateSize();
    }, 500);
}

// Function for geolocation error messages
function getGeolocationErrorMessage(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            return "You denied the location permission";
        case error.POSITION_UNAVAILABLE:
            return "Location information is unavailable";
        case error.TIMEOUT:
            return "Location request timed out";
        case error.UNKNOWN_ERROR:
            return "An unknown error occurred";
        default:
            return "Error determining location";
    }
}