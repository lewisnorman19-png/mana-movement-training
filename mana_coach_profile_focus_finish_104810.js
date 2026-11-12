
/* ============================================================
   MANA MOVEMENT TRAINING
   STABLE COACH CLIENT PROFILE
   BUILD 104830

   COMPLETE REPLACEMENT FILE:
   mana_coach_profile_focus_finish_104810.js

   FIX:
   - Keep coaching action cards directly below client name
   - Recover missing cards using existing action functions
   - Prevent action cards moving below other sections
   - Keep three coaching statistics
   - Keep generated workouts first
   - Keep saved assignments in an optional accordion
   - Keep check-ins and summaries in History & Results

   PRESERVES:
   - Supabase data
   - All original button functions
   - Program Builder
   - Workout snapshots
   - Client assignments
   - Coaching sessions and notes
   - Existing login and navigation

   No database writes.
   No duplicate action buttons.
   No continuous subtree observation.
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104830";

  if (window.MANA_COACH_STABLE_104830) return;
  window.MANA_COACH_STABLE_104830 = true;

  const VIEW = "coachClientDetailView";
  const HERO = "manaV998ClientHero";
  const ACTIONS = "manaV1010ClientActions";
  const SUMMARY = "manaV998ClientSummary";

  const GENERATED = "manaCoachGenerated104750";
  const ASSIGNED = "manaCoachAssignments104720";
  const SAVED = "manaCoachSavedPrograms104820";

  const HISTORY = "manaCoachHistory104790";
  const HISTORY_CONTENT =
    "manaCoachHistoryContent104790";

  const STYLE = "manaCoachStableStyle104830";

  const $ = id => document.getElementById(id);

  let scheduled = false;
  let recoveryAttempts = 0;
  let wasOpen = false;
  let timers = [];

  function open() {
    const view = $(VIEW);

    return !!(
      view &&
      !view.hidden &&
      !view.classList.contains("hide")
    );
  }

  /* =====================================
     DESIGN
     ===================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* The four coaching actions belong
         directly below the client header. */

      #${VIEW} #${ACTIONS} {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;

        margin: 0 0 14px !important;
        position: relative !important;
      }

      /* Keep the original action buttons
         and their existing click handlers. */

      #${VIEW} #${ACTIONS}
      .m1010-action {
        visibility: visible !important;
        opacity: 1 !important;
      }

      /* Three useful statistics only. */

      #${VIEW} #${SUMMARY} {
        display: grid !important;
        grid-template-columns:
          repeat(3,minmax(0,1fr)) !important;
        gap: 10px !important;
      }

      #${VIEW} #${SUMMARY}
      .mana-v998-stat:has(#manaV998Adherence) {
        display: none !important;
      }

      /* No unnecessary program-suite bar. */

      #${VIEW} #manaV998ProgramSuite {
        display: none !important;
      }

      /* Current generated workouts. */

      #${VIEW} #${GENERATED} {
        background: #15171A !important;
        border: 1px solid #626973 !important;
        border-radius: 20px 20px 0 0 !important;
        margin-bottom: 0 !important;
      }

      #${VIEW} #${GENERATED}:has(.mg-grid)
      > h3 {
        font-size: 0 !important;
      }

      #${VIEW} #${GENERATED}:has(.mg-grid)
      > h3::after {
        content: "Training Program";
        display: inline;
        color: #FFFFFF !important;
        font-size: 22px !important;
        font-weight: 900 !important;
      }

      /* Saved custom-program options are
         inside the same training section. */

      #${VIEW} #${SAVED} {
        display: block !important;
        margin: -1px 0 16px !important;
        background: #15171A !important;
        border: 1px solid #626973 !important;
        border-radius: 0 0 20px 20px !important;
        overflow: hidden !important;
      }

      #${VIEW} #${SAVED} > summary {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 12px !important;
        padding: 16px 19px !important;
        background: #101216 !important;
        color: #FFFFFF !important;
        cursor: pointer !important;
        list-style: none !important;
      }

      #${VIEW} #${SAVED}
      > summary::-webkit-details-marker {
        display: none !important;
      }

      #${VIEW} #${SAVED}
      .mcp-summary-title {
        color: #FFFFFF !important;
        font-size: 14px !important;
        font-weight: 900 !important;
      }

      #${VIEW} #${SAVED}
      .mcp-summary-help {
        display: block;
        margin-top: 4px;
        color: #C1C6CE !important;
        font-size: 11px !important;
      }

      #${VIEW} #${SAVED}
      .mcp-arrow {
        color: #FF7927 !important;
        font-size: 20px !important;
      }

      #${VIEW} #${SAVED}[open]
      .mcp-arrow {
        transform: rotate(180deg);
      }

      #${VIEW} #${SAVED}
      #${ASSIGNED} {
        display: block !important;
        margin: 0 !important;
        padding: 17px !important;
        background: #15171A !important;
        border: none !important;
        border-top: 1px solid #39414A !important;
        border-radius: 0 !important;
      }

      #${VIEW} #${SAVED}
      #${ASSIGNED} > h3,

      #${VIEW} #${SAVED}
      #${ASSIGNED} > .mca-kicker {
        display: none !important;
      }

      /* One primary Create Updated Program
         action, when available. */

      #${VIEW}:has(#manaGeneratedOpenBuilder104750)
      #${SAVED} #mcaBuild104720 {
        display: none !important;
      }

      /* Keep additional historical panels
         inside the existing accordion. */

      #${VIEW}
      #${HISTORY_CONTENT} > .card {
        display: block;
        margin-top: 13px !important;
        background: #101216 !important;
        border-color: #48515B !important;
      }

      @media(max-width:600px) {
        #${VIEW} #${SUMMARY} {
          grid-template-columns:
            repeat(3,minmax(0,1fr)) !important;
          gap: 6px !important;
        }

        #${VIEW} #${SAVED} > summary {
          padding: 14px !important;
        }

        #${VIEW} #${SAVED} #${ASSIGNED} {
          padding: 14px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================
     COACH ACTIONS

     Existing v10.10 owns the buttons and
     their functionality.

     We restore their correct position
     instead of rebuilding them.
     ===================================== */

  function ensureActions() {
    const view = $(VIEW);
    const hero = $(HERO);

    if (!view || !hero || !view.contains(hero)) {
      return;
    }

    let actions = $(ACTIONS);

    if (
      (!actions || !view.contains(actions)) &&
      recoveryAttempts < 3
    ) {
      recoveryAttempts++;

      if (
        typeof window
          .refreshManaCoachClientHubPolish ===
        "function"
      ) {
        window.refreshManaCoachClientHubPolish();
      }

      actions = $(ACTIONS);
    }

    if (!actions || !view.contains(actions)) {
      return;
    }

    /* The key fix: always immediately
       after the client's header. */

    if (hero.nextElementSibling !== actions) {
      hero.insertAdjacentElement(
        "afterend",
        actions
      );
    }
  }

  /* =====================================
     SAVED CUSTOM PROGRAMS

     Preserve the existing assignment
     form and all its event handlers.
     ===================================== */

  function savedAccordion() {
    let wrapper = $(SAVED);

    if (wrapper) return wrapper;

    wrapper = document.createElement("details");
    wrapper.id = SAVED;

    wrapper.setAttribute(
      "aria-label",
      "Saved custom training programs"
    );

    wrapper.innerHTML = `
      <summary>
        <span>
          <span class="mcp-summary-title">
            Saved Custom Programs
          </span>
          <span class="mcp-summary-help">
            Optional · Assign an existing program
          </span>
        </span>
        <span class="mcp-arrow"
              aria-hidden="true">⌄</span>
      </summary>
    `;

    return wrapper;
  }

  function organiseTraining() {
    const view = $(VIEW);
    const generated = $(GENERATED);
    const assigned = $(ASSIGNED);

    if (
      !view ||
      !generated ||
      !assigned ||
      !view.contains(generated) ||
      !view.contains(assigned)
    ) {
      return;
    }

    const wrapper = savedAccordion();

    if (generated.nextElementSibling !== wrapper) {
      generated.insertAdjacentElement(
        "afterend",
        wrapper
      );
    }

    if (assigned.parentElement !== wrapper) {
      wrapper.appendChild(assigned);
    }
  }

  /* =====================================
     HISTORY & RESULTS

     Move the original cards without
     duplicating or deleting their data.
     ===================================== */

  function organiseHistory() {
    const content = $(HISTORY_CONTENT);

    if (!content) return;

    [
      "detailLatestCheckin",
      "detailCoachSummary"
    ].forEach(id => {
      const card = $(id)?.closest(".card");

      if (card && card.parentElement !== content) {
        content.appendChild(card);
      }
    });
  }

  /* =====================================
     STABLE LAYOUT PASS

     No innerHTML rebuilding.
     No new event handlers on action cards.
     ===================================== */

  function organise() {
    scheduled = false;

    if (!open()) return;

    ensureActions();
    organiseTraining();
    organiseHistory();

    /* Recheck after other older modules
       have finished their placement. */

    const hero = $(HERO);
    const actions = $(ACTIONS);

    if (
      hero &&
      actions &&
      hero.nextElementSibling !== actions
    ) {
      hero.insertAdjacentElement(
        "afterend",
        actions
      );
    }
  }

  function schedule() {
    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(organise);
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function onProfileOpen() {
    recoveryAttempts = 0;
    clearTimers();

    [
      0,
      100,
      300,
      650,
      1200,
      2400,
      4200
    ].forEach(delay => {
      timers.push(
        setTimeout(schedule,delay)
      );
    });
  }

  /* =====================================
     INITIALISE

     Observe only DIRECT children and
     profile visibility, not the full
     subtree or its data updates.

     The observer only schedules a pass
     when the profile's structure changes.
     ===================================== */

  function init() {
    installStyles();

    const view = $(VIEW);

    if (!view) return;

    wasOpen = open();

    const observer = new MutationObserver(
      mutations => {
        const nowOpen = open();

        if (!nowOpen) {
          wasOpen = false;
          clearTimers();
          return;
        }

        if (!wasOpen) {
          wasOpen = true;
          onProfileOpen();
          return;
        }

        const structuralChange =
          mutations.some(m =>
            m.type === "childList"
          );

        if (structuralChange) {
          schedule();
        }
      }
    );

    observer.observe(view,{
      attributes:true,
      attributeFilter:["class"],
      childList:true,
      subtree:false
    });

    /* Client may already be open. */

    if (wasOpen) {
      onProfileOpen();
    }

    /* Catch client selection before
       the profile finishes loading. */

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest(
            ".client-open, " +
            ".m10091-action.view, " +
            "[data-client]"
          )
        ) {
          setTimeout(() => {
            if (open()) {
              wasOpen = true;
              onProfileOpen();
            }
          },100);
        }
      },
      false
    );

    console.log(
      "[Mana Movement] Stable Coach Profile " +
      BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );
  } else {
    init();
  }

})();
