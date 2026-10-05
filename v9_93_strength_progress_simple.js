/* =========================================
   MANA MOVEMENT TRAINING v9.93.0
   MANA STRENGTH — SIMPLE PROGRESS

   TOP
   - DAILY / WEEKLY / MONTHLY
   - WORKOUT %
   - PROTEIN %
   - CALORIES %
   - REST %

   DETAIL TABS
   - WEIGHT PROGRESSION
   - PERSONAL BESTS
   - BY EXERCISE
   - WORKOUTS COMPLETE

   DATA
   - EXISTING STRENGTH LOGS
   - EXISTING FUEL
   - EXISTING RECOVERY HOURS
   - EXISTING BODY WEIGHT

   STABILITY
   - NO MUTATION OBSERVER
   - NO DATA RESET
   - NO WORKOUT CHANGES
   - NO FUEL CHANGES
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "99300";


  const STYLE_ID =
    "mana-v993-strength-progress-style";


  const ROOT_ID =
    "manaV993StrengthProgress";


  const LOG_KEY =
    "mana-strength-v64-logs";


  const PROGRAM_KEY =
    "mana-strength-v62-program";


  const FUEL_KEY =
    "mana-fuel-v571";


  const TARGET_KEY =
    "mana-fuel-v58-targets";


  const WEIGHT_KEY =
    "mana-strength-v947-body-weight";


  const PROFILE_KEY =
    "mana-profile-v67";


  const RECOVERY_TARGET =
    8;


  let selectedPeriod =
    "daily";


  let selectedDetail =
    "weight";


  let selectedExercise =
    "";


  let renderTimer =
    null;


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


  function num(
    value
  ) {

    const result =
      Number(
        value
      );


    return Number.isFinite(
      result
    )
      ? result
      : 0;

  }


  function clamp(
    value
  ) {

    return Math.max(
      0,
      Math.min(
        100,
        Math.round(
          num(
            value
          )
        )
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
      )
      .replaceAll(
        '"',
        "&quot;"
      );

  }


  function parseDate(
    value
  ) {

    if (!value) {

      return null;

    }


    const date =
      new Date(
        value
      );


    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date;

  }


  function startOfDay(
    date = new Date()
  ) {

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

  }


  function addDays(
    date,
    amount
  ) {

    const result =
      new Date(
        date
      );


    result.setDate(
      result.getDate() +
      amount
    );


    return result;

  }


  function startOfWeek(
    date = new Date()
  ) {

    const result =
      startOfDay(
        date
      );


    result.setDate(
      result.getDate() -
      (
        (
          result.getDay() +
          6
        )
        %
        7
      )
    );


    return result;

  }


  function startOfMonth(
    date = new Date()
  ) {

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    );

  }


  function dateKey(
    date
  ) {

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

    ].join(
      "-"
    );

  }


  function formatDate(
    value
  ) {

    const date =
      value instanceof Date
        ? value
        : parseDate(
            value
          );


    if (!date) {

      return "—";

    }


    return date
      .toLocaleDateString(
        undefined,
        {
          day:"numeric",
          month:"short"
        }
      );

  }


  function formatNumber(
    value
  ) {

    return Math.round(
      num(
        value
      )
    )
      .toLocaleString();

  }


  function formatDecimal(
    value
  ) {

    const n =
      num(
        value
      );


    return Number.isInteger(
      n
    )
      ? String(
          n
        )
      : n.toFixed(
          1
        );

  }


  /* =========================================
     APP STATE
     ========================================= */

  function progressOpen() {

    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );


    const title =
      document.getElementById(
        "manaV83Title"
      );


    const tab =
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      );


    return Boolean(

      shell
        ?.classList
        .contains(
          "open"
        )

      &&

      title
        ?.textContent
        ?.trim()
        ?.toUpperCase() ===
        "MANA STRENGTH"

      &&

      tab
        ?.dataset
        ?.v83Tab ===
        "progress"

    );

  }


  /* =========================================
     STORAGE
     ========================================= */

  function loadLogs() {

    const logs =
      safeJson(
        localStorage.getItem(
          LOG_KEY
        ) || "[]",
        []
      );


    return Array.isArray(
      logs
    )
      ? logs
      : [];

  }


  function loadProgram() {

    return safeJson(
      localStorage.getItem(
        PROGRAM_KEY
      ) || "null",
      null
    );

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
        num(
          data.calories
        ),

      protein:
        num(
          data.protein
        ),

      water:
        num(
          data.water
        )

    };

  }


  function loadProfile() {

    return safeJson(
      localStorage.getItem(
        PROFILE_KEY
      ) || "{}",
      {}
    );

  }


  function loadWeights() {

    const entries =
      safeJson(
        localStorage.getItem(
          WEIGHT_KEY
        ) || "[]",
        []
      );


    if (
      !Array.isArray(
        entries
      )
    ) {

      return [];

    }


    return entries
      .filter(
        item =>
          item &&
          item.date &&
          num(
            item.weight
          ) > 0
      )
      .map(
        item => ({

          ...item,

          weight:
            num(
              item.weight
            )

        })
      )
      .sort(
        (
          a,
          b
        ) =>

          new Date(
            `${a.date}T12:00:00`
          )
          -
          new Date(
            `${b.date}T12:00:00`
          )

      );

  }


  /* =========================================
     PERIOD
     ========================================= */

  function currentRange() {

    const today =
      new Date();


    if (
      selectedPeriod ===
      "daily"
    ) {

      const start =
        startOfDay(
          today
        );


      return {

        start,

        end:
          addDays(
            start,
            1
          ),

        label:
          "TODAY",

        days:
          1

      };

    }


    if (
      selectedPeriod ===
      "weekly"
    ) {

      const start =
        startOfWeek(
          today
        );


      const elapsed =
        Math.floor(
          (
            startOfDay(
              today
            ) -
            start
          )
          /
          86400000
        )
        +
        1;


      return {

        start,

        end:
          addDays(
            start,
            7
          ),

        label:
          "THIS WEEK",

        days:
          Math.max(
            1,
            Math.min(
              7,
              elapsed
            )
          )

      };

    }


    const start =
      startOfMonth(
        today
      );


    const elapsed =
      today.getDate();


    return {

      start,

      end:
        new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          1
        ),

      label:
        today
          .toLocaleDateString(
            undefined,
            {
              month:"long"
            }
          )
          .toUpperCase(),

      days:
        elapsed

    };

  }


  function periodDates(
    range
  ) {

    const result =
      [];


    for (
      let i = 0;
      i < range.days;
      i++
    ) {

      result.push(
        dateKey(
          addDays(
            range.start,
            i
          )
        )
      );

    }


    return result;

  }


  /* =========================================
     WORKOUT DATA
     ========================================= */

  function logDate(
    log
  ) {

    return parseDate(
      log?.date
      ||
      log?.completedAt
      ||
      log?.finishedAtISO
      ||
      log?.finishedAt
    );

  }


  function logsInRange(
    range
  ) {

    return loadLogs()
      .filter(
        log => {

          const date =
            logDate(
              log
            );


          return Boolean(
            date &&
            date >= range.start &&
            date < range.end
          );

        }
      );

  }


  function weeklyTarget() {

    const program =
      loadProgram();


    const direct =
      num(
        program?.days
      );


    const sessions =
      Array.isArray(
        program?.sessions
      )
        ? program.sessions.length
        : 0;


    return Math.max(
      1,
      direct ||
      sessions ||
      3
    );

  }


  function workoutTarget(
    range
  ) {

    if (
      selectedPeriod ===
      "daily"
    ) {

      return 1;

    }


    if (
      selectedPeriod ===
      "weekly"
    ) {

      return weeklyTarget();

    }


    return Math.max(
      1,
      Math.round(
        weeklyTarget()
        *
        (
          range.days /
          7
        )
      )
    );

  }


  /* =========================================
     FUEL DATA
     ========================================= */

  function dayFuelTotals(
    day
  ) {

    const totals = {

      calories:0,

      protein:0,

      recovery:
        num(
          day?.recoveryHours
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
                  num(
                    item?.calories
                  );


                totals.protein +=
                  num(
                    item?.protein
                  );

              }
            );

        }
      );


    return totals;

  }


  function adherenceMetric(
    values,
    target
  ) {

    if (
      !target ||
      !values.length
    ) {

      return {

        percent:0,

        hitDays:0,

        average:0

      };

    }


    let totalPercent =
      0;


    let hitDays =
      0;


    let total =
      0;


    values.forEach(
      value => {

        const current =
          num(
            value
          );


        total +=
          current;


        const pct =
          clamp(
            current /
            target *
            100
          );


        totalPercent +=
          pct;


        if (
          current >=
          target
        ) {

          hitDays +=
            1;

        }

      }
    );


    return {

      percent:
        Math.round(
          totalPercent /
          values.length
        ),

      hitDays,

      average:
        total /
        values.length

    };

  }


  function topMetrics() {

    const range =
      currentRange();


    const dates =
      periodDates(
        range
      );


    const fuel =
      loadFuel();


    const targets =
      loadTargets();


    const logs =
      logsInRange(
        range
      );


    const planned =
      workoutTarget(
        range
      );


    const workouts =
      {

        count:
          logs.length,

        target:
          planned,

        percent:
          planned
            ? clamp(
                logs.length /
                planned *
                100
              )
            : 0

      };


    const calorieValues =
      [];


    const proteinValues =
      [];


    const restValues =
      [];


    dates.forEach(
      key => {

        const totals =
          dayFuelTotals(
            fuel[key] || {}
          );


        calorieValues.push(
          totals.calories
        );


        proteinValues.push(
          totals.protein
        );


        restValues.push(
          totals.recovery
        );

      }
    );


    return {

      range,

      workouts,

      calories:
        adherenceMetric(
          calorieValues,
          targets.calories
        ),

      protein:
        adherenceMetric(
          proteinValues,
          targets.protein
        ),

      rest:
        adherenceMetric(
          restValues,
          RECOVERY_TARGET
        ),

      targets

    };

  }


  /* =========================================
     STRENGTH DATA
     ========================================= */

  function estimated1RM(
    weight,
    reps
  ) {

    const w =
      num(
        weight
      );


    const r =
      num(
        reps
      );


    if (
      !w ||
      !r
    ) {

      return 0;

    }


    return (
      r === 1
        ? w
        : (
            Math.round(
              w *
              (
                1 +
                r / 30
              )
              *
              10
            )
            /
            10
          )
    );

  }


  function exerciseMap() {

    const map =
      new Map();


    loadLogs()
      .forEach(
        log => {

          const date =
            logDate(
              log
            );


          (
            log?.exercises || []
          )
            .forEach(
              exercise => {

                const name =
                  exercise?.name;


                if (!name) {

                  return;

                }


                if (
                  !map.has(
                    name
                  )
                ) {

                  map.set(
                    name,
                    []
                  );

                }


                const sets =
                  (
                    exercise?.sets || []
                  )
                    .filter(
                      set =>
                        set?.done
                        ||
                        num(
                          set?.weight
                        )
                        ||
                        num(
                          set?.reps
                        )
                    );


                if (
                  !sets.length
                ) {

                  return;

                }


                const maxWeight =
                  Math.max(
                    0,
                    ...sets.map(
                      set =>
                        num(
                          set?.weight
                        )
                    )
                  );


                const repsAtMax =
                  Math.max(
                    0,
                    ...sets
                      .filter(
                        set =>
                          num(
                            set?.weight
                          ) ===
                          maxWeight
                      )
                      .map(
                        set =>
                          num(
                            set?.reps
                          )
                      )
                  );


                const best1RM =
                  Math.max(
                    0,
                    ...sets.map(
                      set =>
                        estimated1RM(
                          set?.weight,
                          set?.reps
                        )
                    )
                  );


                const volume =
                  sets.reduce(
                    (
                      sum,
                      set
                    ) =>

                      sum +
                      (
                        num(
                          set?.weight
                        )
                        *
                        num(
                          set?.reps
                        )
                      ),

                    0
                  );


                map
                  .get(
                    name
                  )
                  .push({

                    date,

                    maxWeight,

                    repsAtMax,

                    best1RM,

                    volume,

                    sets

                  });

              }
            );

        }
      );


    map.forEach(
      entries => {

        entries.sort(
          (
            a,
            b
          ) =>

            (
              a.date?.getTime() || 0
            )
            -
            (
              b.date?.getTime() || 0
            )

        );

      }
    );


    return map;

  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

    if (
      document.getElementById(
        STYLE_ID
      )
    ) {

      return;

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      #${ROOT_ID}{

        width:
          100%;

        max-width:
          860px;

        margin:
          0 auto;

        padding:
          4px 0 36px;

      }


      .mana-v993-head{

        margin-bottom:
          15px;

      }


      .mana-v993-kicker{

        color:
          #d9bb55;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .14em;

      }


      .mana-v993-head h2{

        margin:
          5px 0 5px;

        color:
          #fff;

        font-size:
          27px;

      }


      .mana-v993-head p{

        margin:
          0;

        color:
          #8c8c8c;

        font-size:
          12px;

      }


      /* PERIOD */

      .mana-v993-periods{

        display:
          grid;

        grid-template-columns:
          repeat(
            3,
            1fr
          );

        gap:
          7px;

        margin:
          13px 0;

        padding:
          4px;

        border:
          1px solid
          #292929;

        border-radius:
          14px;

        background:
          #090909;

      }


      .mana-v993-period{

        min-height:
          39px;

        border:
          0;

        border-radius:
          10px;

        background:
          transparent;

        color:
          #777;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .06em;

      }


      .mana-v993-period.active{

        background:
          #f3d875;

        color:
          #111;

      }


      /* FOUR TOP METRICS */

      .mana-v993-metrics{

        display:
          grid;

        grid-template-columns:
          repeat(
            4,
            minmax(
              0,
              1fr
            )
          );

        gap:
          8px;

      }


      .mana-v993-metric{

        min-width:
          0;

        padding:
          14px 10px;

        border:
          1px solid
          #302c1d;

        border-radius:
          16px;

        background:
          linear-gradient(
            145deg,
            #14130d,
            #090909
          );

        text-align:
          center;

      }


      .mana-v993-metric-label{

        color:
          #848484;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .07em;

      }


      .mana-v993-metric-value{

        margin-top:
          5px;

        color:
          #f3d875;

        font-size:
          24px;

        font-weight:
          950;

      }


      .mana-v993-metric-sub{

        min-height:
          26px;

        margin-top:
          5px;

        color:
          #696969;

        font-size:
          9px;

        line-height:
          1.4;

      }


      .mana-v993-track{

        height:
          4px;

        margin-top:
          8px;

        overflow:
          hidden;

        border-radius:
          999px;

        background:
          #242424;

      }


      .mana-v993-fill{

        height:
          100%;

        border-radius:
          999px;

        background:
          #f3d875;

      }


      /* DETAIL BUTTONS */

      .mana-v993-detail-nav{

        display:
          grid;

        grid-template-columns:
          repeat(
            4,
            minmax(
              0,
              1fr
            )
          );

        gap:
          8px;

        margin-top:
          18px;

      }


      .mana-v993-detail-btn{

        min-height:
          66px;

        padding:
          9px;

        border:
          1px solid
          #303030;

        border-radius:
          15px;

        background:
          #0c0c0c;

        color:
          #aaa;

        font-size:
          10px;

        font-weight:
          900;

        line-height:
          1.3;

      }


      .mana-v993-detail-btn.active{

        border-color:
          #796521;

        background:
          #171408;

        color:
          #f3d875;

      }


      /* DETAIL PANEL */

      .mana-v993-panel{

        margin-top:
          10px;

        padding:
          17px;

        border:
          1px solid
          #2d2d2d;

        border-radius:
          19px;

        background:
          linear-gradient(
            145deg,
            #111,
            #080808
          );

      }


      .mana-v993-panel-head{

        display:
          flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:
          10px;

        margin-bottom:
          13px;

      }


      .mana-v993-panel-kicker{

        color:
          #c7a943;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .11em;

      }


      .mana-v993-panel h3{

        margin:
          4px 0 0;

        color:
          #fff;

        font-size:
          20px;

      }


      .mana-v993-summary-grid{

        display:
          grid;

        grid-template-columns:
          repeat(
            3,
            1fr
          );

        gap:
          8px;

      }


      .mana-v993-summary{

        padding:
          11px;

        border:
          1px solid
          #292929;

        border-radius:
          13px;

        background:
          #090909;

      }


      .mana-v993-summary span{

        display:
          block;

        color:
          #777;

        font-size:
          8px;

        font-weight:
          900;

      }


      .mana-v993-summary strong{

        display:
          block;

        margin-top:
          5px;

        color:
          #f3d875;

        font-size:
          17px;

      }


      .mana-v993-row{

        display:
          grid;

        grid-template-columns:
          minmax(
            0,
            1fr
          )
          auto;

        gap:
          12px;

        align-items:
          center;

        padding:
          12px 0;

        border-top:
          1px solid
          #242424;

      }


      .mana-v993-row:first-child{

        border-top:
          0;

      }


      .mana-v993-row-title{

        color:
          #eee;

        font-size:
          13px;

        font-weight:
          900;

      }


      .mana-v993-row-sub{

        margin-top:
          4px;

        color:
          #777;

        font-size:
          10px;

        line-height:
          1.45;

      }


      .mana-v993-row-value{

        color:
          #f3d875;

        font-size:
          12px;

        font-weight:
          950;

        text-align:
          right;

      }


      .mana-v993-empty{

        padding:
          22px 8px;

        color:
          #777;

        text-align:
          center;

        font-size:
          12px;

        line-height:
          1.55;

      }


      /* EXERCISE SELECT */

      .mana-v993-exercise-select{

        width:
          100%;

        min-height:
          46px;

        margin-bottom:
          12px;

        padding:
          0 12px;

        border:
          1px solid
          #373737;

        border-radius:
          12px;

        background:
          #090909;

        color:
          #fff;

        font-size:
          12px;

      }


      /* MOBILE */

      @media(max-width:600px){

        .mana-v993-metrics{

          grid-template-columns:
            1fr
            1fr;

        }


        .mana-v993-detail-nav{

          grid-template-columns:
            1fr
            1fr;

        }


        .mana-v993-detail-btn{

          min-height:
            54px;

        }


        .mana-v993-summary-grid{

          grid-template-columns:
            repeat(
              3,
              1fr
            );

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     TOP CARD
     ========================================= */

  function metricCard(
    label,
    metric,
    sub
  ) {

    return `

      <div
        class="mana-v993-metric"
      >

        <div
          class="mana-v993-metric-label"
        >
          ${esc(
            label
          )}
        </div>

        <div
          class="mana-v993-metric-value"
        >
          ${clamp(
            metric.percent
          )}%
        </div>

        <div
          class="mana-v993-metric-sub"
        >
          ${esc(
            sub
          )}
        </div>

        <div
          class="mana-v993-track"
        >

          <div
            class="mana-v993-fill"
            style="
              width:${clamp(
                metric.percent
              )}%
            "
          ></div>

        </div>

      </div>

    `;

  }


  /* =========================================
     WEIGHT PANEL
     ========================================= */

  function weightPanel() {

    const entries =
      loadWeights();


    const profileWeight =
      num(
        loadProfile()
          ?.weight
      );


    const starting =
      entries.length
        ? entries[0].weight
        : profileWeight;


    const current =
      entries.length
        ? entries[
            entries.length - 1
          ].weight
        : profileWeight;


    const change =
      starting &&
      current
        ? current - starting
        : 0;


    const rows =
      entries
        .slice()
        .reverse()
        .slice(
          0,
          8
        )
        .map(
          item => `

            <div
              class="mana-v993-row"
            >

              <div>

                <div
                  class="mana-v993-row-title"
                >
                  ${esc(
                    formatDate(
                      `${item.date}T12:00:00`
                    )
                  )}
                </div>

                <div
                  class="mana-v993-row-sub"
                >
                  Body-weight check-in
                </div>

              </div>

              <div
                class="mana-v993-row-value"
              >
                ${item.weight.toFixed(
                  1
                )} kg
              </div>

            </div>

          `
        )
        .join(
          ""
        );


    return `

      <div
        class="mana-v993-panel"
      >

        <div
          class="mana-v993-panel-head"
        >

          <div>

            <div
              class="mana-v993-panel-kicker"
            >
              WEIGHT
            </div>

            <h3>
              Weight Progression
            </h3>

          </div>

        </div>


        <div
          class="mana-v993-summary-grid"
        >

          <div
            class="mana-v993-summary"
          >
            <span>
              START
            </span>

            <strong>
              ${
                starting
                  ? `${starting.toFixed(
                      1
                    )} kg`
                  : "—"
              }
            </strong>
          </div>


          <div
            class="mana-v993-summary"
          >
            <span>
              CURRENT
            </span>

            <strong>
              ${
                current
                  ? `${current.toFixed(
                      1
                    )} kg`
                  : "—"
              }
            </strong>
          </div>


          <div
            class="mana-v993-summary"
          >
            <span>
              CHANGE
            </span>

            <strong>
              ${
                starting &&
                current
                  ? `${change > 0 ? "+" : ""}${change.toFixed(
                      1
                    )} kg`
                  : "—"
              }
            </strong>
          </div>

        </div>


        <div
          style="margin-top:13px"
        >

          ${
            rows
            ||
            `
              <div
                class="mana-v993-empty"
              >
                No body-weight check-ins yet.
              </div>
            `
          }

        </div>

      </div>

    `;

  }


  /* =========================================
     PB PANEL
     ========================================= */

  function pbPanel() {

    const map =
      exerciseMap();


    const pbs =
      [];


    map.forEach(
      (
        entries,
        name
      ) => {

        let best =
          null;


        entries.forEach(
          entry => {

            if (
              !best ||
              entry.best1RM >
                best.best1RM
            ) {

              best = {
                ...entry
              };

            }

          }
        );


        if (best) {

          pbs.push({

            name,

            ...best

          });

        }

      }
    );


    pbs.sort(
      (
        a,
        b
      ) =>
        b.best1RM -
        a.best1RM
    );


    const rows =
      pbs
        .slice(
          0,
          12
        )
        .map(
          item => `

            <div
              class="mana-v993-row"
            >

              <div>

                <div
                  class="mana-v993-row-title"
                >
                  ${esc(
                    item.name
                  )}
                </div>

                <div
                  class="mana-v993-row-sub"
                >
                  ${esc(
                    formatDate(
                      item.date
                    )
                  )}
                  •
                  best set
                  ${formatDecimal(
                    item.maxWeight
                  )} kg
                  ×
                  ${formatDecimal(
                    item.repsAtMax
                  )}
                </div>

              </div>

              <div
                class="mana-v993-row-value"
              >
                ${formatDecimal(
                  item.best1RM
                )} kg
                <br>
                <span
                  style="
                    color:#666;
                    font-size:8px
                  "
                >
                  EST. 1RM
                </span>
              </div>

            </div>

          `
        )
        .join(
          ""
        );


    return `

      <div
        class="mana-v993-panel"
      >

        <div
          class="mana-v993-panel-head"
        >

          <div>

            <div
              class="mana-v993-panel-kicker"
            >
              STRENGTH
            </div>

            <h3>
              Personal Bests
            </h3>

          </div>

        </div>

        ${
          rows
          ||
          `
            <div
              class="mana-v993-empty"
            >
              Complete some weighted exercises
              and your PBs will appear here.
            </div>
          `
        }

      </div>

    `;

  }


  /* =========================================
     BY EXERCISE
     ========================================= */

  function exercisePanel() {

    const map =
      exerciseMap();


    const names =
      [
        ...map.keys()
      ]
        .sort(
          (
            a,
            b
          ) =>
            a.localeCompare(
              b
            )
        );


    if (
      !names.length
    ) {

      return `

        <div
          class="mana-v993-panel"
        >

          <div
            class="mana-v993-panel-head"
          >
            <div>
              <div
                class="mana-v993-panel-kicker"
              >
                EXERCISES
              </div>

              <h3>
                By Exercise
              </h3>
            </div>
          </div>

          <div
            class="mana-v993-empty"
          >
            Exercise history will appear here
            after completed Strength workouts.
          </div>

        </div>

      `;

    }


    if (
      !selectedExercise ||
      !map.has(
        selectedExercise
      )
    ) {

      selectedExercise =
        names[0];

    }


    const entries =
      map.get(
        selectedExercise
      ) || [];


    const first =
      entries[0];


    const last =
      entries[
        entries.length - 1
      ];


    const bestWeight =
      Math.max(
        0,
        ...entries.map(
          entry =>
            entry.maxWeight
        )
      );


    const best1RM =
      Math.max(
        0,
        ...entries.map(
          entry =>
            entry.best1RM
        )
      );


    const loadChange =
      first &&
      last
        ? last.maxWeight -
          first.maxWeight
        : 0;


    const rows =
      entries
        .slice()
        .reverse()
        .slice(
          0,
          8
        )
        .map(
          entry => `

            <div
              class="mana-v993-row"
            >

              <div>

                <div
                  class="mana-v993-row-title"
                >
                  ${esc(
                    formatDate(
                      entry.date
                    )
                  )}
                </div>

                <div
                  class="mana-v993-row-sub"
                >
                  ${formatDecimal(
                    entry.maxWeight
                  )} kg
                  ×
                  ${formatDecimal(
                    entry.repsAtMax
                  )}
                  •
                  ${formatNumber(
                    entry.volume
                  )} kg volume
                </div>

              </div>

              <div
                class="mana-v993-row-value"
              >
                ${formatDecimal(
                  entry.best1RM
                )} kg
                <br>
                <span
                  style="
                    color:#666;
                    font-size:8px
                  "
                >
                  E1RM
                </span>
              </div>

            </div>

          `
        )
        .join(
          ""
        );


    return `

      <div
        class="mana-v993-panel"
      >

        <div
          class="mana-v993-panel-head"
        >

          <div>

            <div
              class="mana-v993-panel-kicker"
            >
              EXERCISE HISTORY
            </div>

            <h3>
              By Exercise
            </h3>

          </div>

        </div>


        <select
          id="manaV993ExerciseSelect"
          class="mana-v993-exercise-select"
        >

          ${names
            .map(
              name => `

                <option
                  value="${esc(
                    name
                  )}"
                  ${
                    name ===
                    selectedExercise
                      ? "selected"
                      : ""
                  }
                >
                  ${esc(
                    name
                  )}
                </option>

              `
            )
            .join(
              ""
            )}

        </select>


        <div
          class="mana-v993-summary-grid"
        >

          <div
            class="mana-v993-summary"
          >
            <span>
              SESSIONS
            </span>

            <strong>
              ${entries.length}
            </strong>
          </div>


          <div
            class="mana-v993-summary"
          >
            <span>
              BEST LOAD
            </span>

            <strong>
              ${
                bestWeight
                  ? `${formatDecimal(
                      bestWeight
                    )} kg`
                  : "—"
              }
            </strong>
          </div>


          <div
            class="mana-v993-summary"
          >
            <span>
              LOAD CHANGE
            </span>

            <strong>
              ${
                entries.length > 1
                  ? `${loadChange > 0 ? "+" : ""}${formatDecimal(
                      loadChange
                    )} kg`
                  : "—"
              }
            </strong>
          </div>

        </div>


        <div
          style="
            margin-top:12px;
            color:#777;
            font-size:10px
          "
        >
          Best estimated 1RM:
          <strong
            style="
              color:#f3d875
            "
          >
            ${
              best1RM
                ? `${formatDecimal(
                    best1RM
                  )} kg`
                : "—"
            }
          </strong>
        </div>


        <div
          style="margin-top:10px"
        >
          ${rows}
        </div>

      </div>

    `;

  }


  /* =========================================
     WORKOUT HISTORY
     ========================================= */

  function workoutDuration(
    log
  ) {

    const seconds =
      num(
        log?.durationSeconds
        ||
        log?.elapsedSeconds
        ||
        log?.totalSeconds
      );


    if (
      seconds > 0
    ) {

      return `${Math.round(
        seconds /
        60
      )} min`;

    }


    const minutes =
      num(
        log?.durationMinutes
        ||
        log?.elapsedMinutes
      );


    return minutes
      ? `${Math.round(
          minutes
        )} min`
      : "—";

  }


  function workoutCompletion(
    log
  ) {

    const exercises =
      Array.isArray(
        log?.exercises
      )
        ? log.exercises
        : [];


    let total =
      0;


    let done =
      0;


    exercises.forEach(
      exercise => {

        (
          exercise?.sets || []
        )
          .forEach(
            set => {

              total +=
                1;


              if (
                set?.done
              ) {

                done +=
                  1;

              }

            }
          );

      }
    );


    return total
      ? clamp(
          done /
          total *
          100
        )
      : 100;

  }


  function workoutPanel() {

    const logs =
      loadLogs()
        .slice()
        .sort(
          (
            a,
            b
          ) =>

            (
              logDate(
                b
              )?.getTime() || 0
            )
            -
            (
              logDate(
                a
              )?.getTime() || 0
            )

        );


    const totalVolume =
      logs.reduce(
        (
          sum,
          log
        ) =>
          sum +
          num(
            log?.totalVolume
          ),
        0
      );


    const rows =
      logs
        .slice(
          0,
          15
        )
        .map(
          log => {

            const title =
              log?.workoutName
              ||
              log?.name
              ||
              (
                Number.isInteger(
                  Number(
                    log?.dayIndex
                  )
                )
                  ? `Workout ${
                      Number(
                        log.dayIndex
                      ) + 1
                    }`
                  : "Strength Workout"
              );


            return `

              <div
                class="mana-v993-row"
              >

                <div>

                  <div
                    class="mana-v993-row-title"
                  >
                    ${esc(
                      title
                    )}
                  </div>

                  <div
                    class="mana-v993-row-sub"
                  >
                    ${esc(
                      formatDate(
                        logDate(
                          log
                        )
                      )
                    )}
                    •
                    ${esc(
                      workoutDuration(
                        log
                      )
                    )}
                    •
                    ${workoutCompletion(
                      log
                    )}% complete
                  </div>

                </div>

                <div
                  class="mana-v993-row-value"
                >
                  ${formatNumber(
                    log?.totalVolume
                  )} kg
                  <br>
                  <span
                    style="
                      color:#666;
                      font-size:8px
                    "
                  >
                    VOLUME
                  </span>
                </div>

              </div>

            `;

          }
        )
        .join(
          ""
        );


    return `

      <div
        class="mana-v993-panel"
      >

        <div
          class="mana-v993-panel-head"
        >

          <div>

            <div
              class="mana-v993-panel-kicker"
            >
              TRAINING HISTORY
            </div>

            <h3>
              Workouts Complete
            </h3>

          </div>

        </div>


        <div
          class="mana-v993-summary-grid"
        >

          <div
            class="mana-v993-summary"
          >
            <span>
              WORKOUTS
            </span>

            <strong>
              ${logs.length}
            </strong>
          </div>


          <div
            class="mana-v993-summary"
          >
            <span>
              VOLUME
            </span>

            <strong>
              ${formatNumber(
                totalVolume
              )}
            </strong>
          </div>


          <div
            class="mana-v993-summary"
          >
            <span>
              EXERCISES
            </span>

            <strong>
              ${exerciseMap().size}
            </strong>
          </div>

        </div>


        <div
          style="margin-top:11px"
        >

          ${
            rows
            ||
            `
              <div
                class="mana-v993-empty"
              >
                Completed workouts will appear here.
              </div>
            `
          }

        </div>

      </div>

    `;

  }


  /* =========================================
     DETAIL PANEL
     ========================================= */

  function detailPanel() {

    if (
      selectedDetail ===
      "pbs"
    ) {

      return pbPanel();

    }


    if (
      selectedDetail ===
      "exercise"
    ) {

      return exercisePanel();

    }


    if (
      selectedDetail ===
      "workouts"
    ) {

      return workoutPanel();

    }


    return weightPanel();

  }


  /* =========================================
     MAIN RENDER
     ========================================= */

  function render() {

    if (
      !progressOpen()
    ) {

      return;

    }


    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (!holder) {

      return;

    }


    const metrics =
      topMetrics();


    holder.innerHTML = `

      <div
        id="${ROOT_ID}"
      >

        <div
          class="mana-v993-head"
        >

          <div
            class="mana-v993-kicker"
          >
            MANA STRENGTH • PROGRESS
          </div>

          <h2>
            Your Progress
          </h2>

          <p>
            Keep the important numbers simple.
            Tap below when you want more detail.
          </p>

        </div>


        <div
          class="mana-v993-periods"
        >

          ${[
            [
              "daily",
              "DAILY"
            ],
            [
              "weekly",
              "WEEKLY"
            ],
            [
              "monthly",
              "MONTHLY"
            ]
          ]
            .map(
              item => `

                <button
                  type="button"
                  class="
                    mana-v993-period
                    ${
                      selectedPeriod ===
                      item[0]
                        ? "active"
                        : ""
                    }
                  "
                  data-v993-period="${item[0]}"
                >
                  ${item[1]}
                </button>

              `
            )
            .join(
              ""
            )}

        </div>


        <div
          class="mana-v993-metrics"
        >

          ${metricCard(
            "WORKOUTS",
            metrics.workouts,
            `${metrics.workouts.count} of ${metrics.workouts.target} planned`
          )}


          ${metricCard(
            "PROTEIN",
            metrics.protein,
            metrics.targets.protein
              ? `${metrics.protein.hitDays} of ${metrics.range.days} days on target`
              : "Set protein target in Profile"
          )}


          ${metricCard(
            "CALORIES",
            metrics.calories,
            metrics.targets.calories
              ? `${metrics.calories.hitDays} of ${metrics.range.days} days on target`
              : "Set calorie target in Profile"
          )}


          ${metricCard(
            "REST",
            metrics.rest,
            `${metrics.rest.average.toFixed(
              1
            )} hr avg`
          )}

        </div>


        <div
          class="mana-v993-detail-nav"
        >

          ${[
            [
              "weight",
              "WEIGHT PROGRESSION"
            ],
            [
              "pbs",
              "PERSONAL BESTS"
            ],
            [
              "exercise",
              "BY EXERCISE"
            ],
            [
              "workouts",
              "WORKOUTS COMPLETE"
            ]
          ]
            .map(
              item => `

                <button
                  type="button"
                  class="
                    mana-v993-detail-btn
                    ${
                      selectedDetail ===
                      item[0]
                        ? "active"
                        : ""
                    }
                  "
                  data-v993-detail="${item[0]}"
                >
                  ${item[1]}
                </button>

              `
            )
            .join(
              ""
            )}

        </div>


        <div
          id="manaV993Detail"
        >
          ${detailPanel()}
        </div>

      </div>

    `;


    bindLocalEvents();

  }


  /* =========================================
     EVENTS INSIDE PAGE
     ========================================= */

  function bindLocalEvents() {

    document
      .querySelectorAll(
        "[data-v993-period]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              selectedPeriod =
                button.dataset
                  .v993Period;


              render();

            }
          );

        }
      );


    document
      .querySelectorAll(
        "[data-v993-detail]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              selectedDetail =
                button.dataset
                  .v993Detail;


              render();

            }
          );

        }
      );


    document
      .getElementById(
        "manaV993ExerciseSelect"
      )
      ?.addEventListener(
        "change",
        event => {

          selectedExercise =
            event.target.value;


          render();

        }
      );

  }


  /* =========================================
     REFRESH
     ========================================= */

  function scheduleRender(
    delay = 90
  ) {

    clearTimeout(
      renderTimer
    );


    renderTimer =
      setTimeout(
        render,
        delay
      );

  }


  function wireEvents() {

    window.addEventListener(
      "mana:program-tab-change",
      () => {

        scheduleRender(
          90
        );

      }
    );


    [
      "mana:workout-progress-change",
      "mana:workout-feedback-saved",
      "mana:strength-synced",
      "mana:fuel-updated",
      "mana:recovery-updated",
      "mana:body-weight-updated",
      "mana:profile-synced"
    ]
      .forEach(
        name => {

          window.addEventListener(
            name,
            () => {

              if (
                progressOpen()
              ) {

                scheduleRender(
                  100
                );

              }

            }
          );

        }
      );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="progress"]'
          )
        ) {

          setTimeout(
            render,
            120
          );

        }

      },
      true
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    wireEvents();


    if (
      progressOpen()
    ) {

      scheduleRender(
        200
      );

    }


    window.MANA_STRENGTH_SIMPLE_PROGRESS_BUILD =
      BUILD;


    window.refreshManaStrengthSimpleProgress =
      scheduleRender;


    console.log(
      "[Mana v9.93.0] " +
      "simple Strength Progress ready"
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
