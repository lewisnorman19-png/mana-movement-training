
/* =============================================================
   MANA MOVEMENT — INTRODUCTION PREMIUM 103890
   COMPLETE FILE — replaces v9_88_login_intro_polish.js

   Presentation only. Reuses the existing introduction made by
   v8_1_introduction.js and sound/entry handling from v8_2_intro_access.js.
   Does not replace buttons, click handlers, login or client data.
   Runner asset: ui/mana-runner-logo.png
   ============================================================= */
(() => {
  "use strict";
  if (window.MANA_INTRO_PREMIUM_103890) return;
  window.MANA_INTRO_PREMIUM_103890 = true;

  const BUILD = "103890";
  const ID = "manaIntroPremiumStyle103890";
  const INTRO = "manaV81Intro";
  const $ = id => document.getElementById(id);

  function installStyles() {
    if ($(ID)) return;
    const style = document.createElement("style");
    style.id = ID;
    style.textContent = `
      /* This visual theme affects the introduction only. */
      #${INTRO} {
        background:radial-gradient(ellipse at 50% 0%, rgba(255,121,39,.09),transparent 48%),#08090B!important;
        color:#FFFFFF!important;
        scrollbar-color:#4A4E55 #08090B;
      }
      #${INTRO} .mana-v81-shell {
        max-width:600px!important;
        padding:4px 0 12px!important;
      }
      #${INTRO} .mana-v81-content {
        position:relative!important;
        z-index:2!important;
      }
      /* Replace the old letter M with the approved runner artwork. */
      #${INTRO} .mana-v81-mark {
        display:block!important;
        width:min(300px,82vw)!important;
        height:152px!important;
        padding:0!important;
        margin:10px auto 12px!important;
        border:0!important;
        background:transparent url("ui/mana-runner-logo.png?v=103890") center/contain no-repeat!important;
        font-size:0!important;
        color:transparent!important;
        box-shadow:none!important;
      }
      #${INTRO} .mana-v81-kicker {
        color:#FF7927!important;
        font:900 11px/1.4 system-ui,sans-serif!important;
        letter-spacing:.20em!important;
      }
      #${INTRO} .mana-v81-title {
        color:#FFFFFF!important;
        margin:16px auto 12px!important;
        max-width:520px!important;
        font-size:clamp(31px,7.4vw,46px)!important;
        line-height:1.12!important;
        letter-spacing:-.035em!important;
        text-shadow:none!important;
      }
      #${INTRO} .mana-v81-title span {
        color:#FF7927!important;
      }
      #${INTRO} .mana-v81-lead {
        max-width:510px!important;
        color:#C1C6CE!important;
        margin:12px auto 22px!important;
        line-height:1.65!important;
        font-size:14px!important;
      }
      #${INTRO} .mana-v81-card,
      #${INTRO} .mana-v81-quote {
        border:1px solid #4A4E55!important;
        border-radius:20px!important;
        background:#15171B!important;
        color:#FFFFFF!important;
        padding:20px!important;
        margin:14px 0!important;
        box-shadow:none!important;
        backdrop-filter:none!important;
      }
      #${INTRO} .mana-v81-card h2,
      #${INTRO} .mana-v81-close h3 {
        color:#FFFFFF!important;
      }
      #${INTRO} .mana-v81-card p,
      #${INTRO} .mana-v81-close p,
      #${INTRO} .mana-v81-translation {
        color:#C1C6CE!important;
      }
      #${INTRO} .mana-v81-label,
      #${INTRO} .mana-v81-maori {
        color:#FF7927!important;
      }
      #${INTRO} .mana-v81-divider {
        color:#FF7927!important;
        margin:20px 0!important;
      }
      #${INTRO} .mana-v81-divider::before,
      #${INTRO} .mana-v81-divider::after {
        background:#4A4E55!important;
      }
      #${INTRO} .mana-v81-mini-koru path,
      #${INTRO} .mana-v81-koru path {
        stroke:#FF7927!important;
      }
      #${INTRO} .mana-v81-koru {
        opacity:.12!important;
        filter:none!important;
        pointer-events:none!important;
      }
      #${INTRO} .mana-v81-koru.top {
        width:205px!important;
        height:205px!important;
        top:-35px!important;
        right:-80px!important;
      }
      #${INTRO} .mana-v81-koru.bottom {
        width:205px!important;
        height:205px!important;
        left:-95px!important;
        bottom:30px!important;
      }
      #${INTRO} .mana-v81-quote::after {
        border-color:rgba(255,121,39,.14)!important;
        box-shadow:none!important;
      }
      #${INTRO} .mana-v81-close {
        margin-top:22px!important;
        padding-bottom:12px!important;
      }
      #${INTRO} #manaV81Enter {
        display:block!important;
        width:100%!important;
        min-height:58px!important;
        padding:14px!important;
        border:1px solid #FF7927!important;
        border-radius:15px!important;
        background:#FF7927!important;
        color:#08090B!important;
        font:900 15px system-ui,sans-serif!important;
        cursor:pointer!important;
      }
      #${INTRO} #manaV81Enter:focus-visible {
        outline:3px solid #FFFFFF!important;
        outline-offset:3px!important;
      }
      /* Keep the prior sound feature accessible and in the new theme. */
      #${INTRO} #manaV82Sound {
        color:#FF7927!important;
        background:#15171B!important;
        border-color:#FF7927!important;
      }
      #${INTRO} #manaV82Sound.off {
        color:#C1C6CE!important;
        border-color:#4A4E55!important;
      }
      /* The intro's old Return to Home control stays hidden by v8_2. */
      #${INTRO} #manaV81Close {
        display:none!important;
      }
      @media(max-width:520px) {
        #${INTRO} {
          padding:calc(env(safe-area-inset-top) + 14px) 16px calc(env(safe-area-inset-bottom) + 30px)!important;
        }
        #${INTRO} .mana-v81-mark {
          width:min(235px,76vw)!important;
          height:115px!important;
        }
        #${INTRO} .mana-v81-card,
        #${INTRO} .mana-v81-quote {
          padding:17px!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    installStyles();
    window.MANA_INTRO_PREMIUM_BUILD = BUILD;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
