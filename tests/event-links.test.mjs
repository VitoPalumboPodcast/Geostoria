import test from 'node:test';
import assert from 'node:assert/strict';
import {historicalEvents} from '../events.js';
import {causalLinks, getRelatedEventLinks} from '../event-links.js';

test('i collegamenti causali rimandano a eventi esistenti e hanno una spiegazione', () => {
    const ids = new Set(historicalEvents.map(event => event.id));
    for (const link of causalLinks) {
        assert.ok(ids.has(link.from), `evento origine inesistente: ${link.from}`);
        assert.ok(ids.has(link.to), `evento destinazione inesistente: ${link.to}`);
        assert.notEqual(link.from, link.to);
        assert.ok(link.text.length >= 40, `spiegazione troppo breve: ${link.from}`);
    }
});

test('un evento mostra sia le premesse sia le conseguenze navigabili', () => {
    const links = getRelatedEventLinks('treaty-of-verdun');
    assert.ok(links.some(link => link.direction === 'premessa'));
    assert.ok(links.some(link => link.direction === 'conseguenza'));
    assert.ok(links.every(link => link.eventId && link.text));
});
