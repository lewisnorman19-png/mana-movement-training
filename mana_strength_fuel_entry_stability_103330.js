
/* =========================================================
   MANA MOVEMENT TRAINING
   STRENGTH FUEL ENTRY STABILITY

   BUILD 103330

   Complete standalone JavaScript file.

   GOAL
   Hide the intermediate visual frames when opening
   Mana Strength > Fuel, then reveal the finished screen.

   Mana 28 and Mana Lyfe remain untouched.

   Does not change:
   - Meal data
   - Image URLs
   - Fuel rendering
   - Saved meals
   - Water
   - Recovery
   - Yellow meal ticks

   Note: This is an entry-display fix.
   It does not remove old refresh timers.
   ========================================================= */

(() => {
  "use strict";

  const BUILD = "103330";

  if (
    window.MANA_STRENGTH_FUEL_ENTRY_BUILD === BUILD
  ) {
    return;
  }

  window.MANA_STRENGTH_FUEL_ENTRY_BUILD = BUILD;

  const STYLE_ID =
    "mana-strength-fuel-entry-style-103330";

  const CLASS_NAME =
    "mana-strength-fuel-entering-103330";

  const SETTLE_MS = 900;

  let finishTimer = 0;

  /* =========================================
     ACTIVE PROGRAM
     ========================================= */

  function strengthActive() {

    const title = document.getElementById(
      "manaV83Title"
    );

    return (
      title?.textContent || ""
    )
      .trim()
      .toUpperCase() === "MANA STRENGTH";

  }

  /* =========================================
     ACTIVE FUEL TAB
     ========================================= */

  function fuelTabActive() {

    const shell = document.getElementById(
      "manaV83ProgramShell"
    );

    const tab = document.querySelector(
      '#manaV83Tabs ' +
      '.mana-v83-tab.active' +
      '[data-v83-tab="fuel"]'
    );

    return Boolean(
      shell?.classList.contains("open") &&
      tab
    );

  }

  /* =========================================
     END ENTRY
     ========================================= */

  function endEntry() {

    clearTimeout(finishTimer);

    finishTimer = 0;

    document.documentElement.classList.remove(
      CLASS_NAME
    );

  }

  /* =========================================
     BEGIN ENTRY
     ========================================= */

  function beginEntry() {

    if (!strengthActive()) {
      endEntry();
      return;
    }

    clearTimeout(finishTimer);

    document.documentElement.classList.add(
      CLASS_NAME
    );

    finishTimer = setTimeout(
      endEntry,
      SETTLE_MS
    );

  }

  /* =========================================
     NAVIGATION
     ========================================= */

  function inspectNavigation(event) {

    if (!(event.target instanceof Element)) {
      return;
    }

    const fuel = event.target.closest(
      '#manaV83Tabs [data-v83-tab="fuel"]'
    );

    if (fuel && strengthActive()) {

      // Run before existing navigation handlers.
      beginEntry();

      return;
    }

    const otherTab = event.target.closest(
      '#manaV83Tabs ' +
      '[data-v83-tab]:not([data-v83-tab="fuel"])'
    );

    if (otherTab) {
      endEntry();
    }

  }

  /* =========================================
     NAVIGATION STATE
     ========================================= */

  function syncNavigation() {

    if (
      !strengthActive() ||
      !fuelTabActive()
    ) {
      endEntry();
    }

  }

  /* =========================================
     STYLES
     ========================================= */

  function installStyle() {

    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement(
      "style"
    );

    style.id = STYLE_ID;

    style.textContent = `

      html.${CLASS_NAME}
      #manaV83Content > #manaV1015Fuel,

      html.${CLASS_NAME}
      #manaV83Content > .m1022-fuel-root,

      html.${CLASS_NAME}
      #manaV83Content > [id="manaV1015Fuel"] {

        visibility: hidden !important;

      }

      @media (
        prefers-reduced-motion: no-preference
      ) {

        #manaV83Content > #manaV1015Fuel {

          transition: opacity 120ms ease;

        }

      }

    `;

    document.head.appendChild(style);

  }

  /* =========================================
     INITIALISE
     ========================================= */

  function init() {

    installStyle();

    document.addEventListener(
      "click",
      inspectNavigation,
      true
    );

    window.addEventListener(
      "pageshow",
      endEntry
    );

    document.addEventListener(
      "visibilitychange",
      () => {

        if (document.hidden) {
          endEntry();
        }

      }
    );

    console.log(
      "Mana Strength Fuel Entry Stability",
      BUILD
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
