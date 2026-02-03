/**
 * Test automatico Skalette Bistro - Prenotazione Completa
 * Esegui con: node test-mobile.js
 */

const { chromium, devices } = require('playwright');
const fs = require('fs');

const SITE_URL = 'https://skalette-bistro.web.app';

// Crea cartella screenshots
if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
}

async function testPrenotazione() {
    console.log('🚀 Test PRENOTAZIONE Skalette Bistro...\n');
    
    const iPhone = devices['iPhone 14'];
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 300
    });
    
    const context = await browser.newContext({
        ...iPhone,
        locale: 'it-IT'
    });
    
    const page = await context.newPage();
    page.setDefaultTimeout(30000);
    
    try {
        // 1. Apri sito
        console.log('📱 Apertura sito...');
        await page.goto(SITE_URL, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);
        
        // 2. Chiudi cookie
        console.log('🍪 Cookie banner...');
        try {
            await page.click('.cookie-btn.accept', { timeout: 3000 });
        } catch {
            await page.evaluate(() => {
                const b = document.getElementById('cookie-banner');
                if (b) b.style.display = 'none';
            });
        }
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'screenshots/prenotazione-01-home.png' });
        
        // 3. Vai alla sezione prenotazione
        console.log('📅 Vai alla sezione prenotazione...');
        await page.evaluate(() => {
            const section = document.getElementById('reservation');
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'screenshots/prenotazione-02-sezione.png' });
        
        // 4. STEP 1: Seleziona numero ospiti
        console.log('\n👥 STEP 1: Seleziona ospiti...');
        await page.selectOption('#booking-guests', '2');
        await page.waitForTimeout(300);
        console.log('   ✓ 2 ospiti selezionati');
        
        // 5. Seleziona data (domani)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        await page.fill('#booking-date', dateStr);
        await page.waitForTimeout(300);
        console.log('   ✓ Data:', dateStr);
        
        // 6. Seleziona tipo (cena)
        await page.selectOption('#booking-meal', 'cena');
        await page.waitForTimeout(500);
        console.log('   ✓ Tipo: Cena');
        
        // 7. Seleziona orario
        await page.waitForTimeout(500);
        await page.selectOption('#booking-time', { index: 1 }); // Primo orario disponibile
        await page.waitForTimeout(300);
        console.log('   ✓ Orario selezionato');
        
        await page.screenshot({ path: 'screenshots/prenotazione-03-step1.png' });
        
        // 8. Clicca "Vedi Tavoli Disponibili"
        console.log('\n🪑 STEP 2: Selezione tavolo...');
        
        // Cattura errori console
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('   🔴 Console Error:', msg.text());
            }
        });
        
        page.on('pageerror', err => {
            console.log('   🔴 Page Error:', err.message);
        });
        
        await page.click('#btn-view-tables', { force: true });
        await page.waitForTimeout(3000); // Attendi caricamento tavoli
        await page.screenshot({ path: 'screenshots/prenotazione-04-tavoli.png' });
        
        // Verifica quanti tavoli ci sono nel DOM
        const tableCount = await page.evaluate(() => {
            const tables = document.querySelectorAll('.floor-table');
            console.log('Floor tables trovati:', tables.length);
            return tables.length;
        });
        console.log('   Tavoli nel floor plan:', tableCount);
        
        // 9. Seleziona un tavolo disponibile
        console.log('   Cerco tavolo disponibile...');
        // Prova diversi selettori
        let tableClicked = false;
        const tableSelectors = [
            '.floor-table:not(.occupied)',
            '.floor-table.available',
            '.floor-table',
        ];
        
        for (const selector of tableSelectors) {
            try {
                await page.click(selector, { force: true, timeout: 2000 });
                tableClicked = true;
                console.log('   ✓ Tavolo selezionato con:', selector);
                break;
            } catch {
                continue;
            }
        }
        
        if (!tableClicked) {
            // Click diretto via JavaScript
            console.log('   Tentativo click via JavaScript...');
            const clicked = await page.evaluate(() => {
                const tables = document.querySelectorAll('.floor-table');
                console.log('Tavoli .floor-table trovati:', tables.length);
                for (const t of tables) {
                    console.log('Tavolo:', t.dataset.tableId, 'classList:', t.className);
                    if (!t.classList.contains('occupied') && !t.classList.contains('unavailable')) {
                        t.click();
                        return { success: true, id: t.dataset.tableId };
                    }
                }
                // Se non trova disponibili, clicca il primo
                if (tables.length > 0) {
                    tables[0].click();
                    return { success: true, id: tables[0].dataset.tableId, forced: true };
                }
                return { success: false };
            });
            if (clicked.success) {
                console.log('   ✓ Tavolo selezionato via JS:', clicked.id, clicked.forced ? '(forzato)' : '');
                tableClicked = true;
            } else {
                console.log('   ⚠️ Nessun tavolo trovato nel DOM');
            }
        }
        
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'screenshots/prenotazione-05-tavolo-scelto.png' });
        
        // 10. Verifica se possiamo continuare
        const canContinue = await page.$eval('#btn-continue-step3', btn => !btn.disabled).catch(() => false);
        
        if (!canContinue) {
            console.log('\n⚠️ NOTA: Il pulsante "Continua" è disabilitato.');
            console.log('   Probabilmente nessun tavolo è disponibile per questa data/ora.');
            console.log('   O il sistema di prenotazione richiede connessione Firebase attiva.');
            console.log('\n📸 Screenshot salvati - test parziale completato.');
            console.log('   Prova manualmente sul sito per verificare.');
            await page.waitForTimeout(60000);
            await browser.close();
            return;
        }
        
        // 10. Continua a Step 3
        await page.click('#btn-continue-step3', { force: true });
        await page.waitForTimeout(1000);
        console.log('\n📝 STEP 3: Dati personali...');
        await page.screenshot({ path: 'screenshots/prenotazione-06-step3.png' });
        
        // 11. Compila dati personali
        await page.fill('#booking-name', 'Test Automatico Playwright');
        await page.waitForTimeout(200);
        console.log('   ✓ Nome inserito');
        
        await page.fill('#booking-phone', '3339999888');
        await page.waitForTimeout(200);
        console.log('   ✓ Telefono inserito');
        
        await page.fill('#booking-email', 'test.playwright@example.com');
        await page.waitForTimeout(200);
        console.log('   ✓ Email inserita');
        
        await page.fill('#booking-notes', 'Prenotazione di test automatico - DA CANCELLARE');
        await page.waitForTimeout(200);
        console.log('   ✓ Note inserite');
        
        await page.screenshot({ path: 'screenshots/prenotazione-07-dati.png' });
        
        // 12. Scroll per vedere il riepilogo
        await page.evaluate(() => {
            const summary = document.querySelector('.booking-summary');
            if (summary) summary.scrollIntoView({ behavior: 'smooth' });
        });
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'screenshots/prenotazione-08-riepilogo.png' });
        
        console.log('\n' + '='.repeat(50));
        console.log('⚠️  FORM COMPILATO - NON INVIO LA PRENOTAZIONE');
        console.log('='.repeat(50));
        console.log('\n📸 Screenshots salvati in "screenshots/"');
        console.log('\n🔍 Il browser rimane aperto per verifica manuale.');
        console.log('   Puoi inviare la prenotazione manualmente o chiudere.');
        console.log('   Premi CTRL+C per terminare.\n');
        
        await page.waitForTimeout(180000); // 3 minuti
        
    } catch (error) {
        console.error('\n❌ Errore:', error.message);
        await page.screenshot({ path: 'screenshots/prenotazione-error.png' });
    } finally {
        await browser.close();
    }
}

testPrenotazione();
