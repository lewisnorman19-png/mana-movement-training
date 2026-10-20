/* =========================================
   MANA MOVEMENT TRAINING v10.12.4
   LEAN MOBILE DEMO + WORKOUT POLISH

   BUILD: 101240

   PURPOSE
   -----------------------------------------
   - Rename FORM GUIDE to DEMO
   - Permanently hide HOW TO PERFORM
   - Keep universal premium Demo
   - Larger muscle artwork on phone
   - Handle mobile carousel rebuilds
   - Observe ONLY workout exercise area
   - Correct LEG CURL mapping to HAMSTRINGS
   - Correct LEG CURL Demo coaching cues
   - No whole-page observer
   - No repeated Demo opening
   ========================================= */

(() => {
  "use strict";


  /* =========================================
     BUILD
     ========================================= */

  const BUILD =
    "101240";


  const STYLE_ID =
    "mana-v10124-demo-ui-polish-style";


  const ROOT =
    "assets/exercises/";


  let observer =
    null;


  let refreshTimer =
    null;


  let guideTimer =
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


  function isLegCurl(
    name
  ) {

    const clean =
      normalise(
        name
      )
      .toLowerCase();


    return (

      clean.includes(
        "leg curl"
      ) ||

      clean.includes(
        "hamstring curl"
      )

    );

  }


  function versionedAsset(
    filename
  ) {

    return (
      ROOT +
      filename +
      "?v=" +
      BUILD
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
     LEG CURL CORRECTION

     The universal engine previously matched
     generic "curl" before reaching Leg Curl.

     Force Leg Curl back to:
     - Hamstrings
     - Posterior illustration
     ========================================= */

  function fixLegCurlCard(
    card
  ) {

    if (!card) {

      return;

    }


    const name =
      exerciseNameFromCard(
        card
      );


    if (
      !isLegCurl(
        name
      )
    ) {

      return;

    }


    const target =
      card.querySelector(
        ".m10111-target"
      );


    if (!target) {

      return;

    }


    const image =
      target.querySelector(
        ".m10111-image img"
      );


    const fallback =
      target.querySelector(
        ".m10111-fallback"
      );


    const targetName =
      target.querySelector(
        ".m10111-target-name"
      );


    const ring =
      target.querySelector(
        ".m10111-ring"
      );


    if (image) {

      const correctSrc =
        versionedAsset(
          "muscle-glutes-hamstrings.png"
        );


      if (
        image.dataset
          .manaLegCurlFixed !==
        BUILD
      ) {

        image.dataset
          .manaLegCurlFixed =
          BUILD;


        image.alt =
          "Hamstrings";


        image.onload =
          () => {

            image.style.display =
              "block";


            if (fallback) {

              fallback.style.display =
                "none";

            }

          };


        image.src =
          correctSrc;

      }

    }


    if (
      targetName
    ) {

      targetName.textContent =
        "Hamstrings";

    }


    if (
      ring
    ) {

      ring.textContent =
        "HAMSTRINGS";

    }


    target.dataset
      .manaLegCurlCorrected =
      BUILD;

  }


  function fixLegCurlCards(
    root = document
  ) {

    root
      .querySelectorAll(
        "#manaV64Exercises .mana-v64-card"
      )
      .forEach(
        fixLegCurlCard
      );

  }


  /* =========================================
     LEG CURL DEMO GUIDE CORRECTION
     ========================================= */

  function fixLegCurlGuide(
    name
  ) {

    if (
      !isLegCurl(
        name
      )
    ) {

      return;

    }


    const modal =
      document.getElementById(
        "manaV970FormGuide"
      );


    if (!modal) {

      return;

    }


    const subtitle =
      modal.querySelector(
        ".m10116-subtitle"
      );


    if (
      subtitle
    ) {

      subtitle.textContent =
        "Hamstrings";

    }


    const cueList =
      modal.querySelector(
        ".m10116-coaching ul"
      );


    if (
      cueList
    ) {

      cueList.innerHTML = `

        <li>
          Keep the hips and torso stable.
        </li>

        <li>
          Curl the heels toward the glutes.
        </li>

        <li>
          Squeeze the hamstrings at the top.
        </li>

        <li>
          Lower the weight under control.
        </li>

      `;

    }


    const avoid =
      modal.querySelector(
        ".m10116-avoid"
      );


    if (
      avoid
    ) {

      avoid.innerHTML = `

        <strong>
          Avoid:
        </strong>

        Avoid lifting the hips or using momentum
        to move the weight.

      `;

    }


    /*
      v10.13 removes the duplicate single cue,
      but update it too in case this runs first.
    */

    const singleCue =
      modal.querySelector(
        ".m10111-cue"
      );


    if (
      singleCue
    ) {

      singleCue.textContent =
        "Curl under control and squeeze the hamstrings.";

    }

  }


  function scheduleLegCurlGuideFix(
    name
  ) {

    clearTimeout(
      guideTimer
    );


    /*
      Universal guide loads the player
      asynchronously, so perform two very
      small targeted passes.
    */

    setTimeout(
      () => {

        fixLegCurlGuide(
          name
        );

      },
      80
    );


    guideTimer =
      setTimeout(
        () => {

          fixLegCurlGuide(
            name
          );

        },
        350
      );

  }


  /* =========================================
     REFRESH CARD UI
     ========================================= */

  function refreshWorkoutUI() {

    renameDemoButtons();

    hideOldButtons();

    fixLegCurlCards();

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


      scheduleLegCurlGuideFix(
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


      scheduleLegCurlGuideFix(
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


    window.MANA_LEG_CURL_MAPPING_BUILD =
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


    console.log(
      "Mana Leg Curl Mapping",
      "Hamstrings",
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
