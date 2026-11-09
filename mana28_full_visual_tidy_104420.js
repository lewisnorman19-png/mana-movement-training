
/* ============================================================
   MANA MOVEMENT
   MANA28 — COMPLETE VISUAL TIDY
   BUILD 104420

   FULL JAVASCRIPT FILE

   PURPOSE
   - Tidy headings across all five Mana28 screens
   - Match approved black/orange/white/silver identity
   - Remove Profile from Mana28 header
   - Make bottom navigation icons and labels white
   - Orange highlight for active navigation
   - Preserve existing overview and progress bar
   - Preserve existing workouts, Fuel and progress data
   - Do not affect Mana Strength or ManaLyfe

   Load AFTER mana28_overview_orange_104410.js
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104420";
  const STYLE_ID = "mana28VisualTidyStyle104420";
  const SHELL_ID = "manaV83ProgramShell";
  const CONTENT_ID = "manaV83Content";
  const TITLE_ID = "manaV83Title";
  const TABS_ID = "manaV83Tabs";

  if (window.MANA28_VISUAL_TIDY_BUILD === BUILD) {
    return;
  }

  window.MANA28_VISUAL_TIDY_BUILD = BUILD;

  const CLASS_NAME = "mana28-visual-tidy-104420";

  const COLOURS = {
    black: "#08090B",
    surface: "#15171A",
    surface2: "#1A1D21",
    orange: "#FF7927",
    orangeLight: "#FF9854",
    white: "#FFFFFF",
    silver: "#C1C6CE",
    muted: "#9DA4AD",
    border: "#444B53"
  };

  function getShell() {
    return document.getElementById(SHELL_ID);
  }

  function getContent() {
    return document.getElementById(CONTENT_ID);
  }

  function getTitle() {
    return document.getElementById(TITLE_ID);
  }

  function isMana28() {
    const shell = getShell();
    const title = getTitle();

    if (!shell || !title) return false;

    const titleText = String(
      title.textContent || ""
    ).trim().toUpperCase();

    return (
      shell.classList.contains("open") &&
      /^MANA\s*28\b/.test(titleText)
    );
  }

  function currentTab() {
    return (
      document.querySelector(
        "#" + TABS_ID + " .mana-v83-tab.active"
      )?.dataset?.v83Tab || ""
    );
  }

  /* ============================================================
     INSTALL SCOPED STYLES
     ============================================================ */

  function installStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* =========================================
         MANA28 COLOUR FOUNDATION
         ========================================= */

      #${SHELL_ID}.${CLASS_NAME} {
        --mana28-orange: ${COLOURS.orange};
        --mana28-white: ${COLOURS.white};
        --mana28-silver: ${COLOURS.silver};
        --mana28-surface: ${COLOURS.surface};
      }

      #${SHELL_ID}.${CLASS_NAME} .mana-v83-shell {
        background: ${COLOURS.black} !important;
        color: ${COLOURS.white} !important;
      }

      /* =========================================
         TOP HEADER
         ========================================= */

      #${SHELL_ID}.${CLASS_NAME} .mana-v83-head {
        align-items: center !important;
        gap: 12px !important;
        margin-bottom: 25px !important;
      }

      #${SHELL_ID}.${CLASS_NAME} .mana-v83-brand-wrap {
        min-width: 0 !important;
        flex: 1 1 auto !important;
        gap: 13px !important;
      }

      #${SHELL_ID}.${CLASS_NAME} .mana-v83-mark {
        border-color: ${COLOURS.orange} !important;
        color: ${COLOURS.white} !important;
        -webkit-text-fill-color: ${COLOURS.white} !important;
        background: ${COLOURS.black} !important;
      }

      #${SHELL_ID}.${CLASS_NAME} .mana-v83-kicker {
        color: ${COLOURS.orangeLight} !important;
        -webkit-text-fill-color: ${COLOURS.orangeLight} !important;
        font-size: 10px !important;
        font-weight: 850 !important;
        letter-spacing: .14em !important;
      }

      #${SHELL_ID}.${CLASS_NAME} #${TITLE_ID} {
        margin: 3px 0 0 !important;
        color: ${COLOURS.white} !important;
        -webkit-text-fill-color: ${COLOURS.white} !important;
        font-size: clamp(23px, 5vw, 29px) !important;
        font-weight: 900 !important;
        line-height: 1.12 !important;
        letter-spacing: -.025em !important;
      }

      #${SHELL_ID}.${CLASS_NAME} .mana-v83-sub {
        margin-top: 5px !important;
        color: ${COLOURS.silver} !important;
        -webkit-text-fill-color: ${COLOURS.silver} !important;
        font-size: 12px !important;
        font-weight: 550 !important;
        line-height: 1.4 !important;
      }

      /* Hide only Profile controls identified by this script. */

      #${SHELL_ID}.${CLASS_NAME} .mana28-hide-profile-104420 {
        display: none !important;
      }

      /* Keep the existing Home / Overview back button. */

      #${SHELL_ID}.${CLASS_NAME} #manaV83Back {
        flex: 0 0 auto !important;
        min-height: 41px !important;
        padding: 0 13px !important;
        border-radius: 13px !important;
        border: 1px solid ${COLOURS.border} !important;
        background: #141619 !important;
        background-image: none !important;
        color: ${COLOURS.white} !important;
        -webkit-text-fill-color: ${COLOURS.white} !important;
        font-weight: 750 !important;
        font-size: 12px !important;
      }

      /* =========================================
         OVERVIEW HEADING
         ========================================= */

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v978-intro {
        margin-bottom: 22px !important;
        padding-bottom: 17px !important;
        border-bottom: 1px solid ${COLOURS.border} !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v978-intro::after {
        background: ${COLOURS.orange} !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v978-kicker {
        color: ${COLOURS.orangeLight} !important;
        -webkit-text-fill-color: ${COLOURS.orangeLight} !important;
        letter-spacing: .14em !important;
        font-weight: 900 !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v978-intro h2 {
        margin: 7px 0 8px !important;
        color: ${COLOURS.white} !important;
        -webkit-text-fill-color: ${COLOURS.white} !important;
        font-size: clamp(25px, 5vw, 33px) !important;
        font-weight: 900 !important;
        line-height: 1.13 !important;
        letter-spacing: -.035em !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v978-intro p {
        max-width: 540px !important;
        margin: 0 !important;
        color: ${COLOURS.silver} !important;
        -webkit-text-fill-color: ${COLOURS.silver} !important;
        font-size: 13px !important;
        font-weight: 450 !important;
        line-height: 1.5 !important;
      }

      /* =========================================
         ALL MANA28 CONTENT HEADINGS
         ========================================= */

      #${SHELL_ID}.${CLASS_NAME}
      #${CONTENT_ID} h1 {
        color: ${COLOURS.white} !important;
        -webkit-text-fill-color: ${COLOURS.white} !important;
        font-size: clamp(25px, 5vw, 32px) !important;
        font-weight: 900 !important;
        line-height: 1.15 !important;
        letter-spacing: -.025em !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${CONTENT_ID} h2 {
        color: ${COLOURS.white} !important;
        -webkit-text-fill-color: ${COLOURS.white} !important;
        font-size: clamp(23px, 4.5vw, 30px) !important;
        font-weight: 850 !important;
        line-height: 1.18 !important;
        letter-spacing: -.025em !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${CONTENT_ID} h3 {
        color: ${COLOURS.white} !important;
        -webkit-text-fill-color: ${COLOURS.white} !important;
        font-size: clamp(18px, 4vw, 23px) !important;
        font-weight: 800 !important;
        line-height: 1.22 !important;
        letter-spacing: -.015em !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${CONTENT_ID} h4 {
        color: ${COLOURS.white} !important;
        -webkit-text-fill-color: ${COLOURS.white} !important;
        font-size: 16px !important;
        font-weight: 800 !important;
        line-height: 1.3 !important;
      }

      /* =========================================
         OVERVIEW CARD HEADINGS
         ========================================= */

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v978-launch .mana-v978-label {
        color: ${COLOURS.silver} !important;
        -webkit-text-fill-color: ${COLOURS.silver} !important;
        font-size: 10px !important;
        font-weight: 850 !important;
        letter-spacing: .1em !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v978-launch .mana-v978-title {
        color: ${COLOURS.white} !important;
        -webkit-text-fill-color: ${COLOURS.white} !important;
        font-size: clamp(16px, 4vw, 21px) !important;
        font-weight: 850 !important;
        line-height: 1.2 !important;
        letter-spacing: -.015em !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v978-launch .mana-v978-arrow {
        color: ${COLOURS.orangeLight} !important;
        -webkit-text-fill-color: ${COLOURS.orangeLight} !important;
      }

      /* =========================================
         WORKOUTS — HEADING TREATMENT
         ========================================= */

      #${SHELL_ID}.${CLASS_NAME}
      #${CONTENT_ID} .mana-v980-title,
      #${SHELL_ID}.${CLASS_NAME}
      #${CONTENT_ID} .mana-v980-day-title {
        color: ${COLOURS.white} !important;
        -webkit-text-fill-color: ${COLOURS.white} !important;
        font-weight: 850 !important;
        line-height: 1.2 !important;
      }

      /* =========================================
         GENERIC SECTION CARDS
         ========================================= */

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v83-card {
        background: ${COLOURS.surface} !important;
        border-color: ${COLOURS.border} !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v83-card h2,
      #${SHELL_ID}.${CLASS_NAME}
      .mana-v83-card h3 {
        color: ${COLOURS.white} !important;
        -webkit-text-fill-color: ${COLOURS.white} !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v83-card p {
        color: ${COLOURS.silver} !important;
      }

      /* =========================================
         FIVE-TAB BOTTOM NAVIGATION
         WHITE ICONS AND WHITE LABELS
         ========================================= */

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} {
        background: rgba(5, 6, 8, .98) !important;
        border-top: 1px solid ${COLOURS.border} !important;
        backdrop-filter: blur(12px) !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab {
        color: ${COLOURS.white} !important;
        -webkit-text-fill-color: ${COLOURS.white} !important;
        font-weight: 750 !important;
        background: transparent !important;
        background-image: none !important;
        text-shadow: none !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab:not(.active)::before {
        background: ${COLOURS.silver} !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab.active {
        color: ${COLOURS.orange} !important;
        -webkit-text-fill-color: ${COLOURS.orange} !important;
        background: transparent !important;
        background-image: none !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab.active::before {
        background: ${COLOURS.orange} !important;
      }

      /* Existing icon images — white when inactive. */

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab:not(.active) img {
        filter: grayscale(1) brightness(0) invert(1) !important;
        opacity: 1 !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab:not(.active) svg {
        color: ${COLOURS.white} !important;
        stroke: ${COLOURS.white} !important;
        filter: grayscale(1) brightness(0) invert(1) !important;
        opacity: 1 !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab:not(.active) svg * {
        stroke: ${COLOURS.white} !important;
      }

      /* Active icon remains orange. */

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab.active img {
        filter: grayscale(1) brightness(0)
                saturate(100%) invert(54%)
                sepia(92%) saturate(1700%)
                hue-rotate(341deg) brightness(105%)
                contrast(103%) !important;
        opacity: 1 !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab.active svg {
        color: ${COLOURS.orange} !important;
        stroke: ${COLOURS.orange} !important;
        filter: none !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab.active svg * {
        stroke: ${COLOURS.orange} !important;
      }

      /* =========================================
         BUTTON FOCUS ACCESSIBILITY
         ========================================= */

      #${SHELL_ID}.${CLASS_NAME}
      button:focus-visible {
        outline: 2px solid ${COLOURS.orange} !important;
        outline-offset: 3px !important;
      }

      /* =========================================
         MOBILE FINISH
         ========================================= */

      @media (max-width: 600px) {

        #${SHELL_ID}.${CLASS_NAME}
        .mana-v83-head {
          gap: 9px !important;
          margin-bottom: 19px !important;
        }

        #${SHELL_ID}.${CLASS_NAME}
        .mana-v83-brand-wrap {
          gap: 9px !important;
        }

        #${SHELL_ID}.${CLASS_NAME}
        .mana-v83-mark {
          width: 43px !important;
          height: 43px !important;
          flex-basis: 43px !important;
          font-size: 29px !important;
        }

        #${SHELL_ID}.${CLASS_NAME}
        #${TITLE_ID} {
          font-size: 23px !important;
        }

        #${SHELL_ID}.${CLASS_NAME}
        .mana-v83-sub {
          font-size: 11px !important;
        }

        #${SHELL_ID}.${CLASS_NAME}
        .mana-v83-back {
          min-height: 38px !important;
          padding: 0 9px !important;
          font-size: 11px !important;
        }

        #${SHELL_ID}.${CLASS_NAME}
        .mana-v978-intro h2 {
          font-size: 26px !important;
        }

        #${SHELL_ID}.${CLASS_NAME}
        #${TABS_ID} .mana-v83-tab {
          font-size: 10px !important;
        }

      }

    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     HEADER PROFILE BUTTON
     ============================================================ */

  function updateProfileButton(shell, enabled) {
    if (!shell) return;

    const header = shell.querySelector(".mana-v83-head");
    if (!header) return;

    const controls = header.querySelectorAll(
      "button, a, [role='button']"
    );

    controls.forEach(control => {
      if (control.id === "manaV83Back") return;

      const text = String(
        control.textContent || ""
      ).trim().toLowerCase();

      const aria = String(
        control.getAttribute("aria-label") || ""
      ).trim().toLowerCase();

      const label = text + " " + aria;

      if (/\bprofile\b/.test(label)) {
        control.classList.toggle(
          "mana28-hide-profile-104420",
          enabled
        );
      }
    });
  }

  /* ============================================================
     OVERVIEW TEXT TIDY
     ============================================================ */

  function tidyOverviewText() {
    if (currentTab() !== "overview") {
      return;
    }

    const content = getContent();
    if (!content) return;

    const intro = content.querySelector(
      ".mana-v978-intro"
    );

    if (!intro) return;

    const heading = intro.querySelector("h2");
    const paragraph = intro.querySelector("p");

    if (heading) {
      const original = heading.textContent.trim();

      if (
        original === "Your Mana 28 Hub" ||
        original === "Your 28-Day Journey"
      ) {
        if (heading.textContent !== "Your 28-Day Journey") {
          heading.textContent = "Your 28-Day Journey";
        }
      }
    }

    if (paragraph) {
      const original = paragraph.textContent.trim();

      if (
        original ===
        "Everything important in one place. Choose where you want to go next." ||
        original ===
        "Train. Fuel. Recover. Build momentum."
      ) {
        if (
          paragraph.textContent !==
          "Train. Fuel. Recover. Build momentum."
        ) {
          paragraph.textContent =
            "Train. Fuel. Recover. Build momentum.";
        }
      }
    }
  }

  /* ============================================================
     HEADER COPY
     ============================================================ */

  function tidyHeader() {
    const title = getTitle();
    const sub = document.getElementById("manaV83Sub");

    if (title) {
      const value = title.textContent.trim();

      // Preserve the program identifier for existing routing.

      if (
        value === "MANA28" ||
        value === "MANA 28"
      ) {
        if (value !== "MANA 28") {
          title.textContent = "MANA 28";
        }
      }
    }

    if (sub) {
      const oldText = sub.textContent.trim();

      if (
        oldText === "28 Days to Move With Purpose" ||
        oldText === "28 Days. Build Momentum."
      ) {
        if (
          oldText !== "28 Days. Build Momentum."
        ) {
          sub.textContent = "28 Days. Build Momentum.";
        }
      }
    }
  }

  /* ============================================================
     APPLY ONLY TO MANA28
     ============================================================ */

  function apply() {
    const shell = getShell();

    if (!shell) return;

    const active = isMana28();

    shell.classList.toggle(
      CLASS_NAME,
      active
    );

    updateProfileButton(shell, active);

    if (!active) {
      return;
    }

    tidyHeader();
    tidyOverviewText();
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
     STARTUP
     ============================================================ */

  function init() {
    installStyles();
    apply();

    const shell = getShell();

    if (shell && window.MutationObserver) {
      const observer = new MutationObserver(schedule);

      observer.observe(shell, {
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
            "#manaV83Tabs, " +
            "#manaV83ProgramShell, " +
            "#manaV80Mana28"
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

    window.addEventListener(
      "pageshow",
      schedule
    );

    window.MANA28_VISUAL_TIDY_BUILD = BUILD;

    console.log(
      "[Mana Movement] Mana28 visual tidy ready — " +
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
