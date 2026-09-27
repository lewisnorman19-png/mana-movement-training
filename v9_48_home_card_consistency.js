/* =========================================
   MANA MOVEMENT TRAINING v9.48.0
   HOME CARD CONSISTENCY

   - Removes Strength yellow top bar
   - Uses clean gold outline instead
   - Matches "Choose your level" featured card
   - Keeps all three Home cards consistent
   - No navigation or app logic changes
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID =
    "mana-v948-home-card-consistency";

  const BUILD =
    "94800";


  function injectStyles() {

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
         ALL PROGRAM CARDS
         ===================================== */

      #manaV80Home
      .mana-v8013-program{
        border:
          1px solid
          #323232 !important;

        background:
          linear-gradient(
            145deg,
            #121212,
            #080808
          ) !important;

        box-shadow:
          none !important;
      }


      /* =====================================
         ACTIVE / SELECTED PROGRAM
         Match Choose Your Level featured card
         ===================================== */

      #manaV80Home
      .mana-v8013-program.current{
        border:
          2px solid
          #d4af37 !important;

        background:
          linear-gradient(
            145deg,
            #221c08,
            #090909 55%
          ) !important;

        box-shadow:
          none !important;
      }


      /* =====================================
         REMOVE YELLOW TOP BAR COMPLETELY
         ===================================== */

      #manaV80Home
      .mana-v8013-program.current::before,
      #manaV80Home
      #manaV80Strength.current::before{
        content:none !important;

        display:none !important;
      }


      /* =====================================
         REMOVE EXTRA STRENGTH TOP PADDING
         FROM THE OLD BAR DESIGN
         ===================================== */

      #manaV80Home
      #manaV80Strength.current{
        padding-top:
          34px !important;
      }


      /* =====================================
         CONSISTENT TOP BADGES
         FREE / MEMBERSHIP / LIVE
         ===================================== */

      #manaV80Home
      .mana-v8013-badge{
        top:
          18px !important;

        right:
          18px !important;

        padding:
          7px
          11px !important;

        border:
          1px solid
          #67551d !important;

        border-radius:
          999px !important;

        background:
          #191607 !important;

        color:
          #f3d875 !important;

        font-size:
          9px !important;

        font-weight:
          900 !important;

        letter-spacing:
          .07em !important;
      }


      /* =====================================
         ACTIVE PROGRAM BADGE
         ===================================== */

      #manaV80Home
      .mana-v8013-current-badge{
        margin-top:
          20px !important;

        padding:
          8px
          12px !important;

        border:
          1px solid
          #67551d !important;

        border-radius:
          999px !important;

        background:
          #191607 !important;

        color:
          #f3d875 !important;

        font-size:
          9px !important;

        font-weight:
          900 !important;
      }


      /* =====================================
         ACTIVE TITLES / LABELS
         KEEP CLEAN, NOT OVER-GOLD
         ===================================== */

      #manaV80Home
      .mana-v8013-program.current
      .mana-v8013-program-label{
        color:
          #f3d875 !important;
      }


      #manaV80Home
      .mana-v8013-program.current
      h2{
        color:
          #ffffff !important;
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(
        max-width:600px
      ){

        #manaV80Home
        .mana-v8013-program{
          border-width:
            1px !important;
        }


        #manaV80Home
        .mana-v8013-program.current{
          border-width:
            2px !important;
        }


        #manaV80Home
        #manaV80Strength.current{
          padding-top:
            32px !important;
        }


        #manaV80Home
        .mana-v8013-badge{
          top:
            16px !important;

          right:
            15px !important;
        }


        #manaV80Home
        .mana-v8013-current-badge{
          margin-top:
            18px !important;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  function init() {
    injectStyles();
  }


  window.MANA_HOME_CARD_BUILD =
    BUILD;


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
