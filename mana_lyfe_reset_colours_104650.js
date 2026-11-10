
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — RESET COLOUR FINISH
   BUILD 104650

   COMPLETE FILE
   mana_lyfe_reset_colours_104650.js

   FIXES:
   - Reset intro colours
   - Reset Now outer card border
   - Guided Reset progress bar
   - Guided Reset step headings
   - Whakatauki orange styling
   - Remaining gold buttons and selections
   - White writing inside green breathing circle

   PRESERVES:
   - 60-second breathing timer and animation
   - Reset navigation and click handlers
   - Green breathing circle
   - Teal Support Chat card
   - Routine and saved progress
   - Mana Strength and Mana28
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104650";
  const STYLE_ID = "manaLyfeResetColours104650";

  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    /* =====================================
       RESET SCREEN INTRODUCTION
       ===================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeReclaim103140
    .ml140-kicker {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeReclaim103140
    .ml140-heading {

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeReclaim103140
    .ml140-intro {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* =====================================
       RESET NOW OUTER CARD

       White premium border.
       Green breathing button unchanged.
       ===================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeReclaim103140
    .ml140-reclaim-card:not(.ml140-help) {

      border: 1px solid #FFFFFF !important;

      background: #15171A !important;
      background-image: none !important;

      box-shadow: none !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeReclaim103140
    .ml140-reclaim-card:not(.ml140-help)
    .ml140-card-title {

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeReclaim103140
    .ml140-reclaim-card:not(.ml140-help)
    .ml140-card-text {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* =====================================
       GREEN RESET NOW BUTTON
       ===================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeReclaim103140
    #ml140OpenReset {

      border-color: #55D98B !important;

      background: #164B30 !important;
      background-image: none !important;

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    /* =====================================
       GUIDED RESET MODAL — STEP LABELS
       ===================================== */

    #manaV936ResetModal
    .mana-v936-head-kicker,

    #manaV936ResetModal
    .mana-v936-step-kicker {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV936ResetModal
    .mana-v936-head-title,

    #manaV936ResetModal
    .mana-v936-step h2 {

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV936ResetModal
    .mana-v936-head-sub,

    #manaV936ResetModal
    .mana-v936-step > p {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* =====================================
       GUIDED RESET PROGRESS BAR
       ===================================== */

    #manaV936ResetModal
    .mana-v936-progress-track {

      background: #383D44 !important;
    }

    #manaV936ResetModal
    .mana-v936-progress-fill {

      background: #FF7927 !important;
      background-image: none !important;
    }

    /* =====================================
       GUIDED RESET WHAKATAUKI

       Keep the left-line presentation.
       ===================================== */

    #manaV936ResetModal
    #manaV937ResetWhakatauki {

      border-left: 4px solid #FF7927 !important;

      background: #15171A !important;
      background-image: none !important;
    }

    #manaV936ResetModal
    #manaV937ResetWhakatauki
    .mana-v937-label {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV936ResetModal
    #manaV937ResetWhakatauki strong {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV936ResetModal
    #manaV937ResetWhakatauki span {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* =====================================
       RESET OPTION SELECTIONS
       ===================================== */

    #manaV936ResetModal
    .mana-v936-option.selected {

      border-color: #FF7927 !important;
      background: #20160F !important;
    }

    #manaV936ResetModal
    .mana-v936-option.selected strong {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* =====================================
       OTHER RESET ACTION BUTTONS

       Orange is used for moving forward.
       Green is reserved for breathing Reset.
       ===================================== */

    #manaV936ResetModal
    .mana-v936-primary:not(#manaV936BreathStart) {

      background: #FF7927 !important;
      background-image: none !important;

      color: #08090B !important;
      -webkit-text-fill-color: #08090B !important;
    }

    #manaV936ResetModal
    .mana-v936-secondary {

      border-color: #626973 !important;

      background: #15171A !important;
      background-image: none !important;

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV936ResetModal
    .mana-v936-quote {

      border-color: #FF7927 !important;
      background: #15171A !important;

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV936ResetModal
    .mana-v936-complete {

      border-color: #FF7927 !important;
      background: #15171A !important;
      background-image: none !important;
    }

    #manaV936ResetModal
    .mana-v936-complete strong {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* =====================================
       BREATHING CIRCLE — GREEN
       TEXT — WHITE

       Do not change its size, animation,
       countdown or timing functionality.
       ===================================== */

    #manaV936ResetModal
    #manaV936BreathStart {

      border-color: #55D98B !important;

      background: #164B30 !important;

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV936ResetModal
    #manaV936BreathStart
    .mrs-seconds,

    #manaV936ResetModal
    #manaV936BreathStart
    .mrs-phase,

    #manaV936ResetModal
    #manaV936BreathStart
    .mrs-complete {

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV936ResetModal
    #manaV936BreathStart
    .mrs-instruction {

      color: #E0F5E8 !important;
      -webkit-text-fill-color: #E0F5E8 !important;
    }

    /* =====================================
       RESET MODAL FOCUS
       ===================================== */

    #manaV936ResetModal
    .mana-v936-primary:focus-visible,

    #manaV936ResetModal
    .mana-v936-secondary:focus-visible,

    #manaV936ResetModal
    .mana-v936-option:focus-visible {

      outline: 2px solid #FF7927 !important;
      outline-offset: 3px !important;
    }

    #manaV936ResetModal
    #manaV936BreathStart:focus-visible {

      outline: 2px solid #55D98B !important;
      outline-offset: 4px !important;
    }

  `;

  document.head.appendChild(style);

  console.log(
    "[ManaLyfe] Guided Reset colour finish " + BUILD
  );

})();
