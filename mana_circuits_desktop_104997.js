
/* ============================================================
   MANA MOVEMENT TRAINING
   CIRCUITS — DESKTOP WIDTH & NAVIGATION REPAIR
   BUILD 104998

   COMPLETE REPLACEMENT:
   mana_circuits_desktop_104997.js

   FIXES:
   - Removes the oversized desktop layout
   - Keeps Circuits centred on laptop screens
   - Three evenly spaced circuit cards
   - Full-width detail panel within Circuits
   - Top-right button says Overview
   - Overview returns to Mana Strength Overview
   - Does not navigate through Profile
   - Preserves existing mobile sizing

   PROTECTED:
   - EMOM
   - Tabata
   - Strength Circuit
   - Timers and audio
   - Circuit history
   - Client Profile
   - Coach Hub
   - Nutrition and workout data

   NO DATABASE CHANGES
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104998";
  const FLAG = "MANA_CIRCUITS_DESKTOP_104998";
  const STYLE = "manaCircuitsDesktopStyle104998";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const SHELL = "manaV83ProgramShell";
  const CONTENT = "manaV83Content";
  const TABS = "manaV83Tabs";
  const BACK = "manaV83Back";

  const $ = id => document.getElementById(id);

  let navigationInstalled = false;
  let lastButtonLabel = "";
  let scheduled = false;
  let observer = null;

  /* =====================================================
     CIRCUITS SCREEN DETECTION
     ===================================================== */

  function strengthOpen() {
    const shell = $(SHELL);
    const title = $("manaV83Title");

    return Boolean(
      shell?.classList.contains("open") &&
      /strength/i.test(title?.textContent || "")
    );
  }

  function circuitsOpen() {
    if (!strengthOpen()) return false;

    const holder = $(CONTENT);
    const tabs = $(TABS);

    const circuit =
      holder?.querySelector(".msc-root");

    const learnTab = tabs?.querySelector(
      '[data-v83-tab="learn"]'
    );

    return Boolean(
      circuit &&
      learnTab?.classList.contains("active")
    );
  }

  function overviewTab() {
    return $(TABS)?.querySelector(
      '[data-v83-tab="overview"]'
    );
  }

  /* =====================================================
     PREMIUM DESKTOP STYLING

     IMPORTANT:
     No global body or .wrap width changes.
     Only the active Circuits screen is
     allowed to receive these dimensions.
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* -----------------------------------------
         DESKTOP / LAPTOP
         ----------------------------------------- */

      @media (min-width: 900px) {

        #${SHELL}.open:has(
          #${CONTENT} .msc-root
        ) {
          width: 100% !important;
          max-width: 900px !important;
          min-width: 0 !important;

          margin-left: auto !important;
          margin-right: auto !important;

          padding-left: 16px !important;
          padding-right: 16px !important;

          box-sizing: border-box !important;
        }

        #${SHELL}.open:has(
          #${CONTENT} .msc-root
        ) .mana-v83-head {
          width: 100% !important;
          max-width: 868px !important;
          min-width: 0 !important;

          margin-left: auto !important;
          margin-right: auto !important;

          box-sizing: border-box !important;
        }

        #${SHELL}.open
        #${CONTENT}:has(.msc-root) {
          display: block !important;

          width: 100% !important;
          max-width: 868px !important;
          min-width: 0 !important;

          margin: 0 auto !important;
          padding: 18px 8px 130px !important;

          box-sizing: border-box !important;
        }

        #${CONTENT} .msc-root {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;

          display: grid !important;
          grid-template-columns: minmax(0,1fr) !important;

          gap: 17px !important;
          padding: 0 0 24px !important;

          box-sizing: border-box !important;
        }

        /* THREE CIRCUIT CHOICES */

        #${CONTENT} .msc-choices {
          width: 100% !important;

          display: grid !important;
          grid-template-columns:
            repeat(3,minmax(0,1fr)) !important;

          gap: 12px !important;
          align-items: stretch !important;

          margin: 0 !important;
        }

        #${CONTENT} .msc-choice {
          width: 100% !important;
          min-width: 0 !important;
          min-height: 108px !important;

          padding: 17px 15px !important;

          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
          justify-content: flex-start !important;

          background: #17191D !important;
          border: 1px solid #535C68 !important;
          border-radius: 15px !important;

          color: #FFFFFF !important;
          text-align: left !important;

          box-sizing: border-box !important;
        }

        #${CONTENT} .msc-choice.active {
          background: #291910 !important;
          border-color: #FF7927 !important;
        }

        #${CONTENT} .msc-choice:hover {
          border-color: #FF7927 !important;
        }

        #${CONTENT} .msc-choice strong {
          color: #FFFFFF !important;

          font-size: 16px !important;
          font-weight: 900 !important;
          line-height: 1.3 !important;

          margin-bottom: 7px !important;
        }

        #${CONTENT} .msc-choice small {
          color: #C1C6CE !important;
          font-size: 11px !important;
          line-height: 1.5 !important;
        }

        /* CIRCUIT DETAILS */

        #${CONTENT} .msc-panel {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;

          padding: 22px 24px !important;

          background: #15171A !important;
          border: 1px solid #535C68 !important;
          border-radius: 18px !important;

          box-sizing: border-box !important;
        }

        #${CONTENT} .msc-panel h3 {
          color: #FFFFFF !important;
          font-size: 21px !important;

          margin: 7px 0 12px !important;
        }

        #${CONTENT} .msc-label {
          color: #FF7927 !important;
          font-size: 11px !important;
          font-weight: 900 !important;
        }

        #${CONTENT} .msc-muted {
          color: #C1C6CE !important;
          font-size: 13px !important;
          line-height: 1.6 !important;
        }

        /* DURATION SELECTION */

        #${CONTENT} .msc-settings {
          display: flex !important;
          flex-wrap: wrap !important;

          gap: 9px !important;
          margin: 15px 0 !important;
        }

        #${CONTENT} .msc-setting {
          min-width: 84px !important;
          min-height: 42px !important;

          padding: 10px 15px !important;

          background: #111317 !important;
          border: 1px solid #58616B !important;
          border-radius: 11px !important;

          color: #FFFFFF !important;
          font-size: 13px !important;
        }

        #${CONTENT}
        .msc-setting[aria-pressed="true"] {
          color: #FF7927 !important;
          border-color: #FF7927 !important;
        }

        /* EXERCISES */

        #${CONTENT} .msc-list {
          display: grid !important;
          grid-template-columns: minmax(0,1fr) !important;

          width: 100% !important;
          max-width: 100% !important;

          gap: 9px !important;
          margin-top: 16px !important;

          box-sizing: border-box !important;
        }

        #${CONTENT} .msc-list li {
          width: 100% !important;
          max-width: 100% !important;

          padding: 13px 15px !important;

          background: #0B0D10 !important;
          border: 1px solid #373E48 !important;
          border-radius: 11px !important;

          color: #FFFFFF !important;
          font-size: 13px !important;
          line-height: 1.55 !important;

          box-sizing: border-box !important;
        }

        /* TIMER */

        #${CONTENT} .msc-timer {
          width: 100% !important;
          max-width: 100% !important;

          padding: 22px 17px !important;

          background: #0C0E11 !important;
          border: 1px solid #FF7927 !important;
          border-radius: 17px !important;

          box-sizing: border-box !important;
        }

        #${CONTENT} .msc-clock {
          color: #FFFFFF !important;
          font-size: 62px !important;
          line-height: 1.2 !important;
        }

        #${CONTENT} .msc-step {
          color: #FF7927 !important;
        }

        #${CONTENT} .msc-actions {
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: center !important;

          gap: 10px !important;
          margin-top: 15px !important;
        }

        #${CONTENT} .msc-btn {
          min-height: 43px !important;
          padding: 11px 18px !important;
          border-radius: 11px !important;
        }

      }

      /* -----------------------------------------
         SMALL DESKTOP / TABLET
         ----------------------------------------- */

      @media (min-width: 601px)
             and (max-width: 899px) {

        #${SHELL}.open
        #${CONTENT}:has(.msc-root) {
          width: 100% !important;
          max-width: 760px !important;

          margin: 0 auto !important;
          padding: 14px 12px 115px !important;

          box-sizing: border-box !important;
        }

        #${CONTENT} .msc-choices {
          gap: 9px !important;
        }

        #${CONTENT} .msc-choice {
          padding: 13px 11px !important;
          min-height: 100px !important;
        }

        #${CONTENT} .msc-panel {
          padding: 18px !important;
        }
      }

      /* -----------------------------------------
         MOBILE

         Keep existing mobile card layout.
         ----------------------------------------- */

      @media (max-width: 600px) {

        #${CONTENT} .msc-root,
        #${CONTENT} .msc-panel,
        #${CONTENT} .msc-choices {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

      }

      /* -----------------------------------------
         CIRCUITS OVERVIEW BUTTON
         ----------------------------------------- */

      #${SHELL}.open:has(
        #${CONTENT} .msc-root
      ) #${BACK} {
        display: inline-flex !important;

        align-items: center !important;
        justify-content: center !important;

        min-height: 42px !important;
        padding: 0 15px !important;

        background: #15171A !important;
        border: 1px solid #626973 !important;
        border-radius: 12px !important;

        color: #FFFFFF !important;
        font-size: 12px !important;
        font-weight: 850 !important;
        white-space: nowrap !important;

        cursor: pointer !important;
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     OVERVIEW BUTTON

     When Circuits is active, use the existing
     Overview navigation tab.

     This avoids using the program-level Home
     action, which can exit the workout area.
     ===================================================== */

  function syncOverviewButton() {
    const button = $(BACK);

    if (!button) return;

    if (circuitsOpen()) {
      if (
        !button.dataset.manaCircuits998
      ) {
        lastButtonLabel =
          button.textContent || "";
      }

      button.dataset.manaCircuits998 = "1";
      button.textContent = "← Overview";
      button.setAttribute(
        "aria-label",
        "Return to Mana Strength Overview"
      );

    } else if (
      button.dataset.manaCircuits998
    ) {
      delete button.dataset.manaCircuits998;

      button.textContent =
        lastButtonLabel || "← Home";

      button.removeAttribute(
        "aria-label"
      );
    }
  }

  function handleOverviewClick(event) {
    const button = event.target.closest?.(
      "#" + BACK
    );

    if (!button || !circuitsOpen()) return;

    const overview = overviewTab();

    if (!overview) return;

    /*
     Prevent only the original Home action
     while on Circuits.

     The existing Overview tab performs the
     actual navigation.
    */

    event.preventDefault();
    event.stopImmediatePropagation();

    overview.click();

    scheduleSync();
  }

  /* =====================================================
     NAVIGATION STATE

     Uses existing events and light DOM
     observation. Does not rebuild screens.
     ===================================================== */

  function scheduleSync() {
    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      syncOverviewButton();
    });
  }

  function installNavigation() {
    if (navigationInstalled) return;

    navigationInstalled = true;

    /*
     Capture phase ensures this button does
     not also trigger the original Home route.
    */

    document.addEventListener(
      "click",
      handleOverviewClick,
      true
    );

    window.addEventListener(
      "mana:program-tab-change",
      scheduleSync
    );

    window.addEventListener(
      "pageshow",
      scheduleSync
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) {
          scheduleSync();
        }
      }
    );

    const shell = $(SHELL);
    const content = $(CONTENT);

    if (shell && content) {
      observer = new MutationObserver(
        scheduleSync
      );

      observer.observe(shell, {
        attributes: true,
        attributeFilter: ["class"]
      });

      observer.observe(content, {
        childList: true
      });

      const tabs = $(TABS);

      if (tabs) {
        observer.observe(tabs, {
          attributes: true,
          attributeFilter: ["class"],
          subtree: true
        });
      }
    }
  }

  function init() {
    installStyles();
    installNavigation();
    scheduleSync();

    window.MANA_CIRCUITS_DESKTOP_BUILD =
      BUILD;

    console.log(
      "[Mana Movement] Circuits Desktop " +
      BUILD +
      " active"
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
