
/* ============================================================
   MANA MOVEMENT TRAINING
   MANA28 COMPLETE COLOUR FINISH
   BUILD 104460

   COMPLETE JAVASCRIPT FILE

   FEATURES:
   - Workouts: orange, white and silver
   - Overview: white illustration borders
   - Fuel: consistent Mana28 presentation
   - Progress: orange progress indicators
   - Learning: orange and silver styling
   - Bottom navigation: white illustrated icons
   - Active navigation: Mana orange
   - Preserve the approved Mana Movement runner

   PRESERVES:
   - All 28 scheduled workout days
   - Existing completion records
   - Fuel meals and daily targets
   - Calories, protein and water
   - Recovery history
   - Progress calculations
   - All existing navigation handlers
   - Mana Strength and ManaLyfe

   LOAD AFTER BUILD 104450
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104460";

  const SHELL = "manaV83ProgramShell";
  const CONTENT = "manaV83Content";
  const TABS = "manaV83Tabs";
  const TITLE = "manaV83Title";

  const STYLE = "mana28ColourFinish104460Style";
  const CLASS = "mana28-colour-finish-104460";

  const ORANGE = "#FF7927";
  const ORANGE_LIGHT = "#FF9854";
  const WHITE = "#FFFFFF";
  const SILVER = "#C1C6CE";
  const BORDER = "#656D77";
  const SURFACE = "#15171A";

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

  if (window.MANA28_COLOUR_FINISH_BUILD === BUILD) {
    return;
  }

  window.MANA28_COLOUR_FINISH_BUILD = BUILD;

  const $ = id => document.getElementById(id);

  function root() {
    return $(SHELL);
  }

  function isMana28() {
    const s = root();
    const title = $(TITLE);

    if (!s || !title) return false;
    if (!s.classList.contains("open")) return false;

    return /^MANA\s*28\b/i.test(
      (title.textContent || "").trim()
    );
  }

  function activeTab() {
    return document.querySelector(
      "#" + TABS + " .mana-v83-tab.active"
    )?.dataset?.v83Tab || "";
  }

  /* ============================================================
     INSTALL COMPLETE MANA28 STYLE SYSTEM
     ============================================================ */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* ======================================
         MANA28 FOUNDATION
         ====================================== */

      #${SHELL}.${CLASS} {
        --m28-orange: ${ORANGE};
        --m28-white: ${WHITE};
        --m28-silver: ${SILVER};
        --m28-border: ${BORDER};
        --m28-surface: ${SURFACE};
      }

      #${SHELL}.${CLASS}
      .mana-v83-shell {
        background: #08090B !important;
        color: ${WHITE} !important;
      }

      /* ======================================
         SHARED HEADINGS
         ====================================== */

      #${SHELL}.${CLASS}
      #${CONTENT} h1,
      #${SHELL}.${CLASS}
      #${CONTENT} h2,
      #${SHELL}.${CLASS}
      #${CONTENT} h3 {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      #${SHELL}.${CLASS}
      .mana-v980-kicker,
      #${SHELL}.${CLASS}
      .mana-v981-kicker,
      #${SHELL}.${CLASS}
      .mana-v985-kicker,
      #${SHELL}.${CLASS}
      .mana-v978-kicker,
      #${SHELL}.${CLASS}
      .m1022-kicker {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      /* ======================================
         OVERVIEW
         ====================================== */

      #${SHELL}.${CLASS}
      #${CONTENT} .mana-v978-launch {
        background: ${SURFACE} !important;
        background-image: none !important;
        border: 1px solid #656D77 !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v978-launch .mana-v978-icon {
        border: 1px solid ${WHITE} !important;
        background: #0B0D10 !important;
        box-shadow: none !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v978-launch .mana-v978-icon img {
        filter: none !important;
        opacity: 1 !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v978-label {
        color: ${SILVER} !important;
        -webkit-text-fill-color: ${SILVER} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v978-title {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v978-arrow {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #manaV1019ProgramBadge {
        color: ${SILVER} !important;
        border-color: ${BORDER} !important;
        background: #111317 !important;
      }

      #${SHELL}.${CLASS}
      .mana-v978-intro::after {
        background: ${ORANGE} !important;
      }

      /* ======================================
         WORKOUTS — WEEK SELECTORS
         ====================================== */

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-intro::after {
        background: ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-weeks {
        border: 1px solid ${BORDER} !important;
        background: #08090B !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-week {
        color: ${SILVER} !important;
        -webkit-text-fill-color: ${SILVER} !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-week.active {
        background: ${ORANGE} !important;
        background-image: none !important;
        color: #08090B !important;
        -webkit-text-fill-color: #08090B !important;
        box-shadow: none !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-week-title {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-week-progress {
        background: #171A1F !important;
        border: 1px solid ${BORDER} !important;
        color: ${ORANGE_LIGHT} !important;
        -webkit-text-fill-color: ${ORANGE_LIGHT} !important;
      }

      /* ======================================
         WORKOUT CARDS
         ====================================== */

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-day {
        background: ${SURFACE} !important;
        background-image: none !important;
        border: 1px solid ${BORDER} !important;
        color: ${WHITE} !important;
        box-shadow: none !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-day::before {
        background: ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-number {
        background: #191C21 !important;
        background-image: none !important;
        border: 1px solid ${BORDER} !important;
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      /* Completed workouts:
         No more green. Orange completion indicator. */

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-day.done {
        background: #19160F !important;
        background-image: none !important;
        border: 1px solid ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-day.done
      .mana-v980-number {
        background: #271A10 !important;
        background-image: none !important;
        border: 1px solid ${ORANGE} !important;
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-category,
      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-workout-category {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-title,
      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-workout-title,
      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-exercise-name {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-time,
      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-focus,
      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-exercise-detail {
        color: ${SILVER} !important;
        -webkit-text-fill-color: ${SILVER} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-arrow,
      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-back-week {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      /* Workout details and notes */

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-workout-head {
        border-bottom-color: ${BORDER} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-duration {
        border-color: ${BORDER} !important;
        background: ${SURFACE} !important;
        color: ${ORANGE_LIGHT} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-note {
        background: ${SURFACE} !important;
        background-image: none !important;
        border-color: ${BORDER} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-note::before {
        background: ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-note-title {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-note-text {
        color: ${SILVER} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v980-complete {
        background: ${ORANGE} !important;
        background-image: none !important;
        color: #08090B !important;
        -webkit-text-fill-color: #08090B !important;
        box-shadow: none !important;
      }

      /* ======================================
         FUEL — PRESERVE EXISTING MECHANICS
         ====================================== */

      #${SHELL}.${CLASS}
      #${CONTENT}
      .m1022-hero {
        border-bottom-color: ${BORDER} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .m1022-hero h2 {
        color: ${WHITE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .m1022-hero p {
        color: ${SILVER} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .m1022-card {
        border-color: ${BORDER} !important;
      }

      /* Keep the original meal illustrations,
         selection ticks and nutrition progress. */

      /* ======================================
         PROGRESS — ORANGE, WHITE, SILVER
         ====================================== */

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-head {
        border-bottom-color: ${BORDER} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-head::after {
        background: ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-kicker {
        color: ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-head p {
        color: ${SILVER} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-periods {
        background: #08090B !important;
        border-color: ${BORDER} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-period {
        background: transparent !important;
        color: ${SILVER} !important;
        -webkit-text-fill-color: ${SILVER} !important;
        border: 1px solid transparent !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-period.active {
        background: #25180F !important;
        background-image: none !important;
        border: 1px solid ${ORANGE} !important;
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-overall,
      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-card {
        background: ${SURFACE} !important;
        background-image: none !important;
        border-color: ${BORDER} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-overall::before {
        background: ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-overall-label {
        color: ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-overall-value,
      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-value {
        color: ${WHITE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-overall-value span {
        color: ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-overall-sub,
      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-sub,
      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-period-detail,
      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-label {
        color: ${SILVER} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-overall-bar span,
      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-bar span {
        background: ${ORANGE} !important;
        background-image: none !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-overall-bar,
      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-bar {
        background: #353A40 !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-icon {
        border-color: ${BORDER} !important;
        background: #1B1E23 !important;
        color: ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-message {
        border-color: ${BORDER} !important;
        background: ${SURFACE} !important;
        color: ${SILVER} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-message::before {
        background: ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v981-message strong {
        color: ${ORANGE} !important;
      }

      /* ======================================
         LEARNING
         ====================================== */

      #${SHELL}.${CLASS}
      #${CONTENT} .mana-v927-learn-item,
      #${SHELL}.${CLASS}
      #${CONTENT} .mana-v985-learn-card,
      #${SHELL}.${CLASS}
      #${CONTENT} .mana-v985-learn-button {
        border: 1px solid ${BORDER} !important;
        background: ${SURFACE} !important;
        background-image: none !important;
        box-shadow: none !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT} .mana-v927-learn-open,
      #${SHELL}.${CLASS}
      #${CONTENT} .mana-v985-kicker,
      #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v985-learn-button > span:last-child {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT} .mana-v927-learn-body {
        color: ${SILVER} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT} .mana-v985-head {
        border-bottom-color: ${BORDER} !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT} .mana-v985-head::after {
        background: ${ORANGE} !important;
      }

      /* ======================================
         BOTTOM NAVIGATION
         MATCH MANA STRENGTH
         ====================================== */

      #${SHELL}.${CLASS}
      #${TABS} {
        background: #08090B !important;
        border-top: 1px solid #464D55 !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} .mana-v83-tab {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
        background: transparent !important;
        border: 1px solid transparent !important;
        box-shadow: none !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} .mana-v83-tab.active {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
        background: #20160F !important;
        border: 1px solid ${ORANGE} !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} .mana-v83-tab::before {
        background: #69727D !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} .mana-v83-tab.active::before {
        background: ${ORANGE} !important;
      }

      /* Important compatibility fix:
         Older build 104430 hides tab images.
         Our approved images use mana28-keep
         to prevent that old rule applying. */

      html body
      #${SHELL}.${CLASS}
      #${TABS}
      button.mana-v83-tab
      .mana28-nav-art img.mana28-keep {
        display: block !important;
        visibility: visible !important;
        width: 100% !important;
        height: 100% !important;
        max-width: none !important;
        max-height: none !important;
        object-fit: contain !important;
        opacity: 1 !important;
        filter:
          grayscale(1)
          brightness(0)
          invert(1) !important;
      }

      html body
      #${SHELL}.${CLASS}
      #${TABS}
      button.mana-v83-tab.active
      .mana28-nav-art img.mana28-keep {
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

      #${SHELL}.${CLASS}
      #${TABS}
      .mana28-nav-art {
        display: grid !important;
        place-items: center !important;
        width: 28px !important;
        height: 28px !important;
        margin: 0 auto !important;
        overflow: visible !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} .mana28-nav-label {
        color: inherit !important;
        -webkit-text-fill-color: inherit !important;
        font-weight: 800 !important;
        font-size: 11px !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} .mana28-nav-overview svg,
      #${SHELL}.${CLASS}
      #${TABS} .mana28-nav-overview svg * {
        stroke: currentColor !important;
        fill: none !important;
      }

      /* ======================================
         MOBILE
         ====================================== */

      @media(max-width:600px) {

        #${SHELL}.${CLASS}
        #${TABS} .mana28-nav-art {
          width: 24px !important;
          height: 24px !important;
        }

        #${SHELL}.${CLASS}
        #${TABS} .mana28-nav-label {
          font-size: 10px !important;
        }

      }

    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     BOTTOM NAVIGATION — RESTORE IMAGES
     ============================================================ */

  function restoreIcons() {
    if (!isMana28()) return;

    const holder = $(TABS);
    if (!holder) return;

    holder.querySelectorAll(
      ".mana-v83-tab[data-v83-tab]"
    ).forEach(button => {

      const key = button.dataset.v83Tab;

      if (!(key in LABELS)) return;

      if (key === "overview") {
        // Preserve the existing working Overview SVG.
        return;
      }

      const file = ICONS[key];

      if (!file) return;

      let art = button.querySelector(
        ".mana28-nav-art"
      );

      if (!art) {
        art = document.createElement("span");
        art.className = "mana28-nav-art";
        art.setAttribute("aria-hidden", "true");

        button.prepend(art);
      }

      let image = art.querySelector("img");

      if (!image) {
        image = document.createElement("img");
        image.alt = "";
        image.setAttribute("aria-hidden", "true");
        art.replaceChildren(image);
      }

      // Make the image immune to the older
      // 104430 rule that hid all other images.
      image.classList.add("mana28-keep");

      if (image.getAttribute("src") !== file) {
        image.setAttribute("src", file);
      }

      button.dataset.mana28Nav104440 = key;
    });
  }

  /* ============================================================
     FUEL HEADER / SCROLL RESTORATION
     ============================================================ */

  function restoreFuelHeading() {
    if (!isMana28()) return;
    if (activeTab() !== "fuel") return;

    const holder = $(CONTENT);
    if (!holder) return;

    const fuel = holder.querySelector(
      "#manaV1015Fuel"
    );

    if (!fuel) return;

    const hero = fuel.querySelector(
      ".m1022-hero"
    );

    if (!hero) return;

    // Fuel already has a MANA 28 • FUEL kicker.
    // Keep it visible and avoid duplicating headers.

    const kicker = hero.querySelector(
      ".m1022-kicker"
    );

    if (
      kicker &&
      kicker.textContent.trim() !== "MANA 28 • FUEL"
    ) {
      kicker.textContent = "MANA 28 • FUEL";
    }
  }

  function resetFuelScroll() {
    if (!isMana28()) return;
    if (activeTab() !== "fuel") return;

    const s = root();

    // Return to the top only when the user
    // explicitly enters Fuel.
    // Do not reset scroll during meal selection.

    if (s) s.scrollTop = 0;

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }

  /* ============================================================
     APPLY VISUAL FINISH
     ============================================================ */

  function apply() {
    const s = root();

    if (!s) return;

    const active = isMana28();

    s.classList.toggle(CLASS, active);

    if (!active) return;

    restoreIcons();
    restoreFuelHeading();
  }

  /* ============================================================
     SCHEDULER
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

    const s = root();

    if (s && window.MutationObserver) {
      const observer = new MutationObserver(
        schedule
      );

      observer.observe(s, {
        childList: true,
        subtree: true
      });
    }

    document.addEventListener(
      "click",
      event => {

        const clickedTab = event.target.closest(
          "#" + TABS +
          " .mana-v83-tab"
        );

        if (clickedTab) {
          const enteringFuel =
            clickedTab.dataset.v83Tab === "fuel" &&
            isMana28();

          schedule();

          if (enteringFuel) {
            setTimeout(resetFuelScroll, 180);
          }

          return;
        }

        if (
          event.target.closest(
            "#manaV80Mana28, #manaV83Back"
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
      "[Mana Movement] Mana28 complete colour finish ready — " +
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
