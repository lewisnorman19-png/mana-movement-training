/* ============================================================
   MANA MOVEMENT TRAINING
   MANA28 MICRO TIDY
   BUILD 104520

   COMPLETE JAVASCRIPT FILE

   FIXES
   ------------------------------------------------------------
   1. Force ALL Mana28 Progress bars to orange
      - workouts
      - water
      - recovery
      - calories
      - protein
      - overall bar

   2. Remove the divider line under the Fuel heading
      / branded runner block

   PRESERVES
   ------------------------------------------------------------
   - workout schedule and ticks
   - saved meals
   - saved targets
   - progress calculations
   - fuel heading content
   - bottom tabs
   - Mana Strength and ManaLyfe

   LOAD AFTER BUILD 104510
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104520";

  const SHELL_ID = "manaV83ProgramShell";
  const TITLE_ID = "manaV83Title";
  const CONTENT_ID = "manaV83Content";

  const STYLE_ID = "mana28MicroTidy104520Style";
  const ACTIVE_CLASS = "mana28-micro-tidy-104520";

  const ORANGE = "#FF7927";
  const TRACK = "#353A40";

  if (window.MANA28_MICRO_TIDY_BUILD === BUILD) {
    return;
  }

  window.MANA28_MICRO_TIDY_BUILD = BUILD;

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

  /* ============================================================
     CSS
     ============================================================ */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      /* ======================================
         PROGRESS BARS — ALL ORANGE
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-overall-bar,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-bar {
        background: ${TRACK} !important;
        background-image: none !important;
        box-shadow: none !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-overall-bar > span,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-bar > span {
        background: ${ORANGE} !important;
        background-image: none !important;
        box-shadow: none !important;
      }

      /* Catch any card-specific colour styling */
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-card.workout .mana-v981-bar > span,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-card.water .mana-v981-bar > span,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-card.recovery .mana-v981-bar > span,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-card.calories .mana-v981-bar > span,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-card.protein .mana-v981-bar > span {
        background: ${ORANGE} !important;
        background-image: none !important;
      }

      /* ======================================
         FUEL HEADING DIVIDER — REMOVE
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV1015Fuel .m28-fuel-brand-104510 {
        border-bottom: none !important;
        box-shadow: none !important;
        margin-bottom: 14px !important;
        padding-bottom: 0 !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV1015Fuel .m28-fuel-brand-104510::before,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV1015Fuel .m28-fuel-brand-104510::after {
        display: none !important;
        content: none !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV1015Fuel .m1022-hero {
        border-top: none !important;
        box-shadow: none !important;
        margin-top: 0 !important;
        padding-top: 0 !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV1015Fuel .m1022-hero::before,

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV1015Fuel .m1022-hero::after {
        display: none !important;
        content: none !important;
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     JS ENFORCEMENT FOR INLINE STYLES
     ============================================================ */

  function enforceProgressBars() {
    if (!isMana28()) return;

    const holder = content();
    if (!holder) return;

    holder
      .querySelectorAll(
        ".mana-v981-overall-bar, .mana-v981-bar"
      )
      .forEach(track => {
        track.style.setProperty(
          "background",
          TRACK,
          "important"
        );
        track.style.setProperty(
          "background-image",
          "none",
          "important"
        );
        track.style.setProperty(
          "box-shadow",
          "none",
          "important"
        );
      });

    holder
      .querySelectorAll(
        ".mana-v981-overall-bar > span, .mana-v981-bar > span"
      )
      .forEach(fill => {
        fill.style.setProperty(
          "background",
          ORANGE,
          "important"
        );
        fill.style.setProperty(
          "background-image",
          "none",
          "important"
        );
        fill.style.setProperty(
          "box-shadow",
          "none",
          "important"
        );
      });
  }

  /* ============================================================
     APPLY
     ============================================================ */

  function apply() {
    const root = shell();
    if (!root) return;

    const active = isMana28();

    root.classList.toggle(ACTIVE_CLASS, active);

    if (!active) return;

    enforceProgressBars();
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
    });
  }

  /* ============================================================
     INIT
     ============================================================ */

  function init() {
    installStyles();
    apply();

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

    [
      "mana:program-tab-change",
      "mana:fuel-updated",
      "mana:recovery-updated",
      "pageshow",
      "focus"
    ].forEach(name => {
      window.addEventListener(name, schedule);
    });

    console.log(
      "[Mana28] Micro tidy ready — " + BUILD
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
