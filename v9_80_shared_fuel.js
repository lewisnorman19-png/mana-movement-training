/* =========================================
   MANA MOVEMENT TRAINING v9.80.0
   SHARED FUEL — MANA 28 + MANA STRENGTH

   ONE FUEL EXPERIENCE FOR BOTH PROGRAMS:
   1. TODAY'S FUEL
      - Calories
      - Protein
      - Water
      - Recovery

   2. MEALS
      - Breakfast
      - Lunch
      - Dinner
      - Snack
      - Tap a meal to reveal meal options

   3. COACH CHAT at the bottom

   STORAGE COMPATIBILITY:
   - mana-fuel-v571
   - mana-fuel-v58-targets
   - mana-strength-v866-daily

   STABILITY:
   - No MutationObserver
   - No continuous render loop
   - Bounded takeover after older Fuel renderers
   ========================================= */

(() => {
  "use strict";

  const BUILD = "98000";

  const ROOT_ID =
    "manaV980SharedFuel";

  const STYLE_ID =
    "mana-v980-shared-fuel-style";

  const FUEL_KEY =
    "mana-fuel-v571";

  const TARGET_KEY =
    "mana-fuel-v58-targets";

  const DAILY_KEY =
    "mana-strength-v866-daily";

  let openPanel = "";
  let openMeal = "";
  let takeoverTimer = null;


  /* =========================================
     MEAL OPTIONS
     ========================================= */

  const MEAL_OPTIONS = {

    Breakfast: [

      {
        name: "Eggs + toast",
        detail:
          "3 eggs • wholegrain toast • fruit",
        calories: 430,
        protein: 28,
        carbs: 38,
        fat: 18
      },

      {
        name: "Greek yoghurt bowl",
        detail:
          "Greek yoghurt • berries • oats • honey",
        calories: 390,
        protein: 30,
        carbs: 48,
        fat: 8
      },

      {
        name: "Protein oats",
        detail:
          "Oats • protein • banana • milk",
        calories: 470,
        protein: 35,
        carbs: 64,
        fat: 9
      },

      {
        name: "Breakfast wrap",
        detail:
          "Egg • lean bacon • spinach • wrap",
        calories: 450,
        protein: 31,
        carbs: 39,
        fat: 18
      }

    ],


    Lunch: [

      {
        name: "Chicken rice bowl",
        detail:
          "Chicken • rice • vegetables • light sauce",
        calories: 560,
        protein: 46,
        carbs: 62,
        fat: 13
      },

      {
        name: "Tuna wrap",
        detail:
          "Tuna • wrap • salad • light mayo",
        calories: 430,
        protein: 38,
        carbs: 42,
        fat: 12
      },

      {
        name: "Beef + sweet potato",
        detail:
          "Lean beef • sweet potato • greens",
        calories: 540,
        protein: 42,
        carbs: 49,
        fat: 18
      },

      {
        name: "Chicken salad",
        detail:
          "Chicken • mixed salad • avocado • dressing",
        calories: 450,
        protein: 43,
        carbs: 20,
        fat: 22
      }

    ],


    Dinner: [

      {
        name: "Lean beef + rice",
        detail:
          "Lean beef mince • rice • vegetables",
        calories: 620,
        protein: 48,
        carbs: 68,
        fat: 17
      },

      {
        name: "Chicken + potato",
        detail:
          "Chicken • potato • greens",
        calories: 560,
        protein: 50,
        carbs: 52,
        fat: 14
      },

      {
        name: "Salmon + rice",
        detail:
          "Salmon • rice • vegetables",
        calories: 640,
        protein: 42,
        carbs: 58,
        fat: 25
      },

      {
        name: "High-protein pasta",
        detail:
          "Lean mince • pasta • tomato • vegetables",
        calories: 650,
        protein: 47,
        carbs: 75,
        fat: 17
      }

    ],


    Snacks: [

      {
        name: "Protein shake",
        detail:
          "Protein powder • milk or water",
        calories: 180,
        protein: 30,
        carbs: 8,
        fat: 3
      },

      {
        name: "Yoghurt + fruit",
        detail:
          "High-protein yoghurt • fruit",
        calories: 220,
        protein: 20,
        carbs: 30,
        fat: 3
      },

      {
        name: "Tuna + crackers",
        detail:
          "Tuna • wholegrain crackers",
        calories: 250,
        protein: 26,
        carbs: 25,
        fat: 5
      },

      {
        name: "Cottage cheese bowl",
        detail:
          "Cottage cheese • fruit • cinnamon",
        calories: 230,
        protein: 25,
        carbs: 26,
        fat: 4
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


  function clamp(
    value,
    min,
    max
  ) {

    return Math.max(
      min,
      Math.min(
        max,
        value
      )
    );

  }


  function todayKey() {

    const d =
      new Date();

    return [

      d.getFullYear(),

      String(
        d.getMonth() + 1
      ).padStart(
        2,
        "0"
      ),

      String(
        d.getDate()
      ).padStart(
        2,
        "0"
      )

    ].join("-");

  }


  /* =========================================
     FUEL STORAGE
     ========================================= */

  function loadFuel() {

    const data =
      safeJson(
        localStorage.getItem(
          FUEL_KEY
        ) || "{}",
        {}
      );

    return (
      data &&
      typeof data === "object"
    )
      ? data
      : {};

  }


  function saveFuel(
    store
  ) {

    localStorage.setItem(
      FUEL_KEY,
      JSON.stringify(
        store
      )
    );

    window.dispatchEvent(
      new CustomEvent(
        "mana:fuel-updated"
      )
    );

  }


  function loadTargets() {

    const data =
      safeJson(
        localStorage.getItem(
          TARGET_KEY
        ) || "{}",
        {}
      );

    return {

      calories:
        Math.max(
          0,
          Number(
            data.calories
          ) || 2200
        ),

      protein:
        Math.max(
          0,
          Number(
            data.protein
          ) || 150
        ),

      water:
        Math.max(
          0,
          Number(
            data.water
          ) || 2500
        )

    };

  }


  function todayData() {

    const store =
      loadFuel();

    const key =
      todayKey();

    const day =
      store[key] &&
      typeof store[key] ===
        "object"

        ? store[key]

        : {

            meals: {
              Breakfast: [],
              Lunch: [],
              Dinner: [],
              Snacks: []
            },

            water: 0

          };


    day.meals =
      day.meals &&
      typeof day.meals ===
        "object"

        ? day.meals

        : {};


    [
      "Breakfast",
      "Lunch",
      "Dinner",
      "Snacks"
    ]
      .forEach(
        name => {

          if (
            !Array.isArray(
              day.meals[name]
            )
          ) {

            day.meals[name] =
              [];

          }

        }
      );


    day.water =
      Math.max(
        0,
        Number(
          day.water
        ) || 0
      );


    return day;

  }


  function writeToday(
    day
  ) {

    const store =
      loadFuel();

    store[
      todayKey()
    ] =
      day;

    saveFuel(
      store
    );

  }


  function totals() {

    const day =
      todayData();

    const result = {

      calories: 0,

      protein: 0,

      water:
        day.water

    };


    Object
      .values(
        day.meals
      )
      .forEach(
        items => {

          (
            items ||
            []
          )
            .forEach(
              item => {

                result.calories +=
                  Number(
                    item?.calories
                  ) || 0;

                result.protein +=
                  Number(
                    item?.protein
                  ) || 0;

              }
            );

        }
      );


    return result;

  }


  /* =========================================
     RECOVERY
     ========================================= */

  function recoveryState() {

    const store =
      safeJson(
        localStorage.getItem(
          DAILY_KEY
        ) || "{}",
        {}
      );

    const day =
      store[
        todayKey()
      ] || {};

    const raw =
      String(
        day.recoveryLevel ||
        day.recovery ||
        ""
      )
        .toLowerCase();


    if (
      raw === "good" ||
      raw === "true"
    ) {

      return "Good";

    }


    if (
      raw === "moderate"
    ) {

      return "Moderate";

    }


    if (
      raw ===
        "needs-attention" ||
      raw === "low"
    ) {

      return "Needs attention";

    }


    return "Not set";

  }


  function saveRecovery(
    level
  ) {

    const store =
      safeJson(
        localStorage.getItem(
          DAILY_KEY
        ) || "{}",
        {}
      );

    const key =
      todayKey();

    const day =
      store[key] &&
      typeof store[key] ===
        "object"

        ? store[key]

        : {};


    day.recoveryLevel =
      level;

    day.recovery =
      level ===
      "good";


    store[key] =
      day;


    localStorage.setItem(
      DAILY_KEY,
      JSON.stringify(
        store
      )
    );


    window.dispatchEvent(
      new CustomEvent(
        "mana:recovery-updated"
      )
    );

  }


  /* =========================================
     SCREEN STATE
     ========================================= */

  function programName() {

    return String(
      document
        .getElementById(
          "manaV83Title"
        )
        ?.textContent ||
      ""
    )
      .trim()
      .toUpperCase();

  }


  function fuelOpen() {

    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );

    const tab =
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      );

    const title =
      programName();


    return Boolean(

      shell
        ?.classList
        .contains(
          "open"
        ) &&

      tab
        ?.dataset
        ?.v83Tab ===
          "fuel" &&

      (
        title ===
          "MANA STRENGTH" ||

        title ===
          "MANA 28"
      )

    );

  }


  /* =========================================
     HTML HELPERS
     ========================================= */

  function metric(
    label,
    value,
    target,
    suffix = ""
  ) {

    const pct =
      target

        ? clamp(
            Math.round(
              (
                Number(
                  String(value)
                    .replaceAll(
                      ",",
                      ""
                    )
                ) /
                Number(
                  String(target)
                    .replaceAll(
                      ",",
                      ""
                    )
                )
              ) *
              100
            ),
            0,
            100
          )

        : 0;


    return `

      <div
        class="m980-metric"
      >

        <div
          class="m980-metric-top"
        >

          <span>
            ${esc(label)}
          </span>

          <strong>

            ${esc(value)}
            ${suffix}

            ${
              target
                ? `
                  <small>
                    / ${esc(target)}
                    ${suffix}
                  </small>
                `
                : ""
            }

          </strong>

        </div>

        ${
          target

            ? `

              <div
                class="m980-track"
              >

                <div
                  class="m980-fill"
                  style="
                    width:${pct}%;
                  "
                ></div>

              </div>

            `

            : ""
        }

      </div>

    `;

  }


  function loggedMealHtml(
    mealKey
  ) {

    const items =
      todayData()
        .meals[
          mealKey
        ] || [];


    if (
      !items.length
    ) {

      return "";

    }


    return `

      <div
        class="m980-logged"
      >

        ${items
          .map(
            (
              item,
              index
            ) => `

              <div
                class="m980-logged-row"
              >

                <div>

                  <strong>
                    ${
                      esc(
                        item.name ||
                        "Meal"
                      )
                    }
                  </strong>

                  <span>

                    ${
                      Math.round(
                        Number(
                          item.calories
                        ) || 0
                      )
                    }
                    kcal

                    •

                    ${
                      Math.round(
                        Number(
                          item.protein
                        ) || 0
                      )
                    }
                    g protein

                  </span>

                </div>

                <button
                  type="button"
                  data-m980-remove="${mealKey}:${index}"
                  aria-label="Remove meal"
                >
                  ×
                </button>

              </div>

            `
          )
          .join("")}

      </div>

    `;

  }


  function mealOptionsHtml(
    mealKey
  ) {

    const options =
      MEAL_OPTIONS[
        mealKey
      ] || [];


    return `

      <div
        class="m980-meal-options"
      >

        ${options
          .map(
            (
              item,
              index
            ) => `

              <button
                type="button"
                class="m980-option"
                data-m980-add="${mealKey}:${index}"
              >

                <span
                  class="m980-option-copy"
                >

                  <strong>
                    ${esc(item.name)}
                  </strong>

                  <small>
                    ${esc(item.detail)}
                  </small>

                  <em>
                    ${item.calories}
                    kcal
                    •
                    ${item.protein}
                    g protein
                  </em>

                </span>

                <span
                  class="m980-plus"
                >
                  +
                </span>

              </button>

            `
          )
          .join("")}

      </div>

    `;

  }


  function mealRow(
    mealKey,
    label
  ) {

    const expanded =
      openMeal ===
      mealKey;

    const count =
      (
        todayData()
          .meals[
            mealKey
          ] || []
      )
        .length;


    return `

      <div
        class="
          m980-meal
          ${
            expanded
              ? "open"
              : ""
          }
        "
      >

        <button
          type="button"
          class="m980-meal-head"
          data-m980-meal="${mealKey}"
        >

          <span>

            <strong>
              ${esc(label)}
            </strong>

            <small>

              ${
                count

                  ? `${count} logged today`

                  : "Choose a meal"
              }

            </small>

          </span>

          <b>
            ${
              expanded
                ? "−"
                : "+"
            }
          </b>

        </button>

        ${
          expanded

            ? `

              <div
                class="m980-meal-body"
              >

                ${loggedMealHtml(
                  mealKey
                )}

                ${mealOptionsHtml(
                  mealKey
                )}

              </div>

            `

            : ""
        }

      </div>

    `;

  }


  /* =========================================
     TODAY'S FUEL PANEL
     ========================================= */

  function todayFuelBody() {

    const t =
      totals();

    const targets =
      loadTargets();

    const recovery =
      recoveryState();


    return `

      <div
        class="m980-panel-body"
      >

        ${metric(
          "Calories",
          Math.round(
            t.calories
          )
            .toLocaleString(),
          Math.round(
            targets.calories
          )
            .toLocaleString(),
          " kcal"
        )}


        ${metric(
          "Protein",
          Math.round(
            t.protein
          ),
          Math.round(
            targets.protein
          ),
          " g"
        )}


        ${metric(
          "Water",
          (
            t.water /
            1000
          )
            .toFixed(
              1
            ),
          (
            targets.water /
            1000
          )
            .toFixed(
              1
            ),
          " L"
        )}


        <div
          class="
            m980-metric
            m980-water-actions
          "
        >

          <div
            class="m980-metric-top"
          >

            <span>
              Quick water
            </span>

            <strong>
              ${
                Math.round(
                  t.water
                )
              }
              ml
            </strong>

          </div>


          <div
            class="m980-chip-row"
          >

            <button
              type="button"
              data-m980-water="250"
            >
              +250 ml
            </button>

            <button
              type="button"
              data-m980-water="500"
            >
              +500 ml
            </button>

            <button
              type="button"
              data-m980-water="-250"
            >
              −250 ml
            </button>

          </div>

        </div>


        <div
          class="
            m980-metric
            m980-recovery
          "
        >

          <div
            class="m980-metric-top"
          >

            <span>
              Recovery
            </span>

            <strong>
              ${esc(recovery)}
            </strong>

          </div>


          <div
            class="m980-chip-row"
          >

            <button
              type="button"
              data-m980-recovery="good"
              class="${
                recovery ===
                  "Good"
                  ? "active"
                  : ""
              }"
            >
              Good
            </button>

            <button
              type="button"
              data-m980-recovery="moderate"
              class="${
                recovery ===
                  "Moderate"
                  ? "active"
                  : ""
              }"
            >
              Moderate
            </button>

            <button
              type="button"
              data-m980-recovery="needs-attention"
              class="${
                recovery ===
                  "Needs attention"
                  ? "active"
                  : ""
              }"
            >
              Needs attention
            </button>

          </div>

        </div>

      </div>

    `;

  }


  /* =========================================
     MEALS PANEL
     ========================================= */

  function mealsBody() {

    return `

      <div
        class="
          m980-panel-body
          m980-meals-body
        "
      >

        ${mealRow(
          "Breakfast",
          "Breakfast"
        )}

        ${mealRow(
          "Lunch",
          "Lunch"
        )}

        ${mealRow(
          "Dinner",
          "Dinner"
        )}

        ${mealRow(
          "Snacks",
          "Snack"
        )}

      </div>

    `;

  }


  /* =========================================
     FULL PAGE
     ========================================= */

  function pageHtml() {

    const todayOpen =
      openPanel ===
      "today";

    const mealsOpen =
      openPanel ===
      "meals";


    return `

      <div
        id="${ROOT_ID}"
      >

        <div
          class="m980-hero"
        >

          <div
            class="m980-kicker"
          >
            FUEL
          </div>

          <h2>
            Fuel with purpose
          </h2>

          <p>
            Simple nutrition.
            Clear targets.
            Better consistency.
          </p>

        </div>


        <div
          class="
            m980-section
            ${
              todayOpen
                ? "open"
                : ""
            }
          "
        >

          <button
            type="button"
            class="m980-banner"
            data-m980-panel="today"
          >

            <span
              class="m980-banner-copy"
            >

              <span
                class="m980-icon"
              >
                01
              </span>

              <span>

                <strong>
                  TODAY'S FUEL
                </strong>

                <small>
                  Calories • Protein • Water • Recovery
                </small>

              </span>

            </span>

            <b>
              ${
                todayOpen
                  ? "−"
                  : "+"
              }
            </b>

          </button>

          ${
            todayOpen
              ? todayFuelBody()
              : ""
          }

        </div>


        <div
          class="
            m980-section
            ${
              mealsOpen
                ? "open"
                : ""
            }
          "
        >

          <button
            type="button"
            class="m980-banner"
            data-m980-panel="meals"
          >

            <span
              class="m980-banner-copy"
            >

              <span
                class="m980-icon"
              >
                02
              </span>

              <span>

                <strong>
                  MEALS
                </strong>

                <small>
                  Breakfast • Lunch • Dinner • Snack
                </small>

              </span>

            </span>

            <b>
              ${
                mealsOpen
                  ? "−"
                  : "+"
              }
            </b>

          </button>

          ${
            mealsOpen
              ? mealsBody()
              : ""
          }

        </div>


        <div
          class="m980-chat"
        >

          <div
            class="m980-kicker"
          >
            COACH CHAT
          </div>

          <div
            class="m980-chat-row"
          >

            <div>

              <strong>
                Need help with your Fuel?
              </strong>

              <span>
                Ask your coach about meals,
                targets or nutrition.
              </span>

            </div>

            <button
              type="button"
              id="m980CoachChat"
            >
              CHAT
            </button>

          </div>

        </div>

      </div>

    `;

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

      #${ROOT_ID}{
        width:min(760px,100%);
        margin:0 auto;
        padding:4px 0 100px;
        color:#fff;
        font-family:inherit;
        box-sizing:border-box;
      }

      #${ROOT_ID} *{
        box-sizing:border-box;
      }


      .m980-hero{
        padding:8px 2px 22px;
      }


      .m980-kicker{
        font-size:11px;
        letter-spacing:2px;
        font-weight:900;
        color:#e7c95b;
        text-transform:uppercase;
      }


      .m980-hero h2{
        margin:7px 0 7px;
        font-size:clamp(
          26px,
          5vw,
          42px
        );
        line-height:1.05;
        letter-spacing:-.7px;
        color:#fff;
      }


      .m980-hero p{
        margin:0;
        color:#aaa;
        font-size:15px;
        line-height:1.5;
      }


      .m980-section,
      .m980-chat{
        background:#0e0e0e;
        border:1px solid #2b2b2b;
        border-radius:22px;
        margin:0 0 14px;
        overflow:hidden;
        box-shadow:
          0 14px 35px
          rgba(
            0,
            0,
            0,
            .2
          );
      }


      .m980-section.open{
        border-color:#4d4422;
      }


      .m980-banner{
        width:100%;
        min-height:92px;
        border:0;
        background:transparent;
        color:#fff;
        padding:18px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        text-align:left;
        cursor:pointer;
      }


      .m980-banner-copy{
        display:flex;
        align-items:center;
        gap:14px;
        min-width:0;
      }


      .m980-icon{
        width:46px;
        height:46px;
        flex:0 0 46px;
        border-radius:15px;
        background:#17150d;
        border:1px solid #5a4f24;
        color:#f3d875;
        display:grid;
        place-items:center;
        font-size:12px;
        font-weight:900;
        letter-spacing:1px;
      }


      .m980-banner strong{
        display:block;
        font-size:18px;
        letter-spacing:.3px;
      }


      .m980-banner small{
        display:block;
        margin-top:5px;
        color:#949494;
        font-size:12px;
        line-height:1.4;
        font-weight:650;
      }


      .m980-banner > b{
        color:#f3d875;
        font-size:28px;
        font-weight:400;
        line-height:1;
      }


      .m980-panel-body{
        border-top:
          1px solid
          #242424;
        padding:
          5px
          18px
          18px;
      }


      .m980-metric{
        padding:16px 0;
        border-bottom:
          1px solid
          #222;
      }


      .m980-metric:last-child{
        border-bottom:0;
        padding-bottom:2px;
      }


      .m980-metric-top{
        display:flex;
        justify-content:space-between;
        align-items:baseline;
        gap:12px;
      }


      .m980-metric-top span{
        font-size:14px;
        font-weight:800;
        color:#d0d0d0;
      }


      .m980-metric-top strong{
        font-size:17px;
        color:#fff;
        white-space:nowrap;
      }


      .m980-metric-top small{
        font-size:12px;
        color:#7d7d7d;
        font-weight:700;
      }


      .m980-track{
        height:7px;
        margin-top:10px;
        border-radius:999px;
        background:#252525;
        overflow:hidden;
      }


      .m980-fill{
        height:100%;
        border-radius:999px;
        background:#e1c35a;
      }


      .m980-chip-row{
        display:flex;
        gap:8px;
        flex-wrap:wrap;
        margin-top:12px;
      }


      .m980-chip-row button{
        border:
          1px solid
          #3a3a3a;
        background:#171717;
        color:#ddd;
        border-radius:999px;
        padding:9px 12px;
        font-size:12px;
        font-weight:800;
        cursor:pointer;
      }


      .m980-chip-row button.active,
      .m980-chip-row button:hover{
        border-color:#6b5e27;
        background:#1b180d;
        color:#f3d875;
      }


      .m980-meals-body{
        padding-top:9px;
      }


      .m980-meal{
        border-bottom:
          1px solid
          #222;
      }


      .m980-meal:last-child{
        border-bottom:0;
      }


      .m980-meal-head{
        width:100%;
        border:0;
        background:transparent;
        color:#fff;
        padding:15px 2px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        text-align:left;
        cursor:pointer;
      }


      .m980-meal-head strong{
        display:block;
        font-size:16px;
      }


      .m980-meal-head small{
        display:block;
        color:#858585;
        margin-top:4px;
        font-size:12px;
      }


      .m980-meal-head b{
        font-size:22px;
        color:#e7c95b;
        font-weight:400;
      }


      .m980-meal-body{
        padding:0 0 14px;
      }


      .m980-logged{
        margin-bottom:10px;
        border-radius:14px;
        background:#131313;
        border:
          1px solid
          #282828;
        overflow:hidden;
      }


      .m980-logged-row{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        padding:11px 12px;
        border-bottom:
          1px solid
          #232323;
      }


      .m980-logged-row:last-child{
        border-bottom:0;
      }


      .m980-logged-row strong{
        display:block;
        font-size:13px;
      }


      .m980-logged-row span{
        display:block;
        color:#888;
        font-size:11px;
        margin-top:3px;
      }


      .m980-logged-row button{
        width:30px;
        height:30px;
        border-radius:50%;
        border:
          1px solid
          #333;
        background:#171717;
        color:#aaa;
        font-size:19px;
        cursor:pointer;
      }


      .m980-meal-options{
        display:grid;
        grid-template-columns:
          1fr 1fr;
        gap:8px;
      }


      .m980-option{
        min-height:96px;
        border:
          1px solid
          #303030;
        background:#141414;
        color:#fff;
        border-radius:15px;
        padding:12px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        text-align:left;
        cursor:pointer;
      }


      .m980-option:hover{
        border-color:#665924;
        background:#17160f;
      }


      .m980-option-copy strong{
        display:block;
        font-size:13px;
      }


      .m980-option-copy small{
        display:block;
        margin-top:4px;
        color:#858585;
        font-size:10px;
        line-height:1.35;
      }


      .m980-option-copy em{
        display:block;
        margin-top:7px;
        color:#e2ca70;
        font-size:10px;
        font-style:normal;
        font-weight:850;
      }


      .m980-plus{
        font-size:22px;
        color:#e7c95b;
      }


      .m980-chat{
        padding:18px;
      }


      .m980-chat-row{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:14px;
        margin-top:8px;
      }


      .m980-chat-row strong{
        display:block;
        font-size:16px;
      }


      .m980-chat-row span{
        display:block;
        margin-top:4px;
        color:#8d8d8d;
        font-size:12px;
      }


      #m980CoachChat{
        border:
          1px solid
          #625624;
        background:#18160d;
        color:#f3d875;
        border-radius:999px;
        padding:11px 15px;
        font-weight:900;
        font-size:12px;
        white-space:nowrap;
        cursor:pointer;
      }


      @media(
        max-width:620px
      ){

        #${ROOT_ID}{
          width:100%;
          max-width:none;
          padding:
            2px
            0
            94px;
        }


        .m980-hero{
          padding:
            7px
            2px
            18px;
        }


        .m980-section,
        .m980-chat{
          border-radius:19px;
          margin-bottom:11px;
        }


        .m980-banner{
          min-height:84px;
          padding:
            15px
            14px;
        }


        .m980-icon{
          width:42px;
          height:42px;
          flex-basis:42px;
          border-radius:13px;
        }


        .m980-banner strong{
          font-size:16px;
        }


        .m980-banner small{
          font-size:11px;
        }


        .m980-panel-body{
          padding:
            4px
            14px
            15px;
        }


        .m980-meal-options{
          grid-template-columns:
            1fr;
        }


        .m980-option{
          min-height:82px;
        }


        .m980-chat{
          padding:
            16px
            14px;
        }

      }

    `;


    document.head.appendChild(
      style
    );

  }


  /* =========================================
     RENDER
     ========================================= */

  function render() {

    if (
      !fuelOpen()
    ) {

      return false;

    }


    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (
      !holder
    ) {

      return false;

    }


    injectStyles();


    holder.innerHTML =
      pageHtml();


    return true;

  }


  function scheduleTakeover(
    delay = 90
  ) {

    clearTimeout(
      takeoverTimer
    );


    takeoverTimer =
      setTimeout(
        () => {

          if (
            fuelOpen()
          ) {

            render();

          }

        },
        delay
      );

  }


  /* =========================================
     MEAL ACTIONS
     ========================================= */

  function addMeal(
    mealKey,
    index
  ) {

    const option =
      MEAL_OPTIONS[
        mealKey
      ]
        ?.[
          index
        ];


    if (
      !option
    ) {

      return;

    }


    const day =
      todayData();


    day
      .meals[
        mealKey
      ]
      .push({

        ...option,

        id:
          `m980-${
            Date.now()
          }-${
            Math
              .random()
              .toString(
                36
              )
              .slice(
                2,
                7
              )
          }`,

        addedAt:
          new Date()
            .toISOString(),

        source:
          "mana-v980-shared-fuel"

      });


    writeToday(
      day
    );


    render();

  }


  function removeMeal(
    mealKey,
    index
  ) {

    const day =
      todayData();


    if (
      !Array.isArray(
        day.meals[
          mealKey
        ]
      )
    ) {

      return;

    }


    day
      .meals[
        mealKey
      ]
      .splice(
        index,
        1
      );


    writeToday(
      day
    );


    render();

  }


  /* =========================================
     WATER
     ========================================= */

  function changeWater(
    delta
  ) {

    const day =
      todayData();


    day.water =
      Math.max(
        0,

        (
          Number(
            day.water
          ) || 0
        ) +

        delta
      );


    writeToday(
      day
    );


    render();

  }


  /* =========================================
     COACH CHAT
     ========================================= */

  function openCoachChat() {

    const candidates = [

      "openManaCoachChat",

      "openManaChat",

      "openCoachChat",

      "showCoachChat"

    ];


    for (
      const name
      of candidates
    ) {

      if (
        typeof
          window[
            name
          ] ===
        "function"
      ) {

        try {

          window[
            name
          ]();

          return;

        } catch (_) {}

      }

    }


    window.dispatchEvent(

      new CustomEvent(

        "mana:open-coach-chat",

        {

          detail: {

            source:
              "fuel",

            program:
              programName()

          }

        }

      )

    );


    try {

      if (
        typeof
          window
            .refreshManaStrengthChat ===
        "function"
      ) {

        window
          .refreshManaStrengthChat();


        document
          .querySelector(
            `
              [data-mana-chat],
              #manaStrengthChat,
              .mana-strength-chat
            `
          )
          ?.scrollIntoView({

            behavior:
              "smooth",

            block:
              "center"

          });

      }

    } catch (_) {}

  }


  /* =========================================
     CLICKS
     ========================================= */

  function handleClick(
    event
  ) {

    if (
      !fuelOpen()
    ) {

      return;

    }


    const panel =
      event.target.closest(
        "[data-m980-panel]"
      );


    if (
      panel
    ) {

      openPanel =
        openPanel ===
          panel
            .dataset
            .m980Panel

          ? ""

          : panel
              .dataset
              .m980Panel;


      if (
        openPanel !==
        "meals"
      ) {

        openMeal =
          "";

      }


      render();

      return;

    }


    const meal =
      event.target.closest(
        "[data-m980-meal]"
      );


    if (
      meal
    ) {

      openMeal =
        openMeal ===
          meal
            .dataset
            .m980Meal

          ? ""

          : meal
              .dataset
              .m980Meal;


      render();

      return;

    }


    const add =
      event.target.closest(
        "[data-m980-add]"
      );


    if (
      add
    ) {

      const [
        mealKey,
        index
      ] =
        add
          .dataset
          .m980Add
          .split(
            ":"
          );


      addMeal(
        mealKey,
        Number(
          index
        )
      );

      return;

    }


    const remove =
      event.target.closest(
        "[data-m980-remove]"
      );


    if (
      remove
    ) {

      const [
        mealKey,
        index
      ] =
        remove
          .dataset
          .m980Remove
          .split(
            ":"
          );


      removeMeal(
        mealKey,
        Number(
          index
        )
      );

      return;

    }


    const water =
      event.target.closest(
        "[data-m980-water]"
      );


    if (
      water
    ) {

      changeWater(
        Number(
          water
            .dataset
            .m980Water
        ) || 0
      );

      return;

    }


    const recovery =
      event.target.closest(
        "[data-m980-recovery]"
      );


    if (
      recovery
    ) {

      saveRecovery(
        recovery
          .dataset
          .m980Recovery
      );


      render();

      return;

    }


    if (
      event.target.closest(
        "#m980CoachChat"
      )
    ) {

      openCoachChat();

    }

  }


  /* =========================================
     EVENTS
     ========================================= */

  function watch() {

    document
      .addEventListener(
        "click",
        handleClick
      );


    window
      .addEventListener(

        "mana:program-tab-change",

        () => {

          /*
            Older MANA 28 Fuel renderer
            may paint just after this event.

            This bounded delayed render
            takes ownership after that.
          */

          scheduleTakeover(
            120
          );

        }

      );


    window
      .addEventListener(

        "mana:fuel-updated",

        () => {

          if (
            fuelOpen()
          ) {

            scheduleTakeover(
              90
            );

          }

        }

      );


    window
      .addEventListener(

        "mana:recovery-updated",

        () => {

          if (
            fuelOpen()
          ) {

            scheduleTakeover(
              90
            );

          }

        }

      );


    window
      .addEventListener(

        "storage",

        event => {

          if (
            fuelOpen() &&

            [
              FUEL_KEY,
              TARGET_KEY,
              DAILY_KEY
            ]
              .includes(
                event.key
              )
          ) {

            scheduleTakeover(
              90
            );

          }

        }

      );


    document
      .addEventListener(

        "visibilitychange",

        () => {

          if (
            document
              .visibilityState ===
                "visible" &&

            fuelOpen()
          ) {

            scheduleTakeover(
              120
            );

          }

        }

      );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    injectStyles();

    watch();


    /*
      MANA STRENGTH compatibility.

      Existing shell already calls:

      window.renderManaStrengthFuel()

      Point that directly to this new
      shared Fuel renderer.
    */

    window
      .renderManaStrengthFuel =
        render;


    /*
      Shared renderer names for any
      future modules.
    */

    window
      .renderManaSharedFuel =
        render;


    window
      .refreshManaSharedFuel =
        render;


    window
      .MANA_SHARED_FUEL_BUILD =
        BUILD;


    if (
      fuelOpen()
    ) {

      scheduleTakeover(
        140
      );

    }

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document
      .addEventListener(
        "DOMContentLoaded",
        init
      );

  } else {

    init();

  }

})();
