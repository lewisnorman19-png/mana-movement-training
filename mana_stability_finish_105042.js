
/*
  MANA MOVEMENT
  MOBILE STABILITY REPAIR — BUILD 105043

  Complete replacement for:
  mana_stability_finish_105042.js

  Repairs:
  - Strength Learning navigation
  - Client DOB persistence
  - Original yellow banner streak
  - ManaLyfe text and spacing

  Preserves the working Profile shortcut.
*/

(() => {
  "use strict";

  if (window.MANA_STABILITY_105043) return;
  window.MANA_STABILITY_105043 = true;

  const $ = id => document.getElementById(id);
  const ORANGE = "#FF7927";
  const STYLE = "mana-stability-style-105043";

  const css = `
    /* REMOVE THE ORIGINAL GOLD CURRENT STRIPE */

    html body #manaV80Home
    button.mana-v8013-program.current::before,
    html body #manaV80Home
    button#manaV80Mana28::before,
    html body #manaV80Home
    button#manaV80Strength::before {
      content: none !important;
      display: none !important;
      height: 0 !important;
      background: none !important;
      box-shadow: none !important;
    }

    /* PRESERVE THE ORANGE PROGRAM BORDERS */

    html body #manaV80Home
    button.mana-v8013-program {
      border-color: ${ORANGE} !important;
    }

    /* MANA LYFE HEADING AND ICON CLEARANCE */

    @media (max-width: 600px) {

      html body #manaV80Home
      #manaV80Life
      > .mana-v8013-program-label {
        position: absolute !important;
        top: 20px !important;
        left: 18px !important;
        right: 102px !important;
        width: auto !important;
        max-width: none !important;
        font-size: 20px !important;
        line-height: 1.15 !important;
        overflow-wrap: normal !important;
        z-index: 5 !important;
      }

      html body #manaV80Home
      #manaV80Life
      > .m1025-home-icon,
      html body #manaV80Home
      #manaV80Life
      > .mana-v1024-home-art {
        position: absolute !important;
        top: 17px !important;
        right: 15px !important;
        left: auto !important;
        width: 62px !important;
        height: 62px !important;
        z-index: 7 !important;
      }

      html body #manaV80Home
      #manaV80Life > h2 {
        position: absolute !important;
        top: 97px !important;
        left: 18px !important;
        right: 18px !important;
        width: calc(100% - 36px) !important;
        max-width: calc(100% - 36px) !important;
        margin: 0 !important;
        font-size: 22px !important;
        line-height: 1.12 !important;
        text-align: left !important;
        z-index: 5 !important;
      }

      html body #manaV80Home
      #manaV80Life > h2
      .mana-lyfe-line-105041 {
        display: block !important;
        width: 100% !important;
        white-space: nowrap !important;
        margin: 0 !important;
      }

      html body #manaV80Home
      #manaV80Life > p {
        position: absolute !important;
        top: 190px !important;
        left: 18px !important;
        right: 18px !important;
        width: calc(100% - 36px) !important;
        font-size: 12px !important;
        line-height: 1.35 !important;
        z-index: 4 !important;
      }

      html body #manaV80Home
      #manaV80Life::before {
        left: 18px !important;
        right: auto !important;
        bottom: 13px !important;
        width: 55% !important;
        max-width: 55% !important;
        font-size: 11px !important;
        line-height: 1.25 !important;
        text-align: left !important;
      }
    }

    @media (max-width: 360px) {
      html body #manaV80Home
      #manaV80Life > h2 {
        font-size: 20px !important;
      }

      html body #manaV80Home
      #manaV80Life > p {
        top: 184px !important;
      }
    }

    /* STRENGTH LEARNING NAVIGATION */

    html body #manaV83ProgramShell.open
    #manaV83Tabs {
      display: grid !important;
      grid-template-columns:
        repeat(5, minmax(0, 1fr)) !important;
      width: 100% !important;
    }

    html body #manaV83ProgramShell.open
    #manaV83Tabs
    [data-v83-tab="learn"] {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      min-width: 0 !important;
      color: #FFFFFF !important;
      -webkit-text-fill-color:
        #FFFFFF !important;
    }

    html body #manaV83ProgramShell.open
    #manaV83Tabs
    [data-v83-tab="learn"].active {
      color: ${ORANGE} !important;
      -webkit-text-fill-color:
        ${ORANGE} !important;
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

  /* LEARNING: PRESERVE THE ORIGINAL BUTTON
     AND ITS EXISTING CLICK HANDLER */

  let learningButton = null;

  function maintainLearning() {
    const shell = $("manaV83ProgramShell");
    const tabs = $("manaV83Tabs");

    if (!shell?.classList.contains("open") ||
        !tabs) return;

    const current = tabs.querySelector(
      '[data-v83-tab="learn"]'
    );

    if (current) {
      learningButton = current;
      current.hidden = false;
      current.style.removeProperty("display");
      return;
    }

    if (learningButton &&
        !learningButton.isConnected) {
      tabs.appendChild(learningButton);
    }
  }

  /* DATE OF BIRTH — USER-SCOPED BACKUP */

  let userId = "";
  let cloud = null;
  let savedDob = "";
  let cloudSaving = false;
  let pendingCloudSave = false;

  const validDob = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
      return false;
    }

    const date = new Date(value + "T12:00:00");

    return !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value &&
      date <= new Date();
  };

  function dobKey() {
    return userId
      ? "mana-client-dob:" + userId
      : "";
  }

  function saveLocalDob(value) {
    if (!validDob(value)) return;

    savedDob = value;

    const key = dobKey();

    if (!key) return;

    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("[Mana DOB] Local backup", error);
    }
  }

  function restoreDob() {
    const screen = $("manaProfileScreen");
    const input = $("me-dob");

    if (!screen?.classList.contains("open") ||
        !input ||
        !savedDob ||
        !validDob(savedDob)) return;

    if (validDob(input.value)) {
      if (input.value !== savedDob) {
        saveLocalDob(input.value);
      }
      return;
    }

    if (document.activeElement === input) return;

    input.value = savedDob;

    input.dispatchEvent(
      new Event("input", { bubbles: true })
    );

    input.dispatchEvent(
      new Event("change", { bubbles: true })
    );
  }

  async function connectCloud() {
    if (typeof window.supabaseClient !== "function") {
      return;
    }

    try {
      const client = await window.supabaseClient();
      const response = await client.auth.getUser();
      const user = response.data?.user;

      if (!user) return;

      if (userId !== user.id) {
        userId = user.id;
        savedDob = "";
      }

      cloud = client;

      const key = dobKey();

      if (key) {
        const local = localStorage.getItem(key);

        if (validDob(local) && !savedDob) {
          savedDob = local;
        }
      }

      const result = await cloud
        .from("client_extended_profiles")
        .select("details")
        .eq("user_id", userId)
        .maybeSingle();

      if (result.error) {
        console.warn(
          "[Mana DOB] Cloud read:",
          result.error.message
        );
        return;
      }

      const remoteDob = result.data?.details?.dob;

      if (validDob(remoteDob)) {
        saveLocalDob(remoteDob);
      }

      restoreDob();

    } catch (error) {
      console.warn(
        "[Mana DOB] Connection:",
        error
      );
    }
  }

  /* MERGE ONLY DOB WITH EXISTING CLOUD DETAILS */

  async function persistDob() {
    if (cloudSaving) {
      pendingCloudSave = true;
      return;
    }

    if (!cloud || !userId || !validDob(savedDob)) {
      return;
    }

    cloudSaving = true;

    try {
      const existing = await cloud
        .from("client_extended_profiles")
        .select("details,share_with_coach")
        .eq("user_id", userId)
        .maybeSingle();

      if (existing.error) throw existing.error;

      const details = {
        ...(existing.data?.details || {}),
        dob: savedDob
      };

      const response = await cloud
        .from("client_extended_profiles")
        .upsert({
          user_id: userId,
          details,
          share_with_coach:
            existing.data?.share_with_coach ?? false,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "user_id"
        });

      if (response.error) throw response.error;

    } catch (error) {
      console.warn(
        "[Mana DOB] Cloud save:",
        error.message || error
      );
    } finally {
      cloudSaving = false;

      if (pendingCloudSave) {
        pendingCloudSave = false;
        void persistDob();
      }
    }
  }

  function captureDob() {
    const input = $("me-dob");

    if (!input || !validDob(input.value)) return;

    if (input.value !== savedDob) {
      saveLocalDob(input.value);
    }
  }

  function repairLyfe() {
    const heading = document.querySelector(
      "#manaV80Home #manaV80Life > h2"
    );

    if (!heading) return;

    const expected = [
      "Reset.",
      "Rebuild.",
      "Move Forward."
    ];

    const spans = heading.querySelectorAll(
      ":scope > .mana-lyfe-line-105041"
    );

    if (
      spans.length === 3 &&
      expected.every(
        (text, i) => spans[i].textContent === text
      )
    ) return;

    if (!/reset|rebuild|move forward/i.test(
      heading.textContent || ""
    )) return;

    heading.replaceChildren(
      ...expected.map(text => {
        const span = document.createElement("span");
        span.className = "mana-lyfe-line-105041";
        span.textContent = text;
        return span;
      })
    );
  }

  function refresh() {
    maintainLearning();
    restoreDob();
    repairLyfe();
  }

  function init() {
    installStyles();

    void connectCloud();

    document.addEventListener("input", event => {
      if (event.target?.id === "me-dob") {
        captureDob();
      }
    }, true);

    document.addEventListener("change", event => {
      if (event.target?.id === "me-dob") {
        captureDob();
      }
    }, true);

    document.addEventListener("click", event => {
      if (event.target?.closest?.("#manaProfileSave")) {
        captureDob();
      }

      if (event.target?.closest?.(
        "#manaV83Tabs, #manaV80HomeBtn"
      )) {
        requestAnimationFrame(refresh);
      }
    }, true);

    window.addEventListener(
      "mana:extended-profile-saved",
      () => {
        restoreDob();
        void persistDob();
      }
    );

    window.addEventListener(
      "mana:profile-synced",
      restoreDob
    );

    window.addEventListener("pageshow", () => {
      void connectCloud();
      refresh();
    });

    setInterval(refresh, 900);

    console.log(
      "[Mana Movement] Mobile stability 105043 ready"
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
