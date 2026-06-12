(function () {
  'use strict';

  /* ---- 1. PRELOADER ---------------------------------------- */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      if (preloader) preloader.classList.add('done');
    }, 2400);
  });

  /* ---- 2. CUSTOM CURSOR ------------------------------------ */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  if (cursorDot && cursorRing) {
    document.addEventListener('mousemove', e => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
      cursorRing.style.left = e.clientX + 'px';
      cursorRing.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('grow');
        cursorRing.classList.add('grow');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('grow');
        cursorRing.classList.remove('grow');
      });
    });
  }

  /* ---- 3. THEME TOGGLE ------------------------------------- */
  const htmlEl = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  let isDark = false;
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      isDark = !isDark;
      htmlEl.setAttribute('data-theme', isDark ? 'dark' : 'light');
      if (themeIcon) themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
      themeBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  /* ---- 4. NAVIGATION SCROLL + BACK-TO-TOP ------------------ */
  const navEl = document.getElementById('nav');
  const bttBtn = document.getElementById('btt');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (navEl) navEl.classList.toggle('scrolled', scrollY > 50);
    if (bttBtn) bttBtn.classList.toggle('show', scrollY > 400);
  });
  if (bttBtn) bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---- 5. HAMBURGER / MOBILE NAV -------------------------- */
  const hamburgerBtn = document.getElementById('hamburger');
  const mobileNavEl = document.getElementById('mobile-nav');
  if (hamburgerBtn && mobileNavEl) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = hamburgerBtn.classList.toggle('open');
      mobileNavEl.classList.toggle('open', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    document.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('open');
        mobileNavEl.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- 6. SCROLL REVEAL (IntersectionObserver) ------------ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

  /* ---- 7. NEWSLETTER FORM (guarded) ----------------------- */
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

  /* ---- 8. CONTACT FORM SUBMISSION ------------------------- */
  const contactForm = document.getElementById('contact-form-page');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const required = contactForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        const ok = field.value.trim().length > 0;
        if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA' || field.tagName === 'SELECT') {
          field.classList.toggle('ok', ok);
          field.classList.toggle('bad', !ok);
        }
        if (!ok) valid = false;
      });
      const msgDiv = document.getElementById('contact-msg-page');
      if (valid) {
        msgDiv.className = 'form-msg ok';
        msgDiv.innerHTML = '<i class="fas fa-check-circle me-2"></i>Message sent! We\'ll respond within 2–4 hours during business hours.';
        msgDiv.style.display = 'block';
        contactForm.reset();
        contactForm.querySelectorAll('.form-control').forEach(f => f.classList.remove('ok', 'bad'));
      } else {
        msgDiv.className = 'form-msg bad';
        msgDiv.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>Please complete all required fields before sending.';
        msgDiv.style.display = 'block';
      }
    });
  }

  /* ---- 9. SMOOTH SCROLL for internal anchor links ------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- 10. I18N TRANSLATION OBJECT (only contact keys) ---- */
  const danahI18n = {
    en: {
      "preloader.label": "Loading Experience…",
      "nav.home": "Home",
      "nav.services": "Services",
      "nav.about": "About",
      "nav.destinations": "Destinations",
      "nav.pricing": "Pricing",
      "nav.contact": "Contact",
      "nav.reservation": "Reserve",
      "nav.aria": "Primary navigation",
      "nav.mobileAria": "Mobile navigation",
      "lang.en": "English",
      "lang.ar": "Arabic",
      "theme.toggle": "Toggle dark mode",
      "btt": "Back to top",
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
      "footer.topDests": "Top Destinations",
      "footer.newsletter": "Stay in the Loop",
      "footer.placeholder": "Enter your email address…",
      "footer.subscribe": "Subscribe",
      "footer.sta": "STA Licensed",
      "footer.iata": "IATA Accredited",
      "footer.copy": "© 2026 Danah Travel & Tourism. All rights reserved.",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms of Service",
      "social.instagram": "Instagram",
      "social.twitter": "Twitter / X",
      "social.facebook": "Facebook",
      "social.linkedin": "LinkedIn"
    },
    ar: {
      "preloader.label": "جارٍ التحميل…",
      "nav.home": "الرئيسية",
      "nav.services": "الخدمات",
      "nav.about": "عن دانة",
      "nav.destinations": "الوجهات",
      "nav.pricing": "الأسعار",
      "nav.contact": "اتصل بنا",
      "nav.reservation": "احجز",
      "nav.aria": "التنقل الرئيسي",
      "nav.mobileAria": "التنقل للجوال",
      "lang.en": "English",
      "lang.ar": "العربية",
      "theme.toggle": "تبديل الوضع الداكن",
      "btt": "العودة للأعلى",
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
      "footer.topDests": "أفضل الوجهات",
      "footer.newsletter": "ابق على اطلاع",
      "footer.placeholder": "أدخل بريدك الإلكتروني…",
      "footer.subscribe": "اشتراك",
      "footer.sta": "مرخصة من STA",
      "footer.iata": "معتمدة من IATA",
      "footer.copy": "© 2026 دانة للسفر والسياحة. جميع الحقوق محفوظة.",
      "footer.privacy": "سياسة الخصوصية",
      "footer.terms": "شروط الخدمة",
      "social.instagram": "إنستغرام",
      "social.twitter": "تويتر / إكس",
      "social.facebook": "فيسبوك",
      "social.linkedin": "لينكدإن"
    }
  };

  /* ---- 11. APPLY TRANSLATIONS ----------------------------- */
  function applyTranslations(lang) {
    const dict = danahI18n[lang] || danahI18n.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria-label');
      if (dict[key] !== undefined) el.setAttribute('aria-label', dict[key]);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key] !== undefined) el.setAttribute('title', dict[key]);
    });
  }

  /* ---- 12. LANGUAGE SWITCHER (global) --------------------- */
  function switchLang(lang) {
    const enOrb = document.getElementById('lang-en');
    const arOrb = document.getElementById('lang-ar');
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
    applyTranslations(lang);
    window.dispatchEvent(new CustomEvent('danah-lang-change', { detail: { lang } }));
  }
  window.switchLang = switchLang;

  /* ---- 13. INITIAL LANGUAGE ------------------------------- */
  (function initLang() {
    const saved = localStorage.getItem('danah-lang') || 'en';
    switchLang(saved);
  })();

  /* ---- 14. UPDATE TRANSLATIONS ON CHANGE ------------------ */
  window.addEventListener('danah-lang-change', (e) => {
    applyTranslations(e.detail.lang);
  });

function initMap() {
  const office = { lat: 24.6877, lng: 46.6785 }; // Al-Olaya, Riyadh
  const map = new google.maps.Map(document.getElementById("dynamic-map"), {
    zoom: 15,
    center: office,
    mapId: 'YOUR_MAP_ID' // optional: for custom styling
  });
  const marker = new google.maps.Marker({
    position: office,
    map: map,
    title: "Danah Travel Office"
  });
  const infowindow = new google.maps.InfoWindow({
    content: '<strong>Danah Travel</strong><br>Al-Olaya Street, Riyadh<br>+966 11 234 5678'
  });
  marker.addListener("click", () => infowindow.open(map, marker));
}
window.initMap = initMap;

function updateOfficeStatus() {
  const now = new Date();
  const day = now.getDay();       // 0 = Sunday, 1 = Monday ... 6 = Saturday
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours + minutes / 60;
  
  let isOpen = false;
  if (day >= 1 && day <= 4) { // Sun-Thu
    isOpen = currentTime >= 8 && currentTime < 21;
  } else if (day === 5 || day === 6) { // Fri-Sat
    isOpen = currentTime >= 10 && currentTime < 18;
  }
  const badge = document.getElementById('open-badge');
  if (badge) {
    badge.textContent = isOpen ? 'OPEN NOW' : 'CLOSED';
    badge.className = 'open-badge ' + (isOpen ? 'open' : 'closed');
  }
}
setInterval(updateOfficeStatus, 60000); // update every minute
updateOfficeStatus();

if (valid) {
  const toastEl = document.getElementById('formSuccessToast');
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
  contactForm.reset();
  // ...
}
})();