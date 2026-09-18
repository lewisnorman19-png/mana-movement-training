/* =========================================
   MANA MOVEMENT TRAINING v9.1.2
   APP SHELL + SESSION RESTORE FIX
   ========================================= */

(() => {
  "use strict";


  const NEW_HOME_ID =
    "manaV80Home";


  const OLD_IDS = [
    "clientView",
    "clientProgramsView",
    "clientFuelView",
    "clientProgressView",
    "clientProfileView",
    "bottomNav"
  ];


  /* =========================================
     HIDE OLD CLIENT UI
     ========================================= */

  function hideOldClientUI() {
    if (
      !document.getElementById(
        NEW_HOME_ID
      )
    ) {
      return;
    }


    OLD_IDS.forEach(
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


  /* =========================================
     SHOW NEW MANA HOME
     ========================================= */

  function showNewHome() {
    const home =
      document.getElementById(
        NEW_HOME_ID
      );


    if (!home) return;


    const strengthShell =
      document.getElementById(
        "manaV83ProgramShell"
      );


    const profile =
      document.getElementById(
        "manaV67Profile"
      );


    const intro =
      document.getElementById(
        "manaV81Intro"
      );


    const anotherScreenOpen =
      strengthShell
        ?.classList
        .contains(
          "open"
        ) ||

      profile
        ?.classList
        .contains(
          "open"
        ) ||

      intro
        ?.classList
        .contains(
          "open"
        );


    if (
      !anotherScreenOpen
    ) {

      home.style.display =
        "";

    }
  }


  /* =========================================
     OVERRIDE OLD CLIENT RESTORE
     ========================================= */

  function overrideOldClientRestore() {

    if (
      typeof
        window.openConnectedClient !==
      "function"
    ) {
      return false;
    }


    if (
      window
        .openConnectedClient
        .__manaNewShell
    ) {
      return true;
    }


    const original =
      window.openConnectedClient;


    const replacement =
      async function(profile) {

        /*
          Let the old function load
          cloud data / user details.
        */

        await original(
          profile
        );


        /*
          Immediately remove the
          old client shell it opened.
        */

        hideOldClientUI();


        showNewHome();


        /*
          Re-wire the new Home cards
          after a session restore.
        */

        setTimeout(
          () => {

            hideOldClientUI();

            showNewHome();

          },
          100
        );


        setTimeout(
          () => {

            hideOldClientUI();

            showNewHome();

          },
          500
        );

      };


    replacement.__manaNewShell =
      true;


    window.openConnectedClient =
      replacement;


    return true;
  }


  /* =========================================
     ENFORCE
     ========================================= */

  function enforce() {
    hideOldClientUI();

    showNewHome();

    overrideOldClientRestore();
  }


  /* =========================================
     PHONE WAKE
     ========================================= */

  function wireResume() {

    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          setTimeout(
            enforce,
            50
          );


          setTimeout(
            enforce,
            300
          );


          setTimeout(
            enforce,
            900
          );

        }

      }
    );


    window.addEventListener(
      "pageshow",
      () => {

        setTimeout(
          enforce,
          100
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        setTimeout(
          enforce,
          100
        );

      }
    );
  }


  /* =========================================
     OBSERVER
     ========================================= */

  function watchDOM() {

    let timer = null;


    const observer =
      new MutationObserver(
        () => {

          clearTimeout(
            timer
          );


          timer =
            setTimeout(
              enforce,
              60
            );

        }
      );


    observer.observe(
      document.body,
      {
        subtree:true,
        childList:true,
        attributes:true,
        attributeFilter:[
          "class",
          "style"
        ]
      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    /*
      openConnectedClient is defined
      by the large inline app script,
      so check a few times until it exists.
    */

    const tries = [
      100,
      400,
      900,
      1600,
      2500
    ];


    tries.forEach(
      delay => {

        setTimeout(
          enforce,
          delay
        );

      }
    );


    wireResume();

    watchDOM();
  }


  window.enforceManaAppShell =
    enforce;


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
