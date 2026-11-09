
/* ============================================================
   MANA MOVEMENT TRAINING
   MANA28 WORKOUT RESTORATION
   BUILD 104450

   COMPLETE JAVASCRIPT FILE

   FIXES:
   - Restore recognition of the MANA 28 program
   - Restore the existing four-week workout renderer
   - Keep MANA white and 28 orange in the header
   - Preserve the approved runner and Overview artwork
   - Preserve existing bottom navigation

   DOES NOT CHANGE:
   - Workout exercises or schedules
   - Completed workout records
   - Fuel, calories, protein or water
   - Recovery or Learning
   - Mana Strength or ManaLyfe

   ROOT CAUSE:
   Earlier header scripts placed line breaks and spaces
   between MANA and 28 inside the actual title text.

   The original workout engine reads title.textContent
   and expects the exact prefix "MANA 28".

   This file restores that exact text while retaining
   separate coloured header spans.

   LOAD AFTER BUILD 104440
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104450";

  const SHELL_ID = "manaV83ProgramShell";
  const TITLE_ID = "manaV83Title";
  const TABS_ID = "manaV83Tabs";

  const STYLE_ID = "mana28WorkoutRestoreStyle104450";

  const FIXED_CLASS = "mana28-title-restored-104450";

  if (window.MANA28_WORKOUT_RESTORE_BUILD === BUILD) {
    return;
  }

  window.MANA28_WORKOUT_RESTORE_BUILD = BUILD;

  function getShell() {
    return document.getElementById(SHELL_ID);
  }

  function getTitle() {
    return document.getElementById(TITLE_ID);
  }

  function isMana28() {
    const shell = getShell();
    const title = getTitle();

    if (!shell || !title) return false;

    if (!shell.classList.contains("open")) {
      return false;
    }

    const value = String(
      title.textContent || ""
    ).replace(/\s+/g, " ").trim().toUpperCase();

    return value === "MANA 28";
  }

  /* ============================================================
     STYLING — SAME APPROVED COLOURS
     ============================================================ */

  function installStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `
      #${SHELL_ID} #${TITLE_ID}.${FIXED_CLASS} {
        display: flex !important;
        align-items: baseline !important;
        flex-wrap: nowrap !important;
        gap: 0 !important;
        white-space: nowrap !important;
        font-weight: 900 !important;
        letter-spacing: -.025em !important;
      }

      #${SHELL_ID} #${TITLE_ID}.${FIXED_CLASS}
      .mana28-final-title-104440 {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
      }

      #${SHELL_ID} #${TITLE_ID}.${FIXED_CLASS}
      .mana28-title-28 {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      #${SHELL_ID} #${TITLE_ID}.${FIXED_CLASS}
      span {
        font: inherit !important;
        letter-spacing: inherit !important;
        line-height: inherit !important;
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     RESTORE EXACT PROGRAM IDENTIFIER
     ============================================================ */

  function restoreTitle() {
    if (!isMana28()) {
      return false;
    }

    const title = getTitle();

    if (!title) {
      return false;
    }

    // The original JavaScript depends on this exact value.
    const EXPECTED = "MANA 28";

    // The first span contains a single trailing space.
    // This makes textContent exactly "MANA 28".
    // No newlines or extra spaces are inserted.

    const first = title.querySelector(
      ".mana28-final-title-104440"
    );

    const second = title.querySelector(
      ".mana28-title-28"
    );

    if (
      title.textContent === EXPECTED &&
      first &&
      second
    ) {
      title.classList.add(FIXED_CLASS);
      return false;
    }

    const mana = document.createElement("span");

    mana.className =
      "mana28-title-mana mana28-final-title-104440";

    mana.textContent = "MANA ";

    const number = document.createElement("span");

    number.className = "mana28-title-28";

    number.textContent = "28";

    title.replaceChildren(mana, number);

    title.classList.add(FIXED_CLASS);

    // Keep compatibility with the previous header modules.
    title.dataset.titleStyled104430 = "true";

    return true;
  }

  /* ============================================================
     RESTORE WORKOUT RENDERING
     ============================================================ */

  let repairNotificationSent = false;

  function repair() {
    if (!isMana28()) {
      repairNotificationSent = false;
      return;
    }

    const changed = restoreTitle();

    if (changed && !repairNotificationSent) {
      repairNotificationSent = true;

      // The existing program engine listens to this event.
      // It will redraw the appropriate tab using its own
      // workout schedule and existing completion records.

      window.dispatchEvent(
        new CustomEvent("mana:program-tab-change")
      );
    }
  }

  /* ============================================================
     SCHEDULED REFRESH
     ============================================================ */

  let queued = false;

  function schedule() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      repair();
    });
  }

  /* ============================================================
     INITIALISATION
     ============================================================ */

  function init() {
    installStyles();

    repair();

    const shell = getShell();

    if (shell && window.MutationObserver) {
      const observer = new MutationObserver(() => {
        schedule();
      });

      observer.observe(shell, {
        childList: true,
        subtree: true
      });
    }

    window.addEventListener(
      "mana:program-tab-change",
      schedule
    );

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest(
            "#manaV83Tabs, " +
            "#manaV83ProgramShell, " +
            "#manaV80Mana28"
          )
        ) {
          schedule();
        }
      },
      true
    );

    window.addEventListener(
      "pageshow",
      schedule
    );

    console.log(
      "[Mana28] Workout title compatibility restored — " +
      BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
