
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — RESET + CHAT COLOUR FINISH
   BUILD 104651

   COMPLETE REPLACEMENT FILE:
   mana_lyfe_reset_colours_104650.js

   FIXES:
   - Selected Reset choices orange
   - Reset completion summary values orange
   - Remaining Reset gold changed to orange
   - Support Chat uses dark teal and cyan
   - Guided Reset whakatauki orange
   - Breathing circle stays green with white text

   PRESERVES:
   - Breathing timer and animation
   - Reset step navigation
   - Emotion and action selections
   - Completion records
   - Support Chat message functionality
   - Routine and workout progress
   - Mana Strength and Mana28

   STYLING ONLY — NO DATA CHANGES
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104651";
  const STYLE_ID = "manaLyfeResetColours104651";

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    /* =====================================
       RESET ENTRY SCREEN
       ===================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeReclaim103140 .ml140-kicker {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeReclaim103140 .ml140-heading {
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #manaLyfeReclaim103140 .ml140-intro {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* Reset entry card: white outline */

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
       RESET BUTTON — GREEN ONLY
       ===================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    #ml140OpenReset {
      border-color: #55D98B !important;
      background: #164B30 !important;
      background-image: none !important;
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    /* =====================================
       GUIDED RESET HEADER
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
       RESET PROGRESS LINE
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
       RESET WHAKATAUKI
       ===================================== */

    #manaV936ResetModal
    #manaV937ResetWhakatauki {
      border-left: 4px solid #FF7927 !important;
      background: #15171A !important;
      background-image: none !important;
    }

    #manaV936ResetModal
    #manaV937ResetWhakatauki .mana-v937-label,
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
       RESET OPTIONS — UNSELECTED
       ===================================== */

    #manaV936ResetModal
    .mana-v936-option:not(.selected) {
      border: 1px solid #454B53 !important;
      background: #101216 !important;
      background-image: none !important;
    }

    #manaV936ResetModal
    .mana-v936-option:not(.selected) strong {
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV936ResetModal
    .mana-v936-option span {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* =====================================
       RESET OPTIONS — SELECTED ORANGE

       Fix green selection on:
       Write it privately
       and other guided Reset choices.
       ===================================== */

    html body
    #manaV936ResetModal
    .mana-v936-option.selected,

    html body
    #manaV936ResetModal
    [data-v936-emotion].selected,

    html body
    #manaV936ResetModal
    [data-v936-movement].selected,

    html body
    #manaV936ResetModal
    [data-v936-action].selected {

      border: 2px solid #FF7927 !important;
      border-color: #FF7927 !important;

      background: #392013 !important;
      background-image: none !important;

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;

      box-shadow: none !important;
    }

    html body
    #manaV936ResetModal
    .mana-v936-option.selected strong,

    html body
    #manaV936ResetModal
    [data-v936-emotion].selected strong,

    html body
    #manaV936ResetModal
    [data-v936-movement].selected strong,

    html body
    #manaV936ResetModal
    [data-v936-action].selected strong {

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    /* =====================================
       COMPLETE RESET — ORANGE
       ===================================== */

    #manaV936ResetModal
    .mana-v936-primary:not(#manaV936BreathStart) {
      background: #FF7927 !important;
      background-image: none !important;
      color: #08090B !important;
      -webkit-text-fill-color: #08090B !important;
      box-shadow: none !important;
    }

    #manaV936ResetModal
    .mana-v936-secondary {
      border: 1px solid #626973 !important;
      background: #15171A !important;
      background-image: none !important;
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV936ResetModal
    .mana-v936-complete,
    #manaV936ResetModal
    .mana-v936-quote {
      border: 1px solid #FF7927 !important;
      background: #15171A !important;
      background-image: none !important;
    }

    #manaV936ResetModal
    .mana-v936-complete strong,
    #manaV936ResetModal
    .mana-v936-quote {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV936ResetModal
    .mana-v936-complete p {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* =====================================
       COMPLETION SUMMARY — NO MORE YELLOW

       You named
       You chose movement
       Your next step
       ===================================== */

    html body
    #manaV936ResetModal
    #manaV937ResetSummary
    .mana-v937-summary-item {
      background: #101216 !important;
      border: 1px solid #535963 !important;
      box-shadow: none !important;
    }

    html body
    #manaV936ResetModal
    #manaV937ResetSummary span {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    html body
    #manaV936ResetModal
    #manaV937ResetSummary strong {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* Reset progress cards outside the modal */

    #manaV937ResetProgressCard
    .mana-v937-progress-kicker,
    #manaV937ResetProgressCard
    .mana-v937-reset-stat strong,
    #manaV937ResetProgressCard
    .mana-v937-last-reset strong {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* =====================================
       BREATHING CIRCLE — GREEN/WHITE
       ===================================== */

    #manaV936ResetModal
    #manaV936BreathStart {
      border-color: #55D98B !important;
      background: #164B30 !important;
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV936ResetModal
    #manaV936BreathStart .mrs-seconds,
    #manaV936ResetModal
    #manaV936BreathStart .mrs-phase,
    #manaV936ResetModal
    #manaV936BreathStart .mrs-complete {
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV936ResetModal
    #manaV936BreathStart .mrs-instruction {
      color: #E0F5E8 !important;
      -webkit-text-fill-color: #E0F5E8 !important;
    }

    /* =====================================
       MANA LYFE SUPPORT CHAT
       PREMIUM DARK TEAL / CYAN
       ===================================== */

    html body
    #manaV95ChatModal.mana-v935-life-mode
    .mana-v950-header {
      background: #0D2429 !important;
      background-image: none !important;
      border-bottom: 1px solid #27C6D7 !important;
    }

    html body
    #manaV95ChatModal.mana-v935-life-mode
    .mana-v950-header-kicker {
      color: #27C6D7 !important;
      -webkit-text-fill-color: #27C6D7 !important;
    }

    html body
    #manaV95ChatModal.mana-v935-life-mode
    .mana-v950-header-title {
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    html body
    #manaV95ChatModal.mana-v935-life-mode
    .mana-v950-header-sub {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    html body
    #manaV95ChatModal.mana-v935-life-mode
    .mana-v950-compose {
      background: #0D2429 !important;
      background-image: none !important;
      border-top: 1px solid #27C6D7 !important;
    }

    html body
    #manaV95ChatModal.mana-v935-life-mode
    #manaV95Input {
      border-color: #535963 !important;
      background: #101216 !important;
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    html body
    #manaV95ChatModal.mana-v935-life-mode
    #manaV95Input:focus {
      border-color: #27C6D7 !important;
      outline: none !important;
      box-shadow:
        0 0 0 2px rgba(39,198,215,.14)
        !important;
    }

    html body
    #manaV95ChatModal.mana-v935-life-mode
    #manaV95Send {
      border: 1px solid #27C6D7 !important;
      background: #27C6D7 !important;
      background-image: none !important;
      color: #071B20 !important;
      -webkit-text-fill-color: #071B20 !important;
      box-shadow: none !important;
    }

    html body
    #manaV95ChatModal.mana-v935-life-mode
    .mana-v935-quick-btn {
      border-color: #27C6D7 !important;
      background: #16414A !important;
      background-image: none !important;
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    /* =====================================
       FOCUS INDICATORS
       ===================================== */

    #manaV936ResetModal
    .mana-v936-option:focus-visible,
    #manaV936ResetModal
    .mana-v936-primary:focus-visible,
    #manaV936ResetModal
    .mana-v936-secondary:focus-visible {
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
    "[ManaLyfe] Reset and Chat colours " + BUILD
  );

})();
