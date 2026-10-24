
/* ======================================================
   MANA MOVEMENT TRAINING
   MANA LYFE PREMIUM POLISH
   BUILD 103460

   FULL FILE REPLACEMENT:
   mana_lyfe_reset_cleanup_103280.js

   - Premium yellow Overview borders
   - Consistent yellow icon borders
   - Green Reset navigation tab
   - Large round green Reset button
   - Improved Reset emotion cards
   - Emotion selection advances to next step
   - Chat button displays SENT on success
   - Preserve original Reset and chat logic
   - No changes to Mana Strength or Mana 28
   ====================================================== */

(() => {
  "use strict";

  const BUILD = "103460";
  const STYLE_ID = "mana-lyfe-cleanup-103460";

  if (window.MANA_LYFE_POLISH_103460) return;
  window.MANA_LYFE_POLISH_103460 = true;

  const YELLOW = "#F3D875";
  const GREEN = "#55D98B";

  const $ = id => document.getElementById(id);

  function isLyfe() {
    const title = (
      $("manaV83Title")?.textContent || ""
    ).trim().toUpperCase();

    return title === "MANA LIFE" ||
           title === "MANA LYFE";
  }

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* ==========================================
         MANA LYFE OVERVIEW — PREMIUM YELLOW
         ========================================== */

      body.mana-lyfe-103170
      .mana-v978-launch {
        border: 1.5px solid ${YELLOW} !important;
        border-radius: 21px !important;
        background:
          linear-gradient(
            145deg,
            #14120c,
            #090909
          ) !important;
      }

      body.mana-lyfe-103170
      .mana-v978-launch
      .mana-v978-icon {
        border: 1.5px solid ${YELLOW} !important;
        border-color: ${YELLOW} !important;
        border-radius: 15px !important;
        background: #0b0b0b !important;
      }

      body.mana-lyfe-103170
      .mana-v978-launch
      .mana-v978-icon::before,
      body.mana-lyfe-103170
      .mana-v978-launch
      .mana-v978-icon::after {
        border-color: ${YELLOW} !important;
      }

      body.mana-lyfe-103170
      .mana-v978-launchpad
      .mana-v978-grid {
        gap: 15px !important;
      }

      /* ==========================================
         RESET NAVIGATION — GREEN
         ========================================== */

      body.mana-lyfe-103170
      #manaV83Tabs
      [data-v83-tab="reclaim"],
      body.mana-lyfe-103170
      #manaV83Tabs
      [data-v83-tab="reclaim"] * {
        color: ${GREEN} !important;
      }

      body.mana-lyfe-103170
      #manaV83Tabs
      [data-v83-tab="reclaim"]
      svg {
        stroke: ${GREEN} !important;
      }

      body.mana-lyfe-103170
      #manaV83Tabs
      [data-v83-tab="reclaim"].active {
        color: ${GREEN} !important;
      }

      /* ==========================================
         RESET MAIN ACTION — LARGE CIRCLE
         ========================================== */

      body.mana-lyfe-103170
      #manaV83Content
      button.ml460-reset-circle,
      body.mana-lyfe-103170
      #manaV83Content
      a.ml460-reset-circle {
        width: 190px !important;
        height: 190px !important;
        min-width: 190px !important;
        min-height: 190px !important;
        max-width: 190px !important;
        padding: 20px !important;
        margin: 20px auto !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        border-radius: 50% !important;
        border: 3px solid ${GREEN} !important;
        background:
          radial-gradient(
            circle at 35% 25%,
            #236e4e,
            #12432f 75%
          ) !important;
        color: #fff !important;
        box-shadow:
          0 0 0 7px rgba(85,217,139,.07),
          0 0 28px rgba(85,217,139,.16)
          !important;
        font-size: 19px !important;
        line-height: 1.35 !important;
        font-weight: 950 !important;
        letter-spacing: .4px !important;
        white-space: normal !important;
        cursor: pointer !important;
        box-sizing: border-box !important;
      }

      body.mana-lyfe-103170
      #manaV83Content
      .ml460-reset-circle:active {
        transform: scale(.97);
      }

      @media(max-width:420px) {
        body.mana-lyfe-103170
        #manaV83Content
        .ml460-reset-circle {
          width: 168px !important;
          height: 168px !important;
          min-width: 168px !important;
          min-height: 168px !important;
          max-width: 168px !important;
          font-size: 17px !important;
        }
      }

      /* ==========================================
         RESET MODAL — EMOTION CARDS
         ========================================== */

      #manaV936ResetModal
      [data-v936-emotion] {
        min-height: 70px !important;
        padding: 16px 14px !important;
        background:
          linear-gradient(
            145deg,
            #171b18,
            #0d1210
          ) !important;
        border: 1.5px solid #415448 !important;
        border-radius: 15px !important;
        color: #e8f0e9 !important;
        transition:
          background 150ms ease,
          border-color 150ms ease,
          transform 150ms ease;
      }

      #manaV936ResetModal
      [data-v936-emotion]:active {
        transform: scale(.98);
      }

      #manaV936ResetModal
      [data-v936-emotion].selected {
        border-color: ${GREEN} !important;
        background:
          rgba(85,217,139,.14) !important;
        box-shadow:
          0 0 0 1px ${GREEN} !important;
      }

      #manaV936ResetModal
      [data-v936-movement],
      #manaV936ResetModal
      [data-v936-action] {
        border-radius: 14px !important;
        min-height: 64px !important;
      }

      #manaV936ResetModal
      #manaV936Next {
        margin-top: 18px !important;
      }

      /* Preserve the existing breathing layout */

      #manaV936ResetModal
      #manaV937BreathCue {
        display: none !important;
      }

      #manaV936ResetModal
      #manaV936BreathStart {
        margin-left: auto !important;
        margin-right: auto !important;
      }

      /* ==========================================
         SUPPORT CHAT — SENT CONFIRMATION
         ========================================== */

      #manaV95ChatModal.mana-v935-life-mode
      #manaV95Send.ml460-sent {
        color: #07150d !important;
        background: ${GREEN} !important;
        border-color: ${GREEN} !important;
      }

      @media(prefers-reduced-motion:reduce) {
        #manaV936ResetModal
        [data-v936-emotion] {
          transition: none !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* ==========================================
     FIND THE EXISTING RESET BUTTON
     ========================================== */

  function polishResetButton() {
    if (!isLyfe()) return;

    const active = document.querySelector(
      "#manaV83Tabs .mana-v83-tab.active"
    )?.dataset.v83Tab;

    if (active !== "reclaim") return;

    const content = $("manaV83Content");
    if (!content) return;

    // Apply styling to the existing button,
    // preserving its original click handler.

    const buttons = content.querySelectorAll(
      "button, a"
    );

    for (const button of buttons) {
      if (button.closest(".mana-v978-launch")) {
        continue;
      }

      const label = (
        button.textContent || ""
      ).replace(/\s+/g," ").trim();

      if (
        /^((?:↻|⟳|⟲|↺)\s*)?RESET NOW$/i.test(label) ||
        button.id === "ml140OpenReset"
      ) {
        button.classList.add(
          "ml460-reset-circle"
        );

        button.setAttribute(
          "aria-label",
          "Start guided reset"
        );
      }
    }
  }

  /* ==========================================
     GREEN RESET TAB
     ========================================== */

  function polishResetTab() {
    if (!isLyfe()) return;

    const tab = document.querySelector(
      '#manaV83Tabs [data-v83-tab="reclaim"]'
    );

    if (!tab) return;

    // Keep the tab's actual navigation intact.
    // Only change its visual colour.

    tab.style.setProperty(
      "color",
      GREEN,
      "important"
    );

    tab.querySelectorAll("svg").forEach(icon => {
      icon.style.setProperty(
        "stroke",
        GREEN,
        "important"
      );
    });
  }

  /* ==========================================
     AUTO ADVANCE AFTER EMOTION SELECTION
     ========================================== */

  function onEmotionSelected(event) {
    if (!(event.target instanceof Element)) return;

    const emotion = event.target.closest(
      "#manaV936ResetModal [data-v936-emotion]"
    );

    if (!emotion) return;

    // The original Reset handler records the
    // selected emotion and redraws the step.
    // Run after it has completed.

    setTimeout(() => {
      const modal = $("manaV936ResetModal");

      if (!modal?.classList.contains("open")) {
        return;
      }

      const next = $("manaV936Next");

      // Advance only if the original app
      // has accepted the emotion.
      if (
        next &&
        !next.disabled &&
        modal.querySelector(
          "[data-v936-emotion]"
        )
      ) {
        next.click();
      }
    }, 0);
  }

  /* ==========================================
     SUPPORT CHAT SENT INDICATOR
     ========================================== */

  function watchChat() {
    const modal = $("manaV95ChatModal");
    if (!modal || modal.dataset.ml460ChatWatch) {
      return;
    }

    modal.dataset.ml460ChatWatch = "1";

    const status = $("manaV95Status");
    const button = $("manaV95Send");
    const input = $("manaV95Input");

    if (!status || !button) return;

    function syncSent() {
      const message = (
        status.textContent || ""
      ).trim();

      if (/^Sent\s*✓?$/i.test(message)) {
        button.textContent = "SENT ✓";
        button.classList.add("ml460-sent");
      }
    }

    const observer = new MutationObserver(
      syncSent
    );

    observer.observe(status, {
      childList: true,
      characterData: true,
      subtree: true
    });

    // When the client starts composing again,
    // restore the normal Send label.
    input?.addEventListener("input", () => {
      if (button.classList.contains("ml460-sent")) {
        button.classList.remove("ml460-sent");
        button.textContent = "SEND";
      }
    });
  }

  /* ==========================================
     LIGHTWEIGHT REFRESH
     ========================================== */

  let queued = false;

  function refresh() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      polishResetTab();
      polishResetButton();
      watchChat();
    });
  }

  function init() {
    installStyles();

    // Capture emotion selection, but allow
    // the existing handler to process it.
    document.addEventListener(
      "click",
      onEmotionSelected,
      true
    );

    // React to user navigation, not to every
    // animation frame or reset countdown.
    document.addEventListener("click", event => {
      if (!(event.target instanceof Element)) {
        return;
      }

      if (
        event.target.closest(
          '#manaV83Tabs, #manaV83Content .mana-v978-launch'
        )
      ) {
        requestAnimationFrame(refresh);
      }
    });

    const content = $("manaV83Content");

    if (content) {
      new MutationObserver(refresh).observe(
        content,
        {childList:true}
      );
    }

    window.addEventListener(
      "pageshow",
      refresh
    );

    refresh();

    console.log(
      "Mana Lyfe Premium Polish",
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
