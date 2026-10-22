/* =========================================
   MANA MOVEMENT TRAINING v10.20.2
   FUEL — OPTIMISED MEAL ILLUSTRATIONS

   BUILD: 102020

   APPLIES TO
   -----------------------------------------
   - MANA STRENGTH
   - MANA 28

   PURPOSE
   -----------------------------------------
   1. Smaller meal illustrations
   2. Faster mobile Fuel performance
   3. NO MutationObserver
   4. Event-driven artwork refresh only
   5. Keep all 16 meal artworks
   6. Keep Today's Meals artwork
   7. Keep existing Fuel engine untouched

   DISPLAY
   -----------------------------------------
   Desktop:
   - 88 x 70 meal artwork

   Mobile:
   - 74 x 60 meal artwork

   Small phones:
   - 68 x 56 meal artwork
   ========================================= */

(() => {
  "use strict";


  /* =========================================
     BUILD
     ========================================= */

  const BUILD =
    "102020";


  const STYLE_ID =
    "mana-v10202-fuel-meal-art-style";


  const ASSET_ROOT =
    "ui/";


  let refreshTimer =
    null;


  /* =========================================
     HELPERS
     ========================================= */

  const $ =
    id =>
      document.getElementById(
        id
      );


  function asset(
    filename
  ) {

    return (
      ASSET_ROOT +
      filename +
      "?v=" +
      BUILD
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
     CURRENT PROGRAM
     ========================================= */

  function programName() {

    return String(

      $(
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
      $(
        "manaV83ProgramShell"
      );


    const fuelTab =
      document.querySelector(

        '#manaV83Tabs ' +
        '.mana-v83-tab.active' +
        '[data-v83-tab="fuel"]'

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

      fuelTab

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
     FALLBACK ART
     ========================================= */

  const CATEGORY_FALLBACK = {

    breakfast:
      "fuel-breakfast.png",

    lunch:
      "fuel-lunch.png",

    dinner:
      "fuel-dinner.png",

    snacks:
      "fuel-snack.png",

    snack:
      "fuel-snack.png"

  };


  /* =========================================
     INDIVIDUAL MEAL ART
     ========================================= */

  const MEAL_ART = {


    /* BREAKFAST */

    "eggs + toast":{

      file:
        "meal-eggs-toast.png",

      fallback:
        "fuel-breakfast.png"

    },


    "greek yoghurt bowl":{

      file:
        "meal-greek-yoghurt-bowl.png",

      fallback:
        "fuel-breakfast.png"

    },


    "protein oats":{

      file:
        "meal-protein-oats.png",

      fallback:
        "fuel-breakfast.png"

    },


    "breakfast wrap":{

      file:
        "meal-breakfast-wrap.png",

      fallback:
        "fuel-breakfast.png"

    },


    /* LUNCH */

    "chicken rice bowl":{

      file:
        "meal-chicken-rice-bowl.png",

      fallback:
        "fuel-lunch.png"

    },


    "tuna wrap":{

      file:
        "meal-tuna-wrap.png",

      fallback:
        "fuel-lunch.png"

    },


    "beef + sweet potato":{

      file:
        "meal-beef-sweet-potato.png",

      fallback:
        "fuel-lunch.png"

    },


    "chicken salad":{

      file:
        "meal-chicken-salad.png",

      fallback:
        "fuel-lunch.png"

    },


    /* DINNER */

    "lean beef + rice":{

      file:
        "meal-lean-beef-rice.png",

      fallback:
        "fuel-dinner.png"

    },


    "chicken + potato":{

      file:
        "meal-chicken-potato.png",

      fallback:
        "fuel-dinner.png"

    },


    "salmon + rice":{

      file:
        "meal-salmon-rice.png",

      fallback:
        "fuel-dinner.png"

    },


    "high-protein pasta":{

      file:
        "meal-high-protein-pasta.png",

      fallback:
        "fuel-dinner.png"

    },


    /* SNACKS */

    "protein shake":{

      file:
        "meal-protein-shake.png",

      fallback:
        "fuel-snack.png"

    },


    "yoghurt + fruit":{

      file:
        "meal-yoghurt-fruit.png",

      fallback:
        "fuel-snack.png"

    },


    "tuna + crackers":{

      file:
        "meal-tuna-crackers.png",

      fallback:
        "fuel-snack.png"

    },


    "cottage cheese bowl":{

      file:
        "meal-cottage-cheese-bowl.png",

      fallback:
        "fuel-snack.png"

    }

  };


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

    $(
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

      /* =====================================
         DESKTOP MEAL OPTIONS
         ===================================== */

      #manaV1015Fuel
      .m1015-option{

        grid-template-columns:
          88px
          minmax(
            0,
            1fr
          )
          auto
          !important;

        gap:
          11px !important;

        min-height:
          86px !important;

        padding:
          7px
          10px
          7px
          7px
          !important;

        border:
          1px solid
          #302d26 !important;

        border-radius:
          14px !important;

        background:
          #0f0f0e !important;

      }


      #manaV1015Fuel
      .m1015-option img{

        display:
          block !important;

        width:
          88px !important;

        height:
          70px !important;

        min-width:
          88px !important;

        object-fit:
          cover !important;

        object-position:
          center center !important;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .13
          ) !important;

        border-radius:
          11px !important;

        background:
          #080808 !important;

        box-shadow:
          none !important;

      }


      #manaV1015Fuel
      .m1015-option h4{

        margin:
          0 !important;

        font-size:
          13px !important;

        line-height:
          1.2 !important;

      }


      #manaV1015Fuel
      .m1015-option p{

        margin:
          4px
          0
          6px
          !important;

        color:
          #929292 !important;

        font-size:
          9px !important;

        line-height:
          1.35 !important;

      }


      #manaV1015Fuel
      .m1015-option-macros{

        color:
          #f3d875 !important;

        font-size:
          9px !important;

        line-height:
          1.25 !important;

      }


      /* =====================================
         ADD BUTTON
         ===================================== */

      #manaV1015Fuel
      .m1015-option
      .m1015-add{

        min-width:
          54px !important;

        min-height:
          36px !important;

        padding:
          0
          11px !important;

        border-radius:
          999px !important;

        font-size:
          9px !important;

      }


      /* =====================================
         TODAY'S MEALS
         ===================================== */

      #manaV1015Fuel
      .m1015-logged{

        border-color:
          #302d26 !important;

      }


      #manaV1015Fuel
      .m1015-logged
      > img{

        object-fit:
          cover !important;

        object-position:
          center center !important;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .12
          ) !important;

        background:
          #080808 !important;

      }


      /* =====================================
         ARTWORK
         ===================================== */

      #manaV1015Fuel
      img.m10202-meal-art{

        opacity:
          1 !important;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:600px){

        #manaV1015Fuel
        .m1015-option{

          grid-template-columns:
            74px
            minmax(
              0,
              1fr
            )
            auto
            !important;

          gap:
            8px !important;

          min-height:
            76px !important;

          padding:
            7px !important;

        }


        #manaV1015Fuel
        .m1015-option img{

          width:
            74px !important;

          height:
            60px !important;

          min-width:
            74px !important;

          border-radius:
            10px !important;

        }


        #manaV1015Fuel
        .m1015-option h4{

          font-size:
            12px !important;

        }


        #manaV1015Fuel
        .m1015-option p{

          margin:
            3px
            0
            5px
            !important;

          font-size:
            8px !important;

          line-height:
            1.25 !important;

        }


        #manaV1015Fuel
        .m1015-option-macros{

          font-size:
            8px !important;

        }


        #manaV1015Fuel
        .m1015-option
        .m1015-add{

          min-width:
            49px !important;

          min-height:
            34px !important;

          padding:
            0
            8px !important;

          font-size:
            8px !important;

        }

      }


      /* =====================================
         SMALL PHONE
         ===================================== */

      @media(max-width:390px){

        #manaV1015Fuel
        .m1015-option{

          grid-template-columns:
            68px
            minmax(
              0,
              1fr
            )
            auto
            !important;

          gap:
            7px !important;

        }


        #manaV1015Fuel
        .m1015-option img{

          width:
            68px !important;

          height:
            56px !important;

          min-width:
            68px !important;

        }


        #manaV1015Fuel
        .m1015-option
        .m1015-add{

          min-width:
            46px !important;

          padding:
            0
            7px !important;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     APPLY IMAGE
     ========================================= */

  function applyImage(
    img,
    config
  ) {

    if (
      !img ||
      !config
    ) {

      return;

    }


    const signature =
      `${config.file}-${BUILD}`;


    if (
      img.dataset
        .m10202Meal ===
      signature
    ) {

      return;

    }


    img.dataset
      .m10202Meal =
      signature;


    img.classList.add(
      "m10202-meal-art"
    );


    img.onerror =
      () => {

        img.onerror =
          null;


        img.src =
          asset(
            config.fallback
          );

      };


    img.src =
      asset(
        config.file
      );

  }


  /* =========================================
     MEAL OPTIONS
     ========================================= */

  function decorateMealOptions() {

    document
      .querySelectorAll(
        "#manaV1015Fuel .m1015-option"
      )
      .forEach(
        card => {

          const name =
            normalise(

              card
                .querySelector(
                  "h4"
                )
                ?.textContent

            );


          const config =
            MEAL_ART[
              name
            ];


          if (
            !config
          ) {

            return;

          }


          applyImage(

            card.querySelector(
              "img"
            ),

            config

          );

        }
      );

  }


  /* =========================================
     TODAY'S MEALS
     ========================================= */

  function loggedFallback(
    card
  ) {

    const category =
      normalise(

        card
          .querySelector(
            ".m1015-meal-chip"
          )
          ?.textContent

      );


    return (
      CATEGORY_FALLBACK[
        category
      ]
      ||
      "fuel-snack.png"
    );

  }


  function decorateLoggedMeals() {

    document
      .querySelectorAll(
        "#manaV1015Fuel .m1015-logged"
      )
      .forEach(
        card => {

          const name =
            normalise(

              card
                .querySelector(
                  "h4"
                )
                ?.textContent

            );


          const known =
            MEAL_ART[
              name
            ];


          if (
            !known
          ) {

            return;

          }


          applyImage(

            card.querySelector(
              ":scope > img"
            ),

            {

              file:
                known.file,

              fallback:
                known.fallback ||
                loggedFallback(
                  card
                )

            }

          );

        }
      );

  }


  /* =========================================
     FUEL IDENTITY
     ========================================= */

  function decorateFuelHeader() {

    const root =
      $(
        "manaV1015Fuel"
      );


    if (
      !root
    ) {

      return;

    }


    const kicker =
      root.querySelector(
        ".m1015-kicker"
      );


    if (
      !kicker
    ) {

      return;

    }


    kicker.textContent =
      programName() ===
        "MANA 28"

        ? "MANA 28 • FUEL"

        : "MANA STRENGTH • FUEL";

  }


  /* =========================================
     LIGHTWEIGHT REFRESH
     ========================================= */

  function refresh() {

    if (
      !fuelOpen()
    ) {

      return;

    }


    decorateMealOptions();

    decorateLoggedMeals();

    decorateFuelHeader();

  }


  function scheduleRefresh(
    delay = 70
  ) {

    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        refresh,
        delay
      );

  }


  /* =========================================
     EVENTS ONLY

     NO MutationObserver.
     ========================================= */

  function bindEvents() {

    document.addEventListener(
      "click",
      event => {

        /*
          ENTER FUEL
        */

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="fuel"]'
          )
        ) {

          scheduleRefresh(
            130
          );


          return;

        }


        /*
          BREAKFAST / LUNCH /
          DINNER / SNACKS
        */

        if (
          event.target.closest(
            "[data-m1015-meal]"
          )
        ) {

          scheduleRefresh(
            80
          );


          return;

        }


        /*
          ADD MEAL
        */

        if (
          event.target.closest(
            "[data-m1015-add]"
          )
        ) {

          scheduleRefresh(
            90
          );


          return;

        }


        /*
          REMOVE MEAL
        */

        if (
          event.target.closest(
            "[data-m1015-remove]"
          )
        ) {

          scheduleRefresh(
            90
          );


          return;

        }


        /*
          CLOSE MODAL
        */

        if (
          event.target.closest(
            "[data-m1015-close]"
          )
        ) {

          scheduleRefresh(
            80
          );

        }

      },
      true
    );


    /*
      Fuel data update.
    */

    window.addEventListener(
      "mana:fuel-updated",
      () => {

        if (
          fuelOpen()
        ) {

          scheduleRefresh(
            80
          );

        }

      }
    );


    /*
      Program tab update.
    */

    window.addEventListener(
      "mana:program-tab-change",
      () => {

        if (
          fuelOpen()
        ) {

          scheduleRefresh(
            100
          );

        }

      }
    );


    /*
      Returning to app.
    */

    window.addEventListener(
      "focus",
      () => {

        if (
          fuelOpen()
        ) {

          scheduleRefresh(
            100
          );

        }

      }
    );

  }


  /* =========================================
     PUBLIC API
     ========================================= */

  function expose() {

    window
      .refreshManaFuelMealIllustrations =
      scheduleRefresh;


    window
      .MANA_FUEL_MEAL_ART_BUILD =
      BUILD;

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    expose();

    bindEvents();


    /*
      One initial refresh only.
    */

    setTimeout(
      refresh,
      650
    );


    console.log(
      "Mana Fuel Meal Illustrations",
      BUILD,
      "lightweight"
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
