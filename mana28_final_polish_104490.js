/* ============================================================
   MANA MOVEMENT TRAINING
   MANA28 FINAL POLISH
   BUILD 104490

   COMPLETE JAVASCRIPT FILE

   FIXES
   ------------------------------------------------------------
   1. Overview card small text to orange
      - WORKOUTS / FUEL / PROGRESS / LEARN
      - VIEW WORKOUTS / OPEN FUEL / VIEW PROGRESS / LEARN MORE

   2. Fuel heading restored
      - MANA 28 • FUEL
      - Fuel with purpose
      - supporting paragraph visible

   3. Progress yellow icon boxes removed

   4. Progress bars all orange

   PRESERVES
   ------------------------------------------------------------
   - Workouts and completion ticks
   - Saved progress
   - Fuel meals and calculations
   - Water and recovery
   - Learning content
   - Bottom tab functionality
   - Mana Strength and ManaLyfe

   LOAD AFTER BUILD 104480
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104490";

  const SHELL_ID = "manaV83ProgramShell";
  const TITLE_ID = "manaV83Title";
  const CONTENT_ID = "manaV83Content";
  const TABS_ID = "manaV83Tabs";

  const STYLE_ID = "mana28FinalPolish104490Style";
  const ACTIVE_CLASS = "mana28-final-polish-104490";

  const ORANGE = "#FF7927";
  const WHITE = "#FFFFFF";
  const SILVER = "#C1C6CE";

  if (window.MANA28_FINAL_POLISH_BUILD === BUILD) {
    return;
  }

  window.MANA28_FINAL_POLISH_BUILD = BUILD;

  const $ = id => document.getElementById(id);

  function shell() {
    return $(SHELL_ID);
  }

  function title() {
    return $(TITLE_ID);
  }

  function content() {
    return $(CONTENT_ID);
  }

  function isMana28() {
    const root = shell();
    const t = title();

    if (!root || !t) return false;
    if (!root.classList.contains("open")) return false;

    const text = String(t.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();

    return text === "MANA 28";
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
         OVERVIEW CARD TEXT
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v978-launch .mana-v978-label {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v978-launch .mana-v978-arrow {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v978-launch .mana-v978-title {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      /* ======================================
         FUEL HEADING
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV1015Fuel .m1022-hero {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        margin-top: 0 !important;
        padding-top: 0 !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV1015Fuel .m1022-kicker {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV1015Fuel .m1022-hero h2 {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV1015Fuel .m1022-hero p {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        color: ${SILVER} !important;
        -webkit-text-fill-color: ${SILVER} !important;
      }

      /* Also keep the app header visible while in Fuel. */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}.mana28-fuel-active
      .mana-v83-head {
        position: sticky !important;
        top: 0 !important;
        z-index: 24501 !important;
        background: #08090B !important;
        padding-top: 10px !important;
        padding-bottom: 12px !important;
      }

      /* ======================================
         PROGRESS
         REMOVE YELLOW BOXES / MAKE BARS ORANGE
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-card-head .mana-v981-icon,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-icon {
        display: none !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-card-head {
        gap: 0 !important;
        align-items: center !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-overall-bar span,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-bar span {
        background: ${ORANGE} !important;
        background-image: none !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-overall-bar,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-bar {
        background: #353A40 !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-overall-label,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-message strong {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-message::before,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-overall::before {
        background: ${ORANGE} !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-period.active {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
        border-color: ${ORANGE} !important;
      }

      /* ======================================
         SAFETY: KEEP PROGRESS HEADING CLEAN
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}.mana28-progress-active
      #${CONTENT_ID}
      .mana-v981-head svg,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}.mana28-progress-active
      #${CONTENT_ID}
      .mana-v981-head img,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}.mana28-progress-active
      #${CONTENT_ID}
      .mana-v981-head [class*="icon"] {
        display: none !important;
      }

      /* ======================================
         MOBILE
         ====================================== */

      @media (max-width: 600px) {
        html body
        #${SHELL_ID}.${ACTIVE_CLASS}
        #manaV1015Fuel .m1022-hero h2 {
          font-size: 26px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     FUEL HEADING CONTENT
     ============================================================ */

  function repairFuelHeading() {
    if (!isMana28()) return;
    if (activeTab() !== "fuel") return;

    const holder = content();
    if (!holder) return;

    const fuelRoot = holder.querySelector("#manaV1015Fuel");
    if (!fuelRoot) return;

    const hero = fuelRoot.querySelector(".m1022-hero");
    if (!hero) return;

    const kicker = hero.querySelector(".m1022-kicker");
    const heading = hero.querySelector("h2");
    const paragraph = hero.querySelector("p");

    if (kicker) {
      kicker.textContent = "MANA 28 • FUEL";
    }

    if (heading) {
      heading.textContent = "Fuel with purpose";
    }

    if (paragraph) {
      paragraph.textContent =
        "Choose your meals, see what you've logged, then check where you sit for the day.";
    }
  }

  /* ============================================================
     PROGRESS CLEANUP
     ============================================================ */

  function repairProgressDecorations() {
    if (!isMana28()) return;
    if (activeTab() !== "progress") return;

    const holder = content();
    if (!holder) return;

    holder.querySelectorAll(
      ".mana-v981-icon, .mana-v981-card-head .mana-v981-icon"
    ).forEach(node => {
      node.style.setProperty("display", "none", "important");
    });
  }

  /* ============================================================
     ACTIVE VIEW STATE
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

    repairFuelHeading();
    repairProgressDecorations();
  }

  /* ============================================================
     FUEL ENTRY POSITION
     ============================================================ */

  let previousTab = "";

  function trackTabEntry() {
    if (!isMana28()) {
      previousTab = "";
      return;
    }

    const tab = activeTab();

    if (tab === previousTab) return;
    previousTab = tab;

    if (tab !== "fuel") return;

    [120, 280, 500].forEach(delay => {
      setTimeout(() => {
        if (!isMana28()) return;
        if (activeTab() !== "fuel") return;

        repairFuelHeading();

        const root = shell();
        if (root) root.scrollTop = 0;

        const scroller = document.scrollingElement;
        if (scroller) scroller.scrollTop = 0;
      }, delay);
    });
  }

  /* ============================================================
     SCHEDULER
     ============================================================ */

  let queued = false;

  function schedule() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      apply();
      trackTabEntry();
    });
  }

  /* ============================================================
     INIT
     ============================================================ */

  function init() {
    installStyles();
    apply();
    trackTabEntry();

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
            "#manaV83Tabs, #manaV83ProgramShell, #manaV80Mana28"
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
      "[Mana28] Final polish ready — " + BUILD
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
