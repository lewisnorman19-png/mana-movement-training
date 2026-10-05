/* =========================================
   MANA MOVEMENT TRAINING v9.88.0
   LOGIN + INTRO POLISH

   LOGIN
   - REMOVE "MANA 28 IS YOUR FIRST PROGRAM"
     MESSAGE ONLY
   - KEEP MANA 28 APP PROGRAM UNTOUCHED

   INTRO
   - REMOVE WAHINE BACKGROUND
   - RETURN TO BLACK / GOLD
   - MAKE KORU DESIGN MORE PROMINENT
   - KEEP ALL INTRO TEXT / BUTTONS / FLOW

   NO WORKOUT LOGIC CHANGES
   NO PROFILE LOGIC CHANGES
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "98800";

  const STYLE_ID =
    "mana-v988-login-intro-polish-style";


  /* =========================================
     REMOVE LOGIN MESSAGE
     ========================================= */

  function removeLoginMana28Message() {

    const auth =
      document.getElementById(
        "authView"
      );


    if (!auth) {
      return;
    }


    const paragraphs =
      auth.querySelectorAll(
        "p"
      );


    paragraphs.forEach(
      paragraph => {

        const text =
          String(
            paragraph.textContent || ""
          )
            .replace(
              /\s+/g,
              " "
            )
            .trim()
            .toLowerCase();


        if (
          text ===
          "mana 28 is your first program inside mana movement training."
        ) {

          paragraph.remove();

        }

      }
    );

  }


  /* =========================================
     INTRO STYLES
     ========================================= */

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
         INTRO BACKGROUND
         ===================================== */

      #manaV81Intro{

        background:

          radial-gradient(
            circle
            at
            78%
            10%,

            rgba(
              243,
              216,
              117,
              .12
            ) 0%,

            rgba(
              243,
              216,
              117,
              .055
            ) 18%,

            transparent
            40%
          ),

          radial-gradient(
            circle
            at
            12%
            72%,

            rgba(
              212,
              175,
              55,
              .09
            ) 0%,

            rgba(
              212,
              175,
              55,
              .035
            ) 24%,

            transparent
            48%
          ),

          linear-gradient(
            180deg,
            #080704
            0%,
            #050505
            42%,
            #030303
            100%
          )

          !important;


        background-image:

          radial-gradient(
            circle
            at
            78%
            10%,

            rgba(
              243,
              216,
              117,
              .12
            ) 0%,

            rgba(
              243,
              216,
              117,
              .055
            ) 18%,

            transparent
            40%
          ),

          radial-gradient(
            circle
            at
            12%
            72%,

            rgba(
              212,
              175,
              55,
              .09
            ) 0%,

            rgba(
              212,
              175,
              55,
              .035
            ) 24%,

            transparent
            48%
          ),

          linear-gradient(
            180deg,
            #080704
            0%,
            #050505
            42%,
            #030303
            100%
          )

          !important;


        background-position:
          center
          !important;


        background-size:
          auto
          !important;


        background-repeat:
          no-repeat
          !important;


        background-attachment:
          scroll
          !important;

      }


      /* =====================================
         EXISTING KORU ART
         MAKE IT STRONGER
         ===================================== */

      #manaV81Intro
      .mana-v81-koru{

        opacity:
          .34
          !important;

        filter:
          drop-shadow(
            0
            0
            16px
            rgba(
              243,
              216,
              117,
              .10
            )
          );

      }


      #manaV81Intro
      .mana-v81-koru
      path{

        stroke:
          #e1bd4f
          !important;

        stroke-width:
          5.5
          !important;

      }


      /* =====================================
         TOP KORU
         ===================================== */

      #manaV81Intro
      .mana-v81-koru.top{

        width:
          290px
          !important;

        height:
          290px
          !important;

        top:
          -70px
          !important;

        right:
          -80px
          !important;

        opacity:
          .40
          !important;

        transform:
          rotate(
            16deg
          )
          !important;

      }


      /* =====================================
         LOWER KORU
         ===================================== */

      #manaV81Intro
      .mana-v81-koru.bottom{

        width:
          300px
          !important;

        height:
          300px
          !important;

        bottom:
          20px
          !important;

        left:
          -125px
          !important;

        opacity:
          .27
          !important;

        transform:
          rotate(
            205deg
          )
          scale(
            .95
          )
          !important;

      }


      /* =====================================
         INTRO CONTENT
         ===================================== */

      #manaV81Intro
      .mana-v81-content{

        position:
          relative;

        z-index:
          3;

      }


      #manaV81Intro
      .mana-v81-mark{

        background:
          rgba(
            5,
            5,
            5,
            .92
          )
          !important;

        border-color:
          #d4af37
          !important;

        box-shadow:

          0
          0
          0
          1px
          rgba(
            243,
            216,
            117,
            .05
          ),

          0
          12px
          36px
          rgba(
            0,
            0,
            0,
            .38
          )
          !important;

      }


      #manaV81Intro
      .mana-v81-title{

        text-shadow:
          0
          3px
          18px
          rgba(
            0,
            0,
            0,
            .70
          )
          !important;

      }


      #manaV81Intro
      .mana-v81-lead{

        color:
          #b7b7b7
          !important;

        text-shadow:
          none
          !important;

      }


      /* =====================================
         INTRO CARDS
         ===================================== */

      #manaV81Intro
      .mana-v81-card{

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .14
          )
          !important;

        background:

          linear-gradient(
            145deg,
            rgba(
              17,
              17,
              14,
              .95
            ),
            rgba(
              7,
              7,
              7,
              .96
            )
          )

          !important;

        -webkit-backdrop-filter:
          none
          !important;

        backdrop-filter:
          none
          !important;

      }


      #manaV81Intro
      .mana-v81-quote{

        border:
          1px solid
          #4b401a
          !important;

        background:

          linear-gradient(
            145deg,
            #171308,
            #090909
          )

          !important;

        -webkit-backdrop-filter:
          none
          !important;

        backdrop-filter:
          none
          !important;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(
        max-width:600px
      ){

        #manaV81Intro
        .mana-v81-koru.top{

          width:
            235px
            !important;

          height:
            235px
            !important;

          top:
            -55px
            !important;

          right:
            -88px
            !important;

          opacity:
            .42
            !important;

        }


        #manaV81Intro
        .mana-v81-koru.bottom{

          width:
            245px
            !important;

          height:
            245px
            !important;

          left:
            -112px
            !important;

          bottom:
            55px
            !important;

          opacity:
            .26
            !important;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    removeLoginMana28Message();


    /*
      Small retries only because the auth
      DOM can finish rendering just after
      this script loads.

      No observers.
    */

    [
      250,
      700
    ].forEach(
      delay => {

        setTimeout(
          removeLoginMana28Message,
          delay
        );

      }
    );


    window.MANA_LOGIN_INTRO_POLISH_BUILD =
      BUILD;


    console.log(
      "[Mana v9.88.0] " +
      "login message removed + koru intro ready"
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
