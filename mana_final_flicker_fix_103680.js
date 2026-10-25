
/* =====================================================
   MANA MOVEMENT TRAINING
   FINAL SCREEN FLICKER FIX
   BUILD 103680

   COMPLETE JAVASCRIPT FILE

   TARGET SCREENS:
   - Mana Lyfe Workouts
   - Mana 28 Workouts
   - Mana Strength Learning

   PURPOSE:
   Prevent identical screen content from
   being destroyed and rebuilt repeatedly.

   PRESERVES:
   - All workout interactions
   - Completed workout ticks
   - Week navigation
   - Learning card interactions
   - Coach and Support Chat
   - Fuel and Progress
   - Existing premium styling

   No timers.
   No polling.
   No MutationObservers.
   No data modifications.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103680";

  if (window.MANA_FLICKER_FIX_103680) {
    return;
  }

  window.MANA_FLICKER_FIX_103680 = true;

  const CONTENT_ID = "manaV83Content";

  const original = Object.getOwnPropertyDescriptor(
    Element.prototype,
    "innerHTML"
  );

  if (
    !original ||
    typeof original.get !== "function" ||
    typeof original.set !== "function"
  ) {
    console.warn(
      "Mana Flicker Fix: native HTML setter unavailable"
    );

    return;
  }

  /*
   Store the last full HTML value written
   to each content element.

   WeakMap prevents retained references
   when an element is removed.
  */

  const lastRender = new WeakMap();

  function currentProgram() {
    return String(
      document.getElementById(
        "manaV83Title"
      )?.textContent || ""
    )
      .trim()
      .toUpperCase();
  }

  function currentTab() {
    return document.querySelector(
      "#manaV83Tabs .mana-v83-tab.active"
    )?.dataset.v83Tab || "";
  }

  function isTargetScreen() {
    const shell = document.getElementById(
      "manaV83ProgramShell"
    );

    if (
      !shell ||
      !shell.classList.contains("open")
    ) {
      return false;
    }

    const program = currentProgram();
    const tab = currentTab();

    const workout =
      tab === "program" &&
      (
        program === "MANA LYFE" ||
        program === "MANA LIFE" ||
        program === "MANA 28"
      );

    const learning =
      tab === "learn" &&
      program === "MANA STRENGTH";

    return workout || learning;
  }

  /*
   Check whether the previous screen
   is still present.

   If another renderer has removed it,
   the new render must be allowed.
  */

  function screenStillPresent(element) {
    const program = currentProgram();
    const tab = currentTab();

    if (
      tab === "learn" &&
      program === "MANA STRENGTH"
    ) {
      return Boolean(
        element.querySelector(
          ".mana-v9120-root"
        )
      );
    }

    if (
      tab === "program" &&
      (
        program === "MANA LYFE" ||
        program === "MANA LIFE" ||
        program === "MANA 28"
      )
    ) {
      return Boolean(
        element.querySelector(
          ".mana-v980-root"
        )
      );
    }

    return false;
  }

  /*
   Replace only identical full-screen
   writes to the known content host.

   Any changed HTML is passed directly
   to the browser's original setter.

   Other app elements are unaffected.
  */

  Object.defineProperty(
    Element.prototype,
    "innerHTML",
    {
      configurable: original.configurable,
      enumerable: original.enumerable,

      get: function() {
        return original.get.call(this);
      },

      set: function(value) {
        if (
          !(this instanceof HTMLElement) ||
          this.id !== CONTENT_ID ||
          !isTargetScreen()
        ) {
          lastRender.delete(this);
          return original.set.call(this,value);
        }

        if (typeof value !== "string") {
          lastRender.delete(this);
          return original.set.call(this,value);
        }

        const previous = lastRender.get(this);

        if (
          previous === value &&
          screenStillPresent(this)
        ) {
          /*
           Identical existing screen:
           do not destroy its elements.
          */

          return;
        }

        lastRender.set(this,value);

        return original.set.call(this,value);
      }
    }
  );

  window.MANA_FLICKER_FIX_BUILD = BUILD;

  console.log(
    "Mana Movement Flicker Fix",
    BUILD
  );

})();
