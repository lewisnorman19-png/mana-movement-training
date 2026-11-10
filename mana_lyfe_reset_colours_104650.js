
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — RESET + CHAT FINAL COLOURS
   BUILD 104652

   COMPLETE FILE REPLACEMENT:
   mana_lyfe_reset_colours_104650.js

   FINISHES:
   - More Support heading orange
   - Support numbers and link borders orange
   - Selected Reset options orange
   - Completion summaries orange
   - Chat dark teal / cyan
   - Reset breathing circle remains green

   No data, navigation, chat or timer changes.
   Mana Strength and Mana28 unaffected.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104652";
  const STYLE_ID = "manaLyfeResetColours104652";

  if (document.getElementById(STYLE_ID)) return;

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
       MAIN RESET BUTTON — GREEN
       ===================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content #ml140OpenReset {
      border-color: #55D98B !important;
      background: #164B30 !important;
      background-image: none !important;
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    /* =====================================
       GUIDED RESET HEADER
       ===================================== */

    #manaV936ResetModal .mana-v936-head-kicker,
    #manaV936ResetModal .mana-v936-step-kicker {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV936ResetModal .mana-v936-head-title,
    #manaV936ResetModal .mana-v936-step h2 {
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV936ResetModal .mana-v936-head-sub,
    #manaV936ResetModal .mana-v936-step > p {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* =====================================
       RESET PROGRESS
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
       UNSELECTED RESET OPTIONS
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
       SELECTED RESET OPTIONS — ORANGE
       ===================================== */

    html body #manaV936ResetModal
    .mana-v936-option.selected,
    html body #manaV936ResetModal
    [data-v936-emotion].selected,
    html body #manaV936ResetModal
    [data-v936-movement].selected,
    html body #manaV936ResetModal
    [data-v936-action].selected {
      border: 2px solid #FF7927 !important;
      border-color: #FF7927 !important;
      background: #392013 !important;
      background-image: none !important;
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
      box-shadow: none !important;
    }

    html body #manaV936ResetModal
    .mana-v936-option.selected strong,
    html body #manaV936ResetModal
    [data-v936-emotion].selected strong,
    html body #manaV936ResetModal
    [data-v936-movement].selected strong,
    html body #manaV936ResetModal
    [data-v936-action].selected strong {
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    /* =====================================
       COMPLETION ACTIONS
       ===================================== */

    #manaV936ResetModal
    .mana-v936-primary:not(#manaV936BreathStart) {
      background: #FF7927 !important;
      background-image: none !important;
      color: #08090B !important;
      -webkit-text-fill-color: #08090B !important;
      box-shadow: none !important;
    }

    #manaV936ResetModal .mana-v936-secondary {
      border: 1px solid #626973 !important;
      background: #15171A !important;
      background-image: none !important;
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV936ResetModal .mana-v936-complete,
    #manaV936ResetModal .mana-v936-quote {
      border: 1px solid #FF7927 !important;
      background: #15171A !important;
      background-image: none !important;
    }

    #manaV936ResetModal
    .mana-v936-complete strong,
    #manaV936ResetModal .mana-v936-quote {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV936ResetModal .mana-v936-complete p {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* =====================================
       COMPLETION SUMMARY VALUES
       ===================================== */

    html body #manaV936ResetModal
    #manaV937ResetSummary
    .mana-v937-summary-item {
      background: #101216 !important;
      border: 1px solid #535963 !important;
      box-shadow: none !important;
    }

    html body #manaV936ResetModal
    #manaV937ResetSummary span {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    html body #manaV936ResetModal
    #manaV937ResetSummary strong {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

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
       BREATHING CIRCLE — GREEN / WHITE
       ===================================== */

    #manaV936ResetModal #manaV936BreathStart {
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
       MANA LYFE SUPPORT CHAT — TEAL/CYAN
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
       MORE SUPPORT — FINAL GOLD REMOVAL

       Exact section:
       #manaLyfeMoreSupport103140

       Only the ManaLyfe support contacts.
       Keep existing contact links functional.
       ===================================== */

    html body
    #manaLyfeMoreSupport103140 {
      border-top: 1px solid #454B53 !important;
      background: #08090B !important;
      color: #C1C6CE !important;
    }

    /* MORE SUPPORT heading */

    html body
    #manaLyfeMoreSupport103140 h3 {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* Description below the heading */

    html body
    #manaLyfeMoreSupport103140 p {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* Lifeline, Beyond Blue and other links */

    html body
    #manaLyfeMoreSupport103140
    .ml140-link {
      border: 1px solid #FF7927 !important;
      background: #15171A !important;
      background-image: none !important;
      border-radius: 11px !important;
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
      box-shadow: none !important;
    }

    /* Phone numbers — orange, not yellow */

    html body
    #manaLyfeMoreSupport103140
    .ml140-link strong {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* =====================================
       ACCESSIBLE FOCUS
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

    #manaLyfeMoreSupport103140
    .ml140-link:focus-visible {
      outline: 2px solid #FF7927 !important;
      outline-offset: 3px !important;
    }

  `;

  document.head.appendChild(style);

  console.log(
    "[ManaLyfe] Reset + Chat colour finish " + BUILD
  );

})();
