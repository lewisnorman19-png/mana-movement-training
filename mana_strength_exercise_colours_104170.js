
/* ============================================================
   MANA MOVEMENT — STRENGTH EXERCISE COLOURS 104170
   COMPLETE REPLACEMENT FOR 104160

   Styles actual workout-in-progress cards, target-muscle panels,
   status badges, set tables, action buttons and demo frame.
   Does not recreate cards or alter illustrations, saved workouts,
   sets, reps, navigation, timers, finishers or click handlers.
   ============================================================ */
(() => {
  "use strict";
  if (window.MANA_EXERCISE_COLOURS_104170) return;
  window.MANA_EXERCISE_COLOURS_104170 = true;

  const STYLE_ID = "mana-exercise-colours-104170";

  function install() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* Screen and workout heading */
      html body #manaStrengthV64Workout.open {
        background:#08090B!important;
        color:#FFFFFF!important;
      }
      html body #manaStrengthV64Workout .mana-v64-head .pill {
        background:#15171B!important;
        border:1px solid #FF7927!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #manaStrengthV64Workout #manaV64Title {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      html body #manaStrengthV64Workout #manaV64Subtitle {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      html body #manaStrengthV64Workout .mana-v64-close {
        background:#15171B!important;
        border:1px solid #697686!important;
        color:#FFFFFF!important;
        box-shadow:none!important;
      }

      /* IN PROGRESS badge from v9.20 */
      html body #manaStrengthV64Workout .mana-v920-progress-badge {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #FF7927!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        box-shadow:none!important;
      }
      html body #manaStrengthV64Workout .mana-v920-progress-badge::before {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      /* Workout timer, progress and summary */
      html body #manaStrengthV64Workout .mana-v64-stat {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #697686!important;
        box-shadow:none!important;
      }
      html body #manaStrengthV64Workout .mana-v64-stat span {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      html body #manaStrengthV64Workout .mana-v64-stat strong {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #manaStrengthV64Workout .mana-v64-progress {
        background:#252B31!important;
        box-shadow:none!important;
      }
      html body #manaStrengthV64Workout .mana-v64-progress-fill {
        background:#FF7927!important;
        background-image:none!important;
      }
      html body #manaStrengthV64Workout .mana-v920-resume-note {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      /* Main exercise card */
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v64-card {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        border-radius:20px!important;
        box-shadow:none!important;
        color:#FFFFFF!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v64-name {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v64-target,
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v64-previous {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      /* Real PRIMARY TARGET panel from v10.11. Keep the image intact. */
      html body #manaStrengthV64Workout #manaV64Exercises .m10111-target {
        background:#101216!important;
        background-image:none!important;
        border:1px solid #697686!important;
        border-radius:18px!important;
        box-shadow:none!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .m10111-image {
        background:#08090B!important;
        border:1px solid #697686!important;
        box-shadow:none!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .m10111-kicker {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .m10111-target-name {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .m10111-note {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .m10111-ring {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #FF7927!important;
        color:#FF7927!important;
      }

      /* Previous/Progression and Demo buttons */
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v970-action {
        background:#0D0F13!important;
        background-image:none!important;
        border:1px solid #697686!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        box-shadow:none!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v970-action.open {
        background:#17191E!important;
        border-color:#FF7927!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v970-history {
        background:#101216!important;
        border:1px solid #697686!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v970-history-label,
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v970-adjust {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v970-history-copy,
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v970-history-copy strong {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      /* Sets/reps/load fields */
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v64-table-head {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v64-set-number {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v64-set input {
        background:#0D0F13!important;
        background-image:none!important;
        border:1px solid #697686!important;
        border-radius:12px!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        box-shadow:none!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v64-set input:focus {
        border-color:#FF7927!important;
        outline:2px solid #FF7927!important;
        outline-offset:1px!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v64-set input::placeholder {
        color:#A5ADB7!important;
        -webkit-text-fill-color:#A5ADB7!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v64-check {
        background:#0D0F13!important;
        border:1px solid #697686!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        box-shadow:none!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v64-check.done {
        background:#FF7927!important;
        border:1px solid #FF7927!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
      }
      html body #manaStrengthV64Workout #manaV64Exercises .mana-v64-small {
        background:#15171B!important;
        border:1px solid #697686!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      /* Tick All / Finish: preserve completed state and click handlers */
      html body #manaStrengthV64Workout .mana-v920-tick-all,
      html body #manaStrengthV64Workout .mana-v920-workout-all {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #FF7927!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        box-shadow:none!important;
      }
      html body #manaStrengthV64Workout .mana-v920-tick-all.done,
      html body #manaStrengthV64Workout .mana-v920-workout-all.done {
        background:#FF7927!important;
        border-color:#FF7927!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
      }
      html body #manaStrengthV64Workout #manaV64Complete {
        background:#FF7927!important;
        background-image:none!important;
        border:1px solid #FF7927!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        box-shadow:none!important;
      }
      html body #manaStrengthV64Workout #manaV64Status {
        color:#C1C6CE!important;
      }
      html body #manaStrengthV64Workout .mana-v971-nav-btn,
      html body #manaStrengthV64Workout .mana-v920-pause,
      html body #manaStrengthV64Workout #manaV920Pause {
        background:#15171B!important;
        border:1px solid #697686!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        box-shadow:none!important;
      }
      html body #manaStrengthV64Workout .mana-v971-dot.active {
        background:#FF7927!important;
        border-color:#FF7927!important;
      }

      /* Demo guide colours; no changes to illustration dimensions */
      html body #manaV970FormGuide .mana-v970-guide,
      html body .m10116-guide {
        background:#15171B!important;
        border:1px solid #A5ADB7!important;
        box-shadow:none!important;
      }
      html body #manaV970FormGuide .mana-v970-guide-kicker,
      html body #manaV970FormGuide .mana-v970-pose-label,
      html body .m10116-guide .m10116-kicker {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #manaV970FormGuide .mana-v970-pose {
        background:#0D0F13!important;
        border:1px solid #697686!important;
      }

      @media(max-width:600px) {
        html body #manaStrengthV64Workout #manaV64Exercises .mana-v64-card {
          padding:14px!important;
          border-radius:17px!important;
        }
        html body #manaStrengthV64Workout #manaV64Exercises .mana-v64-name {
          font-size:19px!important;
        }
      }
    `;
    document.head.appendChild(style);
    window.MANA_EXERCISE_COLOURS_BUILD = "104170";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, {once:true});
  } else {
    install();
  }
})();
