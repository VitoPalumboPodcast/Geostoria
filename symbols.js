import {escapeHtml} from './sources.js?v=20261006-layers1';
const KINDS = {flag:'Bandiera',arms:'Stemma',seal:'Sigillo'};
let catalog;
export function selectSymbols(records,event) {
 const countries=new Set((event.groups||[]).flatMap(g=>g.countries||[]).concat(event.involvedCountries||[]));
 const matched=records.filter(r=>event.year>=r.from && event.year<=r.to && r.aliases.some(a=>countries.has(a)));
 return matched.filter(r=>r.aliases.some(alias=>countries.has(alias) && !matched.some(other=>other.from>r.from && other.aliases.includes(alias)))).map(record=>({
  ...record, assets:record.assets.filter(a=> (a.from==null || event.year>=a.from) && (a.to==null || event.year<=a.to)
   // Per uno Stato ancora esistente, non proietta immagini non datate su epoche precedenti.
   && (a.from!=null || a.to!=null || record.to<9999 || event.year>=2000)).filter((a,index,list)=>list.findIndex(other=>other.kind===a.kind && other.file===a.file)===index)
 })).filter(r=>r.assets.length);
}
const safeUrl = url => /^https:\/\/(upload\.wikimedia\.org|thumb\.wikimedia\.org|commons\.wikimedia\.org|creativecommons\.org|www\.wikidata\.org)\//.test(url||'') ? url : '';
export function renderSymbolCards(records) {
 return records.map(record=>`<article class="symbol-country"><h4><a href="https://www.wikidata.org/wiki/${escapeHtml(record.id)}" target="_blank" rel="noopener noreferrer">${escapeHtml(record.name)} ↗</a></h4><div class="symbol-images">${record.assets.map(asset=>{
  const period = asset.from!=null || asset.to!=null ? `${asset.from??'Inizio non indicato'} – ${asset.to??'Fine non indicata'}` : 'Datazione non indicata nella fonte';
  return `<figure><a href="${escapeHtml(safeUrl(asset.page))}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(safeUrl(asset.url))}" alt="${KINDS[asset.kind]||'Simbolo'}: ${escapeHtml(record.name)}" loading="lazy" decoding="async" width="110" height="70"></a><figcaption><strong>${KINDS[asset.kind]||'Simbolo'}</strong><br>${escapeHtml(period)}<br><span class="symbol-artist">${escapeHtml(asset.artist||'Autore indicato nella scheda Commons')}</span><br><a href="${escapeHtml(safeUrl(asset.page))}" target="_blank" rel="noopener noreferrer">Commons ↗</a> · <a href="${escapeHtml(safeUrl(asset.licenseUrl)||safeUrl(asset.page))}" target="_blank" rel="noopener noreferrer">${escapeHtml(asset.license)}</a></figcaption></figure>`;
 }).join('')}</div></article>`).join('');
}
export function createSymbolsPanel(panel) {
 let version=0;
 return async event=>{
  const request=++version;
  panel.textContent='Caricamento del catalogo…';
  try {
   if(!catalog) {
    catalog=fetch('./data/symbols.json?v=20261006-symbols1',{signal:AbortSignal.timeout(15000)}).then(async r=>{
     if(!r.ok) throw new Error('Catalogo non disponibile');
     const data=await r.json(); if(!Array.isArray(data.records))throw new Error('Catalogo non valido');return data;
    });
    catalog.catch(()=>{catalog=null;});
   }
   const data=await catalog;
   if(request!==version)return;
   const records=selectSymbols(data.records,event);
   panel.innerHTML=records.length ? renderSymbolCards(records) : '<p class="source-note">Nessun simbolo con associazione adatta a questo periodo nel catalogo integrato. Per le civiltà antiche non vengono mostrate bandiere moderne.</p>';
   panel.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{
    const text=document.createElement('span');text.className='symbol-image-error';text.textContent='Immagine non disponibile: apri la scheda Commons';img.replaceWith(text);
   },{once:true}));
   panel.dataset.eventId=event.id;
  } catch(error) {if(request===version)panel.textContent='Catalogo non disponibile. Cambia evento per riprovare.';console.warn(error);}
 };
}
