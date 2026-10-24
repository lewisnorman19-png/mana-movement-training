
/* ============================================
   MANA MOVEMENT TRAINING
   WORKOUT GOLD + VISUAL STABILITY
   BUILD 103230

   MANA 28 / MANA LYFE

   UNFINISHED
   - Premium yellow card borders
   - Premium yellow number borders
   - Premium yellow number text
   - Matching subtle side accent

   COMPLETED
   - Green card border
   - Green number/check
   - Existing saved completion state

   PERFORMANCE
   - Styles installed once
   - No timers
   - No MutationObserver
   - No DOM reconstruction
   - No additional click listeners

   Does not modify:
   Mana Strength, Fuel, Progress,
   Routine, Reset or Learning.
   ============================================ */

(() => {
  "use strict";

  const BUILD = "103230";
  const STYLE_ID =
    "mana-workout-gold-stability-103230";

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const CSS = `

    /* =====================================
       PREMIUM GOLD — UNFINISHED WORKOUTS
       ===================================== */

    #manaV83Content
    .mana-v980-root
    .mana-v980-day:not(.done) {

      border: 1px solid
        rgba(230,189,72,.85) !important;

      background: linear-gradient(
        145deg,
        #12110c,
        #090909
      ) !important;

      box-shadow: none !important;

    }

    /* Gold number box */

    #manaV83Content
    .mana-v980-root
    .mana-v980-day:not(.done)
    .mana-v980-number {

      border: 1px solid
        #e6bd48 !important;

      background: #141208 !important;

      color: #f3d875 !important;

      box-shadow: none !important;

    }

    /* Matching side accent */

    #manaV83Content
    .mana-v980-root
    .mana-v980-day:not(.done)::before {

      background: linear-gradient(
        180deg,
        transparent,
        #e6bd48,
        transparent
      ) !important;

    }

    /* =====================================
       COMPLETED WORKOUTS — GREEN
       ===================================== */

    #manaV83Content
    .mana-v980-root
    .mana-v980-day.done {

      border: 1px solid
        #55d98b !important;

      background: linear-gradient(
        145deg,
        #132b1d,
        #0a120c
      ) !important;

      box-shadow: none !important;

    }

    #manaV83Content
    .mana-v980-root
    .mana-v980-day.done
    .mana-v980-number {

      border: 1px solid
        #55d98b !important;

      background: #164b30 !important;

      color: #55d98b !important;

      box-shadow: none !important;

    }

    #manaV83Content
    .mana-v980-root
    .mana-v980-day.done::before {

      background: #55d98b !important;

    }

    /* Original number becomes a check.
       No duplicate completion symbol. */

    #manaV83Content
    .mana-v980-root
    .mana-v980-day.done::after {

      content: none !important;

    }

    /* =====================================
       KEEP EXISTING YELLOW WORKOUT TEXT
       ===================================== */

    #manaV83Content
    .mana-v980-root
    .mana-v980-day
    .mana-v980-title,

    #manaV83Content
    .mana-v980-root
    .mana-v980-day
    .mana-v980-category {

      color: #f3d875 !important;

    }

    /* =====================================
       REDUCE UNNECESSARY ANIMATION
       IN THE WORKOUT LIST ONLY
       ===================================== */

    #manaV83Content
    .mana-v980-root
    .mana-v980-day,

    #manaV83Content
    .mana-v980-root
    .mana-v980-number {

      transition: none !important;

      animation: none !important;

    }

    /* Preserve immediate tap feedback
       without running lengthy animations. */

    #manaV83Content
    .mana-v980-root
    .mana-v980-day:active {

      opacity: .94;

    }

    /* =====================================
       MOBILE
       ===================================== */

    @media(max-width:700px) {

      #manaV83Content
      .mana-v980-root
      .mana-v980-day {

        box-shadow: none !important;

      }

    }

  `;

  const style = document.createElement("style");

  style.id = STYLE_ID;
  style.textContent = CSS;

  document.head.appendChild(style);

  window.MANA_WORKOUT_GOLD_STABILITY_BUILD =
    BUILD;

  console.log(
    "Mana Workout Gold + Stability",
    BUILD
  );

})();
