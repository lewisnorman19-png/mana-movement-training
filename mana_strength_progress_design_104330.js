
/* MANA MOVEMENT — STRENGTH PROGRESS 104330
   COMPLETE REPLACEMENT FOR 104320.
   Single Water card, persistent original weight chart, consistent
   black/orange/white/silver styling. Does not write saved data.
*/
(() => {
  "use strict";
  if (window.MANA_PROGRESS_DESIGN_104330) return;
  window.MANA_PROGRESS_DESIGN_104330 = true;

  const ROOT = "manaV993StrengthProgress";
  const SHELL = "manaV83ProgramShell";
  const CONTENT = "manaV83Content";
  const HEADER = "manaProgressHeader104330";
  const BACK = "manaProgressBack104330";
  const WATER = "manaProgressWater104330";
  const GRAPH = "manaProgressGraph104330";
  const FUEL = "mana-fuel-v571";
  const TARGET = "mana-fuel-v58-targets";
  const WEIGHTS = "mana-strength-v947-body-weight";
  let queued = false;

  function open() {
    const shell = document.getElementById(SHELL);
    return !!(shell?.classList.contains("open") &&
      shell.querySelector('#manaV83Tabs [data-v83-tab="progress"].active') &&
      shell.querySelector("#" + CONTENT + " #" + ROOT));
  }

  function addCSS() {
    if (document.getElementById("manaProgressCSS104330")) return;
    const s = document.createElement("style");
    s.id = "manaProgressCSS104330";
    s.textContent = `
      html body #${SHELL}:has(#${ROOT}) .mana-v83-head {display:none!important}
      html body #${SHELL}:has(#${ROOT}) .mana-v83-shell {max-width:960px!important;width:min(960px,100%)!important}
      html body #${SHELL}:has(#${ROOT}) #${CONTENT} {display:flex!important;flex-direction:column!important;align-items:stretch!important}
      html body #${SHELL}:has(#${ROOT}) #${CONTENT}>* {order:0;min-width:0}
      html body #${SHELL}:has(#${ROOT}) #${CONTENT}>#${HEADER} {order:-10!important}
      #${HEADER} {margin:0 0 14px;width:100%}
      #${HEADER} .mp-brand {display:flex;align-items:center;gap:12px}
      #${HEADER} .mp-runner {width:76px;height:56px;flex:0 0 76px;background:url("ui/mana-runner-logo.png") center/contain no-repeat}
      #${HEADER} .mp-name {font:900 clamp(32px,5vw,53px)/1.05 system-ui,sans-serif;white-space:nowrap;color:#FFFFFF!important}
      #${HEADER} .mp-name span {color:#FF7927!important}
      #${HEADER} .mp-tag {margin-top:4px;color:#C1C6CE;font:750 10px system-ui,sans-serif;letter-spacing:.12em}
      #${HEADER} .mp-back-row {display:flex;justify-content:flex-end;margin:5px 0 10px}
      #${BACK} {padding:8px 14px;background:#15171B;border:1px solid #697686;border-radius:11px;color:#FFFFFF;font-weight:800;cursor:pointer}
      #${ROOT} {width:100%!important;max-width:100%!important;color:#FFFFFF!important}
      #${ROOT} .mana-v993-kicker,#${ROOT} .mana-v993-panel-kicker {color:#FF7927!important}
      #${ROOT} .mana-v993-head h2,#${ROOT} .mana-v993-panel h3 {color:#FFFFFF!important}
      #${ROOT} .mana-v993-periods {background:#101216!important;border:1px solid #697686!important}
      #${ROOT} .mana-v993-period,#${ROOT} .mana-v993-detail-btn {background:#15171B!important;border:1px solid #697686!important;border-radius:12px!important;color:#C1C6CE!important;box-shadow:none!important}
      #${ROOT} .mana-v993-period.active,#${ROOT} .mana-v993-detail-btn.active {background:#20160F!important;border-color:#FF7927!important;color:#FF7927!important}
      html body #${SHELL} #${ROOT} .mana-v993-metrics>.mana-v993-metric,
      html body #${SHELL} #${ROOT} .mana-v993-metrics>.mp-water-metric,
      html body #${SHELL} #${ROOT} .mana-v993-metrics>.mp-recovery-card {background:#15171B!important;background-image:none!important;border:1px solid #A5ADB7!important;border-radius:16px!important;box-shadow:none!important}
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric-label {color:#C1C6CE!important;-webkit-text-fill-color:#C1C6CE!important}
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric-value,
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-metric-value * {color:#FF7927!important;-webkit-text-fill-color:#FF7927!important;text-shadow:none!important}
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-track {background:#252B31!important}
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mana-v993-fill,
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mp-water-fill,
      html body #${SHELL} #${ROOT} .mana-v993-metrics .mp-recovery-card .mana-v993-fill {background:#FF7927!important;background-image:none!important;box-shadow:none!important}
      #${ROOT} .mana-v993-panel {background:#15171B!important;border:1px solid #A5ADB7!important;box-shadow:none!important;border-radius:19px!important}
      #${ROOT} .mana-v993-summary {background:#0D0F13!important;border:1px solid #697686!important}
      #${ROOT} .mana-v993-summary strong,#${ROOT} .mana-v993-row-value {color:#FF7927!important}
      #${ROOT} .mana-v993-row,#${ROOT} .mana-v953-history-row {border-color:#697686!important;box-shadow:none!important}
      #${ROOT} .mp-graph-container-104330,#${ROOT} #${GRAPH} {background:#101216!important;border:1px solid #A5ADB7!important;border-radius:16px!important;box-shadow:none!important;margin-top:15px;padding:14px}
      #${ROOT} .mp-graph-container-104330 .mp-graph-heading-104330,#${ROOT} #${GRAPH} h4 {color:#FFFFFF!important;-webkit-text-fill-color:#FFFFFF!important;margin:0 0 10px}
      #${ROOT} .mp-graph-container-104330 svg path.mp-graph-line-104330,
      #${ROOT} .mp-graph-container-104330 svg polyline.mp-graph-line-104330 {stroke:#FF7927!important;filter:none!important}
      #${ROOT} .mp-graph-container-104330 svg circle.mp-graph-dot-104330 {stroke:#FF7927!important;fill:#FF7927!important;filter:none!important}
      #${ROOT} #${GRAPH} svg {width:100%;max-height:225px;display:block}
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs {background:rgba(8,9,11,.97)!important;border-top:1px solid #464D55!important;box-shadow:none!important}
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab {background:transparent!important;border:1px solid transparent!important;color:#C1C6CE!important;-webkit-text-fill-color:#C1C6CE!important;box-shadow:none!important;text-shadow:none!important}
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab.active {background:#20160F!important;border:1px solid #FF7927!important;border-radius:12px!important;color:#FF7927!important;-webkit-text-fill-color:#FF7927!important}
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab img {filter:grayscale(1) brightness(1.65)!important;box-shadow:none!important}
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab::before {background:#A5ADB7!important;box-shadow:none!important}
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs .mana-v83-tab.active::before {background:#FF7927!important}
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs [data-v83-tab="overview"]:not(.active),
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs [data-v83-tab="overview"]:not(.active) svg,
      html body #${SHELL}.open:has(#${ROOT}) #manaV83Tabs [data-v83-tab="overview"]:not(.active) svg * {color:#C1C6CE!important;stroke:#C1C6CE!important;fill:none!important;filter:none!important}
      @media(max-width:650px){#${HEADER} .mp-runner{width:48px;height:40px;flex-basis:48px}#${HEADER} .mp-name{font-size:clamp(23px,7vw,35px)}#${HEADER} .mp-brand{gap:7px}}
    `;
    document.head.appendChild(s);
  }

  function ensureHeader() {
    const holder = document.getElementById(CONTENT);
    if (!holder || holder.querySelector("#" + HEADER)) return;
    const el = document.createElement("div");
    el.id = HEADER;
    el.innerHTML = `<div class="mp-brand"><div class="mp-runner" aria-hidden="true"></div><div><div class="mp-name">MANA <span>MOVEMENT</span></div><div class="mp-tag">TRAINING · MOVE WITH PURPOSE</div></div></div><div class="mp-back-row"><button id="${BACK}" type="button">⌂ Overview</button></div>`;
    holder.prepend(el);
  }

  function savedWater() {
    const d = new Date();
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    let value=0,target=2300;
    try {value=Math.max(0,Number(JSON.parse(localStorage.getItem(FUEL)||"{}")?.[key]?.water)||0)}catch(_){}
    try {target=Math.max(1,Number(JSON.parse(localStorage.getItem(TARGET)||"{}")?.water)||2300)}catch(_){}
    return {value,target};
  }

  function waterCards(grid) {
    return [...grid.querySelectorAll(".mana-v993-metric, .mp-water-metric")]
      .filter(card => card.querySelector(".mana-v993-metric-label")?.textContent?.trim().toUpperCase()==="WATER");
  }

  function ensureWater() {
    const grid=document.querySelector(`#${ROOT} .mana-v993-metrics`);
    if(!grid)return;
    let cards=waterCards(grid);
    /* Prefer an original existing card: it can already have native data bindings. */
    let card=cards.find(c=>c.id!==WATER)||cards[0];
    if(!card){
      card=document.createElement("div");
      card.id=WATER;
      card.className="mana-v993-metric mp-water-metric";
      card.innerHTML='<div class="mana-v993-metric-label">WATER</div><div class="mana-v993-metric-value"></div><div class="mana-v993-metric-sub"></div><div class="mana-v993-track"><div class="mana-v993-fill mp-water-fill"></div></div>';
      grid.appendChild(card);
    }
    cards.forEach(c=>{if(c!==card)c.remove()});
    card.classList.add("mana-v993-metric","mp-water-metric");
    const {value,target}=savedWater();
    const v=card.querySelector(".mana-v993-metric-value");
    const sub=card.querySelector(".mana-v993-metric-sub");
    let bar=card.querySelector(".mana-v993-fill, .mp-water-fill");
    if(v&&v.textContent!==(value/1000).toFixed(1)+" L")v.textContent=(value/1000).toFixed(1)+" L";
    if(sub&&sub.textContent!==`Target ${(target/1000).toFixed(1)} L`)sub.textContent=`Target ${(target/1000).toFixed(1)} L`;
    if(!bar){const track=card.querySelector(".mana-v993-track");if(track){bar=document.createElement("div");bar.className="mana-v993-fill mp-water-fill";track.appendChild(bar)}}
    if(bar){const width=Math.min(100,Math.round(value/target*100))+"%";if(bar.style.width!==width)bar.style.width=width;bar.style.setProperty("background","#FF7927","important")}
    card.style.setProperty("border","1px solid #A5ADB7","important");
    card.style.setProperty("background","#15171B","important");
    v?.style.setProperty("color","#FF7927","important");
  }

  function readWeights() {
    try {const data=JSON.parse(localStorage.getItem(WEIGHTS)||"[]");return Array.isArray(data)?data.filter(x=>x?.date&&Number(x.weight)>0).map(x=>({date:String(x.date),weight:Number(x.weight)})).sort((a,b)=>a.date.localeCompare(b.date)).slice(-30):[]}catch(_){return []}
  }

  function graphMarkup(data) {
    if(!data.length)return '<p style="color:#C1C6CE">No body-weight check-ins yet.</p>';
    const W=620,H=190,L=45,R=15,T=19,B=30;
    const vals=data.map(d=>d.weight),lo=Math.min(...vals),hi=Math.max(...vals),pad=Math.max(1,(hi-lo)*.2);
    const a=lo-pad,z=hi+pad;
    const x=i=>data.length===1?(L+W-R)/2:L+i*(W-L-R)/(data.length-1);
    const y=v=>T+(z-v)*(H-T-B)/(z-a);
    const line=data.map((d,i)=>`${x(i).toFixed(1)},${y(d.weight).toFixed(1)}`).join(" ");
    const dots=data.map((d,i)=>`<circle cx="${x(i)}" cy="${y(d.weight)}" r="3.5" fill="#FF7927"/>`).join("");
    return `<svg role="img" aria-label="Body-weight trend" viewBox="0 0 ${W} ${H}"><line x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}" stroke="#697686"/><polyline points="${line}" stroke="#FF7927" stroke-width="3" fill="none"/>${dots}<g fill="#C1C6CE" font-size="11" font-family="system-ui"><text x="4" y="${T+5}">${z.toFixed(1)}</text><text x="4" y="${H-B+5}">${a.toFixed(1)}</text><text x="${L}" y="${H-6}">${data[0].date.slice(5)}</text><text x="${W-R}" y="${H-6}" text-anchor="end">${data[data.length-1].date.slice(5)}</text></g></svg>`;
  }

  function ensureGraph() {
    const root=document.getElementById(ROOT);
    const activeWeight=root?.querySelector('.mana-v993-detail-btn.active[data-v993-detail="weight"]');
    const panel=root?.querySelector("#manaV993Detail .mana-v993-panel");
    if(!activeWeight||!panel)return;
    let graph=panel.querySelector("#"+GRAPH);
    const native=[...panel.querySelectorAll("svg")].find(e=>!e.closest("#"+GRAPH));
    if(native){
      graph?.remove();
      const candidates=[...panel.querySelectorAll("h2,h3,h4,strong,span,div")];
      const heading=candidates.find(el=>el.children.length===0&&/body\s*weight\s*trend/i.test(el.textContent||""));
      if(heading){
        heading.classList.add("mp-graph-heading-104330");
        let wrap=heading.parentElement;
        while(wrap&&wrap!==panel&&!wrap.contains(native))wrap=wrap.parentElement;
        if(wrap&&wrap!==panel){wrap.classList.add("mp-graph-container-104330");wrap.style.setProperty("border","1px solid #A5ADB7","important");heading.style.setProperty("color","#FFFFFF","important")}
      }
      native.querySelectorAll("polyline,path").forEach(el=>{el.classList.add("mp-graph-line-104330");el.style.setProperty("stroke","#FF7927","important")});
      native.querySelectorAll("circle").forEach(el=>{el.classList.add("mp-graph-dot-104330");el.style.setProperty("fill","#FF7927","important");el.style.setProperty("stroke","#FF7927","important")});
      return;
    }
    if(!graph){graph=document.createElement("section");graph.id=GRAPH;panel.appendChild(graph)}
    const data=readWeights(),snap=data.map(d=>`${d.date}:${d.weight}`).join("|");
    if(graph.dataset.snapshot!==snap){graph.dataset.snapshot=snap;graph.innerHTML="<h4>Body Weight Trend</h4>"+graphMarkup(data)}
  }

  function maintain(){if(!open())return;ensureHeader();ensureWater();ensureGraph()}
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;maintain()})}

  function init(){
    addCSS();
    const holder=document.getElementById(CONTENT);
    if(holder)new MutationObserver(schedule).observe(holder,{subtree:true,childList:true});
    document.addEventListener("click",e=>{
      if(!(e.target instanceof Element))return;
      if(e.target.closest("#"+BACK))document.querySelector('#manaV83Tabs [data-v83-tab="overview"]')?.click();
      else if(e.target.closest('#manaV83Tabs .mana-v83-tab,[data-v993-period],[data-v993-detail]'))requestAnimationFrame(schedule);
    });
    ["mana:program-tab-change","mana:fuel-updated","mana:recovery-updated","mana:body-weight-updated"].forEach(x=>window.addEventListener(x,schedule));
    window.addEventListener("storage",e=>{if([FUEL,TARGET,WEIGHTS].includes(e.key))schedule()});
    schedule();
    window.MANA_STRENGTH_PROGRESS_DESIGN_BUILD="104330";
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
