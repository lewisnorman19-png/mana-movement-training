
/* ==========================================================
   MANA MOVEMENT TRAINING
   SAFARI DOB ALIGNMENT + MOBILE STABILITY
   BUILD 105032

   COMPLETE REPLACEMENT:
   mana_profile_mobile_stability_105016.js

   - Fixes Safari DOB border overlapping Age
   - Aligns DOB and Age text vertically
   - Keeps native Safari date picker working
   - Preserves original DOB input and saving
   - Preserves full-width mobile email
   - Preserves mobile Coach Hub width
   - Preserves existing input focus protection
   - No laptop layout changes
   - No database changes
   ========================================================== */

(() => {
  "use strict";

  const BUILD = "105032";
  const FLAG = "MANA_PROFILE_MOBILE_105032";
  const STYLE = "manaProfileMobileStyle105032";
  const SCREEN = "manaProfileScreen";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  const FIELDS = new Set([
    "me-first_name",
    "me-last_name",
    "me-dob",
    "manaProfileName",
    "manaProfileHeight",
    "manaProfileWeight",
    "manaProfileAge",
    "me-phone",
    "me-country",
    "me-state",
    "me-city"
  ]);

  let active = null;
  let lastValue = "";
  let editingAt = 0;
  let guardTimer = null;
  let root = null;

  /* =====================================================
     MOBILE STYLES
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      #${SCREEN} .mana-profile-field,
      #${SCREEN} .me-field,
      #${SCREEN} .mana-paired-fields,
      #${SCREEN} .mana-paired-fields > * {
        min-width: 0 !important;
        box-sizing: border-box !important;
      }

      #${SCREEN} input:focus-visible,
      #${SCREEN} select:focus-visible,
      #${SCREEN} textarea:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: 1px !important;
      }

      @media(max-width:600px) {

        #${SCREEN} {
          padding-left: 9px !important;
          padding-right: 9px !important;
        }

        #${SCREEN} .mana-profile-shell {
          width: 100% !important;
          max-width: 100% !important;
        }

        #${SCREEN} input[type="text"],
        #${SCREEN} input[type="number"],
        #${SCREEN} input[type="tel"],
        #${SCREEN} input[type="email"],
        #${SCREEN} input[type="date"],
        #${SCREEN} select {
          box-sizing: border-box !important;
          min-width: 0 !important;
          max-width: 100% !important;
        }

        /* =====================================
           EMAIL AND CONTACT NUMBER
           ===================================== */

        #${SCREEN}
        #manaEmailPhoneRow105022 {
          display: grid !important;
          grid-template-columns: minmax(0,1fr) !important;
          gap: 12px !important;
          width: 100% !important;
          min-width: 0 !important;
        }

        #${SCREEN}
        #manaEmailPhoneRow105022 > * {
          grid-column: 1 / -1 !important;
          display: block !important;
          min-width: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
        }

        #${SCREEN}
        #manaEmailPhoneRow105022
        #me-account-email,
        #${SCREEN}
        #manaEmailPhoneRow105022
        #me-phone {
          display: block !important;
          width: 100% !important;
          height: 48px !important;
          min-height: 48px !important;
          padding: 10px 12px !important;
          font-size: 16px !important;
          line-height: normal !important;
          border-radius: 10px !important;
        }

        #${SCREEN}
        #manaEmailPhoneRow105022
        #me-account-email {
          background: #171A1F !important;
          color: #D1D5DB !important;
          -webkit-text-fill-color: #D1D5DB !important;
          opacity: 1 !important;
        }

        /* =====================================
           DATE OF BIRTH / AGE ROW

           Two independent boxes with a
           fixed gap. No Safari overflow.
           ===================================== */

        #${SCREEN}
        #manaDobAgeRow104992 {
          display: grid !important;
          grid-template-columns:
            minmax(0,1fr) 78px !important;
          gap: 12px !important;
          align-items: start !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          margin: 4px 0 10px !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992 > * {
          display: flex !important;
          flex-direction: column !important;
          align-items: stretch !important;
          position: relative !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992 label {
          display: block !important;
          height: 20px !important;
          min-height: 20px !important;
          max-height: 20px !important;
          margin: 0 0 7px !important;
          padding: 0 !important;
          font-size: 12px !important;
          font-weight: 750 !important;
          line-height: 20px !important;
          box-sizing: border-box !important;
        }

        /* =====================================
           DOB DISPLAY

           Safari's original date input
           is still fully interactive.
           Its visual border is replaced
           with a reliably sized box.
           ===================================== */

        #${SCREEN}
        #manaDobAgeRow104992
        .mana-dob-display-105032 {
          position: relative !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;

          width: 100% !important;
          height: 48px !important;
          min-height: 48px !important;
          max-height: 48px !important;
          min-width: 0 !important;

          margin: 0 !important;
          padding: 0 11px !important;

          border: 1px solid #4B535D !important;
          border-radius: 10px !important;
          background: #101215 !important;
          color: #FFFFFF !important;

          font-family: inherit !important;
          font-size: 16px !important;
          line-height: 48px !important;
          text-align: left !important;
          box-sizing: border-box !important;

          pointer-events: none !important;
          overflow: hidden !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992
        .mana-dob-display-105032
        .mana-dob-text-105032 {
          display: block !important;
          flex: 1 1 auto !important;
          min-width: 0 !important;
          color: #FFFFFF !important;
          font-size: 16px !important;
          line-height: 1 !important;
          font-weight: 500 !important;
          white-space: nowrap !important;
          text-align: left !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992
        .mana-dob-display-105032
        .mana-dob-icon-105032 {
          flex: 0 0 16px !important;
          width: 16px !important;
          height: 16px !important;
          margin-left: 6px !important;
          color: #9EA6B1 !important;
          line-height: 1 !important;
        }

        /* Native date input remains clickable
           above the display. Its own borders
           cannot overlap the Age box. */

        #${SCREEN}
        #manaDobAgeRow104992
        #me-dob {
          position: absolute !important;
          z-index: 2 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          top: auto !important;

          display: block !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          height: 48px !important;
          min-height: 48px !important;
          max-height: 48px !important;

          margin: 0 !important;
          padding: 0 !important;
          border: 0 !important;
          border-radius: 10px !important;

          opacity: 0.01 !important;
          background: transparent !important;
          box-sizing: border-box !important;

          -webkit-appearance: none !important;
          appearance: none !important;

          cursor: pointer !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992
        > *:focus-within
        .mana-dob-display-105032 {
          border-color: #FF7927 !important;
          outline: 2px solid #FF7927 !important;
          outline-offset: 1px !important;
        }

        /* =====================================
           AGE

           Identical box dimensions and
           vertically centred text.
           ===================================== */

        #${SCREEN}
        #manaDobAgeRow104992
        #manaProfileAge {
          display: block !important;
          position: relative !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;

          height: 48px !important;
          min-height: 48px !important;
          max-height: 48px !important;

          margin: 0 !important;
          padding: 0 11px !important;

          border: 1px solid #4B535D !important;
          border-radius: 10px !important;
          background: #101215 !important;

          color: #FF7927 !important;
          -webkit-text-fill-color: #FF7927 !important;

          font-family: inherit !important;
          font-size: 16px !important;
          font-weight: 500 !important;
          line-height: normal !important;

          opacity: 1 !important;
          box-sizing: border-box !important;
          transform: none !important;
        }

        /* =====================================
           NAME / HEIGHT / WEIGHT
           ===================================== */

        #${SCREEN}
        #manaNameRow104992,
        #${SCREEN}
        #manaHeightWeightRow105022 {
          display: grid !important;
          grid-template-columns:
            repeat(2,minmax(0,1fr)) !important;
          gap: 8px !important;
          width: 100% !important;
        }

        /* =====================================
           MOBILE COACH HUB WIDTH
           ===================================== */

        #coachView:not(.hide),
        #coachClientDetailView:not(.hide) {
          width: calc(100vw - 12px) !important;
          max-width: calc(100vw - 12px) !important;
          margin-left:
            calc(50% - 50vw + 6px) !important;
          margin-right: 0 !important;
          padding-left: 3px !important;
          padding-right: 3px !important;
          box-sizing: border-box !important;
        }

        #coachHomePage,
        #manaCoachSuite104707,
        #manaCoachSuite104707 [data-mcn-view],
        #manaCoachSettings105010,
        #manaCoachSettingsExtra105013,
        #coachClientDetailView > .card,
        #coachClientDetailView
        #manaCoachProfile104950 {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          box-sizing: border-box !important;
        }

        #manaCoachSuite104707 .mcn-panel {
          padding: 12px !important;
        }

        #coachView .mcn-stats,
        #coachView .mcn-pay-grid {
          min-width: 0 !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     DATE DISPLAY

     Original date remains YYYY-MM-DD
     internally for existing Save Profile.

     Display is DD/MM/YYYY only.
     ===================================================== */

  function formatDate(value) {
    const match = String(value || "").match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

    if (!match) return "DD/MM/YYYY";

    return (
      match[3] + "/" +
      match[2] + "/" +
      match[1]
    );
  }

  function updateDOB() {
    const input = $("me-dob");
    const output = document.querySelector(
      ".mana-dob-text-105032"
    );

    if (!input || !output) return;

    const value = formatDate(input.value);

    if (output.textContent !== value) {
      output.textContent = value;
    }
  }

  function setupDOB() {
    const input = $("me-dob");

    if (!input) return;

    const field = input.closest(
      ".me-field, .mana-profile-field"
    );

    if (!field) return;

    if (
      !field.querySelector(
        ".mana-dob-display-105032"
      )
    ) {
      const display =
        document.createElement("div");

      display.className =
        "mana-dob-display-105032";

      display.setAttribute(
        "aria-hidden",
        "true"
      );

      display.innerHTML = `
        <span class="mana-dob-text-105032">
          DD/MM/YYYY
        </span>

        <svg
          class="mana-dob-icon-105032"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="5"
            width="18" height="16"
            rx="2"/>
          <path d="M7 3v4M17 3v4M3 10h18"/>
        </svg>
      `;

      field.appendChild(display);
    }

    if (!input.dataset.manaDOB105032) {
      input.dataset.manaDOB105032 = "1";

      input.addEventListener(
        "input",
        updateDOB
      );

      input.addEventListener(
        "change",
        updateDOB
      );
    }

    updateDOB();
  }

  /* =====================================================
     EXISTING INPUT FOCUS PROTECTION
     ===================================================== */

  function endGuard() {
    if (guardTimer) {
      clearInterval(guardTimer);
    }

    guardTimer = null;
    active = null;
  }

  function startGuard(input) {
    if (!input || !FIELDS.has(input.id)) return;

    endGuard();

    active = input;
    lastValue = input.value;
    editingAt = Date.now();

    guardTimer = setInterval(() => {
      if (!active || !active.isConnected) {
        endGuard();
        return;
      }

      if (
        document.activeElement !== active
      ) return;

      if (active.value !== lastValue) {
        active.value = lastValue;
        if (active.id === "me-dob") {
          updateDOB();
        }
      }
    }, 130);
  }

  function connect() {
    const screen = $(SCREEN);

    if (!screen || root === screen) {
      return;
    }

    root = screen;

    screen.addEventListener(
      "focusin",
      event => {
        const input = event.target;

        if (
          input instanceof HTMLInputElement &&
          FIELDS.has(input.id)
        ) {
          startGuard(input);
        }
      },
      true
    );

    screen.addEventListener(
      "input",
      event => {
        if (event.target === active) {
          lastValue = active.value;
          editingAt = Date.now();
        }

        if (event.target?.id === "me-dob") {
          updateDOB();
        }
      },
      true
    );

    screen.addEventListener(
      "change",
      event => {
        if (event.target === active) {
          lastValue = active.value;
        }

        if (event.target?.id === "me-dob") {
          updateDOB();
        }
      },
      true
    );

    screen.addEventListener(
      "focusout",
      event => {
        if (event.target !== active) return;

        const old = active;
        const value = lastValue;

        setTimeout(() => {
          if (
            old.isConnected &&
            old.value !== value &&
            Date.now() - editingAt < 2500
          ) {
            old.value = value;
          }

          if (active === old) {
            endGuard();
          }

          updateDOB();
        }, 250);
      },
      true
    );

    screen.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            "#manaProfileSave"
          )
        ) {
          endGuard();
          updateDOB();
        }
      },
      true
    );
  }

  /* =====================================================
     INITIALISE
     ===================================================== */

  function refreshDOB() {
    setupDOB();
    updateDOB();
  }

  function init() {
    installStyles();
    connect();

    refreshDOB();

    [150,500,1100].forEach(delay => {
      setTimeout(refreshDOB,delay);
    });

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            '[data-open-profile],#manaProfileButton'
          )
        ) {
          setTimeout(refreshDOB,150);
          setTimeout(refreshDOB,600);
        }
      }
    );

    window.addEventListener(
      "mana:profile-synced",
      refreshDOB
    );

    window.addEventListener(
      "pageshow",
      () => {
        connect();
        refreshDOB();
      }
    );

    window.MANA_PROFILE_MOBILE_BUILD = BUILD;

    console.log(
      "[Mana Movement] Mobile DOB " +
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
