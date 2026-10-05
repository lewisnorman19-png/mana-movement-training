/* =========================================
   MANA MOVEMENT TRAINING v9.87.4
   LOGIN KORU + PROFILE FLOW
   ========================================= */

(() => {
  "use strict";

  const BUILD = "98740";
  const STYLE_ID = "mana-v9874-login-profile-style";

  const LOGIN_PENDING_KEY = "mana-v987-explicit-login-pending";
  const PROFILE_GATE_KEY = "mana-v987-profile-gate-open";
  const ONBOARDING_COMPLETE_KEY = "mana-onboarding-complete-v9683";

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
     STYLES
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
        min-height:100dvh;

        background:
          #050505
          !important;

        background-image:
          none
          !important;

        overflow-x:
          hidden;
      }


      body:has(#authView:not(.hide))
      > .wrap{

        position:
          relative;

        z-index:
          2;

        width:
          min(
            560px,
            calc(
              100% - 28px
            )
          );

        max-width:
          560px;

        min-height:
          100dvh;

        margin:
          0 auto
          !important;

        padding-top:
          calc(
            env(
              safe-area-inset-top
            ) + 12px
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
         MAIN MANA HEADER
         ===================================== */

      body:has(#authView:not(.hide))
      .brand{

        display:
          flex
          !important;

        visibility:
          visible
          !important;

        opacity:
          1
          !important;

        position:
          relative
          !important;

        z-index:
          20;

        align-items:
          center;

        gap:
          14px;

        width:
          100%;

        min-height:
          72px;

        margin:
          0 0 14px
          !important;

        padding:
          12px 14px
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
          18px
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
          12px
          30px
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
          54px
          !important;

        height:
          54px
          !important;

        flex:
          0 0 54px
          !important;

        display:
          grid;

        place-items:
          center;

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
          34px
          Georgia,
          serif
          !important;

        line-height:
          1;
      }


      body:has(#authView:not(.hide))
      .brand h1{

        margin:
          0;

        color:
          #fff
          !important;

        font-size:
          18px
          !important;

        font-weight:
          950
          !important;

        line-height:
          1.03;

        letter-spacing:
          .12em
          !important;
      }


      body:has(#authView:not(.hide))
      .brand small{

        display:
          block;

        margin-top:
          5px
          !important;

        color:
          #d4b85b
          !important;

        font-size:
          9px
          !important;

        font-weight:
          950
          !important;

        letter-spacing:
          .14em
          !important;
      }


      /* =====================================
         REMOVE OLD HERO BANNER
         ===================================== */

      body:has(#authView:not(.hide))
      #authView
      .hero{

        display:
          none
          !important;
      }


      /* =====================================
         LOGIN / KORU AREA
         ===================================== */

      body:has(#authView:not(.hide))
      #authView{

        position:
          relative;

        z-index:
          2;

        padding-top:
          340px;
      }


      /* =====================================
         NGAI TAKOTO KORU ARTWORK
         ===================================== */

      body:has(#authView:not(.hide))
      #authView::before{

        content:
          "";

        display:
          block;

        position:
          absolute;

        z-index:
          0;

        top:
          0;

        left:
          0;

        width:
          100%;

        height:
          320px;

        pointer-events:
          none;

        border-radius:
          22px;

        overflow:
          hidden;

        background-image:

          linear-gradient(
            180deg,

            rgba(
              0,
              0,
              0,
              .01
            ) 0%,

            rgba(
              0,
              0,
              0,
              .03
            ) 48%,

            rgba(
              0,
              0,
              0,
              .22
            ) 72%,

            rgba(
              5,
              5,
              5,
              .92
            ) 100%
          ),

          url(
            "assets/exercises/mana-ngaitakoto-koru-login.png?v=1001"
          );


        background-repeat:
          no-repeat,
          no-repeat;


        background-size:
          cover,
          cover;


        background-position:
          center center,
          center center;


        box-shadow:
          0
          18px
          42px
          rgba(
            0,
            0,
            0,
            .32
          );
      }


      /* =====================================
         LOGIN CARD
         ===================================== */

      body:has(#authView:not(.hide))
      #authView
      .card{

        position:
          relative;

        z-index:
          3;

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
              .92
            )
          )
          !important;

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


      /* =====================================
         PROFILE NOTE
         ===================================== */

      #manaProfileScreen
      .mana-v987-login-note{

        margin:
          0 0 18px;

        padding:
          14px 16px;

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
         MOBILE
         ===================================== */

      @media(
        max-width:600px
      ){

        body:has(#authView:not(.hide))
        > .wrap{

          width:
            auto;

          max-width:
            none;

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
        .brand{

          min-height:
            66px;

          padding:
            11px 12px
            !important;

          gap:
            12px;

          margin:
            0 0 12px
            !important;
        }


        body:has(#authView:not(.hide))
        .brand
        .mark{

          width:
            50px
            !important;

          height:
            50px
            !important;

          flex:
            0 0 50px
            !important;

          font:
            700
            31px
            Georgia,
            serif
            !important;
        }


        body:has(#authView:not(.hide))
        .brand
        h1{

          font-size:
            16px
            !important;
        }


        body:has(#authView:not(.hide))
        .brand
        small{

          font-size:
            8px
            !important;
        }


        body:has(#authView:not(.hide))
        #authView{

          padding-top:
            285px;
        }


        body:has(#authView:not(.hide))
        #authView::before{

          height:
            270px;

          border-radius:
            20px;

          background-size:
            cover,
            cover;

          background-position:
            center center,
            center center;
        }

      }


      /* =====================================
         SHORT PHONE
         ===================================== */

      @media(
        max-width:600px
      )
      and
      (max-height:740px){

        body:has(#authView:not(.hide))
        #authView{

          padding-top:
            255px;
        }


        body:has(#authView:not(.hide))
        #authView::before{

          height:
            240px;
        }

      }


      /* =====================================
         DESKTOP
         ===================================== */

      @media(
        min-width:900px
      ){

        body:has(#authView:not(.hide))
        > .wrap{

          width:
            min(
              580px,
              calc(
                100% - 36px
              )
            );

          max-width:
            580px;
        }


        body:has(#authView:not(.hide))
        .brand{

          min-height:
            76px;

          padding:
            13px 15px
            !important;
        }


        body:has(#authView:not(.hide))
        .brand
        .mark{

          width:
            56px
            !important;

          height:
            56px
            !important;

          flex:
            0 0 56px
            !important;

          font:
            700
            35px
            Georgia,
            serif
            !important;
        }


        body:has(#authView:not(.hide))
        .brand
        h1{

          font-size:
            19px
            !important;
        }


        body:has(#authView:not(.hide))
        #authView{

          padding-top:
            360px;
        }


        body:has(#authView:not(.hide))
        #authView::before{

          height:
            335px;

          background-size:
            cover,
            cover;

          background-position:
            center center,
            center center;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     LOGIN INTENT
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
     OPEN PROFILE AFTER INTRO
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
      "[Mana v9.87.4] " +
      "Ngai Takoto koru login + profile gate ready"
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
