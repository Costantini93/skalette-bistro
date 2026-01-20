// Push Notifications Service for Skalette Bistro
// Browser push notifications for reservation updates

// ===================== PUSH NOTIFICATION SETUP =====================

// Request notification permission
export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
    }
    
    if (Notification.permission === 'granted') {
        return true;
    }
    
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    
    return false;
}

// Show notification
export function showNotification(title, options = {}) {
    if (Notification.permission !== 'granted') {
        return;
    }
    
    const notification = new Notification(title, {
        icon: './images/logo.png',
        badge: './images/logo.png',
        ...options
    });
    
    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);
    
    // Handle click
    notification.onclick = () => {
        window.focus();
        notification.close();
    };
    
    return notification;
}

// Show reservation confirmation notification
export function notifyReservationConfirmed(reservation) {
    const dateFormatted = new Date(reservation.date).toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long'
    });
    
    showNotification('✅ Prenotazione Confermata', {
        body: `${dateFormatted} alle ${reservation.time} - Tavolo ${reservation.tableName}`,
        tag: `reservation-${reservation.id}`,
        requireInteraction: false
    });
}

// Show reminder notification
export function notifyReminder(reservation, hoursBefore) {
    const dateFormatted = new Date(reservation.date).toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long'
    });
    
    showNotification('🔔 Promemoria Prenotazione', {
        body: `La tua prenotazione è tra ${hoursBefore} ore: ${dateFormatted} alle ${reservation.time}`,
        tag: `reminder-${reservation.id}`,
        requireInteraction: false
    });
}

// Show waitlist notification
export function notifyWaitlistAvailable(waitlistEntry, table) {
    showNotification('🎉 Tavolo Disponibile!', {
        body: `Un tavolo è disponibile per il ${new Date(waitlistEntry.date).toLocaleDateString('it-IT')} alle ${waitlistEntry.time}`,
        tag: `waitlist-${waitlistEntry.id}`,
        requireInteraction: true,
        data: {
            url: `${window.location.origin}/#reservation`
        }
    });
}

// Initialize notification service
export function initPushNotifications() {
    // Request permission on page load (after user interaction)
    document.addEventListener('click', () => {
        requestNotificationPermission();
    }, { once: true });
    
    // Listen for reservation status updates
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            // Service worker can handle background notifications
            console.log('✅ Push notifications ready');
        });
    }
}
