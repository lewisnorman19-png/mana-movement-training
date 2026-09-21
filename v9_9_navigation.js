/* =========================================
   MANA MOVEMENT TRAINING v9.9.2
   NAVIGATION + SESSION RESTORE

   FIXES:
   - VALID LOGIN SESSION SURVIVES APP RELOAD
   - HOME RETURNS AFTER IPHONE / PWA RESTART
   - NO FALSE LOGIN SCREEN ON PHONE RESUME
   - LOGOUT STILL RETURNS TO LOGIN
   - PASSWORD MANAGER SUPPORT
   - MEMBERSHIP BACK NAVIGATION
   - PROFILE BACK NAVIGATION
   - INTRO BACK NAVIGATION
   - STRENGTH SMART BACK
   - COACH CLIENT BACK
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v992-navigation-style";

  const ENTERED_KEY =
    "mana-v919-entered-mana";


  let loginConfirmed =
    false;

  let authResolved =
    false;

  let membershipOrigin =
    "home";


  /* =========================================
     HELPERS
     ========================================= */

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


  function markEnteredMana() {

    try {

      localStorage.setItem(
        ENTERED_KEY,
        "1"
      );

    } catch (_) {}

  }


  function clearEnteredMana() {

    try {

      localStorage.removeItem(
        ENTERED_KEY
      );

    } catch (_) {}

  }


  /* =========================================
     STYLES
     ========================================= */

  function injectStyles() {

    if (
      document.getElementById(
        STYLE_ID
      )
    ) {
      return;
    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      .mana-v991-back{
        min-height:42px;
        padding:0 14px;
        border:1px solid #343434;
        border-radius:14px;
        background:#111;
        color:#f3d875;
        font-size:12px;
        font-weight:900;
        cursor:pointer;
      }


      #manaProfileClose,
      #manaV98Close{
        width:auto !important;
        min-width:86px !important;
        height:44px !important;
        padding:0 13px !important;
        border-radius:14px !important;
        color:#f3d875 !important;
        font-size:12px !important;
        font-weight:900 !important;
      }


      #manaV81Close{
        min-height:48px;
        border:1px solid #343434 !important;
        background:#111 !important;
        color:#f3d875 !important;
        font-weight:900 !important;
      }

    `;


    document.head.appendChild(
      style
    );

  }


  /* =========================================
     PASSWORD MANAGER SUPPORT
     ========================================= */

  function configureLoginFields() {

    const form =
      document.getElementById(
        "loginForm"
      );


    const email =
      document.getElementById(
        "loginEmail"
      );


    const password =
      document.getElementById(
        "loginPassword"
      );


    if (form) {

      form.setAttribute(
        "autocomplete",
        "on"
      );

    }


    if (email) {

      email.setAttribute(
        "name",
        "email"
      );


      email.setAttribute(
        "autocomplete",
        "username"
      );

    }


    if (password) {

      password.setAttribute(
        "name",
        "password"
      );


      password.setAttribute(
        "autocomplete",
        "current-password"
      );

    }


    try {

      const savedEmail =
        localStorage.getItem(
          "mana:lastEmail"
        );


      if (
        savedEmail &&
        email &&
        !email.value
      ) {

        email.value =
          savedEmail;

      }

    } catch (_) {}

  }


  /* =========================================
     AUTH VIEW
     ========================================= */

  function hideAuth() {

    const auth =
      document.getElementById(
        "authView"
      );


    if (auth) {

      auth.classList.add(
        "hide"
      );


      auth.style.display =
        "none";

    }


    document
      .getElementById(
        "sessionRestoreOverlay"
      )
      ?.classList
      .add(
        "hide"
      );

  }


  /* =========================================
     HIDE APP SCREENS
     ========================================= */

  function hideAppScreens() {

    const home =
      document.getElementById(
        "manaV80Home"
      );


    if (home) {

      home.style.display =
        "none";

    }


    [
      "clientView",
      "coachView",
      "coachClientDetailView",
      "clientProgramsView",
      "clientFuelView",
      "clientProgressView",
      "clientProfileView"
    ].forEach(
      id => {

        document
          .getElementById(
            id
          )
          ?.classList
          .add(
            "hide"
          );

      }
    );


    [
      "manaV83ProgramShell",
      "manaProfileScreen",
      "manaV81Intro",
      "manaV98Membership",
      "manaV95ChatModal",
      "manaV97CoachNav"
    ].forEach(
      id => {

        document
          .getElementById(
            id
          )
          ?.classList
          .remove(
            "open"
          );

      }
    );


    const coachLogout =
      document.getElementById(
        "manaV97CoachLogout"
      );


    if (coachLogout) {

      coachLogout.style.display =
        "none";

    }


    document
      .getElementById(
        "bottomNav"
      )
      ?.classList
      .add(
        "hide"
      );

  }


  /* =========================================
     SHOW LOGIN
     ========================================= */

  function showLogin() {

    if (
      loginConfirmed
    ) {
      return;
    }


    hideAppScreens();


    const auth =
      document.getElementById(
        "authView"
      );


    if (auth) {

      auth.classList.remove(
        "hide"
      );


      auth.style.display =
        "";

    }


    document
      .getElementById(
        "loginForm"
      )
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


    document
      .getElementById(
        "sessionRestoreOverlay"
      )
      ?.classList
      .add(
        "hide"
      );


    document.body.style.overflow =
      "";


    configureLoginFields();

  }


  /* =========================================
     RESTORE MANA APP
     ========================================= */

  function restoreManaApp() {

    if (
      !loginConfirmed
    ) {
      return;
    }


    hideAuth();


    /*
      v9.1 owns route restoration.

      It remembers whether the user was on
      Home, Strength, Fuel, Progress etc.
    */

    if (
      typeof
        window
          .enforceManaAppShell ===
      "function"
    ) {

      window
        .enforceManaAppShell();

    } else {

      const home =
        document.getElementById(
          "manaV80Home"
        );


      if (home) {

        home.style.display =
          "";

      }

    }

  }


  function scheduleRestore() {

    [
      30,
      120,
      300,
      650,
      1100,
      1800
    ].forEach(
      delay => {

        setTimeout(
          restoreManaApp,
          delay
        );

      }
    );

  }


  /* =========================================
     LOGIN FORM
     ========================================= */

  function wireLogin() {

    const form =
      document.getElementById(
        "loginForm"
      );


    if (
      form &&
      form.dataset
        .manaV992Wired !==
        "1"
    ) {

      form.dataset
        .manaV992Wired =
          "1";


      form.addEventListener(
        "submit",
        () => {

          loginConfirmed =
            true;


          const email =
            document
              .getElementById(
                "loginEmail"
              )
              ?.value
              ?.trim();


          if (email) {

            try {

              localStorage.setItem(
                "mana:lastEmail",
                email
              );

            } catch (_) {}

          }

        },
        true
      );

    }


    const signup =
      document.getElementById(
        "signupForm"
      );


    if (
      signup &&
      signup.dataset
        .manaV992Wired !==
        "1"
    ) {

      signup.dataset
        .manaV992Wired =
          "1";


      signup.addEventListener(
        "submit",
        () => {

          loginConfirmed =
            true;

        },
        true
      );

    }

  }


  /* =========================================
     INTRO ENTER
     ========================================= */

  function wireIntroEnter() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV81Enter"
          )
        ) {

          markEnteredMana();

          loginConfirmed =
            true;


          setTimeout(
            restoreManaApp,
            120
          );

        }

      },
      true
    );

  }


  /* =========================================
     MEMBERSHIP ORIGIN
     ========================================= */

  function trackMembershipOrigin(
    event
  ) {

    if (
      event.target
        ?.closest(
          "#manaV80Strength"
        )
    ) {

      membershipOrigin =
        "home";

      return;

    }


    if (
      event.target
        ?.closest(
          "#manaV98ChangePlan"
        )
    ) {

      membershipOrigin =
        "strength";

    }

  }


  /* =========================================
     MEMBERSHIP BACK
     ========================================= */

  function membershipBack() {

    document
      .getElementById(
        "manaV98Membership"
      )
      ?.classList
      .remove(
        "open"
      );


    document.body.style.overflow =
      "";


    if (
      membershipOrigin ===
        "strength"
    ) {

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

    }


    membershipOrigin =
      "home";

  }


  function wireMembershipBack() {

    const button =
      document.getElementById(
        "manaV98Close"
      );


    if (!button) {
      return;
    }


    button.textContent =
      "← Back";


    if (
      button.dataset
        .manaV992Wired ===
      "1"
    ) {
      return;
    }


    button.dataset
      .manaV992Wired =
        "1";


    button.addEventListener(
      "click",
      event => {

        event.preventDefault();

        event.stopPropagation();

        event.stopImmediatePropagation();


        membershipBack();

      },
      true
    );

  }


  /* =========================================
     PROFILE / INTRO / COACH BACK
     ========================================= */

  function wireProfileBack() {

    const button =
      document.getElementById(
        "manaProfileClose"
      );


    if (button) {

      button.textContent =
        "← Back";

    }

  }


  function wireIntroBack() {

    const button =
      document.getElementById(
        "manaV81Close"
      );


    if (button) {

      button.textContent =
        "← Back to Home";

    }

  }


  function wireCoachBack() {

    const button =
      document.getElementById(
        "backToCoachClients"
      );


    if (button) {

      button.textContent =
        "← Coach Home";

    }

  }


  /* =========================================
     NAV REFRESH
     ========================================= */

  function refreshNavigation() {

    configureLoginFields();

    wireLogin();

    wireMembershipBack();

    wireProfileBack();

    wireIntroBack();

    wireCoachBack();

  }


  /* =========================================
     SUPABASE SESSION
     ========================================= */

  async function resolveInitialSession() {

    try {

      if (
        typeof
          supabaseClient !==
        "function"
      ) {

        authResolved =
          true;


        showLogin();

        return;

      }


      const client =
        await supabaseClient();


      const {
        data,
        error
      } =
        await client
          .auth
          .getSession();


      if (error) {

        throw error;

      }


      const session =
        data
          ?.session;


      authResolved =
        true;


      if (
        session &&
        hasEnteredMana()
      ) {

        loginConfirmed =
          true;


        scheduleRestore();

        return;

      }


      /*
        A valid session can exist before the
        user has entered the Intro for the
        first time.

        In that case we let the normal app
        login / Intro flow continue.
      */

      if (session) {

        loginConfirmed =
          true;


        hideAuth();

        return;

      }


      loginConfirmed =
        false;


      showLogin();


    } catch (error) {

      console.warn(
        "Mana session restore",
        error
      );


      authResolved =
        true;

      loginConfirmed =
        false;


      showLogin();

    }

  }


  /* =========================================
     AUTH EVENTS
     ========================================= */

  async function watchAuth() {

    try {

      if (
        typeof
          supabaseClient !==
        "function"
      ) {
        return;
      }


      const client =
        await supabaseClient();


      client
        .auth
        .onAuthStateChange(
          (
            event,
            session
          ) => {

            if (
              event ===
                "SIGNED_OUT"
            ) {

              authResolved =
                true;

              loginConfirmed =
                false;


              clearEnteredMana();


              setTimeout(
                showLogin,
                30
              );


              return;

            }


            if (
              (
                event ===
                  "INITIAL_SESSION" ||

                event ===
                  "SIGNED_IN" ||

                event ===
                  "TOKEN_REFRESHED"
              ) &&
              session
            ) {

              authResolved =
                true;

              loginConfirmed =
                true;


              if (
                hasEnteredMana()
              ) {

                scheduleRestore();

              }


              return;

            }

          }
        );


    } catch (error) {

      console.warn(
        "Mana auth watcher",
        error
      );

    }

  }


  /* =========================================
     DOM WATCH
     ========================================= */

  function watchDOM() {

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

                refreshNavigation();


                /*
                  Do not force Login while
                  Supabase is still restoring
                  the phone's session.
                */

                if (
                  authResolved &&
                  !loginConfirmed
                ) {

                  showLogin();

                }

              },
              100
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


  /* =========================================
     PHONE RESUME
     ========================================= */

  function watchPhoneResume() {

    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
            "visible" &&
          loginConfirmed &&
          hasEnteredMana()
        ) {

          scheduleRestore();

        }

      }
    );


    window.addEventListener(
      "pageshow",
      () => {

        if (
          loginConfirmed &&
          hasEnteredMana()
        ) {

          scheduleRestore();

        }

      }
    );


    window.addEventListener(
      "focus",
      () => {

        if (
          loginConfirmed &&
          hasEnteredMana()
        ) {

          scheduleRestore();

        }

      }
    );

  }


  /* =========================================
     LOGOUT
     ========================================= */

  function monitorLogout() {

    window.addEventListener(
      "mana:logout",
      () => {

        authResolved =
          true;

        loginConfirmed =
          false;


        clearEnteredMana();


        showLogin();

      }
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    injectStyles();

    configureLoginFields();

    refreshNavigation();

    watchDOM();

    watchPhoneResume();

    monitorLogout();

    wireIntroEnter();


    document.addEventListener(
      "click",
      trackMembershipOrigin,
      true
    );


    /*
      IMPORTANT:
      Do not show Login immediately.

      First ask Supabase whether the phone
      already has a valid session.
    */

    resolveInitialSession();

    watchAuth();


    [
      250,
      600,
      1200,
      2200
    ].forEach(
      delay => {

        setTimeout(
          () => {

            refreshNavigation();


            if (
              loginConfirmed &&
              hasEnteredMana()
            ) {

              restoreManaApp();

            }

          },
          delay
        );

      }
    );

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
