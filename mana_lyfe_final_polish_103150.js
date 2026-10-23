
/* ================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — FINAL NAVIGATION POLISH
   BUILD 103160

   OVERVIEW
   - Match actual bottom-tab order
   - Correct Routine / Reset card positions
   - Premium yellow card borders
   - Support Chat green

   BOTTOM NAVIGATION
   - Daily Routine: yellow icon and text
   - Reset: green icon and text
   - No icon borders

   SUPPORT
   - Overview Chat uses Reset's chat action

   WORKOUTS
   - Completed workout green with tick
   - Exercise headings stay premium yellow
   - Existing completion data preserved

   No changes to Mana Strength or Mana 28.
   ================================================ */

(() => {
  "use strict";

  const BUILD = "103160";
  const STYLE_ID = "mana-lyfe-polish-103150";
  const BODY_CLASS = "mana-lyfe-103160";

  if (window.MANA_LYFE_FINAL_POLISH === BUILD) {
    return;
  }

  const CSS = `

    :root {
      --ml160-gold: #f3d875;
      --ml160-border: rgba(230,189,72,.68);
      --ml160-green: #55d98b;
      --ml160-green-dark: #164b30;
    }

    /* =====================================
       NAVIGATION: DAILY ROUTINE
       ===================================== */

    body.${BODY_CLASS}
    #manaV83Tabs
    [data-v83-tab="progress"] {
      color: var(--ml160-gold) !important;
      border: none !important;
      box-shadow: none !important;
      background: transparent !important;
    }

    body.${BODY_CLASS}
    #manaV83Tabs
    [data-v83-tab="progress"] svg,
    body.${BODY_CLASS}
    #manaV83Tabs
    [data-v83-tab="progress"] img {
      color: var(--ml160-gold) !important;
      border: none !important;
      box-shadow: none !important;
    }

    /* =====================================
       NAVIGATION: RESET
       ===================================== */

    body.${BODY_CLASS}
    #manaV83Tabs
    [data-v83-tab="reclaim"] {
      color: var(--ml160-green) !important;
      border: none !important;
      box-shadow: none !important;
      background: transparent !important;
    }

    body.${BODY_CLASS}
    #manaV83Tabs
    [data-v83-tab="reclaim"] svg {
      color: var(--ml160-green) !important;
      stroke: currentColor !important;
      border: none !important;
    }

    /* Keep image artwork without recolouring
       the image pixels themselves. */

    body.${BODY_CLASS}
    #manaV83Tabs
    [data-v83-tab="reclaim"] img {
      border: none !important;
      box-shadow: none !important;
    }

    /* =====================================
       OVERVIEW CARD COLOURS
       ===================================== */

    body.${BODY_CLASS}
    .mana-v978-launch[data-v978-tab="reclaim"],
    body.${BODY_CLASS}
    .mana-v978-launch[data-v978-tab="progress"],
    body.${BODY_CLASS}
    .mana-v978-launch[data-v978-tab="routine"] {
      border: 1px solid
        var(--ml160-border) !important;
    }

    /* Daily Routine text/icon = gold */

    body.${BODY_CLASS}
    .mana-v978-launch
    .ml160-routine-title {
      color: var(--ml160-gold) !important;
    }

    body.${BODY_CLASS}
    .mana-v978-launch
    .ml160-routine-icon {
      color: var(--ml160-gold) !important;
      border-color: var(--ml160-border) !important;
    }

    /* Reset icon and label = green */

    body.${BODY_CLASS}
    .mana-v978-launch[data-v978-tab="reclaim"]
    .mana-v978-icon {
      color: var(--ml160-green) !important;
      border-color: var(--ml160-green) !important;
    }

    body.${BODY_CLASS}
    .mana-v978-launch[data-v978-tab="reclaim"]
    .mana-v978-label {
      color: var(--ml160-green) !important;
    }

    body.${BODY_CLASS}
    .mana-v978-launch[data-v978-tab="reclaim"]
    .mana-v978-title {
      color: var(--ml160-gold) !important;
    }

    /* =====================================
       OVERVIEW SUPPORT CHAT
       SAME AS RESET SUPPORT BUTTON
       ===================================== */

    body.${BODY_CLASS}
    .mana-v933-card.mana-v933-support {
      border: 1px solid
        var(--ml160-border) !important;
      background: linear-gradient(
        145deg,#111812,#090909
      ) !important;
    }

    body.${BODY_CLASS}
    .mana-v933-support .mana-v933-kicker,
    body.${BODY_CLASS}
    .mana-v933-support .mana-v933-pill {
      color: var(--ml160-green) !important;
    }

    body.${BODY_CLASS}
    .mana-v933-support .mana-v933-pill {
      border: 1px solid
        var(--ml160-green) !important;
      background: #10291a !important;
    }

    body.${BODY_CLASS}
    .mana-v933-support [data-v933-support-chat],
    body.${BODY_CLASS}
    .mana-v933-support .mana-v933-primary,
    body.${BODY_CLASS}
    #ml140OpenChat {
      width: 100% !important;
      min-height: 58px !important;
      border: 1px solid
        var(--ml160-green) !important;
      border-radius: 999px !important;
      background:
        var(--ml160-green-dark) !important;
      color: #ffffff !important;
      box-shadow: none !important;
      font-size: 14px !important;
      font-weight: 900 !important;
      cursor: pointer;
    }

    body.${BODY_CLASS}
    .mana-v933-support [data-v933-support-chat]:active {
      background: #237147 !important;
    }

    /* =====================================
       LYFE WORKOUTS — COMPLETED CARDS
       ===================================== */

    body.${BODY_CLASS}
    .mana-v980-day.done {
      position: relative;
      border: 1px solid
        var(--ml160-green) !important;
      background: linear-gradient(
        145deg,#132b1d,#0a120c
      ) !important;
      box-shadow: none !important;
    }

    body.${BODY_CLASS}
    .mana-v980-day.done::after {
      content: "✓";
      position: absolute;
      top: 12px;
      right: 12px;
      display: grid;
      place-items: center;
      width: 25px;
      height: 25px;
      border: 1px solid var(--ml160-green);
      border-radius: 50%;
      background: var(--ml160-green-dark);
      color: #fff;
      font-size: 17px;
      font-weight: 900;
      pointer-events: none;
    }

    body.${BODY_CLASS}
    .mana-v980-day.done .mana-v980-number {
      background: #164b30 !important;
      border-color: var(--ml160-green) !important;
      color: var(--ml160-green) !important;
    }

    body.${BODY_CLASS}
    .mana-v980-day.done .mana-v980-title,
    body.${BODY_CLASS}
    .mana-v980-day.done .mana-v980-category {
      color: var(--ml160-gold) !important;
    }

    /* Workout detail text stays gold */

    body.${BODY_CLASS}
    .mana-v980-session
    .mana-v980-exercise-name {
      color: var(--ml160-gold) !important;
      font-size: 19px !important;
      line-height: 1.3 !important;
    }

    body.${BODY_CLASS}
    .mana-v980-session
    .mana-v980-exercise-detail {
      color: #c7c7c7 !important;
      font-size: 15px !important;
      line-height: 1.5 !important;
    }

    body.${BODY_CLASS}
    .mana-v980-session
    .mana-v980-note-title {
      color: var(--ml160-gold) !important;
    }

    @media(max-width:700px) {
      body.${BODY_CLASS}
      .mana-v980-session
      .mana-v980-exercise-name {
        font-size: 18px !important;
      }
    }
  `;

  /* ==========================================
     DETECT ACTIVE PROGRAM
     ========================================== */

  function isLyfe() {
    const shell = document.getElementById(
      "manaV83ProgramShell"
    );

    const title = String(
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

  /* ==========================================
     TEXT HELPERS
     ========================================== */

  function setText(node,text) {
    if (!node) return;

    if (node.textContent.trim() !== text) {
      node.textContent = text;
    }
  }

  function updateLabel(tab,text) {
    if (!tab) return;

    const leaves = Array.from(
      tab.querySelectorAll("span,small,strong")
    ).filter(node =>
      node.children.length === 0
    );

    const existing = leaves.find(node =>
      /^(progress|routine|reclaim|reset)$/i.test(
        node.textContent.trim()
      )
    );

    if (existing) {
      setText(existing,text);
      return;
    }

    const textNode = Array.from(
      tab.childNodes
    ).find(node =>
      node.nodeType === 3 &&
      /(progress|routine|reclaim|reset)/i.test(
        node.textContent
      )
    );

    if (textNode) {
      textNode.textContent =
        textNode.textContent.replace(
          /(progress|routine|reclaim|reset)/i,
          text
        );
    }
  }

  /* ==========================================
     BOTTOM TAB COLOURS AND LABELS
     ========================================== */

  function updateTabs() {
    if (!isLyfe()) return;

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

    updateLabel(routine,"Routine");
    updateLabel(reset,"Reset");

    /* Preserve existing route identifiers.
       Do not rebuild tab elements. */
  }

  /* ==========================================
     OVERVIEW CARD MATCHING

     Order cards by their actual bottom tab
     positions, not by guessed positions.
     ========================================== */

  function updateOverview() {
    if (!isLyfe()) return;

    const grid = document.querySelector(
      ".mana-v978-launchpad .mana-v978-grid"
    );

    if (!grid) return;

    const cards = Array.from(
      grid.querySelectorAll(
        ".mana-v978-launch[data-v978-tab]"
      )
    );

    if (!cards.length) return;

    const routine = cards.find(card =>
      ["routine","progress"].includes(
        card.dataset.v978Tab
      )
    );

    const reset = cards.find(card =>
      card.dataset.v978Tab === "reclaim"
    );

    if (routine) {
      setText(
        routine.querySelector(".mana-v978-title"),
        "Daily Routine"
      );

      routine.querySelector(
        ".mana-v978-title"
      )?.classList.add("ml160-routine-title");

      routine.querySelector(
        ".mana-v978-icon"
      )?.classList.add("ml160-routine-icon");
    }

    if (reset) {
      setText(
        reset.querySelector(".mana-v978-title"),
        "Reset"
      );

      setText(
        reset.querySelector(".mana-v978-label"),
        "RESET"
      );
    }

    /* Match positions of Routine and Reset
       to the navigation's actual order. */

    const nav = document.getElementById(
      "manaV83Tabs"
    );

    if (!nav || !routine || !reset) return;

    const navButtons = Array.from(
      nav.querySelectorAll(
        ".mana-v83-tab[data-v83-tab]"
      )
    );

    const routineIndex = navButtons.findIndex(
      button => button.dataset.v83Tab === "progress"
    );

    const resetIndex = navButtons.findIndex(
      button => button.dataset.v83Tab === "reclaim"
    );

    if (routineIndex < 0 || resetIndex < 0) return;

    const gridCards = Array.from(grid.children);

    const routinePosition = gridCards.indexOf(routine);
    const resetPosition = gridCards.indexOf(reset);

    if (routinePosition < 0 || resetPosition < 0) {
      return;
    }

    const correct =
      (routineIndex < resetIndex) ===
      (routinePosition < resetPosition);

    if (correct) return;

    /* Swap only these two elements.
       Do not replace or clone either card. */

    const marker = document.createComment(
      "Mana Lyfe card swap"
    );

    grid.insertBefore(marker,routine);
    grid.insertBefore(routine,reset);
    grid.insertBefore(reset,marker);
    marker.remove();
  }

  /* ==========================================
     SUPPORT CHAT — SAME ACTION AS RESET

     Call existing Mana Lyfe support function.
     Capture once and prevent double actions.
     ========================================== */

  function handleSupport(event) {
    if (!isLyfe()) return;

    if (!(event.target instanceof Element)) return;

    const button = event.target.closest(
      "#manaV83Content " +
      ".mana-v933-support " +
      "[data-v933-support-chat]"
    );

    if (!button) return;

    if (
      typeof window.openManaLifeSupport !== "function"
    ) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    window.openManaLifeSupport();
  }

  /* ==========================================
     LIGHTWEIGHT REFRESH
     ========================================== */

  let pending = false;

  function refresh() {
    const active = isLyfe();

    document.body.classList.toggle(
      BODY_CLASS,active
    );

    if (!active) return;

    updateTabs();
    updateOverview();
  }

  function scheduleRefresh() {
    if (pending) return;

    pending = true;

    requestAnimationFrame(() => {
      pending = false;
      refresh();
    });
  }

  function afterNavigation() {
    scheduleRefresh();

    /* One extra check for existing
       asynchronous program rendering. */

    setTimeout(scheduleRefresh,180);
  }

  /* ==========================================
     INITIALISE
     ========================================== */

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

    document.addEventListener(
      "click",handleSupport,true
    );

    [
      "mana:program-tab-change",
      "mana:program-change",
      "mana:workout-progress-change"
    ].forEach(name => {
      window.addEventListener(
        name,afterNavigation
      );

      document.addEventListener(
        name,afterNavigation
      );
    });

    document.addEventListener("click",event => {
      if (!(event.target instanceof Element)) return;

      if (event.target.closest(
        [
          "#manaV83Tabs .mana-v83-tab",
          ".mana-v978-launch",
          ".mana-v980-day"
        ].join(",")
      )) {
        afterNavigation();
      }
    });

    window.addEventListener(
      "pageshow",afterNavigation
    );

    refresh();

    window.MANA_LYFE_FINAL_POLISH = BUILD;

    console.log(
      "MANA LYFE NAVIGATION POLISH",
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
