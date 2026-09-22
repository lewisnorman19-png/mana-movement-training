/* =========================================
   MANA MOVEMENT TRAINING v9.32.0
   MOBILE POST-WORKOUT OVERVIEW FIX

   FIXES:
   - BACK TO OVERVIEW AFTER WORKOUT COMPLETE
   - STOPS MULTIPLE OVERVIEW REFRESH EVENTS
     FIRING AT THE SAME TIME ON PHONE
   - BUILDS THE FINAL OVERVIEW ONCE
   - RESTORES WORKOUT / CHAT / PROGRESS
     IN ONE CONTROLLED PASS

   MOBILE ONLY
   NO MUTATION OBSERVER
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "93200";

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

  function safeCall(
    functionName
  ) {
    try {
      const fn =
        window[
          functionName
        ];

      if (
        typeof fn ===
        "function"
      ) {
        fn();
      }
    } catch (_) {}
  }

  function openStrengthOverviewOnce() {
    if (
      handling
    ) {
      return;
    }

    handling =
      true;

    /*
      Close the workout-complete screen ourselves.
      This prevents v9.15 from calling the normal
      multi-listener Overview path on mobile.
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
      openManaProgram normally dispatches
      mana:program-tab-change synchronously.

      On this ONE mobile post-workout route,
      temporarily suppress that single event.

      Otherwise all of the Overview listeners
      wake up together and visibly rebuild
      the same screen several times.
    */

    const originalDispatch =
      window.dispatchEvent;

    try {
      window.dispatchEvent =
        function(
          event
        ) {
          if (
            event?.type ===
            "mana:program-tab-change"
          ) {
            return true;
          }

          return originalDispatch.call(
            window,
            event
          );
        };

      if (
        typeof
          window
            .openManaProgram ===
        "function"
      ) {
        window
          .openManaProgram(
            "strength"
          );
      }

    } finally {
      window.dispatchEvent =
        originalDispatch;
    }

    /*
      The shell is now open on Overview.

      Build the actual Overview immediately,
      rather than showing the generic shell card
      and then replacing it several times.
    */

    safeCall(
      "renderManaStrengthOverview"
    );

    /*
      Apply the lightweight decorators once,
      in a fixed order.
    */

    safeCall(
      "refreshManaStrengthOverviewLayout"
    );

    safeCall(
      "refreshManaWorkoutProgress"
    );

    safeCall(
      "refreshManaStrengthChat"
    );

    safeCall(
      "refreshManaTrainingPercentage"
    );

    /*
      One final bounded verification after Safari
      has completed layout.

      These functions are safe to run again and
      do not rebuild the entire base page.
    */

    setTimeout(
      () => {

        safeCall(
          "refreshManaStrengthOverviewLayout"
        );

        safeCall(
          "refreshManaWorkoutProgress"
        );

        safeCall(
          "refreshManaStrengthChat"
        );

        safeCall(
          "refreshManaTrainingPercentage"
        );

        handling =
          false;

      },
      180
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

    /*
      Stop the old v9.15 Back handler only
      for this phone route.

      We replace it with the single controlled
      transition above.
    */

    event.preventDefault();

    event.stopPropagation();

    event.stopImmediatePropagation();

    openStrengthOverviewOnce();
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

  window.MANA_MOBILE_POST_WORKOUT_BUILD =
    BUILD;

  window.openManaPostWorkoutOverview =
    openStrengthOverviewOnce;

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
