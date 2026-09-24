/* ============================================================
   REJOICE EVENTS & FLORAL STUDIO — JavaScript
   Smooth Native Scroll & Pinned Stacking Card Deck Engine
   ============================================================ */

(function () {

  // ── 1. Navbar Scroll Effect ──────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // ── 2. Active Nav Link (Intersection Observer) ───────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-25% 0px -65% 0px' });

  sections.forEach(s => navObserver.observe(s));

  // ── 3. Smooth Anchor Scrolling ───────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        closeMobileMenu();
      }
    });
  });

  // ── 4. Pinned Stacking Card Deck Engine ───────────────────────
  const track = document.getElementById('packagesTrack');
  const cards = document.querySelectorAll('.packages-card-stage .pkg-card');
  const dots  = document.querySelectorAll('.deck-indicators .deck-dot');

  if (track && cards.length > 0) {
    const updateDeck = () => {
      const rect = track.getBoundingClientRect();
      const trackHeight = Math.max(1, track.offsetHeight - window.innerHeight);
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / trackHeight));

      const count = cards.length;
      // cardProgress runs from 0 to count - 1
      const cardProgress = progress * (count - 1);
      const activeIdx = Math.floor(cardProgress);
      const fraction = cardProgress - activeIdx;
      const isMobile = window.innerWidth <= 768;

      cards.forEach((card, i) => {
        if (i < activeIdx) {
          // Cards already covered: keep neatly hidden underneath with no protruding rims
          card.style.transform = isMobile ? 'translateY(0) scale(1)' : 'perspective(1400px) translateY(0) scale(1)';
          card.style.opacity = '0';
          card.style.filter = 'brightness(1)';
          card.style.zIndex = 1;
          card.style.pointerEvents = 'none';
          card.classList.remove('card-stacked');
        } else if (i === activeIdx) {
          // Current active card: fully visible, sits on stage
          const scale = isMobile ? 1 : (1 - fraction * 0.02);
          card.style.transform = isMobile ? 'translateY(0) scale(1)' : `perspective(1400px) translateY(0) scale(${scale})`;
          card.style.opacity = '1';
          card.style.filter = 'brightness(1)';
          card.style.zIndex = 10;
          card.style.pointerEvents = 'auto';
          card.classList.add('card-stacked');
        } else if (i === activeIdx + 1) {
          // Next card rolling in smoothly from bottom to top!
          const translateY = (1 - fraction) * 105; // rolls up from +105% to 0%
          const rotateX = isMobile ? 0 : (1 - fraction) * 6;
          const opacity = Math.min(1, fraction * 2.5);
          card.style.transform = isMobile
            ? `translateY(${translateY}%) scale(1)`
            : `perspective(1400px) translateY(${translateY}%) rotateX(${rotateX}deg) scale(1)`;
          card.style.opacity = String(opacity);
          card.style.filter = 'brightness(1)';
          card.style.zIndex = 20;
          card.style.pointerEvents = fraction > 0.75 ? 'auto' : 'none';
          card.classList.remove('card-stacked');
        } else {
          // Cards further down: waiting below
          card.style.transform = isMobile ? 'translateY(115%) scale(1)' : 'perspective(1400px) translateY(115%) scale(1)';
          card.style.opacity = '0';
          card.style.filter = 'brightness(1)';
          card.style.zIndex = 1;
          card.style.pointerEvents = 'none';
          card.classList.remove('card-stacked');
        }
      });

      // Update indicator dots
      const currentDot = Math.round(cardProgress);
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentDot);
      });
    };

    window.addEventListener('scroll', updateDeck, { passive: true });
    window.addEventListener('resize', updateDeck, { passive: true });
    updateDeck();
  }

})();


/* ══════════════════════════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════════════════════════ */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu   = document.getElementById('mobileMenu');
const navbarEl     = document.getElementById('navbar');

if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
  });
}
function closeMobileMenu() {
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
}
document.addEventListener('click', (e) => {
  if (navbarEl && !navbarEl.contains(e.target)) closeMobileMenu();
});


/* ══════════════════════════════════════════════════════════════
   WHATSAPP TOOLTIP
══════════════════════════════════════════════════════════════ */
const waTooltip = document.getElementById('waTooltip');
function dismissWaTooltip() {
  if (waTooltip) {
    waTooltip.style.opacity = '0';
    waTooltip.style.transition = 'opacity 0.4s';
    setTimeout(() => { waTooltip.style.display = 'none'; }, 400);
    sessionStorage.setItem('waDismissed', '1');
  }
}
if (sessionStorage.getItem('waDismissed')) {
  if (waTooltip) waTooltip.style.display = 'none';
} else {
  setTimeout(() => {
    if (waTooltip && !sessionStorage.getItem('waDismissed')) {
      waTooltip.style.opacity = '0';
      waTooltip.style.transition = 'opacity 0.5s';
      setTimeout(() => { if (waTooltip) waTooltip.style.display = 'none'; }, 500);
    }
  }, 6000);
}


/* ══════════════════════════════════════════════════════════════
   PACKAGE SELECT
══════════════════════════════════════════════════════════════ */
function selectPackage(type) {
  const select = document.getElementById('eventTypeSelect');
  if (!select) return;
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value === type || select.options[i].text === type) {
      select.selectedIndex = i;
      break;
    }
  }
}

/* ══════════════════════════════════════════════════════════════
   MIN DATE FOR BOOKING
══════════════════════════════════════════════════════════════ */
const dateInput = document.getElementById('dateInput');
if (dateInput) {
  const t = new Date();
  dateInput.min = t.getFullYear() + '-' + String(t.getMonth()+1).padStart(2,'0') + '-' + String(t.getDate()).padStart(2,'0');
}

/* ══════════════════════════════════════════════════════════════
   BOOKING FORM → SUCCESS + OPEN WHATSAPP
══════════════════════════════════════════════════════════════ */
const bookingForm = document.getElementById('bookingForm');
const formSuccess = document.getElementById('formSuccess');

function handleSubmit(e) {
  e.preventDefault();
  const data      = new FormData(e.target);
  const name      = data.get('name')      || '';
  const phone     = data.get('phone')     || '';
  const eventType = data.get('eventType') || '';
  const date      = data.get('date')      || '';
  const location  = data.get('location')  || '';
  const guests    = data.get('guests')    || '';
  const notes     = data.get('notes')     || '';

  if (!name.trim() || !phone.trim()) {
    alert('Please fill in your name and phone number.');
    return;
  }

  window._lastFormData = { name, phone, eventType, date, location, guests, notes };
  if (bookingForm) bookingForm.style.display = 'none';
  if (formSuccess) formSuccess.style.display = 'block';
  sendWhatsApp();
}

function sendWhatsApp() {
  const d    = window._lastFormData || {};
  const form = document.getElementById('bookingForm');
  const name      = d.name      || form?.querySelector('[name="name"]')?.value      || '';
  const phone     = d.phone     || form?.querySelector('[name="phone"]')?.value     || '';
  const eventType = d.eventType || form?.querySelector('[name="eventType"]')?.value || '';
  const date      = d.date      || form?.querySelector('[name="date"]')?.value      || '';
  const location  = d.location  || form?.querySelector('[name="location"]')?.value  || '';
  const guests    = d.guests    || form?.querySelector('[name="guests"]')?.value    || '';
  const notes     = d.notes     || form?.querySelector('[name="notes"]')?.value     || '';

  let msg = "Hi Rejoice Events! \uD83C\uDF38 I would like to inquire about event planning.\n\n";
  if (name)      msg += '*Name:* '                       + name      + '\n';
  if (phone)     msg += '*Phone:* '                      + phone     + '\n';
  if (eventType) msg += '*Event Type:* '                 + eventType + '\n';
  if (date)      msg += '*Date:* '                       + date      + '\n';
  if (location)  msg += '*Location:* '                   + location  + '\n';
  if (guests)    msg += '*Estimated Guests:* '           + guests    + '\n';
  if (notes)     msg += '*Details / Checklist Request:* ' + notes    + '\n';
  msg += '\nKindly share your best event package and checklist. Thank you!';

  window.open('https://wa.me/919961402646?text=' + encodeURIComponent(msg), '_blank');
}

function bookPackageWhatsApp(packageName) {
  const msg = "Hi Rejoice Events! \uD83C\uDF38 I am interested in your *" + packageName + "* package.\n\nCould you please share more details, the full checklist, and pricing options?\n\nThank you!";
  window.open('https://wa.me/919961402646?text=' + encodeURIComponent(msg), '_blank');
}

/* ══════════════════════════════════════════════════════════════
   HERO PICTURE SLIDESHOW ROTATION
══════════════════════════════════════════════════════════════ */
(function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;
  let activeIndex = 0;
  setInterval(() => {
    slides[activeIndex].classList.remove('active');
    activeIndex = (activeIndex + 1) % slides.length;
    slides[activeIndex].classList.add('active');
  }, 5500);
})();