
/* ============================================================
   MANA MOVEMENT TRAINING
   MANA28 FINAL SCREEN CORRECTIONS
   BUILD 104470

   COMPLETE JAVASCRIPT FILE

   FIXES
   ------------------------------------------------------------
   1. Overview illustration frames: white borders
   2. Remove unnecessary Overview orange card accents
   3. Whakatauki: Mana orange instead of gold
   4. Fuel: restore header visibility on entry
   5. Bottom navigation: correct missing illustrated icons
   6. Progress: remove purple heading artwork

   PRESERVES
   ------------------------------------------------------------
   - All existing Mana28 workouts
   - Saved workout completion records
   - Four-week workout schedule
   - Fuel meals and calculations
   - Protein, calories, water and recovery
   - 28-day progress tracking
   - All original navigation handlers
   - Mana Strength and ManaLyfe

   LOAD AFTER BUILD 104460
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104470";
  const SHELL_ID = "manaV83ProgramShell";
  const CONTENT_ID = "manaV83Content";
  const TITLE_ID = "manaV83Title";
  const TABS_ID = "manaV83Tabs";

  const STYLE_ID = "mana28Corrections104470Style";
  const ACTIVE_CLASS = "mana28-corrections-104470";

  const ORANGE = "#FF7927";
  const WHITE = "#FFFFFF";
  const SILVER = "#C1C6CE";

  const ICONS = {
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

  if (window.MANA28_CORRECTIONS_BUILD === BUILD) {
    return;
  }

  window.MANA28_CORRECTIONS_BUILD = BUILD;

  const $ = id => document.getElementById(id);

  function shell() {
    return $(SHELL_ID);
  }

  function isMana28() {
    const root = shell();
    const title = $(TITLE_ID);

    if (!root || !title) return false;
    if (!root.classList.contains("open")) return false;

    return /^MANA\s*28\b/i.test(
      String(title.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
    );
  }

  function activeTab() {
    return document.querySelector(
      "#" + TABS_ID + " .mana-v83-tab.active"
    )?.dataset?.v83Tab || "";
  }

  /* ============================================================
     INSTALL SCOPED COLOUR AND ICON STYLES
     ============================================================ */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* ======================================
         OVERVIEW — NEUTRAL CARD FINISH
         ====================================== */

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v978-launch {
        background: #15171A !important;
        background-image: none !important;
        border: 1px solid #656D77 !important;
        box-shadow: none !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v978-launch::before {
        display: none !important;
        content: none !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v978-launch .mana-v978-icon {
        border: 1px solid #FFFFFF !important;
        background: #0B0D10 !important;
        background-image: none !important;
        box-shadow: none !important;
        border-radius: 12px !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v978-launch .mana-v978-icon img {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
        filter: none !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v978-label,
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v978-arrow {
        color: ${SILVER} !important;
        -webkit-text-fill-color: ${SILVER} !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v978-title {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      /* Overview intro remains clean and understated. */

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v978-intro::after {
        background: #656D77 !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      #manaV1019ProgramBadge {
        color: ${SILVER} !important;
        -webkit-text-fill-color: ${SILVER} !important;
        border-color: #656D77 !important;
        background: #15171A !important;
      }

      /* ======================================
         WHAKATAUKI — MANA ORANGE
         ====================================== */

      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV985Whakatauki {
        border-left-color: ${ORANGE} !important;
        border-top-color: #444B53 !important;
        border-right-color: #444B53 !important;
        border-bottom-color: #444B53 !important;
        background: #15171A !important;
        background-image: none !important;
        box-shadow: none !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV985Whakatauki .mana-v985-footer-label {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV985Whakatauki strong {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV985Whakatauki span {
        color: ${SILVER} !important;
        -webkit-text-fill-color: ${SILVER} !important;
      }

      /* ======================================
         FUEL — TOP HEADING
         ====================================== */

      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV1015Fuel .m1022-hero {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        margin-top: 0 !important;
        padding-top: 0 !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV1015Fuel .m1022-kicker {
        display: block !important;
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV1015Fuel .m1022-hero h2 {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #manaV1015Fuel .m1022-hero p {
        color: ${SILVER} !important;
      }

      /* ======================================
         PROGRESS — REMOVE PURPLE HEADING ICON
         ====================================== */

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-head > .mana-v981-icon,
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-head > .mana-v981-heading-icon,
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-head > .mana-v981-head-icon,
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${CONTENT_ID}
      .mana-v981-head > svg {
        display: none !important;
      }

      /* Keep the actual Progress data cards intact. */

      /* ======================================
         BOTTOM TABS — COMPLETE ILLUSTRATIONS
         ====================================== */

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID} {
        background: #08090B !important;
        border-top: 1px solid #464D55 !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID}
      .mana-v83-tab {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
        background: transparent !important;
        border: 1px solid transparent !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID}
      .mana-v83-tab.active {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
        background: #20160F !important;
        border: 1px solid ${ORANGE} !important;
      }

      /* A dedicated illustration surface avoids the older
         PNG filters that produced blank grey/orange squares. */

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID}
      .mana28-nav-art {
        position: relative !important;
        display: grid !important;
        place-items: center !important;
        width: 28px !important;
        height: 28px !important;
        flex: 0 0 28px !important;
        overflow: visible !important;
        margin: 0 auto !important;
        background: transparent !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID}
      .mana28-nav-art .mana28-nav-picture-104470 {
        display: block !important;
        width: 27px !important;
        height: 27px !important;
        flex: 0 0 27px !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: contain !important;
        filter: grayscale(1) brightness(0) invert(1) !important;
        opacity: 1 !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID}
      .mana-v83-tab.active
      .mana28-nav-picture-104470 {
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

      /* Keep the compatibility image element available to
         existing modules, but make it visually inert. */

      html body
      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID}
      .mana28-nav-art
      img.mana28-keep {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        min-width: 0 !important;
        min-height: 0 !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID}
      .mana28-nav-label {
        color: inherit !important;
        -webkit-text-fill-color: inherit !important;
        font-weight: 800 !important;
      }

      /* The Overview icon is already working.
         Preserve its original clean four-square symbol. */

      #${SHELL_ID}.${ACTIVE_CLASS}
      #${TABS_ID}
      .mana28-nav-overview svg {
        width: 24px !important;
        height: 24px !important;
        display: block !important;
      }

      @media(max-width:600px) {

        #${SHELL_ID}.${ACTIVE_CLASS}
        #${TABS_ID}
        .mana28-nav-art {
          width: 25px !important;
          height: 25px !important;
          flex-basis: 25px !important;
        }

        #${SHELL_ID}.${ACTIVE_CLASS}
        #${TABS_ID}
        .mana28-nav-picture-104470 {
          width: 24px !important;
          height: 24px !important;
        }

      }

    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     RESTORE BOTTOM ICON ARTWORK
     ============================================================ */

  function updateNavigationIcons() {
    if (!isMana28()) return;

    const tabs = $(TABS_ID);
    if (!tabs) return;

    tabs.querySelectorAll(
      ".mana-v83-tab[data-v83-tab]"
    ).forEach(button => {

      const key = button.dataset.v83Tab;

      if (!(key in LABELS)) return;
      if (key === "overview") return;

      const file = ICONS[key];
      if (!file) return;

      let art = button.querySelector(".mana28-nav-art");

      if (!art) {
        art = document.createElement("span");
        art.className = "mana28-nav-art";
        art.setAttribute("aria-hidden", "true");
        button.prepend(art);
      }

      // Preserve one compatibility image for the existing
      // Mana28 modules. Those modules expect an img to exist.

      let image = art.querySelector("img");

      if (!image) {
        image = document.createElement("img");
        image.alt = "";
        image.setAttribute("aria-hidden", "true");
        image.className = "mana28-keep";
        art.appendChild(image);
      }

      image.classList.add("mana28-keep");

      if (image.getAttribute("src") !== file) {
        image.setAttribute("src", file);
      }

      // Build a separate illustration using the same
      // approved asset, avoiding old image styling.

      let picture = art.querySelector(
        ".mana28-nav-picture-104470"
      );

      if (!picture) {
        picture = document.createElement("span");
        picture.className =
          "mana28-nav-picture-104470";
        picture.setAttribute("aria-hidden", "true");
        art.appendChild(picture);
      }

      const desired = 'url("' + file + '")';

      if (picture.style.backgroundImage !== desired) {
        picture.style.backgroundImage = desired;
      }

      button.dataset.mana28Nav104440 = key;
    });
  }

  /* ============================================================
     FUEL — CORRECT VIEW ENTRY POSITION
     ============================================================ */

  function restoreFuelHeader() {
    if (!isMana28()) return;
    if (activeTab() !== "fuel") return;

    const content = $(CONTENT_ID);
    const fuel = content?.querySelector("#manaV1015Fuel");
    const hero = fuel?.querySelector(".m1022-hero");

    if (!hero) return;

    const kicker = hero.querySelector(".m1022-kicker");

    if (kicker) {
      if (kicker.textContent.trim() !== "MANA 28 • FUEL") {
        kicker.textContent = "MANA 28 • FUEL";
      }
    }
  }

  let lastTab = "";

  function handleTabPosition() {
    if (!isMana28()) {
      lastTab = "";
      return;
    }

    const tab = activeTab();

    if (tab === lastTab) return;
    lastTab = tab;

    if (tab !== "fuel") return;

    // Scroll only on entering Fuel, never when logging meals.
    // Allow the existing Fuel renderer to finish first.

    [100, 300, 600].forEach(delay => {
      setTimeout(() => {
        if (!isMana28()) return;
        if (activeTab() !== "fuel") return;

        restoreFuelHeader();

        const s = shell();

        if (s) s.scrollTop = 0;

        const inner = s?.querySelector(".mana-v83-shell");
        if (inner) inner.scrollTop = 0;

        window.scrollTo(0, 0);
      }, delay);
    });
  }

  /* ============================================================
     REMOVE PROGRESS DECORATIVE PURPLE ICON
     ============================================================ */

  function removeProgressHeadingIcon() {
    if (!isMana28()) return;
    if (activeTab() !== "progress") return;

    const content = $(CONTENT_ID);
    const head = content?.querySelector(".mana-v981-head");

    if (!head) return;

    // Only hide decorative artwork associated with the
    // main heading. Never remove the tracking cards.

    const candidates = head.querySelectorAll(
      ".mana-v981-icon, " +
      ".mana-v981-heading-icon, " +
      ".mana-v981-head-icon"
    );

    candidates.forEach(icon => {
      icon.style.setProperty(
        "display",
        "none",
        "important"
      );
    });
  }

  /* ============================================================
     APPLY
     ============================================================ */

  function apply() {
    const root = shell();
    if (!root) return;

    const active = isMana28();

    root.classList.toggle(ACTIVE_CLASS, active);

    if (!active) {
      lastTab = "";
      return;
    }

    updateNavigationIcons();
    restoreFuelHeader();
    removeProgressHeadingIcon();
    handleTabPosition();
  }

  /* ============================================================
     STABLE UPDATE SCHEDULER
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

    const root = shell();

    if (root && window.MutationObserver) {
      const observer = new MutationObserver(schedule);

      observer.observe(root, {
        childList: true,
        subtree: true
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
      "[Mana Movement] Mana28 screen corrections ready — " +
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
