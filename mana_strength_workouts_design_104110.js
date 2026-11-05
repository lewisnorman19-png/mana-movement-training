
/* ============================================================
   MANA MOVEMENT — STRENGTH WORKOUT PAGE DESIGN 104110 — FULL REPLACEMENT
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
  if (window.MANA_STRENGTH_WORKOUT_DESIGN_104110) return;
  window.MANA_STRENGTH_WORKOUT_DESIGN_104110 = true;

  const STYLE_ID = "manaStrengthWorkoutDesignStyle104110";

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
        background:transparent url("ui/mana-runner-logo.png?v=104110") center/contain no-repeat!important;
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

      /* ============================================
         104110 — EXACT STRENGTH OVERVIEW HEADER
         ============================================ */
      html body #manaV83ProgramShell.open:has(
        #manaV83Tabs [data-v83-tab="program"].active
      ):has(#manaV83Content .mana-v85-day) {
        padding-top:calc(env(safe-area-inset-top) + 3px)!important;
      }
      /* Keep the original state-bearing header and its title in
         the DOM but do not duplicate the branding visually. */
      html body #manaV83ProgramShell:has(#manaV83Content .mana-v85-day)
        .mana-v83-head {
        display:none!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        #manaStrengthWorkoutBrand104110 {
        display:block!important;
        width:100%!important;
        margin:0 0 12px!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        .msw-brand {
        display:flex!important;
        align-items:center!important;
        gap:12px!important;
        min-width:0!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        .msw-runner {
        flex:0 0 76px!important;
        width:76px!important;
        height:56px!important;
        background:transparent url("ui/mana-runner-logo.png?v=104110") center/contain no-repeat!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        .msw-brand-name {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:900 clamp(34px,5.2vw,53px)/1.05 system-ui,sans-serif!important;
        letter-spacing:.015em!important;
        white-space:nowrap!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        .msw-brand-name span {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        .msw-brand-tag {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font:750 10px/1.25 system-ui,sans-serif!important;
        letter-spacing:.12em!important;
        margin:4px 0 0!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        .msw-overview-row {
        display:flex!important;
        justify-content:flex-end!important;
        margin:4px 0 14px!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        #manaStrengthWorkoutOverview104110 {
        min-height:34px!important;
        padding:6px 14px!important;
        border:1px solid #697686!important;
        border-radius:11px!important;
        background:#15171B!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:850 12px/1.2 system-ui,sans-serif!important;
        cursor:pointer!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        #manaStrengthWorkoutOverview104110:focus-visible {
        outline:2px solid #FF7927!important;
        outline-offset:3px!important;
      }
      /* ============================================
         WEEK SELECTOR — ORANGE / BLACK / SILVER
         ============================================ */
      html body #manaV83ProgramShell #manaV83Content
        #manaV1017ProgramBlock {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        border-radius:20px!important;
        box-shadow:none!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        #manaV1017ProgramBlock .m1017-block-top {
        background:transparent!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        #manaV1017ProgramBlock .m1017-kicker {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        #manaV1017ProgramBlock .m1017-title {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        #manaV1017ProgramBlock .m1017-sub {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        #manaV1017ProgramBlock .m1017-week {
        border:1px solid #697686!important;
        border-radius:13px!important;
        background:#0D0F13!important;
        background-image:none!important;
        box-shadow:none!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font-size:11px!important;
        font-weight:900!important;
        cursor:pointer!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        #manaV1017ProgramBlock .m1017-week.active {
        border-color:#FF7927!important;
        background:#291B11!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        box-shadow:inset 0 0 0 1px #FF7927!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        #manaV1017ProgramBlock .m1017-week:focus-visible {
        outline:2px solid #FF7927!important;
        outline-offset:2px!important;
      }
      /* ============================================
         PROGRAM UPGRADE — MATCH THE TEAL CHAT CARD
         ============================================ */
      html body #manaV83ProgramShell #manaV83Content
        #manaV1017ProgramBlock .m1017-request {
        border-top:1px solid #20CDD4!important;
        background:#102024!important;
        padding:17px 18px!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        #manaV1017ProgramBlock .m1017-request-title {
        color:#20CDD4!important;
        -webkit-text-fill-color:#20CDD4!important;
        font-size:15px!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        #manaV1017ProgramBlock .m1017-request-text {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font-size:12px!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        #manaV1017ProgramBlock .m1017-request-btn {
        border:1px solid #20CDD4!important;
        border-radius:12px!important;
        background:#20CDD4!important;
        background-image:none!important;
        color:#081216!important;
        -webkit-text-fill-color:#081216!important;
        box-shadow:none!important;
        font-size:11px!important;
      }
      html body #manaV83ProgramShell #manaV83Content
        #manaV1017ProgramBlock .m1017-request-btn:disabled {
        opacity:.65!important;
      }
      @media(max-width:650px) {
        html body #manaV83ProgramShell #manaV83Content .msw-runner {
          width:48px!important; height:40px!important; flex-basis:48px!important;
        }
        html body #manaV83ProgramShell #manaV83Content .msw-brand {
          gap:7px!important;
        }
        html body #manaV83ProgramShell #manaV83Content .msw-brand-name {
          font-size:clamp(24px,7vw,35px)!important;
        }
        html body #manaV83ProgramShell #manaV83Content .msw-brand-tag {
          font-size:9px!important;
        }
        html body #manaV83ProgramShell #manaV83Content
          #manaV1017ProgramBlock .m1017-weeks {
          gap:5px!important; padding:0 10px 12px!important;
        }
        html body #manaV83ProgramShell #manaV83Content
          #manaV1017ProgramBlock .m1017-week {
          min-height:42px!important; font-size:10px!important;
        }
        html body #manaV83ProgramShell #manaV83Content
          #manaV1017ProgramBlock .m1017-request-head {
          flex-wrap:wrap!important;
        }
        html body #manaV83ProgramShell #manaV83Content
          #manaV1017ProgramBlock .m1017-request-btn {
          min-height:43px!important; width:100%!important;
        }
      }
    `;
    document.head.appendChild(style);
    window.MANA_STRENGTH_WORKOUT_DESIGN_BUILD = "104110";
  }


  function onWorkoutList() {
    const shell = document.getElementById("manaV83ProgramShell");
    const title = document.getElementById("manaV83Title");
    return Boolean(
      shell?.classList.contains("open") &&
      title?.textContent?.trim().toUpperCase() === "MANA STRENGTH" &&
      document.querySelector('#manaV83Tabs .mana-v83-tab.active[data-v83-tab="program"]') &&
      document.querySelector("#manaV83Content .mana-v85-day")
    );
  }

  function ensureHeading() {
    if (!onWorkoutList()) return;
    const holder = document.getElementById("manaV83Content");
    if (!holder) return;

    if (!holder.querySelector("#manaStrengthWorkoutBrand104110")) {
      const heading = document.createElement("div");
      heading.id = "manaStrengthWorkoutBrand104110";
      heading.innerHTML = `
        <div class="msw-brand">
          <div class="msw-runner" aria-hidden="true"></div>
          <div>
            <div class="msw-brand-name">MANA <span>MOVEMENT</span></div>
            <div class="msw-brand-tag">TRAINING · MOVE WITH PURPOSE</div>
          </div>
        </div>
        <div class="msw-overview-row">
          <button type="button" id="manaStrengthWorkoutOverview104110">⌂ Overview</button>
        </div>
      `;
      holder.prepend(heading);
    }

    // The old yellow PROFILE is a redundant shortcut, not the
    // Profile/Goals card on the Overview. Hide this screen's shortcut only.
    const shell = document.getElementById("manaV83ProgramShell");
    shell?.querySelectorAll("button").forEach(button => {
      if (holder.contains(button) || document.getElementById("manaV83Tabs")?.contains(button)) return;
      if (button.id === "manaV83Back") return;
      if (button.textContent?.trim().toUpperCase() === "PROFILE") {
        button.style.setProperty("display","none","important");
        button.dataset.mswHiddenProfile = "1";
      }
    });
  }

  function setup() {
    install();
    const holder = document.getElementById("manaV83Content");
    // Observe only direct content replacements of the workout tab.
    if (holder) {
      let scheduled = false;
      const observer = new MutationObserver(() => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
          scheduled = false;
          ensureHeading();
        });
      });
      observer.observe(holder,{childList:true});
    }
    document.addEventListener("click",event => {
      if (event.target.closest("#manaStrengthWorkoutOverview104110")) {
        document.querySelector('#manaV83Tabs [data-v83-tab="overview"]')?.click();
      }
      if (event.target.closest("#manaV83Tabs .mana-v83-tab")) {
        requestAnimationFrame(() => {
          const shell = document.getElementById("manaV83ProgramShell");
          shell?.querySelectorAll('[data-msw-hidden-profile="1"]').forEach(button => {
            button.style.removeProperty("display");
            delete button.dataset.mswHiddenProfile;
          });
          ensureHeading();
        });
      }
    });
    window.addEventListener("mana:program-tab-change",ensureHeading);
    ensureHeading();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded",setup,{once:true});
  } else {
    setup();
  }
})();
