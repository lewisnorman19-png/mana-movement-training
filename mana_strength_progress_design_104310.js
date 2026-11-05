
/* ============================================================
   MANA MOVEMENT — STRENGTH PROGRESS DESIGN 104310
   COMPLETE FILE — REPLACES 104300, DO NOT LOAD BOTH.

   One consistent black / orange / white / silver design.
   Keeps the original Progress calculations and event handlers.
   Stabilises ONE Water card, sourced from Fuel.
   Keeps ONE weight chart INSIDE Weight Progression.
   No data writes, no changes to Workouts, Fuel or Coach Hub.
   ============================================================ */
(() => {
  "use strict";
  if (window.MANA_STRENGTH_PROGRESS_DESIGN_104310) return;
  window.MANA_STRENGTH_PROGRESS_DESIGN_104310 = true;

  const ROOT = "manaV993StrengthProgress";
  const SHELL = "manaV83ProgramShell";
  const CONTENT = "manaV83Content";
  const HEADER = "manaStrengthProgressHeader104310";
  const BACK = "manaStrengthProgressOverview104310";
  const STYLE = "manaStrengthProgressStyle104310";
  const WATER = "manaStrengthWater104310";
  const CHART = "manaStrengthWeightChart104310";
  const FUEL_KEY = "mana-fuel-v571";
  const TARGET_KEY = "mana-fuel-v58-targets";
  const WEIGHT_KEY = "mana-strength-v947-body-weight";
  let queued = false;

  function active() {
    const shell = document.getElementById(SHELL);
    return !!(
      shell?.classList.contains("open") &&
      document.getElementById("manaV83Title")?.textContent
        ?.trim().toUpperCase() === "MANA STRENGTH" &&
      shell.querySelector('#manaV83Tabs .mana-v83-tab.active[data-v83-tab="progress"]') &&
      document.getElementById(ROOT)
    );
  }

  function installStyle() {
    if (document.getElementById(STYLE)) return;
    const el = document.createElement("style");
    el.id = STYLE;
    el.textContent = `
      html body #${SHELL}.open:has(#${ROOT}) {
        background:#08090B!important;color:#FFFFFF!important;
      }
      html body #${SHELL}:has(#${ROOT}) .mana-v83-head {
        display:none!important;
      }
      html body #${SHELL}:has(#${ROOT}) .mana-v83-shell {
        width:min(100%,960px)!important;max-width:960px!important;
      }
      html body #${SHELL}:has(#${ROOT}) #${CONTENT} {
        display:flex!important;flex-direction:column!important;
        align-items:stretch!important;
      }
      html body #${SHELL}:has(#${ROOT}) #${CONTENT}>* {min-width:0;order:0;}
      html body #${SHELL}:has(#${ROOT}) #${CONTENT}>#${HEADER} {order:-10!important;}
      html body #${SHELL} #${HEADER} {margin:0 0 13px!important;width:100%!important;}
      html body #${SHELL} #${HEADER} .msp-brand {
        display:flex;align-items:center;gap:12px;min-width:0;
      }
      html body #${SHELL} #${HEADER} .msp-runner {
        width:76px;height:56px;flex:0 0 76px;
        background:transparent url("ui/mana-runner-logo.png") center/contain no-repeat;
      }
      html body #${SHELL} #${HEADER} .msp-name {
        color:#FFF!important;font:900 clamp(34px,5.2vw,53px)/1.05 system-ui,sans-serif;
        letter-spacing:.015em;white-space:nowrap;
      }
      html body #${SHELL} #${HEADER} .msp-name span {
        color:#FF7927!important;-webkit-text-fill-color:#FF7927!important;
      }
      html body #${SHELL} #${HEADER} .msp-tag {
        margin-top:4px;color:#C1C6CE;font:750 10px/1.25 system-ui,sans-serif;
        letter-spacing:.12em;
      }
      html body #${SHELL} #${HEADER} .msp-back-row {
        display:flex;justify-content:flex-end;margin:4px 0 10px;
      }
      html body #${SHELL} #${BACK} {
        padding:7px 14px;min-height:34px;background:#15171B;border:1px solid #697686;
        border-radius:11px;color:#FFF;font:850 12px system-ui,sans-serif;cursor:pointer;
      }
      html body #${SHELL} #${ROOT} {width:100%!important;max-width:100%!important;color:#FFF!important;}
      html body #${SHELL} #${ROOT} .mana-v993-head h2,
      html body #${SHELL} #${ROOT} .mana-v993-panel h3,
      html body #${SHELL} #${ROOT} .mana-v993-row-title {
        color:#FFFFFF!important;-webkit-text-fill-color:#FFFFFF!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-kicker,
      html body #${SHELL} #${ROOT} .mana-v993-panel-kicker {
        color:#FF7927!important;-webkit-text-fill-color:#FF7927!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-head p,
      html body #${SHELL} #${ROOT} .mana-v993-row-sub,
      html body #${SHELL} #${ROOT} .mana-v993-metric-sub {
        color:#C1C6CE!important;-webkit-text-fill-color:#C1C6CE!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-periods {
        padding:5px!important;background:#101216!important;
        border:1px solid #697686!important;border-radius:14px!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-period,
      html body #${SHELL} #${ROOT} .mana-v993-detail-btn {
        background:#15171B!important;border:1px solid #697686!important;
        border-radius:12px!important;color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;box-shadow:none!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-period.active,
      html body #${SHELL} #${ROOT} .mana-v993-detail-btn.active {
        background:#20160F!important;border-color:#FF7927!important;
        color:#FF7927!important;-webkit-text-fill-color:#FF7927!important;
      }
      /* Every top card, including legacy and restored Water/Recovery. */
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric,
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric.mp-water-metric,
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric.mp-recovery-card,
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric.mf450-cardio,
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric.mf450-core {
        background:#15171B!important;background-image:none!important;
        border:1px solid #A5ADB7!important;border-color:#A5ADB7!important;
        border-radius:16px!important;box-shadow:none!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric .mana-v993-metric-label {
        color:#C1C6CE!important;-webkit-text-fill-color:#C1C6CE!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric .mana-v993-metric-value,
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric .mana-v993-metric-value *,
      html body #${SHELL} #${ROOT} .mana-v993-summary strong,
      html body #${SHELL} #${ROOT} .mana-v993-row-value {
        color:#FF7927!important;-webkit-text-fill-color:#FF7927!important;
        text-shadow:none!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric .mana-v993-track {
        background:#252B31!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric .mana-v993-fill,
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric .mp-water-fill,
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric.mp-recovery-card .mana-v993-fill,
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric.mf450-cardio .mana-v993-fill,
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric.mf450-core .mana-v993-fill {
        background:#FF7927!important;background-image:none!important;
        background-color:#FF7927!important;box-shadow:none!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-panel {
        background:#15171B!important;background-image:none!important;
        border:1px solid #A5ADB7!important;border-radius:19px!important;box-shadow:none!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-summary {
        background:#0D0F13!important;border:1px solid #697686!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-summary span {
        color:#C1C6CE!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-exercise-select {
        background:#0D0F13!important;border:1px solid #697686!important;
        color:#FFF!important;
      }
      /* Old body-weight rows, separators, and graph, wherever mounted. */
      html body #${SHELL} #${ROOT} .mana-v993-row,
      html body #${SHELL} #${ROOT} .mana-v953-history-row {
        border-color:#697686!important;box-shadow:none!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-row {
        border-top:1px solid #697686!important;
      }
      html body #${SHELL} #${ROOT} .mana-v993-row:first-child {
        border-top:0!important;
      }
      html body #${SHELL} #${ROOT} .mana-v953-chart-shell,
      html body #${SHELL} #${ROOT} .mana-v952-chart-wrap,
      html body #${SHELL} #${ROOT} [class*="weight-trend"] {
        background:#101216!important;border-color:#697686!important;box-shadow:none!important;
      }
      html body #${SHELL} #${ROOT} #manaV993Detail svg polyline,
      html body #${SHELL} #${ROOT} #manaV993Detail .mana-v953-line,
      html body #${SHELL} #${ROOT} #manaV993Detail .mana-v952-line {
        stroke:#FF7927!important;filter:none!important;
      }
      html body #${SHELL} #${ROOT} #manaV993Detail svg circle,
      html body #${SHELL} #${ROOT} #manaV993Detail .mana-v953-dot,
      html body #${SHELL} #${ROOT} #manaV993Detail .mana-v952-point {
        fill:#FF7927!important;stroke:#FF7927!important;filter:none!important;
      }
      html body #${SHELL} #${ROOT} #manaV993Detail svg line {
        stroke:#464D55!important;
      }
      /* A fallback chart is inserted only if the native panel has none. */
      html body #${SHELL} #${ROOT} #${CHART} {
        margin-top:16px;padding:14px;border:1px solid #697686;
        border-radius:16px;background:#101216;
      }
      html body #${SHELL} #${ROOT} #${CHART} h4 {
        margin:0 0 4px;color:#FFF;font:900 15px system-ui,sans-serif;
      }
      html body #${SHELL} #${ROOT} #${CHART} p {
        margin:0 0 10px;color:#C1C6CE;font:500 11px system-ui,sans-serif;
      }
      html body #${SHELL} #${ROOT} #${CHART} svg {
        display:block;width:100%;height:auto;max-height:230px;
      }
      /* Approved bottom tabs, no old purple glow or yellow artwork tint. */
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs {
        background:rgba(8,9,11,.97)!important;border-top:1px solid #464D55!important;
        box-shadow:none!important;
      }
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab {
        background:transparent!important;border:1px solid transparent!important;
        color:#C1C6CE!important;-webkit-text-fill-color:#C1C6CE!important;
        box-shadow:none!important;text-shadow:none!important;
      }
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab.active {
        background:#20160F!important;border:1px solid #FF7927!important;
        border-radius:12px!important;color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;box-shadow:none!important;
      }
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab::before {
        background:#A5ADB7!important;box-shadow:none!important;
      }
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab.active::before {
        background:#FF7927!important;
      }
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab img {
        filter:grayscale(1) brightness(1.7)!important;opacity:.95!important;
        box-shadow:none!important;
      }
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab svg,
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab svg * {
        color:inherit!important;stroke:currentColor!important;filter:none!important;
      }
      @media(max-width:650px) {
        html body #${SHELL} #${HEADER} .msp-brand {gap:7px!important;}
        html body #${SHELL} #${HEADER} .msp-runner {
          width:48px;height:40px;flex-basis:48px;
        }
        html body #${SHELL} #${HEADER} .msp-name {
          font-size:clamp(24px,7vw,35px)!important;
        }
        html body #${SHELL} #${HEADER} .msp-tag {font-size:9px!important;}
      }
    `;
    document.head.appendChild(el);
  }

  function ensureHeader() {
    const holder = document.getElementById(CONTENT);
    if (!holder || document.getElementById(HEADER)?.parentElement === holder) return;
    const el = document.createElement("div");
    el.id = HEADER;
    el.innerHTML = `
      <div class="msp-brand">
        <div class="msp-runner" aria-hidden="true"></div>
        <div>
          <div class="msp-name">MANA <span>MOVEMENT</span></div>
          <div class="msp-tag">TRAINING · MOVE WITH PURPOSE</div>
        </div>
      </div>
      <div class="msp-back-row">
        <button id="${BACK}" type="button">⌂ Overview</button>
      </div>`;
    holder.prepend(el);
  }

  function readFuel() {
    const d = new Date();
    const key = [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),
      String(d.getDate()).padStart(2,"0")].join("-");
    let amount = 0;
    let target = 2300;
    try {
      const fuel = JSON.parse(localStorage.getItem(FUEL_KEY) || "{}");
      amount = Math.max(0,Number(fuel?.[key]?.water) || 0);
    } catch (_) {}
    try {
      const saved = JSON.parse(localStorage.getItem(TARGET_KEY) || "{}");
      target = Math.max(1,Number(saved?.water) || 2300);
    } catch (_) {}
    return {amount,target};
  }

  function ensureOneWater() {
    const grid = document.querySelector("#" + ROOT + " .mana-v993-metrics");
    if (!grid) return;
    const waters = [...grid.querySelectorAll(".mana-v993-metric")].filter(card =>
      card.querySelector(".mana-v993-metric-label")?.textContent
        ?.trim().toUpperCase() === "WATER");

    /* Prefer the card owned by this build. All duplicates are removed.
       The values come from Fuel rather than from a stale cloned node. */
    let card = waters.find(el => el.id === WATER) || waters[0] || null;
    if (!card) {
      card = document.createElement("div");
      card.id = WATER;
      card.className = "mana-v993-metric mp-water-metric";
      card.innerHTML = `
        <div class="mana-v993-metric-label">WATER</div>
        <div class="mana-v993-metric-value"></div>
        <div class="mana-v993-metric-sub"></div>
        <div class="mana-v993-track"><div class="mana-v993-fill mp-water-fill"></div></div>`;
      grid.appendChild(card);
    }
    waters.forEach(other => {if (other !== card) other.remove();});

    const {amount,target} = readFuel();
    const display = (amount/1000).toFixed(1) + " L";
    const subtext = "Target " + (target/1000).toFixed(1) + " L";
    const pct = Math.min(100,Math.max(0,Math.round(100*amount/target))) + "%";
    const value = card.querySelector(".mana-v993-metric-value");
    const sub = card.querySelector(".mana-v993-metric-sub");
    const bar = card.querySelector(".mana-v993-fill") ||
      card.querySelector(".mp-water-fill");
    if (value && value.textContent !== display) value.textContent = display;
    if (sub && sub.textContent !== subtext) sub.textContent = subtext;
    if (bar && bar.style.width !== pct) bar.style.width = pct;
    card.classList.add("mp-water-metric");
  }

  function readWeight() {
    try {
      const entries = JSON.parse(localStorage.getItem(WEIGHT_KEY) || "[]");
      if (!Array.isArray(entries)) return [];
      return entries.filter(x => x?.date && Number(x.weight) > 0)
        .map(x => ({date:String(x.date),weight:Number(x.weight)}))
        .filter(x => Number.isFinite(x.weight))
        .sort((a,b) => a.date.localeCompare(b.date)).slice(-30);
    } catch (_) {return [];}
  }

  function fallbackGraphHtml(data) {
    if (!data.length) {
      return '<p>No body-weight check-ins yet. Log your weight to see a trend.</p>';
    }
    const W=640,H=190,L=46,R=14,T=18,B=29;
    const values=data.map(x=>x.weight);
    const min=Math.min(...values),max=Math.max(...values);
    const pad=Math.max(1,(max-min)*.2);
    const low=min-pad,high=max+pad;
    const X=i=>data.length===1?(L+W-R)/2:L+i*(W-L-R)/(data.length-1);
    const Y=v=>T+(high-v)*(H-T-B)/(high-low);
    const poly=data.map((v,i)=>X(i).toFixed(1)+','+Y(v.weight).toFixed(1)).join(' ');
    const dots=data.map((v,i)=>'<circle cx="'+X(i).toFixed(1)+
      '" cy="'+Y(v.weight).toFixed(1)+'" r="3.6" fill="#FF7927">'+
      '<title>'+v.date+': '+v.weight.toFixed(1)+' kg</title></circle>').join('');
    const dateLabel=v=>v.date.slice(5);
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Body-weight history">
      <line x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}" stroke="#697686"/>
      <line x1="${L}" x2="${W-R}" y1="${T}" y2="${T}" stroke="#454B53" stroke-dasharray="4 5"/>
      <polyline points="${poly}" stroke="#FF7927" stroke-width="3"
        stroke-linejoin="round" stroke-linecap="round" fill="none"/>
      ${dots}
      <g fill="#C1C6CE" font-family="system-ui,sans-serif" font-size="11">
        <text x="4" y="${T+5}">${high.toFixed(1)}</text>
        <text x="4" y="${H-B+5}">${low.toFixed(1)}</text>
        <text x="${L}" y="${H-6}">${dateLabel(data[0])}</text>
        <text x="${W-R}" y="${H-6}" text-anchor="end">${dateLabel(data[data.length-1])}</text>
      </g></svg>`;
  }

  function ensureWeightGraph() {
    const root=document.getElementById(ROOT);
    const detail=root?.querySelector("#manaV993Detail");
    const weightActive=!!root?.querySelector(
      '.mana-v993-detail-btn.active[data-v993-detail="weight"]');
    if (!detail || !weightActive) return;
    const panel=detail.querySelector(".mana-v993-panel");
    if (!panel) return;

    const existing=panel.querySelector("#"+CHART);
    const nativeChart=[...panel.querySelectorAll("svg,canvas")]
      .some(node=>!node.closest("#"+CHART));
    if (nativeChart) {
      if (existing) existing.remove();
      return;
    }
    const data=readWeight();
    const snapshot=data.map(x=>x.date+":"+x.weight).join("|");
    const graph=existing || document.createElement("section");
    if (!existing) {
      graph.id=CHART;
      graph.setAttribute("aria-label","Body-weight history chart");
      panel.appendChild(graph);
    }
    if (graph.dataset.snapshot!==snapshot) {
      graph.dataset.snapshot=snapshot;
      graph.innerHTML='<h4>Body Weight Trend</h4>'+fallbackGraphHtml(data);
    }
  }

  function tidyOldChart() {
    const root=document.getElementById(ROOT);
    const detail=root?.querySelector("#manaV993Detail");
    if (!detail) return;
    /* Only update the old explanatory label, never change values. */
    const labels=[...detail.querySelectorAll("small,p,span,div")]
      .filter(el=>el.children.length===0 &&
        /green trend line|gold data points/i.test(el.textContent || ""));
    labels.forEach(el=>{
      const updated=el.textContent.replace(/green trend line/gi,"orange trend line")
        .replace(/gold data points/gi,"orange data points");
      if(el.textContent!==updated) el.textContent=updated;
    });
  }

  function maintain() {
    if (!active()) return;
    ensureHeader();
    ensureOneWater();
    ensureWeightGraph();
    tidyOldChart();
  }
  function schedule() {
    if (queued) return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;maintain();});
  }
  function init() {
    installStyle();
    const holder=document.getElementById(CONTENT);
    if (holder) {
      /* Observe redraws, not text/style mutations: no constant refresh loop. */
      new MutationObserver(schedule).observe(holder,{childList:true,subtree:true});
    }
    document.addEventListener("click",event=>{
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("#"+BACK)) {
        document.querySelector('#manaV83Tabs [data-v83-tab="overview"]')?.click();
      } else if (event.target.closest(
        '#manaV83Tabs .mana-v83-tab,[data-v993-period],[data-v993-detail]')) {
        requestAnimationFrame(schedule);
      }
    });
    ["mana:program-tab-change","mana:fuel-updated","mana:recovery-updated",
     "mana:body-weight-updated","mana:profile-synced"].forEach(name=>
      window.addEventListener(name,schedule));
    window.addEventListener("storage",event=>{
      if ([FUEL_KEY,TARGET_KEY,WEIGHT_KEY].includes(event.key)) schedule();
    });
    schedule();
    window.MANA_STRENGTH_PROGRESS_DESIGN_BUILD="104310";
  }
  if(document.readyState==="loading")
    document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
