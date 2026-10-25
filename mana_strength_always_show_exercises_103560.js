
/* =====================================================
   MANA MOVEMENT TRAINING
   STRENGTH WORKOUTS — ALWAYS VISIBLE
   BUILD 103560

   - Show exercises on every workout card
   - Show Start Workout buttons automatically
   - Remove View Workout / Hide Workout labels
   - Preserve clean exercise list styling
   - Preserve yellow completion ticks
   - Preserve original workout functionality
   - No observers or timers
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103560";
  const STYLE_ID = "mana-strength-always-visible-103560";

  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    /* ======================================
       ALWAYS SHOW EXERCISE LIST
       ====================================== */

    #manaV83Content
    .mana-v85-day
    .mana-v85-exercises {

      display: flex !important;
      flex-direction: column !important;
      gap: 4px !important;

      padding: 6px 18px 20px !important;

      margin: 0 !important;

      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    /* ======================================
       CLEAN EXERCISE ROWS
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
      border-radius: 10px !important;

      background: transparent !important;

      color: #ffffff !important;
      font-size: 13px !important;
      line-height: 1.5 !important;
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

      background: rgba(243,216,117,.06) !important;

      color: #F3D875 !important;
      font-weight: 900 !important;
    }

    /* ======================================
       ALWAYS SHOW START WORKOUT BUTTON
       ====================================== */

    #manaV83Content
    .mana-v85-day
    .mana-v85-start {

      display: block !important;
    }

    /* ======================================
       REMOVE EXPAND / COLLAPSE LABEL
       ====================================== */

    #manaV83Content
    .mana-v85-day
    .mana-v964-open-label {

      display: none !important;
    }

    /* ======================================
       KEEP CONSISTENT PREMIUM CARD BORDERS
       ====================================== */

    #manaV83Content
    .mana-v85-day {

      border: 2px solid #F3D875 !important;
      border-color: #F3D875 !important;

      border-radius: 20px !important;
    }

    /* ======================================
       MOBILE SPACING
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
