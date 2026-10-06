import { closestHistoricalYear, loadBoundaries, SOURCES, sourceAttribution, escapeHtml, countryAliases } from './sources.js?v=20261006-nation1';
import { loadSymbolsCatalog, selectCountrySymbols, renderCountrySymbols, renderCountrySymbolPreview } from './symbols.js?v=20261006-country1';
import { loadCountryArchives, buildCountryProfile, renderCountryProfile } from './country-data.js?v=20261006-country1';

// Chiave CARTO Basemaps limitata al dominio vitopalumbopodcast.github.io.
const CARTO_BASEMAP_KEY = 'cb1_4c5a_1_0417a143fc768f340fec2f48';

function getBasemapUrl(theme) {
    const style = theme === 'light' ? 'light_all' : 'dark_all';
    return `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(CARTO_BASEMAP_KEY)}`;
}

let map = null;
let geoJsonLayer = null;
let baseTileLayer = null; // Memorizza il layer delle tile per poterlo sostituire
let labelsLayer = null; // Memorizza il layer per le scritte dei nomi geografici
let activeGroups = []; // Fazioni/gruppi attivi per l'evento corrente
let activeHighlightedCountries = [];
let currentYearLoaded = null;
let latestLoad = 0;

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
        worldCopyJump: true,
        preferCanvas: true
    }).setView(initialCenter, initialZoom);

    // Carica il layer di base scuro da CartoDB
    baseTileLayer = L.tileLayer(getBasemapUrl('dark'), {
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
    const url = getBasemapUrl(theme);
        
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
    return closestHistoricalYear(year);
}

// Restituisce il nome del file geojson per un anno specifico
function getFeatureSearchName(feature) {
    return (feature.properties?.SEARCH_NAMES || [getFeatureName(feature)]).join(' ');
}

// Funzione di stile per ogni feature geografica
function countryFeatureStyle(feature) {
    const countryName = getFeatureSearchName(feature);
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

function styleFeature(feature) {
    const precision = Number(feature.properties?.BORDERPRECISION);
    return {...countryFeatureStyle(feature), dashArray: precision === 1 ? '4 4' : precision === 2 ? '2 3' : null};
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
            const name = getFeatureSearchName(layer.feature);
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
export async function loadYearMap(year, eventGroups = [], eventLabels = [], onStartLoad, onEndLoad, options = {}) {
    const requestId = ++latestLoad;

    if (onStartLoad) onStartLoad();

    try {
        const result = await loadBoundaries(year, options.source || 'auto', options.mapDate);
        if (requestId !== latestLoad) return null;
        const geoData = result.data;
        const targetYear = result.boundaryYear;
        const source = SOURCES[result.sourceId];
        labelsLayer?.clearLayers();

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
            attribution: sourceAttribution(result.sourceId),
            style: styleFeature,
            onEachFeature: (feature, layer) => {
                const name = getFeatureName(feature);
                
                // Popup con nome dello stato
                const precision = Number(feature.properties?.BORDERPRECISION);
                const precisionLabel = ({1:'Confini approssimativi',2:'Confini moderatamente precisi',3:'Confini definiti dal diritto internazionale'})[precision];
                const popupHeader=`<strong>${escapeHtml(name)}</strong><p>Confini: ${escapeHtml(result.dateLabel)}</p>${precisionLabel ? `<p>${precisionLabel}</p>` : ''}<p>Fonte: <a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.name}</a></p>`;
                layer.bindPopup(`<div class="historical-popup nation-popup">${popupHeader}<p class="nation-symbol-note">Caricamento dei simboli e dei dati…</p></div>`,{maxWidth:380,minWidth:260,maxHeight:Math.max(160,Math.min(420,map.getSize().y-110)),keepInView:true});
                layer.on('popupopen',async e=>{
                    const popup=e.popup;
                    try {
                        const names=[name,...(feature.properties?.SEARCH_NAMES||[]),...countryAliases(name,targetYear)];
                        const [symbols,archives]=await Promise.allSettled([loadSymbolsCatalog(),loadCountryArchives()]);
                        const symbolsHtml=symbols.status==='fulfilled'?renderCountrySymbols(selectCountrySymbols(symbols.value.records,names,targetYear)):'<p>Simboli non disponibili. Riapri la scheda per riprovare.</p>';
                        const previewHtml=symbols.status==='fulfilled'?renderCountrySymbolPreview(selectCountrySymbols(symbols.value.records,names,targetYear)):'';
                        const factsHtml=archives.status==='fulfilled'?renderCountryProfile(buildCountryProfile(archives.value,names,targetYear,result.mapDate)):'<p>Dati delle nazioni non disponibili. Riapri la scheda per riprovare.</p>';
                        // Aggiorna soltanto il popup ancora aperto e appartenente a questa carta.
                        if(requestId!==latestLoad || !popup.isOpen())return;
                        popup.setContent(`<div class="historical-popup nation-popup">${popupHeader}${previewHtml}${factsHtml}<details class="nation-symbols-disclosure"><summary>Bandiere, stemmi e crediti</summary>${symbolsHtml}</details></div>`);
                    } catch(error) {
                        console.warn('Scheda nazione non disponibile:',error);
                        if(requestId===latestLoad && popup.isOpen())popup.setContent(`<div class="historical-popup nation-popup">${popupHeader}<p>Scheda non disponibile. Riaprila per riprovare.</p></div>`);
                    }
                });
                
                // Interazioni mouse
                layer.on({
                    mouseover: (e) => {
                        const l = e.target;
                        
                        // Trova se fa parte delle fazioni attive
                        const searchName = getFeatureSearchName(feature).toLowerCase();
                        const belongsToGroup = activeGroups.some(g => g.countries.some(k => searchName.includes(k.toLowerCase())));
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
                        const event = new CustomEvent('countrySelected', { detail: { name: getFeatureSearchName(feature) } });
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

        const {data, ...info} = result;
        return {...info, featureCount: geoData.features.length};
    } catch (error) {
        console.error("Errore nel caricamento della mappa storica:", error);
        throw error;
    } finally {
        if (requestId === latestLoad && onEndLoad) onEndLoad();
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
        const name = getFeatureSearchName(layer.feature);
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
