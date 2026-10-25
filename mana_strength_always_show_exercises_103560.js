
/* =====================================================
   MANA MOVEMENT TRAINING
   ALWAYS-VISIBLE STRENGTH WORKOUTS
   BUILD 103570

   COMPLETE REPLACEMENT FOR:
   mana_strength_always_show_exercises_103560.js

   FIX
   Overrides the original collapsed-card rule
   in v9_64_strength_launchpad.js.

   - All exercises visible immediately
   - Start Workout always visible
   - No need to expand cards
   - Preserve yellow number pills
   - Preserve white exercise text
   - Preserve yellow workout borders
   - Preserve yellow completion ticks
   - No observers, timers or image loading
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103570";
  const STYLE_ID = "mana-strength-always-visible-103570";

  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    /* ======================================
       OVERRIDE ORIGINAL COLLAPSED RULE
       ====================================== */

    #manaV83Content
    .mana-v85-day:not(.mana-v964-expanded)
    .mana-v85-exercises,

    #manaV83Content
    .mana-v85-day.mana-v964-expanded
    .mana-v85-exercises,

    #manaV83Content
    .mana-v85-day
    .mana-v85-exercises {

      display: flex !important;
      flex-direction: column !important;

      gap: 4px !important;
      padding: 6px 18px 20px !important;

      margin: 0 !important;

      visibility: visible !important;
      opacity: 1 !important;

      border: none !important;
      outline: none !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    /* ======================================
       ALWAYS SHOW WORKOUT START BUTTON
       ====================================== */

    #manaV83Content
    .mana-v85-day:not(.mana-v964-expanded)
    .mana-v85-start,

    #manaV83Content
    .mana-v85-day.mana-v964-expanded
    .mana-v85-start,

    #manaV83Content
    .mana-v85-day
    .mana-v85-start {

      display: block !important;

      visibility: visible !important;
      opacity: 1 !important;
    }

    /* ======================================
       HIDE UNNECESSARY EXPAND CONTROLS
       ====================================== */

    #manaV83Content
    .mana-v85-day
    .mana-v964-open-label {

      display: none !important;
    }

    /* ======================================
       EXERCISE ROWS — CLEAN PRESENTATION
       ====================================== */

    #manaV83Content
    .mana-v85-day
    .mana-v85-exercise {

      display: flex !important;

      align-items: center !important;

      min-height: 43px !important;
      gap: 14px !important;

      margin: 0 !important;
      padding: 10px 12px !important;

      border: none !important;
      border-top: none !important;
      border-bottom: none !important;

      border-radius: 10px !important;

      background: transparent !important;

      color: #FFFFFF !important;
      font-size: 13px !important;
      line-height: 1.5 !important;
    }

    #manaV83Content
    .mana-v85-day
    .mana-v85-exercise > span:last-child {

      color: #FFFFFF !important;
      flex: 1;
      min-width: 0;
      overflow-wrap: anywhere;
    }

    /* ======================================
       KEEP YELLOW NUMBER PILLS
       ====================================== */

    #manaV83Content
    .mana-v85-day
    .mana-v85-num {

      display: grid !important;
      place-items: center !important;

      width: 29px !important;
      height: 29px !important;

      flex: 0 0 29px !important;

      border: 1.5px solid #F3D875 !important;

      border-radius: 10px !important;

      background:
        rgba(243,216,117,.06) !important;

      color: #F3D875 !important;
      font-size: 12px !important;
      font-weight: 900 !important;
    }

    /* ======================================
       PREMIUM YELLOW OUTER BORDER
       ====================================== */

    #manaV83Content
    .mana-v85-day,

    #manaV83Content
    .mana-v85-day:not(.mana-v964-expanded),

    #manaV83Content
    .mana-v85-day.mana-v964-expanded {

      border: 2px solid #F3D875 !important;
      border-color: #F3D875 !important;
      border-radius: 20px !important;
    }

    /* ======================================
       MOBILE
       ====================================== */

    @media (max-width:480px) {

      #manaV83Content
      .mana-v85-day
      .mana-v85-exercises {

        padding: 5px 10px 17px !important;
      }

      #manaV83Content
      .mana-v85-day
      .mana-v85-exercise {

        gap: 11px !important;
        padding: 10px 8px !important;
      }
    }

  `;

  document.head.appendChild(style);

  window.MANA_STRENGTH_ALWAYS_VISIBLE_BUILD = BUILD;

  console.log(
    "Mana Strength Always Visible",
    BUILD
  );

})();
