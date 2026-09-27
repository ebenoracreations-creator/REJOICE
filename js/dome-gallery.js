/**
 * Rejoice Events — 3D Dome Gallery Engine (The Globe)
 * Native Vanilla JS implementation of React Bits DomeGallery.
 */

(function () {
  'use strict';

  const DEFAULT_IMAGES = [
    { src: 'images/packages/wedding-card.png', alt: 'Luxury Kerala Wedding Stage Decor by Rejoice' },
    { src: 'images/packages/baptism-card.png', alt: 'Bespoke Angel Wing Baptism Setup by Rejoice' },
    { src: 'images/packages/birthday-card.png', alt: 'Enchanted Fairy Birthday Garden Setup by Rejoice' },
    { src: 'images/packages/funeral-card.jpeg', alt: 'Sacred Floral Altar Memorial Tribute by Rejoice' },
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85', alt: 'Grand Gala Banquet by Rejoice Events Kerala' },
    { src: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85', alt: 'Rejoice Floral Studio Cascading Mandap' },
    { src: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=85', alt: 'Handcrafted Luxury Bridal Bouquet' },
    { src: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=800&q=85', alt: 'Atmospheric Tablescapes with Fresh Florals' },
    { src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=85', alt: 'Sculptural Ceremony Floral Gateway' },
    { src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=85', alt: 'Luxury Banquet Hall Lighting & Production' },
    { src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=85', alt: 'Vibrant Celebration Jubilee Setup' },
    { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=85', alt: 'Traditional Kerala Wedding Ceremony by Rejoice' }
  ];

  const DEFAULTS = {
    maxVerticalRotationDeg: 7,
    dragSensitivity: 18,
    enlargeTransitionMs: 350,
    segments: 35,
    fit: 0.55,
    minRadius: 550,
    maxRadius: 1800,
    padFactor: 0.2,
    overlayBlurColor: '#100d14',
    dragDampening: 2,
    imageBorderRadius: '20px',
    openedImageBorderRadius: '28px',
    grayscale: false
  };

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const normalizeAngle = d => ((d % 360) + 360) % 360;
  const wrapAngleSigned = deg => (((deg + 180) % 360) + 360) % 360 - 180;

  function buildItems(pool, seg) {
    const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
    const evenYs = [-4, -2, 0, 2, 4];
    const oddYs = [-3, -1, 1, 3, 5];

    const coords = xCols.flatMap((x, c) => {
      const ys = c % 2 === 0 ? evenYs : oddYs;
      return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
    });

    const totalSlots = coords.length;
    const normalizedImages = pool.map(image => {
      if (typeof image === 'string') return { src: image, alt: 'Rejoice Events' };
      return { src: image.src || '', alt: image.alt || 'Rejoice Events' };
    });

    const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

    for (let i = 1; i < usedImages.length; i++) {
      if (usedImages[i].src === usedImages[i - 1].src) {
        for (let j = i + 1; j < usedImages.length; j++) {
          if (usedImages[j].src !== usedImages[i].src) {
            const tmp = usedImages[i];
            usedImages[i] = usedImages[j];
            usedImages[j] = tmp;
            break;
          }
        }
      }
    }

    return coords.map((c, i) => ({
      ...c,
      src: usedImages[i].src,
      alt: usedImages[i].alt
    }));
  }

  function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
    const unit = 360 / segments / 2;
    const rotateY = unit * (offsetX + (sizeX - 1) / 2);
    const rotateX = unit * (offsetY - (sizeY - 1) / 2);
    return { rotateX, rotateY };
  }

  function initDomeGallery(containerId, userImages) {
    const mountEl = document.getElementById(containerId);
    if (!mountEl) return;

    const images = userImages && userImages.length > 0 ? userImages : DEFAULT_IMAGES;
    const items = buildItems(images, DEFAULTS.segments);

    // Build DOM structure
    mountEl.innerHTML = `
      <div class="sphere-root" style="--segments-x:${DEFAULTS.segments};--segments-y:${DEFAULTS.segments};--overlay-blur-color:${DEFAULTS.overlayBlurColor};--tile-radius:${DEFAULTS.imageBorderRadius};--enlarge-radius:${DEFAULTS.openedImageBorderRadius};">
        <main class="sphere-main">
          <div class="stage">
            <div class="sphere">
              ${items.map((it, i) => {
                const base = computeItemBaseRotation(it.x, it.y, it.sizeX, it.sizeY, DEFAULTS.segments);
                return `
                <div class="item" data-index="${i}" data-src="${it.src}" data-offset-x="${it.x}" data-offset-y="${it.y}" data-size-x="${it.sizeX}" data-size-y="${it.sizeY}" style="--base-rot-x:${base.rotateX.toFixed(3)}deg;--base-rot-y:${base.rotateY.toFixed(3)}deg;--offset-x:${it.x};--offset-y:${it.y};--item-size-x:${it.sizeX};--item-size-y:${it.sizeY};">
                  <div class="item__image" role="button" tabindex="0" aria-label="${it.alt}">
                    <img src="${it.src}" draggable="false" alt="${it.alt}" loading="lazy" />
                  </div>
                </div>
              `;
              }).join('')}
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
    let lastDragEndAt = 0;

    const applyTransform = (xDeg, yDeg) => {
      if (sphere) {
        sphere.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
      }
    };

    // Resize Observer for sphere radius
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
          // User intended vertical page scroll — yield to native browser scroll!
          dragMode = 'scroll';
          isDragging = false;
          return;
        } else {
          dragMode = 'rotate';
        }
      }

      if (distSq > 100) {
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
        lastDragEndAt = performance.now();
        startInertia(velocity.x, velocity.y);
      }
      hasMoved = false;
      dragMode = null;
    });

    // ══════════ FULLSCREEN LIGHTBOX MODAL ══════════
    let lightboxEl = document.getElementById('rejoiceDomeLightbox');
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
        if (e.target === lightboxEl || e.target.classList.contains('dome-lightbox-content')) {
          closeLb();
        }
      });

      // Prevent background scrolling without touching body overflow (zero layout jumps)
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
      stopInertia();
      isDragging = false;

      const img = lightboxEl.querySelector('.dome-lightbox-img');
      const caption = lightboxEl.querySelector('.dome-lightbox-caption');

      if (img) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.25s ease';
        img.src = src;
        img.alt = alt || 'Rejoice Events Kerala';
        img.onload = () => { img.style.opacity = '1'; };
        if (img.complete) { img.style.opacity = '1'; }
      }

      if (caption) {
        caption.textContent = alt || 'Rejoice Events & Floral Studio · Kerala';
      }

      lightboxEl.classList.add('active');
    };

    // Robust Mobile & Desktop Tap / Click Detection on Items
    mountEl.querySelectorAll('.item__image').forEach(itemEl => {
      const parent = itemEl.closest('.item');
      const src = parent ? parent.dataset.src : '';
      const imgEl = itemEl.querySelector('img');
      const alt = imgEl ? imgEl.alt : 'Rejoice Events Kerala';

      let tapStartX = 0;
      let tapStartY = 0;
      let tapStartTime = 0;

      itemEl.addEventListener('pointerdown', e => {
        tapStartX = e.clientX;
        tapStartY = e.clientY;
        tapStartTime = performance.now();
      });

      itemEl.addEventListener('pointerup', e => {
        const dx = e.clientX - tapStartX;
        const dy = e.clientY - tapStartY;
        const elapsed = performance.now() - tapStartTime;
        // Clean intentional tap: finger moved < 12px and duration < 350ms
        if (dx * dx + dy * dy < 144 && elapsed < 350) {
          e.stopPropagation();
          openLightbox(src, alt);
        }
      });

      itemEl.addEventListener('click', e => {
        e.stopPropagation();
        if (hasMoved) return;
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

  // Expose global init
  window.initRejoiceDomeGallery = initDomeGallery;

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initDomeGallery('domeGalleryContainer'));
  } else {
    initDomeGallery('domeGalleryContainer');
  }

})();
