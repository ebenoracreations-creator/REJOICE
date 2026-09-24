/**
 * Rejoice Events & Floral Studio — Interactive Checklist Engine
 * Handles real-time selection, count updates, link sharing, and WhatsApp message compilation.
 */

(function () {
  'use strict';

  // Elements
  const items = document.querySelectorAll('.chk-item');
  const countBadge = document.getElementById('selectedCount');
  const totalCountEl = document.getElementById('totalCount');
  const toast = document.getElementById('chkToast');

  // Set total count
  if (totalCountEl) {
    totalCountEl.textContent = items.length;
  }

  // Update selected counter
  function updateCount() {
    const checked = document.querySelectorAll('.chk-item.checked');
    if (countBadge) {
      countBadge.textContent = checked.length;
    }
  }

  // Toggle item selection
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      // Prevent double trigger if clicking directly on input
      if (e.target.tagName !== 'INPUT') {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
        }
      }
      const cb = item.querySelector('input[type="checkbox"]');
      if (cb && cb.checked) {
        item.classList.add('checked');
      } else {
        item.classList.remove('checked');
      }
      updateCount();
    });
  });

  // Select all items
  window.selectAllItems = function () {
    items.forEach(item => {
      const cb = item.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = true;
      item.classList.add('checked');
    });
    updateCount();
  };

  // Clear all selections
  window.clearAllItems = function () {
    items.forEach(item => {
      const cb = item.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = false;
      item.classList.remove('checked');
    });
    updateCount();
  };

  // Share Page Link
  window.shareChecklistPage = function () {
    const url = window.location.href;
    const title = document.title;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: 'Custom Event Checklist by Rejoice Events & Floral Studio:',
        url: url
      }).catch(() => {});
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard! Share with family.');
      }).catch(() => {
        showToast('Link copied!');
      });
    }
  };

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Compile & Send to WhatsApp
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
          const itemTitle = ci.querySelector('.chk-item-title')?.textContent.trim();
          if (itemTitle) {
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

  // Initial count
  updateCount();

})();
