import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const raw=JSON.parse(await readFile(new URL('.data-cache/symbol-entities.json',root),'utf8'));
const ids=new Set();
for(const e of Object.values(raw.entities))for(const p of ['P122','P31','P36'])for(const c of e.claims[p]||[]) {
 const id=c.mainsnak.datavalue?.value?.id;if(id)ids.add(id);
}
const labels={};const list=[...ids];
for(let i=0;i<list.length;i+=50) {
 const url='https://www.wikidata.org/w/api.php?'+new URLSearchParams({action:'wbgetentities',ids:list.slice(i,i+50).join('|'),props:'labels',languages:'it|en',format:'json'});
 const r=await fetch(url,{signal:AbortSignal.timeout(60000)});if(!r.ok)throw new Error(r.status);
 const d=await r.json();Object.assign(labels,d.entities);
}
await writeFile(new URL('.data-cache/country-labels.json',root),JSON.stringify(labels));
console.log('Etichette Wikidata',list.length);
