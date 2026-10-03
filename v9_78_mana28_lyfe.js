/* =========================================
   MANA MOVEMENT TRAINING v9.78.2
   CONSOLIDATED MANA 28 + MANA LYFE

   - ONE OWNER FOR MANA 28 + LYFE UI
   - CLEAN / NO FLICKERING
   - PHONE SWIPE
   - LAPTOP PREVIOUS / NEXT
   - CONSISTENT WORKOUT SPACING
   - LARGE READABLE WORKOUT TEXT
   - EXERCISE AREA SCROLLS ONLY IF NEEDED
   - COMPLETE DAY ALWAYS REACHABLE
   - ESTIMATED WORKOUT TIME
   - NO "UNLOCKED"
   - OVERVIEW -> HOME
   - PROGRAM -> OVERVIEW
   ========================================= */

(() => {
  "use strict";

  const BUILD = "97820";

  const STYLE_ID =
    "mana-v978-style";

  const M28_KEY =
    "mana-v973-mana28-state";

  const LYFE_KEY =
    "mana-v973-lyfe-state";

  let dayIndex = 0;

  let scrollTimer = null;


  /* =========================================
     MANA 28 FALLBACK PROGRAM
     ========================================= */

  const M28_WEEK = [

    {
      title:
        "Full Body Strength",

      type:
        "Strength",

      tasks:[
        ["Goblet Squat","3 × 10"],
        ["Chest Press","3 × 10"],
        ["Seated Row","3 × 10"],
        ["Romanian Deadlift","3 × 10"],
        ["Plank","3 × 30–45 sec"]
      ]
    },


    {
      title:
        "Walk + Mobility",

      type:
        "Recovery",

      tasks:[
        ["Purposeful Walk","25–35 min"],
        ["Hip Mobility","2 × 45 sec each"],
        ["Thoracic Rotation","2 × 8 each"],
        ["Breathing Reset","3 min"]
      ]
    },


    {
      title:
        "Lower Body Strength",

      type:
        "Strength",

      tasks:[
        ["Squat Pattern","4 × 8"],
        ["Romanian Deadlift","3 × 10"],
        ["Split Squat / Step-up","3 × 8 each"],
        ["Calf Raise","3 × 15"],
        ["Dead Bug","3 × 10 each"]
      ]
    },


    {
      title:
        "Upper Body Strength",

      type:
        "Strength",

      tasks:[
        ["Press","4 × 8–10"],
        ["Row","4 × 8–10"],
        ["Shoulder Press","3 × 10"],
        ["Lat Pulldown","3 × 10–12"],
        ["Carry","3 × 30–45 sec"]
      ]
    },


    {
      title:
        "Conditioning",

      type:
        "Cardio",

      tasks:[
        ["Warm-up","5 min"],
        ["Intervals","8 rounds"],
        ["Work","30 sec"],
        ["Recovery","60 sec"],
        ["Cool-down","5 min"]
      ]
    },


    {
      title:
        "Mobility + Core",

      type:
        "Recovery",

      tasks:[
        ["Mobility Flow","12–15 min"],
        ["Bird Dog","3 × 8 each"],
        ["Side Plank","3 × 20–30 sec"],
        ["Easy Walk","15–20 min"]
      ]
    },


    {
      title:
        "Rest / Reset",

      type:
        "Recovery",

      tasks:[
        ["Recovery","Rest or light walk"],
        ["Hydration","Hit water target"],
        ["Reset","Prepare for next week"]
      ]
    }

  ];


  /* =========================================
     MANA LYFE PROGRAM
     ========================================= */

  const LYFE_WEEK = [

    {
      title:
        "Reset & Move",

      type:
        "Movement",

      tasks:[
        ["Bodyweight Squat","3 × 12"],
        ["Push-up / Wall Push-up","3 × 10"],
        ["Row","3 × 12"],
        ["Walk","20 min"],
        ["Journal","Today's reflection"]
      ]
    },


    {
      title:
        "Walk & Reflect",

      type:
        "Mindset",

      tasks:[
        ["Purposeful Walk","30 min"],
        ["Breathing Reset","5 min"],
        ["Journal","What do I need to let go of?"]
      ]
    },


    {
      title:
        "Cardio Energy",

      type:
        "Cardio",

      tasks:[
        ["Warm-up","5 min easy"],
        ["Cardio","20 min moderate"],
        ["Cool-down","5 min"],
        ["Journal","What gives me energy?"]
      ]
    },


    {
      title:
        "Mobility + Reset",

      type:
        "Recovery",

      tasks:[
        ["Mobility Flow","12 min"],
        ["Easy Walk","15 min"],
        ["Breathing","5 min"],
        ["Journal","What needs attention?"]
      ]
    },


    {
      title:
        "Build",

      type:
        "Movement",

      tasks:[
        ["Reverse Lunge","3 × 10 each"],
        ["Chest Press / Push-up","3 × 12"],
        ["Row","3 × 12"],
        ["Plank","3 × 30 sec"],
        ["Journal","What am I rebuilding?"]
      ]
    },


    {
      title:
        "Move With Purpose",

      type:
        "Cardio",

      tasks:[
        ["Bike / Rower","20 min"],
        ["Walk","10 min"],
        ["Stretch","5 min"],
        ["Journal","What went well this week?"]
      ]
    },


    {
      title:
        "Weekly Reset",

      type:
        "Reset",

      tasks:[
        ["Easy Walk","20 min"],
        ["Mobility","10 min"],
        ["Breathing Reset","5 min"],
        ["Journal","Review and reset"]
      ]
    }

  ];


  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(
    raw,
    fallback
  ) {

    try {

      return JSON.parse(
        raw
      );

    } catch (_) {

      return fallback;

    }
  }


  function loadState(
    key
  ) {

    const state =
      safeJson(
        localStorage.getItem(
          key
        ) || "{}",
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
      JSON.stringify(
        state
      )
    );
  }


  function esc(
    value
  ) {

    return String(
      value ?? ""
    )
      .replaceAll(
        "&",
        "&amp;"
      )
      .replaceAll(
        "<",
        "&lt;"
      )
      .replaceAll(
        ">",
        "&gt;"
      );
  }


  function shell() {

    return document
      .getElementById(
        "manaV83ProgramShell"
      );
  }


  function holder() {

    return document
      .getElementById(
        "manaV83Content"
      );
  }


  function titleEl() {

    return document
      .getElementById(
        "manaV83Title"
      );
  }


  function activeTab() {

    return (
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab ||
      ""
    );
  }


  function programKind() {

    const title =
      (
        titleEl()
          ?.textContent ||
        ""
      )
        .trim()
        .toUpperCase();


    if (
      title.startsWith(
        "MANA 28"
      )
    ) {

      return "mana28";

    }


    if (
      title.startsWith(
        "MANA LIFE"
      ) ||
      title.startsWith(
        "MANA LYFE"
      )
    ) {

      return "lyfe";

    }


    return "";
  }


  function programTab(
    kind
  ) {

    return (
      kind === "mana28"
        ? "program"
        : "routine"
    );
  }


  function stateKey(
    kind
  ) {

    return (
      kind === "mana28"
        ? M28_KEY
        : LYFE_KEY
    );
  }


  function openTab(
    name
  ) {

    document
      .querySelector(
        "#manaV83Tabs " +
        `[data-v83-tab="${name}"]`
      )
      ?.click();
  }


  /* =========================================
     LYFE TITLE COMPATIBILITY
     ========================================= */

  function normaliseLyfeTitle() {

    const kind =
      programKind();


    if (
      kind !== "lyfe"
    ) {

      return;

    }


    const title =
      titleEl();


    if (!title) {

      return;

    }


    const tab =
      activeTab();


    if (
      tab === "overview" ||
      tab === "routine"
    ) {

      title.textContent =
        "MANA LYFE";

    } else {

      title.textContent =
        "MANA LIFE";

    }
  }


  /* =========================================
     DAY DATA
     ========================================= */

  function mana28Day(
    day
  ) {

    const existing =
      window
        .MANA28_PROGRAM?.[
          String(day)
        ] ||
      window
        .MANA28_PROGRAM?.[
          day
        ];


    if (existing) {

      return {

        title:
          existing.title ||
          `Day ${day}`,

        type:
          existing.category ||
          "Training",

        tasks:
          (
            existing.tasks ||
            []
          )
            .map(
              item => [

                item.name ||
                "Exercise",

                item.detail ||
                ""

              ]
            )

      };

    }


    return M28_WEEK[
      (day - 1) % 7
    ];
  }


  function lyfeDay(
    day
  ) {

    const base =
      LYFE_WEEK[
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

      theme:
        themes[
          Math.floor(
            (day - 1) / 7
          )
        ] ||
        "MOVE FORWARD"

    };
  }


  /* =========================================
     ESTIMATED TIME
     ========================================= */

  function estimatedTime(
    kind,
    data
  ) {

    const type =
      String(
        data?.type || ""
      )
        .toLowerCase();


    const title =
      String(
        data?.title || ""
      )
        .toLowerCase();


    if (
      /rest|reset/.test(
        title
      )
    ) {

      return 20;

    }


    if (
      /mobility|recovery|walk/.test(
        type
      ) ||
      /mobility|recovery/.test(
        title
      )
    ) {

      return 25;

    }


    if (
      /cardio|conditioning/.test(
        type
      ) ||
      /cardio|conditioning|interval/.test(
        title
      )
    ) {

      return 35;

    }


    if (
      /strength|movement/.test(
        type
      )
    ) {

      return 40;

    }


    return (
      kind === "lyfe"
        ? 30
        : 35
    );
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

      /* =====================================
         OVERVIEW
         ===================================== */

      .mana-v978-launchpad{

        width:100%;

        max-width:860px;

        margin:0 auto;

        padding:
          8px 0 34px;
      }


      .mana-v978-intro{

        margin-bottom:26px;
      }


      .mana-v978-kicker{

        color:#e2c25a;

        font-size:12px;

        font-weight:950;

        letter-spacing:.16em;

        text-transform:
          uppercase;
      }


      .mana-v978-intro h2{

        margin:
          10px 0 12px;

        color:#fff;

        font-size:36px;

        font-weight:950;

        line-height:1.02;
      }


      .mana-v978-intro p{

        max-width:680px;

        margin:0;

        color:#b8b8b8;

        font-size:17px;

        line-height:1.6;
      }


      .mana-v978-grid{

        display:grid;

        grid-template-columns:
          repeat(
            2,
            minmax(0,1fr)
          );

        gap:16px;
      }


      .mana-v978-launch{

        position:relative;

        width:100%;

        min-height:196px;

        overflow:hidden;

        display:flex;

        align-items:flex-start;

        gap:18px;

        padding:24px;

        text-align:left;

        border:
          1px solid
          #3b3522;

        border-radius:24px;

        background:
          linear-gradient(
            145deg,
            #171611,
            #090909
          );

        color:#fff;

        cursor:pointer;

        touch-action:
          manipulation;
      }


      .mana-v978-launch::before{

        content:"";

        position:absolute;

        top:0;

        left:22px;

        right:22px;

        height:2px;

        background:
          linear-gradient(
            90deg,
            transparent,
            #d9ba55,
            transparent
          );
      }


      .mana-v978-icon{

        flex:
          0 0 62px;

        width:62px;

        height:62px;

        display:grid;

        place-items:center;

        border-radius:18px;

        background:
          linear-gradient(
            145deg,
            #f2d978,
            #c89f2f
          );

        color:#111;

        font-size:20px;

        font-weight:950;
      }


      .mana-v978-copy{

        min-width:0;

        flex:1;
      }


      .mana-v978-label{

        color:#d0b45a;

        font-size:11px;

        font-weight:950;

        letter-spacing:.14em;

        text-transform:
          uppercase;
      }


      .mana-v978-title{

        margin-top:8px;

        color:#fff;

        font-size:26px;

        font-weight:950;

        line-height:1.08;
      }


      .mana-v978-text{

        margin-top:11px;

        color:#b8b8b8;

        font-size:15px;

        line-height:1.55;
      }


      .mana-v978-arrow{

        margin-top:16px;

        color:#f3d875;

        font-size:13px;

        font-weight:950;
      }


      /* =====================================
         PROGRAM SHELL
         ===================================== */

      #manaV83ProgramShell.mana-v978-program{

        overflow:hidden !important;
      }


      #manaV83ProgramShell.mana-v978-program
      .mana-v83-shell{

        height:
          calc(
            100dvh -
            env(
              safe-area-inset-bottom
            )
          ) !important;

        min-height:0 !important;

        display:flex !important;

        flex-direction:column !important;

        overflow:hidden !important;
      }


      #manaV83ProgramShell.mana-v978-program
      .mana-v83-head{

        flex:
          0 0 auto !important;

        margin-bottom:
          6px !important;
      }


      #manaV83ProgramShell.mana-v978-program
      #manaV83Content{

        flex:
          1 1 auto !important;

        min-height:0 !important;

        display:flex !important;

        flex-direction:
          column !important;

        overflow:hidden !important;
      }


      /* =====================================
         PROGRAM INTRO
         ===================================== */

      .mana-v978-program-head{

        flex:
          0 0 auto;

        margin:
          0 0 8px;
      }


      .mana-v978-program-head h2{

        margin:
          5px 0;

        color:#fff;

        font-size:30px;

        line-height:1.08;
      }


      .mana-v978-program-head p{

        margin:0;

        color:#aaa;

        font-size:15px;

        line-height:1.45;
      }


      /* =====================================
         DAY CAROUSEL
         ===================================== */

      .mana-v978-days{

        flex:
          1 1 auto;

        min-height:0;

        width:100%;

        display:flex;

        align-items:stretch;

        gap:0;

        overflow-x:auto;

        overflow-y:hidden;

        scroll-snap-type:
          x mandatory;

        -webkit-overflow-scrolling:
          touch;

        scrollbar-width:none;
      }


      .mana-v978-days::-webkit-scrollbar{

        display:none;
      }


      /* =====================================
         DAY CARD

         IMPORTANT:
         no height:100%
         no min-height:100%
         ===================================== */

      .mana-v978-day{

        flex:
          0 0 100%;

        width:100%;

        min-width:100%;

        max-width:100%;

        min-height:0;

        margin:0;

        padding:
          20px 22px;

        display:flex;

        flex-direction:column;

        box-sizing:
          border-box;

        border:
          1px solid
          #3b3522;

        border-radius:
          22px;

        background:
          linear-gradient(
            145deg,
            #171611,
            #0b0b09
          );

        scroll-snap-align:start;

        scroll-snap-stop:
          always;

        overflow:hidden;
      }


      .mana-v978-day-number{

        flex:
          0 0 auto;

        color:#e2c25a;

        font-size:13px;

        font-weight:950;

        letter-spacing:.11em;

        line-height:1.25;
      }


      .mana-v978-day h3{

        flex:
          0 0 auto;

        margin:
          7px 0 3px;

        color:#fff;

        font-size:32px;

        font-weight:950;

        line-height:1.05;
      }


      .mana-v978-type{

        flex:
          0 0 auto;

        color:#aaa;

        font-size:14px;

        font-weight:850;

        line-height:1.3;
      }


      /* =====================================
         EXERCISE LIST

         consistent spacing
         vertical scroll only if needed
         ===================================== */

      .mana-v978-preview{

        flex:
          1 1 auto;

        min-height:0;

        margin:
          12px 0;

        overflow-y:auto;

        overscroll-behavior:
          contain;

        scrollbar-width:
          thin;

        border-top:
          1px solid
          #29271f;

        border-bottom:
          1px solid
          #29271f;
      }


      .mana-v978-row{

        min-height:58px;

        display:grid;

        grid-template-columns:
          minmax(0,1fr)
          minmax(
            110px,
            auto
          );

        align-items:center;

        gap:16px;

        padding:
          10px 2px;

        border-bottom:
          1px solid
          #24231e;

        color:#eee;

        font-size:18px;

        line-height:1.3;
      }


      .mana-v978-row:last-child{

        border-bottom:0;
      }


      .mana-v978-row
      span:first-child{

        min-width:0;

        font-weight:850;
      }


      .mana-v978-row
      span:last-child{

        color:#f0d06a;

        font-size:16px;

        font-weight:950;

        text-align:right;

        line-height:1.25;
      }


      /* =====================================
         COMPLETE BUTTON
         ===================================== */

      .mana-v978-complete{

        flex:
          0 0 52px;

        width:100%;

        min-height:52px;

        margin-top:auto;

        border:0;

        border-radius:15px;

        background:#f3d875;

        color:#111;

        font-size:14px;

        font-weight:950;

        cursor:pointer;
      }


      .mana-v978-complete.done{

        border:
          1px solid
          #66571f;

        background:#171408;

        color:#f3d875;
      }


      /* =====================================
         LAPTOP NAVIGATION
         ===================================== */

      .mana-v978-daynav{

        flex:
          0 0 auto;

        display:grid;

        grid-template-columns:
          1fr
          auto
          1fr;

        align-items:center;

        gap:10px;

        margin-top:8px;
      }


      .mana-v978-daynav button{

        min-height:44px;

        border:
          1px solid
          #353535;

        border-radius:13px;

        background:#111;

        color:#ddd;

        font-size:12px;

        font-weight:950;

        cursor:pointer;
      }


      .mana-v978-daynav
      button:last-child{

        color:#f3d875;

        border-color:#5c4d20;
      }


      .mana-v978-daynav
      button:disabled{

        opacity:.35;

        cursor:default;
      }


      .mana-v978-count{

        min-width:100px;

        text-align:center;

        color:#aaa;

        font-size:12px;

        font-weight:900;
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:700px){

        .mana-v978-grid{

          grid-template-columns:
            1fr;

          gap:14px;
        }


        .mana-v978-intro h2{

          font-size:31px;
        }


        .mana-v978-intro p{

          font-size:15px;
        }


        .mana-v978-launch{

          min-height:164px;

          padding:20px;

          gap:15px;
        }


        .mana-v978-icon{

          width:56px;

          height:56px;

          flex-basis:56px;

          font-size:18px;
        }


        .mana-v978-title{

          font-size:23px;
        }


        .mana-v978-text{

          font-size:14px;
        }


        /* =================================
           PHONE AVAILABLE HEIGHT
           ================================= */

        #manaV83ProgramShell.mana-v978-program
        .mana-v83-shell{

          height:
            calc(
              100dvh
              -
              76px
              -
              env(
                safe-area-inset-bottom
              )
            ) !important;

          max-height:
            calc(
              100dvh
              -
              76px
              -
              env(
                safe-area-inset-bottom
              )
            ) !important;
        }


        #manaV83ProgramShell.mana-v978-program
        .mana-v83-head{

          margin-bottom:
            1px !important;
        }


        .mana-v978-program-head{

          margin:
            0 0 3px;
        }


        .mana-v978-program-head h2{

          margin:
            1px 0;

          font-size:20px;

          line-height:1.05;
        }


        .mana-v978-program-head p{

          display:none;
        }


        /* =================================
           PHONE DAY CARD
           ================================= */

        .mana-v978-day{

          padding:
            11px 14px 10px;

          border-radius:18px;
        }


        .mana-v978-day-number{

          font-size:11px;

          line-height:1.15;

          letter-spacing:.08em;
        }


        .mana-v978-day h3{

          margin:
            4px 0 1px;

          font-size:27px;

          line-height:1.02;
        }


        .mana-v978-type{

          font-size:12px;

          line-height:1.15;
        }


        /* =================================
           PHONE EXERCISE LIST
           ================================= */

        .mana-v978-preview{

          margin:
            6px 0 7px;
        }


        .mana-v978-row{

          min-height:48px;

          grid-template-columns:
            minmax(0,1fr)
            minmax(
              96px,
              auto
            );

          gap:8px;

          padding:
            6px 1px;

          font-size:16px;

          line-height:1.18;
        }


        .mana-v978-row
        span:last-child{

          font-size:15px;

          line-height:1.15;
        }


        .mana-v978-complete{

          flex:
            0 0 46px;

          min-height:46px;

          font-size:13px;
        }


        /* PHONE = SWIPE */

        .mana-v978-daynav{

          display:none !important;
        }

      }


      /* =====================================
         VERY SHORT PHONE
         ===================================== */

      @media(
        max-width:700px
      )
      and
      (max-height:700px){

        .mana-v978-program-head{

          display:none;
        }


        .mana-v978-day{

          padding:
            9px 12px 9px;
        }


        .mana-v978-day h3{

          font-size:25px;
        }


        .mana-v978-row{

          min-height:44px;

          padding:
            4px 1px;
        }


        .mana-v978-complete{

          flex-basis:44px;

          min-height:44px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     OVERVIEW CARD
     ========================================= */

  function card(
    tab,
    icon,
    label,
    title,
    text,
    arrow
  ) {

    return `

      <button
        type="button"
        class="mana-v978-launch"
        data-v978-tab="${tab}"
      >

        <div
          class="mana-v978-icon"
        >
          ${icon}
        </div>


        <div
          class="mana-v978-copy"
        >

          <div
            class="mana-v978-label"
          >
            ${label}
          </div>


          <div
            class="mana-v978-title"
          >
            ${title}
          </div>


          <div
            class="mana-v978-text"
          >
            ${text}
          </div>


          <div
            class="mana-v978-arrow"
          >
            ${arrow}
          </div>

        </div>

      </button>

    `;
  }


  /* =========================================
     OVERVIEW
     ========================================= */

  function renderOverview(
    kind
  ) {

    const content =
      holder();


    if (!content) {

      return;

    }


    shell()
      ?.classList
      .remove(
        "mana-v978-program"
      );


    const state =
      loadState(
        stateKey(
          kind
        )
      );


    const completed =
      state.completed.length;


    const lyfe =
      kind === "lyfe";


    if (
      lyfe &&
      titleEl()
    ) {

      titleEl()
        .textContent =
        "MANA LYFE";

    }


    content.innerHTML = `

      <div
        class="mana-v978-launchpad"
      >

        <div
          class="mana-v978-intro"
        >

          <div
            class="mana-v978-kicker"
          >
            ${
              lyfe
                ? "MANA LYFE"
                : "MANA 28"
            }
          </div>


          <h2>
            ${
              lyfe
                ? "Your Mana Lyfe Hub"
                : "Your Mana 28 Hub"
            }
          </h2>


          <p>
            Everything important in one place.
            Choose where you want to go next.
          </p>

        </div>


        <div
          class="mana-v978-grid"
        >

          ${
            lyfe

              ? card(
                  "routine",
                  "28",
                  "PROGRAM",
                  "Your 28 Days",
                  "Movement, mindset, cardio and simple strength across a guided 28-day path.",
                  "VIEW PROGRAM →"
                )

              : card(
                  "program",
                  "28",
                  "PROGRAM",
                  "Your 28 Days",
                  "Strength, cardio, mobility and recovery across your complete 28-day program.",
                  "VIEW PROGRAM →"
                )
          }


          ${
            lyfe

              ? card(
                  "reclaim",
                  "✦",
                  "RECLAIM",
                  "Reset & Rebuild",
                  "Journal, reflect and use practical tools when your head gets noisy.",
                  "OPEN RECLAIM →"
                )

              : card(
                  "fuel",
                  "F",
                  "FUEL",
                  "Nutrition",
                  "Profile-driven calories, protein, meals, water and daily targets.",
                  "OPEN FUEL →"
                )
          }


          ${card(
            "progress",
            "↗",
            "PROGRESS",
            lyfe
              ? "Your Journey"
              : "Your Results",
            `${completed} of 28 program days complete. Track momentum and consistency.`,
            "VIEW PROGRESS →"
          )}


          ${card(
            "learn",
            "i",
            "LEARN",
            lyfe
              ? "Tools for Lyfe"
              : "Build Better Habits",
            lyfe
              ? "Mindset, routine, useful principles and everyday learning."
              : "Training, recovery and lifestyle principles behind Mana 28.",
            "LEARN MORE →"
          )}

        </div>

      </div>

    `;


    content
      .querySelectorAll(
        "[data-v978-tab]"
      )
      .forEach(
        button => {

          button
            .addEventListener(
              "click",
              () => {

                openTab(
                  button
                    .dataset
                    .v978Tab
                );

              }
            );

        }
      );


    updateBack(
      kind
    );
  }


  /* =========================================
     PROGRAM
     ========================================= */

  function renderProgram(
    kind
  ) {

    const content =
      holder();


    if (!content) {

      return;

    }


    shell()
      ?.classList
      .add(
        "mana-v978-program"
      );


    if (
      kind === "lyfe" &&
      titleEl()
    ) {

      titleEl()
        .textContent =
        "MANA LYFE";

    }


    const state =
      loadState(
        stateKey(
          kind
        )
      );


    const cards = [];


    for (
      let day = 1;
      day <= 28;
      day += 1
    ) {

      const data =
        kind === "mana28"
          ? mana28Day(
              day
            )
          : lyfeDay(
              day
            );


      const done =
        state.completed
          .includes(
            day
          );


      const minutes =
        estimatedTime(
          kind,
          data
        );


      cards.push(`

        <section
          class="mana-v978-day"
          data-v978-day="${day}"
        >

          <div
            class="mana-v978-day-number"
          >
            DAY ${day} OF 28
            • ~${minutes} MIN
          </div>


          <h3>
            ${esc(
              data.title
            )}
          </h3>


          <div
            class="mana-v978-type"
          >
            ${esc(
              data.type
            )}
          </div>


          <div
            class="mana-v978-preview"
          >

            ${
              data.tasks
                .map(
                  task => `

                    <div
                      class="mana-v978-row"
                    >

                      <span>
                        ${esc(
                          task[0]
                        )}
                      </span>


                      <span>
                        ${esc(
                          task[1]
                        )}
                      </span>

                    </div>

                  `
                )
                .join("")
            }

          </div>


          <button
            type="button"

            class="
              mana-v978-complete
              ${
                done
                  ? "done"
                  : ""
              }
            "

            data-v978-complete="${day}"

            ${
              done
                ? "disabled"
                : ""
            }
          >

            ${
              done
                ? "DAY COMPLETE ✓"
                : "COMPLETE DAY →"
            }

          </button>

        </section>

      `);

    }


    content.innerHTML = `

      <div
        class="mana-v978-program-head"
      >

        <div
          class="mana-v978-kicker"
        >
          ${
            kind === "mana28"
              ? "MANA 28"
              : "MANA LYFE"
          }
          • 28 DAY PROGRAM
        </div>


        <h2>
          Move with purpose.
        </h2>


        <p>
          Swipe on phone or use Previous /
          Next on laptop.
        </p>

      </div>


      <div
        class="mana-v978-days"
        id="manaV978Days"
      >
        ${cards.join("")}
      </div>


      <div
        class="mana-v978-daynav"
      >

        <button
          type="button"
          id="manaV978Prev"
        >
          ← PREVIOUS DAY
        </button>


        <div
          class="mana-v978-count"
          id="manaV978Count"
        >
          DAY 1 OF 28
        </div>


        <button
          type="button"
          id="manaV978Next"
        >
          NEXT DAY →
        </button>

      </div>

    `;


    content
      .querySelectorAll(
        "[data-v978-complete]"
      )
      .forEach(
        button => {

          button
            .addEventListener(
              "click",
              () => {

                completeDay(

                  kind,

                  Number(
                    button
                      .dataset
                      .v978Complete
                  ),

                  button

                );

              }
            );

        }
      );


    document
      .getElementById(
        "manaV978Prev"
      )
      ?.addEventListener(
        "click",
        () => {

          goDay(
            dayIndex - 1
          );

        }
      );


    document
      .getElementById(
        "manaV978Next"
      )
      ?.addEventListener(
        "click",
        () => {

          goDay(
            dayIndex + 1
          );

        }
      );


    const days =
      document
        .getElementById(
          "manaV978Days"
        );


    days
      ?.addEventListener(
        "scroll",
        () => {

          clearTimeout(
            scrollTimer
          );


          scrollTimer =
            setTimeout(
              () => {

                if (
                  !days.clientWidth
                ) {

                  return;

                }


                dayIndex =
                  Math.max(
                    0,
                    Math.min(
                      27,
                      Math.round(
                        days.scrollLeft /
                        days.clientWidth
                      )
                    )
                  );


                updateDayCount();

              },
              70
            );

        },
        {
          passive:true
        }
      );


    goDay(
      dayIndex,
      false
    );


    updateBack(
      kind
    );
  }


  /* =========================================
     COMPLETE DAY
     ========================================= */

  function completeDay(
    kind,
    day,
    button
  ) {

    const key =
      stateKey(
        kind
      );


    const state =
      loadState(
        key
      );


    if (
      !state.completed
        .includes(
          day
        )
    ) {

      state.completed
        .push(
          day
        );


      state.completed
        .sort(
          (
            a,
            b
          ) =>
            a - b
        );

    }


    state[
      `day${day}`
    ] = {

      ...(
        state[
          `day${day}`
        ] || {}
      ),

      completedAt:
        new Date()
          .toISOString()

    };


    saveState(
      key,
      state
    );


    button
      .classList
      .add(
        "done"
      );


    button.textContent =
      "DAY COMPLETE ✓";


    button.disabled =
      true;
  }


  /* =========================================
     DAY NAVIGATION
     ========================================= */

  function goDay(
    index,
    smooth = true
  ) {

    const days =
      document
        .getElementById(
          "manaV978Days"
        );


    if (!days) {

      return;

    }


    dayIndex =
      Math.max(
        0,
        Math.min(
          27,
          index
        )
      );


    days.scrollTo({

      left:
        dayIndex *
        days.clientWidth,

      behavior:
        smooth
          ? "smooth"
          : "auto"

    });


    updateDayCount();
  }


  function updateDayCount() {

    const count =
      document
        .getElementById(
          "manaV978Count"
        );


    if (count) {

      count.textContent =
        `DAY ${
          dayIndex + 1
        } OF 28`;

    }


    const prev =
      document
        .getElementById(
          "manaV978Prev"
        );


    const next =
      document
        .getElementById(
          "manaV978Next"
        );


    if (prev) {

      prev.disabled =
        dayIndex === 0;

    }


    if (next) {

      next.disabled =
        dayIndex === 27;

    }
  }


  /* =========================================
     BACK / OVERVIEW
     ========================================= */

  function updateBack(
    kind
  ) {

    const button =
      document
        .getElementById(
          "manaV83Back"
        );


    if (
      !button ||
      !kind
    ) {

      return;

    }


    button.textContent =
      activeTab() === "overview"
        ? "← Home"
        : "← Overview";
  }


  function installBackRepair() {

    document
      .addEventListener(
        "click",
        event => {

          const button =
            event.target
              .closest(
                "#manaV83Back"
              );


          if (!button) {

            return;

          }


          const kind =
            programKind();


          if (!kind) {

            return;

          }


          if (
            activeTab() ===
            "overview"
          ) {

            return;

          }


          event.preventDefault();

          event.stopImmediatePropagation();


          openTab(
            "overview"
          );

        },
        true
      );
  }


  /* =========================================
     RENDER
     ========================================= */

  function render() {

    const kind =
      programKind();


    if (!kind) {

      return;

    }


    normaliseLyfeTitle();


    const tab =
      activeTab();


    if (
      tab ===
      "overview"
    ) {

      renderOverview(
        kind
      );

      return;

    }


    if (
      tab ===
      programTab(
        kind
      )
    ) {

      renderProgram(
        kind
      );

      return;

    }


    shell()
      ?.classList
      .remove(
        "mana-v978-program"
      );


    /*
      Reclaim / Progress / Learn
      still handled by existing
      Mana Life modules for now.
    */

    if (
      kind === "lyfe" &&
      titleEl()
    ) {

      titleEl()
        .textContent =
        "MANA LIFE";

    }


    updateBack(
      kind
    );
  }


  function scheduleRender() {

    [
      0,
      35,
      110
    ]
      .forEach(
        delay => {

          setTimeout(
            render,
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

    installBackRepair();

    scheduleRender();


    window
      .addEventListener(
        "mana:program-tab-change",
        scheduleRender
      );


    document
      .addEventListener(
        "click",
        event => {

          if (
            event.target.closest(
              "#manaV80Mana28," +
              "#manaV80Life," +
              "#manaV83Tabs"
            )
          ) {

            scheduleRender();

          }

        },
        true
      );


    window
      .MANA_28_LYFE_BUILD =
      BUILD;


    console.log(
      "[Mana v9.78.2] workout layout rebuilt"
    );
  }


  if (
    document.readyState ===
    "loading"
  ) {

    document
      .addEventListener(
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
