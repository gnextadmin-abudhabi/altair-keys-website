/**
 * Al Tair Althahbi — Dynamic Elements
 * Scroll reveal, counter animation
 */
(function () {
    'use strict';

    // ── Scroll Reveal ──────────────────────────────────────────────────
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // fire once
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
        revealObserver.observe(el);
    });

    // ── Counter Animation ──────────────────────────────────────────────
    // data-count = target integer, data-suffix = optional suffix string
    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var target = parseInt(el.getAttribute('data-count'), 10);
            var suffix = el.getAttribute('data-suffix') || '';
            if (!target || el.dataset.animated) return;
            el.dataset.animated = 'true';
            counterObserver.unobserve(el);

            var duration = 1600;
            var start = performance.now();

            function step(now) {
                var elapsed  = now - start;
                var progress = Math.min(elapsed / duration, 1);
                var eased    = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                el.textContent = Math.floor(target * eased) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(function (el) {
        counterObserver.observe(el);
    });

})();
