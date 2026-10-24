
/* ============================================
   MANA MOVEMENT TRAINING
   MANA LYFE — RESET VISUAL CLEANUP
   BUILD 103280

   PURPOSE:
   Remove duplicate breathing instructions
   displayed above the green circle.

   KEEP:
   - Green animated breathing circle
   - 60-second countdown
   - Inhale / Hold / Exhale inside circle
   - Existing Reset flow
   - Continue button
   - Whakatauki
   - Existing timer and storage

   PERFORMANCE:
   - Styles installed once
   - No timers
   - No MutationObserver
   - No additional event listeners
   - No DOM reconstruction
   ============================================ */

(() => {
  "use strict";

  const BUILD = "103280";

  const STYLE_ID =
    "mana-lyfe-reset-cleanup-103280";

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const CSS = `

    /* =====================================
       REMOVE OLD DUPLICATE BREATHING CUE

       Source:
       v9_37_mana_life_reset_upgrade.js

       The green circle already contains
       the phase and breathing instructions.
       ===================================== */

    #manaV936ResetModal
    #manaV937BreathCue {

      display: none !important;

    }

    /* =====================================
       KEEP THE GREEN CIRCLE CENTERED
       ===================================== */

    #manaV936ResetModal
    #manaV936BreathStart {

      margin-left: auto !important;
      margin-right: auto !important;

    }

    /* =====================================
       KEEP CONTINUE BUTTON SPACING TIDY
       ===================================== */

    #manaV936ResetModal
    #manaV936Next {

      margin-top: 18px !important;

    }

  `;

  const style = document.createElement("style");

  style.id = STYLE_ID;
  style.textContent = CSS;

  document.head.appendChild(style);

  window.MANA_LYFE_RESET_CLEANUP_BUILD =
    BUILD;

  console.log(
    "Mana Lyfe Reset Cleanup",
    BUILD
  );

})();
