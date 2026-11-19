
/* ==========================================================
   MANA MOVEMENT TRAINING
   COACH HUB GENDER SAVE & DISPLAY
   BUILD 105027

   COMPLETE REPLACEMENT:
   mana_coach_settings_gender_105026.js

   FIXES:
   - Gender saved after extended-profile save completes
   - No unreliable 600ms save race
   - Client account identity verified
   - Existing details merged, never replaced
   - Existing coach-sharing consent unchanged
   - Gender loaded fresh in Coach View Client
   - Settings remains visible in Coach Hub

   PRESERVES:
   - Client Profile layout and photographs
   - Client and coach account isolation
   - Working Coach Hub navigation
   - Chat, Payments and Program Builder
   - Training and Fuel records

   No database schema changes.
   ========================================================== */

(() => {
  "use strict";

  const BUILD = "105027";
  const FLAG = "MANA_COACH_GENDER_105027";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const NAV = "manaV97CoachNav";
  const SCREEN = "manaProfileScreen";
  const DETAIL = "coachClientDetailView";
  const PANEL = "manaCoachProfile104950";
  const CELL = "mana-gender-cell-105027";

  const $ = id => document.getElementById(id);

  const VALID = new Set([
    "",
    "Male",
    "Female",
    "Non-binary",
    "Prefer not to say"
  ]);

  let pendingSave = null;
  let saving = false;
  let detailObserver = null;
  let panelObserver = null;
  let observedPanel = null;
  let observedDetail = null;
  let request = 0;
  let refreshQueued = false;

  /* =====================================================
     SUPABASE SESSION
     ===================================================== */

  async function session() {
    if (
      typeof window.supabaseClient !==
      "function"
    ) {
      return null;
    }

    const db = await window.supabaseClient();

    const result = await db.auth.getUser();

    if (
      result.error ||
      !result.data?.user?.id
    ) {
      return null;
    }

    return {
      db,
      user: result.data.user
    };
  }

  /* =====================================================
     SETTINGS TAB

     Existing navigation owns click handling.
     Restore the button if another renderer
     removes it, but do not route clicks.
     ===================================================== */

  function ensureSettings() {
    const inner = $(NAV)?.querySelector(
      ".mana-v970-nav-inner"
    );

    if (!inner) return;

    let button = inner.querySelector(
      '[data-coach-page="profile"]'
    );

    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "mana-v970-tab";
      button.dataset.coachPage = "profile";
      inner.appendChild(button);
    }

    button.hidden = false;
    button.dataset.mcnTab = "settings";
    button.style.order = "5";

    let icon = button.querySelector(
      ".mana-v970-tab-icon"
    );

    if (!icon) {
      icon = document.createElement("span");
      icon.className = "mana-v970-tab-icon";
      button.prepend(icon);
    }

    icon.textContent = "⚙";

    let label = button.querySelector(
      ".mcn-tab-label"
    );

    if (!label) {
      label = document.createElement("span");
      label.className = "mcn-tab-label";
      button.appendChild(label);
    }

    label.textContent = "Settings";
  }

  /* =====================================================
     CAPTURE GENDER ON SAVE

     The main extended-profile saver owns
     creating records and saving consent.
     This module waits for its success event.
     ===================================================== */

  function captureGender() {
    const select = $("manaProfileGender");

    if (!select || !VALID.has(select.value)) {
      return;
    }

    pendingSave = {
      gender: select.value,
      timestamp: Date.now()
    };
  }

  /* =====================================================
     SAVE CLIENT GENDER

     Only updates existing records for
     the currently authenticated client.
     Never changes share_with_coach.
     ===================================================== */

  async function persistGender() {
    if (saving || !pendingSave) return;

    const snapshot = pendingSave;
    pendingSave = null;

    if (
      Date.now() - snapshot.timestamp >
      30000
    ) {
      return;
    }

    saving = true;

    try {
      const auth = await session();
      if (!auth) return;

      const userId = auth.user.id;

      const role = await auth.db
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      if (
        role.error ||
        role.data?.role !== "client"
      ) {
        return;
      }

      const existing = await auth.db
        .from("client_extended_profiles")
        .select("details")
        .eq("user_id", userId)
        .maybeSingle();

      if (
        existing.error ||
        !existing.data
      ) {
        throw existing.error ||
          Error("Extended profile not yet saved.");
      }

      const latestUser =
        await auth.db.auth.getUser();

      if (
        latestUser.error ||
        latestUser.data?.user?.id !==
          userId
      ) {
        return;
      }

      const details = {
        ...(existing.data.details || {}),
        gender: snapshot.gender
      };

      const result = await auth.db
        .from("client_extended_profiles")
        .update({
          details,
          updated_at:
            new Date().toISOString()
        })
        .eq("user_id", userId);

      if (result.error) {
        throw result.error;
      }

      console.log(
        "[Mana Movement] Gender synced " +
        BUILD
      );

    } catch (error) {
      console.warn(
        "[Mana Gender] Save failed:",
        error
      );

    } finally {
      saving = false;
    }
  }

  function connectSaving() {
    const screen = $(SCREEN);

    if (!screen ||
        screen.dataset.manaGender105027) {
      return;
    }

    screen.dataset.manaGender105027 = "1";

    /*
     Capture the selected value before
     the original handlers finish saving.
    */

    screen.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            "#manaProfileSave"
          )
        ) {
          captureGender();
        }
      },
      true
    );

    /*
     The extended-profile module emits
     this event only after its database
     upsert and photo processing succeed.
    */

    window.addEventListener(
      "mana:extended-profile-saved",
      () => {
        void persistGender();
      }
    );
  }

  /* =====================================================
     COACH CLIENT LOOKUP
     ===================================================== */

  function detailOpen() {
    const view = $(DETAIL);

    return Boolean(
      view &&
      !view.hidden &&
      !view.classList.contains("hide")
    );
  }

  function clientId() {
    if (!detailOpen()) return "";

    return $(PANEL)?.dataset.clientId || "";
  }

  function personalGrid() {
    const panel = $(PANEL);

    if (!panel || !detailOpen()) return null;

    const section = Array.from(
      panel.querySelectorAll(
        ".mana-profile-group"
      )
    ).find(item =>
      /personal|contact/i.test(
        item.querySelector("h3")
          ?.textContent || ""
      )
    );

    return section?.querySelector(
      ".mana-profile-grid"
    ) || null;
  }

  /* =====================================================
     GENDER DISPLAY
     ===================================================== */

  function ensureCell(grid) {
    let cell = grid.querySelector(
      "." + CELL
    );

    if (cell) return cell;

    /*
     Remove the previous add-on's
     temporary Gender cell, if present.
    */

    grid.querySelector(
      ".mana-gender-cell-105026"
    )?.remove();

    cell = document.createElement("div");

    cell.className =
      "mana-profile-cell " + CELL;

    const label = document.createElement("small");
    label.textContent = "Gender";

    const value = document.createElement("strong");
    value.textContent = "Loading…";

    cell.append(label,value);

    const name = Array.from(
      grid.children
    ).find(item =>
      item.querySelector("small")
        ?.textContent.trim()
        .toLowerCase() === "full name"
    );

    if (name) {
      name.insertAdjacentElement(
        "afterend",
        cell
      );
    } else {
      grid.prepend(cell);
    }

    return cell;
  }

  async function refreshGender() {
    const id = clientId();
    const grid = personalGrid();

    if (!id || !grid) return;

    const ticket = ++request;
    const cell = ensureCell(grid);
    const text = cell.querySelector("strong");

    text.textContent = "Loading…";

    try {
      const auth = await session();

      if (!auth) {
        text.textContent = "Unavailable";
        return;
      }

      const result = await auth.db
        .from("client_extended_profiles")
        .select("details,share_with_coach")
        .eq("user_id", id)
        .maybeSingle();

      if (
        ticket !== request ||
        clientId() !== id ||
        !cell.isConnected
      ) return;

      if (result.error) {
        text.textContent = "Unavailable";
        return;
      }

      if (
        !result.data ||
        !result.data.share_with_coach
      ) {
        text.textContent = "Not shared";
        return;
      }

      const gender =
        result.data.details?.gender;

      text.textContent =
        typeof gender === "string" &&
        VALID.has(gender) &&
        gender !== ""
          ? gender
          : "Not saved yet";

    } catch (error) {
      if (cell.isConnected) {
        text.textContent = "Unavailable";
      }

      console.warn(
        "[Mana Coach Gender]",
        error
      );
    }
  }

  /* =====================================================
     WATCH CLIENT PROFILE RENDERER

     The coach profile is refreshed when
     changing clients. Reattach the cell
     without changing existing sections.
     ===================================================== */

  function queueRefresh() {
    if (refreshQueued) return;

    refreshQueued = true;

    requestAnimationFrame(() => {
      refreshQueued = false;

      if (detailOpen() && personalGrid()) {
        void refreshGender();
      }
    });
  }

  function observePanel() {
    const panel = $(PANEL);

    if (!panel ||
        observedPanel === panel) {
      return;
    }

    panelObserver?.disconnect();
    observedPanel = panel;

    panelObserver = new MutationObserver(
      () => {
        if (!detailOpen()) return;

        const grid = personalGrid();

        if (
          grid &&
          !grid.querySelector("." + CELL)
        ) {
          queueRefresh();
        }
      }
    );

    panelObserver.observe(panel, {
      childList: true,
      subtree: false
    });

    queueRefresh();
  }

  function observeDetail() {
    const detail = $(DETAIL);

    if (
      !detail ||
      observedDetail === detail
    ) {
      return;
    }

    detailObserver?.disconnect();
    observedDetail = detail;

    detailObserver = new MutationObserver(
      () => {
        if (detailOpen()) {
          observePanel();
          queueRefresh();
        }
      }
    );

    detailObserver.observe(detail, {
      attributes: true,
      attributeFilter: ["class","hidden"]
    });
  }

  /* =====================================================
     INIT
     ===================================================== */

  function refresh() {
    ensureSettings();
    connectSaving();
    observeDetail();
    observePanel();
  }

  function init() {
    refresh();

    [200,600,1200,2200].forEach(
      delay => {
        setTimeout(refresh, delay);
      }
    );

    document.addEventListener(
      "click",
      event => {
        if (event.target.closest?.(
          ".client-open[data-client-id]"
        )) {
          setTimeout(() => {
            refresh();
            queueRefresh();
          },350);
        }
      }
    );

    window.addEventListener(
      "pageshow",
      () => {
        refresh();
        queueRefresh();
      }
    );

    window.MANA_COACH_GENDER_BUILD = BUILD;

    console.log(
      "[Mana Movement] Coach Gender " +
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
