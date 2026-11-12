
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH CHECK-IN CLARITY & DUPLICATE TIDY
   BUILD 104800

   COMPLETE NEW FILE:
   mana_coach_checkin_clarity_104800.js

   - Clarifies Client Check-ins
   - Clarifies Request New Check-in
   - Renames Quick Coach Actions
   - Removes duplicate Program Builder buttons
   - Changes old gold request button to orange
   - Keeps all original functions and client data

   Smart Back 104770 remains disabled.
   No database changes.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104800";
  const STYLE_ID = "manaCoachClarityStyle104800";
  const VIEW_ID = "coachClientDetailView";

  if (window.MANA_COACH_CLARITY_104800) return;
  window.MANA_COACH_CLARITY_104800 = true;

  const $ = id => document.getElementById(id);

  let timers = [];

  function viewOpen() {
    const view = $(VIEW_ID);
    return !!view &&
      !view.classList.contains("hide");
  }

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* Duplicate builder buttons */

      #${VIEW_ID} #manaV1004BuildForClient,
      #${VIEW_ID} [data-mana-duplicate-builder] {
        display: none !important;
      }

      /* Clearer check-in request button */

      #${VIEW_ID} #requestCheckinBtn {
        background: #FF7927 !important;
        background-image: none !important;

        border: 1px solid #FF7927 !important;
        border-radius: 12px !important;

        color: #090A0C !important;
        -webkit-text-fill-color: #090A0C !important;

        box-shadow: none !important;
        font-weight: 900 !important;
      }

      /* Coaching tools panel */

      #${VIEW_ID} .mana-coach-tools-104800 {
        border: 1px solid #626973 !important;
        border-radius: 19px !important;
        background: #15171A !important;
      }

      #${VIEW_ID} .mana-checkin-explain-104800 {
        margin: 12px 0 4px;
        padding: 12px 14px;

        background: #101216;
        border-left: 3px solid #FF7927;
        border-radius: 9px;

        color: #C1C6CE;
        font-size: 12px;
        line-height: 1.6;
      }

      #${VIEW_ID} .mana-checkin-explain-104800
      strong {
        color: #FFFFFF;
      }

      #${VIEW_ID} #requestCheckinStatus {
        color: #C1C6CE !important;
        font-size: 12px !important;
        line-height: 1.5 !important;
      }

    `;

    document.head.appendChild(style);
  }

  function findToolsCard() {
    return $("quickRecordSessionBtn")
      ?.closest(".card") || null;
  }

  function tidyTools() {
    if (!viewOpen()) return;

    const card = findToolsCard();

    if (!card) return;

    card.classList.add(
      "mana-coach-tools-104800"
    );

    const heading = card.querySelector("h3");

    if (heading &&
        heading.textContent.trim()
          .toLowerCase() === "quick coach actions") {
      heading.textContent = "Additional Coaching Tools";
    }

    const subtitle = heading
      ?.parentElement
      ?.querySelector("p");

    if (subtitle) {
      subtitle.textContent =
        "Record sessions, update coaching notes " +
        "and prepare messages.";
    }

    /* Hide redundant builder buttons.
       Preserve their original DOM nodes
       and event handlers. */

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

    const request = $("requestCheckinBtn");

    if (request) {
      request.textContent =
        "Request New Client Check-in";

      if (!card.querySelector(
        ".mana-checkin-explain-104800"
      )) {
        const explanation =
          document.createElement("div");

        explanation.className =
          "mana-checkin-explain-104800";

        explanation.innerHTML =
          "<strong>How check-ins work</strong>" +
          "<div>The client submits their own " +
          "weight, energy and wellbeing update. " +
          "Use this button to ask them to " +
          "complete another check-in.</div>";

        request.insertAdjacentElement(
          "beforebegin",
          explanation
        );
      }
    }
  }

  function tidyMainActions() {
    if (!viewOpen()) return;

    const checkin = $("manaV1010Checkin");

    if (!checkin) return;

    const title = checkin.querySelector("strong");
    const description = checkin.querySelector("small");

    if (title) {
      title.textContent = "CLIENT CHECK-INS";
    }

    if (description) {
      description.textContent =
        "Review submitted updates or request " +
        "a new client check-in.";
    }
  }

  function tidy() {
    tidyTools();
    tidyMainActions();
  }

  function scheduleTidy() {
    timers.forEach(clearTimeout);
    timers = [];

    [100, 400, 1000, 2000].forEach(delay => {
      timers.push(
        setTimeout(() => {
          if (viewOpen()) tidy();
        }, delay)
      );
    });
  }

  function init() {
    installStyles();

    const view = $(VIEW_ID);
    if (!view) return;

    /* Only observe when the profile opens.
       No subtree observation or infinite
       render loop. */

    new MutationObserver(() => {
      if (viewOpen()) {
        scheduleTidy();
      } else {
        timers.forEach(clearTimeout);
        timers = [];
      }
    }).observe(view, {
      attributes: true,
      attributeFilter: ["class"]
    });

    if (viewOpen()) {
      scheduleTidy();
    }

    console.log(
      "[Mana Movement] Coach clarity " + BUILD
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
