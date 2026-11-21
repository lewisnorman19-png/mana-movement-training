
/*
  MANA MOVEMENT
  HOME BANNER FINISH — BUILD 105045

  Home screen only.

  Removes old gold active-program streak.
  Separates ManaLyfe text from its icon.
  Preserves all original Home click handlers.
  Does not modify Profile, Learning or Fuel.
*/

(() => {
  "use strict";

  if (window.MANA_HOME_BANNER_105045) return;
  window.MANA_HOME_BANNER_105045 = true;

  const ID = "mana-home-banner-style-105045";

  const css = `
    /* REMOVE THE OLD GOLD ACTIVE STRIPE */

    html body #manaV80Home
    button.mana-v8013-program.current::before,
    html body #manaV80Home
    button#manaV80Strength::before,
    html body #manaV80Home
    button#manaV80Mana28::before {
      content: none !important;
      display: none !important;
      visibility: hidden !important;
      width: 0 !important;
      height: 0 !important;
      background: none !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    /* REMOVE GOLD ACTIVE-BORDER EFFECT */

    html body #manaV80Home
    button.mana-v8013-program.current {
      border: 1px solid #FF7927 !important;
      box-shadow:
        0 8px 22px rgba(0,0,0,.2) !important;
    }

    /* MANA LYFE MOBILE BANNER */

    @media (max-width: 600px) {

      html body #manaV80Home
      button#manaV80Life {
        position: relative !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
        min-height: 310px !important;
        height: 310px !important;
        max-height: none !important;
      }

      /* Heading label — keep clear of icon */

      html body #manaV80Home
      #manaV80Life
      > .mana-v8013-program-label {
        position: absolute !important;
        top: 20px !important;
        left: 18px !important;
        right: 98px !important;
        bottom: auto !important;
        width: calc(100% - 116px) !important;
        max-width: calc(100% - 116px) !important;
        margin: 0 !important;
        padding: 0 !important;
        font-size: clamp(14px,4.5vw,19px)
          !important;
        line-height: 1.15 !important;
        white-space: normal !important;
        overflow-wrap: normal !important;
        word-break: normal !important;
        color: #FF7927 !important;
        -webkit-text-fill-color:
          #FF7927 !important;
        z-index: 6 !important;
      }

      /* White icon — top right */

      html body #manaV80Home
      #manaV80Life
      > .m1025-home-icon,
      html body #manaV80Home
      #manaV80Life
      > .mana-v1024-home-art {
        position: absolute !important;
        top: 17px !important;
        right: 16px !important;
        left: auto !important;
        bottom: auto !important;
        width: 62px !important;
        height: 62px !important;
        margin: 0 !important;
        transform: none !important;
        z-index: 7 !important;
      }

      /* Reset / Rebuild / Move Forward */

      html body #manaV80Home
      #manaV80Life > h2 {
        position: absolute !important;
        top: 105px !important;
        left: 18px !important;
        right: 18px !important;
        bottom: auto !important;
        width: calc(100% - 36px) !important;
        max-width: calc(100% - 36px) !important;
        margin: 0 !important;
        padding: 0 !important;
        font-size: 22px !important;
        line-height: 1.13 !important;
        color: #FFFFFF !important;
        text-align: left !important;
        z-index: 5 !important;
      }

      html body #manaV80Home
      #manaV80Life > h2
      .mana-lyfe-line-105041 {
        display: block !important;
        white-space: nowrap !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Description below the heading */

      html body #manaV80Home
      #manaV80Life > p {
        position: absolute !important;
        top: 196px !important;
        left: 18px !important;
        right: 18px !important;
        bottom: auto !important;
        width: calc(100% - 36px) !important;
        max-width: calc(100% - 36px) !important;
        margin: 0 !important;
        color: #C4CAD2 !important;
        font-size: 12px !important;
        line-height: 1.4 !important;
        z-index: 5 !important;
      }

      /* Membership note */

      html body #manaV80Home
      #manaV80Life::before {
        content: "Included with paid membership"
          !important;
        display: block !important;
        position: absolute !important;
        top: auto !important;
        left: 18px !important;
        right: auto !important;
        bottom: 14px !important;
        width: 55% !important;
        max-width: 55% !important;
        height: auto !important;
        color: #D1D5DB !important;
        font-size: 11px !important;
        line-height: 1.25 !important;
        text-align: left !important;
        z-index: 6 !important;
      }
    }

    /* SMALL PHONES */

    @media (max-width: 360px) {

      html body #manaV80Home
      #manaV80Life
      > .mana-v8013-program-label {
        font-size: 14px !important;
      }

      html body #manaV80Home
      #manaV80Life > h2 {
        font-size: 20px !important;
      }

      html body #manaV80Home
      #manaV80Life > p {
        top: 190px !important;
      }
    }
  `;

  function install() {
    let style = document.getElementById(ID);

    if (!style) {
      style = document.createElement("style");
      style.id = ID;
      document.head.appendChild(style);
    }

    style.textContent = css;

    window.MANA_HOME_BANNER_BUILD = "105045";

    console.log(
      "[Mana Movement] Home banners 105045 loaded"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      install,
      { once: true }
    );
  } else {
    install();
  }

})();
