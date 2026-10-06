/* =========================================
   MANA MOVEMENT TRAINING v9.95.1
   STRENGTH FUEL — POST MEAL RESTORE

   FIX
   - Meal add/change/remove rebuilds Fuel
   - Recovery restores immediately
   - Existing Fuel polish restores immediately
   - Existing chat system is left alone

   NO:
   - duplicate chat card
   - Fuel data reset
   - Profile changes
   - Workout changes
   - Timers
   - MutationObserver
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "99510";


  let restoreTimer =
    null;


  /* =========================================
     STATE
     ========================================= */

  function programTitle() {

    return (
      document
        .getElementById(
          "manaV83Title"
        )
        ?.textContent
        ?.trim()
        ?.toUpperCase()
      ||
      ""
    );

  }


  function activeTab() {

    return (
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab
      ||
      ""
    );

  }


  function strengthFuelOpen() {

    return Boolean(

      document
        .getElementById(
          "manaV83ProgramShell"
        )
        ?.classList
        .contains(
          "open"
        )

      &&

      programTitle() ===
        "MANA STRENGTH"

      &&

      activeTab() ===
        "fuel"

    );

  }


  /* =========================================
     RECOVERY
     ========================================= */

  function restoreRecovery() {

    if (
      !strengthFuelOpen()
    ) {

      return;

    }


    if (
      !document.getElementById(
        "manaV989Recovery"
      )
    ) {

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

    }

  }


  /* =========================================
     EXISTING FUEL POLISH
     ========================================= */

  function restoreFuelPolish() {

    if (
      !strengthFuelOpen()
    ) {

      return;

    }


    if (
      typeof
        window
          .refreshManaStrengthFuelPolish ===
      "function"
    ) {

      window
        .refreshManaStrengthFuelPolish(
          20
        );

    }

  }


  /* =========================================
     COMPLETE RESTORE
     ========================================= */

  function restoreFuelExtras() {

    if (
      !strengthFuelOpen()
    ) {

      return;

    }


    restoreRecovery();


    setTimeout(
      restoreFuelPolish,
      35
    );


    /*
      One bounded second pass catches
      the shared Fuel renderer finishing.
    */

    setTimeout(
      () => {

        restoreRecovery();

        restoreFuelPolish();

      },
      140
    );

  }


  function scheduleRestore(
    delay = 40
  ) {

    clearTimeout(
      restoreTimer
    );


    restoreTimer =
      setTimeout(
        restoreFuelExtras,
        delay
      );

  }


  /* =========================================
     FUEL UPDATED EVENT
     ========================================= */

  function announceFuelUpdated() {

    window.dispatchEvent(
      new CustomEvent(
        "mana:fuel-updated",
        {
          detail:{
            source:
              "meal-change"
          }
        }
      )
    );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function wireEvents() {

    document.addEventListener(
      "click",
      event => {

        const mealSelected =
          event.target.closest(
            "[data-v932-meal]"
          );


        const mealRemoved =
          event.target.closest(
            "[data-mana-remove-meal]"
          );


        const customMeal =
          event.target.closest(
            "#manaV941CustomSave"
          );


        if (
          mealSelected ||
          mealRemoved ||
          customMeal
        ) {

          /*
            Let existing Fuel save and redraw,
            then restore Recovery / layout.
          */

          setTimeout(
            () => {

              announceFuelUpdated();

              restoreFuelExtras();

            },
            35
          );


          return;

        }


        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="fuel"]'
          )
        ) {

          scheduleRestore(
            100
          );

        }

      },
      true
    );


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        if (
          strengthFuelOpen()
        ) {

          scheduleRestore(
            90
          );

        }

      }
    );


    window.addEventListener(
      "mana:fuel-updated",
      () => {

        if (
          strengthFuelOpen()
        ) {

          scheduleRestore(
            60
          );

        }

      }
    );


    window.addEventListener(
      "mana:recovery-updated",
      () => {

        if (
          strengthFuelOpen()
        ) {

          scheduleRestore(
            50
          );

        }

      }
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    wireEvents();


    if (
      strengthFuelOpen()
    ) {

      scheduleRestore(
        180
      );

    }


    window.MANA_STRENGTH_FUEL_RESTORE_BUILD =
      BUILD;


    window.refreshManaStrengthFuelExtras =
      scheduleRestore;


    console.log(
      "[Mana v9.95.1] " +
      "Strength Fuel restore ready"
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
