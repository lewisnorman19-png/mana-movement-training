
/* ==========================================================
   MANA MOVEMENT TRAINING
   PREMIUM MOBILE HOME PAGE
   BUILD 105031

   COMPLETE NEW FILE:
   mana_home_mobile_finish_105031.js

   - Nearly full-screen-width mobile banners
   - Consistent spacing between cards
   - Breathing room below the 10-step guide
   - Custom illustrations for each program
   - Premium orange / black / white / silver
   - Preserves existing button functionality
   - Does not change desktop layout
   - Does not affect Profile or Coach Hub
   ========================================================== */

(() => {
  "use strict";

  const FLAG = "MANA_HOME_MOBILE_105031";
  const STYLE = "manaHomeMobileStyle105031";
  const HOME = "manaV80Home";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  /* =====================================================
     ORIGINAL VECTOR ICONS
     ===================================================== */

  const ICONS = {
    profile: `
      <svg viewBox="0 0 100 100"
           aria-hidden="true"
           fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="29" r="13"
          stroke="currentColor"
          stroke-width="5"/>
        <path
          d="M20 79C20 61 32 52 50 52
             C68 52 80 61 80 79"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"/>
        <path d="M39 73L47 81L63 62"
          stroke="#FFFFFF"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"/>
      </svg>
    `,

    mana28: `
      <svg viewBox="0 0 100 100"
           aria-hidden="true"
           fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="21"
          width="72" height="67"
          rx="11"
          stroke="currentColor"
          stroke-width="5"/>
        <path d="M14 40H86"
          stroke="currentColor"
          stroke-width="5"/>
        <path d="M33 13V29M67 13V29"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"/>
        <text x="50" y="72"
          text-anchor="middle"
          fill="#FFFFFF"
          font-size="29"
          font-weight="900"
          font-family="Arial,sans-serif">28</text>
      </svg>
    `,

    strength: `
      <svg viewBox="0 0 100 100"
           aria-hidden="true"
           fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path d="M29 50H71"
          stroke="currentColor"
          stroke-width="6"
          stroke-linecap="round"/>
        <rect x="14" y="32"
          width="13" height="36"
          rx="3"
          stroke="currentColor"
          stroke-width="5"/>
        <rect x="27" y="39"
          width="10" height="22"
          rx="2"
          fill="currentColor"/>
        <rect x="73" y="32"
          width="13" height="36"
          rx="3"
          stroke="currentColor"
          stroke-width="5"/>
        <rect x="63" y="39"
          width="10" height="22"
          rx="2"
          fill="currentColor"/>
        <path d="M14 50H6M86 50H94"
          stroke="#FFFFFF"
          stroke-width="4"
          stroke-linecap="round"/>
      </svg>
    `,

    lyfe: `
      <svg viewBox="0 0 100 100"
           aria-hidden="true"
           fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path
          d="M50 87
             C23 70 13 52 23 36
             C31 23 44 27 50 38
             C56 27 69 23 77 36
             C87 52 77 70 50 87Z"
          stroke="currentColor"
          stroke-width="5"
          stroke-linejoin="round"/>
        <path
          d="M26 56H39L46 45L54 67
             L62 55H74"
          stroke="#FFFFFF"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"/>
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
     MOBILE-ONLY STYLE
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      @media (max-width:600px) {

        /* ===================================
           HOME PAGE WIDTH
           =================================== */

        html,
        body {
          max-width: 100%;
        }

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

        /* ===================================
           TOP BRAND
           =================================== */

        html body #${HOME}
        .mana-v8013-brand {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 0 24px !important;
          padding: 12px 12px 0 !important;
        }

        /* ===================================
           PROFILE / GET STARTED BANNER
           =================================== */

        html body #${HOME}
        #manaV80ProfileSetup {
          display: block !important;
          position: relative !important;

          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;

          margin: 0 0 26px !important;
          padding: 24px 18px !important;

          border: 1px solid #FF7927 !important;
          border-radius: 18px !important;

          background:
            linear-gradient(
              135deg,
              #191B20 0%,
              #101215 68%,
              #19110D 100%
            ) !important;

          overflow: hidden !important;
          text-align: left !important;
        }

        /* ===================================
           SELECT / 10 STEP GUIDE AREA
           =================================== */

        html body #${HOME}
        .mana-v8013-select {
          width: 100% !important;
          max-width: 100% !important;

          margin: 0 0 30px !important;
          padding: 18px 14px !important;

          border: 1px solid #444C57 !important;
          border-radius: 15px !important;

          background: #15171B !important;
        }

        html body #${HOME}
        .mana-home-10-step-guide,
        html body #${HOME}
        [data-mana-10-steps] {
          width: 100% !important;
          max-width: 100% !important;
          margin-bottom: 30px !important;
        }

        /* ===================================
           THREE MAIN PROGRAM BANNERS
           =================================== */

        html body #${HOME}
        .mana-v8013-program {
          display: flex !important;
          flex-direction: column !important;

          position: relative !important;
          isolation: isolate !important;

          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;

          height: auto !important;
          min-height: 260px !important;

          margin: 0 0 22px !important;
          padding: 27px 18px 22px !important;

          background:
            linear-gradient(
              135deg,
              #191B20,
              #101215 72%,
              #1B130E
            ) !important;

          border: 1px solid #FF7927 !important;
          border-radius: 19px !important;

          box-shadow:
            0 8px 22px rgba(0,0,0,.22)
            !important;

          color: #FFFFFF !important;
          overflow: hidden !important;
          text-align: left !important;
        }

        html body #${HOME}
        .mana-v8013-program.current {
          border: 2px solid #FF7927 !important;
          background:
            linear-gradient(
              135deg,
              #211811,
              #111316 75%
            ) !important;
        }

        html body #${HOME}
        .mana-v8013-program:last-of-type {
          margin-bottom: 28px !important;
        }

        /* ===================================
           BADGE SPACING
           =================================== */

        html body #${HOME}
        .mana-v8013-program
        .mana-v8013-badge {
          position: absolute !important;
          top: 15px !important;
          right: 14px !important;

          z-index: 5 !important;
          max-width: 50% !important;

          background: #22180F !important;
          border-color: #FF7927 !important;
          color: #FF7927 !important;
        }

        /* ===================================
           BANNER TEXT
           =================================== */

        html body #${HOME}
        .mana-v8013-program-label {
          max-width: 75% !important;
          padding-top: 11px !important;
          margin-bottom: 10px !important;

          color: #FF7927 !important;
          -webkit-text-fill-color: #FF7927 !important;

          font-size: 12px !important;
          font-weight: 950 !important;
          letter-spacing: .09em !important;
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
          font-weight: 900 !important;
        }

        html body #${HOME}
        .mana-v8013-program
        .mana-v8013-current-badge {
          max-width: max-content !important;
          margin-top: 14px !important;
        }

        html body #${HOME}
        .mana-v8013-program
        .m1027-home-support {
          max-width: 75% !important;
          margin-top: 12px !important;
        }

        /* ===================================
           ILLUSTRATIONS

           Keep old artwork from overlapping
           the new consistent icons.
           =================================== */

        html body #${HOME}
        .mana-home-icon-105031 {
          position: absolute !important;

          display: flex !important;
          align-items: center !important;
          justify-content: center !important;

          top: 76px !important;
          right: 16px !important;

          width: 78px !important;
          height: 78px !important;

          padding: 12px !important;

          border: 1px solid
            rgba(255,121,39,.7) !important;

          border-radius: 19px !important;

          background:
            radial-gradient(
              circle at 30% 25%,
              #362316,
              #15171B 75%
            ) !important;

          color: #FF7927 !important;

          z-index: 2 !important;
          pointer-events: none !important;

          box-shadow:
            0 5px 18px rgba(0,0,0,.2)
            !important;
        }

        html body #${HOME}
        .mana-home-icon-105031 svg {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
        }

        html body #${HOME}
        .mana-home-icon-ready-105031
        > .mana-v1024-home-art,
        html body #${HOME}
        .mana-home-icon-ready-105031
        > .m1025-home-icon {
          display: none !important;
        }

        html body #${HOME}
        #manaV80ProfileSetup
        .mana-home-icon-105031 {
          top: 50% !important;
          right: 16px !important;
          transform: translateY(-50%) !important;
        }

        html body #${HOME}
        #manaV80ProfileSetup h2,
        html body #${HOME}
        #manaV80ProfileSetup p {
          max-width: 75% !important;
        }

        /* ===================================
           TEN-STEP BUTTON SPACE

           This targets only the home guide
           button if present.
           =================================== */

        html body #${HOME}
        .mana-guide-button-105031 {
          display: block !important;

          width: 100% !important;
          max-width: 100% !important;

          margin-top: 12px !important;
          margin-bottom: 30px !important;

          min-height: 48px !important;
          border-radius: 12px !important;
        }
      }

      /* =====================================
         VERY SMALL PHONES
         ===================================== */

      @media(max-width:375px) {

        html body #${HOME}
        .mana-v8013-program {
          padding-left: 15px !important;
          padding-right: 15px !important;
          min-height: 270px !important;
        }

        html body #${HOME}
        .mana-home-icon-105031 {
          width: 63px !important;
          height: 63px !important;
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
     ADD ICON WITHOUT REPLACING CARD
     OR TOUCHING ITS CLICK HANDLER
     ===================================================== */

  function addIcon(id, type) {
    const card = $(id);

    if (!card || !ICONS[type]) return;

    if (
      card.querySelector(
        ".mana-home-icon-105031"
      )
    ) return;

    const icon = document.createElement("span");

    icon.className =
      "mana-home-icon-105031";

    icon.setAttribute("aria-hidden","true");

    icon.innerHTML = ICONS[type];

    card.appendChild(icon);

    card.classList.add(
      "mana-home-icon-ready-105031"
    );
  }

  /* =====================================================
     RECOGNISE EXISTING 10-STEP GUIDE

     Do not create a fake guide button.
     Only style a real button if it exists.
     ===================================================== */

  function markGuide() {
    const home = $(HOME);
    if (!home) return;

    const candidates = home.querySelectorAll(
      "button,a"
    );

    for (const element of candidates) {
      const label = (
        element.textContent || ""
      ).trim().toLowerCase();

      if (
        /10[\s-]*(step|steps)/.test(label) ||
        /ten[\s-]+steps/.test(label)
      ) {
        element.classList.add(
          "mana-guide-button-105031"
        );
      }
    }
  }

  /* =====================================================
     APPLY ONLY TO EXISTING HOME
     ===================================================== */

  function enhanceHome() {
    const home = $(HOME);

    if (!home) return;

    for (const [id,type] of CARDS) {
      addIcon(id,type);
    }

    markGuide();
  }

  /* =====================================================
     INIT
     ===================================================== */

  function init() {
    installStyles();

    enhanceHome();

    // Home may be constructed after login.
    // Bounded checks only — no page-wide
    // permanent observer or route overrides.
    [100,350,800,1600,2800].forEach(
      delay => setTimeout(enhanceHome,delay)
    );

    window.addEventListener(
      "pageshow",
      enhanceHome
    );

    window.addEventListener(
      "mana:program-change",
      enhanceHome
    );

    window.addEventListener(
      "mana:profile-synced",
      enhanceHome
    );

    document.addEventListener("click", event => {
      if (
        event.target.closest?.(
          "#manaV80HomeBtn"
        )
      ) {
        setTimeout(enhanceHome,100);
      }
    });

    window.MANA_HOME_MOBILE_BUILD =
      "105031";

    console.log(
      "[Mana Movement] Mobile Home 105031 ready"
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
