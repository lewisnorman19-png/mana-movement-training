
/* MANA MOVEMENT — STRENGTH PROGRESS DESIGN 104290
   Full-file replacement for 104280. Visual design and card stability only.
   Keeps the existing Progress engine, values, controls and saved data.
   Removes the additional custom graph introduced in 104280.
*/
(() => {
  "use strict";
  if (window.MANA_STRENGTH_PROGRESS_DESIGN_104290) return;
  window.MANA_STRENGTH_PROGRESS_DESIGN_104290 = true;

  const SHELL = "manaV83ProgramShell";
  const CONTENT = "manaV83Content";
  const ROOT = "manaV993StrengthProgress";
  const HEADER = "manaStrengthProgressHeader104290";
  const OVERVIEW = "manaStrengthProgressOverview104290";
  const STYLE = "mana-strength-progress-design-104290";
  let lastWaterCard = null;
  let repairing = false;

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
    const style = document.createElement("style");
    style.id = STYLE;
    style.textContent = `
      /* Same approved premium styling across the whole Progress screen. */
      html body #${SHELL}.open:has(#${ROOT}) {
        background:#08090B!important;
        color:#FFFFFF!important;
      }
      html body #${SHELL}:has(#${ROOT}) .mana-v83-head {
        display:none!important;
      }
      html body #${SHELL}:has(#${ROOT}) .mana-v83-shell {
        width:min(100%,960px)!important;
        max-width:960px!important;
      }
      html body #${SHELL}:has(#${ROOT}) #${CONTENT} {
        display:flex!important;
        flex-direction:column!important;
        align-items:stretch!important;
      }
      html body #${SHELL}:has(#${ROOT}) #${CONTENT} > * {
        min-width:0!important;
        order:0;
      }
      html body #${SHELL}:has(#${ROOT}) #${CONTENT} > #${HEADER} {
        order:-10!important;
      }
      html body #${SHELL} #${HEADER} {
        margin:0 0 13px!important;
        width:100%!important;
      }
      html body #${SHELL} #${HEADER} .msp-brand {
        display:flex!important;
        gap:12px!important;
        align-items:center!important;
        min-width:0;
      }
      html body #${SHELL} #${HEADER} .msp-runner {
        width:76px!important;
        height:56px!important;
        flex:0 0 76px!important;
        background:transparent url("ui/mana-runner-logo.png")
          center/contain no-repeat!important;
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
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        margin:4px 0 0!important;
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
        background:#15171B!important;
        border:1px solid #697686!important;
        border-radius:11px!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:850 12px/1.2 system-ui,sans-serif!important;
        cursor:pointer!important;
      }
      html body #${SHELL} #${ROOT} {
        width:100%!important;
        max-width:100%!important;
        margin:0 auto!important;
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
      html body #${SHELL} #${ROOT} .mana-v993-periods {
        background:#101216!important;
        border:1px solid #697686!important;
        border-radius:14px!important;
        padding:5px!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-period,
      html body #${SHELL} #${ROOT} .mana-v993-detail-btn {
        background:#15171B!important;
        border:1px solid #697686!important;
        border-radius:12px!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        box-shadow:none!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-period.active,
      html body #${SHELL} #${ROOT} .mana-v993-detail-btn.active {
        background:#20160F!important;
        border:1px solid #FF7927!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      /* Uniform rule wins over older GOLD / WATER / RECOVERY / CARDIO rules. */
      html body #${SHELL} #${ROOT} .mana-v993-metrics
        .mana-v993-metric,
      html body #${SHELL} #${ROOT} .mana-v993-metrics
        .mana-v993-metric.mp-water-metric,
      html body #${SHELL} #${ROOT} .mana-v993-metrics
        .mana-v993-metric.mp-recovery-card,
      html body #${SHELL} #${ROOT} .mana-v993-metrics
        .mana-v993-metric.mf450-cardio,
      html body #${SHELL} #${ROOT} .mana-v993-metrics
        .mana-v993-metric.mf450-core {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        border-color:#A5ADB7!important;
        border-radius:16px!important;
        box-shadow:none!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-metrics
        .mana-v993-metric .mana-v993-metric-label {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-metrics
        .mana-v993-metric .mana-v993-metric-value,
      html body #${SHELL} #${ROOT} .mana-v993-metrics
        .mana-v993-metric .mana-v993-metric-value *,
      html body #${SHELL} #${ROOT} .mana-v993-summary strong,
      html body #${SHELL} #${ROOT} .mana-v993-row-value {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        text-shadow:none!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-metrics
        .mana-v993-metric .mana-v993-track {
        background:#252B31!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-metrics
        .mana-v993-metric .mana-v993-fill,
      html body #${SHELL} #${ROOT} .mana-v993-metrics
        .mana-v993-metric .mp-water-fill,
      html body #${SHELL} #${ROOT} .mana-v993-metrics
        .mana-v993-metric.mp-recovery-card .mana-v993-fill,
      html body #${SHELL} #${ROOT} .mana-v993-metrics
        .mana-v993-metric.mf450-cardio .mana-v993-fill,
      html body #${SHELL} #${ROOT} .mana-v993-metrics
        .mana-v993-metric.mf450-core .mana-v993-fill {
        background:#FF7927!important;
        background-image:none!important;
        background-color:#FF7927!important;
        box-shadow:none!important;
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
      html body #${SHELL} #${ROOT} .mana-v993-exercise-select {
        background:#0D0F13!important;
        border:1px solid #697686!important;
        color:#FFFFFF!important;
      }
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
        #manaV83Tabs .mana-v83-tab:not(.active) img {
        filter:grayscale(1) brightness(1.65)!important;
      }
      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs .mana-v83-tab[data-v83-tab="overview"]:not(.active),
      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs .mana-v83-tab[data-v83-tab="overview"]:not(.active) svg * {
        color:#C1C6CE!important;
        stroke:#C1C6CE!important;
      }
      @media(max-width:650px) {
        html body #${SHELL} #${HEADER} .msp-brand {gap:7px!important}
        html body #${SHELL} #${HEADER} .msp-runner {
          flex:0 0 48px!important;
          width:48px!important;
          height:40px!important;
        }
        html body #${SHELL} #${HEADER} .msp-name {
          font-size:clamp(24px,7vw,35px)!important;
        }
        html body #${SHELL} #${HEADER} .msp-tag {
          font-size:9px!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function findWater(metrics) {
    return Array.from(metrics.querySelectorAll(".mana-v993-metric"))
      .find(card => {
        const label = card.querySelector(".mana-v993-metric-label")
          ?.textContent?.trim().toUpperCase();
        return label === "WATER";
      }) || null;
  }

  function preserveWater() {
    const metrics = document.querySelector("#" + ROOT + " .mana-v993-metrics");
    if (!metrics) return;
    const live = findWater(metrics);
    if (live) {
      lastWaterCard = live;
      return;
    }
    /* When an older renderer briefly omits WATER, reuse the actual
       existing card and its current event bindings; never invent values. */
    if (lastWaterCard && !lastWaterCard.isConnected) {
      metrics.appendChild(lastWaterCard);
    }
  }

  function ensureHeader() {
    const holder = document.getElementById(CONTENT);
    if (!holder) return;
    let header = document.getElementById(HEADER);
    if (header && header.parentElement === holder) return;
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
      </div>`;
    holder.prepend(header);
  }

  function maintain() {
    if (repairing || !isProgressOpen()) return;
    repairing = true;
    try {
      ensureHeader();
      preserveWater();
    } finally {
      repairing = false;
    }
  }

  function init() {
    installStyle();
    const holder = document.getElementById(CONTENT);
    if (holder) {
      const observer = new MutationObserver(maintain);
      observer.observe(holder,{childList:true,subtree:true});
    }
    document.addEventListener("click",event => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("#" + OVERVIEW)) {
        document.querySelector(
          '#manaV83Tabs [data-v83-tab="overview"]'
        )?.click();
      } else if (event.target.closest(
        '#manaV83Tabs .mana-v83-tab, [data-v993-period]'
      )) {
        requestAnimationFrame(maintain);
      }
    });
    ["mana:program-tab-change","mana:fuel-updated",
     "mana:recovery-updated","mana:body-weight-updated"]
      .forEach(name => window.addEventListener(name,maintain));
    maintain();
    window.MANA_STRENGTH_PROGRESS_DESIGN_BUILD = "104290";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded",init,{once:true});
  } else {
    init();
  }
})();
