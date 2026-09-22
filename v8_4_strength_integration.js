/* =========================================
   MANA MOVEMENT TRAINING v8.4.1
   STRENGTH SHELL COMPATIBILITY BRIDGE

   IMPORTANT:
   This file NO LONGER renders the old
   "TODAY'S WORKOUT" Overview.

   Modern ownership:
   - Overview -> v8.6
   - Program -> v8.5
   - Fuel -> v8.9
   - Progress -> v8.7

   Purpose of this file now:
   - preserve compatibility for older code
     that still calls renderManaStrengthShell()
   - route to the correct modern renderer
   - do not overwrite newer Strength screens
   - no MutationObserver
   - no delayed old Overview redraw
   - no focus redraw loop
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "8404";

  const SHELL_ID =
    "manaV83ProgramShell";

  const TITLE_ID =
    "manaV83Title";

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

  function strengthOpen() {
    return Boolean(
      shellOpen() &&
      document
        .getElementById(
          TITLE_ID
        )
        ?.textContent
        ?.trim()
        ?.toUpperCase() ===
        "MANA STRENGTH"
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

  function renderStrengthTab() {
    if (
      !strengthOpen()
    ) {
      return;
    }

    const tab =
      activeTab();

    if (
      tab ===
      "overview"
    ) {
      try {
        window
          .renderManaStrengthOverview
          ?.();
      } catch (_) {}

      return;
    }

    if (
      tab ===
      "program"
    ) {
      try {
        window
          .refreshManaStrengthProgramCards
          ?.();
      } catch (_) {}

      return;
    }

    if (
      tab ===
      "fuel"
    ) {
      try {
        window
          .renderManaStrengthFuel
          ?.();
      } catch (_) {}

      return;
    }

    if (
      tab ===
      "progress"
    ) {
      try {
        window
          .renderManaStrengthProgress
          ?.();
      } catch (_) {}

      return;
    }

    /*
      Learn is left alone.
      The Program Shell owns that screen.
    */
  }

  function handleProgramChange() {
    if (
      !strengthOpen()
    ) {
      return;
    }

    renderStrengthTab();
  }

  function init() {
    /*
      No MutationObserver.
      No delayed repaint.
      No focus repaint.
      No old workout overview.
    */

    window.addEventListener(
      "mana:program-tab-change",
      handleProgramChange
    );

    if (
      strengthOpen()
    ) {
      renderStrengthTab();
    }
  }

  window.MANA_STRENGTH_INTEGRATION_BUILD =
    BUILD;

  window.renderManaStrengthShell =
    renderStrengthTab;

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
