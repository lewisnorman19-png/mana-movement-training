
/* MANA MOVEMENT — PROGRESS STABILITY 104340
   Complete replacement for 104330. No saved-data writes.
   One Water card, stable Weight chart, orange/silver styling.
*/
(() => {
  "use strict";
  if (window.MANA_PROGRESS_104340) return;
  window.MANA_PROGRESS_104340 = true;
  const S="manaV83ProgramShell", C="manaV83Content";
  const R="manaV993StrengthProgress", H="manaProgressHeader104340";
  const B="manaProgressBack104340", W="manaProgressWater104340";
  const G="manaProgressGraph104340", CSS_ID="manaProgressCSS104340";
  const FUEL="mana-fuel-v571", TARGET="mana-fuel-v58-targets";
  const WEIGHT="mana-strength-v947-body-weight";
  let queued=false;

  function active() {
    const shell=document.getElementById(S);
    return !!(shell?.classList.contains("open") &&
      shell.querySelector('#manaV83Tabs [data-v83-tab="progress"].active') &&
      shell.querySelector("#"+C+" #"+R));
  }
  function installCSS() {
    if(document.getElementById(CSS_ID))return;
    const style=document.createElement("style");
    style.id=CSS_ID;
    style.textContent=`
      html body #${S}:has(#${R}) .mana-v83-head{display:none!important}
      html body #${S}:has(#${R}) .mana-v83-shell{max-width:960px!important;width:min(960px,100%)!important}
      html body #${S}:has(#${R}) #${C}{display:flex!important;flex-direction:column!important;align-items:stretch!important}
      html body #${S}:has(#${R}) #${C}>*{min-width:0;order:0}
      html body #${S}:has(#${R}) #${C}>#${H}{order:-10!important}
      html body #${S} #${H}{margin:0 0 14px;width:100%}
      html body #${S} #${H} .mp-brand{display:flex;align-items:center;gap:12px}
      html body #${S} #${H} .mp-runner{flex:0 0 76px;width:76px;height:56px;background:url("ui/mana-runner-logo.png") center/contain no-repeat}
      html body #${S} #${H} .mp-name{font:900 clamp(32px,5vw,53px)/1.05 system-ui,sans-serif;color:#fff!important;white-space:nowrap}
      html body #${S} #${H} .mp-name span{color:#FF7927!important;-webkit-text-fill-color:#FF7927!important}
      html body #${S} #${H} .mp-tag{margin-top:4px;color:#C1C6CE;font:750 10px system-ui,sans-serif;letter-spacing:.12em}
      html body #${S} #${H} .mp-back-row{display:flex;justify-content:flex-end;margin:5px 0 10px}
      html body #${S} #${B}{padding:8px 14px;background:#15171B;border:1px solid #697686;border-radius:11px;color:#fff;font-weight:800;cursor:pointer}
      html body #${S} #${R}{width:100%!important;max-width:100%!important;color:#fff!important}
      html body #${S} #${R} .mana-v993-kicker,
      html body #${S} #${R} .mana-v993-panel-kicker{color:#FF7927!important;-webkit-text-fill-color:#FF7927!important}
      html body #${S} #${R} .mana-v993-head h2,
      html body #${S} #${R} .mana-v993-panel h3{color:#fff!important;-webkit-text-fill-color:#fff!important}
      html body #${S} #${R} .mana-v993-periods{background:#101216!important;border:1px solid #697686!important}
      html body #${S} #${R} .mana-v993-period,
      html body #${S} #${R} .mana-v993-detail-nav .mana-v993-detail-btn{background:#15171B!important;border:1px solid #697686!important;border-radius:12px!important;color:#C1C6CE!important;-webkit-text-fill-color:#C1C6CE!important;box-shadow:none!important}
      html body #${S} #${R} .mana-v993-period.active,
      html body #${S} #${R} .mana-v993-detail-nav .mana-v993-detail-btn.active{background:#20160F!important;border:1px solid #FF7927!important;color:#FF7927!important;-webkit-text-fill-color:#FF7927!important}
      html body #${S} #${R} .mana-v993-metrics>.mana-v993-metric,
      html body #${S} #${R} .mana-v993-metrics>[class*="water"]{background:#15171B!important;background-image:none!important;border:1px solid #A5ADB7!important;border-radius:16px!important;box-shadow:none!important}
      html body #${S} #${R} .mana-v993-metrics .mana-v993-metric-label{color:#C1C6CE!important;-webkit-text-fill-color:#C1C6CE!important}
      html body #${S} #${R} .mana-v993-metrics .mana-v993-metric-value,
      html body #${S} #${R} .mana-v993-metrics .mana-v993-metric-value *{color:#FF7927!important;-webkit-text-fill-color:#FF7927!important;text-shadow:none!important}
      html body #${S} #${R} .mana-v993-metrics .mana-v993-track{background:#252B31!important}
      html body #${S} #${R} .mana-v993-metrics .mana-v993-fill,
      html body #${S} #${R} .mana-v993-metrics .mp-water-fill{background:#FF7927!important;background-image:none!important;box-shadow:none!important}
      html body #${S} #${R} .mana-v993-panel{background:#15171B!important;background-image:none!important;border:1px solid #A5ADB7!important;box-shadow:none!important;border-radius:19px!important}
      html body #${S} #${R} .mana-v993-summary{background:#0D0F13!important;border:1px solid #697686!important}
      html body #${S} #${R} .mana-v993-summary strong,
      html body #${S} #${R} .mana-v993-row-value{color:#FF7927!important;-webkit-text-fill-color:#FF7927!important}
      html body #${S} #${R} .mana-v993-row,
      html body #${S} #${R} .mana-v953-history-row{border-color:#697686!important}
      html body #${S} #${R} .mana-v993-exercise-select{background:#0D0F13!important;border:1px solid #697686!important;color:#fff!important}
      html body #${S} #${R} .mp-original-chart-104340,
      html body #${S} #${R} #${G}{margin-top:15px;padding:14px;background:#101216!important;border:1px solid #A5ADB7!important;border-radius:16px!important;box-shadow:none!important}
      html body #${S} #${R} .mp-original-chart-104340 .mp-chart-title-104340,
      html body #${S} #${R} #${G} h4{color:#fff!important;-webkit-text-fill-color:#fff!important}
      html body #${S} #${R} .mp-original-chart-104340 svg .mp-orange-line-104340{stroke:#FF7927!important;filter:none!important}
      html body #${S} #${R} .mp-original-chart-104340 svg .mp-orange-dot-104340{stroke:#FF7927!important;fill:#FF7927!important;filter:none!important}
      html body #${S} #${R} #${G} svg{display:block;width:100%;height:auto;max-height:225px}
      html body #${S}.open:has(#${R}) #manaV83Tabs{background:rgba(8,9,11,.97)!important;border-top:1px solid #464D55!important;box-shadow:none!important}
      html body #${S}.open:has(#${R}) #manaV83Tabs .mana-v83-tab{background:transparent!important;border:1px solid transparent!important;color:#C1C6CE!important;-webkit-text-fill-color:#C1C6CE!important;box-shadow:none!important;text-shadow:none!important}
      html body #${S}.open:has(#${R}) #manaV83Tabs .mana-v83-tab.active{background:#20160F!important;border:1px solid #FF7927!important;border-radius:12px!important;color:#FF7927!important;-webkit-text-fill-color:#FF7927!important}
      html body #${S}.open:has(#${R}) #manaV83Tabs .mana-v83-tab::before{background:#A5ADB7!important;box-shadow:none!important}
      html body #${S}.open:has(#${R}) #manaV83Tabs .mana-v83-tab.active::before{background:#FF7927!important}
      html body #${S}.open:has(#${R}) #manaV83Tabs .mana-v83-tab img{filter:grayscale(1) brightness(1.65)!important;box-shadow:none!important}
      html body #${S}.open:has(#${R}) #manaV83Tabs [data-v83-tab="overview"]:not(.active),
      html body #${S}.open:has(#${R}) #manaV83Tabs [data-v83-tab="overview"]:not(.active) svg,
      html body #${S}.open:has(#${R}) #manaV83Tabs [data-v83-tab="overview"]:not(.active) svg *{color:#C1C6CE!important;stroke:#C1C6CE!important;filter:grayscale(1)!important}
      @media(max-width:650px){
        html body #${S} #${H} .mp-runner{flex-basis:48px;width:48px;height:40px}
        html body #${S} #${H} .mp-name{font-size:clamp(23px,7vw,35px)}
        html body #${S} #${H} .mp-brand{gap:7px}
      }`;
    document.head.appendChild(style);
  }

  function ensureHeader(){
    const holder=document.getElementById(C);
    if(!holder || holder.querySelector("#"+H))return;
    const node=document.createElement("div");
    node.id=H;
    node.innerHTML=`<div class="mp-brand"><div class="mp-runner" aria-hidden="true"></div>
      <div><div class="mp-name">MANA <span>MOVEMENT</span></div>
      <div class="mp-tag">TRAINING · MOVE WITH PURPOSE</div></div></div>
      <div class="mp-back-row"><button id="${B}" type="button">⌂ Overview</button></div>`;
    holder.prepend(node);
  }

  function waterData(){
    const date=new Date();
    const key=[date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),
      String(date.getDate()).padStart(2,"0")].join("-");
    let value=0,target=2300;
    try{value=Math.max(0,Number(JSON.parse(localStorage.getItem(FUEL)||"{}")?.[key]?.water)||0)}catch(_){}
    try{target=Math.max(1,Number(JSON.parse(localStorage.getItem(TARGET)||"{}")?.water)||2300)}catch(_){}
    return {value,target};
  }
  function waterChildren(grid){
    return [...grid.children].filter(card=>{
      const label=card.querySelector(".mana-v993-metric-label,[class*='label']");
      const name=(label?.textContent||"").trim().toUpperCase();
      return name==="WATER" ||
        (/^WATER\b/.test(card.textContent.trim().toUpperCase()) &&
          !/PROTEIN|CALORIES|WORKOUTS/.test(card.textContent.toUpperCase()));
    });
  }
  function ensureWater(){
    const grid=document.querySelector("#"+R+" .mana-v993-metrics");
    if(!grid)return;
    const found=waterChildren(grid);
    let card=found.find(el=>el.id===W)||found[0];
    if(!card){
      card=document.createElement("div");
      card.id=W;
      card.className="mana-v993-metric mp-water-metric";
      card.innerHTML=`<div class="mana-v993-metric-label">WATER</div>
        <div class="mana-v993-metric-value"></div>
        <div class="mana-v993-metric-sub"></div>
        <div class="mana-v993-track"><div class="mana-v993-fill mp-water-fill"></div></div>`;
      grid.appendChild(card);
    }
    found.forEach(el=>{if(el!==card)el.remove()});
    if(card.id!==W)card.id=W;
    card.classList.add("mana-v993-metric","mp-water-metric");
    let val=card.querySelector(".mana-v993-metric-value");
    let sub=card.querySelector(".mana-v993-metric-sub");
    let bar=card.querySelector(".mana-v993-fill,.mp-water-fill");
    if(!val){val=document.createElement("div");val.className="mana-v993-metric-value";card.appendChild(val)}
    if(!sub){sub=document.createElement("div");sub.className="mana-v993-metric-sub";card.appendChild(sub)}
    if(!bar){
      const track=card.querySelector(".mana-v993-track")||document.createElement("div");
      track.classList.add("mana-v993-track");
      if(!track.parentElement)card.appendChild(track);
      bar=document.createElement("div");bar.className="mana-v993-fill mp-water-fill";track.appendChild(bar);
    }
    const {value,target}=waterData();
    const display=(value/1000).toFixed(1)+" L";
    const goal="Target "+(target/1000).toFixed(1)+" L";
    const percent=Math.min(100,Math.round(value/target*100))+"%";
    if(val.textContent!==display)val.textContent=display;
    if(sub.textContent!==goal)sub.textContent=goal;
    if(bar.style.width!==percent)bar.style.width=percent;
    const prop=(el,key,v)=>{if(el?.style.getPropertyValue(key)!==v ||
      el.style.getPropertyPriority(key)!=="important")el?.style.setProperty(key,v,"important")};
    prop(card,"border","1px solid #A5ADB7");
    prop(card,"background","#15171B");
    prop(val,"color","#FF7927");
    prop(bar,"background","#FF7927");
  }

  function weightData(){
    try{
      const items=JSON.parse(localStorage.getItem(WEIGHT)||"[]");
      return Array.isArray(items)?items.filter(x=>x?.date&&Number(x.weight)>0)
        .map(x=>({date:String(x.date),weight:Number(x.weight)}))
        .sort((a,b)=>a.date.localeCompare(b.date)).slice(-30):[];
    }catch(_){return []}
  }
  function fallbackSVG(data){
    if(!data.length)return '<p style="color:#C1C6CE">No body-weight check-ins yet.</p>';
    const w=620,h=190,l=45,r=15,t=19,b=30;
    const v=data.map(x=>x.weight),low=Math.min(...v),high=Math.max(...v);
    const pad=Math.max(1,(high-low)*.2),a=low-pad,z=high+pad;
    const x=i=>data.length===1?(l+w-r)/2:l+i*(w-l-r)/(data.length-1);
    const y=n=>t+(z-n)*(h-t-b)/(z-a);
    const pts=data.map((d,i)=>`${x(i).toFixed(1)},${y(d.weight).toFixed(1)}`).join(" ");
    const dots=data.map((d,i)=>`<circle cx="${x(i)}" cy="${y(d.weight)}" r="3.5" fill="#FF7927"/>`).join("");
    return `<svg role="img" aria-label="Body-weight history" viewBox="0 0 ${w} ${h}">
      <line x1="${l}" x2="${w-r}" y1="${h-b}" y2="${h-b}" stroke="#697686"/>
      <polyline points="${pts}" fill="none" stroke="#FF7927" stroke-width="3"/>${dots}
      <g fill="#C1C6CE" font-size="11" font-family="system-ui">
      <text x="4" y="${t+5}">${z.toFixed(1)}</text>
      <text x="4" y="${h-b+5}">${a.toFixed(1)}</text>
      <text x="${l}" y="${h-6}">${data[0].date.slice(5)}</text>
      <text x="${w-r}" y="${h-6}" text-anchor="end">${data[data.length-1].date.slice(5)}</text>
      </g></svg>`;
  }
  function recolourGraph(panel){
    const title=[...panel.querySelectorAll("h2,h3,h4,strong,div,span")]
      .find(n=>n.children.length===0&&/body\s*weight\s*trend/i.test(n.textContent||""));
    if(!title)return false;
    const svg=[...panel.querySelectorAll("svg")].find(n=>!n.closest("#"+G));
    if(!svg)return false;
    let wrap=title.parentElement;
    while(wrap&&wrap!==panel&&!wrap.contains(svg))wrap=wrap.parentElement;
    if(!wrap||wrap===panel)return false;
    wrap.classList.add("mp-original-chart-104340");
    title.classList.add("mp-chart-title-104340");
    const set=(node,name,value)=>{
      if(node.style.getPropertyValue(name)!==value ||
        node.style.getPropertyPriority(name)!=="important")
        node.style.setProperty(name,value,"important");
    };
    set(wrap,"border","1px solid #A5ADB7");
    set(title,"color","#FFFFFF");
    svg.querySelectorAll("path,polyline").forEach(el=>{
      if(el.getAttribute("fill")==="none"||el.tagName.toLowerCase()==="polyline"||
        /green|#(?:45c783|2ecc71|20c997)/i.test(getComputedStyle(el).stroke)){
        el.classList.add("mp-orange-line-104340");
        set(el,"stroke","#FF7927");
      }
    });
    svg.querySelectorAll("circle").forEach(el=>{
      el.classList.add("mp-orange-dot-104340");
      set(el,"fill","#FF7927");set(el,"stroke","#FF7927");
    });
    return true;
  }
  function ensureChart(){
    const root=document.getElementById(R);
    if(!root?.querySelector('.mana-v993-detail-btn.active[data-v993-detail="weight"]'))return;
    const panel=root.querySelector("#manaV993Detail .mana-v993-panel");
    if(!panel)return;
    const old=panel.querySelector("#"+G);
    if(recolourGraph(panel)){old?.remove();return}
    let graph=old;
    if(!graph){graph=document.createElement("section");graph.id=G;panel.appendChild(graph)}
    const data=weightData(),snapshot=data.map(x=>x.date+":"+x.weight).join("|");
    if(graph.dataset.snapshot!==snapshot){
      graph.dataset.snapshot=snapshot;
      graph.innerHTML="<h4>Body Weight Trend</h4>"+fallbackSVG(data);
    }
  }
  function maintain(){
    if(!active())return;
    ensureHeader();ensureWater();ensureChart();
  }
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;maintain()});
  }
  function init(){
    installCSS();
    const holder=document.getElementById(C);
    if(holder)new MutationObserver(schedule).observe(holder,{childList:true,subtree:true});
    document.addEventListener("click",event=>{
      if(!(event.target instanceof Element))return;
      if(event.target.closest("#"+B))
        document.querySelector('#manaV83Tabs [data-v83-tab="overview"]')?.click();
      else if(event.target.closest('#manaV83Tabs .mana-v83-tab,[data-v993-period],[data-v993-detail]'))
        requestAnimationFrame(schedule);
    });
    ["mana:program-tab-change","mana:fuel-updated","mana:recovery-updated",
      "mana:body-weight-updated"].forEach(name=>window.addEventListener(name,schedule));
    window.addEventListener("storage",e=>{
      if([FUEL,TARGET,WEIGHT].includes(e.key))schedule();
    });
    schedule();
    window.MANA_STRENGTH_PROGRESS_DESIGN_BUILD="104340";
  }
  if(document.readyState==="loading")
    document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
