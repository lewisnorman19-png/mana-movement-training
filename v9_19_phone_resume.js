/* =========================================
   MANA MOVEMENT TRAINING v9.19.0
   PHONE RESUME GUARD

   FIXES:
   - PHONE TIMEOUT DOES NOT REOPEN INTRO
   - APP RETURNS TO PREVIOUS MANA SCREEN
   - MANUAL INTRO STILL WORKS
   - FRESH LOGIN CAN STILL USE INTRO
   ========================================= */

(() => {
  "use strict";


  const INTRO_ID =
    "manaV81Intro";

  const ENTERED_KEY =
    "mana-v919-entered-mana";


  let manualIntro =
    false;

  let restoring =
    false;


  /* =========================================
     HELPERS
     ========================================= */

  function intro() {

    return document.getElementById(
      INTRO_ID
    );

  }


  function introOpen() {

    return Boolean(
      intro()
        ?.classList
        .contains(
          "open"
        )
    );

  }


  function hasEnteredMana() {

    try {

      return (
        localStorage.getItem(
          ENTERED_KEY
        ) === "1"
      );

    } catch (_) {

      return false;

    }
  }


  function markEntered() {

    try {

      localStorage.setItem(
        ENTERED_KEY,
        "1"
      );

    } catch (_) {}

  }


  function clearEntered() {

    try {

      localStorage.removeItem(
        ENTERED_KEY
      );

    } catch (_) {}

  }


  /* =========================================
     CLOSE AUTO INTRO
     ========================================= */

  function closeAutoIntro() {

    if (
      restoring ||
      manualIntro ||
      !hasEnteredMana() ||
      !introOpen()
    ) {
      return;
    }


    restoring =
      true;


    /*
      The user has already entered Mana.

      If Intro appears because iOS has
      restored the session, close it.
    */

    if (
      typeof
        window
          .closeManaIntroduction ===
      "function"
    ) {

      window
        .closeManaIntroduction();

    } else {

      intro()
        ?.classList
        .remove(
          "open"
        );


      document.body.style.overflow =
        "";

    }


    /*
      Let the existing route guard put
      the user back where they were.
    */

    setTimeout(
      () => {

        if (
          typeof
            window
              .enforceManaAppShell ===
          "function"
        ) {

          window
            .enforceManaAppShell();

        }


        restoring =
          false;

      },
      100
    );

  }


  /* =========================================
     MANUAL INTRO
     ========================================= */

  function wrapManualIntro() {

    const original =
      window
        .openManaIntroduction;


    if (
      typeof original !==
      "function"
    ) {
      return;
    }


    if (
      original
        .__manaV919Wrapped
    ) {
      return;
    }


    const wrapped =
      function() {

        manualIntro =
          true;


        const result =
          original.apply(
            this,
            arguments
          );


        /*
          Keep manual permission alive
          while the Intro opens.
        */

        setTimeout(
          () => {

            manualIntro =
              false;

          },
          1200
        );


        return result;

      };


    wrapped
      .__manaV919Wrapped =
        true;


    window
      .openManaIntroduction =
        wrapped;

  }


  /* =========================================
     ENTER BUTTON
     ========================================= */

  function watchEnterButton() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV81Enter"
          )
        ) {

          markEntered();


          manualIntro =
            false;

        }

      },
      true
    );

  }


  /* =========================================
     LOGOUT
     ========================================= */

  function watchLogout() {

    window.addEventListener(
      "mana:logout",
      () => {

        clearEntered();

        manualIntro =
          false;

      }
    );

  }


  /* =========================================
     INTRO WATCHER
     ========================================= */

  function watchIntro() {

    const target =
      intro();


    if (!target) {
      return;
    }


    const observer =
      new MutationObserver(
        () => {

          if (
            target
              .classList
              .contains(
                "open"
              )
          ) {

            setTimeout(
              closeAutoIntro,
              30
            );

          }

        }
      );


    observer.observe(
      target,
      {
        attributes:true,
        attributeFilter:[
          "class"
        ]
      }
    );

  }


  /* =========================================
     PHONE RESUME
     ========================================= */

  function resumeApp() {

    if (
      !hasEnteredMana()
    ) {
      return;
    }


    /*
      iOS can restore the legacy client
      state first, causing v8.1 to open
      Intro a fraction of a second later.

      Check several times while the app
      settles.
    */

    [
      20,
      100,
      250,
      500,
      900,
      1500
    ].forEach(
      delay => {

        setTimeout(
          () => {

            closeAutoIntro();


            if (
              !introOpen() &&
              typeof
                window
                  .enforceManaAppShell ===
                "function"
            ) {

              window
                .enforceManaAppShell();

            }

          },
          delay
        );

      }
    );

  }


  function watchPhone() {

    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
            "visible"
        ) {

          resumeApp();

        }

      }
    );


    window.addEventListener(
      "pageshow",
      resumeApp
    );


    window.addEventListener(
      "focus",
      resumeApp
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    /*
      v8.1 loads before this file.
      Wrap the manual Intro function.
    */

    wrapManualIntro();


    /*
      If scripts are still settling,
      try the wrapper again.
    */

    [
      200,
      600,
      1200
    ].forEach(
      delay => {

        setTimeout(
          wrapManualIntro,
          delay
        );

      }
    );


    watchEnterButton();

    watchLogout();

    watchIntro();

    watchPhone();


    /*
      If the app itself was restarted
      by iOS rather than merely resumed,
      prevent the old auto Intro too.
    */

    if (
      hasEnteredMana()
    ) {

      resumeApp();

    }

  }


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
