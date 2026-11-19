
/* ============================================================
   MANA MOVEMENT — MOBILE HOME ALIGNMENT
   BUILD 105039
   Complete replacement: mana_home_mobile_finish_105031.js
   CSS ONLY: does not move or recreate content or change clicks.
   ============================================================ */
(() => {
  'use strict';
  const BUILD = '105039';
  const ID = 'mana-home-css-105039';
  if (document.getElementById(ID)) return;

  const css = `
    @media (max-width: 600px) {
      /* Keep the approved banner width, size and outside gaps. */
      html body #manaV80Home {
        width: calc(100vw - 12px) !important;
        max-width: calc(100vw - 12px) !important;
        min-width: 0 !important;
        margin-left: calc(50% - 50vw + 6px) !important;
        margin-right: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        box-sizing: border-box !important;
      }
      html body #manaV80Home .mana-v8013-select {
        margin-bottom: 34px !important;
      }
      html body #manaV80Home button#manaV80Mana28,
      html body #manaV80Home button#manaV80Strength,
      html body #manaV80Home button#manaV80Life {
        position: relative !important;
        display: block !important;
        isolation: isolate !important;
        width: 100% !important;
        max-width: 100% !important;
        height: 290px !important;
        min-height: 290px !important;
        max-height: 290px !important;
        margin: 0 0 34px !important;
        padding: 20px 18px 16px !important;
        border: 1px solid #FF7927 !important;
        border-radius: 19px !important;
        background: linear-gradient(135deg, #191B20, #101215 72%, #1B130E) !important;
        overflow: hidden !important;
        text-align: left !important;
        box-sizing: border-box !important;
      }

      /* Orange program name remains at the upper-left. */
      html body #manaV80Home button.mana-v8013-program > .mana-v8013-program-label {
        display: block !important;
        position: absolute !important;
        top: 19px !important;
        left: 18px !important;
        right: auto !important;
        width: calc(100% - 116px) !important;
        max-width: calc(100% - 116px) !important;
        margin: 0 !important;
        padding: 0 !important;
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
        font-size: 21px !important;
        font-weight: 950 !important;
        line-height: 1.15 !important;
        letter-spacing: 0 !important;
        text-transform: uppercase !important;
        z-index: 6 !important;
      }

      /* The icon occupies the top-right ONLY, and is always orange. */
      html body #manaV80Home button.mana-v8013-program > .m1025-home-icon,
      html body #manaV80Home button.mana-v8013-program > .mana-v1024-home-art {
        display: flex !important;
        position: absolute !important;
        top: 18px !important;
        right: 16px !important;
        bottom: auto !important;
        left: auto !important;
        width: 62px !important;
        height: 62px !important;
        padding: 7px !important;
        align-items: center !important;
        justify-content: center !important;
        transform: none !important;
        color: #FF7927 !important;
        border: 1px solid #FF7927 !important;
        border-radius: 16px !important;
        background: #231B16 !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: none !important;
        box-sizing: border-box !important;
        z-index: 7 !important;
      }
      html body #manaV80Home button.mana-v8013-program > .m1025-home-icon svg,
      html body #manaV80Home button.mana-v8013-program > .mana-v1024-home-art svg {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        /* Converts even hard-coded green/blue/yellow SVG colours to orange. */
        filter: brightness(0) saturate(100%) invert(55%) sepia(87%) saturate(1957%) hue-rotate(342deg) brightness(103%) contrast(103%) !important;
      }

      /* WHITE title is below the icon, with its FULL width available. */
      html body #manaV80Home button.mana-v8013-program > h2 {
        display: block !important;
        position: absolute !important;
        top: 94px !important;
        left: 18px !important;
        right: 18px !important;
        bottom: auto !important;
        width: calc(100% - 36px) !important;
        max-width: calc(100% - 36px) !important;
        margin: 0 !important;
        padding: 0 !important;
        font-size: 25px !important;
        line-height: 1.1 !important;
        font-weight: 950 !important;
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
        text-align: left !important;
        white-space: normal !important;
        z-index: 5 !important;
      }

      /* SILVER description has its own line below the white title. */
      html body #manaV80Home button.mana-v8013-program > p {
        display: block !important;
        position: absolute !important;
        top: 162px !important;
        left: 18px !important;
        right: 18px !important;
        bottom: auto !important;
        width: calc(100% - 36px) !important;
        max-width: calc(100% - 36px) !important;
        margin: 0 !important;
        padding: 0 !important;
        color: #C4CAD2 !important;
        -webkit-text-fill-color: #C4CAD2 !important;
        font-size: 12.5px !important;
        line-height: 1.4 !important;
        font-weight: 400 !important;
        text-align: left !important;
        z-index: 5 !important;
      }

      /* Remove the multiple old offer/price notes; one simple footer remains. */
      html body #manaV80Home button.mana-v8013-program .mana-v8013-free-note,
      html body #manaV80Home button.mana-v8013-program .m1027-home-support,
      html body #manaV80Home button.mana-v8013-program .mana-v8013-price,
      html body #manaV80Home button.mana-v8013-program .mana-v8013-current-badge,
      html body #manaV80Home button.mana-v8013-program .mana-v8013-badge {
        display: none !important;
      }
      html body #manaV80Home button.mana-v8013-program .mana-v8013-open {
        display: block !important;
        position: absolute !important;
        top: auto !important;
        left: auto !important;
        right: 18px !important;
        bottom: 16px !important;
        width: auto !important;
        max-width: 50% !important;
        margin: 0 !important;
        padding: 0 !important;
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
        font-size: 12px !important;
        font-weight: 900 !important;
        text-align: right !important;
        z-index: 6 !important;
      }
      html body #manaV80Home button.mana-v8013-program::after {
        content: '' !important;
        display: block !important;
        position: absolute !important;
        left: 18px !important;
        right: 18px !important;
        bottom: 46px !important;
        height: 1px !important;
        background: rgba(255,255,255,.12) !important;
        pointer-events: none !important;
      }
      html body #manaV80Home #manaV80Mana28::before { content: none !important; }
      html body #manaV80Home #manaV80Strength::before,
      html body #manaV80Home #manaV80Life::before {
        position: absolute !important;
        display: block !important;
        left: 18px !important;
        bottom: 15px !important;
        max-width: 45% !important;
        margin: 0 !important;
        color: #D1D5DB !important;
        font-size: 12px !important;
        font-weight: 750 !important;
        line-height: 1.25 !important;
        z-index: 6 !important;
        pointer-events: none !important;
      }
      html body #manaV80Home #manaV80Strength::before {
        content: '$39.99 AUD / month' !important;
      }
      html body #manaV80Home #manaV80Life::before {
        content: 'Included with paid membership' !important;
      }
      html body #manaV80Home #manaV80Life { margin-bottom: 38px !important; }
    }

    @media(max-width:360px) {
      html body #manaV80Home button#manaV80Mana28,
      html body #manaV80Home button#manaV80Strength,
      html body #manaV80Home button#manaV80Life {
        height: 312px !important;
        min-height: 312px !important;
        max-height: 312px !important;
      }
      html body #manaV80Home button.mana-v8013-program > h2 {
        font-size: 23px !important;
      }
      html body #manaV80Home button.mana-v8013-program > p {
        font-size: 12px !important;
        top: 166px !important;
      }
    }
  `;

  function install() {
    let el = document.getElementById(ID);
    if (!el) {
      el = document.createElement('style');
      el.id = ID;
      document.head.appendChild(el);
    }
    el.textContent = css;
    window.MANA_HOME_MOBILE_BUILD = BUILD;
    console.log('[Mana Movement] Mobile Home CSS', BUILD);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();
