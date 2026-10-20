/* =========================================
   MANA MOVEMENT TRAINING v10.15.1
   PREMIUM FUEL — SIZE + MOBILE POLISH

   BUILD: 101510

   PAGE ORDER
   1. Add a Meal
   2. Today's Meals
   3. Daily Targets

   LOGIC
   - Calories + Protein = automatic from meals
   - Water = manual
   - Recovery = manual
   - Selected meals remain visual
   - Premium meal option modal
   - Strength + Mana 28
   ========================================= */

(() => {
  "use strict";

  const BUILD = "101510";
  const ROOT_ID = "manaV1015Fuel";
  const STYLE_ID = "mana-v10151-fuel-style";

  const FUEL_KEY = "mana-fuel-v571";
  const TARGET_KEY = "mana-fuel-v58-targets";
  const DAILY_KEY = "mana-strength-v866-daily";

  const ASSET_ROOT = "ui/";

  let openMeal = "";
  let observer = null;
  let renderTimer = null;


  /* =========================================
     CATEGORY DATA
     ========================================= */

  const CATEGORY = {

    Breakfast: {
      label: "Breakfast",
      sub: "Fuel your morning",
      image: "fuel-breakfast.png"
    },

    Lunch: {
      label: "Lunch",
      sub: "Keep your energy up",
      image: "fuel-lunch.png"
    },

    Dinner: {
      label: "Dinner",
      sub: "Rebuild and recover",
      image: "fuel-dinner.png"
    },

    Snacks: {
      label: "Snacks",
      sub: "Smart options anytime",
      image: "fuel-snack.png"
    }

  };


  /* =========================================
     MEAL OPTIONS
     ========================================= */

  const MEAL_OPTIONS = {

    Breakfast: [

      {
        name: "Eggs + toast",
        detail: "3 eggs • wholegrain toast • fruit",
        calories: 430,
        protein: 28,
        image: "fuel-breakfast.png"
      },

      {
        name: "Greek yoghurt bowl",
        detail: "Greek yoghurt • berries • oats • honey",
        calories: 390,
        protein: 30,
        image: "fuel-breakfast.png"
      },

      {
        name: "Protein oats",
        detail: "Oats • protein • banana • milk",
        calories: 470,
        protein: 35,
        image: "fuel-breakfast.png"
      },

      {
        name: "Breakfast wrap",
        detail: "Egg • lean bacon • spinach • wrap",
        calories: 450,
        protein: 31,
        image: "fuel-breakfast.png"
      }

    ],


    Lunch: [

      {
        name: "Chicken rice bowl",
        detail: "Chicken • rice • vegetables • light sauce",
        calories: 560,
        protein: 46,
        image: "fuel-lunch.png"
      },

      {
        name: "Tuna wrap",
        detail: "Tuna • wrap • salad • light mayo",
        calories: 430,
        protein: 38,
        image: "fuel-lunch.png"
      },

      {
        name: "Beef + sweet potato",
        detail: "Lean beef • sweet potato • greens",
        calories: 540,
        protein: 42,
        image: "fuel-lunch.png"
      },

      {
        name: "Chicken salad",
        detail: "Chicken • mixed salad • avocado • dressing",
        calories: 450,
        protein: 43,
        image: "fuel-lunch.png"
      }

    ],


    Dinner: [

      {
        name: "Lean beef + rice",
        detail: "Lean beef mince • rice • vegetables",
        calories: 620,
        protein: 48,
        image: "fuel-dinner.png"
      },

      {
        name: "Chicken + potato",
        detail: "Chicken • potato • greens",
        calories: 560,
        protein: 50,
        image: "fuel-dinner.png"
      },

      {
        name: "Salmon + rice",
        detail: "Salmon • rice • vegetables",
        calories: 640,
        protein: 42,
        image: "fuel-dinner.png"
      },

      {
        name: "High-protein pasta",
        detail: "Lean mince • pasta • tomato • vegetables",
        calories: 650,
        protein: 47,
        image: "fuel-dinner.png"
      }

    ],


    Snacks: [

      {
        name: "Protein shake",
        detail: "Protein powder • milk or water",
        calories: 180,
        protein: 30,
        image: "fuel-snack.png"
      },

      {
        name: "Yoghurt + fruit",
        detail: "High-protein yoghurt • fruit",
        calories: 220,
        protein: 20,
        image: "fuel-snack.png"
      },

      {
        name: "Tuna + crackers",
        detail: "Tuna • wholegrain crackers",
        calories: 250,
        protein: 26,
        image: "fuel-snack.png"
      },

      {
        name: "Cottage cheese bowl",
        detail: "Cottage cheese • fruit • cinnamon",
        calories: 230,
        protein: 25,
        image: "fuel-snack.png"
      }

    ]

  };


  /* =========================================
     HELPERS
     ========================================= */

  function asset(file) {
    return ASSET_ROOT + file + "?v=" + BUILD;
  }


  function safeJson(raw, fallback = {}) {
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


  function clamp(value, min, max) {
    return Math.max(
      min,
      Math.min(
        max,
        Number(value) || 0
      )
    );
  }


  function todayKey() {
    const d = new Date();

    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0")
    ].join("-");
  }


  /* =========================================
     ACTIVE FUEL SCREEN
     ========================================= */

  function programName() {
    return String(
      document
        .getElementById("manaV83Title")
        ?.textContent || ""
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
        '#manaV83Tabs .mana-v83-tab.active[data-v83-tab="fuel"]'
      );

    const title =
      programName();

    return Boolean(
      shell?.classList.contains("open") &&
      tab &&
      (
        title === "MANA STRENGTH" ||
        title === "MANA 28"
      )
    );
  }


  /* =========================================
     STORAGE
     ========================================= */

  function loadFuel() {
    const value =
      safeJson(
        localStorage.getItem(FUEL_KEY) || "{}"
      );

    return (
      value &&
      typeof value === "object"
    )
      ? value
      : {};
  }


  function saveFuel(store) {
    localStorage.setItem(
      FUEL_KEY,
      JSON.stringify(store)
    );

    window.dispatchEvent(
      new CustomEvent(
        "mana:fuel-updated"
      )
    );
  }


  function todayData() {
    const store =
      loadFuel();

    const key =
      todayKey();

    const day =
      store[key] &&
      typeof store[key] === "object"
        ? store[key]
        : {
            meals: {},
            water: 0
          };

    day.meals =
      day.meals &&
      typeof day.meals === "object"
        ? day.meals
        : {};

    [
      "Breakfast",
      "Lunch",
      "Dinner",
      "Snacks"
    ].forEach(
      meal => {

        if (
          !Array.isArray(
            day.meals[meal]
          )
        ) {

          day.meals[meal] = [];

        }

      }
    );

    day.water =
      Math.max(
        0,
        Number(day.water) || 0
      );

    return day;
  }


  function writeToday(day) {
    const store =
      loadFuel();

    store[
      todayKey()
    ] = day;

    saveFuel(store);
  }


  /* =========================================
     TARGETS
     ========================================= */

  function loadTargets() {
    const data =
      safeJson(
        localStorage.getItem(
          TARGET_KEY
        ) || "{}"
      );

    return {

      calories:
        Math.max(
          0,
          Number(data.calories) || 2050
        ),

      protein:
        Math.max(
          0,
          Number(data.protein) || 120
        ),

      water:
        Math.max(
          0,
          Number(data.water) || 2300
        )

    };
  }


  function totals() {
    const day =
      todayData();

    const result = {
      calories: 0,
      protein: 0,
      water: day.water
    };

    Object
      .values(day.meals)
      .forEach(
        items => {

          (items || [])
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

  function recoveryScore() {
    const store =
      safeJson(
        localStorage.getItem(
          DAILY_KEY
        ) || "{}"
      );

    const day =
      store[todayKey()] || {};

    if (
      Number.isFinite(
        Number(day.recoveryScore)
      )
    ) {

      return clamp(
        day.recoveryScore,
        0,
        10
      );

    }

    const raw =
      String(
        day.recoveryLevel ||
        day.recovery ||
        ""
      ).toLowerCase();

    if (
      raw === "good" ||
      raw === "true"
    ) {

      return 8;

    }

    if (
      raw === "moderate"
    ) {

      return 5;

    }

    if (
      raw === "needs-attention" ||
      raw === "low"
    ) {

      return 3;

    }

    return 0;
  }


  function saveRecoveryScore(score) {
    const store =
      safeJson(
        localStorage.getItem(
          DAILY_KEY
        ) || "{}"
      );

    const key =
      todayKey();

    const day =
      store[key] &&
      typeof store[key] === "object"
        ? store[key]
        : {};

    const value =
      clamp(
        score,
        0,
        10
      );

    day.recoveryScore =
      value;

    if (
      value >= 7
    ) {

      day.recoveryLevel =
        "good";

      day.recovery =
        true;

    } else if (
      value >= 4
    ) {

      day.recoveryLevel =
        "moderate";

      day.recovery =
        false;

    } else if (
      value > 0
    ) {

      day.recoveryLevel =
        "needs-attention";

      day.recovery =
        false;

    } else {

      day.recoveryLevel =
        "";

      day.recovery =
        false;

    }

    store[key] =
      day;

    localStorage.setItem(
      DAILY_KEY,
      JSON.stringify(store)
    );

    window.dispatchEvent(
      new CustomEvent(
        "mana:recovery-updated"
      )
    );
  }


  function percent(value, target) {
    if (!target) {
      return 0;
    }

    return clamp(
      Math.round(
        (
          Number(value) /
          Number(target)
        ) * 100
      ),
      0,
      100
    );
  }


  /* =========================================
     TARGET ICONS
     ========================================= */

  function iconSvg(type) {

    if (
      type === "calories"
    ) {

      return `
        <svg viewBox="0 0 48 48">
          <path
            fill="currentColor"
            d="
              M27 3
              c2 8-5 10-2 17
              2 4 6 4 7 9
              1 6-3 12-9 13
              -8 2-16-4-16-13
              0-8 6-12 11-18
              0 6 3 8 5 9
              -1-8 5-11 4-17Z
            "
          />
        </svg>
      `;

    }


    if (
      type === "protein"
    ) {

      return `
        <svg viewBox="0 0 48 48">

          <rect
            x="17"
            y="20"
            width="14"
            height="8"
            rx="3"
            fill="currentColor"
          />

          <rect
            x="9"
            y="14"
            width="6"
            height="20"
            rx="2"
            fill="currentColor"
          />

          <rect
            x="33"
            y="14"
            width="6"
            height="20"
            rx="2"
            fill="currentColor"
          />

          <rect
            x="4"
            y="18"
            width="4"
            height="12"
            rx="2"
            fill="currentColor"
          />

          <rect
            x="40"
            y="18"
            width="4"
            height="12"
            rx="2"
            fill="currentColor"
          />

        </svg>
      `;

    }


    if (
      type === "water"
    ) {

      return `
        <svg viewBox="0 0 48 48">
          <path
            fill="currentColor"
            d="
              M24 4
              S10 20 10 30
              a14 14 0 0 0 28 0
              C38 20 24 4 24 4Z
            "
          />
        </svg>
      `;

    }


    return `
      <svg viewBox="0 0 48 48">
        <path
          fill="currentColor"
          d="
            M34 35
            A16 16 0 0 1 19 9
            a17 17 0 1 0 15 26Z
          "
        />
      </svg>
    `;

  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {
    document
      .getElementById(
        STYLE_ID
      )
      ?.remove();

    const style =
      document.createElement(
        "style"
      );

    style.id =
      STYLE_ID;

    style.textContent = `

      #${ROOT_ID}{
        display:grid;
        gap:14px;
        width:100%;
        color:#f6f6f6;
      }

      #${ROOT_ID} *{
        box-sizing:border-box;
      }


      /* =====================================
         HERO
         ===================================== */

      .m1015-hero{
        padding:0 2px 3px;
      }

      .m1015-kicker{
        color:#f3d875;
        font-size:9px;
        font-weight:950;
        letter-spacing:.14em;
        text-transform:uppercase;
      }

      .m1015-hero h2{
        margin:4px 0 4px;
        font-size:25px;
        line-height:1.05;
      }

      .m1015-hero p,
      .m1015-section-head p{
        margin:0;
        color:#919191;
        font-size:11px;
        line-height:1.4;
      }


      /* =====================================
         SECTION
         ===================================== */

      .m1015-card{
        border:1px solid #2d2d2d;
        border-radius:20px;
        background:
          linear-gradient(
            145deg,
            #11110f,
            #090909
          );
      }

      .m1015-section{
        padding:15px;
      }

      .m1015-section-head{
        margin-bottom:11px;
      }

      .m1015-section-head h3{
        margin:0 0 3px;
        font-size:17px;
      }


      /* =====================================
         ADD A MEAL — DESKTOP
         ===================================== */

      .m1015-category-grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:9px;
      }

      .m1015-category{
        position:relative;
        min-height:138px;
        overflow:hidden;
        padding:0;
        border:1px solid
          rgba(219,174,56,.48);
        border-radius:16px;
        background:#090909;
        color:#fff;
        text-align:left;
        cursor:pointer;
      }

      .m1015-category img{
        display:block;
        width:100%;
        height:82px;
        object-fit:cover;
        object-position:center;
      }

      .m1015-category-copy{
        position:relative;
        display:block;
        min-height:54px;
        padding:
          8px
          34px
          8px
          10px;
      }

      .m1015-category-copy strong{
        display:block;
        color:#f3d875;
        font-size:14px;
        line-height:1.15;
      }

      .m1015-category-copy small{
        display:block;
        margin-top:3px;
        color:#888;
        font-size:9px;
      }

      .m1015-category-arrow{
        position:absolute;
        right:11px;
        bottom:17px;
        color:#f3d875;
        font-size:22px;
        line-height:1;
      }


      /* =====================================
         TODAY'S MEALS
         ===================================== */

      .m1015-today-list{
        display:grid;
        gap:9px;
      }

      .m1015-empty{
        display:grid;
        place-items:center;
        min-height:130px;
        padding:20px;
        border:1px dashed #323232;
        border-radius:16px;
        color:#777;
        text-align:center;
      }

      .m1015-empty strong{
        display:block;
        margin-top:7px;
        color:#ccc;
      }

      .m1015-empty-icon{
        font-size:30px;
        opacity:.55;
      }

      .m1015-logged{
        display:grid;
        grid-template-columns:
          118px
          minmax(0,1fr)
          34px;
        gap:11px;
        align-items:center;
        min-height:108px;
        padding:9px;
        border:1px solid #303030;
        border-radius:16px;
        background:#0d0d0d;
      }

      .m1015-logged img{
        width:118px;
        height:90px;
        object-fit:cover;
        border:1px solid
          rgba(219,174,56,.35);
        border-radius:13px;
      }

      .m1015-logged-meta{
        min-width:0;
      }

      .m1015-meal-chip{
        display:inline-flex;
        margin-bottom:4px;
        padding:3px 6px;
        border-radius:999px;
        background:#f3d875;
        color:#111;
        font-size:7px;
        font-weight:950;
        text-transform:uppercase;
      }

      .m1015-logged h4{
        margin:0;
        font-size:14px;
        line-height:1.2;
      }

      .m1015-logged p{
        margin:3px 0 6px;
        color:#878787;
        font-size:9px;
        line-height:1.35;
      }

      .m1015-macros{
        display:flex;
        flex-wrap:wrap;
        gap:6px;
      }

      .m1015-macro{
        padding:4px 6px;
        border:1px solid #38311d;
        border-radius:7px;
        color:#f3d875;
        font-size:9px;
        font-weight:900;
      }

      .m1015-remove{
        width:32px;
        height:32px;
        border:1px solid #3a2525;
        border-radius:9px;
        background:#171010;
        color:#ff7777;
        font-size:16px;
      }


      /* =====================================
         TARGETS
         ===================================== */

      .m1015-target-grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:9px;
      }

      .m1015-target{
        padding:11px;
        border:1px solid #36311f;
        border-radius:15px;
        background:#0c0c0b;
      }

      .m1015-target-top{
        display:flex;
        gap:8px;
        align-items:center;
      }

      .m1015-target-icon{
        display:grid;
        place-items:center;
        width:36px;
        height:36px;
        flex:0 0 36px;
        border-radius:11px;
        background:#151515;
      }

      .m1015-target-icon svg{
        width:25px;
        height:25px;
      }

      .m1015-target.calories
      .m1015-target-icon{
        color:#ff9848;
      }

      .m1015-target.protein
      .m1015-target-icon{
        color:#f3d875;
      }

      .m1015-target.water
      .m1015-target-icon{
        color:#42b8ff;
      }

      .m1015-target.recovery
      .m1015-target-icon{
        color:#a77bff;
      }

      .m1015-target-label{
        color:#999;
        font-size:8px;
        font-weight:800;
        text-transform:uppercase;
      }

      .m1015-target-value{
        margin-top:2px;
        font-size:15px;
        font-weight:950;
      }

      .m1015-bar{
        height:6px;
        margin-top:9px;
        overflow:hidden;
        border-radius:999px;
        background:#252525;
      }

      .m1015-bar span{
        display:block;
        height:100%;
        border-radius:inherit;
        background:
          linear-gradient(
            90deg,
            #bd8c25,
            #f3d875
          );
      }

      .m1015-target.water
      .m1015-bar span{
        background:
          linear-gradient(
            90deg,
            #178fe3,
            #5bc4ff
          );
      }

      .m1015-target.recovery
      .m1015-bar span{
        background:
          linear-gradient(
            90deg,
            #764fd6,
            #ae83ff
          );
      }

      .m1015-control-row{
        display:flex;
        gap:5px;
        margin-top:8px;
      }

      .m1015-control-row button{
        flex:1;
        min-height:29px;
        padding:5px;
        border:1px solid #363636;
        border-radius:8px;
        background:#131313;
        color:#f3d875;
        font-size:9px;
        font-weight:900;
      }


      /* =====================================
         MODAL
         ===================================== */

      .m1015-modal-backdrop{
        position:fixed;
        inset:0;
        z-index:22000;
        display:flex;
        align-items:flex-end;
        justify-content:center;
        padding:14px;
        background:rgba(0,0,0,.84);
        backdrop-filter:blur(8px);
      }

      .m1015-modal{
        width:min(650px,100%);
        max-height:calc(100dvh - 30px);
        overflow:auto;
        padding:16px;
        border:1px solid
          rgba(219,174,56,.42);
        border-radius:22px;
        background:#0b0b0b;
      }

      .m1015-modal-head{
        display:flex;
        justify-content:space-between;
        gap:12px;
        margin-bottom:12px;
      }

      .m1015-modal-head h3{
        margin:3px 0 2px;
        font-size:22px;
      }

      .m1015-close{
        width:36px;
        height:36px;
        border:1px solid #353535;
        border-radius:50%;
        background:#151515;
        color:#fff;
        font-size:19px;
      }

      .m1015-options{
        display:grid;
        gap:9px;
      }

      .m1015-option{
        display:grid;
        grid-template-columns:
          96px
          minmax(0,1fr)
          auto;
        gap:10px;
        align-items:center;
        min-height:94px;
        padding:7px 9px 7px 7px;
        border:1px solid #303030;
        border-radius:15px;
        background:#10100f;
      }

      .m1015-option img{
        width:96px;
        height:78px;
        object-fit:cover;
        border-radius:11px;
      }

      .m1015-option h4{
        margin:0;
        font-size:13px;
      }

      .m1015-option p{
        margin:3px 0 6px;
        color:#888;
        font-size:9px;
        line-height:1.3;
      }

      .m1015-option-macros{
        color:#f3d875;
        font-size:9px;
        font-weight:900;
      }

      .m1015-add{
        min-width:54px;
        height:35px;
        padding:0 10px;
        border:0;
        border-radius:999px;
        background:#f3d875;
        color:#111;
        font-size:10px;
        font-weight:950;
      }

      .m1015-custom{
        margin-top:10px;
        padding:11px;
        border:1px solid #303030;
        border-radius:14px;
        background:#0f0f0f;
      }

      .m1015-custom h4{
        margin:0 0 8px;
      }

      .m1015-custom-grid{
        display:grid;
        grid-template-columns:
          1.4fr
          .7fr
          .7fr;
        gap:7px;
      }

      .m1015-custom input{
        width:100%;
        min-height:38px;
        padding:8px 9px;
        border:1px solid #333;
        border-radius:9px;
        background:#080808;
        color:#fff;
      }

      .m1015-custom
      .m1015-add{
        margin-top:8px;
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:600px){

        #${ROOT_ID}{
          gap:12px;
        }

        .m1015-hero h2{
          font-size:23px;
        }

        .m1015-section{
          padding:13px;
        }


        /*
          PHONE:
          single-column horizontal category cards
        */

        .m1015-category-grid{
          grid-template-columns:1fr;
          gap:8px;
        }

        .m1015-category{
          display:grid;
          grid-template-columns:
            118px
            minmax(0,1fr);
          min-height:102px;
        }

        .m1015-category img{
          width:118px;
          height:100%;
          min-height:100px;
          object-fit:cover;
        }

        .m1015-category-copy{
          display:flex;
          flex-direction:column;
          justify-content:center;
          min-height:100px;
          padding:
            12px
            38px
            12px
            13px;
        }

        .m1015-category-copy strong{
          font-size:15px;
        }

        .m1015-category-copy small{
          margin-top:4px;
          font-size:10px;
        }

        .m1015-category-arrow{
          right:13px;
          bottom:auto;
          top:50%;
          transform:translateY(-50%);
        }


        /* LOGGED */

        .m1015-logged{
          grid-template-columns:
            102px
            minmax(0,1fr)
            32px;
          gap:9px;
          min-height:100px;
          padding:8px;
        }

        .m1015-logged img{
          width:102px;
          height:84px;
        }


        /* TARGETS */

        .m1015-target{
          padding:10px;
        }

        .m1015-target-icon{
          width:33px;
          height:33px;
          flex-basis:33px;
        }

        .m1015-target-icon svg{
          width:22px;
          height:22px;
        }

        .m1015-target-value{
          font-size:14px;
        }


        /* MODAL */

        .m1015-modal-backdrop{
          padding:8px;
        }

        .m1015-modal{
          padding:13px;
          border-radius:20px;
        }

        .m1015-option{
          grid-template-columns:
            84px
            minmax(0,1fr)
            auto;
          gap:8px;
        }

        .m1015-option img{
          width:84px;
          height:70px;
        }

        .m1015-custom-grid{
          grid-template-columns:1fr 1fr;
        }

        .m1015-custom-grid
        input:first-child{
          grid-column:1 / -1;
        }

      }


      @media(max-width:390px){

        .m1015-category{
          grid-template-columns:
            106px
            minmax(0,1fr);
        }

        .m1015-category img{
          width:106px;
        }

        .m1015-category-copy{
          padding-left:11px;
        }

        .m1015-logged{
          grid-template-columns:
            88px
            minmax(0,1fr)
            30px;
        }

        .m1015-logged img{
          width:88px;
          height:76px;
        }

        .m1015-target-grid{
          gap:7px;
        }

        .m1015-target{
          padding:8px;
        }

        .m1015-target-top{
          gap:6px;
        }

        .m1015-target-value{
          font-size:13px;
        }

        .m1015-control-row{
          gap:3px;
        }

        .m1015-control-row button{
          font-size:8px;
        }

        .m1015-option{
          grid-template-columns:
            72px
            minmax(0,1fr);
        }

        .m1015-option img{
          width:72px;
          height:66px;
        }

        .m1015-option
        .m1015-add{
          grid-column:1 / -1;
          width:100%;
        }

      }

    `;

    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     CATEGORY CARD
     ========================================= */

  function mealCategoryHtml(key) {
    const item =
      CATEGORY[key];

    return `

      <button
        type="button"
        class="m1015-category"
        data-m1015-open="${key}"
      >

        <img
          src="${asset(item.image)}"
          alt=""
          aria-hidden="true"
        >

        <span
          class="m1015-category-copy"
        >

          <strong>
            ${esc(item.label)}
          </strong>

          <small>
            ${esc(item.sub)}
          </small>

        </span>

        <span
          class="m1015-category-arrow"
        >
          ›
        </span>

      </button>

    `;
  }


  /* =========================================
     TODAY'S MEALS
     ========================================= */

  function loggedMealsHtml() {
    const day =
      todayData();

    const cards = [];

    [
      "Breakfast",
      "Lunch",
      "Dinner",
      "Snacks"
    ].forEach(
      mealKey => {

        (
          day.meals[mealKey] ||
          []
        ).forEach(
          (item, index) => {

            const image =
              item.image ||
              CATEGORY[mealKey].image;

            cards.push(`

              <article
                class="m1015-logged"
              >

                <img
                  src="${asset(image)}"
                  alt=""
                >

                <div
                  class="m1015-logged-meta"
                >

                  <span
                    class="m1015-meal-chip"
                  >
                    ${esc(
                      CATEGORY[mealKey].label
                    )}
                  </span>

                  <h4>
                    ${esc(
                      item.name ||
                      CATEGORY[mealKey].label
                    )}
                  </h4>

                  <p>
                    ${esc(
                      item.detail ||
                      "Logged meal"
                    )}
                  </p>

                  <div
                    class="m1015-macros"
                  >

                    <span
                      class="m1015-macro"
                    >
                      ${
                        Number(
                          item.calories
                        ) || 0
                      } cal
                    </span>

                    <span
                      class="m1015-macro"
                    >
                      ${
                        Number(
                          item.protein
                        ) || 0
                      }g protein
                    </span>

                  </div>

                </div>

                <button
                  type="button"
                  class="m1015-remove"
                  data-m1015-remove="${mealKey}:${index}"
                  aria-label="Remove meal"
                >
                  ×
                </button>

              </article>

            `);

          }
        );

      }
    );

    if (
      !cards.length
    ) {

      return `

        <div
          class="m1015-empty"
        >

          <div>

            <div
              class="m1015-empty-icon"
            >
              ◌
            </div>

            <strong>
              No meals added yet
            </strong>

            <div>
              Tap a meal above to get started.
            </div>

          </div>

        </div>

      `;

    }

    return `

      <div
        class="m1015-today-list"
      >
        ${cards.join("")}
      </div>

    `;
  }


  /* =========================================
     TARGET CARD
     ========================================= */

  function targetTile(
    type,
    label,
    value,
    target,
    suffix = "",
    controls = ""
  ) {

    const percentage =
      percent(
        value,
        target
      );

    return `

      <div
        class="m1015-target ${type}"
      >

        <div
          class="m1015-target-top"
        >

          <div
            class="m1015-target-icon"
          >
            ${iconSvg(type)}
          </div>

          <div>

            <div
              class="m1015-target-label"
            >
              ${esc(label)}
            </div>

            <div
              class="m1015-target-value"
            >

              ${esc(value)}
              ${esc(suffix)}

              <span
                style="
                  color:#777;
                  font-size:9px;
                  font-weight:700
                "
              >
                / ${esc(target)}
                ${esc(suffix)}
              </span>

            </div>

          </div>

        </div>

        <div
          class="m1015-bar"
        >
          <span
            style="
              width:${percentage}%
            "
          ></span>
        </div>

        ${controls}

      </div>

    `;
  }


  function targetsHtml() {
    const current =
      totals();

    const target =
      loadTargets();

    const recovery =
      recoveryScore();

    return `

      <div
        class="m1015-target-grid"
      >

        ${targetTile(
          "calories",
          "Calories",
          current.calories,
          target.calories
        )}

        ${targetTile(
          "protein",
          "Protein",
          current.protein,
          target.protein,
          "g"
        )}

        ${targetTile(
          "water",
          "Water",
          current.water,
          target.water,
          "ml",
          `
            <div
              class="m1015-control-row"
            >

              <button
                type="button"
                data-m1015-water="-250"
              >
                −250
              </button>

              <button
                type="button"
                data-m1015-water="250"
              >
                +250
              </button>

              <button
                type="button"
                data-m1015-water="500"
              >
                +500
              </button>

            </div>
          `
        )}

        ${targetTile(
          "recovery",
          "Recovery",
          recovery,
          10,
          "",
          `
            <div
              class="m1015-control-row"
            >

              <button
                type="button"
                data-m1015-recovery="-1"
              >
                −
              </button>

              <button
                type="button"
                data-m1015-recovery="1"
              >
                +
              </button>

            </div>
          `
        )}

      </div>

    `;
  }


  /* =========================================
     MEAL OPTION
     ========================================= */

  function optionHtml(
    mealKey,
    item,
    index
  ) {

    return `

      <article
        class="m1015-option"
      >

        <img
          src="${asset(
            item.image ||
            CATEGORY[mealKey].image
          )}"
          alt=""
        >

        <div>

          <h4>
            ${esc(item.name)}
          </h4>

          <p>
            ${esc(item.detail)}
          </p>

          <div
            class="m1015-option-macros"
          >
            ${item.calories} cal
            •
            ${item.protein}g protein
          </div>

        </div>

        <button
          type="button"
          class="m1015-add"
          data-m1015-add="${mealKey}:${index}"
        >
          ADD
        </button>

      </article>

    `;
  }


  /* =========================================
     MODAL
     ========================================= */

  function modalHtml() {

    if (
      !openMeal ||
      !MEAL_OPTIONS[openMeal]
    ) {

      return "";

    }

    const config =
      CATEGORY[openMeal];

    return `

      <div
        class="m1015-modal-backdrop"
        data-m1015-backdrop
      >

        <div
          class="m1015-modal"
          role="dialog"
          aria-modal="true"
        >

          <div
            class="m1015-modal-head"
          >

            <div>

              <div
                class="m1015-kicker"
              >
                MANA FUEL
              </div>

              <h3>
                ${esc(config.label)}
              </h3>

              <p
                style="
                  margin:0;
                  color:#8f8f8f;
                  font-size:10px
                "
              >
                Choose a meal to add to today.
              </p>

            </div>

            <button
              type="button"
              class="m1015-close"
              data-m1015-close
              aria-label="Close"
            >
              ×
            </button>

          </div>

          <div
            class="m1015-options"
          >

            ${
              MEAL_OPTIONS[openMeal]
                .map(
                  (item, index) =>
                    optionHtml(
                      openMeal,
                      item,
                      index
                    )
                )
                .join("")
            }

          </div>

          <div
            class="m1015-custom"
          >

            <h4>
              Add your own
            </h4>

            <div
              class="m1015-custom-grid"
            >

              <input
                id="m1015CustomName"
                type="text"
                placeholder="Meal name"
              >

              <input
                id="m1015CustomCalories"
                type="number"
                min="0"
                placeholder="Calories"
              >

              <input
                id="m1015CustomProtein"
                type="number"
                min="0"
                placeholder="Protein g"
              >

            </div>

            <button
              type="button"
              class="m1015-add"
              data-m1015-custom="${openMeal}"
            >
              ADD CUSTOM
            </button>

          </div>

        </div>

      </div>

    `;
  }


  /* =========================================
     PAGE
     ========================================= */

  function pageHtml() {

    return `

      <div
        id="${ROOT_ID}"
      >

        <header
          class="m1015-hero"
        >

          <div
            class="m1015-kicker"
          >
            MANA FUEL
          </div>

          <h2>
            Fuel with purpose
          </h2>

          <p>
            Choose your meals, see what you've
            logged, then check where you sit
            for the day.
          </p>

        </header>


        <section
          class="
            m1015-card
            m1015-section
          "
        >

          <div
            class="m1015-section-head"
          >

            <h3>
              Add a Meal
            </h3>

            <p>
              Choose a meal category to see
              your options.
            </p>

          </div>

          <div
            class="m1015-category-grid"
          >

            ${mealCategoryHtml("Breakfast")}
            ${mealCategoryHtml("Lunch")}
            ${mealCategoryHtml("Dinner")}
            ${mealCategoryHtml("Snacks")}

          </div>

        </section>


        <section
          class="
            m1015-card
            m1015-section
          "
        >

          <div
            class="m1015-section-head"
          >

            <h3>
              Today's Meals
            </h3>

            <p>
              Your selected meals stay visible
              throughout the day.
            </p>

          </div>

          ${loggedMealsHtml()}

        </section>


        <section
          class="
            m1015-card
            m1015-section
          "
        >

          <div
            class="m1015-section-head"
          >

            <h3>
              Daily Targets
            </h3>

            <p>
              Calories and protein update from
              meals. Water and recovery are manual.
            </p>

          </div>

          ${targetsHtml()}

        </section>

        ${modalHtml()}

      </div>

    `;
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

    if (!holder) {
      return false;
    }

    installStyles();

    holder.innerHTML =
      pageHtml();

    return true;
  }


  function scheduleRender(delay = 0) {

    clearTimeout(
      renderTimer
    );

    renderTimer =
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
     ACTIONS
     ========================================= */

  function addMeal(
    mealKey,
    index
  ) {

    const item =
      MEAL_OPTIONS[
        mealKey
      ]?.[
        index
      ];

    if (!item) {
      return;
    }

    const day =
      todayData();

    day.meals[
      mealKey
    ].push({

      ...item,

      id:
        "m1015-" +
        Date.now(),

      addedAt:
        new Date()
          .toISOString(),

      source:
        "mana-v1015-fuel"

    });

    writeToday(day);

    openMeal = "";

    render();
  }


  function addCustomMeal(
    mealKey
  ) {

    const name =
      document
        .getElementById(
          "m1015CustomName"
        )
        ?.value
        ?.trim();

    const calories =
      Math.max(
        0,
        Number(
          document
            .getElementById(
              "m1015CustomCalories"
            )
            ?.value
        ) || 0
      );

    const protein =
      Math.max(
        0,
        Number(
          document
            .getElementById(
              "m1015CustomProtein"
            )
            ?.value
        ) || 0
      );

    if (
      !name ||
      (
        !calories &&
        !protein
      )
    ) {

      return;

    }

    const day =
      todayData();

    day.meals[
      mealKey
    ].push({

      name,

      detail:
        "Custom meal",

      calories,

      protein,

      image:
        CATEGORY[
          mealKey
        ].image,

      id:
        "m1015-custom-" +
        Date.now(),

      addedAt:
        new Date()
          .toISOString(),

      source:
        "mana-v1015-custom"

    });

    writeToday(day);

    openMeal = "";

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

    day.meals[
      mealKey
    ].splice(
      index,
      1
    );

    writeToday(day);

    render();
  }


  function changeWater(delta) {

    const day =
      todayData();

    day.water =
      Math.max(
        0,
        (
          Number(day.water) || 0
        ) +
        Number(delta || 0)
      );

    writeToday(day);

    render();
  }


  function changeRecovery(
    delta
  ) {

    saveRecoveryScore(
      recoveryScore() +
      Number(delta || 0)
    );

    render();
  }


  /* =========================================
     CLICK HANDLER
     ========================================= */

  function handleClick(event) {

    if (
      !fuelOpen()
    ) {

      return;

    }


    const open =
      event.target.closest(
        "[data-m1015-open]"
      );

    if (open) {

      openMeal =
        open.dataset
          .m1015Open;

      render();

      return;
    }


    if (
      event.target.closest(
        "[data-m1015-close]"
      )
    ) {

      openMeal = "";

      render();

      return;
    }


    const backdrop =
      event.target.closest(
        "[data-m1015-backdrop]"
      );

    if (
      backdrop &&
      event.target === backdrop
    ) {

      openMeal = "";

      render();

      return;
    }


    const add =
      event.target.closest(
        "[data-m1015-add]"
      );

    if (add) {

      const [
        mealKey,
        index
      ] =
        add.dataset
          .m1015Add
          .split(":");

      addMeal(
        mealKey,
        Number(index)
      );

      return;
    }


    const custom =
      event.target.closest(
        "[data-m1015-custom]"
      );

    if (custom) {

      addCustomMeal(
        custom.dataset
          .m1015Custom
      );

      return;
    }


    const remove =
      event.target.closest(
        "[data-m1015-remove]"
      );

    if (remove) {

      const [
        mealKey,
        index
      ] =
        remove.dataset
          .m1015Remove
          .split(":");

      removeMeal(
        mealKey,
        Number(index)
      );

      return;
    }


    const water =
      event.target.closest(
        "[data-m1015-water]"
      );

    if (water) {

      changeWater(
        Number(
          water.dataset
            .m1015Water
        ) || 0
      );

      return;
    }


    const recovery =
      event.target.closest(
        "[data-m1015-recovery]"
      );

    if (recovery) {

      changeRecovery(
        Number(
          recovery.dataset
            .m1015Recovery
        ) || 0
      );

    }
  }


  /* =========================================
     CONTENT GUARD
     ========================================= */

  function connectObserver() {

    observer
      ?.disconnect();

    const holder =
      document.getElementById(
        "manaV83Content"
      );

    if (!holder) {
      return;
    }

    observer =
      new MutationObserver(
        () => {

          if (
            !fuelOpen()
          ) {

            return;

          }

          if (
            !document
              .getElementById(
                ROOT_ID
              )
          ) {

            scheduleRender(0);

          }

        }
      );

    observer.observe(
      holder,
      {
        childList:true,
        subtree:false
      }
    );
  }


  /* =========================================
     EVENTS
     ========================================= */

  function bindEvents() {

    document.addEventListener(
      "click",
      handleClick
    );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="fuel"]'
          )
        ) {

          setTimeout(
            () => {

              render();

              connectObserver();

            },
            0
          );

        }

      },
      true
    );


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        scheduleRender(0);

        setTimeout(
          connectObserver,
          20
        );

      }
    );


    window.addEventListener(
      "mana:fuel-updated",
      () => {

        if (
          fuelOpen() &&
          document.getElementById(
            ROOT_ID
          )
        ) {

          scheduleRender(0);

        }

      }
    );


    window.addEventListener(
      "mana:recovery-updated",
      () => {

        if (
          fuelOpen() &&
          document.getElementById(
            ROOT_ID
          )
        ) {

          scheduleRender(0);

        }

      }
    );


    window.addEventListener(
      "storage",
      event => {

        if (
          fuelOpen() &&
          [
            FUEL_KEY,
            TARGET_KEY,
            DAILY_KEY
          ].includes(
            event.key
          )
        ) {

          scheduleRender(0);

        }

      }
    );
  }


  /* =========================================
     PUBLIC API
     ========================================= */

  function expose() {

    window.renderManaStrengthFuel =
      render;

    window.renderManaSharedFuel =
      render;

    window.refreshManaSharedFuel =
      render;

    window.refreshManaPremiumFuel =
      render;

    window.MANA_PREMIUM_FUEL_BUILD =
      BUILD;
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    expose();

    bindEvents();

    connectObserver();

    if (
      fuelOpen()
    ) {

      render();

    }

    console.log(
      "Mana Premium Fuel",
      BUILD
    );
  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:true
      }
    );

  } else {

    init();

  }

})();
