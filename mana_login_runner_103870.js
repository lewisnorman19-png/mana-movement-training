
/* MANA MOVEMENT — RUNNER LOGIN 103870
   Complete replacement for login scripts 103780, 103790 and 103800.
   Keeps the original HTML forms, submission listeners, signup and reset.
   Uses existing image: ui/mana-runner-logo.png
   Presentation + tab UX only; does not modify authentication/permissions.
*/
(() => {
  "use strict";
  if (window.MANA_LOGIN_RUNNER_103870) return;
  window.MANA_LOGIN_RUNNER_103870 = true;

  const BUILD = "103870";
  const STYLE_ID = "manaLoginRunnerStyle103870";
  const HEADER_ID = "manaLoginRunnerHeader103870";
  const SHELL_ID = "manaLoginRunnerShell103870";
  const ROLES_ID = "manaLoginRunnerRoles103870";
  const $ = id => document.getElementById(id);

  function installStyles() {
    if ($(STYLE_ID)) return;
    const sheet = document.createElement("style");
    sheet.id = STYLE_ID;
    sheet.textContent = `
      body:has(#authView:not(.hide)) {
        background:#08090B!important;
        color:#FFFFFF!important;
      }
      body:has(#authView:not(.hide)) .wrap > header.brand {
        display:none!important;
      }
      #authView > .hero {display:none!important}
      #authView:not(.hide) {
        display:flex!important;
        flex-direction:column!important;
        justify-content:center!important;
        gap:23px!important;
        width:min(100%,540px)!important;
        max-width:540px!important;
        min-height:100dvh!important;
        padding:34px 18px 65px!important;
        margin:0 auto!important;
        box-sizing:border-box!important;
      }
      #authView > :not(#${HEADER_ID}):not(#${SHELL_ID}) {
        display:none!important;
      }
      #${HEADER_ID} {
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:9px;
        text-align:center;
        margin:0;
      }
      #${HEADER_ID} img {
        display:block;
        width:min(260px,75vw);
        max-height:170px;
        object-fit:contain;
        margin:0 auto 5px;
      }
      #${HEADER_ID} h1 {
        font:900 clamp(31px,7vw,46px)/1.05 system-ui,sans-serif;
        letter-spacing:.035em;
        margin:0;
        color:#FFFFFF!important;
      }
      #${HEADER_ID} h1 span {
        color:#FF7927!important;
      }
      #${HEADER_ID} p {
        margin:0;
        color:#C1C6CE!important;
        font-size:12px;
        font-weight:700;
        letter-spacing:.20em;
        text-transform:uppercase;
      }
      #${SHELL_ID}, #${SHELL_ID} > .card {
        width:100%!important;
        max-width:none!important;
        margin:0!important;
        padding:0!important;
        background:transparent!important;
        border:0!important;
        box-shadow:none!important;
      }
      #${SHELL_ID} .tabs {
        display:grid!important;
        grid-template-columns:1fr 1fr!important;
        gap:10px!important;
        margin:0 0 21px!important;
        padding:0!important;
        border:0!important;
      }
      #${SHELL_ID} .tabs button {
        min-height:50px!important;
        padding:10px 12px!important;
        border:1px solid #4A4E55!important;
        border-radius:13px!important;
        background:#15171B!important;
        color:#C1C6CE!important;
        font-size:15px!important;
        font-weight:800!important;
        cursor:pointer;
      }
      #${SHELL_ID} .tabs button.active {
        background:#1D2025!important;
        border-color:#FF7927!important;
        color:#FFFFFF!important;
        box-shadow:inset 0 -3px 0 #FF7927!important;
      }
      #${SHELL_ID} form:not(.hide) {
        display:flex!important;
        flex-direction:column!important;
        gap:10px!important;
        margin:0!important;
      }
      #${SHELL_ID} form label {
        color:#C1C6CE!important;
        font-size:12px!important;
        font-weight:750!important;
        margin:2px 0 -4px!important;
      }
      #${SHELL_ID} input,
      #${SHELL_ID} #resetPasswordPanel input {
        display:block;
        width:100%!important;
        min-width:0!important;
        min-height:52px!important;
        padding:12px 14px!important;
        box-sizing:border-box!important;
        border:1px solid #4A4E55!important;
        border-radius:13px!important;
        background:#15171B!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font-size:15px!important;
      }
      #${SHELL_ID} input:focus {
        border-color:#FF7927!important;
        outline:2px solid rgba(255,121,39,.22)!important;
        outline-offset:1px!important;
      }
      #${SHELL_ID} input::placeholder {color:#9299A4!important}
      #${SHELL_ID} form .btn.primary {
        display:block!important;
        width:100%!important;
        min-height:52px!important;
        margin:10px 0 0!important;
        border:1px solid #FF7927!important;
        border-radius:13px!important;
        background:#FF7927!important;
        color:#08090B!important;
        font-size:16px!important;
        font-weight:900!important;
        cursor:pointer!important;
      }
      #${SHELL_ID} form .btn.primary:hover {
        background:#FF9C5B!important;
      }
      #${SHELL_ID} #forgotPasswordBtn {
        display:block!important;
        width:auto!important;
        margin:13px 0 0 auto!important;
        padding:8px 0!important;
        color:#FF7927!important;
        font-size:13px!important;
        text-align:right!important;
      }
      #${SHELL_ID} #authMsg,
      #${SHELL_ID} #resetPasswordMsg {
        color:#C1C6CE!important;
        line-height:1.5;
      }
      #${SHELL_ID} #loginForm > p.tiny,
      #${SHELL_ID} > .card > p.tiny:last-child {
        display:none!important;
      }
      #${ROLES_ID} {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin-top:20px;
      }
      #${ROLES_ID} button {
        min-height:44px;
        border:1px solid #4A4E55;
        border-radius:12px;
        background:#15171B;
        color:#C1C6CE;
        font:750 14px system-ui,sans-serif;
        cursor:pointer;
      }
      #${ROLES_ID} button[aria-pressed="true"] {
        border-color:#FF7927;
        color:#FFFFFF;
        background:#1D2025;
      }
      #${ROLES_ID} p {
        grid-column:1/-1;
        text-align:center;
        margin:0;
        color:#A8AFB8;
        font-size:11px;
        line-height:1.5;
      }
      #${SHELL_ID} #resetPasswordPanel {padding-top:12px}
      #authView .hide {display:none!important}
      @media(max-width:520px) {
        #authView:not(.hide) {padding:24px 16px 45px!important;gap:17px!important}
        #${HEADER_ID} img {width:min(210px,65vw);max-height:135px}
      }
    `;
    document.head.appendChild(sheet);
  }

  function install() {
    const auth = $("authView");
    const loginForm = $("loginForm");
    const signupForm = $("signupForm");
    const card = loginForm?.closest(".card");
    if (!auth || !loginForm || !signupForm || !card) return;
    installStyles();

    let shell = $(SHELL_ID);
    if (!shell) {
      shell = document.createElement("div");
      shell.id = SHELL_ID;
      auth.appendChild(shell);
    }
    if (card.parentElement !== shell) shell.appendChild(card);

    let header = $(HEADER_ID);
    if (!header) {
      header = document.createElement("header");
      header.id = HEADER_ID;
      header.innerHTML = `
        <img src="ui/mana-runner-logo.png" alt="Mana Movement running logo">
        <h1>MANA <span>MOVEMENT</span></h1>
        <p>Move With Purpose</p>
      `;
      auth.insertBefore(header, shell);
    }

    const loginTab = $("loginTab");
    const signupTab = $("signupTab");
    if (loginTab) {
      loginTab.textContent = "Log in";
      loginTab.type = "button";
    }
    if (signupTab) {
      signupTab.textContent = "Sign up";
      signupTab.type = "button";
    }
    const loginButton = loginForm.querySelector(".btn.primary");
    const signupButton = signupForm.querySelector(".btn.primary");
    if (loginButton) loginButton.textContent = "Log in";
    if (signupButton) signupButton.textContent = "Create account";

    // Original form submit handlers and password-recovery events are
    // left entirely untouched. Tabs only switch the existing forms.
    let roles = $(ROLES_ID);
    if (!roles) {
      roles = document.createElement("div");
      roles.id = ROLES_ID;
      roles.innerHTML = `
        <button type="button" data-role="client" aria-pressed="true">Client</button>
        <button type="button" data-role="coach" aria-pressed="false">Coach</button>
        <p id="manaLoginRoleNote103870">Access is determined by your account permissions.</p>
      `;
      card.appendChild(roles);
      roles.addEventListener("click", event => {
        const chosen = event.target.closest("[data-role]");
        if (!chosen) return;
        roles.querySelectorAll("button").forEach(b => {
          b.setAttribute("aria-pressed", String(b === chosen));
        });
        const note = $("manaLoginRoleNote103870");
        if (note) {
          note.textContent = chosen.dataset.role === "coach"
            ? "Coach workspace requires an authorised coach account."
            : "Client workspace uses your existing membership.";
        }
      });
    }
    window.MANA_LOGIN_RUNNER_BUILD = BUILD;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, {once:true});
  } else {
    install();
  }
})();
