/* =========================================
   MANA MOVEMENT TRAINING v9.18.1
   STRENGTH OVERVIEW STABILITY

   FIXES:
   - COACH CHAT STAYS MODERN
   - RECOVERY FOCUS NO LONGER
     REVERTS TO OLD COACH ACTIVITY
   - RESTORES CHAT AFTER WORKOUT EXIT
   - RESTORES CHAT AFTER OVERVIEW REBUILD
   - KEEPS COACH SUPPORT AT BOTTOM
   ========================================= */

(() => {
  "use strict";


  let repairTimer =
    null;

  let repairing =
    false;


  /* =========================================
     OVERVIEW CHECK
     ========================================= */

  function strengthOverviewOpen() {

    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );


    const title =
      document.getElementById(
        "manaV83Title"
      );


    const tab =
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      );


    return Boolean(

      shell
        ?.classList
        .contains(
          "open"
        ) &&

      title
        ?.textContent
        ?.trim()
        ?.toUpperCase() ===
        "MANA STRENGTH" &&

      tab
        ?.dataset
        ?.v83Tab ===
        "overview"

    );

  }


  /* =========================================
     CHECK WHETHER OVERVIEW NEEDS REPAIR
     ========================================= */

  function overviewNeedsRepair() {

    if (
      !strengthOverviewOpen()
    ) {
      return false;
    }


    const coach =
      document.querySelector(
        "#manaV83Content .mana-v866-coach"
      );


    if (!coach) {
      return false;
    }


    const card =
      coach.querySelector(
        "#manaV95ClientChatCard"
      );


    const heading =
      coach
        .querySelector(
          ".mana-v866-section-head h3"
        )
        ?.textContent
        ?.trim();


    const badge =
      coach
        .querySelector(
          ".mana-v866-section-head span"
        )
        ?.textContent
        ?.trim();


    return (

      !card ||

      heading !==
        "Coach Support" ||

      badge !==
        "MESSAGE"

    );

  }


  /* =========================================
     FINAL CHAT NORMALISATION
     ========================================= */

  function normaliseCoachSupport() {

    if (
      !strengthOverviewOpen()
    ) {
      return;
    }


    const holder =
      document.getElementById(
        "manaV83Content"
      );


    const coach =
      holder
        ?.querySelector(
          ".mana-v866-coach"
        );


    if (
      !holder ||
      !coach
    ) {
      return;
    }


    /*
      Coach Support always stays last.
    */

    if (
      holder.lastElementChild !==
        coach
    ) {

      holder.appendChild(
        coach
      );

    }


    const heading =
      coach.querySelector(
        ".mana-v866-section-head h3"
      );


    if (heading) {

      heading.textContent =
        "Coach Support";

    }


    const badge =
      coach.querySelector(
        ".mana-v866-section-head span"
      );


    if (badge) {

      badge.textContent =
        "MESSAGE";

    }


    /*
      Hide the original v8.6
      Coach Activity content.
    */

    [
      ...coach.children
    ].forEach(
      child => {

        const allowed =

          child.classList
            .contains(
              "mana-v866-section-head"
            ) ||

          child.id ===
            "manaV95ClientChatCard";


        if (!allowed) {

          child.style.setProperty(
            "display",
            "none",
            "important"
          );

        }

      }
    );


    /*
      Lock modern Coach Chat wording.
    */

    const card =
      coach.querySelector(
        "#manaV95ClientChatCard"
      );


    if (!card) {
      return;
    }


    const kicker =
      card.querySelector(
        ".mana-v950-card-kicker"
      );


    if (kicker) {

      kicker.style.setProperty(
        "display",
        "none",
        "important"
      );

    }


    const live =
      card.querySelector(
        ".mana-v950-live"
      );


    if (live) {

      live.style.setProperty(
        "display",
        "none",
        "important"
      );

    }


    const title =
      card.querySelector(
        ".mana-v950-card-title"
      );


    if (title) {

      title.textContent =
        "Coach Chat";

    }


    const button =
      card.querySelector(
        "#manaV95ClientOpen"
      );


    if (button) {

      button.textContent =
        "MESSAGE YOUR COACH →";

    }

  }


  /* =========================================
     REPAIR SEQUENCE
     ========================================= */

  function repairOverview() {

    if (
      repairing ||
      !strengthOverviewOpen()
    ) {
      return;
    }


    repairing =
      true;


    /*
      Reapply current Overview layout.
    */

    if (
      typeof
        window
          .refreshManaStrengthOverviewLayout ===
      "function"
    ) {

      window
        .refreshManaStrengthOverviewLayout();

    }


    /*
      Recreate modern Coach Chat.
    */

    setTimeout(
      () => {

        if (
          typeof
            window
              .refreshManaStrengthChat ===
          "function"
        ) {

          window
            .refreshManaStrengthChat();

        }

      },
      80
    );


    /*
      v8.6 can perform another render
      shortly afterwards.
    */

    setTimeout(
      () => {

        if (
          typeof
            window
              .refreshManaStrengthOverviewLayout ===
          "function"
        ) {

          window
            .refreshManaStrengthOverviewLayout();

        }


        if (
          typeof
            window
              .refreshManaStrengthChat ===
          "function"
        ) {

          window
            .refreshManaStrengthChat();

        }

      },
      260
    );


    /*
      Final normalisation after all
      Overview rendering has settled.
    */

    setTimeout(
      () => {

        normaliseCoachSupport();

      },
      480
    );


    setTimeout(
      () => {

        normaliseCoachSupport();

        repairing =
          false;

      },
      700
    );

  }


  function scheduleRepair(
    delay = 80
  ) {

    clearTimeout(
      repairTimer
    );


    repairTimer =
      setTimeout(
        repairOverview,
        delay
      );

  }


  /* =========================================
     RECOVERY FOCUS FIX
     ========================================= */

  function watchRecoveryFocus() {

    document.addEventListener(
      "click",
      event => {

        if (
          !event.target.closest(
            "#manaV866Recovery"
          )
        ) {
          return;
        }


        /*
          v8.6 immediately rebuilds the
          entire Overview after Recovery
          is toggled.

          Repair modern Coach Support
          after each possible render pass.
        */

        [
          40,
          120,
          260,
          500,
          800,
          1200
        ].forEach(
          delay => {

            setTimeout(
              () => {

                if (
                  strengthOverviewOpen()
                ) {

                  repairing =
                    false;


                  repairOverview();

                }

              },
              delay
            );

          }
        );

      },
      true
    );

  }


  /* =========================================
     WORKOUT EXIT
     ========================================= */

  function watchWorkoutExit() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV64Close"
          )
        ) {

          [
            120,
            350,
            700,
            1100
          ].forEach(
            delay => {

              setTimeout(
                repairOverview,
                delay
              );

            }
          );

        }


        if (
          event.target.closest(
            "#manaV64Complete"
          )
        ) {

          [
            1300,
            1700,
            2200
          ].forEach(
            delay => {

              setTimeout(
                repairOverview,
                delay
              );

            }
          );

        }

      },
      true
    );

  }


  /* =========================================
     APP EVENTS
     ========================================= */

  function watchEvents() {

    [
      "mana:program-tab-change",
      "mana:strength-synced",
      "mana:profile-synced",
      "mana:strength-membership-change",
      "mana:workout-progress-change"
    ].forEach(
      eventName => {

        window.addEventListener(
          eventName,
          () => {

            scheduleRepair(
              100
            );


            setTimeout(
              repairOverview,
              450
            );

          }
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        scheduleRepair(
          120
        );

      }
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          scheduleRepair(
            120
          );

        }

      }
    );

  }


  /* =========================================
     DOM WATCH
     ========================================= */

  function watchDOM() {

    const observer =
      new MutationObserver(
        () => {

          if (
            !strengthOverviewOpen() ||
            repairing
          ) {
            return;
          }


          /*
            Previously we only repaired if
            the chat card disappeared.

            Now we also repair if v8.6
            restores the old Coach Activity
            heading or badge.
          */

          if (
            overviewNeedsRepair()
          ) {

            scheduleRepair(
              80
            );

          } else {

            normaliseCoachSupport();

          }

        }
      );


    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true
      }
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    watchRecoveryFocus();

    watchWorkoutExit();

    watchEvents();

    watchDOM();


    [
      500,
      1000,
      1800,
      2800
    ].forEach(
      delay => {

        setTimeout(
          repairOverview,
          delay
        );

      }
    );

  }


  window.repairManaStrengthOverview =
    repairOverview;


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
