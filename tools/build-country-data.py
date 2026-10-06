"""Riduce i download ufficiali in copie gzip, senza interpolare osservazioni.
Prerequisiti: pandas, openpyxl; download-country-data.mjs e download-country-labels.mjs.
V-Dem: convertire vdem.RData con pyreadr nei cinque campi di vdem-reduced.csv.
"""
from pathlib import Path
import json,gzip,hashlib,re
from datetime import datetime,timezone
import pandas as pd
root=Path(__file__).resolve().parents[1]
cache=root/'.data-cache'; out=root/'data'
load=lambda f:json.loads((cache/f).read_text(encoding='utf-8'))
manifest={'generated':datetime.now(timezone.utc).isoformat(),'files':{},'normalizedRanges':[]}
def save(name,data):
 raw=json.dumps(data,ensure_ascii=False,separators=(',',':'),allow_nan=False).encode()
 compressed=gzip.compress(raw,mtime=0)
 (out/name).write_bytes(compressed)
 manifest['files'][name]={'sha256':hashlib.sha256(compressed).hexdigest(),'bytes':len(compressed)}
 print(name,len(compressed))
def number(v):
 return None if pd.isna(v) else (int(v) if float(v).is_integer() else round(float(v),4))
# World Bank: aggregati regionali esclusi; nessun riempimento di buchi.
wb={c['id']:{'name':c['name'],'iso2':c['iso2Code'],'aliases':[c['name']],'capital':c['capitalCity'],'series':{}} for c in load('wb-countries.json')[1] if c['region']['id']!='NA'}
for indicator,field in [('SP.POP.TOTL','population'),('AG.SRF.TOTL.K2','area'),('EN.POP.DNST','density')]:
 for row in load(f'wb-{indicator}.json'):
  code=row['countryiso3code']
  if code in wb and row['value'] is not None:
   wb[code]['series'].setdefault(field,[]).append([int(row['date']),number(row['value'])])
for record in wb.values():
 for rows in record['series'].values():rows.sort()
save('country-worldbank.json.gz',wb)
# V-Dem: Regimes of the World, classificazione annuale e indice democrazia elettorale.
vd={}
for row in pd.read_csv(cache/'vdem-reduced.csv').to_dict('records'):
 vd.setdefault(row['country_text_id'],{'name':row['country_name'],'rows':[]})['rows'].append([int(row['year']),number(row['v2x_regime']),number(row['v2x_polyarchy']),number(row['v2x_regime_amb'])])
for record in vd.values():record['rows'].sort()
save('country-vdem.json.gz',vd)
# Maddison: popolazione in migliaia nel file originale; conversione in abitanti.
mpd={}
for row in pd.read_excel(cache/'maddison.xlsx',sheet_name='Full data').to_dict('records'):
 if not pd.isna(row['pop']):mpd.setdefault(row['countrycode'],{'name':row['country'],'rows':[]})['rows'].append([int(row['year']),round(row['pop']*1000)])
for sheet in ['Sources','Maddison original sources']:
 sources=pd.read_excel(cache/'maddison.xlsx',sheet_name=sheet,header=None).fillna('')
 current=None
 for row in sources.itertuples(index=False,name=None):
  code=str(row[0]).strip()
  if code in mpd:current=code
  if current and row[2]:mpd[current].setdefault('references',[]).append({'period':str(row[1]),'citation':str(row[2])})
for record in mpd.values():record['rows'].sort()
save('country-maddison.json.gz',mpd)
# Seshat: solo osservazioni numeriche pubbliche; tag UND e valori nulli esclusi.
sh={}
for field,file,key in [('population','population','polity_population'),('area','area','polity_territory'),('capital','capitals','capital')]:
 for row in load(f'seshat-{file}-all.json'):
  if row['tag']=='UND':continue
  p=row['polity'];slug=p['name']
  lo=row.get(key+'_from') if field!='capital' else row.get(key)
  hi=row.get(key+'_to') if field!='capital' else None
  if lo is None:continue
  raw_range=None
  if field!='capital' and hi is not None and hi<lo:
   raw_range=[lo,hi];lo,hi=hi,lo
   manifest['normalizedRanges'].append({'source':'seshat','field':field,'id':row['id'],'polity':slug,'original':raw_range})
  record=sh.setdefault(slug,{'id':p['id'],'name':p['long_name'],'from':p['start_year'],'to':p['end_year'],'aliases':[p['long_name']],'observations':[]})
  description=row.get('description') or ''
  refs=[re.sub('<[^>]+>',' ',r).strip() for r in re.findall('§REF§(.*?)§REF§',description,re.S)]
  record['observations'].append({'field':field,'value':lo,'upper':hi,'from':row['year_from'],'to':row['year_to'],'tag':row['tag'],'uncertain':row['is_uncertain'],'disputed':row['is_disputed'],'references':refs,**({'originalRange':raw_range} if raw_range else {})})
# Alias espliciti di intere entità, mai di province/campioni regionali.
for slug,r in sh.items():
 if slug.startswith('it_roman_rep_'):r['aliases']+=['Roman Republic','Repubblica romana']
 if slug in ['it_roman_principate','tr_roman_dominate']:r['aliases']+=['Roman Empire','Impero romano','Rome']
 if slug=='it_roman_k':r['aliases']+=['Roman Kingdom','Regno di Roma']
 if slug=='tr_east_roman_emp':r['aliases']+=['Eastern Roman Empire','Byzantine Empire']
 if re.fullmatch(r'tr_ottoman_emp_[1-4]',slug):r['aliases']+=['Ottoman Empire','Ottoman']
 if re.fullmatch(r'ru_romanov_dyn_[12]',slug):r['aliases']+=['Russian Empire']
 if slug in ['gb_british_emp_1','gb_british_emp_2']:r['aliases']+=['British Empire']
 if slug in ['eg_dynasty_1','eg_dynasty_2','eg_old_k_1','eg_old_k_2','eg_middle_k','eg_new_k_1','eg_new_k_2','eg_saite','eg_kushite']:r['aliases']+=['Egypt','Ancient Egypt','Egyptian Empire']
save('country-seshat.json.gz',sh)
# Wikidata: preserva qualificatori temporali e riferimenti delle affermazioni.
entities=load('symbol-entities.json')['entities'];labels=load('country-labels.json')
definitions=json.loads((out/'symbols.json').read_text(encoding='utf-8'))['records']
def time(q,p):
 value=q.get(p,[{}])[0].get('datavalue',{}).get('value',{}).get('time')
 if not value:return None
 match=re.match(r'([+-]\d+)-(\d+)-(\d+)',value)
 y,m,d=match.groups();return f'{int(y):04d}-{max(1,int(m)):02d}-{max(1,int(d)):02d}'
wd={}
territory={'Q179164','Q43702','Q170156','Q512187','Q1093720','Q107390'}
government={'Q41614','Q184558','Q7269','Q2994894','Q12759805','Q4198907','Q3330103','Q49890','Q7270','Q49892','Q512187','Q849242','Q1520223','Q5255892','Q166747','Q465613','Q5440547','Q4446300','Q3043547'}
for definition in definitions:
 e=entities[definition['id']];r={k:definition[k] for k in ['id','name','from','to','aliases']};r['claims']=[]
 for prop,key,yearkey in [('P571','startDate','from'),('P576','endDate','to')]:
  dates=[time({prop:[c['mainsnak']]},prop) for c in e['claims'].get(prop,[]) if c['rank']!='deprecated']
  dates=[d for d in dates if d and int(d[:4])==r[yearkey]]
  if len(set(dates))==1:r[key]=dates[0]
 for property,field in [('P122','government'),('P31','structure'),('P36','capital'),('P1082','population'),('P2046','area')]:
  for claim in e['claims'].get(property,[]):
   if claim['rank']=='deprecated' or 'datavalue' not in claim['mainsnak']:continue
   v=claim['mainsnak']['datavalue']['value'];q=claim.get('qualifiers',{});item=v.get('id') if isinstance(v,dict) else None
   target=field
   if property=='P31' and item not in territory:continue
   if item:
    label=labels.get(item,{}).get('labels',{})
    v=label.get('it',label.get('en',{})).get('value',item)
    if item in territory:target='structure'
    elif property=='P122' and item not in government:target='classification'
   elif isinstance(v,dict) and 'amount' in v:
    if field=='area' and v['unit']!='http://www.wikidata.org/entity/Q712226':continue
    v=float(v['amount'])
   else:continue
   # Qualificatori di territorio/sottopopolazione: conservati come avviso, mai aggregati.
   restricted=any(p in q for p in ['P518','P1011','P1012'])
   r['claims'].append({'field':target,'property':property,'value':v,'from':time(q,'P580'),'to':time(q,'P582'),'point':time(q,'P585'),'statement':claim['id'],'rank':claim['rank'],'restricted':restricted,'references':len(claim.get('references',[]))})
 wd[r['id']]=r
save('country-wikidata.json.gz',wd)
# Copertura verificabile e citazioni consultabili nell'app.
manifest['coverage']={'worldbank':len(wb),'vdem':len(vd),'maddison':len(mpd),'seshat':len(sh),'wikidata':len(wd)}
manifest['sources']={
 'worldbank':{'name':'World Bank · WDI','url':'https://data.worldbank.org/','license':'CC BY 4.0','licenseUrl':'https://creativecommons.org/licenses/by/4.0/','citation':'World Bank, World Development Indicators. SP.POP.TOTL; AG.SRF.TOTL.K2; EN.POP.DNST.','note':'Serie nazionali/territoriali: il perimetro statistico può differire dai confini cartografici. Densità riferita alla superficie terrestre; superficie totale comprensiva delle acque interne.'},
 'vdem':{'name':'V-Dem v16 · Regimes of the World','url':'https://v-dem.net/data/the-v-dem-dataset/','license':'CC BY-SA 4.0','licenseUrl':'https://creativecommons.org/licenses/by-sa/4.0/','citation':'Coppedge et al. (2026), V-Dem Country-Year Dataset v16. DOI: 10.23696/vdemds26. Classificazione v2x_regime, incertezza v2x_regime_amb; indice v2x_polyarchy.','note':'Classificazione di ricerca annuale: non descrive la forma costituzionale di governo. Le unità paese possono includere periodi coloniali e predecessori.'},
 'maddison':{'name':'Maddison Project 2023','url':'https://doi.org/10.34894/INZBF2','license':'CC BY 4.0','licenseUrl':'https://creativecommons.org/licenses/by/4.0/','citation':'Bolt, Jutta e Jan Luiten van Zanden (2024), Maddison style estimates of the evolution of the world economy: A new 2023 update, Journal of Economic Surveys. DOI: 10.1111/joes.12618.','note':'Popolazioni di serie nazionali ricostruite: non rappresentano automaticamente l’intera popolazione di un impero storico. Unità originali: migliaia di abitanti, convertite in abitanti. Le fonti originali sono riportate per paese.'},
 'seshat':{'name':'Seshat Global History Databank','url':'https://www.seshat-db.com/variable-hierarchy/','license':'CC BY-SA 4.0','licenseUrl':'https://creativecommons.org/licenses/by-sa/4.0/','citation':'Seshat Global History Databank, dati pubblici: Polity population, Polity territory, Polity capital.','note':'Stime riferite alle entità Seshat, con intervalli, tag di inferenza e incertezza conservati; nessuna interpolazione tra osservazioni.'},
 'wikidata':{'name':'Wikidata','url':'https://www.wikidata.org/','license':'CC0','licenseUrl':'https://creativecommons.org/publicdomain/zero/1.0/','citation':'Wikidata e contributori: P122, P31, P36, P1082, P2046.','note':'Le affermazioni senza qualificatori temporali sono mostrate separatamente: non certificano la situazione nell’anno della carta.'}}
(out/'country-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print(manifest['coverage'])
