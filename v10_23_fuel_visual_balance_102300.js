/* =========================================
   MANA MOVEMENT TRAINING v10.23.7
   FUEL — FULL WIDTH PHONE + BREATHING ROOM

   BUILD: 102370

   PURPOSE
   -----------------------------------------
   DESKTOP
   - Preserve current layout

   PHONE
   - Fuel banner fills full screen width
   - More breathing room
   - Larger meal-card spacing
   - Meal artwork matches category cards
   - Small + button
   - Add Your Own remains secondary
   - Larger Daily Targets
   - Coach Chat hidden from Fuel
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v10237-fuel-phone-breathe";


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
         COACH CHAT — FUEL ONLY
         ===================================== */

      #manaV83Content:has(#manaV1015Fuel)
      #manaV969CoachChat{

        display:
          none !important;

      }


      /* =====================================
         DESKTOP
         KEEP CURRENT LOOK
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


      #manaV1015Fuel
      .m1022-option{

        display:
          grid !important;

        grid-template-columns:
          118px
          minmax(0,1fr)
          30px
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

        line-height:
          1 !important;

      }


      /* =====================================
         ADD YOUR OWN
         ===================================== */

      #manaV1015Fuel
      .m1022-custom{

        margin-top:
          10px !important;

        padding-top:
          10px !important;

        border-top:
          1px solid
          #242424 !important;

      }


      #manaV1015Fuel
      .m1022-custom h4{

        margin:
          0
          0
          7px
          !important;

        color:
          #999 !important;

        font-size:
          10px !important;

      }


      #manaV1015Fuel
      .m1022-custom-grid{

        gap:
          6px !important;

      }


      #manaV1015Fuel
      .m1022-custom-grid input{

        min-height:
          31px !important;

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

        display:
          block !important;

        width:
          auto !important;

        min-width:
          100px !important;

        min-height:
          29px !important;

        margin:
          6px
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
         PHONE — FULL SCREEN / MORE AIR
         ===================================== */

      @media(max-width:600px){


        /* =================================
           MODAL FILLS THE PHONE
           ================================= */

        #manaV1015Fuel
        .m1022-modal-backdrop{

          padding:
            0 !important;

          align-items:
            flex-start !important;

          background:
            #060606 !important;

        }


        #manaV1015Fuel
        .m1022-modal{

          width:
            100vw !important;

          max-width:
            100vw !important;

          min-width:
            100vw !important;

          min-height:
            100dvh !important;

          max-height:
            100dvh !important;

          margin:
            0 !important;

          padding:
            16px
            14px
            24px
            !important;

          border:
            0 !important;

          border-radius:
            0 !important;

          box-shadow:
            none !important;

        }


        /* =================================
           HEADER GETS BREATHING ROOM
           ================================= */

        #manaV1015Fuel
        .m1022-modal-head{

          margin-bottom:
            18px !important;

        }


        #manaV1015Fuel
        .m1022-modal-head h3{

          margin-top:
            5px !important;

          font-size:
            23px !important;

        }


        #manaV1015Fuel
        .m1022-modal-head p{

          margin-top:
            5px !important;

          font-size:
            10px !important;

        }


        /* =================================
           MEAL LIST
           ================================= */

        #manaV1015Fuel
        .m1022-options{

          gap:
            12px !important;

        }


        /*
          Same artwork sizing language as
          Add-a-Meal cards, but more room
          around everything.
        */

        #manaV1015Fuel
        .m1022-option{

          grid-template-columns:
            106px
            minmax(0,1fr)
            30px
            !important;

          gap:
            11px !important;

          width:
            100% !important;

          min-height:
            100px !important;

          padding:
            8px !important;

          border-radius:
            15px !important;

        }


        #manaV1015Fuel
        .m1022-option-art{

          width:
            106px !important;

          min-width:
            106px !important;

          height:
            84px !important;

          min-height:
            84px !important;

          border-radius:
            11px !important;

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
            1.3 !important;

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
            29px !important;

          min-width:
            29px !important;

          max-width:
            29px !important;

          height:
            29px !important;

          min-height:
            29px !important;

          max-height:
            29px !important;

        }


        #manaV1015Fuel
        .m1022-option
        > .m1022-add::before{

          font-size:
            19px !important;

        }


        /* =================================
           ADD YOUR OWN — SECONDARY
           ================================= */

        #manaV1015Fuel
        .m1022-custom{

          margin-top:
            14px !important;

          padding-top:
            12px !important;

        }


        #manaV1015Fuel
        .m1022-custom h4{

          margin-bottom:
            7px !important;

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
            6px !important;

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
            33px !important;

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
            29px !important;

          margin-top:
            6px !important;

        }


        /* =================================
           TODAY'S MEALS
           ================================= */

        #manaV1015Fuel
        .m1022-logged{

          grid-template-columns:
            88px
            minmax(0,1fr)
            28px
            !important;

          gap:
            9px !important;

          min-height:
            82px !important;

          padding:
            7px !important;

        }


        #manaV1015Fuel
        .m1022-logged-art{

          width:
            88px !important;

          height:
            66px !important;

        }


        /* =================================
           TARGETS
           ================================= */

        #manaV1015Fuel
        .m1022-target-grid{

          gap:
            10px !important;

        }


        #manaV1015Fuel
        .m1022-target{

          min-height:
            112px !important;

          padding:
            13px !important;

        }


        #manaV1015Fuel
        .m1022-target-value{

          font-size:
            18px !important;

        }

      }


      /* =====================================
         SMALL PHONE
         ===================================== */

      @media(max-width:390px){

        #manaV1015Fuel
        .m1022-modal{

          padding:
            14px
            11px
            22px
            !important;

        }


        #manaV1015Fuel
        .m1022-option{

          grid-template-columns:
            94px
            minmax(0,1fr)
            28px
            !important;

          gap:
            8px !important;

          min-height:
            94px !important;

        }


        #manaV1015Fuel
        .m1022-option-art{

          width:
            94px !important;

          min-width:
            94px !important;

          height:
            78px !important;

          min-height:
            78px !important;

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
      "Mana Fuel Full Width Phone",
      "102370"
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
