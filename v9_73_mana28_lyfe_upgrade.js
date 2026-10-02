/* =========================================
   MANA MOVEMENT TRAINING v9.73.0
   MANA 28 + MANA LYFE EXPERIENCE

   MANA 28
   - CLEAN OVERVIEW
   - 28 DAYS UNLOCKED
   - STRENGTH / CARDIO / MOBILITY
   - SWIPEABLE DAY PROGRAM
   - SIMPLE GUIDED WORKOUT

   MANA LYFE
   - CLEAN OVERVIEW
   - 28 DAY MOVEMENT + MINDSET PROGRAM
   - SIMPLE STRENGTH
   - WALKING / CARDIO
   - MOBILITY
   - JOURNAL / RESET ACTIONS

   SAME DESIGN LANGUAGE AS MANA STRENGTH
   WITHOUT THE EXTRA DETAIL
   ========================================= */

(() => {
  "use strict";

  const BUILD = "97300";

  const STYLE_ID =
    "mana-v973-program-style";

  const MODAL_ID =
    "manaV973Workout";

  const M28_KEY =
    "mana-v973-mana28-state";

  const LYFE_KEY =
    "mana-v973-lyfe-state";


  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(raw, fallback) {

    try {

      return JSON.parse(raw);

    } catch (_) {

      return fallback;

    }
  }


  function loadState(key) {

    const state =
      safeJson(
        localStorage.getItem(key) || "{}",
        {}
      );


    if (
      !Array.isArray(
        state.completed
      )
    ) {

      state.completed = [];

    }


    return state;
  }


  function saveState(
    key,
    state
  ) {

    localStorage.setItem(
      key,
      JSON.stringify(state)
    );


    window.dispatchEvent(
      new CustomEvent(
        "mana:v973-updated"
      )
    );
  }


  function shellOpen() {

    return Boolean(
      document
        .getElementById(
          "manaV83ProgramShell"
        )
        ?.classList
        .contains("open")
    );
  }


  function programTitle() {

    return (
      document
        .getElementById(
          "manaV83Title"
        )
        ?.textContent
        ?.trim()
        ?.toUpperCase() ||
      ""
    );
  }


  function activeTab() {

    return (
      document
        .querySelector(
          "#manaV83Tabs " +
          ".mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab ||
      ""
    );
  }


  function content() {

    return document
      .getElementById(
        "manaV83Content"
      );
  }


  function esc(value) {

    return String(
      value ?? ""
    )
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }


  /* =========================================
     MANA 28 PROGRAM
     ========================================= */

  const MANA28 = [

    {
      title:"Full Body Strength",
      type:"Strength",
      tasks:[
        ["Goblet Squat","3 × 10"],
        ["DB / Machine Chest Press","3 × 10"],
        ["Seated Row","3 × 10"],
        ["Romanian Deadlift","3 × 10"],
        ["Plank","3 × 30–45 sec"]
      ]
    },

    {
      title:"Treadmill Cardio",
      type:"Cardio",
      tasks:[
        ["Warm-up Walk","5 min"],
        ["Treadmill","20 min moderate"],
        ["Incline Walk","5 min"],
        ["Cool-down","5 min"]
      ]
    },

    {
      title:"Lower Body Strength",
      type:"Strength",
      tasks:[
        ["Leg Press / Squat","3 × 10"],
        ["Romanian Deadlift","3 × 10"],
        ["Split Squat","3 × 8 each"],
        ["Hamstring Curl","3 × 12"],
        ["Calf Raise","3 × 15"]
      ]
    },

    {
      title:"Walk + Mobility",
      type:"Recovery",
      tasks:[
        ["Purposeful Walk","30 min"],
        ["Hip Mobility","5 min"],
        ["Thoracic Rotation","2 × 8 each"],
        ["Breathing Reset","5 min"]
      ]
    },

    {
      title:"Upper Body + Core",
      type:"Strength",
      tasks:[
        ["Chest Press","3 × 10"],
        ["Lat Pulldown","3 × 10"],
        ["Shoulder Press","3 × 10"],
        ["Cable Row","3 × 10"],
        ["Dead Bug","3 × 8 each"]
      ]
    },

    {
      title:"Bike Intervals",
      type:"Cardio",
      tasks:[
        ["Easy Bike","5 min"],
        ["Bike Intervals","8 × 30 sec strong"],
        ["Easy Recovery","60 sec between"],
        ["Easy Bike","5 min"]
      ]
    },

    {
      title:"Recovery Reset",
      type:"Recovery",
      tasks:[
        ["Easy Walk","20–30 min"],
        ["Mobility Flow","10 min"],
        ["Breathing Reset","5 min"]
      ]
    }

  ];


  function mana28Day(day) {

    const week =
      Math.floor(
        (day - 1) / 7
      );


    const base =
      MANA28[
        (day - 1) % 7
      ];


    const progression =
      week === 0
        ? ""
        : week === 1
          ? " • Build"
          : week === 2
            ? " • Progress"
            : " • Finish Strong";


    return {
      ...base,
      title:
        base.title +
        progression
    };
  }


  /* =========================================
     MANA LYFE PROGRAM
     ========================================= */

  const LYFE = [

    {
      title:"Reset & Move",
      type:"Movement",
      tasks:[
        ["Bodyweight Squat","3 × 12"],
        ["Push-up / Wall Push-up","3 × 10"],
        ["Band / Cable Row","3 × 12"],
        ["Walk","20 min"],
        ["Mana Lyfe Journal","Complete today's reflection"]
      ]
    },

    {
      title:"Walk & Reflect",
      type:"Mindset",
      tasks:[
        ["Purposeful Walk","30 min"],
        ["Breathing Reset","5 min"],
        ["Journal","What do I need to let go of?"]
      ]
    },

    {
      title:"Cardio Energy",
      type:"Cardio",
      tasks:[
        ["Treadmill / Bike","5 min easy"],
        ["Cardio","20 min moderate"],
        ["Cool-down","5 min"],
        ["Journal","What gives me energy?"]
      ]
    },

    {
      title:"Mobility + Reset",
      type:"Recovery",
      tasks:[
        ["Mobility Flow","12 min"],
        ["Easy Walk","15 min"],
        ["Breathing","5 min"],
        ["Journal","What needs more attention?"]
      ]
    },

    {
      title:"Build",
      type:"Movement",
      tasks:[
        ["Reverse Lunge","3 × 10 each"],
        ["Chest Press / Push-up","3 × 12"],
        ["Row","3 × 12"],
        ["Plank","3 × 30 sec"],
        ["Journal","What am I rebuilding?"]
      ]
    },

    {
      title:"Move With Purpose",
      type:"Cardio",
      tasks:[
        ["Bike / Rower","20 min"],
        ["Walk","10 min"],
        ["Stretch","5 min"],
        ["Journal","What went well this week?"]
      ]
    },

    {
      title:"Weekly Reset",
      type:"Reset",
      tasks:[
        ["Easy Walk","20 min"],
        ["Mobility","10 min"],
        ["Breathing Reset","5 min"],
        ["Journal","Review the week and reset"]
      ]
    }

  ];


  function lyfeDay(day) {

    const week =
      Math.floor(
        (day - 1) / 7
      );


    const base =
      LYFE[
        (day - 1) % 7
      ];


    const themes = [
      "RESET",
      "REBUILD",
      "GROW",
      "MOVE FORWARD"
    ];


    return {
      ...base,

      weekTheme:
        themes[week] ||
        "MOVE FORWARD"
    };
  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

    document
      .getElementById(
        STYLE_ID
      )
      ?.remove();


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      .mana-v973-hero{

        margin-bottom:
          16px;

        padding:
          22px;

        border:
          1px solid
          #443b1d;

        border-radius:
          24px;

        background:
          linear-gradient(
            145deg,
            #17140b,
            #090909
          );
      }


      .mana-v973-kicker{

        color:
          #f3d875;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .14em;
      }


      .mana-v973-hero h2{

        margin:
          7px
          0
          8px;

        color:#fff;

        font-size:
          30px;

        line-height:
          1.05;
      }


      .mana-v973-hero p{

        margin:0;

        color:#999;

        font-size:
          13px;

        line-height:
          1.55;
      }


      .mana-v973-grid{

        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:
          10px;
      }


      .mana-v973-hub-card{

        min-height:
          140px;

        padding:
          17px;

        border:
          1px solid
          #2e2e2e;

        border-radius:
          18px;

        background:
          #0d0d0d;

        cursor:pointer;
      }


      .mana-v973-hub-card
      strong{

        display:block;

        color:#fff;

        font-size:
          17px;
      }


      .mana-v973-hub-card
      span{

        display:block;

        margin-top:
          7px;

        color:#777;

        font-size:
          12px;

        line-height:
          1.45;
      }


      .mana-v973-hub-card
      b{

        display:block;

        margin-top:
          15px;

        color:
          #f3d875;

        font-size:
          10px;

        letter-spacing:
          .05em;
      }


      /* =====================================
         28 DAY PROGRAM
         ===================================== */

      .mana-v973-program-head{

        margin-bottom:
          14px;
      }


      .mana-v973-program-head
      h2{

        margin:
          5px
          0;

        color:#fff;

        font-size:
          26px;
      }


      .mana-v973-program-head
      p{

        margin:0;

        color:#888;

        font-size:
          12px;

        line-height:
          1.5;
      }


      .mana-v973-days{

        display:flex;

        gap:
          10px;

        overflow-x:
          auto;

        scroll-snap-type:
          x mandatory;

        -webkit-overflow-scrolling:
          touch;

        scrollbar-width:
          none;
      }


      .mana-v973-days::-webkit-scrollbar{

        display:none;
      }


      .mana-v973-day{

        flex:
          0
          0
          88%;

        scroll-snap-align:
          center;

        padding:
          18px;

        border:
          1px solid
          #303030;

        border-radius:
          21px;

        background:
          #0c0c0c;

        box-sizing:
          border-box;
      }


      .mana-v973-day.complete{

        border-color:
          #66571f;

        background:
          #121006;
      }


      .mana-v973-day-number{

        color:
          #f3d875;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .12em;
      }


      .mana-v973-day
      h3{

        margin:
          7px
          0
          5px;

        color:#fff;

        font-size:
          22px;
      }


      .mana-v973-type{

        color:#888;

        font-size:
          11px;

        font-weight:
          800;
      }


      .mana-v973-preview{

        margin-top:
          14px;

        border-top:
          1px solid
          #252525;
      }


      .mana-v973-preview-row{

        display:flex;

        justify-content:
          space-between;

        gap:
          12px;

        padding:
          8px
          0;

        border-bottom:
          1px solid
          #202020;

        color:#aaa;

        font-size:
          11px;
      }


      .mana-v973-preview-row
      span:last-child{

        color:
          #d8c672;

        white-space:
          nowrap;
      }


      .mana-v973-start{

        width:
          100%;

        min-height:
          48px;

        margin-top:
          14px;

        border:0;

        border-radius:
          13px;

        background:
          #f3d875;

        color:#111;

        font-weight:
          950;

        font-size:
          12px;
      }


      /* =====================================
         GUIDED DAY MODAL
         ===================================== */

      #${MODAL_ID}{

        position:
          fixed;

        inset:0;

        z-index:
          60000;

        display:none;

        overflow:hidden;

        background:
          #050505;

        color:#fff;

        padding:
          calc(
            env(
              safe-area-inset-top
            )
            +
            12px
          )
          12px
          calc(
            env(
              safe-area-inset-bottom
            )
            +
            16px
          );
      }


      #${MODAL_ID}.open{

        display:block;
      }


      .mana-v973-work-shell{

        width:
          min(
            620px,
            100%
          );

        height:
          100%;

        margin:auto;

        display:flex;

        flex-direction:
          column;
      }


      .mana-v973-work-head{

        display:flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:
          12px;
      }


      .mana-v973-work-head
      h2{

        margin:
          4px
          0
          0;

        font-size:
          24px;
      }


      .mana-v973-close{

        width:
          40px;

        height:
          40px;

        border:
          1px solid
          #333;

        border-radius:
          50%;

        background:#111;

        color:#fff;

        font-size:
          20px;
      }


      .mana-v973-page-counter{

        margin-top:
          12px;

        color:
          #f3d875;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .08em;
      }


      .mana-v973-pages{

        flex:1;

        display:flex;

        gap:
          8px;

        margin-top:
          8px;

        overflow-x:
          auto;

        overflow-y:
          hidden;

        scroll-snap-type:
          x mandatory;

        -webkit-overflow-scrolling:
          touch;

        scrollbar-width:
          none;
      }


      .mana-v973-pages::-webkit-scrollbar{

        display:none;
      }


      .mana-v973-task{

        flex:
          0
          0
          100%;

        scroll-snap-align:
          start;

        padding:
          22px;

        border:
          1px solid
          #333;

        border-radius:
          21px;

        background:
          linear-gradient(
            145deg,
            #111,
            #090909
          );

        box-sizing:
          border-box;
      }


      .mana-v973-task-label{

        color:
          #f3d875;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .1em;
      }


      .mana-v973-task
      h3{

        margin:
          12px
          0
          5px;

        font-size:
          30px;

        line-height:
          1.05;
      }


      .mana-v973-dose{

        color:
          #d8c672;

        font-size:
          16px;

        font-weight:
          900;
      }


      .mana-v973-simple-copy{

        margin-top:
          20px;

        color:#888;

        font-size:
          13px;

        line-height:
          1.55;
      }


      .mana-v973-task-done{

        width:
          100%;

        min-height:
          52px;

        margin-top:
          25px;

        border:
          1px solid
          #66571f;

        border-radius:
          14px;

        background:
          #151208;

        color:
          #f3d875;

        font-size:
          12px;

        font-weight:
          950;
      }


      .mana-v973-task-done.done{

        background:
          #f3d875;

        color:#111;
      }


      .mana-v973-navigation{

        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:
          8px;

        margin-top:
          9px;
      }


      .mana-v973-nav{

        min-height:
          43px;

        border:
          1px solid
          #333;

        border-radius:
          12px;

        background:#111;

        color:#ccc;

        font-size:
          10px;

        font-weight:
          950;
      }


      .mana-v973-nav.next{

        border-color:
          #66571f;

        color:
          #f3d875;
      }


      .mana-v973-finish{

        width:
          100%;

        min-height:
          50px;

        margin-top:
          8px;

        border:0;

        border-radius:
          13px;

        background:
          #f3d875;

        color:#111;

        font-size:
          12px;

        font-weight:
          950;
      }


      @media(max-width:420px){

        .mana-v973-grid{

          grid-template-columns:
            1fr
            1fr;
        }


        .mana-v973-hub-card{

          min-height:
            125px;

          padding:
            14px;
        }


        .mana-v973-hub-card
        strong{

          font-size:
            15px;
        }


        .mana-v973-day{

          flex-basis:
            92%;
        }


        .mana-v973-task{

          padding:
            18px;
        }


        .mana-v973-task
        h3{

          font-size:
            27px;
        }

      }

    `;


    document.head
      .appendChild(style);
  }


  /* =========================================
     TAB NAVIGATION
     ========================================= */

  function clickTab(tab) {

    document
      .querySelector(
        `#manaV83Tabs
        [data-v83-tab="${tab}"]`
      )
      ?.click();
  }


  /* =========================================
     OVERVIEWS
     ========================================= */

  function renderMana28Overview() {

    const holder =
      content();


    if (!holder) return;


    const state =
      loadState(M28_KEY);


    const completed =
      state.completed.length;


    holder.innerHTML = `

      <div class="mana-v973-hero">

        <div class="mana-v973-kicker">
          MANA 28
        </div>

        <h2>
          28 Days to Move With Purpose
        </h2>

        <p>
          Strength, cardio, recovery and
          simple daily action. Every day is
          available — train at your pace.
        </p>

      </div>


      <div class="mana-v973-grid">

        <div
          class="mana-v973-hub-card"
          data-v973-tab="program"
        >

          <strong>
            Program
          </strong>

          <span>
            All 28 days unlocked.
          </span>

          <b>
            OPEN PROGRAM →
          </b>

        </div>


        <div
          class="mana-v973-hub-card"
          data-v973-tab="progress"
        >

          <strong>
            Progress
          </strong>

          <span>
            ${completed} of 28 days complete.
          </span>

          <b>
            VIEW PROGRESS →
          </b>

        </div>


        <div
          class="mana-v973-hub-card"
          data-v973-tab="fuel"
        >

          <strong>
            Fuel
          </strong>

          <span>
            Simple nutrition support.
          </span>

          <b>
            OPEN FUEL →
          </b>

        </div>


        <div
          class="mana-v973-hub-card"
          data-v973-tab="learn"
        >

          <strong>
            Learn
          </strong>

          <span>
            Understand the principles.
          </span>

          <b>
            LEARN MORE →
          </b>

        </div>

      </div>

    `;


    bindHubTabs(holder);
  }


  function renderLyfeOverview() {

    const holder =
      content();


    if (!holder) return;


    const state =
      loadState(LYFE_KEY);


    const completed =
      state.completed.length;


    holder.innerHTML = `

      <div class="mana-v973-hero">

        <div class="mana-v973-kicker">
          MANA LYFE
        </div>

        <h2>
          Move. Reset. Rebuild.
        </h2>

        <p>
          A simple 28-day blend of movement,
          cardio, mindset and reflection.
          Enough structure to move forward
          without overwhelming you.
        </p>

      </div>


      <div class="mana-v973-grid">

        <div
          class="mana-v973-hub-card"
          data-v973-tab="routine"
        >

          <strong>
            28-Day Program
          </strong>

          <span>
            Movement + mindset.
          </span>

          <b>
            OPEN PROGRAM →
          </b>

        </div>


        <div
          class="mana-v973-hub-card"
          data-v973-tab="reclaim"
        >

          <strong>
            Journal
          </strong>

          <span>
            Reflection and reset.
          </span>

          <b>
            OPEN JOURNAL →
          </b>

        </div>


        <div
          class="mana-v973-hub-card"
          data-v973-tab="progress"
        >

          <strong>
            Progress
          </strong>

          <span>
            ${completed} of 28 days complete.
          </span>

          <b>
            VIEW PROGRESS →
          </b>

        </div>


        <div
          class="mana-v973-hub-card"
          data-v973-tab="learn"
        >

          <strong>
            Learn
          </strong>

          <span>
            Tools for consistency.
          </span>

          <b>
            LEARN MORE →
          </b>

        </div>

      </div>

    `;


    bindHubTabs(holder);
  }


  function bindHubTabs(holder) {

    holder
      .querySelectorAll(
        "[data-v973-tab]"
      )
      .forEach(
        card => {

          card.onclick =
            () => {

              clickTab(
                card.dataset.v973Tab
              );

            };

        }
      );
  }


  /* =========================================
     PROGRAM RENDER
     ========================================= */

  function renderProgram(
    type
  ) {

    const holder =
      content();


    if (!holder) return;


    const state =
      loadState(
        type === "mana28"
          ? M28_KEY
          : LYFE_KEY
      );


    const days =
      Array.from(
        {length:28},
        (_, i) => {

          const day =
            i + 1;


          const data =
            type === "mana28"
              ? mana28Day(day)
              : lyfeDay(day);


          const complete =
            state.completed
              .includes(day);


          return `

            <div
              class="
                mana-v973-day
                ${complete ? "complete" : ""}
              "
            >

              <div class="mana-v973-day-number">

                DAY ${day} OF 28

                ${
                  complete
                    ? " • COMPLETE ✓"
                    : " • UNLOCKED"
                }

              </div>


              <h3>
                ${esc(data.title)}
              </h3>


              <div class="mana-v973-type">
                ${
                  type === "lyfe"
                    ? `${data.weekTheme} • `
                    : ""
                }

                ${esc(data.type)}
              </div>


              <div class="mana-v973-preview">

                ${data.tasks
                  .slice(0,4)
                  .map(
                    task => `

                      <div
                        class="mana-v973-preview-row"
                      >

                        <span>
                          ${esc(task[0])}
                        </span>

                        <span>
                          ${esc(task[1])}
                        </span>

                      </div>

                    `
                  )
                  .join("")}

              </div>


              <button
                type="button"
                class="mana-v973-start"
                data-v973-start="${day}"
                data-v973-program="${type}"
              >
                ${
                  complete
                    ? "VIEW DAY →"
                    : "START DAY →"
                }
              </button>

            </div>

          `;

        }
      )
      .join("");


    holder.innerHTML = `

      <div class="mana-v973-program-head">

        <div class="mana-v973-kicker">
          ${
            type === "mana28"
              ? "MANA 28 PROGRAM"
              : "MANA LYFE PROGRAM"
          }
        </div>

        <h2>
          28 Days • All Unlocked
        </h2>

        <p>
          Swipe across the days.
          Choose any day whenever you need it.
        </p>

      </div>


      <div
        class="mana-v973-days"
        id="manaV973Days"
      >
        ${days}
      </div>

    `;


    holder
      .querySelectorAll(
        "[data-v973-start]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              openDay(
                button.dataset
                  .v973Program,

                Number(
                  button.dataset
                    .v973Start
                )
              );

            };

        }
      );
  }


  /* =========================================
     WORKOUT MODAL
     ========================================= */

  function ensureModal() {

    if (
      document.getElementById(
        MODAL_ID
      )
    ) {

      return;
    }


    const modal =
      document.createElement(
        "div"
      );


    modal.id =
      MODAL_ID;


    document.body
      .appendChild(modal);
  }


  function openDay(
    program,
    day
  ) {

    ensureModal();


    const modal =
      document.getElementById(
        MODAL_ID
      );


    const data =
      program === "mana28"
        ? mana28Day(day)
        : lyfeDay(day);


    const key =
      program === "mana28"
        ? M28_KEY
        : LYFE_KEY;


    const state =
      loadState(key);


    const stored =
      state[
        `day${day}`
      ] || {};


    const checks =
      Array.isArray(
        stored.checks
      )
        ? stored.checks
        : [];


    while (
      checks.length <
      data.tasks.length
    ) {

      checks.push(false);
    }


    modal.innerHTML = `

      <div class="mana-v973-work-shell">

        <div class="mana-v973-work-head">

          <div>

            <div class="mana-v973-kicker">

              ${
                program === "mana28"
                  ? "MANA 28"
                  : "MANA LYFE"
              }

              • DAY ${day}

            </div>

            <h2>
              ${esc(data.title)}
            </h2>

          </div>


          <button
            type="button"
            class="mana-v973-close"
            id="manaV973Close"
          >
            ×
          </button>

        </div>


        <div
          class="mana-v973-page-counter"
          id="manaV973Counter"
        >
          1 OF ${data.tasks.length}
        </div>


        <div
          class="mana-v973-pages"
          id="manaV973Pages"
        >

          ${data.tasks
            .map(
              (
                task,
                index
              ) => `

                <div
                  class="mana-v973-task"
                  data-v973-task="${index}"
                >

                  <div
                    class="mana-v973-task-label"
                  >
                    ${
                      data.type.toUpperCase()
                    }
                    •
                    ${index + 1}
                    OF
                    ${data.tasks.length}
                  </div>


                  <h3>
                    ${esc(task[0])}
                  </h3>


                  <div class="mana-v973-dose">
                    ${esc(task[1])}
                  </div>


                  <div
                    class="mana-v973-simple-copy"
                  >

                    ${
                      /journal/i.test(
                        task[0]
                      )
                        ? "Take a few minutes and answer honestly. The goal is reflection, not perfection."
                        : /walk|bike|treadmill|cardio|rower/i.test(
                            task[0]
                          )
                          ? "Keep the effort controlled. You should finish feeling like you could have done a little more."
                          : "Use controlled movement and comfortable technique. Quality first."
                    }

                  </div>


                  <button
                    type="button"
                    class="
                      mana-v973-task-done
                      ${
                        checks[index]
                          ? "done"
                          : ""
                      }
                    "
                    data-v973-done="${index}"
                  >
                    ${
                      checks[index]
                        ? "COMPLETE ✓"
                        : "MARK COMPLETE"
                    }
                  </button>

                </div>

              `
            )
            .join("")}

        </div>


        <div class="mana-v973-navigation">

          <button
            type="button"
            class="mana-v973-nav"
            id="manaV973Prev"
          >
            ‹ PREVIOUS
          </button>


          <button
            type="button"
            class="mana-v973-nav next"
            id="manaV973Next"
          >
            NEXT ›
          </button>

        </div>


        <button
          type="button"
          class="mana-v973-finish"
          id="manaV973Finish"
        >
          COMPLETE DAY →
        </button>

      </div>

    `;


    modal.classList
      .add("open");


    document.body.style
      .overflow =
      "hidden";


    const pages =
      document.getElementById(
        "manaV973Pages"
      );


    let active =
      0;


    function updateCounter() {

      document
        .getElementById(
          "manaV973Counter"
        )
        .textContent =
        `${active + 1} OF ${data.tasks.length}`;
    }


    function go(index) {

      active =
        Math.max(
          0,
          Math.min(
            data.tasks.length - 1,
            index
          )
        );


      pages.children[
        active
      ].scrollIntoView({
        behavior:"smooth",
        block:"nearest",
        inline:"start"
      });


      updateCounter();
    }


    pages.addEventListener(
      "scroll",
      () => {

        clearTimeout(
          pages._timer
        );


        pages._timer =
          setTimeout(
            () => {

              const rect =
                pages.getBoundingClientRect();


              let closest =
                0;

              let distance =
                Infinity;


              [
                ...pages.children
              ]
                .forEach(
                  (
                    page,
                    index
                  ) => {

                    const r =
                      page
                        .getBoundingClientRect();


                    const d =
                      Math.abs(
                        r.left -
                        rect.left
                      );


                    if (
                      d < distance
                    ) {

                      distance =
                        d;

                      closest =
                        index;

                    }

                  }
                );


              active =
                closest;


              updateCounter();

            },
            70
          );

      },
      {
        passive:true
      }
    );


    document
      .getElementById(
        "manaV973Prev"
      )
      .onclick =
      () => go(active - 1);


    document
      .getElementById(
        "manaV973Next"
      )
      .onclick =
      () => go(active + 1);


    modal
      .querySelectorAll(
        "[data-v973-done]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              const index =
                Number(
                  button.dataset
                    .v973Done
                );


              checks[index] =
                !checks[index];


              button.classList
                .toggle(
                  "done",
                  checks[index]
                );


              button.textContent =
                checks[index]
                  ? "COMPLETE ✓"
                  : "MARK COMPLETE";


              const nextState =
                loadState(key);


              nextState[
                `day${day}`
              ] = {
                checks
              };


              saveState(
                key,
                nextState
              );

            };

        }
      );


    document
      .getElementById(
        "manaV973Finish"
      )
      .onclick =
      () => {

        const nextState =
          loadState(key);


        nextState[
          `day${day}`
        ] = {
          checks
        };


        if (
          !nextState.completed
            .includes(day)
        ) {

          nextState.completed
            .push(day);


          nextState.completed
            .sort(
              (
                a,
                b
              ) => a - b
            );

        }


        saveState(
          key,
          nextState
        );


        closeDay();


        setTimeout(
          refresh,
          80
        );

      };


    document
      .getElementById(
        "manaV973Close"
      )
      .onclick =
      closeDay;
  }


  function closeDay() {

    document
      .getElementById(
        MODAL_ID
      )
      ?.classList
      .remove("open");


    document.body.style
      .overflow =
      "";
  }


  /* =========================================
     RENAME MANA LIFE → MANA LYFE
     ========================================= */

  function fixLyfeBranding() {

    const title =
      document
        .getElementById(
          "manaV83Title"
        );


    if (
      title &&
      title.textContent
        .trim()
        .toUpperCase() ===
        "MANA LIFE"
    ) {

      title.textContent =
        "MANA LYFE";
    }
  }


  /* =========================================
     REFRESH
     ========================================= */

  function refresh() {

    if (
      !shellOpen()
    ) {

      return;
    }


    fixLyfeBranding();


    const title =
      programTitle();


    const tab =
      activeTab();


    if (
      title === "MANA 28"
    ) {

      if (
        tab === "overview"
      ) {

        renderMana28Overview();

      }


      if (
        tab === "program"
      ) {

        renderProgram(
          "mana28"
        );

      }


      return;
    }


    if (
      title === "MANA LIFE" ||
      title === "MANA LYFE"
    ) {

      if (
        tab === "overview"
      ) {

        renderLyfeOverview();

      }


      if (
        tab === "routine"
      ) {

        renderProgram(
          "lyfe"
        );

      }

    }
  }


  function scheduleRefresh() {

    [
      50,
      150,
      350
    ].forEach(
      delay => {

        setTimeout(
          refresh,
          delay
        );

      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    ensureModal();


    window.addEventListener(
      "mana:program-tab-change",
      scheduleRefresh
    );


    window.addEventListener(
      "mana:v973-updated",
      scheduleRefresh
    );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV80Mana28, " +
            "#manaV80Life, " +
            "#manaV83Tabs"
          )
        ) {

          scheduleRefresh();

        }

      },
      true
    );


    [
      800,
      1600
    ].forEach(
      delay => {

        setTimeout(
          refresh,
          delay
        );

      }
    );


    window
      .MANA_28_LYFE_BUILD =
      BUILD;


    window
      .refreshMana28Lyfe =
      scheduleRefresh;


    console.log(
      "[Mana v9.73.0] Mana 28 + Lyfe ready"
    );
  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:true
      }
    );

  } else {

    init();

  }

})();
