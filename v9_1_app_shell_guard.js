/* =========================================
   MANA MOVEMENT TRAINING v9.1
   APP SHELL GUARD

   PREVENT OLD CLIENT UI RETURNING
   AFTER MOBILE SLEEP / SESSION REFRESH
   ========================================= */

(() => {
  "use strict";


  const HOME_ID =
    "manaV80Home";


  const OLD_IDS = [
    "clientView",
    "clientProgramsView",
    "clientFuelView",
    "clientProgressView",
    "clientProfileView",
    "bottomNav"
  ];


  let guardTimer =
    null;


  /* =========================================
     HELPERS
     ========================================= */

  function newManaExists() {
    return Boolean(
      document.getElementById(
        HOME_ID
      )
    );
  }


  function hideOldMana() {
    if (
      !newManaExists()
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


        /*
          Hide using both methods because
          the old session code can remove
          the .hide class or change styles.
        */

        el.classList.add(
          "hide"
        );


        el.style.display =
          "none";

      }
    );
  }


  function restoreNewHome() {
    const home =
      document.getElementById(
        HOME_ID
      );


    if (!home) return;


    const programShell =
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


    /*
      Only restore Home when another
      Mana overlay/program isn't open.
    */

    const programOpen =
      programShell
        ?.classList
        .contains(
          "open"
        );


    const profileOpen =
      profile
        ?.classList
        .contains(
          "open"
        );


    const introOpen =
      intro
        ?.classList
        .contains(
          "open"
        );


    if (
      !programOpen &&
      !profileOpen &&
      !introOpen
    ) {

      home.style.display =
        "";

    }
  }


  function enforceShell() {
    hideOldMana();

    restoreNewHome();
  }


  function scheduleGuard() {
    clearTimeout(
      guardTimer
    );


    guardTimer =
      setTimeout(
        enforceShell,
        80
      );
  }


  /* =========================================
     WATCH SESSION / DOM CHANGES
     ========================================= */

  function startObserver() {
    const observer =
      new MutationObserver(
        scheduleGuard
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


  /* =========================================
     PHONE WAKE / TAB RETURN
     ========================================= */

  function wireResumeEvents() {

    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          setTimeout(
            enforceShell,
            100
          );


          setTimeout(
            enforceShell,
            500
          );

        }

      }
    );


    window.addEventListener(
      "pageshow",
      () => {

        setTimeout(
          enforceShell,
          100
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        setTimeout(
          enforceShell,
          100
        );

      }
    );
  }


  /* =========================================
     AUTH REFRESH PROTECTION
     ========================================= */

  async function watchAuth() {
    try {

      if (
        typeof
          window.supabaseClient !==
        "function"
      ) {
        return;
      }


      const client =
        await window
          .supabaseClient();


      client.auth
        .onAuthStateChange(
          (
            event,
            session
          ) => {

            if (
              session?.user &&
              (
                event ===
                  "TOKEN_REFRESHED" ||

                event ===
                  "SIGNED_IN" ||

                event ===
                  "INITIAL_SESSION" ||

                event ===
                  "USER_UPDATED"
              )
            ) {

              /*
                Let the old auth code finish,
                then put Mana back into the
                new shell.
              */

              setTimeout(
                enforceShell,
                150
              );


              setTimeout(
                enforceShell,
                600
              );

            }

          }
        );

    } catch (error) {

      console.warn(
        "Mana shell guard auth:",
        error
      );

    }
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    /*
      v8 Home is created shortly
      after page load.
    */

    setTimeout(
      enforceShell,
      900
    );


    setTimeout(
      enforceShell,
      1800
    );


    startObserver();

    wireResumeEvents();

    watchAuth();
  }


  window.enforceManaAppShell =
    enforceShell;


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
