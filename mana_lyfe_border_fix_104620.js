
/* ============================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — CARD BORDER REPAIR
   BUILD 104620

   COMPLETE JAVASCRIPT FILE

   FIXES:
   - Four large Overview cards: WHITE borders
   - Four small illustration frames: ORANGE borders
   - Remove leftover gold top-edge accents

   PRESERVES:
   - Existing card layouts and illustrations
   - Orange labels and links
   - Teal Support Chat
   - White navigation and green Reset
   - All existing functionality

   LOAD AFTER 104610
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104620";

  const SHELL_ID = "manaV83ProgramShell";
  const TITLE_ID = "manaV83Title";
  const CONTENT_ID = "manaV83Content";

  const STYLE_ID = "manaLyfeBorderFix104620Style";

  const WHITE = "#FFFFFF";
  const ORANGE = "#FF7927";

  if (window.MANA_LYFE_BORDER_FIX_BUILD === BUILD) {
    return;
  }

  window.MANA_LYFE_BORDER_FIX_BUILD = BUILD;

  const $ = id => document.getElementById(id);

  function isLyfe() {
    const shell = $(SHELL_ID);
    const title = $(TITLE_ID);

    if (!shell || !title) return false;
    if (!shell.classList.contains("open")) return false;

    const name = String(title.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();

    return name === "MANA LYFE" ||
           name === "MANA LIFE";
  }

  /* ============================================================
     FIX THE TOP-EDGE DECORATION
     ============================================================ */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      html body
      #${SHELL_ID}.mana-lyfe-premium-104580
      #${CONTENT_ID}
      .mana-v978-grid
      button.mana-v978-launch::before {

        background: ${ORANGE} !important;
        background-image: none !important;
        box-shadow: none !important;
      }

      /* Prevent gold outlines and shadows
         on hover or keyboard focus. */

      html body
      #${SHELL_ID}.mana-lyfe-premium-104580
      #${CONTENT_ID}
      .mana-v978-grid
      button.mana-v978-launch:hover,

      html body
      #${SHELL_ID}.mana-lyfe-premium-104580
      #${CONTENT_ID}
      .mana-v978-grid
      button.mana-v978-launch:focus-visible {

        border-color: ${WHITE} !important;
        box-shadow: none !important;
      }

      /* Keep keyboard focus clearly visible. */

      html body
      #${SHELL_ID}.mana-lyfe-premium-104580
      #${CONTENT_ID}
      .mana-v978-grid
      button.mana-v978-launch:focus-visible {
        outline: 2px solid ${ORANGE} !important;
        outline-offset: 2px !important;
      }

    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     APPLY DIRECTLY TO THE FOUR OVERVIEW CARDS
     ============================================================ */

  function apply() {
    if (!isLyfe()) return;

    const content = $(CONTENT_ID);

    if (!content) return;

    const grid = content.querySelector(
      ".mana-v978-launchpad .mana-v978-grid"
    );

    if (!grid) return;

    const cards = grid.querySelectorAll(
      "button.mana-v978-launch[data-v978-tab]"
    );

    cards.forEach(card => {

      /* LARGE CARD — WHITE BORDER */

      if (
        card.style.getPropertyValue("border-color")
          !== WHITE ||
        card.style.getPropertyPriority("border-color")
          !== "important"
      ) {
        card.style.setProperty(
          "border",
          "1px solid " + WHITE,
          "important"
        );

        card.style.setProperty(
          "border-color",
          WHITE,
          "important"
        );
      }

      card.style.setProperty(
        "background",
        "#15171A",
        "important"
      );

      card.style.setProperty(
        "box-shadow",
        "none",
        "important"
      );

      /* SMALL ICON FRAME — ORANGE BORDER */

      const icon = card.querySelector(
        ".mana-v978-icon"
      );

      if (!icon) return;

      if (
        icon.style.getPropertyValue("border-color")
          !== ORANGE ||
        icon.style.getPropertyPriority("border-color")
          !== "important"
      ) {
        icon.style.setProperty(
          "border",
          "1px solid " + ORANGE,
          "important"
        );

        icon.style.setProperty(
          "border-color",
          ORANGE,
          "important"
        );
      }

      icon.style.setProperty(
        "background",
        "#0B0D10",
        "important"
      );

      icon.style.setProperty(
        "box-shadow",
        "none",
        "important"
      );

    });
  }

  /* ============================================================
     CONTROLLED SCHEDULER
     ============================================================ */

  let pending = false;

  function schedule() {
    if (pending) return;

    pending = true;

    requestAnimationFrame(() => {
      pending = false;
      apply();
    });
  }

  /* ============================================================
     INITIALISE
     ============================================================ */

  function init() {
    installStyles();
    apply();

    const shell = $(SHELL_ID);

    if (shell && window.MutationObserver) {
      const observer = new MutationObserver(schedule);

      observer.observe(shell, {
        childList: true,
        subtree: true
      });
    }

    document.addEventListener(
      "click",
      event => {
        if (
          event.target instanceof Element &&
          event.target.closest(
            "#manaV83Tabs, #manaV83ProgramShell"
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

    window.addEventListener("pageshow", schedule);

    console.log(
      "[ManaLyfe] Card borders repaired — " + BUILD
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
