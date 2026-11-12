
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH PROFILE — FINAL FOCUS TIDY
   BUILD 104810

   COMPLETE NEW FILE:
   mana_coach_profile_focus_finish_104810.js

   MOVES INTO HISTORY & RESULTS:
   - Latest Check-in
   - Coach Summary

   KEEPS ON MAIN PROFILE:
   - Client details
   - Coaching actions
   - Performance summary
   - Assigned Programs
   - Generated Workouts
   - Fuel targets
   - Coach Notes
   - Current training tools

   PRESERVES:
   - All original elements
   - All event handlers
   - Client records
   - Supabase functionality
   - Existing client navigation

   No data deletion.
   No database changes.
   No continuous subtree observers.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104810";

  const VIEW_ID = "coachClientDetailView";
  const HISTORY_ID = "manaCoachHistory104790";
  const CONTENT_ID = "manaCoachHistoryContent104790";
  const STYLE_ID = "manaCoachFocusFinishStyle104810";

  if (window.MANA_COACH_FOCUS_FINISH_104810) {
    return;
  }

  window.MANA_COACH_FOCUS_FINISH_104810 = true;

  const $ = id => document.getElementById(id);

  let timers = [];

  function profileOpen() {
    const view = $(VIEW_ID);

    return Boolean(
      view &&
      !view.classList.contains("hide")
    );
  }

  /* =====================================
     PREVENT OLD PANELS FLASHING
     ON THE MAIN SCREEN
     ===================================== */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `

      /* Latest Check-in and Coach Summary
         belong in History & Results. */

      #${VIEW_ID}
      > .card:has(#detailLatestCheckin),

      #${VIEW_ID}
      > .card:has(#detailCoachSummary) {
        display: none !important;
      }

      /* Restore their display when moved
         inside History & Results. */

      #${VIEW_ID}
      #${CONTENT_ID}
      > .card:has(#detailLatestCheckin),

      #${VIEW_ID}
      #${CONTENT_ID}
      > .card:has(#detailCoachSummary) {
        display: block !important;
      }

      /* Keep the history cards consistent
         with the premium coach design. */

      #${VIEW_ID}
      #${CONTENT_ID}
      > .card {
        background: #101216 !important;
        border: 1px solid #48515B !important;
        border-radius: 15px !important;

        box-shadow: none !important;
      }

      #${VIEW_ID}
      #${CONTENT_ID}
      > .card h3 {
        color: #FFFFFF !important;
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================
     LOCATE EXISTING CARDS
     ===================================== */

  function parentCard(id) {
    const element = $(id);

    if (!element) return null;

    return element.closest(".card");
  }

  /* =====================================
     MOVE ORIGINAL CARDS INTO HISTORY

     No cloning or HTML replacement.
     All existing values and handlers stay.
     ===================================== */

  function organise() {
    if (!profileOpen()) return;

    const content = $(CONTENT_ID);

    if (!content) return;

    const cards = [
      parentCard("detailLatestCheckin"),
      parentCard("detailCoachSummary")
    ];

    cards.forEach(card => {
      if (
        card &&
        card.parentElement !== content
      ) {
        content.appendChild(card);
      }
    });
  }

  /* =====================================
     LIMITED INITIALISATION

     Earlier profile modules load at
     slightly different times.

     Run only a few scheduled passes.
     ===================================== */

  function clearPending() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function scheduleOrganise() {
    clearPending();

    [150, 650, 1300].forEach(delay => {
      timers.push(
        setTimeout(() => {
          if (profileOpen()) {
            organise();
          }
        }, delay)
      );
    });
  }

  /* =====================================
     INITIALISE
     ===================================== */

  function init() {
    installStyles();

    const view = $(VIEW_ID);

    if (!view) return;

    new MutationObserver(() => {
      if (profileOpen()) {
        scheduleOrganise();
      } else {
        clearPending();
      }
    }).observe(view, {
      attributes: true,
      attributeFilter: ["class"]
    });

    if (profileOpen()) {
      scheduleOrganise();
    }

    console.log(
      "[Mana Movement] Profile focus finish " +
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
