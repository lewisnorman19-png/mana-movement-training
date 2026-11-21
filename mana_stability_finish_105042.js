
/*
 MANA MOVEMENT — BUILD 105044
 Complete replacement for:
 mana_stability_finish_105042.js

 Learning retained.
 Profile shortcut restored.
 DOB protected and synchronised.
 Home banners corrected.
*/

(() => {
  "use strict";

  if (window.MANA_REPAIR_105044) return;
  window.MANA_REPAIR_105044 = true;

  const $ = id => document.getElementById(id);
  const STYLE = "manaRepairStyle105044";
  const DOB_TABLE = "client_extended_profiles";

  const css = `
    /* Remove original active-program gold streak */

    html body #manaV80Home
    button.mana-v8013-program.current::before,
    html body #manaV80Home
    #manaV80Strength.current::before,
    html body #manaV80Home
    #manaV80Mana28.current::before {
      content: none !important;
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      background: transparent !important;
    }

    html body #manaV80Home
    button.mana-v8013-program.current {
      border: 1px solid #FF7927 !important;
      box-shadow: 0 8px 22px rgba(0,0,0,.2)
        !important;
    }

    /* Restore permanent Strength Profile shortcut */

    #manaV83ProgramShell
    #manaQuickProfile105044 {
      display: inline-flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      align-items: center !important;
      justify-content: center !important;
      background: #15171B !important;
      border: 1px solid #FF7927 !important;
      border-radius: 11px !important;
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
      font: 800 12px system-ui,sans-serif
        !important;
      padding: 7px 12px !important;
      min-height: 36px !important;
      cursor: pointer !important;
      white-space: nowrap !important;
    }

    #manaV964Launchpad
    .mana-hub-home-row:has(#manaQuickProfile105044) {
      display: flex !important;
      align-items: center !important;
      justify-content: flex-end !important;
      gap: 10px !important;
    }

    /* Keep Learning in its original five-tab grid */

    #manaV83ProgramShell.open
    #manaV83Tabs {
      display: grid !important;
      grid-template-columns:
        repeat(5,minmax(0,1fr)) !important;
    }

    #manaV83ProgramShell.open
    #manaV83Tabs
    [data-v83-tab="learn"] {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      color: #FFFFFF !important;
    }

    #manaV83ProgramShell.open
    #manaV83Tabs
    [data-v83-tab="learn"].active {
      color: #FF7927 !important;
    }

    /* ManaLyfe: separate icon from heading */

    @media (max-width: 600px) {
      #manaV80Home #manaV80Life
      > .mana-v8013-program-label {
        position: absolute !important;
        top: 19px !important;
        left: 18px !important;
        right: 105px !important;
        width: auto !important;
        max-width: none !important;
        font-size: 19px !important;
        line-height: 1.15 !important;
        white-space: nowrap !important;
        z-index: 5 !important;
      }

      #manaV80Home #manaV80Life
      > .m1025-home-icon,
      #manaV80Home #manaV80Life
      > .mana-v1024-home-art {
        position: absolute !important;
        top: 17px !important;
        right: 16px !important;
        left: auto !important;
        width: 62px !important;
        height: 62px !important;
        z-index: 8 !important;
      }

      #manaV80Home #manaV80Life > h2 {
        position: absolute !important;
        top: 98px !important;
        left: 18px !important;
        right: 18px !important;
        width: calc(100% - 36px) !important;
        max-width: calc(100% - 36px) !important;
        margin: 0 !important;
        font-size: 21px !important;
        line-height: 1.13 !important;
        z-index: 5 !important;
      }

      #manaV80Home #manaV80Life
      > h2 .mana-lyfe-line-105041 {
        display: block !important;
        width: 100% !important;
        white-space: nowrap !important;
      }

      #manaV80Home #manaV80Life > p {
        top: 187px !important;
        left: 18px !important;
        right: 18px !important;
        width: calc(100% - 36px) !important;
        font-size: 12px !important;
        line-height: 1.35 !important;
      }

      #manaV80Home #manaV80Life::before {
        left: 18px !important;
        right: auto !important;
        bottom: 14px !important;
        width: 56% !important;
        max-width: 56% !important;
        font-size: 11px !important;
        line-height: 1.25 !important;
        text-align: left !important;
      }
    }

    @media (max-width: 360px) {
      #manaV80Home #manaV80Life > h2 {
        font-size: 20px !important;
      }
    }
  `;

  function installCSS() {
    let style = $(STYLE);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE;
      document.head.appendChild(style);
    }
    style.textContent = css;
  }

  /* STRENGTH PROFILE */

  function strengthOverview() {
    const shell = $("manaV83ProgramShell");
    const active = document.querySelector(
      "#manaV83Tabs .mana-v83-tab.active"
    );

    return !!(
      shell?.classList.contains("open") &&
      $("manaV83Title")?.textContent
        ?.trim().toUpperCase() ===
          "MANA STRENGTH" &&
      active?.dataset.v83Tab === "overview"
    );
  }

  function maintainProfile() {
    if (!strengthOverview()) return;

    const launch = $("manaV964Launchpad");
    const row = launch?.querySelector(
      ".mana-hub-home-row"
    );

    if (!launch || !row) return;

    let button = $("manaQuickProfile105044");

    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.id = "manaQuickProfile105044";
      button.textContent = "Profile";

      button.addEventListener("click", () => {
        launch.querySelector(
          '[data-v964-launch="profile"]'
        )?.click();
      });
    }

    if (button.parentElement !== row) {
      row.appendChild(button);
    }
  }

  /* STRENGTH LEARNING */

  let learnButton = null;

  function maintainLearning() {
    const shell = $("manaV83ProgramShell");
    const tabs = $("manaV83Tabs");

    if (!shell?.classList.contains("open") ||
        !tabs) return;

    const current = tabs.querySelector(
      '[data-v83-tab="learn"]'
    );

    if (current) {
      learnButton = current;
      current.hidden = false;
      current.style.removeProperty("display");
      return;
    }

    if (learnButton && !learnButton.isConnected) {
      tabs.appendChild(learnButton);
    }
  }

  /* DOB — ACCOUNT-SCOPED STORAGE */

  let client = null;
  let userId = "";
  let rememberedDob = "";
  let savingDob = false;
  let profileWasOpen = false;

  function validDOB(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
      return false;
    }

    const date = new Date(value + "T12:00:00");

    return !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0,10) === value &&
      date <= new Date();
  }

  function storageKey() {
    return userId
      ? "mana-dob-secure-scope-" + userId
      : "";
  }

  function rememberDOB(value) {
    if (!validDOB(value)) return;

    rememberedDob = value;

    const key = storageKey();
    if (!key) return;

    try {
      localStorage.setItem(key,value);
    } catch (error) {
      console.warn("[Mana DOB] Local save",error);
    }
  }

  function restoreDOB() {
    const screen = $("manaProfileScreen");
    const input = $("me-dob");

    if (!screen?.classList.contains("open") ||
        !input ||
        !validDOB(rememberedDob)) return;

    if (document.activeElement === input) return;

    if (validDOB(input.value)) {
      if (input.value !== rememberedDob) {
        rememberDOB(input.value);
      }
      return;
    }

    input.value = rememberedDob;

    input.dispatchEvent(
      new Event("input",{bubbles:true})
    );

    input.dispatchEvent(
      new Event("change",{bubbles:true})
    );
  }

  async function connectDOB() {
    if (typeof window.supabaseClient !== "function") {
      return;
    }

    try {
      const db = await window.supabaseClient();
      const auth = await db.auth.getUser();
      const id = auth.data?.user?.id;

      if (!id) return;

      if (userId !== id) {
        userId = id;
        rememberedDob = "";
      }

      client = db;

      const key = storageKey();
      const local = key
        ? localStorage.getItem(key)
        : null;

      if (validDOB(local) && !rememberedDob) {
        rememberedDob = local;
      }

      const result = await db
        .from(DOB_TABLE)
        .select("details")
        .eq("user_id",id)
        .maybeSingle();

      if (result.error) {
        console.warn(
          "[Mana DOB] Read:",
          result.error.message
        );
        return;
      }

      const remote = result.data?.details?.dob;

      if (validDOB(remote) && !rememberedDob) {
        rememberDOB(remote);
      }

      restoreDOB();

    } catch (error) {
      console.warn("[Mana DOB] Connection",error);
    }
  }

  async function saveDOBCloud() {
    if (savingDob ||
        !client ||
        !userId ||
        !validDOB(rememberedDob)) return;

    savingDob = true;

    try {
      const auth = await client.auth.getUser();

      if (auth.data?.user?.id !== userId) return;

      const existing = await client
        .from(DOB_TABLE)
        .select("details,share_with_coach")
        .eq("user_id",userId)
        .maybeSingle();

      if (existing.error) throw existing.error;

      const details = {
        ...(existing.data?.details || {}),
        dob: rememberedDob
      };

      const result = await client
        .from(DOB_TABLE)
        .upsert({
          user_id: userId,
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
        "[Mana DOB] Save:",
        error.message || error
      );
    } finally {
      savingDob = false;
    }
  }

  function checkDOB() {
    const screen = $("manaProfileScreen");
    const input = $("me-dob");

    const open = !!screen?.classList
      .contains("open");

    if (open && !profileWasOpen) {
      [100,400,900,1600].forEach(delay => {
        setTimeout(restoreDOB,delay);
      });
    }

    profileWasOpen = open;

    if (!open || !input) return;

    if (validDOB(input.value) &&
        input.value !== rememberedDob) {
      rememberDOB(input.value);
    }

    if (!validDOB(input.value)) {
      restoreDOB();
    }
  }

  /* MANA LYFE HEADING */

  function maintainLyfe() {
    const heading = document.querySelector(
      "#manaV80Home #manaV80Life > h2"
    );

    if (!heading) return;

    const values = [
      "Reset.",
      "Rebuild.",
      "Move Forward."
    ];

    const existing = heading.querySelectorAll(
      ":scope > .mana-lyfe-line-105041"
    );

    if (
      existing.length === 3 &&
      values.every(
        (text,i) => existing[i].textContent === text
      )
    ) return;

    heading.replaceChildren(
      ...values.map(text => {
        const span = document.createElement("span");
        span.className = "mana-lyfe-line-105041";
        span.textContent = text;
        return span;
      })
    );
  }

  function maintain() {
    maintainLearning();
    maintainProfile();
    checkDOB();
    maintainLyfe();
  }

  function init() {
    installCSS();

    void connectDOB();

    document.addEventListener("input",event => {
      if (event.target?.id === "me-dob") {
        rememberDOB(event.target.value);
      }
    },true);

    document.addEventListener("change",event => {
      if (event.target?.id === "me-dob") {
        rememberDOB(event.target.value);
      }
    },true);

    document.addEventListener("click",event => {
      if (event.target?.closest?.("#manaProfileSave")) {
        const value = $("me-dob")?.value;

        if (validDOB(value)) {
          rememberDOB(value);
        }
      }

      if (event.target?.closest?.(
        "#manaV83Tabs, #manaV80HomeBtn"
      )) {
        requestAnimationFrame(maintain);
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
      () => requestAnimationFrame(maintain)
    );

    window.addEventListener("pageshow",() => {
      void connectDOB();
      maintain();
    });

    setInterval(maintain,1200);

    maintain();

    console.log(
      "[Mana Movement] Repair build 105044 ready"
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
