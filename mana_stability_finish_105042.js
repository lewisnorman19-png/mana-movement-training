
/*
 MANA MOVEMENT — BUILD 105048

 MOBILE REFRESH STABILITY
 Complete replacement for:
 mana_stability_finish_105042.js

 - Removes duplicate Profile shortcut
 - Preserves Profile / Goals card
 - Restores Learning navigation
 - Loads DOB after authentication
 - Restores DOB after cloud/profile loading
 - Preserves existing workout and coach logic
 - No desktop layout modifications
*/

(() => {
  "use strict";

  if (window.MANA_STABILITY_105048) return;
  window.MANA_STABILITY_105048 = true;

  const $ = id => document.getElementById(id);

  const STYLE_ID = "manaStabilityStyle105048";
  const TABLE = "client_extended_profiles";

  const css = `
    /* MOBILE LEARNING NAVIGATION */

    @media (max-width: 700px) {
      #manaV83ProgramShell.open
      #manaV83Tabs {
        display: grid !important;
        grid-template-columns:
          repeat(5, minmax(0, 1fr)) !important;
      }

      #manaV83ProgramShell.open
      #manaV83Tabs
      .mana-v83-tab[data-v83-tab="learn"] {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        min-width: 0 !important;
        color: #FFFFFF !important;
        -webkit-text-fill-color:
          #FFFFFF !important;
      }

      #manaV83ProgramShell.open
      #manaV83Tabs
      .mana-v83-tab.active[data-v83-tab="learn"] {
        color: #FF7927 !important;
        -webkit-text-fill-color:
          #FF7927 !important;
      }
    }

    /* REMOVE EXTRA TOP-RIGHT PROFILE SHORTCUT */

    #manaQuickProfile105042,
    #manaQuickProfile105044,
    #manaQuickProfile105046,
    #manaQuickProfile105047 {
      display: none !important;
    }
  `;

  function installCSS() {
    let style = $(STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = css;
  }

  function removeDuplicateProfile() {
    [
      "manaQuickProfile105042",
      "manaQuickProfile105044",
      "manaQuickProfile105046",
      "manaQuickProfile105047"
    ].forEach(id => $(id)?.remove());
  }

  /* LEARNING — USE ORIGINAL NAVIGATION */

  let savedLearnButton = null;
  let lastRepair = 0;
  let repairing = false;

  function maintainLearning() {
    const shell = $("manaV83ProgramShell");
    const tabs = $("manaV83Tabs");

    if (!shell?.classList.contains("open") ||
        !tabs) return;

    const existing = tabs.querySelector(
      '[data-v83-tab="learn"]'
    );

    if (existing) {
      savedLearnButton = existing;
      existing.hidden = false;
      existing.style.removeProperty("display");
      existing.style.removeProperty("visibility");
      return;
    }

    /*
      Prefer the original button, which
      already has its proper click handler.
    */

    if (
      savedLearnButton &&
      !savedLearnButton.isConnected
    ) {
      tabs.appendChild(savedLearnButton);
      return;
    }

    /*
      If the tab was missing on initial
      load, ask the original navigation
      handler to rebuild its five buttons.
    */

    if (repairing) return;

    const now = Date.now();

    if (now - lastRepair < 1800) return;

    const active = tabs.querySelector(
      ".mana-v83-tab.active"
    );

    if (!active ||
        typeof active.onclick !== "function") {
      return;
    }

    repairing = true;
    lastRepair = now;

    try {
      active.onclick.call(active);
    } catch (error) {
      console.warn(
        "[Mana Learning] Navigation repair:",
        error
      );
    } finally {
      repairing = false;
    }
  }

  /* DOB — AUTHENTICATED CLIENT RECOVERY */

  let db = null;
  let userId = "";
  let savedDOB = "";
  let connecting = false;
  let authReady = false;
  let cloudSaving = false;
  let lastAuthAttempt = 0;

  function validDOB(value) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        String(value || "")
      )
    ) return false;

    const date = new Date(value + "T12:00:00");

    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value &&
      date <= new Date()
    );
  }

  function storageKey() {
    return userId
      ? "mana-dob-secure-scope-" + userId
      : "";
  }

  function rememberDOB(value) {
    if (!authReady || !validDOB(value)) return;

    savedDOB = value;

    try {
      localStorage.setItem(
        storageKey(),
        value
      );
    } catch (error) {
      console.warn(
        "[Mana DOB] Local storage:",
        error
      );
    }
  }

  function restoreDOB() {
    const screen = $("manaProfileScreen");
    const input = $("me-dob");

    if (
      !authReady ||
      !screen?.classList.contains("open") ||
      !input
    ) return;

    if (document.activeElement === input) return;

    if (validDOB(input.value)) {
      if (input.value !== savedDOB) {
        rememberDOB(input.value);
      }
      return;
    }

    if (!validDOB(savedDOB)) return;

    input.value = savedDOB;

    input.dispatchEvent(
      new Event("input", { bubbles: true })
    );

    input.dispatchEvent(
      new Event("change", { bubbles: true })
    );
  }

  async function connectClient() {
    if (connecting) return;

    if (
      typeof window.supabaseClient !== "function"
    ) return;

    const now = Date.now();

    if (now - lastAuthAttempt < 1500) return;

    lastAuthAttempt = now;
    connecting = true;

    try {
      const client = await window.supabaseClient();
      const auth = await client.auth.getUser();
      const id = auth.data?.user?.id;

      if (!id) {
        authReady = false;
        db = null;
        userId = "";
        savedDOB = "";
        return;
      }

      if (id !== userId) {
        userId = id;
        savedDOB = "";
      }

      db = client;

      try {
        const local = localStorage.getItem(
          storageKey()
        );

        if (
          validDOB(local) &&
          !validDOB(savedDOB)
        ) {
          savedDOB = local;
        }
      } catch (_) {}

      const result = await db
        .from(TABLE)
        .select("details")
        .eq("user_id", id)
        .maybeSingle();

      if (result.error) {
        throw result.error;
      }

      const remoteDOB =
        result.data?.details?.dob;

      if (validDOB(remoteDOB)) {
        savedDOB = remoteDOB;

        try {
          localStorage.setItem(
            storageKey(),
            remoteDOB
          );
        } catch (_) {}
      }

      authReady = true;
      restoreDOB();

    } catch (error) {
      console.warn(
        "[Mana DOB] Cloud load:",
        error.message || error
      );
    } finally {
      connecting = false;
    }
  }

  async function saveDOBCloud() {
    if (
      cloudSaving ||
      !authReady ||
      !db ||
      !userId ||
      !validDOB(savedDOB)
    ) return;

    cloudSaving = true;

    const account = userId;
    const date = savedDOB;

    try {
      const auth = await db.auth.getUser();

      if (
        auth.data?.user?.id !== account
      ) return;

      const existing = await db
        .from(TABLE)
        .select("details,share_with_coach")
        .eq("user_id", account)
        .maybeSingle();

      if (existing.error) {
        throw existing.error;
      }

      const details = {
        ...(existing.data?.details || {}),
        dob: date
      };

      const result = await db
        .from(TABLE)
        .upsert({
          user_id: account,
          details,
          share_with_coach:
            existing.data?.share_with_coach ??
            false,
          updated_at:
            new Date().toISOString()
        }, {
          onConflict: "user_id"
        });

      if (result.error) {
        throw result.error;
      }

    } catch (error) {
      console.warn(
        "[Mana DOB] Cloud save:",
        error.message || error
      );
    } finally {
      cloudSaving = false;
    }
  }

  /* SCREEN STABILITY */

  let refreshQueued = false;

  function maintain() {
    removeDuplicateProfile();
    maintainLearning();
    restoreDOB();
  }

  function scheduleMaintain() {
    if (refreshQueued) return;

    refreshQueued = true;

    requestAnimationFrame(() => {
      refreshQueued = false;
      maintain();
    });
  }

  function init() {
    installCSS();

    /*
      Load client profile even when starting
      from Home or Strength Overview.
    */

    void connectClient();

    document.addEventListener(
      "input",
      event => {
        if (event.target?.id === "me-dob") {
          rememberDOB(event.target.value);
        }
      },
      true
    );

    document.addEventListener(
      "change",
      event => {
        if (event.target?.id === "me-dob") {
          rememberDOB(event.target.value);
        }
      },
      true
    );

    document.addEventListener(
      "click",
      event => {
        if (
          event.target?.closest?.(
            "#manaProfileSave"
          )
        ) {
          rememberDOB(
            $("me-dob")?.value
          );
        }

        if (
          event.target?.closest?.(
            "#manaV83Tabs"
          )
        ) {
          scheduleMaintain();
        }
      },
      true
    );

    window.addEventListener(
      "mana:extended-profile-saved",
      () => {
        restoreDOB();
        void saveDOBCloud();
      }
    );

    window.addEventListener(
      "mana:profile-synced",
      restoreDOB
    );

    window.addEventListener(
      "mana:program-tab-change",
      scheduleMaintain
    );

    window.addEventListener(
      "pageshow",
      () => {
        void connectClient();
        scheduleMaintain();
      }
    );

    /*
      Watch original navigation changes.
      Do not replace working click handlers.
    */

    const tabs = $("manaV83Tabs");

    if (tabs) {
      new MutationObserver(
        scheduleMaintain
      ).observe(tabs, {
        childList: true
      });
    }

    const holder = $("manaV83Content");

    if (holder) {
      new MutationObserver(
        scheduleMaintain
      ).observe(holder, {
        childList: true,
        subtree: false
      });
    }

    /*
      Limited ongoing startup check.
      No full profile-screen rebuilding.
    */

    setInterval(() => {
      if (!authReady) {
        void connectClient();
      }

      maintain();
    }, 1200);

    maintain();

    window.MANA_STABILITY_BUILD = "105048";

    console.log(
      "[Mana Movement] Stability 105048 ready"
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
