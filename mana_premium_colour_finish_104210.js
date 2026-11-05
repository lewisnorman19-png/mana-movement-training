
/* ==============================================================
   MANA MOVEMENT — PREMIUM COLOUR FINISH 104210
   MOBILE TEXT CLEANUP — COMPLETE REPLACEMENT FOR 104200

   Exercise cards, demo key cues, feedback, completion,
   finisher summaries, workout badges, Profile welcome,
   and unified white Overview icons in orange-outline tiles.

   Visual only. Preserves workout data, logic, illustrations,
   navigation, saved sets and demonstration playback.
   ============================================================== */
(() => {
  "use strict";

  if (window.MANA_PREMIUM_FINISH_104210) return;
  window.MANA_PREMIUM_FINISH_104210 = true;

  const STYLE_ID = "mana-premium-finish-style-104210";
  const CSS = `
    /* ===== EXERCISE SCREEN ===== */
    #manaStrengthV64Workout.open {
      background:#08090B!important;
      color:#FFFFFF!important;
    }
    #manaStrengthV64Workout .mana-v64-head .pill,
    #manaStrengthV64Workout .mana-v920-progress-badge {
      background:#15171B!important;
      background-image:none!important;
      border:1px solid #FF7927!important;
      color:#FF7927!important;
      -webkit-text-fill-color:#FF7927!important;
      box-shadow:none!important;
    }
    #manaStrengthV64Workout .mana-v920-progress-badge::before,
    #manaStrengthV64Workout .mana-v920-progress-badge * {
      color:#FF7927!important;
      -webkit-text-fill-color:#FF7927!important;
    }
    #manaStrengthV64Workout #manaV64Title {
      color:#FFFFFF!important;
    }
    #manaStrengthV64Workout #manaV64Subtitle,
    #manaStrengthV64Workout #manaV64Status {
      color:#C1C6CE!important;
    }
    #manaStrengthV64Workout .mana-v64-stat {
      background:#15171B!important;
      background-image:none!important;
      border:1px solid #697686!important;
      box-shadow:none!important;
    }
    #manaStrengthV64Workout .mana-v64-stat span {
      color:#C1C6CE!important;
    }
    #manaStrengthV64Workout .mana-v64-stat strong,
    #manaStrengthV64Workout .mana-v920-resume-note {
      color:#FF7927!important;
      -webkit-text-fill-color:#FF7927!important;
    }
    #manaStrengthV64Workout .mana-v64-progress {
      background:#252B31!important;
    }
    #manaStrengthV64Workout .mana-v64-progress-fill {
      background:#FF7927!important;
      background-image:none!important;
    }
    #manaStrengthV64Workout #manaV64Exercises .mana-v64-card {
      background:#15171B!important;
      background-image:none!important;
      border:1px solid #A5ADB7!important;
      box-shadow:none!important;
      border-radius:20px!important;
    }
    #manaStrengthV64Workout #manaV64Exercises .mana-v64-name {
      color:#FFFFFF!important;
    }
    #manaStrengthV64Workout #manaV64Exercises .mana-v64-target,
    #manaStrengthV64Workout #manaV64Exercises .mana-v64-previous,
    #manaStrengthV64Workout #manaV64Exercises .m10111-note {
      color:#C1C6CE!important;
    }
    #manaStrengthV64Workout #manaV64Exercises .m10111-target,
    #manaStrengthV64Workout #manaV64Exercises .m10111-image {
      background:#101216!important;
      background-image:none!important;
      border:1px solid #697686!important;
      box-shadow:none!important;
    }
    #manaStrengthV64Workout #manaV64Exercises .m10111-kicker,
    #manaStrengthV64Workout #manaV64Exercises .m10111-ring {
      color:#FF7927!important;
      -webkit-text-fill-color:#FF7927!important;
      border-color:#FF7927!important;
    }
    #manaStrengthV64Workout #manaV64Exercises .m10111-target-name {
      color:#FFFFFF!important;
      -webkit-text-fill-color:#FFFFFF!important;
    }
    #manaStrengthV64Workout #manaV64Exercises .mana-v970-action,
    #manaStrengthV64Workout #manaV64Exercises .mana-v64-small,
    #manaStrengthV64Workout .mana-v64-close,
    #manaStrengthV64Workout .mana-v920-pause {
      background:#15171B!important;
      background-image:none!important;
      border:1px solid #697686!important;
      color:#FFFFFF!important;
      -webkit-text-fill-color:#FFFFFF!important;
      box-shadow:none!important;
    }
    #manaStrengthV64Workout #manaV64Exercises .mana-v970-action.open {
      border-color:#FF7927!important;
      color:#FF7927!important;
      -webkit-text-fill-color:#FF7927!important;
    }
    #manaStrengthV64Workout #manaV64Exercises .mana-v970-history,
    #manaStrengthV64Workout #manaV64Exercises .mana-v64-set input {
      background:#0D0F13!important;
      background-image:none!important;
      border:1px solid #697686!important;
      color:#FFFFFF!important;
      -webkit-text-fill-color:#FFFFFF!important;
      box-shadow:none!important;
    }
    #manaStrengthV64Workout #manaV64Exercises .mana-v64-table-head,
    #manaStrengthV64Workout #manaV64Exercises .mana-v970-adjust {
      color:#C1C6CE!important;
    }
    #manaStrengthV64Workout #manaV64Exercises .mana-v64-set-number {
      color:#FF7927!important;
    }
    #manaStrengthV64Workout #manaV64Exercises .mana-v64-set input:focus {
      outline:2px solid #FF7927!important;
      border-color:#FF7927!important;
    }
    #manaStrengthV64Workout #manaV64Exercises .mana-v64-check,
    #manaStrengthV64Workout .mana-v920-tick-all,
    #manaStrengthV64Workout .mana-v920-workout-all {
      background:#15171B!important;
      border:1px solid #FF7927!important;
      color:#FF7927!important;
      box-shadow:none!important;
    }
    #manaStrengthV64Workout #manaV64Exercises .mana-v64-check.done,
    #manaStrengthV64Workout .mana-v920-tick-all.done,
    #manaStrengthV64Workout .mana-v920-workout-all.done,
    #manaStrengthV64Workout #manaV64Complete {
      background:#FF7927!important;
      background-image:none!important;
      border:1px solid #FF7927!important;
      color:#08090B!important;
      -webkit-text-fill-color:#08090B!important;
    }

    /* ===== LIVE DEMO: PLAY, KEY CUES, AVOID ===== */
    #manaV970FormGuide .m10116-guide,
    #manaV970FormGuide .m10116-coaching {
      background:#101216!important;
      background-image:none!important;
      border-color:#697686!important;
    }
    #manaV970FormGuide .m10116-coaching h3,
    #manaV970FormGuide .m10116-kicker,
    #manaV970FormGuide .m10116-avoid strong,
    #manaV970FormGuide .m10111-badge,
    #manaV970FormGuide .m10111-demo-empty strong {
      color:#FF7927!important;
      -webkit-text-fill-color:#FF7927!important;
    }
    #manaV970FormGuide .m10116-title {
      color:#FFFFFF!important;
      -webkit-text-fill-color:#FFFFFF!important;
    }
    #manaV970FormGuide .m10116-subtitle,
    #manaV970FormGuide .m10116-coaching li,
    #manaV970FormGuide .m10116-avoid,
    #manaV970FormGuide .m10111-cue {
      color:#C1C6CE!important;
      -webkit-text-fill-color:#C1C6CE!important;
    }
    #manaV970FormGuide .m10111-controls {
      background:#101216!important;
      border-top:1px solid #697686!important;
    }
    #manaV970FormGuide .m10111-control {
      background:#15171B!important;
      background-image:none!important;
      border:1px solid #FF7927!important;
      color:#FF7927!important;
      -webkit-text-fill-color:#FF7927!important;
      box-shadow:none!important;
    }
    #manaV970FormGuide .m10116-coaching strong {
      color:#FF7927!important;
      -webkit-text-fill-color:#FF7927!important;
    }
    #manaV970FormGuide .m10116-close {
      background:#15171B!important;
      border:1px solid #697686!important;
      color:#FFFFFF!important;
    }

    /* ===== SESSION FEEDBACK ===== */
    #manaStrengthV64Workout #manaV922Feedback {
      background:#15171B!important;
      background-image:none!important;
      border:1px solid #697686!important;
      box-shadow:none!important;
    }
    #manaStrengthV64Workout #manaV922Feedback .mana-v922-kicker,
    #manaStrengthV64Workout #manaV922Feedback .mana-v922-history-effort {
      color:#FF7927!important;
      -webkit-text-fill-color:#FF7927!important;
      border-color:#FF7927!important;
    }
    #manaStrengthV64Workout #manaV922Feedback .mana-v922-title {
      color:#FFFFFF!important;
      -webkit-text-fill-color:#FFFFFF!important;
    }
    #manaStrengthV64Workout #manaV922Feedback .mana-v922-label,
    #manaStrengthV64Workout #manaV922Feedback .mana-v922-copy,
    #manaStrengthV64Workout #manaV922Feedback .mana-v922-history-note {
      color:#C1C6CE!important;
      -webkit-text-fill-color:#C1C6CE!important;
    }
    #manaStrengthV64Workout #manaV922Feedback .mana-v922-effort button {
      background:#0D0F13!important;
      border:1px solid #697686!important;
      color:#C1C6CE!important;
      -webkit-text-fill-color:#C1C6CE!important;
    }
    #manaStrengthV64Workout #manaV922Feedback .mana-v922-effort button.active {
      background:#FF7927!important;
      border-color:#FF7927!important;
      color:#08090B!important;
      -webkit-text-fill-color:#08090B!important;
    }
    #manaStrengthV64Workout #manaV922Feedback .mana-v922-note {
      background:#0D0F13!important;
      border:1px solid #697686!important;
      color:#FFFFFF!important;
      -webkit-text-fill-color:#FFFFFF!important;
    }

    /* ===== WORKOUT COMPLETE / SUMMARY ===== */
    #manaV915Complete .mana-v9150-hero {
      background:#15171B!important;
      background-image:none!important;
      border:1px solid #A5ADB7!important;
      box-shadow:none!important;
    }
    #manaV915Complete .mana-v9150-check,
    #manaV915Complete .mana-v9150-back,
    #manaV915Complete #manaV915Back {
      background:#FF7927!important;
      background-image:none!important;
      border:1px solid #FF7927!important;
      color:#08090B!important;
      -webkit-text-fill-color:#08090B!important;
    }
    #manaV915Complete .mana-v9150-kicker,
    #manaV915Complete .mana-v9150-value,
    #manaV915Complete .mana-v9150-pb-head,
    #manaV915Complete .mana-v9150-pb-weight {
      color:#FF7927!important;
      -webkit-text-fill-color:#FF7927!important;
    }
    #manaV915Complete .mana-v9150-stat,
    #manaV915Complete .mana-v9150-pbs,
    #manaV915Complete .mana-v9150-message {
      background:#15171B!important;
      background-image:none!important;
      border:1px solid #697686!important;
      box-shadow:none!important;
    }
    #manaV915Complete .mana-v9150-label,
    #manaV915Complete .mana-v9150-sub,
    #manaV915Complete .mana-v9150-session {
      color:#C1C6CE!important;
      -webkit-text-fill-color:#C1C6CE!important;
    }

    /* Cardio stays blue; Core becomes orange. */
    #manaV915Complete #mf450Summary .mf450-summary-card.mf450-core,
    #manaV915Complete #mf450Summary .mf450-summary-card:has(
      .mf450-summary-label
    )[style*="214,164,55"] {
      --accent:#FF7927!important;
      --tint:rgba(255,121,39,.07)!important;
      background:rgba(255,121,39,.07)!important;
      border-color:#FF7927!important;
    }
    #manaV915Complete #mf450Summary .mf450-summary-card.mf450-core
      .mf450-summary-label {
      color:#FF7927!important;
      -webkit-text-fill-color:#FF7927!important;
    }
    #manaV915Complete #mf450Summary .mf450-summary-title {
      color:#FFFFFF!important;
    }
    #manaV915Complete #mf450Summary .mf450-summary-done {
      color:#FF7927!important;
      -webkit-text-fill-color:#FF7927!important;
    }

    /* ===== WORKOUT LIST COMPLETION BADGE ===== */
    #manaV83ProgramShell #manaV83Content .mf600-complete,
    #manaV83ProgramShell #manaV83Content .mf600-complete svg,
    #manaV83ProgramShell #manaV83Content .mf600-complete-label,
    #manaV83ProgramShell #manaV83Content .mana-v85-num {
      color:#FF7927!important;
      -webkit-text-fill-color:#FF7927!important;
      stroke:#FF7927!important;
    }
    #manaV83ProgramShell #manaV83Content .mf600-complete svg circle,
    #manaV83ProgramShell #manaV83Content .mf600-complete svg path {
      stroke:#FF7927!important;
    }

    /* ===== PROFILE NOTICE AND BACK BUTTON ===== */
    #manaProfileScreen .mana-profile-head .mana-profile-close,
    #manaProfileScreen #manaProfileClose {
      width:auto!important;
      min-width:72px!important;
      min-height:38px!important;
      height:auto!important;
      padding:8px 14px!important;
      white-space:nowrap!important;
      line-height:1.25!important;
      flex-shrink:0!important;
      border:1px solid #697686!important;
      border-radius:12px!important;
      background:#15171B!important;
      color:#FFFFFF!important;
      -webkit-text-fill-color:#FFFFFF!important;
    }
    #manaProfileScreen .mana-profile-welcome,
    #manaProfileScreen .mana-profile-notice,
    #manaProfileScreen .mana-profile-banner,
    #manaProfileScreen .m1039-welcome,
    #manaProfileScreen .m1040-welcome {
      background:#15171B!important;
      background-image:none!important;
      border:1px solid #697686!important;
      color:#C1C6CE!important;
      -webkit-text-fill-color:#C1C6CE!important;
      box-shadow:none!important;
    }
    #manaProfileScreen .mana-profile-welcome strong,
    #manaProfileScreen .mana-profile-notice strong,
    #manaProfileScreen .mana-profile-banner strong {
      color:#FF7927!important;
      -webkit-text-fill-color:#FF7927!important;
    }

    /* ===== EXACT LOGIN/PROFILE WELCOME NOTE ===== */
    html body #manaProfileScreen #manaV987LoginNote,
    html body #manaProfileScreen .mana-v987-login-note {
      display:block!important;
      background:#15171B!important;
      background-color:#15171B!important;
      background-image:none!important;
      border:1px solid #697686!important;
      border-radius:14px!important;
      box-shadow:none!important;
      color:#C1C6CE!important;
      -webkit-text-fill-color:#C1C6CE!important;
      padding:15px 17px!important;
      line-height:1.5!important;
    }
    html body #manaProfileScreen #manaV987LoginNote strong,
    html body #manaProfileScreen .mana-v987-login-note strong {
      color:#FF7927!important;
      -webkit-text-fill-color:#FF7927!important;
      font-weight:900!important;
    }

    /* ===== STRENGTH OVERVIEW: WHITE ICONS ===== */
    #manaV964Launchpad .mana-v964-launch .mana-v964-icon {
      background:#171A1F!important;
      background-image:none!important;
      border:1px solid #FF7927!important;
      color:#FFFFFF!important;
      -webkit-text-fill-color:#FFFFFF!important;
      box-shadow:none!important;
      text-shadow:none!important;
    }
    #manaV964Launchpad .mana-v964-launch .mana-v964-icon img {
      filter:grayscale(1) brightness(1.8)!important;
      -webkit-filter:grayscale(1) brightness(1.8)!important;
      background:transparent!important;
      box-shadow:none!important;
    }
    #manaV964Launchpad .mana-v964-launch .mana-v964-icon svg,
    #manaV964Launchpad .mana-v964-launch .mana-v964-icon svg * {
      stroke:currentColor!important;
      color:#FFFFFF!important;
      filter:none!important;
    }
    #manaV964Launchpad #manaStrengthHubChat104080
      .mana-hub-chat-icon {
      color:#20CDD4!important;
    }

    /* ===== MOBILE-ONLY LEGACY COLOUR CLEANUP ===== */
    @media(max-width:767px) {
      #manaStrengthV64Workout .mana-v64-stat strong,
      #manaStrengthV64Workout .mana-v920-progress-badge,
      #manaStrengthV64Workout .mana-v64-set-number,
      #manaStrengthV64Workout .mana-v64-head .pill,
      #manaStrengthV64Workout .m10111-kicker,
      #manaStrengthV64Workout .m10111-ring,
      #manaStrengthV64Workout .mana-v970-action.open,
      #manaStrengthV64Workout .mana-v970-history-label,
      #manaStrengthV64Workout .mana-v970-history-copy strong {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        text-shadow:none!important;
      }
      #manaStrengthV64Workout .mana-v970-history-copy,
      #manaStrengthV64Workout .m10111-note {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      #manaStrengthV64Workout .mana-v64-card,
      #manaStrengthV64Workout .m10111-target {
        border-color:#A5ADB7!important;
        box-shadow:none!important;
      }
      #manaStrengthV64Workout .mana-v920-tick-all,
      #manaStrengthV64Workout .mana-v920-workout-all,
      #manaStrengthV64Workout .mf430Check,
      #manaStrengthV64Workout .mf430-done {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        background-color:#15171B!important;
        border-color:#FF7927!important;
        background-image:none!important;
      }
      #manaStrengthV64Workout .mana-v920-tick-all.done,
      #manaStrengthV64Workout .mana-v920-workout-all.done,
      #manaStrengthV64Workout .mf430Check.done,
      #manaStrengthV64Workout .mf430-done.done {
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        background-color:#FF7927!important;
        border-color:#FF7927!important;
      }

      /* Mobile demonstration key points */
      #manaV970FormGuide .m10111-player .m10116-coaching h3,
      #manaV970FormGuide .m10116-coaching h3,
      #manaV970FormGuide .m10116-avoid strong,
      #manaV970FormGuide .m10116-kicker,
      #manaV970FormGuide .m10111-control,
      #manaV970FormGuide .m10111-badge {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      #manaV970FormGuide .m10111-player .m10116-coaching,
      #manaV970FormGuide .m10111-controls {
        background:#101216!important;
        background-image:none!important;
        border-color:#697686!important;
      }
      #manaV970FormGuide .m10111-control {
        background:#15171B!important;
        background-image:none!important;
        border-color:#FF7927!important;
      }

      /* Mobile workout summary */
      #manaV915Complete .mana-v9150-check,
      #manaV915Complete #manaV915Back,
      #manaV915Complete .mana-v9150-back {
        background:#FF7927!important;
        background-image:none!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        border-color:#FF7927!important;
      }
      #manaV915Complete .mana-v9150-value,
      #manaV915Complete .mana-v9150-kicker,
      #manaV915Complete .mana-v9150-pb-weight,
      #manaV915Complete .mana-v9150-pb-head {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      /* Preserve blue Cardio; turn Core orange */
      #manaV915Complete #mf450Summary .mf450-summary-card:nth-child(2),
      #manaV915Complete #mf450Summary .mf450-summary-card.mf450-core {
        --accent:#FF7927!important;
        --tint:rgba(255,121,39,.07)!important;
        background:rgba(255,121,39,.07)!important;
        border-color:#FF7927!important;
      }
      #manaV915Complete #mf450Summary .mf450-summary-card:nth-child(2)
        .mf450-summary-label,
      #manaV915Complete #mf450Summary .mf450-summary-card.mf450-core
        .mf450-summary-label {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      /* Completed workout badges */
      #manaV83ProgramShell #manaV83Content .mf600-complete-label,
      #manaV83ProgramShell #manaV83Content .mf600-complete {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      #manaV83ProgramShell #manaV83Content .mf600-complete svg * {
        stroke:#FF7927!important;
      }

      /* Mobile Profile welcome note */
      #manaProfileScreen #manaV987LoginNote {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #697686!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      #manaProfileScreen #manaV987LoginNote strong {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
    }

    @media(max-width:600px) {
      #manaStrengthV64Workout #manaV64Exercises .mana-v64-card {
        padding:14px!important;
      }
      #manaProfileScreen #manaProfileClose {
        min-width:68px!important;
        padding:7px 10px!important;
      }
    }
  `;

  function install() {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
    window.MANA_PREMIUM_FINISH_BUILD = "104210";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, {once:true});
  } else {
    install();
  }
})();
