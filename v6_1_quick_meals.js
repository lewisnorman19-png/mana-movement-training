/* =========================================
   MANA MOVEMENT TRAINING v6.1.1
   Visible quick meal controls
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID = "mana-v611-quick-meals-style";
  const PANEL_ID = "fuelV611QuickPanel";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      #${PANEL_ID}{
        margin:12px 0 16px;
        padding:16px;
        border-radius:20px;
        border:1px solid #2b2b2b;
        background:#101010;
      }

      .fuel-v611-title{
        font-size:20px;
        font-weight:800;
        margin-bottom:12px;
      }

      .fuel-v611-grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px;
      }

      .fuel-v611-btn{
        min-height:48px;
        border-radius:14px;
        border:1px solid #343434;
        background:#0b0b0b;
        color:#f5d86e;
        font-size:14px;
        font-weight:800;
      }

      .fuel-v611-btn:active{
        transform:scale(.98);
      }

      .fuel-v611-add{
        width:100%;
        min-height:50px;
        margin-top:10px;
        border:0;
        border-radius:15px;
        background:#f5d86e;
        color:#111;
        font-size:16px;
        font-weight:800;
      }

      @media(max-width:360px){
        .fuel-v611-grid{
          grid-template-columns:1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function findVisibleMealsHeading() {
    const candidates =
      [...document.querySelectorAll("h1,h2,h3,h4,div")];

    return candidates.find(el => {
      const text =
        (el.textContent || "").trim();

      return (
        text === "Today's meals" &&
        el.offsetParent !== null
      );
    });
  }

  function buildQuickPanel() {
    if (document.getElementById(PANEL_ID)) return;

    const heading =
      findVisibleMealsHeading();

    if (!heading) return;

    const panel =
      document.createElement("div");

    panel.id = PANEL_ID;

    panel.innerHTML = `
      <div class="fuel-v611-title">
        Quick add
      </div>

      <div class="fuel-v611-grid">
        <button
          type="button"
          class="fuel-v611-btn"
          data-v611-meal="Breakfast"
        >
          Breakfast
        </button>

        <button
          type="button"
          class="fuel-v611-btn"
          data-v611-meal="Lunch"
        >
          Lunch
        </button>

        <button
          type="button"
          class="fuel-v611-btn"
          data-v611-meal="Dinner"
        >
          Dinner
        </button>

        <button
          type="button"
          class="fuel-v611-btn"
          data-v611-meal="Snacks"
        >
          Snacks
        </button>
      </div>

      <button
        type="button"
        class="fuel-v611-add"
        id="fuelV611AddMeal"
      >
        + Add meal
      </button>
    `;

    heading.insertAdjacentElement(
      "afterend",
      panel
    );
  }

  function openExistingMealModal(mealName) {
    const select =
      document.getElementById(
        "fuelV571Meal"
      );

    const modal =
      document.getElementById(
        "fuelV571Modal"
      );

    if (!select || !modal) return;

    select.value =
      mealName || "Breakfast";

    const title =
      modal.querySelector(
        ".fuel-v571-sheet h2"
      );

    if (title) {
      title.textContent =
        mealName
          ? `Add ${mealName.toLowerCase()}`
          : "Add meal";
    }

    modal.classList.add("open");

    setTimeout(() => {
      document
        .getElementById(
          "fuelV571Food"
        )
        ?.focus();
    }, 100);
  }

  document.addEventListener(
    "click",
    event => {

      const mealButton =
        event.target.closest(
          "[data-v611-meal]"
        );

      if (mealButton) {
        openExistingMealModal(
          mealButton.dataset.v611Meal
        );
        return;
      }

      if (
        event.target.closest(
          "#fuelV611AddMeal"
        )
      ) {
        openExistingMealModal(
          "Breakfast"
        );
      }
    }
  );

  function init() {
    injectStyles();

    setTimeout(
      buildQuickPanel,
      300
    );

    setTimeout(
      buildQuickPanel,
      1000
    );
  }

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
