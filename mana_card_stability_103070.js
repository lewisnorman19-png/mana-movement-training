
/* ============================================
   MANA MOVEMENT TRAINING
   CARD STABILITY + WORKOUT CLEANUP
   BUILD 103070

   PURPOSE
   1. Reduce Fuel card flicker
   2. Reduce Learning card flicker
   3. Remove internal exercise borders
      in Mana 28 and Mana Lyfe

   PRESERVE
   - Mana Strength workouts
   - All Overview layouts
   - Card text and coloured illustrations
   - Bottom navigation
   - Fuel logging
   - Recovery and Water links
   - Progress charts
   - Coach Hub
   ============================================ */

(() => {
  "use strict";

  const BUILD = "103070";

  const STYLE_ID =
    "mana-card-stability-103070";

  if (
    window.MANA_CARD_STABILITY_BUILD === BUILD
  ) return;

  const CSS = `

    :root {
      --mana-stable-gold:
        rgba(230,189,72,.66);
    }

    /* =====================================
       FUEL OVERVIEW CARD
       NO DECORATIVE ANIMATION
       ===================================== */

    #manaV964Launchpad
    .mana-v964-launch[data-v964-tab="fuel"],

    .mana-v978-launchpad
    .mana-v978-launch[data-v978-tab="fuel"] {

      animation: none !important;

      transition: none !important;

      will-change: auto !important;

    }

    /* Keep Fuel icon visually steady */

    #manaV964Launchpad
    .mana-v964-launch[data-v964-tab="fuel"]
    .mana-v964-icon,

    .mana-v978-launchpad
    .mana-v978-launch[data-v978-tab="fuel"]
    .mana-v978-icon {

      animation: none !important;

      transition: none !important;

      will-change: auto !important;

    }

    /* =====================================
       LEARNING OVERVIEW CARD
       NO DECORATIVE ANIMATION
       ===================================== */

    #manaV964Launchpad
    .mana-v964-launch[data-v964-tab="learn"],

    #manaV964Launchpad
    .mana-v964-launch[data-v964-tab="learning"],

    .mana-v978-launchpad
    .mana-v978-launch[data-v978-tab="learn"],

    .mana-v978-launchpad
    .mana-v978-launch[data-v978-tab="learning"] {

      animation: none !important;

      transition: none !important;

      will-change: auto !important;

    }

    /* Keep Learning icon visually steady */

    #manaV964Launchpad
    .mana-v964-launch[data-v964-tab="learn"]
    .mana-v964-icon,

    .mana-v978-launchpad
    .mana-v978-launch[data-v978-tab="learn"]
    .mana-v978-icon,

    .mana-v978-launchpad
    .mana-v978-launch[data-v978-tab="learning"]
    .mana-v978-icon {

      animation: none !important;

      transition: none !important;

      will-change: auto !important;

    }

    /* =====================================
       FUEL TARGET CARDS
       STABLE TEXT AND BAR DISPLAY
       ===================================== */

    .m1022-target,
    .m1022-target-top,
    .m1022-target-icon,
    .m1022-target-value,
    .m1022-target .m1022-bar,
    .m1022-target .m1022-bar span {

      animation: none !important;

      transition: none !important;

      will-change: auto !important;

    }

    /* Preserve progress bar colours */

    .m1022-target.calories
    .m1022-bar span,

    .m1022-target.protein
    .m1022-bar span {

      background: linear-gradient(
        90deg,
        #278b57,
        #45c783
      ) !important;

    }

    .m1022-target.water
    .m1022-bar span {

      background: linear-gradient(
        90deg,
        #1677bb,
        #42b8ff
      ) !important;

    }

    .m1022-target.recovery
    .m1022-bar span {

      background: linear-gradient(
        90deg,
        #6f49bb,
        #a77bff
      ) !important;

    }

    /* =====================================
       LEARNING INTERNAL CARDS
       KEEP PREMIUM GOLD BORDERS
       ===================================== */

    #manaV83Content
    .mana-v985-learn-card,

    #manaV933Life
    .mana-v933-learn-item {

      border-color:
        var(--mana-stable-gold) !important;

      animation: none !important;

      transition: none !important;

    }

    /* =====================================
       MANA 28 + MANA LYFE WORKOUTS

       Remove only exercise separators.
       Keep outer workout/session border.
       ===================================== */

    #manaV83Content
    .mana-v980-exercises
    .mana-v980-exercise {

      border: none !important;

      border-top: none !important;

      border-right: none !important;

      border-bottom: none !important;

      border-left: none !important;

      outline: none !important;

      box-shadow: none !important;

    }

    /* Remove separator pseudo-elements */

    #manaV83Content
    .mana-v980-exercises
    .mana-v980-exercise::before,

    #manaV83Content
    .mana-v980-exercises
    .mana-v980-exercise::after {

      border: none !important;

      box-shadow: none !important;

    }

    /* The workout group retains gold border */

    #manaV83Content
    .mana-v980-workout,

    #manaV83Content
    .mana-v980-session,

    #manaV83Content
    .mana-v980-exercises {

      border-color:
        var(--mana-stable-gold) !important;

      border-width: 1px !important;

    }

    /* Keep exercise text and illustrations */

    #manaV83Content
    .mana-v980-exercise-name {

      color: #f5f5f5;

    }

    #manaV83Content
    .mana-v980-exercise-detail {

      color: #aaa;

    }

    /* No changes to Strength exercise cards */

  `;

  function init() {

    let style = document.getElementById(
      STYLE_ID
    );

    if (!style) {

      style = document.createElement("style");

      style.id = STYLE_ID;

      document.head.appendChild(style);

    }

    style.textContent = CSS;

    window.MANA_CARD_STABILITY_BUILD =
      BUILD;

    console.log(
      "MANA CARD STABILITY",
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
