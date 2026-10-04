/* =========================================
   MANA MOVEMENT TRAINING v9.81.3
   MANA 28 — PREMIUM PROGRESS

   FIXES
   - MANA 28 DATES COME ONLY FROM MANA 28
   - NO OLD STRENGTH / FUEL HISTORY
     USED TO START THE PROGRAM
   - WEEKLY = CURRENT MANA 28 PROGRAM WEEK
   - MONTHLY = PROGRAM DAYS IN CURRENT MONTH
   - TO DATE = ACTUAL PROGRAM DAYS ELAPSED
   - RECOVERY READS FROM FUEL recoveryHours
   - WORKOUTS / WATER / RECOVERY /
     CALORIES / PROTEIN ALL RESPOND
     TO THE PERIOD BUTTONS

   ========================================= */

(() => {
  "use strict";

  const BUILD = "98130";

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

  const PROGRAM_DAYS =
    28;

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


  function activeTab() {

    return (
      document
        .querySelector(
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


  function addDays(
    input,
    amount
  ) {

    const date =
      startOfDay(
        input
      );


    date.setDate(
      date.getDate() +
      Number(
        amount || 0
      )
    );


    return date;

  }


  function daysBetween(
    start,
    end
  ) {

    const a =
      startOfDay(
        start
      );


    const b =
      startOfDay(
        end
      );


    return Math.floor(
      (
        b.getTime() -
        a.getTime()
      )
      /
      86400000
    );

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


  function datesBetween(
    start,
    end
  ) {

    const dates = [];

    let cursor =
      startOfDay(
        start
      );

    const finish =
      startOfDay(
        end
      );

    let guard =
      0;


    while (
      cursor <= finish &&
      guard < 40
    ) {

      dates.push(
        dateKey(
          cursor
        )
      );


      cursor =
        addDays(
          cursor,
          1
        );


      guard += 1;

    }


    return dates;

  }


  function shortDate(
    input
  ) {

    return new Date(
      input
    )
      .toLocaleDateString(
        undefined,
        {
          day:"numeric",
          month:"short"
        }
      );

  }


  /* =========================================
     DATA
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
              new Date(
                raw
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
              Number(
                day
              ),

            date

          };

        }
      )
      .filter(
        record =>
          record.day >= 1 &&
          record.day <= 28
      );

  }


  /* =========================================
     MANA 28 START DATE

     IMPORTANT:
     NO FUEL DATES ARE USED HERE.

     IF DAY 6 WAS COMPLETED ON OCT 5,
     WE CAN INFER DAY 1 WAS SEP 30.
     ========================================= */

  function programStart(
    state
  ) {

    if (
      state.startedAt
    ) {

      const explicit =
        new Date(
          state.startedAt
        );


      if (
        !Number.isNaN(
          explicit.getTime()
        )
      ) {

        return startOfDay(
          explicit
        );

      }

    }


    const inferred = [];


    completionRecords(
      state
    )
      .forEach(
        record => {

          if (
            !record.date
          ) {

            return;

          }


          inferred.push(

            addDays(
              record.date,
              -(
                record.day - 1
              )
            )

          );

        }
      );


    if (
      inferred.length
    ) {

      inferred.sort(
        (a,b) =>
          a.getTime() -
          b.getTime()
      );


      return startOfDay(
        inferred[0]
      );

    }


    return startOfDay(
      new Date()
    );

  }


  function programEnd(
    start
  ) {

    return addDays(
      start,
      PROGRAM_DAYS - 1
    );

  }


  function programDayNumber(
    start,
    date = new Date()
  ) {

    return (
      daysBetween(
        start,
        date
      ) + 1
    );

  }


  /* =========================================
     PERIODS
     ========================================= */

  function periodRange(
    programStartDate
  ) {

    const today =
      startOfDay(
        new Date()
      );


    const programFinish =
      programEnd(
        programStartDate
      );


    const currentDay =
      programDayNumber(
        programStartDate,
        today
      );


    /*
      DAILY
    */

    if (
      selectedPeriod ===
      "daily"
    ) {

      return {

        start:
          today,

        end:
          today,

        dataEnd:
          today,

        workoutTarget:
          (
            currentDay >= 1 &&
            currentDay <= 28
          )
            ? 1
            : 0,

        label:
          "TODAY",

        detail:
          shortDate(
            today
          )

      };

    }


    /*
      WEEKLY

      Week 1 = Days 1–7
      Week 2 = Days 8–14
      etc.
    */

    if (
      selectedPeriod ===
      "weekly"
    ) {

      const safeDay =
        clamp(
          currentDay,
          1,
          28
        );


      const weekIndex =
        Math.floor(
          (
            safeDay - 1
          )
          /
          7
        );


      const weekStart =
        addDays(
          programStartDate,
          weekIndex * 7
        );


      const weekEnd =
        addDays(
          weekStart,
          6
        );


      return {

        start:
          weekStart,

        end:
          weekEnd,

        dataEnd:
          today < weekEnd
            ? today
            : weekEnd,

        workoutTarget:
          7,

        label:
          `WEEK ${weekIndex + 1}`,

        detail:
          `${shortDate(
            weekStart
          )} – ${shortDate(
            weekEnd
          )}`

      };

    }


    /*
      MONTHLY

      Only count dates that overlap
      this Mana 28 program.
    */

    if (
      selectedPeriod ===
      "monthly"
    ) {

      const monthStart =
        startOfDay(
          new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          )
        );


      const monthEnd =
        startOfDay(
          new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
          )
        );


      const start =
        monthStart >
        programStartDate

          ? monthStart

          : programStartDate;


      const end =
        monthEnd <
        programFinish

          ? monthEnd

          : programFinish;


      const valid =
        start <= end;


      const target =
        valid

          ? (
              daysBetween(
                start,
                end
              ) + 1
            )

          : 0;


      return {

        start,

        end,

        dataEnd:
          !valid
            ? start
            : (
                today < end
                  ? today
                  : end
              ),

        workoutTarget:
          target,

        label:
          today
            .toLocaleDateString(
              undefined,
              {
                month:"long"
              }
            )
            .toUpperCase(),

        detail:
          valid
            ? `${target} Mana 28 program days`
            : "No Mana 28 days this month"

      };

    }


    /*
      TO DATE

      Only elapsed Mana 28 days are used.
      Overall 28-day completion remains
      in the hero card separately.
    */

    const elapsed =
      clamp(
        currentDay,
        0,
        28
      );


    const toDateEnd =
      today <
      programFinish

        ? today

        : programFinish;


    return {

      start:
        programStartDate,

      end:
        toDateEnd,

      dataEnd:
        toDateEnd,

      workoutTarget:
        Math.max(
          0,
          elapsed
        ),

      label:
        "TO DATE",

      detail:
        elapsed > 0
          ? `${elapsed} program days elapsed`
          : "Program not started"

    };

  }


  /* =========================================
     COMPLETED WORKOUTS IN PERIOD
     ========================================= */

  function workoutCountForRange(
    state,
    range
  ) {

    if (
      range.workoutTarget <= 0
    ) {

      return 0;

    }


    return completionRecords(
      state
    )
      .filter(
        record => {

          /*
            Prefer scheduled Mana 28 day
            rather than the calendar day
            the user happened to tap Complete.
          */

          const scheduledDate =
            addDays(
              programStart(
                state
              ),
              record.day - 1
            );


          return (
            scheduledDate >=
              startOfDay(
                range.start
              )
            &&
            scheduledDate <=
              endOfDay(
                range.end
              )
          );

        }
      )
      .length;

  }


  /* =========================================
     FUEL TOTALS
     ========================================= */

  function dayTotals(
    day
  ) {

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
     METRICS
     ========================================= */

  function periodMetrics(
    state,
    fuel,
    targets,
    range
  ) {

    /*
      Fuel / recovery are only scored
      through today.

      Future days in the week/month do
      not count as missed nutrition yet.
    */

    const validDataRange =
      (
        range.workoutTarget > 0 &&
        range.dataEnd >=
          range.start
      );


    const dates =
      validDataRange

        ? datesBetween(
            range.start,
            range.dataEnd
          )

        : [];


    const workoutCount =
      workoutCountForRange(
        state,
        range
      );


    const workoutPercent =
      range.workoutTarget > 0

        ? clamp(
            Math.round(
              workoutCount /
              range.workoutTarget *
              100
            ),
            0,
            100
          )

        : 0;


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


        /*
          WATER
        */

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


        /*
          PROTEIN
        */

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


        /*
          CALORIES

          Accuracy toward target.
        */

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


        /*
          RECOVERY
        */

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
      dates.length;


    return {

      daysScored:
        dayCount,


      workouts:{

        percent:
          workoutPercent,

        count:
          workoutCount,

        target:
          range.workoutTarget

      },


      water:{

        percent:
          (
            dayCount > 0 &&
            targets.water > 0
          )

            ? Math.round(
                waterScore /
                dayCount
              )

            : null

      },


      calories:{

        percent:
          (
            dayCount > 0 &&
            targets.calories > 0
          )

            ? Math.round(
                calorieScore /
                dayCount
              )

            : null

      },


      protein:{

        percent:
          (
            dayCount > 0 &&
            targets.protein > 0
          )

            ? Math.round(
                proteinScore /
                dayCount
              )

            : null

      },


      recovery:{

        percent:
          dayCount > 0

            ? Math.round(
                recoveryScore /
                dayCount
              )

            : 0,

        hours:
          Math.round(
            recoveryHours * 10
          )
          /
          10,

        targetHours:
          dayCount *
          RECOVERY_TARGET

      }

    };

  }


  /* =========================================
     STYLE
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
        max-width:590px;
        margin:0;
        color:#999;
        font-size:13px;
        line-height:1.5;
      }


      /* PERIOD BUTTONS */

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
        touch-action:manipulation;
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


      /* JOURNEY HERO */

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


      .mana-v981-overall-sub{
        margin-top:7px;
        color:#888;
        font-size:10px;
        font-weight:800;
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


      /* PERIOD HEADER */

      .mana-v981-period-head{
        display:flex;
        justify-content:
          space-between;
        align-items:flex-end;
        gap:12px;
        margin:
          16px 2px 10px;
      }


      .mana-v981-period-name{
        color:#eee;
        font-size:12px;
        font-weight:950;
        letter-spacing:.10em;
      }


      .mana-v981-period-detail{
        color:#777;
        font-size:9px;
        font-weight:800;
        text-align:right;
      }


      /* CARDS */

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
        grid-column:
          1 / -1;
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
        font-size:9px;
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
        min-height:30px;
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


        .mana-v981-period-head{
          align-items:flex-start;
          flex-direction:column;
          gap:4px;
        }


        .mana-v981-period-detail{
          text-align:left;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     CARD
     ========================================= */

  function card(
    icon,
    label,
    percentage,
    sub,
    className = ""
  ) {

    const available =
      percentage !== null;


    const value =
      available

        ? clamp(
            Number(
              percentage
            ),
            0,
            100
          )

        : 0;


    return `

      <div
        class="
          mana-v981-card
          ${className}
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
            available
              ? `${value}%`
              : "—"
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
              width:${value}%
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
        state
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


    const totalComplete =
      state.completed
        .filter(
          day =>
            Number(day) >= 1 &&
            Number(day) <= 28
        )
        .length;


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


    const currentProgramDay =
      clamp(
        programDayNumber(
          start,
          new Date()
        ),
        1,
        28
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
            Training, nutrition,
            hydration and recovery
            across your Mana 28 journey.
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
            MANA 28 JOURNEY
          </div>


          <div
            class="mana-v981-overall-value"
          >
            <span>
              ${totalComplete}
            </span>
            OF 28 COMPLETE
          </div>


          <div
            class="mana-v981-overall-sub"
          >
            DAY ${currentProgramDay}
            • ${overallPercent}%
            OF PROGRAM COMPLETE
          </div>


          <div
            class="mana-v981-overall-bar"
          >

            <span
              style="
                width:${overallPercent}%
              "
            ></span>

          </div>

        </div>


        <div
          class="mana-v981-period-head"
        >

          <div
            class="mana-v981-period-name"
          >
            ${range.label}
          </div>


          <div
            class="mana-v981-period-detail"
          >
            ${range.detail}
          </div>

        </div>


        <div
          class="mana-v981-grid"
        >

          ${card(
            "W/O",
            "WORKOUTS",
            metrics.workouts.percent,
            metrics.workouts.target > 0
              ? `${metrics.workouts.count} of ${metrics.workouts.target} program days completed`
              : "No Mana 28 workout scheduled",
            "workout"
          )}


          ${card(
            "W",
            "WATER",
            metrics.water.percent,
            metrics.water.percent === null
              ? "Set your water target in Fuel"
              : `average across ${metrics.daysScored} program day${metrics.daysScored === 1 ? "" : "s"}`
          )}


          ${card(
            "R",
            "RECOVERY",
            metrics.recovery.percent,
            `${metrics.recovery.hours} of ${metrics.recovery.targetHours} hrs logged`
          )}


          ${card(
            "C",
            "CALORIES",
            metrics.calories.percent,
            metrics.calories.percent === null
              ? "Set your calorie target in Fuel"
              : `average accuracy across ${metrics.daysScored} program day${metrics.daysScored === 1 ? "" : "s"}`
          )}


          ${card(
            "P",
            "PROTEIN",
            metrics.protein.percent,
            metrics.protein.percent === null
              ? "Set your protein target in Fuel"
              : `average across ${metrics.daysScored} program day${metrics.daysScored === 1 ? "" : "s"}`
          )}

        </div>


        <div
          class="mana-v981-message"
        >

          <strong>
            The period buttons now control
            every card.
          </strong>

          Weekly follows your actual
          Mana 28 week, Monthly only
          includes Mana 28 dates inside
          the current month, and To Date
          only uses program days that
          have actually elapsed.

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


    [
      "mana:program-tab-change",
      "mana:recovery-updated",
      "mana:fuel-updated"
    ]
      .forEach(
        eventName => {

          window.addEventListener(
            eventName,
            renderSoon
          );

        }
      );


    window.addEventListener(
      "focus",
      renderSoon
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          renderSoon();

        }

      }
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
      "[Mana v9.81.3] corrected Mana 28 progress ready"
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
