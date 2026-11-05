
/* MANA MOVEMENT — STRENGTH PROGRESS 104320
   COMPLETE REPLACEMENT FOR 104310.
   One Water card, one weight graph, orange/silver throughout.
   Existing totals, periods, details and stored data are untouched.
*/
(() => {
  "use strict";
  if (window.MANA_STRENGTH_PROGRESS_DESIGN_104320) return;
  window.MANA_STRENGTH_PROGRESS_DESIGN_104320 = true;

  const S = "manaV83ProgramShell";
  const C = "manaV83Content";
  const R = "manaV993StrengthProgress";
  const H = "manaStrengthProgressHeader104320";
  const B = "manaStrengthProgressOverview104320";
  const W = "manaStrengthWater104320";
  const G = "manaStrengthGraph104320";
  const STYLE = "manaStrengthProgressStyle104320";
  const FUEL = "mana-fuel-v571";
  const TARGET = "mana-fuel-v58-targets";
  const WEIGHTS = "mana-strength-v947-body-weight";
  let queued = false;

  function active() {
    const shell = document.getElementById(S);
    return !!(shell?.classList.contains("open") &&
      document.getElementById("manaV83Title")?.textContent?.trim().toUpperCase() === "MANA STRENGTH" &&
      shell.querySelector('#manaV83Tabs .mana-v83-tab.active[data-v83-tab="progress"]') &&
      document.getElementById(R));
  }

  function styles() {
    if (document.getElementById(STYLE)) return;
    const el = document.createElement("style");
    el.id = STYLE;
    el.textContent = `
      html body #${S}.open:has(#${R}) {background:#08090B!important;color:#FFF!important}
      html body #${S}:has(#${R}) .mana-v83-head {display:none!important}
      html body #${S}:has(#${R}) .mana-v83-shell {width:min(100%,960px)!important;max-width:960px!important}
      html body #${S}:has(#${R}) #${C} {display:flex!important;flex-direction:column!important;align-items:stretch!important}
      html body #${S}:has(#${R}) #${C}>* {order:0;min-width:0}
      html body #${S}:has(#${R}) #${C}>#${H} {order:-10!important}
      html body #${S} #${H} {width:100%;margin:0 0 13px}
      html body #${S} #${H} .msp-brand {display:flex;align-items:center;gap:12px;min-width:0}
      html body #${S} #${H} .msp-runner {width:76px;height:56px;flex:0 0 76px;background:transparent url("ui/mana-runner-logo.png") center/contain no-repeat}
      html body #${S} #${H} .msp-name {color:#FFF!important;font:900 clamp(34px,5.2vw,53px)/1.05 system-ui,sans-serif;white-space:nowrap;letter-spacing:.015em}
      html body #${S} #${H} .msp-name span {color:#FF7927!important;-webkit-text-fill-color:#FF7927!important}
      html body #${S} #${H} .msp-tag {color:#C1C6CE;font:750 10px/1.25 system-ui,sans-serif;letter-spacing:.12em;margin-top:4px}
      html body #${S} #${H} .msp-back-row {display:flex;justify-content:flex-end;margin:4px 0 10px}
      html body #${S} #${B} {background:#15171B;border:1px solid #697686;border-radius:11px;color:#FFF;min-height:34px;padding:7px 14px;font:850 12px system-ui,sans-serif;cursor:pointer}
      html body #${S} #${R} {width:100%!important;max-width:100%!important;color:#FFF!important}
      html body #${S} #${R} .mana-v993-head h2,
      html body #${S} #${R} .mana-v993-panel h3,
      html body #${S} #${R} .mana-v993-row-title {color:#FFF!important;-webkit-text-fill-color:#FFF!important}
      html body #${S} #${R} .mana-v993-kicker,
      html body #${S} #${R} .mana-v993-panel-kicker {color:#FF7927!important;-webkit-text-fill-color:#FF7927!important}
      html body #${S} #${R} .mana-v993-head p,
      html body #${S} #${R} .mana-v993-metric-sub,
      html body #${S} #${R} .mana-v993-row-sub {color:#C1C6CE!important;-webkit-text-fill-color:#C1C6CE!important}
      html body #${S} #${R} .mana-v993-periods {background:#101216!important;border:1px solid #697686!important;border-radius:14px!important;padding:5px!important}
      html body #${S} #${R} .mana-v993-period,
      html body #${S} #${R} .mana-v993-detail-btn {background:#15171B!important;border:1px solid #697686!important;border-radius:12px!important;color:#C1C6CE!important;-webkit-text-fill-color:#C1C6CE!important;box-shadow:none!important}
      html body #${S} #${R} .mana-v993-period.active,
      html body #${S} #${R} .mana-v993-detail-btn.active {background:#20160F!important;border-color:#FF7927!important;color:#FF7927!important;-webkit-text-fill-color:#FF7927!important}
      /* Every progress box: silver border, orange number and bar. */
      html body #${S} #${R} .mana-v993-metrics .mana-v993-metric,
      html body #${S} #${R} .mana-v993-metrics .mana-v993-metric.mp-water-metric,
      html body #${S} #${R} .mana-v993-metrics .mana-v993-metric.mp-recovery-card,
      html body #${S} #${R} .mana-v993-metrics .mana-v993-metric.mf450-cardio,
      html body #${S} #${R} .mana-v993-metrics .mana-v993-metric.mf450-core {background:#15171B!important;background-image:none!important;border:1px solid #A5ADB7!important;border-color:#A5ADB7!important;border-radius:16px!important;box-shadow:none!important}
      html body #${S} #${R} .mana-v993-metrics .mana-v993-metric .mana-v993-metric-label {color:#C1C6CE!important;-webkit-text-fill-color:#C1C6CE!important}
      html body #${S} #${R} .mana-v993-metrics .mana-v993-metric .mana-v993-metric-value,
      html body #${S} #${R} .mana-v993-metrics .mana-v993-metric .mana-v993-metric-value *,
      html body #${S} #${R} .mana-v993-summary strong,
      html body #${S} #${R} .mana-v993-row-value {color:#FF7927!important;-webkit-text-fill-color:#FF7927!important;text-shadow:none!important}
      html body #${S} #${R} .mana-v993-metrics .mana-v993-metric .mana-v993-track {background:#252B31!important}
      html body #${S} #${R} .mana-v993-metrics .mana-v993-metric .mana-v993-fill,
      html body #${S} #${R} .mana-v993-metrics .mana-v993-metric .mp-water-fill {background:#FF7927!important;background-image:none!important;background-color:#FF7927!important;box-shadow:none!important}
      html body #${S} #${R} .mana-v993-panel {background:#15171B!important;background-image:none!important;border:1px solid #A5ADB7!important;border-radius:19px!important;box-shadow:none!important}
      html body #${S} #${R} .mana-v993-summary {background:#0D0F13!important;border:1px solid #697686!important}
      html body #${S} #${R} .mana-v993-summary span {color:#C1C6CE!important}
      html body #${S} #${R} .mana-v993-exercise-select {background:#0D0F13!important;border:1px solid #697686!important;color:#FFF!important}
      html body #${S} #${R} .mana-v993-row,
      html body #${S} #${R} .mana-v953-history-row {border-color:#697686!important;box-shadow:none!important}
      /* The ORIGINAL graph's container is found by its heading and tagged. */
      html body #${S} #${R} .mana-fixed-graph-104320 {background:#101216!important;border:1px solid #A5ADB7!important;border-radius:16px!important;box-shadow:none!important}
      html body #${S} #${R} .mana-fixed-graph-104320 .mana-fixed-graph-title-104320 {color:#FFF!important;-webkit-text-fill-color:#FFF!important}
      html body #${S} #${R} .mana-fixed-graph-104320 svg path.mana-orange-line-104320,
      html body #${S} #${R} .mana-fixed-graph-104320 svg polyline.mana-orange-line-104320 {stroke:#FF7927!important;filter:none!important}
      html body #${S} #${R} .mana-fixed-graph-104320 svg circle.mana-orange-dot-104320 {stroke:#FF7927!important;fill:#FF7927!important;filter:none!important}
      html body #${S} #${R} #${G} {margin:15px 0 0;padding:14px;border:1px solid #A5ADB7;border-radius:16px;background:#101216}
      html body #${S} #${R} #${G} h4 {margin:0 0 10px;color:#FFF;font:900 15px system-ui,sans-serif}
      html body #${S} #${R} #${G} svg {display:block;width:100%;height:auto;max-height:230px}
      html body #${S}.open:has(#${R}) #manaV83Tabs {background:rgba(8,9,11,.97)!important;border-top:1px solid #464D55!important;box-shadow:none!important}
      html body #${S}.open:has(#${R}) #manaV83Tabs .mana-v83-tab {background:transparent!important;border:1px solid transparent!important;color:#C1C6CE!important;-webkit-text-fill-color:#C1C6CE!important;box-shadow:none!important;text-shadow:none!important}
      html body #${S}.open:has(#${R}) #manaV83Tabs .mana-v83-tab.active {background:#20160F!important;border:1px solid #FF7927!important;border-radius:12px!important;color:#FF7927!important;-webkit-text-fill-color:#FF7927!important;box-shadow:none!important}
      html body #${S}.open:has(#${R}) #manaV83Tabs .mana-v83-tab::before {background:#A5ADB7!important;box-shadow:none!important}
      html body #${S}.open:has(#${R}) #manaV83Tabs .mana-v83-tab.active::before {background:#FF7927!important}
      html body #${S}.open:has(#${R}) #manaV83Tabs .mana-v83-tab img {filter:grayscale(1) brightness(1.7)!important;opacity:.95!important}
      @media(max-width:650px) {
        html body #${S} #${H} .msp-brand {gap:7px}
        html body #${S} #${H} .msp-runner {width:48px;height:40px;flex-basis:48px}
        html body #${S} #${H} .msp-name {font-size:clamp(24px,7vw,35px)!important}
        html body #${S} #${H} .msp-tag {font-size:9px}
      }
    `;
    document.head.appendChild(el);
  }

  function ensureHeader() {
    const holder = document.getElementById(C);
    if (!holder || document.getElementById(H)?.parentElement === holder) return;
    const header = document.createElement("div");
    header.id = H;
    header.innerHTML = `
      <div class="msp-brand"><div class="msp-runner" aria-hidden="true"></div>
        <div><div class="msp-name">MANA <span>MOVEMENT</span></div>
          <div class="msp-tag">TRAINING · MOVE WITH PURPOSE</div></div></div>
      <div class="msp-back-row"><button id="${B}" type="button">⌂ Overview</button></div>`;
    holder.prepend(header);
  }

  function fuelWater() {
    const date = new Date();
    const key = [date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join("-");
    let amount = 0, target = 2300;
    try { amount = Math.max(0,Number(JSON.parse(localStorage.getItem(FUEL)||"{}")?.[key]?.water)||0); } catch (_) {}
    try { target = Math.max(1,Number(JSON.parse(localStorage.getItem(TARGET)||"{}")?.water)||2300); } catch (_) {}
    return {amount,target};
  }

  function isWaterCard(node) {
    return node instanceof Element &&
      node.querySelector(".mana-v993-metric-label")?.textContent?.trim().toUpperCase() === "WATER";
  }

  function ensureWater() {
    const grid = document.querySelector("#"+R+" .mana-v993-metrics");
    if (!grid) return;
    /* Look through ALL cards, not just the old .mana-v993-metric class. */
    const found = [...grid.children].filter(isWaterCard);
    let primary = found.find(card => card.id === W) || found[0];
    if (!primary) {
      primary = document.createElement("div");
      primary.id = W;
      primary.className = "mana-v993-metric mp-water-metric";
      primary.innerHTML = `<div class="mana-v993-metric-label">WATER</div>
        <div class="mana-v993-metric-value"></div>
        <div class="mana-v993-metric-sub"></div>
        <div class="mana-v993-track"><div class="mana-v993-fill mp-water-fill"></div></div>`;
      grid.appendChild(primary);
    }
    /* One original/owned card only. Remove old reappearing clones. */
    found.forEach(card => {if (card !== primary) card.remove();});
    primary.id = W;
    primary.classList.add("mana-v993-metric","mp-water-metric");
    const {amount,target} = fuelWater();
    const value = (amount/1000).toFixed(1)+" L";
    const sub = "Target "+(target/1000).toFixed(1)+" L";
    const fill = Math.min(100,Math.round(amount/target*100))+"%";
    const v = primary.querySelector(".mana-v993-metric-value");
    const t = primary.querySelector(".mana-v993-metric-sub");
    const bar = primary.querySelector(".mana-v993-fill,.mp-water-fill");
    if (v && v.textContent !== value) v.textContent = value;
    if (t && t.textContent !== sub) t.textContent = sub;
    if (bar && bar.style.width !== fill) bar.style.width = fill;
    /* Defeat old inline border/colour settings without touching other cards. */
    primary.style.setProperty("border","1px solid #A5ADB7","important");
    primary.style.setProperty("background","#15171B","important");
    v?.style.setProperty("color","#FF7927","important");
    bar?.style.setProperty("background","#FF7927","important");
  }

  function weightData() {
    try {
      const entries = JSON.parse(localStorage.getItem(WEIGHTS)||"[]");
      return Array.isArray(entries) ? entries.filter(x=>x?.date && Number(x.weight)>0)
        .map(x=>({date:String(x.date),weight:Number(x.weight)}))
        .sort((a,b)=>a.date.localeCompare(b.date)).slice(-30) : [];
    } catch (_) { return []; }
  }

  function fallbackGraph(data) {
    if (!data.length) return '<p style="color:#C1C6CE">No weight check-ins yet.</p>';
    const W=620,H=190,L=45,R=15,T=19,B=30;
    const values=data.map(x=>x.weight), min=Math.min(...values), max=Math.max(...values);
    const pad=Math.max(1,(max-min)*.2),lo=min-pad,hi=max+pad;
    const x=i=>data.length===1?(L+W-R)/2:L+i*(W-L-R)/(data.length-1);
    const y=v=>T+(hi-v)*(H-T-B)/(hi-lo);
    const line=data.map((v,i)=>x(i).toFixed(1)+","+y(v.weight).toFixed(1)).join(" ");
    const dots=data.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v.weight)}" r="3.5" fill="#FF7927"/>`).join("");
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Body weight trend">
      <line x1="${L}" y1="${H-B}" x2="${W-R}" y2="${H-B}" stroke="#697686"/>
      <polyline points="${line}" fill="none" stroke="#FF7927" stroke-width="3"/>${dots}
      <g fill="#C1C6CE" font-family="system-ui" font-size="11">
       <text x="4" y="${T+5}">${hi.toFixed(1)}</text>
       <text x="4" y="${H-B+5}">${lo.toFixed(1)}</text>
       <text x="${L}" y="${H-6}">${data[0].date.slice(5)}</text>
       <text x="${W-R}" y="${H-6}" text-anchor="end">${data[data.length-1].date.slice(5)}</text>
      </g></svg>`;
  }

  function isGreen(stroke) {
    if (!stroke || stroke === "none") return false;
    if (/\bgreen\b|#(?:[0-9a-f]{0,2})?(?:45c783|46c|278b57|20c997|2ecc71)/i.test(stroke)) return true;
    const m=stroke.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
    if (!m) return false;
    const [r,g,b]=m.slice(1).map(Number);
    return g > r*1.22 && g > b*1.10;
  }

  function fixNativeGraph(panel) {
    const nodes=[...panel.querySelectorAll("h1,h2,h3,h4,strong,div,span")];
    const heading=nodes.find(el=>!el.closest("#"+G) && el.children.length===0 && /body\s*weight\s*trend/i.test(el.textContent.trim()));
    if (!heading) return false;
    let wrap=heading.parentElement;
    while (wrap && wrap!==panel && !wrap.querySelector("svg,canvas")) wrap=wrap.parentElement;
    if (!wrap || wrap===panel || !wrap.querySelector("svg,canvas")) return false;
    wrap.classList.add("mana-fixed-graph-104320");
    heading.classList.add("mana-fixed-graph-title-104320");
    wrap.querySelectorAll("svg path,svg polyline,svg line").forEach(shape=>{
      if (isGreen(getComputedStyle(shape).stroke) || isGreen(shape.getAttribute("stroke")||"")) {
        shape.classList.add("mana-orange-line-104320");
        shape.style.setProperty("stroke","#FF7927","important");
      }
    });
    wrap.querySelectorAll("svg circle").forEach(dot=>{
      dot.classList.add("mana-orange-dot-104320");
    });
    return true;
  }

  function ensureGraph() {
    const root=document.getElementById(R);
    if (!root?.querySelector('.mana-v993-detail-btn.active[data-v993-detail="weight"]')) return;
    const panel=root.querySelector("#manaV993Detail .mana-v993-panel");
    if (!panel) return;
    const fallback=panel.querySelector("#"+G);
    if (fixNativeGraph(panel)) { fallback?.remove(); return; }
    let graph=fallback;
    if (!graph) {
      graph=document.createElement("section");graph.id=G;panel.appendChild(graph);
    }
    const data=weightData(),snap=data.map(x=>x.date+":"+x.weight).join("|");
    if (graph.dataset.snapshot!==snap) {
      graph.dataset.snapshot=snap;
      graph.innerHTML="<h4>Body Weight Trend</h4>"+fallbackGraph(data);
    }
  }

  function maintain() {
    if (!active()) return;
    ensureHeader();ensureWater();ensureGraph();
  }
  function schedule() {
    if (queued) return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;maintain();});
  }
  function init() {
    styles();
    const holder=document.getElementById(C);
    if (holder) new MutationObserver(schedule).observe(holder,{childList:true,subtree:true});
    document.addEventListener("click",event=>{
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("#"+B)) {
        document.querySelector('#manaV83Tabs [data-v83-tab="overview"]')?.click();
      } else if (event.target.closest('#manaV83Tabs .mana-v83-tab,[data-v993-period],[data-v993-detail]')) {
        requestAnimationFrame(schedule);
      }
    });
    ["mana:program-tab-change","mana:fuel-updated","mana:recovery-updated","mana:body-weight-updated"]
      .forEach(name=>window.addEventListener(name,schedule));
    window.addEventListener("storage",event=>{
      if ([FUEL,TARGET,WEIGHTS].includes(event.key)) schedule();
    });
    schedule();
    window.MANA_STRENGTH_PROGRESS_DESIGN_BUILD="104320";
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
