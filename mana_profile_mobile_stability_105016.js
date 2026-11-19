
/* ==========================================================
   MANA MOVEMENT TRAINING
   MOBILE PROFILE STABILITY
   BUILD 105030

   COMPLETE REPLACEMENT:
   mana_profile_mobile_stability_105016.js

   FIX:
   - DOB and Age same vertical alignment on phones
   - Consistent label and input heights
   - Native Safari date picker retained

   PRESERVES:
   - Working laptop layout
   - Full-width mobile email
   - Contact number below email
   - Name, Gender, Height and Weight
   - Mobile Coach Hub width
   - Existing input protection
   - All saving, photos and navigation

   No database changes.
   ========================================================== */

(() => {
  "use strict";

  const BUILD = "105030";
  const FLAG = "MANA_PROFILE_MOBILE_105030";
  const STYLE = "manaProfileMobileStyle105030";
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
     MOBILE CSS
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

      /* PHONE ONLY */

      @media (max-width:600px) {

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
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          font-size: 16px !important;
        }

        /* =====================================
           EMAIL: FULL WIDTH
           PHONE: ITS OWN ROW
           ===================================== */

        #${SCREEN}
        #manaEmailPhoneRow105022 {
          display: grid !important;
          grid-template-columns: minmax(0,1fr) !important;
          width: 100% !important;
          min-width: 0 !important;
          gap: 12px !important;
        }

        #${SCREEN}
        #manaEmailPhoneRow105022 > * {
          display: block !important;
          grid-column: 1 / -1 !important;
          width: 100% !important;
          min-width: 0 !important;
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
          min-width: 0 !important;
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
          text-overflow: ellipsis !important;
          opacity: 1 !important;
        }

        /* =====================================
           DOB AND AGE — FIXED ALIGNMENT

           Same grid, same label height,
           same input height and box sizing.
           Native Safari date picker retained.
           ===================================== */

        #${SCREEN}
        #manaDobAgeRow104992 {
          display: grid !important;
          grid-template-columns:
            minmax(0,1fr) 84px !important;
          gap: 10px !important;
          align-items: start !important;
          width: 100% !important;
          min-width: 0 !important;
          margin: 4px 0 10px !important;
          padding: 0 !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992 > * {
          display: flex !important;
          flex-direction: column !important;
          align-items: stretch !important;
          justify-content: flex-start !important;
          min-width: 0 !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          align-self: start !important;
          box-sizing: border-box !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992 label {
          display: block !important;
          flex: 0 0 20px !important;
          width: 100% !important;
          min-height: 20px !important;
          height: 20px !important;
          max-height: 20px !important;
          margin: 0 0 7px !important;
          padding: 0 !important;
          font-size: 12px !important;
          font-weight: 750 !important;
          line-height: 20px !important;
          box-sizing: border-box !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992
        #me-dob,
        #${SCREEN}
        #manaDobAgeRow104992
        #manaProfileAge {
          display: block !important;
          position: relative !important;
          flex: 0 0 48px !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          height: 48px !important;
          min-height: 48px !important;
          max-height: 48px !important;
          margin: 0 !important;
          border: 1px solid #4B535D !important;
          border-radius: 10px !important;
          background: #101215 !important;
          color: #FFFFFF !important;
          font-family: inherit !important;
          font-size: 16px !important;
          font-weight: 500 !important;
          line-height: normal !important;
          vertical-align: top !important;
          box-sizing: border-box !important;
          transform: none !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992
        #me-dob {
          padding: 0 7px !important;
          -webkit-appearance: auto !important;
          appearance: auto !important;
          text-align: left !important;
          color-scheme: dark;
        }

        #${SCREEN}
        #manaDobAgeRow104992
        #me-dob::-webkit-date-and-time-value {
          min-height: 0 !important;
          height: auto !important;
          line-height: normal !important;
          text-align: left !important;
          padding: 0 !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992
        #me-dob::-webkit-datetime-edit {
          padding: 0 !important;
          margin: 0 !important;
          line-height: normal !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992
        #me-dob::-webkit-calendar-picker-indicator {
          width: 15px !important;
          height: 15px !important;
          margin: 0 0 0 2px !important;
          opacity: 1 !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992
        #manaProfileAge {
          padding: 0 10px !important;
          color: #FF7927 !important;
          opacity: 1 !important;
        }

        /* =====================================
           KEEP NAME / HEIGHT / WEIGHT PAIRED
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
           KEEP COACH HUB WIDE ON PHONE
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
     EXISTING INPUT STABILITY
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

      if (document.activeElement !== active) {
        return;
      }

      if (active.value !== lastValue) {
        active.value = lastValue;
      }
    }, 130);
  }

  function connect() {
    const screen = $(SCREEN);

    if (!screen || root === screen) return;

    root = screen;

    screen.addEventListener("focusin", event => {
      const input = event.target;

      if (
        input instanceof HTMLInputElement &&
        FIELDS.has(input.id)
      ) {
        startGuard(input);
      }
    }, true);

    screen.addEventListener("input", event => {
      if (event.target === active) {
        lastValue = active.value;
        editingAt = Date.now();
      }
    }, true);

    screen.addEventListener("change", event => {
      if (event.target === active) {
        lastValue = active.value;
      }
    }, true);

    screen.addEventListener("focusout", event => {
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
      }, 250);
    }, true);

    screen.addEventListener("click", event => {
      if (
        event.target.closest?.("#manaProfileSave")
      ) {
        endGuard();
      }
    }, true);
  }

  /* =====================================================
     INITIALISE
     ===================================================== */

  function init() {
    installStyles();
    connect();

    document.addEventListener("click", event => {
      if (
        event.target.closest?.(
          '[data-open-profile],#manaProfileButton'
        )
      ) {
        setTimeout(connect, 0);
      }
    });

    window.addEventListener("pageshow", connect);

    window.MANA_PROFILE_MOBILE_BUILD = BUILD;

    console.log(
      "[Mana Movement] Mobile Profile " +
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
