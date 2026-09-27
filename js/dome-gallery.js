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
          <div class="viewer">
            <div class="scrim"></div>
            <div class="frame"></div>
          </div>
          <div class="dg-instructions">✨ Drag 3D Globe to Rotate · Click Any Photo to Enlarge</div>
        </main>
      </div>
    `;

    const root = mountEl.querySelector('.sphere-root');
    const main = mountEl.querySelector('.sphere-main');
    const sphere = mountEl.querySelector('.sphere');
    const viewer = mountEl.querySelector('.viewer');
    const scrim = mountEl.querySelector('.scrim');
    const frame = mountEl.querySelector('.frame');

    let rotation = { x: 0, y: 0 };
    let startRot = { x: 0, y: 0 };
    let startPos = null;
    let isDragging = false;
    let hasMoved = false;
    let inertiaRAF = null;
    let isOpening = false;
    let openStartedAt = 0;
    let lastDragEndAt = 0;
    let focusedEl = null;
    let originalTilePos = null;

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

    // Pointer / Touch / Drag Events
    let prevPointer = null;
    let velocity = { x: 0, y: 0 };

    main.addEventListener('pointerdown', e => {
      if (focusedEl) return;
      stopInertia();
      isDragging = true;
      hasMoved = false;
      startRot = { ...rotation };
      startPos = { x: e.clientX, y: e.clientY };
      prevPointer = { x: e.clientX, y: e.clientY, time: performance.now() };
    });

    window.addEventListener('pointermove', e => {
      if (!isDragging || !startPos) return;
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      if (!hasMoved && (dx * dx + dy * dy > 16)) {
        hasMoved = true;
      }
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
    });

    window.addEventListener('pointerup', () => {
      if (!isDragging) return;
      isDragging = false;
      if (hasMoved) {
        lastDragEndAt = performance.now();
        startInertia(velocity.x, velocity.y);
      }
      hasMoved = false;
    });

    // Open Tile Modal
    const openTile = (el) => {
      if (isOpening) return;
      isOpening = true;
      openStartedAt = performance.now();
      focusedEl = el;

      const parent = el.parentElement;
      const offsetX = parseFloat(parent.dataset.offsetX);
      const offsetY = parseFloat(parent.dataset.offsetY);
      const sizeX = parseFloat(parent.dataset.sizeX);
      const sizeY = parseFloat(parent.dataset.sizeY);

      const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, DEFAULTS.segments);
      const parentY = normalizeAngle(parentRot.rotateY);
      const globalY = normalizeAngle(rotation.y);
      let rotY = -(parentY + globalY) % 360;
      if (rotY < -180) rotY += 360;
      const rotX = -parentRot.rotateX - rotation.x;

      parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
      parent.style.setProperty('--rot-x-delta', `${rotX}deg`);

      const refDiv = document.createElement('div');
      refDiv.className = 'item__image item__image--reference';
      refDiv.style.opacity = '0';
      refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
      parent.appendChild(refDiv);

      void refDiv.offsetHeight;

      const tileR = refDiv.getBoundingClientRect();
      const mainR = main.getBoundingClientRect();
      const frameR = frame.getBoundingClientRect();

      if (!mainR || !frameR || tileR.width <= 0) {
        isOpening = false;
        focusedEl = null;
        if (refDiv.parentNode) parent.removeChild(refDiv);
        return;
      }

      originalTilePos = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
      el.style.visibility = 'hidden';

      const overlay = document.createElement('div');
      overlay.className = 'enlarge';
      overlay.style.position = 'absolute';
      overlay.style.left = (frameR.left - mainR.left) + 'px';
      overlay.style.top = (frameR.top - mainR.top) + 'px';
      overlay.style.width = frameR.width + 'px';
      overlay.style.height = frameR.height + 'px';
      overlay.style.opacity = '0';
      overlay.style.transformOrigin = 'top left';

      const img = document.createElement('img');
      img.src = parent.dataset.src;
      overlay.appendChild(img);
      viewer.appendChild(overlay);

      const tx0 = tileR.left - frameR.left;
      const ty0 = tileR.top - frameR.top;
      const sx0 = tileR.width / frameR.width;
      const sy0 = tileR.height / frameR.height;

      overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${sx0}, ${sy0})`;

      setTimeout(() => {
        overlay.style.opacity = '1';
        overlay.style.transform = 'translate(0px, 0px) scale(1, 1)';
        root.setAttribute('data-enlarging', 'true');
      }, 16);
    };

    // Close Tile
    const closeTile = () => {
      if (performance.now() - openStartedAt < 200) return;
      if (!focusedEl) return;
      const overlay = viewer.querySelector('.enlarge');
      if (!overlay) return;

      const parent = focusedEl.parentElement;
      const refDiv = parent.querySelector('.item__image--reference');
      if (refDiv) refDiv.remove();

      overlay.style.opacity = '0';
      overlay.style.transform = 'scale(0.85)';
      root.removeAttribute('data-enlarging');

      setTimeout(() => {
        overlay.remove();
        parent.style.setProperty('--rot-y-delta', '0deg');
        parent.style.setProperty('--rot-x-delta', '0deg');
        focusedEl.style.visibility = '';
        focusedEl = null;
        isOpening = false;
      }, DEFAULTS.enlargeTransitionMs);
    };

    // Click on tile handler
    mountEl.querySelectorAll('.item__image').forEach(itemEl => {
      itemEl.addEventListener('click', (e) => {
        if (isDragging || hasMoved) return;
        if (performance.now() - lastDragEndAt < 80) return;
        openTile(e.currentTarget);
      });
    });

    scrim.addEventListener('click', closeTile);
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeTile();
    });

    // Auto slow continuous ambient spin when idle
    let idleTimer = null;
    let isIdle = true;
    const startAmbient = () => {
      if (!isIdle || isDragging || focusedEl) return;
      rotation.y = wrapAngleSigned(rotation.y + 0.08);
      applyTransform(rotation.x, rotation.y);
      requestAnimationFrame(startAmbient);
    };
    requestAnimationFrame(startAmbient);

    main.addEventListener('pointerdown', () => {
      isIdle = false;
      clearTimeout(idleTimer);
    });
    main.addEventListener('pointerup', () => {
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
