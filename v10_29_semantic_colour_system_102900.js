/* =========================================
   MANA MOVEMENT TRAINING v10.29
   SEMANTIC COLOUR SYSTEM

   BUILD: 102900

   FINAL TAB COLOUR LANGUAGE
   -----------------------------------------
   OVERVIEW  = MULTI COLOUR
   WORKOUTS  = BLUE
   FUEL      = YELLOW
   PROGRESS  = PURPLE
   LEARNING  = ORANGE
   RECLAIM   = GREEN
   SUPPORT   = GREEN

   PURPOSE
   -----------------------------------------
   Colour now represents FUNCTION,
   not card position.

   Same logic across:
   - Mana Strength
   - Mana 28
   - Mana Lyfe
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "102900";


  const STYLE_ID =
    "mana-v1029-semantic-colour-system";


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

        --mana-workout:
          #55a8de;

        --mana-fuel:
          #e0bb51;

        --mana-progress:
          #a681dc;

        --mana-learning:
          #e98a54;

        --mana-reclaim:
          #55d98b;

      }


      /* =====================================
         BOTTOM NAV
         ===================================== */

      #manaV83Tabs
      .mana-v83-tab{

        opacity:
          .82 !important;

        background:
          #080808 !important;

      }


      /* OVERVIEW — MULTI */

      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="overview"
      ]{

        border:
          1px solid
          transparent !important;

        background:

          linear-gradient(
            #080808,
            #080808
          )
          padding-box,

          linear-gradient(
            90deg,
            var(--mana-workout),
            var(--mana-fuel),
            var(--mana-progress),
            var(--mana-learning),
            var(--mana-reclaim)
          )
          border-box !important;

        color:
          #ddd !important;

      }


      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="overview"
      ].active{

        opacity:
          1 !important;

        box-shadow:
          0
          0
          20px
          rgba(
            255,
            255,
            255,
            .08
          ) !important;

      }


      /* WORKOUTS — BLUE */

      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="program"
      ],

      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="routine"
      ]{

        --semantic-tab:
          var(--mana-workout);

      }


      /* FUEL — YELLOW */

      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="fuel"
      ]{

        --semantic-tab:
          var(--mana-fuel);

      }


      /* PROGRESS — PURPLE */

      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="progress"
      ]{

        --semantic-tab:
          var(--mana-progress);

      }


      /* LEARNING — ORANGE */

      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="learn"
      ]{

        --semantic-tab:
          var(--mana-learning);

      }


      /* RECLAIM — GREEN */

      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="reclaim"
      ]{

        --semantic-tab:
          var(--mana-reclaim);

      }


      #manaV83Tabs
      .mana-v83-tab:not(
        [data-v83-tab="overview"]
      ){

        border:
          1px solid
          color-mix(
            in srgb,
            var(--semantic-tab)
            62%,
            transparent
          ) !important;

        color:
          var(--semantic-tab) !important;

        background:
          #080808 !important;

        box-shadow:
          none !important;

      }


      #manaV83Tabs
      .mana-v83-tab:not(
        [data-v83-tab="overview"]
      )::before{

        background:
          var(--semantic-tab) !important;

        opacity:
          .70 !important;

      }


      #manaV83Tabs
      .mana-v83-tab:not(
        [data-v83-tab="overview"]
      ).active{

        opacity:
          1 !important;

        border-color:
          var(--semantic-tab) !important;

        background:
          color-mix(
            in srgb,
            var(--semantic-tab)
            8%,
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
            var(--semantic-tab)
            28%,
            transparent
          ),
          0
          0
          18px
          color-mix(
            in srgb,
            var(--semantic-tab)
            18%,
            transparent
          ) !important;

      }


      #manaV83Tabs
      .mana-v83-tab:not(
        [data-v83-tab="overview"]
      ).active::before{

        opacity:
          1 !important;

        box-shadow:
          0
          0
          9px
          var(--semantic-tab) !important;

      }


      /* =====================================
         STRENGTH OVERVIEW
         MULTI COLOUR
         ===================================== */

      #manaV964Launchpad
      .mana-v964-launch{

        background:
          #0b0b0b !important;

      }


      /* PROFILE = GREEN */

      #manaV964Launchpad
      .mana-v964-launch[
        data-v964-launch="profile"
      ]{

        border:
          1px solid
          var(--mana-reclaim) !important;

      }


      #manaV964Launchpad
      .mana-v964-launch[
        data-v964-launch="profile"
      ]
      .mana-v964-icon{

        border-color:
          var(--mana-reclaim) !important;

      }


      /* WORKOUTS = BLUE */

      #manaV964Launchpad
      .mana-v964-launch[
        data-v964-launch="program"
      ]{

        border:
          1px solid
          var(--mana-workout) !important;

      }


      #manaV964Launchpad
      .mana-v964-launch[
        data-v964-launch="program"
      ]
      .mana-v964-icon{

        border-color:
          var(--mana-workout) !important;

      }


      /* FUEL = YELLOW */

      #manaV964Launchpad
      .mana-v964-launch[
        data-v964-launch="fuel"
      ]{

        border:
          1px solid
          var(--mana-fuel) !important;

      }


      #manaV964Launchpad
      .mana-v964-launch[
        data-v964-launch="fuel"
      ]
      .mana-v964-icon{

        border-color:
          var(--mana-fuel) !important;

      }


      /* PROGRESS = PURPLE */

      #manaV964Launchpad
      .mana-v964-launch[
        data-v964-launch="progress"
      ]{

        border:
          1px solid
          var(--mana-progress) !important;

      }


      #manaV964Launchpad
      .mana-v964-launch[
        data-v964-launch="progress"
      ]
      .mana-v964-icon{

        border-color:
          var(--mana-progress) !important;

      }


      /* =====================================
         MANA28 / LYFE OVERVIEW
         ===================================== */

      .mana-v978-launch[
        data-v978-tab="program"
      ],

      .mana-v978-launch[
        data-v978-tab="routine"
      ]{

        border:
          1px solid
          var(--mana-workout) !important;

      }


      .mana-v978-launch[
        data-v978-tab="fuel"
      ]{

        border:
          1px solid
          var(--mana-fuel) !important;

      }


      .mana-v978-launch[
        data-v978-tab="progress"
      ]{

        border:
          1px solid
          var(--mana-progress) !important;

      }


      .mana-v978-launch[
        data-v978-tab="learn"
      ]{

        border:
          1px solid
          var(--mana-learning) !important;

      }


      .mana-v978-launch[
        data-v978-tab="reclaim"
      ]{

        border:
          1px solid
          var(--mana-reclaim) !important;

      }


      /* corresponding overview icons */

      .mana-v978-launch[
        data-v978-tab="program"
      ]
      .mana-v978-icon,

      .mana-v978-launch[
        data-v978-tab="routine"
      ]
      .mana-v978-icon{

        border-color:
          var(--mana-workout) !important;

      }


      .mana-v978-launch[
        data-v978-tab="fuel"
      ]
      .mana-v978-icon{

        border-color:
          var(--mana-fuel) !important;

      }


      .mana-v978-launch[
        data-v978-tab="progress"
      ]
      .mana-v978-icon{

        border-color:
          var(--mana-progress) !important;

      }


      .mana-v978-launch[
        data-v978-tab="learn"
      ]
      .mana-v978-icon{

        border-color:
          var(--mana-learning) !important;

      }


      .mana-v978-launch[
        data-v978-tab="reclaim"
      ]
      .mana-v978-icon{

        border-color:
          var(--mana-reclaim) !important;

      }


      /* =====================================
         WORKOUT TAB
         BLUE
         ===================================== */

      #manaV83Content
      .mana-v85-day,

      #manaV83Content
      .mana-v980-day{

        border:
          1px solid
          rgba(
            85,
            168,
            222,
            .72
          ) !important;

        background:
          linear-gradient(
            145deg,
            #10161a,
            #090909
          ) !important;

      }


      #manaV83Content
      .mana-v85-day.mana-v964-expanded{

        border-color:
          var(--mana-workout) !important;

        background:
          linear-gradient(
            145deg,
            #101821,
            #090909
          ) !important;

      }


      #manaV83Content
      .mana-v85-num,

      #manaV83Content
      .mana-v980-number{

        border-color:
          var(--mana-workout) !important;

        color:
          var(--mana-workout) !important;

      }


      #manaV83Content
      .mana-v85-day-label,

      #manaV83Content
      .mana-v980-category{

        color:
          var(--mana-workout) !important;

      }


      /* Strength exercises */

      #manaV83Content
      .mana-v85-exercise{

        border:
          1px solid
          rgba(
            85,
            168,
            222,
            .55
          ) !important;

        border-radius:
          14px !important;

      }


      /* Live workout exercise cards */

      #manaV64Exercises
      .mana-v64-card{

        border:
          1px solid
          rgba(
            85,
            168,
            222,
            .72
          ) !important;

        background:
          linear-gradient(
            145deg,
            #10161a,
            #090909
          ) !important;

      }


      #manaV64Exercises
      .mana-v970-disclosure,

      #manaV64Exercises
      .mana-v970-action,

      #manaV64Exercises
      input,

      #manaV64Exercises
      select{

        border-color:
          rgba(
            85,
            168,
            222,
            .52
          ) !important;

      }


      /* Mana28 / Lyfe workout detail */

      #manaV83Content
      .mana-v980-workout,

      #manaV83Content
      .mana-v980-exercises{

        border-color:
          rgba(
            85,
            168,
            222,
            .55
          ) !important;

      }


      #manaV83Content
      .mana-v980-exercise{

        border:
          1px solid
          rgba(
            85,
            168,
            222,
            .48
          ) !important;

        border-radius:
          13px !important;

      }


      /* Ready for next block stays support green */

      #manaV1017ProgramBlock
      .m1017-request{

        border:
          1px solid
          var(--mana-reclaim) !important;

        background:
          linear-gradient(
            145deg,
            #101713,
            #090909
          ) !important;

      }


      #manaV1017ProgramBlock
      .m1017-request-btn{

        border:
          1px solid
          var(--mana-reclaim) !important;

        color:
          #dff9e8 !important;

        background:
          rgba(
            85,
            217,
            139,
            .06
          ) !important;

      }


      /* =====================================
         FUEL TAB
         YELLOW EVERYWHERE
         ===================================== */

      #manaV1015Fuel
      .m1022-card,

      #manaV1015Fuel
      .m1022-category,

      #manaV1015Fuel
      .m1022-empty,

      #manaV1015Fuel
      .m1022-logged,

      #manaV1015Fuel
      .m1022-logged-art,

      #manaV1015Fuel
      .m1022-macro,

      #manaV1015Fuel
      .m1022-target,

      #manaV1015Fuel
      .m1022-control-row button{

        border-color:
          rgba(
            224,
            187,
            81,
            .62
          ) !important;

      }


      #manaV1015Fuel
      .m1022-target-icon{

        border:
          1px solid
          rgba(
            224,
            187,
            81,
            .58
          ) !important;

      }


      #manaV1015Fuel
      .m1022-bar span{

        background:
          var(--mana-fuel) !important;

      }


      #manaV1015Fuel
      .m1022-kicker,

      #manaV1015Fuel
      .m1022-category-arrow{

        color:
          var(--mana-fuel) !important;

      }


      /* =====================================
         PROGRESS TAB
         PURPLE EVERYWHERE
         ===================================== */

      /* Strength */

      #manaV993StrengthProgress
      .mana-v993-periods,

      #manaV993StrengthProgress
      .mana-v993-metric,

      #manaV993StrengthProgress
      .mana-v993-detail-btn,

      #manaV993StrengthProgress
      .mana-v993-panel,

      #manaV993StrengthProgress
      .mana-v993-summary,

      #manaV993StrengthProgress
      .mana-v993-exercise-select{

        border-color:
          rgba(
            166,
            129,
            220,
            .68
          ) !important;

      }


      #manaV993StrengthProgress
      .mana-v993-period.active,

      #manaV993StrengthProgress
      .mana-v993-detail-btn.active{

        border:
          1px solid
          var(--mana-progress) !important;

        background:
          rgba(
            166,
            129,
            220,
            .08
          ) !important;

        color:
          var(--mana-progress) !important;

      }


      #manaV993StrengthProgress
      .mana-v993-fill{

        background:
          var(--mana-progress) !important;

      }


      #manaV993StrengthProgress
      .mana-v993-kicker,

      #manaV993StrengthProgress
      .mana-v993-panel-kicker{

        color:
          var(--mana-progress) !important;

      }


      /* Mana28 */

      .mana-v981-root
      .mana-v981-periods,

      .mana-v981-root
      .mana-v981-overall,

      .mana-v981-root
      .mana-v981-card,

      .mana-v981-root
      .mana-v981-message{

        border-color:
          rgba(
            166,
            129,
            220,
            .68
          ) !important;

      }


      .mana-v981-root
      .mana-v981-icon{

        border-color:
          var(--mana-progress) !important;

        color:
          var(--mana-progress) !important;

      }


      .mana-v981-root
      .mana-v981-period.active{

        background:
          rgba(
            166,
            129,
            220,
            .09
          ) !important;

        color:
          var(--mana-progress) !important;

        box-shadow:
          inset
          0
          0
          0
          1px
          var(--mana-progress) !important;

      }


      .mana-v981-root
      .mana-v981-overall-bar span,

      .mana-v981-root
      .mana-v981-bar span{

        background:
          var(--mana-progress) !important;

      }


      /* Mana Lyfe */

      #manaV939Progress2
      .mana-v939-range button,

      #manaV939Progress2
      .mana-v939-card,

      #manaV939Progress2
      .mana-v939-stat,

      #manaV939Progress2
      .mana-v939-insight,

      #manaV939Progress2
      .mana-v939-recent-row{

        border-color:
          rgba(
            166,
            129,
            220,
            .68
          ) !important;

      }


      #manaV939Progress2
      .mana-v939-range button.active{

        border-color:
          var(--mana-progress) !important;

        background:
          rgba(
            166,
            129,
            220,
            .08
          ) !important;

        color:
          var(--mana-progress) !important;

      }


      #manaV939Progress2
      .mana-v939-fill,

      #manaV939Progress2
      .mana-v939-mood-bar{

        background:
          var(--mana-progress) !important;

      }


      #manaV939Progress2
      .mana-v939-kicker{

        color:
          var(--mana-progress) !important;

      }


      /* =====================================
         LEARNING TAB
         ORANGE EVERYWHERE
         ===================================== */

      .mana-v985-head{

        border-bottom-color:
          rgba(
            233,
            138,
            84,
            .45
          ) !important;

      }


      .mana-v985-head::after{

        background:
          linear-gradient(
            90deg,
            var(--mana-learning),
            transparent
          ) !important;

      }


      .mana-v985-kicker{

        color:
          var(--mana-learning) !important;

      }


      .mana-v985-learn-card{

        border:
          1px solid
          rgba(
            233,
            138,
            84,
            .68
          ) !important;

        background:
          linear-gradient(
            145deg,
            #17110e,
            #090909
          ) !important;

      }


      .mana-v985-learn-button
      > span:last-child{

        color:
          var(--mana-learning) !important;

      }


      #manaV933Life
      .mana-v933-learn-item{

        border:
          1px solid
          rgba(
            233,
            138,
            84,
            .68
          ) !important;

        background:
          #0c0908 !important;

      }


      #manaV933Life
      .mana-v933-learn-button
      > span:last-child{

        color:
          var(--mana-learning) !important;

      }


      /* =====================================
         RECLAIM TAB
         GREEN
         ===================================== */

      #manaV933Life
      .mana-v933-card[
        data-mana-reclaim
      ],

      #manaV933Life
      .mana-v933-tool,

      #manaV933Life
      .mana-v933-prompt{

        border-color:
          rgba(
            85,
            217,
            139,
            .62
          ) !important;

      }


      #manaV933Life
      .mana-v933-support{

        border-color:
          var(--mana-reclaim) !important;

      }


      #manaV933Life
      .mana-v933-support
      .mana-v933-primary,

      #manaV933Life
      .mana-v933-support
      .mana-v933-pill{

        border-color:
          var(--mana-reclaim) !important;

        color:
          var(--mana-reclaim) !important;

      }


      /* =====================================
         COACH CHAT
         GREEN
         ===================================== */

      #manaV969CoachChat{

        border-color:
          var(--mana-reclaim) !important;

      }


      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-header{

        border-bottom-color:
          rgba(
            85,
            217,
            139,
            .32
          ) !important;

      }


      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-header-kicker,

      #manaV935LifeChatIntro
      .mana-v935-intro-kicker{

        color:
          var(--mana-reclaim) !important;

      }


      #manaV935LifeChatIntro
      .mana-v935-intro-inner,

      #manaV935LifeChatQuick
      .mana-v935-quick-btn{

        border-color:
          rgba(
            85,
            217,
            139,
            .60
          ) !important;

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     KEEP THIS STYLE LAST

     Older screens inject their own CSS
     when they render, so reinstall after
     navigation.
     ========================================= */

  function settle() {

    installStyles();


    [
      100,
      280,
      650
    ]
      .forEach(
        delay => {

          setTimeout(
            installStyles,
            delay
          );

        }
      );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    settle();


    [
      "mana:program-tab-change",
      "mana:program-change",
      "mana:workout-progress-change",
      "mana:recovery-updated",
      "mana:fuel-updated"
    ]
      .forEach(
        eventName => {

          document.addEventListener(
            eventName,
            settle
          );


          window.addEventListener(
            eventName,
            settle
          );

        }
      );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            `
              #manaV83Tabs .mana-v83-tab,
              [data-v964-launch],
              [data-v978-tab],
              .mana-v85-day,
              .mana-v980-day,
              [data-v993-period],
              [data-v993-detail],
              [data-v981-period],
              [data-v939-range],
              [data-v985-learn],
              [data-v933-learn-open],
              [data-v933-tool-open],
              [data-v933-support-chat]
            `
          )
        ) {

          requestAnimationFrame(
            settle
          );

        }

      }
    );


    window.addEventListener(
      "pageshow",
      settle
    );


    window
      .refreshManaSemanticColours =
        settle;


    window
      .MANA_SEMANTIC_COLOUR_BUILD =
        BUILD;


    console.log(
      "Mana Semantic Colour System",
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
