
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — SUPPORT CHAT MOBILE FIX
   BUILD 103630

   COMPLETE FILE:
   mana_lyfe_chat_mobile_103630.js

   - Fix expanding Support Chat on phones
   - Prevent automatic input zoom
   - Stop Lyfe's auto-grow changing input height
   - Keep SEND button fully visible
   - Retain quick support prompts
   - Preserve Supabase messaging
   - Preserve Mana Strength chat behaviour
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103630";
  const STYLE_ID = "mana-lyfe-chat-mobile-103630";

  if (window.MANA_LYFE_CHAT_MOBILE_103630) {
    return;
  }

  window.MANA_LYFE_CHAT_MOBILE_103630 = true;

  function installStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `

      @media (max-width:767px) {

        /* LYFE SUPPORT CHAT WINDOW */

        #manaV95ChatModal.mana-v935-life-mode {
          width: 100% !important;
          max-width: 100vw !important;

          min-width: 0 !important;

          padding: 0 !important;
          margin: 0 !important;

          box-sizing: border-box !important;

          overflow: hidden !important;
        }

        /* HEADER */

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-header {
          flex: 0 0 auto !important;
          min-width: 0 !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }

        /* SCROLLING MESSAGES */

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-messages {
          flex: 1 1 0 !important;

          min-height: 0 !important;
          min-width: 0 !important;

          max-width: 100% !important;

          overflow-x: hidden !important;
          overflow-y: auto !important;

          box-sizing: border-box !important;
          -webkit-overflow-scrolling: touch;
        }

        /* SUPPORT INTRO AND QUICK PROMPTS */

        #manaV95ChatModal.mana-v935-life-mode
        #manaV935LifeChatIntro,
        #manaV95ChatModal.mana-v935-life-mode
        #manaV935LifeChatQuick {
          flex-shrink: 0 !important;
          min-width: 0 !important;
          max-width: 100% !important;

          box-sizing: border-box !important;

          overflow-x: hidden !important;
        }

        /* MESSAGE COMPOSER */

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-compose {
          flex: 0 0 auto !important;

          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;

          margin: 0 !important;

          box-sizing: border-box !important;
        }

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-compose-inner {
          display: grid !important;

          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;

          grid-template-columns:
            minmax(0,1fr) auto !important;

          gap: 8px !important;
          align-items: center !important;

          box-sizing: border-box !important;
        }

        /* FIXED MESSAGE INPUT

           Overrides the old Lyfe auto-grow
           function, including inline height.
        */

        #manaV95ChatModal.mana-v935-life-mode
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

          resize: none !important;

          overflow-x: hidden !important;
          overflow-y: auto !important;

          box-sizing: border-box !important;

          -webkit-text-size-adjust: 100%;
        }

        /* SEND BUTTON */

        #manaV95ChatModal.mana-v935-life-mode
        #manaV95Send {
          display: block !important;

          width: auto !important;
          min-width: 74px !important;

          height: 54px !important;
          min-height: 54px !important;
          max-height: 54px !important;

          padding: 0 10px !important;
          margin: 0 !important;

          flex-shrink: 0 !important;

          font-size: 12px !important;

          white-space: nowrap !important;
          box-sizing: border-box !important;
        }

        /* PREVENT LONG MESSAGES
           FROM STRETCHING SCREEN */

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-message {
          max-width: 88% !important;
          min-width: 0 !important;

          box-sizing: border-box !important;
        }

        #manaV95ChatModal.mana-v935-life-mode
        .mana-v950-message-body {
          max-width: 100% !important;

          overflow-wrap: anywhere !important;
          word-break: break-word !important;
        }

      }

    `;

    document.head.appendChild(style);
  }

  function init() {
    installStyles();

    console.log(
      "Mana Lyfe Mobile Support Chat",
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
