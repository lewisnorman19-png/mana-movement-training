/* =========================================
   MANA MOVEMENT TRAINING v10.21
   FUEL — TODAY'S MEALS IMAGE FIT

   BUILD: 102100

   PURPOSE
   -----------------------------------------
   - Keep Today's Meals artwork fully
     contained inside each card
   - Fix laptop + phone sizing
   - No Fuel logic changes
   - Mana Strength + Mana 28
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v1021-today-meals-fit";


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
         TODAY'S MEALS — DESKTOP
         ===================================== */

      #manaV1015Fuel
      .m1015-logged{

        display:
          grid !important;

        grid-template-columns:
          82px
          minmax(0,1fr)
          34px
          !important;

        align-items:
          center !important;

        gap:
          10px !important;

        min-height:
          84px !important;

        padding:
          8px !important;

        overflow:
          hidden !important;

      }


      #manaV1015Fuel
      .m1015-logged
      > img{

        display:
          block !important;

        width:
          82px !important;

        height:
          62px !important;

        max-width:
          82px !important;

        max-height:
          62px !important;

        min-width:
          0 !important;

        min-height:
          0 !important;

        object-fit:
          cover !important;

        object-position:
          center !important;

        border-radius:
          10px !important;

        align-self:
          center !important;

        justify-self:
          start !important;

      }


      #manaV1015Fuel
      .m1015-logged-meta{

        min-width:
          0 !important;

        overflow:
          hidden !important;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:600px){

        #manaV1015Fuel
        .m1015-logged{

          grid-template-columns:
            68px
            minmax(0,1fr)
            30px
            !important;

          gap:
            8px !important;

          min-height:
            72px !important;

          padding:
            7px !important;

        }


        #manaV1015Fuel
        .m1015-logged
        > img{

          width:
            68px !important;

          height:
            52px !important;

          max-width:
            68px !important;

          max-height:
            52px !important;

        }

      }


      /* =====================================
         SMALL PHONE
         ===================================== */

      @media(max-width:390px){

        #manaV1015Fuel
        .m1015-logged{

          grid-template-columns:
            62px
            minmax(0,1fr)
            28px
            !important;

          gap:
            7px !important;

        }


        #manaV1015Fuel
        .m1015-logged
        > img{

          width:
            62px !important;

          height:
            48px !important;

          max-width:
            62px !important;

          max-height:
            48px !important;

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


    console.log(
      "Mana Fuel Today's Meals Fit 102100"
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
