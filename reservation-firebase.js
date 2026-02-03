// Reservation System with Firebase - Skalette Bistro


import {
    TABLES_CONFIG,
    OPENING_HOURS,
    generateTimeSlots,
    getOpeningHours,
    createReservation,
    isTableAvailable,
    subscribeToTableAvailability,
    PROJECT_ID
} from './firebase-config.js';



let bookingData = {
    guests: 2,
    date: '',
    time: '',
    mealType: 'pranzo'
};

let selectedTable = null;
let currentStep = 1;
let unsubscribeAvailability = null;
let closedDatesCache = null;
let closedDatesCacheTime = 0;

// ===================== CLOSED DATES CHECK =====================

async function isDateClosed(date) {
    
    
    // Always fetch fresh from Firebase (no caching for now to debug)
    try {
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/closedDates/config`;
        
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json();
            
            
            if (data.fields?.dates?.arrayValue?.values) {
                const closedDates = data.fields.dates.arrayValue.values.map(v => ({
                    date: v.mapValue.fields.date.stringValue,
                    reason: v.mapValue.fields.reason.stringValue
                }));
                
                
                const found = closedDates.find(c => c.date === date);
                if (found) {
                    
                    return found;
                } else {
                    
                }
            } else {
                
            }
        } else {
            
        }
    } catch (e) {
        
    }
    
    // Fallback: also check local storage
    const localClosures = localStorage.getItem('skalette_closures');
    if (localClosures) {
        const closures = JSON.parse(localClosures);
        
        const found = closures.find(c => c.date === date);
        if (found) {
            
            return found;
        }
    }
    
    return null;
}

// Function to show closed date modal
function showClosedDateModal(title, message, reason, suggestion) {
    
    
    // Remove existing modal if any
    const existingModal = document.getElementById('closed-date-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'closed-date-modal';
    modal.innerHTML = `
        <div class="closed-modal-overlay">
            <div class="closed-modal-content">
                <div class="closed-modal-icon">🔒</div>
                <h3 class="closed-modal-title">${title}</h3>
                <p class="closed-modal-message">${message}</p>
                ${reason ? `<p class="closed-modal-reason">${reason}</p>` : ''}
                ${suggestion ? `<p class="closed-modal-suggestion">${suggestion}</p>` : ''}
                <button class="closed-modal-btn" id="close-modal-btn">OK</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    
    // Close button click
    document.getElementById('close-modal-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    // Close on overlay click
    modal.querySelector('.closed-modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) modal.remove();
    });
}

function closeClosedDateModal() {
    const modal = document.getElementById('closed-date-modal');
    if (modal) modal.remove();
}

// ===================== INITIALIZATION =====================

// DOMContentLoaded might have already fired since this is a dynamically loaded module
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        
        initBookingSystem();
    });
} else {
    // DOM is already ready
    
    initBookingSystem();
}

function initBookingSystem() {
    const dateInput = document.getElementById('booking-date');
    const timeSelect = document.getElementById('booking-time');
    const guestsSelect = document.getElementById('booking-guests');
    const mealSelect = document.getElementById('booking-meal');
    
    if (!dateInput) return;
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
    bookingData.date = today;
    
    // Popola orari iniziali
    updateTimeSlots();
    
    // Event listeners
    dateInput.addEventListener('change', async (e) => {
        bookingData.date = e.target.value;
        
        // Check if date is closed immediately when selected
        const closureInfo = await isDateClosed(bookingData.date);
        if (closureInfo) {
            const isItalian = document.documentElement.lang === 'it';
            const formattedDate = formatDate(bookingData.date);
            
            if (isItalian) {
                showClosedDateModal(
                    '🔒 Locale Chiuso',
                    `Siamo spiacenti, il giorno <strong>${formattedDate}</strong> il locale è chiuso.`,
                    `<strong>Motivo:</strong> ${closureInfo.reason}`,
                    'Seleziona un\'altra data per effettuare la prenotazione.'
                );
            } else {
                showClosedDateModal(
                    '🔒 Restaurant Closed',
                    `We're sorry, on <strong>${formattedDate}</strong> the restaurant is closed.`,
                    `<strong>Reason:</strong> ${closureInfo.reason}`,
                    'Please select a different date to make a reservation.'
                );
            }
            
            // Reset to today
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
            bookingData.date = today;
        }
        
        updateTimeSlots();
    });
    
    timeSelect.addEventListener('change', (e) => {
        bookingData.time = e.target.value;
        // Non auto-cambiare il tipo di pasto quando si cambia orario
    });
    
    guestsSelect.addEventListener('change', (e) => {
        bookingData.guests = parseInt(e.target.value);
    });
    
    mealSelect.addEventListener('change', (e) => {
        bookingData.mealType = e.target.value;
        updateTimeSlotsForMealType(); // Aggiorna orari per il tipo selezionato
    });
    
    // Button handlers
    const viewTablesBtn = document.getElementById('btn-view-tables');
    
    if (viewTablesBtn) {
        viewTablesBtn.addEventListener('click', async () => {
            
            try {
                await showStep2();
            } catch (err) {
                console.error('❌ Error in showStep2:', err);
            }
        });
        
    } else {
        console.error('❌ btn-view-tables NOT FOUND!');
    }
    
    document.getElementById('btn-back-step1')?.addEventListener('click', showStep1);
    document.getElementById('btn-continue-step3')?.addEventListener('click', showStep3);
    document.getElementById('btn-back-step2')?.addEventListener('click', showStep2);
    
    // Form submission
    document.getElementById('booking-final-form')?.addEventListener('submit', handleBookingSubmit);
    
    // Initialize guests select
    bookingData.guests = parseInt(guestsSelect.value) || 2;
}

// ===================== TIME SLOTS =====================

function updateTimeSlots() {
    const timeSelect = document.getElementById('booking-time');
    if (!timeSelect || !bookingData.date) return;
    
    const slots = generateTimeSlots(bookingData.date);
    const now = new Date();
    const selectedDate = new Date(bookingData.date);
    const isToday = selectedDate.toDateString() === now.toDateString();
    
    timeSelect.innerHTML = '';
    
    slots.forEach(slot => {
        // Se è oggi, nascondi gli orari passati
        if (isToday) {
            const [hours, mins] = slot.split(':').map(Number);
            const slotTime = new Date(selectedDate);
            slotTime.setHours(hours, mins, 0, 0);
            if (slotTime <= now) return;
        }
        
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        timeSelect.appendChild(option);
    });
    
    // Seleziona il primo orario disponibile
    if (timeSelect.options.length > 0) {
        bookingData.time = timeSelect.options[0].value;
        updateMealType();
    }
}

// Orari fissi per tipo di pasto (come in script.js)
const MEAL_TIME_RANGES = {
    pranzo: { start: 10 * 60 + 30, end: 15 * 60 },     // 10:30 - 15:00
    aperitivo: { start: 15 * 60, end: 18 * 60 + 30 },  // 15:00 - 18:30
    cena: { start: 16 * 60 + 30, end: 21 * 60 + 30 },  // 16:30 - 21:30
    dopocena: { start: 21 * 60 + 30, end: 24 * 60 + 30 } // 21:30 - 00:30
};

// Aggiorna orari disponibili in base al tipo di pasto selezionato
function updateTimeSlotsForMealType() {
    const timeSelect = document.getElementById('booking-time');
    if (!timeSelect || !bookingData.date || !bookingData.mealType) return;
    
    const range = MEAL_TIME_RANGES[bookingData.mealType];
    if (!range) return;
    
    const now = new Date();
    const selectedDate = new Date(bookingData.date);
    const isToday = selectedDate.toDateString() === now.toDateString();
    
    timeSelect.innerHTML = '';
    
    for (let mins = range.start; mins <= range.end; mins += 30) {
        const hours = Math.floor(mins / 60) % 24;
        const minutes = mins % 60;
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        // Se è oggi, nascondi gli orari passati
        if (isToday) {
            const slotTime = new Date(selectedDate);
            slotTime.setHours(hours, minutes, 0, 0);
            if (slotTime <= now) continue;
        }
        
        const option = document.createElement('option');
        option.value = timeStr;
        option.textContent = timeStr;
        timeSelect.appendChild(option);
    }
    
    // Se non ci sono orari disponibili per oggi, mostra messaggio
    if (timeSelect.options.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = '-- Nessun orario disponibile --';
        option.disabled = true;
        timeSelect.appendChild(option);
        bookingData.time = '';
        
        // Disabilita il pulsante "Vedi Tavoli"
        const viewTablesBtn = document.getElementById('btn-view-tables');
        if (viewTablesBtn) viewTablesBtn.disabled = true;
    } else {
        bookingData.time = timeSelect.options[0].value;
        
        // Abilita il pulsante "Vedi Tavoli"
        const viewTablesBtn = document.getElementById('btn-view-tables');
        if (viewTablesBtn) viewTablesBtn.disabled = false;
    }
}

function updateMealType() {
    const mealSelect = document.getElementById('booking-meal');
    if (!mealSelect || !bookingData.time) return;
    
    const [hours] = bookingData.time.split(':').map(Number);
    
    // Auto-detect meal type based on time
    if (hours < 15) {
        mealSelect.value = 'pranzo';
        bookingData.mealType = 'pranzo';
    } else if (hours < 18) {
        mealSelect.value = 'aperitivo';
        bookingData.mealType = 'aperitivo';
    } else {
        mealSelect.value = 'cena';
        bookingData.mealType = 'cena';
    }
}

// ===================== STEPS NAVIGATION =====================

function showStep1() {
    currentStep = 1;
    document.getElementById('booking-step-1').style.display = 'block';
    document.getElementById('booking-step-2').style.display = 'none';
    document.getElementById('booking-step-3').style.display = 'none';
    
    // Cleanup listener
    if (unsubscribeAvailability) {
        unsubscribeAvailability();
        unsubscribeAvailability = null;
    }
}

async function showStep2() {
    if (!bookingData.date || !bookingData.time) {
        // Use custom modal instead of alert (can't be blocked)
        showClosedDateModal(
            '⚠️ Attenzione',
            'Per favore seleziona <strong>data</strong> e <strong>orario</strong> prima di procedere.',
            '',
            ''
        );
        return;
    }
    
    
    
    // Check if date is closed BEFORE showing tables
    const closureInfo = await isDateClosed(bookingData.date);
    
    
    if (closureInfo) {
        const isItalian = document.documentElement.lang === 'it';
        const formattedDate = formatDate(bookingData.date);
        
        
        if (isItalian) {
            showClosedDateModal(
                '🔒 Locale Chiuso',
                `Siamo spiacenti, il giorno <strong>${formattedDate}</strong> il locale è chiuso.`,
                `<strong>Motivo:</strong> ${closureInfo.reason}`,
                'Seleziona un\'altra data per effettuare la prenotazione.'
            );
        } else {
            showClosedDateModal(
                '🔒 Restaurant Closed',
                `We're sorry, on <strong>${formattedDate}</strong> the restaurant is closed.`,
                `<strong>Reason:</strong> ${closureInfo.reason}`,
                'Please select a different date to make a reservation.'
            );
        }
        return;
    }
    
    currentStep = 2;
    document.getElementById('booking-step-1').style.display = 'none';
    document.getElementById('booking-step-2').style.display = 'block';
    document.getElementById('booking-step-3').style.display = 'none';
    
    selectedTable = null;
    document.getElementById('selected-table-info').style.display = 'none';
    document.getElementById('btn-continue-step3').disabled = true;
    
    // Prima renderizza i tavoli, POI attiva il listener
    await renderFloorPlan();
    setupRealtimeAvailability();
}

function showStep3() {
    if (!selectedTable) {
        const lang = localStorage.getItem('skalette_lang') || 'it';
        alert(lang === 'en' ? 'Please select a table' : 'Seleziona un tavolo');
        return;
    }
    
    currentStep = 3;
    document.getElementById('booking-step-1').style.display = 'none';
    document.getElementById('booking-step-2').style.display = 'none';
    document.getElementById('booking-step-3').style.display = 'block';
    
    // Update summary
    document.getElementById('summary-date').textContent = formatDate(bookingData.date);
    document.getElementById('summary-time').textContent = bookingData.time;
    document.getElementById('summary-guests').textContent = bookingData.guests + ' persone';
    document.getElementById('summary-table').textContent = selectedTable.name;
}

// ===================== REAL-TIME AVAILABILITY =====================

function setupRealtimeAvailability() {
    // Cleanup previous listener
    if (unsubscribeAvailability) {
        unsubscribeAvailability();
    }
    
    // Verifica che ci sia un orario valido
    if (!bookingData.time) {
        return;
    }
    
    // Subscribe to real-time updates (passa anche mealType per calcolo durata)
    unsubscribeAvailability = subscribeToTableAvailability(
        bookingData.date,
        bookingData.time,
        (unavailableTables) => {
            updateTableAvailability(unavailableTables);
        },
        bookingData.mealType
    );
}

function updateTableAvailability(unavailableTables) {
    const tables = document.querySelectorAll('.floor-table');
    
    tables.forEach(tableEl => {
        const tableId = tableEl.dataset.tableId;
        const table = TABLES_CONFIG.find(t => t.id === tableId);
        
        if (!table) return;
        
        const isUnavailable = unavailableTables.includes(tableId);
        const guestsOk = bookingData.guests >= table.minGuests && bookingData.guests <= table.maxGuests;
        const isAvailable = !isUnavailable && guestsOk;
        
        // Update classes
        tableEl.classList.remove('available', 'unavailable');
        tableEl.classList.add(isAvailable ? 'available' : 'unavailable');
        
        // Update style
        tableEl.style.background = isAvailable 
            ? 'linear-gradient(135deg, #c9a961, #a8893e)' 
            : 'rgba(180, 60, 60, 0.6)';
        tableEl.style.cursor = isAvailable ? 'pointer' : 'not-allowed';
        
        // Update text colors
        const nameSpan = tableEl.querySelector('.table-name');
        const seatsSpan = tableEl.querySelector('.table-seats');
        if (nameSpan) nameSpan.style.color = isAvailable ? '#0a1628' : '#fff';
        if (seatsSpan) seatsSpan.style.color = isAvailable ? '#0a1628' : '#ccc';
        
        // If currently selected table becomes unavailable, deselect it
        if (selectedTable?.id === tableId && !isAvailable) {
            selectedTable = null;
            document.getElementById('selected-table-info').style.display = 'none';
            document.getElementById('btn-continue-step3').disabled = true;
            tableEl.style.border = '3px solid transparent';
            tableEl.style.transform = 'translate(-50%, -50%)';
        }
    });
}

// ===================== FLOOR PLAN RENDERING =====================

async function renderFloorPlan() {
    const container = document.getElementById('floor-plan-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Check if any tables are available
    let hasAvailableTable = false;
    for (const table of TABLES_CONFIG) {
        const available = await isTableAvailable(table.id, bookingData.date, bookingData.time, bookingData.mealType);
        if (available && bookingData.guests >= table.minGuests && bookingData.guests <= table.maxGuests) {
            hasAvailableTable = true;
            break;
        }
    }
    
    // Elementi fissi con classi CSS
    const fixedElements = `
        <!-- BANCO -->
        <div class="floor-element banco" style="left:22%;top:35%;">
            <span style="color:rgba(201,169,97,0.7);font-size:13px;font-weight:600;letter-spacing:2px;">BANCO</span>
        </div>
        
        <!-- DIVANI PICCOLI zona alta -->
        <div class="floor-element divano-piccolo" style="left:52%;top:10%;">
            <span style="color:rgba(200,160,100,0.8);font-size:8px;">DIVANO</span>
        </div>
        <div class="floor-element divano-piccolo" style="left:68%;top:10%;">
            <span style="color:rgba(200,160,100,0.8);font-size:8px;">DIVANO</span>
        </div>
        <div class="floor-element divano-piccolo" style="left:84%;top:10%;">
            <span style="color:rgba(200,160,100,0.8);font-size:8px;">DIVANO</span>
        </div>
        
        <!-- DIVANO GRANDE zona bassa (da S8 a S4) -->
        <div class="floor-element divano-grande" style="left:73%;top:82%;">
            <span style="color:rgba(200,160,100,0.9);font-size:9px;font-weight:500;letter-spacing:1px;">DIVANO GRANDE</span>
        </div>
        
        <!-- SCALA -->
        <div class="floor-element scala" style="left:44%;top:50%;">
            <span style="color:rgba(201,169,97,0.9);font-size:11px;font-weight:600;writing-mode:vertical-rl;letter-spacing:2px;">SCALA</span>
        </div>
        
        <!-- ENTRATA -->
        <div class="floor-element entrata" style="left:5%;top:60%;">
            <span style="color:rgba(201,169,97,0.5);font-size:7px;writing-mode:vertical-rl;text-transform:uppercase;">Entrata</span>
        </div>
    `;
    container.innerHTML = fixedElements;
    
    // Render tables
    TABLES_CONFIG.forEach(table => {
        const tableEl = document.createElement('div');
        tableEl.className = 'floor-table ' + (table.shape || 'square');
        tableEl.dataset.tableId = table.id;
        tableEl.style.left = table.x + '%';
        tableEl.style.top = table.y + '%';
        
        // Inizialmente tutti grigi (loading)
        tableEl.style.background = 'rgba(100,100,100,0.4)';
        
        tableEl.innerHTML = `
            <span class="table-name">${table.name}</span>
            <span class="table-seats">${table.minGuests}-${table.maxGuests} posti</span>
        `;
        
        // Handle both click and touch events for mobile
        let isTouched = false;
        
        tableEl.addEventListener('touchstart', (e) => {
            isTouched = true;
        }, { passive: true });
        
        tableEl.addEventListener('touchend', (e) => {
            if (isTouched) {
                e.preventDefault();
                handleTableClick(table, tableEl);
                isTouched = false;
            }
        });
        
        tableEl.addEventListener('click', (e) => {
            // Skip if it was a touch event (to avoid double trigger)
            if (!isTouched) {
                handleTableClick(table, tableEl);
            }
            isTouched = false;
        });
        
        container.appendChild(tableEl);
    });
    
    // Check if any tables are available after rendering
    setTimeout(async () => {
        let hasAvailable = false;
        for (const table of TABLES_CONFIG) {
            const available = await isTableAvailable(table.id, bookingData.date, bookingData.time, bookingData.mealType);
            if (available && bookingData.guests >= table.minGuests && bookingData.guests <= table.maxGuests) {
                hasAvailable = true;
                break;
            }
        }
        
        // If no tables available, show waitlist option
        if (!hasAvailable) {
            showWaitlistOption();
        }
    }, 500);
    
    // Add legend
    const legend = document.createElement('div');
    legend.className = 'floor-legend';
    legend.innerHTML = `
        <span style="display:flex;align-items:center;gap:6px;">
            <span style="width:14px;height:14px;background:linear-gradient(135deg,#c9a961,#a8893e);border-radius:3px;"></span>
            Disponibile
        </span>
        <span style="display:flex;align-items:center;gap:6px;">
            <span style="width:14px;height:14px;background:rgba(180,60,60,0.6);border-radius:3px;"></span>
            Occupato
        </span>
    `;
    container.appendChild(legend);
}

// Show waitlist option when no tables available
async function showWaitlistOption() {
    const container = document.getElementById('floor-plan-container');
    if (!container) return;
    
    const lang = localStorage.getItem('skalette_lang') || 'it';
    const isItalian = lang === 'it';
    
    const waitlistDiv = document.createElement('div');
    waitlistDiv.id = 'waitlist-option';
    waitlistDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(10, 22, 40, 0.95);
        border: 2px solid var(--gold);
        border-radius: 16px;
        padding: 30px;
        text-align: center;
        z-index: 100;
        max-width: 400px;
        width: 90%;
    `;
    
    waitlistDiv.innerHTML = `
        <h3 style="color: var(--gold); margin-bottom: 15px; font-size: 20px;">
            ${isItalian ? '⏳ Nessun Tavolo Disponibile' : '⏳ No Tables Available'}
        </h3>
        <p style="color: var(--grey-light); margin-bottom: 20px; line-height: 1.6;">
            ${isItalian 
                ? 'Tutti i tavoli sono occupati per questo orario. Vuoi essere aggiunto alla lista d\'attesa? Ti notificheremo se un tavolo diventa disponibile.'
                : 'All tables are booked for this time. Would you like to join the waitlist? We\'ll notify you if a table becomes available.'}
        </p>
        <button id="btn-join-waitlist" style="
            background: var(--gold);
            color: var(--navy-dark);
            border: none;
            padding: 14px 30px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            margin-right: 10px;
        ">${isItalian ? 'Entra in Lista d\'Attesa' : 'Join Waitlist'}</button>
        <button id="btn-cancel-waitlist" style="
            background: transparent;
            border: 1px solid var(--grey);
            color: var(--grey-light);
            padding: 14px 30px;
            border-radius: 8px;
            cursor: pointer;
        ">${isItalian ? 'Annulla' : 'Cancel'}</button>
    `;
    
    container.appendChild(waitlistDiv);
    
    // Handle waitlist join
    document.getElementById('btn-join-waitlist').addEventListener('click', async () => {
        // Move to step 3 to collect customer info
        showStep3();
        // Mark that we're joining waitlist
        window.isWaitlistMode = true;
    });
    
    document.getElementById('btn-cancel-waitlist').addEventListener('click', () => {
        waitlistDiv.remove();
    });
}

async function handleTableClick(table, element) {
    // Check if table has 'available' class (already verified by real-time listener)
    const hasAvailableClass = element.classList.contains('available');
    const guestsOk = bookingData.guests >= table.minGuests && bookingData.guests <= table.maxGuests;
    
    if (!hasAvailableClass || !guestsOk) {
        return; // Table not available
    }
    
    // Deselect previous
    document.querySelectorAll('.floor-table').forEach(el => {
        el.style.border = '3px solid transparent';
        el.style.transform = 'translate(-50%, -50%)';
    });
    
    // Select new
    selectedTable = table;
    element.style.border = '3px solid #fff';
    element.style.transform = 'translate(-50%, -50%) scale(1.1)';
    
    // Update UI
    document.getElementById('selected-table-info').style.display = 'block';
    document.getElementById('selected-table-name').textContent = table.name;
    document.getElementById('btn-continue-step3').disabled = false;
}

// ===================== FORM SUBMISSION =====================

async function handleBookingSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Invio in corso...';
    
    // Get language preference
    const siteLang = localStorage.getItem('skalette_lang') || 'it';
    
    const formData = {
        tableId: selectedTable.id,
        tableName: selectedTable.name,
        date: bookingData.date,
        time: bookingData.time,
        mealType: bookingData.mealType,
        guests: bookingData.guests,
        name: document.getElementById('booking-name').value,
        email: document.getElementById('booking-email').value,
        phone: document.getElementById('booking-phone').value,
        notes: document.getElementById('booking-notes').value || '',
        language: siteLang
    };
    
    // Check if we're in waitlist mode
    if (window.isWaitlistMode) {
        // Add to waitlist instead of creating reservation
        try {
            const { addToWaitlist } = await import('./waitlist-service.js');
            const waitlistResult = await addToWaitlist(
                formData,
                bookingData.date,
                bookingData.time,
                bookingData.mealType,
                bookingData.guests
            );
            
            if (waitlistResult.success) {
                // Show success message
                document.getElementById('booking-step-3').style.display = 'none';
                document.getElementById('booking-success').style.display = 'block';
                document.getElementById('booking-id').textContent = `WAIT-${waitlistResult.id}`;
                
                const lang = localStorage.getItem('skalette_lang') || 'it';
                const successMsg = lang === 'it'
                    ? 'Sei stato aggiunto alla lista d\'attesa! Ti notificheremo se un tavolo diventa disponibile.'
                    : 'You have been added to the waitlist! We\'ll notify you if a table becomes available.';
                
                document.querySelector('#booking-success p').textContent = successMsg;
                
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                window.isWaitlistMode = false;
                return;
            }
        } catch (error) {
            console.error('Waitlist error:', error);
        }
    }
    
    // Double check availability before submitting (con mealType per controllo durata)
    const stillAvailable = await isTableAvailable(selectedTable.id, bookingData.date, bookingData.time, bookingData.mealType);
    
    if (!stillAvailable) {
        // Offer waitlist instead of just error
        const lang = localStorage.getItem('skalette_lang') || 'it';
        const msg = lang === 'it'
            ? 'Il tavolo è stato appena prenotato. Vuoi essere aggiunto alla lista d\'attesa?'
            : 'The table was just booked. Would you like to join the waitlist?';
        
        if (confirm(msg)) {
            window.isWaitlistMode = true;
            showStep3();
        } else {
            showStep2();
        }
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
    }
    
    const result = await createReservation(formData);
    
    if (result.success) {
        // Haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100, 50, 200]); // Success pattern
        }
        
        // Show success
        document.getElementById('booking-step-3').style.display = 'none';
        document.getElementById('booking-success').style.display = 'block';
        document.getElementById('booking-id').textContent = result.id;
        
        // Confetti animation
        showConfetti();
        
        // Send WhatsApp notification
        sendWhatsAppNotification(formData, result.id);
        
        // Request push notification permission and show notification
        try {
            const { requestNotificationPermission, notifyReservationConfirmed } = await import('./push-notifications.js');
            if (await requestNotificationPermission()) {
                notifyReservationConfirmed({
                    ...formData,
                    id: result.id,
                    date: bookingData.date,
                    time: bookingData.time
                });
            }
        } catch (err) {
            console.log('Push notifications not available:', err);
        }
        
        // Cleanup
        if (unsubscribeAvailability) {
            unsubscribeAvailability();
            unsubscribeAvailability = null;
        }
    } else {
        // Error haptic
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]); // Error pattern
        }
        alert('Errore durante la prenotazione. Riprova.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Confetti animation for successful booking
function showConfetti() {
    const colors = ['#c9a961', '#d4b87a', '#ffffff', '#0a1628'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -20px;
            opacity: ${Math.random() + 0.5};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            z-index: 100000;
            pointer-events: none;
            animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
        `;
        document.body.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => confetti.remove(), 4000);
    }
}

function sendWhatsAppNotification(data, bookingId) {
    const durationMap = { aperitivo: '1.5h', pranzo: '2h', cena: '2h' };
    const duration = durationMap[data.mealType] || '2h';
    
    const message = `🍽️ NUOVA PRENOTAZIONE SKALETTE BISTRO

📅 Data: ${formatDate(data.date)}
🕐 Ora: ${data.time}
⏱️ Durata: ${duration}
👥 Persone: ${data.guests}
🪑 Tavolo: ${data.tableName}
🍴 Tipo: ${data.mealType}

👤 Nome: ${data.name}
📞 Tel: ${data.phone}
📧 Email: ${data.email}
${data.notes ? `📝 Note: ${data.notes}` : ''}

🔖 ID: ${bookingId}`;
    
    const whatsappUrl = `https://wa.me/393428691832?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ===================== UTILITIES =====================

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('it-IT', options);
}

// Export for global access if needed
window.BookingSystem = {
    showStep1,
    showStep2,
    showStep3
};
