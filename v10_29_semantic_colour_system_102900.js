
/* ==========================================
   MANA MOVEMENT TRAINING
   REFINED VISUAL + DESKTOP STABILITY
   VERSION 10.29.4
   BUILD 102940

   Preserve:
   - Overview colours and icons
   - Bottom navigation colours and icons
   - All program functionality

   Internal pages:
   - Subtle gold borders
   - Coloured primary section headings
   - Existing white / gold / grey text

   Desktop:
   - Wider program shell
   - Responsive Overview cards

   Stability:
   - Install CSS once
   - No repeated style removal
   - No MutationObserver repaint loop
   ========================================== */

(() => {
  "use strict";

  const BUILD = "102940";

  const STYLE_ID =
    "mana-v1029-semantic-colour-system";

  if (window.MANA_SEMANTIC_COLOUR_BUILD === BUILD) {
    return;
  }

  const COLORS = {
    program: "#55a8de",
    routine: "#55a8de",
    fuel: "#e0bb51",
    progress: "#a681dc",
    learn: "#e98a54",
    reclaim: "#55d98b"
  };

  function installStyles() {

    if (document.getElementById(STYLE_ID)) {
      document.getElementById(STYLE_ID).remove();
    }

    const style = document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `

      :root {
        --mana-refined-border:
          rgba(200,166,75,.52);
        --mana-refined-gold: #f3d875;
        --mana-refined-blue: #55a8de;
        --mana-refined-purple: #a681dc;
        --mana-refined-orange: #e98a54;
        --mana-refined-green: #55d98b;
      }

      /* =====================================
         DESKTOP PROGRAM WIDTH
         ===================================== */

      @media (min-width: 901px) {

        body .wrap:has(#manaV83Tabs) {
          max-width: 1100px !important;
          width: 100% !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        #manaV83ProgramShell {
          width: 100% !important;
          max-width: 1100px !important;
        }

        #manaV83Content {
          width: 100% !important;
          max-width: none !important;
          min-width: 0 !important;
        }

        /* Strength Overview */

        #manaV964Launchpad {
          width: 100% !important;
          max-width: none !important;
          display: grid !important;
          grid-template-columns:
            repeat(3,minmax(0,1fr)) !important;
          gap: 16px !important;
        }

        #manaV964Launchpad .mana-v964-launch {
          min-width: 0 !important;
          width: 100% !important;
          overflow: hidden !important;
        }

        /* Mana 28 / Mana Lyfe Overview */

        .mana-v978-launchpad {
          width: 100% !important;
          max-width: none !important;
          display: grid !important;
          grid-template-columns:
            repeat(3,minmax(0,1fr)) !important;
          gap: 16px !important;
        }

        .mana-v978-launchpad .mana-v978-launch {
          min-width: 0 !important;
          width: 100% !important;
        }

        #manaV964Launchpad .mana-v964-title,
        .mana-v978-launchpad .mana-v978-title {
          overflow-wrap: anywhere;
        }

      }

      @media (min-width: 701px)
             and (max-width: 900px) {

        body .wrap:has(#manaV83Tabs) {
          max-width: 800px !important;
        }

        #manaV964Launchpad,
        .mana-v978-launchpad {
          grid-template-columns:
            repeat(2,minmax(0,1fr)) !important;
        }

      }

      /* =====================================
         SUBTLE GOLD INTERNAL BORDERS
         ===================================== */

      #manaV83Content[data-mana-refined-tab]
      .mana102940-gold-border {
        border-width: 1px !important;
        border-style: solid !important;
        border-color:
          var(--mana-refined-border) !important;
      }

      /* WORKOUTS */

      #manaV83Content .mana-v85-day,
      #manaV83Content .mana-v85-exercise,
      #manaV83Content .mana-v980-day,
      #manaV83Content .mana-v980-workout,
      #manaV83Content .mana-v980-exercises,
      #manaV83Content .mana-v980-exercise,
      #manaV64Exercises .mana-v64-card,
      #manaV64Exercises .mana-v970-disclosure,
      #manaV64Exercises .mana-v970-action {
        border-color:
          var(--mana-refined-border) !important;
        border-width: 1px !important;
      }

      /* FUEL */

      #manaV980SharedFuel .m980-meal,
      #manaV980SharedFuel .m10140-meal-visual,
      #manaV980SharedFuel .m10140-fuel-panel-icon {
        border:
          1px solid var(--mana-refined-border)
          !important;
      }

      /* =====================================
         STRENGTH PROGRESS - GOLD BORDERS
         ===================================== */

      #manaV83Content .mana-v993-periods,
      #manaV83Content .mana-v993-period,
      #manaV83Content .mana-v993-metric,
      #manaV83Content .mana-v993-detail-btn,
      #manaV83Content .mana-v993-panel,
      #manaV83Content .mana-v993-summary,
      #manaV83Content .mana-v993-row,
      #manaV83Content .mana-v993-exercise-select {
        border:
          1px solid var(--mana-refined-border)
          !important;
      }

      /* MANA 28 PROGRESS */

      #manaV83Content .mana-v981-periods,
      #manaV83Content .mana-v981-period,
      #manaV83Content .mana-v981-overall,
      #manaV83Content .mana-v981-card {
        border:
          1px solid var(--mana-refined-border)
          !important;
      }

      /* MANA LYFE PROGRESS */

      #manaV83Content .mana-v939-range,
      #manaV83Content .mana-v939-card,
      #manaV83Content .mana-v939-stat,
      #manaV83Content .mana-v939-insight,
      #manaV83Content .mana-v939-recent-row {
        border-color:
          var(--mana-refined-border) !important;
        border-width: 1px !important;
      }

      /* =====================================
         LEARNING - GOLD BORDERS
         ===================================== */

      #manaV83Content .mana-v985-learn-card,
      #manaV933Life .mana-v933-learn-item {
        border:
          1px solid var(--mana-refined-border)
          !important;
      }

      /* =====================================
         SECTION HEADINGS
         ===================================== */

      #manaV83Content
      .mana102940-heading {
        color: var(--mana-heading-colour)
          !important;
      }

      #manaV83Content
      .mana102940-heading svg,
      #manaV83Content
      .mana102940-heading i {
        color: var(--mana-heading-colour)
          !important;
        stroke: currentColor !important;
      }

      /* Progress primary headings only */

      #manaV83Content[data-mana-refined-tab="progress"]
      .mana-v993-head h1,
      #manaV83Content[data-mana-refined-tab="progress"]
      .mana-v993-head h2,
      #manaV83Content[data-mana-refined-tab="progress"]
      .mana-v981-head h1,
      #manaV83Content[data-mana-refined-tab="progress"]
      .mana-v981-head h2 {
        color:
          var(--mana-refined-purple) !important;
      }

      /* Restore ordinary progress labels */

      #manaV83Content .mana-v993-metric,
      #manaV83Content .mana-v993-detail-btn,
      #manaV83Content .mana-v993-period,
      #manaV83Content .mana-v981-card,
      #manaV83Content .mana-v939-card {
        --mana-section-border:
          var(--mana-refined-border);
      }

      /* =====================================
         GREEN PROGRAM UPGRADE
         ===================================== */

      #manaV1017ProgramBlock .m1017-request {
        border:
          1px solid var(--mana-refined-border)
          !important;
      }

      #manaV1017ProgramBlock .m1017-request-btn,
      #manaV1017ProgramBlock #manaV1017Request {
        border: 1px solid #55d98b !important;
        background: #164b30 !important;
        color: #ffffff !important;
      }

      #manaV1017ProgramBlock .m1017-request-btn:hover {
        background: #207046 !important;
      }

      /* =====================================
         PROTECT ORIGINAL OVERVIEW + NAV
         No colour overrides applied here.
         ===================================== */

    `;

    document.head.appendChild(style);
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
     DYNAMIC INTERNAL STYLING
     ========================================== */

  function sync() {

    const content =
      document.getElementById(
        "manaV83Content"
      );

    if (!content) return;

    const tab = activeTab();

    const previous =
      content.dataset.manaRefinedTab || "";

    if (previous !== tab) {
      content.dataset.manaRefinedTab = tab;
    }

    const colour = COLORS[tab];

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

    /* Main heading only.
       Do not recolour ordinary body text. */

    const candidates = content.querySelectorAll(
      "h1,h2,h3,.mana-v993-head," +
      ".mana-v981-head,.mana-v985-head"
    );

    const expressions = {
      program:
        /^(my strength program|my program|workouts|my workouts)/i,
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

    const match = expressions[tab];

    content.querySelectorAll(
      ".mana102940-heading"
    ).forEach(node => {
      node.classList.remove(
        "mana102940-heading"
      );
    });

    if (match) {

      for (const node of candidates) {

        const label = (
          node.textContent || ""
        ).replace(/\s+/g," ").trim();

        if (
          label.length < 80 &&
          match.test(label)
        ) {
          node.classList.add(
            "mana102940-heading"
          );
          break;
        }
      }
    }
  }

  /* ==========================================
     INSTALL ONCE
     ========================================== */

  function init() {

    installStyles();
    sync();

    [
      "mana:program-tab-change",
      "mana:program-change",
      "mana:workout-progress-change",
      "mana:fuel-updated"
    ].forEach(name => {
      window.addEventListener(name, sync);
      document.addEventListener(name, sync);
    });

    document.addEventListener(
      "click",
      event => {

        if (!(event.target instanceof Element)) {
          return;
        }

        if (event.target.closest(
          "#manaV83Tabs .mana-v83-tab, " +
          "[data-v964-launch], " +
          "[data-v978-tab]"
        )) {
          requestAnimationFrame(sync);
        }
      }
    );

    window.addEventListener(
      "pageshow",
      sync
    );

    window.refreshManaSemanticColours =
      sync;

    window.MANA_SEMANTIC_COLOUR_BUILD =
      BUILD;

    console.log(
      "MANA REFINED DESKTOP SYSTEM",
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
