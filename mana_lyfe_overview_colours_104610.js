
/* ============================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — OVERVIEW COLOUR FINISH
   BUILD 104610

   COMPLETE JAVASCRIPT FILE

   FIXES:
   1. Four large Overview cards: white borders
   2. Small illustration frames: orange borders
   3. Top badge / yellow text: Mana orange

   PRESERVES:
   - Black Overview card backgrounds
   - Original white illustrations
   - Orange headings and links
   - Correct Support Chat styling
   - Runner and MANA LYFE header
   - Removed Profile button
   - White bottom tabs and green Reset
   - All functionality and saved data

   LOAD AFTER BUILD 104600
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104610";
  const STYLE_ID = "manaLyfeOverviewColours104610";

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const ROOT =
    "#manaV83ProgramShell.mana-lyfe-targeted-104600";

  const CONTENT = "#manaV83Content";

  const WHITE = "#FFFFFF";
  const ORANGE = "#FF7927";
  const SILVER = "#C1C6CE";

  function install() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `

      /* ======================================
         LARGE OVERVIEW CARD BORDERS — WHITE
         ====================================== */

      html body
      ${ROOT}
      ${CONTENT}
      .mana-v978-launchpad
      .mana-v978-grid
      > .mana-v978-launch {

        border: 1px solid ${WHITE} !important;
        border-color: ${WHITE} !important;

        background: #15171A !important;
        background-image: none !important;

        box-shadow: none !important;
        outline: none !important;
      }

      /* Preserve the small orange top accent. */

      html body
      ${ROOT}
      ${CONTENT}
      .mana-v978-grid
      > .mana-v978-launch::before {

        background: ${ORANGE} !important;
        background-image: none !important;
      }

      /* ======================================
         SMALL ILLUSTRATION BOXES — ORANGE
         ====================================== */

      html body
      ${ROOT}
      ${CONTENT}
      .mana-v978-grid
      .mana-v978-launch
      .mana-v978-icon {

        border: 1px solid ${ORANGE} !important;

        border-top-color: ${ORANGE} !important;
        border-right-color: ${ORANGE} !important;
        border-bottom-color: ${ORANGE} !important;
        border-left-color: ${ORANGE} !important;

        background: #0B0D10 !important;
        background-image: none !important;

        box-shadow: none !important;
      }

      /* Keep white illustration artwork intact. */

      html body
      ${ROOT}
      ${CONTENT}
      .mana-v978-icon img {

        opacity: 1 !important;
      }

      /* ======================================
         TOP BADGE — REMOVE OLD GOLD
         ====================================== */

      html body
      ${ROOT}
      ${CONTENT}
      #manaV1019ProgramBadge {

        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;

        border: 1px solid #59626C !important;

        background: #111317 !important;
        background-image: none !important;

        box-shadow: none !important;
      }

      /* ======================================
         TOP TEXT / KICKER — ORANGE
         ====================================== */

      html body
      ${ROOT}
      ${CONTENT}
      .mana-v978-kicker {

        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      /* ======================================
         CARD LABELS / ACTIONS — ORANGE
         ====================================== */

      html body
      ${ROOT}
      ${CONTENT}
      .mana-v978-grid
      .mana-v978-label,

      html body
      ${ROOT}
      ${CONTENT}
      .mana-v978-grid
      .mana-v978-arrow {

        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      /* ======================================
         KEEP MAIN TITLES WHITE
         ====================================== */

      html body
      ${ROOT}
      ${CONTENT}
      .mana-v978-grid
      .mana-v978-title {

        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      /* ======================================
         KEEP DESCRIPTIONS SILVER
         ====================================== */

      html body
      ${ROOT}
      ${CONTENT}
      .mana-v978-grid
      .mana-v978-text {

        color: ${SILVER} !important;
        -webkit-text-fill-color: ${SILVER} !important;
      }

    `;

    document.head.appendChild(style);

    console.log(
      "[ManaLyfe] Overview colours ready — " + BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      install,
      { once: true }
    );
  } else {
    install();
  }

})();
