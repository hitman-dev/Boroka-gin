/* =============================================
   BORÓKA GIN — THE BLUE REVOLUTION
   JavaScript — Smooth Scroll-driven Animations
   ============================================= */

(() => {
    'use strict';

    /* ---------- PRELOADER ---------- */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('done');
            document.body.style.overflow = '';
            initHeroAnimations();
        }, 2800);
    });
    document.body.style.overflow = 'hidden';

    /* ---------- CUSTOM CURSOR ---------- */
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && dot && ring) {
        let mx = 0, my = 0, rx = 0, ry = 0;

        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top = my + 'px';
        });

        (function movRing() {
            rx += (mx - rx) * 0.1;
            ry += (my - ry) * 0.1;
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
            requestAnimationFrame(movRing);
        })();

        document.querySelectorAll('a, button, .recipe-card, .exp-item, .story-card, .botanical').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
        });
    }

    /* ---------- NAVBAR ---------- */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    // Scroll state
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    function handleScroll() {
        const sy = window.scrollY;
        // Navbar
        navbar.classList.toggle('scrolled', sy > 50);
        // Active link
        updateActiveNav(sy);
        // Rolling bottle
        updateRollingBottle(sy);
        // Parallax BG
        updateParallax(sy);
    }

    // Hamburger
    hamburger.addEventListener('click', () => {
        const isActive = hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* ---------- ACTIVE NAV LINK ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav(sy) {
        const offset = 250;
        sections.forEach(sec => {
            const top = sec.offsetTop - offset;
            const bottom = top + sec.offsetHeight;
            const id = sec.getAttribute('id');
            if (sy >= top && sy < bottom) {
                navLinks.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === '#' + id);
                });
            }
        });
    }

    /* ---------- SMOOTH SCROLL ---------- */
    document.addEventListener('click', function(e) {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        e.stopPropagation();

        // Force body scrollable
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        // Close mobile menu if open
        if (mobileMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        }

        // Tiny delay to let overflow change take effect
        setTimeout(function() {
            const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, 10);
    }, true); // Use capture phase to fire FIRST

    /* ---------- HERO INTRO ANIMATIONS ---------- */
    function initHeroAnimations() {
        document.querySelectorAll('.anim-fade').forEach(el => {
            const delay = parseFloat(el.dataset.delay || 0) * 1000;
            setTimeout(() => el.classList.add('in'), delay);
        });
        // Counter animation for stats
        document.querySelectorAll('.stat-val[data-count]').forEach(el => {
            const end = parseInt(el.dataset.count);
            animateCount(el, 0, end, 1400);
        });
    }

    function animateCount(el, start, end, duration) {
        const t0 = performance.now();
        function tick(now) {
            const p = Math.min((now - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(start + (end - start) * eased);
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    /* ---------- HERO BOTTLE MOUSE PARALLAX ---------- */
    const heroImg = document.getElementById('heroBottleImg');
    const hero = document.querySelector('.hero');

    if (hero && heroImg) {
        hero.addEventListener('mousemove', e => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            heroImg.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 14}px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
        });
        hero.addEventListener('mouseleave', () => {
            heroImg.style.transition = 'transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)';
            heroImg.style.transform = '';
            setTimeout(() => { heroImg.style.transition = ''; }, 600);
        });
    }

    /* ---------- SCROLL REVEAL (IntersectionObserver) ---------- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.dataset.delay || 0) * 1000;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ---------- BIG BOTTLE SHOWCASE ANIMATION ---------- */
    const bottleVisual = document.getElementById('bottleShowcaseVisual');
    if (bottleVisual) {
        const bottleObs = new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (en.isIntersecting) {
                    bottleVisual.classList.add('animate');
                    bottleObs.unobserve(en.target);
                }
            });
        }, { threshold: 0.25 });
        bottleObs.observe(bottleVisual);
    }

    /* ---------- TASTE BAR ANIMATION ---------- */
    const tasteObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const w = fill.dataset.w;
                fill.style.setProperty('--tw', w + '%');
                fill.classList.add('animated');
                tasteObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.taste-fill').forEach(f => tasteObserver.observe(f));

    /* ---------- ROLLING BOTTLE (Scroll-driven) ---------- */
    const rollingBottle = document.getElementById('rollingBottleFixed');
    const docHeight = () => document.documentElement.scrollHeight - window.innerHeight;

    function updateRollingBottle(sy) {
        if (!rollingBottle) return;
        const total = docHeight();
        if (total <= 0) return;

        const progress = sy / total; // 0 → 1
        const show = sy > 300 && progress < 0.95;
        rollingBottle.classList.toggle('visible', show);

        if (show) {
            const viewW = window.innerWidth;
            const bottleW = rollingBottle.offsetWidth;
            // Position: roll from left to right across the viewport
            const x = progress * (viewW - bottleW);
            // Rotate based on scroll — 6 full rotations for a nice rolling feel
            const rotation = progress * 360 * 6;
            rollingBottle.style.left = x + 'px';
            const rbImg = document.getElementById('rbImg');
            if (rbImg) rbImg.style.transform = `rotate(${rotation}deg)`;
        }
    }

    /* ---------- PARALLAX BACKGROUND ---------- */
    const parallaxBg = document.querySelector('.parallax-bg');

    function updateParallax(sy) {
        if (!parallaxBg) return;
        const section = parallaxBg.closest('.parallax-break');
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const visible = rect.top < window.innerHeight && rect.bottom > 0;
        if (visible) {
            const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            parallaxBg.style.transform = `translateY(${(progress - 0.5) * -60}px) scale(1.05)`;
        }
    }

    /* ---------- GALLERY LIGHTBOX ---------- */
    document.querySelectorAll('.exp-item').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (!img) return;

            const overlay = document.createElement('div');
            Object.assign(overlay.style, {
                position: 'fixed', inset: '0', zIndex: '9998',
                background: 'rgba(6,13,24,0.95)',
                backdropFilter: 'blur(12px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: '0', transition: 'opacity 0.5s cubic-bezier(0.645,0.045,0.355,1)',
                cursor: 'pointer'
            });

            const fullImg = document.createElement('img');
            fullImg.src = img.src;
            fullImg.alt = img.alt;
            Object.assign(fullImg.style, {
                maxWidth: '92vw', maxHeight: '90vh', objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
                transform: 'scale(0.92)', transition: 'transform 0.5s cubic-bezier(0.645,0.045,0.355,1)'
            });

            overlay.appendChild(fullImg);
            document.body.appendChild(overlay);

            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
                fullImg.style.transform = 'scale(1)';
            });

            const close = () => {
                overlay.style.opacity = '0';
                fullImg.style.transform = 'scale(0.92)';
                setTimeout(() => overlay.remove(), 500);
            };
            overlay.addEventListener('click', close);
            document.addEventListener('keydown', function esc(e) {
                if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
            });
        });
    });

    /* ---------- RECIPE CARD TILT ---------- */
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.recipe-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                card.style.transform = `perspective(800px) rotateX(${(y - 0.5) * 4}deg) rotateY(${(x - 0.5) * -4}deg) translateY(-6px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'all 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)';
                card.style.transform = '';
                setTimeout(() => { card.style.transition = ''; }, 600);
            });
        });
    }

    /* ---------- NEWSLETTER ---------- */
    const form = document.getElementById('newsletterForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const input = form.querySelector('input');
            const btn = form.querySelector('button');
            if (input.value.trim() && input.value.includes('@')) {
                btn.textContent = 'Subscribed!';
                btn.style.background = 'linear-gradient(135deg, #2dd4bf, #22d3ee)';
                input.value = '';
                setTimeout(() => {
                    btn.textContent = 'Subscribe';
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

    /* ---------- BOTANICAL HOVER SPIN ---------- */
    document.querySelectorAll('.botanical').forEach(bot => {
        const svg = bot.querySelector('svg');
        if (!svg) return;
        bot.addEventListener('mouseenter', () => {
            svg.style.transition = 'transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)';
            svg.style.transform = 'rotate(180deg) scale(1.1)';
        });
        bot.addEventListener('mouseleave', () => {
            svg.style.transform = 'rotate(0) scale(1)';
        });
    });

    /* ---------- PARALLAX QUOTE TYPING ---------- */
    const quoteEl = document.querySelector('.parallax-text h2');
    if (quoteEl) {
        const full = quoteEl.textContent;
        let typed = false;
        const qObs = new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (en.isIntersecting && !typed) {
                    typed = true;
                    quoteEl.textContent = '';
                    let i = 0;
                    const iv = setInterval(() => {
                        quoteEl.textContent += full[i];
                        i++;
                        if (i >= full.length) clearInterval(iv);
                    }, 30);
                    qObs.unobserve(en.target);
                }
            });
        }, { threshold: 0.3 });
        qObs.observe(quoteEl);
    }

    /* ---------- BUTTON RIPPLE ---------- */
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            Object.assign(ripple.style, {
                position: 'absolute', borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                width: '80px', height: '80px',
                left: (e.clientX - rect.left - 40) + 'px',
                top: (e.clientY - rect.top - 40) + 'px',
                transform: 'scale(0)', pointerEvents: 'none',
                animation: 'btnRipple 0.6s ease-out forwards'
            });
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Inject ripple keyframes
    const s = document.createElement('style');
    s.textContent = '@keyframes btnRipple { to { transform: scale(4); opacity: 0; } }';
    document.head.appendChild(s);

    // Console branding
    console.log('%c BORÓKA — The Blue Revolution ', 'color: #5ecef5; font-size: 16px; font-weight: bold; background: #060d18; padding: 8px 16px; border-radius: 6px;');

})();
