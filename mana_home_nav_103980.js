
/* ==========================================================
   MANA MOVEMENT — CLIENT HOME NAVIGATION 103980
   New standalone visual-only file.
   Restyles the existing four Home navigation buttons.
   No changes to button IDs, click handlers, routing or permissions.
   ========================================================== */
(() => {
  "use strict";

  if (window.MANA_HOME_NAV_103980) return;
  window.MANA_HOME_NAV_103980 = true;

  const STYLE_ID = "manaHomeNavStyle103980";

  function install() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* Shared bottom bar for Home, Intro, Profile and Logout. */
      html body .mana-v8013-bottom {
        background:rgba(8,9,11,.97)!important;
        border-top:1px solid #444B53!important;
        box-shadow:0 -8px 24px rgba(0,0,0,.20)!important;
        padding:9px 12px calc(9px + env(safe-area-inset-bottom))!important;
        backdrop-filter:blur(12px)!important;
      }

      html body .mana-v8013-bottom-inner {
        display:grid!important;
        grid-template-columns:repeat(4,minmax(0,1fr))!important;
        gap:9px!important;
        max-width:980px!important;
        margin:0 auto!important;
      }

      html body .mana-v8013-bottom .mana-v8013-nav {
        display:block!important;
        min-width:0!important;
        min-height:61px!important;
        padding:9px 5px!important;
        border:1px solid #464D55!important;
        border-radius:14px!important;
        background:#171A1F!important;
        background-image:none!important;
        box-shadow:none!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font:850 13px/1.5 system-ui,sans-serif!important;
        text-align:center!important;
        cursor:pointer!important;
        transition:background .15s ease,border-color .15s ease!important;
      }

      html body .mana-v8013-bottom .mana-v8013-nav.active,
      html body .mana-v8013-bottom .mana-v8013-nav[aria-current="page"] {
        background:#FF7927!important;
        background-image:none!important;
        border-color:#FF7927!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        box-shadow:none!important;
      }

      html body .mana-v8013-bottom .mana-v8013-nav.logout {
        background:#111317!important;
        border-color:#707780!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      html body .mana-v8013-bottom .mana-v8013-nav:not(.active):hover {
        border-color:#FF7927!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      html body .mana-v8013-bottom .mana-v8013-nav:focus-visible {
        outline:3px solid #FF7927!important;
        outline-offset:2px!important;
      }

      html body .mana-v8013-bottom .mana-v8013-nav:disabled {
        opacity:.5!important;
        cursor:wait!important;
      }

      @media(max-width:600px) {
        html body .mana-v8013-bottom {
          padding:7px 7px calc(7px + env(safe-area-inset-bottom))!important;
        }
        html body .mana-v8013-bottom-inner {gap:6px!important}
        html body .mana-v8013-bottom .mana-v8013-nav {
          min-height:57px!important;
          padding:7px 3px!important;
          border-radius:11px!important;
          font-size:11px!important;
        }
      }
    `;
    document.head.appendChild(style);

    window.MANA_HOME_NAV_BUILD = "103980";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, {once:true});
  } else {
    install();
  }
})();
