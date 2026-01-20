// Automated Reminder Service for Skalette Bistro
// Runs scheduled reminders for reservations

import { 
    getReservationsByDate, 
    getAllReservations,
    PROJECT_ID 
} from './firebase-config.js';
import { sendReminderEmail } from './email-service.js';

// ===================== REMINDER SCHEDULING =====================

// Check and send reminders for upcoming reservations
export async function checkAndSendReminders() {
    try {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        // Get all confirmed reservations for tomorrow
        const reservations = await getReservationsByDate(tomorrowStr);
        const confirmedReservations = reservations.filter(r => r.status === 'confirmed');
        
        // Send 24h reminders
        for (const reservation of confirmedReservations) {
            await sendReminderIfNeeded(reservation, 24);
        }
        
        // Also check for 2h reminders (same day)
        const todayStr = now.toISOString().split('T')[0];
        const todayReservations = await getReservationsByDate(todayStr);
        const todayConfirmed = todayReservations.filter(r => r.status === 'confirmed');
        
        for (const reservation of todayConfirmed) {
            await sendReminderIfNeeded(reservation, 2);
        }
        
        return { success: true, remindersSent: confirmedReservations.length };
    } catch (error) {
        console.error('Error checking reminders:', error);
        return { success: false, error: error.message };
    }
}

// Check if reminder should be sent and send it
async function sendReminderIfNeeded(reservation, hoursBefore) {
    try {
        const reservationDate = new Date(reservation.date);
        const reservationTime = reservation.time.split(':');
        reservationDate.setHours(parseInt(reservationTime[0]), parseInt(reservationTime[1]), 0, 0);
        
        const now = new Date();
        const targetTime = new Date(reservationDate);
        targetTime.setHours(targetTime.getHours() - hoursBefore);
        
        // Check if we're within the reminder window (target time ± 30 minutes)
        const timeDiff = Math.abs(now - targetTime);
        const thirtyMinutes = 30 * 60 * 1000;
        
        if (timeDiff <= thirtyMinutes) {
            // Check if reminder already sent
            const reminderKey = `reminder_${hoursBefore}h_${reservation.id}`;
            const reminderSent = localStorage.getItem(reminderKey);
            
            if (!reminderSent) {
                // Send reminder
                const lang = reservation.language || 'it';
                await sendReminderEmail(reservation, hoursBefore, lang);
                
                // Mark as sent
                localStorage.setItem(reminderKey, 'true');
                
                console.log(`✅ Reminder sent for reservation ${reservation.id} (${hoursBefore}h before)`);
            }
        }
    } catch (error) {
        console.error(`Error sending reminder for ${reservation.id}:`, error);
    }
}

// Check and send feedback emails (2 hours after reservation time)
export async function checkAndSendFeedbackEmails() {
    try {
        const now = new Date();
        const twoHoursAgo = new Date(now);
        twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
        
        // Get all reservations from the last 3 hours
        const allReservations = await getAllReservations();
        const recentReservations = allReservations.filter(r => {
            if (r.status !== 'confirmed') return false;
            
            const resDate = new Date(r.date);
            const resTime = r.time.split(':');
            resDate.setHours(parseInt(resTime[0]), parseInt(resTime[1]), 0, 0);
            
            // Check if reservation was 2 hours ago (± 1 hour window)
            const timeDiff = now - resDate;
            const oneHour = 60 * 60 * 1000;
            const threeHours = 3 * 60 * 60 * 1000;
            
            return timeDiff >= oneHour && timeDiff <= threeHours;
        });
        
        // Send feedback emails
        for (const reservation of recentReservations) {
            await sendFeedbackIfNeeded(reservation);
        }
        
        return { success: true, feedbackSent: recentReservations.length };
    } catch (error) {
        console.error('Error checking feedback emails:', error);
        return { success: false, error: error.message };
    }
}

// Send feedback email if not already sent
async function sendFeedbackIfNeeded(reservation) {
    try {
        const feedbackKey = `feedback_sent_${reservation.id}`;
        const feedbackSent = localStorage.getItem(feedbackKey);
        
        if (!feedbackSent && reservation.email) {
            const { sendFeedbackEmail } = await import('./email-service.js');
            const lang = reservation.language || 'it';
            await sendFeedbackEmail(reservation, lang);
            
            // Mark as sent
            localStorage.setItem(feedbackKey, 'true');
            
            console.log(`✅ Feedback email sent for reservation ${reservation.id}`);
        }
    } catch (error) {
        console.error(`Error sending feedback for ${reservation.id}:`, error);
    }
}

// Initialize reminder checking (runs every 30 minutes)
export function initReminderService() {
    // Check reminders immediately
    checkAndSendReminders();
    checkAndSendFeedbackEmails();
    
    // Then check every 30 minutes
    setInterval(() => {
        checkAndSendReminders();
        checkAndSendFeedbackEmails();
    }, 30 * 60 * 1000);
    
    console.log('✅ Reminder service initialized');
}
