/* =========================================
   MANA MOVEMENT TRAINING v9.81.2
   MANA 28 — PREMIUM PROGRESS

   FILTERS
   - DAILY
   - WEEKLY
   - MONTHLY
   - TO DATE

   ALL METRICS RESPOND TO FILTER

   - WORKOUTS %
   - WATER %
   - CALORIES %
   - PROTEIN %
   - RECOVERY %

   RECOVERY TARGET
   - 8 HOURS DAILY

   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "98120";

  const STYLE_ID =
    "mana-v981-progress-style";

  const PROGRAM_KEY =
    "mana-v973-mana28-state";

  const FUEL_KEY =
    "mana-fuel-v571";

  const TARGET_KEY =
    "mana-fuel-v58-targets";

  const RECOVERY_TARGET =
    8;

  let selectedPeriod =
    "daily";


  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(raw,fallback) {

    try {
      return JSON.parse(raw);
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


  function shell() {

    return document.getElementById(
      "manaV83ProgramShell"
    );

  }


  function holder() {

    return document.getElementById(
      "manaV83Content"
    );

  }


  function activeTab() {

    return (
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      )
      ?.dataset
      ?.v83Tab
      || ""
    );

  }


  function title() {

    return (
      document
        .getElementById(
          "manaV83Title"
        )
        ?.textContent
        ?.trim()
        ?.toUpperCase()
      || ""
    );

  }


  function progressOpen() {

    return Boolean(

      shell()
        ?.classList
        .contains(
          "open"
        )

      &&

      title() ===
        "MANA 28"

      &&

      activeTab() ===
        "progress"

    );

  }


  /* =========================================
     DATE HELPERS
     ========================================= */

  function startOfDay(input) {

    const d =
      new Date(input);

    d.setHours(
      0,0,0,0
    );

    return d;

  }


  function endOfDay(input) {

    const d =
      new Date(input);

    d.setHours(
      23,59,59,999
    );

    return d;

  }


  function dateKey(input) {

    const d =
      new Date(input);


    return [

      d.getFullYear(),

      String(
        d.getMonth() + 1
      ).padStart(
        2,
        "0"
      ),

      String(
        d.getDate()
      ).padStart(
        2,
        "0"
      )

    ].join("-");

  }


  function parseDateKey(key) {

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


    const d =
      new Date(
        parts[0],
        parts[1] - 1,
        parts[2]
      );


    return Number.isNaN(
      d.getTime()
    )
      ? null
      : d;

  }


  function datesBetween(
    start,
    end
  ) {

    const result = [];

    const cursor =
      startOfDay(start);

    const finish =
      startOfDay(end);

    let guard =
      0;


    while (
      cursor <= finish &&
      guard < 370
    ) {

      result.push(
        dateKey(cursor)
      );


      cursor.setDate(
        cursor.getDate() + 1
      );


      guard += 1;

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

      state.completed =
        [];

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

    const data =
      safeJson(
        localStorage.getItem(
          TARGET_KEY
        ) || "{}",
        {}
      );


    return {

      calories:
        Number(
          data.calories || 0
        ),

      protein:
        Number(
          data.protein || 0
        ),

      water:
        Number(
          data.water || 0
        )

    };

  }


  /* =========================================
     WORKOUT COMPLETION RECORDS
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


          const raw =
            record.completedAt
            ||
            record.date
            ||
            null;


          let date =
            null;


          if (raw) {

            const parsed =
              new Date(raw);


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

    const dates =
      [];


    if (
      state.startedAt
    ) {

      const parsed =
        new Date(
          state.startedAt
        );


      if (
        !Number.isNaN(
          parsed.getTime()
        )
      ) {

        dates.push(
          parsed
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

          const parsed =
            parseDateKey(
              key
            );


          if (parsed) {

            dates.push(
              parsed
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
     SELECTED PERIOD
     ========================================= */

  function periodRange(
    startDate
  ) {

    const now =
      new Date();


    let start =
      startOfDay(now);


    const end =
      endOfDay(now);


    if (
      selectedPeriod ===
      "weekly"
    ) {

      start.setDate(
        start.getDate() - 6
      );

    }


    if (
      selectedPeriod ===
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
      selectedPeriod ===
      "todate"
    ) {

      start =
        startOfDay(
          startDate
        );

    }


    if (
      start <
      startDate
    ) {

      start =
        startOfDay(
          startDate
        );

    }


    return {
      start,
      end
    };

  }


  function periodName() {

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
     DAILY FUEL TOTALS
     ========================================= */

  function dayTotals(day) {

    const totals = {

      calories:0,

      protein:0,

      water:
        Number(
          day?.water || 0
        ),

      recovery:
        Number(
          day?.recoveryHours || 0
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
     PERIOD METRICS
     ========================================= */

  function periodMetrics(
    state,
    fuel,
    targets,
    range
  ) {

    const dates =
      datesBetween(
        range.start,
        range.end
      );


    const records =
      completionRecords(
        state
      );


    const workoutCount =
      selectedPeriod ===
      "todate"

        ? state.completed.length

        : records
            .filter(
              record =>

                record.date

                &&

                record.date >=
                  range.start

                &&

                record.date <=
                  range.end
            )
            .length;


    let workoutTarget;


    if (
      selectedPeriod ===
      "todate"
    ) {

      workoutTarget =
        28;

    } else {

      workoutTarget =
        Math.max(
          1,
          dates.length
        );

    }


    const workoutPct =
      clamp(
        Math.round(
          workoutCount /
          workoutTarget *
          100
        ),
        0,
        100
      );


    let waterScore =
      0;

    let calorieScore =
      0;

    let proteinScore =
      0;

    let recoveryScore =
      0;

    let recoveryHours =
      0;


    dates.forEach(
      key => {

        const totals =
          dayTotals(
            fuel[key] || {}
          );


        if (
          targets.water > 0
        ) {

          waterScore +=
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

          proteinScore +=
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


          calorieScore +=
            clamp(
              100 -
              (
                difference /
                targets.calories *
                100
              ),
              0,
              100
            );

        }


        recoveryHours +=
          totals.recovery;


        recoveryScore +=
          clamp(
            totals.recovery /
            RECOVERY_TARGET *
            100,
            0,
            100
          );

      }
    );


    const dayCount =
      Math.max(
        1,
        dates.length
      );


    return {

      workouts:{
        percent:
          workoutPct,

        count:
          workoutCount,

        target:
          workoutTarget
      },


      water:{
        percent:
          targets.water > 0

            ? Math.round(
                waterScore /
                dayCount
              )

            : null
      },


      calories:{
        percent:
          targets.calories > 0

            ? Math.round(
                calorieScore /
                dayCount
              )

            : null
      },


      protein:{
        percent:
          targets.protein > 0

            ? Math.round(
                proteinScore /
                dayCount
              )

            : null
      },


      recovery:{
        percent:
          Math.round(
            recoveryScore /
            dayCount
          ),

        hours:
          Math.round(
            recoveryHours * 10
          ) / 10,

        targetHours:
          dayCount *
          RECOVERY_TARGET
      }

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

      .mana-v981-root{
        width:100%;
        max-width:780px;
        margin:0 auto 40px;
      }


      .mana-v981-head{
        position:relative;
        margin-bottom:17px;
        padding-bottom:15px;
        border-bottom:1px solid #29251b;
      }


      .mana-v981-head::after{
        content:"";
        position:absolute;
        bottom:-1px;
        left:0;
        width:86px;
        height:2px;
        background:
          linear-gradient(
            90deg,
            #f2d875,
            transparent
          );
      }


      .mana-v981-kicker{
        color:#d8b850;
        font-size:10px;
        font-weight:950;
        letter-spacing:.17em;
      }


      .mana-v981-head h2{
        margin:7px 0 6px;
        color:#fff;
        font-size:31px;
        font-weight:950;
        line-height:1.03;
      }


      .mana-v981-head p{
        margin:0;
        max-width:590px;
        color:#999;
        font-size:13px;
        line-height:1.5;
      }


      .mana-v981-periods{
        display:grid;
        grid-template-columns:
          repeat(
            4,
            minmax(0,1fr)
          );
        gap:5px;
        padding:5px;
        margin-bottom:14px;
        border:1px solid #292929;
        border-radius:17px;
        background:#080808;
      }


      .mana-v981-period{
        min-height:44px;
        border:0;
        border-radius:11px;
        background:transparent;
        color:#777;
        font-size:10px;
        font-weight:950;
        cursor:pointer;
      }


      .mana-v981-period.active{
        background:
          linear-gradient(
            145deg,
            #f5dc7a,
            #c89e2d
          );
        color:#111;
      }


      .mana-v981-overall{
        position:relative;
        overflow:hidden;
        margin-bottom:11px;
        padding:18px;
        border:1px solid #40371d;
        border-radius:20px;
        background:
          linear-gradient(
            145deg,
            #19170f,
            #090909
          );
      }


      .mana-v981-overall::before{
        content:"";
        position:absolute;
        top:0;
        left:24px;
        right:24px;
        height:2px;
        background:
          linear-gradient(
            90deg,
            transparent,
            #e7c961,
            transparent
          );
      }


      .mana-v981-overall-label{
        color:#a89351;
        font-size:9px;
        font-weight:950;
        letter-spacing:.15em;
      }


      .mana-v981-overall-value{
        margin-top:8px;
        color:#fff;
        font-size:30px;
        font-weight:950;
      }


      .mana-v981-overall-value span{
        color:#f2d875;
      }


      .mana-v981-overall-bar,
      .mana-v981-bar{
        height:7px;
        overflow:hidden;
        border-radius:999px;
        background:#25231c;
      }


      .mana-v981-overall-bar{
        margin-top:13px;
      }


      .mana-v981-overall-bar span,
      .mana-v981-bar span{
        display:block;
        height:100%;
        border-radius:999px;
        background:
          linear-gradient(
            90deg,
            #c69c2c,
            #f3d875
          );
      }


      .mana-v981-section{
        margin:
          16px 2px 9px;
        color:#ddd;
        font-size:11px;
        font-weight:950;
        letter-spacing:.11em;
      }


      .mana-v981-grid{
        display:grid;
        grid-template-columns:
          repeat(
            2,
            minmax(0,1fr)
          );
        gap:10px;
      }


      .mana-v981-card{
        min-height:145px;
        padding:15px;
        border:1px solid #292820;
        border-radius:18px;
        background:
          linear-gradient(
            145deg,
            #13120e,
            #090909
          );
      }


      .mana-v981-card.workout{
        grid-column:1 / -1;
        min-height:130px;
      }


      .mana-v981-card-head{
        display:flex;
        align-items:center;
        gap:8px;
      }


      .mana-v981-icon{
        width:31px;
        height:31px;
        display:grid;
        place-items:center;
        border:1px solid #463b1b;
        border-radius:10px;
        background:#18150d;
        color:#f0d26d;
        font-size:10px;
        font-weight:950;
      }


      .mana-v981-label{
        color:#999;
        font-size:9px;
        font-weight:950;
        letter-spacing:.12em;
      }


      .mana-v981-value{
        margin-top:13px;
        color:#fff;
        font-size:27px;
        font-weight:950;
        line-height:1;
      }


      .mana-v981-sub{
        min-height:29px;
        margin-top:7px;
        color:#858585;
        font-size:11px;
        line-height:1.4;
      }


      .mana-v981-bar{
        margin-top:10px;
      }


      .mana-v981-message{
        position:relative;
        margin-top:11px;
        overflow:hidden;
        padding:14px 15px;
        border:1px solid #2b291f;
        border-radius:15px;
        background:#0c0c0a;
        color:#858585;
        font-size:11px;
        line-height:1.55;
      }


      .mana-v981-message::before{
        content:"";
        position:absolute;
        top:0;
        bottom:0;
        left:0;
        width:3px;
        background:#d3b141;
      }


      .mana-v981-message strong{
        color:#d9bd60;
      }


      @media(max-width:420px){

        .mana-v981-head h2{
          font-size:27px;
        }


        .mana-v981-periods{
          gap:3px;
          padding:4px;
        }


        .mana-v981-period{
          min-height:41px;
          font-size:9px;
        }


        .mana-v981-grid{
          gap:8px;
        }


        .mana-v981-card{
          min-height:137px;
          padding:13px;
          border-radius:16px;
        }


        .mana-v981-value{
          font-size:24px;
        }

      }

    `;


    document.head
      .appendChild(style);

  }


  /* =========================================
     CARD
     ========================================= */

  function card(
    icon,
    label,
    value,
    sub,
    percentage,
    extraClass = ""
  ) {

    const pct =
      percentage === null

        ? 0

        : clamp(
            Number(percentage),
            0,
            100
          );


    return `

      <div
        class="
          mana-v981-card
          ${extraClass}
        "
      >

        <div
          class="mana-v981-card-head"
        >

          <div
            class="mana-v981-icon"
          >
            ${icon}
          </div>


          <div
            class="mana-v981-label"
          >
            ${label}
          </div>

        </div>


        <div
          class="mana-v981-value"
        >
          ${
            percentage === null
              ? "—"
              : value
          }
        </div>


        <div
          class="mana-v981-sub"
        >
          ${sub}
        </div>


        <div
          class="mana-v981-bar"
        >
          <span
            style="
              width:${pct}%
            "
          ></span>
        </div>

      </div>

    `;

  }


  /* =========================================
     RENDER
     ========================================= */

  function renderProgress() {

    if (
      !progressOpen()
    ) {
      return;
    }


    const root =
      holder();


    if (!root) {
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
      periodRange(
        start
      );


    const metrics =
      periodMetrics(
        state,
        fuel,
        targets,
        range
      );


    const overall =
      clamp(
        Math.round(
          state.completed.length /
          28 *
          100
        ),
        0,
        100
      );


    root.innerHTML = `

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
            See how your training,
            nutrition, hydration and
            recovery are tracking.
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
                      item[0] ===
                      selectedPeriod
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
          class="mana-v981-overall"
        >

          <div
            class="mana-v981-overall-label"
          >
            OVERALL PROGRAM
          </div>


          <div
            class="mana-v981-overall-value"
          >
            <span>
              ${state.completed.length}
            </span>
            OF 28 COMPLETE
          </div>


          <div
            class="mana-v981-overall-bar"
          >
            <span
              style="
                width:${overall}%
              "
            ></span>
          </div>

        </div>


        <div
          class="mana-v981-section"
        >
          ${periodName()}
        </div>


        <div
          class="mana-v981-grid"
        >

          ${card(
            "W/O",
            "WORKOUTS",
            `${metrics.workouts.percent}%`,
            `${metrics.workouts.count} of ${metrics.workouts.target} program days completed`,
            metrics.workouts.percent,
            "workout"
          )}


          ${card(
            "W",
            "WATER",
            `${metrics.water.percent ?? 0}%`,
            metrics.water.percent === null
              ? "Set your Fuel water target"
              : "average target achieved",
            metrics.water.percent
          )}


          ${card(
            "R",
            "RECOVERY",
            `${metrics.recovery.percent}%`,
            `${metrics.recovery.hours} of ${metrics.recovery.targetHours} hrs logged`,
            metrics.recovery.percent
          )}


          ${card(
            "C",
            "CALORIES",
            `${metrics.calories.percent ?? 0}%`,
            metrics.calories.percent === null
              ? "Set your Fuel calorie target"
              : "average target accuracy",
            metrics.calories.percent
          )}


          ${card(
            "P",
            "PROTEIN",
            `${metrics.protein.percent ?? 0}%`,
            metrics.protein.percent === null
              ? "Set your Fuel protein target"
              : "average target achieved",
            metrics.protein.percent
          )}

        </div>


        <div
          class="mana-v981-message"
        >

          <strong>
            Consistency over perfection.
          </strong>

          Use the period buttons above
          to see exactly how today,
          your week, your month and
          your full Mana 28 journey
          are tracking.

        </div>

      </div>

    `;


    root
      .querySelectorAll(
        "[data-v981-period]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              selectedPeriod =
                button.dataset
                  .v981Period;


              renderProgress();

            };

        }
      );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function renderSoon() {

    queueMicrotask(
      renderProgress
    );

  }


  function init() {

    installStyles();


    renderSoon();


    window.addEventListener(
      "mana:program-tab-change",
      renderSoon
    );


    window.addEventListener(
      "mana:recovery-updated",
      renderSoon
    );


    window.addEventListener(
      "mana:fuel-updated",
      renderSoon
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

          renderSoon();

        }

      },
      true
    );


    window.MANA28_PROGRESS_BUILD =
      BUILD;


    console.log(
      "[Mana v9.81.2] filtered premium progress ready"
    );

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );

  } else {

    init();

  }

})();
