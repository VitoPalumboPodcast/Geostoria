// Download originali ufficiali; cache esclusa da Git. Eseguire prima di build-country-data.py.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const cache=fileURLToPath(new URL('../.data-cache/',import.meta.url));
await mkdir(cache,{recursive:true});
async function get(url,file,json=true) {
 try {return json?JSON.parse(await readFile(cache+file,'utf8')):await readFile(cache+file);}catch{}
 const r=await fetch(url,{signal:AbortSignal.timeout(120000),headers:{'User-Agent':'GeostoriaEducationalAtlas/1.0'}});
 if(!r.ok)throw new Error(`${r.status} ${url}`);
 const bytes=Buffer.from(await r.arrayBuffer());await writeFile(cache+file,bytes);
 console.log(file,bytes.length);return json?JSON.parse(bytes.toString()):bytes;
}
for(const [name,path] of [['population','sc/polity-populations'],['area','sc/polity-territories'],['capitals','general/polity-capitals']]) {
 let url=`https://www.seshat-db.com/api/${path}/`,page=1,rows=[];
 while(url) {const data=await get(url,`seshat-${name}-page${page++}.json`);rows.push(...data.results);url=data.next;}
 await writeFile(cache+`seshat-${name}-all.json`,JSON.stringify(rows));console.log('Seshat',name,rows.length);
}
const countries=await get('https://api.worldbank.org/v2/country?format=json&per_page=400','wb-countries.json');
for(const code of ['SP.POP.TOTL','AG.SRF.TOTL.K2','EN.POP.DNST']) {
 let page=1,rows=[];do {
 const data=await get(`https://api.worldbank.org/v2/country/all/indicator/${code}?format=json&source=2&date=1960:2025&per_page=20000&page=${page}`,`wb-${code}-page${page}.json`);
 if(!data[1])throw new Error('World Bank: risposta incompleta');rows.push(...data[1]);if(page++>=data[0].pages)break;
 }while(true);
 await writeFile(cache+`wb-${code}.json`,JSON.stringify(rows));console.log('World Bank',code,rows.length);
}
const repo=await get('https://api.github.com/repos/vdeminstitute/vdemdata/contents/data','vdem-repo.json');
for(const name of ['vdem.RData','codebook.RData'])await get(repo.find(x=>x.name===name).download_url,name,false);
// Il portale ufficiale usa dataverse.nl (senza www).
const mpd=await get('https://dataverse.nl/api/datasets/:persistentId/?persistentId=doi:10.34894/INZBF2','maddison-record.json');
const file=mpd.data.latestVersion.files.find(x=>/\.xlsx$/i.test(x.dataFile.filename));
if(!file)throw new Error('Maddison: file Excel non trovato');
await get(`https://dataverse.nl/api/access/datafile/${file.dataFile.id}`,'maddison.xlsx',false);
await writeFile(cache+'country-downloads.json',JSON.stringify({downloaded:new Date().toISOString(),vdem:repo,maddison:file.dataFile},null,2));
