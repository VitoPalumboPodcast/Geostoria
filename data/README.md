# Copie dei dati cartografici

Scaricate dalle fonti ufficiali il 6 ottobre 2026. `manifest.json` registra URL, conteggi, intervalli e SHA-256 delle copie gzip. I file gzip sono caricati solo quando si seleziona un periodo o si attiva un livello; il browser li decomprime. I GeoJSON non compressi e i download originali restano esclusi da Git.

| Fonte | Copertura in questa app | Licenza |
|---|---|---|
| [CShapes 2.0, ETH Zürich](https://icr.ethz.ch/data/cshapes/) | Mondo, 1886–2019, date di inizio/fine per confine | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) |
| [CShapes-Europe, ETH Zürich](https://icr.ethz.ch/data/cshapes/) | Europa, 1816–2023, intervalli annuali | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) |
| [Pleiades, AWMC/ISAW e contributori](https://pleiades.stoa.org/downloads) | Localizzazioni certe e precise di insediamenti, porti e siti militari; longitudine −15–70, latitudine 20–60; attestazioni sovrapposte a 800 a.C.–700 d.C. | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) |
| [DARE, Johan Åhlfeldt e contributori](https://imperium.ahlfeldt.se/print.php?doc=info_api) | Città e fortezze legionarie ottenute con zoom=6 nella stessa regione; richieste suddivise per evitare il limite di 500 risultati | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |

CShapes mondiale: Schvitz et al. (2022), *Mapping The International System, 1886–2017: The CShapes 2.0 Dataset*. CShapes-Europe: Cederman et al. (2025), come riportato dal distributore ETH. Citazioni complete e documentazione sul sito della fonte.

Trasformazioni: selezione delle proprietà usate nell'app, coordinate arrotondate a sei decimali senza semplificare i poligoni, normalizzazione delle date mondiali dai componenti originali anno/mese/giorno, partizione temporale del mondo in cinque file. I periodi che attraversano più partizioni sono presenti in ciascuna. Pleiades conserva intervalli delle localizzazioni e link ai luoghi originali; più localizzazioni di un luogo vengono deduplicate nella vista scegliendo quella con minor raggio di incertezza per il periodo selezionato. I limiti temporali inclusivi seguono i dati originali.

Le attestazioni Pleiades non dimostrano continuità di occupazione per ciascun anno. DARE non offre qui date di validità: tutti i suoi punti rappresentano il catalogo del mondo romano. CShapes non è un dataset dei fronti di guerra.

Historical Basemaps rimane caricato dal [repository di Alexandre Ourednik](https://github.com/aourednik/historical-basemaps), licenza [GPL-3.0](https://github.com/aourednik/historical-basemaps/blob/master/LICENSE). Le sue ricostruzioni, soprattutto antiche, hanno precisione variabile.
