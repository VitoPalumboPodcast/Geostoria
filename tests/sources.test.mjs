import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {chooseBoundarySource,resolveMapDate,matchingFeatures,loadBoundaries,fetchGeoJson,countryAliases} from '../sources.js';
const dataPath = name => new URL(`../data/${name}`, import.meta.url);

test('copertura automatica e selezione esplicita non inventano confini fuori periodo', () => {
    for (const [year,id] of [[-44,'historical'],[1815,'historical'],[1816,'cshapes-europe'],[1885,'cshapes-europe'],[1886,'cshapes-world'],[2019,'cshapes-world'],[2020,'historical']]) assert.equal(chooseBoundarySource(year),id);
    assert.equal(chooseBoundarySource(1914,'historical'),'historical');
    assert.equal(chooseBoundarySource(2023,'cshapes-europe'),'cshapes-europe');
    assert.equal(chooseBoundarySource(-44,'cshapes-world'),'historical');
});
test('data cartografica valida, stesso anno, limiti inclusivi', () => {
    assert.equal(resolveMapDate(1914),'1914-01-01');
    assert.equal(resolveMapDate(1914,'1914-08-01'),'1914-08-01');
    for (const date of ['1913-12-31','1914-02-30','invalid']) assert.throws(()=>resolveMapDate(1914,date));
    const features = [{properties:{start:'1914-01-01',end:'1914-06-30'}},{properties:{start:'1914-07-01',end:'1918-12-31'}}];
    assert.equal(matchingFeatures(features,'cshapes-world',1914,'1914-06-30')[0],features[0]);
    assert.equal(matchingFeatures(features,'cshapes-world',1914,'1914-07-01')[0],features[1]);
    assert.ok(countryAliases('Germany',1914).includes('German Empire'));
});
test('copie compresse integre e geometrie/date utilizzabili', async () => {
    const manifest = JSON.parse(await readFile(dataPath('manifest.json')));
    for (const [file,info] of Object.entries(manifest.files)) {
        const bytes = await readFile(dataPath(file));
        assert.equal(bytes.length,info.bytes,file);
        assert.equal(createHash('sha256').update(bytes).digest('hex'),info.sha256,file);
        const data = JSON.parse(gunzipSync(bytes));
        assert.ok(data.features.length > 0,file);
        for (const f of data.features) {
            assert.ok(f.geometry.coordinates.length,file);
            if (f.properties.start) assert.ok(f.properties.start <= f.properties.end,file);
            if (f.properties.from != null) assert.ok(f.properties.from <= f.properties.to,file);
        }
        if (file.startsWith('cshapes-') && !file.includes('europe')) {
            const [,start,end] = file.match(/cshapes-(\d+)-(\d+)/);
            for (let year=+start;year<=+end;year++) {
                const countries = matchingFeatures(data.features,'cshapes-world',year,`${year}-01-01`);
                assert.ok(countries.length >= 40,`${year}: carta mondiale incompleta`);
                assert.equal(new Set(countries.map(f=>f.properties.code)).size,countries.length,`${year}: periodi duplicati per Stato`);
            }
        }
    }
});
test('caricamento gzip, cache, data precisa e ripiego dichiarato su errore', async () => {
    const originalFetch = globalThis.fetch;
    const calls = [];
    globalThis.fetch = async url => {
        calls.push(url);
        if (String(url).startsWith('./data/')) return new Response(await readFile(dataPath(String(url).split('/').pop().split('?')[0])));
        return new Response(JSON.stringify({type:'FeatureCollection',features:[{properties:{NAME:'Reference'},geometry:{type:'Point',coordinates:[0,0]}}]}));
    };
    try {
        const january = await loadBoundaries(1914);
        assert.equal(january.sourceId,'cshapes-world');
        assert.equal(january.mapDate,'1914-01-01');
        const august = await loadBoundaries(1914,'auto','1914-08-01');
        assert.equal(august.mapDate,'1914-08-01');
        assert.equal(calls.filter(url=>url.includes('1886-1919')).length,1);
        globalThis.fetch = async () => new Response('',{status:503});
        // Une autre partition n'est pas encore en cache.
        globalThis.fetch = async url => String(url).startsWith('./data/') ? new Response('',{status:503}) : new Response(JSON.stringify({type:'FeatureCollection',features:[{properties:{NAME:'Reference'},geometry:{type:'Point',coordinates:[0,0]}}]}));
        const fallback = await loadBoundaries(1945);
        assert.equal(fallback.sourceId,'historical');
        assert.ok(fallback.warning.includes('CShapes'));
        assert.equal(fallback.boundaryYear,1945);
        let attempts = 0;
        globalThis.fetch = async () => ++attempts === 1 ? new Response('',{status:503}) : new Response(JSON.stringify({type:'FeatureCollection',features:[{geometry:{type:'Point',coordinates:[0,0]}}]}));
        await assert.rejects(fetchGeoJson('retry-test'));
        await fetchGeoJson('retry-test');
        assert.equal(attempts,2,'un échec ne doit pas bloquer la nouvelle tentative');
    } finally { globalThis.fetch = originalFetch; }
});
