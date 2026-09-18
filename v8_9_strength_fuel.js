/* =========================================
   MANA MOVEMENT TRAINING v8.9.7
   MANA STRENGTH — FUEL

   DAILY PROGRESS
   BALANCE LEFT
   MEAL SELECTION
   TODAY'S MEALS
   CHANGE / REMOVE
   ========================================= */

(() => {
  "use strict";

  const SHELL_ID = "manaV83ProgramShell";
  const CONTENT_ID = "manaV83Content";
  const PROFILE_KEY = "mana-profile-v67";
  const TARGET_KEY = "mana-fuel-v58-targets";
  const FUEL_KEY = "mana-fuel-v571";
  const STYLE_ID = "mana-v897-strength-fuel-style";
  const MODAL_ID = "manaV89FuelTargets";

  let rendering = false;
  let renderTimer = null;


  function safeJson(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }


  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
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


  function loadTargets() {
    const saved =
      safeJson(
        localStorage.getItem(TARGET_KEY) || "{}",
        {}
      );

    return {
      calories: Number(saved.calories || 0),
      protein: Number(saved.protein || 0),
      water: Number(saved.water || 0),
      carbs: Number(saved.carbs || 0),
      fat: Number(saved.fat || 0)
    };
  }


  function saveTargets(targets) {
    localStorage.setItem(
      TARGET_KEY,
      JSON.stringify(targets)
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
    const store =
      loadStore();

    return (
      store[todayKey()] ||
      blankDay()
    );
  }


  function saveToday(day) {
    const store =
      loadStore();

    store[todayKey()] =
      day;

    localStorage.setItem(
      FUEL_KEY,
      JSON.stringify(store)
    );
  }


  function totalsToday() {
    const day =
      loadToday();

    const totals = {
      calories: 0,
      protein: 0,
      water: Number(day.water || 0)
    };

    Object.values(
      day.meals || {}
    ).forEach(
      items => {

        (items || [])
          .forEach(
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


  function pct(current, target) {
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


  function balance(target, used) {
    return Math.max(
      0,
      Math.round(
        Number(target || 0) -
        Number(used || 0)
      )
    );
  }


  function fuelIsOpen() {
    const shell =
      document.getElementById(
        SHELL_ID
      );

    const title =
      document.getElementById(
        "manaV83Title"
      );

    const tab =
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      );

    return Boolean(
      shell
        ?.classList
        .contains("open") &&

      title
        ?.textContent
        .trim()
        .toUpperCase() ===
        "MANA STRENGTH" &&

      tab
        ?.dataset
        ?.v83Tab ===
        "fuel"
    );
  }


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

      .mana-v897-root{
        width:100%;
      }

      .mana-v897-build{
        width:100%;
        min-height:54px;
        margin:0 0 12px;
        border:1px solid #5d5124;
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
      }

      .mana-v897-card{
        margin:12px 0;
        padding:18px;
        border:1px solid #292929;
        border-radius:20px;
        background:#0d0d0d;
      }

      .mana-v897-progress{
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

      .mana-v897-head{
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        margin-bottom:12px;
      }

      .mana-v897-head h3{
        margin:0;
        font-size:20px;
      }

      .mana-v897-edit{
        min-height:38px;
        padding:0 12px;
        border:1px solid #5d5124;
        border-radius:999px;
        background:#15130b;
        color:#f3d875;
        font-size:11px;
        font-weight:900;
      }

      .mana-v897-goal{
        margin-bottom:14px;
        color:#888;
        font-size:11px;
      }

      .mana-v897-goal strong{
        color:#f3d875;
      }

      .mana-v897-grid{
        display:grid;
        grid-template-columns:
          1fr
          1fr;
        gap:10px;
      }

      .mana-v897-stat{
        padding:14px;
        border:1px solid #292929;
        border-radius:16px;
        background:#090909;
      }

      .mana-v897-stat.wide{
        grid-column:1 / -1;
      }

      .mana-v897-label{
        color:#999;
        font-size:11px;
        margin-bottom:6px;
      }

      .mana-v897-value{
        color:#f3d875;
        font-size:20px;
        font-weight:900;
      }

      .mana-v897-track{
        height:6px;
        margin-top:10px;
        overflow:hidden;
        border-radius:999px;
        background:#242424;
      }

      .mana-v897-fill{
        height:100%;
        border-radius:999px;
        background:#f3d875;
      }

      .mana-v897-water{
        margin-top:14px;
        padding-top:14px;
        border-top:1px solid #292929;
      }

      .mana-v897-water-title{
        margin-bottom:8px;
        color:#aaa;
        font-size:12px;
        font-weight:800;
      }

      .mana-v897-water-grid{
        display:grid;
        grid-template-columns:
          repeat(3,1fr);
        gap:8px;
      }

      .mana-v897-water-btn{
        min-height:46px;
        border:1px solid #343434;
        border-radius:13px;
        background:#111;
        color:#f3d875;
        font-size:13px;
        font-weight:900;
      }

      .mana-v897-balance{
        display:grid;
        grid-template-columns:
          1fr
          1fr;
        gap:10px;
      }

      .mana-v897-balance-box{
        padding:15px;
        border:1px solid #463d1d;
        border-radius:16px;
        background:#15130b;
      }

      .mana-v897-balance-box span{
        display:block;
        color:#888;
        font-size:11px;
      }

      .mana-v897-balance-box strong{
        display:block;
        margin-top:5px;
        color:#f3d875;
        font-size:22px;
      }

      .mana-v897-sub{
        margin:4px 0 14px;
        color:#888;
        font-size:12px;
        line-height:1.45;
      }

      .mana-v897-meal-grid{
        display:grid;
        grid-template-columns:
          1fr
          1fr;
        gap:9px;
      }

      .mana-v897-meal{
        min-height:78px;
        padding:12px;
        text-align:left;
        border:1px solid #413819;
        border-radius:15px;
        background:#111;
        color:#fff;
      }

      .mana-v897-meal strong{
        display:block;
        color:#f3d875;
        font-size:15px;
      }

      .mana-v897-meal span{
        display:block;
        margin-top:5px;
        color:#888;
        font-size:11px;
      }

      .mana-v897-today{
        padding:0;
        overflow:hidden;
      }

      .mana-v897-today-head{
        padding:18px 18px 12px;
      }

      .mana-v897-today-head h3{
        margin:0;
        font-size:20px;
      }

      .mana-v897-meal-group{
        padding:14px 18px;
        border-top:1px solid #262626;
      }

      .mana-v897-meal-heading{
        color:#f3d875;
        font-size:13px;
        font-weight:900;
        margin-bottom:8px;
      }

      .mana-v897-empty{
        color:#666;
        font-size:11px;
      }

      .mana-v897-item{
        display:grid;
        grid-template-columns:
          minmax(0,1fr)
          auto;
        gap:12px;
        align-items:center;
        padding:10px 0;
        border-top:1px solid #202020;
      }

      .mana-v897-item:first-of-type{
        border-top:0;
      }

      .mana-v897-food{
        min-width:0;
      }

      .mana-v897-food strong{
        display:block;
        color:#fff;
        font-size:13px;
      }

      .mana-v897-food span{
        display:block;
        margin-top:3px;
        color:#888;
        font-size:10px;
      }

      .mana-v897-actions{
        display:flex;
        gap:6px;
      }

      .mana-v897-action{
        min-height:34px;
        padding:0 9px;
        border:1px solid #383838;
        border-radius:10px;
        background:#111;
        color:#aaa;
        font-size:10px;
        font-weight:800;
      }

      .mana-v897-action.change{
        color:#f3d875;
        border-color:#51461f;
      }

      .mana-v897-action.remove{
        color:#d99a9a;
      }

      #${MODAL_ID}{
        position:fixed;
        inset:0;
        z-index:29000;
        display:none;
        align-items:flex-end;
        background:rgba(0,0,0,.82);
      }

      #${MODAL_ID}.open{
        display:flex;
      }

      .mana-v897-sheet{
        width:100%;
        max-height:92dvh;
        overflow:auto;
        padding:
          24px
          20px
          calc(30px + env(safe-area-inset-bottom));
        border:1px solid #333;
        border-radius:26px 26px 0 0;
        background:#101010;
      }

      .mana-v897-sheet-inner{
        width:min(520px,100%);
        margin:auto;
      }

      .mana-v897-field{
        margin-bottom:12px;
      }

      .mana-v897-field label{
        display:block;
        margin-bottom:5px;
        color:#aaa;
        font-size:12px;
      }

      .mana-v897-field input{
        width:100%;
        min-height:50px;
        padding:12px 14px;
        border:1px solid #333;
        border-radius:13px;
        background:#080808;
        color:#fff;
      }

      .mana-v897-save,
      .mana-v897-secondary{
        width:100%;
        min-height:52px;
        border-radius:15px;
        font-weight:900;
      }

      .mana-v897-save{
        border:0;
        background:#f3d875;
        color:#111;
      }

      .mana-v897-secondary{
        margin-top:8px;
        border:1px solid #383838;
        background:#111;
        color:#f3d875;
      }

      @media(max-width:360px){

        .mana-v897-grid,
        .mana-v897-balance,
        .mana-v897-meal-grid{
          grid-template-columns:1fr;
        }

        .mana-v897-stat.wide{
          grid-column:auto;
        }

      }

    `;

    document.head.appendChild(style);
  }


  function ensureModal() {
    if (
      document.getElementById(
        MODAL_ID
      )
    ) {
      return;
    }

    const modal =
      document.createElement("div");

    modal.id =
      MODAL_ID;

    modal.innerHTML = `

      <div class="mana-v897-sheet">

        <div class="mana-v897-sheet-inner">

          <h2>
            Daily Fuel Targets
          </h2>

          <div class="mana-v897-field">
            <label>Calories</label>
            <input
              id="manaV89Calories"
              type="number"
              min="0"
            >
          </div>

          <div class="mana-v897-field">
            <label>Protein grams</label>
            <input
              id="manaV89Protein"
              type="number"
              min="0"
            >
          </div>

          <div class="mana-v897-field">
            <label>Water ml</label>
            <input
              id="manaV89Water"
              type="number"
              min="0"
              step="100"
            >
          </div>

          <button
            id="manaV89Save"
            class="mana-v897-save"
            type="button"
          >
            SAVE TARGETS
          </button>

          <button
            id="manaV89Cancel"
            class="mana-v897-secondary"
            type="button"
          >
            Cancel
          </button>

        </div>

      </div>

    `;

    document.body
      .appendChild(modal);

    document
      .getElementById("manaV89Save")
      .onclick =
        saveManualTargets;

    document
      .getElementById("manaV89Cancel")
      .onclick =
        closeModal;

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


  function openModal() {
    const targets =
      loadTargets();

    document
      .getElementById("manaV89Calories")
      .value =
        targets.calories || "";

    document
      .getElementById("manaV89Protein")
      .value =
        targets.protein || "";

    document
      .getElementById("manaV89Water")
      .value =
        targets.water || "";

    document
      .getElementById(MODAL_ID)
      .classList
      .add("open");
  }


  function closeModal() {
    document
      .getElementById(MODAL_ID)
      ?.classList
      .remove("open");
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
              .getElementById("manaV89Calories")
              .value || 0
          )
        ),

      protein:
        Math.max(
          0,
          Number(
            document
              .getElementById("manaV89Protein")
              .value || 0
          )
        ),

      water:
        Math.max(
          0,
          Number(
            document
              .getElementById("manaV89Water")
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


  function removeMealItem(
    meal,
    index
  ) {
    const day =
      loadToday();

    if (
      !Array.isArray(
        day.meals?.[meal]
      )
    ) {
      return;
    }

    day.meals[meal]
      .splice(
        Number(index),
        1
      );

    saveToday(day);

    renderFuel();
  }


  function mealGroup(meal) {
    const day =
      loadToday();

    const items =
      Array.isArray(
        day.meals?.[meal]
      )
        ? day.meals[meal]
        : [];

    if (!items.length) {

      return `

        <div class="mana-v897-meal-group">

          <div class="mana-v897-meal-heading">
            ${meal}
          </div>

          <div class="mana-v897-empty">
            Nothing logged yet
          </div>

        </div>

      `;
    }

    const rows =
      items
        .map(
          (item, index) => `

            <div class="mana-v897-item">

              <div class="mana-v897-food">

                <strong>
                  ${esc(
                    item.food ||
                    "Meal"
                  )}
                </strong>

                <span>
                  ${Math.round(
                    Number(
                      item.calories || 0
                    )
                  )} cal
                  •
                  ${Math.round(
                    Number(
                      item.protein || 0
                    )
                  )}g protein
                </span>

              </div>

              <div class="mana-v897-actions">

                <button
                  type="button"
                  class="mana-v897-action change"
                  data-mana-change-meal="${meal}"
                  data-mana-change-index="${index}"
                >
                  Change
                </button>

                <button
                  type="button"
                  class="mana-v897-action remove"
                  data-mana-remove-meal="${meal}"
                  data-mana-remove-index="${index}"
                >
                  Remove
                </button>

              </div>

            </div>

          `
        )
        .join("");

    return `

      <div class="mana-v897-meal-group">

        <div class="mana-v897-meal-heading">
          ${meal}
        </div>

        ${rows}

      </div>

    `;
  }


  function addWater(amount) {
    const day =
      loadToday();

    day.water =
      Number(day.water || 0) +
      Number(amount || 0);

    saveToday(day);

    renderFuel();
  }


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

    rendering = true;

    const profile =
      loadProfile();

    const targets =
      loadTargets();

    const totals =
      totalsToday();

    const fuelGoal =
      profile.fuelGoal ||
      "Maintenance";

    const hasTargets =
      targets.calories > 0 ||
      targets.protein > 0 ||
      targets.water > 0;

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

      <div class="mana-v897-root">

        <button
          id="manaV89BuildTargets"
          type="button"
          class="mana-v897-build"
        >
          BUILD TARGETS FROM PROFILE
        </button>


        <div
          class="
            mana-v897-card
            mana-v897-progress
          "
        >

          <div class="mana-v897-head">

            <h3>
              Daily Progress
            </h3>

            <button
              id="manaV89EditTargets"
              type="button"
              class="mana-v897-edit"
            >
              Edit targets
            </button>

          </div>

          <div class="mana-v897-goal">
            Fuel goal:
            <strong>
              ${esc(fuelGoal)}
            </strong>
          </div>

          ${
            hasTargets
              ? `

                <div class="mana-v897-grid">

                  <div class="mana-v897-stat">

                    <div class="mana-v897-label">
                      Calories
                    </div>

                    <div class="mana-v897-value">
                      ${Math.round(
                        totals.calories
                      )}
                      /
                      ${targets.calories}
                    </div>

                    <div class="mana-v897-track">
                      <div
                        class="mana-v897-fill"
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


                  <div class="mana-v897-stat">

                    <div class="mana-v897-label">
                      Protein
                    </div>

                    <div class="mana-v897-value">
                      ${Math.round(
                        totals.protein
                      )}
                      /
                      ${targets.protein}g
                    </div>

                    <div class="mana-v897-track">
                      <div
                        class="mana-v897-fill"
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
                      mana-v897-stat
                      wide
                    "
                  >

                    <div class="mana-v897-label">
                      Water
                    </div>

                    <div class="mana-v897-value">
                      ${Math.round(
                        totals.water
                      )}
                      /
                      ${targets.water}ml
                    </div>

                    <div class="mana-v897-track">
                      <div
                        class="mana-v897-fill"
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

                <div class="mana-v897-sub">
                  Complete your Profile and
                  Fuel Goal to create targets.
                </div>

              `
          }


          <div class="mana-v897-water">

            <div class="mana-v897-water-title">
              Quick add water
            </div>

            <div class="mana-v897-water-grid">

              <button
                type="button"
                class="mana-v897-water-btn"
                data-mana-water="250"
              >
                +250ml
              </button>

              <button
                type="button"
                class="mana-v897-water-btn"
                data-mana-water="500"
              >
                +500ml
              </button>

              <button
                type="button"
                class="mana-v897-water-btn"
                data-mana-water="750"
              >
                +750ml
              </button>

            </div>

          </div>

        </div>


        <div class="mana-v897-card">

          <div class="mana-v897-head">

            <h3>
              Balance Left Today
            </h3>

          </div>

          <div class="mana-v897-balance">

            <div class="mana-v897-balance-box">

              <span>
                Calories left
              </span>

              <strong>
                ${
                  hasTargets
                    ? caloriesLeft
                    : "—"
                }
              </strong>

            </div>

            <div class="mana-v897-balance-box">

              <span>
                Protein left
              </span>

              <strong>
                ${
                  hasTargets
                    ? `${proteinLeft}g`
                    : "—"
                }
              </strong>

            </div>

          </div>

        </div>


        <div class="mana-v897-card">

          <h3>
            Meal Selection
          </h3>

          <div class="mana-v897-sub">
            Choose a meal to see your
            three Mana options.
          </div>

          <div class="mana-v897-meal-grid">

            ${
              [
                "Breakfast",
                "Lunch",
                "Dinner",
                "Snacks"
              ]
                .map(
                  meal => `

                    <button
                      type="button"
                      class="mana-v897-meal"
                      data-mana-meal="${meal}"
                    >
                      <strong>
                        ${meal}
                      </strong>

                      <span>
                        3 meal options
                      </span>
                    </button>

                  `
                )
                .join("")
            }

          </div>

        </div>


        <div
          class="
            mana-v897-card
            mana-v897-today
          "
        >

          <div class="mana-v897-today-head">

            <h3>
              Today's Meals
            </h3>

            <div class="mana-v897-sub">
              Change or remove any meal
              you have logged today.
            </div>

          </div>

          ${mealGroup("Breakfast")}
          ${mealGroup("Lunch")}
          ${mealGroup("Dinner")}
          ${mealGroup("Snacks")}

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
                )
              );

            }
          );

        }
      );


    holder
      .querySelectorAll(
        "[data-mana-remove-meal]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            event => {

              event.preventDefault();

              removeMealItem(
                button.dataset
                  .manaRemoveMeal,

                Number(
                  button.dataset
                    .manaRemoveIndex
                )
              );

            }
          );

        }
      );


    rendering = false;
  }


  function scheduleRender(delay = 50) {
    clearTimeout(renderTimer);

    renderTimer =
      setTimeout(
        renderFuel,
        delay
      );
  }


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
              ".mana-v897-root"
            )
          ) {
            return;
          }

          scheduleRender(30);
        }
      );

    observer.observe(
      holder,
      {
        childList: true,
        subtree: true
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
          scheduleRender(80);

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
        scheduleRender(80);
      }
    );


    window.addEventListener(
      "focus",
      () => {

        if (
          fuelIsOpen()
        ) {
          scheduleRender(100);
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
          scheduleRender(100);
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
