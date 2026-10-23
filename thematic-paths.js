export const thematicPaths = [
    {
        id: 'norman-expansion',
        title: 'Dalla Scandinavia al Regno di Sicilia',
        shortTitle: 'Segui il percorso dei Normanni',
        color: '#2563eb',
        description: 'Incursioni, insediamenti e conquiste normanne dalla Scandinavia alla Senna, all’Inghilterra e all’Italia meridionale tra IX e XII secolo.',
        eventIds: ['second-invasions-incastellamento', 'duchy-of-normandy', 'county-of-aversa', 'normans-in-melfi', 'accord-of-melfi', 'battle-of-hastings', 'norman-conquest-sicily', 'kingdom-of-sicily']
    },
    {
        id: 'carolingian-feudal-transition',
        title: 'Dai Pipinidi alla frammentazione feudale',
        shortTitle: 'Segui la trasformazione carolingia',
        color: '#d97706',
        description: 'Ascesa, espansione e divisione dell’Impero carolingio, fino al rafforzamento dei poteri territoriali e dei rapporti feudali.',
        eventIds: ['battle-of-poitiers', 'rise-of-carolingians', 'carolingian-expansion', 'charlemagne-empire', 'death-of-charlemagne', 'treaty-of-verdun', 'capitulary-of-quierzy', 'end-carolingian-unity', 'constitutio-de-feudis']
    },
    {
        id: 'rome-to-middle-ages',
        title: 'Da Roma ai regni dell’Alto Medioevo',
        shortTitle: 'Segui la trasformazione del mondo romano',
        color: '#7c3aed',
        description: 'Dal massimo sviluppo dell’Impero romano alla formazione dei regni romano-germanici e alla divisione politica dell’Italia.',
        eventIds: ['roman-empire-peak', 'fall-western-roman-empire', 'post-roman-population-movements', 'lombard-invasion-italy', 'donation-of-sutri']
    }
];

export function getThematicPathsForEvent(eventId) {
    return thematicPaths.filter(path => path.eventIds.includes(eventId));
}
