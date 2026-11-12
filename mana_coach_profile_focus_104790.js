
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH CLIENT PROFILE — FOCUSED LAYOUT
   BUILD 104790

   COMPLETE NEW FILE:
   mana_coach_profile_focus_104790.js

   MAIN PROFILE:
   - Client overview
   - Coaching actions
   - Current program assignments
   - Automatically generated workouts
   - Fuel targets
   - Latest check-in and coaching summary
   - Coaching notes

   HISTORY & RESULTS:
   - Collapsible section
   - Weight and energy charts
   - Training and session trends
   - Completed workout history
   - Check-in history
   - Session history
   - Strength progression
   - Habit history
   - Client reports

   IMPORTANT:
   - Existing elements are moved, not copied
   - Original event listeners are preserved
   - No database writes
   - No continuous DOM observers
   - No client program modifications
   - Smart Back 104770 remains disabled
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104790";

  const VIEW_ID = "coachClientDetailView";
  const STYLE_ID = "manaCoachProfileFocusStyle104790";
  const HISTORY_ID = "manaCoachHistory104790";
  const CONTENT_ID = "manaCoachHistoryContent104790";

  if (window.MANA_COACH_PROFILE_FOCUS_104790) {
    return;
  }

  window.MANA_COACH_PROFILE_FOCUS_104790 = true;

  const $ = id => document.getElementById(id);

  let pendingTimers = [];

  /* =====================================
     IDENTIFY ACTIVE COACH PROFILE
     ===================================== */

  function profileOpen() {
    const view = $(VIEW_ID);

    return Boolean(
      view &&
      !view.classList.contains("hide") &&
      !view.hidden
    );
  }

  /* =====================================
     INSERT STYLES
     ===================================== */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* =================================
         MAIN PROFILE FOUNDATION
         ================================= */

      #${VIEW_ID} {
        max-width: 1000px !important;
        padding-bottom: 120px !important;
      }

      /* =================================
         CURRENT COACHING INFORMATION
         ================================= */

      #${VIEW_ID}
      #manaV998ClientHero,

      #${VIEW_ID}
      #manaV1010ClientActions,

      #${VIEW_ID}
      #manaCoachAssignments104720,

      #${VIEW_ID}
      #manaCoachGenerated104750 {

        margin-bottom: 14px !important;
      }

      /* =================================
         HISTORY & RESULTS
         ================================= */

      #${VIEW_ID} #${HISTORY_ID} {
        display: block !important;

        margin: 17px 0 !important;

        background: #15171A !important;
        border: 1px solid #626973 !important;
        border-radius: 20px !important;

        color: #FFFFFF !important;

        overflow: hidden !important;
        box-shadow: none !important;
      }

      #${VIEW_ID}
      #${HISTORY_ID} > summary {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 14px !important;

        padding: 20px !important;

        background: #15171A !important;
        color: #FFFFFF !important;

        cursor: pointer !important;
        list-style: none !important;
      }

      #${VIEW_ID}
      #${HISTORY_ID} > summary::-webkit-details-marker {
        display: none !important;
      }

      #${VIEW_ID}
      #${HISTORY_ID} .mcf-heading {
        display: block;
        color: #FFFFFF;
        font-size: 19px;
        font-weight: 900;
        line-height: 1.35;
      }

      #${VIEW_ID}
      #${HISTORY_ID} .mcf-description {
        display: block;
        margin-top: 6px;

        color: #C1C6CE;
        font-size: 12px;
        line-height: 1.55;
      }

      #${VIEW_ID}
      #${HISTORY_ID} .mcf-chevron {
        display: grid;
        place-items: center;

        flex: 0 0 37px;
        width: 37px;
        height: 37px;

        border: 1px solid #FF7927;
        border-radius: 11px;

        color: #FF7927;
        font-size: 20px;

        transition: transform .15s ease;
      }

      #${VIEW_ID}
      #${HISTORY_ID}[open]
      .mcf-chevron {
        transform: rotate(180deg);
      }

      #${VIEW_ID}
      #${HISTORY_ID} > summary:focus-visible {
        outline: 2px solid #FF7927;
        outline-offset: -3px;
      }

      /* =================================
         HISTORY CONTENT
         ================================= */

      #${VIEW_ID}
      #${CONTENT_ID} {
        padding: 0 15px 15px !important;

        border-top: 1px solid #39414A !important;
      }

      #${VIEW_ID}
      #${CONTENT_ID} > .card {
        display: block;

        margin: 13px 0 0 !important;
        padding: 16px !important;

        background: #101216 !important;
        background-image: none !important;

        border: 1px solid #48515B !important;
        border-radius: 15px !important;

        box-shadow: none !important;
      }

      #${VIEW_ID}
      #${CONTENT_ID} > .card h3 {
        color: #FFFFFF !important;
        font-size: 16px !important;
      }

      #${VIEW_ID}
      #${CONTENT_ID} .pill {
        border-color: #FF7927 !important;

        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      /* =================================
         REVEAL PREVIOUSLY HIDDEN
         TRAINING TRENDS WHEN EXPANDED
         ================================= */

      #${VIEW_ID}
      #${HISTORY_ID}[open]
      #clientTrainingTrendsCard {
        display: block !important;
      }

      /* =================================
         CHART COLOURS
         ================================= */

      #${VIEW_ID}
      #${CONTENT_ID} .trend-bar {
        background: #FF7927 !important;
        background-image: none !important;
      }

      #${VIEW_ID}
      #${CONTENT_ID} .trend-value,
      #${VIEW_ID}
      #${CONTENT_ID} .trend-title {
        color: #FFFFFF !important;
      }

      #${VIEW_ID}
      #${CONTENT_ID} .trend-sub,
      #${VIEW_ID}
      #${CONTENT_ID} .trend-date {
        color: #C1C6CE !important;
      }

      /* =================================
         REDUCE VISUAL CLUTTER
         ================================= */

      #${VIEW_ID}
      #${CONTENT_ID} .trend-card {
        background: #0A0C0E !important;
        border-color: #39414A !important;
        border-radius: 12px !important;
      }

      #${VIEW_ID}
      #${CONTENT_ID} .session-summary-stat {
        background: #0A0C0E !important;
        border-color: #39414A !important;
      }

      /* =================================
         MOBILE
         ================================= */

      @media(max-width:700px) {

        #${VIEW_ID}
        #${HISTORY_ID} {
          border-radius: 17px !important;
        }

        #${VIEW_ID}
        #${HISTORY_ID} > summary {
          padding: 15px !important;
        }

        #${VIEW_ID}
        #${HISTORY_ID} .mcf-heading {
          font-size: 17px;
        }

        #${VIEW_ID}
        #${CONTENT_ID} {
          padding: 0 10px 10px !important;
        }

        #${VIEW_ID}
        #${CONTENT_ID} > .card {
          padding: 12px !important;
        }

      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================
     IDENTIFY EXISTING HISTORY CARDS

     Only the requested history/results
     panels are collected.

     We never recreate their inner HTML,
     which preserves listeners and data.
     ===================================== */

  function cardContaining(id) {
    const element = $(id);

    if (!element) return null;

    return element.closest(".card");
  }

  function historyCards() {
    const view = $(VIEW_ID);

    if (!view) return [];

    const candidates = [
      // Training and session trends
      $("clientTrainingTrendsCard"),

      // Historical coaching statistics
      $("clientSessionSummaryCard"),

      // Weight and energy
      cardContaining("weightTrendChart"),
      cardContaining("energyTrendChart"),

      // Recorded training history
      cardContaining("detailWorkoutHistory"),

      // Older check-ins
      cardContaining("detailCheckinHistory"),

      // Strength results
      cardContaining("detailStrengthLogs"),

      // Habits
      cardContaining("detailHabitHistory"),

      // Recorded coach sessions
      $("sessionHistoryCard"),

      // Exportable client report
      cardContaining("openClientReportBtn")
    ];

    const seen = new Set();

    return candidates.filter(card => {
      if (
        !card ||
        !view.contains(card) ||
        seen.has(card)
      ) {
        return false;
      }

      seen.add(card);
      return true;
    });
  }

  /* =====================================
     CREATE COLLAPSIBLE HISTORY SECTION
     ===================================== */

  function ensureHistory() {
    const view = $(VIEW_ID);

    if (!view) return null;

    let history = $(HISTORY_ID);

    if (history) return history;

    history = document.createElement("details");
    history.id = HISTORY_ID;

    history.setAttribute(
      "aria-label",
      "Client history and results"
    );

    history.innerHTML = `
      <summary>
        <span>
          <span class="mcf-heading">
            History &amp; Results
          </span>

          <span class="mcf-description">
            View weight, energy, training trends,
            completed workouts and session history.
          </span>
        </span>

        <span
          class="mcf-chevron"
          aria-hidden="true"
        >
          ⌄
        </span>
      </summary>

      <div id="${CONTENT_ID}"></div>
    `;

    view.appendChild(history);

    return history;
  }

  /* =====================================
     ORGANISE PROFILE

     No repeating observers or endless
     rebuilds.

     These are the original DOM nodes,
     not duplicate cards.
     ===================================== */

  function organiseProfile() {
    if (!profileOpen()) return;

    const history = ensureHistory();
    const content = $(CONTENT_ID);

    if (!history || !content) return;

    const cards = historyCards();

    cards.forEach(card => {
      if (card.parentElement !== content) {
        content.appendChild(card);
      }
    });

    /* Keep private coaching notes in the
       main working area, immediately before
       History & Results where possible. */

    const notes = $("coachNotesCard");

    if (
      notes &&
      notes.parentElement === $(VIEW_ID) &&
      notes.nextElementSibling !== history
    ) {
      notes.insertAdjacentElement(
        "afterend",
        history
      );
    }

    window.MANA_COACH_PROFILE_FOCUS_BUILD =
      BUILD;
  }

  /* =====================================
     SCHEDULE ONLY A FEW PASSES

     Existing modules initialise at
     different times after a profile opens.

     This avoids the continuous observers
     that previously caused problems.
     ===================================== */

  function clearPending() {
    pendingTimers.forEach(clearTimeout);
    pendingTimers = [];
  }

  function scheduleOrganise() {
    clearPending();

    [120, 450, 1000].forEach(delay => {
      pendingTimers.push(
        setTimeout(() => {
          if (profileOpen()) {
            organiseProfile();
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

    /* Observe only the profile's own
       visibility class. No subtree or
       document-wide observer is used. */

    const observer = new MutationObserver(() => {
      if (profileOpen()) {
        scheduleOrganise();
      } else {
        clearPending();
      }
    });

    observer.observe(view, {
      attributes: true,
      attributeFilter: ["class"]
    });

    /* Profile may already be open when
       the script initialises. */

    if (profileOpen()) {
      scheduleOrganise();
    }

    console.log(
      "[Mana Movement] Coach profile focus " +
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
