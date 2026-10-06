import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {buildCountryProfile,resolveCountry,observationAt,renderCountryProfile} from '../country-data.js';
import {countryAliases} from '../sources.js';
const bundle={errors:[],manifest:JSON.parse(await readFile(new URL('../data/country-manifest.json',import.meta.url),'utf8'))};
for(const key of ['worldbank','vdem','maddison','seshat','wikidata'])bundle[key]=JSON.parse(gunzipSync(await readFile(new URL(`../data/country-${key}.json.gz`,import.meta.url))));
const profile=(name,year,date)=>buildCountryProfile(bundle,[name,...countryAliases(name,year)],year,date);
test('manifest e copie compresse corrispondono; intervalli numerici e serie sono utilizzabili',async()=>{
 for(const [file,info] of Object.entries(bundle.manifest.files)) {
  const data=await readFile(new URL(`../data/${file}`,import.meta.url));
  assert.equal(data.length,info.bytes);assert.equal(createHash('sha256').update(data).digest('hex'),info.sha256);
 }
 for(const entity of Object.values(bundle.seshat))for(const o of entity.observations) {
  if(typeof o.value==='number') {assert.ok(o.value>=0);if(o.upper!=null)assert.ok(o.upper>=o.value);}
  if(o.from!=null&&o.to!=null)assert.ok(o.to>=o.from);
 }
});

test('Italia 2010 combina dati ufficiali datati e istituzioni senza confondere i campi',()=>{
 const p=profile('Italy/Sardinia',2010,'2010-01-01');
 assert.equal(p.entity.id,'Q38');
 assert.equal(p.rows.find(r=>r.field==='population').value,59819407);
 assert.equal(p.rows.find(r=>r.field==='population').source,'worldbank');
 assert.ok(p.rows.find(r=>r.field==='government').value.includes('parlamentare'));
 assert.ok(p.rows.find(r=>r.field==='regime').value.startsWith('Democrazia liberale'));
 assert.ok(p.rows.find(r=>r.field==='regime').value.includes('classificazione incerta'));
 assert.ok(p.undated.some(r=>r.field==='structure'&&r.value==='Stato unitario'));
 const html=renderCountryProfile(p);
 assert.ok(html.includes('59.819.407 abitanti'));assert.ok(html.includes('km²'));
 assert.ok(!html.includes('undefined'));assert.ok(html.includes('Evoluzione nel tempo'));
 assert.ok(html.includes('CC BY-SA 4.0'));assert.ok(html.includes('Informazioni senza datazione'));
});
test('identità storica: Regno d’Italia, Impero Russo e Prussia non ereditano popolazioni moderne',()=>{
 const italy=profile('Italy/Sardinia',1914);
 assert.equal(italy.entity.id,'Q172579');
 assert.ok(!italy.rows.some(r=>r.source==='worldbank'||r.source==='maddison'));
 assert.ok(!italy.rows.some(r=>r.field==='government'&&r.value==='autoritarismo'));
 const russia=profile('Russia',1914);assert.equal(russia.entity.id,'Q34266');
 assert.ok(!russia.rows.some(r=>r.source==='worldbank'));
 const prussia=profile('Germany/Prussia',1850);assert.equal(prussia.entity.id,'Q27306');assert.equal(prussia.entity.code,null);
 assert.equal(profile('Germany/Prussia',1914).entity.id,'Q43287');
 assert.equal(profile('Italy/Sardinia',-300).entity,null);
});
test('fondazione della repubblica italiana rispetta anche il mese dei confini',()=>{
 assert.equal(profile('Italy/Sardinia',1946,'1946-01-01').entity.id,'Q172579');
 assert.equal(profile('Italy/Sardinia',1946,'1946-07-01').entity.id,'Q38');
});
test('Seshat associa le fasi romane, conserva intervalli e non inventa valori',()=>{
 const p=profile('Roman Empire',200);
 assert.equal(p.entity.seshat,'it_roman_principate');
 assert.ok(p.rows.some(r=>r.source==='seshat'));
 assert.ok(!p.rows.some(r=>r.source==='worldbank'||r.source==='vdem'));
 assert.ok(renderCountryProfile(p).includes('Seshat'));
 assert.equal(profile('Roman Empire',2010).entity,null);
 assert.ok(profile('Egypt',-3000).entity?.seshat.startsWith('eg_'));
});
test('i dati mai vengono presi dal futuro e la prossimità è limitata',()=>{
 assert.equal(observationAt([[2000,1],[2010,2]],2005),null);
 assert.deepEqual(observationAt([[2000,1],[2010,2]],2005,5),[2000,1]);
 assert.equal(observationAt([[2000,1],[2010,2]],1999,50),null);
 assert.equal(observationAt([[2000,1]],2020,5),null);
 const p=profile('Italy',2026);assert.ok(p.rows.every(r=>r.from==null||r.from<=2026));
 assert.ok(renderCountryProfile(p).includes('Osservazione precedente'));
});
test('World Bank esclude aggregati; Maddison converte migliaia in abitanti e include riferimenti',()=>{
 assert.equal(bundle.worldbank.WLD,undefined);assert.equal(bundle.worldbank.EUU,undefined);
 assert.ok(bundle.worldbank.ESP);assert.ok(bundle.maddison.ITA.rows.find(r=>r[0]===2010)[1]>50000000);
 assert.ok(bundle.maddison.ITA.references.length);
 assert.ok(profile('Spain',2010).rows.some(r=>r.source==='worldbank'));
});
test('ambiguity, archivi parziali e stringhe HTML non producono corrispondenze arbitrarie',()=>{
 assert.equal(resolveCountry(bundle,['Congo'],2010),null);
 const p=buildCountryProfile({...bundle,worldbank:{},errors:['worldbank']},['Italy'],2010);
 assert.ok(p.rows.some(r=>r.source==='vdem'));assert.ok(renderCountryProfile(p).includes('dati parziali'));
 p.entity.name='<img src=x onerror=alert(1)>';assert.ok(!renderCountryProfile(p).includes('<img src=x'));
});
