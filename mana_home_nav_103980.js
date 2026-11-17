
/* =========================================================
   MANA MOVEMENT — PROGRAM SELECTION
   BUILD 103981

   COMPLETE FILE REPLACEMENT:
   mana_program_selection_103980.js

   MAIN SCREEN:
   - Mana28: $14.99 AUD / month
   - Mana Strength: $39.99 AUD / month
   - Both include ManaLyfe with paid membership
   - ManaLyfe remains a separate pathway
   - Black / orange / white / silver
   - Original program buttons and event handlers retained
   - No subscription or database writes
   ========================================================= */

(() => {
  "use strict";

  if (window.MANA_SELECTION_103981) return;
  window.MANA_SELECTION_103981 = true;

  const HOME_ID = "manaV80Home";
  const STYLE_ID = "manaSelectionStyle103981";

  const $ = id => document.getElementById(id);

  const plans = [
    {
      id: "manaV80Mana28",
      name: "MANA 28",
      heading: "28-Day Kickstart",
      summary:
        "Structured workouts, nutrition guidance and daily habits to build consistency.",
      price: "$14.99 AUD / month",
      included:
        "ManaLyfe included with paid membership",
      action: "Explore Mana28 →",
      accent: "#FF7927",
      border: "#FF7927"
    },
    {
      id: "manaV80Strength",
      name: "MANA STRENGTH",
      heading: "Your Personalised Training",
      summary:
        "Tailored workouts, Fuel guidance and progress tracking to help you train with purpose.",
      price: "$39.99 AUD / month",
      included:
        "ManaLyfe included with paid membership",
      action: "Explore Mana Strength →",
      accent: "#C1C6CE",
      border: "#A5ADB7"
    },
    {
      id: "manaV80Life",
      name: "MANA LYFE",
      heading: "Reset. Rebuild. Move Forward.",
      summary:
        "Daily routines, reflection and positive habits to strengthen your wellbeing.",
      price: "Pricing to be confirmed",
      included: "",
      action: "Explore ManaLyfe →",
      accent: "#FFFFFF",
      border: "#FFFFFF"
    }
  ];

  let observedHome = null;
  let observer = null;
  let queued = false;

  function escapeHTML(input) {
    return String(input ?? "").replace(
      /[&<>"']/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[character]
    );
  }

  function installStyles() {
    if ($(STYLE_ID)) return;

    const sheet = document.createElement("style");
    sheet.id = STYLE_ID;

    sheet.textContent = `
      /* Main program selection screen only */

      #${HOME_ID} {
        color: #FFFFFF;
      }

      #${HOME_ID}
      .mana-v8013-program {
        position: relative !important;
        display: block !important;
        width: 100% !important;
        min-width: 0 !important;
        overflow: hidden !important;

        background: #08090B !important;
        background-image: none !important;

        border-radius: 18px !important;
        outline: none !important;
        box-shadow: none !important;

        text-align: left !important;
        cursor: pointer !important;
        box-sizing: border-box !important;
      }

      #${HOME_ID}
      #manaV80Mana28 {
        border: 2px solid #FF7927 !important;
      }

      #${HOME_ID}
      #manaV80Strength {
        border: 2px solid #A5ADB7 !important;
      }

      #${HOME_ID}
      #manaV80Life {
        border: 2px solid #FFFFFF !important;
      }

      #${HOME_ID}
      .mana-selection-panel {
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;

        width: 100% !important;
        min-width: 0 !important;
        min-height: 176px !important;
        padding: 16px 19px !important;

        color: #FFFFFF !important;
        background: transparent !important;
        box-sizing: border-box !important;
      }

      #${HOME_ID}
      .mana-selection-label {
        margin: 0 0 5px !important;

        color:
          var(--mana-program-accent, #FF7927)
          !important;

        font-size: 12px !important;
        font-weight: 900 !important;
        letter-spacing: .12em !important;
        line-height: 1.3 !important;
      }

      #${HOME_ID}
      .mana-selection-title {
        margin: 0 0 5px !important;

        color: #FFFFFF !important;
        -webkit-text-fill-color:
          #FFFFFF !important;

        font-size: clamp(18px, 3vw, 22px) !important;
        font-weight: 900 !important;
        line-height: 1.2 !important;
      }

      #${HOME_ID}
      .mana-selection-description {
        color: #C1C6CE !important;
        -webkit-text-fill-color:
          #C1C6CE !important;

        font-size: 12px !important;
        font-weight: 650 !important;
        line-height: 1.45 !important;
        max-width: 650px !important;
      }

      /* Bundled ManaLyfe message */

      #${HOME_ID}
      .mana-selection-included {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;

        width: fit-content !important;
        max-width: 100% !important;
        margin: 12px 0 3px !important;
        padding: 7px 10px !important;

        color: #FF7927 !important;
        -webkit-text-fill-color:
          #FF7927 !important;

        background: #21160E !important;
        border: 1px solid #FF7927 !important;
        border-radius: 9px !important;

        font-size: 11px !important;
        font-weight: 850 !important;
        line-height: 1.3 !important;
        box-sizing: border-box !important;
      }

      #${HOME_ID}
      .mana-selection-included-icon {
        display: inline-grid !important;
        place-items: center !important;

        width: 16px !important;
        height: 16px !important;

        color: #FF7927 !important;
        font-size: 14px !important;
        font-weight: 900 !important;
        flex-shrink: 0 !important;
      }

      #${HOME_ID}
      .mana-selection-bottom {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        flex-wrap: wrap !important;
        gap: 10px 16px !important;

        width: 100% !important;
        margin-top: auto !important;
        padding-top: 20px !important;
      }

      #${HOME_ID}
      .mana-selection-price {
        color: #FFFFFF !important;
        -webkit-text-fill-color:
          #FFFFFF !important;

        font-size: 12px !important;
        font-weight: 900 !important;
        line-height: 1.3 !important;
      }

      #${HOME_ID}
      .mana-selection-cta {
        color:
          var(--mana-program-accent, #FF7927)
          !important;

        -webkit-text-fill-color:
          var(--mana-program-accent, #FF7927)
          !important;

        font-size: 12px !important;
        font-weight: 900 !important;
        line-height: 1.3 !important;
      }

      #${HOME_ID}
      .mana-v8013-program:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: 3px !important;
      }

      #${HOME_ID}
      .mana-v8013-program:active {
        transform: scale(.995) !important;
      }

      /* Prevent extra duplicate labels from
         older scripts after the renderer runs. */

      #${HOME_ID}
      .mcn-bundle-label {
        display: none !important;
      }

      @media(max-width: 600px) {
        #${HOME_ID}
        .mana-selection-panel {
          padding: 14px !important;
          min-height: 185px !important;
        }

        #${HOME_ID}
        .mana-selection-title {
          font-size: 19px !important;
        }

        #${HOME_ID}
        .mana-selection-included {
          width: 100% !important;
          font-size: 10px !important;
        }

        #${HOME_ID}
        .mana-selection-bottom {
          gap: 9px !important;
        }
      }
    `;

    document.head.appendChild(sheet);
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
      </div>

      ${plan.included ? `
        <div class="mana-selection-included">
          <span
            class="mana-selection-included-icon"
            aria-hidden="true"
          >✓</span>

          <span>
            ${escapeHTML(plan.included)}
          </span>
        </div>
      ` : ""}

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
      !heading.querySelector(
        ".mana-brand-orange"
      )
    ) {
      heading.innerHTML =
        'MANA <span class="mana-brand-orange">' +
        'MOVEMENT</span>';
    }

    const cards = plans.map(
      plan => $(plan.id)
    );

    if (cards.some(card => !card)) return;

    const parent = cards[0].parentElement;

    /* Preserve original card elements,
       IDs and navigation handlers. */

    if (
      parent &&
      cards.every(
        card => card.parentElement === parent
      )
    ) {
      const existing = [
        ...parent.children
      ].filter(element =>
        plans.some(
          plan => plan.id === element.id
        )
      );

      if (
        existing.length === 3 &&
        existing.some(
          (card, index) =>
            card !== cards[index]
        )
      ) {
        const anchor =
          existing[existing.length - 1]
            .nextSibling;

        cards.forEach(card => {
          parent.insertBefore(
            card,
            anchor
          );
        });
      }
    }

    cards.forEach((card, index) => {
      const plan = plans[index];

      const panel = card.querySelector(
        ":scope > .mana-selection-panel"
      );

      if (
        !panel ||
        card.dataset.manaSelectionBuild !==
          "103981"
      ) {
        card.replaceChildren(
          makePanel(plan)
        );

        card.dataset.manaSelectionBuild =
          "103981";
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
        "border",
        "2px solid " + plan.border,
        "important"
      );

      card.style.setProperty(
        "box-shadow",
        "none",
        "important"
      );

      card.style.setProperty(
        "outline",
        "none",
        "important"
      );

      card.setAttribute(
        "aria-label",
        [
          plan.name,
          plan.heading,
          plan.price,
          plan.included,
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

      observer = new MutationObserver(
        schedule
      );

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
        if (
          !(event.target instanceof Element)
        ) {
          return;
        }

        if (
          event.target.closest(
            "#manaV80HomeBtn,[data-program]"
          )
        ) {
          setTimeout(
            connect,
            1750
          );
        }
      }
    );

    window.addEventListener(
      "pageshow",
      connect
    );

    window.MANA_SELECTION_BUILD =
      "103981";

    console.log(
      "[Mana Movement] Program selection 103981"
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
