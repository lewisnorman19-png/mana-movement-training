/* =========================================
   MANA MOVEMENT TRAINING v9.13
   PROGRESS DASHBOARD — WHOLE FILE REPLACEMENT

   - Daily / Weekly / Monthly / To Date
   - Trend graph
   - Weekly snapshot
   - Strength progression by exercise
   - Training performance
   - Personal bests
   - Recent workouts
   - Reset training history button
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID = "mana-v913-progress-style";
  const ROOT_ID = "manaV913Progress";

  const LOG_KEY = "mana-strength-v64-logs";
  const PROGRAM_KEY = "mana-strength-v62-program";
  const FUEL_KEY = "mana-fuel-v571";
  const TARGET_KEY = "mana-fuel-v58-targets";
  const DAILY_KEY = "mana-strength-v866-daily";

  let selectedRange = "weekly";
  let selectedMetric = "workouts";
  let selectedExercise = "";
  let renderTimer = null;

  const safeJson = (raw, fallback) => {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  };

  const esc = value =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const parseDate = value => {
    if (!value) return null;

    const date =
      new Date(value);

    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date;
  };

  const startOfDay = (
    date = new Date()
  ) =>
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

  const startOfWeek = (
    date = new Date()
  ) => {
    const base =
      startOfDay(date);

    base.setDate(
      base.getDate() -
      (
        (
          base.getDay() +
          6
        ) % 7
      )
    );

    return base;
  };

  const startOfMonth = (
    date = new Date()
  ) =>
    new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    );

  const addDays = (
    date,
    amount
  ) => {
    const next =
      new Date(date);

    next.setDate(
      next.getDate() +
      amount
    );

    return next;
  };

  const addMonths = (
    date,
    amount
  ) =>
    new Date(
      date.getFullYear(),
      date.getMonth() +
        amount,
      1
    );

  const dateKey =
    date => [
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

  const formatNumber =
    value =>
      Math.round(
        Number(
          value || 0
        )
      ).toLocaleString();

  const formatDate =
    value => {
      const date =
        parseDate(value);

      if (!date) {
        return "—";
      }

      return date
        .toLocaleDateString(
          undefined,
          {
            day:
              "numeric",
            month:
              "short"
          }
        );
    };

  const formatDuration =
    seconds => {
      const mins =
        Math.round(
          Number(
            seconds || 0
          ) / 60
        );

      if (!mins) {
        return "—";
      }

      if (
        mins < 60
      ) {
        return `${mins} min`;
      }

      const h =
        Math.floor(
          mins / 60
        );

      const m =
        mins % 60;

      return m
        ? `${h}h ${m}m`
        : `${h}h`;
    };

  const clampPercent =
    value =>
      Math.max(
        0,
        Math.min(
          100,
          Math.round(
            Number(
              value || 0
            )
          )
        )
      );

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

  function saveLogs(
    logs
  ) {
    localStorage.setItem(
      LOG_KEY,
      JSON.stringify(
        Array.isArray(
          logs
        )
          ? logs
          : []
      )
    );
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
    const value =
      safeJson(
        localStorage.getItem(
          FUEL_KEY
        ) || "{}",
        {}
      );

    return value &&
      typeof value ===
        "object"
      ? value
      : {};
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
          saved.calories ||
          0
        ),

      protein:
        Number(
          saved.protein ||
          0
        ),

      water:
        Number(
          saved.water ||
          0
        )
    };
  }

  function loadRecovery() {
    const value =
      safeJson(
        localStorage.getItem(
          DAILY_KEY
        ) || "{}",
        {}
      );

    return value &&
      typeof value ===
        "object"
      ? value
      : {};
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
      shell?.classList
        .contains(
          "open"
        ) &&
      title?.textContent
        ?.trim()
        ?.toUpperCase() ===
        "MANA STRENGTH" &&
      tab?.dataset
        ?.v83Tab ===
        "progress"
    );
  }

  /* =========================================
     FUEL
     ========================================= */

  function fuelTotals(
    day
  ) {
    const totals = {
      calories: 0,
      protein: 0,

      water:
        Number(
          day?.water ||
          0
        )
    };

    Object.values(
      day?.meals ||
      {}
    ).forEach(
      items => {

        (
          items ||
          []
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

  function fuelForDate(
    date
  ) {
    return fuelTotals(
      loadFuel()[
        dateKey(
          date
        )
      ] || {}
    );
  }

  /* =========================================
     DATA
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

        Object.keys(
          store || {}
        ).forEach(
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

    return dates.length
      ? new Date(
          Math.min(
            ...dates.map(
              date =>
                date.getTime()
            )
          )
        )
      : startOfMonth(
          new Date()
        );
  }

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
    const totals = {
      calories: 0,
      protein: 0,
      water: 0,
      days: 0
    };

    Object.entries(
      loadFuel()
    ).forEach(
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

        totals.days +=
          1;

      }
    );

    return totals;
  }

  function recoveryInPeriod(
    start,
    end
  ) {
    let count = 0;

    Object.entries(
      loadRecovery()
    ).forEach(
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
          (
            day?.recovery ||
            day?.recoveryDone ||
            day?.recoveryComplete
          )
        ) {
          count +=
            1;
        }

      }
    );

    return count;
  }

  /* =========================================
     RANGE
     ========================================= */

  function currentRange() {
    const now =
      new Date();

    if (
      selectedRange ===
      "daily"
    ) {
      const start =
        startOfDay(
          now
        );

      return {
        start,

        end:
          addDays(
            start,
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

    return {
      start:
        startOfDay(
          earliestDataDate()
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
          sum,
          log
        ) =>
          sum +
          Number(
            log?.totalVolume ||
            0
          ),
        0
      );

    const duration =
      logs.reduce(
        (
          sum,
          log
        ) =>
          sum +
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
                sum,
                log
              ) =>
                sum +
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
     WEEKLY SNAPSHOT
     ========================================= */

  function weeklyTarget() {
    const program =
      loadProgram();

    const direct =
      Number(
        program?.days ||
        0
      );

    const sessions =
      Array.isArray(
        program?.sessions
      )
        ? program
            .sessions
            .length
        : 0;

    return Math.max(
      0,
      direct ||
      sessions ||
      0
    );
  }

  function thisWeekSnapshot() {
    const start =
      startOfWeek(
        new Date()
      );

    const end =
      addDays(
        start,
        7
      );

    const logs =
      logsInPeriod(
        start,
        end
      );

    const targets =
      loadTargets();

    const planned =
      weeklyTarget();

    const volume =
      logs.reduce(
        (
          sum,
          log
        ) =>
          sum +
          Number(
            log?.totalVolume ||
            0
          ),
        0
      );

    const workoutPercent =
      planned
        ? clampPercent(
            logs.length /
            planned *
            100
          )
        : logs.length
          ? 100
          : 0;

    let proteinDays =
      0;

    let waterDays =
      0;

    let fuelDays =
      0;

    for (
      let i = 0;
      i < 7;
      i++
    ) {
      const values =
        fuelForDate(
          addDays(
            start,
            i
          )
        );

      if (
        values.calories ||
        values.protein ||
        values.water
      ) {
        fuelDays +=
          1;
      }

      if (
        targets.protein >
          0 &&
        values.protein >=
          targets.protein
      ) {
        proteinDays +=
          1;
      }

      if (
        targets.water >
          0 &&
        values.water >=
          targets.water
      ) {
        waterDays +=
          1;
      }
    }

    return {
      workouts:
        logs.length,

      planned,

      workoutPercent,

      volume,

      proteinDays,

      waterDays,

      fuelDays,

      recoveryDays:
        recoveryInPeriod(
          start,
          end
        )
    };
  }

  /* =========================================
     GRAPH
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
          length: 7
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
                    weekday:
                      "short"
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
          length: 8
        },
        (
          _,
          index
        ) => {

          const start =
            addDays(
              current,
              (
                index -
                7
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
              index ===
              7
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
          length: 6
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
              start
                .toLocaleDateString(
                  undefined,
                  {
                    month:
                      "short"
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
          start
            .toLocaleDateString(
              undefined,
              {
                month:
                  "short",

                year:
                  "2-digit"
              }
            )
      });

      cursor =
        addMonths(
          cursor,
          1
        );

      guard +=
        1;
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
              current
                .toLocaleDateString(
                  undefined,
                  {
                    month:
                      "short"
                  }
                )
          }
        ];
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

  function metricLabel() {
    return ({
      workouts:
        "Workouts",

      calories:
        "Calories",

      protein:
        "Protein",

      water:
        "Water",

      recovery:
        "Recovery"

    })[
      selectedMetric
    ] ||
    "Workouts";
  }

  function graphHtml() {
    const periods =
      buildPeriods();

    const values =
      periods.map(
        periodMetric
      );

    const max =
      Math.max(
        1,
        ...values
      );

    return `
      <div
        class="mana-v913-chart"
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
                    class="mana-v913-bar-wrap"
                  >

                    <div
                      class="mana-v913-bar-value"
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
                      class="mana-v913-bar-track"
                    >

                      <div
                        class="mana-v913-bar"
                        style="
                          height:${height}%;
                        "
                      ></div>

                    </div>

                    <div
                      class="mana-v913-bar-label"
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
     PERSONAL BESTS
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
                String(
                  exercise?.name ||
                  ""
                ).trim();

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

  function consistencyPercent() {
    const target =
      weeklyTarget();

    if (!target) {
      return 0;
    }

    const start =
      startOfWeek(
        new Date()
      );

    const workouts =
      logsInPeriod(
        start,
        addDays(
          start,
          7
        )
      ).length;

    return clampPercent(
      workouts /
      target *
      100
    );
  }

  /* =========================================
     STRENGTH PROGRESSION
     ========================================= */

  function exerciseSeries() {
    const exerciseMap =
      new Map();

    loadLogs()
      .forEach(
        (
          log,
          logIndex
        ) => {

          const logDate =
            parseDate(
              log?.date
            ) ||
            new Date(0);

          (
            log?.exercises ||
            []
          ).forEach(
            exercise => {

              const name =
                String(
                  exercise?.name ||
                  ""
                ).trim();

              if (!name) {
                return;
              }

              let bestWeight =
                0;

              let bestReps =
                0;

              let bestVolume =
                0;

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

                  const reps =
                    Number(
                      set?.reps ||
                      0
                    );

                  bestWeight =
                    Math.max(
                      bestWeight,
                      weight
                    );

                  bestReps =
                    Math.max(
                      bestReps,
                      reps
                    );

                  bestVolume =
                    Math.max(
                      bestVolume,
                      weight *
                      reps
                    );

                }
              );

              if (
                !bestWeight &&
                !bestReps
              ) {
                return;
              }

              if (
                !exerciseMap
                  .has(
                    name
                  )
              ) {
                exerciseMap
                  .set(
                    name,
                    []
                  );
              }

              exerciseMap
                .get(
                  name
                )
                .push({
                  date:
                    logDate,

                  dateRaw:
                    log?.date ||
                    null,

                  weight:
                    bestWeight,

                  reps:
                    bestReps,

                  setVolume:
                    bestVolume,

                  logIndex
                });

            }
          );

        }
      );

    exerciseMap
      .forEach(
        points => {

          points.sort(
            (
              a,
              b
            ) =>
              a.date -
              b.date ||
              a.logIndex -
              b.logIndex
          );

        }
      );

    return exerciseMap;
  }

  function exerciseOptions() {
    const map =
      exerciseSeries();

    return [
      ...map.entries()
    ]
      .map(
        (
          [
            name,
            points
          ]
        ) => ({
          name,
          points,
          count:
            points.length
        })
      )
      .sort(
        (
          a,
          b
        ) =>
          b.count -
          a.count ||
          a.name
            .localeCompare(
              b.name
            )
      );
  }

  function ensureSelectedExercise() {
    const options =
      exerciseOptions();

    if (
      !options.length
    ) {
      selectedExercise =
        "";

      return options;
    }

    if (
      !selectedExercise ||
      !options.some(
        item =>
          item.name ===
          selectedExercise
      )
    ) {
      selectedExercise =
        options[
          0
        ].name;
    }

    return options;
  }

  function miniStat(
    label,
    value
  ) {
    return `
      <div
        class="mana-v913-mini-stat"
      >

        <div
          class="mana-v913-mini-label"
        >
          ${esc(label)}
        </div>

        <div
          class="mana-v913-mini-value"
        >
          ${esc(value)}
        </div>

      </div>
    `;
  }

  function strengthProgressHtml() {
    const options =
      ensureSelectedExercise();

    if (
      !options.length
    ) {
      return `
        <div
          class="mana-v913-section"
        >

          <div
            class="mana-v913-section-head"
          >

            <h3>
              Strength Progression
            </h3>

            <span>
              BY EXERCISE
            </span>

          </div>

          <div
            class="mana-v913-empty"
          >
            Complete weighted sets and
            your exercise progression
            will appear here.
          </div>

        </div>
      `;
    }

    const map =
      exerciseSeries();

    const allPoints =
      map.get(
        selectedExercise
      ) || [];

    const points =
      allPoints.slice(
        -8
      );

    const best =
      allPoints.reduce(
        (
          max,
          point
        ) =>
          Math.max(
            max,
            point.weight
          ),
        0
      );

    const firstWeight =
      allPoints.find(
        point =>
          point.weight > 0
      )?.weight ||
      0;

    const latestWeight =
      [
        ...allPoints
      ]
        .reverse()
        .find(
          point =>
            point.weight > 0
        )?.weight ||
      0;

    const gain =
      firstWeight > 0 &&
      latestWeight > 0
        ? latestWeight -
          firstWeight
        : 0;

    const maxChart =
      Math.max(
        1,
        ...points.map(
          point =>
            point.weight
        )
      );

    return `
      <div
        class="mana-v913-section mana-v913-strength-section"
      >

        <div
          class="mana-v913-section-head"
        >

          <div>

            <div
              class="mana-v913-eyebrow"
            >
              STRENGTH
            </div>

            <h3>
              Exercise Progression
            </h3>

          </div>

          <span>
            LAST ${Math.min(
              8,
              points.length
            )}
          </span>

        </div>

        <label
          class="mana-v913-select-label"
          for="manaV913ExerciseSelect"
        >
          Exercise
        </label>

        <select
          id="manaV913ExerciseSelect"
          class="mana-v913-select"
        >

          ${
            options
              .map(
                item => `
                  <option
                    value="${esc(
                      item.name
                    )}"
                    ${
                      item.name ===
                      selectedExercise
                        ? "selected"
                        : ""
                    }
                  >
                    ${esc(
                      item.name
                    )}
                  </option>
                `
              )
              .join("")
          }

        </select>

        <div
          class="mana-v913-strength-stats"
        >

          ${miniStat(
            "Best load",
            best
              ? `${formatNumber(
                  best
                )} kg`
              : "—"
          )}

          ${miniStat(
            "Sessions",
            allPoints.length
          )}

          ${miniStat(
            "Change",
            gain
              ? `${gain > 0 ? "+" : ""}${formatNumber(
                  gain
                )} kg`
              : "—"
          )}

        </div>

        <div
          class="mana-v913-strength-chart"
        >

          ${
            points
              .map(
                point => {

                  const height =
                    point.weight > 0
                      ? Math.max(
                          8,
                          Math.round(
                            point.weight /
                            maxChart *
                            100
                          )
                        )
                      : 3;

                  return `
                    <div
                      class="mana-v913-strength-bar-wrap"
                    >

                      <div
                        class="mana-v913-strength-value"
                      >
                        ${
                          point.weight
                            ? formatNumber(
                                point.weight
                              )
                            : ""
                        }
                      </div>

                      <div
                        class="mana-v913-strength-track"
                      >

                        <div
                          class="mana-v913-strength-bar"
                          style="
                            height:${height}%;
                          "
                        ></div>

                      </div>

                      <div
                        class="mana-v913-strength-date"
                      >
                        ${formatDate(
                          point.dateRaw
                        )}
                      </div>

                    </div>
                  `;

                }
              )
              .join("")
          }

        </div>

        <div
          class="mana-v913-strength-note"
        >
          Bars show your heaviest
          completed set for
          ${esc(
            selectedExercise
          )}
          in each recorded workout.
        </div>

      </div>
    `;
  }

  /* =========================================
     WEEK SNAPSHOT HTML
     ========================================= */

  function snapshotCard(
    label,
    value,
    sub
  ) {
    return `
      <div
        class="mana-v913-snapshot-card"
      >

        <div
          class="mana-v913-snapshot-label"
        >
          ${esc(label)}
        </div>

        <div
          class="mana-v913-snapshot-value"
        >
          ${esc(value)}
        </div>

        <div
          class="mana-v913-snapshot-sub"
        >
          ${esc(sub)}
        </div>

      </div>
    `;
  }

  function snapshotHtml() {
    const week =
      thisWeekSnapshot();

    const targets =
      loadTargets();

    const workoutSub =
      week.planned
        ? `${week.workouts} of ${week.planned} planned sessions`
        : `${week.workouts} completed session${week.workouts === 1 ? "" : "s"}`;

    return `
      <div
        class="mana-v913-section mana-v913-week"
      >

        <div
          class="mana-v913-section-head"
        >

          <div>

            <div
              class="mana-v913-eyebrow"
            >
              THIS WEEK
            </div>

            <h3>
              Weekly Snapshot
            </h3>

          </div>

          <span>
            LIVE
          </span>

        </div>

        <div
          class="mana-v913-week-main"
        >

          <div
            class="mana-v913-ring"
            style="
              --progress:${week.workoutPercent * 3.6}deg
            "
          >

            <div
              class="mana-v913-ring-inner"
            >

              <strong>
                ${week.workoutPercent}%
              </strong>

              <small>
                complete
              </small>

            </div>

          </div>

          <div
            class="mana-v913-week-copy"
          >

            <div
              class="mana-v913-week-title"
            >
              Training target
            </div>

            <div
              class="mana-v913-week-value"
            >
              ${esc(
                workoutSub
              )}
            </div>

            <div
              class="mana-v913-progress-track"
            >

              <div
                class="mana-v913-progress-fill"
                style="
                  width:${week.workoutPercent}%
                "
              ></div>

            </div>

          </div>

        </div>

        <div
          class="mana-v913-snapshot-grid"
        >

          ${snapshotCard(
            "Workouts",
            week.workouts,
            week.planned
              ? `${week.planned} planned`
              : "Completed"
          )}

          ${snapshotCard(
            "Volume",
            week.volume
              ? `${formatNumber(
                  week.volume
                )} kg`
              : "—",
            "Load moved"
          )}

          ${snapshotCard(
            "Protein",
            targets.protein
              ? `${week.proteinDays}/7`
              : "—",
            targets.protein
              ? "Target days"
              : "Set target in Fuel"
          )}

          ${snapshotCard(
            "Water",
            targets.water
              ? `${week.waterDays}/7`
              : "—",
            targets.water
              ? "Target days"
              : "Set target in Fuel"
          )}

          ${snapshotCard(
            "Fuel logged",
            `${week.fuelDays}/7`,
            "Days with entries"
          )}

          ${snapshotCard(
            "Recovery",
            week.recoveryDays,
            "Recovery days"
          )}

        </div>

      </div>
    `;
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
        data-v913-range="${range}"
        class="${
          selectedRange ===
          range
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
        data-v913-metric="${metric}"
        class="${
          selectedMetric ===
          metric
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
        class="mana-v913-stat"
      >

        <div
          class="mana-v913-stat-label"
        >
          ${esc(label)}
        </div>

        <div
          class="mana-v913-stat-value"
        >
          ${esc(value)}
        </div>

        <div
          class="mana-v913-stat-sub"
        >
          ${esc(sub)}
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
        class="mana-v913-performance-card"
      >

        <div
          class="mana-v913-performance-label"
        >
          ${esc(label)}
        </div>

        <div
          class="mana-v913-performance-value"
        >
          ${esc(value)}
        </div>

      </div>
    `;
  }

  /* =========================================
     RESET
     ========================================= */

  function resetButtonHtml() {
    return `
      <div
        class="mana-v913-reset-zone"
      >

        <div>

          <div
            class="mana-v913-reset-title"
          >
            Testing complete?
          </div>

          <div
            class="mana-v913-reset-copy"
          >
            Reset removes workout history,
            volume, PBs and strength progression.
            Fuel entries and nutrition targets
            stay untouched.
          </div>

        </div>

        <button
          type="button"
          id="manaV913ResetTraining"
          class="mana-v913-reset-btn"
        >
          Reset Training History
        </button>

      </div>
    `;
  }

  function resetTrainingHistory() {
    const logs =
      loadLogs();

    if (
      !logs.length
    ) {
      window.alert(
        "There is no training history to reset."
      );

      return;
    }

    const firstConfirm =
      window.confirm(
        `Reset all ${logs.length} recorded workout${logs.length === 1 ? "" : "s"}?\n\nThis will clear workout history, volume, personal bests and strength progression. Fuel data will NOT be deleted.`
      );

    if (
      !firstConfirm
    ) {
      return;
    }

    const typed =
      window.prompt(
        "Type RESET to confirm. This cannot be undone."
      );

    if (
      String(
        typed || ""
      )
        .trim()
        .toUpperCase() !==
      "RESET"
    ) {
      window.alert(
        "Reset cancelled."
      );

      return;
    }

    saveLogs(
      []
    );

    selectedExercise =
      "";

    window.dispatchEvent(
      new CustomEvent(
        "mana:strength-progress-reset"
      )
    );

    window.dispatchEvent(
      new CustomEvent(
        "mana:strength-synced"
      )
    );

    render();

    window.alert(
      "Training history has been reset. Fuel data and nutrition targets were kept."
    );
  }

  /* =========================================
     STYLES
     ========================================= */

  function injectStyles() {
    [
      "mana-v9111-progress-style",
      "mana-v912-progress-style"
    ].forEach(
      id => {
        document
          .getElementById(
            id
          )
          ?.remove();
      }
    );

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
        padding-bottom:32px;
      }

      .mana-v913-head{
        margin-bottom:16px;
      }

      .mana-v913-kicker,
      .mana-v913-eyebrow{
        color:#f3d875;
        font-size:10px;
        font-weight:900;
        letter-spacing:.13em;
      }

      .mana-v913-head h2{
        margin:6px 0 5px;
        font-size:30px;
      }

      .mana-v913-head p{
        margin:0;
        color:#888;
        font-size:12px;
        line-height:1.5;
      }

      .mana-v913-tabs{
        display:grid;
        grid-template-columns:
          repeat(
            4,
            1fr
          );
        gap:7px;
        margin:15px 0;
      }

      .mana-v913-tabs button{
        min-height:43px;
        padding:7px 4px;
        border:1px solid #333;
        border-radius:12px;
        background:#0d0d0d;
        color:#888;
        font-size:9px;
        font-weight:900;
        letter-spacing:.03em;
        cursor:pointer;
      }

      .mana-v913-tabs button.active{
        border-color:#f3d875;
        background:#f3d875;
        color:#111;
      }

      .mana-v913-section{
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

      .mana-v913-section-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:12px;
        margin-bottom:14px;
      }

      .mana-v913-section-head h3{
        margin:0;
        font-size:19px;
      }

      .mana-v913-section-head span{
        color:#777;
        font-size:9px;
        font-weight:800;
        text-transform:uppercase;
        letter-spacing:.07em;
      }

      .mana-v913-metric-tabs{
        display:flex;
        gap:6px;
        overflow-x:auto;
        padding-bottom:3px;
        margin-bottom:14px;
        scrollbar-width:none;
      }

      .mana-v913-metric-tabs::-webkit-scrollbar{
        display:none;
      }

      .mana-v913-metric-tabs button{
        flex:0 0 auto;
        min-height:36px;
        padding:7px 10px;
        border:1px solid #303030;
        border-radius:999px;
        background:#0b0b0b;
        color:#888;
        font-size:9px;
        font-weight:900;
        cursor:pointer;
      }

      .mana-v913-metric-tabs button.active{
        border-color:#62531e;
        background:#171407;
        color:#f3d875;
      }

      .mana-v913-chart{
        height:190px;
        display:flex;
        align-items:stretch;
        gap:7px;
        overflow-x:auto;
        padding-top:12px;
      }

      .mana-v913-bar-wrap{
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

      .mana-v913-bar-value{
        color:#aaa;
        font-size:8px;
        white-space:nowrap;
      }

      .mana-v913-bar-track{
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

      .mana-v913-bar{
        width:100%;
        min-height:3px;
        border-radius:
          8px
          8px
          4px
          4px;
        background:#f3d875;
        transition:
          height
          .25s
          ease;
      }

      .mana-v913-bar-label{
        color:#666;
        font-size:8px;
        line-height:1.2;
      }

      .mana-v913-week{
        border-color:#3a3218;
        background:
          radial-gradient(
            circle
            at
            85%
            10%,
            rgba(
              243,
              216,
              117,
              .10
            ),
            transparent
            32%
          ),
          linear-gradient(
            145deg,
            #121108,
            #090909
            62%
          );
      }

      .mana-v913-week-main{
        display:grid;
        grid-template-columns:
          auto
          1fr;
        align-items:center;
        gap:17px;
        padding:
          4px
          0
          16px;
      }

      .mana-v913-ring{
        --progress:0deg;
        width:92px;
        height:92px;
        border-radius:50%;
        display:grid;
        place-items:center;
        background:
          conic-gradient(
            #f3d875
            var(--progress),
            #252525
            0deg
          );
      }

      .mana-v913-ring-inner{
        width:72px;
        height:72px;
        border-radius:50%;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        background:#0b0b0b;
        border:1px solid #28251a;
      }

      .mana-v913-ring-inner strong{
        color:#f3d875;
        font-size:21px;
        line-height:1;
      }

      .mana-v913-ring-inner small{
        margin-top:5px;
        color:#777;
        font-size:8px;
        text-transform:uppercase;
      }

      .mana-v913-week-title{
        color:#777;
        font-size:9px;
        font-weight:900;
        text-transform:uppercase;
        letter-spacing:.07em;
      }

      .mana-v913-week-value{
        margin-top:5px;
        color:#fff;
        font-size:15px;
        font-weight:900;
        line-height:1.35;
      }

      .mana-v913-progress-track{
        height:8px;
        margin-top:12px;
        overflow:hidden;
        border-radius:999px;
        background:#222;
      }

      .mana-v913-progress-fill{
        height:100%;
        border-radius:999px;
        background:#f3d875;
        transition:
          width
          .25s
          ease;
      }

      .mana-v913-snapshot-grid{
        display:grid;
        grid-template-columns:
          repeat(
            3,
            1fr
          );
        gap:8px;
      }

      .mana-v913-snapshot-card,
      .mana-v913-stat,
      .mana-v913-performance-card,
      .mana-v913-mini-stat{
        min-width:0;
        padding:12px;
        border:1px solid #292929;
        border-radius:15px;
        background:#0b0b0b;
      }

      .mana-v913-snapshot-label,
      .mana-v913-stat-label,
      .mana-v913-performance-label,
      .mana-v913-mini-label{
        color:#777;
        font-size:8px;
        font-weight:900;
        text-transform:uppercase;
        letter-spacing:.05em;
      }

      .mana-v913-snapshot-value,
      .mana-v913-stat-value,
      .mana-v913-mini-value{
        margin-top:6px;
        color:#f3d875;
        font-size:18px;
        font-weight:900;
        line-height:1.1;
        word-break:break-word;
      }

      .mana-v913-snapshot-sub,
      .mana-v913-stat-sub{
        margin-top:4px;
        color:#666;
        font-size:8px;
        line-height:1.35;
      }

      .mana-v913-grid{
        display:grid;
        grid-template-columns:
          repeat(
            2,
            1fr
          );
        gap:9px;
      }

      .mana-v913-stat{
        padding:14px;
        border-radius:17px;
      }

      .mana-v913-stat-value{
        font-size:22px;
      }

      .mana-v913-performance{
        display:grid;
        grid-template-columns:
          1fr
          1fr;
        gap:8px;
      }

      .mana-v913-performance-value{
        margin-top:6px;
        color:#fff;
        font-size:18px;
        font-weight:900;
      }

      .mana-v913-strength-section{
        border-color:#35301b;
      }

      .mana-v913-select-label{
        display:block;
        margin-bottom:6px;
        color:#777;
        font-size:8px;
        font-weight:900;
        text-transform:uppercase;
        letter-spacing:.06em;
      }

      .mana-v913-select{
        width:100%;
        min-height:44px;
        padding:0 12px;
        border:1px solid #343434;
        border-radius:12px;
        background:#0b0b0b;
        color:#fff;
        font-size:12px;
        font-weight:800;
        outline:none;
      }

      .mana-v913-select:focus{
        border-color:#7a6826;
      }

      .mana-v913-strength-stats{
        display:grid;
        grid-template-columns:
          repeat(
            3,
            1fr
          );
        gap:8px;
        margin-top:10px;
      }

      .mana-v913-mini-value{
        font-size:16px;
      }

      .mana-v913-strength-chart{
        height:180px;
        display:flex;
        gap:7px;
        align-items:stretch;
        overflow-x:auto;
        margin-top:16px;
        padding-top:8px;
      }

      .mana-v913-strength-bar-wrap{
        flex:1 0 42px;
        min-width:42px;
        display:grid;
        grid-template-rows:
          20px
          1fr
          28px;
        gap:4px;
        text-align:center;
      }

      .mana-v913-strength-value{
        color:#f3d875;
        font-size:8px;
        font-weight:900;
      }

      .mana-v913-strength-track{
        height:120px;
        display:flex;
        align-items:flex-end;
        overflow:hidden;
        border-radius:8px;
        background:#181818;
      }

      .mana-v913-strength-bar{
        width:100%;
        min-height:3px;
        border-radius:
          8px
          8px
          4px
          4px;
        background:
          linear-gradient(
            180deg,
            #f3d875,
            #a78d31
          );
      }

      .mana-v913-strength-date{
        color:#666;
        font-size:8px;
        line-height:1.2;
      }

      .mana-v913-strength-note{
        margin-top:10px;
        color:#777;
        font-size:9px;
        line-height:1.45;
      }

      .mana-v913-pb{
        display:grid;
        grid-template-columns:
          1fr
          auto;
        gap:12px;
        align-items:center;
        padding:12px 0;
        border-top:1px solid #252525;
      }

      .mana-v913-pb:first-of-type{
        border-top:0;
      }

      .mana-v913-pb-name{
        color:#eee;
        font-size:12px;
        font-weight:900;
      }

      .mana-v913-pb-date{
        margin-top:3px;
        color:#666;
        font-size:9px;
      }

      .mana-v913-pb-value{
        color:#f3d875;
        font-size:13px;
        font-weight:900;
        white-space:nowrap;
      }

      .mana-v913-workout{
        display:grid;
        grid-template-columns:
          1fr
          auto;
        gap:10px;
        padding:13px 0;
        border-top:1px solid #252525;
      }

      .mana-v913-workout:first-of-type{
        border-top:0;
      }

      .mana-v913-workout-name{
        color:#eee;
        font-size:12px;
        font-weight:900;
      }

      .mana-v913-workout-meta{
        margin-top:4px;
        color:#777;
        font-size:9px;
        line-height:1.45;
      }

      .mana-v913-workout-volume{
        color:#f3d875;
        font-size:11px;
        font-weight:900;
        text-align:right;
      }

      .mana-v913-feedback{
        grid-column:
          1 / -1;
        margin-top:5px;
      }

      .mana-v913-effort{
        display:inline-flex;
        padding:4px 7px;
        border:1px solid #4c411d;
        border-radius:999px;
        color:#f3d875;
        font-size:8px;
        font-weight:900;
        text-transform:uppercase;
      }

      .mana-v913-note{
        margin-top:6px;
        color:#999;
        font-size:9px;
        line-height:1.45;
      }

      .mana-v913-empty{
        padding:18px 4px;
        color:#777;
        font-size:11px;
        line-height:1.5;
      }

      .mana-v913-reset-zone{
        margin-top:18px;
        padding:16px;
        border:1px solid #3a2525;
        border-radius:18px;
        background:
          linear-gradient(
            145deg,
            #120d0d,
            #090909
          );
        display:grid;
        grid-template-columns:
          1fr
          auto;
        gap:16px;
        align-items:center;
      }

      .mana-v913-reset-title{
        color:#fff;
        font-size:13px;
        font-weight:900;
      }

      .mana-v913-reset-copy{
        margin-top:5px;
        color:#777;
        font-size:9px;
        line-height:1.45;
        max-width:520px;
      }

      .mana-v913-reset-btn{
        min-height:40px;
        padding:0 13px;
        border:1px solid #714141;
        border-radius:12px;
        background:#1b0e0e;
        color:#e8a3a3;
        font-size:9px;
        font-weight:900;
        text-transform:uppercase;
        letter-spacing:.04em;
        cursor:pointer;
      }

      .mana-v913-reset-btn:hover{
        background:#281111;
      }

      @media(max-width:560px){

        .mana-v913-snapshot-grid{
          grid-template-columns:
            repeat(
              2,
              1fr
            );
        }

        .mana-v913-reset-zone{
          grid-template-columns:
            1fr;
        }

        .mana-v913-reset-btn{
          width:100%;
        }

      }

      @media(max-width:380px){

        .mana-v913-tabs{
          grid-template-columns:
            1fr
            1fr;
        }

        .mana-v913-week-main{
          grid-template-columns:
            1fr;
          justify-items:center;
          text-align:center;
        }

        .mana-v913-week-copy{
          width:100%;
        }

        .mana-v913-strength-stats{
          grid-template-columns:
            1fr;
        }

        .mana-v913-workout{
          grid-template-columns:
            1fr;
        }

        .mana-v913-workout-volume{
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
          class="mana-v913-head"
        >

          <div
            class="mana-v913-kicker"
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

        <div
          class="mana-v913-tabs"
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

        <div
          class="mana-v913-section"
        >

          <div
            class="mana-v913-section-head"
          >

            <h3>
              ${metricLabel()} Trend
            </h3>

            <span>
              ${esc(
                stats.range.label
              )}
            </span>

          </div>

          <div
            class="mana-v913-metric-tabs"
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

        ${snapshotHtml()}

        ${strengthProgressHtml()}

        <div
          class="mana-v913-section"
        >

          <div
            class="mana-v913-section-head"
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
            class="mana-v913-grid"
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

        <div
          class="mana-v913-section"
        >

          <div
            class="mana-v913-section-head"
          >

            <h3>
              Training Performance
            </h3>

            <span>
              LIVE
            </span>

          </div>

          <div
            class="mana-v913-performance"
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

        <div
          class="mana-v913-section"
        >

          <div
            class="mana-v913-section-head"
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
                        class="mana-v913-pb"
                      >

                        <div>

                          <div
                            class="mana-v913-pb-name"
                          >
                            ${esc(
                              pb.name
                            )}
                          </div>

                          <div
                            class="mana-v913-pb-date"
                          >
                            ${formatDate(
                              pb.date
                            )}
                          </div>

                        </div>

                        <div
                          class="mana-v913-pb-value"
                        >
                          ${pb.weight} kg
                        </div>

                      </div>
                    `
                  )
                  .join("")
              : `
                  <div
                    class="mana-v913-empty"
                  >
                    Personal bests will appear
                    as you complete weighted
                    workouts.
                  </div>
                `
          }

        </div>

        <div
          class="mana-v913-section"
        >

          <div
            class="mana-v913-section-head"
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
                          class="mana-v913-workout"
                        >

                          <div>

                            <div
                              class="mana-v913-workout-name"
                            >
                              ${esc(
                                log.sessionName ||
                                "Strength Workout"
                              )}
                            </div>

                            <div
                              class="mana-v913-workout-meta"
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
                            class="mana-v913-workout-volume"
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
                                    class="mana-v913-feedback"
                                  >

                                    ${
                                      effort
                                        ? `
                                            <div
                                              class="mana-v913-effort"
                                            >
                                              ${esc(
                                                effort
                                              )}
                                              session
                                            </div>
                                          `
                                        : ""
                                    }

                                    ${
                                      note
                                        ? `
                                            <div
                                              class="mana-v913-note"
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
                    class="mana-v913-empty"
                  >
                    Complete a workout and it
                    will appear here.
                  </div>
                `
          }

        </div>

        ${resetButtonHtml()}

      </div>
    `;

    wireControls();
  }

  /* =========================================
     CONTROLS
     ========================================= */

  function wireControls() {
    document
      .querySelectorAll(
        "[data-v913-range]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              selectedRange =
                button.dataset
                  .v913Range;

              render();

            }
          );

        }
      );

    document
      .querySelectorAll(
        "[data-v913-metric]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              selectedMetric =
                button.dataset
                  .v913Metric;

              render();

            }
          );

        }
      );

    document
      .getElementById(
        "manaV913ExerciseSelect"
      )
      ?.addEventListener(
        "change",
        event => {

          selectedExercise =
            event.target.value;

          render();

        }
      );

    document
      .getElementById(
        "manaV913ResetTraining"
      )
      ?.addEventListener(
        "click",
        resetTrainingHistory
      );
  }

  /* =========================================
     WATCH
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

  function watch() {
    [
      "mana:program-tab-change",
      "mana:strength-synced",
      "mana:workout-feedback-saved",
      "mana:fuel-updated",
      "mana:recovery-updated"
    ].forEach(
      eventName => {

        window.addEventListener(
          eventName,
          () =>
            scheduleRender(
              140
            )
        );

      }
    );

    window.addEventListener(
      "focus",
      () =>
        scheduleRender(
          180
        )
    );

    window.addEventListener(
      "storage",
      event => {

        if (
          [
            LOG_KEY,
            PROGRAM_KEY,
            FUEL_KEY,
            TARGET_KEY,
            DAILY_KEY
          ].includes(
            event.key
          )
        ) {
          scheduleRender(
            120
          );
        }

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
