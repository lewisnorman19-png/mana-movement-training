
/* ============================================================
   MANA MOVEMENT TRAINING
   COACH HUB — NAVIGATION STABILITY
   BUILD 105004

   COMPLETE JAVASCRIPT FILE

   FIXES
   - Chat no longer opens old Progress screen
   - Summary / Clients / Chat / Payments / Settings
   - First click opens the correct Coach Hub section
   - Exactly one active orange tab
   - Active tab stays orange
   - Client Detail highlights Clients
   - Prevents conflicting legacy tab click handling
   - Preserves existing client and chat data

   DOES NOT CHANGE
   - Supabase
   - Messages
   - Client Profile
   - Profile photograph
   - Program Builder
   - Workout history
   - Client assignments
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "105004";
  const FLAG = "MANA_COACH_NAV_STABLE_105004";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const NAV = "manaV97CoachNav";
  const HOME = "coachHomePage";
  const SUITE = "manaCoachSuite104707";
  const DETAIL = "coachClientDetailView";
  const COACH = "coachView";
  const STYLE = "manaCoachNavStableStyle105004";

  const $ = id => document.getElementById(id);

  const routes = {
    home: "summary",
    fuel: "clients",
    progress: "chat",
    programs: "payments",
    profile: "settings"
  };

  let selected = "summary";
  let pending = false;
  let observer = null;
  let observedNav = null;
  let observedCoach = null;
  let observedDetail = null;

  /* =====================================================
     VISIBILITY
     ===================================================== */

  function visible(node) {
    return Boolean(
      node &&
      !node.hidden &&
      !node.classList.contains("hide")
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

    const underlying =
      button.dataset.coachPage;

    return (
      routes[underlying] ||
      button.dataset.mcnTab ||
      ""
    );
  }

  /* =====================================================
     PREMIUM ORANGE ACTIVE STATE
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* INACTIVE BUTTONS */

      #${NAV} .mana-v970-tab {
        background: #15171A !important;
        background-image: none !important;

        border: 1px solid #414750 !important;
        border-radius: 13px !important;

        color: #C1C6CE !important;
        -webkit-text-fill-color: #C1C6CE !important;

        box-shadow: none !important;
      }

      #${NAV} .mana-v970-tab
      .mana-v970-tab-icon,
      #${NAV} .mana-v970-tab
      .mcn-tab-label {
        color: inherit !important;
        -webkit-text-fill-color:
          currentColor !important;
      }

      /* ONE ACTIVE BUTTON */

      #${NAV}
      .mana-v970-tab.mana-nav-selected-105004 {
        background: #321D12 !important;
        background-image: none !important;

        border: 1px solid #FF7927 !important;
        border-radius: 13px !important;

        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;

        box-shadow: none !important;
      }

      #${NAV}
      .mana-v970-tab.mana-nav-selected-105004
      .mana-v970-tab-icon,
      #${NAV}
      .mana-v970-tab.mana-nav-selected-105004
      .mcn-tab-label {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      /*
       Neutralise older active classes
       when this navigation system is
       controlling the Coach Hub.
      */

      #${NAV}.mana-nav-controlled-105004
      .mana-v970-tab.active:not(
        .mana-nav-selected-105004
      ) {
        background: #15171A !important;
        border-color: #414750 !important;

        color: #C1C6CE !important;
        -webkit-text-fill-color: #C1C6CE !important;
      }

      #${NAV}.mana-nav-controlled-105004
      .mana-v970-tab.active:not(
        .mana-nav-selected-105004
      ) .mana-v970-tab-icon,
      #${NAV}.mana-nav-controlled-105004
      .mana-v970-tab.active:not(
        .mana-nav-selected-105004
      ) .mcn-tab-label {
        color: #C1C6CE !important;
        -webkit-text-fill-color: #C1C6CE !important;
      }

      #${NAV} .mana-v970-tab:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: 2px !important;
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     SELECTED PAGE CONTENT

     Uses the existing Coach Hub views.
     No new Chat, Payment or Client screens
     are fabricated.
     ===================================================== */

  function displaySelected() {
    const suite = $(SUITE);
    const home = $(HOME);

    if (!suite || !home) return;

    suite.querySelectorAll(
      "[data-mcn-view]"
    ).forEach(section => {
      const shouldShow =
        section.dataset.mcnView === selected;

      if (section.hidden === shouldShow) {
        section.hidden = !shouldShow;
      }
    });

    const summary =
      selected === "summary";

    if (
      home.classList.contains(
        "mcn-summary-active"
      ) !== summary
    ) {
      home.classList.toggle(
        "mcn-summary-active",
        summary
      );
    }
  }

  /* =====================================================
     KEEP ONE TAB ACTIVE
     ===================================================== */

  function updateTabs() {
    const nav = $(NAV);
    if (!nav || !coachOpen()) return;

    nav.classList.add(
      "mana-nav-controlled-105004"
    );

    const activePage =
      detailOpen()
        ? "clients"
        : selected;

    nav.querySelectorAll(
      ".mana-v970-tab[data-coach-page]"
    ).forEach(button => {
      const isActive =
        routeFor(button) === activePage;

      button.classList.toggle(
        "mana-nav-selected-105004",
        isActive
      );

      /*
       Synchronise legacy active styling
       so only one tab is marked active.
      */

      if (
        button.classList.contains(
          "active"
        ) !== isActive
      ) {
        button.classList.toggle(
          "active",
          isActive
        );
      }

      if (isActive) {
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
     ROUTING

     Navigate to the existing Coach Home
     container, then display the requested
     Coach Hub section.

     This avoids opening the old underlying
     Progress / Fuel / Programs pages.
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

    displaySelected();
    updateTabs();

    /*
     Older navigation may update its
     active class during this transition.

     Reconcile after the current event,
     without dispatching another click.
    */

    requestAnimationFrame(() => {
      displaySelected();
      updateTabs();
    });

    window.scrollTo(0, 0);
  }

  /* =====================================================
     CAPTURE NAVIGATION BEFORE LEGACY HANDLERS

     The original v9.7 navigation assigns
     Chat to the old Progress page.

     Handle only actual Coach Hub tab
     clicks. Other buttons are untouched.
     ===================================================== */

  function interceptClick(event) {
    if (!coachOpen()) return;

    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest(
      `#${NAV} .mana-v970-tab[data-coach-page]`
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
     RECONCILE LATER CLASS CHANGES

     Observe only:
     - five navigation buttons
     - Coach View visibility
     - Client Detail visibility

     No document-wide DOM observer.
     ===================================================== */

  function reconcile() {
    if (!coachOpen()) return;

    updateTabs();
  }

  function scheduleReconcile() {
    if (pending) return;

    pending = true;

    requestAnimationFrame(() => {
      pending = false;
      reconcile();
    });
  }

  function observe() {
    const nav = $(NAV);
    const coach = $(COACH);
    const detail = $(DETAIL);

    if (
      nav === observedNav &&
      coach === observedCoach &&
      detail === observedDetail
    ) return;

    observer?.disconnect();

    observedNav = nav;
    observedCoach = coach;
    observedDetail = detail;

    observer = new MutationObserver(
      scheduleReconcile
    );

    if (nav) {
      observer.observe(nav, {
        subtree: true,
        attributes: true,
        attributeFilter: [
          "class",
          "aria-current",
          "aria-selected"
        ]
      });
    }

    if (coach) {
      observer.observe(coach, {
        attributes: true,
        attributeFilter: [
          "class",
          "hidden"
        ]
      });
    }

    if (detail) {
      observer.observe(detail, {
        attributes: true,
        attributeFilter: [
          "class",
          "hidden"
        ]
      });
    }
  }

  /* =====================================================
     INITIALISE
     ===================================================== */

  function init() {
    installStyles();

    /*
     Window capture executes before the
     older document-level Coach handlers.
    */

    window.addEventListener(
      "click",
      interceptClick,
      true
    );

    observe();

    if (coachOpen()) {
      const current = $(NAV)?.querySelector(
        ".mana-v970-tab.active"
      );

      if (current && !detailOpen()) {
        selected =
          routeFor(current) || "summary";
      }

      displaySelected();
      updateTabs();
    }

    window.addEventListener(
      "pageshow",
      () => {
        observe();
        scheduleReconcile();
      }
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) {
          scheduleReconcile();
        }
      }
    );

    window.MANA_COACH_NAV_BUILD =
      BUILD;

    console.log(
      "[Mana Movement] Coach Navigation " +
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
