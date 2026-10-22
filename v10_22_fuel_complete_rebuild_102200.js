/* =========================================
   MANA MOVEMENT TRAINING v10.22
   COMPLETE FUEL REBUILD

   BUILD: 102200

   PROGRAMS
   -----------------------------------------
   - MANA STRENGTH
   - MANA 28

   PURPOSE
   -----------------------------------------
   - One Fuel engine only
   - Native individual meal artwork
   - No illustration overlay scripts
   - No MutationObserver
   - Lightweight phone performance
   - Correct image sizing
   - Existing saved Fuel data retained
   - Calories + Protein automatic
   - Water + Recovery manual
   - Custom meals supported
   ========================================= */

(() => {
  "use strict";


  /* =========================================
     CONFIG
     ========================================= */

  const BUILD =
    "102200";


  /*
    IMPORTANT:
    Keep this old root ID so v10.16
    remains compatible with Fuel.
  */

  const ROOT_ID =
    "manaV1015Fuel";


  const STYLE_ID =
    "mana-v1022-fuel-style";


  const FUEL_KEY =
    "mana-fuel-v571";


  const TARGET_KEY =
    "mana-fuel-v58-targets";


  const DAILY_KEY =
    "mana-strength-v866-daily";


  const ASSET_ROOT =
    "ui/";


  let openMeal =
    "";


  let renderTimer =
    null;


  /* =========================================
     CATEGORY DATA
     ========================================= */

  const CATEGORY = {

    Breakfast: {

      label:
        "Breakfast",

      sub:
        "Fuel your morning",

      image:
        "fuel-breakfast.png"

    },


    Lunch: {

      label:
        "Lunch",

      sub:
        "Keep your energy up",

      image:
        "fuel-lunch.png"

    },


    Dinner: {

      label:
        "Dinner",

      sub:
        "Rebuild and recover",

      image:
        "fuel-dinner.png"

    },


    Snacks: {

      label:
        "Snacks",

      sub:
        "Smart options anytime",

      image:
        "fuel-snack.png"

    }

  };


  /* =========================================
     MEAL OPTIONS

     Individual artwork is now part of
     the actual Fuel data.

     No image replacement script needed.
     ========================================= */

  const MEAL_OPTIONS = {

    Breakfast: [

      {

        name:
          "Eggs + toast",

        detail:
          "3 eggs • wholegrain toast • fruit",

        calories:
          430,

        protein:
          28,

        image:
          "meal-eggs-toast.png"

      },


      {

        name:
          "Greek yoghurt bowl",

        detail:
          "Greek yoghurt • berries • oats • honey",

        calories:
          390,

        protein:
          30,

        image:
          "meal-greek-yoghurt-bowl.png"

      },


      {

        name:
          "Protein oats",

        detail:
          "Oats • protein • banana • milk",

        calories:
          470,

        protein:
          35,

        image:
          "meal-protein-oats.png"

      },


      {

        name:
          "Breakfast wrap",

        detail:
          "Egg • lean bacon • spinach • wrap",

        calories:
          450,

        protein:
          31,

        image:
          "meal-breakfast-wrap.png"

      }

    ],


    Lunch: [

      {

        name:
          "Chicken rice bowl",

        detail:
          "Chicken • rice • vegetables • light sauce",

        calories:
          560,

        protein:
          46,

        image:
          "meal-chicken-rice-bowl.png"

      },


      {

        name:
          "Tuna wrap",

        detail:
          "Tuna • wrap • salad • light mayo",

        calories:
          430,

        protein:
          38,

        image:
          "meal-tuna-wrap.png"

      },


      {

        name:
          "Beef + sweet potato",

        detail:
          "Lean beef • sweet potato • greens",

        calories:
          540,

        protein:
          42,

        image:
          "meal-beef-sweet-potato.png"

      },


      {

        name:
          "Chicken salad",

        detail:
          "Chicken • mixed salad • avocado • dressing",

        calories:
          450,

        protein:
          43,

        image:
          "meal-chicken-salad.png"

      }

    ],


    Dinner: [

      {

        name:
          "Lean beef + rice",

        detail:
          "Lean beef mince • rice • vegetables",

        calories:
          620,

        protein:
          48,

        image:
          "meal-lean-beef-rice.png"

      },


      {

        name:
          "Chicken + potato",

        detail:
          "Chicken • potato • greens",

        calories:
          560,

        protein:
          50,

        image:
          "meal-chicken-potato.png"

      },


      {

        name:
          "Salmon + rice",

        detail:
          "Salmon • rice • vegetables",

        calories:
          640,

        protein:
          42,

        image:
          "meal-salmon-rice.png"

      },


      {

        name:
          "High-protein pasta",

        detail:
          "Lean mince • pasta • tomato • vegetables",

        calories:
          650,

        protein:
          47,

        image:
          "meal-high-protein-pasta.png"

      }

    ],


    Snacks: [

      {

        name:
          "Protein shake",

        detail:
          "Protein powder • milk or water",

        calories:
          180,

        protein:
          30,

        image:
          "meal-protein-shake.png"

      },


      {

        name:
          "Yoghurt + fruit",

        detail:
          "High-protein yoghurt • fruit",

        calories:
          220,

        protein:
          20,

        image:
          "meal-yoghurt-fruit.png"

      },


      {

        name:
          "Tuna + crackers",

        detail:
          "Tuna • wholegrain crackers",

        calories:
          250,

        protein:
          26,

        image:
          "meal-tuna-crackers.png"

      },


      {

        name:
          "Cottage cheese bowl",

        detail:
          "Cottage cheese • fruit • cinnamon",

        calories:
          230,

        protein:
          25,

        image:
          "meal-cottage-cheese-bowl.png"

      }

    ]

  };


  /* =========================================
     HELPERS
     ========================================= */

  function asset(
    file
  ) {

    return (
      ASSET_ROOT +
      file +
      "?v=" +
      BUILD
    );

  }


  function safeJson(
    raw,
    fallback = {}
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
        Number(value) || 0
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

    ].join(
      "-"
    );

  }


  function normalise(
    value
  ) {

    return String(
      value || ""
    )
      .trim()
      .toLowerCase();

  }


  /* =========================================
     ACTIVE PROGRAM
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
        '#manaV83Tabs .mana-v83-tab.active[data-v83-tab="fuel"]'
      );


    const title =
      programName();


    return Boolean(

      shell
        ?.classList
        .contains(
          "open"
        )

      &&

      tab

      &&

      (
        title ===
          "MANA STRENGTH"

        ||

        title ===
          "MANA 28"
      )

    );

  }


  /* =========================================
     STORAGE
     ========================================= */

  function loadFuel() {

    const value =
      safeJson(

        localStorage.getItem(
          FUEL_KEY
        ) || "{}"

      );


    return (

      value &&
      typeof value ===
        "object"

    )
      ? value
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

            meals:{},

            water:0

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

        mealKey => {

          if (
            !Array.isArray(
              day.meals[
                mealKey
              ]
            )
          ) {

            day.meals[
              mealKey
            ] = [];

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


    window.dispatchEvent(

      new CustomEvent(
        "mana:fuel-updated"
      )

    );

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
          Number(
            data.calories
          ) || 2050
        ),

      protein:
        Math.max(
          0,
          Number(
            data.protein
          ) || 120
        ),

      water:
        Math.max(
          0,
          Number(
            data.water
          ) || 2300
        )

    };

  }


  function totals() {

    const day =
      todayData();


    const result = {

      calories:0,

      protein:0,

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
            items || []
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

  function recoveryScore() {

    const store =
      safeJson(

        localStorage.getItem(
          DAILY_KEY
        ) || "{}"

      );


    const day =
      store[
        todayKey()
      ] || {};


    if (
      Number.isFinite(
        Number(
          day.recoveryScore
        )
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

      )
        .toLowerCase();


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
      raw ===
        "needs-attention"

      ||

      raw ===
        "low"
    ) {

      return 3;

    }


    return 0;

  }


  function saveRecoveryScore(
    score
  ) {

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
      typeof store[key] ===
        "object"

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


  function percent(
    value,
    target
  ) {

    if (
      !target
    ) {

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
     OLD SAVED MEAL IMAGE UPGRADE

     Meals already saved before v10.22 may
     contain fuel-breakfast.png etc.

     We resolve them by name at render time
     so existing data immediately gets the
     correct new illustration.
     ========================================= */

  function mealImage(
    mealKey,
    item
  ) {

    const name =
      normalise(
        item?.name
      );


    const options =
      MEAL_OPTIONS[
        mealKey
      ] || [];


    const match =
      options.find(

        option =>
          normalise(
            option.name
          ) === name

      );


    if (
      match?.image
    ) {

      return match.image;

    }


    return (
      item?.image ||
      CATEGORY[
        mealKey
      ]?.image ||
      "fuel-snack.png"
    );

  }


  /* =========================================
     TARGET ICONS
     ========================================= */

  function iconSvg(
    type
  ) {

    if (
      type ===
        "calories"
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
      type ===
        "protein"
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
      type ===
        "water"
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

        max-width:100%;

        color:#f6f6f6;

      }


      #${ROOT_ID} *{

        box-sizing:border-box;

      }


      #${ROOT_ID} button,
      #${ROOT_ID} input{

        font:inherit;

      }


      /* =====================================
         HERO
         ===================================== */

      .m1022-hero{

        padding:
          0
          2px
          3px;

      }


      .m1022-kicker{

        color:#f3d875;

        font-size:9px;

        font-weight:950;

        letter-spacing:.14em;

        text-transform:uppercase;

      }


      .m1022-hero h2{

        margin:
          4px
          0;

        font-size:25px;

        line-height:1.05;

      }


      .m1022-hero p,
      .m1022-section-head p{

        margin:0;

        color:#919191;

        font-size:11px;

        line-height:1.4;

      }


      /* =====================================
         SECTIONS
         ===================================== */

      .m1022-card{

        overflow:hidden;

        border:
          1px solid
          #2d2d2d;

        border-radius:
          20px;

        background:
          linear-gradient(
            145deg,
            #11110f,
            #090909
          );

      }


      .m1022-section{

        padding:15px;

      }


      .m1022-section-head{

        margin-bottom:11px;

      }


      .m1022-section-head h3{

        margin:
          0
          0
          3px;

        font-size:18px;

        line-height:1.15;

      }


      /* =====================================
         CATEGORY CARDS
         ===================================== */

      .m1022-category-grid{

        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:9px;

      }


      .m1022-category{

        position:relative;

        overflow:hidden;

        min-height:138px;

        padding:0;

        border:
          1px solid
          rgba(
            219,
            174,
            56,
            .48
          );

        border-radius:16px;

        background:#090909;

        color:#fff;

        text-align:left;

        cursor:pointer;

      }


      .m1022-category img{

        display:block;

        width:100%;

        height:82px;

        object-fit:cover;

        object-position:center;

      }


      .m1022-category-copy{

        position:relative;

        min-height:54px;

        padding:
          8px
          34px
          8px
          10px;

      }


      .m1022-category-copy strong{

        display:block;

        color:#f3d875;

        font-size:14px;

        line-height:1.15;

      }


      .m1022-category-copy small{

        display:block;

        margin-top:3px;

        color:#888;

        font-size:9px;

      }


      .m1022-category-arrow{

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

      .m1022-today-list{

        display:grid;

        gap:8px;

      }


      .m1022-empty{

        display:grid;

        place-items:center;

        min-height:120px;

        padding:20px;

        border:
          1px dashed
          #323232;

        border-radius:15px;

        color:#777;

        text-align:center;

      }


      .m1022-empty-icon{

        margin-bottom:7px;

        font-size:28px;

        opacity:.55;

      }


      .m1022-empty strong{

        display:block;

        margin-bottom:3px;

        color:#ccc;

      }


      /*
        IMPORTANT:
        Image sits inside its own fixed
        wrapper. It cannot overflow the card.
      */

      .m1022-logged{

        display:grid;

        grid-template-columns:
          80px
          minmax(0,1fr)
          32px;

        gap:10px;

        align-items:center;

        min-height:82px;

        padding:8px;

        overflow:hidden;

        border:
          1px solid
          #303030;

        border-radius:15px;

        background:#0d0d0d;

      }


      .m1022-logged-art{

        display:flex;

        align-items:center;

        justify-content:center;

        width:80px;

        height:62px;

        overflow:hidden;

        border:
          1px solid
          rgba(
            219,
            174,
            56,
            .30
          );

        border-radius:10px;

        background:#080808;

      }


      .m1022-logged-art img{

        display:block;

        width:100%;

        height:100%;

        max-width:100%;

        max-height:100%;

        object-fit:cover;

        object-position:center;

      }


      .m1022-logged-meta{

        min-width:0;

      }


      .m1022-meal-chip{

        display:inline-flex;

        margin-bottom:4px;

        padding:
          3px
          6px;

        border-radius:999px;

        background:#f3d875;

        color:#111;

        font-size:7px;

        font-weight:950;

        line-height:1;

        text-transform:uppercase;

      }


      .m1022-logged h4{

        margin:0;

        overflow:hidden;

        color:#fff;

        font-size:13px;

        line-height:1.2;

        text-overflow:ellipsis;

        white-space:nowrap;

      }


      .m1022-logged p{

        margin:
          3px
          0
          5px;

        overflow:hidden;

        color:#878787;

        font-size:9px;

        line-height:1.3;

        text-overflow:ellipsis;

        white-space:nowrap;

      }


      .m1022-macros{

        display:flex;

        flex-wrap:wrap;

        gap:5px;

      }


      .m1022-macro{

        padding:
          3px
          5px;

        border:
          1px solid
          #38311d;

        border-radius:6px;

        color:#f3d875;

        font-size:8px;

        font-weight:900;

      }


      .m1022-remove{

        display:grid;

        place-items:center;

        width:30px;

        height:30px;

        padding:0;

        border:
          1px solid
          #3a2525;

        border-radius:9px;

        background:#171010;

        color:#ff7777;

        font-size:15px;

        cursor:pointer;

      }


      /* =====================================
         TARGETS
         ===================================== */

      .m1022-target-grid{

        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:9px;

      }


      .m1022-target{

        min-width:0;

        padding:11px;

        border:
          1px solid
          #36311f;

        border-radius:15px;

        background:#0c0c0b;

      }


      .m1022-target-top{

        display:flex;

        gap:8px;

        align-items:center;

      }


      .m1022-target-icon{

        display:grid;

        place-items:center;

        width:36px;

        height:36px;

        flex:
          0
          0
          36px;

        border-radius:11px;

        background:#151515;

      }


      .m1022-target-icon svg{

        width:24px;

        height:24px;

      }


      .m1022-target.calories
      .m1022-target-icon{

        color:#ff9848;

      }


      .m1022-target.protein
      .m1022-target-icon{

        color:#f3d875;

      }


      .m1022-target.water
      .m1022-target-icon{

        color:#42b8ff;

      }


      .m1022-target.recovery
      .m1022-target-icon{

        color:#a77bff;

      }


      .m1022-target-label{

        color:#999;

        font-size:8px;

        font-weight:800;

        text-transform:uppercase;

      }


      .m1022-target-value{

        margin-top:2px;

        font-size:15px;

        font-weight:950;

        white-space:nowrap;

      }


      .m1022-target-value span{

        color:#777;

        font-size:9px;

        font-weight:700;

      }


      .m1022-bar{

        height:6px;

        margin-top:9px;

        overflow:hidden;

        border-radius:999px;

        background:#252525;

      }


      .m1022-bar span{

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


      .m1022-target.water
      .m1022-bar span{

        background:
          linear-gradient(
            90deg,
            #1677bb,
            #42b8ff
          );

      }


      .m1022-target.recovery
      .m1022-bar span{

        background:
          linear-gradient(
            90deg,
            #6f49bb,
            #a77bff
          );

      }


      .m1022-control-row{

        display:flex;

        gap:5px;

        margin-top:8px;

      }


      .m1022-control-row button{

        flex:1;

        min-width:0;

        padding:
          6px
          5px;

        border:
          1px solid
          #343434;

        border-radius:8px;

        background:#151515;

        color:#ddd;

        font-size:8px;

        font-weight:900;

        cursor:pointer;

      }


      /* =====================================
         MODAL
         ===================================== */

      .m1022-modal-backdrop{

        position:fixed;

        inset:0;

        z-index:9999;

        display:flex;

        align-items:center;

        justify-content:center;

        padding:16px;

        background:
          rgba(
            0,
            0,
            0,
            .78
          );

      }


      .m1022-modal{

        width:min(
          620px,
          100%
        );

        max-height:
          min(
            82vh,
            760px
          );

        overflow-y:auto;

        -webkit-overflow-scrolling:touch;

        padding:15px;

        border:
          1px solid
          #3b3422;

        border-radius:20px;

        background:#090909;

        box-shadow:
          0
          24px
          70px
          rgba(
            0,
            0,
            0,
            .55
          );

      }


      .m1022-modal-head{

        display:flex;

        align-items:flex-start;

        justify-content:space-between;

        gap:12px;

        margin-bottom:12px;

      }


      .m1022-modal-head h3{

        margin:
          3px
          0
          2px;

        font-size:21px;

      }


      .m1022-close{

        display:grid;

        place-items:center;

        width:36px;

        height:36px;

        flex:
          0
          0
          36px;

        padding:0;

        border:
          1px solid
          #303030;

        border-radius:50%;

        background:#111;

        color:#fff;

        font-size:17px;

        cursor:pointer;

      }


      .m1022-options{

        display:grid;

        gap:8px;

      }


      /*
        Modal artwork uses a fixed wrapper
        just like Today's Meals.
      */

      .m1022-option{

        display:grid;

        grid-template-columns:
          82px
          minmax(0,1fr)
          auto;

        gap:10px;

        align-items:center;

        min-height:82px;

        padding:7px;

        overflow:hidden;

        border:
          1px solid
          #302d26;

        border-radius:14px;

        background:#10100f;

      }


      .m1022-option-art{

        display:flex;

        align-items:center;

        justify-content:center;

        width:82px;

        height:64px;

        overflow:hidden;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .14
          );

        border-radius:10px;

        background:#080808;

      }


      .m1022-option-art img{

        display:block;

        width:100%;

        height:100%;

        max-width:100%;

        max-height:100%;

        object-fit:cover;

        object-position:center;

      }


      .m1022-option-copy{

        min-width:0;

      }


      .m1022-option h4{

        margin:0;

        color:#fff;

        font-size:13px;

        line-height:1.2;

      }


      .m1022-option p{

        margin:
          3px
          0
          5px;

        color:#8b8b8b;

        font-size:9px;

        line-height:1.3;

      }


      .m1022-option-macros{

        color:#f3d875;

        font-size:9px;

        font-weight:900;

      }


      .m1022-add{

        min-width:54px;

        min-height:36px;

        padding:
          0
          11px;

        border:0;

        border-radius:999px;

        background:#f3d875;

        color:#111;

        font-size:9px;

        font-weight:950;

        cursor:pointer;

      }


      /* =====================================
         CUSTOM MEAL
         ===================================== */

      .m1022-custom{

        margin-top:12px;

        padding-top:12px;

        border-top:
          1px solid
          #242424;

      }


      .m1022-custom h4{

        margin:
          0
          0
          8px;

        font-size:15px;

      }


      .m1022-custom-grid{

        display:grid;

        grid-template-columns:
          2fr
          1fr
          1fr;

        gap:7px;

      }


      .m1022-custom-grid input{

        width:100%;

        min-width:0;

        padding:
          10px
          11px;

        border:
          1px solid
          #333;

        border-radius:10px;

        outline:none;

        background:#111;

        color:#fff;

        font-size:10px;

      }


      .m1022-custom-grid input:focus{

        border-color:#77632a;

      }


      .m1022-custom
      .m1022-add{

        width:100%;

        margin-top:8px;

      }


      /* =====================================
         TABLET / PHONE
         ===================================== */

      @media(max-width:600px){

        #${ROOT_ID}{

          gap:12px;

        }


        .m1022-hero h2{

          font-size:23px;

        }


        .m1022-section{

          padding:13px;

        }


        /*
          CATEGORY CARDS
        */

        .m1022-category-grid{

          grid-template-columns:1fr;

          gap:8px;

        }


        .m1022-category{

          display:grid;

          grid-template-columns:
            104px
            minmax(0,1fr);

          min-height:92px;

        }


        .m1022-category img{

          width:104px;

          height:100%;

          min-height:92px;

        }


        .m1022-category-copy{

          display:flex;

          flex-direction:column;

          justify-content:center;

          min-height:92px;

          padding:
            10px
            38px
            10px
            12px;

        }


        .m1022-category-copy strong{

          font-size:14px;

        }


        .m1022-category-copy small{

          font-size:9px;

        }


        .m1022-category-arrow{

          right:12px;

          top:50%;

          bottom:auto;

          transform:
            translateY(
              -50%
            );

        }


        /*
          TODAY'S MEALS
        */

        .m1022-logged{

          grid-template-columns:
            64px
            minmax(0,1fr)
            30px;

          gap:8px;

          min-height:70px;

          padding:7px;

        }


        .m1022-logged-art{

          width:64px;

          height:50px;

          border-radius:9px;

        }


        .m1022-logged h4{

          font-size:12px;

        }


        .m1022-logged p{

          margin:
            2px
            0
            4px;

          font-size:8px;

        }


        .m1022-macro{

          padding:
            3px
            4px;

          font-size:7px;

        }


        .m1022-remove{

          width:28px;

          height:28px;

          font-size:14px;

        }


        /*
          TARGETS
        */

        .m1022-target{

          padding:10px;

        }


        .m1022-target-icon{

          width:33px;

          height:33px;

          flex-basis:33px;

        }


        .m1022-target-value{

          font-size:14px;

        }


        /*
          MODAL
        */

        .m1022-modal-backdrop{

          align-items:flex-start;

          padding:
            max(
              8px,
              env(
                safe-area-inset-top
              )
            )
            8px
            max(
              8px,
              env(
                safe-area-inset-bottom
              )
            );

        }


        .m1022-modal{

          max-height:
            calc(
              100dvh -
              16px
            );

          padding:12px;

          border-radius:18px;

        }


        .m1022-option{

          grid-template-columns:
            68px
            minmax(0,1fr)
            auto;

          gap:7px;

          min-height:70px;

          padding:6px;

        }


        .m1022-option-art{

          width:68px;

          height:52px;

          border-radius:9px;

        }


        .m1022-option h4{

          font-size:12px;

        }


        .m1022-option p{

          margin:
            2px
            0
            4px;

          font-size:8px;

        }


        .m1022-option-macros{

          font-size:8px;

        }


        .m1022-add{

          min-width:48px;

          min-height:33px;

          padding:
            0
            8px;

          font-size:8px;

        }


        .m1022-custom-grid{

          grid-template-columns:
            1fr
            1fr;

        }


        .m1022-custom-grid
        input:first-child{

          grid-column:
            1
            /
            -1;

        }

      }


      /* =====================================
         SMALL PHONE
         ===================================== */

      @media(max-width:390px){

        .m1022-category{

          grid-template-columns:
            92px
            minmax(0,1fr);

        }


        .m1022-category img{

          width:92px;

        }


        .m1022-logged{

          grid-template-columns:
            58px
            minmax(0,1fr)
            28px;

          gap:7px;

        }


        .m1022-logged-art{

          width:58px;

          height:46px;

        }


        .m1022-target-grid{

          gap:7px;

        }


        .m1022-target{

          padding:8px;

        }


        .m1022-target-top{

          gap:6px;

        }


        .m1022-target-value{

          font-size:13px;

        }


        .m1022-option{

          grid-template-columns:
            60px
            minmax(0,1fr)
            44px;

          gap:6px;

        }


        .m1022-option-art{

          width:60px;

          height:46px;

        }


        .m1022-add{

          min-width:44px;

          padding:
            0
            6px;

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

  function mealCategoryHtml(
    key
  ) {

    const item =
      CATEGORY[
        key
      ];


    return `

      <button
        type="button"
        class="m1022-category"
        data-m1022-open="${esc(key)}"
      >

        <img
          src="${asset(
            item.image
          )}"
          alt=""
          loading="lazy"
          decoding="async"
        >

        <span
          class="m1022-category-copy"
        >

          <strong>
            ${esc(
              item.label
            )}
          </strong>

          <small>
            ${esc(
              item.sub
            )}
          </small>

        </span>

        <span
          class="m1022-category-arrow"
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


    const cards =
      [];


    [

      "Breakfast",

      "Lunch",

      "Dinner",

      "Snacks"

    ]
      .forEach(

        mealKey => {

          (
            day.meals[
              mealKey
            ] || []
          )
            .forEach(

              (
                item,
                index
              ) => {

                const image =
                  mealImage(
                    mealKey,
                    item
                  );


                cards.push(`

                  <article
                    class="m1022-logged"
                  >

                    <div
                      class="m1022-logged-art"
                    >

                      <img
                        src="${asset(
                          image
                        )}"
                        alt=""
                        loading="lazy"
                        decoding="async"
                      >

                    </div>


                    <div
                      class="m1022-logged-meta"
                    >

                      <span
                        class="m1022-meal-chip"
                      >

                        ${esc(
                          CATEGORY[
                            mealKey
                          ].label
                        )}

                      </span>


                      <h4>

                        ${esc(
                          item.name ||
                          CATEGORY[
                            mealKey
                          ].label
                        )}

                      </h4>


                      <p>

                        ${esc(
                          item.detail ||
                          "Logged meal"
                        )}

                      </p>


                      <div
                        class="m1022-macros"
                      >

                        <span
                          class="m1022-macro"
                        >

                          ${
                            Number(
                              item.calories
                            ) || 0
                          } cal

                        </span>


                        <span
                          class="m1022-macro"
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
                      class="m1022-remove"
                      data-m1022-remove="${mealKey}:${index}"
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
          class="m1022-empty"
        >

          <div>

            <div
              class="m1022-empty-icon"
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
        class="m1022-today-list"
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
        class="m1022-target ${type}"
      >

        <div
          class="m1022-target-top"
        >

          <div
            class="m1022-target-icon"
          >

            ${iconSvg(
              type
            )}

          </div>


          <div>

            <div
              class="m1022-target-label"
            >

              ${esc(
                label
              )}

            </div>


            <div
              class="m1022-target-value"
            >

              ${esc(
                value
              )}
              ${esc(
                suffix
              )}

              <span>

                / ${esc(
                  target
                )}
                ${esc(
                  suffix
                )}

              </span>

            </div>

          </div>

        </div>


        <div
          class="m1022-bar"
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
        class="m1022-target-grid"
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
              class="m1022-control-row"
            >

              <button
                type="button"
                data-m1022-water="-250"
              >
                −250
              </button>

              <button
                type="button"
                data-m1022-water="250"
              >
                +250
              </button>

              <button
                type="button"
                data-m1022-water="500"
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
              class="m1022-control-row"
            >

              <button
                type="button"
                data-m1022-recovery="-1"
              >
                −
              </button>

              <button
                type="button"
                data-m1022-recovery="1"
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
        class="m1022-option"
      >

        <div
          class="m1022-option-art"
        >

          <img
            src="${asset(
              item.image
            )}"
            alt=""
            loading="lazy"
            decoding="async"
          >

        </div>


        <div
          class="m1022-option-copy"
        >

          <h4>
            ${esc(
              item.name
            )}
          </h4>


          <p>
            ${esc(
              item.detail
            )}
          </p>


          <div
            class="m1022-option-macros"
          >

            ${item.calories} cal
            •
            ${item.protein}g protein

          </div>

        </div>


        <button
          type="button"
          class="m1022-add"
          data-m1022-add="${mealKey}:${index}"
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
      !MEAL_OPTIONS[
        openMeal
      ]
    ) {

      return "";

    }


    const config =
      CATEGORY[
        openMeal
      ];


    return `

      <div
        class="m1022-modal-backdrop"
        data-m1022-backdrop
      >

        <div
          class="m1022-modal"
          role="dialog"
          aria-modal="true"
        >

          <div
            class="m1022-modal-head"
          >

            <div>

              <div
                class="m1022-kicker"
              >
                MANA FUEL
              </div>


              <h3>

                ${esc(
                  config.label
                )}

              </h3>


              <p
                style="
                  margin:0;
                  color:#8f8f8f;
                  font-size:10px;
                "
              >

                Choose a meal to add to today.

              </p>

            </div>


            <button
              type="button"
              class="m1022-close"
              data-m1022-close
              aria-label="Close"
            >
              ×
            </button>

          </div>


          <div
            class="m1022-options"
          >

            ${

              MEAL_OPTIONS[
                openMeal
              ]
                .map(

                  (
                    item,
                    index
                  ) =>

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
            class="m1022-custom"
          >

            <h4>
              Add your own
            </h4>


            <div
              class="m1022-custom-grid"
            >

              <input
                id="m1022CustomName"
                type="text"
                placeholder="Meal name"
              >


              <input
                id="m1022CustomCalories"
                type="number"
                min="0"
                placeholder="Calories"
              >


              <input
                id="m1022CustomProtein"
                type="number"
                min="0"
                placeholder="Protein g"
              >

            </div>


            <button
              type="button"
              class="m1022-add"
              data-m1022-custom="${openMeal}"
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

    const identity =

      programName() ===
        "MANA 28"

        ? "MANA 28 • FUEL"

        : "MANA STRENGTH • FUEL";


    return `

      <div
        id="${ROOT_ID}"
      >

        <header
          class="m1022-hero"
        >

          <div
            class="m1022-kicker"
          >

            ${identity}

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
            m1022-card
            m1022-section
          "
        >

          <div
            class="m1022-section-head"
          >

            <h3>
              Add a Meal
            </h3>

            <p>
              Choose a meal category to see your options.
            </p>

          </div>


          <div
            class="m1022-category-grid"
          >

            ${mealCategoryHtml(
              "Breakfast"
            )}

            ${mealCategoryHtml(
              "Lunch"
            )}

            ${mealCategoryHtml(
              "Dinner"
            )}

            ${mealCategoryHtml(
              "Snacks"
            )}

          </div>

        </section>


        <section
          class="
            m1022-card
            m1022-section
          "
        >

          <div
            class="m1022-section-head"
          >

            <h3>
              Today's Meals
            </h3>

            <p>
              Your selected meals stay visible throughout the day.
            </p>

          </div>


          ${loggedMealsHtml()}

        </section>


        <section
          class="
            m1022-card
            m1022-section
          "
        >

          <div
            class="m1022-section-head"
          >

            <h3>
              Daily Targets
            </h3>

            <p>
              Calories and protein update from meals.
              Water and recovery are manual.
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


    if (
      !holder
    ) {

      return false;

    }


    installStyles();


    holder.innerHTML =
      pageHtml();


    return true;

  }


  function scheduleRender(
    delay = 0
  ) {

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


    if (
      !item
    ) {

      return;

    }


    const day =
      todayData();


    day.meals[
      mealKey
    ].push({

      ...item,

      id:
        "m1022-" +
        Date.now(),

      addedAt:
        new Date()
          .toISOString(),

      source:
        "mana-v1022-fuel"

    });


    writeToday(
      day
    );


    openMeal =
      "";


    render();

  }


  function addCustomMeal(
    mealKey
  ) {

    const name =
      document
        .getElementById(
          "m1022CustomName"
        )
        ?.value
        ?.trim();


    const calories =
      Math.max(

        0,

        Number(

          document
            .getElementById(
              "m1022CustomCalories"
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
              "m1022CustomProtein"
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
        "m1022-custom-" +
        Date.now(),

      addedAt:
        new Date()
          .toISOString(),

      source:
        "mana-v1022-custom"

    });


    writeToday(
      day
    );


    openMeal =
      "";


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


    writeToday(
      day
    );


    render();

  }


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
        )
        +
        Number(
          delta || 0
        )

      );


    writeToday(
      day
    );


    render();

  }


  function changeRecovery(
    delta
  ) {

    saveRecoveryScore(

      recoveryScore()
      +
      Number(
        delta || 0
      )

    );


    render();

  }


  /* =========================================
     CLICK HANDLER
     ========================================= */

  function handleClick(
    event
  ) {

    if (
      !fuelOpen()
    ) {

      return;

    }


    const open =
      event.target.closest(
        "[data-m1022-open]"
      );


    if (
      open
    ) {

      openMeal =
        open.dataset
          .m1022Open;


      render();


      return;

    }


    if (
      event.target.closest(
        "[data-m1022-close]"
      )
    ) {

      openMeal =
        "";


      render();


      return;

    }


    const backdrop =
      event.target.closest(
        "[data-m1022-backdrop]"
      );


    if (
      backdrop &&
      event.target ===
        backdrop
    ) {

      openMeal =
        "";


      render();


      return;

    }


    const add =
      event.target.closest(
        "[data-m1022-add]"
      );


    if (
      add
    ) {

      const [
        mealKey,
        index
      ] =
        add.dataset
          .m1022Add
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


    const custom =
      event.target.closest(
        "[data-m1022-custom]"
      );


    if (
      custom
    ) {

      addCustomMeal(

        custom.dataset
          .m1022Custom

      );


      return;

    }


    const remove =
      event.target.closest(
        "[data-m1022-remove]"
      );


    if (
      remove
    ) {

      const [
        mealKey,
        index
      ] =
        remove.dataset
          .m1022Remove
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
        "[data-m1022-water]"
      );


    if (
      water
    ) {

      changeWater(

        Number(
          water.dataset
            .m1022Water
        ) || 0

      );


      return;

    }


    const recovery =
      event.target.closest(
        "[data-m1022-recovery]"
      );


    if (
      recovery
    ) {

      changeRecovery(

        Number(
          recovery.dataset
            .m1022Recovery
        ) || 0

      );

    }

  }


  /* =========================================
     EVENTS

     NO MutationObserver.
     NO repeated DOM polling.
     ========================================= */

  function bindEvents() {

    document.addEventListener(
      "click",
      handleClick
    );


    /*
      Opening Fuel from bottom navigation.
    */

    document.addEventListener(

      "click",

      event => {

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="fuel"]'
          )
        ) {

          scheduleRender(
            20
          );

        }

      },

      true

    );


    /*
      Program shell changes.
    */

    window.addEventListener(

      "mana:program-tab-change",

      () => {

        scheduleRender(
          20
        );

      }

    );


    /*
      Cross-tab browser storage changes only.
      This does not fire for local writes in
      the same browser tab.
    */

    window.addEventListener(

      "storage",

      event => {

        if (

          fuelOpen()

          &&

          [

            FUEL_KEY,

            TARGET_KEY,

            DAILY_KEY

          ].includes(
            event.key
          )

        ) {

          scheduleRender(
            30
          );

        }

      }

    );

  }


  /* =========================================
     PUBLIC API

     v10.16 uses renderManaStrengthFuel,
     so compatibility is preserved.
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


    if (
      fuelOpen()
    ) {

      render();

    }


    console.log(

      "Mana Complete Fuel",

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
