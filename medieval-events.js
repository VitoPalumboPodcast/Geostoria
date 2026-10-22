// Percorso didattico dedicato all'Alto Medioevo e alla transizione feudale.
// I marker localizzano luoghi puntuali; le etichette descrivono le aree storiche.
export const medievalEvents = [
    {
        id: "fall-western-roman-empire",
        title: "Caduta dell'Impero Romano d'Occidente",
        year: 476,
        eraText: "476 d.C.",
        description: "A Ravenna Odoacre depone Romolo Augustolo. La data segna convenzionalmente la fine dell'Impero Romano d'Occidente e l'avvio dell'Alto Medioevo; nei territori occidentali si consolidano regni romano-germanici, mentre l'Impero romano d'Oriente continua a esistere.",
        groups: [
            { name: "Regni romano-germanici", color: "#dc2626", countries: ["Ostrogoths", "Visigoths", "Franks", "Burgundians", "Vandals"] },
            { name: "Impero Romano d'Oriente", color: "#7c3aed", countries: ["Byzantine", "Eastern Roman Empire"] }
        ],
        labels: [
            { text: "Regni romano-germanici", pos: [48.0, 7.0], color: "#dc2626" },
            { text: "Impero Romano d'Oriente", pos: [41.0, 27.5], color: "#7c3aed" }
        ],
        markers: [
            { title: "Ravenna: deposizione di Romolo Augustolo", pos: [44.4184, 12.2035], icon: "landmark", color: "#dc2626" }
        ],
        bounds: [[34, -11], [56, 31]]
    },
    {
        id: "post-roman-population-movements",
        title: "Stanziamento dei regni romano-germanici",
        year: 500,
        eraText: "V–VI secolo",
        description: "Dopo la dissoluzione dell'autorità imperiale in Occidente, diversi popoli consolidano nuovi regni. I Franchi si espandono dal basso Reno in Gallia; Angli e Sassoni attraversano il Mare del Nord verso la Britannia; Visigoti, Ostrogoti e Vandali si stabiliscono rispettivamente nella penisola iberica, in Italia e nell'Africa settentrionale. Le frecce sintetizzano processi avvenuti in tempi differenti, non un'unica migrazione simultanea.",
        groups: [
            { name: "Franchi", color: "#2563eb", countries: ["Franks", "Frankish Kingdom"] },
            { name: "Anglosassoni", color: "#0891b2", countries: ["Anglo-Saxons", "England"] },
            { name: "Visigoti", color: "#7c3aed", countries: ["Visigoths", "Visigothic Kingdom"] },
            { name: "Ostrogoti", color: "#d97706", countries: ["Ostrogoths", "Ostrogothic Kingdom"] },
            { name: "Vandali", color: "#dc2626", countries: ["Vandals", "Vandal Kingdom"] }
        ],
        labels: [
            { text: "Franchi", pos: [49.0, 3.0], color: "#2563eb" },
            { text: "Regni anglosassoni", pos: [52.5, -1.2], color: "#0891b2" },
            { text: "Visigoti", pos: [40.0, -4.0], color: "#7c3aed" },
            { text: "Ostrogoti", pos: [44.3, 11.0], color: "#d97706" },
            { text: "Vandali", pos: [35.9, 10.1], color: "#dc2626" }
        ],
        markers: [
            { title: "Soissons: centro franco", pos: [49.3817, 3.3236], icon: "crown", color: "#2563eb" },
            { title: "Ravenna: capitale ostrogota", pos: [44.4184, 12.2035], icon: "landmark", color: "#d97706" },
            { title: "Toledo: centro del regno visigoto", pos: [39.8628, -4.0273], icon: "castle", color: "#7c3aed" },
            { title: "Cartagine: centro del regno vandalo", pos: [36.8529, 10.3230], icon: "ship", color: "#dc2626" }
        ],
        movements: [
            { title: "Espansione dei Franchi dal basso Reno alla Gallia", color: "#2563eb", path: [[51.0, 6.2], [50.2, 4.7], [49.38, 3.32], [48.86, 2.35]] },
            { title: "Migrazione di Angli e Sassoni verso la Britannia", color: "#0891b2", path: [[54.8, 9.5], [54.0, 6.0], [52.8, 1.2]] },
            { title: "Stanziamento visigoto nella penisola iberica", color: "#7c3aed", path: [[44.8, 4.8], [42.0, 1.5], [39.86, -4.03]] },
            { title: "Stanziamento ostrogoto in Italia", color: "#d97706", path: [[47.0, 19.0], [46.0, 14.5], [44.42, 12.20]] },
            { title: "Percorso dei Vandali verso Cartagine", color: "#dc2626", path: [[48.0, 9.0], [44.0, 2.0], [40.4, -3.7], [36.85, 10.32]], dashed: true }
        ],
        bounds: [[33, -12], [57, 23]],
        duration: { start: 476, end: 568, label: "Stanziamento dei regni romano-germanici (V–VI secolo)" }
    },
    {
        id: "lombard-invasion-italy",
        title: "Invasione longobarda dell'Italia",
        year: 568,
        eraText: "568 d.C.",
        description: "Guidati da Alboino, i Longobardi muovono dalla Pannonia, attraversano le Alpi orientali e occupano ampie parti della penisola. Pavia diventa la capitale del regno, mentre i ducati di Spoleto e Benevento formano la Langobardia Minor; territori bizantini continuano a separare e circondare i domini longobardi.",
        groups: [
            { name: "Domini longobardi", color: "#d97706", countries: ["Lombards", "Lombard Kingdom"] },
            { name: "Domini bizantini", color: "#7c3aed", countries: ["Byzantine", "Exarchate of Ravenna"] }
        ],
        labels: [
            { text: "Langobardia Maior", pos: [45.3, 10.2], color: "#d97706" },
            { text: "Ducati di Spoleto e Benevento", pos: [42.0, 13.5], color: "#d97706" }
        ],
        markers: [
            { title: "Pavia: capitale del regno longobardo", pos: [45.1847, 9.1582], icon: "crown", color: "#d97706" },
            { title: "Spoleto: ducato longobardo", pos: [42.7342, 12.7380], icon: "castle", color: "#d97706" },
            { title: "Benevento: ducato longobardo", pos: [41.1298, 14.7826], icon: "castle", color: "#d97706" }
        ],
        movements: [
            { title: "Dalla Pannonia attraverso le Alpi orientali", color: "#d97706", path: [[46.8, 18.3], [46.3, 14.5], [46.1, 13.4], [45.18, 9.16]] },
            { title: "Espansione verso il Ducato di Spoleto", color: "#d97706", path: [[45.18, 9.16], [43.8, 11.2], [42.73, 12.74]], dashed: true },
            { title: "Espansione verso il Ducato di Benevento", color: "#d97706", path: [[42.73, 12.74], [41.13, 14.78]], dashed: true }
        ],
        bounds: [[39, 7], [48, 20]],
        duration: { start: 568, end: 774, label: "Regno longobardo in Italia (568–774)" }
    },
    {
        id: "islam-birth-expansion",
        title: "Nascita ed espansione dell'Islam",
        year: 622,
        eraText: "VII–VIII secolo",
        description: "L'Egira del 622 segna l'inizio dell'era islamica. Dall'Arabia, i califfati estendono rapidamente il proprio dominio nel Vicino Oriente e nel Nord Africa; nel 711 iniziano la conquista della penisola iberica e nel 756 nasce l'Emirato di Cordova.",
        groups: [
            { name: "Califfati islamici", color: "#059669", countries: ["Caliphate", "Rashidun", "Umayyad", "Abbasid"] },
            { name: "Impero Bizantino", color: "#7c3aed", countries: ["Byzantine"] }
        ],
        labels: [
            { text: "Arabia", pos: [23.3, 44.0], color: "#059669" },
            { text: "Espansione dei califfati", pos: [31.5, 30.0], color: "#059669" },
            { text: "Al-Andalus dal 711", pos: [38.2, -4.5], color: "#0f766e" }
        ],
        markers: [
            { title: "Mecca: origine della predicazione islamica", pos: [21.4225, 39.8262], icon: "mosque", color: "#059669" },
            { title: "Medina: meta dell'Egira (622)", pos: [24.4672, 39.6024], icon: "route", color: "#059669" },
            { title: "Cordova: emirato indipendente dal 756", pos: [37.8882, -4.7794], icon: "city", color: "#0f766e" }
        ],
        movements: [
            { title: "Conquiste verso Siria e Palestina (632–638)", color: "#059669", path: [[24.47, 39.60], [29.4, 36.0], [33.51, 36.29], [31.78, 35.22]] },
            { title: "Espansione verso Egitto e Nord Africa", color: "#059669", path: [[31.78, 35.22], [30.04, 31.24], [31.20, 29.92], [32.9, 13.2], [36.85, 10.32]] },
            { title: "Espansione omayyade fino ad al-Andalus", color: "#0f766e", path: [[36.85, 10.32], [35.2, 0.0], [35.96, -5.60], [37.89, -4.78]] },
            { title: "Espansione verso Asia centrale e valle dell'Indo", color: "#059669", path: [[33.51, 36.29], [34.5, 44.0], [36.5, 61.0], [39.77, 64.42], [34.56, 69.21]], dashed: true }
        ],
        bounds: [[12, -12], [46, 53]],
        duration: { start: 610, end: 750, label: "Nascita ed espansione dell'Islam (VII–VIII secolo)" }
    },
    {
        id: "donation-of-sutri",
        title: "Donazione di Sutri",
        year: 728,
        eraText: "728 d.C.",
        description: "Il re longobardo Liutprando dona Sutri e altri castelli della Tuscia al papa. L'episodio è tradizionalmente considerato il primo nucleo territoriale del Patrimonio di San Pietro e del futuro potere temporale pontificio.",
        groups: [
            { name: "Regno longobardo", color: "#d97706", countries: ["Lombards", "Lombard Kingdom"] },
            { name: "Patrimonio di San Pietro", color: "#f8fafc", countries: ["Papal States", "Rome"] }
        ],
        labels: [{ text: "Regno longobardo", pos: [44.2, 10.8], color: "#d97706" }],
        markers: [{ title: "Sutri: territorio donato alla Chiesa", pos: [42.2477, 12.2170], icon: "church", color: "#f59e0b" }],
        bounds: [[39.5, 8.0], [46.5, 15.5]]
    },
    {
        id: "battle-of-poitiers",
        title: "Battaglia di Poitiers",
        year: 732,
        eraText: "732 d.C.",
        description: "Tra Tours e Poitiers, l'esercito franco guidato da Carlo Martello sconfigge le forze omayyadi di al-Andalus. La battaglia consolida il prestigio dei Pipinidi ed è tradizionalmente interpretata come un arresto dell'espansione musulmana verso il regno franco.",
        groups: [
            { name: "Regno dei Franchi", color: "#2563eb", countries: ["Franks", "Frankish Kingdom"] },
            { name: "Califfato omayyade", color: "#059669", countries: ["Umayyad", "Caliphate"] }
        ],
        labels: [
            { text: "Regno dei Franchi", pos: [48.2, 3.0], color: "#2563eb" },
            { text: "Al-Andalus", pos: [39.2, -4.2], color: "#059669" }
        ],
        markers: [{ title: "Area della battaglia tra Tours e Poitiers", pos: [46.73, 0.55], icon: "shield", color: "#dc2626" }],
        movements: [
            { title: "Avanzata omayyade da al-Andalus oltre i Pirenei", color: "#059669", path: [[37.89, -4.78], [41.4, 2.2], [43.0, 0.2], [44.84, -0.58], [46.73, 0.55]] }
        ],
        bounds: [[37, -10], [52, 10]]
    },
    {
        id: "rise-of-carolingians",
        title: "Ascesa dei Pipinidi e dei Carolingi",
        year: 751,
        eraText: "751 d.C.",
        description: "Pipino il Breve depone Childerico III, ultimo re merovingio, e viene eletto re dei Franchi. Il passaggio dinastico inaugura il dominio carolingio, rafforzato dall'alleanza con il papato.",
        groups: [{ name: "Regno dei Franchi", color: "#2563eb", countries: ["Franks", "Frankish Kingdom", "Carolingian"] }],
        labels: [{ text: "Regno dei Franchi", pos: [48.4, 4.0], color: "#2563eb" }],
        markers: [{ title: "Soissons: elezione di Pipino il Breve", pos: [49.3817, 3.3236], icon: "crown", color: "#2563eb" }],
        bounds: [[42, -3], [53, 14]],
        duration: { start: 751, end: 987, label: "Dinastia carolingia nel regno dei Franchi (751–987)" }
    },
    {
        id: "carolingian-expansion",
        title: "Espansione militare di Carlo Magno",
        year: 774,
        eraText: "768–814 d.C.",
        description: "Carlo Magno amplia il regno franco con campagne condotte su più fronti. Nel 774 conquista il regno longobardo e Pavia; tra il 772 e l'804 sottomette la Sassonia. Le marche di Bretagna, di Spagna e orientale organizzano le zone di frontiera. Le frecce rappresentano le principali direttrici militari e politiche, non singoli itinerari completi.",
        groups: [
            { name: "Regno dei Franchi", color: "#2563eb", countries: ["Carolingian", "Franks", "Frankish Kingdom"] },
            { name: "Regno longobardo", color: "#d97706", countries: ["Lombards", "Lombard Kingdom"] },
            { name: "Sassoni", color: "#dc2626", countries: ["Saxons", "Saxony"] }
        ],
        labels: [
            { text: "Regno franco", pos: [48.5, 5.0], color: "#2563eb" },
            { text: "Sassonia", pos: [52.3, 9.0], color: "#dc2626" },
            { text: "Regno d'Italia", pos: [44.6, 10.5], color: "#d97706" }
        ],
        markers: [
            { title: "Pavia: conquista del regno longobardo (774)", pos: [45.1847, 9.1582], icon: "shield", color: "#2563eb" },
            { title: "Aquisgrana: centro del potere carolingio", pos: [50.7753, 6.0839], icon: "landmark", color: "#2563eb" },
            { title: "Barcellona: centro della Marca di Spagna", pos: [41.3874, 2.1686], icon: "castle", color: "#2563eb" }
        ],
        movements: [
            { title: "Campagna d'Italia e conquista di Pavia (774)", color: "#2563eb", path: [[48.86, 2.35], [47.0, 5.5], [45.18, 9.16]] },
            { title: "Guerre contro i Sassoni (772–804)", color: "#dc2626", path: [[50.78, 6.08], [51.5, 7.5], [52.4, 9.3]] },
            { title: "Espansione verso la Marca di Spagna", color: "#7c3aed", path: [[45.0, 3.0], [42.7, 1.2], [41.39, 2.17]], dashed: true },
            { title: "Espansione verso la Marca orientale", color: "#059669", path: [[49.0, 9.0], [48.2, 13.0], [48.21, 16.37]], dashed: true },
            { title: "Marca di Bretagna", color: "#0891b2", path: [[48.2, 2.0], [48.1, -1.7], [48.2, -4.0]], dashed: true }
        ],
        bounds: [[39, -7], [55, 18]],
        duration: { start: 768, end: 814, label: "Campagne di Carlo Magno (768–814)" }
    },
    {
        id: "charlemagne-empire",
        title: "Incoronazione di Carlo Magno",
        year: 800,
        eraText: "25 dicembre 800",
        description: "A Roma papa Leone III incorona Carlo Magno imperatore. La restaurazione dell'autorità imperiale in Occidente poggia su contee e marche e su funzionari itineranti, i missi dominici. Aquisgrana diventa il principale centro politico e culturale carolingio.",
        groups: [
            { name: "Impero Carolingio", color: "#2563eb", countries: ["Carolingian", "Franks", "Frankish Kingdom"] },
            { name: "Impero Bizantino", color: "#7c3aed", countries: ["Byzantine"] },
            { name: "Califfato Abbaside", color: "#059669", countries: ["Abbasid", "Caliphate"] }
        ],
        labels: [
            { text: "Impero Carolingio", pos: [48.0, 8.0], color: "#2563eb" },
            { text: "Impero Bizantino", pos: [39.0, 26.0], color: "#7c3aed" },
            { text: "Califfato Abbaside", pos: [30.0, 45.0], color: "#059669" }
        ],
        markers: [
            { title: "Roma: incoronazione imperiale", pos: [41.9028, 12.4964], icon: "crown", color: "#f59e0b" },
            { title: "Aquisgrana: centro della corte carolingia", pos: [50.7753, 6.0839], icon: "landmark", color: "#2563eb" }
        ],
        bounds: [[25, -15], [60, 55]],
        duration: { start: 751, end: 843, label: "Impero Carolingio (751–843)" }
    },
    {
        id: "death-of-charlemagne",
        title: "Morte di Carlo Magno",
        year: 814,
        eraText: "814 d.C.",
        description: "Carlo Magno muore ad Aquisgrana. L'unico figlio superstite, Ludovico il Pio, eredita il titolo imperiale e un insieme di territori difficile da mantenere unito.",
        groups: [{ name: "Impero Carolingio", color: "#2563eb", countries: ["Carolingian", "Franks"] }],
        labels: [{ text: "Impero Carolingio", pos: [48.0, 8.0], color: "#2563eb" }],
        markers: [{ title: "Aquisgrana: morte e sepoltura di Carlo Magno", pos: [50.7753, 6.0839], icon: "monument", color: "#2563eb" }],
        bounds: [[41, -4], [56, 17]]
    },
    {
        id: "treaty-of-verdun",
        title: "Trattato di Verdun",
        year: 843,
        eraText: "843 d.C.",
        description: "I figli di Ludovico il Pio dividono l'Impero carolingio. Carlo il Calvo riceve la Francia occidentale, Ludovico il Germanico la Francia orientale; Lotario conserva il titolo imperiale e una fascia centrale dall'Italia al Mare del Nord.",
        groups: [
            { name: "Francia occidentale", color: "#2563eb", countries: ["West Francia", "Western Francia"] },
            { name: "Francia orientale", color: "#dc2626", countries: ["East Francia", "Eastern Francia"] },
            { name: "Regno di Lotario", color: "#d97706", countries: ["Middle Francia", "Lotharingia", "Italy"] }
        ],
        labels: [
            { text: "Carlo il Calvo", pos: [47.0, 1.5], color: "#2563eb" },
            { text: "Ludovico il Germanico", pos: [51.0, 11.0], color: "#dc2626" },
            { text: "Lotario", pos: [46.0, 7.0], color: "#d97706" }
        ],
        markers: [{ title: "Verdun: accordo di spartizione", pos: [49.159, 5.377], icon: "scroll", color: "#d97706" }],
        bounds: [[39, -7], [56, 17]]
    },
    {
        id: "capitulary-of-quierzy",
        title: "Capitolare di Quierzy",
        year: 877,
        eraText: "877 d.C.",
        description: "Prima della spedizione in Italia, Carlo il Calvo disciplina a Quierzy la successione temporanea di contee e altri uffici in caso di morte dei titolari. Il provvedimento favorisce la tendenza ereditaria dei grandi poteri locali, ma non rende automaticamente ereditari tutti i feudi maggiori.",
        groups: [{ name: "Francia occidentale", color: "#2563eb", countries: ["West Francia", "Western Francia"] }],
        labels: [{ text: "Francia occidentale", pos: [47.0, 2.0], color: "#2563eb" }],
        markers: [{ title: "Quierzy: emanazione del capitolare", pos: [49.571, 3.147], icon: "scroll", color: "#7c3aed" }],
        bounds: [[43, -3], [52, 8]]
    },
    {
        id: "end-carolingian-unity",
        title: "Deposizione di Carlo il Grosso",
        year: 887,
        eraText: "887 d.C.",
        description: "Carlo il Grosso viene deposto dall'assemblea di Tribur. L'unità politica carolingia non viene più ricostituita: nei diversi regni e principati acquistano forza aristocrazie e signorie locali.",
        groups: [{ name: "Regni post-carolingi", color: "#dc2626", countries: ["West Francia", "East Francia", "Italy", "Lotharingia"] }],
        labels: [{ text: "Regni post-carolingi", pos: [48.0, 7.5], color: "#dc2626" }],
        markers: [{ title: "Tribur: deposizione di Carlo il Grosso", pos: [49.924, 8.407], icon: "crown", color: "#dc2626" }],
        bounds: [[40, -5], [56, 18]]
    },
    {
        id: "second-invasions-incastellamento",
        title: "Seconde invasioni e incastellamento",
        year: 900,
        eraText: "IX–X secolo",
        description: "Saraceni, Ungari e Normanni compiono incursioni in ampie regioni d'Europa. L'insicurezza e l'indebolimento dei poteri centrali favoriscono la costruzione di castelli, il controllo locale del territorio e lo sviluppo della signoria di banno.",
        groups: [
            { name: "Aree delle incursioni normanne", color: "#2563eb", countries: ["Normans", "Vikings"] },
            { name: "Aree delle incursioni ungare", color: "#dc2626", countries: ["Magyars", "Hungary"] },
            { name: "Aree delle incursioni saracene", color: "#059669", countries: ["Emirate of Sicily", "Saracens", "Aghlabids"] }
        ],
        labels: [
            { text: "Normanni", pos: [55.0, 3.0], color: "#2563eb" },
            { text: "Ungari", pos: [47.5, 19.0], color: "#dc2626" },
            { text: "Saraceni", pos: [37.5, 12.5], color: "#059669" }
        ],
        markers: [
            { title: "Incursioni normanne lungo la Senna", pos: [49.443, 1.099], icon: "ship", color: "#2563eb" },
            { title: "Area delle scorrerie ungare", pos: [47.4979, 19.0402], icon: "horse", color: "#dc2626" },
            { title: "Sicilia islamica e incursioni nel Mediterraneo", pos: [38.1157, 13.3615], icon: "ship", color: "#059669" },
            { title: "Incastellamento nell'Europa centro-occidentale", pos: [45.5, 9.5], icon: "castle", color: "#d97706" }
        ],
        movements: [
            { title: "Incursioni normanne dalla Scandinavia alla Senna", color: "#2563eb", path: [[59.0, 10.5], [56.0, 5.0], [50.8, 1.0], [49.44, 1.10]] },
            { title: "Incursioni normanne verso le isole britanniche", color: "#2563eb", path: [[58.5, 8.0], [56.0, 1.0], [54.0, -1.0]], dashed: true },
            { title: "Scorrerie ungare verso la Germania", color: "#dc2626", path: [[47.5, 19.0], [48.5, 15.0], [49.5, 10.0]] },
            { title: "Scorrerie ungare verso l'Italia settentrionale", color: "#dc2626", path: [[47.5, 19.0], [46.5, 15.5], [45.5, 10.0]], dashed: true },
            { title: "Espansione islamica in Sicilia", color: "#059669", path: [[36.85, 10.32], [37.0, 11.8], [38.12, 13.36], [37.08, 15.29]] },
            { title: "Incursioni saracene verso Roma", color: "#059669", path: [[38.12, 13.36], [40.0, 13.0], [41.90, 12.50]], dashed: true }
        ],
        bounds: [[34, -12], [61, 26]],
        duration: { start: 800, end: 1000, label: "Seconde invasioni e incastellamento (IX–X secolo)" }
    },
    {
        id: "duchy-of-normandy",
        title: "Nascita del Ducato di Normandia",
        year: 911,
        eraText: "911 d.C.",
        description: "Con il trattato di Saint-Clair-sur-Epte, Carlo III il Semplice riconosce al capo vichingo Rollone il controllo di territori attorno alla bassa Senna. Il nuovo principato diventa il nucleo del Ducato di Normandia.",
        groups: [
            { name: "Ducato di Normandia", color: "#2563eb", countries: ["Normandy", "Normans"] },
            { name: "Francia occidentale", color: "#d97706", countries: ["West Francia", "Western Francia"] }
        ],
        labels: [{ text: "Normandia", pos: [49.2, 0.2], color: "#2563eb" }],
        markers: [
            { title: "Saint-Clair-sur-Epte: accordo tra Carlo e Rollone", pos: [49.207, 1.681], icon: "handshake", color: "#2563eb" },
            { title: "Rouen: centro del nuovo principato", pos: [49.443, 1.099], icon: "castle", color: "#2563eb" }
        ],
        bounds: [[46, -3], [52, 5]]
    },
    {
        id: "battle-of-lechfeld",
        title: "Battaglia di Lechfeld",
        year: 955,
        eraText: "10 agosto 955",
        description: "Ottone I sconfigge gli Ungari presso Augusta. La vittoria interrompe le grandi incursioni magiare nell'Europa centrale e rafforza decisamente il prestigio del sovrano sassone.",
        groups: [
            { name: "Regno dei Franchi orientali", color: "#2563eb", countries: ["East Francia", "Germany"] },
            { name: "Ungari", color: "#dc2626", countries: ["Magyars", "Hungary"] }
        ],
        labels: [{ text: "Regno di Ottone I", pos: [51.0, 10.0], color: "#2563eb" }],
        markers: [{ title: "Lechfeld: vittoria di Ottone I", pos: [48.25, 10.85], icon: "shield", color: "#dc2626" }],
        movements: [
            { title: "Avanzata ungara verso Lechfeld", color: "#dc2626", path: [[47.5, 19.0], [48.0, 15.5], [48.25, 10.85]] }
        ],
        bounds: [[45, 5], [54, 18]]
    },
    {
        id: "ottonian-empire",
        title: "Incoronazione imperiale di Ottone I",
        year: 962,
        eraText: "2 febbraio 962",
        description: "Papa Giovanni XII incorona Ottone I imperatore a Roma. Il nuovo assetto imperiale, centrato sul regno germanico e sull'Italia, si appoggia anche a vescovi investiti di funzioni pubbliche; il Privilegium Ottonianum regola inoltre i rapporti tra imperatore e papato.",
        groups: [
            { name: "Impero ottoniano", color: "#2563eb", countries: ["Holy Roman Empire", "East Francia", "Germany", "Italy"] },
            { name: "Stato della Chiesa", color: "#f59e0b", countries: ["Papal States", "Rome"] }
        ],
        labels: [
            { text: "Regno germanico", pos: [51.0, 10.0], color: "#2563eb" },
            { text: "Regno d'Italia", pos: [44.3, 10.8], color: "#2563eb" }
        ],
        markers: [
            { title: "Roma: incoronazione di Ottone I", pos: [41.9028, 12.4964], icon: "crown", color: "#f59e0b" },
            { title: "Magdeburgo: centro del progetto ottoniano", pos: [52.1205, 11.6276], icon: "church", color: "#2563eb" }
        ],
        bounds: [[39, 4], [56, 19]]
    },
    {
        id: "capetian-dynasty",
        title: "Inizio della dinastia capetingia",
        year: 987,
        eraText: "987 d.C.",
        description: "Dopo la morte di Luigi V, i grandi del regno eleggono Ugo Capeto re dei Franchi. L'elezione apre la dinastia capetingia, inizialmente fondata su un dominio diretto ristretto attorno a Parigi e Orléans.",
        groups: [{ name: "Regno di Francia", color: "#2563eb", countries: ["France", "West Francia"] }],
        labels: [{ text: "Dominio capetingio", pos: [48.5, 2.5], color: "#2563eb" }],
        markers: [
            { title: "Senlis: elezione di Ugo Capeto", pos: [49.207, 2.586], icon: "crown", color: "#2563eb" },
            { title: "Parigi: centro del dominio capetingio", pos: [48.8566, 2.3522], icon: "city", color: "#2563eb" }
        ],
        bounds: [[44, -2], [52, 7]]
    },
    {
        id: "medieval-expansion-around-1000",
        title: "L'Europa intorno all'anno Mille",
        year: 1000,
        eraText: "Intorno all'anno 1000",
        description: "La periodizzazione scolastica colloca attorno all'anno Mille l'avvio del Basso Medioevo. In molte regioni europee crescono popolazione e produzione agricola; si ampliano le superfici coltivate, si diffondono innovazioni tecniche e riprendono città, mercati e commerci. È una trasformazione graduale, non un cambiamento avvenuto in un solo anno.",
        groups: [{ name: "Aree della ripresa europea", color: "#059669", countries: ["France", "Germany", "Italy", "England", "Flanders"] }],
        labels: [
            { text: "Ripresa agricola e demografica", pos: [49.0, 6.0], color: "#059669" },
            { text: "Città e commerci", pos: [44.5, 10.5], color: "#d97706" }
        ],
        markers: [
            { title: "Pianura Padana: sviluppo agricolo e urbano", pos: [45.2, 9.8], icon: "wheat", color: "#059669" },
            { title: "Fiandre: manifatture e scambi", pos: [51.05, 3.72], icon: "market", color: "#d97706" },
            { title: "Valle del Reno: città e commerci", pos: [50.94, 6.96], icon: "city", color: "#2563eb" }
        ],
        bounds: [[38, -8], [56, 19]],
        duration: { start: 950, end: 1100, label: "Ripresa europea tra X e XI secolo" }
    },
    {
        id: "constitutio-de-feudis",
        title: "Constitutio de Feudis",
        year: 1037,
        eraText: "28 maggio 1037",
        description: "Durante il conflitto con l'aristocrazia milanese, Corrado II emana l'Edictum de beneficiis, noto come Constitutio de Feudis. Il provvedimento tutela i vassalli minori e riconosce la trasmissione ereditaria dei loro benefici, limitando l'arbitrio dei grandi signori.",
        groups: [{ name: "Regno d'Italia nell'Impero", color: "#2563eb", countries: ["Holy Roman Empire", "Italy", "Lombardy"] }],
        labels: [{ text: "Regno d'Italia", pos: [44.8, 10.5], color: "#2563eb" }],
        markers: [{ title: "Milano: contesto dell'editto sui benefici", pos: [45.4642, 9.1900], icon: "scroll", color: "#7c3aed" }],
        bounds: [[42, 6], [48, 14]]
    },
    {
        id: "normans-in-melfi",
        title: "Gli Altavilla a Melfi",
        year: 1043,
        eraText: "1041–1043",
        description: "Dopo essersi insediati a Melfi nel 1041, i capi normanni dividono le conquiste pugliesi. Nel 1043 Guglielmo Braccio di Ferro d'Altavilla è riconosciuto conte e Melfi diventa il principale centro politico della presenza normanna nel Mezzogiorno.",
        groups: [
            { name: "Contea normanna di Puglia", color: "#2563eb", countries: ["Normans", "County of Apulia", "Apulia"] },
            { name: "Territori bizantini", color: "#7c3aed", countries: ["Byzantine", "Catepanate of Italy"] }
        ],
        labels: [{ text: "Normanni in Puglia", pos: [41.1, 16.0], color: "#2563eb" }],
        markers: [{ title: "Melfi: centro della conquista normanna", pos: [40.996, 15.656], icon: "castle", color: "#2563eb" }],
        bounds: [[38, 12], [43, 19]]
    },
    {
        id: "accord-of-melfi",
        title: "Accordo di Melfi",
        year: 1059,
        eraText: "agosto 1059",
        description: "A Melfi Roberto il Guiscardo giura fedeltà a papa Niccolò II e viene riconosciuto duca di Puglia e Calabria e futuro duca di Sicilia. L'intesa lega l'espansione normanna al papato attraverso un rapporto vassallatico.",
        groups: [
            { name: "Domini normanni", color: "#2563eb", countries: ["Normans", "County of Apulia", "Apulia"] },
            { name: "Stato della Chiesa", color: "#f59e0b", countries: ["Papal States", "Rome"] }
        ],
        labels: [{ text: "Domini normanni", pos: [40.5, 16.0], color: "#2563eb" }],
        markers: [{ title: "Melfi: investitura di Roberto il Guiscardo", pos: [40.996, 15.656], icon: "handshake", color: "#f59e0b" }],
        bounds: [[37, 11], [44, 19]]
    },
    {
        id: "battle-of-hastings",
        title: "Battaglia di Hastings",
        year: 1066,
        eraText: "14 ottobre 1066",
        description: "Guglielmo, duca di Normandia, sconfigge Aroldo II e conquista il trono inglese. La nuova monarchia ridistribuisce le terre secondo rapporti feudali e nel 1086 fa compilare il Domesday Book, grande censimento fiscale e fondiario.",
        groups: [
            { name: "Ducato di Normandia", color: "#2563eb", countries: ["Normandy", "Normans"] },
            { name: "Regno d'Inghilterra", color: "#dc2626", countries: ["England", "Anglo-Saxons"] }
        ],
        labels: [
            { text: "Normandia", pos: [49.2, 0.0], color: "#2563eb" },
            { text: "Inghilterra", pos: [52.5, -1.5], color: "#dc2626" }
        ],
        markers: [
            { title: "Hastings: vittoria di Guglielmo", pos: [50.911, 0.487], icon: "shield", color: "#dc2626" },
            { title: "Traversata dalla Normandia", pos: [49.28, -0.70], icon: "ship", color: "#2563eb" }
        ],
        bounds: [[48, -6], [56, 3]]
    },
    {
        id: "norman-conquest-sicily",
        title: "Conquista normanna della Sicilia",
        year: 1091,
        eraText: "1061–1091",
        description: "Roberto il Guiscardo e soprattutto Ruggero d'Altavilla conducono la conquista della Sicilia musulmana. Iniziata a Messina nel 1061 e proseguita con la presa di Palermo nel 1072, la conquista termina nel 1091 con la caduta di Noto.",
        groups: [
            { name: "Contea normanna di Sicilia", color: "#2563eb", countries: ["Normans", "County of Sicily", "Sicily"] },
            { name: "Emirati siciliani", color: "#059669", countries: ["Emirate of Sicily", "Kalbids"] }
        ],
        labels: [{ text: "Sicilia normanna", pos: [37.5, 14.0], color: "#2563eb" }],
        markers: [
            { title: "Messina: sbarco normanno del 1061", pos: [38.1938, 15.5540], icon: "ship", color: "#2563eb" },
            { title: "Palermo: conquistata nel 1072", pos: [38.1157, 13.3615], icon: "castle", color: "#2563eb" },
            { title: "Noto: ultima roccaforte conquistata nel 1091", pos: [36.8924, 15.0652], icon: "flag", color: "#2563eb" }
        ],
        bounds: [[35, 11], [39.5, 16.7]],
        duration: { start: 1061, end: 1091, label: "Conquista normanna della Sicilia (1061–1091)" }
    },
    {
        id: "kingdom-of-sicily",
        title: "Nascita del Regno di Sicilia",
        year: 1130,
        eraText: "25 dicembre 1130",
        description: "Ruggero II d'Altavilla viene incoronato re a Palermo. Sicilia e domini normanni dell'Italia meridionale sono riuniti in un regno mediterraneo caratterizzato da un'amministrazione centralizzata e dall'incontro di tradizioni latine, greche e islamiche.",
        groups: [{ name: "Regno di Sicilia", color: "#2563eb", countries: ["Kingdom of Sicily", "Sicily", "Normans"] }],
        labels: [
            { text: "Regno di Sicilia", pos: [38.7, 15.0], color: "#2563eb" },
            { text: "Domini continentali", pos: [40.7, 16.0], color: "#2563eb" }
        ],
        markers: [{ title: "Palermo: incoronazione di Ruggero II", pos: [38.1157, 13.3615], icon: "crown", color: "#f59e0b" }],
        bounds: [[34.5, 10.5], [43, 19]]
    }
];

