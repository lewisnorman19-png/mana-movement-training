
/* ============================================================
   MANA MOVEMENT TRAINING
   COACH HUB — PREMIUM PROFILE TIDY
   BUILD 104960

   Clean / Premium / Smart / Clear

   IMPROVEMENTS
   - Compact client information cards
   - Consistent typography and spacing
   - Formatted date of birth
   - Collapsible progress photography
   - Smaller photo previews
   - Premium coaching chat presentation
   - Compact Assigned Programs
   - Better Coach Summary
   - Program Upgrade Request repositioning
   - Responsive mobile layout

   SAFETY
   - No Supabase writes
   - No changes to authentication
   - No replacement of View Client
   - No changes to messaging
   - No changes to Program Builder
   - No continuous MutationObserver
   - No continuous polling
   - Existing client records remain intact
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104960";

  if (window.MANA_COACH_TIDY_104960) return;
  window.MANA_COACH_TIDY_104960 = true;

  const VIEW = "coachClientDetailView";
  const PROFILE = "manaCoachProfile104950";
  const PHOTOS = "manaCoachPhotoFold104960";
  const REQUESTS = "manaCoachRequests104960";
  const STYLE = "manaCoachTidyStyle104960";

  const $ = id => document.getElementById(id);

  let timers = [];

  function visible() {
    const view = $(VIEW);

    return !!(
      view &&
      !view.hidden &&
      !view.classList.contains("hide")
    );
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  /* ============================================================
     PREMIUM STYLES
     ============================================================ */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* MAIN CLIENT PROFILE */

      #${VIEW} {
        color: #FFFFFF;
      }

      #${VIEW} #${PROFILE} {
        background: #15171B !important;
        border: 1px solid #535B65 !important;
        border-radius: 18px !important;
        padding: 18px !important;
        margin: 12px 0 !important;
        box-shadow: none !important;
      }

      #${PROFILE} * {
        box-sizing: border-box;
      }

      #${PROFILE} .mcp-kicker {
        color: #FF7927 !important;
        font-size: 10px !important;
        font-weight: 900 !important;
        letter-spacing: .12em !important;
      }

      #${PROFILE} > h3 {
        margin: 5px 0 12px !important;
        font-size: 19px !important;
        color: white !important;
      }

      /* CONTACT / TRAINING INFORMATION */

      #${PROFILE} .mcp-grid {
        display: grid !important;
        grid-template-columns:
          repeat(2, minmax(0,1fr)) !important;
        gap: 9px !important;
        align-items: stretch !important;
      }

      #${PROFILE} .mcp-detail {
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        gap: 5px !important;
        background: #101215 !important;
        border: 1px solid #434B55 !important;
        border-radius: 11px !important;
        padding: 11px 13px !important;
        min-height: 59px !important;
        height: auto !important;
        margin: 0 !important;
      }

      #${PROFILE} .mcp-detail small {
        color: #ADB5C0 !important;
        font-size: 11px !important;
        line-height: 1.35 !important;
        margin: 0 !important;
        text-align: left !important;
      }

      #${PROFILE} .mcp-detail strong {
        color: #FFFFFF !important;
        font-size: 13px !important;
        font-weight: 750 !important;
        line-height: 1.45 !important;
        margin: 0 !important;
        padding: 0 !important;
        text-align: left !important;
        overflow-wrap: anywhere !important;
      }

      #${PROFILE} .mcp-note {
        color: #B7BFCA !important;
        line-height: 1.5 !important;
        font-size: 12px !important;
      }

      #${PROFILE} .mcp-divider {
        margin: 14px 0 !important;
      }

      /* COLLAPSIBLE PHOTO SECTION */

      #${PHOTOS} {
        margin-top: 15px;
        background: #111317;
        border: 1px solid #4A515C;
        border-radius: 13px;
        overflow: hidden;
      }

      #${PHOTOS} > summary {
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px;
        gap: 12px;
        cursor: pointer;
        color: #FFFFFF;
        font-size: 15px;
        font-weight: 850;
      }

      #${PHOTOS} > summary::-webkit-details-marker {
        display: none;
      }

      #${PHOTOS} > summary:focus-visible {
        outline: 2px solid #FF7927;
        outline-offset: -3px;
      }

      #${PHOTOS} .mct-photo-subtitle {
        display: block;
        color: #AEB6C0;
        font-size: 11px;
        font-weight: 500;
        margin-top: 4px;
      }

      #${PHOTOS} .mct-arrow {
        border: 1px solid #FF7927;
        color: #FF7927;
        border-radius: 9px;
        width: 34px;
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        font-size: 21px;
      }

      #${PHOTOS}[open] .mct-arrow {
        transform: rotate(180deg);
      }

      #${PHOTOS} .mct-photo-content {
        padding: 0 13px 15px;
      }

      #${PHOTOS} .mct-photo-content h3 {
        margin: 12px 0 !important;
        font-size: 16px !important;
        color: #FFFFFF !important;
      }

      /* SMALLER PROGRESS PHOTO CARDS */

      #${PROFILE} .mcp-photos {
        display: grid !important;
        grid-template-columns:
          repeat(3,minmax(0,1fr)) !important;
        gap: 9px !important;
        align-items: start !important;
      }

      #${PROFILE} .mcp-photo {
        background: #0E1013 !important;
        border: 1px solid #414954 !important;
        border-radius: 11px !important;
        padding: 8px !important;
        min-width: 0 !important;
        text-align: left !important;
      }

      #${PROFILE} .mcp-photo img,
      #${PROFILE} .mcp-empty-photo {
        width: 100% !important;
        max-width: 175px !important;
        aspect-ratio: 3 / 4 !important;
        max-height: 225px !important;
        object-fit: cover !important;
        border-radius: 8px !important;
        margin: 0 auto 8px !important;
      }

      #${PROFILE} .mcp-empty-photo {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border: 1px dashed #56606B !important;
        background: #15181C !important;
        color: #9FA9B4 !important;
        font-size: 11px !important;
      }

      #${PROFILE} .mcp-photo strong {
        color: white !important;
        font-size: 12px !important;
      }

      #${PROFILE} .mcp-photo small {
        color: #AAB3BE !important;
        font-size: 10px !important;
      }

      /* COACHING ACTION CARDS */

      #${VIEW} #manaV1010ClientActions {
        margin: 10px 0 !important;
      }

      #${VIEW} #manaV1010ClientActions
      .m1010-action {
        background: #1A1D22 !important;
        border: 1px solid #505965 !important;
        border-radius: 13px !important;
        box-shadow: none !important;
        transition: border-color .15s ease !important;
      }

      #${VIEW} #manaV1010ClientActions
      .m1010-action:hover {
        border-color: #FF7927 !important;
      }

      /* ASSIGNED PROGRAMS */

      #${VIEW} #manaCoachAssignments104720 {
        padding: 16px !important;
        border-radius: 17px !important;
        margin: 12px 0 !important;
      }

      #${VIEW} #manaCoachAssignments104720
      .mca-row {
        padding: 10px 12px !important;
        border-radius: 11px !important;
      }

      #${VIEW} #manaCoachAssignments104720
      .mca-help {
        margin: 6px 0 12px !important;
      }

      #${VIEW} #manaCoachAssignments104720
      button {
        border-radius: 10px !important;
      }

      /* OLD COACH CHAT CARD */

      #${VIEW} .mct-chat-card {
        background: #15171B !important;
        border: 1px solid #535B65 !important;
        border-radius: 16px !important;
        padding: 15px !important;
      }

      #${VIEW} .mct-chat-card button {
        background: #15171B !important;
        color: #FF7927 !important;
        border: 1px solid #FF7927 !important;
        border-radius: 10px !important;
        padding: 11px 15px !important;
        font-family: inherit !important;
        font-size: 12px !important;
        font-weight: 850 !important;
        cursor: pointer !important;
      }

      /* COACH SUMMARY */

      #${VIEW} #manaV998ClientSummary {
        margin: 12px 0 !important;
        padding: 15px !important;
        border-radius: 16px !important;
      }

      #${VIEW} #manaV998ClientSummary
      .mana-v998-summary-item {
        padding: 12px !important;
      }

      /* PROGRAM UPGRADE REQUEST */

      #${REQUESTS} {
        margin: 12px 0 !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }

      #${REQUESTS} > * {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        margin: 0 !important;
      }

      /* HISTORY AND COACH TOOLS */

      #${VIEW} #manaCoachHistory104790,
      #${VIEW} #manaCoachToolsFold104840,
      #${VIEW} #manaCoachNotesFold104840 {
        margin: 12px 0 !important;
        border-radius: 16px !important;
      }

      /* MOBILE */

      @media(max-width:600px) {

        #${VIEW} #${PROFILE} {
          padding: 13px !important;
        }

        #${PROFILE} .mcp-grid {
          grid-template-columns: 1fr !important;
          gap: 7px !important;
        }

        #${PROFILE} .mcp-detail {
          min-height: 53px !important;
          padding: 10px 12px !important;
        }

        #${PROFILE} .mcp-photos {
          gap: 5px !important;
        }

        #${PROFILE} .mcp-photo {
          padding: 5px !important;
        }

        #${PROFILE} .mcp-photo img,
        #${PROFILE} .mcp-empty-photo {
          max-height: 175px !important;
        }

        #${PHOTOS} > summary {
          padding: 12px !important;
        }

        #${VIEW} #manaCoachAssignments104720 {
          padding: 13px !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     DATE FORMAT
     DISPLAY ONLY — ORIGINAL RECORD IS UNCHANGED
     ============================================================ */

  function formatDates() {
    const panel = $(PROFILE);

    if (!panel) return;

    const fields = panel.querySelectorAll(
      ".mcp-detail"
    );

    fields.forEach(field => {
      const label = field.querySelector("small");
      const value = field.querySelector("strong");

      if (!label || !value) return;

      if (
        label.textContent.trim().toLowerCase() !==
        "date of birth"
      ) {
        return;
      }

      if (value.dataset.mctDateFormatted === "1") {
        return;
      }

      const raw = value.textContent.trim();

      if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
        return;
      }

      const [year, month, day] =
        raw.split("-").map(Number);

      const date = new Date(
        Date.UTC(year, month - 1, day)
      );

      if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
      ) {
        return;
      }

      value.textContent =
        new Intl.DateTimeFormat(
          "en-AU",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "UTC"
          }
        ).format(date);

      value.dataset.mctDateFormatted = "1";
    });
  }

  /* ============================================================
     COLLAPSIBLE PROGRESS PHOTO SECTION

     Move existing elements rather than
     recreating images or Supabase data.
     ============================================================ */

  function organisePhotos() {
    const panel = $(PROFILE);

    if (!panel) return;

    if ($(PHOTOS)) return;

    const baseline = $("mcpBaseline104950");
    const history = $("mcpHistory104950");

    if (!baseline || !history) return;

    if (
      !panel.contains(baseline) ||
      !panel.contains(history)
    ) {
      return;
    }

    const fold = document.createElement("details");

    fold.id = PHOTOS;

    fold.innerHTML = `
      <summary>
        <span>
          Starting &amp; Progress Photos

          <span class="mct-photo-subtitle">
            Front · Side · Back · Check-ins
          </span>
        </span>

        <span class="mct-arrow" aria-hidden="true">
          ⌄
        </span>
      </summary>

      <div
        class="mct-photo-content"
        id="mctPhotoContent104960"
      ></div>
    `;

    const content = fold.querySelector(
      ".mct-photo-content"
    );

    const startingHeading =
      baseline.previousElementSibling;

    if (
      startingHeading &&
      startingHeading.matches("h3")
    ) {
      startingHeading.before(fold);
      content.appendChild(startingHeading);
    } else {
      baseline.before(fold);
    }

    content.appendChild(baseline);

    const divider = history.parentElement
      ?.querySelector(".mcp-divider");

    /*
     Find the Progress Photos heading
     directly associated with the history
     grid, without touching other headings.
    */

    const progressHeading =
      history.previousElementSibling;

    if (
      progressHeading &&
      progressHeading.matches("h3")
    ) {
      content.appendChild(progressHeading);
    }

    content.appendChild(history);

    const note = Array.from(
      panel.querySelectorAll(".mcp-note")
    ).find(element =>
      /private progress photographs/i.test(
        element.textContent || ""
      )
    );

    if (note) {
      content.appendChild(note);
    }

    /*
     Remove only the decorative divider
     directly preceding the new fold.
     Leave unrelated profile sections intact.
    */

    const previous = fold.previousElementSibling;

    if (
      previous &&
      previous.classList.contains("mcp-divider")
    ) {
      previous.remove();
    }

    /*
     Remove the old Body Transformation
     label if it's immediately above the fold.
    */

    const kicker = fold.previousElementSibling;

    if (
      kicker &&
      kicker.classList.contains("mcp-kicker") &&
      /body transformation/i.test(
        kicker.textContent || ""
      )
    ) {
      kicker.remove();
    }
  }

  /* ============================================================
     IDENTIFY EXISTING COACH CHAT

     Styling only. The original chat button
     and its event handlers remain untouched.
     ============================================================ */

  function tidyChat() {
    const view = $(VIEW);

    if (!view) return;

    const buttons = Array.from(
      view.querySelectorAll("button")
    );

    const chatButton = buttons.find(button =>
      /open client chat/i.test(
        button.textContent || ""
      )
    );

    if (!chatButton) return;

    const card = chatButton.closest(
      ".card, section, article"
    );

    if (
      !card ||
      card === view ||
      card.contains($(PROFILE))
    ) {
      return;
    }

    card.classList.add("mct-chat-card");
  }

  /* ============================================================
     PROGRAM REQUEST PLACEMENT

     Match the current client's name.
     Move the existing request card only.
     Do not recreate its action buttons.
     ============================================================ */

  function moveRequest() {
    const view = $(VIEW);

    if (!view || !visible()) return;

    const name = $("detailClientName")
      ?.textContent
      ?.trim();

    if (!name) return;

    const assignments = $(
      "manaCoachAssignments104720"
    );

    if (!assignments) return;

    const currentName = name.toLowerCase();

    const candidates = Array.from(
      document.querySelectorAll(
        "section,article,.card,[class*='request']"
      )
    );

    const matching = candidates.filter(node => {
      if (
        node === view ||
        node.id === PROFILE ||
        node.id === REQUESTS ||
        node.closest("#" + REQUESTS)
      ) {
        return false;
      }

      const text = node.textContent || "";

      if (
        !/program upgrade request/i.test(text) ||
        !/mark next block ready/i.test(text)
      ) {
        return false;
      }

      if (
        !text.toLowerCase().includes(currentName)
      ) {
        return false;
      }

      return node.querySelectorAll("button").length >= 3;
    });

    if (!matching.length) return;

    /*
     Choose the smallest matching container
     so we never move the entire Coach Hub.
    */

    matching.sort(
      (a, b) =>
        a.querySelectorAll("*").length -
        b.querySelectorAll("*").length
    );

    const card = matching[0];

    if (
      card.contains(view) ||
      card.contains(assignments)
    ) {
      return;
    }

    let target = $(REQUESTS);

    if (!target) {
      target = document.createElement("section");

      target.id = REQUESTS;

      target.setAttribute(
        "aria-label",
        "Program upgrade request"
      );
    }

    if (!view.contains(target)) {
      assignments.insertAdjacentElement(
        "afterend",
        target
      );
    }

    if (card.parentElement !== target) {
      target.appendChild(card);
    }

    /*
     Preserve the exact same request
     buttons, IDs and event listeners.
    */

  }

  /* ============================================================
     APPLY VISUAL TIDY

     Never call the original client-opening
     function or touch authentication.
     ============================================================ */

  function tidy() {
    if (!visible()) return;

    installStyles();

    formatDates();
    organisePhotos();
    tidyChat();
    moveRequest();
  }

  /* ============================================================
     LIMITED REFRESH PASSES

     Existing scripts load sections at
     slightly different times.

     No permanent observer or interval.
     ============================================================ */

  function scheduleTidy() {
    clearTimers();

    [100, 350, 800, 1600].forEach(delay => {
      timers.push(
        setTimeout(tidy, delay)
      );
    });
  }

  function init() {
    installStyles();

    /*
     Listen only for client opening.
     Do not cancel the click.
     Do not stop propagation.
     Do not call openCoachClientDetail.
    */

    document.addEventListener(
      "click",
      event => {
        const button = event.target.closest?.(
          ".client-open[data-client-id]"
        );

        if (button) {
          scheduleTidy();
        }
      }
    );

    /*
     Initial pass if the Coach Hub
     already has a client open.
    */

    if (visible()) {
      scheduleTidy();
    }

    window.MANA_COACH_TIDY_BUILD = BUILD;

    console.log(
      "[Mana Movement] Premium Coach Tidy " +
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
