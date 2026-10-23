
/* =================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — NAVIGATION + WORKOUT POLISH
   BUILD 103150

   OVERVIEW:
   - Align card names with current tabs
   - Reclaim becomes Reset
   - Reset is green
   - Support Chat shares Reset's action

   WORKOUTS:
   - Keep existing structure and saved progress
   - Completed workouts green with tick
   - Exercise text premium yellow
   - No new completion data

   PRESERVE:
   - Mana Strength and Mana 28
   - Daily Routine checklist
   - Reset Now questions
   - Support chat
   - Learning
   - Existing workout completion logic
   ================================================= */

(() => {
  "use strict";

  const BUILD = "103150";
  const STYLE_ID = "mana-lyfe-polish-103150";

  if (window.MANA_LYFE_FINAL_POLISH === BUILD) return;

  const CSS = `

    :root {
      --ml150-gold: #f3d875;
      --ml150-border: rgba(230,189,72,.65);
      --ml150-green: #55d98b;
      --ml150-green-dark: #164b30;
    }

    /* =====================================
       RESET BOTTOM TAB
       ===================================== */

    body.mana-lyfe-103150
    #manaV83Tabs
    [data-v83-tab="reclaim"] {
      color: var(--ml150-green) !important;
      border: 0 !important;
      box-shadow: none !important;
      background: transparent !important;
    }

    body.mana-lyfe-103150
    #manaV83Tabs
    [data-v83-tab="reclaim"] svg {
      color: var(--ml150-green) !important;
      stroke: currentColor;
    }

    /* =====================================
       OVERVIEW RESET CARD
       ===================================== */

    body.mana-lyfe-103150
    .mana-v978-launch[data-v978-tab="reclaim"] {
      border: 1px solid var(--ml150-border) !important;
      background: linear-gradient(
        145deg,#111812,#090909
      ) !important;
    }

    body.mana-lyfe-103150
    .mana-v978-launch[data-v978-tab="reclaim"]
    .mana-v978-icon {
      color: var(--ml150-green) !important;
      border-color: var(--ml150-green) !important;
    }

    body.mana-lyfe-103150
    .mana-v978-launch[data-v978-tab="reclaim"]
    .mana-v978-title {
      color: #fff !important;
    }

    /* =====================================
       SUPPORT CHAT
       ===================================== */

    body.mana-lyfe-103150
    .mana-v933-support,
    body.mana-lyfe-103150
    .mana-v933-card.mana-v933-support {
      border: 1px solid var(--ml150-border) !important;
      background: linear-gradient(
        145deg,#111812,#090909
      ) !important;
    }

    body.mana-lyfe-103150
    [data-v933-support-chat],
    body.mana-lyfe-103150
    .mana-v933-support .mana-v933-primary,
    body.mana-lyfe-103150
    #ml140OpenChat {
      border: 1px solid var(--ml150-green) !important;
      border-radius: 999px !important;
      background: var(--ml150-green-dark) !important;
      color: #fff !important;
      box-shadow: none !important;
    }

    /* =====================================
       LYFE WORKOUT COMPLETION

       Existing .done class is the source
       of truth for completed workouts.
       ===================================== */

    body.mana-lyfe-103150
    .mana-v980-day.done {
      position: relative;
      border: 1px solid var(--ml150-green) !important;
      background: linear-gradient(
        145deg,#132b1d,#0a120c
      ) !important;
      box-shadow: none !important;
    }

    body.mana-lyfe-103150
    .mana-v980-day.done .mana-v980-title,
    body.mana-lyfe-103150
    .mana-v980-day.done .mana-v980-category {
      color: var(--ml150-gold) !important;
    }

    body.mana-lyfe-103150
    .mana-v980-day.done .mana-v980-number {
      background: #164b30 !important;
      border-color: var(--ml150-green) !important;
      color: var(--ml150-green) !important;
    }

    body.mana-lyfe-103150
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
      background: var(--ml150-green-dark);
      border: 1px solid var(--ml150-green);
      color: #fff;
      font-size: 17px;
      font-weight: 900;
      pointer-events: none;
    }

    /* =====================================
       LYFE EXERCISE DETAILS
       PREMIUM YELLOW TEXT
       ===================================== */

    body.mana-lyfe-103150
    .mana-v980-session
    .mana-v980-exercise-name {
      color: var(--ml150-gold) !important;
      font-size: 19px !important;
      line-height: 1.3 !important;
    }

    body.mana-lyfe-103150
    .mana-v980-session
    .mana-v980-exercise-detail {
      color: #c7c7c7 !important;
      font-size: 15px !important;
      line-height: 1.5 !important;
    }

    body.mana-lyfe-103150
    .mana-v980-session
    .mana-v980-note-title {
      color: var(--ml150-gold) !important;
    }

    /* =====================================
       PRESERVE OTHER PROGRAMS
       ===================================== */

    /* All styles above are scoped to
       the active Mana Lyfe program only. */

    @media (max-width: 700px) {
      body.mana-lyfe-103150
      .mana-v980-session
      .mana-v980-exercise-name {
        font-size: 18px !important;
      }
    }
  `;

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

  function setText(element, text) {
    if (!element) return;
    if (element.textContent.trim() === text) return;
    element.textContent = text;
  }

  /* =====================================
     RESET TAB LABEL

     Keep the original data-v83-tab attribute.
     Do not change the application's router.
     ===================================== */

  function updateResetTab() {
    const tab = document.querySelector(
      '#manaV83Tabs [data-v83-tab="reclaim"]'
    );

    if (!tab) return;

    const nodes = Array.from(
      tab.querySelectorAll("span,small,strong")
    ).filter(node => !node.children.length);

    let label = nodes.find(node =>
      /^(reclaim|reset)$/i.test(
        node.textContent.trim()
      )
    );

    if (!label) {
      const leaves = Array.from(tab.childNodes)
        .filter(node => node.nodeType === 3);

      const textNode = leaves.find(node =>
        /reclaim/i.test(node.textContent)
      );

      if (textNode && isLyfe()) {
        textNode.textContent =
          textNode.textContent.replace(
            /reclaim/gi,"Reset"
          );
      }

      return;
    }

    if (isLyfe()) {
      setText(label,"Reset");
    } else if (
      label.textContent.trim() === "Reset"
    ) {
      setText(label,"Reclaim");
    }
  }

  /* =====================================
     OVERVIEW CARD LABELS

     Preserve artwork, links and handlers.
     ===================================== */

  function updateOverview() {
    if (!isLyfe()) return;

    const cardMap = [
      ["program","Workouts"],
      ["routine","Daily Routine"],
      ["progress","Daily Routine"],
      ["reclaim","Reset"],
      ["learn","Learning"]
    ];

    cardMap.forEach(([tab,name]) => {
      const card = document.querySelector(
        `.mana-v978-launch[data-v978-tab="${tab}"]`
      );

      if (!card) return;

      setText(
        card.querySelector(".mana-v978-title"),
        name
      );
    });

    const reclaim = document.querySelector(
      '.mana-v978-launch[data-v978-tab="reclaim"]'
    );

    if (reclaim) {
      const label = reclaim.querySelector(
        ".mana-v978-label"
      );

      if (label) setText(label,"RESET");
    }

    /* Existing overview cards use their
       original tab routing attributes. */
  }

  /* =====================================
     SUPPORT CHAT

     Both buttons use the same existing
     Mana Lyfe support-chat function.
     ===================================== */

  function openSupport(event) {
    if (!isLyfe()) return;

    const target = event.target;

    if (!(target instanceof Element)) return;

    const button = target.closest(
      [
        "#manaV83Content [data-v933-support-chat]",
        "#manaV83Content .mana-v933-support .mana-v933-primary"
      ].join(",")
    );

    if (!button) return;

    if (
      typeof window.openManaLifeSupport !== "function"
    ) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    window.openManaLifeSupport();
  }

  /* =====================================
     STABLE REFRESH
     ===================================== */

  let pending = false;

  function refresh() {
    const active = isLyfe();

    document.body.classList.toggle(
      "mana-lyfe-103150",active
    );

    updateResetTab();

    if (active) {
      updateOverview();
    }
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

    /* A single delayed check for legacy
       page rendering, not a repeating loop. */

    setTimeout(scheduleRefresh,180);
  }

  function init() {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    document.addEventListener(
      "click",openSupport,true
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
          ".mana-v980-day",
          ".mana-v978-launch"
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
      "MANA LYFE FINAL POLISH",BUILD
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
