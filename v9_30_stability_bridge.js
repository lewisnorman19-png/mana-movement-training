/* =========================================
   MANA MOVEMENT TRAINING v9.30.0
   STRENGTH + MANA 28 STABILITY BRIDGE

   WHOLE NEW FILE:
   v9_30_stability_bridge.js

   REPAIRS
   - STOPS OLD MANA 28 COACH FROM LEAKING INTO MANA STRENGTH
   - PHYSICALLY REMOVES STALE MANA 28 COACH MODAL WHEN LEAVING MANA 28
   - RESTORES MANA STRENGTH OVERVIEW WORKOUT CARD
   - RESTORES MANA STRENGTH COACH CHAT CARD
   - RESTORES IN-PROGRESS WORKOUT STATE
   - PRESERVES WORKOUT FEEDBACK / COACH COMMENTS
   - MAKES WORKOUT COMPLETE SCREEN VISIBLE ABOVE STALE OVERLAYS
   - USES BOUNDED EVENT-DRIVEN REFRESHES ONLY
   - NO MUTATION OBSERVER
   ========================================= */

(() => {
  "use strict";

  const BUILD = "93000";

  const LOG_KEY =
    "mana-strength-v64-logs";

  const FEEDBACK_BACKUP_KEY =
    "mana-strength-v930-feedback-backup";

  const MANA28_MODAL_ID =
    "manaV929Coach";

  let refreshTimer =
    null;

  let completionRepairTimer =
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

  function programTitle() {
    return (
      document
        .getElementById(
          "manaV83Title"
        )
        ?.textContent
        ?.trim()
        ?.toUpperCase() ||
      ""
    );
  }

  function activeProgramTab() {
    return (
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab ||
      ""
    );
  }

  function programShellOpen() {
    return Boolean(
      document
        .getElementById(
          "manaV83ProgramShell"
        )
        ?.classList
        .contains(
          "open"
        )
    );
  }

  function strengthOverviewOpen() {
    return Boolean(
      programShellOpen() &&
      programTitle() ===
        "MANA STRENGTH" &&
      activeProgramTab() ===
        "overview"
    );
  }

  function mana28Active() {
    return Boolean(
      programShellOpen() &&
      programTitle() ===
        "MANA 28"
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

  function removeStaleMana28Coach() {
    if (
      mana28Active()
    ) {
      return;
    }

    const modal =
      document.getElementById(
        MANA28_MODAL_ID
      );

    if (
      modal
    ) {
      modal.classList.remove(
        "open"
      );

      modal.remove();
    }

    if (
      !workoutOpen()
    ) {
      document.body.style
        .overflow =
          "";
    }
  }

  function overviewHasWorkout() {
    return Boolean(
      document.querySelector(
        "#manaV83Content .mana-v9103-workout"
      )
    );
  }

  function overviewHasCoachChat() {
    return Boolean(
      document.getElementById(
        "manaV95ClientChatCard"
      )
    );
  }

  function callRefresh(
    functionName
  ) {
    try {
      const fn =
        window[
          functionName
        ];

      if (
        typeof fn ===
        "function"
      ) {
        fn();
      }
    } catch (_) {}
  }

  function refreshStrengthOverview() {
    removeStaleMana28Coach();

    if (
      !strengthOverviewOpen()
    ) {
      return;
    }

    callRefresh(
      "refreshManaStrengthOverviewLayout"
    );

    callRefresh(
      "refreshManaWorkoutProgress"
    );

    callRefresh(
      "refreshManaStrengthChat"
    );

    callRefresh(
      "refreshManaWorkoutFeedback"
    );

    if (
      !overviewHasWorkout() ||
      !overviewHasCoachChat()
    ) {
      clearTimeout(
        refreshTimer
      );

      refreshTimer =
        setTimeout(
          () => {

            if (
              !strengthOverviewOpen()
            ) {
              return;
            }

            callRefresh(
              "refreshManaStrengthOverviewLayout"
            );

            callRefresh(
              "refreshManaWorkoutProgress"
            );

            callRefresh(
              "refreshManaStrengthChat"
            );

          },
          180
        );
    }
  }

  function boundedStrengthRestore() {
    [
      0,
      90,
      260,
      550
    ].forEach(
      delay => {

        setTimeout(
          refreshStrengthOverview,
          delay
        );

      }
    );
  }

  function readVisibleFeedback() {
    const effort =
      document
        .querySelector(
          "#manaV922Effort [data-v922-effort].active"
        )
        ?.dataset
        ?.v922Effort ||
      "";

    const note =
      document
        .getElementById(
          "manaV922Note"
        )
        ?.value
        ?.trim() ||
      "";

    if (
      !effort &&
      !note
    ) {
      return null;
    }

    return {
      effort,
      note,
      capturedAt:
        Date.now()
    };
  }

  function saveFeedbackBackup(
    feedback
  ) {
    try {
      if (
        feedback
      ) {
        localStorage.setItem(
          FEEDBACK_BACKUP_KEY,
          JSON.stringify(
            feedback
          )
        );
      } else {
        localStorage.removeItem(
          FEEDBACK_BACKUP_KEY
        );
      }
    } catch (_) {}
  }

  function loadFeedbackBackup() {
    return safeJson(
      localStorage.getItem(
        FEEDBACK_BACKUP_KEY
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

  function applyFeedbackBackup() {
    const feedback =
      loadFeedbackBackup();

    if (
      !feedback
    ) {
      return false;
    }

    if (
      Date.now() -
      Number(
        feedback.capturedAt ||
        0
      ) >
      30000
    ) {
      saveFeedbackBackup(
        null
      );

      return false;
    }

    const logs =
      loadLogs();

    if (
      !logs.length
    ) {
      return false;
    }

    const latest =
      logs[
        logs.length -
        1
      ];

    if (
      !latest
    ) {
      return false;
    }

    const latestDate =
      new Date(
        latest.date ||
        latest.completedAt ||
        0
      ).getTime();

    if (
      !Number.isFinite(
        latestDate
      ) ||
      Math.abs(
        latestDate -
        Number(
          feedback.capturedAt
        )
      ) >
      30000
    ) {
      return false;
    }

    if (
      feedback.effort
    ) {
      latest.sessionEffort =
        feedback.effort;
    }

    if (
      feedback.note
    ) {
      latest.workoutNote =
        feedback.note;
    }

    saveLogs(
      logs
    );

    saveFeedbackBackup(
      null
    );

    window.dispatchEvent(
      new CustomEvent(
        "mana:workout-feedback-saved"
      )
    );

    return true;
  }

  function retryFeedbackSave() {
    [
      40,
      140,
      350,
      700
    ].forEach(
      delay => {

        setTimeout(
          () => {

            applyFeedbackBackup();

          },
          delay
        );

      }
    );
  }

  function protectWorkoutCompleteScreen() {
    removeStaleMana28Coach();

    const screen =
      document.getElementById(
        "manaV915Complete"
      );

    if (
      !screen
    ) {
      return;
    }

    if (
      screen.classList
        .contains(
          "open"
        )
    ) {
      screen.style.zIndex =
        "50000";

      document.body.style
        .overflow =
          "hidden";
    }
  }

  function boundedCompletionRepair() {
    clearTimeout(
      completionRepairTimer
    );

    [
      80,
      220,
      500,
      900
    ].forEach(
      delay => {

        setTimeout(
          () => {

            protectWorkoutCompleteScreen();

            retryFeedbackSave();

          },
          delay
        );

      }
    );
  }

  function handleDocumentClick(
    event
  ) {
    if (
      event.target.closest(
        "#manaV64Complete"
      )
    ) {
      const feedback =
        readVisibleFeedback();

      if (
        feedback
      ) {
        saveFeedbackBackup(
          feedback
        );
      }

      removeStaleMana28Coach();

      boundedCompletionRepair();

      return;
    }

    if (
      event.target.closest(
        "#manaV80Strength"
      ) ||
      event.target.closest(
        "#manaV83Back"
      ) ||
      event.target.closest(
        "#manaV83Tabs .mana-v83-tab"
      )
    ) {
      setTimeout(
        () => {

          removeStaleMana28Coach();

          if (
            strengthOverviewOpen()
          ) {
            boundedStrengthRestore();
          }

        },
        0
      );
    }
  }

  function handleProgramChange() {
    removeStaleMana28Coach();

    if (
      strengthOverviewOpen()
    ) {
      boundedStrengthRestore();
    }
  }

  function handleStrengthSync() {
    removeStaleMana28Coach();

    retryFeedbackSave();

    boundedCompletionRepair();

    setTimeout(
      () => {

        if (
          strengthOverviewOpen()
        ) {
          boundedStrengthRestore();
        }

      },
      350
    );
  }

  function handleVisibility() {
    if (
      document.visibilityState !==
      "visible"
    ) {
      return;
    }

    removeStaleMana28Coach();

    if (
      strengthOverviewOpen()
    ) {
      boundedStrengthRestore();
    }

    protectWorkoutCompleteScreen();
  }

  function handlePageShow() {
    removeStaleMana28Coach();

    if (
      strengthOverviewOpen()
    ) {
      boundedStrengthRestore();
    }

    protectWorkoutCompleteScreen();
  }

  function init() {
    removeStaleMana28Coach();

    document.addEventListener(
      "click",
      handleDocumentClick,
      true
    );

    window.addEventListener(
      "mana:program-tab-change",
      handleProgramChange
    );

    window.addEventListener(
      "mana:strength-synced",
      handleStrengthSync
    );

    window.addEventListener(
      "mana:workout-feedback-saved",
      () => {

        if (
          strengthOverviewOpen()
        ) {
          boundedStrengthRestore();
        }

      }
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    window.addEventListener(
      "pageshow",
      handlePageShow
    );

    window.addEventListener(
      "focus",
      () => {

        removeStaleMana28Coach();

        if (
          strengthOverviewOpen()
        ) {
          boundedStrengthRestore();
        }

      }
    );

    [
      250,
      700,
      1400
    ].forEach(
      delay => {

        setTimeout(
          () => {

            removeStaleMana28Coach();

            if (
              strengthOverviewOpen()
            ) {
              refreshStrengthOverview();
            }

            protectWorkoutCompleteScreen();

          },
          delay
        );

      }
    );
  }

  window.MANA_STABILITY_BRIDGE_BUILD =
    BUILD;

  window.repairManaStrengthOverview =
    boundedStrengthRestore;

  window.repairManaWorkoutFeedback =
    retryFeedbackSave;

  window.clearStaleMana28Coach =
    removeStaleMana28Coach;

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
