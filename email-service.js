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
    
    const siteUrl = 'https://skalette-bistro.web.app';
    const manageLink = `${siteUrl}/manage-reservation.html?id=${reservation.id}&token=${reservation.manageToken}`;
    
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
    
    // Calcola orario di fine in base al tipo di pasto
    const mealDurations = {
        pranzo: 90,
        aperitivo: 90,
        cena: 120,
        dopocena: 120
    };
    
    // Se mealType non è definito, derivalo dall'orario
    let mealType = reservation.mealType;
    if (!mealType && reservation.time) {
        const [hours] = reservation.time.split(':').map(Number);
        if (hours < 15) mealType = 'pranzo';
        else if (hours < 18) mealType = 'aperitivo';
        else if (hours < 22) mealType = 'cena';
        else mealType = 'dopocena';
    }
    
    const duration = mealDurations[mealType] || 90;
    const [startHours, startMins] = reservation.time.split(':').map(Number);
    const endTotalMins = startHours * 60 + startMins + duration;
    const endHours = Math.floor(endTotalMins / 60) % 24;
    const endMins = endTotalMins % 60;
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
    
    const siteUrl = 'https://skalette-bistro.web.app';
    const manageLink = `${siteUrl}/manage-reservation.html?id=${reservation.id}&token=${reservation.manageToken}`;
    
    const logoUrl = 'https://skalette-bistro.web.app/images/logo.png';
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .wrapper { background-color: #f5f5f5; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0a1628 0%, #1a2d4a 100%); padding: 50px 30px; text-align: center; }
        .logo { width: 80px; height: auto; }
        .header h1 { color: #c9a961; font-size: 22px; margin: 0; font-weight: 600; letter-spacing: 2px; }
        .status-badge { display: inline-block; background: #22c55e; color: white; padding: 12px 30px; border-radius: 30px; font-size: 14px; font-weight: 600; letter-spacing: 1px; margin-top: 25px; }
        .status-badge .check { margin-right: 8px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #0a1628; margin-bottom: 20px; }
        .details { background: linear-gradient(135deg, #faf9f6 0%, #f0ede6 100%); padding: 25px; margin: 25px 0; border-radius: 12px; border-left: 4px solid #c9a961; }
        .details h3 { color: #0a1628; margin-top: 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; }
        .details p { margin: 12px 0; font-size: 15px; }
        .details strong { color: #0a1628; }
        .highlight { background: #c9a961; color: #0a1628; padding: 3px 10px; border-radius: 4px; font-weight: 600; }
        .note { margin-top: 25px; padding: 20px; background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%); border-radius: 10px; border: 1px solid #f0d78c; }
        .note p { margin: 0; font-size: 14px; color: #856404; }
        .whatsapp-link { color: #25d366; font-weight: 600; text-decoration: none; }
        .divider { height: 1px; background: linear-gradient(to right, transparent, #e0d5c7, transparent); margin: 30px 0; }
        .location { text-align: center; color: #666; font-size: 14px; }
        .location strong { color: #0a1628; }
        .footer { background: #0a1628; padding: 30px; text-align: center; }
        .footer p { color: #888; font-size: 12px; margin: 5px 0; }
        .footer .brand { color: #c9a961; font-weight: 600; font-size: 14px; }
        .social-links { margin-top: 15px; }
        .social-links a { display: inline-block; margin: 0 8px; color: #c9a961; text-decoration: none; font-size: 13px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <img src="${logoUrl}" alt="Skalette Bistro" class="logo">
                <h1>${isItalian ? 'PRENOTAZIONE' : 'RESERVATION'}</h1>
                <div class="status-badge"><span class="check">✓</span>${isItalian ? 'CONFERMATA' : 'CONFIRMED'}</div>
            </div>
            <div class="content">
                <p class="greeting">${isItalian ? `Gentile ${reservation.name},` : `Dear ${reservation.name},`}</p>
                <p>${isItalian ? 'Siamo felici di confermarti la prenotazione!' : 'We are happy to confirm your reservation!'}</p>
                
                <div class="details">
                    <h3>${isItalian ? '📋 Dettagli Prenotazione' : '📋 Reservation Details'}</h3>
                    <p><strong>${isItalian ? '📅 Data:' : '📅 Date:'}</strong> ${dateFormatted}</p>
                    <p><strong>${isItalian ? '🕐 Orario:' : '🕐 Time:'}</strong> <span class="highlight">${reservation.time}</span> - <span class="highlight">${endTime}</span></p>
                    <p><strong>${isItalian ? '👥 Persone:' : '👥 Guests:'}</strong> ${reservation.guests}</p>
                    <p><strong>${isItalian ? '🪑 Tavolo:' : '🪑 Table:'}</strong> ${reservation.tableName}</p>
                    <p style="font-size: 13px; color: #666; margin-top: 15px; font-style: italic;">
                        ${isItalian 
                            ? '💡 Se il tavolo è libero dopo il tuo orario, la permanenza può essere prolungata.' 
                            : '💡 If the table is available after your slot, your stay can be extended.'}
                    </p>
                </div>
                
                <div class="divider"></div>
                
                <p style="font-size: 18px; text-align: center;"><strong>${isItalian ? '✨ Ti aspettiamo!' : '✨ We look forward to seeing you!'}</strong></p>
                
                <div class="location">
                    <p><strong>📍 Via Pellicciai, 12 - Verona</strong></p>
                </div>
                
                <div class="note">
                    <p>${isItalian 
                        ? '💬 Per modificare o cancellare la prenotazione contatta <a href="https://wa.me/393428691832" class="whatsapp-link">+39 342 869 1832</a> su WhatsApp.' 
                        : '💬 To modify or cancel, contact <a href="https://wa.me/393428691832" class="whatsapp-link">+39 342 869 1832</a> on WhatsApp.'}</p>
                </div>
            </div>
            <div class="footer">
                <p class="brand">SKALETTE BISTRO</p>
                <p>Via Pellicciai, 12 - 37121 Verona</p>
                <p>📞 045 8030500</p>
                <div class="social-links">
                    <a href="https://www.instagram.com/skalettebistro/">Instagram</a> |
                    <a href="https://www.facebook.com/skalettebistro/">Facebook</a>
                </div>
            </div>
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
    
    const siteUrl = 'https://skalette-bistro.web.app';
    const manageLink = `${siteUrl}/manage-reservation.html?id=${reservation.id}&token=${reservation.manageToken}`;
    const logoUrl = 'https://skalette-bistro.web.app/images/logo.png';
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .wrapper { background-color: #f5f5f5; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0a1628 0%, #1a2d4a 100%); padding: 40px 30px; text-align: center; }
        .logo { width: 120px; height: auto; margin-bottom: 20px; }
        .header h1 { color: #c9a961; font-size: 24px; margin: 0; font-weight: 600; letter-spacing: 1px; }
        .header .bell { display: inline-block; width: 60px; height: 60px; background: #c9a961; border-radius: 50%; line-height: 60px; font-size: 32px; color: #0a1628; margin-bottom: 15px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #0a1628; margin-bottom: 20px; }
        .details { background: linear-gradient(135deg, #faf9f6 0%, #f0ede6 100%); padding: 25px; margin: 25px 0; border-radius: 12px; border-left: 4px solid #c9a961; }
        .details h3 { color: #0a1628; margin-top: 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; }
        .details p { margin: 12px 0; font-size: 15px; }
        .details strong { color: #0a1628; }
        .highlight { background: #c9a961; color: #0a1628; padding: 3px 10px; border-radius: 4px; font-weight: 600; }
        .divider { height: 1px; background: linear-gradient(to right, transparent, #e0d5c7, transparent); margin: 30px 0; }
        .location { text-align: center; color: #666; font-size: 14px; }
        .location strong { color: #0a1628; }
        .footer { background: #0a1628; padding: 30px; text-align: center; }
        .footer p { color: #888; font-size: 12px; margin: 5px 0; }
        .footer .brand { color: #c9a961; font-weight: 600; font-size: 14px; }
        .social-links { margin-top: 15px; }
        .social-links a { display: inline-block; margin: 0 8px; color: #c9a961; text-decoration: none; font-size: 13px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <img src="${logoUrl}" alt="Skalette Bistro" class="logo">
                <div class="bell">🔔</div>
                <h1>${isItalian ? 'PROMEMORIA PRENOTAZIONE' : 'RESERVATION REMINDER'}</h1>
            </div>
            <div class="content">
                <p class="greeting">${isItalian ? `Gentile ${reservation.name},` : `Dear ${reservation.name},`}</p>
                <p style="font-size: 18px;"><strong>${isItalian ? `⏰ La tua prenotazione è tra ${hoursBefore} ore!` : `⏰ Your reservation is in ${hoursBefore} hours!`}</strong></p>
                
                <div class="details">
                    <h3>${isItalian ? '📋 Dettagli Prenotazione' : '📋 Reservation Details'}</h3>
                    <p><strong>${isItalian ? '📅 Data:' : '📅 Date:'}</strong> ${dateFormatted}</p>
                    <p><strong>${isItalian ? '🕐 Orario:' : '🕐 Time:'}</strong> <span class="highlight">${reservation.time}</span></p>
                    <p><strong>${isItalian ? '👥 Persone:' : '👥 Guests:'}</strong> ${reservation.guests}</p>
                    <p><strong>${isItalian ? '🪑 Tavolo:' : '🪑 Table:'}</strong> ${reservation.tableName}</p>
                </div>
                
                <div class="divider"></div>
                
                <p style="font-size: 18px; text-align: center;"><strong>${isItalian ? '✨ Ti aspettiamo!' : '✨ We look forward to seeing you!'}</strong></p>
                
                <div class="location">
                    <p><strong>📍 Via Pellicciai, 12 - Verona</strong></p>
                </div>
            </div>
            <div class="footer">
                <p class="brand">SKALETTE BISTRO</p>
                <p>Via Pellicciai, 12 - 37121 Verona</p>
                <p>📞 045 8030500</p>
                <div class="social-links">
                    <a href="https://www.instagram.com/skalettebistro/">Instagram</a> |
                    <a href="https://www.facebook.com/skalettebistro/">Facebook</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
}

function getFeedbackEmailHTML(reservation, lang = 'it') {
    const isItalian = lang === 'it';
    const siteUrl = 'https://skalette-bistro.web.app';
    const feedbackLink = `${siteUrl}/feedback.html?id=${reservation.id}&token=${reservation.manageToken}`;
    const logoUrl = 'https://skalette-bistro.web.app/images/logo.png';
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .wrapper { background-color: #f5f5f5; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0a1628 0%, #1a2d4a 100%); padding: 40px 30px; text-align: center; }
        .logo { width: 120px; height: auto; margin-bottom: 20px; }
        .header h1 { color: #c9a961; font-size: 24px; margin: 0; font-weight: 600; letter-spacing: 1px; }
        .header .star { display: inline-block; width: 60px; height: 60px; background: #c9a961; border-radius: 50%; line-height: 60px; font-size: 32px; color: #0a1628; margin-bottom: 15px; }
        .content { padding: 40px 30px; text-align: center; }
        .greeting { font-size: 18px; color: #0a1628; margin-bottom: 20px; }
        .button { display: inline-block; background: linear-gradient(135deg, #c9a961 0%, #a8893e 100%); color: #0a1628; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 25px 0; box-shadow: 0 4px 15px rgba(201, 169, 97, 0.4); }
        .button:hover { transform: translateY(-2px); }
        .divider { height: 1px; background: linear-gradient(to right, transparent, #e0d5c7, transparent); margin: 30px 0; }
        .footer { background: #0a1628; padding: 30px; text-align: center; }
        .footer p { color: #888; font-size: 12px; margin: 5px 0; }
        .footer .brand { color: #c9a961; font-weight: 600; font-size: 14px; }
        .social-links { margin-top: 15px; }
        .social-links a { display: inline-block; margin: 0 8px; color: #c9a961; text-decoration: none; font-size: 13px; }
        .note { font-size: 13px; color: #888; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <img src="${logoUrl}" alt="Skalette Bistro" class="logo">
                <div class="star">⭐</div>
                <h1>${isItalian ? 'LA TUA OPINIONE CONTA' : 'YOUR FEEDBACK MATTERS'}</h1>
            </div>
            <div class="content">
                <p class="greeting">${isItalian ? `Gentile ${reservation.name},` : `Dear ${reservation.name},`}</p>
                <p>${isItalian ? 'Speriamo che tu abbia trascorso una piacevole serata da noi!' : 'We hope you had a pleasant evening with us!'}</p>
                <p>${isItalian ? 'La tua opinione è molto importante per migliorare il nostro servizio.' : 'Your feedback is very important to improve our service.'}</p>
                
                <a href="${feedbackLink}" class="button">${isItalian ? '⭐ Lascia un Feedback' : '⭐ Leave Feedback'}</a>
                
                <p class="note">${isItalian ? 'Richiede solo 1 minuto ⏱️' : 'Takes only 1 minute ⏱️'}</p>
            </div>
            <div class="footer">
                <p class="brand">SKALETTE BISTRO</p>
                <p>Via Pellicciai, 12 - 37121 Verona</p>
                <p>📞 045 8030500</p>
                <div class="social-links">
                    <a href="https://www.instagram.com/skalettebistro/">Instagram</a> |
                    <a href="https://www.facebook.com/skalettebistro/">Facebook</a>
                </div>
            </div>
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
    console.log('📧 Sending confirmation email to:', reservation.email);
    console.log('📧 HTML length:', html ? html.length : 'null');
    return await sendEmail(reservation.email, subject, html, 'confirmation');
}

export async function sendConfirmedEmail(reservation, lang = 'it') {
    const subject = lang === 'it'
        ? `✅ Prenotazione Confermata - Skalette Bistro`
        : `✅ Reservation Confirmed - Skalette Bistro`;
    
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
        ? `❌ Skalette Bistro - Prenotazione Cancellata`
        : `❌ Skalette Bistro - Reservation Cancelled`;
    
    const logoUrl = 'https://skalette-bistro.web.app/images/logo.png';
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .wrapper { background-color: #f5f5f5; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0a1628 0%, #1a2d4a 100%); padding: 50px 30px; text-align: center; }
        .logo { width: 80px; height: auto; }
        .header h1 { color: #c9a961; font-size: 22px; margin: 0; font-weight: 600; letter-spacing: 2px; }
        .status-badge { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; border-radius: 30px; font-size: 14px; font-weight: 600; letter-spacing: 1px; margin-top: 25px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #0a1628; margin-bottom: 20px; }
        .reason-box { background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 20px; margin: 25px 0; border-radius: 12px; border-left: 4px solid #ef4444; }
        .reason-box p { margin: 0; color: #991b1b; }
        .divider { height: 1px; background: linear-gradient(to right, transparent, #e0d5c7, transparent); margin: 30px 0; }
        .cta { text-align: center; margin: 30px 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #c9a961 0%, #a8893e 100%); color: #0a1628; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .footer { background: #0a1628; padding: 30px; text-align: center; }
        .footer p { color: #888; font-size: 12px; margin: 5px 0; }
        .footer .brand { color: #c9a961; font-weight: 600; font-size: 14px; }
        .social-links { margin-top: 15px; }
        .social-links a { display: inline-block; margin: 0 8px; color: #c9a961; text-decoration: none; font-size: 13px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <img src="${logoUrl}" alt="Skalette Bistro" class="logo">
                <h1>${isItalian ? 'PRENOTAZIONE' : 'RESERVATION'}</h1>
                <div class="status-badge">❌ ${isItalian ? 'CANCELLATA' : 'CANCELLED'}</div>
            </div>
            <div class="content">
                <p class="greeting">${isItalian ? `Gentile ${reservation.name},` : `Dear ${reservation.name},`}</p>
                <p>${isItalian ? 'Ci dispiace comunicarti che la tua prenotazione è stata cancellata.' : 'We regret to inform you that your reservation has been cancelled.'}</p>
                
                ${reason ? `
                <div class="reason-box">
                    <p><strong>${isItalian ? '📝 Motivo:' : '📝 Reason:'}</strong> ${reason}</p>
                </div>
                ` : ''}
                
                <div class="divider"></div>
                
                <p style="text-align: center;">${isItalian ? 'Speriamo di vederti presto!' : 'We hope to see you soon!'}</p>
                
                <div class="cta">
                    <a href="https://skalette-bistro.web.app/#prenota" class="button">${isItalian ? '📅 Prenota di Nuovo' : '📅 Book Again'}</a>
                </div>
            </div>
            <div class="footer">
                <p class="brand">SKALETTE BISTRO</p>
                <p>Via Pellicciai, 12 - 37121 Verona</p>
                <p>📞 045 8030500</p>
                <div class="social-links">
                    <a href="https://www.instagram.com/skalettebistro/">Instagram</a> |
                    <a href="https://www.facebook.com/skalettebistro/">Facebook</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
    
    return await sendEmail(reservation.email, subject, html, 'cancellation');
}
