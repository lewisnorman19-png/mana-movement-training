/* =========================================
   MANA MOVEMENT TRAINING v9.32.1
   MOBILE POST-WORKOUT PROGRAM RETURN

   NEW FLOW
   - COMPLETE WORKOUT
   - CLOSE COMPLETION SCREEN
   - OPEN MANA STRENGTH ONCE
   - MOVE DIRECTLY TO PROGRAM TAB
   - REFRESH PROGRAM CARDS ONCE
   - NO OVERVIEW REBUILD
   - NO MULTIPLE REPAIR PASSES
   - NO FLICKER LOOP
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "93210";

  let handling =
    false;


  function mobileLike() {

    return Boolean(

      window.matchMedia?.(
        "(max-width: 700px)"
      )?.matches ||

      window.matchMedia?.(
        "(pointer: coarse)"
      )?.matches

    );
  }


  function openProgramTab() {

    document
      .querySelector(
        '#manaV83Tabs ' +
        '[data-v83-tab="program"]'
      )
      ?.click();
  }


  function openStrengthProgramOnce() {

    if (
      handling
    ) {
      return;
    }


    handling =
      true;


    /*
      Close workout complete screen.
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
      Open Strength shell once.
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
      Move directly to Program.
    */

    setTimeout(
      () => {

        openProgramTab();

      },
      60
    );


    /*
      One controlled program refresh.
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
      160
    );


    /*
      Final visual check only.
      No Overview rebuild functions.
    */

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


        handling =
          false;

      },
      320
    );
  }


  function handleClick(
    event
  ) {

    if (
      !mobileLike()
    ) {
      return;
    }


    const button =
      event.target.closest(
        "#manaV915Back"
      );


    if (
      !button
    ) {
      return;
    }


    event.preventDefault();

    event.stopPropagation();

    event.stopImmediatePropagation();


    openStrengthProgramOnce();
  }


  function init() {

    if (
      !mobileLike()
    ) {
      return;
    }


    document.addEventListener(
      "click",
      handleClick,
      true
    );
  }


  window
    .MANA_MOBILE_POST_WORKOUT_BUILD =
    BUILD;


  window
    .openManaPostWorkoutProgram =
    openStrengthProgramOnce;


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
