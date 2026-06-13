/*
 * Scoro Billable Checker
 *
 * Runs in the page's MAIN world so it can call Scoro's own AJAX machinery
 * (window.scoro.submitAjax) with the user's existing session. For every
 * time-entry cell on the timesheet it fetches the same modal payload that
 * opens when you click the entry, reads the hidden billable fields out of
 * the returned HTML, and paints a badge:
 *
 *   green check  - billable_time_type === 'billable'  (all hours billable)
 *   red X        - 'non_billable'
 *   orange X     - 'custom' (partially billable; tooltip shows the split)
 *
 * Read-only: it never renders or submits the modal, only parses it.
 */
(() => {
  'use strict';

  const BADGE_CLASS = 'sbc-badge';
  const MAX_CONCURRENT = 4;
  const FETCH_TIMEOUT_MS = 20000;

  const cache = new Map();    // entryId -> parsed info (or null if fetch/parse failed)
  const inFlight = new Map(); // entryId -> Promise
  const openedIds = new Set();// entries whose modal the user opened (may have been edited)
  const dirtyIds = new Set(); // entries to refetch on next scan
  const queue = [];
  let active = 0;
  let scanTimer = null;

  function fetchUrl() {
    try {
      if (typeof window.getLinkToCurrentTab === 'function') {
        return window.getLinkToCurrentTab();
      }
    } catch (e) { /* fall through */ }
    return 'tasks/timesheet/view';
  }

  function secondsToLabel(sec) {
    if (sec == null || Number.isNaN(sec)) return '?';
    const h = Math.floor(sec / 3600);
    const m = Math.round((sec % 3600) / 60);
    return m ? `${h}h ${String(m).padStart(2, '0')}min` : `${h}h`;
  }

  function parseModal(response) {
    if (!response || response.status === 'ERROR') return null;
    const html = response.data && response.data.content;
    if (!html) return null;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const typeInput = doc.querySelector('input[name="billable_time_type"]');
    if (!typeInput) return null; // not a regular time entry (e.g. time off)
    const billable = parseInt(doc.querySelector('input[name="billable_duration"]')?.value, 10);
    const selected = doc.querySelector('select[name="duration"] option[selected]');
    const duration = parseInt(selected ? selected.value : 'NaN', 10);
    return {
      type: typeInput.value,
      billable: Number.isNaN(billable) ? null : billable,
      duration: Number.isNaN(duration) ? null : duration,
    };
  }

  function requestEntry(entryId) {
    return new Promise((resolve) => {
      let settled = false;
      const done = (val) => {
        if (!settled) { settled = true; resolve(val); }
      };
      try {
        window.scoro.submitAjax(
          fetchUrl(),
          (params, response) => done(parseModal(response)),
          { act: 'popup', modalName: 'timeEntry', args: { timeEntryId: entryId } },
          undefined,
          () => done(null)
        );
      } catch (e) {
        done(null);
      }
      setTimeout(() => done(null), FETCH_TIMEOUT_MS);
    });
  }

  function enqueue(entryId) {
    if (inFlight.has(entryId)) return inFlight.get(entryId);
    const p = new Promise((resolve) => queue.push({ entryId, resolve }));
    inFlight.set(entryId, p);
    pump();
    return p;
  }

  function pump() {
    while (active < MAX_CONCURRENT && queue.length) {
      const { entryId, resolve } = queue.shift();
      active++;
      requestEntry(entryId).then((info) => {
        active--;
        cache.set(entryId, info);
        inFlight.delete(entryId);
        resolve(info);
        pump();
      });
    }
  }

  function badgeFor(info) {
    const span = document.createElement('span');
    span.className = BADGE_CLASS;
    span.style.cssText = 'margin-left:4px;font-weight:700;pointer-events:none;';
    if (!info) {
      span.textContent = '·';
      span.style.color = '#B4BCCA';
      span.title = 'Billable status unavailable';
    } else if (info.type === 'billable') {
      span.textContent = '✓';
      span.style.color = '#50B83C';
      span.title = 'All time billable';
    } else if (info.type === 'non_billable') {
      span.textContent = '✗';
      span.style.color = '#DE3618';
      span.title = 'Non-billable';
    } else {
      span.textContent = '✗';
      span.style.color = '#F49342';
      span.title = `Partially billable: ${secondsToLabel(info.billable)} of ${secondsToLabel(info.duration)}`;
    }
    return span;
  }

  async function decorate(anchor) {
    const entryId = anchor.dataset.timeEntryId;
    if (!entryId) return;
    const hasBadge = !!anchor.querySelector('.' + BADGE_CLASS);
    if (hasBadge && !dirtyIds.has(entryId)) return;

    let info;
    if (cache.has(entryId) && !dirtyIds.has(entryId)) {
      info = cache.get(entryId);
    } else {
      dirtyIds.delete(entryId);
      cache.delete(entryId);
      info = await enqueue(entryId);
    }
    anchor.querySelectorAll('.' + BADGE_CLASS).forEach((n) => n.remove());
    anchor.appendChild(badgeFor(info));
  }

  function scan() {
    document
      .querySelectorAll('a.js-open-time-entry[data-time-entry-id]')
      .forEach(decorate);
  }

  function scheduleScan() {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(scan, 250);
  }

  function isBadge(node) {
    return node.nodeType === 1 && node.classList && node.classList.contains(BADGE_CLASS);
  }

  function start() {
    document.addEventListener(
      'click',
      (e) => {
        const a = e.target.closest && e.target.closest('a.js-open-time-entry[data-time-entry-id]');
        if (a) openedIds.add(a.dataset.timeEntryId);
      },
      true
    );

    new MutationObserver((mutations) => {
      let relevant = false;
      for (const m of mutations) {
        for (const n of m.removedNodes) {
          if (n.nodeType === 1 && n.classList && n.classList.contains('modalPopup')) {
            // A modal closed; anything opened may have been edited - refetch it.
            openedIds.forEach((id) => dirtyIds.add(id));
            openedIds.clear();
            relevant = true;
          } else if (!isBadge(n) && n.nodeType === 1) {
            relevant = true;
          }
        }
        for (const n of m.addedNodes) {
          if (!isBadge(n) && n.nodeType === 1) relevant = true;
        }
      }
      if (relevant) scheduleScan();
    }).observe(document.body, { childList: true, subtree: true });

    scan();
  }

  // Wait for Scoro's globals to be ready before the first scan.
  if (window.scoro && typeof window.scoro.submitAjax === 'function') {
    start();
  } else {
    let tries = 0;
    const timer = setInterval(() => {
      if (window.scoro && typeof window.scoro.submitAjax === 'function') {
        clearInterval(timer);
        start();
      } else if (++tries > 40) {
        clearInterval(timer);
        console.warn('[Scoro Billable Checker] scoro.submitAjax never appeared; giving up.');
      }
    }, 250);
  }
})();
