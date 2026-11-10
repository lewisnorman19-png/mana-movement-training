
/* ============================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — WORKOUTS PREMIUM DESIGN
   BUILD 104631

   COMPLETE FILE: mana_lyfe_workouts_design_104631.js

   BRAND RULES
   - Orange: all workout accents and completion ticks
   - White: workout headings and card borders
   - Silver: supporting text
   - Black/charcoal: card backgrounds
   - Green: reserved for Reset button and tab only

   PRESERVES
   - Existing workout content
   - Week navigation and seven sessions per week
   - Completion state and saved data
   - All existing click handlers
   - Original title sizes
   - Mana28 and Mana Strength
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104631";
  const STYLE_ID = "manaLyfeWorkouts104631";

  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    /* ======================================
       MANA LYFE WORKOUTS — DESIGN TOKENS
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-root,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-session {

      --lyfe-orange: #FF7927;
      --lyfe-white: #FFFFFF;
      --lyfe-silver: #C1C6CE;
      --lyfe-surface: #15171A;
    }

    /* ======================================
       WORKOUT PAGE INTRO
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-kicker,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-workout-category,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-day-label {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-intro {

      border-bottom-color: #464B52 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-intro::after {

      background: #FF7927 !important;
      background-image: none !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-intro h2,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-week-title {

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-intro p {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* ======================================
       FOUR-WEEK SELECTOR
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-weeks {

      background: #0A0B0D !important;
      border: 1px solid #454A51 !important;
      box-shadow: none !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-week {

      background: transparent !important;
      background-image: none !important;
      border: 1px solid transparent !important;

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;

      box-shadow: none !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-week.active {

      background: #FF7927 !important;
      background-image: none !important;
      border-color: #FF7927 !important;

      color: #08090B !important;
      -webkit-text-fill-color: #08090B !important;

      box-shadow: none !important;
    }

    /* ======================================
       WEEK PROGRESS
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-week-progress {

      border: 1px solid #FF7927 !important;
      background: #20160F !important;
      background-image: none !important;

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* ======================================
       UNFINISHED WORKOUT CARDS
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-day:not(.done) {

      border: 1px solid #FFFFFF !important;
      background: #15171A !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    /* Remove previous gold side accent */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-day::before {

      display: none !important;
      content: none !important;
      background: none !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .mana-v980-day:not(.done) .mana-v980-number {

      border: 1px solid #FF7927 !important;
      background: #101216 !important;
      background-image: none !important;

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;

      box-shadow: none !important;
    }

    /* ======================================
       COMPLETED WORKOUTS — ORANGE
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-day.done {

      position: relative !important;

      border: 1.5px solid #FF7927 !important;
      border-color: #FF7927 !important;

      background: #211810 !important;
      background-image: none !important;

      box-shadow: none !important;
    }

    /* Completed number box / main tick */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .mana-v980-day.done .mana-v980-number {

      border: 1px solid #FF7927 !important;

      background: #FF7927 !important;
      background-image: none !important;

      color: #08090B !important;
      -webkit-text-fill-color: #08090B !important;

      box-shadow: none !important;
    }

    /* Extra completion tick from older styling */

    html body.mana-lyfe-103170
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .mana-v980-day.done::after {

      content: "✓" !important;

      background: #FF7927 !important;
      background-image: none !important;

      border: 1px solid #FF7927 !important;

      color: #08090B !important;
      -webkit-text-fill-color: #08090B !important;

      box-shadow: none !important;
    }

    /* ======================================
       CARD HEADINGS AND DESCRIPTIONS
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-category,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .mana-v980-day.done .mana-v980-category {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-title,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .mana-v980-day.done .mana-v980-title {

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-time {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-arrow {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* ======================================
       INDIVIDUAL WORKOUT SCREEN
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-back-week {

      background: #15171A !important;
      background-image: none !important;

      border: 1px solid #626973 !important;

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-workout-head {

      border-bottom-color: #454B53 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-workout-title {

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-focus {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-duration {

      border: 1px solid #FF7927 !important;
      background: #20160F !important;
      background-image: none !important;

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* ======================================
       WORKOUT NOTES
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-note {

      border: 1px solid #535963 !important;

      background: #15171A !important;
      background-image: none !important;

      box-shadow: none !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-note::before {

      background: #FF7927 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-note-title {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-note-text {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* ======================================
       EXERCISES
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-exercises {

      border-top-color: #454B53 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-exercise {

      border-bottom-color: #454B53 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-exercise-name {

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-exercise-detail {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* ======================================
       COMPLETE WORKOUT BUTTON — ORANGE
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-complete {

      background: #FF7927 !important;
      background-image: none !important;

      color: #08090B !important;
      -webkit-text-fill-color: #08090B !important;

      box-shadow: none !important;
    }

    /* ======================================
       ACCESSIBILITY
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-week:focus-visible,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-day:focus-visible,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-back-week:focus-visible,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-complete:focus-visible {

      outline: 2px solid #FF7927 !important;
      outline-offset: 3px !important;
    }

    /* ======================================
       MOBILE — PRESERVE TITLE SIZES
       ====================================== */

    @media (max-width: 700px) {

      #manaV83ProgramShell.mana-lyfe-premium-104580
      #manaV83Content .mana-v980-week {

        min-width: 0 !important;
        padding: 0 3px !important;
      }

      #manaV83ProgramShell.mana-lyfe-premium-104580
      #manaV83Content .mana-v980-day,
      #manaV83ProgramShell.mana-lyfe-premium-104580
      #manaV83Content .mana-v980-copy {

        min-width: 0 !important;
      }

      #manaV83ProgramShell.mana-lyfe-premium-104580
      #manaV83Content .mana-v980-title {

        overflow-wrap: break-word !important;
      }
    }

  `;

  document.head.appendChild(style);

  console.log(
    "[ManaLyfe] Orange workout completion styling " +
    BUILD
  );

})();
