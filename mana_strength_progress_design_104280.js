
/* ==========================================================
   MANA MOVEMENT — STRENGTH PROGRESS DESIGN 104280
   COMPLETE STANDALONE JAVASCRIPT FILE

   Premium visual design for the existing Strength Progress screen.
   Includes runner header, Overview action, period selectors,
   summary boxes, detail panels and bottom navigation.

   Does NOT modify calculation, logs, saved data, tab handlers,
   history, exercise selection, Fuel or workout tracking.
   Adds a read-only, persistent body-weight history graph.
   ========================================================== */
(() => {
  "use strict";

  if (window.MANA_STRENGTH_PROGRESS_DESIGN_104280) return;
  window.MANA_STRENGTH_PROGRESS_DESIGN_104280 = true;

  const SHELL = "manaV83ProgramShell";
  const CONTENT = "manaV83Content";
  const ROOT = "manaV993StrengthProgress";
  const HEADER = "manaStrengthProgressHeader104280";
  const OVERVIEW = "manaStrengthProgressOverview104280";
  const STYLE = "mana-strength-progress-design-104280";

  function isProgressOpen() {
    const shell = document.getElementById(SHELL);
    return Boolean(
      shell?.classList.contains("open") &&
      document.getElementById("manaV83Title")?.textContent
        ?.trim().toUpperCase() === "MANA STRENGTH" &&
      shell.querySelector(
        '#manaV83Tabs .mana-v83-tab.active[data-v83-tab="progress"]'
      ) &&
      shell.querySelector("#" + CONTENT + " #" + ROOT)
    );
  }

  function installStyle() {
    if (document.getElementById(STYLE)) return;

    const el = document.createElement("style");
    el.id = STYLE;

    el.textContent = `
      /* Strength Progress only. */
      html body #${SHELL}.open:has(#${ROOT}) {
        background:#08090B!important;
        color:#FFFFFF!important;
      }

      html body #${SHELL}:has(#${ROOT}) .mana-v83-shell {
        width:min(100%,960px)!important;
        max-width:960px!important;
      }

      html body #${SHELL}:has(#${ROOT}) .mana-v83-head {
        display:none!important;
      }

      html body #${SHELL}:has(#${ROOT}) #${CONTENT} {
        width:100%!important;
        display:flex!important;
        flex-direction:column!important;
        align-items:stretch!important;
      }

      html body #${SHELL}:has(#${ROOT}) #${CONTENT} > * {
        min-width:0;
        order:0;
      }

      html body #${SHELL}:has(#${ROOT})
        #${CONTENT} > #${HEADER} {
        order:-10!important;
      }

      /* MANA MOVEMENT HEADER */
      html body #${SHELL} #${HEADER} {
        width:100%!important;
        margin:0 0 13px!important;
      }

      html body #${SHELL} #${HEADER} .msp-brand {
        display:flex!important;
        align-items:center!important;
        gap:12px!important;
        min-width:0;
      }

      html body #${SHELL} #${HEADER} .msp-runner {
        flex:0 0 76px!important;
        width:76px!important;
        height:56px!important;
        background:transparent url("ui/mana-runner-logo.png")
          center/contain no-repeat!important;
      }

      html body #${SHELL} #${HEADER} .msp-name {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:900 clamp(34px,5.2vw,53px)/1.05
          system-ui,sans-serif!important;
        letter-spacing:.015em!important;
        white-space:nowrap!important;
      }

      html body #${SHELL} #${HEADER} .msp-name span {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      html body #${SHELL} #${HEADER} .msp-tag {
        margin:4px 0 0!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font:750 10px/1.25 system-ui,sans-serif!important;
        letter-spacing:.12em!important;
      }

      html body #${SHELL} #${HEADER} .msp-overview-row {
        display:flex!important;
        justify-content:flex-end!important;
        margin:4px 0 10px!important;
      }

      html body #${SHELL} #${OVERVIEW} {
        min-height:34px!important;
        padding:6px 14px!important;
        border:1px solid #697686!important;
        border-radius:11px!important;
        background:#15171B!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:850 12px/1.2 system-ui,sans-serif!important;
        cursor:pointer!important;
      }

      html body #${SHELL} #${OVERVIEW}:focus-visible {
        outline:2px solid #FF7927!important;
        outline-offset:3px!important;
      }

      /* ORIGINAL PROGRESS CONTENT */
      html body #${SHELL} #${ROOT} {
        width:100%!important;
        max-width:100%!important;
        margin:0 auto!important;
        padding:4px 0 36px!important;
        color:#FFFFFF!important;
      }

      html body #${SHELL} #${ROOT} .mana-v993-kicker,
      html body #${SHELL} #${ROOT} .mana-v993-panel-kicker {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      html body #${SHELL} #${ROOT} .mana-v993-head h2,
      html body #${SHELL} #${ROOT} .mana-v993-panel h3,
      html body #${SHELL} #${ROOT} .mana-v993-row-title {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      html body #${SHELL} #${ROOT} .mana-v993-head p,
      html body #${SHELL} #${ROOT} .mana-v993-metric-sub,
      html body #${SHELL} #${ROOT} .mana-v993-row-sub,
      html body #${SHELL} #${ROOT} .mana-v993-empty {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      /* DAILY / WEEKLY / MONTHLY */
      html body #${SHELL} #${ROOT} .mana-v993-periods {
        padding:5px!important;
        background:#101216!important;
        border:1px solid #697686!important;
        border-radius:14px!important;
      }

      html body #${SHELL} #${ROOT} .mana-v993-period {
        background:transparent!important;
        border:1px solid transparent!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        box-shadow:none!important;
      }

      html body #${SHELL} #${ROOT} .mana-v993-period.active {
        background:#20160F!important;
        border:1px solid #FF7927!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        box-shadow:none!important;
      }

      /* ALL SEVEN METRICS: SILVER / ORANGE */
      html body #${SHELL} #${ROOT} .mana-v993-metric,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-metric,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-metric.water,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-metric.recovery,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-metric.mf450-cardio,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-metric.mf450-core {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        border-color:#A5ADB7!important;
        border-radius:16px!important;
        box-shadow:none!important;
      }

      html body #${SHELL} #${ROOT} .mana-v993-metric-label {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      html body #${SHELL} #${ROOT} .mana-v993-metric-value,
      html body #${SHELL} #${ROOT} .mana-v993-row-value,
      html body #${SHELL} #${ROOT} .mana-v993-summary strong,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-metric-value,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-metric-value *,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .water .mana-v993-metric-value,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .recovery .mana-v993-metric-value {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        text-shadow:none!important;
      }

      html body #${SHELL} #${ROOT} .mana-v993-track,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-metric .mana-v993-track {
        background:#252B31!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-metric .mana-v993-fill,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-metric .mana-v993-fill,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-metric.water .mana-v993-fill,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-metric.recovery .mana-v993-fill,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-metric.mf450-cardio .mana-v993-fill,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-metric.mf450-core .mana-v993-fill {
        background:#FF7927!important;
        background-image:none!important;
        background-color:#FF7927!important;
        box-shadow:none!important;
      }

      /* PERSISTENT BODY-WEIGHT GRAPH */
      html body #${SHELL} #${ROOT} #manaStrengthTrend104280 {
        margin:12px 0 4px!important;
        padding:16px!important;
        border:1px solid #A5ADB7!important;
        border-radius:19px!important;
        background:#15171B!important;
        box-shadow:none!important;
      }

      html body #${SHELL} #${ROOT}
        #manaStrengthTrend104280 .msp-trend-head {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
        margin-bottom:12px;
      }

      html body #${SHELL} #${ROOT}
        #manaStrengthTrend104280 .msp-trend-title {
        color:#FFFFFF!important;
        font:900 17px/1.2 system-ui,sans-serif!important;
      }

      html body #${SHELL} #${ROOT}
        #manaStrengthTrend104280 .msp-trend-sub,
      html body #${SHELL} #${ROOT}
        #manaStrengthTrend104280 .msp-trend-empty {
        color:#C1C6CE!important;
        font:500 11px/1.5 system-ui,sans-serif!important;
      }

      html body #${SHELL} #${ROOT}
        #manaStrengthTrend104280 .msp-trend-label {
        color:#FF7927!important;
        font:850 10px/1.2 system-ui,sans-serif!important;
        letter-spacing:.08em!important;
      }

      html body #${SHELL} #${ROOT}
        #manaStrengthTrend104280 svg {
        display:block!important;
        width:100%!important;
        height:auto!important;
        max-height:220px!important;
        overflow:visible!important;
      }

      html body #${SHELL} #${ROOT}
        #manaStrengthTrend104280 .msp-trend-empty {
        min-height:90px;
        display:grid;
        place-items:center;
        border:1px dashed #697686;
        border-radius:12px;
        padding:12px;
        text-align:center;
      }

      /* DETAIL TABS */
      html body #${SHELL} #${ROOT} .mana-v993-detail-btn {
        background:#15171B!important;
        border:1px solid #697686!important;
        border-radius:14px!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        box-shadow:none!important;
      }

      html body #${SHELL} #${ROOT} .mana-v993-detail-btn.active {
        background:#20160F!important;
        border:1px solid #FF7927!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      html body #${SHELL} #${ROOT} .mana-v993-panel {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        border-radius:19px!important;
        box-shadow:none!important;
      }

      html body #${SHELL} #${ROOT} .mana-v993-summary {
        background:#0D0F13!important;
        border:1px solid #697686!important;
      }

      html body #${SHELL} #${ROOT} .mana-v993-summary span {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      html body #${SHELL} #${ROOT} .mana-v993-row {
        border-top-color:#343B43!important;
      }

      html body #${SHELL} #${ROOT} .mana-v993-exercise-select {
        background:#0D0F13!important;
        border:1px solid #697686!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      html body #${SHELL} #${ROOT} button:focus-visible,
      html body #${SHELL} #${ROOT} select:focus-visible {
        outline:2px solid #FF7927!important;
        outline-offset:2px!important;
      }

      /* BOTTOM TABS */
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs {
        background:rgba(8,9,11,.97)!important;
        border-top:1px solid #464D55!important;
        box-shadow:none!important;
      }

      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs .mana-v83-tab {
        background:transparent!important;
        border:1px solid transparent!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        box-shadow:none!important;
        opacity:1!important;
      }

      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs .mana-v83-tab.active {
        background:#20160F!important;
        border:1px solid #FF7927!important;
        border-radius:12px!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs .mana-v83-tab::before {
        background:#A5ADB7!important;
        box-shadow:none!important;
      }

      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs .mana-v83-tab.active::before {
        background:#FF7927!important;
      }

      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs .mana-v83-tab img {
        filter:grayscale(1) brightness(1.65)!important;
        opacity:.9!important;
      }

      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs .mana-v83-tab svg,
      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs .mana-v83-tab svg * {
        color:inherit!important;
        stroke:currentColor!important;
      }

      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs
        .mana-v83-tab[data-v83-tab="overview"]:not(.active),
      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs
        .mana-v83-tab[data-v83-tab="overview"]:not(.active) svg,
      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs
        .mana-v83-tab[data-v83-tab="overview"]:not(.active) svg * {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        stroke:#C1C6CE!important;
      }

      @media(max-width:650px) {
        html body #${SHELL} #${HEADER} .msp-brand {
          gap:7px!important;
        }

        html body #${SHELL} #${HEADER} .msp-runner {
          flex-basis:48px!important;
          width:48px!important;
          height:40px!important;
        }

        html body #${SHELL} #${HEADER} .msp-name {
          font-size:clamp(24px,7vw,35px)!important;
        }

        html body #${SHELL} #${HEADER} .msp-tag {
          font-size:9px!important;
        }

        html body #${SHELL} #${ROOT} .mana-v993-metric {
          padding:13px 9px!important;
        }
      }
    `;

    document.head.appendChild(el);
  }

  function ensureHeader() {
    if (!isProgressOpen()) return;

    const holder = document.getElementById(CONTENT);
    if (!holder) return;

    let header = document.getElementById(HEADER);

    if (!header || header.parentElement !== holder) {
      header = document.createElement("div");
      header.id = HEADER;
      header.innerHTML = `
        <div class="msp-brand">
          <div class="msp-runner" aria-hidden="true"></div>
          <div>
            <div class="msp-name">
              MANA <span>MOVEMENT</span>
            </div>
            <div class="msp-tag">
              TRAINING · MOVE WITH PURPOSE
            </div>
          </div>
        </div>
        <div class="msp-overview-row">
          <button id="${OVERVIEW}" type="button">
            ⌂ Overview
          </button>
        </div>
      `;

      holder.prepend(header);
    }
  }

  /* BODY-WEIGHT HISTORY GRAPH
     Reads the same saved check-ins as the existing Progress page.
     Does not write, change or remove saved data. */

  const TREND_ID = "manaStrengthTrend104280";
  const WEIGHT_KEY = "mana-strength-v947-body-weight";

  function loadWeightHistory() {
    try {
      const raw = JSON.parse(
        localStorage.getItem(WEIGHT_KEY) || "[]"
      );

      if (!Array.isArray(raw)) return [];

      return raw
        .filter(item => {
          const weight = Number(item?.weight);

          return (
            item?.date &&
            Number.isFinite(weight) &&
            weight > 0
          );
        })
        .map(item => ({
          date:String(item.date),
          weight:Number(item.weight)
        }))
        .sort((a,b) => a.date.localeCompare(b.date))
        .slice(-30);
    } catch (_) {
      return [];
    }
  }

  function trendHtml(entries) {
    if (!entries.length) {
      return `
        <div class="msp-trend-empty">
          No body-weight check-ins yet.
          Your trend will appear here once you log your weight.
        </div>
      `;
    }

    const W = 600;
    const H = 180;
    const L = 44;
    const R = 16;
    const T = 22;
    const B = 32;

    const weights = entries.map(item => item.weight);
    const low = Math.min(...weights);
    const high = Math.max(...weights);
    const delta = Math.max(high-low,1);

    const floor = low-delta*.2;
    const ceil = high+delta*.2;

    const x = i =>
      entries.length === 1
        ? (L+W-R)/2
        : L+i*(W-L-R)/(entries.length-1);

    const y = v =>
      T+(ceil-v)*(H-T-B)/(ceil-floor);

    const pts = entries
      .map((item,i) =>
        `${x(i).toFixed(1)},${y(item.weight).toFixed(1)}`
      )
      .join(" ");

    const dots = entries
      .map((item,i) => `
        <circle
          cx="${x(i).toFixed(1)}"
          cy="${y(item.weight).toFixed(1)}"
          r="3.5"
          fill="#FF7927"
        >
          <title>
            ${item.date}: ${item.weight.toFixed(1)} kg
          </title>
        </circle>
      `)
      .join("");

    const first = entries[0];
    const last = entries[entries.length-1];

    const firstLabel = first.date.slice(5);
    const lastLabel = last.date.slice(5);

    return `
      <svg
        role="img"
        aria-label="Body-weight progression chart"
        viewBox="0 0 ${W} ${H}"
        preserveAspectRatio="xMidYMid meet"
      >
        <line
          x1="${L}"
          x2="${W-R}"
          y1="${H-B}"
          y2="${H-B}"
          stroke="#697686"
          stroke-width="1"
        />
        <line
          x1="${L}"
          x2="${W-R}"
          y1="${T}"
          y2="${T}"
          stroke="#343B43"
          stroke-dasharray="4 5"
        />
        <polyline
          fill="none"
          stroke="#FF7927"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          points="${pts}"
        />
        ${dots}
        <g
          font-family="system-ui,sans-serif"
          font-size="11"
          fill="#C1C6CE"
        >
          <text x="5" y="${T+4}">
            ${ceil.toFixed(1)}
          </text>
          <text x="5" y="${H-B+4}">
            ${floor.toFixed(1)}
          </text>
          <text x="${L}" y="${H-8}">
            ${firstLabel}
          </text>
          <text
            x="${W-R}"
            y="${H-8}"
            text-anchor="end"
          >
            ${lastLabel}
          </text>
        </g>
      </svg>
    `;
  }

  function ensureTrend() {
    if (!isProgressOpen()) return;

    const root = document.getElementById(ROOT);
    if (!root) return;

    let trend = document.getElementById(TREND_ID);

    if (!trend || !root.contains(trend)) {
      trend = document.createElement("section");
      trend.id = TREND_ID;
      trend.setAttribute(
        "aria-label",
        "Body-weight history graph"
      );

      const details = root.querySelector(
        ".mana-v993-detail-nav"
      );

      if (details) {
        details.before(trend);
      } else {
        root.appendChild(trend);
      }
    }

    const entries = loadWeightHistory();

    const state = entries
      .map(item => `${item.date}:${item.weight}`)
      .join("|");

    if (trend.dataset.mspHistory === state) return;

    trend.dataset.mspHistory = state;

    trend.innerHTML = `
      <div class="msp-trend-head">
        <div>
          <div class="msp-trend-label">
            HISTORY
          </div>
          <div class="msp-trend-title">
            Body-weight trend
          </div>
          <div class="msp-trend-sub">
            Your recorded weigh-ins, most recent 30
          </div>
        </div>
      </div>
      ${trendHtml(entries)}
    `;
  }

  function maintainProgressView() {
    if (!isProgressOpen()) return;

    ensureHeader();
    ensureTrend();
  }

  function init() {
    installStyle();

    const holder = document.getElementById(CONTENT);

    if (holder) {
      const observer = new MutationObserver(() => {
        maintainProgressView();
      });

      observer.observe(holder,{
        childList:true
      });
    }

    document.addEventListener("click",event => {
      if (!(event.target instanceof Element)) return;

      if (event.target.closest("#" + OVERVIEW)) {
        document.querySelector(
          '#manaV83Tabs [data-v83-tab="overview"]'
        )?.click();

      } else if (
        event.target.closest(
          "#manaV83Tabs .mana-v83-tab"
        )
      ) {
        requestAnimationFrame(maintainProgressView);
      }
    });

    window.addEventListener(
      "mana:body-weight-updated",
      maintainProgressView
    );

    window.addEventListener(
      "mana:profile-synced",
      maintainProgressView
    );

    window.addEventListener("storage",event => {
      if (event.key === WEIGHT_KEY) {
        maintainProgressView();
      }
    });

    maintainProgressView();

    window.MANA_STRENGTH_PROGRESS_DESIGN_BUILD = "104280";
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );
  } else {
    init();
  }
})();
