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
        showNotification('success', 'Location set: ' + locationName);
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
                                showNotification('success', 'Location set: ' + name);
                            } else {
                                showNotification('error', 'Address not found. Try searching with more details.');
                            }
                        })
                        .catch(error => {
                            showNotification('error', 'Error searching for address. Please try again.');
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
                            showNotification('success', 'Location set: ' + name);
                        } else {
                            showNotification('error', 'Address not found. Try searching with more details.');
                        }
                    })
                    .catch(error => {
                        showNotification('error', 'Error searching for address. Please try again.');
                    });
            }
        });
    }
    
    
    // Modified listener for "Get Current Location" button
    if (getCurrentLocationBtn) {
        getCurrentLocationBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                getCurrentLocationBtn.disabled = true;
                getCurrentLocationBtn.innerHTML = '<div class="loader-inline"></div> Finding your location...';
                
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        
                        // Show confirmation dialog with improved phrasing
                        if (confirm("Note: Are you physically at the project location now?\n\nClick 'OK' only if you are currently at the location where the project will take place.\nClick 'Cancel' if you are elsewhere and want to enter the correct project location another way.")) {
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
                            showNotification('success', 'Project location set to your current location');
                        } else {
                            // User is not at project location
                            showNotification('info', 'Please enter the project location using address search, map selection, or choosing a city from the list');
                            
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
                            .bindPopup('Your current location (not selected as project location)').openPopup();
                            
                            // Remove temp marker after 5 seconds
                            setTimeout(() => {
                                locationMap.removeLayer(tempMarker);
                            }, 5000);
                        }
                        
                        // Restore button state
                        getCurrentLocationBtn.disabled = false;
                        getCurrentLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> <span data-translate="get-current-location">Current Location</span>';
                    },
                    function(error) {
                        console.error('Error locating position:', error);
                        
                        // Restore button state
                        getCurrentLocationBtn.disabled = false;
                        getCurrentLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> <span data-translate="get-current-location">Current Location</span>';
                        
                        // Error notification
                        showNotification('error', 'Unable to locate your position: ' + getGeolocationErrorMessage(error));
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
    }
    
//     // Function to update the map marker
    function updateLocationMap(lat, lng) {
        console.log(`Updating location on map: [${lat}, ${lng}]`);
        
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
            return "You denied the location permission request";
        case error.POSITION_UNAVAILABLE:
            return "Location information is unavailable";
        case error.TIMEOUT:
            return "The location request timed out";
        case error.UNKNOWN_ERROR:
            return "An unknown error occurred";
        default:
            return "Error determining location";
    }
}