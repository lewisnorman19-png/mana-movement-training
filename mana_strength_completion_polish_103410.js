
/* MANA MOVEMENT — COMPLETION + PROGRESS POLISH, BUILD 103440
   Full replacement: mana_strength_completion_polish_103410.js
   Keep the existing 103430 finisher file. */
(() => {
  'use strict';
  if (window.MANA_COMPLETION_PROGRESS_103440) return;
  window.MANA_COMPLETION_PROGRESS_103440 = true;

  const LOG = 'mana-strength-v64-logs';
  const BLUE = '#368FD4';
  const GOLD = '#D6A437';
  const $ = id => document.getElementById(id);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function logs() {
    try {
      const list = JSON.parse(localStorage.getItem(LOG) || '[]');
      return Array.isArray(list) ? list : [];
    } catch (_) { return []; }
  }

  function style() {
    if ($('mf440Styles')) return;
    const el = document.createElement('style');
    el.id = 'mf440Styles';
    el.textContent = `
      /* Hide the old standalone Cardio/Core Progress block. */
      #manaV993StrengthProgress #mf430Progress,
      #manaV993StrengthProgress #mf400Progress { display:none !important; }

      /* Existing click handler remains unchanged. This corrects even labels
         overwritten by another script after the screen opens. */
      #manaV915Complete #manaV915Back { font-size:0 !important; }
      #manaV915Complete #manaV915Back::after {
        content:'BACK TO WORKOUTS →' !important;
        display:inline-block !important;
        font-size:14px !important;
        font-weight:900 !important;
        letter-spacing:.35px !important;
      }

      #manaV915Complete .mf440-summary {
        margin:18px 0 28px; padding:18px;
        border:1px solid #343b45; border-radius:16px;
        background:#101113; color:#fff;
      }
      #manaV915Complete .mf440-title {
        font-size:14px; font-weight:900; margin:0 0 15px;
      }
      #manaV915Complete .mf440-grid {
        display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px;
      }
      #manaV915Complete .mf440-card {
        min-width:0; padding:15px 12px; border-radius:12px;
        border:1.5px solid var(--accent); background:var(--tint);
      }
      #manaV915Complete .mf440-card-title { color:var(--accent); font-size:13px; font-weight:900; }
      #manaV915Complete .mf440-value { color:#fff; font-size:16px; font-weight:900; margin-top:12px; overflow-wrap:anywhere; }
      #manaV915Complete .mf440-detail { color:#aeb9c5; font-size:11px; line-height:1.5; margin-top:5px; overflow-wrap:anywhere; }
      #manaV915Complete .mf440-done { color:#79e3a6; font-size:11px; font-weight:900; margin-top:11px; }

      /* These are regular existing Progress tiles, not a separate panel. */
      #manaV993StrengthProgress .mana-v993-metric.mf440-cardio,
      #manaV993StrengthProgress .mana-v993-metric.mf440-core {
        border-color:var(--accent) !important;
        background:color-mix(in srgb,var(--accent) 8%,#0b0b0b) !important;
      }
      #manaV993StrengthProgress .mf440-cardio .mana-v993-metric-label,
      #manaV993StrengthProgress .mf440-cardio .mana-v993-metric-value { color:${BLUE} !important; }
      #manaV993StrengthProgress .mf440-core .mana-v993-metric-label,
      #manaV993StrengthProgress .mf440-core .mana-v993-metric-value { color:${GOLD} !important; }
      #manaV993StrengthProgress .mf440-cardio .mana-v993-fill { background:${BLUE} !important; }
      #manaV993StrengthProgress .mf440-core .mana-v993-fill { background:${GOLD} !important; }
      @media(max-width:420px) {
        #manaV915Complete .mf440-grid {gap:9px;}
        #manaV915Complete .mf440-card {padding:12px 10px;}
      }
    `;
    document.head.appendChild(el);
  }

  function finisherCard(type, data) {
    const cardio = type === 'cardio';
    const accent = cardio ? BLUE : GOLD;
    const tint = cardio ? 'rgba(54,143,212,.09)' : 'rgba(214,164,55,.09)';
    let value = 'Not added';
    let detail = 'Optional finisher';
    if (data?.completed) {
      if (cardio) {
        const mins = Number(data.actualMinutes ?? data.durationMinutes ?? 0);
        value = mins > 0 ? `${mins} minutes logged` : 'Completed';
        detail = escape(data.equipment || 'Cardio');
      } else {
        value = `${Number(data.rounds || 3)} rounds`;
        detail = Array.isArray(data.exercises)
          ? data.exercises.map(x => escape(x.name)).join(', ') : 'Core completed';
      }
    }
    return `<div class="mf440-card" style="--accent:${accent};--tint:${tint}">
      <div class="mf440-card-title">${cardio ? '♥ CARDIO' : '◎ CORE'}</div>
      <div class="mf440-value">${value}</div>
      <div class="mf440-detail">${detail}</div>
      ${data?.completed ? '<div class="mf440-done">✓ COMPLETED</div>' : ''}
    </div>`;
  }

  function polishCompletion() {
    const screen = $('manaV915Complete');
    const content = $('manaV915Content');
    const back = $('manaV915Back');
    if (!screen?.classList.contains('open') || !content || !back || !content.contains(back)) return;
    back.setAttribute('aria-label','Back to Workouts');
    if (back.textContent.trim() !== 'BACK TO WORKOUTS →') back.textContent = 'BACK TO WORKOUTS →';
    const log = logs().at(-1);
    if (!log) return;

    // Retire both older completion summary versions.
    $('mf410Summary')?.remove();
    $('mf420Summary')?.remove();
    let panel = $('mf440Summary');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'mf440Summary';
      panel.className = 'mf440-summary';
      back.before(panel);
    }
    const html = `<h3 class="mf440-title">FINISHER SUMMARY</h3>
      <div class="mf440-grid">
        ${finisherCard('cardio',log.finishers?.cardio)}
        ${finisherCard('core',log.finishers?.core)}
      </div>`;
    if (panel.innerHTML !== html) panel.innerHTML = html;
  }

  function periodRange() {
    const selected = document.querySelector('#manaV993StrengthProgress .mana-v993-period.active');
    const period = (selected?.dataset.v993Period || 'daily').toLowerCase();
    const now = new Date();
    let from;
    if (period.includes('month')) {
      from = new Date(now.getFullYear(),now.getMonth(),1);
    } else if (period.includes('week')) {
      const mondayOffset = (now.getDay()+6)%7;
      from = new Date(now.getFullYear(),now.getMonth(),now.getDate()-mondayOffset);
    } else {
      from = new Date(now.getFullYear(),now.getMonth(),now.getDate());
    }
    return {from,now,period};
  }

  function totals() {
    const {from,now} = periodRange();
    let cardio = 0, core = 0;
    for (const log of logs()) {
      const date = new Date(log.date);
      if (!Number.isFinite(date.getTime()) || date < from || date > now) continue;
      if (log.finishers?.cardio?.completed) {
        const n = Number(log.finishers.cardio.actualMinutes ?? log.finishers.cardio.durationMinutes ?? 0);
        if (Number.isFinite(n) && n > 0) cardio += n;
      }
      if (log.finishers?.core?.completed) core += 1;
    }
    return {cardio,core};
  }

  function metric(type, amount, target) {
    const cardio = type === 'cardio';
    const accent = cardio ? BLUE : GOLD;
    const pct = Math.min(100,Math.round(amount/target*100));
    const sub = cardio ? `${amount} / ${target} min` : `${amount} / ${target} sessions`;
    return `<div class="mana-v993-metric mf440-${type}" style="--accent:${accent}" data-mf440="${type}">
      <div class="mana-v993-metric-label">${cardio ? '♥ CARDIO' : '◎ CORE'}</div>
      <div class="mana-v993-metric-value">${pct}%</div>
      <div class="mana-v993-metric-sub">${sub}</div>
      <div class="mana-v993-track"><div class="mana-v993-fill" style="width:${pct}%"></div></div>
    </div>`;
  }

  function polishProgress() {
    const root = $('manaV993StrengthProgress');
    const grid = root?.querySelector('.mana-v993-metrics');
    if (!grid) return;
    const title = $('manaV83Title')?.textContent?.trim().toUpperCase();
    if (title !== 'MANA STRENGTH') return;
    const {period} = periodRange();
    const {cardio,core} = totals();
    const targets = period.includes('month') ? [180,12] : period.includes('week') ? [45,3] : [15,1];

    // Standard order: Workouts, Cardio, Core, Protein, Calories, Rest.
    const workout = [...grid.children].find(x =>
      x.querySelector('.mana-v993-metric-label')?.textContent?.trim().toUpperCase() === 'WORKOUTS'
    );
    if (!workout) return;
    for (const [type,amount,target] of [['cardio',cardio,targets[0]],['core',core,targets[1]]]) {
      let tile = grid.querySelector(`[data-mf440="${type}"]`);
      const html = metric(type,amount,target);
      if (!tile) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        tile = temp.firstElementChild;
        if (type === 'cardio') workout.after(tile);
        else (grid.querySelector('[data-mf440="cardio"]') || workout).after(tile);
      } else {
        const fresh = document.createElement('div');
        fresh.innerHTML = html;
        if (tile.outerHTML !== fresh.firstElementChild.outerHTML) tile.replaceWith(fresh.firstElementChild);
      }
    }
  }

  let queued = false;
  function refresh() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      polishCompletion();
      polishProgress();
    });
  }

  function init() {
    style();
    // Covers the existing app re-rendering both screens.
    const complete = $('manaV915Complete');
    if (complete) new MutationObserver(refresh).observe(complete,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    const area = $('manaV83Content');
    if (area) new MutationObserver(refresh).observe(area,{childList:true,subtree:true});
    window.addEventListener('mana:finishers-saved',refresh);
    window.addEventListener('mana:strength-synced',refresh);
    document.addEventListener('click',event => {
      if (event.target instanceof Element && event.target.closest('[data-v993-period],#manaV83Tabs')) refresh();
    });
    refresh();
    console.log('Mana completion and Progress polish 103440 ready');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
