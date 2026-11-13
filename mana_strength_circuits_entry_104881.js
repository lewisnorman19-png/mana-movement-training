
/* =========================================================
   MANA MOVEMENT TRAINING
   STABLE MANA STRENGTH CIRCUITS
   BUILD 104883

   COMPLETE REPLACEMENT:
   mana_strength_circuits_entry_104881.js

   FIXES:
   - Circuits always appears next to Workouts
   - Older branding cannot restore Learning label
   - Old Learning watcher cannot overwrite Circuits
   - Learning remains accessible from Overview
   - Learning banner has premium orange border
   - No duplicate Circuits card on Overview
   - Other programs remain unchanged
   - No database writes
   ========================================================= */

(() => {
  "use strict";

  const BUILD = "104883";
  const SHELL = "manaV83ProgramShell";
  const TABS = "manaV83Tabs";
  const CONTENT = "manaV83Content";

  const CLASS = "mana-circuits-active-104883";
  const STYLE = "manaCircuitsStableStyle104883";
  const SENTINEL = "manaCircuitsLearnGuard104883";
  const OLD_CARD = "manaCircuitsEntry104881";

  if (window.MANA_CIRCUITS_STABLE_104883) return;
  window.MANA_CIRCUITS_STABLE_104883 = true;

  const $ = id => document.getElementById(id);

  let learningRequested = false;
  let scheduled = false;

  function strengthOpen() {
    return Boolean(
      $(SHELL)?.classList.contains("open") &&
      /strength/i.test(
        $("manaV83Title")?.textContent || ""
      )
    );
  }

  function circuitsSelected() {
    return Boolean(
      strengthOpen() &&
      $(TABS)?.querySelector(
        '[data-v83-tab="learn"].active'
      )
    );
  }

  /* =====================================
     DESIGN — STABLE TAB POSITION

     Do not repeatedly rewrite tab HTML.

     CSS determines position and label,
     even if the original app recreates
     its navigation buttons.
     ===================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* Remove old Circuits Overview card */

      #${OLD_CARD} {
        display: none !important;
      }

      /* Only affect Mana Strength */

      #${SHELL}.${CLASS} #${TABS}
      [data-v83-tab="overview"] {
        order: 1 !important;
      }

      #${SHELL}.${CLASS} #${TABS}
      [data-v83-tab="program"] {
        order: 2 !important;
      }

      #${SHELL}.${CLASS} #${TABS}
      [data-v83-tab="learn"] {
        order: 3 !important;
      }

      #${SHELL}.${CLASS} #${TABS}
      [data-v83-tab="fuel"] {
        order: 4 !important;
      }

      #${SHELL}.${CLASS} #${TABS}
      [data-v83-tab="progress"] {
        order: 5 !important;
      }

      /* Persistent Circuits label and
         stopwatch icon.

         Older navigation scripts may
         recreate the underlying content.
         CSS keeps the displayed label
         and icon consistent. */

      #${SHELL}.${CLASS} #${TABS}
      [data-v83-tab="learn"] {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: flex-end !important;

        padding: 5px 2px 7px !important;

        font-size: 0 !important;

        background-image:
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='13' r='8' fill='none' stroke='%23C1C6CE' stroke-width='2'/%3E%3Cpath d='M12 8v5l3 2M9 2h6M12 2v3' fill='none' stroke='%23C1C6CE' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")
          !important;

        background-position:
          center 13px !important;

        background-size:
          25px 25px !important;

        background-repeat:
          no-repeat !important;
      }

      #${SHELL}.${CLASS} #${TABS}
      [data-v83-tab="learn"] > * {
        display: none !important;
      }

      #${SHELL}.${CLASS} #${TABS}
      [data-v83-tab="learn"]::after {
        content: "Circuits" !important;
        display: block !important;

        color: #C1C6CE !important;
        -webkit-text-fill-color:
          #C1C6CE !important;

        font-size: 11px !important;
        font-weight: 900 !important;
        line-height: 1.2 !important;
        text-align: center !important;

        margin-top: auto !important;
        padding-bottom: 1px !important;
      }

      #${SHELL}.${CLASS} #${TABS}
      [data-v83-tab="learn"].active {
        background-image:
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='13' r='8' fill='none' stroke='%23FF7927' stroke-width='2'/%3E%3Cpath d='M12 8v5l3 2M9 2h6M12 2v3' fill='none' stroke='%23FF7927' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")
          !important;
      }

      #${SHELL}.${CLASS} #${TABS}
      [data-v83-tab="learn"].active::after {
        color: #FF7927 !important;
        -webkit-text-fill-color:
          #FF7927 !important;
      }

      /* Premium Learning banner */

      #${SHELL}.${CLASS}
      #${CONTENT} .msc-overview-learn {
        display: block !important;

        width: 100% !important;
        padding: 20px !important;
        margin: 16px 0 !important;

        background: #15171A !important;
        background-image: none !important;

        border: 1px solid #FF7927 !important;
        border-radius: 19px !important;

        color: #FFFFFF !important;
        text-align: left !important;

        box-shadow: none !important;
        box-sizing: border-box !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .msc-overview-learn .msc-kicker {
        color: #FF7927 !important;
        font-size: 10px !important;
        font-weight: 900 !important;
        letter-spacing: .12em !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT} .msc-overview-learn strong {
        display: block !important;
        color: #FFFFFF !important;
        font-size: 21px !important;
        font-weight: 900 !important;
        margin-top: 6px !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT} .msc-overview-learn small {
        display: block !important;
        color: #C1C6CE !important;
        font-size: 12px !important;
        margin-top: 7px !important;
      }

      @media(max-width:600px) {

        #${SHELL}.${CLASS}
        #${TABS}
        [data-v83-tab="learn"]::after {
          font-size: 10px !important;
        }

        #${SHELL}.${CLASS}
        #${CONTENT} .msc-overview-learn {
          padding: 15px !important;
        }

        #${SHELL}.${CLASS}
        #${CONTENT} .msc-overview-learn strong {
          font-size: 18px !important;
        }

      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================
     STOP OLD LEARNING AUTO-RENDER

     The original Learn module looks for
     .mana-v9120-root anywhere in the
     document, then recreates Learning if
     that element is missing.

     Keep a hidden compatibility marker
     while Circuits is selected so that
     its watcher does not overwrite the
     working circuit interface.

     The marker contains no lesson data,
     inputs or app functionality.
     ===================================== */

  function ensureGuard() {
    if ($(SENTINEL)) return;

    const guard = document.createElement("div");

    guard.id = SENTINEL;
    guard.className = "mana-v9120-root";

    guard.hidden = true;
    guard.setAttribute("aria-hidden", "true");
    guard.style.display = "none";

    document.body.appendChild(guard);
  }

  function removeGuard() {
    $(SENTINEL)?.remove();
  }

  /* =====================================
     WORKSPACE-SCOPED SYNCHRONISATION
     ===================================== */

  function sync() {
    scheduled = false;

    const shell = $(SHELL);
    if (!shell) return;

    const active = strengthOpen();

    shell.classList.toggle(CLASS, active);

    $(OLD_CARD)?.remove();

    if (!active) {
      learningRequested = false;
      removeGuard();
      return;
    }

    if (circuitsSelected() && !learningRequested) {
      ensureGuard();
    } else {
      removeGuard();
    }
  }

  function schedule() {
    if (scheduled) return;

    scheduled = true;
    requestAnimationFrame(sync);
  }

  /* =====================================
     LEARNING CARD VS CIRCUITS TAB

     Clicking Learning's Overview card
     must still open the real lessons.

     Clicking the fifth bottom tab must
     open Circuits instead.
     ===================================== */

  function onCapture(event) {
    const target = event.target;

    if (!(target instanceof Element)) return;
    if (!strengthOpen()) return;

    if (
      target.closest(
        '[data-msc-action="learning"]'
      )
    ) {
      learningRequested = true;
      removeGuard();
      return;
    }

    if (
      target.closest(
        '#manaV83Tabs [data-v83-tab="learn"]'
      )
    ) {
      learningRequested = false;
      ensureGuard();
      return;
    }

    if (
      target.closest(
        '#manaV83Tabs [data-v83-tab]'
      )
    ) {
      learningRequested = false;
      removeGuard();
    }
  }

  /* =====================================
     INITIALISE

     Only observe the program shell state
     and its title, not the entire page.
     No repeated rebuilding of tabs.
     ===================================== */

  function init() {
    installStyles();

    document.addEventListener(
      "click",
      onCapture,
      true
    );

    const shell = $(SHELL);

    if (shell) {
      new MutationObserver(schedule).observe(
        shell,
        {
          attributes: true,
          attributeFilter: ["class"]
        }
      );
    }

    const title = $("manaV83Title");

    if (title) {
      new MutationObserver(schedule).observe(
        title,
        {
          childList: true,
          characterData: true,
          subtree: true
        }
      );
    }

    window.addEventListener(
      "mana:program-tab-change",
      sync
    );

    window.addEventListener(
      "pageshow",
      schedule
    );

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest(
            "#manaV83Tabs, " +
            "#manaV80Strength"
          )
        ) {
          schedule();
        }
      }
    );

    sync();

    console.log(
      "[Mana Strength] Stable Circuits " + BUILD
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
