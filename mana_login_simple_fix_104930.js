
/* ============================================================
   MANA MOVEMENT TRAINING
   SIMPLE LOGIN FIX
   BUILD 104930

   FIXES:
   - Previously saved email returning while editing
   - Unnecessary Client / Coach login buttons
   - Simplifies login screen

   PRESERVES:
   - Existing Supabase authentication
   - Client and Coach account permissions
   - Coach Hub and Client App switching
   - Create Account functionality
   - Password recovery
   - Existing sessions and client data
   - Mobile layout

   NO DATABASE CHANGES
   NO AUTHENTICATION REPLACEMENT
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104930";

  if (window.MANA_LOGIN_SIMPLE_104930) return;

  window.MANA_LOGIN_SIMPLE_104930 = true;

  const $ = id => document.getElementById(id);

  const STYLE_ID = "manaLoginSimpleStyle104930";

  const ROLES_ID = "manaLoginRoles103880";

  /* ============================================================
     STYLING
     ============================================================ */

  function installStyles() {

    if ($(STYLE_ID)) return;

    const style = document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `
      /* Hide unnecessary workspace selection */

      #${ROLES_ID},
      #manaLoginRoleNote103880 {
        display: none !important;
        visibility: hidden !important;
      }

      /* Keep login form clean */

      #authView #loginForm {
        width: 100%;
      }

      #authView #loginEmail,
      #authView #loginPassword {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }

      #authView #loginEmail {
        background: #0E1013 !important;
        color: #FFFFFF !important;
        border: 1px solid #555D66 !important;
        border-radius: 12px !important;
        -webkit-text-fill-color: #FFFFFF;
      }

      #authView #loginEmail:focus {
        border-color: #FF7927 !important;
        outline: 2px solid rgba(255,121,39,.25);
        outline-offset: 1px;
      }

      #authView #loginEmail::placeholder {
        color: #9199A4;
      }

      /* Preserve existing login button styling */

      #authView #loginForm button[type="submit"],
      #authView #loginForm .btn.primary {
        cursor: pointer;
      }

      /* Mobile */

      @media (max-width: 600px) {

        #authView #loginEmail,
        #authView #loginPassword {
          font-size: 16px !important;
          min-height: 49px;
        }

      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     REMOVE SAVED EMAIL AUTOFILL

     The original index.html restores an email
     from the localStorage key "mana:lastEmail".

     Remove that saved preference so the email
     field is not repopulated on future visits.

     This does NOT remove an account, session,
     password or Supabase record.
     ============================================================ */

  function removeSavedEmail() {

    try {

      localStorage.removeItem("mana:lastEmail");

    } catch (error) {

      console.warn(
        "[Mana] Could not clear remembered email",
        error
      );

    }

  }

  /* ============================================================
     ENABLE NORMAL EMAIL EDITING
     ============================================================ */

  function prepareEmailField() {

    const email = $("loginEmail");

    if (!email) return;

    if (email.dataset.manaSimple104930 === "1") {
      return;
    }

    email.dataset.manaSimple104930 = "1";

    /*
     The existing HTML uses autocomplete="username".

     Change this field to manual email entry.
     Do not modify the password field.
    */

    email.setAttribute("autocomplete", "off");

    email.setAttribute(
      "name",
      "mana-login-email-manual"
    );

    email.setAttribute(
      "autocapitalize",
      "none"
    );

    email.setAttribute(
      "autocorrect",
      "off"
    );

    email.setAttribute(
      "spellcheck",
      "false"
    );

    /*
     Clear the old saved value once.

     Do not clear the field again after
     the user begins typing.
    */

    const savedEmail = (() => {

      try {
        return (
          localStorage.getItem("mana:lastEmail") || ""
        );
      } catch (_) {
        return "";
      }

    })();

    if (
      savedEmail &&
      email.value.trim().toLowerCase() ===
        savedEmail.trim().toLowerCase()
    ) {
      email.value = "";
    }

    removeSavedEmail();

    /*
     Ensure the browser treats the field
     as a normal editable email input.
    */

    email.readOnly = false;

    email.disabled = false;

    /*
     Existing sign-in code still reads
     the field using the ID loginEmail.

     We deliberately preserve that ID.
    */

    email.addEventListener(
      "input",
      () => {

        removeSavedEmail();

      },
      { passive: true }
    );

  }

  /* ============================================================
     REMOVE CLIENT / COACH LOGIN SELECTION

     Supabase already identifies the account's
     authorised role after authentication.

     Do not modify profile.role or grant
     additional permissions.
     ============================================================ */

  function simplifyWorkspaceSelection() {

    const roles = $(ROLES_ID);

    if (!roles) return;

    /*
     The existing workspace-choice script uses
     these buttons to capture a login preference.

     Set Coach as the default for authorised
     coach accounts, then hide the selector.

     Normal client accounts continue through
     their own role-based login route.
    */

    roles.querySelectorAll("[data-role]")
      .forEach(button => {

        const coach =
          button.dataset.role === "coach";

        button.setAttribute(
          "aria-pressed",
          String(coach)
        );

        button.tabIndex = -1;

      });

    roles.style.setProperty(
      "display",
      "none",
      "important"
    );

    roles.setAttribute("aria-hidden", "true");

    const note = $("manaLoginRoleNote103880");

    if (note) {
      note.style.display = "none";
    }

  }

  /* ============================================================
     LOGIN SUBMISSION

     Keep the original Supabase login handler.

     The older workspace-choice script reads the
     selection on form submit. No changes to
     the actual authentication request.
     ============================================================ */

  function prepareLoginForm() {

    const form = $("loginForm");

    if (!form) return;

    if (form.dataset.manaSimple104930 === "1") {
      return;
    }

    form.dataset.manaSimple104930 = "1";

    /*
     Disable the form's browser-level
     autocomplete request.

     The password field remains unchanged
     and browser password managers may
     still offer saved credentials.
    */

    form.setAttribute("autocomplete", "off");

    form.addEventListener(
      "submit",
      () => {

        simplifyWorkspaceSelection();

        /*
         Preserve whatever email the user
         has actually entered.

         The original login code handles
         authentication and error messages.
        */

      },
      true
    );

  }

  /* ============================================================
     INITIALISE
     ============================================================ */

  function init() {

    installStyles();

    /*
     Clear the saved email before any
     further form interactions.
    */

    prepareEmailField();

    simplifyWorkspaceSelection();

    prepareLoginForm();

    /*
     Account role and workspace switching
     remain controlled by existing scripts.

     No interval or continuous observer.
    */

    console.log(
      "[Mana Movement] Simple Login " +
      BUILD +
      " active"
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
