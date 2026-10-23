import test from 'node:test';
import assert from 'node:assert/strict';
import {historicalEvents} from '../events.js';
import {thematicPaths, getThematicPathsForEvent} from '../thematic-paths.js';

test('i percorsi tematici sono riutilizzabili e contengono solo eventi validi e ordinati', () => {
    const byId = new Map(historicalEvents.map(event => [event.id, event]));
    assert.ok(thematicPaths.length >= 3);
    for (const path of thematicPaths) {
        assert.ok(path.title && path.description && path.eventIds.length >= 3, path.id);
        const years = path.eventIds.map(id => {
            assert.ok(byId.has(id), `${path.id}: evento inesistente ${id}`);
            return byId.get(id).year;
        });
        assert.deepEqual(years, [...years].sort((a, b) => a - b), `${path.id}: ordine cronologico errato`);
    }
});

test('gli eventi normanni espongono il percorso dalla Scandinavia alla Sicilia', () => {
    const path = getThematicPathsForEvent('norman-conquest-sicily').find(item => item.id === 'norman-expansion');
    assert.ok(path);
    assert.equal(path.eventIds[0], 'second-invasions-incastellamento');
    assert.equal(path.eventIds.at(-1), 'kingdom-of-sicily');
    assert.ok(path.eventIds.includes('county-of-aversa'));
});
