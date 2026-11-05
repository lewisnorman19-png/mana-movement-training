
/* ==========================================================
   MANA MOVEMENT — STRENGTH WORKOUT DESIGN 104140
   COMPLETE standalone file; REPLACES 104110 entirely.

   Corrects:
   1. Stable CSS positioning: branding stays above week selector
   2. Actual v10.18 upgrade panel uses teal Coach Chat colours
   3. All bottom tabs use Overview's orange / silver appearance

   Preserves the real Strength workout engine, v10.17 week selector,
   v10.18 program upgrade actions, logs, demonstrations and routing.
   This module never replaces original workout or week markup.
   ========================================================== */
(() => {
  "use strict";

  if (window.MANA_STRENGTH_WORKOUTS_104140) return;
  window.MANA_STRENGTH_WORKOUTS_104140 = true;

  const STYLE = "mana-strength-workouts-style-104140";
  const BRAND = "manaStrengthWorkoutBrand104140";
  const BACK = "manaStrengthWorkoutOverview104140";
  const SHELL = "manaV83ProgramShell";
  const CONTENT = "manaV83Content";
  const $ = id => document.getElementById(id);

  function workoutScreen() {
    const shell = $(SHELL);
    return Boolean(
      shell?.classList.contains("open") &&
      $("manaV83Title")?.textContent?.trim().toUpperCase() === "MANA STRENGTH" &&
      shell.querySelector('#manaV83Tabs .mana-v83-tab.active[data-v83-tab="program"]') &&
      $(CONTENT)?.querySelector(".mana-v85-day")
    );
  }

  function styles() {
    if ($(STYLE)) return;
    const tag = document.createElement("style");
    tag.id = STYLE;
    tag.textContent = `
      /* All changes require the real Strength workout list.
         Other tabs/programs and the actual workout logger are untouched. */
      html body #${SHELL}.open:has(#${CONTENT} .mana-v85-day) {
        background:#08090B!important;
        color:#FFFFFF!important;
        padding-top:calc(env(safe-area-inset-top) + 3px)!important;
      }
      html body #${SHELL}:has(#${CONTENT} .mana-v85-day)
        .mana-v83-shell {
        width:min(920px,100%)!important;
        max-width:920px!important;
      }
      /* Keep original header in the DOM for app state, not on screen.
         It contains the old PROFILE button and redundant branding. */
      html body #${SHELL}:has(#${CONTENT} .mana-v85-day)
        .mana-v83-head {
        display:none!important;
      }

      /* Stable visual ordering, independent of v10.17/v10.18
         prepend operations. No endless DOM move loop. */
      html body #${SHELL}.open:has(#${CONTENT} .mana-v85-day)
        #${CONTENT} {
        display:flex!important;
        flex-direction:column!important;
        align-items:stretch!important;
      }
      html body #${SHELL}.open:has(#${CONTENT} .mana-v85-day)
        #${CONTENT} > * {
        order:0;
        min-width:0;
        flex-shrink:0;
      }
      html body #${SHELL}.open:has(#${CONTENT} .mana-v85-day)
        #${CONTENT} > #${BRAND} {
        order:-100!important;
      }

      /* The approved Overview branding, ABOVE Week 1–4. */
      html body #${SHELL} #${CONTENT} #${BRAND} {
        display:block!important;
        width:100%!important;
        margin:0 0 14px!important;
      }
      html body #${SHELL} #${CONTENT} .msw-brand {
        display:flex!important;
        align-items:center!important;
        gap:12px!important;
        min-width:0!important;
      }
      html body #${SHELL} #${CONTENT} .msw-runner {
        display:block!important;
        flex:0 0 76px!important;
        width:76px!important;
        height:56px!important;
        background:transparent url("ui/mana-runner-logo.png?v=104140") center/contain no-repeat!important;
      }
      html body #${SHELL} #${CONTENT} .msw-brand-copy {min-width:0!important}
      html body #${SHELL} #${CONTENT} .msw-brand-name {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:900 clamp(34px,5.2vw,53px)/1.05 system-ui,sans-serif!important;
        letter-spacing:.015em!important;
        white-space:nowrap!important;
      }
      html body #${SHELL} #${CONTENT} .msw-brand-name span {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #${SHELL} #${CONTENT} .msw-brand-tag {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font:750 10px/1.25 system-ui,sans-serif!important;
        letter-spacing:.12em!important;
        margin:4px 0 0!important;
      }
      html body #${SHELL} #${CONTENT} .msw-overview-row {
        display:flex!important;
        justify-content:flex-end!important;
        margin:4px 0 10px!important;
      }
      html body #${SHELL} #${CONTENT} #${BACK} {
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
      html body #${SHELL} #${CONTENT} #${BACK}:focus-visible {
        outline:2px solid #FF7927!important;
        outline-offset:3px!important;
      }

      /* Week selector — charcoal / silver, selected Week orange border only, no brown/yellow fill. */
      html body #${SHELL} #${CONTENT} #manaV1017ProgramBlock {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        box-shadow:none!important;
        border-radius:20px!important;
      }
      html body #${SHELL} #${CONTENT} #manaV1017ProgramBlock
        .m1017-kicker {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #${SHELL} #${CONTENT} #manaV1017ProgramBlock
        .m1017-title {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      html body #${SHELL} #${CONTENT} #manaV1017ProgramBlock
        .m1017-sub {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      html body #${SHELL} #${CONTENT} #manaV1017ProgramBlock
        button.m1017-week {
        background:#0D0F13!important;
        background-image:none!important;
        border:1px solid #697686!important;
        box-shadow:none!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      html body #${SHELL} #${CONTENT} #manaV1017ProgramBlock
        button.m1017-week.active {
        background:#0D0F13!important;
        background-image:none!important;
        border:1px solid #FF7927!important;
        box-shadow:none!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      /* Actual Workout Day cards, never recreated by this module. */
      html body #${SHELL} #${CONTENT} .mana-v85-summary {
        background:#15171B!important;
        border:1px solid #515A65!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        border-radius:14px!important;
        padding:12px 16px!important;
        margin:2px 0 19px!important;
      }
      html body #${SHELL} #${CONTENT} .mana-v85-day {
        margin:0 0 14px!important;
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        border-radius:20px!important;
        box-shadow:none!important;
        color:#FFFFFF!important;
        overflow:hidden!important;
      }
      html body #${SHELL} #${CONTENT} .mana-v85-day::before,
      html body #${SHELL} #${CONTENT} .mana-v85-day::after {
        display:none!important;
        content:none!important;
      }
      html body #${SHELL} #${CONTENT} .mana-v85-day.in-progress {
        border-color:#FF7927!important;
      }
      html body #${SHELL} #${CONTENT} .mana-v85-head,
      html body #${SHELL} #${CONTENT} .mana-v85-exercises {
        background:#15171B!important;
      }
      html body #${SHELL} #${CONTENT} .mana-v85-day-label,
      html body #${SHELL} #${CONTENT} .mana-v964-open-label {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #${SHELL} #${CONTENT} .mana-v85-title {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      html body #${SHELL} #${CONTENT} .mana-v85-exercise {
        color:#E0E4E9!important;
        -webkit-text-fill-color:#E0E4E9!important;
        border-top:1px solid #393F46!important;
      }
      html body #${SHELL} #${CONTENT} .mana-v85-num {
        background:#252B31!important;
        border:1px solid #515A65!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #${SHELL} #${CONTENT} .mana-v85-count {
        background:#20252B!important;
        border:1px solid #697686!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      html body #${SHELL} #${CONTENT} .mana-v85-progress-badge {
        border:1px solid #FF7927!important;
        background:#291B11!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #${SHELL} #${CONTENT} .mana-v85-progress-time {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      html body #${SHELL} #${CONTENT} button.mana-v85-start {
        border:1px solid #FF7927!important;
        background:#FF7927!important;
        background-image:none!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        box-shadow:none!important;
        border-radius:14px!important;
        min-height:54px!important;
      }
      html body #${SHELL} #${CONTENT} button.mana-v85-start.resume {
        background:#291B11!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      /* v10.18 owns the gold bottom upgrade card — NOT v10.17.
         Retain its state classes, request button and onclick logic. */
      html body #${SHELL} #${CONTENT}
        #manaV1018UpgradeExperience {
        background:#102024!important;
        background-image:none!important;
        border:1px solid #20CDD4!important;
        box-shadow:none!important;
        border-radius:20px!important;
        color:#FFFFFF!important;
      }
      html body #${SHELL} #${CONTENT}
        #manaV1018UpgradeExperience::before {
        background:#20CDD4!important;
        opacity:.65!important;
      }
      html body #${SHELL} #${CONTENT}
        #manaV1018UpgradeExperience .m1018-upgrade-kicker {
        color:#20CDD4!important;
        -webkit-text-fill-color:#20CDD4!important;
      }
      html body #${SHELL} #${CONTENT}
        #manaV1018UpgradeExperience .m1018-upgrade-title {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      html body #${SHELL} #${CONTENT}
        #manaV1018UpgradeExperience .m1018-upgrade-text {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      html body #${SHELL} #${CONTENT}
        #manaV1018UpgradeExperience .m1018-upgrade-action {
        background:#20CDD4!important;
        background-image:none!important;
        border:1px solid #20CDD4!important;
        color:#081216!important;
        -webkit-text-fill-color:#081216!important;
        box-shadow:none!important;
      }
      html body #${SHELL} #${CONTENT}
        #manaV1018UpgradeExperience .m1018-upgrade-action:disabled {
        opacity:.65!important;
        cursor:default!important;
      }

      /* Match APPROVED Strength Overview bottom navigation, including
         colours in the old per-tab-icon implementation (v10.25). */
      html body #${SHELL}.open:has(#${CONTENT} .mana-v85-day)
        #manaV83Tabs {
        background:rgba(8,9,11,.97)!important;
        border-top:1px solid #464D55!important;
        box-shadow:none!important;
      }
      html body #${SHELL}.open:has(#${CONTENT} .mana-v85-day)
        #manaV83Tabs .mana-v83-tab {
        --m25-tab:#C1C6CE!important;
        border:1px solid transparent!important;
        background:transparent!important;
        box-shadow:none!important;
        opacity:1!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        text-shadow:none!important;
      }
      html body #${SHELL}.open:has(#${CONTENT} .mana-v85-day)
        #manaV83Tabs .mana-v83-tab.active {
        --m25-tab:#FF7927!important;
        border:1px solid #FF7927!important;
        border-radius:12px!important;
        background:#20160F!important;
        box-shadow:none!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #${SHELL}.open:has(#${CONTENT} .mana-v85-day)
        #manaV83Tabs .mana-v83-tab::before {
        background:#A5ADB7!important;
        box-shadow:none!important;
        opacity:1!important;
      }
      html body #${SHELL}.open:has(#${CONTENT} .mana-v85-day)
        #manaV83Tabs .mana-v83-tab.active::before {
        background:#FF7927!important;
        box-shadow:none!important;
      }
      html body #${SHELL}.open:has(#${CONTENT} .mana-v85-day)
        #manaV83Tabs .mana-v83-tab:not(.active) .m10140-tab-icon,
      html body #${SHELL}.open:has(#${CONTENT} .mana-v85-day)
        #manaV83Tabs .mana-v83-tab:not(.active) img {
        filter:grayscale(1) brightness(1.65)!important;
        opacity:.85!important;
      }
      html body #${SHELL}.open:has(#${CONTENT} .mana-v85-day)
        #manaV83Tabs .mana-v83-tab.active .m10140-tab-icon,
      html body #${SHELL}.open:has(#${CONTENT} .mana-v85-day)
        #manaV83Tabs .mana-v83-tab.active img {
        filter:grayscale(1) brightness(0) saturate(100%) invert(56%) sepia(84%) saturate(1242%) hue-rotate(342deg) brightness(105%) contrast(101%)!important;
        opacity:1!important;
      }
      html body #${SHELL}.open:has(#${CONTENT} .mana-v85-day)
        #manaV83Tabs .mana-v83-tab svg,
      html body #${SHELL}.open:has(#${CONTENT} .mana-v85-day)
        #manaV83Tabs .mana-v83-tab svg * {
        color:inherit!important;
        stroke:currentColor!important;
      }

      @media(max-width:650px) {
        html body #${SHELL} #${CONTENT} .msw-brand {gap:7px!important}
        html body #${SHELL} #${CONTENT} .msw-runner {
          width:48px!important;
          height:40px!important;
          flex-basis:48px!important;
        }
        html body #${SHELL} #${CONTENT} .msw-brand-name {
          font-size:clamp(24px,7vw,35px)!important;
        }
        html body #${SHELL} #${CONTENT} .msw-brand-tag {
          font-size:9px!important;
        }
        html body #${SHELL} #${CONTENT}
          #manaV1017ProgramBlock .m1017-weeks {
          gap:5px!important;
          padding:0 10px 12px!important;
        }
        html body #${SHELL} #${CONTENT}
          #manaV1017ProgramBlock .m1017-week {
          min-height:42px!important;
          font-size:10px!important;
        }
        html body #${SHELL} #${CONTENT}
          #manaV1018UpgradeExperience {
          padding:15px!important;
        }
        html body #${SHELL} #${CONTENT}
          #manaV1018UpgradeExperience .m1018-upgrade-title {
          font-size:20px!important;
        }
      }
    `;
    document.head.appendChild(tag);
  }

  /* The week selector prepends its own node on refresh.
     We never reorder DOM children. CSS order:-100 keeps
     branding above the week selector permanently. */
  function ensureBrand() {
    if (!workoutScreen()) return;
    const holder = $(CONTENT);
    if (!holder) return;
    let brand = $(BRAND);

    if (!brand || !holder.contains(brand)) {
      brand = document.createElement("div");
      brand.id = BRAND;
      brand.innerHTML = `
        <div class="msw-brand">
          <div class="msw-runner" aria-hidden="true"></div>
          <div class="msw-brand-copy">
            <div class="msw-brand-name">MANA <span>MOVEMENT</span></div>
            <div class="msw-brand-tag">TRAINING · MOVE WITH PURPOSE</div>
          </div>
        </div>
        <div class="msw-overview-row">
          <button id="${BACK}" type="button">⌂ Overview</button>
        </div>`;
    }
    if (brand.parentElement !== holder) {
      // Append without moving an existing node.
      // CSS order:-100 keeps the branding visually first,
      // regardless of week selector later prepends.
      holder.appendChild(brand);
    }
  }

  function init() {
    styles();

    // Narrow watcher: recreates branding only if the workout list
    // is rebuilt and branding genuinely disappeared.
    const attach = () => {
      const holder = $(CONTENT);
      if (!holder) return;
      const watcher = new MutationObserver(() => {
        if (workoutScreen()) ensureBrand();
      });
      watcher.observe(holder,{childList:true});
      ensureBrand();
    };
    attach();

    document.addEventListener("click",event => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("#"+BACK)) {
        // Existing Overview tab handler controls navigation.
        document.querySelector('#manaV83Tabs [data-v83-tab="overview"]')?.click();
      }
      if (event.target.closest("#manaV83Tabs .mana-v83-tab")) {
        requestAnimationFrame(ensureBrand);
      }
    });
    window.addEventListener("mana:program-tab-change",ensureBrand);
    window.addEventListener("mana:training-week-change",ensureBrand);
    window.MANA_STRENGTH_WORKOUTS_BUILD = "104140";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded",init,{once:true});
  } else {
    init();
  }
})();
