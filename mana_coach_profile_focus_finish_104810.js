
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH PROFILE — ONE TRAINING PROGRAM
   BUILD 104820

   COMPLETE REPLACEMENT FILE:
   mana_coach_profile_focus_finish_104810.js

   CHANGES:
   - Generated workouts remain visible
   - Saved custom programs become an accordion
   - One clear training-program workspace
   - No misleading separate Assigned Programs panel
   - Keep existing custom-program assignment controls
   - Keep the working Program Builder
   - Keep History & Results collapsed
   - Move Latest Check-in and Coach Summary to history

   PRESERVES:
   - Supabase data and permissions
   - Generated workout snapshots
   - Client program assignments
   - All exercise data
   - Coaching history
   - Existing click handlers
   - Client and coach navigation

   No database changes.
   No cloning of program controls.
   No continuous subtree observers.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104820";

  const VIEW_ID = "coachClientDetailView";

  const GENERATED_ID =
    "manaCoachGenerated104750";

  const ASSIGNMENT_ID =
    "manaCoachAssignments104720";

  const SAVED_ID =
    "manaCoachSavedPrograms104820";

  const HISTORY_CONTENT_ID =
    "manaCoachHistoryContent104790";

  const STYLE_ID =
    "manaCoachProfileFinishStyle104820";

  const $ = id =>
    document.getElementById(id);

  let timers = [];

  /* =====================================
     PROFILE STATE
     ===================================== */

  function profileOpen() {
    const view = $(VIEW_ID);

    return Boolean(
      view &&
      !view.hidden &&
      !view.classList.contains("hide")
    );
  }

  /* =====================================
     STYLES
     ===================================== */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `

      /* =================================
         GENERATED TRAINING PLAN

         This is the primary program
         information for the coach.
         ================================= */

      #${VIEW_ID}
      #${GENERATED_ID} {
        margin-bottom: 0 !important;

        background: #15171A !important;

        border: 1px solid #626973 !important;
        border-radius: 20px !important;

        box-shadow: none !important;
      }

      /* When a real generated plan exists,
         use one clear section heading. */

      #${VIEW_ID}
      #${GENERATED_ID}:has(.mg-grid) > h3 {
        font-size: 0 !important;
      }

      #${VIEW_ID}
      #${GENERATED_ID}:has(.mg-grid) > h3::after {
        content: "Training Program";

        color: #FFFFFF !important;

        font-size: 22px !important;
        font-weight: 900 !important;
        line-height: 1.4 !important;
      }

      /* =================================
         SAVED PROGRAMS ACCORDION
         ================================= */

      #${VIEW_ID}
      #${SAVED_ID} {
        display: block !important;

        margin: -1px 0 16px !important;

        padding: 0 !important;

        background: #15171A !important;

        border: 1px solid #626973 !important;
        border-radius: 0 0 20px 20px !important;

        overflow: hidden !important;
        box-shadow: none !important;
      }

      #${VIEW_ID}
      #${GENERATED_ID}:has(+ #${SAVED_ID}) {
        border-radius: 20px 20px 0 0 !important;
      }

      #${VIEW_ID}
      #${SAVED_ID} > summary {
        display: flex !important;

        justify-content: space-between !important;
        align-items: center !important;

        gap: 12px !important;

        padding: 17px 19px !important;

        list-style: none !important;

        background: #101216 !important;

        color: #FFFFFF !important;

        cursor: pointer !important;
      }

      #${VIEW_ID}
      #${SAVED_ID} > summary::-webkit-details-marker {
        display: none !important;
      }

      #${VIEW_ID}
      #${SAVED_ID} .mcp-summary-title {
        display: block;

        color: #FFFFFF !important;

        font-size: 14px !important;
        font-weight: 900 !important;
      }

      #${VIEW_ID}
      #${SAVED_ID} .mcp-summary-help {
        display: block;

        margin-top: 4px;

        color: #C1C6CE !important;

        font-size: 11px !important;
        line-height: 1.5 !important;
      }

      #${VIEW_ID}
      #${SAVED_ID} .mcp-arrow {
        flex: 0 0 34px;

        width: 34px;
        height: 34px;

        display: grid;
        place-items: center;

        color: #FF7927 !important;

        border: 1px solid #FF7927 !important;
        border-radius: 10px;

        font-size: 18px;
      }

      #${VIEW_ID}
      #${SAVED_ID}[open] .mcp-arrow {
        transform: rotate(180deg);
      }

      #${VIEW_ID}
      #${SAVED_ID} > summary:focus-visible {
        outline: 2px solid #FF7927;
        outline-offset: -3px;
      }

      /* Existing assignment panel is now
         the content of the accordion,
         not a competing main card. */

      #${VIEW_ID}
      #${SAVED_ID}
      #${ASSIGNMENT_ID} {
        display: block !important;

        margin: 0 !important;
        padding: 16px 19px 19px !important;

        border: none !important;
        border-top: 1px solid #39414A !important;

        border-radius: 0 !important;

        background: #15171A !important;

        box-shadow: none !important;
      }

      /* Hide the repeated panel title.
         Accordion summary gives its name. */

      #${VIEW_ID}
      #${SAVED_ID}
      #${ASSIGNMENT_ID} > .mca-kicker,

      #${VIEW_ID}
      #${SAVED_ID}
      #${ASSIGNMENT_ID} > h3 {
        display: none !important;
      }

      /* One primary Program Builder action,
         visible in the generated workout
         panel when that button exists. */

      #${VIEW_ID}:has(
        #manaGeneratedOpenBuilder104750
      )
      #${SAVED_ID}
      #mcaBuild104720 {
        display: none !important;
      }

      /* =================================
         COACH HISTORY

         Hide duplicated current screen
         check-in and summary cards until
         moved into History & Results.
         ================================= */

      #${VIEW_ID}
      > .card:has(#detailLatestCheckin),

      #${VIEW_ID}
      > .card:has(#detailCoachSummary) {
        display: none !important;
      }

      #${VIEW_ID}
      #${HISTORY_CONTENT_ID}
      > .card:has(#detailLatestCheckin),

      #${VIEW_ID}
      #${HISTORY_CONTENT_ID}
      > .card:has(#detailCoachSummary) {
        display: block !important;

        background: #101216 !important;

        border: 1px solid #48515B !important;
        border-radius: 15px !important;

        box-shadow: none !important;
      }

      /* =================================
         MOBILE
         ================================= */

      @media(max-width:600px) {

        #${VIEW_ID}
        #${SAVED_ID} > summary {
          padding: 14px !important;
        }

        #${VIEW_ID}
        #${SAVED_ID}
        #${ASSIGNMENT_ID} {
          padding: 14px !important;
        }

        #${VIEW_ID}
        #${GENERATED_ID}:has(.mg-grid)
        > h3::after {
          font-size: 19px !important;
        }

      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================
     CREATE SAVED PROGRAM ACCORDION

     Do not recreate the assignment panel.
     Move its ORIGINAL element only.

     Its Supabase functions, dropdown and
     click handlers remain attached.
     ===================================== */

  function ensureSavedAccordion() {
    let saved = $(SAVED_ID);

    if (saved) return saved;

    saved =
      document.createElement("details");

    saved.id = SAVED_ID;

    saved.setAttribute(
      "aria-label",
      "Saved custom training programs"
    );

    saved.innerHTML = `
      <summary>
        <span>
          <span class="mcp-summary-title">
            Saved Custom Programs
          </span>

          <span class="mcp-summary-help">
            Optional · Assign a previously
            created training program
          </span>
        </span>

        <span
          class="mcp-arrow"
          aria-hidden="true"
        >
          ⌄
        </span>
      </summary>
    `;

    return saved;
  }

  /* =====================================
     UNIFY TRAINING PROGRAM AREA

     Generated workouts stay on top.

     Saved programs follow inside an
     accordion underneath.

     Move nodes only when their position
     is incorrect.
     ===================================== */

  function organiseTraining() {
    if (!profileOpen()) return;

    const view = $(VIEW_ID);

    const generated =
      $(GENERATED_ID);

    const assigned =
      $(ASSIGNMENT_ID);

    if (
      !view ||
      !generated ||
      !assigned ||
      !view.contains(generated) ||
      !view.contains(assigned)
    ) {
      return;
    }

    const saved =
      ensureSavedAccordion();

    /* Place accordion immediately after
       the generated program viewer. */

    if (
      saved.previousElementSibling !==
      generated
    ) {
      generated.insertAdjacentElement(
        "afterend",
        saved
      );
    }

    /* Keep original assignment form
       and all its event handlers. */

    if (assigned.parentElement !== saved) {
      saved.appendChild(assigned);
    }
  }

  /* =====================================
     KEEP CHECK-IN & COACH SUMMARY
     IN HISTORY & RESULTS

     Preserve original card elements.
     ===================================== */

  function cardContaining(id) {
    return $(id)?.closest(".card") || null;
  }

  function organiseHistory() {
    if (!profileOpen()) return;

    const content =
      $(HISTORY_CONTENT_ID);

    if (!content) return;

    const cards = [
      cardContaining("detailLatestCheckin"),
      cardContaining("detailCoachSummary")
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
     APPLY FOCUSED LAYOUT
     ===================================== */

  function organise() {
    if (!profileOpen()) return;

    organiseTraining();
    organiseHistory();
  }

  /* =====================================
     LIMITED SETUP PASSES

     Program modules load at different
     times after a profile opens.

     Do not watch or rebuild the
     entire profile continuously.
     ===================================== */

  function clearPending() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function scheduleOrganise() {
    clearPending();

    [
      120,
      450,
      900,
      1700,
      2700
    ].forEach(delay => {
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

    /* Only watch the profile's
       opening and closing state. */

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
      "[Mana Movement] Unified Training Program " +
      BUILD
    );
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
