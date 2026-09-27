/* =========================================
   MANA MOVEMENT TRAINING v9.44.0
   FUEL MEAL TAP ARROWS

   - Always shows tap arrow on meal cards
   - Works on phone + desktop
   - Does not affect Fuel data or behaviour
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID =
    "mana-v944-fuel-arrows-style";


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

      /*
        Hide the older injected arrow
        so we never get duplicates.
      */

      #manaV83Content
      .mana-v943-meal-arrow{
        display:none !important;
      }


      /*
        Permanent arrow built directly
        into every Fuel meal button.
      */

      #manaV83Content
      .mana-v897-meal{
        position:relative;

        padding-right:
          42px !important;
      }


      #manaV83Content
      .mana-v897-meal::after{
        content:"›";

        position:absolute;

        top:50%;
        right:15px;

        transform:
          translateY(-50%);

        color:#f3d875;

        font-size:24px;

        font-weight:900;

        line-height:1;

        pointer-events:none;
      }


      /*
        Phone
      */

      @media(
        max-width:600px
      ){

        #manaV83Content
        .mana-v897-meal{
          padding-right:
            38px !important;
        }


        #manaV83Content
        .mana-v897-meal::after{
          right:13px;

          font-size:22px;
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


  window.MANA_FUEL_ARROW_BUILD =
    "94400";


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
