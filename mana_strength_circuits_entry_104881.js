
/* =====================================================
   MANA MOVEMENT TRAINING
   CIRCUITS — FINAL NAVIGATION VISUAL TIDY
   BUILD 104885

   COMPLETE REPLACEMENT:
   mana_strength_circuits_entry_104881.js

   - Five equal Strength navigation tabs
   - Correct icon and label alignment
   - No grey icon blocks
   - Circuits immediately after Workouts
   - Orange timer border
   - Hide extra Profile header button
   - Keep runner and Home button
   - Keep Learning accessible from Overview
   - Protect Circuits from old Learning renderer
   - No database or workout changes
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104885";

  if (window.MANA_CIRCUITS_TIDY_104885) return;
  window.MANA_CIRCUITS_TIDY_104885 = true;

  const SHELL = "manaV83ProgramShell";
  const TABS = "manaV83Tabs";
  const CONTENT = "manaV83Content";

  const SCOPE = "mana-strength-tidy-104885";
  const STYLE = "manaStrengthTidyStyle104885";
  const GUARD = "manaStrengthLearningGuard104885";

  const $ = id => document.getElementById(id);

  let learningRequested = false;
  let savedCircuit = null;
  let queued = false;

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
     ICONS

     All five are vector icons with
     matching dimensions and line widths.
     ===================================== */

  function iconURL(paths) {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" ' +
      'viewBox="0 0 24 24" fill="none" ' +
      'stroke="#C1C6CE" stroke-width="2" ' +
      'stroke-linecap="round" ' +
      'stroke-linejoin="round">' +
      paths +
      '</svg>';

    return 'url("data:image/svg+xml,' +
      encodeURIComponent(svg) +
      '")';
  }

  const icons = {
    overview: iconURL(
      '<rect x="3" y="3" width="7" height="7" rx="1"/>' +
      '<rect x="14" y="3" width="7" height="7" rx="1"/>' +
      '<rect x="3" y="14" width="7" height="7" rx="1"/>' +
      '<rect x="14" y="14" width="7" height="7" rx="1"/>'
    ),

    program: iconURL(
      '<path d="M3 9v6M6 7v10M18 7v10M21 9v6"/>' +
      '<path d="M6 12h12"/>'
    ),

    learn: iconURL(
      '<circle cx="12" cy="13" r="8"/>' +
      '<path d="M12 9v4l3 2M9 2h6M12 2v3"/>'
    ),

    fuel: iconURL(
      '<path d="M4 3v8M7 3v8M10 3v8"/>' +
      '<path d="M7 11v10M17 3v18"/>' +
      '<path d="M17 3c-4 3-4 9 0 10"/>'
    ),

    progress: iconURL(
      '<path d="M4 20V13M10 20V9M16 20V5M22 20V2"/>' +
      '<path d="M3 10l7-4 5 2 6-6"/>'
    )
  };

  /* =====================================
     STYLES
     ===================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    const prefix = `#${SHELL}.${SCOPE}`;

    style.textContent = `

      /* =================================
         EXISTING HEADER
         ================================= */

      ${prefix} .mana-v83-head {
        background: #000000 !important;
        background-image: none !important;
      }

      ${prefix} .mana-v83-mark {
        font-size: 0 !important;
        color: transparent !important;

        background-color: #000000 !important;
        background-image:
          url("ui/mana-runner-logo.png") !important;

        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: contain !important;

        border: none !important;
        outline: none !important;
        box-shadow: none !important;
      }

      ${prefix} .mana-v83-kicker {
        color: #FF7927 !important;
      }

      ${prefix} #manaV83Title {
        color: #FFFFFF !important;
      }

      ${prefix} .mana-v83-sub {
        color: #C1C6CE !important;
      }

      /* Remove the extra PROFILE button
         from the program header only.

         Keep the working Home button. */

      ${prefix} .mana-v83-head
      button:not(#manaV83Back) {
        display: none !important;
      }

      ${prefix} .mana-v83-head
      a:not(#manaV83Back) {
        display: none !important;
      }

      ${prefix} #manaV83Back {
        display: inline-flex !important;
        color: #FFFFFF !important;

        background: #15171A !important;
        border: 1px solid #626973 !important;
      }

      /* =================================
         FIVE EQUAL TABS
         ================================= */

      ${prefix} #${TABS} {
        display: grid !important;

        grid-template-columns:
          repeat(5, minmax(0,1fr)) !important;

        align-items: stretch !important;
        gap: 5px !important;

        padding:
          7px 6px
          calc(7px + env(safe-area-inset-bottom))
          !important;

        background: #050607 !important;
        border-top: 1px solid #414852 !important;
      }

      ${prefix} #${TABS}
      .mana-v83-tab {
        display: flex !important;

        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;

        position: relative !important;

        width: 100% !important;
        min-width: 0 !important;
        min-height: 72px !important;

        padding: 8px 3px !important;
        margin: 0 !important;

        border: 1px solid transparent !important;
        border-radius: 12px !important;

        background-color: transparent !important;
        background-image: none !important;

        color: #C1C6CE !important;

        font-size: 0 !important;
        line-height: normal !important;

        box-shadow: none !important;
        box-sizing: border-box !important;
      }

      /* Hide inconsistent icon artwork
         and labels from older scripts.
         The original button remains
         functional and accessible. */

      ${prefix} #${TABS}
      .mana-v83-tab > * {
        display: none !important;
      }

      /* Override old navigation dot.
         Use it as a matching SVG icon. */

      ${prefix} #${TABS}
      .mana-v83-tab::before {
        content: "" !important;

        display: block !important;

        width: 26px !important;
        height: 26px !important;

        min-width: 26px !important;
        min-height: 26px !important;

        flex: 0 0 26px !important;

        margin: 0 auto 6px !important;
        padding: 0 !important;

        background-color: transparent !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: contain !important;

        border: none !important;
        border-radius: 0 !important;

        filter: none !important;
        box-shadow: none !important;
      }

      /* Matching labels under every icon */

      ${prefix} #${TABS}
      .mana-v83-tab::after {
        display: block !important;

        color: #C1C6CE !important;
        -webkit-text-fill-color:
          #C1C6CE !important;

        font-family: inherit !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        line-height: 1.2 !important;
        text-align: center !important;

        margin: 0 !important;
        padding: 0 !important;

        width: 100% !important;
      }

      /* Order and matching icons */

      ${prefix} #${TABS}
      [data-v83-tab="overview"] {
        order: 1 !important;
      }

      ${prefix} #${TABS}
      [data-v83-tab="overview"]::before {
        background-image: ${icons.overview} !important;
      }

      ${prefix} #${TABS}
      [data-v83-tab="overview"]::after {
        content: "Overview" !important;
      }

      ${prefix} #${TABS}
      [data-v83-tab="program"] {
        order: 2 !important;
      }

      ${prefix} #${TABS}
      [data-v83-tab="program"]::before {
        background-image: ${icons.program} !important;
      }

      ${prefix} #${TABS}
      [data-v83-tab="program"]::after {
        content: "Workouts" !important;
      }

      ${prefix} #${TABS}
      [data-v83-tab="learn"] {
        order: 3 !important;
      }

      ${prefix} #${TABS}
      [data-v83-tab="learn"]::before {
        background-image: ${icons.learn} !important;
      }

      ${prefix} #${TABS}
      [data-v83-tab="learn"]::after {
        content: "Circuits" !important;
      }

      ${prefix} #${TABS}
      [data-v83-tab="fuel"] {
        order: 4 !important;
      }

      ${prefix} #${TABS}
      [data-v83-tab="fuel"]::before {
        background-image: ${icons.fuel} !important;
      }

      ${prefix} #${TABS}
      [data-v83-tab="fuel"]::after {
        content: "Fuel" !important;
      }

      ${prefix} #${TABS}
      [data-v83-tab="progress"] {
        order: 5 !important;
      }

      ${prefix} #${TABS}
      [data-v83-tab="progress"]::before {
        background-image: ${icons.progress} !important;
      }

      ${prefix} #${TABS}
      [data-v83-tab="progress"]::after {
        content: "Progress" !important;
      }

      /* Selected tab */

      ${prefix} #${TABS}
      .mana-v83-tab.active {
        border-color: #FF7927 !important;
        background: #2B190F !important;
      }

      ${prefix} #${TABS}
      .mana-v83-tab.active::before {
        filter:
          brightness(0)
          saturate(100%)
          invert(55%)
          sepia(94%)
          saturate(1295%)
          hue-rotate(341deg)
          brightness(104%)
          contrast(103%)
          !important;
      }

      ${prefix} #${TABS}
      .mana-v83-tab.active::after {
        color: #FF7927 !important;
        -webkit-text-fill-color:
          #FF7927 !important;
      }

      /* =================================
         TIMER BORDER — ORANGE
         ================================= */

      ${prefix} #${CONTENT}
      .msc-timer {
        border: 1px solid #FF7927 !important;

        background: #0C0E11 !important;
        box-shadow: none !important;
      }

      ${prefix} #${CONTENT}
      .msc-clock {
        color: #FFFFFF !important;
      }

      ${prefix} #${CONTENT}
      .msc-step,
      ${prefix} #${CONTENT}
      .msc-label {
        color: #FF7927 !important;
      }

      /* Circuits choice panels */

      ${prefix} #${CONTENT}
      .msc-panel {
        border-color: #535C68 !important;
      }

      /* Learning banner on Overview */

      ${prefix} #${CONTENT}
      .msc-overview-learn {
        border: 1px solid #FF7927 !important;
        background: #15171A !important;
        color: #FFFFFF !important;
      }

      /* Remove old duplicate circuit card */

      #manaCircuitsEntry104881 {
        display: none !important;
      }

      @media(max-width:600px) {
        ${prefix} #${TABS}
        .mana-v83-tab {
          min-height: 68px !important;
          padding: 7px 2px !important;
        }

        ${prefix} #${TABS}
        .mana-v83-tab::before {
          width: 23px !important;
          height: 23px !important;
          min-width: 23px !important;
          min-height: 23px !important;
          flex-basis: 23px !important;
        }

        ${prefix} #${TABS}
        .mana-v83-tab::after {
          font-size: 10px !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================
     OLD LEARNING RENDERER GUARD

     Preserve the existing workaround
     that keeps Learning from replacing
     Circuits unexpectedly.
     ===================================== */

  function ensureGuard() {
    if ($(GUARD)) return;

    const marker = document.createElement("div");

    marker.id = GUARD;
    marker.className = "mana-v9120-root";
    marker.hidden = true;

    marker.setAttribute("aria-hidden", "true");
    marker.style.display = "none";

    document.body.appendChild(marker);
  }

  function clearGuard() {
    $(GUARD)?.remove();
  }

  function protectCircuits() {
    if (!circuitSelected()) {
      savedCircuit = null;
      return;
    }

    const holder = $(CONTENT);
    if (!holder) return;

    const existing =
      holder.querySelector(".msc-root");

    if (existing) {
      savedCircuit = existing;

      const kicker = existing.querySelector(
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
     STRENGTH SCOPE
     ===================================== */

  function synchronise() {
    queued = false;

    const shell = $(SHELL);
    if (!shell) return;

    const strength = strengthOpen();

    shell.classList.toggle(SCOPE, strength);

    $( "manaCircuitsEntry104881" )?.remove();

    if (!strength) {
      learningRequested = false;
      savedCircuit = null;
      clearGuard();
      return;
    }

    if (circuitSelected()) {
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
    if (queued) return;

    queued = true;
    requestAnimationFrame(synchronise);
  }

  /* =====================================
     KEEP LEARNING ACCESSIBLE
     ===================================== */

  function handleNavigation(event) {
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
      return;
    }

    if (
      target.closest(
        '#manaV83Tabs [data-v83-tab="learn"]'
      )
    ) {
      learningRequested = false;
      ensureGuard();
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
    }
  }

  function init() {
    installStyles();

    document.addEventListener(
      "click",
      handleNavigation,
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

    synchronise();

    console.log(
      "[Mana Movement] Circuits tidy " + BUILD
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
