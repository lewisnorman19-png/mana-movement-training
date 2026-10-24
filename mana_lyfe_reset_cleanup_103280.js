
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA LYFE PREMIUM POLISH
   BUILD 103480

   COMPLETE FILE REPLACEMENT
   File: mana_lyfe_reset_cleanup_103280.js

   FIXES:
   1. All Overview card borders premium yellow
   2. All Overview icon borders premium yellow
   3. Reset navigation dot green, not purple
   4. Reset tab icon and text green
   5. Large round Reset Now button
   6. Premium Support Chat layout
   7. Emotion selection advances automatically
   8. Chat SEND changes to SENT on success

   Preserves existing Reset and chat handlers.
   No changes to Mana Strength or Mana 28.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103480";
  const STYLE_ID = "mana-lyfe-polish-103480";

  if (window.MANA_LYFE_POLISH_103480) return;
  window.MANA_LYFE_POLISH_103480 = true;

  const GOLD = "#F3D875";
  const GREEN = "#55D98B";

  const $ = id => document.getElementById(id);

  function isLyfe() {
    const name = (
      $("manaV83Title")?.textContent || ""
    ).trim().toUpperCase();

    return name === "MANA LIFE" ||
           name === "MANA LYFE";
  }

  /* =========================================
     PREMIUM STYLES
     ========================================= */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* =====================================
         OVERVIEW CARD BORDERS — GOLD
         ===================================== */

      body.mana-lyfe-103170
      #manaV83Content
      .mana-v978-launchpad
      .mana-v978-launch,

      body.mana-lyfe-103170
      #manaV83Content
      .mana-v978-grid
      .mana-v978-launch {

        border: 1.5px solid ${GOLD} !important;
        border-color: ${GOLD} !important;
        border-radius: 21px !important;
        outline: none !important;

        background:
          linear-gradient(
            145deg,
            #16140d,
            #090909
          ) !important;
      }

      /* =====================================
         ICON FRAMES — ALL GOLD
         ===================================== */

      body.mana-lyfe-103170
      #manaV83Content
      .mana-v978-launch
      .mana-v978-icon {

        border: 1.5px solid ${GOLD} !important;
        border-top-color: ${GOLD} !important;
        border-right-color: ${GOLD} !important;
        border-bottom-color: ${GOLD} !important;
        border-left-color: ${GOLD} !important;

        outline: none !important;
        border-radius: 16px !important;

        background: #0b0b0b !important;

        box-shadow:
          inset 0 0 0 1px rgba(243,216,117,.08)
          !important;
      }

      body.mana-lyfe-103170
      #manaV83Content
      .mana-v978-launch
      .mana-v978-icon::before,

      body.mana-lyfe-103170
      #manaV83Content
      .mana-v978-launch
      .mana-v978-icon::after {

        border-color: ${GOLD} !important;
      }

      body.mana-lyfe-103170
      #manaV83Content
      .mana-v978-launch
      .mana-v978-icon img {

        border: none !important;
        outline: none !important;
      }

      /* Keep individual text colours.
         Only borders become uniform gold. */

      /* =====================================
         BOTTOM RESET TAB — GREEN
         ===================================== */

      body.mana-lyfe-103170
      #manaV83Tabs
      [data-v83-tab="reclaim"] {

        color: ${GREEN} !important;
        --tab-color: ${GREEN} !important;
        --accent: ${GREEN} !important;
        --mana-tab-color: ${GREEN} !important;
      }

      body.mana-lyfe-103170
      #manaV83Tabs
      [data-v83-tab="reclaim"] * {

        color: ${GREEN} !important;
      }

      body.mana-lyfe-103170
      #manaV83Tabs
      [data-v83-tab="reclaim"] svg {

        color: ${GREEN} !important;
        stroke: ${GREEN} !important;
      }

      /* Reset indicator dot */

      body.mana-lyfe-103170
      #manaV83Tabs
      [data-v83-tab="reclaim"]::before,

      body.mana-lyfe-103170
      #manaV83Tabs
      [data-v83-tab="reclaim"]::after {

        background-color: ${GREEN} !important;
        border-color: ${GREEN} !important;
      }

      body.mana-lyfe-103170
      #manaV83Tabs
      [data-v83-tab="reclaim"]
      .mana-v83-dot,

      body.mana-lyfe-103170
      #manaV83Tabs
      [data-v83-tab="reclaim"]
      .mana-v83-tab-dot,

      body.mana-lyfe-103170
      #manaV83Tabs
      [data-v83-tab="reclaim"]
      .tab-dot {

        background: ${GREEN} !important;
        background-color: ${GREEN} !important;
        border-color: ${GREEN} !important;
      }

      /* =====================================
         LARGE CIRCULAR RESET BUTTON
         ===================================== */

      body.mana-lyfe-103170
      #manaV83Content
      .ml480-reset-circle {

        width: 190px !important;
        height: 190px !important;

        min-width: 190px !important;
        min-height: 190px !important;

        max-width: 190px !important;

        margin: 20px auto !important;
        padding: 20px !important;

        display: flex !important;
        flex-direction: column !important;

        align-items: center !important;
        justify-content: center !important;

        border: 3px solid ${GREEN} !important;
        border-radius: 50% !important;

        background:
          radial-gradient(
            circle at 35% 25%,
            #267850,
            #103d2b 80%
          ) !important;

        box-shadow:
          0 0 0 7px rgba(85,217,139,.07),
          0 0 30px rgba(85,217,139,.18)
          !important;

        color: white !important;

        font-size: 19px !important;
        font-weight: 950 !important;
        line-height: 1.35 !important;

        text-align: center !important;
        white-space: normal !important;

        box-sizing: border-box !important;
        cursor: pointer !important;
      }

      body.mana-lyfe-103170
      #manaV83Content
      .ml480-reset-circle:active {

        transform: scale(.97);
      }

      /* =====================================
         RESET EMOTION CARDS
         ===================================== */

      #manaV936ResetModal
      [data-v936-emotion] {

        min-height: 70px !important;
        padding: 15px !important;

        border: 1.5px solid #43594b !important;
        border-radius: 15px !important;

        background:
          linear-gradient(
            145deg,
            #171e19,
            #0b110d
          ) !important;

        color: #edf5ef !important;
      }

      #manaV936ResetModal
      [data-v936-emotion].selected {

        border-color: ${GREEN} !important;
        background:
          rgba(85,217,139,.14) !important;
      }

      #manaV936ResetModal
      [data-v936-movement],

      #manaV936ResetModal
      [data-v936-action] {

        min-height: 62px !important;
        border-radius: 14px !important;
      }

      #manaV936ResetModal
      #manaV937BreathCue {

        display: none !important;
      }

      #manaV936ResetModal
      #manaV936BreathStart {

        margin-left: auto !important;
        margin-right: auto !important;
      }

      /* =====================================
         PREMIUM SUPPORT CHAT
         ===================================== */

      #manaV95ChatModal.mana-v935-life-mode {

        background: #070908 !important;
      }

      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-header {

        padding: 17px 22px !important;

        border-bottom:
          1px solid rgba(243,216,117,.42)
          !important;

        background:
          linear-gradient(
            145deg,
            #17150c,
            #090b09
          ) !important;
      }

      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-header-kicker {

        color: ${GREEN} !important;
        font-size: 11px !important;
        font-weight: 900 !important;
        letter-spacing: 1px !important;
      }

      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-header-title {

        color: white !important;
        font-size: 26px !important;
        font-weight: 950 !important;
      }

      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-header-sub {

        color: #abb7af !important;
        font-size: 13px !important;
      }

      /* Chat introduction */

      #manaV95ChatModal.mana-v935-life-mode
      .mana-v935-intro-inner {

        max-width: 700px !important;
        margin: 0 auto !important;

        padding: 17px 19px !important;

        border: 1px solid ${GOLD} !important;
        border-radius: 16px !important;

        background:
          linear-gradient(
            145deg,
            #19160e,
            #0e100d
          ) !important;

        box-sizing: border-box !important;
      }

      #manaV95ChatModal.mana-v935-life-mode
      .mana-v935-intro-kicker {

        color: ${GOLD} !important;
        font-size: 10px !important;
        font-weight: 900 !important;
      }

      #manaV95ChatModal.mana-v935-life-mode
      .mana-v935-intro-copy {

        color: #c8d0c9 !important;

        font-size: 13px !important;
        line-height: 1.6 !important;

        margin-top: 7px !important;
      }

      /* Message conversation */

      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-messages {

        padding:
          18px
          max(15px,calc((100% - 780px)/2))
          !important;

        background:
          linear-gradient(
            180deg,
            #0e110f,
            #080a09
          ) !important;

        min-height: 110px !important;
        overflow-y: auto !important;
      }

      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-message {

        max-width: min(82%,480px) !important;
        border-radius: 16px !important;

        padding: 13px 15px !important;
        margin-bottom: 10px !important;
      }

      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-message-body {

        font-size: 14px !important;
        line-height: 1.6 !important;
        overflow-wrap: anywhere;
      }

      /* Quick prompts */

      #manaV95ChatModal.mana-v935-life-mode
      .mana-v935-quick-btn {

        min-height: 40px !important;
        padding: 8px 14px !important;

        border:
          1px solid rgba(243,216,117,.5)
          !important;

        border-radius: 24px !important;

        background: #19170f !important;
        color: ${GOLD} !important;

        font-size: 12px !important;
      }

      /* Message composer */

      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-compose {

        padding: 16px !important;

        border-top:
          1px solid rgba(243,216,117,.42)
          !important;

        background: #0a0d0b !important;
      }

      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-compose-inner {

        width: min(780px,100%) !important;
        margin: auto !important;

        display: flex !important;
        align-items: stretch !important;
        gap: 10px !important;
      }

      #manaV95ChatModal.mana-v935-life-mode
      #manaV95Input {

        flex: 1 !important;
        min-width: 0 !important;
        min-height: 54px !important;

        padding: 14px !important;

        border: 1px solid #425448 !important;
        border-radius: 14px !important;

        background: #121713 !important;
        color: white !important;

        font-size: 14px !important;

        box-sizing: border-box !important;
      }

      #manaV95ChatModal.mana-v935-life-mode
      #manaV95Input:focus {

        outline: none !important;

        border-color: ${GREEN} !important;

        box-shadow:
          0 0 0 2px rgba(85,217,139,.12)
          !important;
      }

      #manaV95ChatModal.mana-v935-life-mode
      #manaV95Send {

        min-width: 90px !important;
        min-height: 54px !important;
        height: auto !important;

        padding: 11px !important;

        border: 1px solid ${GREEN} !important;
        border-radius: 14px !important;

        background: ${GREEN} !important;
        color: #072015 !important;

        font-size: 13px !important;
        font-weight: 950 !important;
      }

      #manaV95ChatModal.mana-v935-life-mode
      #manaV95Status {

        max-width: 780px !important;
        margin: 7px auto 0 !important;
        font-size: 12px !important;
      }

      /* =====================================
         MOBILE
         ===================================== */

      @media(max-width:600px) {

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-header {

          padding: 15px !important;
        }

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-header-title {

          font-size: 22px !important;
        }

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-messages {

          padding: 14px 12px !important;
        }

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-compose {

          padding: 12px !important;
        }

        #manaV95ChatModal.mana-v935-life-mode
        #manaV95Send {

          min-width: 75px !important;
        }

        body.mana-lyfe-103170
        #manaV83Content
        .ml480-reset-circle {

          width: 165px !important;
          height: 165px !important;

          min-width: 165px !important;
          min-height: 165px !important;

          max-width: 165px !important;

          font-size: 17px !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =========================================
     DIRECTLY SET OVERVIEW BORDERS
     ========================================= */

  function polishOverviewBorders() {
    if (!isLyfe()) return;

    const grid = document.querySelector(
      "#manaV83Content .mana-v978-grid"
    );

    if (!grid) return;

    const cards = grid.querySelectorAll(
      ".mana-v978-launch"
    );

    cards.forEach(card => {
      card.style.setProperty(
        "border-color",
        GOLD,
        "important"
      );

      card.style.setProperty(
        "border-width",
        "1.5px",
        "important"
      );

      const icon = card.querySelector(
        ".mana-v978-icon"
      );

      if (!icon) return;

      icon.style.setProperty(
        "border",
        `1.5px solid ${GOLD}`,
        "important"
      );

      icon.style.setProperty(
        "border-color",
        GOLD,
        "important"
      );

      icon.style.setProperty(
        "box-shadow",
        "none",
        "important"
      );
    });
  }

  /* =========================================
     DIRECTLY FIX RESET TAB AND DOT
     ========================================= */

  function polishResetTab() {
    if (!isLyfe()) return;

    const tab = document.querySelector(
      '#manaV83Tabs [data-v83-tab="reclaim"]'
    );

    if (!tab) return;

    tab.style.setProperty(
      "color",
      GREEN,
      "important"
    );

    tab.style.setProperty(
      "--tab-color",
      GREEN,
      "important"
    );

    tab.querySelectorAll("svg").forEach(svg => {
      svg.style.setProperty(
        "stroke",
        GREEN,
        "important"
      );
    });

    // Target actual marker elements without
    // replacing or recreating navigation.

    tab.querySelectorAll(
      '[class*="dot"],' +
      '[class*="indicator"],' +
      '[class*="marker"]'
    ).forEach(node => {

      node.style.setProperty(
        "background-color",
        GREEN,
        "important"
      );

      node.style.setProperty(
        "border-color",
        GREEN,
        "important"
      );
    });
  }

  /* =========================================
     LARGE RESET BUTTON
     ========================================= */

  function polishResetButton() {
    if (!isLyfe()) return;

    const tab = document.querySelector(
      "#manaV83Tabs .mana-v83-tab.active"
    )?.dataset.v83Tab;

    if (tab !== "reclaim") return;

    const content = $("manaV83Content");
    if (!content) return;

    content.querySelectorAll(
      "button,a"
    ).forEach(button => {

      if (
        button.closest(
          ".mana-v978-launch"
        )
      ) {
        return;
      }

      const text = (
        button.textContent || ""
      ).replace(/\s+/g," ").trim();

      if (
        button.id === "ml140OpenReset" ||
        /^(?:[↻⟳⟲↺]\s*)?RESET NOW$/i.test(text)
      ) {
        button.classList.add(
          "ml480-reset-circle"
        );

        button.setAttribute(
          "aria-label",
          "Start guided reset"
        );
      }
    });
  }

  /* =========================================
     EMOTION SELECTION AUTO-ADVANCE
     ========================================= */

  function onEmotionClick(event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    const selected = event.target.closest(
      "#manaV936ResetModal " +
      "[data-v936-emotion]"
    );

    if (!selected) return;

    // Existing Reset handler first records
    // the emotion and redraws its step.

    setTimeout(() => {
      const modal = $("manaV936ResetModal");
      const next = $("manaV936Next");

      if (
        modal?.classList.contains("open") &&
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

  /* =========================================
     CHAT SENT CONFIRMATION
     ========================================= */

  function watchChat() {
    const modal = $("manaV95ChatModal");
    const button = $("manaV95Send");
    const status = $("manaV95Status");
    const input = $("manaV95Input");

    if (
      !modal ||
      !button ||
      !status ||
      modal.dataset.ml480Chat
    ) {
      return;
    }

    modal.dataset.ml480Chat = "1";

    new MutationObserver(() => {
      const message = (
        status.textContent || ""
      ).trim();

      if (/^Sent\s*✓?$/i.test(message)) {
        button.textContent = "SENT ✓";
        button.classList.add("ml480-sent");
      }
    }).observe(status, {
      childList: true,
      characterData: true,
      subtree: true
    });

    input?.addEventListener("input", () => {
      if (
        button.classList.contains(
          "ml480-sent"
        )
      ) {
        button.classList.remove(
          "ml480-sent"
        );

        button.textContent = "SEND";
      }
    });
  }

  /* =========================================
     REFRESH ONLY WHEN NEEDED
     ========================================= */

  let queued = false;

  function refresh() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;

      polishOverviewBorders();
      polishResetTab();
      polishResetButton();
      watchChat();
    });
  }

  function init() {
    installStyles();

    document.addEventListener(
      "click",
      onEmotionClick,
      true
    );

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        if (
          event.target.closest(
            "#manaV83Tabs, " +
            "#manaV83Content .mana-v978-launch"
          )
        ) {
          requestAnimationFrame(refresh);
        }
      }
    );

    const content = $("manaV83Content");

    if (content) {
      new MutationObserver(refresh).observe(
        content,
        {
          childList: true
        }
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
