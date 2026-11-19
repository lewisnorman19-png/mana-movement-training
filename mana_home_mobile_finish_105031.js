
/* ==========================================================
   MANA MOVEMENT
   PREMIUM MOBILE HOME BANNERS
   BUILD 105035

   COMPLETE REPLACEMENT:
   mana_home_mobile_finish_105031.js

   FIXES:
   - Larger orange program headings
   - Original white headings unchanged
   - Silver descriptions below icon area
   - Consistent banner width and height
   - Larger bottom-left membership text
   - ManaLyfe: Free with paid membership

   PRESERVES:
   - Existing icons
   - Existing Explore actions
   - Banner spacing
   - Original program navigation
   - Desktop Home
   - Profile, Coach Hub, Chat and Payments
   ========================================================== */

(() => {
  "use strict";

  const BUILD = "105035";
  const FLAG = "MANA_HOME_MOBILE_105035";
  const STYLE = "manaHomeMobileStyle105035";
  const HOME = "manaV80Home";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  /* =====================================================
     ICONS — ORIGINAL PREMIUM ORANGE
     ===================================================== */

  const icons = {
    mana28: `
      <svg viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        fill="none" stroke="#FF7927"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round">
        <rect x="9" y="13" width="46"
          height="43" rx="7"/>
        <path d="M9 25h46M21 8v10M43 8v10"/>
        <text x="32" y="46"
          fill="#FFFFFF" stroke="none"
          text-anchor="middle"
          font-size="19" font-weight="900"
          font-family="Arial,sans-serif">28</text>
      </svg>
    `,

    strength: `
      <svg viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        fill="none" stroke="#FF7927"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M18 32h28"/>
        <rect x="8" y="21" width="8"
          height="22" rx="2"/>
        <rect x="17" y="25" width="7"
          height="14" rx="2"
          fill="#FF7927"/>
        <rect x="48" y="21" width="8"
          height="22" rx="2"/>
        <rect x="40" y="25" width="7"
          height="14" rx="2"
          fill="#FF7927"/>
      </svg>
    `,

    lyfe: `
      <svg viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        fill="none" stroke="#FF7927"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M32 55
          C12 42 7 28 15 18
          C22 9 31 16 32 21
          C36 12 46 11 52 19
          C60 30 52 44 32 55Z"/>
        <path d="M13 34h12l5-9
          7 17 5-8h9"
          stroke="#FFFFFF"
          stroke-width="3"/>
      </svg>
    `
  };

  const CONFIG = [
    {
      id: "manaV80Mana28",
      type: "mana28",
      footer: "Free access",
      action: "Explore Mana28"
    },
    {
      id: "manaV80Strength",
      type: "strength",
      footer: "$39.99 AUD / month",
      action: "Explore Mana Strength"
    },
    {
      id: "manaV80Life",
      type: "lyfe",
      footer: "Free with paid membership",
      action: "Explore ManaLyfe"
    }
  ];

  /* =====================================================
     MOBILE STYLE
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      @media (max-width:600px) {

        /* ===================================
           PRESERVE APPROVED MOBILE WIDTH
           =================================== */

        html body #${HOME} {
          position: relative !important;
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

        html body #${HOME} *,
        html body #${HOME} *::before,
        html body #${HOME} *::after {
          box-sizing: border-box;
        }

        /* ===================================
           BREATHING ROOM ABOVE BANNERS
           =================================== */

        html body #${HOME}
        .mana-v8013-select {
          margin-bottom: 34px !important;
        }

        /* ===================================
           ALL THREE BANNERS

           Identical height, width, padding.
           =================================== */

        html body #${HOME}
        button#manaV80Mana28,
        html body #${HOME}
        button#manaV80Strength,
        html body #${HOME}
        button#manaV80Life {
          position: relative !important;

          display: flex !important;
          flex-direction: column !important;
          align-items: stretch !important;
          justify-content: flex-start !important;

          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;

          height: 344px !important;
          min-height: 344px !important;
          max-height: 344px !important;

          margin-top: 0 !important;
          margin-bottom: 26px !important;

          padding: 24px 18px 18px !important;

          border: 1px solid #FF7927 !important;
          border-radius: 19px !important;

          background:
            linear-gradient(
              135deg,
              #191B20 0%,
              #101215 72%,
              #1B130E 100%
            ) !important;

          color: #FFFFFF !important;
          text-align: left !important;

          overflow: hidden !important;
          isolation: isolate !important;
          box-sizing: border-box !important;

          box-shadow:
            0 8px 22px rgba(0,0,0,.22)
            !important;
        }

        html body #${HOME}
        button.mana-v8013-program.current {
          border-width: 2px !important;
        }

        /* ===================================
           MAIN CONTENT POSITION
           =================================== */

        html body #${HOME}
        .mana-home-card-main-105034 {
          position: relative !important;
          z-index: 5 !important;

          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;

          width: 100% !important;
          min-width: 0 !important;

          min-height: 218px !important;
          flex: 0 0 218px !important;

          margin: 0 !important;
          padding: 0 !important;
        }

        /* ===================================
           ORANGE PROGRAM HEADING

           MANA 28
           MANA STRENGTH
           MANA LYFE

           Increased from 12px to 18px.
           =================================== */

        html body #${HOME}
        .mana-home-card-main-105034
        .mana-v8013-program-label {
          display: block !important;
          position: static !important;

          width: calc(100% - 86px) !important;
          max-width: calc(100% - 86px) !important;

          margin: 0 0 8px !important;
          padding: 0 !important;

          color: #FF7927 !important;
          -webkit-text-fill-color:
            #FF7927 !important;

          font-size: 18px !important;
          font-weight: 950 !important;
          line-height: 1.2 !important;
          letter-spacing: .015em !important;

          text-transform: uppercase !important;
          white-space: normal !important;
        }

        /* ===================================
           WHITE HEADING

           Preserve original text and size.
           Example: 28-Day Kickstart.
           =================================== */

        html body #${HOME}
        .mana-home-card-main-105034 h2 {
          display: block !important;
          position: static !important;

          width: calc(100% - 86px) !important;
          max-width: calc(100% - 86px) !important;

          margin: 0 0 12px !important;
          padding: 0 !important;

          color: #FFFFFF !important;
          -webkit-text-fill-color:
            #FFFFFF !important;

          font-size: 28px !important;
          font-weight: 950 !important;
          line-height: 1.08 !important;
          letter-spacing: -.03em !important;
          white-space: normal !important;
        }

        /* ===================================
           SILVER DESCRIPTION

           Explicitly positioned BELOW
           the icon's occupied area.

           Full available width rather
           than squeezed alongside icon.
           =================================== */

        html body #${HOME}
        .mana-home-card-main-105034 p {
          display: block !important;

          position: absolute !important;
          z-index: 5 !important;

          top: 125px !important;
          left: 0 !important;
          right: 0 !important;
          bottom: auto !important;

          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;

          margin: 0 !important;
          padding: 0 !important;

          color: #C4CAD2 !important;
          -webkit-text-fill-color:
            #C4CAD2 !important;

          font-size: 13px !important;
          font-weight: 400 !important;
          line-height: 1.5 !important;

          text-align: left !important;
          white-space: normal !important;
          transform: none !important;
        }

        /* ===================================
           ICON TOP-RIGHT
           =================================== */

        html body #${HOME}
        button.mana-v8013-program
        > .mana-home-icon-105034 {
          display: flex !important;

          position: absolute !important;
          z-index: 8 !important;

          top: 24px !important;
          right: 16px !important;
          left: auto !important;
          bottom: auto !important;

          width: 72px !important;
          height: 72px !important;

          align-items: center !important;
          justify-content: center !important;

          padding: 11px !important;
          margin: 0 !important;

          border: 1px solid #FF7927 !important;
          border-radius: 17px !important;

          background: #231B16 !important;

          color: #FF7927 !important;

          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;

          pointer-events: none !important;
          box-sizing: border-box !important;
        }

        html body #${HOME}
        button.mana-v8013-program
        > .mana-home-icon-105034 svg {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* ===================================
           BOTTOM FOOTER

           Same horizontal position
           on all three program cards.
           =================================== */

        html body #${HOME}
        .mana-home-card-footer-105034 {
          position: relative !important;
          z-index: 6 !important;

          display: grid !important;
          grid-template-columns:
            minmax(0,1fr) auto !important;

          align-items: end !important;
          gap: 10px !important;

          width: 100% !important;
          min-width: 0 !important;

          margin-top: auto !important;
          padding-top: 14px !important;

          border-top:
            1px solid rgba(255,255,255,.12)
            !important;
        }

        /* ===================================
           BOTTOM LEFT MEMBERSHIP TEXT

           Enlarged from 11px to 13px.
           =================================== */

        html body #${HOME}
        .mana-home-card-note-105034 {
          display: block !important;
          position: static !important;

          min-width: 0 !important;

          margin: 0 !important;
          padding: 0 !important;

          color: #D1D5DB !important;
          -webkit-text-fill-color:
            #D1D5DB !important;

          font-size: 13px !important;
          font-weight: 750 !important;
          line-height: 1.35 !important;

          text-align: left !important;
          white-space: normal !important;
        }

        /* ===================================
           BOTTOM RIGHT EXPLORE
           =================================== */

        html body #${HOME}
        .mana-home-card-action-105034 {
          display: block !important;
          position: static !important;

          margin: 0 !important;
          padding: 0 !important;

          color: #FF7927 !important;
          -webkit-text-fill-color:
            #FF7927 !important;

          font-size: 11px !important;
          font-weight: 900 !important;
          line-height: 1.4 !important;

          text-align: right !important;
          white-space: normal !important;
        }

        /* ===================================
           HIDE OLD DUPLICATE CONTENT

           Preserve old nodes and data,
           just avoid duplicate rendering.
           =================================== */

        html body #${HOME}
        button.mana-v8013-program
        > .mana-v8013-badge,
        html body #${HOME}
        button.mana-v8013-program
        > .mana-v8013-current-badge,
        html body #${HOME}
        button.mana-v8013-program
        > .mana-v8013-free-note,
        html body #${HOME}
        button.mana-v8013-program
        > .mana-v8013-price,
        html body #${HOME}
        button.mana-v8013-program
        > .mana-v8013-open,
        html body #${HOME}
        button.mana-v8013-program
        > .m1027-home-support,
        html body #${HOME}
        button.mana-v8013-program
        > .mana-v1024-home-art,
        html body #${HOME}
        button.mana-v8013-program
        > .m1025-home-icon,
        html body #${HOME}
        button.mana-v8013-program
        > .mana-home-icon-105031,
        html body #${HOME}
        button.mana-v8013-program
        > .mana-home-icon-105033 {
          display: none !important;
        }

        html body #${HOME}
        #manaV80Life {
          margin-bottom: 35px !important;
        }
      }

      /* =====================================
         SMALL PHONE ADJUSTMENT
         ===================================== */

      @media(max-width:375px) {

        html body #${HOME}
        button#manaV80Mana28,
        html body #${HOME}
        button#manaV80Strength,
        html body #${HOME}
        button#manaV80Life {
          height: 365px !important;
          min-height: 365px !important;
          max-height: 365px !important;

          padding-left: 14px !important;
          padding-right: 14px !important;
        }

        html body #${HOME}
        .mana-home-card-main-105034
        .mana-v8013-program-label {
          font-size: 17px !important;
          width: calc(100% - 72px) !important;
          max-width: calc(100% - 72px) !important;
        }

        html body #${HOME}
        .mana-home-card-main-105034 h2 {
          width: calc(100% - 72px) !important;
          max-width: calc(100% - 72px) !important;
          font-size: 28px !important;
        }

        html body #${HOME}
        .mana-home-card-main-105034 p {
          top: 133px !important;
        }

        html body #${HOME}
        button.mana-v8013-program
        > .mana-home-icon-105034 {
          right: 12px !important;
          width: 60px !important;
          height: 60px !important;
        }

        html body #${HOME}
        .mana-home-card-note-105034 {
          font-size: 12px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     ORGANISE ORIGINAL PROGRAM CONTENT

     Keep existing buttons and handlers.
     No program routing changes.
     ===================================================== */

  function organiseCard(config) {
    const card = $(config.id);
    const home = $(HOME);

    if (!card || !home?.contains(card)) return;

    let main = card.querySelector(
      ":scope > .mana-home-card-main-105034"
    );

    if (!main) {
      main = document.createElement("div");
      main.className =
        "mana-home-card-main-105034";

      card.prepend(main);
    }

    const label = card.querySelector(
      ":scope > .mana-v8013-program-label"
    );

    const heading = card.querySelector(
      ":scope > h2"
    );

    const description = card.querySelector(
      ":scope > p"
    );

    if (label) main.appendChild(label);
    if (heading) main.appendChild(heading);
    if (description) main.appendChild(description);

    let icon = card.querySelector(
      ":scope > .mana-home-icon-105034"
    );

    if (!icon) {
      icon = document.createElement("span");
      icon.className = "mana-home-icon-105034";
      icon.setAttribute("aria-hidden","true");
      card.appendChild(icon);
    }

    if (!icon.firstElementChild) {
      icon.innerHTML = icons[config.type];
    }

    let footer = card.querySelector(
      ":scope > .mana-home-card-footer-105034"
    );

    if (!footer) {
      footer = document.createElement("div");
      footer.className =
        "mana-home-card-footer-105034";
      card.appendChild(footer);
    }

    let note = footer.querySelector(
      ".mana-home-card-note-105034"
    );

    if (!note) {
      note = document.createElement("span");
      note.className =
        "mana-home-card-note-105034";
      footer.appendChild(note);
    }

    if (note.textContent !== config.footer) {
      note.textContent = config.footer;
    }

    let action = footer.querySelector(
      ".mana-home-card-action-105034"
    );

    if (!action) {
      action = document.createElement("span");
      action.className =
        "mana-home-card-action-105034";
      footer.appendChild(action);
    }

    if (action.textContent !== config.action) {
      action.textContent = config.action;
    }

    card.classList.add(
      "mana-home-fixed-105034"
    );
  }

  /* =====================================================
     REFRESH EXISTING HOME
     ===================================================== */

  function enhance() {
    CONFIG.forEach(organiseCard);
  }

  function init() {
    installStyles();
    enhance();

    [150,450,1000,2000].forEach(
      delay => setTimeout(enhance,delay)
    );

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            "#manaV80HomeBtn"
          )
        ) {
          setTimeout(enhance,100);
        }
      }
    );

    window.addEventListener(
      "pageshow",
      enhance
    );

    window.addEventListener(
      "mana:program-change",
      enhance
    );

    window.MANA_HOME_MOBILE_BUILD = BUILD;

    console.log(
      "[Mana Movement] Home Banners " +
      BUILD + " ready"
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
