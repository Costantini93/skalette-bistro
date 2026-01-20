// Waitlist Service for Skalette Bistro
// Manages waitlist when all tables are booked

import { 
    isTableAvailable, 
    TABLES_CONFIG,
    getReservationsByDate,
    createReservation,
    PROJECT_ID,
    FIREBASE_API_KEY
} from './firebase-config.js';
import { sendEmail } from './email-service.js';

// ===================== WAITLIST MANAGEMENT =====================

// Add customer to waitlist
export async function addToWaitlist(customerData, date, time, mealType, guests) {
    try {
        const waitlistEntry = {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            date: date,
            time: time,
            mealType: mealType,
            guests: guests,
            createdAt: new Date().toISOString(),
            notified: false
        };
        
        // Save to Firebase waitlist collection
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/waitlist?key=${FIREBASE_API_KEY}`;
        
        const firestoreData = {
            fields: {
                name: { stringValue: waitlistEntry.name },
                email: { stringValue: waitlistEntry.email },
                phone: { stringValue: waitlistEntry.phone },
                date: { stringValue: waitlistEntry.date },
                time: { stringValue: waitlistEntry.time },
                mealType: { stringValue: waitlistEntry.mealType },
                guests: { integerValue: waitlistEntry.guests },
                createdAt: { stringValue: waitlistEntry.createdAt },
                notified: { booleanValue: false }
            }
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(firestoreData)
        });
        
        if (response.ok) {
            const data = await response.json();
            const waitlistId = data.name.split('/').pop();
            
            // Send confirmation email
            sendWaitlistConfirmationEmail(waitlistEntry, waitlistId).catch(err => 
                console.error('Email error:', err)
            );
            
            return { success: true, id: waitlistId };
        } else {
            throw new Error('Failed to add to waitlist');
        }
    } catch (error) {
        console.error('Error adding to waitlist:', error);
        return { success: false, error: error.message };
    }
}

// Check waitlist when a table becomes available
export async function checkWaitlistForAvailability(date, time, mealType) {
    try {
        // Get all waitlist entries for this date/time
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/waitlist?key=${FIREBASE_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) return [];
        
        const data = await response.json();
        if (!data.documents) return [];
        
        const waitlistEntries = data.documents
            .map(doc => {
                const fields = doc.fields;
                return {
                    id: doc.name.split('/').pop(),
                    name: fields.name?.stringValue || '',
                    email: fields.email?.stringValue || '',
                    phone: fields.phone?.stringValue || '',
                    date: fields.date?.stringValue || '',
                    time: fields.time?.stringValue || '',
                    mealType: fields.mealType?.stringValue || '',
                    guests: parseInt(fields.guests?.integerValue || '0'),
                    notified: fields.notified?.booleanValue || false,
                    createdAt: fields.createdAt?.stringValue || ''
                };
            })
            .filter(entry => 
                entry.date === date && 
                entry.time === time && 
                entry.mealType === mealType &&
                !entry.notified
            )
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // First come, first served
        
        // Check if any tables are available
        let availableTable = null;
        for (const table of TABLES_CONFIG) {
            const available = await isTableAvailable(table.id, date, time, mealType);
            if (available) {
                availableTable = table;
                break;
            }
        }
        
        if (availableTable && waitlistEntries.length > 0) {
            // Notify first person in waitlist
            const firstEntry = waitlistEntries[0];
            await notifyWaitlistCustomer(firstEntry, availableTable);
            
            return { notified: firstEntry, table: availableTable };
        }
        
        return null;
    } catch (error) {
        console.error('Error checking waitlist:', error);
        return null;
    }
}

// Notify waitlist customer about availability
async function notifyWaitlistCustomer(waitlistEntry, table) {
    try {
        // Send email notification
        const lang = 'it'; // Could be detected from customer data
        const subject = lang === 'it'
            ? `🎉 Tavolo Disponibile - Skalette Bistro`
            : `🎉 Table Available - Skalette Bistro`;
        
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #22c55e; color: white; padding: 30px; text-align: center; }
        .content { background: #f8f7f4; padding: 30px; }
        .button { display: inline-block; background: #c9a961; color: #0a1628; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Tavolo Disponibile!</h1>
        </div>
        <div class="content">
            <p>Gentile ${waitlistEntry.name},</p>
            <p>Un tavolo è diventato disponibile per la data che hai richiesto!</p>
            <p><strong>Data:</strong> ${new Date(waitlistEntry.date).toLocaleDateString('it-IT')}</p>
            <p><strong>Orario:</strong> ${waitlistEntry.time}</p>
            <p><strong>Tavolo:</strong> ${table.name}</p>
            <p>Affrettati! Il tavolo è disponibile per le prossime 2 ore.</p>
            <a href="${window.location.origin}/#reservation" class="button">Prenota Ora</a>
        </div>
    </div>
</body>
</html>`;
        
        await sendEmail(waitlistEntry.email, subject, html, 'confirmation');
        
        // Mark as notified in Firebase
        const updateUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/waitlist/${waitlistEntry.id}?key=${FIREBASE_API_KEY}`;
        await fetch(updateUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fields: {
                    notified: { booleanValue: true },
                    notifiedAt: { stringValue: new Date().toISOString() }
                }
            })
        });
        
        return { success: true };
    } catch (error) {
        console.error('Error notifying waitlist customer:', error);
        return { success: false, error: error.message };
    }
}

// Send waitlist confirmation email
async function sendWaitlistConfirmationEmail(waitlistEntry, waitlistId) {
    const subject = 'Sei in lista d\'attesa - Skalette Bistro';
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 30px; text-align: center; }
        .content { background: #f8f7f4; padding: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⏳ Sei in Lista d'Attesa</h1>
        </div>
        <div class="content">
            <p>Gentile ${waitlistEntry.name},</p>
            <p>Ti abbiamo aggiunto alla lista d'attesa per il ${new Date(waitlistEntry.date).toLocaleDateString('it-IT')} alle ${waitlistEntry.time}.</p>
            <p>Ti notificheremo immediatamente se un tavolo diventa disponibile!</p>
        </div>
    </div>
</body>
</html>`;
    
    return await sendEmail(waitlistEntry.email, subject, html, 'confirmation');
}
