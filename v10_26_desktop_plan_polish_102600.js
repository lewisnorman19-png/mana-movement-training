/* =========================================
   MANA MOVEMENT TRAINING v10.26
   CHOOSE YOUR PLAN — DESKTOP POLISH

   BUILD: 102600

   PURPOSE
   -----------------------------------------
   - LAPTOP / DESKTOP ONLY
   - Do NOT alter phone layout
   - Wider plan area
   - Reduce excessive card height
   - Better spacing
   - Align CTA buttons
   - Preserve:
       GREEN → BLUE → YELLOW
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "102600";


  const STYLE_ID =
    "mana-v1026-desktop-plan-polish";


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
         DESKTOP / LAPTOP ONLY
         ===================================== */

      @media(min-width:761px){


        /* ===================================
           MODAL / PAGE WIDTH
           =================================== */

        #manaV98Membership
        .mana-v981-wrap{

          width:
            min(
              1180px,
              calc(
                100vw - 48px
              )
            ) !important;

          max-width:
            1180px !important;

          margin:
            0 auto !important;

          padding:
            28px
            30px
            34px !important;

        }


        /* ===================================
           HEADER
           =================================== */

        #manaV98Membership
        .mana-v981-header{

          max-width:
            1080px !important;

          margin:
            0 auto
            24px !important;

        }


        #manaV98Membership
        .mana-v981-header-copy h1{

          font-size:
            34px !important;

          line-height:
            1.05 !important;

        }


        #manaV98Membership
        .mana-v981-header-copy p{

          max-width:
            620px !important;

          line-height:
            1.5 !important;

        }


        /* ===================================
           PLAN GRID
           =================================== */

        #manaV98Membership
        .mana-v981-plans{

          width:
            100% !important;

          max-width:
            1080px !important;

          margin:
            0 auto !important;

          display:
            grid !important;

          grid-template-columns:
            repeat(
              3,
              minmax(
                0,
                1fr
              )
            ) !important;

          gap:
            18px !important;

          align-items:
            stretch !important;

        }


        /* ===================================
           PLAN CARDS
           =================================== */

        #manaV98Membership
        .mana-v981-plan{

          min-height:
            0 !important;

          height:
            auto !important;

          padding:
            22px
            22px
            20px !important;

          border-radius:
            23px !important;

          display:
            flex !important;

          flex-direction:
            column !important;

        }


        /* GREEN */

        #manaV98Membership
        .mana-v981-plan:nth-child(1){

          border-color:
            rgba(
              85,
              217,
              139,
              .72
            ) !important;

          box-shadow:
            0
            12px
            30px
            rgba(
              85,
              217,
              139,
              .05
            ) !important;

        }


        /* BLUE */

        #manaV98Membership
        .mana-v981-plan:nth-child(2){

          border:
            1px solid
            rgba(
              85,
              168,
              222,
              .74
            ) !important;

          box-shadow:
            0
            12px
            30px
            rgba(
              85,
              168,
              222,
              .06
            ) !important;

        }


        /* YELLOW */

        #manaV98Membership
        .mana-v981-plan:nth-child(3){

          border-color:
            rgba(
              224,
              187,
              81,
              .76
            ) !important;

          box-shadow:
            0
            12px
            30px
            rgba(
              224,
              187,
              81,
              .05
            ) !important;

        }


        /* ===================================
           CARD COPY
           =================================== */

        #manaV98Membership
        .mana-v981-plan-label{

          margin-bottom:
            5px !important;

        }


        #manaV98Membership
        .mana-v981-plan h2{

          margin:
            5px
            0
            0 !important;

          font-size:
            25px !important;

          line-height:
            1.1 !important;

        }


        #manaV98Membership
        .mana-v981-price{

          margin-top:
            12px !important;

        }


        #manaV98Membership
        .mana-v981-price strong{

          font-size:
            30px !important;

        }


        #manaV98Membership
        .mana-v981-description{

          min-height:
            0 !important;

          margin-top:
            10px !important;

          font-size:
            12px !important;

          line-height:
            1.45 !important;

        }


        /* ===================================
           FEATURES
           =================================== */

        #manaV98Membership
        .mana-v981-features{

          display:
            grid !important;

          gap:
            7px !important;

          margin:
            16px
            0
            18px !important;

        }


        #manaV98Membership
        .mana-v981-feature{

          gap:
            7px !important;

          font-size:
            11px !important;

          line-height:
            1.35 !important;

        }


        /* ===================================
           BUTTONS
           =================================== */

        #manaV98Membership
        .mana-v981-button{

          min-height:
            50px !important;

          margin-top:
            auto !important;

          border-radius:
            14px !important;

          font-size:
            10px !important;

          letter-spacing:
            .02em !important;

        }


        #manaV98Membership
        .mana-v981-plan:nth-child(1)
        .mana-v981-button{

          border:
            1px solid
            var(
              --m25-green
            ) !important;

        }


        #manaV98Membership
        .mana-v981-plan:nth-child(2)
        .mana-v981-button{

          border:
            1px solid
            var(
              --m25-blue
            ) !important;

        }


        #manaV98Membership
        .mana-v981-plan:nth-child(3)
        .mana-v981-button{

          border:
            1px solid
            var(
              --m25-yellow
            ) !important;

        }


        /* ===================================
           CURRENT PLAN
           =================================== */

        #manaV98Membership
        .mana-v981-current{

          margin-top:
            8px !important;

        }


        /* ===================================
           POPULAR CHIP
           =================================== */

        #manaV98Membership
        .mana-v981-popular{

          top:
            13px !important;

          right:
            13px !important;

          padding:
            5px
            8px !important;

        }


        /* ===================================
           BOTTOM NOTE
           =================================== */

        #manaV98Membership
        .mana-v981-note{

          max-width:
            760px !important;

          margin:
            20px auto
            0 !important;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );


    window
      .MANA_DESKTOP_PLAN_POLISH_BUILD =
        BUILD;


    console.log(
      "Mana Desktop Plan Polish",
      BUILD
    );

  }


  if (
    document.readyState ===
      "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      installStyles,
      {
        once:true
      }
    );

  } else {

    installStyles();

  }

})();
