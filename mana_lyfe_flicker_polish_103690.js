
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — FINAL FLICKER POLISH
   BUILD 103690

   COMPLETE JAVASCRIPT FILE

   TARGET:
   - Mana Lyfe workout minor flicker
   - Mana Lyfe homepage banner flicker

   PRESERVES:
   - Mana Strength
   - Mana 28
   - Coach Chat and Support Chat
   - Workout completion and history
   - Fuel, Routine, Reset and Learning
   - Existing premium colours

   No polling.
   No MutationObserver.
   No localStorage changes.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103690";
  const STYLE_ID = "mana-lyfe-flicker-103690";

  if (window.MANA_LYFE_FLICKER_103690) {
    return;
  }

  window.MANA_LYFE_FLICKER_103690 = true;

  const $ = id =>
    document.getElementById(id);

  /* =========================================
     IDENTIFY MANA LYFE WORKOUT SCREEN
     ========================================= */

  function lyfeWorkoutOpen() {
    const shell = $("manaV83ProgramShell");

    if (!shell?.classList.contains("open")) {
      return false;
    }

    const title = String(
      $("manaV83Title")?.textContent || ""
    ).trim().toUpperCase();

    if (
      title !== "MANA LYFE" &&
      title !== "MANA LIFE"
    ) {
      return false;
    }

    const tab = document.querySelector(
      "#manaV83Tabs .mana-v83-tab.active"
    )?.dataset.v83Tab;

    return tab === "program";
  }

  /* =========================================
     DUPLICATE RENDER PROTECTION

     Extend the existing render protection
     to include Mana Lyfe's session screen.

     If the generated HTML is identical
     and still mounted, preserve it.

     Changed screens always render normally.
     ========================================= */

  function installRenderProtection() {
    const descriptor =
      Object.getOwnPropertyDescriptor(
        Element.prototype,
        "innerHTML"
      );

    if (
      !descriptor ||
      !descriptor.configurable ||
      typeof descriptor.get !== "function" ||
      typeof descriptor.set !== "function"
    ) {
      return;
    }

    const originalGet = descriptor.get;
    const originalSet = descriptor.set;

    const lastHTML = new WeakMap();

    Object.defineProperty(
      Element.prototype,
      "innerHTML",
      {
        configurable: true,
        enumerable: descriptor.enumerable,

        get: function() {
          return originalGet.call(this);
        },

        set: function(value) {
          if (
            this.id !== "manaV83Content" ||
            !lyfeWorkoutOpen() ||
            typeof value !== "string"
          ) {
            lastHTML.delete(this);
            return originalSet.call(this,value);
          }

          const existing =
            this.querySelector(
              ".mana-v980-root, .mana-v980-session"
            );

          if (
            existing &&
            lastHTML.get(this) === value
          ) {
            /*
             The same Lyfe workout screen
             is already present.

             Avoid destroying and
             recreating its DOM.
            */
            return;
          }

          lastHTML.set(this,value);

          return originalSet.call(this,value);
        }
      }
    );
  }

  /* =========================================
     HOMEPAGE CARD STABILITY
     ========================================= */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /*
       Scope changes to the Mana Lyfe
       homepage card only.
      */

      #manaV80Life {
        animation: none !important;
        animation-delay: 0s !important;

        transition: none !important;

        backface-visibility: hidden;
      }

      #manaV80Life::before,
      #manaV80Life::after {
        animation: none !important;
        transition: none !important;
      }

      #manaV80Life
      .mana-v8013-program-label,

      #manaV80Life
      .mana-v8013-badge,

      #manaV80Life
      .mana-v8013-program-icon {
        animation: none !important;
        transition: none !important;
      }

      /*
       Preserve existing position,
       colour, sizing and card borders.
      */

      @media (max-width:767px) {

        #manaV80Life {
          -webkit-tap-highlight-color:
            transparent;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =========================================
     INITIALISE
     ========================================= */

  function init() {
    installStyles();
    installRenderProtection();

    window.MANA_LYFE_FLICKER_BUILD = BUILD;

    console.log(
      "Mana Lyfe Final Flicker Polish",
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
