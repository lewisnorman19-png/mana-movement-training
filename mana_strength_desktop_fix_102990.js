
/* ===========================================
   MANA MOVEMENT TRAINING
   STRENGTH OVERVIEW DESKTOP FIX
   BUILD 102990

   Only affects Mana Strength Overview.
   Does not modify Mana 28, Mana Lyfe,
   phone layouts, tabs or app functions.
   =========================================== */

(() => {
  "use strict";

  const STYLE_ID = "mana-strength-desktop-102990";

  const CSS = `
    @media (min-width: 901px) {

      /* The main Strength Overview must NOT
         become a three-column grid. */

      body #manaV83Content
      #manaV964Launchpad.mana-v964-launchpad {
        display: block !important;
        width: 100% !important;
        max-width: 800px !important;
        margin-inline: auto !important;
        overflow: visible !important;
      }

      /* Heading above cards, full width */

      body #manaV83Content
      #manaV964Launchpad .mana-v964-intro {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        margin-bottom: 22px !important;
      }

      /* Actual card grid: TWO columns */

      body #manaV83Content
      #manaV964Launchpad .mana-v964-grid {
        display: grid !important;
        grid-template-columns:
          repeat(2, minmax(0, 1fr)) !important;
        grid-auto-flow: row !important;
        gap: 16px !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
      }

      /* Stop card content being clipped */

      body #manaV83Content
      #manaV964Launchpad .mana-v964-launch {
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        box-sizing: border-box !important;
      }

      body #manaV83Content
      #manaV964Launchpad .mana-v964-title,
      body #manaV83Content
      #manaV964Launchpad .mana-v964-text {
        min-width: 0 !important;
        overflow-wrap: break-word !important;
      }

    }
  `;

  function install() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
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

  window.MANA_STRENGTH_DESKTOP_FIX = "102990";

})();
