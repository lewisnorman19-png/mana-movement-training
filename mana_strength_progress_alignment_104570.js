
/* ============================================================
   MANA MOVEMENT TRAINING
   STRENGTH PROGRESS ALIGNMENT
   BUILD 104570

   COMPLETE JAVASCRIPT FILE

   FIXES
   - Align Cardio and Core with other Progress cards
   - Give Cardio a white heart/activity icon
   - Give Core a white target icon
   - Match existing white icon frames
   - Consistent percentage and description spacing
   - Preserve all seven metric cards

   NO DATA OR TRACKING CHANGES
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104570";
  const STYLE_ID = "manaStrengthAlignment104570";
  const ROOT_ID = "manaV993StrengthProgress";
  const GRID_CLASS = "mana-v993-metrics";
  const ICON_CLASS = "mana-strength-align-icon-104570";

  if (window.MANA_STRENGTH_ALIGNMENT_BUILD === BUILD) {
    return;
  }

  window.MANA_STRENGTH_ALIGNMENT_BUILD = BUILD;

  /* ============================================================
     CARDIO AND CORE ICONS
     ============================================================ */

  const ICONS = {
    cardio: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path
          d="M6 25h8l5-11 8 21 6-10h9"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `,

    core: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle
          cx="24" cy="24" r="17"
          fill="none"
          stroke="currentColor"
          stroke-width="3.5"
        />
        <circle
          cx="24" cy="24" r="9"
          fill="none"
          stroke="currentColor"
          stroke-width="3.5"
        />
        <circle
          cx="24" cy="24" r="3.5"
          fill="currentColor"
        />
      </svg>
    `
  };

  /* ============================================================
     CSS
     ============================================================ */

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      /* Strength Progress only. */

      html body #${ROOT_ID}
      .${GRID_CLASS} > .mana-v993-metric {
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        box-sizing: border-box !important;
      }

      /* Consistent heading alignment across all cards. */

      html body #${ROOT_ID}
      .mana-v993-metric-label {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-wrap: nowrap !important;
        gap: 9px !important;
        min-height: 40px !important;
        line-height: 1.2 !important;
        text-align: center !important;
      }

      /* New white Cardio/Core frames. */

      html body #${ROOT_ID}
      .${ICON_CLASS} {
        box-sizing: border-box !important;
        display: grid !important;
        place-items: center !important;
        width: 39px !important;
        height: 39px !important;
        min-width: 39px !important;
        min-height: 39px !important;
        flex: 0 0 39px !important;
        padding: 7px !important;
        border: 1px solid #FFFFFF !important;
        border-radius: 12px !important;
        background: #101216 !important;
        color: #FFFFFF !important;
        box-shadow: none !important;
      }

      html body #${ROOT_ID}
      .${ICON_CLASS} svg {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        color: #FFFFFF !important;
        opacity: 1 !important;
      }

      /* Match values and descriptions across the row. */

      html body #${ROOT_ID}
      .mana-v993-metric-value {
        margin-top: 10px !important;
        line-height: 1.15 !important;
      }

      html body #${ROOT_ID}
      .mana-v993-metric-sub {
        margin-top: 7px !important;
        min-height: 30px !important;
        line-height: 1.4 !important;
      }

      /* Keep progress tracks aligned at card bottoms. */

      html body #${ROOT_ID}
      .mana-v993-metric .mana-v993-track {
        margin-top: auto !important;
        flex-shrink: 0 !important;
      }

      @media (max-width: 600px) {
        html body #${ROOT_ID}
        .mana-v993-metric-label {
          gap: 6px !important;
          min-height: 35px !important;
        }

        html body #${ROOT_ID}
        .${ICON_CLASS} {
          width: 35px !important;
          height: 35px !important;
          min-width: 35px !important;
          min-height: 35px !important;
          flex-basis: 35px !important;
          padding: 6px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     ONLY ADD MISSING CARDIO AND CORE ICONS
     ============================================================ */

  function apply() {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;

    const grid = root.querySelector("." + GRID_CLASS);
    if (!grid) return;

    grid.querySelectorAll(".mana-v993-metric").forEach(
      card => {
        const label = card.querySelector(
          ".mana-v993-metric-label"
        );

        if (!label) return;

        const text = label.textContent
          .trim()
          .toUpperCase();

        const type = /CARDIO/.test(text)
          ? "cardio"
          : /CORE/.test(text)
            ? "core"
            : "";

        if (!type) return;

        // Remove a decorative bullet from the label,
        // while preserving any existing child elements.

        Array.from(label.childNodes).forEach(node => {
          if (node.nodeType !== Node.TEXT_NODE) return;

          const clean = node.textContent.replace(
            /^[\s●•◉○]+/,
            ""
          );

          if (node.textContent !== clean) {
            node.textContent = clean;
          }
        });

        if (label.querySelector("." + ICON_CLASS)) {
          return;
        }

        const icon = document.createElement("span");
        icon.className = ICON_CLASS;
        icon.setAttribute("aria-hidden", "true");
        icon.innerHTML = ICONS[type];

        label.prepend(icon);
      }
    );
  }

  /* ============================================================
     STABLE SCHEDULER
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
     INITIALISE
     ============================================================ */

  function init() {
    installStyles();
    apply();

    const content = document.getElementById(
      "manaV83Content"
    );

    if (content && window.MutationObserver) {
      const observer = new MutationObserver(schedule);

      observer.observe(content, {
        childList: true,
        subtree: true
      });
    }

    document.addEventListener("click", event => {
      if (!(event.target instanceof Element)) return;

      if (event.target.closest(
        "#manaV83Tabs, [data-v993-period]"
      )) {
        schedule();
      }
    }, true);

    [
      "mana:program-tab-change",
      "mana:workout-progress-change",
      "pageshow"
    ].forEach(name => {
      window.addEventListener(name, schedule);
    });

    console.log(
      "[Mana Strength] Progress alignment ready — " +
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
