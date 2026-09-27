/* =========================================
   MANA MOVEMENT TRAINING v9.42.1
   HOME PROGRAM SPACING POLISH

   - Clear separation between MANA 28,
     MANA STRENGTH and MANA LIFE
   - More breathing room around badges
   - Strength active highlight moved lower
   - Stronger mobile spacing
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID =
    "mana-v942-home-spacing-style";


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
         ALL HOME PROGRAM CARDS
         ===================================== */

      #manaV80Home
      .mana-v8013-program{
        margin:
          26px
          0 !important;

        padding-top:
          34px !important;

        overflow:hidden;
      }


      /* =====================================
         INDIVIDUAL CARD SPACING
         ===================================== */

      #manaV80Home
      #manaV80Mana28{
        margin-top:
          24px !important;

        margin-bottom:
          30px !important;
      }


      #manaV80Home
      #manaV80Strength{
        margin-top:
          30px !important;

        margin-bottom:
          30px !important;
      }


      #manaV80Home
      #manaV80Life{
        margin-top:
          30px !important;

        margin-bottom:
          24px !important;
      }


      /* =====================================
         TOP-RIGHT PROGRAM BADGES
         ===================================== */

      #manaV80Home
      .mana-v8013-badge{
        top:
          22px !important;

        right:
          20px !important;
      }


      /* =====================================
         PROGRAM LABEL
         ===================================== */

      #manaV80Home
      .mana-v8013-program-label{
        padding-top:
          8px;
      }


      /* =====================================
         ACTIVE PROGRAM BADGE
         ===================================== */

      #manaV80Home
      .mana-v8013-current-badge{
        margin-top:
          24px !important;

        margin-bottom:
          4px;
      }


      /* =====================================
         STRENGTH GOLD HIGHLIGHT
         ===================================== */

      #manaV80Home
      #manaV80Strength.current::before{
        top:
          10px !important;

        left:
          20px !important;

        right:
          20px !important;

        height:
          4px !important;

        border-radius:
          999px !important;
      }


      #manaV80Home
      #manaV80Strength.current{
        padding-top:
          42px !important;
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(
        max-width:600px
      ){

        #manaV80Home
        .mana-v8013-program{
          margin:
            24px
            0 !important;

          padding-top:
            32px !important;
        }


        #manaV80Home
        #manaV80Mana28{
          margin-top:
            22px !important;

          margin-bottom:
            32px !important;
        }


        #manaV80Home
        #manaV80Strength{
          margin-top:
            32px !important;

          margin-bottom:
            32px !important;
        }


        #manaV80Home
        #manaV80Life{
          margin-top:
            32px !important;
        }


        #manaV80Home
        .mana-v8013-badge{
          top:
            20px !important;

          right:
            16px !important;
        }


        #manaV80Home
        .mana-v8013-program-label{
          padding-top:
            10px;
        }


        #manaV80Home
        .mana-v8013-current-badge{
          margin-top:
            24px !important;
        }


        #manaV80Home
        #manaV80Strength.current{
          padding-top:
            42px !important;
        }


        #manaV80Home
        #manaV80Strength.current::before{
          top:
            11px !important;

          left:
            18px !important;

          right:
            18px !important;

          height:
            4px !important;
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


  window.MANA_HOME_SPACING_BUILD =
    "94210";


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
