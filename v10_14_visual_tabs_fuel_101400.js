
/* ==========================================
   MANA MOVEMENT TRAINING
   FULL VISUAL COLOUR UPGRADE
   VERSION 10.22.1
   BUILD 102210

   WORKOUTS  - BLUE
   FUEL      - YELLOW
   PROGRESS  - PURPLE
   LEARNING  - ORANGE
   RECLAIM   - GREEN

   Applies across:
   - Mana Strength
   - Mana 28
   - Mana Lyfe

   Preserves:
   - Existing program navigation
   - Workout exercise illustrations
   - Next / Previous navigation
   - Fuel logging
   - Mobile layout
   ========================================== */

(() => {
  "use strict";

  const BUILD = "102210";

  const STYLE_ID =
    "mana-v10140-visual-tabs-fuel-style";

  const PALETTE_STYLE_ID =
    "mana-v102210-palette";

  const ASSET_ROOT = "ui/";

  const COLORS = {
    program: "#4699f5",
    routine: "#4699f5",
    fuel: "#f5c641",
    progress: "#b887eb",
    learn: "#f18c45"
  };

  const RGB = {
    program: "70,153,245",
    routine: "70,153,245",
    fuel: "245,198,65",
    progress: "184,135,235",
    learn: "241,140,69"
  };

  const TAB_ASSETS = {
    program: {
      label: "Workouts",
      file: "tab-workout.png",
      symbol: "◆"
    },
    routine: {
      label: "Workouts",
      file: "tab-workout.png",
      symbol: "◆"
    },
    fuel: {
      label: "Fuel",
      file: "tab-fuel.png",
      symbol: "◉"
    },
    progress: {
      label: "Progress",
      file: "tab-progress.png",
      symbol: "▥"
    },
    learn: {
      label: "Learning",
      file: "tab-learning.png",
      symbol: "▤"
    }
  };

  const MEAL_ASSETS = {
    Breakfast: "fuel-breakfast.png",
    Lunch: "fuel-lunch.png",
    Dinner: "fuel-dinner.png",
    Snacks: "fuel-snack.png"
  };

  let tabsObserver = null;
  let contentObserver = null;
  let rootObserver = null;
  let refreshTimer = null;
  let refreshing = false;
  let bound = false;

  function asset(filename) {
    return (
      ASSET_ROOT +
      filename +
      "?v=" +
      BUILD
    );
  }

  function cssColor(key) {
    return COLORS[key] || COLORS.program;
  }

  function cssRGB(key) {
    return RGB[key] || RGB.program;
  }

  /* ==========================================
     INSTALL COMPLETE VISUAL STYLE
     ========================================== */

  function installStyles() {
    document.getElementById(
      STYLE_ID
    )?.remove();

    document.getElementById(
      PALETTE_STYLE_ID
    )?.remove();

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `

      /* ================================
         SHARED TAB ICONS
         ================================ */

      #manaV83Tabs
      .mana-v83-tab.m10140-visual-tab {
        position: relative;
        min-height: 76px;
        padding: 8px 7px 9px;
        overflow: hidden;
        isolation: isolate;
        border-style: solid !important;
        border-width: 2px !important;
        border-radius: 15px;
        border-color:
          rgba(var(--mana-rgb), .60)
          !important;
        transition:
          border-color .18s ease,
          box-shadow .18s ease,
          background .18s ease;
      }

      #manaV83Tabs
      .mana-v83-tab.m10140-visual-tab.active {
        border-color:
          var(--mana-accent) !important;
        box-shadow:
          0 0 0 1px
          rgba(var(--mana-rgb), .16),
          0 0 18px
          rgba(var(--mana-rgb), .15);
      }

      .m10140-tab-inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        pointer-events: none;
      }

      .m10140-tab-icon {
        display: block;
        width: 34px;
        height: 34px;
        object-fit: contain;
        opacity: .88;
        transition:
          transform .18s ease,
          opacity .18s ease;
      }

      .mana-v83-tab.active
      .m10140-tab-icon {
        opacity: 1;
        transform: scale(1.06);
      }

      .m10140-tab-label {
        display: block;
        color:
          var(--mana-accent) !important;
        font-size: 10px;
        line-height: 1.1;
        font-weight: 900;
        letter-spacing: .04em;
        white-space: nowrap;
      }

      .m10140-tab-fallback {
        display: none;
        width: 34px;
        height: 34px;
        align-items: center;
        justify-content: center;
        color:
          var(--mana-accent) !important;
        font-size: 25px;
        font-weight: 800;
      }

      .m10140-visual-tab
      .m10140-tab-icon[hidden] {
        display: none !important;
      }

      .m10140-visual-tab
      .m10140-tab-icon[hidden]
      + .m10140-tab-fallback {
        display: flex;
      }

      /* ================================
         TAB PALETTE
         ================================ */

      #manaV83Tabs
      .mana-v83-tab[data-v83-tab="program"],
      #manaV83Tabs
      .mana-v83-tab[data-v83-tab="routine"] {
        --mana-accent: #4699f5;
        --mana-rgb: 70,153,245;
      }

      #manaV83Tabs
      .mana-v83-tab[data-v83-tab="fuel"] {
        --mana-accent: #f5c641;
        --mana-rgb: 245,198,65;
      }

      #manaV83Tabs
      .mana-v83-tab[data-v83-tab="progress"] {
        --mana-accent: #b887eb;
        --mana-rgb: 184,135,235;
      }

      #manaV83Tabs
      .mana-v83-tab[data-v83-tab="learn"] {
        --mana-accent: #f18c45;
        --mana-rgb: 241,140,69;
      }

      #manaV83Tabs
      .mana-v83-tab[data-v83-tab]
      svg {
        color:
          var(--mana-accent) !important;
        stroke: currentColor;
      }

      /* ================================
         CONTENT PALETTE
         ================================ */

      #manaV83Content {
        --mana-accent: #4699f5;
        --mana-rgb: 70,153,245;
        --mana-border-width: 2px;
      }

      #manaV83Content
      [data-mana-accent-tab="fuel"],
      #manaV83Content[data-mana-accent-tab="fuel"] {
        --mana-accent: #f5c641;
        --mana-rgb: 245,198,65;
      }

      #manaV83Content
      [data-mana-accent-tab="progress"],
      #manaV83Content[data-mana-accent-tab="progress"] {
        --mana-accent: #b887eb;
        --mana-rgb: 184,135,235;
      }

      #manaV83Content
      [data-mana-accent-tab="learn"],
      #manaV83Content[data-mana-accent-tab="learn"] {
        --mana-accent: #f18c45;
        --mana-rgb: 241,140,69;
      }

      .mana102210-outline {
        border-width: 2px !important;
        border-style: solid !important;
        border-color:
          rgba(var(--mana-rgb), .68)
          !important;
      }

      .mana102210-accent-text {
        color:
          var(--mana-accent) !important;
      }

      .mana102210-accent-icon {
        color:
          var(--mana-accent) !important;
      }

      .mana102210-accent-icon svg {
        stroke:
          var(--mana-accent) !important;
      }

      /* ================================
         FUEL MEAL CARDS
         ================================ */

      #manaV980SharedFuel .m980-meal {
        overflow: hidden;
        border-width: 2px !important;
        border-style: solid !important;
        border-color:
          rgba(245,198,65,.70)
          !important;
        border-radius: 18px;
        background:
          linear-gradient(
            145deg,
            #10100d,
            #080808
          );
      }

      #manaV980SharedFuel
      .m980-meal-head {
        display: grid;
        grid-template-columns:
          78px minmax(0,1fr) auto;
        gap: 13px;
        align-items: center;
        min-height: 96px;
        padding: 9px 14px 9px 9px;
        text-align: left;
      }

      .m10140-meal-visual {
        position: relative;
        display: block;
        width: 78px;
        height: 78px;
        overflow: hidden;
        border: 2px solid
          rgba(245,198,65,.65);
        border-radius: 15px;
        background: #050505;
        pointer-events: none;
      }

      .m10140-meal-visual img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }

      #manaV980SharedFuel
      .m980-meal-head > span {
        min-width: 0;
      }

      #manaV980SharedFuel
      .m980-meal-head strong {
        display: block;
        font-size: 15px;
        line-height: 1.15;
      }

      #manaV980SharedFuel
      .m980-meal-head small {
        display: block;
        margin-top: 5px;
        color: #8c8c8c;
        font-size: 10px;
        line-height: 1.25;
      }

      #manaV980SharedFuel
      .m980-meal-head > b {
        color: #f5c641;
        font-size: 22px;
        font-weight: 500;
      }

      /* ================================
         FUEL PANEL ICON
         ================================ */

      #manaV980SharedFuel
      .m10140-fuel-panel-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        margin-right: 9px;
        vertical-align: middle;
        border: 2px solid
          rgba(245,198,65,.70);
        border-radius: 11px;
        background: #090806;
      }

      .m10140-fuel-panel-icon img {
        width: 27px;
        height: 27px;
        object-fit: contain;
      }

      /* ================================
         RECLAIM AND BLOCK UPDATE
         ================================ */

      .mana102210-green-action {
        background: #228653 !important;
        color: #ffffff !important;
        border: 2px solid
          #43c786 !important;
        border-radius: 12px;
        box-shadow:
          0 0 16px
          rgba(67,199,134,.17);
      }

      .mana102210-green-action:hover {
        background: #2ca466 !important;
      }

      .mana102210-green-action svg,
      .mana102210-green-action i {
        color: #ffffff !important;
        stroke: currentColor !important;
      }

      /* ================================
         MOBILE OPTIMISATION
         ================================ */

      @media(max-width:600px) {
        #manaV83Tabs
        .mana-v83-tab.m10140-visual-tab {
          min-height: 70px;
          padding: 7px 5px 8px;
        }

        .m10140-tab-icon,
        .m10140-tab-fallback {
          width: 31px;
          height: 31px;
        }

        .m10140-tab-label {
          font-size: 9px;
        }

        #manaV980SharedFuel
        .m980-meal-head {
          grid-template-columns:
            70px minmax(0,1fr) auto;
          min-height: 86px;
          gap: 11px;
          padding: 8px 12px 8px 8px;
        }

        .m10140-meal-visual {
          width: 70px;
          height: 70px;
          border-radius: 14px;
        }
      }

      @media(max-width:390px) {
        #manaV83Tabs
        .mana-v83-tab.m10140-visual-tab {
          min-height: 66px;
        }

        .m10140-tab-icon,
        .m10140-tab-fallback {
          width: 28px;
          height: 28px;
        }

        .m10140-tab-label {
          font-size: 8px;
        }

        #manaV980SharedFuel
        .m980-meal-head {
          grid-template-columns:
            64px minmax(0,1fr) auto;
          gap: 9px;
        }

        .m10140-meal-visual {
          width: 64px;
          height: 64px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ==========================================
     TAB GRAPHICS
     ========================================== */

  function decorateTabs() {
    const tabs =
      document.getElementById(
        "manaV83Tabs"
      );

    if (!tabs) return;

    tabs.querySelectorAll(
      ".mana-v83-tab[data-v83-tab]"
    ).forEach(button => {
      const key = button.dataset.v83Tab;
      const config = TAB_ASSETS[key];

      if (!config) return;

      button.classList.add(
        "m10140-visual-tab"
      );

      button.style.setProperty(
        "--mana-accent",
        cssColor(key)
      );

      button.style.setProperty(
        "--mana-rgb",
        cssRGB(key)
      );

      button.setAttribute(
        "aria-label",
        config.label
      );

      if (button.querySelector(
        ".m10140-tab-inner"
      )) return;

      const inner =
        document.createElement("span");

      inner.className =
        "m10140-tab-inner";

      const img =
        document.createElement("img");

      img.className =
        "m10140-tab-icon";

      img.src = asset(config.file);
      img.alt = "";
      img.loading = "eager";
      img.setAttribute(
        "aria-hidden",
        "true"
      );

      const fallback =
        document.createElement("span");

      fallback.className =
        "m10140-tab-fallback";

      fallback.textContent =
        config.symbol;

      fallback.setAttribute(
        "aria-hidden",
        "true"
      );

      img.addEventListener(
        "error",
        () => {
          img.hidden = true;
          fallback.style.display = "flex";
        },
        { once: true }
      );

      const label =
        document.createElement("span");

      label.className =
        "m10140-tab-label";

      label.textContent =
        config.label;

      inner.append(
        img,
        fallback,
        label
      );

      button.replaceChildren(inner);
    });
  }

  /* ==========================================
     FUEL MEAL ARTWORK
     ========================================== */

  function decorateFuelMeals() {
    const root =
      document.getElementById(
        "manaV980SharedFuel"
      );

    if (!root) return;

    root.querySelectorAll(
      ".m980-meal-head[data-m980-meal]"
    ).forEach(button => {
      const mealKey =
        button.dataset.m980Meal;

      const filename =
        MEAL_ASSETS[mealKey];

      if (!filename) return;

      if (button.querySelector(
        ".m10140-meal-visual"
      )) return;

      const visual =
        document.createElement("span");

      visual.className =
        "m10140-meal-visual";

      const img =
        document.createElement("img");

      img.src = asset(filename);
      img.alt = "";
      img.loading = "lazy";
      img.setAttribute(
        "aria-hidden",
        "true"
      );

      visual.appendChild(img);

      button.prepend(visual);
    });
  }

  /* ==========================================
     FUEL PANEL ARTWORK
     ========================================== */

  function decorateFuelPanel() {
    const root =
      document.getElementById(
        "manaV980SharedFuel"
      );

    if (!root) return;

    const panel = root.querySelector(
      '[data-m980-panel="meals"]'
    );

    if (!panel) return;

    if (panel.querySelector(
      ".m10140-fuel-panel-icon"
    )) return;

    const label = Array.from(
      panel.querySelectorAll(
        "strong, h3, h4, span"
      )
    ).find(node =>
      (node.textContent || "")
        .trim()
        .toUpperCase() === "MEALS"
    );

    if (!label) return;

    const icon =
      document.createElement("span");

    icon.className =
      "m10140-fuel-panel-icon";

    const img =
      document.createElement("img");

    img.src = asset("tab-fuel.png");
    img.alt = "";
    img.setAttribute(
      "aria-hidden",
      "true"
    );

    icon.appendChild(img);
    label.prepend(icon);
  }

  /* ==========================================
     ACTIVE PROGRAM TAB
     ========================================== */

  function detectActiveTab() {
    const active = document.querySelector(
      '#manaV83Tabs ' +
      '.mana-v83-tab[data-v83-tab].active, ' +
      '#manaV83Tabs ' +
      '.mana-v83-tab[data-v83-tab]' +
      '[aria-selected="true"]'
    );

    const key =
      active?.dataset?.v83Tab;

    return key && COLORS[key]
      ? key
      : null;
  }

  /* ==========================================
     COLOUR EVERY VISIBLE CONTENT PANEL
     ========================================== */

  function decoratePalette() {
    const content =
      document.getElementById(
        "manaV83Content"
      );

    const key = detectActiveTab();

    if (!content || !key) return;

    content.dataset.manaAccentTab =
      key;

    content.style.setProperty(
      "--mana-accent",
      cssColor(key)
    );

    content.style.setProperty(
      "--mana-rgb",
      cssRGB(key)
    );

    const panelSelector = [
      "article",
      "section",
      ".card",
      '[class*="card"]',
      '[class*="panel"]',
      '[class*="tile"]',
      '[class*="exercise"]',
      '[class*="lesson"]',
      '[class*="block"]',
      '[class*="meal"]'
    ].join(",");

    content.querySelectorAll(
      panelSelector
    ).forEach(node => {
      if (node.closest(
        "#manaV83Tabs"
      )) return;

      const cs =
        getComputedStyle(node);

      const width =
        parseFloat(
          cs.borderTopWidth
        ) || 0;

      const visible =
        width > 0 &&
        cs.borderTopStyle !== "none" &&
        cs.borderTopColor !==
          "rgba(0, 0, 0, 0)";

      node.classList.toggle(
        "mana102210-outline",
        visible
      );
    });

    const textSelector = [
      "h1",
      "h2",
      "h3",
      "h4",
      '[class*="title"]',
      '[class*="heading"]'
    ].join(",");

    content.querySelectorAll(
      textSelector
    ).forEach(node => {
      if (node.closest(
        ".mana102210-green-action"
      )) return;

      node.classList.add(
        "mana102210-accent-text"
      );
    });

    const iconSelector = [
      "svg",
      '[class*="icon"]',
      '[class*="Icon"]'
    ].join(",");

    content.querySelectorAll(
      iconSelector
    ).forEach(node => {
      if (node.closest(
        ".mana102210-green-action"
      )) return;

      node.classList.add(
        "mana102210-accent-icon"
      );
    });
  }

  /* ==========================================
     GREEN ACTION BUTTONS
     ========================================== */

  function decorateGreenActions() {
    const selector = [
      "button",
      "a",
      '[role="button"]'
    ].join(",");

    document.querySelectorAll(
      selector
    ).forEach(node => {
      const label = (
        node.textContent || ""
      ).replace(
        /\s+/g,
        " "
      ).trim().toLowerCase();

      const reclaim =
        /\breclaim\b/.test(label) &&
        label.length < 90;

      const blockUpdate =
        /update your new block/.test(label) ||
        /(?:update|request|upgrade)\s+(?:your\s+)?(?:new\s+)?(?:four.week|4.week|next\s+)?block/.test(label);

      node.classList.toggle(
        "mana102210-green-action",
        reclaim || blockUpdate
      );
    });
  }

  /* ==========================================
     REFRESH ALL
     ========================================== */

  function refreshAll() {
    if (refreshing) return;

    refreshing = true;

    try {
      decorateTabs();
      decorateFuelPanel();
      decorateFuelMeals();
      decoratePalette();
      decorateGreenActions();
    } finally {
      refreshing = false;
    }
  }

  function scheduleRefresh(delay = 30) {
    clearTimeout(refreshTimer);

    refreshTimer = setTimeout(
      refreshAll,
      delay
    );
  }

  /* ==========================================
     OBSERVE PROGRAM TABS
     ========================================== */

  function observeTabs() {
    tabsObserver?.disconnect();

    const tabs =
      document.getElementById(
        "manaV83Tabs"
      );

    if (!tabs) return;

    tabsObserver =
      new MutationObserver(() => {
        scheduleRefresh(20);
      });

    tabsObserver.observe(tabs, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "class",
        "aria-selected"
      ]
    });
  }

  /* ==========================================
     OBSERVE PROGRAM CONTENT
     ========================================== */

  function observeContent() {
    contentObserver?.disconnect();

    const content =
      document.getElementById(
        "manaV83Content"
      );

    if (!content) return;

    contentObserver =
      new MutationObserver(() => {
        scheduleRefresh(30);
      });

    contentObserver.observe(content, {
      childList: true,
      subtree: true
    });
  }

  /* ==========================================
     PROGRAM REOPEN HANDLING
     ========================================== */

  function connectObservers() {
    observeTabs();
    observeContent();
  }

  function observeShell() {
    rootObserver?.disconnect();

    rootObserver =
      new MutationObserver(records => {
        const changed = records.some(
          record =>
            Array.from(
              record.addedNodes
            ).some(node =>
              node.nodeType === 1 &&
              (
                node.id === "manaV83Tabs" ||
                node.id === "manaV83Content" ||
                node.querySelector?.(
                  "#manaV83Tabs, #manaV83Content"
                )
              )
            )
        );

        if (changed) {
          connectObservers();
          scheduleRefresh(80);
        }
      });

    rootObserver.observe(
      document.body,
      {
        childList: true,
        subtree: false
      }
    );
  }

  /* ==========================================
     EVENTS
     ========================================== */

  function bindEvents() {
    if (bound) return;
    bound = true;

    [
      "mana:program-tab-change",
      "mana:fuel-updated"
    ].forEach(eventName => {
      window.addEventListener(
        eventName,
        () => {
          scheduleRefresh(20);

          setTimeout(
            connectObservers,
            80
          );
        }
      );
    });

    document.addEventListener(
      "click",
      event => {
        const target =
          event.target;

        if (!(target instanceof Element)) {
          return;
        }

        const selected = target.closest(
          [
            "[data-v83-tab]",
            "[data-v973-tab]",
            "[data-v964-launch]"
          ].join(",")
        );

        if (selected) {
          scheduleRefresh(30);

          setTimeout(
            connectObservers,
            100
          );
        } else {
          scheduleRefresh(80);
        }
      }
    );
  }

  /* ==========================================
     PUBLIC BUILD API
     ========================================== */

  function exposeAPI() {
    window.MANA_VISUAL_TABS_FUEL_BUILD =
      BUILD;

    window.refreshManaVisualTabsFuel =
      refreshAll;
  }

  /* ==========================================
     INITIALISE
     ========================================== */

  function init() {
    installStyles();
    exposeAPI();
    bindEvents();

    refreshAll();

    connectObservers();
    observeShell();

    setTimeout(
      refreshAll,
      350
    );

    setTimeout(() => {
      refreshAll();
      connectObservers();
    }, 900);

    console.log(
      "MANA VISUAL COLOUR UPGRADE",
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
