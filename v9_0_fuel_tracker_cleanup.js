/* =========================================
   MANA MOVEMENT TRAINING v9.0.2
   FUEL TRACKER CLEANUP

   FIX HOME PAGE LEAK
   DAILY PROGRESS
   MEAL SELECTION
   REMOVE OLD DIARY / HISTORY
   ========================================= */

(() => {
  "use strict";


  const FUEL_VIEW_ID =
    "clientFuelView";

  const TARGETS_ID =
    "fuelV58Targets";

  const QUICK_ID =
    "fuelV611QuickPanel";

  const STYLE_ID =
    "mana-v902-fuel-clean-style";


  let cleanTimer = null;


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
         FUEL PAGE
         ========================== */

      #${FUEL_VIEW_ID}{
        width:min(520px,100%);
        margin:auto;

        padding:
          calc(env(safe-area-inset-top) + 18px)
          18px
          calc(110px + env(safe-area-inset-bottom));

        background:#050505;
      }


      #${FUEL_VIEW_ID}.hide{
        display:none !important;
      }


      /* ==========================
         DAILY PROGRESS
         ========================== */

      #${FUEL_VIEW_ID} #${TARGETS_ID}{
        display:block !important;

        margin:16px 0 12px !important;
        padding:18px !important;

        border-radius:22px !important;

        border:
          1px solid
          rgba(243,216,117,.25)
          !important;

        background:
          linear-gradient(
            145deg,
            #15130c,
            #0a0a0a
          )
          !important;
      }


      #${FUEL_VIEW_ID}
      #${TARGETS_ID}
      .fuel-v58-head{
        margin-bottom:15px !important;
      }


      #${FUEL_VIEW_ID}
      #${TARGETS_ID}
      .fuel-v58-head h3{
        margin:0 !important;

        font-size:21px !important;
      }


      #fuelV58UpdateProfile{
        display:none !important;
      }


      #${FUEL_VIEW_ID}
      #${TARGETS_ID}
      [data-target-card="carbs"],

      #${FUEL_VIEW_ID}
      #${TARGETS_ID}
      [data-target-card="fat"]{
        display:none !important;
      }


      #${FUEL_VIEW_ID}
      #${TARGETS_ID}
      .fuel-v58-grid{
        display:grid !important;

        grid-template-columns:
          1fr
          1fr
          !important;

        gap:10px !important;
      }


      #${FUEL_VIEW_ID}
      #${TARGETS_ID}
      [data-target-card="water"]{
        grid-column:
          1 / -1
          !important;
      }


      /* ==========================
         MEAL SELECTION
         ========================== */

      #${FUEL_VIEW_ID} #${QUICK_ID}{
        display:block !important;

        margin:12px 0 !important;
        padding:18px !important;

        border-radius:20px !important;

        border:
          1px solid
          #292929
          !important;

        background:#0d0d0d !important;
      }


      #${FUEL_VIEW_ID}
      #${QUICK_ID}
      .fuel-v611-title{
        margin-bottom:5px !important;

        font-size:20px !important;

        font-weight:900 !important;

        color:#fff !important;
      }


      .mana-v902-meal-sub{
        margin-bottom:14px;

        color:#888;

        font-size:12px;

        line-height:1.45;
      }


      #${FUEL_VIEW_ID}
      #${QUICK_ID}
      .fuel-v611-grid{
        display:grid !important;

        grid-template-columns:
          1fr
          1fr;

        gap:9px;
      }


      #${FUEL_VIEW_ID}
      #${QUICK_ID}
      .fuel-v611-btn{
        min-height:58px !important;

        border:
          1px solid
          #413819
          !important;

        border-radius:15px !important;

        background:#111 !important;

        color:#f3d875 !important;

        font-size:14px !important;

        font-weight:900 !important;
      }


      #fuelV611AddMeal{
        display:none !important;
      }


      /* ==========================
         OLD TRACKER
         ========================== */

      #fuelV57Dashboard,
      #fuelV60Summary{
        display:none !important;
      }


      .fuel-v57-history,
      .fuel-v57-recent,
      .fuel-v57-favourite,
      .fuel-v57-favorite{
        display:none !important;
      }


      @media(max-width:360px){

        #${FUEL_VIEW_ID}
        #${TARGETS_ID}
        .fuel-v58-grid,

        #${FUEL_VIEW_ID}
        #${QUICK_ID}
        .fuel-v611-grid{
          grid-template-columns:1fr !important;
        }


        #${FUEL_VIEW_ID}
        #${TARGETS_ID}
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
     FUEL HEADER
     ========================================= */

  function fuelHeader(
    fuelView
  ) {
    return (
      fuelView.querySelector(
        ":scope > .row"
      )
    );
  }


  /* =========================================
     MOVE DAILY PROGRESS INTO FUEL
     ========================================= */

  function moveTargetsIntoFuel(
    fuelView
  ) {
    const targets =
      document.getElementById(
        TARGETS_ID
      );


    if (!targets) return;


    /*
      v5.8 sometimes inserts this
      beside the old dashboard,
      which can place it on Home.

      Force it back into Fuel.
    */

    if (
      targets.parentElement !==
      fuelView
    ) {

      const header =
        fuelHeader(
          fuelView
        );


      if (header) {

        header.insertAdjacentElement(
          "afterend",
          targets
        );

      } else {

        fuelView.prepend(
          targets
        );

      }
    }


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

  function ensureMealSelection(
    fuelView
  ) {
    let panel =
      document.getElementById(
        QUICK_ID
      );


    /*
      If the old script never managed
      to build the panel because the
      old diary was hidden, create it.
    */

    if (!panel) {

      panel =
        document.createElement(
          "div"
        );


      panel.id =
        QUICK_ID;


      panel.innerHTML = `

        <div
          class="fuel-v611-title"
        >
          Meal Selection
        </div>

        <div
          class="mana-v902-meal-sub"
        >
          Choose where you want to
          add your meal.
        </div>


        <div
          class="fuel-v611-grid"
        >

          <button
            type="button"
            class="fuel-v611-btn"
            data-v611-meal="Breakfast"
          >
            Breakfast
          </button>


          <button
            type="button"
            class="fuel-v611-btn"
            data-v611-meal="Lunch"
          >
            Lunch
          </button>


          <button
            type="button"
            class="fuel-v611-btn"
            data-v611-meal="Dinner"
          >
            Dinner
          </button>


          <button
            type="button"
            class="fuel-v611-btn"
            data-v611-meal="Snacks"
          >
            Snacks
          </button>

        </div>

      `;

    }


    /*
      Force Meal Selection into
      the Fuel screen too.
    */

    const targets =
      document.getElementById(
        TARGETS_ID
      );


    if (
      panel.parentElement !==
      fuelView
    ) {

      if (targets) {

        targets.insertAdjacentElement(
          "afterend",
          panel
        );

      } else {

        fuelView.appendChild(
          panel
        );

      }
    }


    const title =
      panel.querySelector(
        ".fuel-v611-title"
      );


    if (title) {
      title.textContent =
        "Meal Selection";
    }


    /*
      Add subtitle once.
    */

    if (
      !panel.querySelector(
        ".mana-v902-meal-sub"
      )
    ) {

      const subtitle =
        document.createElement(
          "div"
        );


      subtitle.className =
        "mana-v902-meal-sub";


      subtitle.textContent =
        "Choose where you want to add your meal.";


      title
        ?.insertAdjacentElement(
          "afterend",
          subtitle
        );
    }
  }


  /* =========================================
     REMOVE OLD STATIC CARDS
     ========================================= */

  function removeOldFuelCards(
    fuelView
  ) {
    [
      ...fuelView.children
    ].forEach(
      child => {

        if (
          child.id === TARGETS_ID ||
          child.id === QUICK_ID
        ) {
          return;
        }


        /*
          Keep the actual Fuel
          page heading.
        */

        if (
          child.classList
            .contains(
              "row"
            )
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


        const remove =
          text.includes(
            "move with purpose. fuel with purpose"
          ) ||

          text.includes(
            "daily foundations"
          ) ||

          text.includes(
            "today's meals"
          ) ||

          text.includes(
            "daily meal record"
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
          ) ||

          text.includes(
            "last 7 days"
          );


        if (remove) {

          child.style.display =
            "none";
        }

      }
    );
  }


  /* =========================================
     GLOBAL OLD TRACKER CLEANUP
     ========================================= */

  function hideOldGlobalTracker() {
    const dashboard =
      document.getElementById(
        "fuelV57Dashboard"
      );


    if (dashboard) {
      dashboard.style.display =
        "none";
    }


    const summary =
      document.getElementById(
        "fuelV60Summary"
      );


    if (summary) {
      summary.style.display =
        "none";
    }


    /*
      Catch old sections even if
      older Fuel code placed them
      outside clientFuelView.
    */

    [
      ...document.querySelectorAll(
        ".card, section"
      )
    ].forEach(
      element => {

        const fuelView =
          document.getElementById(
            FUEL_VIEW_ID
          );


        if (
          fuelView &&
          fuelView.contains(
            element
          )
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

          element.style.display =
            "none";
        }

      }
    );
  }


  /* =========================================
     CLEAN
     ========================================= */

  function cleanFuelScreen() {
    const fuelView =
      document.getElementById(
        FUEL_VIEW_ID
      );


    if (!fuelView) return;


    /*
      Important order:
      move panels FIRST,
      then hide old tracker.
    */

    moveTargetsIntoFuel(
      fuelView
    );


    ensureMealSelection(
      fuelView
    );


    removeOldFuelCards(
      fuelView
    );


    hideOldGlobalTracker();
  }


  /* =========================================
     WATCHER
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


  function watchPage() {
    const observer =
      new MutationObserver(
        scheduleClean
      );


    observer.observe(
      document.body,
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
      250
    );


    setTimeout(
      cleanFuelScreen,
      800
    );


    setTimeout(
      cleanFuelScreen,
      1600
    );


    watchPage();


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
            80
          );

        }


        if (
          event.target.closest(
            '[data-page="home"]'
          )
        ) {

          /*
            Re-check that nothing
            has escaped back to Home.
          */

          setTimeout(
            cleanFuelScreen,
            80
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
