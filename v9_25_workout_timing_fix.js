/* =========================================
   MANA MOVEMENT TRAINING v9.25.1
   WORKOUT TIMING PERSISTENCE FIX

   FIXES
   - PRESERVES WORKOUT TIMING DATA
   - STILL RETRIES SAVE IN BACKGROUND
   - RETRIES ARE SILENT
   - DOES NOT FIRE REPEATED STRENGTH SYNC EVENTS
   - REMOVES POST-WORKOUT PROGRAM FLICKER
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "92510";

  const STATE_KEY =
    "mana-strength-v920-in-progress";

  const LOG_KEY =
    "mana-strength-v64-logs";

  const PENDING_KEY =
    "mana-strength-v925-pending-timing";

  let pending =
    null;

  let retryTimers =
    [];


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


  function loadPending() {

    return safeJson(
      localStorage.getItem(
        PENDING_KEY
      ) || "null",
      null
    );
  }


  function savePending(
    value
  ) {

    try {

      if (
        value
      ) {

        localStorage.setItem(
          PENDING_KEY,
          JSON.stringify(
            value
          )
        );

      } else {

        localStorage.removeItem(
          PENDING_KEY
        );

      }

    } catch (_) {}

  }


  function elapsedMs(
    state
  ) {

    if (
      !state
    ) {

      return 0;
    }


    let total =
      Number(
        state.elapsedMs ||
        0
      );


    if (
      state.running &&
      state.segmentStartedAt
    ) {

      total +=
        Math.max(
          0,
          Date.now() -
          Number(
            state.segmentStartedAt
          )
        );

    }


    return total;
  }


  /* =========================================
     SET COMPLETION
     ========================================= */

  function collectSets() {

    let totalSets =
      0;

    let completedSets =
      0;


    document
      .querySelectorAll(
        "#manaV64Exercises " +
        "[data-v64-check]"
      )
      .forEach(
        check => {

          totalSets +=
            1;


          if (
            check
              .classList
              .contains(
                "done"
              )
          ) {

            completedSets +=
              1;

          }

        }
      );


    return {

      totalSets,

      completedSets,

      completionPercent:
        totalSets > 0

          ? Math.round(
              completedSets /
              totalSets *
              100
            )

          : 0

    };
  }


  /* =========================================
     SNAPSHOT
     ========================================= */

  function captureSnapshot() {

    const state =
      loadState();


    if (
      !state
    ) {

      return null;
    }


    const now =
      Date.now();


    const sets =
      collectSets();


    const durationSeconds =
      Math.max(
        1,
        Math.round(
          elapsedMs(
            state
          ) /
          1000
        )
      );


    return {

      dayIndex:
        Number(
          state.dayIndex
        ),

      logCountBeforeComplete:
        loadLogs()
          .length,

      startedAtISO:
        state.startedAtISO ||

        new Date(
          Number(
            state.startedAt ||
            now
          )
        ).toISOString(),

      finishedAtISO:
        new Date(
          now
        ).toISOString(),

      durationSeconds,

      durationMinutes:
        Math.max(
          1,
          Math.round(
            durationSeconds /
            60
          )
        ),

      completedSets:
        sets.completedSets,

      totalSets:
        sets.totalSets,

      completionPercent:
        sets.completionPercent,

      capturedAt:
        now

    };
  }


  /* =========================================
     FIND LOG
     ========================================= */

  function findTargetLog(
    logs,
    snapshot
  ) {

    if (
      !logs.length ||
      !snapshot
    ) {

      return -1;
    }


    const before =
      Math.max(
        0,
        Number(
          snapshot
            .logCountBeforeComplete ||
          0
        )
      );


    /*
      Best case:
      a brand-new workout
      was appended.
    */

    if (
      logs.length >
      before
    ) {

      for (
        let i =
          logs.length - 1;

        i >= before;

        i--
      ) {

        const log =
          logs[i];


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


      /*
        Some versions do not save
        dayIndex.

        Use newest new log.
      */

      return (
        logs.length - 1
      );
    }


    /*
      Backup if native code updates
      the latest log instead.
    */

    const lastIndex =
      logs.length - 1;


    const last =
      logs[
        lastIndex
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

      return lastIndex;

    }


    return -1;
  }


  /* =========================================
     APPLY TIMING

     IMPORTANT:
     Background retries DO NOT dispatch
     mana:strength-synced anymore.

     That repeated event was rebuilding
     the Program page after completion.
     ========================================= */

  function stampTiming() {

    const snapshot =
      pending ||
      loadPending();


    if (
      !snapshot
    ) {

      return false;
    }


    pending =
      snapshot;


    const logs =
      loadLogs();


    const index =
      findTargetLog(
        logs,
        snapshot
      );


    if (
      index < 0
    ) {

      return false;
    }


    const log =
      logs[
        index
      ];


    /*
      Timing
    */

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
      snapshot.durationMinutes;


    /*
      Completion
    */

    log.completedSets =
      Math.max(
        Number(
          log.completedSets ||
          0
        ),
        Number(
          snapshot.completedSets ||
          0
        )
      );


    log.totalSets =
      Math.max(
        Number(
          log.totalSets ||
          0
        ),
        Number(
          snapshot.totalSets ||
          0
        )
      );


    log.completionPercent =
      Math.max(
        Number(
          log.completionPercent ||
          0
        ),
        Number(
          snapshot
            .completionPercent ||
          0
        )
      );


    log.completed =
      true;


    log.workoutTimingVersion =
      "9.25.1";


    saveLogs(
      logs
    );


    /*
      Dedicated timing event only.

      Do NOT dispatch
      mana:strength-synced here.

      Program cards do not need
      rebuilding every time timing
      protection retries.
    */

    window.dispatchEvent(
      new CustomEvent(
        "mana:workout-timing-saved",
        {
          detail: {

            index,

            durationSeconds:
              log.durationSeconds,

            durationMinutes:
              log.durationMinutes,

            completionPercent:
              log.completionPercent

          }
        }
      )
    );


    return true;
  }


  /* =========================================
     RETRIES
     ========================================= */

  function clearRetries() {

    retryTimers
      .forEach(
        timer => {

          clearTimeout(
            timer
          );

        }
      );


    retryTimers =
      [];
  }


  function finish() {

    pending =
      null;


    savePending(
      null
    );


    clearRetries();
  }


  function scheduleRetries() {

    clearRetries();


    /*
      Keep these retries because
      multiple workout scripts can
      save the log at slightly
      different times.

      They are now SILENT retries.
    */

    const delays = [

      20,
      80,
      160,
      300,
      500,
      800,
      1200,
      1800,
      2600,
      3600,
      5000,
      6500,
      8000

    ];


    delays.forEach(
      (
        delay,
        index
      ) => {

        const timer =
          setTimeout(
            () => {

              stampTiming();


              if (
                index ===
                delays.length - 1
              ) {

                /*
                  One final protective
                  stamp.
                */

                stampTiming();


                finish();

              }

            },
            delay
          );


        retryTimers.push(
          timer
        );

      }
    );
  }


  /* =========================================
     COMPLETE
     ========================================= */

  function captureComplete() {

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


        const snapshot =
          captureSnapshot();


        if (
          !snapshot
        ) {

          return;
        }


        pending =
          snapshot;


        savePending(
          snapshot
        );


        /*
          Start silent persistence
          protection.
        */

        scheduleRetries();

      },
      true
    );
  }


  /* =========================================
     FEEDBACK SAVE

     IMPORTANT:
     We no longer listen for
     mana:strength-synced.

     The old version listened for that
     event while also generating that
     event itself, creating unnecessary
     refresh chains.
     ========================================= */

  function watchSaveEvents() {

    window.addEventListener(
      "mana:workout-feedback-saved",
      () => {

        if (
          pending ||
          loadPending()
        ) {

          setTimeout(
            stampTiming,
            30
          );

        }

      }
    );
  }


  /* =========================================
     RECOVERY
     ========================================= */

  function recoverPendingSave() {

    const recovered =
      loadPending();


    if (
      !recovered
    ) {

      return;
    }


    pending =
      recovered;


    /*
      If app refreshed during
      completion, finish silently.
    */

    setTimeout(
      () => {

        scheduleRetries();

      },
      300
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    captureComplete();

    watchSaveEvents();

    recoverPendingSave();
  }


  window
    .MANA_WORKOUT_TIMING_FIX_BUILD =
    BUILD;


  window
    .retryManaWorkoutTiming =
    stampTiming;


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
