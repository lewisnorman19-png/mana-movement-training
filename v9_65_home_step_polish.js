/* =========================================
   MANA MOVEMENT TRAINING v9.65.0
   HOME STEP POLISH

   - STEP 1 NO LONGER BRIGHT YELLOW
   - DARK PREMIUM CARD
   - GOLD BORDER + SUBTLE ACCENT
   - STEP 1 SLIGHTLY STRONGER THAN STEP 2
   - CLEANER VISUAL HIERARCHY
   ========================================= */

(() => {
  "use strict";

  const BUILD = "96500";
  const STYLE_ID = "mana-v965-home-step-polish";


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
         STEP 1 — PROFILE & GOALS
         ===================================== */

      #manaV80Home
      #manaV80ProfileSetup{

        position:relative !important;

        overflow:hidden !important;

        border:
          1px solid
          #6f5d24 !important;

        background:
          linear-gradient(
            145deg,
            #18160f 0%,
            #10100c 52%,
            #090909 100%
          ) !important;

        color:
          #ffffff !important;

        box-shadow:
          0
          12px
          34px
          rgba(
            0,
            0,
            0,
            .34
          ),
          inset
          0
          1px
          0
          rgba(
            243,
            216,
            117,
            .05
          ) !important;
      }


      /* GOLD TOP ACCENT */

      #manaV80Home
      #manaV80ProfileSetup::before{

        content:"" !important;

        position:absolute !important;

        top:0 !important;
        left:28px !important;
        right:28px !important;

        height:3px !important;

        background:
          linear-gradient(
            90deg,
            transparent,
            #f3d875,
            transparent
          ) !important;

        opacity:.85 !important;
      }


      /* LARGE BACKGROUND STEP NUMBER */

      #manaV80Home
      #manaV80ProfileSetup::after{

        content:"1" !important;

        position:absolute !important;

        right:22px !important;
        bottom:-25px !important;

        color:
          rgba(
            243,
            216,
            117,
            .055
          ) !important;

        font-size:
          116px !important;

        font-weight:
          950 !important;

        line-height:
          1 !important;

        pointer-events:none !important;
      }


      #manaV80Home
      #manaV80ProfileSetup
      .mana-v8013-profile-label{

        position:relative !important;

        z-index:2 !important;

        color:
          #d8bc5c !important;

        font-size:
          12px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .13em !important;
      }


      #manaV80Home
      #manaV80ProfileSetup h2{

        position:relative !important;

        z-index:2 !important;

        margin:
          8px
          0
          8px !important;

        color:
          #ffffff !important;

        font-size:
          27px !important;

        font-weight:
          900 !important;
      }


      #manaV80Home
      #manaV80ProfileSetup p{

        position:relative !important;

        z-index:2 !important;

        max-width:
          80% !important;

        color:
          #b6b6b6 !important;

        font-size:
          15px !important;

        line-height:
          1.55 !important;
      }


      #manaV80Home
      #manaV80ProfileSetup
      .mana-v8013-profile-open{

        position:relative !important;

        z-index:2 !important;

        margin-top:
          16px !important;

        color:
          #f3d875 !important;

        font-size:
          13px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .04em !important;
      }


      #manaV80Home
      #manaV80ProfileSetup:hover{

        border-color:
          #9b8130 !important;
      }


      #manaV80Home
      #manaV80ProfileSetup:active{

        transform:
          scale(.992) !important;
      }


      /* =====================================
         STEP 2 — PROGRAM SELECTION
         ===================================== */

      #manaV80Home
      .mana-v8013-select{

        margin-top:
          28px !important;

        padding:
          18px
          20px !important;

        border:
          1px solid
          #51461f !important;

        border-radius:
          19px !important;

        background:
          linear-gradient(
            145deg,
            #12110c,
            #090909
          ) !important;

        box-shadow:
          none !important;
      }


      #manaV80Home
      .mana-v8013-select strong{

        color:
          #e0c45e !important;

        font-size:
          17px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .09em !important;
      }


      #manaV80Home
      .mana-v8013-select span{

        margin-top:
          8px !important;

        color:
          #989898 !important;

        font-size:
          14px !important;

        line-height:
          1.45 !important;
      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(
        max-width:600px
      ){

        #manaV80Home
        #manaV80ProfileSetup{

          padding:
            20px
            20px !important;
        }


        #manaV80Home
        #manaV80ProfileSetup h2{

          font-size:
            25px !important;
        }


        #manaV80Home
        #manaV80ProfileSetup p{

          max-width:
            88% !important;

          font-size:
            14px !important;
        }


        #manaV80Home
        #manaV80ProfileSetup::after{

          font-size:
            92px !important;

          right:
            13px !important;
        }


        #manaV80Home
        .mana-v8013-select strong{

          font-size:
            16px !important;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  function init() {

    installStyles();

    window.MANA_HOME_STEP_POLISH_BUILD =
      BUILD;


    console.log(
      "[Mana v9.65.0] Home step polish ready"
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
