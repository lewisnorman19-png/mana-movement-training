
/* ==========================================================
   MANA MOVEMENT — PREMIUM AUTH SCREEN
   BUILD 103780 — COMPLETE STANDALONE FILE
   Presentation-only enhancement of the existing auth screen.
   Preserves existing Supabase login, signup and password reset.
   Coach permissions remain controlled by existing authentication.
   ========================================================== */
(() => {
  "use strict";
  if (window.MANA_PREMIUM_LOGIN_103780) return;
  window.MANA_PREMIUM_LOGIN_103780 = true;

  const STYLE_ID = "manaPremiumLoginStyle103780";
  const TITLE_ID = "manaPremiumLoginTitle103780";
  const ROLE_ID = "manaPremiumLoginRoles103780";

  function $(id) { return document.getElementById(id); }

  function styles() {
    if ($(STYLE_ID)) return;
    const sheet = document.createElement("style");
    sheet.id = STYLE_ID;
    sheet.textContent = `
      /* Scope every presentation rule to the auth screen. */
      body:has(#authView:not(.hide)) {
        background:radial-gradient(ellipse at 50% 0%,#11284b 0%,#071324 49%,#030913 100%) fixed!important;
      }
      #authView:not(.hide) {
        width:min(100%,600px)!important;
        max-width:600px!important;
        min-height:calc(100dvh - 50px);
        margin:0 auto!important;
        padding:clamp(30px,7vh,75px) 18px 55px!important;
        display:flex!important;
        flex-direction:column;
        align-items:stretch;
        justify-content:center;
        gap:19px;
        box-sizing:border-box;
      }
      #authView > .hero {display:none!important}
      #${TITLE_ID} {
        text-align:center;
        font-family:Georgia,serif;
        font-weight:500;
        font-size:clamp(35px,6.4vw,54px);
        line-height:1.13;
        letter-spacing:-.035em;
        margin:0 0 12px;
        color:#f0f5ff;
      }
      #${TITLE_ID} span {color:#efc35e}
      #authView > .card:not(.hero) {
        background:transparent!important;
        border:0!important;
        box-shadow:none!important;
        padding:0!important;
        margin:0!important;
        width:100%!important;
        max-width:none!important;
        border-radius:0!important;
      }
      #authView .tabs {
        display:grid!important;
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin:0 0 22px!important;
        padding:0!important;
        border:0!important;
        background:transparent!important;
      }
      #authView .tabs button {
        min-height:55px!important;
        padding:11px 10px!important;
        border:1px solid #856a3c!important;
        border-radius:14px!important;
        background:#0c1627!important;
        color:#ebc36a!important;
        font-size:16px!important;
        font-weight:750!important;
        box-shadow:none!important;
      }
      #authView .tabs button.active {
        background:linear-gradient(135deg,#123765,#092343)!important;
        border-color:#429dff!important;
        color:#fff!important;
        box-shadow:inset 0 0 0 1px #19569a!important;
      }
      #authView form:not(.hide) {
        display:flex!important;
        flex-direction:column;
        gap:11px;
        margin:0!important;
      }
      #authView form label {
        color:#c4d2e6!important;
        font-size:12px!important;
        font-weight:650!important;
        margin:3px 0 -4px!important;
      }
      #authView form input,
      #resetPasswordPanel input {
        width:100%!important;
        min-width:0!important;
        min-height:54px!important;
        padding:13px 15px!important;
        background:#101c2d!important;
        border:1px solid #43536c!important;
        border-radius:13px!important;
        outline:none!important;
        box-sizing:border-box!important;
        color:#fff!important;
        font-size:15px!important;
      }
      #authView input:focus {
        border-color:#60aaf7!important;
        box-shadow:0 0 0 3px #428ee52b!important;
      }
      #authView input::placeholder {color:#8997ae!important}
      #authView form .btn.primary {
        margin:12px 0 0!important;
        width:100%!important;
        min-height:55px!important;
        background:linear-gradient(135deg,#f4d18e,#c59a55)!important;
        color:#10141d!important;
        border:1px solid #f3d38b!important;
        border-radius:14px!important;
        font-size:16px!important;
        font-weight:900!important;
      }
      #authView #forgotPasswordBtn {
        color:#69b5ff!important;
        font-size:13px!important;
        width:auto!important;
        margin:12px 0 0!important;
        padding:6px 0!important;
        text-align:right!important;
        display:block!important;
        margin-left:auto!important;
      }
      #authView #authMsg {color:#d5dfef!important;line-height:1.5}
      #authView form#loginForm > p.tiny,
      #authView > .card:not(.hero) > p.tiny:last-child {
        display:none!important;
      }
      #${ROLE_ID} {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:12px;
        margin-top:21px;
      }
      #${ROLE_ID} button {
        min-height:53px;
        border-radius:13px;
        border:1px solid #b7914c;
        background:#0b1728;
        color:#eac16c;
        font:750 14px inherit;
        cursor:pointer;
      }
      #${ROLE_ID} button[aria-pressed="true"] {
        background:#12345b;
        color:#fff;
        border-color:#4ba5fd;
      }
      #${ROLE_ID} p {
        grid-column:1/-1;
        text-align:center;
        margin:0;
        color:#96a9be;
        font-size:11px;
        line-height:1.5;
      }
      #resetPasswordPanel {padding-top:12px}
      #authView .hide {display:none!important}
      @media(max-width:420px) {
        #authView:not(.hide) {padding:22px 17px 45px!important}
        #${TITLE_ID}{font-size:37px}
        #authView .tabs button{min-height:51px!important}
      }
    `;
    document.head.appendChild(sheet);
  }

  function install() {
    const auth = $("authView");
    const card = auth?.querySelector(".card:not(.hero)");
    const tabs = card?.querySelector(".tabs");
    if (!auth || !card || !tabs) return;
    styles();

    if (!$(TITLE_ID)) {
      const title = document.createElement("h1");
      title.id = TITLE_ID;
      title.innerHTML = 'Mana <span>Movement</span>';
      auth.insertBefore(title, card);
    }
    if (!$(ROLE_ID)) {
      const wrap = document.createElement("div");
      wrap.id = ROLE_ID;
      wrap.innerHTML = `
        <button type="button" data-mana-role="client" aria-pressed="true">Client</button>
        <button type="button" data-mana-role="coach" aria-pressed="false">Coach</button>
        <p id="manaRoleNote103780">Your account permissions determine which workspace opens after login.</p>`;
      // Decorative selection only: never changes authenticated permissions.
      wrap.addEventListener("click", event => {
        const b = event.target.closest("[data-mana-role]");
        if (!b) return;
        wrap.querySelectorAll("button").forEach(button => {
          button.setAttribute("aria-pressed",String(button === b));
        });
        const note = $("manaRoleNote103780");
        if (note) note.textContent = b.dataset.manaRole === "coach"
          ? "Coach access is available only to authorised coach accounts."
          : "Client access uses your existing account and membership.";
      });
      card.appendChild(wrap);
    }

    const login = $("loginTab");
    const signup = $("signupTab");
    if (login) login.textContent = "Login";
    if (signup) signup.textContent = "Sign Up";
    const submitLogin = $("loginForm")?.querySelector('button[type="submit"],button.btn.primary');
    if (submitLogin) submitLogin.textContent = "Login";
    const submitSignup = $("signupForm")?.querySelector('button[type="submit"],button.btn.primary');
    if (submitSignup) submitSignup.textContent = "Create Account";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded",install,{once:true});
  } else install();
})();
