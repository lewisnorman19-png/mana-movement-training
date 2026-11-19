
/* ==========================================================
   MANA MOVEMENT TRAINING
   MOBILE PROFILE ALIGNMENT
   BUILD 105023

   COMPLETE REPLACEMENT:
   mana_profile_mobile_stability_105016.js

   MOBILE ONLY:
   - Email Address gets a full-width row
   - Contact Number appears underneath
   - DOB and Age align correctly
   - Safari date control has adequate space
   - Height and Weight remain side by side
   - First and Last Name remain side by side

   PRESERVES:
   - Perfect laptop layout (105022)
   - Existing client profile fields and saving
   - Input focus protection
   - Full-width mobile Coach Hub
   - Client photos and camera
   - Coach Hub, Chat and navigation

   NO DATABASE CHANGES.
   ========================================================== */

(() => {
  "use strict";

  const BUILD = "105023";
  const FLAG = "MANA_PROFILE_MOBILE_105023";
  const STYLE = "manaProfileMobileStyle105023";
  const SCREEN = "manaProfileScreen";

  if (window[FLAG]) return;
  window[FLAG] = true;

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

  function $(id) {
    return document.getElementById(id);
  }

  /* =====================================================
     STYLES
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* Shared field safety */

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

      /* ======================================
         PHONE ONLY
         ====================================== */

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

        /* ===================================
           EMAIL AND CONTACT NUMBER

           Two separate full-width rows.
           Preserve the original inputs.
           =================================== */

        #${SCREEN}
        #manaEmailPhoneRow105022 {
          display: grid !important;
          grid-template-columns:
            minmax(0,1fr) !important;
          gap: 12px !important;
          width: 100% !important;
          min-width: 0 !important;
        }

        #${SCREEN}
        #manaEmailPhoneRow105022
        > .me-field {
          grid-column: 1 / -1 !important;
          display: block !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
        }

        #${SCREEN}
        #manaEmailPhoneRow105022
        #me-account-email {
          display: block !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          min-height: 48px !important;
          height: 48px !important;
          padding: 11px 12px !important;
          font-size: 16px !important;
          line-height: 24px !important;
          border-radius: 10px !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          background: #171A1F !important;
          color: #D1D5DB !important;
          -webkit-text-fill-color:
            #D1D5DB !important;
          opacity: 1 !important;
        }

        #${SCREEN}
        #manaEmailPhoneRow105022
        #me-phone {
          width: 100% !important;
          min-height: 48px !important;
          height: 48px !important;
          font-size: 16px !important;
          padding: 11px 12px !important;
        }

        /* ===================================
           DOB / AGE ROW

           Correct vertical alignment and
           adequate Safari date-field width.
           =================================== */

        #${SCREEN}
        #manaDobAgeRow104992 {
          display: grid !important;
          grid-template-columns:
            minmax(0,1fr) 78px !important;
          align-items: start !important;
          column-gap: 10px !important;
          row-gap: 0 !important;
          width: 100% !important;
          min-width: 0 !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992
        > .me-field,
        #${SCREEN}
        #manaDobAgeRow104992
        > .mana-profile-field {
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          align-self: start !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992 label {
          display: flex !important;
          align-items: center !important;
          min-height: 20px !important;
          height: 20px !important;
          margin: 0 0 7px !important;
          padding: 0 !important;
          font-size: 12px !important;
          line-height: 20px !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992
        #me-dob,
        #${SCREEN}
        #manaDobAgeRow104992
        #manaProfileAge {
          display: block !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          height: 48px !important;
          min-height: 48px !important;
          max-height: 48px !important;
          box-sizing: border-box !important;
          margin: 0 !important;
          border: 1px solid #4B535D !important;
          border-radius: 10px !important;
          background: #101215 !important;
          font-size: 16px !important;
          line-height: normal !important;
          vertical-align: top !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992
        #me-dob {
          padding: 8px 6px !important;
          color: #FFFFFF !important;
          -webkit-text-fill-color:
            #FFFFFF !important;
          appearance: auto !important;
          -webkit-appearance: auto !important;
          text-align: left !important;
          text-align-last: left !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992
        #me-dob::-webkit-date-and-time-value {
          text-align: left !important;
          min-height: 24px !important;
          line-height: 24px !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992
        #me-dob::-webkit-datetime-edit {
          display: inline-flex !important;
          align-items: center !important;
          padding: 0 !important;
          line-height: 24px !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992
        #me-dob::-webkit-calendar-picker-indicator {
          width: 15px !important;
          height: 15px !important;
          margin-left: 3px !important;
          flex-shrink: 0 !important;
        }

        #${SCREEN}
        #manaDobAgeRow104992
        #manaProfileAge {
          padding: 10px 8px !important;
          color: #FF7927 !important;
          opacity: 1 !important;
        }

        /* ===================================
           OTHER PERSONAL DETAILS PAIRS
           =================================== */

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

        /* ===================================
           WIDER MOBILE COACH HUB
           =================================== */

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
        #manaCoachSuite104707
        [data-mcn-view],
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

        #manaCoachSuite104707
        .mcn-panel {
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
     INPUT STABILITY

     Preserve the value in a focused input
     if an older asynchronous profile loader
     attempts to overwrite it.

     No navigation or database changes.
     ===================================================== */

  function endGuard() {
    if (guardTimer) {
      clearInterval(guardTimer);
    }

    guardTimer = null;
    active = null;
  }

  function startGuard(input) {
    if (
      !input ||
      !FIELDS.has(input.id)
    ) return;

    endGuard();

    active = input;
    lastValue = input.value;
    editingAt = Date.now();

    guardTimer = setInterval(() => {
      if (
        !active ||
        !active.isConnected
      ) {
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

    if (!screen || root === screen) {
      return;
    }

    root = screen;

    screen.addEventListener(
      "focusin",
      event => {
        const target = event.target;

        if (
          target instanceof HTMLInputElement &&
          FIELDS.has(target.id)
        ) {
          startGuard(target);
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
      },
      true
    );

    screen.addEventListener(
      "change",
      event => {
        if (event.target === active) {
          lastValue = active.value;
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
        }
      },
      true
    );
  }

  /* =====================================================
     INITIALISE
     ===================================================== */

  function init() {
    installStyles();
    connect();

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            '[data-open-profile],#manaProfileButton'
          )
        ) {
          setTimeout(connect, 0);
        }
      }
    );

    window.addEventListener(
      "pageshow",
      connect
    );

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
