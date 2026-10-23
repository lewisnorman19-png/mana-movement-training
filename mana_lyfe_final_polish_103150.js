
/* =============================================
   MANA MOVEMENT TRAINING
   MANA LYFE OVERVIEW + NAVIGATION
   BUILD 103170

   COMPLETE REPLACEMENT FOR:
   mana_lyfe_final_polish_103150.js

   Fixes:
   - Correct actual Overview card selectors
   - Workouts / Routine / Reset / Learning
   - Correct card ordering and navigation
   - Matching icon and text colours
   - Overview Support Chat green
   - Same support-chat action as Reset
   - Green completed workouts
   - Yellow workout text

   Preserves working Routine, Reset, Chat,
   Learning and other program functionality.
   ============================================= */

(() => {
  "use strict";

  const BUILD = "103170";
  const STYLE_ID = "mana-lyfe-polish-103150";
  const BODY_CLASS = "mana-lyfe-103170";

  if (window.MANA_LYFE_FINAL_POLISH === BUILD) {
    return;
  }

  const COLORS = {
    workouts: "#55a8de",
    routine: "#f3d875",
    reset: "#55d98b",
    learning: "#e98a54"
  };

  const CSS = `

    /* =====================================
       OVERVIEW
       ===================================== */

    body.${BODY_CLASS}
    .mana-v978-launchpad
    .mana-v978-grid {
      display: grid !important;
      grid-template-columns:
        repeat(2,minmax(0,1fr)) !important;
      gap: 15px !important;
    }

    body.${BODY_CLASS}
    .mana-v978-launch {
      border: 1px solid
        rgba(230,189,72,.68) !important;
    }

    /* Workouts */

    body.${BODY_CLASS}
    .mana-v978-launch[data-v978-tab="routine"]
    .mana-v978-label {
      color: ${COLORS.workouts} !important;
    }

    body.${BODY_CLASS}
    .mana-v978-launch[data-v978-tab="routine"]
    .mana-v978-icon {
      border-color: ${COLORS.workouts} !important;
    }

    /* Daily Routine */

    body.${BODY_CLASS}
    .mana-v978-launch[data-v978-tab="progress"]
    .mana-v978-label,
    body.${BODY_CLASS}
    .mana-v978-launch[data-v978-tab="progress"]
    .mana-v978-arrow {
      color: ${COLORS.routine} !important;
    }

    body.${BODY_CLASS}
    .mana-v978-launch[data-v978-tab="progress"]
    .mana-v978-icon {
      border-color: ${COLORS.routine} !important;
    }

    /* Reset */

    body.${BODY_CLASS}
    .mana-v978-launch[data-v978-tab="reclaim"] {
      background:
        linear-gradient(145deg,#111812,#090909)
        !important;
    }

    body.${BODY_CLASS}
    .mana-v978-launch[data-v978-tab="reclaim"]
    .mana-v978-label,
    body.${BODY_CLASS}
    .mana-v978-launch[data-v978-tab="reclaim"]
    .mana-v978-arrow {
      color: ${COLORS.reset} !important;
    }

    body.${BODY_CLASS}
    .mana-v978-launch[data-v978-tab="reclaim"]
    .mana-v978-icon {
      border-color: ${COLORS.reset} !important;
    }

    /* Learning */

    body.${BODY_CLASS}
    .mana-v978-launch[data-v978-tab="learn"]
    .mana-v978-label {
      color: ${COLORS.learning} !important;
    }

    /* =====================================
       BOTTOM TAB ICON + TEXT MATCH
       ===================================== */

    body.${BODY_CLASS}
    #manaV83Tabs
    [data-v83-tab="program"] {
      color: ${COLORS.workouts} !important;
    }

    body.${BODY_CLASS}
    #manaV83Tabs
    [data-v83-tab="progress"] {
      color: ${COLORS.routine} !important;
    }

    body.${BODY_CLASS}
    #manaV83Tabs
    [data-v83-tab="reclaim"] {
      color: ${COLORS.reset} !important;
    }

    body.${BODY_CLASS}
    #manaV83Tabs
    [data-v83-tab="learn"] {
      color: ${COLORS.learning} !important;
    }

    body.${BODY_CLASS}
    #manaV83Tabs
    [data-v83-tab="program"] *,
    body.${BODY_CLASS}
    #manaV83Tabs
    [data-v83-tab="progress"] *,
    body.${BODY_CLASS}
    #manaV83Tabs
    [data-v83-tab="reclaim"] *,
    body.${BODY_CLASS}
    #manaV83Tabs
    [data-v83-tab="learn"] * {
      color: inherit !important;
    }

    body.${BODY_CLASS}
    #manaV83Tabs
    .mana-v83-tab {
      border: none !important;
      box-shadow: none !important;
    }

    /* =====================================
       OVERVIEW SUPPORT CHAT — GREEN
       ===================================== */

    body.${BODY_CLASS}
    .ml170-support-card {
      border: 1px solid
        rgba(230,189,72,.68) !important;
      background:
        linear-gradient(145deg,#101813,#090909)
        !important;
    }

    body.${BODY_CLASS}
    .ml170-support-card button,
    body.${BODY_CLASS}
    button.ml170-support-button {
      width: 100% !important;
      min-height: 58px !important;
      border: 1px solid ${COLORS.reset} !important;
      border-radius: 999px !important;
      background: #164b30 !important;
      color: #fff !important;
      font-size: 14px !important;
      font-weight: 900 !important;
      box-shadow: none !important;
    }

    body.${BODY_CLASS}
    .ml170-support-card button:active {
      background: #24764b !important;
    }

    body.${BODY_CLASS}
    .ml170-support-card
    .mana-v933-kicker,
    body.${BODY_CLASS}
    .ml170-support-card
    .mana-v933-pill {
      color: ${COLORS.reset} !important;
    }

    /* =====================================
       COMPLETED LYFE WORKOUTS
       ===================================== */

    body.${BODY_CLASS}
    .mana-v980-day.done {
      position: relative;
      border: 1px solid ${COLORS.reset} !important;
      background:
        linear-gradient(145deg,#132b1d,#0a120c)
        !important;
    }

    body.${BODY_CLASS}
    .mana-v980-day.done::after {
      content: "✓";
      position: absolute;
      right: 12px;
      top: 12px;
      width: 25px;
      height: 25px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #164b30;
      border: 1px solid ${COLORS.reset};
      color: #fff;
      font-size: 17px;
      font-weight: 900;
      pointer-events: none;
    }

    body.${BODY_CLASS}
    .mana-v980-day.done .mana-v980-title,
    body.${BODY_CLASS}
    .mana-v980-day.done .mana-v980-category,
    body.${BODY_CLASS}
    .mana-v980-session .mana-v980-exercise-name {
      color: ${COLORS.routine} !important;
    }

    body.${BODY_CLASS}
    .mana-v980-session .mana-v980-exercise-name {
      font-size: 19px !important;
      line-height: 1.3 !important;
    }

    @media(max-width:700px) {
      body.${BODY_CLASS}
      .mana-v980-session .mana-v980-exercise-name {
        font-size: 18px !important;
      }
    }

    @media(max-width:480px) {
      body.${BODY_CLASS}
      .mana-v978-launchpad
      .mana-v978-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;

  function isLyfe() {
    const shell = document.getElementById(
      "manaV83ProgramShell"
    );

    const title = (
      document.getElementById("manaV83Title")
        ?.textContent || ""
    ).trim().toUpperCase();

    return Boolean(
      shell?.classList.contains("open") &&
      (
        title.includes("MANA LYFE") ||
        title.includes("MANA LIFE")
      )
    );
  }

  function setText(el,value) {
    if (el && el.textContent.trim() !== value) {
      el.textContent = value;
    }
  }

  function labelTab(button,label) {
    if (!button) return;

    const nodes = Array.from(
      button.querySelectorAll("span,small,strong")
    ).filter(el => !el.children.length);

    const node = nodes.find(el =>
      /^(progress|routine|reclaim|reset)$/i.test(
        el.textContent.trim()
      )
    );

    if (node) {
      setText(node,label);
      return;
    }

    const direct = Array.from(
      button.childNodes
    ).find(node =>
      node.nodeType === 3 &&
      /(progress|routine|reclaim|reset)/i.test(
        node.textContent
      )
    );

    if (direct) {
      direct.textContent = direct.textContent.replace(
        /(progress|routine|reclaim|reset)/i,
        label
      );
    }
  }

  function updateBottomTabs() {
    const nav = document.getElementById(
      "manaV83Tabs"
    );

    if (!nav) return;

    const routine = nav.querySelector(
      '[data-v83-tab="progress"]'
    );

    const reset = nav.querySelector(
      '[data-v83-tab="reclaim"]'
    );

    if (isLyfe()) {
      labelTab(routine,"Routine");
      labelTab(reset,"Reset");
    }
  }

  /* =====================================
     ACTUAL V9.78 OVERVIEW CARD ROUTES

     routine  = Workouts
     progress = Daily Routine
     reclaim  = Reset
     learn    = Learning

     Do not modify the route identifiers.
     ===================================== */

  const CARD_DETAILS = {
    routine: {
      label:"WORKOUTS",
      title:"Your Lyfe Workouts",
      text:"Strength, movement, cardio and recovery across your four-week Lyfe program.",
      action:"VIEW WORKOUTS →"
    },

    progress: {
      label:"DAILY ROUTINE",
      title:"Build the Day First",
      text:"Your daily non-negotiables. Build consistency one action at a time.",
      action:"OPEN ROUTINE →"
    },

    reclaim: {
      label:"RESET",
      title:"Reset Now",
      text:"Pause, breathe and follow a guided reset whenever you need it.",
      action:"OPEN RESET →"
    },

    learn: {
      label:"LEARNING",
      title:"Tools for Lyfe",
      text:"Practical principles for movement, recovery, resilience and daily life.",
      action:"START LEARNING →"
    }
  };

  function updateOverview() {
    if (!isLyfe()) return;

    const grid = document.querySelector(
      "#manaV83Content .mana-v978-grid"
    );

    if (!grid) return;

    const order = [
      "routine",
      "progress",
      "reclaim",
      "learn"
    ];

    order.forEach(route => {
      const card = grid.querySelector(
        `.mana-v978-launch[data-v978-tab="${route}"]`
      );

      if (!card) return;

      const item = CARD_DETAILS[route];

      setText(
        card.querySelector(".mana-v978-label"),
        item.label
      );

      setText(
        card.querySelector(".mana-v978-title"),
        item.title
      );

      setText(
        card.querySelector(".mana-v978-text"),
        item.text
      );

      setText(
        card.querySelector(".mana-v978-arrow"),
        item.action
      );

      /* Moves real nodes, keeping handlers. */

      grid.appendChild(card);
    });
  }

  /* =====================================
     OVERVIEW SUPPORT CHAT

     Locate the actual OPEN CHAT button,
     not an assumed old card class.
     ===================================== */

  function enhanceSupportCard() {
    if (!isLyfe()) return;

    const holder = document.getElementById(
      "manaV83Content"
    );

    if (!holder) return;

    const buttons = Array.from(
      holder.querySelectorAll("button")
    );

    buttons.forEach(button => {
      const text = button.textContent.trim();

      if (
        !/^(open chat|open support chat|support chat)\s*[→➜]?$/i
          .test(text)
      ) return;

      if (button.closest(".mana-v978-launch")) {
        return;
      }

      button.classList.add(
        "ml170-support-button"
      );

      /* Identify the surrounding support card. */

      const card = button.closest(
        ".mana-v933-support, .mana-v933-card, " +
        ".m1025-support, .mana-v978-support, " +
        "article, section"
      ) || button.parentElement;

      if (card) {
        card.classList.add(
          "ml170-support-card"
        );
      }

      if (button.dataset.ml170SupportBound) {
        return;
      }

      button.dataset.ml170SupportBound = "1";

      button.addEventListener(
        "click",
        event => {
          if (!isLyfe()) return;

          if (
            typeof window.openManaLifeSupport
            !== "function"
          ) return;

          event.preventDefault();
          event.stopImmediatePropagation();

          window.openManaLifeSupport();
        },
        true
      );
    });
  }

  /* =====================================
     STABLE REFRESH
     ===================================== */

  let queued = false;

  function refresh() {
    const active = isLyfe();

    document.body.classList.toggle(
      BODY_CLASS,
      active
    );

    if (!active) return;

    updateBottomTabs();
    updateOverview();
    enhanceSupportCard();
  }

  function scheduleRefresh() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      refresh();
    });
  }

  function afterNavigation() {
    scheduleRefresh();

    /* Legacy Overview renderer settles
       asynchronously after navigation. */

    setTimeout(scheduleRefresh,220);
    setTimeout(scheduleRefresh,700);
  }

  function init() {
    let style = document.getElementById(
      STYLE_ID
    );

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = CSS;

    [
      "mana:program-tab-change",
      "mana:program-change",
      "mana:workout-progress-change"
    ].forEach(eventName => {
      window.addEventListener(
        eventName,afterNavigation
      );

      document.addEventListener(
        eventName,afterNavigation
      );
    });

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        if (event.target.closest(
          "#manaV83Tabs .mana-v83-tab, " +
          ".mana-v978-launch, " +
          "#manaV83Back"
        )) {
          afterNavigation();
        }
      }
    );

    window.addEventListener(
      "pageshow",
      afterNavigation
    );

    afterNavigation();

    window.MANA_LYFE_FINAL_POLISH = BUILD;

    console.log(
      "MANA LYFE OVERVIEW FIX",
      BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );
  } else {
    init();
  }

})();
