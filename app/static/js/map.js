// Simplified map.js file
let mapInstance = null;

document.addEventListener('DOMContentLoaded', function() {
    // Listener for map navigation clicks
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('[onclick*="showSection(\'map\'"]') || 
            e.target.closest('[onclick*="showSection(\'map\'"]')) {
            setTimeout(function() {
                initMap();
                // Calls the size function twice, with time interval
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
    
    // Check if we're on the map page directly
    if (window.location.hash === '#map' || document.getElementById('map').classList.contains('active')) {
        setTimeout(initMap, 100);
    }
});

function initMap() {
    const mapContainer = document.getElementById('leafletMap');
    if (!mapContainer) {
        return;
    }
    
    // If the map is already initialized, just refresh its size
    if (mapInstance) {
        mapInstance.invalidateSize();
        return;
    }
    
    try {
        // Simple attempt for a basic map with one tile
        mapInstance = L.map('leafletMap', {
            center: [31.4117, 35.0818], // Center of Israel
            zoom: 8, // Zoom level that shows most of the country
            zoomControl: true
        });
        
        // Refresh map size
        setTimeout(function() {
            mapInstance.invalidateSize();
        }, 100);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);

        
    } catch (error) {
        console.error("Error initializing the map:", error);
    }
}


// Update map when window size changes
window.addEventListener('resize', function() {
    if (mapInstance) {
        mapInstance.invalidateSize();
    }
});

// Add these logs in refreshMap function (around line 190) in app/static/js/map.js:
function refreshMap() {
    if (mapInstance) {
        mapInstance.invalidateSize();
        
        // Clear existing markers
        projectMarkers.forEach(marker => {
            mapInstance.removeLayer(marker);
        });
        projectMarkers.length = 0;
        
        // Reload projects
        loadProjectsToMap();
        
    } else {
        console.warn("Cannot refresh the map - the map is not initialized");
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
            // Count projects with location
            const projectsWithLocation = data.projects.filter(project => {
                // Convert to numeric values
                const lat = typeof project.location_lat === 'number' ? project.location_lat : parseFloat(project.location_lat);
                const lng = typeof project.location_lng === 'number' ? project.location_lng : parseFloat(project.location_lng);
                
                // More detailed check
                const hasValidLocation = !isNaN(lat) && !isNaN(lng) && 
                                       lat !== 0 && lng !== 0 &&
                                       lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;                
                return hasValidLocation;
            });

            
            // Add markers to the map for each project with location
            projectsWithLocation.forEach(project => {
                addProjectMarker(project);
            });
            
        }
    } catch (error) {
        console.error("Error loading projects to map:", error);
    }
}
// Array to store all project markers on the map
const projectMarkers = [];

// Function to add project marker to the map

function addProjectMarker(project) {
    if (!mapInstance) return;
    
    // Ensure there are valid location values
    const lat = typeof project.location_lat === 'number' ? project.location_lat : parseFloat(project.location_lat);
    const lng = typeof project.location_lng === 'number' ? project.location_lng : parseFloat(project.location_lng);

    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
        return;
    }
    try {
        // Create custom marker according to the region
        const markerIcon = L.divIcon({
            className: `project-marker ${project.region || 'south'}`, // Default: south
            html: `<i class="fas fa-map-marker-alt"></i>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });
        // Create marker and add it to the map
        const marker = L.marker(
            [lat, lng],
            { icon: markerIcon }
        ).addTo(mapInstance);

        projectMarkers.push(marker);

        // Calculate progress percentage
        const progress = project.goal_amount ? 
            Math.min(100, Math.round((project.current_amount || 0) / project.goal_amount * 100)) : 0;
        
        // Add popup to marker
        marker.bindPopup(`
            <div class="project-popup">
                <h4>${project.title || 'Unnamed Project'}</h4>
                <p class="project-location">${project.location_name || 'Location not specified'}</p>
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">
                        ${project.current_amount || 0} / ${project.goal_amount || 0} ETH (${progress}%)
                    </div>
                </div>
                <p class="project-description">${project.description ? (project.description.substring(0, 100) + (project.description.length > 100 ? '...' : '')) : 'No description'}</p>
            </div>
        `);
        
        // Save the marker in the array
        projectMarkers.push(marker);
    } catch (error) {
        console.error(`Error creating marker for project ${project.title}:`, error);
    }
}