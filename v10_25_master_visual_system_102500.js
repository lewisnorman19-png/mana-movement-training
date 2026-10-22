/* =========================================
   MANA MOVEMENT TRAINING v10.25
   MASTER PREMIUM VISUAL SYSTEM

   BUILD: 102500

   CORE COLOUR SEQUENCE
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

   PROGRAM FUNCTION COLOURS
   -----------------------------------------
   WORKOUTS = GREEN
   FUEL / RECLAIM = BLUE
   PROGRESS = YELLOW
   LEARNING = PURPLE

   WORKOUT SEQUENCE
   -----------------------------------------
   Workout 1 = Green
   Workout 2 = Blue
   Workout 3 = Yellow
   Workout 4 = Purple
   Workout 5 = Orange
   then repeat

   IMPORTANT
   -----------------------------------------
   - Original Mana text colours remain
   - Dark premium background remains
   - NO solid coloured selected cards
   - Colour = outline / accent / icon / glow
   - No MutationObserver
   - No render loops
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "102500";


  const STYLE_ID =
    "mana-v1025-master-visual-system";


  const COLOURS = {

    green:{
      main:"#55d98b",
      soft:"rgba(85,217,139,.52)",
      glow:"rgba(85,217,139,.11)",
      bg:"#101713"
    },

    blue:{
      main:"#55a8de",
      soft:"rgba(85,168,222,.52)",
      glow:"rgba(85,168,222,.11)",
      bg:"#10161a"
    },

    yellow:{
      main:"#e0bb51",
      soft:"rgba(224,187,81,.55)",
      glow:"rgba(224,187,81,.11)",
      bg:"#17150d"
    },

    purple:{
      main:"#a681dc",
      soft:"rgba(166,129,220,.52)",
      glow:"rgba(166,129,220,.11)",
      bg:"#15111a"
    },

    orange:{
      main:"#e98a54",
      soft:"rgba(233,138,84,.52)",
      glow:"rgba(233,138,84,.11)",
      bg:"#19120e"
    }

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

      <svg
        viewBox="0 0 90 90"
        aria-hidden="true"
      >

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
          x="15"
          y="31"
          width="8"
          height="28"
          rx="3"
          fill="currentColor"
        />

        <rect
          x="25"
          y="35"
          width="6"
          height="20"
          rx="2"
          fill="currentColor"
        />

        <rect
          x="59"
          y="35"
          width="6"
          height="20"
          rx="2"
          fill="currentColor"
        />

        <rect
          x="67"
          y="31"
          width="8"
          height="28"
          rx="3"
          fill="currentColor"
        />

      </svg>

    `,


    lyfe:`

      <svg
        viewBox="0 0 90 90"
        aria-hidden="true"
      >

        <path
          d="
            M45 72
            C45 56 48 45 58 34
          "
          fill="none"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
        />

        <path
          d="
            M56 36
            C63 22 76 21 82 26
            C79 39 69 46 57 44
          "
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linejoin="round"
        />

        <path
          d="
            M42 49
            C36 36 24 33 15 38
            C19 51 29 58 43 56
          "
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linejoin="round"
        />

      </svg>

    `,


    mana28:`

      <svg
        viewBox="0 0 90 90"
        aria-hidden="true"
      >

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
         GLOBAL COLOUR VARIABLES
         ===================================== */

      :root{

        --m25-green:
          ${COLOURS.green.main};

        --m25-blue:
          ${COLOURS.blue.main};

        --m25-yellow:
          ${COLOURS.yellow.main};

        --m25-purple:
          ${COLOURS.purple.main};

        --m25-orange:
          ${COLOURS.orange.main};

      }


      /* =====================================
         ORIGINAL MANA TYPOGRAPHY COLOURS
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
         HOME — COMMON CARD
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


      /* Kill old solid yellow active state */

      #manaV80Home
      .mana-v8013-program.current{

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


      /* =====================================
         HOME — SMALL PROGRAM ICON
         ===================================== */

      #manaV80Home
      .m1025-home-icon{

        position:
          absolute !important;

        z-index:
          2 !important;

        right:
          22px !important;

        top:
          50% !important;

        transform:
          translateY(-50%) !important;

        display:
          grid !important;

        place-items:
          center !important;

        width:
          82px !important;

        height:
          82px !important;

        border:
          1px solid
          currentColor !important;

        border-radius:
          24px !important;

        background:
          rgba(
            6,
            6,
            6,
            .72
          ) !important;

        opacity:
          .90 !important;

        pointer-events:
          none !important;

      }


      #manaV80Home
      .m1025-home-icon svg{

        width:
          58px !important;

        height:
          58px !important;

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
         HOME — STRENGTH GREEN
         ===================================== */

      #manaV80Home
      [data-program="strength"]{

        border-color:
          rgba(
            85,
            217,
            139,
            .60
          ) !important;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              85,
              217,
              139,
              .10
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


      #manaV80Home
      [data-program="strength"]
      .m1025-home-icon{

        color:
          var(
            --m25-green
          ) !important;

        box-shadow:
          0
          0
          24px
          rgba(
            85,
            217,
            139,
            .11
          ) !important;

      }


      /* =====================================
         HOME — LYFE BLUE
         ===================================== */

      #manaV80Home
      [data-program="life"]{

        border-color:
          rgba(
            85,
            168,
            222,
            .60
          ) !important;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              85,
              168,
              222,
              .10
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


      #manaV80Home
      [data-program="life"]
      .m1025-home-icon{

        color:
          var(
            --m25-blue
          ) !important;

        box-shadow:
          0
          0
          24px
          rgba(
            85,
            168,
            222,
            .11
          ) !important;

      }


      /* =====================================
         HOME — MANA 28 YELLOW
         ===================================== */

      #manaV80Home
      [data-program="mana28"]{

        border-color:
          rgba(
            224,
            187,
            81,
            .64
          ) !important;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              224,
              187,
              81,
              .11
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


      #manaV80Home
      [data-program="mana28"]
      .m1025-home-icon{

        color:
          var(
            --m25-yellow
          ) !important;

        box-shadow:
          0
          0
          24px
          rgba(
            224,
            187,
            81,
            .12
          ) !important;

      }


      /* =====================================
         HOME — ACTIVE

         STRONGER OUTLINE ONLY
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


      /* Kill old large top selected bar */

      #manaV80Home
      .mana-v8013-program.current::before{

        content:
          "" !important;

        position:
          absolute !important;

        top:
          0 !important;

        left:
          24px !important;

        right:
          24px !important;

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


      /* Active badge stays Mana gold */

      #manaV80Home
      .mana-v8013-current-badge{

        background:
          #111 !important;

        border:
          1px solid
          #67551d !important;

        color:
          #f3d875 !important;

        box-shadow:
          none !important;

      }


      /* =====================================
         STRENGTH SETUP OPTIONS

         GREEN → BLUE → YELLOW → PURPLE
         ===================================== */

      #manaStrengthModal
      .mana-strength-option{

        position:
          relative !important;

        overflow:
          hidden !important;

        background:
          #101010 !important;

        color:
          #e8e8e8 !important;

        border-width:
          1px !important;

      }


      #manaStrengthModal
      [data-strength-group]
      .mana-strength-option:nth-child(1){

        border-color:
          rgba(
            85,
            217,
            139,
            .55
          ) !important;

      }


      #manaStrengthModal
      [data-strength-group]
      .mana-strength-option:nth-child(2){

        border-color:
          rgba(
            85,
            168,
            222,
            .55
          ) !important;

      }


      #manaStrengthModal
      [data-strength-group]
      .mana-strength-option:nth-child(3){

        border-color:
          rgba(
            224,
            187,
            81,
            .58
          ) !important;

      }


      #manaStrengthModal
      [data-strength-group]
      .mana-strength-option:nth-child(4){

        border-color:
          rgba(
            166,
            129,
            220,
            .55
          ) !important;

      }


      #manaStrengthModal
      [data-strength-group]
      .mana-strength-option:nth-child(5){

        border-color:
          rgba(
            233,
            138,
            84,
            .55
          ) !important;

      }


      #manaStrengthModal
      [data-strength-group]
      .mana-strength-option.active{

        background:
          #111 !important;

        color:
          #fff !important;

        box-shadow:
          0
          0
          0
          1px
          currentColor,
          0
          8px
          22px
          rgba(
            0,
            0,
            0,
            .30
          ) !important;

      }


      #manaStrengthModal
      [data-strength-group]
      .mana-strength-option:nth-child(1).active{

        color:
          var(
            --m25-green
          ) !important;

      }


      #manaStrengthModal
      [data-strength-group]
      .mana-strength-option:nth-child(2).active{

        color:
          var(
            --m25-blue
          ) !important;

      }


      #manaStrengthModal
      [data-strength-group]
      .mana-strength-option:nth-child(3).active{

        color:
          var(
            --m25-yellow
          ) !important;

      }


      #manaStrengthModal
      [data-strength-group]
      .mana-strength-option:nth-child(4).active{

        color:
          var(
            --m25-purple
          ) !important;

      }


      /* =====================================
         OVERVIEW CARDS
         ALL PROGRAMS
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

        color:
          #fff !important;

        border-width:
          1px !important;

      }


      /* Strength overview sequence */

      #manaV964Launchpad
      .mana-v964-launch:nth-child(1){

        border-color:
          rgba(
            85,
            217,
            139,
            .56
          ) !important;

      }


      #manaV964Launchpad
      .mana-v964-launch:nth-child(2){

        border-color:
          rgba(
            85,
            168,
            222,
            .56
          ) !important;

      }


      #manaV964Launchpad
      .mana-v964-launch:nth-child(3){

        border-color:
          rgba(
            224,
            187,
            81,
            .60
          ) !important;

      }


      #manaV964Launchpad
      .mana-v964-launch:nth-child(4){

        border-color:
          rgba(
            166,
            129,
            220,
            .56
          ) !important;

      }


      /* Mana28 / Lyfe overview sequence */

      .mana-v978-launchpad
      .mana-v978-launch:nth-child(1){

        border-color:
          rgba(
            85,
            217,
            139,
            .56
          ) !important;

      }


      .mana-v978-launchpad
      .mana-v978-launch:nth-child(2){

        border-color:
          rgba(
            85,
            168,
            222,
            .56
          ) !important;

      }


      .mana-v978-launchpad
      .mana-v978-launch:nth-child(3){

        border-color:
          rgba(
            224,
            187,
            81,
            .60
          ) !important;

      }


      .mana-v978-launchpad
      .mana-v978-launch:nth-child(4){

        border-color:
          rgba(
            166,
            129,
            220,
            .56
          ) !important;

      }


      .mana-v978-launchpad
      .mana-v978-launch:nth-child(5){

        border-color:
          rgba(
            233,
            138,
            84,
            .56
          ) !important;

      }


      /* Keep overview text normal */

      #manaV964Launchpad
      .mana-v964-title,

      .mana-v978-launchpad
      .mana-v978-title{

        color:
          #fff !important;

      }


      #manaV964Launchpad
      .mana-v964-text,

      .mana-v978-launchpad
      .mana-v978-text{

        color:
          #999 !important;

      }


      /* =====================================
         OVERVIEW ICON COLOURS
         ===================================== */

      #manaV964Launchpad
      .mana-v964-launch:nth-child(1)
      .mana-v964-icon,

      .mana-v978-launchpad
      .mana-v978-launch:nth-child(1)
      .mana-v978-icon{

        border-color:
          rgba(
            85,
            217,
            139,
            .60
          ) !important;

        box-shadow:
          0
          0
          18px
          rgba(
            85,
            217,
            139,
            .10
          ) !important;

      }


      #manaV964Launchpad
      .mana-v964-launch:nth-child(2)
      .mana-v964-icon,

      .mana-v978-launchpad
      .mana-v978-launch:nth-child(2)
      .mana-v978-icon{

        border-color:
          rgba(
            85,
            168,
            222,
            .60
          ) !important;

        box-shadow:
          0
          0
          18px
          rgba(
            85,
            168,
            222,
            .10
          ) !important;

      }


      #manaV964Launchpad
      .mana-v964-launch:nth-child(3)
      .mana-v964-icon,

      .mana-v978-launchpad
      .mana-v978-launch:nth-child(3)
      .mana-v978-icon{

        border-color:
          rgba(
            224,
            187,
            81,
            .62
          ) !important;

        box-shadow:
          0
          0
          18px
          rgba(
            224,
            187,
            81,
            .10
          ) !important;

      }


      #manaV964Launchpad
      .mana-v964-launch:nth-child(4)
      .mana-v964-icon,

      .mana-v978-launchpad
      .mana-v978-launch:nth-child(4)
      .mana-v978-icon{

        border-color:
          rgba(
            166,
            129,
            220,
            .60
          ) !important;

        box-shadow:
          0
          0
          18px
          rgba(
            166,
            129,
            220,
            .10
          ) !important;

      }


      /* =====================================
         STRENGTH WORKOUT CARDS
         ===================================== */

      #manaV83Content
      .mana-v85-day{

        background:
          linear-gradient(
            145deg,
            #131313,
            #090909
          ) !important;

        border-width:
          1px !important;

      }


      #manaV83Content
      .mana-v85-day[
        data-m1025-tone="green"
      ]{

        border-color:
          rgba(
            85,
            217,
            139,
            .60
          ) !important;

      }


      #manaV83Content
      .mana-v85-day[
        data-m1025-tone="blue"
      ]{

        border-color:
          rgba(
            85,
            168,
            222,
            .60
          ) !important;

      }


      #manaV83Content
      .mana-v85-day[
        data-m1025-tone="yellow"
      ]{

        border-color:
          rgba(
            224,
            187,
            81,
            .62
          ) !important;

      }


      #manaV83Content
      .mana-v85-day[
        data-m1025-tone="purple"
      ]{

        border-color:
          rgba(
            166,
            129,
            220,
            .60
          ) !important;

      }


      #manaV83Content
      .mana-v85-day[
        data-m1025-tone="orange"
      ]{

        border-color:
          rgba(
            233,
            138,
            84,
            .60
          ) !important;

      }


      /* =====================================
         MANA 28 + LYFE WORKOUT CARDS
         ===================================== */

      #manaV83Content
      .mana-v980-day{

        background:
          linear-gradient(
            145deg,
            #131313,
            #090909
          ) !important;

        border-width:
          1px !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="green"
      ]{

        border-color:
          rgba(
            85,
            217,
            139,
            .60
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="blue"
      ]{

        border-color:
          rgba(
            85,
            168,
            222,
            .60
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="yellow"
      ]{

        border-color:
          rgba(
            224,
            187,
            81,
            .62
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="purple"
      ]{

        border-color:
          rgba(
            166,
            129,
            220,
            .60
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="orange"
      ]{

        border-color:
          rgba(
            233,
            138,
            84,
            .60
          ) !important;

      }


      /* Coloured workout number/icon */

      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="green"
      ]
      .mana-v980-number{

        border-color:
          var(
            --m25-green
          ) !important;

        color:
          var(
            --m25-green
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="blue"
      ]
      .mana-v980-number{

        border-color:
          var(
            --m25-blue
          ) !important;

        color:
          var(
            --m25-blue
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="yellow"
      ]
      .mana-v980-number{

        border-color:
          var(
            --m25-yellow
          ) !important;

        color:
          var(
            --m25-yellow
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="purple"
      ]
      .mana-v980-number{

        border-color:
          var(
            --m25-purple
          ) !important;

        color:
          var(
            --m25-purple
          ) !important;

      }


      #manaV83Content
      .mana-v980-day[
        data-m1025-tone="orange"
      ]
      .mana-v980-number{

        border-color:
          var(
            --m25-orange
          ) !important;

        color:
          var(
            --m25-orange
          ) !important;

      }


      /* =====================================
         BOTTOM PROGRAM TABS

         OVERVIEW = neutral
         WORKOUTS = GREEN
         FUEL/RECLAIM = BLUE
         PROGRESS = YELLOW
         LEARNING = PURPLE
         ===================================== */

      #manaV83Tabs
      .mana-v83-tab{

        background:
          transparent !important;

        color:
          #858585 !important;

      }


      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="program"
      ],

      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="routine"
      ]{

        --m25-tab-colour:
          var(
            --m25-green
          );

      }


      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="fuel"
      ],

      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="reclaim"
      ]{

        --m25-tab-colour:
          var(
            --m25-blue
          );

      }


      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="progress"
      ]{

        --m25-tab-colour:
          var(
            --m25-yellow
          );

      }


      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="learn"
      ]{

        --m25-tab-colour:
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
            --m25-tab-colour
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
            --m25-tab-colour
          ),
          0
          0
          20px
          rgba(
            0,
            0,
            0,
            .15
          ) !important;

      }


      #manaV83Tabs
      .mana-v83-tab:not(
        [data-v83-tab="overview"]
      ).active::before{

        background:
          var(
            --m25-tab-colour
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
              --m25-tab-colour
            )
          ) !important;

      }


      /* =====================================
         FUNCTION PAGE IDENTITY

         WORKOUT = GREEN
         FUEL = BLUE
         PROGRESS = YELLOW
         LEARNING = PURPLE
         ===================================== */

      #manaV83Content
      #manaV993StrengthProgress,

      #manaV83Content
      .mana-v981-root{

        --m25-page-accent:
          var(
            --m25-yellow
          );

      }


      #manaV83Content
      #manaV993StrengthProgress
      h2,

      #manaV83Content
      .mana-v981-root h2{

        text-shadow:
          0
          0
          22px
          rgba(
            224,
            187,
            81,
            .08
          );

      }


      #manaV83Content
      .mana-v985-learn{

        --m25-page-accent:
          var(
            --m25-purple
          );

      }


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


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:600px){


        #manaV80Home
        .m1025-home-icon{

          right:
            10px !important;

          width:
            68px !important;

          height:
            68px !important;

          border-radius:
            19px !important;

        }


        #manaV80Home
        .m1025-home-icon svg{

          width:
            48px !important;

          height:
            48px !important;

        }


        #manaV80Home
        .mana-v8013-program p{

          max-width:
            67% !important;

        }


        #manaV80Home
        .mana-v8013-program.current::before{

          left:
            16px !important;

          right:
            16px !important;

        }


        #manaStrengthModal
        .mana-strength-option{

          min-height:
            48px !important;

        }

      }


      @media(max-width:390px){


        #manaV80Home
        .m1025-home-icon{

          right:
            7px !important;

          width:
            61px !important;

          height:
            61px !important;

        }


        #manaV80Home
        .m1025-home-icon svg{

          width:
            43px !important;

          height:
            43px !important;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     HOME
     ========================================= */

  function homeIcon(
    card,
    type
  ) {

    if (
      !card ||
      !HOME_ICONS[type]
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
      HOME_ICONS[type];

  }


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
      HOME ORDER
      1. MANA STRENGTH
      2. MANA LYFE
      3. MANA 28
    */

    const select =
      home.querySelector(
        ".mana-v8013-select"
      );


    if (
      select &&
      strength &&
      lyfe &&
      mana28
    ) {

      select.insertAdjacentElement(
        "afterend",
        mana28
      );


      select.insertAdjacentElement(
        "afterend",
        lyfe
      );


      select.insertAdjacentElement(
        "afterend",
        strength
      );

    }


    homeIcon(
      strength,
      "strength"
    );


    homeIcon(
      lyfe,
      "lyfe"
    );


    homeIcon(
      mana28,
      "mana28"
    );

  }


  /* =========================================
     WORKOUT COLOUR SEQUENCE
     ========================================= */

  function colourWorkoutCards() {

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
     OVERVIEW CARD SEQUENCE
     ========================================= */

  function colourOverviewCards() {

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
     STRENGTH OPTIONS
     ========================================= */

  function colourStrengthOptions() {

    document
      .querySelectorAll(
        "#manaStrengthModal [data-strength-group]"
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
     REFRESH
     ========================================= */

  function refresh() {

    decorateHome();

    colourStrengthOptions();

    colourOverviewCards();

    colourWorkoutCards();

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    refresh();


    /*
      Refresh only when existing app events
      tell us the screen has changed.
    */

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
            () => {

              requestAnimationFrame(
                refresh
              );

            }
          );

        }
      );


    /*
      Home/program shells can be opened by
      normal click handlers without firing
      every event immediately.
    */

    document.addEventListener(
      "click",
      event => {

        const target =
          event.target.closest(
            `
              [data-program],
              [data-v83-tab],
              .mana-strength-option,
              [data-v964-launch],
              [data-v978-tab]
            `
          );


        if (!target) {
          return;
        }


        requestAnimationFrame(
          () => {

            requestAnimationFrame(
              refresh
            );

          }
        );

      }
    );


    window
      .refreshManaMasterVisualSystem =
        refresh;


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
