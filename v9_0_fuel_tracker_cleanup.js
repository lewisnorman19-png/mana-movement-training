/* =========================================
   MANA MOVEMENT TRAINING v9.0
   CLEAN FUEL TRACKER

   DAILY PROGRESS
   MEAL SELECTION
   REMOVE DIARY / HISTORY CLUTTER
   ========================================= */

(() => {
  "use strict";


  const FUEL_VIEW_ID =
    "clientFuelView";

  const STYLE_ID =
    "mana-v90-fuel-clean-style";


  let cleanTimer =
    null;


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

      /* ==========================
         FUEL SCREEN
         ========================== */

      #${FUEL_VIEW_ID}{
        width:min(
          520px,
          100%
        );

        min-height:100vh;

        margin:auto;

        padding:
          calc(
            env(
              safe-area-inset-top
            ) + 18px
          )
          18px
          calc(
            110px +
            env(
              safe-area-inset-bottom
            )
          );

        background:#050505;
      }


      #${FUEL_VIEW_ID}.hide{
        display:none !important;
      }


      /* ==========================
         DAILY PROGRESS
         ========================== */

      #${FUEL_VIEW_ID}
      #fuelV58Targets{
        margin:
          16px
          0
          12px
          !important;

        padding:18px !important;

        border-radius:22px !important;

        border:
          1px solid
          #4a3d12
          !important;

        background:
          linear-gradient(
            145deg,
            #17150d,
            #0b0b0b
          )
          !important;
      }


      #${FUEL_VIEW_ID}
      #fuelV58Targets
      .fuel-v58-head h3{
        font-size:21px !important;
      }


      #fuelV58UpdateProfile{
        display:none !important;
      }


      #${FUEL_VIEW_ID}
      #fuelV58Targets
      [data-target-card="carbs"],

      #${FUEL_VIEW_ID}
      #fuelV58Targets
      [data-target-card="fat"]{
        display:none !important;
      }


      #${FUEL_VIEW_ID}
      #fuelV58Targets
      .fuel-v58-grid{
        display:grid !important;

        grid-template-columns:
          1fr
          1fr
          !important;

        gap:10px !important;
      }


      #${FUEL_VIEW_ID}
      #fuelV58Targets
      [data-target-card="water"]{
        grid-column:
          1 / -1
          !important;
      }


      /* ==========================
         MEAL SELECTION
         ========================== */

      #${FUEL_VIEW_ID}
      #fuelV611QuickPanel{
        margin:
          12px
          0
          0
          !important;

        padding:18px !important;

        border-radius:20px !important;

        border:
          1px solid
          #292929
          !important;

        background:#0d0d0d !important;
      }


      #${FUEL_VIEW_ID}
      #fuelV611QuickPanel
      .fuel-v611-title{
        margin-bottom:12px;

        color:#fff;

        font-size:20px;

        font-weight:900;
      }


      #${FUEL_VIEW_ID}
      #fuelV611QuickPanel
      .fuel-v611-grid{
        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:9px;
      }


      #${FUEL_VIEW_ID}
      #fuelV611QuickPanel
      .fuel-v611-btn{
        min-height:56px;

        border:
          1px solid
          #3b3420;

        border-radius:15px;

        background:#111;

        color:#f3d875;

        font-size:14px;

        font-weight:900;
      }


      /*
        Generic add-meal button is not needed.
        The four Mana meal selectors remain.
      */

      #fuelV611AddMeal{
        display:none !important;
      }


      /* ==========================
         REMOVE OLD TRACKER CLUTTER
         ========================== */

      #${FUEL_VIEW_ID}
      #fuelV57Dashboard{
        display:none !important;
      }


      #${FUEL_VIEW_ID}
      #fuelV60Summary{
        display:none !important;
      }


      /*
        Old diary rows.
      */

      #${FUEL_VIEW_ID}
      .fuel-v57-meal,

      #${FUEL_VIEW_ID}
      .fuel-v57-history,

      #${FUEL_VIEW_ID}
      .fuel-v57-recent,

      #${FUEL_VIEW_ID}
      .fuel-v57-favourite,

      #${FUEL_VIEW_ID}
      .fuel-v57-favorite{
        display:none !important;
      }


      @media(max-width:360px){

        #${FUEL_VIEW_ID}
        #fuelV58Targets
        .fuel-v58-grid,

        #${FUEL_VIEW_ID}
        #fuelV611QuickPanel
        .fuel-v611-grid{
          grid-template-columns:
            1fr
            !important;
        }


        #${FUEL_VIEW_ID}
        #fuelV58Targets
        [data-target-card="water"]{
          grid-column:auto !important;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     HIDE OLD STATIC FUEL CARDS
     ========================================= */

  function hideOldFuelCards(
    fuelView
  ) {
    [
      ...fuelView.children
    ].forEach(
      child => {

        if (
          child.id ===
            "fuelV58Targets" ||
          child.id ===
            "fuelV611QuickPanel"
        ) {
          return;
        }


        const text =
          (
            child.textContent ||
            ""
          )
            .trim()
            .toLowerCase();


        if (
          text.includes(
            "move with purpose. fuel with purpose"
          ) ||

          text.includes(
            "daily foundations"
          ) ||

          text.includes(
            "food history"
          ) ||

          text.includes(
            "favourite meals"
          ) ||

          text.includes(
            "favorite meals"
          ) ||

          text.includes(
            "recent meals"
          )
        ) {

          child.style.display =
            "none";
        }

      }
    );
  }


  /* =========================================
     CLEAN TARGET PANEL
     ========================================= */

  function cleanTargets() {
    const targets =
      document.getElementById(
        "fuelV58Targets"
      );


    if (!targets) return;


    const heading =
      targets.querySelector(
        ".fuel-v58-head h3"
      );


    if (heading) {
      heading.textContent =
        "Daily Progress";
    }


    const edit =
      document.getElementById(
        "fuelV58EditTargets"
      );


    if (edit) {
      edit.textContent =
        "Edit targets";
    }
  }


  /* =========================================
     MEAL SELECTION
     ========================================= */

  function cleanMealSelection(
    fuelView
  ) {
    const panel =
      document.getElementById(
        "fuelV611QuickPanel"
      );


    if (!panel) {
      return;
    }


    /*
      v6.1 originally creates this
      inside the old food dashboard.

      Move it out before hiding
      that old dashboard.
    */

    const targets =
      document.getElementById(
        "fuelV58Targets"
      );


    if (
      targets &&
      panel.parentElement !==
        fuelView
    ) {

      targets.insertAdjacentElement(
        "afterend",
        panel
      );
    }


    const title =
      panel.querySelector(
        ".fuel-v611-title"
      );


    if (title) {
      title.textContent =
        "Meal Selection";
    }


    const labels = {
      Breakfast:
        "Breakfast",

      Lunch:
        "Lunch",

      Dinner:
        "Dinner",

      Snacks:
        "Snacks"
    };


    Object.entries(
      labels
    ).forEach(
      (
        [
          meal,
          label
        ]
      ) => {

        const button =
          panel.querySelector(
            `[data-v611-meal="${meal}"]`
          );


        if (button) {
          button.textContent =
            label;
        }

      }
    );
  }


  /* =========================================
     REMOVE TEXT-BASED SECTIONS
     ========================================= */

  function hideUnwantedSections(
    fuelView
  ) {
    const unwanted = [
      "today's meals",
      "daily meal record",
      "food history",
      "favourite meals",
      "favorite meals",
      "recent meals",
      "last 7 days"
    ];


    [
      ...fuelView.querySelectorAll(
        "section, .card, .fuel-v57-section"
      )
    ].forEach(
      element => {

        if (
          element.id ===
            "fuelV58Targets" ||
          element.id ===
            "fuelV611QuickPanel"
        ) {
          return;
        }


        const text =
          (
            element.textContent ||
            ""
          )
            .trim()
            .toLowerCase();


        if (
          unwanted.some(
            phrase =>
              text.includes(
                phrase
              )
          )
        ) {

          element.style.display =
            "none";
        }

      }
    );
  }


  /* =========================================
     CLEAN FUEL SCREEN
     ========================================= */

  function cleanFuelScreen() {
    const fuelView =
      document.getElementById(
        FUEL_VIEW_ID
      );


    if (!fuelView) return;


    cleanTargets();


    cleanMealSelection(
      fuelView
    );


    hideOldFuelCards(
      fuelView
    );


    hideUnwantedSections(
      fuelView
    );


    /*
      Old seven-day summary.
    */

    document
      .getElementById(
        "fuelV60Summary"
      )
      ?.remove();


    /*
      Keep the old dashboard hidden.
      Its modal can still be used
      by Meal Selection buttons.
    */

    const dashboard =
      document.getElementById(
        "fuelV57Dashboard"
      );


    if (dashboard) {
      dashboard.style.display =
        "none";
    }
  }


  /* =========================================
     WATCH FOR OLD FUEL SCRIPTS
     ========================================= */

  function scheduleClean() {
    clearTimeout(
      cleanTimer
    );


    cleanTimer =
      setTimeout(
        cleanFuelScreen,
        80
      );
  }


  function watchFuel() {
    const fuelView =
      document.getElementById(
        FUEL_VIEW_ID
      );


    if (!fuelView) return;


    const observer =
      new MutationObserver(
        scheduleClean
      );


    observer.observe(
      fuelView,
      {
        childList:true,
        subtree:true
      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {
    injectStyles();


    setTimeout(
      cleanFuelScreen,
      350
    );


    setTimeout(
      cleanFuelScreen,
      1100
    );


    setTimeout(
      cleanFuelScreen,
      2000
    );


    watchFuel();


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            '[data-page="fuel"]'
          )
        ) {

          setTimeout(
            cleanFuelScreen,
            120
          );
        }

      }
    );
  }


  window.cleanManaFuelTracker =
    cleanFuelScreen;


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
