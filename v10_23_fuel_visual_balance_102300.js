/* =========================================
   MANA MOVEMENT TRAINING v10.23.3
   FUEL — CLEAN CARD BALANCE

   BUILD: 102330

   PURPOSE
   -----------------------------------------
   - Full-width meal rows
   - Food illustrations fit correctly
   - Small + instead of ADD
   - Add Your Own becomes secondary
   - Larger Daily Targets
   - Phone-first responsive layout
   - No observers
   - No render loops
   - No Fuel logic changes
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v10233-fuel-card-balance";


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
         MEAL MODAL
         ===================================== */

      #manaV1015Fuel
      .m1022-modal{

        width:
          min(
            660px,
            calc(100vw - 24px)
          ) !important;

      }


      #manaV1015Fuel
      .m1022-options{

        display:
          grid !important;

        grid-template-columns:
          1fr !important;

        gap:
          9px !important;

        width:
          100% !important;

      }


      /* =====================================
         MEAL ROW
         ===================================== */

      #manaV1015Fuel
      .m1022-option{

        display:
          grid !important;

        grid-template-columns:
          128px
          minmax(0,1fr)
          34px
          !important;

        align-items:
          center !important;

        width:
          100% !important;

        min-height:
          82px !important;

        gap:
          12px !important;

        padding:
          8px !important;

        overflow:
          hidden !important;

        border:
          1px solid
          #302d26 !important;

        border-radius:
          15px !important;

        background:
          #10100f !important;

      }


      /* =====================================
         MEAL ILLUSTRATION
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
          128px !important;

        height:
          64px !important;

        min-width:
          128px !important;

        overflow:
          hidden !important;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .18
          ) !important;

        border-radius:
          11px !important;

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

        padding:
          0 !important;

      }


      /* =====================================
         MEAL COPY
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

        color:
          #fff !important;

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

        color:
          #929292 !important;

        font-size:
          9px !important;

        line-height:
          1.35 !important;

      }


      #manaV1015Fuel
      .m1022-option-macros{

        color:
          #f3d875 !important;

        font-size:
          10px !important;

        font-weight:
          900 !important;

        line-height:
          1.2 !important;

      }


      /* =====================================
         REPLACE ADD WITH +
         ===================================== */

      #manaV1015Fuel
      .m1022-option
      > .m1022-add{

        position:
          relative !important;

        display:
          grid !important;

        place-items:
          center !important;

        width:
          32px !important;

        min-width:
          32px !important;

        max-width:
          32px !important;

        height:
          32px !important;

        min-height:
          32px !important;

        max-height:
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
            .72
          ) !important;

        border-radius:
          50% !important;

        background:
          #18150d !important;

        color:
          transparent !important;

        font-size:
          0 !important;

        line-height:
          0 !important;

      }


      #manaV1015Fuel
      .m1022-option
      > .m1022-add::before{

        content:
          "+" !important;

        position:
          absolute !important;

        inset:
          0 !important;

        display:
          grid !important;

        place-items:
          center !important;

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
         ===================================== */

      #manaV1015Fuel
      .m1022-custom{

        margin-top:
          8px !important;

        padding-top:
          8px !important;

        border-top:
          1px solid
          #242424 !important;

      }


      #manaV1015Fuel
      .m1022-custom h4{

        margin:
          0
          0
          6px
          !important;

        color:
          #9b9b9b !important;

        font-size:
          11px !important;

        font-weight:
          800 !important;

      }


      #manaV1015Fuel
      .m1022-custom-grid{

        display:
          grid !important;

        grid-template-columns:
          minmax(0,2fr)
          minmax(80px,1fr)
          minmax(80px,1fr)
          !important;

        gap:
          6px !important;

      }


      #manaV1015Fuel
      .m1022-custom-grid input{

        width:
          100% !important;

        min-width:
          0 !important;

        min-height:
          32px !important;

        padding:
          6px
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
          #51441f !important;

        border-radius:
          999px !important;

        background:
          #18150d !important;

        color:
          #f3d875 !important;

        font-size:
          8px !important;

        font-weight:
          900 !important;

      }


      /* =====================================
         TODAY'S MEALS
         ===================================== */

      #manaV1015Fuel
      .m1022-logged{

        display:
          grid !important;

        grid-template-columns:
          104px
          minmax(0,1fr)
          30px
          !important;

        align-items:
          center !important;

        gap:
          10px !important;

        width:
          100% !important;

        min-height:
          78px !important;

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
          104px !important;

        height:
          52px !important;

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

        font-size:
          9px !important;

      }


      #manaV1015Fuel
      .m1022-macro{

        font-size:
          9px !important;

      }


      /* =====================================
         DAILY TARGETS — BIGGER AGAIN
         ===================================== */

      #manaV1015Fuel
      .m1022-target-grid{

        gap:
          11px !important;

      }


      #manaV1015Fuel
      .m1022-target{

        min-height:
          118px !important;

        padding:
          15px !important;

      }


      #manaV1015Fuel
      .m1022-target-top{

        gap:
          11px !important;

      }


      #manaV1015Fuel
      .m1022-target-icon{

        width:
          46px !important;

        height:
          46px !important;

        flex:
          0
          0
          46px
          !important;

      }


      #manaV1015Fuel
      .m1022-target-icon svg{

        width:
          30px !important;

        height:
          30px !important;

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
          20px !important;

        line-height:
          1.1 !important;

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
          Modal uses almost full phone width.
        */

        #manaV1015Fuel
        .m1022-modal-backdrop{

          padding:
            6px !important;

        }


        #manaV1015Fuel
        .m1022-modal{

          width:
            calc(
              100vw - 12px
            ) !important;

          max-width:
            none !important;

          padding:
            11px !important;

        }


        /*
          Meal rows fill available width.
        */

        #manaV1015Fuel
        .m1022-option{

          grid-template-columns:
            92px
            minmax(0,1fr)
            29px
            !important;

          gap:
            8px !important;

          min-height:
            70px !important;

          padding:
            7px !important;

        }


        #manaV1015Fuel
        .m1022-option-art{

          width:
            92px !important;

          min-width:
            92px !important;

          height:
            46px !important;

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
            28px !important;

          min-width:
            28px !important;

          max-width:
            28px !important;

          height:
            28px !important;

          min-height:
            28px !important;

          max-height:
            28px !important;

        }


        #manaV1015Fuel
        .m1022-option
        > .m1022-add::before{

          font-size:
            19px !important;

        }


        /* =================================
           ADD YOUR OWN — PHONE
           ================================= */

        #manaV1015Fuel
        .m1022-custom{

          margin-top:
            6px !important;

          padding-top:
            7px !important;

        }


        #manaV1015Fuel
        .m1022-custom h4{

          margin-bottom:
            5px !important;

          font-size:
            10px !important;

        }


        #manaV1015Fuel
        .m1022-custom-grid{

          grid-template-columns:
            1fr
            1fr
            !important;

          gap:
            5px !important;

        }


        #manaV1015Fuel
        .m1022-custom-grid
        input:first-child{

          grid-column:
            1
            /
            -1
            !important;

        }


        #manaV1015Fuel
        .m1022-custom-grid input{

          min-height:
            29px !important;

          padding:
            5px
            7px
            !important;

          font-size:
            8px !important;

        }


        #manaV1015Fuel
        .m1022-custom
        > .m1022-add{

          min-height:
            28px !important;

          margin-top:
            5px !important;

          font-size:
            8px !important;

        }


        /* =================================
           TODAY'S MEALS — PHONE
           ================================= */

        #manaV1015Fuel
        .m1022-logged{

          grid-template-columns:
            80px
            minmax(0,1fr)
            27px
            !important;

          gap:
            8px !important;

          min-height:
            68px !important;

          padding:
            7px !important;

        }


        #manaV1015Fuel
        .m1022-logged-art{

          width:
            80px !important;

          height:
            40px !important;

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


        /* =================================
           TARGETS — PHONE
           ================================= */

        #manaV1015Fuel
        .m1022-target{

          min-height:
            110px !important;

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
            18px !important;

        }


        #manaV1015Fuel
        .m1022-target-value span{

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
            82px
            minmax(0,1fr)
            27px
            !important;

          gap:
            7px !important;

        }


        #manaV1015Fuel
        .m1022-option-art{

          width:
            82px !important;

          min-width:
            82px !important;

          height:
            41px !important;

        }


        #manaV1015Fuel
        .m1022-logged{

          grid-template-columns:
            72px
            minmax(0,1fr)
            26px
            !important;

        }


        #manaV1015Fuel
        .m1022-logged-art{

          width:
            72px !important;

          height:
            36px !important;

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
      "Mana Fuel Card Balance",
      "102330"
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
