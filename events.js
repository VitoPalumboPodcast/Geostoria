// Database degli eventi storici con gruppi (fazioni) e scritte geografiche
export const historicalEvents = [
    {
        id: "early-civilizations",
        title: "Nascita delle Prime Civiltà",
        year: -3000,
        eraText: "3000 a.C.",
        description: "L'inizio dell'età del bronzo vede la fioritura delle prime grandi civiltà statali. In Egitto si uniscono l'Alto e il Basso Egitto sotto il primo Faraone (Narmer), mentre in Mesopotamia fioriscono le città-stato sumere come Ur, Uruk e Lagash. Contemporaneamente si sviluppa la civiltà dell'Elam.",
        groups: [
            { name: "Antico Egitto", color: "#f59e0b", countries: ["Egypt"] },
            { name: "Città-stato Sumere (Ur)", color: "#06b6d4", countries: ["Ur", "city-states"] },
            { name: "Regno di Elam", color: "#e11d48", countries: ["Elam"] }
        ],
        labels: [
            { text: "Antico Egitto", pos: [26.8, 30.8], color: "#f59e0b" },
            { text: "Mesopotamia (Sumeri)", pos: [31.5, 46.0], color: "#06b6d4" },
            { text: "Regno di Elam", pos: [30.0, 49.0], color: "#e11d48" }
        ],
        bounds: [[15, 25], [40, 55]], // Egitto e Medio Oriente
        duration: { start: -3100, end: -2686, label: "Periodo Protodinastico dell'Egitto (3100 a.C. - 2686 a.C.)" }
    },
    {
        id: "babylonian-egyptian-era",
        title: "Impero di Babilonia e il Nuovo Egitto",
        year: -1500,
        eraText: "1500 a.C.",
        description: "Il Medio Oriente è diviso tra grandi potenze regionali. L'Egitto vive il periodo del Nuovo Regno, espandendo i suoi confini fino all'Eufrate. In Mesopotamia, Babilonia è governata dalla dinastia cassita dopo la caduta dell'impero di Hammurabi, mentre a nord sorge l'impero degli Assiri e in Anatolia l'impero degli Ittiti.",
        groups: [
            { name: "Nuovo Regno Egizio", color: "#f59e0b", countries: ["Egypt"] },
            { name: "Regno di Babilonia (Cassiti)", color: "#ef4444", countries: ["Babylonia"] },
            { name: "Regno Assiro (Antico)", color: "#10b981", countries: ["Assyria"] },
            { name: "Impero Ittita", color: "#a855f7", countries: ["Hittites"] }
        ],
        labels: [
            { text: "Nuovo Regno Egizio", pos: [26.8, 30.8], color: "#f59e0b" },
            { text: "Regno di Babilonia", pos: [32.5, 44.5], color: "#ef4444" },
            { text: "Regno Assiro", pos: [36.2, 43.1], color: "#10b981" },
            { text: "Impero Ittita", pos: [39.5, 33.0], color: "#a855f7" }
        ],
        bounds: [[10, 20], [45, 65]], // Vicino Oriente
        duration: { start: -1550, end: -1077, label: "Nuovo Regno d'Egitto (1550 a.C. - 1077 a.C.)" }
    },
    {
        id: "neo-assyrian-peak",
        title: "L'Impero Assiro e lo Splendore di Babilonia",
        year: -1000,
        eraText: "1000 a.C.",
        description: "L'età del ferro vede l'espansione e il dominio dell'Impero Neo-Assiro nel Vicino Oriente, caratterizzato da una potente organizzazione militare e amministrativa. Nel frattempo, l'Egitto affronta un periodo di frammentazione (Terzo Periodo Intermedio) e Babilonia resiste come polo culturale e religioso alternativo alle pretese assire.",
        groups: [
            { name: "Impero Neo-Assiro", color: "#10b981", countries: ["Assyria"] },
            { name: "Babilonia", color: "#ef4444", countries: ["Babylonia"] },
            { name: "Terzo Periodo Intermedio", color: "#f59e0b", countries: ["Egypt"] }
        ],
        labels: [
            { text: "Impero Neo-Assiro", pos: [36.2, 42.1], color: "#10b981" },
            { text: "Babilonia", pos: [32.5, 44.5], color: "#ef4444" },
            { text: "Antico Egitto (Frammentato)", pos: [26.8, 30.8], color: "#f59e0b" }
        ],
        bounds: [[12, 22], [42, 62]], // Vicino Oriente ed Egitto
        duration: { start: -911, end: -609, label: "Impero Neo-Assiro (911 a.C. - 609 a.C.)" }
    },
    {
        id: "greek-first-colonization",
        title: "Prima Colonizzazione Greca: Egeo e Asia Minore",
        year: -900,
        eraText: "900 a.C.",
        description: "Dopo la crisi dell'eta micenea e durante l'eta oscura greca, gruppi greci si spostano e consolidano insediamenti nell'Egeo e sulle coste dell'Asia Minore. Questa prima colonizzazione riguarda soprattutto Ioni, Eoli e Dori: non e ancora la grande espansione mediterranea, ma prepara la futura rete delle poleis greche.",
        groups: [
            { name: "Greci ionici", color: "#3b82f6", countries: ["Ionia", "Greek city-states", "Aegean"] },
            { name: "Greci eolici", color: "#06b6d4", countries: ["Aeolis", "Greek city-states"] },
            { name: "Greci dorici", color: "#8b5cf6", countries: ["Doris", "Dorian", "Rhodes", "Crete"] },
            { name: "Vicino Oriente fenicio", color: "#ec4899", countries: ["Phoenicia", "Canaan"] }
        ],
        labels: [
            { text: "Ionia", pos: [38.5, 27.0], color: "#3b82f6" },
            { text: "Eolide", pos: [39.3, 26.8], color: "#06b6d4" },
            { text: "Dori: Creta e Rodi", pos: [35.8, 26.0], color: "#8b5cf6" },
            { text: "Atene e poleis greche", pos: [38.0, 23.7], color: "#3b82f6" },
            { text: "Tiro e Sidone", pos: [33.6, 35.5], color: "#ec4899" }
        ],
        bounds: [[32, 18], [42, 38]],
        duration: { start: -1100, end: -800, label: "Prima colonizzazione greca (XI-IX sec. a.C.)" }
    },
    {
        id: "phoenicians-mediterranean",
        title: "Fenici e Cartaginesi nel Mediterraneo Occidentale",
        year: -700,
        eraText: "700 a.C.",
        description: "I Fenici, grandi navigatori e mercanti originari di Tiro, Sidone e Biblo, costruiscono una rete di empori e colonie lungo le rotte del Mediterraneo. L'influenza fenicia e poi punica comprende Cartagine e altri centri dell'Africa settentrionale, parte della Sardegna, la Sicilia occidentale, Malta, le Baleari e varie aree costiere della Spagna meridionale e orientale. Non si tratta di un impero territoriale continuo, ma di una rete marittima di citta, scali e zone di influenza.",
        groups: [
            { name: "Fenici d'Oriente", color: "#ec4899", countries: ["Phoenicia", "Canaan", "Tyre", "Sidon"] }, // Rosa
            { name: "Area fenicio-punica occidentale", color: "#f43f5e", countries: ["Carthage", "Carthaginian", "Sardinia", "Sicily", "Spain", "Balearic", "North Africa"] },
            { name: "Colonie greche contemporanee", color: "#3b82f6", countries: ["Greek city-states", "Sicily", "Magna Graecia"] }, // Blu
            { name: "Egitto (XXVI Dinastia)", color: "#f59e0b", countries: ["Egypt"] } // Oro
        ],
        labels: [
            { text: "Fenici (Tiro e Sidone)", pos: [33.6, 35.6], color: "#ec4899" },
            { text: "Cartagine (Fenici)", pos: [36.8, 10.2], color: "#ec4899" },
            { text: "Utica", pos: [37.05, 10.1], color: "#f43f5e" },
            { text: "Nora e Sulcis", pos: [39.0, 8.8], color: "#f43f5e" },
            { text: "Mozia e Palermo", pos: [38.0, 12.5], color: "#f43f5e" },
            { text: "Malta", pos: [35.9, 14.4], color: "#f43f5e" },
            { text: "Gadir / Cadice", pos: [36.5, -6.3], color: "#f43f5e" },
            { text: "Ibiza e Baleari", pos: [39.0, 1.5], color: "#f43f5e" },
            { text: "Nord Africa punico", pos: [34.5, 3.0], color: "#f43f5e" },
            { text: "Magna Grecia", pos: [38.2, 16.0], color: "#3b82f6" },
            { text: "Città-stato Greche", pos: [38.7, 22.2], color: "#3b82f6" },
            { text: "Impero Neo-Assiro", pos: [36.2, 42.1], color: "#10b981" },
            { text: "Regno d'Egitto", pos: [26.8, 30.8], color: "#f59e0b" }
        ],
        bounds: [[29, -10], [43, 38]], // Mediterraneo fenicio-punico
        duration: { start: -1200, end: -539, label: "Espansione Civiltà Fenicia (1200 a.C. - 539 a.C.)" }
    },
    {
        id: "greek-second-colonization",
        title: "Seconda Colonizzazione Greca: Mediterraneo e Mar Nero",
        year: -650,
        eraText: "650 a.C.",
        description: "Tra VIII e VI secolo a.C. molte poleis greche fondano apoikiai, cioe colonie autonome, per commercio, accesso a terre e metalli, pressione demografica e conflitti interni. Nascono reti greche in Sicilia, Italia meridionale, Francia meridionale, Spagna nord-orientale, coste dell'Egeo settentrionale e Mar Nero. E la fase della Magna Grecia e delle grandi colonie siceliote.",
        groups: [
            { name: "Madrepatria greca", color: "#3b82f6", countries: ["Greek city-states", "Athens", "Sparta", "Corinth"] },
            { name: "Magna Grecia e Sicilia greca", color: "#06b6d4", countries: ["Sicily", "Magna Graecia", "Syracuse", "Taras"] },
            { name: "Colonie greche occidentali", color: "#8b5cf6", countries: ["Massalia", "Emporion", "Spain", "Gaul"] },
            { name: "Colonie del Mar Nero", color: "#10b981", countries: ["Black Sea", "Byzantium", "Pontus"] }
        ],
        labels: [
            { text: "Corinto, Atene, Sparta", pos: [37.8, 22.7], color: "#3b82f6" },
            { text: "Siracusa", pos: [37.1, 15.3], color: "#06b6d4" },
            { text: "Crotone e Sibari", pos: [39.0, 16.6], color: "#06b6d4" },
            { text: "Taranto", pos: [40.5, 17.2], color: "#06b6d4" },
            { text: "Napoli / Cuma", pos: [40.9, 14.2], color: "#06b6d4" },
            { text: "Massalia", pos: [43.3, 5.4], color: "#8b5cf6" },
            { text: "Emporion", pos: [42.1, 3.1], color: "#8b5cf6" },
            { text: "Bisanzio", pos: [41.0, 29.0], color: "#10b981" },
            { text: "Mar Nero greco", pos: [44.5, 34.0], color: "#10b981" }
        ],
        bounds: [[33, -8], [47, 42]],
        duration: { start: -800, end: -550, label: "Seconda colonizzazione greca (VIII-VI sec. a.C.)" }
    },
    {
        id: "alexander-empire",
        title: "Impero di Alessandro Magno",
        year: -323,
        eraText: "323 a.C.",
        description: "Alessandro Magno muore a Babilonia dopo aver conquistato l'Impero Persiano Acheménide. Il suo immenso impero si estende dalla Grecia fino ai confini dell'India. Alla sua morte, i suoi generali (i Diadochi) si spartiscono il territorio, dando inizio all'era ellenistica.",
        groups: [
            { name: "Impero Macedone di Alessandro", color: "#3b82f6", countries: ["Empire of Alexander"] },
            { name: "Repubblica Romana", color: "#ef4444", countries: ["Rome"] },
            { name: "Stato di Qin (Cina)", color: "#10b981", countries: ["Qin"] },
            { name: "Impero Maurya (India)", color: "#f59e0b", countries: ["Maurya"] }
        ],
        labels: [
            { text: "Impero Macedone di Alessandro", pos: [33.0, 44.0], color: "#3b82f6" },
            { text: "Repubblica Romana (Inizio)", pos: [41.9, 12.5], color: "#ef4444" },
            { text: "Stato di Qin", pos: [34.0, 108.0], color: "#10b981" },
            { text: "Impero Maurya", pos: [22.0, 78.0], color: "#f59e0b" }
        ],
        bounds: [[20, 15], [45, 75]], // Dalla Grecia all'India
        duration: { start: -336, end: -323, label: "Impero Macedone di Alessandro (336 a.C. - 323 a.C.)" }
    },
    {
        id: "roman-empire-peak",
        title: "Apogeo dell'Impero Romano",
        year: 100,
        eraText: "100 d.C.",
        description: "Sotto l'imperatore Traiano, l'Impero Romano raggiunge la sua massima estensione territoriale, controllando l'intero bacino del Mediterraneo, l'Europa occidentale, la Gran Bretagna e parti del Medio Oriente. Contemporaneamente, in Asia brilla l'Impero Han in Cina e l'Impero Kushan nell'India settentrionale.",
        groups: [
            { name: "Impero Romano", color: "#ef4444", countries: ["Roman Empire"] },
            { name: "Impero Partico", color: "#a855f7", countries: ["Parthian"] },
            { name: "Impero Kushan", color: "#f59e0b", countries: ["Kushan"] },
            { name: "Impero Han (Cina)", color: "#10b981", countries: ["Han"] }
        ],
        labels: [
            { text: "Impero Romano", pos: [42.0, 13.0], color: "#ef4444" },
            { text: "Impero Han", pos: [34.0, 110.0], color: "#10b981" },
            { text: "Impero Partico", pos: [34.0, 58.0], color: "#a855f7" },
            { text: "Impero Kushan", pos: [32.0, 72.0], color: "#f59e0b" }
        ],
        bounds: [[25, -12], [55, 45]], // Impero Romano e confini
        duration: { start: -27, end: 476, label: "Impero Romano d'Occidente (27 a.C. - 476 d.C.)" }
    },
    {
        id: "charlemagne-empire",
        title: "Carlo Magno e il Sacro Romano Impero",
        year: 800,
        eraText: "800 d.C.",
        description: "Nella notte di Natale dell'anno 800, Carlo Magno viene incoronato Imperatore a Roma da Papa Leone III, restaurando l'Impero in Occidente (Impero Carolingio). A est, il Califfato Abbaside vive la sua età dell'oro a Baghdad sotto Harun al-Rashid, mentre l'Impero Bizantino domina il Mediterraneo orientale.",
        groups: [
            { name: "Impero Carolingio", color: "#3b82f6", countries: ["Carolingian"] },
            { name: "Impero Bizantino", color: "#a855f7", countries: ["Byzantine"] },
            { name: "Califfato Abbaside", color: "#10b981", countries: ["Abbasid", "Caliphate"] }
        ],
        labels: [
            { text: "Impero Carolingio (Carlo Magno)", pos: [48.0, 8.0], color: "#3b82f6" },
            { text: "Impero Bizantino (Oriente)", pos: [39.0, 26.0], color: "#a855f7" },
            { text: "Califfato Abbaside (Baghdad)", pos: [30.0, 45.0], color: "#10b981" }
        ],
        bounds: [[25, -15], [60, 55]], // Europa e Medio Oriente
        duration: { start: 751, end: 843, label: "Impero Carolingio (751 d.C. - 843 d.C.)" }
    },
    {
        id: "mongol-empire-expansion",
        title: "L'Impero Mongolo di Gengis Khan",
        year: 1300,
        eraText: "1300 d.C.",
        description: "Nel XIII secolo l'Impero Mongolo, fondato da Gengis Khan, diventa l'impero contiguo più esteso della storia, unendo la Cina, l'Asia centrale, la Russia e parti del Medio Oriente. Intorno al 1300 si è frammentato in grandi regni (il Khanato dell'Orda d'Oro, il Khanato Ilkhanato, il Khanato Chagatai e la Dinastia Yuan in Cina).",
        groups: [
            { name: "Dinastia Yuan (Cina)", color: "#10b981", countries: ["Yuan"] },
            { name: "Khanato dell'Orda d'Oro", color: "#f59e0b", countries: ["Golden Horde"] },
            { name: "Khanato dell'Ilkhanato", color: "#ef4444", countries: ["Ilkhanate"] },
            { name: "Regno di Francia e Inghilterra", color: "#3b82f6", countries: ["France", "England"] }
        ],
        labels: [
            { text: "Dinastia Yuan (Cina Mongola)", pos: [38.0, 112.0], color: "#10b981" },
            { text: "Khanato dell'Orda d'Oro", pos: [52.0, 50.0], color: "#f59e0b" },
            { text: "Khanato dell'Ilkhanato", pos: [34.0, 58.0], color: "#ef4444" },
            { text: "Regno di Francia", pos: [47.0, 2.0], color: "#3b82f6" },
            { text: "Regno d'Inghilterra", pos: [53.0, -1.5], color: "#3b82f6" }
        ],
        bounds: [[15, 20], [65, 125]], // Eurasia
        duration: { start: 1206, end: 1368, label: "Impero Mongolo unitario (1206 d.C. - 1368 d.C.)" }
    },
    {
        id: "discovery-america",
        title: "La Scoperta dell'America",
        year: 1492,
        eraText: "1492 d.C.",
        description: "La spedizione di Cristoforo Colombo sbarca nelle Bahamas, segnando l'inizio dell'esplorazione e della colonizzazione europea delle Americhe. In Europa, i Re Cattolici unificano la Spagna con la caduta di Granada. Nelle Americhe prosperano l'Impero Inca nelle Ande e l'Impero Azteco in Messico.",
        groups: [
            { name: "Impero Spagnolo", color: "#ef4444", countries: ["Spain"] },
            { name: "Impero Portoghese", color: "#3b82f6", countries: ["Portugal"] },
            { name: "Impero Inca", color: "#f59e0b", countries: ["Inca"] },
            { name: "Impero Azteco", color: "#10b981", countries: ["Aztec"] }
        ],
        labels: [
            { text: "Regno di Spagna", pos: [40.2, -3.8], color: "#ef4444" },
            { text: "Regno del Portogallo", pos: [39.5, -8.0], color: "#3b82f6" },
            { text: "Impero Inca", pos: [-12.0, -77.0], color: "#f59e0b" }
        ],
        bounds: [[-20, -100], [55, 45]], // Atlantico ed Europa/Americhe
        duration: { start: 1492, end: 1898, label: "Espansione Impero Spagnolo (1492 d.C. - 1898 d.C.)" }
    },
    {
        id: "ottoman-peak",
        title: "Splendore dell'Impero Ottomano",
        year: 1600,
        eraText: "1600 d.C.",
        description: "L'Impero Ottomano domina il Mediterraneo, il Nord Africa e i Balcani meridionali. In India fiorisce l'Impero Moghul guidato da Akbar il Grande, mentre in Cina la Dinastia Ming vive i suoi ultimi decenni di splendore artistico e politico prima dell'avvento dei Qing.",
        groups: [
            { name: "Impero Ottomano", color: "#ef4444", countries: ["Ottoman"] },
            { name: "Impero Moghul (India)", color: "#f59e0b", countries: ["Mughal"] },
            { name: "Dinastia Ming (Cina)", color: "#10b981", countries: ["Ming"] },
            { name: "Monarchie Europee", color: "#3b82f6", countries: ["Spain", "England", "France"] }
        ],
        labels: [
            { text: "Impero Ottomano", pos: [39.0, 32.0], color: "#ef4444" },
            { text: "Impero Moghul", pos: [24.0, 78.0], color: "#f59e0b" },
            { text: "Impero della Dinastia Ming", pos: [33.0, 113.0], color: "#10b981" }
        ],
        bounds: [[5, -10], [55, 100]], // Mediterraneo, Medio Oriente e India
        duration: { start: 1299, end: 1922, label: "Impero Ottomano (1299 d.C. - 1922 d.C.)" }
    },
    {
        id: "napoleonic-wars",
        title: "Guerre Napoleoniche e il Congresso di Vienna",
        year: 1815,
        eraText: "1815 d.C.",
        description: "La sconfitta finale di Napoleone Bonaparte a Waterloo pone fine al Primo Impero Francese. Le potenze europee si riuniscono nel Congresso di Vienna per ridisegnare la mappa d'Europa, restaurando le vecchie monarchie e inaugurando il concerto europeo guidato da Austria, Prussia, Russia e Regno Unito.",
        groups: [
            { name: "Francia (Restaurazione)", color: "#3b82f6", countries: ["France"] },
            { name: "Coalizione Antifrancese", color: "#ef4444", countries: ["United Kingdom", "Austrian", "Prussia", "Russian Empire"] }
        ],
        labels: [
            { text: "Francia (Borboni)", pos: [47.0, 2.0], color: "#3b82f6" },
            { text: "Regno Unito", pos: [54.0, -2.0], color: "#ef4444" },
            { text: "Impero Austriaco", pos: [48.0, 16.0], color: "#ef4444" },
            { text: "Impero Russo", pos: [55.0, 37.0], color: "#ef4444" }
        ],
        bounds: [[35, -12], [65, 40]], // Europa napoleonica
        duration: { start: 1804, end: 1815, label: "Primo Impero Francese (1804 d.C. - 1815 d.C.)" }
    },
    {
        id: "world-war-one",
        title: "La Prima Guerra Mondiale",
        year: 1914,
        eraText: "1914 d.C.",
        description: "L'assassinio dell'arciduca Francesco Ferdinando a Sarajevo innesca il conflitto globale. L'Europa si spacca tra gli Imperi Centrali (Germania, Austria-Ungheria, Impero Ottomano) e gli Alleati (Francia, Regno Unito, Russia, e in seguito Italia e Stati Uniti), portando al collasso di quattro imperi storici.",
        groups: [
            { name: "Imperi Centrali", color: "#ef4444", countries: ["German Empire", "Austria-Hungary", "Ottoman Empire"] },
            { name: "Alleati / Intesa", color: "#3b82f6", countries: ["Russian Empire", "France", "United Kingdom", "Italy"] }
        ],
        labels: [
            { text: "Impero Tedesco", pos: [51.5, 10.5], color: "#ef4444" },
            { text: "Austria-Ungheria", pos: [47.0, 19.0], color: "#ef4444" },
            { text: "Impero Ottomano", pos: [39.0, 35.0], color: "#ef4444" },
            { text: "Repubblica Francese", pos: [47.0, 2.0], color: "#3b82f6" },
            { text: "Regno Unito", pos: [54.0, -2.0], color: "#3b82f6" },
            { text: "Impero Russo", pos: [58.0, 35.0], color: "#3b82f6" }
        ],
        bounds: [[34, -12], [65, 45]], // Europa del 1914
        duration: { start: 1914, end: 1918, label: "Prima Guerra Mondiale (1914 d.C. - 1918 d.C.)" }
    },
    {
        id: "world-war-two",
        title: "La Seconda Guerra Mondiale",
        year: 1938,
        eraText: "1938 d.C.",
        description: "Alla vigilia dello scoppio del secondo grande conflitto mondiale, l'espansionismo della Germania nazista e dell'Italia fascista altera i confini europei (annessione dell'Austria e dei Sudeti). In Asia, il Giappone invade la Cina, preparando il terreno per il conflitto globale totale.",
        groups: [
            { name: "Potenze dell'Asse", color: "#ef4444", countries: ["Germany", "Italy", "Japan"] },
            { name: "Nazioni Alleate", color: "#3b82f6", countries: ["United Kingdom", "France", "Soviet Union", "United States", "China"] }
        ],
        labels: [
            { text: "Germania Nazista", pos: [51.5, 10.5], color: "#ef4444" },
            { text: "Italia Fascista", pos: [41.9, 12.5], color: "#ef4444" },
            { text: "Impero Giapponese", pos: [36.0, 138.0], color: "#ef4444" },
            { text: "Unione Sovietica", pos: [58.0, 45.0], color: "#3b82f6" },
            { text: "Regno Unito", pos: [54.0, -2.0], color: "#3b82f6" }
        ],
        bounds: [[10, -20], [68, 140]], // Scacchiere euroasiatico ed atlantico
        duration: { start: 1939, end: 1945, label: "Seconda Guerra Mondiale (1939 d.C. - 1945 d.C.)" }
    },
    {
        id: "cold-war",
        title: "La Guerra Fredda",
        year: 1960,
        eraText: "1960 d.C.",
        description: "Il mondo è diviso in due blocchi contrapposti guidati dalle superpotenze: gli Stati Uniti (blocco occidentale / NATO) e l'Unione Sovietica (blocco orientale / Patto di Varsavia). L'Africa vive la sua storica ondata di decolonizzazione, portando alla nascita di decine di nuove nazioni indipendenti.",
        groups: [
            { name: "NATO / Blocco Occidentale", color: "#3b82f6", countries: ["United States", "United Kingdom", "France", "Canada", "Australia"] },
            { name: "Patto di Varsavia (Est)", color: "#ef4444", countries: ["Soviet Union"] },
            { name: "Terzo Mondo / Cina", color: "#10b981", countries: ["China"] }
        ],
        labels: [
            { text: "U.R.S.S. (Blocco Sovietico)", pos: [58.0, 50.0], color: "#ef4444" },
            { text: "Stati Uniti (NATO)", pos: [38.0, -97.0], color: "#3b82f6" },
            { text: "Repubblica Popolare Cinese", pos: [35.0, 105.0], color: "#10b981" }
        ],
        bounds: [[-50, -140], [75, 140]], // Visuale Globale
        duration: { start: 1947, end: 1991, label: "Periodo della Guerra Fredda (1947 d.C. - 1991 d.C.)" }
    },
    {
        id: "contemporary-era",
        title: "Il Mondo Contemporaneo",
        year: 2010,
        eraText: "2010 d.C.",
        description: "Il mondo post-Guerra Fredda e della globalizzazione. I confini mostrano la frammentazione dell'ex-Unione Sovietica e della Jugoslavia negli anni '90, la crescita dell'Unione Europea e la stabilità delle nazioni moderne nell'era di Internet. Questa mappa rende disponibili i confini statuali del mondo contemporaneo.",
        groups: [
            { name: "USA / NATO / Occidente", color: "#3b82f6", countries: ["Italy", "Germany", "France", "United Kingdom", "United States", "Brazil"] },
            { name: "Federazione Russa", color: "#ef4444", countries: ["Russia"] },
            { name: "Repubblica Popolare Cinese", color: "#10b981", countries: ["China"] },
            { name: "India ed Emerso", color: "#f59e0b", countries: ["India"] }
        ],
        labels: [
            { text: "Federazione Russa", pos: [58.0, 60.0], color: "#ef4444" },
            { text: "Cina", pos: [35.0, 105.0], color: "#10b981" },
            { text: "Stati Uniti d'America", pos: [38.0, -97.0], color: "#3b82f6" },
            { text: "Unione Europea", pos: [48.0, 10.0], color: "#3b82f6" }
        ],
        bounds: [[-50, -140], [75, 140]], // Visuale Globale
        duration: { start: 1991, end: 2030, label: "Era Post-Guerra Fredda (1991 d.C. - Oggi)" }
    }
];

// Trova l'evento più vicino a un dato anno
export function getClosestEvent(year) {
    return historicalEvents.reduce((prev, curr) => {
        return Math.abs(curr.year - year) < Math.abs(prev.year - year) ? curr : prev;
    });
}
