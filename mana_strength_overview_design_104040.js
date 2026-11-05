
/* =============================================================
   MANA MOVEMENT — STRENGTH OVERVIEW DESIGN 104040
   NEW complete file — visual-only for the existing Strength Hub.

   Preserves the actual .mana-v964-launch buttons, all data,
   click handlers, workout logging, Fuel, Progress and navigation.
   Does not touch Plan Selection, Login, Profile or Coach Hub.
   ============================================================= */
(() => {
  "use strict";
  if (window.MANA_STRENGTH_OVERVIEW_DESIGN_104040) return;
  window.MANA_STRENGTH_OVERVIEW_DESIGN_104040 = true;

  const STYLE_ID = "manaStrengthOverviewStyle104040";
  const BRAND_ID = "manaStrengthOverviewBrand104040";
  const HOLDER_ID = "manaV83Content";
  const LAUNCH_ID = "manaV964Launchpad";
  const $ = id => document.getElementById(id);

  function installStyles() {
    if ($(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* Only the live Strength Overview launchpad. */
      html body #${HOLDER_ID} #${LAUNCH_ID} {
        width:100%!important;
        max-width:860px!important;
        margin:0 auto!important;
        padding:8px 0 35px!important;
        color:#FFFFFF!important;
      }

      /* Runner and brand match the confirmed client screens. */
      html body #${LAUNCH_ID} #${BRAND_ID} {
        display:flex!important;
        flex-wrap:nowrap!important;
        align-items:center!important;
        gap:12px!important;
        width:100%!important;
        margin:0 0 23px!important;
      }
      html body #${LAUNCH_ID} .mana-overview-runner {
        flex:0 0 76px!important;
        width:76px!important;
        height:56px!important;
        background:transparent url("ui/mana-runner-logo.png?v=104040") center/contain no-repeat!important;
      }
      html body #${LAUNCH_ID} .mana-overview-brand-copy {min-width:0!important}
      html body #${LAUNCH_ID} .mana-overview-brand-name {
        font:900 clamp(31px,7vw,46px)/1.05 system-ui,sans-serif!important;
        letter-spacing:.035em!important;
        white-space:nowrap!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      html body #${LAUNCH_ID} .mana-overview-brand-name span {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #${LAUNCH_ID} .mana-overview-brand-tag {
        margin-top:4px!important;
        font:750 10px/1.25 system-ui,sans-serif!important;
        letter-spacing:.13em!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      /* Existing intro — no copied or rewritten program data. */
      html body #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-intro {
        max-width:100%!important;
        margin-bottom:22px!important;
      }
      html body #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-kicker {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        font-size:12px!important;
      }
      html body #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-intro h2 {
        margin:8px 0 10px!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font-size:clamp(29px,4vw,36px)!important;
        line-height:1.09!important;
      }
      html body #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-intro p {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font-size:16px!important;
        line-height:1.5!important;
      }

      /* Keep current grid and all its original clickable elements. */
      html body #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-grid {
        display:grid!important;
        grid-template-columns:repeat(2,minmax(0,1fr))!important;
        gap:16px!important;
      }
      html body #${HOLDER_ID} #${LAUNCH_ID} button.mana-v964-launch {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #C1C6CE!important;
        border-radius:21px!important;
        box-shadow:none!important;
        color:#FFFFFF!important;
        min-width:0!important;
        overflow:hidden!important;
      }
      html body #${HOLDER_ID} #${LAUNCH_ID} button.mana-v964-launch::before {
        content:none!important;
        display:none!important;
      }
      html body #${HOLDER_ID} #${LAUNCH_ID} button.mana-v964-launch:hover {
        border-color:#FF7927!important;
        background:#1D2025!important;
        box-shadow:none!important;
      }
      html body #${HOLDER_ID} #${LAUNCH_ID} button.mana-v964-launch:focus-visible {
        outline:3px solid #FF7927!important;
        outline-offset:2px!important;
      }
      html body #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-icon {
        background:#FF7927!important;
        background-image:none!important;
        border:1px solid #FF7927!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        box-shadow:none!important;
      }
      html body #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-label,
      html body #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-arrow {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-title {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      html body #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-text {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        line-height:1.5!important;
      }

      /* Shared warm orange, silver and white details; no yellow gold. */
      html body #${HOLDER_ID} #${LAUNCH_ID}
        button.mana-v964-launch[data-v964-launch="fuel"] .mana-v964-icon,
      html body #${HOLDER_ID} #${LAUNCH_ID}
        button.mana-v964-launch[data-v964-launch="progress"] .mana-v964-icon {
        background:#697686!important;
        border-color:#697686!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      @media(max-width:700px) {
        html body #${LAUNCH_ID} #${BRAND_ID} {gap:7px!important}
        html body #${LAUNCH_ID} .mana-overview-runner {
          flex:0 0 48px!important;
          width:48px!important;
          height:39px!important;
        }
        html body #${LAUNCH_ID} .mana-overview-brand-name {
          font-size:clamp(22px,6.6vw,31px)!important;
          letter-spacing:-.015em!important;
        }
        html body #${LAUNCH_ID} .mana-overview-brand-tag {
          font-size:9px!important;
        }
        html body #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-grid {
          grid-template-columns:minmax(0,1fr)!important;
          gap:14px!important;
        }
        html body #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-intro p {
          font-size:14px!important;
        }
      }
      @media(max-width:370px) {
        html body #${LAUNCH_ID} .mana-overview-brand-name {
          font-size:22px!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureBrand() {
    const launch = $(LAUNCH_ID);
    const intro = launch?.querySelector(".mana-v964-intro");
    if (!launch || !intro || launch.querySelector("#" + BRAND_ID)) return;
    const brand = document.createElement("div");
    brand.id = BRAND_ID;
    brand.setAttribute("aria-label", "Mana Movement — Move With Purpose");
    brand.innerHTML = `
      <div class="mana-overview-runner" aria-hidden="true"></div>
      <div class="mana-overview-brand-copy">
        <div class="mana-overview-brand-name">MANA <span>MOVEMENT</span></div>
        <div class="mana-overview-brand-tag">TRAINING · MOVE WITH PURPOSE</div>
      </div>
    `;
    launch.insertBefore(brand, intro);
  }

  function init() {
    installStyles();
    ensureBrand();
    // The Overview is recreated when tabs change. Watch only direct
    // children of its content host; no polling, redraws or global clicks.
    const holder = $(HOLDER_ID);
    if (holder) {
      const observer = new MutationObserver(ensureBrand);
      observer.observe(holder, {childList:true});
    }
    window.MANA_STRENGTH_OVERVIEW_BUILD = "104040";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
