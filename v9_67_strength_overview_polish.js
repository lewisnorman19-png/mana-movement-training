/* =========================================
   MANA MOVEMENT TRAINING v9.67.1
   STRENGTH OVERVIEW POLISH — STABLE

   FIXES
   - NO GLOBAL CLICK REFRESH
   - NO 3-PASS DELAYED REDRAWS
   - CSS INSTALLED ONCE
   - DOES NOT REBUILD OVERVIEW
   - DOES NOT TOUCH WORKOUT DATA
   - DOES NOT TOUCH TIMER
   - DOES NOT TOUCH FUEL
   - DOES NOT TOUCH SET LOGGING

   PURPOSE
   Visual polish only.
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "96710";


  const STYLE_ID =
    "mana-v967-strength-overview-style";


  let refreshTimer =
    null;


  /* =========================================
     STATE
     ========================================= */

  function activeStrengthTab() {

    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );


    const title =
      document.getElementById(
        "manaV83Title"
      );


    const active =
      document.querySelector(
        "#manaV83Tabs " +
        ".mana-v83-tab.active"
      );


    if (
      !shell
        ?.classList
        .contains(
          "open"
        )
      ||
      title
        ?.textContent
        ?.trim()
        ?.toUpperCase() !==
        "MANA STRENGTH"
    ) {

      return null;

    }


    return (
      active
        ?.dataset
        ?.v83Tab
      ||
      null
    );

  }


  /* =========================================
     STYLES
     INSTALL ONCE ONLY
     ========================================= */

  function installStyles() {

    if (
      document.getElementById(
        STYLE_ID
      )
    ) {

      return;

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      /* =====================================
         OVERVIEW WRAP
         ===================================== */

      .mana-v964-launchpad{

        max-width:
          860px !important;

        padding:
          8px
          0
          38px !important;

      }


      .mana-v964-intro{

        margin-bottom:
          26px !important;

      }


      .mana-v964-kicker{

        color:
          #e2c25a !important;

        font-size:
          12px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .16em !important;

        text-transform:
          uppercase !important;

      }


      .mana-v964-intro h2{

        margin:
          10px
          0
          12px !important;

        color:
          #fff !important;

        font-size:
          36px !important;

        font-weight:
          950 !important;

        line-height:
          1.02 !important;

      }


      .mana-v964-intro p{

        max-width:
          680px !important;

        color:
          #b8b8b8 !important;

        font-size:
          17px !important;

        line-height:
          1.6 !important;

      }


      /* =====================================
         GRID
         ===================================== */

      .mana-v964-grid{

        display:
          grid !important;

        grid-template-columns:
          repeat(
            2,
            minmax(
              0,
              1fr
            )
          )
          !important;

        gap:
          16px !important;

      }


      /* =====================================
         CARDS
         ===================================== */

      .mana-v964-launch{

        position:
          relative !important;

        min-height:
          196px !important;

        padding:
          24px !important;

        gap:
          18px !important;

        border:
          1px solid
          #3b3522 !important;

        border-radius:
          24px !important;

        background:

          linear-gradient(
            145deg,
            #171611 0%,
            #10100d 45%,
            #090909 100%
          )

          !important;

        box-shadow:

          0
          14px
          32px
          rgba(
            0,
            0,
            0,
            .22
          ),

          inset
          0
          1px
          0
          rgba(
            255,
            255,
            255,
            .02
          )

          !important;

        transition:

          transform
          .14s
          ease,

          border-color
          .18s
          ease,

          box-shadow
          .18s
          ease

          !important;

      }


      .mana-v964-launch::before{

        content:
          "" !important;

        position:
          absolute !important;

        top:
          0 !important;

        left:
          22px !important;

        right:
          22px !important;

        height:
          2px !important;

        background:

          linear-gradient(
            90deg,
            transparent,
            #d9ba55,
            transparent
          )

          !important;

        opacity:
          .9 !important;

      }


      .mana-v964-launch:hover{

        transform:
          translateY(
            -2px
          )
          !important;

        border-color:
          #7d6726 !important;

        box-shadow:

          0
          18px
          36px
          rgba(
            0,
            0,
            0,
            .28
          ),

          0
          0
          0
          1px
          rgba(
            217,
            186,
            85,
            .05
          )
          inset

          !important;

      }


      .mana-v964-launch:active{

        transform:
          scale(
            .988
          )
          !important;

      }


      /* =====================================
         ICON
         ===================================== */

      .mana-v964-icon{

        flex:
          0
          0
          62px !important;

        width:
          62px !important;

        height:
          62px !important;

        border-radius:
          18px !important;

        background:

          linear-gradient(
            145deg,
            #f2d978,
            #c89f2f
          )

          !important;

        color:
          #111 !important;

        font-size:
          21px !important;

        font-weight:
          950 !important;

        box-shadow:

          0
          10px
          24px
          rgba(
            217,
            186,
            85,
            .16
          )

          !important;

      }


      /* =====================================
         COPY
         ===================================== */

      .mana-v964-copy{

        min-width:
          0 !important;

        flex:
          1 !important;

      }


      .mana-v964-label{

        color:
          #d0b45a !important;

        font-size:
          11px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .14em !important;

        text-transform:
          uppercase !important;

      }


      .mana-v964-title{

        margin-top:
          8px !important;

        color:
          #fff !important;

        font-size:
          26px !important;

        font-weight:
          950 !important;

        line-height:
          1.08 !important;

      }


      .mana-v964-text{

        margin-top:
          11px !important;

        color:
          #b8b8b8 !important;

        font-size:
          15px !important;

        line-height:
          1.55 !important;

      }


      .mana-v964-arrow{

        margin-top:
          16px !important;

        color:
          #f3d875 !important;

        font-size:
          13px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .05em !important;

      }


      /* =====================================
         SPECIFIC CARDS
         ===================================== */

      .mana-v964-launch[
        data-v964-launch="profile"
      ]{

        border-color:
          #4c4020 !important;

      }


      .mana-v964-launch[
        data-v964-launch="program"
      ]{

        border-color:
          #5a4a1f !important;

      }


      .mana-v964-launch[
        data-v964-launch="fuel"
      ],
      .mana-v964-launch[
        data-v964-launch="progress"
      ]{

        border-color:
          #3c3520 !important;

      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(
        max-width:700px
      ){

        .mana-v964-grid{

          grid-template-columns:
            1fr !important;

          gap:
            14px !important;

        }


        .mana-v964-intro h2{

          font-size:
            31px !important;

        }


        .mana-v964-intro p{

          font-size:
            15px !important;

        }


        .mana-v964-launch{

          min-height:
            164px !important;

          padding:
            20px !important;

          gap:
            15px !important;

        }


        .mana-v964-icon{

          width:
            56px !important;

          height:
            56px !important;

          flex-basis:
            56px !important;

          font-size:
            19px !important;

        }


        .mana-v964-title{

          font-size:
            23px !important;

        }


        .mana-v964-text{

          font-size:
            14px !important;

        }


        .mana-v964-arrow{

          font-size:
            12px !important;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     TEXT NORMALISATION

     IMPORTANT:
     This edits existing nodes only.
     It NEVER replaces holder.innerHTML.
     ========================================= */

  function tightenOverviewCopy() {

    if (
      activeStrengthTab() !==
      "overview"
    ) {

      return;

    }


    const launchpad =
      document.getElementById(
        "manaV964Launchpad"
      );


    if (!launchpad) {

      return;

    }


    const introTitle =
      launchpad.querySelector(
        ".mana-v964-intro h2"
      );


    const introText =
      launchpad.querySelector(
        ".mana-v964-intro p"
      );


    if (
      introTitle &&
      introTitle.textContent !==
        "Your Strength Hub"
    ) {

      introTitle.textContent =
        "Your Strength Hub";

    }


    const correctIntro =
      "Everything important in one place. Choose where you want to go next.";


    if (
      introText &&
      introText.textContent
        .trim() !==
        correctIntro
    ) {

      introText.textContent =
        correctIntro;

    }


    launchpad
      .querySelectorAll(
        ".mana-v964-launch"
      )
      .forEach(
        card => {

          const type =
            card.dataset
              .v964Launch;


          const title =
            card.querySelector(
              ".mana-v964-title"
            );


          const text =
            card.querySelector(
              ".mana-v964-text"
            );


          const arrow =
            card.querySelector(
              ".mana-v964-arrow"
            );


          if (
            !text ||
            !arrow
          ) {

            return;

          }


          if (
            type ===
            "profile"
          ) {

            if (
              title &&
              !title.textContent
                .trim()
            ) {

              title.textContent =
                "Profile & Goals";

            }


            const copy =
              "Update your goal, training experience and setup.";


            if (
              text.textContent
                .trim() !==
              copy
            ) {

              text.textContent =
                copy;

            }


            if (
              arrow.textContent
                .trim() !==
              "OPEN PROFILE →"
            ) {

              arrow.textContent =
                "OPEN PROFILE →";

            }

          }


          if (
            type ===
            "program"
          ) {

            const copy =
              "Open your workouts, review the plan and start when ready.";


            if (
              text.textContent
                .trim() !==
              copy
            ) {

              text.textContent =
                copy;

            }


            if (
              arrow.textContent
                .trim() !==
              "VIEW PROGRAM →"
            ) {

              arrow.textContent =
                "VIEW PROGRAM →";

            }

          }


          if (
            type ===
            "fuel"
          ) {

            const copy =
              "Track calories, protein, meals, water and daily targets.";


            if (
              text.textContent
                .trim() !==
              copy
            ) {

              text.textContent =
                copy;

            }


            if (
              arrow.textContent
                .trim() !==
              "OPEN FUEL →"
            ) {

              arrow.textContent =
                "OPEN FUEL →";

            }

          }


          if (
            type ===
            "progress"
          ) {

            const copy =
              "Review completed sessions, strength progress and results.";


            if (
              text.textContent
                .trim() !==
              copy
            ) {

              text.textContent =
                copy;

            }


            if (
              arrow.textContent
                .trim() !==
              "VIEW PROGRESS →"
            ) {

              arrow.textContent =
                "VIEW PROGRESS →";

            }

          }

        }
      );

  }


  /* =========================================
     ONE DEBOUNCED REFRESH
     ========================================= */

  function scheduleRefresh(
    delay = 80
  ) {

    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        () => {

          tightenOverviewCopy();

        },
        delay
      );

  }


  /* =========================================
     EVENTS

     Only respond to events that can actually
     change the Strength Overview.
     ========================================= */

  function wireEvents() {

    window.addEventListener(
      "mana:program-tab-change",
      () => {

        if (
          activeStrengthTab() ===
          "overview"
        ) {

          scheduleRefresh(
            90
          );

        }

      }
    );


    window.addEventListener(
      "mana:strength-synced",
      () => {

        if (
          activeStrengthTab() ===
          "overview"
        ) {

          scheduleRefresh(
            100
          );

        }

      }
    );


    window.addEventListener(
      "mana:workout-progress-change",
      () => {

        if (
          activeStrengthTab() ===
          "overview"
        ) {

          scheduleRefresh(
            100
          );

        }

      }
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    wireEvents();


    /*
      One initial pass only.
    */

    scheduleRefresh(
      180
    );


    window
      .MANA_STRENGTH_OVERVIEW_POLISH_BUILD =
      BUILD;


    window
      .refreshManaStrengthOverviewPolish =
      scheduleRefresh;


    console.log(
      "[Mana v9.67.1] " +
      "stable Strength overview polish ready"
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
