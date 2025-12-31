// ===================================
// SKALETTE BISTRO - TRANSLATION SYSTEM
// ===================================

const translations = {
    it: {
        // Navigation
        'nav.about': 'Chi Siamo',
        'nav.gallery': 'Galleria',
        'nav.contact': 'Contatti',
        'nav.reserve': 'Prenota',
        
        // Hero
        'hero.subtitle': "Dove l'eleganza incontra il gusto autentico",
        'hero.btnMenu': 'Scopri il Menu',
        'hero.btnReserve': 'Prenota un Tavolo',
        'hero.scroll': 'Scorri',
        
        // About
        'about.label': 'La Nostra Storia',
        'about.title': 'Dove Nasce la <span class="gold">Movida</span> Veronese',
        'about.text1': "Skalette Bistro nasce nel 2022 dall'esperienza di Pietro, titolare con anni di successi in uno dei locali più iconici della nightlife veronese. Un progetto nato dalla passione per l'ospitalità e dalla voglia di creare un punto di riferimento per la città.",
        'about.text2': "Dalla colazione al brunch, dal pranzo all'aperitivo, fino alla cena e alla movida serale: Skalette è il locale che non dorme mai, amato dai veronesi e scoperto dai visitatori in cerca dell'autentica atmosfera italiana.",
        'about.btn': 'Esplora il Menu',
        
        // Features
        'features.quality.title': 'Qualità Premium',
        'features.quality.text': 'Solo i migliori ingredienti per i nostri piatti',
        'features.service.title': 'Servizio Impeccabile',
        'features.service.text': 'Attenzione ad ogni dettaglio',
        'features.passion.title': 'Passione Autentica',
        'features.passion.text': 'Amore per la cucina italiana',
        'features.events.title': 'Eventi Privati',
        'features.events.text': 'Sale riservate per occasioni speciali',
        
        // Menu Section
        'menu.label': 'Il Nostro Menu',
        'menu.title': 'Capolavori <span class="gold">Culinari</span>',
        'menu.subtitle': 'Prodotti freschi del giorno. Chiedere al personale per la disponibilità e per gli allergeni.',
        'menu.tabs.coffee': 'Caffetteria',
        'menu.tabs.deli': 'Gastronomia',
        'menu.tabs.dishes': 'I Nostri Piatti',
        'menu.tabs.drinks': 'Bevande',
        'menu.tabs.aperitifs': 'Aperitivi & Birre',
        'menu.tabs.wines': 'Vini',
        'menu.download': 'Scarica Menu Completo',
        'menu.desserts': 'Dolci',
        'menu.whites': 'Bianchi',
        'menu.reds': 'Rossi',
        'menu.sparkling': 'Bollicine',
        
        // Menu Tags
        'tag.vegetarian': 'Vegetariano',
        'tag.gluten': 'Glutine',
        'tag.dairy': 'Latticini',
        'tag.eggs': 'Uova',
        'tag.fish': 'Pesce',
        'tag.shellfish': 'Crostacei',
        'tag.mollusks': 'Molluschi',
        'tag.mustard': 'Senape',
        'tag.celery': 'Sedano',
        'tag.nuts': 'Frutta a guscio',
        'tag.peanuts': 'Arachidi',
        'tag.sesame': 'Sesamo',
        'tag.sulfites': 'Solfiti',
        
        // Guest options
        'guests.1': '1 Persona',
        'guests.2': '2 Persone',
        'guests.3': '3 Persone',
        'guests.4': '4 Persone',
        'guests.5': '5 Persone',
        'guests.6': '6 Persone',
        'guests.7': '7 Persone',
        'guests.8': '8 Persone',
        
        // Gallery
        'gallery.label': 'Galleria',
        'gallery.title': 'Momenti <span class="gold">Indimenticabili</span>',
        'gallery.subtitle': 'Un assaggio visivo della nostra esperienza culinaria',
        'gallery.all': 'Tutti',
        'gallery.ambiente': 'Ambiente',
        'gallery.dishes': 'Piatti',
        'gallery.drinks': 'Drinks',
        'gallery.ourPlace': 'Il Nostro Ambiente',
        'gallery.freshOysters': 'Ostriche Fresche',
        'gallery.specialMoments': 'Momenti Speciali',
        'gallery.ourDishes': 'I Nostri Piatti',
        'gallery.cocktailBar': 'Cocktail Bar',
        'gallery.artOnPlate': 'Arte nel Piatto',
        
        // Testimonials
        'testimonials.label': 'Recensioni',
        'testimonials.title': 'Cosa Dicono i <span class="gold">Nostri Ospiti</span>',
        'testimonials.googleReview': 'Recensione Google',
        
        // Google Reviews Section
        'reviews.title': 'Cosa Dicono i Nostri Ospiti',
        'reviews.subtitle': 'Le recensioni dei clienti su Google',
        'reviews.based': 'su 171 recensioni',
        'reviews.write': 'Lascia una Recensione',
        
        // Reservation
        'reservation.label': 'Prenotazioni',
        'reservation.title': 'Prenota il Tuo <span class="gold">Tavolo</span>',
        'reservation.subtitle': 'Seleziona le tue preferenze e scegli il tavolo che preferisci',
        'reservation.step1': '1. Scegli Data e Orario',
        'reservation.durationInfo': '⏱️ <strong>Pranzo/Cena:</strong> tavolo garantito per 2 ore | <strong>Aperitivo/Dopocena:</strong> 1,5 ore<br><small>Se non ci sono prenotazioni successive, la permanenza può essere prolungata.</small>',
        'reservation.guests': 'Numero Ospiti',
        'reservation.date': 'Data',
        'reservation.type': 'Tipo',
        'reservation.time': 'Orario',
        'reservation.selectGuests': '-- Seleziona --',
        'reservation.selectType': '-- Seleziona --',
        'reservation.selectTime': '-- Prima scegli il tipo --',
        'reservation.lunch': '☀️ Pranzo',
        'reservation.aperitif': '🍹 Aperitivo',
        'reservation.dinner': '🍽️ Cena',
        'reservation.afterdinner': '🌙 Dopocena',
        'reservation.loading': 'Caricamento...',
        'reservation.viewTables': 'Vedi Tavoli Disponibili',
        'reservation.step2': '2. Scegli il Tuo Tavolo',
        'reservation.step2subtitle': 'Clicca su un tavolo disponibile (dorato) per selezionarlo',
        'reservation.selectedTable': 'Tavolo selezionato:',
        'reservation.back': '← Indietro',
        'reservation.continue': 'Continua →',
        'reservation.step3': '3. I Tuoi Dati',
        'reservation.name': 'Nome Completo',
        'reservation.phone': 'Telefono',
        'reservation.phonePlaceholder': 'es. 3401234567',
        'reservation.email': 'Email',
        'reservation.notes': 'Note (opzionale)',
        'reservation.notesPlaceholder': 'Allergie, occasioni speciali, richieste particolari...',
        'reservation.summary': 'Riepilogo Prenotazione',
        'reservation.confirm': 'Conferma Prenotazione',
        'reservation.success': 'Prenotazione Inviata!',
        'reservation.successMsg': 'Riceverai conferma su WhatsApp al numero indicato.',
        'reservation.newReservation': 'Nuova Prenotazione',
        'reservation.person': 'Persona',
        'reservation.people': 'Persone',
        
        // Contact
        'contact.title': 'Vieni a Trovarci',
        'contact.text': 'Siamo nel cuore di Verona, a due passi da Piazza delle Erbe. Facilmente raggiungibile a piedi dal centro storico.',
        
        // Footer
        'footer.tagline': "Un'esperienza culinaria dove l'eleganza incontra la tradizione italiana.",
        'footer.quickLinks': 'Link Rapidi',
        'footer.contacts': 'Contatti',
        'footer.newsletter': 'Newsletter',
        'footer.newsletterText': 'Iscriviti per ricevere novità ed eventi speciali',
        'footer.emailPlaceholder': 'La tua email',
        'footer.rights': '© 2025 Skalette Bistro. Tutti i diritti riservati.',
        'footer.privacy': 'Privacy Policy',
        'footer.terms': 'Termini e Condizioni',
        
        // Mobile Nav
        'mobile.home': 'Home',
        'mobile.menu': 'Menu',
        'mobile.reserve': 'Prenota',
        'mobile.gallery': 'Galleria',
        'mobile.contact': 'Contatti',
        
        // Back to top
        'backToTop': 'Torna su',
        
        // Swipe indicator
        'swipeIndicator': '← Scorri →',
        
        // Cookie Banner
        'cookie.message': 'Questo sito utilizza cookie tecnici per migliorare la tua esperienza. Continuando a navigare, accetti la nostra <a href="privacy.html">Privacy Policy</a>.',
        'cookie.accept': 'Accetto',
        'cookie.reject': 'Rifiuto',
        
        // Private Events
        'events.label': 'Eventi Privati',
        'events.title': 'Organizza il Tuo <span class="gold">Evento Speciale</span>',
        'events.description': 'Che sia un compleanno, un anniversario, una cena aziendale o qualsiasi altra occasione speciale, Skalette Bistro è il luogo perfetto per i tuoi momenti indimenticabili.',
        'events.description2': 'Il nostro team è a disposizione per creare un menu personalizzato e un\'atmosfera su misura per le tue esigenze.',
        'events.feature1': 'Fino a 30 ospiti',
        'events.feature2': 'Menu personalizzato',
        'events.feature3': 'Consulenza dedicata',
        'events.feature4': 'Flessibilità orari',
        'events.formTitle': 'Richiedi Informazioni',
        'events.name': 'Nome *',
        'events.phone': 'Telefono *',
        'events.email': 'Email *',
        'events.type': 'Tipo Evento',
        'events.typeBirthday': 'Compleanno',
        'events.typeAnniversary': 'Anniversario',
        'events.typeCorporate': 'Evento Aziendale',
        'events.typeGraduation': 'Laurea',
        'events.typeOther': 'Altro',
        'events.guests': 'N° Ospiti',
        'events.preferredDate': 'Data Preferita',
        'events.notes': 'Note e Richieste',
        'events.submit': 'Invia Richiesta'
    },
    
    en: {
        // Navigation
        'nav.about': 'About Us',
        'nav.gallery': 'Gallery',
        'nav.contact': 'Contact',
        'nav.reserve': 'Book Now',
        
        // Hero
        'hero.subtitle': 'Where elegance meets authentic taste',
        'hero.btnMenu': 'Discover the Menu',
        'hero.btnReserve': 'Book a Table',
        'hero.scroll': 'Scroll',
        
        // About
        'about.label': 'Our Story',
        'about.title': 'Where Verona\'s <span class="gold">Nightlife</span> Begins',
        'about.text1': 'Skalette Bistro was born in 2022 from the experience of Pietro, owner with years of success in one of the most iconic venues of Verona\'s nightlife scene. A project born from passion for hospitality and the desire to create a landmark for the city.',
        'about.text2': "From breakfast to brunch, from lunch to aperitivo, through dinner and into the night: Skalette is the venue that never sleeps, loved by locals and discovered by visitors seeking the authentic Italian atmosphere.",
        'about.btn': 'Explore the Menu',
        
        // Features
        'features.quality.title': 'Premium Quality',
        'features.quality.text': 'Only the finest ingredients for our dishes',
        'features.service.title': 'Impeccable Service',
        'features.service.text': 'Attention to every detail',
        'features.passion.title': 'Authentic Passion',
        'features.passion.text': 'Love for Italian cuisine',
        'features.events.title': 'Private Events',
        'features.events.text': 'Reserved rooms for special occasions',
        
        // Menu Section
        'menu.label': 'Our Menu',
        'menu.title': 'Culinary <span class="gold">Masterpieces</span>',
        'menu.subtitle': 'Fresh daily products. Please ask staff for availability and allergens.',
        'menu.tabs.coffee': 'Coffee Shop',
        'menu.tabs.deli': 'Deli',
        'menu.tabs.dishes': 'Our Dishes',
        'menu.tabs.drinks': 'Beverages',
        'menu.tabs.aperitifs': 'Aperitifs & Beers',
        'menu.tabs.wines': 'Wines',
        'menu.download': 'Download Full Menu',
        'menu.desserts': 'Desserts',
        'menu.whites': 'White Wines',
        'menu.reds': 'Red Wines',
        'menu.sparkling': 'Sparkling',
        
        // Menu Tags
        'tag.vegetarian': 'Vegetarian',
        'tag.gluten': 'Gluten',
        'tag.dairy': 'Dairy',
        'tag.eggs': 'Eggs',
        'tag.fish': 'Fish',
        'tag.shellfish': 'Shellfish',
        'tag.mollusks': 'Mollusks',
        'tag.mustard': 'Mustard',
        'tag.celery': 'Celery',
        'tag.nuts': 'Tree Nuts',
        'tag.peanuts': 'Peanuts',
        'tag.sesame': 'Sesame',
        'tag.sulfites': 'Sulfites',
        
        // Guest options
        'guests.1': '1 Guest',
        'guests.2': '2 Guests',
        'guests.3': '3 Guests',
        'guests.4': '4 Guests',
        'guests.5': '5 Guests',
        'guests.6': '6 Guests',
        'guests.7': '7 Guests',
        'guests.8': '8 Guests',
        
        // Gallery
        'gallery.label': 'Gallery',
        'gallery.title': 'Unforgettable <span class="gold">Moments</span>',
        'gallery.subtitle': 'A visual taste of our culinary experience',
        'gallery.all': 'All',
        'gallery.ambiente': 'Ambiance',
        'gallery.dishes': 'Dishes',
        'gallery.drinks': 'Drinks',
        'gallery.ourPlace': 'Our Ambiance',
        'gallery.freshOysters': 'Fresh Oysters',
        'gallery.specialMoments': 'Special Moments',
        'gallery.ourDishes': 'Our Dishes',
        'gallery.cocktailBar': 'Cocktail Bar',
        'gallery.artOnPlate': 'Art on a Plate',
        
        // Testimonials
        'testimonials.label': 'Reviews',
        'testimonials.title': 'What Our <span class="gold">Guests Say</span>',
        'testimonials.googleReview': 'Google Review',
        
        // Google Reviews Section
        'reviews.title': 'What Our Guests Say',
        'reviews.subtitle': 'Customer reviews on Google',
        'reviews.based': 'based on 171 reviews',
        'reviews.write': 'Leave a Review',
        
        // Reservation
        'reservation.label': 'Reservations',
        'reservation.title': 'Book Your <span class="gold">Table</span>',
        'reservation.subtitle': 'Select your preferences and choose your preferred table',
        'reservation.step1': '1. Choose Date and Time',
        'reservation.durationInfo': '⏱️ <strong>Lunch/Dinner:</strong> table guaranteed for 2 hours | <strong>Aperitivo/After Dinner:</strong> 1.5 hours<br><small>If no subsequent bookings, your stay can be extended.</small>',
        'reservation.guests': 'Number of Guests',
        'reservation.date': 'Date',
        'reservation.type': 'Type',
        'reservation.time': 'Time',
        'reservation.selectGuests': '-- Select --',
        'reservation.selectType': '-- Select --',
        'reservation.selectTime': '-- First select type --',
        'reservation.lunch': '☀️ Lunch',
        'reservation.aperitif': '🍹 Aperitif',
        'reservation.dinner': '🍽️ Dinner',
        'reservation.afterdinner': '🌙 After Dinner',
        'reservation.loading': 'Loading...',
        'reservation.viewTables': 'View Available Tables',
        'reservation.step2': '2. Choose Your Table',
        'reservation.step2subtitle': 'Click on an available table (gold) to select it',
        'reservation.selectedTable': 'Selected table:',
        'reservation.back': '← Back',
        'reservation.continue': 'Continue →',
        'reservation.step3': '3. Your Details',
        'reservation.name': 'Full Name',
        'reservation.phone': 'Phone',
        'reservation.phonePlaceholder': 'e.g. +39 340 123 4567',
        'reservation.email': 'Email',
        'reservation.notes': 'Notes (optional)',
        'reservation.notesPlaceholder': 'Allergies, special occasions, special requests...',
        'reservation.summary': 'Reservation Summary',
        'reservation.confirm': 'Confirm Reservation',
        'reservation.success': 'Reservation Sent!',
        'reservation.successMsg': 'You will receive confirmation via WhatsApp.',
        'reservation.newReservation': 'New Reservation',
        'reservation.person': 'Person',
        'reservation.people': 'People',
        
        // Contact
        'contact.title': 'Visit Us',
        'contact.text': "We're in the heart of Verona, just steps from Piazza delle Erbe. Easily accessible on foot from the historic center.",
        
        // Footer
        'footer.tagline': 'A culinary experience where elegance meets Italian tradition.',
        'footer.quickLinks': 'Quick Links',
        'footer.contacts': 'Contact',
        'footer.newsletter': 'Newsletter',
        'footer.newsletterText': 'Subscribe to receive news and special events',
        'footer.emailPlaceholder': 'Your email',
        'footer.rights': '© 2025 Skalette Bistro. All rights reserved.',
        'footer.privacy': 'Privacy Policy',
        'footer.terms': 'Terms & Conditions',
        
        // Mobile Nav
        'mobile.home': 'Home',
        'mobile.menu': 'Menu',
        'mobile.reserve': 'Book',
        'mobile.gallery': 'Gallery',
        'mobile.contact': 'Contact',
        
        // Back to top
        'backToTop': 'Back to top',
        
        // Swipe indicator
        'swipeIndicator': '← Swipe →',
        
        // Cookie Banner
        'cookie.message': 'This site uses technical cookies to improve your experience. By continuing to browse, you accept our <a href="privacy.html">Privacy Policy</a>.',
        'cookie.accept': 'Accept',
        'cookie.reject': 'Reject',
        
        // Private Events
        'events.label': 'Private Events',
        'events.title': 'Organize Your <span class="gold">Special Event</span>',
        'events.description': 'Whether it\'s a birthday, anniversary, corporate dinner or any other special occasion, Skalette Bistro is the perfect place for your unforgettable moments.',
        'events.description2': 'Our team is available to create a personalized menu and atmosphere tailored to your needs.',
        'events.feature1': 'Up to 30 guests',
        'events.feature2': 'Custom menu',
        'events.feature3': 'Dedicated consulting',
        'events.feature4': 'Flexible hours',
        'events.formTitle': 'Request Information',
        'events.name': 'Name *',
        'events.phone': 'Phone *',
        'events.email': 'Email *',
        'events.type': 'Event Type',
        'events.typeBirthday': 'Birthday',
        'events.typeAnniversary': 'Anniversary',
        'events.typeCorporate': 'Corporate Event',
        'events.typeGraduation': 'Graduation',
        'events.typeOther': 'Other',
        'events.guests': 'N° Guests',
        'events.preferredDate': 'Preferred Date',
        'events.notes': 'Notes and Requests',
        'events.submit': 'Send Request'
    }
};

// Menu item descriptions translations (Italian to English)
const menuDescriptions = {
    // Caffetteria
    "L'autentico caffè italiano.": "The authentic Italian coffee.",
    "Simile al cappuccino ma con meno latte.": "Similar to cappuccino but with less milk.",
    "Caffè e latte montato con schiuma cremosa.": "Coffee and steamed milk with creamy foam.",
    "Caffè lungo con aggiunta di acqua calda.": "Long coffee with added hot water.",
    "Latte caldo macchiato con un tocco di caffè.": "Hot milk with a touch of coffee.",
    "Espresso con l'aggiunta di un liquore a scelta.": "Espresso with your choice of liqueur.",
    "Doppio espresso in tazza grande.": "Double espresso in a large cup.",
    "Bevanda calda alternativa al caffè.": "Hot alternative to coffee.",
    "Doppio espresso versato su ghiaccio.": "Double espresso poured over ice.",
    "Selezione di erbe e frutta.": "Selection of herbs and fruits.",
    "Sfoglia fresca, semplice o farcito.": "Fresh pastry, plain or filled.",
    "Biscotto singolo.": "Single cookie.",
    
    // Gastronomia
    "Polpetta di carne mista.": "Mixed meat meatball.",
    "Polpetta a base di verdure e ricotta.": "Vegetable and ricotta meatball.",
    "Ripieno di riso e tastasal (impasto di salsiccia).": "Rice and sausage filling.",
    "Impasto fresco, pomodoro, mozzarella e basilico.": "Fresh dough, tomato, mozzarella and basil.",
    "Impasto fresco con ripieno del giorno (chiedere al personale).": "Fresh dough with daily filling (ask staff).",
    "Con prosciutto e formaggio.": "With ham and cheese.",
    "Chiedere al personale per i gusti disponibili.": "Ask staff for available flavors.",
    "Piccola porzione ideale per un assaggio veloce.": "Small portion ideal for a quick taste.",
    "Croccanti nachos serviti con guacamole fresco, cheddar fuso e panna acida.": "Crispy nachos served with fresh guacamole, melted cheddar and sour cream.",
    
    // I Nostri Piatti
    "Con giardiniera della casa e mostarda.": "With house pickled vegetables and mustard.",
    "Con pan y tomate.": "With bread and tomato.",
    "Con crostini e pecorino. Con bacon croccante (+3€) o gamberi (+3€).": "With croutons and pecorino. Add crispy bacon (+3€) or shrimp (+3€).",
    "Tagliata al coltello, con senape, scalogno, capperi e tuorlo d'uovo. Con tartufo nero (+5€).": "Hand-cut beef tartare with mustard, shallot, capers and egg yolk. Add black truffle (+5€).",
    "Con bacon croccante, avocado, salsa yogurt e ravanelli.": "With crispy bacon, avocado, yogurt sauce and radishes.",
    "Con pane tostato e burro.": "With toasted bread and butter.",
    "Su fonduta di formaggio, con lamelle di tartufo nero della Lessinia.": "On cheese fondue, with Lessinia black truffle shavings.",
    "Pasta fresca con ragù di quaglia, il suo uovo e lamelle di tartufo nero.": "Fresh pasta with quail ragù, its egg and black truffle shavings.",
    "Spaghetti di riso saltati con verdure croccanti, pollo, gamberi e salsa tamarindo.": "Stir-fried rice noodles with crispy vegetables, chicken, shrimp and tamarind sauce.",
    "Ravioli giapponesi croccanti ripieni di maiale, con salsa teriyaki e semi di sesamo.": "Crispy Japanese dumplings filled with pork, with teriyaki sauce and sesame seeds.",
    "Gnocchi di patate con crema di zucca, gorgonzola e speck croccante.": "Potato gnocchi with pumpkin cream, gorgonzola and crispy speck.",
    "Ravioli ripieni di cacio e pepe, serviti con guanciale croccante.": "Ravioli filled with cacio e pepe, served with crispy guanciale.",
    "Controfiletto di manzo scottato, con porcini e scaglie di Monte Veronese. Con tartufo nero (+5€).": "Seared beef sirloin with porcini mushrooms and Monte Veronese shavings. Add black truffle (+5€).",
    "Spiedini di pollo glassati alla teriyaki, con riso basmati, edamame e semi di sesamo.": "Teriyaki glazed chicken skewers with basmati rice, edamame and sesame seeds.",
    "Brasata all'Amarone, con purè di patate.": "Braised in Amarone wine, with mashed potatoes.",
    "Con crema di polenta.": "With creamy polenta.",
    "Salmone scottato con salsa al tamarindo e pak choi saltato.": "Seared salmon with tamarind sauce and sautéed pak choi.",
    "Farcito con manzo e maiale, fagioli neri, Monterrey Jack, guacamole, panna acida e riso basmati.": "Filled with beef and pork, black beans, Monterey Jack, guacamole, sour cream and basmati rice.",
    "Hamburger di manzo, cheddar, pomodoro, insalata, bacon croccante e salsa BBQ. Con patate spadellate.": "Beef burger, cheddar, tomato, lettuce, crispy bacon and BBQ sauce. With pan-fried potatoes.",
    "Pollo, bacon croccante, uovo, pomodoro, insalata e maionese.": "Chicken, crispy bacon, egg, tomato, lettuce and mayonnaise.",
    "Pane tostato, crema alla robiola, avocado, uovo in camicia. Con bacon (+3€) o salmone (+3€).": "Toasted bread, robiola cream, avocado, poached egg. Add bacon (+3€) or salmon (+3€).",
    "Pane bun nero, burger vegetale, maionese al tartufo, brie, spinacino, cipolla caramellata e patate.": "Black bun, veggie patty, truffle mayo, brie, baby spinach, caramelized onion and potatoes.",
    
    // Dolci
    "Ricetta tradizionale con mascarpone e caffè.": "Traditional recipe with mascarpone and coffee.",
    "Gusto a scelta: cioccolato o caramello.": "Your choice: chocolate or caramel.",
    "Classico dessert spagnolo con crosta caramellata.": "Classic Spanish dessert with caramelized crust.",
    "Torta secca mantovana con farina di mais e mandorle, servita con un bicchierino di grappa veneta.": "Crumbly Mantuan cake with cornmeal and almonds, served with a shot of Veneto grappa.",
    
    // Bevande
    "Naturale o Frizzante.": "Still or Sparkling.",
    "Analcolico a base di agrumi.": "Non-alcoholic citrus drink.",
    "Sprite, Fanta, Coca-Cola, Coca-Cola Zero.": "Sprite, Fanta, Coca-Cola, Coca-Cola Zero.",
    "Succo di frutta alla pera, albicocca o pesca.": "Fruit juice: pear, apricot or peach.",
    "Limone, arancia o arancia rossa.": "Lemon, orange or blood orange.",
    "Aranciata, limonata o chinotto.": "Orange, lemon or chinotto soda.",
    "Aranciata amara, pompelmo, cedrata, limonata.": "Bitter orange, grapefruit, citron or lemonade.",
    "Tè Fuze vari gusti.": "Fuze Tea various flavors.",
    "Tè caldo e infusi vari.": "Hot tea and various infusions.",
    "Cioccolata classica o alla nocciola.": "Classic or hazelnut hot chocolate.",
    "Senza zuccheri aggiunti.": "No added sugars.",
    "Bevanda frizzante e rinfrescante.": "Sparkling and refreshing drink.",
    "Gusti assortiti disponibili.": "Assorted flavors available.",
    "Bevanda frizzante al gusto di zenzero.": "Ginger flavored sparkling drink.",
    "Tè freddo in bottiglia.": "Bottled iced tea.",
    "Bevanda analcolica allo zenzero di nostra produzione.": "Homemade non-alcoholic ginger drink.",
    "Succo di pomodoro con sale, pepe e spezie.": "Tomato juice with salt, pepper and spices.",
    "Gassosa al gusto di pompelmo rosa.": "Pink grapefruit soda.",
    
    // Aperitivi
    "Aperol e prosecco con soda.": "Aperol and prosecco with soda.",
    "Campari e prosecco con soda.": "Campari and prosecco with soda.",
    "Prosecco con succo di pesca.": "Prosecco with peach juice.",
    "Prosecco con fragole fresche.": "Prosecco with fresh strawberries.",
    "Mirtillo, lime e prosecco.": "Blueberry, lime and prosecco.",
    "Crodino e prosecco.": "Crodino and prosecco.",
    "Vermut bianco o rosso con seltz.": "White or red vermouth with seltzer.",
    "Versioni analcoliche dei classici cocktail.": "Non-alcoholic versions of classic cocktails.",
    "Spina da 0.3 L.": "Draft 0.3 L.",
    "Bottiglia da 33 cl.": "33 cl bottle.",
    "Vino bianco frizzante e seltz.": "Sparkling white wine and seltzer.",
    "Scegli tra: Aperol, Campari, Hugo, Select, Cynar, Rabarbaro, Rosa, Sorbole, Misto.": "Choose from: Aperol, Campari, Hugo, Select, Cynar, Rabarbaro, Rosa, Sorbole, Mix.",
    "Classico aperitivo monoporzione, pronto da bere.": "Classic single-serve aperitif, ready to drink.",
    "Campari, Blend di Vermouth Rossi, Soda.": "Campari, Blend of Red Vermouths, Soda.",
    "Gin, Campari, Blend di Vermouth Rossi. Classico potente.": "Gin, Campari, Blend of Red Vermouths. Powerful classic.",
    "Vodka, succo di pomodoro condito e spezie.": "Vodka, seasoned tomato juice and spices.",
    "Richiedi il tuo cocktail preferito ai nostri barman.": "Ask our bartenders for your favorite cocktail.",
    "Cocktail preparati con distillati e ingredienti di alta gamma.": "Cocktails made with premium spirits and ingredients.",
    "Lager belga leggera e rinfrescante con un tocco luppolato.": "Light and refreshing Belgian lager with a hoppy touch.",
    
    // Vini
    "Lugana, Trebbiano.": "Lugana, Trebbiano.",
    "Custoza, Garganega.": "Custoza, Garganega.",
    "Soave, Garganega.": "Soave, Garganega.",
    "Chardonnay delle colline veronesi.": "Chardonnay from Veronese hills.",
    "Bardolino, Corvina.": "Bardolino, Corvina.",
    "Valpolicella, Corvina.": "Valpolicella, Corvina.",
    "Amarone, Corvina.": "Amarone, Corvina.",
    "Prosecco, Glera.": "Prosecco, Glera.",
    "Vino rosato frizzante.": "Sparkling rosé wine.",
    "Fresco e sapido, con sentori di mandorla e fiori bianchi. Ideale per aperitivo.": "Fresh and savory, with hints of almond and white flowers. Perfect for aperitif.",
    "Vino elegante e minerale del Veneto, profumo di biancospino e camomilla.": "Elegant and mineral wine from Veneto, with hawthorn and chamomile aromas.",
    "Vino dal gusto morbido con sentori di mela matura e vaniglia.": "Wine with soft taste, hints of ripe apple and vanilla.",
    "Acidità vibrante, note floreali e minerali.": "Vibrant acidity, floral and mineral notes.",
    "Bianco fresco e minerale della Campania, con note di agrumi e fiori bianchi.": "Fresh and mineral white from Campania, with citrus and white flower notes.",
    "Rosato delicato e profumato con sentori di frutti rossi estivi. (Rosé DOC).": "Delicate and fragrant rosé with hints of summer red fruits. (Rosé DOC).",
    "Rosso giovane e vivace del Veneto, note di ciliegia e pepe nero. Leggero.": "Young and lively red from Veneto, cherry and black pepper notes. Light.",
    "Più strutturato e complesso del Classico, con note di frutta matura e spezie.": "More structured and complex than Classico, with ripe fruit and spice notes.",
    "Elegante e vellutato, con sentori di sottobosco e lampone.": "Elegant and velvety, with forest floor and raspberry hints.",
    "Corposo e robusto, con note decise di ribes nero e peperone verde.": "Full-bodied and robust, with bold blackcurrant and green pepper notes.",
    "Rosso decisivo e strutturato dalla Campania, con note di ciliegia scura, prugna e spezie.": "Bold and structured red from Campania, with dark cherry, plum and spice notes.",
    "Frizzante e aromatico, con sentori di mela e pera. Perfetto per ogni brindisi.": "Sparkling and aromatic, with apple and pear hints. Perfect for toasting.",
    "Bollicina elegante e cremosa, con perlage fine e note di frutta bianca e fiori d'acacia.": "Elegant and creamy bubble, with fine perlage and white fruit and acacia flower notes.",
    "Spumante rosé campano, fresco e fruttato con note di fragola e rosa.": "Campania rosé sparkling, fresh and fruity with strawberry and rose notes.",
    "Metodo Classico di alta qualità dal Trentino, con perlage fine e note di crosta di pane.": "High quality Classic Method from Trentino, with fine perlage and bread crust notes."
};

// Menu item NAMES translations (Italian to English)
const menuNames = {
    // Caffetteria
    "Macchiatone": "Macchiato",
    "Caffè Americano": "American Coffee",
    "Latte Macchiato": "Latte",
    "Caffè Corretto": "Spiked Coffee",
    "Caffè Doppio": "Double Espresso",
    "Ginseng/Orzo": "Ginseng/Barley",
    "Caffè Skalette": "Skalette Coffee",
    "Infuso": "Herbal Tea",
    "Biscotto": "Cookie",
    
    // Gastronomia
    "Polpetta di Carne": "Meat Meatball",
    "Polpetta Vegetariana": "Veggie Meatball",
    "Arancino al Tastasal": "Tastasal Arancino",
    "Pizza Margherita": "Margherita Pizza",
    "Pizza Farcita": "Stuffed Pizza",
    "Focaccia": "Focaccia",
    "Pizzetta": "Mini Pizza",
    
    // I Nostri Piatti
    "Tagliere di Salumi e Formaggi": "Charcuterie & Cheese Board",
    "Vellutata di Verdure": "Vegetable Soup",
    "Battuta di Manzo alla Francese": "French-Style Beef Tartare",
    "Insalata Mista di Pollo": "Mixed Chicken Salad",
    "Acciuga del Cantabrico": "Cantabrian Anchovy",
    "Ovetto Poché": "Poached Egg",
    "Tagliatelle al Ragù di Quaglia": "Tagliatelle with Quail Ragù",
    "Gnocchi alla Zucca": "Pumpkin Gnocchi",
    "Ravioli Artigianali alla Gricia": "Artisan Gricia Ravioli",
    "Tagliata di Manzo": "Sliced Beef Steak",
    "Guancetta di Maiale": "Pork Cheek",
    "Moscardini in Umido": "Stewed Baby Octopus",
    "Trancio di Salmone": "Salmon Fillet",
    "Farcito con manzo e maiale": "Beef & Pork Burrito",
    
    // Dolci
    "Tiramisù della Casa": "House Tiramisù",
    "Crema Catalana": "Crème Brûlée",
    "Sbrisolona e Grappa": "Sbrisolona & Grappa",
    
    // Bevande
    "Acqua 0,5 L": "Water 0.5 L",
    "Acqua 0,75 L": "Water 0.75 L",
    "Crodino XL": "Crodino XL",
    "Lattina": "Can",
    "Succo di Frutta": "Fruit Juice",
    "Spremuta": "Fresh Juice",
    "Bibita Lurisia": "Lurisia Soft Drink",
    "Tonica Fever-Tree": "Fever-Tree Tonic",
    "Tè Fuze": "Fuze Tea",
    "Tè Caldo": "Hot Tea",
    "Cioccolata Calda": "Hot Chocolate",
    "Tonica": "Tonic Water",
    "Tè Limone/Pesca": "Lemon/Peach Tea",
    "Homemade Gingerbeer": "Homemade Ginger Beer",
    "Pomodoro Condito": "Seasoned Tomato Juice",
    "Soda al Pompelmo Rosa": "Pink Grapefruit Soda",
    
    // Aperitivi
    "Spritz Bianco": "White Spritz",
    "Campari Soda": "Campari Soda",
    "Americano": "Americano Cocktail",
    "Mocktails": "Mocktails",
    "Birra Pils \"Maes\" 0,25L": "Pils Beer \"Maes\" 0.25L",
    "Birra Pils \"Maes\" 0,5L": "Pils Beer \"Maes\" 0.5L",
    
    // Vini - Bianchi
    "Lugana \"Tenuta Roveglia\"": "Lugana \"Tenuta Roveglia\"",
    "Soave \"Coffele\"": "Soave \"Coffele\"",
    "Chardonnay \"Dolfo\"": "Chardonnay \"Dolfo\"",
    "Ribolla Gialla \"Dolfo\"": "Ribolla Gialla \"Dolfo\"",
    "Falanghina \"San Salvatore\"": "Falanghina \"San Salvatore\"",
    "Rosé \"San Salvatore Vetere\"": "Rosé \"San Salvatore Vetere\"",
    
    // Vini - Rossi
    "Valpolicella Classico \"Speri\"": "Valpolicella Classico \"Speri\"",
    "Valpolicella Superiore \"Speri\"": "Valpolicella Superiore \"Speri\"",
    "Pinot Nero \"Ploner\"": "Pinot Noir \"Ploner\"",
    "Cabernet Sauvignon \"Dolfo\"": "Cabernet Sauvignon \"Dolfo\"",
    "Aglianico \"San Salvatore\"": "Aglianico \"San Salvatore\"",
    
    // Vini - Bollicine
    "Prosecco \"Follador\"": "Prosecco \"Follador\"",
    "Franciacorta Satèn \"Berlucchi\"": "Franciacorta Satèn \"Berlucchi\"",
    "Vulcano 800 Rosé \"Terra dei Re\"": "Vulcano 800 Rosé \"Terra dei Re\"",
    "Trento DOC \"Altemasi\"": "Trento DOC \"Altemasi\""
};

// Allergen tags translations (Italian to English)
const allergenTags = {
    "Glutine": "Gluten",
    "Latticini": "Dairy",
    "Uova": "Eggs",
    "Pesce": "Fish",
    "Crostacei": "Shellfish",
    "Molluschi": "Mollusks",
    "Senape": "Mustard",
    "Sedano": "Celery",
    "Frutta a guscio": "Tree Nuts",
    "Arachidi": "Peanuts",
    "Sesamo": "Sesame",
    "Solfiti": "Sulfites",
    "Vegetariano": "Vegetarian",
    // Other tags
    "Tradizione": "Traditional",
    "Classico": "Classic",
    "Premium": "Premium",
    "Signature": "Signature",
    "Chef's Choice": "Chef's Choice",
    "Rosé": "Rosé"
};

// Current language - auto-detect from browser or use saved preference
let currentLang = detectLanguage();

// Detect language from browser settings or localStorage
function detectLanguage() {
    // Check if user has manually selected a language before
    const savedLang = localStorage.getItem('skalette_lang');
    const hasManuallySelected = localStorage.getItem('skalette_lang_manual');
    
    if (savedLang && hasManuallySelected === 'true') {
        // User has manually selected a language, respect their choice
        return savedLang;
    }
    
    // Auto-detect from browser language
    const browserLang = navigator.language || navigator.userLanguage || 'it';
    
    // If browser language starts with 'it' (Italian), use Italian
    // Otherwise, default to English
    if (browserLang.toLowerCase().startsWith('it')) {
        return 'it';
    } else {
        return 'en';
    }
}

// Initialize language system
function initLanguageSystem() {
    // Set initial language
    setLanguage(currentLang, false);
    
    // Add click handlers to desktop language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang, true, true); // Mark as manual selection
        });
    });
    
    // Add click handlers to mobile flag buttons
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang, true, true); // Mark as manual selection
            // Close mobile menu after language change
            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                setTimeout(() => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }, 300);
            }
        });
    });
}

// Set language
function setLanguage(lang, animate = true, isManualSelection = false) {
    currentLang = lang;
    localStorage.setItem('skalette_lang', lang);
    
    // Track if user manually selected a language
    if (isManualSelection) {
        localStorage.setItem('skalette_lang_manual', 'true');
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update Google Reviews language
    if (typeof initReviews === 'function') {
        initReviews();
    }
    
    // Update desktop button state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    
    // Update mobile flag button state
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    
    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = translations[lang][key];
        
        if (translation) {
            if (animate) {
                el.style.opacity = '0';
                setTimeout(() => {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        el.placeholder = translation;
                    } else {
                        el.innerHTML = translation;
                    }
                    el.style.opacity = '1';
                }, 150);
            } else {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translation;
                } else {
                    el.innerHTML = translation;
                }
            }
        }
    });
    
    // Translate menu item descriptions
    translateMenuItems(lang, animate);
    
    // Translate guest select options
    translateGuestOptions(lang);
    
    // Update page title
    document.title = lang === 'it' ? 'Skalette Bistro | Ristorante Elegante' : 'Skalette Bistro | Elegant Restaurant';
    
    // Update swipe indicator text in CSS
    updateSwipeIndicator(lang);
}

// Translate menu item names and descriptions
function translateMenuItems(lang, animate = true) {
    // Translate descriptions
    document.querySelectorAll('.menu-item-content > p').forEach(el => {
        const text = el.textContent.trim();
        let translation = null;
        
        if (lang === 'en') {
            translation = menuDescriptions[text];
        } else {
            for (const [italian, english] of Object.entries(menuDescriptions)) {
                if (english === text) {
                    translation = italian;
                    break;
                }
            }
        }
        
        if (translation) {
            if (animate) {
                el.style.opacity = '0';
                setTimeout(() => {
                    el.textContent = translation;
                    el.style.opacity = '1';
                }, 150);
            } else {
                el.textContent = translation;
            }
        }
    });
    
    // Translate item names (h3 inside menu-item-header)
    document.querySelectorAll('.menu-item-header h3').forEach(el => {
        const text = el.textContent.trim();
        let translation = null;
        
        if (lang === 'en') {
            translation = menuNames[text];
        } else {
            for (const [italian, english] of Object.entries(menuNames)) {
                if (english === text) {
                    translation = italian;
                    break;
                }
            }
        }
        
        if (translation) {
            if (animate) {
                el.style.opacity = '0';
                setTimeout(() => {
                    el.textContent = translation;
                    el.style.opacity = '1';
                }, 150);
            } else {
                el.textContent = translation;
            }
        }
    });
    
    // Translate allergen and other tags
    document.querySelectorAll('.menu-tags .tag').forEach(el => {
        const text = el.textContent.trim();
        let translation = null;
        
        if (lang === 'en') {
            translation = allergenTags[text];
        } else {
            for (const [italian, english] of Object.entries(allergenTags)) {
                if (english === text) {
                    translation = italian;
                    break;
                }
            }
        }
        
        if (translation) {
            if (animate) {
                el.style.opacity = '0';
                setTimeout(() => {
                    el.textContent = translation;
                    el.style.opacity = '1';
                }, 150);
            } else {
                el.textContent = translation;
            }
        }
    });
}

// Translate guest options in reservation form
function translateGuestOptions(lang) {
    const guestsSelect = document.getElementById('booking-guests');
    if (guestsSelect) {
        guestsSelect.querySelectorAll('option').forEach(option => {
            const value = option.value;
            const key = `guests.${value}`;
            if (translations[lang][key]) {
                option.textContent = translations[lang][key];
            }
        });
    }
    
    // Also translate meal type select options
    const mealSelect = document.getElementById('booking-meal');
    if (mealSelect) {
        const mealOptions = mealSelect.querySelectorAll('option');
        mealOptions.forEach(option => {
            const key = option.getAttribute('data-i18n');
            if (key && translations[lang][key]) {
                option.textContent = translations[lang][key];
            }
        });
    }
    
    // Translate time select placeholder if empty
    const timeSelect = document.getElementById('booking-time');
    if (timeSelect && timeSelect.options.length === 1 && timeSelect.options[0].value === '') {
        const key = timeSelect.options[0].getAttribute('data-i18n');
        if (key && translations[lang][key]) {
            timeSelect.options[0].textContent = translations[lang][key];
        }
    }
}

// Update CSS-based swipe indicator
function updateSwipeIndicator(lang) {
    let style = document.getElementById('lang-dynamic-styles');
    if (!style) {
        style = document.createElement('style');
        style.id = 'lang-dynamic-styles';
        document.head.appendChild(style);
    }
    
    const text = translations[lang]['swipeIndicator'];
    style.textContent = `
        @media (max-width: 768px) {
            .testimonials-wrapper::after {
                content: '${text}' !important;
            }
        }
    `;
}

// Get translation by key
function t(key) {
    return translations[currentLang][key] || key;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initLanguageSystem);
