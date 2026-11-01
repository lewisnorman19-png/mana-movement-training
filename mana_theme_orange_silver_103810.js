
/* MANA MOVEMENT — ORANGE / BLACK / WHITE / SILVER
   Build 103810 — full standalone visual theme.
   Does not modify functionality, auth, navigation, or data. */
(() => {
  "use strict";
  const ID = "manaOrangeSilverTheme103810";
  if (document.getElementById(ID)) return;
  const style = document.createElement("style");
  style.id = ID;
  style.textContent = `
    :root {
      --bg:#08090b; --card:#14161a; --line:#464b52;
      --gold:#ec661a; --gold2:#ff822c;
      --text:#ffffff; --muted:#c1c6ce;
      --mana-orange:#ff7927; --mana-silver:#c1c6ce;
    }
    body {
      background:linear-gradient(180deg,#08090b,#111318)!important;
      color:#ffffff;
    }
    .gold,.brand small,.mark,.metric strong,.pill,.linkbtn,
    .nav button.active {
      color:var(--mana-orange)!important;
    }
    .mark,.pill {border-color:var(--mana-orange)!important}
    .card,.metric {
      background:linear-gradient(145deg,#1b1d21,#101114);
      border-color:#42464c;
    }
    .muted,.tiny.muted {color:var(--mana-silver)!important}
    input,select,textarea {
      background:#17191e;
      border-color:#535963;
      color:white;
    }
    input:focus-visible,select:focus-visible,textarea:focus-visible {
      outline:2px solid var(--mana-orange);
      outline-offset:2px;
    }
    .primary,.btn.primary {
      background:linear-gradient(135deg,#ff9547,#ee6319);
      color:#090909;
    }
    .secondary,.btn.secondary {
      background:#202329;
      border-color:#575d65;
      color:white;
    }
    .tabs .active,.check.done {
      background:var(--mana-orange);
      border-color:var(--mana-orange);
      color:#08090b;
    }
    .progress span {background:linear-gradient(90deg,#df570d,#ff9042)}
    #bottomNav {
      background:rgba(8,9,11,.97);
      border-top-color:#555b63;
    }
    #bottomNav button {color:#c1c6ce}
    #bottomNav button.active {
      color:var(--mana-orange)!important;
      background:rgba(255,121,39,.1);
      border:1px solid rgba(255,121,39,.5);
      border-radius:14px;
    }
    #manaCoachHubClean103760 .hub-hero {
      background:linear-gradient(130deg,#202125,#101114)!important;
      border-color:var(--mana-orange)!important;
    }
    #manaCoachHubClean103760 .hub-kicker,
    #manaCoachHubClean103760 .hub-figure {
      color:var(--mana-orange)!important;
    }
    #manaCoachHubClean103760 .hub-panel {
      background:#15171b!important;
      border-color:#474c53!important;
    }
    #manaCoachHubClean103760 .hub-card {
      --accent:var(--mana-orange)!important;
      background:#1c1f24!important;
      border-color:var(--mana-orange)!important;
    }
    #manaCoachHubClean103760 .hub-alert {
      background:#1c1f24!important;
      border-color:#525760!important;
    }
    #manaCoachHubClean103760 .hub-back,
    #manaCoachHubClean103760 .hub-secondary {
      color:var(--mana-orange)!important;
      border-color:var(--mana-orange)!important;
    }
    body:has(#authView:not(.hide)) {
      background:radial-gradient(ellipse at 50% 12%,#27292e,#08090b 75%) fixed!important;
    }
    #manaPremiumLoginTitle103780 span {color:var(--mana-orange)!important}
    #authView .tabs button,
    #authView #manaPremiumLoginRoles103780 button {
      background:#181b20!important;
      border-color:#5b6067!important;
      color:white!important;
    }
    #authView .tabs button.active,
    #authView #manaPremiumLoginRoles103780 button[aria-pressed="true"] {
      background:#3a2418!important;
      border-color:var(--mana-orange)!important;
      color:white!important;
      box-shadow:none!important;
    }
    #authView form input,
    #authView #resetPasswordPanel input {
      background:#191c20!important;
      border-color:#62676f!important;
      color:white!important;
    }
    #authView #forgotPasswordBtn {color:var(--mana-orange)!important}
    #authView form label {color:var(--mana-silver)!important}
    /* Original illustration assets and all component behavior stay intact. */
  `;
  document.head.appendChild(style);
  window.MANA_THEME_BUILD = "103810";
})();
