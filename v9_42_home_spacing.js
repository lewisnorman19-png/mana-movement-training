/* =========================================
   MANA MOVEMENT TRAINING v9.42.0
   HOME PROGRAM SPACING POLISH

   - More breathing room between program cards
   - Cleaner badge positioning
   - Mana Strength active highlight lowered
   - Mobile-first polish
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
         PROGRAM CARD SPACING
         ===================================== */

      #manaV80Home
      .mana-v8013-program{
        margin:
          18px
          0;

        overflow:hidden;
      }


      /*
        Give the first program a little
        separation from the heading above.
      */

      #manaV80Home
      #manaV80Mana28{
        margin-top:20px;
      }


      /*
        Give Strength slightly more room
        around the active treatment.
      */

      #manaV80Home
      #manaV80Strength{
        margin-top:22px;
        margin-bottom:22px;
      }


      /*
        Mana Life now stands as a full
        program so give it the same space.
      */

      #manaV80Home
      #manaV80Life{
        margin-top:22px;
      }


      /* =====================================
         TOP-RIGHT BADGES
         ===================================== */

      #manaV80Home
      .mana-v8013-badge{
        top:20px;
        right:20px;
      }


      /* =====================================
         ACTIVE PROGRAM BADGE
         ===================================== */

      #manaV80Home
      .mana-v8013-current-badge{
        margin-top:20px;
      }


      /* =====================================
         MANA STRENGTH ACTIVE HIGHLIGHT
         ===================================== */

      #manaV80Home
      #manaV80Strength.current::before{
        top:6px;

        left:18px;
        right:18px;

        height:4px;

        border-radius:999px;
      }


      /*
        Slightly more room above the
        Strength content when it is active.
      */

      #manaV80Home
      #manaV80Strength.current{
        padding-top:30px;
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
            16px
            0;
        }


        #manaV80Home
        #manaV80Mana28{
          margin-top:18px;
          margin-bottom:20px;
        }


        #manaV80Home
        #manaV80Strength{
          margin-top:20px;
          margin-bottom:20px;
        }


        #manaV80Home
        #manaV80Life{
          margin-top:20px;
        }


        #manaV80Home
        .mana-v8013-badge{
          top:17px;
          right:15px;
        }


        #manaV80Home
        .mana-v8013-current-badge{
          margin-top:18px;
        }


        #manaV80Home
        #manaV80Strength.current{
          padding-top:28px;
        }


        #manaV80Home
        #manaV80Strength.current::before{
          top:6px;

          left:15px;
          right:15px;

          height:3px;
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
    "94200";


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
