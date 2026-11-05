
/* MANA MOVEMENT — PROGRAM SELECTION 103940
   Complete replacement for mana_program_selection_clean_103930.js.
   Client Home only. Keeps the three original buttons and click handlers.
   Does not change account access, subscriptions, or workout data. */
(() => {
  "use strict";
  if (window.MANA_SELECTION_103940) return;
  window.MANA_SELECTION_103940 = true;

  const HOME = "manaV80Home";
  const STYLE = "manaSelectionStyle103940";
  const plans = [
    {
      id: "manaV80Mana28",
      label: "MANA 28",
      title: "28-Day Kickstart",
      description: "Build consistency with structured workouts, nutrition guidance and daily habits.",
      price: "$14.99 AUD / month",
      action: "Explore Mana28 →",
      background: "#FF7927",
      border: "#FF7927"
    },
    {
      id: "manaV80Strength",
      label: "MANA STRENGTH",
      title: "Your Personalised Training",
      description: "Train with purpose through tailored workouts, Fuel guidance and progress tracking.",
      price: "$39.99 AUD / month",
      action: "Explore Mana Strength →",
      background: "#697686",
      border: "#B8C1CD"
    },
    {
      id: "manaV80Life",
      label: "MANA LYFE",
      title: "Reset. Rebuild. Move Forward.",
      description: "Strengthen your wellbeing through daily routines, reflection and positive habits.",
      price: "Pricing to be confirmed",
      action: "Explore ManaLyfe →",
      background: "#08090B",
      border: "#C1C6CE"
    }
  ];
  const $ = id => document.getElementById(id);
  let homeObserved = null;
  let observer = null;
  let refreshQueued = false;

  function addStyles() {
    if ($(STYLE)) return;
    const style = document.createElement("style");
    style.id = STYLE;
    style.textContent = `
      /* Home only; leave other client and coach screens alone. */
      body .wrap:has(> #${HOME}) {
        max-width:920px!important;
      }
      html body #${HOME} {
        width:min(760px,100%)!important;
        max-width:760px!important;
        margin:0 auto!important;
        padding:12px 10px calc(90px + env(safe-area-inset-bottom))!important;
        box-sizing:border-box!important;
      }
      #${HOME} .mana-v8013-profile,
      #${HOME} .mana-v8013-select,
      #${HOME} #manaV82Current { display:none!important; }

      #${HOME} .mana-v8013-brand {
        padding:0!important;
        margin:0 0 15px!important;
      }
      #${HOME} .mana-v8013-brand-row {
        display:flex!important;
        flex-wrap:nowrap!important;
        align-items:center!important;
        justify-content:flex-start!important;
        gap:12px!important;
        margin:0!important;
      }
      #${HOME} .mana-v8013-mark {
        display:block!important;
        flex:0 0 76px!important;
        width:76px!important;
        height:56px!important;
        padding:0!important;
        margin:0!important;
        border:0!important;
        font-size:0!important;
        color:transparent!important;
        box-shadow:none!important;
        background:transparent url("ui/mana-runner-logo.png?v=103940") center/contain no-repeat!important;
      }
      #${HOME} .mana-v8013-brand-row > div:last-child { min-width:0!important; }
      #${HOME} .mana-v8013-brand-title {
        font:900 clamp(31px,7vw,46px)/1.05 system-ui,sans-serif!important;
        letter-spacing:.035em!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        white-space:nowrap!important;
      }
      #${HOME} .mana-v8013-brand-title .mana-brand-orange {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      #${HOME} .mana-v8013-brand-kicker {
        margin-top:4px!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font:750 10px/1.2 system-ui,sans-serif!important;
        letter-spacing:.13em!important;
      }
      #${HOME} .mana-v8013-brand > h1,
      #${HOME} .mana-v8013-sub,
      #${HOME} .mana-v8013-welcome { display:none!important; }

      /* The original program buttons remain responsible for navigation. */
      html body #${HOME} button.mana-v8013-program {
        display:flex!important;
        flex-direction:column!important;
        align-items:stretch!important;
        justify-content:flex-start!important;
        width:100%!important;
        min-width:0!important;
        max-width:none!important;
        height:164px!important;
        min-height:164px!important;
        max-height:164px!important;
        margin:0 0 10px!important;
        padding:0!important;
        border-radius:18px!important;
        box-shadow:none!important;
        overflow:hidden!important;
        text-align:left!important;
        transform:none!important;
        opacity:1!important;
        visibility:visible!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }
      #${HOME} button.mana-v8013-program::before,
      #${HOME} button.mana-v8013-program::after {
        display:none!important;
        content:none!important;
      }
      #${HOME} button.mana-v8013-program > :not(.mana-selection-panel) {
        display:none!important;
      }
      #${HOME} button.mana-v8013-program .mana-selection-panel {
        display:flex!important;
        flex-direction:column!important;
        align-items:stretch!important;
        justify-content:flex-start!important;
        gap:5px!important;
        width:100%!important;
        height:100%!important;
        padding:15px 19px!important;
        position:relative!important;
        z-index:5!important;
        box-sizing:border-box!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font-family:system-ui,sans-serif!important;
      }
      #${HOME} .mana-selection-panel * {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        text-shadow:none!important;
      }
      #${HOME} .mana-selection-label {
        font-size:10px!important;
        font-weight:900!important;
        letter-spacing:.14em!important;
        line-height:1.1!important;
      }
      #${HOME} .mana-selection-title {
        font-size:clamp(19px,3vw,25px)!important;
        font-weight:950!important;
        letter-spacing:-.02em!important;
        line-height:1.12!important;
      }
      #${HOME} .mana-selection-description {
        max-width:100%!important;
        font-size:12px!important;
        font-weight:500!important;
        line-height:1.4!important;
      }
      #${HOME} .mana-selection-bottom {
        display:flex!important;
        justify-content:space-between!important;
        align-items:center!important;
        gap:12px!important;
        width:100%!important;
        margin-top:auto!important;
        padding-top:7px!important;
        font-size:11px!important;
        font-weight:850!important;
        line-height:1.2!important;
      }
      #${HOME} .mana-selection-bottom .mana-selection-cta {
        white-space:nowrap!important;
      }
      #${HOME} button.mana-v8013-program.current {
        outline:2px solid #FF7927!important;
        outline-offset:2px!important;
      }
      #${HOME} button.mana-v8013-program:focus-visible {
        outline:3px solid #FF7927!important;
        outline-offset:2px!important;
      }
      @media(max-width:600px) {
        #${HOME} .mana-v8013-mark {
          flex-basis:48px!important;
          width:48px!important;
          height:39px!important;
        }
        #${HOME} .mana-v8013-brand-row { gap:7px!important; }
        #${HOME} .mana-v8013-brand-title {
          font-size:clamp(22px,6.6vw,31px)!important;
          letter-spacing:-.015em!important;
        }
        #${HOME} button.mana-v8013-program {
          height:149px!important;
          min-height:149px!important;
          max-height:149px!important;
          margin-bottom:8px!important;
        }
        #${HOME} button.mana-v8013-program .mana-selection-panel {
          padding:11px 13px!important;
          gap:4px!important;
        }
        #${HOME} .mana-selection-title { font-size:19px!important; }
        #${HOME} .mana-selection-description { font-size:11px!important; }
        #${HOME} .mana-selection-bottom { font-size:10px!important; gap:6px!important; }
      }
      @media(max-width:360px) {
        #${HOME} .mana-v8013-brand-title { font-size:22px!important; }
        #${HOME} .mana-selection-bottom { flex-wrap:wrap!important; }
      }
    `;
    document.head.appendChild(style);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function apply() {
    const home = $(HOME);
    if (!home) return;
    const title = home.querySelector(".mana-v8013-brand-title");
    if (title && !title.querySelector(".mana-brand-orange")) {
      title.innerHTML = 'MANA <span class="mana-brand-orange">MOVEMENT</span>';
    }

    const cards = plans.map(p => $(p.id));
    if (cards.some(c => !c)) return;
    const parent = cards[0].parentElement;
    if (!parent || cards.some(c => c.parentElement !== parent)) return;
    const existing = [...parent.children].filter(c => plans.some(p => p.id === c.id));
    if (existing.length === 3 && existing.some((c, i) => c !== cards[i])) {
      const afterLast = existing[existing.length - 1].nextSibling;
      cards.forEach(card => parent.insertBefore(card, afterLast));
    }

    cards.forEach((card, i) => {
      const plan = plans[i];
      if (!card.querySelector(".mana-selection-panel")) {
        const panel = document.createElement("div");
        panel.className = "mana-selection-panel";
        panel.innerHTML = `
          <div class="mana-selection-label">${escapeHTML(plan.label)}</div>
          <div class="mana-selection-title">${escapeHTML(plan.title)}</div>
          <div class="mana-selection-description">${escapeHTML(plan.description)}</div>
          <div class="mana-selection-bottom">
            <span class="mana-selection-price">${escapeHTML(plan.price)}</span>
            <span class="mana-selection-cta">${escapeHTML(plan.action)}</span>
          </div>`;
        card.appendChild(panel);
      }
      // Inline declarations supersede remaining legacy Home colour rules.
      card.style.setProperty("background", plan.background, "important");
      card.style.setProperty("background-image", "none", "important");
      card.style.setProperty("border", `2px solid ${plan.border}`, "important");
      card.style.setProperty("height", "", "");
      card.setAttribute("aria-label", `${plan.label}: ${plan.title}. ${plan.price}. Open program`);
    });
  }

  function scheduleApply() {
    if (refreshQueued) return;
    refreshQueued = true;
    requestAnimationFrame(() => {
      refreshQueued = false;
      apply();
    });
  }

  function connect() {
    const home = $(HOME);
    if (!home) return;
    if (homeObserved !== home) {
      observer?.disconnect();
      homeObserved = home;
      observer = new MutationObserver(scheduleApply);
      observer.observe(home, { childList: true, subtree: false });
    }
    apply();
  }

  function init() {
    addStyles();
    connect();
    [100, 450, 900, 1600, 2400].forEach(ms => setTimeout(connect, ms));
    document.addEventListener("click", event => {
      if (event.target.closest("#manaV80HomeBtn,[data-program]")) {
        setTimeout(connect, 1700);
      }
    });
    window.addEventListener("pageshow", connect);
    window.MANA_SELECTION_BUILD = "103940";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once: true});
  } else {
    init();
  }
})();
