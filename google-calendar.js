// =====================================================
// SKALETTE BISTRO - Google Calendar Integration
// =====================================================
// Sincronizza le prenotazioni con Google Calendar
// Eventi arancioni = Da confermare
// Eventi verdi = Confermati
// =====================================================

// Configurazione Google Calendar
// ISTRUZIONI PER CONFIGURARE:
// 1. Vai su https://console.cloud.google.com/
// 2. Crea un nuovo progetto "Skalette Bistro Calendar"
// 3. Abilita "Google Calendar API" dal menu API e servizi
// 4. Crea credenziali > Chiave API (per uso semplice)
// 5. Oppure: Crea credenziali > ID client OAuth 2.0 (per accesso completo)
// 6. Inserisci i dati qui sotto

const GOOGLE_CALENDAR_CONFIG = {
    // ID del calendario
    calendarId: 'u8337298279@gmail.com',
    
    // API Key (non necessaria per OAuth)
    apiKey: '',
    
    // Client ID OAuth
    clientId: '199355762010-6g20j5g849s9m34785dt0aif4oj8gopa.apps.googleusercontent.com',
    
    // Colori eventi Google Calendar
    colors: {
        pending: '6',      // Arancione - Da confermare
        confirmed: '10',   // Verde - Confermato
        rejected: '11'     // Rosso - Rifiutato
    }
};

// Etichette per i tipi di pasto
const MEAL_LABELS = {
    pranzo: { emoji: '☀️', label: 'Pranzo' },
    aperitivo: { emoji: '🍹', label: 'Aperitivo' },
    cena: { emoji: '🌙', label: 'Cena' },
    dopocena: { emoji: '🌃', label: 'Dopocena' }
};

// Durata eventi in minuti
const EVENT_DURATIONS = {
    pranzo: 120,
    aperitivo: 90,
    cena: 120,
    dopocena: 90
};

// =====================================================
// GOOGLE IDENTITY SERVICES (OAuth 2.0)
// =====================================================

let tokenClient = null;
let accessToken = null;

// Inizializza Google Identity Services
function initGoogleCalendar() {
    return new Promise((resolve, reject) => {
        // Carica la libreria Google Identity Services
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (GOOGLE_CALENDAR_CONFIG.clientId === 'YOUR_CLIENT_ID') {
                console.warn('⚠️ Google Calendar: Configura clientId in google-calendar.js');
                resolve(false);
                return;
            }
            
            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CALENDAR_CONFIG.clientId,
                scope: 'https://www.googleapis.com/auth/calendar.events',
                callback: (response) => {
                    if (response.access_token) {
                        accessToken = response.access_token;
                        console.log('✅ Google Calendar: Autenticato');
                    }
                }
            });
            
            // Controlla se abbiamo già un token salvato
            const savedToken = localStorage.getItem('gcal_access_token');
            if (savedToken) {
                accessToken = savedToken;
            }
            
            resolve(true);
        };
        script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
        document.head.appendChild(script);
    });
}

// Richiedi accesso a Google Calendar (mostra popup login)
function requestCalendarAccess() {
    return new Promise((resolve, reject) => {
        if (!tokenClient) {
            reject(new Error('Google Calendar non inizializzato'));
            return;
        }
        
        tokenClient.callback = (response) => {
            if (response.error) {
                reject(new Error(response.error));
                return;
            }
            accessToken = response.access_token;
            localStorage.setItem('gcal_access_token', accessToken);
            console.log('✅ Accesso Google Calendar autorizzato');
            resolve(accessToken);
        };
        
        tokenClient.requestAccessToken({ prompt: 'consent' });
    });
}

// Verifica se siamo autenticati
function isCalendarAuthenticated() {
    return accessToken !== null;
}

// =====================================================
// CREAZIONE EVENTI CALENDARIO
// =====================================================

// Formatta la data per Google Calendar (ISO 8601)
function formatDateTimeForCalendar(date, time) {
    return `${date}T${time}:00`;
}

// Calcola orario fine evento
function calculateEndTime(startTime, mealType) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const duration = EVENT_DURATIONS[mealType] || 120;
    
    let endMinutes = minutes + duration;
    let endHours = hours + Math.floor(endMinutes / 60);
    endMinutes = endMinutes % 60;
    
    // Gestisci passaggio a giorno successivo
    if (endHours >= 24) {
        endHours = endHours - 24;
    }
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}

// Genera titolo evento
function generateEventTitle(reservation, status) {
    const statusEmoji = status === 'confirmed' ? '✅' : status === 'rejected' ? '❌' : '🔔';
    const statusText = status === 'confirmed' ? 'CONFERMATO' : status === 'rejected' ? 'RIFIUTATO' : 'DA CONFERMARE';
    
    return `${statusEmoji} ${statusText} - ${reservation.name}`;
}

// Genera descrizione evento con tutti i dettagli
function generateEventDescription(reservation) {
    const mealInfo = MEAL_LABELS[reservation.mealType] || { emoji: '🍽️', label: reservation.mealType };
    
    let description = `👤 Cliente: ${reservation.name}\n`;
    description += `📱 Telefono: ${reservation.phone}\n`;
    if (reservation.email) {
        description += `📧 Email: ${reservation.email}\n`;
    }
    description += `\n`;
    description += `👥 Persone: ${reservation.guests}\n`;
    description += `🪑 Tavolo: ${reservation.tableName || reservation.tableId}\n`;
    description += `${mealInfo.emoji} Tipo: ${mealInfo.label}\n`;
    
    if (reservation.notes && reservation.notes.trim()) {
        description += `\n📝 NOTE:\n${reservation.notes}\n`;
    }
    
    description += `\n---\n`;
    description += `ID Prenotazione: ${reservation.id || 'N/A'}\n`;
    description += `Creata il: ${new Date(reservation.createdAt).toLocaleString('it-IT')}`;
    
    return description;
}

// Crea evento su Google Calendar (con retry automatico)
async function createCalendarEvent(reservation, retryCount = 0) {
    const MAX_RETRIES = 2;
    
    if (!accessToken) {
        console.warn('⚠️ Google Calendar: Non autenticato, evento non creato');
        return { success: false, error: 'Non autenticato' };
    }
    
    if (GOOGLE_CALENDAR_CONFIG.calendarId === 'YOUR_CALENDAR_ID') {
        console.warn('⚠️ Google Calendar: Configura calendarId');
        return { success: false, error: 'Calendar ID non configurato' };
    }
    
    // Usa lo status della prenotazione se disponibile, altrimenti 'pending'
    const status = reservation.status || 'pending';
    
    const mealInfo = MEAL_LABELS[reservation.mealType] || { emoji: '🍽️', label: reservation.mealType };
    const endTime = calculateEndTime(reservation.time, reservation.mealType);
    
    // Determina se la fine è il giorno successivo
    let endDate = reservation.date;
    const [startHour] = reservation.time.split(':').map(Number);
    const [endHour] = endTime.split(':').map(Number);
    if (endHour < startHour) {
        // L'evento finisce il giorno dopo
        const nextDay = new Date(reservation.date);
        nextDay.setDate(nextDay.getDate() + 1);
        endDate = nextDay.toISOString().split('T')[0];
    }
    
    const event = {
        summary: generateEventTitle(reservation, status),
        description: generateEventDescription(reservation),
        location: 'Skalette Bistro',
        start: {
            dateTime: formatDateTimeForCalendar(reservation.date, reservation.time),
            timeZone: 'Europe/Rome'
        },
        end: {
            dateTime: formatDateTimeForCalendar(endDate, endTime),
            timeZone: 'Europe/Rome'
        },
        colorId: GOOGLE_CALENDAR_CONFIG.colors[status] || GOOGLE_CALENDAR_CONFIG.colors.pending,
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'popup', minutes: 60 },
                { method: 'popup', minutes: 15 }
            ]
        }
    };
    
    try {
        console.log('📅 Tentativo creazione evento:', reservation.name, '(retry:', retryCount, ')');
        
        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_CONFIG.calendarId)}/events`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            }
        );
        
        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Errore creazione evento:', error);
            
            // Se token scaduto (401), riprova dopo refresh
            if (response.status === 401 && retryCount < MAX_RETRIES) {
                console.log('🔄 Token scaduto, tento refresh...');
                accessToken = null;
                localStorage.removeItem('gcal_access_token');
                // Il prossimo tentativo fallirà con "non autenticato"
                return { success: false, error: 'Token scaduto - riconnetti il calendario', needsReauth: true };
            }
            
            return { success: false, error: error.error?.message || 'Errore sconosciuto' };
        }
        
        const createdEvent = await response.json();
        console.log('✅ Evento calendario creato:', createdEvent.id);
        
        return { 
            success: true, 
            eventId: createdEvent.id,
            eventLink: createdEvent.htmlLink
        };
        
    } catch (error) {
        console.error('❌ Errore creazione evento:', error);
        
        // Retry su errore di rete
        if (retryCount < MAX_RETRIES) {
            console.log('🔄 Errore di rete, riprovo tra 2 secondi...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            return createCalendarEvent(reservation, retryCount + 1);
        }
        
        return { success: false, error: error.message };
    }
}

// Aggiorna evento esistente (quando confermi/rifiuti)
async function updateCalendarEvent(eventId, reservation, newStatus) {
    console.log('📅 updateCalendarEvent chiamato:', { eventId, newStatus, hasToken: !!accessToken });
    
    if (!accessToken) {
        console.warn('⚠️ Token mancante - impossibile aggiornare evento');
        return { success: false, error: 'Token mancante' };
    }
    
    if (!eventId) {
        console.warn('⚠️ EventId mancante - impossibile aggiornare evento');
        return { success: false, error: 'EventId mancante' };
    }
    
    const endTime = calculateEndTime(reservation.time, reservation.mealType || 'cena');
    
    // Determina se la fine è il giorno successivo
    let endDate = reservation.date;
    const [startHour] = reservation.time.split(':').map(Number);
    const [endHour] = endTime.split(':').map(Number);
    if (endHour < startHour) {
        const nextDay = new Date(reservation.date);
        nextDay.setDate(nextDay.getDate() + 1);
        endDate = nextDay.toISOString().split('T')[0];
    }
    
    const event = {
        summary: generateEventTitle(reservation, newStatus),
        description: generateEventDescription(reservation),
        location: 'Skalette Bistro',
        start: {
            dateTime: formatDateTimeForCalendar(reservation.date, reservation.time),
            timeZone: 'Europe/Rome'
        },
        end: {
            dateTime: formatDateTimeForCalendar(endDate, endTime),
            timeZone: 'Europe/Rome'
        },
        colorId: GOOGLE_CALENDAR_CONFIG.colors[newStatus] || GOOGLE_CALENDAR_CONFIG.colors.pending
    };
    
    console.log('📅 Invio aggiornamento a Google Calendar:', event.summary);
    
    try {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_CONFIG.calendarId)}/events/${eventId}`;
        console.log('📅 URL:', url);
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Errore aggiornamento evento:', error);
            return { success: false, error: error.error?.message };
        }
        
        const updatedEvent = await response.json();
        console.log(`✅ Evento aggiornato a: ${newStatus}`, updatedEvent.id);
        return { success: true };
        
    } catch (error) {
        console.error('❌ Errore aggiornamento evento:', error);
        return { success: false, error: error.message };
    }
}

// Elimina evento dal calendario
async function deleteCalendarEvent(eventId) {
    if (!accessToken || !eventId) {
        return { success: false };
    }
    
    try {
        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_CONFIG.calendarId)}/events/${eventId}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        
        if (response.status === 204 || response.ok) {
            console.log('✅ Evento eliminato dal calendario');
            return { success: true };
        }
        
        return { success: false };
        
    } catch (error) {
        console.error('❌ Errore eliminazione evento:', error);
        return { success: false, error: error.message };
    }
}

// =====================================================
// SINCRONIZZAZIONE PRENOTAZIONI ESISTENTI
// =====================================================

// Sincronizza una prenotazione che non ha ancora l'evento calendario
async function syncReservationToCalendar(reservation) {
    if (!accessToken) {
        console.warn('⚠️ Google Calendar: Non autenticato');
        return { success: false, error: 'Non autenticato' };
    }
    
    // Se ha già un evento calendario, non fare nulla
    if (reservation.calendarEventId) {
        console.log('ℹ️ Prenotazione già sincronizzata:', reservation.id);
        return { success: true, eventId: reservation.calendarEventId, alreadySynced: true };
    }
    
    // Crea l'evento
    const result = await createCalendarEvent(reservation);
    return result;
}

// Sincronizza tutte le prenotazioni senza evento calendario
async function syncAllReservationsToCalendar(reservations, updateCallback) {
    if (!accessToken) {
        console.warn('⚠️ Google Calendar: Non autenticato');
        return { success: false, synced: 0 };
    }
    
    let synced = 0;
    const toSync = reservations.filter(r => !r.calendarEventId && r.status !== 'rejected');
    
    console.log(`📅 Sincronizzazione: ${toSync.length} prenotazioni da sincronizzare`);
    
    if (toSync.length === 0) {
        return { success: true, synced: 0, total: 0 };
    }
    
    // Sync in parallelo con batch di 5 per velocità
    const BATCH_SIZE = 5;
    for (let i = 0; i < toSync.length; i += BATCH_SIZE) {
        const batch = toSync.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(batch.map(async (reservation) => {
            const result = await createCalendarEvent(reservation);
            if (result.success && result.eventId && updateCallback) {
                await updateCallback(reservation.id, result.eventId);
            }
            return result;
        }));
        synced += results.filter(r => r.success).length;
    }
    
    console.log(`✅ Sincronizzazione completata: ${synced}/${toSync.length} prenotazioni`);
    return { success: true, synced, total: toSync.length };
}

// =====================================================
// ESPORTAZIONE FUNZIONI
// =====================================================

export {
    GOOGLE_CALENDAR_CONFIG,
    initGoogleCalendar,
    requestCalendarAccess,
    isCalendarAuthenticated,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    syncReservationToCalendar,
    syncAllReservationsToCalendar,
    MEAL_LABELS
};
