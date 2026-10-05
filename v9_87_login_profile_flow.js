/* =========================================
   MANA MOVEMENT TRAINING v9.87.0
   LOGIN IDENTITY + REPEAT PROFILE GATE

   LOGIN
   - STRONG MANA MOVEMENT BRAND AT TOP
   - LARGE M MARK
   - OPEN PORTRAIT SPACE FOR WARRIOR FACE
   - LOGIN CONTENT LOWER ON PAGE
   - PHONE-FIRST PORTRAIT DISPLAY

   CLIENT FLOW
   EXPLICIT LOGIN
      ↓
   INTRODUCTION
      ↓
   PROFILE
      ↓
   RETURN TO APP

   IMPORTANT
   - FIRST-EVER ONBOARDING STILL USES v9.68
   - EXISTING LOGGED-IN SESSION IS NOT INTERRUPTED
   - WORKOUT / OVERVIEW POSITION IS NOT RESET
   - NO AUTH LOGIC CHANGES
   - NO WORKOUT LOGIC CHANGES
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "98700";


  const STYLE_ID =
    "mana-v987-login-profile-style";


  const LOGIN_PENDING_KEY =
    "mana-v987-explicit-login-pending";


  const PROFILE_GATE_KEY =
    "mana-v987-profile-gate-open";


  const ONBOARDING_COMPLETE_KEY =
    "mana-onboarding-complete-v9683";


  /* =========================================
     HELPERS
     ========================================= */

  function onboardingComplete() {

    try {

      return (
        localStorage.getItem(
          ONBOARDING_COMPLETE_KEY
        ) === "1"
      );

    } catch (_) {

      return false;

    }

  }


  function explicitLoginPending() {

    try {

      return (
        sessionStorage.getItem(
          LOGIN_PENDING_KEY
        ) === "1"
      );

    } catch (_) {

      return false;

    }

  }


  function profileGateOpen() {

    try {

      return (
        sessionStorage.getItem(
          PROFILE_GATE_KEY
        ) === "1"
      );

    } catch (_) {

      return false;

    }

  }


  function markExplicitLogin() {

    try {

      sessionStorage.setItem(
        LOGIN_PENDING_KEY,
        "1"
      );

    } catch (_) {}

  }


  function clearLoginGate() {

    try {

      sessionStorage.removeItem(
        LOGIN_PENDING_KEY
      );

      sessionStorage.removeItem(
        PROFILE_GATE_KEY
      );

    } catch (_) {}

  }


  /* =========================================
     VISUAL STYLE
     ========================================= */

  function installStyles() {

    document
      .getElementById(
        STYLE_ID
      )
      ?.remove();


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      /* =====================================
         LOGIN BACKGROUND

         Full portrait behind page.
         Do not split warrior to one side.
         ===================================== */

      body:has(#authView:not(.hide)){

        min-height:
          100dvh;

        background-color:
          #050505 !important;

        background-image:

          linear-gradient(
            180deg,

            rgba(
              0,
              0,
              0,
              .03
            ) 0%,

            rgba(
              0,
              0,
              0,
              .06
            ) 18%,

            rgba(
              0,
              0,
              0,
              .10
            ) 34%,

            rgba(
              0,
              0,
              0,
              .36
            ) 48%,

            rgba(
              0,
              0,
              0,
              .76
            ) 67%,

            rgba(
              5,
              5,
              5,
              .94
            ) 84%,

            #050505
            100%
          ),

          url(
            "assets/exercises/mana-warrior-login.jpg"
          )

          !important;


        background-repeat:
          no-repeat !important;


        background-position:
          center top !important;


        /*
          Height-based sizing avoids the
          aggressive desktop COVER crop.
        */

        background-size:
          auto 100dvh !important;


        background-attachment:
          scroll !important;

      }


      /* =====================================
         LOGIN WRAPPER
         ===================================== */

      body:has(#authView:not(.hide))
      > .wrap{

        position:
          relative;

        z-index:
          2;

        width:
          min(
            540px,
            calc(
              100% - 32px
            )
          );

        max-width:
          540px;

        min-height:
          100dvh;

        margin:
          0 auto !important;

        padding-top:
          calc(
            env(
              safe-area-inset-top
            ) + 14px
          ) !important;

        padding-bottom:
          calc(
            env(
              safe-area-inset-bottom
            ) + 34px
          );

      }


      /* =====================================
         BRAND HEADER
         ===================================== */

      body:has(#authView:not(.hide))
      .brand{

        position:
          relative;

        z-index:
          5;

        display:
          flex;

        align-items:
          center;

        gap:
          17px;

        margin:
          0 !important;

        padding:
          15px 18px !important;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .40
          ) !important;

        border-radius:
          20px !important;

        background:
          linear-gradient(
            145deg,
            rgba(
              4,
              4,
              4,
              .88
            ),
            rgba(
              10,
              9,
              5,
              .68
            )
          ) !important;

        -webkit-backdrop-filter:
          blur(
            9px
          );

        backdrop-filter:
          blur(
            9px
          );

        box-shadow:

          0
          15px
          45px
          rgba(
            0,
            0,
            0,
            .36
          ),

          inset
          0
          0
          24px
          rgba(
            243,
            216,
            117,
            .025
          );

      }


      body:has(#authView:not(.hide))
      .brand .mark{

        width:
          72px !important;

        height:
          72px !important;

        flex:
          0
          0
          72px !important;

        display:
          grid;

        place-items:
          center;

        border:
          2px solid
          #f3d875 !important;

        background:
          rgba(
            0,
            0,
            0,
            .86
          ) !important;

        color:
          #f3d875 !important;

        font-size:
          46px !important;

        line-height:
          1;

        box-shadow:

          0
          0
          0
          1px
          rgba(
            243,
            216,
            117,
            .08
          ),

          inset
          0
          0
          24px
          rgba(
            243,
            216,
            117,
            .07
          );

      }


      body:has(#authView:not(.hide))
      .brand h1{

        margin:
          0;

        color:
          #fff !important;

        font-size:
          24px !important;

        font-weight:
          950 !important;

        line-height:
          1.05;

        letter-spacing:
          .12em !important;

        text-shadow:
          0
          3px
          16px
          rgba(
            0,
            0,
            0,
            .95
          );

      }


      body:has(#authView:not(.hide))
      .brand small{

        display:
          block;

        margin-top:
          7px !important;

        color:
          #f3d875 !important;

        font-size:
          10px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .18em !important;

      }


      /* =====================================
         WARRIOR PORTRAIT WINDOW

         This empty area is deliberate.
         The warrior face lives here.
         ===================================== */

      body:has(#authView:not(.hide))
      #authView .hero{

        margin-top:
          clamp(
            190px,
            28dvh,
            285px
          ) !important;

      }


      /* =====================================
         LOGIN CARDS
         ===================================== */

      body:has(#authView:not(.hide))
      #authView .card{

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .24
          ) !important;

        background:
          linear-gradient(
            145deg,
            rgba(
              12,
              12,
              12,
              .91
            ),
            rgba(
              5,
              5,
              5,
              .84
            )
          ) !important;

        -webkit-backdrop-filter:
          blur(
            12px
          );

        backdrop-filter:
          blur(
            12px
          );

        box-shadow:
          0
          18px
          50px
          rgba(
            0,
            0,
            0,
            .46
          );

      }


      body:has(#authView:not(.hide))
      #authView .hero h2{

        margin:
          15px
          0
          12px;

        font-size:
          clamp(
            40px,
            8vw,
            50px
          ) !important;

        line-height:
          .98;

      }


      body:has(#authView:not(.hide))
      #authView .hero .pill{

        border-color:
          rgba(
            243,
            216,
            117,
            .38
          ) !important;

        background:
          rgba(
            0,
            0,
            0,
            .52
          ) !important;

        color:
          #f3d875 !important;

      }


      /* =====================================
         REPEAT LOGIN PROFILE
         ===================================== */

      #manaProfileScreen
      .mana-v987-login-note{

        margin:
          0
          0
          18px;

        padding:
          14px
          16px;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .30
          );

        border-radius:
          15px;

        background:
          linear-gradient(
            145deg,
            #17140a,
            #0c0c0c
          );

        color:
          #cfc6a2;

        font-size:
          13px;

        line-height:
          1.5;

      }


      #manaProfileScreen
      .mana-v987-login-note
      strong{

        color:
          #f3d875;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(
        max-width:600px
      ){

        body:has(#authView:not(.hide)){

          /*
            Show full image width on phone
            instead of cropping the sides.
          */

          background-size:
            100% auto !important;

          background-position:
            center top !important;

        }


        body:has(#authView:not(.hide))
        > .wrap{

          width:
            auto;

          max-width:
            none;

          margin:
            0 auto !important;

          padding-left:
            14px !important;

          padding-right:
            14px !important;

        }


        body:has(#authView:not(.hide))
        .brand{

          gap:
            13px;

          padding:
            12px 13px !important;

          border-radius:
            18px !important;

        }


        body:has(#authView:not(.hide))
        .brand .mark{

          width:
            62px !important;

          height:
            62px !important;

          flex-basis:
            62px !important;

          font-size:
            40px !important;

        }


        body:has(#authView:not(.hide))
        .brand h1{

          font-size:
            19px !important;

          letter-spacing:
            .10em !important;

        }


        body:has(#authView:not(.hide))
        .brand small{

          font-size:
            9px !important;

          letter-spacing:
            .13em !important;

        }


        /*
          Leave a clean portrait area
          between brand and login.
        */

        body:has(#authView:not(.hide))
        #authView .hero{

          margin-top:
            clamp(
              175px,
              27dvh,
              245px
            ) !important;

        }


        body:has(#authView:not(.hide))
        #authView .hero h2{

          font-size:
            clamp(
              38px,
              11vw,
              47px
            ) !important;

        }

      }


      /* =====================================
         SHORT PHONE
         ===================================== */

      @media(
        max-width:600px
      )
      and
      (max-height:700px){

        body:has(#authView:not(.hide))
        #authView .hero{

          margin-top:
            145px !important;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     EXPLICIT LOGIN DETECTION

     This is the important distinction:

     USER SUBMITS LOGIN FORM
     = run Intro → Profile.

     EXISTING SUPABASE SESSION RESTORES
     = leave client where they are.
     ========================================= */

  function bindLoginIntent() {

    const form =
      document.getElementById(
        "loginForm"
      );


    if (
      !form ||
      form.dataset
        .manaV987Bound ===
        "1"
    ) {

      return;

    }


    form.dataset
      .manaV987Bound =
      "1";


    form.addEventListener(
      "submit",
      () => {

        markExplicitLogin();

      },
      true
    );

  }


  /* =========================================
     PROFILE LOGIN MESSAGE
     ========================================= */

  function addProfileLoginNote() {

    const screen =
      document.getElementById(
        "manaProfileScreen"
      );


    if (!screen) {

      return;

    }


    document
      .getElementById(
        "manaV987LoginNote"
      )
      ?.remove();


    const card =
      screen.querySelector(
        ".mana-profile-card"
      );


    if (!card) {

      return;

    }


    const note =
      document.createElement(
        "div"
      );


    note.id =
      "manaV987LoginNote";


    note.className =
      "mana-v987-login-note";


    note.innerHTML = `

      <strong>
        Welcome back.
      </strong>

      Check that your profile,
      training setup and goals
      are still right before
      continuing into Mana.

    `;


    card.insertAdjacentElement(
      "beforebegin",
      note
    );


    const save =
      document.getElementById(
        "manaProfileSave"
      );


    if (save) {

      save.textContent =
        "SAVE & CONTINUE →";

    }

  }


  /* =========================================
     OPEN PROFILE AFTER INTRO
     ========================================= */

  function openRepeatLoginProfile() {

    if (
      !explicitLoginPending()
    ) {

      return;

    }


    /*
      New clients still use the complete
      v9.68 first-time onboarding flow.

      This repeat-login gate is only for
      clients who already completed it.
    */

    if (
      !onboardingComplete()
    ) {

      return;

    }


    try {

      sessionStorage.setItem(
        PROFILE_GATE_KEY,
        "1"
      );

    } catch (_) {}


    if (
      typeof
        window
          .openManaProfile !==
      "function"
    ) {

      return;

    }


    window.openManaProfile();


    [
      30,
      120,
      260
    ].forEach(
      delay => {

        setTimeout(
          addProfileLoginNote,
          delay
        );

      }
    );

  }


  function handleIntroExit(
    event
  ) {

    const button =
      event.target.closest(
        "#manaV81Enter, " +
        "#manaV81Close"
      );


    if (!button) {

      return;

    }


    if (
      !explicitLoginPending() ||
      !onboardingComplete()
    ) {

      return;

    }


    /*
      v8.1 closes the intro normally.

      We wait briefly, then open the
      existing profile screen.
    */

    setTimeout(
      openRepeatLoginProfile,
      120
    );

  }


  /* =========================================
     PROFILE SAVE
     ========================================= */

  function handleProfileSaved() {

    if (
      !profileGateOpen()
    ) {

      return;

    }


    const screen =
      document.getElementById(
        "manaProfileScreen"
      );


    /*
      v6.7 has already saved all profile
      and Fuel data by the time this
      event fires.
    */

    setTimeout(
      () => {

        screen
          ?.classList
          .remove(
            "open"
          );


        document
          .getElementById(
            "manaV987LoginNote"
          )
          ?.remove();


        const save =
          document.getElementById(
            "manaProfileSave"
          );


        if (save) {

          save.textContent =
            "SAVE PROFILE";

        }


        clearLoginGate();


        document.body.style
          .overflow =
          "";

      },
      180
    );

  }


  /* =========================================
     CANCEL / CLOSE PROFILE

     If a returning client closes Profile
     manually, count the login gate as
     complete so it does not loop.
     ========================================= */

  function handleProfileClose(
    event
  ) {

    if (
      !profileGateOpen()
    ) {

      return;

    }


    if (
      !event.target.closest(
        "#manaProfileClose"
      )
    ) {

      return;

    }


    clearLoginGate();


    document
      .getElementById(
        "manaV987LoginNote"
      )
      ?.remove();

  }


  /* =========================================
     SAFETY

     A restored session should never
     accidentally carry an old pending
     login into a future app launch.

     If auth is already hidden when this
     file first starts and no login form
     was submitted during this page life,
     do not start a Profile gate.
     ========================================= */

  function protectSessionRestore() {

    const auth =
      document.getElementById(
        "authView"
      );


    if (
      !auth ||
      !auth.classList
        .contains(
          "hide"
        )
    ) {

      return;

    }


    /*
      A client session is already active.
      Do not manufacture a fresh login gate.
    */

    if (
      !profileGateOpen()
    ) {

      try {

        sessionStorage.removeItem(
          LOGIN_PENDING_KEY
        );

      } catch (_) {}

    }

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    bindLoginIntent();

    protectSessionRestore();


    document.addEventListener(
      "click",
      handleIntroExit,
      true
    );


    document.addEventListener(
      "click",
      handleProfileClose,
      true
    );


    window.addEventListener(
      "mana:profile-synced",
      handleProfileSaved
    );


    /*
      Login DOM already exists today,
      but these small delayed binds make
      this safe if auth rendering changes.
    */

    [
      300,
      900
    ].forEach(
      delay => {

        setTimeout(
          bindLoginIntent,
          delay
        );

      }
    );


    window.MANA_LOGIN_PROFILE_BUILD =
      BUILD;


    console.log(
      "[Mana v9.87.0] " +
      "login identity + profile gate ready"
    );

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:true
      }
    );

  } else {

    init();

  }

})();
