/* =========================================
   MANA MOVEMENT TRAINING v6.6
   STRENGTH WORKOUT PROGRESS + TIMER
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID = "mana-strength-v66-style";
  const SCREEN_ID = "manaStrengthV64Workout";

  let workoutStartedAt = null;
  let timerInterval = null;

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      .mana-v64-summary{
        grid-template-columns:
          repeat(3, minmax(0,1fr))
          !important;
      }

      .mana-v66-sub{
        display:block;
        margin-top:4px;
        color:#777;
        font-size:10px;
        line-height:1.2;
      }

      @media(max-width:430px){
        .mana-v64-summary{
          grid-template-columns:
            1fr 1fr !important;
        }

        .mana-v64-summary
        .mana-v64-stat:last-child{
          grid-column:1 / -1;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function formatTime(ms) {
    const totalSeconds =
      Math.max(
        0,
        Math.floor(ms / 1000)
      );

    const minutes =
      Math.floor(
        totalSeconds / 60
      );

    const seconds =
      totalSeconds % 60;

    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0")
    );
  }

  function totalSets() {
    return document.querySelectorAll(
      "#manaV64Exercises [data-v64-set]"
    ).length;
  }

  function completedSets() {
    return document.querySelectorAll(
      "#manaV64Exercises " +
      "[data-v64-check].done"
    ).length;
  }

  function calculatePercent() {
    const total =
      totalSets();

    if (!total) return 0;

    return Math.round(
      completedSets() /
      total *
      100
    );
  }

  function rebuildSummary() {
    const summary =
      document.querySelector(
        "#manaStrengthV64Workout " +
        ".mana-v64-summary"
      );

    if (!summary) return;

    if (
      document.getElementById(
        "manaV66Percent"
      )
    ) return;

    summary.innerHTML = `
      <div class="mana-v64-stat">
        <span>Workout complete</span>

        <strong id="manaV66Percent">
          0%
        </strong>

        <small class="mana-v66-sub"
          id="manaV66SetCount"
        >
          0 of 0 sets
        </small>
      </div>

      <div class="mana-v64-stat">
        <span>Elapsed time</span>

        <strong id="manaV66Timer">
          00:00
        </strong>

        <small class="mana-v66-sub">
          Target 45–60 min
        </small>
      </div>

      <div class="mana-v64-stat">
        <span>Total volume</span>

        <strong id="manaV64Volume">
          0 kg
        </strong>

        <small class="mana-v66-sub">
          Completed sets only
        </small>
      </div>
    `;
  }

  function updateProgress() {
    const percentEl =
      document.getElementById(
        "manaV66Percent"
      );

    const countEl =
      document.getElementById(
        "manaV66SetCount"
      );

    if (percentEl) {
      percentEl.textContent =
        `${calculatePercent()}%`;
    }

    if (countEl) {
      countEl.textContent =
        `${completedSets()} of ` +
        `${totalSets()} sets`;
    }
  }

  function updateTimer() {
    const timer =
      document.getElementById(
        "manaV66Timer"
      );

    if (
      !timer ||
      !workoutStartedAt
    ) return;

    timer.textContent =
      formatTime(
        Date.now() -
        workoutStartedAt
      );
  }

  function startTimer() {
    if (!workoutStartedAt) {
      workoutStartedAt =
        Date.now();
    }

    if (timerInterval) {
      clearInterval(
        timerInterval
      );
    }

    updateTimer();

    timerInterval =
      setInterval(
        updateTimer,
        1000
      );
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(
        timerInterval
      );

      timerInterval = null;
    }
  }

  function resetTimer() {
    stopTimer();

    workoutStartedAt = null;

    const timer =
      document.getElementById(
        "manaV66Timer"
      );

    if (timer) {
      timer.textContent =
        "00:00";
    }
  }

  function workoutIsOpen() {
    return document
      .getElementById(
        SCREEN_ID
      )
      ?.classList.contains(
        "open"
      );
  }

  function handleWorkoutState() {
    if (!workoutIsOpen()) {
      stopTimer();
      return;
    }

    rebuildSummary();
    startTimer();
    updateProgress();
  }

  function watchChecks() {
    document.addEventListener(
      "click",
      event => {
        if (
          !event.target.closest(
            "[data-v64-check]"
          )
        ) return;

        setTimeout(
          updateProgress,
          0
        );
      }
    );
  }

  function watchWorkoutScreen() {
    const screen =
      document.getElementById(
        SCREEN_ID
      );

    if (!screen) return;

    const observer =
      new MutationObserver(
        handleWorkoutState
      );

    observer.observe(
      screen,
      {
        attributes:true,
        attributeFilter:["class"]
      }
    );
  }

  function watchSetChanges() {
    const holder =
      document.getElementById(
        "manaV64Exercises"
      );

    if (!holder) return;

    const observer =
      new MutationObserver(
        () => {
          updateProgress();
        }
      );

    observer.observe(
      holder,
      {
        childList:true,
        subtree:true
      }
    );
  }

  function watchCompleteWorkout() {
    document.addEventListener(
      "click",
      event => {
        if (
          !event.target.closest(
            "#manaV64Complete"
          )
        ) return;

        stopTimer();
      }
    );
  }

  function watchClose() {
    document.addEventListener(
      "click",
      event => {
        if (
          !event.target.closest(
            "#manaV64Close"
          )
        ) return;

        resetTimer();
      }
    );
  }

  function init() {
    injectStyles();

    setTimeout(() => {
      rebuildSummary();
      watchWorkoutScreen();
      watchSetChanges();
      watchChecks();
      watchCompleteWorkout();
      watchClose();

      if (
        workoutIsOpen()
      ) {
        startTimer();
        updateProgress();
      }
    }, 300);
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
