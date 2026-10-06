# Atlante Geostorico Interattivo

App web statica per esplorare eventi di geostoria su una mappa interattiva con timeline.

## Funzioni

- Mappa Leaflet con confini storici caricati da dataset GeoJSON pubblici.
- Timeline navigabile con mouse, rotellina e touch.
- Pannello evento con descrizione, periodo storico e territori coinvolti.
- Evidenziazione delle potenze/aree storiche collegate all'evento selezionato.
- Tema chiaro/scuro.
- Menu **Livelli e fonti**: confini automatici o fonte selezionata manualmente, con data cartografica distinta dall'anno dell'evento.
- CShapes mondiale (1886–2019) e CShapes-Europe (1816–2023). Automatico sceglie Europa nel 1816–1885 e mondo nel 1886–2019; altrimenti usa Historical Basemaps.
- Pleiades e DARE attivabili nel periodo 800 a.C.–700 d.C., per il Mediterraneo e territori vicini. Pleiades usa gli intervalli di attestazione delle localizzazioni; DARE è un catalogo romano, senza filtro annuale. I punti sono limitati a 1.200 per fonte nella vista corrente: ingrandire per vedere altri luoghi.

## Dati e attribuzioni

Cliccando uno Stato sulla mappa, il popup mostra bandiera e stemma associati a quel territorio e all'anno dei confini, anche se lo Stato non appartiene ai gruppi dell'evento. Le altre varianti e i sigilli si aprono con **Altri simboli e varianti**. Nomi composti come `Italy/Sardinia` sono riconciliati con il catalogo. Quando la fonte non offre un simbolo adatto viene mostrata una nota; i simboli non datati mantengono la segnalazione di incertezza.

Il pannello **Bandiere, stemmi e sigilli** usa un catalogo locale di entità Wikidata (dati CC0) e immagini Wikimedia Commons (licenza propria per ogni file, con autore e link visibili). `data/symbols.json` conserva le associazioni, gli intervalli dei simboli, i riferimenti alle dichiarazioni Wikidata e i crediti. Non è un repertorio completo di tutte le civiltà. Il catalogo è aggiornabile con `node tools/download-symbols.mjs --refresh` e verificabile con `node --test tests/symbols.test.mjs`. Senza `--refresh` vengono riutilizzate le dichiarazioni Wikidata già scaricate nella cache locale.

Le associazioni ai territori sono curate e limitate al periodo dello Stato; i simboli seguono i qualificatori temporali Wikidata o, quando mancanti, gli intervalli espliciti nel titolo del file Commons. Le immagini prive di data sono segnalate. Per Stati ancora esistenti, queste immagini non datate vengono mostrate solo negli eventi dal 2000 in poi, per evitare di proiettare varianti moderne su epoche precedenti. Immagini qualificate come fittizie sono escluse. Le date sono filtrate per anno e possono mostrare più varianti in un anno di transizione. Le immagini vengono caricate da Wikimedia solo alla visualizzazione; i metadati non dipendono da richieste live alle API.

Le copie locali compresse e le relative licenze sono documentate in [data/README.md](data/README.md) e [data/manifest.json](data/manifest.json). CShapes ha licenza **CC BY-NC-SA 4.0**, quindi i suoi dati non sono destinati a uso commerciale senza ulteriore autorizzazione. La fonte e la licenza sono visibili nell'app.

CShapes descrive confini politici riconosciuti, non l'avanzamento degli eserciti o le occupazioni temporanee. Per eventi che indicano solo l'anno, il mondo viene visualizzato al **1° gennaio**; aggiungere `mapDate: '1914-08-01'` a un evento per una data diversa nello stesso anno. CShapes-Europe è annuale. Historical Basemaps usa l'istantanea disponibile più vicina e indica esplicitamente il suo anno.

Per rigenerare le copie locali dalle fonti ufficiali:

```powershell
node tools/download-map-data.mjs
python tools/prepare-map-data.py
```

Per controllare scelta delle fonti, date, dati compressi e ripiego su Historical Basemaps:

```powershell
node --test tests/sources.test.mjs
```

## Avvio locale

Apri `index.html` con un piccolo server locale. Su Windows puoi usare:

```powershell
.\run-server.ps1
```

In alternativa:

```powershell
python -m http.server 4174
```

Poi apri `http://localhost:4174/`.

## Note

L'app non richiede database e non salva dati utente. Per visualizzare mappa e confini storici serve connessione internet, perché usa CDN e dataset remoti.
