/* =========================================
   MANA MOVEMENT TRAINING v6.5.1
   LEGACY STRENGTH NAV DISABLED

   The modern v8.3 program shell now owns
   navigation throughout Mana Strength.

   This file remains intentionally lightweight
   so older references do not break.
   ========================================= */

(() => {
  "use strict";


  const LEGACY_NAV_ID =
    "manaStrengthBottomNav";


  function removeLegacyNav() {

    const nav =
      document.getElementById(
        LEGACY_NAV_ID
      );


    if (nav) {

      nav.remove();

    }

  }


  function init() {

    removeLegacyNav();


    const observer =
      new MutationObserver(
        removeLegacyNav
      );


    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true
      }
    );

  }


  if (
    document.readyState ===
      "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }

})();
