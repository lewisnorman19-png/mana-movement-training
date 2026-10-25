
/* =====================================================
   MANA MOVEMENT TRAINING
   MOBILE EXPERIENCE POLISH
   BUILD 103660

   COMPLETE NEW FILE:
   mana_mobile_performance_103660.js

   PURPOSE:
   - Prevent small input fields causing phone zoom
   - Improve mobile touch response
   - Stabilise scrollable content
   - Avoid unnecessary tap flashing
   - Respect reduced-motion preferences
   - Keep all program logic unchanged

   PRESERVES:
   - Mana Strength workout ticks
   - Always-visible workout exercises
   - Strength and Lyfe chats
   - Mana 28
   - Fuel, Progress and Reset
   - Existing colours and layouts

   No MutationObservers.
   No polling.
   No program re-rendering.
   No data modifications.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103660";
  const STYLE_ID = "mana-mobile-polish-103660";

  if (window.MANA_MOBILE_POLISH_103660) {
    return;
  }

  window.MANA_MOBILE_POLISH_103660 = true;

  function installStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* =====================================
         MOBILE EXPERIENCE
         ===================================== */

      @media (max-width:767px) {

        /*
         Prevent tap flashes on interactive
         controls, without removing focus
         outlines or accessibility feedback.
        */

        button,
        a,
        [role="button"],
        input,
        select,
        textarea {
          -webkit-tap-highlight-color:
            transparent;
        }

        /*
         Prevent browser input-focus zoom.

         iOS Safari may zoom into focused
         fields with text smaller than 16px.
        */

        input:not([type="checkbox"]):
          not([type="radio"]):
          not([type="range"]),

        select,
        textarea {
          font-size: max(16px, 1em);
        }

        /*
         Comfortable native touch targets
         without forcing card dimensions.
        */

        button,
        [role="button"] {
          touch-action: manipulation;
        }

        /*
         Native momentum scrolling for
         existing scrollable areas.
        */

        #manaV95ChatModal
        .mana-v950-messages,

        #manaV83Content {
          -webkit-overflow-scrolling:
            touch;
        }

        /*
         Contain chat overscroll without
         changing its existing dimensions.
        */

        #manaV95ChatModal
        .mana-v950-messages {
          overscroll-behavior: contain;
        }

        /*
         Keep images within their parents
         without altering chosen sizes.
        */

        img {
          max-width: 100%;
        }

        /*
         Preserve keyboard accessibility.
        */

        :focus-visible {
          outline-offset: 3px;
        }
      }

      /* =====================================
         ACCESSIBILITY:
         REDUCED MOTION
         ===================================== */

      @media (prefers-reduced-motion:reduce) {

        html {
          scroll-behavior: auto !important;
        }

        *,
        *::before,
        *::after {
          scroll-behavior: auto !important;
          transition-duration: 0.01ms !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  function init() {
    installStyles();

    console.log(
      "Mana Movement Mobile Polish",
      BUILD
    );
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
