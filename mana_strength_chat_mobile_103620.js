
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH CHAT MOBILE STABILITY
   BUILD 103620

   COMPLETE FILE:
   mana_strength_chat_mobile_103620.js

   FIXES
   - Prevent iPhone input auto-zoom
   - Stop chat expanding sideways
   - Keep Send button fully visible
   - Adjust chat around mobile keyboard
   - Keep chat header visible
   - Allow messages to scroll independently
   - Maintain fixed-height message field

   PRESERVES
   - Existing Coach Chat messages
   - SEND / SENDING / SENT functionality
   - Premium chat appearance
   - Existing database connection
   - Mana Strength workout functions

   No polling or global MutationObservers.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103620";
  const STYLE_ID = "mana-chat-mobile-103620";
  const MODAL_ID = "manaV95ChatModal";

  if (window.MANA_CHAT_MOBILE_103620) {
    return;
  }

  window.MANA_CHAT_MOBILE_103620 = true;

  const $ = id => document.getElementById(id);

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* =====================================
         MOBILE COACH CHAT
         ===================================== */

      @media (max-width:767px) {

        #manaV95ChatModal {
          position: fixed !important;

          inset: auto !important;

          top: 0;
          left: 0;
          right: auto;

          width: 100% !important;
          max-width: 100vw !important;

          height: 100dvh;
          max-height: 100dvh;

          margin: 0 !important;
          padding: 0 !important;

          display: none;

          flex-direction: column !important;

          overflow: hidden !important;

          box-sizing: border-box !important;

          overscroll-behavior: contain;
        }

        #manaV95ChatModal.open {
          display: flex !important;
        }

        /* =====================================
           HEADER — FIXED AT TOP
           ===================================== */

        #manaV95ChatModal
        .mana-v950-header {
          flex: 0 0 auto !important;

          width: 100% !important;

          min-height: 0 !important;

          box-sizing: border-box !important;
        }

        /* =====================================
           CONVERSATION — SCROLLABLE
           ===================================== */

        #manaV95ChatModal
        .mana-v950-messages {
          flex: 1 1 0 !important;

          min-height: 0 !important;

          height: auto !important;
          max-height: none !important;

          overflow-x: hidden !important;
          overflow-y: auto !important;

          -webkit-overflow-scrolling: touch;

          overscroll-behavior: contain;

          box-sizing: border-box !important;
        }

        /* =====================================
           COMPOSER — STAYS AT BOTTOM
           ===================================== */

        #manaV95ChatModal
        .mana-v950-compose {
          flex: 0 0 auto !important;

          width: 100% !important;
          max-width: 100% !important;

          min-height: 0 !important;

          margin: 0 !important;

          box-sizing: border-box !important;
        }

        #manaV95ChatModal
        .mana-v950-compose-inner {
          display: grid !important;

          width: 100% !important;
          max-width: 100% !important;

          min-width: 0 !important;

          grid-template-columns:
            minmax(0,1fr) auto !important;

          align-items: center !important;

          gap: 8px !important;

          box-sizing: border-box !important;
        }

        /* =====================================
           MESSAGE FIELD — NO ZOOM
           ===================================== */

        #manaV95ChatModal
        #manaV95Input {
          display: block !important;

          width: 100% !important;
          min-width: 0 !important;

          height: 54px !important;
          min-height: 54px !important;
          max-height: 54px !important;

          padding: 14px 12px !important;

          font-size: 16px !important;
          line-height: 1.35 !important;

          border-radius: 13px !important;

          resize: none !important;

          overflow-x: hidden !important;
          overflow-y: auto !important;

          box-sizing: border-box !important;

          -webkit-text-size-adjust: 100%;
        }

        /* =====================================
           SEND BUTTON — ALWAYS VISIBLE
           ===================================== */

        #manaV95ChatModal
        #manaV95Send {
          display: block !important;

          min-width: 74px !important;

          height: 54px !important;
          min-height: 54px !important;
          max-height: 54px !important;

          margin: 0 !important;

          padding: 0 10px !important;

          flex-shrink: 0 !important;

          white-space: nowrap !important;

          box-sizing: border-box !important;
        }

        /* =====================================
           PREVENT HORIZONTAL OVERFLOW
           ===================================== */

        #manaV95ChatModal
        .mana-v950-message {
          max-width: 88% !important;

          min-width: 0 !important;

          box-sizing: border-box !important;
        }

        #manaV95ChatModal
        .mana-v950-message-body {
          max-width: 100% !important;

          overflow-wrap: anywhere !important;

          word-break: break-word;
        }

      }

    `;

    document.head.appendChild(style);
  }

  /* =========================================
     DEVICE VIEWPORT
     ========================================= */

  function isMobile() {
    return window.matchMedia(
      "(max-width:767px)"
    ).matches;
  }

  function updateViewport() {
    const modal = $(MODAL_ID);

    if (!modal) return;

    if (
      !modal.classList.contains("open") ||
      !isMobile()
    ) {
      modal.style.removeProperty("top");
      modal.style.removeProperty("left");
      modal.style.removeProperty("height");
      modal.style.removeProperty("max-height");
      return;
    }

    const viewport = window.visualViewport;

    const height = viewport
      ? viewport.height
      : window.innerHeight;

    const top = viewport
      ? viewport.offsetTop
      : 0;

    if (
      !Number.isFinite(height) ||
      height <= 0
    ) {
      return;
    }

    modal.style.setProperty(
      "top",
      `${Math.round(top)}px`,
      "important"
    );

    modal.style.setProperty(
      "left",
      "0px",
      "important"
    );

    modal.style.setProperty(
      "height",
      `${Math.round(height)}px`,
      "important"
    );

    modal.style.setProperty(
      "max-height",
      `${Math.round(height)}px`,
      "important"
    );
  }

  /* =========================================
     LIGHTWEIGHT VIEWPORT UPDATES
     ========================================= */

  let queued = false;

  function scheduleUpdate() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      updateViewport();
    });
  }

  /* =========================================
     MOBILE KEYBOARD EVENTS
     ========================================= */

  function handleFocus(event) {
    if (
      event.target?.id !== "manaV95Input"
    ) {
      return;
    }

    scheduleUpdate();
  }

  function handleClick(event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    const control = event.target.closest(
      "#manaV95ClientOpen, " +
      "#manaV95CoachOpen, " +
      "#manaV95ChatClose"
    );

    if (control) {
      scheduleUpdate();
    }
  }

  /* =========================================
     INITIALISE
     ========================================= */

  function init() {
    installStyles();

    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        "resize",
        scheduleUpdate,
        {passive:true}
      );

      window.visualViewport.addEventListener(
        "scroll",
        scheduleUpdate,
        {passive:true}
      );
    }

    window.addEventListener(
      "resize",
      scheduleUpdate,
      {passive:true}
    );

    window.addEventListener(
      "orientationchange",
      scheduleUpdate
    );

    document.addEventListener(
      "focusin",
      handleFocus
    );

    document.addEventListener(
      "focusout",
      scheduleUpdate
    );

    document.addEventListener(
      "click",
      handleClick
    );

    scheduleUpdate();

    console.log(
      "Mana Coach Chat Mobile Stability",
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
