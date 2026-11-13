
/* ============================================================
   MANA MOVEMENT TRAINING
   AUTHORISED COACH / CLIENT WORKSPACE SWITCH
   BUILD 104870

   NEW COMPLETE FILE:
   mana_coach_client_switch_104870.js

   FEATURES
   - Switch Coach Hub -> Client App
   - Switch Client App -> Coach Hub
   - Only visible for authenticated coach profiles
   - No workspace choice on login screen
   - Retains the current Supabase session
   - Remembers preferred workspace per account
   - Does not alter a user's database role

   Uses existing:
   - supabaseClient()
   - getProfile()
   - openConnectedClient()
   - openConnectedCoach()

   No continuous MutationObservers.
   No database writes.
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104870";
  const BUTTON_ID = "manaWorkspaceSwitch104870";
  const STYLE_ID = "manaWorkspaceSwitchStyle104870";
  const PREF_PREFIX = "mana:workspace:";

  if (window.MANA_WORKSPACE_SWITCH_104870) return;

  window.MANA_WORKSPACE_SWITCH_104870 = true;

  const $ = id => document.getElementById(id);

  let verifiedUser = null;
  let verifiedProfile = null;
  let busy = false;

  /* =====================================
     BASIC SCREEN STATE
     ===================================== */

  function visible(id) {
    const el = $(id);

    if (!el || el.hidden) return false;

    if (el.classList.contains("hide")) {
      return false;
    }

    return true;
  }

  function inCoachWorkspace() {
    return (
      visible("coachClientDetailView") ||
      visible("coachView")
    );
  }

  function inClientWorkspace() {
    return (
      visible("clientView") ||
      $("manaV83ProgramShell")
        ?.classList.contains("open") ||
      $("manaProfileScreen")
        ?.classList.contains("open")
    );
  }

  function appVisible() {
    return (
      visible("authView") === false &&
      (
        inCoachWorkspace() ||
        inClientWorkspace()
      )
    );
  }

  /* =====================================
     AUTHORISATION

     Read actual Supabase session and
     actual profile role.

     Never trust an email, UI selection,
     localStorage role or URL parameter
     to authorise coach access.
     ===================================== */

  async function verifyCoach() {
    if (
      typeof window.supabaseClient !== "function"
    ) {
      return false;
    }

    try {
      const supa = await window.supabaseClient();

      const response = await supa.auth.getUser();

      const user = response?.data?.user;

      if (!user?.id) {
        verifiedUser = null;
        verifiedProfile = null;
        return false;
      }

      if (
        verifiedUser?.id === user.id &&
        verifiedProfile?.role === "coach"
      ) {
        return true;
      }

      const result = await supa
        .from("profiles")
        .select("id,full_name,role,program_start_date")
        .eq("id", user.id)
        .single();

      if (result.error) throw result.error;

      const profile = result.data;

      if (
        profile?.id !== user.id ||
        profile?.role !== "coach"
      ) {
        verifiedUser = null;
        verifiedProfile = null;
        return false;
      }

      verifiedUser = user;
      verifiedProfile = profile;

      return true;

    } catch (error) {
      console.warn(
        "[Mana] Coach verification unavailable:",
        error
      );

      verifiedUser = null;
      verifiedProfile = null;

      return false;
    }
  }

  /* =====================================
     VISUAL DESIGN
     ===================================== */

  function installStyle() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `

      #${BUTTON_ID} {
        position: fixed !important;

        top: 96px !important;
        right: 111px !important;

        z-index: 120000 !important;

        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        max-width: calc(100vw - 130px);

        min-height: 39px;
        padding: 9px 13px;

        border: 1px solid #FF7927 !important;
        border-radius: 13px !important;

        background: #101216 !important;
        color: #FFFFFF !important;

        font-family: inherit;
        font-size: 12px;
        font-weight: 800;
        line-height: 1.2;

        cursor: pointer;

        box-shadow: none !important;
      }

      #${BUTTON_ID}[hidden] {
        display: none !important;
      }

      #${BUTTON_ID} .mana-switch-icon {
        font-size: 17px;
        line-height: 1;
        color: #FF7927;
      }

      #${BUTTON_ID}:hover {
        background: #1E2228 !important;
        border-color: #FF7927 !important;
      }

      #${BUTTON_ID}:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: 3px;
      }

      #${BUTTON_ID}:disabled {
        opacity: .55;
        cursor: wait;
      }

      @media(max-width:600px) {
        #${BUTTON_ID} {
          top: 90px !important;
          right: 94px !important;

          min-height: 37px;
          padding: 8px 10px;

          font-size: 11px;
          border-radius: 11px !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  function ensureButton() {
    let button = $(BUTTON_ID);

    if (button) return button;

    button = document.createElement("button");

    button.id = BUTTON_ID;
    button.type = "button";
    button.hidden = true;

    button.setAttribute(
      "aria-label",
      "Switch between Coach Hub and Client App"
    );

    button.innerHTML =
      '<span class="mana-switch-icon" ' +
      'aria-hidden="true">⇄</span>' +
      '<span class="mana-switch-label">' +
      'Switch workspace' +
      '</span>';

    button.addEventListener(
      "click",
      switchWorkspace
    );

    document.body.appendChild(button);

    return button;
  }

  function updateButton() {
    const button = ensureButton();

    const allowed =
      verifiedProfile?.role === "coach";

    const show =
      allowed && appVisible();

    button.hidden = !show;

    if (!show) return;

    const coach = inCoachWorkspace();

    const label = button.querySelector(
      ".mana-switch-label"
    );

    if (label) {
      label.textContent = coach
        ? "Client App"
        : "Coach Hub";
    }

    button.title = coach
      ? "Switch to your Client App"
      : "Return to your Coach Hub";
  }

  /* =====================================
     SAVE WORKSPACE PREFERENCE

     The existing login workspace
     router already uses this key.

     This is a preference only and
     never authorises coach access.
     ===================================== */

  function savePreference(workspace) {
    if (!verifiedUser?.id) return;

    try {
      localStorage.setItem(
        PREF_PREFIX + verifiedUser.id,
        workspace
      );
    } catch (_) {}
  }

  /* =====================================
     CLOSE OLD CLIENT OVERLAYS

     Avoid showing the previous workout
     overlay over Coach Hub.
     ===================================== */

  function closeClientOverlays() {
    [
      "manaV83ProgramShell",
      "manaProfileScreen"
    ].forEach(id => {
      $(id)?.classList.remove("open");
    });

    document.body.style.overflow = "";

    const clientHome = $("manaV80Home");

    if (clientHome) {
      clientHome.style.display = "none";
    }
  }

  /* =====================================
     SWITCH WORKSPACES

     Reuse original app loaders.
     Don't simulate logout or login.
     ===================================== */

  async function switchWorkspace() {
    if (busy) return;

    const button = ensureButton();

    busy = true;
    button.disabled = true;

    const wasCoach = inCoachWorkspace();

    try {
      const allowed = await verifyCoach();

      if (!allowed) {
        throw new Error(
          "This action requires an authorised coach account."
        );
      }

      if (wasCoach) {
        if (
          typeof window.openConnectedClient !==
          "function"
        ) {
          throw new Error(
            "Client workspace loader is unavailable."
          );
        }

        savePreference("client");

        $("coachClientDetailView")
          ?.classList.add("hide");

        await window.openConnectedClient(
          verifiedProfile
        );

        const home = $("manaV80Home");

        if (home) {
          home.style.display = "";
        }

      } else {
        if (
          typeof window.openConnectedCoach !==
          "function"
        ) {
          throw new Error(
            "Coach workspace loader is unavailable."
          );
        }

        savePreference("coach");

        closeClientOverlays();

        await window.openConnectedCoach();
      }

    } catch (error) {
      console.error(
        "[Mana] Workspace switch failed:",
        error
      );

      /* Restore the previously working
         preference if switching failed. */

      savePreference(
        wasCoach ? "coach" : "client"
      );

      window.alert(
        "Could not switch workspace: " +
        (error?.message || "Unknown error")
      );

    } finally {
      busy = false;
      button.disabled = false;

      updateButton();
    }
  }

  /* =====================================
     REMOVE LOGIN WORKSPACE CHOICE

     Coach access is verified after
     login, inside the app instead.
     ===================================== */

  function hideLoginChoice() {
    const style = document.createElement("style");

    style.textContent = `
      #manaLoginRoles103880,
      #manaLoginRoleNote103880 {
        display: none !important;
      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================
     ACCOUNT / AUTH CHANGES
     ===================================== */

  async function refreshEligibility() {
    await verifyCoach();
    updateButton();
  }

  function listenForAuth() {
    if (
      typeof window.supabaseClient !==
      "function"
    ) {
      return;
    }

    Promise.resolve(window.supabaseClient())
      .then(supa => {
        supa.auth.onAuthStateChange(
          (event, session) => {
            if (event === "SIGNED_OUT") {
              verifiedUser = null;
              verifiedProfile = null;
              updateButton();
              return;
            }

            if (
              event === "SIGNED_IN" ||
              event === "INITIAL_SESSION"
            ) {
              /* Defer the query outside
                 the auth callback. */
              setTimeout(
                refreshEligibility,
                0
              );
            }
          }
        );
      })
      .catch(error => {
        console.warn(
          "[Mana] Auth listener unavailable:",
          error
        );
      });
  }

  function init() {
    installStyle();
    hideLoginChoice();
    ensureButton();

    listenForAuth();

    /* Bounded startup checks only.
       No continuous polling. */

    [250, 900, 1800].forEach(delay => {
      setTimeout(refreshEligibility, delay);
    });

    document.addEventListener(
      "click",
      () => {
        setTimeout(updateButton, 120);
      },
      false
    );

    window.addEventListener(
      "pageshow",
      updateButton
    );

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
