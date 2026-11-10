
/* ============================================================
   MANA MOVEMENT TRAINING
   MANA28 PROGRESS ICONS
   BUILD 104530

   COMPLETE JAVASCRIPT FILE

   PURPOSE
   ------------------------------------------------------------
   - Match the icons used in the Fuel target cards
   - Add icons to all five Mana28 Progress cards
   - Orange borders around the small icon frames
   - White icon artwork
   - All Progress bars remain Mana orange

   PRESERVES
   ------------------------------------------------------------
   - All workout completion data
   - Fuel and daily target calculations
   - Water and recovery tracking
   - Progress percentages and history
   - Daily / Weekly / Monthly / To Date buttons
   - Mana Strength and ManaLyfe

   LOAD AFTER BUILD 104520
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104530";

  const SHELL_ID = "manaV83ProgramShell";
  const TITLE_ID = "manaV83Title";
  const CONTENT_ID = "manaV83Content";
  const TABS_ID = "manaV83Tabs";

  const STYLE_ID = "mana28ProgressIcons104530Style";
  const ACTIVE_CLASS = "mana28-progress-icons-104530";
  const ICON_CLASS = "mana28-progress-icon-104530";

  const ORANGE = "#FF7927";
  const WHITE = "#FFFFFF";
  const TRACK = "#353A40";

  if (window.MANA28_PROGRESS_ICONS_BUILD === BUILD) {
    return;
  }

  window.MANA28_PROGRESS_ICONS_BUILD = BUILD;

  const $ = id => document.getElementById(id);

  function isMana28Progress() {
    const shell = $(SHELL_ID);
    const title = $(TITLE_ID);

    if (!shell || !title) return false;
    if (!shell.classList.contains("open")) return false;

    const name = String(title.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();

    const selected = document.querySelector(
      "#" + TABS_ID + " .mana-v83-tab.active"
    )?.dataset?.v83Tab;

    return name === "MANA 28" && selected === "progress";
  }

  /* ============================================================
     FUEL ICON ARTWORK
     Same shapes as the existing Fuel iconSvg function.
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
          <rect x="17" y="20" width="14"
                height="8" rx="3"
                fill="currentColor"/>
          <rect x="9" y="14" width="6"
                height="20" rx="2"
                fill="currentColor"/>
          <rect x="33" y="14" width="6"
                height="20" rx="2"
                fill="currentColor"/>
          <rect x="4" y="18" width="4"
                height="12" rx="2"
                fill="currentColor"/>
          <rect x="40" y="18" width="4"
                height="12" rx="2"
                fill="currentColor"/>
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
     CSS — MANA ORANGE / WHITE / SILVER
     ============================================================ */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* Only Mana28 Progress is affected. */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-card-head {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
      }

      /* Keep the old W/O, W, R, C, P placeholders hidden. */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-card-head > .mana-v981-icon {
        display: none !important;
      }

      /* Matching small icon frames. */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .${ICON_CLASS} {
        box-sizing: border-box !important;
        display: grid !important;
        place-items: center !important;

        width: 39px !important;
        height: 39px !important;
        min-width: 39px !important;
        flex: 0 0 39px !important;

        padding: 7px !important;
        border: 1px solid ${ORANGE} !important;
        border-radius: 12px !important;

        background: #101216 !important;
        background-image: none !important;
        box-shadow: none !important;

        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .${ICON_CLASS} svg {
        display: block !important;
        width: 100% !important;
        height: 100% !important;

        fill: ${WHITE} !important;
        color: ${WHITE} !important;

        filter: none !important;
        opacity: 1 !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .${ICON_CLASS} svg path,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .${ICON_CLASS} svg rect {
        fill: ${WHITE} !important;
        stroke: none !important;
      }

      /* Labels stay white/silver. */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-label {
        color: #C1C6CE !important;
        -webkit-text-fill-color: #C1C6CE !important;
        font-size: 10px !important;
        font-weight: 850 !important;
        letter-spacing: .1em !important;
      }

      /* All five percentage bars remain orange. */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-bar,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-overall-bar {
        background: ${TRACK} !important;
        background-image: none !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-bar > span,
      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-overall-bar > span {
        background: ${ORANGE} !important;
        background-image: none !important;
        box-shadow: none !important;
      }

      @media (max-width: 600px) {
        html body
        #${SHELL_ID}.${ACTIVE_CLASS}
        #${CONTENT_ID}
        .${ICON_CLASS} {
          width: 35px !important;
          height: 35px !important;
          min-width: 35px !important;
          flex-basis: 35px !important;
          padding: 6px !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     ADD ICONS TO EXISTING PROGRESS CARDS
     ============================================================ */

  function addIcons() {
    if (!isMana28Progress()) return;

    const holder = $(CONTENT_ID);
    if (!holder) return;

    holder.querySelectorAll(".mana-v981-card").forEach(card => {
      const head = card.querySelector(".mana-v981-card-head");
      const label = card.querySelector(".mana-v981-label");

      if (!head || !label) return;

      const type = label.textContent
        .trim()
        .toLowerCase();

      if (![
        "workouts",
        "water",
        "recovery",
        "calories",
        "protein"
      ].includes(type)) {
        return;
      }

      // The Progress page can rerender when the user
      // changes Daily / Weekly / Monthly / To Date.
      // Each newly rendered card receives just one icon.

      if (head.querySelector("." + ICON_CLASS)) {
        return;
      }

      const icon = document.createElement("span");

      icon.className = ICON_CLASS;
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = iconSvg(type);

      head.insertBefore(icon, label);
    });
  }

  /* ============================================================
     APPLY
     ============================================================ */

  function apply() {
    const shell = $(SHELL_ID);
    if (!shell) return;

    const active = isMana28Progress();

    shell.classList.toggle(ACTIVE_CLASS, active);

    if (!active) return;

    addIcons();
  }

  /* ============================================================
     SCHEDULER
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
        if (event.target.closest(
          "#manaV83Tabs, " +
          "#manaV83ProgramShell, " +
          "[data-v981-period]"
        )) {
          schedule();
        }
      },
      true
    );

    [
      "mana:program-tab-change",
      "mana:fuel-updated",
      "mana:recovery-updated",
      "pageshow"
    ].forEach(eventName => {
      window.addEventListener(eventName, schedule);
    });

    console.log(
      "[Mana28] Matching Fuel icons ready — " + BUILD
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
