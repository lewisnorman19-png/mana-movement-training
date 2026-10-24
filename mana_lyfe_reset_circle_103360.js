
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — RESET CIRCLE RESTORATION
   BUILD 103360

   Restores the circular green RESET control
   on the Mana Lyfe Reset page.

   PRESERVES:
   - Original Reset button functionality
   - Existing guided reset
   - Green animated breathing circle
   - Breathing countdown and phases
   - Support & Connection
   - Whakatauki
   - All program navigation

   No page rebuilding.
   No global HTML interception.
   No repeated polling.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103360";
  const STYLE_ID = "mana-lyfe-reset-circle-103360";
  const CLASS_NAME = "ml-reset-circle-103360";

  if (window.MANA_LYFE_RESET_CIRCLE_BUILD === BUILD) {
    return;
  }

  window.MANA_LYFE_RESET_CIRCLE_BUILD = BUILD;

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* MAIN RESET CIRCLE */

      #manaV83Content .${CLASS_NAME} {
        box-sizing: border-box !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;

        width: 118px !important;
        height: 118px !important;
        min-width: 118px !important;
        min-height: 118px !important;
        max-width: 118px !important;

        margin: 22px auto !important;
        padding: 0 !important;

        border-radius: 50% !important;
        border: 2px solid #61e69a !important;

        background:
          radial-gradient(
            circle at 35% 28%,
            #23724e 0%,
            #155738 48%,
            #103c2a 100%
          ) !important;

        color: #ffffff !important;
        box-shadow:
          0 0 0 5px rgba(65, 210, 130, 0.08),
          0 0 30px rgba(65, 210, 130, 0.18),
          inset 0 0 18px rgba(0, 0, 0, 0.12) !important;

        cursor: pointer !important;
        position: relative !important;
        overflow: hidden !important;

        font-size: 0 !important;
        line-height: 0 !important;
        text-indent: 0 !important;
        transition:
          transform 160ms ease,
          box-shadow 160ms ease !important;

        -webkit-tap-highlight-color: transparent;
      }

      #manaV83Content .${CLASS_NAME}::before {
        content: "↻";
        display: block;
        position: absolute;
        top: 24px;
        left: 0;
        right: 0;

        color: #ffffff;
        font-size: 39px !important;
        font-weight: 600;
        line-height: 1 !important;
        text-align: center;

        pointer-events: none;
      }

      #manaV83Content .${CLASS_NAME}::after {
        content: "RESET";
        display: block;
        position: absolute;
        bottom: 27px;
        left: 0;
        right: 0;

        color: #ffffff;
        font-size: 13px !important;
        font-weight: 900;
        line-height: 1 !important;
        letter-spacing: 1.5px;
        text-align: center;

        pointer-events: none;
      }

      #manaV83Content .${CLASS_NAME}:active {
        transform: scale(0.96) !important;
      }

      #manaV83Content .${CLASS_NAME}:focus-visible {
        outline: 3px solid #a2ffd0 !important;
        outline-offset: 5px !important;
      }

      @media (hover: hover) {
        #manaV83Content .${CLASS_NAME}:hover {
          transform: scale(1.045);
          box-shadow:
            0 0 0 6px rgba(65,210,130,0.12),
            0 0 38px rgba(65,210,130,0.3)
            !important;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #manaV83Content .${CLASS_NAME} {
          transition: none !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  function isLyfeReset() {
    const shell = document.getElementById(
      "manaV83ProgramShell"
    );

    const title = String(
      document.getElementById("manaV83Title")
        ?.textContent || ""
    ).toUpperCase();

    const resetTab = document.querySelector(
      '#manaV83Tabs .mana-v83-tab.active' +
      '[data-v83-tab="reclaim"],' +
      '#manaV83Tabs .mana-v83-tab.active' +
      '[data-v83-tab="reset"]'
    );

    return Boolean(
      shell?.classList.contains("open") &&
      /MANA (LYFE|LIFE)/.test(title) &&
      resetTab
    );
  }

  function restoreCircle() {
    if (!isLyfeReset()) return;

    const root = document.getElementById(
      "manaV83Content"
    );

    if (!root) return;

    const namedButtons = [
      root.querySelector("#ml140OpenReset"),
      root.querySelector("#manaV936Open")
    ].filter(Boolean);

    let target = namedButtons.find(button =>
      !button.closest("#manaV936ResetModal")
    );

    if (!target) {
      target = Array.from(
        root.querySelectorAll("button")
      ).find(button => {
        if (button.closest("#manaV936ResetModal")) {
          return false;
        }

        const text = String(
          button.textContent || ""
        ).trim().toUpperCase();

        return /RESET NOW/.test(text) &&
          !/CLOSE|CANCEL/.test(text);
      });
    }

    if (!target) return;

    target.classList.add(CLASS_NAME);

    if (!target.getAttribute("aria-label")) {
      target.setAttribute(
        "aria-label",
        "Start guided reset"
      );
    }
  }

  let queued = false;

  function schedule() {
    if (queued) return;
    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      restoreCircle();
    });
  }

  function init() {
    installStyles();

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) return;

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="reset"],' +
            '#manaV83Tabs [data-v83-tab="reclaim"]'
          )
        ) {
          schedule();
          setTimeout(schedule, 150);
        }
      },
      true
    );

    window.addEventListener(
      "mana:program-tab-change",
      schedule
    );

    document.addEventListener(
      "mana:program-tab-change",
      schedule
    );

    window.addEventListener("pageshow", schedule);

    schedule();

    console.log(
      "Mana Lyfe Reset Circle",
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
