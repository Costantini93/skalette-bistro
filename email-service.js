// Email Service for Skalette Bistro - Automated Notifications
// Uses Firebase Cloud Functions or EmailJS as fallback

const EMAIL_SERVICE_CONFIG = {
    // EmailJS configuration (free tier available)
    serviceId: 'service_e181nsr',
    templateId: {
        confirmation: 'template_confirmation',
        reminder: 'template_confirmation',
        feedback: 'template_confirmation',
        cancellation: 'template_cancellation'
    },
    publicKey: 'WwFgEnjUKyRiytSzv'
};

// Alternative: Firebase Cloud Functions endpoint
const FIREBASE_FUNCTIONS_URL = 'https://us-central1-skalette-bistro.cloudfunctions.net';

// ===================== EMAIL TEMPLATES =====================

function getConfirmationEmailHTML(reservation, lang = 'it') {
    const isItalian = lang === 'it';
    const dateFormatted = new Date(reservation.date).toLocaleDateString(
        isItalian ? 'it-IT' : 'en-GB',
        { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    );
    
    const manageLink = `${window.location.origin}/manage-reservation.html?id=${reservation.id}&token=${reservation.manageToken}`;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0a1628; color: #c9a961; padding: 30px; text-align: center; }
        .content { background: #f8f7f4; padding: 30px; }
        .details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #c9a961; }
        .button { display: inline-block; background: #c9a961; color: #0a1628; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${isItalian ? 'SKALETTE BISTRO' : 'SKALETTE BISTRO'}</h1>
        </div>
        <div class="content">
            <h2>${isItalian ? 'Prenotazione Ricevuta' : 'Reservation Received'}</h2>
            <p>${isItalian ? `Gentile ${reservation.name},` : `Dear ${reservation.name},`}</p>
            <p>${isItalian ? 'Abbiamo ricevuto la tua richiesta di prenotazione. Ti confermeremo al più presto!' : 'We have received your reservation request. We will confirm it as soon as possible!'}</p>
            
            <div class="details">
                <h3>${isItalian ? 'Dettagli Prenotazione' : 'Reservation Details'}</h3>
                <p><strong>${isItalian ? 'Data:' : 'Date:'}</strong> ${dateFormatted}</p>
                <p><strong>${isItalian ? 'Orario:' : 'Time:'}</strong> ${reservation.time}</p>
                <p><strong>${isItalian ? 'Persone:' : 'Guests:'}</strong> ${reservation.guests}</p>
                <p><strong>${isItalian ? 'Tavolo:' : 'Table:'}</strong> ${reservation.tableName}</p>
                <p><strong>${isItalian ? 'ID Prenotazione:' : 'Reservation ID:'}</strong> ${reservation.id}</p>
            </div>
            
            <a href="${manageLink}" class="button">${isItalian ? 'Gestisci Prenotazione' : 'Manage Reservation'}</a>
            
            <p>${isItalian ? 'Puoi modificare o cancellare la prenotazione usando il link sopra.' : 'You can modify or cancel your reservation using the link above.'}</p>
        </div>
        <div class="footer">
            <p>Skalette Bistro | Via Pellicciai, 12 - Verona | 045 8030500</p>
        </div>
    </div>
</body>
</html>`;
}

function getConfirmedEmailHTML(reservation, lang = 'it') {
    const isItalian = lang === 'it';
    const dateFormatted = new Date(reservation.date).toLocaleDateString(
        isItalian ? 'it-IT' : 'en-GB',
        { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    );
    
    const manageLink = `${window.location.origin}/manage-reservation.html?id=${reservation.id}&token=${reservation.manageToken}`;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #22c55e; color: white; padding: 30px; text-align: center; }
        .content { background: #f8f7f4; padding: 30px; }
        .details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #22c55e; }
        .button { display: inline-block; background: #c9a961; color: #0a1628; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ ${isItalian ? 'PRENOTAZIONE CONFERMATA' : 'RESERVATION CONFIRMED'}</h1>
        </div>
        <div class="content">
            <h2>${isItalian ? 'La tua prenotazione è confermata!' : 'Your reservation is confirmed!'}</h2>
            <p>${isItalian ? `Gentile ${reservation.name},` : `Dear ${reservation.name},`}</p>
            <p>${isItalian ? 'Siamo felici di confermarti la prenotazione!' : 'We are happy to confirm your reservation!'}</p>
            
            <div class="details">
                <h3>${isItalian ? 'Dettagli Prenotazione' : 'Reservation Details'}</h3>
                <p><strong>${isItalian ? 'Data:' : 'Date:'}</strong> ${dateFormatted}</p>
                <p><strong>${isItalian ? 'Orario:' : 'Time:'}</strong> ${reservation.time}</p>
                <p><strong>${isItalian ? 'Persone:' : 'Guests:'}</strong> ${reservation.guests}</p>
                <p><strong>${isItalian ? 'Tavolo:' : 'Table:'}</strong> ${reservation.tableName}</p>
            </div>
            
            <p><strong>${isItalian ? 'Ti aspettiamo!' : 'We look forward to seeing you!'}</strong></p>
            <p>${isItalian ? 'Via Pellicciai, 12 - Verona' : 'Via Pellicciai, 12 - Verona'}</p>
            
            <a href="${manageLink}" class="button">${isItalian ? 'Gestisci Prenotazione' : 'Manage Reservation'}</a>
        </div>
        <div class="footer">
            <p>Skalette Bistro | Via Pellicciai, 12 - Verona | 045 8030500</p>
        </div>
    </div>
</body>
</html>`;
}

function getReminderEmailHTML(reservation, hoursBefore, lang = 'it') {
    const isItalian = lang === 'it';
    const dateFormatted = new Date(reservation.date).toLocaleDateString(
        isItalian ? 'it-IT' : 'en-GB',
        { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    );
    
    const manageLink = `${window.location.origin}/manage-reservation.html?id=${reservation.id}&token=${reservation.manageToken}`;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #c9a961; color: #0a1628; padding: 30px; text-align: center; }
        .content { background: #f8f7f4; padding: 30px; }
        .details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #c9a961; }
        .button { display: inline-block; background: #c9a961; color: #0a1628; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 ${isItalian ? 'PROMEMORIA PRENOTAZIONE' : 'RESERVATION REMINDER'}</h1>
        </div>
        <div class="content">
            <h2>${isItalian ? `Ti ricordiamo la tua prenotazione tra ${hoursBefore} ore!` : `Reminder: Your reservation is in ${hoursBefore} hours!`}</h2>
            <p>${isItalian ? `Gentile ${reservation.name},` : `Dear ${reservation.name},`}</p>
            
            <div class="details">
                <h3>${isItalian ? 'Dettagli Prenotazione' : 'Reservation Details'}</h3>
                <p><strong>${isItalian ? 'Data:' : 'Date:'}</strong> ${dateFormatted}</p>
                <p><strong>${isItalian ? 'Orario:' : 'Time:'}</strong> ${reservation.time}</p>
                <p><strong>${isItalian ? 'Persone:' : 'Guests:'}</strong> ${reservation.guests}</p>
                <p><strong>${isItalian ? 'Tavolo:' : 'Table:'}</strong> ${reservation.tableName}</p>
            </div>
            
            <p>${isItalian ? 'Ti aspettiamo!' : 'We look forward to seeing you!'}</p>
            
            <a href="${manageLink}" class="button">${isItalian ? 'Gestisci Prenotazione' : 'Manage Reservation'}</a>
        </div>
        <div class="footer">
            <p>Skalette Bistro | Via Pellicciai, 12 - Verona | 045 8030500</p>
        </div>
    </div>
</body>
</html>`;
}

function getFeedbackEmailHTML(reservation, lang = 'it') {
    const isItalian = lang === 'it';
    const feedbackLink = `${window.location.origin}/feedback.html?id=${reservation.id}&token=${reservation.manageToken}`;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0a1628; color: #c9a961; padding: 30px; text-align: center; }
        .content { background: #f8f7f4; padding: 30px; }
        .button { display: inline-block; background: #c9a961; color: #0a1628; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⭐ ${isItalian ? 'LA TUA OPINIONE' : 'YOUR FEEDBACK'}</h1>
        </div>
        <div class="content">
            <h2>${isItalian ? 'Come è stata la tua esperienza?' : 'How was your experience?'}</h2>
            <p>${isItalian ? `Gentile ${reservation.name},` : `Dear ${reservation.name},`}</p>
            <p>${isItalian ? 'Speriamo che tu abbia trascorso una piacevole serata da noi!' : 'We hope you had a pleasant evening with us!'}</p>
            <p>${isItalian ? 'La tua opinione è molto importante per migliorare il nostro servizio.' : 'Your feedback is very important to improve our service.'}</p>
            
            <a href="${feedbackLink}" class="button">${isItalian ? 'Lascia un Feedback' : 'Leave Feedback'}</a>
            
            <p style="font-size: 12px; color: #666; margin-top: 20px;">
                ${isItalian ? 'Il feedback richiede solo 1 minuto' : 'Feedback takes only 1 minute'}
            </p>
        </div>
        <div class="footer">
            <p>Skalette Bistro | Via Pellicciai, 12 - Verona | 045 8030500</p>
        </div>
    </div>
</body>
</html>`;
}

// ===================== EMAIL SENDING =====================

// Send email using EmailJS (free tier)
async function sendEmailViaEmailJS(to, subject, htmlContent, templateType) {
    try {
        // Check if EmailJS is loaded
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS not loaded, using fallback');
            return { success: false, error: 'EmailJS not available' };
        }
        
        const templateParams = {
            to_email: to,
            subject: subject,
            message_html: htmlContent,
            to_name: to.split('@')[0]
        };
        
        await emailjs.send(
            EMAIL_SERVICE_CONFIG.serviceId,
            EMAIL_SERVICE_CONFIG.templateId[templateType],
            templateParams
        );
        
        return { success: true };
    } catch (error) {
        console.error('EmailJS error:', error);
        return { success: false, error: error.message };
    }
}

// Send email using Firebase Cloud Functions (recommended for production)
async function sendEmailViaFirebase(to, subject, htmlContent) {
    try {
        const response = await fetch(`${FIREBASE_FUNCTIONS_URL}/sendEmail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to,
                subject,
                html: htmlContent
            })
        });
        
        if (response.ok) {
            return { success: true };
        } else {
            const error = await response.text();
            return { success: false, error };
        }
    } catch (error) {
        console.error('Firebase Functions error:', error);
        return { success: false, error: error.message };
    }
}

// Main email sending function (uses EmailJS)
export async function sendEmail(to, subject, htmlContent, templateType = 'confirmation') {
    // Try EmailJS first
    let result = await sendEmailViaEmailJS(to, subject, htmlContent, templateType);
    
    // Fallback to Firebase Functions if EmailJS fails
    if (!result.success) {
        result = await sendEmailViaFirebase(to, subject, htmlContent);
    }
    
    console.log('Email send result:', result);
    return result;
}

// ===================== AUTOMATED EMAIL FUNCTIONS =====================

export async function sendConfirmationEmail(reservation, lang = 'it') {
    const subject = lang === 'it' 
        ? `Skalette Bistro - Prenotazione Ricevuta #${reservation.id}`
        : `Skalette Bistro - Reservation Received #${reservation.id}`;
    
    const html = getConfirmationEmailHTML(reservation, lang);
    return await sendEmail(reservation.email, subject, html, 'confirmation');
}

export async function sendConfirmedEmail(reservation, lang = 'it') {
    const subject = lang === 'it'
        ? `✅ Skalette Bistro - Prenotazione Confermata #${reservation.id}`
        : `✅ Skalette Bistro - Reservation Confirmed #${reservation.id}`;
    
    const html = getConfirmedEmailHTML(reservation, lang);
    return await sendEmail(reservation.email, subject, html, 'confirmation');
}

export async function sendReminderEmail(reservation, hoursBefore, lang = 'it') {
    const subject = lang === 'it'
        ? `🔔 Promemoria: La tua prenotazione tra ${hoursBefore} ore - Skalette Bistro`
        : `🔔 Reminder: Your reservation in ${hoursBefore} hours - Skalette Bistro`;
    
    const html = getReminderEmailHTML(reservation, hoursBefore, lang);
    return await sendEmail(reservation.email, subject, html, 'reminder');
}

export async function sendFeedbackEmail(reservation, lang = 'it') {
    const subject = lang === 'it'
        ? `⭐ Come è stata la tua esperienza? - Skalette Bistro`
        : `⭐ How was your experience? - Skalette Bistro`;
    
    const html = getFeedbackEmailHTML(reservation, lang);
    return await sendEmail(reservation.email, subject, html, 'feedback');
}

export async function sendCancellationEmail(reservation, reason, lang = 'it') {
    const isItalian = lang === 'it';
    const subject = isItalian
        ? `Skalette Bistro - Prenotazione Cancellata`
        : `Skalette Bistro - Reservation Cancelled`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 30px; text-align: center; }
        .content { background: #f8f7f4; padding: 30px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${isItalian ? 'PRENOTAZIONE CANCELLATA' : 'RESERVATION CANCELLED'}</h1>
        </div>
        <div class="content">
            <p>${isItalian ? `Gentile ${reservation.name},` : `Dear ${reservation.name},`}</p>
            <p>${isItalian ? 'La tua prenotazione è stata cancellata.' : 'Your reservation has been cancelled.'}</p>
            ${reason ? `<p><strong>${isItalian ? 'Motivo:' : 'Reason:'}</strong> ${reason}</p>` : ''}
            <p>${isItalian ? 'Speriamo di vederti presto!' : 'We hope to see you soon!'}</p>
        </div>
        <div class="footer">
            <p>Skalette Bistro | Via Pellicciai, 12 - Verona | 045 8030500</p>
        </div>
    </div>
</body>
</html>`;
    
    return await sendEmail(reservation.email, subject, html, 'cancellation');
}
