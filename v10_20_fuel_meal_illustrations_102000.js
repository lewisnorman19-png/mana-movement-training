/* =========================================
   MANA MOVEMENT TRAINING v10.20.1
   FUEL — INDIVIDUAL MEAL ILLUSTRATIONS

   BUILD: 102010

   HOTFIX
   -----------------------------------------
   - Removes aggressive nested DOM observer
   - Stops mobile refresh storms / lock-ups
   - Keeps all 16 individual meal artworks
   - Keeps Mana Strength + Mana 28 support
   - Keeps artwork in Today's Meals
   - Keeps safe category fallbacks
   - No Fuel engine changes
   ========================================= */

(() => {
  "use strict";


  /* =========================================
     BUILD
     ========================================= */

  const BUILD =
    "102010";


  const STYLE_ID =
    "mana-v1020-fuel-meal-art-style";


  const ASSET_ROOT =
    "ui/";


  let refreshTimer =
    null;


  let holderObserver =
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
     ACTIVE PROGRAM
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


    const activeFuel =
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

      activeFuel

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
     CATEGORY FALLBACKS
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

    if (
      $(
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

      /* =====================================
         MEAL OPTION ART
         ===================================== */

      #manaV1015Fuel
      .m1015-option{

        grid-template-columns:
          118px
          minmax(
            0,
            1fr
          )
          auto
          !important;

        min-height:
          108px !important;

        padding:
          8px
          10px
          8px
          8px !important;

        border-color:
          #353128 !important;

        background:

          radial-gradient(
            circle at left center,
            rgba(
              243,
              216,
              117,
              .045
            ),
            transparent 36%
          ),

          #10100f !important;

      }


      #manaV1015Fuel
      .m1015-option img{

        width:
          118px !important;

        height:
          92px !important;

        object-fit:
          cover !important;

        object-position:
          center !important;

        border-radius:
          13px !important;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .16
          );

        background:
          #080808;

        box-shadow:
          0
          8px
          20px
          rgba(
            0,
            0,
            0,
            .22
          );

      }


      #manaV1015Fuel
      .m1015-option h4{

        font-size:
          14px !important;

        line-height:
          1.2 !important;

      }


      #manaV1015Fuel
      .m1015-option p{

        font-size:
          10px !important;

        line-height:
          1.35 !important;

      }


      #manaV1015Fuel
      .m1015-option-macros{

        font-size:
          10px !important;

      }


      /* =====================================
         TODAY'S MEALS
         ===================================== */

      #manaV1015Fuel
      .m1015-logged{

        border-color:
          #343027 !important;

        background:

          radial-gradient(
            circle at top left,
            rgba(
              243,
              216,
              117,
              .045
            ),
            transparent 42%
          ),

          linear-gradient(
            145deg,
            #12110d,
            #090909
          ) !important;

      }


      #manaV1015Fuel
      .m1015-logged
      > img{

        object-fit:
          cover !important;

        object-position:
          center !important;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .14
          );

        background:
          #080808;

      }


      #manaV1015Fuel
      img.m1020-meal-art{

        opacity:
          1;

      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(max-width:600px){

        #manaV1015Fuel
        .m1015-option{

          grid-template-columns:
            104px
            minmax(
              0,
              1fr
            )
            auto
            !important;

          min-height:
            98px !important;

          gap:
            8px !important;

        }


        #manaV1015Fuel
        .m1015-option img{

          width:
            104px !important;

          height:
            82px !important;

          border-radius:
            12px !important;

        }


        #manaV1015Fuel
        .m1015-option h4{

          font-size:
            13px !important;

        }


        #manaV1015Fuel
        .m1015-option p{

          font-size:
            9px !important;

        }


        #manaV1015Fuel
        .m1015-option-macros{

          font-size:
            9px !important;

        }

      }


      @media(max-width:390px){

        #manaV1015Fuel
        .m1015-option{

          grid-template-columns:
            94px
            minmax(
              0,
              1fr
            )
            auto
            !important;

        }


        #manaV1015Fuel
        .m1015-option img{

          width:
            94px !important;

          height:
            76px !important;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     IMAGE FALLBACK
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
        .m1020Meal ===
      signature
    ) {

      return;

    }


    img.dataset
      .m1020Meal =
      signature;


    img.classList.add(
      "m1020-meal-art"
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
     OPTION CARDS
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
     LOGGED MEALS
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
     FUEL HEADER
     ========================================= */

  function decorateFuelHeader() {

    const root =
      $(
        "manaV1015Fuel"
      );


    const kicker =
      root
        ?.querySelector(
          ".m1015-kicker"
        );


    if (
      !kicker
    ) {

      return;

    }


    const title =
      programName();


    kicker.textContent =
      title ===
        "MANA 28"

        ? "MANA 28 • FUEL"

        : "MANA STRENGTH • FUEL";

  }


  /* =========================================
     SAFE REFRESH

     IMPORTANT:
     One refresh only.
     No stacked mobile refresh chain.
     ========================================= */

  function refresh() {

    if (
      !fuelOpen()
    ) {

      return;

    }


    installStyles();

    decorateMealOptions();

    decorateLoggedMeals();

    decorateFuelHeader();

  }


  function scheduleRefresh(
    delay = 40
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
     SAFE HOLDER OBSERVER

     ONLY watches direct replacement of the
     main Fuel screen.

     It does NOT watch every meal-card mutation.
     ========================================= */

  function attachObserver() {

    holderObserver
      ?.disconnect();


    const holder =
      $(
        "manaV83Content"
      );


    if (
      !holder
    ) {

      return;

    }


    holderObserver =
      new MutationObserver(
        () => {

          if (
            fuelOpen()
          ) {

            scheduleRefresh(
              50
            );

          }

        }
      );


    holderObserver.observe(
      holder,
      {
        childList:
          true,

        subtree:
          false
      }
    );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function bindEvents() {

    document.addEventListener(
      "click",
      event => {

        /*
          Open Fuel.
        */

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="fuel"]'
          )
        ) {

          scheduleRefresh(
            140
          );


          return;

        }


        /*
          Open Breakfast / Lunch /
          Dinner / Snacks.

          v10.15 renders first.
          Then we decorate artwork once.
        */

        if (
          event.target.closest(
            "[data-m1015-meal]"
          )
        ) {

          scheduleRefresh(
            90
          );


          return;

        }


        /*
          ADD meal.

          Allow v10.15 to save and render,
          then decorate Today's Meals.
        */

        if (
          event.target.closest(
            "[data-m1015-add]"
          )
        ) {

          scheduleRefresh(
            100
          );


          return;

        }


        /*
          Remove meal.
        */

        if (
          event.target.closest(
            "[data-m1015-remove]"
          )
        ) {

          scheduleRefresh(
            100
          );

        }

      },
      true
    );


    /*
      v10.15 already emits this after
      Fuel data changes.

      This is the safest primary refresh
      signal for meal artwork.
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


    window.addEventListener(
      "focus",
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

    attachObserver();


    setTimeout(
      refresh,
      600
    );


    console.log(
      "Mana Fuel Meal Illustrations",
      BUILD,
      "mobile-safe"
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
