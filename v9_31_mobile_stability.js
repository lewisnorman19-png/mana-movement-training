/* =========================================
   MANA MOVEMENT TRAINING v9.31.0
   MOBILE STABILITY REPAIR

   WHOLE NEW FILE:
   v9_31_mobile_stability.js

   MOBILE-ONLY REPAIR FOR:
   - MANA STRENGTH FUEL CONTENT DROPPING OUT
   - OVERVIEW WORKOUT / COACH CHAT DROPPING OUT
   - SAFARI / HOME SCREEN SLOW TAB SETTLING

   IMPORTANT:
   - NO MUTATION OBSERVER
   - NO CONTINUOUS RENDER LOOP
   - ONLY REPAIRS WHEN REQUIRED CONTENT IS MISSING
   ========================================= */

(() => {
  "use strict";

  const BUILD = "93100";

  const SHELL_ID =
    "manaV83ProgramShell";

  const TITLE_ID =
    "manaV83Title";

  const CONTENT_ID =
    "manaV83Content";

  let repairRun =
    0;

  let navTimer =
    null;

  function mobileLike() {
    return Boolean(
      window.matchMedia?.(
        "(max-width: 700px)"
      )?.matches ||
      window.matchMedia?.(
        "(pointer: coarse)"
      )?.matches
    );
  }

  function shellOpen() {
    return Boolean(
      document
        .getElementById(
          SHELL_ID
        )
        ?.classList
        .contains(
          "open"
        )
    );
  }

  function programTitle() {
    return (
      document
        .getElementById(
          TITLE_ID
        )
        ?.textContent
        ?.trim()
        ?.toUpperCase() ||
      ""
    );
  }

  function activeTab() {
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

  function strengthOpen() {
    return Boolean(
      shellOpen() &&
      programTitle() ===
        "MANA STRENGTH"
    );
  }

  function fuelOpen() {
    return Boolean(
      strengthOpen() &&
      activeTab() ===
        "fuel"
    );
  }

  function overviewOpen() {
    return Boolean(
      strengthOpen() &&
      activeTab() ===
        "overview"
    );
  }

  function fuelComplete() {
    const holder =
      document.getElementById(
        CONTENT_ID
      );

    if (!holder) {
      return false;
    }

    const root =
      holder.querySelector(
        ".mana-v897-root"
      );

    const build =
      holder.querySelector(
        "#manaV89BuildTargets"
      );

    const edit =
      holder.querySelector(
        "#manaV89EditTargets"
      );

    const water =
      holder.querySelectorAll(
        "[data-mana-water]"
      );

    const meals =
      holder.querySelectorAll(
        "[data-mana-meal]"
      );

    const cards =
      holder.querySelectorAll(
        ".mana-v897-card"
      );

    const todayMeals =
      Array
        .from(
          holder.querySelectorAll(
            ".mana-v897-today-head h3"
          )
        )
        .some(
          node =>
            node.textContent
              ?.trim()
              ?.toLowerCase() ===
            "today's meals"
        );

    return Boolean(
      root &&
      build &&
      edit &&
      water.length === 3 &&
      meals.length === 4 &&
      cards.length >= 4 &&
      todayMeals
    );
  }

  function repairFuel() {
    if (
      !fuelOpen()
    ) {
      return true;
    }

    if (
      fuelComplete()
    ) {
      return true;
    }

    try {
      if (
        typeof
          window
            .renderManaStrengthFuel ===
        "function"
      ) {
        window
          .renderManaStrengthFuel();
      }
    } catch (_) {}

    return fuelComplete();
  }

  function overviewComplete() {
    const holder =
      document.getElementById(
        CONTENT_ID
      );

    if (!holder) {
      return false;
    }

    const welcome =
      holder.querySelector(
        ".mana-v866-welcome"
      );

    const workout =
      holder.querySelector(
        ".mana-v9103-workout"
      );

    const focus =
      Array
        .from(
          holder.querySelectorAll(
            ".mana-v866-section-head h3"
          )
        )
        .some(
          node =>
            node.textContent
              ?.trim() ===
            "Today's Focus"
        );

    const chat =
      holder.querySelector(
        "#manaV95ClientChatCard"
      );

    return Boolean(
      welcome &&
      workout &&
      focus &&
      chat
    );
  }

  function repairOverview() {
    if (
      !overviewOpen()
    ) {
      return true;
    }

    if (
      overviewComplete()
    ) {
      return true;
    }

    try {
      window
        .refreshManaStrengthOverviewLayout
        ?.();
    } catch (_) {}

    try {
      window
        .refreshManaWorkoutProgress
        ?.();
    } catch (_) {}

    try {
      window
        .refreshManaStrengthChat
        ?.();
    } catch (_) {}

    if (
      overviewComplete()
    ) {
      return true;
    }

    const holder =
      document.getElementById(
        CONTENT_ID
      );

    const baseMissing =
      !holder
        ?.querySelector(
          ".mana-v866-welcome"
        );

    if (
      baseMissing
    ) {
      try {
        window
          .refreshManaStrengthOverview
          ?.();
      } catch (_) {}
    }

    return overviewComplete();
  }

  function runRepair() {
    if (
      !mobileLike() ||
      !strengthOpen()
    ) {
      return;
    }

    repairRun += 1;

    if (
      fuelOpen()
    ) {
      repairFuel();
      return;
    }

    if (
      overviewOpen()
    ) {
      repairOverview();
    }
  }

  function scheduleMobileRepair() {
    if (
      !mobileLike()
    ) {
      return;
    }

    clearTimeout(
      navTimer
    );

    const runId =
      ++repairRun;

    [
      120,
      320,
      700,
      1200
    ].forEach(
      delay => {

        setTimeout(
          () => {

            if (
              runId !==
              repairRun
            ) {
              return;
            }

            if (
              fuelOpen()
            ) {
              if (
                repairFuel()
              ) {
                repairRun += 1;
              }

              return;
            }

            if (
              overviewOpen()
            ) {
              if (
                repairOverview()
              ) {
                repairRun += 1;
              }
            }

          },
          delay
        );

      }
    );
  }

  function handleClick(
    event
  ) {
    const tab =
      event.target.closest(
        "#manaV83Tabs .mana-v83-tab"
      );

    const workoutClose =
      event.target.closest(
        "#manaV64Close"
      );

    const workoutComplete =
      event.target.closest(
        "#manaV64Complete"
      );

    const strengthOpenButton =
      event.target.closest(
        "#manaV80Strength"
      );

    if (
      tab ||
      workoutClose ||
      workoutComplete ||
      strengthOpenButton
    ) {
      scheduleMobileRepair();
    }
  }

  function handleProgramEvent() {
    scheduleMobileRepair();
  }

  function handleVisible() {
    if (
      document.visibilityState ===
      "visible"
    ) {
      scheduleMobileRepair();
    }
  }

  function init() {
    if (
      !mobileLike()
    ) {
      return;
    }

    document.addEventListener(
      "click",
      handleClick,
      true
    );

    window.addEventListener(
      "mana:program-tab-change",
      handleProgramEvent
    );

    window.addEventListener(
      "mana:strength-synced",
      handleProgramEvent
    );

    window.addEventListener(
      "mana:workout-feedback-saved",
      handleProgramEvent
    );

    window.addEventListener(
      "pageshow",
      scheduleMobileRepair
    );

    window.addEventListener(
      "focus",
      scheduleMobileRepair
    );

    document.addEventListener(
      "visibilitychange",
      handleVisible
    );

    setTimeout(
      scheduleMobileRepair,
      400
    );
  }

  window.MANA_MOBILE_STABILITY_BUILD =
    BUILD;

  window.repairManaMobileView =
    scheduleMobileRepair;

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
