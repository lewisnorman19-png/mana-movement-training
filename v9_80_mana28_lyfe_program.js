/* =========================================
   MANA MOVEMENT TRAINING v9.80.1
   MANA 28 + MANA LYFE

   WEEK 1 / 2 / 3 / 4 PROGRAM LAYOUT

   WORKOUT DETAIL:
   - PHONE-FIRST WORKOUT LAYOUT
   - WARM-UP NOTE AT TOP
   - EXERCISE BOLD WHITE
   - SETS / REPS LIGHT TEXT UNDERNEATH
   - ESTIMATED WORKOUT TIME
   - FINISHER / NOTES AT BOTTOM
   - YELLOW MARK COMPLETE BAR
   - COMPLETE RETURNS TO WEEK SCREEN
   ========================================= */

(() => {
  "use strict";

  const BUILD = "98010";

  const STYLE_ID =
    "mana-v980-program-style";

  const M28_KEY =
    "mana-v973-mana28-state";

  const LYFE_KEY =
    "mana-v973-lyfe-state";


  const uiState = {

    mana28: {
      week: 1,
      day: null
    },

    lyfe: {
      week: 1,
      day: null
    }

  };


  /* =========================================
     MANA 28 FALLBACK WEEK
     ========================================= */

  const MANA28_WEEK = [

    {
      category:"Strength",
      title:"Full Body Strength A",
      minutes:"35–45",
      tasks:[
        [
          "Goblet squat",
          "3 sets × 10 reps"
        ],
        [
          "Push-up or chest press",
          "3 sets × 8–12 reps"
        ],
        [
          "Dumbbell row",
          "3 sets × 10 reps each side"
        ],
        [
          "Romanian deadlift",
          "3 sets × 10 reps"
        ],
        [
          "Plank",
          "3 × 30–45 sec"
        ]
      ]
    },


    {
      category:"Cardio",
      title:"Treadmill Cardio",
      minutes:"30–40",
      tasks:[
        [
          "Easy treadmill walk",
          "5 minutes"
        ],
        [
          "Moderate cardio",
          "20 minutes"
        ],
        [
          "Faster interval",
          "60 sec"
        ],
        [
          "Easy recovery",
          "60 sec"
        ],
        [
          "Intervals",
          "5 rounds"
        ],
        [
          "Cool-down",
          "5 minutes"
        ]
      ]
    },


    {
      category:"Strength",
      title:"Lower Body Strength",
      minutes:"35–45",
      tasks:[
        [
          "Squat pattern",
          "4 sets × 8 reps"
        ],
        [
          "Romanian deadlift",
          "3 sets × 10 reps"
        ],
        [
          "Split squat or step-up",
          "3 sets × 8 each side"
        ],
        [
          "Calf raise",
          "3 sets × 15 reps"
        ],
        [
          "Dead bug",
          "3 × 10 each side"
        ]
      ]
    },


    {
      category:"Recovery",
      title:"Walk + Mobility",
      minutes:"25–35",
      tasks:[
        [
          "Purposeful walk",
          "20–25 minutes"
        ],
        [
          "Hip mobility",
          "2 × 45 sec each side"
        ],
        [
          "Thoracic rotations",
          "2 × 8 each side"
        ],
        [
          "Breathing reset",
          "3 minutes"
        ]
      ]
    },


    {
      category:"Strength",
      title:"Upper Body + Core",
      minutes:"35–45",
      tasks:[
        [
          "Chest press",
          "4 sets × 8–10 reps"
        ],
        [
          "Seated or dumbbell row",
          "4 sets × 8–10 reps"
        ],
        [
          "Shoulder press",
          "3 sets × 10 reps"
        ],
        [
          "Lat pulldown",
          "3 sets × 10–12 reps"
        ],
        [
          "Plank variation",
          "3 rounds"
        ]
      ]
    },


    {
      category:"Cardio",
      title:"Bike Intervals",
      minutes:"30–35",
      tasks:[
        [
          "Easy bike",
          "5 minute warm-up"
        ],
        [
          "Hard effort",
          "30 sec"
        ],
        [
          "Easy recovery",
          "60 sec"
        ],
        [
          "Intervals",
          "8 rounds"
        ],
        [
          "Cool-down",
          "5 minutes"
        ]
      ]
    },


    {
      category:"Recovery",
      title:"Recovery Reset",
      minutes:"20–30",
      tasks:[
        [
          "Easy walk",
          "15 minutes"
        ],
        [
          "Mobility flow",
          "8–10 minutes"
        ],
        [
          "Hydration",
          "Hit your water target"
        ],
        [
          "Reset",
          "Prepare for next week"
        ]
      ]
    }

  ];


  /* =========================================
     MANA LYFE WEEK
     ========================================= */

  const LYFE_WEEK = [

    {
      category:"Movement",
      title:"Reset & Move",
      minutes:"30–40",
      tasks:[
        [
          "Bodyweight squat",
          "3 sets × 12 reps"
        ],
        [
          "Push-up or wall push-up",
          "3 sets × 10 reps"
        ],
        [
          "Row",
          "3 sets × 12 reps"
        ],
        [
          "Purposeful walk",
          "15 minutes"
        ],
        [
          "Reflection",
          "What do I need today?"
        ]
      ]
    },


    {
      category:"Mindset",
      title:"Walk & Reflect",
      minutes:"25–35",
      tasks:[
        [
          "Purposeful walk",
          "25 minutes"
        ],
        [
          "Breathing reset",
          "5 minutes"
        ],
        [
          "Reflection",
          "What can I control today?"
        ]
      ]
    },


    {
      category:"Cardio",
      title:"Cardio Energy",
      minutes:"30–40",
      tasks:[
        [
          "Warm-up",
          "5 minutes"
        ],
        [
          "Bike / rower / treadmill",
          "20 minutes moderate"
        ],
        [
          "Cool-down",
          "5 minutes"
        ],
        [
          "Reflection",
          "What gives me energy?"
        ]
      ]
    },


    {
      category:"Recovery",
      title:"Mobility + Reset",
      minutes:"20–30",
      tasks:[
        [
          "Mobility flow",
          "12 minutes"
        ],
        [
          "Easy walk",
          "10 minutes"
        ],
        [
          "Breathing",
          "3 minutes"
        ],
        [
          "Reflection",
          "What needs less of my energy?"
        ]
      ]
    },


    {
      category:"Movement",
      title:"Build",
      minutes:"30–40",
      tasks:[
        [
          "Reverse lunge",
          "3 sets × 10 each side"
        ],
        [
          "Chest press / push-up",
          "3 sets × 12 reps"
        ],
        [
          "Row",
          "3 sets × 12 reps"
        ],
        [
          "Plank",
          "3 × 30 sec"
        ],
        [
          "Reflection",
          "What am I rebuilding?"
        ]
      ]
    },


    {
      category:"Cardio",
      title:"Move With Purpose",
      minutes:"30–40",
      tasks:[
        [
          "Bike / rower",
          "20 minutes"
        ],
        [
          "Walk",
          "10 minutes"
        ],
        [
          "Stretch",
          "5 minutes"
        ],
        [
          "Reflection",
          "What went well this week?"
        ]
      ]
    },


    {
      category:"Reset",
      title:"Weekly Reset",
      minutes:"20–30",
      tasks:[
        [
          "Easy walk",
          "15 minutes"
        ],
        [
          "Mobility",
          "8 minutes"
        ],
        [
          "Breathing",
          "2 minutes"
        ],
        [
          "Reflection",
          "What do I take into next week?"
        ]
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


  function isProgramTab(
    kind
  ) {

    const tab =
      activeTab();


    if (
      kind === "mana28"
    ) {

      return (
        tab === "program"
      );
    }


    if (
      kind === "lyfe"
    ) {

      return (
        tab === "routine"
      );
    }


    return false;
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


  function loadState(
    kind
  ) {

    const state =
      safeJson(
        localStorage.getItem(
          stateKey(kind)
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
    kind,
    state
  ) {

    localStorage.setItem(
      stateKey(kind),
      JSON.stringify(
        state
      )
    );
  }


  function openOverview() {

    document
      .querySelector(
        '#manaV83Tabs [data-v83-tab="overview"]'
      )
      ?.click();
  }


  /* =========================================
     PROGRAM DATA
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


    const fallback =
      MANA28_WEEK[
        (day - 1) % 7
      ];


    if (existing) {

      return {

        category:
          existing.category ||
          fallback.category,

        title:
          existing.title ||
          fallback.title,

        minutes:
          fallback.minutes,

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


    return {
      ...fallback
    };
  }


  function lyfeDay(
    day
  ) {

    const base =
      LYFE_WEEK[
        (day - 1) % 7
      ];


    const week =
      Math.floor(
        (day - 1) / 7
      ) + 1;


    const themes = {

      1:"RESET",

      2:"REBUILD",

      3:"GROW",

      4:"MOVE FORWARD"

    };


    return {

      ...base,

      theme:
        themes[week]

    };
  }


  function getDay(
    kind,
    day
  ) {

    return (
      kind === "mana28"
        ? mana28Day(day)
        : lyfeDay(day)
    );
  }


  /* =========================================
     WARM-UP
     ========================================= */

  function warmupText(
    kind,
    data
  ) {

    const category =
      String(
        data.category || ""
      )
        .toLowerCase();


    if (
      category.includes(
        "strength"
      ) ||
      category.includes(
        "movement"
      )
    ) {

      return (
        "5–7 minutes of easy movement to raise your body temperature. " +
        "Then complete one light preparation set of the first main exercise before starting your working sets."
      );
    }


    if (
      category.includes(
        "cardio"
      )
    ) {

      return (
        "Begin easy for the first 5 minutes. Gradually increase your pace until you feel warm and ready to work."
      );
    }


    if (
      category.includes(
        "recovery"
      ) ||
      category.includes(
        "reset"
      ) ||
      category.includes(
        "mindset"
      )
    ) {

      return (
        "Start easy. Breathe slowly, relax the shoulders and allow your body and mind to settle into the session."
      );
    }


    return (
      kind === "lyfe"
        ? "Take 3–5 minutes to settle, breathe and prepare yourself for the session."
        : "Take 5 minutes to warm up gradually before beginning."
    );
  }


  /* =========================================
     FINISHER / NOTES
     ========================================= */

  function finisherText(
    kind,
    data
  ) {

    const category =
      String(
        data.category || ""
      )
        .toLowerCase();


    if (
      category.includes(
        "strength"
      ) ||
      category.includes(
        "movement"
      )
    ) {

      return (
        "Move with control and good technique. Rest around 60–90 seconds between working sets. " +
        "Finish with 3–5 minutes of easy walking and breathing."
      );
    }


    if (
      category.includes(
        "cardio"
      )
    ) {

      return (
        "Finish with 3–5 minutes at an easy pace. Let your breathing return toward normal before stopping."
      );
    }


    if (
      category.includes(
        "recovery"
      ) ||
      category.includes(
        "reset"
      )
    ) {

      return (
        "Keep the session comfortable. The goal today is to restore energy, move well and leave feeling better than when you started."
      );
    }


    if (
      kind === "lyfe"
    ) {

      return (
        "Before you finish, take one minute to notice how your energy or mindset has changed since the start of the session."
      );
    }


    return (
      "Finish calmly, hydrate and give yourself a few minutes to recover."
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

      .mana-v980-root{

        width:100%;

        max-width:760px;

        margin:
          0 auto 36px;
      }


      .mana-v980-intro{

        margin-bottom:
          18px;
      }


      .mana-v980-kicker{

        color:#e0c25a;

        font-size:11px;

        font-weight:950;

        letter-spacing:.14em;

        text-transform:uppercase;
      }


      .mana-v980-intro h2{

        margin:
          6px 0;

        color:#fff;

        font-size:30px;

        line-height:1.05;
      }


      .mana-v980-intro p{

        margin:0;

        color:#9c9c9c;

        font-size:14px;

        line-height:1.45;
      }


      /* =====================================
         WEEK TABS
         ===================================== */

      .mana-v980-weeks{

        display:grid;

        grid-template-columns:
          repeat(
            4,
            minmax(0,1fr)
          );

        gap:8px;

        margin:
          0 0 16px;
      }


      .mana-v980-week{

        min-height:48px;

        border:
          1px solid #343434;

        border-radius:13px;

        background:#101010;

        color:#999;

        font-size:12px;

        font-weight:950;

        cursor:pointer;
      }


      .mana-v980-week.active{

        border-color:#d1ad39;

        background:
          linear-gradient(
            145deg,
            #f2d875,
            #c49b2d
          );

        color:#111;
      }


      .mana-v980-week-head{

        display:flex;

        justify-content:
          space-between;

        align-items:flex-end;

        gap:12px;

        margin-bottom:8px;
      }


      .mana-v980-week-title{

        color:#fff;

        font-size:21px;

        font-weight:950;
      }


      .mana-v980-week-progress{

        color:#b6a05a;

        font-size:11px;

        font-weight:900;
      }


      /* =====================================
         WORKOUT LIST
         ===================================== */

      .mana-v980-list{

        display:grid;

        gap:9px;
      }


      .mana-v980-day{

        width:100%;

        min-height:82px;

        display:grid;

        grid-template-columns:
          54px
          minmax(0,1fr)
          auto;

        align-items:center;

        gap:14px;

        padding:
          12px 14px;

        text-align:left;

        border:
          1px solid #303029;

        border-radius:18px;

        background:
          linear-gradient(
            145deg,
            #15140f,
            #0a0a0a
          );

        color:#fff;

        cursor:pointer;
      }


      .mana-v980-number{

        width:54px;

        height:54px;

        display:grid;

        place-items:center;

        border-radius:16px;

        border:
          1px solid #5b4e23;

        background:#15130b;

        color:#f2d875;

        font-size:22px;

        font-weight:950;
      }


      .mana-v980-day.done
      .mana-v980-number{

        background:#f2d875;

        color:#111;
      }


      .mana-v980-copy{

        min-width:0;
      }


      .mana-v980-category{

        color:#c7aa4f;

        font-size:10px;

        font-weight:950;

        letter-spacing:.13em;

        text-transform:uppercase;
      }


      .mana-v980-title{

        margin-top:4px;

        color:#fff;

        font-size:18px;

        font-weight:950;

        line-height:1.12;
      }


      .mana-v980-time{

        margin-top:4px;

        color:#8d8d8d;

        font-size:11px;

        font-weight:750;
      }


      .mana-v980-arrow{

        color:#f2d875;

        font-size:21px;

        font-weight:950;
      }


      /* =====================================
         OPEN WORKOUT
         ===================================== */

      .mana-v980-session{

        width:100%;

        max-width:680px;

        margin:
          0 auto 35px;
      }


      .mana-v980-session-top{

        display:flex;

        justify-content:
          space-between;

        align-items:center;

        gap:10px;

        margin-bottom:14px;
      }


      .mana-v980-back-week{

        min-height:40px;

        padding:
          0 13px;

        border:
          1px solid #3a3a3a;

        border-radius:12px;

        background:#111;

        color:#f2d875;

        font-size:12px;

        font-weight:950;
      }


      .mana-v980-day-label{

        color:#a89456;

        font-size:11px;

        font-weight:950;

        letter-spacing:.09em;
      }


      .mana-v980-workout-category{

        color:#d0b150;

        font-size:10px;

        font-weight:950;

        letter-spacing:.14em;

        text-transform:uppercase;
      }


      .mana-v980-workout-title{

        margin:
          7px 0 4px;

        color:#fff;

        font-size:32px;

        font-weight:950;

        line-height:1.04;
      }


      .mana-v980-duration{

        display:inline-flex;

        align-items:center;

        min-height:30px;

        margin-top:5px;

        padding:
          0 10px;

        border:
          1px solid #4b4120;

        border-radius:999px;

        background:#15130c;

        color:#f2d875;

        font-size:11px;

        font-weight:950;
      }


      /* =====================================
         WARMUP + NOTES
         ===================================== */

      .mana-v980-note{

        margin-top:17px;

        padding:
          14px 15px;

        border-left:
          3px solid #d0ad39;

        border-radius:
          5px 14px 14px 5px;

        background:#12110d;
      }


      .mana-v980-note-title{

        margin-bottom:6px;

        color:#f2d875;

        font-size:10px;

        font-weight:950;

        letter-spacing:.13em;

        text-transform:uppercase;
      }


      .mana-v980-note-text{

        color:#c7c7c7;

        font-size:14px;

        line-height:1.5;
      }


      /* =====================================
         EXERCISES
         ===================================== */

      .mana-v980-exercises{

        margin-top:12px;
      }


      .mana-v980-exercise{

        padding:
          14px 2px;

        border-bottom:
          1px solid #262626;
      }


      .mana-v980-exercise:first-child{

        border-top:
          1px solid #262626;
      }


      .mana-v980-exercise-name{

        display:block;

        color:#fff;

        font-size:17px;

        font-weight:950;

        line-height:1.2;
      }


      .mana-v980-exercise-detail{

        display:block;

        margin-top:5px;

        color:#c5c5c5;

        font-size:14px;

        font-weight:600;

        line-height:1.3;
      }


      /* =====================================
         COMPLETE BAR
         ===================================== */

      .mana-v980-complete{

        width:100%;

        min-height:56px;

        margin-top:14px;

        border:0;

        border-radius:15px;

        background:
          linear-gradient(
            135deg,
            #f4da78,
            #cba22f
          );

        color:#111;

        font-size:14px;

        font-weight:950;

        letter-spacing:.04em;

        cursor:pointer;
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:700px){

        .mana-v980-root{

          margin-bottom:24px;
        }


        .mana-v980-intro{

          margin-bottom:13px;
        }


        .mana-v980-intro h2{

          font-size:26px;
        }


        .mana-v980-weeks{

          gap:5px;

          margin-bottom:12px;
        }


        .mana-v980-week{

          min-height:43px;

          padding:0 3px;

          font-size:10px;

          border-radius:11px;
        }


        .mana-v980-week-title{

          font-size:18px;
        }


        .mana-v980-day{

          min-height:76px;

          grid-template-columns:
            48px
            minmax(0,1fr)
            20px;

          gap:11px;

          padding:
            10px 11px;

          border-radius:16px;
        }


        .mana-v980-number{

          width:48px;

          height:48px;

          border-radius:14px;

          font-size:20px;
        }


        .mana-v980-title{

          font-size:16px;
        }


        .mana-v980-category{

          font-size:9px;
        }


        .mana-v980-time{

          font-size:10px;
        }


        /* PHONE WORKOUT */

        .mana-v980-session{

          margin-bottom:22px;
        }


        .mana-v980-session-top{

          margin-bottom:12px;
        }


        .mana-v980-workout-title{

          margin:
            6px 0 4px;

          font-size:28px;
        }


        .mana-v980-duration{

          min-height:28px;

          font-size:10px;
        }


        .mana-v980-note{

          margin-top:14px;

          padding:
            12px 13px;
        }


        .mana-v980-note-text{

          font-size:13px;

          line-height:1.45;
        }


        .mana-v980-exercise{

          padding:
            13px 1px;
        }


        .mana-v980-exercise-name{

          font-size:17px;
        }


        .mana-v980-exercise-detail{

          margin-top:4px;

          font-size:14px;

          color:#bdbdbd;
        }


        .mana-v980-complete{

          min-height:54px;

          margin-top:13px;

          font-size:13px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     WEEK SCREEN
     ========================================= */

  function renderWeek(
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


    if (
      kind === "lyfe" &&
      titleEl()
    ) {

      titleEl().textContent =
        "MANA LYFE";
    }


    const ui =
      uiState[kind];


    ui.day =
      null;


    const week =
      ui.week;


    const startDay =
      (
        week - 1
      ) * 7 + 1;


    const endDay =
      startDay + 6;


    const state =
      loadState(
        kind
      );


    const completedThisWeek =
      state.completed
        .filter(
          day =>
            day >= startDay &&
            day <= endDay
        )
        .length;


    const rows = [];


    for (
      let day = startDay;
      day <= endDay;
      day += 1
    ) {

      const data =
        getDay(
          kind,
          day
        );


      const done =
        state.completed
          .includes(day);


      const visibleNumber =
        day -
        startDay +
        1;


      rows.push(`

        <button
          type="button"
          class="
            mana-v980-day
            ${done ? "done" : ""}
          "
          data-v980-day="${day}"
        >

          <div
            class="mana-v980-number"
          >
            ${
              done
                ? "✓"
                : visibleNumber
            }
          </div>


          <div
            class="mana-v980-copy"
          >

            <div
              class="mana-v980-category"
            >
              ${esc(
                data.category
              )}
            </div>


            <div
              class="mana-v980-title"
            >
              ${esc(
                data.title
              )}
            </div>


            <div
              class="mana-v980-time"
            >
              DAY ${day}
              • ${esc(
                data.minutes
              )} MIN
            </div>

          </div>


          <div
            class="mana-v980-arrow"
          >
            ›
          </div>

        </button>

      `);

    }


    content.innerHTML = `

      <div
        class="mana-v980-root"
      >

        <div
          class="mana-v980-intro"
        >

          <div
            class="mana-v980-kicker"
          >
            ${
              kind === "mana28"
                ? "MANA 28"
                : "MANA LYFE"
            }
            PROGRAM
          </div>


          <h2>
            Your 28 Days
          </h2>


          <p>
            Choose your week, then open
            the workout you are ready for.
          </p>

        </div>


        <div
          class="mana-v980-weeks"
        >

          ${
            [1,2,3,4]
              .map(
                number => `

                  <button
                    type="button"
                    class="
                      mana-v980-week
                      ${
                        number === week
                          ? "active"
                          : ""
                      }
                    "
                    data-v980-week="${number}"
                  >
                    WEEK ${number}
                  </button>

                `
              )
              .join("")
          }

        </div>


        <div
          class="mana-v980-week-head"
        >

          <div
            class="mana-v980-week-title"
          >
            Week ${week}
          </div>


          <div
            class="mana-v980-week-progress"
          >
            ${completedThisWeek} / 7 COMPLETE
          </div>

        </div>


        <div
          class="mana-v980-list"
        >
          ${rows.join("")}
        </div>

      </div>

    `;


    content
      .querySelectorAll(
        "[data-v980-week]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              ui.week =
                Number(
                  button.dataset
                    .v980Week
                );


              renderWeek(
                kind
              );

            }
          );

        }
      );


    content
      .querySelectorAll(
        "[data-v980-day]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              const day =
                Number(
                  button.dataset
                    .v980Day
                );


              ui.day =
                day;


              renderSession(
                kind,
                day
              );

            }
          );

        }
      );


    updateBackButton(
      kind
    );
  }


  /* =========================================
     OPEN WORKOUT
     ========================================= */

  function renderSession(
    kind,
    day
  ) {

    const content =
      holder();


    if (!content) {

      return;
    }


    const data =
      getDay(
        kind,
        day
      );


    const week =
      Math.floor(
        (day - 1) / 7
      ) + 1;


    uiState[kind].week =
      week;


    uiState[kind].day =
      day;


    const exercises =
      data.tasks
        .map(
          task => `

            <div
              class="mana-v980-exercise"
            >

              <strong
                class="mana-v980-exercise-name"
              >
                ${esc(
                  task[0]
                )}
              </strong>


              <span
                class="mana-v980-exercise-detail"
              >
                ${esc(
                  task[1]
                )}
              </span>

            </div>

          `
        )
        .join("");


    content.innerHTML = `

      <div
        class="mana-v980-session"
      >

        <div
          class="mana-v980-session-top"
        >

          <button
            type="button"
            class="mana-v980-back-week"
            id="manaV980BackWeek"
          >
            ← WEEK ${week}
          </button>


          <div
            class="mana-v980-day-label"
          >
            DAY ${day} OF 28
          </div>

        </div>


        <div
          class="mana-v980-workout-category"
        >
          ${esc(
            data.category
          )}
        </div>


        <h2
          class="mana-v980-workout-title"
        >
          ${esc(
            data.title
          )}
        </h2>


        <div
          class="mana-v980-duration"
        >
          APPROX.
          ${esc(
            data.minutes
          )}
          MINUTES
        </div>


        <div
          class="mana-v980-note"
        >

          <div
            class="mana-v980-note-title"
          >
            WARM-UP
          </div>


          <div
            class="mana-v980-note-text"
          >
            ${esc(
              warmupText(
                kind,
                data
              )
            )}
          </div>

        </div>


        <div
          class="mana-v980-exercises"
        >
          ${exercises}
        </div>


        <div
          class="mana-v980-note"
        >

          <div
            class="mana-v980-note-title"
          >
            FINISHER / NOTES
          </div>


          <div
            class="mana-v980-note-text"
          >
            ${esc(
              finisherText(
                kind,
                data
              )
            )}
          </div>

        </div>


        <button
          type="button"
          id="manaV980Complete"
          class="mana-v980-complete"
        >
          MARK COMPLETE
        </button>

      </div>

    `;


    document
      .getElementById(
        "manaV980BackWeek"
      )
      ?.addEventListener(
        "click",
        () => {

          renderWeek(
            kind
          );

        }
      );


    document
      .getElementById(
        "manaV980Complete"
      )
      ?.addEventListener(
        "click",
        () => {

          completeDay(
            kind,
            day
          );

        }
      );


    updateBackButton(
      kind
    );


    const parentShell =
      shell();


    if (parentShell) {

      parentShell.scrollTop =
        0;
    }
  }


  /* =========================================
     COMPLETE
     ========================================= */

  function completeDay(
    kind,
    day
  ) {

    const state =
      loadState(
        kind
      );


    if (
      !state.completed
        .includes(day)
    ) {

      state.completed.push(
        day
      );


      state.completed.sort(
        (a,b) =>
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
      kind,
      state
    );


    /*
      Return immediately to the
      selected week's workout list.
    */

    uiState[kind].day =
      null;


    renderWeek(
      kind
    );


    const parentShell =
      shell();


    if (parentShell) {

      parentShell.scrollTop =
        0;
    }
  }


  /* =========================================
     BACK BUTTON
     ========================================= */

  function updateBackButton(
    kind
  ) {

    const button =
      document.getElementById(
        "manaV83Back"
      );


    if (!button) {

      return;
    }


    if (
      uiState[kind]?.day
    ) {

      button.textContent =
        `← Week ${
          uiState[kind].week
        }`;

    } else {

      button.textContent =
        "← Overview";
    }
  }


  function installBackHandler() {

    document.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            "#manaV83Back"
          );


        if (!button) {

          return;
        }


        const kind =
          programKind();


        if (
          !kind ||
          !isProgramTab(kind)
        ) {

          return;
        }


        event.preventDefault();

        event.stopImmediatePropagation();


        if (
          uiState[kind].day
        ) {

          uiState[kind].day =
            null;


          renderWeek(
            kind
          );


          return;
        }


        openOverview();

      },
      true
    );
  }


  /* =========================================
     MAIN RENDER
     ========================================= */

  function renderProgram() {

    const kind =
      programKind();


    if (
      !kind ||
      !isProgramTab(kind)
    ) {

      return;
    }


    if (
      kind === "lyfe" &&
      titleEl()
    ) {

      titleEl().textContent =
        "MANA LYFE";
    }


    if (
      uiState[kind].day
    ) {

      renderSession(
        kind,
        uiState[kind].day
      );

    } else {

      renderWeek(
        kind
      );
    }
  }


  function scheduleRender() {

    [
      140,
      220,
      360
    ]
      .forEach(
        delay => {

          setTimeout(
            renderProgram,
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

    installBackHandler();

    scheduleRender();


    window.addEventListener(
      "mana:program-tab-change",
      scheduleRender
    );


    document.addEventListener(
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


    window.MANA_WEEK_PROGRAM_BUILD =
      BUILD;


    console.log(
      "[Mana v9.80.1] phone-style workouts ready"
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
