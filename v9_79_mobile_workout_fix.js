/* =========================================
   MANA MOVEMENT TRAINING v9.79.0
   PHONE WORKOUT LAYOUT FIX

   PHONE ONLY

   - DOES NOT CHANGE LAPTOP
   - REMOVES FIXED WORKOUT HEIGHT ON PHONE
   - USES NATURAL VERTICAL PAGE HEIGHT
   - KEEPS HORIZONTAL DAY SWIPE
   - NO CLIPPING
   - NO INTERNAL EXERCISE SCROLL
   - COMPLETE DAY REMAINS VISIBLE
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "97900";

  const STYLE_ID =
    "mana-v979-mobile-workout-fix";


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
         PHONE ONLY
         ===================================== */

      @media(max-width:700px){


        /* =================================
           OUTER PROGRAM SCREEN

           Let the phone page scroll
           naturally from top to bottom.
           ================================= */

        #manaV83ProgramShell.mana-v978-program{

          display:block !important;

          height:auto !important;

          min-height:100dvh !important;

          max-height:none !important;

          box-sizing:border-box !important;

          overflow-x:hidden !important;

          overflow-y:auto !important;

          -webkit-overflow-scrolling:
            touch !important;

          padding:
            calc(
              env(
                safe-area-inset-top
              ) + 8px
            )
            10px
            calc(
              98px +
              env(
                safe-area-inset-bottom
              )
            )
            !important;
        }


        /* =================================
           INNER SHELL

           No forced viewport height.
           ================================= */

        #manaV83ProgramShell.mana-v978-program
        .mana-v83-shell{

          width:100% !important;

          height:auto !important;

          min-height:0 !important;

          max-height:none !important;

          display:block !important;

          overflow:visible !important;

          margin:
            0 auto !important;
        }


        /* =================================
           HEADER
           ================================= */

        #manaV83ProgramShell.mana-v978-program
        .mana-v83-head{

          margin-bottom:
            7px !important;
        }


        /* =================================
           CONTENT

           Natural height.
           ================================= */

        #manaV83ProgramShell.mana-v978-program
        #manaV83Content{

          display:block !important;

          height:auto !important;

          min-height:0 !important;

          max-height:none !important;

          overflow:visible !important;
        }


        /* =================================
           PROGRAM INTRO
           ================================= */

        .mana-v978-program-head{

          margin:
            0 0 7px !important;
        }


        .mana-v978-program-head
        .mana-v978-kicker{

          font-size:
            11px !important;

          line-height:
            1.2 !important;
        }


        .mana-v978-program-head h2{

          margin:
            3px 0 !important;

          font-size:
            22px !important;

          line-height:
            1.05 !important;
        }


        .mana-v978-program-head p{

          display:none !important;
        }


        /* =================================
           HORIZONTAL DAYS

           Swipe still works,
           but carousel itself is not
           vertically height constrained.
           ================================= */

        .mana-v978-days{

          width:100% !important;

          height:auto !important;

          min-height:0 !important;

          max-height:none !important;

          display:flex !important;

          align-items:flex-start !important;

          overflow-x:auto !important;

          overflow-y:visible !important;

          scroll-snap-type:
            x mandatory !important;

          -webkit-overflow-scrolling:
            touch !important;

          scrollbar-width:
            none !important;

          touch-action:
            pan-x pan-y !important;
        }


        .mana-v978-days::-webkit-scrollbar{

          display:none !important;
        }


        /* =================================
           EACH DAY

           Full width,
           natural vertical height.
           ================================= */

        .mana-v978-day{

          flex:
            0 0 100% !important;

          width:
            100% !important;

          min-width:
            100% !important;

          max-width:
            100% !important;

          height:auto !important;

          min-height:0 !important;

          max-height:none !important;

          align-self:flex-start !important;

          display:flex !important;

          flex-direction:
            column !important;

          overflow:visible !important;

          box-sizing:
            border-box !important;

          padding:
            14px 14px 13px !important;

          border-radius:
            18px !important;

          scroll-snap-align:
            start !important;

          scroll-snap-stop:
            always !important;
        }


        /* =================================
           DAY INFO
           ================================= */

        .mana-v978-day-number{

          font-size:
            11px !important;

          line-height:
            1.2 !important;

          letter-spacing:
            .08em !important;
        }


        .mana-v978-day h3{

          margin:
            5px 0 2px !important;

          font-size:
            27px !important;

          line-height:
            1.04 !important;
        }


        .mana-v978-type{

          font-size:
            13px !important;

          line-height:
            1.2 !important;

          margin-bottom:
            2px !important;
        }


        /* =================================
           EXERCISE LIST

           No inner vertical scrollbar.
           Let the main page handle height.
           ================================= */

        .mana-v978-preview{

          width:100% !important;

          height:auto !important;

          min-height:0 !important;

          max-height:none !important;

          flex:none !important;

          overflow:visible !important;

          margin:
            8px 0 10px !important;

          border-top:
            1px solid
            #29271f !important;

          border-bottom:
            1px solid
            #29271f !important;
        }


        /* =================================
           EXERCISE ROWS

           Keep readable font,
           remove excess empty space.
           ================================= */

        .mana-v978-row{

          min-height:
            0 !important;

          height:auto !important;

          flex:none !important;

          display:grid !important;

          grid-template-columns:
            minmax(
              0,
              1fr
            )
            minmax(
              92px,
              auto
            )
            !important;

          gap:
            8px !important;

          align-items:center !important;

          padding:
            11px 1px !important;

          font-size:
            16px !important;

          line-height:
            1.22 !important;
        }


        .mana-v978-row
        span:first-child{

          min-width:
            0 !important;

          font-size:
            16px !important;

          line-height:
            1.22 !important;

          font-weight:
            850 !important;
        }


        .mana-v978-row
        span:last-child{

          font-size:
            15px !important;

          line-height:
            1.2 !important;

          font-weight:
            950 !important;

          text-align:
            right !important;

          white-space:
            normal !important;
        }


        /* =================================
           COMPLETE DAY

           Normal block at bottom of card.
           ================================= */

        .mana-v978-complete{

          width:
            100% !important;

          height:auto !important;

          min-height:
            48px !important;

          flex:none !important;

          margin:
            0 !important;

          font-size:
            13px !important;
        }


        /* =================================
           LAPTOP NAV MUST NOT APPEAR
           ================================= */

        .mana-v978-daynav{

          display:
            none !important;
        }

      }


      /* =====================================
         NARROW PHONES
         ===================================== */

      @media(max-width:390px){

        .mana-v978-day{

          padding:
            12px 12px 11px !important;
        }


        .mana-v978-day h3{

          font-size:
            25px !important;
        }


        .mana-v978-row{

          grid-template-columns:
            minmax(
              0,
              1fr
            )
            minmax(
              84px,
              auto
            )
            !important;

          padding:
            10px 1px !important;

          font-size:
            16px !important;
        }


        .mana-v978-row
        span:last-child{

          font-size:
            14px !important;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );


    console.log(
      "[Mana v9.79.0] mobile workout layout fix loaded"
    );
  }


  function init() {

    installStyles();

    window.MANA_MOBILE_WORKOUT_BUILD =
      BUILD;
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
