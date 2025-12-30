// Firebase Configuration for Skalette Bistro
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, onSnapshot, query, where, orderBy, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAbTQnt26Gca0sPa1RlhIyq2TIwLfKfl0s",
    authDomain: "skalette-bistro.firebaseapp.com",
    databaseURL: "https://skalette-bistro-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "skalette-bistro",
    storageBucket: "skalette-bistro.firebasestorage.app",
    messagingSenderId: "692167914968",
    appId: "1:692167914968:web:9929ed1d221825cbcceead"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collections
const reservationsRef = collection(db, 'reservations');
const blockedSlotsRef = collection(db, 'blockedSlots');
const tablesRef = collection(db, 'tables');

// Orari di apertura per giorno della settimana (0 = Domenica, 1 = Lunedì, ecc.)
const OPENING_HOURS = {
    0: { open: '10:30', close: '22:30' },  // Domenica
    1: { open: '10:30', close: '23:30' },  // Lunedì
    2: { open: '10:30', close: '23:30' },  // Martedì
    3: { open: '10:30', close: '23:30' },  // Mercoledì
    4: { open: '10:30', close: '23:30' },  // Giovedì
    5: { open: '10:30', close: '00:00' },  // Venerdì (chiude a mezzanotte)
    6: { open: '10:30', close: '00:00' },  // Sabato (chiude a mezzanotte)
};

// Durata prenotazioni in minuti
const MEAL_DURATIONS = {
    aperitivo: 90,  // 1.5 ore
    pranzo: 120,    // 2 ore
    cena: 120       // 2 ore
};

// Configurazione tavoli (ordinati per griglia admin: B1, B2, B3, S1-S8)
const TABLES_CONFIG = [
    { id: 'B1', name: 'B1', minGuests: 1, maxGuests: 4, x: 36, y: 75, shape: 'square' },
    { id: 'B2', name: 'B2', minGuests: 1, maxGuests: 4, x: 24, y: 75, shape: 'square' },
    { id: 'B3', name: 'B3', minGuests: 1, maxGuests: 4, x: 12, y: 75, shape: 'square' },
    { id: 'S1', name: 'S1', minGuests: 3, maxGuests: 5, x: 52, y: 22, shape: 'square' },
    { id: 'S2', name: 'S2', minGuests: 2, maxGuests: 3, x: 68, y: 22, shape: 'round' },
    { id: 'S3', name: 'S3', minGuests: 3, maxGuests: 5, x: 84, y: 22, shape: 'square' },
    { id: 'S4', name: 'S4', minGuests: 1, maxGuests: 2, x: 94, y: 68, shape: 'square' },
    { id: 'S5', name: 'S5', minGuests: 1, maxGuests: 2, x: 84, y: 68, shape: 'square' },
    { id: 'S6', name: 'S6', minGuests: 1, maxGuests: 2, x: 74, y: 68, shape: 'square' },
    { id: 'S7', name: 'S7', minGuests: 1, maxGuests: 2, x: 64, y: 68, shape: 'square' },
    { id: 'S8', name: 'S8', minGuests: 3, maxGuests: 5, x: 52, y: 68, shape: 'square' },
];

// ===================== UTILITY FUNCTIONS =====================

// Converti orario in minuti dalla mezzanotte
function timeToMinutes(time) {
    const [hours, mins] = time.split(':').map(Number);
    return hours * 60 + mins;
}

// Converti minuti in orario string
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Calcola gli slot occupati da una prenotazione
function getOccupiedSlots(startTime, mealType) {
    const duration = MEAL_DURATIONS[mealType] || 120;
    const startMinutes = timeToMinutes(startTime);
    const slots = [];
    
    // Gli slot sono ogni 30 minuti
    for (let m = startMinutes; m < startMinutes + duration; m += 30) {
        slots.push(minutesToTime(m));
    }
    
    return slots;
}

// Controlla se due prenotazioni si sovrappongono
function reservationsOverlap(res1Time, res1MealType, res2Time, res2MealType) {
    const slots1 = getOccupiedSlots(res1Time, res1MealType);
    const slots2 = getOccupiedSlots(res2Time, res2MealType);
    return slots1.some(slot => slots2.includes(slot));
}

// Genera slot orari disponibili per un giorno specifico
function generateTimeSlots(date) {
    const dayOfWeek = new Date(date).getDay();
    const hours = OPENING_HOURS[dayOfWeek];
    const slots = [];
    
    let [startHour, startMin] = hours.open.split(':').map(Number);
    let [endHour, endMin] = hours.close.split(':').map(Number);
    
    // Se chiude a mezzanotte, usa 24
    if (endHour === 0) endHour = 24;
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
        slots.push(timeStr);
        
        // Incrementa di 30 minuti
        currentMin += 30;
        if (currentMin >= 60) {
            currentMin = 0;
            currentHour++;
        }
    }
    
    return slots;
}

// Genera slot orari estesi per admin (include orari dopo chiusura per vedere fine prenotazioni)
function generateAdminTimeSlots(date) {
    const dayOfWeek = new Date(date).getDay();
    const hours = OPENING_HOURS[dayOfWeek];
    const slots = [];
    
    let [startHour, startMin] = hours.open.split(':').map(Number);
    let [closeHour, closeMin] = hours.close.split(':').map(Number);
    
    // Calcola l'orario finale (chiusura + 2 ore per prenotazioni cena)
    let endHour, endMin;
    if (closeHour === 0) {
        // Chiude a mezzanotte -> estendi fino alle 02:00
        endHour = 2;
        endMin = 0;
    } else {
        // Aggiungi 2 ore dopo la chiusura
        endHour = closeHour + 2;
        endMin = closeMin;
    }
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        // Gestisci passaggio da 23 a 00
        const displayHour = currentHour >= 24 ? currentHour - 24 : currentHour;
        const timeStr = `${displayHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
        slots.push(timeStr);
        
        // Incrementa di 30 minuti
        currentMin += 30;
        if (currentMin >= 60) {
            currentMin = 0;
            currentHour++;
        }
    }
    
    return slots;
}

// Ottieni orari di apertura per una data
function getOpeningHours(date) {
    const dayOfWeek = new Date(date).getDay();
    return OPENING_HOURS[dayOfWeek];
}

// ===================== RESERVATIONS =====================

// Crea nuova prenotazione
async function createReservation(reservationData) {
    try {
        const docRef = await addDoc(reservationsRef, {
            ...reservationData,
            status: 'pending',
            createdAt: new Date().toISOString()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error creating reservation:', error);
        return { success: false, error: error.message };
    }
}

// Ottieni tutte le prenotazioni
async function getAllReservations() {
    try {
        const q = query(reservationsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting reservations:', error);
        return [];
    }
}

// Ottieni prenotazioni per data
async function getReservationsByDate(date) {
    try {
        const q = query(reservationsRef, where('date', '==', date));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting reservations by date:', error);
        return [];
    }
}

// Aggiorna stato prenotazione
async function updateReservationStatus(reservationId, status) {
    try {
        const docRef = doc(db, 'reservations', reservationId);
        await updateDoc(docRef, { status, updatedAt: new Date().toISOString() });
        return { success: true };
    } catch (error) {
        console.error('Error updating reservation:', error);
        return { success: false, error: error.message };
    }
}

// Elimina prenotazione
async function deleteReservation(reservationId) {
    try {
        await deleteDoc(doc(db, 'reservations', reservationId));
        return { success: true };
    } catch (error) {
        console.error('Error deleting reservation:', error);
        return { success: false, error: error.message };
    }
}

// Controlla se tavolo è disponibile (considerando durata prenotazioni)
async function isTableAvailable(tableId, date, time, mealType = 'cena') {
    try {
        // Controlla slot bloccati per l'orario esatto
        const blockedQuery = query(
            blockedSlotsRef,
            where('tableId', '==', tableId),
            where('date', '==', date),
            where('time', '==', time)
        );
        const blockedSnapshot = await getDocs(blockedQuery);
        if (!blockedSnapshot.empty) return false;
        
        // Ottieni tutte le prenotazioni del tavolo per quella data
        const reservationsQuery = query(
            reservationsRef,
            where('tableId', '==', tableId),
            where('date', '==', date),
            where('status', 'in', ['pending', 'confirmed'])
        );
        const reservationsSnapshot = await getDocs(reservationsQuery);
        
        // Controlla sovrapposizioni con prenotazioni esistenti
        const newReservationSlots = getOccupiedSlots(time, mealType);
        
        for (const doc of reservationsSnapshot.docs) {
            const existingRes = doc.data();
            const existingSlots = getOccupiedSlots(existingRes.time, existingRes.mealType || 'cena');
            
            // Se c'è sovrapposizione, tavolo non disponibile
            if (newReservationSlots.some(slot => existingSlots.includes(slot))) {
                return false;
            }
        }
        
        return true;
    } catch (error) {
        console.error('Error checking availability:', error);
        return false;
    }
}

// Listener real-time per disponibilità tavoli (con durata prenotazioni)
function subscribeToTableAvailability(date, time, callback, mealType = 'cena') {
    // Ascolta tutte le prenotazioni della data
    const reservationsQuery = query(
        reservationsRef,
        where('date', '==', date),
        where('status', 'in', ['pending', 'confirmed'])
    );
    
    const unsubReservations = onSnapshot(reservationsQuery, async (snapshot) => {
        const requestedSlots = getOccupiedSlots(time, mealType);
        const unavailableTables = new Set();
        
        // Controlla sovrapposizioni per ogni prenotazione esistente
        snapshot.docs.forEach(doc => {
            const res = doc.data();
            const existingSlots = getOccupiedSlots(res.time, res.mealType || 'cena');
            
            // Se c'è sovrapposizione, il tavolo non è disponibile
            if (requestedSlots.some(slot => existingSlots.includes(slot))) {
                unavailableTables.add(res.tableId);
            }
        });
        
        // Controlla anche slot bloccati per tutti gli slot richiesti
        for (const slot of requestedSlots) {
            const blockedQuery = query(
                blockedSlotsRef,
                where('date', '==', date),
                where('time', '==', slot)
            );
            const blockedSnapshot = await getDocs(blockedQuery);
            blockedSnapshot.docs.forEach(doc => {
                unavailableTables.add(doc.data().tableId);
            });
        }
        
        callback([...unavailableTables]);
    });
    
    return unsubReservations;
}

// Listener real-time per tutte le prenotazioni (admin)
function subscribeToReservations(callback) {
    const q = query(reservationsRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const reservations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(reservations);
    });
}

// ===================== BLOCKED SLOTS =====================

// Blocca slot
async function blockSlot(tableId, date, time, reason = '') {
    try {
        const slotId = `${tableId}_${date}_${time}`;
        await setDoc(doc(db, 'blockedSlots', slotId), {
            tableId,
            date,
            time,
            reason,
            createdAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        console.error('Error blocking slot:', error);
        return { success: false, error: error.message };
    }
}

// Sblocca slot
async function unblockSlot(tableId, date, time) {
    try {
        const slotId = `${tableId}_${date}_${time}`;
        await deleteDoc(doc(db, 'blockedSlots', slotId));
        return { success: true };
    } catch (error) {
        console.error('Error unblocking slot:', error);
        return { success: false, error: error.message };
    }
}

// Ottieni tutti gli slot bloccati per una data
async function getBlockedSlots(date) {
    try {
        const q = query(blockedSlotsRef, where('date', '==', date));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting blocked slots:', error);
        return [];
    }
}

// Listener real-time per slot bloccati
function subscribeToBlockedSlots(date, callback) {
    const q = query(blockedSlotsRef, where('date', '==', date));
    return onSnapshot(q, (snapshot) => {
        const blockedSlots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(blockedSlots);
    });
}

// ===================== EXPORTS =====================

export {
    db,
    TABLES_CONFIG,
    OPENING_HOURS,
    MEAL_DURATIONS,
    generateTimeSlots,
    generateAdminTimeSlots,
    getOpeningHours,
    getOccupiedSlots,
    timeToMinutes,
    minutesToTime,
    createReservation,
    getAllReservations,
    getReservationsByDate,
    updateReservationStatus,
    deleteReservation,
    isTableAvailable,
    subscribeToTableAvailability,
    subscribeToReservations,
    blockSlot,
    unblockSlot,
    getBlockedSlots,
    subscribeToBlockedSlots
};
