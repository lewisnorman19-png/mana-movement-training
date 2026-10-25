
/* =====================================================
   MANA MOVEMENT TRAINING
   ALWAYS-VISIBLE STRENGTH EXERCISES
   BUILD 103580

   COMPLETE FILE REPLACEMENT:
   mana_strength_always_show_exercises_103560.js

   - Show all workout exercise lists automatically
   - Preserve yellow numbers and white text
   - Keep Start Workout buttons visible
   - Remove View/Hide Workout label
   - Preserve existing completion ticks
   - Preserve workout history and navigation
   - No polling or image loading
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103580";
  const STYLE_ID = "mana-always-visible-103580";

  if (window.MANA_ALWAYS_VISIBLE_103580) return;
  window.MANA_ALWAYS_VISIBLE_103580 = true;

  const $ = id => document.getElementById(id);

  function isStrengthWorkouts() {
    const title = (
      $("manaV83Title")?.textContent || ""
    ).trim().toUpperCase();

    const active = document.querySelector(
      "#manaV83Tabs .mana-v83-tab.active"
    );

    return (
      title === "MANA STRENGTH" &&
      active?.dataset.v83Tab === "program"
    );
  }

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      #manaV83Content
      .mana-v85-day .mana-v85-exercises {
        display: flex !important;
        flex-direction: column !important;
        gap: 4px !important;
        padding: 6px 18px 20px !important;
        visibility: visible !important;
        opacity: 1 !important;
        border: 0 !important;
        background: transparent !important;
      }

      #manaV83Content
      .mana-v85-day .mana-v85-exercise {
        display: flex !important;
        align-items: center !important;
        min-height: 43px !important;
        gap: 14px !important;
        padding: 10px 12px !important;
        margin: 0 !important;
        border: 0 !important;
        background: transparent !important;
        color: #fff !important;
        font-size: 13px !important;
      }

      #manaV83Content
      .mana-v85-day .mana-v85-num {
        display: grid !important;
        place-items: center !important;
        flex: 0 0 29px !important;
        width: 29px !important;
        height: 29px !important;
        border: 1.5px solid #F3D875 !important;
        border-radius: 10px !important;
        color: #F3D875 !important;
        background: rgba(243,216,117,.06) !important;
        font-weight: 900 !important;
      }

      #manaV83Content
      .mana-v85-day .mana-v85-start {
        display: block !important;
        visibility: visible !important;
      }

      #manaV83Content
      .mana-v85-day .mana-v964-open-label {
        display: none !important;
      }

      #manaV83Content
      .mana-v85-day {
        border: 2px solid #F3D875 !important;
        border-radius: 20px !important;
      }

      @media(max-width:480px) {
        #manaV83Content
        .mana-v85-day .mana-v85-exercises {
          padding: 5px 10px 17px !important;
        }

        #manaV83Content
        .mana-v85-day .mana-v85-exercise {
          gap: 11px !important;
          padding: 10px 8px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function showExercises() {
    if (!isStrengthWorkouts()) return;

    const content = $("manaV83Content");
    if (!content) return;

    const cards = content.querySelectorAll(
      ".mana-v85-day"
    );

    cards.forEach(card => {
      const list = card.querySelector(
        ".mana-v85-exercises"
      );

      if (list) {
        // Inline !important takes priority over
        // the original collapsed-card CSS rule.
        list.style.setProperty(
          "display",
          "flex",
          "important"
        );

        list.style.setProperty(
          "flex-direction",
          "column",
          "important"
        );

        list.style.setProperty(
          "visibility",
          "visible",
          "important"
        );

        list.style.setProperty(
          "opacity",
          "1",
          "important"
        );
      }

      const start = card.querySelector(
        ".mana-v85-start"
      );

      if (start) {
        start.style.setProperty(
          "display",
          "block",
          "important"
        );
      }

      const label = card.querySelector(
        ".mana-v964-open-label"
      );

      if (label) {
        label.style.setProperty(
          "display",
          "none",
          "important"
        );
      }
    });
  }

  let queued = false;

  function refresh() {
    if (queued) return;
    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      showExercises();
    });
  }

  function init() {
    installStyles();

    const content = $("manaV83Content");

    if (content) {
      // Watch only changes to direct children.
      // Existing workout navigation can replace
      // the cards when opening the page.
      const observer = new MutationObserver(
        refresh
      );

      observer.observe(content, {
        childList: true
      });
    }

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        if (event.target.closest(
          "#manaV83Tabs, .mana-v85-day"
        )) {
          refresh();
        }
      }
    );

    window.addEventListener(
      "mana:program-tab-change",
      refresh
    );

    window.addEventListener(
      "mana:strength-synced",
      refresh
    );

    window.addEventListener(
      "pageshow",
      refresh
    );

    refresh();

    console.log(
      "Mana Strength Always Visible",
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
