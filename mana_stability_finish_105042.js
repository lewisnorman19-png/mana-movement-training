
/*
 MANA MOVEMENT — BUILD 105047
 REFRESH AND STARTUP STABILITY

 Complete replacement:
 mana_stability_finish_105042.js

 Fixes:
 - Learning tab after page refresh
 - DOB restoration after authentication
 - Profile shortcut after navigation
 - Delayed profile rendering

 Preserves existing program navigation.
 Does not change Home banner styling.
*/

(() => {
  "use strict";

  if (window.MANA_STABILITY_105047) return;
  window.MANA_STABILITY_105047 = true;

  const $ = id => document.getElementById(id);
  const STYLE = "mana-stability-style-105047";
  const TABLE = "client_extended_profiles";

  const css = `
    /* STRENGTH OVERVIEW PROFILE */

    #manaV83ProgramShell
    #manaQuickProfile105047 {
      display: inline-flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      align-items: center !important;
      justify-content: center !important;
      min-height: 36px !important;
      padding: 7px 12px !important;
      background: #15171B !important;
      border: 1px solid #FF7927 !important;
      border-radius: 11px !important;
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
      font: 800 12px system-ui,sans-serif !important;
      white-space: nowrap !important;
      cursor: pointer !important;
    }

    #manaV964Launchpad .mana-hub-home-row {
      display: flex !important;
      align-items: center !important;
      justify-content: flex-end !important;
      gap: 10px !important;
    }

    /* PRESERVE ALL FIVE ORIGINAL STRENGTH TABS */

    #manaV83ProgramShell.open #manaV83Tabs {
      display: grid !important;
      grid-template-columns:
        repeat(5,minmax(0,1fr)) !important;
    }

    #manaV83ProgramShell.open #manaV83Tabs
    .mana-v83-tab[data-v83-tab="learn"] {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      min-width: 0 !important;
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV83ProgramShell.open #manaV83Tabs
    .mana-v83-tab.active[data-v83-tab="learn"] {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }
  `;

  function installStyles() {
    let style = $(STYLE);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE;
      document.head.appendChild(style);
    }

    style.textContent = css;
  }

  /* ORIGINAL STRENGTH OVERVIEW */

  function overviewOpen() {
    return !!(
      $("manaV83ProgramShell")
        ?.classList.contains("open") &&
      $("manaV83Title")
        ?.textContent.trim().toUpperCase() ===
          "MANA STRENGTH" &&
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      )?.dataset.v83Tab === "overview"
    );
  }

  function ensureProfileShortcut() {
    if (!overviewOpen()) return;

    const launch = $("manaV964Launchpad");
    const row = launch?.querySelector(
      ".mana-hub-home-row"
    );

    if (!row) return;

    let button = $("manaQuickProfile105047");

    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.id = "manaQuickProfile105047";
      button.textContent = "Profile";

      button.addEventListener("click", () => {
        $("manaV964Launchpad")?.querySelector(
          '[data-v964-launch="profile"]'
        )?.click();
      });
    }

    if (button.parentElement !== row) {
      row.appendChild(button);
    }
  }

  /* REBUILD LEARNING THROUGH ORIGINAL NAVIGATION */

  let lastNavRepair = 0;
  let repairingNavigation = false;

  function ensureLearning() {
    const shell = $("manaV83ProgramShell");
    const tabs = $("manaV83Tabs");

    if (!shell?.classList.contains("open") ||
        !tabs) return;

    const learn = tabs.querySelector(
      '[data-v83-tab="learn"]'
    );

    if (learn) {
      learn.hidden = false;
      learn.style.removeProperty("display");
      learn.style.removeProperty("visibility");
      return;
    }

    if (repairingNavigation) return;

    const now = Date.now();

    if (now - lastNavRepair < 1500) return;

    const active = tabs.querySelector(
      ".mana-v83-tab.active"
    );

    if (!active ||
        typeof active.onclick !== "function") {
      return;
    }

    lastNavRepair = now;
    repairingNavigation = true;

    try {
      /*
       Use the original tab handler.
       It regenerates all five navigation
       buttons, including Learn.
      */
      active.click();
    } finally {
      repairingNavigation = false;
    }
  }

  /* DOB — ACCOUNT-SCOPED RESTORATION */

  let db = null;
  let uid = "";
  let rememberedDOB = "";
  let connecting = false;
  let lastAuthCheck = 0;
  let saving = false;

  function validDOB(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
      return false;
    }

    const date = new Date(value + "T12:00:00");

    return !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0,10) === value &&
      date <= new Date();
  }

  function localKey() {
    return uid
      ? "mana-dob-secure-scope-" + uid
      : "";
  }

  function rememberDOB(value) {
    if (!validDOB(value)) return;

    rememberedDOB = value;

    if (!uid) return;

    try {
      localStorage.setItem(localKey(),value);
    } catch (error) {
      console.warn("[Mana DOB] Local save",error);
    }
  }

  function restoreDOB() {
    const screen = $("manaProfileScreen");
    const input = $("me-dob");

    if (!screen?.classList.contains("open") ||
        !input ||
        !validDOB(rememberedDOB)) return;

    if (document.activeElement === input) return;

    if (validDOB(input.value)) {
      if (input.value !== rememberedDOB) {
        rememberDOB(input.value);
      }
      return;
    }

    input.value = rememberedDOB;

    input.dispatchEvent(
      new Event("input",{bubbles:true})
    );

    input.dispatchEvent(
      new Event("change",{bubbles:true})
    );
  }

  async function connectClient() {
    if (connecting) return;

    if (typeof window.supabaseClient !== "function") {
      return;
    }

    const now = Date.now();

    if (now - lastAuthCheck < 1500) return;
    lastAuthCheck = now;
    connecting = true;

    try {
      const client = await window.supabaseClient();
      const auth = await client.auth.getUser();
      const id = auth.data?.user?.id;

      if (!id) {
        db = null;
        uid = "";
        rememberedDOB = "";
        return;
      }

      if (uid !== id) {
        uid = id;
        rememberedDOB = "";
      }

      db = client;

      try {
        const local = localStorage.getItem(
          localKey()
        );

        if (validDOB(local) &&
            !validDOB(rememberedDOB)) {
          rememberedDOB = local;
        }
      } catch (_) {}

      const response = await db
        .from(TABLE)
        .select("details")
        .eq("user_id",uid)
        .maybeSingle();

      if (response.error) {
        throw response.error;
      }

      const cloudDOB = response.data?.details?.dob;

      if (validDOB(cloudDOB)) {
        rememberDOB(cloudDOB);
      }

      restoreDOB();

    } catch (error) {
      console.warn(
        "[Mana DOB] Authentication/load:",
        error.message || error
      );
    } finally {
      connecting = false;
    }
  }

  async function saveDOBCloud() {
    if (saving || !db || !uid ||
        !validDOB(rememberedDOB)) return;

    saving = true;
    const accountId = uid;
    const dobToSave = rememberedDOB;

    try {
      const auth = await db.auth.getUser();

      if (auth.data?.user?.id !== accountId) {
        return;
      }

      const existing = await db
        .from(TABLE)
        .select("details,share_with_coach")
        .eq("user_id",accountId)
        .maybeSingle();

      if (existing.error) throw existing.error;

      const details = {
        ...(existing.data?.details || {}),
        dob: dobToSave
      };

      const result = await db
        .from(TABLE)
        .upsert({
          user_id: accountId,
          details,
          share_with_coach:
            existing.data?.share_with_coach ?? false,
          updated_at: new Date().toISOString()
        },{
          onConflict: "user_id"
        });

      if (result.error) throw result.error;

    } catch (error) {
      console.warn(
        "[Mana DOB] Cloud save:",
        error.message || error
      );
    } finally {
      saving = false;
    }
  }

  /* STARTUP AND SCREEN RESTORATION */

  let refreshQueued = false;

  function refresh() {
    ensureLearning();
    ensureProfileShortcut();
    restoreDOB();
  }

  function queueRefresh() {
    if (refreshQueued) return;

    refreshQueued = true;

    requestAnimationFrame(() => {
      refreshQueued = false;
      refresh();
    });
  }

  function init() {
    installStyles();

    /*
     Recheck auth when the app starts,
     even if Profile is not the first screen.
    */
    void connectClient();

    document.addEventListener("input", event => {
      if (event.target?.id === "me-dob") {
        rememberDOB(event.target.value);
      }
    },true);

    document.addEventListener("change", event => {
      if (event.target?.id === "me-dob") {
        rememberDOB(event.target.value);
      }
    },true);

    document.addEventListener("click", event => {
      if (event.target?.closest?.("#manaProfileSave")) {
        const dob = $("me-dob")?.value;
        if (validDOB(dob)) {
          rememberDOB(dob);
        }
      }

      if (event.target?.closest?.(
        "#manaV83Tabs, #manaV80HomeBtn"
      )) {
        queueRefresh();
      }
    },true);

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
      queueRefresh
    );

    window.addEventListener("pageshow", () => {
      void connectClient();
      queueRefresh();
    });

    const strengthHolder = $("manaV83Content");

    if (strengthHolder) {
      new MutationObserver(queueRefresh)
        .observe(strengthHolder,{
          childList:true,
          subtree:false
        });
    }

    const tabHolder = $("manaV83Tabs");

    if (tabHolder) {
      new MutationObserver(queueRefresh)
        .observe(tabHolder,{
          childList:true,
          subtree:false
        });
    }

    /*
     Safety check for asynchronous
     cloud loading and profile rebuilding.
    */
    setInterval(() => {
      if (!uid) {
        void connectClient();
      }

      refresh();
    },800);

    refresh();

    window.MANA_STABILITY_BUILD = "105047";

    console.log(
      "[Mana Movement] Refresh stability 105047 ready"
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
