/* =========================================
   MANA MOVEMENT TRAINING v9.20.1
   WORKOUT IN PROGRESS + RELIABLE TIMING SAVE

   - ONE VISIBLE WORKOUT TIMER
   - PAUSE / RESUME WORKOUT
   - X SAFELY PAUSES
   - TIMER CONTINUES FROM PAUSED TIME
   - PERSIST YELLOW SET TICKS
   - TICK ALL SETS / WHOLE WORKOUT
   - OVERVIEW + HOME SHOW IN-PROGRESS STATE
   - SAVES START TIME / END TIME
   - SAVES DURATION SECONDS / MINUTES
   - SAVES COMPLETION %
   - ROBUSTLY ATTACHES TIMING TO NEW LOG

   STABILITY REPAIR:
   - NO CONTINUOUS MUTATION OBSERVER
   - ONE DEBOUNCED EVENT REFRESH
   - REDUCES OVERVIEW REBUILD FLICKER
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

  let pendingCompletion =
    null;

  let eventRefreshTimer =
    null;

  let timerLoop =
    null;

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
        total /
        60
      );

    const secs =
      total %
      60;

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
        ) /
        1000
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
    if (!timerLoop) {
      return;
    }

    clearInterval(
      timerLoop
    );

    timerLoop =
      null;
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

  function collectCompletedSets() {
    const data =
      {};

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

          data[
            name
          ] =
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

  function completedSetCounts(
    completedSets
  ) {
    let totalSets =
      0;

    let completedSetsCount =
      0;

    Object.values(
      completedSets ||
      {}
    ).forEach(
      list => {

        if (
          !Array.isArray(
            list
          )
        ) {
          return;
        }

        totalSets +=
          list.length;

        completedSetsCount +=
          list
            .filter(
              Boolean
            )
            .length;

      }
    );

    return {
      totalSets,

      completedSets:
        completedSetsCount,

      completionPercent:
        totalSets >
        0
          ? Math.round(
              completedSetsCount /
              totalSets *
              100
            )
          : 0
    };
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
                    saved[
                      index
                    ]
                  )
                );

            }
          );

        }
      );

    updateNativeSummary();
  }

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
      index <
      0
    ) {
      return;
    }

    const previous =
      loadState();

    if (
      previous &&
      Number(
        previous.dayIndex
      ) ===
      index
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

      if (
        !previous.startedAt
      ) {
        previous.startedAt =
          Date.now();
      }

      if (
        !previous.startedAtISO
      ) {
        previous.startedAtISO =
          new Date(
            Number(
              previous.startedAt
            )
          ).toISOString();
      }

      if (
        !Number.isInteger(
          previous.logCountAtStart
        )
      ) {
        previous.logCountAtStart =
          loadLogs()
            .length;
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

    const now =
      Date.now();

    saveState({
      dayIndex:index,
      elapsedMs:0,
      running:true,
      segmentStartedAt:now,
      completedSets:{},
      startedAt:now,

      startedAtISO:
        new Date(
          now
        ).toISOString(),

      updatedAt:now,

      logCountAtStart:
        loadLogs()
          .length
    });

    window.dispatchEvent(
      new CustomEvent(
        "mana:workout-progress-change"
      )
    );
  }

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

  function injectStyles() {
    document
      .getElementById(
        "mana-v920-progress-style"
      )
      ?.remove();

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

    document.head
      .appendChild(
        style
      );
  }

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

          if (
            !controls
          ) {
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

    if (
      !complete
    ) {
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

    if (
      !complete
    ) {
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

  function updateOverview() {
    const state =
      loadState();

    const card =
      document.querySelector(
        ".mana-v9103-workout"
      );

    if (
      !card
    ) {
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
        overviewIndex !==
        null &&
        Number(
          state.dayIndex
        ) ===
        Number(
          overviewIndex
        )
      );

    if (
      !matchesOverview
    ) {
      if (
        button
      ) {
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
      state.running
        ? `In progress • ${formatTime(
            elapsedMs(
              state
            ) /
            1000
          )}`
        : `Paused at ${formatTime(
            elapsedMs(
              state
            ) /
            1000
          )}`;

    badge
      .insertAdjacentElement(
        "afterend",
        note
      );

    if (
      button
    ) {
      button.textContent =
        "RESUME WORKOUT →";
    }
  }

  function updateCurrentWorkout() {
    const state =
      loadState();

    const card =
      document.getElementById(
        "manaV82Current"
      );

    if (
      !card
    ) {
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

    if (
      !state
    ) {
      if (
        openText
      ) {
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
            ) /
            1000
          )}`
        : `Paused at ${formatTime(
            elapsedMs(
              state
            ) /
            1000
          )}`;

    badge
      .insertAdjacentElement(
        "afterend",
        note
      );

    if (
      openText
    ) {
      openText.textContent =
        "Resume workout →";
    }
  }

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

        queueRefresh(
          160
        );

      },
      true
    );
  }

  function captureCompletionSnapshot() {
    saveTicks();

    const state =
      loadState();

    if (
      !state
    ) {
      return null;
    }

    const completedSets =
      state.completedSets &&
      typeof
        state.completedSets ===
      "object"
        ? state.completedSets
        : collectCompletedSets();

    const counts =
      completedSetCounts(
        completedSets
      );

    const now =
      Date.now();

    return {
      dayIndex:
        Number(
          state.dayIndex
        ),

      logCountAtStart:
        Number.isInteger(
          state.logCountAtStart
        )
          ? state.logCountAtStart
          : loadLogs()
              .length,

      startedAt:
        Number(
          state.startedAt ||
          now
        ),

      startedAtISO:
        state.startedAtISO ||
        new Date(
          Number(
            state.startedAt ||
            now
          )
        ).toISOString(),

      finishedAt:
        now,

      finishedAtISO:
        new Date(
          now
        ).toISOString(),

      durationSeconds:
        Math.max(
          0,
          Math.round(
            elapsedMs(
              state
            ) /
            1000
          )
        ),

      completedSets:
        counts.completedSets,

      totalSets:
        counts.totalSets,

      completionPercent:
        counts.completionPercent
    };
  }

  function findCompletedLogIndex(
    logs,
    snapshot
  ) {
    if (
      !logs.length ||
      !snapshot
    ) {
      return -1;
    }

    const startIndex =
      Math.max(
        0,
        Math.min(
          logs.length -
          1,
          Number(
            snapshot.logCountAtStart ||
            0
          )
        )
      );

    for (
      let i =
        logs.length -
        1;
      i >=
      startIndex;
      i--
    ) {
      const log =
        logs[
          i
        ];

      if (
        Number.isFinite(
          Number(
            log?.dayIndex
          )
        ) &&
        Number(
          log.dayIndex
        ) ===
        Number(
          snapshot.dayIndex
        )
      ) {
        return i;
      }
    }

    if (
      logs.length >
      snapshot.logCountAtStart
    ) {
      return (
        logs.length -
        1
      );
    }

    const last =
      logs[
        logs.length -
        1
      ];

    if (
      last &&
      Number.isFinite(
        Number(
          last?.dayIndex
        )
      ) &&
      Number(
        last.dayIndex
      ) ===
      Number(
        snapshot.dayIndex
      )
    ) {
      return (
        logs.length -
        1
      );
    }

    return -1;
  }

  function applyTimingToCompletedLog(
    snapshot
  ) {
    if (
      !snapshot
    ) {
      return false;
    }

    const logs =
      loadLogs();

    const index =
      findCompletedLogIndex(
        logs,
        snapshot
      );

    if (
      index <
      0
    ) {
      return false;
    }

    const log =
      logs[
        index
      ];

    log.startedAt =
      snapshot.startedAtISO;

    log.startTime =
      snapshot.startedAtISO;

    log.finishedAt =
      snapshot.finishedAtISO;

    log.endTime =
      snapshot.finishedAtISO;

    log.completedAt =
      snapshot.finishedAtISO;

    log.durationSeconds =
      snapshot.durationSeconds;

    log.durationMinutes =
      Math.round(
        snapshot.durationSeconds /
        60
      );

    if (
      !Number.isFinite(
        Number(
          log.completedSets
        )
      ) ||
      Number(
        log.completedSets
      ) <=
      0
    ) {
      log.completedSets =
        snapshot.completedSets;
    }

    if (
      !Number.isFinite(
        Number(
          log.totalSets
        )
      ) ||
      Number(
        log.totalSets
      ) <=
      0
    ) {
      log.totalSets =
        snapshot.totalSets;
    }

    if (
      !Number.isFinite(
        Number(
          log.completionPercent
        )
      ) ||
      Number(
        log.completionPercent
      ) <=
      0
    ) {
      log.completionPercent =
        snapshot.completionPercent;
    }

    log.completed =
      true;

    log.workoutTimingVersion =
      "9.20.1";

    saveLogs(
      logs
    );

    window.dispatchEvent(
      new CustomEvent(
        "mana:workout-timing-saved",
        {
          detail:{
            id:
              log.id ||
              "",

            durationSeconds:
              log.durationSeconds,

            completionPercent:
              log.completionPercent
          }
        }
      )
    );

    return true;
  }

  function finishCompletionSave() {
    if (
      !pendingCompletion
    ) {
      return;
    }

    const snapshot =
      pendingCompletion;

    const saved =
      applyTimingToCompletedLog(
        snapshot
      );

    if (
      !saved
    ) {
      setTimeout(
        () => {

          if (
            !pendingCompletion
          ) {
            return;
          }

          const retrySaved =
            applyTimingToCompletedLog(
              pendingCompletion
            );

          if (
            retrySaved
          ) {
            pendingCompletion =
              null;

            clearState();

            queueRefresh(
              100
            );
          }

        },
        120
      );

      return;
    }

    pendingCompletion =
      null;

    clearState();

    queueRefresh(
      120
    );
  }

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

        pendingCompletion =
          captureCompletionSnapshot();

        completing =
          true;

        setTimeout(
          () => {

            completing =
              false;

          },
          3000
        );

      },
      true
    );

    window.addEventListener(
      "mana:strength-synced",
      () => {

        if (
          !completing ||
          !pendingCompletion
        ) {
          return;
        }

        completing =
          false;

        setTimeout(
          finishCompletionSave,
          30
        );

      }
    );
  }

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

  function queueRefresh(
    delay = 100
  ) {
    clearTimeout(
      eventRefreshTimer
    );

    eventRefreshTimer =
      setTimeout(
        refreshEverything,
        delay
      );
  }

  function watchEvents() {
    [
      "mana:program-tab-change",
      "mana:workout-progress-change",
      "mana:profile-synced",
      "mana:strength-synced"
    ].forEach(
      eventName => {

        window.addEventListener(
          eventName,
          () => {

            queueRefresh(
              110
            );

          }
        );

      }
    );

    window.addEventListener(
      "pageshow",
      () => {

        queueRefresh(
          120
        );

      }
    );

    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {
          queueRefresh(
            120
          );
        }

      }
    );
  }

  function init() {
    injectStyles();

    takeTimerControl();

    wrapWorkoutOpen();

    watchSetTicks();

    watchClose();

    watchComplete();

    watchEvents();

    setTimeout(
      () => {

        takeTimerControl();

        wrapWorkoutOpen();

        refreshEverything();

      },
      160
    );

    setTimeout(
      refreshEverything,
      520
    );
  }

  window.refreshManaWorkoutProgress =
    refreshEverything;

  window.MANA_WORKOUT_TIMING_BUILD =
    "92010";

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
