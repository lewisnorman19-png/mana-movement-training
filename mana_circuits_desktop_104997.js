
/* ============================================================
   MANA MOVEMENT TRAINING
   MANA STRENGTH — CIRCUITS DESKTOP FINISH
   BUILD 104997

   COMPLETE JAVASCRIPT FILE

   FEATURES
   - Wider laptop and desktop layout
   - Three evenly sized circuit selection cards
   - Full-width circuit detail panel
   - Improved duration controls
   - Better exercise list spacing
   - Premium black / orange / white / silver
   - Responsive tablet layout
   - Existing mobile appearance preserved

   PRESERVES
   - EMOM exercises and timer
   - Tabata exercises and timer
   - Strength Circuit programming
   - Circuit audio
   - Workout completion history
   - All existing button actions
   - Existing navigation
   - Coach Hub and client Profile

   NO DATABASE CHANGES
   NO TIMER REPLACEMENTS
   NO WORKOUT DATA CHANGES
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104997";
  const FLAG = "MANA_CIRCUITS_DESKTOP_104997";
  const STYLE = "manaCircuitsDesktopStyle104997";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const SHELL = "manaV83ProgramShell";
  const CONTENT = "manaV83Content";

  const $ = id => document.getElementById(id);

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* ===========================================
         DESKTOP CIRCUITS LAYOUT
         Applies to Mana Strength only
         =========================================== */

      @media (min-width: 900px) {

        /*
         Remove narrow page constraints
         when the program shell is open.
        */

        body:has(
          #${SHELL}.open
          #${CONTENT} .msc-root
        ) .wrap {
          width: 100% !important;
          max-width: 1280px !important;
        }

        #${SHELL}.open:has(
          #${CONTENT} .msc-root
        ) {
          width: 100% !important;
          max-width: 1200px !important;
          margin-left: auto !important;
          margin-right: auto !important;
          box-sizing: border-box !important;
        }

        /*
         Widen the header and circuit
         content together.
        */

        #${SHELL}.open:has(
          #${CONTENT} .msc-root
        ) .mana-v83-head {
          width: 100% !important;
          max-width: 1120px !important;
          margin-left: auto !important;
          margin-right: auto !important;
          box-sizing: border-box !important;
        }

        #${SHELL}.open #${CONTENT}:has(
          .msc-root
        ) {
          display: block !important;
          width: 100% !important;
          max-width: 1120px !important;
          margin: 0 auto !important;
          padding: 18px 26px 130px !important;
          box-sizing: border-box !important;
        }

        /*
         Main circuit layout.
        */

        #${CONTENT} .msc-root {
          display: grid !important;
          grid-template-columns: minmax(0,1fr) !important;
          gap: 20px !important;
          width: 100% !important;
          max-width: none !important;
          margin: 0 auto !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }

        /*
         Three circuit choices in one row.
        */

        #${CONTENT} .msc-choices {
          display: grid !important;
          grid-template-columns:
            repeat(3,minmax(0,1fr)) !important;
          align-items: stretch !important;
          gap: 16px !important;
          width: 100% !important;
          margin: 0 !important;
        }

        #${CONTENT} .msc-choice {
          width: 100% !important;
          min-width: 0 !important;
          min-height: 118px !important;
          height: 100% !important;

          padding: 20px 18px !important;

          background: #17191D !important;
          border: 1px solid #545D68 !important;
          border-radius: 17px !important;

          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-start !important;
          align-items: flex-start !important;

          text-align: left !important;
          box-sizing: border-box !important;

          transition:
            border-color .15s ease,
            background .15s ease !important;
        }

        #${CONTENT} .msc-choice.active {
          background: #29190F !important;
          border-color: #FF7927 !important;
        }

        #${CONTENT} .msc-choice:hover {
          border-color: #FF7927 !important;
        }

        #${CONTENT} .msc-choice strong {
          font-size: 18px !important;
          line-height: 1.3 !important;
          font-weight: 900 !important;
          margin-bottom: 10px !important;
          color: #FFFFFF !important;
        }

        #${CONTENT} .msc-choice small {
          font-size: 12px !important;
          line-height: 1.55 !important;
          color: #C1C6CE !important;
        }

        /*
         Wider detailed workout panel.
        */

        #${CONTENT} .msc-panel {
          width: 100% !important;
          max-width: none !important;
          min-width: 0 !important;

          background: #15171A !important;
          border: 1px solid #535C68 !important;
          border-radius: 20px !important;

          padding: 26px 30px !important;
          margin: 0 !important;

          box-sizing: border-box !important;
        }

        #${CONTENT} .msc-panel h3 {
          color: #FFFFFF !important;
          font-size: 24px !important;
          font-weight: 900 !important;
          margin: 8px 0 14px !important;
        }

        #${CONTENT} .msc-label {
          color: #FF7927 !important;
          font-size: 12px !important;
          font-weight: 900 !important;
          letter-spacing: .08em !important;
        }

        #${CONTENT} .msc-muted {
          color: #C1C6CE !important;
          font-size: 14px !important;
          line-height: 1.65 !important;
        }

        /*
         Duration buttons.
        */

        #${CONTENT} .msc-settings {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 12px !important;
          width: 100% !important;
          margin: 17px 0 !important;
        }

        #${CONTENT} .msc-setting {
          min-width: 102px !important;
          min-height: 46px !important;

          padding: 12px 19px !important;

          background: #101215 !important;
          border: 1px solid #58616B !important;
          border-radius: 12px !important;

          color: #FFFFFF !important;
          font-size: 14px !important;
          font-weight: 850 !important;

          box-sizing: border-box !important;
        }

        #${CONTENT}
        .msc-setting[aria-pressed="true"] {
          background: #29190F !important;
          color: #FF7927 !important;
          border-color: #FF7927 !important;
        }

        /*
         Exercise list takes full width.
        */

        #${CONTENT} .msc-list {
          display: grid !important;
          grid-template-columns: minmax(0,1fr) !important;
          gap: 11px !important;
          width: 100% !important;
          margin: 18px 0 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }

        #${CONTENT} .msc-list li {
          display: block !important;
          width: 100% !important;
          max-width: none !important;

          padding: 15px 18px !important;

          background: #0C0E11 !important;
          border: 1px solid #3B434D !important;
          border-radius: 12px !important;

          color: #FFFFFF !important;
          font-size: 14px !important;
          line-height: 1.55 !important;

          box-sizing: border-box !important;
        }

        /*
         Timer.
        */

        #${CONTENT} .msc-timer {
          width: 100% !important;
          max-width: none !important;
          padding: 25px 20px !important;

          background: #0C0E11 !important;
          border: 1px solid #FF7927 !important;
          border-radius: 19px !important;

          box-sizing: border-box !important;
        }

        #${CONTENT} .msc-clock {
          color: #FFFFFF !important;
          font-size: clamp(58px,6vw,78px) !important;
          line-height: 1.2 !important;
        }

        #${CONTENT} .msc-step {
          color: #FF7927 !important;
          font-size: 14px !important;
        }

        /*
         Timer actions.
        */

        #${CONTENT} .msc-actions {
          display: flex !important;
          justify-content: center !important;
          flex-wrap: wrap !important;
          gap: 12px !important;
          margin-top: 18px !important;
        }

        #${CONTENT} .msc-btn {
          min-height: 46px !important;
          min-width: 125px !important;
          padding: 12px 22px !important;
          border-radius: 12px !important;
          font-size: 14px !important;
        }

        /*
         Main heading.
        */

        #${CONTENT} .msc-root h2 {
          font-size: 34px !important;
          line-height: 1.2 !important;
        }

        #${CONTENT} .msc-kicker {
          font-size: 11px !important;
        }

        /*
         Comfortable bottom clearance.
        */

        #${CONTENT} .msc-root {
          padding-bottom: 35px !important;
        }
      }

      /* ===========================================
         TABLET
         =========================================== */

      @media (
        min-width: 601px
      ) and (
        max-width: 899px
      ) {

        #${SHELL}.open #${CONTENT}:has(
          .msc-root
        ) {
          width: 100% !important;
          max-width: 820px !important;
          margin: 0 auto !important;
          padding: 16px 18px 115px !important;
          box-sizing: border-box !important;
        }

        #${CONTENT} .msc-choices {
          gap: 10px !important;
        }

        #${CONTENT} .msc-choice {
          min-height: 106px !important;
          padding: 15px 12px !important;
        }

        #${CONTENT} .msc-panel {
          width: 100% !important;
          padding: 20px !important;
        }
      }

      /* ===========================================
         MOBILE — PRESERVE CURRENT LAYOUT
         =========================================== */

      @media (max-width: 600px) {

        #${CONTENT} .msc-root,
        #${CONTENT} .msc-panel,
        #${CONTENT} .msc-choices {
          box-sizing: border-box !important;
          max-width: 100% !important;
        }

        #${CONTENT} .msc-choice {
          min-width: 0 !important;
        }

      }

    `;

    document.head.appendChild(style);
  }

  function init() {
    installStyles();

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
