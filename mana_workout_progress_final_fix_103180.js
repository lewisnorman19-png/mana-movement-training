
/* ================================================
   MANA MOVEMENT TRAINING
   WORKOUT + PROGRESS FINAL POLISH
   BUILD 103180

   MANA 28 + MANA LYFE WORKOUTS
   - Unfinished workouts: white borders
   - Completed workouts: green borders
   - Existing completion ticks preserved
   - No changes to text or layout

   MANA 28 PROGRESS
   - Workouts: green
   - Water: blue
   - Recovery: purple
   - Calories: green
   - Protein: green

   Does not change:
   - Mana Strength
   - Workout content
   - Saved workout history
   - Daily Routine
   - Reset
   - Support Chat
   - Navigation
   ================================================ */

(() => {
  "use strict";

  const BUILD = "103180";
  const STYLE_ID =
    "mana-workout-progress-final-fix-103180";

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const CSS = `

    /* =====================================
       SHARED WORKOUT CARDS

       Mana 28 and Mana Lyfe both use
       the v980 workout card system.

       Unfinished = white
       Completed = green
       ===================================== */

    #manaV83Content
    .mana-v980-day:not(.done) {

      border:
        1px solid rgba(
          255,255,255,.72
        ) !important;

      box-shadow:
        none !important;

    }

    #manaV83Content
    .mana-v980-day:not(.done)::before {

      background:
        rgba(255,255,255,.52) !important;

    }

    /* Completed workout card */

    #manaV83Content
    .mana-v980-day.done {

      border:
        1px solid #55d98b !important;

      background:
        linear-gradient(
          145deg,
          #132b1d,
          #0a120c
        ) !important;

      box-shadow:
        none !important;

    }

    #manaV83Content
    .mana-v980-day.done::before {

      background:
        #55d98b !important;

    }

    /* Existing completion number/tick */

    #manaV83Content
    .mana-v980-day.done
    .mana-v980-number {

      border-color:
        #55d98b !important;

      background:
        #164b30 !important;

      color:
        #55d98b !important;

    }

    /* Prevent duplicate overlay ticks:
       original workout system already
       displays a tick in the number. */

    body.mana-lyfe-103170
    #manaV83Content
    .mana-v980-day.done::after {

      content:
        none !important;

    }

    /* =====================================
       MANA 28 PROGRESS

       Actual grid order:
       1 Workouts
       2 Water
       3 Recovery
       4 Calories
       5 Protein

       Match Mana Strength bar colours.
       ===================================== */

    /* Default: GREEN */

    #manaV83Content
    .mana-v981-root
    .mana-v981-grid
    .mana-v981-card
    .mana-v981-bar span {

      background:
        linear-gradient(
          90deg,
          #278b57,
          #45c783
        ) !important;

    }

    /* WATER: BLUE - second card */

    #manaV83Content
    .mana-v981-root
    .mana-v981-grid
    .mana-v981-card:nth-child(2)
    .mana-v981-bar span {

      background:
        linear-gradient(
          90deg,
          #1677bb,
          #42b8ff
        ) !important;

    }

    /* RECOVERY: PURPLE - third card */

    #manaV83Content
    .mana-v981-root
    .mana-v981-grid
    .mana-v981-card:nth-child(3)
    .mana-v981-bar span {

      background:
        linear-gradient(
          90deg,
          #6f49bb,
          #a77bff
        ) !important;

    }

    /* =====================================
       MANA 28 PROGRESS
       KEEP PREMIUM GOLD CARD BORDERS
       ===================================== */

    #manaV83Content
    .mana-v981-root
    .mana-v981-card {

      border-color:
        rgba(230,189,72,.68) !important;

    }

    /* Water indicator */

    #manaV83Content
    .mana-v981-root
    .mana-v981-card:nth-child(2)
    .mana-v981-icon {

      color:
        #42b8ff !important;

    }

    /* Recovery indicator */

    #manaV83Content
    .mana-v981-root
    .mana-v981-card:nth-child(3)
    .mana-v981-icon {

      color:
        #a77bff !important;

    }

  `;

  function init() {

    const style =
      document.createElement("style");

    style.id =
      STYLE_ID;

    style.textContent =
      CSS;

    document.head.appendChild(style);

    window.MANA_WORKOUT_PROGRESS_FIX =
      BUILD;

    console.log(
      "MANA WORKOUT + PROGRESS FINAL FIX",
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
