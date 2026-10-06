// Aggiorna un catalogo locale: Wikidata CC0 e metadati/licenze dei file Commons.
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../',import.meta.url));
const definitions = [
 ['Q43287','Impero Tedesco',1871,1918,['German Empire']],
 ['Q28513','Austria-Ungheria',1867,1918,['Austria-Hungary']],
 ['Q12560','Impero Ottomano',1299,1922,['Ottoman','Ottoman Empire']],
 ['Q34266','Impero Russo',1721,1917,['Russian Empire']],
 ['Q131964','Impero Austriaco',1804,1867,['Austrian']],
 ['Q27306','Regno di Prussia',1701,1918,['Prussia']],
 ['Q70802','Terza Repubblica Francese',1870,1940,['France']],
 ['Q142','Francia',843,9999,['France']],
 ['Q172579','Regno d’Italia',1861,1946,['Italy']],
 ['Q7318','Germania nazista',1933,1945,['Germany']],
 ['Q15180','Unione Sovietica',1922,1991,['Soviet Union']],
 ['Q17','Giappone',1868,9999,['Japan']],
 ['Q13426199','Repubblica di Cina',1912,1949,['China']],
 ['Q145','Regno Unito',1801,9999,['United Kingdom']],
 ['Q30','Stati Uniti',1776,9999,['United States']],
 ['Q16','Canada',1867,9999,['Canada']],
 ['Q408','Australia',1901,9999,['Australia']],
 ['Q148','Cina',1949,9999,['China']],
 ['Q38','Italia',1946,9999,['Italy']],
 ['Q183','Germania',1949,9999,['Germany']],
 ['Q159','Federazione Russa',1992,9999,['Russia']],
 ['Q155','Brasile',1889,9999,['Brazil']],
 ['Q668','India',1947,9999,['India']]
];
const headers = {'User-Agent':'GeostoriaEducationalAtlas/1.0 (https://github.com/VitoPalumboPodcast/Geostoria)'};
async function get(url) {
 const response = await fetch(url,{headers,signal:AbortSignal.timeout(60000)});
 if (!response.ok) throw new Error(`${response.status}: ${url}`);
 const data=await response.json();if(data.error)throw new Error(JSON.stringify(data.error));return data;
}
function year(snak) {
 const time = snak?.datavalue?.value?.time;
 return time ? Number(time.match(/^([+-]\d+)-/)[1]) : null;
}
function plain(html='') {return html.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();}
await mkdir(root+'.data-cache',{recursive:true});
const cacheFile = root+'.data-cache/symbol-entities.json';
let raw;
try {if(process.argv.includes('--refresh'))throw new Error('Aggiornamento richiesto');raw=JSON.parse(await readFile(cacheFile,'utf8'));}
catch {raw = await get('https://www.wikidata.org/w/api.php?'+new URLSearchParams({action:'wbgetentities',ids:definitions.map(d=>d[0]).join('|'),props:'labels|claims',languages:'it|en',format:'json'}));await writeFile(cacheFile,JSON.stringify(raw));}
const missing=definitions.map(d=>d[0]).filter(id=>!raw.entities[id]);
if(missing.length) {const extra=await get('https://www.wikidata.org/w/api.php?'+new URLSearchParams({action:'wbgetentities',ids:missing.join('|'),props:'labels|claims',languages:'it|en',format:'json'}));Object.assign(raw.entities,extra.entities);await writeFile(cacheFile,JSON.stringify(raw));}
const records = definitions.map(([id,name,from,to,aliases])=>({id,name,from,to,aliases,assets:[]}));
const files = new Set();
for (const record of records) {
 const entity = raw.entities[record.id];
 if (!entity || entity.missing !== undefined) throw new Error('Entità mancante: '+record.id);
 for (const [property,kind] of [['P41','flag'],['P94','arms'],['P158','seal']]) {
  for (const claim of entity.claims[property]||[]) {
   if (claim.rank==='deprecated' || !claim.mainsnak.datavalue) continue;
   const file=claim.mainsnak.datavalue.value;
   if (/fictitious/i.test(file)) continue;
   const from=year(claim.qualifiers?.P580?.[0]), to=year(claim.qualifiers?.P582?.[0]);
   const point=year(claim.qualifiers?.P585?.[0]);
   const filenamePeriod=file.match(/\b(\d{4})\s*[–-]\s*(\d{4})\b/);
   record.assets.push({kind,file,from:from??point??(filenamePeriod?Number(filenamePeriod[1]):null),to:to??point??(filenamePeriod?Number(filenamePeriod[2]):null),dateBasis:from!=null||to!=null||point!=null?'Wikidata':filenamePeriod?'Titolo del file Commons':'Non indicata',rank:claim.rank,statement:claim.id});
   files.add(file);
  }
 }
 console.log(record.id,entity.labels?.en?.value,record.assets.map(a=>a.file));
}
const metadata = {};
const list=[...files];
for(let i=0;i<list.length;i+=20) {
const data=await get('https://commons.wikimedia.org/w/api.php?'+new URLSearchParams({action:'query',titles:list.slice(i,i+20).map(f=>'File:'+f).join('|'),prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'240',format:'json',redirects:'1'}));
 await writeFile(root+`.data-cache/commons-symbols-${i}.json`,JSON.stringify(data));
 for(const page of Object.values(data.query?.pages||{})) {
  const info=page.imageinfo?.[0];if(!info)continue;
  const ext=info.extmetadata||{};
  const file=page.title.replace(/^File:/,'');
  metadata[file]={url:(info.thumburl||info.url).split('?')[0],page:info.descriptionurl,artist:plain(ext.Artist?.value),license:plain(ext.LicenseShortName?.value),licenseUrl:ext.LicenseUrl?.value||'',restrictions:plain(ext.Restrictions?.value),credit:plain(ext.Credit?.value)};
 }
 for(const redirect of data.query?.redirects||[]) metadata[redirect.from.replace(/^File:/,'')]=metadata[redirect.to.replace(/^File:/,'')];
}
for(const record of records) record.assets=record.assets.flatMap(asset=>{
 const info=metadata[asset.file];
 // Non pubblica file non risolti o privi di licenza identificabile.
 if(!info?.license || !/^https:\/\/(upload\.wikimedia\.org|thumb\.wikimedia\.org|commons\.wikimedia\.org)\//.test(info.url))return [];
 if(!info.artist && !/public domain|CC0/i.test(info.license))return [];
 if(!info.artist) info.artist='Autore non indicato nei metadati Commons';
 return [{...asset,...info}];
});
await mkdir(root+'data',{recursive:true});
if(!records.some(r=>r.assets.length))throw new Error('Nessuna immagine risolta: catalogo precedente conservato.');
await writeFile(root+'data/symbols.json',JSON.stringify({retrievedAt:new Date().toISOString(),source:'https://www.wikidata.org',dataLicense:'CC0',records},null,2)+'\n');
console.log('Catalogo:',records.length,'entità,',records.reduce((sum,r)=>sum+r.assets.length,0),'immagini con licenza');
