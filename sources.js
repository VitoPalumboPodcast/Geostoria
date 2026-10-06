// Le copie compresse sono preparate da tools/prepare-map-data.py dalle fonti ufficiali.
export const DATA_VERSION = '20261006-layers1';
export const HISTORICAL_YEARS = [-123000,-10000,-8000,-5000,-4000,-3000,-2000,-1500,-1000,-700,-500,-400,-323,-300,-200,-100,-1,100,200,300,400,500,600,700,800,900,1000,1100,1200,1279,1300,1400,1492,1500,1530,1600,1650,1700,1715,1783,1800,1815,1878,1880,1900,1914,1920,1930,1938,1945,1960,1994,2000,2010];
export const SOURCES = {
    historical: { name: 'Historical Basemaps', credit: 'Alexandre Ourednik e collaboratori', url: 'https://github.com/aourednik/historical-basemaps', license: 'GPL-3.0', licenseUrl: 'https://github.com/aourednik/historical-basemaps/blob/master/LICENSE' },
    'cshapes-world': { name: 'CShapes 2.0', credit: 'ETH Zürich · Schvitz et al.', url: 'https://icr.ethz.ch/data/cshapes/', license: 'CC BY-NC-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/' },
    'cshapes-europe': { name: 'CShapes-Europe', credit: 'ETH Zürich · Cederman et al.', url: 'https://icr.ethz.ch/data/cshapes/', license: 'CC BY-NC-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/' },
    pleiades: { name: 'Pleiades', credit: 'AWMC / ISAW e contributori', url: 'https://pleiades.stoa.org/downloads', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/' },
    dare: { name: 'DARE', credit: 'Johan Åhlfeldt e contributori', url: 'https://imperium.ahlfeldt.se/print.php?doc=info_api', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/' }
};
const cache = new Map();
const BLOCKS = [[1886,1919],[1920,1949],[1950,1979],[1980,1999],[2000,2019]];
export const formatYear = year => year < 0 ? `${Math.abs(year)} a.C.` : `${year} d.C.`;
export const isAncientPeriod = year => year >= -800 && year <= 700;
export function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
export function closestHistoricalYear(year) {
    return HISTORICAL_YEARS.reduce((a, b) => Math.abs(b - year) < Math.abs(a - year) ? b : a);
}
export function sourceAttribution(id) {
    const s = SOURCES[id];
    return `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}</a> · <a href="${s.licenseUrl}" target="_blank" rel="noopener noreferrer">${s.license}</a>`;
}
export function validateCollection(data) {
    if (data?.type !== 'FeatureCollection' || !Array.isArray(data.features) || !data.features.length) {
        throw new Error('La fonte non contiene una raccolta geografica valida.');
    }
    return data;
}
export async function fetchGeoJson(url, compressed = false) {
    if (!cache.has(url)) {
        const promise = (async () => {
            const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
            if (!response.ok) throw new Error(`Dati non disponibili (HTTP ${response.status}).`);
            if (!compressed) return validateCollection(await response.json());
            if (typeof DecompressionStream === 'undefined') throw new Error('Il browser non supporta questa fonte.');
            const bytes = await response.arrayBuffer();
            const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
            return validateCollection(await new Response(stream).json());
        })();
        cache.set(url, promise);
        promise.catch(() => cache.delete(url));
    }
    return cache.get(url);
}
export function loadLocalData(filename) {
    return fetchGeoJson(`./data/${filename}?v=${DATA_VERSION}`, true);
}
export function chooseBoundarySource(year, preference = 'auto') {
    if (preference === 'historical') return 'historical';
    if (preference === 'cshapes-world') return year >= 1886 && year <= 2019 ? preference : 'historical';
    if (preference === 'cshapes-europe') return year >= 1816 && year <= 2023 ? preference : 'historical';
    if (year >= 1886 && year <= 2019) return 'cshapes-world';
    if (year >= 1816 && year < 1886) return 'cshapes-europe';
    return 'historical';
}
export function resolveMapDate(year, requestedDate) {
    const date = requestedDate || `${year}-01-01`;
    if (year < 1) return null;
    const parsed = new Date(`${date}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number(date.slice(0,4)) !== year || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0,10) !== date) {
        throw new Error('La data cartografica deve essere una data valida nello stesso anno dell’evento.');
    }
    return date;
}
export function matchingFeatures(features, id, year, date) {
    return features.filter(f => id === 'cshapes-world'
        ? f.properties.start <= date && f.properties.end >= date
        : f.properties.from <= year && f.properties.to >= year);
}
// Alias per preservare i gruppi didattici già presenti negli eventi.
export function countryAliases(name, year) {
    const aliases = [name];
    if (/germany/i.test(name) && year <= 1918) aliases.push('German Empire');
    if (/russia|soviet/i.test(name)) {
        if (year < 1918) aliases.push('Russian Empire');
        else if (year <= 1991) aliases.push('Soviet Union');
        else aliases.push('Russia');
    }
    if (/turkey|ottoman/i.test(name) && year <= 1922) aliases.push('Ottoman Empire');
    if (/austria-hungary/i.test(name)) aliases.push('Austrian Empire');
    return aliases;
}
async function historicalMap(year, warning = '') {
    const boundaryYear = closestHistoricalYear(year);
    const filename = boundaryYear < 0 ? `world_bc${Math.abs(boundaryYear)}.geojson` : `world_${boundaryYear}.geojson`;
    const data = await fetchGeoJson(`https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/${filename}`);
    return {data, sourceId:'historical', boundaryYear, dateLabel:formatYear(boundaryYear), scope:'Mondo', warning,
        note: `Ricostruzione a scala mondiale. ${boundaryYear !== year ? 'È mostrato l’anno disponibile più vicino all’evento. ' : ''}Confini antichi approssimativi; tratteggio lungo = approssimativo, breve = moderatamente preciso.`};
}
export async function loadBoundaries(year, preference = 'auto', requestedDate) {
    const id = chooseBoundarySource(year, preference);
    if (id === 'historical') {
        const warning = preference !== 'auto' && preference !== 'historical' ? 'La fonte scelta non copre questo anno: è usata la carta globale.' : '';
        return historicalMap(year, warning);
    }
    try {
        let dataset, date = resolveMapDate(year, requestedDate);
        if (id === 'cshapes-world') {
            const [start, end] = BLOCKS.find(([a,b]) => year >= a && year <= b);
            dataset = await loadLocalData(`cshapes-${start}-${end}.geojson.gz`);
        } else dataset = await loadLocalData('cshapes-europe.geojson.gz');
        const selected = matchingFeatures(dataset.features, id, year, date);
        if (!selected.length) throw new Error('Nessun confine per questa data.');
        const data = {...dataset, features: selected.map(f => ({...f, properties: {...f.properties, SEARCH_NAMES:countryAliases(f.properties.NAME,year)}}))};
        return {data, sourceId:id, boundaryYear:year, mapDate:date,
            dateLabel: id === 'cshapes-world' ? new Intl.DateTimeFormat('it-IT', {dateStyle:'long',timeZone:'UTC'}).format(new Date(`${date}T00:00:00Z`)) : formatYear(year),
            scope: id === 'cshapes-world' ? 'Mondo' : 'Europa', warning:'',
            note: id === 'cshapes-world'
                ? 'Confini politici riconosciuti, non fronti militari. Per eventi con solo l’anno, la carta si riferisce al 1° gennaio.'
                : 'Ricostruzione annuale dei confini europei. Per la carta mondiale scegli Historical Basemaps.'};
    } catch (error) {
        console.warn('Fonte CShapes non disponibile:', error);
        return historicalMap(year, 'CShapes non è disponibile: è mostrata la carta globale di riferimento.');
    }
}
