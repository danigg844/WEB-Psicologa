document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Scroll Animations (Intersection Observer) ---
    const fadeElements = document.querySelectorAll('.fade-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    });

    fadeElements.forEach(el => observer.observe(el));

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile menu toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    const closeMenu = () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        const isOpen = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Cerrar con Escape y devolver el foco al botón
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
            navToggle.focus();
        }
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: position, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            }
        });
    });

    // --- Cursor glow effect (desktop only) ---
    const cursorGlow = document.getElementById('cursor-glow');

    if (!prefersReducedMotion && window.matchMedia('(min-width: 1024px)').matches && cursorGlow) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorGlow.classList.add('active');
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('active');
        });

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(animateGlow);
        }

        animateGlow();
    }

    // --- Text highlight animation on scroll ---
    const highlights = document.querySelectorAll('.text-highlight');

    const highlightObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.setProperty('--highlight-width', '100%');
            }
        });
    }, { threshold: 0.5 });

    highlights.forEach(el => highlightObserver.observe(el));

    // --- Service cards tilt effect (desktop) ---
    if (!prefersReducedMotion && window.matchMedia('(min-width: 1024px)').matches) {
        document.querySelectorAll('.service-card-inner').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // --- Animated counter for stats ---
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const duration = 2000;
                const start = performance.now();

                function easeOutQuart(t) {
                    return 1 - Math.pow(1 - t, 4);
                }

                function updateCounter(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const value = Math.round(easeOutQuart(progress) * target);

                    el.textContent = value;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target;
                    }
                }

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // --- Workshop cards hover interaction ---
    document.querySelectorAll('.workshop-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const badge = card.querySelector('.workshop-card-badge');
            if (badge) {
                badge.style.transform = 'scale(1.05)';
                badge.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }
        });

        card.addEventListener('mouseleave', () => {
            const badge = card.querySelector('.workshop-card-badge');
            if (badge) {
                badge.style.transform = '';
            }
        });
    });

    // --- Specialty tags interactive ripple ---
    document.querySelectorAll('.specialty-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            tag.style.transform = 'scale(0.95)';
            setTimeout(() => {
                tag.style.transform = '';
            }, 150);
        });
    });

    // --- Contact form (Netlify Forms submission) ---
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('.btn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = 'Enviando...';
            btn.disabled = true;

            const formData = new FormData(contactForm);

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(response => {
                if (response.ok) {
                    btn.innerHTML = 'Mensaje enviado <span style="margin-left:4px">&#10003;</span>';
                    btn.style.background = 'linear-gradient(135deg, #6EC6CA, #4BAAAF)';
                    contactForm.reset();
                } else {
                    btn.innerHTML = 'Error al enviar. Inténtalo de nuevo.';
                    btn.style.background = '#D4874D';
                }
            })
            .catch(() => {
                btn.innerHTML = 'Error al enviar. Inténtalo de nuevo.';
                btn.style.background = '#D4874D';
            })
            .finally(() => {
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            });
        });
    }

    // --- Magnetic effect on CTA button ---
    if (!prefersReducedMotion && window.matchMedia('(min-width: 1024px)').matches) {
        document.querySelectorAll('.nav-link--cta, .btn-primary').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                setTimeout(() => {
                    btn.style.transition = '';
                }, 500);
            });
        });
    }

    // --- Active nav link tracking ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        rootMargin: '-40% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => navObserver.observe(section));
});
