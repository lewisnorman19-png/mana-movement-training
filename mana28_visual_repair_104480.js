
/* ============================================================
   MANA MOVEMENT TRAINING
   MANA28 VISUAL REPAIR
   BUILD 104480

   COMPLETE JAVASCRIPT FILE

   FIXES
   ------------------------------------------------------------
   1. Overview illustration borders: Mana orange
   2. Small Overview illustrations: white/silver
   3. Profile labels and actions: orange where present
   4. Bottom navigation: fix blank square icons
   5. Use the same icon treatment as Mana Strength
   6. Fuel: keep Mana28 heading visible
   7. Progress: remove decorative purple heading icon

   PRESERVES
   ------------------------------------------------------------
   - Workout schedules and exercises
   - Saved completion records
   - All Fuel and tracking calculations
   - Water and recovery
   - Progress history and percentages
   - Learning and whakatauki
   - All existing navigation and click handlers
   - Mana Strength and ManaLyfe

   LOAD AFTER BUILD 104470
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104480";

  const SHELL_ID = "manaV83ProgramShell";
  const TITLE_ID = "manaV83Title";
  const CONTENT_ID = "manaV83Content";
  const TABS_ID = "manaV83Tabs";

  const STYLE_ID = "mana28VisualRepair104480Style";
  const ACTIVE_CLASS = "mana28-visual-repair-104480";

  const ORANGE = "#FF7927";
  const WHITE = "#FFFFFF";
  const SILVER = "#C1C6CE";

  const ICONS = {
    program: "ui/tab-workout.png",
    fuel: "ui/tab-fuel.png",
    progress: "ui/tab-progress.png",
    learn: "ui/tab-learning.png"
  };

  if (window.MANA28_VISUAL_REPAIR_BUILD === BUILD) {
    return;
  }

  window.MANA28_VISUAL_REPAIR_BUILD = BUILD;

  const $ = id => document.getElementById(id);

  function shell() {
    return $(SHELL_ID);
  }

  function isMana28() {
    const root = shell();
    const title = $(TITLE_ID);

    if (!root || !title) return false;
    if (!root.classList.contains("open")) return false;

    const name = String(title.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();

    return name === "MANA 28";
  }

  function activeTab() {
    return document.querySelector(
      "#" + TABS_ID + " .mana-v83-tab.active"
    )?.dataset?.v83Tab || "";
  }

  /* ============================================================
     CSS
     ============================================================ */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* ======================================
         OVERVIEW ILLUSTRATIONS
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v978-launch .mana-v978-icon {
        border: 1px solid ${ORANGE} !important;
        border-radius: 12px !important;
        background: #0B0D10 !important;
        background-image: none !important;
        box-shadow: none !important;
      }

      /* Keep the artwork details visible.
         Don't invert the whole image because
         that also turns its dark background white. */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v978-launch .mana-v978-icon img {
        display: block !important;
        visibility: visible !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
        filter: grayscale(1) brightness(1.8) !important;
        opacity: 1 !important;
      }

      /* ======================================
         PROFILE LABELS / ACTIONS
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      [data-v978-tab="profile"] .mana-v978-label,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      [data-v978-tab="profile"] .mana-v978-arrow,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana28-profile-action {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      /* ======================================
         BOTTOM NAVIGATION
         RESTORE REAL ILLUSTRATIONS
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID} {
        background: #08090B !important;
        border-top: 1px solid #464D55 !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID} button.mana-v83-tab {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
        background: transparent !important;
        background-image: none !important;
        border: 1px solid transparent !important;
        box-shadow: none !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID} button.mana-v83-tab.active {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
        background: #20160F !important;
        background-image: none !important;
        border: 1px solid ${ORANGE} !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID} .mana28-nav-art {
        position: relative !important;
        display: grid !important;
        place-items: center !important;
        width: 29px !important;
        height: 29px !important;
        min-height: 29px !important;
        flex: 0 0 29px !important;
        margin: 0 auto !important;
        padding: 0 !important;
        overflow: visible !important;
        background: transparent !important;
        border: none !important;
      }

      /* Remove the duplicate background-image
         illustration introduced in build 104470.
         This is what was showing as a solid square. */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID}
      .mana28-nav-picture-104470 {
        display: none !important;
        visibility: hidden !important;
        background-image: none !important;
      }

      /* Show the original PNG illustrations.
         Use the same grayscale treatment as
         the working Mana Strength navigation. */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID}
      button.mana-v83-tab
      .mana28-nav-art img.mana28-keep {
        display: block !important;
        position: static !important;
        visibility: visible !important;
        width: 29px !important;
        height: 29px !important;
        min-width: 29px !important;
        min-height: 29px !important;
        max-width: 29px !important;
        max-height: 29px !important;
        margin: 0 auto !important;
        object-fit: contain !important;
        opacity: 1 !important;
        pointer-events: none !important;
        box-shadow: none !important;
        filter: grayscale(1) brightness(1.8) !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID}
      button.mana-v83-tab.active
      .mana28-nav-art img.mana28-keep {
        filter: grayscale(1) brightness(1.8) !important;
        opacity: 1 !important;
      }

      /* Previous decorative inline SVGs
         must not overlap the restored artwork. */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID}
      .mana-v83-tab:not([data-v83-tab="overview"])
      .mana28-tab-icon {
        display: none !important;
      }

      /* Overview keeps its existing four-square icon. */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID}
      .mana28-nav-overview svg {
        display: block !important;
        width: 24px !important;
        height: 24px !important;
        stroke: currentColor !important;
        fill: none !important;
        filter: none !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID}
      .mana28-nav-label {
        display: block !important;
        color: inherit !important;
        -webkit-text-fill-color: inherit !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        line-height: 1.15 !important;
      }

      /* ======================================
         FUEL HEADER
         ====================================== */

      #${SHELL_ID}.${ACTIVE_CLASS}.mana28-fuel-active
      .mana-v83-head {
        position: sticky !important;
        top: 0 !important;
        z-index: 24501 !important;
        background: #08090B !important;
        padding: 9px 0 13px !important;
        margin-bottom: 15px !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}.mana28-fuel-active
      #${TITLE_ID} {
        visibility: visible !important;
        opacity: 1 !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}.mana28-fuel-active
      .mana-v83-brand-wrap,
      #${SHELL_ID}.${ACTIVE_CLASS}.mana28-fuel-active
      .mana-v83-sub {
        visibility: visible !important;
        opacity: 1 !important;
      }

      /* ======================================
         PROGRESS — REMOVE PURPLE HEADING ICON
         ====================================== */

      #${SHELL_ID}.${ACTIVE_CLASS}.mana28-progress-active
      #${CONTENT_ID}
      .mana-v981-head svg,

      #${SHELL_ID}.${ACTIVE_CLASS}.mana28-progress-active
      #${CONTENT_ID}
      .mana-v981-head img,

      #${SHELL_ID}.${ACTIVE_CLASS}.mana28-progress-active
      #${CONTENT_ID}
      .mana-v981-head [class*="heading-icon"],

      #${SHELL_ID}.${ACTIVE_CLASS}.mana28-progress-active
      #${CONTENT_ID}
      .mana-v981-head [class*="head-icon"] {
        display: none !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}.mana28-progress-active
      #${CONTENT_ID}
      .mana-v981-head h2 {
        padding-left: 0 !important;
        margin-left: 0 !important;
      }

      /* ======================================
         MOBILE
         ====================================== */

      @media(max-width:600px) {
        html body
        #${SHELL_ID}.${ACTIVE_CLASS}
        #${TABS_ID} .mana28-nav-art {
          width: 26px !important;
          height: 26px !important;
          min-height: 26px !important;
          flex-basis: 26px !important;
        }

        html body
        #${SHELL_ID}.${ACTIVE_CLASS}
        #${TABS_ID}
        button.mana-v83-tab
        .mana28-nav-art img.mana28-keep {
          width: 26px !important;
          height: 26px !important;
          min-width: 26px !important;
          min-height: 26px !important;
          max-width: 26px !important;
          max-height: 26px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     ENSURE EACH TAB HAS THE ORIGINAL IMAGE
     ============================================================ */

  function repairNavigation() {
    if (!isMana28()) return;

    const holder = $(TABS_ID);
    if (!holder) return;

    holder.querySelectorAll(
      ".mana-v83-tab[data-v83-tab]"
    ).forEach(button => {
      const key = button.dataset.v83Tab;

      if (key === "overview") return;

      const file = ICONS[key];
      if (!file) return;

      let art = button.querySelector(".mana28-nav-art");

      if (!art) {
        art = document.createElement("span");
        art.className = "mana28-nav-art";
        art.setAttribute("aria-hidden", "true");
        button.prepend(art);
      }

      let image = art.querySelector("img.mana28-keep");

      if (!image) {
        image = document.createElement("img");
        image.className = "mana28-keep";
        image.alt = "";
        image.setAttribute("aria-hidden", "true");
        art.appendChild(image);
      }

      if (image.getAttribute("src") !== file) {
        image.setAttribute("src", file);
      }

      // The older 104470 module sometimes recreates
      // a duplicate background image. CSS hides that
      // duplicate while keeping this actual PNG visible.
    });
  }

  /* ============================================================
     PROGRESS HEADING — REMOVE DECORATION
     ============================================================ */

  function repairProgressHeading() {
    if (!isMana28()) return;
    if (activeTab() !== "progress") return;

    const holder = $(CONTENT_ID);
    const head = holder?.querySelector(".mana-v981-head");

    if (!head) return;

    // Remove only visual icons inside the main heading,
    // never the actual progress data or tracking cards.

    head.querySelectorAll("svg, img").forEach(image => {
      image.style.setProperty(
        "display",
        "none",
        "important"
      );
    });
  }

  /* ============================================================
     ACTIVE VIEW STYLING
     ============================================================ */

  function apply() {
    const root = shell();
    if (!root) return;

    const active = isMana28();
    const tab = active ? activeTab() : "";

    root.classList.toggle(ACTIVE_CLASS, active);

    root.classList.toggle(
      "mana28-fuel-active",
      active && tab === "fuel"
    );

    root.classList.toggle(
      "mana28-progress-active",
      active && tab === "progress"
    );

    if (!active) return;

    repairNavigation();
    repairProgressHeading();
  }

  /* ============================================================
     FUEL ENTRY SCROLL
     ============================================================ */

  let previousTab = "";

  function trackTab() {
    if (!isMana28()) {
      previousTab = "";
      return;
    }

    const tab = activeTab();

    if (tab === previousTab) return;

    previousTab = tab;

    if (tab !== "fuel") return;

    // Execute only on entering Fuel.
    // Do not interfere with scrolling while
    // selecting or logging individual meals.

    setTimeout(() => {
      if (!isMana28()) return;
      if (activeTab() !== "fuel") return;

      const root = shell();

      if (root) root.scrollTop = 0;

      const scroller = document.scrollingElement;

      if (scroller) scroller.scrollTop = 0;
    }, 120);
  }

  /* ============================================================
     STABLE UPDATE SCHEDULER
     ============================================================ */

  let queued = false;

  function schedule() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      apply();
      trackTab();
    });
  }

  /* ============================================================
     INITIALISE
     ============================================================ */

  function init() {
    installStyles();

    apply();
    trackTab();

    const root = shell();

    if (root && window.MutationObserver) {
      const observer = new MutationObserver(schedule);

      observer.observe(root, {
        childList: true,
        subtree: true
      });
    }

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest(
            "#manaV83Tabs, " +
            "#manaV83ProgramShell, " +
            "#manaV80Mana28"
          )
        ) {
          schedule();
        }
      },
      true
    );

    window.addEventListener(
      "mana:program-tab-change",
      schedule
    );

    window.addEventListener(
      "pageshow",
      schedule
    );

    console.log(
      "[Mana28] Visual repair ready — " + BUILD
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
