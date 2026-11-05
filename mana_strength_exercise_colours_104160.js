
/* ============================================================
   MANA MOVEMENT — STRENGTH EXERCISE CARD COLOURS 104160
   COMPLETE STANDALONE JAVASCRIPT FILE

   Applies ONLY inside the actual Strength workout logger,
   after pressing Start Workout or Resume Workout.

   Premium palette:
     Orange #FF7927 | Black #08090B
     White #FFFFFF  | Silver #C1C6CE

   Visual-only changes. Does NOT replace workout cards, alter
   exercise demos, input values, saved sets, check actions,
   finishers, workout timer, swipe navigation or event handlers.
   ============================================================ */
(() => {
  "use strict";

  if (window.MANA_EXERCISE_COLOURS_104160) return;
  window.MANA_EXERCISE_COLOURS_104160 = true;

  const STYLE_ID = "mana-exercise-colours-104160";

  function install() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* Actual workout modal, not the day-list or Mana28. */
      html body #manaStrengthV64Workout.open {
        background:#08090B!important;
        color:#FFFFFF!important;
      }

      /* Workout heading, timer and completion summary. */
      #manaStrengthV64Workout .mana-v64-head .pill {
        background:#15171B!important;
        border:1px solid #FF7927!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      #manaStrengthV64Workout #manaV64Title {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      #manaStrengthV64Workout #manaV64Subtitle {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      #manaStrengthV64Workout .mana-v64-close {
        background:#15171B!important;
        border:1px solid #697686!important;
        color:#FFFFFF!important;
        box-shadow:none!important;
      }
      #manaStrengthV64Workout .mana-v64-stat {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #697686!important;
        box-shadow:none!important;
      }
      #manaStrengthV64Workout .mana-v64-stat span {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      #manaStrengthV64Workout .mana-v64-stat strong {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      #manaStrengthV64Workout .mana-v64-progress {
        background:#252B31!important;
        box-shadow:none!important;
      }
      #manaStrengthV64Workout .mana-v64-progress-fill {
        background:#FF7927!important;
        background-image:none!important;
      }

      /* Primary EXERCISE CARD: silver trim and charcoal body. */
      #manaStrengthV64Workout #manaV64Exercises .mana-v64-card {
        border:1px solid #A5ADB7!important;
        border-radius:20px!important;
        background:#15171B!important;
        background-image:none!important;
        box-shadow:none!important;
        color:#FFFFFF!important;
      }
      #manaStrengthV64Workout #manaV64Exercises .mana-v64-name {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      #manaStrengthV64Workout #manaV64Exercises .mana-v64-target,
      #manaStrengthV64Workout #manaV64Exercises .mana-v64-previous {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      /* Previous session / training advice controls. Existing
         open/close behaviours are unchanged. */
      #manaStrengthV64Workout #manaV64Exercises .mana-v970-disclosure
        .mana-v970-action {
        background:#101216!important;
        background-image:none!important;
        border:1px solid #697686!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        box-shadow:none!important;
      }
      #manaStrengthV64Workout #manaV64Exercises .mana-v970-disclosure
        .mana-v970-action.open {
        background:#231B16!important;
        border-color:#FF7927!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      #manaStrengthV64Workout #manaV64Exercises .mana-v970-history {
        background:#101216!important;
        border:1px solid #697686!important;
      }
      #manaStrengthV64Workout #manaV64Exercises
        .mana-v970-history-label {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      #manaStrengthV64Workout #manaV64Exercises
        .mana-v970-history-copy,
      #manaStrengthV64Workout #manaV64Exercises
        .mana-v970-history-copy strong {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      #manaStrengthV64Workout #manaV64Exercises .mana-v970-adjust {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      /* Exercise SET / REPS / KG tracking table. */
      #manaStrengthV64Workout #manaV64Exercises .mana-v64-table-head {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      #manaStrengthV64Workout #manaV64Exercises .mana-v64-set-number {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      #manaStrengthV64Workout #manaV64Exercises .mana-v64-set input {
        background:#0D0F13!important;
        background-image:none!important;
        border:1px solid #697686!important;
        border-radius:12px!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        box-shadow:none!important;
        opacity:1!important;
      }
      #manaStrengthV64Workout #manaV64Exercises
        .mana-v64-set input:focus {
        outline:2px solid #FF7927!important;
        outline-offset:1px!important;
        border-color:#FF7927!important;
      }
      #manaStrengthV64Workout #manaV64Exercises
        .mana-v64-set input::placeholder {
        color:#A5ADB7!important;
        -webkit-text-fill-color:#A5ADB7!important;
      }

      /* Keep check buttons interactive; a completed set turns
         premium orange instead of the previous gold. */
      #manaStrengthV64Workout #manaV64Exercises
        button.mana-v64-check {
        background:#0D0F13!important;
        border:1px solid #697686!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        box-shadow:none!important;
      }
      #manaStrengthV64Workout #manaV64Exercises
        button.mana-v64-check.done {
        background:#FF7927!important;
        border:1px solid #FF7927!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
      }
      #manaStrengthV64Workout #manaV64Exercises
        button.mana-v64-check:focus-visible {
        outline:2px solid #FF7927!important;
        outline-offset:2px!important;
      }

      /* Original Adjust Sets buttons and finish-workout action. */
      #manaStrengthV64Workout #manaV64Exercises .mana-v64-small {
        background:#15171B!important;
        border:1px solid #697686!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      #manaStrengthV64Workout #manaV64Complete {
        background:#FF7927!important;
        background-image:none!important;
        border:1px solid #FF7927!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        box-shadow:none!important;
      }
      #manaStrengthV64Workout #manaV64Status {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      /* Workout pause, done-all and exercise carousel controls. */
      #manaStrengthV64Workout .mana-v971-nav-btn,
      #manaStrengthV64Workout .mana-v920-pause,
      #manaStrengthV64Workout #manaV920Pause {
        background:#15171B!important;
        border:1px solid #697686!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        box-shadow:none!important;
      }
      #manaStrengthV64Workout .mana-v920-workout-all.done,
      #manaStrengthV64Workout .mana-v920-tick-all.done {
        background:#FF7927!important;
        border-color:#FF7927!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
      }
      #manaStrengthV64Workout .mana-v971-dot.active {
        background:#FF7927!important;
        border-color:#FF7927!important;
      }

      /* Preserve the illustration itself: NO filters, crop changes
         or size overrides on images, video or demonstration canvases. */

      /* Form guide: match palette without changing demonstration art. */
      #manaV970FormGuide .mana-v970-guide {
        background:#15171B!important;
        border:1px solid #A5ADB7!important;
        box-shadow:none!important;
      }
      #manaV970FormGuide .mana-v970-guide-kicker,
      #manaV970FormGuide .mana-v970-pose-label {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      #manaV970FormGuide .mana-v970-pose {
        background:#0D0F13!important;
        border:1px solid #697686!important;
      }
      #manaV970FormGuide .mana-v970-guide-close {
        background:#15171B!important;
        border:1px solid #697686!important;
        color:#FFFFFF!important;
      }

      @media(max-width:600px) {
        #manaStrengthV64Workout #manaV64Exercises .mana-v64-card {
          padding:14px!important;
          border-radius:17px!important;
        }
        #manaStrengthV64Workout #manaV64Exercises .mana-v64-name {
          font-size:19px!important;
        }
        #manaStrengthV64Workout #manaV64Exercises
          .mana-v64-table-head,
        #manaStrengthV64Workout #manaV64Exercises
          .mana-v64-set {
          gap:6px!important;
        }
      }
    `;
    document.head.appendChild(style);
    window.MANA_EXERCISE_COLOURS_BUILD = "104160";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded",install,{once:true});
  } else {
    install();
  }
})();
