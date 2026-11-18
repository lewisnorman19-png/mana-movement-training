
/* ============================================================
   MANA MOVEMENT TRAINING
   COACH HUB — PREMIUM FINAL POLISH
   BUILD 105000

   COMPLETE JAVASCRIPT FILE

   DESIGN
   - Black / charcoal backgrounds
   - Orange #FF7927
   - White headings
   - Silver secondary text
   - Consistent borders and spacing
   - Compact cards
   - Responsive laptop and mobile layouts

   UPGRADES
   1. Client Profile
   2. Coach Chat
   3. Coaching Actions
   4. Assigned Programs
   5. Program Upgrade Requests
   6. Coach Summary
   7. Coach Tools
   8. Coach Notes
   9. History and Results

   SAFETY
   - No Supabase writes
   - No DOM element replacements
   - No navigation overrides
   - No new button click handlers
   - No timer or program changes
   - No client data manipulation
   - Preserves original chat functionality
   - Preserves existing View Client behaviour
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "105000";
  const FLAG = "MANA_COACH_PREMIUM_105000";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const VIEW = "coachClientDetailView";
  const STYLE = "manaCoachPremiumStyle105000";
  const CHAT_CLASS = "mana-coach-chat-105000";

  const $ = id => document.getElementById(id);

  let observer = null;
  let observedView = null;
  let refreshPending = false;

  /* ============================================================
     CLIENT SCREEN DETECTION
     ============================================================ */

  function detailOpen() {
    const view = $(VIEW);

    if (!view) return false;

    return (
      !view.hidden &&
      !view.classList.contains("hide")
    );
  }

  /* ============================================================
     PREMIUM STYLES
     ============================================================ */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* ======================================
         COACH HUB FOUNDATION
         ====================================== */

      #${VIEW} {
        --mana-coach-orange: #FF7927;
        --mana-coach-bg: #15171B;
        --mana-coach-inner: #101215;
        --mana-coach-border: #4C5560;
        --mana-coach-silver: #B7C0CB;

        width: 100%;
        max-width: 1000px;
        margin-left: auto;
        margin-right: auto;
        padding-bottom: 120px;

        color: #FFFFFF;
        box-sizing: border-box;
      }

      #${VIEW},
      #${VIEW} * {
        box-sizing: border-box;
      }

      #${VIEW} button,
      #${VIEW} input,
      #${VIEW} select,
      #${VIEW} textarea {
        font-family: inherit;
      }

      /* ======================================
         CLIENT PROFILE
         ====================================== */

      #${VIEW} #manaCoachProfile104950 {
        background: #15171B !important;
        border: 1px solid #4C5560 !important;
        border-radius: 17px !important;
        padding: 16px !important;
        margin: 12px 0 !important;
        box-shadow: none !important;
      }

      #${VIEW} #manaCoachProfile104950
      .mana-profile-name {
        color: #FFFFFF !important;
        font-size: 22px !important;
        font-weight: 900 !important;
        line-height: 1.3 !important;
        margin: 7px 0 11px !important;
      }

      #${VIEW} #manaCoachProfile104950
      .mana-profile-kicker {
        color: #FF7927 !important;
        font-size: 10px !important;
        font-weight: 900 !important;
        letter-spacing: .1em !important;
      }

      #${VIEW} #manaCoachProfile104950
      .mana-profile-group {
        margin-top: 15px !important;
        padding-top: 14px !important;
        border-top: 1px solid #383F49 !important;
      }

      #${VIEW} #manaCoachProfile104950
      .mana-profile-group h3 {
        color: #FF7927 !important;
        font-size: 12px !important;
        font-weight: 900 !important;
        letter-spacing: .07em !important;
        text-transform: uppercase !important;
        margin: 0 0 11px !important;
      }

      #${VIEW} #manaCoachProfile104950
      .mana-profile-grid {
        display: grid !important;
        grid-template-columns:
          repeat(2,minmax(0,1fr)) !important;
        align-items: stretch !important;
        gap: 8px !important;
        width: 100% !important;
      }

      #${VIEW} #manaCoachProfile104950
      .mana-profile-cell {
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: flex-start !important;

        min-width: 0 !important;
        min-height: 0 !important;
        height: auto !important;

        padding: 10px 12px !important;

        background: #101215 !important;
        border: 1px solid #414954 !important;
        border-radius: 10px !important;

        box-shadow: none !important;
        gap: 4px !important;
      }

      #${VIEW} #manaCoachProfile104950
      .mana-profile-cell small {
        color: #AEB8C4 !important;
        font-size: 10px !important;
        line-height: 1.3 !important;
        text-align: left !important;
        margin: 0 !important;
      }

      #${VIEW} #manaCoachProfile104950
      .mana-profile-cell strong {
        display: block !important;
        width: 100% !important;

        color: #FFFFFF !important;
        font-size: 13px !important;
        font-weight: 750 !important;
        line-height: 1.45 !important;

        text-align: left !important;
        overflow-wrap: anywhere !important;
        margin: 0 !important;
      }

      /* ======================================
         FUEL & NUTRITION
         ====================================== */

      #${VIEW} #manaCoachProfile104950
      .mana-premium-fuel-grid {
        display: grid !important;
        grid-template-columns:
          repeat(2,minmax(0,1fr)) !important;
        gap: 8px !important;
        width: 100% !important;
      }

      #${VIEW} #manaCoachProfile104950
      .mana-premium-fuel-item {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        justify-content: center !important;

        min-width: 0 !important;
        min-height: 0 !important;
        height: auto !important;

        gap: 5px !important;
        padding: 11px 12px !important;

        background: #101215 !important;
        border: 1px solid #414954 !important;
        border-radius: 10px !important;
      }

      #${VIEW} #manaCoachProfile104950
      .mana-premium-fuel-item small {
        color: #B7C0CB !important;
        font-size: 10px !important;
        font-weight: 650 !important;
      }

      #${VIEW} #manaCoachProfile104950
      .mana-premium-fuel-item strong {
        color: #FF7927 !important;
        font-size: 18px !important;
        font-weight: 900 !important;
        line-height: 1.25 !important;
        overflow-wrap: anywhere !important;
      }

      #${VIEW} #manaCoachProfile104950
      .mana-premium-fuel-item span {
        color: #AEB8C4 !important;
        font-size: 10px !important;
        line-height: 1.4 !important;
      }

      /* ======================================
         STARTING & PROGRESS PHOTOS
         ====================================== */

      #${VIEW} #manaCoachProfile104950
      .mana-photo-fold {
        background: #101215 !important;
        border: 1px solid #454D57 !important;
        border-radius: 12px !important;
        margin-top: 15px !important;
        overflow: hidden !important;
      }

      #${VIEW} #manaCoachProfile104950
      .mana-photo-fold > summary {
        color: #FFFFFF !important;
        font-size: 14px !important;
        font-weight: 850 !important;
        padding: 13px !important;
        cursor: pointer !important;
      }

      #${VIEW} #manaCoachProfile104950
      .mana-photo-grid {
        display: grid !important;
        grid-template-columns:
          repeat(3,minmax(0,1fr)) !important;
        gap: 8px !important;
      }

      #${VIEW} #manaCoachProfile104950
      .mana-photo-card {
        min-width: 0 !important;
        background: #101215 !important;
        border: 1px solid #414954 !important;
        border-radius: 10px !important;
        padding: 8px !important;
      }

      #${VIEW} #manaCoachProfile104950
      .mana-photo-card img {
        width: 100% !important;
        max-height: 175px !important;
        object-fit: cover !important;
        border-radius: 8px !important;
      }

      /* ======================================
         COACH CHAT
         ====================================== */

      #${VIEW} .${CHAT_CLASS} {
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;

        gap: 10px !important;
        padding: 17px !important;

        background: #15171B !important;
        background-image: none !important;

        border: 1px solid #4C5560 !important;
        border-radius: 17px !important;

        margin: 12px 0 !important;
        box-shadow: none !important;
      }

      #${VIEW} .${CHAT_CLASS} h2,
      #${VIEW} .${CHAT_CLASS} h3,
      #${VIEW} .${CHAT_CLASS} h4 {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;

        font-size: 18px !important;
        font-weight: 900 !important;
        line-height: 1.3 !important;

        margin: 0 0 5px !important;
      }

      #${VIEW} .${CHAT_CLASS} p,
      #${VIEW} .${CHAT_CLASS} small {
        color: #B7C0CB !important;
        -webkit-text-fill-color: #B7C0CB !important;
        font-size: 12px !important;
        line-height: 1.55 !important;
      }

      #${VIEW} .${CHAT_CLASS} button {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;

        width: fit-content !important;
        max-width: 100% !important;
        min-height: 44px !important;

        padding: 11px 17px !important;

        background: #191C20 !important;
        background-image: none !important;

        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;

        border: 1px solid #FF7927 !important;
        border-radius: 11px !important;

        font-size: 12px !important;
        font-weight: 900 !important;
        letter-spacing: .03em !important;

        box-shadow: none !important;
        cursor: pointer !important;
      }

      #${VIEW} .${CHAT_CLASS} button:hover {
        background: #291910 !important;
      }

      /* ======================================
         COACHING ACTIONS
         ====================================== */

      #${VIEW} #manaV1010ClientActions {
        background: #15171B !important;
        border: 1px solid #4C5560 !important;
        border-radius: 17px !important;
        padding: 16px !important;
        margin: 12px 0 !important;
        box-shadow: none !important;
      }

      #${VIEW} #manaV1010ClientActions
      .m1010-action {
        min-width: 0 !important;
        min-height: 85px !important;

        background: #191C20 !important;
        background-image: none !important;

        border: 1px solid #4C5560 !important;
        border-radius: 13px !important;

        padding: 13px !important;
        box-shadow: none !important;
      }

      #${VIEW} #manaV1010ClientActions
      .m1010-action:hover {
        border-color: #FF7927 !important;
      }

      #${VIEW} #manaV1010ClientActions
      .m1010-action strong {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
      }

      #${VIEW} #manaV1010ClientActions
      .m1010-actions-kicker {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      /* ======================================
         ASSIGNED PROGRAMS
         ====================================== */

      #${VIEW} #manaCoachAssignments104720 {
        background: #15171B !important;
        border: 1px solid #4C5560 !important;
        border-radius: 17px !important;

        padding: 16px !important;
        margin: 12px 0 !important;

        box-shadow: none !important;
      }

      #${VIEW} #manaCoachAssignments104720 h3 {
        color: #FFFFFF !important;
        font-size: 18px !important;
        font-weight: 900 !important;
      }

      #${VIEW} #manaCoachAssignments104720
      .mca-kicker {
        color: #FF7927 !important;
        font-size: 10px !important;
        letter-spacing: .1em !important;
        font-weight: 900 !important;
      }

      #${VIEW} #manaCoachAssignments104720
      .mca-row {
        background: #101215 !important;
        border: 1px solid #424A55 !important;
        border-radius: 11px !important;
        padding: 11px 12px !important;
        margin: 8px 0 !important;
      }

      #${VIEW} #manaCoachAssignments104720
      button {
        border-radius: 10px !important;
        font-weight: 800 !important;
      }

      /* ======================================
         PROGRAM BLOCK UPGRADE REQUEST
         ====================================== */

      #${VIEW} #manaV1017CoachRequest {
        background: #15171B !important;
        background-image: none !important;

        border: 1px solid #FF7927 !important;
        border-radius: 17px !important;

        padding: 16px !important;
        margin: 12px 0 !important;

        box-shadow: none !important;
      }

      #${VIEW} #manaV1017CoachRequest h3,
      #${VIEW} #manaV1017CoachRequest h4 {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
        font-weight: 900 !important;
      }

      #${VIEW} #manaV1017CoachRequest
      .m1017-pill,
      #${VIEW} #manaV1017CoachRequest
      .m1017-ready {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
        border-color: #FF7927 !important;
      }

      #${VIEW} #manaV1017CoachRequest
      .m1017-stat {
        background: #101215 !important;
        border: 1px solid #454D57 !important;
        border-radius: 11px !important;
      }

      #${VIEW} #manaV1017CoachRequest
      .m1017-stat strong {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      #${VIEW} #manaV1017CoachRequest button {
        border-radius: 10px !important;
        font-weight: 800 !important;
      }

      /* ======================================
         COACH SUMMARY
         ====================================== */

      #${VIEW} #manaV998ClientSummary {
        margin: 12px 0 !important;
        padding: 14px !important;
        border-radius: 16px !important;
      }

      #${VIEW} #manaV998ClientSummary
      .mana-v998-stat {
        background: #15171B !important;
        border: 1px solid #4C5560 !important;
        border-radius: 12px !important;

        padding: 13px !important;
        box-shadow: none !important;
      }

      #${VIEW} #manaV998ClientSummary
      .mana-v998-stat strong {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      /* ======================================
         COACH TOOLS, NOTES AND HISTORY
         ====================================== */

      #${VIEW} #manaCoachToolsFold104840,
      #${VIEW} #manaCoachNotesFold104840,
      #${VIEW} #manaCoachHistory104790 {
        background: #15171B !important;
        border: 1px solid #4C5560 !important;
        border-radius: 15px !important;

        margin: 11px 0 !important;
        box-shadow: none !important;
      }

      #${VIEW} #manaCoachToolsFold104840 > summary,
      #${VIEW} #manaCoachNotesFold104840 > summary,
      #${VIEW} #manaCoachHistory104790 > summary {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;

        padding: 14px !important;
        font-size: 14px !important;
        font-weight: 850 !important;

        cursor: pointer !important;
      }

      #${VIEW} #manaCoachToolsFold104840
      button,
      #${VIEW} #manaCoachNotesFold104840
      button,
      #${VIEW} #manaCoachHistory104790
      button {
        border-radius: 10px !important;
      }

      /* ======================================
         RESPONSIVE TABLET
         ====================================== */

      @media (min-width: 601px)
             and (max-width: 900px) {

        #${VIEW} {
          max-width: 100% !important;
          padding-left: 12px !important;
          padding-right: 12px !important;
        }

        #${VIEW} #manaCoachProfile104950,
        #${VIEW} #manaCoachAssignments104720,
        #${VIEW} #manaV1017CoachRequest {
          padding: 14px !important;
        }
      }

      /* ======================================
         MOBILE
         ====================================== */

      @media (max-width: 600px) {

        #${VIEW} {
          width: 100% !important;
          max-width: 100% !important;

          padding-left: 10px !important;
          padding-right: 10px !important;
        }

        #${VIEW} #manaCoachProfile104950,
        #${VIEW} #manaCoachAssignments104720,
        #${VIEW} #manaV1017CoachRequest,
        #${VIEW} #manaV1010ClientActions,
        #${VIEW} .${CHAT_CLASS} {
          padding: 12px !important;
          border-radius: 14px !important;
        }

        #${VIEW} #manaCoachProfile104950
        .mana-profile-grid,
        #${VIEW} #manaCoachProfile104950
        .mana-premium-fuel-grid {
          grid-template-columns:
            1fr !important;
          gap: 7px !important;
        }

        #${VIEW} #manaCoachProfile104950
        .mana-profile-cell,
        #${VIEW} #manaCoachProfile104950
        .mana-premium-fuel-item {
          padding: 9px 11px !important;
        }

        #${VIEW} #manaCoachProfile104950
        .mana-photo-grid {
          gap: 5px !important;
        }

        #${VIEW} #manaCoachProfile104950
        .mana-photo-card {
          padding: 5px !important;
        }

        #${VIEW} .${CHAT_CLASS} button {
          width: 100% !important;
        }

        #${VIEW} #manaV1017CoachRequest
        .m1017-stat {
          padding: 9px !important;
        }
      }

      /* ======================================
         ACCESSIBILITY
         ====================================== */

      #${VIEW} button:focus-visible,
      #${VIEW} summary:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: 2px !important;
      }

    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     IDENTIFY EXISTING COACH CHAT CARD

     No new chat elements are created.
     No button handlers are changed.

     Apply presentation class only to a
     safe existing container.
     ============================================================ */

  function identifyChat() {
    if (!detailOpen()) return;

    const view = $(VIEW);
    if (!view) return;

    const button = Array.from(
      view.querySelectorAll("button")
    ).find(element =>
      /open client chat/i.test(
        element.textContent || ""
      )
    );

    if (!button) return;

    const candidates = [];

    let current = button.parentElement;

    while (
      current &&
      current !== view
    ) {
      if (
        current.matches(
          ".card, section, article, .mana-premium-coach-chat"
        )
      ) {
        candidates.push(current);
      }

      current = current.parentElement;
    }

    /*
     Select the smallest existing chat
     container. Never select the Profile,
     Coach Detail or Assigned Programs.
    */

    const card = candidates.find(node => {
      if (
        node.id === "manaCoachProfile104950" ||
        node.id === "manaCoachAssignments104720" ||
        node.id === "manaV1017CoachRequest" ||
        node.id === "manaV1010ClientActions"
      ) {
        return false;
      }

      if (
        node.contains(
          $("manaCoachProfile104950")
        )
      ) {
        return false;
      }

      return true;
    });

    if (!card) return;

    card.classList.add(CHAT_CLASS);
  }

  /* ============================================================
     SAFE REFRESH

     Coach Hub creates some cards after
     opening a client.

     Apply styles and chat identification
     without rebuilding any existing card.
     ============================================================ */

  function refresh() {
    if (!detailOpen()) return;

    installStyles();
    identifyChat();
  }

  function scheduleRefresh() {
    if (refreshPending) return;

    refreshPending = true;

    requestAnimationFrame(() => {
      refreshPending = false;
      refresh();
    });
  }

  /* ============================================================
     OBSERVE CLIENT DETAIL DIRECT CHILDREN

     This allows a newly rendered Coach Chat
     card to receive its presentation class.

     No subtree observation.
     No data or navigation modifications.
     ============================================================ */

  function observeView() {
    const view = $(VIEW);

    if (!view || observedView === view) {
      return;
    }

    observer?.disconnect();

    observedView = view;

    observer = new MutationObserver(() => {
      scheduleRefresh();
    });

    observer.observe(view, {
      childList: true,
      subtree: false
    });
  }

  /* ============================================================
     INITIALISE
     ============================================================ */

  function init() {
    installStyles();
    observeView();
    refresh();

    /*
     The existing View Client function
     remains responsible for navigation.
    */

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            ".client-open[data-client-id]"
          )
        ) {
          [200, 550, 1100].forEach(delay => {
            setTimeout(() => {
              observeView();
              refresh();
            }, delay);
          });
        }
      }
    );

    window.addEventListener(
      "pageshow",
      () => {
        observeView();
        refresh();
      }
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) {
          observeView();
          refresh();
        }
      }
    );

    window.MANA_COACH_PREMIUM_BUILD = BUILD;

    console.log(
      "[Mana Movement] Coach Premium Finish " +
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
