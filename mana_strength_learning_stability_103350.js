
/* =================================================
   MANA MOVEMENT TRAINING
   STRENGTH LEARNING STABILITY

   BUILD 103350

   PURPOSE:
   Prevent repeated full-page Learning redraws.

   PRESERVES:
   - All learning categories
   - Lesson cards
   - Expand / collapse behaviour
   - Learning content
   - Learning colours
   - Bottom navigation

   DOES NOT CHANGE:
   - Mana Strength Fuel
   - Mana 28
   - Mana Lyfe
   - Saved data

   No hiding.
   No loading delays.
   No polling.
   No MutationObserver.
   ================================================= */

(() => {
  "use strict";

  const BUILD = "103350";

  if (
    window.MANA_STRENGTH_LEARNING_STABILITY_BUILD
      === BUILD
  ) {
    return;
  }

  const CONTENT_ID = "manaV83Content";
  const LEARNING_SELECTOR = ".mana-v9120-root";

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
      "Mana Learning Stability: setter unavailable"
    );
    return;
  }

  const originalGet = descriptor.get;
  const originalSet = descriptor.set;

  /* =========================================
     CURRENT PROGRAM
     ========================================= */

  function strengthActive() {

    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );

    const title =
      document.getElementById(
        "manaV83Title"
      );

    return Boolean(
      shell?.classList.contains("open") &&
      String(
        title?.textContent || ""
      ).trim().toUpperCase() === "MANA STRENGTH"
    );

  }

  /* =========================================
     LEARNING TAB
     ========================================= */

  function learningActive() {

    if (!strengthActive()) {
      return false;
    }

    return Boolean(
      document.querySelector(
        '#manaV83Tabs ' +
        '.mana-v83-tab.active' +
        '[data-v83-tab="learn"]'
      )
    );

  }

  /* =========================================
     IDENTIFY LEARNING RENDER
     ========================================= */

  function isLearningMarkup(value) {

    return (
      typeof value === "string" &&
      value.includes("mana-v9120-root") &&
      value.includes("MANA STRENGTH") &&
      value.includes("Learn")
    );

  }

  /* =========================================
     STABLE HTML SETTER
     ========================================= */

  function stableInnerHTML(value) {

    const isMainContent =
      this.id === CONTENT_ID &&
      this === document.getElementById(
        CONTENT_ID
      );

    if (
      !isMainContent ||
      !learningActive() ||
      !isLearningMarkup(value)
    ) {

      // Everything outside Strength Learning
      // retains its original behaviour.

      return originalSet.call(
        this,
        value
      );

    }

    const existingLearning =
      this.querySelector(
        LEARNING_SELECTOR
      );

    if (
      existingLearning &&
      existingLearning.parentElement === this
    ) {

      // Learning is already rendered.
      // Keep the existing cards and their
      // current expanded/collapsed state.
      //
      // Skip redundant full-page replacement.

      return;

    }

    // First render or genuine navigation
    // back into the Learning screen.

    return originalSet.call(
      this,
      value
    );

  }

  /* =========================================
     INSTALL GUARD
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

    window.MANA_STRENGTH_LEARNING_STABILITY_BUILD =
      BUILD;

    console.log(
      "Mana Strength Learning Stability",
      BUILD
    );

  } catch (error) {

    console.warn(
      "Mana Learning Stability installation failed",
      error
    );

  }

})();
