// OneSignal Push Notifications for Skalette Staff
// Configuration and helper functions

// ==================== CONFIGURATION ====================
// Replace these with your OneSignal credentials
const ONESIGNAL_APP_ID = '18dac128-99ba-439e-a5ba-5bd2bd4e1593';
const ONESIGNAL_SAFARI_WEB_ID = null; // Optional for Safari

// ==================== INITIALIZATION ====================

export function initOneSignal() {
    return new Promise((resolve, reject) => {
        // Load OneSignal SDK
        const script = document.createElement('script');
        script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
        script.defer = true;
        
        script.onload = () => {
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            
            window.OneSignalDeferred.push(async function(OneSignal) {
                try {
                    await OneSignal.init({
                        appId: ONESIGNAL_APP_ID,
                        safari_web_id: ONESIGNAL_SAFARI_WEB_ID,
                        notifyButton: {
                            enable: false // We'll use our own UI
                        },
                        allowLocalhostAsSecureOrigin: true, // For testing
                        // Path to service worker for GitHub Pages subdirectory
                        path: '/skalette-bistro/',
                        serviceWorkerParam: { scope: '/skalette-bistro/' },
                        serviceWorkerPath: '/skalette-bistro/OneSignalSDKWorker.js',
                        welcomeNotification: {
                            title: "Skalette Staff",
                            message: "Notifiche attivate! Riceverai avvisi per nuove prenotazioni."
                        },
                        promptOptions: {
                            slidedown: {
                                prompts: [{
                                    type: "push",
                                    autoPrompt: false,
                                    text: {
                                        actionMessage: "Vuoi ricevere notifiche per nuove prenotazioni?",
                                        acceptButton: "Sì, attiva",
                                        cancelButton: "Non ora"
                                    }
                                }]
                            }
                        }
                    });
                    
                    console.log('✅ OneSignal initialized');
                    resolve(OneSignal);
                } catch (error) {
                    console.error('❌ OneSignal init error:', error);
                    reject(error);
                }
            });
        };
        
        script.onerror = () => {
            console.error('❌ Failed to load OneSignal SDK');
            reject(new Error('Failed to load OneSignal SDK'));
        };
        
        document.head.appendChild(script);
    });
}

// ==================== PERMISSION MANAGEMENT ====================

export async function requestNotificationPermission() {
    try {
        const OneSignal = window.OneSignal;
        if (!OneSignal) {
            console.warn('OneSignal not initialized');
            return false;
        }
        
        const permission = await OneSignal.Notifications.permission;
        
        if (!permission) {
            // Show the permission prompt
            await OneSignal.Slidedown.promptPush();
        }
        
        return await OneSignal.Notifications.permission;
    } catch (error) {
        console.error('Error requesting permission:', error);
        return false;
    }
}

export async function getNotificationPermissionStatus() {
    try {
        const OneSignal = window.OneSignal;
        if (!OneSignal) return 'unavailable';
        
        const permission = await OneSignal.Notifications.permission;
        return permission ? 'granted' : 'denied';
    } catch (error) {
        return 'unavailable';
    }
}

// ==================== USER TAGS ====================

// Tag this device as staff to receive staff notifications
export async function registerAsStaff(staffId = 'staff') {
    try {
        const OneSignal = window.OneSignal;
        if (!OneSignal) return;
        
        await OneSignal.User.addTags({
            user_type: 'staff',
            staff_id: staffId,
            notifications_enabled: 'true'
        });
        
        console.log('✅ Registered as staff for notifications');
    } catch (error) {
        console.error('Error registering as staff:', error);
    }
}

// ==================== GET PLAYER ID ====================

export async function getPlayerId() {
    try {
        const OneSignal = window.OneSignal;
        if (!OneSignal) return null;
        
        const playerId = await OneSignal.User.PushSubscription.id;
        return playerId;
    } catch (error) {
        console.error('Error getting player ID:', error);
        return null;
    }
}

// ==================== SEND NOTIFICATION (via REST API) ====================

// Note: For production, this should be done from a backend server
// This is for testing purposes only
export async function sendTestNotification(title, message) {
    console.log('📤 Test notification:', title, message);
    
    // In production, you would call your backend which then calls OneSignal API
    // The backend needs the REST API Key (secret, never expose in client code)
    
    // For now, just show a local notification as fallback
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: 'images/logo.png',
            badge: 'images/logo.png'
        });
    }
}

// ==================== NOTIFICATION HANDLERS ====================

export function onNotificationReceived(callback) {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    
    window.OneSignalDeferred.push(function(OneSignal) {
        OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
            console.log('📩 Notification received in foreground:', event);
            callback(event.notification);
        });
    });
}

export function onNotificationClicked(callback) {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    
    window.OneSignalDeferred.push(function(OneSignal) {
        OneSignal.Notifications.addEventListener('click', (event) => {
            console.log('🖱️ Notification clicked:', event);
            callback(event.notification);
        });
    });
}

// ==================== HELPER: CHECK iOS ====================

export function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
}

// ==================== EXPORT CONFIG CHECK ====================

export function isConfigured() {
    return ONESIGNAL_APP_ID !== 'YOUR_ONESIGNAL_APP_ID';
}
