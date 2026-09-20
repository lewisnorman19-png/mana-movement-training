/* =========================================
   MANA MOVEMENT TRAINING v9.20.0
   LIVE WORKOUT AUTOSAVE

   - AUTOSAVE WEIGHT
   - AUTOSAVE REPS
   - AUTOSAVE COMPLETED SETS
   - AUTOSAVE ADDED / REMOVED SETS
   - REMEMBER WORKOUT TIMER
   - RESTORE AFTER PHONE SLEEP
   - RESTORE AFTER IOS RELOAD
   - DO NOT FORCE-REOPEN AFTER MANUAL X
   ========================================= */

(() => {
  "use strict";


  const SCREEN_ID =
    "manaStrengthV64Workout";

  const EXERCISES_ID =
    "manaV64Exercises";

  const PROGRAM_KEY =
    "mana-strength-v62-program";

  const DRAFT_KEY =
    "mana-strength-v920-workout-drafts";

  const ACTIVE_KEY =
    "mana-strength-v920-active-workout";


  let wrapping =
    false;

  let restoring =
    false;

  let saveTimer =
    null;

  let activeDayIndex =
    null;

  let workoutStartedAt =
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


  function loadProgram() {

    return safeJson(
      localStorage.getItem(
        PROGRAM_KEY
      ) || "null",
      null
    );

  }


  function workoutScreen() {

    return document.getElementById(
      SCREEN_ID
    );

  }


  function workoutOpen() {

    return Boolean(
      workoutScreen()
        ?.classList
        .contains(
          "open"
        )
    );

  }


  function loadDrafts() {

    const drafts =
      safeJson(
        localStorage.getItem(
          DRAFT_KEY
        ) || "{}",
        {}
      );


    return (
      drafts &&
      typeof drafts === "object"
    )
      ? drafts
      : {};

  }


  function saveDrafts(
    drafts
  ) {

    try {

      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify(
          drafts
        )
      );

    } catch (_) {}

  }


  function draftKey(
    dayIndex
  ) {

    return String(
      Number(
        dayIndex
      )
    );

  }


  function loadDraft(
    dayIndex
  ) {

    const drafts =
      loadDrafts();


    return (
      drafts[
        draftKey(
          dayIndex
        )
      ] ||
      null
    );

  }


  function saveDraft(
    dayIndex,
    draft
  ) {

    if (
      !Number.isInteger(
        dayIndex
      ) ||
      dayIndex < 0
    ) {
      return;
    }


    const drafts =
      loadDrafts();


    drafts[
      draftKey(
        dayIndex
      )
    ] =
      draft;


    saveDrafts(
      drafts
    );

  }


  function removeDraft(
    dayIndex
  ) {

    const drafts =
      loadDrafts();


    delete drafts[
      draftKey(
        dayIndex
      )
    ];


    saveDrafts(
      drafts
    );

  }


  function saveActiveState(
    active
  ) {

    try {

      if (
        !Number.isInteger(
          activeDayIndex
        )
      ) {

        localStorage.removeItem(
          ACTIVE_KEY
        );

        return;

      }


      localStorage.setItem(
        ACTIVE_KEY,
        JSON.stringify({

          active:
            Boolean(
              active
            ),

          dayIndex:
            activeDayIndex,

          startedAt:
            workoutStartedAt,

          savedAt:
            Date.now()

        })
      );

    } catch (_) {}

  }


  function loadActiveState() {

    return safeJson(
      localStorage.getItem(
        ACTIVE_KEY
      ) || "null",
      null
    );

  }


  function clearActiveState() {

    try {

      localStorage.removeItem(
        ACTIVE_KEY
      );

    } catch (_) {}

  }


  /* =========================================
     IDENTIFY CURRENT WORKOUT
     ========================================= */

  function readDayIndexFromScreen() {

    const subtitle =
      document.getElementById(
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


    const number =
      Number(
        match[1]
      );


    if (
      !Number.isFinite(
        number
      ) ||
      number < 1
    ) {
      return null;
    }


    return (
      number - 1
    );

  }


  /* =========================================
     COLLECT LIVE WORKOUT
     ========================================= */

  function collectWorkout() {

    const holder =
      document.getElementById(
        EXERCISES_ID
      );


    if (!holder) {
      return [];
    }


    return [
      ...holder.querySelectorAll(
        ".mana-v64-card"
      )
    ].map(
      (
        card,
        exerciseIndex
      ) => {

        const sets =
          [
            ...card.querySelectorAll(
              "[data-v64-set]"
            )
          ].map(
            (
              row,
              setIndex
            ) => {

              const weightInput =
                row.querySelector(
                  "[data-v64-weight]"
                );


              const repsInput =
                row.querySelector(
                  "[data-v64-reps]"
                );


              const check =
                row.querySelector(
                  "[data-v64-check]"
                );


              return {

                set:
                  setIndex + 1,

                weight:
                  weightInput
                    ?.value ??
                  "",

                reps:
                  repsInput
                    ?.value ??
                  "",

                done:
                  Boolean(
                    check
                      ?.classList
                      .contains(
                        "done"
                      )
                  )

              };

            }
          );


        return {

          exerciseIndex,

          name:
            card.dataset
              .exerciseName ||
            "",

          target:
            card.dataset
              .exerciseTarget ||
            "",

          sets

        };

      }
    );

  }


  /* =========================================
     SAVE
     ========================================= */

  function saveNow() {

    if (
      restoring ||
      !workoutOpen()
    ) {
      return;
    }


    const dayIndex =
      Number.isInteger(
        activeDayIndex
      )
        ? activeDayIndex
        : readDayIndexFromScreen();


    if (
      !Number.isInteger(
        dayIndex
      )
    ) {
      return;
    }


    activeDayIndex =
      dayIndex;


    if (
      !workoutStartedAt
    ) {

      const previous =
        loadDraft(
          dayIndex
        );


      workoutStartedAt =
        Number(
          previous
            ?.startedAt ||
          Date.now()
        );

    }


    const draft = {

      dayIndex,

      startedAt:
        workoutStartedAt,

      updatedAt:
        Date.now(),

      exercises:
        collectWorkout()

    };


    saveDraft(
      dayIndex,
      draft
    );


    saveActiveState(
      true
    );

  }


  function scheduleSave(
    delay = 120
  ) {

    clearTimeout(
      saveTimer
    );


    saveTimer =
      setTimeout(
        saveNow,
        delay
      );

  }


  /* =========================================
     RESTORE SET STRUCTURE
     ========================================= */

  function findExerciseCard(
    savedExercise,
    index
  ) {

    const holder =
      document.getElementById(
        EXERCISES_ID
      );


    if (!holder) {
      return null;
    }


    const cards =
      [
        ...holder.querySelectorAll(
          ".mana-v64-card"
        )
      ];


    const byName =
      cards.find(
        card =>
          String(
            card.dataset
              .exerciseName ||
            ""
          ) ===
          String(
            savedExercise
              ?.name ||
            ""
          )
      );


    return (
      byName ||
      cards[index] ||
      null
    );

  }


  function setRowCount(
    card,
    wantedCount
  ) {

    if (
      !card ||
      !Number.isInteger(
        wantedCount
      ) ||
      wantedCount < 1
    ) {
      return;
    }


    const addButton =
      card.querySelector(
        "[data-v64-add]"
      );


    const removeButton =
      card.querySelector(
        "[data-v64-remove]"
      );


    let rows =
      card.querySelectorAll(
        "[data-v64-set]"
      );


    while (
      rows.length <
      wantedCount
    ) {

      addButton?.click();


      rows =
        card.querySelectorAll(
          "[data-v64-set]"
        );

    }


    while (
      rows.length >
      wantedCount &&
      rows.length > 1
    ) {

      removeButton?.click();


      rows =
        card.querySelectorAll(
          "[data-v64-set]"
        );

    }

  }


  /* =========================================
     RESTORE VALUES
     ========================================= */

  function restoreDraft(
    dayIndex
  ) {

    const draft =
      loadDraft(
        dayIndex
      );


    if (
      !draft?.exercises?.length
    ) {
      return false;
    }


    restoring =
      true;


    try {

      activeDayIndex =
        dayIndex;


      workoutStartedAt =
        Number(
          draft.startedAt ||
          Date.now()
        );


      draft.exercises
        .forEach(
          (
            savedExercise,
            exerciseIndex
          ) => {

            const card =
              findExerciseCard(
                savedExercise,
                exerciseIndex
              );


            if (!card) {
              return;
            }


            const savedSets =
              Array.isArray(
                savedExercise.sets
              )
                ? savedExercise.sets
                : [];


            if (
              savedSets.length
            ) {

              setRowCount(
                card,
                savedSets.length
              );

            }


            const rows =
              [
                ...card.querySelectorAll(
                  "[data-v64-set]"
                )
              ];


            savedSets
              .forEach(
                (
                  savedSet,
                  setIndex
                ) => {

                  const row =
                    rows[
                      setIndex
                    ];


                  if (!row) {
                    return;
                  }


                  const weight =
                    row.querySelector(
                      "[data-v64-weight]"
                    );


                  const reps =
                    row.querySelector(
                      "[data-v64-reps]"
                    );


                  const check =
                    row.querySelector(
                      "[data-v64-check]"
                    );


                  if (weight) {

                    weight.value =
                      savedSet.weight ??
                      "";

                  }


                  if (reps) {

                    reps.value =
                      savedSet.reps ??
                      "";

                  }


                  check
                    ?.classList
                    .toggle(
                      "done",
                      Boolean(
                        savedSet.done
                      )
                    );

                }
              );

          }
        );


      /*
        v6.4's own summary recalculates
        whenever an input event fires.
      */

      const firstInput =
        document.querySelector(
          `#${EXERCISES_ID} input`
        );


      if (firstInput) {

        firstInput.dispatchEvent(
          new Event(
            "input",
            {
              bubbles:true
            }
          )
        );

      }


      return true;


    } finally {

      setTimeout(
        () => {

          restoring =
            false;

        },
        80
      );

    }

  }


  /* =========================================
     WORKOUT TIMER DISPLAY
     ========================================= */

  function formatTime(
    seconds
  ) {

    const mins =
      Math.floor(
        seconds / 60
      );


    const secs =
      seconds % 60;


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


  function syncTimerDisplay() {

    if (
      !workoutOpen() ||
      !workoutStartedAt
    ) {
      return;
    }


    const seconds =
      Math.max(
        0,
        Math.floor(
          (
            Date.now() -
            workoutStartedAt
          ) /
          1000
        )
      );


    const timer =
      document.getElementById(
        "manaV64Timer"
      );


    if (timer) {

      timer.textContent =
        formatTime(
          seconds
        );

    }

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
        .__manaV920Wrapped
    ) {
      return;
    }


    wrapping =
      true;


    const wrapped =
      function(
        dayIndex
      ) {

        const numericIndex =
          Number(
            dayIndex
          );


        const result =
          original.apply(
            this,
            arguments
          );


        if (
          Number.isInteger(
            numericIndex
          ) &&
          numericIndex >= 0
        ) {

          activeDayIndex =
            numericIndex;


          const draft =
            loadDraft(
              numericIndex
            );


          workoutStartedAt =
            Number(
              draft
                ?.startedAt ||
              Date.now()
            );


          saveActiveState(
            true
          );


          [
            40,
            120,
            250,
            500
          ].forEach(
            delay => {

              setTimeout(
                () => {

                  restoreDraft(
                    numericIndex
                  );


                  if (
                    typeof
                      window
                        .refreshManaExerciseCoach ===
                    "function"
                  ) {

                    window
                      .refreshManaExerciseCoach();

                  }


                  syncTimerDisplay();

                },
                delay
              );

            }
          );

        }


        return result;

      };


    wrapped
      .__manaV920Wrapped =
        true;


    wrapped
      .__manaV920Original =
        original;


    window
      .openManaStrengthWorkout =
        wrapped;


    wrapping =
      false;

  }


  /* =========================================
     MANUAL CLOSE / COMPLETE
     ========================================= */

  function watchWorkoutButtons() {

    document.addEventListener(
      "click",
      event => {

        /*
          Manual X:
          keep draft but don't auto-reopen.
        */

        if (
          event.target.closest(
            "#manaV64Close"
          )
        ) {

          saveNow();

          saveActiveState(
            false
          );


          return;

        }


        /*
          Complete workout:
          completed data already goes into
          v6.4 logs, so remove the draft.
        */

        if (
          event.target.closest(
            "#manaV64Complete"
          )
        ) {

          const dayIndex =
            Number.isInteger(
              activeDayIndex
            )
              ? activeDayIndex
              : readDayIndexFromScreen();


          if (
            Number.isInteger(
              dayIndex
            )
          ) {

            /*
              Give v6.4 time to validate and
              save. If the workout remains
              open because zero sets were
              completed, don't clear draft.
            */

            setTimeout(
              () => {

                if (
                  workoutOpen()
                ) {

                  scheduleSave(
                    50
                  );

                  return;

                }


                removeDraft(
                  dayIndex
                );


                clearActiveState();


                activeDayIndex =
                  null;


                workoutStartedAt =
                  null;

              },
              1300
            );

          }

        }

      },
      true
    );

  }


  /* =========================================
     LIVE INPUT WATCH
     ========================================= */

  function watchWorkoutChanges() {

    document.addEventListener(
      "input",
      event => {

        if (
          event.target.closest(
            `#${SCREEN_ID}`
          )
        ) {

          scheduleSave(
            100
          );

        }

      },
      true
    );


    document.addEventListener(
      "change",
      event => {

        if (
          event.target.closest(
            `#${SCREEN_ID}`
          )
        ) {

          scheduleSave(
            80
          );

        }

      },
      true
    );


    document.addEventListener(
      "click",
      event => {

        if (
          !event.target.closest(
            `#${SCREEN_ID}`
          )
        ) {
          return;
        }


        if (
          event.target.closest(
            "[data-v64-check]"
          ) ||
          event.target.closest(
            "[data-v64-add]"
          ) ||
          event.target.closest(
            "[data-v64-remove]"
          )
        ) {

          scheduleSave(
            120
          );

        }

      },
      true
    );

  }


  /* =========================================
     PHONE SLEEP / IOS RELOAD
     ========================================= */

  function resumeActiveWorkout() {

    const state =
      loadActiveState();


    if (
      !state?.active ||
      !Number.isInteger(
        Number(
          state.dayIndex
        )
      )
    ) {
      return;
    }


    const dayIndex =
      Number(
        state.dayIndex
      );


    const program =
      loadProgram();


    if (
      !program
        ?.sessions
        ?.[dayIndex]
    ) {

      clearActiveState();

      return;
    }


    activeDayIndex =
      dayIndex;


    const draft =
      loadDraft(
        dayIndex
      );


    workoutStartedAt =
      Number(
        draft
          ?.startedAt ||
        state.startedAt ||
        Date.now()
      );


    if (
      workoutOpen()
    ) {

      restoreDraft(
        dayIndex
      );


      syncTimerDisplay();


      return;

    }


    if (
      typeof
        window
          .openManaStrengthWorkout !==
      "function"
    ) {
      return;
    }


    /*
      Close the program shell first,
      matching our current workout path.
    */

    document
      .getElementById(
        "manaV83ProgramShell"
      )
      ?.classList
      .remove(
        "open"
      );


    document.body.style.overflow =
      "";


    window
      .openManaStrengthWorkout(
        dayIndex
      );

  }


  function scheduleResume() {

    [
      80,
      250,
      600,
      1100,
      1800
    ].forEach(
      delay => {

        setTimeout(
          resumeActiveWorkout,
          delay
        );

      }
    );

  }


  function watchPhone() {

    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
            "hidden"
        ) {

          if (
            workoutOpen()
          ) {

            saveNow();

            saveActiveState(
              true
            );

          }


          return;

        }


        if (
          document.visibilityState ===
            "visible"
        ) {

          scheduleResume();

        }

      }
    );


    window.addEventListener(
      "pagehide",
      () => {

        if (
          workoutOpen()
        ) {

          saveNow();

          saveActiveState(
            true
          );

        }

      }
    );


    window.addEventListener(
      "pageshow",
      scheduleResume
    );


    window.addEventListener(
      "focus",
      scheduleResume
    );

  }


  /* =========================================
     DOM WATCH
     ========================================= */

  function watchDOM() {

    let timer =
      null;


    const observer =
      new MutationObserver(
        () => {

          clearTimeout(
            timer
          );


          timer =
            setTimeout(
              () => {

                wrapWorkoutOpen();


                if (
                  workoutOpen()
                ) {

                  const dayIndex =
                    readDayIndexFromScreen();


                  if (
                    Number.isInteger(
                      dayIndex
                    )
                  ) {

                    activeDayIndex =
                      dayIndex;

                  }


                  scheduleSave(
                    120
                  );

                }

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
     INIT
     ========================================= */

  function init() {

    wrapWorkoutOpen();

    watchWorkoutButtons();

    watchWorkoutChanges();

    watchPhone();

    watchDOM();


    /*
      v6.4 loads before v9.20,
      but allow extra time for all
      Mana scripts to settle.
    */

    [
      100,
      300,
      700,
      1200
    ].forEach(
      delay => {

        setTimeout(
          wrapWorkoutOpen,
          delay
        );

      }
    );


    /*
      If iOS actually restarted the PWA,
      resume an active unfinished workout.
    */

    scheduleResume();


    /*
      Keep our displayed timer aligned with
      the saved original workout start time.
    */

    setInterval(
      syncTimerDisplay,
      1000
    );

  }


  window.saveManaStrengthWorkoutDraft =
    saveNow;


  window.resumeManaStrengthWorkout =
    resumeActiveWorkout;


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
