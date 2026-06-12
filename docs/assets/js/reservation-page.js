(function () {
  'use strict';

console.log({
  nlBtn: document.querySelector('.nl-btn'),
  tslider: document.querySelector('.tslider'),
  lightbox: document.getElementById('lightbox'),
  statNum: document.querySelector('.stat-num')
});
/* ============================================================
   RESERVATION PAGE SCRIPT (reuses same helpers as index)
   ============================================================ */

/* ============================================================
   MAIN JAVASCRIPT
   All interactive features for Danah Travel & Tourism
============================================================ */

/* ---- 1. PRELOADER ---------------------------------------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('done');
  }, 2400);
});

/* ---- 2. CUSTOM CURSOR ------------------------------------ */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

document.addEventListener('mousemove', e => {
  cursorDot.style.left  = e.clientX + 'px';
  cursorDot.style.top   = e.clientY + 'px';
  // Ring follows with a slight lag via CSS transition
  cursorRing.style.left = e.clientX + 'px';
  cursorRing.style.top  = e.clientY + 'px';
});

// Grow effect on interactive elements
document.querySelectorAll('a, button, [role="button"], .gal-item, .ttab, .faq-q, .s-btn, .s-dot').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.classList.add('grow');
    cursorRing.classList.add('grow');
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('grow');
    cursorRing.classList.remove('grow');
  });
});

/* ---- 3. THEME TOGGLE ------------------------------------- */
const htmlEl     = document.documentElement;
const themeBtn   = document.getElementById('theme-toggle');
const themeIcon  = document.getElementById('theme-icon');
let isDark = false;

themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  htmlEl.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  themeBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
});

/* ---- 4. NAVIGATION SCROLL + BACK-TO-TOP + ACTIVE LINK --- */
const navEl  = document.getElementById('nav');
const bttBtn = document.getElementById('btt');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Sticky nav style
  navEl.classList.toggle('scrolled', scrollY > 50);

  // Back-to-top visibility
  bttBtn.classList.toggle('show', scrollY > 400);

  // Active nav link highlight
  let current = '';
  document.querySelectorAll('section[id]').forEach(sec => {
    if (scrollY >= sec.offsetTop - 110) current = sec.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

bttBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- 5. HAMBURGER / MOBILE NAV -------------------------- */
const hamburgerBtn = document.getElementById('hamburger');
const mobileNavEl  = document.getElementById('mobile-nav');

hamburgerBtn.addEventListener('click', () => {
  const isOpen = hamburgerBtn.classList.toggle('open');
  mobileNavEl.classList.toggle('open', isOpen);
  hamburgerBtn.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile nav when a link is clicked
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburgerBtn.classList.remove('open');
    mobileNavEl.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ---- 6. SCROLL REVEAL (IntersectionObserver) ------------ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ---- 7. ANIMATED STATS COUNTER -------------------------- */
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el  = entry.target;
    const to  = parseInt(el.dataset.to);
    const sfx = el.dataset.sfx || '';
    let cur   = 0;
    const dur = 1800; // ms
    const fps = 60;
    const step = to / (dur / (1000 / fps));

    const timer = setInterval(() => {
      cur += step;
      if (cur >= to) {
        cur = to;
        clearInterval(timer);
      }
      // Format output (K+ special case)
      if (sfx === 'K+') {
        el.textContent = cur >= 1000
          ? Math.round(cur / 1000) + 'K+'
          : Math.round(cur) + '+';
      } else {
        el.textContent = Math.round(cur) + sfx;
      }
    }, 1000 / fps);

    statsObserver.unobserve(el);
  });
}, { threshold: 0.5 });

const statNumbers = document.querySelectorAll('.stat-num[data-to]');
if (statNumbers.length) {
  statNumbers.forEach(el => statsObserver.observe(el));
}

/* ---- 8. TRIP TABS (Booking Form) ------------------------ */
const ttabElements = document.querySelectorAll('.ttab');
if (ttabElements.length) {
  ttabElements.forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ttab').forEach(t => t.classList.remove('on'));
    tab.classList.add('on');
    // Show return date field only for Round Trip
    const returnCol = document.getElementById('return-col');
	if (returnCol) {
	  returnCol.style.display = tab.dataset.tab === 'round' ? '' : 'none';
	}
  });
});
}

/* ---- 9. BOOKING FORM VALIDATION ------------------------- */
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', e => {
  e.preventDefault();
  const from = document.getElementById('bf-from');
  const to   = document.getElementById('bf-to');
  const dep  = document.getElementById('bf-dep');
  const msg  = document.getElementById('book-msg');
  let valid  = true;

  [from, to, dep].forEach(field => {
    const ok = field.value.trim().length > 0;
    field.classList.toggle('ok',  ok);
    field.classList.toggle('bad', !ok);
    if (!ok) valid = false;
  });

  if (valid) {
    msg.className = 'form-msg ok';
    msg.innerHTML = '<i class="fas fa-check-circle me-2"></i>Search request submitted! Our team will contact you with the best available fares shortly.';
  } else {
    msg.className = 'form-msg bad';
    msg.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>Please fill in all required fields before searching.';
  }
  msg.style.display = 'block';
});
}

/* ---- 10. IMAGE LIGHTBOX (only if gallery exists) ---- */
const lightboxEl = document.getElementById('lightbox');
if (lightboxEl) {
  const galleryItems = Array.from(document.querySelectorAll('.gal-item img'));
  if (galleryItems.length) {
    const lbSrcs = galleryItems.map(img => ({ src: img.src, alt: img.alt }));
    const lbImg = document.getElementById('lb-img');
    let lbIdx = 0;

    function openLightbox(idx) {
      lbIdx = idx;
      lbImg.src = lbSrcs[idx].src;
      lbImg.alt = lbSrcs[idx].alt;
      lightboxEl.classList.add('on');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightboxEl.classList.remove('on');
      document.body.style.overflow = '';
    }

    const lbClose = document.getElementById('lb-close');
    const lbPrev = document.getElementById('lb-prev');
    const lbNext = document.getElementById('lb-next');
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', () => {
      lbIdx = (lbIdx - 1 + lbSrcs.length) % lbSrcs.length;
      lbImg.src = lbSrcs[lbIdx].src;
      lbImg.alt = lbSrcs[lbIdx].alt;
    });
    if (lbNext) lbNext.addEventListener('click', () => {
      lbIdx = (lbIdx + 1) % lbSrcs.length;
      lbImg.src = lbSrcs[lbIdx].src;
      lbImg.alt = lbSrcs[lbIdx].alt;
    });
    lightboxEl.addEventListener('click', e => {
      if (e.target === lightboxEl) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (!lightboxEl.classList.contains('on')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && lbPrev) lbPrev.click();
      if (e.key === 'ArrowRight' && lbNext) lbNext.click();
    });

    // Attach click to gallery items
    const galItems = document.querySelectorAll('.gal-item');
    galItems.forEach((item, idx) => {
      item.addEventListener('click', () => openLightbox(idx));
    });
  }
}

/* ---- 11. TESTIMONIAL SLIDER (only if elements exist) ---- */
const tTrack = document.querySelector('.ttrack');
const tDots = document.querySelectorAll('.s-dot');
const tSlides = document.querySelectorAll('.tslide');
const tsliderEl = document.querySelector('.tslider');
const prevButton = document.getElementById('t-prev');
const nextButton = document.getElementById('t-next');

// Only run slider code if all required elements are present
if (tTrack && tDots.length && tSlides.length && tsliderEl && prevButton && nextButton) {
  let tIdx = 0;
  let tSlideCount = tSlides.length;

  function goToSlide(idx) {
    tIdx = ((idx % tSlideCount) + tSlideCount) % tSlideCount;
    tTrack.style.transform = `translateX(-${tIdx * 100}%)`;
    tDots.forEach((dot, i) => dot.classList.toggle('on', i === tIdx));
  }

  prevButton.addEventListener('click', () => goToSlide(tIdx - 1));
  nextButton.addEventListener('click', () => goToSlide(tIdx + 1));
  tDots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

  let tAutoPlay = setInterval(() => goToSlide(tIdx + 1), 5000);
  tsliderEl.addEventListener('mouseenter', () => clearInterval(tAutoPlay));
  tsliderEl.addEventListener('mouseleave', () => {
    tAutoPlay = setInterval(() => goToSlide(tIdx + 1), 5000);
  });
}

/* ---- 12. FAQ ACCORDION ---------------------------------- */
const faqQuestions = document.querySelectorAll('.faq-q');
if (faqQuestions.length) {
  faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const faqEl   = question.parentElement;
    const answer  = faqEl.querySelector('.faq-a');
    const isOpen  = faqEl.classList.contains('open');

    // Close all open FAQs
    document.querySelectorAll('.faq.open').forEach(openFaq => {
      openFaq.classList.remove('open');
      openFaq.querySelector('.faq-a').style.maxHeight = '0';
    });

    // Toggle the clicked one
    if (!isOpen) {
      faqEl.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});
}

/* ---- 13. CONTACT FORM ----------------------------------- */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const required = e.target.querySelectorAll('[required]');
  let valid = true;

  required.forEach(field => {
    const ok = field.value.trim().length > 0;
    if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
      field.classList.toggle('ok',  ok);
      field.classList.toggle('bad', !ok);
    }
    if (!ok) valid = false;
  });

  const msg = document.getElementById('contact-msg');
  if (valid) {
    msg.className = 'form-msg ok';
    msg.innerHTML = '<i class="fas fa-check-circle me-2"></i>Message sent! We\'ll respond within 2–4 hours during business hours.';
    e.target.reset();
    e.target.querySelectorAll('.form-control').forEach(f => f.classList.remove('ok', 'bad'));
  } else {
    msg.className = 'form-msg bad';
    msg.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>Please complete all required fields before sending.';
  }
  msg.style.display = 'block';
});
}
/* ---- 14. RESERVATION FORM ------------------------------- */
const resForm = document.getElementById('reservation-form');
if (resForm) {
  resForm.addEventListener('submit', e => {
    e.preventDefault();
    const required = e.target.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      const ok = field.value.trim().length > 0;
      if (field.tagName === 'INPUT') {
        field.classList.toggle('ok',  ok);
        field.classList.toggle('bad', !ok);
      }
      if (!ok) valid = false;
    });

    const msg = document.getElementById('res-msg');
    if (valid) {
      msg.className = 'form-msg ok';
      msg.innerHTML = '<i class="fas fa-calendar-check me-2"></i>Reservation submitted! A Danah consultant will call you within 2 hours to confirm availability and pricing.';
      e.target.reset();
      e.target.querySelectorAll('.form-control').forEach(f => f.classList.remove('ok', 'bad'));
    } else {
      msg.className = 'form-msg bad';
      msg.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>Please complete all required fields.';
    }
    msg.style.display = 'block';
  });
}

/* ---- 15. NEWSLETTER FORM -------------------------------- */
const nlBtn = document.querySelector('.nl-btn');
if (nlBtn) {
  nlBtn.addEventListener('click', () => {
    const input = document.querySelector('.nl-input');
    if (!input) return;
    const email = input.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (isValid) {
      input.value = '';
      input.style.borderColor = '';
      const orig = nlBtn.textContent;
      nlBtn.textContent = '✓ Subscribed!';
      nlBtn.style.background = '#10B981';
      setTimeout(() => {
        nlBtn.textContent = orig;
        nlBtn.style.background = '';
      }, 3000);
    } else {
      input.style.borderColor = '#EF4444';
      input.placeholder = 'Please enter a valid email…';
      setTimeout(() => {
        input.style.borderColor = '';
        input.placeholder = 'Enter your email address…';
      }, 3000);
    }
  });
}

/* ---- 16. HERO CANVAS — PARTICLE CONSTELLATION ----------- */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x     = Math.random() * W;
      this.y     = initial ? Math.random() * H : Math.random() * H;
      this.r     = Math.random() * 1.8 + 0.4;
      this.vx    = (Math.random() - 0.5) * 0.35;
      this.vy    = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.55 + 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(147,197,253,${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 130 }, () => new Particle());
  }

  function drawConnections() {
    const len  = particles.length;
    const maxD = 110;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < maxD) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(147,197,253,${0.18 * (1 - d / maxD)})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  init();
  animate();
  window.addEventListener('resize', () => { resize(); });
})();

/* ---- 17. PARALLAX CTA BAND ------------------------------ */
const ctaBand = document.getElementById('cta-band');
if (ctaBand) {
  window.addEventListener('scroll', () => {
    const rect = ctaBand.getBoundingClientRect();
    const offset = -rect.top * 0.3;
    ctaBand.style.backgroundPositionY = `calc(50% + ${offset}px)`;
  });
}

/* ---- 18. SMOOTH-SCROLL all anchor hrefs ----------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- 19. LANGUAGE SWITCHER -------------------------------- */
// Attach to 'window' so inline onclick="" can access it
window.switchLang = function(lang) {
  const enOrb = document.getElementById('lang-en');
  const arOrb = document.getElementById('lang-ar');

  // Visual active state (with safety null-checks added just in case)
  if (lang === 'en') {
    if (enOrb) enOrb.style.borderColor = 'var(--blue)';
    if (arOrb) arOrb.style.borderColor = 'transparent';
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'ltr');
    localStorage.setItem('danah-lang', 'en');
  } else if (lang === 'ar') {
    if (arOrb) arOrb.style.borderColor = 'var(--blue)';
    if (enOrb) enOrb.style.borderColor = 'transparent';
    document.documentElement.setAttribute('lang', 'ar');
    document.documentElement.setAttribute('dir', 'rtl');
    localStorage.setItem('danah-lang', 'ar');
  }

  // Optional: dispatch event for i18n system
  window.dispatchEvent(new CustomEvent('danah-lang-change', { detail: { lang } }));
};

// Initialise language from localStorage on page load
(function initLang() {
  const saved = localStorage.getItem('danah-lang') || 'en';
  window.switchLang(saved); // Call the global version
})();

/* ---- 20. SHOPPING CART ----------------------------------- */
// Attach to 'window' so inline onclick="" can access it
window.toggleCart = function() {
  let cartPanel = document.getElementById('cart-dropdown');

  if (!cartPanel) {
    cartPanel = document.createElement('div');
    cartPanel.id = 'cart-dropdown';
    cartPanel.style.cssText = `
      position: absolute; top: 100%; right: 0;
      width: 320px; background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px; padding: 20px;
      box-shadow: var(--shadow-lg);
      z-index: 999; margin-top: 8px;
      font-family: var(--ff-body);
    `;
    cartPanel.innerHTML = `
      <div style="font-weight:700; font-size:.9rem; color:var(--text-h); margin-bottom:12px;">
        <i class="fas fa-shopping-cart me-2"></i>Shopping Cart
      </div>
      <div id="cart-items" style="font-size:.82rem; color:var(--text-muted);">
        <p style="text-align:center; padding:20px 0;">Your cart is empty.</p>
      </div>
      <button onclick="document.getElementById('cart-dropdown').remove()"
        style="display:block; width:100%; margin-top:12px; padding:8px; background:var(--bg-2); border:1px solid var(--border); border-radius:8px; font-size:.8rem; cursor:pointer; color:var(--text-p);">
        Close
      </button>
    `;
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) cartIcon.appendChild(cartPanel);
  } else {
    cartPanel.remove();
  }
};

// Update cart count (call this when items are added/removed)
function updateCartCount(count) {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : count;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

// Show cart icon on store pages, hide elsewhere
function showCartIcon(show = true) {
  const cartIcon = document.getElementById('cart-icon');
  if (cartIcon) {
    cartIcon.style.display = show ? 'block' : 'none';
  }
}

// Example: call showCartIcon(true) on store.html, showCartIcon(false) on index.html
showCartIcon(false); // hide on homepage by default

/* ---- 21. USER AUTH --------------------------------------- */
// Simulated auth state (replace with real auth later)
const DanahAuth = {
  isLoggedIn: function() {
    return localStorage.getItem('danah-user') !== null;
  },
  getUser: function() {
    const raw = localStorage.getItem('danah-user');
    return raw ? JSON.parse(raw) : null;
  },
  login: function(user) {
    localStorage.setItem('danah-user', JSON.stringify(user));
    updateUserUI();
  },
  logout: function() {
    localStorage.removeItem('danah-user');
    updateUserUI();
  }
};

// Update navbar UI based on login state
function updateUserUI() {
  const profileSection = document.getElementById('user-profile-section');
  const displayName    = document.getElementById('user-display-name');

  if (!profileSection || !displayName) return;

  if (DanahAuth.isLoggedIn()) {
    const user = DanahAuth.getUser();
    displayName.textContent = user?.name || 'Client';
	
// Explicitly toggle class state and apply override styling layout
    profileSection.classList.remove('user-status-hidden');
    profileSection.style.setProperty('display', 'flex', 'important');
  } else {
    displayName.textContent = 'Client';
    profileSection.classList.add('user-status-hidden');
    profileSection.style.setProperty('display', 'none', 'important');
  }
}

// Logout handler (attached to the Logout button)
function handleLogout() {
  if (confirm('Are you sure you want to log out?')) {
    DanahAuth.logout();
    // Optional: redirect to homepage
    window.location.href = 'index.html';
  }
}

// Simulate a login (for testing — call from browser console)
function simulateLogin(name, email) {
  DanahAuth.login({
    name: name || 'Sarah Al-Rashid',
    email: email || 'sarah@danahtravel.sa',
    avatar: 'media/images/profile/avatar-1.png'
  });
}

// EXPOSE TO GLOBAL SCOPE FOR HTML HOOKS AND DEV CONSOLE
window.handleLogout = handleLogout;
window.simulateLogin = simulateLogin;

// Initialise UI on page load
updateUserUI();

/* ---- 22. CART SIDEBAR (OPTIONAL) ------------------------- */
function initCartSidebar() {
  // Only run on store pages
  if (!document.getElementById('cart-icon') || window.location.pathname.indexOf('store') === -1) return;

  let sidebar = document.getElementById('cart-sidebar');
  if (!sidebar) {
    sidebar = document.createElement('div');
    sidebar.id = 'cart-sidebar';
    sidebar.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h4 style="margin:0; font-family:var(--ff-body); font-size:1.1rem;">Your Cart</h4>
        <button onclick="document.getElementById('cart-sidebar').classList.remove('open')"
          style="background:none; border:none; font-size:1.3rem; cursor:pointer; color:var(--text-p);">&times;</button>
      </div>
      <div id="cart-sidebar-items" style="flex:1; overflow-y:auto;">
        <p style="text-align:center; color:var(--text-muted); padding:40px 0;">Your cart is empty.</p>
      </div>
      <div style="border-top:1px solid var(--border); padding-top:14px; margin-top:auto;">
        <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:14px;">
          <span>Total</span>
          <span id="cart-total">SAR 0</span>
        </div>
        <button style="width:100%; padding:12px; background:var(--blue); color:#fff; border:none; border-radius:10px; font-weight:600; cursor:pointer;">
          Checkout
        </button>
      </div>
    `;
    sidebar.style.cssText = `
      position: fixed; top: 0; right: 0; width: 380px; max-width: 90vw; height: 100vh;
      background: var(--bg-card); z-index: 9999; padding: 24px;
      display: flex; flex-direction: column;
      box-shadow: -4px 0 40px rgba(0,0,0,.15);
      transform: translateX(100%);
      transition: transform .35s var(--ease);
    `;
    document.body.appendChild(sidebar);
  }

  // Override toggleCart to open sidebar
  window.toggleCart = function() {
    sidebar.classList.toggle('open');
  };
}

// Call on page load
initCartSidebar();

/* ============================================================
   MAIN JAVASCRIPT
   All interactive features for Danah Travel & Tourism
============================================================ */

// ---- I18N TRANSLATION OBJECT ----
const danahI18n = {
  en: {
	"preloader.label": "Loading Experience…",
	"sticky.book": "Book a Flight",
	"nav.home": "Home",
	"nav.services": "Services",
	"nav.about": "About",
	"nav.destinations": "Destinations",
	"nav.pricing": "Pricing",
	"nav.contact": "Contact",
	"nav.logout": "Logout",
	"nav.bookNow": "Book Now",
	"nav.store": "Store",
	"nav.profile": "My Profile",
	"nav.bookFlight": "Book a Flight",
	"hero.badge": "Downtown Riyadh, Saudi Arabia",
	"hero.title": "Your Journey<br>Begins with<br><span class='hl'>Danah.</span>",
	"hero.sub": "A modern travel & tourism agency in the heart of Riyadh — flights, visa services, and curated world tours all under one roof.",
	"hero.cta1": "Book a Flight",
	"hero.cta2": "Explore Destinations",
	"hero.stat1": "Happy Travellers",
	"hero.stat2": "Destinations",
	"hero.stat3": "Visa Approval",
	"hero.stat4": "Support",
	"hero.card1.route": "Riyadh → Dubai",
	"hero.card1.flight": "Emirates · EK 802",
	"hero.card1.status": "On Time",
	"hero.card1.time": "08:45 AM",
	"hero.card1.duration": "1h 50m",
	"hero.card1.date": "Today",
	"hero.card2.label": "VISA APPROVAL RATE",
	"hero.card2.note": "Based on 3,200+ applications processed",
	"hero.card3.countries": "Countries",
	"hero.card3.experience": "Experience",
	"hero.card3.rating": "Rating ★",
	"scroll": "Scroll",
	"stats.clients": "Happy Clients",
	"stats.destinations": "Destinations",
	"stats.visas": "Visas Processed",
	"stats.experience": "Years of Experience",
	"services.tag": "What We Offer",
	"services.title": "End-to-End Travel Services",
	"services.desc": "From your first flight booking to every visa detail — Danah delivers seamless travel solutions tailored to every journey and every budget.",
	"services.intl.title": "International Flights",
	"services.intl.desc": "Hundreds of global routes, competitive fares, and flexible booking through our premium airline partner network.",
	"services.dom.title": "Domestic Flights",
	"services.dom.desc": "Fast, affordable travel between Riyadh, Jeddah, Dammam, Abha, Medina, and all major Saudi destinations.",
	"services.visa.title": "Visa Services",
	"services.visa.desc": "Expert visa processing with a 98.4% approval rate. We manage documentation for 60+ countries from start to finish.",
	"services.hotel.title": "Hotel Booking",
	"services.hotel.desc": "Curated hotels from budget-friendly stays to five-star luxury resorts, always at the best available rate.",
	"services.tours.title": "Tour Packages",
	"services.tours.desc": "All-inclusive packages for families, couples, and solo travellers covering the world's most iconic destinations.",
	"services.corp.title": "Corporate Travel",
	"services.corp.desc": "Dedicated corporate management with priority booking, expense tracking, and round-the-clock business support.",
	"about.badge.title": "Award-Winning Agency",
	"about.badge.desc": "Best Travel Agency Riyadh — 2022 · 2023 · 2024",
	"about.tag": "About Danah",
	"about.title": "Riyadh's Premier<br>Travel Partner",
	"about.p1": "Located in the heart of downtown Riyadh, Danah has been connecting Saudi travellers to the world since 2016. Our modern Al-Olaya Street office brings together expert consultants, cutting-edge booking technology, and genuinely personalised service to make every journey exceptional.",
	"about.f1.title": "Licensed & IATA Accredited",
	"about.f1.desc": "Fully licensed by the Saudi Tourism Authority and accredited for international ticketing operations.",
	"about.f2.title": "24/7 Expert Support",
	"about.f2.desc": "Our team is available around the clock to assist with changes, emergencies, and last-minute requests.",
	"about.f3.title": "Best Price Guarantee",
	"about.f3.desc": "We match or beat any comparable quote — so you always travel at the best possible value.",
	"about.cta": "Start Planning",
	"portfolio.tag": "Destinations",
	"portfolio.title": "Explore Our Destinations",
	"portfolio.desc": "From the Arabian Gulf to European capitals — discover the routes our clients love most.",
	"portfolio.city1.name": "Riyadh, Saudi Arabia",
	"portfolio.city1.desc": "Domestic · From SAR 190",
	"portfolio.city2.name": "Dubai, UAE",
	"portfolio.city2.desc": "Gulf · From SAR 450",
	"portfolio.city3.name": "Istanbul, Turkey",
	"portfolio.city3.desc": "Europe · From SAR 890",
	"portfolio.city4.name": "London, UK",
	"portfolio.city4.desc": "Europe · From SAR 2,100",
	"portfolio.city5.name": "Maldives",
	"portfolio.city5.desc": "Asia · From SAR 1,800",
	"portfolio.city6.name": "Paris, France",
	"portfolio.city6.desc": "Europe · From SAR 1,950",
	"booking.tag": "Book Now",
	"booking.title": "Find Your<br>Perfect Flight",
	"booking.desc": "Search thousands of routes instantly. Our engine always finds the best fares across every major airline.",
	"booking.f1.title": "Instant E-Ticket",
	"booking.f1.desc": "Receive your confirmed ticket within minutes of booking.",
	"booking.f2.title": "Free Cancellation",
	"booking.f2.desc": "Cancel up to 24 hrs before departure for a full refund.",
	"booking.f3.title": "Secure Payments",
	"booking.f3.desc": "Bank-level SSL encryption on every transaction.",
	"booking.tab1": "One Way",
	"booking.tab2": "Round Trip",
	"booking.tab3": "Multi-City",
	"booking.from": "From",
	"booking.from_placeholder": "e.g. Riyadh (RUH)",
	"booking.to": "To",
	"booking.to_placeholder": "e.g. London (LHR)",
	"booking.depart": "Departure",
	"booking.return": "Return",
	"booking.passengers": "Passengers",
	"booking.pax1": "1 Adult",
	"booking.pax2": "2 Adults",
	"booking.pax3": "2 Adults, 1 Child",
	"booking.pax4": "2 Adults, 2 Children",
	"booking.pax5": "Group (6+)",
	"booking.class": "Cabin Class",
	"booking.class1": "Economy",
	"booking.class2": "Premium Economy",
	"booking.class3": "Business Class",
	"booking.class4": "First Class",
	"booking.search": "Search Flights",
	"nav.aria": "Primary navigation",
	"nav.mobileAria": "Mobile navigation",
	"nav.menuOpen": "Open menu",
	"lang.en": "English",
	"lang.ar": "Arabic",
	"theme.toggle": "Toggle dark mode",
	"btt": "Back to top",
	"lightbox": "Image lightbox",
	"lightbox.close": "Close",
	"lightbox.prev": "Previous image",
	"lightbox.next": "Next image",
	"hero.aria": "Welcome to Danah Travel",
	"stats.aria": "Company statistics",
	"services.aria": "Travel services offered by Danah",
	"about.aria": "About Danah Travel",
	"about.imgAlt": "Danah Travel office in Riyadh",
	"portfolio.aria": "Destinations gallery",
	"portfolio.city1.alt": "Riyadh, Saudi Arabia",
	"portfolio.city2.alt": "Dubai, UAE",
	"portfolio.city3.alt": "Istanbul, Turkey",
	"portfolio.city4.alt": "London, UK",
	"portfolio.city5.alt": "Maldives",
	"portfolio.city6.alt": "Paris, France",
	"booking.aria": "Flight booking form",
	"pricing.tag": "Pricing",
	"pricing.title": "Packages for Every Budget",
	"pricing.desc": "Transparent all-inclusive packages. No hidden fees. Choose the plan that fits your journey.",
	"pricing.aria": "Pricing plans",
	"pricing.pop": "Most Popular",
	"pricing.cta": "Get Started",
	"pricing.econ.name": "Economy",
	"pricing.econ.period": "per person / 7 nights",
	"pricing.econ.f1": "Economy class flights",
	"pricing.econ.f2": "3-star hotel included",
	"pricing.econ.f3": "Airport transfers",
	"pricing.econ.f4": "Travel insurance",
	"pricing.econ.f5": "Visa processing",
	"pricing.econ.f6": "Guided tours",
	"pricing.econ.f7": "Meals included",
	"pricing.biz.name": "Business",
	"pricing.biz.period": "per person / 10 nights",
	"pricing.biz.f1": "Business class flights",
	"pricing.biz.f2": "5-star hotel included",
	"pricing.biz.f3": "Private transfers",
	"pricing.biz.f4": "Premium insurance",
	"pricing.biz.f5": "Visa processing",
	"pricing.biz.f6": "2 guided tours",
	"pricing.biz.f7": "All meals included",
	"pricing.prem.name": "Premium",
	"pricing.prem.period": "per person / 14 nights",
	"pricing.prem.f1": "First class flights",
	"pricing.prem.f2": "Luxury resort suite",
	"pricing.prem.f3": "Limousine transfers",
	"pricing.prem.f4": "VIP concierge",
	"pricing.prem.f5": "Express visa service",
	"pricing.prem.f6": "Unlimited guided tours",
	"pricing.prem.f7": "All meals & drinks",
	"cta.aria": "Special offer",
	"cta.tag": "Limited Time",
	"cta.title": "Ready to Explore the World?",
	"cta.desc": "Book before 31 August 2026 and save <strong>15%</strong> on all international packages. Code: <strong>DANAH15</strong>",
	"cta.btn1": "Book Now & Save 15%",
	"cta.btn2": "Talk to an Expert",
	"team.aria": "Danah team members",
	"team.tag": "Our Team",
	"team.title": "Meet the Danah Experts",
	"team.desc": "Passionate travel professionals dedicated to crafting unforgettable experiences for every client.",
	"team.m1.alt": "Sarah Al-Rashid, General Director",
	"team.m1.name": "Sarah Al-Rashid",
	"team.m1.role": "General Director",
	"team.m1.bio": "15+ years in luxury travel management with extensive expertise in GCC and European markets.",
	"team.m2.alt": "Khalid Al-Otaibi, Head of Operations",
	"team.m2.name": "Khalid Al-Otaibi",
	"team.m2.role": "Head of Operations",
	"team.m2.bio": "Aviation veteran with 12 years managing international flight bookings and airline partnerships across 40+ countries.",
	"team.m3.alt": "Nora Al-Shamrani, Visa Specialist",
	"team.m3.name": "Nora Al-Shamrani",
	"team.m3.role": "Visa Specialist",
	"team.m3.bio": "Certified immigration consultant with a 98%+ success rate across Europe, UK, USA, and Schengen applications.",
	"team.m4.alt": "Omar Al-Zahrani, Tour Coordinator",
	"team.m4.name": "Omar Al-Zahrani",
	"team.m4.role": "Tour Coordinator",
	"team.m4.bio": "Specialist in curated Middle East and Asia-Pacific packages with 9 years of on-ground destination experience.",
	"social.linkedin": "LinkedIn",
	"social.twitter": "Twitter / X",
	"social.instagram": "Instagram",
	"social.facebook": "Facebook",
	"social.youtube": "YouTube",
	"social.tiktok": "TikTok",
	"testimonials.aria": "Client testimonials",
	"testimonials.tag": "Client Reviews",
	"testimonials.title": "What Our Travellers Say",
	"testimonials.desc": "Over 12,000 happy clients and counting — here's what some of them have shared about their Danah experience.",
	"testimonials.prev": "Previous review",
	"testimonials.next": "Next review",
	"testimonials.t1.quote": "\"Danah made our family trip to London absolutely seamless. The visa processing was incredibly fast — approved in just four days — and the business-class fares they found were better than anything we could find online. Highly recommended for anyone travelling from Riyadh.\"",
	"testimonials.t1.name": "Abdullah Al-Harbi",
	"testimonials.t1.info": "Family trip to London · June 2025",
	"testimonials.t1.avatarAlt": "Abdullah Al-Harbi",
	"testimonials.t2.quote": "\"As a frequent corporate traveller, I've tried many agencies in Riyadh. Danah is in a league of its own. Their 24/7 support saved me when my Istanbul flight was cancelled at midnight — they had me rebooked on the next departure within 20 minutes.\"",
	"testimonials.t2.name": "Reem Al-Ghamdi",
	"testimonials.t2.info": "Corporate client · Istanbul, Turkey",
	"testimonials.t2.avatarAlt": "Reem Al-Ghamdi",
	"testimonials.t3.quote": "\"The Maldives package was beyond our expectations. Every detail — from the resort transfer to the snorkelling tour — was handled perfectly. Nora guided us through the Schengen visa process with complete professionalism. We'll be back for our next trip.\"",
	"testimonials.t3.name": "Faisal & Maha Al-Dosari",
	"testimonials.t3.info": "Honeymoon package · Maldives",
	"testimonials.t3.avatarAlt": "Faisal & Maha Al-Dosari",
	"testimonials.t4.quote": "\"I booked a last-minute trip to Dubai through Danah's website at 11 PM on a Thursday. By Friday morning I had my e-ticket, hotel confirmation, and transfer voucher in my inbox. The price was excellent and the whole process took less than an hour.\"",
	"testimonials.t4.name": "Sara Al-Mutairi",
	"testimonials.t4.info": "Weekend trip to Dubai · July 2025",
	"testimonials.t4.avatarAlt": "Sara Al-Mutairi",
	"faq.aria": "Frequently asked questions",
	"faq.tag": "FAQ",
	"faq.title": "Frequently Asked<br>Questions",
	"faq.desc": "Can't find your answer here? Our team is available 24/7 to help with anything travel-related.",
	"faq.cta": "Contact Support",
	"faq.callLabel": "Call Us Directly",
	"faq.q1": "How quickly can I receive my flight ticket after booking?",
	"faq.a1": "For most standard international and domestic routes, your e-ticket is issued instantly upon payment confirmation. For group bookings or charter flights, processing may take up to 2 hours. You'll receive your e-ticket by email and WhatsApp the moment it's confirmed.",
	"faq.q2": "Which countries do you provide visa services for?",
	"faq.a2": "We process visa applications for 60+ countries, including all Schengen countries, the United Kingdom, the United States, Canada, Australia, Japan, and all GCC member states. Our team handles the full documentation process — you just provide the required papers.",
	"faq.q3": "Can I modify or cancel my booking after confirmation?",
	"faq.a3": "Yes. Changes and cancellations are handled according to the airline's fare rules. For packages booked directly through Danah, we offer free cancellation up to 48 hours before the first flight. Modifications requested more than 72 hours in advance are processed at no charge for Danah service fees.",
	"faq.q4": "Do you offer travel insurance with your packages?",
	"faq.a4": "Yes. All Danah packages include basic travel and medical insurance. Our Business and Premium packages include comprehensive international coverage worth up to SAR 750,000. You can also add standalone travel insurance to any flight-only booking during the checkout process.",
	"faq.q5": "What payment methods do you accept?",
	"faq.a5": "We accept mada, Visa, Mastercard, American Express, Apple Pay, STC Pay, bank transfer, and corporate invoicing. All transactions are secured with 256-bit SSL encryption. Installment payment plans are available for packages above SAR 3,000 via Tabby and Tamara.",
	"faq.q6": "Is Danah a licensed travel agency in Saudi Arabia?",
	"faq.a6": "Yes. Danah is fully licensed by the Saudi Tourism Authority (STA) with license number STA-RUH-2016-0442, and holds active IATA accreditation for international ticketing. You can verify our credentials directly on the Saudi Tourism Authority portal.",
	"reservation.aria": "Reservation request form",
	"reservation.tag": "Reserve",
	"reservation.title": "Request a Reservation",
	"reservation.desc": "Fill in your travel details and a Danah consultant will call you back within 2 hours to confirm availability and pricing.",
	"reservation.step1": "Trip Details",
	"reservation.step2": "Preferences",
	"reservation.step3": "Confirm",
	"reservation.fullName": "Full Name",
	"reservation.fullName_placeholder": "e.g. Mohammed Al-Qahtani",
	"reservation.phone": "Phone Number",
	"reservation.phone_placeholder": "+966 5X XXX XXXX",
	"reservation.email": "Email Address",
	"reservation.email_placeholder": "you@example.com",
	"reservation.destination": "Destination",
	"reservation.destination_placeholder": "e.g. Paris, France",
	"reservation.travelDate": "Travel Date",
	"reservation.travellers": "Number of Travellers",
	"reservation.select": "Select",
	"reservation.pax1": "1 Person",
	"reservation.pax2": "2 People",
	"reservation.pax3": "3–5 People",
	"reservation.pax4": "6–10 People",
	"reservation.pax5": "Group 10+",
	"reservation.packageType": "Package Type",
	"reservation.pkg1": "Economy Package",
	"reservation.pkg2": "Business Package",
	"reservation.pkg3": "Premium Package",
	"reservation.pkg4": "Custom / Bespoke",
	"reservation.pkg5": "Flight Only",
	"reservation.pkg6": "Visa Only",
	"reservation.budget": "Approximate Budget",
	"reservation.budget1": "Below SAR 2,000",
	"reservation.budget2": "SAR 2,000 – 5,000",
	"reservation.budget3": "SAR 5,000 – 10,000",
	"reservation.budget4": "SAR 10,000 – 20,000",
	"reservation.budget5": "SAR 20,000+",
	"reservation.notes": "Special Requests or Notes",
	"reservation.notes_placeholder": "Any special requirements, dietary needs, preferred airlines, hotel preferences…",
	"reservation.submit": "Submit Reservation Request",
	"contact.aria": "Contact Danah Travel",
	"contact.tag": "Contact",
	"contact.title": "Get in Touch",
	"contact.desc": "Visit us in downtown Riyadh, send a message online, or call our travel experts — we're always ready to help.",
	"contact.addressLabel": "Office Address",
	"contact.address": "Al-Olaya Street, Al-Murabba District<br>Riyadh 12244, Saudi Arabia",
	"contact.phoneLabel": "Phone",
	"contact.whatsappLabel": "WhatsApp",
	"contact.emailLabel": "Email",
	"contact.hoursLabel": "Office Hours",
	"contact.hours": "Sunday–Thursday: 8:00 AM – 9:00 PM<br>Friday–Saturday: 10:00 AM – 6:00 PM",
	"contact.mapTitle": "Danah Travel office location on Google Maps",
	"contact.formTitle": "Send Us a Message",
	"contact.formDesc": "We typically respond within 2–4 hours during business hours.",
	"contact.yourName": "Your Name",
	"contact.yourName_placeholder": "Full name",
	"contact.yourEmail": "Email Address",
	"contact.yourEmail_placeholder": "you@example.com",
	"contact.yourPhone": "Phone Number",
	"contact.yourPhone_placeholder": "+966 5X XXX XXXX",
	"contact.subject": "Subject",
	"contact.subject_placeholder": "Select a topic",
	"contact.topic1": "Flight Booking",
	"contact.topic2": "Visa Services",
	"contact.topic3": "Tour Package",
	"contact.topic4": "Hotel Booking",
	"contact.topic5": "Corporate Travel",
	"contact.topic6": "Complaint / Feedback",
	"contact.topic7": "Other",
	"contact.message": "Message",
	"contact.message_placeholder": "Tell us about your travel plans or ask us anything…",
	"contact.send": "Send Message",
	"footer.desc": "Your trusted travel partner in downtown Riyadh since 2016 — connecting Saudi Arabia to the world through exceptional service and unbeatable value.",
	"footer.services": "Services",
	"footer.booking": "Flight Booking",
	"footer.visa": "Visa Services",
	"footer.tours": "Tour Packages",
	"footer.hotel": "Hotel Booking",
	"footer.corp": "Corporate Travel",
	"footer.reservations": "Reservations",
	"footer.topDests": "Top Destinations",
	"footer.newsletter": "Stay in the Loop",
	"footer.newsletter_desc": "Subscribe for exclusive deals, early-bird offers, and travel inspiration delivered directly to your inbox.",
	"footer.placeholder": "Enter your email address…",
	"footer.subscribe": "Subscribe",
	"footer.nospam": "No spam, ever. Unsubscribe at any time.",
	"footer.sta": "STA Licensed",
	"footer.iata": "IATA Accredited",
	"footer.ssl": "SSL Secured",
	"footer.copy": "© 2026 Danah Travel & Tourism. All rights reserved. | STA License #STA-RUH-2016-0442",
	"footer.privacy": "Privacy Policy",
	"footer.terms": "Terms of Service",
	"footer.cookies": "Cookie Policy",
	"nav.reservation": "Reserve",
	"reservation.hero.tag": "Secure Your Journey",
	"reservation.hero.title": "Request a Reservation",
	"reservation.hero.desc": "Fill in your travel details and a Danah consultant will call you back within 2 hours to confirm availability and pricing.",
	"reservation.step1.personal": "Personal Info",
	"reservation.step2.trip": "Trip Details",
	"reservation.step3.confirm": "Confirm",
	"reservation.form.personal_title": "Personal Information",
	"reservation.form.trip_title": "Trip Details",
	"reservation.form.confirm_title": "Confirm Your Request",
	"reservation.preferred_contact": "Preferred Contact Method",
	"reservation.contact_phone": "Phone",
	"reservation.contact_whatsapp": "WhatsApp",
	"reservation.contact_email": "Email",
	"reservation.returnDate": "Return Date (optional)",
	"reservation.btn_next": "Next",
	"reservation.btn_prev": "Back",
	"reservation.btn_review": "Review",
	"reservation.agree_terms_html": "I agree to the <a href='#'>Terms of Service</a> and <a href='#'>Privacy Policy</a>."
  },
  ar: {
    "preloader.label": "جارٍ التحميل…",
	"sticky.book": "احجز رحلة",
	"nav.home": "الرئيسية",
	"nav.services": "الخدمات",
	"nav.about": "عن دانة",
	"nav.destinations": "الوجهات",
	"nav.pricing": "الأسعار",
	"nav.contact": "اتصل بنا",
	"nav.logout": "تسجيل خروج",
	"nav.bookNow": "احجز الآن",
	"nav.store": "المتجر",
	"nav.profile": "ملفي",
	"nav.bookFlight": "احجز رحلة",
	"hero.badge": "وسط الرياض، المملكة العربية السعودية",
	"hero.title": "رحلتك<br>تبدأ مع<br><span class='hl'>دانة.</span>",
	"hero.sub": "وكالة سفر وسياحة حديثة في قلب الرياض — حجوزات طيران، خدمات تأشيرات، وجولات عالمية مخصصة تحت سقف واحد.",
	"hero.cta1": "احجز رحلة",
	"hero.cta2": "استكشف الوجهات",
	"hero.stat1": "مسافر سعيد",
	"hero.stat2": "وجهة",
	"hero.stat3": "نسبة قبول التأشيرات",
	"hero.stat4": "دعم",
	"hero.card1.route": "الرياض ← دبي",
	"hero.card1.flight": "طيران الإمارات · EK 802",
	"hero.card1.status": "في الموعد",
	"hero.card1.time": "08:45 ص",
	"hero.card1.duration": "1 س 50 د",
	"hero.card1.date": "اليوم",
	"hero.card2.label": "نسبة قبول التأشيرات",
	"hero.card2.note": "بناءً على أكثر من 3,200 طلب تم معالجته",
	"hero.card3.countries": "دولة",
	"hero.card3.experience": "خبرة",
	"hero.card3.rating": "التقييم ★",
	"scroll": "انزل",
	"stats.clients": "عميل سعيد",
	"stats.destinations": "وجهة",
	"stats.visas": "تأشيرة تمت معالجتها",
	"stats.experience": "سنوات خبرة",
	"services.tag": "ما نقدمه",
	"services.title": "خدمات سفر شاملة",
	"services.desc": "من أول حجز طيران إلى كل تفصيلة تأشيرة — تقدم دانة حلول سفر سلسة مصممة لكل رحلة وكل ميزانية.",
	"services.intl.title": "رحلات دولية",
	"services.intl.desc": "مئات المسارات العالمية، أسعار تنافسية، وحجز مرن عبر شبكة شركائنا المتميزين من شركات الطيران.",
	"services.dom.title": "رحلات داخلية",
	"services.dom.desc": "سفر سريع وبأسعار معقولة بين الرياض، جدة، الدمام، أبها، المدينة المنورة، وجميع الوجهات السعودية الرئيسية.",
	"services.visa.title": "خدمات التأشيرات",
	"services.visa.desc": "معالجة تأشيرات احترافية بنسبة قبول 98.4%. ندير الوثائق لأكثر من 60 دولة من البداية إلى النهاية.",
	"services.hotel.title": "حجز الفنادق",
	"services.hotel.desc": "فنادق مختارة من إقامات مناسبة للميزانية إلى منتجعات فاخرة خمس نجوم، دائمًا بأفضل سعر متاح.",
	"services.tours.title": "باقات سياحية",
	"services.tours.desc": "باقات شاملة للعائلات والأزواج والمسافرين المنفردين تغطي الوجهات الأكثر شهرة في العالم.",
	"services.corp.title": "سفر الشركات",
	"services.corp.desc": "إدارة مخصصة للشركات مع حجوزات ذات أولوية وتتبع المصروفات ودعم تجاري على مدار الساعة.",
	"about.badge.title": "وكالة حائزة على جوائز",
	"about.badge.desc": "أفضل وكالة سفر في الرياض — 2022 · 2023 · 2024",
	"about.tag": "عن دانة",
	"about.title": "شريك السفر الأول<br>في الرياض",
	"about.p1": "تقع دانة في قلب وسط الرياض، وقد كانت تربط المسافرين السعوديين بالعالم منذ 2016. يجمع مكتبنا الحديث في شارع العليا بين مستشارين خبراء وتقنية حجز متطورة وخدمة شخصية حقيقية لجعل كل رحلة استثنائية.",
	"about.f1.title": "مرخصة ومعتمدة من IATA",
	"about.f1.desc": "مرخصة بالكامل من هيئة السياحة السعودية ومعتمدة لعمليات إصدار التذاكر الدولية.",
	"about.f2.title": "دعم خبراء 24/7",
	"about.f2.desc": "فريقنا متاح على مدار الساعة للمساعدة في التغييرات والطوارئ والطلبات في اللحظة الأخيرة.",
	"about.f3.title": "ضمان أفضل سعر",
	"about.f3.desc": "نطابق أو نتفوق على أي عرض مماثل — لذا تسافر دائمًا بأفضل قيمة ممكنة.",
	"about.cta": "ابدأ التخطيط",
	"portfolio.tag": "الوجهات",
	"portfolio.title": "استكشف وجهاتنا",
	"portfolio.desc": "من الخليج العربي إلى العواصم الأوروبية — اكتشف المسارات التي يحبها عملاؤنا أكثر.",
	"portfolio.city1.name": "الرياض، السعودية",
	"portfolio.city1.desc": "محلي · من 190 ريال",
	"portfolio.city2.name": "دبي، الإمارات",
	"portfolio.city2.desc": "الخليج · من 450 ريال",
	"portfolio.city3.name": "إسطنبول، تركيا",
	"portfolio.city3.desc": "أوروبا · من 890 ريال",
	"portfolio.city4.name": "لندن، المملكة المتحدة",
	"portfolio.city4.desc": "أوروبا · من 2,100 ريال",
	"portfolio.city5.name": "المالديف",
	"portfolio.city5.desc": "آسيا · من 1,800 ريال",
	"portfolio.city6.name": "باريس، فرنسا",
	"portfolio.city6.desc": "أوروبا · من 1,950 ريال",
	"booking.tag": "احجز الآن",
	"booking.title": "ابحث عن<br>رحلتك المثالية",
	"booking.desc": "ابحث في آلاف المسارات فورًا. محركنا دائمًا ما يجد أفضل الأسعار عبر كل شركات الطيران الكبرى.",
	"booking.f1.title": "تذكرة فورية",
	"booking.f1.desc": "استلم تذكرتك المؤكدة في غضون دقائق من الحجز.",
	"booking.f2.title": "إلغاء مجاني",
	"booking.f2.desc": "ألغِ حتى 24 ساعة قبل المغادرة لاسترداد كامل المبلغ.",
	"booking.f3.title": "مدفوعات آمنة",
	"booking.f3.desc": "تشفير SSL على مستوى البنوك في كل معاملة.",
	"booking.tab1": "ذهاب فقط",
	"booking.tab2": "ذهاب وعودة",
	"booking.tab3": "متعدد المدن",
	"booking.from": "من",
	"booking.from_placeholder": "مثال: الرياض (RUH)",
	"booking.to": "إلى",
	"booking.to_placeholder": "مثال: لندن (LHR)",
	"booking.depart": "المغادرة",
	"booking.return": "العودة",
	"booking.passengers": "المسافرون",
	"booking.pax1": "شخص بالغ واحد",
	"booking.pax2": "شخصان بالغان",
	"booking.pax3": "شخصان بالغان، طفل واحد",
	"booking.pax4": "شخصان بالغان، طفلان",
	"booking.pax5": "مجموعة (6+)",
	"booking.class": "درجة المقصورة",
	"booking.class1": "اقتصادية",
	"booking.class2": "اقتصادية ممتازة",
	"booking.class3": "رجال الأعمال",
	"booking.class4": "الدرجة الأولى",
	"booking.search": "ابحث عن رحلات",
	"nav.aria": "التنقل الرئيسي",
	"nav.mobileAria": "التنقل للجوال",
	"nav.menuOpen": "افتح القائمة",
	"lang.en": "English",
	"lang.ar": "العربية",
	"theme.toggle": "تبديل الوضع الداكن",
	"btt": "العودة للأعلى",
	"lightbox": "عارض الصور",
	"lightbox.close": "إغلاق",
	"lightbox.prev": "الصورة السابقة",
	"lightbox.next": "الصورة التالية",
	"hero.aria": "مرحباً بك في دانة للسفر",
	"stats.aria": "إحصائيات الشركة",
	"services.aria": "الخدمات التي تقدمها دانة",
	"about.aria": "عن دانة للسفر",
	"about.imgAlt": "مكتب دانة للسفر في الرياض",
	"portfolio.aria": "معرض الوجهات",
	"portfolio.city1.alt": "الرياض، السعودية",
	"portfolio.city2.alt": "دبي، الإمارات",
	"portfolio.city3.alt": "إسطنبول، تركيا",
	"portfolio.city4.alt": "لندن، المملكة المتحدة",
	"portfolio.city5.alt": "المالديف",
	"portfolio.city6.alt": "باريس، فرنسا",
	"booking.aria": "نموذج حجز الرحلة",
	"pricing.tag": "الأسعار",
	"pricing.title": "باقات لكل ميزانية",
	"pricing.desc": "باقات شاملة وشفافة. بدون رسوم مخفية. اختر الخطة التي تناسب رحلتك.",
	"pricing.aria": "خطط الأسعار",
	"pricing.pop": "الأكثر شيوعاً",
	"pricing.cta": "ابدأ الآن",
	"pricing.econ.name": "اقتصادية",
	"pricing.econ.period": "للشخص / 7 ليالي",
	"pricing.econ.f1": "رحلات درجة اقتصادية",
	"pricing.econ.f2": "فندق 3 نجوم",
	"pricing.econ.f3": "انتقالات المطار",
	"pricing.econ.f4": "تأمين سفر",
	"pricing.econ.f5": "معالجة التأشيرة",
	"pricing.econ.f6": "جولات مع مرشد",
	"pricing.econ.f7": "وجبات مشمولة",
	"pricing.biz.name": "رجال الأعمال",
	"pricing.biz.period": "للشخص / 10 ليالي",
	"pricing.biz.f1": "رحلات درجة رجال الأعمال",
	"pricing.biz.f2": "فندق 5 نجوم",
	"pricing.biz.f3": "انتقالات خاصة",
	"pricing.biz.f4": "تأمين مميز",
	"pricing.biz.f5": "معالجة التأشيرة",
	"pricing.biz.f6": "جولتان مع مرشد",
	"pricing.biz.f7": "جميع الوجبات مشمولة",
	"pricing.prem.name": "مميزة",
	"pricing.prem.period": "للشخص / 14 ليلة",
	"pricing.prem.f1": "رحلات درجة أولى",
	"pricing.prem.f2": "جناح فندقي فاخر",
	"pricing.prem.f3": "انتقالات ليموزين",
	"pricing.prem.f4": "خدمة الكونسيرج",
	"pricing.prem.f5": "خدمة تأشيرة سريعة",
	"pricing.prem.f6": "جولات غير محدودة",
	"pricing.prem.f7": "جميع الوجبات والمشروبات",
	"cta.aria": "عرض خاص",
	"cta.tag": "لفترة محدودة",
	"cta.title": "مستعد لاستكشاف العالم؟",
	"cta.desc": "احجز قبل 31 أغسطس 2026 ووفر <strong>15%</strong> على جميع الباقات الدولية. الكود: <strong>DANAH15</strong>",
	"cta.btn1": "احجز الآن ووفر 15%",
	"cta.btn2": "تحدث مع خبير",
	"team.aria": "فريق دانة",
	"team.tag": "فريقنا",
	"team.title": "تعرف على خبراء دانة",
	"team.desc": "محترفو سفر شغوفون مكرسون لصياغة تجارب لا تُنسى لكل عميل.",
	"team.m1.alt": "سارة الراشد، المدير العام",
	"team.m1.name": "سارة الراشد",
	"team.m1.role": "المدير العام",
	"team.m1.bio": "أكثر من 15 عاماً في إدارة السفر الفاخر مع خبرة واسعة في أسواق الخليج وأوروبا.",
	"team.m2.alt": "خالد العتيبي، رئيس العمليات",
	"team.m2.name": "خالد العتيبي",
	"team.m2.role": "رئيس العمليات",
	"team.m2.bio": "مخضرم في الطيران مع 12 عاماً في إدارة حجوزات الرحلات الدولية والشراكات مع شركات الطيران عبر 40+ دولة.",
	"team.m3.alt": "نورة الشمراني، أخصائية تأشيرات",
	"team.m3.name": "نورة الشمراني",
	"team.m3.role": "أخصائية تأشيرات",
	"team.m3.bio": "مستشارة هجرة معتمدة بنسبة نجاح تتجاوز 98% عبر أوروبا، المملكة المتحدة، الولايات المتحدة، وشنغن.",
	"team.m4.alt": "عمر الزهراني، منسق جولات",
	"team.m4.name": "عمر الزهراني",
	"team.m4.role": "منسق جولات",
	"team.m4.bio": "متخصص في باقات الشرق الأوسط وآسيا والمحيط الهادئ مع 9 سنوات من الخبرة الميدانية.",
	"social.linkedin": "لينكدإن",
	"social.twitter": "تويتر / إكس",
	"social.instagram": "إنستغرام",
	"social.facebook": "فيسبوك",
	"social.youtube": "يوتيوب",
	"social.tiktok": "تيك توك",
	"testimonials.aria": "آراء العملاء",
	"testimonials.tag": "آراء العملاء",
	"testimonials.title": "ماذا يقول مسافرونا",
	"testimonials.desc": "أكثر من 12,000 عميل سعيد — إليك ما شاركه بعضهم عن تجربتهم مع دانة.",
	"testimonials.prev": "المراجعة السابقة",
	"testimonials.next": "المراجعة التالية",
	"testimonials.t1.quote": "\"جعلت دانة رحلة عائلتنا إلى لندن سلسة تماماً. كانت معالجة التأشيرة سريعة بشكل لا يصدق — تمت الموافقة في أربعة أيام فقط — وكانت أسعار درجة رجال الأعمال التي وجدوها أفضل من أي شيء يمكن أن نجده عبر الإنترنت. موصى بها بشدة لأي شخص يسافر من الرياض.\"",
	"testimonials.t1.name": "عبدالله الحربي",
	"testimonials.t1.info": "رحلة عائلية إلى لندن · يونيو 2025",
	"testimonials.t1.avatarAlt": "عبدالله الحربي",
	"testimonials.t2.quote": "\"كمسافر دائم للشركات، جربت العديد من الوكالات في الرياض. دانة في مستوى مختلف تماماً. أنقذني دعمهم على مدار الساعة عندما ألغيت رحلتي إلى إسطنبول في منتصف الليل — أعادوا حجزي على الرحلة التالية في غضون 20 دقيقة.\"",
	"testimonials.t2.name": "ريم الغامدي",
	"testimonials.t2.info": "عميل شركات · إسطنبول، تركيا",
	"testimonials.t2.avatarAlt": "ريم الغامدي",
	"testimonials.t3.quote": "\"كانت باقة المالديف فوق توقعاتنا. كل تفصيل — من نقل المنتجع إلى جولة الغطس — تم التعامل معه بشكل مثالي. أرشدتنا نورة خلال عملية تأشيرة شنغن باحترافية كاملة. سنعود لرحلتنا القادمة.\"",
	"testimonials.t3.name": "فيصل ومها الدوسري",
	"testimonials.t3.info": "باقة شهر العسل · المالديف",
	"testimonials.t3.avatarAlt": "فيصل ومها الدوسري",
	"testimonials.t4.quote": "\"حجزت رحلة في اللحظة الأخيرة إلى دبي من خلال موقع دانة الساعة 11 مساءً يوم الخميس. بحلول صباح الجمعة كان لدي تذكرتي الإلكترونية وتأكيد الفندق وقسيمة الانتقال في بريدي. كان السعر ممتازاً واستغرقت العملية بأكملها أقل من ساعة.\"",
	"testimonials.t4.name": "سارة المطيري",
	"testimonials.t4.info": "رحلة نهاية الأسبوع إلى دبي · يوليو 2025",
	"testimonials.t4.avatarAlt": "سارة المطيري",
	"faq.aria": "الأسئلة الشائعة",
	"faq.tag": "الأسئلة الشائعة",
	"faq.title": "الأسئلة<br>الشائعة",
	"faq.desc": "ألم تجد إجابتك هنا؟ فريقنا متاح على مدار الساعة للمساعدة في أي شيء متعلق بالسفر.",
	"faq.cta": "اتصل بالدعم",
	"faq.callLabel": "اتصل بنا مباشرة",
	"faq.q1": "ما مدى سرعة استلام تذكرتي بعد الحجز؟",
	"faq.a1": "بالنسبة لمعظم الرحلات الدولية والمحلية القياسية، يتم إصدار تذكرتك الإلكترونية فور تأكيد الدفع. بالنسبة للحجوزات الجماعية أو رحلات الطيران العارض، قد تستغرق المعالجة حتى ساعتين. ستتلقى تذكرتك الإلكترونية عبر البريد الإلكتروني وواتساب فور تأكيدها.",
	"faq.q2": "ما هي الدول التي تقدمون خدمات التأشيرة لها؟",
	"faq.a2": "نقوم بمعالجة طلبات التأشيرة لأكثر من 60 دولة، بما في ذلك جميع دول شنغن، المملكة المتحدة، الولايات المتحدة، كندا، أستراليا، اليابان، وجميع دول مجلس التعاون الخليجي. يتولى فريقنا عملية التوثيق الكاملة — عليك فقط تقديم الأوراق المطلوبة.",
	"faq.q3": "هل يمكنني تعديل أو إلغاء حجزي بعد التأكيد؟",
	"faq.a3": "نعم. يتم التعامل مع التغييرات والإلغاءات وفقاً لقواعد أسعار شركة الطيران. بالنسبة للباقات المحجوزة مباشرة من خلال دانة، نقدم إلغاءً مجانياً حتى 48 ساعة قبل الرحلة الأولى. التعديلات المطلوبة قبل أكثر من 72 ساعة تتم معالجتها بدون رسوم خدمة من دانة.",
	"faq.q4": "هل تقدمون تأمين سفر مع باقاتكم؟",
	"faq.a4": "نعم. جميع باقات دانة تشمل تأمين سفر وطبي أساسي. باقات رجال الأعمال والمميزة تشمل تغطية دولية شاملة تصل إلى 750,000 ريال سعودي. يمكنك أيضاً إضافة تأمين سفر مستقل لأي حجز رحلة فقط أثناء عملية الدفع.",
	"faq.q5": "ما هي طرق الدفع التي تقبلونها؟",
	"faq.a5": "نقبل مدى، فيزا، ماستركارد، أمريكان إكسبريس، آبل باي، STC Pay، التحويل البنكي، والفوترة للشركات. جميع المعاملات مؤمنة بتشفير SSL 256-bit. خطط الدفع بالتقسيط متاحة للباقات التي تزيد عن 3,000 ريال سعودي عبر تابي وتمارا.",
	"faq.q6": "هل دانة وكالة سفر مرخصة في السعودية؟",
	"faq.a6": "نعم. دانة مرخصة بالكامل من هيئة السياحة السعودية (STA) برقم ترخيص STA-RUH-2016-0442، وتحمل اعتماد IATA النشط لإصدار التذاكر الدولية. يمكنك التحقق من أوراق اعتمادنا مباشرة على بوابة هيئة السياحة السعودية.",
	"reservation.aria": "نموذج طلب الحجز",
	"reservation.tag": "احجز",
	"reservation.title": "طلب حجز",
	"reservation.desc": "املأ تفاصيل رحلتك وسيتصل بك مستشار دانة في غضون ساعتين لتأكيد التوفر والأسعار.",
	"reservation.step1": "تفاصيل الرحلة",
	"reservation.step2": "التفضيلات",
	"reservation.step3": "تأكيد",
	"reservation.fullName": "الاسم الكامل",
	"reservation.fullName_placeholder": "مثال: محمد القحطاني",
	"reservation.phone": "رقم الهاتف",
	"reservation.phone_placeholder": "+966 5X XXX XXXX",
	"reservation.email": "البريد الإلكتروني",
	"reservation.email_placeholder": "example@example.com",
	"reservation.destination": "الوجهة",
	"reservation.destination_placeholder": "مثال: باريس، فرنسا",
	"reservation.travelDate": "تاريخ السفر",
	"reservation.travellers": "عدد المسافرين",
	"reservation.select": "اختر",
	"reservation.pax1": "شخص واحد",
	"reservation.pax2": "شخصان",
	"reservation.pax3": "3–5 أشخاص",
	"reservation.pax4": "6–10 أشخاص",
	"reservation.pax5": "مجموعة 10+",
	"reservation.packageType": "نوع الباقة",
	"reservation.pkg1": "الباقة الاقتصادية",
	"reservation.pkg2": "باقة رجال الأعمال",
	"reservation.pkg3": "الباقة المميزة",
	"reservation.pkg4": "مخصص / حسب الطلب",
	"reservation.pkg5": "رحلة فقط",
	"reservation.pkg6": "تأشيرة فقط",
	"reservation.budget": "الميزانية التقريبية",
	"reservation.budget1": "أقل من 2,000 ريال",
	"reservation.budget2": "2,000 – 5,000 ريال",
	"reservation.budget3": "5,000 – 10,000 ريال",
	"reservation.budget4": "10,000 – 20,000 ريال",
	"reservation.budget5": "أكثر من 20,000 ريال",
	"reservation.notes": "طلبات أو ملاحظات خاصة",
	"reservation.notes_placeholder": "أي متطلبات خاصة، احتياجات غذائية، شركات طيران مفضلة، تفضيلات فندقية…",
	"reservation.submit": "إرسال طلب الحجز",
	"contact.aria": "اتصل بدانة للسفر",
	"contact.tag": "اتصل بنا",
	"contact.title": "تواصل معنا",
	"contact.desc": "زرنا في وسط الرياض، أرسل رسالة عبر الإنترنت، أو اتصل بخبراء السفر لدينا — نحن دائماً مستعدون للمساعدة.",
	"contact.addressLabel": "عنوان المكتب",
	"contact.address": "شارع العليا، حي المربع<br>الرياض 12244، المملكة العربية السعودية",
	"contact.phoneLabel": "هاتف",
	"contact.whatsappLabel": "واتساب",
	"contact.emailLabel": "بريد إلكتروني",
	"contact.hoursLabel": "ساعات العمل",
	"contact.hours": "الأحد–الخميس: 8:00 ص – 9:00 م<br>الجمعة–السبت: 10:00 ص – 6:00 م",
	"contact.mapTitle": "موقع مكتب دانة للسفر على خرائط جوجل",
	"contact.formTitle": "أرسل لنا رسالة",
	"contact.formDesc": "نرد عادةً خلال 2–4 ساعات خلال ساعات العمل.",
	"contact.yourName": "اسمك",
	"contact.yourName_placeholder": "الاسم الكامل",
	"contact.yourEmail": "البريد الإلكتروني",
	"contact.yourEmail_placeholder": "example@example.com",
	"contact.yourPhone": "رقم الهاتف",
	"contact.yourPhone_placeholder": "+966 5X XXX XXXX",
	"contact.subject": "الموضوع",
	"contact.subject_placeholder": "اختر موضوعاً",
	"contact.topic1": "حجز رحلة",
	"contact.topic2": "خدمات التأشيرة",
	"contact.topic3": "باقة سياحية",
	"contact.topic4": "حجز فندق",
	"contact.topic5": "سفر الشركات",
	"contact.topic6": "شكوى / ملاحظات",
	"contact.topic7": "أخرى",
	"contact.message": "الرسالة",
	"contact.message_placeholder": "أخبرنا عن خطط سفرك أو اسألنا أي شيء…",
	"contact.send": "إرسال الرسالة",
	"footer.desc": "شريك سفرك الموثوق في وسط الرياض منذ 2016 — نصل المملكة العربية السعودية بالعالم من خلال خدمة استثنائية وقيمة لا تُضاهى.",
	"footer.services": "الخدمات",
	"footer.booking": "حجز رحلة",
	"footer.visa": "خدمات التأشيرة",
	"footer.tours": "باقات سياحية",
	"footer.hotel": "حجز فندق",
	"footer.corp": "سفر الشركات",
	"footer.reservations": "الحجوزات",
	"footer.topDests": "أفضل الوجهات",
	"footer.newsletter": "ابق على اطلاع",
	"footer.newsletter_desc": "اشترك للحصول على عروض حصرية وعروض مبكرة وإلهام للسفر مباشرة إلى بريدك الوارد.",
	"footer.placeholder": "أدخل بريدك الإلكتروني…",
	"footer.subscribe": "اشتراك",
	"footer.nospam": "لا بريد مزعج أبداً. يمكنك إلغاء الاشتراك في أي وقت.",
	"footer.sta": "مرخصة من STA",
	"footer.iata": "معتمدة من IATA",
	"footer.ssl": "مؤمنة بـ SSL",
	"footer.copy": "© 2026 دانة للسفر والسياحة. جميع الحقوق محفوظة. | رخصة STA #STA-RUH-2016-0442",
	"footer.privacy": "سياسة الخصوصية",
	"footer.terms": "شروط الخدمة",
	"footer.cookies": "سياسة الكوكيز",
	"nav.reservation": "احجز",
	"reservation.hero.tag": "أمن رحلتك",
	"reservation.hero.title": "طلب حجز",
	"reservation.hero.desc": "املأ تفاصيل رحلتك وسيتصل بك مستشار دانة في غضون ساعتين لتأكيد التوفر والأسعار.",
	"reservation.step1.personal": "المعلومات الشخصية",
	"reservation.step2.trip": "تفاصيل الرحلة",
	"reservation.step3.confirm": "تأكيد",
	"reservation.form.personal_title": "المعلومات الشخصية",
	"reservation.form.trip_title": "تفاصيل الرحلة",
	"reservation.form.confirm_title": "تأكيد طلبك",
	"reservation.preferred_contact": "طريقة التواصل المفضلة",
	"reservation.contact_phone": "الهاتف",
	"reservation.contact_whatsapp": "واتساب",
	"reservation.contact_email": "البريد الإلكتروني",
	"reservation.returnDate": "تاريخ العودة (اختياري)",
	"reservation.btn_next": "التالي",
	"reservation.btn_prev": "رجوع",
	"reservation.btn_review": "مراجعة",
	"reservation.agree_terms_html": "أوافق على <a href='#'>شروط الخدمة</a> و <a href='#'>سياسة الخصوصية</a>."
  }
};

// ---- I18N APPLY TRANSLATIONS ----
function applyTranslations(lang) {
  // Get the dictionary for the chosen language (fallback to English if missing)
  const dict = danahI18n[lang] || danahI18n.en;

  // 1. Elements with data-i18n (plain text)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  // 2. Elements with data-i18n-html (innerHTML, for <br>, <strong>, etc.)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });

  // 3. Elements with data-i18n-alt (image alt attributes)
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    if (dict[key] !== undefined) {
      el.setAttribute('alt', dict[key]);
    }
  });

  // 4. Elements with data-i18n-placeholder (input placeholders)
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // 5. Elements with data-i18n-aria-label
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (dict[key] !== undefined) {
      el.setAttribute('aria-label', dict[key]);
    }
  });

  // 6. Elements with data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (dict[key] !== undefined) {
      el.setAttribute('title', dict[key]);
    }
  });
}

// ---- INITIAL LANGUAGE ----
(function initI18n() {
  const savedLang = localStorage.getItem('danah-lang') || 'en';
  applyTranslations(savedLang);
})();

// ---- UPDATE LANGUAGE WHEN SWITCHED ----
// Modify your existing switchLang function (or add an event listener)
window.addEventListener('danah-lang-change', (e) => {
  applyTranslations(e.detail.lang);
});

  // ---- RESERVATION STEPPER ----
  let currentStep = 1;
  const steps = document.querySelectorAll('.res-step-content');
  const stepIndicators = document.querySelectorAll('.res-step');

  function showStep(step) {
    steps.forEach((s, i) => s.style.display = (i+1 === step) ? 'block' : 'none');
    stepIndicators.forEach((ind, i) => {
      if (i+1 === step) ind.classList.add('done');
      else if (i+1 < step) ind.classList.add('done');
      else ind.classList.remove('done');
    });
    currentStep = step;
  }

  document.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const next = parseInt(btn.dataset.next);
      if (validateStep(currentStep)) {
        showStep(next);
        if (next === 3) generateSummary();
      }
    });
  });
  document.querySelectorAll('.prev-step').forEach(btn => {
    btn.addEventListener('click', (e) => {
      showStep(parseInt(btn.dataset.prev));
    });
  });

  function validateStep(step) {
    if (step === 1) {
      const name = document.getElementById('res-fullname')?.value.trim();
      const phone = document.getElementById('res-phone')?.value.trim();
      const email = document.getElementById('res-email')?.value.trim();
      if (!name || !phone || !email) {
        alert('Please fill in all required fields.');
        return false;
      }
      return true;
    }
    if (step === 2) {
      const dest = document.getElementById('res-destination')?.value.trim();
      const date = document.getElementById('res-travel-date')?.value;
      const travellers = document.getElementById('res-travellers')?.value;
      if (!dest || !date || !travellers) {
        alert('Please fill in destination, travel date, and number of travellers.');
        return false;
      }
      return true;
    }
    return true;
  }

  function generateSummary() {
    const name = document.getElementById('res-fullname')?.value;
    const phone = document.getElementById('res-phone')?.value;
    const email = document.getElementById('res-email')?.value;
    const dest = document.getElementById('res-destination')?.value;
    const travelDate = document.getElementById('res-travel-date')?.value;
    const travellers = document.getElementById('res-travellers')?.options[document.getElementById('res-travellers')?.selectedIndex]?.text;
    const pkg = document.getElementById('res-package')?.options[document.getElementById('res-package')?.selectedIndex]?.text;
    const notes = document.getElementById('res-notes')?.value;
    const summaryDiv = document.getElementById('reservation-summary');
    if (summaryDiv) {
      summaryDiv.innerHTML = `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Destination:</strong> ${dest}</p>
        <p><strong>Travel Date:</strong> ${travelDate}</p>
        <p><strong>Travellers:</strong> ${travellers}</p>
        <p><strong>Package:</strong> ${pkg}</p>
        <p><strong>Notes:</strong> ${notes || '—'}</p>
      `;
    }
  }

  document.getElementById('submit-reservation')?.addEventListener('click', () => {
    if (!document.getElementById('agree-terms')?.checked) {
      alert('Please agree to the terms and conditions.');
      return;
    }
    if (!validateStep(2)) return;
    // Simulate submission
    const msgDiv = document.getElementById('res-msg');
    msgDiv.style.display = 'block';
    msgDiv.className = 'form-msg ok';
    msgDiv.innerHTML = '<i class="fas fa-check-circle me-2"></i>Reservation request sent! A Danah consultant will contact you within 2 hours.';
    // Optionally reset or redirect
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);
  });

  // ---- Theme toggle etc. ----
})();