/* ===================================
   SKALETTE BISTRO - JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // PRELOADER
    // ===================================
    const preloader = document.querySelector('.preloader');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1500);
    });

    // ===================================
    // NAVIGATION
    // ===================================
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect for navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 200;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    });

    // ===================================
    // MENU TABS
    // ===================================
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuCategories = document.querySelectorAll('.menu-category');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            menuTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all categories
            menuCategories.forEach(cat => cat.classList.remove('active'));
            
            // Show selected category
            const targetCategory = document.getElementById(this.dataset.tab);
            if (targetCategory) {
                targetCategory.classList.add('active');
            }
        });
    });

    // ===================================
    // SMOOTH SCROLL
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ===================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.about-content, .about-images, .menu-item, .gallery-item, .testimonial-card, .feature-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animate class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ===================================
    // RESERVATION FORM
    // ===================================
    const reservationForm = document.getElementById('reservationForm');
    
    if (reservationForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.phone || !data.guests || !data.date || !data.time) {
                showNotification('Per favore, compila tutti i campi obbligatori.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Per favore, inserisci un indirizzo email valido.', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Invio in corso...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showNotification('Prenotazione inviata con successo! Ti contatteremo presto per confermare.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // ===================================
    // NEWSLETTER FORM
    // ===================================
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                showNotification('Grazie per l\'iscrizione alla nostra newsletter!', 'success');
                this.reset();
            }
        });
    }

    // ===================================
    // NOTIFICATION SYSTEM
    // ===================================
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
        const notificationStyles = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 20px 30px;
                background: var(--navy);
                border: 1px solid var(--gold);
                color: var(--white);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 20px;
                animation: slideIn 0.3s ease;
                max-width: 400px;
            }
            .notification-success {
                border-color: #4caf50;
            }
            .notification-error {
                border-color: #f44336;
            }
            .notification-close {
                background: none;
                border: none;
                color: var(--grey-light);
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            .notification-close:hover {
                color: var(--white);
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;

        // Add styles to document if not already added
        if (!document.querySelector('#notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'notification-styles';
            styleSheet.textContent = notificationStyles;
            document.head.appendChild(styleSheet);
        }

        // Add to document
        document.body.appendChild(notification);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // ===================================
    // PARALLAX EFFECT
    // ===================================
    const parallaxSections = document.querySelectorAll('.quote-section, .hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        parallaxSections.forEach(section => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            section.style.backgroundPositionY = `${yPos}px`;
        });
    });

    // ===================================
    // GALLERY LIGHTBOX (Optional Enhancement)
    // ===================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                // Create lightbox
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.innerHTML = `
                    <div class="lightbox-content">
                        <img src="${img.src.replace('w=400', 'w=1200').replace('w=800', 'w=1200')}" alt="${img.alt}">
                        <button class="lightbox-close">&times;</button>
                    </div>
                `;

                // Add styles
                const lightboxStyles = `
                    .lightbox {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(10, 22, 40, 0.95);
                        z-index: 10000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        animation: fadeIn 0.3s ease;
                    }
                    .lightbox-content {
                        position: relative;
                        max-width: 90%;
                        max-height: 90%;
                    }
                    .lightbox-content img {
                        max-width: 100%;
                        max-height: 90vh;
                        object-fit: contain;
                    }
                    .lightbox-close {
                        position: absolute;
                        top: -40px;
                        right: 0;
                        background: none;
                        border: none;
                        color: var(--gold);
                        font-size: 36px;
                        cursor: pointer;
                    }
                `;

                if (!document.querySelector('#lightbox-styles')) {
                    const styleSheet = document.createElement('style');
                    styleSheet.id = 'lightbox-styles';
                    styleSheet.textContent = lightboxStyles;
                    document.head.appendChild(styleSheet);
                }

                document.body.appendChild(lightbox);

                // Close lightbox
                lightbox.addEventListener('click', function(e) {
                    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                        lightbox.remove();
                    }
                });

                // Close on escape key
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && document.querySelector('.lightbox')) {
                        document.querySelector('.lightbox').remove();
                    }
                });
            }
        });
    });

    // ===================================
    // COUNTER ANIMATION
    // ===================================
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // ===================================
    // HEADER SHRINK ON SCROLL
    // ===================================
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 500) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // ===================================
    // TYPING EFFECT FOR HERO (Optional)
    // ===================================
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Start typing after preloader
        setTimeout(typeWriter, 2000);
    }

    // ===================================
    // LAZY LOADING IMAGES
    // ===================================
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ===================================
    // INITIALIZE
    // ===================================
    console.log('Skalette Bistro website initialized');
    
    // Booking system is now handled by reservation-firebase.js
    // initBookingSystem();
});

// ===================================
// BOOKING SYSTEM
// ===================================

const WHATSAPP_NUMBER = '393428691832';
let selectedTable = null;
let bookingData = {};

const TIME_SLOTS = {
    pranzo: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30'],
    aperitivo: ['17:00', '17:30', '18:00', '18:30', '19:00'],
    cena: ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00']
};

function initBookingSystem() {
    // Set min date to today
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
    
    // Meal type change -> update time slots
    const mealSelect = document.getElementById('booking-meal');
    if (mealSelect) {
        mealSelect.addEventListener('change', updateTimeSlots);
    }
    
    // Form submission
    const finalForm = document.getElementById('booking-final-form');
    if (finalForm) {
        finalForm.addEventListener('submit', handleBookingSubmit);
    }
}

function updateTimeSlots() {
    const mealType = document.getElementById('booking-meal').value;
    const timeSelect = document.getElementById('booking-time');
    
    timeSelect.innerHTML = '<option value="">Seleziona orario</option>';
    timeSelect.disabled = !mealType;
    
    if (mealType && TIME_SLOTS[mealType]) {
        TIME_SLOTS[mealType].forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            timeSelect.appendChild(option);
        });
    }
}

function showFloorPlan() {
    const guests = document.getElementById('booking-guests').value;
    const date = document.getElementById('booking-date').value;
    const mealType = document.getElementById('booking-meal').value;
    const time = document.getElementById('booking-time').value;
    
    if (!guests || !date || !mealType || !time) {
        alert('Per favore compila tutti i campi prima di continuare.');
        return;
    }
    
    // Save booking data
    bookingData = { guests: parseInt(guests), date, mealType, time };
    
    // Show step 2
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    
    // Render floor plan
    renderFloorPlan();
}

function renderFloorPlan() {
    const container = document.getElementById('floor-plan-container');
    if (!container) return;
    
    const floorPlan = getFloorPlan();
    const { guests, date, time, mealType } = bookingData;
    
    container.innerHTML = '';
    
    // Elementi fissi con classi CSS
    const fixedElements = `
        <!-- BANCO -->
        <div class="floor-element banco" style="left:22%;top:35%;">
            <span style="color:rgba(201,169,97,0.7);font-size:13px;font-weight:600;letter-spacing:2px;">BANCO</span>
        </div>
        
        <!-- DIVANI PICCOLI zona alta -->
        <div class="floor-element divano-piccolo" style="left:52%;top:10%;">
            <span style="color:rgba(200,160,100,0.8);font-size:8px;">DIVANO</span>
        </div>
        <div class="floor-element divano-piccolo" style="left:68%;top:10%;">
            <span style="color:rgba(200,160,100,0.8);font-size:8px;">DIVANO</span>
        </div>
        <div class="floor-element divano-piccolo" style="left:84%;top:10%;">
            <span style="color:rgba(200,160,100,0.8);font-size:8px;">DIVANO</span>
        </div>
        
        <!-- DIVANO GRANDE zona bassa (da S8 a S4) -->
        <div class="floor-element divano-grande" style="left:73%;top:82%;">
            <span style="color:rgba(200,160,100,0.9);font-size:9px;font-weight:500;letter-spacing:1px;">DIVANO GRANDE</span>
        </div>
        
        <!-- SCALA -->
        <div class="floor-element scala" style="left:44%;top:50%;">
            <span style="color:rgba(201,169,97,0.9);font-size:11px;font-weight:600;writing-mode:vertical-rl;letter-spacing:2px;">SCALA</span>
        </div>
        
        <!-- ENTRATA -->
        <div class="floor-element entrata" style="left:5%;top:60%;">
            <span style="color:rgba(201,169,97,0.5);font-size:7px;writing-mode:vertical-rl;text-transform:uppercase;">Entrata</span>
        </div>
    `;
    container.innerHTML = fixedElements;
    
    if (floorPlan.tables.length === 0) {
        container.innerHTML += `
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;color:#8a8a8a;">
                <p style="font-size:16px;margin-bottom:10px;">Piantina non configurata</p>
                <p style="font-size:13px;">Contattaci al 045 8030500 per prenotare</p>
            </div>
        `;
        return;
    }
    
    floorPlan.tables.forEach(table => {
        const isAvailable = guests >= table.minGuests && 
                           guests <= table.maxGuests && 
                           isTableAvailable(table.id, date, time, mealType);
        
        const tableEl = document.createElement('div');
        tableEl.className = 'floor-table ' + (isAvailable ? 'available' : 'unavailable') + ' ' + (table.shape || 'square');
        tableEl.dataset.tableId = table.id;
        tableEl.style.left = table.x + '%';
        tableEl.style.top = table.y + '%';
        
        tableEl.innerHTML = `
            <span class="table-name">${table.name}</span>
            <span class="table-seats">${table.minGuests}-${table.maxGuests} posti</span>
        `;
        
        if (isAvailable) {
            tableEl.addEventListener('click', () => selectTable(table, tableEl));
            tableEl.addEventListener('mouseenter', () => {
                if (selectedTable?.id !== table.id) {
                    tableEl.style.transform = 'translate(-50%, -50%) scale(1.1)';
                }
            });
            tableEl.addEventListener('mouseleave', () => {
                if (selectedTable?.id !== table.id) {
                    tableEl.style.transform = 'translate(-50%, -50%)';
                }
            });
        }
        
        container.appendChild(tableEl);
    });
    
    // Add legend
    const legend = document.createElement('div');
    legend.className = 'floor-legend';
    legend.innerHTML = `
        <span style="display:flex;align-items:center;gap:6px;">
            <span style="width:14px;height:14px;background:linear-gradient(135deg,#c9a961,#a8893e);border-radius:3px;"></span>
            Disponibile
        </span>
        <span style="display:flex;align-items:center;gap:6px;">
            <span style="width:14px;height:14px;background:rgba(100,100,100,0.4);border-radius:3px;"></span>
            Non disponibile
        </span>
    `;
    container.appendChild(legend);
}

function selectTable(table, element) {
    // Deselect previous
    document.querySelectorAll('.floor-table').forEach(el => {
        el.style.border = '3px solid transparent';
        el.style.transform = 'translate(-50%, -50%)';
    });
    
    // Select new
    selectedTable = table;
    element.style.border = '3px solid #fff';
    element.style.transform = 'translate(-50%, -50%) scale(1.1)';
    
    // Update UI
    document.getElementById('selected-table-info').style.display = 'block';
    document.getElementById('selected-table-name').textContent = table.name;
    document.getElementById('btn-confirm-table').disabled = false;
    
    bookingData.tableId = table.id;
    bookingData.tableName = table.name;
}

function goToStep(step) {
    document.querySelectorAll('.booking-step').forEach(s => s.style.display = 'none');
    document.getElementById('step' + step).style.display = 'block';
    
    if (step === 3) {
        updateSummary();
    }
}

function updateSummary() {
    const dateFormatted = new Date(bookingData.date).toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
    
    const mealLabels = { pranzo: '☀️ Pranzo', aperitivo: '🍹 Aperitivo', cena: '🌙 Cena' };
    
    document.getElementById('summary-date').textContent = dateFormatted;
    document.getElementById('summary-time').textContent = bookingData.time + ' - ' + mealLabels[bookingData.mealType];
    document.getElementById('summary-guests').textContent = bookingData.guests + ' person' + (bookingData.guests > 1 ? 'e' : 'a');
    document.getElementById('summary-table').textContent = bookingData.tableName;
}

function handleBookingSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('booking-name').value;
    const phone = document.getElementById('booking-phone').value;
    const email = document.getElementById('booking-email').value;
    const notes = document.getElementById('booking-notes').value;
    
    // Create reservation
    const reservation = {
        id: 'RES' + Date.now().toString(36).toUpperCase(),
        name,
        phone,
        email,
        notes,
        ...bookingData,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Save reservation
    const reservations = getReservations();
    reservations.push(reservation);
    saveReservations(reservations);
    
    // Show success
    document.getElementById('reservation-id').textContent = reservation.id;
    goToStep(4);
    
    // Open WhatsApp with pre-filled message
    const dateFormatted = new Date(bookingData.date).toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const mealLabels = { pranzo: 'Pranzo', aperitivo: 'Aperitivo', cena: 'Cena' };
    
    const message = `🍽️ NUOVA PRENOTAZIONE - Skalette Bistro

👤 Nome: ${name}
📱 Telefono: ${phone}
📧 Email: ${email}
👥 Persone: ${bookingData.guests}
📅 Data: ${dateFormatted}
⏰ Orario: ${bookingData.time} (${mealLabels[bookingData.mealType]})
🪑 Tavolo: ${bookingData.tableName}

📝 Note: ${notes || 'Nessuna'}

ID: ${reservation.id}`;

    setTimeout(() => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    }, 500);
}

function resetBooking() {
    selectedTable = null;
    bookingData = {};
    
    document.getElementById('booking-guests').value = '';
    document.getElementById('booking-meal').value = '';
    document.getElementById('booking-time').innerHTML = '<option value="">Prima scegli il tipo</option>';
    document.getElementById('booking-time').disabled = true;
    document.getElementById('booking-name').value = '';
    document.getElementById('booking-phone').value = '';
    document.getElementById('booking-email').value = '';
    document.getElementById('booking-notes').value = '';
    document.getElementById('selected-table-info').style.display = 'none';
    document.getElementById('btn-confirm-table').disabled = true;
    
    goToStep(1);
}

// Helper functions
function getFloorPlan() {
    const saved = localStorage.getItem('skalette_floorplan');
    if (saved) {
        return JSON.parse(saved);
    }
    
    // Default floor plan - Skalette Bistro layout
    const defaultPlan = {
        tables: [
            // Zona alta - Divano
            { id: 'S1', name: 'S1', shape: 'square', minGuests: 3, maxGuests: 5, width: 70, height: 70, x: 52, y: 22 },
            { id: 'S2', name: 'S2', shape: 'round', minGuests: 2, maxGuests: 3, width: 65, height: 65, x: 68, y: 22 },
            { id: 'S3', name: 'S3', shape: 'square', minGuests: 3, maxGuests: 5, width: 70, height: 70, x: 84, y: 22 },
            
            // Zona bassa sinistra - Entrata
            { id: 'B3', name: 'B3', shape: 'square', minGuests: 1, maxGuests: 4, width: 60, height: 60, x: 12, y: 75 },
            { id: 'B2', name: 'B2', shape: 'square', minGuests: 1, maxGuests: 4, width: 60, height: 60, x: 24, y: 75 },
            { id: 'B1', name: 'B1', shape: 'square', minGuests: 1, maxGuests: 4, width: 60, height: 60, x: 36, y: 75 },
            
            // Zona bassa destra - Divano grande (S8 a S4)
            { id: 'S8', name: 'S8', shape: 'square', minGuests: 3, maxGuests: 5, width: 65, height: 65, x: 52, y: 68 },
            { id: 'S7', name: 'S7', shape: 'square', minGuests: 1, maxGuests: 2, width: 50, height: 50, x: 64, y: 68 },
            { id: 'S6', name: 'S6', shape: 'square', minGuests: 1, maxGuests: 2, width: 50, height: 50, x: 74, y: 68 },
            { id: 'S5', name: 'S5', shape: 'square', minGuests: 1, maxGuests: 2, width: 50, height: 50, x: 84, y: 68 },
            { id: 'S4', name: 'S4', shape: 'square', minGuests: 1, maxGuests: 2, width: 50, height: 50, x: 94, y: 68 }
        ],
        updatedAt: new Date().toISOString()
    };
    
    // Save default plan
    localStorage.setItem('skalette_floorplan', JSON.stringify(defaultPlan));
    return defaultPlan;
}

function getReservations() {
    const saved = localStorage.getItem('skalette_reservations');
    return saved ? JSON.parse(saved) : [];
}

function saveReservations(data) {
    localStorage.setItem('skalette_reservations', JSON.stringify(data));
}

function isTableAvailable(tableId, date, time, mealType) {
    const reservations = getReservations();
    return !reservations.some(res => 
        res.tableId === tableId && 
        res.date === date && 
        res.time === time &&
        res.mealType === mealType &&
        res.status !== 'rejected'
    );
}
