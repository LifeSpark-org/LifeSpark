// Enhanced Map Functionality
document.addEventListener('DOMContentLoaded', initializeMap);

// Map initialization function
function initializeMap() {
    const mapElement = document.getElementById("leafletMap");
    if (!mapElement) return;

    // Initialize map with Israel coordinates
    const israelCoords = [31.0461, 34.8516];
    const map = L.map("leafletMap", {
        zoomControl: false, // We'll add zoom control in a better position
        scrollWheelZoom: false // Disable scroll wheel zoom by default
    }).setView(israelCoords, 7);
    
    // Add custom zoom control to bottom right
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);
    
    // Add tile layer with subtle styling
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    // Enable scroll wheel zoom when map is clicked or touched
    map.on('focus', function() {
        map.scrollWheelZoom.enable();
    });
    
    // Disable scroll wheel zoom when mouse leaves the map
    map.on('blur', function() {
        map.scrollWheelZoom.disable();
    });

    // Southern region polygon (simplified)
    const southernRegion = L.polygon([
        [31.255, 34.278], // Beer Sheva
        [31.680, 34.560], // Ashkelon
        [31.423, 34.591], // Sderot
        [31.389, 34.329], // Ofakim
        [30.608, 34.803], // Mitzpe Ramon
        [29.557, 34.952], // Eilat
        [29.532, 34.848], // Taba Border
        [30.503, 34.751], // Yeruham
        [31.255, 34.278]  // Close the polygon
    ], {
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.2,
        weight: 2
    }).addTo(map);
    
    // Northern region polygon (simplified)
    const northernRegion = L.polygon([
        [32.794, 35.047], // Haifa
        [32.921, 35.308], // Karmiel
        [33.223, 35.571], // Kiryat Shmona
        [33.177, 35.763], // Metula
        [32.983, 35.674], // Misgav Am
        [32.701, 35.371], // Nazareth
        [32.701, 35.100], // Yokneam
        [32.794, 35.047]  // Close the polygon
    ], {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.2,
        weight: 2
    }).addTo(map);

    // Create custom markers
    function createCustomMarker(coords, icon, color, title) {
        return L.marker(coords, {
            icon: L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-icon" style="background-color: ${color}"><i class="${icon}"></i></div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            }),
            title: title
        });
    }

    // Southern region markers
    const southMarkers = [
        createCustomMarker([31.255, 34.278], 'fas fa-home', '#ef4444', 'Beer Sheva'),
        createCustomMarker([31.680, 34.560], 'fas fa-utensils', '#ef4444', 'Ashkelon'),
        createCustomMarker([31.423, 34.591], 'fas fa-medkit', '#ef4444', 'Sderot'),
        createCustomMarker([30.608, 34.803], 'fas fa-hand-holding-heart', '#ef4444', 'Mitzpe Ramon')
    ];
    
    // Northern region markers
    const northMarkers = [
        createCustomMarker([32.794, 35.047], 'fas fa-home', '#3b82f6', 'Haifa'),
        createCustomMarker([33.223, 35.571], 'fas fa-medkit', '#3b82f6', 'Kiryat Shmona'),
        createCustomMarker([32.701, 35.371], 'fas fa-utensils', '#3b82f6', 'Nazareth'),
        createCustomMarker([32.921, 35.308], 'fas fa-hand-holding-heart', '#3b82f6', 'Karmiel')
    ];
    
    // Create marker groups
    const southMarkerGroup = L.featureGroup(southMarkers).addTo(map);
    const northMarkerGroup = L.featureGroup(northMarkers).addTo(map);
    
    // Region information for display
    const regionInfo = {
        south: {
            name: 'Southern Region',
            description: 'The southern region of Israel includes cities like Beer Sheva, Ashkelon, and Sderot. Our donations here focus on rebuilding homes, providing medical supplies, and food distribution.',
            projects: 8,
            beneficiaries: 180,
            amountRaised: '3.2 ETH',
            markerGroup: southMarkerGroup
        },
        north: {
            name: 'Northern Region',
            description: 'The northern region of Israel includes cities like Haifa, Kiryat Shmona, and Nazareth. Our donations here support medical facilities, food aid, and community reconstruction.',
            projects: 7,
            beneficiaries: 140,
            amountRaised: '2.8 ETH',
            markerGroup: northMarkerGroup
        }
    };

    // Add click events to regions for information display
    southernRegion.on('click', function() {
        updateRegionInfo('south');
        highlightRegion(southernRegion, northernRegion, southMarkerGroup, northMarkerGroup);
    });
    
    northernRegion.on('click', function() {
        updateRegionInfo('north');
        highlightRegion(northernRegion, southernRegion, northMarkerGroup, southMarkerGroup);
    });
    
    // Add popup to markers
    southMarkers.forEach(marker => {
        addMarkerPopup(marker, 'south');
    });
    
    northMarkers.forEach(marker => {
        addMarkerPopup(marker, 'north');
    });
    
    // Function to add popup content to markers
    function addMarkerPopup(marker, region) {
        const title = marker.options.title;
        let icon = marker._icon.querySelector('i').className;
        let type = 'Project';
        
        // Determine project type based on icon
        if (icon.includes('home')) type = 'Housing Reconstruction';
        if (icon.includes('utensils')) type = 'Food Distribution';
        if (icon.includes('medkit')) type = 'Medical Support';
        if (icon.includes('hand-holding-heart')) type = 'Community Center';
        
        const popupContent = `
            <div class="map-popup">
                <h3>${title}</h3>
                <div class="popup-type"><i class="${icon}"></i> ${type}</div>
                <p>Part of our ${region === 'south' ? 'Southern' : 'Northern'} Region aid initiative</p>
                <div class="popup-stats">
                    <div class="popup-stat">
                        <span class="stat-value">30+</span>
                        <span class="stat-label">Families</span>
                    </div>
                    <div class="popup-stat">
                        <span class="stat-value">0.4 ETH</span>
                        <span class="stat-label">Funded</span>
                    </div>
                </div>
                <button class="popup-button" onclick="showSection('donate')">Donate Now</button>
            </div>
        `;
        
        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'map-custom-popup'
        });
    }
    
    // Function to update region information
    function updateRegionInfo(region) {
        const regionInfoElement = document.getElementById('regionInfo');
        if (!regionInfoElement) return;
        
        const info = regionInfo[region];
        
        regionInfoElement.innerHTML = `
            <h4>${info.name}</h4>
            <p>${info.description}</p>
            <div class="region-info-stats">
                <div class="info-stat">
                    <span class="stat-value">${info.projects}</span>
                    <span class="stat-label">Projects</span>
                </div>
                <div class="info-stat">
                    <span class="stat-value">${info.beneficiaries}+</span>
                    <span class="stat-label">Beneficiaries</span>
                </div>
                <div class="info-stat">
                    <span class="stat-value">${info.amountRaised}</span>
                    <span class="stat-label">Raised</span>
                </div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="showSection('donate')">
                <i class="fas fa-heart"></i> Donate to ${info.name}
            </button>
        `;
    }
    
    // Function to highlight selected region
    function highlightRegion(selectedRegion, otherRegion, selectedMarkers, otherMarkers) {
        // Highlight selected region
        selectedRegion.setStyle({
            fillOpacity: 0.4,
            weight: 3
        });
        
        // Dim other region
        otherRegion.setStyle({
            fillOpacity: 0.1,
            weight: 1
        });
        
        // Bring selected markers to front
        selectedMarkers.eachLayer(function (layer) {
            layer.setZIndexOffset(1000);
        });
        
        // Push other markers to back
        otherMarkers.eachLayer(function (layer) {
            layer.setZIndexOffset(0);
        });
    }

    // Initialize with southern region selected by default
    updateRegionInfo('south');
    
    // Add map title overlay
    const mapTitle = L.control({position: 'topleft'});
    mapTitle.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'map-title-overlay');
        div.innerHTML = '<h4>lifeSpark Impact Map</h4><p>Click on regions or markers to learn more</p>';
        return div;
    };
    mapTitle.addTo(map);
    
    // Update markers and regions when language changes
    document.addEventListener('languageChanged', function(event) {
        const language = event.detail.language;
        updateMapTranslations(language);
    });
    
    // Update translations on the map
    function updateMapTranslations(language) {
        // Update popups with translated content
        southMarkers.concat(northMarkers).forEach(marker => {
            const popup = marker.getPopup();
            if (popup) {
                const title = marker.options.title;
                // Only update popup content if it's open
                if (popup.isOpen()) {
                    popup.update();
                }
            }
        });
        
        // Update region info if currently displayed
        const activeRegion = document.querySelector('.map-sidebar .btn-outline');
        if (activeRegion) {
            if (activeRegion.textContent.includes('Southern')) {
                updateRegionInfo('south');
            } else if (activeRegion.textContent.includes('Northern')) {
                updateRegionInfo('north');
            }
        }
    }
}

// Function to handle custom map styles for dark mode
function updateMapForDarkMode(isDark) {
    const map = window.mapInstance;
    if (!map) return;
    
    // Change tile layer based on theme
    if (isDark) {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);
    } else {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);
    }
}