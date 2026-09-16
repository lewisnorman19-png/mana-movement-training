/* =========================================
   MANA MOVEMENT TRAINING v6.1
   Faster meal logging
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID = "mana-v61-quick-meals-style";
  const CHIPS_ID = "fuelV61MealChips";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      #fuelV571Modal .fuel-v571-sheet{
        max-height:88dvh;
        overflow:auto;
      }

      #fuelV571Meal{
        display:none !important;
      }

      #${CHIPS_ID}{
        display:none;
        grid-template-columns:1fr 1fr;
        gap:8px;
        margin:0 0 12px;
      }

      #${CHIPS_ID}.show{
        display:grid;
      }

      .fuel-v61-chip{
        min-height:46px;
        border-radius:14px;
        border:1px solid #343434;
        background:#101010;
        color:#ddd;
        font-size:14px;
        font-weight:800;
      }

      .fuel-v61-chip.active{
        border-color:#6b5a17;
        background:#181406;
        color:#f5d86e;
      }

      #fuelV571Modal .fuel-v571-field{
        margin-bottom:10px;
        padding:14px;
      }

      #fuelV571Modal .fuel-v571-sheet h2{
        margin-bottom:14px;
        font-size:24px;
      }

      @media(max-width:430px){
        #fuelV571Modal .fuel-v571-sheet{
          padding:20px 16px
            calc(20px + env(safe-area-inset-bottom));
        }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureChips() {
    const modal =
      document.getElementById("fuelV571Modal");

    const select =
      document.getElementById("fuelV571Meal");

    if (
      !modal ||
      !select ||
      document.getElementById(CHIPS_ID)
    ) return;

    const chips =
      document.createElement("div");

    chips.id = CHIPS_ID;

    chips.innerHTML =
      ["Breakfast", "Lunch", "Dinner", "Snacks"]
        .map(name => `
          <button
            type="button"
            class="fuel-v61-chip"
            data-meal="${name}"
          >
            ${name}
          </button>
        `)
        .join("");

    select.insertAdjacentElement(
      "afterend",
      chips
    );

    chips.addEventListener(
      "click",
      event => {
        const button =
          event.target.closest(
            ".fuel-v61-chip"
          );

        if (!button) return;

        select.value =
          button.dataset.meal;

        syncChipState();
      }
    );
  }

  function syncChipState() {
    const select =
      document.getElementById(
        "fuelV571Meal"
      );

    if (!select) return;

    document
      .querySelectorAll(
        ".fuel-v61-chip"
      )
      .forEach(button => {
        button.classList.toggle(
          "active",
          button.dataset.meal ===
            select.value
        );
      });
  }

  function prepareDirectMeal(mealName) {
    const modal =
      document.getElementById(
        "fuelV571Modal"
      );

    const select =
      document.getElementById(
        "fuelV571Meal"
      );

    const chips =
      document.getElementById(
        CHIPS_ID
      );

    const title =
      modal?.querySelector(
        ".fuel-v571-sheet h2"
      );

    if (!modal || !select) return;

    select.value = mealName;

    chips?.classList.remove("show");

    if (title) {
      title.textContent =
        `Add ${mealName.toLowerCase()}`;
    }

    syncChipState();
  }

  function prepareQuickAdd() {
    const modal =
      document.getElementById(
        "fuelV571Modal"
      );

    const chips =
      document.getElementById(
        CHIPS_ID
      );

    const title =
      modal?.querySelector(
        ".fuel-v571-sheet h2"
      );

    if (!modal) return;

    chips?.classList.add("show");

    if (title) {
      title.textContent =
        "Add meal";
    }

    syncChipState();
  }

  function simplifyLabels() {
    const quick =
      document.querySelector(
        "#fuelV57Dashboard .fuel-v57-primary"
      );

    if (quick) {
      quick.textContent =
        "+ Add meal";
    }

    document
      .querySelectorAll(
        "#fuelV57Dashboard .fuel-v57-meal .fuel-v57-btn"
      )
      .forEach(button => {
        button.textContent = "+";
        button.setAttribute(
          "aria-label",
          "Add meal item"
        );

        button.style.minWidth =
          "44px";

        button.style.fontSize =
          "20px";

        button.style.lineHeight =
          "1";
      });
  }

  function init() {
    injectStyles();

    setTimeout(() => {
      ensureChips();
      simplifyLabels();
    }, 300);

    setTimeout(() => {
      ensureChips();
      simplifyLabels();
    }, 1000);
  }

  document.addEventListener(
    "click",
    event => {

      const rowButton =
        event.target.closest(
          "#fuelV57Dashboard .fuel-v57-meal .fuel-v57-btn"
        );

      if (rowButton) {
        const mealName =
          rowButton
            .closest(
              ".fuel-v57-meal"
            )
            ?.querySelector(
              ".fuel-v57-meal-name"
            )
            ?.textContent
            ?.trim();

        if (mealName) {
          setTimeout(() => {
            ensureChips();
            prepareDirectMeal(
              mealName
            );
          }, 0);
        }

        return;
      }

      if (
        event.target.closest(
          "#fuelV57Dashboard .fuel-v57-primary"
        )
      ) {
        setTimeout(() => {
          ensureChips();
          prepareQuickAdd();
        }, 0);
      }
    }
  );

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }
})();
