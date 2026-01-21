// =====================================================
// SKALETTE BISTRO - Staff Dashboard PWA
// Real-time reservation management for staff
// =====================================================

import { 
    PROJECT_ID, 
    FIREBASE_API_KEY,
    getReservationsByDate,
    updateReservationStatus,
    subscribeToReservations
} from './firebase-config.js';

// ===================== CONFIGURATION =====================

const STAFF_PIN = '2024'; // Change this to your desired PIN
const WHATSAPP_NUMBER = '393428691832';

// ===================== STATE =====================

let isAuthenticated = false;
let currentDate = new Date();
let currentView = 'today';
let reservations = [];
let unsubscribe = null;

// ===================== PIN AUTHENTICATION =====================

let enteredPin = '';

function initPinKeypad() {
    const keys = document.querySelectorAll('.pin-key');
    const dots = document.querySelectorAll('.pin-dot');
    const errorEl = document.getElementById('pin-error');
    
    keys.forEach(key => {
        key.addEventListener('click', () => {
            const value = key.dataset.key;
            
            if (value === 'delete') {
                enteredPin = enteredPin.slice(0, -1);
            } else if (value && enteredPin.length < 4) {
                enteredPin += value;
            }
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('filled', i < enteredPin.length);
                dot.classList.remove('error');
            });
            
            // Check PIN when 4 digits entered
            if (enteredPin.length === 4) {
                if (enteredPin === STAFF_PIN) {
                    isAuthenticated = true;
                    localStorage.setItem('skalette_staff_auth', Date.now().toString());
                    showApp();
                } else {
                    // Wrong PIN
                    errorEl.textContent = 'PIN errato. Riprova.';
                    dots.forEach(dot => dot.classList.add('error'));
                    
                    setTimeout(() => {
                        enteredPin = '';
                        dots.forEach(dot => {
                            dot.classList.remove('filled', 'error');
                        });
                        errorEl.textContent = '';
                    }, 1000);
                }
            }
        });
    });
}

function checkAuth() {
    const authTime = localStorage.getItem('skalette_staff_auth');
    if (authTime) {
        // Session valid for 24 hours
        const elapsed = Date.now() - parseInt(authTime);
        if (elapsed < 24 * 60 * 60 * 1000) {
            isAuthenticated = true;
            showApp();
            return true;
        }
    }
    return false;
}

function showApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-container').classList.add('active');
    initApp();
}

function logout() {
    localStorage.removeItem('skalette_staff_auth');
    isAuthenticated = false;
    enteredPin = '';
    document.querySelectorAll('.pin-dot').forEach(dot => {
        dot.classList.remove('filled');
    });
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app-container').classList.remove('active');
    
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
}

// ===================== APP INITIALIZATION =====================

function initApp() {
    updateHeaderDate();
    initViewSwitcher();
    initDateNavigation();
    initBottomNav();
    initLogout();
    loadReservations();
    setupRealTimeListener();
    requestNotificationPermission();
}

function updateHeaderDate() {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('header-date').textContent = 
        new Date().toLocaleDateString('it-IT', options);
}

// ===================== VIEW MANAGEMENT =====================

function initViewSwitcher() {
    const buttons = document.querySelectorAll('.view-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            
            // Show/hide week view
            const weekView = document.getElementById('week-view');
            const dateNav = document.getElementById('date-nav');
            
            if (currentView === 'week') {
                weekView.style.display = 'grid';
                dateNav.style.display = 'none';
                renderWeekView();
            } else {
                weekView.style.display = 'none';
                dateNav.style.display = 'flex';
            }
            
            renderReservations();
        });
    });
}

function initDateNavigation() {
    document.getElementById('prev-day').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDateDisplay();
        loadReservations();
    });
    
    document.getElementById('next-day').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        updateDateDisplay();
        loadReservations();
    });
    
    document.getElementById('go-today').addEventListener('click', () => {
        currentDate = new Date();
        updateDateDisplay();
        loadReservations();
    });
    
    updateDateDisplay();
}

function updateDateDisplay() {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const display = document.getElementById('current-date-display');
    const today = new Date();
    
    if (currentDate.toDateString() === today.toDateString()) {
        display.textContent = 'Oggi';
    } else {
        display.textContent = currentDate.toLocaleDateString('it-IT', options);
    }
}

function initBottomNav() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const tab = item.dataset.tab;
            // For now, all tabs show reservations
            // You can extend this later
            if (tab === 'settings') {
                showToast('⚙️ Impostazioni in arrivo!', 'info');
            } else if (tab === 'tables') {
                showToast('🪑 Vista tavoli in arrivo!', 'info');
            }
        });
    });
}

function initLogout() {
    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('Vuoi uscire?')) {
            logout();
        }
    });
}

// ===================== WEEK VIEW =====================

function renderWeekView() {
    const weekView = document.getElementById('week-view');
    const today = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday
    
    weekView.innerHTML = '';
    
    const dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(day.getDate() + i);
        
        const isToday = day.toDateString() === today.toDateString();
        const isActive = day.toDateString() === currentDate.toDateString();
        const dateStr = day.toISOString().split('T')[0];
        
        // Count reservations for this day
        const dayReservations = reservations.filter(r => r.date === dateStr);
        const count = dayReservations.length;
        
        const dayEl = document.createElement('div');
        dayEl.className = `week-day ${isToday ? 'today' : ''} ${isActive ? 'active' : ''}`;
        dayEl.innerHTML = `
            <div class="week-day-name">${dayNames[i]}</div>
            <div class="week-day-num">${day.getDate()}</div>
            ${count > 0 ? `<div class="week-day-count">${count}</div>` : ''}
        `;
        
        dayEl.addEventListener('click', () => {
            currentDate = new Date(day);
            loadReservations();
            renderWeekView();
        });
        
        weekView.appendChild(dayEl);
    }
}

// ===================== RESERVATIONS =====================

async function loadReservations() {
    const container = document.getElementById('reservations-container');
    container.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';
    
    try {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        if (currentView === 'pending' || currentView === 'all') {
            // Load all reservations
            reservations = await getAllReservations();
        } else {
            // Load for specific date
            reservations = await getReservationsByDate(dateStr);
        }
        
        updateStats();
        renderReservations();
        
        if (currentView === 'week') {
            renderWeekView();
        }
    } catch (error) {
        console.error('Error loading reservations:', error);
        showToast('Errore caricamento prenotazioni', 'error');
    }
}

async function getAllReservations() {
    try {
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/reservations?key=${FIREBASE_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) return [];
        
        const data = await response.json();
        if (!data.documents) return [];
        
        return data.documents.map(doc => {
            const fields = doc.fields;
            return {
                id: doc.name.split('/').pop(),
                name: fields.name?.stringValue || '',
                email: fields.email?.stringValue || '',
                phone: fields.phone?.stringValue || '',
                date: fields.date?.stringValue || '',
                time: fields.time?.stringValue || '',
                guests: parseInt(fields.guests?.integerValue || fields.guests?.stringValue || '0'),
                tableId: fields.tableId?.stringValue || '',
                tableName: fields.tableName?.stringValue || '',
                mealType: fields.mealType?.stringValue || '',
                notes: fields.notes?.stringValue || '',
                status: fields.status?.stringValue || 'pending',
                createdAt: fields.createdAt?.stringValue || ''
            };
        }).sort((a, b) => {
            // Sort by date, then time
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
        });
    } catch (error) {
        console.error('Error fetching all reservations:', error);
        return [];
    }
}

function updateStats() {
    const dateStr = currentDate.toISOString().split('T')[0];
    const todayReservations = reservations.filter(r => r.date === dateStr);
    
    const total = todayReservations.length;
    const pending = todayReservations.filter(r => r.status === 'pending').length;
    const guests = todayReservations
        .filter(r => r.status !== 'rejected' && r.status !== 'cancelled')
        .reduce((sum, r) => sum + (r.guests || 0), 0);
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-guests').textContent = guests;
    
    // Update notification badge
    const allPending = reservations.filter(r => r.status === 'pending').length;
    document.getElementById('notifications-btn').dataset.count = allPending;
}

function renderReservations() {
    const container = document.getElementById('reservations-container');
    const dateStr = currentDate.toISOString().split('T')[0];
    
    let filtered = reservations;
    
    switch (currentView) {
        case 'today':
            filtered = reservations.filter(r => r.date === dateStr);
            break;
        case 'pending':
            filtered = reservations.filter(r => r.status === 'pending');
            break;
        case 'week':
            // Show selected day in week view
            filtered = reservations.filter(r => r.date === dateStr);
            break;
        case 'all':
            // Show all future reservations
            const today = new Date().toISOString().split('T')[0];
            filtered = reservations.filter(r => r.date >= today);
            break;
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">Nessuna prenotazione</div>
            </div>
        `;
        return;
    }
    
    // Group by time
    const groups = {};
    filtered.forEach(res => {
        const key = res.time;
        if (!groups[key]) groups[key] = [];
        groups[key].push(res);
    });
    
    let html = '';
    
    Object.keys(groups).sort().forEach(time => {
        const icon = getTimeIcon(time);
        html += `
            <div class="time-group">
                <div class="time-group-header">
                    <span class="time-group-icon">${icon}</span>
                    <span>${time}</span>
                    <div class="time-group-line"></div>
                </div>
                ${groups[time].map(res => renderReservationCard(res)).join('')}
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Add event listeners to action buttons
    container.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            const id = btn.dataset.id;
            
            switch (action) {
                case 'confirm':
                    confirmReservation(id);
                    break;
                case 'reject':
                    rejectReservation(id);
                    break;
                case 'call':
                    callCustomer(id);
                    break;
                case 'whatsapp':
                    whatsappCustomer(id);
                    break;
            }
        });
    });
}

function renderReservationCard(res) {
    const statusClass = res.status || 'pending';
    const statusLabels = {
        pending: 'In Attesa',
        confirmed: 'Confermata',
        rejected: 'Rifiutata',
        cancelled: 'Cancellata'
    };
    
    const showActions = res.status === 'pending';
    
    return `
        <div class="reservation-card ${statusClass}">
            <div class="card-header">
                <div class="card-time">${res.time}</div>
                <span class="card-status ${statusClass}">${statusLabels[statusClass]}</span>
            </div>
            <div class="card-info">
                <div class="card-info-item">
                    <span class="card-info-icon">👤</span>
                    <span class="card-name">${res.name}</span>
                </div>
                <div class="card-info-item">
                    <span class="card-info-icon">👥</span>
                    <span>${res.guests} ${res.guests === 1 ? 'persona' : 'persone'}</span>
                </div>
                <div class="card-info-item">
                    <span class="card-info-icon">🪑</span>
                    <span>${res.tableName || 'Tavolo ' + res.tableId}</span>
                </div>
                <div class="card-info-item">
                    <span class="card-info-icon">📱</span>
                    <span>${res.phone}</span>
                </div>
            </div>
            ${res.notes ? `<div class="card-notes">📝 ${res.notes}</div>` : ''}
            <div class="card-actions">
                ${showActions ? `
                    <button class="action-btn confirm" data-action="confirm" data-id="${res.id}">
                        ✓ Conferma
                    </button>
                    <button class="action-btn reject" data-action="reject" data-id="${res.id}">
                        ✕ Rifiuta
                    </button>
                ` : ''}
                <button class="action-btn call" data-action="call" data-id="${res.id}">
                    📞
                </button>
                <button class="action-btn whatsapp" data-action="whatsapp" data-id="${res.id}">
                    💬
                </button>
            </div>
        </div>
    `;
}

function getTimeIcon(time) {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 15) return '☀️';
    if (hour < 18) return '🍹';
    return '🌙';
}

// ===================== ACTIONS =====================

async function confirmReservation(id) {
    try {
        await updateReservationStatus(id, 'confirmed');
        showToast('✅ Prenotazione confermata!', 'success');
        
        // Update local state
        const res = reservations.find(r => r.id === id);
        if (res) {
            res.status = 'confirmed';
            updateStats();
            renderReservations();
            
            // Open WhatsApp to notify customer
            const message = `🍽️ Skalette Bistro - Prenotazione CONFERMATA ✅

Gentile ${res.name},
la tua prenotazione è stata confermata!

📅 Data: ${formatDate(res.date)}
⏰ Orario: ${res.time}
👥 Persone: ${res.guests}
🪑 Tavolo: ${res.tableName}

Ti aspettiamo!
Via Pellicciai, 12 - Verona`;

            const phone = res.phone.replace(/\D/g, '');
            const fullPhone = phone.startsWith('39') ? phone : '39' + phone;
            window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`, '_blank');
        }
    } catch (error) {
        console.error('Error confirming:', error);
        showToast('Errore conferma prenotazione', 'error');
    }
}

async function rejectReservation(id) {
    if (!confirm('Sei sicuro di voler rifiutare questa prenotazione?')) return;
    
    try {
        await updateReservationStatus(id, 'rejected');
        showToast('❌ Prenotazione rifiutata', 'success');
        
        // Update local state
        const res = reservations.find(r => r.id === id);
        if (res) {
            res.status = 'rejected';
            updateStats();
            renderReservations();
            
            // Open WhatsApp to notify customer
            const message = `🍽️ Skalette Bistro

Gentile ${res.name},
ci dispiace ma non è stato possibile confermare la prenotazione per il ${formatDate(res.date)} alle ${res.time}.

Ti invitiamo a contattarci per trovare un'alternativa:
📞 045 8030500

Grazie per la comprensione!`;

            const phone = res.phone.replace(/\D/g, '');
            const fullPhone = phone.startsWith('39') ? phone : '39' + phone;
            window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`, '_blank');
        }
    } catch (error) {
        console.error('Error rejecting:', error);
        showToast('Errore rifiuto prenotazione', 'error');
    }
}

function callCustomer(id) {
    const res = reservations.find(r => r.id === id);
    if (res) {
        window.location.href = `tel:${res.phone}`;
    }
}

function whatsappCustomer(id) {
    const res = reservations.find(r => r.id === id);
    if (res) {
        const phone = res.phone.replace(/\D/g, '');
        const fullPhone = phone.startsWith('39') ? phone : '39' + phone;
        window.open(`https://wa.me/${fullPhone}`, '_blank');
    }
}

// ===================== REAL-TIME UPDATES =====================

function setupRealTimeListener() {
    // Poll every 30 seconds for updates
    setInterval(async () => {
        const oldPending = reservations.filter(r => r.status === 'pending').length;
        await loadReservations();
        const newPending = reservations.filter(r => r.status === 'pending').length;
        
        if (newPending > oldPending) {
            showToast('🔔 Nuova prenotazione!', 'success');
            playNotificationSound();
            
            // Send browser notification
            if (Notification.permission === 'granted') {
                new Notification('Skalette Staff', {
                    body: 'Nuova prenotazione ricevuta!',
                    icon: 'images/logo.png'
                });
            }
        }
    }, 30000);
}

function playNotificationSound() {
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQAAnN/TmkoAAIGdf2xRPDVTmL+0j1wsBT5lseXomV8AAJ3h2aZmAAAoWLK6qnxQNlGWuq6FWCoANWzF8O6kZAAAcLS7mVMAAJuxpYVLMDtiobutiEsgACtz0vv0qWEAAHe5wJ5VAACdtKiHTTI9ZqW/sIpMIAAtdtb/+axfAAB6vMSiWAAAoLesjlE1P2moxbWNTiEALnna//+uXQAAfL/HpVoAAKO6sJFTNkFrrMm5kFAiAC977f//sVsAAH7CyqhdAACmvbSUVTdDbrDNvZNSIwAwe///87NZAACBxc2rYAAAqcC3l1c5RXG00sCWVCQAMH7//vS1VwAAg8jQrmIAAKzDuplZOkd0t9bDmVYlADJ///71t1UAAIbL0rFkAACvxr6cWztJd7vZxpxYJgAy////97lTAACIztW0ZgAAssl/n1w9THq+3MmfWicAM////vi7UQAAi9HYt2gAALXMgqJePk59weHMolwpADP///76vU8AAI3U27pqAAC4z4WlYEBRgMTkz6VeLAAz////+75NAACQz9y8bAAAutKIqGJBU4PH59KoYC0ANP///fzATAAAktLfv24AAL3ViqtlQ1aGyuvVq2MuADT//vz9wUoAAJTV4cJxAADA2I2ta0VZic3u2K5lLwA1//38/sNIAACX2OPEdAAAwtuQsG1HXIzQ8duxaDEANf/9/P/FRgAAmNrlxncAAMXekLNwSV+P0/TetGoyADb//fz/x0QAAJrd58l5AADIxZO2c0tik9b35bhsNAA2//38/8lCAACc3+nMewAAy8iWuXZNZZbZ+ui7bzUANv/9+//LQAAAn+LrzX4AAM7LmLx5T2iZ3P3rvm43ADf//fr/zT4AAKHV7dCBAADQzpu/fFFrnuD/7sF0OAA3//36/889AACk1+/TgwAA09GewH5TbqHj//HEdzoAN//++v/QPAAApt3x1oUAANbUocOBVnGk5v/0x3o8ADf//vr/0joAAKjg89mIAADZ15TFhFh0p+n/98p9PgA3//76/9Q5AACq4/XcigAA3NqXyIdafKrs//rNgEAAOP/++v/WNwAArOX34I0AAN/dn8qKXH2t7//90oJCADj//vn/2DUAADDs9+OSAADi4KLNjV+Br/D/ANWFRAAz//75/9o0AAA=');
        audio.play();
    } catch (e) {
        // Ignore audio errors
    }
}

// ===================== NOTIFICATIONS =====================

async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            showToast('🔔 Notifiche attivate!', 'success');
        }
    }
}

// ===================== UTILITIES =====================

function formatDate(dateStr) {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(dateStr).toLocaleDateString('it-IT', options);
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===================== INITIALIZATION =====================

document.addEventListener('DOMContentLoaded', () => {
    initPinKeypad();
    
    // Check if already authenticated
    if (!checkAuth()) {
        // Show login screen (already visible by default)
    }
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('✅ SW registered for staff app'))
            .catch(err => console.error('SW registration failed:', err));
    }
});
