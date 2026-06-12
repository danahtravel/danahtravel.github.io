(function () {
  'use strict';
/* ============================================================
   PACKAGES & PRICING PAGE — JavaScript
============================================================ */

/* ---- DESTINATION DATA ---- */
const destinations = [
  // Gulf
  { city:'Dubai', country:'UAE', flag:'🇦🇪', region:'gulf', flight:450, dur:'1h 45m', visa:'free', visaFee:0, pkg:1200, rating:4.9 },
  { city:'Abu Dhabi', country:'UAE', flag:'🇦🇪', region:'gulf', flight:500, dur:'1h 55m', visa:'free', visaFee:0, pkg:1380, rating:4.8 },
  { city:'Muscat', country:'Oman', flag:'🇴🇲', region:'gulf', flight:380, dur:'1h 30m', visa:'free', visaFee:0, pkg:1100, rating:4.7 },
  { city:'Doha', country:'Qatar', flag:'🇶🇦', region:'gulf', flight:280, dur:'1h 10m', visa:'free', visaFee:0, pkg:950, rating:4.8 },
  { city:'Kuwait City', country:'Kuwait', flag:'🇰🇼', region:'gulf', flight:320, dur:'1h 30m', visa:'free', visaFee:0, pkg:1000, rating:4.6 },
  { city:'Amman', country:'Jordan', flag:'🇯🇴', region:'gulf', flight:450, dur:'1h 45m', visa:'free', visaFee:0, pkg:1250, rating:4.7 },
  { city:'Cairo', country:'Egypt', flag:'🇪🇬', region:'gulf', flight:620, dur:'3h 00m', visa:'arrival', visaFee:180, pkg:1900, rating:4.6 },
  // Europe
  { city:'Istanbul', country:'Turkey', flag:'🇹🇷', region:'europe', flight:750, dur:'4h 30m', visa:'free', visaFee:0, pkg:2200, rating:4.9 },
  { city:'London', country:'United Kingdom', flag:'🇬🇧', region:'europe', flight:1800, dur:'7h 30m', visa:'required', visaFee:550, pkg:4200, rating:4.8 },
  { city:'Paris', country:'France', flag:'🇫🇷', region:'europe', flight:1900, dur:'7h 00m', visa:'required', visaFee:500, pkg:4500, rating:4.9 },
  { city:'Rome', country:'Italy', flag:'🇮🇹', region:'europe', flight:1800, dur:'6h 45m', visa:'required', visaFee:500, pkg:4000, rating:4.8 },
  { city:'Barcelona', country:'Spain', flag:'🇪🇸', region:'europe', flight:1850, dur:'7h 30m', visa:'required', visaFee:500, pkg:4200, rating:4.8 },
  { city:'Athens', country:'Greece', flag:'🇬🇷', region:'europe', flight:1600, dur:'5h 00m', visa:'required', visaFee:500, pkg:3600, rating:4.7 },
  { city:'Amsterdam', country:'Netherlands', flag:'🇳🇱', region:'europe', flight:1900, dur:'7h 30m', visa:'required', visaFee:500, pkg:4000, rating:4.7 },
  { city:'Vienna', country:'Austria', flag:'🇦🇹', region:'europe', flight:1700, dur:'6h 30m', visa:'required', visaFee:500, pkg:3800, rating:4.7 },
  // Asia
  { city:'Bangkok', country:'Thailand', flag:'🇹🇭', region:'asia', flight:850, dur:'8h 30m', visa:'free', visaFee:0, pkg:2200, rating:4.8 },
  { city:'Kuala Lumpur', country:'Malaysia', flag:'🇲🇾', region:'asia', flight:950, dur:'9h 00m', visa:'free', visaFee:0, pkg:2400, rating:4.7 },
  { city:'Singapore', country:'Singapore', flag:'🇸🇬', region:'asia', flight:1100, dur:'9h 30m', visa:'free', visaFee:0, pkg:2800, rating:4.9 },
  { city:'Bali', country:'Indonesia', flag:'🇮🇩', region:'asia', flight:1050, dur:'11h 00m', visa:'arrival', visaFee:0, pkg:2600, rating:4.9 },
  { city:'Male', country:'Maldives', flag:'🇲🇻', region:'asia', flight:1400, dur:'5h 30m', visa:'arrival', visaFee:0, pkg:3800, rating:5.0 },
  { city:'Tokyo', country:'Japan', flag:'🇯🇵', region:'asia', flight:1850, dur:'13h 00m', visa:'free', visaFee:0, pkg:4500, rating:4.9 },
  { city:'Seoul', country:'South Korea', flag:'🇰🇷', region:'asia', flight:1750, dur:'12h 00m', visa:'free', visaFee:0, pkg:4200, rating:4.8 },
  // Americas
  { city:'New York', country:'USA', flag:'🇺🇸', region:'americas', flight:2600, dur:'16h 00m', visa:'required', visaFee:750, pkg:6500, rating:4.8 },
  { city:'Miami', country:'USA', flag:'🇺🇸', region:'americas', flight:2700, dur:'17h 00m', visa:'required', visaFee:750, pkg:6800, rating:4.7 },
  { city:'Toronto', country:'Canada', flag:'🇨🇦', region:'americas', flight:2500, dur:'15h 30m', visa:'required', visaFee:700, pkg:6200, rating:4.7 },
  // Africa
  { city:'Nairobi', country:'Kenya', flag:'🇰🇪', region:'africa', flight:1400, dur:'5h 00m', visa:'arrival', visaFee:300, pkg:3500, rating:4.7 },
  { city:'Cape Town', country:'South Africa', flag:'🇿🇦', region:'africa', flight:1900, dur:'10h 00m', visa:'free', visaFee:0, pkg:4500, rating:4.8 },
];

let activeRegion = 'all';
let searchQuery = '';

function renderDestinations() {
  const grid = document.getElementById('dest-grid');
  const countLabel = document.getElementById('dest-count-label');
  const q = searchQuery.toLowerCase();

  const filtered = destinations.filter(d => {
    const matchesRegion = activeRegion === 'all' || d.region === activeRegion;
    const matchesSearch = q === '' || d.city.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
    return matchesRegion && matchesSearch;
  });

  countLabel.textContent = `Showing ${filtered.length} destination${filtered.length !== 1 ? 's' : ''}`;

  const visaMap = {
    free:     `<span class="visa-pill free"><i class="fas fa-check"></i> Visa-Free</span>`,
    required: `<span class="visa-pill required"><i class="fas fa-passport"></i> Visa Required · SAR ${filtered[0]?.visaFee || 0}</span>`,
    arrival:  `<span class="visa-pill arrival"><i class="fas fa-stamp"></i> Visa on Arrival</span>`,
  };

  const stars = r => {
    const full = Math.floor(r);
    const half = r % 1 >= 0.5;
    let html = '';
    for (let i = 0; i < full; i++) html += '<i class="fas fa-star" style="color:#FCD34D;font-size:.7rem;"></i>';
    if (half) html += '<i class="fas fa-star-half-stroke" style="color:#FCD34D;font-size:.7rem;"></i>';
    return html;
  };

  const regionGrad = { gulf:'135deg,#0B2040,#0D3A6E', europe:'135deg,#0B2040,#1A2F5A', asia:'135deg,#082020,#0D3C35', americas:'135deg,#1A0B3E,#2D1160', africa:'135deg,#251200,#4A2200' };

  grid.innerHTML = filtered.map((d, i) => {
    const grad = regionGrad[d.region] || '135deg,#0B1426,#1D4ED8';
    const visaHtml = d.visa === 'required'
      ? `<span class="visa-pill required"><i class="fas fa-passport"></i> Visa Required · SAR ${d.visaFee}</span>`
      : d.visa === 'arrival'
      ? `<span class="visa-pill arrival"><i class="fas fa-stamp"></i> Visa on Arrival${d.visaFee > 0 ? ' · SAR '+d.visaFee : ' (Free)'}</span>`
      : `<span class="visa-pill free"><i class="fas fa-check"></i> Visa-Free</span>`;
    return `
      <div class="dest-card" style="animation-delay:${i*40}ms;" onclick="showToast('info','${d.city}, ${d.country}','Package from SAR ${d.pkg.toLocaleString()} · Use the calculator above for a custom quote.')">
        <div class="dest-card-top" style="background:linear-gradient(${grad});">
          <div class="dest-rating">${stars(d.rating)} ${d.rating}</div>
          <span class="dest-flag">${d.flag}</span>
          <div class="dest-city">${d.city}</div>
          <div class="dest-country">${d.country}</div>
        </div>
        <div class="dest-card-body">
          <div class="dest-stat-row">
            <div class="dest-stat">
              <div class="ds-val">SAR ${d.flight.toLocaleString()}</div>
              <div class="ds-lbl">Economy fare</div>
            </div>
            <div class="dest-stat">
              <div class="ds-val">${d.dur}</div>
              <div class="ds-lbl">Flight time</div>
            </div>
          </div>
          ${visaHtml}
          <div class="dest-pkg-row">
            <div>
              <div class="dest-pkg-from">7-night package from</div>
              <div class="dest-pkg-price">SAR ${d.pkg.toLocaleString()}</div>
            </div>
            <button class="dest-pkg-cta" onclick="event.stopPropagation();showToast('success','Package Enquiry Sent','We\'ll send you a detailed quote for ${d.city} within 2 hours.')">Quote</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-muted);">
      <i class="fas fa-globe" style="font-size:2rem;margin-bottom:12px;opacity:.3;display:block;"></i>
      No destinations found for "<strong>${q}</strong>". Try another search.
    </div>`;
  }
}

// EXPOSE to global for inline onclick
window.renderDestinations = renderDestinations;
window.setFilter = function(region, btn) {
  activeRegion = region;
  document.querySelectorAll('.df-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderDestinations();
};
window.filterSearch = function() {
  searchQuery = document.getElementById('dest-search').value;
  renderDestinations();
};

/* ---- TRAVEL CALCULATOR ---- */
let paxCount = 2;
const FLIGHT_BASE = { gulf:650, europe:2100, asia:1300, americas:3400, africa:1900 };
const CABIN_MULT  = { economy:1.0, premium_eco:1.55, business:2.8, first:5.2 };
const HOTEL_RATE  = { '3':280, '4':500, '5':900, 'luxury':1600 };
const VISA_FEES   = { gulf:0, europe:500, asia:150, americas:750, africa:350 };
const SEASONAL    = m => [6,7,8,12].includes(m) ? 1.35 : [3,4,5,9,11].includes(m) ? 1.1 : 0.9;

window.changePax = function(delta) {
  paxCount = Math.max(1, Math.min(20, paxCount + delta));
  document.getElementById('pax-display').textContent = paxCount;
  calculate();
};

function calculate() {
  const region = document.getElementById('calc-region').value;
  const cabin  = document.getElementById('calc-cabin').value;
  const stars  = document.getElementById('calc-stars').value;
  const month  = parseInt(document.getElementById('calc-month').value);
  const nights = parseInt(document.getElementById('calc-nights').value);

  const addVisa      = document.getElementById('add-visa').checked;
  const addInsurance = document.getElementById('add-insurance').checked;
  const addTours     = document.getElementById('add-tours').checked;
  const addTransfers = document.getElementById('add-transfers').checked;
  const addSim       = document.getElementById('add-sim').checked;
  const addLounge    = document.getElementById('add-lounge').checked;

  const seasonal = SEASONAL(month);

  const flightTotal   = Math.round(FLIGHT_BASE[region] * CABIN_MULT[cabin] * paxCount * seasonal * 2); // round trip
  const rooms         = Math.ceil(paxCount / 2);
  const hotelTotal    = Math.round((HOTEL_RATE[stars] || 900) * nights * rooms * seasonal);
  const visaTotal     = addVisa ? Math.round((VISA_FEES[region] || 0) * paxCount) : 0;
  const insTotal      = addInsurance ? 150 * paxCount : 0;
  const toursTotal    = addTours ? 400 * paxCount : 0;
  const transferTotal = addTransfers ? 280 * 2 : 0;
  const simTotal      = addSim ? 89 * paxCount : 0;
  const loungeTotal   = addLounge ? 180 * paxCount : 0;
  const addonsSum     = toursTotal + transferTotal + simTotal + loungeTotal;

  const subtotal  = flightTotal + hotelTotal + visaTotal + insTotal + addonsSum;
  const svcFee    = Math.round(subtotal * 0.05);
  const total     = subtotal + svcFee;
  const perPerson = Math.round(total / paxCount);

  // Update UI
  const fmt = n => n.toLocaleString();
  document.getElementById('r-pax').textContent    = `(${paxCount} pax, rt)`;
  document.getElementById('r-nights').textContent = `(${nights} nights, ${rooms} room${rooms>1?'s':''})`;
  document.getElementById('r-flights').textContent    = fmt(flightTotal);
  document.getElementById('r-hotel').textContent      = fmt(hotelTotal);
  document.getElementById('r-visa').textContent       = fmt(visaTotal);
  document.getElementById('r-insurance').textContent  = fmt(insTotal);
  document.getElementById('r-addons').textContent     = fmt(addonsSum);
  document.getElementById('r-service').textContent    = fmt(svcFee);
  document.getElementById('r-perperson').textContent  = `Per person: SAR ${fmt(perPerson)}`;

  const totalEl = document.getElementById('r-total');
  totalEl.textContent = fmt(total);
  totalEl.classList.add('pop');
  setTimeout(() => totalEl.classList.remove('pop'), 280);

  // Hide visa row if no visa needed
const visaRow = document.getElementById('r-visa-row');
if (visaRow) visaRow.style.opacity = addVisa ? 1 : .4;
}

window.calculate = calculate; // if needed inline

/* ---- PACKAGE PERIOD TOGGLE (needs DOM ready) ---- */
function initPackagePeriod() {
  const btns = document.querySelectorAll('#pkg-period .csw-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#pkg-period .csw-btn').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      const period = btn.dataset.period;
      document.querySelectorAll('.pkg-nights').forEach(el => el.textContent = period);
      document.querySelectorAll('.pkg-price').forEach(el => {
        const raw = el.dataset[period];
        el.textContent = parseInt(raw).toLocaleString();
      });
    });
  });
}

/* ---- COMPARISON TABLE TOGGLE ---- */
window.toggleCompare = function() {
  const table = document.getElementById('compare-table');
  const btn   = document.getElementById('compare-btn');
  if (!table || !btn) return;
  table.classList.toggle('open');
  btn.classList.toggle('open');
  const icon = btn.querySelector('i:last-child');
  if (icon) icon.style.transform = table.classList.contains('open') ? 'rotate(180deg)' : '';
  const textNode = btn.childNodes[0];
  if (textNode) textNode.textContent = table.classList.contains('open') ? ' Hide Comparison ' : ' Compare All Features ';
};

/* ---- BILLING TOGGLE (Membership) ---- */
let isMonthly = false;
window.toggleBilling = function() {
  isMonthly = !isMonthly;
  const toggle = document.getElementById('billing-toggle');
  if (toggle) toggle.classList.toggle('monthly', isMonthly);
  const lblAnnual = document.getElementById('lbl-annual');
  const lblMonthly = document.getElementById('lbl-monthly');
  if (lblAnnual) lblAnnual.classList.toggle('on', !isMonthly);
  if (lblMonthly) lblMonthly.classList.toggle('on', isMonthly);
  document.querySelectorAll('.mem-p').forEach(el => {
    const val = isMonthly ? parseInt(el.dataset.monthly) : parseInt(el.dataset.annual);
    el.textContent = val.toLocaleString();
  });
  document.querySelectorAll('.mem-per').forEach(el => el.textContent = isMonthly ? 'month' : 'year');
  const goldNote = document.getElementById('gold-note');
  const platNote = document.getElementById('plat-note');
  if (goldNote) goldNote.textContent = isMonthly ? 'Billed monthly — save 17% with annual plan' : '≈ SAR 41/month — SAR 98 saved vs monthly';
  if (platNote) platNote.textContent = isMonthly ? 'Billed monthly — save 17% with annual plan' : '≈ SAR 124/month — SAR 298 saved vs monthly';
};

/* ---- PRICE ALERT FORM ---- */
window.submitAlert = function(e) {
  if (e) e.preventDefault();
  const dest = document.getElementById('alert-dest')?.value || 'any destination';
  showToast('success', 'Price Alert Set! 🔔', `You'll receive deal alerts for ${dest} to your email address.`);
  const form = document.getElementById('price-alert-form');
  if (form) form.reset();
};

/* ---- TOAST SYSTEM (already global via window.showToast) ---- */
const TICONS = { success:'fa-check-circle', warn:'fa-triangle-exclamation', error:'fa-xmark-circle', info:'fa-circle-info' };
function showToast(type, title, msg, dur = 4500) {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const t = Object.assign(document.createElement('div'), {
    className: 'toast-item',
    innerHTML: `
      <div style="width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.8rem;flex-shrink:0;
        background:${type==='success'?'rgba(16,185,129,.1)':type==='warn'?'rgba(245,158,11,.1)':type==='error'?'rgba(239,68,68,.1)':'var(--blue-light)'};
        color:${type==='success'?'var(--green)':type==='warn'?'var(--amber)':type==='error'?'var(--red)':'var(--blue)'}">
        <i class="fas ${TICONS[type]}"></i></div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:.835rem;font-weight:700;color:var(--text-h);margin-bottom:2px;">${title}</div>
        <div style="font-size:.76rem;color:var(--text-muted);line-height:1.45;">${msg}</div>
      </div>
      <button onclick="this.closest('.toast-item').remove()" style="background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:.75rem;padding:2px;margin-left:auto;align-self:flex-start;"><i class="fas fa-times"></i></button>`
  });
  Object.assign(t.style, { display:'flex', alignItems:'flex-start', gap:'11px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'13px', padding:'13px 16px', boxShadow:'var(--shadow-lg)', minWidth:'280px', maxWidth:'360px', pointerEvents:'all', animation:'toast-in .32s ease both' });
  c.prepend(t);
  setTimeout(() => { t.style.animation = 'toast-out .3s ease forwards'; setTimeout(() => t.remove(), 320); }, dur);
}

// EXPOSE for inline onclick handlers
window.showToast = showToast;

// Inject toast animation styles once (outside DOMContentLoaded, but safe)
if (!document.querySelector('#toast-styles')) {
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    @keyframes toast-in  { from { opacity:0; transform:translateX(26px) scale(.96); } to { opacity:1; transform:none; } }
    @keyframes toast-out { to   { opacity:0; transform:translateX(26px) scale(.96); } }
  `;
  document.head.appendChild(style);
}

// Only run DOM-dependent initialisation after content is ready
document.addEventListener('DOMContentLoaded', () => {
// 1. Initial render
renderDestinations();
calculate();

// 2. Package period toggle (now safe)
initPackagePeriod();

const style = document.createElement('style');
style.textContent = `
  @keyframes toast-in  { from { opacity:0; transform:translateX(26px) scale(.96); } to { opacity:1; transform:none; } }
  @keyframes toast-out { to   { opacity:0; transform:translateX(26px) scale(.96); } }
`;
document.head.appendChild(style);

/* ---- CURSOR ---- */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
if (dot && ring) {
document.addEventListener('mousemove', e => {
  dot.style.left  = e.clientX + 'px'; 
  dot.style.top  = e.clientY + 'px';
  ring.style.left = e.clientX + 'px'; 
  ring.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, input, select, .dest-card, .addon-card, .mem-card, .price-card, .addon-check').forEach(el => {
  el.addEventListener('mouseenter', () => { dot.classList.add('grow'); ring.classList.add('grow'); });
  el.addEventListener('mouseleave', () => { dot.classList.remove('grow'); ring.classList.remove('grow'); });
});
}

// 4. Theme toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
let dark = false;
themeToggle.addEventListener('click', () => {
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
});
}

// 5. Nav scroll + back to top
const nav = document.getElementById('nav');
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => {
if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
if (btt) btt.classList.toggle('show', window.scrollY > 400);
});
if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// 6. Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
if (hamburger && mobileNav) {
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
	hamburger.classList.remove('open');
	mobileNav.classList.remove('open');
	hamburger.setAttribute('aria-expanded', 'false');
  });
});
}

// 7. Scroll reveal
const revObserver = new IntersectionObserver(entries => {
entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); revObserver.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revObserver.observe(el));

// 8. Hero canvas (safe)
(function() {
const canvas = document.getElementById('hero-canvas');
if (!canvas) return;
const ctx = canvas.getContext('2d');
let W, H, pts;
function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
class Pt { constructor() { this.reset(true); } reset(i) { this.x=Math.random()*W; this.y=i?Math.random()*H:Math.random()>0.5?-5:H+5; this.vx=(Math.random()-.5)*.3; this.vy=(Math.random()-.5)*.3; this.r=Math.random()*1.6+.3; this.a=Math.random()*.45+.1; } update() { this.x+=this.vx; this.y+=this.vy; if(this.x<-5||this.x>W+5||this.y<-5||this.y>H+5) this.reset(false); } draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=`rgba(147,197,253,${this.a})`; ctx.fill(); } }
resize(); window.addEventListener('resize', resize);
pts = Array.from({length:70}, () => new Pt());
function loop() { ctx.clearRect(0,0,W,H); pts.forEach(p=>{p.update();p.draw();}); for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++) { const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy); if(d<90){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(147,197,253,${.1*(1-d/90)})`;ctx.lineWidth=.6;ctx.stroke();} } requestAnimationFrame(loop); }
loop();
})();
});
})();