/**
 * Al Tair Althahbi — Dynamic Elements
 * Scroll reveal, counter animation, parallax
 */
(function(){
'use strict';

// --- Scroll Reveal ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- Counter Animation ---
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'));
            if (!target || el.dataset.animated) return;
            el.dataset.animated = 'true';
            
            const duration = 1500;
            const start = performance.now();
            const step = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(target * eased) + (target === 16 ? 'h' : target === 8 ? '+' : target === 365 ? '' : '+');
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-bar__number[data-count]').forEach(el => counterObserver.observe(el));

// --- Nav active state on scroll ---
const sections = document.querySelectorAll('section[id], footer');
const navLinks = document.querySelectorAll('.nav__link');
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            if (window.scrollY >= top) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '/') {
                if (current === 'hero' || current === 'services' || current === '' || !current) link.classList.add('active');
            } else if (href && href.includes('#' + current)) {
                link.classList.add('active');
            }
        });
    }, 100);
}, { passive: true });

})();
