import { initializeMap, loadYearMap, fitMapBounds, zoomToInvolvedCountries, changeMapTheme } from './map.js?v=20260528-labels2';
import { initializeTimeline, pausePlayback } from './timeline.js';
import { historicalEvents } from './events.js?v=20260528-colonies';

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

async function handleEventChange(event) {
    try {
        yearValue.textContent = event.eraText;

        await loadYearMap(
            event.year,
            getEventFocusGroups(event),
            event.labels || [],
            showLoader,
            hideLoader
        );

        updateEventPanel(event);

        if (event.bounds) {
            fitMapBounds(event.bounds);
        }
    } catch (err) {
        console.error('Errore nel cambio evento:', err);
        hideLoader();
        updateEventPanel({
            ...event,
            description: `${event.description}\n\nNota: non sono riuscito a caricare i confini storici remoti per questo anno. Controlla la connessione e riprova.`
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeMap('map');

    initializeTimeline({
        onEventSelected: handleEventChange
    });

    if (historicalEvents.length > 0) {
        handleEventChange(historicalEvents[0]);
    }

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
