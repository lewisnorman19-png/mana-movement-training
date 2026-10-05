/* =========================================
   MANA MOVEMENT TRAINING v9.87.2
   LOGIN PORTRAIT + PROFILE FLOW

   LOGIN
   - STANDARD COMPACT MANA BANNER
   - DEDICATED WARRIOR PORTRAIT WINDOW
   - NO LOGIN CARD OVER WARRIOR FACE
   - PHONE + DESKTOP

   CLIENT FLOW
   EXPLICIT LOGIN
      ↓
   INTRODUCTION
      ↓
   PROFILE
      ↓
   RETURN TO APP

   RESTORED SESSION
   - NO INTERRUPTION
   - WORKOUT / OVERVIEW PRESERVED
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "98720";


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
     LOGIN STYLING
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
         PAGE
         ===================================== */

      body:has(#authView:not(.hide)){

        min-height:100dvh;

        background:#050505
          !important;

        background-image:none
          !important;

        overflow-x:hidden;

      }


      body:has(#authView:not(.hide))
      > .wrap{

        position:relative;

        z-index:2;

        width:
          min(
            540px,
            calc(100% - 28px)
          );

        max-width:540px;

        min-height:100dvh;

        margin:
          0 auto
          !important;

        padding-top:
          calc(
            env(
              safe-area-inset-top
            ) + 10px
          )
          !important;

        padding-bottom:
          calc(
            env(
              safe-area-inset-bottom
            ) + 32px
          );

      }


      /* =====================================
         STANDARD MANA BANNER
         ===================================== */

      body:has(#authView:not(.hide))
      .brand{

        display:flex
          !important;

        visibility:visible
          !important;

        opacity:1
          !important;

        position:relative
          !important;

        z-index:20;

        align-items:center;

        gap:11px;

        width:100%;

        min-height:58px;

        margin:
          0
          0
          10px
          !important;

        padding:
          9px
          11px
          !important;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .26
          )
          !important;

        border-radius:
          15px
          !important;

        background:
          linear-gradient(
            145deg,
            #17150e,
            #080808
          )
          !important;

        box-shadow:
          0
          10px
          28px
          rgba(
            0,
            0,
            0,
            .28
          );

      }


      body:has(#authView:not(.hide))
      .brand .mark{

        width:44px
          !important;

        height:44px
          !important;

        flex:
          0 0 44px
          !important;

        display:grid;

        place-items:center;

        border:
          2px solid
          #d4af37
          !important;

        background:
          #080808
          !important;

        color:
          #f3d875
          !important;

        font:
          700
          28px
          Georgia,
          serif
          !important;

        line-height:1;

      }


      body:has(#authView:not(.hide))
      .brand h1{

        margin:0;

        color:#fff
          !important;

        font-size:16px
          !important;

        font-weight:950
          !important;

        line-height:1.05;

        letter-spacing:
          .12em
          !important;

      }


      body:has(#authView:not(.hide))
      .brand small{

        display:block;

        margin-top:4px
          !important;

        color:
          #d4b85b
          !important;

        font-size:8px
          !important;

        font-weight:950
          !important;

        letter-spacing:
          .13em
          !important;

      }


      /* =====================================
         AUTH AREA
         ===================================== */

      body:has(#authView:not(.hide))
      #authView{

        position:relative;

        z-index:2;

        /*
          Reserve actual space for
          warrior portrait.

          Nothing overlaps it.
        */

        padding-top:
          270px;

      }


      /* =====================================
         WARRIOR PORTRAIT WINDOW
         ===================================== */

      body:has(#authView:not(.hide))
      #authView::before{

        content:"";

        display:block;

        position:absolute;

        z-index:0;

        top:0;

        left:50%;

        transform:
          translateX(-50%);

        width:100vw;

        height:255px;

        pointer-events:none;

        background-color:
          #050505;

        background-image:

          linear-gradient(
            180deg,

            rgba(
              0,
              0,
              0,
              .02
            ) 0%,

            rgba(
              0,
              0,
              0,
              .02
            ) 58%,

            rgba(
              0,
              0,
              0,
              .32
            ) 78%,

            #050505
            100%
          ),

          url(
            "assets/exercises/mana-warrior-login.jpg"
          );


        background-repeat:
          no-repeat,
          no-repeat;


        /*
          Show the portrait properly,
          rather than using COVER.
        */

        background-size:
          100% 100%,
          auto 100%;


        /*
          Move the portrait DOWN slightly
          inside this dedicated window.
        */

        background-position:
          center center,
          center 18%;

      }


      /* =====================================
         LOGIN CARDS
         ===================================== */

      body:has(#authView:not(.hide))
      #authView .card{

        position:relative;

        z-index:3;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .23
          )
          !important;

        background:
          linear-gradient(
            145deg,
            rgba(
              13,
              13,
              13,
              .96
            ),
            rgba(
              5,
              5,
              5,
              .91
            )
          )
          !important;

        -webkit-backdrop-filter:
          blur(12px);

        backdrop-filter:
          blur(12px);

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
      #authView .hero{

        margin-top:0
          !important;

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
          )
          !important;

        line-height:.98;

      }


      body:has(#authView:not(.hide))
      #authView .hero .pill{

        border-color:
          rgba(
            243,
            216,
            117,
            .38
          )
          !important;

        background:
          rgba(
            0,
            0,
            0,
            .55
          )
          !important;

        color:
          #f3d875
          !important;

      }


      /* =====================================
         RETURNING PROFILE NOTE
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

        border-radius:15px;

        background:
          linear-gradient(
            145deg,
            #17140a,
            #0c0c0c
          );

        color:#cfc6a2;

        font-size:13px;

        line-height:1.5;

      }


      #manaProfileScreen
      .mana-v987-login-note
      strong{

        color:#f3d875;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(
        max-width:600px
      ){

        body:has(#authView:not(.hide))
        > .wrap{

          width:auto;

          max-width:none;

          margin:
            0 auto
            !important;

          padding-left:
            12px
            !important;

          padding-right:
            12px
            !important;

          padding-top:
            calc(
              env(
                safe-area-inset-top
              ) + 8px
            )
            !important;

        }


        body:has(#authView:not(.hide))
        #authView{

          padding-top:
            235px;

        }


        body:has(#authView:not(.hide))
        #authView::before{

          height:
            222px;


          background-size:
            100% 100%,
            auto 100%;


          /*
            Face sits a little lower
            on mobile.
          */

          background-position:
            center center,
            center 26%;

        }


        body:has(#authView:not(.hide))
        #authView .hero h2{

          font-size:
            clamp(
              37px,
              10.5vw,
              46px
            )
            !important;

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
        #authView{

          padding-top:
            205px;

        }


        body:has(#authView:not(.hide))
        #authView::before{

          height:
            192px;

        }

      }


      /* =====================================
         DESKTOP
         ===================================== */

      @media(
        min-width:900px
      ){

        body:has(#authView:not(.hide))
        #authView{

          padding-top:
            285px;

        }


        body:has(#authView:not(.hide))
        #authView::before{

          height:
            270px;


          background-size:
            100% 100%,
            auto 100%;


          background-position:
            center center,
            center 22%;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     EXPLICIT LOGIN
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
     PROFILE NOTE
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
     PROFILE AFTER INTRO
     ========================================= */

  function openRepeatLoginProfile() {

    if (
      !explicitLoginPending()
    ) {

      return;

    }


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
     PROFILE CLOSE
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
     EXISTING SESSION
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
      "[Mana v9.87.2] " +
      "portrait login + profile gate ready"
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
