# 📅 Configurazione Google Calendar per Skalette Bistro

Questa guida ti aiuterà a configurare l'integrazione con Google Calendar in modo che le prenotazioni appaiano automaticamente sul calendario dell'iPad.

## 🎯 Cosa otterrai

- ✅ Ogni nuova prenotazione crea un evento **arancione** "🔔 DA CONFERMARE"
- ✅ Quando confermi, l'evento diventa **verde** "✅ CONFERMATO"
- ✅ Gli eventi mostrano: nome, telefono, email, persone, tavolo, tipo (aperitivo/pranzo/cena), note
- ✅ Si sincronizza automaticamente con l'iPad

---

## 📋 Passaggi

### 1. Crea un Progetto Google Cloud (gratuito)

1. Vai su https://console.cloud.google.com/
2. Clicca su "Seleziona progetto" in alto → "Nuovo Progetto"
3. Nome: `Skalette Bistro Calendar`
4. Clicca "Crea"

### 2. Abilita Google Calendar API

1. Nel menu a sinistra, vai su "API e servizi" → "Libreria"
2. Cerca "Google Calendar API"
3. Clicca sul risultato e poi "Abilita"

### 3. Crea Credenziali OAuth 2.0

1. Vai su "API e servizi" → "Credenziali"
2. Clicca "Crea credenziali" → "ID client OAuth"
3. Se richiesto, configura prima la "Schermata consenso OAuth":
   - Tipo utente: "Esterno"
   - Nome app: "Skalette Bistro"
   - Email supporto: la tua email
   - Salva e continua (puoi saltare gli scope per ora)
   - Aggiungi te stesso come utente test
4. Torna a "Credenziali" → "Crea credenziali" → "ID client OAuth"
5. Tipo applicazione: "Applicazione web"
6. Nome: "Skalette Bistro Web"
7. **Origini JavaScript autorizzate**: aggiungi:
   - `http://localhost` (per test)
   - `https://skalette-bistro.web.app` (il tuo dominio)
   - `https://skalette-bistro.firebaseapp.com`
8. Clicca "Crea"
9. **Copia il "Client ID"** che ti viene mostrato

### 4. Ottieni l'ID del Calendario

1. Vai su https://calendar.google.com/
2. A sinistra, passa il mouse sul calendario che vuoi usare
3. Clicca sui 3 puntini → "Impostazioni e condivisione"
4. Scorri fino a "Integra calendario"
5. **Copia l'"ID calendario"** (sembra tipo `abc123@group.calendar.google.com` o la tua email)

### 5. Configura il file google-calendar.js

Apri il file `google-calendar.js` e modifica queste righe:

```javascript
const GOOGLE_CALENDAR_CONFIG = {
    // Incolla qui l'ID del calendario
    calendarId: 'TUA_EMAIL@gmail.com',  // o l'ID del calendario
    
    // L'API Key non serve per OAuth, lasciala vuota
    apiKey: '',
    
    // Incolla qui il Client ID che hai copiato
    clientId: 'XXXXXXXXX.apps.googleusercontent.com',
    
    // Colori (non toccare)
    colors: {
        pending: '6',      // Arancione
        confirmed: '10',   // Verde
        rejected: '11'     // Rosso
    }
};
```

### 6. Testa l'integrazione

1. Vai sul pannello admin del sito
2. Clicca sul pulsante "📅 Connetti Calendario"
3. Si aprirà la finestra di login Google
4. Autorizza l'accesso
5. Il pulsante diventerà verde "✅ Calendario Connesso"

---

## 📱 Sincronizzazione con iPad

Il calendario Google si sincronizza automaticamente con:
- **App Calendario Apple**: Aggiungi l'account Google in Impostazioni → Calendario → Account → Aggiungi account → Google
- **App Google Calendar**: Scarica dall'App Store

---

## 🎨 Colori Eventi

| Stato | Colore | Emoji |
|-------|--------|-------|
| Da Confermare | 🟠 Arancione | 🔔 |
| Confermato | 🟢 Verde | ✅ |
| Rifiutato | 🔴 Rosso | ❌ |

---

## 📝 Formato Eventi

**Titolo:**
```
🔔 DA CONFERMARE - Mario Rossi
```

**Descrizione:**
```
👤 Cliente: Mario Rossi
📱 Telefono: +39 333 1234567
📧 Email: mario@example.com

👥 Persone: 4
🪑 Tavolo: S3
🍹 Tipo: Aperitivo

📝 NOTE:
Compleanno, serve torta

---
ID Prenotazione: abc123
Creata il: 05/01/2026, 14:30:00
```

---

## ❓ Problemi Comuni

### "Non riesco ad autorizzare"
- Assicurati di aver aggiunto te stesso come "utente test" nella schermata consenso OAuth
- Verifica che le origini JavaScript siano corrette

### "Errore 403"
- L'API Google Calendar potrebbe non essere abilitata
- Il calendario potrebbe non essere condiviso correttamente

### "Eventi non appaiono"
- Controlla che il calendarId sia corretto
- Verifica che il pulsante mostri "✅ Calendario Connesso"

---

## 🔒 Sicurezza

- Le credenziali OAuth sono sicure e non espongono dati sensibili
- Solo tu puoi autorizzare l'accesso al calendario
- Il token viene salvato nel browser e scade automaticamente
