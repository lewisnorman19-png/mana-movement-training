
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA STRENGTH FUEL STABILITY
   BUILD 103340

   PURPOSE
   Prevent identical full-page Fuel redraws.

   MANA STRENGTH ONLY.

   PRESERVES
   - Breakfast / Lunch / Dinner / Snacks
   - Food illustrations
   - Yellow meal ticks
   - Daily meal history
   - Calories and protein
   - Water and recovery
   - All navigation
   - Mana 28 Fuel behaviour

   No hiding.
   No loading delay.
   No MutationObserver.
   No repeated timers.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103340";

  if (
    window.MANA_STRENGTH_FUEL_STABILITY_BUILD
      === BUILD
  ) {
    return;
  }

  const CONTENT_ID = "manaV83Content";
  const FUEL_ID = "manaV1015Fuel";

  const descriptor =
    Object.getOwnPropertyDescriptor(
      Element.prototype,
      "innerHTML"
    );

  if (
    !descriptor ||
    typeof descriptor.get !== "function" ||
    typeof descriptor.set !== "function"
  ) {
    console.warn(
      "Mana Strength Fuel stability: " +
      "HTML setter unavailable"
    );
    return;
  }

  const originalGet = descriptor.get;
  const originalSet = descriptor.set;

  let lastFuelMarkup = null;
  let lastFuelRoot = null;
  let lastContentElement = null;

  /* =========================================
     PROGRAM CHECK
     ========================================= */

  function isManaStrength() {

    const title =
      document.getElementById(
        "manaV83Title"
      );

    return (
      title?.textContent || ""
    )
      .trim()
      .toUpperCase() ===
      "MANA STRENGTH";

  }

  /* =========================================
     FUEL CHECK
     ========================================= */

  function isStrengthFuelOpen() {

    if (!isManaStrength()) {
      return false;
    }

    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );

    const fuelTab =
      document.querySelector(
        '#manaV83Tabs ' +
        '.mana-v83-tab.active' +
        '[data-v83-tab="fuel"]'
      );

    return Boolean(
      shell?.classList.contains("open") &&
      fuelTab
    );

  }

  /* =========================================
     IDENTIFY SHARED FUEL MARKUP
     ========================================= */

  function isFuelMarkup(value) {

    if (typeof value !== "string") {
      return false;
    }

    return (
      value.includes(
        'id="' + FUEL_ID + '"'
      ) &&
      value.includes(
        "m1022-category-grid"
      ) &&
      value.includes(
        "MANA STRENGTH"
      )
    );

  }

  /* =========================================
     RESET CACHE
     ========================================= */

  function resetCache() {

    lastFuelMarkup = null;
    lastFuelRoot = null;
    lastContentElement = null;

  }

  /* =========================================
     SAFE SETTER
     ========================================= */

  function stableInnerHTML(value) {

    const isContent =
      this.id === CONTENT_ID &&
      this === document.getElementById(
        CONTENT_ID
      );

    if (
      !isContent ||
      !isStrengthFuelOpen() ||
      !isFuelMarkup(value)
    ) {

      // All other screen writes behave normally.
      if (isContent) {
        resetCache();
      }

      return originalSet.call(
        this,
        value
      );

    }

    const currentFuelRoot =
      document.getElementById(
        FUEL_ID
      );

    const sameMarkup =
      value === lastFuelMarkup;

    const sameContent =
      this === lastContentElement;

    const sameRoot =
      currentFuelRoot &&
      currentFuelRoot === lastFuelRoot &&
      currentFuelRoot.parentElement === this;

    if (
      sameMarkup &&
      sameContent &&
      sameRoot
    ) {

      // Identical Fuel content already exists.
      // Preserve the DOM and loaded images.
      return;

    }

    // A genuine update or first render.
    // Allow the original renderer to work.
    originalSet.call(
      this,
      value
    );

    lastFuelMarkup = value;

    lastContentElement = this;

    lastFuelRoot =
      document.getElementById(
        FUEL_ID
      );

  }

  /* =========================================
     INSTALL ONCE
     ========================================= */

  try {

    Object.defineProperty(
      Element.prototype,
      "innerHTML",
      {
        configurable: true,
        enumerable: descriptor.enumerable,

        get() {
          return originalGet.call(this);
        },

        set(value) {
          return stableInnerHTML.call(
            this,
            value
          );
        }
      }
    );

    window.MANA_STRENGTH_FUEL_STABILITY_BUILD =
      BUILD;

    console.log(
      "Mana Strength Fuel stability",
      BUILD
    );

  } catch (error) {

    console.warn(
      "Mana Strength Fuel stability " +
      "could not install",
      error
    );

  }

})();
