/* =========================================
   MANA MOVEMENT TRAINING v10.14.0
   VISUAL TABS + FUEL ILLUSTRATIONS

   BUILD: 101400

   PURPOSE
   -----------------------------------------
   - Add premium black / gold graphics to
     Workouts, Fuel, Progress and Learning tabs
   - Add premium meal illustrations to Fuel
   - Shared across Mana Strength, Mana 28
     and Mana Lyfe program shells
   - Keep existing navigation logic untouched
   - Keep existing Fuel logging untouched
   - Phone-first, lightweight UI layer
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "101400";


  const STYLE_ID =
    "mana-v10140-visual-tabs-fuel-style";


  const ASSET_ROOT =
    "ui/";


  let tabsObserver =
    null;


  let contentObserver =
    null;


  let refreshTimer =
    null;


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

    Breakfast:
      "fuel-breakfast.png",

    Lunch:
      "fuel-lunch.png",

    Dinner:
      "fuel-dinner.png",

    Snacks:
      "fuel-snack.png"

  };


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

        box-shadow:
          inset 0 0 0 1px
          rgba(255,255,255,.02),
          0 8px 22px
          rgba(0,0,0,.28);

        pointer-events:
          none;

      }


      .m10140-meal-visual::after{

        content:"";

        position:
          absolute;

        inset:
          0;

        border-radius:
          inherit;

        box-shadow:
          inset 0 0 22px
          rgba(232,190,61,.07);

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

        transform:
          scale(1.03);

      }


      #manaV980SharedFuel
      .m980-meal-head
      > span{

        min-width:
          0;

      }


      #manaV980SharedFuel
      .m980-meal-head
      strong{

        display:
          block;

        font-size:
          15px;

        line-height:
          1.15;

      }


      #manaV980SharedFuel
      .m980-meal-head
      small{

        display:
          block;

        margin-top:
          5px;

        color:
          #8c8c8c;

        font-size:
          10px;

        line-height:
          1.25;

      }


      #manaV980SharedFuel
      .m980-meal-head
      > b{

        color:
          #e4bf4c;

        font-size:
          22px;

        font-weight:
          500;

      }


      #manaV980SharedFuel
      [data-m980-panel="meals"]{

        position:
          relative;

      }


      #manaV980SharedFuel
      [data-m980-panel="meals"]
      .m10140-fuel-panel-icon{

        display:
          inline-flex;

        align-items:
          center;

        justify-content:
          center;

        width:
          34px;

        height:
          34px;

        margin-right:
          9px;

        vertical-align:
          middle;

        border:
          1px solid
          rgba(221,177,59,.3);

        border-radius:
          11px;

        background:
          #090806;

      }


      #manaV980SharedFuel
      [data-m980-panel="meals"]
      .m10140-fuel-panel-icon
      img{

        width:
          27px;

        height:
          27px;

        object-fit:
          contain;

      }


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


        #manaV980SharedFuel
        .m980-meal-head{

          grid-template-columns:
            70px
            minmax(0,1fr)
            auto;

          min-height:
            86px;

          gap:
            11px;

          padding:
            8px
            12px
            8px
            8px;

        }


        .m10140-meal-visual{

          width:
            70px;

          height:
            70px;

          border-radius:
            14px;

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


        #manaV980SharedFuel
        .m980-meal-head{

          grid-template-columns:
            64px
            minmax(0,1fr)
            auto;

          gap:
            9px;

        }


        .m10140-meal-visual{

          width:
            64px;

          height:
            64px;

        }

      }

    `;


    document.head.appendChild(
      style
    );

  }


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
                loading="eager"
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


  function decorateFuelMeals() {

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

          const mealKey =
            button.dataset.m980Meal;


          const filename =
            MEAL_ASSETS[
              mealKey
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


  function decorateFuelPanel() {

    const root =
      document.getElementById(
        "manaV980SharedFuel"
      );


    if (!root) {

      return;

    }


    const mealsPanel =
      root.querySelector(
        '[data-m980-panel="meals"]'
      );


    if (!mealsPanel) {

      return;

    }


    if (
      mealsPanel.querySelector(
        ".m10140-fuel-panel-icon"
      )
    ) {

      return;

    }


    const label =
      Array.from(
        mealsPanel.querySelectorAll(
          "strong, h3, h4, span"
        )
      )
      .find(
        node =>
          String(
            node.textContent || ""
          )
          .trim()
          .toUpperCase() ===
          "MEALS"
      );


    if (!label) {

      return;

    }


    const icon =
      document.createElement(
        "span"
      );


    icon.className =
      "m10140-fuel-panel-icon";


    icon.innerHTML = `

      <img
        src="${asset(
          "tab-fuel.png"
        )}"
        alt=""
        aria-hidden="true"
      >

    `;


    label.prepend(
      icon
    );

  }


  function refreshAll() {

    decorateTabs();

    decorateFuelPanel();

    decorateFuelMeals();

  }


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
        childList:true,
        subtree:true
      }
    );


    decorateTabs();


    return true;

  }


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
        () => {

          scheduleRefresh(
            30
          );

        }
      );


    contentObserver.observe(
      content,
      {
        childList:true,
        subtree:true
      }
    );


    decorateFuelPanel();

    decorateFuelMeals();


    return true;

  }


  function connectObservers() {

    observeTabs();

    observeContent();

  }


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
                20
              );


              setTimeout(
                connectObservers,
                80
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
            "[data-v964-launch]"
          )
        ) {

          setTimeout(
            refreshAll,
            30
          );


          setTimeout(
            connectObservers,
            100
          );

        }

      }
    );

  }


  function exposeAPI() {

    window
      .MANA_VISUAL_TABS_FUEL_BUILD =
      BUILD;


    window
      .refreshManaVisualTabsFuel =
      refreshAll;

  }


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
