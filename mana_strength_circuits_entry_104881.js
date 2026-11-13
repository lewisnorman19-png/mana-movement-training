
/* =====================================================
   MANA MOVEMENT TRAINING
   STRENGTH CIRCUITS — NAVIGATION REFINEMENT
   BUILD 104882

   COMPLETE REPLACEMENT FILE:
   mana_strength_circuits_entry_104881.js

   MANA STRENGTH TABS:
   Overview | Workouts | Circuits | Fuel | Progress

   - Moves Circuits immediately after Workouts
   - Removes the duplicate Circuits Overview card
   - Styles the Learning Overview banner orange
   - Keeps all existing Learning content
   - Preserves original Circuits timer and workouts
   - Does not change Mana28 or ManaLyfe
   - No Supabase or saved-data changes
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104882";
  const STYLE_ID = "manaCircuitsNavStyle104882";
  const OLD_CARD_ID = "manaCircuitsEntry104881";

  if (window.MANA_CIRCUITS_NAV_104882) return;
  window.MANA_CIRCUITS_NAV_104882 = true;

  const $ = id => document.getElementById(id);

  let scheduled = false;

  /* =====================================
     CHECK CURRENT PROGRAM
     ===================================== */

  function strengthOpen() {
    const shell = $("manaV83ProgramShell");

    if (!shell?.classList.contains("open")) {
      return false;
    }

    const title = $("manaV83Title");

    return /strength/i.test(
      title?.textContent || ""
    );
  }

  /* =====================================
     PREMIUM STYLING
     ===================================== */

  function installStyle() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* Remove the unnecessary Circuits
         card from the Overview. */

      #${OLD_CARD_ID} {
        display: none !important;
      }

      /* Learning banner now matches
         the original Circuits banner. */

      #manaV83Content .msc-overview-learn {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        justify-content: center !important;

        width: 100% !important;
        margin: 16px 0 !important;
        padding: 20px !important;

        background: #15171A !important;
        background-image: none !important;

        border: 1px solid #FF7927 !important;
        border-radius: 19px !important;

        color: #FFFFFF !important;
        text-align: left !important;

        box-sizing: border-box !important;
        cursor: pointer !important;
        box-shadow: none !important;
      }

      #manaV83Content
      .msc-overview-learn .msc-kicker {
        color: #FF7927 !important;

        font-size: 10px !important;
        font-weight: 900 !important;
        letter-spacing: .12em !important;
      }

      #manaV83Content
      .msc-overview-learn strong {
        color: #FFFFFF !important;

        margin-top: 6px !important;

        font-size: 21px !important;
        font-weight: 900 !important;
        line-height: 1.3 !important;
      }

      #manaV83Content
      .msc-overview-learn small {
        display: block !important;

        color: #C1C6CE !important;
        margin-top: 7px !important;

        font-size: 12px !important;
        line-height: 1.5 !important;
      }

      #manaV83Content
      .msc-overview-learn:hover {
        border-color: #FFFFFF !important;
      }

      #manaV83Content
      .msc-overview-learn:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: 3px !important;
      }

      /* Circuits bottom tab */

      #manaV83Tabs
      .mana-circuits-tab-104882 {
        min-width: 0 !important;
      }

      #manaV83Tabs
      .mana-circuits-tab-104882
      .mana-circuits-icon {
        display: flex;
        justify-content: center;
        align-items: center;

        margin: 0 auto 4px;

        width: 23px;
        height: 23px;

        color: #C1C6CE;
      }

      #manaV83Tabs
      .mana-circuits-tab-104882
      .mana-circuits-icon svg {
        display: block;

        width: 21px;
        height: 21px;

        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      #manaV83Tabs
      .mana-circuits-tab-104882.active
      .mana-circuits-icon {
        color: #FF7927;
      }

      #manaV83Tabs
      .mana-circuits-tab-104882
      .mana-circuits-label {
        display: block;

        font-size: inherit;
        font-weight: 900;
        color: inherit;
      }

      @media(max-width:600px) {
        #manaV83Content .msc-overview-learn {
          padding: 15px !important;
        }

        #manaV83Content
        .msc-overview-learn strong {
          font-size: 18px !important;
        }

        #manaV83Tabs
        .mana-circuits-tab-104882
        .mana-circuits-label {
          font-size: 10px;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================
     REMOVE EXTRA CIRCUITS CARD
     ===================================== */

  function removeOldCard() {
    $(OLD_CARD_ID)?.remove();
  }

  /* =====================================
     UPDATE FIFTH TAB TO CIRCUITS

     Keep the original data-v83-tab="learn"
     because the existing Circuits module
     uses that slot to open its content.

     Only change its appearance and position.
     ===================================== */

  function updateCircuitsTab() {
    if (!strengthOpen()) return;

    const holder = $("manaV83Tabs");

    if (!holder) return;

    const workouts = holder.querySelector(
      '[data-v83-tab="program"]'
    );

    const circuits = holder.querySelector(
      '[data-v83-tab="learn"]'
    );

    if (!workouts || !circuits) return;

    /* Place Circuits immediately after
       Workouts, ahead of Fuel. */

    if (
      workouts.nextElementSibling !== circuits
    ) {
      workouts.insertAdjacentElement(
        "afterend",
        circuits
      );
    }

    /* Restore its clock icon and label.
       Do not replace the button or its
       original click handler. */

    const correctMarkup =
      circuits.querySelector(
        ".mana-circuits-label"
      )?.textContent.trim() === "Circuits";

    if (!correctMarkup) {
      circuits.innerHTML = `
        <span
          class="mana-circuits-icon"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="13" r="8"></circle>
            <path d="M12 9v4l3 2"></path>
            <path d="M9 2h6"></path>
            <path d="M12 2v3"></path>
          </svg>
        </span>

        <span class="mana-circuits-label">
          Circuits
        </span>
      `;
    }

    circuits.classList.add(
      "mana-circuits-tab-104882"
    );

    circuits.setAttribute(
      "aria-label",
      "Circuits"
    );
  }

  /* =====================================
     APPLY WHEN EXISTING NAV REBUILDS

     The original app recreates tab
     buttons when switching tabs.

     Watch only direct children of the
     bottom navigation, not the whole app.
     ===================================== */

  function refresh() {
    scheduled = false;

    removeOldCard();

    if (!strengthOpen()) return;

    updateCircuitsTab();
  }

  function schedule() {
    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(refresh);
  }

  function init() {
    installStyle();

    const tabs = $("manaV83Tabs");

    if (tabs) {
      new MutationObserver(schedule).observe(
        tabs,
        {
          childList: true,
          subtree: false
        }
      );
    }

    window.addEventListener(
      "mana:program-tab-change",
      schedule
    );

    window.addEventListener(
      "pageshow",
      schedule
    );

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest(
            "#manaV83Tabs .mana-v83-tab"
          )
        ) {
          schedule();
        }
      }
    );

    schedule();

    console.log(
      "[Mana Strength] Circuits navigation " +
      BUILD
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
