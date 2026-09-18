/* =========================================
   MANA MOVEMENT TRAINING v9.3
   MANA FUEL — MEAL SELECTION

   3 PRESET OPTIONS PER MEAL
   PRE-CALCULATED CALORIES + PROTEIN
   LOGS INTO EXISTING FUEL STORE
   ========================================= */

(() => {
  "use strict";


  const PROFILE_KEY =
    "mana-profile-v67";

  const FUEL_KEY =
    "mana-fuel-v571";

  const MODAL_ID =
    "manaV93MealModal";

  const STYLE_ID =
    "mana-v93-meals-style";


  /* =========================================
     MEAL LIBRARY
     ========================================= */

  const MEALS = {

    Breakfast: [

      {
        name:
          "Eggs, sourdough & spinach",

        description:
          "3 eggs, 2 slices sourdough and spinach",

        calories:430,

        protein:28
      },


      {
        name:
          "Protein oats",

        description:
          "Oats, Greek yoghurt, banana and milk",

        calories:500,

        protein:32
      },


      {
        name:
          "Greek yoghurt bowl",

        description:
          "Greek yoghurt, oats, berries and banana",

        calories:390,

        protein:30
      }

    ],


    Lunch: [

      {
        name:
          "Chicken rice bowl",

        description:
          "Chicken breast, rice and vegetables",

        calories:560,

        protein:46
      },


      {
        name:
          "Chicken wrap",

        description:
          "Chicken, wholegrain wrap, salad and light dressing",

        calories:480,

        protein:40
      },


      {
        name:
          "Tuna rice bowl",

        description:
          "Tuna, rice and mixed vegetables",

        calories:510,

        protein:38
      }

    ],


    Dinner: [

      {
        name:
          "Chicken, sweet potato & broccoli",

        description:
          "Chicken breast, sweet potato and broccoli",

        calories:590,

        protein:52
      },


      {
        name:
          "Lean mince, rice & vegetables",

        description:
          "Lean beef mince, rice and mixed vegetables",

        calories:620,

        protein:45
      },


      {
        name:
          "Salmon, potatoes & greens",

        description:
          "Salmon, potatoes and green vegetables",

        calories:640,

        protein:42
      }

    ],


    Snacks: [

      {
        name:
          "Greek yoghurt & fruit",

        description:
          "High-protein Greek yoghurt with fruit",

        calories:250,

        protein:20
      },


      {
        name:
          "Protein shake & banana",

        description:
          "Protein shake with one banana",

        calories:280,

        protein:28
      },


      {
        name:
          "Eggs & toast",

        description:
          "2 eggs with one slice of toast",

        calories:300,

        protein:19
      }

    ]

  };


  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(
    raw,
    fallback
  ) {

    try {

      return JSON.parse(
        raw
      );

    } catch (_) {

      return fallback;
    }
  }


  function todayKey() {

    const date =
      new Date();


    return [

      date.getFullYear(),

      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      ),

      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      )

    ].join("-");
  }


  function loadProfile() {

    return safeJson(
      localStorage.getItem(
        PROFILE_KEY
      ) || "{}",
      {}
    );
  }


  function loadStore() {

    return safeJson(
      localStorage.getItem(
        FUEL_KEY
      ) || "{}",
      {}
    );
  }


  function loadToday() {

    const store =
      loadStore();


    return (
      store[
        todayKey()
      ] ||
      {
        meals:{
          Breakfast:[],
          Lunch:[],
          Dinner:[],
          Snacks:[]
        },

        water:0
      }
    );
  }


  function saveToday(
    day
  ) {

    const store =
      loadStore();


    store[
      todayKey()
    ] =
      day;


    localStorage.setItem(
      FUEL_KEY,
      JSON.stringify(
        store
      )
    );
  }


  /* =========================================
     STYLES
     ========================================= */

  function injectStyles() {

    if (
      document.getElementById(
        STYLE_ID
      )
    ) {
      return;
    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      #${MODAL_ID}{
        position:fixed;
        inset:0;
        z-index:31000;

        display:none;

        align-items:flex-end;

        background:
          rgba(
            0,
            0,
            0,
            .86
          );
      }


      #${MODAL_ID}.open{
        display:flex;
      }


      .mana-v93-sheet{
        width:100%;

        max-height:
          90dvh;

        overflow:auto;

        padding:
          22px
          18px
          calc(
            28px +
            env(
              safe-area-inset-bottom
            )
          );

        border:
          1px solid
          #363636;

        border-radius:
          28px
          28px
          0
          0;

        background:#0d0d0d;
      }


      .mana-v93-inner{
        width:min(
          520px,
          100%
        );

        margin:auto;
      }


      .mana-v93-top{
        display:flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:14px;
      }


      .mana-v93-kicker{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.14em;
      }


      .mana-v93-title{
        margin:
          5px
          0
          4px;

        font-size:27px;
      }


      .mana-v93-sub{
        color:#888;

        font-size:12px;

        line-height:1.45;
      }


      .mana-v93-close{
        width:42px;
        height:42px;

        flex:
          0
          0
          42px;

        border-radius:50%;

        border:
          1px solid
          #333;

        background:#111;

        color:#fff;

        font-size:22px;
      }


      .mana-v93-goal{
        margin:
          16px
          0;

        padding:
          12px
          14px;

        border:
          1px solid
          #4a3e18;

        border-radius:14px;

        background:#15130b;

        color:#aaa;

        font-size:12px;
      }


      .mana-v93-goal strong{
        color:#f3d875;
      }


      .mana-v93-options{
        display:grid;

        gap:10px;

        margin-top:14px;
      }


      .mana-v93-option{
        width:100%;

        padding:16px;

        text-align:left;

        border:
          1px solid
          #343434;

        border-radius:18px;

        background:
          linear-gradient(
            145deg,
            #141414,
            #0a0a0a
          );

        color:#fff;
      }


      .mana-v93-option:active{
        border-color:#7a6726;

        background:#17150d;
      }


      .mana-v93-option-name{
        color:#fff;

        font-size:16px;

        font-weight:900;
      }


      .mana-v93-option-desc{
        margin-top:5px;

        color:#888;

        font-size:12px;

        line-height:1.4;
      }


      .mana-v93-macros{
        display:flex;

        gap:8px;

        flex-wrap:wrap;

        margin-top:11px;
      }


      .mana-v93-chip{
        padding:
          6px
          9px;

        border:
          1px solid
          #4b411f;

        border-radius:999px;

        color:#f3d875;

        font-size:11px;

        font-weight:900;
      }


      .mana-v93-footer{
        margin-top:15px;

        color:#707070;

        font-size:10px;

        line-height:1.45;
      }


      .mana-v93-confirm{
        margin-top:12px;

        padding:12px;

        text-align:center;

        border:
          1px solid
          #37513c;

        border-radius:14px;

        background:#0d1710;

        color:#8ed49a;

        font-size:12px;

        font-weight:800;
      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     MODAL
     ========================================= */

  function ensureModal() {

    if (
      document.getElementById(
        MODAL_ID
      )
    ) {
      return;
    }


    const modal =
      document.createElement(
        "div"
      );


    modal.id =
      MODAL_ID;


    modal.innerHTML = `

      <div
        class="mana-v93-sheet"
      >

        <div
          class="mana-v93-inner"
        >

          <div
            class="mana-v93-top"
          >

            <div>

              <div
                class="mana-v93-kicker"
              >
                MANA FUEL
              </div>

              <h2
                class="mana-v93-title"
                id="manaV93Title"
              >
                Meal
              </h2>

              <div
                class="mana-v93-sub"
              >
                Choose one option to add
                it to today's Fuel total.
              </div>

            </div>


            <button
              type="button"
              class="mana-v93-close"
              id="manaV93Close"
            >
              ×
            </button>

          </div>


          <div
            class="mana-v93-goal"
            id="manaV93Goal"
          ></div>


          <div
            class="mana-v93-options"
            id="manaV93Options"
          ></div>


          <div
            id="manaV93Confirmation"
          ></div>


          <div
            class="mana-v93-footer"
          >
            Calories and protein are practical
            estimates based on the listed serving.
            Actual values vary by brand, portion
            and preparation.
          </div>

        </div>

      </div>

    `;


    document.body.appendChild(
      modal
    );


    document
      .getElementById(
        "manaV93Close"
      )
      .onclick =
        closeModal;


    modal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          modal
        ) {

          closeModal();
        }

      }
    );
  }


  function closeModal() {

    document
      .getElementById(
        MODAL_ID
      )
      ?.classList
      .remove(
        "open"
      );
  }


  function openMealOptions(
    meal
  ) {

    ensureModal();


    const profile =
      loadProfile();


    const goal =
      profile.fuelGoal ||
      "Maintenance";


    const title =
      document.getElementById(
        "manaV93Title"
      );


    const goalHolder =
      document.getElementById(
        "manaV93Goal"
      );


    const optionsHolder =
      document.getElementById(
        "manaV93Options"
      );


    const confirmation =
      document.getElementById(
        "manaV93Confirmation"
      );


    if (title) {

      title.textContent =
        meal;
    }


    if (goalHolder) {

      goalHolder.innerHTML = `
        Fuel goal:
        <strong>
          ${goal}
        </strong>
      `;
    }


    if (confirmation) {

      confirmation.innerHTML =
        "";
    }


    const options =
      MEALS[
        meal
      ] || [];


    if (optionsHolder) {

      optionsHolder.innerHTML =
        options
          .map(
            (item, index) => `

              <button
                type="button"
                class="mana-v93-option"
                data-v93-meal="${meal}"
                data-v93-index="${index}"
              >

                <div
                  class="mana-v93-option-name"
                >
                  ${item.name}
                </div>


                <div
                  class="mana-v93-option-desc"
                >
                  ${item.description}
                </div>


                <div
                  class="mana-v93-macros"
                >

                  <span
                    class="mana-v93-chip"
                  >
                    ${item.calories} CAL
                  </span>

                  <span
                    class="mana-v93-chip"
                  >
                    ${item.protein}G PROTEIN
                  </span>

                </div>

              </button>

            `
          )
          .join("");
    }


    document
      .getElementById(
        MODAL_ID
      )
      .classList
      .add(
        "open"
      );
  }


  /* =========================================
     LOG SELECTED MEAL
     ========================================= */

  function logMeal(
    meal,
    index
  ) {

    const item =
      MEALS[
        meal
      ]?.[
        index
      ];


    if (!item) return;


    const day =
      loadToday();


    if (
      !day.meals
    ) {

      day.meals = {
        Breakfast:[],
        Lunch:[],
        Dinner:[],
        Snacks:[]
      };
    }


    if (
      !Array.isArray(
        day.meals[
          meal
        ]
      )
    ) {

      day.meals[
        meal
      ] = [];
    }


    day.meals[
      meal
    ].push({

      food:
        item.name,

      calories:
        item.calories,

      protein:
        item.protein,

      source:
        "mana-preset",

      created_at:
        new Date()
          .toISOString()

    });


    saveToday(
      day
    );


    const confirmation =
      document.getElementById(
        "manaV93Confirmation"
      );


    if (confirmation) {

      confirmation.innerHTML = `

        <div
          class="mana-v93-confirm"
        >
          ${item.name} added ✓
        </div>

      `;
    }


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
      500
    );
  }


  /* =========================================
     MAIN CLICK HANDLER
     ========================================= */

  function wireClicks() {

    document.addEventListener(
      "click",
      event => {

        /*
          BUILD TARGETS FROM PROFILE

          This runs in capture mode so
          it beats the older v8.9 handler.
        */

        const profileButton =
          event.target.closest(
            "#manaV89BuildTargets"
          );


        if (profileButton) {

          event.preventDefault();

          event.stopPropagation();

          event.stopImmediatePropagation();


          if (
            typeof
              window
                .openManaProfile ===
            "function"
          ) {

            window
              .openManaProfile();
          }


          return;
        }


        /*
          BREAKFAST / LUNCH /
          DINNER / SNACKS
        */

        const mealButton =
          event.target.closest(
            "[data-mana-meal]"
          );


        if (mealButton) {

          event.preventDefault();

          event.stopPropagation();

          event.stopImmediatePropagation();


          openMealOptions(
            mealButton.dataset
              .manaMeal
          );


          return;
        }


        /*
          SELECT PRESET MEAL
        */

        const option =
          event.target.closest(
            "[data-v93-meal]"
          );


        if (option) {

          event.preventDefault();

          event.stopPropagation();


          logMeal(
            option.dataset
              .v93Meal,

            Number(
              option.dataset
                .v93Index
            )
          );

        }

      },
      true
    );
  }


  /* =========================================
     INIT
     ========================================= */

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
