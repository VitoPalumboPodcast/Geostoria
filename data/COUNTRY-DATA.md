# Dati associati alle nazioni

Copie ufficiali scaricate il 6 ottobre 2026. `country-manifest.json` registra copertura, citazioni, licenze e SHA-256 delle copie gzip. Il browser carica gli archivi al primo clic su una nazione, li conserva in memoria e non invia richieste alle API esterne. Le date si riferiscono ai confini effettivamente mostrati, non necessariamente all'anno dell'evento quando la carta usa un'istantanea vicina.

| Archivio | Contenuto importato | Licenza della copia derivata |
|---|---|---|
| [Wikidata](https://www.wikidata.org/wiki/Wikidata:Licensing) | 23 entità attuali e storiche del catalogo simboli; P122 (governo), P31 (assetto territoriale selezionato), P36 (capitale), P1082 (popolazione), P2046 (superficie in km²). Qualificatori di validità e riferimenti delle affermazioni conservati. | CC0 |
| [World Bank, WDI](https://data.worldbank.org/) | 217 paesi/territori, aggregati esclusi; SP.POP.TOTL, AG.SRF.TOTL.K2, EN.POP.DNST, 1960–2025 dove disponibili. | CC BY 4.0 |
| [V-Dem Institute](https://v-dem.net/data/the-v-dem-dataset/) | v16, 202 entità di ricerca; 28.092 righe paese/anno, 1789–2025 con copertura variabile; v2x_regime, v2x_regime_amb, v2x_polyarchy. Fonte: repository ufficiale `vdeminstitute/vdemdata`, file `data/vdem.RData`; definizioni dal relativo codebook. | CC BY-SA 4.0 |
| [Maddison Project 2023](https://doi.org/10.34894/INZBF2) | 169 serie nazionali; popolazione in migliaia convertita in abitanti. Riferimenti originali dalle schede Sources e Maddison original sources conservati per paese. | CC BY 4.0 |
| [Seshat Global History Databank](https://www.seshat-db.com/variable-hierarchy/) | 516 entità con almeno una osservazione utilizzabile delle API pubbliche Polity population, Polity territory, Polity capital. Valori sconosciuti esclusi; intervalli, controversie, inferenze e riferimenti bibliografici conservati. | CC BY-SA 4.0, [termini per i dati pubblici](https://www.seshat-db.com/signup/) |

Le licenze riguardano i rispettivi dati derivati: non sono fuse in un unico dataset sotto una licenza differente. I simboli Commons conservano le proprie licenze e attribuzioni. Le fonti sono consultabili anche nella scheda, con i riferimenti originali delle stime Seshat e delle serie Maddison. Citazione Maddison: Bolt e van Zanden (2024), *Maddison style estimates of the evolution of the world economy: A new 2023 update*, DOI 10.1111/joes.12618. Citazione V-Dem: Coppedge et al. (2026), *V-Dem Country-Year Dataset v16*, DOI 10.23696/vdemds26.

## Associazione e selezione temporale

- Corrispondenza tramite nomi normalizzati e alias espliciti, non tramite somiglianza o sottostringhe. Nessuna scelta tra più corrispondenze Seshat sovrapposte.
- Le identità Wikidata sono limitate ai rispettivi intervalli. Per il 1946 italiano la data completa distingue Regno e Repubblica. I qualificatori Wikidata datati seguono anche il mese/giorno quando disponibile; la conversione dei qualificatori meno precisi rimane annuale.
- World Bank è abilitato solo dal 1960 e per identità non classificate come imperi/Stati scomparsi nel catalogo. Un valore esatto ha precedenza sugli altri dati numerici; un'osservazione precedente può essere mostrata entro cinque anni, con anno e avviso espliciti.
- V-Dem è usato solo per l'anno esatto. Il regime è una classificazione di ricerca, distinta dalla forma costituzionale di governo. I codici 1, 2, 4, 5, 7, 8 di v2x_regime_amb indicano sovrapposizione con categorie adiacenti e sono segnalati come incerti. Le unità di ricerca possono attraversare cambiamenti istituzionali, periodi coloniali e predecessori.
- Le corrispondenze esplicite V-Dem per entità storiche includono Germania/Impero Tedesco, Italia/Regno d'Italia, Russia/Impero Russo e URSS, Turchia/Impero Ottomano. La popolazione World Bank della Russia non viene attribuita all'URSS.
- Maddison può integrare la popolazione di un'entità non storica se manca un dato esatto, con un'osservazione precedente entro vent'anni. Per gli Stati scomparsi rimane una serie territoriale separata nella sezione Evoluzione: non è presentato come totale demografico dell'impero.
- Seshat usa le osservazioni che contengono l'anno scelto oppure l'ultima precedente entro cinquanta anni, segnalata come tale. Gli alias generici per Roma e l'Egitto sono limitati a fasi specifiche, senza scegliere una fase se ce ne sono più di una compatibile.
- Sette intervalli numerici Seshat hanno estremi invertiti: l'app li ordina dal minimo al massimo senza cambiare i valori. `originalRange` conserva l'ordine della fonte e `normalizedRanges` nel manifest registra i record trasformati; la scheda segnala la trasformazione.
- Le quantità Wikidata con qualificatori territoriali/sottopopolazioni non vengono aggregate; le osservazioni precedenti sono ammesse entro vent'anni e riportano il proprio anno. Le affermazioni senza date sono in una sezione separata e non sono certificate per l'anno cartografico.
- La densità World Bank usa la superficie terrestre: non coincide necessariamente con popolazione divisa per superficie totale comprensiva delle acque interne.

La copertura cartografica, le identità politiche e i territori statistici non sono intercambiabili. I dati mancanti sono dichiarati; nessun valore viene interpolato o preso dal futuro. Le tabelle Evoluzione possono mostrare anni successivi all'anno della carta come serie consultabile, senza usarli nella scheda annuale. Un errore di caricamento di un archivio non nasconde gli altri; la scheda segnala dati parziali e permette di riprovare riaprendola.

## Aggiornamento

Runtime Node.js e Python con pandas/openpyxl; pyreadr per il formato ufficiale V-Dem. Download originali e pacchetti di conversione in `.data-cache/`, esclusa da Git. I download usano una cache: per aggiornare una fonte spostare fuori da `.data-cache` i suoi file prima di eseguire il relativo script.

```powershell
node tools/download-country-data.mjs
node tools/download-country-labels.mjs
python tools/convert-country-vdem.py
python tools/build-country-data.py
node --test tests/*.test.mjs
```

Wikidata usa la copia delle entità salvata da `tools/download-symbols.mjs`: aggiornarla con `--refresh` prima di rigenerare le etichette. Modificare il parametro di versione in country-data.js dopo una nuova pubblicazione, così il browser carica le copie aggiornate.
