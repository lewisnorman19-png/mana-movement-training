/* =========================================
   MANA MOVEMENT TRAINING v8.9.3
   MANA STRENGTH — FUEL

   ONE COMPLETE FUEL SCREEN
   DAILY PROGRESS
   MEAL SELECTION
   WATER TRACKING
   DAILY FOUNDATIONS
   ========================================= */

(() => {
  "use strict";


  const SHELL_ID =
    "manaV83ProgramShell";

  const CONTENT_ID =
    "manaV83Content";

  const PROFILE_KEY =
    "mana-profile-v67";

  const TARGET_KEY =
    "mana-fuel-v58-targets";

  const FUEL_KEY =
    "mana-fuel-v571";

  const STYLE_ID =
    "mana-v893-strength-fuel-style";

  const MODAL_ID =
    "manaV89FuelTargets";


  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(
    raw,
    fallback
  ) {
    try {
      return JSON.parse(raw);
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


  function loadTargets() {
    const saved =
      safeJson(
        localStorage.getItem(
          TARGET_KEY
        ) || "{}",
        {}
      );


    return {
      calories:
        Number(
          saved.calories ||
          0
        ),

      protein:
        Number(
          saved.protein ||
          0
        ),

      water:
        Number(
          saved.water ||
          0
        ),

      carbs:
        Number(
          saved.carbs ||
          0
        ),

      fat:
        Number(
          saved.fat ||
          0
        )
    };
  }


  function saveTargets(
    targets
  ) {
    localStorage.setItem(
      TARGET_KEY,
      JSON.stringify(
        targets
      )
    );
  }


  function loadFuelStore() {
    return safeJson(
      localStorage.getItem(
        FUEL_KEY
      ) || "{}",
      {}
    );
  }


  function loadToday() {
    const store =
      loadFuelStore();


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
      loadFuelStore();


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


  function todayTotals() {
    const day =
      loadToday();


    const totals = {
      calories:0,
      protein:0,
      water:
        Number(
          day.water ||
          0
        )
    };


    Object.values(
      day.meals ||
      {}
    ).forEach(
      items => {

        (
          items ||
          []
        ).forEach(
          item => {

            totals.calories +=
              Number(
                item.calories ||
                0
              );


            totals.protein +=
              Number(
                item.protein ||
                0
              );

          }
        );

      }
    );


    return totals;
  }


  function pct(
    current,
    target
  ) {
    if (!target) {
      return 0;
    }


    return Math.max(
      0,

      Math.min(
        100,

        Math.round(
          current /
          target *
          100
        )
      )
    );
  }


  function shellIsStrength() {
    const shell =
      document.getElementById(
        SHELL_ID
      );


    const title =
      document.getElementById(
        "manaV83Title"
      );


    return Boolean(
      shell
        ?.classList
        .contains(
          "open"
        ) &&

      title
        ?.textContent
        .trim()
        .toUpperCase() ===
        "MANA STRENGTH"
    );
  }


  function activeTab() {
    return (
      document
        .querySelector(
          "#manaV83Tabs " +
          ".mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab ||
      ""
    );
  }


  /* =========================================
     TARGET CALCULATION
     ========================================= */

  function calculateTargets() {
    const profile =
      loadProfile();


    const weight =
      Number(
        profile.weight ||
        0
      );


    if (!weight) {
      return null;
    }


    let caloriesPerKg =
      30;


    let proteinPerKg =
      1.6;


    switch (
      profile.goal
    ) {

      case "Build muscle":

        caloriesPerKg =
          33;

        proteinPerKg =
          1.8;

        break;


      case "Get stronger":

        caloriesPerKg =
          31;

        proteinPerKg =
          1.8;

        break;


      case "General fitness":

        caloriesPerKg =
          30;

        proteinPerKg =
          1.6;

        break;


      case "Return to training":

        caloriesPerKg =
          30;

        proteinPerKg =
          1.6;

        break;
    }


    return {
      calories:
        Math.round(
          weight *
          caloriesPerKg /
          50
        ) * 50,

      protein:
        Math.round(
          weight *
          proteinPerKg
        ),

      water:
        Math.round(
          weight *
          35 /
          100
        ) * 100,

      carbs:0,
      fat:0
    };
  }


  /* =========================================
     STYLES
     ========================================= */

  function injectStyles() {
    if (
      document.getElementById(
        STYLE_ID
      )
    ) return;


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      .mana-v893-hero{
        padding:18px;

        margin-bottom:12px;

        border-radius:22px;

        border:
          1px solid
          #4a3d12;

        background:
          linear-gradient(
            145deg,
            #17150d,
            #0b0b0b
          );
      }


      .mana-v893-kicker{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.14em;
      }


      .mana-v893-hero h2{
        margin:
          7px
          0
          5px;

        font-size:25px;
      }


      .mana-v893-hero p{
        margin:0;

        color:#999;

        font-size:12px;

        line-height:1.5;
      }


      /* ==========================
         PROGRESS
         ========================== */

      .mana-v893-progress{
        padding:18px;

        margin:
          12px
          0;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .25
          );

        border-radius:22px;

        background:
          linear-gradient(
            145deg,
            #15130c,
            #0a0a0a
          );
      }


      .mana-v893-head{
        display:flex;

        justify-content:
          space-between;

        align-items:center;

        gap:12px;

        margin-bottom:15px;
      }


      .mana-v893-head h3{
        margin:0;

        font-size:20px;
      }


      .mana-v893-edit{
        min-height:40px;

        padding:
          0
          13px;

        border-radius:999px;

        border:
          1px solid
          #5d5124;

        background:#15130b;

        color:#f3d875;

        font-size:12px;

        font-weight:900;
      }


      .mana-v893-grid{
        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:10px;
      }


      .mana-v893-stat{
        padding:14px;

        border:
          1px solid
          #292929;

        border-radius:16px;

        background:#090909;
      }


      .mana-v893-stat.wide{
        grid-column:
          1 / -1;
      }


      .mana-v893-label{
        color:#999;

        font-size:11px;

        margin-bottom:6px;
      }


      .mana-v893-value{
        color:#f3d875;

        font-size:20px;

        font-weight:900;
      }


      .mana-v893-track{
        height:6px;

        margin-top:10px;

        overflow:hidden;

        border-radius:999px;

        background:#242424;
      }


      .mana-v893-fill{
        height:100%;

        border-radius:999px;

        background:#f3d875;
      }


      /* ==========================
         WATER
         ========================== */

      .mana-v893-water{
        margin-top:14px;

        padding-top:14px;

        border-top:
          1px solid
          #292929;
      }


      .mana-v893-water-label{
        margin-bottom:8px;

        color:#aaa;

        font-size:12px;

        font-weight:800;
      }


      .mana-v893-water-grid{
        display:grid;

        grid-template-columns:
          repeat(
            3,
            1fr
          );

        gap:8px;
      }


      .mana-v893-water-btn{
        min-height:46px;

        border-radius:13px;

        border:
          1px solid
          #343434;

        background:#111;

        color:#f3d875;

        font-size:13px;

        font-weight:900;
      }


      /* ==========================
         MEAL SELECTION
         ========================== */

      .mana-v893-meals{
        padding:18px;

        margin:
          12px
          0;

        border:
          1px solid
          #292929;

        border-radius:20px;

        background:#0d0d0d;
      }


      .mana-v893-meals h3{
        margin:
          0
          0
          5px;

        font-size:20px;
      }


      .mana-v893-sub{
        margin-bottom:14px;

        color:#888;

        font-size:12px;

        line-height:1.45;
      }


      .mana-v893-meal-grid{
        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:9px;
      }


      .mana-v893-meal{
        min-height:74px;

        padding:12px;

        text-align:left;

        border:
          1px solid
          #413819;

        border-radius:15px;

        background:#111;

        color:#fff;
      }


      .mana-v893-meal strong{
        display:block;

        color:#f3d875;

        font-size:15px;
      }


      .mana-v893-meal span{
        display:block;

        margin-top:5px;

        color:#888;

        font-size:11px;
      }


      /* ==========================
         ACTIONS
         ========================== */

      .mana-v893-secondary{
        width:100%;

        min-height:50px;

        margin-top:8px;

        border-radius:15px;

        border:
          1px solid
          #383838;

        background:#111;

        color:#f3d875;

        font-size:14px;

        font-weight:900;
      }


      /* ==========================
         FOUNDATIONS
         ========================== */

      .mana-v893-foundations{
        padding:18px;

        margin:
          18px
          0
          8px;

        border:
          1px solid
          #292929;

        border-radius:20px;

        background:#0d0d0d;
      }


      .mana-v893-foundations h3{
        margin:
          0
          0
          4px;

        font-size:19px;
      }


      .mana-v893-guide{
        padding:
          12px
          0;

        border-top:
          1px solid
          #262626;
      }


      .mana-v893-guide:first-of-type{
        border-top:0;
      }


      .mana-v893-guide strong{
        display:block;

        color:#eee;

        font-size:14px;
      }


      .mana-v893-guide span{
        display:block;

        margin-top:4px;

        color:#999;

        font-size:12px;

        line-height:1.45;
      }


      .mana-v893-note{
        margin-top:12px;

        color:#777;

        font-size:10px;

        line-height:1.45;
      }


      /* ==========================
         TARGET MODAL
         ========================== */

      #${MODAL_ID}{
        position:fixed;

        inset:0;

        z-index:29000;

        display:none;

        align-items:flex-end;

        background:
          rgba(
            0,
            0,
            0,
            .82
          );
      }


      #${MODAL_ID}.open{
        display:flex;
      }


      .mana-v893-sheet{
        width:100%;

        max-height:92dvh;

        overflow:auto;

        padding:
          24px
          20px
          calc(
            30px +
            env(
              safe-area-inset-bottom
            )
          );

        border:
          1px solid
          #333;

        border-radius:
          26px
          26px
          0
          0;

        background:#101010;
      }


      .mana-v893-sheet-inner{
        width:min(
          520px,
          100%
        );

        margin:auto;
      }


      .mana-v893-sheet h2{
        margin:
          0
          0
          16px;

        font-size:26px;
      }


      .mana-v893-field{
        margin-bottom:12px;
      }


      .mana-v893-field label{
        display:block;

        margin-bottom:5px;

        color:#aaa;

        font-size:12px;
      }


      .mana-v893-field input{
        width:100%;

        min-height:50px;

        margin:0 !important;

        padding:
          12px
          14px;

        border:
          1px solid
          #333;

        border-radius:13px;

        background:#080808;

        color:#fff;

        font-size:16px;
      }


      .mana-v893-save{
        width:100%;

        min-height:54px;

        border:0;

        border-radius:16px;

        background:#f3d875;

        color:#111;

        font-size:15px;

        font-weight:900;
      }


      @media(max-width:360px){

        .mana-v893-grid,
        .mana-v893-meal-grid{
          grid-template-columns:
            1fr;
        }


        .mana-v893-stat.wide{
          grid-column:auto;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     TARGET MODAL
     ========================================= */

  function ensureModal() {
    if (
      document.getElementById(
        MODAL_ID
      )
    ) return;


    const modal =
      document.createElement(
        "div"
      );


    modal.id =
      MODAL_ID;


    modal.innerHTML = `

      <div
        class="mana-v893-sheet"
      >

        <div
          class="mana-v893-sheet-inner"
        >

          <h2>
            Daily Fuel Targets
          </h2>


          <div
            class="mana-v893-field"
          >

            <label>
              Calories
            </label>

            <input
              type="number"
              id="manaV89Calories"
              min="0"
              inputmode="numeric"
            />

          </div>


          <div
            class="mana-v893-field"
          >

            <label>
              Protein grams
            </label>

            <input
              type="number"
              id="manaV89Protein"
              min="0"
              inputmode="numeric"
            />

          </div>


          <div
            class="mana-v893-field"
          >

            <label>
              Water ml
            </label>

            <input
              type="number"
              id="manaV89Water"
              min="0"
              step="100"
              inputmode="numeric"
            />

          </div>


          <button
            type="button"
            class="mana-v893-save"
            id="manaV89Save"
          >
            SAVE TARGETS
          </button>


          <button
            type="button"
            class="mana-v893-secondary"
            id="manaV89Cancel"
          >
            Cancel
          </button>

        </div>

      </div>

    `;


    document.body.appendChild(
      modal
    );


    document
      .getElementById(
        "manaV89Save"
      )
      .onclick =
        saveManualTargets;


    document
      .getElementById(
        "manaV89Cancel"
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


  function openModal() {
    ensureModal();


    const targets =
      loadTargets();


    document
      .getElementById(
        "manaV89Calories"
      )
      .value =
        targets.calories ||
        "";


    document
      .getElementById(
        "manaV89Protein"
      )
      .value =
        targets.protein ||
        "";


    document
      .getElementById(
        "manaV89Water"
      )
      .value =
        targets.water ||
        "";


    document
      .getElementById(
        MODAL_ID
      )
      .classList
      .add(
        "open"
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


  function saveManualTargets() {
    const current =
      loadTargets();


    saveTargets({
      calories:
        Math.max(
          0,
          Number(
            document
              .getElementById(
                "manaV89Calories"
              )
              .value ||
            0
          )
        ),

      protein:
        Math.max(
          0,
          Number(
            document
              .getElementById(
                "manaV89Protein"
              )
              .value ||
            0
          )
        ),

      water:
        Math.max(
          0,
          Number(
            document
              .getElementById(
                "manaV89Water"
              )
              .value ||
            0
          )
        ),

      carbs:
        current.carbs ||
        0,

      fat:
        current.fat ||
        0
    });


    closeModal();

    renderFuel();
  }


  /* =========================================
     MEALS
     ========================================= */

  function openMeal(
    meal
  ) {
    const modal =
      document.getElementById(
        "fuelV571Modal"
      );


    const select =
      document.getElementById(
        "fuelV571Meal"
      );


    const title =
      modal
        ?.querySelector(
          ".fuel-v571-sheet h2"
        );


    if (
      !modal ||
      !select
    ) {
      return;
    }


    select.value =
      meal;


    if (title) {
      title.textContent =
        `Add ${meal.toLowerCase()}`;
    }


    modal.classList.add(
      "open"
    );


    setTimeout(
      () => {

        document
          .getElementById(
            "fuelV571Food"
          )
          ?.focus();

      },
      100
    );
  }


  /* =========================================
     WATER
     ========================================= */

  function addWater(
    amount
  ) {
    const day =
      loadToday();


    day.water =
      Number(
        day.water ||
        0
      ) +
      amount;


    saveToday(
      day
    );


    renderFuel();
  }


  /* =========================================
     RENDER
     ========================================= */

  function renderFuel() {
    if (
      !shellIsStrength()
    ) return;


    if (
      activeTab() !==
      "fuel"
    ) return;


    const holder =
      document.getElementById(
        CONTENT_ID
      );


    if (!holder) return;


    const targets =
      loadTargets();


    const totals =
      todayTotals();


    const proteinPerMeal =
      targets.protein
        ? Math.round(
            targets.protein /
            4
          )
        : 0;


    const hasTargets =
      targets.calories > 0 ||
      targets.protein > 0 ||
      targets.water > 0;


    holder.innerHTML = `

      <div
        class="mana-v893-hero"
      >

        <div
          class="mana-v893-kicker"
        >
          MANA FUEL
        </div>

        <h2>
          Fuel your training.
        </h2>

        <p>
          Keep it simple:
          enough energy,
          consistent protein,
          hydration and food
          you can repeat.
        </p>

      </div>


      <div
        class="mana-v893-progress"
      >

        <div
          class="mana-v893-head"
        >

          <h3>
            Daily Progress
          </h3>

          <button
            type="button"
            class="mana-v893-edit"
            id="manaV89EditTargets"
          >
            Edit targets
          </button>

        </div>


        ${
          hasTargets
            ? `

              <div
                class="mana-v893-grid"
              >

                <div
                  class="mana-v893-stat"
                >

                  <div
                    class="mana-v893-label"
                  >
                    Calories
                  </div>

                  <div
                    class="mana-v893-value"
                  >
                    ${Math.round(
                      totals.calories
                    )}
                    /
                    ${targets.calories}
                  </div>

                  <div
                    class="mana-v893-track"
                  >
                    <div
                      class="mana-v893-fill"
                      style="
                        width:
                        ${pct(
                          totals.calories,
                          targets.calories
                        )}%
                      "
                    ></div>
                  </div>

                </div>


                <div
                  class="mana-v893-stat"
                >

                  <div
                    class="mana-v893-label"
                  >
                    Protein
                  </div>

                  <div
                    class="mana-v893-value"
                  >
                    ${Math.round(
                      totals.protein
                    )}
                    /
                    ${targets.protein}g
                  </div>

                  <div
                    class="mana-v893-track"
                  >
                    <div
                      class="mana-v893-fill"
                      style="
                        width:
                        ${pct(
                          totals.protein,
                          targets.protein
                        )}%
                      "
                    ></div>
                  </div>

                </div>


                <div
                  class="mana-v893-stat wide"
                >

                  <div
                    class="mana-v893-label"
                  >
                    Water
                  </div>

                  <div
                    class="mana-v893-value"
                  >
                    ${Math.round(
                      totals.water
                    )}
                    /
                    ${targets.water}ml
                  </div>

                  <div
                    class="mana-v893-track"
                  >
                    <div
                      class="mana-v893-fill"
                      style="
                        width:
                        ${pct(
                          totals.water,
                          targets.water
                        )}%
                      "
                    ></div>
                  </div>

                </div>

              </div>

            `
            : `

              <div
                class="mana-v893-sub"
              >
                Build your starting targets
                from your Mana Profile.
              </div>

            `
        }


        <div
          class="mana-v893-water"
        >

          <div
            class="mana-v893-water-label"
          >
            Quick add water
          </div>

          <div
            class="mana-v893-water-grid"
          >

            <button
              type="button"
              class="mana-v893-water-btn"
              data-mana-water="250"
            >
              +250ml
            </button>

            <button
              type="button"
              class="mana-v893-water-btn"
              data-mana-water="500"
            >
              +500ml
            </button>

            <button
              type="button"
              class="mana-v893-water-btn"
              data-mana-water="750"
            >
              +750ml
            </button>

          </div>

        </div>

      </div>


      <div
        class="mana-v893-meals"
      >

        <h3>
          Meal Selection
        </h3>

        <div
          class="mana-v893-sub"
        >
          Choose a meal and add your food.
        </div>


        <div
          class="mana-v893-meal-grid"
        >

          <button
            type="button"
            class="mana-v893-meal"
            data-mana-meal="Breakfast"
          >
            <strong>
              Breakfast
            </strong>

            <span>
              Tap to add food
            </span>
          </button>


          <button
            type="button"
            class="mana-v893-meal"
            data-mana-meal="Lunch"
          >
            <strong>
              Lunch
            </strong>

            <span>
              Tap to add food
            </span>
          </button>


          <button
            type="button"
            class="mana-v893-meal"
            data-mana-meal="Dinner"
          >
            <strong>
              Dinner
            </strong>

            <span>
              Tap to add food
            </span>
          </button>


          <button
            type="button"
            class="mana-v893-meal"
            data-mana-meal="Snacks"
          >
            <strong>
              Snacks
            </strong>

            <span>
              Tap to add food
            </span>
          </button>

        </div>

      </div>


      <button
        type="button"
        class="mana-v893-secondary"
        id="manaV89BuildTargets"
      >
        BUILD TARGETS FROM PROFILE
      </button>


      <div
        class="mana-v893-foundations"
      >

        <h3>
          Daily Foundations
        </h3>

        <div
          class="mana-v893-sub"
        >
          Keep the basics consistent.
        </div>


        <div
          class="mana-v893-guide"
        >

          <strong>
            Protein across the day
          </strong>

          <span>
            ${
              proteinPerMeal
                ? `Aim for roughly ${proteinPerMeal}g across four meals or snacks.`
                : "Build each main meal around a quality protein source."
            }
          </span>

        </div>


        <div
          class="mana-v893-guide"
        >

          <strong>
            Fuel around training
          </strong>

          <span>
            Include carbohydrate and
            protein around training
            when practical.
          </span>

        </div>


        <div
          class="mana-v893-guide"
        >

          <strong>
            Hydrate consistently
          </strong>

          <span>
            Spread water through the day
            instead of trying to catch up
            late.
          </span>

        </div>


        <div
          class="mana-v893-guide"
        >

          <strong>
            Keep meals repeatable
          </strong>

          <span>
            Simple meals you can sustain
            consistently matter more than
            perfect eating.
          </span>

        </div>

      </div>


      <div
        class="mana-v893-note"
      >
        Mana Fuel targets are a practical
        starting estimate and can be adjusted
        to suit the individual.
      </div>

    `;


    /* ==========================
       BUTTONS
       ========================== */

    holder
      .querySelectorAll(
        "[data-mana-meal]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              openMeal(
                button.dataset.manaMeal
              );

            }
          );

        }
      );


    holder
      .querySelectorAll(
        "[data-mana-water]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              addWater(
                Number(
                  button.dataset.manaWater
                ) || 0
              );

            }
          );

        }
      );


    document
      .getElementById(
        "manaV89EditTargets"
      )
      ?.addEventListener(
        "click",
        openModal
      );


    document
      .getElementById(
        "manaV89BuildTargets"
      )
      ?.addEventListener(
        "click",
        () => {

          const calculated =
            calculateTargets();


          if (!calculated) {

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


          saveTargets(
            calculated
          );


          renderFuel();

        }
      );
  }


  /* =========================================
     WIRING
     ========================================= */

  function scheduleRender() {
    setTimeout(
      renderFuel,
      100
    );
  }


  function wire() {
    document.addEventListener(
      "click",
      event => {

        /*
          Fuel tab opened.
        */

        if (
          event.target.closest(
            '#manaV83Tabs ' +
            '[data-v83-tab="fuel"]'
          )
        ) {

          scheduleRender();
        }


        /*
          Existing meal logger saved.
          Refresh Strength Fuel afterward.
        */

        if (
          event.target.closest(
            "#fuelV571Save"
          )
        ) {

          setTimeout(
            renderFuel,
            150
          );
        }

      }
    );


    window.addEventListener(
      "mana:program-tab-change",
      scheduleRender
    );


    window.addEventListener(
      "mana:profile-synced",
      scheduleRender
    );


    window.addEventListener(
      "focus",
      scheduleRender
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {
    injectStyles();

    ensureModal();

    wire();


    setTimeout(
      renderFuel,
      1200
    );
  }


  window.renderManaStrengthFuel =
    renderFuel;


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
