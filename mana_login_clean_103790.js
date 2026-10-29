
/* ============================================================
   MANA MOVEMENT — CLEAN LOGIN 103790
   COMPLETE STANDALONE SCRIPT

   - One brand heading
   - Hide old promotional banner
   - Use selected Login / Sign Up tab as form submission button
   - Preserve existing form handlers and password recovery
   - Never grant or modify coach permissions
   - Load after mana_login_premium_103780.js
   ============================================================ */
(() => {
  'use strict';

  if (window.MANA_LOGIN_CLEAN_103790) return;
  window.MANA_LOGIN_CLEAN_103790 = true;

  const STYLE_ID = 'manaLoginCleanStyle103790';
  const $ = id => document.getElementById(id);

  function addStyles() {
    if ($(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* Only affect the unauthenticated login screen. */
      body:has(#authView:not(.hide)) > .wrap > header.brand,
      body:has(#authView:not(.hide)) .wrap > header.brand {
        display: none !important;
      }
      #authView > .hero,
      #authView > .card.hero {
        display: none !important;
      }
      #authView:not(.hide) {
        min-height: 100dvh !important;
        padding: 35px 18px 45px !important;
        gap: 20px !important;
        justify-content: center !important;
      }
      #authView #manaPremiumLoginTitle103780 {
        display: block !important;
        margin: 0 0 12px !important;
        text-align: center !important;
      }
      #authView > .card:not(.hero) {
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        padding: 0 !important;
      }
      #authView #loginForm > .btn.primary,
      #authView #signupForm > .btn.primary {
        display: none !important;
      }
      #authView .tabs {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 12px !important;
      }
      #authView .tabs button {
        min-height: 58px !important;
        font-weight: 850 !important;
      }
      #authView .tabs button.active {
        background: linear-gradient(135deg, #123d73, #092b51) !important;
        border-color: #54acff !important;
        color: white !important;
      }
      #authView form label {
        margin-bottom: -3px !important;
      }
      #authView #loginPassword,
      #authView #signupPassword {
        background: #101c2d !important;
        color: white !important;
        -webkit-text-fill-color: white;
      }
      #authView #authMsg {
        margin: 12px 0 0 !important;
      }
      #authView #manaPremiumLoginRoles103780 {
        margin-top: 20px !important;
      }
      #authView > .card:not(.hero) > p.tiny:last-child {
        display: none !important;
      }
      @media (max-width: 520px) {
        #authView:not(.hide) {
          padding: 25px 15px 35px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function installTabSubmission() {
    const loginTab = $('loginTab');
    const signupTab = $('signupTab');
    const loginForm = $('loginForm');
    const signupForm = $('signupForm');

    if (!loginTab || !signupTab || !loginForm || !signupForm) {
      return;
    }

    /* A selected tab submits its existing, validated form.
       An unselected tab still switches forms using the original handler. */
    function onTabClick(event) {
      const button = event.target.closest('#loginTab, #signupTab');
      if (!button || !button.classList.contains('active')) {
        return;
      }

      const form = button.id === 'loginTab' ? loginForm : signupForm;
      if (form.classList.contains('hide')) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        form.querySelector('.btn.primary')?.click();
      }
    }

    document.addEventListener('click', onTabClick, true);

    loginTab.textContent = 'Login';
    signupTab.textContent = 'Sign Up';

    loginTab.title = 'Select Login, then click again to sign in';
    signupTab.title = 'Select Sign Up, then click again to create your account';
  }

  function init() {
    if (!$('authView')) return;

    addStyles();
    installTabSubmission();

    window.MANA_LOGIN_CLEAN_BUILD = '103790';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {
      once: true
    });
  } else {
    init();
  }
})();
