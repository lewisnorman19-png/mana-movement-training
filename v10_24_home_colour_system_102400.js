/* =========================================
   MANA MOVEMENT TRAINING v10.24.1
   HOME — PREMIUM COLOUR + ILLUSTRATIONS

   BUILD: 102410

   HOME VISUAL SYSTEM
   -----------------------------------------
   PROFILE       = GREEN
   MANA STRENGTH = GOLD
   MANA 28       = BLUE
   MANA LYFE     = PURPLE / TEAL

   PURPOSE
   -----------------------------------------
   - Dark premium cards
   - NO solid yellow selected card
   - Stronger colour accents
   - Real illustrated graphics in each block
   - Consistent desktop + phone
   - Artwork sits on right side
   - Text remains readable
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "102410";


  const STYLE_ID =
    "mana-v10241-home-premium-style";


  /* =========================================
     SVG ARTWORK
     ========================================= */

  const ART = {


    profile: `
      <svg
        viewBox="0 0 180 150"
        aria-hidden="true"
      >

        <defs>

          <linearGradient
            id="profileGlow"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >

            <stop
              offset="0%"
              stop-color="#8cf0ad"
            />

            <stop
              offset="100%"
              stop-color="#38c978"
            />

          </linearGradient>

        </defs>


        <circle
          cx="92"
          cy="45"
          r="23"
          fill="none"
          stroke="url(#profileGlow)"
          stroke-width="7"
        />


        <path
          d="
            M47 126
            C50 88 67 72 92 72
            C117 72 135 88 139 126
          "
          fill="none"
          stroke="url(#profileGlow)"
          stroke-width="8"
          stroke-linecap="round"
        />


        <path
          d="
            M66 96
            L80 108
            L111 85
          "
          fill="none"
          stroke="#e8fff0"
          stroke-width="6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />


        <circle
          cx="142"
          cy="38"
          r="7"
          fill="#55d98b"
          opacity=".9"
        />


        <circle
          cx="42"
          cy="55"
          r="4"
          fill="#55d98b"
          opacity=".45"
        />

      </svg>
    `,


    strength: `
      <svg
        viewBox="0 0 190 150"
        aria-hidden="true"
      >

        <defs>

          <linearGradient
            id="strengthGlow"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >

            <stop
              offset="0%"
              stop-color="#ffe685"
            />

            <stop
              offset="100%"
              stop-color="#d8a824"
            />

          </linearGradient>

        </defs>


        <path
          d="
            M49 76
            H141
          "
          stroke="url(#strengthGlow)"
          stroke-width="10"
          stroke-linecap="round"
        />


        <rect
          x="27"
          y="54"
          width="15"
          height="44"
          rx="5"
          fill="#f2c94c"
        />


        <rect
          x="45"
          y="61"
          width="11"
          height="30"
          rx="4"
          fill="#f8da69"
        />


        <rect
          x="148"
          y="61"
          width="11"
          height="30"
          rx="4"
          fill="#f8da69"
        />


        <rect
          x="162"
          y="54"
          width="15"
          height="44"
          rx="5"
          fill="#f2c94c"
        />


        <path
          d="
            M68 119
            C77 99 86 93 95 93
            C105 93 114 99 124 119
          "
          fill="none"
          stroke="#fff4c6"
          stroke-width="7"
          stroke-linecap="round"
        />


        <circle
          cx="95"
          cy="103"
          r="34"
          fill="#f2c94c"
          opacity=".055"
        />

      </svg>
    `,


    mana28: `
      <svg
        viewBox="0 0 190 150"
        aria-hidden="true"
      >

        <defs>

          <linearGradient
            id="mana28Glow"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >

            <stop
              offset="0%"
              stop-color="#79c8ff"
            />

            <stop
              offset="100%"
              stop-color="#348bea"
            />

          </linearGradient>

        </defs>


        <circle
          cx="96"
          cy="75"
          r="49"
          fill="none"
          stroke="#4ea7ff"
          stroke-width="6"
          opacity=".28"
        />


        <path
          d="
            M96 26
            A49 49 0 1 1 54 100
          "
          fill="none"
          stroke="url(#mana28Glow)"
          stroke-width="8"
          stroke-linecap="round"
        />


        <text
          x="95"
          y="88"
          text-anchor="middle"
          fill="#eaf6ff"
          font-size="42"
          font-weight="900"
          font-family="Arial, sans-serif"
        >
          28
        </text>


        <path
          d="
            M139 34
            L157 34
            L157 52
          "
          fill="none"
          stroke="#78c9ff"
          stroke-width="6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />


        <path
          d="
            M157 34
            L140 51
          "
          stroke="#78c9ff"
          stroke-width="6"
          stroke-linecap="round"
        />

      </svg>
    `,


    lyfe: `
      <svg
        viewBox="0 0 190 150"
        aria-hidden="true"
      >

        <defs>

          <linearGradient
            id="lyfeGlow"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >

            <stop
              offset="0%"
              stop-color="#b58cff"
            />

            <stop
              offset="55%"
              stop-color="#9a6cf4"
            />

            <stop
              offset="100%"
              stop-color="#45d7c3"
            />

          </linearGradient>

        </defs>


        <circle
          cx="95"
          cy="73"
          r="45"
          fill="#a779ff"
          opacity=".055"
        />


        <path
          d="
            M95 124
            C95 98 99 79 116 59
          "
          fill="none"
          stroke="url(#lyfeGlow)"
          stroke-width="7"
          stroke-linecap="round"
        />


        <path
          d="
            M111 63
            C123 39 143 36 155 42
            C151 64 136 77 113 75
          "
          fill="none"
          stroke="#45d7c3"
          stroke-width="6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />


        <path
          d="
            M88 86
            C78 64 59 58 43 65
            C50 88 65 98 89 96
          "
          fill="none"
          stroke="#a779ff"
          stroke-width="6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />


        <circle
          cx="95"
          cy="37"
          r="8"
          fill="#b78dff"
          opacity=".82"
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
         HOME COLOUR TOKENS
         ===================================== */

      #manaV80Home{

        --home-gold:
          #f2c94c;

        --home-green:
          #55d98b;

        --home-blue:
          #4ea7ff;

        --home-purple:
          #a779ff;

        --home-teal:
          #45d7c3;

      }


      /* =====================================
         ALL HOME CARDS
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
            #121212 0%,
            #090909 75%
          ) !important;

        color:
          #fff !important;

      }


      /* =====================================
         KILL SOLID YELLOW ACTIVE STATE
         ===================================== */

      #manaV80Home
      .mana-v8013-program.current,

      #manaV80Home
      #manaV80Strength.current{

        background:
          linear-gradient(
            145deg,
            #131313,
            #090909
          ) !important;

        color:
          #fff !important;

      }


      /* =====================================
         ARTWORK
         ===================================== */

      #manaV80Home
      .mana-v1024-home-art{

        position:
          absolute !important;

        z-index:
          0 !important;

        right:
          20px !important;

        top:
          50% !important;

        transform:
          translateY(
            -50%
          ) !important;

        width:
          160px !important;

        height:
          132px !important;

        display:
          flex !important;

        align-items:
          center !important;

        justify-content:
          center !important;

        pointer-events:
          none !important;

        opacity:
          .96 !important;

      }


      #manaV80Home
      .mana-v1024-home-art svg{

        display:
          block !important;

        width:
          100% !important;

        height:
          100% !important;

        overflow:
          visible !important;

        filter:
          drop-shadow(
            0
            0
            14px
            var(
              --art-glow
            )
          ) !important;

      }


      /*
        Keep card copy over artwork.
      */

      #manaV80Home
      .mana-v8013-program
      > *:not(.mana-v1024-home-art),

      #manaV80Home
      #manaV80ProfileSetup
      > *:not(.mana-v1024-home-art){

        position:
          relative !important;

        z-index:
          2 !important;

      }


      #manaV80Home
      .mana-v8013-program p{

        max-width:
          64% !important;

      }


      #manaV80Home
      #manaV80ProfileSetup p{

        max-width:
          67% !important;

      }


      /* =====================================
         PROFILE — GREEN
         ===================================== */

      #manaV80Home
      #manaV80ProfileSetup{

        border:
          1px solid
          rgba(
            85,
            217,
            139,
            .62
          ) !important;

        box-shadow:
          0
          14px
          36px
          rgba(
            85,
            217,
            139,
            .10
          ) !important;

      }


      #manaV80Home
      #manaV80ProfileSetup::before{

        content:
          "" !important;

        position:
          absolute !important;

        z-index:
          1 !important;

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
            --home-green
          ) !important;

      }


      #manaV80Home
      #manaV80ProfileSetup::after{

        content:
          "" !important;

        position:
          absolute !important;

        z-index:
          0 !important;

        right:
          -60px !important;

        top:
          -90px !important;

        width:
          260px !important;

        height:
          260px !important;

        border-radius:
          50% !important;

        background:
          radial-gradient(
            circle,
            rgba(
              85,
              217,
              139,
              .20
            ),
            transparent
            68%
          ) !important;

      }


      #manaV80Home
      #manaV80ProfileSetup
      .mana-v1024-home-art{

        --art-glow:
          rgba(
            85,
            217,
            139,
            .24
          );

      }


      #manaV80Home
      #manaV80ProfileSetup
      .mana-v8013-profile-label,

      #manaV80Home
      #manaV80ProfileSetup
      .mana-v8013-profile-open{

        color:
          var(
            --home-green
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
            242,
            201,
            76,
            .64
          ) !important;

        box-shadow:
          0
          14px
          38px
          rgba(
            242,
            201,
            76,
            .10
          ) !important;

      }


      #manaV80Home
      [data-program="strength"]::after{

        content:
          "" !important;

        position:
          absolute !important;

        z-index:
          0 !important;

        right:
          -55px !important;

        top:
          -75px !important;

        width:
          250px !important;

        height:
          250px !important;

        border-radius:
          50% !important;

        background:
          radial-gradient(
            circle,
            rgba(
              242,
              201,
              76,
              .23
            ),
            transparent
            67%
          ) !important;

      }


      #manaV80Home
      [data-program="strength"]
      .mana-v1024-home-art{

        --art-glow:
          rgba(
            242,
            201,
            76,
            .27
          );

      }


      #manaV80Home
      [data-program="strength"]
      .mana-v8013-program-label,

      #manaV80Home
      [data-program="strength"]
      .mana-v8013-open{

        color:
          var(
            --home-gold
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
            78,
            167,
            255,
            .68
          ) !important;

        box-shadow:
          0
          14px
          38px
          rgba(
            78,
            167,
            255,
            .11
          ) !important;

      }


      #manaV80Home
      [data-program="mana28"]::after{

        content:
          "" !important;

        position:
          absolute !important;

        z-index:
          0 !important;

        right:
          -55px !important;

        top:
          -75px !important;

        width:
          250px !important;

        height:
          250px !important;

        border-radius:
          50% !important;

        background:
          radial-gradient(
            circle,
            rgba(
              78,
              167,
              255,
              .25
            ),
            transparent
            67%
          ) !important;

      }


      #manaV80Home
      [data-program="mana28"]
      .mana-v1024-home-art{

        --art-glow:
          rgba(
            78,
            167,
            255,
            .28
          );

      }


      #manaV80Home
      [data-program="mana28"]
      .mana-v8013-program-label,

      #manaV80Home
      [data-program="mana28"]
      .mana-v8013-open{

        color:
          var(
            --home-blue
          ) !important;

      }


      /* =====================================
         MANA LYFE — PURPLE / TEAL
         ===================================== */

      #manaV80Home
      [data-program="life"]{

        border:
          1px solid
          rgba(
            167,
            121,
            255,
            .70
          ) !important;

        box-shadow:
          0
          14px
          38px
          rgba(
            167,
            121,
            255,
            .12
          ) !important;

      }


      #manaV80Home
      [data-program="life"]::after{

        content:
          "" !important;

        position:
          absolute !important;

        z-index:
          0 !important;

        right:
          -50px !important;

        top:
          -65px !important;

        width:
          260px !important;

        height:
          260px !important;

        border-radius:
          50% !important;

        background:
          radial-gradient(
            circle at 55% 38%,
            rgba(
              167,
              121,
              255,
              .26
            ),
            transparent
            54%
          ),
          radial-gradient(
            circle at 65% 72%,
            rgba(
              69,
              215,
              195,
              .16
            ),
            transparent
            55%
          ) !important;

      }


      #manaV80Home
      [data-program="life"]
      .mana-v1024-home-art{

        --art-glow:
          rgba(
            167,
            121,
            255,
            .28
          );

      }


      #manaV80Home
      [data-program="life"]
      .mana-v8013-program-label{

        color:
          var(
            --home-purple
          ) !important;

      }


      #manaV80Home
      [data-program="life"]
      .mana-v8013-open{

        color:
          var(
            --home-teal
          ) !important;

      }


      /* =====================================
         ACTIVE STATES

         ACCENT ONLY.
         NO SOLID FILL.
         ===================================== */

      #manaV80Home
      [data-program="strength"].current{

        background:
          linear-gradient(
            145deg,
            #14130f,
            #090909
          ) !important;

        border-color:
          var(
            --home-gold
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
            .18
          ),
          0
          16px
          44px
          rgba(
            242,
            201,
            76,
            .19
          ) !important;

      }


      #manaV80Home
      [data-program="strength"].current::before{

        content:
          "" !important;

        display:
          block !important;

        position:
          absolute !important;

        z-index:
          3 !important;

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
            --home-gold
          ) !important;

      }


      #manaV80Home
      [data-program="mana28"].current{

        background:
          linear-gradient(
            145deg,
            #101319,
            #090909
          ) !important;

        border-color:
          var(
            --home-blue
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
            .18
          ),
          0
          16px
          44px
          rgba(
            78,
            167,
            255,
            .19
          ) !important;

      }


      #manaV80Home
      [data-program="mana28"].current::before{

        content:
          "" !important;

        display:
          block !important;

        position:
          absolute !important;

        z-index:
          3 !important;

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
            --home-blue
          ) !important;

      }


      #manaV80Home
      [data-program="life"].current{

        background:
          linear-gradient(
            145deg,
            #131018,
            #090909
          ) !important;

        border-color:
          var(
            --home-purple
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
            .18
          ),
          0
          16px
          44px
          rgba(
            167,
            121,
            255,
            .20
          ) !important;

      }


      #manaV80Home
      [data-program="life"].current::before{

        content:
          "" !important;

        display:
          block !important;

        position:
          absolute !important;

        z-index:
          3 !important;

        top:
          0 !important;

        left:
          0 !important;

        width:
          5px !important;

        height:
          100% !important;

        background:
          linear-gradient(
            180deg,
            var(
              --home-purple
            ),
            var(
              --home-teal
            )
          ) !important;

      }


      /* =====================================
         ACTIVE PROGRAM BADGES
         ===================================== */

      #manaV80Home
      .mana-v8013-current-badge{

        background:
          rgba(
            255,
            255,
            255,
            .035
          ) !important;

        box-shadow:
          none !important;

      }


      #manaV80Home
      [data-program="strength"]
      .mana-v8013-current-badge{

        color:
          var(
            --home-gold
          ) !important;

        border-color:
          rgba(
            242,
            201,
            76,
            .55
          ) !important;

      }


      #manaV80Home
      [data-program="mana28"]
      .mana-v8013-current-badge{

        color:
          var(
            --home-blue
          ) !important;

        border-color:
          rgba(
            78,
            167,
            255,
            .55
          ) !important;

      }


      #manaV80Home
      [data-program="life"]
      .mana-v8013-current-badge{

        color:
          var(
            --home-purple
          ) !important;

        border-color:
          rgba(
            167,
            121,
            255,
            .55
          ) !important;

      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(
        max-width:600px
      ){


        #manaV80Home
        .mana-v1024-home-art{

          right:
            5px !important;

          width:
            118px !important;

          height:
            108px !important;

          opacity:
            .94 !important;

        }


        #manaV80Home
        .mana-v8013-program p{

          max-width:
            67% !important;

        }


        #manaV80Home
        #manaV80ProfileSetup p{

          max-width:
            67% !important;

        }


        #manaV80Home
        .mana-v8013-program.current::before{

          width:
            4px !important;

        }


        #manaV80Home
        #manaV80ProfileSetup::before{

          width:
            4px !important;

        }

      }


      /* =====================================
         SMALL PHONE
         ===================================== */

      @media(
        max-width:390px
      ){


        #manaV80Home
        .mana-v1024-home-art{

          right:
            2px !important;

          width:
            103px !important;

          height:
            96px !important;

        }


        #manaV80Home
        .mana-v8013-program p,

        #manaV80Home
        #manaV80ProfileSetup p{

          max-width:
            66% !important;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     ADD ARTWORK TO CARD
     ========================================= */

  function addArt(
    element,
    type
  ) {

    if (
      !element ||
      !ART[
        type
      ]
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
      `mana-v1024-home-art mana-v1024-art-${type}`;


    artwork.innerHTML =
      ART[
        type
      ];


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


    if (
      !home
    ) {
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


    /*
      Home can refresh after profile/program
      changes. Re-run only on known app events.
      No MutationObserver.
    */

    document.addEventListener(
      "mana:profile-synced",
      decorateHome
    );


    document.addEventListener(
      "mana:program-change",
      decorateHome
    );


    window
      .refreshManaHomePremium =
        decorateHome;


    window
      .MANA_HOME_PREMIUM_BUILD =
        BUILD;


    console.log(
      "Mana Home Premium",
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
        once:
          true
      }
    );

  } else {

    init();

  }

})();
