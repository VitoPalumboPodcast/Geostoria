// Scarica solo dati pubblici dalle fonti ufficiali; non modifica i file dell'app.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const cache = fileURLToPath(new URL('../.data-cache/', import.meta.url));
await mkdir(cache, { recursive: true });
const sources = [
    ['cshapes-world.geojson', 'https://icr.ethz.ch/data/cshapes/CShapes-2.0.geojson'],
    ['cshapes-europe.geojson', 'https://icr.ethz.ch/data/cshapes/CShapes-Europe.geojson'],
    ['pleiades-gis.zip', 'https://atlantides.org/downloads/pleiades/gis/pleiades_gis_data.zip']
];
await Promise.all(sources.map(async ([filename, url]) => {
    const response = await fetch(url, { signal: AbortSignal.timeout(180000) });
    if (!response.ok) throw new Error(`${filename}: HTTP ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    await writeFile(`${cache}/${filename}`, bytes);
    console.log(`${filename}: ${bytes.length} bytes`);
}));
const places = new Map();
async function downloadDare(bbox, depth = 0) {
    const url = `https://imperium.ahlfeldt.se/api/geojson.php?bbox=${bbox.join(',')}&zoom=6`;
    const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw new Error(`DARE: HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.features)) throw new Error('DARE: GeoJSON non valido');
    if (data.features.length >= 500) {
        if (depth >= 5) throw new Error('DARE: limite di 500 luoghi non risolto');
        const [w, s, e, n] = bbox, x = (w + e) / 2, y = (s + n) / 2;
        for (const box of [[w,s,x,y],[x,s,e,y],[w,y,x,n],[x,y,e,n]]) await downloadDare(box, depth + 1);
    } else {
        for (const feature of data.features) places.set(String(feature.properties?.id ?? feature.id ?? JSON.stringify(feature.geometry)), feature);
    }
}
await downloadDare([-15,20,70,60]);
await writeFile(`${cache}/dare-places.geojson`, JSON.stringify({type:'FeatureCollection',features:[...places.values()]}));
console.log(`DARE: ${places.size} città e fortezze legionarie`);
