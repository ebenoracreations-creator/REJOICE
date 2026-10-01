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
      badge: '',
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
      image: 'images/packages/wedding-card.jpg',
      alt: 'Luxury Kerala Wedding Stage Decor by Rejoice Events',
      url: 'wedding.html'
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
      image: 'images/packages/baptism-card.jpg',
      alt: 'Bespoke Angel Wing Baptism Setup by Rejoice Events',
      url: 'baptism.html'
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
      image: 'images/packages/birthday-card.jpg',
      alt: 'Enchanted Fairy Birthday Garden Setup by Rejoice Events',
      url: 'birthday.html'
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
      url: 'funeral.html'
    },
    {
      id: 'custom',
      title: 'Custom Celebrations',
      badge: 'Bespoke Vision',
      badgeClass: '',
      sub: 'Engagements, jubilees, housewarmings & tailor-made concepts',
      checkTitle: 'Custom Checklist:',
      bullets: [
        'Tailored Stage Concepts & Theme Architecture',
        'Bespoke Fresh Floral Art & Entrance Arches',
        'Special Effects, LED Walls & Pyrotechnics',
        'Gourmet Multi-Course Feast Catering Coordination',
        'Dedicated Master of Ceremonies & Live Artists'
      ],
      image: 'images/packages/engagements.png',
      alt: 'Bespoke Custom Celebration Planning by Rejoice Events Kerala',
      url: 'custom.html'
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
                  ${pkg.badge ? `<span class="bend-badge ${pkg.badgeClass}">${pkg.badge}</span>` : ''}
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

        card.style.transform = `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = zIndex;
        // Visible cards are interactive
        card.style.pointerEvents = absNorm < 1.4 ? 'auto' : 'none';
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

    const packagesSection = document.getElementById('packages');

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

    const getTolerance = () => Math.min(120, window.innerHeight * 0.22);

    // ── WHEEL SCROLL HANDLING ──
    // Only spin when card reaches the middle of viewport!
    // Unlock scroll down after Funerals.
    // Unlock scroll up after Wedding (NEVER pause/lock up-scroll past wedding).
    const handleWheel = (e) => {
      const deltaY = e.deltaY;
      if (Math.abs(deltaY) < 4) return;

      const rect = viewport.getBoundingClientRect();
      const viewportCenter = rect.top + rect.height / 2;
      const screenCenter = window.innerHeight / 2;
      const diffFromCenter = viewportCenter - screenCenter;
      const tolerance = getTolerance();

      // Scrolling DOWN
      if (deltaY > 0) {
        // Has not reached middle yet? (Cards are still below the middle)
        if (diffFromCenter > tolerance) {
          return; // Let the page scroll down naturally until cards reach the middle!
        }

        // Already passed far above the middle?
        if (diffFromCenter < -tolerance * 1.8) {
          return; // Let page scroll down naturally!
        }

        if (activeIndex < totalCount - 1) {
          // In middle zone and haven't reached Funerals yet -> LOCK PAGE SCROLL & STEP
          e.preventDefault();
          if (!wheelCooldown) {
            wheelCooldown = true;
            if (Math.abs(diffFromCenter) > 20) {
              window.scrollBy({ top: diffFromCenter, behavior: 'smooth' });
            }
            goToIndex(activeIndex + 1);
            setTimeout(() => { wheelCooldown = false; }, 360);
          }
        } else {
          // Reached FUNERALS (card 3) -> UNLOCK SCROLL DOWN!
          // DO NOT preventDefault! Page scrolls naturally down to next section!
        }
      } else if (deltaY < 0) {
        // Scrolling UP
        // Has not reached middle yet from below? (Cards are still above the middle)
        if (diffFromCenter < -tolerance) {
          return; // Let the page scroll UP naturally until cards reach the middle!
        }

        // Already passed far below the middle?
        if (diffFromCenter > tolerance * 1.8) {
          return; // Let page scroll UP naturally!
        }

        if (activeIndex > 0) {
          // In middle zone and haven't reached Weddings yet -> LOCK PAGE SCROLL & STEP BACK
          e.preventDefault();
          if (!wheelCooldown) {
            wheelCooldown = true;
            if (Math.abs(diffFromCenter) > 20) {
              window.scrollBy({ top: diffFromCenter, behavior: 'smooth' });
            }
            goToIndex(activeIndex - 1);
            setTimeout(() => { wheelCooldown = false; }, 360);
          }
        } else {
          // Reached WEDDINGS (card 0) -> UNLOCK SCROLL UP! NEVER PAUSE!
          // DO NOT preventDefault! Page scrolls naturally UP towards Hero!
        }
      }
    };

    // ── TOUCH GESTURES (Mobile & Tablet) ──
    let touchStartY = 0;
    let touchStartX = 0;
    let touchSwiping = false;
    let touchCooldown = false;

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchSwiping = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!touchSwiping || e.touches.length !== 1) return;
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = touchStartY - currentY; // positive = swipe UP (scroll DOWN)
      const diffX = touchStartX - currentX;

      // Micro-jitter guard: ignore tiny finger shifts during a tap so default tap/click events are not cancelled
      if (Math.abs(diffY) <= 10 && Math.abs(diffX) <= 10) return;

      // Predominantly horizontal swipe: ignore vertical card stepping
      if (Math.abs(diffX) > Math.abs(diffY) * 1.4) return;

      const rect = viewport.getBoundingClientRect();
      const viewportCenter = rect.top + rect.height / 2;
      const screenCenter = window.innerHeight / 2;
      const diffFromCenter = viewportCenter - screenCenter;
      const tolerance = getTolerance();

      // Swipe UP (scrolling DOWN)
      if (diffY > 0) {
        // Has not reached middle yet?
        if (diffFromCenter > tolerance) {
          return; // Allow native page scroll down!
        }
        // Already passed far above middle?
        if (diffFromCenter < -tolerance * 1.8) {
          return;
        }
        // At Funerals (last card)?
        if (activeIndex >= totalCount - 1) {
          return; // UNLOCK! Allow native page scroll down!
        }

        // In middle zone & not at Funerals: step card and hold page scroll
        if (e.cancelable) e.preventDefault();

        if (!touchCooldown && Math.abs(diffY) > 22) {
          touchCooldown = true;
          if (Math.abs(diffFromCenter) > 20) {
            window.scrollBy({ top: diffFromCenter, behavior: 'smooth' });
          }
          goToIndex(activeIndex + 1);
          setTimeout(() => { touchCooldown = false; }, 360);
          touchStartY = currentY;
        }
      } else if (diffY < 0) {
        // Swipe DOWN (scrolling UP)
        // Has not reached middle yet from below?
        if (diffFromCenter < -tolerance) {
          return; // Allow native page scroll UP!
        }
        // Already passed far below middle?
        if (diffFromCenter > tolerance * 1.8) {
          return;
        }
        // At Weddings (first card)?
        if (activeIndex <= 0) {
          return; // UNLOCK! DO NOT PAUSE! Allow native page scroll UP!
        }

        // In middle zone & not at Weddings: step card back and hold page scroll
        if (e.cancelable) e.preventDefault();

        if (!touchCooldown && Math.abs(diffY) > 22) {
          touchCooldown = true;
          if (Math.abs(diffFromCenter) > 20) {
            window.scrollBy({ top: diffFromCenter, behavior: 'smooth' });
          }
          goToIndex(activeIndex - 1);
          setTimeout(() => { touchCooldown = false; }, 360);
          touchStartY = currentY;
        }
      }
    };

    const handleTouchEnd = () => {
      touchSwiping = false;
    };

    // Attach to packages section (or viewport) cleanly without bubbling duplication
    const gestureTarget = packagesSection || viewport;
    gestureTarget.addEventListener('wheel', handleWheel, { passive: false });
    gestureTarget.addEventListener('touchstart', handleTouchStart, { passive: true });
    gestureTarget.addEventListener('touchmove', handleTouchMove, { passive: false });
    gestureTarget.addEventListener('touchend', handleTouchEnd, { passive: true });

    // ── CARD CLICKING & NAVIGATION ──
    cards.forEach((card) => {
      let cardTouchStartX = 0;
      let cardTouchStartY = 0;
      let cardTouchStartTime = 0;

      // Direct tap handling for touch devices (iOS Safari / Android Chrome)
      card.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length === 1) {
          cardTouchStartX = e.touches[0].clientX;
          cardTouchStartY = e.touches[0].clientY;
          cardTouchStartTime = Date.now();
        }
      }, { passive: true });

      card.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches.length === 1) {
          const dx = e.changedTouches[0].clientX - cardTouchStartX;
          const dy = e.changedTouches[0].clientY - cardTouchStartY;
          const elapsed = Date.now() - cardTouchStartTime;

          // If quick tap with minimal movement (< 28px threshold), navigate to checklist
          if (dx * dx + dy * dy < 784 && elapsed < 800) {
            const targetUrl = card.getAttribute('href');
            if (targetUrl) {
              e.preventDefault();
              window.location.href = targetUrl;
            }
          }
        }
      }, { passive: false });

      // Click fallback for desktop mouse or assistive devices
      card.addEventListener('click', function (e) {
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
