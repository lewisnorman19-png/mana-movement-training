/* =========================================
   MANA MOVEMENT TRAINING v8.9.6
   MANA STRENGTH — FUEL

   PROFILE TARGETS
   DAILY PROGRESS
   BALANCE LEFT
   MEAL SELECTION
   TODAY'S MEALS
   WATER TRACKING

   ALSO RECLAIMS FUEL SCREEN IF AN OLDER
   STRENGTH RENDERER TRIES TO REPLACE IT
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
    "mana-v896-strength-fuel-style";

  const MODAL_ID =
    "manaV89FuelTargets";


  let renderTimer =
    null;

  let rendering =
    false;


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


  function esc(
    value
  ) {
    return String(
      value ?? ""
    )
      .replaceAll(
        "&",
        "&amp;"
      )
      .replaceAll(
        "<",
        "&lt;"
      )
      .replaceAll(
        ">",
        "&gt;"
      )
      .replaceAll(
        '"',
        "&quot;"
      );
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
          saved.calories || 0
        ),

      protein:
        Number(
          saved.protein || 0
        ),

      water:
        Number(
          saved.water || 0
        ),

      carbs:
        Number(
          saved.carbs || 0
        ),

      fat:
        Number(
          saved.fat || 0
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


  function blankDay() {
    return {

      meals:{
        Breakfast:[],
        Lunch:[],
        Dinner:[],
        Snacks:[]
      },

      water:0

    };
  }


  function loadToday() {
    const store =
      loadFuelStore();


    return (
      store[
        todayKey()
      ] ||
      blankDay()
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
          day.water || 0
        )

    };


    Object.values(
      day.meals || {}
    ).forEach(
      items => {

        (
          items || []
        ).forEach(
          item => {

            totals.calories +=
              Number(
                item.calories || 0
              );


            totals.protein +=
              Number(
                item.protein || 0
              );

          }
        );

      }
    );


    return totals;
  }


  function mealInfo(
    meal
  ) {
    const day =
      loadToday();


    const items =
      Array.isArray(
        day.meals?.[meal]
      )
        ? day.meals[meal]
        : [];


    const totals =
      items.reduce(
        (
          result,
          item
        ) => {

          result.calories +=
            Number(
              item.calories || 0
            );


          result.protein +=
            Number(
              item.protein || 0
            );


          return result;

        },
        {
          calories:0,
          protein:0
        }
      );


    return {
      items,
      ...totals
    };
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


  function balance(
    target,
    current
  ) {
    return Math.max(
      0,
      Math.round(
        Number(target || 0) -
        Number(current || 0)
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
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab ||
      ""
    );
  }


  function fuelIsOpen() {
    return (
      shellIsStrength() &&
      activeTab() ===
        "fuel"
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

      .mana-v896-root{
        width:100%;
      }


      .mana-v896-build{
        width:100%;
        min-height:54px;

        margin:
          0
          0
          12px;

        border:
          1px solid
          #5d5124;

        border-radius:16px;

        background:
          linear-gradient(
            145deg,
            #17150d,
            #0d0d0d
          );

        color:#f3d875;

        font-size:14px;

        font-weight:900;

        cursor:pointer;

        touch-action:
          manipulation;
      }


      .mana-v896-card{
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


      .mana-v896-progress{
        border-color:
          rgba(
            243,
            216,
            117,
            .26
          );

        background:
          linear-gradient(
            145deg,
            #15130c,
            #0a0a0a
          );
      }


      .mana-v896-head{
        display:flex;

        align-items:center;

        justify-content:
          space-between;

        gap:12px;

        margin-bottom:12px;
      }


      .mana-v896-head h3{
        margin:0;

        font-size:20px;
      }


      .mana-v896-edit{
        min-height:38px;

        padding:
          0
          12px;

        border:
          1px solid
          #5d5124;

        border-radius:999px;

        background:#15130b;

        color:#f3d875;

        font-size:11px;

        font-weight:900;
      }


      .mana-v896-goal{
        margin-bottom:14px;

        color:#888;

        font-size:11px;
      }


      .mana-v896-goal strong{
        color:#f3d875;
      }


      .mana-v896-grid{
        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:10px;
      }


      .mana-v896-stat{
        padding:14px;

        border:
          1px solid
          #292929;

        border-radius:16px;

        background:#090909;
      }


      .mana-v896-stat.wide{
        grid-column:
          1 / -1;
      }


      .mana-v896-label{
        color:#999;

        font-size:11px;

        margin-bottom:6px;
      }


      .mana-v896-value{
        color:#f3d875;

        font-size:20px;

        font-weight:900;
      }


      .mana-v896-track{
        height:6px;

        margin-top:10px;

        overflow:hidden;

        border-radius:999px;

        background:#242424;
      }


      .mana-v896-fill{
        height:100%;

        border-radius:999px;

        background:#f3d875;
      }


      .mana-v896-balance{
        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:10px;
      }


      .mana-v896-balance-box{
        padding:15px;

        border:
          1px solid
          #463d1d;

        border-radius:16px;

        background:#15130b;
      }


      .mana-v896-balance-box span{
        display:block;

        color:#888;

        font-size:11px;
      }


      .mana-v896-balance-box strong{
        display:block;

        margin-top:5px;

        color:#f3d875;

        font-size:22px;
      }


      .mana-v896-water{
        margin-top:14px;

        padding-top:14px;

        border-top:
          1px solid
          #292929;
      }


      .mana-v896-water-title{
        margin-bottom:8px;

        color:#aaa;

        font-size:12px;

        font-weight:800;
      }


      .mana-v896-water-grid{
        display:grid;

        grid-template-columns:
          repeat(
            3,
            1fr
          );

        gap:8px;
      }


      .mana-v896-water-btn{
        min-height:46px;

        border:
          1px solid
          #343434;

        border-radius:13px;

        background:#111;

        color:#f3d875;

        font-size:13px;

        font-weight:900;
      }


      .mana-v896-sub{
        margin:
          4px
          0
          14px;

        color:#888;

        font-size:12px;

        line-height:1.45;
      }


      .mana-v896-meal-grid{
        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:9px;
      }


      .mana-v896-meal{
        min-height:78px;

        padding:12px;

        text-align:left;

        border:
          1px solid
          #413819;

        border-radius:15px;

        background:#111;

        color:#fff;

        cursor:pointer;

        touch-action:
          manipulation;
      }


      .mana-v896-meal strong{
        display:block;

        color:#f3d875;

        font-size:15px;
      }


      .mana-v896-meal span{
        display:block;

        margin-top:5px;

        color:#888;

        font-size:11px;
      }


      .mana-v896-today{
        padding:0;

        overflow:hidden;
      }


      .mana-v896-today-head{
        padding:
          18px
          18px
          12px;
      }


      .mana-v896-today-head h3{
        margin:0;

        font-size:20px;
      }


      .mana-v896-meal-row{
        display:grid;

        grid-template-columns:
          minmax(
            0,
            1fr
          )
          auto;

        gap:14px;

        align-items:center;

        padding:
          14px
          18px;

        border-top:
          1px solid
          #262626;
      }


      .mana-v896-meal-left{
        min-width:0;
      }


      .mana-v896-meal-name{
        color:#f3d875;

        font-size:13px;

        font-weight:900;
      }


      .mana-v896-foods{
        margin-top:4px;

        overflow:hidden;

        color:#aaa;

        font-size:11px;

        line-height:1.4;

        text-overflow:
          ellipsis;
      }


      .mana-v896-meal-macros{
        text-align:right;

        white-space:nowrap;
      }


      .mana-v896-meal-macros strong{
        display:block;

        color:#fff;

        font-size:13px;
      }


      .mana-v896-meal-macros span{
        display:block;

        margin-top:3px;

        color:#888;

        font-size:10px;
      }


      .mana-v896-empty{
        color:#666;

        font-size:11px;
      }


      .mana-v896-note{
        margin:
          12px
          2px
          0;

        color:#777;

        font-size:10px;

        line-height:1.45;
      }


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


      .mana-v896-sheet{
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


      .mana-v896-sheet-inner{
        width:min(
          520px,
          100%
        );

        margin:auto;
      }


      .mana-v896-sheet h2{
        margin:
          0
          0
          16px;

        font-size:26px;
      }


      .mana-v896-field{
        margin-bottom:12px;
      }


      .mana-v896-field label{
        display:block;

        margin-bottom:5px;

        color:#aaa;

        font-size:12px;
      }


      .mana-v896-field input{
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


      .mana-v896-save{
        width:100%;

        min-height:54px;

        border:0;

        border-radius:16px;

        background:#f3d875;

        color:#111;

        font-size:15px;

        font-weight:900;
      }


      .mana-v896-secondary{
        width:100%;

        min-height:50px;

        margin-top:8px;

        border:
          1px solid
          #383838;

        border-radius:15px;

        background:#111;

        color:#f3d875;

        font-size:14px;

        font-weight:900;
      }


      @media(
        max-width:360px
      ){

        .mana-v896-grid,
        .mana-v896-balance,
        .mana-v896-meal-grid{
          grid-template-columns:
            1fr;
        }


        .mana-v896-stat.wide{
          grid-column:auto;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     EDIT TARGET MODAL
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
        class="mana-v896-sheet"
      >

        <div
          class="mana-v896-sheet-inner"
        >

          <h2>
            Daily Fuel Targets
          </h2>


          <div
            class="mana-v896-field"
          >

            <label>
              Calories
            </label>

            <input
              id="manaV89Calories"
              type="number"
              min="0"
              inputmode="numeric"
            />

          </div>


          <div
            class="mana-v896-field"
          >

            <label>
              Protein grams
            </label>

            <input
              id="manaV89Protein"
              type="number"
              min="0"
              inputmode="numeric"
            />

          </div>


          <div
            class="mana-v896-field"
          >

            <label>
              Water ml
            </label>

            <input
              id="manaV89Water"
              type="number"
              min="0"
              step="100"
              inputmode="numeric"
            />

          </div>


          <button
            id="manaV89Save"
            type="button"
            class="mana-v896-save"
          >
            SAVE TARGETS
          </button>


          <button
            id="manaV89Cancel"
            type="button"
            class="mana-v896-secondary"
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
        targets.calories || "";


    document
      .getElementById(
        "manaV89Protein"
      )
      .value =
        targets.protein || "";


    document
      .getElementById(
        "manaV89Water"
      )
      .value =
        targets.water || "";


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
              .value || 0
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
              .value || 0
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
              .value || 0
          )
        ),

      carbs:
        current.carbs || 0,

      fat:
        current.fat || 0

    });


    closeModal();

    renderFuel();
  }


  /* =========================================
     TODAY'S MEALS
     ========================================= */

  function mealRow(
    meal
  ) {
    const info =
      mealInfo(
        meal
      );


    const foods =
      info.items.length
        ? info.items
            .map(
              item =>
                esc(
                  item.food ||
                  "Meal"
                )
            )
            .join(", ")
        : "Nothing logged yet";


    return `

      <div
        class="mana-v896-meal-row"
      >

        <div
          class="mana-v896-meal-left"
        >

          <div
            class="mana-v896-meal-name"
          >
            ${meal}
          </div>

          <div
            class="${
              info.items.length
                ? "mana-v896-foods"
                : "mana-v896-empty"
            }"
          >
            ${foods}
          </div>

        </div>


        <div
          class="mana-v896-meal-macros"
        >

          <strong>
            ${Math.round(
              info.calories
            )} cal
          </strong>

          <span>
            ${Math.round(
              info.protein
            )}g protein
          </span>

        </div>

      </div>

    `;
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
        day.water || 0
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
      rendering ||
      !fuelIsOpen()
    ) {
      return;
    }


    const holder =
      document.getElementById(
        CONTENT_ID
      );


    if (!holder) {
      return;
    }


    rendering =
      true;


    const profile =
      loadProfile();


    const targets =
      loadTargets();


    const totals =
      todayTotals();


    const hasTargets =
      targets.calories > 0 ||
      targets.protein > 0 ||
      targets.water > 0;


    const fuelGoal =
      profile.fuelGoal ||
      "Maintenance";


    const caloriesLeft =
      balance(
        targets.calories,
        totals.calories
      );


    const proteinLeft =
      balance(
        targets.protein,
        totals.protein
      );


    holder.innerHTML = `

      <div
        class="mana-v896-root"
      >

        <button
          id="manaV89BuildTargets"
          type="button"
          class="mana-v896-build"
        >
          BUILD TARGETS FROM PROFILE
        </button>


        <div
          class="
            mana-v896-card
            mana-v896-progress
          "
        >

          <div
            class="mana-v896-head"
          >

            <h3>
              Daily Progress
            </h3>


            <button
              id="manaV89EditTargets"
              type="button"
              class="mana-v896-edit"
            >
              Edit targets
            </button>

          </div>


          <div
            class="mana-v896-goal"
          >
            Fuel goal:
            <strong>
              ${esc(
                fuelGoal
              )}
            </strong>
          </div>


          ${
            hasTargets
              ? `

                <div
                  class="mana-v896-grid"
                >

                  <div
                    class="mana-v896-stat"
                  >

                    <div
                      class="mana-v896-label"
                    >
                      Calories
                    </div>

                    <div
                      class="mana-v896-value"
                    >
                      ${Math.round(
                        totals.calories
                      )}
                      /
                      ${targets.calories}
                    </div>

                    <div
                      class="mana-v896-track"
                    >

                      <div
                        class="mana-v896-fill"
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
                    class="mana-v896-stat"
                  >

                    <div
                      class="mana-v896-label"
                    >
                      Protein
                    </div>

                    <div
                      class="mana-v896-value"
                    >
                      ${Math.round(
                        totals.protein
                      )}
                      /
                      ${targets.protein}g
                    </div>

                    <div
                      class="mana-v896-track"
                    >

                      <div
                        class="mana-v896-fill"
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
                    class="
                      mana-v896-stat
                      wide
                    "
                  >

                    <div
                      class="mana-v896-label"
                    >
                      Water
                    </div>

                    <div
                      class="mana-v896-value"
                    >
                      ${Math.round(
                        totals.water
                      )}
                      /
                      ${targets.water}ml
                    </div>

                    <div
                      class="mana-v896-track"
                    >

                      <div
                        class="mana-v896-fill"
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
                  class="mana-v896-sub"
                >
                  Complete your Profile and
                  Fuel Goal to create your
                  starting targets.
                </div>

              `
          }


          <div
            class="mana-v896-water"
          >

            <div
              class="mana-v896-water-title"
            >
              Quick add water
            </div>


            <div
              class="mana-v896-water-grid"
            >

              <button
                type="button"
                class="mana-v896-water-btn"
                data-mana-water="250"
              >
                +250ml
              </button>

              <button
                type="button"
                class="mana-v896-water-btn"
                data-mana-water="500"
              >
                +500ml
              </button>

              <button
                type="button"
                class="mana-v896-water-btn"
                data-mana-water="750"
              >
                +750ml
              </button>

            </div>

          </div>

        </div>


        <div
          class="mana-v896-card"
        >

          <div
            class="mana-v896-head"
          >

            <h3>
              Balance Left Today
            </h3>

          </div>


          <div
            class="mana-v896-balance"
          >

            <div
              class="mana-v896-balance-box"
            >

              <span>
                Calories left
              </span>

              <strong>
                ${hasTargets
                  ? caloriesLeft
                  : "—"}
              </strong>

            </div>


            <div
              class="mana-v896-balance-box"
            >

              <span>
                Protein left
              </span>

              <strong>
                ${hasTargets
                  ? `${proteinLeft}g`
                  : "—"}
              </strong>

            </div>

          </div>

        </div>


        <div
          class="mana-v896-card"
        >

          <h3>
            Meal Selection
          </h3>

          <div
            class="mana-v896-sub"
          >
            Choose a meal to see your
            three Mana options.
          </div>


          <div
            class="mana-v896-meal-grid"
          >

            <button
              type="button"
              class="mana-v896-meal"
              data-mana-meal="Breakfast"
            >
              <strong>
                Breakfast
              </strong>

              <span>
                3 meal options
              </span>
            </button>


            <button
              type="button"
              class="mana-v896-meal"
              data-mana-meal="Lunch"
            >
              <strong>
                Lunch
              </strong>

              <span>
                3 meal options
              </span>
            </button>


            <button
              type="button"
              class="mana-v896-meal"
              data-mana-meal="Dinner"
            >
              <strong>
                Dinner
              </strong>

              <span>
                3 meal options
              </span>
            </button>


            <button
              type="button"
              class="mana-v896-meal"
              data-mana-meal="Snacks"
            >
              <strong>
                Snacks
              </strong>

              <span>
                3 meal options
              </span>
            </button>

          </div>

        </div>


        <div
          class="
            mana-v896-card
            mana-v896-today
          "
        >

          <div
            class="mana-v896-today-head"
          >

            <h3>
              Today's Meals
            </h3>

            <div
              class="mana-v896-sub"
            >
              Calories and protein logged
              for each meal today.
            </div>

          </div>


          ${mealRow(
            "Breakfast"
          )}

          ${mealRow(
            "Lunch"
          )}

          ${mealRow(
            "Dinner"
          )}

          ${mealRow(
            "Snacks"
          )}

        </div>


        <div
          class="mana-v896-note"
        >
          Meal calories and protein are
          practical estimates and can vary
          with serving size, brand and
          preparation.
        </div>

      </div>

    `;


    document
      .getElementById(
        "manaV89BuildTargets"
      )
      ?.addEventListener(
        "click",
        event => {

          event.preventDefault();


          if (
            typeof
              window
                .openManaProfile ===
            "function"
          ) {

            window
              .openManaProfile();

          }

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
                  button.dataset
                    .manaWater
                ) || 0
              );

            }
          );

        }
      );


    rendering =
      false;
  }


  function scheduleRender(
    delay = 50
  ) {
    clearTimeout(
      renderTimer
    );


    renderTimer =
      setTimeout(
        renderFuel,
        delay
      );
  }


  /* =========================================
     KEEP NEW FUEL SCREEN IN CONTROL

     v8.4 can repaint the older
     "Fuel for Strength / OPEN FUEL"
     card after focus/session restore.

     If that happens, immediately put
     this Fuel screen back.
     ========================================= */

  function watchFuelContent() {
    const holder =
      document.getElementById(
        CONTENT_ID
      );


    if (!holder) {
      return;
    }


    const observer =
      new MutationObserver(
        () => {

          if (
            rendering ||
            !fuelIsOpen()
          ) {
            return;
          }


          if (
            holder.querySelector(
              ".mana-v896-root"
            )
          ) {
            return;
          }


          scheduleRender(
            30
          );

        }
      );


    observer.observe(
      holder,
      {
        childList:true,
        subtree:true
      }
    );
  }


  function wire() {
    window.addEventListener(
      "mana:program-tab-change",
      () => {

        if (
          fuelIsOpen()
        ) {

          scheduleRender(
            80
          );

          setTimeout(
            renderFuel,
            220
          );

        }

      }
    );


    window.addEventListener(
      "mana:profile-synced",
      () => {

        scheduleRender(
          80
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        if (
          fuelIsOpen()
        ) {

          scheduleRender(
            100
          );

          setTimeout(
            renderFuel,
            450
          );

        }

      }
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
            "visible" &&
          fuelIsOpen()
        ) {

          scheduleRender(
            80
          );

          setTimeout(
            renderFuel,
            500
          );

        }

      }
    );


    window.addEventListener(
      "pageshow",
      () => {

        if (
          fuelIsOpen()
        ) {

          scheduleRender(
            100
          );

        }

      }
    );


    window.addEventListener(
      "storage",
      event => {

        if (
          [
            PROFILE_KEY,
            TARGET_KEY,
            FUEL_KEY
          ].includes(
            event.key
          )
        ) {

          scheduleRender(
            60
          );

        }

      }
    );
  }


  function init() {
    injectStyles();

    ensureModal();

    wire();

    watchFuelContent();


    setTimeout(
      renderFuel,
      900
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
