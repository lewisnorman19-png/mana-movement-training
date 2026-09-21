/* =========================================
   MANA MOVEMENT TRAINING v9.20.4
   WORKOUT IN PROGRESS + NATIVE PAUSE

   - ONE VISIBLE WORKOUT TIMER
   - NO TIMER FLICKER
   - PAUSE WORKOUT BUTTON
   - X ALSO SAFELY PAUSES
   - TIMER CONTINUES FROM PAUSED TIME
   - PERSIST YELLOW SET TICKS
   - TICK ALL SETS
   - TICK ALL WORKOUT
   - PROGRAM TAB TRACKS ACTUAL WORKOUT
   - OVERVIEW ONLY SHOWS IN PROGRESS
     IF ITS WORKOUT MATCHES SAVED DAY
   ========================================= */

(() => {
  "use strict";


  const STATE_KEY =
    "mana-strength-v920-in-progress";

  const LOG_KEY =
    "mana-strength-v64-logs";

  const PROGRAM_KEY =
    "mana-strength-v62-program";

  const TIMER_ID =
    "manaV920Timer";

  const NATIVE_TIMER_ID =
    "manaV64NativeTimer";

  const PAUSE_ID =
    "manaV920Pause";


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


  function saveState(
    state
  ) {

    try {

      localStorage.setItem(
        STATE_KEY,
        JSON.stringify(
          state
        )
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


    return Array.isArray(
      logs
    )
      ? logs
      : [];

  }


  function saveLogs(
    logs
  ) {

    try {

      localStorage.setItem(
        LOG_KEY,
        JSON.stringify(
          logs
        )
      );

    } catch (_) {}

  }


  function loadProgram() {

    return safeJson(
      localStorage.getItem(
        PROGRAM_KEY
      ) || "null",
      null
    );

  }


  function overviewWorkoutIndex() {

    const program =
      loadProgram();


    const logs =
      loadLogs();


    const total =
      program
        ?.sessions
        ?.length || 0;


    if (!total) {
      return null;
    }


    return (
      logs.length %
      total
    );

  }


  function workoutOpen() {

    return Boolean(
      document
        .getElementById(
          "manaStrengthV64Workout"
        )
        ?.classList
        .contains(
          "open"
        )
    );

  }


  /* =========================================
     TIMER
     ========================================= */

  function formatTime(
    seconds
  ) {

    const total =
      Math.max(
        0,
        Math.floor(
          Number(
            seconds || 0
          )
        )
      );


    const mins =
      Math.floor(
        total / 60
      );


    const secs =
      total % 60;


    return (
      String(
        mins
      ).padStart(
        2,
        "0"
      ) +
      ":" +
      String(
        secs
      ).padStart(
        2,
        "0"
      )
    );

  }


  function elapsedMs(
    state = loadState()
  ) {

    if (!state) {
      return 0;
    }


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


  /* =========================================
     TAKE CONTROL OF VISIBLE TIMER
     ========================================= */

  function takeTimerControl() {

    let native =
      document.getElementById(
        "manaV64Timer"
      );


    if (native) {

      native.id =
        NATIVE_TIMER_ID;

      native.style.display =
        "none";

    }


    if (
      document.getElementById(
        TIMER_ID
      )
    ) {
      return;
    }


    const hidden =
      document.getElementById(
        NATIVE_TIMER_ID
      );


    if (!hidden) {
      return;
    }


    const visible =
      document.createElement(
        "strong"
      );


    visible.id =
      TIMER_ID;

    visible.textContent =
      "00:00";


    hidden
      .insertAdjacentElement(
        "afterend",
        visible
      );

  }


  function updateTimerDisplay() {

    if (
      !workoutOpen()
    ) {
      return;
    }


    takeTimerControl();


    const state =
      loadState();


    if (!state) {
      return;
    }


    const timer =
      document.getElementById(
        TIMER_ID
      );


    if (!timer) {
      return;
    }


    timer.textContent =
      formatTime(
        elapsedMs(
          state
        ) / 1000
      );

  }


  function startTimerLoop() {

    stopTimerLoop();

    updateTimerDisplay();


    timerLoop =
      setInterval(
        updateTimerDisplay,
        500
      );

  }


  function stopTimerLoop() {

    if (
      timerLoop
    ) {

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


    if (!state) {
      return;
    }


    state.elapsedMs =
      elapsedMs(
        state
      );


    state.running =
      false;

    state.segmentStartedAt =
      null;

    state.updatedAt =
      Date.now();


    saveState(
      state
    );


    stopTimerLoop();


    updateOverview();

    updateCurrentWorkout();

  }


  function resumeTimer() {

    const state =
      loadState();


    if (!state) {
      return;
    }


    if (
      !state.running
    ) {

      state.running =
        true;

      state.segmentStartedAt =
        Date.now();

      state.updatedAt =
        Date.now();


      saveState(
        state
      );

    }


    startTimerLoop();

  }


  /* =========================================
     COMPLETED SET STATE
     ========================================= */

  function collectCompletedSets() {

    const data = {};


    document
      .querySelectorAll(
        "#manaV64Exercises .mana-v64-card"
      )
      .forEach(
        card => {

          const name =
            card.dataset
              .exerciseName ||
            "";


          if (!name) {
            return;
          }


          data[name] =
            [
              ...card.querySelectorAll(
                "[data-v64-check]"
              )
            ]
              .map(
                check =>
                  check
                    .classList
                    .contains(
                      "done"
                    )
              );

        }
      );


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


    saveState(
      state
    );

  }


  function updateNativeSummary() {

    const input =
      document.querySelector(
        "#manaV64Exercises input"
      );


    if (!input) {
      return;
    }


    input.dispatchEvent(
      new Event(
        "input",
        {
          bubbles:true
        }
      )
    );

  }


  function restoreTicks() {

    const state =
      loadState();


    if (
      !state ||
      !state.completedSets ||
      typeof
        state.completedSets !==
      "object"
    ) {
      return;
    }


    document
      .querySelectorAll(
        "#manaV64Exercises .mana-v64-card"
      )
      .forEach(
        card => {

          const name =
            card.dataset
              .exerciseName ||
            "";


          const saved =
            state.completedSets[
              name
            ];


          if (
            !Array.isArray(
              saved
            )
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

        }
      );


    updateNativeSummary();

  }


  /* =========================================
     IN PROGRESS STATE
     ========================================= */

  function markInProgress(
    dayIndex
  ) {

    const index =
      Number(
        dayIndex
      );


    if (
      !Number.isInteger(
        index
      ) ||
      index < 0
    ) {
      return;
    }


    const previous =
      loadState();


    if (
      previous &&
      Number(
        previous.dayIndex
      ) === index
    ) {

      if (
        typeof
          previous.elapsedMs !==
        "number"
      ) {

        previous.elapsedMs =
          0;

      }


      if (
        !previous.completedSets ||
        typeof
          previous.completedSets !==
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


      saveState(
        previous
      );


      window.dispatchEvent(
        new CustomEvent(
          "mana:workout-progress-change"
        )
      );


      return;
    }


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

    if (
      wrapping
    ) {
      return;
    }


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
        .__manaV920PauseWrapped
    ) {
      return;
    }


    wrapping =
      true;


    const wrapped =
      function(
        dayIndex
      ) {

        markInProgress(
          dayIndex
        );


        const result =
          original.apply(
            this,
            arguments
          );


        [
          30,
          100,
          220,
          450,
          800
        ].forEach(
          delay => {

            setTimeout(
              () => {

                takeTimerControl();

                enhanceWorkout();

                restoreTicks();

                updateTimerDisplay();

              },
              delay
            );

          }
        );


        setTimeout(
          resumeTimer,
          80
        );


        return result;

      };


    wrapped
      .__manaV920PauseWrapped =
        true;


    window
      .openManaStrengthWorkout =
        wrapped;


    wrapping =
      false;

  }


  /* =========================================
     STYLES
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
      }


      .mana-v920-workout-all{
        width:100%;
        min-height:50px;
        margin-top:18px;
        border:1px solid #6b5920;
        border-radius:15px;
        background:#151208;
        color:#f3d875;
        font-size:13px;
        font-weight:900;
      }


      .mana-v920-pause{
        width:100%;
        min-height:52px;
        margin-top:10px;
        border:1px solid #444;
        border-radius:15px;
        background:#111;
        color:#fff;
        font-size:13px;
        font-weight:900;
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
      .forEach(
        card => {

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


          if (!controls) {
            return;
          }


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
                .forEach(
                  check => {

                    check
                      .classList
                      .add(
                        "done"
                      );

                  }
                );


              updateNativeSummary();


              setTimeout(
                saveTicks,
                50
              );

            }
          );


          controls
            .insertAdjacentElement(
              "beforebegin",
              button
            );

        }
      );

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


    if (!complete) {
      return;
    }


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
          .forEach(
            check => {

              check
                .classList
                .add(
                  "done"
                );

            }
          );


        updateNativeSummary();


        setTimeout(
          saveTicks,
          50
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
     PAUSE BUTTON
     ========================================= */

  function addPauseButton() {

    if (
      document.getElementById(
        PAUSE_ID
      )
    ) {
      return;
    }


    const complete =
      document.getElementById(
        "manaV64Complete"
      );


    if (!complete) {
      return;
    }


    const button =
      document.createElement(
        "button"
      );


    button.type =
      "button";

    button.id =
      PAUSE_ID;

    button.className =
      "mana-v920-pause";

    button.textContent =
      "Ⅱ PAUSE WORKOUT";


    button.addEventListener(
      "click",
      () => {

        saveTicks();

        pauseTimer();


        document
          .getElementById(
            "manaV64Close"
          )
          ?.click();

      }
    );


    complete
      .insertAdjacentElement(
        "beforebegin",
        button
      );

  }


  /* =========================================
     WORKOUT BADGE
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

    if (
      !workoutOpen()
    ) {
      return;
    }


    takeTimerControl();

    addExerciseTickAll();

    addWorkoutTickAll();

    addPauseButton();

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


    if (!card) {
      return;
    }


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


    const overviewIndex =
      overviewWorkoutIndex();


    const matchesOverview =
      Boolean(
        state &&
        overviewIndex !== null &&
        Number(
          state.dayIndex
        ) ===
          Number(
            overviewIndex
          )
      );


    /*
      If another workout was started manually
      from Program, do NOT mark Overview's
      different workout as in progress.
    */

    if (
      !matchesOverview
    ) {

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


    if (
      state.running
    ) {

      note.textContent =
        `In progress • ${formatTime(
          elapsedMs(
            state
          ) / 1000
        )}`;

    } else {

      note.textContent =
        `Paused at ${formatTime(
          elapsedMs(
            state
          ) / 1000
        )}`;

    }


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


    if (!card) {
      return;
    }


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
      state.running
        ? `In progress • ${formatTime(
            elapsedMs(
              state
            ) / 1000
          )}`
        : `Paused at ${formatTime(
            elapsedMs(
              state
            ) / 1000
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
     MANUAL SET SAVE
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


        setTimeout(
          saveTicks,
          60
        );

      },
      true
    );

  }


  /* =========================================
     X = SAFE PAUSE
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


        if (
          completing
        ) {
          return;
        }


        saveTicks();

        pauseTimer();


        setTimeout(
          refreshEverything,
          150
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
     COMPLETE WORKOUT
     ========================================= */

  function watchComplete() {

    document.addEventListener(
      "click",
      event => {

        if (
          !event.target.closest(
            "#manaV64Complete"
          )
        ) {
          return;
        }


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

      },
      true
    );


    window.addEventListener(
      "mana:strength-synced",
      () => {

        if (
          !completing
        ) {
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
              elapsedMs(
                state
              ) / 1000
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
          Number(
            last.dayIndex
          ) ===
          Number(
            state.dayIndex
          )
        ) {

          last.durationSeconds =
            totalSeconds;

          last.durationMinutes =
            Math.round(
              totalSeconds /
              60
            );


          saveLogs(
            logs
          );

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


    if (
      workoutOpen()
    ) {

      restoreTicks();

      updateTimerDisplay();

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
      eventName => {

        window.addEventListener(
          eventName,
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

    takeTimerControl();

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
      delay => {

        setTimeout(
          () => {

            takeTimerControl();

            wrapWorkoutOpen();

            refreshEverything();

          },
          delay
        );

      }
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
