
/* ==========================================================
   MANA MOVEMENT — CHOOSE YOUR PLAN DESIGN 104010
   NEW FILE — styling only for the existing Mana Strength
   membership screen (#manaV98Membership).

   Keeps existing Self-Guided, Coach Support, Personal Coaching
   plans, pricing, features, buttons and membership logic.
   Uses the approved runner at ui/mana-runner-logo.png.
   ========================================================== */
(() => {
  "use strict";

  if (window.MANA_CHOOSE_PLAN_104010) return;
  window.MANA_CHOOSE_PLAN_104010 = true;

  const SCREEN = "manaV98Membership";
  const STYLE = "manaChoosePlanDesignStyle104010";
  const BRAND = "manaChoosePlanBrand104010";
  const $ = id => document.getElementById(id);

  function installStyles() {
    if ($(STYLE)) return;

    const sheet = document.createElement("style");
    sheet.id = STYLE;
    sheet.textContent = `
      /* Whole membership screen. No changes to its size or layout. */
      html body #${SCREEN} {
        background:#08090B!important;
        background-image:none!important;
        color:#FFFFFF!important;
      }
      #${SCREEN} .mana-v981-wrap {
        color:#FFFFFF!important;
      }

      /* Runner + login-size brand heading, beside one another. */
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
        background:transparent url("ui/mana-runner-logo.png?v=104010") center/contain no-repeat!important;
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

      /* Retain original Choose Your Level heading and Back button. */
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

      /* SAME EXISTING CARD DIMENSIONS.
         Black cards, consistent silver-white borders. */
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

      /* Plan 1: orange; plan 2: silver; plan 3: white. */
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

      /* Buttons retain their current click handlers and labels. */
      #${SCREEN} .mana-v981-plan .mana-v981-button,
      #${SCREEN} .mana-v981-plan.featured .mana-v981-button {
        background:#171A1F!important;
        border:1px solid var(--mana-plan-accent)!important;
        color:var(--mana-plan-accent)!important;
        -webkit-text-fill-color:var(--mana-plan-accent)!important;
        box-shadow:none!important;
      }
      #${SCREEN} .mana-v981-plan .mana-v981-button:focus-visible,
      #${SCREEN} .mana-v981-close:focus-visible {
        outline:3px solid #FF7927!important;
        outline-offset:2px!important;
      }
      #${SCREEN} .mana-v981-plan .mana-v981-button:hover {
        background:#252A30!important;
      }
      #${SCREEN} .mana-v981-current {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      #${SCREEN} .mana-v981-note {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      @media(max-width:600px) {
        #${SCREEN} #${BRAND} {gap:7px!important}
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
    branding.setAttribute("aria-label", "Mana Movement — Move With Purpose");
    branding.innerHTML = `
      <div class="mana-plan-runner" aria-hidden="true"></div>
      <div class="mana-plan-brand-copy">
        <div class="mana-plan-brand-name">MANA <span>MOVEMENT</span></div>
        <div class="mana-plan-brand-tag">TRAINING · MOVE WITH PURPOSE</div>
      </div>
    `;
    wrap.insertBefore(branding, header);
    return true;
  }

  function init() {
    installStyles();
    if (!addBrand() && !$(BRAND)) {
      // The membership screen is created on first open.
      // Disconnect immediately once its header exists.
      const watcher = new MutationObserver(() => {
        if (addBrand() || $(BRAND)) watcher.disconnect();
      });
      watcher.observe(document.body, {
        childList:true,
        subtree:true
      });
    }
    window.MANA_CHOOSE_PLAN_BUILD = "104010";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
