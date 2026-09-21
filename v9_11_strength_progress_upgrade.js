/* =========================================
   MANA MOVEMENT TRAINING v9.11.1
   PROGRESS DASHBOARD

   - DAILY / WEEKLY / MONTHLY / TO DATE
   - SELECTABLE TREND GRAPH
   - WORKOUT TOTALS
   - CALORIES
   - PROTEIN
   - WATER
   - RECOVERY
   - TRAINING PERFORMANCE
   - PERSONAL BESTS
   - RECENT WORKOUTS
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v9111-progress-style";

  const ROOT_ID =
    "manaV9111Progress";

  const LOG_KEY =
    "mana-strength-v64-logs";

  const PROGRAM_KEY =
    "mana-strength-v62-program";

  const FUEL_KEY =
    "mana-fuel-v571";

  const TARGET_KEY =
    "mana-fuel-v58-targets";

  const DAILY_KEY =
    "mana-strength-v866-daily";


  let selectedRange =
    "daily";

  let selectedMetric =
    "workouts";

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
    const saved =
      safeJson(
        localStorage.getItem(
          TARGET_KEY
        ) || "{}",
        {}
      );


    return {
      calories:
        Number(
          saved.calories || 0
        ),

      protein:
        Number(
          saved.protein || 0
        ),

      water:
        Number(
          saved.water || 0
        )
    };
  }


  function loadRecovery() {
    return safeJson(
      localStorage.getItem(
        DAILY_KEY
      ) || "{}",
      {}
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
        ) &&

      title
        ?.textContent
        ?.trim()
        ?.toUpperCase() ===
        "MANA STRENGTH" &&

      tab
        ?.dataset
        ?.v83Tab ===
        "progress"

    );
  }


  function dateKey(
    date
  ) {
    return [
      date.getFullYear(),

      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      ),

      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      )
    ].join("-");
  }


  function parseDate(
    value
  ) {
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


  function startOfWeek(
    date = new Date()
  ) {
    const base =
      startOfDay(
        date
      );


    const offset =
      (
        base.getDay() +
        6
      ) % 7;


    base.setDate(
      base.getDate() -
      offset
    );


    return base;
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


  function addDays(
    date,
    amount
  ) {
    const next =
      new Date(
        date
      );


    next.setDate(
      next.getDate() +
      amount
    );


    return next;
  }


  function addMonths(
    date,
    amount
  ) {
    return new Date(
      date.getFullYear(),
      date.getMonth() +
        amount,
      1
    );
  }


  function formatNumber(
    value
  ) {
    return Math.round(
      Number(
        value || 0
      )
    ).toLocaleString();
  }


  function formatDate(
    value
  ) {
    const date =
      parseDate(
        value
      );


    if (!date) {
      return "—";
    }


    return date.toLocaleDateString(
      undefined,
      {
        day:"numeric",
        month:"short"
      }
    );
  }


  function formatDuration(
    seconds
  ) {
    const totalMinutes =
      Math.round(
        Number(
          seconds || 0
        ) / 60
      );


    if (!totalMinutes) {
      return "—";
    }


    if (
      totalMinutes < 60
    ) {
      return `${totalMinutes} min`;
    }


    const hours =
      Math.floor(
        totalMinutes / 60
      );


    const minutes =
      totalMinutes % 60;


    return minutes
      ? `${hours}h ${minutes}m`
      : `${hours}h`;
  }


  /* =========================================
     FUEL TOTALS
     ========================================= */

  function fuelTotals(
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


    Object
      .values(
        day?.meals || {}
      )
      .forEach(
        items => {

          (
            items || []
          ).forEach(
            item => {

              totals.calories +=
                Number(
                  item?.calories ||
                  0
                );


              totals.protein +=
                Number(
                  item?.protein ||
                  0
                );

            }
          );

        }
      );


    return totals;
  }


  /* =========================================
     EARLIEST DATA
     ========================================= */

  function earliestDataDate() {
    const dates =
      [];


    loadLogs()
      .forEach(
        log => {

          const date =
            parseDate(
              log?.date
            );


          if (date) {
            dates.push(
              date
            );
          }

        }
      );


    [
      loadFuel(),
      loadRecovery()
    ].forEach(
      store => {

        Object
          .keys(
            store || {}
          )
          .forEach(
            key => {

              const date =
                parseDate(
                  `${key}T12:00:00`
                );


              if (date) {
                dates.push(
                  date
                );
              }

            }
          );

      }
    );


    if (!dates.length) {
      return startOfMonth(
        new Date()
      );
    }


    return new Date(
      Math.min(
        ...dates.map(
          date =>
            date.getTime()
        )
      )
    );
  }


  /* =========================================
     GRAPH PERIODS
     ========================================= */

  function buildPeriods() {
    const now =
      new Date();


    if (
      selectedRange ===
      "daily"
    ) {
      const today =
        startOfDay(
          now
        );


      return Array.from(
        {
          length:7
        },
        (
          _,
          index
        ) => {

          const start =
            addDays(
              today,
              index - 6
            );


          return {
            start,
            end:
              addDays(
                start,
                1
              ),

            label:
              start
                .toLocaleDateString(
                  undefined,
                  {
                    weekday:"short"
                  }
                )
                .slice(
                  0,
                  3
                )
          };

        }
      );
    }


    if (
      selectedRange ===
      "weekly"
    ) {
      const current =
        startOfWeek(
          now
        );


      return Array.from(
        {
          length:8
        },
        (
          _,
          index
        ) => {

          const start =
            addDays(
              current,
              (
                index - 7
              ) * 7
            );


          return {
            start,
            end:
              addDays(
                start,
                7
              ),

            label:
              index === 7
                ? "Now"
                : `${7 - index}w`
          };

        }
      );
    }


    if (
      selectedRange ===
      "monthly"
    ) {
      const current =
        startOfMonth(
          now
        );


      return Array.from(
        {
          length:6
        },
        (
          _,
          index
        ) => {

          const start =
            addMonths(
              current,
              index - 5
            );


          return {
            start,
            end:
              addMonths(
                start,
                1
              ),

            label:
              start.toLocaleDateString(
                undefined,
                {
                  month:"short"
                }
              )
          };

        }
      );
    }


    const first =
      startOfMonth(
        earliestDataDate()
      );


    const current =
      startOfMonth(
        now
      );


    const periods =
      [];


    let cursor =
      new Date(
        first
      );


    let guard =
      0;


    while (
      cursor <= current &&
      guard < 36
    ) {
      const start =
        new Date(
          cursor
        );


      periods.push({
        start,

        end:
          addMonths(
            start,
            1
          ),

        label:
          start.toLocaleDateString(
            undefined,
            {
              month:"short",
              year:"2-digit"
            }
          )
      });


      cursor =
        addMonths(
          cursor,
          1
        );


      guard++;
    }


    return periods.length
      ? periods
      : [
          {
            start:
              current,

            end:
              addMonths(
                current,
                1
              ),

            label:
              current.toLocaleDateString(
                undefined,
                {
                  month:"short"
                }
              )
          }
        ];
  }


  /* =========================================
     PERIOD DATA
     ========================================= */

  function logsInPeriod(
    start,
    end
  ) {
    return loadLogs()
      .filter(
        log => {

          const date =
            parseDate(
              log?.date
            );


          return Boolean(
            date &&
            date >= start &&
            date < end
          );

        }
      );
  }


  function fuelInPeriod(
    start,
    end
  ) {
    const store =
      loadFuel();


    const totals = {
      calories:0,
      protein:0,
      water:0,
      days:0
    };


    Object
      .entries(
        store
      )
      .forEach(
        (
          [
            key,
            day
          ]
        ) => {

          const date =
            parseDate(
              `${key}T12:00:00`
            );


          if (
            !date ||
            date < start ||
            date >= end
          ) {
            return;
          }


          const values =
            fuelTotals(
              day
            );


          totals.calories +=
            values.calories;

          totals.protein +=
            values.protein;

          totals.water +=
            values.water;

          totals.days++;

        }
      );


    return totals;
  }


  function recoveryInPeriod(
    start,
    end
  ) {
    const store =
      loadRecovery();


    let count =
      0;


    Object
      .entries(
        store
      )
      .forEach(
        (
          [
            key,
            day
          ]
        ) => {

          const date =
            parseDate(
              `${key}T12:00:00`
            );


          if (
            date &&
            date >= start &&
            date < end &&
            day?.recovery
          ) {
            count++;
          }

        }
      );


    return count;
  }


  function periodMetric(
    period
  ) {
    const logs =
      logsInPeriod(
        period.start,
        period.end
      );


    if (
      selectedMetric ===
      "workouts"
    ) {
      return logs.length;
    }


    const fuel =
      fuelInPeriod(
        period.start,
        period.end
      );


    if (
      selectedMetric ===
      "calories"
    ) {
      return Math.round(
        fuel.calories
      );
    }


    if (
      selectedMetric ===
      "protein"
    ) {
      return Math.round(
        fuel.protein
      );
    }


    if (
      selectedMetric ===
      "water"
    ) {
      return Math.round(
        fuel.water
      );
    }


    return recoveryInPeriod(
      period.start,
      period.end
    );
  }


  /* =========================================
     CURRENT RANGE
     ========================================= */

  function currentRange() {
    const now =
      new Date();


    if (
      selectedRange ===
      "daily"
    ) {
      return {
        start:
          startOfDay(
            now
          ),

        end:
          addDays(
            startOfDay(
              now
            ),
            1
          ),

        label:
          "Today"
      };
    }


    if (
      selectedRange ===
      "weekly"
    ) {
      const start =
        startOfWeek(
          now
        );


      return {
        start,
        end:
          addDays(
            start,
            7
          ),

        label:
          "This week"
      };
    }


    if (
      selectedRange ===
      "monthly"
    ) {
      const start =
        startOfMonth(
          now
        );


      return {
        start,
        end:
          addMonths(
            start,
            1
          ),

        label:
          "This month"
      };
    }


    const first =
      earliestDataDate();


    return {
      start:
        startOfDay(
          first
        ),

      end:
        addDays(
          startOfDay(
            now
          ),
          1
        ),

      label:
        "To date"
    };
  }


  /* =========================================
     RANGE SUMMARY
     ========================================= */

  function rangeStats() {
    const range =
      currentRange();


    const logs =
      logsInPeriod(
        range.start,
        range.end
      );


    const fuel =
      fuelInPeriod(
        range.start,
        range.end
      );


    const recovery =
      recoveryInPeriod(
        range.start,
        range.end
      );


    const volume =
      logs.reduce(
        (
          total,
          log
        ) =>
          total +
          Number(
            log?.totalVolume ||
            0
          ),
        0
      );


    const duration =
      logs.reduce(
        (
          total,
          log
        ) =>
          total +
          Number(
            log?.durationSeconds ||
            0
          ),
        0
      );


    const avgCompletion =
      logs.length
        ? Math.round(
            logs.reduce(
              (
                total,
                log
              ) =>
                total +
                Number(
                  log?.completionPercent ||
                  0
                ),
              0
            ) /
            logs.length
          )
        : 0;


    return {
      range,
      logs,
      fuel,
      recovery,
      volume,
      duration,
      avgCompletion
    };
  }


  /* =========================================
     PB DATA
     ========================================= */

  function personalBests() {
    const map =
      new Map();


    loadLogs()
      .forEach(
        log => {

          (
            log?.exercises ||
            []
          ).forEach(
            exercise => {

              const name =
                exercise?.name;


              if (!name) {
                return;
              }


              (
                exercise?.sets ||
                []
              ).forEach(
                set => {

                  if (
                    !set?.done
                  ) {
                    return;
                  }


                  const weight =
                    Number(
                      set?.weight ||
                      0
                    );


                  if (
                    weight <= 0
                  ) {
                    return;
                  }


                  const previous =
                    map.get(
                      name
                    );


                  if (
                    !previous ||
                    weight >
                      previous.weight
                  ) {
                    map.set(
                      name,
                      {
                        name,
                        weight,

                        date:
                          log.date ||
                          null
                      }
                    );
                  }

                }
              );

            }
          );

        }
      );


    return [
      ...map.values()
    ]
      .sort(
        (
          a,
          b
        ) =>
          b.weight -
          a.weight
      )
      .slice(
        0,
        8
      );
  }


  /* =========================================
     CONSISTENCY
     ========================================= */

  function weeklyTarget() {
    const program =
      loadProgram();


    return Math.max(
      0,
      Number(
        program?.days ||
        program
          ?.sessions
          ?.length ||
        0
      )
    );
  }


  function consistencyPercent() {
    const target =
      weeklyTarget();


    if (!target) {
      return 0;
    }


    const now =
      new Date();


    const start =
      startOfWeek(
        now
      );


    const end =
      addDays(
        start,
        7
      );


    const workouts =
      logsInPeriod(
        start,
        end
      ).length;


    return Math.min(
      100,
      Math.round(
        workouts /
        target *
        100
      )
    );
  }


  /* =========================================
     GRAPH
     ========================================= */

  function metricLabel() {
    const labels = {
      workouts:"Workouts",
      calories:"Calories",
      protein:"Protein",
      water:"Water",
      recovery:"Recovery"
    };


    return (
      labels[
        selectedMetric
      ] ||
      "Workouts"
    );
  }


  function metricValueLabel(
    value
  ) {
    if (
      selectedMetric ===
      "calories"
    ) {
      return `${formatNumber(
        value
      )} kcal`;
    }


    if (
      selectedMetric ===
      "protein"
    ) {
      return `${formatNumber(
        value
      )} g`;
    }


    if (
      selectedMetric ===
      "water"
    ) {
      return `${formatNumber(
        value
      )} ml`;
    }


    if (
      selectedMetric ===
      "recovery"
    ) {
      return `${formatNumber(
        value
      )} days`;
    }


    return `${formatNumber(
      value
    )}`;
  }


  function graphHtml() {
    const periods =
      buildPeriods();


    const values =
      periods.map(
        period =>
          periodMetric(
            period
          )
      );


    const max =
      Math.max(
        1,
        ...values
      );


    return `

      <div
        class="mana-v9111-chart"
      >

        ${
          periods
            .map(
              (
                period,
                index
              ) => {

                const value =
                  values[
                    index
                  ];


                const height =
                  value > 0
                    ? Math.max(
                        8,
                        Math.round(
                          value /
                          max *
                          100
                        )
                      )
                    : 3;


                return `

                  <div
                    class="mana-v9111-bar-wrap"
                  >

                    <div
                      class="mana-v9111-bar-value"
                    >
                      ${
                        value
                          ? formatNumber(
                              value
                            )
                          : ""
                      }
                    </div>


                    <div
                      class="mana-v9111-bar-track"
                    >

                      <div
                        class="mana-v9111-bar"
                        style="
                          height:${height}%;
                        "
                      ></div>

                    </div>


                    <div
                      class="mana-v9111-bar-label"
                    >
                      ${esc(
                        period.label
                      )}
                    </div>

                  </div>

                `;

              }
            )
            .join("")
        }

      </div>

    `;
  }


  /* =========================================
     STYLES
     ========================================= */

  function injectStyles() {
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
        width:100%;
      }


      .mana-v9111-head{
        margin-bottom:16px;
      }


      .mana-v9111-kicker{
        color:#f3d875;
        font-size:10px;
        font-weight:900;
        letter-spacing:.13em;
      }


      .mana-v9111-head h2{
        margin:6px 0 5px;
        font-size:30px;
      }


      .mana-v9111-head p{
        margin:0;
        color:#888;
        font-size:12px;
        line-height:1.5;
      }


      .mana-v9111-tabs{
        display:grid;
        grid-template-columns:
          repeat(
            4,
            1fr
          );

        gap:7px;

        margin:
          15px
          0;
      }


      .mana-v9111-tabs button{
        min-height:43px;
        padding:7px 4px;
        border:1px solid #333;
        border-radius:12px;
        background:#0d0d0d;
        color:#888;
        font-size:9px;
        font-weight:900;
        letter-spacing:.03em;
      }


      .mana-v9111-tabs button.active{
        border-color:#f3d875;
        background:#f3d875;
        color:#111;
      }


      .mana-v9111-section{
        margin-top:14px;
        padding:17px;
        border:1px solid #292929;
        border-radius:20px;
        background:
          linear-gradient(
            145deg,
            #111,
            #090909
          );
      }


      .mana-v9111-section-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:12px;
        margin-bottom:14px;
      }


      .mana-v9111-section-head h3{
        margin:0;
        font-size:19px;
      }


      .mana-v9111-section-head span{
        color:#777;
        font-size:9px;
        font-weight:800;
        text-transform:uppercase;
        letter-spacing:.07em;
      }


      .mana-v9111-metric-tabs{
        display:flex;
        gap:6px;
        overflow:auto;
        padding-bottom:3px;
        margin-bottom:14px;
      }


      .mana-v9111-metric-tabs button{
        flex:0 0 auto;
        min-height:36px;
        padding:7px 10px;
        border:1px solid #303030;
        border-radius:999px;
        background:#0b0b0b;
        color:#888;
        font-size:9px;
        font-weight:900;
      }


      .mana-v9111-metric-tabs button.active{
        border-color:#62531e;
        background:#171407;
        color:#f3d875;
      }


      .mana-v9111-chart{
        height:190px;
        display:flex;
        align-items:stretch;
        gap:7px;
        overflow-x:auto;
        padding-top:12px;
      }


      .mana-v9111-bar-wrap{
        flex:1 0 34px;
        min-width:34px;
        display:grid;
        grid-template-rows:
          20px
          1fr
          24px;
        gap:4px;
        text-align:center;
      }


      .mana-v9111-bar-value{
        color:#aaa;
        font-size:8px;
        white-space:nowrap;
      }


      .mana-v9111-bar-track{
        height:130px;
        display:flex;
        align-items:flex-end;
        overflow:hidden;
        border-radius:
          8px
          8px
          4px
          4px;
        background:#181818;
      }


      .mana-v9111-bar{
        width:100%;
        min-height:3px;
        border-radius:
          8px
          8px
          4px
          4px;
        background:#f3d875;
      }


      .mana-v9111-bar-label{
        color:#666;
        font-size:8px;
        line-height:1.2;
      }


      .mana-v9111-grid{
        display:grid;
        grid-template-columns:
          repeat(
            2,
            1fr
          );
        gap:9px;
      }


      .mana-v9111-stat{
        min-width:0;
        padding:14px;
        border:1px solid #292929;
        border-radius:17px;
        background:#0b0b0b;
      }


      .mana-v9111-stat-label{
        color:#777;
        font-size:8px;
        font-weight:900;
        letter-spacing:.06em;
        text-transform:uppercase;
      }


      .mana-v9111-stat-value{
        margin-top:6px;
        color:#f3d875;
        font-size:22px;
        font-weight:900;
        line-height:1.1;
        word-break:break-word;
      }


      .mana-v9111-stat-sub{
        margin-top:5px;
        color:#666;
        font-size:9px;
        line-height:1.35;
      }


      .mana-v9111-performance{
        display:grid;
        grid-template-columns:
          1fr
          1fr;
        gap:8px;
      }


      .mana-v9111-performance-card{
        padding:13px;
        border:1px solid #292929;
        border-radius:15px;
        background:#0a0a0a;
      }


      .mana-v9111-performance-label{
        color:#777;
        font-size:8px;
        font-weight:900;
        text-transform:uppercase;
      }


      .mana-v9111-performance-value{
        margin-top:6px;
        color:#fff;
        font-size:18px;
        font-weight:900;
      }


      .mana-v9111-pb{
        display:grid;
        grid-template-columns:
          1fr
          auto;
        gap:12px;
        align-items:center;
        padding:12px 0;
        border-top:1px solid #252525;
      }


      .mana-v9111-pb:first-of-type{
        border-top:0;
      }


      .mana-v9111-pb-name{
        color:#eee;
        font-size:12px;
        font-weight:900;
      }


      .mana-v9111-pb-date{
        margin-top:3px;
        color:#666;
        font-size:9px;
      }


      .mana-v9111-pb-value{
        color:#f3d875;
        font-size:13px;
        font-weight:900;
        white-space:nowrap;
      }


      .mana-v9111-workout{
        display:grid;
        grid-template-columns:
          1fr
          auto;
        gap:10px;
        padding:13px 0;
        border-top:1px solid #252525;
      }


      .mana-v9111-workout:first-of-type{
        border-top:0;
      }


      .mana-v9111-workout-name{
        color:#eee;
        font-size:12px;
        font-weight:900;
      }


      .mana-v9111-workout-meta{
        margin-top:4px;
        color:#777;
        font-size:9px;
        line-height:1.45;
      }


      .mana-v9111-workout-volume{
        color:#f3d875;
        font-size:11px;
        font-weight:900;
        text-align:right;
      }


      .mana-v9111-feedback{
        grid-column:
          1 / -1;
        margin-top:5px;
      }


      .mana-v9111-effort{
        display:inline-flex;
        padding:4px 7px;
        border:1px solid #4c411d;
        border-radius:999px;
        color:#f3d875;
        font-size:8px;
        font-weight:900;
        text-transform:uppercase;
      }


      .mana-v9111-note{
        margin-top:6px;
        color:#999;
        font-size:9px;
        line-height:1.45;
      }


      .mana-v9111-empty{
        padding:18px 4px;
        color:#777;
        font-size:11px;
        line-height:1.5;
      }


      @media(max-width:380px){

        .mana-v9111-tabs{
          grid-template-columns:
            1fr
            1fr;
        }


        .mana-v9111-workout{
          grid-template-columns:
            1fr;
        }


        .mana-v9111-workout-volume{
          text-align:left;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     RENDER
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


    const stats =
      rangeStats();


    const targets =
      loadTargets();


    const pbs =
      personalBests();


    const recent =
      loadLogs()
        .slice(
          -8
        )
        .reverse();


    const consistency =
      consistencyPercent();


    holder.innerHTML = `

      <div
        id="${ROOT_ID}"
      >

        <div
          class="mana-v9111-head"
        >

          <div
            class="mana-v9111-kicker"
          >
            MANA STRENGTH
          </div>


          <h2>
            Your Progress
          </h2>


          <p>
            Training, nutrition and recovery
            in one place.
          </p>

        </div>


        <!-- RANGE -->

        <div
          class="mana-v9111-tabs"
        >

          ${rangeButton(
            "daily",
            "DAILY"
          )}

          ${rangeButton(
            "weekly",
            "WEEKLY"
          )}

          ${rangeButton(
            "monthly",
            "MONTHLY"
          )}

          ${rangeButton(
            "all",
            "TO DATE"
          )}

        </div>


        <!-- GRAPH -->

        <div
          class="mana-v9111-section"
        >

          <div
            class="mana-v9111-section-head"
          >

            <div>

              <h3>
                ${metricLabel()} Trend
              </h3>

            </div>


            <span>
              ${esc(
                stats.range.label
              )}
            </span>

          </div>


          <div
            class="mana-v9111-metric-tabs"
          >

            ${metricButton(
              "workouts",
              "WORKOUTS"
            )}

            ${metricButton(
              "calories",
              "CALORIES"
            )}

            ${metricButton(
              "protein",
              "PROTEIN"
            )}

            ${metricButton(
              "water",
              "WATER"
            )}

            ${metricButton(
              "recovery",
              "RECOVERY"
            )}

          </div>


          ${graphHtml()}

        </div>


        <!-- TOTALS -->

        <div
          class="mana-v9111-section"
        >

          <div
            class="mana-v9111-section-head"
          >

            <h3>
              Totals
            </h3>

            <span>
              ${esc(
                stats.range.label
              )}
            </span>

          </div>


          <div
            class="mana-v9111-grid"
          >

            ${statCard(
              "Workouts",
              stats.logs.length,
              weeklyTarget()
                ? `${weeklyTarget()} planned / week`
                : "Completed sessions"
            )}


            ${statCard(
              "Calories",
              formatNumber(
                stats.fuel.calories
              ),
              targets.calories
                ? `${targets.calories} kcal daily target`
                : "Logged calories"
            )}


            ${statCard(
              "Protein",
              `${formatNumber(
                stats.fuel.protein
              )} g`,
              targets.protein
                ? `${targets.protein} g daily target`
                : "Logged protein"
            )}


            ${statCard(
              "Water",
              `${formatNumber(
                stats.fuel.water
              )} ml`,
              targets.water
                ? `${targets.water} ml daily target`
                : "Logged hydration"
            )}


            ${statCard(
              "Recovery",
              stats.recovery,
              "Recovery focus days"
            )}


            ${statCard(
              "Volume",
              stats.volume
                ? `${formatNumber(
                    stats.volume
                  )} kg`
                : "—",
              "Total load moved"
            )}

          </div>

        </div>


        <!-- PERFORMANCE -->

        <div
          class="mana-v9111-section"
        >

          <div
            class="mana-v9111-section-head"
          >

            <h3>
              Training Performance
            </h3>

            <span>
              LIVE
            </span>

          </div>


          <div
            class="mana-v9111-performance"
          >

            ${performanceCard(
              "Completion",
              `${stats.avgCompletion}%`
            )}


            ${performanceCard(
              "Training time",
              formatDuration(
                stats.duration
              )
            )}


            ${performanceCard(
              "Consistency",
              `${consistency}%`
            )}


            ${performanceCard(
              "Personal bests",
              pbs.length
            )}

          </div>

        </div>


        <!-- PERSONAL BESTS -->

        <div
          class="mana-v9111-section"
        >

          <div
            class="mana-v9111-section-head"
          >

            <h3>
              Personal Bests
            </h3>

            <span>
              TOP LOADS
            </span>

          </div>


          ${
            pbs.length
              ? pbs
                  .map(
                    pb => `

                      <div
                        class="mana-v9111-pb"
                      >

                        <div>

                          <div
                            class="mana-v9111-pb-name"
                          >
                            ${esc(
                              pb.name
                            )}
                          </div>


                          <div
                            class="mana-v9111-pb-date"
                          >
                            ${formatDate(
                              pb.date
                            )}
                          </div>

                        </div>


                        <div
                          class="mana-v9111-pb-value"
                        >
                          ${pb.weight} kg
                        </div>

                      </div>

                    `
                  )
                  .join("")
              : `
                  <div
                    class="mana-v9111-empty"
                  >
                    Personal bests will appear
                    as you complete weighted
                    workouts.
                  </div>
                `
          }

        </div>


        <!-- RECENT WORKOUTS -->

        <div
          class="mana-v9111-section"
        >

          <div
            class="mana-v9111-section-head"
          >

            <h3>
              Recent Workouts
            </h3>

            <span>
              LAST ${Math.min(
                8,
                recent.length
              )}
            </span>

          </div>


          ${
            recent.length
              ? recent
                  .map(
                    log => {

                      const effort =
                        String(
                          log.sessionEffort ||
                          ""
                        ).trim();


                      const note =
                        String(
                          log.workoutNote ||
                          ""
                        ).trim();


                      return `

                        <div
                          class="mana-v9111-workout"
                        >

                          <div>

                            <div
                              class="mana-v9111-workout-name"
                            >
                              ${esc(
                                log.sessionName ||
                                "Strength Workout"
                              )}
                            </div>


                            <div
                              class="mana-v9111-workout-meta"
                            >
                              ${formatDate(
                                log.date
                              )}
                              •
                              ${formatDuration(
                                log.durationSeconds
                              )}
                              •
                              ${Number(
                                log.completionPercent ||
                                0
                              )}% complete
                            </div>

                          </div>


                          <div
                            class="mana-v9111-workout-volume"
                          >
                            ${formatNumber(
                              log.totalVolume
                            )}
                            kg
                          </div>


                          ${
                            effort ||
                            note
                              ? `
                                <div
                                  class="mana-v9111-feedback"
                                >

                                  ${
                                    effort
                                      ? `
                                        <div
                                          class="mana-v9111-effort"
                                        >
                                          ${esc(
                                            effort
                                          )} session
                                        </div>
                                      `
                                      : ""
                                  }


                                  ${
                                    note
                                      ? `
                                        <div
                                          class="mana-v9111-note"
                                        >
                                          ${esc(
                                            note
                                          )}
                                        </div>
                                      `
                                      : ""
                                  }

                                </div>
                              `
                              : ""
                          }

                        </div>

                      `;

                    }
                  )
                  .join("")
              : `
                  <div
                    class="mana-v9111-empty"
                  >
                    Complete a workout and it
                    will appear here.
                  </div>
                `
          }

        </div>

      </div>

    `;


    wireControls();
  }


  /* =========================================
     SMALL HTML HELPERS
     ========================================= */

  function rangeButton(
    range,
    label
  ) {
    return `

      <button
        type="button"
        data-v9111-range="${range}"
        class="${
          selectedRange === range
            ? "active"
            : ""
        }"
      >
        ${label}
      </button>

    `;
  }


  function metricButton(
    metric,
    label
  ) {
    return `

      <button
        type="button"
        data-v9111-metric="${metric}"
        class="${
          selectedMetric === metric
            ? "active"
            : ""
        }"
      >
        ${label}
      </button>

    `;
  }


  function statCard(
    label,
    value,
    sub
  ) {
    return `

      <div
        class="mana-v9111-stat"
      >

        <div
          class="mana-v9111-stat-label"
        >
          ${esc(
            label
          )}
        </div>


        <div
          class="mana-v9111-stat-value"
        >
          ${esc(
            value
          )}
        </div>


        <div
          class="mana-v9111-stat-sub"
        >
          ${esc(
            sub
          )}
        </div>

      </div>

    `;
  }


  function performanceCard(
    label,
    value
  ) {
    return `

      <div
        class="mana-v9111-performance-card"
      >

        <div
          class="mana-v9111-performance-label"
        >
          ${esc(
            label
          )}
        </div>


        <div
          class="mana-v9111-performance-value"
        >
          ${esc(
            value
          )}
        </div>

      </div>

    `;
  }


  /* =========================================
     CONTROLS
     ========================================= */

  function wireControls() {
    document
      .querySelectorAll(
        "[data-v9111-range]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              selectedRange =
                button.dataset
                  .v9111Range;


              render();

            }
          );

        }
      );


    document
      .querySelectorAll(
        "[data-v9111-metric]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              selectedMetric =
                button.dataset
                  .v9111Metric;


              render();

            }
          );

        }
      );
  }


  /* =========================================
     SCHEDULE
     ========================================= */

  function scheduleRender(
    delay = 120
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


  /* =========================================
     WATCH
     ========================================= */

  function watch() {
    window.addEventListener(
      "mana:program-tab-change",
      () => {

        scheduleRender(
          140
        );

      }
    );


    window.addEventListener(
      "mana:strength-synced",
      () => {

        scheduleRender(
          140
        );

      }
    );


    window.addEventListener(
      "mana:workout-feedback-saved",
      () => {

        scheduleRender(
          140
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        scheduleRender(
          180
        );

      }
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          scheduleRender(
            180
          );

        }

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

          /*
            v8.7 renders first.
            This render runs afterwards
            and becomes the final dashboard.
          */

          setTimeout(
            render,
            180
          );


          setTimeout(
            render,
            420
          );

        }

      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {
    injectStyles();

    watch();


    [
      900,
      1500,
      2400
    ].forEach(
      delay => {

        setTimeout(
          render,
          delay
        );

      }
    );
  }


  window.renderManaStrengthProgressDashboard =
    render;


  if (
    document.readyState ===
      "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }

})();
