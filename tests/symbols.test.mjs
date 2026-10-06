import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {selectSymbols,renderSymbolCards} from '../symbols.js';
import {historicalEvents} from '../events.js';
const catalog=JSON.parse(await readFile(new URL('../data/symbols.json',import.meta.url)));
const event=id=>historicalEvents.find(e=>e.id===id);
test('associa entità storiche e non bandiere moderne ai territori del 1914',()=>{
 const records=selectSymbols(catalog.records,event('world-war-one'));
 assert.ok(records.some(r=>r.id==='Q43287'));
 assert.ok(records.some(r=>r.id==='Q34266'));
 assert.ok(!records.some(r=>['Q183','Q159','Q38'].includes(r.id)));
 const ottoman=records.find(r=>r.id==='Q12560');
 assert.ok(ottoman.assets.every(a=>!a.file.includes('Fictitious')));
});
test('varianti temporali: Canada nel 1960 e Cina nel 1938',()=>{
 const canada=selectSymbols(catalog.records,event('cold-war')).find(r=>r.id==='Q16');
 assert.ok(canada.assets.some(a=>a.file.includes('1957')));
 assert.ok(!canada.assets.some(a=>a.file.includes('Pantone')));
 const china=selectSymbols(catalog.records,event('world-war-two')).filter(r=>r.aliases.includes('China'));
 assert.equal(china.length,1);assert.equal(china[0].id,'Q13426199');
});
test('non attribuisce bandiere moderne a civiltà antiche; catalogo con crediti completi',()=>{
 assert.equal(selectSymbols(catalog.records,event('roman-empire-peak')).length,0);
 assert.ok(selectSymbols(catalog.records,event('contemporary-era')).length>=8);
 for(const record of catalog.records)for(const asset of record.assets){
  assert.ok(asset.license);assert.ok(asset.artist);assert.match(asset.page,/^https:\/\/commons.wikimedia.org\//);
  assert.ok(!asset.url.includes('utm_'));
 }
});
test('nomi e crediti esterni vengono escapati, URL non sicuri esclusi',()=>{
 const html=renderSymbolCards([{id:'Q1',name:'<script>',assets:[{kind:'flag',artist:'<img>',url:'javascript:alert(1)',page:'javascript:alert(1)',license:'test'}]}]);
 assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('javascript:'));assert.ok(!html.includes('<script>'));
});
