/* =========================================
   MANA MOVEMENT TRAINING v9.31.1
   MOBILE STABILITY — FUEL ONLY

   IMPORTANT:
   Strength Overview is now rendered directly
   by v8.6 and must NOT be repaired here.

   This file now protects ONLY:
   - Strength Fuel content on mobile
   - Safari / Home Screen delayed Fuel rendering

   REMOVED:
   - Overview repair passes
   - Overview full renders
   - Overview workout/chat repair loops
   - repeated mobile Overview refreshes

   STABILITY:
   - NO MutationObserver
   - NO continuous render loop
   - bounded Fuel checks only
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "93110";

  const SHELL_ID =
    "manaV83ProgramShell";

  const TITLE_ID =
    "manaV83Title";

  const CONTENT_ID =
    "manaV83Content";

  let repairRun =
    0;

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

  function scheduleFuelRepair() {
    if (
      !mobileLike() ||
      !fuelOpen()
    ) {
      return;
    }

    const runId =
      ++repairRun;

    [
      100,
      300,
      700
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
              !fuelOpen()
            ) {
              return;
            }

            if (
              fuelComplete()
            ) {
              repairRun += 1;
              return;
            }

            if (
              repairFuel()
            ) {
              repairRun += 1;
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
    const fuelTab =
      event.target.closest(
        '#manaV83Tabs [data-v83-tab="fuel"]'
      );

    const strengthOpenButton =
      event.target.closest(
        "#manaV80Strength"
      );

    if (
      fuelTab ||
      strengthOpenButton
    ) {
      setTimeout(
        scheduleFuelRepair,
        0
      );
    }
  }

  function handleProgramEvent() {
    if (
      fuelOpen()
    ) {
      scheduleFuelRepair();
    }
  }

  function handleVisible() {
    if (
      document.visibilityState ===
        "visible" &&
      fuelOpen()
    ) {
      scheduleFuelRepair();
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
      "pageshow",
      () => {

        if (
          fuelOpen()
        ) {
          scheduleFuelRepair();
        }

      }
    );

    window.addEventListener(
      "focus",
      () => {

        if (
          fuelOpen()
        ) {
          scheduleFuelRepair();
        }

      }
    );

    document.addEventListener(
      "visibilitychange",
      handleVisible
    );

    if (
      fuelOpen()
    ) {
      scheduleFuelRepair();
    }
  }

  window.MANA_MOBILE_STABILITY_BUILD =
    BUILD;

  window.repairManaMobileFuel =
    scheduleFuelRepair;

  /*
    Compatibility only.

    Older code may call repairManaMobileView().
    It now repairs Fuel only and NEVER rebuilds
    Strength Overview.
  */

  window.repairManaMobileView =
    scheduleFuelRepair;

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
