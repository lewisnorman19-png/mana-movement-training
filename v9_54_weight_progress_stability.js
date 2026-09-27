/* =========================================
   MANA MOVEMENT TRAINING v9.54.0
   BODY WEIGHT PROGRESS STABILITY

   - Restores Weight Progress after the
     main Progress dashboard finishes rendering
   - Works after tab changes and app focus
   - No MutationObserver
   - No polling
   - No auth / Fuel changes
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "95400";


  let timers =
    [];


  function clearTimers() {

    timers.forEach(
      timer =>
        clearTimeout(
          timer
        )
    );


    timers =
      [];
  }


  function renderWeight() {

    if (
      typeof
        window
          .renderManaBodyWeightProgress !==
      "function"
    ) {
      return;
    }


    window
      .renderManaBodyWeightProgress();
  }


  function scheduleWeight() {

    clearTimers();


    /*
      v9.11 rebuilds Progress several times,
      including its final startup render
      at roughly 2400ms.

      These checks deliberately run after it.
    */

    [
      150,
      550,
      1100,
      2700,
      3200
    ].forEach(
      delay => {

        timers.push(
          setTimeout(
            renderWeight,
            delay
          )
        );

      }
    );
  }


  function progressIsActive() {

    return (
      document.querySelector(
        '#manaV83Tabs [data-v83-tab="progress"].active'
      ) !== null
    );
  }


  function wireEvents() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="progress"]'
          )
        ) {

          scheduleWeight();

        }

      }
    );


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        if (
          progressIsActive()
        ) {

          scheduleWeight();

        }

      }
    );


    window.addEventListener(
      "mana:strength-synced",
      () => {

        if (
          progressIsActive()
        ) {

          scheduleWeight();

        }

      }
    );


    window.addEventListener(
      "mana:body-weight-updated",
      () => {

        if (
          progressIsActive()
        ) {

          scheduleWeight();

        }

      }
    );


    window.addEventListener(
      "focus",
      () => {

        if (
          progressIsActive()
        ) {

          scheduleWeight();

        }

      }
    );
  }


  function init() {

    wireEvents();


    /*
      Startup pass.
      The late checks happen AFTER
      v9.11's final 2400ms rebuild.
    */

    scheduleWeight();
  }


  window.MANA_WEIGHT_PROGRESS_STABILITY_BUILD =
    BUILD;


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
