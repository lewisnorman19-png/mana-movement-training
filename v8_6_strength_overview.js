/* =========================================
   MANA MOVEMENT TRAINING v8.6
   STRENGTH OVERVIEW
   ========================================= */

(() => {
  "use strict";

  const PROGRAM_KEY =
    "mana-strength-v62-program";

  const LOG_KEY =
    "mana-strength-v64-logs";

  const STYLE_ID =
    "mana-v86-strength-overview-style";

  function safeJson(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function loadProgram() {
    return safeJson(
      localStorage.getItem(
        PROGRAM_KEY
      ),
      null
    );
  }

  function loadLogs() {
    return safeJson(
      localStorage.getItem(
        LOG_KEY
      ) || "[]",
      []
    );
  }

  function injectStyles() {
    if (
      document.getElementById(
        STYLE_ID
      )
    ) return;

    const style =
      document.createElement(
        "style"
      );

    style.id =
      STYLE_ID;

    style.textContent = `
      .mana-v86-next{
        border:1px solid #2d2d2d;
        border-radius:22px;
        background:
          linear-gradient(
            145deg,
            #121212,
            #090909
          );
        padding:18px;
        margin-bottom:12px;
      }

      .mana-v86-label{
        color:#888;
        font-size:11px;
        font-weight:800;
        text-transform:uppercase;
        letter-spacing:.08em;
      }

      .mana-v86-next h2{
        margin:
          7px
          0
          6px;
        font-size:25px;
      }

      .mana-v86-sub{
        color:#999;
        font-size:13px;
        line-height:1.5;
      }

      .mana-v86-start{
        width:100%;
        min-height:54px;
        margin-top:16px;
        border:0;
        border-radius:16px;
        background:#f3d875;
        color:#111;
        font-size:15px;
        font-weight:900;
      }

      .mana-v86-grid{
        display:grid;
        grid-template-columns:
          1fr 1fr;
        gap:10px;
      }

      .mana-v86-stat{
        border:1px solid #292929;
        border-radius:18px;
        background:#0d0d0d;
        padding:15px;
      }

      .mana-v86-stat strong{
        display:block;
        color:#f3d875;
        font-size:24px;
        margin-top:5px;
      }

      .mana-v86-history{
        margin-top:12px;
        border:1px solid #292929;
        border-radius:18px;
        background:#0d0d0d;
        padding:15px;
      }

      .mana-v86-row{
        display:flex;
        justify-content:
          space-between;
        gap:14px;
        align-items:center;
        padding:11px 0;
        border-top:
          1px solid #242424;
      }

      .mana-v86-row:first-of-type{
        border-top:0;
      }

      .mana-v86-row strong{
        color:#eee;
      }

      .mana-v86-row span{
        color:#888;
        font-size:12px;
        white-space:nowrap;
      }

      @media(max-width:390px){
        .mana-v86-grid{
          grid-template-columns:1fr;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function strengthOverviewOpen() {
    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );

    const title =
      document.getElementById(
        "manaV83Title"
      );

    const active =
      document.querySelector(
        "#manaV83Tabs " +
        ".mana-v83-tab.active"
      );

    return !!(
      shell
        ?.classList
        .contains("open") &&
      title
        ?.textContent
        .trim()
        .toUpperCase() ===
        "MANA STRENGTH" &&
      active
        ?.dataset
        ?.v83Tab ===
        "overview"
    );
  }

  function startOfWeek() {
    const now =
      new Date();

    const day =
      now.getDay();

    const diff =
      day === 0
        ? 6
        : day - 1;

    const start =
      new Date(now);

    start.setHours(
      0,
      0,
      0,
      0
    );

    start.setDate(
      start.getDate() -
      diff
    );

    return start;
  }

  function weekLogs(logs) {
    const start =
      startOfWeek().getTime();

    return logs.filter(
      log =>
        new Date(
          log.date || 0
        ).getTime() >= start
    );
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
        day:"numeric",
        month:"short"
      }
    );
  }

  function nextWorkoutIndex(
    program,
    completed
  ) {
    const total =
      program?.sessions
        ?.length || 0;

    if (!total) return 0;

    return (
      completed.length %
      total
    );
  }

  function startWorkout(
    dayIndex
  ) {
    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );

    shell
      ?.classList
      .remove("open");

    document.body.style.overflow =
      "";

    const client =
      document.getElementById(
        "clientView"
      );

    if (!client) return;

    const target =
      [
        ...client
          .querySelectorAll(
            "button, .day, .card"
          )
      ].find(
        el =>
          (el.textContent || "")
            .toUpperCase()
            .includes(
              "MANA STRENGTH"
            )
      );

    if (!target) return;

    target.click();

    setTimeout(
      () => {
        const holder =
          document.getElementById(
            "manaStrengthProgram"
          );

        const days =
          holder
            ?.querySelectorAll(
              ".mana-strength-day"
            );

        const day =
          days?.[dayIndex];

        const start =
          day?.querySelector(
            ".mana-v63-start"
          );

        start?.click();
      },
      450
    );
  }

  function renderOverview() {
    if (
      !strengthOverviewOpen()
    ) return;

    const holder =
      document.getElementById(
        "manaV83Content"
      );

    const program =
      loadProgram();

    const logs =
      loadLogs();

    if (
      !holder ||
      !program?.sessions
        ?.length
    ) return;

    const completed =
      weekLogs(logs);

    const nextIndex =
      nextWorkoutIndex(
        program,
        completed
      );

    const next =
      program
        .sessions[
          nextIndex
        ];

    const last =
      logs.length
        ? logs[
            logs.length - 1
          ]
        : null;

    const recent =
      logs.length
        ? logs
            .slice(-3)
            .reverse()
            .map(
              log => `
                <div
                  class="mana-v86-row"
                >
                  <strong>
                    ${
                      log.sessionName ||
                      "Workout"
                    }
                  </strong>

                  <span>
                    ${
                      formatDate(
                        log.date
                      )
                    }
                  </span>
                </div>
              `
            )
            .join("")
        : `
          <div class="mana-v86-sub">
            No workouts completed yet.
          </div>
        `;

    holder.innerHTML = `
      <div class="mana-v86-next">

        <div class="mana-v86-label">
          Next workout
        </div>

        <h2>
          Day ${nextIndex + 1}
          •
          ${next?.[0] || "Workout"}
        </h2>

        <div class="mana-v86-sub">
          ${program.goal}
          •
          ${program.days}
          days per week
        </div>

        <button
          type="button"
          class="mana-v86-start"
          id="manaV86Start"
        >
          Start next workout →
        </button>
      </div>

      <div class="mana-v86-grid">

        <div class="mana-v86-stat">
          <div class="mana-v86-label">
            This week
          </div>

          <strong>
            ${completed.length}
            /
            ${program.sessions.length}
          </strong>

          <div class="mana-v86-sub">
            Workouts completed
          </div>
        </div>

        <div class="mana-v86-stat">
          <div class="mana-v86-label">
            Last workout
          </div>

          <strong>
            ${
              last
                ? formatDate(
                    last.date
                  )
                : "—"
            }
          </strong>

          <div class="mana-v86-sub">
            ${
              last?.sessionName ||
              "No workout logged"
            }
          </div>
        </div>

      </div>

      <div class="mana-v86-history">

        <div class="mana-v86-label">
          Recent training
        </div>

        ${recent}

      </div>
    `;

    document
      .getElementById(
        "manaV86Start"
      )
      ?.addEventListener(
        "click",
        () =>
          startWorkout(
            nextIndex
          )
      );
  }

  function watch() {
    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest(
            "#manaV83Tabs " +
            "[data-v83-tab='overview']"
          )
        ) {
          setTimeout(
            renderOverview,
            100
          );
        }

        if (
          event.target.closest(
            "#manaV80Strength"
          )
        ) {
          setTimeout(
            renderOverview,
            250
          );
        }
      }
    );

    const holder =
      document.getElementById(
        "manaV83Content"
      );

    if (holder) {
      const observer =
        new MutationObserver(() => {
          if (
            !strengthOverviewOpen()
          ) return;

          if (
            holder.querySelector(
              ".mana-v86-next"
            )
          ) return;

          setTimeout(
            renderOverview,
            30
          );
        });

      observer.observe(
        holder,
        {
          childList:true,
          subtree:true
        }
      );
    }
  }

  function init() {
    injectStyles();
    watch();

    setTimeout(
      renderOverview,
      1200
    );
  }

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
