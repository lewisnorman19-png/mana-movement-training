/* =========================================
   MANA MOVEMENT TRAINING v9.87.1
   LOGIN IDENTITY + REPEAT PROFILE GATE

   LOGIN
   - COMPACT STANDARD MANA HEADER
   - HEADER STAYS AT TOP
   - WARRIOR PORTRAIT STARTS BELOW HEADER
   - FACE SITS IN GAP ABOVE LOGIN
   - PHONE-FIRST

   CLIENT FLOW
   EXPLICIT LOGIN
      ↓
   INTRODUCTION
      ↓
   PROFILE
      ↓
   RETURN TO APP

   EXISTING SIGNED-IN SESSION
   - NOT INTERRUPTED
   - WORKOUT / OVERVIEW REMAINS AVAILABLE

   NO WORKOUT LOGIC CHANGES
   NO AUTH LOGIC CHANGES
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "98710";


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
         LOGIN PAGE
         ===================================== */

      body:has(#authView:not(.hide)){

        min-height:
          100dvh;

        background-color:
          #050505 !important;

        /*
          Layer 1:
          readability gradient.

          Layer 2:
          warrior portrait.

          Portrait deliberately starts
          BELOW the Mana header.
        */

        background-image:

          linear-gradient(
            180deg,

            rgba(
              0,
              0,
              0,
              .04
            ) 0px,

            rgba(
              0,
              0,
              0,
              .05
            ) 110px,

            rgba(
              0,
              0,
              0,
              .04
            ) 200px,

            rgba(
              0,
              0,
              0,
              .16
            ) 340px,

            rgba(
              0,
              0,
              0,
              .58
            ) 500px,

            rgba(
              5,
              5,
              5,
              .90
            ) 680px,

            #050505
            850px
          ),

          url(
            "assets/exercises/mana-warrior-login.jpg"
          )

          !important;


        background-repeat:
          no-repeat,
          no-repeat !important;


        /*
          Gradient starts at top.

          Warrior begins below header.
        */

        background-position:
          center top,
          center 82px !important;


        /*
          Gradient fills screen.

          Portrait preserves composition.
        */

        background-size:
          100% 100%,
          auto calc(100dvh - 82px)
          !important;


        background-attachment:
          scroll,
          scroll
          !important;

      }


      /* =====================================
         PAGE WRAPPER
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
              100% - 28px
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
            ) + 10px
          ) !important;

        padding-bottom:
          calc(
            env(
              safe-area-inset-bottom
            ) + 34px
          );

      }


      /* =====================================
         STANDARD MANA HEADER
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
          13px;

        margin:
          0 !important;

        padding:
          11px 13px !important;

        min-height:
          66px;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .28
          ) !important;

        border-radius:
          17px !important;

        background:
          linear-gradient(
            145deg,
            rgba(
              15,
              14,
              10,
              .92
            ),
            rgba(
              5,
              5,
              5,
              .86
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
          12px
          32px
          rgba(
            0,
            0,
            0,
            .30
          );

      }


      body:has(#authView:not(.hide))
      .brand .mark{

        width:
          48px !important;

        height:
          48px !important;

        flex:
          0
          0
          48px !important;

        display:
          grid;

        place-items:
          center;

        border:
          2px solid
          #d4af37 !important;

        background:
          #080808 !important;

        color:
          #f3d875 !important;

        font:
          700
          31px
          Georgia,
          serif !important;

        line-height:
          1;

      }


      body:has(#authView:not(.hide))
      .brand h1{

        margin:
          0;

        color:
          #fff !important;

        font-size:
          17px !important;

        font-weight:
          950 !important;

        line-height:
          1.05;

        letter-spacing:
          .14em !important;

        text-shadow:
          0
          2px
          12px
          rgba(
            0,
            0,
            0,
            .90
          );

      }


      body:has(#authView:not(.hide))
      .brand small{

        display:
          block;

        margin-top:
          5px !important;

        color:
          #d4b85b !important;

        font-size:
          9px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .15em !important;

      }


      /* =====================================
         WARRIOR FACE GAP

         Compact header above.
         Login starts below portrait.
         ===================================== */

      body:has(#authView:not(.hide))
      #authView .hero{

        margin-top:
          clamp(
            225px,
            31dvh,
            315px
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
            .23
          ) !important;

        background:
          linear-gradient(
            145deg,
            rgba(
              13,
              13,
              13,
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
            .44
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
            38px,
            8vw,
            48px
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
            .50
          ) !important;

        color:
          #f3d875 !important;

      }


      /* =====================================
         RETURNING CLIENT PROFILE NOTE
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
            Keep full portrait width.

            Most importantly:
            portrait now starts lower,
            underneath the compact banner.
          */

          background-position:
            center top,
            center 78px !important;

          background-size:
            100% 100%,
            100% auto
            !important;

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
            12px !important;

          padding-right:
            12px !important;

          padding-top:
            calc(
              env(
                safe-area-inset-top
              ) + 8px
            ) !important;

        }


        /* Standard app-sized banner */

        body:has(#authView:not(.hide))
        .brand{

          gap:
            11px;

          min-height:
            60px;

          padding:
            9px 11px !important;

          border-radius:
            16px !important;

        }


        body:has(#authView:not(.hide))
        .brand .mark{

          width:
            44px !important;

          height:
            44px !important;

          flex-basis:
            44px !important;

          font-size:
            28px !important;

        }


        body:has(#authView:not(.hide))
        .brand h1{

          font-size:
            16px !important;

          letter-spacing:
            .12em !important;

        }


        body:has(#authView:not(.hide))
        .brand small{

          margin-top:
            4px !important;

          font-size:
            8px !important;

          letter-spacing:
            .13em !important;

        }


        /*
          Portrait window.

          This is deliberately a decent gap.
          Warrior face should sit here.
        */

        body:has(#authView:not(.hide))
        #authView .hero{

          margin-top:
            clamp(
              215px,
              29dvh,
              285px
            ) !important;

        }


        body:has(#authView:not(.hide))
        #authView .hero h2{

          font-size:
            clamp(
              37px,
              10.5vw,
              46px
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
      (max-height:720px){

        body:has(#authView:not(.hide))
        #authView .hero{

          margin-top:
            185px !important;

        }

      }


      /* =====================================
         LARGE DESKTOP
         ===================================== */

      @media(
        min-width:900px
      ){

        body:has(#authView:not(.hide)){

          background-position:
            center top,
            center 86px !important;

        }


        body:has(#authView:not(.hide))
        #authView .hero{

          margin-top:
            clamp(
              220px,
              29dvh,
              310px
            ) !important;

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
      First-time users still use
      the original onboarding flow.
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


    setTimeout(
      openRepeatLoginProfile,
      120
    );

  }


  /* =========================================
     PROFILE SAVED
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
     PROFILE CLOSED MANUALLY
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
     EXISTING SESSION PROTECTION
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
      Already signed in.

      Do not force the login/profile
      sequence on a restored session.
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
      "[Mana v9.87.1] " +
      "login + profile flow ready"
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
