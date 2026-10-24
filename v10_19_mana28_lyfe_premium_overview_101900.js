
/* ==============================================
   MANA MOVEMENT TRAINING
   PREMIUM OVERVIEW PERFORMANCE
   BUILD 103290

   COMPLETE REPLACEMENT:
   v10_19_mana28_lyfe_premium_overview_101900.js

   PURPOSE
   - Reduce unnecessary Overview refreshes
   - Stop repeated stylesheet removal
   - Stop repeated icon reconstruction
   - Remove permanent Overview observer
   - Retain premium Overview card styling
   - Retain tab artwork
   - Retain Mana 28 and Mana Lyfe navigation
   - Preserve downstream visual upgrades

   DOES NOT CHANGE
   - Mana Strength Overview
   - Workout completion
   - Fuel
   - Progress connections
   - Routine
   - Reset breathing
   - Support Chat
   - Learning
   ============================================== */

(() => {
  "use strict";

  const BUILD = "103290";
  const STYLE_ID = "mana-v1019-overview-style";
  const ASSET_ROOT = "ui/";

  if (
    window.MANA_28_LYFE_PREMIUM_OVERVIEW_BUILD
      === BUILD
  ) return;

  /* ========================================
     PREMIUM STYLING
     ======================================== */

  const CSS = `

    .mana-v978-launchpad {
      max-width: 860px !important;
    }

    .mana-v978-grid {
      gap: 15px !important;
    }

    .mana-v978-launch {
      position: relative !important;
      overflow: hidden !important;
      transform: none;
      border-radius: 22px !important;
      border-color: rgba(230,189,72,.68) !important;
      box-shadow: none !important;
      -webkit-tap-highlight-color: transparent;
    }

    .mana-v978-launch:active {
      opacity: .94;
    }

    .mana-v978-icon {
      overflow: hidden;
      flex-shrink: 0;
      display: grid;
      place-items: center;
    }

    .mana-v978-icon img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
    }

    .mana-v978-launch[data-v1019-tone="workout"]
    .mana-v978-icon {
      border-color: #55a8de !important;
    }

    .mana-v978-launch[data-v1019-tone="fuel"]
    .mana-v978-icon {
      border-color: #e6bd48 !important;
    }

    .mana-v978-launch[data-v1019-tone="progress"]
    .mana-v978-icon {
      border-color: #a77bff !important;
    }

    .mana-v978-launch[data-v1019-tone="learning"]
    .mana-v978-icon {
      border-color: #e98a54 !important;
    }

    .mana-v978-launch[data-v1019-tone="reclaim"]
    .mana-v978-icon {
      border-color: #55d98b !important;
    }

    #manaV1019ProgramBadge {
      display: inline-block;
      color: #f3d875;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: .12em;
      margin-top: 12px;
    }

    /* Mobile: remove card animation flicker */

    @media (max-width: 700px) {

      .mana-v978-launch {
        transition: none !important;
        animation: none !important;
        box-shadow: none !important;
      }

      .mana-v978-icon,
      .mana-v978-icon img {
        transition: none !important;
        animation: none !important;
      }

    }

  `;

  function installStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");

    style.id = STYLE_ID;
    style.textContent = CSS;

    document.head.appendChild(style);
  }

  /* ========================================
     PROGRAM DETECTION
     ======================================== */

  function currentProgram() {
    const title = String(
      document.getElementById("manaV83Title")
        ?.textContent || ""
    ).trim().toUpperCase();

    if (title === "MANA 28") {
      return "mana28";
    }

    if (
      title === "MANA LYFE" ||
      title === "MANA LIFE"
    ) {
      return "lyfe";
    }

    return "";
  }

  function overviewOpen() {
    const shell = document.getElementById(
      "manaV83ProgramShell"
    );

    const tab = document.querySelector(
      "#manaV83Tabs .mana-v83-tab.active"
    );

    return Boolean(
      shell?.classList.contains("open") &&
      tab?.dataset.v83Tab === "overview" &&
      currentProgram()
    );
  }

  /* ========================================
     ICON CONFIGURATION
     ======================================== */

  function iconConfig(program,tab) {
    const map = {
      program: {
        file:"tab-workout.png",
        tone:"workout"
      },
      routine: {
        file:"tab-workout.png",
        tone:"workout"
      },
      fuel: {
        file:"tab-fuel.png",
        tone:"fuel"
      },
      progress: {
        file:"tab-progress.png",
        tone:"progress"
      },
      learn: {
        file:"tab-learning.png",
        tone:"learning"
      }
    };

    if (
      program === "lyfe" &&
      tab === "reclaim"
    ) {
      return {
        file:"tab-learning.png",
        tone:"reclaim"
      };
    }

    return map[tab] || null;
  }

  /* ========================================
     DECORATE ONLY WHEN NEEDED

     An icon is updated only if its
     source or program actually changed.

     No repeated innerHTML replacement.
     ======================================== */

  function decorateIcons() {
    const program = currentProgram();

    const launchpad = document.querySelector(
      "#manaV83Content .mana-v978-launchpad"
    );

    if (!launchpad || !program) return;

    const cards = launchpad.querySelectorAll(
      ".mana-v978-launch[data-v978-tab]"
    );

    cards.forEach(card => {
      const tab = card.dataset.v978Tab;
      const config = iconConfig(program,tab);

      if (!config) return;

      if (
        card.dataset.v1019Tone !== config.tone
      ) {
        card.dataset.v1019Tone = config.tone;
      }

      const icon = card.querySelector(
        ".mana-v978-icon"
      );

      if (!icon) return;

      const existingImage = icon.querySelector(
        "img[data-mana-v1019-image]"
      );

      const src =
        ASSET_ROOT + config.file + "?v=101900";

      if (
        existingImage &&
        existingImage.getAttribute("src") === src
      ) {
        return;
      }

      /* Existing artwork from previous render
         may use an ordinary IMG element. */

      const existingAny = icon.querySelector("img");

      if (
        existingAny &&
        existingAny.getAttribute("src") === src
      ) {
        existingAny.dataset.manaV1019Image = "1";
        return;
      }

      const image = document.createElement("img");

      image.src = src;
      image.alt = "";
      image.setAttribute("aria-hidden","true");
      image.dataset.manaV1019Image = "1";

      icon.replaceChildren(image);
    });
  }

  /* ========================================
     PROGRAM BADGE

     Keep the same node instead of
     removing and rebuilding it.
     ======================================== */

  function decorateBadge() {
    const intro = document.querySelector(
      "#manaV83Content .mana-v978-intro"
    );

    if (!intro) return;

    const program = currentProgram();

    const label = program === "lyfe"
      ? "MOVE • RESET • REBUILD"
      : "4 WEEKS • MOVE WITH PURPOSE";

    let badge = document.getElementById(
      "manaV1019ProgramBadge"
    );

    if (!badge) {
      badge = document.createElement("div");
      badge.id = "manaV1019ProgramBadge";
      intro.appendChild(badge);
    }

    if (badge.textContent !== label) {
      badge.textContent = label;
    }
  }

  /* ========================================
     MANA 28 TITLE
     ======================================== */

  function decorateMana28() {
    if (currentProgram() !== "mana28") {
      return;
    }

    const card = document.querySelector(
      '#manaV83Content ' +
      '.mana-v978-launch[data-v978-tab="program"]'
    );

    const title = card?.querySelector(
      ".mana-v978-title"
    );

    if (
      title &&
      title.textContent !== "Your 4-Week Plan"
    ) {
      title.textContent = "Your 4-Week Plan";
    }
  }

  /* ========================================
     REFRESH

     No stylesheet removal.
     No repeated page rebuilds.
     ======================================== */

  function refresh() {
    if (!overviewOpen()) return;

    decorateIcons();
    decorateBadge();
    decorateMana28();
  }

  /* ========================================
     COALESCE MULTIPLE EVENTS

     Several modules may fire navigation
     events together. Only one frame
     should process them.
     ======================================== */

  let pending = false;

  function scheduleRefresh() {
    if (pending) return;

    pending = true;

    requestAnimationFrame(() => {
      pending = false;
      refresh();
    });
  }

  /* ========================================
     NAVIGATION

     One immediate refresh and one delayed
     compatibility check for the original
     Overview renderer.

     No 120 / 300 / 650ms refresh chain.
     ======================================== */

  let navigationTimer = null;

  function afterNavigation() {
    scheduleRefresh();

    if (navigationTimer !== null) {
      clearTimeout(navigationTimer);
    }

    navigationTimer = setTimeout(() => {
      navigationTimer = null;
      scheduleRefresh();
    },180);
  }

  /* ========================================
     INITIALISE
     ======================================== */

  function init() {
    installStyles();

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        if (event.target.closest(
          [
            "#manaV83Tabs .mana-v83-tab",
            "#manaV80Mana28",
            "#manaV80ManaLife",
            "#manaV80ManaLyfe",
            "#manaV83Back"
          ].join(",")
        )) {
          afterNavigation();
        }
      }
    );

    [
      "mana:program-tab-change",
      "mana:program-change",
      "mana:workout-progress-change"
    ].forEach(name => {
      window.addEventListener(
        name,
        afterNavigation
      );

      document.addEventListener(
        name,
        afterNavigation
      );
    });

    window.addEventListener(
      "pageshow",
      afterNavigation
    );

    /* Preserve compatibility with modules
       calling the old public refresh. */

    window.refreshMana28LyfePremiumOverview =
      afterNavigation;

    window.MANA_28_LYFE_PREMIUM_OVERVIEW_BUILD =
      BUILD;

    afterNavigation();

    console.log(
      "MANA PREMIUM OVERVIEW PERFORMANCE",
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
