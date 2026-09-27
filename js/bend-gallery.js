/**
 * Rejoice Events — Bend Gallery (3D Infinite Looping Folding Column)
 * Based on React Bits Pro BendGallery
 * Infinite 3D looping for: Weddings, Baptisms, Birthdays, Funerals
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

    // Render Markup
    mountEl.innerHTML = `
      <div class="bend-gallery-viewport" id="bendViewport" role="region" aria-label="Interactive 3D Package Gallery">
        <div class="bend-stage" id="bendStage">
          ${PACKAGES.map((pkg, idx) => `
            <a href="${pkg.url}" class="bend-card-item" data-index="${idx}" aria-label="Explore ${pkg.title} Checklist">
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
      <p class="bend-instructions">↕ Swipe, Drag or Scroll to Loop Packages · Click Any Card for Checklist</p>
    `;

    const viewport = mountEl.querySelector('#bendViewport');
    const cards = mountEl.querySelectorAll('.bend-card-item');
    const dots = mountEl.querySelectorAll('.bend-dot');
    const prevBtn = mountEl.querySelector('#bendPrevBtn');
    const nextBtn = mountEl.querySelector('#bendNextBtn');

    const totalCount = PACKAGES.length; // 4
    let targetOffset = 0;
    let currentOffset = 0;
    let isDragging = false;
    let startY = 0;
    let startOffset = 0;
    let movedDistance = 0;
    let velocityY = 0;
    let lastTime = 0;
    let rafId = null;

    const getItemSpacing = () => {
      return window.innerWidth <= 768 ? 390 : 430;
    };

    const getParams = () => ({
      bendAngle: 62,      // rotation in degrees at top and bottom edge
      bendCurve: 0.78,    // curvature
      depth: 560,         // sinking in Z space
      lift: 0.28,         // vertical compression
      fadeCurve: 2.8      // opacity fade curve
    });

    const updateRender = () => {
      const itemSpacing = getItemSpacing();
      const totalCycle = totalCount * itemSpacing;
      const vh = viewport.offsetHeight || 560;
      const params = getParams();

      cards.forEach((card, i) => {
        // Compute wrapped distance from current offset
        let dist = (i * itemSpacing - currentOffset) % totalCycle;
        if (dist < -totalCycle / 2) dist += totalCycle;
        if (dist > totalCycle / 2) dist -= totalCycle;

        const normY = dist / (vh * 0.44);
        const absNorm = Math.abs(normY);

        // 3D Bend calculations
        const rotateX = -normY * params.bendAngle;
        const translateZ = -Math.pow(Math.min(1.5, absNorm), params.bendCurve) * params.depth;
        const translateY = dist - normY * absNorm * (itemSpacing * params.lift);
        const scale = Math.max(0.68, 1 - absNorm * 0.16);
        const opacity = Math.max(0, 1 - Math.pow(Math.min(1.6, absNorm) / 1.45, params.fadeCurve));
        const zIndex = Math.round(100 - absNorm * 50);

        card.style.transform = `translate(-50%, -50%) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = zIndex;
        card.style.pointerEvents = absNorm > 0.85 ? 'none' : 'auto';
      });

      // Active Dot Calculation
      const rawActive = Math.round(currentOffset / itemSpacing);
      const activeIdx = ((rawActive % totalCount) + totalCount) % totalCount;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIdx);
      });
    };

    // Animation Loop with Smooth Damping
    const animate = (time) => {
      const diff = targetOffset - currentOffset;
      if (Math.abs(diff) > 0.1) {
        currentOffset += diff * 0.14;
      } else {
        currentOffset = targetOffset;
      }
      updateRender();
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    // Pointer Drag & Swipe
    viewport.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startY = e.clientY;
      startOffset = targetOffset;
      movedDistance = 0;
      velocityY = 0;
      lastTime = performance.now();
      viewport.setPointerCapture(e.pointerId);
    });

    viewport.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dy = e.clientY - startY;
      movedDistance = Math.abs(dy);
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 8) {
        velocityY = -dy / dt;
        lastTime = now;
      }
      targetOffset = startOffset - dy * 1.25;
    });

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      const itemSpacing = getItemSpacing();

      // Inertia throw
      if (Math.abs(velocityY) > 0.3) {
        targetOffset += velocityY * 180;
      }

      // Snap gently to nearest card
      targetOffset = Math.round(targetOffset / itemSpacing) * itemSpacing;
    };

    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointercancel', onPointerUp);

    // Prevent navigation if dragged
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (movedDistance > 8) {
          e.preventDefault();
        }
      });
    });

    // Mouse Wheel
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const itemSpacing = getItemSpacing();
      const delta = Math.sign(e.deltaY) * itemSpacing;
      targetOffset = Math.round((targetOffset + delta) / itemSpacing) * itemSpacing;
    }, { passive: false });

    // Buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const itemSpacing = getItemSpacing();
        targetOffset = (Math.round(targetOffset / itemSpacing) - 1) * itemSpacing;
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const itemSpacing = getItemSpacing();
        targetOffset = (Math.round(targetOffset / itemSpacing) + 1) * itemSpacing;
      });
    }

    // Dots Click
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const dotIdx = parseInt(dot.dataset.dot, 10);
        const itemSpacing = getItemSpacing();
        const currentIdx = ((Math.round(targetOffset / itemSpacing) % totalCount) + totalCount) % totalCount;
        let diff = dotIdx - currentIdx;
        if (diff > 2) diff -= 4;
        if (diff < -2) diff += 4;
        targetOffset += diff * itemSpacing;
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
