import test from 'node:test';
import assert from 'node:assert/strict';
import {historicalEvents} from '../events.js';
import {medievalEvents} from '../medieval-events.js';
import {featureMatchesCountries, findMatchingGroup} from '../map.js';

const expectedIds = [
    'fall-western-roman-empire', 'post-roman-population-movements', 'lombard-invasion-italy',
    'islam-birth-expansion', 'donation-of-sutri',
    'battle-of-poitiers', 'rise-of-carolingians', 'carolingian-expansion', 'charlemagne-empire',
    'death-of-charlemagne', 'treaty-of-verdun', 'capitulary-of-quierzy',
    'end-carolingian-unity', 'second-invasions-incastellamento', 'duchy-of-normandy',
    'battle-of-lechfeld', 'ottonian-empire', 'capetian-dynasty',
    'medieval-expansion-around-1000', 'constitutio-de-feudis', 'normans-in-melfi',
    'accord-of-melfi', 'battle-of-hastings', 'norman-conquest-sicily', 'kingdom-of-sicily'
];

test('la cronologia altomedievale contiene tutte le tappe richieste senza duplicati', () => {
    assert.deepEqual(medievalEvents.map(event => event.id), expectedIds);
    assert.equal(new Set(historicalEvents.map(event => event.id)).size, historicalEvents.length);
    assert.deepEqual([...medievalEvents].sort((a, b) => a.year - b.year), medievalEvents);
});

test('ogni evento altomedievale ha localizzazione, simbolo e inquadratura validi', () => {
    for (const event of medievalEvents) {
        assert.ok(event.title && event.description && event.eraText, event.id);
        assert.ok(event.markers?.length > 0, `${event.id}: manca il simbolo cartografico`);
        assert.equal(event.bounds?.length, 2, `${event.id}: limiti mappa mancanti`);
        for (const marker of event.markers) {
            assert.ok(marker.title && marker.icon, `${event.id}: marker incompleto`);
            assert.ok(marker.pos[0] >= -90 && marker.pos[0] <= 90, `${event.id}: latitudine non valida`);
            assert.ok(marker.pos[1] >= -180 && marker.pos[1] <= 180, `${event.id}: longitudine non valida`);
        }
    }
});

test('gli intervalli storici hanno estremi coerenti', () => {
    for (const event of medievalEvents.filter(event => event.duration)) {
        assert.ok(event.duration.start <= event.year, `${event.id}: inizio successivo all'anno evento`);
        assert.ok(event.duration.end >= event.year, `${event.id}: fine precedente all'anno evento`);
    }
});

test('migrazioni ed espansioni hanno frecce geografiche valide', () => {
    const movementEvents = medievalEvents.filter(event => event.movements?.length);
    assert.ok(movementEvents.length >= 7);
    for (const event of movementEvents) {
        for (const movement of event.movements) {
            assert.ok(movement.title && movement.color, `${event.id}: freccia incompleta`);
            assert.ok(movement.path.length >= 2, `${event.id}: percorso troppo breve`);
            for (const [lat, lon] of movement.path) {
                assert.ok(lat >= -90 && lat <= 90, `${event.id}: latitudine freccia non valida`);
                assert.ok(lon >= -180 && lon <= 180, `${event.id}: longitudine freccia non valida`);
            }
        }
    }
});

test('i domini longobardi e bizantini del 568 corrispondono ai nomi della carta del 600', () => {
    const event = medievalEvents.find(item => item.id === 'lombard-invasion-italy');
    const lombards = {properties: {NAME: 'Lombard principalities'}};
    const byzantines = {properties: {NAME: 'Eastern Roman Empire'}};

    assert.equal(findMatchingGroup(lombards, event.groups)?.name, 'Domini longobardi');
    assert.equal(findMatchingGroup(byzantines, event.groups)?.name, 'Domini bizantini');
    assert.equal(featureMatchesCountries(lombards, event.groups[0].countries), true);
    assert.equal(featureMatchesCountries(byzantines, event.groups[1].countries), true);
});
