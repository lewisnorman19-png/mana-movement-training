
/* ============================================================
   MANA MOVEMENT TRAINING
   COACH HUB — HIDE HISTORICAL CARDS
   BUILD 105005

   COMPLETE JAVASCRIPT FILE

   Moves these existing cards into the
   collapsible History & Results section:

   1. Latest check-in
   2. Coach summary

   PRESERVES
   - Original live data and calculations
   - Existing event listeners
   - Coach Hub profile
   - Client photographs
   - Chat and messages
   - Navigation
   - Program assignments
   - Workout history
   - Mobile and laptop layouts

   No database changes.
   No duplicate cards.
   No replacement of existing HTML data.
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "105005";
  const FLAG = "MANA_COACH_HISTORY_105005";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const VIEW = "coachClientDetailView";
  const HISTORY = "manaCoachHistory104790";
  const CONTENT = "manaCoachHistoryContent104790";
  const STYLE = "manaCoachHistoryStyle105005";

  const $ = id => document.getElementById(id);

  let timers = [];
  let observer = null;
  let observedView = null;

  /* =====================================================
     STYLES
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* ==================================
         EXISTING HISTORY SECTION
         ================================== */

      #${VIEW} #${HISTORY} {
        background: #15171B !important;
        border: 1px solid #505862 !important;
        border-radius: 17px !important;
        margin: 14px 0 !important;
        box-shadow: none !important;
      }

      #${VIEW} #${HISTORY} > summary {
        background: #15171B !important;
        color: #FFFFFF !important;
      }

      #${VIEW} #${HISTORY}
      .mcf-heading {
        color: #FFFFFF !important;
        font-weight: 900 !important;
      }

      #${VIEW} #${HISTORY}
      .mcf-description {
        color: #B7C0CB !important;
      }

      #${VIEW} #${HISTORY}
      .mcf-chevron {
        color: #FF7927 !important;
        border-color: #FF7927 !important;
      }

      /* ==================================
         RELOCATED HISTORY CARDS
         ================================== */

      #${VIEW} #${CONTENT}
      .mana-history-card-105005 {
        display: block;
        background: #101215 !important;
        border: 1px solid #454D57 !important;
        border-radius: 14px !important;
        padding: 16px !important;
        margin: 13px 0 0 !important;
        box-shadow: none !important;
      }

      #${VIEW} #${CONTENT}
      .mana-history-card-105005 h3 {
        color: #FFFFFF !important;
        font-size: 16px !important;
        font-weight: 900 !important;
      }

      #${VIEW} #${CONTENT}
      .mana-history-card-105005
      .pill {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
        border-color: #FF7927 !important;
      }

      #${VIEW} #${CONTENT}
      .coach-summary-stat {
        background: #15171B !important;
        border: 1px solid #454D57 !important;
        border-radius: 12px !important;
      }

      #${VIEW} #${CONTENT}
      .coach-summary-value,
      #${VIEW} #${CONTENT}
      .coach-summary-number {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      @media(max-width:600px) {
        #${VIEW} #${CONTENT}
        .mana-history-card-105005 {
          padding: 12px !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     COACH PROFILE VISIBILITY
     ===================================================== */

  function profileOpen() {
    const view = $(VIEW);

    return Boolean(
      view &&
      !view.hidden &&
      !view.classList.contains("hide")
    );
  }

  /* =====================================================
     FIND ORIGINAL CARDS

     We move actual DOM nodes rather than
     copying or rebuilding their contents.
     ===================================================== */

  function cardFor(id) {
    const element = $(id);
    const view = $(VIEW);

    if (
      !element ||
      !view ||
      !view.contains(element)
    ) {
      return null;
    }

    return element.closest(".card");
  }

  /* =====================================================
     RELOCATE TWO HISTORICAL CARDS
     ===================================================== */

  function tidyHistory() {
    if (!profileOpen()) return false;

    const history = $(HISTORY);
    const content = $(CONTENT);

    if (
      !history ||
      !content ||
      !$(VIEW)?.contains(history)
    ) {
      return false;
    }

    const latest = cardFor(
      "detailLatestCheckin"
    );

    const summary = cardFor(
      "detailCoachSummary"
    );

    if (!latest || !summary) return false;

    const cards = [latest, summary];

    cards.forEach(card => {
      card.classList.add(
        "mana-history-card-105005"
      );
    });

    /*
     Position both cards together at the
     beginning of the existing History
     panel.

     Keep their real IDs and live content.
    */

    if (
      latest.parentElement !== content ||
      content.firstElementChild !== latest
    ) {
      content.prepend(latest);
    }

    if (
      summary.parentElement !== content ||
      latest.nextElementSibling !== summary
    ) {
      latest.insertAdjacentElement(
        "afterend",
        summary
      );
    }

    /*
     Keep the existing accordion closed
     when first opening a new client.

     Never close it while a coach is
     actively reviewing the history.
    */

    window.MANA_COACH_HISTORY_BUILD =
      BUILD;

    return true;
  }

  /* =====================================================
     BOUNDED REFRESH

     The existing Coach Hub updates its
     sections at slightly different times.

     No continuous page-wide observer.
     ===================================================== */

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function schedule() {
    clearTimers();

    [150, 450, 900, 1400].forEach(delay => {
      timers.push(
        setTimeout(tidyHistory, delay)
      );
    });
  }

  /* =====================================================
     WATCH CLIENT PROFILE OPEN / CLOSE

     Only observes the detail screen class.
     ===================================================== */

  function watchView() {
    const view = $(VIEW);

    if (
      !view ||
      view === observedView
    ) return;

    observer?.disconnect();
    observedView = view;

    observer = new MutationObserver(() => {
      if (profileOpen()) {
        schedule();
      } else {
        clearTimers();
      }
    });

    observer.observe(view, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  /* =====================================================
     INITIALISE
     ===================================================== */

  function init() {
    installStyles();
    watchView();

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            ".client-open[data-client-id]"
          )
        ) {
          schedule();
        }
      }
    );

    window.addEventListener(
      "pageshow",
      () => {
        watchView();
        if (profileOpen()) schedule();
      }
    );

    if (profileOpen()) {
      schedule();
    }

    console.log(
      "[Mana Movement] Coach History " +
      BUILD +
      " active"
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
