
/* ==========================================
   MANA MOVEMENT TRAINING
   MOBILE VISUAL CLEANUP
   VERSION 10.30.1
   BUILD 103010

   MOBILE ONLY

   KEEP:
   - All Overview layouts
   - Desktop Strength fix
   - Existing icon artwork
   - Bottom navigation layout
   - Workout functionality
   - Fuel logging
   - Coach Hub

   CHANGE:
   - Remove decorative icon borders
   - Remove bottom tab borders
   - Restore fine gold internal borders
   - Keep section-coloured headings
   - Keep existing gold, white, grey text
   - Preserve green upgrade button
   ========================================== */

(() => {
  "use strict";

  const BUILD = "103010";

  const STYLE_ID =
    "mana-mobile-cleanup-103010";

  const COLORS = {
    program: "#55a8de",
    routine: "#55a8de",
    fuel: "#e0bb51",
    progress: "#a681dc",
    learn: "#e98a54",
    reclaim: "#55d98b"
  };

  const CSS = `

    @media (max-width: 700px) {

      :root {
        --mm-gold:
          rgba(200,166,75,.55);

        --mm-blue:
          #55a8de;

        --mm-purple:
          #a681dc;

        --mm-orange:
          #e98a54;

        --mm-green:
          #55d98b;
      }

      /* =====================================
         BOTTOM NAVIGATION
         NO BOX BORDERS
         ===================================== */

      #manaV83Tabs
      .mana-v83-tab,

      #manaV83Tabs
      .mana-v83-tab.active,

      #manaV83Tabs
      .mana-v83-tab:hover {
        border: 0 !important;
        outline: 0 !important;
        box-shadow: none !important;
      }

      #manaV83Tabs
      .mana-v83-tab::before,

      #manaV83Tabs
      .mana-v83-tab::after {
        border: 0 !important;
        box-shadow: none !important;
      }

      /* Remove borders around bottom icons */

      #manaV83Tabs
      .m10140-tab-inner,

      #manaV83Tabs
      .m10140-tab-icon,

      #manaV83Tabs
      .m10140-tab-fallback {
        border: 0 !important;
        outline: 0 !important;
        box-shadow: none !important;
      }

      /* Keep icon artwork and its colours */

      #manaV83Tabs
      .m10140-tab-icon {
        background: transparent !important;
      }

      /* =====================================
         ALL INTERNAL CARD BORDERS
         SUBTLE GOLD
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
      #manaV83Content .mana-v927-card,
      #manaV83Content .mana102210-outline {
        border-color: var(--mm-gold) !important;
        border-width: 1px !important;
      }

      /* =====================================
         WORKOUTS
         ===================================== */

      #manaV64Exercises .mana-v64-card,
      #manaV64Exercises .mana-v970-action,
      #manaV64Exercises .mana-v970-disclosure {
        border-color: var(--mm-gold) !important;
        border-width: 1px !important;
      }

      /* =====================================
         PROGRESS
         STRENGTH
         ===================================== */

      #manaV83Content .mana-v993-periods,
      #manaV83Content .mana-v993-period,
      #manaV83Content .mana-v993-metric,
      #manaV83Content .mana-v993-detail-btn,
      #manaV83Content .mana-v993-panel,
      #manaV83Content .mana-v993-summary,
      #manaV83Content .mana-v993-row,
      #manaV83Content .mana-v993-exercise-select {
        border: 1px solid var(--mm-gold) !important;
      }

      /* MANA 28 */

      #manaV83Content .mana-v981-periods,
      #manaV83Content .mana-v981-period,
      #manaV83Content .mana-v981-overall,
      #manaV83Content .mana-v981-card {
        border: 1px solid var(--mm-gold) !important;
      }

      /* MANA LYFE */

      #manaV83Content .mana-v939-range,
      #manaV83Content .mana-v939-card,
      #manaV83Content .mana-v939-stat,
      #manaV83Content .mana-v939-insight,
      #manaV83Content .mana-v939-recent-row {
        border-color: var(--mm-gold) !important;
        border-width: 1px !important;
      }

      /* =====================================
         LEARNING
         ===================================== */

      #manaV83Content .mana-v985-learn-card,
      #manaV83Content .mana-v985-learn-button,
      #manaV933Life .mana-v933-learn-item,
      #manaV933Life .mana-v933-learn-button {
        border-color: var(--mm-gold) !important;
        border-width: 1px !important;
      }

      /* =====================================
         INNER PAGE ICON FRAMES
         REMOVE BORDERS, NOT ICONS
         ===================================== */

      #manaV83Content
      .m1028-section-icon,

      #manaV83Content
      .m1028-progress-icon,

      #manaV83Content
      .m1028-learning-icon,

      #manaV83Content
      .mana-v981-icon,

      #manaV83Content
      .mana-v985-head-icon,

      #manaV83Content
      .m10140-fuel-panel-icon {
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
      }

      /* Preserve the original icon imagery */

      #manaV83Content
      .m1028-section-icon img,

      #manaV83Content
      .m1028-progress-icon img,

      #manaV83Content
      .m1028-learning-icon img {
        border: none !important;
        box-shadow: none !important;
      }

      /* =====================================
         MAIN HEADINGS
         ===================================== */

      #manaV83Content
      .mana103010-heading {
        color:
          var(--mana-mobile-heading)
          !important;
      }

      #manaV83Content
      .mana103010-heading svg {
        color:
          var(--mana-mobile-heading)
          !important;
        stroke: currentColor !important;
      }

      /* =====================================
         GREEN NEXT BLOCK UPGRADE
         ===================================== */

      #manaV1017ProgramBlock
      .m1017-request-btn,

      #manaV1017ProgramBlock
      #manaV1017Request {
        background: #164b30 !important;
        border: 1px solid #55d98b !important;
        color: #ffffff !important;
      }

    }

  `;

  /* ==========================================
     INSTALL STYLES ONCE
     ========================================== */

  function install() {
    let style = document.getElementById(
      STYLE_ID
    );

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }
  }

  /* ==========================================
     ACTIVE TAB
     ========================================== */

  function activeTab() {
    const button = document.querySelector(
      '#manaV83Tabs .mana-v83-tab.active[data-v83-tab], ' +
      '#manaV83Tabs .mana-v83-tab[aria-selected="true"][data-v83-tab]'
    );

    return button?.dataset?.v83Tab || "";
  }

  /* ==========================================
     HEADING COLOUR
     ========================================== */

  function syncHeading() {
    const content =
      document.getElementById(
        "manaV83Content"
      );

    if (!content) return;

    const tab = activeTab();
    const colour = COLORS[tab];

    content.style.setProperty(
      "--mana-mobile-heading",
      colour || "#f3d875"
    );

    content.querySelectorAll(
      ".mana103010-heading"
    ).forEach(node => {
      node.classList.remove(
        "mana103010-heading"
      );
    });

    if (!colour || tab === "overview") {
      return;
    }

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
      "h1,h2,h3,.mana-v993-head," +
      ".mana-v981-head,.mana-v985-head"
    );

    for (const node of headings) {
      const text = (
        node.textContent || ""
      ).replace(/\s+/g, " ").trim();

      if (
        text.length < 90 &&
        pattern.test(text)
      ) {
        node.classList.add(
          "mana103010-heading"
        );
        break;
      }
    }
  }

  /* ==========================================
     LIGHTWEIGHT REFRESH
     ========================================== */

  let pending = false;

  function scheduleSync() {
    if (pending) return;

    pending = true;

    requestAnimationFrame(() => {
      pending = false;
      syncHeading();
    });
  }

  /* ==========================================
     INITIALISE
     ========================================== */

  function init() {
    install();
    syncHeading();

    [
      "mana:program-tab-change",
      "mana:program-change",
      "mana:workout-progress-change"
    ].forEach(name => {
      document.addEventListener(name, scheduleSync);
      window.addEventListener(name, scheduleSync);
    });

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) return;

        if (event.target.closest(
          "#manaV83Tabs .mana-v83-tab, " +
          "[data-v985-learn], " +
          "[data-v993-period]"
        )) {
          scheduleSync();
        }
      }
    );

    window.addEventListener(
      "pageshow",
      scheduleSync
    );

    window.MANA_MOBILE_COLOUR_BUILD =
      BUILD;

    console.log(
      "MANA MOBILE CLEANUP",
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
