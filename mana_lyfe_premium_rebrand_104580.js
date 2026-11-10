
/* ============================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — PREMIUM REBRAND
   BUILD 104580

   COMPLETE JAVASCRIPT FILE

   DESIGN:
   - Approved Mana Movement runner
   - MANA white / LYFE orange
   - Black, orange, white and silver
   - Clean Overview cards
   - White premium illustrations
   - Orange navigation highlights
   - Orange Progress indicators
   - Consistent headings and borders
   - Orange whakatauki styling

   PRESERVES:
   - Lyfe workout sessions
   - Routine checklist
   - Reset breathing tool
   - Reclaim and reflection
   - Support chat
   - Learning
   - Progress and saved records
   - Mana Strength and Mana28

   VISUAL-ONLY UPDATE
   NO LOCAL STORAGE WRITES

   LOAD AFTER BUILD 104570
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104580";

  const SHELL = "manaV83ProgramShell";
  const TITLE = "manaV83Title";
  const CONTENT = "manaV83Content";
  const TABS = "manaV83Tabs";

  const STYLE_ID = "manaLyfePremium104580Style";
  const CLASS = "mana-lyfe-premium-104580";

  const ORANGE = "#FF7927";
  const WHITE = "#FFFFFF";
  const SILVER = "#C1C6CE";
  const BORDER = "#656D77";
  const SURFACE = "#15171A";
  const BLACK = "#08090B";

  const RUNNER = "ui/mana-runner-logo.png";

  if (window.MANA_LYFE_PREMIUM_BUILD === BUILD) {
    return;
  }

  window.MANA_LYFE_PREMIUM_BUILD = BUILD;

  const $ = id => document.getElementById(id);

  function shell() {
    return $(SHELL);
  }

  function lyfeOpen() {
    const root = shell();
    const title = $(TITLE);

    if (!root || !title) return false;

    if (!root.classList.contains("open")) {
      return false;
    }

    const name = String(title.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();

    return (
      name === "MANA LYFE" ||
      name === "MANA LIFE"
    );
  }

  /* ============================================================
     SCOPED MANA LYFE STYLING
     ============================================================ */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* ======================================
         BASE COLOUR SYSTEM
         ====================================== */

      html body #${SHELL}.${CLASS} {
        --lyfe-orange: ${ORANGE};
        --lyfe-white: ${WHITE};
        --lyfe-silver: ${SILVER};
        --lyfe-border: ${BORDER};
        --lyfe-surface: ${SURFACE};
      }

      html body #${SHELL}.${CLASS}
      .mana-v83-shell {
        background: ${BLACK} !important;
        color: ${WHITE} !important;
      }

      /* ======================================
         APPROVED RUNNER HEADER
         ====================================== */

      html body #${SHELL}.${CLASS}
      .mana-v83-head {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        margin-bottom: 23px !important;
      }

      html body #${SHELL}.${CLASS}
      .mana-v83-brand-wrap {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        gap: 12px !important;
      }

      html body #${SHELL}.${CLASS}
      .mana-v83-mark {
        display: grid !important;
        place-items: center !important;

        width: 67px !important;
        height: 52px !important;
        flex: 0 0 67px !important;

        padding: 0 !important;
        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
        overflow: hidden !important;
      }

      html body #${SHELL}.${CLASS}
      .mana-lyfe-runner-104580 {
        width: 100% !important;
        height: 100% !important;
        display: block !important;
        object-fit: contain !important;
        filter: none !important;
      }

      html body #${SHELL}.${CLASS}
      .mana-v83-kicker {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
        font-weight: 900 !important;
        letter-spacing: .13em !important;
      }

      html body #${SHELL}.${CLASS}
      #${TITLE} {
        display: flex !important;
        align-items: baseline !important;
        flex-wrap: nowrap !important;
        gap: 0 !important;

        font-size: clamp(23px, 4.5vw, 30px) !important;
        font-weight: 900 !important;
        letter-spacing: -.025em !important;
        line-height: 1.13 !important;
        white-space: nowrap !important;
      }

      html body #${SHELL}.${CLASS}
      .mana-lyfe-title-mana-104580 {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      html body #${SHELL}.${CLASS}
      .mana-lyfe-title-lyfe-104580 {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      html body #${SHELL}.${CLASS}
      .mana-v83-sub {
        color: ${SILVER} !important;
        -webkit-text-fill-color: ${SILVER} !important;
        font-size: 12px !important;
      }

      html body #${SHELL}.${CLASS}
      #manaV83Back {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
        background: #141619 !important;
        border: 1px solid ${BORDER} !important;
        border-radius: 13px !important;
      }

      /* ======================================
         OVERVIEW
         ====================================== */

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v978-intro {
        margin-bottom: 23px !important;
        padding-bottom: 17px !important;
        border-bottom: 1px solid ${BORDER} !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v978-intro::after {
        background: ${ORANGE} !important;
        background-image: none !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v978-kicker {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v978-intro h2 {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
        font-size: clamp(25px, 5vw, 33px) !important;
        font-weight: 900 !important;
        line-height: 1.14 !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v978-intro p {
        color: ${SILVER} !important;
        -webkit-text-fill-color: ${SILVER} !important;
        font-size: 13px !important;
        line-height: 1.5 !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v978-grid {
        display: grid !important;
        grid-template-columns:
          repeat(2, minmax(0,1fr)) !important;
        gap: 12px !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v978-launchpad
      .mana-v978-launch {
        min-width: 0 !important;
        padding: 15px 13px !important;

        background: ${SURFACE} !important;
        background-image: none !important;

        border: 1px solid ${BORDER} !important;
        border-radius: 17px !important;

        box-shadow: none !important;
        color: ${WHITE} !important;
        text-align: left !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v978-launch::before {
        background: ${ORANGE} !important;
        background-image: none !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT}
      .mana-v978-icon {
        display: grid !important;
        place-items: center !important;

        width: 44px !important;
        height: 44px !important;
        border: 1px solid ${WHITE} !important;
        border-radius: 12px !important;

        background: #0B0D10 !important;
        background-image: none !important;

        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;

        box-shadow: none !important;
        overflow: hidden !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v978-icon img {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
        filter: grayscale(1) brightness(1.8) !important;
        opacity: 1 !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v978-label {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
        font-size: 10px !important;
        font-weight: 850 !important;
        letter-spacing: .08em !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v978-title {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
        font-size: clamp(16px, 3.5vw, 21px) !important;
        font-weight: 850 !important;
        line-height: 1.2 !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v978-text {
        color: ${SILVER} !important;
        -webkit-text-fill-color: ${SILVER} !important;
        line-height: 1.45 !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v978-arrow {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
        font-weight: 850 !important;
      }

      /* ======================================
         SHARED CONTENT HEADINGS
         ====================================== */

      html body #${SHELL}.${CLASS}
      #${CONTENT} h1,
      html body #${SHELL}.${CLASS}
      #${CONTENT} h2,
      html body #${SHELL}.${CLASS}
      #${CONTENT} h3 {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-kicker,
      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-small-label {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      /* ======================================
         RECLAIM / ROUTINE / LEARNING
         ====================================== */

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-panel,
      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-accordion,
      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v83-card {
        background: ${SURFACE} !important;
        background-image: none !important;
        border-color: ${BORDER} !important;
        box-shadow: none !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-accordion > button {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-action,
      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v83-primary {
        background: ${ORANGE} !important;
        background-image: none !important;
        color: ${BLACK} !important;
        -webkit-text-fill-color: ${BLACK} !important;
        box-shadow: none !important;
      }

      /* ======================================
         LYFE PROGRESS
         ====================================== */

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-periods {
        border-color: ${BORDER} !important;
        background: ${BLACK} !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-period {
        background: transparent !important;
        color: ${SILVER} !important;
        -webkit-text-fill-color: ${SILVER} !important;
        border-color: transparent !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-period.active {
        background: #20160F !important;
        border: 1px solid ${ORANGE} !important;
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-progress-card {
        background: ${SURFACE} !important;
        background-image: none !important;
        border: 1px solid ${BORDER} !important;
        box-shadow: none !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-icon {
        background: #101216 !important;
        border: 1px solid ${WHITE} !important;
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-card-label {
        color: ${SILVER} !important;
        -webkit-text-fill-color: ${SILVER} !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-percent {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-track {
        background: #353A40 !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-track span {
        background: ${ORANGE} !important;
        background-image: none !important;
      }

      /* ======================================
         WHAKATAUKI — MANA ORANGE
         ====================================== */

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-whakatauki,
      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v985-footer {
        border-left-color: ${ORANGE} !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v984-whakatauki strong,
      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v985-footer strong {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      /* ======================================
         BOTTOM NAVIGATION
         ====================================== */

      html body #${SHELL}.${CLASS}
      #${TABS} {
        background: #08090B !important;
        border-top: 1px solid #464D55 !important;
      }

      html body #${SHELL}.${CLASS}
      #${TABS} .mana-v83-tab {
        background: transparent !important;
        background-image: none !important;
        border: 1px solid transparent !important;

        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
        box-shadow: none !important;
      }

      html body #${SHELL}.${CLASS}
      #${TABS} .mana-v83-tab.active {
        background: #20160F !important;
        border: 1px solid ${ORANGE} !important;

        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      html body #${SHELL}.${CLASS}
      #${TABS} .mana-v83-tab::before {
        background: #69727D !important;
      }

      html body #${SHELL}.${CLASS}
      #${TABS} .mana-v83-tab.active::before {
        background: ${ORANGE} !important;
      }

      /* Existing navigation images remain in place.
         Do not invert their black backgrounds. */

      html body #${SHELL}.${CLASS}
      #${TABS} .mana-v83-tab img {
        filter: grayscale(1) brightness(1.8) !important;
        opacity: 1 !important;
      }

      /* ======================================
         MOBILE
         ====================================== */

      @media(max-width:600px) {

        html body #${SHELL}.${CLASS}
        .mana-v83-mark {
          width: 53px !important;
          height: 45px !important;
          flex-basis: 53px !important;
        }

        html body #${SHELL}.${CLASS}
        #${TITLE} {
          font-size: 23px !important;
        }

        html body #${SHELL}.${CLASS}
        #${CONTENT} .mana-v978-grid {
          gap: 9px !important;
        }

        html body #${SHELL}.${CLASS}
        #${CONTENT} .mana-v978-launchpad
        .mana-v978-launch {
          padding: 12px 10px !important;
        }

      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     RUNNER LOGO
     ============================================================ */

  function updateRunner(active) {
    const mark = shell()?.querySelector(
      ".mana-v83-mark"
    );

    if (!mark) return;

    if (active) {
      if (mark.dataset.lyfeRunner104580 === "yes") {
        return;
      }

      if (
        !mark.hasAttribute(
          "data-lyfe-original-104580"
        )
      ) {
        mark.setAttribute(
          "data-lyfe-original-104580",
          mark.innerHTML
        );
      }

      const image = document.createElement("img");

      image.className = "mana-lyfe-runner-104580";
      image.src = RUNNER;
      image.alt = "";
      image.setAttribute("aria-hidden", "true");

      mark.replaceChildren(image);

      mark.dataset.lyfeRunner104580 = "yes";
      return;
    }

    if (mark.dataset.lyfeRunner104580 === "yes") {
      const original = mark.getAttribute(
        "data-lyfe-original-104580"
      );

      if (original !== null) {
        mark.innerHTML = original;
      }

      mark.dataset.lyfeRunner104580 = "no";
    }
  }

  /* ============================================================
     HEADER COLOUR
     Keep exact underlying title text for legacy routing.
     ============================================================ */

  function updateTitle() {
    const title = $(TITLE);
    if (!title) return;

    const current = String(
      title.textContent || ""
    ).replace(/\s+/g, " ").trim().toUpperCase();

    if (
      current !== "MANA LYFE" &&
      current !== "MANA LIFE"
    ) {
      return;
    }

    const word = current.endsWith("LIFE")
      ? "LIFE"
      : "LYFE";

    const manaSpan = title.querySelector(
      ".mana-lyfe-title-mana-104580"
    );

    const wordSpan = title.querySelector(
      ".mana-lyfe-title-lyfe-104580"
    );

    if (
      manaSpan &&
      wordSpan &&
      title.textContent === current
    ) {
      return;
    }

    const first = document.createElement("span");
    const second = document.createElement("span");

    first.className =
      "mana-lyfe-title-mana-104580";

    second.className =
      "mana-lyfe-title-lyfe-104580";

    first.textContent = "MANA ";
    second.textContent = word;

    title.replaceChildren(first, second);
  }

  /* ============================================================
     APPLY ONLY TO MANA LYFE
     ============================================================ */

  function apply() {
    const root = shell();
    if (!root) return;

    const active = lyfeOpen();

    root.classList.toggle(CLASS, active);

    updateRunner(active);

    if (!active) return;

    updateTitle();
  }

  /* ============================================================
     CONTROLLED UPDATE
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
        if (!(event.target instanceof Element)) {
          return;
        }

        if (
          event.target.closest(
            "#manaV83Tabs, #manaV83ProgramShell"
          )
        ) {
          schedule();
        }
      },
      true
    );

    [
      "mana:program-tab-change",
      "pageshow"
    ].forEach(name => {
      window.addEventListener(name, schedule);
    });

    console.log(
      "[Mana Movement] ManaLyfe premium rebrand ready — " +
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
