
/* ===========================================================
   MANA MOVEMENT — COMPACT PROGRAM SELECTION 103900
   NEW standalone file, loads after design system 103830.

   Client Home presentation only: no billing, no access changes,
   no navigation rewiring, and no storage writes.
   Keeps the original #manaV80Mana28, #manaV80Strength,
   and #manaV80Life buttons and their existing click handlers.
   =========================================================== */
(() => {
  "use strict";

  if (window.MANA_COMPACT_SELECTION_103900) return;
  window.MANA_COMPACT_SELECTION_103900 = true;

  const BUILD = "103900";
  const STYLE_ID = "manaCompactSelectionStyle103900";
  const HOME_ID = "manaV80Home";
  const $ = id => document.getElementById(id);

  function installStyles() {
    if ($(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* Brand and three compact program cards; client home only. */
      #${HOME_ID} {
        width:min(760px,100%)!important;
        max-width:760px!important;
        margin:0 auto!important;
        padding:10px 12px calc(96px + env(safe-area-inset-bottom))!important;
        box-sizing:border-box!important;
      }
      /* Profile remains available through existing navigation.
         These long setup/promotional blocks aren't deleted. */
      #${HOME_ID} .mana-v8013-profile,
      #${HOME_ID} .mana-v8013-select,
      #${HOME_ID} #manaV82Current {
        display:none!important;
      }
      #${HOME_ID} .mana-v8013-brand {
        padding:0 3px!important;
        margin:0 0 12px!important;
      }
      #${HOME_ID} .mana-v8013-brand-row {
        display:flex!important;
        align-items:center!important;
        gap:11px!important;
        margin:0!important;
      }
      #${HOME_ID} .mana-v8013-mark {
        flex:0 0 64px!important;
        width:64px!important;
        height:45px!important;
        border:0!important;
        border-radius:0!important;
        font-size:0!important;
        color:transparent!important;
        box-shadow:none!important;
        background:transparent url("ui/mana-runner-logo.png?v=103900") center/contain no-repeat!important;
      }
      #${HOME_ID} .mana-v8013-brand-title {
        font:950 clamp(15px,3.3vw,22px)/1.12 system-ui,sans-serif!important;
        letter-spacing:.055em!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      #${HOME_ID} .mana-v8013-brand-kicker {
        margin-top:3px!important;
        font:750 9px/1.2 system-ui,sans-serif!important;
        letter-spacing:.11em!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      #${HOME_ID} .mana-v8013-brand > h1,
      #${HOME_ID} .mana-v8013-sub {
        display:none!important;
      }
      #${HOME_ID} .mana-v8013-welcome {
        margin:8px 0 0!important;
        color:#C1C6CE!important;
        font-size:12px!important;
        line-height:1.3!important;
      }
      /* Override legacy minimum height, fixed desktop height,
         hover layouts and gold overlays from the home modules. */
      #${HOME_ID} .mana-v8013-program,
      #${HOME_ID} .mana-v8013-program.current {
        display:flex!important;
        flex-direction:column!important;
        align-items:flex-start!important;
        justify-content:center!important;
        gap:3px!important;
        width:100%!important;
        min-width:0!important;
        max-width:100%!important;
        min-height:112px!important;
        height:auto!important;
        margin:0 0 9px!important;
        padding:13px 18px!important;
        border-radius:17px!important;
        border:2px solid transparent!important;
        box-shadow:none!important;
        text-align:left!important;
        overflow:hidden!important;
        transition:filter .15s ease, transform .15s ease!important;
      }
      #${HOME_ID} .mana-v8013-program::before,
      #${HOME_ID} .mana-v8013-program::after,
      #${HOME_ID} .mana-v8013-program.current::before,
      #${HOME_ID} .mana-v8013-program.current::after {
        display:none!important;
        content:none!important;
      }
      #${HOME_ID} .mana-v8013-program.current {
        outline:3px solid #FF7927!important;
        outline-offset:1px!important;
      }
      #${HOME_ID} .mana-v8013-program:focus-visible {
        outline:3px solid #FF7927!important;
        outline-offset:2px!important;
      }
      #${HOME_ID} .mana-v8013-program:hover {
        transform:translateY(-1px)!important;
        filter:brightness(.98)!important;
      }
      /* Full-width banner colours in the requested sequence. */
      #${HOME_ID} #manaV80Mana28,
      #${HOME_ID} #manaV80Mana28.current {
        background:#FF7927!important;
        color:#08090B!important;
      }
      #${HOME_ID} #manaV80Strength,
      #${HOME_ID} #manaV80Strength.current {
        background:#C1C6CE!important;
        color:#08090B!important;
      }
      #${HOME_ID} #manaV80Life,
      #${HOME_ID} #manaV80Life.current {
        background:#FFFFFF!important;
        color:#08090B!important;
      }
      #${HOME_ID} .mana-v8013-program-label,
      #${HOME_ID} .mana-v8013-program.current .mana-v8013-program-label {
        margin:0!important;
        font:950 10px/1.3 system-ui,sans-serif!important;
        letter-spacing:.13em!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
      }
      #${HOME_ID} .mana-v8013-program h2,
      #${HOME_ID} .mana-v8013-program.current h2 {
        max-width:100%!important;
        margin:0!important;
        font:950 clamp(18px,4vw,25px)/1.12 system-ui,sans-serif!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
      }
      #${HOME_ID} .mana-v8013-program p,
      #${HOME_ID} .mana-v8013-program.current p {
        display:block!important;
        visibility:visible!important;
        opacity:1!important;
        max-width:100%!important;
        margin:2px 0 0!important;
        font:550 11px/1.32 system-ui,sans-serif!important;
        color:#202327!important;
        -webkit-text-fill-color:#202327!important;
      }
      #${HOME_ID} .mana-v8013-program .mana-v8013-badge {
        display:none!important;
      }
      #${HOME_ID} .mana-v8013-program .mana-v8013-current-badge {
        display:none!important;
      }
      #${HOME_ID} .mana-v8013-program .mana-v8013-open {
        display:none!important;
      }
      #${HOME_ID} .mana-v8013-program .mana-v8013-price {
        margin:1px 0 0!important;
        font-size:11px!important;
        line-height:1.2!important;
      }
      #${HOME_ID} .mana-v8013-program .mana-v8013-price strong,
      #${HOME_ID} .mana-v8013-program .mana-v8013-price span {
        font-size:11px!important;
        font-weight:800!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
      }
      /* Existing free-access statement remains true.
         Price is explicitly a future proposal, not a live charge. */
      #${HOME_ID} #manaV80Mana28 .mana-v8013-free-note {
        display:block!important;
        margin:2px 0 0!important;
        font:850 11px/1.25 system-ui,sans-serif!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
      }
      #${HOME_ID} #manaV80Mana28 .mana-v8013-free-note::after {
        content:" · Planned: AUD $14.99/month";
        color:#08090B!important;
      }
      /* Room for three banners on typical phone screens.
         Keep content readable on very narrow displays. */
      @media(max-width:600px) {
        #${HOME_ID} {
          padding:9px 10px calc(82px + env(safe-area-inset-bottom))!important;
        }
        #${HOME_ID} .mana-v8013-program,
        #${HOME_ID} .mana-v8013-program.current {
          min-height:105px!important;
          padding:11px 14px!important;
          margin-bottom:8px!important;
        }
        #${HOME_ID} .mana-v8013-program p {
          font-size:10.5px!important;
        }
      }
      @media(max-height:660px) {
        #${HOME_ID} .mana-v8013-welcome {display:none!important}
        #${HOME_ID} .mana-v8013-program,
        #${HOME_ID} .mana-v8013-program.current {
          min-height:96px!important;
          padding-top:9px!important;
          padding-bottom:9px!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    installStyles();
    // The original v8 Home already creates cards in requested order:
    // Mana28, Mana Strength, then ManaLyfe. Do not move or clone buttons.
    window.MANA_COMPACT_SELECTION_BUILD = BUILD;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
