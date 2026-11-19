
/* ==========================================================
   MANA MOVEMENT TRAINING
   PROFILE & COACH HUB REPAIRS
   BUILD 105025

   COMPLETE NEW FILE:
   mana_profile_coach_repairs_105025.js

   FIXES:
   - Hide up/down arrows on number inputs
   - Keep normal keyboard number entry
   - Ensure Gender is visible in Client Profile
   - Restore missing Coach Hub Settings button
   - Preserve five-tab Coach Hub navigation
   - Clear stale visible fields on account switch

   DOES NOT CHANGE:
   - Database records
   - Existing training programs
   - Payment or chat functionality
   - Original workout/history data
   ========================================================== */

(() => {
  "use strict";

  const FLAG = "MANA_REPAIRS_105025";
  if (window[FLAG]) return;
  window[FLAG] = true;

  const BUILD = "105025";
  const STYLE = "manaRepairsStyle105025";
  const SCREEN = "manaProfileScreen";
  const NAV = "manaV97CoachNav";
  const SETTINGS = "manaCoachSuite104707";

  const $ = id => document.getElementById(id);

  let lastAccount = "";
  let observedNav = null;
  let navObserver = null;
  let pending = false;

  /* =====================================================
     CSS
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const sheet = document.createElement("style");
    sheet.id = STYLE;

    sheet.textContent = `

      /* ===================================
         REMOVE NUMBER INPUT SPINNERS
         =================================== */

      #${SCREEN}
      input[type="number"] {
        appearance: textfield !important;
        -moz-appearance: textfield !important;
        -webkit-appearance: none !important;
      }

      #${SCREEN}
      input[type="number"]::-webkit-outer-spin-button,
      #${SCREEN}
      input[type="number"]::-webkit-inner-spin-button {
        display: none !important;
        margin: 0 !important;
        -webkit-appearance: none !important;
      }

      /*
       Keep number entry and validation.
       Only the visual arrows are removed.
      */

      /* ===================================
         GENDER IN CLIENT PROFILE
         =================================== */

      #${SCREEN}
      #manaGenderRow105022 {
        display: grid !important;
        visibility: visible !important;
        grid-template-columns:
          minmax(0,1fr) !important;
        width: 100% !important;
        min-width: 0 !important;
        opacity: 1 !important;
      }

      #${SCREEN}
      #manaGenderRow105022
      .mana-profile-field {
        display: block !important;
        visibility: visible !important;
        width: 100% !important;
        opacity: 1 !important;
      }

      #${SCREEN}
      #manaGenderRow105022
      #manaProfileGender {
        display: block !important;
        visibility: visible !important;
        width: 100% !important;
        min-height: 46px !important;
        background: #101215 !important;
        color: #FFFFFF !important;
        border: 1px solid #4B535D !important;
        opacity: 1 !important;
      }

      /* ===================================
         COACH HUB FIVE-TAB LAYOUT
         =================================== */

      #${NAV} .mana-v970-nav-inner {
        display: grid !important;
        grid-template-columns:
          repeat(5,minmax(0,1fr)) !important;
        gap: 7px !important;
        width: min(980px,100%) !important;
      }

      #${NAV}
      .mana-v970-tab {
        display: block !important;
        visibility: visible !important;
        min-width: 0 !important;
        opacity: 1 !important;
      }

      #${NAV}
      [data-coach-page="profile"] {
        display: block !important;
        visibility: visible !important;
        order: 5 !important;
      }

      #${NAV}
      [data-coach-page="profile"]
      .mcn-tab-label {
        display: block !important;
      }

      @media(max-width:390px) {
        #${NAV} .mana-v970-nav-inner {
          gap: 4px !important;
        }

        #${NAV} .mana-v970-tab {
          font-size: 9px !important;
          padding-left: 2px !important;
          padding-right: 2px !important;
        }
      }
    `;

    document.head.appendChild(sheet);
  }

  /* =====================================================
     NUMBER ENTRY

     Keep type="number" for compatibility
     with existing nutrition calculations.
     Prevent mouse wheel changing a focused
     number without user typing.
     ===================================================== */

  function connectNumbers() {
    const screen = $(SCREEN);
    if (!screen) return;

    screen.querySelectorAll(
      'input[type="number"]'
    ).forEach(input => {
      if (input.dataset.manaNumber105025) return;

      input.dataset.manaNumber105025 = "1";

      input.addEventListener(
        "wheel",
        event => {
          if (document.activeElement === input) {
            input.blur();
          }
        },
        {passive:true}
      );
    });
  }

  /* =====================================================
     GENDER FIELD
     ===================================================== */

  function ensureGender() {
    const screen = $(SCREEN);

    if (
      !screen ||
      !screen.classList.contains("open")
    ) return;

    const select = $("manaProfileGender");

    if (!select) return;

    const wrapper = select.closest(
      ".mana-profile-field"
    );

    if (!wrapper) return;

    const row = $("manaGenderRow105022");

    /*
     Build 105022 normally places Gender.
     Only repair it if a previous layout
     has left it outside its correct row.
    */

    if (
      row &&
      !row.contains(wrapper)
    ) {
      const focused =
        screen.contains(document.activeElement) &&
        document.activeElement?.matches(
          "input,select,textarea"
        );

      if (focused) return;

      row.appendChild(wrapper);
    }

    wrapper.style.removeProperty("display");
    wrapper.hidden = false;

    select.hidden = false;
    select.disabled = false;

    const label = wrapper.querySelector("label");

    if (label) {
      label.textContent = "Gender";
    }

    if (!select.dataset.manaGender105025) {
      select.dataset.manaGender105025 = "1";

      /*
       No forced default selection.
       A new client begins with Select.
      */
    }
  }

  /* =====================================================
     COACH HUB SETTINGS NAVIGATION
     ===================================================== */

  function restoreSettings() {
    const nav = $(NAV);

    if (!nav) return;

    const inner = nav.querySelector(
      ".mana-v970-nav-inner"
    );

    if (!inner) return;

    let button = inner.querySelector(
      '[data-coach-page="profile"]'
    );

    /*
     The original coach navigation should
     already have this button.
     Re-create it only if actually missing.
    */

    if (!button) {
      button = document.createElement("button");

      button.type = "button";
      button.className = "mana-v970-tab";

      button.dataset.coachPage = "profile";
      button.dataset.mcnTab = "settings";

      button.innerHTML = `
        <span class="mana-v970-tab-icon">⚙</span>
        <span class="mcn-tab-label">Settings</span>
      `;

      inner.appendChild(button);
    }

    button.dataset.coachPage = "profile";
    button.dataset.mcnTab = "settings";
    button.style.order = "5";
    button.hidden = false;

    const label = button.querySelector(
      ".mcn-tab-label"
    );

    if (label) {
      label.textContent = "Settings";
    }

    const icon = button.querySelector(
      ".mana-v970-tab-icon"
    );

    if (icon) {
      icon.textContent = "⚙";
    }

    /*
     The existing Coach Navigation 104707
     handles clicks using data-mcn-tab.
     We do not create a second click handler.
    */
  }

  function scheduleNav() {
    if (pending) return;

    pending = true;

    requestAnimationFrame(() => {
      pending = false;
      restoreSettings();
    });
  }

  function observeNav() {
    const nav = $(NAV);

    if (!nav || observedNav === nav) return;

    navObserver?.disconnect();
    observedNav = nav;

    navObserver = new MutationObserver(
      scheduleNav
    );

    navObserver.observe(nav,{
      childList:true,
      subtree:false
    });

    restoreSettings();
  }

  /* =====================================================
     ACCOUNT-SWITCH VISIBLE FIELD CLEANUP

     Does not delete stored or cloud data.
     Prevents old form values remaining on
     screen while another account loads.
     ===================================================== */

  function clearVisibleProfile() {
    const screen = $(SCREEN);
    if (!screen) return;

    const ids = [
      "manaProfileName",
      "manaProfileAge",
      "manaProfileGender",
      "manaProfileHeight",
      "manaProfileWeight",
      "manaProfileGoal",
      "manaProfileDays",
      "manaProfileExperience",
      "manaProfileEquipment",
      "me-first_name",
      "me-last_name",
      "me-dob",
      "me-phone",
      "me-country",
      "me-state",
      "me-city",
      "me-postcode",
      "me-emergency_name",
      "me-emergency_phone",
      "me-target_weight",
      "me-injuries",
      "me-training_preferences",
      "me-dietary_preferences",
      "me-account-email"
    ];

    for (const id of ids) {
      const input = $(id);

      if (!input) continue;

      if (
        input instanceof HTMLInputElement ||
        input instanceof HTMLSelectElement ||
        input instanceof HTMLTextAreaElement
      ) {
        input.value = "";
      }
    }

    const consent = $("me-share-coach");

    if (consent) {
      consent.checked = false;
    }

    const avatar = $("me-preview-avatar");

    if (avatar) {
      avatar.replaceChildren(
        document.createTextNode("+")
      );
    }

    const photos = [
      "baseline-front",
      "baseline-side",
      "baseline-back",
      "progress-front",
      "progress-side",
      "progress-back"
    ];

    for (const photo of photos) {
      const holder = $("me-preview-" + photo);

      if (holder) {
        holder.textContent = "No photo";
      }
    }
  }

  async function checkAccount() {
    if (
      typeof window.supabaseClient !==
      "function"
    ) return;

    try {
      const db = await window.supabaseClient();

      const {data,error} =
        await db.auth.getUser();

      if (error) return;

      const id = data?.user?.id || "";

      if (lastAccount === id) return;

      const wasSignedIn = lastAccount !== "";

      lastAccount = id;

      if (wasSignedIn) {
        clearVisibleProfile();
      }

    } catch (error) {
      console.warn(
        "[Mana Repairs] Account check:",
        error
      );
    }
  }

  /* =====================================================
     INIT
     ===================================================== */

  async function init() {
    installStyles();

    connectNumbers();
    ensureGender();
    observeNav();

    [150,500,1100].forEach(delay => {
      setTimeout(() => {
        connectNumbers();
        ensureGender();
        observeNav();
      },delay);
    });

    document.addEventListener(
      "click",
      event => {
        if (event.target.closest?.(
          '[data-open-profile],#manaProfileButton'
        )) {
          setTimeout(() => {
            connectNumbers();
            ensureGender();
          },150);
        }
      }
    );

    window.addEventListener(
      "pageshow",
      () => {
        connectNumbers();
        ensureGender();
        observeNav();
        void checkAccount();
      }
    );

    await checkAccount();

    try {
      if (
        typeof window.supabaseClient ===
        "function"
      ) {
        const db = await window.supabaseClient();

        db.auth.onAuthStateChange(() => {
          setTimeout(() => {
            void checkAccount();
          },100);
        });
      }
    } catch (_) {}

    window.MANA_REPAIRS_BUILD = BUILD;

    console.log(
      "[Mana Movement] Repairs " +
      BUILD + " active"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {void init();},
      {once:true}
    );
  } else {
    void init();
  }

})();
