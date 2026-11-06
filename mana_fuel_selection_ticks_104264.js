
/* =====================================================
   MANA MOVEMENT — FUEL SELECTION TICKS 104264
   FULL STANDALONE JAVASCRIPT FILE

   REPLACES 104263.
   Use alongside existing Fuel Design 104262.

   - No permanent ticks on empty meal categories.
   - Orange tick when at least one meal is logged.
   - Tick disappears when the final meal is removed.
   - Does not modify saved meals, images or calculations.
   ===================================================== */
(() => {
  "use strict";

  if (window.MANA_FUEL_TICKS_104264) return;
  window.MANA_FUEL_TICKS_104264 = true;

  const ROOT = "manaV1015Fuel";
  const STYLE = "manaFuelTicksStyle104264";
  const STORAGE = "mana-fuel-v571";
  let pending = false;

  function todayKey() {
    const d = new Date();

    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0")
    ].join("-");
  }

  function selectedCategories() {
    try {
      const data = JSON.parse(
        localStorage.getItem(STORAGE) || "{}"
      );

      const meals = data?.[todayKey()]?.meals || {};
      const selected = new Set();

      ["Breakfast", "Lunch", "Dinner", "Snacks"].forEach(
        name => {
          if (
            Array.isArray(meals[name]) &&
            meals[name].length > 0
          ) {
            selected.add(name);
          }
        }
      );

      return selected;
    } catch (_) {
      return new Set();
    }
  }

  function installStyles() {
    if (document.getElementById(STYLE)) return;

    const el = document.createElement("style");
    el.id = STYLE;

    el.textContent = `
      /*
       Override the permanent tick created by Fuel 104262.
       Match its full selector specificity.

       The dark overlay masks the original artwork's mark.
      */

      html body #manaV83ProgramShell #${ROOT}
        .m1022-category-grid .m1022-category::after {
        content:""!important;
        display:block!important;
        position:absolute!important;
        top:8px!important;
        right:7px!important;
        left:auto!important;
        width:30px!important;
        height:30px!important;
        border:0!important;
        border-radius:50%!important;
        background:#0D0F13!important;
        color:transparent!important;
        -webkit-text-fill-color:transparent!important;
        font-size:0!important;
        box-shadow:0 0 0 5px #0D0F13!important;
        pointer-events:none!important;
        z-index:10!important;
      }

      /*
       Only logged categories get an orange tick.
      */

      html body #manaV83ProgramShell #${ROOT}
        .m1022-category-grid
        .m1022-category[data-mana-meal-logged="yes"]::after {
        content:"✓"!important;
        display:grid!important;
        place-items:center!important;
        width:30px!important;
        height:30px!important;
        border:1px solid #FF7927!important;
        border-radius:50%!important;
        background:#0D0F13!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        font:900 17px/1 system-ui,sans-serif!important;
        box-shadow:0 0 0 5px #0D0F13!important;
      }

      @media(max-width:600px) {
        html body #manaV83ProgramShell #${ROOT}
          .m1022-category-grid .m1022-category::after {
          left:68px!important;
          right:auto!important;
          top:8px!important;
          width:26px!important;
          height:26px!important;
          box-shadow:0 0 0 3px #0D0F13!important;
        }

        html body #manaV83ProgramShell #${ROOT}
          .m1022-category-grid
          .m1022-category[data-mana-meal-logged="yes"]::after {
          width:26px!important;
          height:26px!important;
          font-size:15px!important;
          box-shadow:0 0 0 3px #0D0F13!important;
        }
      }
    `;

    document.head.appendChild(el);
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

      const next = selected.has(category) ? "yes" : "no";

      if (
        card.getAttribute("data-mana-meal-logged") !== next
      ) {
        card.setAttribute(
          "data-mana-meal-logged",
          next
        );
      }
    });
  }

  function schedule() {
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
      new MutationObserver(schedule).observe(content, {
        childList:true,
        subtree:true
      });
    }

    window.addEventListener(
      "mana:fuel-updated",
      schedule
    );

    window.addEventListener("storage", event => {
      if (event.key === STORAGE) schedule();
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

    window.MANA_FUEL_SELECTION_TICKS_BUILD = "104264";
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
