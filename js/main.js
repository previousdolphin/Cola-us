/* ==========================================================================
   CoLA - Chronicle of Living Artists
   Main JavaScript - Interactions, Animations, Video Player
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTheme();
    initScrollAnimations();
    initVideoPlayer();
});

/* ==========================================================================
   Navigation
   ========================================================================== */

function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.overlay');
    const navLogo = document.querySelector('.nav-logo');

    if (!menuToggle || !navMenu) return;

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on overlay click
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Close on nav link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            // Let the link navigate normally
            closeMenu();
        });
    });

    // Logo clicks to home
    if (navLogo) {
        navLogo.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    function closeMenu() {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ==========================================================================
   Theme Toggle
   ========================================================================== */

function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    // Check for saved preference
    const savedTheme = localStorage.getItem('cola-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(themeToggle, savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('cola-theme', newTheme);
        updateThemeButton(themeToggle, newTheme);
    });
}

function updateThemeButton(btn, theme) {
    btn.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
}

/* ==========================================================================
   Scroll Animations
   ========================================================================== */

function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in, .timeline-entry');
    
    if (fadeElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Video Player
   ========================================================================== */

let currentVideo = null;

function initVideoPlayer() {
    const videoOverlay = document.querySelector('.video-player-overlay');
    const videoElement = document.querySelector('.video-player-overlay video');
    const closeBtn = document.querySelector('.video-close');
    const videoSlots = document.querySelectorAll('.video-slot:not(.empty)');

    if (!videoOverlay || !videoElement) return;

    // Click on video slot to open player
    videoSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            const videoSrc = slot.dataset.video;
            if (videoSrc) {
                openVideo(videoSrc);
            }
        });
    });

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeVideo);
    }

    // Close on overlay click (outside video)
    videoOverlay.addEventListener('click', (e) => {
        if (e.target === videoOverlay) {
            closeVideo();
        }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoOverlay.classList.contains('active')) {
            closeVideo();
        }
    });

    function openVideo(src) {
        videoElement.src = src;
        videoOverlay.classList.add('active');
        videoElement.play().catch(() => {
            // Autoplay blocked - user interaction needed
        });
        document.body.style.overflow = 'hidden';
    }

    function closeVideo() {
        videoElement.pause();
        videoElement.src = '';
        videoOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ==========================================================================
   Portal Click Handler (for chronicles page)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const eggPortals = document.querySelectorAll('.egg-portal:not(.disabled)');
    
    eggPortals.forEach(portal => {
        portal.addEventListener('click', () => {
            const href = portal.dataset.href;
            if (href) {
                // Add zoom-out effect before navigating
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
});

/* ==========================================================================
   Utility Functions
   ========================================================================== */

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Smooth scroll to element
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}
