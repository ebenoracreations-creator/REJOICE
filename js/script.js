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
      if (!href) return;
      if (href === '#' || href === '#home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (history.pushState) {
          history.pushState(null, null, '#home');
        }
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelectorAll('.nav-link[href="#home"]').forEach(l => l.classList.add('active'));
        closeMobileMenu();
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
        const top = Math.max(0, targetTop - offset);
        window.scrollTo({ top, behavior: 'smooth' });
        if (history.pushState) {
          history.pushState(null, null, href);
        }
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
   HERO VIDEO (DESKTOP) & MOBILE INTRO VIDEO CONTROLLER
══════════════════════════════════════════════════════════════ */
(function initHeroMedia() {
  const video = document.getElementById('heroVideo');
  const soundBtn = document.getElementById('heroSoundToggle');
  const introOverlay = document.getElementById('mobileIntroOverlay');
  const introVideo = document.getElementById('mobileIntroVideo');
  const skipBtn = document.getElementById('skipIntroBtn');
  const mobileSoundBtn = document.getElementById('mobileSoundBtn');

  const LIGHT_VOLUME = 0.22;
  let hasAutoMutedAfterFirstLoop = false;

  // 1. Desktop & Hero Sound Logic (Icon Only, No text)
  function updateDesktopSoundUI(isMuted) {
    if (!soundBtn) return;
    const unmutedIcon = soundBtn.querySelector('.sound-icon-unmuted');
    const mutedIcon = soundBtn.querySelector('.sound-icon-muted');

    if (isMuted) {
      soundBtn.classList.remove('is-unmuted');
      if (unmutedIcon) unmutedIcon.style.display = 'none';
      if (mutedIcon) mutedIcon.style.display = 'inline-block';
      soundBtn.setAttribute('title', 'Unmute Sound');
      soundBtn.setAttribute('aria-label', 'Unmute Sound');
    } else {
      soundBtn.classList.add('is-unmuted');
      if (unmutedIcon) unmutedIcon.style.display = 'inline-block';
      if (mutedIcon) mutedIcon.style.display = 'none';
      soundBtn.setAttribute('title', 'Mute Sound');
      soundBtn.setAttribute('aria-label', 'Mute Sound');
    }
  }

  if (video) {
    video.volume = LIGHT_VOLUME;

    // First time reload/entry: attempt to play unmuted
    video.muted = false;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updateDesktopSoundUI(false);
        })
        .catch(() => {
          // If browser policy blocks unmuted autoplay without gesture, start muted
          video.muted = true;
          video.play().catch(() => {});
          updateDesktopSoundUI(true);

          // On first user interaction, unmute for the first loop
          const unmuteOnFirstGesture = () => {
            if (!hasAutoMutedAfterFirstLoop && video) {
              video.volume = LIGHT_VOLUME;
              video.muted = false;
              updateDesktopSoundUI(false);
            }
            document.removeEventListener('click', unmuteOnFirstGesture);
            document.removeEventListener('keydown', unmuteOnFirstGesture);
            document.removeEventListener('touchstart', unmuteOnFirstGesture);
          };
          document.addEventListener('click', unmuteOnFirstGesture, { once: true });
          document.addEventListener('keydown', unmuteOnFirstGesture, { once: true });
          document.addEventListener('touchstart', unmuteOnFirstGesture, { once: true });
        });
    }

    // Automatically mute when first loop finishes!
    video.addEventListener('timeupdate', () => {
      if (!hasAutoMutedAfterFirstLoop && video.duration > 0) {
        if (video.currentTime >= video.duration - 0.3) {
          hasAutoMutedAfterFirstLoop = true;
          video.muted = true;
          updateDesktopSoundUI(true);
        }
      }
    });

    video.addEventListener('ended', () => {
      hasAutoMutedAfterFirstLoop = true;
      video.muted = true;
      updateDesktopSoundUI(true);
      video.play().catch(() => {});
    });

    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        video.volume = LIGHT_VOLUME;
        video.muted = !video.muted;
        if (!video.muted) {
          video.play().catch(() => {});
        }
        updateDesktopSoundUI(video.muted);
      });
    }
  }

  // 2. Mobile Intro Video Logic (SVG Icon Only, No emoji / text)
  function updateMobileIntroSoundUI(isMuted) {
    if (!mobileSoundBtn) return;
    const unmutedIcon = mobileSoundBtn.querySelector('.intro-sound-unmuted');
    const mutedIcon = mobileSoundBtn.querySelector('.intro-sound-muted');
    if (isMuted) {
      if (unmutedIcon) unmutedIcon.style.display = 'none';
      if (mutedIcon) mutedIcon.style.display = 'inline-block';
      mobileSoundBtn.setAttribute('title', 'Unmute Sound');
      mobileSoundBtn.setAttribute('aria-label', 'Unmute Sound');
    } else {
      if (unmutedIcon) unmutedIcon.style.display = 'inline-block';
      if (mutedIcon) mutedIcon.style.display = 'none';
      mobileSoundBtn.setAttribute('title', 'Mute Sound');
      mobileSoundBtn.setAttribute('aria-label', 'Mute Sound');
    }
  }

  function dismissIntro() {
    if (!introOverlay) return;
    introOverlay.classList.add('dismissed');
    if (introVideo) {
      try { introVideo.pause(); } catch(e) {}
    }
    setTimeout(() => {
      introOverlay.style.display = 'none';
    }, 700);
  }

  if (window.innerWidth <= 768 && introOverlay && introVideo) {
    introVideo.volume = 0.45;
    introVideo.muted = false;
    const p = introVideo.play();
    if (p !== undefined) {
      p.then(() => {
        updateMobileIntroSoundUI(false);
      }).catch(() => {
        // Start muted if blocked by mobile browser
        introVideo.muted = true;
        introVideo.play().catch(() => {});
        updateMobileIntroSoundUI(true);
      });
    }

    if (mobileSoundBtn) {
      mobileSoundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        introVideo.muted = !introVideo.muted;
        if (!introVideo.muted) {
          introVideo.volume = 0.45;
          introVideo.play().catch(() => {});
        }
        updateMobileIntroSoundUI(introVideo.muted);
      });
    }

    introVideo.addEventListener('ended', dismissIntro);

    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissIntro();
      });
    }

    // Tap on intro screen to unmute if muted or tap to proceed
    introOverlay.addEventListener('click', (e) => {
      if (e.target !== mobileSoundBtn && e.target !== skipBtn && !mobileSoundBtn.contains(e.target)) {
        if (introVideo.muted) {
          introVideo.muted = false;
          introVideo.volume = 0.45;
          updateMobileIntroSoundUI(false);
        }
      }
    });
  } else if (introOverlay) {
    introOverlay.style.display = 'none';
  }
})();