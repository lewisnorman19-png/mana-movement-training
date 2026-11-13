
/* ==========================================================
   MANA MOVEMENT TRAINING
   COACH / CLIENT SWITCH — STABLE NAVIGATION
   BUILD 104871

   COMPLETE REPLACEMENT FILE:
   mana_coach_client_switch_104870.js

   PURPOSE:
   - Persistent workspace switch for authorised coaches
   - Available throughout Coach Hub and Client App
   - Hide Coach Hub navigation in Client App
   - Hide legacy Client navigation in Coach Hub
   - Preserve existing app screens and functions
   - No extra login required
   - Never grant coach access using localStorage
   - No database changes
   - No continuous polling or subtree observers
   ========================================================== */

(() => {
  "use strict";

  const BUILD = "104871";

  const BUTTON_ID = "manaWorkspaceSwitch104870";
  const STYLE_ID = "manaWorkspaceSwitchStyle104871";

  const PREFERENCE_PREFIX = "mana:workspace:";

  const CLASS_COACH = "mana-workspace-coach";
  const CLASS_CLIENT = "mana-workspace-client";

  if (window.MANA_WORKSPACE_SWITCH_104871) return;

  window.MANA_WORKSPACE_SWITCH_104871 = true;

  const $ = id => document.getElementById(id);

  let authorisedUser = null;
  let authorisedProfile = null;

  let busy = false;
  let refreshScheduled = false;

  /* ======================================================
     WORKSPACE DETECTION

     The original app already maintains a mode variable.
     Read it first so that switching views cannot confuse
     the navigation.

     Fallback to visible screens when necessary.
     ====================================================== */

  function modeValue() {
    try {
      if (
        typeof mode !== "undefined" &&
        (mode === "coach" || mode === "client")
      ) {
        return mode;
      }
    } catch (_) {}

    return null;
  }

  function visible(id) {
    const el = $(id);

    if (!el || el.hidden) return false;

    if (el.classList.contains("hide")) {
      return false;
    }

    return true;
  }

  function overlayOpen(id) {
    return Boolean(
      $(id)?.classList.contains("open")
    );
  }

  function coachScreenOpen() {
    return (
      visible("coachView") ||
      visible("coachClientDetailView")
    );
  }

  function clientScreenOpen() {
    return (
      visible("clientView") ||
      visible("clientProgramsView") ||
      visible("clientFuelView") ||
      visible("clientProgressView") ||
      visible("clientProfileView") ||
      overlayOpen("manaV83ProgramShell") ||
      overlayOpen("manaProfileScreen") ||
      overlayOpen("manaV80Home")
    );
  }

  function workspace() {
    const currentMode = modeValue();

    if (currentMode) return currentMode;

    if (coachScreenOpen()) return "coach";

    if (clientScreenOpen()) return "client";

    return null;
  }

  function signedInScreen() {
    return (
      !visible("authView") &&
      workspace() !== null
    );
  }

  /* ======================================================
     AUTHENTICATED COACH AUTHORISATION

     Verify the actual Supabase account and profile.
     Never determine coach access from the button,
     saved workspace, URL or email address.
     ====================================================== */

  async function verifyCoach() {
    try {
      if (
        typeof window.supabaseClient !== "function"
      ) {
        return false;
      }

      const supa = await window.supabaseClient();

      const response = await supa.auth.getUser();

      const user = response?.data?.user;

      if (!user?.id) {
        authorisedUser = null;
        authorisedProfile = null;
        return false;
      }

      if (
        authorisedUser?.id === user.id &&
        authorisedProfile?.role === "coach"
      ) {
        return true;
      }

      const result = await supa
        .from("profiles")
        .select(
          "id,full_name,role,program_start_date"
        )
        .eq("id", user.id)
        .single();

      if (result.error) {
        throw result.error;
      }

      if (
        result.data?.id !== user.id ||
        result.data?.role !== "coach"
      ) {
        authorisedUser = null;
        authorisedProfile = null;
        return false;
      }

      authorisedUser = user;
      authorisedProfile = result.data;

      return true;

    } catch (error) {
      console.warn(
        "[Mana] Coach workspace verification:",
        error
      );

      authorisedUser = null;
      authorisedProfile = null;

      return false;
    }
  }

  /* ======================================================
     CSS

     Crucial fix:
     The Coach Hub navigation must never appear
     while the client workspace is active.

     The switch itself stays fixed above both apps.
     ====================================================== */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `

      /* =========================================
         COACH NAVIGATION MUST NOT FOLLOW CLIENT
         ========================================= */

      body.${CLASS_CLIENT} #manaV97CoachNav,
      body.${CLASS_CLIENT} #manaV97CoachLogout {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      /* =========================================
         COACH HUB HAS ITS OWN NAVIGATION
         ========================================= */

      body.${CLASS_COACH} #bottomNav {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      /* =========================================
         PERSISTENT WORKSPACE SWITCH
         ========================================= */

      #${BUTTON_ID} {
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

        font-family: inherit !important;
        font-size: 12px !important;
        font-weight: 900 !important;
        line-height: 1.2 !important;

        cursor: pointer !important;
        box-shadow: none !important;

        white-space: nowrap !important;
      }

      #${BUTTON_ID}[hidden] {
        display: none !important;
      }

      #${BUTTON_ID} .mana-switch-icon {
        color: #FF7927 !important;
        font-size: 17px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
      }

      #${BUTTON_ID} .mana-switch-label {
        color: #FFFFFF !important;
      }

      #${BUTTON_ID}:hover {
        border-color: #FFFFFF !important;
        background: #202329 !important;
      }

      #${BUTTON_ID}:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: 3px !important;
      }

      #${BUTTON_ID}:disabled {
        opacity: .6 !important;
        cursor: wait !important;
      }

      /* =========================================
         PHONE LAYOUT

         Switch stays accessible throughout
         all client program screens.
         ========================================= */

      @media(max-width:700px) {
        #${BUTTON_ID} {
          top: 145px !important;
          right: 10px !important;

          min-height: 36px !important;
          padding: 8px 10px !important;

          font-size: 11px !important;
          border-radius: 10px !important;
        }
      }

      /* No login workspace selector */

      #manaLoginRoles103880,
      #manaLoginRoleNote103880 {
        display: none !important;
      }

    `;

    document.head.appendChild(style);
  }

  /* ======================================================
     SWITCH BUTTON

     Create once and retain the original element
     through all client and coach screen changes.
     ====================================================== */

  function ensureButton() {
    let button = $(BUTTON_ID);

    if (button) return button;

    button = document.createElement("button");

    button.id = BUTTON_ID;
    button.type = "button";

    button.hidden = true;

    button.setAttribute(
      "aria-label",
      "Switch between Client App and Coach Hub"
    );

    const icon = document.createElement("span");
    icon.className = "mana-switch-icon";
    icon.textContent = "⇄";
    icon.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.className = "mana-switch-label";
    label.textContent = "Switch workspace";

    button.append(icon, label);

    button.addEventListener(
      "click",
      switchWorkspace
    );

    document.body.appendChild(button);

    return button;
  }

  /* ======================================================
     NAVIGATION SEPARATION

     Only change the visibility of the
     TWO DIFFERENT navigation systems.

     Do not rebuild either navigation bar.
     Do not change active tabs.
     ====================================================== */

  function synchroniseNavigation() {
    const current = workspace();

    document.body.classList.toggle(
      CLASS_COACH,
      current === "coach"
    );

    document.body.classList.toggle(
      CLASS_CLIENT,
      current === "client"
    );

    if (current === "client") {
      $("manaV97CoachNav")
        ?.classList.remove("open");
    }

    /* CSS handles the actual visibility.
       Existing app scripts retain control
       of the correct navigation system. */
  }

  /* ======================================================
     DISPLAY BUTTON

     Do not rely on clientView being visible.
     That view is hidden when the client opens
     workouts, Fuel, Progress and other screens.
     ====================================================== */

  function updateButton() {
    const button = ensureButton();

    synchroniseNavigation();

    const current = workspace();

    const allowed =
      authorisedProfile?.role === "coach";

    button.hidden = !(
      allowed &&
      signedInScreen() &&
      current !== null
    );

    if (button.hidden) return;

    const label = button.querySelector(
      ".mana-switch-label"
    );

    const goingTo =
      current === "coach"
        ? "Client App"
        : "Coach Hub";

    if (label) {
      label.textContent = goingTo;
    }

    button.title = "Switch to " + goingTo;

    button.setAttribute(
      "aria-label",
      "Switch to " + goingTo
    );
  }

  function scheduleRefresh() {
    if (refreshScheduled) return;

    refreshScheduled = true;

    requestAnimationFrame(() => {
      refreshScheduled = false;
      updateButton();
    });
  }

  /* ======================================================
     REMEMBER WORKSPACE

     Save preference only.
     This never grants permissions.
     ====================================================== */

  function savePreference(next) {
    if (!authorisedUser?.id) return;

    try {
      localStorage.setItem(
        PREFERENCE_PREFIX + authorisedUser.id,
        next
      );
    } catch (_) {}
  }

  /* ======================================================
     LEAVE CLIENT OVERLAYS CLEANLY

     Do not remove any workout information.
     Only close presentation overlays.
     ====================================================== */

  function closeClientOverlays() {
    [
      "manaV83ProgramShell",
      "manaProfileScreen"
    ].forEach(id => {
      $(id)?.classList.remove("open");
    });

    document.body.style.overflow = "";
  }

  /* ======================================================
     SWITCH

     Use the existing application functions.
     Preserve the current login session.
     ====================================================== */

  async function switchWorkspace() {
    if (busy) return;

    const button = ensureButton();

    const previous = workspace();

    busy = true;
    button.disabled = true;

    try {
      const allowed = await verifyCoach();

      if (!allowed) {
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

        savePreference("client");

        $("coachClientDetailView")
          ?.classList.add("hide");

        $("coachView")
          ?.classList.add("hide");

        await window.openConnectedClient(
          authorisedProfile
        );

        const clientHome = $("manaV80Home");

        if (clientHome) {
          clientHome.style.display = "";
        }

      } else if (previous === "client") {
        if (
          typeof window.openConnectedCoach !==
          "function"
        ) {
          throw new Error(
            "Coach Hub is unavailable."
          );
        }

        savePreference("coach");

        closeClientOverlays();

        await window.openConnectedCoach();

      } else {
        throw new Error(
          "The current workspace could not be identified."
        );
      }

      synchroniseNavigation();
      updateButton();

    } catch (error) {
      console.error(
        "[Mana] Workspace switch:",
        error
      );

      savePreference(
        previous === "coach" ? "coach" : "client"
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

  /* ======================================================
     AUTH CHANGES
     ====================================================== */

  async function refreshAuthorisation() {
    await verifyCoach();
    scheduleRefresh();
  }

  async function connectAuthListener() {
    try {
      if (
        typeof window.supabaseClient !== "function"
      ) {
        return;
      }

      const supa = await window.supabaseClient();

      supa.auth.onAuthStateChange(
        event => {

          if (event === "SIGNED_OUT") {
            authorisedUser = null;
            authorisedProfile = null;

            updateButton();
            return;
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

        }
      );

    } catch (error) {
      console.warn(
        "[Mana] Workspace auth listener:",
        error
      );
    }
  }

  /* ======================================================
     TARGETED SCREEN WATCH

     Watch only screen class changes.
     No body-wide observer.
     No repeated screen rebuilding.
     ====================================================== */

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

    const observer = new MutationObserver(
      scheduleRefresh
    );

    ids.forEach(id => {
      const element = $(id);

      if (!element) return;

      observer.observe(element, {
        attributes: true,
        attributeFilter: [
          "class",
          "hidden"
        ]
      });
    });
  }

  /* ======================================================
     INITIALISE
     ====================================================== */

  function init() {
    installStyles();
    ensureButton();

    observeScreens();
    connectAuthListener();

    [250, 900, 1800].forEach(delay => {
      setTimeout(
        refreshAuthorisation,
        delay
      );
    });

    document.addEventListener(
      "click",
      event => {
        const target = event.target;

        if (!(target instanceof Element)) return;

        if (
          target.closest(
            "#manaWorkspaceSwitch104870"
          )
        ) {
          return;
        }

        setTimeout(
          scheduleRefresh,
          100
        );
      },
      false
    );

    window.addEventListener(
      "pageshow",
      scheduleRefresh
    );

    window.addEventListener(
      "mana:program-tab-change",
      scheduleRefresh
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
