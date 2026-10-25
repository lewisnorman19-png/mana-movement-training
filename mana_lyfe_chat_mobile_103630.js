
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — MOBILE CHAT STABILITY
   BUILD 103650

   FULL FILE REPLACEMENT

   Fixes:
   - Mobile screen zoom and sideways expansion
   - Send button disappearing off-screen
   - Lyfe textarea auto-grow layout changes
   - Keyboard viewport positioning

   Preserves:
   - Strength chat
   - Existing Support Chat messaging
   - Quick support prompts
   - Reset features and premium colours
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103650";
  const MODAL = "manaV95ChatModal";
  const INPUT = "manaV95Input";
  const STYLE = "mana-lyfe-mobile-103650";

  if (window.MANA_LYFE_MOBILE_103650) return;
  window.MANA_LYFE_MOBILE_103650 = true;

  const $ = id => document.getElementById(id);

  const mobile = () =>
    window.matchMedia("(max-width:767px)").matches;

  const lyfeOpen = () => {
    const modal = $(MODAL);
    return Boolean(
      modal?.classList.contains("open") &&
      modal.classList.contains("mana-v935-life-mode")
    );
  };

  function installCSS() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `
      @media (max-width:767px) {

        /* Prevent iPhone focus zoom in either
           mode during the Lyfe transition. */

        #manaV95ChatModal #manaV95Input {
          font-size:16px !important;
          -webkit-text-size-adjust:100%;
        }

        /* Use layout width, not visual viewport
           width, which changes during zoom. */

        #manaV95ChatModal.mana-v935-life-mode {
          position:fixed !important;

          left:0 !important;
          right:0 !important;
          bottom:auto !important;

          width:100% !important;
          min-width:0 !important;
          max-width:100% !important;

          margin:0 !important;
          padding:0 !important;

          display:none;
          flex-direction:column !important;

          overflow:hidden !important;
          box-sizing:border-box !important;

          transform:none !important;
          zoom:1 !important;

          overscroll-behavior:contain;
        }

        #manaV95ChatModal.mana-v935-life-mode.open {
          display:flex !important;
        }

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-header {
          flex:0 0 auto !important;
          min-width:0 !important;
          max-width:100% !important;
          box-sizing:border-box !important;
        }

        #manaV95ChatModal.mana-v935-life-mode
        #manaV935LifeChatIntro,
        #manaV95ChatModal.mana-v935-life-mode
        #manaV935LifeChatQuick {
          flex:0 0 auto !important;
          min-width:0 !important;
          width:100% !important;
          max-width:100% !important;
          box-sizing:border-box !important;
          overflow-x:hidden !important;
        }

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-messages {
          flex:1 1 0 !important;

          width:100% !important;
          min-width:0 !important;
          min-height:0 !important;
          max-width:100% !important;

          overflow-x:hidden !important;
          overflow-y:auto !important;

          box-sizing:border-box !important;
          -webkit-overflow-scrolling:touch;
        }

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-compose {
          flex:0 0 auto !important;

          width:100% !important;
          min-width:0 !important;
          max-width:100% !important;

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
          align-items:center !important;

          width:100% !important;
          min-width:0 !important;
          max-width:100% !important;

          box-sizing:border-box !important;
        }

        /* Overrides the older Lyfe auto-grow
           function, including its inline height. */

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

          resize:none !important;
          overflow-x:hidden !important;
          overflow-y:auto !important;

          box-sizing:border-box !important;
          -webkit-text-size-adjust:100%;
        }

        #manaV95ChatModal.mana-v935-life-mode
        #manaV95Send {
          display:block !important;

          width:78px !important;
          min-width:78px !important;
          max-width:78px !important;

          height:54px !important;
          min-height:54px !important;
          max-height:54px !important;

          padding:0 5px !important;
          margin:0 !important;

          font-size:12px !important;
          white-space:nowrap !important;

          box-sizing:border-box !important;
        }

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-message {
          max-width:88% !important;
          min-width:0 !important;
          box-sizing:border-box !important;
        }

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-message-body {
          overflow-wrap:anywhere !important;
          word-break:break-word !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================================
     KEYBOARD HEIGHT ONLY

     Strength's working mobile controller
     remains responsible for its own mode.

     We do not set a visual viewport width.
     ========================================= */

  let frame = 0;

  function update() {
    cancelAnimationFrame(frame);

    frame = requestAnimationFrame(() => {
      const modal = $(MODAL);

      if (!modal || !mobile()) return;
      if (!lyfeOpen()) return;

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
      ) return;

      modal.style.setProperty(
        "top",
        `${Math.round(top)}px`,
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
    });
  }

  /* =========================================
     FIXED INPUT SIZE

     The legacy Lyfe auto-grow listener
     may still update inline height.
     Important CSS overrides it.
     ========================================= */

  function stabilise() {
    if (!mobile()) return;

    const input = $(INPUT);
    if (!input) return;

    input.style.setProperty(
      "font-size",
      "16px",
      "important"
    );

    if (lyfeOpen()) {
      input.style.setProperty(
        "height",
        "54px",
        "important"
      );

      input.style.setProperty(
        "max-height",
        "54px",
        "important"
      );

      input.style.setProperty(
        "min-height",
        "54px",
        "important"
      );
    }

    update();
  }

  function init() {
    installCSS();

    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        "resize",
        update,
        {passive:true}
      );

      window.visualViewport.addEventListener(
        "scroll",
        update,
        {passive:true}
      );
    }

    window.addEventListener(
      "resize",
      update,
      {passive:true}
    );

    document.addEventListener(
      "focusin",
      event => {
        if (event.target?.id === INPUT) {
          stabilise();
        }
      },
      true
    );

    document.addEventListener(
      "input",
      event => {
        if (event.target?.id === INPUT) {
          stabilise();
        }
      }
    );

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        if (event.target.closest(
          "[data-v933-support-chat], " +
          ".mana-v935-quick-btn"
        )) {
          requestAnimationFrame(stabilise);
          setTimeout(stabilise,120);
        }
      }
    );

    console.log(
      "Mana Lyfe Mobile Chat",
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
