/* =========================================
   MANA MOVEMENT TRAINING v9.49.0
   HOME BADGE + CARD CONSISTENCY

   - FREE / MEMBERSHIP / LIVE same size
   - Stronger inactive card borders
   - Keeps Mana Strength gold active outline
   - Home visuals only
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID =
    "mana-v949-home-badge-consistency";

  const BUILD =
    "94900";


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
         SAME SIZE TOP BADGES
         ===================================== */

      #manaV80Home
      .mana-v8013-badge{
        width:
          104px !important;

        height:
          31px !important;

        padding:
          0
          10px !important;

        display:flex !important;

        align-items:center !important;

        justify-content:center !important;

        text-align:center !important;

        white-space:nowrap !important;

        line-height:1 !important;
      }


      /* =====================================
         INACTIVE PROGRAM CARDS
         DARKER / CLEARER BORDER
         ===================================== */

      #manaV80Home
      #manaV80Mana28:not(.current),
      #manaV80Home
      #manaV80Life:not(.current){
        border:
          1px solid
          #4a4a4a !important;

        background:
          linear-gradient(
            145deg,
            #131313,
            #080808
          ) !important;
      }


      /* =====================================
         STRENGTH WHEN NOT ACTIVE
         KEEP SAME FAMILY
         ===================================== */

      #manaV80Home
      #manaV80Strength:not(.current){
        border:
          1px solid
          #4a4a4a !important;
      }


      /* =====================================
         ACTIVE PROGRAM
         ===================================== */

      #manaV80Home
      .mana-v8013-program.current{
        border:
          2px solid
          #d4af37 !important;
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(
        max-width:600px
      ){

        #manaV80Home
        .mana-v8013-badge{
          width:
            100px !important;

          height:
            29px !important;

          padding:
            0
            8px !important;

          font-size:
            8.5px !important;
        }


        #manaV80Home
        #manaV80Mana28:not(.current),
        #manaV80Home
        #manaV80Life:not(.current),
        #manaV80Home
        #manaV80Strength:not(.current){
          border-color:
            #4d4d4d !important;
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


  window.MANA_HOME_BADGE_BUILD =
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
