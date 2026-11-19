
/* ==========================================================
   MANA MOVEMENT
   CONSISTENT MOBILE HOME BANNERS
   BUILD 105034

   COMPLETE REPLACEMENT:
   mana_home_mobile_finish_105031.js

   - Three identical banner dimensions
   - Heading and description top-left
   - Illustration top-right
   - Membership information bottom-left
   - Explore action bottom-right
   - Consistent 26px separation
   - Approved mobile width preserved
   - Desktop unchanged
   - Existing button handlers preserved
   ========================================================== */

(() => {
  "use strict";

  const BUILD = "105034";
  const FLAG = "MANA_HOME_MOBILE_105034";
  const STYLE = "manaHomeMobileStyle105034";
  const HOME = "manaV80Home";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

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
          height="14" rx="2" fill="#FF7927"/>
        <rect x="48" y="21" width="8"
          height="22" rx="2"/>
        <rect x="40" y="25" width="7"
          height="14" rx="2" fill="#FF7927"/>
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
          stroke="#FFFFFF" stroke-width="3"/>
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
      footer: "Included with paid membership",
      action: "Explore ManaLyfe"
    }
  ];

  /* =====================================================
     MOBILE-ONLY STYLES
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      @media(max-width:600px) {

        /* APPROVED PHONE WIDTH */

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

        /* SPACE BELOW SELECTION / GUIDE */

        html body #${HOME}
        .mana-v8013-select {
          margin-bottom: 34px !important;
        }

        /* ALL THREE BANNERS — IDENTICAL */

        html body #${HOME}
        button.mana-v8013-program
        .mana-home-card-main-105034,
        html body #${HOME}
        button.mana-v8013-program
        .mana-home-card-footer-105034 {
          box-sizing: border-box !important;
        }

        html body #${HOME}
        button#manaV80Mana28,
        html body #${HOME}
        button#manaV80Strength,
        html body #${HOME}
        button#manaV80Life {
          position: relative !important;
          display: flex !important;
          flex-direction: column !important;

          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;

          height: 344px !important;
          min-height: 344px !important;
          max-height: 344px !important;

          margin: 0 0 26px !important;
          padding: 24px 18px 18px !important;

          overflow: hidden !important;
          isolation: isolate !important;

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

          box-shadow:
            0 8px 22px rgba(0,0,0,.22)
            !important;

          justify-content: flex-start !important;
          align-items: stretch !important;
          box-sizing: border-box !important;
        }

        html body #${HOME}
        button.mana-v8013-program.current {
          border-width: 2px !important;
        }

        /* MAIN CONTENT — FIXED TOP POSITION */

        html body #${HOME}
        .mana-home-card-main-105034 {
          position: relative !important;
          z-index: 5 !important;

          display: flex !important;
          flex-direction: column !important;

          align-items: flex-start !important;
          justify-content: flex-start !important;

          width: 100% !important;
          min-width: 0 !important;
          flex: 0 0 auto !important;

          margin: 0 !important;
          padding: 0 !important;
        }

        /* HEADING TOP-LEFT */

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
          -webkit-text-fill-color: #FF7927
            !important;

          font-size: 12px !important;
          font-weight: 950 !important;
          line-height: 1.35 !important;
          letter-spacing: .08em !important;
        }

        html body #${HOME}
        .mana-home-card-main-105034 h2 {
          display: block !important;
          position: static !important;

          width: calc(100% - 86px) !important;
          max-width: calc(100% - 86px) !important;

          margin: 0 0 12px !important;
          padding: 0 !important;

          color: #FFFFFF !important;
          -webkit-text-fill-color: #FFFFFF
            !important;

          font-size: 28px !important;
          font-weight: 950 !important;
          line-height: 1.08 !important;
          letter-spacing: -.03em !important;
        }

        /* DESCRIPTION DIRECTLY UNDER HEADING */

        html body #${HOME}
        .mana-home-card-main-105034 p {
          display: block !important;
          position: static !important;

          width: calc(100% - 86px) !important;
          max-width: calc(100% - 86px) !important;

          margin: 0 !important;
          padding: 0 !important;

          color: #C4CAD2 !important;
          -webkit-text-fill-color: #C4CAD2
            !important;

          font-size: 13px !important;
          font-weight: 400 !important;
          line-height: 1.5 !important;
        }

        /* ICON — TOP RIGHT */

        html body #${HOME}
        button.mana-v8013-program
        > .mana-home-icon-105034 {
          position: absolute !important;
          z-index: 8 !important;

          top: 24px !important;
          right: 16px !important;
          left: auto !important;
          bottom: auto !important;

          display: flex !important;
          align-items: center !important;
          justify-content: center !important;

          width: 72px !important;
          height: 72px !important;

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

        /* BOTTOM ROW — SAME POSITION ON ALL */

        html body #${HOME}
        .mana-home-card-footer-105034 {
          position: relative !important;
          z-index: 6 !important;

          display: grid !important;
          grid-template-columns:
            minmax(0,1fr) auto !important;

          gap: 10px !important;
          align-items: end !important;

          width: 100% !important;
          min-width: 0 !important;

          margin-top: auto !important;
          padding-top: 14px !important;

          border-top:
            1px solid rgba(255,255,255,.12)
            !important;
        }

        html body #${HOME}
        .mana-home-card-note-105034 {
          position: static !important;
          display: block !important;

          min-width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;

          color: #C4CAD2 !important;
          -webkit-text-fill-color: #C4CAD2
            !important;

          font-size: 11px !important;
          font-weight: 650 !important;
          line-height: 1.4 !important;
          text-align: left !important;
        }

        html body #${HOME}
        .mana-home-card-action-105034 {
          position: static !important;
          display: block !important;

          margin: 0 !important;
          padding: 0 !important;

          color: #FF7927 !important;
          -webkit-text-fill-color: #FF7927
            !important;

          font-size: 11px !important;
          font-weight: 900 !important;
          line-height: 1.4 !important;
          text-align: right !important;
          white-space: normal !important;
        }

        /* HIDE OLD CONTENT THAT SHIFTED CARDS */

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

        /* EXTRA SPACE AFTER LAST BANNER */

        html body #${HOME}
        #manaV80Life {
          margin-bottom: 35px !important;
        }
      }

      /* SMALL PHONES — STILL IDENTICAL HEIGHTS */

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
        button.mana-v8013-program
        > .mana-home-icon-105034 {
          width: 60px !important;
          height: 60px !important;
          right: 12px !important;
        }

        html body #${HOME}
        .mana-home-card-main-105034 h2 {
          font-size: 25px !important;
        }

        html body #${HOME}
        .mana-home-card-main-105034
        .mana-v8013-program-label,
        html body #${HOME}
        .mana-home-card-main-105034 h2,
        html body #${HOME}
        .mana-home-card-main-105034 p {
          width: calc(100% - 72px) !important;
          max-width: calc(100% - 72px) !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     ORGANISE EXISTING CARD CONTENT

     Moves original nodes rather than
     replacing the program buttons.
     All original click handlers remain.
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

    icon.innerHTML = icons[config.type];

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

    note.textContent = config.footer;

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

    card.classList.add("mana-home-fixed-105034");
  }

  /* =====================================================
     EXISTING GUIDE BUTTON
     ===================================================== */

  function markGuide() {
    const home = $(HOME);
    if (!home) return;

    home.querySelectorAll("button,a")
      .forEach(button => {
        if (
          /10[\s-]*steps?/i.test(
            button.textContent || ""
          )
        ) {
          button.classList.add(
            "mana-home-guide-105034"
          );
        }
      });
  }

  function enhance() {
    CONFIG.forEach(organiseCard);
    markGuide();
  }

  function init() {
    installStyles();
    enhance();

    [150,450,1000,2000].forEach(
      delay => setTimeout(enhance,delay)
    );

    document.addEventListener("click", event => {
      if (
        event.target.closest?.(
          "#manaV80HomeBtn"
        )
      ) {
        setTimeout(enhance,100);
      }
    });

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
      "[Mana Movement] Home banners " +
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
