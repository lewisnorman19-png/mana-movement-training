
/* ==========================================================
   MANA MOVEMENT
   SAFE MOBILE HOME RESTORE
   BUILD 105038

   COMPLETE REPLACEMENT:
   mana_home_mobile_finish_105031.js

   CSS-ONLY HOME LAYOUT.

   IMPORTANT:
   - Never moves original button elements
   - Never replaces innerHTML
   - Never overrides click handlers
   - Never changes program routing
   - Original Home script owns functionality

   MOBILE:
   - Same width for three banners
   - Compact matching heights
   - 34px breathing space between banners
   - Orange heading top-left
   - White heading and description below
   - Icons top-right
   - One bottom row
   - No "Free access" text

   Desktop unchanged.
   ========================================================== */

(() => {
  "use strict";

  const BUILD = "105038";
  const FLAG = "MANA_HOME_SAFE_105038";
  const STYLE = "manaHomeSafeStyle105038";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const css = `

    @media(max-width:600px) {

      /* APPROVED HOME WIDTH */

      html body #manaV80Home {
        position: relative !important;
        width: calc(100vw - 12px) !important;
        max-width: calc(100vw - 12px) !important;
        min-width: 0 !important;

        margin-left:
          calc(50% - 50vw + 6px) !important;
        margin-right: 0 !important;

        padding-left: 0 !important;
        padding-right: 0 !important;

        box-sizing: border-box !important;
      }

      /* ROOM BELOW SELECTION AREA */

      html body #manaV80Home
      .mana-v8013-select {
        margin-bottom: 34px !important;
      }

      /* ====================================
         ORIGINAL PROGRAM BUTTONS

         No DOM changes.
         All three identical.
         ==================================== */

      html body #manaV80Home
      button#manaV80Mana28,

      html body #manaV80Home
      button#manaV80Strength,

      html body #manaV80Home
      button#manaV80Life {
        position: relative !important;

        display: block !important;

        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;

        height: 290px !important;
        min-height: 290px !important;
        max-height: 290px !important;

        margin: 0 0 34px !important;
        padding: 20px 18px 16px !important;

        border: 1px solid #FF7927 !important;
        border-radius: 19px !important;

        background:
          linear-gradient(
            135deg,
            #191B20,
            #101215 72%,
            #1B130E
          ) !important;

        color: #FFFFFF !important;
        text-align: left !important;

        overflow: hidden !important;
        box-sizing: border-box !important;

        box-shadow:
          0 8px 22px rgba(0,0,0,.20)
          !important;
      }

      /* ORANGE PROGRAM NAME */

      html body #manaV80Home
      button.mana-v8013-program
      > .mana-v8013-program-label {
        display: block !important;
        position: relative !important;
        z-index: 4 !important;

        width: calc(100% - 82px) !important;
        max-width: calc(100% - 82px) !important;

        margin: 0 !important;
        padding: 0 !important;

        color: #FF7927 !important;
        -webkit-text-fill-color:
          #FF7927 !important;

        font-size: 20px !important;
        font-weight: 950 !important;
        line-height: 1.2 !important;
        letter-spacing: 0 !important;
      }

      /* WHITE HEADING */

      html body #manaV80Home
      button.mana-v8013-program > h2 {
        display: block !important;
        position: relative !important;
        z-index: 4 !important;

        width: calc(100% - 82px) !important;
        max-width: calc(100% - 82px) !important;

        margin: 18px 0 0 !important;
        padding: 0 !important;

        font-size: 27px !important;
        font-weight: 950 !important;
        line-height: 1.08 !important;

        color: #FFFFFF !important;
        -webkit-text-fill-color:
          #FFFFFF !important;
      }

      /* SILVER DESCRIPTION

         Start below the icon.
         Applies identically to each card.
      */

      html body #manaV80Home
      button.mana-v8013-program > p {
        display: block !important;
        position: absolute !important;
        z-index: 4 !important;

        top: 131px !important;
        left: 18px !important;
        right: 18px !important;
        bottom: auto !important;

        width: calc(100% - 36px) !important;
        max-width: calc(100% - 36px) !important;

        margin: 0 !important;
        padding: 0 !important;

        color: #C4CAD2 !important;
        -webkit-text-fill-color:
          #C4CAD2 !important;

        font-size: 13px !important;
        line-height: 1.45 !important;
        font-weight: 400 !important;
      }

      /* EXISTING HOME ICONS
         REUSE EXISTING ILLUSTRATIONS */

      html body #manaV80Home
      button.mana-v8013-program
      > .mana-v1024-home-art,

      html body #manaV80Home
      button.mana-v8013-program
      > .m1025-home-icon {
        position: absolute !important;
        display: flex !important;

        top: 20px !important;
        right: 16px !important;
        left: auto !important;
        bottom: auto !important;

        width: 62px !important;
        height: 62px !important;

        transform: none !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: none !important;

        z-index: 5 !important;
      }

      /* REMOVE OLD TOP-RIGHT BADGES
         SO ICON HAS CLEAR SPACE */

      html body #manaV80Home
      button.mana-v8013-program
      .mana-v8013-badge {
        display: none !important;
      }

      /* REMOVE ALL OLD EXTRA NOTES */

      html body #manaV80Home
      button.mana-v8013-program
      .mana-v8013-free-note,

      html body #manaV80Home
      button.mana-v8013-program
      .m1027-home-support,

      html body #manaV80Home
      button.mana-v8013-program
      .mana-v8013-price,

      html body #manaV80Home
      button.mana-v8013-program
      .mana-v8013-current-badge {
        display: none !important;
      }

      /* BOTTOM-RIGHT EXISTING EXPLORE LINK */

      html body #manaV80Home
      button.mana-v8013-program
      .mana-v8013-open {
        display: block !important;
        position: absolute !important;
        z-index: 5 !important;

        bottom: 17px !important;
        right: 18px !important;
        left: auto !important;
        top: auto !important;

        margin: 0 !important;
        padding: 0 !important;

        color: #FF7927 !important;
        -webkit-text-fill-color:
          #FF7927 !important;

        font-size: 12px !important;
        font-weight: 900 !important;
        text-align: right !important;
        max-width: 50% !important;
      }

      /* BOTTOM RULE */

      html body #manaV80Home
      button.mana-v8013-program::after {
        content: "" !important;
        position: absolute !important;
        left: 18px !important;
        right: 18px !important;
        bottom: 47px !important;
        height: 1px !important;

        background:
          rgba(255,255,255,.12) !important;

        pointer-events: none !important;
      }

      /* MANA STRENGTH — MEMBERSHIP */

      html body #manaV80Home
      #manaV80Strength::before {
        content: "$39.99 AUD / month" !important;
        position: absolute !important;

        left: 18px !important;
        bottom: 17px !important;

        z-index: 5 !important;

        color: #D1D5DB !important;
        font-size: 12px !important;
        font-weight: 750 !important;
        line-height: 1.3 !important;
        max-width: 46% !important;

        pointer-events: none !important;
      }

      /* MANA LYFE — INCLUDED WITH MEMBERSHIP */

      html body #manaV80Home
      #manaV80Life::before {
        content:
          "Included with paid membership"
          !important;

        position: absolute !important;
        left: 18px !important;
        bottom: 17px !important;

        z-index: 5 !important;

        color: #D1D5DB !important;
        font-size: 12px !important;
        font-weight: 750 !important;
        line-height: 1.3 !important;

        max-width: 47% !important;
        pointer-events: none !important;
      }

      /* MANA28 — NO FREE CLAIM */

      html body #manaV80Home
      #manaV80Mana28::before {
        content: none !important;
      }

      /* FINAL CARD BOTTOM GAP */

      html body #manaV80Home
      #manaV80Life {
        margin-bottom: 38px !important;
      }
    }

    @media(max-width:360px) {

      html body #manaV80Home
      button#manaV80Mana28,

      html body #manaV80Home
      button#manaV80Strength,

      html body #manaV80Home
      button#manaV80Life {
        height: 312px !important;
        min-height: 312px !important;
        max-height: 312px !important;
      }

      html body #manaV80Home
      button.mana-v8013-program > h2 {
        font-size: 25px !important;
      }

      html body #manaV80Home
      button.mana-v8013-program > p {
        font-size: 12px !important;
        top: 140px !important;
      }
    }
  `;

  function init() {
    let style = document.getElementById(STYLE);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE;
      document.head.appendChild(style);
    }

    style.textContent = css;

    window.MANA_HOME_MOBILE_BUILD = BUILD;

    console.log(
      "[Mana Movement] Safe Mobile Home " +
      BUILD + " active"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
