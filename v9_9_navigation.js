/* =========================================
   MANA MOVEMENT TRAINING v9.9.1
   NAVIGATION + LOGIN FLOW

   FIXES:
   - REFRESH ALWAYS SHOWS LOGIN
   - BROWSER CAN REMEMBER LOGIN DETAILS
   - MEMBERSHIP BACK NAVIGATION
   - PROFILE BACK NAVIGATION
   - INTRO BACK NAVIGATION
   - STRENGTH SMART BACK
   - COACH CLIENT BACK
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v991-navigation-style";


  let loginConfirmed =
    false;


  let membershipOrigin =
    "home";


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

      /* ==========================
         SHARED BACK BUTTON
         ========================== */

      .mana-v991-back{
        min-height:42px;

        padding:
          0
          14px;

        border:
          1px solid
          #343434;

        border-radius:14px;

        background:#111;

        color:#f3d875;

        font-size:12px;

        font-weight:900;

        cursor:pointer;
      }


      /* ==========================
         PROFILE BACK
         ========================== */

      #manaProfileClose{
        width:auto !important;

        min-width:86px !important;

        height:44px !important;

        padding:
          0
          13px !important;

        border-radius:
          14px !important;

        color:#f3d875 !important;

        font-size:
          12px !important;

        font-weight:
          900 !important;
      }


      /* ==========================
         MEMBERSHIP BACK
         ========================== */

      #manaV98Close{
        width:auto !important;

        min-width:86px !important;

        height:44px !important;

        padding:
          0
          13px !important;

        border-radius:
          14px !important;

        color:#f3d875 !important;

        font-size:
          12px !important;

        font-weight:
          900 !important;
      }


      /* ==========================
         INTRO BACK
         ========================== */

      #manaV81Close{
        min-height:48px;

        border:
          1px solid
          #343434 !important;

        background:
          #111 !important;

        color:
          #f3d875 !important;

        font-weight:
          900 !important;
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


    /*
      We deliberately DO NOT store
      the password ourselves.

      Chrome / Edge / Safari / iPhone
      Passwords handle this securely.
    */

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
        "manaV98Membership"
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


    document
      .getElementById(
        "manaV97CoachNav"
      )
      ?.classList
      .remove(
        "open"
      );


    const coachLogout =
      document.getElementById(
        "manaV97CoachLogout"
      );


    if (coachLogout) {

      coachLogout.style.display =
        "none";

    }


    const oldNav =
      document.getElementById(
        "bottomNav"
      );


    oldNav
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


    window.scrollTo({
      top:0,
      behavior:"instant"
    });
  }


  /* =========================================
     LOGIN FORM
     ========================================= */

  function wireLogin() {

    const form =
      document.getElementById(
        "loginForm"
      );


    if (!form) {
      return;
    }


    if (
      form.dataset
        .manaV991Wired ===
      "1"
    ) {
      return;
    }


    form.dataset
      .manaV991Wired =
        "1";


    form.addEventListener(
      "submit",
      () => {

        /*
          User deliberately pressed Login.

          From this point Mana is allowed
          to open the client / coach app.
        */

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


    const signup =
      document.getElementById(
        "signupForm"
      );


    if (
      signup &&
      signup.dataset
        .manaV991Wired !==
      "1"
    ) {

      signup.dataset
        .manaV991Wired =
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
     MEMBERSHIP ORIGIN
     ========================================= */

  function trackMembershipOrigin(
    event
  ) {

    const strength =
      event.target
        ?.closest(
          "#manaV80Strength"
        );


    if (strength) {

      membershipOrigin =
        "home";

      return;
    }


    const change =
      event.target
        ?.closest(
          "#manaV98ChangePlan"
        );


    if (change) {

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

      /*
        Membership was opened from
        CHANGE PLAN inside Strength.

        Go back to Strength Overview.
      */

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


    /*
      If origin = home,
      simply closing membership reveals
      the Home screen underneath.
    */

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
        .manaV991Wired ===
      "1"
    ) {
      return;
    }


    button.dataset
      .manaV991Wired =
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
     PROFILE BACK
     ========================================= */

  function wireProfileBack() {

    const button =
      document.getElementById(
        "manaProfileClose"
      );


    if (!button) {
      return;
    }


    /*
      v6.7 already remembers whether
      Profile came from Strength or Home.

      Keep that existing behaviour.
    */

    button.textContent =
      "← Back";
  }


  /* =========================================
     INTRO BACK
     ========================================= */

  function wireIntroBack() {

    const button =
      document.getElementById(
        "manaV81Close"
      );


    if (!button) {
      return;
    }


    button.textContent =
      "← Back to Home";
  }


  /* =========================================
     STRENGTH BACK
     ========================================= */

  function refreshStrengthBack() {

    const button =
      document.getElementById(
        "manaV83Back"
      );


    if (!button) {
      return;
    }


    /*
      Existing v8.3 behaviour is already:

      Program
      Fuel
      Progress
      Learn

          ↓

      Overview

          ↓

      Home

      So we leave the handler alone.
    */

  }


  /* =========================================
     COACH CLIENT BACK
     ========================================= */

  function wireCoachBack() {

    const button =
      document.getElementById(
        "backToCoachClients"
      );


    if (!button) {
      return;
    }


    button.textContent =
      "← Coach Home";
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


      const c =
        await supabaseClient();


      c.auth.onAuthStateChange(
        (
          event,
          session
        ) => {

          /*
            Ignore automatic browser session
            restoration during page startup.

            Mana stays at Login until the
            user deliberately logs in.
          */

          if (
            event ===
              "INITIAL_SESSION"
          ) {

            if (
              !loginConfirmed
            ) {

              setTimeout(
                showLogin,
                20
              );

            }


            return;
          }


          if (
            event ===
              "TOKEN_REFRESHED"
          ) {

            if (
              !loginConfirmed
            ) {

              setTimeout(
                showLogin,
                20
              );

            }


            return;
          }


          if (
            event ===
              "SIGNED_OUT"
          ) {

            loginConfirmed =
              false;


            setTimeout(
              showLogin,
              20
            );


            return;
          }


          /*
            SIGNED_IN only gets control
            after the Login form has been
            deliberately submitted.
          */

          if (
            event ===
              "SIGNED_IN" &&
            !loginConfirmed
          ) {

            setTimeout(
              showLogin,
              20
            );

          }

        }
      );


    } catch (error) {

      console.warn(
        "Mana navigation auth",
        error
      );

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

    refreshStrengthBack();

    wireCoachBack();

  }


  /* =========================================
     WATCH DOM
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
                  Home and the old session
                  restorer may try to reopen
                  screens after page refresh.

                  Until deliberate login,
                  force Login back on top.
                */

                if (
                  !loginConfirmed
                ) {

                  showLogin();

                }

              },
              90
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
     LOGOUT RESET
     ========================================= */

  function monitorLogout() {

    window.addEventListener(
      "mana:logout",
      () => {

        loginConfirmed =
          false;


        showLogin();

      }
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    injectStyles();


    /*
      Every browser refresh begins here.

      This is intentional.
    */

    loginConfirmed =
      false;


    configureLoginFields();

    showLogin();

    refreshNavigation();

    watchAuth();

    watchDOM();

    monitorLogout();


    document.addEventListener(
      "click",
      trackMembershipOrigin,
      true
    );


    /*
      Older Mana scripts can continue
      initializing for a short period.

      Reassert Login while boot finishes.
    */

    [
      150,
      350,
      700,
      1200,
      2000,
      3200
    ].forEach(
      delay => {

        setTimeout(
          () => {

            refreshNavigation();


            if (
              !loginConfirmed
            ) {

              showLogin();

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
