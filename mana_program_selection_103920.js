
/* MANA MOVEMENT — PROGRAM SELECTION 103920
   COMPLETE REPLACEMENT for mana_program_selection_corrected_103910.js.
   Only client Home presentation, ordering and branding.
   No billing/auth/workout/navigation logic changes. */
(() => {
  "use strict";
  if (window.MANA_SELECTION_103920) return;
  window.MANA_SELECTION_103920 = true;

  const HOME = "manaV80Home";
  const STYLE = "manaSelectionStyle103920";
  const ORDER = ["manaV80Mana28", "manaV80Strength", "manaV80Life"];
  const COLORS = ["#FF7927", "#697686", "#08090B"];
  const $ = id => document.getElementById(id);
  let watcher = null, watched = null;

  function installCSS() {
    if ($(STYLE)) return;
    const style = document.createElement("style");
    style.id = STYLE;
    style.textContent = `
      html body #${HOME} {
        width:min(760px,100%)!important;
        max-width:760px!important;
        margin:0 auto!important;
        padding:12px 12px calc(94px + env(safe-area-inset-bottom))!important;
        box-sizing:border-box!important;
      }
      html body #${HOME} .mana-v8013-profile,
      html body #${HOME} .mana-v8013-select,
      html body #${HOME} #manaV82Current {
        display:none!important;
      }
      html body #${HOME} .mana-v8013-brand {
        margin:0 0 15px!important;
        padding:0!important;
      }
      html body #${HOME} .mana-v8013-brand-row {
        display:flex!important;
        align-items:center!important;
        gap:12px!important;
        margin:0!important;
      }
      html body #${HOME} .mana-v8013-mark {
        flex:0 0 76px!important;
        width:76px!important;
        height:55px!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        font-size:0!important;
        color:transparent!important;
        background:transparent url("ui/mana-runner-logo.png?v=103920") center/contain no-repeat!important;
        box-shadow:none!important;
      }
      html body #${HOME} .mana-v8013-brand-title {
        font:900 clamp(31px,6vw,46px)/1.05 system-ui,sans-serif!important;
        letter-spacing:.025em!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        white-space:normal!important;
      }
      html body #${HOME} .mana-v8013-brand-kicker {
        margin:5px 0 0!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        font:800 10px/1.2 system-ui,sans-serif!important;
        letter-spacing:.13em!important;
      }
      html body #${HOME} .mana-v8013-brand > h1,
      html body #${HOME} .mana-v8013-sub,
      html body #${HOME} .mana-v8013-welcome {
        display:none!important;
      }

      html body #${HOME} #manaV80Mana28,
      html body #${HOME} #manaV80Strength,
      html body #${HOME} #manaV80Life {
        display:flex!important;
        flex-direction:column!important;
        justify-content:center!important;
        align-items:flex-start!important;
        gap:4px!important;
        width:100%!important;
        max-width:none!important;
        height:auto!important;
        min-height:122px!important;
        max-height:none!important;
        margin:0 0 11px!important;
        padding:14px 18px!important;
        border:2px solid #4A4E55!important;
        border-radius:17px!important;
        box-shadow:none!important;
        overflow:hidden!important;
        text-align:left!important;
        opacity:1!important;
        visibility:visible!important;
        transform:none!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      html body #${HOME} #manaV80Mana28,
      html body #${HOME} #manaV80Mana28.current {
        background:#FF7927!important;
        background-image:none!important;
        border-color:#FF7927!important;
      }
      html body #${HOME} #manaV80Strength,
      html body #${HOME} #manaV80Strength.current {
        background:#697686!important;
        background-image:none!important;
        border-color:#9DA5B1!important;
      }
      html body #${HOME} #manaV80Life,
      html body #${HOME} #manaV80Life.current {
        background:#08090B!important;
        background-image:none!important;
        border-color:#C1C6CE!important;
      }
      html body #${HOME} .mana-v8013-program.current {
        outline:2px solid #FF7927!important;
        outline-offset:2px!important;
      }
      html body #${HOME} .mana-v8013-program::before,
      html body #${HOME} .mana-v8013-program::after {
        display:none!important;
        content:none!important;
      }
      html body #${HOME} .mana-v8013-program .mana-v8013-program-label,
      html body #${HOME} .mana-v8013-program.current .mana-v8013-program-label,
      html body #${HOME} .mana-v8013-program h2,
      html body #${HOME} .mana-v8013-program.current h2,
      html body #${HOME} .mana-v8013-program p,
      html body #${HOME} .mana-v8013-program.current p,
      html body #${HOME} .mana-v8013-program .mana-v8013-price,
      html body #${HOME} .mana-v8013-program .mana-v8013-price strong,
      html body #${HOME} .mana-v8013-program .mana-v8013-price span,
      html body #${HOME} .mana-v8013-program .mana-v8013-free-note {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        text-shadow:0 1px 2px rgba(0,0,0,.26)!important;
      }
      html body #${HOME} .mana-v8013-program .mana-v8013-program-label {
        margin:0!important;
        font:950 11px/1.15 system-ui,sans-serif!important;
        letter-spacing:.12em!important;
      }
      html body #${HOME} .mana-v8013-program h2,
      html body #${HOME} .mana-v8013-program.current h2 {
        display:block!important;
        max-width:100%!important;
        margin:0!important;
        font:950 clamp(20px,3.5vw,26px)/1.12 system-ui,sans-serif!important;
      }
      html body #${HOME} .mana-v8013-program p,
      html body #${HOME} .mana-v8013-program.current p {
        display:block!important;
        max-width:100%!important;
        margin:0!important;
        font:550 11px/1.32 system-ui,sans-serif!important;
        opacity:1!important;
        visibility:visible!important;
      }
      html body #${HOME} .mana-v8013-program .mana-v8013-price {
        margin:0!important;
      }
      html body #${HOME} .mana-v8013-program .mana-v8013-price strong,
      html body #${HOME} .mana-v8013-program .mana-v8013-price span {
        font:800 11px/1.2 system-ui,sans-serif!important;
      }
      html body #${HOME} .mana-v8013-program .mana-v8013-free-note {
        margin:0!important;
        font:800 10px/1.2 system-ui,sans-serif!important;
      }
      html body #${HOME} #manaV80Mana28 .mana-v8013-free-note::after {
        content:" · $14.99/month planned";
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      html body #${HOME} .mana-v8013-program .mana-v8013-badge,
      html body #${HOME} .mana-v8013-program .mana-v8013-current-badge,
      html body #${HOME} .mana-v8013-program .mana-v8013-open,
      html body #${HOME} .mana-v8013-program .m1027-home-support,
      html body #${HOME} .mana-v8013-program .m1025-home-icon {
        display:none!important;
      }
      @media(max-width:600px) {
        html body #${HOME} .mana-v8013-brand-title {
          font-size:31px!important;
        }
        html body #${HOME} .mana-v8013-mark {
          width:59px!important;
          flex-basis:59px!important;
          height:44px!important;
        }
        html body #${HOME} .mana-v8013-program {
          min-height:106px!important;
          padding:11px 13px!important;
          margin-bottom:8px!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureOrderAndColors() {
    const home = $(HOME);
    if (!home) return;
    const cards = ORDER.map($);
    if (cards.some(c => !c)) return;
    const parent = cards[0].parentElement;
    if (!parent || cards.some(c => c.parentElement !== parent)) return;
    const present = [...parent.children].filter(c => ORDER.includes(c.id));
    if (present.length === 3 && present.some((c,i) => c !== cards[i])) {
      const afterLast = present[present.length-1].nextSibling;
      cards.forEach(card => parent.insertBefore(card, afterLast));
    }
    cards.forEach((card,i) => {
      // Important inline declarations defeat older scripts' conflicting
      // global and per-program card colouring, without replacing nodes.
      card.style.setProperty("background", COLORS[i], "important");
      card.style.setProperty("background-image", "none", "important");
      card.style.setProperty("color", "#FFFFFF", "important");
      card.style.setProperty("-webkit-text-fill-color", "#FFFFFF", "important");
      card.querySelectorAll("*").forEach(child => {
        if (child.matches(".m1025-home-icon")) return;
        child.style.setProperty("color", "#FFFFFF", "important");
        child.style.setProperty("-webkit-text-fill-color", "#FFFFFF", "important");
      });
    });
  }

  function connect() {
    const home = $(HOME);
    if (!home) return;
    if (watched !== home) {
      watcher?.disconnect();
      watched = home;
      watcher = new MutationObserver(ensureOrderAndColors);
      watcher.observe(home,{childList:true});
    }
    ensureOrderAndColors();
  }

  function init() {
    installCSS();
    connect();
    [120,450,1000,1650,2300].forEach(t => setTimeout(connect,t));
    document.addEventListener("click", e => {
      if (e.target.closest("#manaV80HomeBtn,[data-program]")) {
        setTimeout(connect,1700);
      }
    });
    window.addEventListener("pageshow",connect);
    window.MANA_SELECTION_BUILD = "103920";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded",init,{once:true});
  } else init();
})();
