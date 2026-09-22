/* =========================================
   MANA MOVEMENT TRAINING v9.30.1
   STRENGTH + MANA 28 STABILITY BRIDGE

   - ONE CONTROLLED STRENGTH RESTORE
   - NO REPEATED OVERVIEW REBUILD PASSES
   - REMOVES STALE MANA 28 COACH
   - PRESERVES WORKOUT COMMENTS
   - PRESERVES COACH CHAT
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "93010";

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
  }

  function boundedStrengthRestore() {
    clearTimeout(
      refreshTimer
    );

    refreshTimer =
      setTimeout(
        refreshStrengthOverview,
        160
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
    clearTimeout(
      completionRepairTimer
    );

    completionRepairTimer =
      setTimeout(
        applyFeedbackBackup,
        180
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

      setTimeout(
        () => {
          protectWorkoutCompleteScreen();

          retryFeedbackSave();
        },
        180
      );

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

    protectWorkoutCompleteScreen();

    if (
      strengthOverviewOpen()
    ) {
      boundedStrengthRestore();
    }
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
      320
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
