
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — ROUTINE + WHAKATAUKI TIDY
   BUILD 104640

   COMPLETE FILE
   mana_lyfe_routine_tidy_104640.js

   - Workout whakatauki: orange
   - Routine progress bar: orange
   - Routine checkboxes: orange
   - Routine card borders: white
   - Completed headings: white
   - Supporting copy: silver
   - No green outside Reset

   VISUAL ONLY:
   No workout logic, checklist handlers,
   data storage or navigation changes.
   Does not change Mana Strength or Mana28.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104640";
  const STYLE_ID = "manaLyfeRoutineTidy104640";

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    /* =====================================
       MANA LYFE — ROUTINE COLOUR SYSTEM
       ===================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content #manaLyfeDailyRoutine103130 {

      --lyfe-orange: #FF7927;
      --lyfe-white: #FFFFFF;
      --lyfe-silver: #C1C6CE;
      --lyfe-surface: #15171A;
    }

    /* =====================================
       DAILY ROUTINE INTRO
       ===================================== */

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeDailyRoutine103130
    .ml140-kicker {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeDailyRoutine103130
    .ml140-heading {

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeDailyRoutine103130
    .ml140-intro {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* =====================================
       DAILY PROGRESS SUMMARY
       ===================================== */

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeDailyRoutine103130
    .ml140-summary {

      border: 1px solid #FFFFFF !important;
      border-radius: 18px !important;

      background: #15171A !important;
      background-image: none !important;

      box-shadow: none !important;
    }

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeDailyRoutine103130
    .ml140-count {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeDailyRoutine103130
    .ml140-percent {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeDailyRoutine103130
    .ml140-track {

      background: #383D44 !important;
    }

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeDailyRoutine103130
    .ml140-fill {

      background: #FF7927 !important;
      background-image: none !important;
    }

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeDailyRoutine103130
    .ml140-date {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* =====================================
       ROUTINE HABIT CARDS
       ===================================== */

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeDailyRoutine103130
    .ml140-habit {

      border: 1px solid #FFFFFF !important;
      border-radius: 15px !important;

      background: #15171A !important;
      background-image: none !important;

      box-shadow: none !important;
    }

    /* Completed cards remain dark,
       with a subtle orange background. */

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeDailyRoutine103130
    .ml140-habit.done {

      border-color: #FF7927 !important;

      background: #201811 !important;
      background-image: none !important;
    }

    /* =====================================
       CHECKBOXES — ORANGE
       ===================================== */

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeDailyRoutine103130
    .ml140-checkbox {

      accent-color: #FF7927 !important;

      cursor: pointer !important;
    }

    /* =====================================
       HABIT TEXT
       ===================================== */

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeDailyRoutine103130
    .ml140-name,

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeDailyRoutine103130
    .ml140-habit.done .ml140-name {

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeDailyRoutine103130
    .ml140-detail {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* =====================================
       WHAKATAUKI — ALL MANA LYFE SCREENS
       ===================================== */

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaV985Whakatauki {

      border-left: 3px solid #FF7927 !important;

      background: #15171A !important;
      background-image: none !important;
    }

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaV985Whakatauki
    .mana-v985-footer-label {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaV985Whakatauki strong {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaV985Whakatauki span {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* Original Routine whakatauki,
       if rendered by its own component. */

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .ml140-whakatauki {

      border: 1px solid #FF7927 !important;

      background: #15171A !important;
      background-image: none !important;
    }

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .ml140-whakatauki span,

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .ml140-whakatauki strong {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .ml140-whakatauki p {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* =====================================
       MOBILE — PRESERVE EXISTING SIZES
       ===================================== */

    @media (max-width: 600px) {

      html body
      #manaV83ProgramShell.mana-lyfe-premium-104580
      #manaV83Content
      #manaLyfeDailyRoutine103130
      .ml140-habit {

        gap: 12px !important;
      }

      html body
      #manaV83ProgramShell.mana-lyfe-premium-104580
      #manaV83Content
      #manaLyfeDailyRoutine103130
      .ml140-copy {

        min-width: 0 !important;
        flex: 1 1 auto !important;
      }

      html body
      #manaV83ProgramShell.mana-lyfe-premium-104580
      #manaV83Content
      #manaLyfeDailyRoutine103130
      .ml140-detail {

        overflow-wrap: break-word !important;
      }
    }

  `;

  document.head.appendChild(style);

  console.log(
    "[ManaLyfe] Routine and whakatauki tidy " + BUILD
  );

})();
