
/* ==========================================
   MANA MOVEMENT TRAINING
   HOME + PROGRESS PREMIUM POLISH
   BUILD 103050

   HOME:
   Premium yellow 2px card borders
   Larger headings
   Keep coloured text and icons
   Keep selected ticks

   PROGRESS:
   Remove purple text and borders
   Premium gold 1px internal borders
   White, grey and yellow text
   Green progress bars

   PRESERVE:
   All Overview layouts
   Mobile layout
   Bottom navigation
   Fuel and water logging
   Workout illustrations
   History line graphs
   Coach Hub
   ========================================== */

(() => {
  "use strict";

  const BUILD = "103050";

  const STYLE_ID =
    "mana-home-progress-polish-103050";

  const CSS = `

    :root {
      --mana-premium-yellow: #e6bd48;
      --mana-premium-gold: #f3d875;
      --mana-thin-border:
        rgba(230,189,72,.65);
      --mana-bar-green: #45c783;
    }

    /* =====================================
       HOME PROGRAM CARDS
       ===================================== */

    html body #manaV80Home
    .mana-v8013-program {

      border:
        2px solid
        var(--mana-premium-yellow) !important;

      border-radius:
        20px !important;

      box-shadow:
        0 0 0 1px
        rgba(230,189,72,.10),
        0 12px 28px
        rgba(0,0,0,.25) !important;

    }

    /* Selected cards remain premium yellow */

    html body #manaV80Home
    .mana-v8013-program.current {

      border:
        2px solid
        var(--mana-premium-yellow) !important;

      box-shadow:
        0 0 0 1px
        rgba(230,189,72,.16),
        0 0 14px
        rgba(230,189,72,.09) !important;

    }

    /* =====================================
       HOME HEADINGS
       MATCH PICK YOUR PLAN
       ===================================== */

    html body #manaV80Home
    .mana-v8013-program h2 {

      font-size:
        clamp(28px,6vw,34px) !important;

      font-weight:
        950 !important;

      line-height:
        1.08 !important;

      letter-spacing:
        -.035em !important;

    }

    /* Keep existing heading colours */

    /* Keep current selected tick */

    /* Keep existing Home icons */

    /* =====================================
       STRENGTH PROGRESS
       REMOVE REMAINING PURPLE BORDERS
       ===================================== */

    html body #manaV993StrengthProgress
    .mana-v993-periods,

    html body #manaV993StrengthProgress
    .mana-v993-period,

    html body #manaV993StrengthProgress
    .mana-v993-metric,

    html body #manaV993StrengthProgress
    .mana-v993-detail-btn,

    html body #manaV993StrengthProgress
    .mana-v993-panel,

    html body #manaV993StrengthProgress
    .mana-v993-summary,

    html body #manaV993StrengthProgress
    .mana-v993-row,

    html body #manaV993StrengthProgress
    .mana-v993-exercise-select {

      border:
        1px solid
        var(--mana-thin-border) !important;

      outline-color:
        var(--mana-premium-yellow) !important;

    }

    /* =====================================
       ACTIVE PROGRESS SELECTORS
       ===================================== */

    html body #manaV993StrengthProgress
    .mana-v993-period.active,

    html body #manaV993StrengthProgress
    .mana-v993-detail-btn.active {

      border-color:
        var(--mana-premium-yellow) !important;

      color:
        var(--mana-premium-gold) !important;

      background:
        #17140b !important;

      box-shadow:
        none !important;

    }

    /* =====================================
       PROGRESS TEXT
       ===================================== */

    html body #manaV993StrengthProgress
    .mana-v993-kicker,

    html body #manaV993StrengthProgress
    .mana-v993-panel-kicker,

    html body #manaV993StrengthProgress
    .mana-v993-metric-label,

    html body #manaV993StrengthProgress
    .mana-v993-metric-value,

    html body #manaV993StrengthProgress
    .mana-v993-row-value,

    html body #manaV993StrengthProgress
    .mana-v993-summary strong {

      color:
        var(--mana-premium-gold) !important;

    }

    html body #manaV993StrengthProgress
    .mana-v993-period,

    html body #manaV993StrengthProgress
    .mana-v993-detail-btn {

      color:
        var(--mana-premium-gold) !important;

    }

    html body #manaV993StrengthProgress
    .mana-v993-head h2,

    html body #manaV993StrengthProgress
    .mana-v993-panel h3 {

      color:
        #f5f5f5 !important;

    }

    html body #manaV993StrengthProgress
    .mana-v993-metric-sub,

    html body #manaV993StrengthProgress
    .mana-v993-row-sub {

      color:
        #a6a6a6 !important;

    }

    /* =====================================
       GREEN PROGRESS BARS
       MATCH FUEL
       ===================================== */

    html body #manaV993StrengthProgress
    .mana-v993-fill,

    html body #manaV83Content
    .mana-v981-fill,

    html body #manaV83Content
    .mana-v981-bar,

    html body #manaV83Content
    .mana-v939-fill {

      background:
        linear-gradient(
          90deg,
          #278b57,
          var(--mana-bar-green)
        ) !important;

    }

    /* =====================================
       MANA 28 / LYFE PROGRESS
       GOLD INTERNAL BORDER
       ===================================== */

    html body #manaV83Content
    .mana-v981-periods,

    html body #manaV83Content
    .mana-v981-period,

    html body #manaV83Content
    .mana-v981-card,

    html body #manaV83Content
    .mana-v981-overall,

    html body #manaV83Content
    .mana-v939-range,

    html body #manaV83Content
    .mana-v939-card,

    html body #manaV83Content
    .mana-v939-stat,

    html body #manaV83Content
    .mana-v939-insight {

      border-color:
        var(--mana-thin-border) !important;

      border-width:
        1px !important;

    }

    /* =====================================
       KEEP GRAPH COLOURS
       ===================================== */

    .mp-history-chart {

      border-color:
        var(--mana-thin-border) !important;

    }

    /* =====================================
       MOBILE HEADING ADJUSTMENT
       ===================================== */

    @media(max-width:600px) {

      html body #manaV80Home
      .mana-v8013-program h2 {

        font-size:
          29px !important;

        line-height:
          1.1 !important;

      }

    }

  `;

  function init() {
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

    window.MANA_HOME_PROGRESS_BUILD = BUILD;

    console.log(
      "MANA HOME + PROGRESS POLISH",
      BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once:true }
    );
  } else {
    init();
  }

})();
