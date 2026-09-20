/* =========================================
   MANA MOVEMENT TRAINING v9.6.0
   LOGOUT FIX

   PREVENTS SIGN-OUT HANG
   CLEARS LOCAL SESSION
   RETURNS USER TO LOGIN
   ========================================= */

(() => {
  "use strict";


  const BUTTON_ID =
    "manaV80LogoutBtn";


  const HOME_ID =
    "manaV80Home";


  let signingOut =
    false;


  function resetModernScreens() {

    document
      .getElementById(
        "manaV83ProgramShell"
      )
      ?.classList
      .remove(
        "open"
      );


    document
      .getElementById(
        "manaProfileScreen"
      )
      ?.classList
      .remove(
        "open"
      );


    document
      .getElementById(
        "manaV81Intro"
      )
      ?.classList
      .remove(
        "open"
      );


    document
      .getElementById(
        "manaV95ChatModal"
      )
      ?.classList
      .remove(
        "open"
      );


    document.body.style.overflow =
      "";

  }


  function hideAppViews() {

    [
      "clientView",
      "coachView",
      "coachClientDetailView",
      "clientProgramsView",
      "clientFuelView",
      "clientProgressView",
      "clientProfileView",
      "bottomNav"
    ].forEach(
      id => {

        const el =
          document.getElementById(
            id
          );


        if (!el) {
          return;
        }


        el.classList.add(
          "hide"
        );

      }
    );


    const home =
      document.getElementById(
        HOME_ID
      );


    if (home) {

      home.style.display =
        "none";

    }

  }


  function showLogin() {

    const auth =
      document.getElementById(
        "authView"
      );


    if (!auth) {
      return;
    }


    auth.classList.remove(
      "hide"
    );


    auth.style.display =
      "";


    const loginForm =
      document.getElementById(
        "loginForm"
      );


    loginForm
      ?.classList
      .remove(
        "hide"
      );


    document
      .getElementById(
        "signupForm"
      )
      ?.classList
      .add(
        "hide"
      );


    document
      .getElementById(
        "loginTab"
      )
      ?.classList
      .add(
        "active"
      );


    document
      .getElementById(
        "signupTab"
      )
      ?.classList
      .remove(
        "active"
      );


    window.scrollTo({
      top:0,
      behavior:"instant"
    });

  }


  function clearSavedRoute() {

    try {

      localStorage.removeItem(
        "mana-v915-last-route"
      );

    } catch (_) {}

  }


  function clearSupabaseLocalSession() {

    try {

      const keys =
        Object.keys(
          localStorage
        );


      keys.forEach(
        key => {

          if (
            /^sb-.*-auth-token$/.test(
              key
            ) ||
            key.includes(
              "supabase.auth.token"
            )
          ) {

            localStorage.removeItem(
              key
            );

          }

        }
      );

    } catch (_) {}

  }


  async function safeSupabaseSignOut() {

    if (
      typeof supabaseClient !==
        "function"
    ) {
      return;
    }


    try {

      const c =
        await supabaseClient();


      const timeout =
        new Promise(
          resolve => {

            setTimeout(
              () => {

                resolve({
                  timeout:true
                });

              },
              2200
            );

          }
        );


      await Promise.race([

        c.auth.signOut({
          scope:"local"
        }),

        timeout

      ]);


    } catch (error) {

      console.warn(
        "Mana safe logout",
        error
      );

    }

  }


  async function logout() {

    if (signingOut) {
      return;
    }


    signingOut =
      true;


    const button =
      document.getElementById(
        BUTTON_ID
      );


    if (button) {

      button.disabled =
        true;


      button.innerHTML =
        "◌<br>Signing out…";

    }


    /*
      Close the visual app immediately.
      The client should never be left
      staring at a frozen logout button.
    */

    resetModernScreens();

    hideAppViews();


    /*
      Clear route first so the route guard
      cannot reopen the previous screen.
    */

    clearSavedRoute();


    /*
      Give Supabase a short opportunity
      to end the session normally.
    */

    await safeSupabaseSignOut();


    /*
      Safety fallback:
      remove any persisted local auth token.
    */

    clearSupabaseLocalSession();


    try {

      if (
        typeof currentUser !==
        "undefined"
      ) {

        currentUser =
          null;

      }

    } catch (_) {}


    try {

      if (
        typeof mode !==
        "undefined"
      ) {

        mode =
          null;

      }

    } catch (_) {}


    showLogin();


    if (button) {

      button.disabled =
        false;


      button.innerHTML =
        "↪<br>Logout";

    }


    signingOut =
      false;
  }


  function wireLogout() {

    const button =
      document.getElementById(
        BUTTON_ID
      );


    if (!button) {
      return false;
    }


    /*
      Replace the older Home logout handler.
    */

    button.onclick =
      event => {

        event.preventDefault();

        event.stopPropagation();

        logout();

      };


    return true;
  }


  function init() {

    [
      300,
      700,
      1200,
      2200
    ].forEach(
      delay => {

        setTimeout(
          wireLogout,
          delay
        );

      }
    );


    const observer =
      new MutationObserver(
        () => {

          wireLogout();

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


  window.logoutManaSafe =
    logout;


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
