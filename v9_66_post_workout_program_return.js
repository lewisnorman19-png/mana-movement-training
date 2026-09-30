/* =========================================
   MANA MOVEMENT TRAINING v9.66.1
   UNIVERSAL POST-WORKOUT PROGRAM RETURN

   DESKTOP + PHONE + TABLET

   - COMPLETE WORKOUT
   - BACK TO PROGRAM
   - NEVER RETURNS TO OVERVIEW
   - HIDES INTERNAL OVERVIEW TRANSITION
   ========================================= */

(() => {
  "use strict";

  const BUILD = "96610";
  const STYLE_ID = "mana-v966-return-style";

  let returning = false;


  function installStyle() {

    document
      .getElementById(STYLE_ID)
      ?.remove();


    const style =
      document.createElement(
        "style"
      );


    style.id = STYLE_ID;


    style.textContent = `

      #manaV83ProgramShell.mana-v966-returning{
        visibility:hidden !important;
        opacity:0 !important;
        pointer-events:none !important;
      }

    `;


    document.head.appendChild(
      style
    );
  }


  function shell() {

    return document
      .getElementById(
        "manaV83ProgramShell"
      );
  }


  function programButton() {

    return document
      .querySelector(
        '#manaV83Tabs ' +
        '[data-v83-tab="program"]'
      );
  }


  function programIsActive() {

    return Boolean(
      programButton()
        ?.classList
        .contains(
          "active"
        )
    );
  }


  function hideShell() {

    shell()
      ?.classList
      .add(
        "mana-v966-returning"
      );
  }


  function revealShell() {

    shell()
      ?.classList
      .remove(
        "mana-v966-returning"
      );


    returning = false;
  }


  function selectProgram() {

    const button =
      programButton();


    if (!button) {
      return false;
    }


    button.click();

    return true;
  }


  function returnToProgram() {

    if (returning) {
      return;
    }


    returning = true;


    document
      .getElementById(
        "manaV915Complete"
      )
      ?.classList
      .remove(
        "open"
      );


    document.body.style.overflow =
      "";


    hideShell();


    if (
      typeof window.openManaProgram ===
      "function"
    ) {

      window.openManaProgram(
        "strength"
      );

    }


    hideShell();


    /*
      Try immediately.
    */

    selectProgram();


    /*
      Phone Safari / Home Screen can
      need a moment before the tab
      DOM settles.
    */

    setTimeout(
      () => {

        if (!programIsActive()) {

          selectProgram();

        }

      },
      60
    );


    setTimeout(
      () => {

        if (
          typeof
            window
              .refreshManaStrengthProgramCards ===
          "function"
        ) {

          window
            .refreshManaStrengthProgramCards();

        }

      },
      140
    );


    setTimeout(
      () => {

        if (
          typeof
            window
              .refreshManaStrengthLaunchpad ===
          "function"
        ) {

          window
            .refreshManaStrengthLaunchpad();

        }

      },
      190
    );


    /*
      Force Program again before reveal.
    */

    setTimeout(
      () => {

        selectProgram();

      },
      240
    );


    /*
      Reveal the shell once Program is ready.
    */

    setTimeout(
      () => {

        selectProgram();

        revealShell();

      },
      320
    );


    /*
      Safety fallback for slower phones.
    */

    setTimeout(
      () => {

        if (returning) {

          selectProgram();

          revealShell();

        }

      },
      700
    );
  }


  function decorateButton() {

    const button =
      document.getElementById(
        "manaV915Back"
      );


    if (button) {

      button.textContent =
        "BACK TO PROGRAM →";

    }
  }


  function handleClick(
    event
  ) {

    const button =
      event.target.closest(
        "#manaV915Back"
      );


    if (!button) {
      return;
    }


    /*
      UNIVERSAL:
      desktop + phone + tablet.
    */

    event.preventDefault();

    event.stopPropagation();

    event.stopImmediatePropagation();


    returnToProgram();
  }


  function init() {

    installStyle();


    document.addEventListener(
      "click",
      handleClick,
      true
    );


    [
      250,
      700,
      1400
    ].forEach(
      delay => {

        setTimeout(
          decorateButton,
          delay
        );

      }
    );


    window.addEventListener(
      "mana:strength-synced",
      decorateButton
    );


    window.MANA_POST_WORKOUT_PROGRAM_RETURN_BUILD =
      BUILD;


    window.returnManaWorkoutToProgram =
      returnToProgram;


    console.log(
      "[Mana v9.66.1] Universal post-workout return ready"
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
