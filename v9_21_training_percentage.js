/* =========================================
   MANA MOVEMENT TRAINING v9.21.0
   TODAY'S FOCUS — TRAINING PERCENTAGE

   - SHOWS WORKOUT % IN TODAY'S FOCUS
   - READS LIVE IN-PROGRESS SETS
   - SHOWS 100% AFTER WORKOUT COMPLETION
   - DOES NOT TOUCH WORKOUT / TIMER LOGIC
   ========================================= */

(() => {
  "use strict";


  const STATE_KEY =
    "mana-strength-v920-in-progress";

  const LOG_KEY =
    "mana-strength-v64-logs";


  let observerTimer =
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


  function loadState() {

    return safeJson(
      localStorage.getItem(
        STATE_KEY
      ) || "null",
      null
    );

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


  function sameLocalDay(
    value
  ) {

    const date =
      new Date(
        value
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return false;
    }


    const now =
      new Date();


    return (
      date.getFullYear() ===
        now.getFullYear() &&

      date.getMonth() ===
        now.getMonth() &&

      date.getDate() ===
        now.getDate()
    );

  }


  /* =========================================
     COMPLETED TODAY
     ========================================= */

  function workoutCompletedToday() {

    return loadLogs()
      .some(
        log =>
          log?.date &&
          sameLocalDay(
            log.date
          )
      );

  }


  /* =========================================
     IN-PROGRESS %
     ========================================= */

  function progressPercent() {

    /*
      Completed workout today always wins.
    */

    if (
      workoutCompletedToday()
    ) {
      return 100;
    }


    const state =
      loadState();


    if (
      !state ||
      !state.completedSets ||
      typeof
        state.completedSets !==
      "object"
    ) {
      return 0;
    }


    let completed =
      0;

    let total =
      0;


    Object
      .values(
        state.completedSets
      )
      .forEach(
        sets => {

          if (
            !Array.isArray(
              sets
            )
          ) {
            return;
          }


          total +=
            sets.length;


          completed +=
            sets.filter(
              Boolean
            ).length;

        }
      );


    if (!total) {
      return 0;
    }


    return Math.max(
      0,
      Math.min(
        100,
        Math.round(
          completed /
          total *
          100
        )
      )
    );

  }


  /* =========================================
     FIND TRAINING ROW
     ========================================= */

  function findTrainingRow() {

    const rows =
      [
        ...document.querySelectorAll(
          ".mana-v866-focus-row"
        )
      ];


    return rows.find(
      row => {

        const title =
          row
            .querySelector(
              ".mana-v866-focus-copy strong"
            )
            ?.textContent
            ?.trim()
            ?.toLowerCase();


        return (
          title ===
          "training done"
        );

      }
    );

  }


  /* =========================================
     UPDATE TODAY'S FOCUS
     ========================================= */

  function updateTrainingPercentage() {

    const row =
      findTrainingRow();


    if (!row) {
      return;
    }


    const percent =
      progressPercent();


    const detail =
      row.querySelector(
        ".mana-v866-focus-copy small"
      );


    if (detail) {

      detail.textContent =
        `${percent}% complete`;

    }


    const check =
      row.querySelector(
        ".mana-v866-check"
      );


    /*
      Only show the completed tick at 100%.
    */

    if (check) {

      check.textContent =
        percent >= 100
          ? "✓"
          : "";

    }


    row.classList.toggle(
      "done",
      percent >= 100
    );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function watchEvents() {

    [
      "mana:workout-progress-change",
      "mana:strength-synced",
      "mana:program-tab-change"
    ].forEach(
      eventName => {

        window.addEventListener(
          eventName,
          () => {

            setTimeout(
              updateTrainingPercentage,
              60
            );


            setTimeout(
              updateTrainingPercentage,
              250
            );

          }
        );

      }
    );

  }


  /* =========================================
     DOM WATCH
     ========================================= */

  function watchDOM() {

    const observer =
      new MutationObserver(
        () => {

          clearTimeout(
            observerTimer
          );


          observerTimer =
            setTimeout(
              updateTrainingPercentage,
              80
            );

        }
      );


    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true
      }
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    watchEvents();

    watchDOM();


    [
      150,
      400,
      800,
      1400
    ].forEach(
      delay => {

        setTimeout(
          updateTrainingPercentage,
          delay
        );

      }
    );

  }


  window.refreshManaTrainingPercentage =
    updateTrainingPercentage;


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
