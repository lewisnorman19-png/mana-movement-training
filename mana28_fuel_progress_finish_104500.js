/* ============================================================
   MANA MOVEMENT TRAINING
   MANA28 FUEL + PROGRESS FINISH
   BUILD 104500

   COMPLETE JAVASCRIPT FILE

   FIXES
   ------------------------------------------------------------
   1. Remove the last yellow / gold border treatment
      from Progress and replace with clean orange/grey

   2. Keep all Progress bars orange

   3. Restore the Fuel heading properly:
      - shell header stays visible
      - runner + MANA28 visible
      - MANA 28 • FUEL visible
      - Fuel with purpose visible
      - supporting paragraph visible

   PRESERVES
   ------------------------------------------------------------
   - workouts and completion ticks
   - saved progress
   - fuel meals and calculations
   - water and recovery
   - learning content
   - bottom tabs
   - Mana Strength and ManaLyfe

   LOAD AFTER BUILD 104490
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104500";

  const SHELL_ID = "manaV83ProgramShell";
  const TITLE_ID = "manaV83Title";
  const CONTENT_ID = "manaV83Content";
  const TABS_ID = "manaV83Tabs";

  const STYLE_ID = "mana28FuelProgressFinish104500Style";
  const ACTIVE_CLASS = "mana28-fuel-progress-finish-104500";

  const ORANGE = "#FF7927";
  const WHITE = "#FFFFFF";
  const SILVER = "#C1C6CE";
  const BORDER = "#656D77";
  const DARK = "#15171A";
  const BLACK = "#08090B";

  if (window.MANA28_FUEL_PROGRESS_FINISH_BUILD === BUILD) {
    return;
  }

  window.MANA28_FUEL_PROGRESS_FINISH_BUILD = BUILD;

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
         FUEL HEADER — SHELL HEADER STAYS VISIBLE
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}.m28-104500-fuel
      .mana-v83-head {
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: sticky !important;
        top: 0 !important;
        z-index: 24510 !important;
        background: ${BLACK} !important;
        padding-top: 10px !important;
        padding-bottom: 12px !important;
        margin-bottom: 12px !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}.m28-104500-fuel
      .mana-v83-brand-wrap,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}.m28-104500-fuel
      .mana-v83-mark,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}.m28-104500-fuel
      #${TITLE_ID},
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}.m28-104500-fuel
      .mana-v83-sub {
        visibility: visible !important;
        opacity: 1 !important;
        display: flex !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}.m28-104500-fuel
      .mana-v83-sub {
        display: block !important;
      }

      /* ======================================
         FUEL HERO — ALWAYS VISIBLE
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV1015Fuel .m1022-hero {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: relative !important;
        z-index: 2 !important;
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

      /* ======================================
         PROGRESS — REMOVE ALL YELLOW / GOLD LOOK
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-periods {
        border: 1px solid ${BORDER} !important;
        background: ${BLACK} !important;
        box-shadow: none !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-period {
        border: 1px solid transparent !important;
        background: transparent !important;
        box-shadow: none !important;
        color: ${SILVER} !important;
        -webkit-text-fill-color: ${SILVER} !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-period.active {
        border: 1px solid ${ORANGE} !important;
        background: #20160F !important;
        box-shadow: none !important;
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-overall,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-card,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-message {
        border: 1px solid ${BORDER} !important;
        background: ${DARK} !important;
        background-image: none !important;
        box-shadow: none !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-overall::before,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-message::before {
        background: ${ORANGE} !important;
      }

      /* Kill any leftover yellow/gold accent rules */
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-overall,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-card,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-message,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-periods,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-period.active {
        outline: none !important;
      }

      /* ======================================
         PROGRESS BARS — ORANGE
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-overall-bar,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-bar {
        background: #353A40 !important;
        box-shadow: none !important;
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

      /* ======================================
         PROGRESS LABELS
         ====================================== */

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
      .mana-v981-overall-value,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-value {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-overall-sub,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-sub,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-label,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-period-detail {
        color: ${SILVER} !important;
        -webkit-text-fill-color: ${SILVER} !important;
      }

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
     FUEL HERO REPAIR
     ============================================================ */

  function ensureFuelHero() {
    if (!isMana28()) return;
    if (activeTab() !== "fuel") return;

    const holder = content();
    if (!holder) return;

    const fuelRoot = holder.querySelector("#manaV1015Fuel");
    if (!fuelRoot) return;

    let hero = fuelRoot.querySelector(".m1022-hero");

    if (!hero) {
      hero = document.createElement("section");
      hero.className = "m1022-hero";
      fuelRoot.prepend(hero);
    }

    let kicker = hero.querySelector(".m1022-kicker");
    if (!kicker) {
      kicker = document.createElement("div");
      kicker.className = "m1022-kicker";
      hero.prepend(kicker);
    }

    let heading = hero.querySelector("h2");
    if (!heading) {
      heading = document.createElement("h2");
      hero.appendChild(heading);
    }

    let paragraph = hero.querySelector("p");
    if (!paragraph) {
      paragraph = document.createElement("p");
      hero.appendChild(paragraph);
    }

    kicker.textContent = "MANA 28 • FUEL";
    heading.textContent = "Fuel with purpose";
    paragraph.textContent =
      "Choose your meals, see what you've logged, then check where you sit for the day.";
  }

  /* ============================================================
     VIEW STATE
     ============================================================ */

  function apply() {
    const root = shell();
    if (!root) return;

    const active = isMana28();
    const tab = active ? activeTab() : "";

    root.classList.toggle(ACTIVE_CLASS, active);
    root.classList.toggle("m28-104500-fuel", active && tab === "fuel");

    if (!active) return;

    ensureFuelHero();
  }

  /* ============================================================
     TAB ENTRY TRACKING
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

    [120, 320, 650].forEach(delay => {
      setTimeout(() => {
        if (!isMana28()) return;
        if (activeTab() !== "fuel") return;

        ensureFuelHero();

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

    window.addEventListener("mana:program-tab-change", schedule);
    window.addEventListener("pageshow", schedule);

    console.log(
      "[Mana28] Fuel + Progress finish ready — " + BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

})();
