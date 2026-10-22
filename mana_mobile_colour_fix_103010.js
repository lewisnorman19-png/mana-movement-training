
/* ===================================================
   MANA MOVEMENT TRAINING
   UNIFIED PREMIUM GOLD DESIGN
   VERSION 10.30.2
   BUILD 103020

   ONE COLOUR STANDARD FOR ALL THREE PROGRAMS

   CARDS / PANELS:
   Thin subtle yellow-gold borders

   BOTTOM NAV:
   No tab borders
   No icon borders
   Existing coloured icons retained

   TEXT:
   Gold / white / grey

   PRESERVE:
   - Strength desktop two-column layout
   - Mana 28 desktop layout
   - Mana Lyfe desktop layout
   - Phone layouts
   - Overview content and artwork
   - Workout exercise illustrations
   - Program functionality
   - Fuel logging
   - Coach Hub
   - Next-block upgrade

   NO:
   - New layout grids
   - Repeated stylesheet replacement
   - Timed colour refresh loops
   - MutationObserver repaint loops
   =================================================== */

(() => {
  "use strict";

  const BUILD = "103020";

  const STYLE_ID = "mana-mobile-cleanup-103010";

  const CSS = `

    :root {
      --mana-unified-gold:
        rgba(212,175,55,.62);

      --mana-unified-gold-text:
        #f3d875;

      --mana-unified-green:
        #55d98b;
    }

    /* ==========================================
       1. BOTTOM NAVIGATION

       Remove all coloured rectangular borders.
       Keep original icons, labels and layout.
       ========================================== */

    html body #manaV83Tabs
    .mana-v83-tab[data-v83-tab],

    html body #manaV83Tabs
    .mana-v83-tab[data-v83-tab].active,

    html body #manaV83Tabs
    .mana-v83-tab[data-v83-tab]:hover {

      border:
        0 none transparent !important;

      border-width:
        0 !important;

      outline:
        none !important;

      box-shadow:
        none !important;

      background:
        transparent !important;

    }

    /* Remove decorative tab box layers */

    html body #manaV83Tabs
    .mana-v83-tab[data-v83-tab]::before,

    html body #manaV83Tabs
    .mana-v83-tab[data-v83-tab]::after {

      border:
        0 !important;

      outline:
        0 !important;

      box-shadow:
        none !important;

    }

    /* Remove frames around tab artwork */

    html body #manaV83Tabs
    .m10140-tab-inner,

    html body #manaV83Tabs
    .m10140-tab-icon,

    html body #manaV83Tabs
    .m10140-tab-fallback,

    html body #manaV83Tabs
    .m1025-custom-tab-icon,

    html body #manaV83Tabs
    .mana-v83-tab img,

    html body #manaV83Tabs
    .mana-v83-tab svg {

      border:
        0 !important;

      outline:
        none !important;

      box-shadow:
        none !important;

    }

    /* Original icon images remain visible */

    #manaV83Tabs .m10140-tab-icon {
      background:
        transparent !important;
    }

    /* Keep active indication and icon artwork.
       Do not override icon colours or labels. */

    /* ==========================================
       2. ALL OVERVIEW CARD BORDERS

       Do not change layout, sizing or spacing.
       Only the decorative outlines become gold.
       ========================================== */

    html body #manaV964Launchpad
    .mana-v964-launch,

    html body .mana-v978-launchpad
    .mana-v978-launch {

      border:
        1px solid
        var(--mana-unified-gold) !important;

    }

    /* Overview icon artwork and its internal
       frame retain their original design.
       Their coloured glow is not altered. */

    /* ==========================================
       3. WORKOUT PAGES

       Fine gold border on every main card.
       ========================================== */

    html body #manaV83Content
    .mana-v85-day,

    html body #manaV83Content
    .mana-v85-exercise,

    html body #manaV83Content
    .mana-v980-day,

    html body #manaV83Content
    .mana-v980-workout,

    html body #manaV83Content
    .mana-v980-exercises,

    html body #manaV83Content
    .mana-v980-exercise,

    html body #manaV64Exercises
    .mana-v64-card,

    html body #manaV64Exercises
    .mana-v970-disclosure,

    html body #manaV64Exercises
    .mana-v970-action {

      border-color:
        var(--mana-unified-gold) !important;

      border-width:
        1px !important;

    }

    /* Workout inputs retain their functionality */

    html body #manaV64Exercises
    input,

    html body #manaV64Exercises
    select {

      border-color:
        var(--mana-unified-gold) !important;

      border-width:
        1px !important;

    }

    /* ==========================================
       4. STRENGTH PROGRESS

       Daily / Weekly / Monthly
       Summary metrics
       Progress detail buttons
       Exercise data
       ========================================== */

    html body #manaV83Content
    .mana-v993-periods,

    html body #manaV83Content
    .mana-v993-period,

    html body #manaV83Content
    .mana-v993-metric,

    html body #manaV83Content
    .mana-v993-detail-btn,

    html body #manaV83Content
    .mana-v993-panel,

    html body #manaV83Content
    .mana-v993-summary,

    html body #manaV83Content
    .mana-v993-row,

    html body #manaV83Content
    .mana-v993-exercise-select {

      border:
        1px solid
        var(--mana-unified-gold) !important;

    }

    /* ==========================================
       5. MANA 28 PROGRESS
       ========================================== */

    html body #manaV83Content
    .mana-v981-periods,

    html body #manaV83Content
    .mana-v981-period,

    html body #manaV83Content
    .mana-v981-overall,

    html body #manaV83Content
    .mana-v981-card {

      border:
        1px solid
        var(--mana-unified-gold) !important;

    }

    /* ==========================================
       6. MANA LYFE PROGRESS
       ========================================== */

    html body #manaV83Content
    .mana-v939-range,

    html body #manaV83Content
    .mana-v939-card,

    html body #manaV83Content
    .mana-v939-stat,

    html body #manaV83Content
    .mana-v939-insight,

    html body #manaV83Content
    .mana-v939-recent-row {

      border-color:
        var(--mana-unified-gold) !important;

      border-width:
        1px !important;

    }

    /* ==========================================
       7. LEARNING

       All Learning cards and buttons gold.
       No purple / orange border outlines.
       ========================================== */

    html body #manaV83Content
    .mana-v985-learn-card,

    html body #manaV83Content
    .mana-v985-learn-button,

    html body #manaV933Life
    .mana-v933-learn-item,

    html body #manaV933Life
    .mana-v933-learn-button {

      border:
        1px solid
        var(--mana-unified-gold) !important;

    }

    html body #manaV83Content
    .mana-v985-head {

      border-bottom-color:
        var(--mana-unified-gold) !important;

    }

    /* ==========================================
       8. FUEL

       Same thin border across all meal cards.
       ========================================== */

    html body #manaV980SharedFuel
    .m980-meal,

    html body #manaV980SharedFuel
    .m10140-meal-visual,

    html body #manaV980SharedFuel
    .m10140-fuel-panel-icon {

      border:
        1px solid
        var(--mana-unified-gold) !important;

    }

    /* ==========================================
       9. SHARED LEGACY COLOUR CLASSES

       Remove remaining coloured card borders
       from previous visual upgrades.
       ========================================== */

    html body #manaV83Content
    .mana102210-outline,

    html body #manaV83Content
    .mana102920-colour-border,

    html body #manaV83Content
    .mana102930-gold-border,

    html body #manaV83Content
    .mana102940-gold-border {

      border-color:
        var(--mana-unified-gold) !important;

      border-width:
        1px !important;

    }

    /* ==========================================
       10. EXISTING SECTION HEADINGS

       No additional heading recolouring.
       Icons remain the colour identifiers.
       ========================================== */

    /* No typography overrides required. */

    /* ==========================================
       11. NEXT PROGRAM BLOCK

       Keep this action green.
       ========================================== */

    html body #manaV1017ProgramBlock
    .m1017-request {

      border:
        1px solid
        var(--mana-unified-gold) !important;

    }

    html body #manaV1017ProgramBlock
    .m1017-request-btn,

    html body #manaV1017ProgramBlock
    #manaV1017Request {

      background:
        #164b30 !important;

      border:
        1px solid
        var(--mana-unified-green) !important;

      color:
        #ffffff !important;

    }

    html body #manaV1017ProgramBlock
    .m1017-request-btn:hover {

      background:
        #207046 !important;

    }

    /* ==========================================
       12. PRESERVE ALL RESPONSIVE LAYOUTS

       No media queries that change:
       width / display / grid / position.
       ========================================== */

  `;

  /* ==========================================
     INSTALL ONCE
     ========================================== */

  function install() {

    let style = document.getElementById(
      STYLE_ID
    );

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
     INITIALISE

     No timers.
     No DOM mutation loops.
     No repeated refresh.
     ========================================== */

  function init() {

    install();

    window.MANA_MOBILE_COLOUR_BUILD = BUILD;

    window.MANA_UNIFIED_GOLD_BUILD = BUILD;

    console.log(
      "MANA UNIFIED GOLD DESIGN",
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
