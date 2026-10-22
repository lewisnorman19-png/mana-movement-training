/* =========================================
   MANA MOVEMENT TRAINING v10.25.3
   MASTER PREMIUM VISUAL SYSTEM

   BUILD: 102530

   GLOBAL SEQUENCE
   -----------------------------------------
   1 = GREEN
   2 = BLUE
   3 = YELLOW
   4 = PURPLE
   5 = ORANGE

   USED EVERYWHERE
   -----------------------------------------
   - Home programs
   - Choose Your Plan
   - Mana Strength setup
   - All Overview cards
   - Workout cards
   - Bottom tabs
   - Overview + Reclaim icons
   - Progress / Learning accents

   RULES
   -----------------------------------------
   - Keep original Mana text colours
   - Dark cards stay dark
   - Colour = outline / icon / accent / glow
   - Inactive tabs KEEP coloured outline
   - Active tabs get stronger highlight
   - No permanent MutationObserver
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "102530";


  const STYLE_ID =
    "mana-v10253-master-visual-system";


  const SEQUENCE =
    [
      "green",
      "blue",
      "yellow",
      "purple",
      "orange"
    ];


  /* =========================================
     ICONS
     ========================================= */

  const ICONS = {


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

    `,


    overview:`

      <svg viewBox="0 0 64 64" aria-hidden="true">

        <rect
          x="10"
          y="10"
          width="18"
          height="18"
          rx="4"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
        />

        <rect
          x="36"
          y="10"
          width="18"
          height="18"
          rx="4"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
        />

        <rect
          x="10"
          y="36"
          width="18"
          height="18"
          rx="4"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
        />

        <rect
          x="36"
          y="36"
          width="18"
          height="18"
          rx="4"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
        />

      </svg>

    `,


    reclaim:`

      <svg viewBox="0 0 64 64" aria-hidden="true">

        <path
          d="
            M18 25
            C22 14 36 10 47 17
            C56 23 58 37 51 47
            C44 57 29 59 19 51
          "
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
        />

        <path
          d="
            M18 14
            L18 27
            L31 27
          "
          fill="none"
          stroke="currentColor"
          stroke-width="4"
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


      :root{

        --m25-green:#55d98b;
        --m25-blue:#55a8de;
        --m25-yellow:#e0bb51;
        --m25-purple:#a681dc;
        --m25-orange:#e98a54;

      }


      /* =====================================
         GLOBAL TONE ATTRIBUTES
         ===================================== */

      [data-m1025-tone="green"]{

        --m25-current:
          var(--m25-green);

      }


      [data-m1025-tone="blue"]{

        --m25-current:
          var(--m25-blue);

      }


      [data-m1025-tone="yellow"]{

        --m25-current:
          var(--m25-yellow);

      }


      [data-m1025-tone="purple"]{

        --m25-current:
          var(--m25-purple);

      }


      [data-m1025-tone="orange"]{

        --m25-current:
          var(--m25-orange);

      }


      /* =====================================
         HOME
         ===================================== */

      #manaV80Home
      .mana-v8013-program{

        position:relative !important;

        isolation:isolate !important;

        overflow:hidden !important;

        border-width:1px !important;

        background:
          linear-gradient(
            145deg,
            #151515,
            #080808
          ) !important;

        color:#fff !important;

      }


      /* Original text colours */

      #manaV80Home
      .mana-v8013-program-label{

        color:#f3d875 !important;

      }


      #manaV80Home
      .mana-v8013-program h2{

        color:#fff !important;

      }


      #manaV80Home
      .mana-v8013-program p{

        color:#aaa !important;

        max-width:68% !important;

      }


      #manaV80Home
      .mana-v8013-open{

        color:#f3d875 !important;

      }


      #manaV80Home
      .mana-v8013-price strong{

        color:#f3d875 !important;

      }


      #manaV80Home
      .mana-v8013-free-note{

        color:#d9c36d !important;

      }


      /* Strength green */

      #manaV80Home
      [data-program="strength"]{

        border-color:
          rgba(
            85,
            217,
            139,
            .72
          ) !important;

      }


      /* Lyfe blue */

      #manaV80Home
      [data-program="life"]{

        border-color:
          rgba(
            85,
            168,
            222,
            .72
          ) !important;

      }


      /* Mana28 yellow */

      #manaV80Home
      [data-program="mana28"]{

        border-color:
          rgba(
            224,
            187,
            81,
            .75
          ) !important;

      }


      /* Remove old solid selected state */

      #manaV80Home
      .mana-v8013-program.current{

        background:
          linear-gradient(
            145deg,
            #151515,
            #080808
          ) !important;

        color:#fff !important;

        border-width:1px !important;

      }


      #manaV80Home
      [data-program="strength"].current{

        border-color:
          var(--m25-green) !important;

        box-shadow:
          0 0 0 1px
          rgba(85,217,139,.18),
          0 14px 38px
          rgba(85,217,139,.14) !important;

      }


      #manaV80Home
      [data-program="life"].current{

        border-color:
          var(--m25-blue) !important;

        box-shadow:
          0 0 0 1px
          rgba(85,168,222,.18),
          0 14px 38px
          rgba(85,168,222,.14) !important;

      }


      #manaV80Home
      [data-program="mana28"].current{

        border-color:
          var(--m25-yellow) !important;

        box-shadow:
          0 0 0 1px
          rgba(224,187,81,.18),
          0 14px 38px
          rgba(224,187,81,.14) !important;

      }


      #manaV80Home
      .mana-v8013-current-badge{

        background:#111 !important;

        color:#f3d875 !important;

        border:
          1px solid #67551d !important;

      }


      /* Home icon */

      .m1025-home-icon{

        position:absolute !important;

        z-index:2 !important;

        right:20px !important;

        top:50% !important;

        transform:
          translateY(-50%) !important;

        width:76px !important;

        height:76px !important;

        display:grid !important;

        place-items:center !important;

        border:
          1px solid currentColor !important;

        border-radius:21px !important;

        background:
          rgba(6,6,6,.74) !important;

        pointer-events:none !important;

      }


      .m1025-home-icon svg{

        width:52px !important;

        height:52px !important;

      }


      [data-program="strength"]
      .m1025-home-icon{

        color:
          var(--m25-green) !important;

      }


      [data-program="life"]
      .m1025-home-icon{

        color:
          var(--m25-blue) !important;

      }


      [data-program="mana28"]
      .m1025-home-icon{

        color:
          var(--m25-yellow) !important;

      }


      /* =====================================
         CHOOSE YOUR PLAN
         GREEN → BLUE → YELLOW
         ===================================== */

      #manaV98Membership
      .mana-v981-plan{

        background:
          linear-gradient(
            145deg,
            #121212,
            #080808
          ) !important;

        border-width:
          1px !important;

        box-shadow:none !important;

      }


      #manaV98Membership
      .mana-v981-plan:nth-child(1){

        border-color:
          rgba(
            85,
            217,
            139,
            .72
          ) !important;

      }


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

        background:
          linear-gradient(
            145deg,
            #101419,
            #080808
          ) !important;

      }


      #manaV98Membership
      .mana-v981-plan:nth-child(3){

        border-color:
          rgba(
            224,
            187,
            81,
            .76
          ) !important;

      }


      /* Plan text remains Mana colours */

      #manaV98Membership
      .mana-v981-plan-label{

        color:#f3d875 !important;

      }


      #manaV98Membership
      .mana-v981-plan h2{

        color:#fff !important;

      }


      #manaV98Membership
      .mana-v981-description{

        color:#999 !important;

      }


      #manaV98Membership
      .mana-v981-price strong{

        color:#f3d875 !important;

      }


      /* Buttons get matching outline */

      #manaV98Membership
      .mana-v981-plan:nth-child(1)
      .mana-v981-button{

        border:
          1px solid
          var(--m25-green) !important;

        background:#101010 !important;

        color:#fff !important;

      }


      #manaV98Membership
      .mana-v981-plan:nth-child(2)
      .mana-v981-button{

        border:
          1px solid
          var(--m25-blue) !important;

        background:#101010 !important;

        color:#fff !important;

      }


      #manaV98Membership
      .mana-v981-plan:nth-child(3)
      .mana-v981-button{

        border:
          1px solid
          var(--m25-yellow) !important;

        background:#101010 !important;

        color:#fff !important;

      }


      #manaV98Membership
      .mana-v981-popular{

        background:#111 !important;

        color:
          var(--m25-blue) !important;

        border:
          1px solid
          var(--m25-blue) !important;

      }


      /* =====================================
         STRENGTH SETUP OPTIONS
         ===================================== */

      .mana-strength-options
      .mana-strength-option{

        background:#101010 !important;

        color:#e9e9e9 !important;

        border-width:1px !important;

        box-shadow:none !important;

      }


      .mana-strength-options
      .mana-strength-option:nth-child(1){

        border-color:
          var(--m25-green) !important;

      }


      .mana-strength-options
      .mana-strength-option:nth-child(2){

        border-color:
          var(--m25-blue) !important;

      }


      .mana-strength-options
      .mana-strength-option:nth-child(3){

        border-color:
          var(--m25-yellow) !important;

      }


      .mana-strength-options
      .mana-strength-option:nth-child(4){

        border-color:
          var(--m25-purple) !important;

      }


      .mana-strength-options
      .mana-strength-option:nth-child(5){

        border-color:
          var(--m25-orange) !important;

      }


      .mana-strength-options
      .mana-strength-option.active{

        background:#131313 !important;

        color:#fff !important;

      }


      .mana-strength-options
      .mana-strength-option:nth-child(1).active{

        box-shadow:
          0 0 0 1px
          var(--m25-green),
          0 0 18px
          rgba(85,217,139,.14) !important;

      }


      .mana-strength-options
      .mana-strength-option:nth-child(2).active{

        box-shadow:
          0 0 0 1px
          var(--m25-blue),
          0 0 18px
          rgba(85,168,222,.14) !important;

      }


      .mana-strength-options
      .mana-strength-option:nth-child(3).active{

        box-shadow:
          0 0 0 1px
          var(--m25-yellow),
          0 0 18px
          rgba(224,187,81,.14) !important;

      }


      .mana-strength-options
      .mana-strength-option:nth-child(4).active{

        box-shadow:
          0 0 0 1px
          var(--m25-purple),
          0 0 18px
          rgba(166,129,220,.14) !important;

      }


      /* =====================================
         ALL OVERVIEW CARDS

         1 GREEN
         2 BLUE
         3 YELLOW
         4 PURPLE
         5 ORANGE
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

        border:
          1px solid
          var(--m25-current) !important;

        box-shadow:
          0 10px 26px
          rgba(
            0,
            0,
            0,
            .20
          ) !important;

      }


      #manaV964Launchpad
      .mana-v964-launch::before,

      .mana-v978-launchpad
      .mana-v978-launch::before{

        background:
          linear-gradient(
            90deg,
            transparent,
            var(--m25-current),
            transparent
          ) !important;

      }


      #manaV964Launchpad
      .mana-v964-icon,

      .mana-v978-launchpad
      .mana-v978-icon{

        border:
          1px solid
          var(--m25-current) !important;

        background:#090909 !important;

        box-shadow:
          0
          0
          18px
          color-mix(
            in srgb,
            var(--m25-current) 18%,
            transparent
          ) !important;

      }


      /* Preserve copy */

      #manaV964Launchpad
      .mana-v964-title,

      .mana-v978-launchpad
      .mana-v978-title{

        color:#fff !important;

      }


      #manaV964Launchpad
      .mana-v964-text,

      .mana-v978-launchpad
      .mana-v978-text{

        color:#999 !important;

      }


      /* =====================================
         WORKOUT SCREEN
         SAME SEQUENCE
         ===================================== */

      #manaV83Content
      .mana-v85-day,

      #manaV83Content
      .mana-v980-day{

        position:relative !important;

        border:
          1px solid
          var(--m25-current) !important;

        background:
          linear-gradient(
            145deg,
            #131313,
            #090909
          ) !important;

        box-shadow:none !important;

      }


      /* Override old v10.18 workout colours */

      #manaV83Content
      .mana-v85-day::after{

        background:
          linear-gradient(
            180deg,
            var(--m25-current),
            transparent
          ) !important;

      }


      #manaV83Content
      .mana-v85-day.mana-v964-expanded{

        border-color:
          var(--m25-current) !important;

        background:
          linear-gradient(
            145deg,
            #151515,
            #090909
          ) !important;

        box-shadow:
          0
          0
          0
          1px
          color-mix(
            in srgb,
            var(--m25-current) 25%,
            transparent
          ),
          0
          12px
          30px
          rgba(
            0,
            0,
            0,
            .28
          ) !important;

      }


      #manaV83Content
      .mana-v85-day
      .mana-v85-num,

      #manaV83Content
      .mana-v980-day
      .mana-v980-number{

        border-color:
          var(--m25-current) !important;

        color:
          var(--m25-current) !important;

      }


      /* =====================================
         BOTTOM TABS

         EVERY POSITION KEEPS COLOUR
         ===================================== */

      #manaV83Tabs
      .mana-v83-tab:nth-child(1){

        --m25-tab:
          var(--m25-green);

      }


      #manaV83Tabs
      .mana-v83-tab:nth-child(2){

        --m25-tab:
          var(--m25-blue);

      }


      #manaV83Tabs
      .mana-v83-tab:nth-child(3){

        --m25-tab:
          var(--m25-yellow);

      }


      #manaV83Tabs
      .mana-v83-tab:nth-child(4){

        --m25-tab:
          var(--m25-purple);

      }


      #manaV83Tabs
      .mana-v83-tab:nth-child(5){

        --m25-tab:
          var(--m25-orange);

      }


      /* Inactive */

      #manaV83Tabs
      .mana-v83-tab{

        position:relative !important;

        color:
          var(--m25-tab) !important;

        border:
          1px solid
          color-mix(
            in srgb,
            var(--m25-tab) 52%,
            transparent
          ) !important;

        background:
          rgba(
            255,
            255,
            255,
            .012
          ) !important;

        opacity:.72 !important;

        box-shadow:none !important;

        transition:
          opacity .18s ease,
          border-color .18s ease,
          background .18s ease,
          box-shadow .18s ease,
          transform .18s ease !important;

      }


      #manaV83Tabs
      .mana-v83-tab::before{

        background:
          var(--m25-tab) !important;

        opacity:.62 !important;

      }


      #manaV83Tabs
      .mana-v83-tab
      .m10140-tab-icon{

        opacity:.70 !important;

        filter:
          saturate(.90)
          brightness(.94)
          drop-shadow(
            0
            0
            4px
            var(--m25-tab)
          ) !important;

      }


      /* ACTIVE */

      #manaV83Tabs
      .mana-v83-tab.active{

        opacity:1 !important;

        color:
          var(--m25-tab) !important;

        border-color:
          var(--m25-tab) !important;

        background:
          color-mix(
            in srgb,
            var(--m25-tab) 8%,
            #080808
          ) !important;

        box-shadow:
          inset
          0
          0
          0
          1px
          color-mix(
            in srgb,
            var(--m25-tab) 32%,
            transparent
          ),
          0
          0
          18px
          color-mix(
            in srgb,
            var(--m25-tab) 18%,
            transparent
          ) !important;

      }


      #manaV83Tabs
      .mana-v83-tab.active::before{

        opacity:1 !important;

        box-shadow:
          0
          0
          8px
          var(--m25-tab) !important;

      }


      #manaV83Tabs
      .mana-v83-tab.active
      .m10140-tab-icon{

        opacity:1 !important;

        transform:
          scale(1.06) !important;

        filter:
          saturate(1.15)
          brightness(1.08)
          drop-shadow(
            0
            0
            9px
            var(--m25-tab)
          ) !important;

      }


      /* =====================================
         CUSTOM OVERVIEW / RECLAIM TAB ICON
         ===================================== */

      .m1025-custom-tab-icon{

        width:32px !important;

        height:32px !important;

        display:grid !important;

        place-items:center !important;

        color:
          var(--m25-tab) !important;

        pointer-events:none !important;

      }


      .m1025-custom-tab-icon svg{

        width:28px !important;

        height:28px !important;

      }


      /* =====================================
         PROGRESS
         ===================================== */

      #manaV993StrengthProgress
      .mana-v993-period.active,

      #manaV993StrengthProgress
      .mana-v993-detail-btn.active{

        background:#111 !important;

        color:
          var(--m25-purple) !important;

        border-color:
          var(--m25-purple) !important;

      }


      /* =====================================
         LEARNING
         ===================================== */

      #manaV83Content
      .mana-v985-head::after{

        background:
          linear-gradient(
            90deg,
            var(--m25-orange),
            transparent
          ) !important;

      }


      #manaV83Content
      .mana-v985-learn-card{

        border-color:
          rgba(
            233,
            138,
            84,
            .48
          ) !important;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:600px){


        .m1025-home-icon{

          right:9px !important;

          width:66px !important;

          height:66px !important;

          border-radius:18px !important;

        }


        .m1025-home-icon svg{

          width:46px !important;

          height:46px !important;

        }


        #manaV83Tabs
        .mana-v83-tab{

          border-radius:
            13px !important;

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

  function addHomeIcon(
    card,
    type
  ) {

    if (
      !card ||
      !ICONS[type]
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
      ICONS[type];

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
      STRENGTH
      LYFE
      MANA 28
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
     APPLY SEQUENCE
     ========================================= */

  function applySequence(
    selector
  ) {

    document
      .querySelectorAll(
        selector
      )
      .forEach(
        (
          element,
          index
        ) => {

          element.dataset
            .m1025Tone =
            SEQUENCE[
              index %
              SEQUENCE.length
            ];

        }
      );

  }


  /* =========================================
     CHOOSE PLAN
     ========================================= */

  function decoratePlans() {

    applySequence(
      "#manaV98Membership .mana-v981-plan"
    );

  }


  /* =========================================
     STRENGTH SETUP
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
     OVERVIEW
     ========================================= */

  function decorateOverview() {

    applySequence(
      "#manaV964Launchpad .mana-v964-launch"
    );


    applySequence(
      ".mana-v978-launchpad .mana-v978-launch"
    );

  }


  /* =========================================
     WORKOUTS
     ========================================= */

  function decorateWorkouts() {

    applySequence(
      "#manaV83Content .mana-v85-day"
    );


    applySequence(
      "#manaV83Content .mana-v980-day"
    );

  }


  /* =========================================
     BOTTOM TABS
     ========================================= */

  function decorateTabs() {

    const tabs =
      document.querySelectorAll(
        "#manaV83Tabs .mana-v83-tab"
      );


    tabs.forEach(
      (
        tab,
        index
      ) => {

        tab.dataset
          .m1025Tone =
          SEQUENCE[
            index %
            SEQUENCE.length
          ];


        const tabName =
          tab.dataset.v83Tab;


        /*
          OVERVIEW ICON
        */

        if (
          tabName ===
          "overview"
        ) {

          let inner =
            tab.querySelector(
              ".m10140-tab-inner"
            );


          if (!inner) {

            inner =
              document.createElement(
                "div"
              );


            inner.className =
              "m10140-tab-inner";


            inner.innerHTML = `

              <span
                class="m1025-custom-tab-icon"
              >
                ${ICONS.overview}
              </span>

              <span
                class="m10140-tab-label"
              >
                Overview
              </span>

            `;


            tab.innerHTML = "";

            tab.appendChild(
              inner
            );

          } else {

            if (
              !inner.querySelector(
                ".m1025-custom-tab-icon"
              )
            ) {

              const oldIcon =
                inner.querySelector(
                  ".m10140-tab-icon"
                );


              oldIcon
                ?.remove();


              const icon =
                document.createElement(
                  "span"
                );


              icon.className =
                "m1025-custom-tab-icon";


              icon.innerHTML =
                ICONS.overview;


              inner.prepend(
                icon
              );

            }

          }

        }


        /*
          RECLAIM ICON
        */

        if (
          tabName ===
          "reclaim"
        ) {

          let inner =
            tab.querySelector(
              ".m10140-tab-inner"
            );


          if (!inner) {

            inner =
              document.createElement(
                "div"
              );


            inner.className =
              "m10140-tab-inner";


            inner.innerHTML = `

              <span
                class="m1025-custom-tab-icon"
              >
                ${ICONS.reclaim}
              </span>

              <span
                class="m10140-tab-label"
              >
                Reclaim
              </span>

            `;


            tab.innerHTML = "";

            tab.appendChild(
              inner
            );

          } else {

            const oldIcon =
              inner.querySelector(
                ".m10140-tab-icon"
              );


            oldIcon
              ?.remove();


            let custom =
              inner.querySelector(
                ".m1025-custom-tab-icon"
              );


            if (!custom) {

              custom =
                document.createElement(
                  "span"
                );


              custom.className =
                "m1025-custom-tab-icon";


              inner.prepend(
                custom
              );

            }


            custom.innerHTML =
              ICONS.reclaim;

          }

        }

      }
    );

  }


  /* =========================================
     REFRESH
     ========================================= */

  function refresh() {

    decorateHome();

    decoratePlans();

    decorateStrengthOptions();

    decorateOverview();

    decorateWorkouts();

    decorateTabs();

  }


  /* =========================================
     SCREEN SETTLE

     Some older Mana screens render slightly
     after navigation.

     Short one-shot refresh only.
     ========================================= */

  function settle() {

    refresh();


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

    settle();


    [
      "mana:program-tab-change",
      "mana:workout-progress-change",
      "mana:profile-synced",
      "mana:program-change",
      "mana:fuel-updated",
      "mana:strength-membership-change"
    ]
      .forEach(
        eventName => {

          document.addEventListener(
            eventName,
            settle
          );

        }
      );


    document.addEventListener(
      "click",
      event => {

        const target =
          event.target.closest(
            `
              [data-program],
              [data-v83-tab],
              [data-v964-launch],
              [data-v978-tab],
              .mana-strength-option,
              .mana-v981-plan,
              .mana-v981-button,
              .mana-v85-day,
              .mana-v980-day
            `
          );


        if (!target) {
          return;
        }


        requestAnimationFrame(
          settle
        );

      }
    );


    window.addEventListener(
      "pageshow",
      settle
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          settle();

        }

      }
    );


    window
      .refreshManaMasterVisualSystem =
        settle;


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
