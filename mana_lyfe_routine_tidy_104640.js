
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — ROUTINE + RESET FINAL TIDY
   BUILD 104641

   COMPLETE FILE REPLACEMENT
   mana_lyfe_routine_tidy_104640.js

   FIXES:
   1. Keep single left-line whakatauki
   2. Hide duplicate bordered whakatauki
      in Daily Routine and Reset
   3. Reset Support Chat matches Overview:
      dark teal background, cyan border
   4. Support Chat button uses teal/cyan
   5. Reset button stays green

   PRESERVES:
   - Routine checklist and saved progress
   - Routine orange progress indicators
   - Workout styling and completion
   - Original whakatauki text
   - Reset breathing functionality
   - Support Chat click handler
   - Mana Strength and Mana28

   Visual styling only. No storage changes.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104641";
  const STYLE_ID = "manaLyfeRoutineTidy104641";

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    /* =====================================
       MANA LYFE COLOUR SYSTEM
       ===================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content {

      --lyfe-orange: #FF7927;
      --lyfe-white: #FFFFFF;
      --lyfe-silver: #C1C6CE;
      --lyfe-surface: #15171A;
      --lyfe-teal: #0D2429;
      --lyfe-cyan: #27C6D7;
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
       DAILY ROUTINE PROGRESS SUMMARY
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
    .ml140-count,

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
       DAILY ROUTINE HABIT CARDS
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
       ORANGE CHECKBOXES
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
       DAILY ROUTINE TEXT
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
       KEEP THE SINGLE LEFT-LINE WHAKATAUKI
       BOTH ROUTINE AND RESET
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

    /* =====================================
       REMOVE DUPLICATE BORDERED WHAKATAUKI

       The older Routine/Reset renderer adds
       .ml140-whakatauki.

       Hide only that older card.
       Keep the newer left-line footer.

       No other content is removed.
       ===================================== */

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeDailyRoutine103130
    .ml140-whakatauki,

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeReclaim103140
    .ml140-whakatauki {

      display: none !important;
    }

    /* =====================================
       RESET SUPPORT CHAT CARD

       MATCH THE OVERVIEW CHAT:
       DARK TEAL + CYAN BORDER

       Only the Support & Connection card.
       The Reset Now card is unaffected.
       ===================================== */

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeReclaim103140
    .ml140-reclaim-card.ml140-help {

      background:
        linear-gradient(
          145deg,
          #0D2429,
          #10272C
        ) !important;

      background-color: #0D2429 !important;

      border: 1px solid #27C6D7 !important;
      border-radius: 20px !important;

      box-shadow: none !important;
    }

    /* SUPPORT & CONNECTION heading */

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeReclaim103140
    .ml140-help .ml140-card-title {

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    /* Support Chat description */

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeReclaim103140
    .ml140-help .ml140-card-text {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* =====================================
       SUPPORT CHAT BUTTON — TEAL/CYAN
       ===================================== */

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeReclaim103140
    #ml140OpenChat {

      background: #16414A !important;
      background-image: none !important;

      border: 1px solid #27C6D7 !important;

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;

      box-shadow: none !important;
    }

    html body
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeReclaim103140
    #ml140OpenChat:active {

      background: #205764 !important;
    }

    /* =====================================
       RESET NOW — GREEN UNCHANGED

       Preserve its existing colour, shape,
       breathing interaction and click handler.
       ===================================== */

    /* =====================================
       MOBILE — KEEP APPROVED SIZES
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

      html body
      #manaV83ProgramShell.mana-lyfe-premium-104580
      #manaV83Content
      #manaLyfeReclaim103140
      .ml140-reclaim-card.ml140-help {

        border-radius: 17px !important;
      }

    }

  `;

  document.head.appendChild(style);

  console.log(
    "[ManaLyfe] Routine + Reset tidy " + BUILD
  );

})();
