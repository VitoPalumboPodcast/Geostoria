// Elenco degli anni con dati GeoJSON disponibili nel repository aourednik/historical-basemaps
const AVAILABLE_YEARS = [
    -123000, -10000, -8000, -5000, -4000, -3000, -2000, -1500, -1000, -700, -500, 
    -400, -323, -300, -200, -100, -1, 100, 200, 300, 400, 500, 600, 700, 800, 900, 
    1000, 1100, 1200, 1279, 1300, 1400, 1492, 1500, 1530, 1600, 1650, 1700, 1715, 
    1783, 1800, 1815, 1880, 1900, 1914, 1920, 1930, 1938, 1945, 1960, 1994, 2000, 2010
];

const BASE_URL = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/";

let map = null;
let geoJsonLayer = null;
let baseTileLayer = null; // Memorizza il layer delle tile per poterlo sostituire
let labelsLayer = null; // Memorizza il layer per le scritte dei nomi geografici
let geoJsonCache = {}; // Cache in memoria per evitare download ripetuti
let activeGroups = []; // Fazioni/gruppi attivi per l'evento corrente
let activeHighlightedCountries = [];
let currentYearLoaded = null;

// Funzione hash per generare colori stabili basati sul nome del paese
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Usa un range limitato per saturazione e luminosità per mantenere l'estetica coerente
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 60%, 45%)`;
}

// Inizializza la mappa
export function initializeMap(domId, initialCenter = [20, 0], initialZoom = 2) {
    map = L.map(domId, {
        zoomControl: true,
        minZoom: 2,
        maxZoom: 10,
        worldCopyJump: true
    }).setView(initialCenter, initialZoom);

    // Carica il layer di base scuro da CartoDB
    baseTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Inizializza il layer delle etichette di testo sulla mappa
    labelsLayer = L.layerGroup().addTo(map);

    return map;
}

// Cambia il tema grafico delle tile di sfondo della mappa
export function changeMapTheme(theme) {
    if (!map) return;
    
    // Rimuove il vecchio layer
    if (baseTileLayer) {
        map.removeLayer(baseTileLayer);
    }
    
    // Carica le nuove tile
    const url = theme === 'light'
        ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        
    baseTileLayer = L.tileLayer(url, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Forza l'aggiornamento grafico dei contorni storici per adattarsi ai contrasti
    if (geoJsonLayer) {
        geoJsonLayer.eachLayer(layer => {
            geoJsonLayer.resetStyle(layer);
        });
    }
}

// Riconduce l'anno selezionato a quello più vicino disponibile
export function getClosestAvailableYear(year) {
    return AVAILABLE_YEARS.reduce((prev, curr) => {
        return Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev;
    });
}

// Restituisce il nome del file geojson per un anno specifico
function getGeoJsonFilename(year) {
    if (year < 0) {
        return `world_bc${Math.abs(year)}.geojson`;
    } else {
        return `world_${year}.geojson`;
    }
}

// Funzione di stile per ogni feature geografica
function styleFeature(feature) {
    const countryName = getFeatureName(feature);
    const isLightTheme = document.body.classList.contains('light-theme');
    
    // 1. Se c'è un'evidenziazione attiva specifica (es. click su un tag fazione)
    if (activeHighlightedCountries && activeHighlightedCountries.length > 0) {
        const isSelected = activeHighlightedCountries.some(keyword => {
            return countryName.toLowerCase().includes(keyword.toLowerCase());
        });
        
        if (isSelected) {
            // Trova se appartiene a una fazione per conservare il suo colore
            let groupColor = isLightTheme ? "#d97706" : "#f59e0b"; // Default oro
            const matchedGroup = activeGroups.find(g => g.countries.some(k => countryName.toLowerCase().includes(k.toLowerCase())));
            if (matchedGroup) {
                groupColor = matchedGroup.color;
            }
            
            return {
                fillColor: groupColor,
                fillOpacity: isLightTheme ? 0.60 : 0.70,
                color: isLightTheme ? groupColor : "#ffffff",
                weight: 2.5,
                opacity: 1,
                dashArray: ""
            };
        } else {
            // Dissolvi (fade out) il resto
            return {
                fillColor: "#475569",
                fillOpacity: 0.06,
                color: isLightTheme ? "rgba(15,23,42,0.06)" : "rgba(255,255,255,0.04)",
                weight: 1,
                opacity: 0.15
            };
        }
    }
    
    // 2. Altrimenti mostra tutte le fazioni/gruppi con i loro colori dedicati
    let matchedGroup = null;
    for (const group of activeGroups) {
        const match = group.countries.some(keyword => {
            return countryName.toLowerCase().includes(keyword.toLowerCase());
        });
        if (match) {
            matchedGroup = group;
            break;
        }
    }
    
    if (matchedGroup) {
        return {
            fillColor: matchedGroup.color,
            fillOpacity: isLightTheme ? 0.40 : 0.48,
            color: isLightTheme ? matchedGroup.color : "rgba(255,255,255,0.3)",
            weight: 1.5,
            opacity: 0.8
        };
    } else {
        // Colore calcolato per i paesi normali/neutrali
        const color = stringToColor(countryName);
        return {
            fillColor: color,
            fillOpacity: isLightTheme ? 0.12 : 0.18,
            color: isLightTheme ? "rgba(15, 23, 42, 0.15)" : "rgba(255,255,255,0.08)",
            weight: 1,
            opacity: 0.4
        };
    }
}

// Trova il nome del paese all'interno della feature GeoJSON
export function getFeatureName(feature) {
    if (!feature || !feature.properties) return "Sconosciuto";
    const props = feature.properties;
    return props.NAME || props.Name || props.name || props.SUBJECTO || props.subjecto || "Territorio";
}

// Seleziona ed evidenzia paesi specifici
export function highlightCountries(countryNames) {
    activeHighlightedCountries = countryNames || [];
    if (geoJsonLayer) {
        geoJsonLayer.eachLayer(layer => {
            geoJsonLayer.resetStyle(layer);
            
            // Porta gli elementi evidenziati in primo piano
            const name = getFeatureName(layer.feature);
            const isHighlighted = activeHighlightedCountries.some(keyword => {
                return name.toLowerCase().includes(keyword.toLowerCase());
            });
            if (isHighlighted && typeof layer.bringToFront === 'function') {
                layer.bringToFront();
            }
        });
    }
}

// Carica e renderizza i confini storici di un determinato anno
export async function loadYearMap(year, eventGroups = [], eventLabels = [], onStartLoad, onEndLoad) {
    const targetYear = getClosestAvailableYear(year);
    
    // Rilascia le etichette di testo precedenti
    if (labelsLayer) {
        labelsLayer.clearLayers();
    }

    const filename = getGeoJsonFilename(targetYear);
    const url = `${BASE_URL}${filename}`;

    if (onStartLoad) onStartLoad();

    try {
        let geoData = null;

        // Controlla cache
        if (geoJsonCache[targetYear]) {
            geoData = geoJsonCache[targetYear];
        } else {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Impossibile caricare i dati storici per l'anno ${targetYear}`);
            }
            geoData = await response.json();
            // Salva in cache
            geoJsonCache[targetYear] = geoData;
        }

        // Rimuovi layer precedente se presente
        if (geoJsonLayer) {
            map.removeLayer(geoJsonLayer);
        }

        // Imposta i gruppi attivi per quest'anno e resetta le evidenziazioni specifiche
        activeGroups = eventGroups || [];
        activeHighlightedCountries = [];
        currentYearLoaded = targetYear;

        // Crea il nuovo GeoJSON layer
        geoJsonLayer = L.geoJSON(geoData, {
            style: styleFeature,
            onEachFeature: (feature, layer) => {
                const name = getFeatureName(feature);
                
                // Popup con nome dello stato
                layer.bindPopup(`<div style="font-family: 'Outfit', sans-serif; font-weight:600; font-size:1rem; margin-bottom:4px;">${name}</div><div style="font-size:0.85rem; color:#94a3b8;">Territorio nell'anno ${targetYear < 0 ? Math.abs(targetYear) + ' a.C.' : targetYear + ' d.C.'}</div>`);
                
                // Interazioni mouse
                layer.on({
                    mouseover: (e) => {
                        const l = e.target;
                        
                        // Trova se fa parte delle fazioni attive
                        const belongsToGroup = activeGroups.some(g => g.countries.some(k => name.toLowerCase().includes(k.toLowerCase())));
                        const isLightTheme = document.body.classList.contains('light-theme');
                        
                        l.setStyle({
                            fillOpacity: belongsToGroup ? (isLightTheme ? 0.60 : 0.70) : (isLightTheme ? 0.35 : 0.45),
                            color: isLightTheme ? "#0f172a" : "#ffffff",
                            weight: 1.5
                        });
                        
                        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                            l.bringToFront();
                        }
                    },
                    mouseout: (e) => {
                        geoJsonLayer.resetStyle(e.target);
                    },
                    click: (e) => {
                        map.fitBounds(e.target.getBounds(), { padding: [50, 50], maxZoom: 5 });
                        
                        // Genera un evento custom per notificare l'app del click sul paese
                        const event = new CustomEvent('countrySelected', { detail: { name: name } });
                        window.dispatchEvent(event);
                    }
                });
            }
        }).addTo(map);

        // Aggiungi le scritte (etichette di testo) geografiche dell'evento corrente sulla mappa
        if (eventLabels && eventLabels.length > 0) {
            eventLabels.forEach(label => {
                const labelIcon = L.divIcon({
                    className: 'map-text-label-container',
                    html: `<div class="map-text-label" style="border-color: ${label.color}; color: ${label.color};">${label.text}</div>`,
                    iconSize: [160, 42],
                    iconAnchor: [80, 21]
                });
                
                L.marker(label.pos, { 
                    icon: labelIcon, 
                    interactive: false 
                }).addTo(labelsLayer);
            });
        }

        return targetYear;
    } catch (error) {
        console.error("Errore nel caricamento della mappa storica:", error);
        throw error;
    } finally {
        if (onEndLoad) onEndLoad();
    }
}

// Sposta la mappa sui limiti geografici specificati
export function fitMapBounds(bounds) {
    if (map && bounds) {
        map.flyToBounds(bounds, {
            padding: [40, 40],
            duration: 1.5,
            easeLinearity: 0.25
        });
    }
}

// Trova i confini degli stati selezionati e ci si zooma
export function zoomToInvolvedCountries(countryNames) {
    if (!geoJsonLayer || !map || !countryNames || countryNames.length === 0) return;

    let targetLayers = [];
    geoJsonLayer.eachLayer(layer => {
        const name = getFeatureName(layer.feature);
        const match = countryNames.some(keyword => {
            return name.toLowerCase().includes(keyword.toLowerCase());
        });
        if (match) {
            targetLayers.push(layer);
        }
    });

    if (targetLayers.length > 0) {
        // Unisci i bounds di tutti i layer corrispondenti
        let bounds = targetLayers[0].getBounds();
        for (let i = 1; i < targetLayers.length; i++) {
            bounds.extend(targetLayers[i].getBounds());
        }
        
        map.flyToBounds(bounds, {
            padding: [50, 50],
            maxZoom: 5,
            duration: 1.8
        });
    }
}
