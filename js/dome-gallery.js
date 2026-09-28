/**
 * Rejoice Events — 3D Dome Gallery Engine (The Globe)
 * Native Vanilla JS implementation of React Bits DomeGallery.
 * Supports exact N-picture frames with ZERO repeats (e.g., 24 frames for 24 pictures, 50 frames for 50 pictures).
 * Fully touch-optimized with smooth inertia and glitch-free mobile lightbox preview.
 */

(function () {
  'use strict';

  const DEFAULT_IMAGES = [
    { src: 'images/packages/wedding-card.jpg', alt: 'Luxury Kerala Wedding Stage Decor by Rejoice' },
    { src: 'images/packages/baptism-card.jpg', alt: 'Bespoke Angel Wing Baptism Setup by Rejoice' },
    { src: 'images/packages/birthday-card.jpg', alt: 'Enchanted Fairy Birthday Garden Setup by Rejoice' },
    { src: 'images/packages/funeral-card.jpeg', alt: 'Sacred Floral Altar Memorial Tribute by Rejoice' },
    { src: 'images/packages/flower-1.jpg', alt: 'Grand Mandap Floral Arch by Rejoice Studio' },
    { src: 'images/packages/flower-2.jpg', alt: 'Bespoke Luxury Bridal Bouquet' },
    { src: 'images/packages/flower-3.jpg', alt: 'Exquisite Fresh Floral Tablescapes' },
    { src: 'images/packages/flower-4.jpg', alt: 'Celebration Grand Entrance Gateway' },
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85', alt: 'Grand Gala Banquet by Rejoice Events Kerala' },
    { src: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85', alt: 'Rejoice Floral Studio Cascading Mandap' },
    { src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=85', alt: 'Luxury Banquet Hall Lighting & Production' },
    { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=85', alt: 'Traditional Kerala Wedding Ceremony by Rejoice' }
  ];

  const DEFAULTS = {
    maxVerticalRotationDeg: 8,
    dragSensitivity: 18,
    enlargeTransitionMs: 350,
    fit: 0.55,
    minRadius: 360,
    maxRadius: 1800,
    padFactor: 0.2,
    overlayBlurColor: '#100d14',
    dragDampening: 2,
    imageBorderRadius: '20px',
    openedImageBorderRadius: '28px',
    grayscale: false
  };

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const wrapAngleSigned = deg => (((deg + 180) % 360) + 360) % 360 - 180;

  /**
   * Build exactly N unique frames for N images — NO REPETITIONS.
   * Staggers frames into balanced spherical latitude rings.
   */
  function buildItems(pool) {
    const normalizedImages = pool.map(image => {
      if (typeof image === 'string') return { src: image, alt: 'Rejoice Events Kerala' };
      return { src: image.src || '', alt: image.alt || 'Rejoice Events Kerala' };
    });

    const N = normalizedImages.length;
    if (N === 0) return { items: [], maxCols: 1, numRows: 1 };

    // Determine optimal number of latitude rows (rings) based on picture count N
    let numRows;
    if (N <= 8) numRows = 2;
    else if (N <= 18) numRows = 3;
    else if (N <= 35) numRows = 4;
    else if (N <= 65) numRows = 5;
    else numRows = 6;

    // Symmetrical elevation angles (latitudes)
    const maxLat = numRows <= 3 ? 18 : 25;
    const latitudes = [];
    if (numRows === 1) {
      latitudes.push(0);
    } else {
      const step = (maxLat * 2) / (numRows - 1);
      for (let r = 0; r < numRows; r++) {
        latitudes.push(-maxLat + r * step);
      }
    }

    // Weight capacity of each row by cos(latitude)
    const weights = latitudes.map(lat => Math.cos((lat * Math.PI) / 180));
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    // Initial item counts per row
    let rowCounts = weights.map(w => Math.max(1, Math.round((w / totalWeight) * N)));
    let currentTotal = rowCounts.reduce((a, b) => a + b, 0);

    // Fine-tune to match exactly N items
    while (currentTotal !== N) {
      if (currentTotal < N) {
        const mid = Math.floor(numRows / 2);
        rowCounts[mid]++;
        currentTotal++;
      } else {
        let maxIdx = 0;
        for (let i = 1; i < numRows; i++) {
          if (rowCounts[i] > rowCounts[maxIdx]) maxIdx = i;
        }
        if (rowCounts[maxIdx] > 1) {
          rowCounts[maxIdx]--;
          currentTotal--;
        } else {
          break;
        }
      }
    }

    const maxCols = Math.max(...rowCounts);

    // Place each unique image into its row and column
    const items = [];
    let imgIdx = 0;

    for (let r = 0; r < numRows; r++) {
      const k = rowCounts[r];
      const lat = latitudes[r];
      const stepY = 360 / k;
      // Stagger odd rows by half a slot for natural honeycomb brickwork
      const stagger = r % 2 === 1 ? stepY / 2 : 0;

      for (let c = 0; c < k; c++) {
        if (imgIdx >= N) break;
        const rotateY = wrapAngleSigned(c * stepY + stagger);
        const rotateX = lat;
        items.push({
          src: normalizedImages[imgIdx].src,
          alt: normalizedImages[imgIdx].alt,
          rotateX,
          rotateY,
          row: r,
          col: c
        });
        imgIdx++;
      }
    }

    return { items, maxCols, numRows };
  }

  function initDomeGallery(containerId, userImages) {
    const mountEl = document.getElementById(containerId);
    if (!mountEl) return;

    const images = userImages && userImages.length > 0 ? userImages : DEFAULT_IMAGES;
    const { items, maxCols, numRows } = buildItems(images);

    // Build DOM structure
    mountEl.innerHTML = `
      <div class="sphere-root" style="--overlay-blur-color:${DEFAULTS.overlayBlurColor};--tile-radius:${DEFAULTS.imageBorderRadius};--enlarge-radius:${DEFAULTS.openedImageBorderRadius};">
        <main class="sphere-main">
          <div class="stage">
            <div class="sphere">
              ${items.map((it, i) => `
                <div class="item" data-index="${i}" data-src="${it.src}" style="--base-rot-x:${it.rotateX.toFixed(3)}deg;--base-rot-y:${it.rotateY.toFixed(3)}deg;">
                  <div class="item__image" role="button" tabindex="0" aria-label="${it.alt}">
                    <img src="${it.src}" draggable="false" alt="${it.alt}" loading="lazy" decoding="async" />
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="overlay"></div>
          <div class="overlay overlay--blur"></div>
          <div class="edge-fade edge-fade--top"></div>
          <div class="edge-fade edge-fade--bottom"></div>
        </main>
      </div>
    `;

    const root = mountEl.querySelector('.sphere-root');
    const main = mountEl.querySelector('.sphere-main');
    const sphere = mountEl.querySelector('.sphere');

    let rotation = { x: 0, y: 0 };
    let startRot = { x: 0, y: 0 };
    let startPos = null;
    let isDragging = false;
    let hasMoved = false;
    let dragMode = null; // 'rotate' | 'scroll' | null
    let inertiaRAF = null;

    const applyTransform = (xDeg, yDeg) => {
      if (sphere) {
        sphere.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
      }
    };

    // Resize Observer for sphere radius and responsive card dimensions
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width);
      const h = Math.max(1, cr.height);
      const minDim = Math.min(w, h);
      const aspect = w / h;
      const basis = aspect >= 1.3 ? w : minDim;
      let radius = basis * DEFAULTS.fit;
      radius = Math.min(radius, h * 1.35);
      radius = clamp(radius, DEFAULTS.minRadius, DEFAULTS.maxRadius);

      const viewerPad = Math.max(8, Math.round(minDim * DEFAULTS.padFactor));
      root.style.setProperty('--radius', `${Math.round(radius)}px`);
      root.style.setProperty('--viewer-pad', `${viewerPad}px`);

      // Compute dynamic width and height tailored to the frame count
      const wFactor = Math.min(0.36, Math.max(0.18, 2.2 / maxCols));
      const hFactor = wFactor * 0.72;
      const tileW = Math.round(clamp(radius * wFactor, 105, 240));
      const tileH = Math.round(clamp(radius * hFactor, 76, 175));
      root.style.setProperty('--item-w', `${tileW}px`);
      root.style.setProperty('--item-h', `${tileH}px`);

      applyTransform(rotation.x, rotation.y);
    });
    ro.observe(root);

    // Inertia momentum
    const stopInertia = () => {
      if (inertiaRAF) {
        cancelAnimationFrame(inertiaRAF);
        inertiaRAF = null;
      }
    };

    const startInertia = (vx, vy) => {
      let vX = clamp(vx, -1.4, 1.4) * 80;
      let vY = clamp(vy, -1.4, 1.4) * 80;
      let frames = 0;
      const frictionMul = 0.95;
      const stopThreshold = 0.012;
      const maxFrames = 180;

      const step = () => {
        vX *= frictionMul;
        vY *= frictionMul;
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF = null;
          return;
        }
        if (++frames > maxFrames) {
          inertiaRAF = null;
          return;
        }
        const nextX = clamp(rotation.x - vY / 200, -DEFAULTS.maxVerticalRotationDeg, DEFAULTS.maxVerticalRotationDeg);
        const nextY = wrapAngleSigned(rotation.y + vX / 200);
        rotation = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
        inertiaRAF = requestAnimationFrame(step);
      };
      stopInertia();
      inertiaRAF = requestAnimationFrame(step);
    };

    let isLightboxOpen = false;

    // Pointer / Touch / Drag Events
    let prevPointer = null;
    let velocity = { x: 0, y: 0 };

    main.addEventListener('pointerdown', e => {
      if (isLightboxOpen) return;
      stopInertia();
      isDragging = true;
      hasMoved = false;
      dragMode = null;
      startRot = { ...rotation };
      startPos = { x: e.clientX, y: e.clientY };
      prevPointer = { x: e.clientX, y: e.clientY, time: performance.now() };
    });

    window.addEventListener('pointermove', e => {
      if (isLightboxOpen || !isDragging || !startPos) return;
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      const distSq = dx * dx + dy * dy;

      // On touch devices, detect if vertical scrolling or horizontal rotating
      if (!dragMode && distSq > 36) {
        if (e.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx) * 1.15) {
          // User intended vertical page scroll — yield to native browser scroll
          dragMode = 'scroll';
          isDragging = false;
          return;
        } else {
          dragMode = 'rotate';
        }
      }

      if (distSq > 64) {
        hasMoved = true;
      }

      if (dragMode === 'rotate' || (!dragMode && e.pointerType !== 'touch')) {
        const nextX = clamp(startRot.x - dy / DEFAULTS.dragSensitivity, -DEFAULTS.maxVerticalRotationDeg, DEFAULTS.maxVerticalRotationDeg);
        const nextY = wrapAngleSigned(startRot.y + dx / DEFAULTS.dragSensitivity);
        rotation = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);

        const now = performance.now();
        const dt = now - prevPointer.time;
        if (dt > 10) {
          velocity = {
            x: (e.clientX - prevPointer.x) / dt,
            y: (e.clientY - prevPointer.y) / dt
          };
          prevPointer = { x: e.clientX, y: e.clientY, time: now };
        }
      }
    });

    window.addEventListener('pointerup', () => {
      if (!isDragging) return;
      isDragging = false;
      if (hasMoved && dragMode === 'rotate') {
        startInertia(velocity.x, velocity.y);
      }
      setTimeout(() => {
        hasMoved = false;
        dragMode = null;
      }, 50);
    });

    // ══════════ FULLSCREEN LIGHTBOX MODAL ══════════
    let lightboxEl = document.getElementById('rejoiceDomeLightbox');
    let lightboxOpenedAt = 0;

    if (!lightboxEl) {
      lightboxEl = document.createElement('div');
      lightboxEl.id = 'rejoiceDomeLightbox';
      lightboxEl.className = 'dome-lightbox';
      lightboxEl.setAttribute('role', 'dialog');
      lightboxEl.setAttribute('aria-modal', 'true');
      lightboxEl.setAttribute('aria-label', 'Photo Preview');
      lightboxEl.innerHTML = `
        <button type="button" class="dome-lightbox-close" aria-label="Close photo preview">&times;</button>
        <div class="dome-lightbox-content">
          <img class="dome-lightbox-img" src="" alt="Celebration photo by Rejoice Events" />
          <div class="dome-lightbox-caption"></div>
        </div>
      `;
      document.body.appendChild(lightboxEl);

      const closeLb = () => {
        lightboxEl.classList.remove('active');
        isLightboxOpen = false;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          isIdle = true;
          requestAnimationFrame(startAmbient);
        }, 1000);
      };

      const closeBtn = lightboxEl.querySelector('.dome-lightbox-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', e => {
          e.stopPropagation();
          closeLb();
        });
        closeBtn.addEventListener('touchend', e => {
          e.stopPropagation();
          e.preventDefault();
          closeLb();
        });
      }

      lightboxEl.addEventListener('click', e => {
        // Prevent synthesized ghost clicks right after modal opens from immediately closing it
        if (performance.now() - lightboxOpenedAt < 400) return;
        if (e.target === lightboxEl || e.target.classList.contains('dome-lightbox-content')) {
          closeLb();
        }
      });

      // Prevent background scrolling while modal is open
      lightboxEl.addEventListener('touchmove', e => {
        e.preventDefault();
      }, { passive: false });
      lightboxEl.addEventListener('wheel', e => {
        e.preventDefault();
      }, { passive: false });

      window.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lightboxEl.classList.contains('active')) closeLb();
      });
    }

    const openLightbox = (src, alt) => {
      if (!lightboxEl || !src) return;
      isLightboxOpen = true;
      lightboxOpenedAt = performance.now();
      stopInertia();
      isDragging = false;

      const img = lightboxEl.querySelector('.dome-lightbox-img');
      const caption = lightboxEl.querySelector('.dome-lightbox-caption');

      if (img) {
        img.src = src;
        img.alt = alt || 'Rejoice Events Kerala';
        img.style.opacity = '1';
      }

      if (caption) {
        caption.textContent = alt || 'Rejoice Events & Floral Studio · Kerala';
      }

      lightboxEl.classList.add('active');
    };

    // Mobile & Desktop Tap / Click Handling (Ghost-Click Proof)
    mountEl.querySelectorAll('.item__image').forEach(itemEl => {
      const parent = itemEl.closest('.item');
      const src = parent ? parent.dataset.src : '';
      const imgEl = itemEl.querySelector('img');
      const alt = imgEl ? imgEl.alt : 'Rejoice Events Kerala';

      let tapStartX = 0;
      let tapStartY = 0;
      let tapDistMoved = 0;

      itemEl.addEventListener('pointerdown', e => {
        tapStartX = e.clientX;
        tapStartY = e.clientY;
        tapDistMoved = 0;
      });

      itemEl.addEventListener('pointermove', e => {
        const dx = e.clientX - tapStartX;
        const dy = e.clientY - tapStartY;
        tapDistMoved = Math.max(tapDistMoved, dx * dx + dy * dy);
      });

      itemEl.addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();
        // Discard click if finger moved to drag or rotate
        if (tapDistMoved > 49 || hasMoved) return;
        openLightbox(src, alt);
      });
    });

    // Auto slow continuous ambient spin when idle
    let idleTimer = null;
    let isIdle = true;
    const startAmbient = () => {
      if (isLightboxOpen || !isIdle || isDragging) return;
      rotation.y = wrapAngleSigned(rotation.y + 0.08);
      applyTransform(rotation.x, rotation.y);
      requestAnimationFrame(startAmbient);
    };
    requestAnimationFrame(startAmbient);

    main.addEventListener('pointerdown', () => {
      if (isLightboxOpen) return;
      isIdle = false;
      clearTimeout(idleTimer);
    });
    main.addEventListener('pointerup', () => {
      if (isLightboxOpen) return;
      idleTimer = setTimeout(() => { isIdle = true; requestAnimationFrame(startAmbient); }, 3000);
    });
  }

  // Expose global init function
  window.initRejoiceDomeGallery = initDomeGallery;

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initDomeGallery('domeGalleryContainer'));
  } else {
    initDomeGallery('domeGalleryContainer');
  }

})();
