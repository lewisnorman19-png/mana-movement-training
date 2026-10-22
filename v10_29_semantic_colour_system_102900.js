
/* ==========================================
   MANA MOVEMENT TRAINING
   STRENGTH DESKTOP LAYOUT RESTORE
   VERSION 10.29.8
   BUILD 102980

   PURPOSE:
   - Match Strength Overview to Lyfe layout
   - Two cards per row on desktop
   - Restore full-width Strength Hub heading
   - Preserve Mana 28 and Mana Lyfe
   - Preserve mobile layout
   - Preserve coloured Overview card borders
   - Preserve bottom tab icons
   - Keep internal borders subtle gold
   - Keep green next-block upgrade

   No changes to program functionality.
   ========================================== */

(() => {
  "use strict";

  const BUILD = "102980";

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
     PREMIUM STYLING
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
       KEEP COLOURED ICONS
       REMOVE OUTSIDE BORDERS
       ===================================== */

    #manaV83Tabs .mana-v83-tab,
    #manaV83Tabs .mana-v83-tab.active,
    #manaV83Tabs .mana-v83-tab:hover {
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
    }

    #manaV83Tabs .mana-v83-tab::before,
    #manaV83Tabs .mana-v83-tab::after {
      border: none !important;
      box-shadow: none !important;
    }

    /* =====================================
       INTERNAL CARDS
       SUBTLE GOLD BORDERS
       ===================================== */

    #manaV83Content .mana-v85-day,
    #manaV83Content .mana-v85-exercise,
    #manaV83Content .mana-v980-day,
    #manaV83Content .mana-v980-workout,
    #manaV83Content .mana-v980-exercises,
    #manaV83Content .mana-v980-exercise,
    #manaV83Content .mana-v981-card,
    #manaV83Content .mana-v985-learn-card,
    #manaV83Content .mana-v993-panel,
    #manaV83Content .mana-v993-row,
    #manaV83Content .mana-v927-card {
      border-color:
        var(--mana-clean-gold) !important;
      border-width: 1px !important;
    }

    /* =====================================
       STRENGTH PROGRESS
       ===================================== */

    #manaV83Content .mana-v993-periods,
    #manaV83Content .mana-v993-period,
    #manaV83Content .mana-v993-metric,
    #manaV83Content .mana-v993-detail-btn,
    #manaV83Content .mana-v993-panel,
    #manaV83Content .mana-v993-summary,
    #manaV83Content .mana-v993-row,
    #manaV83Content .mana-v993-exercise-select {
      border: 1px solid
        var(--mana-clean-gold) !important;
    }

    /* =====================================
       MANA 28 PROGRESS
       ===================================== */

    #manaV83Content .mana-v981-periods,
    #manaV83Content .mana-v981-period,
    #manaV83Content .mana-v981-overall,
    #manaV83Content .mana-v981-card {
      border-color:
        var(--mana-clean-gold) !important;
      border-width: 1px !important;
    }

    /* =====================================
       MANA LYFE PROGRESS
       ===================================== */

    #manaV83Content .mana-v939-range,
    #manaV83Content .mana-v939-card,
    #manaV83Content .mana-v939-stat,
    #manaV83Content .mana-v939-insight,
    #manaV83Content .mana-v939-recent-row {
      border-color:
        var(--mana-clean-gold) !important;
      border-width: 1px !important;
    }

    /* =====================================
       LEARNING
       ===================================== */

    #manaV83Content .mana-v985-learn-card,
    #manaV83Content .mana-v985-learn-button,
    #manaV933Life .mana-v933-learn-item,
    #manaV933Life .mana-v933-learn-button {
      border-color:
        var(--mana-clean-gold) !important;
      border-width: 1px !important;
    }

    /* =====================================
       FUEL
       ===================================== */

    #manaV980SharedFuel .m980-meal,
    #manaV980SharedFuel .m10140-meal-visual,
    #manaV980SharedFuel .m10140-fuel-panel-icon {
      border: 1px solid
        var(--mana-clean-gold) !important;
    }

    /* =====================================
       WORKOUTS
       ===================================== */

    #manaV64Exercises .mana-v64-card,
    #manaV64Exercises .mana-v970-disclosure,
    #manaV64Exercises .mana-v970-action {
      border-color:
        var(--mana-clean-gold) !important;
      border-width: 1px !important;
    }

    /* =====================================
       SECTION HEADING COLOURS
       ===================================== */

    #manaV83Content .mana102980-heading {
      color:
        var(--mana-heading-colour) !important;
    }

    #manaV83Content .mana102980-heading svg {
      color:
        var(--mana-heading-colour) !important;
      stroke: currentColor !important;
    }

    /* =====================================
       STANDARD GOLD TEXT
       ===================================== */

    #manaV83Content .mana102210-accent-text,
    #manaV83Content .mana-v85-day-label,
    #manaV83Content .mana-v980-category,
    #manaV83Content .mana-v85-num,
    #manaV83Content .mana-v980-number,
    #manaV83Content .mana-v985-kicker {
      color: #f3d875 !important;
    }

    /* =====================================
       NEXT BLOCK BUTTON
       GREEN
       ===================================== */

    #manaV1017ProgramBlock .m1017-request-btn,
    #manaV1017ProgramBlock #manaV1017Request {
      background: #164b30 !important;
      color: #ffffff !important;
      border: 1px solid #55d98b !important;
    }

    /* =====================================
       MANA STRENGTH OVERVIEW
       LAPTOP ONLY

       Important:
       - Target Strength Overview only.
       - Widen its parent container.
       - Use the existing card grid.
       - Do not turn the launchpad into a grid.
       ===================================== */

    @media (min-width: 901px) {

      /* Widen only the Strength Overview shell */

      body .wrap:has(#manaV964Launchpad) {
        max-width: 900px !important;
        width: 100% !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      /* Strength Overview container */

      #manaV964Launchpad {
        display: block !important;
        width: 100% !important;
        max-width: 800px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      /* Heading sits above the card grid */

      #manaV964Launchpad .mana-v964-intro {
        display: block !important;
        width: 100% !important;
        max-width: none !important;
        margin-bottom: 22px !important;
      }

      #manaV964Launchpad .mana-v964-intro h2 {
        max-width: none !important;
        width: auto !important;
      }

      #manaV964Launchpad .mana-v964-intro p {
        max-width: 720px !important;
      }

      /* Two evenly sized cards per row */

      #manaV964Launchpad .mana-v964-grid {
        display: grid !important;

        grid-template-columns:
          repeat(2,minmax(0,1fr)) !important;

        gap: 16px !important;

        width: 100% !important;

        max-width: none !important;

        align-items: stretch !important;
      }

      /* Individual cards */

      #manaV964Launchpad .mana-v964-launch {
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        height: auto !important;
      }

      #manaV964Launchpad .mana-v964-title {
        overflow-wrap: break-word;
      }

    }

    /* =====================================
       TABLET STRENGTH OVERVIEW
       ===================================== */

    @media (min-width: 701px)
           and (max-width: 900px) {

      body .wrap:has(#manaV964Launchpad) {
        max-width: 760px !important;
      }

      #manaV964Launchpad .mana-v964-grid {
        grid-template-columns:
          repeat(2,minmax(0,1fr)) !important;
      }

    }

    /* =====================================
       MOBILE

       Existing phone styling retained.
       No mobile grid overrides.
       ===================================== */

  `;

  /* ==========================================
     INSTALL CSS ONCE
     ========================================== */

  function installStyles() {
    let style =
      document.getElementById(STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    if (style.textContent !== CSS) {
      style.textContent = CSS;
    }
  }

  /* ==========================================
     ACTIVE TAB
     ========================================== */

  function activeTab() {
    const current = document.querySelector(
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

    const previous = content.querySelector(
      ".mana102980-heading"
    );

    if (previous) {
      previous.classList.remove(
        "mana102980-heading"
      );
    }

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

    const headings = content.querySelectorAll(
      "h1,h2,h3," +
      ".mana-v993-head," +
      ".mana-v981-head," +
      ".mana-v985-head"
    );

    for (const node of headings) {
      const label = (
        node.textContent || ""
      ).replace(/\s+/g, " ").trim();

      if (
        label.length < 90 &&
        pattern.test(label)
      ) {
        node.classList.add(
          "mana102980-heading"
        );
        break;
      }
    }
  }

  /* ==========================================
     LIGHTWEIGHT REFRESH
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
        if (!(event.target instanceof Element)) {
          return;
        }

        if (event.target.closest([
          "#manaV83Tabs .mana-v83-tab",
          "[data-v964-launch]",
          "[data-v978-tab]",
          "[data-v993-period]",
          "[data-v985-learn]"
        ].join(","))) {
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
      "MANA STRENGTH DESKTOP RESTORE",
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
