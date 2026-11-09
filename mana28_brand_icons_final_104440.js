
/* ============================================================
   MANA MOVEMENT TRAINING
   MANA28 — BRAND + ICON REFINEMENT
   BUILD 104440

   COMPLETE JAVASCRIPT FILE

   CHANGES:
   1. Use the approved Mana Strength runner logo
   2. MANA white / 28 orange
   3. Restore premium Overview icon illustrations
   4. White borders on Overview icon frames
   5. Restore bottom navigation illustrations
   6. White inactive icons / orange active icons
   7. Match Mana Strength active navigation styling

   PRESERVES:
   - All existing navigation and click handlers
   - Mana28 workouts and 28-day completion records
   - Fuel, water and recovery
   - Progress and Learning
   - Existing orange challenge progress bar
   - Mana Strength and ManaLyfe

   LOAD AFTER BUILD 104430
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104440";

  const STYLE_ID = "mana28BrandIcons104440Style";
  const CLASS_NAME = "mana28-brand-icons-104440";

  const SHELL_ID = "manaV83ProgramShell";
  const CONTENT_ID = "manaV83Content";
  const TITLE_ID = "manaV83Title";
  const TABS_ID = "manaV83Tabs";

  const RUNNER = "ui/mana-runner-logo.png";

  const ASSETS = {
    program: "ui/tab-workout.png",
    fuel: "ui/tab-fuel.png",
    progress: "ui/tab-progress.png",
    learn: "ui/tab-learning.png"
  };

  const LABELS = {
    overview: "Overview",
    program: "Workouts",
    fuel: "Fuel",
    progress: "Progress",
    learn: "Learning"
  };

  if (window.MANA28_BRAND_ICONS_BUILD === BUILD) {
    return;
  }

  window.MANA28_BRAND_ICONS_BUILD = BUILD;

  const $ = id => document.getElementById(id);

  function shell() {
    return $(SHELL_ID);
  }

  function isMana28() {
    const root = shell();
    const title = $(TITLE_ID);

    if (!root || !title) return false;

    return (
      root.classList.contains("open") &&
      /^MANA\s*28\b/i.test(
        (title.textContent || "").trim()
      )
    );
  }

  function currentTab() {
    return document.querySelector(
      "#" + TABS_ID + " .mana-v83-tab.active"
    )?.dataset?.v83Tab || "";
  }

  /* ============================================================
     STYLES
     ============================================================ */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* ======================================
         BRAND HEADER
         ====================================== */

      #${SHELL_ID}.${CLASS_NAME} .mana-v83-mark {
        width: 66px !important;
        height: 52px !important;
        flex: 0 0 66px !important;
        display: grid !important;
        place-items: center !important;
        overflow: visible !important;
        border: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      .mana28-approved-runner {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
        border: 0 !important;
        background: transparent !important;
        filter: none !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TITLE_ID} {
        display: flex !important;
        align-items: baseline !important;
        gap: 7px !important;
        flex-wrap: nowrap !important;
        white-space: nowrap !important;
        font-weight: 900 !important;
        letter-spacing: -.025em !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TITLE_ID} .mana28-title-mana {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TITLE_ID} .mana28-title-28 {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      /* ======================================
         OVERVIEW ICON ILLUSTRATIONS
         ====================================== */

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v978-launch .mana-v978-icon {
        display: grid !important;
        place-items: center !important;
        width: 44px !important;
        height: 44px !important;
        flex: 0 0 44px !important;
        border: 1px solid #FFFFFF !important;
        border-radius: 12px !important;
        background: #0C0D10 !important;
        background-image: none !important;
        box-shadow: none !important;
        overflow: hidden !important;
        padding: 5px !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v978-launch .mana-v978-icon img {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        object-fit: contain !important;
        filter: none !important;
        opacity: 1 !important;
      }

      /* Keep original artwork colours. */

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v978-launch {
        background: #15171A !important;
        border: 1px solid #555C65 !important;
        box-shadow: none !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v978-launch .mana-v978-title {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v978-launch .mana-v978-label {
        color: #C1C6CE !important;
        -webkit-text-fill-color: #C1C6CE !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      .mana-v978-launch .mana-v978-arrow {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      /* ======================================
         BOTTOM NAVIGATION FOUNDATION
         ====================================== */

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} {
        display: grid !important;
        grid-template-columns:
          repeat(5,minmax(0,1fr)) !important;
        gap: 4px !important;
        background: rgba(8,9,11,.98) !important;
        border-top: 1px solid #464D55 !important;
        box-shadow: none !important;
        padding: 6px 5px
          calc(6px + env(safe-area-inset-bottom))
          !important;
        z-index: 24500 !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab {
        min-width: 0 !important;
        min-height: 73px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 5px !important;
        padding: 6px 3px !important;
        border: 1px solid transparent !important;
        border-radius: 13px !important;
        background: transparent !important;
        background-image: none !important;
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
        font-weight: 800 !important;
        text-align: center !important;
        box-shadow: none !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab::before {
        display: block !important;
        content: "" !important;
        width: 6px !important;
        height: 6px !important;
        min-height: 6px !important;
        margin: 0 auto 3px !important;
        border: 0 !important;
        border-radius: 50% !important;
        background: #69727D !important;
        flex: 0 0 6px !important;
      }

      /* ======================================
         ACTIVE TAB
         ====================================== */

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab.active {
        background: #20160F !important;
        background-image: none !important;
        border: 1px solid #FF7927 !important;
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab.active::before {
        background: #FF7927 !important;
      }

      /* ======================================
         TAB ICONS
         ====================================== */

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana28-nav-art {
        display: grid !important;
        place-items: center !important;
        width: 28px !important;
        height: 28px !important;
        flex: 0 0 28px !important;
        margin: 0 auto !important;
        padding: 0 !important;
        background: transparent !important;
        border: 0 !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana28-nav-art img {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
        border: 0 !important;
        box-shadow: none !important;
        opacity: 1 !important;
        filter:
          grayscale(1)
          brightness(0)
          invert(1) !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab.active
      .mana28-nav-art img {
        filter:
          brightness(0)
          saturate(100%)
          invert(56%)
          sepia(84%)
          saturate(1242%)
          hue-rotate(342deg)
          brightness(105%)
          contrast(101%) !important;
      }

      /* The simple Overview grid symbol. */

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana28-nav-overview svg {
        display: block !important;
        width: 24px !important;
        height: 24px !important;
        fill: none !important;
        stroke: #FFFFFF !important;
        stroke-width: 1.8 !important;
        stroke-linecap: round !important;
        stroke-linejoin: round !important;
        filter: none !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab.active
      .mana28-nav-overview svg {
        stroke: #FF7927 !important;
      }

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana28-nav-label {
        display: block !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        line-height: 1.1 !important;
        color: inherit !important;
        -webkit-text-fill-color: inherit !important;
        text-shadow: none !important;
        white-space: nowrap !important;
      }

      /* ======================================
         KEYBOARD ACCESSIBILITY
         ====================================== */

      #${SHELL_ID}.${CLASS_NAME}
      #${TABS_ID} .mana-v83-tab:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: 2px !important;
      }

      /* ======================================
         MOBILE
         ====================================== */

      @media(max-width:600px) {

        #${SHELL_ID}.${CLASS_NAME}
        .mana-v83-mark {
          width: 53px !important;
          height: 45px !important;
          flex-basis: 53px !important;
        }

        #${SHELL_ID}.${CLASS_NAME}
        #${TITLE_ID} {
          font-size: 23px !important;
          gap: 5px !important;
        }

        #${SHELL_ID}.${CLASS_NAME}
        #${TABS_ID} {
          gap: 2px !important;
          padding-left: 3px !important;
          padding-right: 3px !important;
        }

        #${SHELL_ID}.${CLASS_NAME}
        #${TABS_ID} .mana-v83-tab {
          min-height: 67px !important;
          padding: 5px 2px !important;
        }

        #${SHELL_ID}.${CLASS_NAME}
        #${TABS_ID} .mana28-nav-art {
          width: 25px !important;
          height: 25px !important;
          flex-basis: 25px !important;
        }

        #${SHELL_ID}.${CLASS_NAME}
        #${TABS_ID} .mana28-nav-label {
          font-size: 10px !important;
        }

      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     RUNNER — EXISTING MANA STRENGTH ASSET
     ============================================================ */

  function applyRunner() {
    const root = shell();
    if (!root) return;

    const mark = root.querySelector(".mana-v83-mark");
    if (!mark) return;

    if (mark.dataset.mana28Approved104440 === "true") {
      return;
    }

    // Keep the original mark for restoration when
    // switching to a different Mana program.

    if (!mark.hasAttribute("data-mana28-original-104440")) {
      mark.setAttribute(
        "data-mana28-original-104440",
        mark.innerHTML
      );
    }

    const img = document.createElement("img");

    img.className = "mana28-approved-runner";
    img.src = RUNNER;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");

    mark.replaceChildren(img);

    mark.dataset.mana28Approved104440 = "true";
  }

  function restoreRunner() {
    const root = shell();
    const mark = root?.querySelector(".mana-v83-mark");

    if (!mark) return;

    if (mark.dataset.mana28Approved104440 !== "true") {
      return;
    }

    const original = mark.getAttribute(
      "data-mana28-original-104440"
    );

    if (original !== null) {
      mark.innerHTML = original;
    }

    mark.dataset.mana28Approved104440 = "false";
  }

  /* ============================================================
     HEADER — MANA WHITE / 28 ORANGE
     ============================================================ */

  function applyTitle() {
    const title = $(TITLE_ID);

    if (!title) return;

    const expected = "MANA 28";

    if (title.textContent.trim() !== expected) {
      return;
    }

    if (
      title.querySelector(".mana28-final-title-104440")
    ) {
      return;
    }

    title.innerHTML = `
      <span class="mana28-title-mana mana28-final-title-104440">
        MANA
      </span>
      <span class="mana28-title-28">
        28
      </span>
    `;
  }

  /* ============================================================
     OVERVIEW ICONS — RESTORE APPROVED ASSETS
     ============================================================ */

  function restoreOverviewIcons() {
    if (currentTab() !== "overview") return;

    const content = $(CONTENT_ID);
    if (!content) return;

    content.querySelectorAll(
      ".mana-v978-launch[data-v978-tab]"
    ).forEach(card => {
      const tab = card.dataset.v978Tab;
      const asset = ASSETS[tab];

      if (!asset) return;

      const frame = card.querySelector(
        ".mana-v978-icon"
      );

      if (!frame) return;

      const image = frame.querySelector(
        "img.mana28-approved-icon-104440"
      );

      if (image && image.getAttribute("src") === asset) {
        return;
      }

      const img = document.createElement("img");
      img.className = "mana28-approved-icon-104440";
      img.src = asset;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");

      frame.replaceChildren(img);
    });
  }

  /* ============================================================
     BOTTOM NAV — USE APPROVED ILLUSTRATIONS
     ============================================================ */

  function overviewSVG() {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.4"></rect>
        <rect x="14" y="3" width="7" height="7" rx="1.4"></rect>
        <rect x="3" y="14" width="7" height="7" rx="1.4"></rect>
        <rect x="14" y="14" width="7" height="7" rx="1.4"></rect>
      </svg>
    `;
  }

  function navIcon(key) {
    if (key === "overview") {
      return `
        <span class="mana28-nav-art mana28-nav-overview"
              aria-hidden="true">
          ${overviewSVG()}
        </span>
      `;
    }

    const asset = ASSETS[key];

    if (!asset) return "";

    return `
      <span class="mana28-nav-art" aria-hidden="true">
        <img src="${asset}" alt="">
      </span>
    `;
  }

  function restoreBottomIcons() {
    const holder = $(TABS_ID);
    if (!holder) return;

    holder.querySelectorAll(
      ".mana-v83-tab[data-v83-tab]"
    ).forEach(button => {
      const key = button.dataset.v83Tab;

      if (!Object.prototype.hasOwnProperty.call(
        LABELS, key
      )) {
        return;
      }

      // Buttons are recreated by the existing app
      // when the selected tab changes.
      // We change their contents, never their handlers.

      if (
        button.dataset.mana28Nav104440 === key &&
        button.querySelector(".mana28-nav-art")
      ) {
        return;
      }

      const art = navIcon(key);

      button.innerHTML = `
        ${art}
        <span class="mana28-nav-label">
          ${LABELS[key]}
        </span>
      `;

      button.setAttribute("aria-label", LABELS[key]);
      button.dataset.mana28Nav104440 = key;
    });
  }

  /* ============================================================
     RESTORE OTHER PROGRAMS
     ============================================================ */

  function removeMana28NavigationArtwork() {
    const holder = $(TABS_ID);
    if (!holder) return;

    // Navigation is normally rebuilt by the original
    // program shell when programs switch.
    // Never change another program's labels or handlers.

    holder.querySelectorAll(
      ".mana-v83-tab[data-mana28-nav104440]"
    ).forEach(button => {
      const art = button.querySelector(
        ".mana28-nav-art"
      );

      const label = button.dataset.v83Tab;

      if (!art) return;

      art.remove();

      const text = button.querySelector(
        ".mana28-nav-label"
      );

      if (text) {
        text.replaceWith(
          document.createTextNode(
            label === "learn" ? "Learn" :
            label === "program" ? "Workouts" :
            label === "fuel" ? "Fuel" :
            label === "progress" ? "Progress" :
            "Overview"
          )
        );
      }

      delete button.dataset.mana28Nav104440;
    });
  }

  /* ============================================================
     APPLY
     ============================================================ */

  function apply() {
    const root = shell();

    if (!root) return;

    const active = isMana28();

    root.classList.toggle(CLASS_NAME, active);

    if (!active) {
      restoreRunner();
      removeMana28NavigationArtwork();
      return;
    }

    applyRunner();
    applyTitle();
    restoreOverviewIcons();
    restoreBottomIcons();
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
     INITIALISATION
     ============================================================ */

  function init() {
    installStyles();

    apply();

    const root = shell();

    if (root && window.MutationObserver) {
      const observer = new MutationObserver(schedule);

      // Respond to program and tab changes.
      // Do not observe attribute changes here because
      // our own class changes should not trigger loops.

      observer.observe(root, {
        childList: true,
        subtree: true,
        characterData: true
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

    console.log(
      "[Mana Movement] Mana28 approved brand and icons ready — " +
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
