
/* ============================================================
   MANA MOVEMENT TRAINING
   COACH HUB — STABLE NAVIGATION & LIVE INBOX
   BUILD 105006

   COMPLETE REPLACEMENT:
   mana_coach_navigation_stability_105004.js

   FIXES
   - Live Coaching Inbox loads on first click
   - Chat never needs a second click
   - Restores Inbox after navigation
   - Prevents old Progress page opening
   - Keeps one active orange navigation tab
   - Clients highlighted in Client Detail
   - Existing client directory preserved

   PRESERVES
   - Supabase client records
   - Real messages and unread indicators
   - Existing conversation modal
   - Coach Profile and photographs
   - Program Builder and assignments
   - Block requests
   - History & Results
   - Existing mobile layout

   No database writes.
   No duplicate inbox.
   No fake conversations.
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "105006";
  const FLAG = "MANA_COACH_NAV_105006";
  const STYLE = "manaCoachNavStyle105006";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const NAV = "manaV97CoachNav";
  const HOME = "coachHomePage";
  const SUITE = "manaCoachSuite104707";
  const COACH = "coachView";
  const DETAIL = "coachClientDetailView";

  const $ = id => document.getElementById(id);

  const ROUTES = {
    home: "summary",
    fuel: "clients",
    progress: "chat",
    programs: "payments",
    profile: "settings"
  };

  let selected = "summary";
  let refreshQueued = false;
  let inboxQueued = false;
  let lastInboxRequest = 0;

  let navObserver = null;
  let viewObserver = null;
  let chatObserver = null;

  let watchedNav = null;
  let watchedCoach = null;
  let watchedDetail = null;
  let watchedChat = null;

  /* =====================================================
     VISIBILITY
     ===================================================== */

  function visible(element) {
    return Boolean(
      element &&
      !element.hidden &&
      !element.classList.contains("hide")
    );
  }

  function detailOpen() {
    return visible($(DETAIL));
  }

  function coachOpen() {
    return (
      visible($(COACH)) ||
      detailOpen()
    );
  }

  function routeFor(button) {
    if (!button) return "";

    return (
      ROUTES[button.dataset.coachPage] ||
      button.dataset.mcnTab ||
      ""
    );
  }

  function chatView() {
    return document.querySelector(
      "#" + SUITE + ' [data-mcn-view="chat"]'
    );
  }

  function chatVisible() {
    const section = chatView();

    return Boolean(
      visible($(COACH)) &&
      section &&
      !section.hidden &&
      section.getClientRects().length > 0
    );
  }

  /* =====================================================
     ORANGE NAVIGATION STYLING
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      #${NAV}.mana-nav-controlled-105006
      .mana-v970-tab {
        background: #15171A !important;
        background-image: none !important;
        border: 1px solid #414750 !important;
        border-radius: 13px !important;

        color: #C1C6CE !important;
        -webkit-text-fill-color: #C1C6CE !important;

        box-shadow: none !important;
      }

      #${NAV}.mana-nav-controlled-105006
      .mana-v970-tab
      .mana-v970-tab-icon,
      #${NAV}.mana-nav-controlled-105006
      .mana-v970-tab
      .mcn-tab-label {
        color: inherit !important;
        -webkit-text-fill-color:
          currentColor !important;
      }

      #${NAV}.mana-nav-controlled-105006
      .mana-v970-tab.mana-nav-selected-105006 {
        background: #321D12 !important;
        border: 1px solid #FF7927 !important;

        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;

        box-shadow: none !important;
      }

      #${NAV}.mana-nav-controlled-105006
      .mana-v970-tab.mana-nav-selected-105006
      .mana-v970-tab-icon,
      #${NAV}.mana-nav-controlled-105006
      .mana-v970-tab.mana-nav-selected-105006
      .mcn-tab-label {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      #${NAV} .mana-v970-tab:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: 2px !important;
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     ACTIVE TAB

     The existing navigation retains its
     buttons, labels and original structure.
     ===================================================== */

  function updateTabs() {
    const nav = $(NAV);

    if (!nav || !coachOpen()) return;

    nav.classList.add(
      "mana-nav-controlled-105006"
    );

    const active =
      detailOpen()
        ? "clients"
        : selected;

    nav.querySelectorAll(
      ".mana-v970-tab[data-coach-page]"
    ).forEach(button => {
      const chosen =
        routeFor(button) === active;

      button.classList.toggle(
        "mana-nav-selected-105006",
        chosen
      );

      button.classList.toggle(
        "active",
        chosen
      );

      if (chosen) {
        button.setAttribute(
          "aria-current",
          "page"
        );
      } else {
        button.removeAttribute(
          "aria-current"
        );
      }
    });
  }

  /* =====================================================
     EXISTING COACH HUB SECTIONS
     ===================================================== */

  function showSelected() {
    const suite = $(SUITE);
    const home = $(HOME);

    if (!suite || !home) return;

    suite.querySelectorAll(
      "[data-mcn-view]"
    ).forEach(section => {
      const shouldShow =
        section.dataset.mcnView === selected;

      if (section.hidden !== !shouldShow) {
        section.hidden = !shouldShow;
      }
    });

    home.classList.toggle(
      "mcn-summary-active",
      selected === "summary"
    );
  }

  /* =====================================================
     REAL COACHING INBOX

     Existing Mana Strength messaging
     module provides this function:

       window.refreshManaCoachInbox()

     This is the existing Supabase-backed
     inbox, not a replacement renderer.
     ===================================================== */

  function refreshRealInbox(force = false) {
    if (!chatVisible()) return;

    const now = Date.now();

    if (
      !force &&
      now - lastInboxRequest < 1200
    ) {
      return;
    }

    if (
      typeof window.refreshManaCoachInbox !==
      "function"
    ) {
      return;
    }

    lastInboxRequest = now;

    try {
      const result =
        window.refreshManaCoachInbox();

      if (
        result &&
        typeof result.catch === "function"
      ) {
        result.catch(error => {
          console.warn(
            "[Mana Coach Inbox]",
            error
          );
        });
      }
    } catch (error) {
      console.warn(
        "[Mana Coach Inbox]",
        error
      );
    }
  }

  function queueInboxRefresh() {
    if (inboxQueued) return;

    inboxQueued = true;

    requestAnimationFrame(() => {
      inboxQueued = false;

      if (!chatVisible()) return;

      refreshRealInbox(true);
    });
  }

  /* =====================================================
     REFRESH AFTER NAVIGATION

     This is necessary because the original
     v9.7 navigation is intercepted before
     the newer chat module's document-level
     navigation listener.

     Refresh explicitly after the new
     section is actually visible.
     ===================================================== */

  function navigate(page) {
    if (!coachOpen()) return;

    if (
      ![
        "summary",
        "clients",
        "chat",
        "payments",
        "settings"
      ].includes(page)
    ) return;

    selected = page;

    if (
      typeof window.showCoachPage ===
      "function"
    ) {
      window.showCoachPage("home");
    } else {
      $(DETAIL)?.classList.add("hide");
      $(COACH)?.classList.remove("hide");

      $(COACH)?.querySelectorAll(
        ".coach-page"
      ).forEach(element => {
        element.classList.add("hide");
      });

      $(HOME)?.classList.remove("hide");
    }

    showSelected();
    updateTabs();

    requestAnimationFrame(() => {
      showSelected();
      updateTabs();

      if (selected === "chat") {
        queueInboxRefresh();
      }
    });

    if (page === "chat") {
      /*
       A second bounded refresh handles
       pages that become visible after a
       short navigation transition.
      */

      setTimeout(() => {
        if (selected === "chat") {
          refreshRealInbox();
        }
      }, 350);
    }

    window.scrollTo(0, 0);
  }

  /* =====================================================
     INTERCEPT OLD NAVIGATION

     Stops Chat from opening the legacy
     Coach Progress page.

     Does not intercept chat conversations,
     client cards or other Coach buttons.
     ===================================================== */

  function onNavClick(event) {
    if (!coachOpen()) return;

    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest(
      "#" + NAV +
      " .mana-v970-tab[data-coach-page]"
    );

    if (!button) return;

    const route = routeFor(button);

    if (!route) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    navigate(route);
  }

  /* =====================================================
     OBSERVE CHAT PANEL

     If the older placeholder reappears,
     request the real inbox again.

     Only watches the existing chat panel.
     Does not monitor the entire document.
     ===================================================== */

  function watchChat() {
    const section = chatView();

    const panel = section?.querySelector(
      ".mcn-panel"
    );

    if (!panel || watchedChat === panel) {
      return;
    }

    chatObserver?.disconnect();

    watchedChat = panel;

    chatObserver = new MutationObserver(() => {
      if (!chatVisible()) return;

      const placeholder =
        panel.querySelector(".mcn-notice");

      if (
        placeholder &&
        /messaging connection pending/i.test(
          placeholder.textContent || ""
        )
      ) {
        refreshRealInbox();
      }
    });

    chatObserver.observe(panel, {
      childList: true,
      subtree: false
    });
  }

  /* =====================================================
     WATCH EXISTING NAVIGATION STATE

     Reconcile highlights when another
     Coach module updates the tab classes.

     Never routes again from an observer.
     ===================================================== */

  function queueTabs() {
    if (refreshQueued) return;

    refreshQueued = true;

    requestAnimationFrame(() => {
      refreshQueued = false;

      if (!coachOpen()) return;

      updateTabs();
      watchChat();
    });
  }

  function observe() {
    const nav = $(NAV);
    const coach = $(COACH);
    const detail = $(DETAIL);

    if (
      nav !== watchedNav
    ) {
      navObserver?.disconnect();
      watchedNav = nav;

      if (nav) {
        navObserver = new MutationObserver(
          queueTabs
        );

        navObserver.observe(nav, {
          attributes: true,
          attributeFilter: [
            "class",
            "aria-current"
          ],
          subtree: true
        });
      }
    }

    if (
      coach !== watchedCoach ||
      detail !== watchedDetail
    ) {
      viewObserver?.disconnect();

      watchedCoach = coach;
      watchedDetail = detail;

      viewObserver = new MutationObserver(
        queueTabs
      );

      for (const element of [
        coach,
        detail
      ]) {
        if (!element) continue;

        viewObserver.observe(element, {
          attributes: true,
          attributeFilter: [
            "class",
            "hidden"
          ]
        });
      }
    }

    watchChat();
  }

  /* =====================================================
     INITIALISE
     ===================================================== */

  function init() {
    installStyles();

    /*
     Capture before the legacy Coach tab
     handlers, keeping the working newer
     Coach Hub screens.
    */

    window.addEventListener(
      "click",
      onNavClick,
      true
    );

    observe();

    if (coachOpen()) {
      const current = $(NAV)?.querySelector(
        ".mana-v970-tab.active"
      );

      if (current && !detailOpen()) {
        selected =
          routeFor(current) ||
          "summary";
      }

      showSelected();
      updateTabs();

      if (selected === "chat") {
        queueInboxRefresh();
      }
    }

    window.addEventListener(
      "pageshow",
      () => {
        observe();

        queueTabs();

        if (chatVisible()) {
          queueInboxRefresh();
        }
      }
    );

    window.addEventListener(
      "focus",
      () => {
        if (chatVisible()) {
          queueInboxRefresh();
        }
      }
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) {
          queueTabs();

          if (chatVisible()) {
            queueInboxRefresh();
          }
        }
      }
    );

    window.MANA_COACH_NAV_BUILD =
      BUILD;

    console.log(
      "[Mana Movement] Coach Nav & Inbox " +
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
