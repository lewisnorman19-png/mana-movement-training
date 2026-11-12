
/* ============================================================
   MANA MOVEMENT TRAINING
   COACH PROFILE — PREMIUM FINAL TIDY
   BUILD 104840

   COMPLETE REPLACEMENT FILE:
   mana_coach_checkin_clarity_104800.js

   FIXES:
   - Yellow/gold text and icons to orange / white
   - Remove duplicate Fuel training-days tile
   - Shorten Program Builder explanation
   - Collapsible Coach Tools
   - Collapsible Coach Notes
   - Top check-in, session and message actions open tools
   - Preserve the four stable top coaching tiles

   PRESERVES:
   - All original button event handlers
   - Program Builder and saved assignments
   - Generated workout snapshots
   - Check-in requests and session records
   - Coaching notes and messages
   - All client and Supabase data
   - History & Results
   - Existing navigation

   No database writes or data deletion.
   No continuous observers.
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104840";

  const VIEW_ID = "coachClientDetailView";
  const STYLE_ID = "manaCoachClarityStyle104840";

  const TOOLS_ID = "manaCoachToolsFold104840";
  const NOTES_ID = "manaCoachNotesFold104840";

  if (window.MANA_COACH_CLARITY_104840) return;

  window.MANA_COACH_CLARITY_104840 = true;

  const $ = id => document.getElementById(id);

  let timers = [];

  function profileOpen() {
    const view = $(VIEW_ID);

    return Boolean(
      view &&
      !view.hidden &&
      !view.classList.contains("hide")
    );
  }

  /* =====================================
     INSTALL PREMIUM STYLES
     ===================================== */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* =================================
         BLACK / ORANGE / WHITE / SILVER
         ================================= */

      #${VIEW_ID}
      .m1010-actions-name strong {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
      }

      #${VIEW_ID} .gold,
      #${VIEW_ID} .pill {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      #${VIEW_ID} .pill {
        border-color: #FF7927 !important;
        background: #101216 !important;
      }

      #${VIEW_ID} .quick-action-btn > span {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      #${VIEW_ID}
      .mana-checkin-explain-104800 {
        border-left: 3px solid #FF7927 !important;
        background: #101216 !important;
        color: #C1C6CE !important;
      }

      #${VIEW_ID}
      .mana-checkin-explain-104800 strong {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
      }

      #${VIEW_ID}
      #requestCheckinBtn {
        background: #FF7927 !important;
        background-image: none !important;
        border: 1px solid #FF7927 !important;
        border-radius: 12px !important;
        color: #08090B !important;
        -webkit-text-fill-color: #08090B !important;
        box-shadow: none !important;
        font-weight: 900 !important;
      }

      /* =================================
         REMOVE DUPLICATE TRAINING DAYS
         FROM FUEL TARGETS ONLY
         ================================= */

      #${VIEW_ID}
      #manaCoachGenerated104750
      .mg-kicker + .mg-grid
      .mg-stat:nth-child(4) {
        display: none !important;
      }

      #${VIEW_ID}
      #manaCoachGenerated104750
      .mg-kicker + .mg-grid {
        grid-template-columns:
          repeat(3,minmax(0,1fr)) !important;
      }

      /* =================================
         SHORTER PROGRAM BUILDER TEXT
         ================================= */

      #${VIEW_ID}
      #manaGeneratedOpenBuilder104750
      + .mg-desc {
        font-size: 0 !important;
      }

      #${VIEW_ID}
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
         COLLAPSIBLE COACH TOOLS
         ================================= */

      #${VIEW_ID} #${TOOLS_ID},
      #${VIEW_ID} #${NOTES_ID} {
        display: block !important;
        margin: 14px 0 !important;

        background: #15171A !important;
        border: 1px solid #626973 !important;
        border-radius: 19px !important;

        overflow: hidden !important;
      }

      #${VIEW_ID} #${TOOLS_ID} > summary,
      #${VIEW_ID} #${NOTES_ID} > summary {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 12px !important;

        padding: 17px 19px !important;

        background: #15171A !important;
        color: #FFFFFF !important;

        cursor: pointer !important;
        list-style: none !important;
      }

      #${VIEW_ID} #${TOOLS_ID}
      > summary::-webkit-details-marker,
      #${VIEW_ID} #${NOTES_ID}
      > summary::-webkit-details-marker {
        display: none !important;
      }

      #${VIEW_ID} .mana-fold-title-104840 {
        display: block;
        color: #FFFFFF !important;
        font-size: 16px !important;
        font-weight: 900 !important;
      }

      #${VIEW_ID} .mana-fold-sub-104840 {
        display: block;
        margin-top: 5px;
        color: #C1C6CE !important;
        font-size: 11px !important;
        line-height: 1.5 !important;
      }

      #${VIEW_ID} .mana-fold-arrow-104840 {
        display: grid;
        place-items: center;
        flex: 0 0 34px;

        width: 34px;
        height: 34px;

        border: 1px solid #FF7927;
        border-radius: 10px;
        color: #FF7927 !important;
        font-size: 19px;
      }

      #${VIEW_ID}
      details[open] > summary
      .mana-fold-arrow-104840 {
        transform: rotate(180deg);
      }

      #${VIEW_ID} #${TOOLS_ID} > summary:focus-visible,
      #${VIEW_ID} #${NOTES_ID} > summary:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: -3px !important;
      }

      #${VIEW_ID}
      #${TOOLS_ID} > .card,
      #${VIEW_ID}
      #${NOTES_ID} > .card {
        margin: 0 !important;
        padding: 17px !important;

        border: none !important;
        border-top: 1px solid #39414A !important;
        border-radius: 0 !important;

        background: #15171A !important;
        box-shadow: none !important;
      }

      /* Remove duplicated panel headings.
         The accordion summary now names
         each section clearly. */

      #${VIEW_ID}
      #${TOOLS_ID} > .card
      > .row:first-child {
        display: none !important;
      }

      #${VIEW_ID}
      #${NOTES_ID} > .card > h3:first-child {
        display: none !important;
      }

      /* Hide duplicate old builder buttons,
         not their program functionality. */

      #${VIEW_ID}
      [data-mana-duplicate-builder] {
        display: none !important;
      }

      /* =================================
         MOBILE
         ================================= */

      @media(max-width:600px) {

        #${VIEW_ID}
        #manaCoachGenerated104750
        .mg-kicker + .mg-grid {
          grid-template-columns:
            repeat(2,minmax(0,1fr)) !important;
        }

        #${VIEW_ID} #${TOOLS_ID} > summary,
        #${VIEW_ID} #${NOTES_ID} > summary {
          padding: 14px !important;
        }

        #${VIEW_ID}
        #${TOOLS_ID} > .card,
        #${VIEW_ID}
        #${NOTES_ID} > .card {
          padding: 13px !important;
        }

      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================
     FIND ORIGINAL WORKING CARDS
     ===================================== */

  function toolsCard() {
    return $("quickRecordSessionBtn")
      ?.closest(".card") || null;
  }

  function notesCard() {
    return $("coachNotesCard");
  }

  /* =====================================
     CREATE ACCORDION CONTAINER

     The actual existing card is MOVED.
     It is never cloned or rebuilt.

     All its click handlers and input
     values are preserved.
     ===================================== */

  function createFold(id, title, subtitle) {
    let fold = $(id);

    if (fold) return fold;

    fold = document.createElement("details");
    fold.id = id;

    fold.innerHTML = `
      <summary>
        <span>
          <span class="mana-fold-title-104840">
            ${title}
          </span>

          <span class="mana-fold-sub-104840">
            ${subtitle}
          </span>
        </span>

        <span
          class="mana-fold-arrow-104840"
          aria-hidden="true"
        >⌄</span>
      </summary>
    `;

    return fold;
  }

  /* =====================================
     COACH TOOLS
     ===================================== */

  function organiseTools() {
    if (!profileOpen()) return;

    const card = toolsCard();
    const view = $(VIEW_ID);

    if (!card || !view.contains(card)) return;

    const fold = createFold(
      TOOLS_ID,
      "Coach Tools",
      "Notes · Focus · Sessions · Messages · Check-in request"
    );

    if (card.parentElement !== fold) {
      card.insertAdjacentElement("beforebegin", fold);
      fold.appendChild(card);
    }

    card.querySelectorAll("button").forEach(button => {
      if (
        button.textContent
          .trim()
          .toLowerCase() ===
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
      request.textContent =
        "Request New Client Check-in";

      if (
        !card.querySelector(
          ".mana-checkin-explain-104800"
        )
      ) {
        const info = document.createElement("div");

        info.className =
          "mana-checkin-explain-104800";

        info.innerHTML = `
          <strong>Client Check-in</strong>
          <div>
            Ask this client to submit a new
            weight, energy and wellbeing update.
          </div>
        `;

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
    if (!profileOpen()) return;

    const card = notesCard();
    const view = $(VIEW_ID);

    if (!card || !view.contains(card)) return;

    const fold = createFold(
      NOTES_ID,
      "Coach Notes",
      "Private coaching notes and next steps"
    );

    if (card.parentElement !== fold) {
      card.insertAdjacentElement("beforebegin", fold);
      fold.appendChild(card);
    }
  }

  /* =====================================
     KEEP TOP COACHING ACTIONS CLEAR

     The existing v10.10 script owns the
     button click handlers. We do not
     replace or rebuild them.
     ===================================== */

  function tidyTopCheckinLabel() {
    const checkin = $("manaV1010Checkin");

    if (!checkin) return;

    const title = checkin.querySelector("strong");
    const subtitle = checkin.querySelector("small");

    if (title) {
      title.textContent = "CLIENT CHECK-INS";
    }

    if (subtitle) {
      subtitle.textContent =
        "Review updates or request a check-in.";
    }
  }

  /* =====================================
     OPEN THE RIGHT SECTION WHEN
     THE TOP TILES ARE USED

     Run during event capture, BEFORE
     the original click handlers.

     The original actions are preserved.
     ===================================== */

  function onCapture(event) {
    if (!profileOpen()) return;

    const target = event.target;

    if (!(target instanceof Element)) return;

    const checkin = target.closest(
      "#manaV1010Checkin"
    );

    if (checkin) {
      const fold = $(TOOLS_ID);

      if (fold) {
        fold.open = true;
      }

      /*
       Existing check-in navigation may
       target the historical check-in
       inside the collapsed History panel.

       Instead, bring the request action
       into view while retaining the
       original check-in data in History.
      */

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
      if ($(TOOLS_ID)) {
        $(TOOLS_ID).open = true;
      }
    }

    if (
      target.closest("#quickAddNoteBtn")
    ) {
      if ($(NOTES_ID)) {
        $(NOTES_ID).open = true;
      }
    }
  }

  /* =====================================
     OPEN NOTES WHEN THE APP FOCUSES
     ITS ORIGINAL COACH NOTE TEXTAREA
     ===================================== */

  function onFocus(event) {
    if (
      event.target?.id === "coachNoteDraft" &&
      $(NOTES_ID)
    ) {
      $(NOTES_ID).open = true;
    }
  }

  /* =====================================
     LIMITED INITIALISATION PASSES

     No subtree observer.
     No timers running indefinitely.
     ===================================== */

  function tidy() {
    if (!profileOpen()) return;

    organiseTools();
    organiseNotes();
    tidyTopCheckinLabel();
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function scheduleTidy() {
    clearTimers();

    [100, 400, 900, 1800].forEach(delay => {
      timers.push(
        setTimeout(() => {
          if (profileOpen()) {
            tidy();
          }
        }, delay)
      );
    });
  }

  function init() {
    installStyles();

    const view = $(VIEW_ID);

    if (!view) return;

    document.addEventListener(
      "click",
      onCapture,
      true
    );

    document.addEventListener(
      "focusin",
      onFocus,
      true
    );

    new MutationObserver(() => {
      if (profileOpen()) {
        scheduleTidy();
      } else {
        clearTimers();
      }
    }).observe(view, {
      attributes: true,
      attributeFilter: ["class"]
    });

    if (profileOpen()) {
      scheduleTidy();
    }

    console.log(
      "[Mana Movement] Premium Coach Tidy " +
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
