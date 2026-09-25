/**
 * Rejoice Events & Floral Studio — Interactive & Editable Checklist Engine
 * Handles real-time selection, inline editing, custom item addition, count updates, and WhatsApp message compilation.
 */

(function () {
  'use strict';

  // Elements
  const countBadge = document.getElementById('selectedCount');
  const totalCountEl = document.getElementById('totalCount');
  const toast = document.getElementById('chkToast');

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Update selected counter & total items
  function updateCount() {
    const allItems = document.querySelectorAll('.chk-item');
    const checked = document.querySelectorAll('.chk-item.checked');
    if (countBadge) {
      countBadge.textContent = checked.length;
    }
    if (totalCountEl) {
      totalCountEl.textContent = allItems.length;
    }
  }

  // 1. Bulletproof Click & Selection via native CHANGE event
  document.addEventListener('change', function (e) {
    if (e.target && e.target.matches('.chk-item input[type="checkbox"]')) {
      const item = e.target.closest('.chk-item');
      if (item) {
        if (e.target.checked) {
          item.classList.add('checked');
        } else {
          item.classList.remove('checked');
        }
        updateCount();
      }
    }
  });

  // 2. Decorate existing checklist items with edit capability
  function decorateItems() {
    const items = document.querySelectorAll('.chk-item');
    items.forEach(item => {
      const titleEl = item.querySelector('.chk-item-title');
      if (titleEl && !item.querySelector('.btn-item-edit')) {
        let header = item.querySelector('.chk-item-header');
        if (!header) {
          header = document.createElement('div');
          header.className = 'chk-item-header';
          titleEl.parentNode.insertBefore(header, titleEl);
          header.appendChild(titleEl);
        }
        let actions = header.querySelector('.chk-item-actions');
        if (!actions) {
          actions = document.createElement('div');
          actions.className = 'chk-item-actions';
          header.appendChild(actions);
        }
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'btn-item-action btn-item-edit';
        editBtn.title = 'Edit / customize this service';
        editBtn.setAttribute('aria-label', 'Edit service');
        editBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        `;
        actions.appendChild(editBtn);
      }
    });
  }

  // 3. Inject "+ Add Custom Item" row into every category
  function injectCategoryAdders() {
    const categories = document.querySelectorAll('.chk-category');
    categories.forEach(cat => {
      if (!cat.querySelector('.chk-add-category-row')) {
        const addRow = document.createElement('div');
        addRow.className = 'chk-add-category-row';
        addRow.innerHTML = `
          <button type="button" class="btn-open-add-item">
            <span style="font-size: 14px;">➕</span> Add custom item to this section
          </button>
          <div class="chk-add-box">
            <div class="chk-add-box-inner">
              <input type="text" class="chk-add-input" placeholder="Type custom service requirement (e.g. Special Candle Aisle, LED Screen...)" />
              <button type="button" class="btn-add-submit">Add Item</button>
              <button type="button" class="btn-add-cancel">Cancel</button>
            </div>
          </div>
        `;
        cat.appendChild(addRow);
      }
    });
  }

  // 4. Open Inline Edit on an Item
  function openInlineEdit(item) {
    if (item.querySelector('.chk-inline-edit')) return;

    const content = item.querySelector('.chk-content');
    const titleEl = item.querySelector('.chk-item-title');
    if (!content || !titleEl) return;

    // Get current clean title without badges
    const clone = titleEl.cloneNode(true);
    clone.querySelectorAll('.chk-custom-badge, .chk-badge-critical, button').forEach(el => el.remove());
    const currentTitle = clone.textContent.trim();

    const editBox = document.createElement('div');
    editBox.className = 'chk-inline-edit';
    editBox.innerHTML = `
      <input type="text" class="chk-edit-input" value="${escapeHtml(currentTitle)}" placeholder="Edit service details..." />
      <div class="chk-edit-btn-group">
        <button type="button" class="btn-edit-save">Save Edit</button>
        <button type="button" class="btn-edit-cancel">Cancel</button>
      </div>
    `;

    // Stop click events inside editBox from toggling the checkbox label
    editBox.addEventListener('click', (ev) => ev.stopPropagation());

    const saveBtn = editBox.querySelector('.btn-edit-save');
    const cancelBtn = editBox.querySelector('.btn-edit-cancel');
    const input = editBox.querySelector('.chk-edit-input');

    function save() {
      const val = input.value.trim();
      if (val) {
        const hasCritical = !!item.querySelector('.chk-badge-critical');
        titleEl.innerHTML = escapeHtml(val) +
          (hasCritical ? ' <span class="chk-badge-critical">Critical</span>' : '') +
          ' <span class="chk-custom-badge edited">Customized</span>';

        // Auto-check item if customized
        const cb = item.querySelector('input[type="checkbox"]');
        if (cb && !cb.checked) {
          cb.checked = true;
          item.classList.add('checked');
        }
        updateCount();
      }
      editBox.remove();
    }

    function cancel() {
      editBox.remove();
    }

    saveBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      save();
    });

    cancelBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      cancel();
    });

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        save();
      } else if (ev.key === 'Escape') {
        ev.preventDefault();
        cancel();
      }
    });

    content.appendChild(editBox);
    input.focus();
    input.select();
  }

  // 5. Submit new custom item to category
  function submitNewItem(row) {
    const cat = row.closest('.chk-category');
    const grid = cat.querySelector('.chk-grid');
    const input = row.querySelector('.chk-add-input');
    const val = input.value.trim();
    if (!val) {
      input.focus();
      return;
    }

    const newItem = document.createElement('label');
    newItem.className = 'chk-item checked is-custom-item';
    newItem.innerHTML = `
      <input type="checkbox" checked />
      <div class="chk-box"><svg class="chk-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div class="chk-content">
        <div class="chk-item-header">
          <div class="chk-item-title">${escapeHtml(val)} <span class="chk-custom-badge">Custom</span></div>
          <div class="chk-item-actions">
            <button type="button" class="btn-item-action btn-item-edit" title="Edit this item" aria-label="Edit item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button type="button" class="btn-item-action btn-item-delete" title="Delete custom item" aria-label="Delete item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
        <div class="chk-item-desc">Custom requested requirement</div>
      </div>
    `;

    grid.appendChild(newItem);
    input.value = '';
    const box = row.querySelector('.chk-add-box');
    const openAddBtn = row.querySelector('.btn-open-add-item');
    box.classList.remove('active');
    openAddBtn.style.display = 'inline-flex';

    updateCount();
  }

  // 6. Global delegated click handler
  document.addEventListener('click', function (e) {
    // Edit item button
    const editBtn = e.target.closest('.btn-item-edit');
    if (editBtn) {
      e.preventDefault();
      e.stopPropagation();
      const item = editBtn.closest('.chk-item');
      if (item) openInlineEdit(item);
      return;
    }

    // Delete custom item button
    const delBtn = e.target.closest('.btn-item-delete');
    if (delBtn) {
      e.preventDefault();
      e.stopPropagation();
      const item = delBtn.closest('.chk-item');
      if (item) {
        item.remove();
        updateCount();
      }
      return;
    }

    // Open Add Item Box
    const openAddBtn = e.target.closest('.btn-open-add-item');
    if (openAddBtn) {
      e.preventDefault();
      e.stopPropagation();
      const row = openAddBtn.closest('.chk-add-category-row');
      const box = row.querySelector('.chk-add-box');
      const input = row.querySelector('.chk-add-input');
      openAddBtn.style.display = 'none';
      box.classList.add('active');
      input.focus();
      return;
    }

    // Cancel Add Item Box
    const cancelAddBtn = e.target.closest('.btn-add-cancel');
    if (cancelAddBtn) {
      e.preventDefault();
      e.stopPropagation();
      const row = cancelAddBtn.closest('.chk-add-category-row');
      const box = row.querySelector('.chk-add-box');
      const openAddBtn = row.querySelector('.btn-open-add-item');
      box.classList.remove('active');
      openAddBtn.style.display = 'inline-flex';
      return;
    }

    // Submit Add Item
    const submitAddBtn = e.target.closest('.btn-add-submit');
    if (submitAddBtn) {
      e.preventDefault();
      e.stopPropagation();
      const row = submitAddBtn.closest('.chk-add-category-row');
      submitNewItem(row);
      return;
    }
  });

  // Enter key support for add input
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && e.target.matches('.chk-add-input')) {
      e.preventDefault();
      const row = e.target.closest('.chk-add-category-row');
      if (row) submitNewItem(row);
    }
  });

  // 7. Select All
  window.selectAllItems = function () {
    const allItems = document.querySelectorAll('.chk-item');
    allItems.forEach(item => {
      const cb = item.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = true;
      item.classList.add('checked');
    });
    updateCount();
  };

  // 8. Clear All
  window.clearAllItems = function () {
    const allItems = document.querySelectorAll('.chk-item');
    allItems.forEach(item => {
      const cb = item.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = false;
      item.classList.remove('checked');
    });
    updateCount();
  };

  // 9. Toast notification helper
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // 10. Compile & Send to WhatsApp
  window.sendChecklistToWhatsApp = function (eventType) {
    const name = document.getElementById('clientName')?.value.trim() || 'Client';
    const phone = document.getElementById('clientPhone')?.value.trim() || 'Not specified';
    const date = document.getElementById('eventDate')?.value || 'To be decided';
    const venue = document.getElementById('eventVenue')?.value.trim() || 'Not specified';
    const guests = document.getElementById('eventGuests')?.value.trim() || '';
    const notes = document.getElementById('eventNotes')?.value.trim() || '';
    const theme = document.getElementById('eventTheme')?.value.trim() || '';

    // Collect selected items grouped by category
    const categories = document.querySelectorAll('.chk-category');
    let selectedGrouped = [];
    let totalSelected = 0;

    categories.forEach(cat => {
      const catTitle = cat.querySelector('.chk-category-title')?.textContent.trim() || 'Services';
      const checkedItems = cat.querySelectorAll('.chk-item.checked');
      if (checkedItems.length > 0) {
        let catText = `\n📌 *${catTitle}:*\n`;
        checkedItems.forEach(ci => {
          const titleEl = ci.querySelector('.chk-item-title');
          let itemTitle = '';
          if (titleEl) {
            const clone = titleEl.cloneNode(true);
            clone.querySelectorAll('.chk-custom-badge, .chk-badge-critical, button').forEach(el => el.remove());
            itemTitle = clone.textContent.trim();
          }
          if (itemTitle) {
            if (ci.querySelector('.chk-badge-critical')) {
              itemTitle += ' (CRITICAL)';
            }
            if (ci.classList.contains('is-custom-item')) {
              itemTitle += ' [CUSTOM ADDED ITEM]';
            } else if (ci.querySelector('.chk-custom-badge.edited')) {
              itemTitle += ' [CUSTOMIZED SPECIFICATION]';
            }
            catText += `  ✓ ${itemTitle}\n`;
            totalSelected++;
          }
        });
        selectedGrouped.push(catText);
      }
    });

    const customExtra = document.getElementById('customExtraItems')?.value.trim() || '';

    if (totalSelected === 0 && !customExtra) {
      alert('Please select at least one service or describe what you need in the custom requirement box before submitting!');
      return;
    }

    // Build the formatted WhatsApp message
    let msg = `✨ *REJOICE EVENTS — CUSTOM CHECKLIST INQUIRY* ✨\n`;
    msg += `*Event Type:* ${eventType}\n`;
    msg += `─────────────────────────\n`;
    msg += `👤 *Client Name:* ${name}\n`;
    msg += `📞 *Phone / WhatsApp:* ${phone}\n`;
    msg += `📅 *Date of Event:* ${date}\n`;
    msg += `📍 *Venue / Location:* ${venue}\n`;
    if (guests) msg += `👥 *Approx Guests:* ${guests}\n`;
    if (theme) msg += `🎨 *Requested Theme:* ${theme}\n`;
    msg += `─────────────────────────\n`;
    if (totalSelected > 0) {
      msg += `📋 *SERVICES REQUESTED (${totalSelected} Items Selected):*\n`;
      selectedGrouped.forEach(grp => {
        msg += grp;
      });
    }

    if (customExtra) {
      msg += `\n🌟 *CUSTOM REQUIREMENT / SOMETHING MORE:*\n${customExtra}\n`;
    }

    if (notes) {
      msg += `\n💬 *Additional Notes / Requests:*\n${notes}\n`;
    }

    msg += `─────────────────────────\n`;
    msg += `Sent via Rejoice Events Interactive Checklist`;

    const encoded = encodeURIComponent(msg);
    const waUrl = `https://wa.me/919961402646?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    decorateItems();
    injectCategoryAdders();
    updateCount();
  }

})();
