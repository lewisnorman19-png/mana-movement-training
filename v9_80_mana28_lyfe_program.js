/* =========================================
   MANA MOVEMENT TRAINING v9.80.0
   MANA 28 + MANA LYFE
   WEEK-BASED PROGRAM LAYOUT

   - WEEK 1 / 2 / 3 / 4 ACROSS TOP
   - 7 DAYS LISTED UNDER EACH WEEK
   - TAP DAY TO OPEN FULL SESSION
   - SAME UX FOR MANA 28 + MANA LYFE
   - DIFFERENT PROGRAM CONTENT
   - PHONE + LAPTOP FRIENDLY
   - NO 28-DAY CAROUSEL
   - NO MOBILE WORKAROUND REQUIRED
   ========================================= */

(() => {
  "use strict";

  const BUILD = "98000";

  const STYLE_ID =
    "mana-v980-program-style";

  const M28_KEY =
    "mana-v973-mana28-state";

  const LYFE_KEY =
    "mana-v973-lyfe-state";

  const TOTAL_DAYS = 28;

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
      category: "Strength",
      title: "Full Body Strength A",
      minutes: 40,
      tasks: [
        ["Goblet squat","3 sets × 10 reps"],
        ["Push-up or chest press","3 sets × 8–12 reps"],
        ["Dumbbell row","3 sets × 10 reps each side"],
        ["Romanian deadlift","3 sets × 10 reps"],
        ["Plank","3 × 30–45 sec"]
      ]
    },

    {
      category: "Cardio",
      title: "Treadmill Cardio",
      minutes: 35,
      tasks: [
        ["Warm-up walk","5 minutes"],
        ["Steady treadmill work","20 minutes"],
        ["Faster intervals","5 × 60 sec"],
        ["Easy recovery","60 sec between intervals"],
        ["Cool-down","5 minutes"]
      ]
    },

    {
      category: "Strength",
      title: "Lower Body Strength",
      minutes: 40,
      tasks: [
        ["Squat pattern","4 sets × 8 reps"],
        ["Romanian deadlift","3 sets × 10 reps"],
        ["Split squat or step-up","3 sets × 8 each side"],
        ["Calf raise","3 sets × 15 reps"],
        ["Dead bug","3 × 10 each side"]
      ]
    },

    {
      category: "Recovery",
      title: "Walk + Mobility",
      minutes: 30,
      tasks: [
        ["Purposeful walk","20–25 minutes"],
        ["Hip mobility","2 × 45 sec each side"],
        ["Thoracic rotations","2 × 8 each side"],
        ["Breathing reset","3 minutes"]
      ]
    },

    {
      category: "Strength",
      title: "Upper Body + Core",
      minutes: 40,
      tasks: [
        ["Chest press","4 sets × 8–10 reps"],
        ["Seated or dumbbell row","4 sets × 8–10 reps"],
        ["Shoulder press","3 sets × 10 reps"],
        ["Lat pulldown","3 sets × 10–12 reps"],
        ["Plank variation","3 rounds"]
      ]
    },

    {
      category: "Cardio",
      title: "Bike Intervals",
      minutes: 35,
      tasks: [
        ["Easy bike warm-up","5 minutes"],
        ["Work interval","30 sec hard"],
        ["Recovery interval","60 sec easy"],
        ["Repeat","8 rounds"],
        ["Cool-down","5 minutes"]
      ]
    },

    {
      category: "Recovery",
      title: "Recovery Reset",
      minutes: 25,
      tasks: [
        ["Easy walk","15 minutes"],
        ["Mobility flow","8–10 minutes"],
        ["Hydration","Hit water target"],
        ["Reset","Prepare for next week"]
      ]
    }

  ];


  /* =========================================
     MANA LYFE WEEK
     ========================================= */

  const LYFE_WEEK = [

    {
      category: "Movement",
      title: "Reset & Move",
      minutes: 30,
      tasks: [
        ["Bodyweight squat","3 × 12"],
        ["Push-up or wall push-up","3 × 10"],
        ["Row","3 × 12"],
        ["Purposeful walk","15 minutes"],
        ["Reflection","What do I need today?"]
      ]
    },

    {
      category: "Mindset",
      title: "Walk & Reflect",
      minutes: 30,
      tasks: [
        ["Purposeful walk","25 minutes"],
        ["Breathing reset","5 minutes"],
        ["Reflection","What can I control today?"]
      ]
    },

    {
      category: "Cardio",
      title: "Cardio Energy",
      minutes: 35,
      tasks: [
        ["Warm-up","5 minutes"],
        ["Bike / rower / treadmill","20 minutes moderate"],
        ["Cool-down","5 minutes"],
        ["Reflection","What gives me energy?"]
      ]
    },

    {
      category: "Recovery",
      title: "Mobility + Reset",
      minutes: 25,
      tasks: [
        ["Mobility flow","12 minutes"],
        ["Easy walk","10 minutes"],
        ["Breathing","3 minutes"],
        ["Reflection","What needs less of my energy?"]
      ]
    },

    {
      category: "Movement",
      title: "Build",
      minutes: 35,
      tasks: [
        ["Reverse lunge","3 × 10 each"],
        ["Chest press / push-up","3 × 12"],
        ["Row","3 × 12"],
        ["Plank","3 × 30 sec"],
        ["Reflection","What am I rebuilding?"]
      ]
    },

    {
      category: "Cardio",
      title: "Move With Purpose",
      minutes: 35,
      tasks: [
        ["Bike / rower","20 minutes"],
        ["Walk","10 minutes"],
        ["Stretch","5 minutes"],
        ["Reflection","What went well this week?"]
      ]
    },

    {
      category: "Reset",
      title: "Weekly Reset",
      minutes: 25,
      tasks: [
        ["Easy walk","15 minutes"],
        ["Mobility","8 minutes"],
        ["Breathing","2 minutes"],
        ["Reflection","What do I take into next week?"]
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


    if (existing) {

      const fallback =
        MANA28_WEEK[
          (day - 1) % 7
        ];


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
      ...MANA28_WEEK[
        (day - 1) % 7
      ]
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
         PROGRAM ROOT
         ===================================== */

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
          6px 0 6px;

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

        touch-action:manipulation;
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


      /* =====================================
         WEEK LABEL
         ===================================== */

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
         DAY LIST
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

        touch-action:manipulation;
      }


      .mana-v980-day:active{

        transform:
          scale(.995);
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
         SESSION DETAIL
         ===================================== */

      .mana-v980-session{

        width:100%;

        max-width:720px;

        margin:
          0 auto 40px;
      }


      .mana-v980-session-top{

        display:flex;

        justify-content:
          space-between;

        align-items:center;

        gap:12px;

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

        cursor:pointer;
      }


      .mana-v980-day-label{

        color:#b79e50;

        font-size:11px;

        font-weight:950;

        letter-spacing:.12em;
      }


      .mana-v980-session-card{

        padding:22px;

        border:
          1px solid #393323;

        border-radius:22px;

        background:
          linear-gradient(
            145deg,
            #171611,
            #090909
          );
      }


      .mana-v980-session-category{

        color:#d1b355;

        font-size:11px;

        font-weight:950;

        letter-spacing:.13em;

        text-transform:uppercase;
      }


      .mana-v980-session h2{

        margin:
          7px 0 5px;

        color:#fff;

        font-size:32px;

        line-height:1.04;
      }


      .mana-v980-meta{

        color:#979797;

        font-size:13px;

        font-weight:800;
      }


      .mana-v980-theme{

        margin-top:8px;

        color:#d1b355;

        font-size:11px;

        font-weight:900;
      }


      .mana-v980-exercises{

        margin:
          18px 0;

        border-top:
          1px solid #29271f;

        border-bottom:
          1px solid #29271f;
      }


      .mana-v980-exercise{

        display:grid;

        grid-template-columns:
          minmax(0,1fr)
          minmax(120px,auto);

        gap:15px;

        align-items:center;

        min-height:62px;

        padding:
          10px 1px;

        border-bottom:
          1px solid #24231e;
      }


      .mana-v980-exercise:last-child{

        border-bottom:0;
      }


      .mana-v980-exercise strong{

        color:#f0f0f0;

        font-size:17px;

        line-height:1.25;
      }


      .mana-v980-exercise span{

        color:#f2d875;

        font-size:15px;

        font-weight:900;

        line-height:1.2;

        text-align:right;
      }


      .mana-v980-complete{

        width:100%;

        min-height:52px;

        border:0;

        border-radius:15px;

        background:#f2d875;

        color:#111;

        font-size:14px;

        font-weight:950;

        cursor:pointer;
      }


      .mana-v980-complete.done{

        border:
          1px solid #5c4e21;

        background:#171408;

        color:#f2d875;
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:700px){

        .mana-v980-root{

          margin-bottom:
            24px;
        }


        .mana-v980-intro{

          margin-bottom:
            13px;
        }


        .mana-v980-intro h2{

          font-size:
            26px;
        }


        .mana-v980-weeks{

          gap:
            5px;

          margin-bottom:
            12px;
        }


        .mana-v980-week{

          min-height:
            43px;

          padding:
            0 4px;

          font-size:
            10px;

          border-radius:
            11px;
        }


        .mana-v980-week-head{

          margin-bottom:
            7px;
        }


        .mana-v980-week-title{

          font-size:
            18px;
        }


        .mana-v980-day{

          min-height:
            76px;

          grid-template-columns:
            48px
            minmax(0,1fr)
            20px;

          gap:
            11px;

          padding:
            10px 11px;

          border-radius:
            16px;
        }


        .mana-v980-number{

          width:
            48px;

          height:
            48px;

          border-radius:
            14px;

          font-size:
            20px;
        }


        .mana-v980-title{

          font-size:
            16px;
        }


        .mana-v980-category{

          font-size:
            9px;
        }


        .mana-v980-time{

          font-size:
            10px;
        }


        .mana-v980-arrow{

          font-size:
            18px;
        }


        .mana-v980-session-card{

          padding:
            16px 14px;

          border-radius:
            18px;
        }


        .mana-v980-session h2{

          font-size:
            27px;
        }


        .mana-v980-exercise{

          grid-template-columns:
            minmax(0,1fr)
            minmax(96px,auto);

          gap:
            9px;

          min-height:
            54px;

          padding:
            9px 1px;
        }


        .mana-v980-exercise strong{

          font-size:
            16px;
        }


        .mana-v980-exercise span{

          font-size:
            14px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     WEEK LIST
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

      titleEl()
        .textContent =
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


    const days = [];


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


      days.push(`

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
              • ~${data.minutes} MIN
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
            Choose a week, then tap a day
            to open the full session.
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
          ${days.join("")}
        </div>

      </div>

    `;


    content
      .querySelectorAll(
        "[data-v980-week]"
      )
      .forEach(
        button => {

          button
            .addEventListener(
              "click",
              () => {

                ui.week =
                  Number(
                    button
                      .dataset
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

          button
            .addEventListener(
              "click",
              () => {

                const day =
                  Number(
                    button
                      .dataset
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
     SESSION DETAIL
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


    const state =
      loadState(
        kind
      );


    const done =
      state.completed
        .includes(day);


    const week =
      Math.floor(
        (day - 1) / 7
      ) + 1;


    uiState[kind].week =
      week;


    uiState[kind].day =
      day;


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
          class="mana-v980-session-card"
        >

          <div
            class="mana-v980-session-category"
          >
            ${esc(
              data.category
            )}
          </div>


          <h2>
            ${esc(
              data.title
            )}
          </h2>


          <div
            class="mana-v980-meta"
          >
            ~${data.minutes} MIN
          </div>


          ${
            kind === "lyfe" &&
            data.theme

              ? `

                <div
                  class="mana-v980-theme"
                >
                  WEEK ${week}
                  • ${esc(
                    data.theme
                  )}
                </div>

              `

              : ""
          }


          <div
            class="mana-v980-exercises"
          >

            ${
              data.tasks
                .map(
                  task => `

                    <div
                      class="mana-v980-exercise"
                    >

                      <strong>
                        ${esc(
                          task[0]
                        )}
                      </strong>


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
            id="manaV980Complete"
            class="
              mana-v980-complete
              ${done ? "done" : ""}
            "
            ${done ? "disabled" : ""}
          >

            ${
              done
                ? "DAY COMPLETE ✓"
                : "COMPLETE DAY →"
            }

          </button>

        </div>

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
        event => {

          completeDay(
            kind,
            day,
            event.currentTarget
          );

        }
      );


    updateBackButton(
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

    const state =
      loadState(
        kind
      );


    if (
      !state.completed
        .includes(day)
    ) {

      state.completed
        .push(day);


      state.completed
        .sort(
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
     BACK BUTTON
     ========================================= */

  function updateBackButton(
    kind
  ) {

    const button =
      document
        .getElementById(
          "manaV83Back"
        );


    if (!button) {

      return;

    }


    if (
      uiState[kind]
        ?.day
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


          if (
            !kind ||
            !isProgramTab(kind)
          ) {

            return;

          }


          event.preventDefault();

          event.stopImmediatePropagation();


          if (
            uiState[kind]
              .day
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

      titleEl()
        .textContent =
        "MANA LYFE";
    }


    if (
      uiState[kind]
        .day
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


    window.MANA_WEEK_PROGRAM_BUILD =
      BUILD;


    console.log(
      "[Mana v9.80.0] Mana28 + Mana Lyfe weekly program layout ready"
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
