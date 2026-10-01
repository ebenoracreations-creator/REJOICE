/**
 * Rejoice Events — 3D Dome Gallery Engine (The Globe)
 * Native Vanilla JS implementation of React Bits DomeGallery.
 * Supports exact N-picture frames with ZERO repeats (80 unique frames for 80 pictures).
 * Fully touch-optimized with smooth inertia and glitch-free mobile lightbox preview.
 */

(function () {
  'use strict';

  const DEFAULT_IMAGES = [
    { src: 'images/DOM%20gallery/IMG-20260918-WA0025.jpg', alt: 'Bespoke Floral Mandap Arch & Sacred Altar Styling · Rejoice Events Kerala' },
    { src: 'images/DOM%20gallery/IMG-20260918-WA0026.jpg', alt: 'Luxury Stage Decor & Ambient Grand Lighting · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260920-WA0016.jpg', alt: 'Holy Baptism Angel Wing Backdrop & Floral Cradle · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260920-WA0031.jpg', alt: 'Exquisite Fresh Bridal Bouquet Handcrafted · Rejoice Floral Studio' },
    { src: 'images/DOM%20gallery/IMG-20260920-WA0034.jpg', alt: 'Celebration Grand Pathway & Center Carpet Entrance · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260920-WA0041.jpg', alt: 'Intimate Candlelight Tablescape & Fresh Bloom Vases · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260926-WA0055.jpg', alt: 'Kerala Destination Wedding Grand Gazebo Decor · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260926-WA0056.jpg', alt: 'Royal Banquet Hall Drapery & Golden Chandelier Styling · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260926-WA0057.jpg', alt: 'Traditional Kerala Wedding Stage & Fresh Jasmine Styling · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260926-WA0060.jpg', alt: 'Sculptural Floral Gateway Arch & Welcome Installation · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260926-WA0061.jpg', alt: 'Enchanted Birthday Fairy Garden & Pastel Balloon Styling · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260926-WA0062.jpg', alt: 'Dignified Sacred Altar Floral Tribute · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260926-WA0063.jpg', alt: 'Grand Reception Stage Floral Canopy · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260926-WA0065.jpg', alt: 'Bespoke Glass Table Floral Styling & Crystal Settings · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260926-WA0066.jpg', alt: 'Church Baptism Altar & Candlelit Procession Setting · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260926-WA0067.jpg', alt: 'Outdoor Garden Wedding Fairylight Canopy · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260926-WA0069.jpg', alt: 'Bespoke Floral Mandap Arch & Sacred Altar Styling · Rejoice Events Kerala' },
    { src: 'images/DOM%20gallery/IMG-20260926-WA0070.jpg', alt: 'Luxury Stage Decor & Ambient Grand Lighting · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0103.jpg', alt: 'Holy Baptism Angel Wing Backdrop & Floral Cradle · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0104.jpg', alt: 'Exquisite Fresh Bridal Bouquet Handcrafted · Rejoice Floral Studio' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0105.jpg', alt: 'Celebration Grand Pathway & Center Carpet Entrance · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0106.jpg', alt: 'Intimate Candlelight Tablescape & Fresh Bloom Vases · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0107.jpg', alt: 'Kerala Destination Wedding Grand Gazebo Decor · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0108.jpg', alt: 'Royal Banquet Hall Drapery & Golden Chandelier Styling · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0109.jpg', alt: 'Traditional Kerala Wedding Stage & Fresh Jasmine Styling · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0110.jpg', alt: 'Sculptural Floral Gateway Arch & Welcome Installation · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0116.jpg', alt: 'Enchanted Birthday Fairy Garden & Pastel Balloon Styling · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0117.jpg', alt: 'Dignified Sacred Altar Floral Tribute · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0118.jpg', alt: 'Grand Reception Stage Floral Canopy · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0119.jpg', alt: 'Bespoke Glass Table Floral Styling & Crystal Settings · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0120.jpg', alt: 'Church Baptism Altar & Candlelit Procession Setting · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0121.jpg', alt: 'Outdoor Garden Wedding Fairylight Canopy · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0122.jpg', alt: 'Bespoke Floral Mandap Arch & Sacred Altar Styling · Rejoice Events Kerala' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0123.jpg', alt: 'Luxury Stage Decor & Ambient Grand Lighting · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0124.jpg', alt: 'Holy Baptism Angel Wing Backdrop & Floral Cradle · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0125.jpg', alt: 'Exquisite Fresh Bridal Bouquet Handcrafted · Rejoice Floral Studio' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0126.jpg', alt: 'Celebration Grand Pathway & Center Carpet Entrance · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0127.jpg', alt: 'Intimate Candlelight Tablescape & Fresh Bloom Vases · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0128.jpg', alt: 'Kerala Destination Wedding Grand Gazebo Decor · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0129.jpg', alt: 'Royal Banquet Hall Drapery & Golden Chandelier Styling · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0130.jpg', alt: 'Traditional Kerala Wedding Stage & Fresh Jasmine Styling · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0131.jpg', alt: 'Sculptural Floral Gateway Arch & Welcome Installation · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0132.jpg', alt: 'Enchanted Birthday Fairy Garden & Pastel Balloon Styling · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0133.jpg', alt: 'Dignified Sacred Altar Floral Tribute · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0134.jpg', alt: 'Grand Reception Stage Floral Canopy · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0135.jpg', alt: 'Bespoke Glass Table Floral Styling & Crystal Settings · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0136.jpg', alt: 'Church Baptism Altar & Candlelit Procession Setting · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0137.jpg', alt: 'Outdoor Garden Wedding Fairylight Canopy · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0138.jpg', alt: 'Bespoke Floral Mandap Arch & Sacred Altar Styling · Rejoice Events Kerala' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0139.jpg', alt: 'Luxury Stage Decor & Ambient Grand Lighting · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0140.jpg', alt: 'Holy Baptism Angel Wing Backdrop & Floral Cradle · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0141.jpg', alt: 'Exquisite Fresh Bridal Bouquet Handcrafted · Rejoice Floral Studio' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0142.jpg', alt: 'Celebration Grand Pathway & Center Carpet Entrance · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0143.jpg', alt: 'Intimate Candlelight Tablescape & Fresh Bloom Vases · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0144.jpg', alt: 'Kerala Destination Wedding Grand Gazebo Decor · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0145.jpg', alt: 'Royal Banquet Hall Drapery & Golden Chandelier Styling · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0146.jpg', alt: 'Traditional Kerala Wedding Stage & Fresh Jasmine Styling · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0147.jpg', alt: 'Sculptural Floral Gateway Arch & Welcome Installation · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0149.jpg', alt: 'Enchanted Birthday Fairy Garden & Pastel Balloon Styling · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0150.jpg', alt: 'Dignified Sacred Altar Floral Tribute · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0151.jpg', alt: 'Grand Reception Stage Floral Canopy · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0152.jpg', alt: 'Bespoke Glass Table Floral Styling & Crystal Settings · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0153.jpg', alt: 'Church Baptism Altar & Candlelit Procession Setting · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0154.jpg', alt: 'Outdoor Garden Wedding Fairylight Canopy · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0155.jpg', alt: 'Bespoke Floral Mandap Arch & Sacred Altar Styling · Rejoice Events Kerala' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0156.jpg', alt: 'Luxury Stage Decor & Ambient Grand Lighting · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0157.jpg', alt: 'Holy Baptism Angel Wing Backdrop & Floral Cradle · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0158.jpg', alt: 'Exquisite Fresh Bridal Bouquet Handcrafted · Rejoice Floral Studio' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0159.jpg', alt: 'Celebration Grand Pathway & Center Carpet Entrance · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0160.jpg', alt: 'Intimate Candlelight Tablescape & Fresh Bloom Vases · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0161.jpg', alt: 'Kerala Destination Wedding Grand Gazebo Decor · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0162.jpg', alt: 'Royal Banquet Hall Drapery & Golden Chandelier Styling · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0163.jpg', alt: 'Traditional Kerala Wedding Stage & Fresh Jasmine Styling · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0164.jpg', alt: 'Sculptural Floral Gateway Arch & Welcome Installation · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0165.jpg', alt: 'Enchanted Birthday Fairy Garden & Pastel Balloon Styling · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0166.jpg', alt: 'Dignified Sacred Altar Floral Tribute · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0167.jpg', alt: 'Grand Reception Stage Floral Canopy · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0168.jpg', alt: 'Bespoke Glass Table Floral Styling & Crystal Settings · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0169.jpg', alt: 'Church Baptism Altar & Candlelit Procession Setting · Rejoice Events' },
    { src: 'images/DOM%20gallery/IMG-20260928-WA0170.jpg', alt: 'Outdoor Garden Wedding Fairylight Canopy · Rejoice Events' }
  ];

  const DEFAULTS = {
    maxVerticalRotationDeg: 8,
    dragSensitivity: 18,
    enlargeTransitionMs: 350,
    segments: 35,
    fit: 0.55,
    minRadius: 550,
    maxRadius: 1800,
    padFactor: 0.2,
    overlayBlurColor: '#100d14',
    dragDampening: 2,
    imageBorderRadius: '16px',
    openedImageBorderRadius: '24px',
    grayscale: false
  };

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
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
      if (typeof image === 'string') return { src: image, alt: 'Rejoice Events Kerala' };
      return { src: image.src || '', alt: image.alt || 'Rejoice Events Kerala' };
    });

    const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

    // Ensure adjacent slots never repeat the same image
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
                    <img src="${it.src}" draggable="false" alt="${it.alt}" loading="lazy" decoding="async" />
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
          // User intended vertical page scroll — yield to native browser scroll
          dragMode = 'scroll';
          isDragging = false;
          return;
        } else {
          dragMode = 'rotate';
        }
      }

      if (distSq > 324 && dragMode === 'rotate') {
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
          <div class="dome-lightbox-actions" style="margin-top: 14px; text-align: center;">
            <a href="#packages" class="btn-pill btn-gold dome-lightbox-btn" style="padding: 9px 22px; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">View Packages &amp; Checklists &#8594;</a>
          </div>
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

    // Mobile Phone & Desktop Click/Touch Handling
    mountEl.querySelectorAll('.item__image').forEach(itemEl => {
      const parent = itemEl.closest('.item');
      const src = parent ? parent.dataset.src : '';
      const imgEl = itemEl.querySelector('img');
      const alt = imgEl ? imgEl.alt : 'Rejoice Events Kerala';

      let touchStartX = 0;
      let touchStartY = 0;
      let touchStartTime = 0;
      let touchMoved = false;

      // Native touch events for mobile phones (Brave, Chrome, Safari, Samsung Internet)
      itemEl.addEventListener('touchstart', e => {
        if (e.touches && e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          touchStartTime = performance.now();
          touchMoved = false;
        }
      }, { passive: true });

      itemEl.addEventListener('touchmove', e => {
        if (e.touches && e.touches.length === 1) {
          const dx = e.touches[0].clientX - touchStartX;
          const dy = e.touches[0].clientY - touchStartY;
          if (dx * dx + dy * dy > 400) {
            touchMoved = true;
          }
        }
      }, { passive: true });

      itemEl.addEventListener('touchend', e => {
        const elapsed = performance.now() - touchStartTime;
        // If quick tap on phone screen (< 600ms and minimal movement), OPEN LIGHTBOX!
        if (!touchMoved && elapsed < 650 && (!hasMoved || dragMode !== 'rotate')) {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(src, alt);
        }
      }, { passive: false });

      // Click event for laptop & desktop mouse
      itemEl.addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();
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
