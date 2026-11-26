
/*
 MANA MOVEMENT — COACH PROGRAMS PROGRESS BRIDGE
 COMPLETE BUILD 100215

 Full new file:
 mana_coach_progress_bridge_100215.js

 Load AFTER:
 v10_02_client_custom_programs_100200.js
 v9_93_strength_progress_simple.js

 This file changes only the Progress UI.
 It does not edit workout recording or summaries.
*/

(() => {
  "use strict";

  const BUILD = "100215";
  const ROOT = "manaV993StrengthProgress";
  const HOLDER = "manaV83Content";
  const PANEL = "m1002CoachProgress";
  const SWITCH = "m1002ProgressSwitch";
  const STYLE = "manaCoachProgressBridge100215Style";

  const esc = value => String(value ?? "").replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c])
  );

  const $ = id => document.getElementById(id);
  const n = value => Number(value) || 0;

  const date = value => {
    const d = new Date(value || 0);

    return Number.isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString("en-AU");
  };

  const fmt = value => n(value).toLocaleString(
    "en-AU",
    { maximumFractionDigits: 1 }
  );

  const mins = seconds => Math.round(n(seconds) / 60);

  let view = "generated";
  let period = "all";
  let detail = "workouts";

  let rows = [];
  let user = "";
  let fetched = 0;
  let loading = false;
  let error = "";
  let requestId = 0;
  let scheduled = false;

  let observer = null;
  let panelObserver = null;
  let observedPanel = null;

  function isStrengthProgress() {
    return !!(
      $("manaV83ProgramShell")?.classList.contains("open") &&
      $("manaV83Title")?.textContent
        ?.trim().toUpperCase() === "MANA STRENGTH" &&
      document.querySelector(
        '#manaV83Tabs [data-v83-tab="progress"].active'
      )
    );
  }

  function clearStaleWorkoutMode() {
    if (!document.querySelector(
      '#manaV83Tabs [data-v83-tab="program"].active'
    )) {
      $(HOLDER)?.classList.remove("m1002-coach-mode");
    }
  }

  function injectStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `
      #${PANEL} .m100215-head {
        margin:14px 0 16px;
      }

      #${PANEL} .m100215-head h2 {
        color:#fff!important;
        font-size:24px;
        margin:6px 0;
      }

      #${PANEL} .m100215-sub {
        color:#aeb5be;
        font-size:12px;
        line-height:1.5;
      }

      #${PANEL} .m100215-kicker {
        color:#ff8126;
        font-size:10px;
        font-weight:900;
        letter-spacing:.1em;
      }

      #${PANEL} .m100215-bar,
      #${PANEL} .m100215-detail-nav {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:8px;
        margin:12px 0;
      }

      #${PANEL} button.m100215-choice {
        display:block;
        width:100%;
        min-height:45px;
        padding:9px 7px;
        border:1px solid #383e45!important;
        border-radius:11px;
        background:#1a1c20!important;
        color:#fff!important;
        -webkit-text-fill-color:#fff!important;
        font-family:inherit;
        font-size:11px;
        font-weight:800;
        cursor:pointer;
      }

      #${PANEL} button.m100215-choice.active {
        border-color:#ff8126!important;
        background:#291e17!important;
        color:#ff8126!important;
        -webkit-text-fill-color:#ff8126!important;
      }

      #${PANEL} .m100215-stats {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:9px;
        margin:13px 0;
      }

      #${PANEL} .m100215-stat {
        background:#17191d;
        border:1px solid #343940;
        border-radius:13px;
        padding:13px;
        min-width:0;
      }

      #${PANEL} .m100215-stat small {
        display:block;
        color:#aeb5bf;
        font-size:10px;
      }

      #${PANEL} .m100215-stat strong {
        display:block;
        color:#fff;
        font-size:23px;
        margin-top:6px;
        overflow-wrap:anywhere;
      }

      #${PANEL} .m100215-panel {
        background:#111315;
        border:1px solid #34383e;
        border-radius:15px;
        padding:14px;
        margin:13px 0;
        color:#fff;
      }

      #${PANEL} .m100215-panel h3 {
        font-size:18px;
        color:#fff!important;
        margin:4px 0 12px;
      }

      #${PANEL} .m100215-row {
        padding:12px 0;
        border-top:1px solid #33383f;
        font-size:12px;
        line-height:1.55;
        color:#c9cdd4;
      }

      #${PANEL} .m100215-row strong {
        display:block;
        color:#fff;
        font-size:13px;
      }

      #${PANEL} details.m100215-session {
        border:1px solid #363b42;
        border-radius:11px;
        margin:9px 0;
        padding:12px;
        background:#1a1c20;
      }

      #${PANEL} details.m100215-session summary {
        font-size:13px;
        color:#fff;
        font-weight:800;
        cursor:pointer;
      }

      #${PANEL} details.m100215-session p {
        color:#c6cbd1;
        font-size:12px;
        line-height:1.55;
        margin:9px 0;
      }

      #${PANEL} .m100215-error {
        color:#ffb38b!important;
        white-space:pre-wrap;
      }

      #${PANEL} .m100215-empty {
        color:#b6bdc6;
        font-size:12px;
        line-height:1.6;
      }

      #${ROOT}.m1002-show-coach > #${PANEL} {
        display:block!important;
      }

      @media(max-width:420px) {
        #${PANEL} .m100215-stat {
          padding:11px;
        }

        #${PANEL} .m100215-stat strong {
          font-size:20px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function periodRows() {
    if (period === "all") return rows;

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

    return rows.filter(
      r => new Date(r.completed_at || r.updated_at) >= start
    );
  }

  function exerciseHistory(logs) {
    const map = new Map();

    logs.slice().reverse().forEach(log => {
      const exercises = Array.isArray(log.exercises)
        ? log.exercises
        : [];

      exercises.forEach(ex => {
        const name = String(
          ex.name || "Unnamed exercise"
        );

        if (!map.has(name)) {
          map.set(name, []);
        }

        const sets = (
          Array.isArray(ex.sets) ? ex.sets : []
        ).filter(s => s.done);

        if (!sets.length) return;

        const weights = sets.map(
          s => n(s.weight)
        );

        const volume = sets.reduce(
          (total, s) =>
            total + n(s.weight) * n(s.reps),
          0
        );

        map.get(name).push({
          date: log.completed_at || log.updated_at,
          sets: sets.length,
          best: Math.max(...weights),
          reps: Math.max(...sets.map(s => n(s.reps))),
          volume
        });
      });
    });

    return map;
  }

  function stat(label, value) {
    return `
      <div class="m100215-stat">
        <small>${esc(label)}</small>
        <strong>${esc(value)}</strong>
      </div>
    `;
  }

  function sessionRows(logs) {
    if (!logs.length) {
      return `
        <p class="m100215-empty">
          No completed Coach Programs workouts
          in this period. Select ALL TIME
          to see earlier sessions.
        </p>
      `;
    }

    return logs.map(log => {
      const exercises = Array.isArray(log.exercises)
        ? log.exercises
        : [];

      const f = log.finishers || {};

      return `
        <details class="m100215-session">
          <summary>
            ${esc(log.session_name || "Coach Workout")}
            • ${esc(date(
              log.completed_at || log.updated_at
            ))}
          </summary>

          <p>
            Week ${esc(log.week_number)}
            • Day ${esc(log.day_number)}

            <br>
            ${fmt(log.completed_sets)}
            / ${fmt(log.total_sets)} sets

            • ${fmt(log.total_volume)} kg
            • ${mins(log.duration_seconds)} min
          </p>

          ${exercises.map(ex => `
            <div class="m100215-row">
              <strong>
                ${esc(ex.name || "Exercise")}
              </strong>

              ${(Array.isArray(ex.sets)
                ? ex.sets
                : []
              ).map(s => `
                Set ${esc(s.set)}:
                ${fmt(s.weight)} kg ×
                ${fmt(s.reps)} reps
                ${s.done ? "✓" : ""}
              `).join(" • ")}
            </div>
          `).join("")}

          ${f.cardio?.completed
            ? `
              <p>
                ✓ Cardio:
                ${esc(f.cardio.equipment || "")}
                • ${fmt(
                  f.cardio.actualMinutes ||
                  f.cardio.durationMinutes
                )} min
              </p>
            `
            : ""}

          ${f.core?.completed
            ? `
              <p>
                ✓ Core:
                ${fmt(f.core.rounds || 3)} rounds
              </p>
            `
            : ""}

          ${log.workout_rating
            ? `
              <p>
                Rating:
                ${fmt(log.workout_rating)} / 5
              </p>
            `
            : ""}

          ${log.workout_comment
            ? `
              <p>
                Comments:
                ${esc(log.workout_comment)}
              </p>
            `
            : ""}
        </details>
      `;
    }).join("");
  }

  function detailRows(logs) {
    const all = exerciseHistory(logs);

    if (detail === "workouts") {
      return sessionRows(logs);
    }

    if (!all.size) {
      return `
        <p class="m100215-empty">
          No completed exercise data for this
          period. Select ALL TIME to see
          earlier sessions.
        </p>
      `;
    }

    if (detail === "pbs") {
      return [...all].map(([name, entries]) => {
        const best = Math.max(
          ...entries.map(x => x.best)
        );

        const bestReps = Math.max(
          ...entries.map(x => x.reps)
        );

        return `
          <div class="m100215-row">
            <strong>${esc(name)}</strong>

            Heaviest completed set:
            ${fmt(best)} kg

            • Highest reps:
            ${fmt(bestReps)}
          </div>
        `;
      }).join("");
    }

    if (detail === "exercise") {
      return [...all].map(([name, entries]) => {
        const sets = entries.reduce(
          (a, e) => a + e.sets,
          0
        );

        const volume = entries.reduce(
          (a, e) => a + e.volume,
          0
        );

        return `
          <div class="m100215-row">
            <strong>${esc(name)}</strong>

            ${entries.length} sessions
            • ${sets} completed sets
            • ${fmt(volume)} kg total volume
          </div>
        `;
      }).join("");
    }

    return [...all].map(([name, entries]) => `
      <div class="m100215-row">
        <strong>${esc(name)}</strong>

        ${entries.map(e => `
          ${esc(date(e.date))}:
          ${fmt(e.best)} kg
        `).join(" • ")}
      </div>
    `).join("");
  }

  function choice(value, label, attr, active) {
    return `
      <button type="button"
        class="m100215-choice
          ${active === value ? "active" : ""}"
        ${attr}="${value}">
        ${label}
      </button>
    `;
  }

  function coachHTML() {
    const logs = periodRows();

    const completedSets = logs.reduce(
      (sum, row) => sum + n(row.completed_sets),
      0
    );

    const totalVolume = logs.reduce(
      (sum, row) => sum + n(row.total_volume),
      0
    );

    const cardio = logs.filter(
      row => row.finishers?.cardio?.completed
    );

    const core = logs.filter(
      row => row.finishers?.core?.completed
    );

    const cardioMinutes = cardio.reduce(
      (sum, row) =>
        sum + n(
          row.finishers.cardio.actualMinutes ||
          row.finishers.cardio.durationMinutes
        ),
      0
    );

    const titles = {
      weight: "Weight Progression",
      pbs: "Personal Bests",
      exercise: "By Exercise",
      workouts: "Workouts Complete"
    };

    return `
      <div data-m100215-ui="1">
        <div class="m100215-head">
          <span class="m100215-kicker">
            MANA STRENGTH • COACH PROGRAMS
          </span>

          <h2>Your Progress</h2>

          <p class="m100215-sub">
            Completed coach-assigned workouts,
            separately tracked from My Workouts.
          </p>
        </div>

        <div class="m100215-bar">
          ${choice(
            "daily", "DAILY",
            "data-m100215-period", period
          )}

          ${choice(
            "weekly", "WEEKLY",
            "data-m100215-period", period
          )}

          ${choice(
            "monthly", "MONTHLY",
            "data-m100215-period", period
          )}

          ${choice(
            "all", "ALL TIME",
            "data-m100215-period", period
          )}
        </div>

        <div class="m100215-stats">
          ${stat("WORKOUTS", logs.length)}
          ${stat("SETS COMPLETE", completedSets)}
          ${stat(
            "TOTAL VOLUME",
            fmt(totalVolume) + " kg"
          )}
          ${stat(
            "CARDIO",
            cardio.length + " / " +
            fmt(cardioMinutes) + " min"
          )}
          ${stat(
            "CORE",
            core.length + " sessions"
          )}
          ${stat(
            "TRAINING TIME",
            logs.reduce(
              (sum, row) =>
                sum + mins(row.duration_seconds),
              0
            ) + " min"
          )}
        </div>

        <div class="m100215-detail-nav">
          ${choice(
            "weight", "WEIGHT PROGRESSION",
            "data-m100215-detail", detail
          )}

          ${choice(
            "pbs", "PERSONAL BESTS",
            "data-m100215-detail", detail
          )}

          ${choice(
            "exercise", "BY EXERCISE",
            "data-m100215-detail", detail
          )}

          ${choice(
            "workouts", "WORKOUTS COMPLETE",
            "data-m100215-detail", detail
          )}
        </div>

        <section class="m100215-panel">
          <span class="m100215-kicker">
            COACH TRAINING HISTORY
          </span>

          <h3>${titles[detail]}</h3>

          ${loading && !fetched
            ? `
              <p class="m100215-empty">
                Loading your saved coach workouts…
              </p>
            `
            : detailRows(logs)}

          ${error
            ? `
              <p class="m100215-error">
                Unable to load coach history:
                ${esc(error)}
              </p>
            `
            : ""}
        </section>
      </div>
    `;
  }

  function ensureCoachPanel() {
    const root = $(ROOT);

    if (!root || !isStrengthProgress()) {
      return null;
    }

    let sw = $(SWITCH);

    if (!sw) {
      sw = document.createElement("div");
      sw.id = SWITCH;

      sw.innerHTML = `
        <button type="button"
          data-m1002-progress-mode="generated">
          My Workouts
        </button>

        <button type="button"
          data-m1002-progress-mode="coach">
          Coach Programs
        </button>
      `;
    }

    if (sw.parentElement !== root) {
      root.prepend(sw);
    }

    let panel = $(PANEL);

    if (!panel) {
      panel = document.createElement("section");
      panel.id = PANEL;
    }

    if (panel.parentElement !== root) {
      sw.after(panel);
    }

    if (observedPanel !== panel) {
      panelObserver?.disconnect();

      observedPanel = panel;

      panelObserver = new MutationObserver(() => {
        if (
          view === "coach" &&
          isStrengthProgress() &&
          !panel.querySelector("[data-m100215-ui]")
        ) {
          schedule();
        }
      });

      panelObserver.observe(panel, {
        childList: true
      });
    }

    return panel;
  }

  function paint() {
    clearStaleWorkoutMode();

    if (!isStrengthProgress()) return;

    const root = $(ROOT);
    const panel = ensureCoachPanel();

    if (!root || !panel) return;

    root.classList.toggle(
      "m1002-show-coach",
      view === "coach"
    );

    $(SWITCH)?.querySelectorAll(
      "[data-m1002-progress-mode]"
    ).forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.m1002ProgressMode === view
      );
    });

    if (view !== "coach") return;

    if (!panel.querySelector("[data-m100215-ui]")) {
      panel.innerHTML = coachHTML();
    }
  }

  async function fetchLogs(force = false) {
    if (loading || !isStrengthProgress()) return;

    if (
      !force &&
      fetched &&
      Date.now() - fetched < 20000
    ) return;

    loading = true;
    error = "";

    const token = ++requestId;

    try {
      if (
        typeof window.supabaseClient !== "function"
      ) {
        throw Error("Cloud connection unavailable");
      }

      const client = await window.supabaseClient();
      const auth = await client.auth.getUser();

      if (auth.error) throw auth.error;

      const id = auth.data?.user?.id;

      if (!id) {
        throw Error(
          "Please sign in to view your workouts"
        );
      }

      const response = await client
        .from("coach_workout_logs")
        .select("*")
        .eq("user_id", id)
        .eq("status", "completed")
        .order("completed_at", {
          ascending: false
        })
        .limit(500);

      if (response.error) {
        throw response.error;
      }

      if (token !== requestId) return;

      user = id;
      rows = response.data || [];
      fetched = Date.now();

    } catch (e) {
      error = String(e.message || e);
      fetched = Date.now();

    } finally {
      loading = false;

      const panel = $(PANEL);

      if (panel) {
        panel.innerHTML = "";
      }

      paint();
    }
  }

  function schedule() {
    if (scheduled) return;

    scheduled = true;

    setTimeout(() => {
      scheduled = false;
      paint();

      if (
        view === "coach" &&
        isStrengthProgress()
      ) {
        void fetchLogs();
      }
    }, 220);
  }

  function onClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const tab = target.closest(
      "#manaV83Tabs [data-v83-tab]"
    );

    if (tab) {
      if (tab.dataset.v83Tab !== "program") {
        $(HOLDER)?.classList.remove(
          "m1002-coach-mode"
        );
      }

      schedule();
    }

    const toggle = target.closest(
      "[data-m1002-progress-mode]"
    );

    if (toggle) {
      view =
        toggle.dataset.m1002ProgressMode === "coach"
          ? "coach"
          : "generated";

      schedule();

      if (view === "coach") {
        setTimeout(
          () => void fetchLogs(),
          260
        );
      }

      return;
    }

    const periodButton = target.closest(
      "[data-m100215-period]"
    );

    const detailButton = target.closest(
      "[data-m100215-detail]"
    );

    if (periodButton || detailButton) {
      if (periodButton) {
        period = periodButton.dataset.m100215Period;
      }

      if (detailButton) {
        detail = detailButton.dataset.m100215Detail;
      }

      const panel = $(PANEL);

      if (panel) {
        panel.innerHTML = "";
      }

      paint();
    }

    if (target.closest(
      "[data-m1002-progress-go]"
    )) {
      view = "coach";
      schedule();

      setTimeout(
        () => void fetchLogs(true),
        450
      );
    }
  }

  function init() {
    injectStyles();

    const holder = $(HOLDER);

    if (holder) {
      observer = new MutationObserver(() => {
        clearStaleWorkoutMode();

        if (isStrengthProgress()) {
          schedule();
        }
      });

      observer.observe(holder, {
        childList: true
      });
    }

    document.addEventListener(
      "click",
      onClick,
      true
    );

    window.addEventListener(
      "mana:program-tab-change",
      schedule
    );

    window.addEventListener(
      "mana:coach-workout-saved",
      () => {
        fetched = 0;
        view = "coach";
        schedule();
      }
    );

    window.addEventListener(
      "pageshow",
      schedule
    );

    window.addEventListener(
      "mana:logout",
      () => {
        requestId++;
        rows = [];
        user = "";
        fetched = 0;
        view = "generated";
        error = "";
        schedule();
      }
    );

    window.refreshManaCoachProgressBridge =
      () => fetchLogs(true);

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
