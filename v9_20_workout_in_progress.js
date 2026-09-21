/* =========================================
   MANA MOVEMENT TRAINING v9.20.1
   WORKOUT IN PROGRESS + RESUME STATE

   - WORKOUT REMAINS IN PROGRESS
     UNTIL COMPLETE IS CONFIRMED
   - RESTORES YELLOW COMPLETED SET TICKS
   - RESTORES WORKOUT TIMER
   - TIMER PAUSES WHEN WORKOUT IS CLOSED
   - TIMER CONTINUES WHEN WORKOUT RESUMES
   - TICK ALL SETS PER EXERCISE
   - TICK ALL WORKOUT
   - SHOWS IN PROGRESS ON OVERVIEW
   - SHOWS IN PROGRESS ON CURRENT WORKOUT
   - DOES NOT CONTROL APP STARTUP / ROUTING
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

  let timerInterval =
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


    stopResumeTimer();


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


  function currentDayIndex() {

    const subtitle =
      document
        .getElementById(
          "manaV64Subtitle"
        )
        ?.textContent ||
      "";


    const match =
      subtitle.match(
        /Day\s+(\d+)/i
      );


    if (
      !match?.[1]
    ) {
      return null;
    }


    const index =
      Number(
        match[1]
      ) - 1;


    return Number.isInteger(
      index
    )
      ? index
      : null;

  }


  /* =========================================
     TIMER
     ========================================= */

  function formatTime(
    seconds
  ) {

    const safeSeconds =
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
        safeSeconds / 60
      );


    const secs =
      safeSeconds % 60;


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


  function currentElapsedMs(
    state = loadState()
  ) {

    if (!state) {
      return 0;
    }


    let elapsed =
      Number(
        state.elapsedMs ||
        0
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


  function updateTimerDisplay() {

    if (
      !workoutOpen()
    ) {
      return;
    }


    const state =
      loadState();


    if (!state) {
      return;
    }


    const timer =
      document.getElementById(
        "manaV64Timer"
      );


    if (!timer) {
      return;
    }


    timer.textContent =
      formatTime(
        currentElapsedMs(
          state
        ) / 1000
      );

  }


  function startResumeTimer() {

    stopResumeTimer();


    updateTimerDisplay();


    timerInterval =
      setInterval(
        updateTimerDisplay,
        1000
      );

  }


  function stopResumeTimer() {

    if (
      timerInterval
    ) {

      clearInterval(
        timerInterval
      );


      timerInterval =
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
      currentElapsedMs(
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


    stopResumeTimer();

  }


  function resumeTimer() {

    const state =
      loadState();


    if (!state) {
      return;
    }


    /*
      Only start a fresh segment if
      timer is currently paused.
    */

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


    startResumeTimer();

  }


  /* =========================================
     SAVE COMPLETED SET TICKS
     ========================================= */

  function collectTickState() {

    return [
      ...document.querySelectorAll(
        "#manaV64Exercises .mana-v64-card"
      )
    ].map(
      card => {

        return [
          ...card.querySelectorAll(
            "[data-v64-check]"
          )
        ].map(
          check =>
            check
              .classList
              .contains(
                "done"
              )
        );

      }
    );

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
      collectTickState();

    state.updatedAt =
      Date.now();


    saveState(
      state
    );

  }


  function restoreTicks() {

    const state =
      loadState();


    if (
      !state ||
      !Array.isArray(
        state.completedSets
      )
    ) {
      return;
    }


    const cards =
      [
        ...document.querySelectorAll(
          "#manaV64Exercises .mana-v64-card"
        )
      ];


    cards.forEach(
      (
        card,
        exerciseIndex
      ) => {

        const savedSets =
          state.completedSets[
            exerciseIndex
          ];


        if (
          !Array.isArray(
            savedSets
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
            setIndex
          ) => {

            const shouldBeDone =
              Boolean(
                savedSets[
                  setIndex
                ]
              );


            const isDone =
              check
                .classList
                .contains(
                  "done"
                );


            /*
              Use click rather than manually
              changing the class so v6.4 also
              recalculates volume, sets and %.
            */

            if (
              shouldBeDone !==
              isDone
            ) {

              check.click();

            }

          }
        );

      }
    );

  }


  /* =========================================
     SAVE IN PROGRESS
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


    /*
      Same unfinished workout:
      preserve timer + ticks.
    */

    if (
      previous?.dayIndex ===
        index
    ) {

      previous.updatedAt =
        Date.now();


      if (
        !previous.running
      ) {

        previous.running =
          true;

        previous.segmentStartedAt =
          Date.now();

      }


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


    /*
      Brand-new workout.
    */

    const state = {

      dayIndex:
        index,

      startedAt:
        Date.now(),

      elapsedMs:
        0,

      running:
        true,

      segmentStartedAt:
        Date.now(),

      completedSets:
        [],

      updatedAt:
        Date.now(),

      logCountAtStart:
        loadLogs().length

    };


    saveState(
      state
    );


    window.dispatchEvent(
      new CustomEvent(
        "mana:workout-progress-change"
      )
    );


    setTimeout(
      refreshEverything,
      80
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
        .__manaV920ProgressWrapped
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


        /*
          v6.4 rebuilds all workout cards
          every time the workout opens.

          Restore our saved state after
          those cards exist.
        */

        [
          60,
          160,
          350,
          650
        ].forEach(
          delay => {

            setTimeout(
              () => {

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
          100
        );


        return result;

      };


    wrapped
      .__manaV920ProgressWrapped =
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

        padding:
          6px
          9px;

        border:
          1px solid
          #6d5b1f;

        border-radius:
          999px;

        background:
          #181509;

        color:
          #f3d875;

        font-size:
          10px;

        font-weight:
          900;

        letter-spacing:
          .08em;

        text-transform:
          uppercase;
      }


      .mana-v920-progress-badge::before{
        content:"●";
        font-size:8px;
      }


      .mana-v920-tick-all{
        width:100%;

        min-height:44px;

        margin-top:10px;

        border:
          1px solid
          #4c421e;

        border-radius:
          13px;

        background:
          #121008;

        color:
          #f3d875;

        font-size:
          12px;

        font-weight:
          900;

        cursor:pointer;
      }


      .mana-v920-tick-all:active{
        transform:
          scale(.99);
      }


      .mana-v920-workout-all{
        width:100%;

        min-height:52px;

        margin:
          18px
          0
          8px;

        border:
          1px solid
          #6b5920;

        border-radius:
          16px;

        background:
          linear-gradient(
            145deg,
            #1b1708,
            #0d0d0d
          );

        color:
          #f3d875;

        font-size:
          13px;

        font-weight:
          900;

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


          button.onclick =
            () => {

              card
                .querySelectorAll(
                  "[data-v64-check]"
                )
                .forEach(
                  check => {

                    if (
                      !check
                        .classList
                        .contains(
                          "done"
                        )
                    ) {

                      check.click();

                    }

                  }
                );


              setTimeout(
                saveTicks,
                60
              );

            };


          controls
            .insertAdjacentElement(
              "beforebegin",
              button
            );

        }
      );

  }


  /* =========================================
     TICK ALL — WHOLE WORKOUT
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


    button.onclick =
      () => {

        document
          .querySelectorAll(
            "#manaV64Exercises [data-v64-check]"
          )
          .forEach(
            check => {

              if (
                !check
                  .classList
                  .contains(
                    "done"
                  )
              ) {

                check.click();

              }

            }
          );


        setTimeout(
          saveTicks,
          80
        );

      };


    complete
      .insertAdjacentElement(
        "beforebegin",
        button
      );

  }


  /* =========================================
     WORKOUT HEADER BADGE
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


  /* =========================================
     ENHANCE WORKOUT
     ========================================= */

  function enhanceWorkout() {

    if (
      !workoutOpen()
    ) {
      return;
    }


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


    if (!state) {

      if (button) {

        button.textContent =
          "START WORKOUT →";

      }


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


    const title =
      card.querySelector(
        "h3"
      );


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


    const elapsed =
      formatTime(
        currentElapsedMs(
          state
        ) / 1000
      );


    note.textContent =
      `Workout paused at ${elapsed}. Resume when ready.`;


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
      `Paused at ${formatTime(
        currentElapsedMs(
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
     MANUAL SET TICKS
     ========================================= */

  function watchSetTicks() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV64Exercises [data-v64-check]"
          )
        ) {

          setTimeout(
            saveTicks,
            60
          );

        }

      },
      true
    );

  }


  /* =========================================
     WORKOUT X — PAUSE
     ========================================= */

  function watchWorkoutClose() {

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


        saveTicks();

        pauseTimer();


        setTimeout(
          refreshEverything,
          150
        );


        setTimeout(
          refreshEverything,
          500
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
            2000
          );

        }

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


        /*
          v6.4 records only the timer segment
          since the most recent reopen.

          Replace that duration with our full
          resumed workout duration.
        */

        const state =
          loadState();


        const finalSeconds =
          Math.max(
            0,
            Math.round(
              currentElapsedMs(
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
            finalSeconds;


          last.durationMinutes =
            Math.round(
              finalSeconds /
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

      updateTimerDisplay();

    }

  }


  /* =========================================
     WATCH DOM
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
              80
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
              100
            );


            setTimeout(
              refreshEverything,
              350
            );

          }
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        setTimeout(
          refreshEverything,
          120
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

    watchWorkoutClose();

    watchComplete();

    watchDOM();

    watchEvents();


    [
      200,
      500,
      900,
      1500,
      2500
    ].forEach(
      delay => {

        setTimeout(
          () => {

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
