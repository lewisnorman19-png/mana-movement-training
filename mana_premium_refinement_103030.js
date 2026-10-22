
/* ===============================================
   MANA MOVEMENT TRAINING
   PREMIUM REFINEMENT v10.30.4
   BUILD 103040

   PRESERVE
   - Home program selection and tick
   - Gold borders and existing text colours
   - Strength / Mana 28 / Lyfe layouts
   - Exercise illustrations
   - Fuel logging and coach functions

   FIX
   - Progress text: gold, white and grey
   - Progress outlines: fine gold
   - Progress bars: Fuel green
   - Selected-history line graph
   - Fuel water shown in litres
   - No content MutationObserver feedback loop
   =============================================== */

(() => {
  "use strict";

  const BUILD = "103040";
  const STYLE_ID = "mana-premium-103030";

  if (window.MANA_PREMIUM_BUILD === BUILD) return;

  const CSS = `
    :root {
      --mp-gold: rgba(212,175,55,.64);
      --mp-text: #f3d875;
      --mp-green: #45c783;
      --mp-white: #f5f5f5;
      --mp-grey: #a6a6a6;
    }

    /* ========================================
       HOME - RETAIN REFINEMENTS
       ======================================== */

    #manaV80Home .mana-v8013-program,
    #manaV80Home [data-program] {
      border-color: var(--mp-gold) !important;
      border-width: 1px !important;
    }

    #manaV80Home .mana-v8013-program h2 {
      font-size: clamp(23px,5vw,30px) !important;
      line-height: 1.14 !important;
      letter-spacing: -.025em;
    }

    #manaV80Home .mana-v8013-program-label {
      font-size: 12px !important;
    }

    #manaV80Home [data-program] {
      position: relative;
    }

    #manaV80Home [data-program].current {
      border: 1px solid var(--mp-gold) !important;
      box-shadow:
        0 0 0 1px rgba(212,175,55,.08),
        0 10px 25px rgba(0,0,0,.2) !important;
    }

    #manaV80Home [data-program].current::after {
      content: "✓";
      position: absolute;
      top: 11px;
      right: 12px;
      z-index: 8;
      width: 25px;
      height: 25px;
      display: grid;
      place-items: center;
      border: 1px solid var(--mp-gold);
      border-radius: 50%;
      background: #173d28;
      color: #fff;
      font-size: 16px;
      font-weight: 900;
      pointer-events: none;
    }

    /* ========================================
       SELECT YOUR PLAN
       ======================================== */

    #manaV98Membership .mana-v981-plan,
    #manaV98Membership .mana-v981-button {
      border-color: var(--mp-gold) !important;
      border-width: 1px !important;
    }

    #manaV98Membership .mana-v981-plan {
      box-shadow: none !important;
    }

    /* ========================================
       WORKOUTS
       ======================================== */

    #manaV83Content .mana-v85-day,
    #manaV83Content .mana-v85-exercise,
    #manaV83Content .mana-v980-day,
    #manaV83Content .mana-v980-workout,
    #manaV83Content .mana-v980-exercises,
    #manaV83Content .mana-v980-exercise,
    #manaV64Exercises .mana-v64-card,
    #manaV64Exercises .mana-v970-action,
    #manaV64Exercises .mana-v970-disclosure {
      border-color: var(--mp-gold) !important;
      border-width: 1px !important;
    }

    #manaV83Content .mana-v85-exercise img,
    #manaV83Content .mana-v980-exercise img,
    #manaV64Exercises .mana-v64-card img {
      object-fit: contain;
      max-width: 100%;
    }

    /* ========================================
       FUEL - READABILITY
       ======================================== */

    .m1022-target {
      border: 1px solid var(--mp-gold) !important;
      min-width: 0;
    }

    .m1022-target-label {
      font-size: 11px !important;
      color: #d8d8d8 !important;
      letter-spacing: .055em;
    }

    .m1022-target-value {
      font-size: clamp(17px,4.5vw,23px) !important;
      font-weight: 900 !important;
      line-height: 1.3 !important;
      white-space: normal !important;
      font-variant-numeric: tabular-nums;
    }

    .m1022-target-value span {
      font-size: 12px !important;
      color: #aaa !important;
    }

    .m1022-control-row button {
      border-color: var(--mp-gold) !important;
    }

    /* ========================================
       GREEN FUEL BARS
       ======================================== */

    .m1022-target.calories .m1022-bar span,
    .m1022-target.protein .m1022-bar span {
      background: linear-gradient(
        90deg,#278b57,#45c783
      ) !important;
    }

    /* ========================================
       PROGRESS - NO PURPLE BORDERS
       ======================================== */

    #manaV993StrengthProgress .mana-v993-periods,
    #manaV993StrengthProgress .mana-v993-period,
    #manaV993StrengthProgress .mana-v993-metric,
    #manaV993StrengthProgress .mana-v993-detail-btn,
    #manaV993StrengthProgress .mana-v993-panel,
    #manaV993StrengthProgress .mana-v993-summary,
    #manaV993StrengthProgress .mana-v993-row,
    #manaV993StrengthProgress .mana-v993-exercise-select,
    #manaV83Content .mana-v981-periods,
    #manaV83Content .mana-v981-period,
    #manaV83Content .mana-v981-overall,
    #manaV83Content .mana-v981-card,
    #manaV83Content .mana-v939-range,
    #manaV83Content .mana-v939-card,
    #manaV83Content .mana-v939-stat,
    #manaV83Content .mana-v939-insight {
      border: 1px solid var(--mp-gold) !important;
    }

    /* ========================================
       PROGRESS - RESTORE TEXT
       ======================================== */

    #manaV993StrengthProgress .mana-v993-period,
    #manaV993StrengthProgress .mana-v993-detail-btn,
    #manaV993StrengthProgress .mana-v993-kicker,
    #manaV993StrengthProgress .mana-v993-panel-kicker,
    #manaV993StrengthProgress .mana-v993-metric-label,
    #manaV993StrengthProgress .mana-v993-row-title,
    #manaV993StrengthProgress .mana-v993-summary span {
      color: var(--mp-text) !important;
    }

    #manaV993StrengthProgress .mana-v993-metric-value,
    #manaV993StrengthProgress .mana-v993-row-value,
    #manaV993StrengthProgress .mana-v993-summary strong {
      color: var(--mp-text) !important;
    }

    #manaV993StrengthProgress .mana-v993-metric-sub,
    #manaV993StrengthProgress .mana-v993-row-sub {
      color: var(--mp-grey) !important;
    }

    #manaV993StrengthProgress .mana-v993-head h2,
    #manaV993StrengthProgress .mana-v993-panel h3 {
      color: var(--mp-white) !important;
    }

    /* ========================================
       ALL PROGRESS FILL BARS GREEN
       ======================================== */

    #manaV993StrengthProgress .mana-v993-fill,
    #manaV83Content .mana-v981-fill,
    #manaV83Content .mana-v981-bar,
    #manaV83Content .mana-v939-fill,
    #manaV83Content .mana-v939-mood-bar span {
      background: linear-gradient(
        90deg,#278b57,#45c783
      ) !important;
    }

    /* Green on active progress indicator */

    #manaV993StrengthProgress .mana-v993-period.active,
    #manaV993StrengthProgress .mana-v993-detail-btn.active {
      border-color: var(--mp-gold) !important;
      color: var(--mp-text) !important;
    }

    /* ========================================
       WATER METRIC
       ======================================== */

    .mp-water-metric {
      border: 1px solid var(--mp-gold);
      border-radius: 15px;
      background: #0b0b0b;
      padding: 12px;
      min-width: 0;
      text-align: center;
    }

    .mp-water-label {
      font-size: 11px;
      font-weight: 850;
      color: var(--mp-grey);
    }

    .mp-water-value {
      display: block;
      margin: 7px 0 4px;
      font-size: 21px;
      font-weight: 900;
      color: var(--mp-text);
    }

    .mp-water-detail {
      color: var(--mp-grey);
      font-size: 10px;
    }

    .mp-water-track {
      height: 6px;
      margin-top: 12px;
      overflow: hidden;
      border-radius: 20px;
      background: #292929;
    }

    .mp-water-fill {
      height: 100%;
      background: linear-gradient(
        90deg,#278b57,#45c783
      );
    }

    /* ========================================
       HISTORY LINE GRAPH
       ======================================== */

    .mp-history-chart {
      margin-top: 18px;
      padding: 15px;
      border: 1px solid var(--mp-gold);
      border-radius: 17px;
      background: #0c0c0c;
    }

    .mp-history-chart h4 {
      color: var(--mp-text);
      font-size: 14px;
      margin: 0 0 5px;
    }

    .mp-history-caption {
      color: var(--mp-grey);
      font-size: 11px;
      margin-bottom: 12px;
      line-height: 1.5;
    }

    .mp-history-chart svg {
      display: block;
      width: 100%;
      height: auto;
      overflow: visible;
    }

    .mp-history-empty {
      color: var(--mp-grey);
      text-align: center;
      padding: 25px 10px;
      font-size: 12px;
    }

    /* ========================================
       NEXT BLOCK BUTTON
       ======================================== */

    #manaV1017ProgramBlock .m1017-request-btn {
      background: #164b30 !important;
      color: #fff !important;
      border: 1px solid #55d98b !important;
    }

    @media(max-width:600px) {
      .m1022-target-label {
        font-size: 10px !important;
      }
      .m1022-target-value {
        font-size: 18px !important;
      }
      .mp-history-chart {
        padding: 12px;
      }
    }
  `;

  function installStyles() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    if (style.textContent !== CSS) {
      style.textContent = CSS;
    }
  }

  /* ==========================================
     HELPERS
     ========================================== */

  function readJSON(key, fallback) {
    try {
      return JSON.parse(
        localStorage.getItem(key) || "null"
      ) ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  function litres(ml) {
    return (Math.max(0,Number(ml)||0)/1000)
      .toFixed(2)
      .replace(/0+$/,"")
      .replace(/\.$/,"");
  }

  function todayKey() {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth()+1).padStart(2,"0"),
      String(d.getDate()).padStart(2,"0")
    ].join("-");
  }

  function waterData() {
    const fuel = readJSON("mana-fuel-v571",{});
    const targets = readJSON(
      "mana-fuel-v58-targets",{}
    );

    return {
      current: Math.max(
        0,Number(fuel[todayKey()]?.water)||0
      ),
      target: Math.max(
        1,Number(targets.water)||2300
      )
    };
  }

  /* ==========================================
     FUEL WATER DISPLAY
     NO REWRITING UNCHANGED VALUES
     ========================================== */

  function updateFuelWater() {
    document.querySelectorAll(
      ".m1022-target.water .m1022-target-value"
    ).forEach(node => {
      const raw = node.textContent || "";

      const match = raw.match(
        /([\d,.]+)\s*ml\s*\/\s*([\d,.]+)\s*ml/i
      );

      if (!match) return;

      const current = Number(
        match[1].replace(/,/g,"")
      );

      const target = Number(
        match[2].replace(/,/g,"")
      );

      if (!Number.isFinite(current) ||
          !Number.isFinite(target)) return;

      const desired =
        litres(current)+" L / "+litres(target)+" L";

      if (node.dataset.mpLitres === desired) return;

      node.dataset.mpLitres = desired;

      node.replaceChildren(
        document.createTextNode(
          litres(current)+" L "
        )
      );

      const span = document.createElement("span");
      span.textContent =
        "/ "+litres(target)+" L";

      node.appendChild(span);
    });
  }

  /* ==========================================
     LINKED PROGRESS WATER METRIC
     ========================================== */

  function updateProgressWater() {
    const root = document.getElementById(
      "manaV993StrengthProgress"
    );

    if (!root) return;

    const metrics = root.querySelector(
      ".mana-v993-metrics"
    );

    if (!metrics) return;

    let tile = root.querySelector(
      "#mana103030Water"
    );

    if (!tile) {
      tile = document.createElement("div");
      tile.id = "mana103030Water";
      tile.className = "mp-water-metric";

      tile.innerHTML = `
        <div class="mp-water-label">WATER</div>
        <strong class="mp-water-value"></strong>
        <div class="mp-water-detail"></div>
        <div class="mp-water-track">
          <div class="mp-water-fill"></div>
        </div>
      `;

      metrics.appendChild(tile);
    }

    const {current,target} = waterData();

    const value = litres(current)+" L";
    const detail = "Target "+litres(target)+" L";
    const percent = Math.min(
      100,current/target*100
    )+"%";

    const valueNode =
      tile.querySelector(".mp-water-value");
    const detailNode =
      tile.querySelector(".mp-water-detail");
    const fillNode =
      tile.querySelector(".mp-water-fill");

    if (valueNode.textContent !== value) {
      valueNode.textContent = value;
    }
    if (detailNode.textContent !== detail) {
      detailNode.textContent = detail;
    }
    if (fillNode.style.width !== percent) {
      fillNode.style.width = percent;
    }
  }

  function renameRecovery() {
    const root = document.getElementById(
      "manaV993StrengthProgress"
    );
    if (!root) return;

    root.querySelectorAll(
      ".mana-v993-metric-label"
    ).forEach(node => {
      if (node.textContent.trim().toUpperCase()
          === "REST") {
        node.textContent = "RECOVERY";
      }
    });
  }

  /* ==========================================
     HISTORY DATA
     ========================================== */

  function weightHistory() {
    const entries = readJSON(
      "mana-strength-v947-body-weight",[]
    );

    if (!Array.isArray(entries)) return [];

    return entries
      .filter(x =>
        x?.date &&
        Number.isFinite(Number(x.weight)) &&
        Number(x.weight)>0
      )
      .map(x=>({
        date:String(x.date).slice(0,10),
        value:Number(x.weight)
      }))
      .sort((a,b)=>a.date.localeCompare(b.date));
  }

  function workoutLogs() {
    const logs = readJSON(
      "mana-strength-v64-logs",[]
    );
    return Array.isArray(logs)?logs:[];
  }

  function logDay(log) {
    const raw =
      log?.date ||
      log?.completedAt ||
      log?.completed_at ||
      log?.timestamp ||
      log?.createdAt ||
      log?.created_at;

    if (!raw) return "";

    const d = new Date(raw);
    return Number.isNaN(d.getTime())
      ? ""
      : d.toISOString().slice(0,10);
  }

  function exerciseHistory(name) {
    if (!name) return [];

    const result = [];

    workoutLogs().forEach(log=>{
      const date=logDay(log);
      if (!date) return;

      (log.exercises||[]).forEach(ex=>{
        if (
          String(ex.name||"").trim().toLowerCase()
          !== name.trim().toLowerCase()
        ) return;

        const weights=(ex.sets||[])
          .filter(set =>
            set.done ||
            Number(set.weight)>0 ||
            Number(set.reps)>0
          )
          .map(set=>Number(set.weight))
          .filter(v=>Number.isFinite(v)&&v>=0);

        if (!weights.length) return;

        result.push({
          date,
          value:Math.max(...weights)
        });
      });
    });

    return result.sort((a,b)=>
      a.date.localeCompare(b.date)
    );
  }

  function workoutHistory() {
    const counts = new Map();

    workoutLogs().forEach(log=>{
      const date=logDay(log);
      if (!date) return;
      counts.set(date,(counts.get(date)||0)+1);
    });

    let total=0;

    return [...counts.entries()]
      .sort((a,b)=>a[0].localeCompare(b[0]))
      .map(([date,count])=>({
        date,
        value:(total+=count)
      }));
  }

  function bestHistory() {
    const bestByExercise = new Map();

    workoutLogs().forEach(log=>{
      (log.exercises||[]).forEach(ex=>{
        const name=String(ex.name||"").trim();
        if (!name) return;

        (ex.sets||[]).forEach(set=>{
          const weight=Number(set.weight)||0;
          const reps=Number(set.reps)||0;
          if (weight<=0) return;

          const estimated1RM =
            reps>0 ? weight*(1+reps/30) : weight;

          bestByExercise.set(
            name,
            Math.max(
              bestByExercise.get(name)||0,
              estimated1RM
            )
          );
        });
      });
    });

    return [...bestByExercise.entries()]
      .sort((a,b)=>b[1]-a[1])
      .slice(0,12)
      .map(([name,value],index)=>({
        date:String(index+1),
        label:name,
        value
      }));
  }

  /* ==========================================
     SVG HISTORY LINE GRAPH
     ========================================== */

  const NS="http://www.w3.org/2000/svg";

  function svgElement(tag,attrs={}) {
    const el=document.createElementNS(NS,tag);
    Object.entries(attrs).forEach(([key,value])=>
      el.setAttribute(key,String(value))
    );
    return el;
  }

  function renderGraph(container,points,unit) {
    container.replaceChildren();

    if (points.length<2) {
      const empty=document.createElement("div");
      empty.className="mp-history-empty";
      empty.textContent =
        "Add at least two history entries to see your trend.";
      container.appendChild(empty);
      return;
    }

    const data=points.slice(-30);

    const width=560;
    const height=230;
    const left=46;
    const right=12;
    const top=20;
    const bottom=38;
    const plotW=width-left-right;
    const plotH=height-top-bottom;

    let min=Math.min(...data.map(p=>p.value));
    let max=Math.max(...data.map(p=>p.value));

    const padding=Math.max((max-min)*.15,.5);
    min-=padding;
    max+=padding;

    const x=i=>left+(i/(data.length-1))*plotW;
    const y=v=>top+(1-(v-min)/(max-min))*plotH;

    const svg=svgElement("svg",{
      viewBox:`0 0 ${width} ${height}`,
      role:"img",
      "aria-label":"Recorded progress history line graph"
    });

    for(let i=0;i<=4;i++) {
      const value=min+(max-min)*(1-i/4);
      const yy=top+(i/4)*plotH;

      svg.appendChild(svgElement("line",{
        x1:left,y1:yy,
        x2:width-right,y2:yy,
        stroke:"#32302a",
        "stroke-width":1
      }));

      const label=svgElement("text",{
        x:left-7,y:yy+4,
        fill:"#aaa",
        "font-size":11,
        "text-anchor":"end"
      });
      label.textContent=value.toFixed(1);
      svg.appendChild(label);
    }

    const path=data.map((point,i)=>
      `${i===0?"M":"L"} ${x(i)} ${y(point.value)}`
    ).join(" ");

    svg.appendChild(svgElement("path",{
      d:path,
      fill:"none",
      stroke:"#45c783",
      "stroke-width":3,
      "stroke-linejoin":"round",
      "stroke-linecap":"round"
    }));

    data.forEach((point,i)=>{
      const circle=svgElement("circle",{
        cx:x(i),cy:y(point.value),r:3.5,
        fill:"#f3d875",
        stroke:"#45c783",
        "stroke-width":1.5
      });

      const tooltip=svgElement("title");
      tooltip.textContent=
        `${point.label||point.date}: `+
        `${point.value.toFixed(1)} ${unit}`;

      circle.appendChild(tooltip);
      svg.appendChild(circle);
    });

    const labels=[
      [0,data[0].date],
      [data.length-1,data[data.length-1].date]
    ];

    labels.forEach(([i,label])=>{
      const text=svgElement("text",{
        x:x(i),
        y:height-12,
        fill:"#aaa",
        "font-size":11,
        "text-anchor":
          i===0?"start":"end"
      });

      text.textContent=label;
      svg.appendChild(text);
    });

    container.appendChild(svg);
  }

  /* ==========================================
     GRAPH MATCHES SELECTED HISTORY
     ========================================== */

  function updateHistoryGraph() {
    const root=document.getElementById(
      "manaV993StrengthProgress"
    );
    if (!root) return;

    const panel=root.querySelector(
      "#manaV993Detail .mana-v993-panel"
    );
    if (!panel) return;

    const active=root.querySelector(
      ".mana-v993-detail-btn.active"
    );

    const selected =
      active?.dataset.v993Detail || "weight";

    let points=[];
    let title="";
    let unit="";

    if(selected==="weight") {
      points=weightHistory();
      title="Body Weight Trend";
      unit="kg";
    } else if(selected==="exercise") {
      const selector=root.querySelector(
        "#manaV993ExerciseSelect"
      );
      const name=selector?.value||"";
      points=exerciseHistory(name);
      title=name ? name+" — Best Load" :
        "Exercise Load Trend";
      unit="kg";
    } else if(selected==="pbs") {
      points=bestHistory();
      title="Personal Bests — Estimated 1RM";
      unit="kg";
    } else if(selected==="workouts") {
      points=workoutHistory();
      title="Workouts Completed Over Time";
      unit="sessions";
    } else {
      return;
    }

    let chart=panel.querySelector(
      "#mana103040HistoryChart"
    );

    if(!chart) {
      chart=document.createElement("section");
      chart.id="mana103040HistoryChart";
      chart.className="mp-history-chart";

      chart.innerHTML=`
        <h4></h4>
        <div class="mp-history-caption"></div>
        <div class="mp-history-plot"></div>
      `;
      panel.appendChild(chart);
    }

    const signature=JSON.stringify({
      selected,title,points
    });

    if(chart.dataset.signature===signature) return;

    chart.dataset.signature=signature;

    chart.querySelector("h4").textContent=title;

    chart.querySelector(
      ".mp-history-caption"
    ).textContent=
      "Recorded history • green trend line • " +
      "gold data points";

    renderGraph(
      chart.querySelector(".mp-history-plot"),
      points,unit
    );
  }

  /* ==========================================
     REFRESH WITHOUT FUEL OBSERVER LOOP
     ========================================== */

  function refresh() {
    updateFuelWater();
    updateProgressWater();
    renameRecovery();
    updateHistoryGraph();
  }

  let pending=false;

  function scheduleRefresh() {
    if(pending) return;
    pending=true;

    requestAnimationFrame(()=>{
      pending=false;
      refresh();
    });
  }

  function refreshAfterNavigation() {
    scheduleRefresh();

    /* One delayed check for asynchronously
       rendered tabs, not a repeating loop. */

    setTimeout(scheduleRefresh,180);
  }

  function init() {
    installStyles();
    refresh();

    [
      "mana:fuel-updated",
      "mana:program-tab-change",
      "mana:program-change",
      "mana:workout-progress-change"
    ].forEach(name=>{
      document.addEventListener(
        name,refreshAfterNavigation
      );
      window.addEventListener(
        name,refreshAfterNavigation
      );
    });

    document.addEventListener("click",event=>{
      if(!(event.target instanceof Element)) return;

      if(event.target.closest(
        [
          "[data-v83-tab]",
          "[data-v993-period]",
          "[data-v993-detail]",
          "[data-m1022-water]"
        ].join(",")
      )) {
        refreshAfterNavigation();
      }
    });

    document.addEventListener("change",event=>{
      if(event.target?.id==="manaV993ExerciseSelect") {
        refreshAfterNavigation();
      }
    });

    window.addEventListener(
      "pageshow",refreshAfterNavigation
    );

    /* No MutationObserver.
       No Fuel DOM rewrite feedback loop.
       No repeating interval. */

    window.MANA_PREMIUM_BUILD=BUILD;
    window.refreshManaPremium=refreshAfterNavigation;

    console.log(
      "MANA PREMIUM REFINEMENT",BUILD
    );
  }

  if(document.readyState==="loading") {
    document.addEventListener(
      "DOMContentLoaded",init,{once:true}
    );
  } else {
    init();
  }
})();
