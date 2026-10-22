
/* ==========================================
   MANA MOVEMENT TRAINING
   SEMANTIC COLOUR SYSTEM v10.29.1

   BUILD: 102910

   PURPOSE
   ------------------------------------------
   COLOURED BORDERS ONLY

   OVERVIEW  = MULTI COLOUR
   WORKOUTS  = BLUE
   FUEL      = YELLOW
   PROGRESS  = PURPLE
   LEARNING  = ORANGE
   RECLAIM   = GREEN
   COACH     = GREEN

   TEXT
   ------------------------------------------
   GOLD / YELLOW
   WHITE
   GREY

   ALL THREE PROGRAMS
   ------------------------------------------
   MANA STRENGTH
   MANA 28
   MANA LYFE

   PRESERVE
   ------------------------------------------
   Workout navigation
   Exercise illustrations
   Fuel logging
   Program block logic
   Coach Hub
   Mobile layouts
   ========================================== */

(() => {
  "use strict";

  const BUILD = "102910";

  const STYLE_ID =
    "mana-v1029-semantic-colour-system";

  const COLORS = {
    overview: "#d4af37",
    program: "#55a8de",
    routine: "#55a8de",
    fuel: "#e0bb51",
    progress: "#a681dc",
    learn: "#e98a54",
    reclaim: "#55d98b"
  };

  let refreshTimer = null;

  /* ==========================================
     COLOUR VARIABLES
     ========================================== */

  function installStyles() {

    document
      .getElementById(STYLE_ID)
      ?.remove();

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `

      :root {

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

        --mana-gold:
          #f3d875;

        --mana-white:
          #f5f5f5;

        --mana-grey:
          #a6a6a6;

        --mana-border-width:
          2px;

      }

      /* =====================================
         SHARED BORDER RULE
         ===================================== */

      #manaV83Content {

        --mana-section-border:
          var(--mana-workout);

      }

      #manaV83Content[
        data-mana-border-tab="program"
      ],

      #manaV83Content[
        data-mana-border-tab="routine"
      ] {

        --mana-section-border:
          var(--mana-workout);

      }

      #manaV83Content[
        data-mana-border-tab="fuel"
      ] {

        --mana-section-border:
          var(--mana-fuel);

      }

      #manaV83Content[
        data-mana-border-tab="progress"
      ] {

        --mana-section-border:
          var(--mana-progress);

      }

      #manaV83Content[
        data-mana-border-tab="learn"
      ] {

        --mana-section-border:
          var(--mana-learning);

      }

      #manaV83Content[
        data-mana-border-tab="reclaim"
      ] {

        --mana-section-border:
          var(--mana-reclaim);

      }

      /* =====================================
         BOTTOM NAVIGATION
         ===================================== */

      #manaV83Tabs
      .mana-v83-tab {

        background:
          #080808 !important;

        border-width:
          2px !important;

        border-style:
          solid !important;

      }

      /* WORKOUTS */

      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="program"
      ],

      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="routine"
      ] {

        border-color:
          var(--mana-workout) !important;

      }

      /* FUEL */

      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="fuel"
      ] {

        border-color:
          var(--mana-fuel) !important;

      }

      /* PROGRESS */

      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="progress"
      ] {

        border-color:
          var(--mana-progress) !important;

      }

      /* LEARNING */

      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="learn"
      ] {

        border-color:
          var(--mana-learning) !important;

      }

      /* RECLAIM */

      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="reclaim"
      ] {

        border-color:
          var(--mana-reclaim) !important;

      }

      /* OVERVIEW MULTI COLOUR */

      #manaV83Tabs
      .mana-v83-tab[
        data-v83-tab="overview"
      ] {

        border:
          2px solid transparent !important;

        background:
          linear-gradient(
            #080808,
            #080808
          ) padding-box,

          linear-gradient(
            90deg,
            var(--mana-workout),
            var(--mana-fuel),
            var(--mana-progress),
            var(--mana-learning),
            var(--mana-reclaim)
          ) border-box !important;

      }

      /* =====================================
         NAVIGATION TEXT REMAINS GOLD
         ===================================== */

      #manaV83Tabs
      .m10140-tab-label,

      #manaV83Tabs
      .m10140-tab-fallback {

        color:
          var(--mana-gold) !important;

      }

      #manaV83Tabs
      .mana-v83-tab
      svg {

        color:
          var(--mana-gold) !important;

        stroke:
          currentColor !important;

      }

      /* =====================================
         STRENGTH OVERVIEW
         ===================================== */

      #manaV964Launchpad
      .mana-v964-launch {

        background:
          #0b0b0b !important;

        border-width:
          2px !important;

        border-style:
          solid !important;

      }

      #manaV964Launchpad
      [data-v964-launch="program"] {

        border-color:
          var(--mana-workout) !important;

      }

      #manaV964Launchpad
      [data-v964-launch="fuel"] {

        border-color:
          var(--mana-fuel) !important;

      }

      #manaV964Launchpad
      [data-v964-launch="progress"] {

        border-color:
          var(--mana-progress) !important;

      }

      #manaV964Launchpad
      [data-v964-launch="learn"] {

        border-color:
          var(--mana-learning) !important;

      }

      #manaV964Launchpad
      [data-v964-launch="profile"] {

        border-color:
          var(--mana-reclaim) !important;

      }

      /* STRENGTH OVERVIEW ICON BORDERS */

      #manaV964Launchpad
      [data-v964-launch="program"]
      .mana-v964-icon {

        border-color:
          var(--mana-workout) !important;

      }

      #manaV964Launchpad
      [data-v964-launch="fuel"]
      .mana-v964-icon {

        border-color:
          var(--mana-fuel) !important;

      }

      #manaV964Launchpad
      [data-v964-launch="progress"]
      .mana-v964-icon {

        border-color:
          var(--mana-progress) !important;

      }

      #manaV964Launchpad
      [data-v964-launch="learn"]
      .mana-v964-icon {

        border-color:
          var(--mana-learning) !important;

      }

      #manaV964Launchpad
      [data-v964-launch="profile"]
      .mana-v964-icon {

        border-color:
          var(--mana-reclaim) !important;

      }

      /* =====================================
         MANA 28 AND MANA LYFE OVERVIEW
         ===================================== */

      .mana-v978-launch[
        data-v978-tab="program"
      ],

      .mana-v978-launch[
        data-v978-tab="routine"
      ] {

        border:
          2px solid var(--mana-workout) !important;

      }

      .mana-v978-launch[
        data-v978-tab="fuel"
      ] {

        border:
          2px solid var(--mana-fuel) !important;

      }

      .mana-v978-launch[
        data-v978-tab="progress"
      ] {

        border:
          2px solid var(--mana-progress) !important;

      }

      .mana-v978-launch[
        data-v978-tab="learn"
      ] {

        border:
          2px solid var(--mana-learning) !important;

      }

      .mana-v978-launch[
        data-v978-tab="reclaim"
      ] {

        border:
          2px solid var(--mana-reclaim) !important;

      }

      /* OVERVIEW ICON BORDERS */

      .mana-v978-launch[
        data-v978-tab="program"
      ] .mana-v978-icon,

      .mana-v978-launch[
        data-v978-tab="routine"
      ] .mana-v978-icon {

        border-color:
          var(--mana-workout) !important;

      }

      .mana-v978-launch[
        data-v978-tab="fuel"
      ] .mana-v978-icon {

        border-color:
          var(--mana-fuel) !important;

      }

      .mana-v978-launch[
        data-v978-tab="progress"
      ] .mana-v978-icon {

        border-color:
          var(--mana-progress) !important;

      }

      .mana-v978-launch[
        data-v978-tab="learn"
      ] .mana-v978-icon {

        border-color:
          var(--mana-learning) !important;

      }

      .mana-v978-launch[
        data-v978-tab="reclaim"
      ] .mana-v978-icon {

        border-color:
          var(--mana-reclaim) !important;

      }

      /* =====================================
         WORKOUT SECTION
         BLUE BORDERS
         ===================================== */

      #manaV83Content
      .mana-v85-day,

      #manaV83Content
      .mana-v980-day {

        border:
          2px solid var(--mana-workout) !important;

      }

      #manaV83Content
      .mana-v85-exercise,

      #manaV83Content
      .mana-v980-exercise {

        border:
          2px solid var(--mana-workout) !important;

      }

      #manaV83Content
      .mana-v980-workout,

      #manaV83Content
      .mana-v980-exercises {

        border:
          2px solid var(--mana-workout) !important;

      }

      #manaV64Exercises
      .mana-v64-card {

        border:
          2px solid var(--mana-workout) !important;

      }

      #manaV64Exercises
      .mana-v970-disclosure,

      #manaV64Exercises
      .mana-v970-action {

        border-color:
          var(--mana-workout) !important;

      }

      /* =====================================
         FUEL SECTION
         YELLOW BORDERS
         ===================================== */

      #manaV980SharedFuel
      .m980-meal,

      #manaV980SharedFuel
      .m10140-meal-visual {

        border:
          2px solid var(--mana-fuel) !important;

      }

      #manaV980SharedFuel
      .m10140-fuel-panel-icon {

        border:
          2px solid var(--mana-fuel) !important;

      }

      /* =====================================
         PROGRESS SECTION
         PURPLE BORDERS
         ===================================== */

      #manaV83Content[
        data-mana-border-tab="progress"
      ] .mana102210-outline,

      #manaV83Content[
        data-mana-border-tab="progress"
      ] .mana-v981-card {

        border:
          2px solid var(--mana-progress) !important;

      }

      /* =====================================
         LEARNING SECTION
         ORANGE BORDERS
         ===================================== */

      #manaV83Content
      .mana-v985-learn-card,

      #manaV933Life
      .mana-v933-learn-item {

        border:
          2px solid var(--mana-learning) !important;

      }

      .mana-v985-head {

        border-bottom-color:
          var(--mana-learning) !important;

      }

      .mana-v985-learn-button,

      .mana-v933-learn-button {

        border-color:
          var(--mana-learning) !important;

      }

      /* =====================================
         ALL PROGRAMS SHARED PANELS
         ===================================== */

      #manaV83Content[
        data-mana-border-tab
      ] .mana102210-outline,

      #manaV83Content[
        data-mana-border-tab
      ] .mana-v927-card,

      #manaV83Content[
        data-mana-border-tab
      ] .mana-v978-card,

      #manaV83Content[
        data-mana-border-tab
      ] .mana-v981-card {

        border:
          2px solid var(--mana-section-border) !important;

      }

      /* =====================================
         RECLAIM
         GREEN BORDERS
         ===================================== */

      #manaV933Life
      [data-mana-reclaim],

      #manaV933Life
      .mana-v933-tool,

      #manaV933Life
      .mana-v933-prompt,

      #manaV933Life
      .mana-v933-support {

        border-color:
          var(--mana-reclaim) !important;

        border-width:
          2px !important;

        border-style:
          solid !important;

      }

      /* =====================================
         COACH CHAT
         GREEN BORDER
         ===================================== */

      #manaV969CoachChat {

        border-color:
          var(--mana-reclaim) !important;

        border-width:
          2px !important;

        border-style:
          solid !important;

      }

      #manaV935LifeChatIntro
      .mana-v935-intro-inner,

      #manaV935LifeChatQuick
      .mana-v935-quick-btn {

        border-color:
          var(--mana-reclaim) !important;

      }

      /* =====================================
         NEXT TRAINING BLOCK
         GREEN REQUEST AREA
         ===================================== */

      #manaV1017ProgramBlock
      .m1017-request {

        border:
          2px solid var(--mana-reclaim) !important;

        background:
          linear-gradient(
            145deg,
            #101713,
            #090909
          ) !important;

      }

      /* GREEN UPGRADE BUTTON */

      #manaV1017ProgramBlock
      .m1017-request-btn,

      #manaV1017ProgramBlock
      #manaV1017Request,

      #manaV83Content
      #manaV1017Request {

        border:
          2px solid var(--mana-reclaim) !important;

        background:
          #164b30 !important;

        color:
          #ffffff !important;

        box-shadow:
          0 0 16px
          rgba(85,217,139,.18)
          !important;

      }

      #manaV1017ProgramBlock
      .m1017-request-btn:hover {

        background:
          #207046 !important;

      }

      #manaV1017ProgramBlock
      .m1017-request-btn:disabled {

        opacity:
          .65 !important;

      }

      /* =====================================
         RESTORE ORIGINAL TEXT COLOURS
         ===================================== */

      #manaV83Content
      .mana102210-accent-text,

      #manaV83Content
      .mana-v85-day-label,

      #manaV83Content
      .mana-v980-category,

      #manaV83Content
      .mana-v85-num,

      #manaV83Content
      .mana-v980-number,

      #manaV83Content
      .mana-v985-kicker,

      #manaV83Content
      .mana-v985-learn-button
      > span:last-child,

      #manaV933Life
      .mana-v933-learn-button
      > span:last-child {

        color:
          var(--mana-gold) !important;

      }

      #manaV83Content
      .mana102210-accent-icon {

        color:
          var(--mana-gold) !important;

      }

      #manaV83Content
      .mana102210-accent-icon svg {

        color:
          var(--mana-gold) !important;

        stroke:
          currentColor !important;

      }

      #manaV933Life
      .mana-v933-support
      .mana-v933-primary,

      #manaV933Life
      .mana-v933-support
      .mana-v933-pill,

      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-header-kicker,

      #manaV935LifeChatIntro
      .mana-v935-intro-kicker {

        color:
          var(--mana-gold) !important;

      }

      /* =====================================
         MOBILE
         ===================================== */

      @media(max-width:600px) {

        #manaV83Tabs
        .mana-v83-tab {

          border-width:
            2px !important;

        }

        #manaV980SharedFuel
        .m980-meal {

          border-width:
            2px !important;

        }

        #manaV1017ProgramBlock
        .m1017-request-btn {

          border-width:
            2px !important;

        }

      }

    `;

    document.head.appendChild(style);

  }

  /* ==========================================
     ACTIVE TAB
     ========================================== */

  function activeTab() {

    const button =
      document.querySelector(
        '#manaV83Tabs ' +
        '.mana-v83-tab.active[data-v83-tab], ' +
        '#manaV83Tabs ' +
        '.mana-v83-tab[aria-selected="true"][data-v83-tab]'
      );

    return (
      button?.dataset?.v83Tab || ""
    );

  }

  /* ==========================================
     SYNCHRONISE BORDER COLOUR
     ========================================== */

  function syncBorderTab() {

    const content =
      document.getElementById(
        "manaV83Content"
      );

    if (!content) return;

    const tab = activeTab();

    if (COLORS[tab] && tab !== "overview") {

      content.dataset.manaBorderTab =
        tab;

      content.style.setProperty(
        "--mana-section-border",
        COLORS[tab]
      );

    } else {

      delete content.dataset.manaBorderTab;

      content.style.removeProperty(
        "--mana-section-border"
      );

    }

  }

  /* ==========================================
     REFRESH
     ========================================== */

  function refresh() {

    installStyles();

    syncBorderTab();

  }

  function scheduleRefresh() {

    clearTimeout(refreshTimer);

    refreshTimer =
      setTimeout(
        refresh,
        35
      );

  }

  function settle() {

    refresh();

    [
      100,
      280,
      650
    ].forEach(delay => {

      setTimeout(
        refresh,
        delay
      );

    });

  }

  /* ==========================================
     NAVIGATION EVENTS
     ========================================== */

  function bindEvents() {

    [
      "mana:program-tab-change",
      "mana:program-change",
      "mana:workout-progress-change",
      "mana:recovery-updated",
      "mana:fuel-updated"
    ].forEach(eventName => {

      document.addEventListener(
        eventName,
        settle
      );

      window.addEventListener(
        eventName,
        settle
      );

    });

    document.addEventListener(
      "click",
      event => {

        if (
          !(event.target instanceof Element)
        ) return;

        if (
          event.target.closest(
            [
              "#manaV83Tabs .mana-v83-tab",
              "[data-v964-launch]",
              "[data-v978-tab]",
              ".mana-v85-day",
              ".mana-v980-day",
              "[data-v985-learn]",
              "[data-v933-learn-open]",
              "[data-v933-tool-open]",
              "[data-v933-support-chat]",
              "#manaV1017Request"
            ].join(",")
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

  }

  /* ==========================================
     INITIALISE
     ========================================== */

  function init() {

    settle();

    bindEvents();

    window.refreshManaSemanticColours =
      settle;

    window.MANA_SEMANTIC_COLOUR_BUILD =
      BUILD;

    console.log(
      "Mana Semantic Border System",
      BUILD
    );

  }

  /* ==========================================
     START
     ========================================== */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );

  } else {

    init();

  }

})();
