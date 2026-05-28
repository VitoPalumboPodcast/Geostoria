import { historicalEvents } from './events.js';

// Estremi temporali della timeline principale
const MIN_YEAR = -3100;
const MAX_YEAR = 2030;
const YEAR_SPAN = MAX_YEAR - MIN_YEAR;

// Parametri di zoom
const MIN_PX_PER_YEAR = 0.15; // Zoom out massimo (circa 770px totali)
const MAX_PX_PER_YEAR = 4.0;  // Zoom in massimo (circa 20600px totali)
let pixelsPerYear = 0.35;    // Zoom iniziale predefinito (circa 1800px totali)

// Stato scorrimento e drag
let currentScrollX = 0;
let isDragging = false;
let startX = 0;
let initialScrollX = 0;
let dragVelocity = 0;
let lastDragTime = 0;
let lastDragX = 0;
let inertiaFrame = null;

// Elementi DOM cache
let wrapper = null;
let container = null;
let ticksContainer = null;
let eventsContainer = null;
let durationsContainer = null; // Memorizza il container delle barre di durata
let playBtn = null;

// Callbacks esterne
let onEventSelectedCallback = null;

// Stato di riproduzione automatica
let isPlaying = false;
let playbackTimer = null;
let activeEventId = null;
let playbackSpeed = 3; // Scala da 1 a 5

// Inizializza la timeline
export function initializeTimeline(options) {
    wrapper = document.getElementById('timeline-wrapper');
    container = document.getElementById('timeline-drag-container');
    ticksContainer = document.getElementById('timeline-ticks');
    eventsContainer = document.getElementById('timeline-events');
    durationsContainer = document.getElementById('timeline-durations');
    playBtn = document.getElementById('play-btn');
    onEventSelectedCallback = options.onEventSelected;

    // Configura eventi drag/pan della timeline
    setupDragEvents();
    
    // Configura bottoni zoom e reset
    document.getElementById('zoom-in-btn').addEventListener('click', () => zoomTimeline(1.3));
    document.getElementById('zoom-out-btn').addEventListener('click', () => zoomTimeline(1 / 1.3));
    document.getElementById('reset-timeline-btn').addEventListener('click', resetTimelineZoom);
    
    // Configura riproduzione
    playBtn.addEventListener('click', togglePlayback);
    
    document.getElementById('speed-slider').addEventListener('input', (e) => {
        playbackSpeed = parseInt(e.target.value);
        if (isPlaying) {
            restartPlaybackTimer();
        }
    });

    // Ascolta il resize per adattare i limiti di scroll
    window.addEventListener('resize', clampScroll);

    // Render iniziale
    renderTimeline();
    
    // Seleziona il primo evento all'avvio
    if (historicalEvents.length > 0) {
        selectEvent(historicalEvents[0].id, false);
    }
}

// Calcola la larghezza totale della timeline
function getTimelineWidth() {
    return YEAR_SPAN * pixelsPerYear;
}

// Configura i drag events della timeline
function setupDragEvents() {
    wrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        initialScrollX = currentScrollX;
        lastDragX = e.clientX;
        lastDragTime = Date.now();
        dragVelocity = 0;
        cancelAnimationFrame(inertiaFrame);
        wrapper.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        currentScrollX = initialScrollX + deltaX;
        
        // Calcolo velocità per inerzia
        const now = Date.now();
        const dt = now - lastDragTime;
        if (dt > 0) {
            dragVelocity = (e.clientX - lastDragX) / dt;
        }
        lastDragX = e.clientX;
        lastDragTime = now;
        
        applyTransform();
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        wrapper.style.cursor = 'grab';
        
        // Applica scorrimento inerziale se rilasciato in movimento veloce
        if (Math.abs(dragVelocity) > 0.1) {
            applyInertia();
        } else {
            clampScroll();
        }
    });

    wrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        const touch = e.touches[0];
        isDragging = true;
        startX = touch.clientX;
        initialScrollX = currentScrollX;
        lastDragX = touch.clientX;
        lastDragTime = Date.now();
        dragVelocity = 0;
        cancelAnimationFrame(inertiaFrame);
    }, { passive: true });

    wrapper.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();

        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        currentScrollX = initialScrollX + deltaX;

        const now = Date.now();
        const dt = now - lastDragTime;
        if (dt > 0) {
            dragVelocity = (touch.clientX - lastDragX) / dt;
        }
        lastDragX = touch.clientX;
        lastDragTime = now;

        applyTransform();
    }, { passive: false });

    const finishTouchDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        if (Math.abs(dragVelocity) > 0.1) {
            applyInertia();
        } else {
            clampScroll();
        }
    };

    window.addEventListener('touchend', finishTouchDrag);
    window.addEventListener('touchcancel', finishTouchDrag);
    
    // Supporto per scroll con la rotellina del mouse (orizzontale)
    wrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        cancelAnimationFrame(inertiaFrame);
        // Usa deltaY o deltaX a seconda di come l'utente scorre
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        currentScrollX -= delta * 0.8;
        clampScroll();
        applyTransform();
    });
}

// Applica l'effetto inerziale al rilascio del drag
function applyInertia() {
    const decay = 0.94; // Coefficiente attrito
    currentScrollX += dragVelocity * 16; // Incremento
    dragVelocity *= decay;
    
    applyTransform();
    
    // Controlla se sforiamo i limiti e decelera più in fretta
    const minScroll = getMinScroll();
    if (currentScrollX > 50 || currentScrollX < minScroll - 50) {
        dragVelocity *= 0.6; // Freno a molla
    }

    if (Math.abs(dragVelocity) > 0.02) {
        inertiaFrame = requestAnimationFrame(applyInertia);
    } else {
        clampScroll();
        applyTransform();
    }
}

// Calcola lo scroll minimo consentito
function getMinScroll() {
    const viewportWidth = wrapper.clientWidth;
    const timelineWidth = getTimelineWidth();
    return Math.min(0, viewportWidth - timelineWidth);
}

// Limita lo scroll all'interno dei confini fisici
function clampScroll() {
    const minScroll = getMinScroll();
    if (currentScrollX > 0) {
        currentScrollX = 0;
    } else if (currentScrollX < minScroll) {
        currentScrollX = minScroll;
    }
}

// Applica lo spostamento CSS3 tramite GPU (translate3d per massime performance)
function applyTransform() {
    container.style.transform = `translate3d(${currentScrollX}px, 0, 0)`;
}

// Rende visibile e allinea la timeline su un determinato anno
export function centerTimelineOnYear(year, smooth = true) {
    const viewportWidth = wrapper.clientWidth;
    const yearX = (year - MIN_YEAR) * pixelsPerYear;
    
    // Posiziona l'anno esattamente al centro del viewport
    const targetScroll = -(yearX - viewportWidth / 2);
    
    cancelAnimationFrame(inertiaFrame);
    
    if (smooth) {
        // Transizione animata fluida dello scroll della timeline
        animateScroll(targetScroll);
    } else {
        currentScrollX = targetScroll;
        clampScroll();
        applyTransform();
    }
}

// Anima lo scorrimento della timeline su una coordinata target
function animateScroll(targetX) {
    const startX = currentScrollX;
    // Calcola il target clippato per evitare sobbalzi
    const viewportWidth = wrapper.clientWidth;
    const timelineWidth = getTimelineWidth();
    const clampedTarget = Math.max(Math.min(0, targetX), Math.min(0, viewportWidth - timelineWidth));
    
    const distance = clampedTarget - startX;
    const duration = 800; // ms
    const startTime = performance.now();
    
    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing cubic out
        const ease = 1 - Math.pow(1 - progress, 3);
        currentScrollX = startX + distance * ease;
        
        applyTransform();
        
        if (progress < 1) {
            inertiaFrame = requestAnimationFrame(step);
        } else {
            clampScroll();
            applyTransform();
        }
    }
    
    inertiaFrame = requestAnimationFrame(step);
}

// Funzione di Zoom
function zoomTimeline(zoomFactor) {
    const newPixelsPerYear = Math.max(MIN_PX_PER_YEAR, Math.min(MAX_PX_PER_YEAR, pixelsPerYear * zoomFactor));
    
    if (newPixelsPerYear === pixelsPerYear) return;
    
    // Trova l'anno attualmente al centro dello schermo prima dello zoom per preservare il focus visivo
    const viewportWidth = wrapper.clientWidth;
    const centerYear = MIN_YEAR + (-currentScrollX + viewportWidth / 2) / pixelsPerYear;
    
    pixelsPerYear = newPixelsPerYear;
    
    // Ridisegna l'asse e i marker con la nuova scala
    renderTimeline();
    
    // Ricentra sull'anno mantenendo l'inquadratura costante
    centerTimelineOnYear(centerYear, false);
}

// Ripristina lo zoom iniziale
function resetTimelineZoom() {
    pixelsPerYear = 0.35;
    renderTimeline();
    if (activeEventId) {
        const ev = historicalEvents.find(e => e.id === activeEventId);
        if (ev) centerTimelineOnYear(ev.year, true);
    } else {
        centerTimelineOnYear(0, true);
    }
}

// Calcola l'intervallo ideale per i tick temporali in base allo zoom corrente
function getTickInterval() {
    if (pixelsPerYear < 0.22) return 1000;
    if (pixelsPerYear < 0.5) return 500;
    if (pixelsPerYear < 1.2) return 100;
    if (pixelsPerYear < 2.5) return 50;
    return 10; // Zoom massimo: un tick ogni 10 anni
}

// Genera graficamente l'asse dei tick temporali e i marker degli eventi
function renderTimeline() {
    const timelineWidth = getTimelineWidth();
    container.style.width = `${timelineWidth}px`;
    
    // 1. Pulisci ed emetti i Ticks temporali
    ticksContainer.innerHTML = '';
    const interval = getTickInterval();
    
    // Trova il primo anno multiplo dell'intervallo
    const startTickYear = Math.ceil(MIN_YEAR / interval) * interval;
    
    for (let y = startTickYear; y <= MAX_YEAR; y += interval) {
        const x = (y - MIN_YEAR) * pixelsPerYear;
        const tick = document.createElement('div');
        tick.className = 'tick';
        // Definisce tick primari (maggiori) e secondari per migliorare la leggibilità grafica
        const isMajor = y % (interval * 2) === 0 || y === 0 || y === 1900 || y === 2000;
        if (isMajor) {
            tick.classList.add('major');
        }
        tick.style.left = `${x}px`;
        
        // Formatta testo etichetta dell'era (a.C. o d.C.)
        let labelText = '';
        if (isMajor) {
            if (y < 0) {
                labelText = `${Math.abs(y)} a.C.`;
            } else if (y === 0) {
                labelText = `1 d.C.`; // storicamente non esiste l'anno zero
            } else {
                labelText = `${y}`;
            }
        }
        
        tick.innerHTML = `
            <div class="tick-line"></div>
            ${labelText ? `<div class="tick-label">${labelText}</div>` : ''}
        `;
        ticksContainer.appendChild(tick);
    }
    
    // 2. Genera i Marker degli Eventi
    eventsContainer.innerHTML = '';
    historicalEvents.forEach(event => {
        const x = (event.year - MIN_YEAR) * pixelsPerYear;
        const marker = document.createElement('div');
        marker.className = 'event-marker';
        if (event.id === activeEventId) {
            marker.classList.add('active');
        }
        marker.style.left = `${x}px`;
        marker.dataset.eventId = event.id;
        
        marker.innerHTML = `
            <div class="event-marker-dot"></div>
            <div class="event-marker-label">${event.eraText}: ${event.title}</div>
        `;
        
        // Click sul marker
        marker.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita il drag trigger
            selectEvent(event.id, true);
        });
        
        eventsContainer.appendChild(marker);
    });

    // 3. Genera le Barre di Durata degli Assetti Statuali (Regni/Imperi)
    durationsContainer.innerHTML = '';
    historicalEvents.forEach((event, index) => {
        if (event.duration) {
            const startYear = Math.max(MIN_YEAR, event.duration.start);
            const endYear = Math.min(MAX_YEAR, event.duration.end);
            const xStart = (startYear - MIN_YEAR) * pixelsPerYear;
            const xEnd = (endYear - MIN_YEAR) * pixelsPerYear;
            const width = Math.max(6, xEnd - xStart); // Larghezza minima 6px
            
            const bar = document.createElement('div');
            bar.className = `duration-bar track-${index % 2}`;
            if (event.id === activeEventId) {
                bar.classList.add('active');
            }
            bar.style.left = `${xStart}px`;
            bar.style.width = `${width}px`;
            bar.dataset.eventId = event.id;
            
            bar.innerHTML = `
                <div class="duration-label">${event.duration.label}</div>
            `;
            
            // Rende la barra interattiva (cliccando si seleziona l'evento collegato)
            bar.style.pointerEvents = 'auto';
            bar.addEventListener('click', (e) => {
                e.stopPropagation();
                selectEvent(event.id, true);
            });
            
            durationsContainer.appendChild(bar);
        }
    });
}

// Evidenzia un evento graficamente e notifica l'orchestratore
export function selectEvent(eventId, triggerCallback = true) {
    if (activeEventId === eventId && triggerCallback) {
        // Se è già attivo, ricentra solo la timeline su di esso
        const ev = historicalEvents.find(e => e.id === eventId);
        if (ev) centerTimelineOnYear(ev.year, true);
        return;
    }
    
    activeEventId = eventId;
    
    // Aggiorna classi CSS attive sui marker
    const markers = eventsContainer.querySelectorAll('.event-marker');
    markers.forEach(marker => {
        if (marker.dataset.eventId === eventId) {
            marker.classList.add('active');
        } else {
            marker.classList.remove('active');
        }
    });

    // Aggiorna classi CSS attive sulle barre di durata
    if (durationsContainer) {
        const bars = durationsContainer.querySelectorAll('.duration-bar');
        bars.forEach(bar => {
            if (bar.dataset.eventId === eventId) {
                bar.classList.add('active');
            } else {
                bar.classList.remove('active');
            }
        });
    }
    
    const activeEvent = historicalEvents.find(e => e.id === eventId);
    if (activeEvent) {
        // Ricentra timeline sull'evento selezionato
        centerTimelineOnYear(activeEvent.year, true);
        
        // Notifica il componente principale per allineare mappa ed info card
        if (triggerCallback && onEventSelectedCallback) {
            onEventSelectedCallback(activeEvent);
        }
    }
}

// Gestione Riproduzione Automatica (Play/Pause)
function togglePlayback() {
    if (isPlaying) {
        pausePlayback();
    } else {
        startPlayback();
    }
}

export function startPlayback() {
    if (isPlaying) return;
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    playBtn.classList.add('active');
    restartPlaybackTimer();
}

export function pausePlayback() {
    if (!isPlaying) return;
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    playBtn.classList.remove('active');
    if (playbackTimer) {
        clearTimeout(playbackTimer);
        playbackTimer = null;
    }
}

function restartPlaybackTimer() {
    if (playbackTimer) {
        clearTimeout(playbackTimer);
    }
    
    // Calcola il delay in millisecondi in base alla velocità impostata (da 1 a 5)
    // 5 -> 2.5s (veloce), 3 -> 5s (medio), 1 -> 9s (lento)
    const delay = (6 - playbackSpeed) * 1800;
    
    playbackTimer = setTimeout(() => {
        if (!isPlaying) return;
        
        // Passa al prossimo evento
        const currentIndex = historicalEvents.findIndex(e => e.id === activeEventId);
        let nextIndex = currentIndex + 1;
        if (nextIndex >= historicalEvents.length) {
            nextIndex = 0; // ricomincia in loop
        }
        
        const nextEvent = historicalEvents[nextIndex];
        selectEvent(nextEvent.id, true);
        
        // Prenota il prossimo scatto
        restartPlaybackTimer();
    }, delay);
}
