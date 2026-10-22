
/* ==================================================
   MANA MOVEMENT TRAINING
   REFINED PREMIUM VISUAL SYSTEM
   VERSION 10.29.3
   BUILD 102930

   OVERVIEW: PRESERVE EXISTING DESIGN
   BOTTOM TABS: PRESERVE EXISTING DESIGN

   INTERNAL PAGES:
   - Fine gold borders
   - Section-coloured main headings/icons
   - Original gold, white and grey body text

   WORKOUTS: BLUE HEADING
   FUEL: GOLD HEADING
   PROGRESS: PURPLE HEADING
   LEARNING: ORANGE HEADING
   RECLAIM: GREEN HEADING

   ALL THREE PROGRAMS
   ================================================== */

(() => {
  "use strict";

  const BUILD = "102930";
  const STYLE_ID =
    "mana-v1029-semantic-colour-system";

  const GOLD = "#c8a64b";

  const COLOURS = {
    program: "#55a8de",
    routine: "#55a8de",
    fuel: "#e0bb51",
    progress: "#a681dc",
    learn: "#e98a54",
    reclaim: "#55d98b"
  };

  const SECTION_NAMES = {
    program: [
      "My Strength Program",
      "My Program",
      "Workouts",
      "Workout",
      "My Workouts"
    ],
    routine: [
      "My Routine",
      "My Program",
      "Workouts"
    ],
    fuel: [
      "Fuel",
      "My Fuel",
      "Nutrition"
    ],
    progress: [
      "Progress",
      "My Progress"
    ],
    learn: [
      "Learning",
      "Learn",
      "My Learning"
    ],
    reclaim: [
      "Reclaim"
    ]
  };

  let refreshTimer = null;
  let observer = null;
  let bound = false;

  /* ============================================
     REFINED STYLING
     ============================================ */

  function installStyles() {
    document.getElementById(STYLE_ID)?.remove();

    const style = document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `

      :root {
        --mana-refined-gold: #c8a64b;
        --mana-refined-blue: #55a8de;
        --mana-refined-purple: #a681dc;
        --mana-refined-orange: #e98a54;
        --mana-refined-green: #55d98b;
      }

      /* ======================================
         INTERNAL PAGE BORDERS
         GOLD ONLY - SUBTLE 1PX
         ====================================== */

      #manaV83Content[data-mana-refined-tab]
      .mana102930-gold-border,

      #manaV64Exercises.mana102930-workout
      .mana102930-gold-border {
        border-width: 1px !important;
        border-style: solid !important;
        border-color:
          rgba(200,166,75,.52) !important;
      }

      /* Retain the normal background.
         No gradients or fill colour changes. */

      /* ======================================
         MAIN HEADINGS
         ====================================== */

      #manaV83Content
      .mana102930-section-heading {
        color:
          var(--mana-heading-colour) !important;
      }

      #manaV83Content
      .mana102930-section-heading svg,
      #manaV83Content
      .mana102930-section-heading i {
        color:
          var(--mana-heading-colour) !important;
        stroke: currentColor !important;
      }

      /* Icons immediately associated with
         the main heading follow its colour. */

      #manaV83Content
      .mana102930-heading-icon {
        color:
          var(--mana-heading-colour) !important;
      }

      #manaV83Content
      .mana102930-heading-icon svg {
        color:
          var(--mana-heading-colour) !important;
        stroke: currentColor !important;
      }

      /* ======================================
         LEGACY COLOURED TEXT CORRECTION
         ====================================== */

      #manaV83Content[data-mana-refined-tab]
      .mana102210-accent-text,

      #manaV83Content[data-mana-refined-tab]
      .mana-v85-day-label,

      #manaV83Content[data-mana-refined-tab]
      .mana-v980-category,

      #manaV83Content[data-mana-refined-tab]
      .mana-v85-num,

      #manaV83Content[data-mana-refined-tab]
      .mana-v980-number,

      #manaV83Content[data-mana-refined-tab]
      .mana-v985-kicker,

      #manaV83Content[data-mana-refined-tab]
      .mana-v985-learn-button
      > span:last-child,

      #manaV83Content[data-mana-refined-tab]
      .mana102210-accent-icon {
        color: #f3d875 !important;
      }

      /* Main headings take precedence
         over the legacy text correction. */

      #manaV83Content
      .mana102930-section-heading,
      #manaV83Content
      .mana102930-heading-icon {
        color:
          var(--mana-heading-colour) !important;
      }

      /* ======================================
         WORKOUT EXERCISES - GOLD
         ====================================== */

      #manaV64Exercises.mana102930-workout
      .mana-v64-card,

      #manaV64Exercises.mana102930-workout
      .mana-v970-disclosure,

      #manaV64Exercises.mana102930-workout
      .mana-v970-action {
        border-color:
          rgba(200,166,75,.52) !important;
        border-width: 1px !important;
      }

      /* ======================================
         FUEL - GOLD, SAME THICKNESS
         ====================================== */

      #manaV980SharedFuel.mana102930-fuel
      .m980-meal,

      #manaV980SharedFuel.mana102930-fuel
      .m10140-meal-visual {
        border:
          1px solid rgba(200,166,75,.52)
          !important;
      }

      /* ======================================
         GREEN UPGRADE ACTION
         ====================================== */

      #manaV1017ProgramBlock
      .m1017-request {
        border:
          1px solid rgba(85,217,139,.65)
          !important;
      }

      #manaV1017ProgramBlock
      .m1017-request-btn,
      #manaV1017ProgramBlock
      #manaV1017Request {
        border:
          1px solid #55d98b !important;
        background: #164b30 !important;
        color: #ffffff !important;
      }

      #manaV1017ProgramBlock
      .m1017-request-btn:hover {
        background: #207046 !important;
      }

    `;

    document.head.appendChild(style);
  }

  /* ============================================
     DETECT ACTIVE INTERNAL TAB
     ============================================ */

  function activeTab() {
    const button = document.querySelector(
      '#manaV83Tabs ' +
      '.mana-v83-tab.active[data-v83-tab], ' +
      '#manaV83Tabs ' +
      '.mana-v83-tab[aria-selected="true"]' +
      '[data-v83-tab]'
    );

    return button?.dataset?.v83Tab || "";
  }

  /* ============================================
     REMOVE PREVIOUS DYNAMIC BORDER CLASSES
     ============================================ */

  function resetOldBorderClasses(root) {
    root.querySelectorAll(
      ".mana102920-colour-border"
    ).forEach(node => {
      node.classList.remove(
        "mana102920-colour-border"
      );
    });

    root.querySelectorAll(
      ".mana102930-gold-border, " +
      ".mana102930-section-heading, " +
      ".mana102930-heading-icon"
    ).forEach(node => {
      node.classList.remove(
        "mana102930-gold-border",
        "mana102930-section-heading",
        "mana102930-heading-icon"
      );

      node.style.removeProperty(
        "--mana-heading-colour"
      );
    });
  }

  /* ============================================
     APPLY FINE GOLD BORDERS
     ============================================ */

  function colourBorders(root) {
    const selectors = [
      ".mana-v85-day",
      ".mana-v85-exercise",
      ".mana-v980-day",
      ".mana-v980-workout",
      ".mana-v980-exercises",
      ".mana-v980-exercise",
      ".mana-v981-card",
      ".mana-v985-learn-card",
      ".mana-v933-learn-item",
      ".mana-v993-panel",
      ".mana-v993-row",
      ".mana102210-outline",
      ".mana-v927-card",
      ".mana-v978-card",
      ".m980-meal",
      ".mana-v64-card"
    ].join(",");

    root.querySelectorAll(selectors)
      .forEach(node => {
        if (
          node.closest(
            "#manaV1017ProgramBlock, " +
            "#manaV969CoachChat, " +
            "[data-mana-reclaim]"
          )
        ) return;

        node.classList.add(
          "mana102930-gold-border"
        );
      });
  }

  /* ============================================
     MAIN HEADING COLOURS
     ============================================ */

  function colourHeadings(root, tab) {
    const colour = COLOURS[tab];

    if (!colour) return;

    const headings = Array.from(
      root.querySelectorAll(
        "h1,h2,h3,.mana-v985-head," +
        ".mana-v981-head,.mana-v993-head," +
        ".mana-v85-head,.mana-v980-head"
      )
    );

    const wanted =
      SECTION_NAMES[tab] || [];

    let matches = headings.filter(node => {
      const label = (
        node.textContent || ""
      ).replace(/\s+/g, " ").trim();

      return wanted.some(name =>
        label.toLowerCase() ===
        name.toLowerCase()
      );
    });

    /* When the heading contains a subtitle,
       match its beginning instead. */

    if (!matches.length) {
      matches = headings.filter(node => {
        const label = (
          node.textContent || ""
        ).replace(/\s+/g, " ").trim();

        return wanted.some(name =>
          label.toLowerCase().startsWith(
            name.toLowerCase()
          )
        ) && label.length < 90;
      });
    }

    /* Use only the top-level matching headings.
       Do not recolour workout card titles. */

    matches.slice(0, 2).forEach(node => {
      node.classList.add(
        "mana102930-section-heading"
      );

      node.style.setProperty(
        "--mana-heading-colour",
        colour
      );

      const icon = node.querySelector(
        "svg,i,[class*='icon']"
      );

      if (icon) {
        icon.classList.add(
          "mana102930-heading-icon"
        );

        icon.style.setProperty(
          "--mana-heading-colour",
          colour
        );
      }
    });
  }

  /* ============================================
     REFRESH INTERNAL PAGES ONLY
     ============================================ */

  function refresh() {
    installStyles();

    const content =
      document.getElementById(
        "manaV83Content"
      );

    const exercises =
      document.getElementById(
        "manaV64Exercises"
      );

    const fuel =
      document.getElementById(
        "manaV980SharedFuel"
      );

    if (!content) return;

    resetOldBorderClasses(content);

    if (exercises) {
      resetOldBorderClasses(exercises);
    }

    const tab = activeTab();

    /* Overview deliberately excluded. */

    if (!COLOURS[tab]) {
      delete content.dataset.manaRefinedTab;
      content.style.removeProperty(
        "--mana-heading-colour"
      );

      exercises?.classList.remove(
        "mana102930-workout"
      );

      fuel?.classList.remove(
        "mana102930-fuel"
      );

      return;
    }

    content.dataset.manaRefinedTab = tab;

    content.style.setProperty(
      "--mana-heading-colour",
      COLOURS[tab]
    );

    colourBorders(content);
    colourHeadings(content, tab);

    const workout =
      tab === "program" ||
      tab === "routine";

    exercises?.classList.toggle(
      "mana102930-workout",
      workout
    );

    fuel?.classList.toggle(
      "mana102930-fuel",
      tab === "fuel"
    );

    if (workout && exercises) {
      colourBorders(exercises);
    }
  }

  /* ============================================
     SCHEDULED REFRESH
     ============================================ */

  function settle() {
    refresh();

    [120, 350, 700].forEach(delay => {
      setTimeout(refresh, delay);
    });
  }

  /* ============================================
     INITIALISE
     ============================================ */

  function init() {
    settle();

    if (bound) return;
    bound = true;

    [
      "mana:program-tab-change",
      "mana:program-change",
      "mana:workout-progress-change",
      "mana:recovery-updated",
      "mana:fuel-updated"
    ].forEach(name => {
      window.addEventListener(name, settle);
      document.addEventListener(name, settle);
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
          ".mana-v85-day",
          ".mana-v980-day"
        ].join(","))) {
          requestAnimationFrame(settle);
        }
      }
    );

    window.addEventListener(
      "pageshow",
      settle
    );

    window.refreshManaSemanticColours =
      settle;

    window.MANA_SEMANTIC_COLOUR_BUILD =
      BUILD;

    console.log(
      "MANA REFINED VISUAL SYSTEM",
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
