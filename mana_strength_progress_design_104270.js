
/* ==========================================================
   MANA MOVEMENT — STRENGTH PROGRESS DESIGN 104270
   COMPLETE STANDALONE JAVASCRIPT FILE

   Premium visual design for the existing Strength Progress screen.
   Includes runner header, Overview action, period selectors,
   summary boxes, detail panels and bottom navigation.

   Does NOT modify calculation, logs, saved data, tab handlers,
   history, charts, exercise selection, Fuel or workout tracking.
   ========================================================== */
(() => {
  "use strict";

  if (window.MANA_STRENGTH_PROGRESS_DESIGN_104270) return;
  window.MANA_STRENGTH_PROGRESS_DESIGN_104270 = true;

  const SHELL = "manaV83ProgramShell";
  const CONTENT = "manaV83Content";
  const ROOT = "manaV993StrengthProgress";
  const HEADER = "manaStrengthProgressHeader104270";
  const OVERVIEW = "manaStrengthProgressOverview104270";
  const STYLE = "mana-strength-progress-design-104270";

  function isProgressOpen() {
    const shell = document.getElementById(SHELL);
    return Boolean(
      shell?.classList.contains("open") &&
      document.getElementById("manaV83Title")?.textContent
        ?.trim().toUpperCase() === "MANA STRENGTH" &&
      shell.querySelector('#manaV83Tabs .mana-v83-tab.active[data-v83-tab="progress"]') &&
      shell.querySelector("#" + CONTENT + " #" + ROOT)
    );
  }

  function installStyle() {
    if (document.getElementById(STYLE)) return;
    const el = document.createElement("style");
    el.id = STYLE;
    el.textContent = `
      /* Current Strength Progress only, not Mana28 / ManaLyfe. */
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
      html body #${SHELL}:has(#${ROOT}) #${CONTENT} > #${HEADER} {
        order:-10!important;
      }

      /* Match approved Overview / Workouts / Fuel runner header. */
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
        background:transparent url("ui/mana-runner-logo.png") center/contain no-repeat!important;
      }
      html body #${SHELL} #${HEADER} .msp-name {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:900 clamp(34px,5.2vw,53px)/1.05 system-ui,sans-serif!important;
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

      /* Existing progress display: no changes to data or layout logic. */
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

      /* Daily / Weekly / Monthly: orange active, silver inactive. */
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

      /* Standard Workouts / Protein / Calories / Rest boxes. */
      html body #${SHELL} #${ROOT} .mana-v993-metric {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        border-radius:16px!important;
        box-shadow:none!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-metric-label {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-metric-value,
      html body #${SHELL} #${ROOT} .mana-v993-row-value,
      html body #${SHELL} #${ROOT} .mana-v993-summary strong {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-track {
        background:#252B31!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-metric .mana-v993-fill {
        background:#FF7927!important;
        background-image:none!important;
      }
      /* Keep meaningful individual progress colours when present. */
      html body #${SHELL} #${ROOT} .mf450-cardio .mana-v993-fill {
        background:#368FD4!important;
      }
      html body #${SHELL} #${ROOT} .mf450-core .mana-v993-fill {
        background:#FF7927!important;
      }
      html body #${SHELL} #${ROOT} .water .mana-v993-fill {
        background:#42B8FF!important;
      }
      html body #${SHELL} #${ROOT} .recovery .mana-v993-fill {
        background:#A77BFF!important;
      }

      /* Detail buttons / history panels: preserve every click handler. */
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

      /* Match the established bottom navigation without replacing icons. */
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

      @media(max-width:650px) {
        html body #${SHELL} #${HEADER} .msp-brand {gap:7px!important}
        html body #${SHELL} #${HEADER} .msp-runner {
          flex-basis:48px!important;
          width:48px!important;
          height:40px!important;
        }
        html body #${SHELL} #${HEADER} .msp-name {
          font-size:clamp(24px,7vw,35px)!important;
        }
        html body #${SHELL} #${HEADER} .msp-tag {font-size:9px!important}
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
            <div class="msp-name">MANA <span>MOVEMENT</span></div>
            <div class="msp-tag">TRAINING · MOVE WITH PURPOSE</div>
          </div>
        </div>
        <div class="msp-overview-row">
          <button id="${OVERVIEW}" type="button">⌂ Overview</button>
        </div>
      `;
      holder.prepend(header);
    }
  }

  function init() {
    installStyle();
    const holder = document.getElementById(CONTENT);
    if (holder) {
      const observer = new MutationObserver(() => {
        if (isProgressOpen()) ensureHeader();
      });
      observer.observe(holder,{childList:true});
    }
    document.addEventListener("click", event => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("#" + OVERVIEW)) {
        document.querySelector(
          '#manaV83Tabs [data-v83-tab="overview"]'
        )?.click();
      } else if (event.target.closest("#manaV83Tabs .mana-v83-tab")) {
        requestAnimationFrame(ensureHeader);
      }
    });
    ensureHeader();
    window.MANA_STRENGTH_PROGRESS_DESIGN_BUILD = "104270";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded",init,{once:true});
  } else {
    init();
  }
})();
