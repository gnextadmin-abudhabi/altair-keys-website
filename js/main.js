/**
 * Al Tair Althahbi Key Cutting — Main JavaScript
 * Mobile navigation, smooth scroll, header effects, FAQ, form handling
 */

(function () {
    'use strict';

    // --- Mobile Navigation Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navList = document.getElementById('navList');
    const header = document.getElementById('header');

    if (navToggle && navList) {
        navToggle.addEventListener('click', function () {
            const isOpen = navList.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close nav when clicking a link
        navList.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navList.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close nav when clicking outside
        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Header Scroll Effect ---
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', function () {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 90;
                const topbarHeight = 44;
                const offset = headerHeight + topbarHeight + 20;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- FAQ Accordion (close others when one opens) ---
    const faqItems = document.querySelectorAll('.faq__item');
    faqItems.forEach(function (item) {
        item.addEventListener('toggle', function () {
            if (this.open) {
                faqItems.forEach(function (other) {
                    if (other !== item && other.open) {
                        other.open = false;
                    }
                });
            }
        });
    });

    // --- Contact Form Handler ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            // Formspree handles submission — we just add a loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
            }
            // Let the form submit naturally to Formspree
        });
    }

    // --- Active Nav Link Based on Current Page ---
    (function setActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === '/')) {
                link.classList.add('active');
            }
        });
    })();

    // --- Lazy Load Google Maps iframe (performance) ---
    const mapIframe = document.querySelector('.contact-map__embed iframe');
    if (mapIframe && !mapIframe.hasAttribute('data-loaded')) {
        // Iframe already has loading="lazy" — no additional action needed
        // This observer approach can be used for heavier embeds
        mapIframe.setAttribute('data-loaded', 'true');
    }

    // --- WhatsApp floating button for mobile ---
    (function addWhatsAppFloat() {
        if (window.innerWidth > 768) return; // Desktop doesn't need it (top bar is enough)
        
        const floatBtn = document.createElement('a');
        floatBtn.href = 'https://wa.me/971547542722';
        floatBtn.target = '_blank';
        floatBtn.rel = 'noopener';
        floatBtn.className = 'whatsapp-float';
        floatBtn.setAttribute('aria-label', 'Chat on WhatsApp');
        floatBtn.innerHTML = '💬';
        floatBtn.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 20px;
            z-index: 9999;
            width: 56px;
            height: 56px;
            background: #25D366;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            text-decoration: none;
            box-shadow: 0 4px 16px rgba(37,211,102,0.4);
            transition: transform 0.3s ease;
            animation: floatPulse 2s infinite;
        `;
        
        // Add pulse animation if not already defined
        if (!document.getElementById('float-style')) {
            const style = document.createElement('style');
            style.id = 'float-style';
            style.textContent = `
                @keyframes floatPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(floatBtn);
    })();

    // --- Call tracking — mark phone clicks for analytics ---
    document.querySelectorAll('a[href^="tel:"]').forEach(function (telLink) {
        telLink.addEventListener('click', function () {
            // Phone number click — could fire a GA event or pixel
            // console.log('Phone call clicked:', this.getAttribute('href'));
        });
    });

})();
