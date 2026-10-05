/* =========================================
   MANA MOVEMENT TRAINING v9.86.0
   VISUAL IDENTITY UPGRADE

   LOGIN
   - MĀORI WARRIOR BACKGROUND
   - STRONGER MANA BRAND HEADER
   - GLASS / BLACK LOGIN PANELS

   INTRODUCTION
   - MĀORI WAHINE BACKGROUND
   - MOKO KAUAE PORTRAIT
   - READABLE DARK OVERLAY

   HOME
   - SELECTED PROGRAM = GOLD / YELLOW
   - CLEAR CURRENT PROGRAM STATE

   NO RENDER OBSERVERS
   NO WORKOUT LOGIC CHANGES
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "98600";


  const STYLE_ID =
    "mana-v986-visual-style";


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
         LOGIN
         ===================================== */

      body:has(#authView:not(.hide)){

        min-height:100dvh;

        background:
          linear-gradient(
            180deg,
            rgba(0,0,0,.22) 0%,
            rgba(0,0,0,.48) 35%,
            rgba(0,0,0,.88) 72%,
            #050505 100%
          ),
          linear-gradient(
            90deg,
            rgba(0,0,0,.15),
            rgba(0,0,0,.42)
          ),
          url(
            "assets/exercises/mana-warrior-login.jpg"
          )
          center 18%
          /
          cover
          fixed
          no-repeat;

      }


      body:has(#authView:not(.hide))
      > .wrap{

        position:relative;

        z-index:1;

        max-width:540px;

        min-height:100dvh;

        padding-top:
          calc(
            env(
              safe-area-inset-top
            ) + 24px
          );

      }


      /* existing Mana header */

      body:has(#authView:not(.hide))
      .brand{

        position:relative;

        z-index:3;

        align-items:center;

        margin:
          8px 0 30px;

        padding:
          16px 17px;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .28
          );

        border-radius:20px;

        background:
          linear-gradient(
            145deg,
            rgba(
              10,
              10,
              10,
              .82
            ),
            rgba(
              3,
              3,
              3,
              .58
            )
          );

        -webkit-backdrop-filter:
          blur(12px);

        backdrop-filter:
          blur(12px);

        box-shadow:
          0 18px 50px
          rgba(
            0,
            0,
            0,
            .28
          );

      }


      body:has(#authView:not(.hide))
      .brand .mark{

        width:60px;

        height:60px;

        flex:
          0 0 60px;

        border:
          2px solid
          #f3d875;

        background:
          rgba(
            0,
            0,
            0,
            .72
          );

        color:#f3d875;

        font-size:39px;

        box-shadow:
          inset
          0 0 20px
          rgba(
            243,
            216,
            117,
            .06
          );

      }


      body:has(#authView:not(.hide))
      .brand h1{

        color:#fff;

        font-size:21px;

        font-weight:950;

        letter-spacing:.17em;

        text-shadow:
          0 2px 12px
          rgba(
            0,
            0,
            0,
            .85
          );

      }


      body:has(#authView:not(.hide))
      .brand small{

        margin-top:6px;

        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.16em;

      }


      body:has(#authView:not(.hide))
      #authView{

        position:relative;

        z-index:3;

      }


      body:has(#authView:not(.hide))
      #authView .card{

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .22
          );

        background:
          linear-gradient(
            145deg,
            rgba(
              13,
              13,
              13,
              .92
            ),
            rgba(
              5,
              5,
              5,
              .82
            )
          );

        -webkit-backdrop-filter:
          blur(14px);

        backdrop-filter:
          blur(14px);

        box-shadow:
          0 20px 55px
          rgba(
            0,
            0,
            0,
            .42
          );

      }


      body:has(#authView:not(.hide))
      #authView .hero{

        margin-top:5px;

      }


      body:has(#authView:not(.hide))
      #authView .hero h2{

        margin:
          16px 0 12px;

        font-size:
          clamp(
            38px,
            10vw,
            48px
          );

        line-height:.98;

        text-shadow:
          0 3px 18px
          #000;

      }


      body:has(#authView:not(.hide))
      #authView .hero .pill{

        border-color:
          rgba(
            243,
            216,
            117,
            .36
          );

        background:
          rgba(
            0,
            0,
            0,
            .52
          );

        color:#f3d875;

      }


      body:has(#authView:not(.hide))
      #authView input{

        min-height:52px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .18
          );

        background:
          rgba(
            5,
            5,
            5,
            .82
          );

        box-shadow:
          inset
          0 0 18px
          rgba(
            0,
            0,
            0,
            .32
          );

      }


      body:has(#authView:not(.hide))
      #authView input:focus{

        outline:none;

        border-color:#f3d875;

        box-shadow:
          0 0 0 2px
          rgba(
            243,
            216,
            117,
            .10
          );

      }


      body:has(#authView:not(.hide))
      #authView .primary{

        min-height:56px;

        background:
          linear-gradient(
            135deg,
            #f7df7e,
            #c79825
          );

        color:#080808;

        font-weight:950;

        box-shadow:
          0 10px 30px
          rgba(
            212,
            175,
            55,
            .18
          );

      }


      /* =====================================
         INTRODUCTION / WAHINE
         ===================================== */

      #manaV81Intro{

        background:
          linear-gradient(
            180deg,
            rgba(
              0,
              0,
              0,
              .18
            ) 0%,
            rgba(
              0,
              0,
              0,
              .46
            ) 25%,
            rgba(
              5,
              5,
              5,
              .90
            ) 53%,
            #050505 78%
          ),
          linear-gradient(
            90deg,
            rgba(
              0,
              0,
              0,
              .22
            ),
            rgba(
              0,
              0,
              0,
              .18
            )
          ),
          url(
            "assets/exercises/mana-wahine-intro.jpg"
          )
          center top
          /
          cover
          fixed
          no-repeat
          !important;

      }


      #manaV81Intro
      .mana-v81-content{

        position:relative;

        z-index:3;

      }


      #manaV81Intro
      .mana-v81-mark{

        background:
          rgba(
            0,
            0,
            0,
            .72
          );

        box-shadow:
          0 10px 40px
          rgba(
            0,
            0,
            0,
            .4
          );

      }


      #manaV81Intro
      .mana-v81-title{

        text-shadow:
          0 4px 20px
          rgba(
            0,
            0,
            0,
            .95
          );

      }


      #manaV81Intro
      .mana-v81-lead{

        color:#ddd;

        text-shadow:
          0 2px 12px
          #000;

      }


      #manaV81Intro
      .mana-v81-card,

      #manaV81Intro
      .mana-v81-quote{

        border-color:
          rgba(
            243,
            216,
            117,
            .20
          );

        background:
          linear-gradient(
            145deg,
            rgba(
              13,
              13,
              13,
              .94
            ),
            rgba(
              5,
              5,
              5,
              .87
            )
          );

        -webkit-backdrop-filter:
          blur(12px);

        backdrop-filter:
          blur(12px);

      }


      /* =====================================
         HOME CURRENT PROGRAM

         FULL YELLOW SELECTED STATE
         ===================================== */

      #manaV80Home
      .mana-v8013-program.current{

        border:
          2px solid
          #ffe58a
          !important;

        background:
          linear-gradient(
            135deg,
            #f6dd74 0%,
            #d2aa36 55%,
            #b88920 100%
          )
          !important;

        color:#0a0a0a
          !important;

        box-shadow:
          0 0 0 3px
          rgba(
            243,
            216,
            117,
            .12
          ),
          0 16px 42px
          rgba(
            212,
            175,
            55,
            .28
          )
          !important;

      }


      #manaV80Home
      .mana-v8013-program.current::before{

        height:5px
          !important;

        background:
          rgba(
            255,
            250,
            220,
            .85
          )
          !important;

      }


      #manaV80Home
      .mana-v8013-program.current
      .mana-v8013-program-label,

      #manaV80Home
      .mana-v8013-program.current
      h2,

      #manaV80Home
      .mana-v8013-program.current
      p,

      #manaV80Home
      .mana-v8013-program.current
      .mana-v8013-open,

      #manaV80Home
      .mana-v8013-program.current
      .mana-v8013-free-note{

        color:#111
          !important;

      }


      #manaV80Home
      .mana-v8013-program.current
      p{

        opacity:.82;

      }


      #manaV80Home
      .mana-v8013-program.current
      .mana-v8013-badge{

        border-color:
          rgba(
            0,
            0,
            0,
            .35
          )
          !important;

        background:
          rgba(
            0,
            0,
            0,
            .78
          )
          !important;

        color:#f7df7e
          !important;

      }


      #manaV80Home
      .mana-v8013-program.current
      .mana-v8013-current-badge{

        border-color:#111
          !important;

        background:#111
          !important;

        color:#f3d875
          !important;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:600px){

        body:has(#authView:not(.hide)){

          background-position:
            58% 10%;

        }


        body:has(#authView:not(.hide))
        > .wrap{

          padding-left:14px;

          padding-right:14px;

        }


        body:has(#authView:not(.hide))
        .brand{

          padding:
            13px 14px;

          margin-bottom:20px;

        }


        body:has(#authView:not(.hide))
        .brand .mark{

          width:54px;

          height:54px;

          flex-basis:54px;

          font-size:34px;

        }


        body:has(#authView:not(.hide))
        .brand h1{

          font-size:17px;

        }


        #manaV81Intro{

          background-position:
            52% top
            !important;

        }


        #manaV80Home
        .mana-v8013-program.current{

          transform:none;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     HOME PROGRAM SELECTION

     v8.0 already saves
     mana-current-program.

     This simply guarantees the visual
     selection is refreshed immediately.
     ========================================= */

  function refreshHomeSelection() {

    let current =
      "strength";


    try {

      current =
        localStorage.getItem(
          "mana-current-program"
        )
        ||
        "strength";

    } catch (_) {}


    document
      .querySelectorAll(
        "#manaV80Home " +
        ".mana-v8013-program"
      )
      .forEach(
        card => {

          card
            .classList
            .toggle(
              "current",
              card.dataset
                .program ===
                current
            );

        }
      );

  }


  function bindHomeSelection() {

    document
      .addEventListener(
        "click",
        event => {

          const card =
            event.target
              .closest(
                "#manaV80Home " +
                ".mana-v8013-program"
              );


          if (!card) {

            return;

          }


          try {

            localStorage.setItem(
              "mana-current-program",
              card.dataset.program
            );

          } catch (_) {}


          refreshHomeSelection();

        },
        true
      );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    bindHomeSelection();

    refreshHomeSelection();


    window.addEventListener(
      "focus",
      refreshHomeSelection
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          refreshHomeSelection();

        }

      }
    );


    window.MANA_VISUAL_IDENTITY_BUILD =
      BUILD;


    console.log(
      "[Mana v9.86.0] visual identity ready"
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
