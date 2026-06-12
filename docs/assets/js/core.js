(function () {
  'use strict';
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

/* ---- 15. NEWSLETTER FORM -------------------------------- */
const nlBtn = document.querySelector('.nl-btn');
if (nlBtn) {
  nlBtn.addEventListener('click', () => {
  const input = document.querySelector('.nl-input');
  const email = input.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (isValid) {
    input.value = '';
    input.style.borderColor = '';
    // Brief success flash
    const btn = document.querySelector('.nl-btn');
    const orig = btn.textContent;
    btn.textContent = '✓ Subscribed!';
    btn.style.background = '#10B981';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
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
function switchLang(lang) {
  const enOrb = document.getElementById('lang-en');
  const arOrb = document.getElementById('lang-ar');

  // Visual active state
  if (lang === 'en') {
    enOrb.style.borderColor = 'var(--blue)';
    arOrb.style.borderColor = 'transparent';
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'ltr');
    localStorage.setItem('danah-lang', 'en');
  } else if (lang === 'ar') {
    arOrb.style.borderColor = 'var(--blue)';
    enOrb.style.borderColor = 'transparent';
    document.documentElement.setAttribute('lang', 'ar');
    document.documentElement.setAttribute('dir', 'rtl');
    localStorage.setItem('danah-lang', 'ar');
  }

  // Optional: dispatch event for i18n system
  window.dispatchEvent(new CustomEvent('danah-lang-change', { detail: { lang } }));
}

// EXPOSE TO GLOBAL SCOPE FOR INLINE HTML ONCLICK
window.switchLang = switchLang;

// Initialise language from localStorage on page load
(function initLang() {
  const saved = localStorage.getItem('danah-lang') || 'en';
  switchLang(saved);
})();

/* ---- 20. SHOPPING CART ----------------------------------- */
function toggleCart() {
  // Create a simple dropdown cart panel (first call)
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
    document.getElementById('cart-icon').appendChild(cartPanel);
  } else {
    cartPanel.remove();
  }
}

// EXPOSE TO GLOBAL SCOPE FOR INLINE HTML ONCLICK
window.toggleCart = toggleCart;

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

// EXPOSE UTILITIES TO GLOBAL SCOPE FOR CONSOLE TESTING
window.toggleCart = toggleCart;
window.updateCartCount = updateCartCount;
window.showCartIcon = showCartIcon;

// Example: call showCartIcon(true) on store.html, showCartIcon(false) on index.html
showCartIcon(true); // hide on homepage by default

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
	"logo_sub": "Travel & Tourism",
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
	"login.brandSub": "Travel & Tourism",
	"login.welcomeTitle": "Welcome back",
	"login.welcomeSub": "Login to manage your trips & exclusive offers",
	"login.emailLabel": "Email or Username",
	"login.emailPlaceholder": "client@danahtravel.sa",
	"login.passwordLabel": "Password",
	"login.passwordPlaceholder": "••••••••",
	"login.forgotLink": "Forgot?",
	"login.rememberMe": "Remember me",
	"login.submitBtn": "Login to Account",
	"login.dividerText": "OR CONTINUE WITH",
	"login.google": "Google",
	"login.facebook": "Facebook",
	"login.apple": "Apple",
	"login.signupTextPrefix": "Don’t have an account?",
	"login.signupLink": "Create free account",
	"packages.hero.aria": "Packages and Pricing",
	"packages.breadcrumb.home": "Home",
	"packages.breadcrumb.sep": "›",
	"packages.breadcrumb.current": "Packages & Pricing",
	"packages.hero.eyebrow": "Transparent Pricing",
	"packages.hero.title": "The Right Package<br>for <span class=\"hl\">Every Journey</span>",
	"packages.hero.sub": "All-inclusive travel packages with zero hidden fees — from economy getaways to premium first-class experiences. Departing from Riyadh to the world.",
	"packages.quicknav.packages": "Packages",
	"packages.quicknav.calculator": "Price Calculator",
	"packages.quicknav.destinations": "Destination Prices",
	"packages.quicknav.addons": "Add-Ons",
	"packages.quicknav.membership": "Membership",
	"packages.trust.priceMatch.value": "100%",
	"packages.trust.priceMatch.label": "Price Match Guarantee",
	"packages.trust.cancellation.value": "Free",
	"packages.trust.cancellation.label": "Cancellation (48 hrs)",
	"packages.trust.ssl.value": "256-bit",
	"packages.trust.ssl.label": "SSL Encryption",
	"packages.trust.support.value": "24/7",
	"packages.trust.support.label": "Expert Support",
	"packages.trust.visa.value": "98.4%",
	"packages.trust.visa.label": "Visa Approval Rate",
	"packages.feature1.title": "Best Price Guaranteed",
	"packages.feature1.desc": "We match any comparable quote",
	"packages.feature2.title": "Instant E-Tickets",
	"packages.feature2.desc": "Confirmed in minutes",
	"packages.feature3.title": "85+ Destinations",
	"packages.feature3.desc": "All major airlines & routes",
	"packages.feature4.title": "4.9★ Rated Agency",
	"packages.feature4.desc": "12,000+ happy clients",
	"packages.section.tag": "Our Packages",
	"packages.section.title": "All-Inclusive Travel Packages",
	"packages.section.sub": "Every package includes flights, accommodation, and transfers. No surprises at checkout.",
	"packages.nights.7": "7 Nights",
	"packages.nights.10": "10 Nights",
	"packages.nights.14": "14 Nights",
	"packages.annualBadge": "<i class=\"fas fa-fire me-1\"></i>Book before Aug 31 → save 15%",
	"packages.economy.name": "Economy Explorer",
	"packages.economy.perPersonNights": "per person · <span class=\"pkg-nights\">7</span> nights",
	"packages.economy.desc": "Perfect for solo travellers and couples exploring popular Gulf and regional destinations on a smart budget.",
	"packages.economy.feats.flights": "Economy class flights (2 checked bags)",
	"packages.economy.feats.hotel": "3-star hotel accommodation",
	"packages.economy.feats.transfers": "Shared airport transfers",
	"packages.economy.feats.insurance": "Basic travel insurance",
	"packages.economy.feats.support": "24/7 customer support",
	"packages.economy.feats.visa": "Visa processing",
	"packages.economy.feats.tours": "Guided tours",
	"packages.economy.feats.meals": "Meals included",
	"packages.economy.btn": "Book Economy",
	"packages.business.popular": "Most Popular",
	"packages.business.name": "Business Traveller",
	"packages.business.perPersonNights": "per person · <span class=\"pkg-nights\">7</span> nights",
	"packages.business.desc": "The ideal balance of comfort and value for families and frequent travellers wanting the full experience.",
	"packages.business.feats.flights": "Business class flights (30kg bags)",
	"packages.business.feats.hotel": "5-star hotel accommodation",
	"packages.business.feats.transfers": "Private airport transfers",
	"packages.business.feats.insurance": "Premium travel insurance",
	"packages.business.feats.visa": "Visa processing included",
	"packages.business.feats.tours": "2 guided city tours",
	"packages.business.feats.meals": "Breakfast & dinner daily",
	"packages.business.feats.lounge": "Airport lounge access",
	"packages.business.btn": "Book Business",
	"packages.premium.name": "Premium Elite",
	"packages.premium.perPersonNights": "per person · <span class=\"pkg-nights\">7</span> nights",
	"packages.premium.desc": "Total luxury from door to door. First-class flights, five-star resorts, and a personal concierge dedicated to every detail.",
	"packages.premium.feats.flights": "First class flights (40kg bags)",
	"packages.premium.feats.hotel": "Luxury resort suite",
	"packages.premium.feats.transfers": "Limousine transfers",
	"packages.premium.feats.insurance": "VIP comprehensive insurance",
	"packages.premium.feats.visa": "Express visa processing",
	"packages.premium.feats.tours": "Unlimited private tours",
	"packages.premium.feats.meals": "All meals, drinks & minibar",
	"packages.premium.feats.lounge": "Airport lounge access (worldwide)",
	"packages.premium.btn": "Book Premium",
	"packages.compareBtn": "Compare All Features",
	"packages.compare.feature": "Feature",
	"packages.compare.economy": "Economy",
	"packages.compare.business": "Business",
	"packages.compare.premium": "Premium",
	"packages.compare.cat.flights": "✈️ Flights & Transport",
	"packages.compare.cabin": "Cabin class",
	"packages.compare.cabin_economy": "Economy",
	"packages.compare.cabin_business": "Business",
	"packages.compare.cabin_first": "First Class",
	"packages.compare.baggage": "Checked baggage",
	"packages.compare.baggage_economy": "20 kg",
	"packages.compare.baggage_business": "30 kg",
	"packages.compare.baggage_premium": "40 kg",
	"packages.compare.seat": "Seat selection",
	"packages.compare.seat_priority": "Priority",
	"packages.compare.lounge": "Airport lounge",
	"packages.compare.lounge_worldwide": "Worldwide",
	"packages.compare.transfer": "Airport transfer type",
	"packages.compare.transfer_shared": "Shared shuttle",
	"packages.compare.transfer_private": "Private car",
	"packages.compare.transfer_limo": "Limousine",
	"packages.compare.date_change": "Flexible date changes",
	"packages.compare.cat.hotel": "🏨 Accommodation",
	"packages.compare.hotel_category": "Hotel category",
	"packages.compare.hotel_3star": "3-star",
	"packages.compare.hotel_5star": "5-star",
	"packages.compare.hotel_luxury": "Luxury resort",
	"packages.compare.room_type": "Room type",
	"packages.compare.room_standard": "Standard",
	"packages.compare.room_deluxe": "Deluxe",
	"packages.compare.room_suite": "Suite",
	"packages.compare.breakfast": "Breakfast",
	"packages.compare.full_board": "Full Board",
	"packages.compare.minibar": "Minibar / drinks",
	"packages.compare.included": "Included",
	"packages.compare.cat.services": "🛂 Services & Extras",
	"packages.compare.visa": "Visa processing",
	"packages.compare.visa_standard": "Standard",
	"packages.compare.visa_express": "Express (24h)",
	"packages.compare.insurance": "Travel insurance",
	"packages.compare.insurance_basic": "Basic",
	"packages.compare.insurance_premium": "Premium",
	"packages.compare.insurance_vip": "VIP (SAR 750K)",
	"packages.compare.tours": "Guided tours",
	"packages.compare.tours_2": "2 tours",
	"packages.compare.tours_unlimited": "Unlimited private",
	"packages.compare.sim": "Travel SIM card",
	"packages.compare.photography": "Photography session",
	"packages.compare.photography_2h": "2 hours",
	"packages.compare.cat.support": "🎧 Support & Concierge",
	"packages.compare.support_availability": "Support availability",
	"packages.compare.support_247": "24/7",
	"packages.compare.support_priority": "24/7 Priority",
	"packages.compare.support_dedicated": "Dedicated agent",
	"packages.compare.concierge": "Concierge service",
	"packages.compare.concierge_vip": "VIP 24/7",
	"packages.compare.emergency_line": "Emergency line",
	"packages.compare.price_match": "Price match guarantee",
	"packages.compare.cancellation": "Free cancellation window",
	"packages.compare.cancellation_24h": "24 hours",
	"packages.compare.cancellation_48h": "48 hours",
	"packages.compare.cancellation_7d": "7 days",
	"packages.calculator.tag": "Cost Calculator",
	"packages.calculator.title": "Build Your Trip, See the Price",
	"packages.calculator.sub": "Adjust any detail and watch your estimated cost update in real time. All prices depart from Riyadh.",
	"packages.calculator.details_title": "Trip Details",
	"packages.calculator.destination_region": "Destination Region",
	"packages.calculator.region.gulf": "Gulf & Middle East",
	"packages.calculator.region.europe": "Europe",
	"packages.calculator.region.asia": "Asia & Pacific",
	"packages.calculator.region.americas": "Americas",
	"packages.calculator.region.africa": "Africa",
	"packages.calculator.cabin_class": "Cabin Class",
	"packages.calculator.cabin.economy": "Economy",
	"packages.calculator.cabin.premium_eco": "Premium Economy",
	"packages.calculator.cabin.business": "Business Class",
	"packages.calculator.cabin.first": "First Class",
	"packages.calculator.hotel_rating": "Hotel Rating",
	"packages.calculator.hotel.3star": "3-Star Hotel",
	"packages.calculator.hotel.4star": "4-Star Hotel",
	"packages.calculator.hotel.5star": "5-Star Hotel",
	"packages.calculator.hotel.luxury": "Luxury Resort",
	"packages.calculator.travel_month": "Travel Month",
	"packages.calculator.month.jan": "January",
	"packages.calculator.month.feb": "February",
	"packages.calculator.month.mar": "March",
	"packages.calculator.month.apr": "April",
	"packages.calculator.month.may": "May",
	"packages.calculator.month.jun": "June",
	"packages.calculator.month.jul": "July",
	"packages.calculator.month.aug": "August",
	"packages.calculator.month.sep": "September",
	"packages.calculator.month.oct": "October",
	"packages.calculator.month.nov": "November",
	"packages.calculator.month.dec": "December",
	"packages.calculator.passengers": "Passengers",
	"packages.calculator.duration": "Trip Duration (nights)",
	"packages.calculator.duration.3": "3 nights",
	"packages.calculator.duration.5": "5 nights",
	"packages.calculator.duration.7": "7 nights",
	"packages.calculator.duration.10": "10 nights",
	"packages.calculator.duration.14": "14 nights",
	"packages.calculator.duration.21": "21 nights",
	"packages.calculator.addons_title": "Add-On Services",
	"packages.calculator.addons.visa": "Visa Processing",
	"packages.calculator.addons.visa_price": "SAR 500/pax",
	"packages.calculator.addons.insurance": "Travel Insurance",
	"packages.calculator.addons.insurance_price": "SAR 150/pax",
	"packages.calculator.addons.tours": "Guided Tours",
	"packages.calculator.addons.tours_price": "SAR 400/pax",
	"packages.calculator.addons.transfers": "Private Transfers",
	"packages.calculator.addons.transfers_price": "SAR 280/trip",
	"packages.calculator.addons.sim": "Travel SIM Card",
	"packages.calculator.addons.sim_price": "SAR 89/pax",
	"packages.calculator.addons.lounge": "Airport Lounge",
	"packages.calculator.addons.lounge_price": "SAR 180/pax",
	"packages.calculator.result.title": "Your Trip Estimate",
	"packages.calculator.result.flights": "Round-trip flights",
	"packages.calculator.result.hotel": "Hotel",
	"packages.calculator.result.visa": "Visa processing",
	"packages.calculator.result.insurance": "Insurance",
	"packages.calculator.result.addons": "Optional add-ons",
	"packages.calculator.result.service_fee": "Danah service fee (5%)",
	"packages.calculator.result.total_label": "Estimated Total",
	"packages.calculator.result.per_person": "Per person: SAR —",
	"packages.calculator.result.currency": "SAR",
	"packages.calculator.discount_note": "Book before <strong style=\"color:var(--amber);\">31 Aug 2026</strong> with code <strong style=\"color:var(--amber);\">DANAH15</strong> and save 15% on this estimate.",
	"packages.calculator.result.note": "Estimate based on average seasonal pricing. Actual fares may vary by airline availability, date, and current promotions. Visa fees shown for Saudi passport holders.",
	"packages.calculator.get_quote_btn": "Get a Confirmed Quote",
	"packages.destinations.aria": "Destination pricing",
	"packages.destinations.tag": "Destination Prices",
	"packages.destinations.title": "Flight Prices from Riyadh",
	"packages.destinations.sub": "Economy one-way fares and 7-night package starting prices. All prices depart from King Khalid International Airport (RUH).",
	"packages.destinations.search_placeholder": "Search destination…",
	"packages.destinations.filter_all": "All Destinations",
	"packages.destinations.filter_gulf": "Gulf",
	"packages.destinations.filter_europe": "Europe",
	"packages.destinations.filter_asia": "Asia",
	"packages.destinations.filter_americas": "Americas",
	"packages.destinations.filter_africa": "Africa",
	"packages.addons.tag": "Add-Ons",
	"packages.addons.title": "Enhance Your Trip",
	"packages.addons.sub": "Add any of these services to your existing package or standalone booking. All add-ons can be booked up to 48 hours before departure.",
	"packages.addons.insurance.name": "Travel Insurance",
	"packages.addons.insurance.desc": "Comprehensive medical, trip cancellation, lost baggage, and emergency repatriation coverage. Three tiers available.",
	"packages.addons.from_price": "Starting from",
	"packages.addons.per_person": " / person",
	"packages.addons.add_btn": "Add",
	"packages.addons.lounge.name": "Airport Lounge Access",
	"packages.addons.lounge.desc": "Access to premium airport lounges worldwide including hot meals, Wi-Fi, showers, and dedicated check-in. Valid for both departure and arrival.",
	"packages.addons.per_person_label": "Per person",
	"packages.addons.transfer.name": "Private Airport Transfer",
	"packages.addons.transfer.desc": "Door-to-door private vehicle pickup and drop-off at your destination. Available as sedan (1-3 pax), SUV (4-6 pax), or minivan (7-12 pax).",
	"packages.addons.per_trip_from": "Per trip from",
	"packages.addons.photography.name": "Professional Photography",
	"packages.addons.photography.desc": "A local professional photographer accompanies you for a 2-hour session. Perfect for anniversaries, honeymoons, and family trips. Edited photos delivered within 48 hours.",
	"packages.addons.per_session": "Per session",
	"packages.addons.tours.name": "Guided City Tours",
	"packages.addons.tours.desc": "Half-day or full-day private guided tours with an English or Arabic speaking guide. Covers major sights, hidden gems, and local food experiences.",
	"packages.addons.per_person_from": "Per person from",
	"packages.addons.sim.name": "International Travel SIM",
	"packages.addons.sim.desc": "Unlimited data SIM card valid for your destination country. Delivered to your home address or available at the airport before departure. No roaming fees.",
	"packages.addons.express_visa.name": "Express Visa Processing",
	"packages.addons.express_visa.desc": "Standard visa is included in Business & Premium packages. For Economy or standalone bookings, our team handles all documentation with a 98.4% approval rate.",
	"packages.addons.standard_from": "Standard from",
	"packages.addons.honeymoon.name": "Honeymoon & Special Occasions",
	"packages.addons.honeymoon.desc": "Room upgrades, rose petals, celebration cake, couples spa credit (SAR 400), and a champagne welcome. Available for any package with prior notice.",
	"packages.addons.per_booking": "Per booking",
	"packages.membership.aria": "Danah membership plans",
	"packages.membership.tag": "Danah Membership",
	"packages.membership.title": "Travel More, Pay Less",
	"packages.membership.sub": "Subscribe to a Danah membership and unlock permanent discounts, priority booking, and a dedicated travel consultant.",
	"packages.membership.annual": "Annual",
	"packages.membership.monthly": "Monthly",
	"packages.membership.save_badge": "Save 17% annually",
	"packages.membership.free.tier": "Explorer · Free",
	"packages.membership.free.desc": "Create a free account, manage your bookings online, and receive our weekly deals newsletter.",
	"packages.membership.free.feats.account": "Online account & booking history",
	"packages.membership.free.feats.newsletter": "Weekly deals newsletter",
	"packages.membership.free.feats.support": "Standard email support",
	"packages.membership.free.feats.price_match": "Price match guarantee",
	"packages.membership.free.feats.discounts": "Package discounts",
	"packages.membership.free.feats.early_access": "Early access to deals",
	"packages.membership.free.feats.dedicated": "Dedicated consultant",
	"packages.membership.free.btn": "Create Free Account",
	"packages.membership.gold.popular": "Best Value",
	"packages.membership.gold.tier": "Gold Member",
	"packages.membership.gold.desc": "Perfect for travellers who book 2–4 trips per year. Early deal access alone pays for the membership.",
	"packages.membership.gold.feats.everything": "Everything in Explorer",
	"packages.membership.gold.feats.discount": "5% off",
	"packages.membership.gold.feats.all_packages": "all packages & flights",
	"packages.membership.gold.feats.early": "48-hour early access to deals",
	"packages.membership.gold.feats.visa_consult": "Free visa consultation",
	"packages.membership.gold.feats.priority_support": "Priority phone support",
	"packages.membership.gold.feats.free_transfer": "Free airport transfer (1×/year)",
	"packages.membership.gold.feats.dedicated_consultant": "Dedicated consultant",
	"packages.membership.gold.btn": "Join Gold",
	"packages.membership.platinum.tier": "Platinum Elite",
	"packages.membership.platinum.desc": "For frequent travellers and corporate clients who demand the best — and the fastest — every time.",
	"packages.membership.platinum.feats.everything": "Everything in Gold",
	"packages.membership.platinum.feats.discount": "12% off",
	"packages.membership.platinum.feats.all": "all packages & flights",
	"packages.membership.platinum.feats.flash": "Exclusive flash deals (24h head start)",
	"packages.membership.platinum.feats.free_visa": "Free visa processing (2×/year)",
	"packages.membership.platinum.feats.dedicated": "Dedicated personal consultant",
	"packages.membership.platinum.feats.lounge": "Airport lounge access included",
	"packages.membership.platinum.feats.upgrade": "Free hotel upgrade requests",
	"packages.membership.platinum.btn": "Join Platinum",
	"packages.membership.guarantee": "All memberships include a 30-day money-back guarantee. Cancel anytime.",
	"packages.alert.aria": "Price alerts",
	"packages.alert.title": "Never Miss a Deal",
	"packages.alert.sub": "Set a price alert for your dream destination. We'll notify you the moment fares drop below your target — so you book at the perfect moment.",
	"packages.alert.dest_placeholder": "Any destination",
	"packages.alert.any_destination": "Any destination",
	"packages.alert.email_placeholder": "Enter your email address…",
	"packages.alert.submit_btn": "Set Alert",
	"packages.alert.footer": "No spam. Unsubscribe anytime. Join 4,800+ travellers already using price alerts.",
	"packages.cta.tag": "Limited Time",
	"packages.cta.title": "Ready to Book Your Next Adventure?",
	"packages.cta.desc": "Use code <strong>DANAH15</strong> before 31 August 2026 and save 15% on any international package.",
	"packages.cta.btn1": "Book Now & Save 15%",
	"packages.cta.btn2": "Talk to an Expert"
  },
  ar: {
    "logo_sub": "للسفر والسياحة",
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
	"login.brandSub": "للسفر والسياحة",
	"login.welcomeTitle": "مرحباً بعودتك",
	"login.welcomeSub": "تسجيل الدخول لإدارة رحلاتك وعروضك الحصرية",
	"login.emailLabel": "البريد الإلكتروني أو اسم المستخدم",
	"login.emailPlaceholder": "client@danahtravel.sa",
	"login.passwordLabel": "كلمة المرور",
	"login.passwordPlaceholder": "••••••••",
	"login.forgotLink": "نسيت كلمة المرور؟",
	"login.rememberMe": "تذكرني",
	"login.submitBtn": "تسجيل الدخول",
	"login.dividerText": "أو عبر",
	"login.google": "جوجل",
	"login.facebook": "فيسبوك",
	"login.apple": "أبل",
	"login.signupTextPrefix": "ليس لديك حساب؟",
	"login.signupLink": "إنشاء حساب مجاني",
	"login.secureNote": "تسجيل دخول آمن • محمي بـ SSL",
	"packages.hero.aria": "الباقات والأسعار",
	"packages.breadcrumb.home": "الرئيسية",
	"packages.breadcrumb.sep": "›",
	"packages.breadcrumb.current": "الباقات والأسعار",
	"packages.hero.eyebrow": "أسعار شفافة",
	"packages.hero.title": "الباقة المناسبة<br>لكل <span class=\"hl\">رحلة</span>",
	"packages.hero.sub": "باقات سفر شاملة بدون رسوم خفية — من الرحلات الاقتصادية إلى تجارب الدرجة الأولى الفاخرة. المغادرة من الرياض إلى العالم.",
	"packages.quicknav.packages": "الباقات",
	"packages.quicknav.calculator": "حاسبة الأسعار",
	"packages.quicknav.destinations": "أسعار الوجهات",
	"packages.quicknav.addons": "إضافات",
	"packages.quicknav.membership": "العضوية",
	"packages.trust.priceMatch.value": "١٠٠٪",
	"packages.trust.priceMatch.label": "ضمان مطابقة السعر",
	"packages.trust.cancellation.value": "مجاني",
	"packages.trust.cancellation.label": "إلغاء (٤٨ ساعة)",
	"packages.trust.ssl.value": "٢٥٦ بت",
	"packages.trust.ssl.label": "تشفير SSL",
	"packages.trust.support.value": "٢٤/٧",
	"packages.trust.support.label": "دعم خبراء",
	"packages.trust.visa.value": "٩٨.٤٪",
	"packages.trust.visa.label": "نسبة قبول التأشيرات",
	"packages.feature1.title": "أفضل سعر مضمون",
	"packages.feature1.desc": "نطابق أي عرض مماثل",
	"packages.feature2.title": "تذاكر فورية",
	"packages.feature2.desc": "تأكيد في دقائق",
	"packages.feature3.title": "+٨٥ وجهة",
	"packages.feature3.desc": "جميع شركات الطيران الكبرى",
	"packages.feature4.title": "وكالة بتقييم ٤.٩★",
	"packages.feature4.desc": "+١٢,٠٠٠ عميل سعيد",
	"packages.section.tag": "باقاتنا",
	"packages.section.title": "باقات سفر شاملة",
	"packages.section.sub": "كل باقة تشمل الرحلات، الإقامة، والتنقلات. لا مفاجآت عند الدفع.",
	"packages.nights.7": "٧ ليال",
	"packages.nights.10": "١٠ ليال",
	"packages.nights.14": "١٤ ليلة",
	"packages.annualBadge": "<i class=\"fas fa-fire me-1\"></i>احجز قبل ٣١ أغسطس → وفر ١٥٪",
	"packages.economy.name": "الاقتصادي إكسبلورر",
	"packages.economy.perPersonNights": "للشخص · <span class=\"pkg-nights\">٧</span> ليال",
	"packages.economy.desc": "مثالي للمسافرين المنفردين والأزواج الذين يستكشفون وجهات الخليج والمنطقة بميزانية ذكية.",
	"packages.economy.feats.flights": "رحلات درجة اقتصادية (حقيبتان مشمولتان)",
	"packages.economy.feats.hotel": "فندق ٣ نجوم",
	"packages.economy.feats.transfers": "تنقلات مشتركة من وإلى المطار",
	"packages.economy.feats.insurance": "تأمين سفر أساسي",
	"packages.economy.feats.support": "دعم عملاء ٢٤/٧",
	"packages.economy.feats.visa": "معالجة التأشيرة",
	"packages.economy.feats.tours": "جولات إرشادية",
	"packages.economy.feats.meals": "وجبات مشمولة",
	"packages.economy.btn": "احجز الاقتصادي",
	"packages.business.popular": "الأكثر طلباً",
	"packages.business.name": "مسافر الأعمال",
	"packages.business.perPersonNights": "للشخص · <span class=\"pkg-nights\">٧</span> ليال",
	"packages.business.desc": "التوازن المثالي بين الراحة والقيمة للعائلات والمسافرين الدائمين الذين يريدون تجربة كاملة.",
	"packages.business.feats.flights": "رحلات درجة رجال الأعمال (٣٠ كجم)",
	"packages.business.feats.hotel": "فندق ٥ نجوم",
	"packages.business.feats.transfers": "تنقلات خاصة من وإلى المطار",
	"packages.business.feats.insurance": "تأمين سفر مميز",
	"packages.business.feats.visa": "معالجة التأشيرة مشمولة",
	"packages.business.feats.tours": "جولتان إرشاديتان في المدينة",
	"packages.business.feats.meals": "إفطار وعشاء يومياً",
	"packages.business.feats.lounge": "دخول صالة المطار",
	"packages.business.btn": "احجز رجال الأعمال",
	"packages.premium.name": "النخبة الممتازة",
	"packages.premium.perPersonNights": "للشخص · <span class=\"pkg-nights\">٧</span> ليال",
	"packages.premium.desc": "رفاهية كاملة من الباب إلى الباب. رحلات درجة أولى، منتجعات خمس نجوم، وكونسيرج شخصي يعتني بكل التفاصيل.",
	"packages.premium.feats.flights": "رحلات درجة أولى (٤٠ كجم)",
	"packages.premium.feats.hotel": "جناح منتجع فاخر",
	"packages.premium.feats.transfers": "تنقلات بليموزين",
	"packages.premium.feats.insurance": "تأمين شامل VIP",
	"packages.premium.feats.visa": "معالجة تأشيرة سريعة",
	"packages.premium.feats.tours": "جولات خاصة غير محدودة",
	"packages.premium.feats.meals": "جميع الوجبات والمشروبات والميني بار",
	"packages.premium.feats.lounge": "دخول صالات المطار (عالمياً)",
	"packages.premium.btn": "احجز الممتازة",
	"packages.compareBtn": "مقارنة جميع الميزات",
	"packages.compare.feature": "الميزة",
	"packages.compare.economy": "اقتصادي",
	"packages.compare.business": "رجال أعمال",
	"packages.compare.premium": "ممتاز",
	"packages.compare.cat.flights": "✈️ الرحلات والتنقلات",
	"packages.compare.cabin": "درجة السفر",
	"packages.compare.cabin_economy": "اقتصادي",
	"packages.compare.cabin_business": "رجال أعمال",
	"packages.compare.cabin_first": "درجة أولى",
	"packages.compare.baggage": "الوزن المسموح",
	"packages.compare.baggage_economy": "٢٠ كجم",
	"packages.compare.baggage_business": "٣٠ كجم",
	"packages.compare.baggage_premium": "٤٠ كجم",
	"packages.compare.seat": "اختيار المقعد",
	"packages.compare.seat_priority": "أولوية",
	"packages.compare.lounge": "صالة المطار",
	"packages.compare.lounge_worldwide": "عالمياً",
	"packages.compare.transfer": "نوع التنقل من المطار",
	"packages.compare.transfer_shared": "حافلة مشتركة",
	"packages.compare.transfer_private": "سيارة خاصة",
	"packages.compare.transfer_limo": "ليموزين",
	"packages.compare.date_change": "تغيير المواعيد بمرونة",
	"packages.compare.cat.hotel": "🏨 الإقامة",
	"packages.compare.hotel_category": "فئة الفندق",
	"packages.compare.hotel_3star": "٣ نجوم",
	"packages.compare.hotel_5star": "٥ نجوم",
	"packages.compare.hotel_luxury": "منتجع فاخر",
	"packages.compare.room_type": "نوع الغرفة",
	"packages.compare.room_standard": "قياسية",
	"packages.compare.room_deluxe": "ديلوكس",
	"packages.compare.room_suite": "جناح",
	"packages.compare.breakfast": "وجبة الإفطار",
	"packages.compare.full_board": "إقامة كاملة",
	"packages.compare.minibar": "ميني بار / مشروبات",
	"packages.compare.included": "مشمول",
	"packages.compare.cat.services": "🛂 الخدمات والإضافات",
	"packages.compare.visa": "معالجة التأشيرة",
	"packages.compare.visa_standard": "عادي",
	"packages.compare.visa_express": "سريع (٢٤ ساعة)",
	"packages.compare.insurance": "تأمين السفر",
	"packages.compare.insurance_basic": "أساسي",
	"packages.compare.insurance_premium": "مميز",
	"packages.compare.insurance_vip": "VIP (٧٥٠,٠٠٠ ريال)",
	"packages.compare.tours": "جولات إرشادية",
	"packages.compare.tours_2": "جولتان",
	"packages.compare.tours_unlimited": "غير محدودة خاصة",
	"packages.compare.sim": "شريحة SIM للسفر",
	"packages.compare.photography": "جلسة تصوير",
	"packages.compare.photography_2h": "ساعتان",
	"packages.compare.cat.support": "🎧 الدعم والكونسيرج",
	"packages.compare.support_availability": "توفر الدعم",
	"packages.compare.support_247": "٢٤/٧",
	"packages.compare.support_priority": "أولوية ٢٤/٧",
	"packages.compare.support_dedicated": "وكيل مخصص",
	"packages.compare.concierge": "خدمة الكونسيرج",
	"packages.compare.concierge_vip": "VIP ٢٤/٧",
	"packages.compare.emergency_line": "خط الطوارئ",
	"packages.compare.price_match": "ضمان مطابقة السعر",
	"packages.compare.cancellation": "نافذة الإلغاء المجاني",
	"packages.compare.cancellation_24h": "٢٤ ساعة",
	"packages.compare.cancellation_48h": "٤٨ ساعة",
	"packages.compare.cancellation_7d": "٧ أيام",
	"packages.calculator.tag": "حاسبة التكاليف",
	"packages.calculator.title": "خطط لرحلتك، شاهد السعر",
	"packages.calculator.sub": "عدل أي تفصيل وشاهد التكلفة التقديرية تتغير فوراً. جميع الأسعار من الرياض.",
	"packages.calculator.details_title": "تفاصيل الرحلة",
	"packages.calculator.destination_region": "منطقة الوجهة",
	"packages.calculator.region.gulf": "الخليج والشرق الأوسط",
	"packages.calculator.region.europe": "أوروبا",
	"packages.calculator.region.asia": "آسيا والمحيط الهادئ",
	"packages.calculator.region.americas": "الأمريكتان",
	"packages.calculator.region.africa": "أفريقيا",
	"packages.calculator.cabin_class": "درجة السفر",
	"packages.calculator.cabin.economy": "اقتصادي",
	"packages.calculator.cabin.premium_eco": "اقتصادي ممتاز",
	"packages.calculator.cabin.business": "رجال أعمال",
	"packages.calculator.cabin.first": "درجة أولى",
	"packages.calculator.hotel_rating": "تصنيف الفندق",
	"packages.calculator.hotel.3star": "فندق ٣ نجوم",
	"packages.calculator.hotel.4star": "فندق ٤ نجوم",
	"packages.calculator.hotel.5star": "فندق ٥ نجوم",
	"packages.calculator.hotel.luxury": "منتجع فاخر",
	"packages.calculator.travel_month": "شهر السفر",
	"packages.calculator.month.jan": "يناير",
	"packages.calculator.month.feb": "فبراير",
	"packages.calculator.month.mar": "مارس",
	"packages.calculator.month.apr": "أبريل",
	"packages.calculator.month.may": "مايو",
	"packages.calculator.month.jun": "يونيو",
	"packages.calculator.month.jul": "يوليو",
	"packages.calculator.month.aug": "أغسطس",
	"packages.calculator.month.sep": "سبتمبر",
	"packages.calculator.month.oct": "أكتوبر",
	"packages.calculator.month.nov": "نوفمبر",
	"packages.calculator.month.dec": "ديسمبر",
	"packages.calculator.passengers": "عدد المسافرين",
	"packages.calculator.duration": "مدة الرحلة (ليال)",
	"packages.calculator.duration.3": "٣ ليال",
	"packages.calculator.duration.5": "٥ ليال",
	"packages.calculator.duration.7": "٧ ليال",
	"packages.calculator.duration.10": "١٠ ليال",
	"packages.calculator.duration.14": "١٤ ليلة",
	"packages.calculator.duration.21": "٢١ ليلة",
	"packages.calculator.addons_title": "خدمات إضافية",
	"packages.calculator.addons.visa": "معالجة التأشيرة",
	"packages.calculator.addons.visa_price": "٥٠٠ ريال/شخص",
	"packages.calculator.addons.insurance": "تأمين السفر",
	"packages.calculator.addons.insurance_price": "١٥٠ ريال/شخص",
	"packages.calculator.addons.tours": "جولات إرشادية",
	"packages.calculator.addons.tours_price": "٤٠٠ ريال/شخص",
	"packages.calculator.addons.transfers": "تنقلات خاصة",
	"packages.calculator.addons.transfers_price": "٢٨٠ ريال/رحلة",
	"packages.calculator.addons.sim": "شريحة SIM للسفر",
	"packages.calculator.addons.sim_price": "٨٩ ريال/شخص",
	"packages.calculator.addons.lounge": "صالة المطار",
	"packages.calculator.addons.lounge_price": "١٨٠ ريال/شخص",
	"packages.calculator.result.title": "تقدير رحلتك",
	"packages.calculator.result.flights": "رحلات ذهاب وعودة",
	"packages.calculator.result.hotel": "الفندق",
	"packages.calculator.result.visa": "معالجة التأشيرة",
	"packages.calculator.result.insurance": "التأمين",
	"packages.calculator.result.addons": "إضافات اختيارية",
	"packages.calculator.result.service_fee": "رسوم خدمة دانة (٥٪)",
	"packages.calculator.result.total_label": "الإجمالي التقديري",
	"packages.calculator.result.per_person": "للفرد: ريال —",
	"packages.calculator.result.currency": "ريال",
	"packages.calculator.discount_note": "احجز قبل <strong style=\"color:var(--amber);\">٣١ أغسطس ٢٠٢٦</strong> بالكود <strong style=\"color:var(--amber);\">DANAH15</strong> ووفر ١٥٪ على هذا التقدير.",
	"packages.calculator.result.note": "تقدير مبني على متوسط الأسعار الموسمية. الأسعار الفعلية قد تختلف حسب توفر شركات الطيران والتواريخ والعروض الحالية. رسوم التأشيرات لحاملي جوازات السفر السعودية.",
	"packages.calculator.get_quote_btn": "احصل على عرض سعر مؤكد",
	"packages.destinations.aria": "أسعار الوجهات",
	"packages.destinations.tag": "أسعار الوجهات",
	"packages.destinations.title": "أسعار الرحلات من الرياض",
	"packages.destinations.sub": "أسعار الذهاب فقط (درجة اقتصادية) وأسعار الباقات لـ ٧ ليال. جميع الأسعار من مطار الملك خالد الدولي (RUH).",
	"packages.destinations.search_placeholder": "ابحث عن وجهة…",
	"packages.destinations.filter_all": "جميع الوجهات",
	"packages.destinations.filter_gulf": "الخليج",
	"packages.destinations.filter_europe": "أوروبا",
	"packages.destinations.filter_asia": "آسيا",
	"packages.destinations.filter_americas": "الأمريكتان",
	"packages.destinations.filter_africa": "أفريقيا",
	"packages.addons.tag": "إضافات",
	"packages.addons.title": "عزز رحلتك",
	"packages.addons.sub": "أضف أي من هذه الخدمات إلى باقاتك الحالية أو حجوزاتك المنفردة. يمكن حجز جميع الإضافات قبل ٤٨ ساعة من المغادرة.",
	"packages.addons.insurance.name": "تأمين السفر",
	"packages.addons.insurance.desc": "تغطية طبية شاملة، إلغاء الرحلة، فقدان الأمتعة، والإعادة الطارئة. ثلاث فئات متاحة.",
	"packages.addons.from_price": "يبدأ من",
	"packages.addons.per_person": " / للفرد",
	"packages.addons.add_btn": "أضف",
	"packages.addons.lounge.name": "دخول صالة المطار",
	"packages.addons.lounge.desc": "الوصول إلى صالات المطار المميزة عالمياً بما في ذلك وجبات ساخنة، واي فاي، دش، وتسجيل وصول مخصص. صالحة للمغادرة والوصول.",
	"packages.addons.per_person_label": "للفرد",
	"packages.addons.transfer.name": "تنقل خاص من وإلى المطار",
	"packages.addons.transfer.desc": "استلام وتوصيل بسيارة خاصة من الباب إلى الباب. متوفر كسيارة سيدان (١-٣ أشخاص)، SUV (٤-٦ أشخاص)، أو حافلة صغيرة (٧-١٢ شخص).",
	"packages.addons.per_trip_from": "لكل رحلة من",
	"packages.addons.photography.name": "تصوير احترافي",
	"packages.addons.photography.desc": "مصور محلي محترف يرافقك لجلسة مدتها ساعتان. مثالي للمناسبات السنوية وشهر العسل والرحلات العائلية. يتم تسليم الصور المعدلة خلال ٤٨ ساعة.",
	"packages.addons.per_session": "لكل جلسة",
	"packages.addons.tours.name": "جولات مدينة إرشادية",
	"packages.addons.tours.desc": "جولات خاصة نصف يوم أو يوم كامل مع مرشد يتحدث الإنجليزية أو العربية. تشمل المعالم الرئيسية والجواهر الخفية وتجارب الطعام المحلي.",
	"packages.addons.per_person_from": "للفرد من",
	"packages.addons.sim.name": "شريحة SIM دولية للسفر",
	"packages.addons.sim.desc": "شريحة بيانات غير محدودة صالحة لدولة وجهتك. يتم توصيلها إلى منزلك أو متوفرة في المطار قبل المغادرة. بدون رسوم تجوال.",
	"packages.addons.express_visa.name": "معالجة تأشيرة سريعة",
	"packages.addons.express_visa.desc": "التأشيرة العادية مشمولة في باقات رجال الأعمال والممتازة. للحجوزات الاقتصادية أو المنفردة، يتولى فريقنا جميع المستندات بنسبة قبول ٩٨.٤٪.",
	"packages.addons.standard_from": "العادي من",
	"packages.addons.honeymoon.name": "شهر العسل والمناسبات الخاصة",
	"packages.addons.honeymoon.desc": "ترقية الغرفة، بتلات الورد، كعكة الاحتفال، رصيد سبا للأزواج (٤٠٠ ريال)، وترحيب بالشمبانيا. متاح لأي باقة مع إشعار مسبق.",
	"packages.addons.per_booking": "لكل حجز",
	"packages.membership.aria": "خطط عضوية دانة",
	"packages.membership.tag": "عضوية دانة",
	"packages.membership.title": "سافر أكثر، ادفع أقل",
	"packages.membership.sub": "اشترك في عضوية دانة وافتح خصومات دائمة، حجوزات ذات أولوية، ومستشار سفر مخصص.",
	"packages.membership.annual": "سنوي",
	"packages.membership.monthly": "شهري",
	"packages.membership.save_badge": "وفر ١٧٪ سنوياً",
	"packages.membership.free.tier": "إكسبلورر · مجاني",
	"packages.membership.free.desc": "أنشئ حساباً مجانياً، أدر حجوزاتك عبر الإنترنت، واستقبل نشرتنا الأسبوعية للعروض.",
	"packages.membership.free.feats.account": "حساب عبر الإنترنت وسجل الحجوزات",
	"packages.membership.free.feats.newsletter": "نشرة العروض الأسبوعية",
	"packages.membership.free.feats.support": "دعم عبر البريد الإلكتروني عادي",
	"packages.membership.free.feats.price_match": "ضمان مطابقة السعر",
	"packages.membership.free.feats.discounts": "خصومات على الباقات",
	"packages.membership.free.feats.early_access": "وصول مبكر للعروض",
	"packages.membership.free.feats.dedicated": "مستشار مخصص",
	"packages.membership.free.btn": "إنشاء حساب مجاني",
	"packages.membership.gold.popular": "أفضل قيمة",
	"packages.membership.gold.tier": "عضو ذهبي",
	"packages.membership.gold.desc": "مثالي للمسافرين الذين يحجزون ٢-٤ رحلات سنوياً. الوصول المبكر للعروض وحده يغطي قيمة العضوية.",
	"packages.membership.gold.feats.everything": "كل ما في إكسبلورر",
	"packages.membership.gold.feats.discount": "خصم ٥٪",
	"packages.membership.gold.feats.all_packages": "على جميع الباقات والرحلات",
	"packages.membership.gold.feats.early": "وصول مبكر للعروض بـ ٤٨ ساعة",
	"packages.membership.gold.feats.visa_consult": "استشارة تأشيرة مجانية",
	"packages.membership.gold.feats.priority_support": "دعم هاتفي ذو أولوية",
	"packages.membership.gold.feats.free_transfer": "تنقل مجاني من المطار (مرة/سنة)",
	"packages.membership.gold.feats.dedicated_consultant": "مستشار مخصص",
	"packages.membership.gold.btn": "انضم للذهبي",
	"packages.membership.platinum.tier": "بلاتينيوم إليت",
	"packages.membership.platinum.desc": "للمسافرين الدائمين وعملاء الشركات الذين يطلبون الأفضل — والأسرع — في كل مرة.",
	"packages.membership.platinum.feats.everything": "كل ما في الذهبي",
	"packages.membership.platinum.feats.discount": "خصم ١٢٪",
	"packages.membership.platinum.feats.all": "على جميع الباقات والرحلات",
	"packages.membership.platinum.feats.flash": "عروض حصرية مفاجئة (تقدم ٢٤ ساعة)",
	"packages.membership.platinum.feats.free_visa": "معالجة تأشيرة مجانية (مرتين/سنة)",
	"packages.membership.platinum.feats.dedicated": "مستشار شخصي مخصص",
	"packages.membership.platinum.feats.lounge": "دخول صالة المطار مشمول",
	"packages.membership.platinum.feats.upgrade": "طلبات ترقية فندقية مجانية",
	"packages.membership.platinum.btn": "انضم للبلاتينيوم",
	"packages.membership.guarantee": "جميع العضويات تشمل ضمان استعادة الأموال لمدة ٣٠ يوماً. يمكنك الإلغاء في أي وقت.",
	"packages.alert.aria": "تنبيهات الأسعار",
	"packages.alert.title": "لا تفوت أي عرض",
	"packages.alert.sub": "عيّن تنبيهاً للسعر لوجهتك المفضلة. سنخبرك فور انخفاض الأسعار عن هدفك — لتحجز في اللحظة المثالية.",
	"packages.alert.dest_placeholder": "أي وجهة",
	"packages.alert.any_destination": "أي وجهة",
	"packages.alert.email_placeholder": "أدخل بريدك الإلكتروني…",
	"packages.alert.submit_btn": "تعيين التنبيه",
	"packages.alert.footer": "لا بريد مزعج. إلغاء الاشتراك في أي وقت. انضم إلى ٤,٨٠٠+ مسافر يستخدمون تنبيهات الأسعار بالفعل.",
	"packages.cta.tag": "لفترة محدودة",
	"packages.cta.title": "مستعد لحجز مغامرتك القادمة؟",
	"packages.cta.desc": "استخدم الكود <strong>DANAH15</strong> قبل ٣١ أغسطس ٢٠٢٦ ووفر ١٥٪ على أي باقة دولية.",
	"packages.cta.btn1": "احجز الآن ووفر ١٥٪",
	"packages.cta.btn2": "تحدث مع خبير"
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
})();