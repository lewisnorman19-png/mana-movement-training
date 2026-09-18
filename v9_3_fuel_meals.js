/* =========================================
   MANA MOVEMENT TRAINING v9.3.2
   FUEL MEALS

   3 PRESET OPTIONS
   ADD / CHANGE / REMOVE SUPPORT
   ========================================= */

(() => {
  "use strict";

  const PROFILE_KEY = "mana-profile-v67";
  const FUEL_KEY = "mana-fuel-v571";
  const MODAL_ID = "manaV93MealModal";
  const STYLE_ID = "mana-v932-meals-style";

  let editMeal = null;
  let editIndex = null;

  const MEALS = {
    Breakfast: [
      {
        name: "Eggs, sourdough & spinach",
        description: "3 eggs, 2 slices sourdough and spinach",
        calories: 430,
        protein: 28
      },
      {
        name: "Protein oats",
        description: "Oats, Greek yoghurt, banana and milk",
        calories: 500,
        protein: 32
      },
      {
        name: "Greek yoghurt bowl",
        description: "Greek yoghurt, oats, berries and banana",
        calories: 390,
        protein: 30
      }
    ],

    Lunch: [
      {
        name: "Chicken rice bowl",
        description: "Chicken breast, rice and vegetables",
        calories: 560,
        protein: 46
      },
      {
        name: "Chicken wrap",
        description: "Chicken, wholegrain wrap, salad and light dressing",
        calories: 480,
        protein: 40
      },
      {
        name: "Tuna rice bowl",
        description: "Tuna, rice and mixed vegetables",
        calories: 510,
        protein: 38
      }
    ],

    Dinner: [
      {
        name: "Chicken, sweet potato & broccoli",
        description: "Chicken breast, sweet potato and broccoli",
        calories: 590,
        protein: 52
      },
      {
        name: "Lean mince, rice & vegetables",
        description: "Lean beef mince, rice and mixed vegetables",
        calories: 620,
        protein: 45
      },
      {
        name: "Salmon, potatoes & greens",
        description: "Salmon, potatoes and green vegetables",
        calories: 640,
        protein: 42
      }
    ],

    Snacks: [
      {
        name: "Greek yoghurt & fruit",
        description: "High-protein Greek yoghurt with fruit",
        calories: 250,
        protein: 20
      },
      {
        name: "Protein shake & banana",
        description: "Protein shake with one banana",
        calories: 280,
        protein: 28
      },
      {
        name: "Eggs & toast",
        description: "2 eggs with one slice of toast",
        calories: 300,
        protein: 19
      }
    ]
  };


  function safeJson(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }


  function todayKey() {
    const date = new Date();

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }


  function loadProfile() {
    return safeJson(
      localStorage.getItem(PROFILE_KEY) || "{}",
      {}
    );
  }


  function loadStore() {
    return safeJson(
      localStorage.getItem(FUEL_KEY) || "{}",
      {}
    );
  }


  function blankDay() {
    return {
      meals: {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snacks: []
      },
      water: 0
    };
  }


  function loadToday() {
    const store = loadStore();

    return (
      store[todayKey()] ||
      blankDay()
    );
  }


  function saveToday(day) {
    const store = loadStore();

    store[todayKey()] = day;

    localStorage.setItem(
      FUEL_KEY,
      JSON.stringify(store)
    );
  }


  function injectStyles() {
    if (
      document.getElementById(STYLE_ID)
    ) {
      return;
    }

    const style = document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `

      #${MODAL_ID}{
        position:fixed;
        inset:0;
        z-index:31000;
        display:none;
        align-items:flex-end;
        background:rgba(0,0,0,.86);
      }

      #${MODAL_ID}.open{
        display:flex;
      }

      .mana-v932-sheet{
        width:100%;
        max-height:90dvh;
        overflow:auto;
        padding:
          22px
          18px
          calc(28px + env(safe-area-inset-bottom));
        border:1px solid #363636;
        border-radius:28px 28px 0 0;
        background:#0d0d0d;
      }

      .mana-v932-inner{
        width:min(520px,100%);
        margin:auto;
      }

      .mana-v932-top{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:14px;
      }

      .mana-v932-kicker{
        color:#f3d875;
        font-size:10px;
        font-weight:900;
        letter-spacing:.14em;
      }

      .mana-v932-title{
        margin:5px 0 4px;
        font-size:27px;
      }

      .mana-v932-sub{
        color:#888;
        font-size:12px;
        line-height:1.45;
      }

      .mana-v932-close{
        width:42px;
        height:42px;
        flex:0 0 42px;
        border-radius:50%;
        border:1px solid #333;
        background:#111;
        color:#fff;
        font-size:22px;
      }

      .mana-v932-goal{
        margin:16px 0;
        padding:12px 14px;
        border:1px solid #4a3e18;
        border-radius:14px;
        background:#15130b;
        color:#aaa;
        font-size:12px;
      }

      .mana-v932-goal strong{
        color:#f3d875;
      }

      .mana-v932-options{
        display:grid;
        gap:10px;
      }

      .mana-v932-option{
        width:100%;
        padding:16px;
        text-align:left;
        border:1px solid #343434;
        border-radius:18px;
        background:
          linear-gradient(
            145deg,
            #141414,
            #0a0a0a
          );
        color:#fff;
        touch-action:manipulation;
      }

      .mana-v932-option:active{
        border-color:#7a6726;
        background:#17150d;
      }

      .mana-v932-name{
        color:#fff;
        font-size:16px;
        font-weight:900;
      }

      .mana-v932-desc{
        margin-top:5px;
        color:#888;
        font-size:12px;
        line-height:1.4;
      }

      .mana-v932-macros{
        display:flex;
        gap:8px;
        flex-wrap:wrap;
        margin-top:11px;
      }

      .mana-v932-chip{
        padding:6px 9px;
        border:1px solid #4b411f;
        border-radius:999px;
        color:#f3d875;
        font-size:11px;
        font-weight:900;
      }

      .mana-v932-confirm{
        margin-top:12px;
        padding:12px;
        text-align:center;
        border:1px solid #37513c;
        border-radius:14px;
        background:#0d1710;
        color:#8ed49a;
        font-size:12px;
        font-weight:800;
      }

      .mana-v932-footer{
        margin-top:15px;
        color:#707070;
        font-size:10px;
        line-height:1.45;
      }

    `;

    document.head.appendChild(style);
  }


  function ensureModal() {
    if (
      document.getElementById(MODAL_ID)
    ) {
      return;
    }

    const modal = document.createElement("div");

    modal.id = MODAL_ID;

    modal.innerHTML = `

      <div class="mana-v932-sheet">

        <div class="mana-v932-inner">

          <div class="mana-v932-top">

            <div>

              <div class="mana-v932-kicker">
                MANA FUEL
              </div>

              <h2
                class="mana-v932-title"
                id="manaV93Title"
              >
                Meal
              </h2>

              <div
                class="mana-v932-sub"
                id="manaV93Sub"
              >
                Choose an option.
              </div>

            </div>

            <button
              type="button"
              class="mana-v932-close"
              id="manaV93Close"
            >
              ×
            </button>

          </div>

          <div
            class="mana-v932-goal"
            id="manaV93Goal"
          ></div>

          <div
            class="mana-v932-options"
            id="manaV93Options"
          ></div>

          <div
            id="manaV93Confirmation"
          ></div>

          <div class="mana-v932-footer">
            Calories and protein are practical
            estimates based on the listed serving.
          </div>

        </div>

      </div>

    `;

    document.body.appendChild(modal);

    document
      .getElementById("manaV93Close")
      .onclick = closeModal;

    modal.addEventListener(
      "click",
      event => {

        if (
          event.target === modal
        ) {
          closeModal();
        }

      }
    );
  }


  function closeModal() {
    document
      .getElementById(MODAL_ID)
      ?.classList
      .remove("open");

    editMeal = null;
    editIndex = null;
  }


  function openMealOptions(
    meal,
    index = null
  ) {
    ensureModal();

    const profile = loadProfile();

    const goal =
      profile.fuelGoal ||
      "Maintenance";

    editMeal =
      index === null
        ? null
        : meal;

    editIndex =
      index === null
        ? null
        : Number(index);

    document
      .getElementById("manaV93Title")
      .textContent =
        meal;

    document
      .getElementById("manaV93Sub")
      .textContent =
        editMeal !== null
          ? "Choose a replacement for this meal."
          : "Choose one option to add to today.";

    document
      .getElementById("manaV93Goal")
      .innerHTML = `
        Fuel goal:
        <strong>
          ${goal}
        </strong>
      `;

    document
      .getElementById("manaV93Confirmation")
      .innerHTML = "";

    const holder =
      document.getElementById(
        "manaV93Options"
      );

    holder.innerHTML =
      (MEALS[meal] || [])
        .map(
          (item, optionIndex) => `

            <button
              type="button"
              class="mana-v932-option"
              data-v932-meal="${meal}"
              data-v932-index="${optionIndex}"
            >

              <div class="mana-v932-name">
                ${item.name}
              </div>

              <div class="mana-v932-desc">
                ${item.description}
              </div>

              <div class="mana-v932-macros">

                <span class="mana-v932-chip">
                  ${item.calories} CAL
                </span>

                <span class="mana-v932-chip">
                  ${item.protein}G PROTEIN
                </span>

              </div>

            </button>

          `
        )
        .join("");

    document
      .getElementById(MODAL_ID)
      .classList
      .add("open");
  }


  function selectMeal(
    meal,
    optionIndex
  ) {
    const item =
      MEALS[meal]?.[
        optionIndex
      ];

    if (!item) {
      return;
    }

    const day =
      loadToday();

    day.meals =
      day.meals ||
      blankDay().meals;

    day.meals[meal] =
      Array.isArray(
        day.meals[meal]
      )
        ? day.meals[meal]
        : [];

    const logged = {
      food: item.name,
      calories: item.calories,
      protein: item.protein,
      source: "mana-preset",
      created_at:
        new Date().toISOString()
    };

    const replacing =
      editMeal === meal &&
      Number.isInteger(editIndex) &&
      editIndex >= 0 &&
      editIndex <
        day.meals[meal].length;

    if (replacing) {

      day.meals[meal][
        editIndex
      ] = logged;

    } else {

      day.meals[meal].push(
        logged
      );

    }

    saveToday(day);

    document
      .getElementById(
        "manaV93Confirmation"
      )
      .innerHTML = `

        <div class="mana-v932-confirm">
          ${
            replacing
              ? "Meal changed"
              : "Meal added"
          } ✓
        </div>

      `;

    if (
      typeof
        window
          .renderManaStrengthFuel ===
      "function"
    ) {
      window
        .renderManaStrengthFuel();
    }

    setTimeout(
      closeModal,
      450
    );
  }


  function wireClicks() {
    document.addEventListener(
      "click",
      event => {

        const mealButton =
          event.target.closest(
            "[data-mana-meal]"
          );

        if (mealButton) {

          event.preventDefault();

          event.stopPropagation();

          openMealOptions(
            mealButton.dataset
              .manaMeal
          );

          return;
        }


        const changeButton =
          event.target.closest(
            "[data-mana-change-meal]"
          );

        if (changeButton) {

          event.preventDefault();

          event.stopPropagation();

          openMealOptions(
            changeButton.dataset
              .manaChangeMeal,

            Number(
              changeButton.dataset
                .manaChangeIndex
            )
          );

          return;
        }


        const option =
          event.target.closest(
            "[data-v932-meal]"
          );

        if (option) {

          event.preventDefault();

          event.stopPropagation();

          selectMeal(
            option.dataset
              .v932Meal,

            Number(
              option.dataset
                .v932Index
            )
          );

        }

      }
    );
  }


  function init() {
    injectStyles();

    ensureModal();

    wireClicks();
  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();
  }

})();
