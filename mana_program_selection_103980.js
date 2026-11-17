
/* ============================================================
   MANA MOVEMENT — PREMIUM PROGRAM SELECTION 103982

   COMPLETE REPLACEMENT:
   mana_program_selection_103980.js

   Restores approved wide desktop and mobile design.
   Adds ManaLyfe included messaging to paid pathways.
   Preserves original buttons, IDs, navigation and prices.
   Does not change Coach Hub, training or billing.
   ============================================================ */

(() => {
  "use strict";

  if (window.MANA_SELECTION_103982) return;
  window.MANA_SELECTION_103982 = true;

  const HOME_ID = "manaV80Home";
  const STYLE_ID = "manaSelectionStyle103982";
  const $ = id => document.getElementById(id);

  const plans = [
    {
      id: "manaV80Mana28",
      name: "MANA 28",
      heading: "28-Day Kickstart",
      summary:
        "Structured workouts, nutrition guidance and daily habits to build consistency.",
      price: "$14.99 AUD / month",
      action: "Explore Mana28 →",
      accent: "#FF7927",
      border: "#FF7927",
      included: true
    },
    {
      id: "manaV80Strength",
      name: "MANA STRENGTH",
      heading: "Your Personalised Training",
      summary:
        "Tailored workouts, Fuel guidance and progress tracking to help you train with purpose.",
      price: "$39.99 AUD / month",
      action: "Explore Mana Strength →",
      accent: "#C1C6CE",
      border: "#A5ADB7",
      included: true
    },
    {
      id: "manaV80Life",
      name: "MANA LYFE",
      heading: "Reset. Rebuild. Move Forward.",
      summary:
        "Daily routines, reflection and positive habits to strengthen your wellbeing.",
      price: "",
      action: "Explore ManaLyfe →",
      accent: "#FFFFFF",
      border: "#FFFFFF",
      included: false
    }
  ];

  let observedHome = null;
  let observer = null;
  let queued = false;

  function installStyles() {
    if ($(STYLE_ID)) return;

    const sheet = document.createElement("style");
    sheet.id = STYLE_ID;

    sheet.textContent = `
      /* Original desktop width restored */

      body .wrap:has(> #${HOME_ID}) {
        max-width:920px!important;
      }

      html body #${HOME_ID} {
        width:min(760px,100%)!important;
        max-width:760px!important;
        margin:0 auto!important;
        padding:12px 10px
          calc(90px + env(safe-area-inset-bottom))!important;
        box-sizing:border-box!important;
        background:transparent!important;
      }

      /* Hide outdated selection elements */

      #${HOME_ID} .mana-v8013-profile,
      #${HOME_ID} .mana-v8013-select,
      #${HOME_ID} #manaV82Current {
        display:none!important;
      }

      /* Premium Mana Movement header */

      #${HOME_ID} .mana-v8013-brand {
        padding:0!important;
        margin:0 0 18px!important;
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
        background:transparent
          url("ui/mana-runner-logo.png")
          center/contain no-repeat!important;
      }

      #${HOME_ID} .mana-v8013-brand-row
      > div:last-child {
        min-width:0!important;
      }

      #${HOME_ID} .mana-v8013-brand-title {
        font:900 clamp(31px,7vw,46px)/1.05
          system-ui,sans-serif!important;
        letter-spacing:.035em!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        white-space:nowrap!important;
      }

      #${HOME_ID}
      .mana-v8013-brand-title .mana-brand-orange {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      #${HOME_ID} .mana-v8013-brand-kicker {
        margin-top:4px!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font:750 10px/1.2
          system-ui,sans-serif!important;
        letter-spacing:.13em!important;
      }

      #${HOME_ID} .mana-v8013-brand > h1,
      #${HOME_ID} .mana-v8013-sub,
      #${HOME_ID} .mana-v8013-welcome {
        display:none!important;
      }

      /* Original premium card layout */

      html body #${HOME_ID}
      button.mana-v8013-program,
      html body #${HOME_ID}
      button.mana-v8013-program.current {
        display:flex!important;
        flex-direction:column!important;
        align-items:stretch!important;
        justify-content:stretch!important;
        position:relative!important;
        width:100%!important;
        min-width:0!important;
        max-width:none!important;
        height:192px!important;
        min-height:192px!important;
        max-height:192px!important;
        padding:0!important;
        margin:0 0 12px!important;
        background:#08090B!important;
        background-image:none!important;
        border:2px solid var(
          --mana-program-border,#A5ADB7
        )!important;
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
        cursor:pointer!important;
        transition:border-color .15s ease!important;
      }

      html body #${HOME_ID} #manaV80Mana28 {
        --mana-program-accent:#FF7927;
        --mana-program-border:#FF7927;
        border-color:#FF7927!important;
      }

      html body #${HOME_ID} #manaV80Strength {
        --mana-program-accent:#C1C6CE;
        --mana-program-border:#A5ADB7;
        border-color:#A5ADB7!important;
      }

      html body #${HOME_ID} #manaV80Life {
        --mana-program-accent:#FFFFFF;
        --mana-program-border:#FFFFFF;
        border-color:#FFFFFF!important;
      }

      html body #${HOME_ID}
      button.mana-v8013-program.current,
      html body #${HOME_ID}
      button.mana-v8013-program:active {
        background:#08090B!important;
        background-image:none!important;
        box-shadow:none!important;
      }

      html body #${HOME_ID}
      button.mana-v8013-program:focus-visible {
        outline:2px solid
          var(--mana-program-accent,#FF7927)!important;
        outline-offset:3px!important;
      }

      /* Remove old decorative circles and badges */

      #${HOME_ID}
      button.mana-v8013-program::before,
      #${HOME_ID}
      button.mana-v8013-program::after {
        display:none!important;
        content:none!important;
      }

      #${HOME_ID}
      button.mana-v8013-program
      > :not(.mana-selection-panel) {
        display:none!important;
      }

      /* Internal card layout */

      #${HOME_ID}
      button.mana-v8013-program
      .mana-selection-panel {
        display:grid!important;
        grid-template-rows:
          auto auto 1fr auto!important;
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
        background:transparent!important;
        color:#FFFFFF!important;
        font-family:system-ui,sans-serif!important;
      }

      html body #${HOME_ID}
      .mana-selection-panel .mana-selection-label {
        display:block!important;
        margin:0!important;
        color:var(
          --mana-program-accent,#FF7927
        )!important;
        -webkit-text-fill-color:var(
          --mana-program-accent,#FF7927
        )!important;
        font:900 14px/1.2
          system-ui,sans-serif!important;
        letter-spacing:.12em!important;
        text-shadow:none!important;
        background:transparent!important;
      }

      html body #${HOME_ID}
      .mana-selection-panel .mana-selection-title {
        display:block!important;
        margin:0!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:900 22px/1.14
          system-ui,sans-serif!important;
        letter-spacing:-.025em!important;
        text-shadow:none!important;
        background:transparent!important;
      }

      html body #${HOME_ID}
      .mana-selection-panel .mana-selection-description {
        display:block!important;
        margin:0!important;
        max-width:100%!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font:550 14px/1.42
          system-ui,sans-serif!important;
        text-shadow:none!important;
        background:transparent!important;
      }

      /* ManaLyfe benefit within original card */

      #${HOME_ID} .mana-selection-included {
        display:block!important;
        width:max-content!important;
        max-width:100%!important;
        margin-top:8px!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        font:800 11px/1.35
          system-ui,sans-serif!important;
        text-shadow:none!important;
        background:transparent!important;
      }

      /* Price and Explore stay at bottom */

      #${HOME_ID} .mana-selection-bottom {
        display:flex!important;
        justify-content:space-between!important;
        align-items:end!important;
        width:100%!important;
        gap:12px!important;
        padding-top:5px!important;
        margin:0!important;
        font:800 14px/1.22
          system-ui,sans-serif!important;
        background:transparent!important;
      }

      html body #${HOME_ID}
      .mana-selection-panel .mana-selection-price {
        flex:1 1 auto!important;
        min-width:0!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        text-shadow:none!important;
        background:transparent!important;
      }

      html body #${HOME_ID}
      .mana-selection-panel .mana-selection-cta {
        flex:0 0 auto!important;
        white-space:nowrap!important;
        color:var(
          --mana-program-accent,#FF7927
        )!important;
        -webkit-text-fill-color:var(
          --mana-program-accent,#FF7927
        )!important;
        text-shadow:none!important;
        background:transparent!important;
      }

      /* Hide duplicate labels from older scripts */

      #${HOME_ID} .mcn-bundle-label {
        display:none!important;
      }

      /* Phone */

      @media(max-width:600px) {
        #${HOME_ID} .mana-v8013-mark {
          flex:0 0 48px!important;
          width:48px!important;
          height:39px!important;
        }

        #${HOME_ID} .mana-v8013-brand-row {
          gap:7px!important;
        }

        #${HOME_ID} .mana-v8013-brand-title {
          font-size:clamp(
            22px,6.6vw,31px
          )!important;
          letter-spacing:-.015em!important;
        }

        html body #${HOME_ID}
        button.mana-v8013-program,
        html body #${HOME_ID}
        button.mana-v8013-program.current {
          height:205px!important;
          min-height:205px!important;
          max-height:205px!important;
          margin-bottom:9px!important;
        }

        #${HOME_ID}
        button.mana-v8013-program
        .mana-selection-panel {
          padding:12px 14px!important;
          gap:4px!important;
        }

        #${HOME_ID} .mana-selection-title {
          font-size:20px!important;
        }

        #${HOME_ID} .mana-selection-label {
          font-size:13px!important;
        }

        #${HOME_ID} .mana-selection-description {
          font-size:12.5px!important;
        }

        #${HOME_ID} .mana-selection-bottom {
          font-size:12px!important;
          gap:6px!important;
        }
      }

      @media(max-width:370px) {
        #${HOME_ID} .mana-v8013-brand-title {
          font-size:22px!important;
        }

        html body #${HOME_ID}
        button.mana-v8013-program,
        html body #${HOME_ID}
        button.mana-v8013-program.current {
          height:210px!important;
          min-height:210px!important;
          max-height:210px!important;
        }

        #${HOME_ID} .mana-selection-title {
          font-size:19px!important;
        }

        #${HOME_ID} .mana-selection-bottom {
          flex-wrap:wrap!important;
        }

        #${HOME_ID} .mana-selection-cta {
          white-space:normal!important;
        }
      }
    `;

    document.head.appendChild(sheet);
  }

  function escapeHTML(input) {
    return String(input ?? "").replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]
    );
  }

  function makePanel(plan) {
    const panel = document.createElement("div");
    panel.className = "mana-selection-panel";

    panel.innerHTML = `
      <div class="mana-selection-label">
        ${escapeHTML(plan.name)}
      </div>

      <div class="mana-selection-title">
        ${escapeHTML(plan.heading)}
      </div>

      <div class="mana-selection-description">
        ${escapeHTML(plan.summary)}
        ${plan.included ? `
          <span class="mana-selection-included">
            ✓ ManaLyfe included with paid membership
          </span>
        ` : ""}
      </div>

      <div class="mana-selection-bottom">
        <span class="mana-selection-price">
          ${escapeHTML(plan.price)}
        </span>

        <span class="mana-selection-cta">
          ${escapeHTML(plan.action)}
        </span>
      </div>
    `;

    return panel;
  }

  function apply() {
    const home = $(HOME_ID);
    if (!home) return;

    const heading = home.querySelector(
      ".mana-v8013-brand-title"
    );

    if (
      heading &&
      !heading.querySelector(".mana-brand-orange")
    ) {
      heading.innerHTML =
        'MANA <span class="mana-brand-orange">' +
        'MOVEMENT</span>';
    }

    /* Reuse original program button elements */

    const cards = plans.map(
      plan => $(plan.id)
    );

    if (cards.some(card => !card)) return;

    const parent = cards[0].parentElement;

    if (
      !parent ||
      cards.some(
        card => card.parentElement !== parent
      )
    ) {
      return;
    }

    /* Original order: Mana28, Strength, Lyfe */

    const existing = [
      ...parent.children
    ].filter(element =>
      plans.some(plan => plan.id === element.id)
    );

    if (
      existing.length === 3 &&
      existing.some(
        (card, index) => card !== cards[index]
      )
    ) {
      const anchor =
        existing[existing.length - 1]
          .nextSibling;

      cards.forEach(card =>
        parent.insertBefore(card, anchor)
      );
    }

    cards.forEach((card, index) => {
      const plan = plans[index];

      const panels = card.querySelectorAll(
        ":scope > .mana-selection-panel"
      );

      if (
        panels.length !== 1 ||
        card.dataset.manaSelectionBuild !==
          "103982"
      ) {
        /* Only replace the button's interior.
           Keep its ID and navigation handler. */

        card.replaceChildren(
          makePanel(plan)
        );

        card.dataset.manaSelectionBuild =
          "103982";
      }

      card.style.setProperty(
        "--mana-program-accent",
        plan.accent
      );

      card.style.setProperty(
        "--mana-program-border",
        plan.border
      );

      card.style.setProperty(
        "background",
        "#08090B",
        "important"
      );

      card.style.setProperty(
        "background-image",
        "none",
        "important"
      );

      card.style.setProperty(
        "border",
        "2px solid " + plan.border,
        "important"
      );

      card.style.setProperty(
        "outline",
        "none",
        "important"
      );

      card.style.setProperty(
        "box-shadow",
        "none",
        "important"
      );

      card.setAttribute(
        "aria-label",
        [
          plan.name,
          plan.heading,
          plan.price,
          plan.included
            ? "ManaLyfe included with paid membership"
            : "",
          "Open program"
        ].filter(Boolean).join(". ")
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

      observer.observe(home, {
        childList: true,
        subtree: false
      });
    }

    apply();
  }

  function init() {
    installStyles();
    connect();

    [100, 450, 950, 1650, 2400]
      .forEach(ms => {
        setTimeout(connect, ms);
      });

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        if (
          event.target.closest(
            "#manaV80HomeBtn,[data-program]"
          )
        ) {
          setTimeout(connect, 1750);
        }
      }
    );

    window.addEventListener(
      "pageshow",
      connect
    );

    window.MANA_SELECTION_BUILD = "103982";
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
