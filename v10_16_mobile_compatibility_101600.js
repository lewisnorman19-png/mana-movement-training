/* =========================================
   MANA MOVEMENT TRAINING v10.16.0
   DESKTOP FUEL + MOBILE COMPATIBILITY

   BUILD: 101600

   PURPOSE
   -----------------------------------------
   1. DESKTOP FUEL ONLY
      - Give meal illustrations more room
      - Keep phone Fuel untouched

   2. MOBILE PROFILE
      - Restore / maintain master Profile
        button after dynamic program rebuilds

   3. MOBILE WORKOUT
      - Restore clean Previous / Next arrows
      - Remove oversized text controls

   IMPORTANT
   -----------------------------------------
   - Does NOT rebuild Fuel
   - Does NOT alter Fuel storage
   - Does NOT alter phone Fuel layout
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "101600";


  const STYLE_ID =
    "mana-v10160-compatibility-style";


  let refreshTimer =
    null;


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
         DESKTOP FUEL ONLY

         Phone rules in v10.15 remain exactly
         as they are.
         ===================================== */

      @media(min-width:601px){

        #manaV1015Fuel
        .m1015-category{

          min-height:
            164px !important;

        }


        #manaV1015Fuel
        .m1015-category img{

          height:
            108px !important;

          object-fit:
            cover !important;

          object-position:
            center !important;

        }


        #manaV1015Fuel
        .m1015-category-copy{

          min-height:
            54px !important;

          padding:
            8px
            36px
            8px
            11px !important;

        }


        #manaV1015Fuel
        .m1015-category-arrow{

          bottom:
            17px !important;

        }

      }


      /* =====================================
         MOBILE WORKOUT NAVIGATION

         Keep the carousel controls compact
         and display arrows only.
         ===================================== */

      @media(max-width:700px){

        #manaV971BottomNav
        .mana-v971-nav-btn{

          position:
            relative !important;

          display:
            grid !important;

          place-items:
            center !important;

          min-height:
            62px !important;

          height:
            62px !important;

          padding:
            0 !important;

          margin:
            0 !important;

          overflow:
            hidden !important;

          font-size:
            0 !important;

          line-height:
            1 !important;

          text-indent:
            0 !important;

          color:
            transparent !important;

        }


        #manaV971Previous::before{

          content:
            "←";

          display:
            block;

          color:
            #f3d875;

          font-size:
            37px;

          font-weight:
            800;

          line-height:
            1;

        }


        #manaV971Next::before{

          content:
            "→";

          display:
            block;

          color:
            #f3d875;

          font-size:
            37px;

          font-weight:
            800;

          line-height:
            1;

        }


        #manaV971BottomNav
        .mana-v971-nav-btn:disabled::before{

          color:
            #555;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     PROFILE RESTORE
     ========================================= */

  function restoreProfile() {

    try {

      if (
        typeof
          window
            .ManaProfileRecovery
            ?.refresh ===
        "function"
      ) {

        window
          .ManaProfileRecovery
          .refresh();

      }

    } catch (_) {}

  }


  /* =========================================
     WORKOUT ARROW ACCESSIBILITY
     ========================================= */

  function restoreWorkoutArrows() {

    const previous =
      document.getElementById(
        "manaV971Previous"
      );


    const next =
      document.getElementById(
        "manaV971Next"
      );


    previous
      ?.setAttribute(
        "aria-label",
        "Previous exercise"
      );


    next
      ?.setAttribute(
        "aria-label",
        "Next exercise"
      );

  }


  /* =========================================
     MASTER REFRESH
     ========================================= */

  function refresh() {

    installStyles();

    restoreProfile();

    restoreWorkoutArrows();

  }


  function scheduleRefresh() {

    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        refresh,
        20
      );


    /*
      Program headers and workout navigation
      are rebuilt dynamically.

      These short passes catch those rebuilds
      without running a permanent interval.
    */

    [
      80,
      220,
      500,
      900
    ]
      .forEach(
        delay => {

          setTimeout(
            refresh,
            delay
          );

        }
      );

  }


  /* =========================================
     USER INTERACTION
     ========================================= */

  function bindClicks() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            [
              "#manaV83Tabs .mana-v83-tab",
              ".mana-v85-start",
              "[data-v85-day]",
              "#manaV971Previous",
              "#manaV971Next",
              "[data-v971-index]",
              ".mana-v970-action",
              "#manaV83Back"
            ].join(",")
          )
        ) {

          scheduleRefresh();

        }

      },
      true
    );

  }


  /* =========================================
     APP EVENTS
     ========================================= */

  function bindEvents() {

    [
      "mana:program-tab-change",
      "mana:workout-progress-change",
      "mana:workout-feedback-saved",
      "mana:profile-synced"
    ]
      .forEach(
        eventName => {

          window.addEventListener(
            eventName,
            scheduleRefresh
          );

        }
      );


    window.addEventListener(
      "pageshow",
      scheduleRefresh
    );


    window.addEventListener(
      "focus",
      scheduleRefresh
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          scheduleRefresh();

        }

      }
    );

  }


  /* =========================================
     PUBLIC API
     ========================================= */

  function expose() {

    window
      .refreshManaCompatibility =
      scheduleRefresh;


    window
      .MANA_COMPATIBILITY_BUILD =
      BUILD;

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    expose();

    bindClicks();

    bindEvents();

    scheduleRefresh();


    console.log(
      "Mana compatibility",
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
