(function () {
  'use strict';
/* ============================================================
   MAIN JAVASCRIPT
   All interactive features for Danah Travel & Tourism
============================================================ */

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
    returnCol.style.display = tab.dataset.tab === 'round' ? '' : 'none';
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

/* ---- 10. IMAGE LIGHTBOX --------------------------------- */
const lightboxEl = document.getElementById('lightbox');
if (lightboxEl) {
const galleryItems = Array.from(document.querySelectorAll('.gal-item img'));
let   lbIdx        = 0;

function openLightbox(idx) {
  lbIdx      = idx;
  lbImg.src  = lbSrcs[idx].src;
  lbImg.alt  = lbSrcs[idx].alt;
  lightboxEl.classList.add('on');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxEl.classList.remove('on');
  document.body.style.overflow = '';
}

document.querySelectorAll('.gal-item').forEach((item, idx) => {
  item.addEventListener('click', () => openLightbox(idx));
});

document.getElementById('lb-close').addEventListener('click', closeLightbox);

document.getElementById('lb-prev').addEventListener('click', () => {
  lbIdx = (lbIdx - 1 + lbSrcs.length) % lbSrcs.length;
  lbImg.src = lbSrcs[lbIdx].src;
  lbImg.alt = lbSrcs[lbIdx].alt;
});

document.getElementById('lb-next').addEventListener('click', () => {
  lbIdx = (lbIdx + 1) % lbSrcs.length;
  lbImg.src = lbSrcs[lbIdx].src;
  lbImg.alt = lbSrcs[lbIdx].alt;
});

// Close on backdrop click
lightboxEl.addEventListener('click', e => {
  if (e.target === lightboxEl) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!lightboxEl.classList.contains('on')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  document.getElementById('lb-prev').click();
  if (e.key === 'ArrowRight') document.getElementById('lb-next').click();
});
}
/* ---- 11. TESTIMONIAL SLIDER ----------------------------- */
const tTrack = document.querySelector('.ttrack');
const tDots = document.querySelectorAll('.s-dot');
const tSlides = document.querySelectorAll('.tslide');
if (tTrack && tDots.length && tSlides.length) {
  let tIdx = 0;
  const tSlideCount = tSlides.length;
  // ... slider code


function goToSlide(idx) {
  tIdx = ((idx % tSlideCount) + tSlideCount) % tSlideCount;
  tTrack.style.transform = `translateX(-${tIdx * 100}%)`;
  tDots.forEach((dot, i) => dot.classList.toggle('on', i === tIdx));
}

const prevBtn = document.getElementById('t-prev');
const nextBtn = document.getElementById('t-next');
if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(tIdx - 1));
if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(tIdx + 1));
if (tDots.length) {
  tDots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));
}

// Auto-advance every 5 seconds, pause on hover
let tAutoPlay = setInterval(() => goToSlide(tIdx + 1), 5000);
const tsliderEl = document.querySelector('.tslider');
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
document.getElementById('reservation-form').addEventListener('submit', e => {
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
window.addEventListener('scroll', () => {
  const ctaBand = document.getElementById('cta-band');
  if (!ctaBand) return;
  const rect   = ctaBand.getBoundingClientRect();
  const offset = -rect.top * 0.3;
  ctaBand.style.backgroundPositionY = `calc(50% + ${offset}px)`;
});
})();