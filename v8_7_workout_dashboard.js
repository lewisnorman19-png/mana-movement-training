/* =========================================
   MANA MOVEMENT TRAINING v8.7
   WORKOUT DASHBOARD
   TIMER + PERCENT COMPLETE
   ========================================= */

(() => {
  "use strict";

  const SCREEN_ID =
    "manaStrengthV64Workout";

  const STYLE_ID =
    "mana-v87-workout-dashboard-style";

  let timerId = null;
  let startedAt = null;

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
      .mana-v87-dashboard{
        display:grid;
        grid-template-columns:
          1fr 1fr;
        gap:10px;
        margin:0 0 14px;
      }

      .mana-v87-card{
        border:1px solid #292929;
        background:#0d0d0d;
        border-radius:16px;
        padding:14px;
      }

      .mana-v87-card span{
        display:block;
        color:#999;
        font-size:11px;
        text-transform:uppercase;
        letter-spacing:.05em;
      }

      .mana-v87-card strong{
        display:block;
        color:#f3d875;
        font-size:22px;
        margin-top:5px;
      }

      .mana-v87-progress-wrap{
        grid-column:1 / -1;
        border:1px solid #292929;
        background:#0d0d0d;
        border-radius:16px;
        padding:14px;
      }

      .mana-v87-progress-top{
        display:flex;
        justify-content:
          space-between;
        gap:12px;
        align-items:center;
        margin-bottom:10px;
      }

      .mana-v87-progress-top span{
        color:#999;
        font-size:11px;
        text-transform:uppercase;
        letter-spacing:.05em;
      }

      .mana-v87-progress-top strong{
        color:#f3d875;
        font-size:20px;
      }

      .mana-v87-bar{
        height:10px;
        border-radius:999px;
        background:#1a1a1a;
        overflow:hidden;
      }

      .mana-v87-fill{
        height:100%;
        width:0%;
        border-radius:999px;
        background:#f3d875;
        transition:width .2s ease;
      }

      @media(max-width:380px){
        .mana-v87-dashboard{
          grid-template-columns:
            1fr 1fr;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function ensureDashboard() {
    const screen =
      document.getElementById(
        SCREEN_ID
      );

    if (!screen) return;

    if (
      document.getElementById(
        "manaV87Dashboard"
      )
    ) return;

    const summary =
      screen.querySelector(
        ".mana-v64-summary"
      );

    if (!summary) return;

    const dashboard =
      document.createElement(
        "div"
      );

    dashboard.id =
      "manaV87Dashboard";

    dashboard.className =
      "mana-v87-dashboard";

    dashboard.innerHTML = `
      <div class="mana-v87-card">
        <span>Workout time</span>
        <strong id="manaV87Timer">
          00:00
        </strong>
      </div>

      <div class="mana-v87-card">
        <span>Sets complete</span>
        <strong id="manaV87SetCount">
          0 / 0
        </strong>
      </div>

      <div class="mana-v87-progress-wrap">
        <div class="mana-v87-progress-top">
          <span>Workout complete</span>
          <strong id="manaV87Percent">
            0%
          </strong>
        </div>

        <div class="mana-v87-bar">
          <div
            class="mana-v87-fill"
            id="manaV87Fill"
          ></div>
        </div>
      </div>
    `;

    summary.insertAdjacentElement(
      "beforebegin",
      dashboard
    );
  }

  function formatTime(seconds) {
    const mins =
      Math.floor(
        seconds / 60
      );

    const secs =
      seconds % 60;

    return (
      String(mins)
        .padStart(2, "0") +
      ":" +
      String(secs)
        .padStart(2, "0")
    );
  }

  function startTimer() {
    if (timerId) {
      clearInterval(
        timerId
      );
    }

    startedAt =
      Date.now();

    updateTimer();

    timerId =
      setInterval(
        updateTimer,
        1000
      );
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(
        timerId
      );

      timerId = null;
    }
  }

  function updateTimer() {
    if (!startedAt) return;

    const elapsed =
      Math.floor(
        (
          Date.now() -
          startedAt
        ) / 1000
      );

    const timer =
      document.getElementById(
        "manaV87Timer"
      );

    if (timer) {
      timer.textContent =
        formatTime(elapsed);
    }
  }

  function updateProgress() {
    const screen =
      document.getElementById(
        SCREEN_ID
      );

    if (
      !screen ||
      !screen.classList
        .contains("open")
    ) return;

    const sets =
      [
        ...screen.querySelectorAll(
          "[data-v64-set]"
        )
      ];

    const total =
      sets.length;

    const complete =
      sets.filter(
        row =>
          row
            .querySelector(
              "[data-v64-check]"
            )
            ?.classList
            .contains("done")
      ).length;

    const percent =
      total
        ? Math.round(
            (
              complete /
              total
            ) * 100
          )
        : 0;

    const count =
      document.getElementById(
        "manaV87SetCount"
      );

    const percentEl =
      document.getElementById(
        "manaV87Percent"
      );

    const fill =
      document.getElementById(
        "manaV87Fill"
      );

    if (count) {
      count.textContent =
        `${complete} / ${total}`;
    }

    if (percentEl) {
      percentEl.textContent =
        `${percent}%`;
    }

    if (fill) {
      fill.style.width =
        `${percent}%`;
    }
  }

  function handleWorkoutOpen() {
    const screen =
      document.getElementById(
        SCREEN_ID
      );

    if (!screen) return;

    let wasOpen =
      screen.classList
        .contains("open");

    const observer =
      new MutationObserver(() => {
        const isOpen =
          screen.classList
            .contains("open");

        if (
          isOpen &&
          !wasOpen
        ) {
          ensureDashboard();

          startTimer();

          setTimeout(
            updateProgress,
            100
          );
        }

        if (
          !isOpen &&
          wasOpen
        ) {
          stopTimer();

          startedAt =
            null;
        }

        wasOpen =
          isOpen;
      });

    observer.observe(
      screen,
      {
        attributes:true,
        attributeFilter:[
          "class"
        ]
      }
    );
  }

  function watchSets() {
    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest(
            "[data-v64-check], " +
            "[data-v64-add], " +
            "[data-v64-remove]"
          )
        ) {
          setTimeout(
            updateProgress,
            40
          );
        }
      }
    );
  }

  function init() {
    injectStyles();
    ensureDashboard();
    handleWorkoutOpen();
    watchSets();
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
