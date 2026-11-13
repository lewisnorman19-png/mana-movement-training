
/* =========================================================
   MANA MOVEMENT TRAINING
   MANA STRENGTH — CIRCUITS STABILITY & DESIGN
   BUILD 104884

   COMPLETE REPLACEMENT:
   mana_strength_circuits_entry_104881.js

   FIXES:
   - Circuits remains next to Workouts
   - All five bottom tabs aligned consistently
   - All five tabs use orange/white/silver
   - Removes old gold M header styling
   - Restores runner image in Strength header
   - Prevents old Learning auto-render replacing Circuits
   - Preserves Learning through its Overview banner
   - Removes duplicate Circuits Overview card
   - Describes Circuits as included with membership

   PRESERVES:
   - Existing circuits renderer and timer (104880)
   - EMOM, Tabata and Strength Circuit
   - Other program navigation
   - Coach/client switching
   - Supabase data and training history

   No billing or database changes.
   ========================================================= */

(() => {
  "use strict";

  const BUILD = "104884";

  if (window.MANA_CIRCUITS_STABLE_104884) return;
  window.MANA_CIRCUITS_STABLE_104884 = true;

  const SHELL = "manaV83ProgramShell";
  const TABS = "manaV83Tabs";
  const CONTENT = "manaV83Content";

  const CLASS = "mana-strength-circuits-104884";
  const STYLE = "manaStrengthCircuitsStyle104884";
  const GUARD = "manaStrengthLearnGuard104884";
  const OLD_CARD = "manaCircuitsEntry104881";

  const $ = id => document.getElementById(id);

  let learningRequested = false;
  let queued = false;
  let circuitRoot = null;

  /* =====================================
     IDENTIFY MANA STRENGTH
     ===================================== */

  function strengthOpen() {
    return Boolean(
      $(SHELL)?.classList.contains("open") &&
      /strength/i.test(
        $("manaV83Title")?.textContent || ""
      )
    );
  }

  function learnTabSelected() {
    return Boolean(
      strengthOpen() &&
      $(TABS)?.querySelector(
        '[data-v83-tab="learn"].active'
      )
    );
  }

  function circuitScreen() {
    return (
      learnTabSelected() &&
      !learningRequested
    );
  }

  /* =====================================
     STRENGTH-ONLY STYLES
     ===================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* =================================
         REMOVE DUPLICATE OVERVIEW CARD
         ================================= */

      #${OLD_CARD} {
        display: none !important;
      }

      /* =================================
         PREMIUM STRENGTH HEADER
         ================================= */

      #${SHELL}.${CLASS}
      .mana-v83-head {
        background: #000000 !important;
        background-image: none !important;
        border-color: #303640 !important;
      }

      #${SHELL}.${CLASS}
      .mana-v83-mark {
        flex: 0 0 58px !important;
        width: 58px !important;
        height: 54px !important;

        font-size: 0 !important;
        color: transparent !important;

        border: 0 !important;
        outline: 0 !important;
        box-shadow: none !important;

        background-color: #000000 !important;
        background-image:
          url("ui/mana-runner-logo.png") !important;

        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: contain !important;
      }

      #${SHELL}.${CLASS}
      .mana-v83-kicker {
        color: #FF7927 !important;
        -webkit-text-fill-color:
          #FF7927 !important;
      }

      #${SHELL}.${CLASS}
      #manaV83Title {
        color: #FFFFFF !important;
        -webkit-text-fill-color:
          #FFFFFF !important;
      }

      #${SHELL}.${CLASS}
      .mana-v83-sub {
        color: #C1C6CE !important;
        -webkit-text-fill-color:
          #C1C6CE !important;
      }

      #${SHELL}.${CLASS}
      .mana-v83-back {
        background: #15171A !important;
        border: 1px solid #626973 !important;
        color: #FFFFFF !important;
        -webkit-text-fill-color:
          #FFFFFF !important;
      }

      /* =================================
         FIVE EQUAL BOTTOM TABS
         ================================= */

      #${SHELL}.${CLASS}
      #${TABS} {
        display: grid !important;

        grid-template-columns:
          repeat(5,minmax(0,1fr)) !important;

        align-items: stretch !important;
        gap: 5px !important;

        background: #050607 !important;
        border-top: 1px solid #414852 !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} .mana-v83-tab {
        position: relative !important;

        min-width: 0 !important;
        min-height: 70px !important;

        padding: 6px 2px !important;

        border: 1px solid transparent !important;
        border-radius: 12px !important;

        background-color: transparent !important;

        color: #C1C6CE !important;
        -webkit-text-fill-color:
          #C1C6CE !important;

        font-family: inherit !important;
        font-size: 11px !important;
        font-weight: 800 !important;

        text-align: center !important;
        box-sizing: border-box !important;

        align-self: stretch !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} .mana-v83-tab.active {
        background-color: #26170F !important;
        border-color: #FF7927 !important;

        color: #FF7927 !important;
        -webkit-text-fill-color:
          #FF7927 !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} .mana-v83-tab::before {
        background: #59616C !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} .mana-v83-tab.active::before {
        background: #FF7927 !important;
      }

      /* Remove old blue, green, yellow
         and purple icon effects ONLY
         within Mana Strength. */

      #${SHELL}.${CLASS}
      #${TABS} .mana-v83-tab img {
        filter:
          grayscale(1)
          brightness(0)
          invert(1) !important;

        box-shadow: none !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} .mana-v83-tab.active img {
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

      /* =================================
         CORRECT TAB ORDER

         1 Overview
         2 Workouts
         3 Circuits
         4 Fuel
         5 Progress
         ================================= */

      #${SHELL}.${CLASS}
      #${TABS} [data-v83-tab="overview"] {
        order: 1 !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} [data-v83-tab="program"] {
        order: 2 !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} [data-v83-tab="learn"] {
        order: 3 !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} [data-v83-tab="fuel"] {
        order: 4 !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} [data-v83-tab="progress"] {
        order: 5 !important;
      }

      /* =================================
         CIRCUITS TAB

         Use CSS for its visible icon
         and label, so older branding
         scripts cannot change it back.
         ================================= */

      #${SHELL}.${CLASS}
      #${TABS} [data-v83-tab="learn"] {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: flex-end !important;

        background-image:
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='13' r='8' fill='none' stroke='%23C1C6CE' stroke-width='2'/%3E%3Cpath d='M12 8v5l3 2M9 2h6M12 2v3' fill='none' stroke='%23C1C6CE' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")
          !important;

        background-repeat: no-repeat !important;
        background-size: 25px 25px !important;
        background-position:
          center 24px !important;

        font-size: 0 !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} [data-v83-tab="learn"] > * {
        display: none !important;
      }

      #${SHELL}.${CLASS}
      #${TABS} [data-v83-tab="learn"]::after {
        content: "Circuits" !important;

        display: block !important;
        width: 100% !important;

        margin-top: auto !important;
        padding-bottom: 1px !important;

        color: #C1C6CE !important;
        -webkit-text-fill-color:
          #C1C6CE !important;

        font-family: inherit !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        line-height: 1.2 !important;

        text-align: center !important;
      }

      #${SHELL}.${CLASS}
      #${TABS}
      [data-v83-tab="learn"].active {
        background-image:
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='13' r='8' fill='none' stroke='%23FF7927' stroke-width='2'/%3E%3Cpath d='M12 8v5l3 2M9 2h6M12 2v3' fill='none' stroke='%23FF7927' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")
          !important;
      }

      #${SHELL}.${CLASS}
      #${TABS}
      [data-v83-tab="learn"].active::after {
        color: #FF7927 !important;
        -webkit-text-fill-color:
          #FF7927 !important;
      }

      /* =================================
         PREMIUM CIRCUITS CONTENT
         ================================= */

      #${SHELL}.${CLASS}
      #${CONTENT} .msc-root h2,
      #${SHELL}.${CLASS}
      #${CONTENT} .msc-root h3 {
        color: #FFFFFF !important;
        -webkit-text-fill-color:
          #FFFFFF !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT} .msc-panel {
        border-color: #535C68 !important;
        background: #15171A !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT} .msc-kicker,
      #${SHELL}.${CLASS}
      #${CONTENT} .msc-label {
        color: #FF7927 !important;
      }

      /* =================================
         LEARNING OVERVIEW BANNER
         ================================= */

      #${SHELL}.${CLASS}
      #${CONTENT} .msc-overview-learn {
        width: 100% !important;
        padding: 20px !important;
        margin: 16px 0 !important;

        background: #15171A !important;

        border: 1px solid #FF7927 !important;
        border-radius: 19px !important;

        color: #FFFFFF !important;
        text-align: left !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT} .msc-overview-learn strong {
        color: #FFFFFF !important;
        font-size: 20px !important;
      }

      #${SHELL}.${CLASS}
      #${CONTENT} .msc-overview-learn span {
        color: #C1C6CE !important;
      }

      @media(max-width:600px) {
        #${SHELL}.${CLASS}
        #${TABS} .mana-v83-tab {
          min-height: 67px !important;
          font-size: 10px !important;
        }

        #${SHELL}.${CLASS}
        #${TABS}
        [data-v83-tab="learn"]::after {
          font-size: 10px !important;
        }

        #${SHELL}.${CLASS}
        #${CONTENT} .msc-overview-learn {
          padding: 15px !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================
     PROTECT CIRCUITS FROM OLD LEARNING

     The old Learning module has a
     document-wide observer and delayed
     rendering callbacks.

     Keep its compatibility marker while
     Circuits is active.

     Additionally retain the actual
     Circuit DOM if an older renderer
     replaces it unexpectedly.

     No full-page rebuilding or polling.
     ===================================== */

  function ensureGuard() {
    if ($(GUARD)) return;

    const guard = document.createElement("div");

    guard.id = GUARD;
    guard.className = "mana-v9120-root";
    guard.hidden = true;

    guard.setAttribute("aria-hidden", "true");
    guard.style.display = "none";

    document.body.appendChild(guard);
  }

  function removeGuard() {
    $(GUARD)?.remove();
  }

  function protectCircuitContent() {
    if (!circuitScreen()) {
      circuitRoot = null;
      return;
    }

    const holder = $(CONTENT);
    if (!holder) return;

    const current = holder.querySelector(
      ".msc-root"
    );

    if (current) {
      circuitRoot = current;

      const kicker = current.querySelector(
        ".msc-kicker"
      );

      if (
        kicker &&
        /PREMIUM CIRCUITS/i.test(
          kicker.textContent
        )
      ) {
        kicker.textContent =
          "MANA STRENGTH · INCLUDED WITH MEMBERSHIP";
      }

      return;
    }

    /* Restore the existing Circuit
       element, including its event
       delegation and timer display. */

    if (
      circuitRoot &&
      !holder.contains(circuitRoot)
    ) {
      holder.replaceChildren(circuitRoot);
    }
  }

  /* =====================================
     WORKSPACE-SCOPED STYLING
     ===================================== */

  function sync() {
    queued = false;

    const shell = $(SHELL);
    if (!shell) return;

    const strength = strengthOpen();

    shell.classList.toggle(CLASS, strength);

    $(OLD_CARD)?.remove();

    if (!strength) {
      learningRequested = false;
      circuitRoot = null;
      removeGuard();
      return;
    }

    if (circuitScreen()) {
      ensureGuard();
      protectCircuitContent();
    } else {
      removeGuard();

      if (!learnTabSelected()) {
        learningRequested = false;
        circuitRoot = null;
      }
    }
  }

  function schedule() {
    if (queued) return;

    queued = true;
    requestAnimationFrame(sync);
  }

  /* =====================================
     LEARNING VS CIRCUITS

     The Learning Overview card
     explicitly opens Learning.

     Selecting the bottom Circuits tab
     explicitly returns to Circuits.
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
      circuitRoot = null;
      removeGuard();
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
      circuitRoot = null;
      removeGuard();
    }
  }

  /* =====================================
     INITIALISE
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
        if (!circuitScreen()) return;

        ensureGuard();
        protectCircuitContent();
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
      "[Mana Strength] Circuits stability " +
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
