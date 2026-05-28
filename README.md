# Atlante Geostorico Interattivo

App web statica per esplorare eventi di geostoria su una mappa interattiva con timeline.

## Funzioni

- Mappa Leaflet con confini storici caricati da dataset GeoJSON pubblici.
- Timeline navigabile con mouse, rotellina e touch.
- Pannello evento con descrizione, periodo storico e territori coinvolti.
- Evidenziazione delle potenze/aree storiche collegate all'evento selezionato.
- Tema chiaro/scuro.

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
