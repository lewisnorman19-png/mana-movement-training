
/* ============================================
   MANA MOVEMENT TRAINING
   COLOUR CONSISTENCY + CARD STABILITY
   BUILD 103080

   MANA 28 PROGRESS:
   - Gold premium card borders
   - Gold / white / grey text
   - Green workout, calorie, protein bars
   - Blue water bar
   - Purple recovery bar only

   MANA LYFE LEARNING:
   - Match Mana Strength Learning
   - Premium thin gold borders
   - Gold / white / grey text

   STABILITY:
   - Disable decorative card animations
   - Retain original rendering and controls

   WORKOUTS:
   - Remove individual exercise outlines
     on Mana 28 and Mana Lyfe only

   NO layout or data model changes.
   ============================================ */

(() => {
  "use strict";

  const BUILD = "103080";
  const STYLE_ID = "mana-card-stability-103070";

  const CSS = `

    :root {
      --mm80-gold: #e6bd48;
      --mm80-border: rgba(230,189,72,.68);
      --mm80-white: #f4f4f4;
      --mm80-grey: #a6a6a6;
      --mm80-green: #45c783;
      --mm80-blue: #42b8ff;
      --mm80-purple: #a77bff;
    }

    /* =====================================
       MANA 28 PROGRESS
       PREMIUM GOLD BORDERS
       ===================================== */

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-periods,

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-overall,

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-card,

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-message,

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-icon {

      border-color:
        var(--mm80-border) !important;

      border-width: 1px !important;

    }

    /* No purple highlighting on selectors */

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-period.active {

      color: var(--mm80-gold) !important;

      background: #17140b !important;

      box-shadow:
        inset 0 0 0 1px
        var(--mm80-border) !important;

    }

    /* Restore Mana text colours */

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-kicker,

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-overall-label,

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-card-label,

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-icon {

      color: #f3d875 !important;

    }

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-head h2,

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-overall-value,

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-percent {

      color: var(--mm80-white) !important;

    }

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-head p,

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-card-copy,

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-overall-sub {

      color: var(--mm80-grey) !important;

    }

    /* Premium gold decorative accents */

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-overall::before,

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-message::before {

      background: linear-gradient(
        90deg,
        transparent,
        var(--mm80-gold),
        transparent
      ) !important;

    }

    /* =====================================
       MANA 28 - PROGRESS BARS

       Match Mana Strength / Fuel.
       ===================================== */

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-overall-bar span,

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-bar span {

      background: linear-gradient(
        90deg,#278b57,#45c783
      ) !important;

    }

    /* Water BLUE */

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-card.water
    .mana-v981-bar span,

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-card[data-type="water"]
    .mana-v981-bar span {

      background: linear-gradient(
        90deg,#1677bb,#42b8ff
      ) !important;

    }

    /* Recovery PURPLE */

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-card.recovery
    .mana-v981-bar span,

    html body #manaV83Content
    .mana-v981-root
    .mana-v981-card[data-type="recovery"]
    .mana-v981-bar span {

      background: linear-gradient(
        90deg,#6f49bb,#a77bff
      ) !important;

    }

    /* =====================================
       MANA LYFE LEARNING
       PREMIUM GOLD / BLACK
       ===================================== */

    html body #manaV933Life
    .mana-v933-learn-item,

    html body #manaV83Content
    .mana-v984-panel,

    html body #manaV83Content
    .mana-v984-accordion {

      border-color:
        var(--mm80-border) !important;

      border-width: 1px !important;

    }

    html body #manaV933Life
    .mana-v933-learn-item {

      background: #0c0c0b !important;

    }

    html body #manaV933Life
    .mana-v933-learn-button
    > span:last-child {

      color: #f3d875 !important;

    }

    html body #manaV83Content
    .mana-v984-accordion
    > button {

      color: var(--mm80-white) !important;

    }

    html body #manaV83Content
    .mana-v984-accordion
    > button span {

      color: #f3d875 !important;

    }

    html body #manaV83Content
    .mana-v984-accordion-body {

      color: var(--mm80-grey) !important;

    }

    /* =====================================
       KEEP FUEL AND LEARNING STEADY
       ===================================== */

    #manaV964Launchpad
    .mana-v964-launch[data-v964-tab="fuel"],

    #manaV964Launchpad
    .mana-v964-launch[data-v964-tab="learn"],

    .mana-v978-launchpad
    .mana-v978-launch[data-v978-tab="fuel"],

    .mana-v978-launchpad
    .mana-v978-launch[data-v978-tab="learn"],

    .m1022-target,

    #manaV83Content
    .mana-v985-learn-card,

    #manaV933Life
    .mana-v933-learn-item {

      animation: none !important;
      transition: none !important;
      will-change: auto !important;

    }

    .m1022-target
    .m1022-bar span {

      animation: none !important;
      transition: none !important;

    }

    /* =====================================
       PRESERVE FUEL PROGRESS COLOURS
       ===================================== */

    .m1022-target.calories
    .m1022-bar span,

    .m1022-target.protein
    .m1022-bar span {

      background: linear-gradient(
        90deg,#278b57,#45c783
      ) !important;

    }

    .m1022-target.water
    .m1022-bar span {

      background: linear-gradient(
        90deg,#1677bb,#42b8ff
      ) !important;

    }

    .m1022-target.recovery
    .m1022-bar span {

      background: linear-gradient(
        90deg,#6f49bb,#a77bff
      ) !important;

    }

    /* =====================================
       MANA 28 / LYFE WORKOUTS
       REMOVE INDIVIDUAL EXERCISE BORDERS
       KEEP OUTER SESSION CARDS
       ===================================== */

    html body #manaV83Content
    .mana-v980-exercises
    .mana-v980-exercise {

      border: none !important;
      outline: none !important;
      box-shadow: none !important;

    }

    html body #manaV83Content
    .mana-v980-exercises
    .mana-v980-exercise::before,

    html body #manaV83Content
    .mana-v980-exercises
    .mana-v980-exercise::after {

      border: none !important;
      box-shadow: none !important;

    }

    /* Keep outside workout boundaries */

    html body #manaV83Content
    .mana-v980-session,

    html body #manaV83Content
    .mana-v980-exercises {

      border-color:
        var(--mm80-border) !important;

    }

    /* Do not change Strength exercise cards */

  `;

  function init() {
    let style = document.getElementById(STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    if (style.textContent !== CSS) {
      style.textContent = CSS;
    }

    window.MANA_CARD_STABILITY_BUILD = BUILD;

    console.log(
      "MANA COLOUR CONSISTENCY", BUILD
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
