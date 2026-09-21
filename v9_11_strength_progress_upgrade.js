/* =========================================
   MANA MOVEMENT TRAINING v9.13.4
   PROGRESS DASHBOARD — WHOLE FILE REPLACEMENT
   ========================================= */
(() => {
  "use strict";

  const STYLE_ID = "mana-v9134-progress-style";
  const ROOT_ID = "manaV9134Progress";
  const LOG_KEY = "mana-strength-v64-logs";
  const PROGRAM_KEY = "mana-strength-v62-program";
  const FUEL_KEY = "mana-fuel-v571";
  const TARGET_KEY = "mana-fuel-v58-targets";
  const DAILY_KEY = "mana-strength-v866-daily";

  let selectedRange = "weekly";
  let selectedMetric = "workouts";
  let selectedExercise = "";
  let selectedStrengthMetric = "load";
  let renderTimer = null;

  const safeJson = (raw, fallback) => {
    try { return JSON.parse(raw); } catch (_) { return fallback; }
  };

  const esc = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  const parseDate = value => {
    if (!value) return null;

    const d = new Date(value);

    return Number.isNaN(
      d.getTime()
    )
      ? null
      : d;
  };

  const startOfDay = (
    d = new Date()
  ) =>
    new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate()
    );

  const startOfWeek = (
    d = new Date()
  ) => {
    const x =
      startOfDay(d);

    x.setDate(
      x.getDate() -
      (
        (
          x.getDay() +
          6
        ) % 7
      )
    );

    return x;
  };

  const startOfMonth = (
    d = new Date()
  ) =>
    new Date(
      d.getFullYear(),
      d.getMonth(),
      1
    );

  const addDays = (
    d,
    n
  ) => {
    const x =
      new Date(d);

    x.setDate(
      x.getDate() +
      n
    );

    return x;
  };

  const addMonths = (
    d,
    n
  ) =>
    new Date(
      d.getFullYear(),
      d.getMonth() +
      n,
      1
    );

  const dateKey =
    d => [
      d.getFullYear(),

      String(
        d.getMonth() +
        1
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

  const formatNumber =
    value =>
      Math.round(
        Number(
          value || 0
        )
      ).toLocaleString();

  const formatDecimal = (
    value,
    decimals = 1
  ) => {
    const n =
      Number(
        value || 0
      );

    if (!n) {
      return "—";
    }

    return Number.isInteger(n)
      ? String(n)
      : n.toFixed(
          decimals
        );
  };

  const formatLoad =
    value =>
      Number(
        value || 0
      )
        ? `${formatDecimal(
            value
          )} kg`
        : "—";

  const signedValue = (
    value,
    suffix = ""
  ) => {
    const n =
      Number(
        value || 0
      );

    if (!n) {
      return "—";
    }

    return `${
      n > 0
        ? "+"
        : ""
    }${formatDecimal(
      n
    )}${suffix}`;
  };

  const formatDate =
    value => {
      const d =
        parseDate(
          value
        );

      return d
        ? d.toLocaleDateString(
            undefined,
            {
              day:
                "numeric",

              month:
                "short"
            }
          )
        : "—";
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

  const estimated1RM = (
    weight,
    reps
  ) => {
    const w =
      Number(
        weight || 0
      );

    const r =
      Number(
        reps || 0
      );

    if (
      !w ||
      !r
    ) {
      return 0;
    }

    if (
      r === 1
    ) {
      return w;
    }

    return Math.round(
      (
        w *
        (
          1 +
          r / 30
        )
      ) *
      10
    ) / 10;
  };

  function loadLogs() {
    const x =
      safeJson(
        localStorage.getItem(
          LOG_KEY
        ) || "[]",
        []
      );

    return Array.isArray(
      x
    )
      ? x
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
    const x =
      safeJson(
        localStorage.getItem(
          FUEL_KEY
        ) || "{}",
        {}
      );

    return x &&
      typeof x ===
      "object"
        ? x
        : {};
  }

  function loadRecovery() {
    const x =
      safeJson(
        localStorage.getItem(
          DAILY_KEY
        ) || "{}",
        {}
      );

    return x &&
      typeof x ===
      "object"
        ? x
        : {};
  }

  function loadTargets() {
    const x =
      safeJson(
        localStorage.getItem(
          TARGET_KEY
        ) || "{}",
        {}
      );

    return {
      calories:
        Number(
          x.calories ||
          0
        ),

      protein:
        Number(
          x.protein ||
          0
        ),

      water:
        Number(
          x.water ||
          0
        )
    };
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

    Object
      .values(
        day?.meals ||
        {}
      )
      .forEach(
        items =>
          (
            items ||
            []
          )
            .forEach(
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
            )
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

  function logsInPeriod(
    start,
    end
  ) {
    return loadLogs()
      .filter(
        log => {

          const d =
            parseDate(
              log?.date
            );

          return Boolean(
            d &&
            d >= start &&
            d < end
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

    Object
      .entries(
        loadFuel()
      )
      .forEach(
        (
          [
            key,
            day
          ]
        ) => {

          const d =
            parseDate(
              `${key}T12:00:00`
            );

          if (
            !d ||
            d < start ||
            d >= end
          ) {
            return;
          }

          const v =
            fuelTotals(
              day
            );

          totals.calories +=
            v.calories;

          totals.protein +=
            v.protein;

          totals.water +=
            v.water;

          totals.days++;

        }
      );

    return totals;
  }

  function recoveryInPeriod(
    start,
    end
  ) {
    let count = 0;

    Object
      .entries(
        loadRecovery()
      )
      .forEach(
        (
          [
            key,
            day
          ]
        ) => {

          const d =
            parseDate(
              `${key}T12:00:00`
            );

          if (
            d &&
            d >= start &&
            d < end &&
            (
              day?.recovery ||
              day?.recoveryDone ||
              day?.recoveryComplete
            )
          ) {
            count++;
          }

        }
      );

    return count;
  }

  function earliestDataDate() {
    const dates =
      [];

    loadLogs()
      .forEach(
        log => {

          const d =
            parseDate(
              log?.date
            );

          if (d) {
            dates.push(
              d
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
            store ||
            {}
          )
          .forEach(
            key => {

              const d =
                parseDate(
                  `${key}T12:00:00`
                );

              if (d) {
                dates.push(
                  d
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
              d =>
                d.getTime()
            )
          )
        )
      : startOfMonth(
          new Date()
        );
  }

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
          s,
          l
        ) =>
          s +
          Number(
            l?.totalVolume ||
            0
          ),
        0
      );

    const duration =
      logs.reduce(
        (
          s,
          l
        ) =>
          s +
          Number(
            l?.durationSeconds ||
            0
          ),
        0
      );

    const avgCompletion =
      logs.length
        ? Math.round(
            logs.reduce(
              (
                s,
                l
              ) =>
                s +
                Number(
                  l?.completionPercent ||
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

  function weeklyTarget() {
    const p =
      loadProgram();

    const direct =
      Number(
        p?.days ||
        0
      );

    const sessions =
      Array.isArray(
        p?.sessions
      )
        ? p.sessions.length
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
          s,
          l
        ) =>
          s +
          Number(
            l?.totalVolume ||
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

    let proteinDays = 0;
    let waterDays = 0;
    let fuelDays = 0;

    for (
      let i = 0;
      i < 7;
      i++
    ) {
      const v =
        fuelForDate(
          addDays(
            start,
            i
          )
        );

      if (
        v.calories ||
        v.protein ||
        v.water
      ) {
        fuelDays++;
      }

      if (
        targets.protein >
        0 &&
        v.protein >=
        targets.protein
      ) {
        proteinDays++;
      }

      if (
        targets.water >
        0 &&
        v.water >=
        targets.water
      ) {
        waterDays++;
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
          i
        ) => {

          const start =
            addDays(
              today,
              i - 6
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
          i
        ) => {

          const start =
            addDays(
              current,
              (
                i -
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
              i === 7
                ? "Now"
                : `${7 - i}w`
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
          i
        ) => {

          const start =
            addMonths(
              current,
              i - 5
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
        class="mana-v9134-chart"
      >
        ${
          periods
            .map(
              (
                period,
                i
              ) => {

                const value =
                  values[
                    i
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
                    class="mana-v9134-bar-wrap"
                  >

                    <div
                      class="mana-v9134-bar-value"
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
                      class="mana-v9134-bar-track"
                    >
                      <div
                        class="mana-v9134-bar"
                        style="
                          height:${height}%
                        "
                      ></div>
                    </div>

                    <div
                      class="mana-v9134-bar-label"
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

  function personalBests() {
    const map =
      new Map();

    loadLogs()
      .forEach(
        log =>
          (
            log?.exercises ||
            []
          )
            .forEach(
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
                )
                  .forEach(
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
            )
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

    return clampPercent(
      logsInPeriod(
        start,
        addDays(
          start,
          7
        )
      ).length /
      target *
      100
    );
  }

  function exerciseSeries() {
    const map =
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
          )
            .forEach(
              exercise => {

                const name =
                  String(
                    exercise?.name ||
                    ""
                  ).trim();

                if (!name) {
                  return;
                }

                const sets =
                  (
                    exercise?.sets ||
                    []
                  )
                    .filter(
                      s =>
                        s?.done
                    )
                    .map(
                      s => ({
                        weight:
                          Number(
                            s?.weight ||
                            0
                          ),

                        reps:
                          Number(
                            s?.reps ||
                            0
                          )
                      })
                    )
                    .filter(
                      s =>
                        s.weight >
                        0 ||
                        s.reps >
                        0
                    );

                if (
                  !sets.length
                ) {
                  return;
                }

                const bestLoadSet =
                  sets.reduce(
                    (
                      best,
                      s
                    ) =>
                      s.weight >
                      best.weight
                        ? s
                        : best,
                    sets[0]
                  );

                const bestRepsSet =
                  sets.reduce(
                    (
                      best,
                      s
                    ) =>
                      s.reps >
                      best.reps
                        ? s
                        : best,
                    sets[0]
                  );

                const bestE1RMSet =
                  sets.reduce(
                    (
                      best,
                      s
                    ) =>
                      estimated1RM(
                        s.weight,
                        s.reps
                      ) >
                      estimated1RM(
                        best.weight,
                        best.reps
                      )
                        ? s
                        : best,
                    sets[0]
                  );

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

                map
                  .get(
                    name
                  )
                  .push({
                    date:
                      logDate,

                    dateRaw:
                      log?.date ||
                      null,

                    load:
                      bestLoadSet.weight,

                    loadReps:
                      bestLoadSet.reps,

                    reps:
                      bestRepsSet.reps,

                    repsWeight:
                      bestRepsSet.weight,

                    e1rm:
                      estimated1RM(
                        bestE1RMSet.weight,
                        bestE1RMSet.reps
                      ),

                    e1rmWeight:
                      bestE1RMSet.weight,

                    e1rmReps:
                      bestE1RMSet.reps,

                    logIndex
                  });

              }
            );

        }
      );

    map.forEach(
      points =>
        points.sort(
          (
            a,
            b
          ) =>
            a.date -
            b.date ||
            a.logIndex -
            b.logIndex
        )
    );

    return map;
  }

  function exerciseOptions() {
    return [
      ...exerciseSeries()
        .entries()
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
        x =>
          x.name ===
          selectedExercise
      )
    ) {
      selectedExercise =
        options[0].name;
    }

    return options;
  }

  function strengthMetricValue(
    point
  ) {
    if (
      selectedStrengthMetric ===
      "reps"
    ) {
      return Number(
        point?.reps ||
        0
      );
    }

    if (
      selectedStrengthMetric ===
      "e1rm"
    ) {
      return Number(
        point?.e1rm ||
        0
      );
    }

    return Number(
      point?.load ||
      0
    );
  }

  function strengthMetricLabel() {
    return selectedStrengthMetric ===
      "reps"
      ? "Reps"
      : selectedStrengthMetric ===
        "e1rm"
        ? "Estimated 1RM"
        : "Load";
  }

  function strengthMetricFormat(
    value
  ) {
    if (!value) {
      return "—";
    }

    if (
      selectedStrengthMetric ===
      "reps"
    ) {
      return `${formatNumber(
        value
      )} reps`;
    }

    return `${formatDecimal(
      value
    )} kg`;
  }

  function strengthBarLabel(
    value
  ) {
    if (!value) {
      return "";
    }

    if (
      selectedStrengthMetric ===
      "reps"
    ) {
      return `${formatNumber(
        value
      )}r`;
    }

    return `${formatDecimal(
      value
    )}kg`;
  }

  function strengthMetricSigned(
    value
  ) {
    return selectedStrengthMetric ===
      "reps"
      ? signedValue(
          value,
          " reps"
        )
      : signedValue(
          value,
          " kg"
        );
  }

  function strengthMetricButton(
    metric,
    label
  ) {
    return `
      <button
        type="button"
        data-v9134-strength-metric="${metric}"
        class="${
          selectedStrengthMetric ===
          metric
            ? "active"
            : ""
        }"
      >
        ${label}
      </button>
    `;
  }

  function strengthInsight({
    name,
    latest,
    previous,
    first,
    best
  }) {
    const metricName =
      strengthMetricLabel()
        .toLowerCase();

    if (!latest) {
      return `${name} will build a ${metricName} trend as you log completed sets.`;
    }

    if (
      best > 0 &&
      latest >= best
    ) {
      if (
        previous &&
        latest > previous
      ) {
        return `${name}: new ${strengthMetricLabel()} best. Latest is ${strengthMetricSigned(
          latest -
          previous
        )} versus your previous session.`;
      }

      return `${name}: latest session matched your current ${metricName} best of ${strengthMetricFormat(
        best
      )}.`;
    }

    if (
      first &&
      latest > first
    ) {
      return `${name} is ${strengthMetricSigned(
        latest -
        first
      )} up since your first recorded session.`;
    }

    if (
      previous &&
      latest > previous
    ) {
      return `${name} improved ${strengthMetricSigned(
        latest -
        previous
      )} from your previous session.`;
    }

    if (
      best &&
      latest < best
    ) {
      return `${name}: latest ${metricName} is ${strengthMetricFormat(
        best -
        latest
      )} below your current best of ${strengthMetricFormat(
        best
      )}.`;
    }

    return `${name}: keep logging sessions to build a clearer long-term ${metricName} trend.`;
  }

  function miniStat(
    label,
    value
  ) {
    return `
      <div
        class="mana-v9134-mini-stat"
      >
        <div
          class="mana-v9134-mini-label"
        >
          ${esc(label)}
        </div>

        <div
          class="mana-v9134-mini-value"
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
          class="mana-v9134-section"
        >
          <div
            class="mana-v9134-section-head"
          >
            <h3>
              Strength Progression
            </h3>

            <span>
              BY EXERCISE
            </span>
          </div>

          <div
            class="mana-v9134-empty"
          >
            Complete weighted sets and
            your exercise progression
            will appear here.
          </div>
        </div>
      `;
    }

    const allPoints =
      exerciseSeries()
        .get(
          selectedExercise
        ) || [];

    const points =
      allPoints.slice(
        -8
      );

    const metricPoints =
      allPoints.filter(
        p =>
          strengthMetricValue(
            p
          ) > 0
      );

    const latestPoint =
      metricPoints.at(
        -1
      ) || null;

    const previousPoint =
      metricPoints.length >
      1
        ? metricPoints.at(
            -2
          )
        : null;

    const firstPoint =
      metricPoints[0] ||
      null;

    const latest =
      strengthMetricValue(
        latestPoint
      );

    const previous =
      strengthMetricValue(
        previousPoint
      );

    const first =
      strengthMetricValue(
        firstPoint
      );

    const best =
      metricPoints.reduce(
        (
          m,
          p
        ) =>
          Math.max(
            m,
            strengthMetricValue(
              p
            )
          ),
        0
      );

    const sinceStart =
      latest &&
      first
        ? latest -
          first
        : 0;

    const vsPrevious =
      latest &&
      previous
        ? latest -
          previous
        : 0;

    const maxChart =
      Math.max(
        1,
        ...points.map(
          strengthMetricValue
        )
      );

    const insight =
      strengthInsight({
        name:
          selectedExercise,

        latest,
        previous,
        first,
        best
      });

    return `
      <div
        class="mana-v9134-section mana-v9134-strength-section"
      >

        <div
          class="mana-v9134-section-head"
        >
          <div>
            <div
              class="mana-v9134-eyebrow"
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
          class="mana-v9134-select-label"
          for="manaV9134ExerciseSelect"
        >
          Exercise
        </label>

        <select
          id="manaV9134ExerciseSelect"
          class="mana-v9134-select"
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
          class="mana-v9134-strength-metric-tabs"
        >
          ${strengthMetricButton(
            "load",
            "LOAD"
          )}

          ${strengthMetricButton(
            "reps",
            "REPS"
          )}

          ${strengthMetricButton(
            "e1rm",
            "EST. 1RM"
          )}
        </div>

        <div
          class="mana-v9134-strength-stats"
        >
          ${miniStat(
            "Latest",
            strengthMetricFormat(
              latest
            )
          )}

          ${miniStat(
            "Best",
            strengthMetricFormat(
              best
            )
          )}

          ${miniStat(
            "Sessions",
            allPoints.length
          )}

          ${miniStat(
            "Since start",
            first &&
            latest
              ? strengthMetricSigned(
                  sinceStart
                )
              : "—"
          )}

          ${miniStat(
            "Vs previous",
            previous &&
            latest
              ? strengthMetricSigned(
                  vsPrevious
                )
              : "—"
          )}
        </div>

        <div
          class="mana-v9134-strength-chart"
        >
          ${
            points
              .map(
                point => {

                  const value =
                    strengthMetricValue(
                      point
                    );

                  const height =
                    value > 0
                      ? Math.max(
                          8,
                          Math.round(
                            value /
                            maxChart *
                            100
                          )
                        )
                      : 3;

                  const isPB =
                    value > 0 &&
                    Math.abs(
                      value -
                      best
                    ) <
                    0.0001;

                  return `
                    <div
                      class="mana-v9134-strength-bar-wrap"
                    >

                      <div
                        class="mana-v9134-strength-top"
                      >
                        ${
                          isPB
                            ? `
                                <span
                                  class="mana-v9134-pb-badge"
                                >
                                  PB
                                </span>
                              `
                            : ""
                        }

                        <span>
                          ${strengthBarLabel(
                            value
                          )}
                        </span>
                      </div>

                      <div
                        class="mana-v9134-strength-track"
                      >
                        <div
                          class="mana-v9134-strength-bar ${
                            isPB
                              ? "pb"
                              : ""
                          }"
                          style="
                            height:${height}%
                          "
                        ></div>
                      </div>

                      <div
                        class="mana-v9134-strength-date"
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
          class="mana-v9134-insight"
        >
          <div
            class="mana-v9134-insight-kicker"
          >
            COACHING INSIGHT
          </div>

          <div
            class="mana-v9134-insight-copy"
          >
            ${esc(
              insight
            )}
          </div>
        </div>

        <div
          class="mana-v9134-strength-note"
        >
          Chart values automatically change
          with LOAD, REPS or EST. 1RM.
          Gold PB badges mark every session
          that equals your best value for the
          selected metric. Estimated 1RM uses
          the Epley formula.
        </div>

      </div>
    `;
  }

  function snapshotCard(
    label,
    value,
    sub
  ) {
    return `
      <div
        class="mana-v9134-snapshot-card"
      >
        <div
          class="mana-v9134-snapshot-label"
        >
          ${esc(label)}
        </div>

        <div
          class="mana-v9134-snapshot-value"
        >
          ${esc(value)}
        </div>

        <div
          class="mana-v9134-snapshot-sub"
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
        class="mana-v9134-section mana-v9134-week"
      >

        <div
          class="mana-v9134-section-head"
        >
          <div>
            <div
              class="mana-v9134-eyebrow"
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
          class="mana-v9134-week-main"
        >
          <div
            class="mana-v9134-ring"
            style="
              --progress:${week.workoutPercent * 3.6}deg
            "
          >
            <div
              class="mana-v9134-ring-inner"
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
            class="mana-v9134-week-copy"
          >
            <div
              class="mana-v9134-week-title"
            >
              Training target
            </div>

            <div
              class="mana-v9134-week-value"
            >
              ${esc(
                workoutSub
              )}
            </div>

            <div
              class="mana-v9134-progress-track"
            >
              <div
                class="mana-v9134-progress-fill"
                style="
                  width:${week.workoutPercent}%
                "
              ></div>
            </div>
          </div>
        </div>

        <div
          class="mana-v9134-snapshot-grid"
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

  function rangeButton(
    range,
    label
  ) {
    return `
      <button
        type="button"
        data-v9134-range="${range}"
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
        data-v9134-metric="${metric}"
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
        class="mana-v9134-stat"
      >
        <div
          class="mana-v9134-stat-label"
        >
          ${esc(label)}
        </div>

        <div
          class="mana-v9134-stat-value"
        >
          ${esc(value)}
        </div>

        <div
          class="mana-v9134-stat-sub"
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
        class="mana-v9134-performance-card"
      >
        <div
          class="mana-v9134-performance-label"
        >
          ${esc(label)}
        </div>

        <div
          class="mana-v9134-performance-value"
        >
          ${esc(value)}
        </div>
      </div>
    `;
  }

  function resetButtonHtml() {
    return `
      <div
        class="mana-v9134-reset-zone"
      >
        <div>
          <div
            class="mana-v9134-reset-title"
          >
            Testing complete?
          </div>

          <div
            class="mana-v9134-reset-copy"
          >
            Reset removes workout history,
            training volume, personal bests
            and exercise progression.
            Fuel and nutrition data stay
            untouched.
          </div>
        </div>

        <button
          type="button"
          id="manaV9134ResetTraining"
          class="mana-v9134-reset-btn"
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
      alert(
        "There is no training history to reset."
      );

      return;
    }

    if (
      !confirm(
        `Reset all ${logs.length} recorded workout${logs.length === 1 ? "" : "s"}?\n\nWorkout history, volume, PBs and exercise progression will be cleared.\n\nFuel data will NOT be deleted.`
      )
    ) {
      return;
    }

    const typed =
      prompt(
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
      alert(
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

    alert(
      "Training history reset. Fuel and nutrition data were kept."
    );
  }

  function injectStyles() {
    [
      "mana-v9111-progress-style",
      "mana-v912-progress-style",
      "mana-v913-progress-style",
      "mana-v9132-progress-style",
      "mana-v9133-progress-style"
    ].forEach(
      id =>
        document
          .getElementById(
            id
          )
          ?.remove()
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

      .mana-v9134-head{
        margin-bottom:16px;
      }

      .mana-v9134-kicker,
      .mana-v9134-eyebrow{
        color:#f3d875;
        font-size:10px;
        font-weight:900;
        letter-spacing:.13em;
      }

      .mana-v9134-head h2{
        margin:6px 0 5px;
        font-size:30px;
      }

      .mana-v9134-head p{
        margin:0;
        color:#888;
        font-size:12px;
        line-height:1.5;
      }

      .mana-v9134-tabs{
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:7px;
        margin:15px 0;
      }

      .mana-v9134-tabs button{
        min-height:43px;
        padding:7px 4px;
        border:1px solid #333;
        border-radius:12px;
        background:#0d0d0d;
        color:#888;
        font-size:9px;
        font-weight:900;
        cursor:pointer;
      }

      .mana-v9134-tabs button.active{
        border-color:#f3d875;
        background:#f3d875;
        color:#111;
      }

      .mana-v9134-section{
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

      .mana-v9134-section-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:12px;
        margin-bottom:14px;
      }

      .mana-v9134-section-head h3{
        margin:0;
        font-size:19px;
      }

      .mana-v9134-section-head span{
        color:#777;
        font-size:9px;
        font-weight:800;
        text-transform:uppercase;
      }

      .mana-v9134-metric-tabs,
      .mana-v9134-strength-metric-tabs{
        display:flex;
        gap:6px;
        overflow-x:auto;
        margin-bottom:14px;
        padding-bottom:3px;
      }

      .mana-v9134-strength-metric-tabs{
        margin-top:10px;
        margin-bottom:10px;
      }

      .mana-v9134-metric-tabs button,
      .mana-v9134-strength-metric-tabs button{
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

      .mana-v9134-metric-tabs button.active,
      .mana-v9134-strength-metric-tabs button.active{
        border-color:#62531e;
        background:#171407;
        color:#f3d875;
      }

      .mana-v9134-chart{
        height:190px;
        display:flex;
        gap:7px;
        overflow-x:auto;
        padding-top:12px;
      }

      .mana-v9134-bar-wrap{
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

      .mana-v9134-bar-value{
        color:#aaa;
        font-size:8px;
      }

      .mana-v9134-bar-track{
        height:130px;
        display:flex;
        align-items:flex-end;
        overflow:hidden;
        border-radius:8px;
        background:#181818;
      }

      .mana-v9134-bar{
        width:100%;
        min-height:3px;
        border-radius:
          8px
          8px
          4px
          4px;
        background:#f3d875;
      }

      .mana-v9134-bar-label{
        color:#666;
        font-size:8px;
      }

      .mana-v9134-week{
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

      .mana-v9134-week-main{
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

      .mana-v9134-ring{
        --progress:0deg;
        width:92px;
        height:92px;
        display:grid;
        place-items:center;
        border-radius:50%;
        background:
          conic-gradient(
            #f3d875
            var(--progress),
            #252525
            0deg
          );
      }

      .mana-v9134-ring-inner{
        width:72px;
        height:72px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        border:1px solid #28251a;
        border-radius:50%;
        background:#0b0b0b;
      }

      .mana-v9134-ring-inner strong{
        color:#f3d875;
        font-size:21px;
      }

      .mana-v9134-ring-inner small{
        margin-top:5px;
        color:#777;
        font-size:8px;
        text-transform:uppercase;
      }

      .mana-v9134-week-title{
        color:#777;
        font-size:9px;
        font-weight:900;
        text-transform:uppercase;
      }

      .mana-v9134-week-value{
        margin-top:5px;
        color:#fff;
        font-size:15px;
        font-weight:900;
      }

      .mana-v9134-progress-track{
        height:8px;
        margin-top:12px;
        overflow:hidden;
        border-radius:999px;
        background:#222;
      }

      .mana-v9134-progress-fill{
        height:100%;
        border-radius:999px;
        background:#f3d875;
      }

      .mana-v9134-snapshot-grid{
        display:grid;
        grid-template-columns:
          repeat(
            3,
            1fr
          );
        gap:8px;
      }

      .mana-v9134-snapshot-card,
      .mana-v9134-stat,
      .mana-v9134-performance-card,
      .mana-v9134-mini-stat{
        min-width:0;
        padding:12px;
        border:1px solid #292929;
        border-radius:15px;
        background:#0b0b0b;
      }

      .mana-v9134-snapshot-label,
      .mana-v9134-stat-label,
      .mana-v9134-performance-label,
      .mana-v9134-mini-label{
        color:#777;
        font-size:8px;
        font-weight:900;
        text-transform:uppercase;
      }

      .mana-v9134-snapshot-value,
      .mana-v9134-stat-value,
      .mana-v9134-mini-value{
        margin-top:6px;
        color:#f3d875;
        font-size:18px;
        font-weight:900;
      }

      .mana-v9134-snapshot-sub,
      .mana-v9134-stat-sub{
        margin-top:4px;
        color:#666;
        font-size:8px;
      }

      .mana-v9134-grid{
        display:grid;
        grid-template-columns:
          repeat(
            2,
            1fr
          );
        gap:9px;
      }

      .mana-v9134-stat-value{
        font-size:22px;
      }

      .mana-v9134-performance{
        display:grid;
        grid-template-columns:
          1fr
          1fr;
        gap:8px;
      }

      .mana-v9134-performance-value{
        margin-top:6px;
        color:#fff;
        font-size:18px;
        font-weight:900;
      }

      .mana-v9134-strength-section{
        border-color:#35301b;
      }

      .mana-v9134-select-label{
        display:block;
        margin-bottom:6px;
        color:#777;
        font-size:8px;
        font-weight:900;
        text-transform:uppercase;
      }

      .mana-v9134-select{
        width:100%;
        min-height:44px;
        padding:0 12px;
        border:1px solid #343434;
        border-radius:12px;
        background:#0b0b0b;
        color:#fff;
        font-size:12px;
        font-weight:800;
      }

      .mana-v9134-strength-stats{
        display:grid;
        grid-template-columns:
          repeat(
            5,
            1fr
          );
        gap:8px;
        margin-top:10px;
      }

      .mana-v9134-mini-value{
        font-size:16px;
      }

      .mana-v9134-strength-chart{
        height:190px;
        display:flex;
        gap:7px;
        overflow-x:auto;
        margin-top:16px;
        padding-top:8px;
      }

      .mana-v9134-strength-bar-wrap{
        flex:1 0 48px;
        min-width:48px;
        display:grid;
        grid-template-rows:
          28px
          1fr
          28px;
        gap:4px;
        text-align:center;
      }

      .mana-v9134-strength-top{
        display:flex;
        align-items:center;
        justify-content:center;
        gap:3px;
        color:#f3d875;
        font-size:8px;
        font-weight:900;
        white-space:nowrap;
      }

      .mana-v9134-pb-badge{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        padding:2px 4px;
        border:1px solid #806c25;
        border-radius:999px;
        background:#211b06;
        color:#f3d875;
        font-size:7px;
        line-height:1;
      }

      .mana-v9134-strength-track{
        height:120px;
        display:flex;
        align-items:flex-end;
        overflow:hidden;
        border-radius:8px;
        background:#181818;
      }

      .mana-v9134-strength-bar{
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

      .mana-v9134-strength-bar.pb{
        box-shadow:
          inset
          0
          0
          0
          1px
          #f3d875,
          0
          0
          12px
          rgba(
            243,
            216,
            117,
            .16
          );
      }

      .mana-v9134-strength-date{
        color:#666;
        font-size:8px;
      }

      .mana-v9134-insight{
        margin-top:14px;
        padding:13px;
        border:1px solid #3b341d;
        border-radius:14px;
        background:#141106;
      }

      .mana-v9134-insight-kicker{
        color:#f3d875;
        font-size:8px;
        font-weight:900;
      }

      .mana-v9134-insight-copy{
        margin-top:5px;
        color:#ddd;
        font-size:10px;
        font-weight:700;
        line-height:1.45;
      }

      .mana-v9134-strength-note{
        margin-top:10px;
        color:#777;
        font-size:9px;
        line-height:1.45;
      }

      .mana-v9134-pb{
        display:grid;
        grid-template-columns:
          1fr
          auto;
        gap:12px;
        align-items:center;
        padding:12px 0;
        border-top:1px solid #252525;
      }

      .mana-v9134-pb-name{
        color:#eee;
        font-size:12px;
        font-weight:900;
      }

      .mana-v9134-pb-date{
        margin-top:3px;
        color:#666;
        font-size:9px;
      }

      .mana-v9134-pb-value{
        color:#f3d875;
        font-size:13px;
        font-weight:900;
      }

      .mana-v9134-workout{
        display:grid;
        grid-template-columns:
          1fr
          auto;
        gap:10px;
        padding:13px 0;
        border-top:1px solid #252525;
      }

      .mana-v9134-workout-name{
        color:#eee;
        font-size:12px;
        font-weight:900;
      }

      .mana-v9134-workout-meta{
        margin-top:4px;
        color:#777;
        font-size:9px;
      }

      .mana-v9134-workout-volume{
        color:#f3d875;
        font-size:11px;
        font-weight:900;
      }

      .mana-v9134-feedback{
        grid-column:
          1 / -1;
      }

      .mana-v9134-effort{
        display:inline-flex;
        margin-top:5px;
        padding:4px 7px;
        border:1px solid #4c411d;
        border-radius:999px;
        color:#f3d875;
        font-size:8px;
        font-weight:900;
      }

      .mana-v9134-note{
        margin-top:6px;
        color:#999;
        font-size:9px;
      }

      .mana-v9134-empty{
        padding:18px 4px;
        color:#777;
        font-size:11px;
      }

      .mana-v9134-reset-zone{
        margin-top:18px;
        padding:16px;
        display:grid;
        grid-template-columns:
          1fr
          auto;
        gap:16px;
        align-items:center;
        border:1px solid #3a2525;
        border-radius:18px;
        background:
          linear-gradient(
            145deg,
            #120d0d,
            #090909
          );
      }

      .mana-v9134-reset-title{
        color:#fff;
        font-size:13px;
        font-weight:900;
      }

      .mana-v9134-reset-copy{
        margin-top:5px;
        color:#777;
        font-size:9px;
        line-height:1.45;
      }

      .mana-v9134-reset-btn{
        min-height:40px;
        padding:0 13px;
        border:1px solid #714141;
        border-radius:12px;
        background:#1b0e0e;
        color:#e8a3a3;
        font-size:9px;
        font-weight:900;
        cursor:pointer;
      }

      @media(max-width:760px){

        .mana-v9134-strength-stats{
          grid-template-columns:
            repeat(
              3,
              1fr
            );
        }

      }

      @media(max-width:560px){

        .mana-v9134-snapshot-grid{
          grid-template-columns:
            repeat(
              2,
              1fr
            );
        }

        .mana-v9134-strength-stats{
          grid-template-columns:
            repeat(
              2,
              1fr
            );
        }

        .mana-v9134-reset-zone{
          grid-template-columns:
            1fr;
        }

        .mana-v9134-reset-btn{
          width:100%;
        }

      }

      @media(max-width:380px){

        .mana-v9134-tabs{
          grid-template-columns:
            1fr
            1fr;
        }

        .mana-v9134-week-main{
          grid-template-columns:
            1fr;
          text-align:center;
        }

        .mana-v9134-strength-stats{
          grid-template-columns:
            1fr;
        }

        .mana-v9134-workout{
          grid-template-columns:
            1fr;
        }

      }
    `;

    document.head.appendChild(
      style
    );
  }

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
          class="mana-v9134-head"
        >
          <div
            class="mana-v9134-kicker"
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
          class="mana-v9134-tabs"
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
          class="mana-v9134-section"
        >
          <div
            class="mana-v9134-section-head"
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
            class="mana-v9134-metric-tabs"
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
          class="mana-v9134-section"
        >
          <div
            class="mana-v9134-section-head"
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
            class="mana-v9134-grid"
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
          class="mana-v9134-section"
        >
          <div
            class="mana-v9134-section-head"
          >
            <h3>
              Training Performance
            </h3>

            <span>
              LIVE
            </span>
          </div>

          <div
            class="mana-v9134-performance"
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
          class="mana-v9134-section"
        >
          <div
            class="mana-v9134-section-head"
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
                        class="mana-v9134-pb"
                      >
                        <div>
                          <div
                            class="mana-v9134-pb-name"
                          >
                            ${esc(
                              pb.name
                            )}
                          </div>

                          <div
                            class="mana-v9134-pb-date"
                          >
                            ${formatDate(
                              pb.date
                            )}
                          </div>
                        </div>

                        <div
                          class="mana-v9134-pb-value"
                        >
                          ${formatLoad(
                            pb.weight
                          )}
                        </div>
                      </div>
                    `
                  )
                  .join("")
              : `
                  <div
                    class="mana-v9134-empty"
                  >
                    Personal bests will appear
                    as you complete weighted
                    workouts.
                  </div>
                `
          }
        </div>

        <div
          class="mana-v9134-section"
        >
          <div
            class="mana-v9134-section-head"
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
                          class="mana-v9134-workout"
                        >

                          <div>
                            <div
                              class="mana-v9134-workout-name"
                            >
                              ${esc(
                                log.sessionName ||
                                "Strength Workout"
                              )}
                            </div>

                            <div
                              class="mana-v9134-workout-meta"
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
                            class="mana-v9134-workout-volume"
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
                                    class="mana-v9134-feedback"
                                  >
                                    ${
                                      effort
                                        ? `
                                            <div
                                              class="mana-v9134-effort"
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
                                              class="mana-v9134-note"
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
                    class="mana-v9134-empty"
                  >
                    Complete a workout and
                    it will appear here.
                  </div>
                `
          }
        </div>

        ${resetButtonHtml()}

      </div>
    `;

    wireControls();
  }

  function wireControls() {
    document
      .querySelectorAll(
        "[data-v9134-range]"
      )
      .forEach(
        b =>
          b.addEventListener(
            "click",
            () => {

              selectedRange =
                b.dataset
                  .v9134Range;

              render();

            }
          )
      );

    document
      .querySelectorAll(
        "[data-v9134-metric]"
      )
      .forEach(
        b =>
          b.addEventListener(
            "click",
            () => {

              selectedMetric =
                b.dataset
                  .v9134Metric;

              render();

            }
          )
      );

    document
      .querySelectorAll(
        "[data-v9134-strength-metric]"
      )
      .forEach(
        b =>
          b.addEventListener(
            "click",
            () => {

              selectedStrengthMetric =
                b.dataset
                  .v9134StrengthMetric;

              render();

            }
          )
      );

    document
      .getElementById(
        "manaV9134ExerciseSelect"
      )
      ?.addEventListener(
        "change",
        e => {

          selectedExercise =
            e.target.value;

          render();

        }
      );

    document
      .getElementById(
        "manaV9134ResetTraining"
      )
      ?.addEventListener(
        "click",
        resetTrainingHistory
      );
  }

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
      name =>
        window.addEventListener(
          name,
          () =>
            scheduleRender(
              140
            )
        )
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
      e => {

        if (
          [
            LOG_KEY,
            PROGRAM_KEY,
            FUEL_KEY,
            TARGET_KEY,
            DAILY_KEY
          ].includes(
            e.key
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
      e => {

        if (
          e.target.closest(
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

  function init() {
    injectStyles();
    watch();

    [
      900,
      1500,
      2400
    ].forEach(
      delay =>
        setTimeout(
          render,
          delay
        )
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
