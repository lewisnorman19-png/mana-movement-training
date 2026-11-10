
/* =====================================================
   MANA MOVEMENT TRAINING
   CLIENT / COACH LOGIN WORKSPACE CHOICE
   BUILD 104690

   COMPLETE NEW FILE:
   mana_login_workspace_choice_104690.js

   PURPOSE:
   - Make existing Client / Coach login options work
   - Allow an authorised coach to use Client mode
   - Restore the preferred workspace after refresh
   - Keep coach permissions account-controlled

   PRESERVES:
   - Existing Supabase sign-in and signup
   - Existing coach authorisation
   - Existing client program functionality
   - Existing Coach Hub functionality
   - Password recovery and logout
   - All cloud records and subscriptions

   No database changes.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104690";

  if (window.MANA_WORKSPACE_CHOICE_104690) return;

  const ROLES_ID = "manaLoginRoles103880";
  const PENDING_KEY = "mana:login-workspace-pending";
  const PREF_PREFIX = "mana:workspace:";

  const originalOpenCoach =
    window.openConnectedCoach;

  const originalOpenClient =
    window.openConnectedClient;

  if (
    typeof originalOpenCoach !== "function" ||
    typeof originalOpenClient !== "function"
  ) {
    console.warn(
      "[Mana] Workspace routing functions unavailable"
    );
    return;
  }

  window.MANA_WORKSPACE_CHOICE_104690 = true;

  /* =====================================
     SAFE STORAGE
     ===================================== */

  function getStored(key, fallback = "") {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (_) {
      return fallback;
    }
  }

  function saveStored(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_) {}
  }

  function readPending() {
    try {
      return JSON.parse(
        sessionStorage.getItem(PENDING_KEY) || "null"
      );
    } catch (_) {
      return null;
    }
  }

  function writePending(value) {
    try {
      sessionStorage.setItem(
        PENDING_KEY,
        JSON.stringify(value)
      );
    } catch (_) {}
  }

  function clearPending() {
    try {
      sessionStorage.removeItem(PENDING_KEY);
    } catch (_) {}
  }

  /* =====================================
     GET AUTHENTICATED USER

     Uses the existing Supabase session.
     Does not grant coach permissions.
     ===================================== */

  async function authenticatedUser() {
    try {
      if (
        typeof window.supabaseClient !== "function"
      ) {
        return null;
      }

      const client = await window.supabaseClient();

      const result = await client.auth.getSession();

      return result?.data?.session?.user || null;
    } catch (error) {
      console.warn(
        "[Mana] Workspace session lookup:",
        error
      );

      return null;
    }
  }

  /* =====================================
     WORKSPACE PREFERENCE
     ===================================== */

  function selectedWorkspace(user) {
    if (!user?.id) return "coach";

    const pending = readPending();

    const email = String(
      user.email || ""
    ).trim().toLowerCase();

    if (
      pending &&
      pending.email === email &&
      (
        pending.role === "client" ||
        pending.role === "coach"
      )
    ) {
      const selected = pending.role;

      saveStored(
        PREF_PREFIX + user.id,
        selected
      );

      clearPending();

      return selected;
    }

    const saved = getStored(
      PREF_PREFIX + user.id
    );

    return saved === "client" ? "client" : "coach";
  }

  /* =====================================
     COACH ACCOUNT WORKSPACE ROUTING

     This wrapper only receives calls that
     the original app already decided were
     for an authorised coach profile.

     Client selection therefore changes
     the workspace, not account permissions.
     ===================================== */

  window.openConnectedCoach = async function() {
    const user = await authenticatedUser();

    const selected = selectedWorkspace(user);

    if (
      selected === "client" &&
      user
    ) {
      try {
        if (
          typeof window.getProfile !== "function"
        ) {
          throw new Error(
            "Profile service unavailable."
          );
        }

        const profile = await window.getProfile(
          user.id
        );

        /* Only switch presentation for an
           actual authorised coach account. */

        if (profile?.role !== "coach") {
          return await originalOpenCoach.apply(
            this,
            arguments
          );
        }

        /* Remove old coach client-detail view
           before opening the client workspace. */

        document
          .getElementById("coachClientDetailView")
          ?.classList.add("hide");

        await originalOpenClient.call(
          this,
          profile
        );

        console.log(
          "[Mana] Client workspace selected"
        );

        return;
      } catch (error) {
        console.error(
          "[Mana] Client workspace could not open:",
          error
        );

        const msg = document.getElementById(
          "authMsg"
        );

        if (msg) {
          msg.textContent =
            "Client workspace could not load: " +
            (error?.message || "Unknown error");
        }

        /* Do not silently redirect to Coach.
           Show the error so it can be fixed. */

        return;
      }
    }

    return await originalOpenCoach.apply(
      this,
      arguments
    );
  };

  /* =====================================
     LOGIN ROLE SELECTOR

     Keep the existing two buttons.
     Capture the actual selection before
     the original login submit handler runs.
     ===================================== */

  function rolesElement() {
    return document.getElementById(ROLES_ID);
  }

  function setRole(role) {
    const roles = rolesElement();
    if (!roles) return;

    roles.querySelectorAll("[data-role]")
      .forEach(button => {
        button.setAttribute(
          "aria-pressed",
          String(
            button.dataset.role === role
          )
        );
      });

    const note = document.getElementById(
      "manaLoginRoleNote103880"
    );

    if (note) {
      note.textContent =
        role === "coach"
          ? "Coach Hub · Authorised coach accounts only."
          : role === "client"
            ? "Client App · Training, programs and wellbeing."
            : "Choose your workspace: Client or Coach.";
    }
  }

  function captureChoice() {
    const roles = rolesElement();

    const selected = roles?.querySelector(
      '[data-role][aria-pressed="true"]'
    );

    const role = selected?.dataset.role || "";

    const email = String(
      document.getElementById("loginEmail")
        ?.value || ""
    ).trim().toLowerCase();

    if (!email) {
      clearPending();
      return;
    }

    writePending({
      email,
      role: role === "client" ? "client" : "coach"
    });
  }

  function install() {
    const roles = rolesElement();
    const form = document.getElementById(
      "loginForm"
    );

    if (!roles || !form) {
      console.warn(
        "[Mana] Login workspace controls missing"
      );
      return;
    }

    /* Avoid treating the old visual-only
       Client default as an explicit choice.
       Without a choice, existing role-based
       routing is preserved. */

    setRole("");

    roles.addEventListener(
      "click",
      event => {
        const button = event.target.closest(
          "[data-role]"
        );

        if (!button) return;

        setRole(button.dataset.role);
      }
    );

    /* Capture the selected workspace before
       the existing Supabase login handler. */

    form.addEventListener(
      "submit",
      captureChoice,
      true
    );

    console.log(
      "[Mana] Login workspace choice " + BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      install,
      { once: true }
    );
  } else {
    install();
  }

})();
