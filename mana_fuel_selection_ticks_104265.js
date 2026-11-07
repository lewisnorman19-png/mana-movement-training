
/* ========================================================
   MANA MOVEMENT — FUEL MEAL TICKS 104265

   COMPLETE REPLACEMENT FOR 104264

   FIX:
   - No black circle over an unselected meal photo.
   - Only show an orange CSS tick when a meal is logged.
   - Preserve the existing category pictures and sizes.
   - Preserve meal selection and removal functionality.
   - No changes to saved meal data.
   ======================================================== */

(() => {
  "use strict";

  if (window.MANA_FUEL_TICKS_104265) return;
  window.MANA_FUEL_TICKS_104265 = true;

  const ROOT = "manaV1015Fuel";
  const STYLE_ID = "manaFuelTicksStyle104265";
  const STORAGE_KEY = "mana-fuel-v571";

  let pending = false;

  function getTodayKey() {
    const d = new Date();

    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0")
    ].join("-");
  }

  function getSelectedCategories() {
    const selected = new Set();

    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}"
      );

      const meals = saved?.[getTodayKey()]?.meals || {};

      ["Breakfast", "Lunch", "Dinner", "Snacks"].forEach(
        category => {
          if (
            Array.isArray(meals[category]) &&
            meals[category].length > 0
          ) {
            selected.add(category);
          }
        }
      );
    } catch (error) {
      console.warn(
        "Mana Fuel: unable to read meal selections.",
        error
      );
    }

    return selected;
  }

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      /* ==========================================
         UNSELECTED MEAL CARDS

         Remove the entire pseudo-element.
         No black circle, shadow, border or overlay.
         ========================================== */

      html body #manaV83ProgramShell #${ROOT}
        .m1022-category-grid
        .m1022-category::after,

      html body #manaV83ProgramShell #${ROOT}
        .m1022-category-grid
        .m1022-category[data-mana-meal-logged="no"]::after {

        content:none!important;
        display:none!important;
        visibility:hidden!important;
        width:0!important;
        height:0!important;
        padding:0!important;
        margin:0!important;
        border:0!important;
        background:transparent!important;
        box-shadow:none!important;
        color:transparent!important;
        pointer-events:none!important;
      }

      /* ==========================================
         SELECTED MEAL CARDS

         Orange tick visible only when a meal
         has been added to that category.
         ========================================== */

      html body #manaV83ProgramShell #${ROOT}
        .m1022-category-grid
        .m1022-category[data-mana-meal-logged="yes"]::after {

        content:"✓"!important;
        display:grid!important;
        visibility:visible!important;
        place-items:center!important;

        position:absolute!important;
        top:8px!important;
        right:7px!important;
        left:auto!important;

        width:30px!important;
        height:30px!important;
        padding:0!important;
        margin:0!important;

        border:1px solid #FF7927!important;
        border-radius:50%!important;

        background:#0D0F13!important;

        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;

        font:900 17px/1 system-ui,sans-serif!important;

        text-shadow:none!important;
        box-shadow:none!important;

        pointer-events:none!important;
        z-index:10!important;
      }

      /* ==========================================
         PHONE POSITION
         ========================================== */

      @media(max-width:600px) {

        html body #manaV83ProgramShell #${ROOT}
          .m1022-category-grid
          .m1022-category[data-mana-meal-logged="yes"]::after {

          left:68px!important;
          right:auto!important;
          top:8px!important;

          width:26px!important;
          height:26px!important;

          font-size:15px!important;
          box-shadow:none!important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function updateTicks() {
    const root = document.getElementById(ROOT);
    if (!root) return;

    const selected = getSelectedCategories();

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

  function scheduleUpdate() {
    if (pending) return;

    pending = true;

    requestAnimationFrame(() => {
      pending = false;
      updateTicks();
    });
  }

  function init() {
    installStyles();

    const content = document.getElementById(
      "manaV83Content"
    );

    if (content) {
      new MutationObserver(scheduleUpdate).observe(
        content,
        {
          childList:true,
          subtree:true
        }
      );
    }

    window.addEventListener(
      "mana:fuel-updated",
      scheduleUpdate
    );

    window.addEventListener("storage", event => {
      if (event.key === STORAGE_KEY) {
        scheduleUpdate();
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
        requestAnimationFrame(scheduleUpdate);
      }
    });

    scheduleUpdate();

    window.MANA_FUEL_SELECTION_TICKS_BUILD =
      "104265";
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
