
/* ====================================================
   MANA MOVEMENT TRAINING
   STRENGTH CIRCUITS — VISIBLE ENTRY FIX
   BUILD 104881

   NEW COMPLETE FILE:
   mana_strength_circuits_entry_104881.js

   - Show Circuits on Your Strength Hub
   - Rename Strength's Learn tab to Circuits
   - Open existing EMOM / Tabata / Strength page
   - Keep Learning & Training Guides accessible
   - Do not alter Mana28 or ManaLyfe
   - No database or navigation resets
   ==================================================== */

(() => {
  "use strict";

  const BUILD = "104881";
  const STYLE_ID = "manaCircuitsEntryStyle104881";
  const CARD_ID = "manaCircuitsEntry104881";

  if (window.MANA_CIRCUITS_ENTRY_104881) return;
  window.MANA_CIRCUITS_ENTRY_104881 = true;

  const $ = id => document.getElementById(id);

  function strengthOpen() {
    const shell = $("manaV83ProgramShell");
    const title = $("manaV83Title");

    return Boolean(
      shell?.classList.contains("open") &&
      /strength/i.test(title?.textContent || "")
    );
  }

  function getCircuitTab() {
    if (!strengthOpen()) return null;

    return document.querySelector(
      '#manaV83Tabs [data-v83-tab="learn"]'
    );
  }

  function installStyle() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      #${CARD_ID} {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 16px !important;

        width: 100% !important;
        margin: 16px 0 !important;
        padding: 20px !important;

        background: #15171A !important;
        border: 1px solid #FF7927 !important;
        border-radius: 19px !important;

        color: #FFFFFF !important;
        text-align: left !important;
        cursor: pointer !important;
        box-sizing: border-box !important;
      }

      #${CARD_ID} .mce-copy {
        min-width: 0;
        flex: 1;
      }

      #${CARD_ID} .mce-label {
        color: #FF7927 !important;
        font-size: 10px !important;
        font-weight: 900 !important;
        letter-spacing: .12em !important;
      }

      #${CARD_ID} .mce-title {
        display: block;
        margin: 6px 0;

        color: #FFFFFF !important;
        font-size: 21px !important;
        font-weight: 900 !important;
      }

      #${CARD_ID} .mce-description {
        display: block;

        color: #C1C6CE !important;
        font-size: 12px !important;
        line-height: 1.6 !important;
      }

      #${CARD_ID} .mce-open {
        display: flex;
        align-items: center;
        justify-content: center;

        flex: 0 0 43px;
        width: 43px;
        height: 43px;

        border: 1px solid #FF7927;
        border-radius: 12px;

        color: #FF7927 !important;
        font-size: 25px;
        font-weight: 900;
      }

      #${CARD_ID}:hover,
      #${CARD_ID}:focus-visible {
        border-color: #FFFFFF !important;
        outline-offset: 3px;
      }

      /* Only the Strength program tab */

      #manaV83ProgramShell
      #manaV83Tabs
      [data-v83-tab="learn"].mana-circuits-tab-104881 {
        color: #FF7927 !important;
        font-weight: 900 !important;
      }

      #manaV83ProgramShell
      #manaV83Tabs
      [data-v83-tab="learn"].active {
        color: #FF7927 !important;
      }

      @media(max-width:600px) {
        #${CARD_ID} {
          padding: 15px !important;
          gap: 10px !important;
        }

        #${CARD_ID} .mce-title {
          font-size: 18px !important;
        }

        #${CARD_ID} .mce-open {
          flex-basis: 39px;
          width: 39px;
          height: 39px;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================
     RENAME EXISTING FIFTH TAB
     ===================================== */

  function updateTabLabel() {
    const tab = getCircuitTab();

    if (!tab) return;

    if (tab.textContent.trim() !== "Circuits") {
      tab.textContent = "Circuits";
    }

    tab.classList.add("mana-circuits-tab-104881");

    tab.setAttribute(
      "aria-label",
      "Open Mana Strength Circuits"
    );
  }

  /* =====================================
     VISIBLE CARD ON STRENGTH HUB
     ===================================== */

  function addStrengthHubCard() {
    if (!strengthOpen()) return;

    const launchpad = $("manaV964Launchpad");

    if (!launchpad || launchpad.querySelector(
      "#" + CARD_ID
    )) {
      return;
    }

    const card = document.createElement("button");

    card.type = "button";
    card.id = CARD_ID;

    card.innerHTML = `
      <span class="mce-copy">
        <span class="mce-label">
          MANA STRENGTH · PREMIUM
        </span>

        <strong class="mce-title">
          Circuits
        </strong>

        <span class="mce-description">
          EMOM · Tabata · 45-Minute Strength Circuit
        </span>
      </span>

      <span class="mce-open" aria-hidden="true">
        →
      </span>
    `;

    launchpad.appendChild(card);
  }

  /* =====================================
     OPEN EXISTING CIRCUITS PAGE

     Does not create another workout
     renderer or timer.
     ===================================== */

  function openCircuits() {
    if (!strengthOpen()) return;

    updateTabLabel();

    const tab = getCircuitTab();

    if (!tab) {
      console.warn(
        "[Mana] Strength Circuits tab unavailable"
      );
      return;
    }

    tab.click();
  }

  function refresh() {
    if (!strengthOpen()) return;

    updateTabLabel();
    addStrengthHubCard();
  }

  /* =====================================
     SMALL, TARGETED OBSERVERS

     Observe only the existing Strength
     shell containers, not the whole page.
     ===================================== */

  function init() {
    installStyle();

    document.addEventListener(
      "click",
      event => {
        if (event.target.closest(
          "#" + CARD_ID
        )) {
          openCircuits();
        }
      }
    );

    const tabs = $("manaV83Tabs");

    if (tabs) {
      new MutationObserver(() => {
        if (strengthOpen()) {
          updateTabLabel();
        }
      }).observe(tabs, {
        childList: true
      });
    }

    const content = $("manaV83Content");

    if (content) {
      new MutationObserver(() => {
        if (strengthOpen()) {
          addStrengthHubCard();
        }
      }).observe(content, {
        childList: true
      });
    }

    window.addEventListener(
      "mana:program-tab-change",
      refresh
    );

    window.addEventListener(
      "pageshow",
      refresh
    );

    refresh();

    console.log(
      "[Mana Strength] Circuits entry " + BUILD
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
