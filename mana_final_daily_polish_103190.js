
/* ============================================
   MANA MOVEMENT TRAINING
   LIGHTWEIGHT FUEL MEAL TICKS
   BUILD 103300

   REPLACES:
   mana_final_daily_polish_103190.js

   - Yellow tick on logged meal categories
   - No image changes
   - No Fuel page rebuild
   - No repeated timers
   - No MutationObserver
   - One refresh per animation frame
   - Existing meal storage preserved

   Reset, support chat, workouts and
   Progress remain owned by their
   existing modules.
   ============================================ */

(() => {
  "use strict";

  const BUILD = "103300";
  const STYLE_ID = "mana-meal-ticks-103300";
  const FUEL_KEY = "mana-fuel-v571";

  if (window.MANA_MEAL_TICKS_BUILD === BUILD) {
    return;
  }

  const CSS = `

    #manaV1015Fuel
    .m1022-category {
      position: relative !important;
    }

    #manaV1015Fuel
    .m1022-category.mana-meal-selected::after {
      content: "✓";
      position: absolute;
      top: 9px;
      right: 9px;
      width: 25px;
      height: 25px;
      display: grid;
      place-items: center;
      border: 1px solid #f3d875;
      border-radius: 50%;
      background: #17150b;
      color: #f3d875;
      font-size: 16px;
      font-weight: 900;
      pointer-events: none;
      z-index: 2;
    }

  `;

  function installStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function todayKey() {
    const d = new Date();

    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0")
    ].join("-");
  }

  function readMeals() {
    try {
      const data = JSON.parse(
        localStorage.getItem(FUEL_KEY) || "{}"
      );

      return data?.[todayKey()]?.meals || {};
    } catch (_) {
      return {};
    }
  }

  function updateTicks() {
    const fuel = document.getElementById(
      "manaV1015Fuel"
    );

    if (!fuel) return;

    const meals = readMeals();

    fuel.querySelectorAll(
      ".m1022-category[data-m1022-open]"
    ).forEach(card => {

      const category = card.dataset.m1022Open;

      const records = meals[category] || [];

      const selected =
        Array.isArray(records) &&
        records.length > 0;

      if (
        card.classList.contains(
          "mana-meal-selected"
        ) !== selected
      ) {
        card.classList.toggle(
          "mana-meal-selected",
          selected
        );
      }

    });
  }

  let queued = false;

  function scheduleTicks() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      updateTicks();
    });
  }

  function init() {
    installStyles();

    /* Only react to real Fuel updates. */
    window.addEventListener(
      "mana:fuel-updated",
      scheduleTicks
    );

    /* Navigation may mount a new Fuel page. */
    window.addEventListener(
      "mana:program-tab-change",
      scheduleTicks
    );

    /* Original Fuel events can use the
       document rather than window. */
    document.addEventListener(
      "mana:fuel-updated",
      scheduleTicks
    );

    document.addEventListener(
      "mana:program-tab-change",
      scheduleTicks
    );

    window.addEventListener(
      "pageshow",
      scheduleTicks
    );

    scheduleTicks();

    window.MANA_MEAL_TICKS_BUILD = BUILD;

    console.log(
      "Mana lightweight meal ticks",
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
