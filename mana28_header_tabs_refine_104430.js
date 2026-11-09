/* ============================================================
   MANA MOVEMENT
   MANA28 — HEADER + TABS REFINE
   BUILD 104430

   FULL JAVASCRIPT FILE

   PURPOSE
   - Replace the top-left M with the runner mark
   - Make header title read MANA (orange) + 28 (white)
   - Rebuild the bottom tabs so they display correctly
   - Make Overview icon borders white, not orange
   - Keep existing functionality intact
   - Do not affect Mana Strength or Mana Lyfe

   Load AFTER:
   1. mana28_overview_orange_104410.js
   2. mana28_full_visual_tidy_104420.js
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104430";
  const STYLE_ID = "mana28HeaderTabsRefine104430Style";
  const SHELL_ID = "manaV83ProgramShell";
  const TITLE_ID = "manaV83Title";
  const TABS_ID = "manaV83Tabs";
  const MARK_CLASS = "mana-v83-mark";
  const WRAP_CLASS = "mana28-refine-104430";

  if (window.MANA28_HEADER_TABS_REFINE_BUILD === BUILD) {
    return;
  }

  window.MANA28_HEADER_TABS_REFINE_BUILD = BUILD;

  function shell() {
    return document.getElementById(SHELL_ID);
  }

  function titleEl() {
    return document.getElementById(TITLE_ID);
  }

  function isMana28() {
    const root = shell();
    const title = titleEl();

    if (!root || !title) return false;

    const value = String(title.textContent || "")
      .trim()
      .toUpperCase();

    return (
      root.classList.contains("open") &&
      /^MANA\s*28\b/.test(value)
    );
  }

  function installStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      /* ======================================================
         SCOPE
         ====================================================== */

      #${SHELL_ID}.${WRAP_CLASS} {
        --mana28-orange: #FF7927;
        --mana28-orange-light: #FF9854;
        --mana28-white: #FFFFFF;
        --mana28-silver: #C1C6CE;
        --mana28-border: #444B53;
        --mana28-surface: #15171A;
        --mana28-surface-2: #111317;
        --mana28-black: #08090B;
      }

      /* ======================================================
         HEADER MARK — RUNNER INSTEAD OF M
         ====================================================== */

      #${SHELL_ID}.${WRAP_CLASS} .${MARK_CLASS} {
        display: grid !important;
        place-items: center !important;
        overflow: hidden !important;
        background: var(--mana28-black) !important;
        border: 2px solid var(--mana28-orange) !important;
      }

      #${SHELL_ID}.${WRAP_CLASS} .mana28-runner-mark {
        width: 28px;
        height: 28px;
        display: block;
        color: var(--mana28-white);
      }

      #${SHELL_ID}.${WRAP_CLASS} .mana28-runner-mark svg {
        width: 100%;
        height: 100%;
        display: block;
      }

      /* ======================================================
         HEADER TITLE — MANA ORANGE / 28 WHITE
         ====================================================== */

      #${SHELL_ID}.${WRAP_CLASS} #${TITLE_ID} {
        display: flex !important;
        align-items: baseline !important;
        gap: 8px !important;
        flex-wrap: wrap !important;
      }

      #${SHELL_ID}.${WRAP_CLASS} #${TITLE_ID} .mana28-title-mana {
        color: var(--mana28-orange) !important;
        -webkit-text-fill-color: var(--mana28-orange) !important;
      }

      #${SHELL_ID}.${WRAP_CLASS} #${TITLE_ID} .mana28-title-28 {
        color: var(--mana28-white) !important;
        -webkit-text-fill-color: var(--mana28-white) !important;
      }

      /* ======================================================
         OVERVIEW ICON BORDERS — WHITE
         ====================================================== */

      #${SHELL_ID}.${WRAP_CLASS}
      .mana-v978-launch .mana-v978-icon {
        border: 1px solid var(--mana28-white) !important;
        background: rgba(255,255,255,.05) !important;
        box-shadow: none !important;
      }

      /* Preserve orange artwork feel inside overview icons. */
      #${SHELL_ID}.${WRAP_CLASS}
      .mana-v978-launch .mana-v978-icon svg,
      #${SHELL_ID}.${WRAP_CLASS}
      .mana-v978-launch .mana-v978-icon img {
        filter: none !important;
      }

      /* ======================================================
         BOTTOM TABS — CLEAN MANA28 TAB SYSTEM
         ====================================================== */

      #${SHELL_ID}.${WRAP_CLASS} #${TABS_ID} {
        background: rgba(5,6,8,.98) !important;
        border-top: 1px solid var(--mana28-border) !important;
        backdrop-filter: blur(14px) !important;
      }

      #${SHELL_ID}.${WRAP_CLASS} #${TABS_ID} .mana-v83-tab {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
        min-height: 56px !important;
        padding: 6px 4px !important;
        border: 0 !important;
        background: transparent !important;
        background-image: none !important;
        box-shadow: none !important;
        text-shadow: none !important;
        color: var(--mana28-white) !important;
        -webkit-text-fill-color: var(--mana28-white) !important;
        font-size: 11px !important;
        font-weight: 800 !important;
      }

      #${SHELL_ID}.${WRAP_CLASS} #${TABS_ID} .mana-v83-tab::before {
        display: none !important;
        content: none !important;
      }

      #${SHELL_ID}.${WRAP_CLASS} #${TABS_ID} .mana-v83-tab.active {
        color: var(--mana28-orange) !important;
        -webkit-text-fill-color: var(--mana28-orange) !important;
      }

      #${SHELL_ID}.${WRAP_CLASS} #${TABS_ID} .mana-v83-tab .mana28-tab-icon {
        width: 22px;
        height: 22px;
        display: block;
        color: currentColor;
        flex: 0 0 auto;
      }

      #${SHELL_ID}.${WRAP_CLASS} #${TABS_ID} .mana-v83-tab .mana28-tab-icon svg {
        width: 100%;
        height: 100%;
        display: block;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      #${SHELL_ID}.${WRAP_CLASS} #${TABS_ID} .mana-v83-tab .mana28-tab-label {
        display: block;
        font-size: 11px;
        font-weight: 800;
        line-height: 1.1;
        letter-spacing: 0;
        color: currentColor;
        -webkit-text-fill-color: currentColor;
      }

      /* Hide any old icon assets inside buttons after we rebuild them. */
      #${SHELL_ID}.${WRAP_CLASS} #${TABS_ID} .mana-v83-tab img:not(.mana28-keep),
      #${SHELL_ID}.${WRAP_CLASS} #${TABS_ID} .mana-v83-tab > svg:not(.mana28-keep) {
        display: none !important;
      }

      /* ======================================================
         MOBILE
         ====================================================== */

      @media (max-width: 600px) {
        #${SHELL_ID}.${WRAP_CLASS} .mana28-runner-mark {
          width: 24px;
          height: 24px;
        }

        #${SHELL_ID}.${WRAP_CLASS} #${TABS_ID} .mana-v83-tab {
          gap: 5px !important;
          font-size: 10px !important;
        }

        #${SHELL_ID}.${WRAP_CLASS} #${TABS_ID} .mana-v83-tab .mana28-tab-icon {
          width: 20px;
          height: 20px;
        }

        #${SHELL_ID}.${WRAP_CLASS} #${TABS_ID} .mana-v83-tab .mana28-tab-label {
          font-size: 10px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function runnerMarkup() {
    return `
      <span class="mana28-runner-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" role="img" aria-hidden="true">
          <defs>
            <filter id="mana28RunnerGlow104430" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="1.2" result="blur"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="blur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>
          </defs>
          <g fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23.5 8.2c2.4.4 3.8 1.1 5 2.1" stroke="#FF7927" stroke-width="1.8" opacity=".9"/>
            <path d="M21.3 5.5c2.8.2 5 .9 7.1 2.4" stroke="#FF9854" stroke-width="1.6" opacity=".8"/>
            <circle cx="19.8" cy="6.4" r="2.4" fill="#FFFFFF" stroke="none"/>
            <path d="M18.7 8.9l-3.1 4.1 4.2 2.4 2.9 4.7" stroke="#FFFFFF" stroke-width="2.4" filter="url(#mana28RunnerGlow104430)"/>
            <path d="M16.3 12.1l-4.1-.5-2.6 3.6" stroke="#FFFFFF" stroke-width="2.2"/>
            <path d="M19.1 15.2l-4.4 4.5-4.2.9" stroke="#FFFFFF" stroke-width="2.2"/>
            <path d="M22.4 19.8l3.2 4.9" stroke="#FFFFFF" stroke-width="2.2"/>
          </g>
        </svg>
      </span>
    `;
  }

  function titleMarkup() {
    return `
      <span class="mana28-title-mana">MANA</span>
      <span class="mana28-title-28">28</span>
    `;
  }

  function tabLabel(key) {
    switch (key) {
      case "overview": return "Overview";
      case "program": return "Workouts";
      case "fuel": return "Fuel";
      case "progress": return "Progress";
      case "learn": return "Learning";
      default: return "";
    }
  }

  function tabIcon(key) {
    switch (key) {
      case "overview":
        return `
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4" y="4" width="6" height="6" rx="1"></rect>
            <rect x="14" y="4" width="6" height="6" rx="1"></rect>
            <rect x="4" y="14" width="6" height="6" rx="1"></rect>
            <rect x="14" y="14" width="6" height="6" rx="1"></rect>
          </svg>
        `;
      case "program":
        return `
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 9h3"></path>
            <path d="M18 9h3"></path>
            <path d="M6 7v4"></path>
            <path d="M18 7v4"></path>
            <path d="M8 6h8"></path>
            <path d="M8 12h8"></path>
            <path d="M3 15h3"></path>
            <path d="M18 15h3"></path>
            <path d="M6 13v4"></path>
            <path d="M18 13v4"></path>
            <path d="M8 12h8"></path>
            <path d="M8 18h8"></path>
          </svg>
        `;
      case "fuel":
        return `
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 13h14c0 4.3-3.2 6.5-7 6.5S5 17.3 5 13Z"></path>
            <path d="M8 10c1.1-1.7 2.2-1.9 3.4 0"></path>
            <path d="M12.6 8c1-1.6 2.3-1.8 3.6 0"></path>
            <path d="M11.5 4.8c1.4 1.1 1.4 2.4 0 3.6"></path>
          </svg>
        `;
      case "progress":
        return `
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 18V11"></path>
            <path d="M10 18V8"></path>
            <path d="M15 18V5"></path>
            <path d="M20 18V2.8"></path>
            <path d="M3 18h19"></path>
          </svg>
        `;
      case "learn":
        return `
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 5.5h6.2c1.6 0 2.8.7 3.8 1.8 1-1.1 2.2-1.8 3.8-1.8H19v12.2h-4.2c-1.4 0-2.6.6-3.8 1.8-1.2-1.2-2.4-1.8-3.8-1.8H5Z"></path>
            <path d="M12 7.3v12"></path>
          </svg>
        `;
      default:
        return `
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8"></circle>
          </svg>
        `;
    }
  }

  function replaceRunnerMark() {
    const root = shell();
    if (!root) return;

    const mark = root.querySelector("." + MARK_CLASS);
    if (!mark) return;

    if (!mark.dataset.originalMarkup104430) {
      mark.dataset.originalMarkup104430 = mark.innerHTML;
    }

    if (mark.dataset.runnerApplied104430 === "true") {
      return;
    }

    mark.innerHTML = runnerMarkup();
    mark.dataset.runnerApplied104430 = "true";
  }

  function restoreMark() {
    const root = shell();
    if (!root) return;

    const mark = root.querySelector("." + MARK_CLASS);
    if (!mark) return;

    if (
      mark.dataset.originalMarkup104430 &&
      mark.dataset.runnerApplied104430 === "true"
    ) {
      mark.innerHTML = mark.dataset.originalMarkup104430;
      mark.dataset.runnerApplied104430 = "false";
    }
  }

  function updateHeaderTitle() {
    const title = titleEl();
    if (!title) return;

    if (title.dataset.titleStyled104430 === "true") {
      return;
    }

    title.innerHTML = titleMarkup();
    title.dataset.titleStyled104430 = "true";
  }

  function rebuildTabs() {
    const holder = document.getElementById(TABS_ID);
    if (!holder) return;

    const buttons = holder.querySelectorAll(".mana-v83-tab[data-v83-tab]");

    buttons.forEach(button => {
      const key = button.dataset.v83Tab || "";
      const label = tabLabel(key);

      if (!label) return;

      if (button.dataset.mana28TabBuilt104430 === key) {
        return;
      }

      button.innerHTML = `
        <span class="mana28-tab-icon" aria-hidden="true">
          ${tabIcon(key)}
        </span>
        <span class="mana28-tab-label">${label}</span>
      `;

      button.setAttribute("aria-label", label);
      button.dataset.mana28TabBuilt104430 = key;
    });
  }

  function apply() {
    const root = shell();
    if (!root) return;

    const active = isMana28();

    root.classList.toggle(WRAP_CLASS, active);

    if (!active) {
      restoreMark();
      return;
    }

    replaceRunnerMark();
    updateHeaderTitle();
    rebuildTabs();
  }

  let pending = false;

  function schedule() {
    if (pending) return;

    pending = true;

    requestAnimationFrame(() => {
      pending = false;
      apply();
    });
  }

  function init() {
    installStyles();
    apply();

    const root = shell();

    if (root && window.MutationObserver) {
      const observer = new MutationObserver(schedule);
      observer.observe(root, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["class"]
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
      "[Mana Movement] Mana28 header + tabs refine ready — " + BUILD
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
