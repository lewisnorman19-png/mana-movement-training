
/* ============================================================
   MANA MOVEMENT — STRENGTH WORKOUT PAGE DESIGN 104100
   NEW FILE — visual-only upgrade for Mana Strength → Workouts.

   Keeps original workout day cards, exercise lists, start/resume
   controls, click handlers, persistence and workout state untouched.
   Does NOT affect Mana28, ManaLyfe, workout-in-progress logging,
   Fuel, Progress, Coach Hub, or the approved Strength Overview.

   Uses selectors that activate only when actual Strength workout
   cards exist; no polling, DOM replacements or event wrappers.
   ============================================================ */
(() => {
  "use strict";
  if (window.MANA_STRENGTH_WORKOUT_DESIGN_104100) return;
  window.MANA_STRENGTH_WORKOUT_DESIGN_104100 = true;

  const STYLE_ID = "manaStrengthWorkoutDesignStyle104100";

  function install() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* Only the Strength workout-list screen contains .mana-v85-day.
         All other program tabs and workouts are left unchanged. */
      html body #manaV83ProgramShell.open:has(
        #manaV83Tabs .mana-v83-tab.active[data-v83-tab="program"]
      ):has(#manaV83Content .mana-v85-day) {
        background:#08090B!important;
        color:#FFFFFF!important;
      }
      html body #manaV83ProgramShell:has(
        #manaV83Content .mana-v85-day
      ) .mana-v83-shell {
        width:min(920px,100%)!important;
        max-width:920px!important;
      }

      /* Approved runner branding using the existing program header.
         Preserve the program title ID for all workout navigation. */
      html body #manaV83ProgramShell:has(
        #manaV83Content .mana-v85-day
      ) .mana-v83-head {
        display:flex!important;
        align-items:center!important;
        justify-content:space-between!important;
        min-height:75px!important;
        height:auto!important;
        gap:14px!important;
        margin:0 0 18px!important;
        padding:0!important;
        overflow:visible!important;
      }
      html body #manaV83ProgramShell:has(
        #manaV83Content .mana-v85-day
      ) .mana-v83-brand-wrap {
        display:flex!important;
        align-items:center!important;
        gap:11px!important;
        min-width:0!important;
      }
      html body #manaV83ProgramShell:has(
        #manaV83Content .mana-v85-day
      ) .mana-v83-mark {
        display:block!important;
        flex:0 0 64px!important;
        width:64px!important;
        height:50px!important;
        border:0!important;
        box-shadow:none!important;
        background:transparent url("ui/mana-runner-logo.png?v=104100") center/contain no-repeat!important;
        color:transparent!important;
        -webkit-text-fill-color:transparent!important;
        font-size:0!important;
      }
      html body #manaV83ProgramShell:has(
        #manaV83Content .mana-v85-day
      ) .mana-v83-kicker {
        margin:0 0 3px!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:900 12px/1.1 system-ui,sans-serif!important;
        letter-spacing:.1em!important;
      }
      html body #manaV83ProgramShell:has(
        #manaV83Content .mana-v85-day
      ) #manaV83Title {
        margin:0!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        font:900 clamp(24px,3.3vw,34px)/1.08 system-ui,sans-serif!important;
        letter-spacing:.005em!important;
      }
      html body #manaV83ProgramShell:has(
        #manaV83Content .mana-v85-day
      ) #manaV83Sub {
        margin:5px 0 0!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font-size:13px!important;
      }
      html body #manaV83ProgramShell:has(
        #manaV83Content .mana-v85-day
      ) #manaV83Back {
        display:inline-flex!important;
        align-items:center!important;
        justify-content:center!important;
        min-height:38px!important;
        padding:7px 12px!important;
        flex:0 0 auto!important;
        border:1px solid #707780!important;
        border-radius:12px!important;
        background:#15171B!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:850 12px/1.2 system-ui,sans-serif!important;
        box-shadow:none!important;
      }

      /* Screen summary — goal and number of training days. */
      html body #manaV83ProgramShell #manaV83Content:has(
        .mana-v85-day
      ) .mana-v85-summary {
        margin:2px 0 19px!important;
        padding:12px 16px!important;
        border:1px solid #515A65!important;
        border-radius:14px!important;
        background:#15171B!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font:700 14px/1.5 system-ui,sans-serif!important;
      }

      /* Keep every original workout-card dimension flexible enough
         for actual day names, exercise counts and lists. */
      html body #manaV83ProgramShell #manaV83Content .mana-v85-day {
        margin:0 0 14px!important;
        padding:0!important;
        border:1px solid #A5ADB7!important;
        border-radius:20px!important;
        background:#15171B!important;
        background-image:none!important;
        box-shadow:none!important;
        overflow:hidden!important;
        color:#FFFFFF!important;
      }
      html body #manaV83ProgramShell #manaV83Content .mana-v85-day::before,
      html body #manaV83ProgramShell #manaV83Content .mana-v85-day::after {
        display:none!important;
        content:none!important;
      }
      html body #manaV83ProgramShell #manaV83Content .mana-v85-day.in-progress {
        border-color:#FF7927!important;
        background:#191A1D!important;
      }
      html body #manaV83ProgramShell #manaV83Content .mana-v85-head {
        padding:18px 19px!important;
        background:#15171B!important;
      }
      html body #manaV83ProgramShell #manaV83Content .mana-v85-day-label {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        font:900 12px/1.2 system-ui,sans-serif!important;
        letter-spacing:.12em!important;
      }
      html body #manaV83ProgramShell #manaV83Content .mana-v85-title {
        margin-top:7px!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:900 clamp(20px,3vw,25px)/1.2 system-ui,sans-serif!important;
      }
      html body #manaV83ProgramShell #manaV83Content .mana-v85-count {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        background:#20252B!important;
        border:1px solid #697686!important;
        font-size:11px!important;
      }
      html body #manaV83ProgramShell #manaV83Content .mana-v85-progress-badge {
        margin-top:12px!important;
        background:#291B11!important;
        border:1px solid #FF7927!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        font-size:11px!important;
      }
      html body #manaV83ProgramShell #manaV83Content .mana-v85-progress-time {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font-size:12px!important;
      }

      /* The exercise details remain visible, not cropped. */
      html body #manaV83ProgramShell #manaV83Content .mana-v85-exercises {
        padding:0 19px 14px!important;
        background:#15171B!important;
      }
      html body #manaV83ProgramShell #manaV83Content .mana-v85-exercise {
        padding:11px 0!important;
        border-top:1px solid #393F46!important;
        color:#E0E4E9!important;
        -webkit-text-fill-color:#E0E4E9!important;
        font-size:14px!important;
        line-height:1.4!important;
      }
      html body #manaV83ProgramShell #manaV83Content .mana-v85-num {
        background:#252B31!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        border:1px solid #515A65!important;
        width:28px!important;
        height:28px!important;
        flex:0 0 28px!important;
        font-size:12px!important;
      }

      /* Start and Resume stay as the original clickable buttons. */
      html body #manaV83ProgramShell #manaV83Content button.mana-v85-start {
        display:block!important;
        width:calc(100% - 38px)!important;
        min-height:54px!important;
        margin:0 19px 18px!important;
        padding:12px 16px!important;
        border:1px solid #FF7927!important;
        border-radius:14px!important;
        background:#FF7927!important;
        background-image:none!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        font:900 14px/1.3 system-ui,sans-serif!important;
        box-shadow:none!important;
        cursor:pointer!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        button.mana-v85-start.resume {
        background:#291B11!important;
        border-color:#FF7927!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        button.mana-v85-start:focus-visible,
      html body #manaV83ProgramShell #manaV83Back:focus-visible {
        outline:3px solid #FF7927!important;
        outline-offset:3px!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        button.mana-v85-start:hover {
        filter:brightness(.94)!important;
      }

      /* The same five bottom tab buttons remain and function
         unchanged. This visual treatment matches Strength Overview. */
      html body #manaV83ProgramShell:has(
        #manaV83Content .mana-v85-day
      ) #manaV83Tabs {
        background:rgba(8,9,11,.97)!important;
        border-top:1px solid #464D55!important;
      }
      html body #manaV83ProgramShell:has(
        #manaV83Content .mana-v85-day
      ) #manaV83Tabs button.mana-v83-tab {
        background:transparent!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        box-shadow:none!important;
      }
      html body #manaV83ProgramShell:has(
        #manaV83Content .mana-v85-day
      ) #manaV83Tabs button.mana-v83-tab.active {
        background:#20160F!important;
        border:1px solid #FF7927!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #manaV83ProgramShell:has(
        #manaV83Content .mana-v85-day
      ) #manaV83Tabs button.mana-v83-tab::before {
        background:#A5ADB7!important;
      }
      html body #manaV83ProgramShell:has(
        #manaV83Content .mana-v85-day
      ) #manaV83Tabs button.mana-v83-tab.active::before {
        background:#FF7927!important;
      }

      @media(max-width:600px) {
        html body #manaV83ProgramShell:has(
          #manaV83Content .mana-v85-day
        ) .mana-v83-head {gap:7px!important}
        html body #manaV83ProgramShell:has(
          #manaV83Content .mana-v85-day
        ) .mana-v83-mark {
          flex-basis:45px!important;
          width:45px!important;
          height:38px!important;
        }
        html body #manaV83ProgramShell:has(
          #manaV83Content .mana-v85-day
        ) #manaV83Title {font-size:24px!important}
        html body #manaV83ProgramShell:has(
          #manaV83Content .mana-v85-day
        ) .mana-v83-kicker {font-size:10px!important}
        html body #manaV83ProgramShell:has(
          #manaV83Content .mana-v85-day
        ) #manaV83Back {
          min-height:35px!important;
          padding:5px 9px!important;
          font-size:11px!important;
        }
        html body #manaV83ProgramShell #manaV83Content .mana-v85-head {
          padding:15px!important;
        }
        html body #manaV83ProgramShell #manaV83Content .mana-v85-exercises {
          padding:0 15px 12px!important;
        }
        html body #manaV83ProgramShell #manaV83Content .mana-v85-exercise {
          font-size:13px!important;
        }
        html body #manaV83ProgramShell #manaV83Content button.mana-v85-start {
          width:calc(100% - 30px)!important;
          margin:0 15px 15px!important;
        }
      }
    `;
    document.head.appendChild(style);
    window.MANA_STRENGTH_WORKOUT_DESIGN_BUILD = "104100";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded",install,{once:true});
  } else {
    install();
  }
})();
