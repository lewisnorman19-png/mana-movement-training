
/* =========================================================
   MANA MOVEMENT TRAINING
   CIRCUITS — CONSISTENT NAVIGATION
   BUILD 104886

   COMPLETE REPLACEMENT FILE:
   mana_strength_circuits_entry_104881.js

   FIXES
   - Matching tabs across ALL Mana Strength screens
   - No grey square icons
   - Circuits immediately after Workouts
   - White headings, orange highlights
   - No Learning banner inside Circuits
   - Learning banner retained on Overview
   - Orange timer border
   - No extra Profile header button
   - Preserves existing Circuits functionality

   No database or workout-history changes.
   ========================================================= */

(() => {
  "use strict";

  const BUILD = "104886";

  if (window.MANA_CIRCUITS_NAV_104886) return;
  window.MANA_CIRCUITS_NAV_104886 = true;

  const SHELL = "manaV83ProgramShell";
  const TABS = "manaV83Tabs";
  const CONTENT = "manaV83Content";

  const SCOPE = "mana-strength-nav-104886";
  const CIRCUIT = "mana-strength-circuit-open-104886";

  const STYLE = "manaStrengthNavStyle104886";
  const GUARD = "manaStrengthLearningGuard104886";

  const $ = id => document.getElementById(id);

  let learningRequested = false;
  let savedCircuit = null;
  let scheduled = false;

  function strengthOpen() {
    return Boolean(
      $(SHELL)?.classList.contains("open") &&
      /strength/i.test(
        $("manaV83Title")?.textContent || ""
      )
    );
  }

  function learnSelected() {
    return Boolean(
      strengthOpen() &&
      $(TABS)?.querySelector(
        '[data-v83-tab="learn"].active'
      )
    );
  }

  function circuitSelected() {
    return learnSelected() && !learningRequested;
  }

  /* =====================================
     MATCHING NAVIGATION ICONS

     SVG masks use a single foreground
     colour. This avoids the grey image
     backgrounds from older nav scripts.
     ===================================== */

  function svgMask(paths) {
    const source =
      '<svg xmlns="http://www.w3.org/2000/svg" ' +
      'width="24" height="24" viewBox="0 0 24 24" ' +
      'fill="none" stroke="black" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
      paths +
      '</svg>';

    return 'url("data:image/svg+xml,' +
      encodeURIComponent(source) +
      '")';
  }

  const icons = {
    overview: svgMask(
      '<rect x="3" y="3" width="7" height="7" rx="1"/>' +
      '<rect x="14" y="3" width="7" height="7" rx="1"/>' +
      '<rect x="3" y="14" width="7" height="7" rx="1"/>' +
      '<rect x="14" y="14" width="7" height="7" rx="1"/>'
    ),

    program: svgMask(
      '<path d="M3 9v6M6 7v10M18 7v10M21 9v6"/>' +
      '<path d="M6 12h12"/>'
    ),

    learn: svgMask(
      '<circle cx="12" cy="13" r="8"/>' +
      '<path d="M12 9v4l3 2"/>' +
      '<path d="M9 2h6M12 2v3"/>'
    ),

    fuel: svgMask(
      '<path d="M4 3v8M7 3v8M10 3v8"/>' +
      '<path d="M7 11v10M17 3v18"/>' +
      '<path d="M17 3c-4 3-4 9 0 10"/>'
    ),

    progress: svgMask(
      '<path d="M4 20v-7M10 20V9M16 20V5M21 20V3"/>' +
      '<path d="M3 11l7-5 5 2 6-6"/>'
    )
  };

  /* =====================================
     INSTALL CSS
     ===================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    const root =
      `#${SHELL}.${SCOPE}`;

    const nav =
      `${root} #${TABS}`;

    style.textContent = `

      /* ==================================
         MANA STRENGTH HEADER
         ================================== */

      ${root} .mana-v83-head {
        background: #000000 !important;
        background-image: none !important;
      }

      ${root} .mana-v83-mark {
        font-size: 0 !important;
        color: transparent !important;

        background: #000000
          url("ui/mana-runner-logo.png")
          center / contain no-repeat !important;

        border: 0 !important;
        box-shadow: none !important;
      }

      ${root} .mana-v83-kicker {
        color: #FF7927 !important;
      }

      ${root} #manaV83Title {
        color: #FFFFFF !important;
      }

      ${root} .mana-v83-sub {
        color: #C1C6CE !important;
      }

      /* Hide extra Profile in program
         header, retain Home. */

      ${root} .mana-v83-head
      button:not(#manaV83Back),
      ${root} .mana-v83-head
      a:not(#manaV83Back) {
        display: none !important;
      }

      ${root} #manaV83Back {
        display: inline-flex !important;
        color: #FFFFFF !important;
        background: #15171A !important;
        border: 1px solid #626973 !important;
      }

      /* ==================================
         SAME NAV ON EVERY STRENGTH SCREEN
         ================================== */

      ${nav} {
        display: grid !important;
        grid-template-columns:
          repeat(5,minmax(0,1fr)) !important;

        gap: 5px !important;
        align-items: stretch !important;

        padding:
          7px 6px
          calc(7px + env(safe-area-inset-bottom))
          !important;

        background: #050607 !important;
        border-top: 1px solid #414852 !important;
      }

      ${nav} button.mana-v83-tab {
        position: relative !important;

        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;

        width: 100% !important;
        min-width: 0 !important;
        min-height: 72px !important;

        padding: 8px 3px !important;
        margin: 0 !important;

        border: 1px solid transparent !important;
        border-radius: 12px !important;

        background: transparent !important;

        color: #C1C6CE !important;
        -webkit-text-fill-color:
          #C1C6CE !important;

        font-family: inherit !important;
        font-size: 0 !important;
        text-align: center !important;

        box-shadow: none !important;
        box-sizing: border-box !important;
      }

      /* Hide inconsistent original artwork
         but retain original buttons and
         their click handlers. */

      ${nav} button.mana-v83-tab > * {
        display: none !important;
      }

      /* Each icon gets the same
         dimensions and visual treatment.

         Background is the actual icon
         colour, with a vector mask
         defining the visible shape. */

      ${nav} button.mana-v83-tab::before {
        content: "" !important;

        display: block !important;

        width: 25px !important;
        height: 25px !important;
        min-width: 25px !important;
        min-height: 25px !important;

        flex: 0 0 25px !important;

        margin: 0 auto 6px !important;
        padding: 0 !important;

        background: #C1C6CE !important;
        background-image: none !important;

        border: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;

        -webkit-mask-repeat: no-repeat !important;
        mask-repeat: no-repeat !important;

        -webkit-mask-position: center !important;
        mask-position: center !important;

        -webkit-mask-size: contain !important;
        mask-size: contain !important;

        filter: none !important;
      }

      /* All labels sit at the same height. */

      ${nav} button.mana-v83-tab::after {
        display: block !important;

        width: 100% !important;

        margin: 0 !important;
        padding: 0 !important;

        background: transparent !important;

        color: #C1C6CE !important;
        -webkit-text-fill-color:
          #C1C6CE !important;

        font-family: inherit !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        line-height: 1.2 !important;
        text-align: center !important;
      }

      /* ==================================
         TAB ORDER AND ICONS
         ================================== */

      ${nav} [data-v83-tab="overview"] {
        order: 1 !important;
      }

      ${nav}
      [data-v83-tab="overview"]::before {
        -webkit-mask-image:
          ${icons.overview} !important;
        mask-image:
          ${icons.overview} !important;
      }

      ${nav}
      [data-v83-tab="overview"]::after {
        content: "Overview" !important;
      }

      ${nav} [data-v83-tab="program"] {
        order: 2 !important;
      }

      ${nav}
      [data-v83-tab="program"]::before {
        -webkit-mask-image:
          ${icons.program} !important;
        mask-image:
          ${icons.program} !important;
      }

      ${nav}
      [data-v83-tab="program"]::after {
        content: "Workouts" !important;
      }

      ${nav} [data-v83-tab="learn"] {
        order: 3 !important;
      }

      ${nav}
      [data-v83-tab="learn"]::before {
        -webkit-mask-image:
          ${icons.learn} !important;
        mask-image:
          ${icons.learn} !important;
      }

      ${nav}
      [data-v83-tab="learn"]::after {
        content: "Circuits" !important;
      }

      ${nav} [data-v83-tab="fuel"] {
        order: 4 !important;
      }

      ${nav}
      [data-v83-tab="fuel"]::before {
        -webkit-mask-image:
          ${icons.fuel} !important;
        mask-image:
          ${icons.fuel} !important;
      }

      ${nav}
      [data-v83-tab="fuel"]::after {
        content: "Fuel" !important;
      }

      ${nav} [data-v83-tab="progress"] {
        order: 5 !important;
      }

      ${nav}
      [data-v83-tab="progress"]::before {
        -webkit-mask-image:
          ${icons.progress} !important;
        mask-image:
          ${icons.progress} !important;
      }

      ${nav}
      [data-v83-tab="progress"]::after {
        content: "Progress" !important;
      }

      /* ==================================
         ACTIVE TAB
         ================================== */

      ${nav} button.mana-v83-tab.active {
        background: #29180F !important;
        border-color: #FF7927 !important;

        color: #FF7927 !important;
      }

      ${nav}
      button.mana-v83-tab.active::before {
        background: #FF7927 !important;
      }

      ${nav}
      button.mana-v83-tab.active::after {
        color: #FF7927 !important;
        -webkit-text-fill-color:
          #FF7927 !important;
      }

      /* ==================================
         CIRCUITS — WHITE / ORANGE TEXT
         ================================== */

      ${root} #${CONTENT}
      .msc-root h2,
      ${root} #${CONTENT}
      .msc-root h3 {
        color: #FFFFFF !important;
        -webkit-text-fill-color:
          #FFFFFF !important;
      }

      ${root} #${CONTENT}
      .msc-kicker,
      ${root} #${CONTENT}
      .msc-label,
      ${root} #${CONTENT}
      .msc-step {
        color: #FF7927 !important;
        -webkit-text-fill-color:
          #FF7927 !important;
      }

      ${root} #${CONTENT}
      .msc-choice strong {
        color: #FFFFFF !important;
        -webkit-text-fill-color:
          #FFFFFF !important;
      }

      ${root} #${CONTENT}
      .msc-clock {
        color: #FFFFFF !important;
        -webkit-text-fill-color:
          #FFFFFF !important;
      }

      ${root} #${CONTENT}
      .msc-panel {
        border-color: #535C68 !important;
        background: #15171A !important;
      }

      ${root} #${CONTENT}
      .msc-timer {
        border: 1px solid #FF7927 !important;
        background: #0C0E11 !important;
        box-shadow: none !important;
      }

      /* ==================================
         REMOVE LEARNING FROM CIRCUITS

         Learning must be accessed through
         the Overview banner instead.
         ================================== */

      #${SHELL}.${CIRCUIT}
      #${CONTENT} .msc-learn {
        display: none !important;
      }

      #${SHELL}.${CIRCUIT}
      #${CONTENT} .msc-overview-learn {
        display: none !important;
      }

      /* ==================================
         LEARNING BANNER — OVERVIEW ONLY
         ================================== */

      ${root} #${CONTENT}
      .msc-overview-learn {
        width: 100% !important;
        margin: 16px 0 !important;
        padding: 20px !important;

        background: #15171A !important;
        border: 1px solid #FF7927 !important;
        border-radius: 19px !important;

        color: #FFFFFF !important;
        text-align: left !important;

        box-shadow: none !important;
      }

      ${root} #${CONTENT}
      .msc-overview-learn .msc-kicker {
        color: #FF7927 !important;
      }

      ${root} #${CONTENT}
      .msc-overview-learn strong {
        color: #FFFFFF !important;
        -webkit-text-fill-color:
          #FFFFFF !important;
      }

      /* No duplicate Circuits Overview card */

      #manaCircuitsEntry104881 {
        display: none !important;
      }

      @media(max-width:600px) {
        ${nav} button.mana-v83-tab {
          min-height: 68px !important;
          padding: 7px 2px !important;
        }

        ${nav} button.mana-v83-tab::before {
          width: 23px !important;
          height: 23px !important;
          min-width: 23px !important;
          min-height: 23px !important;
          flex-basis: 23px !important;
        }

        ${nav} button.mana-v83-tab::after {
          font-size: 10px !important;
        }

        ${root} #${CONTENT}
        .msc-overview-learn {
          padding: 15px !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================
     PREVENT OLD LEARNING AUTO-RENDER

     The original Learning module looks
     for a .mana-v9120-root element.

     Keep a hidden compatibility marker
     when Circuits is active.
     ===================================== */

  function ensureGuard() {
    if ($(GUARD)) return;

    const guard = document.createElement("div");

    guard.id = GUARD;
    guard.className = "mana-v9120-root";

    guard.hidden = true;
    guard.style.display = "none";

    guard.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.appendChild(guard);
  }

  function clearGuard() {
    $(GUARD)?.remove();
  }

  /* =====================================
     RETAIN CIRCUIT CONTENT

     Only restore if an older module
     replaces the active circuit screen.
     ===================================== */

  function protectCircuits() {
    if (!circuitSelected()) {
      savedCircuit = null;
      return;
    }

    const holder = $(CONTENT);

    if (!holder) return;

    const current =
      holder.querySelector(".msc-root");

    if (current) {
      savedCircuit = current;

      const kicker = current.querySelector(
        ".msc-kicker"
      );

      if (
        kicker &&
        /PREMIUM CIRCUITS/i.test(
          kicker.textContent || ""
        )
      ) {
        kicker.textContent =
          "MANA STRENGTH · INCLUDED WITH MEMBERSHIP";
      }

      return;
    }

    if (
      savedCircuit &&
      !holder.contains(savedCircuit)
    ) {
      holder.replaceChildren(savedCircuit);
    }
  }

  /* =====================================
     SYNCHRONISE PROGRAM STATE
     ===================================== */

  function sync() {
    scheduled = false;

    const shell = $(SHELL);

    if (!shell) return;

    const strength = strengthOpen();
    const circuits = strength && circuitSelected();

    shell.classList.toggle(
      SCOPE,
      strength
    );

    shell.classList.toggle(
      CIRCUIT,
      circuits
    );

    $("manaCircuitsEntry104881")?.remove();

    if (!strength) {
      learningRequested = false;
      savedCircuit = null;
      clearGuard();
      return;
    }

    if (circuits) {
      ensureGuard();
      protectCircuits();
    } else {
      clearGuard();

      if (!learnSelected()) {
        learningRequested = false;
        savedCircuit = null;
      }
    }
  }

  function schedule() {
    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(sync);
  }

  /* =====================================
     CIRCUITS VS LEARNING
     ===================================== */

  function handleClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) return;
    if (!strengthOpen()) return;

    if (
      target.closest(
        '[data-msc-action="learning"]'
      )
    ) {
      learningRequested = true;
      savedCircuit = null;
      clearGuard();
      schedule();
      return;
    }

    if (
      target.closest(
        '#manaV83Tabs [data-v83-tab="learn"]'
      )
    ) {
      learningRequested = false;
      ensureGuard();
      schedule();
      return;
    }

    if (
      target.closest(
        '#manaV83Tabs [data-v83-tab]'
      )
    ) {
      learningRequested = false;
      savedCircuit = null;
      clearGuard();
      schedule();
    }
  }

  /* =====================================
     INITIALISE

     Observe only existing program-shell
     state and content changes.

     No page-wide DOM observer.
     ===================================== */

  function init() {
    installStyles();

    document.addEventListener(
      "click",
      handleClick,
      true
    );

    const shell = $(SHELL);

    if (shell) {
      new MutationObserver(schedule).observe(
        shell,
        {
          attributes: true,
          attributeFilter: ["class"]
        }
      );
    }

    const title = $("manaV83Title");

    if (title) {
      new MutationObserver(schedule).observe(
        title,
        {
          childList: true,
          characterData: true,
          subtree: true
        }
      );
    }

    const holder = $(CONTENT);

    if (holder) {
      new MutationObserver(() => {
        if (!circuitSelected()) return;

        ensureGuard();
        protectCircuits();
      }).observe(holder, {
        childList: true
      });
    }

    window.addEventListener(
      "mana:program-tab-change",
      schedule
    );

    window.addEventListener(
      "pageshow",
      schedule
    );

    sync();

    console.log(
      "[Mana Strength] Navigation fix " +
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
