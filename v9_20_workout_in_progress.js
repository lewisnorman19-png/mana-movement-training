/* =========================================
   MANA MOVEMENT TRAINING v9.20.2
   WORKOUT RESUME STATE — HARD RESTORE

   - PERSIST YELLOW SET TICKS
   - PERSIST WORKOUT TIMER
   - TIMER PAUSES ON X
   - TIMER CONTINUES ON RESUME
   - RESTORES AFTER V6.4 REBUILDS UI
   - TICK ALL SETS
   - TICK ALL WORKOUT
   - IN PROGRESS UNTIL COMPLETE
   - DOES NOT TOUCH LOGIN / PHONE ROUTING
   ========================================= */

(() => {
  "use strict";


  const STATE_KEY =
    "mana-strength-v920-in-progress";

  const LOG_KEY =
    "mana-strength-v64-logs";


  let wrapping =
    false;

  let completing =
    false;

  let observerTimer =
    null;

  let timerLoop =
    null;


  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(raw, fallback) {
    try {
      return JSON.parse(raw);
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


  function saveState(state) {
    try {
      localStorage.setItem(
        STATE_KEY,
        JSON.stringify(state)
      );
    } catch (_) {}
  }


  function clearState() {
    try {
      localStorage.removeItem(
        STATE_KEY
      );
    } catch (_) {}

    stopTimerLoop();

    window.dispatchEvent(
      new CustomEvent(
        "mana:workout-progress-change"
      )
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

    return Array.isArray(logs)
      ? logs
      : [];
  }


  function saveLogs(logs) {
    try {
      localStorage.setItem(
        LOG_KEY,
        JSON.stringify(logs)
      );
    } catch (_) {}
  }


  function workoutOpen() {
    return Boolean(
      document
        .getElementById(
          "manaStrengthV64Workout"
        )
        ?.classList
        .contains("open")
    );
  }


  /* =========================================
     TIMER
     ========================================= */

  function formatTime(seconds) {
    const total =
      Math.max(
        0,
        Math.floor(
          Number(seconds || 0)
        )
      );

    const mins =
      Math.floor(total / 60);

    const secs =
      total % 60;

    return (
      String(mins).padStart(2, "0") +
      ":" +
      String(secs).padStart(2, "0")
    );
  }


  function elapsedMs(state = loadState()) {
    if (!state) return 0;

    let elapsed =
      Number(
        state.elapsedMs || 0
      );

    if (
      state.running &&
      state.segmentStartedAt
    ) {
      elapsed +=
        Math.max(
          0,
          Date.now() -
          Number(
            state.segmentStartedAt
          )
        );
    }

    return elapsed;
  }


  function forceTimerDisplay() {
    if (!workoutOpen()) return;

    const state =
      loadState();

    if (!state) return;

    const timer =
      document.getElementById(
        "manaV64Timer"
      );

    if (!timer) return;

    const value =
      formatTime(
        elapsedMs(state) / 1000
      );

    if (
      timer.textContent !== value
    ) {
      timer.textContent =
        value;
    }
  }


  function startTimerLoop() {
    stopTimerLoop();

    forceTimerDisplay();

    /*
      v6.4 updates its own timer once a second.

      Our faster loop keeps the persisted
      resumed time as the visible value.
    */

    timerLoop =
      setInterval(
        forceTimerDisplay,
        150
      );
  }


  function stopTimerLoop() {
    if (timerLoop) {
      clearInterval(
        timerLoop
      );

      timerLoop =
        null;
    }
  }


  function pauseTimer() {
    const state =
      loadState();

    if (!state) return;

    state.elapsedMs =
      elapsedMs(state);

    state.running =
      false;

    state.segmentStartedAt =
      null;

    state.updatedAt =
      Date.now();

    saveState(state);

    stopTimerLoop();
  }


  function resumeTimer() {
    const state =
      loadState();

    if (!state) return;

    if (!state.running) {
      state.running =
        true;

      state.segmentStartedAt =
        Date.now();

      state.updatedAt =
        Date.now();

      saveState(state);
    }

    startTimerLoop();
  }


  /* =========================================
     SET STATE
     ========================================= */

  function collectCompletedSets() {
    const data = {};

    document
      .querySelectorAll(
        "#manaV64Exercises .mana-v64-card"
      )
      .forEach(card => {

        const name =
          card.dataset
            .exerciseName ||
          "";

        if (!name) return;

        data[name] =
          [
            ...card.querySelectorAll(
              "[data-v64-check]"
            )
          ].map(
            check =>
              check.classList.contains(
                "done"
              )
          );

      });

    return data;
  }


  function saveTicks() {
    const state =
      loadState();

    if (
      !state ||
      !workoutOpen()
    ) {
      return;
    }

    state.completedSets =
      collectCompletedSets();

    state.updatedAt =
      Date.now();

    saveState(state);
  }


  function updateNativeSummary() {
    const input =
      document.querySelector(
        "#manaV64Exercises input"
      );

    if (input) {
      input.dispatchEvent(
        new Event(
          "input",
          {
            bubbles:true
          }
        )
      );
    }
  }


  function restoreTicks() {
    const state =
      loadState();

    if (
      !state ||
      !state.completedSets ||
      typeof state.completedSets !==
        "object"
    ) {
      return;
    }


    document
      .querySelectorAll(
        "#manaV64Exercises .mana-v64-card"
      )
      .forEach(card => {

        const name =
          card.dataset
            .exerciseName ||
          "";

        const saved =
          state.completedSets[
            name
          ];

        if (
          !Array.isArray(saved)
        ) {
          return;
        }


        const checks =
          [
            ...card.querySelectorAll(
              "[data-v64-check]"
            )
          ];


        checks.forEach(
          (
            check,
            index
          ) => {

            check
              .classList
              .toggle(
                "done",
                Boolean(
                  saved[index]
                )
              );

          }
        );

      });


    updateNativeSummary();
  }


  /* =========================================
     IN PROGRESS STATE
     ========================================= */

  function markInProgress(dayIndex) {
    const index =
      Number(dayIndex);

    if (
      !Number.isInteger(index) ||
      index < 0
    ) {
      return;
    }


    const previous =
      loadState();


    /*
      Existing unfinished workout.
    */

    if (
      previous &&
      Number(
        previous.dayIndex
      ) === index
    ) {

      if (
        typeof previous.elapsedMs !==
        "number"
      ) {
        previous.elapsedMs =
          0;
      }


      if (
        !previous.completedSets ||
        typeof previous.completedSets !==
          "object" ||
        Array.isArray(
          previous.completedSets
        )
      ) {
        previous.completedSets =
          {};
      }


      previous.running =
        true;

      previous.segmentStartedAt =
        Date.now();

      previous.updatedAt =
        Date.now();


      saveState(previous);


      window.dispatchEvent(
        new CustomEvent(
          "mana:workout-progress-change"
        )
      );


      return;
    }


    /*
      New workout.
    */

    saveState({

      dayIndex:
        index,

      elapsedMs:
        0,

      running:
        true,

      segmentStartedAt:
        Date.now(),

      completedSets:
        {},

      startedAt:
        Date.now(),

      updatedAt:
        Date.now(),

      logCountAtStart:
        loadLogs().length

    });


    window.dispatchEvent(
      new CustomEvent(
        "mana:workout-progress-change"
      )
    );
  }


  /* =========================================
     WRAP WORKOUT OPEN
     ========================================= */

  function wrapWorkoutOpen() {
    if (wrapping) return;

    const original =
      window
        .openManaStrengthWorkout;

    if (
      typeof original !==
      "function"
    ) {
      return;
    }


    if (
      original
        .__manaV920HardWrapped
    ) {
      return;
    }


    wrapping =
      true;


    const wrapped =
      function(dayIndex) {

        markInProgress(
          dayIndex
        );


        const result =
          original.apply(
            this,
            arguments
          );


        /*
          v6.4 rebuilds the exercise DOM.

          Restore repeatedly after that
          rebuild so our state wins.
        */

        [
          30,
          100,
          220,
          450,
          800,
          1200
        ].forEach(
          delay => {

            setTimeout(
              () => {

                enhanceWorkout();

                restoreTicks();

                forceTimerDisplay();

              },
              delay
            );

          }
        );


        setTimeout(
          resumeTimer,
          60
        );


        return result;
      };


    wrapped
      .__manaV920HardWrapped =
        true;


    window
      .openManaStrengthWorkout =
        wrapped;


    wrapping =
      false;
  }


  /* =========================================
     STYLE
     ========================================= */

  function injectStyles() {
    if (
      document.getElementById(
        "mana-v920-progress-style"
      )
    ) {
      return;
    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "mana-v920-progress-style";


    style.textContent = `

      .mana-v920-progress-badge{
        display:inline-flex;
        align-items:center;
        gap:6px;
        margin-top:8px;
        padding:6px 9px;
        border:1px solid #6d5b1f;
        border-radius:999px;
        background:#181509;
        color:#f3d875;
        font-size:10px;
        font-weight:900;
        letter-spacing:.08em;
        text-transform:uppercase;
      }

      .mana-v920-progress-badge::before{
        content:"●";
        font-size:8px;
      }

      .mana-v920-tick-all{
        width:100%;
        min-height:44px;
        margin-top:10px;
        border:1px solid #4c421e;
        border-radius:13px;
        background:#121008;
        color:#f3d875;
        font-size:12px;
        font-weight:900;
        cursor:pointer;
      }

      .mana-v920-workout-all{
        width:100%;
        min-height:52px;
        margin:18px 0 8px;
        border:1px solid #6b5920;
        border-radius:16px;
        background:
          linear-gradient(
            145deg,
            #1b1708,
            #0d0d0d
          );
        color:#f3d875;
        font-size:13px;
        font-weight:900;
        cursor:pointer;
      }

      .mana-v920-resume-note{
        margin-top:9px;
        color:#f3d875;
        font-size:11px;
        font-weight:800;
        line-height:1.4;
      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     TICK ALL — EXERCISE
     ========================================= */

  function addExerciseTickAll() {
    document
      .querySelectorAll(
        "#manaV64Exercises .mana-v64-card"
      )
      .forEach(card => {

        if (
          card.querySelector(
            ".mana-v920-tick-all"
          )
        ) {
          return;
        }


        const controls =
          card.querySelector(
            ".mana-v64-controls"
          );

        if (!controls) return;


        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";

        button.className =
          "mana-v920-tick-all";

        button.textContent =
          "✓ TICK ALL SETS";


        button.addEventListener(
          "click",
          () => {

            card
              .querySelectorAll(
                "[data-v64-check]"
              )
              .forEach(check => {

                check
                  .classList
                  .add(
                    "done"
                  );

              });


            updateNativeSummary();


            [
              20,
              80,
              180
            ].forEach(
              delay =>
                setTimeout(
                  saveTicks,
                  delay
                )
            );

          }
        );


        controls
          .insertAdjacentElement(
            "beforebegin",
            button
          );

      });
  }


  /* =========================================
     TICK ALL — WORKOUT
     ========================================= */

  function addWorkoutTickAll() {
    if (
      document.getElementById(
        "manaV920TickWorkout"
      )
    ) {
      return;
    }


    const complete =
      document.getElementById(
        "manaV64Complete"
      );

    if (!complete) return;


    const button =
      document.createElement(
        "button"
      );


    button.type =
      "button";

    button.id =
      "manaV920TickWorkout";

    button.className =
      "mana-v920-workout-all";

    button.textContent =
      "✓ TICK ALL WORKOUT SETS";


    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            "#manaV64Exercises [data-v64-check]"
          )
          .forEach(check => {

            check
              .classList
              .add(
                "done"
              );

          });


        updateNativeSummary();


        [
          20,
          80,
          180
        ].forEach(
          delay =>
            setTimeout(
              saveTicks,
              delay
            )
        );

      }
    );


    complete
      .insertAdjacentElement(
        "beforebegin",
        button
      );
  }


  /* =========================================
     BADGE
     ========================================= */

  function addWorkoutBadge() {
    const head =
      document.querySelector(
        "#manaStrengthV64Workout .mana-v64-head > div"
      );


    if (
      !head ||
      head.querySelector(
        ".mana-v920-progress-badge"
      )
    ) {
      return;
    }


    const badge =
      document.createElement(
        "div"
      );


    badge.className =
      "mana-v920-progress-badge";

    badge.textContent =
      "IN PROGRESS";


    head.appendChild(
      badge
    );
  }


  function enhanceWorkout() {
    if (!workoutOpen()) return;

    addExerciseTickAll();

    addWorkoutTickAll();

    addWorkoutBadge();
  }


  /* =========================================
     OVERVIEW
     ========================================= */

  function updateOverview() {
    const state =
      loadState();


    const card =
      document.querySelector(
        ".mana-v9103-workout"
      );

    if (!card) return;


    card
      .querySelector(
        ".mana-v920-progress-badge"
      )
      ?.remove();


    card
      .querySelector(
        ".mana-v920-resume-note"
      )
      ?.remove();


    const button =
      card.querySelector(
        "#manaV9103Start"
      );


    if (!state) {
      if (button) {
        button.textContent =
          "START WORKOUT →";
      }

      return;
    }


    const title =
      card.querySelector(
        "h3"
      );


    const badge =
      document.createElement(
        "div"
      );


    badge.className =
      "mana-v920-progress-badge";

    badge.textContent =
      "IN PROGRESS";


    title
      ?.insertAdjacentElement(
        "afterend",
        badge
      );


    const note =
      document.createElement(
        "div"
      );


    note.className =
      "mana-v920-resume-note";


    note.textContent =
      `Paused at ${formatTime(
        elapsedMs(state) / 1000
      )} • Resume when ready`;


    badge
      .insertAdjacentElement(
        "afterend",
        note
      );


    if (button) {
      button.textContent =
        "RESUME WORKOUT →";
    }
  }


  /* =========================================
     HOME CURRENT WORKOUT
     ========================================= */

  function updateCurrentWorkout() {
    const state =
      loadState();


    const card =
      document.getElementById(
        "manaV82Current"
      );

    if (!card) return;


    card
      .querySelector(
        ".mana-v920-progress-badge"
      )
      ?.remove();


    card
      .querySelector(
        ".mana-v920-resume-note"
      )
      ?.remove();


    const openText =
      card.querySelector(
        ".mana-v82-current-open"
      );


    if (!state) {
      if (openText) {
        openText.textContent =
          "Start workout →";
      }

      return;
    }


    const title =
      card.querySelector(
        ".mana-v82-current-title"
      );


    const badge =
      document.createElement(
        "div"
      );


    badge.className =
      "mana-v920-progress-badge";

    badge.textContent =
      "IN PROGRESS";


    title
      ?.insertAdjacentElement(
        "afterend",
        badge
      );


    const note =
      document.createElement(
        "div"
      );


    note.className =
      "mana-v920-resume-note";


    note.textContent =
      `Paused at ${formatTime(
        elapsedMs(state) / 1000
      )}`;


    badge
      .insertAdjacentElement(
        "afterend",
        note
      );


    if (openText) {
      openText.textContent =
        "Resume workout →";
    }
  }


  /* =========================================
     SET CLICK SAVE
     ========================================= */

  function watchSetTicks() {
    document.addEventListener(
      "click",
      event => {

        if (
          !event.target.closest(
            "#manaV64Exercises [data-v64-check]"
          )
        ) {
          return;
        }


        /*
          Let v6.4 toggle the button first,
          then save the finished state.
        */

        [
          20,
          80,
          180
        ].forEach(
          delay =>
            setTimeout(
              saveTicks,
              delay
            )
        );

      },
      true
    );
  }


  /* =========================================
     CLOSE = PAUSE
     ========================================= */

  function watchClose() {
    document.addEventListener(
      "click",
      event => {

        if (
          !event.target.closest(
            "#manaV64Close"
          )
        ) {
          return;
        }


        /*
          Capture state before v6.4 destroys
          the active workout context.
        */

        saveTicks();

        pauseTimer();


        setTimeout(
          refreshEverything,
          120
        );


        setTimeout(
          refreshEverything,
          450
        );

      },
      true
    );
  }


  /* =========================================
     COMPLETE
     ========================================= */

  function watchComplete() {
    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV64Complete"
          )
        ) {

          saveTicks();

          completing =
            true;


          setTimeout(
            () => {
              completing =
                false;
            },
            2200
          );

        }

      },
      true
    );


    window.addEventListener(
      "mana:strength-synced",
      () => {

        if (!completing) {
          return;
        }


        completing =
          false;


        const state =
          loadState();


        const totalSeconds =
          Math.max(
            0,
            Math.round(
              elapsedMs(state) /
              1000
            )
          );


        const logs =
          loadLogs();


        const last =
          logs[
            logs.length - 1
          ];


        if (
          last &&
          state &&
          Number(last.dayIndex) ===
            Number(state.dayIndex)
        ) {

          last.durationSeconds =
            totalSeconds;

          last.durationMinutes =
            Math.round(
              totalSeconds / 60
            );


          saveLogs(logs);
        }


        clearState();


        setTimeout(
          refreshEverything,
          100
        );


        setTimeout(
          refreshEverything,
          500
        );

      }
    );
  }


  /* =========================================
     REFRESH
     ========================================= */

  function refreshEverything() {
    enhanceWorkout();

    updateOverview();

    updateCurrentWorkout();

    if (workoutOpen()) {
      restoreTicks();

      forceTimerDisplay();
    }
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
              () => {

                wrapWorkoutOpen();

                refreshEverything();

              },
              70
            );

        }
      );


    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true,
        attributes:true,
        attributeFilter:[
          "class"
        ]
      }
    );
  }


  /* =========================================
     EVENTS
     ========================================= */

  function watchEvents() {
    [
      "mana:program-tab-change",
      "mana:workout-progress-change",
      "mana:profile-synced"
    ].forEach(
      name => {

        window.addEventListener(
          name,
          () => {

            setTimeout(
              refreshEverything,
              80
            );

            setTimeout(
              refreshEverything,
              350
            );

          }
        );

      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {
    injectStyles();

    wrapWorkoutOpen();

    watchSetTicks();

    watchClose();

    watchComplete();

    watchDOM();

    watchEvents();


    [
      100,
      300,
      700,
      1200,
      2200
    ].forEach(
      delay =>
        setTimeout(
          () => {

            wrapWorkoutOpen();

            refreshEverything();

          },
          delay
        )
    );
  }


  window.refreshManaWorkoutProgress =
    refreshEverything;


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
