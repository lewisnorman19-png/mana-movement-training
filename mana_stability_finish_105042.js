
/*
====================================================
MANA MOVEMENT — BUILD 105050

MOBILE REFRESH AND FLICKER REPAIR

COMPLETE REPLACEMENT:
mana_stability_finish_105042.js

PURPOSE
- Stop automatic navigation re-click loops
- Preserve the original five-tab navigation
- Restore Learning if Overview loses its button
- Load DOB independently of the Profile screen
- Preserve existing Profile / Goals card
- Remove redundant top-right Profile shortcut
- Leave desktop layout and Coach Hub unchanged

No permanent interval loops.
No automatic tab clicks.
No replacement of program content.
====================================================
*/

(() => {
  "use strict";

  const BUILD = "105050";
  const FLAG = "MANA_STABILITY_105050";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  const STYLE_ID = "manaStabilityStyle105050";
  const TABLE = "client_extended_profiles";

  const DUPLICATE_PROFILE_IDS = [
    "manaQuickProfile105042",
    "manaQuickProfile105044",
    "manaQuickProfile105046",
    "manaQuickProfile105047"
  ];

  let db = null;
  let userId = "";
  let savedDOB = "";

  let connecting = false;
  let loadingProfile = false;

  let navigationObserver = null;
  let profileObserver = null;

  let learningRepairQueued = false;

  /* ========================================
     MOBILE-ONLY STYLES
     ======================================== */

  function installStyles() {
    let style = $(STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `
      /*
       Remove redundant Profile shortcut.
       Keep the Profile / Goals card.
      */

      ${DUPLICATE_PROFILE_IDS
        .map(id => "#" + id)
        .join(",")} {
        display: none !important;
      }

      /*
       Maintain the original five-column
       navigation on mobile.
      */

      @media (max-width: 700px) {
        #manaV83ProgramShell.open
        #manaV83Tabs {
          display: grid !important;
          grid-template-columns:
            repeat(5, minmax(0, 1fr)) !important;
        }

        #manaV83ProgramShell.open
        #manaV83Tabs
        [data-v83-tab="learn"] {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          min-width: 0 !important;
        }

        #manaV83ProgramShell.open
        #manaV83Tabs
        [data-v83-tab="learn"].active {
          color: #FF7927 !important;
          -webkit-text-fill-color:
            #FF7927 !important;
        }
      }
    `;
  }

  /* ========================================
     REMOVE DUPLICATE PROFILE BUTTON
     ======================================== */

  function removeDuplicateProfile() {
    DUPLICATE_PROFILE_IDS.forEach(id => {
      $(id)?.remove();
    });
  }

  /* ========================================
     LEARNING NAVIGATION
     ======================================== */

  function strengthOpen() {
    const shell = $("manaV83ProgramShell");

    const title = String(
      $("manaV83Title")?.textContent || ""
    ).trim().toUpperCase();

    return (
      shell?.classList.contains("open") &&
      title === "MANA STRENGTH"
    );
  }

  function learningButtonExists() {
    return !!document.querySelector(
      '#manaV83Tabs [data-v83-tab="learn"]'
    );
  }

  /*
   Only repair when the original Strength
   navigation has already rendered.

   Do not automatically click Overview,
   Workouts or any other tab.
  */

  function ensureLearning() {
    if (!strengthOpen()) return;

    const tabs = $("manaV83Tabs");

    if (!tabs) return;

    const existing = tabs.querySelector(
      '[data-v83-tab="learn"]'
    );

    if (existing) {
      existing.hidden = false;
      existing.style.removeProperty("display");
      existing.style.removeProperty(
        "visibility"
      );
      return;
    }

    const originalButtons = Array.from(
      tabs.querySelectorAll(
        ".mana-v83-tab[data-v83-tab]"
      )
    );

    if (originalButtons.length < 4) {
      return;
    }

    /*
     Recreate only the missing navigation
     control, not the entire tab bar.
    */

    const button = document.createElement(
      "button"
    );

    button.type = "button";
    button.className = "mana-v83-tab";
    button.dataset.v83Tab = "learn";
    button.textContent = "Learn";

    button.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        /*
         Ask the original program module
         to construct the real navigation.

         This happens only when the user
         presses Learn, never automatically.
        */

        if (
          typeof window.openManaProgram !==
          "function"
        ) return;

        window.openManaProgram("strength");

        const realLearn =
          $("manaV83Tabs")?.querySelector(
            '[data-v83-tab="learn"]'
          );

        if (
          realLearn &&
          realLearn !== button
        ) {
          realLearn.click();
        }
      }
    );

    tabs.appendChild(button);

    console.log(
      "[Mana Learning] Missing button restored"
    );
  }

  /*
   Schedule one DOM check after the existing
   navigation completes its own rendering.
  */

  function scheduleLearningCheck() {
    if (learningRepairQueued) return;

    learningRepairQueued = true;

    requestAnimationFrame(() => {
      learningRepairQueued = false;
      ensureLearning();
    });
  }

  function watchNavigation() {
    const tabs = $("manaV83Tabs");

    if (!tabs) return;

    if (navigationObserver) {
      navigationObserver.disconnect();
    }

    navigationObserver = new MutationObserver(
      scheduleLearningCheck
    );

    navigationObserver.observe(tabs, {
      childList: true
    });

    scheduleLearningCheck();
  }

  /* ========================================
     DOB VALIDATION
     ======================================== */

  function validDOB(value) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        String(value || "")
      )
    ) {
      return false;
    }

    const date = new Date(
      value + "T12:00:00"
    );

    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) ===
        value &&
      date <= new Date()
    );
  }

  function dobStorageKey() {
    return userId
      ? "mana-dob-secure-scope-" + userId
      : "";
  }

  function rememberDOB(value) {
    if (!userId || !validDOB(value)) {
      return;
    }

    savedDOB = value;

    try {
      localStorage.setItem(
        dobStorageKey(),
        value
      );
    } catch (error) {
      console.warn(
        "[Mana DOB] Storage:",
        error
      );
    }
  }

  /* ========================================
     AUTHENTICATED DOB LOADING
     ======================================== */

  async function connectClient() {
    if (connecting) return;

    if (
      typeof window.supabaseClient !==
      "function"
    ) {
      return;
    }

    connecting = true;

    try {
      const client =
        await window.supabaseClient();

      const auth =
        await client.auth.getUser();

      const nextUserId =
        auth.data?.user?.id || "";

      if (!nextUserId) {
        db = null;
        userId = "";
        savedDOB = "";
        return;
      }

      db = client;

      if (userId !== nextUserId) {
        userId = nextUserId;
        savedDOB = "";
      }

      let localDOB = "";

      try {
        localDOB =
          localStorage.getItem(
            dobStorageKey()
          ) || "";
      } catch (_) {}

      if (validDOB(localDOB)) {
        savedDOB = localDOB;
      }

      const response = await client
        .from(TABLE)
        .select("details")
        .eq("user_id", userId)
        .maybeSingle();

      if (response.error) {
        throw response.error;
      }

      const remoteDOB =
        response.data?.details?.dob;

      if (validDOB(remoteDOB)) {
        rememberDOB(remoteDOB);
      }

      restoreDOB();

      console.log(
        "[Mana DOB] Account profile loaded"
      );

    } catch (error) {
      console.warn(
        "[Mana DOB] Load:",
        error.message || error
      );
    } finally {
      connecting = false;
    }
  }

  /* ========================================
     RESTORE DATE WITHOUT REBUILDING PROFILE
     ======================================== */

  function restoreDOB() {
    const screen = $("manaProfileScreen");
    const input = $("me-dob");

    if (
      !screen?.classList.contains("open") ||
      !input ||
      !validDOB(savedDOB)
    ) return;

    if (document.activeElement === input) {
      return;
    }

    /*
     Preserve a valid date already entered
     by the user. Restore only blank input.
    */

    if (validDOB(input.value)) {
      return;
    }

    input.value = savedDOB;

    /*
     Refresh existing DOB/Age display.
     Do not create new date elements.
    */

    input.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );

    input.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );
  }

  /* ========================================
     WATCH PROFILE OPENING
     ======================================== */

  function watchProfile() {
    const screen = $("manaProfileScreen");

    if (!screen) return;

    if (profileObserver) {
      profileObserver.disconnect();
    }

    profileObserver = new MutationObserver(
      () => {
        if (
          screen.classList.contains("open")
        ) {
          restoreDOB();

          /*
           Existing profile modules load
           their fields asynchronously.
           Use bounded checks rather than
           a permanent interval.
          */

          [150, 500, 1000].forEach(delay => {
            setTimeout(restoreDOB, delay);
          });
        }
      }
    );

    profileObserver.observe(screen, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  /* ========================================
     PROFILE DATA EVENTS
     ======================================== */

  function installDOBEvents() {
    document.addEventListener(
      "input",
      event => {
        if (
          event.target?.id === "me-dob"
        ) {
          rememberDOB(
            event.target.value
          );
        }
      },
      true
    );

    document.addEventListener(
      "change",
      event => {
        if (
          event.target?.id === "me-dob"
        ) {
          rememberDOB(
            event.target.value
          );
        }
      },
      true
    );

    window.addEventListener(
      "mana:profile-synced",
      restoreDOB
    );

    window.addEventListener(
      "mana:extended-profile-saved",
      () => {
        const current =
          $("me-dob")?.value;

        if (validDOB(current)) {
          rememberDOB(current);
        }

        restoreDOB();
      }
    );
  }

  /* ========================================
     STARTUP
     ======================================== */

  function init() {
    installStyles();

    removeDuplicateProfile();

    watchNavigation();
    watchProfile();

    installDOBEvents();

    window.addEventListener(
      "mana:program-tab-change",
      scheduleLearningCheck
    );

    window.addEventListener(
      "pageshow",
      () => {
        void connectClient();
        scheduleLearningCheck();
        restoreDOB();
      }
    );

    /*
     Only bounded authentication retries.
     No permanent refresh loop.
    */

    void connectClient();

    [300, 900, 1800].forEach(delay => {
      setTimeout(() => {
        if (!userId) {
          void connectClient();
        }
      }, delay);
    });

    /*
     Remove legacy Profile shortcut after
     initial asynchronous screen rendering.
    */

    [150, 600].forEach(delay => {
      setTimeout(
        removeDuplicateProfile,
        delay
      );
    });

    window.MANA_STABILITY_BUILD = BUILD;

    console.log(
      "[Mana Movement] Stability " +
      BUILD +
      " ready"
    );
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
