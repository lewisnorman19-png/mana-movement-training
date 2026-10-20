/* =========================================
   MANA MOVEMENT TRAINING v10.12.3
   LEAN MOBILE DEMO + WORKOUT POLISH

   BUILD: 101230

   PURPOSE
   -----------------------------------------
   - Rename FORM GUIDE to DEMO
   - Permanently hide HOW TO PERFORM
   - Keep universal premium Demo
   - Larger muscle artwork on phone
   - Handle mobile carousel rebuilds
   - Observe ONLY workout exercise area
   - No whole-page observer
   - No repeated Demo opening
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "101230";


  const STYLE_ID =
    "mana-v10123-demo-ui-polish-style";


  let observer =
    null;


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
         REMOVE REDUNDANT OLD BUTTON
         ===================================== */

      #manaV64Exercises
      .mana-v955-demo-button,

      #manaV64Exercises
      .mana-v957-demo-button{

        display:
          none
          !important;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:600px){

        #manaV64Exercises
        .m10111-target{

          grid-template-columns:
            165px
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

          margin:
            10px
            0
            12px
            !important;

        }


        #manaV64Exercises
        .m10111-image{

          width:
            165px
            !important;

          height:
            165px
            !important;

          min-width:
            165px
            !important;

          min-height:
            165px
            !important;

          border-radius:
            16px
            !important;

        }


        #manaV64Exercises
        .m10111-image img{

          width:
            100%
            !important;

          height:
            100%
            !important;

          object-fit:
            cover
            !important;

          border-radius:
            15px
            !important;

        }


        #manaV64Exercises
        .m10111-copy{

          min-width:
            0
            !important;

          padding-right:
            2px
            !important;

        }


        #manaV64Exercises
        .m10111-kicker{

          font-size:
            8px
            !important;

          letter-spacing:
            .08em
            !important;

        }


        #manaV64Exercises
        .m10111-target-name{

          font-size:
            15px
            !important;

          line-height:
            1.15
            !important;

        }


        #manaV64Exercises
        .m10111-note{

          font-size:
            8px
            !important;

          line-height:
            1.3
            !important;

        }

      }


      /* =====================================
         NORMAL SMALL PHONE
         ===================================== */

      @media(max-width:420px){

        #manaV64Exercises
        .m10111-target{

          grid-template-columns:
            150px
            minmax(0,1fr)
            !important;

          gap:
            9px
            !important;

          padding:
            9px
            !important;

        }


        #manaV64Exercises
        .m10111-image{

          width:
            150px
            !important;

          height:
            150px
            !important;

          min-width:
            150px
            !important;

          min-height:
            150px
            !important;

        }


        #manaV64Exercises
        .m10111-target-name{

          font-size:
            14px
            !important;

        }


        #manaV64Exercises
        .m10111-kicker{

          font-size:
            7px
            !important;

        }

      }


      /* =====================================
         VERY NARROW PHONE
         ===================================== */

      @media(max-width:360px){

        #manaV64Exercises
        .m10111-target{

          grid-template-columns:
            135px
            minmax(0,1fr)
            !important;

          gap:
            8px
            !important;

        }


        #manaV64Exercises
        .m10111-image{

          width:
            135px
            !important;

          height:
            135px
            !important;

          min-width:
            135px
            !important;

          min-height:
            135px
            !important;

        }

      }

    `;


    document.head.appendChild(
      style
    );

  }


  /* =========================================
     RENAME GUIDE BUTTON
     ========================================= */

  function renameDemoButtons(
    root = document
  ) {

    root
      .querySelectorAll(
        "[data-v970-guide]"
      )
      .forEach(
        button => {

          button.textContent =
            "DEMO";


          button.setAttribute(
            "aria-label",
            "Open exercise demo"
          );

        }
      );

  }


  /* =========================================
     REMOVE / HIDE OLD HOW TO PERFORM
     ========================================= */

  function hideOldButtons(
    root = document
  ) {

    root
      .querySelectorAll(
        [
          ".mana-v955-demo-button",
          ".mana-v957-demo-button"
        ].join(",")
      )
      .forEach(
        button => {

          button.style.setProperty(
            "display",
            "none",
            "important"
          );


          button.setAttribute(
            "aria-hidden",
            "true"
          );


          button.tabIndex =
            -1;

        }
      );


    /*
      Safety for any old button rebuilt
      without its expected CSS class.
    */

    root
      .querySelectorAll(
        "#manaV64Exercises button"
      )
      .forEach(
        button => {

          const text =
            normalise(
              button.textContent
            )
            .toUpperCase();


          if (
            text ===
              "HOW TO PERFORM" ||

            text ===
              "HOW TO PERFORM →" ||

            text ===
              "VISUAL DEMO"
          ) {

            if (
              !button.hasAttribute(
                "data-v970-guide"
              )
            ) {

              button.style.setProperty(
                "display",
                "none",
                "important"
              );


              button.setAttribute(
                "aria-hidden",
                "true"
              );


              button.tabIndex =
                -1;

            }

          }

        }
      );

  }


  /* =========================================
     REFRESH CARD UI
     ========================================= */

  function refreshWorkoutUI() {

    renameDemoButtons();

    hideOldButtons();

  }


  function scheduleRefresh(
    delay = 50
  ) {

    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        refreshWorkoutUI,
        delay
      );

  }


  /* =========================================
     OPEN PREMIUM DEMO
     ========================================= */

  function openPremiumDemo(
    name
  ) {

    if (!name) {

      return;

    }


    if (
      typeof
        window.openManaExerciseGuide ===
      "function"
    ) {

      window.openManaExerciseGuide(
        name
      );

      return;

    }


    if (
      typeof
        window.MANA_EXERCISE_VISUALS
          ?.openDemo ===
      "function"
    ) {

      window.MANA_EXERCISE_VISUALS
        .openDemo(
          name
        );

    }

  }


  /* =========================================
     DEMO BRIDGE

     ONE universal open only.
     ========================================= */

  function bindDemoBridge() {

    document.addEventListener(

      "click",

      event => {

        const button =
          event.target.closest(
            "[data-v970-guide]"
          );


        if (!button) {

          return;

        }


        const card =
          button.closest(
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
          Let old handler finish,
          replace it once.
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
     TARGETED MOBILE WORKOUT OBSERVER

     IMPORTANT:
     We do NOT watch document.body.

     We only watch #manaV64Exercises because
     v9.71 rebuilds mobile exercise cards there.
     ========================================= */

  function attachWorkoutObserver() {

    const workout =
      document.getElementById(
        "manaV64Exercises"
      );


    if (!workout) {

      return false;

    }


    observer?.disconnect();


    observer =
      new MutationObserver(
        mutations => {

          let needsRefresh =
            false;


          for (
            const mutation
            of mutations
          ) {

            if (
              mutation.addedNodes.length ||
              mutation.removedNodes.length
            ) {

              needsRefresh =
                true;

              break;

            }

          }


          if (
            needsRefresh
          ) {

            scheduleRefresh(
              40
            );

          }

        }
      );


    observer.observe(
      workout,
      {

        childList:
          true,

        subtree:
          true

      }
    );


    refreshWorkoutUI();


    return true;

  }


  /* =========================================
     WORKOUT ENTRY

     Attach observer only when workout exists.
     ========================================= */

  function findWorkout() {

    if (
      attachWorkoutObserver()
    ) {

      return;

    }


    /*
      Short startup retries only.
      Stops once workout exists.
    */

    let attempts =
      0;


    const timer =
      setInterval(
        () => {

          attempts +=
            1;


          if (
            attachWorkoutObserver() ||
            attempts >= 10
          ) {

            clearInterval(
              timer
            );

          }

        },
        250
      );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function bindEvents() {

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

          setTimeout(
            findWorkout,
            100
          );

        }

      }

    );


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        setTimeout(
          findWorkout,
          100
        );

      }
    );


    window.addEventListener(
      "mana:strength-synced",
      () => {

        scheduleRefresh(
          80
        );

      }
    );

  }


  /* =========================================
     PUBLIC BUILD
     ========================================= */

  function exposeBuild() {

    window.MANA_DEMO_UI_POLISH_BUILD =
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

    findWorkout();


    console.log(
      "Mana Mobile Demo Polish",
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
