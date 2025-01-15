// Initialize Map when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMap);

// Map initialization function
function initializeMap() {
    const mapElement = document.getElementById("leafletMap");
    if (!mapElement) return;

    const israelCoords = [31.0461, 34.8516];
    const telAviv = [32.0853, 34.7818];
    const map = L.map("leafletMap").setView(israelCoords, 8);
    
    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add markers with translated popups based on current language
    const markers = {
        israel: L.marker(israelCoords).addTo(map),
        telAviv: L.marker(telAviv).addTo(map)
    };

    function updateMarkers() {
        const markerTexts = {
            en: { israel: "Welcome to Israel!", telAviv: "Welcome to TLV!" },
            he: { israel: "!ברוכים הבאים לישראל", telAviv: "!ברוכים הבאים לתל אביב" },
            ru: { israel: "Добро пожаловать в Израиль!", telAviv: "Добро пожаловать в Тель-Авив!" },
            ar: { israel: "!مرحبا بكم في إسرائيل", telAviv: "!مرحبا بكم في تل أبيب" }
        };

        markers.israel.bindPopup(markerTexts[currentLanguage].israel).openPopup();
        markers.telAviv.bindPopup(markerTexts[currentLanguage].telAviv);
    }

    // Initial update
    updateMarkers();

    // Listen for language changes
    document.addEventListener('languageChanged', updateMarkers);
}