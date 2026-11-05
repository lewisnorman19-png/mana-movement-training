
/* ==========================================================
   MANA MOVEMENT — STRENGTH FUEL DESIGN 104261
   COMPLETE STANDALONE JAVASCRIPT FILE

   Fuel page styling only: header, bottom tabs, meal cards,
   meal picker, daily targets and logged meals.

   Retains the existing Fuel engine and all meal, calorie,
   protein, water and recovery behaviour. No data writes.
   Only activates inside the Mana Strength Fuel tab.
   ========================================================== */
(() => {
  "use strict";

  if (window.MANA_STRENGTH_FUEL_DESIGN_104261) return;
  window.MANA_STRENGTH_FUEL_DESIGN_104261 = true;

  const STYLE_ID = "mana-strength-fuel-style-104261";
  const HEADER_ID = "manaStrengthFuelHeader104261";
  const BACK_ID = "manaStrengthFuelOverview104261";
  const CONTENT_ID = "manaV83Content";
  const SHELL_ID = "manaV83ProgramShell";
  const ROOT_ID = "manaV1015Fuel";

  function fuelIsOpen() {
    const shell = document.getElementById(SHELL_ID);
    const content = document.getElementById(CONTENT_ID);
    return Boolean(
      shell && shell.classList.contains("open") &&
      document.getElementById("manaV83Title")?.textContent
        ?.trim().toUpperCase() === "MANA STRENGTH" &&
      shell.querySelector('#manaV83Tabs .mana-v83-tab.active[data-v83-tab="fuel"]') &&
      content?.querySelector("#" + ROOT_ID)
    );
  }

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* All selectors are scoped to the Strength Fuel shell. */
      html body #${SHELL_ID}.open:has(#${ROOT_ID}) {
        background:#08090B!important;
        color:#FFFFFF!important;
        padding-top:calc(env(safe-area-inset-top) + 3px)!important;
      }
      html body #${SHELL_ID}:has(#${ROOT_ID}) .mana-v83-shell {
        width:min(920px,100%)!important;
        max-width:920px!important;
      }
      /* Hide the obsolete gold header and PROFILE shortcut.
         Preserve their DOM state and the existing tab handlers. */
      html body #${SHELL_ID}:has(#${ROOT_ID}) .mana-v83-head {
        display:none!important;
      }

      /* Put branding above Fuel, even if old scripts prepend content. */
      html body #${SHELL_ID}.open:has(#${ROOT_ID}) #${CONTENT_ID} {
        display:flex!important;
        flex-direction:column!important;
        align-items:stretch!important;
      }
      html body #${SHELL_ID}.open:has(#${ROOT_ID}) #${CONTENT_ID} > * {
        order:0;
        min-width:0;
      }
      html body #${SHELL_ID}.open:has(#${ROOT_ID})
        #${CONTENT_ID} > #${HEADER_ID} {
        order:-100!important;
      }

      html body #${SHELL_ID} #${HEADER_ID} {
        margin:0 0 13px!important;
        width:100%!important;
        color:#FFFFFF!important;
      }
      html body #${SHELL_ID} #${HEADER_ID} .msf-brand {
        display:flex!important;
        align-items:center!important;
        gap:12px!important;
        min-width:0;
      }
      html body #${SHELL_ID} #${HEADER_ID} .msf-runner {
        flex:0 0 76px!important;
        width:76px!important;
        height:56px!important;
        background:transparent url("ui/mana-runner-logo.png") center/contain no-repeat!important;
      }
      html body #${SHELL_ID} #${HEADER_ID} .msf-copy {min-width:0}
      html body #${SHELL_ID} #${HEADER_ID} .msf-brand-name {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:900 clamp(34px,5.2vw,53px)/1.05 system-ui,sans-serif!important;
        letter-spacing:.015em!important;
        white-space:nowrap!important;
      }
      html body #${SHELL_ID} #${HEADER_ID} .msf-brand-name span {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #${SHELL_ID} #${HEADER_ID} .msf-tag {
        margin:4px 0 0!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font:750 10px/1.25 system-ui,sans-serif!important;
        letter-spacing:.12em!important;
      }
      html body #${SHELL_ID} #${HEADER_ID} .msf-overview-row {
        display:flex!important;
        justify-content:flex-end!important;
        margin:4px 0 10px!important;
      }
      html body #${SHELL_ID} #${BACK_ID} {
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
      html body #${SHELL_ID} #${BACK_ID}:focus-visible {
        outline:2px solid #FF7927!important;
        outline-offset:3px!important;
      }

      /* Keep the original Fuel layout and complete functionality. */
      html body #${SHELL_ID} #${ROOT_ID} {
        width:100%!important;
        min-width:0!important;
        color:#FFFFFF!important;
        --mana-fuel-orange:#FF7927;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-kicker {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-hero h2,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-section-head h3,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-modal-head h3 {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-hero p,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-section-head p,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-category-copy small,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-logged p,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-option p {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      /* Main Fuel sections: premium charcoal, silver border. */
      html body #${SHELL_ID} #${ROOT_ID} .m1022-card {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        border-radius:20px!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-category {
        background:#0D0F13!important;
        background-image:none!important;
        border:1px solid #697686!important;
        border-radius:16px!important;
        box-shadow:none!important;
        color:#FFFFFF!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-category:focus-visible,
      html body #${SHELL_ID} #${ROOT_ID} button:focus-visible {
        outline:2px solid #FF7927!important;
        outline-offset:2px!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-category-copy strong,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-category-arrow {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      /* Logged meals, quantities, meal chips and remove button. */
      html body #${SHELL_ID} #${ROOT_ID} .m1022-logged,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-empty {
        background:#0D0F13!important;
        border:1px solid #697686!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-logged-art,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-option-art {
        border:1px solid #697686!important;
        background:#08090B!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-meal-chip {
        background:#FF7927!important;
        background-image:none!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-macro {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        background:#15171B!important;
        border:1px solid #697686!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-logged h4,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-option h4,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-empty strong {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-remove {
        border:1px solid #945050!important;
        background:#231515!important;
        color:#FF8686!important;
      }

      /* Calories and protein use orange. Water and recovery keep
         their established blue/purple progress meaning. */
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target {
        background:#0D0F13!important;
        background-image:none!important;
        border:1px solid #697686!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target-icon {
        background:#191C21!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target.calories .m1022-target-icon,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target.protein .m1022-target-icon {
        color:#FF7927!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target-label,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target-value span {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target-value {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-bar {
        background:#252B31!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target.calories .m1022-bar span,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target.protein .m1022-bar span {
        background:#FF7927!important;
        background-image:none!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target.water .m1022-bar span {
        background:#42B8FF!important;
        background-image:none!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target.recovery .m1022-bar span {
        background:#A77BFF!important;
        background-image:none!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-control-row button {
        border:1px solid #697686!important;
        border-radius:10px!important;
        background:#191C21!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        box-shadow:none!important;
      }

      /* Meal picker modal: retain illustrations and meal selection. */
      html body #${SHELL_ID} #${ROOT_ID} .m1022-modal {
        background:#101216!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-option {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #697686!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-option-macros {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-add {
        background:#FF7927!important;
        background-image:none!important;
        border:1px solid #FF7927!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-custom-grid input {
        background:#0D0F13!important;
        border:1px solid #697686!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-custom-grid input:focus {
        outline:2px solid #FF7927!important;
        border-color:#FF7927!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-close {
        background:#15171B!important;
        border:1px solid #697686!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      /* Strength bottom tabs use the same orange/silver language
         as approved Overview and Workouts, preserving their icons. */
      html body #${SHELL_ID}.open:has(#${ROOT_ID}) #manaV83Tabs {
        background:rgba(8,9,11,.97)!important;
        border-top:1px solid #464D55!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID}.open:has(#${ROOT_ID})
        #manaV83Tabs .mana-v83-tab {
        --m25-tab:#C1C6CE!important;
        background:transparent!important;
        border:1px solid transparent!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        opacity:1!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID}.open:has(#${ROOT_ID})
        #manaV83Tabs .mana-v83-tab.active {
        --m25-tab:#FF7927!important;
        border:1px solid #FF7927!important;
        border-radius:12px!important;
        background:#20160F!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID}.open:has(#${ROOT_ID})
        #manaV83Tabs .mana-v83-tab::before {
        background:#A5ADB7!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID}.open:has(#${ROOT_ID})
        #manaV83Tabs .mana-v83-tab.active::before {
        background:#FF7927!important;
      }
      html body #${SHELL_ID}.open:has(#${ROOT_ID})
        #manaV83Tabs .mana-v83-tab:not(.active) img {
        filter:grayscale(1) brightness(1.65)!important;
        opacity:.85!important;
      }
      html body #${SHELL_ID}.open:has(#${ROOT_ID})
        #manaV83Tabs .mana-v83-tab.active img {
        filter:grayscale(1) brightness(1.6)!important;
        opacity:1!important;
      }
      html body #${SHELL_ID}.open:has(#${ROOT_ID})
        #manaV83Tabs .mana-v83-tab svg,
      html body #${SHELL_ID}.open:has(#${ROOT_ID})
        #manaV83Tabs .mana-v83-tab svg * {
        stroke:currentColor!important;
        color:inherit!important;
      }


      /* Desktop meal images: trim their height so laptop cards feel tighter,
         while leaving the phone layout untouched. */
      @media(min-width:651px) {
        html body #${SHELL_ID} #${ROOT_ID} .m1022-category-art,
        html body #${SHELL_ID} #${ROOT_ID} .m1022-category-image,
        html body #${SHELL_ID} #${ROOT_ID} .m1022-category-media {
          height:118px!important;
          min-height:118px!important;
          max-height:118px!important;
          overflow:hidden!important;
        }
        html body #${SHELL_ID} #${ROOT_ID} .m1022-category-art img,
        html body #${SHELL_ID} #${ROOT_ID} .m1022-category-image img,
        html body #${SHELL_ID} #${ROOT_ID} .m1022-category-media img {
          width:100%!important;
          height:100%!important;
          object-fit:cover!important;
          object-position:center!important;
          display:block!important;
        }
      }

      /* Orange selection ticks across laptop and phone. */
      html body #${SHELL_ID} #${ROOT_ID} .m1022-category [class*="tick"],
      html body #${SHELL_ID} #${ROOT_ID} .m1022-category [class*="check"],
      html body #${SHELL_ID} #${ROOT_ID} .m1022-option [class*="tick"],
      html body #${SHELL_ID} #${ROOT_ID} .m1022-option [class*="check"] {
        color:#FF7927!important;
        border-color:#FF7927!important;
      }
      html body #${SHELL_ID} #${ROOT_ID} .m1022-category [class*="tick"] svg,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-category [class*="check"] svg,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-option [class*="tick"] svg,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-option [class*="check"] svg,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-category [class*="tick"] svg *,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-category [class*="check"] svg *,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-option [class*="tick"] svg *,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-option [class*="check"] svg * {
        color:#FF7927!important;
        fill:#FF7927!important;
        stroke:#FF7927!important;
      }

      /* All daily target icons move to orange on laptop and phone. */
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target .m1022-target-icon,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target .m1022-target-icon *,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target.calories .m1022-target-icon,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target.calories .m1022-target-icon *,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target.protein .m1022-target-icon,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target.protein .m1022-target-icon *,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target.water .m1022-target-icon,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target.water .m1022-target-icon *,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target.recovery .m1022-target-icon,
      html body #${SHELL_ID} #${ROOT_ID} .m1022-target.recovery .m1022-target-icon * {
        color:#FF7927!important;
        fill:#FF7927!important;
        stroke:#FF7927!important;
      }

      /* Existing responsive Fuel layout is not changed. */
      @media(max-width:650px) {
        html body #${SHELL_ID} #${HEADER_ID} .msf-brand {
          gap:7px!important;
        }
        html body #${SHELL_ID} #${HEADER_ID} .msf-runner {
          width:48px!important;
          height:40px!important;
          flex-basis:48px!important;
        }
        html body #${SHELL_ID} #${HEADER_ID} .msf-brand-name {
          font-size:clamp(24px,7vw,35px)!important;
        }
        html body #${SHELL_ID} #${HEADER_ID} .msf-tag {
          font-size:9px!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureHeader() {
    if (!fuelIsOpen()) return;
    const holder = document.getElementById(CONTENT_ID);
    if (!holder) return;

    let header = document.getElementById(HEADER_ID);
    if (!header || !holder.contains(header)) {
      header = document.createElement("div");
      header.id = HEADER_ID;
      header.innerHTML = `
        <div class="msf-brand">
          <div class="msf-runner" aria-hidden="true"></div>
          <div class="msf-copy">
            <div class="msf-brand-name">MANA <span>MOVEMENT</span></div>
            <div class="msf-tag">TRAINING · MOVE WITH PURPOSE</div>
          </div>
        </div>
        <div class="msf-overview-row">
          <button id="${BACK_ID}" type="button">⌂ Overview</button>
        </div>
      `;
    }
    if (header.parentElement !== holder) {
      holder.appendChild(header);
    }
  }

  function init() {
    installStyles();
    const holder = document.getElementById(CONTENT_ID);
    if (holder) {
      const observer = new MutationObserver(() => {
        if (fuelIsOpen()) ensureHeader();
      });
      observer.observe(holder,{childList:true});
    }

    document.addEventListener("click", event => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("#" + BACK_ID)) {
        document.querySelector(
          '#manaV83Tabs [data-v83-tab="overview"]'
        )?.click();
        return;
      }
      if (event.target.closest("#manaV83Tabs .mana-v83-tab")) {
        requestAnimationFrame(ensureHeader);
      }
    });

    window.addEventListener("mana:program-tab-change",ensureHeader);
    window.addEventListener("mana:fuel-updated",ensureHeader);
    ensureHeader();
    window.MANA_STRENGTH_FUEL_DESIGN_BUILD = "104261";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded",init,{once:true});
  } else {
    init();
  }
})();
