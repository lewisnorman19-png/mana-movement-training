
/* ==========================================================
   MANA MOVEMENT — CHOOSE YOUR PLAN DESIGN 104020
   Complete replacement for mana_choose_plan_design_104010.js.

   Visual design only for the Mana Strength membership screen.
   Retains all plans, prices, features, buttons and membership logic.
   ========================================================== */
(() => {
  "use strict";

  if (window.MANA_CHOOSE_PLAN_104020) return;
  window.MANA_CHOOSE_PLAN_104020 = true;

  const SCREEN = "manaV98Membership";
  const STYLE = "manaChoosePlanDesignStyle104020";
  const BRAND = "manaChoosePlanBrand104020";
  const $ = id => document.getElementById(id);

  function installStyles() {
    if ($(STYLE)) return;

    const sheet = document.createElement("style");
    sheet.id = STYLE;

    sheet.textContent = `
      html body #${SCREEN} {
        background:#08090B!important;
        background-image:none!important;
        color:#FFFFFF!important;
      }

      #${SCREEN} .mana-v981-wrap {
        color:#FFFFFF!important;
      }

      /* MANA MOVEMENT BRANDING */

      #${SCREEN} #${BRAND} {
        display:flex!important;
        align-items:center!important;
        gap:12px!important;
        width:100%!important;
        margin:0 auto 22px!important;
        max-width:1080px!important;
      }

      #${SCREEN} #${BRAND} .mana-plan-runner {
        display:block!important;
        width:76px!important;
        height:56px!important;
        flex:0 0 76px!important;
        background:transparent url("ui/mana-runner-logo.png?v=104020") center/contain no-repeat!important;
      }

      #${SCREEN} #${BRAND} .mana-plan-brand-copy {
        min-width:0!important;
      }

      #${SCREEN} #${BRAND} .mana-plan-brand-name {
        margin:0!important;
        font:900 clamp(31px,7vw,46px)/1.05 system-ui,sans-serif!important;
        letter-spacing:.035em!important;
        white-space:nowrap!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      #${SCREEN} #${BRAND} .mana-plan-brand-name span {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      #${SCREEN} #${BRAND} .mana-plan-brand-tag {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        margin-top:4px!important;
        font:750 10px/1.25 system-ui,sans-serif!important;
        letter-spacing:.13em!important;
      }

      /* CHOOSE YOUR PLAN HEADER */

      #${SCREEN} .mana-v981-header {
        align-items:flex-start!important;
      }

      #${SCREEN} .mana-v981-mark {
        display:none!important;
      }

      #${SCREEN} .mana-v981-header-copy {
        min-width:0!important;
      }

      #${SCREEN} .mana-v981-kicker {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      #${SCREEN} .mana-v981-header h1 {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      #${SCREEN} .mana-v981-header p {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      #${SCREEN} .mana-v981-close {
        border:1px solid #707780!important;
        background:#15171B!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      /* THREE BLACK PLAN CARDS */

      #${SCREEN} .mana-v981-plan,
      #${SCREEN} .mana-v981-plan.featured,
      #${SCREEN} .mana-v981-plans > .mana-v981-plan {
        background:#111317!important;
        background-image:none!important;
        border:1px solid #C1C6CE!important;
        border-radius:24px!important;
        box-shadow:none!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      /* INDIVIDUAL PLAN ACCENT COLOURS */

      #${SCREEN} .mana-v981-plan:nth-child(1) {
        --mana-plan-accent:#FF7927;
      }

      #${SCREEN} .mana-v981-plan:nth-child(2) {
        --mana-plan-accent:#C1C6CE;
      }

      #${SCREEN} .mana-v981-plan:nth-child(3) {
        --mana-plan-accent:#FFFFFF;
      }

      #${SCREEN} .mana-v981-plan-label,
      #${SCREEN} .mana-v981-plan h2,
      #${SCREEN} .mana-v981-price strong,
      #${SCREEN} .mana-v981-feature-check {
        color:var(--mana-plan-accent)!important;
        -webkit-text-fill-color:var(--mana-plan-accent)!important;
      }

      #${SCREEN} .mana-v981-price span,
      #${SCREEN} .mana-v981-description,
      #${SCREEN} .mana-v981-feature {
        color:#E0E4E9!important;
        -webkit-text-fill-color:#E0E4E9!important;
      }

      #${SCREEN} .mana-v981-popular {
        background:#FF7927!important;
        border:0!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
      }

      /* SOLID MATCHING PLAN BUTTONS */

      #${SCREEN} .mana-v981-plan .mana-v981-button,
      #${SCREEN} .mana-v981-plan.featured .mana-v981-button {
        background:var(--mana-plan-accent)!important;
        background-image:none!important;
        border:1px solid var(--mana-plan-accent)!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        box-shadow:none!important;
      }

      #${SCREEN} .mana-v981-plan .mana-v981-button:focus-visible,
      #${SCREEN} .mana-v981-close:focus-visible {
        outline:3px solid #FF7927!important;
        outline-offset:2px!important;
      }

      #${SCREEN} .mana-v981-plan .mana-v981-button:hover {
        background:var(--mana-plan-accent)!important;
        filter:brightness(.92)!important;
      }

      #${SCREEN} .mana-v981-current {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      #${SCREEN} .mana-v981-note {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      /* MOBILE LAYOUT */

      @media(max-width:600px) {
        #${SCREEN} #${BRAND} {
          gap:7px!important;
        }

        #${SCREEN} #${BRAND} .mana-plan-runner {
          flex:0 0 48px!important;
          width:48px!important;
          height:39px!important;
        }

        #${SCREEN} #${BRAND} .mana-plan-brand-name {
          font-size:clamp(22px,6.6vw,31px)!important;
          letter-spacing:-.015em!important;
        }

        #${SCREEN} #${BRAND} .mana-plan-brand-tag {
          font-size:9px!important;
        }
      }

      @media(max-width:370px) {
        #${SCREEN} #${BRAND} .mana-plan-brand-name {
          font-size:22px!important;
        }
      }
    `;

    document.head.appendChild(sheet);
  }

  function addBrand() {
    const screen = $(SCREEN);
    const wrap = screen?.querySelector(".mana-v981-wrap");
    const header = wrap?.querySelector(".mana-v981-header");

    if (!wrap || !header || $(BRAND)) return false;

    const branding = document.createElement("div");
    branding.id = BRAND;

    branding.setAttribute(
      "aria-label",
      "Mana Movement — Move With Purpose"
    );

    branding.innerHTML = `
      <div class="mana-plan-runner" aria-hidden="true"></div>
      <div class="mana-plan-brand-copy">
        <div class="mana-plan-brand-name">
          MANA <span>MOVEMENT</span>
        </div>
        <div class="mana-plan-brand-tag">
          TRAINING · MOVE WITH PURPOSE
        </div>
      </div>
    `;

    wrap.insertBefore(branding, header);
    return true;
  }

  function init() {
    installStyles();

    if (!addBrand() && !$(BRAND)) {
      const watcher = new MutationObserver(() => {
        if (addBrand() || $(BRAND)) {
          watcher.disconnect();
        }
      });

      watcher.observe(document.body, {
        childList:true,
        subtree:true
      });
    }

    window.MANA_CHOOSE_PLAN_BUILD = "104020";
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );
  } else {
    init();
  }
})();
