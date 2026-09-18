/* =========================================
   MANA MOVEMENT TRAINING v9.1.3
   MOBILE SESSION + ROUTE GUARD

   PREVENT OLD CLIENT APP RETURNING
   REMEMBER CURRENT MANA SCREEN
   RESTORE AFTER PHONE SLEEP / REFRESH
   ========================================= */

(() => {
  "use strict";


  const HOME_ID =
    "manaV80Home";

  const SHELL_ID =
    "manaV83ProgramShell";

  const PROFILE_ID =
    "manaProfileScreen";

  const ROUTE_KEY =
    "mana-v913-last-route";


  const OLD_CLIENT_IDS = [
    "clientView",
    "clientProgramsView",
    "clientFuelView",
    "clientProgressView",
    "clientProfileView",
    "bottomNav"
  ];


  let restoring =
    false;

  let restoreTimer =
    null;


  function safeJson(
    raw,
    fallback
  ) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }


  function coachIsOpen() {
    const coach =
      document.getElementById(
        "coachView"
      );


    return Boolean(
      coach &&
      !coach.classList
        .contains("hide")
    );
  }


  function hideOldClientUI() {
    if (
      coachIsOpen()
    ) {
      return;
    }


    OLD_CLIENT_IDS.forEach(
      id => {

        const el =
          document.getElementById(
            id
          );


        if (!el) return;


        el.classList.add(
          "hide"
        );


        el.style.display =
          "none";

      }
    );
  }


  function showHome() {
    const home =
      document.getElementById(
        HOME_ID
      );


    if (!home) {
      return;
    }


    hideOldClientUI();


    home.style.display =
      "";
  }


  function currentProgram() {
    const title =
      document.getElementById(
        "manaV83Title"
      )
      ?.textContent
      ?.trim()
      ?.toUpperCase();


    if (
      title ===
      "MANA STRENGTH"
    ) {
      return "strength";
    }


    if (
      title ===
      "MANA 28"
    ) {
      return "mana28";
    }


    if (
      title ===
      "MANA LIFE"
    ) {
      return "life";
    }


    return "";
  }


  function currentTab() {
    return (
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab ||
      "overview"
    );
  }


  function saveRoute(
    route
  ) {
    try {

      localStorage.setItem(
        ROUTE_KEY,
        JSON.stringify(
          route
        )
      );

    } catch (_) {}
  }


  function loadRoute() {
    return safeJson(
      localStorage.getItem(
        ROUTE_KEY
      ) || "null",
      null
    );
  }


  function captureRoute() {
    if (
      coachIsOpen()
    ) {
      return;
    }


    const profile =
      document.getElementById(
        PROFILE_ID
      );


    if (
      profile
        ?.classList
        .contains("open")
    ) {

      saveRoute({
        screen:"profile"
      });

      return;
    }


    const shell =
      document.getElementById(
        SHELL_ID
      );


    if (
      shell
        ?.classList
        .contains("open")
    ) {

      const program =
        currentProgram();


      if (program) {

        saveRoute({
          screen:"program",
          program,
          tab:currentTab()
        });

      }

      return;
    }


    const home =
      document.getElementById(
        HOME_ID
      );


    if (
      home &&
      home.style.display !==
        "none"
    ) {

      saveRoute({
        screen:"home"
      });

    }
  }


  function newManaScreenOpen() {
    const shell =
      document.getElementById(
        SHELL_ID
      );


    if (
      shell
        ?.classList
        .contains("open")
    ) {
      return true;
    }


    const profile =
      document.getElementById(
        PROFILE_ID
      );


    if (
      profile
        ?.classList
        .contains("open")
    ) {
      return true;
    }


    return false;
  }


  function restoreProgram(
    program,
    tab
  ) {
    if (
      typeof
        window
          .openManaProgram !==
      "function"
    ) {
      return false;
    }


    restoring =
      true;


    window.openManaProgram(
      program
    );


    hideOldClientUI();


    if (
      tab &&
      tab !==
        "overview"
    ) {

      setTimeout(
        () => {

          const button =
            document.querySelector(
              `#manaV83Tabs [data-v83-tab="${tab}"]`
            );


          button?.click();


          hideOldClientUI();


          restoring =
            false;

        },
        140
      );

    } else {

      setTimeout(
        () => {

          hideOldClientUI();

          restoring =
            false;

        },
        140
      );

    }


    return true;
  }


  function restoreRoute(
    force = false
  ) {
    if (
      restoring ||
      coachIsOpen()
    ) {
      return;
    }


    hideOldClientUI();


    if (
      !force &&
      newManaScreenOpen()
    ) {
      return;
    }


    const route =
      loadRoute();


    if (
      route?.screen ===
      "profile"
    ) {

      if (
        typeof
          window
            .openManaProfile ===
        "function"
      ) {

        restoring =
          true;


        window
          .openManaProfile();


        setTimeout(
          () => {

            hideOldClientUI();

            restoring =
              false;

          },
          120
        );


        return;
      }
    }


    if (
      route?.screen ===
      "program" &&
      route.program
    ) {

      if (
        restoreProgram(
          route.program,
          route.tab
        )
      ) {
        return;
      }
    }


    showHome();
  }


  function scheduleRestore(
    force = false,
    delay = 100
  ) {
    clearTimeout(
      restoreTimer
    );


    restoreTimer =
      setTimeout(
        () => {

          restoreRoute(
            force
          );

        },
        delay
      );
  }


  function overrideOldClientRestore() {
    if (
      typeof
        window
          .openConnectedClient !==
      "function"
    ) {
      return;
    }


    if (
      window
        .openConnectedClient
        .__manaV913
    ) {
      return;
    }


    const original =
      window
        .openConnectedClient;


    const replacement =
      async function(
        profile
      ) {

        await original(
          profile
        );


        hideOldClientUI();


        scheduleRestore(
          true,
          60
        );


        setTimeout(
          () => {

            hideOldClientUI();

            restoreRoute(
              true
            );

          },
          350
        );

      };


    replacement.__manaV913 =
      true;


    window.openConnectedClient =
      replacement;
  }


  function wireRouteTracking() {
    window.addEventListener(
      "mana:program-tab-change",
      () => {

        if (
          restoring
        ) {
          return;
        }


        setTimeout(
          captureRoute,
          60
        );

      }
    );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV80Home"
          )
        ) {

          setTimeout(
            captureRoute,
            120
          );

        }


        if (
          event.target.closest(
            "#manaV83Back"
          )
        ) {

          setTimeout(
            captureRoute,
            180
          );

        }


        if (
          event.target.closest(
            "#manaProfileClose"
          )
        ) {

          setTimeout(
            captureRoute,
            180
          );

        }

      }
    );
  }


  function wirePhoneResume() {
    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "hidden"
        ) {

          captureRoute();

          return;
        }


        if (
          document.visibilityState ===
          "visible"
        ) {

          hideOldClientUI();


          scheduleRestore(
            false,
            80
          );


          setTimeout(
            () => {

              hideOldClientUI();

              restoreRoute(
                false
              );

            },
            500
          );

        }

      }
    );


    window.addEventListener(
      "pagehide",
      captureRoute
    );


    window.addEventListener(
      "pageshow",
      () => {

        hideOldClientUI();

        scheduleRestore(
          false,
          100
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        hideOldClientUI();

        scheduleRestore(
          false,
          100
        );

      }
    );
  }


  function observeOldUI() {
    let timer =
      null;


    const observer =
      new MutationObserver(
        () => {

          clearTimeout(
            timer
          );


          timer =
            setTimeout(
              () => {

                hideOldClientUI();

                overrideOldClientRestore();

              },
              60
            );

        }
      );


    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true,
        attributes:true,
        attributeFilter:[
          "class",
          "style"
        ]
      }
    );
  }


  function init() {
    wireRouteTracking();

    wirePhoneResume();

    observeOldUI();


    [
      100,
      400,
      900,
      1600,
      2600
    ].forEach(
      delay => {

        setTimeout(
          () => {

            hideOldClientUI();

            overrideOldClientRestore();

          },
          delay
        );

      }
    );


    setTimeout(
      () => {

        restoreRoute(
          false
        );

      },
      1200
    );
  }


  window.enforceManaAppShell =
    () => {

      hideOldClientUI();

      restoreRoute(
        false
      );
    };


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
