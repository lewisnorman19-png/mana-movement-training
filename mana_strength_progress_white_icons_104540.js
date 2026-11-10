
/* ============================================================
   MANA MOVEMENT TRAINING
   MANA STRENGTH — WHITE PROGRESS ICONS
   BUILD 104540

   COMPLETE JAVASCRIPT FILE

   PURPOSE
   ------------------------------------------------------------
   - Match the Fuel icon illustrations
   - Add white icons to Strength Progress cards
   - Workouts: dumbbell
   - Protein: dumbbell
   - Calories: flame
   - Water: droplet
   - Recovery: moon
   - White icon frames and white artwork
   - Keep existing orange progress bars

   PRESERVES
   ------------------------------------------------------------
   - All Strength workout records
   - Workout completion percentages
   - Fuel and nutrition calculations
   - Recovery and water tracking
   - Body weight and Personal Bests
   - Exercise history
   - Daily / Weekly / Monthly controls
   - Mana28 and ManaLyfe

   VISUAL ONLY — NO STORAGE CHANGES

   LOAD AFTER STRENGTH PROGRESS BUILD 104380
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104540";

  const SHELL_ID = "manaV83ProgramShell";
  const CONTENT_ID = "manaV83Content";
  const ROOT_ID = "manaV993StrengthProgress";
  const STYLE_ID = "manaStrengthWhiteIcons104540Style";
  const ICON_CLASS = "mana-strength-white-icon-104540";

  const WHITE = "#FFFFFF";
  const ORANGE = "#FF7927";

  if (window.MANA_STRENGTH_WHITE_ICONS_BUILD === BUILD) {
    return;
  }

  window.MANA_STRENGTH_WHITE_ICONS_BUILD = BUILD;

  const $ = id => document.getElementById(id);

  /* ============================================================
     CHECK STRENGTH PROGRESS IS OPEN
     ============================================================ */

  function strengthProgressOpen() {
    const shell = $(SHELL_ID);
    const root = $(ROOT_ID);

    if (!shell || !root) return false;

    if (!shell.classList.contains("open")) {
      return false;
    }

    const activeTab = shell.querySelector(
      '#manaV83Tabs .mana-v83-tab.active'
    )?.dataset?.v83Tab;

    return (
      activeTab === "progress" &&
      shell.contains(root)
    );
  }

  /* ============================================================
     EXACT FUEL ICON ARTWORK
     ============================================================ */

  function iconSvg(type) {
    let shape = "";

    switch (type) {

      case "calories":
        shape = `
          <path
            fill="currentColor"
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
        break;

      case "protein":
      case "workouts":
        shape = `
          <rect
            x="17" y="20"
            width="14" height="8" rx="3"
            fill="currentColor"
          />
          <rect
            x="9" y="14"
            width="6" height="20" rx="2"
            fill="currentColor"
          />
          <rect
            x="33" y="14"
            width="6" height="20" rx="2"
            fill="currentColor"
          />
          <rect
            x="4" y="18"
            width="4" height="12" rx="2"
            fill="currentColor"
          />
          <rect
            x="40" y="18"
            width="4" height="12" rx="2"
            fill="currentColor"
          />
        `;
        break;

      case "water":
        shape = `
          <path
            fill="currentColor"
            d="
              M24 4
              S10 20 10 30
              a14 14 0 0 0 28 0
              C38 20 24 4 24 4Z
            "
          />
        `;
        break;

      case "recovery":
        shape = `
          <path
            fill="currentColor"
            d="
              M34 35
              A16 16 0 0 1 19 9
              a17 17 0 1 0 15 26Z
            "
          />
        `;
        break;

      default:
        return "";
    }

    return `
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        focusable="false"
      >
        ${shape}
      </svg>
    `;
  }

  /* ============================================================
     WHITE ICON STYLING
     ============================================================ */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* ======================================
         STRENGTH METRIC LABEL LAYOUT
         ====================================== */

      html body
      #${SHELL_ID}
      #${ROOT_ID}
      .mana-v993-metric .mana-v993-metric-label {
        display: flex !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        gap: 10px !important;
        color: #C1C6CE !important;
        -webkit-text-fill-color: #C1C6CE !important;
      }

      /* ======================================
         WHITE ICON FRAME
         ====================================== */

      html body
      #${SHELL_ID}
      #${ROOT_ID}
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

        border: 1px solid ${WHITE} !important;
        border-radius: 12px !important;

        background: #101216 !important;
        background-image: none !important;
        box-shadow: none !important;

        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      /* ======================================
         WHITE FUEL ILLUSTRATIONS
         ====================================== */

      html body
      #${SHELL_ID}
      #${ROOT_ID}
      .${ICON_CLASS} svg {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        color: ${WHITE} !important;
        fill: ${WHITE} !important;
        opacity: 1 !important;
        filter: none !important;
      }

      html body
      #${SHELL_ID}
      #${ROOT_ID}
      .${ICON_CLASS} svg path,

      html body
      #${SHELL_ID}
      #${ROOT_ID}
      .${ICON_CLASS} svg rect {
        fill: ${WHITE} !important;
        stroke: none !important;
      }

      /* ======================================
         PRESERVE ORANGE PROGRESS INDICATORS
         ====================================== */

      html body
      #${SHELL_ID}
      #${ROOT_ID}
      .mana-v993-metrics .mana-v993-fill,

      html body
      #${SHELL_ID}
      #${ROOT_ID}
      .mana-v993-metrics .mp-water-fill {
        background: ${ORANGE} !important;
        background-image: none !important;
      }

      /* ======================================
         MOBILE
         ====================================== */

      @media(max-width:600px) {

        html body
        #${SHELL_ID}
        #${ROOT_ID}
        .${ICON_CLASS} {
          width: 35px !important;
          height: 35px !important;
          min-width: 35px !important;
          min-height: 35px !important;
          flex-basis: 35px !important;
          padding: 6px !important;
        }

        html body
        #${SHELL_ID}
        #${ROOT_ID}
        .mana-v993-metric .mana-v993-metric-label {
          gap: 8px !important;
        }

      }

    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     IDENTIFY THE EXISTING METRIC CARD
     ============================================================ */

  function metricType(label) {
    const value = String(label || "")
      .trim()
      .toUpperCase();

    if (value.startsWith("WORKOUT")) {
      return "workouts";
    }

    if (value.startsWith("PROTEIN")) {
      return "protein";
    }

    if (value.startsWith("CALORIE")) {
      return "calories";
    }

    if (value.startsWith("WATER")) {
      return "water";
    }

    if (
      value.startsWith("RECOVERY") ||
      value === "REST"
    ) {
      return "recovery";
    }

    return "";
  }

  /* ============================================================
     ADD ICONS TO EXISTING PROGRESS CARDS
     ============================================================ */

  function addIcons() {
    if (!strengthProgressOpen()) return;

    const progress = $(ROOT_ID);
    const grid = progress?.querySelector(
      ".mana-v993-metrics"
    );

    if (!grid) return;

    grid.querySelectorAll(
      ".mana-v993-metric"
    ).forEach(card => {
      const label = card.querySelector(
        ".mana-v993-metric-label"
      );

      if (!label) return;

      const type = metricType(
        label.textContent
      );

      if (!type) return;

      // Existing Strength Progress may rebuild the
      // cards when period filters change.
      // Only add one icon per card.

      const existing = label.querySelector(
        "." + ICON_CLASS
      );

      if (existing) return;

      const icon = document.createElement("span");

      icon.className = ICON_CLASS;
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = iconSvg(type);

      label.prepend(icon);
    });
  }

  /* ============================================================
     SCHEDULE REFRESH
     ============================================================ */

  let pending = false;

  function schedule() {
    if (pending) return;

    pending = true;

    requestAnimationFrame(() => {
      pending = false;
      addIcons();
    });
  }

  /* ============================================================
     INITIALISATION
     ============================================================ */

  function init() {
    installStyles();
    addIcons();

    const content = $(CONTENT_ID);

    if (content && window.MutationObserver) {
      const observer = new MutationObserver(
        schedule
      );

      // Observe newly rendered cards.
      // Do not observe text or attribute changes.

      observer.observe(content, {
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
            "#manaV83Tabs, " +
            "[data-v993-period], " +
            "[data-v993-detail]"
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
      "pageshow"
    ].forEach(eventName => {
      window.addEventListener(eventName, schedule);
    });

    console.log(
      "[Mana Strength] White Progress icons ready — " +
      BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once: true}
    );
  } else {
    init();
  }

})();
