/* MANA MOVEMENT TRAINING v9.28.0 — MANA 28 WORKOUT + FUEL UPGRADE */
(() => {
  "use strict";

  const BUILD="92800";
  const STATE_KEY="mana28-v927-state";
  const FUEL_KEY="mana-fuel-v571";
  const TARGET_KEY="mana-fuel-v58-targets";
  const STYLE_ID="mana-v928-style";
  const WORKOUT_ID="manaV928Workout";
  const FUEL_ID="manaV928Fuel";
  let timer=null;

  const WORKOUTS={
    "Foundation Full Body":{note:"A simple full-body foundation session. Move well, leave a couple of reps in reserve and build confidence.",ex:[["Goblet Squat","3 × 10"],["DB Bench Press","3 × 10"],["Seated Row","3 × 10"],["Romanian Deadlift","3 × 10"],["Plank","3 × 30–45 sec"]]},
    "Upper Body + Core":{note:"Controlled upper-body work with a short core finish.",ex:[["DB Bench Press","3 × 8–12"],["Lat Pulldown","3 × 8–12"],["Seated DB Shoulder Press","3 × 10"],["Cable or Machine Row","3 × 10–12"],["Dead Bug","3 × 8 / side"]]},
    "Lower Body + Conditioning":{note:"Build lower-body strength, then finish with easy conditioning.",ex:[["Leg Press or Goblet Squat","3 × 10"],["Romanian Deadlift","3 × 10"],["Supported Split Squat","3 × 8 / side"],["Calf Raise","3 × 12–15"],["Bike or Rower","8–10 min easy/moderate"]]},
    "Recovery + Mobility":{note:"Keep effort easy. The win today is moving, loosening up and recovering.",ex:[["Easy Walk or Bike","20–30 min"],["Hip Mobility","2 × 45 sec / side"],["Thoracic Rotation","2 × 8 / side"],["Hamstring Mobility","2 × 45 sec / side"],["Breathing Reset","3–5 min"]]},
    "Full Body Strength":{note:"A balanced strength day. Use solid technique and progress only when the reps are clean.",ex:[["Leg Press or Squat Pattern","3 × 8–10"],["DB or Machine Press","3 × 8–10"],["Seated Row","3 × 8–12"],["Romanian Deadlift","3 × 8–10"],["Cable or DB Accessory","3 × 10–12"],["Plank","3 rounds"]]},
    "Walk + Core":{note:"Low-stress movement that still keeps momentum moving forward.",ex:[["Purposeful Walk","30 min"],["Dead Bug","3 × 8 / side"],["Bird Dog","3 × 8 / side"],["Side Plank","2 × 20–30 sec / side"]]},
    "Recovery Day":{note:"No hard training required. Recover deliberately and prepare for the next block.",ex:[["Easy Walk","20–30 min"],["Mobility Flow","8–10 min"],["Breathing / Reset","5 min"]]},
    "Upper Body Strength":{note:"Upper-body strength with a push/pull balance and controlled tempo.",ex:[["DB Bench Press","3 × 8–10"],["Lat Pulldown","3 × 8–10"],["Shoulder Press","3 × 8–10"],["Cable Row","3 × 10"],["Biceps Curl","2–3 × 10–12"],["Triceps Pressdown","2–3 × 10–12"]]},
    "Lower Body Strength":{note:"Lower-body strength with a squat pattern, hinge, single-leg work and calves.",ex:[["Leg Press or Squat Pattern","3 × 8–10"],["Romanian Deadlift","3 × 8–10"],["Supported Split Squat","3 × 8 / side"],["Hamstring Curl","3 × 10–12"],["Calf Raise","3 × 12–15"]]},
    "Mobility + Easy Cardio":{note:"Keep your heart rate comfortable and restore movement quality.",ex:[["Easy Bike / Walk","20–25 min"],["Hip Mobility","5 min"],["Upper Back Mobility","5 min"],["Easy Stretch","5 min"]]},
    "Conditioning + Core":{note:"Steady conditioning, not punishment. Finish with controlled core work.",ex:[["Bike / Rower / Incline Walk","20–30 min"],["Plank","3 × 30–45 sec"],["Dead Bug","3 × 8 / side"],["Farmer Carry","3 × 30–40 m"]]},
    "Recovery + Walk":{note:"Keep the body moving while arriving fresh for the final day.",ex:[["Purposeful Walk","30 min"],["Mobility Flow","10 min"],["Breathing Reset","3–5 min"]]},
    "Final Full Body Session":{note:"Finish with quality. Complete the 28 days feeling capable, not destroyed.",ex:[["Leg Press or Squat Pattern","3 × 8–10"],["DB Bench Press","3 × 8–10"],["Seated Row","3 × 8–10"],["Romanian Deadlift","3 × 8–10"],["Shoulder Press","2 × 10"],["Plank","3 rounds"]]}
  };

  const json=(raw,fallback)=>{try{return JSON.parse(raw)}catch(_){return fallback}};
  const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");

  function state(){
    const s=json(localStorage.getItem(STATE_KEY)||"{}",{});
    if(!s.workouts||typeof s.workouts!=="object") s.workouts={};
    if(!s.actions||typeof s.actions!=="object") s.actions={};
    return s;
  }

  function save(s){
    localStorage.setItem(STATE_KEY,JSON.stringify(s));
    window.dispatchEvent(new CustomEvent("mana28:updated"));
  }

  function open(){
    const shell=document.getElementById("manaV83ProgramShell");
    const title=document.getElementById("manaV83Title");
    const tab=document.querySelector("#manaV83Tabs .mana-v83-tab.active");

    return !!(
      shell?.classList.contains("open") &&
      title?.textContent?.trim()?.toUpperCase()==="MANA 28" &&
      tab?.dataset?.v83Tab==="overview"
    );
  }

  function day(){
    const s=state();

    return Math.max(
      1,
      Math.min(
        28,
        Number(
          s.selectedDay ||
          s.currentDay ||
          1
        )
      )
    );
  }

  function cards(){
    return [
      ...document.querySelectorAll(
        "#manaV83Content .mana-v927-card"
      )
    ];
  }

  function todayCard(){
    return cards().find(
      c =>
        c.querySelector(
          ".mana-v927-kicker"
        )?.textContent?.trim()==="TODAY"
    ) || null;
  }

  function actionsCard(){
    return cards().find(
      c =>
        c.querySelector(
          ".mana-v927-kicker"
        )?.textContent?.trim()==="DAILY ACTIONS"
    ) || null;
  }

  function workoutName(){
    return (
      todayCard()
        ?.querySelector(
          ".mana-v927-workout-name"
        )
        ?.textContent
        ?.trim() ||
      "Foundation Full Body"
    );
  }

  function def(){
    return (
      WORKOUTS[workoutName()] ||
      WORKOUTS["Foundation Full Body"]
    );
  }

  function workout(d){
    const s=state();
    const x=s.workouts[String(d)]||{};
    const total=def().ex.length;

    const checks=
      Array.isArray(x.checks)
        ? x.checks.slice(0,total)
        : [];

    while(checks.length<total){
      checks.push(false);
    }

    return {
      startedAt:x.startedAt||null,
      completedAt:x.completedAt||null,
      checks
    };
  }

  function stats(d){
    const w=workout(d);
    const done=w.checks.filter(Boolean).length;
    const total=w.checks.length;

    return {
      done,
      total,
      pct:
        total
          ? Math.round(done/total*100)
          : 0,
      complete:!!w.completedAt
    };
  }

  function fuel(){
    const d=new Date();

    const key=[
      d.getFullYear(),
      String(
        d.getMonth()+1
      ).padStart(2,"0"),
      String(
        d.getDate()
      ).padStart(2,"0")
    ].join("-");

    const all=
      json(
        localStorage.getItem(FUEL_KEY)||"{}",
        {}
      );

    const today=
      all?.[key]||{};

    const out={
      calories:0,
      protein:0,
      water:Number(today.water||0)
    };

    Object.values(
      today.meals||{}
    ).forEach(
      items =>
        (items||[])
          .forEach(
            i=>{
              out.calories+=
                Number(
                  i?.calories||0
                );

              out.protein+=
                Number(
                  i?.protein||0
                );
            }
          )
    );

    return out;
  }

  function targets(){
    const x=
      json(
        localStorage.getItem(TARGET_KEY)||"{}",
        {}
      );

    return {
      protein:
        Number(
          x.protein||0
        ),
      water:
        Number(
          x.water||0
        )
    };
  }

  function markTrainingAction(d,s){
    const card=
      actionsCard();

    if(!card){
      return;
    }

    const buttons=[
      ...card.querySelectorAll(
        "[data-v927-action]"
      )
    ];

    const i=
      buttons.findIndex(
        b =>
          /train|workout|session|movement|walk/i
            .test(
              b.textContent||""
            )
      );

    if(i<0){
      return;
    }

    const list=
      Array.isArray(
        s.actions[String(d)]
      )
        ? s.actions[String(d)].slice()
        : [];

    while(
      list.length<buttons.length
    ){
      list.push(false);
    }

    list[i]=true;

    s.actions[String(d)]=
      list;
  }

  function styles(){
    document
      .getElementById(
        STYLE_ID
      )
      ?.remove();

    const el=
      document.createElement(
        "style"
      );

    el.id=
      STYLE_ID;

    el.textContent=`
      #${WORKOUT_ID},
      #${FUEL_ID}{
        margin-top:12px;
        padding:17px;
        border:1px solid #2d2d2d;
        border-radius:18px;
        background:
          linear-gradient(
            145deg,
            #111,
            #090909
          );
      }

      #${WORKOUT_ID}{
        border-color:#55491d;
        background:
          linear-gradient(
            145deg,
            #151207,
            #090908
          );
      }

      .m928-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:12px;
      }

      .m928-k{
        color:#f3d875;
        font-size:11px;
        font-weight:900;
        letter-spacing:.12em;
      }

      .m928-title{
        margin-top:5px;
        color:#fff;
        font-size:20px;
        font-weight:900;
        line-height:1.15;
      }

      .m928-pill{
        display:inline-flex;
        min-height:28px;
        padding:0 9px;
        align-items:center;
        border:1px solid #4f431b;
        border-radius:999px;
        background:#151207;
        color:#f3d875;
        font-size:9px;
        font-weight:900;
        white-space:nowrap;
      }

      .m928-note{
        margin-top:9px;
        color:#aaa;
        font-size:12px;
        line-height:1.55;
      }

      .m928-prow{
        display:flex;
        justify-content:space-between;
        gap:10px;
        margin-top:12px;
        color:#8c8c8c;
        font-size:10px;
        font-weight:800;
      }

      .m928-track{
        height:9px;
        margin-top:8px;
        overflow:hidden;
        border-radius:999px;
        background:#242424;
      }

      .m928-fill{
        height:100%;
        border-radius:999px;
        background:#f3d875;
      }

      .m928-ex{
        width:100%;
        display:grid;
        grid-template-columns:
          34px
          minmax(0,1fr)
          auto;
        gap:10px;
        align-items:center;
        margin-top:8px;
        padding:11px;
        border:1px solid #2e2e2e;
        border-radius:13px;
        background:#0a0a0a;
        color:#fff;
        text-align:left;
        cursor:pointer;
      }

      .m928-ex.done{
        border-color:#5f5120;
        background:#121006;
      }

      .m928-check{
        width:28px;
        height:28px;
        display:grid;
        place-items:center;
        border:1px solid #555;
        border-radius:50%;
        color:#777;
        font-weight:1000;
      }

      .m928-ex.done
      .m928-check{
        border-color:#f3d875;
        background:#f3d875;
        color:#111;
      }

      .m928-name{
        font-size:12px;
        font-weight:900;
        line-height:1.35;
      }

      .m928-dose{
        color:#d8c672;
        font-size:10px;
        font-weight:900;
        white-space:nowrap;
      }

      .m928-primary,
      .m928-secondary{
        width:100%;
        min-height:50px;
        margin-top:12px;
        border-radius:14px;
        font-size:12px;
        font-weight:900;
        cursor:pointer;
      }

      .m928-primary{
        border:0;
        background:#f3d875;
        color:#111;
      }

      .m928-secondary{
        border:1px solid #4f431b;
        background:#111006;
        color:#f3d875;
      }

      .m928-done{
        margin-top:12px;
        padding:12px;
        border:1px solid #5f5120;
        border-radius:12px;
        background:#151207;
        color:#f3d875;
        font-size:11px;
        font-weight:900;
        text-align:center;
      }

      .m928-fgrid{
        display:grid;
        grid-template-columns:
          repeat(3,1fr);
        gap:8px;
        margin-top:12px;
      }

      .m928-fbox{
        padding:12px;
        border:1px solid #292929;
        border-radius:14px;
        background:#0b0b0b;
      }

      .m928-fbox span{
        display:block;
        color:#888;
        font-size:9px;
        font-weight:900;
      }

      .m928-fbox strong{
        display:block;
        margin-top:5px;
        color:#f3d875;
        font-size:17px;
      }

      .m928-fnote{
        margin-top:10px;
        color:#8c8c8c;
        font-size:10px;
        line-height:1.5;
      }

      @media(max-width:420px){
        .m928-ex{
          grid-template-columns:
            32px
            minmax(0,1fr);
        }

        .m928-dose{
          grid-column:2;
        }

        .m928-fgrid{
          grid-template-columns:1fr;
        }
      }
    `;

    document.head.appendChild(
      el
    );
  }

  function workoutHtml(d){
    const name=
      workoutName();

    const x=
      def();

    const w=
      workout(d);

    const st=
      stats(d);

    return `
      <div id="${WORKOUT_ID}">
        <div class="m928-head">
          <div>
            <div class="m928-k">
              TODAY’S WORKOUT
            </div>

            <div class="m928-title">
              ${esc(name)}
            </div>
          </div>

          <span class="m928-pill">
            ${
              st.complete
                ? "DONE"
                : `${st.done}/${st.total}`
            }
          </span>
        </div>

        <div class="m928-note">
          ${esc(x.note)}
        </div>

        <div class="m928-prow">
          <span>
            ${st.done}
            exercises complete
          </span>

          <span>
            ${st.pct}%
          </span>
        </div>

        <div class="m928-track">
          <div
            class="m928-fill"
            style="width:${st.pct}%"
          ></div>
        </div>

        ${x.ex.map(
          (e,i)=>`
            <button
              type="button"
              class="
                m928-ex
                ${w.checks[i] ? "done" : ""}
              "
              data-m928-ex="${i}"
            >
              <span class="m928-check">
                ${w.checks[i] ? "✓" : ""}
              </span>

              <span class="m928-name">
                ${esc(e[0])}
              </span>

              <span class="m928-dose">
                ${esc(e[1])}
              </span>
            </button>
          `
        ).join("")}

        ${
          st.complete
            ? `
              <div class="m928-done">
                WORKOUT COMPLETE ✓
              </div>
            `
            : `
              <button
                type="button"
                class="m928-primary"
                id="m928WorkoutBtn"
              >
                ${
                  w.startedAt
                    ? "COMPLETE TODAY’S WORKOUT"
                    : "START TODAY’S WORKOUT"
                }
              </button>
            `
        }
      </div>
    `;
  }

  function fuelHtml(){
    const f=
      fuel();

    const t=
      targets();

    return `
      <div id="${FUEL_ID}">
        <div class="m928-head">
          <div>
            <div class="m928-k">
              FUEL SNAPSHOT
            </div>

            <div class="m928-title">
              Today so far
            </div>
          </div>

          <span class="m928-pill">
            LIVE
          </span>
        </div>

        <div class="m928-fgrid">
          <div class="m928-fbox">
            <span>CALORIES</span>
            <strong>
              ${Math.round(f.calories).toLocaleString()}
            </strong>
          </div>

          <div class="m928-fbox">
            <span>PROTEIN</span>
            <strong>
              ${Math.round(f.protein)} g
            </strong>
          </div>

          <div class="m928-fbox">
            <span>WATER</span>
            <strong>
              ${Math.round(f.water)} ml
            </strong>
          </div>
        </div>

        <div class="m928-fnote">
          Protein target:
          ${
            t.protein
              ? `${Math.round(t.protein)} g`
              : "set in Fuel"
          }
          •
          Water target:
          ${
            t.water
              ? `${Math.round(t.water)} ml`
              : "set in Fuel"
          }
        </div>

        <button
          type="button"
          class="m928-secondary"
          id="m928FuelBtn"
        >
          OPEN FUEL →
        </button>
      </div>
    `;
  }

  function wire(d){
    document
      .querySelectorAll(
        "[data-m928-ex]"
      )
      .forEach(
        b =>
          b.addEventListener(
            "click",
            ()=>{
              const s=
                state();

              const w=
                workout(d);

              const i=
                Number(
                  b.dataset.m928Ex
                );

              if(!w.startedAt){
                w.startedAt=
                  new Date()
                    .toISOString();
              }

              w.checks[i]=
                !w.checks[i];

              s.workouts[String(d)]=
                w;

              save(s);

              setTimeout(
                enhance,
                60
              );
            }
          )
      );

    document
      .getElementById(
        "m928WorkoutBtn"
      )
      ?.addEventListener(
        "click",
        ()=>{
          const s=
            state();

          const w=
            workout(d);

          if(!w.startedAt){
            w.startedAt=
              new Date()
                .toISOString();

            s.workouts[String(d)]=
              w;

            save(s);

            setTimeout(
              enhance,
              60
            );

            return;
          }

          w.checks=
            w.checks
              .map(()=>true);

          w.completedAt=
            new Date()
              .toISOString();

          s.workouts[String(d)]=
            w;

          markTrainingAction(
            d,
            s
          );

          save(s);

          setTimeout(
            enhance,
            80
          );
        }
      );

    document
      .getElementById(
        "m928FuelBtn"
      )
      ?.addEventListener(
        "click",
        ()=>{
          document
            .querySelector(
              '#manaV83Tabs [data-v83-tab="fuel"]'
            )
            ?.click();
        }
      );
  }

  function enhance(){
    if(!open()){
      return;
    }

    const today=
      todayCard();

    const actions=
      actionsCard();

    if(
      !today ||
      !actions
    ){
      return;
    }

    const d=
      day();

    today
      .querySelector(
        ".mana-v927-workout"
      )
      ?.remove();

    document
      .getElementById(
        WORKOUT_ID
      )
      ?.remove();

    document
      .getElementById(
        FUEL_ID
      )
      ?.remove();

    actions
      .insertAdjacentHTML(
        "beforebegin",
        workoutHtml(d)
      );

    actions
      .insertAdjacentHTML(
        "afterend",
        fuelHtml()
      );

    wire(d);
  }

  function schedule(
    ms=100
  ){
    clearTimeout(
      timer
    );

    timer=
      setTimeout(
        enhance,
        ms
      );
  }

  function watch(){
    window.addEventListener(
      "mana:program-tab-change",
      ()=>{
        schedule(80);

        setTimeout(
          enhance,
          220
        );
      }
    );

    window.addEventListener(
      "mana28:updated",
      ()=>{
        schedule(100);

        setTimeout(
          enhance,
          260
        );
      }
    );

    window.addEventListener(
      "mana:fuel-updated",
      ()=>{
        schedule(100);
      }
    );

    document.addEventListener(
      "click",
      e=>{
        if(
          e.target.closest(
            "#manaV80Mana28"
          ) ||
          e.target.closest(
            '#manaV83Tabs [data-v83-tab="overview"]'
          )
        ){
          setTimeout(
            enhance,
            140
          );

          setTimeout(
            enhance,
            360
          );
        }
      },
      true
    );

    const o=
      new MutationObserver(
        ()=>{
          if(open()){
            schedule(120);
          }
        }
      );

    o.observe(
      document.body,
      {
        childList:true,
        subtree:true
      }
    );
  }

  function init(){
    styles();

    watch();

    [
      700,
      1300,
      2200
    ].forEach(
      ms =>
        setTimeout(
          enhance,
          ms
        )
    );
  }

  window.MANA28_WORKOUT_BUILD=
    BUILD;

  window.refreshMana28Workout=
    enhance;

  if(
    document.readyState===
    "loading"
  ){
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  }else{
    init();
  }
})();
