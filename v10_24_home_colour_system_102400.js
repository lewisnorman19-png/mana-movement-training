/* =========================================
   MANA MOVEMENT TRAINING v10.24
   HOME — PREMIUM COLOUR SYSTEM

   BUILD: 102400

   PURPOSE
   -----------------------------------------
   - Introduce stronger premium colour accents
   - Remove solid yellow selected states
   - Keep dark Mana foundation
   - Use borders / glows / icons / banners
   - Give each Home card a clear identity
   - Mobile + desktop
   - CSS ONLY
   - NO observers
   - NO render loops
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v1024-home-colour-system";


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
         COLOUR TOKENS
         ===================================== */

      #manaV80Home{

        --mana-gold:
          #f2c94c;

        --mana-green:
          #55d98b;

        --mana-blue:
          #4ea7ff;

        --mana-purple:
          #a779ff;

        --mana-teal:
          #45d7c3;

      }


      /* =====================================
         HOME FOUNDATION
         ===================================== */

      #manaV80Home
      .mana-v8013-program,

      #manaV80Home
      #manaV80ProfileSetup{

        position:
          relative !important;

        overflow:
          hidden !important;

        background:
          linear-gradient(
            145deg,
            #11110f,
            #090909
          ) !important;

        border:
          1px solid
          #2f2f2f !important;

        box-shadow:
          0
          10px
          28px
          rgba(
            0,
            0,
            0,
            .22
          ) !important;

        transition:
          transform
          .18s ease,
          border-color
          .18s ease,
          box-shadow
          .18s ease !important;

      }


      /* =====================================
         REMOVE OLD SOLID YELLOW SELECTION
         ===================================== */

      #manaV80Home
      .mana-v8013-program.current{

        background:
          linear-gradient(
            145deg,
            #121212,
            #090909
          ) !important;

        color:
          inherit !important;

      }


      #manaV80Home
      .mana-v8013-program.current::before{

        display:
          block !important;

        content:
          "" !important;

        position:
          absolute !important;

        top:
          0 !important;

        left:
          0 !important;

        width:
          5px !important;

        height:
          100% !important;

        border-radius:
          0
          6px
          6px
          0 !important;

      }


      /* =====================================
         PROFILE — GREEN
         ===================================== */

      #manaV80Home
      #manaV80ProfileSetup{

        border-color:
          rgba(
            85,
            217,
            139,
            .48
          ) !important;

        box-shadow:
          0
          12px
          34px
          rgba(
            85,
            217,
            139,
            .08
          ) !important;

      }


      #manaV80Home
      #manaV80ProfileSetup::before{

        content:
          "" !important;

        position:
          absolute !important;

        top:
          0 !important;

        left:
          0 !important;

        width:
          5px !important;

        height:
          100% !important;

        background:
          var(
            --mana-green
          ) !important;

      }


      #manaV80Home
      #manaV80ProfileSetup
      .mana-v8013-profile-label{

        color:
          var(
            --mana-green
          ) !important;

      }


      #manaV80Home
      #manaV80ProfileSetup
      .mana-v8013-profile-open{

        color:
          var(
            --mana-green
          ) !important;

      }


      /* =====================================
         MANA STRENGTH — GOLD
         ===================================== */

      #manaV80Home
      .mana-v8013-program[
        data-program="strength"
      ]{

        border-color:
          rgba(
            242,
            201,
            76,
            .52
          ) !important;

        box-shadow:
          0
          12px
          36px
          rgba(
            242,
            201,
            76,
            .07
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="strength"
      ]::after{

        content:
          "" !important;

        position:
          absolute !important;

        top:
          0 !important;

        right:
          0 !important;

        width:
          110px !important;

        height:
          110px !important;

        pointer-events:
          none !important;

        background:
          radial-gradient(
            circle at top right,
            rgba(
              242,
              201,
              76,
              .15
            ),
            transparent
            68%
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="strength"
      ]
      .mana-v8013-program-label,

      #manaV80Home
      .mana-v8013-program[
        data-program="strength"
      ]
      .mana-v8013-open{

        color:
          var(
            --mana-gold
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="strength"
      ].current{

        border-color:
          rgba(
            242,
            201,
            76,
            .95
          ) !important;

        box-shadow:
          0
          0
          0
          1px
          rgba(
            242,
            201,
            76,
            .14
          ),
          0
          14px
          38px
          rgba(
            242,
            201,
            76,
            .16
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="strength"
      ].current::before{

        background:
          var(
            --mana-gold
          ) !important;

      }


      /* =====================================
         MANA 28 — BLUE
         ===================================== */

      #manaV80Home
      .mana-v8013-program[
        data-program="mana28"
      ]{

        border-color:
          rgba(
            78,
            167,
            255,
            .48
          ) !important;

        box-shadow:
          0
          12px
          36px
          rgba(
            78,
            167,
            255,
            .07
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="mana28"
      ]::after{

        content:
          "" !important;

        position:
          absolute !important;

        top:
          0 !important;

        right:
          0 !important;

        width:
          110px !important;

        height:
          110px !important;

        pointer-events:
          none !important;

        background:
          radial-gradient(
            circle at top right,
            rgba(
              78,
              167,
              255,
              .16
            ),
            transparent
            68%
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="mana28"
      ]
      .mana-v8013-program-label,

      #manaV80Home
      .mana-v8013-program[
        data-program="mana28"
      ]
      .mana-v8013-open{

        color:
          var(
            --mana-blue
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="mana28"
      ].current{

        border-color:
          rgba(
            78,
            167,
            255,
            .95
          ) !important;

        box-shadow:
          0
          0
          0
          1px
          rgba(
            78,
            167,
            255,
            .13
          ),
          0
          14px
          38px
          rgba(
            78,
            167,
            255,
            .16
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="mana28"
      ].current::before{

        background:
          var(
            --mana-blue
          ) !important;

      }


      /* =====================================
         MANA LYFE — PURPLE + TEAL
         ===================================== */

      #manaV80Home
      .mana-v8013-program[
        data-program="life"
      ]{

        border-color:
          rgba(
            167,
            121,
            255,
            .5
          ) !important;

        box-shadow:
          0
          12px
          36px
          rgba(
            167,
            121,
            255,
            .08
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="life"
      ]::after{

        content:
          "" !important;

        position:
          absolute !important;

        top:
          0 !important;

        right:
          0 !important;

        width:
          130px !important;

        height:
          120px !important;

        pointer-events:
          none !important;

        background:
          radial-gradient(
            circle at top right,
            rgba(
              167,
              121,
              255,
              .18
            ),
            transparent
            64%
          ),
          radial-gradient(
            circle at bottom right,
            rgba(
              69,
              215,
              195,
              .10
            ),
            transparent
            66%
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="life"
      ]
      .mana-v8013-program-label{

        color:
          var(
            --mana-purple
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="life"
      ]
      .mana-v8013-open{

        color:
          var(
            --mana-teal
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="life"
      ].current{

        border-color:
          rgba(
            167,
            121,
            255,
            .95
          ) !important;

        box-shadow:
          0
          0
          0
          1px
          rgba(
            167,
            121,
            255,
            .14
          ),
          0
          14px
          38px
          rgba(
            167,
            121,
            255,
            .16
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="life"
      ].current::before{

        background:
          linear-gradient(
            180deg,
            var(
              --mana-purple
            ),
            var(
              --mana-teal
            )
          ) !important;

      }


      /* =====================================
         ACTIVE PROGRAM BADGE
         ===================================== */

      #manaV80Home
      .mana-v8013-current-badge{

        border:
          1px solid
          currentColor !important;

        background:
          rgba(
            255,
            255,
            255,
            .035
          ) !important;

        color:
          inherit !important;

        box-shadow:
          none !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="strength"
      ]
      .mana-v8013-current-badge{

        color:
          var(
            --mana-gold
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="mana28"
      ]
      .mana-v8013-current-badge{

        color:
          var(
            --mana-blue
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="life"
      ]
      .mana-v8013-current-badge{

        color:
          var(
            --mana-purple
          ) !important;

      }


      /* =====================================
         CARD BADGES
         ===================================== */

      #manaV80Home
      .mana-v8013-badge{

        background:
          #121212 !important;

        border:
          1px solid
          #343434 !important;

        color:
          #cfcfcf !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="strength"
      ]
      .mana-v8013-badge{

        border-color:
          rgba(
            242,
            201,
            76,
            .45
          ) !important;

        color:
          var(
            --mana-gold
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="mana28"
      ]
      .mana-v8013-badge{

        border-color:
          rgba(
            78,
            167,
            255,
            .45
          ) !important;

        color:
          var(
            --mana-blue
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program[
        data-program="life"
      ]
      .mana-v8013-badge{

        border-color:
          rgba(
            167,
            121,
            255,
            .45
          ) !important;

        color:
          var(
            --mana-purple
          ) !important;

      }


      /* =====================================
         INTERACTION
         ===================================== */

      #manaV80Home
      .mana-v8013-program:hover,

      #manaV80Home
      #manaV80ProfileSetup:hover{

        transform:
          translateY(
            -2px
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program:active,

      #manaV80Home
      #manaV80ProfileSetup:active{

        transform:
          scale(
            .992
          ) !important;

      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(max-width:600px){

        #manaV80Home
        .mana-v8013-program,

        #manaV80Home
        #manaV80ProfileSetup{

          border-width:
            1px !important;

          box-shadow:
            0
            8px
            24px
            rgba(
              0,
              0,
              0,
              .25
            ) !important;

        }


        #manaV80Home
        .mana-v8013-program.current{

          transform:
            none !important;

        }


        #manaV80Home
        .mana-v8013-program.current::before,

        #manaV80Home
        #manaV80ProfileSetup::before{

          width:
            4px !important;

        }


        #manaV80Home
        .mana-v8013-program[
          data-program="strength"
        ].current{

          box-shadow:
            0
            0
            0
            1px
            rgba(
              242,
              201,
              76,
              .12
            ),
            0
            10px
            26px
            rgba(
              242,
              201,
              76,
              .12
            ) !important;

        }


        #manaV80Home
        .mana-v8013-program[
          data-program="mana28"
        ].current{

          box-shadow:
            0
            0
            0
            1px
            rgba(
              78,
              167,
              255,
              .12
            ),
            0
            10px
            26px
            rgba(
              78,
              167,
              255,
              .12
            ) !important;

        }


        #manaV80Home
        .mana-v8013-program[
          data-program="life"
        ].current{

          box-shadow:
            0
            0
            0
            1px
            rgba(
              167,
              121,
              255,
              .12
            ),
            0
            10px
            26px
            rgba(
              167,
              121,
              255,
              .12
            ) !important;

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
      "Mana Home Colour System",
      "102400"
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
