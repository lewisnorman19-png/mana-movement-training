
/* ===========================================
   MANA MOVEMENT TRAINING
   WORKOUT + PROGRESS COLOUR CORRECTION
   BUILD 103200

   MANA 28 + MANA LYFE
   Unfinished workouts:
   - White outside border
   - White number border
   - White number text
   - No coloured side accent

   Completed workouts:
   - Green border
   - Green tick
   - Green completion styling

   MANA 28 PROGRESS
   - Workouts: Green
   - Water: Blue
   - Recovery: Purple
   - Calories: Green
   - Protein: Green

   Correct BOTH progress tracks and fills.

   Does not modify:
   - Mana Strength
   - Workout completion data
   - Workout navigation
   - Fuel records
   - Routine or Reset
   =========================================== */

(() => {
  "use strict";

  const BUILD = "103200";

  const STYLE_ID =
    "mana-workout-progress-final-fix-103180";

  const CSS = `

    /* =====================================
       WORKOUT CARDS
       INCOMPLETE = WHITE
       ===================================== */

    #manaV83Content
    .mana-v980-day:not(.done) {

      border: 1px solid
        rgba(255,255,255,.80) !important;

      background: linear-gradient(
        145deg,
        #111111,
        #080808
      ) !important;

      box-shadow: none !important;

    }

    /* Remove the coloured side line */

    #manaV83Content
    .mana-v980-day:not(.done)::before {

      background: rgba(
        255,255,255,.55
      ) !important;

    }

    /* Number boxes - all neutral white */

    #manaV83Content
    .mana-v980-day:not(.done)
    .mana-v980-number {

      border: 1px solid
        rgba(255,255,255,.80) !important;

      background: #111111 !important;

      color: #ffffff !important;

      box-shadow: none !important;

    }

    /* =====================================
       COMPLETED WORKOUTS = GREEN
       ===================================== */

    #manaV83Content
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
    .mana-v980-day.done::before {

      background: #55d98b !important;

    }

    #manaV83Content
    .mana-v980-day.done
    .mana-v980-number {

      border: 1px solid
        #55d98b !important;

      background: #164b30 !important;

      color: #55d98b !important;

      box-shadow: none !important;

    }

    /* The original workout number becomes
       a tick when completed. Don't add
       a second duplicate tick. */

    #manaV83Content
    .mana-v980-day.done::after {

      content: none !important;

    }

    /* Leave exercise headings yellow */

    #manaV83Content
    .mana-v980-day
    .mana-v980-title,

    #manaV83Content
    .mana-v980-day
    .mana-v980-category {

      color: #f3d875 !important;

    }

    /* =====================================
       MANA 28 PROGRESS
       FIVE CARD GRID
       ===================================== */

    /* GREEN: default fill and track */

    #manaV83Content
    .mana-v981-root
    .mana-v981-grid
    > .mana-v981-card
    .mana-v981-bar {

      background: rgba(
        69,199,131,.22
      ) !important;

      background-image: none !important;

    }

    #manaV83Content
    .mana-v981-root
    .mana-v981-grid
    > .mana-v981-card
    .mana-v981-bar > span {

      background: linear-gradient(
        90deg,
        #278b57,
        #45c783
      ) !important;

      background-color: #45c783 !important;

    }

    /* =====================================
       WATER = BLUE
       CARD 2
       ===================================== */

    #manaV83Content
    .mana-v981-root
    .mana-v981-grid
    > .mana-v981-card:nth-child(2)
    .mana-v981-bar {

      background: rgba(
        66,184,255,.22
      ) !important;

      background-image: none !important;

    }

    #manaV83Content
    .mana-v981-root
    .mana-v981-grid
    > .mana-v981-card:nth-child(2)
    .mana-v981-bar > span {

      background: linear-gradient(
        90deg,
        #1677bb,
        #42b8ff
      ) !important;

      background-color: #42b8ff !important;

    }

    /* =====================================
       RECOVERY = PURPLE
       CARD 3
       ===================================== */

    #manaV83Content
    .mana-v981-root
    .mana-v981-grid
    > .mana-v981-card:nth-child(3)
    .mana-v981-bar {

      background: rgba(
        167,123,255,.22
      ) !important;

      background-image: none !important;

    }

    #manaV83Content
    .mana-v981-root
    .mana-v981-grid
    > .mana-v981-card:nth-child(3)
    .mana-v981-bar > span {

      background: linear-gradient(
        90deg,
        #6f49bb,
        #a77bff
      ) !important;

      background-color: #a77bff !important;

    }

    /* =====================================
       PROGRESS ICONS
       ===================================== */

    #manaV83Content
    .mana-v981-root
    .mana-v981-grid
    > .mana-v981-card:nth-child(2)
    .mana-v981-icon {

      color: #42b8ff !important;

    }

    #manaV83Content
    .mana-v981-root
    .mana-v981-grid
    > .mana-v981-card:nth-child(3)
    .mana-v981-icon {

      color: #a77bff !important;

    }

    /* =====================================
       PREMIUM GOLD PROGRESS CARD BORDERS
       ===================================== */

    #manaV83Content
    .mana-v981-root
    .mana-v981-card {

      border-color: rgba(
        230,189,72,.68
      ) !important;

    }

  `;

  function install() {

    let style =
      document.getElementById(
        STYLE_ID
      );

    if (!style) {

      style =
        document.createElement(
          "style"
        );

      style.id =
        STYLE_ID;

      document.head.appendChild(
        style
      );

    }

    if (style.textContent !== CSS) {

      style.textContent =
        CSS;

    }

    window.MANA_WORKOUT_PROGRESS_FIX =
      BUILD;

    console.log(
      "Mana Workout + Progress Fix",
      BUILD
    );

  }

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      install,
      { once: true }
    );

  } else {

    install();

  }

})();
