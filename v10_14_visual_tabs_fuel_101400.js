/* =========================================
   MANA MOVEMENT TRAINING v10.14.1
   VISUAL TABS + FUEL ILLUSTRATIONS

   BUILD: 101410

   PURPOSE
   -----------------------------------------
   - Premium graphics for:
     Workouts
     Fuel
     Progress
     Learning

   - Premium Fuel illustrations for:
     Breakfast
     Lunch
     Dinner
     Snacks

   - Supports BOTH:
     current Fuel card system
     shared Fuel renderer

   - Keeps all existing navigation
   - Keeps all Fuel logging
   - No whole-page observer
   - Phone-first
   ========================================= */

(() => {

  "use strict";


  /* =========================================
     BUILD
     ========================================= */

  const BUILD =
    "101410";


  const STYLE_ID =
    "mana-v10141-visual-tabs-fuel-style";


  const ASSET_ROOT =
    "ui/";


  let tabsObserver =
    null;


  let contentObserver =
    null;


  let refreshTimer =
    null;


  /* =========================================
     ASSETS
     ========================================= */

  const TAB_ASSETS = {

    program:{
      label:"Workouts",
      file:"tab-workout.png"
    },

    routine:{
      label:"Workouts",
      file:"tab-workout.png"
    },

    fuel:{
      label:"Fuel",
      file:"tab-fuel.png"
    },

    progress:{
      label:"Progress",
      file:"tab-progress.png"
    },

    learn:{
      label:"Learning",
      file:"tab-learning.png"
    }

  };


  const MEAL_ASSETS = {

    breakfast:
      "fuel-breakfast.png",

    lunch:
      "fuel-lunch.png",

    dinner:
      "fuel-dinner.png",

    snack:
      "fuel-snack.png",

    snacks:
      "fuel-snack.png"

  };


  /* =========================================
     HELPERS
     ========================================= */

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
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  }


  function mealKeyFromText(
    value
  ) {

    const text =
      normalise(
        value
      )
      .toLowerCase();


    if (
      text.includes(
        "breakfast"
      )
    ) {

      return "breakfast";

    }


    if (
      text.includes(
        "lunch"
      )
    ) {

      return "lunch";

    }


    if (
      text.includes(
        "dinner"
      )
    ) {

      return "dinner";

    }


    if (
      text.includes(
        "snack"
      )
    ) {

      return "snack";

    }


    return "";

  }


  function scheduleRefresh(
    delay = 30
  ) {

    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        refreshAll,
        delay
      );

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

      /* =====================================
         PROGRAM TABS
         ===================================== */

      #manaV83Tabs
      .mana-v83-tab.m10140-visual-tab{

        position:
          relative;

        min-height:
          76px;

        padding:
          8px
          7px
          9px;

        overflow:
          hidden;

        isolation:
          isolate;

      }


      #manaV83Tabs
      .mana-v83-tab.m10140-visual-tab::after{

        content:"";

        position:
          absolute;

        inset:
          0;

        z-index:
          -1;

        opacity:
          0;

        background:
          radial-gradient(
            circle at 50% 20%,
            rgba(236,194,72,.18),
            transparent 62%
          );

        transition:
          opacity .2s ease;

      }


      #manaV83Tabs
      .mana-v83-tab.m10140-visual-tab.active::after{

        opacity:
          1;

      }


      .m10140-tab-inner{

        width:
          100%;

        height:
          100%;

        display:
          flex;

        flex-direction:
          column;

        align-items:
          center;

        justify-content:
          center;

        gap:
          4px;

        pointer-events:
          none;

      }


      .m10140-tab-icon{

        display:
          block;

        width:
          34px;

        height:
          34px;

        object-fit:
          contain;

        filter:
          saturate(.82)
          brightness(.92);

        opacity:
          .74;

        transform:
          translateY(1px)
          scale(.92);

        transition:
          transform .18s ease,
          opacity .18s ease,
          filter .18s ease;

      }


      .mana-v83-tab.active
      .m10140-tab-icon{

        opacity:
          1;

        filter:
          saturate(1.12)
          brightness(1.08)
          drop-shadow(
            0 0 8px
            rgba(232,191,66,.28)
          );

        transform:
          translateY(0)
          scale(1);

      }


      .m10140-tab-label{

        display:
          block;

        color:
          inherit;

        font-size:
          10px;

        line-height:
          1;

        font-weight:
          900;

        letter-spacing:
          .04em;

        white-space:
          nowrap;

      }


      /* =====================================
         CURRENT FUEL CARDS
         ===================================== */

      #manaV83Content
      .mana-v897-meal.m10141-meal-card{

        min-height:
          108px;

        display:
          grid;

        grid-template-columns:
          86px
          minmax(0,1fr)
          28px;

        align-items:
          center;

        gap:
          12px;

        padding:
          10px
          12px
          10px
          10px;

        overflow:
          hidden;

      }


      #manaV83Content
      .mana-v897-meal.m10141-meal-card
      > strong{

        grid-column:
          2;

        grid-row:
          1;

        align-self:
          end;

        margin:
          0;

        font-size:
          16px;

      }


      #manaV83Content
      .mana-v897-meal.m10141-meal-card
      > span{

        grid-column:
          2;

        grid-row:
          2;

        align-self:
          start;

        margin:
          2px
          0
          0;

      }


      #manaV83Content
      .mana-v897-meal.m10141-meal-card
      .mana-v943-meal-arrow{

        position:
          static;

        grid-column:
          3;

        grid-row:
          1 / span 2;

        transform:
          none;

        align-self:
          center;

        justify-self:
          center;

      }


      .m10141-meal-visual{

        position:
          relative;

        grid-column:
          1;

        grid-row:
          1 / span 2;

        width:
          86px;

        height:
          86px;

        overflow:
          hidden;

        border:
          1px solid
          rgba(219,174,56,.42);

        border-radius:
          16px;

        background:
          #050505;

        box-shadow:
          inset 0 0 0 1px
          rgba(255,255,255,.02),
          0 10px 24px
          rgba(0,0,0,.3);

        pointer-events:
          none;

      }


      .m10141-meal-visual::after{

        content:"";

        position:
          absolute;

        inset:
          0;

        border-radius:
          inherit;

        box-shadow:
          inset 0 0 24px
          rgba(232,190,61,.08);

        pointer-events:
          none;

      }


      .m10141-meal-visual img{

        display:
          block;

        width:
          100%;

        height:
          100%;

        object-fit:
          cover;

        object-position:
          center;

        transform:
          scale(1.04);

      }


      /* =====================================
         SHARED FUEL RENDERER
         ===================================== */

      #manaV980SharedFuel
      .m980-meal{

        overflow:
          hidden;

        border-radius:
          18px;

        background:
          linear-gradient(
            145deg,
            #10100d,
            #080808
          );

      }


      #manaV980SharedFuel
      .m980-meal-head{

        display:
          grid;

        grid-template-columns:
          78px
          minmax(0,1fr)
          auto;

        gap:
          13px;

        align-items:
          center;

        min-height:
          96px;

        padding:
          9px
          14px
          9px
          9px;

        text-align:
          left;

      }


      .m10140-meal-visual{

        position:
          relative;

        width:
          78px;

        height:
          78px;

        overflow:
          hidden;

        border:
          1px solid
          rgba(211,167,55,.38);

        border-radius:
          15px;

        background:
          #050505;

        pointer-events:
          none;

      }


      .m10140-meal-visual img{

        display:
          block;

        width:
          100%;

        height:
          100%;

        object-fit:
          cover;

        object-position:
          center;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:600px){

        #manaV83Tabs
        .mana-v83-tab.m10140-visual-tab{

          min-height:
            70px;

          padding:
            7px
            5px
            8px;

        }


        .m10140-tab-icon{

          width:
            31px;

          height:
            31px;

        }


        .m10140-tab-label{

          font-size:
            9px;

        }


        #manaV83Content
        .mana-v897-meal.m10141-meal-card{

          min-height:
            100px;

          grid-template-columns:
            78px
            minmax(0,1fr)
            26px;

          gap:
            10px;

          padding:
            9px
            10px
            9px
            9px;

        }


        .m10141-meal-visual{

          width:
            78px;

          height:
            78px;

          border-radius:
            15px;

        }


        #manaV980SharedFuel
        .m980-meal-head{

          grid-template-columns:
            70px
            minmax(0,1fr)
            auto;

          min-height:
            86px;

        }


        .m10140-meal-visual{

          width:
            70px;

          height:
            70px;

        }

      }


      @media(max-width:390px){

        #manaV83Tabs
        .mana-v83-tab.m10140-visual-tab{

          min-height:
            66px;

        }


        .m10140-tab-icon{

          width:
            28px;

          height:
            28px;

        }


        .m10140-tab-label{

          font-size:
            8px;

        }


        #manaV83Content
        .mana-v897-meal.m10141-meal-card{

          grid-template-columns:
            70px
            minmax(0,1fr)
            24px;

          gap:
            8px;

        }


        .m10141-meal-visual{

          width:
            70px;

          height:
            70px;

        }

      }

    `;


    document.head.appendChild(
      style
    );

  }


  /* =========================================
     TAB GRAPHICS
     ========================================= */

  function decorateTabs() {

    const tabs =
      document.getElementById(
        "manaV83Tabs"
      );


    if (!tabs) {

      return;

    }


    tabs
      .querySelectorAll(
        ".mana-v83-tab[data-v83-tab]"
      )
      .forEach(
        button => {

          const key =
            button.dataset.v83Tab;


          const config =
            TAB_ASSETS[
              key
            ];


          if (!config) {

            return;

          }


          button.classList.add(
            "m10140-visual-tab"
          );


          button.setAttribute(
            "aria-label",
            config.label
          );


          if (
            button.querySelector(
              ".m10140-tab-inner"
            )
          ) {

            return;

          }


          button.innerHTML = `

            <span
              class="m10140-tab-inner"
            >

              <img
                class="m10140-tab-icon"
                src="${asset(
                  config.file
                )}"
                alt=""
                aria-hidden="true"
              >

              <span
                class="m10140-tab-label"
              >
                ${config.label}
              </span>

            </span>

          `;

        }
      );

  }


  /* =========================================
     CURRENT FUEL CARDS
     ========================================= */

  function decorateCurrentFuelCards() {

    const content =
      document.getElementById(
        "manaV83Content"
      );


    if (!content) {

      return;

    }


    content
      .querySelectorAll(
        ".mana-v897-meal"
      )
      .forEach(
        card => {

          const title =
            card.querySelector(
              "strong"
            );


          const key =
            mealKeyFromText(
              title?.textContent
            );


          const filename =
            MEAL_ASSETS[
              key
            ];


          if (!filename) {

            return;

          }


          card.classList.add(
            "m10141-meal-card"
          );


          if (
            card.querySelector(
              ".m10141-meal-visual"
            )
          ) {

            return;

          }


          const visual =
            document.createElement(
              "span"
            );


          visual.className =
            "m10141-meal-visual";


          visual.innerHTML = `

            <img
              src="${asset(
                filename
              )}"
              alt=""
              aria-hidden="true"
              loading="lazy"
            >

          `;


          card.prepend(
            visual
          );

        }
      );

  }


  /* =========================================
     SHARED FUEL CARDS
     ========================================= */

  function decorateSharedFuelMeals() {

    const root =
      document.getElementById(
        "manaV980SharedFuel"
      );


    if (!root) {

      return;

    }


    root
      .querySelectorAll(
        ".m980-meal-head[data-m980-meal]"
      )
      .forEach(
        button => {

          const key =
            mealKeyFromText(
              button.dataset
                .m980Meal
            );


          const filename =
            MEAL_ASSETS[
              key
            ];


          if (
            !filename ||
            button.querySelector(
              ".m10140-meal-visual"
            )
          ) {

            return;

          }


          const visual =
            document.createElement(
              "span"
            );


          visual.className =
            "m10140-meal-visual";


          visual.innerHTML = `

            <img
              src="${asset(
                filename
              )}"
              alt=""
              aria-hidden="true"
              loading="lazy"
            >

          `;


          button.prepend(
            visual
          );

        }
      );

  }


  /* =========================================
     REFRESH
     ========================================= */

  function refreshAll() {

    decorateTabs();

    decorateCurrentFuelCards();

    decorateSharedFuelMeals();

  }


  /* =========================================
     OBSERVE TABS
     ========================================= */

  function observeTabs() {

    tabsObserver
      ?.disconnect();


    const tabs =
      document.getElementById(
        "manaV83Tabs"
      );


    if (!tabs) {

      return false;

    }


    tabsObserver =
      new MutationObserver(
        () => {

          scheduleRefresh(
            20
          );

        }
      );


    tabsObserver.observe(
      tabs,
      {

        childList:
          true,

        subtree:
          true

      }
    );


    decorateTabs();


    return true;

  }


  /* =========================================
     OBSERVE PROGRAM CONTENT ONLY
     ========================================= */

  function observeContent() {

    contentObserver
      ?.disconnect();


    const content =
      document.getElementById(
        "manaV83Content"
      );


    if (!content) {

      return false;

    }


    contentObserver =
      new MutationObserver(
        mutations => {

          let changed =
            false;


          for (
            const mutation
            of mutations
          ) {

            if (
              mutation.addedNodes.length ||
              mutation.removedNodes.length
            ) {

              changed =
                true;

              break;

            }

          }


          if (changed) {

            scheduleRefresh(
              40
            );

          }

        }
      );


    contentObserver.observe(
      content,
      {

        childList:
          true,

        subtree:
          true

      }
    );


    decorateCurrentFuelCards();

    decorateSharedFuelMeals();


    return true;

  }


  function connectObservers() {

    observeTabs();

    observeContent();

  }


  /* =========================================
     EVENTS
     ========================================= */

  function bindEvents() {

    [
      "mana:program-tab-change",
      "mana:fuel-updated"
    ]
      .forEach(
        eventName => {

          window.addEventListener(
            eventName,
            () => {

              setTimeout(
                refreshAll,
                30
              );


              setTimeout(
                connectObservers,
                100
              );

            }
          );

        }
      );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "[data-v83-tab], " +
            "[data-v973-tab], " +
            "[data-v964-launch], " +
            ".mana-v897-meal"
          )
        ) {

          setTimeout(
            refreshAll,
            40
          );


          setTimeout(
            refreshAll,
            180
          );

        }

      }
    );

  }


  /* =========================================
     PUBLIC API
     ========================================= */

  function exposeAPI() {

    window
      .MANA_VISUAL_TABS_FUEL_BUILD =
      BUILD;


    window
      .refreshManaVisualTabsFuel =
      refreshAll;

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    exposeAPI();

    bindEvents();

    refreshAll();

    connectObservers();


    setTimeout(
      refreshAll,
      350
    );


    setTimeout(
      () => {

        refreshAll();

        connectObservers();

      },
      900
    );


    console.log(
      "Mana Visual Tabs + Fuel",
      BUILD
    );

  }


  /* =========================================
     BOOT
     ========================================= */

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
