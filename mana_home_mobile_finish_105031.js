
/* ==========================================================
   MANA MOVEMENT TRAINING
   MOBILE HOME FINISH — BUILD 105033

   COMPLETE REPLACEMENT FILE:
   mana_home_mobile_finish_105031.js

   FIXES:
   - Keeps approved full-width mobile banners
   - Adds breathing space between banners
   - Fixes icons hidden by older CSS rules
   - Profile, Mana28, Strength and Lyfe icons
   - Keeps desktop layout unchanged

   PRESERVES:
   - Existing button click handlers
   - Client and Coach navigation
   - Membership and program information
   - Profile, Chat, Payments and workouts
   ========================================================== */

(() => {
  "use strict";

  const BUILD = "105033";
  const FLAG = "MANA_HOME_MOBILE_105033";
  const STYLE = "manaHomeMobileStyle105033";
  const HOME = "manaV80Home";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  const ICONS = {
    profile: `
      <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">
        <circle cx="50" cy="28" r="13"/>
        <path d="M20 79
          C20 61 32 52 50 52
          S80 61 80 79"/>
        <path d="M36 72L46 81L65 60"
          stroke="#FFFFFF"/>
      </svg>
    `,

    mana28: `
      <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">
        <rect x="14" y="21"
          width="72" height="66" rx="10"/>
        <path d="M14 40H86M33 13V29M67 13V29"/>
        <text x="50" y="73"
          text-anchor="middle"
          fill="#FFFFFF"
          stroke="none"
          font-family="Arial,sans-serif"
          font-size="30"
          font-weight="900">28</text>
      </svg>
    `,

    strength: `
      <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">
        <path d="M30 50H70"/>
        <rect x="12" y="31"
          width="14" height="38" rx="3"/>
        <rect x="27" y="39"
          width="10" height="22" rx="2"
          fill="currentColor" stroke="none"/>
        <rect x="74" y="31"
          width="14" height="38" rx="3"/>
        <rect x="63" y="39"
          width="10" height="22" rx="2"
          fill="currentColor" stroke="none"/>
      </svg>
    `,

    lyfe: `
      <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">
        <path d="M50 87
          C25 71 13 53 23 36
          C31 23 44 27 50 38
          C56 27 69 23 77 36
          C87 53 75 71 50 87Z"/>
        <path d="M26 56H38L46 45
          L54 67L62 55H74"
          stroke="#FFFFFF"
          stroke-width="4"/>
      </svg>
    `
  };

  const CARDS = [
    ["manaV80ProfileSetup", "profile"],
    ["manaV80Mana28", "mana28"],
    ["manaV80Strength", "strength"],
    ["manaV80Life", "lyfe"]
  ];

  /* =====================================================
     MOBILE STYLING
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      @media(max-width:600px) {

        /* Preserve approved banner width */

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
          padding-bottom:
            calc(118px + env(safe-area-inset-bottom))
            !important;
          box-sizing: border-box !important;
        }

        html body #${HOME} *,
        html body #${HOME} *::before,
        html body #${HOME} *::after {
          box-sizing: border-box;
        }

        /* Brand */

        html body #${HOME}
        .mana-v8013-brand {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 0 24px !important;
          padding: 12px 12px 0 !important;
        }

        /* Profile / Goals banner */

        html body #${HOME}
        #manaV80ProfileSetup {
          position: relative !important;
          display: block !important;
          isolation: isolate !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          margin: 0 0 30px !important;
          padding: 24px 18px !important;
          overflow: hidden !important;
          border: 1px solid #FF7927 !important;
          border-radius: 18px !important;
          background:
            linear-gradient(
              135deg,
              #191B20,
              #101215 68%,
              #19110D
            ) !important;
          color: #FFFFFF !important;
          text-align: left !important;
        }

        /* Selection / guide area */

        html body #${HOME}
        .mana-v8013-select {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 0 34px !important;
          padding: 18px 14px !important;
          border: 1px solid #444C57 !important;
          border-radius: 15px !important;
          background: #15171B !important;
        }

        html body #${HOME}
        .mana-guide-button-105033,
        html body #${HOME}
        [data-mana-10-steps] {
          margin-bottom: 34px !important;
        }

        /* Main program banners */

        html body #${HOME}
        button.mana-v8013-program {
          position: relative !important;
          isolation: isolate !important;

          display: flex !important;
          flex-direction: column !important;
          align-items: stretch !important;

          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;

          min-height: 260px !important;
          height: auto !important;

          margin-top: 0 !important;
          margin-bottom: 30px !important;
          padding: 27px 18px 22px !important;

          border: 1px solid #FF7927 !important;
          border-radius: 19px !important;

          background:
            linear-gradient(
              135deg,
              #191B20,
              #101215 72%,
              #1B130E
            ) !important;

          box-shadow:
            0 8px 22px rgba(0,0,0,.22)
            !important;

          overflow: hidden !important;
          text-align: left !important;
          color: #FFFFFF !important;
        }

        html body #${HOME}
        button.mana-v8013-program.current {
          border: 2px solid #FF7927 !important;
          background:
            linear-gradient(
              135deg,
              #211811,
              #111316 75%
            ) !important;
        }

        /* Space after the final banner */

        html body #${HOME}
        #manaV80Life {
          margin-bottom: 38px !important;
        }

        /* Badge */

        html body #${HOME}
        .mana-v8013-program
        .mana-v8013-badge {
          position: absolute !important;
          top: 15px !important;
          right: 14px !important;
          z-index: 12 !important;
          max-width: 50% !important;
          background: #22180F !important;
          color: #FF7927 !important;
          border-color: #FF7927 !important;
        }

        /* Banner text */

        html body #${HOME}
        .mana-v8013-program-label {
          max-width: 75% !important;
          padding-top: 11px !important;
          margin-bottom: 10px !important;
          color: #FF7927 !important;
          -webkit-text-fill-color: #FF7927 !important;
          font-size: 12px !important;
          font-weight: 950 !important;
        }

        html body #${HOME}
        .mana-v8013-program h2 {
          max-width: 75% !important;
          font-size: clamp(25px,7vw,31px) !important;
          line-height: 1.1 !important;
          color: #FFFFFF !important;
          -webkit-text-fill-color: #FFFFFF !important;
        }

        html body #${HOME}
        .mana-v8013-program p {
          max-width: 75% !important;
          margin: 12px 0 0 !important;
          color: #C4CAD2 !important;
          -webkit-text-fill-color: #C4CAD2 !important;
          font-size: 13px !important;
          line-height: 1.55 !important;
        }

        html body #${HOME}
        .mana-v8013-program
        .mana-v8013-open {
          margin-top: 18px !important;
          color: #FF7927 !important;
          -webkit-text-fill-color: #FF7927 !important;
          font-size: 13px !important;
        }

        html body #${HOME}
        .mana-v8013-program
        .m1027-home-support {
          max-width: 75% !important;
          margin-top: 12px !important;
        }

        /* ===================================
           ICON POSITIONING

           Higher specificity than the older
           Home illustration CSS so the icon
           remains absolutely positioned.
           =================================== */

        html body #${HOME}
        button.mana-v8013-program
        > .mana-home-icon-105033,
        html body #${HOME}
        button#manaV80ProfileSetup
        > .mana-home-icon-105033 {
          display: flex !important;
          position: absolute !important;
          z-index: 8 !important;

          top: 82px !important;
          right: 14px !important;
          left: auto !important;
          bottom: auto !important;

          width: 78px !important;
          height: 78px !important;

          align-items: center !important;
          justify-content: center !important;

          padding: 12px !important;
          margin: 0 !important;

          border: 1px solid
            rgba(255,121,39,.75) !important;
          border-radius: 19px !important;

          background:
            radial-gradient(
              circle at 30% 25%,
              #362316,
              #15171B 75%
            ) !important;

          color: #FF7927 !important;
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: none !important;

          transform: none !important;
          box-shadow:
            0 5px 18px rgba(0,0,0,.2)
            !important;
        }

        html body #${HOME}
        .mana-home-icon-105033 svg {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          color: #FF7927 !important;
          stroke: currentColor;
        }

        /* Profile icon centred vertically */

        html body #${HOME}
        button#manaV80ProfileSetup
        > .mana-home-icon-105033 {
          top: 50% !important;
          transform: translateY(-50%) !important;
        }

        html body #${HOME}
        #manaV80ProfileSetup h2,
        html body #${HOME}
        #manaV80ProfileSetup p {
          max-width: 75% !important;
        }

        /* Hide older illustrations ONLY
           when the new icon is installed */

        html body #${HOME}
        .mana-home-icon-ready-105033
        > .mana-v1024-home-art,
        html body #${HOME}
        .mana-home-icon-ready-105033
        > .m1025-home-icon,
        html body #${HOME}
        .mana-home-icon-ready-105033
        > .mana-home-icon-105031 {
          display: none !important;
        }
      }

      @media(max-width:375px) {

        html body #${HOME}
        button.mana-v8013-program {
          min-height: 270px !important;
          padding-left: 15px !important;
          padding-right: 15px !important;
        }

        html body #${HOME}
        button.mana-v8013-program
        > .mana-home-icon-105033,
        html body #${HOME}
        button#manaV80ProfileSetup
        > .mana-home-icon-105033 {
          width: 64px !important;
          height: 64px !important;
          right: 10px !important;
          padding: 9px !important;
        }

        html body #${HOME}
        .mana-v8013-program p {
          max-width: 76% !important;
          font-size: 12px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     INSTALL ICONS WITHOUT MODIFYING BUTTON LOGIC
     ===================================================== */

  function installIcons() {
    const home = $(HOME);
    if (!home) return;

    for (const [id, type] of CARDS) {
      const card = $(id);

      if (!card || !home.contains(card)) {
        continue;
      }

      if (!card.querySelector(
        ":scope > .mana-home-icon-105033"
      )) {
        const icon = document.createElement("span");
        icon.className = "mana-home-icon-105033";
        icon.setAttribute("aria-hidden", "true");
        icon.innerHTML = ICONS[type];
        card.appendChild(icon);
      }

      card.classList.add(
        "mana-home-icon-ready-105033"
      );
    }
  }

  /* =====================================================
     OPTIONAL 10-STEP BUTTON
     ===================================================== */

  function markGuide() {
    const home = $(HOME);
    if (!home) return;

    home.querySelectorAll("button,a")
      .forEach(element => {
        const name = (
          element.textContent || ""
        ).trim().toLowerCase();

        if (
          /10[\s-]*(step|steps)/.test(name) ||
          /ten[\s-]+steps/.test(name)
        ) {
          element.classList.add(
            "mana-guide-button-105033"
          );
        }
      });
  }

  /* =====================================================
     REFRESH HOME DECORATION
     ===================================================== */

  function enhance() {
    installIcons();
    markGuide();
  }

  function init() {
    installStyles();
    enhance();

    // Home may be created after sign-in.
    [150, 450, 1000, 2000].forEach(
      delay => setTimeout(enhance, delay)
    );

    document.addEventListener("click", event => {
      if (
        event.target.closest?.(
          "#manaV80HomeBtn"
        )
      ) {
        setTimeout(enhance, 100);
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

    window.addEventListener(
      "mana:profile-synced",
      enhance
    );

    window.MANA_HOME_MOBILE_BUILD = BUILD;

    console.log(
      "[Mana Movement] Mobile Home " +
      BUILD + " active"
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
