/* =========================================
   MANA MOVEMENT TRAINING v10.19.0
   MANA 28 + MANA LYFE
   PREMIUM OVERVIEW ICON SYSTEM

   BUILD: 101900

   PURPOSE
   -----------------------------------------
   - Match Mana Strength Overview styling
   - Use the same premium tab artwork
   - Workouts / Fuel / Progress / Learning
   - Premium Reclaim treatment for Mana Lyfe
   - Add subtle colour differentiation
   - Keep all current program logic untouched
   ========================================= */

(() => {
  "use strict";


  /* =========================================
     BUILD
     ========================================= */

  const BUILD =
    "101900";


  const STYLE_ID =
    "mana-v1019-overview-style";


  const ASSET_ROOT =
    "ui/";


  let refreshTimer =
    null;


  let observer =
    null;


  /* =========================================
     HELPERS
     ========================================= */

  const $ =
    id =>
      document.getElementById(
        id
      );


  function asset(
    filename
  ) {

    return (
      ASSET_ROOT +
      filename +
      "?v=" +
      BUILD
    );

  }


  function currentProgram() {

    const title =
      String(
        $(
          "manaV83Title"
        )
          ?.textContent ||
        ""
      )
        .trim()
        .toUpperCase();


    if (
      title ===
      "MANA 28"
    ) {

      return "mana28";

    }


    if (
      title ===
      "MANA LYFE" ||
      title ===
      "MANA LIFE"
    ) {

      return "lyfe";

    }


    return "";

  }


  function overviewOpen() {

    const shell =
      $(
        "manaV83ProgramShell"
      );


    const active =
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      );


    return Boolean(

      shell
        ?.classList
        .contains(
          "open"
        )

      &&

      active
        ?.dataset
        ?.v83Tab ===
        "overview"

      &&

      currentProgram()

    );

  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

    $(
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
         PREMIUM OVERVIEW FOUNDATION
         ===================================== */

      .mana-v978-launchpad{

        max-width:
          860px !important;

      }


      .mana-v978-grid{

        gap:
          15px !important;

      }


      .mana-v978-launch{

        position:
          relative !important;

        overflow:
          hidden !important;

        transition:

          transform
          .18s ease,

          border-color
          .18s ease,

          box-shadow
          .18s ease !important;

      }


      .mana-v978-launch:hover{

        transform:
          translateY(
            -2px
          );

        box-shadow:
          0
          14px
          34px
          rgba(
            0,
            0,
            0,
            .24
          ) !important;

      }


      /* =====================================
         PREMIUM ICON FRAME
         ===================================== */

      .mana-v978-launch
      .mana-v978-icon{

        overflow:
          hidden !important;

        display:
          grid !important;

        place-items:
          center !important;

        width:
          60px !important;

        height:
          60px !important;

        flex:
          0 0
          60px !important;

        padding:
          0 !important;

        border-radius:
          17px !important;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .38
          ) !important;

        background:

          radial-gradient(
            circle at center,
            rgba(
              243,
              216,
              117,
              .11
            ),
            transparent 68%
          ),

          #080808 !important;

        box-shadow:

          inset
          0
          0
          18px
          rgba(
            243,
            216,
            117,
            .04
          ),

          0
          8px
          20px
          rgba(
            0,
            0,
            0,
            .24
          ) !important;

        color:
          #f3d875 !important;

      }


      .mana-v978-icon
      img{

        display:
          block;

        width:
          100%;

        height:
          100%;

        object-fit:
          cover;

      }


      /* =====================================
         WORKOUTS — GOLD
         ===================================== */

      .mana-v978-launch[
        data-v1019-tone="workout"
      ]{

        border-color:
          rgba(
            209,
            174,
            65,
            .55
          ) !important;

        background:

          radial-gradient(
            circle at top left,
            rgba(
              218,
              181,
              69,
              .08
            ),
            transparent 46%
          ),

          linear-gradient(
            145deg,
            #17150d,
            #090909
          ) !important;

      }


      .mana-v978-launch[
        data-v1019-tone="workout"
      ]::before{

        background:
          linear-gradient(
            90deg,
            transparent,
            #d9b852,
            transparent
          ) !important;

      }


      /* =====================================
         FUEL — WARM AMBER
         ===================================== */

      .mana-v978-launch[
        data-v1019-tone="fuel"
      ]{

        border-color:
          rgba(
            219,
            155,
            59,
            .50
          ) !important;

        background:

          radial-gradient(
            circle at top left,
            rgba(
              224,
              157,
              61,
              .09
            ),
            transparent 46%
          ),

          linear-gradient(
            145deg,
            #18130c,
            #090909
          ) !important;

      }


      .mana-v978-launch[
        data-v1019-tone="fuel"
      ]::before{

        background:
          linear-gradient(
            90deg,
            transparent,
            #dfa13d,
            transparent
          ) !important;

      }


      /* =====================================
         PROGRESS — BLUE
         ===================================== */

      .mana-v978-launch[
        data-v1019-tone="progress"
      ]{

        border-color:
          rgba(
            73,
            150,
            201,
            .46
          ) !important;

        background:

          radial-gradient(
            circle at top left,
            rgba(
              73,
              150,
              201,
              .08
            ),
            transparent 46%
          ),

          linear-gradient(
            145deg,
            #10161a,
            #090909
          ) !important;

      }


      .mana-v978-launch[
        data-v1019-tone="progress"
      ]::before{

        background:
          linear-gradient(
            90deg,
            transparent,
            #55a8de,
            transparent
          ) !important;

      }


      /* =====================================
         LEARNING — PURPLE
         ===================================== */

      .mana-v978-launch[
        data-v1019-tone="learning"
      ]{

        border-color:
          rgba(
            141,
            104,
            193,
            .44
          ) !important;

        background:

          radial-gradient(
            circle at top left,
            rgba(
              141,
              104,
              193,
              .08
            ),
            transparent 46%
          ),

          linear-gradient(
            145deg,
            #15111a,
            #090909
          ) !important;

      }


      .mana-v978-launch[
        data-v1019-tone="learning"
      ]::before{

        background:
          linear-gradient(
            90deg,
            transparent,
            #a681dc,
            transparent
          ) !important;

      }


      /* =====================================
         RECLAIM — TEAL
         ===================================== */

      .mana-v978-launch[
        data-v1019-tone="reclaim"
      ]{

        border-color:
          rgba(
            64,
            178,
            157,
            .50
          ) !important;

        background:

          radial-gradient(
            circle at top left,
            rgba(
              64,
              178,
              157,
              .09
            ),
            transparent 46%
          ),

          linear-gradient(
            145deg,
            #0f1917,
            #090909
          ) !important;

      }


      .mana-v978-launch[
        data-v1019-tone="reclaim"
      ]::before{

        background:
          linear-gradient(
            90deg,
            transparent,
            #4ac6ae,
            transparent
          ) !important;

      }


      /* =====================================
         CARD COPY
         ===================================== */

      .mana-v978-label{

        font-size:
          10px !important;

        letter-spacing:
          .13em !important;

      }


      .mana-v978-title{

        font-size:
          23px !important;

        line-height:
          1.12 !important;

      }


      .mana-v978-text{

        color:
          #aaa !important;

        font-size:
          14px !important;

        line-height:
          1.5 !important;

      }


      .mana-v978-arrow{

        color:
          #f3d875 !important;

      }


      /* =====================================
         PROGRAM-SPECIFIC ACCENT
         ===================================== */

      #manaV1019ProgramBadge{

        display:
          inline-flex;

        align-items:
          center;

        gap:
          6px;

        margin-top:
          8px;

        padding:
          5px
          8px;

        border-radius:
          999px;

        border:
          1px solid
          #393326;

        background:
          #0d0c09;

        color:
          #a99657;

        font-size:
          8px;

        font-weight:
          950;

        letter-spacing:
          .07em;

      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(max-width:600px){

        .mana-v978-grid{

          grid-template-columns:
            1fr !important;

        }


        .mana-v978-launch{

          min-height:
            154px !important;

          padding:
            18px !important;

        }


        .mana-v978-launch
        .mana-v978-icon{

          width:
            56px !important;

          height:
            56px !important;

          flex-basis:
            56px !important;

          border-radius:
            16px !important;

        }


        .mana-v978-title{

          font-size:
            21px !important;

        }


        .mana-v978-text{

          font-size:
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
     ICON CONFIG
     ========================================= */

  function iconConfig(
    program,
    tab
  ) {

    if (
      tab ===
      "program" ||
      tab ===
      "routine"
    ) {

      return {

        file:
          "tab-workout.png",

        tone:
          "workout"

      };

    }


    if (
      tab ===
      "fuel"
    ) {

      return {

        file:
          "tab-fuel.png",

        tone:
          "fuel"

      };

    }


    if (
      tab ===
      "progress"
    ) {

      return {

        file:
          "tab-progress.png",

        tone:
          "progress"

      };

    }


    if (
      tab ===
      "learn"
    ) {

      return {

        file:
          "tab-learning.png",

        tone:
          "learning"

      };

    }


    if (
      program ===
        "lyfe"

      &&

      tab ===
        "reclaim"
    ) {

      return {

        file:
          "tab-learning.png",

        tone:
          "reclaim"

      };

    }


    return null;

  }


  /* =========================================
     DECORATE OVERVIEW
     ========================================= */

  function decorateOverview() {

    if (
      !overviewOpen()
    ) {

      return;

    }


    const program =
      currentProgram();


    const launchpad =
      document.querySelector(
        ".mana-v978-launchpad"
      );


    if (
      !launchpad
    ) {

      return;

    }


    launchpad
      .querySelectorAll(
        ".mana-v978-launch[data-v978-tab]"
      )
      .forEach(
        card => {

          const tab =
            card.dataset
              .v978Tab;


          const config =
            iconConfig(
              program,
              tab
            );


          if (
            !config
          ) {

            return;

          }


          card.dataset
            .v1019Tone =
            config.tone;


          const icon =
            card.querySelector(
              ".mana-v978-icon"
            );


          if (
            !icon
          ) {

            return;

          }


          const signature =
            `${program}-${tab}-${BUILD}`;


          if (
            icon.dataset
              .v1019Icon ===
            signature
          ) {

            return;

          }


          icon.dataset
            .v1019Icon =
            signature;


          icon.innerHTML = `

            <img
              src="${asset(
                config.file
              )}"
              alt=""
              aria-hidden="true"
            >

          `;

        }
      );


    addProgramBadge(
      program
    );

  }


  /* =========================================
     PROGRAM BADGE
     ========================================= */

  function addProgramBadge(
    program
  ) {

    const intro =
      document.querySelector(
        ".mana-v978-intro"
      );


    if (
      !intro
    ) {

      return;

    }


    $(
      "manaV1019ProgramBadge"
    )
      ?.remove();


    const badge =
      document.createElement(
        "div"
      );


    badge.id =
      "manaV1019ProgramBadge";


    badge.textContent =
      program ===
        "lyfe"

        ? "MOVE • RESET • REBUILD"

        : "4 WEEKS • MOVE WITH PURPOSE";


    intro
      .appendChild(
        badge
      );

  }


  /* =========================================
     PROGRAM-SPECIFIC POLISH
     ========================================= */

  function decorateMana28() {

    if (
      currentProgram() !==
      "mana28"
    ) {

      return;

    }


    const programCard =
      document.querySelector(
        '.mana-v978-launch[data-v978-tab="program"]'
      );


    const title =
      programCard
        ?.querySelector(
          ".mana-v978-title"
        );


    if (
      title
    ) {

      title.textContent =
        "Your 4-Week Plan";

    }

  }


  function decorateLyfe() {

    if (
      currentProgram() !==
      "lyfe"
    ) {

      return;

    }


    const routine =
      document.querySelector(
        '.mana-v978-launch[data-v978-tab="routine"]'
      );


    const reclaim =
      document.querySelector(
        '.mana-v978-launch[data-v978-tab="reclaim"]'
      );


    if (
      routine
    ) {

      routine.dataset
        .v1019Tone =
        "workout";

    }


    if (
      reclaim
    ) {

      reclaim.dataset
        .v1019Tone =
        "reclaim";

    }

  }


  /* =========================================
     REFRESH
     ========================================= */

  function refresh() {

    if (
      !overviewOpen()
    ) {

      return;

    }


    installStyles();

    decorateOverview();

    decorateMana28();

    decorateLyfe();

  }


  function scheduleRefresh(
    delay = 50
  ) {

    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        refresh,
        delay
      );


    [
      120,
      300,
      650
    ]
      .forEach(
        wait => {

          setTimeout(
            refresh,
            wait
          );

        }
      );

  }


  /* =========================================
     OBSERVER
     ========================================= */

  function attachObserver() {

    observer
      ?.disconnect();


    const holder =
      $(
        "manaV83Content"
      );


    if (
      !holder
    ) {

      return;

    }


    observer =
      new MutationObserver(
        () => {

          if (
            overviewOpen()
          ) {

            scheduleRefresh(
              30
            );

          }

        }
      );


    observer.observe(
      holder,
      {
        childList:
          true,

        subtree:
          false
      }
    );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function bindEvents() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV83Tabs .mana-v83-tab"
          )
        ) {

          scheduleRefresh(
            100
          );

        }


        if (
          event.target.closest(
            "#manaV80Mana28"
          )
        ) {

          scheduleRefresh(
            220
          );

        }


        if (
          event.target.closest(
            "#manaV80ManaLife, #manaV80ManaLyfe"
          )
        ) {

          scheduleRefresh(
            220
          );

        }

      },
      true
    );


    [
      "mana:program-tab-change",
      "mana:strength-synced",
      "mana:workout-progress-change"
    ]
      .forEach(
        name => {

          window.addEventListener(
            name,
            () => {

              scheduleRefresh(
                100
              );

            }
          );

        }
      );


    window.addEventListener(
      "focus",
      () => {

        if (
          overviewOpen()
        ) {

          scheduleRefresh(
            100
          );

        }

      }
    );

  }


  /* =========================================
     PUBLIC API
     ========================================= */

  function expose() {

    window
      .refreshMana28LyfePremiumOverview =
      scheduleRefresh;


    window
      .MANA_28_LYFE_PREMIUM_OVERVIEW_BUILD =
      BUILD;

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    expose();

    bindEvents();

    attachObserver();


    [
      400,
      900,
      1500
    ]
      .forEach(
        delay => {

          setTimeout(
            refresh,
            delay
          );

        }
      );


    console.log(
      "Mana 28 + Mana Lyfe Premium Overview",
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
