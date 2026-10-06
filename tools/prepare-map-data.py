"""Prepara copie web riproducibili dei dataset; conserva periodi e provenienza.
Eseguire dopo download-map-data.mjs. Non richiede pacchetti esterni.
"""
import csv
import gzip
import hashlib
import io
import json
import math
import re
import zipfile
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / '.data-cache'
OUT = ROOT / 'data'
OUT.mkdir(exist_ok=True)

def save(name, data):
    path = OUT / name
    text = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    path.write_text(text + '\n', encoding='utf-8')
    if name.endswith('.geojson'):
        packed = gzip.compress((text + '\n').encode('utf-8'), compresslevel=9, mtime=0)
        (OUT / (name + '.gz')).write_bytes(packed)
        print(f'  Download compresso: {len(packed)} bytes')
    print(f'{name}: {len(data.get("features", []))} elementi, {len(text.encode("utf-8"))} bytes')

def coords(values):
    if isinstance(values, list):
        return [coords(value) for value in values]
    return round(values, 6) if isinstance(values, float) else values

def geometry(feature):
    return {'type': feature['geometry']['type'], 'coordinates': coords(feature['geometry']['coordinates'])}

def collection(features):
    return {'type': 'FeatureCollection', 'features': features}

world = json.loads((CACHE / 'cshapes-world.geojson').read_text(encoding='utf-8'))
world_features = []
for feature in world['features']:
    p = feature['properties']
    start = f"{p['gwsyear']:04d}-{p['gwsmonth']:02d}-{p['gwsday']:02d}"
    end = f"{p['gweyear']:04d}-{p['gwemonth']:02d}-{p['gweday']:02d}"
    world_features.append({'type': 'Feature', 'geometry': geometry(feature), 'properties': {
        'NAME': p['cntry_name'], 'start': start, 'end': end, 'code': p['gwcode'],
        'capital': p.get('capname'), 'source': 'cshapes-world'
    }})
blocks = []
for start, end in [(1886, 1919), (1920, 1949), (1950, 1979), (1980, 1999), (2000, 2019)]:
    filename = f'cshapes-{start}-{end}.geojson'
    save(filename, collection([f for f in world_features if f['properties']['start'] <= f'{end}-12-31' and f['properties']['end'] >= f'{start}-01-01']))
    blocks.append({'start': start, 'end': end, 'file': filename + '.gz'})

europe = json.loads((CACHE / 'cshapes-europe.geojson').read_text(encoding='utf-8'))
save('cshapes-europe.geojson', collection([{
    'type': 'Feature', 'geometry': geometry(f), 'properties': {
        'NAME': f['properties']['Name'], 'from': f['properties']['From'], 'to': f['properties']['To'],
        'capital': f['properties'].get('Capital'), 'status': f['properties'].get('Status'), 'source': 'cshapes-europe'
    }
} for f in europe['features'] if f['properties']['To'] >= 1816]))

dare = json.loads((CACHE / 'dare-places.geojson').read_text(encoding='utf-8'))
save('dare-places.geojson', collection([{
    'type': 'Feature', 'geometry': geometry(f), 'properties': {
        'name': f['properties'].get('ancient') or f['properties'].get('name'),
        'modernName': f['properties'].get('name'), 'kind': f['properties'].get('type'),
        'id': str(f['properties']['id']), 'precision': f['properties'].get('precision'),
        'url': 'https://imperium.ahlfeldt.se/api/geojson.php?id=' + str(f['properties']['id'])
    }
} for f in dare['features']]))

with zipfile.ZipFile(CACHE / 'pleiades-gis.zip') as archive:
    def rows(filename):
        return csv.DictReader(io.StringIO(archive.read('data/gis/' + filename).decode('utf-8-sig')))
    types = defaultdict(set)
    for row in rows('places_place_types.csv'):
        types[row['place_id']].add(row['place_type'])
    places = {r['id']: r for r in rows('places.csv')}
    features = []
    selected_types = {'settlement', 'settlement-modern', 'city', 'town', 'village', 'urban', 'fort', 'fortress', 'port', 'station', 'military-installation'}
    for row in rows('location_points.csv'):
        place = places.get(row['place_id'])
        if not place or not (types[row['place_id']] & selected_types):
            continue
        if row.get('association_certainty') != 'certain' or row.get('location_precision') != 'precise':
            continue
        numbers = re.findall(r'[-+]?\d+(?:\.\d+)?', row['geometry_wkt'])
        if len(numbers) != 2:
            continue
        lon, lat = map(float, numbers)
        if not (-15 <= lon <= 70 and 20 <= lat <= 60):
            continue
        try:
            start, end = int(row['year_after_which']), int(row['year_before_which'])
        except (ValueError, KeyError):
            continue
        if start > end or end < -800 or start > 700:
            continue
        accuracy = float(row['accuracy_radius']) if row.get('accuracy_radius') else None
        features.append({'type': 'Feature', 'geometry': {'type': 'Point', 'coordinates': [round(lon, 6), round(lat, 6)]}, 'properties': {
            'id': place['id'], 'name': place['title'], 'from': start, 'to': end,
            'kind': ', '.join(sorted(types[place['id']])), 'accuracy': accuracy,
            'url': place['uri'], 'locationUrl': row['uri']
        }})
    features.sort(key=lambda f: (f['properties']['accuracy'] is None, f['properties']['accuracy'] or 0))
    save('pleiades-places.geojson', collection(features))

sources = {
    'historical': {'name': 'Historical Basemaps · Alexandre Ourednik e collaboratori', 'url': 'https://github.com/aourednik/historical-basemaps', 'license': 'GPL-3.0', 'licenseUrl': 'https://github.com/aourednik/historical-basemaps/blob/master/LICENSE'},
    'cshapes-world': {'name': 'CShapes 2.0 · ETH Zürich', 'url': 'https://icr.ethz.ch/data/cshapes/', 'license': 'CC BY-NC-SA 4.0', 'licenseUrl': 'https://creativecommons.org/licenses/by-nc-sa/4.0/', 'coverage': [1886, 2019], 'blocks': blocks, 'citation': 'Schvitz et al. (2022), Mapping The International System, 1886–2017: The CShapes 2.0 Dataset, Journal of Conflict Resolution 66(1): 144–61.'},
    'cshapes-europe': {'name': 'CShapes-Europe · ETH Zürich', 'url': 'https://icr.ethz.ch/data/cshapes/', 'license': 'CC BY-NC-SA 4.0', 'licenseUrl': 'https://creativecommons.org/licenses/by-nc-sa/4.0/', 'coverage': [1816, max(f['properties']['To'] for f in europe['features'])], 'citation': 'Cederman, Girardin, Müller-Crepon e Pengl (2025), Nationalism and the Transformation of the State: Border Change and Political Violence in the Modern World, Cambridge University Press.'},
    'pleiades': {'name': 'Pleiades · AWMC / ISAW e contributori', 'url': 'https://pleiades.stoa.org/downloads', 'license': 'CC BY 3.0', 'licenseUrl': 'https://creativecommons.org/licenses/by/3.0/', 'download': 'https://atlantides.org/downloads/pleiades/gis/pleiades_gis_data.zip'},
    'dare': {'name': 'DARE · Johan Åhlfeldt e contributori', 'url': 'https://imperium.ahlfeldt.se/print.php?doc=info_api', 'license': 'CC BY-SA 3.0', 'licenseUrl': 'https://creativecommons.org/licenses/by-sa/3.0/', 'download': 'https://imperium.ahlfeldt.se/api/geojson.php?bbox=-15,20,70,60&zoom=6'}
}
manifest = {'preparedAt': datetime.now(timezone.utc).isoformat(), 'sources': sources, 'files': {}}
for path in sorted(OUT.glob('*.geojson.gz')):
    raw = path.read_bytes()
    manifest['files'][path.name] = {'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest()}
save('manifest.json', manifest)
