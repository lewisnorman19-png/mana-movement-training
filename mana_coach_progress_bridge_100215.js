
/*
 MANA MOVEMENT
 COACH PROGRAMS PROGRESS BRIDGE
 COMPLETE BUILD 100216

 Full replacement:
 mana_coach_progress_bridge_100215.js

 - Original Mana Strength Progress layout
 - Original Workouts / Protein / Calories / Rest metrics
 - Original Weight Progression layout and body-weight data
 - Personal Bests with estimated 1RM
 - By Exercise selector and training history
 - Workouts Complete summary and individual records
 - Cardio, Core, ratings and comments
 - Preserves existing Coach Programs cloud data
 - No changes to workout logging or exercise cards
*/

(() => {
  "use strict";

  const BUILD = "100216";

  const ROOT = "manaV993StrengthProgress";
  const HOLDER = "manaV83Content";

  const PANEL = "m1002CoachProgress";
  const SWITCH = "m1002ProgressSwitch";

  const STYLE = "manaCoachProgressBridge100216Style";

  const $ = id => document.getElementById(id);

  const esc = value => String(value ?? "").replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character])
  );

  const num = value => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const decimal = value =>
    num(value).toLocaleString("en-AU", {
      maximumFractionDigits: 1
    });

  const number = value =>
    Math.round(num(value)).toLocaleString("en-AU");

  const formatDate = value => {
    const d = new Date(value || 0);

    return Number.isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString("en-AU");
  };

  const percent = (value, total) =>
    total
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(num(value) / num(total) * 100)
          )
        )
      : 0;

  function safeJSON(key, fallback) {
    try {
      const value = localStorage.getItem(key);

      return value
        ? JSON.parse(value)
        : fallback;
    } catch (_) {
      return fallback;
    }
  }

  let view = "generated";
  let period = "all";
  let detail = "workouts";
  let selectedExercise = "";

  let logs = [];
  let userId = "";

  let loading = false;
  let loadedAt = 0;
  let error = "";
  let request = 0;

  let originalMetrics = "";
  let scheduled = false;

  let holderObserver = null;
  let panelObserver = null;
  let observedPanel = null;

  function progressOpen() {
    return !!(
      $("manaV83ProgramShell")?.classList.contains("open") &&
      $("manaV83Title")?.textContent
        ?.trim()
        .toUpperCase() === "MANA STRENGTH" &&
      document.querySelector(
        '#manaV83Tabs [data-v83-tab="progress"].active'
      ) &&
      $(ROOT)
    );
  }

  function clearWorkoutMode() {
    const current = document.querySelector(
      '#manaV83Tabs [data-v83-tab="program"].active'
    );

    if (!current) {
      $(HOLDER)?.classList.remove("m1002-coach-mode");
    }
  }

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `
      /*
       Match the original Mana Strength
       Progress typography, sizing and panels.
      */

      #${SWITCH}{
        display:grid!important;
        grid-template-columns:1fr 1fr;
        gap:7px;
        padding:5px;
        margin:0 0 15px;
        background:#090909;
        border:1px solid #292929;
        border-radius:14px;
      }

      #${SWITCH} button{
        min-width:0;
        min-height:43px;
        padding:9px;
        background:transparent!important;
        border:0!important;
        border-radius:10px;
        color:#aaa!important;
        -webkit-text-fill-color:#aaa!important;
        font-size:11px;
        font-weight:900;
        font-family:inherit;
        cursor:pointer;
      }

      #${SWITCH} button.active{
        background:#f3d875!important;
        color:#111!important;
        -webkit-text-fill-color:#111!important;
      }

      #${ROOT}.m1002-show-coach
      > #${PANEL}{
        display:block!important;
      }

      #${PANEL}{
        display:none;
        width:100%;
        color:#fff;
      }

      #${ROOT}.m1002-show-coach #${PANEL}{
        display:block!important;
      }

      #${PANEL} .mana-v993-head h2,
      #${PANEL} .mana-v993-panel h3{
        color:#fff!important;
      }

      #${PANEL} .mana-v993-periods{
        grid-template-columns:repeat(4,minmax(0,1fr));
      }

      #${PANEL} .mana-v993-period{
        min-width:0;
        padding:8px 4px;
        font-size:9px;
      }

      #${PANEL} .mana-v993-metrics{
        grid-template-columns:repeat(4,minmax(0,1fr));
      }

      #${PANEL} .mana-v993-detail-nav{
        grid-template-columns:repeat(4,minmax(0,1fr));
      }

      #${PANEL} .mana-v993-detail-btn{
        min-width:0;
        white-space:normal;
      }

      #${PANEL} .mana-v993-metric-value{
        overflow-wrap:anywhere;
      }

      #${PANEL} .mana-v993-row-value{
        overflow-wrap:anywhere;
      }

      #${PANEL} .mana-v993-row-title{
        color:#eee;
      }

      #${PANEL} .mana-v993-row-sub{
        color:#888;
      }

      #${PANEL} .mana-v993-empty{
        color:#929292;
      }

      #${PANEL} .mana-v993-summary-grid{
        grid-template-columns:repeat(3,minmax(0,1fr));
      }

      #${PANEL} .m100216-note{
        margin-top:10px;
        font-size:11px;
        color:#999;
        line-height:1.6;
      }

      #${PANEL} .m100216-history{
        margin-top:11px;
      }

      #${PANEL} .m100216-history details{
        border-top:1px solid #292929;
        padding:12px 0;
      }

      #${PANEL} .m100216-history summary{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:10px;
        align-items:center;
        color:#eee;
        font-size:12px;
        font-weight:900;
        cursor:pointer;
        list-style:none;
      }

      #${PANEL} .m100216-history summary::-webkit-details-marker{
        display:none;
      }

      #${PANEL} .m100216-history summary small{
        display:block;
        color:#888;
        font-size:10px;
        line-height:1.5;
        font-weight:500;
        margin-top:4px;
      }

      #${PANEL} .m100216-history summary b{
        color:#f3d875;
        font-size:12px;
        text-align:right;
      }

      #${PANEL} .m100216-history-body{
        margin-top:11px;
        padding:11px;
        background:#090909;
        border:1px solid #2a2a2a;
        border-radius:11px;
      }

      #${PANEL} .m100216-exercise{
        padding:8px 0;
        border-bottom:1px solid #292929;
      }

      #${PANEL} .m100216-exercise:last-child{
        border-bottom:0;
      }

      #${PANEL} .m100216-exercise strong{
        display:block;
        color:#fff;
        font-size:12px;
        margin-bottom:5px;
      }

      #${PANEL} .m100216-exercise small{
        display:block;
        color:#999;
        font-size:11px;
        line-height:1.6;
      }

      #${PANEL} .m100216-finisher{
        padding:9px 0;
        color:#f3d875;
        font-size:11px;
        font-weight:800;
      }

      #${PANEL} .m100216-error{
        padding:11px;
        border:1px solid #8d5934;
        border-radius:10px;
        color:#ffb38b;
        font-size:12px;
        line-height:1.6;
      }

      @media(max-width:600px){
        #${PANEL} .mana-v993-metrics,
        #${PANEL} .mana-v993-detail-nav{
          grid-template-columns:repeat(2,minmax(0,1fr));
        }

        #${PANEL} .mana-v993-periods{
          grid-template-columns:repeat(4,minmax(0,1fr));
        }

        #${PANEL} .mana-v993-summary-grid{
          grid-template-columns:repeat(3,minmax(0,1fr));
        }

        #${PANEL} .mana-v993-summary{
          padding:9px 7px;
        }

        #${PANEL} .mana-v993-summary strong{
          font-size:14px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /*
   Original Progress data:
   Protein, Calories and Rest are copied from
   the original Mana Strength metric cards.

   Coach workout totals are calculated from
   completed coach_workout_logs.
  */

  function captureOriginalMetrics() {
    const root = $(ROOT);

    if (!root) return;

    const source = [
      ...root.children
    ].find(
      element => element.classList
        ?.contains("mana-v993-metrics")
    );

    if (source) {
      originalMetrics = source.outerHTML;
    }
  }

  function originalMetricCards() {
    if (!originalMetrics) return [];

    const parser = document.createElement("div");
    parser.innerHTML = originalMetrics;

    return [
      ...parser.querySelectorAll(".mana-v993-metric")
    ].map(element => element.outerHTML);
  }

  function metric(label, value, sub, fill) {
    return `
      <div class="mana-v993-metric">
        <div class="mana-v993-metric-label">
          ${esc(label)}
        </div>

        <div class="mana-v993-metric-value">
          ${esc(value)}%
        </div>

        <div class="mana-v993-metric-sub">
          ${esc(sub)}
        </div>

        <div class="mana-v993-track">
          <div class="mana-v993-fill"
            style="width:${Math.min(100, num(fill))}%">
          </div>
        </div>
      </div>
    `;
  }

  function coachMetrics(selectedLogs) {
    const originals = originalMetricCards();

    const originalWorkout = originals[0]
      ? (() => {
          const temp = document.createElement("div");
          temp.innerHTML = originals[0];

          return temp.querySelector(
            ".mana-v993-metric-sub"
          )?.textContent || "";
        })()
      : "";

    const targetMatch = originalWorkout.match(
      /of\s+(\d+)\s+planned/i
    );

    const planned = targetMatch
      ? Number(targetMatch[1])
      : 0;

    const completed = selectedLogs.length;

    const fraction = planned
      ? percent(completed, planned)
      : completed
        ? 100
        : 0;

    const workoutCard = metric(
      "WORKOUTS",
      fraction,
      planned && period !== "all"
        ? `${completed} of ${planned} planned`
        : `${completed} completed coach workouts`,
      fraction
    );

    const otherCards = [
      ["PROTEIN", "Set protein target in Profile"],
      ["CALORIES", "Set calorie target in Profile"],
      ["REST", "No recovery data yet"]
    ];

    return `
      <div class="mana-v993-metrics">
        ${workoutCard}

        ${otherCards.map(([label, fallback], i) =>
          originals[i + 1] || metric(
            label,
            0,
            fallback,
            0
          )
        ).join("")}
      </div>
    `;
  }

  function filteredLogs() {
    if (period === "all") return logs;

    const now = new Date();
    const start = new Date(now);

    if (period === "daily") {
      start.setHours(0, 0, 0, 0);
    }

    if (period === "weekly") {
      start.setDate(
        now.getDate() - (now.getDay() + 6) % 7
      );

      start.setHours(0, 0, 0, 0);
    }

    if (period === "monthly") {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    }

    return logs.filter(log => {
      const completed = new Date(
        log.completed_at || log.updated_at
      );

      return completed >= start;
    });
  }

  function exerciseMap(rows) {
    const map = new Map();

    rows.slice().reverse().forEach(log => {
      const date = log.completed_at || log.updated_at;

      const exercises = Array.isArray(log.exercises)
        ? log.exercises
        : [];

      exercises.forEach(exercise => {
        const name = String(exercise.name || "").trim();

        if (!name) return;

        const sets = (
          Array.isArray(exercise.sets)
            ? exercise.sets
            : []
        ).filter(
          set =>
            set.done ||
            num(set.weight) > 0 ||
            num(set.reps) > 0
        );

        if (!sets.length) return;

        if (!map.has(name)) {
          map.set(name, []);
        }

        const maxWeight = Math.max(
          0,
          ...sets.map(set => num(set.weight))
        );

        const repsAtMax = Math.max(
          0,
          ...sets
            .filter(set =>
              num(set.weight) === maxWeight
            )
            .map(set => num(set.reps))
        );

        const e1RM = Math.max(
          0,
          ...sets.map(set => {
            const weight = num(set.weight);
            const reps = num(set.reps);

            if (!weight || !reps) return 0;

            return reps === 1
              ? weight
              : Math.round(
                  weight * (1 + reps / 30) * 10
                ) / 10;
          })
        );

        const volume = sets.reduce(
          (total, set) =>
            total +
            num(set.weight) * num(set.reps),
          0
        );

        map.get(name).push({
          date,
          maxWeight,
          repsAtMax,
          best1RM: e1RM,
          volume,
          sets
        });
      });
    });

    return map;
  }

  function summaryCard(label, value) {
    return `
      <div class="mana-v993-summary">
        <span>${esc(label)}</span>
        <strong>${esc(value)}</strong>
      </div>
    `;
  }

  function panel(kicker, title, content) {
    return `
      <div class="mana-v993-panel">
        <div class="mana-v993-panel-head">
          <div>
            <div class="mana-v993-panel-kicker">
              ${esc(kicker)}
            </div>

            <h3>${esc(title)}</h3>
          </div>
        </div>

        ${content}
      </div>
    `;
  }

  function empty(text) {
    return `
      <div class="mana-v993-empty">
        ${esc(text)}
      </div>
    `;
  }

  function weightPanel() {
    const values = safeJSON(
      "mana-strength-v947-body-weight",
      []
    );

    const entries = Array.isArray(values)
      ? values.filter(
          item =>
            item &&
            item.date &&
            num(item.weight) > 0
        ).sort(
          (a, b) =>
            new Date(a.date) - new Date(b.date)
        )
      : [];

    const profile = safeJSON(
      "mana-profile-v67",
      {}
    );

    const starting = entries.length
      ? num(entries[0].weight)
      : num(profile.weight);

    const current = entries.length
      ? num(entries[entries.length - 1].weight)
      : num(profile.weight);

    const change = current - starting;

    const rows = entries
      .slice()
      .reverse()
      .slice(0, 8)
      .map(entry => `
        <div class="mana-v993-row">
          <div>
            <div class="mana-v993-row-title">
              ${esc(formatDate(
                entry.date + "T12:00:00"
              ))}
            </div>

            <div class="mana-v993-row-sub">
              Body-weight check-in
            </div>
          </div>

          <div class="mana-v993-row-value">
            ${num(entry.weight).toFixed(1)} kg
          </div>
        </div>
      `).join("");

    return panel(
      "WEIGHT",
      "Weight Progression",
      `
        <div class="mana-v993-summary-grid">
          ${summaryCard(
            "START",
            starting
              ? starting.toFixed(1) + " kg"
              : "—"
          )}

          ${summaryCard(
            "CURRENT",
            current
              ? current.toFixed(1) + " kg"
              : "—"
          )}

          ${summaryCard(
            "CHANGE",
            starting && current
              ? (change > 0 ? "+" : "") +
                change.toFixed(1) + " kg"
              : "—"
          )}
        </div>

        <div style="margin-top:13px">
          ${rows || empty(
            "No body-weight check-ins yet."
          )}
        </div>
      `
    );
  }

  function personalBestPanel() {
    const map = exerciseMap(logs);
    const bests = [];

    map.forEach((entries, name) => {
      let best = null;

      entries.forEach(entry => {
        if (
          !best ||
          entry.best1RM > best.best1RM
        ) {
          best = { name, ...entry };
        }
      });

      if (best) bests.push(best);
    });

    bests.sort(
      (a, b) => b.best1RM - a.best1RM
    );

    const content = bests
      .slice(0, 12)
      .map(item => `
        <div class="mana-v993-row">
          <div>
            <div class="mana-v993-row-title">
              ${esc(item.name)}
            </div>

            <div class="mana-v993-row-sub">
              ${esc(formatDate(item.date))}
              • best set
              ${decimal(item.maxWeight)} kg
              × ${decimal(item.repsAtMax)}
            </div>
          </div>

          <div class="mana-v993-row-value">
            ${decimal(item.best1RM)} kg

            <br>

            <span style="color:#666;font-size:8px">
              EST. 1RM
            </span>
          </div>
        </div>
      `).join("");

    return panel(
      "STRENGTH",
      "Personal Bests",
      content || empty(
        "Complete some weighted exercises and your PBs will appear here."
      )
    );
  }

  function byExercisePanel() {
    const map = exerciseMap(logs);

    const names = [
      ...map.keys()
    ].sort(
      (a, b) => a.localeCompare(b)
    );

    if (!names.length) {
      return panel(
        "EXERCISES",
        "By Exercise",
        empty(
          "Exercise history will appear here after completed Strength workouts."
        )
      );
    }

    if (
      !selectedExercise ||
      !map.has(selectedExercise)
    ) {
      selectedExercise = names[0];
    }

    const entries = map.get(selectedExercise) || [];

    const first = entries[0];
    const last = entries[entries.length - 1];

    const bestLoad = Math.max(
      0,
      ...entries.map(e => e.maxWeight)
    );

    const best1RM = Math.max(
      0,
      ...entries.map(e => e.best1RM)
    );

    const loadChange =
      first && last
        ? last.maxWeight - first.maxWeight
        : 0;

    const history = entries
      .slice()
      .reverse()
      .slice(0, 8)
      .map(entry => `
        <div class="mana-v993-row">
          <div>
            <div class="mana-v993-row-title">
              ${esc(formatDate(entry.date))}
            </div>

            <div class="mana-v993-row-sub">
              ${decimal(entry.maxWeight)} kg
              × ${decimal(entry.repsAtMax)}
              • ${number(entry.volume)} kg volume
            </div>
          </div>

          <div class="mana-v993-row-value">
            ${decimal(entry.best1RM)} kg

            <br>

            <span style="color:#666;font-size:8px">
              E1RM
            </span>
          </div>
        </div>
      `).join("");

    return panel(
      "EXERCISE HISTORY",
      "By Exercise",
      `
        <select
          id="manaCoach216ExerciseSelect"
          class="mana-v993-exercise-select">

          ${names.map(name => `
            <option
              value="${esc(name)}"
              ${name === selectedExercise
                ? "selected"
                : ""}>
              ${esc(name)}
            </option>
          `).join("")}
        </select>

        <div class="mana-v993-summary-grid">
          ${summaryCard(
            "SESSIONS",
            entries.length
          )}

          ${summaryCard(
            "BEST LOAD",
            bestLoad
              ? decimal(bestLoad) + " kg"
              : "—"
          )}

          ${summaryCard(
            "LOAD CHANGE",
            entries.length > 1
              ? (loadChange > 0 ? "+" : "") +
                decimal(loadChange) + " kg"
              : "—"
          )}
        </div>

        <div class="m100216-note">
          Best estimated 1RM:
          <strong style="color:#f3d875">
            ${best1RM
              ? decimal(best1RM) + " kg"
              : "—"}
          </strong>
        </div>

        <div style="margin-top:10px">
          ${history}
        </div>
      `
    );
  }

  function workoutHistory(log) {
    const exercises = Array.isArray(log.exercises)
      ? log.exercises
      : [];

    const finishers = log.finishers || {};

    return `
      <div class="m100216-history-body">
        ${exercises.map(exercise => `
          <div class="m100216-exercise">
            <strong>${esc(
              exercise.name || "Exercise"
            )}</strong>

            <small>
              ${(Array.isArray(exercise.sets)
                ? exercise.sets
                : []
              ).map(set => `
                Set ${esc(set.set)}:
                ${decimal(set.weight)} kg ×
                ${decimal(set.reps)} reps
                ${set.done ? "✓" : ""}
              `).join(" • ")}
            </small>
          </div>
        `).join("")}

        ${finishers.cardio?.completed
          ? `
            <div class="m100216-finisher">
              ✓ Cardio:
              ${esc(
                finishers.cardio.equipment || ""
              )}
              • ${number(
                finishers.cardio.actualMinutes ||
                finishers.cardio.durationMinutes
              )} min
            </div>
          `
          : ""}

        ${finishers.core?.completed
          ? `
            <div class="m100216-finisher">
              ✓ Core:
              ${number(
                finishers.core.rounds || 3
              )} rounds
            </div>
          `
          : ""}

        ${log.workout_rating
          ? `
            <div class="m100216-note">
              Workout rating:
              ${decimal(log.workout_rating)}/5
            </div>
          `
          : ""}

        ${log.workout_comment
          ? `
            <div class="m100216-note">
              Comments:
              ${esc(log.workout_comment)}
            </div>
          `
          : ""}
      </div>
    `;
  }

  function workoutPanel() {
    const completed = logs.slice().sort(
      (a, b) =>
        new Date(
          b.completed_at || b.updated_at
        ) -
        new Date(
          a.completed_at || a.updated_at
        )
    );

    const totalVolume = completed.reduce(
      (sum, log) =>
        sum + num(log.total_volume),
      0
    );

    const totalExercises = exerciseMap(
      completed
    ).size;

    const history = completed
      .slice(0, 15)
      .map(log => {
        const duration = Math.round(
          num(log.duration_seconds) / 60
        );

        const completion = percent(
          log.completed_sets,
          log.total_sets
        );

        return `
          <details>
            <summary>
              <span>
                ${esc(
                  log.session_name ||
                  "Strength Workout"
                )}

                <small>
                  ${esc(formatDate(
                    log.completed_at ||
                    log.updated_at
                  ))}
                  • ${duration} min
                  • ${completion}% complete
                </small>
              </span>

              <b>
                ${number(log.total_volume)} kg

                <br>

                <span style="color:#777;font-size:8px">
                  VOLUME
                </span>
              </b>
            </summary>

            ${workoutHistory(log)}
          </details>
        `;
      })
      .join("");

    return panel(
      "TRAINING HISTORY",
      "Workouts Complete",
      `
        <div class="mana-v993-summary-grid">
          ${summaryCard(
            "WORKOUTS",
            completed.length
          )}

          ${summaryCard(
            "VOLUME",
            number(totalVolume)
          )}

          ${summaryCard(
            "EXERCISES",
            totalExercises
          )}
        </div>

        <div class="m100216-history">
          ${history || empty(
            "Completed workouts will appear here."
          )}
        </div>
      `
    );
  }

  function detailPanel() {
    if (detail === "weight") {
      return weightPanel();
    }

    if (detail === "pbs") {
      return personalBestPanel();
    }

    if (detail === "exercise") {
      return byExercisePanel();
    }

    return workoutPanel();
  }

  function button(value, title, attribute, current) {
    return `
      <button type="button"
        class="${
          attribute === "data-m100216-period"
            ? "mana-v993-period"
            : "mana-v993-detail-btn"
        } ${current === value ? "active" : ""}"
        ${attribute}="${value}">
        ${title}
      </button>
    `;
  }

  function coachHTML() {
    const selectedLogs = filteredLogs();

    return `
      <div data-m100216-root="true">
        <div class="mana-v993-head">
          <div class="mana-v993-kicker">
            MANA STRENGTH • PROGRESS
          </div>

          <h2>Your Progress</h2>

          <p>
            Keep the important numbers simple.
            Tap below when you want more detail.
          </p>
        </div>

        <div class="mana-v993-periods">
          ${button(
            "daily",
            "DAILY",
            "data-m100216-period",
            period
          )}

          ${button(
            "weekly",
            "WEEKLY",
            "data-m100216-period",
            period
          )}

          ${button(
            "monthly",
            "MONTHLY",
            "data-m100216-period",
            period
          )}

          ${button(
            "all",
            "ALL TIME",
            "data-m100216-period",
            period
          )}
        </div>

        ${coachMetrics(selectedLogs)}

        <div class="mana-v993-detail-nav">
          ${button(
            "weight",
            "WEIGHT PROGRESSION",
            "data-m100216-detail",
            detail
          )}

          ${button(
            "pbs",
            "PERSONAL BESTS",
            "data-m100216-detail",
            detail
          )}

          ${button(
            "exercise",
            "BY EXERCISE",
            "data-m100216-detail",
            detail
          )}

          ${button(
            "workouts",
            "WORKOUTS COMPLETE",
            "data-m100216-detail",
            detail
          )}
        </div>

        <div id="manaCoach216Detail">
          ${loading && !loadedAt
            ? panel(
                "COACH PROGRAMS",
                "Loading",
                empty("Loading coach workout results…")
              )
            : detailPanel()}
        </div>

        ${error
          ? `
            <div class="m100216-error">
              Unable to refresh coach results:
              ${esc(error)}
            </div>
          `
          : ""}
      </div>
    `;
  }

  function ensureRoots() {
    if (!progressOpen()) return null;

    const root = $(ROOT);
    if (!root) return null;

    let switcher = $(SWITCH);

    if (!switcher) {
      switcher = document.createElement("div");
      switcher.id = SWITCH;
    }

    if (switcher.parentElement !== root) {
      root.prepend(switcher);
    }

    if (
      !switcher.querySelector("[data-m100216-view]")
    ) {
      switcher.innerHTML = `
        <button type="button"
          data-m100216-view="generated">
          My Workouts
        </button>

        <button type="button"
          data-m100216-view="coach">
          Coach Programs
        </button>
      `;
    }

    let panelElement = $(PANEL);

    if (!panelElement) {
      panelElement = document.createElement("section");
      panelElement.id = PANEL;
    }

    if (panelElement.parentElement !== root) {
      switcher.after(panelElement);
    }

    if (observedPanel !== panelElement) {
      panelObserver?.disconnect();

      observedPanel = panelElement;

      panelObserver = new MutationObserver(() => {
        if (
          view === "coach" &&
          progressOpen() &&
          !panelElement.querySelector(
            "[data-m100216-root]"
          )
        ) {
          schedule();
        }
      });

      panelObserver.observe(panelElement, {
        childList: true
      });
    }

    return panelElement;
  }

  function renderCoach(force = false) {
    clearWorkoutMode();

    if (!progressOpen()) return;

    captureOriginalMetrics();

    const panelElement = ensureRoots();
    const root = $(ROOT);

    if (!panelElement || !root) return;

    root.classList.toggle(
      "m1002-show-coach",
      view === "coach"
    );

    $(SWITCH)?.querySelectorAll(
      "[data-m100216-view]"
    ).forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.m100216View === view
      );
    });

    if (view !== "coach") return;

    if (
      force ||
      !panelElement.querySelector(
        "[data-m100216-root]"
      )
    ) {
      panelElement.innerHTML = coachHTML();
    }
  }

  async function loadLogs(force = false) {
    if (!progressOpen() || loading) return;

    if (
      !force &&
      loadedAt &&
      Date.now() - loadedAt < 20000
    ) {
      return;
    }

    loading = true;
    error = "";

    const token = ++request;

    try {
      if (
        typeof window.supabaseClient !== "function"
      ) {
        throw Error("Mana cloud connection unavailable");
      }

      const db = await window.supabaseClient();
      const auth = await db.auth.getUser();

      if (auth.error) throw auth.error;

      const id = auth.data?.user?.id;

      if (!id) {
        throw Error(
          "Please sign in to view coach workout history"
        );
      }

      const response = await db
        .from("coach_workout_logs")
        .select("*")
        .eq("user_id", id)
        .eq("status", "completed")
        .order("completed_at", {
          ascending: false
        })
        .limit(500);

      if (response.error) throw response.error;
      if (token !== request) return;

      userId = id;
      logs = response.data || [];
      loadedAt = Date.now();

    } catch (e) {
      error = String(e.message || e);
      loadedAt = Date.now();
    } finally {
      loading = false;
      renderCoach(true);
    }
  }

  function schedule() {
    if (scheduled) return;

    scheduled = true;

    setTimeout(() => {
      scheduled = false;

      clearWorkoutMode();

      if (!progressOpen()) return;

      renderCoach();

      if (view === "coach") {
        void loadLogs();
      }
    }, 210);
  }

  function handleClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const appTab = target.closest(
      "#manaV83Tabs [data-v83-tab]"
    );

    if (appTab) {
      if (
        appTab.dataset.v83Tab !== "program"
      ) {
        $(HOLDER)?.classList.remove(
          "m1002-coach-mode"
        );
      }

      schedule();
    }

    const viewButton = target.closest(
      "[data-m100216-view]"
    );

    if (viewButton) {
      view =
        viewButton.dataset.m100216View === "coach"
          ? "coach"
          : "generated";

      renderCoach(true);

      if (view === "coach") {
        void loadLogs();
      }

      return;
    }

    const periodButton = target.closest(
      "[data-m100216-period]"
    );

    if (periodButton) {
      period = periodButton.dataset.m100216Period;
      renderCoach(true);
      return;
    }

    const detailButton = target.closest(
      "[data-m100216-detail]"
    );

    if (detailButton) {
      detail = detailButton.dataset.m100216Detail;
      renderCoach(true);
      return;
    }

    if (
      target.closest(
        "[data-m1002-progress-go]"
      )
    ) {
      view = "coach";

      schedule();

      setTimeout(
        () => void loadLogs(true),
        400
      );
    }
  }

  function handleChange(event) {
    const target = event.target;

    if (
      target?.id === "manaCoach216ExerciseSelect"
    ) {
      selectedExercise = target.value;
      renderCoach(true);
    }
  }

  function init() {
    installStyles();

    const holder = $(HOLDER);

    if (holder) {
      holderObserver = new MutationObserver(() => {
        clearWorkoutMode();

        if (progressOpen()) {
          schedule();
        }
      });

      holderObserver.observe(holder, {
        childList: true
      });
    }

    document.addEventListener(
      "click",
      handleClick,
      true
    );

    document.addEventListener(
      "change",
      handleChange
    );

    window.addEventListener(
      "mana:program-tab-change",
      schedule
    );

    window.addEventListener(
      "pageshow",
      schedule
    );

    window.addEventListener(
      "mana:coach-workout-saved",
      () => {
        loadedAt = 0;
        view = "coach";
        schedule();
      }
    );

    window.addEventListener(
      "mana:profile-synced",
      () => {
        if (view === "coach") {
          renderCoach(true);
        }
      }
    );

    window.addEventListener(
      "mana:logout",
      () => {
        ++request;

        logs = [];
        userId = "";
        loadedAt = 0;
        error = "";

        view = "generated";

        schedule();
      }
    );

    window.refreshManaCoachProgressBridge =
      () => loadLogs(true);

    window.MANA_COACH_PROGRESS_BRIDGE_BUILD =
      BUILD;

    schedule();

    console.log(
      "[Mana Movement] Coach Progress Bridge " +
      BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
