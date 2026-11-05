
/* ============================================================
   MANA MOVEMENT — EQUAL PROGRAM BANNERS 103970
   Whole replacement for mana_program_selection_103940.js
   (or 103950 if that version was installed).
   Keeps original program buttons and their existing click handlers.
   Presentation only: no payment, access or training logic changes.
   ============================================================ */
(() => {
  "use strict";
  if (window.MANA_SELECTION_103970) return;
  window.MANA_SELECTION_103970 = true;

  const HOME_ID = "manaV80Home";
  const STYLE_ID = "manaSelectionStyle103970";
  const $ = id => document.getElementById(id);

  const plans = [
    {
      id: "manaV80Mana28",
      name: "MANA 28",
      heading: "28-Day Kickstart",
      summary: "Structured workouts, nutrition guidance and daily habits to build consistency.",
      price: "$14.99 AUD / month",
      action: "Explore Mana28 →",
      background: "#FF7927"
    },
    {
      id: "manaV80Strength",
      name: "MANA STRENGTH",
      heading: "Your Personalised Training",
      summary: "Tailored workouts, Fuel guidance and progress tracking to help you train with purpose.",
      price: "$39.99 AUD / month",
      action: "Explore Mana Strength →",
      background: "#697686"
    },
    {
      id: "manaV80Life",
      name: "MANA LYFE",
      heading: "Reset. Rebuild. Move Forward.",
      summary: "Daily routines, reflection and positive habits to strengthen your wellbeing.",
      price: "Pricing to be confirmed",
      action: "Explore ManaLyfe →",
      background: "#08090B"
    }
  ];

  let observedHome = null;
  let observer = null;
  let queued = false;

  function css() {
    if ($(STYLE_ID)) return;
    const sheet = document.createElement("style");
    sheet.id = STYLE_ID;
    sheet.textContent = `
      /* Client Home only — no changes to the app's other screens. */
      body .wrap:has(> #${HOME_ID}) { max-width:920px!important; }
      html body #${HOME_ID} {
        width:min(760px,100%)!important;
        max-width:760px!important;
        margin:0 auto!important;
        padding:12px 10px calc(90px + env(safe-area-inset-bottom))!important;
        box-sizing:border-box!important;
      }
      #${HOME_ID} .mana-v8013-profile,
      #${HOME_ID} .mana-v8013-select,
      #${HOME_ID} #manaV82Current { display:none!important; }

      /* Same header typography as the working login screen. */
      #${HOME_ID} .mana-v8013-brand {
        padding:0!important;
        margin:0 0 14px!important;
      }
      #${HOME_ID} .mana-v8013-brand-row {
        display:flex!important;
        flex-wrap:nowrap!important;
        align-items:center!important;
        gap:12px!important;
        margin:0!important;
      }
      #${HOME_ID} .mana-v8013-mark {
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
        background:transparent url("ui/mana-runner-logo.png?v=103970") center/contain no-repeat!important;
      }
      #${HOME_ID} .mana-v8013-brand-row > div:last-child { min-width:0!important; }
      #${HOME_ID} .mana-v8013-brand-title {
        font:900 clamp(31px,7vw,46px)/1.05 system-ui,sans-serif!important;
        letter-spacing:.035em!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        white-space:nowrap!important;
      }
      #${HOME_ID} .mana-v8013-brand-title .mana-brand-orange {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      #${HOME_ID} .mana-v8013-brand-kicker {
        margin-top:4px!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font:750 10px/1.2 system-ui,sans-serif!important;
        letter-spacing:.13em!important;
      }
      #${HOME_ID} .mana-v8013-brand > h1,
      #${HOME_ID} .mana-v8013-sub,
      #${HOME_ID} .mana-v8013-welcome { display:none!important; }

      /* Three equal-size banners. No white or orange selection outline. */
      html body #${HOME_ID} button.mana-v8013-program,
      html body #${HOME_ID} button.mana-v8013-program.current {
        display:flex!important;
        flex-direction:column!important;
        align-items:stretch!important;
        justify-content:stretch!important;
        position:relative!important;
        width:100%!important;
        min-width:0!important;
        max-width:none!important;
        height:180px!important;
        min-height:180px!important;
        max-height:180px!important;
        padding:0!important;
        margin:0 0 10px!important;
        border:0!important;
        border-radius:17px!important;
        outline:none!important;
        box-shadow:none!important;
        overflow:hidden!important;
        text-align:left!important;
        transform:none!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        opacity:1!important;
        visibility:visible!important;
      }
      #${HOME_ID} button.mana-v8013-program:focus-visible {
        outline:2px solid #FF7927!important;
        outline-offset:2px!important;
      }
      #${HOME_ID} button.mana-v8013-program::before,
      #${HOME_ID} button.mana-v8013-program::after {
        display:none!important;
        content:none!important;
      }
      /* Older scripts may append old labels and support lines later. */
      #${HOME_ID} button.mana-v8013-program > :not(.mana-selection-panel) {
        display:none!important;
      }
      #${HOME_ID} button.mana-v8013-program .mana-selection-panel {
        display:grid!important;
        grid-template-rows:auto auto 1fr auto!important;
        align-items:start!important;
        gap:5px!important;
        width:100%!important;
        height:100%!important;
        min-height:0!important;
        padding:15px 20px!important;
        margin:0!important;
        box-sizing:border-box!important;
        position:relative!important;
        z-index:5!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font-family:system-ui,sans-serif!important;
      }
      #${HOME_ID} .mana-selection-panel,
      #${HOME_ID} .mana-selection-panel * {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        text-shadow:none!important;
        background:transparent!important;
      }
      /* Identical type sizes for all three programs. */
      #${HOME_ID} .mana-selection-label {
        display:block!important;
        margin:0!important;
        font:900 14px/1.2 system-ui,sans-serif!important;
        letter-spacing:.12em!important;
      }
      #${HOME_ID} .mana-selection-title {
        display:block!important;
        margin:0!important;
        font:900 22px/1.14 system-ui,sans-serif!important;
        letter-spacing:-.025em!important;
      }
      #${HOME_ID} .mana-selection-description {
        display:block!important;
        margin:0!important;
        font:550 14px/1.42 system-ui,sans-serif!important;
        max-width:100%!important;
        overflow-wrap:normal!important;
      }
      /* Pricing and Explore action occupy the same bottom row. */
      #${HOME_ID} .mana-selection-bottom {
        display:flex!important;
        justify-content:space-between!important;
        align-items:end!important;
        width:100%!important;
        gap:12px!important;
        padding-top:5px!important;
        margin:0!important;
        font:800 14px/1.22 system-ui,sans-serif!important;
      }
      #${HOME_ID} .mana-selection-price {
        flex:1 1 auto!important;
        min-width:0!important;
      }
      #${HOME_ID} .mana-selection-cta {
        flex:0 0 auto!important;
        white-space:nowrap!important;
      }

      @media(max-width:600px) {
        #${HOME_ID} .mana-v8013-mark {
          flex:0 0 48px!important;
          width:48px!important;
          height:39px!important;
        }
        #${HOME_ID} .mana-v8013-brand-row {gap:7px!important}
        #${HOME_ID} .mana-v8013-brand-title {
          font-size:clamp(22px,6.6vw,31px)!important;
          letter-spacing:-.015em!important;
        }
        html body #${HOME_ID} button.mana-v8013-program,
        html body #${HOME_ID} button.mana-v8013-program.current {
          height:191px!important;
          min-height:191px!important;
          max-height:191px!important;
          margin-bottom:8px!important;
        }
        #${HOME_ID} button.mana-v8013-program .mana-selection-panel {
          padding:12px 14px!important;
          gap:4px!important;
        }
        #${HOME_ID} .mana-selection-title {font-size:20px!important}
        #${HOME_ID} .mana-selection-label {font-size:13px!important}
        #${HOME_ID} .mana-selection-description {font-size:12.5px!important}
        #${HOME_ID} .mana-selection-bottom {font-size:12px!important;gap:6px!important}
      }
      @media(max-width:370px) {
        #${HOME_ID} .mana-v8013-brand-title {font-size:22px!important}
        html body #${HOME_ID} button.mana-v8013-program,
        html body #${HOME_ID} button.mana-v8013-program.current {
          height:210px!important;
          min-height:210px!important;
          max-height:210px!important;
        }
        #${HOME_ID} .mana-selection-title {font-size:19px!important}
        #${HOME_ID} .mana-selection-bottom {flex-wrap:wrap!important}
      }
    `;
    document.head.appendChild(sheet);
  }

  function escapeHTML(input) {
    return String(input).replace(/[&<>"']/g, c => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;",
      '"':"&quot;", "'":"&#39;"
    })[c]);
  }

  function makePanel(plan) {
    const panel = document.createElement("div");
    panel.className = "mana-selection-panel";
    panel.innerHTML = `
      <div class="mana-selection-label">${escapeHTML(plan.name)}</div>
      <div class="mana-selection-title">${escapeHTML(plan.heading)}</div>
      <div class="mana-selection-description">${escapeHTML(plan.summary)}</div>
      <div class="mana-selection-bottom">
        <span class="mana-selection-price">${escapeHTML(plan.price)}</span>
        <span class="mana-selection-cta">${escapeHTML(plan.action)}</span>
      </div>
    `;
    return panel;
  }

  function apply() {
    const home = $(HOME_ID);
    if (!home) return;

    const heading = home.querySelector(".mana-v8013-brand-title");
    if (heading && !heading.querySelector(".mana-brand-orange")) {
      heading.innerHTML = 'MANA <span class="mana-brand-orange">MOVEMENT</span>';
    }

    const cards = plans.map(p => $(p.id));
    if (cards.some(card => !card)) return;
    const parent = cards[0].parentElement;
    if (!parent || cards.some(card => card.parentElement !== parent)) return;

    // Restore requested order, retaining the buttons and their click handlers.
    const existing = [...parent.children].filter(
      el => plans.some(p => p.id === el.id)
    );
    if (existing.length === 3 && existing.some((c,i) => c !== cards[i])) {
      const anchor = existing[existing.length - 1].nextSibling;
      cards.forEach(card => parent.insertBefore(card, anchor));
    }

    cards.forEach((card, i) => {
      const plan = plans[i];
      const panels = card.querySelectorAll(":scope > .mana-selection-panel");
      if (panels.length !== 1 || card.dataset.manaSelectionBuild !== "103970") {
        // Replace only the INSIDE of each existing program button.
        // Original button IDs, classes and click handlers survive.
        card.replaceChildren(makePanel(plan));
        card.dataset.manaSelectionBuild = "103970";
      }
      card.style.setProperty("background", plan.background, "important");
      card.style.setProperty("background-image", "none", "important");
      card.style.setProperty("border", i === 2 ? "2px solid #FFFFFF" : "0", "important");
      card.style.setProperty("outline", "none", "important");
      card.style.setProperty("box-shadow", "none", "important");
      card.setAttribute(
        "aria-label",
        `${plan.name}. ${plan.heading}. ${plan.price}. Open program`
      );
    });
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      apply();
    });
  }

  function connect() {
    const home = $(HOME_ID);
    if (!home) return;
    if (home !== observedHome) {
      observer?.disconnect();
      observedHome = home;
      observer = new MutationObserver(schedule);
      observer.observe(home, {childList:true, subtree:false});
    }
    apply();
  }

  function init() {
    css();
    connect();
    [100, 450, 950, 1650, 2400].forEach(ms => setTimeout(connect, ms));
    document.addEventListener("click", event => {
      if (event.target.closest("#manaV80HomeBtn,[data-program]")) {
        setTimeout(connect, 1750);
      }
    });
    window.addEventListener("pageshow", connect);
    window.MANA_SELECTION_BUILD = "103970";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
