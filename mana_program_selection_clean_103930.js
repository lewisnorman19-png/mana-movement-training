
/* ================================================================
   MANA MOVEMENT — CLEAN PROGRAM SELECTION 103930
   NEW complete file. Replaces selection scripts 103900/103910/103920.

   Uses the original v8_0_home.js program buttons and click handlers.
   No changes to accounts, memberships, billing or workout data.
   Keeps the existing Coach Chat script enabled.
   ================================================================ */
(() => {
  "use strict";

  if (window.MANA_SELECTION_CLEAN_103930) return;
  window.MANA_SELECTION_CLEAN_103930 = true;

  const HOME_ID = "manaV80Home";
  const STYLE_ID = "manaSelectionCleanStyle103930";
  const CARD_IDS = [
    "manaV80Mana28",
    "manaV80Strength",
    "manaV80Life"
  ];

  const $ = id => document.getElementById(id);

  let observed = null;
  let observer = null;
  let scheduled = false;

  function addStyle() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      html body #${HOME_ID} {
        width:min(760px,100%)!important;
        max-width:760px!important;
        margin:0 auto!important;
        padding:12px 12px calc(92px + env(safe-area-inset-bottom))!important;
        box-sizing:border-box!important;
      }

      html body #${HOME_ID} .mana-v8013-profile,
      html body #${HOME_ID} .mana-v8013-select,
      html body #${HOME_ID} #manaV82Current {
        display:none!important;
      }

      html body #${HOME_ID} .mana-v8013-brand {
        display:block!important;
        margin:0 0 15px!important;
        padding:0!important;
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
        flex:0 0 74px!important;
        width:74px!important;
        height:54px!important;
        padding:0!important;
        margin:0!important;
        border:0!important;
        color:transparent!important;
        font-size:0!important;
        box-shadow:none!important;
        background:transparent url("ui/mana-runner-logo.png?v=103930") center/contain no-repeat!important;
      }

      html body #${HOME_ID} .mana-v8013-brand-title {
        font:900 clamp(30px,5vw,46px)/1.06 system-ui,sans-serif!important;
        letter-spacing:.025em!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      html body #${HOME_ID} .mana-v8013-brand-kicker {
        margin-top:5px!important;
        font:800 10px/1.2 system-ui,sans-serif!important;
        letter-spacing:.12em!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      html body #${HOME_ID} .mana-v8013-brand > h1,
      html body #${HOME_ID} .mana-v8013-sub,
      html body #${HOME_ID} .mana-v8013-welcome {
        display:none!important;
      }

      html body #${HOME_ID} button.mana-v8013-program {
        position:relative!important;
        display:flex!important;
        flex-direction:column!important;
        align-items:flex-start!important;
        justify-content:center!important;
        gap:5px!important;
        width:100%!important;
        height:auto!important;
        min-height:115px!important;
        max-height:none!important;
        padding:13px 17px!important;
        margin:0 0 10px!important;
        border:2px solid #4A4E55!important;
        border-radius:16px!important;
        box-shadow:none!important;
        text-align:left!important;
        overflow:hidden!important;
      }

      html body #${HOME_ID} button.mana-v8013-program.current {
        outline:2px solid #FF7927!important;
        outline-offset:2px!important;
      }

      html body #${HOME_ID} button.mana-v8013-program::before,
      html body #${HOME_ID} button.mana-v8013-program::after {
        display:none!important;
        content:none!important;
      }

      html body #${HOME_ID} button.mana-v8013-program .mana-v8013-program-label {
        margin:0!important;
        font:950 11px/1.2 system-ui,sans-serif!important;
        letter-spacing:.12em!important;
      }

      html body #${HOME_ID} button.mana-v8013-program h2 {
        display:block!important;
        max-width:100%!important;
        margin:0!important;
        font:900 clamp(19px,3.5vw,25px)/1.15 system-ui,sans-serif!important;
      }

      html body #${HOME_ID} button.mana-v8013-program p {
        display:block!important;
        max-width:100%!important;
        margin:0!important;
        font:550 11px/1.35 system-ui,sans-serif!important;
      }

      html body #${HOME_ID} button.mana-v8013-program .mana-v8013-price {
        margin:0!important;
      }

      html body #${HOME_ID} button.mana-v8013-program .mana-v8013-price strong,
      html body #${HOME_ID} button.mana-v8013-program .mana-v8013-price span {
        font:800 11px/1.2 system-ui,sans-serif!important;
      }

      html body #${HOME_ID} button.mana-v8013-program .mana-v8013-badge,
      html body #${HOME_ID} button.mana-v8013-program .mana-v8013-current-badge,
      html body #${HOME_ID} button.mana-v8013-program .mana-v8013-open,
      html body #${HOME_ID} button.mana-v8013-program .m1027-home-support,
      html body #${HOME_ID} button.mana-v8013-program .m1025-home-icon {
        display:none!important;
      }

      html body #${HOME_ID} #manaV80Mana28 {
        border-color:#FF7927!important;
      }

      html body #${HOME_ID} #manaV80Strength {
        border-color:#9DA5B1!important;
      }

      html body #${HOME_ID} #manaV80Life {
        border-color:#C1C6CE!important;
      }

      @media(max-width:600px) {
        html body #${HOME_ID} .mana-v8013-brand-title {
          font-size:30px!important;
        }

        html body #${HOME_ID} .mana-v8013-mark {
          width:57px!important;
          flex-basis:57px!important;
          height:43px!important;
        }

        html body #${HOME_ID} button.mana-v8013-program {
          min-height:105px!important;
          padding:10px 13px!important;
          margin-bottom:8px!important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function enforce() {
    const home = $(HOME_ID);
    if (!home) return;

    const cards = CARD_IDS.map($);
    if (cards.some(card => !card)) return;

    const parent = cards[0].parentElement;

    if (
      !parent ||
      cards.some(card => card.parentElement !== parent)
    ) return;

    // Preserve the actual program buttons and their handlers.
    const existing = [...parent.children].filter(
      node => CARD_IDS.includes(node.id)
    );

    if (
      existing.length === 3 &&
      existing.some((card, i) => card !== cards[i])
    ) {
      const anchor =
        existing[existing.length - 1].nextSibling;

      cards.forEach(card => {
        parent.insertBefore(card, anchor);
      });
    }

    const colors = [
      "#FF7927",
      "#697686",
      "#08090B"
    ];

    cards.forEach((card, i) => {
      card.style.setProperty(
        "background",
        colors[i],
        "important"
      );

      card.style.setProperty(
        "background-image",
        "none",
        "important"
      );

      card.style.setProperty(
        "height",
        "auto",
        "important"
      );

      card.style.setProperty(
        "min-height",
        "105px",
        "important"
      );

      card.style.setProperty(
        "max-height",
        "none",
        "important"
      );

      card.style.setProperty(
        "padding",
        "12px 16px",
        "important"
      );

      card.style.setProperty(
        "color",
        "#FFFFFF",
        "important"
      );

      card.querySelectorAll("*").forEach(node => {
        node.style.setProperty(
          "color",
          "#FFFFFF",
          "important"
        );

        node.style.setProperty(
          "-webkit-text-fill-color",
          "#FFFFFF",
          "important"
        );
      });

      const badge = card.querySelector(
        ".mana-v8013-free-note"
      );

      if (
        i === 0 &&
        badge &&
        !badge.dataset.manaPlannedPrice
      ) {
        badge.dataset.manaPlannedPrice = "1";
        badge.textContent =
          "Free access now · AUD $14.99/month planned";
      }
    });

    // Maintain the large Mana Movement title.
    const title = home.querySelector(
      ".mana-v8013-brand-title"
    );

    if (title) {
      title.style.setProperty(
        "font-size",
        "clamp(30px,5vw,46px)",
        "important"
      );

      title.style.setProperty(
        "color",
        "#FFFFFF",
        "important"
      );

      title.style.setProperty(
        "-webkit-text-fill-color",
        "#FFFFFF",
        "important"
      );
    }
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      enforce();
    });
  }

  function watch() {
    const home = $(HOME_ID);
    if (!home) return;

    if (home !== observed) {
      observer?.disconnect();
      observed = home;

      observer = new MutationObserver(schedule);
      observer.observe(home, {
        childList:true,
        subtree:false
      });
    }

    enforce();
  }

  function init() {
    addStyle();
    watch();

    [100, 450, 1000, 1750].forEach(ms => {
      setTimeout(watch, ms);
    });

    document.addEventListener("click", event => {
      if (
        event.target.closest(
          "#manaV80HomeBtn,[data-program]"
        )
      ) {
        setTimeout(watch, 1600);
      }
    });

    window.addEventListener("pageshow", watch);
    window.MANA_SELECTION_BUILD = "103930";
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
