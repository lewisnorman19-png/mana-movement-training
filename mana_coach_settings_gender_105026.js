
/* ==========================================================
   MANA MOVEMENT TRAINING
   COACH HUB SETTINGS + CLIENT GENDER
   BUILD 105026

   COMPLETE NEW JAVASCRIPT FILE

   FIXES:
   1. Restore fifth Coach Hub Settings tab
   2. Keep existing Settings content working
   3. Display Gender in Coach View Client
   4. Save client's Gender on explicit Profile save
   5. Respect share_with_coach permission
   6. Never copy Gender between accounts

   PRESERVES:
   - Client Profile 105022
   - Mobile Profile 105023
   - Account isolation 105024
   - Number input repair 105025
   - Existing Coach Hub navigation
   - Chat, Payments and Program Builder
   - Client photographs and history

   No schema changes.
   No automatic consent changes.
   ========================================================== */

(() => {
  "use strict";

  const BUILD = "105026";
  const FLAG = "MANA_COACH_SETTINGS_GENDER_105026";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const NAV = "manaV97CoachNav";
  const SUITE = "manaCoachSuite104707";
  const DETAIL = "coachClientDetailView";
  const PROFILE = "manaCoachProfile104950";
  const SCREEN = "manaProfileScreen";
  const STYLE = "manaCoachGenderStyle105026";

  const $ = id => document.getElementById(id);

  let detailObserver = null;
  let observedDetail = null;
  let profileObserver = null;
  let observedProfile = null;
  let loadingGender = false;
  let genderRequest = 0;
  let saveBusy = false;
  let savingFor = "";
  let lastGenderSignature = "";

  /* =====================================================
     STYLING
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const sheet = document.createElement("style");
    sheet.id = STYLE;

    sheet.textContent = `

      /* Restore the fifth Coach Hub tab */

      #${NAV} .mana-v970-nav-inner {
        display: grid !important;
        grid-template-columns:
          repeat(5,minmax(0,1fr)) !important;
      }

      #${NAV}
      [data-coach-page="profile"] {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        order: 5 !important;
      }

      #${NAV}
      [data-coach-page="profile"]
      .mana-v970-tab-icon,
      #${NAV}
      [data-coach-page="profile"]
      .mcn-tab-label {
        display: block !important;
        visibility: visible !important;
      }

      /* Gender in coach's client profile */

      #${PROFILE}
      .mana-gender-cell-105026 {
        min-width: 0 !important;
        border-color: #505862 !important;
      }

      #${PROFILE}
      .mana-gender-cell-105026 small {
        color: #B7C0CB !important;
      }

      #${PROFILE}
      .mana-gender-cell-105026 strong {
        color: #FFFFFF !important;
      }

      @media(max-width:390px) {
        #${NAV}
        .mana-v970-nav-inner {
          gap: 4px !important;
        }

        #${NAV}
        [data-coach-page="profile"] {
          font-size: 9px !important;
          min-width: 0 !important;
        }
      }
    `;

    document.head.appendChild(sheet);
  }

  /* =====================================================
     CONNECTED ACCOUNT
     ===================================================== */

  async function session() {
    if (
      typeof window.supabaseClient !== "function"
    ) return null;

    const db = await window.supabaseClient();

    const {data,error} =
      await db.auth.getUser();

    if (error || !data?.user?.id) {
      return null;
    }

    return {
      db,
      user: data.user
    };
  }

  /* =====================================================
     RESTORE SETTINGS TAB

     Use the existing navigation mechanism.
     Do not introduce a competing page router.
     ===================================================== */

  function restoreSettingsTab() {
    const nav = $(NAV);
    if (!nav) return;

    const inner = nav.querySelector(
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
      button.dataset.mcnTab = "settings";

      inner.appendChild(button);
    }

    button.hidden = false;
    button.removeAttribute("aria-hidden");

    button.dataset.coachPage = "profile";
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

    /*
     Navigation 104707/105006 already
     handles data-coach-page="profile".
     No duplicate click handler.
    */
  }

  /* =====================================================
     STORE CLIENT GENDER WHEN CLIENT SAVES

     Only the authenticated client's
     Gender is used.

     Existing extended-profile details
     are merged, not replaced.

     Coach sharing permission is retained.
     ===================================================== */

  async function persistClientGender() {
    if (saveBusy) return;

    const selected =
      $("manaProfileGender");

    if (!selected) return;

    const gender = selected.value;

    const allowed = new Set([
      "",
      "Male",
      "Female",
      "Non-binary",
      "Prefer not to say"
    ]);

    if (!allowed.has(gender)) return;

    saveBusy = true;

    try {
      const auth = await session();

      if (!auth) return;

      const id = auth.user.id;

      /*
       Check that a client is saving
       their own data, rather than a
       coach updating another user.
      */

      const roleResult = await auth.db
        .from("profiles")
        .select("role")
        .eq("id",id)
        .maybeSingle();

      if (
        roleResult.error ||
        roleResult.data?.role !== "client"
      ) return;

      /*
       Check that authentication has
       not changed during this save.
      */

      const existing = await auth.db
        .from("client_extended_profiles")
        .select("details,share_with_coach")
        .eq("user_id",id)
        .maybeSingle();

      if (existing.error) {
        throw existing.error;
      }

      const fresh = await auth.db.auth.getUser();

      if (
        fresh.error ||
        fresh.data?.user?.id !== id
      ) return;

      /*
       Do not create a new record from
       this small add-on. The existing
       extended-profile save owns record
       creation and consent.
      */

      if (!existing.data) return;

      const oldDetails =
        existing.data.details || {};

      const nextDetails = {
        ...oldDetails,
        gender
      };

      const {error} = await auth.db
        .from("client_extended_profiles")
        .update({
          details: nextDetails,
          updated_at: new Date().toISOString()
        })
        .eq("user_id",id);

      if (error) throw error;

      console.log(
        "[Mana Movement] Client Gender saved " +
        BUILD
      );

    } catch (error) {
      console.warn(
        "[Mana Gender] Save:",
        error
      );

    } finally {
      saveBusy = false;
    }
  }

  function connectClientSave() {
    const screen = $(SCREEN);

    if (!screen) return;

    if (screen.dataset.manaGenderSave105026) {
      return;
    }

    screen.dataset.manaGenderSave105026 = "1";

    /*
     Wait for the original Profile and
     extended-profile handlers to save.
     Then merge Gender into the existing
     record without changing consent.
    */

    screen.addEventListener(
      "click",
      event => {
        if (
          !event.target.closest?.(
            "#manaProfileSave"
          )
        ) return;

        setTimeout(() => {
          void persistClientGender();
        },600);
      }
    );
  }

  /* =====================================================
     COACH CLIENT PROFILE

     Use the client ID displayed by the
     current Coach View Client renderer.
     Never use localStorage to retrieve
     another person's Gender.
     ===================================================== */

  function coachDetailOpen() {
    const view = $(DETAIL);

    return Boolean(
      view &&
      !view.hidden &&
      !view.classList.contains("hide")
    );
  }

  function currentClientId() {
    const panel = $(PROFILE);

    if (
      !panel ||
      !coachDetailOpen()
    ) return "";

    return panel.dataset.clientId || "";
  }

  function ensureGenderCell(grid) {
    let cell = grid.querySelector(
      ".mana-gender-cell-105026"
    );

    if (cell) return cell;

    cell = document.createElement("div");

    cell.className =
      "mana-profile-cell mana-gender-cell-105026";

    const label = document.createElement("small");
    label.textContent = "Gender";

    const value = document.createElement("strong");
    value.textContent = "Not provided";

    cell.append(label,value);

    /*
       Place immediately after the
       first Full Name field where possible.
    */

    const first = Array.from(grid.children)
      .find(node =>
        node.querySelector("small")
          ?.textContent.trim()
          .toLowerCase() === "full name"
      );

    if (first) {
      first.insertAdjacentElement(
        "afterend",
        cell
      );
    } else {
      grid.prepend(cell);
    }

    return cell;
  }

  async function showClientGender() {
    if (loadingGender || !coachDetailOpen()) {
      return;
    }

    const panel = $(PROFILE);
    const clientId = currentClientId();

    if (!panel || !clientId) return;

    const personalSection = Array.from(
      panel.querySelectorAll(
        ".mana-profile-group"
      )
    ).find(section =>
      /personal|contact/i.test(
        section.querySelector("h3")
          ?.textContent || ""
      )
    );

    const grid = personalSection?.querySelector(
      ".mana-profile-grid"
    );

    if (!grid) return;

    const signature =
      clientId + "|" +
      Array.from(grid.children).length;

    if (
      lastGenderSignature === signature &&
      grid.querySelector(
        ".mana-gender-cell-105026"
      )
    ) return;

    loadingGender = true;

    const ticket = ++genderRequest;

    const cell = ensureGenderCell(grid);
    const value = cell.querySelector("strong");

    try {
      const auth = await session();

      if (!auth) return;

      const result = await auth.db
        .from("client_extended_profiles")
        .select("details,share_with_coach")
        .eq("user_id",clientId)
        .maybeSingle();

      if (
        ticket !== genderRequest ||
        currentClientId() !== clientId ||
        !cell.isConnected
      ) return;

      if (result.error) {
        value.textContent = "Unavailable";
        return;
      }

      const shared = Boolean(
        result.data?.share_with_coach
      );

      const gender = shared
        ? result.data?.details?.gender
        : "";

      value.textContent =
        typeof gender === "string" &&
        gender.trim()
          ? gender
          : "Not provided";

      lastGenderSignature = signature;

    } catch (error) {
      if (value?.isConnected) {
        value.textContent = "Unavailable";
      }

      console.warn(
        "[Mana Coach Gender]",
        error
      );

    } finally {
      loadingGender = false;
    }
  }

  /* =====================================================
     WATCH ONLY COACH CLIENT DETAIL

     The original renderer can redraw
     this panel when another client is
     selected.

     No full-page observer.
     ===================================================== */

  function watchClientPanel() {
    const panel = $(PROFILE);

    if (!panel || observedProfile === panel) {
      return;
    }

    profileObserver?.disconnect();
    observedProfile = panel;

    profileObserver = new MutationObserver(
      () => {
        if (!coachDetailOpen()) return;

        /*
         Only fetch when the renderer
         has replaced its profile content
         and the Gender cell is absent.
        */

        const gender = panel.querySelector(
          ".mana-gender-cell-105026"
        );

        if (!gender) {
          lastGenderSignature = "";
          void showClientGender();
        }
      }
    );

    profileObserver.observe(panel,{
      childList:true,
      subtree:false
    });

    void showClientGender();
  }

  function watchDetail() {
    const detail = $(DETAIL);

    if (
      !detail ||
      observedDetail === detail
    ) return;

    detailObserver?.disconnect();
    observedDetail = detail;

    detailObserver = new MutationObserver(
      () => {
        if (coachDetailOpen()) {
          watchClientPanel();
          void showClientGender();
        }
      }
    );

    detailObserver.observe(detail,{
      attributes:true,
      attributeFilter:["class","hidden"]
    });

    if (coachDetailOpen()) {
      watchClientPanel();
      void showClientGender();
    }
  }

  /* =====================================================
     INIT
     ===================================================== */

  function refresh() {
    restoreSettingsTab();
    connectClientSave();
    watchDetail();
    watchClientPanel();
  }

  function init() {
    installStyles();
    refresh();

    /*
     Existing Coach Hub and client
     profile screens load at different
     points in startup.
    */

    [200,600,1200,2200].forEach(delay => {
      setTimeout(refresh,delay);
    });

    document.addEventListener(
      "click",
      event => {
        const target = event.target;

        if (
          target.closest?.(
            ".client-open[data-client-id], " +
            "#backToCoachClients"
          )
        ) {
          lastGenderSignature = "";

          setTimeout(() => {
            refresh();
            void showClientGender();
          },250);
        }
      }
    );

    window.addEventListener(
      "pageshow",
      refresh
    );

    window.MANA_COACH_SETTINGS_GENDER_BUILD =
      BUILD;

    console.log(
      "[Mana Movement] Coach Settings " +
      "and Gender " + BUILD + " ready"
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
