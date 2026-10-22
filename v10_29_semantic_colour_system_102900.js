
/* ==========================================
   MANA MOVEMENT TRAINING
   VISUAL STABILITY + LAYOUT RESTORE
   VERSION 10.29.7
   BUILD 102970

   IMPORTANT
   ------------------------------------------
   No desktop layout overrides.
   No Overview grid overrides.
   No program container width overrides.

   Mana Strength:
   Restore original layout behaviour.

   Mana 28:
   Preserve existing desktop layout.

   Mana Lyfe:
   Preserve existing desktop layout.

   Internal pages:
   Fine gold borders.

   Bottom navigation:
   Keep icons and colours.
   Remove rectangular outlines.

   Main page headings:
   Workouts blue.
   Fuel gold.
   Progress purple.
   Learning orange.
   Reclaim green.

   Preserve all program functionality.
   ========================================== */

(() => {
  "use strict";

  const BUILD = "102970";

  const STYLE_ID =
    "mana-v1029-semantic-colour-system";

  const COLOURS = {
    program: "#55a8de",
    routine: "#55a8de",
    fuel: "#e0bb51",
    progress: "#a681dc",
    learn: "#e98a54",
    reclaim: "#55d98b"
  };

  let scheduled = false;

  /* ==========================================
     STABLE CSS
     ========================================== */

  const CSS = `

    :root {
      --mana-clean-gold:
        rgba(200,166,75,.52);

      --mana-clean-green:
        #55d98b;
    }

    /* =====================================
       BOTTOM NAVIGATION

       Remove outer borders.
       Preserve coloured artwork.
       ===================================== */

    #manaV83Tabs .mana-v83-tab,
    #manaV83Tabs .mana-v83-tab.active,
    #manaV83Tabs .mana-v83-tab:hover {

      border: none !important;

      outline: none !important;

      box-shadow: none !important;

    }

    #manaV83Tabs
    .mana-v83-tab::before,

    #manaV83Tabs
    .mana-v83-tab::after {

      border: none !important;

      box-shadow: none !important;

    }

    /* =====================================
       INTERNAL CARD BORDERS
       SUBTLE GOLD
       ===================================== */

    #manaV83Content
    .mana-v85-day,

    #manaV83Content
    .mana-v85-exercise,

    #manaV83Content
    .mana-v980-day,

    #manaV83Content
    .mana-v980-workout,

    #manaV83Content
    .mana-v980-exercises,

    #manaV83Content
    .mana-v980-exercise,

    #manaV83Content
    .mana-v981-card,

    #manaV83Content
    .mana-v985-learn-card,

    #manaV83Content
    .mana-v993-panel,

    #manaV83Content
    .mana-v993-row,

    #manaV83Content
    .mana-v927-card {

      border-color:
        var(--mana-clean-gold) !important;

      border-width:
        1px !important;

    }

    /* =====================================
       STRENGTH PROGRESS
       ===================================== */

    #manaV83Content
    .mana-v993-periods,

    #manaV83Content
    .mana-v993-period,

    #manaV83Content
    .mana-v993-metric,

    #manaV83Content
    .mana-v993-detail-btn,

    #manaV83Content
    .mana-v993-panel,

    #manaV83Content
    .mana-v993-summary,

    #manaV83Content
    .mana-v993-row,

    #manaV83Content
    .mana-v993-exercise-select {

      border:
        1px solid var(--mana-clean-gold)
        !important;

    }

    /* =====================================
       MANA 28 PROGRESS
       ===================================== */

    #manaV83Content
    .mana-v981-periods,

    #manaV83Content
    .mana-v981-period,

    #manaV83Content
    .mana-v981-overall,

    #manaV83Content
    .mana-v981-card {

      border-color:
        var(--mana-clean-gold) !important;

      border-width:
        1px !important;

    }

    /* =====================================
       MANA LYFE PROGRESS
       ===================================== */

    #manaV83Content
    .mana-v939-range,

    #manaV83Content
    .mana-v939-card,

    #manaV83Content
    .mana-v939-stat,

    #manaV83Content
    .mana-v939-insight,

    #manaV83Content
    .mana-v939-recent-row {

      border-color:
        var(--mana-clean-gold) !important;

      border-width:
        1px !important;

    }

    /* =====================================
       LEARNING
       ===================================== */

    #manaV83Content
    .mana-v985-learn-card,

    #manaV83Content
    .mana-v985-learn-button,

    #manaV933Life
    .mana-v933-learn-item,

    #manaV933Life
    .mana-v933-learn-button {

      border-color:
        var(--mana-clean-gold) !important;

      border-width:
        1px !important;

    }

    /* =====================================
       FUEL
       ===================================== */

    #manaV980SharedFuel
    .m980-meal,

    #manaV980SharedFuel
    .m10140-meal-visual,

    #manaV980SharedFuel
    .m10140-fuel-panel-icon {

      border:
        1px solid var(--mana-clean-gold)
        !important;

    }

    /* =====================================
       WORKOUT EXERCISES
       ===================================== */

    #manaV64Exercises
    .mana-v64-card,

    #manaV64Exercises
    .mana-v970-disclosure,

    #manaV64Exercises
    .mana-v970-action {

      border-color:
        var(--mana-clean-gold) !important;

      border-width:
        1px !important;

    }

    /* =====================================
       PRIMARY HEADING COLOURS
       ===================================== */

    #manaV83Content
    .mana102970-heading {

      color:
        var(--mana-heading-colour)
        !important;

    }

    #manaV83Content
    .mana102970-heading svg {

      color:
        var(--mana-heading-colour)
        !important;

      stroke:
        currentColor !important;

    }

    /* =====================================
       RESTORE STANDARD BODY TEXT
       ===================================== */

    #manaV83Content
    .mana102210-accent-text,

    #manaV83Content
    .mana-v85-day-label,

    #manaV83Content
    .mana-v980-category,

    #manaV83Content
    .mana-v85-num,

    #manaV83Content
    .mana-v980-number,

    #manaV83Content
    .mana-v985-kicker {

      color:
        #f3d875 !important;

    }

    /* =====================================
       NEXT BLOCK GREEN ACTION
       ===================================== */

    #manaV1017ProgramBlock
    .m1017-request-btn,

    #manaV1017ProgramBlock
    #manaV1017Request {

      background:
        #164b30 !important;

      color:
        #ffffff !important;

      border:
        1px solid #55d98b !important;

    }

    /* =====================================
       NO DESKTOP LAYOUT OVERRIDES

       All original program layouts are
       controlled by existing Mana modules.
       ===================================== */

  `;

  /* ==========================================
     INSTALL STYLE ONCE
     ========================================== */

  function installStyles() {

    let style =
      document.getElementById(
        STYLE_ID
      );

    if (!style) {

      style =
        document.createElement("style");

      style.id = STYLE_ID;

      document.head.appendChild(style);

    }

    if (style.textContent !== CSS) {

      style.textContent = CSS;

    }

  }

  /* ==========================================
     DETECT ACTIVE TAB
     ========================================== */

  function activeTab() {

    const current =
      document.querySelector(
        '#manaV83Tabs ' +
        '.mana-v83-tab.active[data-v83-tab], ' +
        '#manaV83Tabs ' +
        '.mana-v83-tab[aria-selected="true"]' +
        '[data-v83-tab]'
      );

    return current?.dataset?.v83Tab || "";

  }

  /* ==========================================
     SECTION HEADING ONLY
     ========================================== */

  function syncHeading() {

    const content =
      document.getElementById(
        "manaV83Content"
      );

    if (!content) return;

    const tab = activeTab();

    const colour = COLOURS[tab];

    content.querySelectorAll(
      ".mana102970-heading"
    ).forEach(node => {

      node.classList.remove(
        "mana102970-heading"
      );

    });

    if (!colour) {

      content.style.removeProperty(
        "--mana-heading-colour"
      );

      return;

    }

    content.style.setProperty(
      "--mana-heading-colour",
      colour
    );

    const patterns = {

      program:
        /^(my strength program|my program|workouts)/i,

      routine:
        /^(my routine|my program|workouts)/i,

      fuel:
        /^(fuel|my fuel|nutrition)/i,

      progress:
        /^(your progress|my progress|progress)/i,

      learn:
        /^(learning|my learning|learn)/i,

      reclaim:
        /^reclaim/i

    };

    const pattern = patterns[tab];

    if (!pattern) return;

    const headings =
      content.querySelectorAll(
        "h1,h2,h3," +
        ".mana-v993-head," +
        ".mana-v981-head," +
        ".mana-v985-head"
      );

    for (const node of headings) {

      const label =
        (node.textContent || "")
          .replace(/\\s+/g, " ")
          .trim();

      if (
        label.length < 90 &&
        pattern.test(label)
      ) {

        node.classList.add(
          "mana102970-heading"
        );

        break;

      }

    }

  }

  /* ==========================================
     DEBOUNCED UPDATE

     No repeated style installation.
     No continuous DOM observer.
     ========================================== */

  function scheduleSync() {

    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(() => {

      scheduled = false;

      syncHeading();

    });

  }

  /* ==========================================
     INITIALISE
     ========================================== */

  function init() {

    installStyles();

    syncHeading();

    [
      "mana:program-tab-change",
      "mana:program-change",
      "mana:workout-progress-change",
      "mana:fuel-updated"
    ].forEach(eventName => {

      document.addEventListener(
        eventName,
        scheduleSync
      );

      window.addEventListener(
        eventName,
        scheduleSync
      );

    });

    document.addEventListener(
      "click",
      event => {

        if (
          !(event.target instanceof Element)
        ) return;

        if (
          event.target.closest(
            [
              "#manaV83Tabs .mana-v83-tab",
              "[data-v964-launch]",
              "[data-v978-tab]",
              "[data-v993-period]",
              "[data-v985-learn]"
            ].join(",")
          )
        ) {

          scheduleSync();

        }

      }
    );

    window.addEventListener(
      "pageshow",
      scheduleSync
    );

    window.refreshManaSemanticColours =
      scheduleSync;

    window.MANA_SEMANTIC_COLOUR_BUILD =
      BUILD;

    console.log(
      "MANA VISUAL STABILITY",
      BUILD
    );

  }

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );

  } else {

    init();

  }

})();
