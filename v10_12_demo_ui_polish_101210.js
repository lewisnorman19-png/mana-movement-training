/* =========================================
   MANA MOVEMENT TRAINING v10.12.2
   LEAN DEMO UI BRIDGE

   BUILD: 101220

   PURPOSE
   -----------------------------------------
   - Rename FORM GUIDE to DEMO
   - Hide redundant HOW TO PERFORM button
   - Open premium Demo once only
   - Larger phone muscle artwork
   - NO page-wide MutationObserver
   - NO repeated DOM refresh loop
   - NO double Demo loading
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "101220";

  const STYLE_ID =
    "mana-v10122-demo-ui-polish-style";

  let refreshTimer =
    null;


  /* =========================================
     HELPERS
     ========================================= */

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


  function exerciseNameFromCard(
    card
  ) {

    if (!card) {

      return "";

    }


    return normalise(

      card.dataset
        .exerciseName ||

      card
        .querySelector(
          ".mana-v64-name"
        )
        ?.textContent ||

      card
        .querySelector(
          "h3"
        )
        ?.textContent ||

      ""

    );

  }


  /* =========================================
     STYLES

     IMPORTANT:
     Hide old button with CSS.
     Do NOT continually remove it from DOM.
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

      /* OLD REDUNDANT HOW TO PERFORM */

      .mana-v955-demo-button,
      .mana-v957-demo-button{
        display:none !important;
      }


      /* =====================================
         PHONE MUSCLE ARTWORK
         ===================================== */

      @media(max-width:600px){

        .m10111-target{
          grid-template-columns:
            148px
            minmax(0,1fr)
            !important;

          gap:
            11px
            !important;

          padding:
            10px
            !important;

          align-items:
            center
            !important;
        }


        .m10111-image{
          width:
            148px
            !important;

          height:
            148px
            !important;

          border-radius:
            15px
            !important;
        }


        .m10111-image img{
          border-radius:
            14px
            !important;
        }


        .m10111-target-name{
          font-size:
            15px
            !important;

          line-height:
            1.15
            !important;
        }


        .m10111-kicker{
          font-size:
            8px
            !important;

          letter-spacing:
            .10em
            !important;
        }


        .m10111-note{
          font-size:
            9px
            !important;
        }

      }


      @media(max-width:420px){

        .m10111-target{
          grid-template-columns:
            132px
            minmax(0,1fr)
            !important;

          gap:
            9px
            !important;

          padding:
            9px
            !important;
        }


        .m10111-image{
          width:
            132px
            !important;

          height:
            132px
            !important;
        }


        .m10111-target-name{
          font-size:
            14px
            !important;
        }


        .m10111-kicker{
          font-size:
            7px
            !important;
        }


        .m10111-note{
          font-size:
            8px
            !important;
        }

      }


      @media(max-width:360px){

        .m10111-target{
          grid-template-columns:
            120px
            minmax(0,1fr)
            !important;
        }


        .m10111-image{
          width:
            120px
            !important;

          height:
            120px
            !important;
        }

      }

    `;


    document
      .head
      .appendChild(
        style
      );

  }


  /* =========================================
     RENAME FORM GUIDE -> DEMO

     This only touches the actual buttons.
     ========================================= */

  function renameDemoButtons() {

    document
      .querySelectorAll(
        "[data-v970-guide]"
      )
      .forEach(
        button => {

          if (
            button.textContent
              .trim() !==
            "DEMO"
          ) {

            button.textContent =
              "DEMO";

          }


          button.setAttribute(
            "aria-label",
            "Open exercise demo"
          );

        }
      );

  }


  /* =========================================
     LIGHT REFRESH

     One timer only.
     ========================================= */

  function scheduleRefresh(
    delay = 120
  ) {

    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        renameDemoButtons,
        delay
      );

  }


  /* =========================================
     OPEN PREMIUM DEMO

     ONE call only.
     ========================================= */

  function openPremiumDemo(
    name
  ) {

    if (!name) {

      return;

    }


    if (
      typeof
        window
          .openManaExerciseGuide ===
      "function"
    ) {

      window
        .openManaExerciseGuide(
          name
        );

      return;

    }


    if (
      typeof
        window
          .MANA_EXERCISE_VISUALS
          ?.openDemo ===
      "function"
    ) {

      window
        .MANA_EXERCISE_VISUALS
        .openDemo(
          name
        );

    }

  }


  /* =========================================
     DEMO BUTTON BRIDGE

     Let v9.70 perform its normal click once,
     then replace that guide once.

     No second safety-open.
     No mutation watcher.
     ========================================= */

  function bindDemoBridge() {

    document.addEventListener(

      "click",

      event => {

        const button =
          event
            .target
            .closest(
              "[data-v970-guide]"
            );


        if (!button) {

          return;

        }


        const card =
          button
            .closest(
              ".mana-v64-card"
            );


        const name =
          exerciseNameFromCard(
            card
          );


        if (!name) {

          return;

        }


        /*
          Old guide opens synchronously.

          Replace it once on the next
          browser task.
        */

        setTimeout(
          () => {

            openPremiumDemo(
              name
            );

          },
          10
        );

      }

    );

  }


  /* =========================================
     EVENTS

     Refresh only when workout navigation
     genuinely changes.
     ========================================= */

  function bindEvents() {

    window.addEventListener(
      "mana:program-tab-change",
      () =>
        scheduleRefresh(
          120
        )
    );


    window.addEventListener(
      "mana:strength-synced",
      () =>
        scheduleRefresh(
          120
        )
    );


    document.addEventListener(

      "click",

      event => {

        if (

          event.target.closest(
            ".mana-v85-start"
          ) ||

          event.target.closest(
            "[data-v85-day]"
          ) ||

          event.target.closest(
            '[data-v83-tab="program"]'
          )

        ) {

          scheduleRefresh(
            180
          );

        }

      }

    );

  }


  /* =========================================
     PUBLIC BUILD
     ========================================= */

  function exposeBuild() {

    window
      .MANA_DEMO_UI_POLISH_BUILD =
      BUILD;

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    exposeBuild();

    bindDemoBridge();

    bindEvents();


    renameDemoButtons();


    /*
      Two small startup passes only.
      No continuous observer.
    */

    setTimeout(
      renameDemoButtons,
      400
    );


    setTimeout(
      renameDemoButtons,
      1000
    );


    console.log(
      "Mana Lean Demo UI",
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
