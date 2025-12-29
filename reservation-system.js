// ===================================
// SKALETTE BISTRO - Sistema Prenotazioni
// ===================================

const WHATSAPP_NUMBER = '393428691832';

// Configurazione fasce orarie
const TIME_SLOTS = {
    pranzo: {
        label: 'Pranzo',
        times: ['12:00', '12:30', '13:00', '13:30', '14:00'],
        icon: '☀️'
    },
    aperitivo: {
        label: 'Aperitivo',
        times: ['17:00', '17:30', '18:00', '18:30', '19:00'],
        icon: '🍹'
    },
    cena: {
        label: 'Cena',
        times: ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00'],
        icon: '🌙'
    }
};

// ===================================
// GESTIONE DATI LOCALI
// ===================================

function getFloorPlan() {
    const saved = localStorage.getItem('skalette_floorplan');
    return saved ? JSON.parse(saved) : { tables: [], background: null };
}

function saveFloorPlan(data) {
    localStorage.setItem('skalette_floorplan', JSON.stringify(data));
}

function getReservations() {
    const saved = localStorage.getItem('skalette_reservations');
    return saved ? JSON.parse(saved) : [];
}

function saveReservations(data) {
    localStorage.setItem('skalette_reservations', JSON.stringify(data));
}

function generateId() {
    return 'res_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ===================================
// VERIFICA DISPONIBILITÀ
// ===================================

function isTableAvailable(tableId, date, time, mealType) {
    const reservations = getReservations();
    return !reservations.some(res => 
        res.tableId === tableId && 
        res.date === date && 
        res.time === time &&
        res.mealType === mealType &&
        res.status !== 'rejected'
    );
}

function getAvailableTables(guests, date, time, mealType) {
    const floorPlan = getFloorPlan();
    return floorPlan.tables.filter(table => 
        guests >= table.minGuests && 
        guests <= table.maxGuests &&
        isTableAvailable(table.id, date, time, mealType)
    );
}

// ===================================
// WHATSAPP MESSAGING
// ===================================

function createWhatsAppLink(phone, message) {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
}

function sendReservationNotification(reservation) {
    const message = `🍽️ NUOVA PRENOTAZIONE - Skalette Bistro

👤 Nome: ${reservation.name}
📱 Telefono: ${reservation.phone}
📧 Email: ${reservation.email}
👥 Persone: ${reservation.guests}
📅 Data: ${reservation.date}
⏰ Orario: ${reservation.time}
🍴 Tipo: ${TIME_SLOTS[reservation.mealType].label}
🪑 Tavolo: ${reservation.tableName}

📝 Note: ${reservation.notes || 'Nessuna'}

ID Prenotazione: ${reservation.id}`;

    window.open(createWhatsAppLink(WHATSAPP_NUMBER, message), '_blank');
}

function sendConfirmationToCustomer(reservation, accepted) {
    const status = accepted ? 'CONFERMATA ✅' : 'NON DISPONIBILE ❌';
    const message = accepted 
        ? `🍽️ Skalette Bistro - Prenotazione ${status}

Gentile ${reservation.name},
la tua prenotazione è stata confermata!

📅 Data: ${reservation.date}
⏰ Orario: ${reservation.time}
👥 Persone: ${reservation.guests}
🪑 Tavolo: ${reservation.tableName}

Ti aspettiamo!
Via Pellicciai, 12 - Verona

Per modifiche: 045 8030500`
        : `🍽️ Skalette Bistro - Prenotazione ${status}

Gentile ${reservation.name},
ci dispiace ma non è stato possibile confermare la prenotazione per il ${reservation.date} alle ${reservation.time}.

Ti invitiamo a contattarci per trovare un'alternativa:
📞 045 8030500

Grazie per la comprensione!`;

    window.open(createWhatsAppLink('39' + reservation.phone.replace(/\D/g, ''), message), '_blank');
}

// ===================================
// CREAZIONE PRENOTAZIONE
// ===================================

function createReservation(data) {
    const reservation = {
        id: generateId(),
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    const reservations = getReservations();
    reservations.push(reservation);
    saveReservations(reservations);
    
    return reservation;
}

function updateReservationStatus(id, status) {
    const reservations = getReservations();
    const index = reservations.findIndex(r => r.id === id);
    if (index !== -1) {
        reservations[index].status = status;
        reservations[index].updatedAt = new Date().toISOString();
        saveReservations(reservations);
        return reservations[index];
    }
    return null;
}

// ===================================
// RENDER PIANTINA (per cliente)
// ===================================

function renderFloorPlanForBooking(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const floorPlan = getFloorPlan();
    const { guests, date, time, mealType, onTableSelect } = options;
    
    container.innerHTML = '';
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '400px';
    container.style.background = 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 100%)';
    container.style.borderRadius = '12px';
    container.style.overflow = 'hidden';
    
    if (floorPlan.tables.length === 0) {
        container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#8a8a8a;font-style:italic;">Piantina non ancora configurata</div>';
        return;
    }
    
    floorPlan.tables.forEach(table => {
        const isAvailable = guests >= table.minGuests && 
                           guests <= table.maxGuests && 
                           isTableAvailable(table.id, date, time, mealType);
        
        const tableEl = document.createElement('div');
        tableEl.className = 'floor-table' + (isAvailable ? ' available' : ' unavailable');
        tableEl.style.cssText = `
            position: absolute;
            left: ${table.x}%;
            top: ${table.y}%;
            width: ${table.width || 60}px;
            height: ${table.height || 60}px;
            background: ${isAvailable ? 'linear-gradient(135deg, #c9a961, #a8893e)' : 'rgba(100,100,100,0.5)'};
            border-radius: ${table.shape === 'round' ? '50%' : '8px'};
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: ${isAvailable ? 'pointer' : 'not-allowed'};
            transition: all 0.3s ease;
            box-shadow: ${isAvailable ? '0 4px 15px rgba(201,169,97,0.3)' : 'none'};
            transform: translate(-50%, -50%);
        `;
        
        tableEl.innerHTML = `
            <span style="font-weight:600;font-size:14px;color:${isAvailable ? '#0a1628' : '#666'}">${table.name}</span>
            <span style="font-size:10px;color:${isAvailable ? '#0a1628' : '#666'}">${table.minGuests}-${table.maxGuests} pax</span>
        `;
        
        if (isAvailable && onTableSelect) {
            tableEl.addEventListener('click', () => onTableSelect(table));
            tableEl.addEventListener('mouseenter', () => {
                tableEl.style.transform = 'translate(-50%, -50%) scale(1.1)';
                tableEl.style.boxShadow = '0 6px 25px rgba(201,169,97,0.5)';
            });
            tableEl.addEventListener('mouseleave', () => {
                tableEl.style.transform = 'translate(-50%, -50%)';
                tableEl.style.boxShadow = '0 4px 15px rgba(201,169,97,0.3)';
            });
        }
        
        container.appendChild(tableEl);
    });
    
    // Legenda
    const legend = document.createElement('div');
    legend.style.cssText = 'position:absolute;bottom:10px;left:10px;display:flex;gap:15px;font-size:12px;';
    legend.innerHTML = `
        <span style="display:flex;align-items:center;gap:5px;">
            <span style="width:12px;height:12px;background:linear-gradient(135deg,#c9a961,#a8893e);border-radius:3px;"></span>
            Disponibile
        </span>
        <span style="display:flex;align-items:center;gap:5px;">
            <span style="width:12px;height:12px;background:rgba(100,100,100,0.5);border-radius:3px;"></span>
            Non disponibile
        </span>
    `;
    container.appendChild(legend);
}
