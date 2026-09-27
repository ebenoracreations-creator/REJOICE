/**
 * Rejoice Events — Bend Gallery (Finite 4-Card 3D Stepper)
 * Cards: Weddings -> Baptisms -> Birthdays -> Funerals
 * When Funeral is reached, scrolling down seamlessly scrolls the page!
 * When Wedding is reached, scrolling up seamlessly scrolls the page!
 * All cards open checklists on click/tap across mobile and desktop.
 */

(function () {
  'use strict';

  const PACKAGES = [
    {
      id: 'wedding',
      title: 'Weddings',
      badge: 'Complete Celebration',
      badgeClass: '',
      sub: 'Sacred traditions, modern grandeur & bespoke floral styling',
      checkTitle: 'Package Checklist:',
      bullets: [
        'Stage Decor & Mandap Styling',
        'Premium Cake & Wine Setting',
        'Premium Car Groom & Wedding Car Decor',
        'Live Fusion & Sound Engineering',
        'Center Carpet, Pathway & Ramp Styling'
      ],
      image: 'images/packages/wedding-card.png',
      alt: 'Luxury Kerala Wedding Stage Decor by Rejoice Events',
      url: 'wedding-checklist.html'
    },
    {
      id: 'baptism',
      title: 'Baptisms',
      badge: 'Sacred Milestone',
      badgeClass: '',
      sub: 'A pure and heavenly beginning with angel-wing styling',
      checkTitle: 'Package Checklist:',
      bullets: [
        'Stage & Neon Backdrop',
        'Cake Table Settings & Cradle Styling',
        'Return Gifts & its Display Table or Stand',
        'Sound, Music, Mic & Welcome Board',
        'Baptism Basket, Tiara, Candle & Church Altar'
      ],
      image: 'images/packages/baptism-card.png',
      alt: 'Bespoke Angel Wing Baptism Setup by Rejoice Events',
      url: 'baptism-checklist.html'
    },
    {
      id: 'birthday',
      title: 'Birthdays',
      badge: 'Milestone Joy',
      badgeClass: '',
      sub: 'Vibrant themes, fairy wonderland & lifelong memories',
      checkTitle: 'Package Checklist:',
      bullets: [
        'Custom Themed Stage & Backdrop',
        'Balloon & Floral Arch Installations',
        'Cake & Table Setting',
        'Return Gifts & its Display Table or Stand',
        'Sound, Music, Mic & Welcome Board Setting'
      ],
      image: 'images/packages/birthday-card.png',
      alt: 'Enchanted Fairy Birthday Garden Setup by Rejoice Events',
      url: 'birthday-checklist.html'
    },
    {
      id: 'funeral',
      title: 'Funerals',
      badge: 'Sacred Memorial',
      badgeClass: 'bend-badge-memorial',
      sub: 'Dignified, peaceful & sacred compassionate tributes',
      checkTitle: 'Package Services:',
      bullets: [
        'Compassionate, complete funeral services arranged with care',
        'Sacred floral altar arches, cross decor & memorial styling',
        'Ambient candle setting & solemn sound systems',
        'Specific funeral arrangements provided at request'
      ],
      image: 'images/packages/funeral-card.jpeg',
      alt: 'Sacred Floral Altar Memorial Tribute by Rejoice Events',
      url: 'funeral-checklist.html'
    }
  ];

  function initBendGallery(containerId) {
    const mountEl = document.getElementById(containerId);
    if (!mountEl) return;

    // Render Markup (Strictly 4 Cards, no instruction pill)
    mountEl.innerHTML = `
      <div class="bend-gallery-viewport" id="bendViewport" role="region" aria-label="Curated Event Packages">
        <div class="bend-stage" id="bendStage">
          ${PACKAGES.map((pkg, idx) => `
            <a href="${pkg.url}" class="bend-card-item" data-index="${idx}" aria-label="Open ${pkg.title} Checklist">
              <div class="bend-card-media">
                <img src="${pkg.image}" alt="${pkg.alt}" loading="lazy" />
              </div>
              <div class="bend-card-content">
                <div>
                  <span class="bend-badge ${pkg.badgeClass}">${pkg.badge}</span>
                  <h3 class="bend-title">${pkg.title}</h3>
                  <p class="bend-sub">${pkg.sub}</p>
                  <div class="bend-checklist">
                    <span class="bend-check-title">${pkg.checkTitle}</span>
                    <ul>
                      ${pkg.bullets.map(b => `
                        <li><span class="bend-check-icon">✓</span> ${b}</li>
                      `).join('')}
                    </ul>
                  </div>
                </div>
                <div class="bend-btn-action">
                  Open ${pkg.title} Checklist &#8594;
                </div>
              </div>
            </a>
          `).join('')}
        </div>
        <div class="bend-vignette bend-vignette-top"></div>
        <div class="bend-vignette bend-vignette-bottom"></div>
      </div>

      <div class="bend-nav-wrap">
        <button type="button" class="bend-btn-arrow" id="bendPrevBtn" aria-label="Previous Package">&#8593;</button>
        <div class="bend-dots" id="bendDots">
          ${PACKAGES.map((_, i) => `<span class="bend-dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></span>`).join('')}
        </div>
        <button type="button" class="bend-btn-arrow" id="bendNextBtn" aria-label="Next Package">&#8595;</button>
      </div>
    `;

    const viewport = mountEl.querySelector('#bendViewport');
    const cards = mountEl.querySelectorAll('.bend-card-item');
    const dots = mountEl.querySelectorAll('.bend-dot');
    const prevBtn = mountEl.querySelector('#bendPrevBtn');
    const nextBtn = mountEl.querySelector('#bendNextBtn');

    const totalCount = PACKAGES.length; // 4
    let activeIndex = 0; // Current card: 0 = Wedding, 1 = Baptism, 2 = Birthday, 3 = Funeral
    let currentPos = 0;  // Smooth float position
    let targetPos = 0;
    let isAnimating = false;
    let wheelCooldown = false;

    const getItemSpacing = () => {
      return window.innerWidth <= 768 ? 440 : 420;
    };

    const getParams = () => ({
      bendAngle: 58,
      bendCurve: 0.8,
      depth: 540,
      lift: 0.25,
      fadeCurve: 2.6
    });

    // Render 3D transforms for the 4 discrete cards
    const updateRender = () => {
      const itemSpacing = getItemSpacing();
      const vh = viewport.offsetHeight || 560;
      const params = getParams();

      cards.forEach((card, i) => {
        // Distance relative to current smooth position
        const dist = (i - currentPos) * itemSpacing;
        const normY = dist / (vh * 0.46);
        const absNorm = Math.abs(normY);

        if (absNorm > 2.2) {
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          return;
        }

        const rotateX = -normY * params.bendAngle;
        const translateZ = -Math.pow(Math.min(1.4, absNorm), params.bendCurve) * params.depth;
        const translateY = dist - normY * absNorm * (itemSpacing * params.lift);
        const scale = Math.max(0.68, 1 - absNorm * 0.16);
        const opacity = Math.max(0, 1 - Math.pow(Math.min(1.5, absNorm) / 1.4, params.fadeCurve));
        const zIndex = Math.round(100 - absNorm * 30);

        card.style.transform = `translate(-50%, -50%) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = zIndex;
        // Only the active card (closest to center) is interactive
        card.style.pointerEvents = absNorm < 0.4 ? 'auto' : 'none';
      });

      // Update dots
      const activeDot = Math.round(currentPos);
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeDot);
      });
    };

    // Smooth Animation Frame
    const animate = () => {
      const diff = targetPos - currentPos;
      if (Math.abs(diff) > 0.005) {
        currentPos += diff * 0.16;
        updateRender();
        requestAnimationFrame(animate);
      } else {
        currentPos = targetPos;
        updateRender();
        isAnimating = false;
      }
    };

    const goToIndex = (idx) => {
      const clamped = Math.max(0, Math.min(totalCount - 1, idx));
      if (clamped !== targetPos) {
        targetPos = clamped;
        activeIndex = clamped;
        if (!isAnimating) {
          isAnimating = true;
          requestAnimationFrame(animate);
        }
      }
    };

    // ── WHEEL SCROLL HANDLING (Finite Step, No Infinite Loop) ──
    viewport.addEventListener('wheel', (e) => {
      const deltaY = e.deltaY;

      // If scrolling down
      if (deltaY > 0) {
        if (activeIndex < totalCount - 1) {
          // Advance to next card and prevent page scroll
          e.preventDefault();
          if (!wheelCooldown) {
            wheelCooldown = true;
            goToIndex(activeIndex + 1);
            setTimeout(() => { wheelCooldown = false; }, 420);
          }
        } else {
          // Reached FUNERALS (last card)!
          // DO NOT preventDefault! Let page scroll naturally down!
        }
      } else if (deltaY < 0) {
        // If scrolling up
        if (activeIndex > 0) {
          // Go back to previous card and prevent page scroll
          e.preventDefault();
          if (!wheelCooldown) {
            wheelCooldown = true;
            goToIndex(activeIndex - 1);
            setTimeout(() => { wheelCooldown = false; }, 420);
          }
        } else {
          // Reached WEDDINGS (first card)!
          // DO NOT preventDefault! Let page scroll naturally up!
        }
      }
    }, { passive: false });

    // ── TOUCH GESTURES (Mobile-friendly, Natural Boundary Scrolling) ──
    let touchStartY = 0;
    let touchStartX = 0;
    let touchMoved = false;

    viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchMoved = false;
      }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      if (e.touches.length !== 1) return;
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = touchStartY - currentY;
      const diffX = touchStartX - currentX;

      // If primarily vertical swipe
      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
        touchMoved = true;
        // If at Funeral and swiping up (scrolling down the page) -> let native page scroll happen!
        if (diffY > 0 && activeIndex === totalCount - 1) {
          return; // Native scroll continues down
        }
        // If at Wedding and swiping down (scrolling up the page) -> let native page scroll happen!
        if (diffY < 0 && activeIndex === 0) {
          return; // Native scroll continues up
        }
      }
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      if (!touchMoved) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;

      // Significant swipe threshold
      if (Math.abs(diffY) > 40) {
        if (diffY > 0 && activeIndex < totalCount - 1) {
          goToIndex(activeIndex + 1);
        } else if (diffY < 0 && activeIndex > 0) {
          goToIndex(activeIndex - 1);
        }
      }
      touchMoved = false;
    }, { passive: true });

    // ── CARD CLICKING & NAVIGATION ──
    cards.forEach((card) => {
      // Ensure click on card or button reliably navigates to checklist
      card.addEventListener('click', function (e) {
        // If user tapped a card that is not the active center card, bring it to center first!
        const cardIdx = parseInt(this.dataset.index, 10);
        if (cardIdx !== activeIndex) {
          e.preventDefault();
          goToIndex(cardIdx);
          return;
        }

        // Active card: direct navigation!
        const targetUrl = this.getAttribute('href');
        if (targetUrl) {
          window.location.href = targetUrl;
        }
      });
    });

    // Prev / Next arrow buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToIndex(activeIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToIndex(activeIndex + 1);
      });
    }

    // Dot indicators
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const dotIdx = parseInt(dot.dataset.dot, 10);
        goToIndex(dotIdx);
      });
    });

    window.addEventListener('resize', updateRender, { passive: true });
    updateRender();
  }

  // Global expose
  window.initRejoiceBendGallery = initBendGallery;

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initBendGallery('bendGalleryContainer'));
  } else {
    initBendGallery('bendGalleryContainer');
  }

})();
