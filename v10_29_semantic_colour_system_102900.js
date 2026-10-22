
/* =================================================
   MANA MOVEMENT TRAINING
   PREMIUM BORDER COLOUR SYSTEM
   VERSION 10.29.2
   BUILD 102920

   OVERVIEW: SEMANTIC MULTI-COLOUR
   WORKOUTS: BLUE
   FUEL: YELLOW
   PROGRESS: PURPLE
   LEARNING: ORANGE
   RECLAIM / COACH: GREEN

   TEXT: ORIGINAL GOLD, WHITE, GREY

   MANA STRENGTH / MANA 28 / MANA LYFE
   ================================================= */

(() => {
  "use strict";

  const BUILD = "102920";
  const STYLE_ID = "mana-v1029-semantic-colour-system";

  const COLORS = {
    program: "#55a8de",
    routine: "#55a8de",
    fuel: "#e0bb51",
    progress: "#a681dc",
    learn: "#e98a54",
    reclaim: "#55d98b",
    profile: "#55d98b"
  };

  const GOLD = "#f3d875";

  let timer = null;
  let observer = null;
  let bound = false;

  /* ===============================================
     PREMIUM BORDER STYLES
     =============================================== */

  function installStyles() {
    document.getElementById(STYLE_ID)?.remove();

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      :root {
        --mana-workout: #55a8de;
        --mana-fuel: #e0bb51;
        --mana-progress: #a681dc;
        --mana-learning: #e98a54;
        --mana-reclaim: #55d98b;
        --mana-gold: #f3d875;
      }

      /* =========================================
         OVERVIEW - ALL THREE PROGRAMS
         ========================================= */

      #manaV964Launchpad .mana-v964-launch,
      .mana-v978-launchpad .mana-v978-launch,
      .mana-v978-launch {
        border-width: 2px !important;
        border-style: solid !important;
        background-color: #0b0b0b !important;
        border-radius: 16px;
        transition: border-color .2s ease,
                    box-shadow .2s ease;
      }

      /* Strength Overview cards */

      #manaV964Launchpad
      [data-v964-launch="program"] {
        border-color: var(--mana-workout) !important;
      }

      #manaV964Launchpad
      [data-v964-launch="fuel"] {
        border-color: var(--mana-fuel) !important;
      }

      #manaV964Launchpad
      [data-v964-launch="progress"] {
        border-color: var(--mana-progress) !important;
      }

      #manaV964Launchpad
      [data-v964-launch="learn"] {
        border-color: var(--mana-learning) !important;
      }

      #manaV964Launchpad
      [data-v964-launch="profile"] {
        border-color: var(--mana-reclaim) !important;
      }

      /* Mana 28 + Mana Lyfe Overview cards */

      .mana-v978-launch[data-v978-tab="program"],
      .mana-v978-launch[data-v978-tab="routine"] {
        border-color: var(--mana-workout) !important;
      }

      .mana-v978-launch[data-v978-tab="fuel"] {
        border-color: var(--mana-fuel) !important;
      }

      .mana-v978-launch[data-v978-tab="progress"] {
        border-color: var(--mana-progress) !important;
      }

      .mana-v978-launch[data-v978-tab="learn"] {
        border-color: var(--mana-learning) !important;
      }

      .mana-v978-launch[data-v978-tab="reclaim"],
      .mana-v978-launch[data-v978-tab="profile"] {
        border-color: var(--mana-reclaim) !important;
      }

      /* Overview icon frames use card colours */

      #manaV964Launchpad
      .mana-v964-launch .mana-v964-icon,
      .mana-v978-launch .mana-v978-icon {
        border-width: 2px !important;
        border-style: solid !important;
      }

      #manaV964Launchpad
      [data-v964-launch="program"] .mana-v964-icon,
      .mana-v978-launch[data-v978-tab="program"]
      .mana-v978-icon,
      .mana-v978-launch[data-v978-tab="routine"]
      .mana-v978-icon {
        border-color: var(--mana-workout) !important;
      }

      #manaV964Launchpad
      [data-v964-launch="fuel"] .mana-v964-icon,
      .mana-v978-launch[data-v978-tab="fuel"]
      .mana-v978-icon {
        border-color: var(--mana-fuel) !important;
      }

      #manaV964Launchpad
      [data-v964-launch="progress"] .mana-v964-icon,
      .mana-v978-launch[data-v978-tab="progress"]
      .mana-v978-icon {
        border-color: var(--mana-progress) !important;
      }

      #manaV964Launchpad
      [data-v964-launch="learn"] .mana-v964-icon,
      .mana-v978-launch[data-v978-tab="learn"]
      .mana-v978-icon {
        border-color: var(--mana-learning) !important;
      }

      #manaV964Launchpad
      [data-v964-launch="profile"] .mana-v964-icon,
      .mana-v978-launch[data-v978-tab="reclaim"]
      .mana-v978-icon {
        border-color: var(--mana-reclaim) !important;
      }

      /* Subtle premium emphasis */

      #manaV964Launchpad .mana-v964-launch:hover,
      .mana-v978-launch:hover {
        box-shadow:
          0 0 0 1px currentColor,
          0 0 13px rgba(255,255,255,.07);
      }

      /* =========================================
         PROGRAM TAB NAVIGATION
         ========================================= */

      #manaV83Tabs .mana-v83-tab {
        border-width: 2px !important;
        border-style: solid !important;
        background-color: #080808 !important;
      }

      #manaV83Tabs
      [data-v83-tab="program"],
      #manaV83Tabs
      [data-v83-tab="routine"] {
        border-color: var(--mana-workout) !important;
      }

      #manaV83Tabs
      [data-v83-tab="fuel"] {
        border-color: var(--mana-fuel) !important;
      }

      #manaV83Tabs
      [data-v83-tab="progress"] {
        border-color: var(--mana-progress) !important;
      }

      #manaV83Tabs
      [data-v83-tab="learn"] {
        border-color: var(--mana-learning) !important;
      }

      #manaV83Tabs
      [data-v83-tab="reclaim"] {
        border-color: var(--mana-reclaim) !important;
      }

      #manaV83Tabs
      [data-v83-tab="overview"] {
        border: 2px solid transparent !important;
        background:
          linear-gradient(#080808,#080808) padding-box,
          linear-gradient(
            90deg,
            var(--mana-workout),
            var(--mana-fuel),
            var(--mana-progress),
            var(--mana-learning),
            var(--mana-reclaim)
          ) border-box !important;
      }

      /* Keep original text colours */

      #manaV83Tabs .m10140-tab-label,
      #manaV83Tabs .m10140-tab-fallback {
        color: var(--mana-gold) !important;
      }

      /* =========================================
         ACTIVE SECTION COLOUR
         ========================================= */

      #manaV83Content[data-mana-border-tab="program"],
      #manaV83Content[data-mana-border-tab="routine"] {
        --mana-section: var(--mana-workout);
      }

      #manaV83Content[data-mana-border-tab="fuel"] {
        --mana-section: var(--mana-fuel);
      }

      #manaV83Content[data-mana-border-tab="progress"] {
        --mana-section: var(--mana-progress);
      }

      #manaV83Content[data-mana-border-tab="learn"] {
        --mana-section: var(--mana-learning);
      }

      #manaV83Content[data-mana-border-tab="reclaim"] {
        --mana-section: var(--mana-reclaim);
      }

      /* Existing cards with a border adopt the
         active section colour. No text styling. */

      #manaV83Content .mana102920-colour-border {
        border-color: var(--mana-section) !important;
        border-width: 2px !important;
        border-style: solid !important;
      }

      /* =========================================
         STRENGTH WORKOUTS
         ========================================= */

      #manaV83Content .mana-v85-day,
      #manaV83Content .mana-v85-exercise,
      #manaV83Content .mana-v980-day,
      #manaV83Content .mana-v980-workout,
      #manaV83Content .mana-v980-exercises,
      #manaV83Content .mana-v980-exercise,
      #manaV64Exercises .mana-v64-card {
        border: 2px solid var(--mana-workout) !important;
      }

      #manaV64Exercises .mana-v970-disclosure,
      #manaV64Exercises .mana-v970-action,
      #manaV64Exercises input,
      #manaV64Exercises select {
        border-color: var(--mana-workout) !important;
      }

      /* =========================================
         FUEL
         ========================================= */

      #manaV980SharedFuel .m980-meal,
      #manaV980SharedFuel .m10140-meal-visual,
      #manaV980SharedFuel .m10140-fuel-panel-icon {
        border: 2px solid var(--mana-fuel) !important;
      }

      /* =========================================
         LEARNING
         ========================================= */

      #manaV83Content .mana-v985-learn-card,
      #manaV933Life .mana-v933-learn-item {
        border: 2px solid var(--mana-learning) !important;
      }

      .mana-v985-head {
        border-bottom-color:
          var(--mana-learning) !important;
      }

      /* =========================================
         RECLAIM / COACH CHAT
         ========================================= */

      #manaV933Life [data-mana-reclaim],
      #manaV933Life .mana-v933-tool,
      #manaV933Life .mana-v933-prompt,
      #manaV933Life .mana-v933-support,
      #manaV969CoachChat {
        border-color: var(--mana-reclaim) !important;
        border-width: 2px !important;
        border-style: solid !important;
      }

      /* =========================================
         NEXT BLOCK UPGRADE - GREEN
         ========================================= */

      #manaV1017ProgramBlock .m1017-request {
        border: 2px solid var(--mana-reclaim) !important;
      }

      #manaV1017ProgramBlock .m1017-request-btn,
      #manaV1017ProgramBlock #manaV1017Request,
      #manaV83Content #manaV1017Request {
        background: #164b30 !important;
        border: 2px solid var(--mana-reclaim) !important;
        color: #ffffff !important;
        box-shadow:
          0 0 16px rgba(85,217,139,.18) !important;
      }

      #manaV1017ProgramBlock .m1017-request-btn:hover {
        background: #207046 !important;
      }

      /* =========================================
         RESTORE GOLD TEXT FROM EARLIER BUILDS
         ========================================= */

      #manaV83Content .mana102210-accent-text,
      #manaV83Content .mana-v85-day-label,
      #manaV83Content .mana-v980-category,
      #manaV83Content .mana-v85-num,
      #manaV83Content .mana-v980-number,
      #manaV83Content .mana-v985-kicker,
      #manaV83Content .mana-v985-learn-button
        > span:last-child,
      #manaV933Life .mana-v933-learn-button
        > span:last-child,
      #manaV933Life .mana-v933-support
        .mana-v933-primary,
      #manaV933Life .mana-v933-support
        .mana-v933-pill {
        color: var(--mana-gold) !important;
      }

      #manaV83Content .mana102210-accent-icon,
      #manaV83Content .mana102210-accent-icon svg {
        color: var(--mana-gold) !important;
      }

      /* The green upgrade button is the exception. */
      #manaV83Content #manaV1017Request {
        color: #fff !important;
      }

      @media(max-width:600px) {
        #manaV964Launchpad .mana-v964-launch,
        .mana-v978-launch,
        #manaV83Tabs .mana-v83-tab {
          border-width: 2px !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* ===============================================
     ACTIVE PROGRAM SECTION
     =============================================== */

  function activeTab() {
    const button = document.querySelector(
      '#manaV83Tabs .mana-v83-tab.active[data-v83-tab], ' +
      '#manaV83Tabs .mana-v83-tab[aria-selected="true"][data-v83-tab]'
    );

    return button?.dataset?.v83Tab || "";
  }

  /* ===============================================
     IDENTIFY AND COLOUR EXISTING WORKOUT BORDERS

     Only outlined items are recoloured.
     Do not alter backgrounds, text or navigation.
     =============================================== */

  function colourExistingBorders() {
    const content =
      document.getElementById("manaV83Content");

    if (!content) return;

    const tab = activeTab();

    if (COLORS[tab] && tab !== "overview") {
      content.dataset.manaBorderTab = tab;
      content.style.setProperty(
        "--mana-section",
        COLORS[tab]
      );
    } else {
      delete content.dataset.manaBorderTab;
      content.style.removeProperty("--mana-section");
    }

    content.querySelectorAll(
      ".mana102920-colour-border"
    ).forEach(node => {
      node.classList.remove(
        "mana102920-colour-border"
      );
    });

    if (!["program","routine"].includes(tab)) {
      return;
    }

    const containers = [
      content,
      document.getElementById("manaV64Exercises")
    ].filter(Boolean);

    const skip = [
      "#manaV1017ProgramBlock",
      "#manaV969CoachChat",
      "#manaV980SharedFuel",
      "[data-mana-reclaim]"
    ].join(",");

    containers.forEach(root => {
      root.querySelectorAll("*").forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        if (node.closest(skip)) return;

        const css = getComputedStyle(node);

        const hasBorder = [
          ["Top","top"],
          ["Right","right"],
          ["Bottom","bottom"],
          ["Left","left"]
        ].some(([side]) => {
          return (
            parseFloat(css["border"+side+"Width"]) >= 1 &&
            css["border"+side+"Style"] !== "none"
          );
        });

        if (!hasBorder) return;

        if (node.matches(
          "input,select,textarea,button"
        )) {
          return;
        }

        node.classList.add(
          "mana102920-colour-border"
        );
      });
    });
  }

  /* ===============================================
     REFRESH
     =============================================== */

  function refresh() {
    installStyles();
    colourExistingBorders();
  }

  function scheduleRefresh() {
    clearTimeout(timer);

    timer = setTimeout(
      refresh,
      50
    );
  }

  function settle() {
    refresh();

    [120,350,700].forEach(delay => {
      setTimeout(
        refresh,
        delay
      );
    });
  }

  /* ===============================================
     NAVIGATION / DYNAMIC CONTENT
     =============================================== */

  function init() {
    settle();

    if (!bound) {
      bound = true;

      [
        "mana:program-tab-change",
        "mana:program-change",
        "mana:workout-progress-change",
        "mana:recovery-updated",
        "mana:fuel-updated"
      ].forEach(name => {
        document.addEventListener(name, settle);
        window.addEventListener(name, settle);
      });

      document.addEventListener("click", event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        if (event.target.closest([
          "#manaV83Tabs .mana-v83-tab",
          "[data-v964-launch]",
          "[data-v978-tab]",
          ".mana-v85-day",
          ".mana-v980-day",
          "[data-v985-learn]",
          "#manaV1017Request"
        ].join(","))) {
          requestAnimationFrame(settle);
        }
      });

      window.addEventListener(
        "pageshow",
        settle
      );

      /* Watch for content added by older workout
         modules, without observing style changes. */

      const root = document.getElementById(
        "manaV83Content"
      );

      if (root) {
        observer = new MutationObserver(
          scheduleRefresh
        );

        observer.observe(root, {
          childList: true,
          subtree: true
        });
      }
    }

    window.refreshManaSemanticColours =
      settle;

    window.MANA_SEMANTIC_COLOUR_BUILD =
      BUILD;

    console.log(
      "MANA PREMIUM BORDER SYSTEM",
      BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
