/* =========================================
   MANA MOVEMENT TRAINING v10.25.2
   MASTER PREMIUM VISUAL SYSTEM

   BUILD: 102520

   GLOBAL SEQUENCE
   -----------------------------------------
   1 = GREEN
   2 = BLUE
   3 = YELLOW
   4 = PURPLE
   5 = ORANGE

   HOME
   -----------------------------------------
   MANA STRENGTH = GREEN
   MANA LYFE     = BLUE
   MANA 28       = YELLOW

   FUNCTION NAV
   -----------------------------------------
   WORKOUTS = GREEN
   FUEL / RECLAIM = BLUE
   PROGRESS = YELLOW
   LEARNING = PURPLE

   IMPORTANT
   -----------------------------------------
   - Original Mana text colours stay
   - Colour is used in outlines / icons / glow
   - No solid selected colour fills
   - No permanent MutationObserver
   - No continuous render loop
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "102520";


  const STYLE_ID =
    "mana-v10252-master-visual-system";


  const COLOURS = {

    green:"#55d98b",

    blue:"#55a8de",

    yellow:"#e0bb51",

    purple:"#a681dc",

    orange:"#e98a54"

  };


  const SEQUENCE =
    [
      "green",
      "blue",
      "yellow",
      "purple",
      "orange"
    ];


  /* =========================================
     HOME ICONS
     ========================================= */

  const HOME_ICONS = {


    strength:`

      <svg viewBox="0 0 90 90" aria-hidden="true">

        <line
          x1="25"
          y1="45"
          x2="65"
          y2="45"
          stroke="currentColor"
          stroke-width="7"
          stroke-linecap="round"
        />

        <rect
          x="14"
          y="30"
          width="8"
          height="30"
          rx="3"
          fill="currentColor"
        />

        <rect
          x="24"
          y="35"
          width="7"
          height="20"
          rx="3"
          fill="currentColor"
        />

        <rect
          x="59"
          y="35"
          width="7"
          height="20"
          rx="3"
          fill="currentColor"
        />

        <rect
          x="68"
          y="30"
          width="8"
          height="30"
          rx="3"
          fill="currentColor"
        />

      </svg>

    `,


    lyfe:`

      <svg viewBox="0 0 90 90" aria-hidden="true">

        <path
          d="
            M45 73
            C45 56 49 44 59 33
          "
          fill="none"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
        />

        <path
          d="
            M57 35
            C64 21 77 20 83 26
            C79 40 69 47 57 44
          "
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linejoin="round"
        />

        <path
          d="
            M42 49
            C35 36 24 33 15 38
            C19 52 29 58 43 56
          "
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linejoin="round"
        />

      </svg>

    `,


    mana28:`

      <svg viewBox="0 0 90 90" aria-hidden="true">

        <circle
          cx="45"
          cy="45"
          r="31"
          fill="none"
          stroke="currentColor"
          stroke-width="5"
          opacity=".35"
        />

        <path
          d="
            M45 14
            A31 31 0 1 1 20 63
          "
          fill="none"
          stroke="currentColor"
          stroke-width="6"
          stroke-linecap="round"
        />

        <text
          x="45"
          y="54"
          text-anchor="middle"
          fill="currentColor"
          font-size="25"
          font-weight="900"
          font-family="Arial, sans-serif"
        >
          28
        </text>

      </svg>

    `

  };


  /* =========================================
     STYLE INSTALL
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


      :root{

        --m25-green:
          ${COLOURS.green};

        --m25-blue:
          ${COLOURS.blue};

        --m25-yellow:
          ${COLOURS.yellow};

        --m25-purple:
          ${COLOURS.purple};

        --m25-orange:
          ${COLOURS.orange};

      }


      /* =====================================
         HOME TYPOGRAPHY
         KEEP ORIGINAL COLOURS
         ===================================== */

      #manaV80Home
      .mana-v8013-program-label{

        color:
          #f3d875 !important;

      }


      #manaV80Home
      .mana-v8013-program h2{

        color:
          #fff !important;

      }


      #manaV80Home
      .mana-v8013-program p{

        color:
          #aaa !important;

      }


      #manaV80Home
      .mana-v8013-open{

        color:
          #f3d875 !important;

      }


      #manaV80Home
      .mana-v8013-price strong{

        color:
          #f3d875 !important;

      }


      #manaV80Home
      .mana-v8013-free-note{

        color:
          #d9c36d !important;

      }


      /* =====================================
         HOME CARDS
         ===================================== */

      #manaV80Home
      .mana-v8013-program{

        position:
          relative !important;

        isolation:
          isolate !important;

        overflow:
          hidden !important;

        border-width:
          1px !important;

        background:
          linear-gradient(
            145deg,
            #151515,
            #080808
          ) !important;

        color:
          #fff !important;

      }


      #manaV80Home
      .mana-v8013-program.current{

        background:
          linear-gradient(
            145deg,
            #151515,
            #080808
          ) !important;

        color:
          #fff !important;

        border-width:
          1px !important;

      }


      #manaV80Home
      .mana-v8013-program.current h2{

        color:
          #fff !important;

      }


      #manaV80Home
      .mana-v8013-program.current
      .mana-v8013-program-label{

        color:
          #f3d875 !important;

      }


      /* Strength = GREEN */

      #manaV80Home
      [data-program="strength"]{

        border-color:
          rgba(
            85,
            217,
            139,
            .68
          ) !important;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              85,
              217,
              139,
              .11
            ),
            transparent
            46%
          ),

          linear-gradient(
            145deg,
            #101713,
            #090909
          ) !important;

      }


      /* Lyfe = BLUE */

      #manaV80Home
      [data-program="life"]{

        border-color:
          rgba(
            85,
            168,
            222,
            .68
          ) !important;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              85,
              168,
              222,
              .11
            ),
            transparent
            46%
          ),

          linear-gradient(
            145deg,
            #10161a,
            #090909
          ) !important;

      }


      /* Mana28 = YELLOW */

      #manaV80Home
      [data-program="mana28"]{

        border-color:
          rgba(
            224,
            187,
            81,
            .72
          ) !important;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              224,
              187,
              81,
              .12
            ),
            transparent
            46%
          ),

          linear-gradient(
            145deg,
            #17150d,
            #090909
          ) !important;

      }


      /* =====================================
         HOME ICONS
         ===================================== */

      #manaV80Home
      .m1025-home-icon{

        position:
          absolute !important;

        z-index:
          2 !important;

        right:
          20px !important;

        top:
          50% !important;

        transform:
          translateY(
            -50%
          ) !important;

        display:
          grid !important;

        place-items:
          center !important;

        width:
          78px !important;

        height:
          78px !important;

        border:
          1px solid
          currentColor !important;

        border-radius:
          22px !important;

        background:
          rgba(
            7,
            7,
            7,
            .74
          ) !important;

        pointer-events:
          none !important;

      }


      #manaV80Home
      .m1025-home-icon svg{

        width:
          54px !important;

        height:
          54px !important;

      }


      #manaV80Home
      [data-program="strength"]
      .m1025-home-icon{

        color:
          var(
            --m25-green
          ) !important;

      }


      #manaV80Home
      [data-program="life"]
      .m1025-home-icon{

        color:
          var(
            --m25-blue
          ) !important;

      }


      #manaV80Home
      [data-program="mana28"]
      .m1025-home-icon{

        color:
          var(
            --m25-yellow
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program
      > *:not(.m1025-home-icon){

        position:
          relative !important;

        z-index:
          3 !important;

      }


      #manaV80Home
      .mana-v8013-program p{

        max-width:
          68% !important;

      }


      /* =====================================
         HOME ACTIVE
         OUTLINE ONLY
         ===================================== */

      #manaV80Home
      [data-program="strength"].current{

        border-color:
          var(
            --m25-green
          ) !important;

        box-shadow:
          0
          0
          0
          1px
          rgba(
            85,
            217,
            139,
            .16
          ),
          0
          14px
          38px
          rgba(
            85,
            217,
            139,
            .15
          ) !important;

      }


      #manaV80Home
      [data-program="life"].current{

        border-color:
          var(
            --m25-blue
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
            .16
          ),
          0
          14px
          38px
          rgba(
            85,
            168,
            222,
            .15
          ) !important;

      }


      #manaV80Home
      [data-program="mana28"].current{

        border-color:
          var(
            --m25-yellow
          ) !important;

        box-shadow:
          0
          0
          0
          1px
          rgba(
            224,
            187,
            81,
            .16
          ),
          0
          14px
          38px
          rgba(
            224,
            187,
            81,
            .15
          ) !important;

      }


      #manaV80Home
      .mana-v8013-program.current::before{

        content:
          "" !important;

        position:
          absolute !important;

        top:
          0 !important;

        left:
          20px !important;

        right:
          20px !important;

        width:
          auto !important;

        height:
          2px !important;

        border-radius:
          999px !important;

      }


      #manaV80Home
      [data-program="strength"].current::before{

        background:
          linear-gradient(
            90deg,
            transparent,
            var(
              --m25-green
            ),
            transparent
          ) !important;

      }


      #manaV80Home
      [data-program="life"].current::before{

        background:
          linear-gradient(
            90deg,
            transparent,
            var(
              --m25-blue
            ),
            transparent
          ) !important;

      }


      #manaV80Home
      [data-program="mana28"].current::before{

        background:
          linear-gradient(
            90deg,
            transparent,
            var(
              --m25-yellow
            ),
            transparent
          ) !important;

      }


      #manaV80Home
      .mana-v8013-current-badge{

        background:
          #111 !important;

        color:
          #f3d875 !important;

        border:
          1px solid
          #67551d !important;

        box-shadow:
          none !important;

      }


      /* =====================================
         MANA STRENGTH OPTIONS
         IMPORTANT:
         TARGET ACTUAL OPTION GROUPS
         ===================================== */

      .mana-strength-options
      .mana-strength-option{

        position:
          relative !important;

        overflow:
          hidden !important;

        background:
          #101010 !important;

        color:
          #e9e9e9 !important;

        border:
          1px solid
          #333 !important;

        box-shadow:
          none !important;

      }


      /* 1 GREEN */

      .mana-strength-options
      .mana-strength-option:nth-child(1){

        border-color:
          rgba(
            85,
            217,
            139,
            .68
          ) !important;

      }


      /* 2 BLUE */

      .mana-strength-options
      .mana-strength-option:nth-child(2){

        border-color:
          rgba(
            85,
            168,
            222,
            .68
          ) !important;

      }


      /* 3 YELLOW */

      .mana-strength-options
      .mana-strength-option:nth-child(3){

        border-color:
          rgba(
            224,
            187,
            81,
            .70
          ) !important;

      }


      /* 4 PURPLE */

      .mana-strength-options
      .mana-strength-option:nth-child(4){

        border-color:
          rgba(
            166,
            129,
            220,
            .68
          ) !important;

      }


      /* 5 ORANGE */

      .mana-strength-options
      .mana-strength-option:nth-child(5){

        border-color:
          rgba(
            233,
            138,
            84,
            .68
          ) !important;

      }


      /* active remains DARK */

      .mana-strength-options
      .mana-strength-option.active{

        background:
          #121212 !important;

        color:
          #fff !important;

        transform:
          translateY(
            -1px
          ) !important;

      }


      .mana-strength-options
      .mana-strength-option:nth-child(1).active{

        border-color:
          var(
            --m25-green
          ) !important;

        box-shadow:
          0
          0
          0
          1px
          rgba(
            85,
            217,
            139,
            .18
          ),
          0
          7px
          20px
          rgba(
            85,
            217,
            139,
            .12
          ) !important;

      }


      .mana-strength-options
      .mana-strength-option:nth-child(2).active{

        border-color:
          var(
            --m25-blue
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
            .18
          ),
          0
          7px
          20px
          rgba(
            85,
            168,
            222,
            .12
          ) !important;

      }


      .mana-strength-options
      .mana-strength-option:nth-child(3).active{

        border-color:
          var(
            --m25-yellow
          ) !important;

        box-shadow:
          0
          0
          0
          1px
          rgba(
            224,
            187,
            81,
            .18
          ),
          0
          7px
          20px
          rgba(
            224,
            187,
            81,
            .12
          ) !important;

      }


      .mana-strength-options
      .mana-strength-option:nth-child(4).active{

        border-color:
          var(
            --m25-purple
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
            .18
          ),
          0
          7px
          20px
          rgba(
            166,
            129,
            220,
            .12
          ) !important;

      }


      .mana-strength-options
      .mana-strength-option:nth-child(5).active{

        border-color:
          var(
            --m25-orange
          ) !important;

        box-shadow:
          0
          0
          0
          1px
          rgba(
            233,
            138,
            84,
            .18
          ),
          0
          7px
          20px
          rgba(
            233,
            138,
            84,
            .12
          ) !important;

      }


      /* =====================================
         OVERVIEW CARDS
         GLOBAL POSITION SEQUENCE
         ===================================== */

      #manaV964Launchpad
      .mana-v964-launch,

      .mana-v978-launchpad
      .mana-v978-launch{

        background:
          linear-gradient(
            145deg,
            #141414,
            #090909
          ) !important;

        border-width:
          1px !important;

      }


      /* 1 GREEN */

      #manaV964Launchpad
      .mana-v964-launch:nth-child(1),

      .mana-v978-launchpad
      .mana-v978-launch:nth-child(1){

        border-color:
          rgba(
            85,
            217,
            139,
            .68
          ) !important;

      }


      /* 2 BLUE */

      #manaV964Launchpad
      .mana-v964-launch:nth-child(2),

      .mana-v978-launchpad
      .mana-v978-launch:nth-child(2){

        border-color:
          rgba(
            85,
            168,
            222,
            .68
          ) !important;

      }


      /* 3 YELLOW */

      #manaV964Launchpad
      .mana-v964-launch:nth-child(3),

      .mana-v978-launchpad
      .mana-v978-launch:nth-child(3){

        border-color:
          rgba(
            224,
            187,
            81,
            .70
          ) !important;

      }


      /* 4 PURPLE */

      #manaV964Launchpad
      .mana-v964-launch:nth-child(4),

      .mana-v978-launchpad
      .mana-v978-launch:nth-child(4){

        border-color:
          rgba(
            166,
            129,
            220,
            .68
          ) !important;

      }


      /* 5 ORANGE */

      #manaV964Launchpad
      .mana-v964-launch:nth-child(5),

      .mana-v978-launchpad
      .mana-v978-launch:nth-child(5){

        border-color:
          rgba(
            233,
            138,
            84,
            .68
          ) !important;

      }


      /* =====================================
         OVERVIEW ICON FRAMES
         ===================================== */

      #manaV964Launchpad
      .mana-v964-launch:nth-child(1)
      .mana-v964-icon,

      .mana-v978-launchpad
      .mana-v978-launch:nth-child(1)
      .mana-v978-icon{

        border-color:
          var(
            --m25-green
          ) !important;

      }


      #manaV964Launchpad
      .mana-v964-launch:nth-child(2)
      .mana-v964-icon,

      .mana-v978-launchpad
      .mana-v978-launch:nth-child(2)
      .mana-v978-icon{

        border-color:
          var(
            --m25-blue
          ) !important;

      }


      #manaV964Launchpad
      .mana-v964-launch:nth-child(3)
      .mana-v964-icon,

      .mana-v978-launchpad
      .mana-v978-launch:nth-child(3)
      .mana-v978-icon{

        border-color:
          var(
            --m25-yellow
          ) !important;

      }


      #manaV964Launchpad
      .mana-v964-launch:nth-child(4)
      .mana-v964-icon,

      .mana-v978-launchpad
      .mana-v978-launch:nth-child(4)
      .mana-v978-icon{

        border-color:
          var(
            --m25-purple
          ) !important;

      }


      /* =====================================
         STRENGTH WORKOUT BANNERS
         ===================================== */

      #manaV83Content
      .mana-v85-day{

        border-width:
          1px !important;

        background:
          linear-gradient(
            145deg,
            #131313,
            #090909
          ) !important;

      }


      #manaV83Content
      .mana-v85-day[
        data-m1025-tone="green"
      ]{

        border-color:
          var(
            --m25-green
          ) !important;

      }


      #manaV83Content
      .mana-v85-day[
        data-m1025-tone="blue"
      ]{

        border-color:
          var(
            --m25-blue
          ) !important;

      }


      #manaV83Content
      .mana-v85-day[
        data-m1025-tone="yellow"
      ]{

        border-color:
          var(
            --m25-yellow
          ) !important;

      }


      #manaV83Content
      .mana-v85-day[
        data-m1025-tone="purple"
      ]{

        border-color:
          var(
            --m25-purple
          ) !important;

      }


      #manaV83Content
      .mana-v85-day[
        data-m1025-tone="orange"
      ]{

        border-color:
          var(
            --m25-orange
          ) !important;

      }


      /* =====================================
         MANA 28 / LYFE WORKOUT BANNERS
         ===================================== */

      #manaV83Content
      .mana-v980-day{

        border-width:
          1px !important;

        background:
          linear-gradient(
            145deg,
            #131313,
            #090909
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="green"
      ]{

        border-color:
          var(
            --m25-green
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="blue"
      ]{

        border-color:
          var(
            --m25-blue
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="yellow"
      ]{

        border-color:
          var(
            --m25-yellow
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="purple"
      ]{

        border-color:
          var(
            --m25-purple
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="orange"
      ]{

        border-color:
          var(
            --m25-orange
          ) !important;

      }


      /* numbers */

      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="green"
      ]
      .mana-v980-number{

        color:
          var(
            --m25-green
          ) !important;

        border-color:
          var(
            --m25-green
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="blue"
      ]
      .mana-v980-number{

        color:
          var(
            --m25-blue
          ) !important;

        border-color:
          var(
            --m25-blue
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="yellow"
      ]
      .mana-v980-number{

        color:
          var(
            --m25-yellow
          ) !important;

        border-color:
          var(
            --m25-yellow
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="purple"
      ]
      .mana-v980-number{

        color:
          var(
            --m25-purple
          ) !important;

        border-color:
          var(
            --m25-purple
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="orange"
      ]
      .mana-v980-number{

        color:
          var(
            --m25-orange
          ) !important;

        border-color:
          var(
            --m25-orange
          ) !important;

      }


      /* =====================================
         BOTTOM TABS
         FIXED FUNCTION MAPPING
         ===================================== */

      #manaV83Tabs
      .mana-v83-tab{

        background:
          transparent !important;

        color:
          #858585 !important;

      }


      /* WORKOUT = GREEN */

      #manaV83Tabs
      [data-v83-tab="program"],

      #manaV83Tabs
      [data-v83-tab="routine"]{

        --m25-tab:
          var(
            --m25-green
          );

      }


      /* FUEL / RECLAIM = BLUE */

      #manaV83Tabs
      [data-v83-tab="fuel"],

      #manaV83Tabs
      [data-v83-tab="reclaim"]{

        --m25-tab:
          var(
            --m25-blue
          );

      }


      /* PROGRESS = YELLOW */

      #manaV83Tabs
      [data-v83-tab="progress"]{

        --m25-tab:
          var(
            --m25-yellow
          );

      }


      /* LEARN = PURPLE */

      #manaV83Tabs
      [data-v83-tab="learn"]{

        --m25-tab:
          var(
            --m25-purple
          );

      }


      #manaV83Tabs
      .mana-v83-tab:not(
        [data-v83-tab="overview"]
      ).active{

        color:
          var(
            --m25-tab
          ) !important;

        background:
          rgba(
            255,
            255,
            255,
            .025
          ) !important;

        box-shadow:
          inset
          0
          0
          0
          1px
          var(
            --m25-tab
          ) !important;

      }


      #manaV83Tabs
      .mana-v83-tab:not(
        [data-v83-tab="overview"]
      ).active::before{

        background:
          var(
            --m25-tab
          ) !important;

      }


      #manaV83Tabs
      .mana-v83-tab:not(
        [data-v83-tab="overview"]
      ).active
      .m10140-tab-icon{

        filter:
          saturate(1.15)
          brightness(1.08)
          drop-shadow(
            0
            0
            8px
            var(
              --m25-tab
            )
          ) !important;

      }


      /* =====================================
         PROGRESS = YELLOW
         ===================================== */

      #manaV993StrengthProgress{

        --m25-section:
          var(
            --m25-yellow
          );

      }


      #manaV993StrengthProgress
      .mana-v993-period.active,

      #manaV993StrengthProgress
      .mana-v993-detail-btn.active{

        border-color:
          var(
            --m25-yellow
          ) !important;

        color:
          var(
            --m25-yellow
          ) !important;

        background:
          #111 !important;

      }


      /* =====================================
         LEARNING = PURPLE
         ===================================== */

      #manaV83Content
      .mana-v985-head{

        border-bottom-color:
          rgba(
            166,
            129,
            220,
            .30
          ) !important;

      }


      #manaV83Content
      .mana-v985-head::after{

        background:
          linear-gradient(
            90deg,
            var(
              --m25-purple
            ),
            transparent
          ) !important;

      }


      #manaV83Content
      .mana-v985-kicker{

        color:
          var(
            --m25-purple
          ) !important;

      }


      #manaV83Content
      .mana-v985-learn-card{

        border-color:
          rgba(
            166,
            129,
            220,
            .42
          ) !important;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:600px){


        #manaV80Home
        .m1025-home-icon{

          right:
            9px !important;

          width:
            67px !important;

          height:
            67px !important;

          border-radius:
            18px !important;

        }


        #manaV80Home
        .m1025-home-icon svg{

          width:
            47px !important;

          height:
            47px !important;

        }


        #manaV80Home
        .mana-v8013-program p{

          max-width:
            67% !important;

        }


        .mana-strength-options
        .mana-strength-option{

          min-height:
            48px !important;

        }

      }


      @media(max-width:390px){


        #manaV80Home
        .m1025-home-icon{

          right:
            6px !important;

          width:
            60px !important;

          height:
            60px !important;

        }


        #manaV80Home
        .m1025-home-icon svg{

          width:
            42px !important;

          height:
            42px !important;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     HOME ICON
     ========================================= */

  function addHomeIcon(
    card,
    type
  ) {

    if (
      !card ||
      !HOME_ICONS[
        type
      ]
    ) {

      return;

    }


    let icon =
      card.querySelector(
        ".m1025-home-icon"
      );


    if (!icon) {

      icon =
        document.createElement(
          "div"
        );


      icon.className =
        "m1025-home-icon";


      card.appendChild(
        icon
      );

    }


    icon.innerHTML =
      HOME_ICONS[
        type
      ];

  }


  /* =========================================
     HOME
     ========================================= */

  function decorateHome() {

    const home =
      document.getElementById(
        "manaV80Home"
      );


    if (!home) {

      return;

    }


    const strength =
      home.querySelector(
        '[data-program="strength"]'
      );


    const lyfe =
      home.querySelector(
        '[data-program="life"]'
      );


    const mana28 =
      home.querySelector(
        '[data-program="mana28"]'
      );


    /*
      ORDER
      STRENGTH
      LYFE
      MANA28
    */

    if (
      strength &&
      lyfe &&
      mana28
    ) {

      const parent =
        strength.parentElement;


      if (parent) {

        parent.insertBefore(
          strength,
          lyfe
        );


        parent.insertBefore(
          lyfe,
          mana28
        );

      }

    }


    addHomeIcon(
      strength,
      "strength"
    );


    addHomeIcon(
      lyfe,
      "lyfe"
    );


    addHomeIcon(
      mana28,
      "mana28"
    );

  }


  /* =========================================
     STRENGTH OPTIONS
     ========================================= */

  function decorateStrengthOptions() {

    document
      .querySelectorAll(
        ".mana-strength-options"
      )
      .forEach(
        group => {

          group
            .querySelectorAll(
              ".mana-strength-option"
            )
            .forEach(
              (
                option,
                index
              ) => {

                option.dataset
                  .m1025Tone =
                  SEQUENCE[
                    index %
                    SEQUENCE.length
                  ];

              }
            );

        }
      );

  }


  /* =========================================
     OVERVIEWS
     ========================================= */

  function decorateOverviews() {

    document
      .querySelectorAll(
        "#manaV964Launchpad .mana-v964-launch"
      )
      .forEach(
        (
          card,
          index
        ) => {

          card.dataset
            .m1025Tone =
            SEQUENCE[
              index %
              SEQUENCE.length
            ];

        }
      );


    document
      .querySelectorAll(
        ".mana-v978-launchpad .mana-v978-launch"
      )
      .forEach(
        (
          card,
          index
        ) => {

          card.dataset
            .m1025Tone =
            SEQUENCE[
              index %
              SEQUENCE.length
            ];

        }
      );

  }


  /* =========================================
     WORKOUTS
     ========================================= */

  function decorateWorkouts() {

    document
      .querySelectorAll(
        "#manaV83Content .mana-v85-day"
      )
      .forEach(
        (
          card,
          index
        ) => {

          card.dataset
            .m1025Tone =
            SEQUENCE[
              index %
              SEQUENCE.length
            ];

        }
      );


    document
      .querySelectorAll(
        "#manaV83Content .mana-v980-day"
      )
      .forEach(
        (
          card,
          index
        ) => {

          card.dataset
            .m1025Tone =
            SEQUENCE[
              index %
              SEQUENCE.length
            ];

        }
      );

  }


  /* =========================================
     REFRESH
     ========================================= */

  function refresh() {

    decorateHome();

    decorateStrengthOptions();

    decorateOverviews();

    decorateWorkouts();

  }


  /* =========================================
     SHORT SETTLE REFRESH
     ========================================= */

  function settleRefresh() {

    refresh();


    /*
      Existing app screens sometimes rebuild
      immediately after navigation.

      These are short one-off refreshes only.
      No continuous timer.
    */

    [
      60,
      180,
      420,
      850
    ]
      .forEach(
        delay => {

          setTimeout(
            refresh,
            delay
          );

        }
      );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    settleRefresh();


    [
      "mana:program-tab-change",
      "mana:workout-progress-change",
      "mana:profile-synced",
      "mana:program-change",
      "mana:fuel-updated"
    ]
      .forEach(
        eventName => {

          document.addEventListener(
            eventName,
            settleRefresh
          );

        }
      );


    /*
      Selection/navigation interactions
    */

    document.addEventListener(
      "click",
      event => {

        const target =
          event.target.closest(
            `
              .mana-strength-option,
              [data-program],
              [data-v83-tab],
              [data-v964-launch],
              [data-v978-tab],
              .mana-v85-day,
              .mana-v980-day
            `
          );


        if (!target) {

          return;

        }


        requestAnimationFrame(
          settleRefresh
        );

      }
    );


    /*
      App / browser return
    */

    window.addEventListener(
      "pageshow",
      settleRefresh
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          settleRefresh();

        }

      }
    );


    window
      .refreshManaMasterVisualSystem =
        settleRefresh;


    window
      .MANA_MASTER_VISUAL_BUILD =
        BUILD;


    console.log(
      "Mana Master Visual System",
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
