
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH PROFILE — TILE & DROPDOWN REFINEMENT
   BUILD 104850

   COMPLETE REPLACEMENT:
   mana_coach_checkin_clarity_104800.js

   - All four top action tiles match
   - Prominent centred dropdown arrows
   - Orange / white / silver colours
   - Three Fuel targets only
   - Concise Program Builder explanation
   - Collapsible Coach Tools and Coach Notes
   - Original coaching actions preserved
   - No data or database changes
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104850";
  const VIEW = "coachClientDetailView";
  const STYLE = "manaCoachClarityStyle104850";
  const TOOLS = "manaCoachToolsFold104840";
  const NOTES = "manaCoachNotesFold104840";

  if (window.MANA_COACH_CLARITY_104850) return;
  window.MANA_COACH_CLARITY_104850 = true;

  const $ = id => document.getElementById(id);
  let timers = [];

  function isOpen() {
    const view = $(VIEW);
    return !!view &&
      !view.hidden &&
      !view.classList.contains("hide");
  }

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* =================================
         ALL FOUR TOP TILES MATCH
         ================================= */

      #${VIEW} #manaV1010ClientActions
      .m1010-action,
      #${VIEW} #manaV1010ClientActions
      .m1010-action.primary {
        background: #1B1E23 !important;
        background-image: none !important;
        border: 1px solid #59616C !important;
        border-radius: 15px !important;
        color: #FFFFFF !important;
        box-shadow: none !important;
      }

      #${VIEW} #manaV1010ClientActions
      .m1010-action strong,
      #${VIEW} #manaV1010ClientActions
      .m1010-action.primary strong {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
      }

      #${VIEW} #manaV1010ClientActions
      .m1010-action small,
      #${VIEW} #manaV1010ClientActions
      .m1010-action.primary small {
        color: #C1C6CE !important;
        -webkit-text-fill-color: #C1C6CE !important;
      }

      #${VIEW} #manaV1010ClientActions
      .m1010-action-icon,
      #${VIEW} #manaV1010ClientActions
      .m1010-action.primary .m1010-action-icon {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
        background: #101216 !important;
        border: 1px solid #FF7927 !important;
      }

      #${VIEW} #manaV1010ClientActions
      .m1010-action:hover {
        border-color: #FF7927 !important;
      }

      #${VIEW} #manaV1010ClientActions
      .m1010-actions-name strong {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
      }

      /* =================================
         ORANGE / WHITE / SILVER
         ================================= */

      #${VIEW} .gold,
      #${VIEW} .pill {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      #${VIEW} .pill {
        border-color: #FF7927 !important;
        background: #101216 !important;
      }

      #${VIEW} .quick-action-btn > span {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      /* =================================
         GENERATED TRAINING / FUEL
         ================================= */

      #${VIEW} #manaCoachGenerated104750
      .mg-kicker + .mg-grid
      .mg-stat:nth-child(4) {
        display: none !important;
      }

      #${VIEW} #manaCoachGenerated104750
      .mg-kicker + .mg-grid {
        grid-template-columns:
          repeat(3,minmax(0,1fr)) !important;
      }

      #${VIEW}
      #manaGeneratedOpenBuilder104750
      + .mg-desc {
        font-size: 0 !important;
      }

      #${VIEW}
      #manaGeneratedOpenBuilder104750
      + .mg-desc::after {
        content:
          "Customise this client's training. Previous workout history is preserved.";
        display: block;
        color: #C1C6CE !important;
        font-size: 12px !important;
        line-height: 1.6 !important;
      }

      /* =================================
         CENTRED WORKOUT DAY ARROWS
         ================================= */

      #${VIEW} #manaCoachGenerated104750
      .mg-day > summary {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 9px !important;
        text-align: center !important;
        list-style: none !important;
        cursor: pointer !important;
        padding: 15px !important;
      }

      #${VIEW} #manaCoachGenerated104750
      .mg-day > summary::-webkit-details-marker {
        display: none !important;
      }

      #${VIEW} #manaCoachGenerated104750
      .mg-day > summary::after {
        content: "⌄";
        display: grid;
        place-items: center;
        width: 62px;
        height: 28px;
        border: 1px solid #FF7927;
        border-radius: 9px;
        color: #FF7927;
        font-size: 27px;
        font-weight: 800;
        line-height: 1;
        transition: transform .15s ease;
      }

      #${VIEW} #manaCoachGenerated104750
      .mg-day[open] > summary::after {
        transform: rotate(180deg);
      }

      /* =================================
         ALL COLLAPSIBLE SECTION HEADERS
         ================================= */

      #${VIEW} #${TOOLS},
      #${VIEW} #${NOTES} {
        display: block !important;
        margin: 14px 0 !important;
        background: #15171A !important;
        border: 1px solid #626973 !important;
        border-radius: 19px !important;
        overflow: hidden !important;
      }

      #${VIEW} #${TOOLS} > summary,
      #${VIEW} #${NOTES} > summary,
      #${VIEW} #manaCoachSavedPrograms104820 > summary,
      #${VIEW} #manaCoachHistory104790 > summary {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 10px !important;
        padding: 17px 18px !important;
        text-align: center !important;
        list-style: none !important;
        cursor: pointer !important;
      }

      #${VIEW} #${TOOLS} > summary::-webkit-details-marker,
      #${VIEW} #${NOTES} > summary::-webkit-details-marker,
      #${VIEW} #manaCoachSavedPrograms104820
      > summary::-webkit-details-marker,
      #${VIEW} #manaCoachHistory104790
      > summary::-webkit-details-marker {
        display: none !important;
      }

      #${VIEW} .mana-fold-title-104840,
      #${VIEW} .mcp-summary-title,
      #${VIEW} .mcf-heading {
        color: #FFFFFF !important;
        font-size: 16px !important;
        font-weight: 900 !important;
        text-align: center !important;
      }

      #${VIEW} .mana-fold-sub-104840,
      #${VIEW} .mcp-summary-help,
      #${VIEW} .mcf-description {
        display: block;
        margin-top: 5px;
        color: #C1C6CE !important;
        font-size: 11px !important;
        line-height: 1.5 !important;
        text-align: center !important;
      }

      #${VIEW} .mana-fold-arrow-104840,
      #${VIEW} .mcp-arrow,
      #${VIEW} .mcf-chevron {
        display: grid !important;
        place-items: center !important;
        align-self: center !important;
        flex: 0 0 31px !important;
        width: 62px !important;
        height: 31px !important;
        min-width: 62px !important;
        border: 1px solid #FF7927 !important;
        border-radius: 9px !important;
        color: #FF7927 !important;
        background: #101216 !important;
        font-size: 27px !important;
        line-height: 1 !important;
        transition: transform .15s ease;
      }

      #${VIEW} details[open] > summary
      .mana-fold-arrow-104840,
      #${VIEW} details[open] > summary
      .mcp-arrow,
      #${VIEW} details[open] > summary
      .mcf-chevron {
        transform: rotate(180deg) !important;
      }

      #${VIEW} details > summary:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: -3px !important;
      }

      /* =================================
         COACH TOOLS / NOTES CONTENT
         ================================= */

      #${VIEW} #${TOOLS} > .card,
      #${VIEW} #${NOTES} > .card {
        margin: 0 !important;
        padding: 17px !important;
        background: #15171A !important;
        border: none !important;
        border-top: 1px solid #39414A !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }

      #${VIEW} #${TOOLS} > .card
      > .row:first-child,
      #${VIEW} #${NOTES} > .card
      > h3:first-child {
        display: none !important;
      }

      #${VIEW} [data-mana-duplicate-builder] {
        display: none !important;
      }

      #${VIEW} .mana-checkin-explain-104800 {
        margin: 12px 0;
        padding: 12px 14px;
        background: #101216 !important;
        border-left: 3px solid #FF7927 !important;
        border-radius: 9px;
        color: #C1C6CE !important;
        font-size: 12px;
        line-height: 1.6;
      }

      #${VIEW} .mana-checkin-explain-104800 strong {
        color: #FFFFFF !important;
      }

      #${VIEW} #requestCheckinBtn {
        background: #FF7927 !important;
        background-image: none !important;
        border: 1px solid #FF7927 !important;
        border-radius: 12px !important;
        color: #090A0C !important;
        -webkit-text-fill-color: #090A0C !important;
        box-shadow: none !important;
        font-weight: 900 !important;
      }

      @media(max-width:600px) {
        #${VIEW} #manaCoachGenerated104750
        .mg-kicker + .mg-grid {
          grid-template-columns:
            repeat(2,minmax(0,1fr)) !important;
        }

        #${VIEW} #${TOOLS} > summary,
        #${VIEW} #${NOTES} > summary,
        #${VIEW} #manaCoachSavedPrograms104820 > summary,
        #${VIEW} #manaCoachHistory104790 > summary {
          padding: 14px !important;
        }

        #${VIEW} #${TOOLS} > .card,
        #${VIEW} #${NOTES} > .card {
          padding: 13px !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================
     KEEP ORIGINAL COACHING FUNCTIONS
     ===================================== */

  function createFold(id, title, subtitle) {
    let fold = $(id);

    if (fold) return fold;

    fold = document.createElement("details");
    fold.id = id;

    const summary = document.createElement("summary");

    const words = document.createElement("span");

    words.innerHTML =
      '<span class="mana-fold-title-104840">' +
      title +
      '</span>' +
      '<span class="mana-fold-sub-104840">' +
      subtitle +
      '</span>';

    const arrow = document.createElement("span");
    arrow.className = "mana-fold-arrow-104840";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "⌄";

    summary.append(words, arrow);
    fold.appendChild(summary);

    return fold;
  }

  function organiseTools() {
    const view = $(VIEW);

    const card = $("quickRecordSessionBtn")
      ?.closest(".card");

    if (!view || !card || !view.contains(card)) return;

    const fold = createFold(
      TOOLS,
      "Coach Tools",
      "Notes · Focus · Sessions · Messages · Check-in request"
    );

    if (card.parentElement !== fold) {
      card.insertAdjacentElement("beforebegin", fold);
      fold.appendChild(card);
    }

    card.querySelectorAll("button").forEach(button => {
      if (
        button.textContent.trim().toLowerCase() ===
        "build custom program"
      ) {
        button.setAttribute(
          "data-mana-duplicate-builder",
          ""
        );
      }
    });

    const request = $("requestCheckinBtn");

    if (request) {
      request.textContent = "Request New Client Check-in";

      if (!card.querySelector(
        ".mana-checkin-explain-104800"
      )) {
        const info = document.createElement("div");
        info.className = "mana-checkin-explain-104800";

        info.innerHTML =
          "<strong>Client Check-in</strong>" +
          "<div>Ask this client to submit a new " +
          "weight, energy and wellbeing update.</div>";

        request.insertAdjacentElement(
          "beforebegin",
          info
        );
      }
    }
  }

  function organiseNotes() {
    const view = $(VIEW);
    const card = $("coachNotesCard");

    if (!view || !card || !view.contains(card)) return;

    const fold = createFold(
      NOTES,
      "Coach Notes",
      "Private coaching notes and next steps"
    );

    if (card.parentElement !== fold) {
      card.insertAdjacentElement("beforebegin", fold);
      fold.appendChild(card);
    }
  }

  function tidyTopCheckin() {
    const tile = $("manaV1010Checkin");

    if (!tile) return;

    const title = tile.querySelector("strong");
    const description = tile.querySelector("small");

    if (title) title.textContent = "CLIENT CHECK-INS";

    if (description) {
      description.textContent =
        "Review updates or request a check-in.";
    }
  }

  function tidy() {
    if (!isOpen()) return;

    organiseTools();
    organiseNotes();
    tidyTopCheckin();
  }

  /* =====================================
     TOP TILE BEHAVIOUR

     Leave the original handlers intact,
     apart from the existing check-in
     navigation, which opens the request.
     ===================================== */

  function onClick(event) {
    if (!isOpen()) return;

    const target = event.target;

    if (!(target instanceof Element)) return;

    if (target.closest("#manaV1010Checkin")) {
      if ($(TOOLS)) $(TOOLS).open = true;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      requestAnimationFrame(() => {
        $("requestCheckinBtn")?.scrollIntoView({
          block: "center",
          behavior: "smooth"
        });
      });

      return;
    }

    if (
      target.closest("#manaV1010Sessions") ||
      target.closest("#manaV1010Message")
    ) {
      if ($(TOOLS)) $(TOOLS).open = true;
    }

    if (target.closest("#quickAddNoteBtn")) {
      if ($(NOTES)) $(NOTES).open = true;
    }
  }

  function onFocus(event) {
    if (
      event.target?.id === "coachNoteDraft" &&
      $(NOTES)
    ) {
      $(NOTES).open = true;
    }
  }

  /* =====================================
     INITIALISE WITHOUT CONTINUOUS
     PAGE REBUILDING
     ===================================== */

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function schedule() {
    clearTimers();

    [100, 400, 900, 1800].forEach(delay => {
      timers.push(setTimeout(tidy, delay));
    });
  }

  function init() {
    installStyles();

    const view = $(VIEW);
    if (!view) return;

    document.addEventListener("click", onClick, true);
    document.addEventListener("focusin", onFocus, true);

    new MutationObserver(() => {
      if (isOpen()) {
        schedule();
      } else {
        clearTimers();
      }
    }).observe(view, {
      attributes: true,
      attributeFilter: ["class"]
    });

    if (isOpen()) schedule();

    console.log(
      "[Mana Movement] Coach tile/dropdown refine " +
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
