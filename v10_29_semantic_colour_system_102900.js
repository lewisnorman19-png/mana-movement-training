
/* ===========================================
   MANA MOVEMENT TRAINING
   STABLE PREMIUM VISUAL SYSTEM
   VERSION 10.29.6
   BUILD 102960

   OVERVIEW:
   Keep existing card colours.

   BOTTOM NAV:
   No outside borders.
   Keep coloured icons and labels.

   INTERNAL PAGES:
   Subtle gold borders, 1px.

   HEADINGS:
   Workout blue
   Fuel gold
   Progress purple
   Learning orange
   Reclaim green

   Keep workout, coach and fuel functions.
   =========================================== */

(() => {
  "use strict";

  const BUILD = "102960";

  const STYLE_ID =
    "mana-v1029-semantic-colour-system";

  const GOLD = "rgba(200,166,75,.52)";

  const COLOURS = {
    program: "#55a8de",
    routine: "#55a8de",
    fuel: "#e0bb51",
    progress: "#a681dc",
    learn: "#e98a54",
    reclaim: "#55d98b"
  };

  const HEADINGS = {
    program: /^(my strength program|my program|workouts|my workouts)/i,
    routine: /^(my routine|my program|workouts)/i,
    fuel: /^(fuel|my fuel|nutrition)/i,
    progress: /^(your progress|my progress|progress)/i,
    learn: /^(learning|my learning|learn)/i,
    reclaim: /^reclaim/i
  };

  let styleElement = null;
  let headObserver = null;
  let navigationFrame = null;

  /* ===========================================
     CSS: ONE PERMANENT STYLESHEET
     =========================================== */

  const CSS = `

    :root {
      --mana-clean-gold: rgba(200,166,75,.52);
      --mana-clean-blue: #55a8de;
      --mana-clean-purple: #a681dc;
      --mana-clean-orange: #e98a54;
      --mana-clean-green: #55d98b;
    }

    /* =======================================
       BOTTOM TABS
       REMOVE OUTSIDE BORDERS ONLY
       ======================================= */

    #manaV83Tabs .mana-v83-tab,
    #manaV83Tabs .mana-v83-tab.active,
    #manaV83Tabs .mana-v83-tab:hover {
      border: 0 !important;
      border-color: transparent !important;
      outline: 0 !important;
      box-shadow: none !important;
      background: #080808 !important;
    }

    #manaV83Tabs .mana-v83-tab::before,
    #manaV83Tabs .mana-v83-tab::after {
      border: 0 !important;
      box-shadow: none !important;
    }

    /* Preserve coloured labels and artwork.
       Do not force SVG, image or label colours. */

    /* =======================================
       INTERNAL GOLD CARD BORDERS
       ======================================= */

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
    #manaV83Content .mana-v927-card,
    #manaV83Content .mana102210-outline,
    #manaV83Content .mana102930-gold-border,
    #manaV83Content .mana102920-colour-border,
    #manaV83Content .mana102940-gold-border {
      border: 1px solid
        var(--mana-clean-gold) !important;
    }

    /* =======================================
       PROGRESS - STRENGTH
       GOLD BORDERS
       ======================================= */

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

    /* MANA 28 PROGRESS */

    #manaV83Content .mana-v981-periods,
    #manaV83Content .mana-v981-period,
    #manaV83Content .mana-v981-overall,
    #manaV83Content .mana-v981-card {
      border: 1px solid
        var(--mana-clean-gold) !important;
    }

    /* MANA LYFE PROGRESS */

    #manaV83Content .mana-v939-range,
    #manaV83Content .mana-v939-card,
    #manaV83Content .mana-v939-stat,
    #manaV83Content .mana-v939-insight,
    #manaV83Content .mana-v939-recent-row {
      border-color:
        var(--mana-clean-gold) !important;
      border-width: 1px !important;
    }

    /* =======================================
       LEARNING - GOLD BORDERS
       ======================================= */

    #manaV83Content .mana-v985-learn-card,
    #manaV933Life .mana-v933-learn-item,
    #manaV83Content .mana-v985-learn-button,
    #manaV933Life .mana-v933-learn-button {
      border-color:
        var(--mana-clean-gold) !important;
      border-width: 1px !important;
    }

    #manaV83Content .mana-v985-head {
      border-bottom-color:
        var(--mana-clean-gold) !important;
    }

    /* =======================================
       FUEL - FINE GOLD OUTLINES
       ======================================= */

    #manaV980SharedFuel .m980-meal,
    #manaV980SharedFuel .m10140-meal-visual,
    #manaV980SharedFuel .m10140-fuel-panel-icon {
      border: 1px solid
        var(--mana-clean-gold) !important;
    }

    /* =======================================
       WORKOUTS - FINE GOLD OUTLINES
       ======================================= */

    #manaV64Exercises .mana-v64-card,
    #manaV64Exercises .mana-v970-disclosure,
    #manaV64Exercises .mana-v970-action {
      border-color:
        var(--mana-clean-gold) !important;
      border-width: 1px !important;
    }

    /* =======================================
       MAIN SECTION HEADING COLOUR
       ======================================= */

    #manaV83Content .mana102960-heading {
      color:
        var(--mana-heading-colour) !important;
    }

    #manaV83Content
    .mana102960-heading svg,
    #manaV83Content
    .mana102960-heading i {
      color:
        var(--mana-heading-colour) !important;
      stroke: currentColor !important;
    }

    /* =======================================
       RESTORE STANDARD BODY COLOURS
       ======================================= */

    #manaV83Content .mana102210-accent-text,
    #manaV83Content .mana-v85-day-label,
    #manaV83Content .mana-v980-category,
    #manaV83Content .mana-v85-num,
    #manaV83Content .mana-v980-number,
    #manaV83Content .mana-v985-kicker,
    #manaV83Content .mana-v985-learn-button
      > span:last-child,
    #manaV933Life .mana-v933-learn-button
      > span:last-child {
      color: #f3d875 !important;
    }

    #manaV83Content .mana102210-accent-icon,
    #manaV83Content .mana102210-accent-icon svg {
      color: #f3d875 !important;
    }

    /* =======================================
       GREEN UPGRADE BUTTON
       ======================================= */

    #manaV1017ProgramBlock .m1017-request {
      border: 1px solid
        var(--mana-clean-gold) !important;
    }

    #manaV1017ProgramBlock .m1017-request-btn,
    #manaV1017ProgramBlock #manaV1017Request {
      border: 1px solid
        var(--mana-clean-green) !important;
      color: #ffffff !important;
      background: #164b30 !important;
    }

    #manaV1017ProgramBlock .m1017-request-btn:hover {
      background: #207046 !important;
    }

    /* =======================================
       LAPTOP - WIDER PROGRAM SHELL
       ======================================= */

    @media (min-width: 901px) {

      body .wrap:has(#manaV83Tabs) {
        max-width: 1100px !important;
        width: 100% !important;
        margin-inline: auto !important;
      }

      #manaV83ProgramShell,
      #manaV83Content {
        max-width: 1100px !important;
        width: 100% !important;
        min-width: 0 !important;
      }

      /* Keep the actual overview containers intact.
         Only their card grids become three columns. */

      #manaV964Launchpad,
      .mana-v978-launchpad {
        display: block !important;
        max-width: none !important;
        width: 100% !important;
      }

      #manaV964Launchpad .mana-v964-grid,
      .mana-v978-grid {
        display: grid !important;
        grid-template-columns:
          repeat(3,minmax(0,1fr)) !important;
        gap: 16px !important;
        width: 100% !important;
      }

      #manaV964Launchpad .mana-v964-launch,
      .mana-v978-launchpad .mana-v978-launch {
        width: 100% !important;
        min-width: 0 !important;
      }

    }

  `;

  /* ===========================================
     STABLE STYLESHEET MANAGEMENT

     Reuse the same element instead of
     deleting and recreating styles.
     =========================================== */

  function installStyles() {
    styleElement =
      document.getElementById(STYLE_ID);

    if (!styleElement) {
      styleElement =
        document.createElement("style");

      styleElement.id = STYLE_ID;
    }

    if (styleElement.textContent !== CSS) {
      styleElement.textContent = CSS;
    }

    if (!styleElement.isConnected) {
      document.head.appendChild(styleElement);
    }
  }

  /* ===========================================
     KEEP FINAL STYLESHEET IN CASCADE ORDER

     Older Mana modules may append styles.
     Move the same element, without rewriting
     its CSS or touching the page content.
     =========================================== */

  function watchStyles() {
    if (headObserver) return;

    headObserver = new MutationObserver(records => {
      const addedStyle = records.some(record =>
        Array.from(record.addedNodes).some(node =>
          node instanceof HTMLStyleElement ||
          (
            node instanceof HTMLLinkElement &&
            node.rel === "stylesheet"
          )
        )
      );

      if (!addedStyle) return;

      if (
        styleElement &&
        document.head.lastElementChild !== styleElement
      ) {
        document.head.appendChild(styleElement);
      }
    });

    headObserver.observe(document.head, {
      childList: true
    });
  }

  /* ===========================================
     ACTIVE SECTION
     =========================================== */

  function activeTab() {
    const button = document.querySelector(
      '#manaV83Tabs ' +
      '.mana-v83-tab.active[data-v83-tab], ' +
      '#manaV83Tabs ' +
      '.mana-v83-tab[aria-selected="true"][data-v83-tab]'
    );

    return button?.dataset?.v83Tab || "";
  }

  /* ===========================================
     UPDATE HEADING ONLY
     =========================================== */

  function syncHeadings() {
    const content =
      document.getElementById("manaV83Content");

    if (!content) return;

    const tab = activeTab();
    const colour = COLOURS[tab];

    content.style.setProperty(
      "--mana-heading-colour",
      colour || "#f3d875"
    );

    const previous = content.querySelectorAll(
      ".mana102960-heading"
    );

    previous.forEach(node => {
      node.classList.remove("mana102960-heading");
    });

    if (!colour) return;

    const expression = HEADINGS[tab];

    if (!expression) return;

    const candidates = content.querySelectorAll(
      "h1,h2,h3,.mana-v993-head," +
      ".mana-v981-head,.mana-v985-head"
    );

    for (const node of candidates) {
      const label = (
        node.textContent || ""
      ).replace(/\s+/g, " ").trim();

      if (
        label.length < 90 &&
        expression.test(label)
      ) {
        node.classList.add(
          "mana102960-heading"
        );
        break;
      }
    }
  }

  /* ===========================================
     LIGHTWEIGHT NAVIGATION REFRESH
     =========================================== */

  function scheduleSync() {
    if (navigationFrame !== null) {
      cancelAnimationFrame(navigationFrame);
    }

    navigationFrame = requestAnimationFrame(() => {
      navigationFrame = null;
      syncHeadings();
    });
  }

  function init() {
    installStyles();
    watchStyles();
    syncHeadings();

    const events = [
      "mana:program-tab-change",
      "mana:program-change",
      "mana:workout-progress-change",
      "mana:fuel-updated"
    ];

    events.forEach(name => {
      document.addEventListener(
        name,
        scheduleSync
      );

      window.addEventListener(
        name,
        scheduleSync
      );
    });

    document.addEventListener("click", event => {
      if (!(event.target instanceof Element)) {
        return;
      }

      if (event.target.closest(
        [
          "#manaV83Tabs .mana-v83-tab",
          "[data-v964-launch]",
          "[data-v978-tab]",
          "[data-v993-period]",
          "[data-v985-learn]"
        ].join(",")
      )) {
        scheduleSync();
      }
    });

    window.addEventListener(
      "pageshow",
      scheduleSync
    );

    window.refreshManaSemanticColours =
      scheduleSync;

    window.MANA_SEMANTIC_COLOUR_BUILD =
      BUILD;

    console.log(
      "MANA STABLE PREMIUM SYSTEM",
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
