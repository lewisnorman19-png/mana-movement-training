
/* ============================================================
   MANA MOVEMENT — MASTER PROFILE DESIGN 104000
   NEW FILE. Visual theme only for #manaProfileScreen.
   Preserves v6_7_profile.js fields, saving, Fuel calculations,
   validation, open/close buttons and profile synchronization.
   ============================================================ */
(() => {
  "use strict";

  if (window.MANA_PROFILE_DESIGN_104000) return;
  window.MANA_PROFILE_DESIGN_104000 = true;

  const SCREEN_ID = "manaProfileScreen";
  const STYLE_ID = "manaProfileDesignStyle104000";
  const BRAND_ID = "manaProfileBrand104000";
  const $ = id => document.getElementById(id);

  function addStyles() {
    if ($(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* Never style other client or Coach Hub profile screens. */
      html body #${SCREEN_ID} {
        background:#08090B!important;
        color:#FFFFFF!important;
        scrollbar-color:#555D66 #08090B;
      }
      #${SCREEN_ID} .mana-profile-shell {
        width:min(760px,100%)!important;
        max-width:760px!important;
        margin:0 auto!important;
      }

      /* Same heading typography as the Login screen.
         Compact runner sits to its left. */
      #${SCREEN_ID} #${BRAND_ID} {
        display:flex!important;
        align-items:center!important;
        flex-wrap:nowrap!important;
        gap:12px!important;
        margin:0 0 22px!important;
        padding:0!important;
      }
      #${SCREEN_ID} #${BRAND_ID} .mana-profile-brand-runner {
        flex:0 0 76px!important;
        width:76px!important;
        height:56px!important;
        background:transparent url("ui/mana-runner-logo.png?v=104000") center/contain no-repeat!important;
      }
      #${SCREEN_ID} #${BRAND_ID} .mana-profile-brand-copy {
        min-width:0!important;
      }
      #${SCREEN_ID} #${BRAND_ID} .mana-profile-brand-name {
        margin:0!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:900 clamp(31px,7vw,46px)/1.05 system-ui,sans-serif!important;
        letter-spacing:.035em!important;
        white-space:nowrap!important;
      }
      #${SCREEN_ID} #${BRAND_ID} .mana-profile-brand-name span {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      #${SCREEN_ID} #${BRAND_ID} .mana-profile-brand-sub {
        margin:4px 0 0!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font:750 10px/1.3 system-ui,sans-serif!important;
        letter-spacing:.13em!important;
      }

      #${SCREEN_ID} .mana-profile-head {
        display:flex!important;
        align-items:flex-start!important;
        justify-content:space-between!important;
        gap:12px!important;
        margin-bottom:15px!important;
      }
      #${SCREEN_ID} .mana-profile-head h1 {
        margin:5px 0!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:900 clamp(25px,4vw,32px)/1.12 system-ui,sans-serif!important;
      }
      #${SCREEN_ID} .mana-profile-head .pill {
        border:1px solid #FF7927!important;
        border-radius:20px!important;
        background:#20150F!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        font-weight:850!important;
      }
      #${SCREEN_ID} .mana-profile-head .muted {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        line-height:1.5!important;
      }
      #${SCREEN_ID} .mana-profile-close {
        min-width:44px!important;
        border:1px solid #697686!important;
        background:#15171B!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        box-shadow:none!important;
      }
      #${SCREEN_ID} .mana-profile-card,
      #${SCREEN_ID} .mana-profile-training,
      #${SCREEN_ID} .mana-profile-fuel {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #4A4E55!important;
        border-radius:18px!important;
        color:#FFFFFF!important;
        box-shadow:none!important;
      }
      #${SCREEN_ID} .mana-profile-card h3,
      #${SCREEN_ID} .mana-profile-training h3,
      #${SCREEN_ID} .mana-profile-fuel h3 {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:850 18px/1.25 system-ui,sans-serif!important;
        text-transform:none!important;
        letter-spacing:0!important;
      }
      #${SCREEN_ID} .mana-profile-field label {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font-size:13px!important;
        font-weight:750!important;
      }
      #${SCREEN_ID} .mana-profile-field input,
      #${SCREEN_ID} .mana-profile-field select {
        background:#0E1013!important;
        border:1px solid #555D66!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        border-radius:12px!important;
        min-height:49px!important;
        box-shadow:none!important;
      }
      #${SCREEN_ID} .mana-profile-field input:focus,
      #${SCREEN_ID} .mana-profile-field select:focus {
        border-color:#FF7927!important;
        outline:2px solid rgba(255,121,39,.25)!important;
        outline-offset:1px!important;
      }
      #${SCREEN_ID} .mana-profile-field input::placeholder {
        color:#9199A4!important;
      }
      #${SCREEN_ID} .mana-profile-fuel-target {
        background:#0E1013!important;
        border:1px solid #555D66!important;
      }
      #${SCREEN_ID} .mana-profile-fuel-target span,
      #${SCREEN_ID} .mana-profile-fuel-note {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font-size:12px!important;
      }
      #${SCREEN_ID} .mana-profile-fuel-target strong {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      #${SCREEN_ID} .mana-profile-save {
        background:#FF7927!important;
        border:1px solid #FF7927!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        box-shadow:none!important;
      }
      #${SCREEN_ID} .mana-profile-save:focus-visible,
      #${SCREEN_ID} .mana-profile-close:focus-visible {
        outline:3px solid #FFFFFF!important;
        outline-offset:2px!important;
      }
      /* Current body weight: replace the legacy gold highlight
         with the same silver/black theme as the profile cards.
         Does not alter the input, weight history or Fuel sync. */
      #${SCREEN_ID} .mana-v994-weight-field {
        border:1px solid #4A4E55!important;
        border-radius:16px!important;
        background:#15171B!important;
        background-image:none!important;
        box-shadow:none!important;
      }
      #${SCREEN_ID} .mana-v994-weight-field label {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font-size:13px!important;
      }
      #${SCREEN_ID} .mana-v994-weight-field #manaProfileWeight {
        border:1px solid #555D66!important;
        background:#0E1013!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      #${SCREEN_ID} .mana-v994-weight-note,
      #${SCREEN_ID} .mana-v994-weight-note strong {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font-size:12px!important;
      }
      #${SCREEN_ID} .mana-v994-weight-saved {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      #${SCREEN_ID} .mana-profile-status {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        font-weight:700!important;
      }
      @media(max-width:600px) {
        #${SCREEN_ID} {
          padding-left:12px!important;
          padding-right:12px!important;
        }
        #${SCREEN_ID} #${BRAND_ID} {gap:7px!important}
        #${SCREEN_ID} #${BRAND_ID} .mana-profile-brand-runner {
          flex:0 0 48px!important;
          width:48px!important;
          height:39px!important;
        }
        #${SCREEN_ID} #${BRAND_ID} .mana-profile-brand-name {
          font-size:clamp(22px,6.6vw,31px)!important;
          letter-spacing:-.015em!important;
        }
        #${SCREEN_ID} #${BRAND_ID} .mana-profile-brand-sub {
          font-size:9px!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureBrand() {
    const screen = $(SCREEN_ID);
    const shell = screen?.querySelector(".mana-profile-shell");
    const head = shell?.querySelector(".mana-profile-head");
    if (!shell || !head || $(BRAND_ID)) return;

    const brand = document.createElement("div");
    brand.id = BRAND_ID;
    brand.setAttribute("aria-label", "Mana Movement — Move with Purpose");
    brand.innerHTML = `
      <div class="mana-profile-brand-runner" aria-hidden="true"></div>
      <div class="mana-profile-brand-copy">
        <div class="mana-profile-brand-name">MANA <span>MOVEMENT</span></div>
        <div class="mana-profile-brand-sub">TRAINING · MOVE WITH PURPOSE</div>
      </div>
    `;
    shell.insertBefore(brand, head);
  }

  function init() {
    addStyles();
    ensureBrand();

    // Profile is lazily created by v6_7_profile.js on some app flows.
    // Watch only until it exists; no ongoing mutation observer.
    if (!$(BRAND_ID)) {
      const watcher = new MutationObserver(() => {
        ensureBrand();
        if ($(BRAND_ID)) watcher.disconnect();
      });
      watcher.observe(document.body, {childList:true, subtree:true});
    }
    window.MANA_PROFILE_DESIGN_BUILD = "104000";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
