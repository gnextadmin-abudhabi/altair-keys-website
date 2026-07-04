/**
 * Al Tair Althahbi Key Cutting — Main JavaScript
 * Header offset, mobile nav, scroll effects, form handling
 */
(function () {
    'use strict';

    // ── Header Offset ─────────────────────────────────────────────────
    // Measures actual rendered header height and sets body padding-top.
    // Runs on load AND on resize to prevent content hiding behind header.
    function fixHeaderOffset() {
        var h = document.getElementById('header');
        if (h) {
            document.body.style.paddingTop = h.offsetHeight + 'px';
        }
    }
    document.addEventListener('DOMContentLoaded', fixHeaderOffset);
    window.addEventListener('resize', fixHeaderOffset);

    // ── Mobile Navigation ──────────────────────────────────────────────
    var navToggle = document.getElementById('navToggle');
    var navList   = document.getElementById('navList');

    if (navToggle && navList) {
        navToggle.addEventListener('click', function () {
            var isOpen = navList.classList.toggle('active');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close on link click
        navList.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navList.classList.remove('active');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('active');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ── Header Scroll Shadow ───────────────────────────────────────────
    var header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.pageYOffset > 60);
        }, { passive: true });
    }

    // ── Smooth Scroll for Anchor Links ────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var headerH = header ? header.offsetHeight : 90;
                var topPos = target.getBoundingClientRect().top + window.pageYOffset - headerH - 20;
                window.scrollTo({ top: topPos, behavior: 'smooth' });
            }
        });
    });

    // ── FAQ Accordion (single open) ────────────────────────────────────
    var faqItems = document.querySelectorAll('.faq__item');
    faqItems.forEach(function (item) {
        item.addEventListener('toggle', function () {
            if (this.open) {
                faqItems.forEach(function (other) {
                    if (other !== item && other.open) other.open = false;
                });
            }
        });
    });

    // ── Contact Form (Formspree AJAX) ──────────────────────────────────
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = this.querySelector('button[type="submit"]');
            if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

            fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: { 'Accept': 'application/json' }
            }).then(function (res) {
                if (res.ok) {
                    contactForm.innerHTML =
                        '<div class="form-success">' +
                        '<div class="form-success__check">✅</div>' +
                        '<h3>Message Sent!</h3>' +
                        '<p>Thank you! We\'ll be in touch shortly.<br>For urgent help call <a href="tel:+971547542722">+971 54 754 2722</a>.</p>' +
                        '</div>';
                } else {
                    if (btn) { btn.textContent = 'Send Message'; btn.disabled = false; }
                    alert('Sorry, there was a problem. Please call us directly at +971 54 754 2722');
                }
            }).catch(function () {
                if (btn) { btn.textContent = 'Send Message'; btn.disabled = false; }
                alert('Network error. Please call us at +971 54 754 2722');
            });
        });
    }

    // ── WhatsApp Float Button (mobile only) ────────────────────────────
    (function addWhatsAppFloat() {
        if (window.innerWidth > 768) return;
        var btn = document.createElement('a');
        btn.href = 'https://wa.me/971547542722';
        btn.target = '_blank';
        btn.rel = 'noopener';
        btn.setAttribute('aria-label', 'Chat on WhatsApp');
        btn.innerHTML = '💬';
        btn.style.cssText = [
            'position:fixed', 'bottom:24px', 'right:20px', 'z-index:9999',
            'width:56px', 'height:56px', 'background:#25D366', 'color:white',
            'border-radius:50%', 'display:flex', 'align-items:center', 'justify-content:center',
            'font-size:1.5rem', 'text-decoration:none', 'box-shadow:0 4px 16px rgba(37,211,102,0.42)'
        ].join(';');
        document.body.appendChild(btn);
    })();

})();
