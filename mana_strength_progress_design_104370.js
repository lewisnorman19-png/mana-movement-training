
/* MANA MOVEMENT — STRENGTH PROGRESS DESIGN 104370
   Complete replacement for 104360.

   Removes decorative yellow header icon.
   Hides duplicate/legacy Water cards.
   Preserves original charts and totals.

   No changes to saved data, tracking calculations or tab handlers.
*/
(() => {
  'use strict';

  if (window.MANA_STRENGTH_PROGRESS_DESIGN_104370) return;
  window.MANA_STRENGTH_PROGRESS_DESIGN_104370 = true;

  const S = 'manaV83ProgramShell';
  const C = 'manaV83Content';
  const R = 'manaV993StrengthProgress';

  const H = 'manaProgressHeader104370';
  const BACK = 'manaProgressBack104370';
  const WATER = 'manaWaterPrimary104370';
  const STYLE = 'manaProgressStyle104370';

  const FUEL = 'mana-fuel-v571';
  const TARGET = 'mana-fuel-v58-targets';

  let queued = false;

  function isOpen() {
    const shell = document.getElementById(S);

    return Boolean(
      shell?.classList.contains('open') &&
      shell.querySelector(
        '#manaV83Tabs [data-v83-tab="progress"].active'
      ) &&
      shell.querySelector('#' + C + ' #' + R)
    );
  }

  function installCSS() {
    if (document.getElementById(STYLE)) return;

    const style = document.createElement('style');
    style.id = STYLE;

    style.textContent = `
      html body #${S}:has(#${R}) .mana-v83-head {
        display:none!important;
      }

      html body #${S}:has(#${R}) .mana-v83-shell {
        width:min(960px,100%)!important;
        max-width:960px!important;
      }

      html body #${S}:has(#${R}) #${C} {
        display:flex!important;
        flex-direction:column!important;
        align-items:stretch!important;
      }

      html body #${S}:has(#${R}) #${C}>* {
        order:0;
        min-width:0;
      }

      html body #${S}:has(#${R}) #${C}>#${H} {
        order:-10!important;
      }

      /* PREMIUM HEADER */

      html body #${S} #${H} {
        width:100%;
        margin:0 0 14px;
      }

      html body #${S} #${H} .mp-brand {
        display:flex;
        align-items:center;
        gap:12px;
      }

      html body #${S} #${H} .mp-runner {
        flex:0 0 76px;
        width:76px;
        height:56px;
        background:url('ui/mana-runner-logo.png')
          center/contain no-repeat;
      }

      html body #${S} #${H} .mp-name {
        font:900 clamp(32px,5vw,53px)/1.05
          system-ui,sans-serif;
        color:#FFFFFF!important;
        white-space:nowrap;
      }

      html body #${S} #${H} .mp-name span {
        color:#FF7927!important;
      }

      html body #${S} #${H} .mp-tag {
        margin-top:4px;
        font:750 10px system-ui,sans-serif;
        letter-spacing:.12em;
        color:#C1C6CE;
      }

      html body #${S} #${H} .mp-back-row {
        display:flex;
        justify-content:flex-end;
        margin:5px 0 10px;
      }

      html body #${S} #${BACK} {
        min-height:34px;
        padding:7px 14px;
        background:#15171B;
        border:1px solid #697686;
        border-radius:11px;
        color:#FFFFFF;
        font-weight:850;
        cursor:pointer;
      }

      /* PROGRESS HEADER ICON */

      html body #${S} #${R} {
        width:100%!important;
        max-width:100%!important;
        color:#FFFFFF!important;
      }

      html body #${S} #${R} .mana-v993-head img,
      html body #${S} #${R} .mana-v993-head svg,
      html body #${S} #${R} .mana-v993-head [class*='icon'],
      html body #${S} #${R} .mana-v993-head [class*='Icon'] {
        display:none!important;
        visibility:hidden!important;
      }

      html body #${S} #${R} .mana-v993-head h2 {
        color:#FFFFFF!important;
      }

      html body #${S} #${R} .mana-v993-head p {
        color:#C1C6CE!important;
      }

      html body #${S} #${R} .mana-v993-kicker,
      html body #${S} #${R} .mana-v993-panel-kicker {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      /* DAILY / WEEKLY / MONTHLY */

      html body #${S} #${R} .mana-v993-periods {
        padding:5px!important;
        background:#101216!important;
        border:1px solid #697686!important;
      }

      html body #${S} #${R} .mana-v993-period,
      html body #${S} #${R} .mana-v993-detail-btn {
        background:#15171B!important;
        border:1px solid #697686!important;
        border-radius:12px!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        box-shadow:none!important;
      }

      html body #${S} #${R} .mana-v993-period.active,
      html body #${S} #${R} .mana-v993-detail-btn.active {
        background:#20160F!important;
        border-color:#FF7927!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      /* ALL PROGRESS METRICS */

      html body #${S} #${R}
        .mana-v993-metrics>.mana-v993-metric {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        border-radius:16px!important;
        box-shadow:none!important;
      }

      html body #${S} #${R}
        .mana-v993-metrics .mana-v993-metric-label {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      html body #${S} #${R}
        .mana-v993-metrics .mana-v993-metric-value,
      html body #${S} #${R}
        .mana-v993-metrics .mana-v993-metric-value * {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      html body #${S} #${R}
        .mana-v993-metrics .mana-v993-track {
        background:#252B31!important;
      }

      html body #${S} #${R}
        .mana-v993-metrics .mana-v993-fill,
      html body #${S} #${R}
        .mana-v993-metrics .mp-water-fill {
        background:#FF7927!important;
        background-image:none!important;
      }

      /* HIDE LEGACY WATER CARDS IMMEDIATELY */

      html body #${S} #${R}
        .mana-v993-metrics >
        .mp-water-metric:not(.mana-water-canonical-104370),
      html body #${S} #${R}
        .mana-v993-metrics >
        [class*='water']:not(.mana-water-canonical-104370) {
        display:none!important;
        visibility:hidden!important;
      }

      html body #${S} #${R}
        .mana-v993-metrics >
        .mana-water-canonical-104370 {
        display:block!important;
        visibility:visible!important;
        background:#15171B!important;
        border:1px solid #A5ADB7!important;
      }

      /* DETAIL PANELS */

      html body #${S} #${R} .mana-v993-panel {
        background:#15171B!important;
        border:1px solid #A5ADB7!important;
        border-radius:19px!important;
        box-shadow:none!important;
      }

      html body #${S} #${R} .mana-v993-panel h3 {
        color:#FFFFFF!important;
      }

      html body #${S} #${R} .mana-v993-summary {
        background:#0D0F13!important;
        border:1px solid #697686!important;
      }

      html body #${S} #${R} .mana-v993-summary strong,
      html body #${S} #${R} .mana-v993-row-value {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      html body #${S} #${R} .mana-v993-row,
      html body #${S} #${R} [class*='history-row'] {
        border-color:#697686!important;
      }

      html body #${S} #${R} .mana-v993-exercise-select {
        background:#0D0F13!important;
        border:1px solid #697686!important;
        color:#FFFFFF!important;
      }

      /* ORIGINAL PROGRESS CHARTS */

      html body #${S} #${R} .mana-chart-shell-104370 {
        background:#101216!important;
        border:1px solid #A5ADB7!important;
        box-shadow:none!important;
        border-radius:16px!important;
      }

      html body #${S} #${R} .mana-chart-title-104370 {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      html body #${S} #${R}
        .mana-chart-shell-104370 svg polyline,
      html body #${S} #${R}
        .mana-chart-shell-104370 svg
        path.mana-chart-trend-104370 {
        stroke:#FF7927!important;
      }

      html body #${S} #${R}
        .mana-chart-shell-104370 svg circle {
        fill:#FF7927!important;
        stroke:#FF7927!important;
      }

      /* BOTTOM NAVIGATION */

      html body #${S}.open:has(#${R}) #manaV83Tabs {
        background:rgba(8,9,11,.97)!important;
        border-top:1px solid #464D55!important;
        box-shadow:none!important;
      }

      html body #${S}.open:has(#${R})
        #manaV83Tabs .mana-v83-tab {
        background:transparent!important;
        border:1px solid transparent!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        box-shadow:none!important;
        text-shadow:none!important;
      }

      html body #${S}.open:has(#${R})
        #manaV83Tabs .mana-v83-tab.active {
        background:#20160F!important;
        border:1px solid #FF7927!important;
        border-radius:12px!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      html body #${S}.open:has(#${R})
        #manaV83Tabs .mana-v83-tab img {
        filter:grayscale(1) brightness(1.7)!important;
        box-shadow:none!important;
      }

      html body #${S}.open:has(#${R})
        #manaV83Tabs .mana-v83-tab::before {
        background:#A5ADB7!important;
        box-shadow:none!important;
      }

      html body #${S}.open:has(#${R})
        #manaV83Tabs .mana-v83-tab.active::before {
        background:#FF7927!important;
      }

      html body #${S}.open:has(#${R})
        #manaV83Tabs
        [data-v83-tab='overview']:not(.active),
      html body #${S}.open:has(#${R})
        #manaV83Tabs
        [data-v83-tab='overview']:not(.active) svg,
      html body #${S}.open:has(#${R})
        #manaV83Tabs
        [data-v83-tab='overview']:not(.active) svg * {
        color:#C1C6CE!important;
        stroke:#C1C6CE!important;
        filter:none!important;
      }

      @media(max-width:650px) {
        html body #${S} #${H} .mp-runner {
          flex-basis:48px;
          width:48px;
          height:40px;
        }

        html body #${S} #${H} .mp-name {
          font-size:clamp(23px,7vw,35px)!important;
        }

        html body #${S} #${H} .mp-brand {
          gap:7px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureHeader() {
    const holder = document.getElementById(C);

    if (!holder || holder.querySelector('#' + H)) return;

    const node = document.createElement('div');
    node.id = H;

    node.innerHTML = `
      <div class="mp-brand">
        <div class="mp-runner" aria-hidden="true"></div>
        <div>
          <div class="mp-name">
            MANA <span>MOVEMENT</span>
          </div>
          <div class="mp-tag">
            TRAINING · MOVE WITH PURPOSE
          </div>
        </div>
      </div>
      <div class="mp-back-row">
        <button type="button" id="${BACK}">
          ⌂ Overview
        </button>
      </div>
    `;

    holder.prepend(node);
  }

  function waterSource() {
    const d = new Date();

    const date = [
      d.getFullYear(),
      String(d.getMonth()+1).padStart(2,'0'),
      String(d.getDate()).padStart(2,'0')
    ].join('-');

    let amount = 0;
    let target = 2300;

    try {
      amount = Math.max(
        0,
        Number(
          JSON.parse(
            localStorage.getItem(FUEL) || '{}'
          )?.[date]?.water
        ) || 0
      );
    } catch (_) {}

    try {
      target = Math.max(
        1,
        Number(
          JSON.parse(
            localStorage.getItem(TARGET) || '{}'
          )?.water
        ) || 2300
      );
    } catch (_) {}

    return {amount,target};
  }

  function ensureWater() {
    const grid = document.querySelector(
      '#' + R + ' .mana-v993-metrics'
    );

    if (!grid) return;

    const cards = [...grid.children].filter(node => {
      const label = node.querySelector(
        '.mana-v993-metric-label,[class*="label"]'
      );

      return (
        (label?.textContent || '')
          .trim().toUpperCase() === 'WATER'
      ) || /^WATER\b/.test(
        (node.textContent || '').trim().toUpperCase()
      );
    });

    let card = cards.find(n => n.id === WATER) || cards[0];

    if (!card) {
      card = document.createElement('div');
      card.id = WATER;
      card.className = 'mana-v993-metric mp-water-metric';

      card.innerHTML = `
        <div class="mana-v993-metric-label">WATER</div>
        <div class="mana-v993-metric-value"></div>
        <div class="mana-v993-metric-sub"></div>
        <div class="mana-v993-track">
          <div class="mana-v993-fill mp-water-fill"></div>
        </div>
      `;

      grid.appendChild(card);
    }

    cards.forEach(node => {
      if (node !== card) node.remove();
    });

    if (card.id !== WATER) card.id = WATER;

    card.classList.add(
      'mana-v993-metric',
      'mp-water-metric',
      'mana-water-canonical-104370'
    );

    let value = card.querySelector(
      '.mana-v993-metric-value'
    );

    let sub = card.querySelector(
      '.mana-v993-metric-sub'
    );

    let fill = card.querySelector(
      '.mana-v993-fill,.mp-water-fill'
    );

    if (!value) {
      value = document.createElement('div');
      value.className = 'mana-v993-metric-value';
      card.appendChild(value);
    }

    if (!sub) {
      sub = document.createElement('div');
      sub.className = 'mana-v993-metric-sub';
      card.appendChild(sub);
    }

    if (!fill) {
      let track = card.querySelector(
        '.mana-v993-track'
      );

      if (!track) {
        track = document.createElement('div');
        track.className = 'mana-v993-track';
        card.appendChild(track);
      }

      fill = document.createElement('div');
      fill.className = 'mana-v993-fill mp-water-fill';
      track.appendChild(fill);
    }

    const {amount,target} = waterSource();

    const label = (amount/1000).toFixed(1) + ' L';
    const goal = 'Target ' + (target/1000).toFixed(1) + ' L';
    const pct = Math.min(
      100,
      Math.round(amount/target*100)
    ) + '%';

    if (value.textContent !== label) {
      value.textContent = label;
    }

    if (sub.textContent !== goal) {
      sub.textContent = goal;
    }

    if (fill.style.width !== pct) {
      fill.style.width = pct;
    }

    const imp = (el,key,val) => {
      if (
        el?.style.getPropertyValue(key) !== val ||
        el.style.getPropertyPriority(key) !== 'important'
      ) {
        el?.style.setProperty(key,val,'important');
      }
    };

    imp(card,'border','1px solid #A5ADB7');
    imp(card,'background','#15171B');
    imp(value,'color','#FF7927');
    imp(fill,'background','#FF7927');
  }

  function fixChart() {
    const detail = document.querySelector(
      '#' + R + ' #manaV993Detail'
    );

    if (!detail) return;

    detail.querySelectorAll('svg').forEach(svg => {
      if (svg.closest('.mana-v993-detail-btn')) return;

      let box = svg.parentElement;

      while (
        box &&
        box !== detail &&
        !/body weight trend|best load/i.test(
          box.textContent || ''
        )
      ) {
        box = box.parentElement;
      }

      if (!box || box === detail) return;

      const heading = [
        ...box.querySelectorAll('h2,h3,h4,strong')
      ].find(n =>
        /body weight trend|best load/i.test(
          n.textContent || ''
        )
      );

      if (heading) {
        heading.classList.add(
          'mana-chart-title-104370'
        );

        heading.style.setProperty(
          'color','#FFFFFF','important'
        );
      }

      const outer = box.closest('section,article') || box;

      if (outer !== detail) {
        outer.classList.add(
          'mana-chart-shell-104370'
        );
      }

      svg.querySelectorAll('polyline,path').forEach(path => {
        const fill = path.getAttribute('fill') ||
          getComputedStyle(path).fill;

        if (
          path.tagName.toLowerCase() === 'polyline' ||
          fill === 'none'
        ) {
          path.classList.add(
            'mana-chart-trend-104370'
          );

          if (
            path.style.getPropertyValue('stroke') !==
            '#FF7927'
          ) {
            path.style.setProperty(
              'stroke','#FF7927','important'
            );
          }
        }
      });

      svg.querySelectorAll('circle').forEach(dot => {
        if (
          dot.style.getPropertyValue('fill') !== '#FF7927'
        ) {
          dot.style.setProperty(
            'fill','#FF7927','important'
          );
        }

        if (
          dot.style.getPropertyValue('stroke') !==
          '#FF7927'
        ) {
          dot.style.setProperty(
            'stroke','#FF7927','important'
          );
        }
      });
    });
  }

  function maintain() {
    if (!isOpen()) return;

    ensureHeader();
    ensureWater();
    fixChart();
  }

  function schedule() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      maintain();
    });
  }

  function init() {
    installCSS();

    const content = document.getElementById(C);

    if (content) {
      new MutationObserver(schedule).observe(
        content,{
          childList:true,
          subtree:true
        }
      );
    }

    document.addEventListener('click', e => {
      if (!(e.target instanceof Element)) return;

      if (e.target.closest('#' + BACK)) {
        document.querySelector(
          '#manaV83Tabs [data-v83-tab="overview"]'
        )?.click();

      } else if (
        e.target.closest(
          '#manaV83Tabs .mana-v83-tab,' +
          '[data-v993-period],' +
          '[data-v993-detail],' +
          '.mana-v993-period,' +
          '.mana-v993-detail-btn'
        )
      ) {
        requestAnimationFrame(schedule);
      }
    });

    [
      'mana:program-tab-change',
      'mana:fuel-updated',
      'mana:recovery-updated',
      'mana:body-weight-updated'
    ].forEach(name =>
      window.addEventListener(name,schedule)
    );

    window.addEventListener('storage',e => {
      if ([FUEL,TARGET].includes(e.key)) {
        schedule();
      }
    });

    schedule();

    window.MANA_STRENGTH_PROGRESS_DESIGN_BUILD =
      '104370';
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init,
      {once:true}
    );
  } else {
    init();
  }
})();
