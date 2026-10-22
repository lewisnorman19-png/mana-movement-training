/* =========================================
   MANA MOVEMENT TRAINING v10.23.6
   FUEL — MATCH CATEGORY CARD SIZING

   BUILD: 102360

   PURPOSE
   -----------------------------------------
   - Add-a-Meal category cards are the master
   - Meal selection cards match their sizing
   - Same artwork proportions
   - Same card height
   - Small + button
   - Compact Add Your Own
   - Desktop + phone
   - CSS ONLY
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v10236-fuel-match-cards";


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
         COACH CHAT
         FUEL ONLY
         ===================================== */

      #manaV83Content:has(#manaV1015Fuel)
      #manaV969CoachChat{

        display:
          none !important;

      }


      /* =====================================
         DESKTOP MEAL MODAL
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
         DESKTOP MEAL OPTION

         Uses same visual proportions as
         Add-a-Meal category artwork.
         ===================================== */

      #manaV1015Fuel
      .m1022-option{

        display:
          grid !important;

        grid-template-columns:
          118px
          minmax(0,1fr)
          32px
          !important;

        align-items:
          center !important;

        width:
          100% !important;

        min-height:
          100px !important;

        gap:
          11px !important;

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


      #manaV1015Fuel
      .m1022-option-art{

        display:
          flex !important;

        align-items:
          center !important;

        justify-content:
          center !important;

        width:
          118px !important;

        height:
          84px !important;

        min-width:
          118px !important;

        overflow:
          hidden !important;

        border-radius:
          11px !important;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .18
          ) !important;

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

        object-fit:
          cover !important;

        object-position:
          center !important;

      }


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

      }


      /* =====================================
         SMALL +
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
          30px !important;

        min-width:
          30px !important;

        max-width:
          30px !important;

        height:
          30px !important;

        min-height:
          30px !important;

        max-height:
          30px !important;

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
          20px !important;

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
          6px !important;

        padding-top:
          7px !important;

        border-top:
          1px solid
          #242424 !important;

      }


      #manaV1015Fuel
      .m1022-custom h4{

        margin:
          0
          0
          5px
          !important;

        color:
          #999 !important;

        font-size:
          10px !important;

      }


      #manaV1015Fuel
      .m1022-custom-grid{

        gap:
          5px !important;

      }


      #manaV1015Fuel
      .m1022-custom-grid input{

        min-height:
          30px !important;

        padding:
          5px
          8px
          !important;

        font-size:
          8px !important;

      }


      #manaV1015Fuel
      .m1022-custom
      > .m1022-add{

        display:
          block !important;

        width:
          auto !important;

        min-width:
          100px !important;

        min-height:
          28px !important;

        margin:
          5px
          0
          0
          auto
          !important;

        padding:
          0
          11px
          !important;

        border:
          1px solid
          #51441f !important;

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
          104px
          minmax(0,1fr)
          30px
          !important;

        align-items:
          center !important;

        gap:
          10px !important;

        min-height:
          86px !important;

        padding:
          7px !important;

      }


      #manaV1015Fuel
      .m1022-logged-art{

        width:
          104px !important;

        height:
          70px !important;

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
          cover !important;

        object-position:
          center !important;

      }


      /* =====================================
         DAILY TARGETS
         ===================================== */

      #manaV1015Fuel
      .m1022-target{

        min-height:
          118px !important;

        padding:
          15px !important;

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

        font-size:
          10px !important;

        font-weight:
          900 !important;

      }


      #manaV1015Fuel
      .m1022-target-value{

        font-size:
          20px !important;

      }


      /* =====================================
         PHONE

         EXACT REFERENCE:
         ADD-A-MEAL CATEGORY CARD
         ===================================== */

      @media(max-width:600px){


        #manaV1015Fuel
        .m1022-modal-backdrop{

          padding:
            5px !important;

          align-items:
            flex-start !important;

        }


        #manaV1015Fuel
        .m1022-modal{

          width:
            calc(
              100vw - 10px
            ) !important;

          max-width:
            calc(
              100vw - 10px
            ) !important;

          max-height:
            calc(
              100dvh - 10px
            ) !important;

          padding:
            10px !important;

        }


        /*
          This matches the existing phone
          Add-a-Meal category sizing:

          image = 104px
          card height ≈ 92px
        */

        #manaV1015Fuel
        .m1022-option{

          grid-template-columns:
            104px
            minmax(0,1fr)
            28px
            !important;

          gap:
            8px !important;

          min-height:
            92px !important;

          padding:
            6px !important;

          border-radius:
            14px !important;

        }


        #manaV1015Fuel
        .m1022-option-art{

          width:
            104px !important;

          min-width:
            104px !important;

          height:
            80px !important;

          min-height:
            80px !important;

          border-radius:
            10px !important;

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
            13px !important;

          line-height:
            1.15 !important;

        }


        #manaV1015Fuel
        .m1022-option p{

          margin:
            3px
            0
            5px
            !important;

          font-size:
            8px !important;

          line-height:
            1.25 !important;

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
            27px !important;

          min-width:
            27px !important;

          max-width:
            27px !important;

          height:
            27px !important;

          min-height:
            27px !important;

          max-height:
            27px !important;

        }


        #manaV1015Fuel
        .m1022-option
        > .m1022-add::before{

          font-size:
            18px !important;

        }


        /* Add Your Own stays secondary */

        #manaV1015Fuel
        .m1022-custom{

          margin-top:
            5px !important;

          padding-top:
            6px !important;

        }


        #manaV1015Fuel
        .m1022-custom h4{

          font-size:
            9px !important;

        }


        #manaV1015Fuel
        .m1022-custom-grid{

          grid-template-columns:
            minmax(0,1.5fr)
            minmax(0,1fr)
            minmax(0,1fr)
            !important;

          gap:
            4px !important;

        }


        #manaV1015Fuel
        .m1022-custom-grid
        input:first-child{

          grid-column:
            auto !important;

        }


        #manaV1015Fuel
        .m1022-custom-grid input{

          min-height:
            27px !important;

          padding:
            4px
            6px
            !important;

          font-size:
            7px !important;

        }


        #manaV1015Fuel
        .m1022-custom
        > .m1022-add{

          min-height:
            26px !important;

          min-width:
            92px !important;

          margin-top:
            4px !important;

          font-size:
            7px !important;

        }


        /* Targets remain prominent */

        #manaV1015Fuel
        .m1022-target{

          min-height:
            110px !important;

          padding:
            12px !important;

        }


        #manaV1015Fuel
        .m1022-target-value{

          font-size:
            18px !important;

        }

      }


      /* =====================================
         SMALL PHONE

         Matches the smaller category card:
         ~92px artwork width
         ===================================== */

      @media(max-width:390px){

        #manaV1015Fuel
        .m1022-option{

          grid-template-columns:
            92px
            minmax(0,1fr)
            27px
            !important;

          min-height:
            86px !important;

          gap:
            7px !important;

        }


        #manaV1015Fuel
        .m1022-option-art{

          width:
            92px !important;

          min-width:
            92px !important;

          height:
            74px !important;

          min-height:
            74px !important;

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
      "Mana Fuel Match Cards",
      "102360"
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
