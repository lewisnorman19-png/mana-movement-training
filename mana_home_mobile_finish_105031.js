
/* ============================================================
   MANA MOVEMENT — MOBILE HOME FINISH
   BUILD 105041

   COMPLETE FILE REPLACEMENT:
   mana_home_mobile_finish_105031.js

   ONLY NEW CHANGE:
   ManaLyfe heading is displayed in
   three separate block-level lines:

   Reset.
   Rebuild.
   Move Forward.

   PRESERVES BUILD 105040:
   - Banner sizes and spacing
   - Mana28 orange icon
   - Mana Strength silver icon
   - ManaLyfe white icon
   - Single Strength price
   - Original Home navigation
   - Desktop layout
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "105041";
  const ID = "mana-home-css-105041";

  if (document.getElementById(ID)) return;

  const css = `

    @media (max-width:600px) {

      /* HOME WIDTH */

      html body #manaV80Home {
        width: calc(100vw - 12px) !important;
        max-width: calc(100vw - 12px) !important;
        min-width: 0 !important;
        margin-left:
          calc(50% - 50vw + 6px) !important;
        margin-right: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        box-sizing: border-box !important;
      }

      html body #manaV80Home
      .mana-v8013-select {
        margin-bottom: 34px !important;
      }

      /* THREE ORIGINAL PROGRAM BANNERS */

      html body #manaV80Home
      button#manaV80Mana28,
      html body #manaV80Home
      button#manaV80Strength,
      html body #manaV80Home
      button#manaV80Life {
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

        background:
          linear-gradient(
            135deg,
            #191B20,
            #101215 72%,
            #1B130E
          ) !important;

        color: #FFFFFF !important;
        text-align: left !important;
        overflow: hidden !important;
        box-sizing: border-box !important;

        box-shadow:
          0 8px 22px rgba(0,0,0,.20)
          !important;
      }

      /* ORANGE PROGRAM HEADINGS */

      html body #manaV80Home
      button.mana-v8013-program
      > .mana-v8013-program-label {
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
        -webkit-text-fill-color:
          #FF7927 !important;

        font-size: 21px !important;
        font-weight: 950 !important;
        line-height: 1.15 !important;
        letter-spacing: 0 !important;
        text-transform: uppercase !important;
        z-index: 6 !important;
      }

      /* EXISTING ICON POSITIONS */

      html body #manaV80Home
      button.mana-v8013-program
      > .m1025-home-icon,
      html body #manaV80Home
      button.mana-v8013-program
      > .mana-v1024-home-art {
        display: flex !important;
        position: absolute !important;

        top: 18px !important;
        right: 16px !important;
        bottom: auto !important;
        left: auto !important;

        width: 62px !important;
        height: 62px !important;
        padding: 7px !important;
        margin: 0 !important;

        align-items: center !important;
        justify-content: center !important;

        transform: none !important;

        border: 1px solid currentColor !important;
        border-radius: 16px !important;
        background: #231B16 !important;

        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: none !important;

        box-sizing: border-box !important;
        z-index: 7 !important;
      }

      html body #manaV80Home
      button.mana-v8013-program
      > .m1025-home-icon svg,
      html body #manaV80Home
      button.mana-v8013-program
      > .mana-v1024-home-art svg {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
      }

      /* MANA28 ICON — ORANGE */

      html body #manaV80Home
      #manaV80Mana28 > .m1025-home-icon,
      html body #manaV80Home
      #manaV80Mana28 > .mana-v1024-home-art {
        color: #FF7927 !important;
        border-color: #FF7927 !important;
      }

      html body #manaV80Home
      #manaV80Mana28 > .m1025-home-icon svg,
      html body #manaV80Home
      #manaV80Mana28 > .mana-v1024-home-art svg {
        filter:
          brightness(0)
          saturate(100%)
          invert(55%)
          sepia(87%)
          saturate(1957%)
          hue-rotate(342deg)
          brightness(103%)
          contrast(103%)
          !important;
      }

      /* MANA STRENGTH ICON — SILVER */

      html body #manaV80Home
      #manaV80Strength > .m1025-home-icon,
      html body #manaV80Home
      #manaV80Strength > .mana-v1024-home-art {
        color: #C0C6CF !important;
        border-color: #C0C6CF !important;
      }

      html body #manaV80Home
      #manaV80Strength > .m1025-home-icon svg,
      html body #manaV80Home
      #manaV80Strength > .mana-v1024-home-art svg {
        filter:
          brightness(0)
          saturate(100%)
          invert(86%)
          sepia(8%)
          saturate(240%)
          hue-rotate(177deg)
          brightness(92%)
          contrast(91%)
          !important;
      }

      /* MANA LYFE ICON — WHITE */

      html body #manaV80Home
      #manaV80Life > .m1025-home-icon,
      html body #manaV80Home
      #manaV80Life > .mana-v1024-home-art {
        color: #FFFFFF !important;
        border-color: #FFFFFF !important;
      }

      html body #manaV80Home
      #manaV80Life > .m1025-home-icon svg,
      html body #manaV80Home
      #manaV80Life > .mana-v1024-home-art svg {
        filter:
          brightness(0)
          invert(1)
          !important;
      }

      /* WHITE HEADINGS */

      html body #manaV80Home
      button.mana-v8013-program > h2 {
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
        -webkit-text-fill-color:
          #FFFFFF !important;

        text-align: left !important;
        white-space: normal !important;
        z-index: 5 !important;
      }

      /* =====================================
         MANA LYFE — THREE SEPARATE LINES

         Each phrase has its own span.
         display:block forces a new line.
         ===================================== */

      html body #manaV80Home
      #manaV80Life > h2 {
        top: 91px !important;
        font-size: 22px !important;
        line-height: 1.08 !important;

        width: calc(100% - 36px) !important;
        max-width: calc(100% - 36px) !important;

        white-space: normal !important;
        text-align: left !important;
      }

      html body #manaV80Home
      #manaV80Life > h2
      .mana-lyfe-line-105041 {
        display: block !important;
        width: 100% !important;

        margin: 0 !important;
        padding: 0 !important;

        color: #FFFFFF !important;
        -webkit-text-fill-color:
          #FFFFFF !important;

        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;

        white-space: nowrap !important;
        text-align: left !important;
      }

      /* SILVER DESCRIPTION */

      html body #manaV80Home
      button.mana-v8013-program > p {
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
        -webkit-text-fill-color:
          #C4CAD2 !important;

        font-size: 12.5px !important;
        line-height: 1.4 !important;
        font-weight: 400 !important;

        text-align: left !important;
        z-index: 5 !important;
      }

      /* LYFE DESCRIPTION BELOW THREE LINES */

      html body #manaV80Home
      #manaV80Life > p {
        top: 179px !important;
        font-size: 12px !important;
        line-height: 1.35 !important;
      }

      /* HIDE OLD DUPLICATES */

      html body #manaV80Home
      button.mana-v8013-program .mana-v8013-free-note,
      html body #manaV80Home
      button.mana-v8013-program .m1027-home-support,
      html body #manaV80Home
      button.mana-v8013-program .mana-v8013-current-badge,
      html body #manaV80Home
      button.mana-v8013-program .mana-v8013-badge {
        display: none !important;
      }

      /* ONE STRENGTH PRICE */

      html body #manaV80Home
      #manaV80Strength::before {
        content: none !important;
        display: none !important;
      }

      html body #manaV80Home
      #manaV80Strength .mana-v8013-price {
        display: flex !important;
        position: absolute !important;

        left: 18px !important;
        bottom: 15px !important;
        right: auto !important;
        top: auto !important;

        align-items: baseline !important;
        flex-wrap: wrap !important;
        gap: 3px !important;

        margin: 0 !important;
        padding: 0 !important;

        width: 46% !important;
        max-width: 46% !important;
        z-index: 6 !important;
      }

      html body #manaV80Home
      #manaV80Strength .mana-v8013-price strong {
        color: #D1D5DB !important;
        -webkit-text-fill-color:
          #D1D5DB !important;

        font-size: 13px !important;
        font-weight: 750 !important;
        line-height: 1.2 !important;
      }

      html body #manaV80Home
      #manaV80Strength .mana-v8013-price span {
        color: #D1D5DB !important;
        -webkit-text-fill-color:
          #D1D5DB !important;

        font-size: 11px !important;
        font-weight: 650 !important;
        line-height: 1.2 !important;
        margin: 0 !important;
      }

      /* EXPLORE — BOTTOM RIGHT */

      html body #manaV80Home
      button.mana-v8013-program .mana-v8013-open {
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
        -webkit-text-fill-color:
          #FF7927 !important;

        font-size: 12px !important;
        font-weight: 900 !important;
        text-align: right !important;
        z-index: 6 !important;
      }

      /* FOOTER RULE */

      html body #manaV80Home
      button.mana-v8013-program::after {
        content: "" !important;
        display: block !important;
        position: absolute !important;

        left: 18px !important;
        right: 18px !important;
        bottom: 46px !important;

        height: 1px !important;
        background:
          rgba(255,255,255,.12) !important;

        pointer-events: none !important;
      }

      /* MANA28 — NO FREE LABEL */

      html body #manaV80Home
      #manaV80Mana28::before {
        content: none !important;
        display: none !important;
      }

      /* LYFE MEMBERSHIP NOTE */

      html body #manaV80Home
      #manaV80Life::before {
        content:
          "Included with paid membership"
          !important;

        display: block !important;
        position: absolute !important;

        left: 18px !important;
        bottom: 15px !important;
        top: auto !important;

        max-width: 45% !important;
        margin: 0 !important;
        padding: 0 !important;

        color: #D1D5DB !important;
        font-size: 12px !important;
        font-weight: 750 !important;
        line-height: 1.25 !important;

        z-index: 6 !important;
        pointer-events: none !important;
      }

      html body #manaV80Home
      #manaV80Life {
        margin-bottom: 38px !important;
      }
    }

    /* NARROW PHONES */

    @media(max-width:360px) {

      html body #manaV80Home
      button#manaV80Mana28,
      html body #manaV80Home
      button#manaV80Strength,
      html body #manaV80Home
      button#manaV80Life {
        height: 312px !important;
        min-height: 312px !important;
        max-height: 312px !important;
      }

      html body #manaV80Home
      button.mana-v8013-program > h2 {
        font-size: 23px !important;
      }

      html body #manaV80Home
      button.mana-v8013-program > p {
        top: 166px !important;
        font-size: 12px !important;
      }

      html body #manaV80Home
      #manaV80Life > h2 {
        top: 91px !important;
        font-size: 21px !important;
      }

      html body #manaV80Home
      #manaV80Life > p {
        top: 177px !important;
        font-size: 11.5px !important;
      }
    }
  `;

  /* =====================================================
     FORCE EACH PHRASE TO ITS OWN LINE

     Changes only the existing ManaLyfe
     h2 content, not its button or handler.
     ===================================================== */

  function formatLyfeHeading() {
    const heading = document.querySelector(
      "#manaV80Home #manaV80Life > h2"
    );

    if (!heading) return;

    const lines = heading.querySelectorAll(
      ":scope > .mana-lyfe-line-105041"
    );

    if (
      lines.length === 3 &&
      lines[0].textContent === "Reset." &&
      lines[1].textContent === "Rebuild." &&
      lines[2].textContent === "Move Forward."
    ) {
      return;
    }

    const values = [
      "Reset.",
      "Rebuild.",
      "Move Forward."
    ];

    heading.replaceChildren();

    values.forEach(value => {
      const line = document.createElement("span");
      line.className = "mana-lyfe-line-105041";
      line.textContent = value;
      heading.appendChild(line);
    });
  }

  function install() {
    let style = document.getElementById(ID);

    if (!style) {
      style = document.createElement("style");
      style.id = ID;
      document.head.appendChild(style);
    }

    style.textContent = css;
    formatLyfeHeading();

    window.MANA_HOME_MOBILE_BUILD = BUILD;

    console.log(
      "[Mana Movement] Home 105041 ready"
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

  /* Reapply only if the original Home
     script refreshes the Lyfe heading. */

  window.addEventListener(
    "pageshow",
    formatLyfeHeading
  );

  window.addEventListener(
    "mana:program-change",
    () => setTimeout(formatLyfeHeading, 0)
  );

  document.addEventListener("click", event => {
    if (event.target.closest?.("#manaV80HomeBtn")) {
      setTimeout(formatLyfeHeading, 100);
    }
  });

  [150, 450, 1000, 2000].forEach(delay => {
    setTimeout(formatLyfeHeading, delay);
  });

})();
