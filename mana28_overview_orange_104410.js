
/* ===============================================================
   MANA MOVEMENT — MANA28 OVERVIEW FINISH
   BUILD 104410 — COMPLETE JAVASCRIPT FILE

   Loads AFTER the existing Mana Movement scripts.
   Only enhances the MANA28 Overview; does not change Mana Strength,
   Mana Lyfe, Fuel, workout schedules, completion handlers, or storage.

   Four existing Overview tiles remain in a two-column grid.
   Adds a Mana Strength chat-bar-style orange 28-day progress display.
   Progress is read from the live Mana28 completion store, not demo data.
   =============================================================== */
(() => {
  'use strict';

  const BUILD = '104410';
  const STYLE_ID = 'mana28-overview-orange-104410-style';
  const BAR_ID = 'mana28-overview-orange-104410-progress';
  const PROGRAM_KEY = 'mana-v973-mana28-state';
  const TOTAL_DAYS = 28;

  if (window.MANA28_OVERVIEW_ORANGE_BUILD === BUILD) return;
  window.MANA28_OVERVIEW_ORANGE_BUILD = BUILD;

  const byId = id => document.getElementById(id);
  const clamp = (n, lower, upper) => Math.min(upper, Math.max(lower, n));

  function isMana28Overview() {
    const shell = byId('manaV83ProgramShell');
    const title = (byId('manaV83Title')?.textContent || '').trim().toUpperCase();
    const selected = document.querySelector('#manaV83Tabs .mana-v83-tab.active')?.dataset?.v83Tab;
    return !!(shell && shell.classList.contains('open') && /^MANA\s*28\b/.test(title) && selected === 'overview');
  }

  function progressData() {
    let state = {};
    try { state = JSON.parse(localStorage.getItem(PROGRAM_KEY) || '{}') || {}; }
    catch (_) { /* If local storage is inaccessible, show empty progress. */ }

    const raw = Array.isArray(state.completed) ? state.completed : [];
    const completedDays = [...new Set(raw.map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= TOTAL_DAYS))];
    const count = completedDays.length;
    const percentage = Math.round(count / TOTAL_DAYS * 100);
    // The display indicates the latest completed challenge day, or Day 1 before starting.
    const day = count === 0 ? 1 : Math.max(...completedDays);
    return {count, percentage, day};
  }

  function installStyles() {
    if (byId(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* Scope changes to Mana28 Overview only; leave all other tabs intact. */
      #manaV83Content .mana28-orange-overview .mana-v978-grid {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 12px !important;
      }
      #manaV83Content .mana28-orange-overview .mana-v978-launch {
        min-width: 0 !important;
        min-height: 150px !important;
        padding: 15px 12px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 9px !important;
        background: #15171a !important;
        background-image: none !important;
        border: 1px solid #4c5157 !important;
        border-radius: 17px !important;
        box-shadow: none !important;
        color: #fff !important;
        text-align: left !important;
      }
      #manaV83Content .mana28-orange-overview .mana-v978-launch::before {
        background: linear-gradient(90deg, transparent, #ff7927, transparent) !important;
      }
      #manaV83Content .mana28-orange-overview .mana-v978-icon {
        width: 43px !important;
        height: 43px !important;
        flex: 0 0 43px !important;
        border-radius: 12px !important;
        border: 1px solid #ff7927 !important;
        background: rgba(255,121,39,.12) !important;
        color: #ff9a58 !important;
        -webkit-text-fill-color: #ff9a58 !important;
      }
      #manaV83Content .mana28-orange-overview .mana-v978-copy {width: 100% !important; min-width: 0 !important;}
      #manaV83Content .mana28-orange-overview .mana-v978-label {
        color: #c1c6ce !important;
        -webkit-text-fill-color: #c1c6ce !important;
        font-size: 10px !important;
      }
      #manaV83Content .mana28-orange-overview .mana-v978-title {
        margin-top: 5px !important;
        color: #fff !important;
        -webkit-text-fill-color: #fff !important;
        font-size: clamp(16px, 4vw, 21px) !important;
        line-height: 1.16 !important;
        overflow-wrap: anywhere;
      }
      #manaV83Content .mana28-orange-overview .mana-v978-text {
        display: none !important; /* Keep the overview clean; detail remains on its tab. */
      }
      #manaV83Content .mana28-orange-overview .mana-v978-arrow {
        margin-top: 8px !important;
        color: #ff9a58 !important;
        -webkit-text-fill-color: #ff9a58 !important;
        font-size: 10px !important;
      }
      #manaV83Content .mana28-orange-overview .mana-v978-intro {
        border-color: #343a42 !important;
      }
      #manaV83Content .mana28-orange-overview .mana-v978-intro::after {
        background: #ff7927 !important;
      }
      #manaV83Content .mana28-orange-overview .mana-v978-kicker {
        color: #ff9a58 !important;
        -webkit-text-fill-color: #ff9a58 !important;
      }
      #manaV83Content .mana28-orange-overview .mana-v978-intro h2 {color: #fff !important;}
      #manaV83Content .mana28-orange-overview .mana-v978-intro p {color: #bfc5cd !important;}

      #${BAR_ID} {
        box-sizing: border-box;
        width: 100%;
        margin: 16px 0 8px;
        padding: 17px 18px;
        border-radius: 18px;
        background: #15171a;
        border: 1px solid #4c5157;
        box-shadow: 0 10px 24px rgba(0,0,0,.15);
        color: #fff;
      }
      #${BAR_ID} .mana28-progress-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 14px;
      }
      #${BAR_ID} .mana28-progress-eyebrow {
        display: block;
        font-size: 11px;
        font-weight: 850;
        letter-spacing: .11em;
        color: #c1c6ce;
      }
      #${BAR_ID} .mana28-progress-day {
        display: block;
        margin-top: 5px;
        font-size: 19px;
        line-height: 1.2;
        font-weight: 850;
      }
      #${BAR_ID} .mana28-progress-percent {
        color: #ff892f;
        font-size: 26px;
        font-weight: 900;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }
      #${BAR_ID} .mana28-progress-track {
        height: 10px;
        width: 100%;
        margin-top: 16px;
        border-radius: 999px;
        background: #383c42;
        overflow: hidden;
      }
      #${BAR_ID} .mana28-progress-fill {
        height: 100%;
        width: 0%;
        border-radius: inherit;
        background: linear-gradient(90deg, #f46a20, #ff9a45);
        transition: width .24s ease-out;
      }
      #${BAR_ID} .mana28-progress-foot {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
        font-size: 11px;
        color: #c1c6ce;
      }
      @media (max-width: 430px) {
        #manaV83Content .mana28-orange-overview .mana-v978-grid {gap: 9px !important;}
        #manaV83Content .mana28-orange-overview .mana-v978-launch {
          min-height: 131px !important;
          padding: 12px 10px !important;
        }
        #manaV83Content .mana28-orange-overview .mana-v978-icon {
          width: 38px !important;
          height: 38px !important;
          flex-basis: 38px !important;
        }
        #${BAR_ID} {padding: 15px;}
        #${BAR_ID} .mana28-progress-day {font-size: 17px;}
      }
      @media (prefers-reduced-motion: reduce) {
        #${BAR_ID} .mana28-progress-fill {transition: none;}
      }
    `;
    document.head.appendChild(style);
  }

  function createProgressCard() {
    const section = document.createElement('section');
    section.id = BAR_ID;
    section.setAttribute('aria-label','Mana28 challenge completion');
    section.innerHTML = `
      <div class="mana28-progress-top">
        <div>
          <span class="mana28-progress-eyebrow">YOUR 28-DAY PROGRESS</span>
          <strong class="mana28-progress-day" data-m28-day>Day 1 of 28</strong>
        </div>
        <strong class="mana28-progress-percent" data-m28-pct>0%</strong>
      </div>
      <div class="mana28-progress-track" role="progressbar" aria-label="Completed Mana28 program days" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
        <div class="mana28-progress-fill" data-m28-fill></div>
      </div>
      <div class="mana28-progress-foot">
        <span data-m28-count>0 of 28 days completed</span>
        <span>MOVE WITH PURPOSE</span>
      </div>
    `;
    return section;
  }

  function updateProgress(card) {
    const {count, percentage, day} = progressData();
    const setText = (selector, value) => {
      const element = card.querySelector(selector);
      if (element && element.textContent !== value) element.textContent = value;
    };
    setText('[data-m28-day]', `Day ${day} of 28`);
    setText('[data-m28-pct]', `${percentage}%`);
    setText('[data-m28-count]', `${count} of 28 days completed`);
    const bar = card.querySelector('[role="progressbar"]');
    if (bar && bar.getAttribute('aria-valuenow') !== String(percentage)) bar.setAttribute('aria-valuenow', String(percentage));
    const fill = card.querySelector('[data-m28-fill]');
    if (fill && fill.style.width !== `${percentage}%`) fill.style.width = `${percentage}%`;
  }

  function refresh() {
    if (!isMana28Overview()) return;
    const holder = byId('manaV83Content');
    const launchpad = holder?.querySelector('.mana-v978-launchpad');
    const grid = launchpad?.querySelector('.mana-v978-grid');
    if (!launchpad || !grid) return;
    launchpad.classList.add('mana28-orange-overview');
    // Reuse the existing four tiles and their original navigation listeners.
    let card = launchpad.querySelector(`#${BAR_ID}`);
    if (!card) {
      card = createProgressCard();
      grid.insertAdjacentElement('afterend', card);
    }
    updateProgress(card);
  }

  let refreshTimer = null;
  function refreshSoon() {
    if (refreshTimer !== null) return;
    refreshTimer = setTimeout(() => { refreshTimer = null; refresh(); }, 90);
  }

  function init() {
    installStyles();
    refreshSoon();
    const holder = byId('manaV83Content');
    if (holder && window.MutationObserver) {
      // Only child insertion/replacement: do not observe our own text or style updates.
      const observer = new MutationObserver(refreshSoon);
      observer.observe(holder, {childList:true, subtree:true});
    }
    document.addEventListener('click', event => {
      if (event.target.closest('#manaV83Tabs, #manaV80Mana28, #manaV83Content')) refreshSoon();
    }, true);
    window.addEventListener('storage', event => {
      if (event.key === PROGRAM_KEY) refreshSoon();
    });
    window.addEventListener('mana:program-tab-change', refreshSoon);
    window.MANA28_OVERVIEW_ORANGE_BUILD = BUILD;
    console.log('[Mana28 Overview] Orange progress + four-tile grid ready, build ' + BUILD);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
