/* =========================================
   MANA MOVEMENT TRAINING v9.66.0
   POST-WORKOUT RETURN FIX

   PURPOSE
   - COMPLETE SCREEN RETURNS TO PROGRAM
   - NOT OVERVIEW
   - DESKTOP + TABLET
   - HIDES OVERVIEW DURING TRANSITION
   - REDUCES VISIBLE FLASH / FLICKER
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "96600";

  const STYLE_ID =
    "mana-v966-return-style";

  let returning =
    false;


  /* =========================================
     STYLE
     ========================================= */

  function installStyle() {

    if (
      document.getElementById(
        STYLE_ID
      )
    ) {
      return;
    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      #manaV83ProgramShell.mana-v966-returning{
        visibility:hidden !important;
        opacity:0 !important;
      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     HELPERS
     ========================================= */

  function strengthShell() {

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


  function revealProgram() {

    const shell =
      strengthShell();


    shell
      ?.classList
      .remove(
        "mana-v966-returning"
      );


    returning =
      false;
  }


  /* =========================================
     RETURN
     ========================================= */

  function returnToProgram() {

    if (
      returning
    ) {
      return;
    }


    returning =
      true;


    /*
      Close workout-complete screen.
    */

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


    /*
      Hide the Strength shell before opening it.

      openManaProgram("strength") always begins
      on Overview. Keeping the shell invisible
      prevents that intermediate Overview screen
      from flashing on screen.
    */

    const existingShell =
      strengthShell();


    existingShell
      ?.classList
      .add(
        "mana-v966-returning"
      );


    /*
      Open Mana Strength.
    */

    if (
      typeof
        window.openManaProgram ===
      "function"
    ) {

      window.openManaProgram(
        "strength"
      );

    }


    /*
      openManaProgram creates/renders the tabs
      synchronously, so immediately select
      Program.
    */

    const shell =
      strengthShell();


    shell
      ?.classList
      .add(
        "mana-v966-returning"
      );


    programButton()
      ?.click();


    /*
      Give the existing v8.5 Program renderer
      its normal 100ms to build the workout
      cards, then apply our card decoration.
    */

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
      120
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
      170
    );


    /*
      Reveal only once Program is ready.
    */

    setTimeout(
      revealProgram,
      220
    );


    /*
      Safety fallback.
    */

    setTimeout(
      () => {

        if (
          returning
        ) {

          revealProgram();

        }

      },
      500
    );
  }


  /* =========================================
     BUTTON
     ========================================= */

  function decorateButton() {

    const button =
      document.getElementById(
        "manaV915Back"
      );


    if (
      button
    ) {

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


    if (
      !button
    ) {
      return;
    }


    /*
      Mobile v9.32 already owns its controlled
      route.

      This handler mainly replaces the old
      desktop v9.15 onclick behaviour.
    */

    const mobile =
      Boolean(

        window.matchMedia?.(
          "(max-width: 700px)"
        )?.matches ||

        window.matchMedia?.(
          "(pointer: coarse)"
        )?.matches

      );


    if (
      mobile
    ) {
      return;
    }


    event.preventDefault();

    event.stopPropagation();

    event.stopImmediatePropagation();


    returnToProgram();
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyle();


    document.addEventListener(
      "click",
      handleClick,
      true
    );


    [
      300,
      900,
      1600
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
