/* ===================================
   SKALETTE BISTRO - JavaScript
   Enhanced with Advanced Effects
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // CUSTOM CURSOR
    // ===================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (cursorDot && cursorOutline && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });
        
        // Smooth cursor outline follow
        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .menu-item, .gallery-item, .nav-link');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // ===================================
    // SCROLL PROGRESS BAR
    // ===================================
    const scrollProgress = document.querySelector('.scroll-progress');
    
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });
    }

    // ===================================
    // BACK TO TOP BUTTON
    // ===================================
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===================================
    // PRELOADER
    // ===================================
    const preloader = document.querySelector('.preloader');
    
    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('hidden');
            // Trigger hero animations after preloader
            initHeroAnimations();
        }
    }
    
    // Hide preloader when page loads
    window.addEventListener('load', function() {
        setTimeout(hidePreloader, 1500);
    });
    
    // Fallback: hide preloader after 3 seconds even if load event doesn't fire properly
    setTimeout(hidePreloader, 3000);

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

    // Mobile menu toggle with body overlay
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking overlay
    document.addEventListener('click', function(e) {
        if (document.body.classList.contains('menu-open') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // ===================================
    // MOBILE BOTTOM NAVIGATION
    // ===================================
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    const allSections = document.querySelectorAll('section[id]');
    
    // Update active bottom nav on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollY = window.pageYOffset;
        
        allSections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        bottomNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + current) {
                item.classList.add('active');
            }
        });
    });

    // ===================================
    // HERO ANIMATIONS & EFFECTS
    // ===================================
    function initHeroAnimations() {
        // Reveal text animation
        const revealTexts = document.querySelectorAll('.reveal-text');
        revealTexts.forEach((text, index) => {
            setTimeout(() => {
                text.classList.add('revealed');
            }, index * 300);
        });
    }

    // ===================================
    // PARALLAX EFFECT
    // ===================================
    const heroBg = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        if (heroBg && scrolled < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
        
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    });



    // ===================================
    // 3D TILT EFFECT FOR MENU ITEMS
    // ===================================
    function initTiltEffect() {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transition = 'none';
            });
            
            item.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 15;
                const rotateY = (centerX - x) / 15;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
                this.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(201, 169, 97, 0.15)';
                this.style.borderColor = 'rgba(201, 169, 97, 0.4)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transition = 'all 0.5s ease';
                this.style.transform = '';
                this.style.boxShadow = '';
                this.style.borderColor = '';
            });
        });
    }
    
    // Initialize on load and when tabs change
    initTiltEffect();
    
    // Re-init when menu tabs are clicked
    document.querySelectorAll('.menu-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            setTimeout(initTiltEffect, 100);
        });
    });

    // ===================================
    // GALLERY FILTERS
    // ===================================
    const galleryFilters = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Update active filter
            galleryFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.filter;
            
            galleryItems.forEach((item, index) => {
                if (category === 'all' || item.dataset.category === category) {
                    item.classList.remove('hidden');
                    item.style.animationDelay = (index * 0.1) + 's';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ===================================
    // TESTIMONIALS SLIDER
    // ===================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.testimonial-nav.prev');
    const nextBtn = document.querySelector('.testimonial-nav.next');
    let currentTestimonial = 0;
    let testimonialInterval;
    
    function showTestimonial(index) {
        testimonialCards.forEach((card, i) => {
            card.classList.remove('active', 'prev');
            if (i < index) {
                card.classList.add('prev');
            }
        });
        testimonialDots.forEach(dot => dot.classList.remove('active'));
        
        testimonialCards[index].classList.add('active');
        testimonialDots[index].classList.add('active');
        currentTestimonial = index;
    }
    
    function nextTestimonial() {
        const next = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(next);
    }
    
    function prevTestimonial() {
        const prev = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(prev);
    }
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextTestimonial();
        resetAutoPlay();
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevTestimonial();
        resetAutoPlay();
    });
    
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            resetAutoPlay();
        });
    });
    
    function resetAutoPlay() {
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(nextTestimonial, 5000);
    }
    
    // Auto-play testimonials
    if (testimonialCards.length > 0) {
        testimonialInterval = setInterval(nextTestimonial, 5000);
    }

    // ===================================
    // SWIPE GESTURES FOR TESTIMONIALS (Mobile)
    // ===================================
    const testimonialsWrapper = document.querySelector('.testimonials-wrapper');
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (testimonialsWrapper) {
        testimonialsWrapper.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        testimonialsWrapper.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextTestimonial();
                } else {
                    prevTestimonial();
                }
                resetAutoPlay();
            }
        }, { passive: true });
    }

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
    // SCROLL ANIMATIONS - Simple & Reliable
    // ===================================
    (function initScrollAnimations() {
        // Elements to animate
        const selectors = '.about-content, .about-images, .section-header, .menu-item, .gallery-item, .feature-item, .events-content, .reservation-content, .contact-info';
        
        const elements = document.querySelectorAll(selectors);
        
        if (elements.length === 0) return;
        
        // Add scroll-animate class to all elements
        elements.forEach((el, index) => {
            el.classList.add('scroll-animate');
            // Add delay class for stagger effect (cycle 1-5)
            const delayClass = 'delay-' + ((index % 5) + 1);
            el.classList.add(delayClass);
        });

        // Function to check if element is in viewport
        function isInViewport(el) {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            // Element is considered in view if its top is within 85% of window height
            return rect.top <= windowHeight * 0.85;
        }

        // Function to handle scroll and show elements
        function handleScroll() {
            elements.forEach(el => {
                if (isInViewport(el) && !el.classList.contains('visible')) {
                    el.classList.add('visible');
                }
            });
        }

        // Use requestAnimationFrame for smooth performance
        let ticking = false;
        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }

        // Listen to scroll events
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Also trigger on resize
        window.addEventListener('resize', onScroll, { passive: true });
        
        // Initial check after DOM is ready - check multiple times for mobile
        handleScroll();
        setTimeout(handleScroll, 100);
        setTimeout(handleScroll, 500);
        setTimeout(handleScroll, 1000);
    })();

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
    // LAZY LOADING IMAGES (Native + Fallback)
    // ===================================
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    // For browsers that don't support native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for older browsers
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ===================================
    // INITIALIZE
    // ===================================
    console.log('Skalette Bistro website initialized with enhanced effects');
    
    // Booking system - always initialize (local storage fallback)
    initBookingSystem();
});

// ===================================
// BOOKING SYSTEM
// ===================================

const WHATSAPP_NUMBER = '393428691832';
let selectedTable = null;
let bookingData = {};

// Firebase configuration
const FIREBASE_PROJECT_ID = 'skalette-bistro';
const FIREBASE_API_KEY = 'AIzaSyAbTQnt26Gca0sPa1RlhIyq2TIwLfKfl0s';

// Save reservation to Firebase Firestore
async function saveToFirebase(data, reservationId) {
    try {
        const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/reservations?key=${FIREBASE_API_KEY}`;
        
        const firestoreData = {
            fields: {
                name: { stringValue: data.name },
                phone: { stringValue: data.phone },
                email: { stringValue: data.email },
                notes: { stringValue: data.notes || '' },
                tableId: { stringValue: data.tableId },
                tableName: { stringValue: data.tableName },
                date: { stringValue: data.date },
                time: { stringValue: data.time },
                mealType: { stringValue: data.mealType },
                guests: { integerValue: data.guests },
                status: { stringValue: 'pending' },
                createdAt: { stringValue: data.createdAt },
                localId: { stringValue: reservationId }
            }
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(firestoreData)
        });
        
        if (response.ok) {
            console.log('Reservation saved to Firebase successfully');
        } else {
            console.error('Firebase save failed:', await response.text());
        }
    } catch (error) {
        console.error('Error saving to Firebase:', error);
    }
}

// Map browser language codes to country/nationality names
function getCountryFromLanguage(langCode) {
    const languageToCountry = {
        'it': '🇮🇹 Italia',
        'it-IT': '🇮🇹 Italia',
        'it-CH': '🇨🇭 Svizzera (IT)',
        'en': '🇬🇧 United Kingdom',
        'en-US': '🇺🇸 United States',
        'en-GB': '🇬🇧 United Kingdom',
        'en-AU': '🇦🇺 Australia',
        'en-CA': '🇨🇦 Canada',
        'en-NZ': '🇳🇿 New Zealand',
        'en-IE': '🇮🇪 Ireland',
        'en-ZA': '🇿🇦 South Africa',
        'de': '🇩🇪 Deutschland',
        'de-DE': '🇩🇪 Deutschland',
        'de-AT': '🇦🇹 Österreich',
        'de-CH': '🇨🇭 Schweiz',
        'fr': '🇫🇷 France',
        'fr-FR': '🇫🇷 France',
        'fr-CA': '🇨🇦 Canada (FR)',
        'fr-BE': '🇧🇪 Belgique',
        'fr-CH': '🇨🇭 Suisse',
        'es': '🇪🇸 España',
        'es-ES': '🇪🇸 España',
        'es-MX': '🇲🇽 México',
        'es-AR': '🇦🇷 Argentina',
        'es-CO': '🇨🇴 Colombia',
        'es-CL': '🇨🇱 Chile',
        'pt': '🇵🇹 Portugal',
        'pt-PT': '🇵🇹 Portugal',
        'pt-BR': '🇧🇷 Brasil',
        'nl': '🇳🇱 Nederland',
        'nl-NL': '🇳🇱 Nederland',
        'nl-BE': '🇧🇪 België',
        'pl': '🇵🇱 Polska',
        'pl-PL': '🇵🇱 Polska',
        'ru': '🇷🇺 Россия',
        'ru-RU': '🇷🇺 Россия',
        'uk': '🇺🇦 Україна',
        'uk-UA': '🇺🇦 Україна',
        'zh': '🇨🇳 中国',
        'zh-CN': '🇨🇳 中国',
        'zh-TW': '🇹🇼 台灣',
        'zh-HK': '🇭🇰 香港',
        'ja': '🇯🇵 日本',
        'ja-JP': '🇯🇵 日本',
        'ko': '🇰🇷 한국',
        'ko-KR': '🇰🇷 한국',
        'ar': '🇸🇦 العربية',
        'ar-SA': '🇸🇦 السعودية',
        'ar-AE': '🇦🇪 الإمارات',
        'he': '🇮🇱 ישראל',
        'he-IL': '🇮🇱 ישראל',
        'tr': '🇹🇷 Türkiye',
        'tr-TR': '🇹🇷 Türkiye',
        'el': '🇬🇷 Ελλάδα',
        'el-GR': '🇬🇷 Ελλάδα',
        'sv': '🇸🇪 Sverige',
        'sv-SE': '🇸🇪 Sverige',
        'no': '🇳🇴 Norge',
        'nb-NO': '🇳🇴 Norge',
        'nn-NO': '🇳🇴 Norge',
        'da': '🇩🇰 Danmark',
        'da-DK': '🇩🇰 Danmark',
        'fi': '🇫🇮 Suomi',
        'fi-FI': '🇫🇮 Suomi',
        'cs': '🇨🇿 Česko',
        'cs-CZ': '🇨🇿 Česko',
        'sk': '🇸🇰 Slovensko',
        'sk-SK': '🇸🇰 Slovensko',
        'hu': '🇭🇺 Magyarország',
        'hu-HU': '🇭🇺 Magyarország',
        'ro': '🇷🇴 România',
        'ro-RO': '🇷🇴 România',
        'bg': '🇧🇬 България',
        'bg-BG': '🇧🇬 България',
        'hr': '🇭🇷 Hrvatska',
        'hr-HR': '🇭🇷 Hrvatska',
        'sl': '🇸🇮 Slovenija',
        'sl-SI': '🇸🇮 Slovenija',
        'sr': '🇷🇸 Србија',
        'sr-RS': '🇷🇸 Србија',
        'th': '🇹🇭 ประเทศไทย',
        'th-TH': '🇹🇭 ประเทศไทย',
        'vi': '🇻🇳 Việt Nam',
        'vi-VN': '🇻🇳 Việt Nam',
        'id': '🇮🇩 Indonesia',
        'id-ID': '🇮🇩 Indonesia',
        'ms': '🇲🇾 Malaysia',
        'ms-MY': '🇲🇾 Malaysia',
        'hi': '🇮🇳 भारत',
        'hi-IN': '🇮🇳 भारत',
        'bn': '🇧🇩 বাংলাদেশ',
        'bn-BD': '🇧🇩 বাংলাদেশ',
        'bn-IN': '🇮🇳 India (BN)'
    };
    
    // First try exact match
    if (languageToCountry[langCode]) {
        return languageToCountry[langCode];
    }
    
    // Try base language code (e.g., 'en' from 'en-US')
    const baseLang = langCode.split('-')[0];
    if (languageToCountry[baseLang]) {
        return languageToCountry[baseLang];
    }
    
    // Fallback: return the language code itself
    return `🌍 ${langCode}`;
}

// Last dopocena reservation by day of week (0 = Sunday)
const DOPOCENA_LAST_SLOT = {
    0: '22:30',  // Domenica
    1: '23:30',  // Lunedì
    2: '23:30',  // Martedì
    3: '23:30',  // Mercoledì
    4: '23:30',  // Giovedì
    5: '00:30',  // Venerdì
    6: '00:30',  // Sabato
};

// Generate time slots based on meal type and selected date
function getTimeSlots(mealType, dateStr) {
    const slots = [];
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    
    if (mealType === 'pranzo') {
        // Pranzo: 10:30 - 16:00
        for (let mins = 10 * 60 + 30; mins <= 16 * 60; mins += 30) {
            const hours = Math.floor(mins / 60);
            const minutes = mins % 60;
            slots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
        }
    } else if (mealType === 'aperitivo') {
        // Aperitivo: 10:30 - 21:00
        for (let mins = 10 * 60 + 30; mins <= 21 * 60; mins += 30) {
            const hours = Math.floor(mins / 60);
            const minutes = mins % 60;
            slots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
        }
    } else if (mealType === 'dopocena') {
        // Dopocena: 21:30 until last slot based on day
        const lastSlot = DOPOCENA_LAST_SLOT[dayOfWeek];
        let lastMinutes;
        if (lastSlot === '00:30') {
            lastMinutes = 24 * 60 + 30; // 00:30 next day = 1470 minutes
        } else {
            const [h, m] = lastSlot.split(':').map(Number);
            lastMinutes = h * 60 + m;
        }
        
        for (let mins = 21 * 60 + 30; mins <= lastMinutes; mins += 30) {
            const hours = Math.floor(mins / 60) % 24;
            const minutes = mins % 60;
            slots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
        }
    } else if (mealType === 'cena') {
        // Cena: 16:30 until 21:30 (fixed)
        for (let mins = 16 * 60 + 30; mins <= 21 * 60 + 30; mins += 30) {
            const hours = Math.floor(mins / 60);
            const minutes = mins % 60;
            slots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
        }
    }
    
    return slots;
}

function initBookingSystem() {
    // Set min date to today
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
        
        // Date change -> update time slots (different closing times per day)
        dateInput.addEventListener('change', updateTimeSlots);
    }
    
    // Meal type change -> update time slots
    const mealSelect = document.getElementById('booking-meal');
    if (mealSelect) {
        mealSelect.addEventListener('change', updateTimeSlots);
    }
    
    // View tables button
    const viewTablesBtn = document.getElementById('btn-view-tables');
    if (viewTablesBtn) {
        viewTablesBtn.addEventListener('click', showFloorPlan);
    }
    
    // Back buttons
    const backStep1Btn = document.getElementById('btn-back-step1');
    if (backStep1Btn) {
        backStep1Btn.addEventListener('click', () => {
            document.getElementById('booking-step-2').style.display = 'none';
            document.getElementById('booking-step-1').style.display = 'block';
        });
    }
    
    const backStep2Btn = document.getElementById('btn-back-step2');
    if (backStep2Btn) {
        backStep2Btn.addEventListener('click', () => {
            document.getElementById('booking-step-3').style.display = 'none';
            document.getElementById('booking-step-2').style.display = 'block';
        });
    }
    
    // Continue to step 3
    const continueStep3Btn = document.getElementById('btn-continue-step3');
    if (continueStep3Btn) {
        continueStep3Btn.addEventListener('click', showStep3);
    }
    
    // Form submission
    const finalForm = document.getElementById('booking-final-form');
    if (finalForm) {
        finalForm.addEventListener('submit', handleBookingSubmit);
    }
}

function updateTimeSlots() {
    const mealType = document.getElementById('booking-meal').value;
    const dateInput = document.getElementById('booking-date');
    const timeSelect = document.getElementById('booking-time');
    
    // Get current language for placeholder text
    const lang = document.documentElement.lang || 'it';
    const placeholderText = lang === 'en' ? '-- Select time --' : '-- Seleziona orario --';
    const noTypeText = lang === 'en' ? '-- First select type --' : '-- Prima scegli il tipo --';
    
    if (!mealType) {
        timeSelect.innerHTML = `<option value="">${noTypeText}</option>`;
        timeSelect.disabled = true;
        return;
    }
    
    timeSelect.innerHTML = `<option value="">${placeholderText}</option>`;
    timeSelect.disabled = false;
    
    const dateStr = dateInput?.value || new Date().toISOString().split('T')[0];
    const slots = getTimeSlots(mealType, dateStr);
    
    // Filter out past times if today
    const now = new Date();
    const selectedDate = new Date(dateStr);
    const isToday = selectedDate.toDateString() === now.toDateString();
    
    slots.forEach(time => {
        if (isToday) {
            const [hours, mins] = time.split(':').map(Number);
            const slotTime = new Date(selectedDate);
            slotTime.setHours(hours, mins, 0, 0);
            if (slotTime <= now) return; // Skip past times
        }
        
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });
}

function showFloorPlan() {
    const guests = document.getElementById('booking-guests').value;
    const date = document.getElementById('booking-date').value;
    const mealType = document.getElementById('booking-meal').value;
    const time = document.getElementById('booking-time').value;
    
    if (!guests || !date || !mealType || !time) {
        const siteLang = localStorage.getItem('skalette_lang') || 'it';
        const msg = siteLang === 'en' 
            ? 'Please fill in all fields before continuing.'
            : 'Per favore compila tutti i campi prima di continuare.';
        alert(msg);
        return;
    }
    
    // Save booking data
    bookingData = { guests: parseInt(guests), date, mealType, time };
    
    // Check if 6+ guests - redirect to WhatsApp
    if (parseInt(guests) >= 6) {
        showLargeGroupWhatsApp();
        return;
    }
    
    // Show step 2
    document.getElementById('booking-step-1').style.display = 'none';
    document.getElementById('booking-step-2').style.display = 'block';
    
    // Render floor plan (async to load Firebase reservations)
    renderFloorPlanAsync();
}

// Show WhatsApp message for groups of 6+ people
function showLargeGroupWhatsApp() {
    const siteLang = localStorage.getItem('skalette_lang') || 'it';
    
    const dateLocale = siteLang === 'en' ? 'en-GB' : 'it-IT';
    const dateFormatted = new Date(bookingData.date).toLocaleDateString(dateLocale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
    
    const mealLabels = siteLang === 'en' 
        ? { pranzo: 'Lunch', aperitivo: 'Aperitivo', dopocena: 'After Dinner', cena: 'Dinner' }
        : { pranzo: 'Pranzo', aperitivo: 'Aperitivo', dopocena: 'Dopocena', cena: 'Cena' };
    
    const whatsappMessage = siteLang === 'en'
        ? `Hello! I would like to book for ${bookingData.guests}+ people on ${dateFormatted} at ${bookingData.time} (${mealLabels[bookingData.mealType]}). Thank you!`
        : `Ciao! Vorrei prenotare per ${bookingData.guests}+ persone il ${dateFormatted} alle ${bookingData.time} (${mealLabels[bookingData.mealType]}). Grazie!`;
    
    const title = siteLang === 'en' 
        ? 'Large Group Reservation'
        : 'Prenotazione Gruppi';
    
    const message = siteLang === 'en'
        ? 'For reservations of 6 or more people, please contact us directly via WhatsApp for better assistance.'
        : 'Per prenotazioni di 6 o più persone, ti preghiamo di contattarci direttamente via WhatsApp per una migliore assistenza.';
    
    const buttonText = siteLang === 'en' 
        ? 'Contact us on WhatsApp'
        : 'Contattaci su WhatsApp';
    
    // Hide step 1 and show custom message
    document.getElementById('booking-step-1').style.display = 'none';
    document.getElementById('booking-step-2').style.display = 'none';
    document.getElementById('booking-step-3').style.display = 'none';
    document.getElementById('booking-success').style.display = 'none';
    
    // Create and show WhatsApp prompt
    let whatsappStep = document.getElementById('booking-step-whatsapp');
    if (!whatsappStep) {
        whatsappStep = document.createElement('div');
        whatsappStep.id = 'booking-step-whatsapp';
        whatsappStep.className = 'booking-step';
        document.querySelector('.booking-steps').appendChild(whatsappStep);
    }
    
    whatsappStep.innerHTML = `
        <div class="whatsapp-large-group">
            <div class="whatsapp-icon">👥</div>
            <h3>${title}</h3>
            <p>${message}</p>
            <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}" 
               class="whatsapp-btn" 
               onclick="window.location.href=this.href; return false;">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                ${buttonText}
            </a>
            <button class="btn-back-booking" onclick="backFromWhatsApp()">
                ${siteLang === 'en' ? '← Back' : '← Indietro'}
            </button>
        </div>
    `;
    whatsappStep.style.display = 'block';
}

// Go back from WhatsApp step
function backFromWhatsApp() {
    const whatsappStep = document.getElementById('booking-step-whatsapp');
    if (whatsappStep) whatsappStep.style.display = 'none';
    document.getElementById('booking-step-1').style.display = 'block';
}

// Load reservations from Firebase and render floor plan
async function renderFloorPlanAsync() {
    const container = document.getElementById('floor-plan-container');
    if (!container) return;
    
    // Show loading
    container.innerHTML = '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;color:#c9a961;"><p>Caricamento tavoli...</p></div>';
    
    // Load reservations from Firebase
    try {
        const firebaseReservations = await getFirebaseReservations(bookingData.date);
        renderFloorPlan(firebaseReservations);
    } catch (error) {
        console.error('Error loading reservations:', error);
        renderFloorPlan([]);
    }
}

// Get reservations from Firebase for a specific date
async function getFirebaseReservations(date) {
    try {
        const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/reservations?key=${FIREBASE_API_KEY}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch reservations');
        }
        
        const data = await response.json();
        
        if (!data.documents) return [];
        
        // Parse Firestore format and filter by date
        return data.documents
            .map(doc => {
                const fields = doc.fields;
                return {
                    id: doc.name.split('/').pop(),
                    tableId: fields.tableId?.stringValue || '',
                    date: fields.date?.stringValue || '',
                    time: fields.time?.stringValue || '',
                    mealType: fields.mealType?.stringValue || '',
                    status: fields.status?.stringValue || 'pending',
                    guests: parseInt(fields.guests?.integerValue || '0')
                };
            })
            .filter(res => res.date === date && res.status !== 'rejected');
    } catch (error) {
        console.error('Error fetching Firebase reservations:', error);
        return [];
    }
}

// Durata prenotazioni in minuti
const MEAL_DURATIONS = {
    pranzo: 120,    // 2 ore
    aperitivo: 90,  // 1.5 ore
    dopocena: 90,   // 1.5 ore
    cena: 120       // 2 ore
};

// Converti orario "HH:MM" in minuti dalla mezzanotte
function timeToMinutes(timeStr) {
    const [hours, mins] = timeStr.split(':').map(Number);
    return hours * 60 + mins;
}

// Verifica se due intervalli di tempo si sovrappongono
function timesOverlap(time1, mealType1, time2, mealType2) {
    const start1 = timeToMinutes(time1);
    const end1 = start1 + (MEAL_DURATIONS[mealType1] || 120);
    
    const start2 = timeToMinutes(time2);
    const end2 = start2 + (MEAL_DURATIONS[mealType2] || 120);
    
    // Due intervalli si sovrappongono se: start1 < end2 AND start2 < end1
    return start1 < end2 && start2 < end1;
}

function renderFloorPlan(firebaseReservations = []) {
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
        // Check availability using Firebase reservations with time overlap
        const isTableBooked = firebaseReservations.some(res => 
            res.tableId === table.id && 
            timesOverlap(res.time, res.mealType, time, mealType)
        );
        
        const isAvailable = guests >= table.minGuests && 
                           guests <= table.maxGuests && 
                           !isTableBooked;
        
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
    
    // Update UI - show selected table info
    const tableInfo = document.getElementById('selected-table-info');
    const tableName = document.getElementById('selected-table-name');
    const continueBtn = document.getElementById('btn-continue-step3');
    
    if (tableInfo) tableInfo.style.display = 'block';
    if (tableName) tableName.textContent = table.name;
    if (continueBtn) continueBtn.disabled = false;
    
    bookingData.tableId = table.id;
    bookingData.tableName = table.name;
}

function goToStep(step) {
    document.querySelectorAll('.booking-step').forEach(s => s.style.display = 'none');
    
    // Map step numbers to element IDs
    const stepIds = {
        1: 'booking-step-1',
        2: 'booking-step-2',
        3: 'booking-step-3',
        4: 'booking-success'
    };
    
    const stepEl = document.getElementById(stepIds[step]);
    if (stepEl) {
        stepEl.style.display = 'block';
    }
    
    if (step === 3) {
        updateSummary();
    }
}

function showStep3() {
    if (!selectedTable) {
        const siteLang = localStorage.getItem('skalette_lang') || 'it';
        const msg = siteLang === 'en'
            ? 'Please select a table before continuing.'
            : 'Per favore seleziona un tavolo prima di continuare.';
        alert(msg);
        return;
    }
    goToStep(3);
}

function updateSummary() {
    const siteLang = localStorage.getItem('skalette_lang') || 'it';
    const dateLocale = siteLang === 'en' ? 'en-GB' : 'it-IT';
    
    const dateFormatted = new Date(bookingData.date).toLocaleDateString(dateLocale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
    
    const mealLabels = siteLang === 'en'
        ? { pranzo: '☀️ Lunch', aperitivo: '🍹 Aperitivo', dopocena: '🌙 After Dinner', cena: '🍽️ Dinner' }
        : { pranzo: '☀️ Pranzo', aperitivo: '🍹 Aperitivo', dopocena: '🌙 Dopocena', cena: '🍽️ Cena' };
    
    const guestText = siteLang === 'en'
        ? bookingData.guests + ' guest' + (bookingData.guests > 1 ? 's' : '')
        : bookingData.guests + ' person' + (bookingData.guests > 1 ? 'e' : 'a');
    
    document.getElementById('summary-date').textContent = dateFormatted;
    document.getElementById('summary-time').textContent = bookingData.time + ' - ' + mealLabels[bookingData.mealType];
    document.getElementById('summary-guests').textContent = guestText;
    document.getElementById('summary-table').textContent = bookingData.tableName;
}

function handleBookingSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('booking-name').value;
    const phone = document.getElementById('booking-phone').value;
    const email = document.getElementById('booking-email').value;
    const notes = document.getElementById('booking-notes').value;
    
    // Create reservation ID
    const reservationId = 'RES' + Date.now().toString(36).toUpperCase();
    
    // Reservation data
    const reservationData = {
        name,
        phone,
        email,
        notes,
        tableId: bookingData.tableId,
        tableName: bookingData.tableName,
        date: bookingData.date,
        time: bookingData.time,
        mealType: bookingData.mealType,
        guests: bookingData.guests,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Save to Firebase
    saveToFirebase(reservationData, reservationId);
    
    // Show success
    const bookingIdEl = document.getElementById('booking-id');
    if (bookingIdEl) bookingIdEl.textContent = reservationId;
    goToStep(4);
    
    // Detect site language and browser language/nationality
    const siteLang = localStorage.getItem('skalette_lang') || 'it';
    const browserLang = navigator.language || navigator.userLanguage || 'it';
    const nationality = getCountryFromLanguage(browserLang);
    
    // Open WhatsApp with pre-filled message
    const dateLocale = siteLang === 'en' ? 'en-GB' : 'it-IT';
    const dateFormatted = new Date(bookingData.date).toLocaleDateString(dateLocale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const mealLabels = siteLang === 'en' 
        ? { pranzo: 'Lunch', aperitivo: 'Aperitivo', dopocena: 'After Dinner', cena: 'Dinner' }
        : { pranzo: 'Pranzo', aperitivo: 'Aperitivo', dopocena: 'Dopocena', cena: 'Cena' };
    
    // Message for the restaurant (always includes nationality)
    const message = siteLang === 'en' 
        ? `◇ NEW RESERVATION - Skalette Bistro

◇ Name: ${name}
◇ Phone: ${phone}
◇ Email: ${email}
◇ Guests: ${bookingData.guests}
◇ Date: ${dateFormatted}
◇ Time: ${bookingData.time} (${mealLabels[bookingData.mealType]})
◇ Table: ${bookingData.tableName}

◇ Nationality: ${nationality} (${browserLang})
◇ Notes: ${notes || 'None'}

ID: ${reservation.id}`
        : `◇ NUOVA PRENOTAZIONE - Skalette Bistro

◇ Nome: ${name}
◇ Telefono: ${phone}
◇ Email: ${email}
◇ Persone: ${bookingData.guests}
◇ Data: ${dateFormatted}
◇ Orario: ${bookingData.time} (${mealLabels[bookingData.mealType]})
◇ Tavolo: ${bookingData.tableName}

◇ Nazionalità: ${nationality} (${browserLang})
◇ Note: ${notes || 'Nessuna'}

ID: ${reservation.id}`;

    setTimeout(() => {
        window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    }, 500);
}

function resetBooking() {
    selectedTable = null;
    bookingData = {};
    
    const siteLang = localStorage.getItem('skalette_lang') || 'it';
    const timeOptionText = siteLang === 'en' ? 'Choose meal type first' : 'Prima scegli il tipo';
    
    document.getElementById('booking-guests').value = '';
    document.getElementById('booking-meal').value = '';
    document.getElementById('booking-time').innerHTML = `<option value="">${timeOptionText}</option>`;
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

// ===================================
// COOKIE BANNER
// ===================================
function showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner && !localStorage.getItem('skalette_cookies_accepted')) {
        setTimeout(() => {
            banner.classList.add('show');
        }, 1500);
    }
}

function acceptCookies() {
    localStorage.setItem('skalette_cookies_accepted', 'true');
    localStorage.setItem('skalette_cookies_date', new Date().toISOString());
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.remove('show');
}

function rejectCookies() {
    localStorage.setItem('skalette_cookies_accepted', 'rejected');
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.remove('show');
}

// Initialize cookie banner on load
document.addEventListener('DOMContentLoaded', showCookieBanner);

// ===================================
// SCROLL ANIMATIONS (Intersection Observer)
// ===================================
function initScrollAnimations() {
    // Add animation classes to elements
    const animatableElements = [
        { selector: '.section-header', class: 'fade-in-up' },
        { selector: '.menu-item', class: 'fade-in-up' },
        { selector: '.gallery-item', class: 'scale-in' },
        { selector: '.about-image', class: 'fade-in-left' },
        { selector: '.about-content', class: 'fade-in-right' },
        { selector: '.testimonial-card', class: 'fade-in-up' },
        { selector: '.contact-info', class: 'fade-in-left' },
        { selector: '.hours-card', class: 'fade-in-right' },
        { selector: '.events-content', class: 'fade-in-left' },
        { selector: '.events-form-container', class: 'fade-in-right' },
        { selector: '.footer-brand', class: 'fade-in-up' },
        { selector: '.footer-links', class: 'fade-in-up' },
        { selector: '.footer-newsletter', class: 'fade-in-up' }
    ];
    
    animatableElements.forEach(item => {
        document.querySelectorAll(item.selector).forEach(el => {
            if (!el.classList.contains('fade-in-up') && 
                !el.classList.contains('fade-in-left') && 
                !el.classList.contains('fade-in-right') &&
                !el.classList.contains('scale-in')) {
                el.classList.add(item.class);
            }
        });
    });
    
    // Create observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animating
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
        observer.observe(el);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ===================================
// PRIVATE EVENTS FORM
// ===================================
function initEventsForm() {
    const form = document.getElementById('events-form');
    if (!form) return;
    
    // Set min date to today
    const dateInput = document.getElementById('event-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('event-name').value.trim();
        const phone = document.getElementById('event-phone').value.trim();
        const email = document.getElementById('event-email').value.trim();
        const eventType = document.getElementById('event-type').value;
        const guests = document.getElementById('event-guests').value;
        const date = document.getElementById('event-date').value;
        const notes = document.getElementById('event-notes').value.trim();
        
        // Prepare WhatsApp message
        const currentLang = localStorage.getItem('skalette_language') || 'it';
        
        let message;
        if (currentLang === 'en') {
            message = `🎉 *PRIVATE EVENT REQUEST*\n\n`;
            message += `*Name:* ${name}\n`;
            message += `*Phone:* ${phone}\n`;
            message += `*Email:* ${email}\n`;
            message += `*Event Type:* ${eventType}\n`;
            message += `*Guests:* ${guests}\n`;
            if (date) message += `*Preferred Date:* ${formatDateDisplay(date)}\n`;
            if (notes) message += `*Notes:* ${notes}\n`;
        } else {
            message = `🎉 *RICHIESTA EVENTO PRIVATO*\n\n`;
            message += `*Nome:* ${name}\n`;
            message += `*Telefono:* ${phone}\n`;
            message += `*Email:* ${email}\n`;
            message += `*Tipo Evento:* ${eventType}\n`;
            message += `*Ospiti:* ${guests}\n`;
            if (date) message += `*Data Preferita:* ${formatDateDisplay(date)}\n`;
            if (notes) message += `*Note:* ${notes}\n`;
        }
        
        // Open WhatsApp
        const whatsappUrl = `https://wa.me/393428691832?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Show success feedback
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = currentLang === 'en' ? '✓ Request Sent!' : '✓ Richiesta Inviata!';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            form.reset();
        }, 3000);
    });
}

// Initialize events form
document.addEventListener('DOMContentLoaded', initEventsForm);

// Helper to format date for display
function formatDateDisplay(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const lang = localStorage.getItem('skalette_language') || 'it';
    return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'it-IT', options);
}
