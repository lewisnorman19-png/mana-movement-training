/* =========================================
   MANA MOVEMENT TRAINING v10.23
   FUEL — VISUAL BALANCE

   BUILD: 102300

   PURPOSE
   -----------------------------------------
   - Restore meal choice prominence
   - Make meal illustrations larger
   - Reduce Add Your Own dominance
   - Increase Daily Target card size
   - Increase target text readability
   - Strength + Mana 28
   - CSS ONLY
   - NO observers
   - NO loops
   - NO event listeners
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v1023-fuel-visual-balance";


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
         MEAL CHOICES — DESKTOP
         ===================================== */

      #manaV1015Fuel
      .m1022-options{

        gap:
          10px !important;

      }


      #manaV1015Fuel
      .m1022-option{

        grid-template-columns:
          96px
          minmax(0,1fr)
          58px
          !important;

        gap:
          12px !important;

        align-items:
          center !important;

        min-height:
          94px !important;

        padding:
          8px !important;

        border-radius:
          15px !important;

      }


      #manaV1015Fuel
      .m1022-option-art{

        width:
          96px !important;

        height:
          74px !important;

        border-radius:
          11px !important;

      }


      #manaV1015Fuel
      .m1022-option-art img{

        width:
          100% !important;

        height:
          100% !important;

        object-fit:
          cover !important;

        object-position:
          center !important;

      }


      #manaV1015Fuel
      .m1022-option h4{

        font-size:
          14px !important;

        line-height:
          1.2 !important;

      }


      #manaV1015Fuel
      .m1022-option p{

        margin:
          4px
          0
          6px
          !important;

        font-size:
          9px !important;

        line-height:
          1.35 !important;

      }


      #manaV1015Fuel
      .m1022-option-macros{

        font-size:
          10px !important;

        line-height:
          1.25 !important;

      }


      #manaV1015Fuel
      .m1022-option
      > .m1022-add{

        width:
          56px !important;

        min-width:
          56px !important;

        height:
          36px !important;

        min-height:
          36px !important;

        padding:
          0 !important;

        font-size:
          9px !important;

      }


      /* =====================================
         ADD YOUR OWN

         Deliberately quieter than the
         suggested meal choices.
         ===================================== */

      #manaV1015Fuel
      .m1022-custom{

        margin-top:
          8px !important;

        padding-top:
          9px !important;

        border-top:
          1px solid
          #222 !important;

      }


      #manaV1015Fuel
      .m1022-custom h4{

        margin:
          0
          0
          6px
          !important;

        color:
          #b8b8b8 !important;

        font-size:
          12px !important;

        font-weight:
          800 !important;

      }


      #manaV1015Fuel
      .m1022-custom-grid{

        gap:
          6px !important;

      }


      #manaV1015Fuel
      .m1022-custom-grid input{

        min-height:
          34px !important;

        padding:
          7px
          9px
          !important;

        border-radius:
          8px !important;

        font-size:
          9px !important;

      }


      #manaV1015Fuel
      .m1022-custom
      > .m1022-add{

        width:
          auto !important;

        min-width:
          112px !important;

        min-height:
          32px !important;

        margin:
          7px
          0
          0
          auto
          !important;

        padding:
          0
          13px
          !important;

        display:
          block !important;

        background:
          #272216 !important;

        border:
          1px solid
          #5d4c20 !important;

        color:
          #f3d875 !important;

        font-size:
          8px !important;

      }


      /* =====================================
         DAILY TARGETS — DESKTOP
         ===================================== */

      #manaV1015Fuel
      .m1022-target-grid{

        gap:
          11px !important;

      }


      #manaV1015Fuel
      .m1022-target{

        min-height:
          112px !important;

        padding:
          15px !important;

        border-radius:
          16px !important;

      }


      #manaV1015Fuel
      .m1022-target-top{

        gap:
          11px !important;

      }


      #manaV1015Fuel
      .m1022-target-icon{

        width:
          44px !important;

        height:
          44px !important;

        flex:
          0
          0
          44px
          !important;

        border-radius:
          12px !important;

      }


      #manaV1015Fuel
      .m1022-target-icon svg{

        width:
          29px !important;

        height:
          29px !important;

      }


      #manaV1015Fuel
      .m1022-target-label{

        color:
          #aaa !important;

        font-size:
          10px !important;

        font-weight:
          900 !important;

        letter-spacing:
          .04em !important;

      }


      #manaV1015Fuel
      .m1022-target-value{

        margin-top:
          3px !important;

        font-size:
          19px !important;

        line-height:
          1.15 !important;

      }


      #manaV1015Fuel
      .m1022-target-value span{

        font-size:
          10px !important;

      }


      #manaV1015Fuel
      .m1022-bar{

        height:
          8px !important;

        margin-top:
          12px !important;

      }


      #manaV1015Fuel
      .m1022-control-row{

        gap:
          6px !important;

        margin-top:
          10px !important;

      }


      #manaV1015Fuel
      .m1022-control-row button{

        min-height:
          32px !important;

        font-size:
          9px !important;

      }


      /* =====================================
         TODAY'S MEALS

         Keep compact but not tiny.
         ===================================== */

      #manaV1015Fuel
      .m1022-logged{

        grid-template-columns:
          84px
          minmax(0,1fr)
          32px
          !important;

        min-height:
          86px !important;

      }


      #manaV1015Fuel
      .m1022-logged-art{

        width:
          84px !important;

        height:
          64px !important;

      }


      #manaV1015Fuel
      .m1022-logged h4{

        font-size:
          14px !important;

      }


      #manaV1015Fuel
      .m1022-logged p{

        font-size:
          9px !important;

      }


      #manaV1015Fuel
      .m1022-macro{

        font-size:
          9px !important;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:600px){

        /*
          Meal options become the main
          visual focus again.
        */

        #manaV1015Fuel
        .m1022-option{

          grid-template-columns:
            82px
            minmax(0,1fr)
            50px
            !important;

          gap:
            8px !important;

          min-height:
            82px !important;

          padding:
            7px !important;

        }


        #manaV1015Fuel
        .m1022-option-art{

          width:
            82px !important;

          height:
            64px !important;

        }


        #manaV1015Fuel
        .m1022-option h4{

          font-size:
            13px !important;

        }


        #manaV1015Fuel
        .m1022-option p{

          font-size:
            8px !important;

        }


        #manaV1015Fuel
        .m1022-option-macros{

          font-size:
            9px !important;

        }


        #manaV1015Fuel
        .m1022-option
        > .m1022-add{

          width:
            48px !important;

          min-width:
            48px !important;

          height:
            34px !important;

          min-height:
            34px !important;

          font-size:
            8px !important;

        }


        /* ADD YOUR OWN */

        #manaV1015Fuel
        .m1022-custom{

          margin-top:
            7px !important;

          padding-top:
            8px !important;

        }


        #manaV1015Fuel
        .m1022-custom h4{

          margin-bottom:
            5px !important;

          font-size:
            11px !important;

        }


        #manaV1015Fuel
        .m1022-custom-grid input{

          min-height:
            32px !important;

          padding:
            6px
            8px
            !important;

          font-size:
            8px !important;

        }


        #manaV1015Fuel
        .m1022-custom
        > .m1022-add{

          min-height:
            30px !important;

          min-width:
            104px !important;

          font-size:
            8px !important;

        }


        /* TODAY'S MEALS */

        #manaV1015Fuel
        .m1022-logged{

          grid-template-columns:
            72px
            minmax(0,1fr)
            30px
            !important;

          min-height:
            76px !important;

          gap:
            8px !important;

        }


        #manaV1015Fuel
        .m1022-logged-art{

          width:
            72px !important;

          height:
            55px !important;

        }


        #manaV1015Fuel
        .m1022-logged h4{

          font-size:
            13px !important;

        }


        #manaV1015Fuel
        .m1022-logged p{

          font-size:
            8px !important;

        }


        #manaV1015Fuel
        .m1022-macro{

          font-size:
            8px !important;

        }


        /* DAILY TARGETS */

        #manaV1015Fuel
        .m1022-target-grid{

          gap:
            9px !important;

        }


        #manaV1015Fuel
        .m1022-target{

          min-height:
            108px !important;

          padding:
            12px !important;

        }


        #manaV1015Fuel
        .m1022-target-top{

          gap:
            9px !important;

        }


        #manaV1015Fuel
        .m1022-target-icon{

          width:
            39px !important;

          height:
            39px !important;

          flex:
            0
            0
            39px
            !important;

        }


        #manaV1015Fuel
        .m1022-target-icon svg{

          width:
            26px !important;

          height:
            26px !important;

        }


        #manaV1015Fuel
        .m1022-target-label{

          font-size:
            9px !important;

        }


        #manaV1015Fuel
        .m1022-target-value{

          font-size:
            17px !important;

        }


        #manaV1015Fuel
        .m1022-target-value span{

          font-size:
            9px !important;

        }


        #manaV1015Fuel
        .m1022-bar{

          height:
            7px !important;

          margin-top:
            10px !important;

        }


        #manaV1015Fuel
        .m1022-control-row button{

          min-height:
            31px !important;

          font-size:
            9px !important;

        }

      }


      /* =====================================
         SMALL PHONE
         ===================================== */

      @media(max-width:390px){

        #manaV1015Fuel
        .m1022-option{

          grid-template-columns:
            76px
            minmax(0,1fr)
            46px
            !important;

          gap:
            7px !important;

        }


        #manaV1015Fuel
        .m1022-option-art{

          width:
            76px !important;

          height:
            59px !important;

        }


        #manaV1015Fuel
        .m1022-logged{

          grid-template-columns:
            66px
            minmax(0,1fr)
            28px
            !important;

        }


        #manaV1015Fuel
        .m1022-logged-art{

          width:
            66px !important;

          height:
            51px !important;

        }


        #manaV1015Fuel
        .m1022-target{

          min-height:
            102px !important;

          padding:
            10px !important;

        }


        #manaV1015Fuel
        .m1022-target-value{

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


    console.log(
      "Mana Fuel Visual Balance",
      "102300"
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
