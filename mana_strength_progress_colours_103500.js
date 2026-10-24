
/* =====================================================
   MANA MOVEMENT TRAINING
   STRENGTH PROGRESS COLOUR POLISH
   BUILD 103500

   Complete standalone file.

   - All Progress card borders premium yellow
   - Cardio progress fill electric blue
   - Core progress fill premium gold
   - Retain existing card dimensions
   - Retain existing grid layout
   - Retain Daily / Weekly / Monthly tabs
   - Retain original data and calculations
   - No observers, timers or re-rendering
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103500";
  const STYLE_ID = "mana-strength-progress-colours-103500";

  if (document.getElementById(STYLE_ID)) return;

  const GOLD = "#F3D875";
  const CARDIO = "#368FD4";
  const CORE = "#D6A437";

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    /* =========================================
       ALL STRENGTH PROGRESS CARD BORDERS
       ========================================= */

    #manaV993StrengthProgress
    .mana-v993-metrics
    .mana-v993-metric {

      border: 1.5px solid ${GOLD} !important;
      border-color: ${GOLD} !important;

    }

    /* =========================================
       MATCH EXISTING PREMIUM CARD BACKGROUND
       ========================================= */

    #manaV993StrengthProgress
    .mana-v993-metric.mf450-cardio,

    #manaV993StrengthProgress
    .mana-v993-metric.mf450-core {

      background:
        linear-gradient(
          145deg,
          #14130d,
          #090909
        ) !important;

      border-color: ${GOLD} !important;

    }

    /* =========================================
       CONSISTENT YELLOW CARD HEADINGS
       ========================================= */

    #manaV993StrengthProgress
    .mana-v993-metrics
    .mana-v993-metric
    .mana-v993-metric-label {

      color: ${GOLD} !important;

    }

    /* =========================================
       CONSISTENT YELLOW METRIC VALUES
       ========================================= */

    #manaV993StrengthProgress
    .mana-v993-metrics
    .mana-v993-metric
    .mana-v993-metric-value {

      color: ${GOLD} !important;

    }

    /* =========================================
       CARDIO PROGRESS FILL — BLUE
       ========================================= */

    #manaV993StrengthProgress
    .mana-v993-metrics
    .mana-v993-metric.mf450-cardio
    .mana-v993-track
    .mana-v993-fill {

      background: ${CARDIO} !important;
      background-color: ${CARDIO} !important;

    }

    /* =========================================
       CORE PROGRESS FILL — GOLD
       ========================================= */

    #manaV993StrengthProgress
    .mana-v993-metrics
    .mana-v993-metric.mf450-core
    .mana-v993-track
    .mana-v993-fill {

      background: ${CORE} !important;
      background-color: ${CORE} !important;

    }

    /* =========================================
       PRESERVE EXISTING TRACKS
       ========================================= */

    #manaV993StrengthProgress
    .mana-v993-metrics
    .mana-v993-metric
    .mana-v993-track {

      background-color: #303944 !important;

    }

    /* =========================================
       NO MODIFICATIONS TO:
       - Metric grid columns
       - Card width or height
       - Card padding
       - Daily / Weekly / Monthly controls
       - Workout progress calculations
       ========================================= */

  `;

  document.head.appendChild(style);

  window.MANA_STRENGTH_PROGRESS_COLOURS_BUILD =
    BUILD;

  console.log(
    "Mana Strength Progress Colours",
    BUILD
  );

})();
