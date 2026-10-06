import { initializeMap, loadYearMap, fitMapBounds, zoomToInvolvedCountries, changeMapTheme } from './map.js?v=20261006-light1';
import { createAncientLayers } from './ancient-layers.js?v=20261006-nation1';
import { SOURCES, escapeHtml, isAncientPeriod } from './sources.js?v=20261006-nation1';
import { initializeTimeline, pausePlayback } from './timeline.js?v=20261006-timeline2';
import { historicalEvents } from './events.js?v=20260528-colonies';
import { createSymbolsPanel } from './symbols.js?v=20261006-country1';

const eventPanel = document.getElementById('event-panel');
const eventEra = document.getElementById('event-era');
const eventTitle = document.getElementById('event-title');
const eventDescription = document.getElementById('event-description');
const closePanelBtn = document.getElementById('close-panel-btn');
const countriesList = document.getElementById('countries-list');
const countriesListContainer = document.getElementById('countries-list-container');
const countriesListTitle = document.querySelector('.countries-list-container h3');
const mapLoader = document.getElementById('map-loader');
const yearValue = document.getElementById('year-value');
const boundaryValue = document.getElementById('boundary-value');
const mapSourceSelect = document.getElementById('map-source-select');
const sourceInfo = document.getElementById('cartography-source');
const layerInputs = Object.fromEntries(['pleiades','dare'].map(id => [id, document.getElementById(`${id}-toggle`)]));
let activeEvent = null;
let selectionVersion = 0;
let ancientLayers = null;
const updateSymbols = createSymbolsPanel(document.getElementById('symbols-content'));

function updateLayerStatus(status) {
    for (const [id, state] of Object.entries(status)) {
        layerInputs[id].disabled = !state.available;
        const el = document.getElementById(`${id}-status`);
        if (!state.available) el.textContent = 'Disponibile fra 800 a.C. e 700 d.C.';
        else if (!state.enabled) el.textContent = id === 'pleiades' ? 'Luoghi attestati nel periodo selezionato' : 'Catalogo romano, senza filtro annuale';
        else if (state.loading) el.textContent = 'Caricamento luoghi…';
        else if (state.error) el.textContent = state.error;
        else el.textContent = `${state.shown} luoghi nell’area visibile${state.total > state.shown ? ` su ${state.total}: aumenta lo zoom` : ''}`;
    }
}

function updateSourceInfo(info) {
    const source = SOURCES[info.sourceId];
    sourceInfo.dataset.sourceId = info.sourceId;
    sourceInfo.dataset.featureCount = String(info.featureCount);
    sourceInfo.dataset.boundaryDate = info.mapDate || String(info.boundaryYear);
    sourceInfo.innerHTML = `<h3>Fonte dei confini</h3><p><a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.name} ↗</a> · ${escapeHtml(info.scope)}</p><p>Confini: <strong>${escapeHtml(info.dateLabel)}</strong></p><p class="source-note">${escapeHtml(info.note)}</p>${info.warning ? `<p class="source-warning">${escapeHtml(info.warning)}</p>` : ''}<p class="source-credit">${escapeHtml(source.credit)} · <a href="${source.licenseUrl}" target="_blank" rel="noopener noreferrer">${source.license}</a></p>`;
    boundaryValue.textContent = `${info.dateLabel} · ${source.name}`;
}

function getEventFocusGroups(event) {
    return event.groups || [];
}

function getEventFocusCountries(event) {
    if (event.involvedCountries && event.involvedCountries.length > 0) {
        return event.involvedCountries;
    }

    return getEventFocusGroups(event).flatMap(group => group.countries || []);
}

function showLoader() {
    mapLoader.classList.remove('hidden');
}

function hideLoader() {
    mapLoader.classList.add('hidden');
}

function updateEventPanel(event) {
    eventPanel.classList.remove('closed');

    eventEra.textContent = event.eraText;
    eventTitle.textContent = event.title;
    eventDescription.textContent = event.description;
    updateSymbols(event);
    countriesList.innerHTML = '';

    const groups = getEventFocusGroups(event);
    const fallbackCountries = getEventFocusCountries(event);

    if (groups.length === 0 && fallbackCountries.length === 0) {
        countriesListContainer.classList.add('hidden');
        return;
    }

    countriesListContainer.classList.remove('hidden');
    if (countriesListTitle) {
        countriesListTitle.textContent = groups.length > 0 ? 'Potenze e territori' : 'Territori coinvolti';
    }

    const items = groups.length > 0
        ? groups.map(group => ({
            label: group.name,
            color: group.color,
            countries: group.countries || []
        }))
        : fallbackCountries.map(countryName => ({
            label: countryName,
            color: null,
            countries: [countryName]
        }));

    items.forEach(item => {
        const tag = document.createElement('button');
        tag.className = 'country-tag';
        tag.dataset.countries = JSON.stringify(item.countries);
        if (item.color) tag.style.setProperty('--tag-color', item.color);
        tag.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${item.label}`;

        tag.addEventListener('click', (e) => {
            e.stopPropagation();
            countriesList.querySelectorAll('.country-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            pausePlayback();
            zoomToInvolvedCountries(item.countries);
        });

        countriesList.appendChild(tag);
    });
}

async function handleEventChange(event, {focus = true} = {}) {
    const version = ++selectionVersion;
    activeEvent = event;
    try {
        yearValue.textContent = event.eraText;
        boundaryValue.textContent = 'Caricamento…';
        sourceInfo.replaceChildren();
        sourceInfo.textContent = 'Caricamento della fonte cartografica…';
        delete sourceInfo.dataset.sourceId;
        updateEventPanel(event);
        // Nasconde subito i luoghi di un periodo precedente durante il cambio evento.
        ancientLayers?.setYear(event.year);

        const info = await loadYearMap(
            event.year,
            getEventFocusGroups(event),
            event.labels || [],
            showLoader,
            hideLoader,
            {source: mapSourceSelect.value, mapDate: event.mapDate}
        );
        if (version !== selectionVersion || !info) return;
        updateSourceInfo(info);

        if (focus && event.bounds) {
            fitMapBounds(event.bounds);
        }
    } catch (err) {
        if (version !== selectionVersion) return;
        console.error('Errore nel cambio evento:', err);
        hideLoader();
        boundaryValue.textContent = 'Caricamento non riuscito';
        sourceInfo.textContent = 'Non è stato possibile caricare i confini di questo evento. Seleziona nuovamente l’evento per riprovare.';
        updateEventPanel({
            ...event,
            description: `${event.description}\n\nNota: non sono riuscito a caricare i confini storici remoti per questo anno. Controlla la connessione e riprova.`
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const leafletMap = initializeMap('map');
    ancientLayers = createAncientLayers(leafletMap, updateLayerStatus);
    ancientLayers.setYear(historicalEvents[0]?.year ?? -3000);
    mapSourceSelect.addEventListener('change', () => {
        pausePlayback();
        if (activeEvent) handleEventChange(activeEvent, {focus:false});
    });
    for (const [id, input] of Object.entries(layerInputs)) {
        input.addEventListener('change', () => {
            pausePlayback();
            ancientLayers.setEnabled(id, input.checked);
        });
    }

    initializeTimeline({
        onEventSelected: handleEventChange
    });
    if (historicalEvents.length) handleEventChange(historicalEvents[0]);

    closePanelBtn.addEventListener('click', () => {
        eventPanel.classList.add('closed');
    });

    window.addEventListener('countrySelected', (e) => {
        const clickedCountryName = e.detail.name.toLowerCase();
        const tags = countriesList.querySelectorAll('.country-tag');

        tags.forEach(tag => {
            const tagCountries = JSON.parse(tag.dataset.countries || '[]');
            const matches = tagCountries.some(country => {
                const needle = country.toLowerCase();
                return clickedCountryName.includes(needle) || needle.includes(clickedCountryName);
            });

            tag.classList.toggle('active', matches);
        });
    });

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    themeToggleBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        const icon = themeToggleBtn.querySelector('i');
        icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
        changeMapTheme(isLight ? 'light' : 'dark');
    });
});
