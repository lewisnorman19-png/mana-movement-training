
/* ============================================================
   MANA MOVEMENT — FINAL LOGIN LAYOUT CLEANUP
   BUILD 103800

   PURPOSE
   - Remove duplicate promotional content
   - Show one Mana Movement heading
   - Centre the existing authentication form
   - Preserve Login and Sign Up
   - Preserve password recovery
   - Preserve existing authentication handlers
   - Do not change account permissions
   - Do not affect Coach Hub or client dashboards

   LOAD AFTER
   mana_login_premium_103780.js
   mana_login_clean_103790.js
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "103800";
  const STYLE_ID = "manaLoginFinalCleanup103800";
  const SHELL_ID = "manaLoginFormShell103800";
  const TITLE_ID = "manaPremiumLoginTitle103780";

  if (window.MANA_LOGIN_FINAL_CLEANUP_103800) {
    return;
  }

  window.MANA_LOGIN_FINAL_CLEANUP_103800 = true;

  const $ = id => document.getElementById(id);

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `

      /* AUTHENTICATION SCREEN ONLY */

      body:has(#authView:not(.hide))
      .wrap > header.brand {
        display: none !important;
      }

      #authView > :not(#${TITLE_ID}):not(#${SHELL_ID}) {
        display: none !important;
      }

      #authView:not(.hide) {
        width: min(100%, 560px) !important;
        max-width: 560px !important;

        min-height: 100dvh !important;

        margin: 0 auto !important;

        padding: 30px 20px 45px !important;

        display: flex !important;
        flex-direction: column !important;

        align-items: stretch !important;
        justify-content: center !important;

        gap: 26px !important;

        box-sizing: border-box !important;
      }

      #${TITLE_ID} {
        display: block !important;

        margin: 0 !important;

        text-align: center !important;

        font-family: Georgia, serif !important;
        font-size: clamp(35px, 6vw, 52px) !important;

        font-weight: 500 !important;
        line-height: 1.15 !important;

        color: #f0f5ff !important;
      }

      #${TITLE_ID} span {
        color: #efc35e !important;
      }

      #${SHELL_ID} {
        display: block !important;

        width: 100% !important;

        margin: 0 !important;
        padding: 0 !important;

        background: transparent !important;
        border: none !important;

        box-shadow: none !important;
      }

      #${SHELL_ID} > .card {
        display: block !important;

        width: 100% !important;

        margin: 0 !important;
        padding: 0 !important;

        background: transparent !important;
        border: none !important;

        box-shadow: none !important;
      }

      #${SHELL_ID} .tabs {
        margin-bottom: 22px !important;
      }

      #${SHELL_ID} form input {
        border-radius: 13px !important;
      }

      #${SHELL_ID} #loginPassword,
      #${SHELL_ID} #signupPassword {
        background: #101c2d !important;

        color: white !important;

        -webkit-text-fill-color: white !important;
      }

      #${SHELL_ID} #manaPremiumLoginRoles103780 {
        margin-top: 20px !important;
      }

      #${SHELL_ID} #authMsg {
        margin-top: 12px !important;
      }

      @media (max-width: 520px) {

        #authView:not(.hide) {
          padding: 24px 16px 38px !important;
          gap: 20px !important;
        }

        #${TITLE_ID} {
          font-size: 37px !important;
        }

      }

    `;

    document.head.appendChild(style);
  }

  function organiseLogin() {
    const auth = $("authView");

    if (!auth) return;

    const loginForm = $("loginForm");
    const signupForm = $("signupForm");

    if (!loginForm || !signupForm) return;

    const formCard = loginForm.closest(".card");

    if (!formCard) return;

    let shell = $(SHELL_ID);

    if (!shell) {
      shell = document.createElement("div");
      shell.id = SHELL_ID;
      auth.appendChild(shell);
    }

    if (formCard.parentElement !== shell) {
      shell.appendChild(formCard);
    }

    let title = $(TITLE_ID);

    if (!title) {
      title = document.createElement("h1");
      title.id = TITLE_ID;
      title.innerHTML = "Mana <span>Movement</span>";
      auth.insertBefore(title, shell);
    }

    installStyles();

    window.MANA_LOGIN_FINAL_CLEANUP_BUILD = BUILD;
  }

  function init() {
    organiseLogin();
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
