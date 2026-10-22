/* =========================================
   MANA MOVEMENT TRAINING v10.24.2
   HOME — PREMIUM OUTLINE COLOUR SYSTEM

   BUILD: 102420

   VISUAL RULE
   -----------------------------------------
   - KEEP ORIGINAL HOME TEXT COLOURS
   - KEEP ORIGINAL TYPOGRAPHY
   - KEEP DARK PREMIUM CARDS
   - COLOUR ONLY IN:
       • CARD OUTLINE
       • TOP ACCENT
       • SUBTLE BACKGROUND GLOW
       • ILLUSTRATION / ICON
   - NO SOLID YELLOW SELECTED CARD

   COLOUR SYSTEM
   -----------------------------------------
   PROFILE       = GREEN
   MANA STRENGTH = GOLD
   MANA 28       = BLUE
   MANA LYFE     = PURPLE / TEAL
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "102420";


  const STYLE_ID =
    "mana-v10242-home-outline-system";


  /* =========================================
     ARTWORK
     ========================================= */

  const ART = {


    profile: `
      <svg viewBox="0 0 160 130" aria-hidden="true">

        <circle
          cx="80"
          cy="38"
          r="20"
          fill="none"
          stroke="#63d99a"
          stroke-width="6"
        />

        <path
          d="
            M43 110
            C47 78 60 65 80 65
            C100 65 114 78 118 110
          "
          fill="none"
          stroke="#63d99a"
          stroke-width="7"
          stroke-linecap="round"
        />

        <path
          d="
            M60 87
            L73 98
            L100 77
          "
          fill="none"
          stroke="#b9f4d0"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

      </svg>
    `,


    strength: `
      <svg viewBox="0 0 170 130" aria-hidden="true">

        <line
          x1="45"
          y1="66"
          x2="125"
          y2="66"
          stroke="#e0bb51"
          stroke-width="8"
          stroke-linecap="round"
        />

        <rect
          x="25"
          y="48"
          width="13"
          height="36"
          rx="4"
          fill="#e0bb51"
        />

        <rect
          x="40"
          y="53"
          width="9"
          height="26"
          rx="4"
          fill="#f3d875"
        />

        <rect
          x="121"
          y="53"
          width="9"
          height="26"
          rx="4"
          fill="#f3d875"
        />

        <rect
          x="133"
          y="48"
          width="13"
          height="36"
          rx="4"
          fill="#e0bb51"
        />

      </svg>
    `,


    mana28: `
      <svg viewBox="0 0 170 130" aria-hidden="true">

        <circle
          cx="84"
          cy="64"
          r="40"
          fill="none"
          stroke="#4d98c9"
          stroke-width="6"
          opacity=".35"
        />

        <path
          d="
            M84 24
            A40 40 0 1 1 51 87
          "
          fill="none"
          stroke="#55a8de"
          stroke-width="7"
          stroke-linecap="round"
        />

        <text
          x="84"
          y="77"
          text-anchor="middle"
          fill="#d9efff"
          font-family="Arial, sans-serif"
          font-size="34"
          font-weight="900"
        >
          28
        </text>

      </svg>
    `,


    lyfe: `
      <svg viewBox="0 0 170 130" aria-hidden="true">

        <path
          d="
            M84 109
            C84 85 89 69 103 52
          "
          fill="none"
          stroke="#a681dc"
          stroke-width="6"
          stroke-linecap="round"
        />

        <path
          d="
            M100 55
            C111 35 129 33 140 39
            C136 58 123 69 102 66
          "
          fill="none"
          stroke="#4ac6ae"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <path
          d="
            M78 77
            C69 58 52 54 39 61
            C45 80 59 89 79 87
          "
          fill="none"
          stroke="#a681dc"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

      </svg>
    `

  };


  /* =========================================
     STYLES
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
         IMPORTANT:
         RESTORE ORIGINAL HOME TEXT COLOURS
         ===================================== */

      #manaV80Home
      .mana-v8013-program-label{

        color:
          #f3d875 !important;

      }


      #manaV80Home
      .mana-v8013-program h2{

        color:
          #ffffff !important;

      }


      #manaV80Home
      .mana-v8013-program p{

        color:
          #aaaaaa !important;

      }


      #manaV80Home
      .mana-v8013-open{

        color:
          #f3d875 !important;

      }


      #manaV80Home
      .mana-v8013-free-note{

        color:
          #d9c36d !important;

      }


      #manaV80Home
      .mana-v8013-price strong{

        color:
          #f3d875 !important;

      }


      #manaV80Home
      .mana-v8013-price span{

        color:
          #888888 !important;

      }


      #manaV80Home
      .mana-v8013-badge{

        border-color:
          #67551d !important;

        background:
          #191607 !important;

        color:
          #f3d875 !important;

      }


      /* =====================================
         BASE CARD
         ===================================== */

      #manaV80Home
      .mana-v8013-program,

      #manaV80Home
      #manaV80ProfileSetup{

        position:
          relative !important;

        isolation:
          isolate !important;

        overflow:
          hidden !important;

        background:
          linear-gradient(
            145deg,
            #151515,
            #080808
          ) !important;

      }


      /* =====================================
         REMOVE SOLID SELECTED FILL
         ===================================== */

      #manaV80Home
      .mana-v8013-program.current{

        background:
          linear-gradient(
            145deg,
            #151515,
            #080808
          ) !important;

        border-width:
          1px !important;

      }


      #manaV80Home
      .mana-v8013-program.current h2{

        color:
          #ffffff !important;

      }


      #manaV80Home
      .mana-v8013-program.current
      .mana-v8013-program-label{

        color:
          #f3d875 !important;

      }


      /* =====================================
         REMOVE OLD SOLID TOP BAR
         ===================================== */

      #manaV80Home
      .mana-v8013-program.current::before{

        content:
          "" !important;

        position:
          absolute !important;

        z-index:
          4 !important;

        top:
          0 !important;

        left:
          22px !important;

        right:
          22px !important;

        width:
          auto !important;

        height:
          2px !important;

        border-radius:
          999px !important;

      }


      /* =====================================
         ARTWORK
         ===================================== */

      #manaV80Home
      .mana-v1024-home-art{

        position:
          absolute !important;

        z-index:
          1 !important;

        right:
          22px !important;

        top:
          50% !important;

        transform:
          translateY(
            -50%
          ) !important;

        width:
          142px !important;

        height:
          112px !important;

        display:
          flex !important;

        align-items:
          center !important;

        justify-content:
          center !important;

        pointer-events:
          none !important;

        opacity:
          .88 !important;

      }


      #manaV80Home
      .mana-v1024-home-art svg{

        width:
          100% !important;

        height:
          100% !important;

        display:
          block !important;

      }


      #manaV80Home
      .mana-v8013-program
      > *:not(.mana-v1024-home-art),

      #manaV80Home
      #manaV80ProfileSetup
      > *:not(.mana-v1024-home-art){

        position:
          relative !important;

        z-index:
          3 !important;

      }


      #manaV80Home
      .mana-v8013-program p{

        max-width:
          67% !important;

      }


      /* =====================================
         PROFILE — GREEN OUTLINE
         ===================================== */

      #manaV80Home
      #manaV80ProfileSetup{

        border:
          1px solid
          rgba(
            64,
            178,
            120,
            .48
          ) !important;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              64,
              178,
              120,
              .08
            ),
            transparent
            46%
          ),

          linear-gradient(
            145deg,
            #111713,
            #090909
          ) !important;

      }


      #manaV80Home
      #manaV80ProfileSetup::before{

        background:
          linear-gradient(
            90deg,
            transparent,
            #55c68b,
            transparent
          ) !important;

      }


      /* =====================================
         MANA STRENGTH — GOLD
         ===================================== */

      #manaV80Home
      [data-program="strength"]{

        border:
          1px solid
          rgba(
            209,
            174,
            65,
            .58
          ) !important;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              218,
              181,
              69,
              .09
            ),
            transparent
            48%
          ),

          linear-gradient(
            145deg,
            #17150d,
            #090909
          ) !important;

      }


      #manaV80Home
      [data-program="strength"]::before{

        background:
          linear-gradient(
            90deg,
            transparent,
            #d9b852,
            transparent
          ) !important;

      }


      /* =====================================
         MANA 28 — BLUE
         ===================================== */

      #manaV80Home
      [data-program="mana28"]{

        border:
          1px solid
          rgba(
            73,
            150,
            201,
            .55
          ) !important;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              73,
              150,
              201,
              .09
            ),
            transparent
            48%
          ),

          linear-gradient(
            145deg,
            #10161a,
            #090909
          ) !important;

      }


      #manaV80Home
      [data-program="mana28"]::before{

        background:
          linear-gradient(
            90deg,
            transparent,
            #55a8de,
            transparent
          ) !important;

      }


      /* =====================================
         MANA LYFE — PURPLE
         ===================================== */

      #manaV80Home
      [data-program="life"]{

        border:
          1px solid
          rgba(
            141,
            104,
            193,
            .55
          ) !important;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              141,
              104,
              193,
              .10
            ),
            transparent
            48%
          ),

          linear-gradient(
            145deg,
            #15111a,
            #090909
          ) !important;

      }


      #manaV80Home
      [data-program="life"]::before{

        background:
          linear-gradient(
            90deg,
            transparent,
            #a681dc,
            #4ac6ae,
            transparent
          ) !important;

      }


      /* =====================================
         ACTIVE STATE

         SAME CARD.
         JUST STRONGER OUTLINE/GLOW.
         ===================================== */

      #manaV80Home
      [data-program="strength"].current{

        border-color:
          rgba(
            217,
            184,
            82,
            .95
          ) !important;

        box-shadow:
          0
          0
          0
          1px
          rgba(
            217,
            184,
            82,
            .12
          ),
          0
          14px
          34px
          rgba(
            217,
            184,
            82,
            .13
          ) !important;

      }


      #manaV80Home
      [data-program="mana28"].current{

        border-color:
          rgba(
            85,
            168,
            222,
            .95
          ) !important;

        box-shadow:
          0
          0
          0
          1px
          rgba(
            85,
            168,
            222,
            .12
          ),
          0
          14px
          34px
          rgba(
            85,
            168,
            222,
            .13
          ) !important;

      }


      #manaV80Home
      [data-program="life"].current{

        border-color:
          rgba(
            166,
            129,
            220,
            .95
          ) !important;

        box-shadow:
          0
          0
          0
          1px
          rgba(
            166,
            129,
            220,
            .12
          ),
          0
          14px
          34px
          rgba(
            166,
            129,
            220,
            .14
          ) !important;

      }


      /* =====================================
         ACTIVE PROGRAM BADGE

         NO SOLID YELLOW FILL
         ===================================== */

      #manaV80Home
      .mana-v8013-current-badge{

        background:
          #101010 !important;

        color:
          #f3d875 !important;

        border:
          1px solid
          #67551d !important;

        box-shadow:
          none !important;

      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(max-width:600px){


        #manaV80Home
        .mana-v1024-home-art{

          right:
            8px !important;

          width:
            108px !important;

          height:
            92px !important;

          opacity:
            .88 !important;

        }


        #manaV80Home
        .mana-v8013-program p{

          max-width:
            66% !important;

        }


        #manaV80Home
        .mana-v8013-program.current::before{

          left:
            16px !important;

          right:
            16px !important;

        }

      }


      @media(max-width:390px){


        #manaV80Home
        .mana-v1024-home-art{

          right:
            4px !important;

          width:
            96px !important;

          height:
            82px !important;

        }


        #manaV80Home
        .mana-v8013-program p{

          max-width:
            65% !important;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     ADD ART
     ========================================= */

  function addArt(
    element,
    type
  ) {

    if (
      !element ||
      !ART[type]
    ) {
      return;
    }


    element
      .querySelector(
        ".mana-v1024-home-art"
      )
      ?.remove();


    const artwork =
      document.createElement(
        "div"
      );


    artwork.className =
      `mana-v1024-home-art mana-v1024-${type}`;


    artwork.innerHTML =
      ART[type];


    element.appendChild(
      artwork
    );

  }


  /* =========================================
     DECORATE HOME
     ========================================= */

  function decorateHome() {

    const home =
      document.getElementById(
        "manaV80Home"
      );


    if (!home) {
      return;
    }


    addArt(
      document.getElementById(
        "manaV80ProfileSetup"
      ),
      "profile"
    );


    addArt(
      home.querySelector(
        '[data-program="strength"]'
      ),
      "strength"
    );


    addArt(
      home.querySelector(
        '[data-program="mana28"]'
      ),
      "mana28"
    );


    addArt(
      home.querySelector(
        '[data-program="life"]'
      ),
      "lyfe"
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    decorateHome();


    document.addEventListener(
      "mana:profile-synced",
      decorateHome
    );


    document.addEventListener(
      "mana:program-change",
      decorateHome
    );


    window.refreshManaHomePremium =
      decorateHome;


    window.MANA_HOME_PREMIUM_BUILD =
      BUILD;


    console.log(
      "Mana Home Outline System",
      BUILD
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
