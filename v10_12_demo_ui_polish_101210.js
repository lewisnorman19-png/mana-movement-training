/* =========================================
   MANA MOVEMENT TRAINING v10.12.1
   DEMO UI POLISH + FORM GUIDE BRIDGE

   BUILD: 101210

   PURPOSE
   -----------------------------------------
   - Rename FORM GUIDE to DEMO
   - Remove redundant HOW TO PERFORM button
   - Keep premium universal Demo opening
   - Increase workout illustration size on phone
   - Keep desktop layout unchanged
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "101210";


  const STYLE_ID =
    "mana-v10121-demo-ui-polish-style";


  /* =========================================
     HELPERS
     ========================================= */

  function normalise(
    value
  ) {

    return String(
      value ||
      ""
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

      card
        .dataset
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
     UI STYLES
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
         REMOVE REDUNDANT OLD DEMO BUTTON

         This is the old:
         HOW TO PERFORM / VISUAL DEMO button.

         DEMO now handles this job.
         ===================================== */

      .mana-v955-demo-button,
      .mana-v957-demo-button{
        display:none !important;
      }


      /* =====================================
         MOBILE MUSCLE VISUAL

         Give the artwork more presence now
         that the redundant button is gone.
         ===================================== */

      @media(max-width:600px){

        .m10111-target{

          grid-template-columns:
            150px
            minmax(0,1fr)
            !important;

          gap:
            12px
            !important;

          padding:
            11px
            !important;

          align-items:
            center
            !important;

        }


        .m10111-image{

          width:
            150px
            !important;

          height:
            150px
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


      /* =====================================
         SMALL PHONE
         ===================================== */

      @media(max-width:420px){

        .m10111-target{

          grid-template-columns:
            136px
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
            136px
            !important;

          height:
            136px
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


      /* =====================================
         VERY SMALL PHONE
         ===================================== */

      @media(max-width:360px){

        .m10111-target{

          grid-template-columns:
            124px
            minmax(0,1fr)
            !important;

        }


        .m10111-image{

          width:
            124px
            !important;

          height:
            124px
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
     ========================================= */

  function renameGuideButtons() {

    document
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
     REMOVE OLD HOW TO PERFORM BUTTONS
     ========================================= */

  function removeOldDemoButtons() {

    document
      .querySelectorAll(
        [
          ".mana-v955-demo-button",
          ".mana-v957-demo-button"
        ].join(",")
      )
      .forEach(
        button => {

          button.remove();

        }
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

     Ensures the old FORM GUIDE button now
     opens our premium universal Demo.
     ========================================= */

  function bindDemoButton() {

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
          Let the old handler complete first,
          then replace its modal with our
          premium Demo.
        */

        setTimeout(
          () => {

            openPremiumDemo(
              name
            );

          },
          0
        );


        setTimeout(
          () => {

            openPremiumDemo(
              name
            );

          },
          120
        );

      }

    );

  }


  /* =========================================
     REFRESH UI
     ========================================= */

  function refreshUI() {

    renameGuideButtons();

    removeOldDemoButtons();

  }


  function scheduleRefresh() {

    [
      80,
      250,
      600,
      1200
    ]
      .forEach(
        delay => {

          setTimeout(
            refreshUI,
            delay
          );

        }
      );

  }


  /* =========================================
     WATCH DYNAMIC WORKOUT CARDS
     ========================================= */

  function watchWorkout() {

    const observer =
      new MutationObserver(
        mutations => {

          let relevant =
            false;


          for (
            const mutation
            of mutations
          ) {

            if (
              mutation.addedNodes
                .length
            ) {

              relevant =
                true;

              break;

            }

          }


          if (relevant) {

            scheduleRefresh();

          }

        }
      );


    observer.observe(
      document.body,
      {

        childList:
          true,

        subtree:
          true

      }
    );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function bindEvents() {

    window.addEventListener(
      "mana:workout-progress-change",
      scheduleRefresh
    );


    window.addEventListener(
      "mana:program-tab-change",
      scheduleRefresh
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
          )
        ) {

          scheduleRefresh();

        }

      }

    );

  }


  /* =========================================
     PUBLIC BUILD MARKER
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

    bindDemoButton();

    bindEvents();

    watchWorkout();

    scheduleRefresh();


    console.log(
      "Mana Demo UI Polish",
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
