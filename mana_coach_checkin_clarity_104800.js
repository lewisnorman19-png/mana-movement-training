
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH PROFILE — RIGHT ALIGNED ARROWS
   BUILD 104851

   COMPLETE REPLACEMENT:
   mana_coach_checkin_clarity_104800.js

   FIXES:
   - All dropdown arrows aligned right
   - Arrows fully inside card borders
   - Thicker orange arrow lines
   - Thicker orange arrow-box outlines
   - Matching charcoal top coaching tiles
   - Three Fuel targets only
   - Short Program Builder description
   - Collapsible Coach Tools and Notes

   PRESERVES:
   - Existing Coach Hub navigation
   - Client profiles and coaching actions
   - Generated workout connection
   - Custom program assignment
   - Check-in requests
   - Coach notes and sessions
   - Supabase records and workout history

   No database changes.
   No continuous subtree observers.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104851";
  const VIEW = "coachClientDetailView";
  const STYLE = "manaCoachClarityStyle104851";

  const TOOLS = "manaCoachToolsFold104840";
  const NOTES = "manaCoachNotesFold104840";

  if (window.MANA_COACH_CLARITY_104851) return;
  window.MANA_COACH_CLARITY_104851 = true;

  const $ = id => document.getElementById(id);

  let timers = [];

  function isOpen() {
    const view = $(VIEW);

    return !!(
      view &&
      !view.hidden &&
      !view.classList.contains("hide")
    );
  }

  /* =====================================
     PREMIUM DESIGN
     ===================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* =================================
         FOUR MATCHING TOP ACTION TILES
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
        background: #101216 !important;
        border: 1px solid #FF7927 !important;
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      #${VIEW} #manaV1010ClientActions
      .m1010-action:hover {
        border-color: #FF7927 !important;
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
         THREE FUEL TARGETS ONLY
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

      /* =================================
         SHORT PROGRAM BUILDER TEXT
         ================================= */

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
         WORKOUT DAY ARROWS

         Day name LEFT
         Thick orange arrow RIGHT
         Completely inside the border
         ================================= */

      #${VIEW} #manaCoachGenerated104750
      .mg-day > summary {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;

        gap: 14px !important;
        padding: 13px 16px !important;

        text-align: left !important;
        list-style: none !important;

        cursor: pointer !important;
        box-sizing: border-box !important;
      }

      #${VIEW} #manaCoachGenerated104750
      .mg-day > summary::-webkit-details-marker {
        display: none !important;
      }

      #${VIEW} #manaCoachGenerated104750
      .mg-day > summary::after {
        content: "⌄" !important;

        display: grid !important;
        place-items: center !important;

        flex: 0 0 44px !important;
        width: 44px !important;
        height: 39px !important;
        min-width: 44px !important;

        box-sizing: border-box !important;

        background: #101216 !important;

        border: 2px solid #FF7927 !important;
        border-radius: 10px !important;

        color: #FF7927 !important;

        font-family: Arial, sans-serif !important;
        font-size: 32px !important;
        font-weight: 900 !important;
        line-height: 1 !important;

        margin: 0 !important;
        transform: none !important;
        transition: none !important;
      }

      #${VIEW} #manaCoachGenerated104750
      .mg-day[open] > summary::after {
        content: "⌃" !important;
        transform: none !important;
      }

      /* =================================
         COLLAPSIBLE COACH PANELS
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

      /* =================================
         ALL SECTION HEADERS

         Text LEFT
         Arrow RIGHT
         ================================= */

      #${VIEW} #${TOOLS} > summary,
      #${VIEW} #${NOTES} > summary,
      #${VIEW}
      #manaCoachSavedPrograms104820 > summary,
      #${VIEW}
      #manaCoachHistory104790 > summary {

        display: flex !important;

        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;

        gap: 14px !important;

        padding: 16px 19px !important;

        text-align: left !important;

        list-style: none !important;
        cursor: pointer !important;

        box-sizing: border-box !important;
        min-width: 0 !important;
      }

      #${VIEW} #${TOOLS}
      > summary::-webkit-details-marker,
      #${VIEW} #${NOTES}
      > summary::-webkit-details-marker,
      #${VIEW}
      #manaCoachSavedPrograms104820
      > summary::-webkit-details-marker,
      #${VIEW}
      #manaCoachHistory104790
      > summary::-webkit-details-marker {
        display: none !important;
      }

      /* Text stays left. */

      #${VIEW} #${TOOLS} > summary > span:first-child,
      #${VIEW} #${NOTES} > summary > span:first-child,
      #${VIEW}
      #manaCoachSavedPrograms104820
      > summary > span:first-child,
      #${VIEW}
      #manaCoachHistory104790
      > summary > span:first-child {
        flex: 1 1 auto !important;

        min-width: 0 !important;

        text-align: left !important;
      }

      #${VIEW} .mana-fold-title-104840,
      #${VIEW} .mcp-summary-title,
      #${VIEW} .mcf-heading {
        display: block;

        color: #FFFFFF !important;

        font-size: 16px !important;
        font-weight: 900 !important;

        text-align: left !important;
      }

      #${VIEW} .mana-fold-sub-104840,
      #${VIEW} .mcp-summary-help,
      #${VIEW} .mcf-description {
        display: block;

        margin-top: 5px;

        color: #C1C6CE !important;

        font-size: 11px !important;
        line-height: 1.5 !important;

        text-align: left !important;
      }

      /* =================================
         LARGE THICK RIGHT ARROWS

         Button stays INSIDE the card.
         Chevron is drawn with 3px lines.
         ================================= */

      #${VIEW} .mana-fold-arrow-104840,
      #${VIEW} .mcp-arrow,
      #${VIEW} .mcf-chevron {

        position: relative !important;

        display: flex !important;

        align-items: center !important;
        justify-content: center !important;

        align-self: center !important;

        flex: 0 0 44px !important;

        width: 44px !important;
        min-width: 44px !important;

        height: 40px !important;
        min-height: 40px !important;

        box-sizing: border-box !important;

        margin: 0 !important;
        padding: 0 !important;

        background: #101216 !important;

        border: 2px solid #FF7927 !important;
        border-radius: 10px !important;

        color: transparent !important;
        -webkit-text-fill-color: transparent !important;

        font-size: 0 !important;

        transform: none !important;
      }

      /* Real thick-line chevron */

      #${VIEW} .mana-fold-arrow-104840::after,
      #${VIEW} .mcp-arrow::after,
      #${VIEW} .mcf-chevron::after {

        content: "" !important;

        display: block !important;

        position: absolute !important;

        left: 50% !important;
        top: 44% !important;

        width: 12px !important;
        height: 12px !important;

        border-right:
          3px solid #FF7927 !important;

        border-bottom:
          3px solid #FF7927 !important;

        border-left: 0 !important;
        border-top: 0 !important;

        box-sizing: border-box !important;

        transform:
          translate(-50%,-50%)
          rotate(45deg) !important;
      }

      /* Upwards arrow when expanded */

      #${VIEW} details[open] > summary
      .mana-fold-arrow-104840::after,
      #${VIEW} details[open] > summary
      .mcp-arrow::after,
      #${VIEW} details[open] > summary
      .mcf-chevron::after {

        top: 58% !important;

        transform:
          translate(-50%,-50%)
          rotate(225deg) !important;
      }

      /* Keep arrow boxes upright */

      #${VIEW} details[open] > summary
      .mana-fold-arrow-104840,
      #${VIEW} details[open] > summary
      .mcp-arrow,
      #${VIEW} details[open] > summary
      .mcf-chevron {
        transform: none !important;
      }

      /* Keyboard accessibility */

      #${VIEW} details > summary:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: -3px !important;
      }

      /* =================================
         COACH TOOLS AND NOTES CONTENT
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

      #${VIEW} #${TOOLS}
      > .card > .row:first-child,
      #${VIEW} #${NOTES}
      > .card > h3:first-child {
        display: none !important;
      }

      #${VIEW}
      [data-mana-duplicate-builder] {
        display: none !important;
      }

      /* =================================
         CLIENT CHECK-IN REQUEST
         ================================= */

      #${VIEW}
      .mana-checkin-explain-104800 {
        margin: 12px 0;
        padding: 12px 14px;

        background: #101216 !important;

        border-left:
          3px solid #FF7927 !important;

        border-radius: 9px;

        color: #C1C6CE !important;

        font-size: 12px;
        line-height: 1.6;
      }

      #${VIEW}
      .mana-checkin-explain-104800 strong {
        color: #FFFFFF !important;
      }

      #${VIEW} #requestCheckinBtn {
        background: #FF7927 !important;
        background-image: none !important;

        border: 1px solid #FF7927 !important;
        border-radius: 12px !important;

        color: #090A0C !important;
        -webkit-text-fill-color:
          #090A0C !important;

        box-shadow: none !important;
        font-weight: 900 !important;
      }

      /* =================================
         MOBILE
         ================================= */

      @media (max-width:600px) {

        #${VIEW}
        #manaCoachGenerated104750
        .mg-kicker + .mg-grid {
          grid-template-columns:
            repeat(2,minmax(0,1fr)) !important;
        }

        #${VIEW} #${TOOLS} > summary,
        #${VIEW} #${NOTES} > summary,
        #${VIEW}
        #manaCoachSavedPrograms104820
        > summary,
        #${VIEW}
        #manaCoachHistory104790
        > summary {
          padding: 13px 14px !important;
        }

        #${VIEW}
        #manaCoachGenerated104750
        .mg-day > summary {
          padding: 12px 13px !important;
        }

        #${VIEW}
        .mana-fold-arrow-104840,
        #${VIEW}
        .mcp-arrow,
        #${VIEW}
        .mcf-chevron {
          flex-basis: 42px !important;
          width: 42px !important;
          min-width: 42px !important;
          height: 38px !important;
          min-height: 38px !important;
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
     COLLAPSIBLE CONTAINERS

     Move ORIGINAL existing cards.
     Preserve buttons, data and handlers.
     ===================================== */

  function createFold(id, title, subtitle) {
    let fold = $(id);

    if (fold) return fold;

    fold = document.createElement("details");
    fold.id = id;

    const summary =
      document.createElement("summary");

    const words =
      document.createElement("span");

    const heading =
      document.createElement("span");

    heading.className =
      "mana-fold-title-104840";

    heading.textContent = title;

    const description =
      document.createElement("span");

    description.className =
      "mana-fold-sub-104840";

    description.textContent = subtitle;

    words.append(heading, description);

    const arrow =
      document.createElement("span");

    arrow.className =
      "mana-fold-arrow-104840";

    arrow.setAttribute(
      "aria-hidden",
      "true"
    );

    arrow.textContent = "⌄";

    summary.append(words, arrow);
    fold.appendChild(summary);

    return fold;
  }

  /* =====================================
     COACH TOOLS
     ===================================== */

  function organiseTools() {
    const view = $(VIEW);

    const card =
      $("quickRecordSessionBtn")
        ?.closest(".card");

    if (
      !view ||
      !card ||
      !view.contains(card)
    ) return;

    const fold = createFold(
      TOOLS,
      "Coach Tools",
      "Notes · Focus · Sessions · Messages · Check-in request"
    );

    if (card.parentElement !== fold) {
      card.insertAdjacentElement(
        "beforebegin",
        fold
      );

      fold.appendChild(card);
    }

    card.querySelectorAll("button")
      .forEach(button => {
        if (
          button.textContent.trim()
            .toLowerCase() ===
          "build custom program"
        ) {
          button.setAttribute(
            "data-mana-duplicate-builder",
            ""
          );
        }
      });

    const request =
      $("requestCheckinBtn");

    if (request) {
      request.textContent =
        "Request New Client Check-in";

      if (
        !card.querySelector(
          ".mana-checkin-explain-104800"
        )
      ) {
        const info =
          document.createElement("div");

        info.className =
          "mana-checkin-explain-104800";

        const heading =
          document.createElement("strong");

        heading.textContent =
          "Client Check-in";

        const description =
          document.createElement("div");

        description.textContent =
          "Ask this client to submit a new weight, energy and wellbeing update.";

        info.append(
          heading,
          description
        );

        request.insertAdjacentElement(
          "beforebegin",
          info
        );
      }
    }
  }

  /* =====================================
     COACH NOTES
     ===================================== */

  function organiseNotes() {
    const view = $(VIEW);
    const card = $("coachNotesCard");

    if (
      !view ||
      !card ||
      !view.contains(card)
    ) return;

    const fold = createFold(
      NOTES,
      "Coach Notes",
      "Private coaching notes and next steps"
    );

    if (card.parentElement !== fold) {
      card.insertAdjacentElement(
        "beforebegin",
        fold
      );

      fold.appendChild(card);
    }
  }

  /* =====================================
     TOP COACHING TILES
     ===================================== */

  function tidyTopCheckin() {
    const tile = $("manaV1010Checkin");

    if (!tile) return;

    const title =
      tile.querySelector("strong");

    const description =
      tile.querySelector("small");

    if (title) {
      title.textContent =
        "CLIENT CHECK-INS";
    }

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
     PRESERVE WORKING TILE ACTIONS
     ===================================== */

  function onClick(event) {
    if (!isOpen()) return;

    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (
      target.closest(
        "#manaV1010Checkin"
      )
    ) {
      if ($(TOOLS)) {
        $(TOOLS).open = true;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      requestAnimationFrame(() => {
        $("requestCheckinBtn")
          ?.scrollIntoView({
            block: "center",
            behavior: "smooth"
          });
      });

      return;
    }

    if (
      target.closest(
        "#manaV1010Sessions"
      ) ||
      target.closest(
        "#manaV1010Message"
      )
    ) {
      if ($(TOOLS)) {
        $(TOOLS).open = true;
      }
    }

    if (
      target.closest(
        "#quickAddNoteBtn"
      )
    ) {
      if ($(NOTES)) {
        $(NOTES).open = true;
      }
    }
  }

  function onFocus(event) {
    if (
      event.target?.id ===
        "coachNoteDraft" &&
      $(NOTES)
    ) {
      $(NOTES).open = true;
    }
  }

  /* =====================================
     LIMITED INITIALISATION
     ===================================== */

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function schedule() {
    clearTimers();

    [
      100,
      400,
      900,
      1800
    ].forEach(delay => {
      timers.push(
        setTimeout(tidy, delay)
      );
    });
  }

  function init() {
    installStyles();

    const view = $(VIEW);

    if (!view) return;

    document.addEventListener(
      "click",
      onClick,
      true
    );

    document.addEventListener(
      "focusin",
      onFocus,
      true
    );

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

    if (isOpen()) {
      schedule();
    }

    console.log(
      "[Mana Movement] Right-aligned arrows " +
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
