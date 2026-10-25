
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA LYFE SUPPORT CHAT — MOBILE STABILITY
   BUILD 103640

   COMPLETE REPLACEMENT:
   mana_lyfe_chat_mobile_103630.js

   FIXES:
   - Keyboard-triggered screen enlargement
   - Horizontal chat overflow
   - Send button being pushed off-screen
   - iPhone automatic input zoom
   - Existing Lyfe auto-grow input behaviour
   - Visible viewport positioning

   PRESERVES:
   - Working chat Send and Sent functions
   - Supabase message history
   - Mana Lyfe quick prompts
   - Reset and breathing features
   - Mana Strength chat
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103640";
  const STYLE_ID = "mana-lyfe-chat-mobile-103640";
  const MODAL_ID = "manaV95ChatModal";

  if (window.MANA_LYFE_CHAT_103640) return;

  window.MANA_LYFE_CHAT_103640 = true;

  const $ = id => document.getElementById(id);

  function isMobile() {
    return window.matchMedia(
      "(max-width:767px)"
    ).matches;
  }

  function isLyfeOpen() {
    const modal = $(MODAL_ID);

    return Boolean(
      modal &&
      modal.classList.contains("open") &&
      modal.classList.contains(
        "mana-v935-life-mode"
      )
    );
  }

  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      @media(max-width:767px) {

        /*
         Apply 16px before Lyfe mode is
         decorated, preventing focus zoom.
        */

        #manaV95ChatModal #manaV95Input {
          font-size:16px !important;
          -webkit-text-size-adjust:100%;
        }

        /*
         LYFE MODAL
        */

        #manaV95ChatModal.mana-v935-life-mode {
          position:fixed !important;

          inset:auto !important;

          top:0;
          left:0;
          right:auto;
          bottom:auto;

          width:100% !important;
          max-width:100% !important;
          min-width:0 !important;

          height:100dvh;
          max-height:100dvh;

          margin:0 !important;
          padding:0 !important;

          overflow:hidden !important;

          box-sizing:border-box !important;

          flex-direction:column !important;

          overscroll-behavior:contain;
        }

        #manaV95ChatModal.mana-v935-life-mode.open {
          display:flex !important;
        }

        /*
         HEADER
        */

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-header {
          flex:0 0 auto !important;

          min-width:0 !important;
          max-width:100% !important;

          padding:12px 14px !important;

          box-sizing:border-box !important;
        }

        /*
         QUICK SUPPORT CONTENT
        */

        #manaV95ChatModal.mana-v935-life-mode
        #manaV935LifeChatIntro,
        #manaV95ChatModal.mana-v935-life-mode
        #manaV935LifeChatQuick {
          flex:0 0 auto !important;

          width:100% !important;
          max-width:100% !important;
          min-width:0 !important;

          box-sizing:border-box !important;

          overflow-x:hidden !important;
        }

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v935-intro-inner {
          max-width:100% !important;
          min-width:0 !important;

          box-sizing:border-box !important;
        }

        /*
         MESSAGES
        */

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-messages {
          flex:1 1 0 !important;

          min-width:0 !important;
          min-height:0 !important;

          width:100% !important;
          max-width:100% !important;

          overflow-x:hidden !important;
          overflow-y:auto !important;

          box-sizing:border-box !important;

          -webkit-overflow-scrolling:touch;
          overscroll-behavior:contain;
        }

        /*
         BOTTOM COMPOSER
        */

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-compose {
          flex:0 0 auto !important;

          width:100% !important;
          max-width:100% !important;
          min-width:0 !important;

          margin:0 !important;
          padding:10px !important;

          box-sizing:border-box !important;
        }

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-compose-inner {
          display:grid !important;

          grid-template-columns:
            minmax(0,1fr) 78px !important;

          gap:8px !important;

          width:100% !important;
          max-width:100% !important;
          min-width:0 !important;

          align-items:center !important;

          box-sizing:border-box !important;
        }

        /*
         FIXED MESSAGE FIELD

         Important rules override the
         original Lyfe auto-grow script.
        */

        #manaV95ChatModal.mana-v935-life-mode
        #manaV95Input {
          display:block !important;

          width:100% !important;
          min-width:0 !important;

          height:54px !important;
          min-height:54px !important;
          max-height:54px !important;

          padding:13px 12px !important;

          font-size:16px !important;
          line-height:1.4 !important;

          border-radius:13px !important;

          resize:none !important;

          overflow-x:hidden !important;
          overflow-y:auto !important;

          box-sizing:border-box !important;
          -webkit-text-size-adjust:100%;
        }

        /*
         SEND BUTTON
        */

        #manaV95ChatModal.mana-v935-life-mode
        #manaV95Send {
          display:block !important;

          width:78px !important;
          min-width:78px !important;
          max-width:78px !important;

          height:54px !important;
          min-height:54px !important;
          max-height:54px !important;

          margin:0 !important;
          padding:0 5px !important;

          font-size:12px !important;

          white-space:nowrap !important;

          box-sizing:border-box !important;
        }

        /*
         KEEP MESSAGE CONTENT
         INSIDE SCREEN
        */

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-message {
          max-width:88% !important;
          min-width:0 !important;

          box-sizing:border-box !important;
        }

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-message-body {
          max-width:100% !important;

          overflow-wrap:anywhere !important;
          word-break:break-word !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================================
     FIT TO VISIBLE PHONE VIEWPORT
     ========================================= */

  function fitViewport() {
    const modal = $(MODAL_ID);

    if (!modal || !isMobile()) return;

    if (!isLyfeOpen()) return;

    const vv = window.visualViewport;

    const width = vv
      ? vv.width
      : window.innerWidth;

    const height = vv
      ? vv.height
      : window.innerHeight;

    const left = vv
      ? vv.offsetLeft
      : 0;

    const top = vv
      ? vv.offsetTop
      : 0;

    if (
      !Number.isFinite(width) ||
      !Number.isFinite(height) ||
      width <= 0 ||
      height <= 0
    ) return;

    modal.style.setProperty(
      "left",
      `${left}px`,
      "important"
    );

    modal.style.setProperty(
      "top",
      `${top}px`,
      "important"
    );

    modal.style.setProperty(
      "width",
      `${width}px`,
      "important"
    );

    modal.style.setProperty(
      "max-width",
      `${width}px`,
      "important"
    );

    modal.style.setProperty(
      "height",
      `${height}px`,
      "important"
    );

    modal.style.setProperty(
      "max-height",
      `${height}px`,
      "important"
    );
  }

  let queued = false;

  function scheduleFit() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      fitViewport();
    });
  }

  /* =========================================
     INPUT STABILITY
     ========================================= */

  function stabiliseInput() {
    if (!isLyfeOpen() || !isMobile()) {
      return;
    }

    const input = $("manaV95Input");

    if (!input) return;

    // The old Lyfe code can still run its
    // auto-grow function. The CSS above
    // prevents that from changing layout.

    input.style.setProperty(
      "height",
      "54px",
      "important"
    );

    input.style.setProperty(
      "min-height",
      "54px",
      "important"
    );

    input.style.setProperty(
      "max-height",
      "54px",
      "important"
    );

    input.style.setProperty(
      "font-size",
      "16px",
      "important"
    );
  }

  function updateChat() {
    stabiliseInput();
    scheduleFit();
  }

  /* =========================================
     PHONE KEYBOARD EVENTS
     ========================================= */

  function handleFocus(event) {
    if (event.target?.id !== "manaV95Input") {
      return;
    }

    updateChat();
  }

  function handleClick(event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    const control = event.target.closest(
      "[data-v933-support-chat], " +
      ".mana-v935-quick-btn, " +
      "#manaV95ClientOpen, " +
      "#manaV95ChatClose"
    );

    if (!control) return;

    updateChat();

    // The Lyfe chat decorator runs shortly
    // after opening. Check the final layout.
    requestAnimationFrame(updateChat);
  }

  function init() {
    installStyles();

    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        "resize",
        updateChat,
        {passive:true}
      );

      window.visualViewport.addEventListener(
        "scroll",
        scheduleFit,
        {passive:true}
      );
    }

    window.addEventListener(
      "resize",
      updateChat,
      {passive:true}
    );

    window.addEventListener(
      "orientationchange",
      updateChat
    );

    document.addEventListener(
      "focusin",
      handleFocus
    );

    document.addEventListener(
      "input",
      event => {
        if (event.target?.id === "manaV95Input") {
          stabiliseInput();
        }
      }
    );

    document.addEventListener(
      "click",
      handleClick
    );

    window.addEventListener(
      "pageshow",
      updateChat
    );

    console.log(
      "Mana Lyfe Chat Mobile",
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
