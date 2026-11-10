
/* ============================================================
   MANA MOVEMENT TRAINING
   PROGRESS ICON REPAIR
   BUILD 104550

   COMPLETE JAVASCRIPT FILE

   MANA28
   - White illustrations
   - Orange icon borders

   MANA STRENGTH
   - White illustrations
   - White icon borders

   BOTH PROGRAMS
   - Workouts: dumbbell
   - Water: droplet
   - Recovery: moon
   - Calories: flame
   - Protein: dumbbell
   - Preserve existing progress values and bars
   - No data writes
   - No changes to workout or Fuel engines

   LOAD AFTER BUILD 104540
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104550";

  if (window.MANA_PROGRESS_ICONS_REPAIR_BUILD === BUILD) {
    return;
  }

  window.MANA_PROGRESS_ICONS_REPAIR_BUILD = BUILD;

  const SHELL = "manaV83ProgramShell";
  const CONTENT = "manaV83Content";
  const TITLE = "manaV83Title";

  const STYLE_ID = "manaProgressIconsRepair104550Style";
  const ICON_CLASS = "mana-progress-icon-104550";

  const WHITE = "#FFFFFF";
  const ORANGE = "#FF7927";

  const $ = id => document.getElementById(id);

  /* ============================================================
     IDENTIFY THE ACTIVE PROGRAM
     ============================================================ */

  function programType() {
    const shell = $(SHELL);

    if (!shell || !shell.classList.contains("open")) {
      return "";
    }

    const tab = shell.querySelector(
      '#manaV83Tabs .mana-v83-tab.active'
    )?.dataset?.v83Tab;

    if (tab !== "progress") {
      return "";
    }

    const content = $(CONTENT);

    if (!content) return "";

    // Identify the actual Progress renderer rather
    // than relying only on header formatting.

    if (
      content.querySelector(
        ".mana-v981-root .mana-v981-card"
      )
    ) {
      return "mana28";
    }

    if (
      content.querySelector(
        "#manaV993StrengthProgress .mana-v993-metric"
      )
    ) {
      return "strength";
    }

    return "";
  }

  /* ============================================================
     ORIGINAL FUEL ICON SHAPES
     ============================================================ */

  function iconShape(type) {
    switch (type) {

      case "calories":
        return `
          <path
            d="
              M27 3
              c2 8-5 10-2 17
              2 4 6 4 7 9
              1 6-3 12-9 13
              -8 2-16-4-16-13
              0-8 6-12 11-18
              0 6 3 8 5 9
              -1-8 5-11 4-17Z
            "
          />
        `;

      case "protein":
      case "workouts":
        return `
          <rect x="17" y="20"
                width="14" height="8" rx="3"/>
          <rect x="9" y="14"
                width="6" height="20" rx="2"/>
          <rect x="33" y="14"
                width="6" height="20" rx="2"/>
          <rect x="4" y="18"
                width="4" height="12" rx="2"/>
          <rect x="40" y="18"
                width="4" height="12" rx="2"/>
        `;

      case "water":
        return `
          <path
            d="
              M24 4
              S10 20 10 30
              a14 14 0 0 0 28 0
              C38 20 24 4 24 4Z
            "
          />
        `;

      case "recovery":
        return `
          <path
            d="
              M34 35
              A16 16 0 0 1 19 9
              a17 17 0 1 0 15 26Z
            "
          />
        `;

      default:
        return "";
    }
  }

  function iconSVG(type) {
    return `
      <svg
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        ${iconShape(type)}
      </svg>
    `;
  }

  function identifyMetric(label) {
    const text = String(label || "")
      .trim()
      .toUpperCase();

    if (text.startsWith("WORKOUT")) return "workouts";
    if (text.startsWith("WATER")) return "water";
    if (text.startsWith("RECOVERY")) return "recovery";
    if (text === "REST") return "recovery";
    if (text.startsWith("CALORIE")) return "calories";
    if (text.startsWith("PROTEIN")) return "protein";

    return "";
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
         SHARED ICON DESIGN
         ====================================== */

      html body #${SHELL}
      .${ICON_CLASS} {
        box-sizing: border-box !important;
        display: inline-grid !important;
        place-items: center !important;

        width: 38px !important;
        height: 38px !important;
        min-width: 38px !important;
        min-height: 38px !important;
        flex: 0 0 38px !important;

        padding: 7px !important;
        border-radius: 11px !important;

        background: #101216 !important;
        background-image: none !important;
        box-shadow: none !important;

        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;

        opacity: 1 !important;
        visibility: visible !important;
      }

      html body #${SHELL}
      .${ICON_CLASS} svg {
        display: block !important;
        width: 100% !important;
        height: 100% !important;

        color: ${WHITE} !important;
        fill: ${WHITE} !important;

        stroke: none !important;
        filter: none !important;
        opacity: 1 !important;
      }

      html body #${SHELL}
      .${ICON_CLASS} svg path,
      html body #${SHELL}
      .${ICON_CLASS} svg rect {
        fill: ${WHITE} !important;
        stroke: none !important;
      }

      /* ======================================
         MANA28 — ORANGE FRAMES
         ====================================== */

      html body #${SHELL}
      .mana-v981-root .${ICON_CLASS} {
        border: 1px solid ${ORANGE} !important;
      }

      html body #${SHELL}
      .mana-v981-root .mana-v981-card-head {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
      }

      /* ======================================
         MANA STRENGTH — WHITE FRAMES
         ====================================== */

      html body #${SHELL}
      #manaV993StrengthProgress .${ICON_CLASS} {
        border: 1px solid ${WHITE} !important;
      }

      html body #${SHELL}
      #manaV993StrengthProgress
      .mana-v993-metric-label {
        display: flex !important;
        align-items: center !important;
        gap: 9px !important;
      }

      /* ======================================
         KEEP PROGRESS BARS ORANGE
         ====================================== */

      html body #${SHELL}
      .mana-v981-bar > span,
      html body #${SHELL}
      .mana-v981-overall-bar > span,
      html body #${SHELL}
      #manaV993StrengthProgress .mana-v993-fill,
      html body #${SHELL}
      #manaV993StrengthProgress .mp-water-fill {
        background: ${ORANGE} !important;
        background-image: none !important;
      }

      @media (max-width:600px) {
        html body #${SHELL}
        .${ICON_CLASS} {
          width: 34px !important;
          height: 34px !important;
          min-width: 34px !important;
          min-height: 34px !important;
          flex-basis: 34px !important;
          padding: 6px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     CREATE OR UPDATE ONE ICON
     ============================================================ */

  function ensureIcon(container, type, insertBefore) {
    if (!container || !type) return;

    let icon = container.querySelector(
      "." + ICON_CLASS
    );

    if (!icon) {
      icon = document.createElement("span");

      icon.className = ICON_CLASS;
      icon.setAttribute("aria-hidden", "true");
      icon.dataset.metric = type;
      icon.innerHTML = iconSVG(type);

      if (insertBefore && insertBefore.parentElement === container) {
        container.insertBefore(icon, insertBefore);
      } else {
        container.prepend(icon);
      }
    }

    if (icon.dataset.metric !== type) {
      icon.dataset.metric = type;
      icon.innerHTML = iconSVG(type);
    }
  }

  /* ============================================================
     MANA28 PROGRESS
     ============================================================ */

  function repairMana28() {
    const holder = $(CONTENT);

    if (!holder) return;

    const cards = holder.querySelectorAll(
      ".mana-v981-root .mana-v981-card"
    );

    cards.forEach(card => {
      const head = card.querySelector(
        ".mana-v981-card-head"
      );

      const label = card.querySelector(
        ".mana-v981-label"
      );

      if (!head || !label) return;

      const type = identifyMetric(
        label.textContent
      );

      if (!type) return;

      ensureIcon(head, type, label);
    });
  }

  /* ============================================================
     MANA STRENGTH PROGRESS
     ============================================================ */

  function repairStrength() {
    const grid = document.querySelector(
      "#manaV993StrengthProgress .mana-v993-metrics"
    );

    if (!grid) return;

    grid.querySelectorAll(
      ".mana-v993-metric"
    ).forEach(card => {
      const label = card.querySelector(
        ".mana-v993-metric-label"
      );

      if (!label) return;

      const type = identifyMetric(
        label.textContent
      );

      if (!type) return;

      ensureIcon(label, type, label.firstChild);
    });
  }

  /* ============================================================
     APPLY TO ACTIVE PROGRAM ONLY
     ============================================================ */

  function apply() {
    const type = programType();

    if (type === "mana28") {
      repairMana28();
    }

    if (type === "strength") {
      repairStrength();
    }
  }

  /* ============================================================
     CONTROLLED REFRESH
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
     INITIALISATION
     ============================================================ */

  function init() {
    installStyles();
    apply();

    const content = $(CONTENT);

    if (content && window.MutationObserver) {
      const observer = new MutationObserver(schedule);

      observer.observe(content, {
        childList: true,
        subtree: true
      });
    }

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) return;

        if (
          event.target.closest(
            "#manaV83Tabs, " +
            "[data-v981-period], " +
            "[data-v993-period]"
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
      "mana:workout-progress-change",
      "pageshow",
      "focus"
    ].forEach(name => {
      window.addEventListener(name, schedule);
    });

    console.log(
      "[Mana Movement] Progress icon repair ready — " +
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
