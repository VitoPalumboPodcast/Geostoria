import {loadLocalData, isAncientPeriod, formatYear, escapeHtml, sourceAttribution, SOURCES} from './sources.js?v=20261006-nation1';

export function createAncientLayers(map, onStatus) {
    let currentYear = -3000;
    const states = Object.fromEntries(['pleiades','dare'].map(id => [id, {
        enabled:false, loading:false, data:null, error:'', group:L.layerGroup()
    }]));
    for (const id of Object.keys(states)) states[id].group.getAttribution = () => sourceAttribution(id);
    const canvas = L.canvas({padding:0.3});

    function render() {
        const status = {};
        const bounds = map.getBounds();
        for (const [id, state] of Object.entries(states)) {
            state.group.clearLayers();
            if (map.hasLayer(state.group)) map.removeLayer(state.group);
            const available = isAncientPeriod(currentYear);
            status[id] = {enabled:state.enabled, available, loading:state.loading, error:state.error, shown:0, total:0};
            if (!state.enabled || !available || !state.data) continue;
            const seen = new Set();
            const features = state.data.features.filter(feature => {
                const p = feature.properties;
                if (id === 'pleiades' && (currentYear < p.from || currentYear > p.to)) return false;
                const [lon, lat] = feature.geometry.coordinates;
                if (!bounds.contains([lat,lon])) return false;
                if (seen.has(p.id)) return false;
                seen.add(p.id);
                return true;
            });
            status[id].total = features.length;
            const visible = features.slice(0,1200);
            status[id].shown = visible.length;
            for (const feature of visible) {
                const p = feature.properties;
                const [lon,lat] = feature.geometry.coordinates;
                const color = id === 'pleiades' ? '#0891b2' : '#d97706';
                const period = id === 'pleiades'
                    ? `Intervallo attestato: ${formatYear(p.from)} – ${formatYear(p.to)}. La datazione è per periodi, non per singolo anno.`
                    : 'Catalogo di luoghi del mondo romano: la presenza non è verificata per l’anno selezionato.';
                const url = id === 'pleiades' ? `https://pleiades.stoa.org/places/${encodeURIComponent(p.id)}` : `https://imperium.ahlfeldt.se/api/geojson.php?id=${encodeURIComponent(p.id)}`;
                L.circleMarker([lat,lon], {renderer:canvas, radius:map.getZoom() >= 5 ? 4 : 2.5, color, fillColor:color, fillOpacity:0.8, weight:1})
                    .bindTooltip(escapeHtml(p.name))
                    .bindPopup(`<div class="historical-popup"><strong>${escapeHtml(p.name)}</strong><p>${escapeHtml(period)}</p>${p.accuracy != null ? `<p>Accuratezza dichiarata: ${escapeHtml(p.accuracy)} m</p>` : ''}<a href="${url}" target="_blank" rel="noopener noreferrer">Scheda ${SOURCES[id].name} ↗</a></div>`)
                    .addTo(state.group);
            }
            if (visible.length) state.group.addTo(map);
        }
        onStatus(status);
    }

    map.on('moveend', render);
    return {
        setYear(year) { currentYear = year; render(); },
        async setEnabled(id, enabled) {
            const state = states[id];
            state.enabled = enabled;
            if (enabled && !state.data && !state.loading) {
                state.loading = true;
                state.error = '';
                render();
                try { state.data = await loadLocalData(`${id}-places.geojson.gz`); }
                catch (error) { state.error = 'Livello non disponibile. Disattiva e riattiva per riprovare.'; console.warn(id, error); }
                finally { state.loading = false; }
            }
            render();
        }
    };
}
