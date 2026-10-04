/* =========================================
   MANA MOVEMENT TRAINING v9.81.0
   MANA 28 — PREMIUM PROGRESS

   VIEW
   - DAILY
   - WEEKLY
   - MONTHLY
   - TO DATE

   CORE METRICS
   - WORKOUTS
   - WATER
   - CALORIES
   - PROTEIN
   - RECOVERY

   PURPOSE
   - SIMPLE
   - PREMIUM
   - EASY TO READ
   - FOUNDATION FOR ALL MANA PROGRESS SCREENS
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "98100";

  const STYLE_ID =
    "mana-v981-progress-style";

  const PROGRAM_KEY =
    "mana-v973-mana28-state";

  const FUEL_KEY =
    "mana-fuel-v571";

  const TARGET_KEY =
    "mana-fuel-v58-targets";

  let selectedPeriod =
    "daily";


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


  function clamp(
    value,
    min,
    max
  ) {

    return Math.max(
      min,
      Math.min(
        max,
        value
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


  function content() {

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


  function isOpen() {

    return Boolean(

      shell()
        ?.classList
        .contains(
          "open"
        )

      &&

      titleEl()
        ?.textContent
        ?.trim()
        ?.toUpperCase() ===
        "MANA 28"

      &&

      activeTab() ===
        "progress"

    );

  }


  /* =========================================
     DATE HELPERS
     ========================================= */

  function startOfDay(
    input
  ) {

    const date =
      new Date(
        input
      );


    date.setHours(
      0,
      0,
      0,
      0
    );


    return date;

  }


  function endOfDay(
    input
  ) {

    const date =
      new Date(
        input
      );


    date.setHours(
      23,
      59,
      59,
      999
    );


    return date;

  }


  function dateKey(
    input
  ) {

    const date =
      new Date(
        input
      );


    return [
      date.getFullYear(),

      String(
        date.getMonth() + 1
      )
        .padStart(
          2,
          "0"
        ),

      String(
        date.getDate()
      )
        .padStart(
          2,
          "0"
        )

    ].join("-");

  }


  function parseDateKey(
    key
  ) {

    const parts =
      String(
        key || ""
      )
        .split("-")
        .map(Number);


    if (
      parts.length !== 3
    ) {

      return null;

    }


    const date =
      new Date(
        parts[0],
        parts[1] - 1,
        parts[2]
      );


    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date;

  }


  function datesBetween(
    start,
    end
  ) {

    const result = [];

    const cursor =
      startOfDay(
        start
      );

    const finish =
      startOfDay(
        end
      );

    let safety =
      0;


    while (
      cursor <= finish &&
      safety < 370
    ) {

      result.push(
        dateKey(
          cursor
        )
      );


      cursor.setDate(
        cursor.getDate() + 1
      );


      safety += 1;

    }


    return result;

  }


  /* =========================================
     STORES
     ========================================= */

  function loadProgram() {

    const state =
      safeJson(

        localStorage.getItem(
          PROGRAM_KEY
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


  function loadFuel() {

    return safeJson(

      localStorage.getItem(
        FUEL_KEY
      ) || "{}",

      {}

    );

  }


  function loadTargets() {

    const targets =
      safeJson(

        localStorage.getItem(
          TARGET_KEY
        ) || "{}",

        {}

      );


    return {

      calories:
        Number(
          targets.calories || 0
        ),

      protein:
        Number(
          targets.protein || 0
        ),

      water:
        Number(
          targets.water || 0
        )

    };

  }


  /* =========================================
     COMPLETION RECORDS
     ========================================= */

  function completionRecords(
    state
  ) {

    return state.completed
      .map(
        day => {

          const record =
            state[
              `day${day}`
            ] || {};


          const rawDate =
            record.completedAt ||
            record.date ||
            null;


          let date =
            null;


          if (
            rawDate
          ) {

            const parsed =
              new Date(
                rawDate
              );


            if (
              !Number.isNaN(
                parsed.getTime()
              )
            ) {

              date =
                parsed;

            }

          }


          return {

            day:
              Number(day),

            date

          };

        }
      );

  }


  /* =========================================
     PROGRAM START
     ========================================= */

  function programStart(
    state,
    fuel
  ) {

    const dates = [];


    if (
      state.startedAt
    ) {

      const start =
        new Date(
          state.startedAt
        );


      if (
        !Number.isNaN(
          start.getTime()
        )
      ) {

        dates.push(
          start
        );

      }

    }


    completionRecords(
      state
    )
      .forEach(
        record => {

          if (
            record.date
          ) {

            dates.push(
              record.date
            );

          }

        }
      );


    Object.keys(
      fuel
    )
      .forEach(
        key => {

          const date =
            parseDateKey(
              key
            );


          if (
            date
          ) {

            dates.push(
              date
            );

          }

        }
      );


    if (
      !dates.length
    ) {

      return startOfDay(
        new Date()
      );

    }


    dates.sort(
      (a,b) =>
        a.getTime() -
        b.getTime()
    );


    return startOfDay(
      dates[0]
    );

  }


  /* =========================================
     PERIOD RANGE
     ========================================= */

  function rangeFor(
    period,
    programStartDate
  ) {

    const now =
      new Date();


    let start =
      startOfDay(
        now
      );


    const end =
      endOfDay(
        now
      );


    if (
      period ===
      "weekly"
    ) {

      start =
        startOfDay(
          now
        );


      start.setDate(
        start.getDate() - 6
      );

    }


    if (
      period ===
      "monthly"
    ) {

      start =
        startOfDay(

          new Date(
            now.getFullYear(),
            now.getMonth(),
            1
          )

        );

    }


    if (
      period ===
      "todate"
    ) {

      start =
        startOfDay(
          programStartDate
        );

    }


    if (
      start <
      programStartDate
    ) {

      start =
        startOfDay(
          programStartDate
        );

    }


    return {
      start,
      end
    };

  }


  /* =========================================
     FUEL TOTALS
     ========================================= */

  function dayFuelTotals(
    day
  ) {

    const totals = {

      calories:0,

      protein:0,

      water:
        Number(
          day?.water || 0
        )

    };


    Object.values(
      day?.meals || {}
    )
      .forEach(
        items => {

          (
            items || []
          )
            .forEach(
              item => {

                totals.calories +=
                  Number(
                    item.calories || 0
                  );


                totals.protein +=
                  Number(
                    item.protein || 0
                  );

              }
            );

        }
      );


    return totals;

  }


  /* =========================================
     NUTRITION SCORE
     ========================================= */

  function nutritionStats(
    fuel,
    targets,
    range
  ) {

    const keys =
      datesBetween(
        range.start,
        range.end
      );


    if (
      !keys.length
    ) {

      return {
        water:null,
        calories:null,
        protein:null
      };

    }


    let waterSum =
      0;

    let calorieSum =
      0;

    let proteinSum =
      0;


    keys.forEach(
      key => {

        const totals =
          dayFuelTotals(
            fuel[key] || {}
          );


        if (
          targets.water > 0
        ) {

          waterSum +=
            clamp(
              totals.water /
              targets.water *
              100,
              0,
              100
            );

        }


        if (
          targets.protein > 0
        ) {

          proteinSum +=
            clamp(
              totals.protein /
              targets.protein *
              100,
              0,
              100
            );

        }


        if (
          targets.calories > 0
        ) {

          const difference =
            Math.abs(
              totals.calories -
              targets.calories
            );


          const score =
            100 -
            (
              difference /
              targets.calories *
              100
            );


          calorieSum +=
            clamp(
              score,
              0,
              100
            );

        }

      }
    );


    return {

      water:
        targets.water > 0
          ? Math.round(
              waterSum /
              keys.length
            )
          : null,

      calories:
        targets.calories > 0
          ? Math.round(
              calorieSum /
              keys.length
            )
          : null,

      protein:
        targets.protein > 0
          ? Math.round(
              proteinSum /
              keys.length
            )
          : null

    };

  }


  /* =========================================
     WORKOUT STATS
     ========================================= */

  function workoutStats(
    state,
    range
  ) {

    const records =
      completionRecords(
        state
      );


    if (
      selectedPeriod ===
      "todate"
    ) {

      return {

        count:
          state.completed.length,

        display:
          `${state.completed.length} of 28`

      };

    }


    const count =
      records
        .filter(
          record =>

            record.date &&

            record.date >=
              range.start &&

            record.date <=
              range.end

        )
        .length;


    return {

      count,

      display:
        String(
          count
        )

    };

  }


  /* =========================================
     RECOVERY
     ========================================= */

  function isRecoveryDay(
    day
  ) {

    const dayOfWeek =
      (
        Number(day) - 1
      ) % 7 + 1;


    return (
      dayOfWeek === 4 ||
      dayOfWeek === 7
    );

  }


  function recoveryStats(
    state,
    range
  ) {

    const records =
      completionRecords(
        state
      );


    if (
      selectedPeriod ===
      "todate"
    ) {

      const completed =
        state.completed
          .filter(
            isRecoveryDay
          )
          .length;


      const furthestDay =
        Math.max(
          0,
          ...state.completed
        );


      let available =
        0;


      for (
        let day = 1;
        day <= furthestDay;
        day += 1
      ) {

        if (
          isRecoveryDay(
            day
          )
        ) {

          available += 1;

        }

      }


      return {

        display:
          available
            ? `${completed} of ${available}`
            : "0",

        sub:
          "recovery sessions completed"

      };

    }


    const completed =
      records
        .filter(
          record =>

            record.date &&

            record.date >=
              range.start &&

            record.date <=
              range.end &&

            isRecoveryDay(
              record.day
            )

        )
        .length;


    return {

      display:
        String(
          completed
        ),

      sub:
        completed === 1
          ? "recovery session"
          : "recovery sessions"

    };

  }


  /* =========================================
     PERIOD TEXT
     ========================================= */

  function periodText() {

    if (
      selectedPeriod ===
      "daily"
    ) {

      return "TODAY";

    }


    if (
      selectedPeriod ===
      "weekly"
    ) {

      return "LAST 7 DAYS";

    }


    if (
      selectedPeriod ===
      "monthly"
    ) {

      return "THIS MONTH";

    }


    return "PROGRAM TO DATE";

  }


  /* =========================================
     BAR
     ========================================= */

  function progressBar(
    value
  ) {

    const width =
      clamp(
        Number(
          value || 0
        ),
        0,
        100
      );


    return `

      <div
        class="mana-v981-mini-bar"
      >

        <span
          style="width:${width}%"
        ></span>

      </div>

    `;

  }


  /* =========================================
     METRIC CARD
     ========================================= */

  function metricCard({
    icon,
    label,
    value,
    sub,
    progress = null,
    wide = false
  }) {

    return `

      <div
        class="
          mana-v981-metric
          ${wide ? "wide" : ""}
        "
      >

        <div
          class="mana-v981-metric-head"
        >

          <div
            class="mana-v981-icon"
          >
            ${esc(icon)}
          </div>


          <div
            class="mana-v981-label"
          >
            ${esc(label)}
          </div>

        </div>


        <div
          class="mana-v981-value"
        >
          ${esc(value)}
        </div>


        <div
          class="mana-v981-sub"
        >
          ${esc(sub)}
        </div>


        ${
          progress !== null

            ? progressBar(
                progress
              )

            : ""
        }

      </div>

    `;

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

      .mana-v981-root{

        width:100%;

        max-width:760px;

        margin:
          0 auto 38px;

      }


      /* =====================================
         HEADER
         ===================================== */

      .mana-v981-head{

        position:relative;

        margin-bottom:
          17px;

        padding-bottom:
          15px;

        border-bottom:
          1px solid
          #28241a;

      }


      .mana-v981-head::after{

        content:"";

        position:absolute;

        left:0;

        bottom:-1px;

        width:84px;

        height:2px;

        background:
          linear-gradient(
            90deg,
            #f1d674,
            transparent
          );

      }


      .mana-v981-kicker{

        color:#d6b74e;

        font-size:10px;

        font-weight:950;

        letter-spacing:.17em;

      }


      .mana-v981-head h2{

        margin:
          7px 0 5px;

        color:#fff;

        font-size:30px;

        font-weight:950;

        line-height:1.03;

      }


      .mana-v981-head p{

        max-width:560px;

        margin:0;

        color:#999;

        font-size:13px;

        line-height:1.5;

      }


      /* =====================================
         PERIOD TABS
         ===================================== */

      .mana-v981-periods{

        display:grid;

        grid-template-columns:
          repeat(
            4,
            minmax(0,1fr)
          );

        gap:5px;

        padding:5px;

        margin-bottom:
          14px;

        border:
          1px solid
          #282828;

        border-radius:
          16px;

        background:
          #080808;

      }


      .mana-v981-period{

        min-height:
          44px;

        padding:
          0 4px;

        border:0;

        border-radius:
          11px;

        background:
          transparent;

        color:
          #777;

        font-size:
          10px;

        font-weight:
          950;

        cursor:pointer;

      }


      .mana-v981-period.active{

        background:
          linear-gradient(
            145deg,
            #f5dc79,
            #c99f2f
          );

        color:
          #111;

        box-shadow:
          0 8px 24px
          rgba(
            212,
            175,
            55,
            .12
          );

      }


      /* =====================================
         MAIN PROGRESS HERO
         ===================================== */

      .mana-v981-hero{

        position:relative;

        overflow:hidden;

        margin-bottom:
          11px;

        padding:
          20px;

        border:
          1px solid
          #3c351d;

        border-radius:
          20px;

        background:
          linear-gradient(
            145deg,
            #18160f,
            #0a0a09
          );

        box-shadow:
          0 10px 30px
          rgba(
            0,
            0,
            0,
            .18
          );

      }


      .mana-v981-hero::before{

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
            #e5c75f,
            transparent
          );

      }


      .mana-v981-period-label{

        color:
          #a59050;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .15em;

      }


      .mana-v981-complete{

        margin-top:
          9px;

        color:
          #fff;

        font-size:
          35px;

        font-weight:
          950;

        line-height:
          1;

      }


      .mana-v981-complete span{

        color:
          #f2d875;

      }


      .mana-v981-complete-sub{

        margin-top:
          8px;

        color:
          #aaa;

        font-size:
          11px;

        font-weight:
          850;

        letter-spacing:
          .03em;

      }


      .mana-v981-main-bar{

        height:
          9px;

        margin-top:
          16px;

        overflow:hidden;

        border-radius:
          999px;

        background:
          #24221b;

      }


      .mana-v981-main-bar span{

        display:block;

        height:
          100%;

        border-radius:
          999px;

        background:
          linear-gradient(
            90deg,
            #c89e2d,
            #f4da77
          );

      }


      /* =====================================
         METRICS
         ===================================== */

      .mana-v981-grid{

        display:grid;

        grid-template-columns:
          repeat(
            2,
            minmax(0,1fr)
          );

        gap:
          10px;

      }


      .mana-v981-metric{

        min-height:
          146px;

        padding:
          15px;

        border:
          1px solid
          #292820;

        border-radius:
          18px;

        background:
          linear-gradient(
            145deg,
            #13120e,
            #090909
          );

        box-shadow:
          0 8px 24px
          rgba(
            0,
            0,
            0,
            .12
          );

      }


      .mana-v981-metric.wide{

        grid-column:
          1 / -1;

        min-height:
          132px;

      }


      .mana-v981-metric-head{

        display:flex;

        align-items:center;

        gap:
          8px;

      }


      .mana-v981-icon{

        width:
          30px;

        height:
          30px;

        display:grid;

        place-items:center;

        border:
          1px solid
          #453b1b;

        border-radius:
          9px;

        background:
          #18150d;

        color:
          #efd16c;

        font-size:
          10px;

        font-weight:
          950;

      }


      .mana-v981-label{

        color:
          #979797;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .12em;

        text-transform:
          uppercase;

      }


      .mana-v981-value{

        margin-top:
          13px;

        color:
          #fff;

        font-size:
          27px;

        font-weight:
          950;

        line-height:
          1;

      }


      .mana-v981-sub{

        min-height:
          30px;

        margin-top:
          7px;

        color:
          #858585;

        font-size:
          11px;

        line-height:
          1.4;

      }


      .mana-v981-mini-bar{

        height:
          6px;

        margin-top:
          11px;

        overflow:hidden;

        border-radius:
          999px;

        background:
          #242424;

      }


      .mana-v981-mini-bar span{

        display:block;

        height:
          100%;

        border-radius:
          999px;

        background:
          #e2c159;

      }


      /* =====================================
         MESSAGE
         ===================================== */

      .mana-v981-message{

        position:relative;

        margin-top:
          11px;

        overflow:hidden;

        padding:
          14px 15px;

        border:
          1px solid
          #2b291f;

        border-radius:
          15px;

        background:
          #0c0c0a;

        color:
          #858585;

        font-size:
          11px;

        line-height:
          1.55;

      }


      .mana-v981-message::before{

        content:"";

        position:absolute;

        top:0;

        left:0;

        bottom:0;

        width:
          3px;

        background:
          #d3b141;

      }


      .mana-v981-message strong{

        color:
          #d9bd60;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:420px){

        .mana-v981-root{

          margin-bottom:
            24px;

        }


        .mana-v981-head{

          margin-bottom:
            14px;

        }


        .mana-v981-head h2{

          font-size:
            27px;

        }


        .mana-v981-periods{

          gap:
            3px;

          padding:
            4px;

          border-radius:
            14px;

        }


        .mana-v981-period{

          min-height:
            41px;

          padding:
            0 2px;

          font-size:
            9px;

        }


        .mana-v981-hero{

          padding:
            17px;

          border-radius:
            18px;

        }


        .mana-v981-complete{

          font-size:
            30px;

        }


        .mana-v981-grid{

          gap:
            8px;

        }


        .mana-v981-metric{

          min-height:
            137px;

          padding:
            13px;

          border-radius:
            16px;

        }


        .mana-v981-metric.wide{

          min-height:
            126px;

        }


        .mana-v981-value{

          font-size:
            24px;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     RENDER
     ========================================= */

  function renderProgress() {

    if (
      !isOpen()
    ) {

      return;

    }


    const holder =
      content();


    if (!holder) {

      return;

    }


    const state =
      loadProgram();


    const fuel =
      loadFuel();


    const targets =
      loadTargets();


    const start =
      programStart(
        state,
        fuel
      );


    const range =
      rangeFor(
        selectedPeriod,
        start
      );


    const nutrition =
      nutritionStats(
        fuel,
        targets,
        range
      );


    const workouts =
      workoutStats(
        state,
        range
      );


    const recovery =
      recoveryStats(
        state,
        range
      );


    const totalComplete =
      state.completed.length;


    const overallPercent =
      clamp(
        Math.round(
          totalComplete /
          28 *
          100
        ),
        0,
        100
      );


    const water =
      nutrition.water === null
        ? "—"
        : `${nutrition.water}%`;


    const calories =
      nutrition.calories === null
        ? "—"
        : `${nutrition.calories}%`;


    const protein =
      nutrition.protein === null
        ? "—"
        : `${nutrition.protein}%`;


    holder.innerHTML = `

      <div
        class="mana-v981-root"
      >

        <div
          class="mana-v981-head"
        >

          <div
            class="mana-v981-kicker"
          >
            MANA 28 • PROGRESS
          </div>


          <h2>
            Your Progress
          </h2>


          <p>
            A clear snapshot of your training,
            nutrition, hydration and recovery.
          </p>

        </div>


        <div
          class="mana-v981-periods"
        >

          ${[
            ["daily","DAILY"],
            ["weekly","WEEKLY"],
            ["monthly","MONTHLY"],
            ["todate","TO DATE"]
          ]
            .map(
              item => `

                <button
                  type="button"

                  class="
                    mana-v981-period
                    ${
                      selectedPeriod ===
                      item[0]
                        ? "active"
                        : ""
                    }
                  "

                  data-v981-period="${item[0]}"
                >
                  ${item[1]}
                </button>

              `
            )
            .join("")}

        </div>


        <div
          class="mana-v981-hero"
        >

          <div
            class="mana-v981-period-label"
          >
            ${periodText()}
          </div>


          <div
            class="mana-v981-complete"
          >
            <span>
              ${totalComplete}
            </span>
            OF 28
          </div>


          <div
            class="mana-v981-complete-sub"
          >
            WORKOUTS COMPLETE
            • ${overallPercent}%
          </div>


          <div
            class="mana-v981-main-bar"
          >

            <span
              style="
                width:${overallPercent}%
              "
            ></span>

          </div>

        </div>


        <div
          class="mana-v981-grid"
        >

          ${metricCard({
            icon:"01",
            label:"Workouts",
            value:
              workouts.display,
            sub:
              selectedPeriod ===
              "todate"

                ? "completed across Mana 28"

                : `${
                    workouts.count
                  } completed in this period`,
            wide:true
          })}


          ${metricCard({
            icon:"W",
            label:"Water",
            value:
              water,
            sub:
              nutrition.water === null

                ? "Set your Fuel target"

                : "average water target achieved",
            progress:
              nutrition.water
          })}


          ${metricCard({
            icon:"C",
            label:"Calories",
            value:
              calories,
            sub:
              nutrition.calories === null

                ? "Set your Fuel target"

                : "average calorie target accuracy",
            progress:
              nutrition.calories
          })}


          ${metricCard({
            icon:"P",
            label:"Protein",
            value:
              protein,
            sub:
              nutrition.protein === null

                ? "Set your Fuel target"

                : "average protein target achieved",
            progress:
              nutrition.protein
          })}


          ${metricCard({
            icon:"R",
            label:"Recovery",
            value:
              recovery.display,
            sub:
              recovery.sub
          })}

        </div>


        <div
          class="mana-v981-message"
        >

          <strong>
            Consistency over perfection.
          </strong>

          Stack your workouts,
          water, useful nutrition
          and recovery across the
          full 28 days.

        </div>

      </div>

    `;


    holder
      .querySelectorAll(
        "[data-v981-period]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              selectedPeriod =
                button.dataset
                  .v981Period;


              renderProgress();

            }
          );

        }
      );

  }


  /* =========================================
     SCHEDULE
     ========================================= */

  function scheduleRender() {

    [
      80,
      180,
      320
    ]
      .forEach(
        delay => {

          setTimeout(
            renderProgress,
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
            "#manaV83Tabs," +
            "#manaV80Mana28"
          )
        ) {

          scheduleRender();

        }

      },
      true
    );


    window.MANA28_PROGRESS_BUILD =
      BUILD;


    console.log(
      "[Mana v9.81.0] Mana 28 Progress ready"
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
