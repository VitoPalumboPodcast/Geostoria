// Relazioni curate tra eventi. Il testo descrive il nesso senza ridurlo a una causalità unica.
export const causalLinks = [
    { from: 'early-civilizations', to: 'babylonian-egyptian-era', text: 'La nascita degli Stati e della scrittura prepara le successive monarchie territoriali del Vicino Oriente.' },
    { from: 'greek-first-colonization', to: 'greek-second-colonization', text: 'Le reti egee e gli insediamenti più antichi preparano la grande espansione coloniale greca nel Mediterraneo.' },
    { from: 'phoenicians-mediterranean', to: 'greek-second-colonization', text: 'Le rotte fenicie e quelle greche si sviluppano nello stesso spazio mediterraneo, alternando scambi e competizione.' },
    { from: 'alexander-empire', to: 'roman-empire-peak', text: 'I regni ellenistici nati dalle conquiste di Alessandro vengono progressivamente assorbiti da Roma.' },
    { from: 'roman-empire-peak', to: 'fall-western-roman-empire', text: 'La divisione politica, le pressioni esterne e le trasformazioni interne conducono alla dissoluzione dell’autorità imperiale in Occidente.' },
    { from: 'fall-western-roman-empire', to: 'post-roman-population-movements', text: 'La fine del governo imperiale occidentale accelera il consolidamento dei regni romano-germanici.' },
    { from: 'post-roman-population-movements', to: 'lombard-invasion-italy', text: 'Il nuovo equilibrio dei regni germanici precede l’ingresso dei Longobardi in un’Italia ancora contesa con Bisanzio.' },
    { from: 'islam-birth-expansion', to: 'battle-of-poitiers', text: 'L’espansione omayyade attraverso il Nord Africa e la penisola iberica porta le forze musulmane oltre i Pirenei.' },
    { from: 'lombard-invasion-italy', to: 'donation-of-sutri', text: 'La pressione longobarda e la debolezza bizantina favoriscono la formazione di un dominio territoriale pontificio.' },
    { from: 'battle-of-poitiers', to: 'rise-of-carolingians', text: 'Il prestigio militare acquisito dai Pipinidi con Carlo Martello sostiene la successiva ascesa dinastica di Pipino il Breve.' },
    { from: 'rise-of-carolingians', to: 'carolingian-expansion', text: 'Il consolidamento della nuova dinastia fornisce a Carlo Magno la base politica per le campagne di espansione.' },
    { from: 'carolingian-expansion', to: 'charlemagne-empire', text: 'Le conquiste di Carlo Magno rendono possibile la sua incoronazione imperiale nell’anno 800.' },
    { from: 'charlemagne-empire', to: 'death-of-charlemagne', text: 'La successione di Ludovico il Pio apre il problema della conservazione dell’unità dell’Impero carolingio.' },
    { from: 'death-of-charlemagne', to: 'treaty-of-verdun', text: 'Le lotte tra gli eredi di Ludovico il Pio conducono alla spartizione sancita a Verdun.' },
    { from: 'treaty-of-verdun', to: 'capitulary-of-quierzy', text: 'La divisione dell’Impero indebolisce il centro e accresce il peso politico delle aristocrazie territoriali.' },
    { from: 'treaty-of-verdun', to: 'end-carolingian-unity', text: 'La frammentazione dinastica culmina nella deposizione di Carlo il Grosso e nella fine dell’unità carolingia.' },
    { from: 'end-carolingian-unity', to: 'second-invasions-incastellamento', text: 'La debolezza dei poteri centrali rende più difficile contrastare le incursioni e favorisce difese e poteri locali.' },
    { from: 'second-invasions-incastellamento', to: 'duchy-of-normandy', text: 'L’insediamento dei Vichinghi lungo la Senna trasforma una minaccia militare nel Ducato di Normandia.' },
    { from: 'second-invasions-incastellamento', to: 'battle-of-lechfeld', text: 'Le incursioni ungare nell’Europa centrale culminano nella sconfitta subita a Lechfeld.' },
    { from: 'battle-of-lechfeld', to: 'ottonian-empire', text: 'La vittoria sugli Ungari rafforza Ottone I e prepara la sua incoronazione imperiale del 962.' },
    { from: 'end-carolingian-unity', to: 'capetian-dynasty', text: 'L’estinzione della linea carolingia occidentale apre l’elezione di Ugo Capeto e una nuova dinastia in Francia.' },
    { from: 'second-invasions-incastellamento', to: 'medieval-expansion-around-1000', text: 'La stabilizzazione successiva alle grandi incursioni accompagna la ripresa demografica, agricola e urbana.' },
    { from: 'capitulary-of-quierzy', to: 'constitutio-de-feudis', text: 'La crescente ereditarietà dei poteri aristocratici trova un ulteriore sviluppo nella tutela dei benefici dei vassalli minori.' },
    { from: 'duchy-of-normandy', to: 'battle-of-hastings', text: 'Il ducato fondato da Rollone diventa la base politica e militare della conquista normanna dell’Inghilterra.' },
    { from: 'normans-in-melfi', to: 'accord-of-melfi', text: 'Il consolidamento normanno in Puglia conduce al riconoscimento pontificio di Roberto il Guiscardo.' },
    { from: 'accord-of-melfi', to: 'norman-conquest-sicily', text: 'L’investitura papale legittima il progetto normanno di conquista della Sicilia musulmana.' },
    { from: 'norman-conquest-sicily', to: 'kingdom-of-sicily', text: 'L’unificazione delle conquiste insulari e continentali permette a Ruggero II di fondare il Regno di Sicilia.' },
    { from: 'kingdom-of-sicily', to: 'ottoman-peak', text: 'Il Regno di Sicilia anticipa la centralità del Mediterraneo che caratterizzerà anche l’espansione ottomana nei secoli successivi.' },
    { from: 'napoleonic-wars', to: 'world-war-one', text: 'Il riassetto europeo successivo a Napoleone alimenta il sistema degli Stati e dei nazionalismi dell’Ottocento.' },
    { from: 'world-war-one', to: 'world-war-two', text: 'I trattati, le crisi economiche e i conflitti politici irrisolti del primo dopoguerra contribuiscono alla nuova guerra mondiale.' },
    { from: 'world-war-two', to: 'cold-war', text: 'La sconfitta delle potenze dell’Asse lascia Stati Uniti e Unione Sovietica al centro del nuovo ordine bipolare.' },
    { from: 'cold-war', to: 'contemporary-era', text: 'La dissoluzione dell’Unione Sovietica conclude l’ordine bipolare e apre la fase contemporanea.' }
];

export function getRelatedEventLinks(eventId) {
    return causalLinks.flatMap(link => {
        if (link.from === eventId) return [{...link, eventId: link.to, direction: 'conseguenza'}];
        if (link.to === eventId) return [{...link, eventId: link.from, direction: 'premessa'}];
        return [];
    });
}
