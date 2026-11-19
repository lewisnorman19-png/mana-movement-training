
/* ==========================================================
   MANA MOVEMENT
   MOBILE HOME — TEXT ALIGNMENT FIX
   BUILD 105037

   COMPLETE REPLACEMENT:
   mana_home_mobile_finish_105031.js

   FIXES:
   - Orange headings bigger, same top-left position
   - White headings moved down
   - Silver descriptions aligned below icons
   - Old duplicate footer text hidden
   - "Free access" removed
   - One membership note and one Explore link
   - Card width, height and gaps unchanged

   PRESERVES:
   - All original program buttons
   - Existing click handlers and navigation
   - Existing icons
   - Desktop presentation
   - Profile, Coach Hub, Chat and Payments
   ========================================================== */

(() => {
  "use strict";

  const BUILD = "105037";
  const FLAG = "MANA_HOME_MOBILE_105037";
  const STYLE_ID = "manaHomeMobileStyle105037";
  const HOME_ID = "manaV80Home";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  const ICONS = {
    mana28: `
      <svg viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="#FF7927"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">
        <rect x="9" y="13"
          width="46" height="43" rx="7"/>
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
        fill="none"
        stroke="#FF7927"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">
        <path d="M18 32h28"/>
        <rect x="8" y="21"
          width="8" height="22" rx="2"/>
        <rect x="17" y="25"
          width="7" height="14" rx="2"
          fill="#FF7927"/>
        <rect x="48" y="21"
          width="8" height="22" rx="2"/>
        <rect x="40" y="25"
          width="7" height="14" rx="2"
          fill="#FF7927"/>
      </svg>
    `,

    lyfe: `
      <svg viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="#FF7927"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">
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

  const CARDS = [
    {
      id: "manaV80Mana28",
      icon: "mana28",
      note: "",
      action: "Explore Mana28"
    },
    {
      id: "manaV80Strength",
      icon: "strength",
      note: "$39.99 AUD / month",
      action: "Explore Mana Strength"
    },
    {
      id: "manaV80Life",
      icon: "lyfe",
      note: "Included with paid membership",
      action: "Explore ManaLyfe"
    }
  ];

  /* =====================================================
     STYLES
     ===================================================== */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* DESKTOP — UNCHANGED */

      @media(min-width:601px) {
        #${HOME_ID}
        .mana-home-card-main-105034 {
          display: contents !important;
        }

        #${HOME_ID}
        .mana-home-card-footer-105034,
        #${HOME_ID}
        .mana-home-icon-105034 {
          display: none !important;
        }
      }

      /* MOBILE */

      @media(max-width:600px) {

        /* APPROVED CARD WIDTH */

        html body #${HOME_ID} {
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

        html body #${HOME_ID} *,
        html body #${HOME_ID} *::before,
        html body #${HOME_ID} *::after {
          box-sizing: border-box;
        }

        /* SPACE BELOW SELECTION BUTTON */

        html body #${HOME_ID}
        .mana-v8013-select {
          margin-bottom: 34px !important;
        }

        /* THREE MATCHING CARDS */

        html body #${HOME_ID}
        button#manaV80Mana28,
        html body #${HOME_ID}
        button#manaV80Strength,
        html body #${HOME_ID}
        button#manaV80Life {
          position: relative !important;
          isolation: isolate !important;

          display: flex !important;
          flex-direction: column !important;
          align-items: stretch !important;
          justify-content: flex-start !important;

          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;

          height: 300px !important;
          min-height: 300px !important;
          max-height: 300px !important;

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

        html body #${HOME_ID}
        button.mana-v8013-program.current {
          border-width: 2px !important;
        }

        /* MAIN CONTENT */

        html body #${HOME_ID}
        button.mana-v8013-program
        > .mana-home-card-main-105034 {
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;

          position: relative !important;
          z-index: 5 !important;

          width: 100% !important;
          min-width: 0 !important;

          flex: 0 1 auto !important;

          margin: 0 !important;
          padding: 0 !important;
        }

        /* ORANGE HEADING
           KEEP SAME TOP POSITION, BIGGER */

        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-home-card-main-105034
        .mana-v8013-program-label {
          display: block !important;
          position: static !important;

          width: calc(100% - 78px) !important;
          max-width: calc(100% - 78px) !important;

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
        }

        /* WHITE HEADING
           MOVE DOWN FOR BREATHING ROOM */

        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-home-card-main-105034 h2 {
          display: block !important;
          position: static !important;

          width: calc(100% - 78px) !important;
          max-width: calc(100% - 78px) !important;

          margin: 18px 0 0 !important;
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

        /* SILVER DESCRIPTION

           Move below icon's vertical area.
           Same position on all cards.
           Full available width.
        */

        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-home-card-main-105034 p {
          display: block !important;

          position: absolute !important;
          top: 132px !important;
          left: 0 !important;
          right: 0 !important;
          bottom: auto !important;
          z-index: 5 !important;

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
          line-height: 1.45 !important;

          text-align: left !important;
          white-space: normal !important;

          transform: none !important;
        }

        /* KEEP SPACE FOR DESCRIPTION */

        html body #${HOME_ID}
        button.mana-v8013-program
        > .mana-home-card-main-105034 {
          min-height: 211px !important;
          flex: 0 0 211px !important;
        }

        /* ICON TOP RIGHT */

        html body #${HOME_ID}
        button.mana-v8013-program
        > .mana-home-icon-105034 {
          display: flex !important;
          position: absolute !important;
          z-index: 8 !important;

          top: 20px !important;
          right: 16px !important;
          left: auto !important;
          bottom: auto !important;

          width: 62px !important;
          height: 62px !important;

          align-items: center !important;
          justify-content: center !important;

          margin: 0 !important;
          padding: 10px !important;

          border: 1px solid #FF7927 !important;
          border-radius: 16px !important;

          background: #231B16 !important;
          color: #FF7927 !important;

          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;

          pointer-events: none !important;
        }

        html body #${HOME_ID}
        button.mana-v8013-program
        > .mana-home-icon-105034 svg {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
        }

        /* ONE CLEAN BOTTOM ROW */

        html body #${HOME_ID}
        button.mana-v8013-program
        > .mana-home-card-footer-105034 {
          display: grid !important;
          position: relative !important;
          z-index: 6 !important;

          grid-template-columns:
            minmax(0,1fr) minmax(0,1fr)
            !important;

          align-items: end !important;
          gap: 10px !important;

          width: 100% !important;
          min-width: 0 !important;

          flex: 0 0 auto !important;

          margin: auto 0 0 !important;
          padding: 10px 0 0 !important;

          border-top:
            1px solid rgba(255,255,255,.12)
            !important;
        }

        /* BOTTOM-LEFT MEMBERSHIP */

        html body #${HOME_ID}
        button.mana-v8013-program
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
          line-height: 1.3 !important;

          text-align: left !important;
          white-space: normal !important;
        }

        /* BOTTOM-RIGHT EXPLORE */

        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-home-card-action-105034 {
          display: block !important;
          position: static !important;

          min-width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;

          color: #FF7927 !important;
          -webkit-text-fill-color:
            #FF7927 !important;

          font-size: 12px !important;
          font-weight: 900 !important;
          line-height: 1.3 !important;

          text-align: right !important;
          white-space: normal !important;
        }

        /* REMOVE DUPLICATES

           Hide ALL old footer copies,
           including ones nested by
           earlier Home scripts.
        */

        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-v8013-free-note,
        html body #${HOME_ID}
        button.mana-v8013-program
        .m1027-home-support,
        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-v8013-price,
        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-v8013-open,
        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-v8013-current-badge,
        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-v8013-badge {
          display: none !important;
        }

        /* OLD ICONS HIDDEN */

        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-v1024-home-art,
        html body #${HOME_ID}
        button.mana-v8013-program
        .m1025-home-icon,
        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-home-icon-105031,
        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-home-icon-105033 {
          display: none !important;
        }

        html body #${HOME_ID}
        #manaV80Life {
          margin-bottom: 38px !important;
        }
      }

      /* SMALL PHONES */

      @media(max-width:360px) {

        html body #${HOME_ID}
        button#manaV80Mana28,
        html body #${HOME_ID}
        button#manaV80Strength,
        html body #${HOME_ID}
        button#manaV80Life {
          height: 322px !important;
          min-height: 322px !important;
          max-height: 322px !important;

          padding-left: 14px !important;
          padding-right: 14px !important;
        }

        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-home-card-main-105034
        .mana-v8013-program-label {
          font-size: 19px !important;
          width: calc(100% - 72px) !important;
          max-width: calc(100% - 72px) !important;
        }

        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-home-card-main-105034 h2 {
          font-size: 25px !important;
          width: calc(100% - 72px) !important;
          max-width: calc(100% - 72px) !important;
        }

        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-home-card-main-105034 p {
          top: 140px !important;
          font-size: 12px !important;
        }

        html body #${HOME_ID}
        button.mana-v8013-program
        > .mana-home-icon-105034 {
          width: 57px !important;
          height: 57px !important;
          right: 12px !important;
        }

        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-home-card-note-105034,
        html body #${HOME_ID}
        button.mana-v8013-program
        .mana-home-card-action-105034 {
          font-size: 11px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     KEEP ORIGINAL CARD AND CLICK HANDLER
     ===================================================== */

  function organiseCard(config) {
    const home = $(HOME_ID);
    const card = $(config.id);

    if (!home || !card || !home.contains(card)) {
      return;
    }

    let main = card.querySelector(
      ":scope > .mana-home-card-main-105034"
    );

    if (!main) {
      main = document.createElement("div");
      main.className = "mana-home-card-main-105034";
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
      icon.innerHTML = ICONS[config.icon];
    }

    let footer = card.querySelector(
      ":scope > .mana-home-card-footer-105034"
    );

    if (!footer) {
      footer = document.createElement("div");
      footer.className = "mana-home-card-footer-105034";
      card.appendChild(footer);
    }

    let note = footer.querySelector(
      ".mana-home-card-note-105034"
    );

    if (!note) {
      note = document.createElement("span");
      note.className = "mana-home-card-note-105034";
      footer.appendChild(note);
    }

    note.textContent = config.note;

    let action = footer.querySelector(
      ".mana-home-card-action-105034"
    );

    if (!action) {
      action = document.createElement("span");
      action.className =
        "mana-home-card-action-105034";
      footer.appendChild(action);
    }

    action.textContent = config.action;

    card.classList.add("mana-home-fixed-105037");
  }

  /* =====================================================
     INITIALISE
     ===================================================== */

  function enhance() {
    CARDS.forEach(organiseCard);
  }

  function init() {
    installStyles();
    enhance();

    [150,450,1000,2000].forEach(
      delay => setTimeout(enhance,delay)
    );

    document.addEventListener("click", event => {
      if (
        event.target.closest?.("#manaV80HomeBtn")
      ) {
        setTimeout(enhance,100);
      }
    });

    window.addEventListener("pageshow",enhance);
    window.addEventListener("mana:program-change",enhance);

    window.MANA_HOME_MOBILE_BUILD = BUILD;

    console.log(
      "[Mana Movement] Home 105037 ready"
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
