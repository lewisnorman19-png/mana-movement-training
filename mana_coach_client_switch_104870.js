
/* =========================================================
   MANA MOVEMENT TRAINING
   COACH ↔ CLIENT WORKSPACE SWITCH
   BUILD 104872 — COACH NAVIGATION RESTORE

   COMPLETE REPLACEMENT:
   mana_coach_client_switch_104870.js

   FIXES:
   - Coach bottom tabs reappear after switching back
   - Correct Coach / Client navigation separation
   - Switch remains visible on every program screen
   - No sign-out or second login

   PRESERVES:
   - Supabase coach authorisation
   - Existing Coach Hub navigation and click handlers
   - Client app navigation
   - Current workouts, Circuits and Progress
   - Mobile layout

   No database changes.
   ========================================================= */

(() => {
  "use strict";

  const BUILD = "104872";
  const FLAG = "MANA_WORKSPACE_SWITCH_104872";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const BUTTON = "manaWorkspaceSwitch104870";
  const STYLE = "manaWorkspaceSwitchStyle104872";

  const COACH = "mana-workspace-coach";
  const CLIENT = "mana-workspace-client";

  const PREFERENCE = "mana:workspace:";

  const $ = id => document.getElementById(id);

  let authorisedUser = null;
  let authorisedProfile = null;
  let busy = false;
  let scheduled = false;

  /* ============================================
     WORKSPACE DETECTION
     ============================================ */

  function visible(id) {
    const element = $(id);

    return Boolean(
      element &&
      !element.hidden &&
      !element.classList.contains("hide")
    );
  }

  function coachVisible() {
    return (
      visible("coachView") ||
      visible("coachClientDetailView")
    );
  }

  function clientVisible() {
    return (
      visible("clientView") ||
      visible("clientProgramsView") ||
      visible("clientFuelView") ||
      visible("clientProgressView") ||
      visible("clientProfileView") ||
      $("manaV83ProgramShell")
        ?.classList.contains("open") ||
      $("manaProfileScreen")
        ?.classList.contains("open") ||
      $("manaV80Home")
        ?.classList.contains("open")
    );
  }

  function workspace() {
    try {
      if (
        typeof mode !== "undefined" &&
        (mode === "coach" || mode === "client")
      ) {
        return mode;
      }
    } catch (_) {}

    if (coachVisible()) return "coach";
    if (clientVisible()) return "client";

    return null;
  }

  /* ============================================
     COACH AUTHORISATION

     A saved preference never grants
     permission to use Coach Hub.
     ============================================ */

  async function verifyCoach() {
    try {
      if (
        typeof window.supabaseClient !== "function"
      ) {
        return false;
      }

      const db = await window.supabaseClient();

      const { data, error } =
        await db.auth.getUser();

      if (error || !data?.user?.id) {
        authorisedUser = null;
        authorisedProfile = null;
        return false;
      }

      if (
        authorisedUser?.id === data.user.id &&
        authorisedProfile?.role === "coach"
      ) {
        return true;
      }

      const profile = await db
        .from("profiles")
        .select(
          "id,full_name,role,program_start_date"
        )
        .eq("id", data.user.id)
        .single();

      if (
        profile.error ||
        profile.data?.id !== data.user.id ||
        profile.data?.role !== "coach"
      ) {
        authorisedUser = null;
        authorisedProfile = null;
        return false;
      }

      authorisedUser = data.user;
      authorisedProfile = profile.data;

      return true;

    } catch (error) {
      console.warn(
        "[Mana] Coach verification:",
        error
      );

      authorisedUser = null;
      authorisedProfile = null;
      return false;
    }
  }

  /* ============================================
     PREMIUM STYLING
     ============================================ */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement(
      "style"
    );

    style.id = STYLE;

    style.textContent = `

      /* Client workspace:
         hide Coach Hub navigation. */

      body.${CLIENT} #manaV97CoachNav,
      body.${CLIENT} #manaV97CoachLogout {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      /* Coach workspace:
         hide the legacy Client nav. */

      body.${COACH} #bottomNav {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      /* Restore the actual Coach Hub
         five-tab navigation when open. */

      body.${COACH}
      #manaV97CoachNav.open {
        display: block !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }

      body.${COACH}
      #manaV97CoachNav.open
      .mana-v970-nav-inner {
        display: grid !important;
        grid-template-columns:
          repeat(5,minmax(0,1fr)) !important;
      }

      /* Persistent workspace switch */

      #${BUTTON} {
        position: fixed !important;

        top: 176px !important;
        right: 16px !important;

        z-index: 2147482000 !important;

        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;

        width: auto !important;
        max-width: calc(100vw - 32px) !important;
        min-height: 40px !important;

        padding: 9px 13px !important;

        background: #101216 !important;
        background-image: none !important;

        border: 1px solid #FF7927 !important;
        border-radius: 12px !important;

        color: #FFFFFF !important;

        font: 900 12px/1.2 inherit !important;
        cursor: pointer !important;

        box-shadow: none !important;
        white-space: nowrap !important;
      }

      #${BUTTON}[hidden] {
        display: none !important;
      }

      #${BUTTON} .mana-switch-icon {
        color: #FF7927 !important;
        font-size: 17px !important;
        font-weight: 900 !important;
      }

      #${BUTTON} .mana-switch-label {
        color: #FFFFFF !important;
      }

      #${BUTTON}:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: 3px !important;
      }

      #${BUTTON}:disabled {
        opacity: .6 !important;
        cursor: wait !important;
      }

      @media(max-width:700px) {
        #${BUTTON} {
          top: 145px !important;
          right: 10px !important;

          min-height: 36px !important;
          padding: 8px 10px !important;

          font-size: 11px !important;
          border-radius: 10px !important;
        }
      }

      #manaLoginRoles103880,
      #manaLoginRoleNote103880 {
        display: none !important;
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================
     SWITCH BUTTON
     ============================================ */

  function ensureButton() {
    let button = $(BUTTON);
    if (button) return button;

    button = document.createElement("button");
    button.id = BUTTON;
    button.type = "button";
    button.hidden = true;

    const icon = document.createElement("span");
    icon.className = "mana-switch-icon";
    icon.textContent = "⇄";
    icon.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.className = "mana-switch-label";
    label.textContent = "Coach Hub";

    button.append(icon, label);

    button.addEventListener(
      "click",
      switchWorkspace
    );

    document.body.appendChild(button);
    return button;
  }

  /* ============================================
     COACH NAVIGATION RESTORATION

     Only restore while the real coach
     screen is visible.

     Never rebuild or duplicate tabs.
     ============================================ */

  function restoreCoachNav() {
    if (
      workspace() !== "coach" ||
      !coachVisible()
    ) {
      return;
    }

    const nav = $("manaV97CoachNav");

    if (!nav) return;

    document.body.classList.add(
      "mana-v970-coach-active"
    );

    nav.classList.add("open");

    /* Keep the existing Coach Hub
       five-tab structure and handlers. */
  }

  function syncNavigation() {
    const current = workspace();

    document.body.classList.toggle(
      COACH,
      current === "coach"
    );

    document.body.classList.toggle(
      CLIENT,
      current === "client"
    );

    if (current === "coach") {
      restoreCoachNav();

    } else if (current === "client") {
      document.body.classList.remove(
        "mana-v970-coach-active"
      );

      $("manaV97CoachNav")
        ?.classList.remove("open");
    }
  }

  function updateButton() {
    const button = ensureButton();

    syncNavigation();

    const current = workspace();

    button.hidden = !(
      authorisedProfile?.role === "coach" &&
      current !== null &&
      !visible("authView")
    );

    if (button.hidden) return;

    const destination =
      current === "coach"
        ? "Client App"
        : "Coach Hub";

    button.querySelector(
      ".mana-switch-label"
    ).textContent = destination;

    button.title = "Switch to " + destination;

    button.setAttribute(
      "aria-label",
      "Switch to " + destination
    );
  }

  function scheduleRefresh() {
    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      updateButton();
    });
  }

  function savePreference(value) {
    if (!authorisedUser?.id) return;

    try {
      localStorage.setItem(
        PREFERENCE + authorisedUser.id,
        value
      );
    } catch (_) {}
  }

  function closeClientScreens() {
    [
      "manaV83ProgramShell",
      "manaProfileScreen"
    ].forEach(id => {
      $(id)?.classList.remove("open");
    });

    document.body.style.overflow = "";
  }

  /* ============================================
     SWITCH WORKSPACES
     ============================================ */

  async function switchWorkspace() {
    if (busy) return;

    busy = true;

    const button = ensureButton();
    const previous = workspace();

    button.disabled = true;

    try {
      if (!(await verifyCoach())) {
        throw new Error(
          "Coach authorisation could not be verified."
        );
      }

      if (previous === "coach") {
        if (
          typeof window.openConnectedClient !==
          "function"
        ) {
          throw new Error(
            "Client App is unavailable."
          );
        }

        $("coachClientDetailView")
          ?.classList.add("hide");

        $("coachView")
          ?.classList.add("hide");

        await window.openConnectedClient(
          authorisedProfile
        );

        const home = $("manaV80Home");

        if (home) {
          home.style.display = "";
        }

        savePreference("client");

      } else if (previous === "client") {
        if (
          typeof window.openConnectedCoach !==
          "function"
        ) {
          throw new Error(
            "Coach Hub is unavailable."
          );
        }

        closeClientScreens();

        await window.openConnectedCoach();

        savePreference("coach");

        /* FIX:
           Reopen the actual Coach Hub
           nav after the app changes mode. */

        restoreCoachNav();

        /* Let existing Coach Hub scripts
           settle without a permanent
           polling loop. */

        setTimeout(restoreCoachNav, 120);
        setTimeout(restoreCoachNav, 350);

      } else {
        throw new Error(
          "Workspace could not be identified."
        );
      }

      syncNavigation();
      updateButton();

    } catch (error) {
      console.error(
        "[Mana] Workspace switch:",
        error
      );

      window.alert(
        "Could not switch workspace: " +
        (error?.message || "Unknown error")
      );

    } finally {
      busy = false;
      button.disabled = false;

      scheduleRefresh();
    }
  }

  /* ============================================
     AUTH EVENTS
     ============================================ */

  async function refreshAuthorisation() {
    await verifyCoach();
    scheduleRefresh();
  }

  async function connectAuth() {
    try {
      if (
        typeof window.supabaseClient !==
        "function"
      ) return;

      const db = await window.supabaseClient();

      db.auth.onAuthStateChange(event => {
        if (event === "SIGNED_OUT") {
          authorisedUser = null;
          authorisedProfile = null;
          scheduleRefresh();
        }

        if (
          event === "SIGNED_IN" ||
          event === "INITIAL_SESSION"
        ) {
          setTimeout(
            refreshAuthorisation,
            0
          );
        }
      });

    } catch (error) {
      console.warn(
        "[Mana] Workspace auth:",
        error
      );
    }
  }

  /* ============================================
     TARGETED OBSERVATION

     No document-wide observer.
     No new navigation elements.
     ============================================ */

  function observeScreens() {
    const ids = [
      "authView",
      "coachView",
      "coachClientDetailView",
      "clientView",
      "clientProgramsView",
      "clientFuelView",
      "clientProgressView",
      "clientProfileView",
      "manaV83ProgramShell",
      "manaProfileScreen",
      "manaV80Home"
    ];

    const observer =
      new MutationObserver(
        scheduleRefresh
      );

    for (const id of ids) {
      const element = $(id);

      if (!element) continue;

      observer.observe(element, {
        attributes: true,
        attributeFilter: [
          "class",
          "hidden"
        ]
      });
    }
  }

  function init() {
    installStyles();
    ensureButton();

    observeScreens();
    connectAuth();

    [250, 900, 1800].forEach(delay => {
      setTimeout(
        refreshAuthorisation,
        delay
      );
    });

    window.addEventListener(
      "pageshow",
      scheduleRefresh
    );

    window.addEventListener(
      "mana:program-tab-change",
      scheduleRefresh
    );

    document.addEventListener(
      "click",
      event => {
        const target = event.target;

        if (!(target instanceof Element)) return;

        if (target.closest("#" + BUTTON)) {
          return;
        }

        setTimeout(
          scheduleRefresh,
          100
        );
      }
    );

    scheduleRefresh();

    console.log(
      "[Mana Movement] Workspace switch " +
      BUILD
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
