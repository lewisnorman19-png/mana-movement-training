
/* ============================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — OVERVIEW MOBILE REFINEMENT
   BUILD 104623

   COMPLETE FILE REPLACEMENT

   FILE:
   mana_lyfe_border_fix_104620.js

   FIXES:
   ------------------------------------------------------------
   1. Large Overview cards: clean white borders
   2. Small illustration frames: orange borders
   3. Remove decorative orange lines across card tops
   4. Keep original title sizes
   5. Keep original illustration sizes
   6. Make small orange labels more compact on mobile
   7. Give silver descriptions the full card width
   8. Keep two cards side by side on phones

   PRESERVES:
   ------------------------------------------------------------
   - Existing titles and typography
   - Original illustrations
   - Support Chat styling
   - Green Reset navigation
   - White navigation icons
   - Routine and Reset functionality
   - Mana Strength and Mana28
   - All saved data

   LOAD USING VERSION 104623
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104623";

  const STYLE_ID =
    "manaLyfeOverviewMobile104623";

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const SHELL =
    "#manaV83ProgramShell.mana-lyfe-premium-104580";

  const CONTENT = "#manaV83Content";

  const WHITE = "#FFFFFF";
  const ORANGE = "#FF7927";
  const SILVER = "#C1C6CE";
  const CARD_BG = "#15171A";

  /* ============================================================
     INSTALL STYLES
     ============================================================ */

  function installStyles() {

    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `

      /* ======================================
         LARGE OVERVIEW CARDS
         ====================================== */

      html body
      ${SHELL}
      ${CONTENT}
      .mana-v978-grid
      .mana-v978-launch {

        border: 1.5px solid ${WHITE} !important;

        border-color: ${WHITE} !important;

        background: ${CARD_BG} !important;
        background-image: none !important;

        box-shadow: none !important;
      }

      /* Remove orange top stripes */

      html body
      ${SHELL}
      ${CONTENT}
      .mana-v978-grid
      .mana-v978-launch::before {

        display: none !important;
        content: none !important;

        background: none !important;
        background-image: none !important;
      }

      /* ======================================
         SMALL ILLUSTRATION FRAMES
         ====================================== */

      html body
      ${SHELL}
      ${CONTENT}
      .mana-v978-grid
      .mana-v978-launch
      .mana-v978-icon {

        border: 1.5px solid ${ORANGE} !important;

        border-color: ${ORANGE} !important;

        background: #0B0D10 !important;
        background-image: none !important;

        box-shadow: none !important;
      }

      /* Keep the original illustration artwork
         and its existing dimensions unchanged. */

      /* ======================================
         EXISTING COPY
         ====================================== */

      html body
      ${SHELL}
      ${CONTENT}
      .mana-v978-grid
      .mana-v978-copy {

        min-width: 0 !important;
      }

      html body
      ${SHELL}
      ${CONTENT}
      .mana-v978-grid
      .mana-v978-text {

        color: ${SILVER} !important;

        -webkit-text-fill-color:
          ${SILVER} !important;

        white-space: normal !important;
        overflow-wrap: break-word !important;
      }

      /* ======================================
         PHONE LAYOUT
         ====================================== */

      @media (max-width: 700px) {

        /* Keep two cards side by side */

        html body
        ${SHELL}
        ${CONTENT}
        .mana-v978-grid {

          display: grid !important;

          grid-template-columns:
            repeat(2, minmax(0, 1fr)) !important;

          gap: 10px !important;
        }

        /* Stack artwork above the text */

        html body
        ${SHELL}
        ${CONTENT}
        .mana-v978-grid
        .mana-v978-launch {

          display: flex !important;

          flex-direction: column !important;

          align-items: flex-start !important;

          justify-content: flex-start !important;

          gap: 10px !important;

          min-width: 0 !important;

          padding: 13px 11px !important;

          text-align: left !important;
        }

        /* Keep the existing illustration size.
           Only prevent it from shrinking. */

        html body
        ${SHELL}
        ${CONTENT}
        .mana-v978-grid
        .mana-v978-icon {

          flex-shrink: 0 !important;

          align-self: flex-start !important;
        }

        /* Full-width copy container */

        html body
        ${SHELL}
        ${CONTENT}
        .mana-v978-grid
        .mana-v978-copy {

          display: flex !important;

          flex-direction: column !important;

          align-items: flex-start !important;

          width: 100% !important;

          max-width: 100% !important;

          min-width: 0 !important;

          flex: 1 1 auto !important;
        }

        /* Compact orange category labels */

        html body
        ${SHELL}
        ${CONTENT}
        .mana-v978-grid
        .mana-v978-label {

          font-size: 9px !important;

          line-height: 1.25 !important;

          letter-spacing: .04em !important;

          overflow-wrap: break-word !important;
        }

        /* IMPORTANT:
           No font-size, weight or line-height
           changes to .mana-v978-title.

           The approved title styling is retained.
        */

        html body
        ${SHELL}
        ${CONTENT}
        .mana-v978-grid
        .mana-v978-title {

          max-width: 100% !important;

          white-space: normal !important;

          overflow-wrap: break-word !important;
        }

        /* Silver description uses full card width */

        html body
        ${SHELL}
        ${CONTENT}
        .mana-v978-grid
        .mana-v978-text {

          display: block !important;

          width: 100% !important;

          max-width: 100% !important;

          min-width: 0 !important;

          margin-top: 9px !important;

          white-space: normal !important;

          overflow-wrap: break-word !important;
        }

        /* Orange action links */

        html body
        ${SHELL}
        ${CONTENT}
        .mana-v978-grid
        .mana-v978-arrow {

          max-width: 100% !important;

          white-space: normal !important;

          overflow-wrap: break-word !important;
        }

      }

      /* ======================================
         SMALL PHONES
         ====================================== */

      @media (max-width: 380px) {

        html body
        ${SHELL}
        ${CONTENT}
        .mana-v978-grid {

          gap: 8px !important;
        }

        html body
        ${SHELL}
        ${CONTENT}
        .mana-v978-grid
        .mana-v978-launch {

          padding: 11px 9px !important;
        }

        /* Titles and illustrations remain
           at their approved sizes. */

      }

      /* ======================================
         KEYBOARD ACCESSIBILITY
         ====================================== */

      html body
      ${SHELL}
      ${CONTENT}
      .mana-v978-grid
      .mana-v978-launch:focus-visible {

        outline: 2px solid ${ORANGE} !important;

        outline-offset: 3px !important;
      }

    `;

    document.head.appendChild(style);

    console.log(
      "[ManaLyfe] Overview mobile refinement — " +
      BUILD
    );
  }

  /* ============================================================
     INITIALISE
     ============================================================ */

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      installStyles,
      { once: true }
    );

  } else {

    installStyles();

  }

})();
