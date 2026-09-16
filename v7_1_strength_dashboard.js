/* =========================================
   MANA MOVEMENT TRAINING v7.1
   STRENGTH DASHBOARD
   ========================================= */

(() => {
  "use strict";

  const MODAL_ID = "manaStrengthModal";
  const DASH_ID = "manaStrengthDashboard";
  const STYLE_ID = "mana-v71-strength-dashboard-style";

  const PROGRAM_KEY =
    "mana-strength-v62-program";

  const LOG_KEY =
    "mana-strength-v64-logs";

  function safeJson(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function loadProgram() {
    return safeJson(
      localStorage.getItem(PROGRAM_KEY),
      null
    );
  }

  function loadLogs() {
    return safeJson(
      localStorage.getItem(LOG_KEY) || "[]",
      []
    );
  }

  function injectStyles() {
    if (
      document.getElementById(STYLE_ID)
    ) return;

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `
      #${DASH_ID}{
        margin:0 0 18px;
      }

      .mana-v71-grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
      }

      .mana-v71-card{
        background:#0e0e0e;
        border:1px solid #292929;
        border-radius:18px;
        padding:14px;
      }

      .mana-v71-card.wide{
        grid-column:1 / -1;
      }

      .mana-v71-label{
        color:#888;
        font-size:11px;
        text-transform:uppercase;
        letter-spacing:.05em;
        margin-bottom:5px;
      }

      .mana-v71-value{
        color:#f3d875;
        font-size:19px;
        font-weight:900;
        line-height:1.25;
      }

      .mana-v71-sub{
        color:#999;
        font-size:12px;
        margin-top:5px;
      }

      .mana-v71-start{
        width:100%;
        min-height:56px;
        margin-top:12px;
        border:0;
        border-radius:16px;
        background:#f3d875;
        color:#111;
        font-size:16px;
        font-weight:900;
      }

      .mana-v71-history{
        margin-top:12px;
      }

      .mana-v71-history-row{
        display:flex;
        justify-content:space-between;
        gap:12px;
        padding:10px 0;
        border-top:1px solid #242424;
      }

      .mana-v71-history-row:first-child{
        border-top:0;
      }

      .mana-v71-history-name{
        color:#eee;
        font-weight:800;
      }

      .mana-v71-history-date{
        color:#888;
        font-size:12px;
        white-space:nowrap;
      }

      @media(max-width:380px){
        .mana-v71-grid{
          grid-template-columns:1fr;
        }

        .mana-v71-card.wide{
          grid-column:auto;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function startOfWeek() {
    const now = new Date();
    const day = now.getDay();

    const diff =
      day === 0
        ? 6
        : day - 1;

    const start =
      new Date(now);

    start.setHours(0, 0, 0, 0);
    start.setDate(
      start.getDate() - diff
    );

    return start;
  }

  function logsThisWeek(logs) {
    const start =
      startOfWeek().getTime();

    return logs.filter(log => {
      const time =
        new Date(
          log.date || 0
        ).getTime();

      return time >= start;
    });
  }

  function formatDate(value) {
    if (!value) return "—";

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) return "—";

    return date.toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short"
      }
    );
  }

  function nextWorkoutIndex(
    program,
    weekLogs
  ) {
    const total =
      program?.sessions?.length || 0;

    if (!total) return 0;

    /*
      Move through the week's workouts
      in program order.
    */
    return (
      weekLogs.length %
      total
    );
  }

  function recentHistory(logs) {
    if (!logs.length) {
      return `
        <div class="mana-v71-sub">
          No completed workouts yet.
        </div>
      `;
    }

    return logs
      .slice(-3)
      .reverse()
      .map(log => `
        <div class="mana-v71-history-row">
          <div class="mana-v71-history-name">
            ${log.sessionName || "Workout"}
          </div>

          <div class="mana-v71-history-date">
            ${formatDate(log.date)}
          </div>
        </div>
      `)
      .join("");
  }

  function startWorkout(index) {
    const programHolder =
      document.getElementById(
        "manaStrengthProgram"
      );

    if (!programHolder) return;

    const days =
      programHolder.querySelectorAll(
        ".mana-strength-day"
      );

    const day =
      days[index];

    if (!day) return;

    /*
      Existing logger already wires
      Start workout buttons.
    */
    const button =
      day.querySelector(
        ".mana-v63-start"
      );

    if (button) {
      button.click();
      return;
    }

    day.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  function renderDashboard() {
    const modal =
      document.getElementById(
        MODAL_ID
      );

    const profileSummary =
      document.getElementById(
        "manaStrengthProfileSummary"
      );

    if (
      !modal ||
      !profileSummary ||
      !modal.classList.contains("open")
    ) return;

    const program =
      loadProgram();

    if (
      !program?.sessions?.length
    ) return;

    const logs =
      loadLogs();

    const weekLogs =
      logsThisWeek(logs);

    const nextIndex =
      nextWorkoutIndex(
        program,
        weekLogs
      );

    const nextSession =
      program.sessions[nextIndex];

    const lastLog =
      logs.length
        ? logs[logs.length - 1]
        : null;

    let dashboard =
      document.getElementById(
        DASH_ID
      );

    if (!dashboard) {
      dashboard =
        document.createElement("div");

      dashboard.id =
        DASH_ID;

      profileSummary.insertAdjacentElement(
        "afterend",
        dashboard
      );
    }

    dashboard.innerHTML = `
      <div class="mana-v71-grid">

        <div class="mana-v71-card wide">
          <div class="mana-v71-label">
            Next workout
          </div>

          <div class="mana-v71-value">
            Day ${nextIndex + 1}
            • ${nextSession[0]}
          </div>

          <div class="mana-v71-sub">
            ${program.goal}
            • ${program.days} days/week
          </div>

          <button
            type="button"
            class="mana-v71-start"
            id="manaV71Start"
          >
            Start workout
          </button>
        </div>

        <div class="mana-v71-card">
          <div class="mana-v71-label">
            This week
          </div>

          <div class="mana-v71-value">
            ${weekLogs.length}
            / ${program.sessions.length}
          </div>

          <div class="mana-v71-sub">
            Workouts completed
          </div>
        </div>

        <div class="mana-v71-card">
          <div class="mana-v71-label">
            Last workout
          </div>

          <div class="mana-v71-value">
            ${
              lastLog
                ? formatDate(
                    lastLog.date
                  )
                : "—"
            }
          </div>

          <div class="mana-v71-sub">
            ${
              lastLog
                ? lastLog.sessionName
                : "No workout logged"
            }
          </div>
        </div>

        <div class="mana-v71-card wide">
          <div class="mana-v71-label">
            Recent workouts
          </div>

          <div class="mana-v71-history">
            ${recentHistory(logs)}
          </div>
        </div>

      </div>
    `;

    document
      .getElementById(
        "manaV71Start"
      )
      ?.addEventListener(
        "click",
        () => {
          startWorkout(
            nextIndex
          );
        }
      );
  }

  function handleStrengthOpen() {
    const modal =
      document.getElementById(
        MODAL_ID
      );

    if (!modal) return;

    let wasOpen =
      modal.classList.contains(
        "open"
      );

    const observer =
      new MutationObserver(() => {
        const isOpen =
          modal.classList.contains(
            "open"
          );

        if (
          isOpen &&
          !wasOpen
        ) {
          /*
            v7.0 auto-builds first.
            Give it a moment.
          */
          setTimeout(
            renderDashboard,
            350
          );
        }

        wasOpen = isOpen;
      });

    observer.observe(
      modal,
      {
        attributes: true,
        attributeFilter: ["class"]
      }
    );
  }

  function watchWorkoutComplete() {
    document.addEventListener(
      "click",
      event => {
        if (
          !event.target.closest(
            "#manaV64Complete"
          )
        ) return;

        /*
          v6.4 saves the workout.
          Refresh dashboard afterwards.
        */
        setTimeout(
          renderDashboard,
          1000
        );
      }
    );
  }

  function init() {
    injectStyles();
    handleStrengthOpen();
    watchWorkoutComplete();

    setTimeout(
      renderDashboard,
      1200
    );
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
