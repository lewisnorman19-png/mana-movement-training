
/* ==========================================================
   MANA MOVEMENT — PROGRAM SELECTION CORRECTION 103910
   COMPLETE FILE | replaces mana_program_selection_103900.js

   Client Home visuals only.
   Cards: Mana28 > Mana Strength > ManaLyfe
   Backgrounds: Orange > Silver > White
   Runner small beside the existing Mana Movement heading.
   Preserves original buttons, navigation, program selection,
   account access and data. No payment processing added.
   ========================================================== */
(() => {
  "use strict";

  if (window.MANA_SELECTION_103910) return;
  window.MANA_SELECTION_103910 = true;

  const BUILD = "103910";
  const STYLE_ID = "manaSelectionStyle103910";
  const HOME_ID = "manaV80Home";
  const IDS = ["manaV80Mana28", "manaV80Strength", "manaV80Life"];
  const $ = id => document.getElementById(id);
  let observedHome = null;
  let observer = null;

  function styles() {
    if ($(STYLE_ID)) return;

    const sheet = document.createElement("style");
    sheet.id = STYLE_ID;
    sheet.textContent = `
      /* Scope every rule to the existing client selection page. */
      html body #${HOME_ID} {
        width:min(720px,100%)!important;
        max-width:720px!important;
        margin:0 auto!important;
        padding:10px 12px calc(92px + env(safe-area-inset-bottom))!important;
        box-sizing:border-box!important;
      }

      /* Keep the profile available through the existing Profile tab.
         Remove only the redundant large promotional blocks on Home. */
      html body #${HOME_ID} .mana-v8013-profile,
      html body #${HOME_ID} .mana-v8013-select,
      html body #${HOME_ID} #manaV82Current {
        display:none!important;
      }

      html body #${HOME_ID} .mana-v8013-brand {
        display:block!important;
        padding:0 3px!important;
        margin:0 0 15px!important;
      }
      html body #${HOME_ID} .mana-v8013-brand-row {
        display:flex!important;
        align-items:center!important;
        justify-content:flex-start!important;
        gap:12px!important;
        margin:0!important;
      }
      html body #${HOME_ID} .mana-v8013-mark {
        display:block!important;
        flex:0 0 64px!important;
        width:64px!important;
        height:43px!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        border-radius:0!important;
        box-shadow:none!important;
        font-size:0!important;
        color:transparent!important;
        background:transparent url("ui/mana-runner-logo.png?v=103910") center/contain no-repeat!important;
      }
      /* Consistent functional-screen title size, with the runner beside it. */
      html body #${HOME_ID} .mana-v8013-brand-title {
        font:950 22px/1.12 system-ui,sans-serif!important;
        letter-spacing:.035em!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        white-space:normal!important;
      }
      html body #${HOME_ID} .mana-v8013-brand-kicker {
        margin-top:3px!important;
        font:800 9px/1.2 system-ui,sans-serif!important;
        letter-spacing:.09em!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #${HOME_ID} .mana-v8013-brand > h1,
      html body #${HOME_ID} .mana-v8013-sub,
      html body #${HOME_ID} .mana-v8013-welcome {
        display:none!important;
      }

      /* Override the legacy 300/420px card heights from older scripts. */
      html body #${HOME_ID} button.mana-v8013-program,
      html body #${HOME_ID} button.mana-v8013-program.current,
      html body #${HOME_ID} button#manaV80Mana28,
      html body #${HOME_ID} button#manaV80Strength,
      html body #${HOME_ID} button#manaV80Life {
        position:relative!important;
        display:flex!important;
        flex-direction:column!important;
        align-items:flex-start!important;
        justify-content:center!important;
        gap:4px!important;
        width:100%!important;
        min-width:0!important;
        max-width:100%!important;
        height:auto!important;
        min-height:112px!important;
        max-height:none!important;
        margin:0 0 10px!important;
        padding:13px 19px!important;
        border:2px solid transparent!important;
        border-radius:17px!important;
        box-shadow:none!important;
        text-align:left!important;
        overflow:hidden!important;
        transform:none!important;
        opacity:1!important;
        visibility:visible!important;
      }

      /* One strong orange outline marks the currently selected program. */
      html body #${HOME_ID} button.mana-v8013-program.current {
        outline:3px solid #FF7927!important;
        outline-offset:1px!important;
      }
      html body #${HOME_ID} button.mana-v8013-program:focus-visible {
        outline:3px solid #08090B!important;
        outline-offset:-6px!important;
      }
      html body #${HOME_ID} button.mana-v8013-program::before,
      html body #${HOME_ID} button.mana-v8013-program::after {
        display:none!important;
        content:none!important;
      }

      /* Full-banner colours. IDs beat legacy per-program colouring. */
      html body #${HOME_ID} button#manaV80Mana28,
      html body #${HOME_ID} button#manaV80Mana28.current {
        background:#FF7927!important;
        background-image:none!important;
        color:#08090B!important;
      }
      html body #${HOME_ID} button#manaV80Strength,
      html body #${HOME_ID} button#manaV80Strength.current {
        background:#C1C6CE!important;
        background-image:none!important;
        color:#08090B!important;
      }
      html body #${HOME_ID} button#manaV80Life,
      html body #${HOME_ID} button#manaV80Life.current {
        background:#FFFFFF!important;
        background-image:none!important;
        color:#08090B!important;
      }

      /* Uniform dark lettering on all three light/bright banners. */
      html body #${HOME_ID} button.mana-v8013-program .mana-v8013-program-label,
      html body #${HOME_ID} button.mana-v8013-program.current .mana-v8013-program-label {
        display:block!important;
        margin:0!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        font:950 10px/1.25 system-ui,sans-serif!important;
        letter-spacing:.12em!important;
      }
      html body #${HOME_ID} button.mana-v8013-program h2,
      html body #${HOME_ID} button.mana-v8013-program.current h2 {
        display:block!important;
        width:100%!important;
        max-width:100%!important;
        margin:0!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        font:950 clamp(18px,3.4vw,24px)/1.14 system-ui,sans-serif!important;
        letter-spacing:-.025em!important;
      }
      html body #${HOME_ID} button.mana-v8013-program p,
      html body #${HOME_ID} button.mana-v8013-program.current p {
        display:block!important;
        max-width:100%!important;
        margin:0!important;
        padding:0!important;
        color:#272A2F!important;
        -webkit-text-fill-color:#272A2F!important;
        font:550 11px/1.35 system-ui,sans-serif!important;
        opacity:1!important;
        visibility:visible!important;
      }

      /* Remove visual clutter without removing button functionality. */
      html body #${HOME_ID} button.mana-v8013-program .mana-v8013-badge,
      html body #${HOME_ID} button.mana-v8013-program .mana-v8013-current-badge,
      html body #${HOME_ID} button.mana-v8013-program .mana-v8013-open,
      html body #${HOME_ID} button.mana-v8013-program .m1027-home-support,
      html body #${HOME_ID} button.mana-v8013-program .m1025-home-icon {
        display:none!important;
      }
      html body #${HOME_ID} button.mana-v8013-program .mana-v8013-price {
        display:block!important;
        margin:1px 0 0!important;
        padding:0!important;
        line-height:1.2!important;
      }
      html body #${HOME_ID} button.mana-v8013-program .mana-v8013-price strong,
      html body #${HOME_ID} button.mana-v8013-program .mana-v8013-price span {
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        font:850 11px/1.2 system-ui,sans-serif!important;
      }
      html body #${HOME_ID} button#manaV80Mana28 .mana-v8013-free-note {
        display:block!important;
        margin:1px 0 0!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        font:850 10px/1.25 system-ui,sans-serif!important;
      }
      html body #${HOME_ID} button#manaV80Mana28 .mana-v8013-free-note::after {
        content:" · Planned: AUD $14.99/month";
        color:#08090B!important;
      }
      @media(max-width:600px) {
        html body #${HOME_ID} {
          padding:8px 10px calc(82px + env(safe-area-inset-bottom))!important;
        }
        html body #${HOME_ID} button.mana-v8013-program,
        html body #${HOME_ID} button.mana-v8013-program.current {
          min-height:104px!important;
          padding:11px 14px!important;
          margin-bottom:9px!important;
        }
        html body #${HOME_ID} button.mana-v8013-program p {
          font-size:10.5px!important;
        }
      }
      @media(max-height:650px) {
        html body #${HOME_ID} button.mana-v8013-program {
          min-height:94px!important;
          padding-top:8px!important;
          padding-bottom:8px!important;
        }
      }
    `;
    document.head.appendChild(sheet);
  }

  // An older script restores Strength -> Lyfe -> Mana28 after navigation.
  // Correct just the order of the *existing* buttons; never clone them.
  function correctOrder() {
    const home = $(HOME_ID);
    if (!home) return;
    const cards = IDS.map($);
    if (cards.some(card => !card)) return;
    const parent = cards[0].parentElement;
    if (!parent || !cards.every(card => card.parentElement === parent)) return;
    const current = [...parent.children].filter(node => IDS.includes(node.id));
    if (current.length !== 3 || current.every((c, i) => c === cards[i])) return;
    // Insertion before the first program preserves all nodes outside the group.
    const first = current[0];
    const anchor = current[current.length - 1].nextSibling;
    cards.forEach(card => parent.insertBefore(card, anchor));
  }

  function connect() {
    const home = $(HOME_ID);
    if (!home) return;
    correctOrder();
    if (home === observedHome) return;
    observer?.disconnect();
    observedHome = home;
    // Direct-child changes only: no expensive subtree observation.
    observer = new MutationObserver(correctOrder);
    observer.observe(home, {childList:true});
  }

  function init() {
    styles();
    connect();
    [100, 400, 1200, 2000].forEach(ms => setTimeout(connect, ms));

    // Re-apply after the older home restoration handlers settle.
    const refresh = () => setTimeout(connect, 1650);
    for (const name of ["mana:program-change", "mana:profile-synced"]) {
      document.addEventListener(name, refresh);
      window.addEventListener(name, refresh);
    }
    document.addEventListener("click", event => {
      if (event.target.closest("#manaV80HomeBtn,[data-program]")) refresh();
    });
    window.addEventListener("pageshow", connect);
    window.MANA_SELECTION_BUILD = BUILD;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
