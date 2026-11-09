
/* ======================================================
   MANA MOVEMENT — FUEL SELECTION TICKS 104266

   COMPLETE REPLACEMENT FOR 104265

   - Ticks moved into the meal description area
   - Food illustrations remain unobstructed
   - Unselected meals have no tick or black circle
   - Orange arrows remain unchanged
   - Existing meal selection logic preserved
   - Works on laptop and phone
   - No changes to saved data
   ====================================================== */

(() => {
  "use strict";

  if (window.MANA_FUEL_TICKS_104266) return;
  window.MANA_FUEL_TICKS_104266 = true;

  const ROOT = "manaV1015Fuel";
  const STYLE = "manaFuelTicksStyle104266";
  const STORAGE = "mana-fuel-v571";

  let queued = false;

  function todayKey() {
    const d = new Date();

    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0")
    ].join("-");
  }

  function selectedCategories() {
    const selected = new Set();

    try {
      const data = JSON.parse(
        localStorage.getItem(STORAGE) || "{}"
      );

      const meals = data?.[todayKey()]?.meals || {};

      [
        "Breakfast",
        "Lunch",
        "Dinner",
        "Snacks"
      ].forEach(category => {
        if (
          Array.isArray(meals[category]) &&
          meals[category].length > 0
        ) {
          selected.add(category);
        }
      });

    } catch (error) {
      console.warn(
        "Mana Fuel: could not read meal selections.",
        error
      );
    }

    return selected;
  }

  function installStyles() {
    if (document.getElementById(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `
      /* =========================================
         REMOVE THE OLD IMAGE OVERLAY COMPLETELY
         ========================================= */

      html body #manaV83ProgramShell #${ROOT}
        .m1022-category-grid .m1022-category::after {
        content:none!important;
        display:none!important;
        visibility:hidden!important;
        background:transparent!important;
        border:0!important;
        box-shadow:none!important;
        width:0!important;
        height:0!important;
        pointer-events:none!important;
      }

      /* =========================================
         RESERVE ROOM IN THE TEXT AREA

         The original arrow remains at far right.
         Our tick sits just to the left of it.
         ========================================= */

      html body #manaV83ProgramShell #${ROOT}
        .m1022-category-grid .m1022-category-copy {
        position:relative!important;
        padding-right:60px!important;
      }

      /* =========================================
         NO TICK WHEN A MEAL IS NOT LOGGED
         ========================================= */

      html body #manaV83ProgramShell #${ROOT}
        .m1022-category-grid
        .m1022-category-copy::after {
        content:none!important;
        display:none!important;
        visibility:hidden!important;
      }

      /* =========================================
         ORANGE TICK — SELECTED MEALS ONLY

         Located in the black text area,
         never over the food illustration.
         ========================================= */

      html body #manaV83ProgramShell #${ROOT}
        .m1022-category-grid
        .m1022-category[data-mana-meal-logged="yes"]
        .m1022-category-copy::after {
        content:"✓"!important;
        display:block!important;
        visibility:visible!important;
        position:absolute!important;
        right:36px!important;
        top:9px!important;
        bottom:auto!important;
        left:auto!important;
        width:18px!important;
        height:22px!important;
        padding:0!important;
        border:0!important;
        background:transparent!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        font:900 18px/22px system-ui,sans-serif!important;
        text-align:center!important;
        text-shadow:none!important;
        box-shadow:none!important;
        pointer-events:none!important;
        z-index:3!important;
      }

      /* =========================================
         PHONE LAYOUT

         The image is on the left and text on
         the right, so position inside text only.
         ========================================= */

      @media(max-width:600px) {
        html body #manaV83ProgramShell #${ROOT}
          .m1022-category-grid .m1022-category-copy {
          padding-right:58px!important;
        }

        html body #manaV83ProgramShell #${ROOT}
          .m1022-category-grid
          .m1022-category[data-mana-meal-logged="yes"]
          .m1022-category-copy::after {
          top:14px!important;
          right:35px!important;
          font-size:17px!important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function updateTicks() {
    const root = document.getElementById(ROOT);
    if (!root) return;

    const selected = selectedCategories();

    root.querySelectorAll(
      ".m1022-category[data-m1022-open]"
    ).forEach(card => {

      const category = card.getAttribute(
        "data-m1022-open"
      );

      const state = selected.has(category)
        ? "yes"
        : "no";

      if (
        card.getAttribute("data-mana-meal-logged") !== state
      ) {
        card.setAttribute(
          "data-mana-meal-logged",
          state
        );
      }
    });
  }

  function schedule() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      updateTicks();
    });
  }

  function init() {
    installStyles();

    const content = document.getElementById(
      "manaV83Content"
    );

    if (content) {
      new MutationObserver(schedule).observe(
        content,
        {
          childList:true,
          subtree:true
        }
      );
    }

    window.addEventListener(
      "mana:fuel-updated",
      schedule
    );

    window.addEventListener("storage", event => {
      if (event.key === STORAGE) {
        schedule();
      }
    });

    document.addEventListener("click", event => {
      if (!(event.target instanceof Element)) return;

      if (
        event.target.closest(
          ".m1022-add," +
          ".m1022-remove," +
          "[data-m1022-open]"
        )
      ) {
        requestAnimationFrame(schedule);
      }
    });

    schedule();

    window.MANA_FUEL_SELECTION_TICKS_BUILD = "104266";
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
