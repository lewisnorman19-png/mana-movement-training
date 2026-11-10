
/* ============================================================
   MANA MOVEMENT TRAINING
   MANA28 PROGRESS ICON FIX
   BUILD 104560

   COMPLETE JAVASCRIPT FILE

   FIX:
   - Add icons using CSS rather than inserting elements
   - Workouts: white dumbbell
   - Water: white water droplet
   - Recovery: white moon
   - Calories: white flame
   - Protein: white dumbbell
   - Orange icon borders
   - Retain all orange progress bars

   IMPORTANT:
   - No Progress card HTML is replaced
   - No changes to calculations
   - No changes to saved data
   - No changes to navigation
   - No changes to Mana Strength or ManaLyfe

   LOAD AFTER BUILD 104550
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104560";
  const STYLE_ID = "mana28ProgressIconsCSS104560";

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const ORANGE = "#FF7927";
  const WHITE = "#FFFFFF";

  /* ============================================================
     EXACT FUEL ICON SHAPES
     ============================================================ */

  const SHAPES = {

    workouts: `
      <rect x="17" y="20" width="14"
            height="8" rx="3"/>
      <rect x="9" y="14" width="6"
            height="20" rx="2"/>
      <rect x="33" y="14" width="6"
            height="20" rx="2"/>
      <rect x="4" y="18" width="4"
            height="12" rx="2"/>
      <rect x="40" y="18" width="4"
            height="12" rx="2"/>
    `,

    water: `
      <path d="
        M24 4
        S10 20 10 30
        a14 14 0 0 0 28 0
        C38 20 24 4 24 4Z
      "/>
    `,

    recovery: `
      <path d="
        M34 35
        A16 16 0 0 1 19 9
        a17 17 0 1 0 15 26Z
      "/>
    `,

    calories: `
      <path d="
        M27 3
        c2 8-5 10-2 17
        2 4 6 4 7 9
        1 6-3 12-9 13
        -8 2-16-4-16-13
        0-8 6-12 11-18
        0 6 3 8 5 9
        -1-8 5-11 4-17Z
      "/>
    `,

    protein: `
      <rect x="17" y="20" width="14"
            height="8" rx="3"/>
      <rect x="9" y="14" width="6"
            height="20" rx="2"/>
      <rect x="33" y="14" width="6"
            height="20" rx="2"/>
      <rect x="4" y="18" width="4"
            height="12" rx="2"/>
      <rect x="40" y="18" width="4"
            height="12" rx="2"/>
    `
  };

  /* ============================================================
     TURN SVG ARTWORK INTO CSS BACKGROUND IMAGES
     ============================================================ */

  function iconURL(shape) {

    const svg = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        fill="#FFFFFF"
      >
        ${shape}
      </svg>
    `;

    return (
      "data:image/svg+xml," +
      encodeURIComponent(svg)
    );
  }

  /* ============================================================
     IDENTIFY EXISTING CARD POSITIONS

     Original Mana28 Progress renderer:
     1. Workouts
     2. Water
     3. Recovery
     4. Calories
     5. Protein

     These are existing cards, not new cards.
     ============================================================ */

  const CARD_ICONS = [
    "workouts",
    "water",
    "recovery",
    "calories",
    "protein"
  ];

  /* ============================================================
     MAIN CSS — NO DOM MODIFICATIONS REQUIRED
     ============================================================ */

  function buildCSS() {

    const root = `
      html body
      #manaV83ProgramShell
      #manaV83Content
      .mana-v981-root
    `;

    let css = `

      /* ==========================================
         EXISTING MANA28 PROGRESS CARDS
         ========================================== */

      ${root}
      .mana-v981-card-head {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-start !important;
        gap: 10px !important;
      }

      /* Older placeholder icons are intentionally
         hidden by previous visual updates. */

      ${root}
      .mana-v981-card-head
      > .mana-v981-icon {
        display: none !important;
      }

      /* Hide earlier injected icons, if present.
         The new icons use only CSS. */

      ${root}
      .mana28-progress-icon-104530,

      ${root}
      .mana-progress-icon-104550 {
        display: none !important;
      }

      /* ==========================================
         WHITE ARTWORK / ORANGE FRAMES
         ========================================== */

      ${root}
      .mana-v981-grid
      > .mana-v981-card
      .mana-v981-card-head::before {

        content: "" !important;

        box-sizing: border-box !important;

        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;

        width: 39px !important;
        height: 39px !important;

        min-width: 39px !important;
        min-height: 39px !important;

        flex: 0 0 39px !important;

        border: 1px solid ${ORANGE} !important;
        border-radius: 12px !important;

        background-color: #101216 !important;

        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: 25px 25px !important;

        box-shadow: none !important;
      }

      /* ==========================================
         LABELS
         ========================================== */

      ${root}
      .mana-v981-card
      .mana-v981-label {

        color: #C1C6CE !important;
        -webkit-text-fill-color: #C1C6CE !important;

        font-size: 10px !important;
        font-weight: 850 !important;

        letter-spacing: .1em !important;
      }

      /* ==========================================
         KEEP ALL PROGRESS BARS ORANGE
         ========================================== */

      ${root}
      .mana-v981-bar > span,

      ${root}
      .mana-v981-overall-bar > span {

        background: ${ORANGE} !important;
        background-image: none !important;
        box-shadow: none !important;
      }

      /* ==========================================
         MOBILE
         ========================================== */

      @media (max-width: 600px) {

        ${root}
        .mana-v981-grid
        > .mana-v981-card
        .mana-v981-card-head::before {

          width: 35px !important;
          height: 35px !important;

          min-width: 35px !important;
          min-height: 35px !important;

          flex-basis: 35px !important;

          background-size: 23px 23px !important;
        }
      }

    `;

    /* ==========================================================
       ASSIGN THE CORRECT FUEL ARTWORK TO EACH EXISTING CARD
       ========================================================== */

    CARD_ICONS.forEach((type, index) => {

      const position = index + 1;
      const image = iconURL(SHAPES[type]);

      css += `

        ${root}
        .mana-v981-grid
        > .mana-v981-card:nth-child(${position})
        .mana-v981-card-head::before {

          background-image:
            url("${image}") !important;

        }

      `;

    });

    return css;
  }

  /* ============================================================
     INSTALL THE STYLE ONCE
     ============================================================ */

  function install() {

    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");

    style.id = STYLE_ID;
    style.textContent = buildCSS();

    document.head.appendChild(style);

    window.MANA28_PROGRESS_ICONS_CSS_BUILD = BUILD;

    console.log(
      "[Mana28] CSS Progress icons installed — " +
      BUILD
    );
  }

  /* ============================================================
     START
     ============================================================ */

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
