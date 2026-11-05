
/* MANA MOVEMENT — STRENGTH PROGRESS DESIGN 104300
   Complete standalone replacement for 104290.
   One consistent black/orange/white/silver design.
   Keeps existing Progress renderers, data, tabs and charts.
   Restores missing Water from actual Fuel storage; styles the
   original weight graph rather than creating another graph.
*/
(() => {
  "use strict";
  if (window.MANA_STRENGTH_PROGRESS_DESIGN_104300) return;
  window.MANA_STRENGTH_PROGRESS_DESIGN_104300 = true;

  const SHELL = "manaV83ProgramShell";
  const CONTENT = "manaV83Content";
  const ROOT = "manaV993StrengthProgress";
  const HEADER = "manaStrengthProgressHeader104300";
  const BACK = "manaStrengthProgressOverview104300";
  const STYLE = "mana-strength-progress-design-104300";
  const WATER_ID = "manaStrengthWater104300";
  let queued = false;

  function active() {
    const shell = document.getElementById(SHELL);
    return Boolean(shell?.classList.contains("open") &&
      document.getElementById("manaV83Title")?.textContent
        ?.trim().toUpperCase() === "MANA STRENGTH" &&
      shell.querySelector('#manaV83Tabs .mana-v83-tab.active[data-v83-tab="progress"]') &&
      shell.querySelector("#" + CONTENT + " #" + ROOT));
  }

  function installStyle() {
    if (document.getElementById(STYLE)) return;
    const style = document.createElement("style");
    style.id = STYLE;
    style.textContent = `
      html body #${SHELL}.open:has(#${ROOT}) {background:#08090B!important;color:#FFF!important}
      html body #${SHELL}:has(#${ROOT}) .mana-v83-head {display:none!important}
      html body #${SHELL}:has(#${ROOT}) .mana-v83-shell {width:min(100%,960px)!important;max-width:960px!important}
      html body #${SHELL}:has(#${ROOT}) #${CONTENT} {display:flex!important;flex-direction:column!important;align-items:stretch!important}
      html body #${SHELL}:has(#${ROOT}) #${CONTENT}>* {order:0;min-width:0}
      html body #${SHELL}:has(#${ROOT}) #${CONTENT}>#${HEADER} {order:-10!important}
      html body #${SHELL} #${HEADER} {width:100%;margin:0 0 13px}
      html body #${SHELL} #${HEADER} .msp-brand {display:flex;align-items:center;gap:12px;min-width:0}
      html body #${SHELL} #${HEADER} .msp-runner {width:76px;height:56px;flex:0 0 76px;background:transparent url("ui/mana-runner-logo.png") center/contain no-repeat}
      html body #${SHELL} #${HEADER} .msp-name {color:#FFF!important;font:900 clamp(34px,5.2vw,53px)/1.05 system-ui,sans-serif;white-space:nowrap;letter-spacing:.015em}
      html body #${SHELL} #${HEADER} .msp-name span {color:#FF7927!important;-webkit-text-fill-color:#FF7927!important}
      html body #${SHELL} #${HEADER} .msp-tag {margin-top:4px;color:#C1C6CE;font:750 10px/1.25 system-ui,sans-serif;letter-spacing:.12em}
      html body #${SHELL} #${HEADER} .msp-back-row {display:flex;justify-content:flex-end;margin:4px 0 10px}
      html body #${SHELL} #${BACK} {min-height:34px;padding:6px 14px;background:#15171B;border:1px solid #697686;border-radius:11px;color:#FFF;font:850 12px system-ui,sans-serif;cursor:pointer}
      html body #${SHELL} #${ROOT} {width:100%!important;max-width:100%!important;margin:0 auto!important;color:#FFF!important}
      html body #${SHELL} #${ROOT} .mana-v993-head h2,
      html body #${SHELL} #${ROOT} .mana-v993-panel h3,
      html body #${SHELL} #${ROOT} .mana-v993-row-title {color:#FFF!important;-webkit-text-fill-color:#FFF!important}
      html body #${SHELL} #${ROOT} .mana-v993-kicker,
      html body #${SHELL} #${ROOT} .mana-v993-panel-kicker {color:#FF7927!important;-webkit-text-fill-color:#FF7927!important}
      html body #${SHELL} #${ROOT} .mana-v993-head p,
      html body #${SHELL} #${ROOT} .mana-v993-metric-sub,
      html body #${SHELL} #${ROOT} .mana-v993-row-sub {color:#C1C6CE!important;-webkit-text-fill-color:#C1C6CE!important}
      html body #${SHELL} #${ROOT} .mana-v993-periods {background:#101216!important;border:1px solid #697686!important;border-radius:14px!important;padding:5px!important}
      html body #${SHELL} #${ROOT} .mana-v993-period,
      html body #${SHELL} #${ROOT} .mana-v993-detail-btn {background:#15171B!important;border:1px solid #697686!important;border-radius:12px!important;color:#C1C6CE!important;-webkit-text-fill-color:#C1C6CE!important;box-shadow:none!important}
      html body #${SHELL} #${ROOT} .mana-v993-period.active,
      html body #${SHELL} #${ROOT} .mana-v993-detail-btn.active {background:#20160F!important;border-color:#FF7927!important;color:#FF7927!important;-webkit-text-fill-color:#FF7927!important}

      /* All seven metric cards. This specificity overrides legacy gold,
         green, water-blue, recovery-purple and cardio-blue overrides. */
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric,
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric.mp-water-metric,
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric.mp-recovery-card {background:#15171B!important;background-image:none!important;border:1px solid #A5ADB7!important;border-color:#A5ADB7!important;border-radius:16px!important;box-shadow:none!important}
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric .mana-v993-metric-label {color:#C1C6CE!important;-webkit-text-fill-color:#C1C6CE!important}
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric .mana-v993-metric-value,
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric .mana-v993-metric-value *,
      html body #${SHELL} #${ROOT} .mana-v993-row-value,
      html body #${SHELL} #${ROOT} .mana-v993-summary strong {color:#FF7927!important;-webkit-text-fill-color:#FF7927!important;text-shadow:none!important}
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric .mana-v993-track {background:#252B31!important}
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric .mana-v993-fill,
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric .mp-water-fill {background:#FF7927!important;background-image:none!important;background-color:#FF7927!important;box-shadow:none!important}
      html body #${SHELL} #${ROOT} .mana-v993-panel {background:#15171B!important;background-image:none!important;border:1px solid #A5ADB7!important;border-radius:19px!important;box-shadow:none!important}
      html body #${SHELL} #${ROOT} .mana-v993-summary {background:#0D0F13!important;border:1px solid #697686!important}
      html body #${SHELL} #${ROOT} .mana-v993-summary span {color:#C1C6CE!important}
      html body #${SHELL} #${ROOT} .mana-v993-exercise-select {background:#0D0F13!important;border:1px solid #697686!important;color:#FFF!important}
      html body #${SHELL} #${ROOT} .mana-v993-row,
      html body #${SHELL} #${ROOT} .mana-v953-history-row {border-color:#697686!important;box-shadow:none!important}

      /* ORIGINAL weight graph and its lines, dots and outer border. */
      html body #${SHELL} #${ROOT} .mana-v952-chart-wrap,
      html body #${SHELL} #${ROOT} .mana-v953-chart-shell,
      html body #${SHELL} #${ROOT} .mana-v953-trend,
      html body #${SHELL} #${ROOT} [class*="weight-trend"] {background:#101216!important;border-color:#697686!important;box-shadow:none!important}
      html body #${SHELL} #${ROOT} .mana-v952-line,
      html body #${SHELL} #${ROOT} .mana-v953-line,
      html body #${SHELL} #${ROOT} .mana-v952-chart polyline,
      html body #${SHELL} #${ROOT} .mana-v953-chart polyline,
      html body #${SHELL} #${ROOT} #manaV993Detail svg polyline {stroke:#FF7927!important;filter:none!important}
      html body #${SHELL} #${ROOT} .mana-v952-point,
      html body #${SHELL} #${ROOT} .mana-v953-dot,
      html body #${SHELL} #${ROOT} #manaV993Detail svg circle {stroke:#FF7927!important;fill:#FF7927!important;filter:none!important}
      html body #${SHELL} #${ROOT} .mana-v953-trend-title,
      html body #${SHELL} #${ROOT} .mana-v952-title {color:#FFF!important;-webkit-text-fill-color:#FFF!important}
      html body #${SHELL} #${ROOT} .mana-v953-kicker,
      html body #${SHELL} #${ROOT} .mana-v953-history-title {color:#FF7927!important;-webkit-text-fill-color:#FF7927!important}
      html body #${SHELL} #${ROOT} .mana-v953-stat,
      html body #${SHELL} #${ROOT} .mana-v953-history,
      html body #${SHELL} #${ROOT} .mana-v953-summary {border-color:#697686!important;background:#101216!important;box-shadow:none!important}
      html body #${SHELL} #${ROOT} .mana-v953-history-row strong,
      html body #${SHELL} #${ROOT} .mana-v953-stat strong {color:#FF7927!important;-webkit-text-fill-color:#FF7927!important}

      /* Standard bottom navigation. Remove old gold/purple icon glow. */
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs {background:rgba(8,9,11,.97)!important;border-top:1px solid #464D55!important;box-shadow:none!important}
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab {background:transparent!important;border:1px solid transparent!important;color:#C1C6CE!important;-webkit-text-fill-color:#C1C6CE!important;box-shadow:none!important;text-shadow:none!important;filter:none!important}
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab.active {background:#20160F!important;border:1px solid #FF7927!important;border-radius:12px!important;color:#FF7927!important;-webkit-text-fill-color:#FF7927!important;box-shadow:none!important}
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab::before {background:#A5ADB7!important;box-shadow:none!important}
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab.active::before {background:#FF7927!important}
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab img {filter:grayscale(1) brightness(1.75)!important;opacity:.95!important;box-shadow:none!important}
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab svg,
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab svg * {color:inherit!important;stroke:currentColor!important;filter:none!important}
      @media(max-width:650px) {
        html body #${SHELL} #${HEADER} .msp-brand {gap:7px!important}
        html body #${SHELL} #${HEADER} .msp-runner {width:48px!important;height:40px!important;flex-basis:48px!important}
        html body #${SHELL} #${HEADER} .msp-name {font-size:clamp(24px,7vw,35px)!important}
        html body #${SHELL} #${HEADER} .msp-tag {font-size:9px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function header() {
    const holder = document.getElementById(CONTENT);
    if (!holder) return;
    let node = document.getElementById(HEADER);
    if (node?.parentElement === holder) return;
    node = document.createElement("div");
    node.id = HEADER;
    node.innerHTML = `
      <div class="msp-brand">
        <div class="msp-runner" aria-hidden="true"></div>
        <div>
          <div class="msp-name">MANA <span>MOVEMENT</span></div>
          <div class="msp-tag">TRAINING · MOVE WITH PURPOSE</div>
        </div>
      </div>
      <div class="msp-back-row">
        <button type="button" id="${BACK}">⌂ Overview</button>
      </div>`;
    holder.prepend(node);
  }

  function waterData() {
    const day = new Date();
    const key = [day.getFullYear(),String(day.getMonth()+1).padStart(2,"0"),
      String(day.getDate()).padStart(2,"0")].join("-");
    let amount = 0;
    let target = 2300;
    try {
      const fuel = JSON.parse(localStorage.getItem("mana-fuel-v571") || "{}");
      amount = Math.max(0,Number(fuel?.[key]?.water) || 0);
    } catch (_) {}
    try {
      const saved = JSON.parse(localStorage.getItem("mana-fuel-v58-targets") || "{}");
      target = Math.max(1,Number(saved?.water) || 2300);
    } catch (_) {}
    return {amount,target};
  }

  function waterCard() {
    const root = document.getElementById(ROOT);
    const grid = root?.querySelector(".mana-v993-metrics");
    if (!grid) return;
    const cards = [...grid.querySelectorAll(".mana-v993-metric")];
    const existing = cards.find(card =>
      card.querySelector(".mana-v993-metric-label")?.textContent
        ?.trim().toUpperCase() === "WATER");
    const ours = document.getElementById(WATER_ID);
    if (existing && existing.id !== WATER_ID) {
      if (ours) ours.remove();
      return;
    }
    const {amount,target} = waterData();
    const percent = Math.max(0,Math.min(100,Math.round(amount/target*100)));
    const litres = (amount/1000).toFixed(1) + " L";
    const targetLitres = (target/1000).toFixed(1) + " L";
    let card = ours;
    if (!card || card.parentElement !== grid) {
      card = document.createElement("div");
      card.id = WATER_ID;
      card.className = "mana-v993-metric mp-water-metric";
      card.innerHTML = `
        <div class="mana-v993-metric-label">WATER</div>
        <div class="mana-v993-metric-value"></div>
        <div class="mana-v993-metric-sub"></div>
        <div class="mana-v993-track"><div class="mana-v993-fill mp-water-fill"></div></div>`;
      grid.appendChild(card);
    }
    const value = card.querySelector(".mana-v993-metric-value");
    const sub = card.querySelector(".mana-v993-metric-sub");
    const fill = card.querySelector(".mana-v993-fill");
    if (value.textContent !== litres) value.textContent = litres;
    if (sub.textContent !== "Target " + targetLitres) sub.textContent = "Target " + targetLitres;
    if (fill.style.width !== percent + "%") fill.style.width = percent + "%";
  }

  function tidyChartLabel() {
    const panel = document.querySelector("#" + ROOT + " #manaV993Detail");
    if (!panel) return;
    const walker = document.createTreeWalker(panel,NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!/green trend line|gold data points/i.test(node.textContent)) continue;
      node.textContent = node.textContent
        .replace(/green trend line/gi,"orange trend line")
        .replace(/gold data points/gi,"orange data points");
    }
  }

  function maintain() {
    if (!active()) return;
    header();
    waterCard();
    tidyChartLabel();
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {queued=false;maintain();});
  }
  function init() {
    installStyle();
    const holder = document.getElementById(CONTENT);
    if (holder) {
      new MutationObserver(schedule).observe(holder,{childList:true,subtree:true});
    }
    document.addEventListener("click",event => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("#" + BACK)) {
        document.querySelector('#manaV83Tabs [data-v83-tab="overview"]')?.click();
      } else if (event.target.closest('#manaV83Tabs .mana-v83-tab, [data-v993-period], [data-v993-detail]')) {
        requestAnimationFrame(schedule);
      }
    });
    ["mana:program-tab-change","mana:fuel-updated","mana:recovery-updated",
      "mana:body-weight-updated","mana:profile-synced"].forEach(name =>
      window.addEventListener(name,schedule));
    window.addEventListener("storage",event => {
      if (["mana-fuel-v571","mana-fuel-v58-targets"].includes(event.key)) schedule();
    });
    schedule();
    window.MANA_STRENGTH_PROGRESS_DESIGN_BUILD = "104300";
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
