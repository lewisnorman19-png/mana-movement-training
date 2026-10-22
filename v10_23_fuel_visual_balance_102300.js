/* =========================================
   MANA MOVEMENT TRAINING v10.23.1
   FUEL — FINAL VISUAL BALANCE

   BUILD: 102310

   PURPOSE
   -----------------------------------------
   - Fix meal artwork proportions
   - Show full meal image
   - Replace ADD pill with small +
   - Reduce Add Your Own dominance
   - Restore larger Daily Targets
   - Laptop + phone specific sizing
   - CSS ONLY
   - NO observers
   - NO render loops
   - NO performance hit
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v10231-fuel-visual-balance";


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
         MEAL OPTION CARDS — LAPTOP
         ===================================== */

      #manaV1015Fuel
      .m1022-options{

        gap:
          9px !important;

      }


      #manaV1015Fuel
      .m1022-option{

        display:
          grid !important;

        grid-template-columns:
          108px
          minmax(0,1fr)
          34px
          !important;

        align-items:
          center !important;

        gap:
          10px !important;

        min-height:
          76px !important;

        padding:
          8px !important;

        overflow:
          hidden !important;

      }


      /* =====================================
         MEAL ARTWORK — LAPTOP

         Wide box matches the actual
         illustration aspect ratio.
         ===================================== */

      #manaV1015Fuel
      .m1022-option-art{

        display:
          flex !important;

        align-items:
          center !important;

        justify-content:
          center !important;

        width:
          108px !important;

        height:
          52px !important;

        min-width:
          108px !important;

        overflow:
          hidden !important;

        border-radius:
          9px !important;

        background:
          #070707 !important;

      }


      #manaV1015Fuel
      .m1022-option-art img{

        display:
          block !important;

        width:
          100% !important;

        height:
          100% !important;

        max-width:
          100% !important;

        max-height:
          100% !important;

        object-fit:
          contain !important;

        object-position:
          center !important;

      }


      /* =====================================
         MEAL TEXT
         ===================================== */

      #manaV1015Fuel
      .m1022-option-copy{

        min-width:
          0 !important;

      }


      #manaV1015Fuel
      .m1022-option h4{

        margin:
          0 !important;

        font-size:
          14px !important;

        line-height:
          1.2 !important;

      }


      #manaV1015Fuel
      .m1022-option p{

        margin:
          3px
          0
          5px
          !important;

        font-size:
          9px !important;

        line-height:
          1.3 !important;

      }


      #manaV1015Fuel
      .m1022-option-macros{

        font-size:
          9px !important;

        line-height:
          1.2 !important;

      }


      /* =====================================
         MEAL ADD BUTTON

         Hide ADD text visually and replace
         it with a simple round +
         ===================================== */

      #manaV1015Fuel
      .m1022-option
      > .m1022-add{

        display:
          grid !important;

        place-items:
          center !important;

        width:
          32px !important;

        min-width:
          32px !important;

        height:
          32px !important;

        min-height:
          32px !important;

        padding:
          0 !important;

        overflow:
          hidden !important;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .65
          ) !important;

        border-radius:
          50% !important;

        background:
          #18150d !important;

        color:
          transparent !important;

        font-size:
          0 !important;

      }


      #manaV1015Fuel
      .m1022-option
      > .m1022-add::after{

        content:
          "+" !important;

        display:
          block !important;

        color:
          #f3d875 !important;

        font-size:
          22px !important;

        font-weight:
          400 !important;

        line-height:
          1 !important;

      }


      /* =====================================
         ADD YOUR OWN

         Keep it available but visually
         secondary to suggested meals.
         ===================================== */

      #manaV1015Fuel
      .m1022-custom{

        margin-top:
          8px !important;

        padding-top:
          9px !important;

        border-top:
          1px solid
          #252525 !important;

      }


      #manaV1015Fuel
      .m1022-custom h4{

        margin:
          0
          0
          6px
          !important;

        color:
          #aaa !important;

        font-size:
          11px !important;

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
          32px !important;

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

        display:
          block !important;

        width:
          auto !important;

        min-width:
          104px !important;

        min-height:
          30px !important;

        margin:
          7px
          0
          0
          auto
          !important;

        padding:
          0
          12px
          !important;

        border:
          1px solid
          #55471f !important;

        background:
          #18150d !important;

        color:
          #f3d875 !important;

        font-size:
          8px !important;

      }


      /* =====================================
         TODAY'S MEALS
         ===================================== */

      #manaV1015Fuel
      .m1022-logged{

        grid-template-columns:
          96px
          minmax(0,1fr)
          30px
          !important;

        align-items:
          center !important;

        gap:
          10px !important;

        min-height:
          72px !important;

        padding:
          8px !important;

        overflow:
          hidden !important;

      }


      #manaV1015Fuel
      .m1022-logged-art{

        display:
          flex !important;

        align-items:
          center !important;

        justify-content:
          center !important;

        width:
          96px !important;

        height:
          46px !important;

        overflow:
          hidden !important;

        border-radius:
          9px !important;

        background:
          #070707 !important;

      }


      #manaV1015Fuel
      .m1022-logged-art img{

        width:
          100% !important;

        height:
          100% !important;

        max-width:
          100% !important;

        max-height:
          100% !important;

        object-fit:
          contain !important;

        object-position:
          center !important;

      }


      #manaV1015Fuel
      .m1022-logged h4{

        font-size:
          14px !important;

      }


      #manaV1015Fuel
      .m1022-logged p{

        margin:
          3px
          0
          5px
          !important;

        font-size:
          9px !important;

      }


      #manaV1015Fuel
      .m1022-macro{

        font-size:
          9px !important;

      }


      /* =====================================
         DAILY TARGETS — RESTORE SIZE
         ===================================== */

      #manaV1015Fuel
      .m1022-target-grid{

        gap:
          11px !important;

      }


      #manaV1015Fuel
      .m1022-target{

        min-height:
          116px !important;

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
         PHONE
         ===================================== */

      @media(max-width:600px){


        /*
          Suggested meals remain easy to
          read but no oversized artwork.
        */

        #manaV1015Fuel
        .m1022-option{

          grid-template-columns:
            84px
            minmax(0,1fr)
            30px
            !important;

          gap:
            8px !important;

          min-height:
            66px !important;

          padding:
            7px !important;

        }


        #manaV1015Fuel
        .m1022-option-art{

          width:
            84px !important;

          min-width:
            84px !important;

          height:
            40px !important;

        }


        #manaV1015Fuel
        .m1022-option h4{

          font-size:
            13px !important;

        }


        #manaV1015Fuel
        .m1022-option p{

          margin:
            2px
            0
            4px
            !important;

          font-size:
            8px !important;

        }


        #manaV1015Fuel
        .m1022-option-macros{

          font-size:
            8px !important;

        }


        #manaV1015Fuel
        .m1022-option
        > .m1022-add{

          width:
            29px !important;

          min-width:
            29px !important;

          height:
            29px !important;

          min-height:
            29px !important;

        }


        #manaV1015Fuel
        .m1022-option
        > .m1022-add::after{

          font-size:
            20px !important;

        }


        /*
          Today's Meals
        */

        #manaV1015Fuel
        .m1022-logged{

          grid-template-columns:
            74px
            minmax(0,1fr)
            28px
            !important;

          gap:
            8px !important;

          min-height:
            62px !important;

          padding:
            7px !important;

        }


        #manaV1015Fuel
        .m1022-logged-art{

          width:
            74px !important;

          height:
            35px !important;

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


        /*
          Add Your Own
        */

        #manaV1015Fuel
        .m1022-custom{

          margin-top:
            7px !important;

          padding-top:
            7px !important;

        }


        #manaV1015Fuel
        .m1022-custom h4{

          font-size:
            10px !important;

        }


        #manaV1015Fuel
        .m1022-custom-grid input{

          min-height:
            30px !important;

          padding:
            6px
            8px
            !important;

          font-size:
            8px !important;

        }


        /*
          Daily Targets
        */

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
        .m1022-target-icon{

          width:
            40px !important;

          height:
            40px !important;

          flex:
            0
            0
            40px
            !important;

        }


        #manaV1015Fuel
        .m1022-target-icon svg{

          width:
            27px !important;

          height:
            27px !important;

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
            28px
            !important;

          gap:
            7px !important;

        }


        #manaV1015Fuel
        .m1022-option-art{

          width:
            76px !important;

          min-width:
            76px !important;

          height:
            36px !important;

        }


        #manaV1015Fuel
        .m1022-logged{

          grid-template-columns:
            68px
            minmax(0,1fr)
            27px
            !important;

        }


        #manaV1015Fuel
        .m1022-logged-art{

          width:
            68px !important;

          height:
            32px !important;

        }


        #manaV1015Fuel
        .m1022-target{

          min-height:
            104px !important;

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
      "102310"
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
