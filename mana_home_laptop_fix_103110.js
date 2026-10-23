/* ==========================================
   MANA MOVEMENT TRAINING
   HOME LAPTOP LAYOUT FIX
   BUILD 103110

   PURPOSE
   - Fix Home page layout on laptop
   - Keep phone layout unchanged
   - Keep current card styling
   - Reduce oversized headings on laptop
   - Use proper desktop grid for
     Mana Strength / Mana Lyfe / Mana 28
   ========================================== */

(() => {
  "use strict";

  const BUILD = "103110";
  const STYLE_ID = "mana-home-laptop-fix-103110";

  if (window.MANA_HOME_LAPTOP_FIX === BUILD) return;

  const CSS = `

    /* =====================================
       LAPTOP / DESKTOP ONLY
       ===================================== */

    @media (min-width: 901px) {

      /* Main home shell */
      #manaV80Home,
      .mana-v8013-home,
      .mana-v8013-wrap,
      .mana-v8013-root {
        width: 100% !important;
        max-width: 1240px !important;
        margin-left: auto !important;
        margin-right: auto !important;
        padding-left: 28px !important;
        padding-right: 28px !important;
        box-sizing: border-box !important;
      }

      /* Card grid */
      #manaV80Home .mana-v8013-grid,
      #manaV80Home .mana-v8013-program-grid,
      #manaV80Home .mana-v8013-cards,
      #manaV80Home [data-home-program-grid] {
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 22px !important;
        align-items: stretch !important;
        width: 100% !important;
        max-width: 100% !important;
      }

      /* Fallback if cards sit directly in container */
      #manaV80Home .mana-v8013-programs {
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 22px !important;
        width: 100% !important;
      }

      /* Individual cards */
      #manaV80Home .mana-v8013-program {
        width: 100% !important;
        max-width: none !important;
        min-width: 0 !important;
        min-height: 420px !important;
        height: 100% !important;
        box-sizing: border-box !important;
        padding: 26px 26px 24px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        overflow: hidden !important;
      }

      /* Card top row tidy */
      #manaV80Home .mana-v8013-program-top,
      #manaV80Home .mana-v8013-program-head {
        display: block !important;
        width: 100% !important;
      }

      /* Kicker / mini label */
      #manaV80Home .mana-v8013-program-label,
      #manaV80Home .mana-v8013-kicker,
      #manaV80Home .mana-v8013-program-kicker {
        font-size: 11px !important;
        line-height: 1.3 !important;
        letter-spacing: .08em !important;
        margin-bottom: 6px !important;
      }

      /* Main heading */
      #manaV80Home .mana-v8013-program h2 {
        font-size: 22px !important;
        line-height: 1.05 !important;
        letter-spacing: -.03em !important;
        margin: 0 0 10px !important;
        max-width: 100% !important;
        overflow-wrap: break-word !important;
      }

      /* Main big marketing line */
      #manaV80Home .mana-v8013-program-title,
      #manaV80Home .mana-v8013-program h3,
      #manaV80Home .mana-v8013-main-title {
        font-size: 26px !important;
        line-height: 1.08 !important;
        letter-spacing: -.035em !important;
        margin: 0 0 10px !important;
        overflow-wrap: break-word !important;
      }

      /* Description */
      #manaV80Home .mana-v8013-program p,
      #manaV80Home .mana-v8013-copy,
      #manaV80Home .mana-v8013-program-copy {
        font-size: 15px !important;
        line-height: 1.55 !important;
        margin: 0 !important;
      }

      /* Price row */
      #manaV80Home .mana-v8013-price,
      #manaV80Home .mana-v8013-program-price {
        font-size: 18px !important;
        line-height: 1.2 !important;
        margin-top: 10px !important;
        margin-bottom: 10px !important;
      }

      /* Coloured icon box */
      #manaV80Home .mana-v8013-icon,
      #manaV80Home .mana-v8013-program-icon {
        width: 92px !important;
        height: 92px !important;
        flex: 0 0 92px !important;
        margin-left: auto !important;
      }

      #manaV80Home .mana-v8013-icon svg,
      #manaV80Home .mana-v8013-program-icon svg,
      #manaV80Home .mana-v8013-icon img,
      #manaV80Home .mana-v8013-program-icon img {
        width: 44px !important;
        height: 44px !important;
      }

      /* Selected tick */
      #manaV80Home .mana-v8013-program.current::after,
      #manaV80Home [data-program].current::after {
        top: 12px !important;
        right: 12px !important;
        width: 26px !important;
        height: 26px !important;
        font-size: 16px !important;
      }

      /* Make bottom section tidy */
      #manaV80Home .mana-v8013-program-footer,
      #manaV80Home .mana-v8013-meta,
      #manaV80Home .mana-v8013-tags {
        margin-top: auto !important;
      }

      /* Stop content clipping */
      #manaV80Home .mana-v8013-program * {
        min-width: 0 !important;
      }

      /* If the home cards are inside a generic vertical stack,
         stop them from behaving like a phone column */
      #manaV80Home .mana-v8013-stack,
      #manaV80Home .mana-v8013-list {
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 22px !important;
      }

    }

    /* =====================================
       TABLET
       ===================================== */

    @media (min-width: 701px) and (max-width: 900px) {

      #manaV80Home,
      .mana-v8013-home,
      .mana-v8013-wrap,
      .mana-v8013-root {
        max-width: 980px !important;
        padding-left: 22px !important;
        padding-right: 22px !important;
      }

      #manaV80Home .mana-v8013-grid,
      #manaV80Home .mana-v8013-program-grid,
      #manaV80Home .mana-v8013-cards,
      #manaV80Home .mana-v8013-programs,
      #manaV80Home .mana-v8013-stack,
      #manaV80Home .mana-v8013-list,
      #manaV80Home [data-home-program-grid] {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 18px !important;
      }

      #manaV80Home .mana-v8013-program {
        min-height: 390px !important;
        padding: 24px !important;
      }

      #manaV80Home .mana-v8013-program h2 {
        font-size: 24px !important;
      }

      #manaV80Home .mana-v8013-program-title,
      #manaV80Home .mana-v8013-program h3,
      #manaV80Home .mana-v8013-main-title {
        font-size: 28px !important;
      }

    }

    /* =====================================
       PHONE
       Leave untouched
       ===================================== */

  `;

  function init() {
    let style = document.getElementById(STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    if (style.textContent !== CSS) {
      style.textContent = CSS;
    }

    window.MANA_HOME_LAPTOP_FIX = BUILD;

    console.log("MANA HOME LAPTOP FIX", BUILD);
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
