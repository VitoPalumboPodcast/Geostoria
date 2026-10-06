import {escapeHtml,formatYear} from './sources.js?v=20261006-nation1';
const VERSION='20261006-country1';
const cache=new Map();
const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const REGIMES=['Autocrazia chiusa','Autocrazia elettorale','Democrazia elettorale','Democrazia liberale'];
const regimeUncertain=row=>row[3]!=null&&![0,3,6,9].includes(row[3]);
const LABELS={government:'Forma di governo',structure:'Assetto territoriale',capital:'Capitale',population:'Popolazione',area:'Superficie totale',density:'Densità',regime:'Regime politico',democracy:'Democrazia elettorale',classification:'Classificazione politica'};
const CODES={Q43287:'DEU',Q70802:'FRA',Q142:'FRA',Q172579:'ITA',Q7318:'DEU',Q17:'JPN',Q13426199:'CHN',Q145:'GBR',Q30:'USA',Q16:'CAN',Q408:'AUS',Q148:'CHN',Q38:'ITA',Q183:'DEU',Q159:'RUS',Q155:'BRA',Q668:'IND',Q34266:'RUS',Q15180:'RUS',Q12560:'TUR'};
// Le serie RUS contemporanee non coprono l'intera URSS; sono abilitate solo per V-Dem.
const HISTORICAL=new Set(['Q43287','Q70802','Q172579','Q7318','Q13426199','Q34266','Q15180','Q12560','Q131964','Q28513','Q27306']);
const ALIASES={USA:['United States','United States of America'],RUS:['Russia','Russian Federation'],DEU:['Germany'],ITA:['Italy'],GBR:['United Kingdom','Great Britain'],CZE:['Czech Republic','Czechia'],SVK:['Slovakia'],KOR:['South Korea','Republic of Korea'],PRK:['North Korea'],COD:['Congo, Democratic Republic of','Democratic Republic of the Congo','Congo-Kinshasa'],COG:['Republic of Congo','Congo-Brazzaville'],IRN:['Iran'],EGY:['Egypt'],TUR:['Turkey','Türkiye'],MMR:['Myanmar','Burma'],VNM:['Vietnam'],LAO:['Laos'],VEN:['Venezuela'],BOL:['Bolivia'],TZA:['Tanzania'],CIV:['Ivory Coast'],SWZ:['Swaziland','Eswatini']};
async function loadFile(name,gzip=false) {
 if(!cache.has(name)) {
  const promise=(async()=>{
   const r=await fetch(`./data/${name}?v=${VERSION}`,{signal:AbortSignal.timeout(20000)});
   if(!r.ok)throw new Error(`HTTP ${r.status}`);
   if(!gzip)return r.json();
   const bytes=await r.arrayBuffer();
   return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).json();
  })();cache.set(name,promise);promise.catch(()=>cache.delete(name));
 }
 return cache.get(name);
}
export async function loadCountryArchives() {
 const keys=['worldbank','vdem','maddison','seshat','wikidata'];
 const results=await Promise.allSettled(keys.map(key=>loadFile(`country-${key}.json.gz`,true)));
 const manifest=await loadFile('country-manifest.json');
 const bundle={manifest,errors:[]};
 results.forEach((r,i)=>{bundle[keys[i]]=r.status==='fulfilled'?r.value:{};if(r.status==='rejected')bundle.errors.push(keys[i]);});
 return bundle;
}
function splitNames(names,year) {
 return names.flatMap(name=>{
  // CShapes usa questi nomi per continuità statistica tra predecessori.
  if(/^Italy\/Sardinia$/i.test(name))return year>=1861?['Italy']:['Sardinia'];
  if(/^Germany\/Prussia$/i.test(name))return year>=1871?['Germany','German Empire']:['Prussia'];
  return [name];
 });
}
function matches(names,aliases) {return aliases.some(a=>names.some(n=>normalize(a)===normalize(n)));}
function lifespan(record,year,date) {
 if(year<record.from || year>record.to)return false;
 if(date && record.startDate && date<record.startDate)return false;
 if(date && record.endDate && date>record.endDate)return false;
 if(date && record.id==='Q38' && date<'1946-06-18')return false;
 if(date && record.id==='Q172579' && date>='1946-06-18')return false;
 return true;
}
export function resolveCountry(bundle,inputNames,year,date) {
 const names=splitNames(inputNames,year);
 const candidates=Object.values(bundle.wikidata).filter(r=>lifespan(r,year,date)&&matches(names,r.aliases));
 candidates.sort((a,b)=>b.from-a.from);
 const wd=candidates[0];
 const polities=Object.entries(bundle.seshat).filter(([,r])=>lifespan(r,year)&&matches(names,r.aliases));
 // Se più entità Seshat si sovrappongono, non scegliere una fase arbitraria.
 const seshat=polities.length===1?polities[0][0]:null;
 let code=wd?CODES[wd.id]:null;
 if(!code) {
  const codes=new Set([...Object.keys(bundle.worldbank),...Object.keys(bundle.vdem)]);
  const matching=[...codes].filter(c=>matches(names,[...(ALIASES[c]||[]),bundle.worldbank[c]?.name||'',bundle.vdem[c]?.name||'']));
  if(matching.length===1)code=matching[0];
 }
 // Un'identità storica senza associazione verificata non eredita statistiche moderne.
 const historic=wd && HISTORICAL.has(wd.id);
 if(wd && !CODES[wd.id])code=null;
 const vd=code?bundle.vdem[code]:null;
 const supportedSeries=code && ((year>=1960 && bundle.worldbank[code]) || vd?.rows.some(r=>r[0]===year));
 if(!wd && !seshat && !supportedSeries)return null;
 return {name:wd?.name||bundle.seshat[seshat]?.name||bundle.worldbank[code]?.name||vd?.name,id:wd?.id,code,wd,seshat,historic:!!historic,year,date:date||`${year}-01-01`};
}
function datedClaim(claim,year,date) {
 if(claim.point)return Number(claim.point.split('-')[0])===year;
 if(!claim.from&&!claim.to)return false;
 return (!claim.from||date>=claim.from)&&(!claim.to||date<=claim.to);
}
// Nessun dato futuro, nessuna interpolazione. Il limite riguarda l'età della fonte.
export function observationAt(rows,year,maxAge=0) {
 return (rows||[]).filter(row=>row[0]<=year && year-row[0]<=maxAge && row[1]!=null).sort((a,b)=>b[0]-a[0])[0]||null;
}
function numericRow(field,row,source,note='') {
 return row?{field,value:row[1],from:row[0],to:row[0],source,note}:null;
}
export function buildCountryProfile(bundle,names,year,date) {
 const entity=resolveCountry(bundle,names,year,date);
 if(!entity)return {year,entity:null,rows:[],undated:[],history:[],sources:[],errors:bundle.errors||[]};
 const rows=[],undated=[];
 const sh=entity.seshat?bundle.seshat[entity.seshat]:null;
 const wd=entity.wd;
 for(const field of ['government','structure','capital','population','area']) {
  const claims=(wd?.claims||[]).filter(c=>c.field===field&&!c.restricted);
  const dated=claims.filter(c=>datedClaim(c,year,entity.date));
  // In caso di transizione annuale restano visibili eventuali affermazioni concorrenti.
  for(const c of dated)rows.push({field,value:c.value,from:c.point?Number(c.point.slice(0,4)):c.from?Number(c.from.slice(0,4)):null,to:c.point?Number(c.point.slice(0,4)):c.to?Number(c.to.slice(0,4)):null,source:'wikidata',url:`https://www.wikidata.org/wiki/${wd.id}#${c.property}`,note:c.references?'Affermazione con riferimenti in Wikidata.':'Affermazione senza riferimenti bibliografici in Wikidata.'});
  for(const c of claims.filter(c=>!c.from&&!c.to&&!c.point))undated.push({field,value:c.value,source:'wikidata',url:`https://www.wikidata.org/wiki/${wd.id}#${c.property}`});
  if(['population','area'].includes(field)&&!dated.length) {
   const prior=claims.filter(c=>c.point&&Number(c.point.slice(0,4))<=year&&year-Number(c.point.slice(0,4))<=20).sort((a,b)=>b.point.localeCompare(a.point))[0];
   if(prior)rows.push({field,value:prior.value,from:Number(prior.point.slice(0,4)),to:Number(prior.point.slice(0,4)),source:'wikidata',url:`https://www.wikidata.org/wiki/${wd.id}#${field==='population'?'P1082':'P2046'}`,note:'Osservazione storica datata, precedente alla carta; nessuna interpolazione.'});
  }
 }
 for(const c of wd?.claims.filter(c=>c.field==='classification'&&!c.from&&!c.to&&!c.point)||[])undated.push({field:c.field,value:c.value,source:'wikidata'});
 for(const field of ['population','area','capital']) {
  const valid=(sh?.observations||[]).filter(o=>o.field===field&&o.from!=null&&o.to!=null&&o.from<=year&&o.to>=year);
  for(const o of valid)rows.push({...o,source:'seshat',url:`https://www.seshat-db.com/core/polity/${sh.id}`,note:`Stima storica${o.uncertain?' · incerta':''}${o.disputed?' · controversa':''}${o.tag==='IFR'?' · inferita':''}${o.tag==='SSP'?' · sospetta':''}${o.originalRange?' · estremi riordinati dal minimo al massimo':''}`});
  for(const o of sh?.observations.filter(o=>o.field===field&&o.from==null&&o.to==null)||[])undated.push({...o,source:'seshat'});
 }
 const code=entity.code,wb=(!entity.historic&&year>=1960)?bundle.worldbank[code]:null;
 for(const field of ['population','area','density']) {
  const row=numericRow(field,observationAt(wb?.series[field],year,5),'worldbank',({population:'Serie nazionale/territoriale.',area:'Comprende le acque interne; il territorio statistico può differire dalla carta.',density:'Calcolata sulla superficie terrestre, escluse le acque interne.'})[field]);
  if(row) {
   row.url=`https://data.worldbank.org/indicator/${({population:'SP.POP.TOTL',area:'AG.SRF.TOTL.K2',density:'EN.POP.DNST'})[field]}?locations=${encodeURIComponent(wb.iso2)}`;
   // World Bank esatto prioritario; osservazioni anteriori non sostituiscono un dato esatto.
   if(row.from===year)for(let i=rows.length-1;i>=0;i--)if(rows[i].field===field)rows.splice(i,1);
   if(row.from===year||!rows.some(r=>r.field===field))rows.push(row);
  }
 }
 const vd=code?bundle.vdem[code]:null;
 if(wb?.capital&&!rows.some(r=>r.field==='capital'))undated.push({field:'capital',value:wb.capital,source:'worldbank'});
 const regime=observationAt(vd?.rows,year);
 if(regime) {
  rows.push({field:'regime',value:(REGIMES[regime[1]]||'Non classificato')+(regimeUncertain(regime)?' · classificazione incerta':''),from:year,to:year,source:'vdem',note:'Regimes of the World · classificazione annuale V-Dem. Unità di ricerca: '+vd.name+(regimeUncertain(regime)?'. Gli intervalli di confidenza si sovrappongono a una categoria adiacente.':'')});
  if(regime[2]!=null)rows.push({field:'democracy',value:regime[2],from:year,to:year,source:'vdem',note:'Indice di democrazia elettorale: scala 0–1. Stima V-Dem, non percentuale di cittadini.'});
 }
 // Maddison resta una serie territoriale distinta quando l'entità è un impero scomparso.
 const mpd=code?bundle.maddison[code]:null;
 if(!entity.historic&&!rows.some(r=>r.field==='population')) {
  const population=numericRow('population',observationAt(mpd?.rows,year,20),'maddison',bundle.manifest.sources.maddison.note);
  if(population)rows.push(population);
 }
 // Eventuale osservazione Seshat precedente: riportata con il proprio anno, max 50 anni.
 for(const field of ['population','area'])if(!rows.some(r=>r.field===field)) {
  const previous=(sh?.observations||[]).filter(o=>o.field===field&&o.from!=null&&o.to!=null&&o.to<=year&&year-o.to<=50).sort((a,b)=>b.to-a.to)[0];
  if(previous)rows.push({...previous,source:'seshat',url:`https://www.seshat-db.com/core/polity/${sh.id}`,note:`Stima precedente alla carta${previous.uncertain?' · incerta':''}${previous.disputed?' · controversa':''}${previous.tag==='IFR'?' · inferita':''}${previous.tag==='SSP'?' · sospetta':''}${previous.originalRange?' · estremi riordinati dal minimo al massimo':''}`});
 }
 const history=[];
 if(wb?.series.population?.length)history.push({label:'Popolazione · serie World Bank',source:'worldbank',rows:wb.series.population});
 if(mpd?.rows.length)history.push({label:`Popolazione · territorio statistico ${mpd.name} (Maddison)`,source:'maddison',rows:mpd.rows,references:mpd.references||[]});
 if(vd?.rows.length)history.push({label:'Regime politico · serie V-Dem',source:'vdem',rows:vd.rows.filter(r=>r[1]!=null).map(r=>[r[0],REGIMES[r[1]]+(regimeUncertain(r)?' · incerta':'')]),minimum:wd?.from,maximum:wd?.to});
 if(sh)for(const field of ['population','area'])history.push({label:`${LABELS[field]} · ${sh.name} (Seshat)`,source:'seshat',rows:sh.observations.filter(o=>o.field===field&&o.from!=null).map(o=>[o.from,o.upper!=null&&o.upper!==o.value?`${formatNumber(o.value)} – ${formatNumber(o.upper)}`:formatNumber(o.value)])});
 const sources=[...new Set([...rows,...undated,...history].map(r=>r.source))];
 return {year,entity,rows,undated,history,sources,errors:bundle.errors||[],manifest:bundle.manifest};
}
const formatNumber=value=>typeof value==='number'?new Intl.NumberFormat('it-IT',{maximumFractionDigits:2}).format(value):String(value);
function valueText(row) {
 let value=formatNumber(row.value);
 if(row.upper!=null&&row.upper!==row.value)value+=` – ${formatNumber(row.upper)}`;
 return value+(({area:' km²',density:' ab./km²',population:' abitanti'})[row.field]||'');
}
function periodText(row) {
 if(row.from==null&&row.to==null)return 'Datazione non indicata';
 if(row.from===row.to)return formatYear(row.from);
 return `${row.from==null?'Inizio non indicato':formatYear(row.from)} – ${row.to==null?'Fine non indicata':formatYear(row.to)}`;
}
const link=(url,text)=>`<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)} ↗</a>`;
function historyRows(series,profile) {
 // Una tabella consultabile conserva i buchi originali; non inventa traiettorie continue.
 return series.rows.filter(r=>(series.minimum==null||r[0]>=series.minimum)&&(series.maximum==null||r[0]<=series.maximum)).sort((a,b)=>a[0]-b[0]);
}
export function renderCountryProfile(profile) {
 if(!profile.entity)return `<section class="nation-facts"><h4>Dati della nazione · ${escapeHtml(formatYear(profile.year))}</h4><p>Nessuna corrispondenza verificata per questo territorio e periodo negli archivi integrati.</p>${profile.errors.length?'<p>Alcuni archivi non sono disponibili: riapri la scheda per riprovare.</p>':''}</section>`;
 const p=profile,s=p.manifest.sources;
 const rowHtml=r=>`<div class="nation-fact"><dt>${escapeHtml(LABELS[r.field])}</dt><dd><strong>${escapeHtml(valueText(r))}</strong><small>${escapeHtml(periodText(r))} · ${link(r.url||s[r.source].url,s[r.source].name)}</small>${r.from!=null&&r.to!=null&&r.to<p.year?'<small class="nation-data-warning">Osservazione precedente all’anno della carta</small>':''}${r.note?`<small>${escapeHtml(r.note)}</small>`:''}${r.references?.length?`<details><summary>Riferimenti della stima</summary><p>${escapeHtml(r.references.join('; '))}</p></details>`:''}</dd></div>`;
 const missing=['government','structure','population','area','regime'].filter(field=>!p.rows.some(r=>r.field===field));
 const undated=p.undated.filter((r,i,list)=>list.findIndex(x=>x.field===r.field&&x.value===r.value&&x.source===r.source)===i);
 return `<section class="nation-facts"><h4>${escapeHtml(p.entity.name)} · dati per ${escapeHtml(formatYear(p.year))}</h4><dl>${p.rows.map(rowHtml).join('')}</dl>${missing.length?`<p class="nation-symbol-note">Non documentato per questa data: ${missing.map(f=>escapeHtml(LABELS[f].toLowerCase())).join(', ')}.</p>`:''}${undated.length?`<details class="nation-undated"><summary>Informazioni senza datazione (${undated.length})</summary><p>Queste informazioni sono associate all’entità dalla fonte, ma non certificano la situazione nell’anno della carta.</p><dl>${undated.map(rowHtml).join('')}</dl></details>`:''}${p.history.some(h=>historyRows(h,p).length)?`<details class="nation-history"><summary>Evoluzione nel tempo</summary><p>Osservazioni originali, senza interpolazione. Le serie territoriali possono avere un perimetro diverso dall’entità della carta.</p>${p.history.map(h=>{const list=historyRows(h,p);if(!list.length)return '';return `<details><summary>${escapeHtml(h.label)}</summary><div class="nation-series-scroll" tabindex="0" aria-label="Serie storica"><table><thead><tr><th>Anno</th><th>Valore</th></tr></thead><tbody>${list.map(([year,value])=>`<tr${year===p.year?' class="nation-current-year"':''}><td>${escapeHtml(formatYear(year))}</td><td>${escapeHtml(formatNumber(value))}</td></tr>`).join('')}</tbody></table></div>${h.references?.length?`<details><summary>Fonti originali Maddison</summary>${h.references.map(r=>`<p>${escapeHtml(r.period)}: ${escapeHtml(r.citation)}</p>`).join('')}</details>`:''}</details>`;}).join('')}</details>`:''}<details class="nation-data-sources"><summary>Fonti, licenze e aggiornamento</summary><p>Copie locali: ${escapeHtml(p.manifest.generated.slice(0,10))}. I valori seguono l’anno dei confini mostrati. Gli indicatori annuali non descrivono ogni cambiamento avvenuto nel corso dell’anno.</p>${p.sources.map(key=>`<p>${link(s[key].url,s[key].name)} · ${link(s[key].licenseUrl,s[key].license)}<br>${escapeHtml(s[key].citation)}<br>${escapeHtml(s[key].note)}</p>`).join('')}</details>${p.errors.length?'<p class="nation-data-warning">Alcuni archivi non disponibili: dati parziali. Riapri la scheda per riprovare.</p>':''}</section>`;
}
