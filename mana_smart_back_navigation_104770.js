
/* =====================================================
   MANA MOVEMENT TRAINING
   SMART BACK NAVIGATION
   BUILD 104770

   COMPLETE NEW FILE:
   mana_smart_back_navigation_104770.js

   BEHAVIOUR:
   - Remember where a coaching profile opened from
   - Back returns to that exact Coach Hub section
   - Restore program directory when applicable
   - Restore scroll position where possible
   - Bottom tabs continue direct navigation
   - Logout remains unaffected

   PRESERVES:
   - Client and coach login
   - All client programs
   - Program Builder
   - Generated workout snapshots
   - Coach assignments
   - All Supabase records
   - Existing specialised workout navigation

   No database writes.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104770";

  if (window.MANA_SMART_BACK_104770) {
    return;
  }

  window.MANA_SMART_BACK_104770 = true;

  const $ = id => document.getElementById(id);

  const NAV_ID = "manaV97CoachNav";
  const HOME_ID = "coachHomePage";
  const DETAIL_ID = "coachClientDetailView";

  let previousCoachScreen = null;
  let restoring = false;

  /* =====================================
     VISIBILITY HELPERS
     ===================================== */

  function visible(element) {
    if (!element) return false;

    if (
      element.classList.contains("hide") ||
      element.hidden
    ) {
      return false;
    }

    return true;
  }

  function coachVisible() {
    return visible($("coachView"));
  }

  function detailVisible() {
    return visible($(DETAIL_ID));
  }

  /* =====================================
     IDENTIFY CURRENT COACH SCREEN
     ===================================== */

  const COACH_PAGES = {
    coachHomePage: "home",
    coachProgramsPage: "programs",
    coachFuelPage: "fuel",
    coachProgressPage: "progress",
    coachProfilePage: "profile"
  };

  function currentCoachScreen() {
    if (!coachVisible() || detailVisible()) {
      return null;
    }

    const home = $(HOME_ID);

    if (visible(home)) {

      /* Searchable Clients directory */

      if (
        home.classList.contains(
          "mana-coach-directory-mode"
        )
      ) {
        return {
          type: "clients",
          scrollY: window.scrollY
        };
      }

      /* Program-specific client directory */

      const programBack = home.querySelector(
        "#manaCoachHubClean103760 .hub-back"
      );

      if (programBack) {
        const title = String(
          home.querySelector(
            "#manaCoachHubClean103760 " +
            ".hub-directory-title"
          )?.textContent || ""
        ).trim().toLowerCase();

        let program = "";

        if (title.includes("strength")) {
          program = "strength";
        } else if (title.includes("mana28")) {
          program = "mana28";
        } else if (
          title.includes("lyfe") ||
          title.includes("life")
        ) {
          program = "lyfe";
        }

        if (program) {
          return {
            type: "program",
            program,
            scrollY: window.scrollY
          };
        }
      }

      return {
        type: "coach-page",
        page: "home",
        scrollY: window.scrollY
      };
    }

    for (
      const [id, page] of
      Object.entries(COACH_PAGES)
    ) {
      if (visible($(id))) {
        return {
          type: "coach-page",
          page,
          scrollY: window.scrollY
        };
      }
    }

    return null;
  }

  /* =====================================
     REMEMBER THE SCREEN BEFORE
     OPENING A CLIENT PROFILE
     ===================================== */

  function recordPreviousScreen() {
    if (restoring || detailVisible()) {
      return;
    }

    const current = currentCoachScreen();

    if (current) {
      previousCoachScreen = current;
    }
  }

  /* =====================================
     WRAP THE EXISTING CLIENT OPENER

     Does not change its arguments,
     return value or data-loading logic.
     ===================================== */

  function wrapClientOpener() {
    const original =
      window.openCoachClientDetail;

    if (
      typeof original !== "function" ||
      original.__manaSmartBack104770
    ) {
      return;
    }

    function wrappedClientOpener(...args) {
      recordPreviousScreen();

      return original.apply(this, args);
    }

    wrappedClientOpener.__manaSmartBack104770 =
      true;

    window.openCoachClientDetail =
      wrappedClientOpener;
  }

  /* =====================================
     COACH TAB NAVIGATION

     The original Coach Shell owns its
     tab routing and active states.
     ===================================== */

  function openCoachTab(page) {
    const button = document.querySelector(
      "#" + NAV_ID +
      ' [data-coach-page="' + page + '"]'
    );

    if (button) {
      button.click();
      return true;
    }

    if (
      typeof window.showCoachPage ===
      "function"
    ) {
      window.showCoachPage(page);
      return true;
    }

    return false;
  }

  /* =====================================
     RESTORE SCROLL POSITION
     ===================================== */

  function restoreScroll(position) {
    const y = Math.max(
      0,
      Number(position) || 0
    );

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: y,
          behavior: "instant"
        });
      });
    });
  }

  /* =====================================
     RETURN TO PREVIOUS COACH SCREEN
     ===================================== */

  function returnToPreviousCoachScreen() {
    const destination =
      previousCoachScreen || {
        type: "coach-page",
        page: "home",
        scrollY: 0
      };

    restoring = true;

    try {
      /* A client was opened from Clients */

      if (destination.type === "clients") {
        openCoachTab("fuel");

        restoreScroll(
          destination.scrollY
        );

        return;
      }

      /* A client was opened from a
         particular program directory */

      if (
        destination.type === "program" &&
        destination.program
      ) {
        openCoachTab("home");

        const programButton =
          document.querySelector(
            "#manaCoachHubClean103760 " +
            '[data-program="' +
            destination.program +
            '"]'
          );

        if (programButton) {
          programButton.click();
        }

        restoreScroll(
          destination.scrollY
        );

        return;
      }

      /* Existing Coach Hub page */

      openCoachTab(
        destination.page || "home"
      );

      restoreScroll(
        destination.scrollY
      );

    } finally {
      previousCoachScreen = null;
      restoring = false;
    }
  }

  /* =====================================
     REPLACE ONLY THE OLD HARDCODED
     CLIENT DETAIL BACK ACTION

     The old button always goes Home.
     This one returns to the actual
     originating screen instead.
     ===================================== */

  function onBackClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const back = target.closest(
      "#backToCoachClients"
    );

    if (
      !back ||
      !detailVisible()
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    returnToPreviousCoachScreen();
  }

  /* =====================================
     CLEAR STALE RETURN PATHS

     Selecting a bottom tab is a direct
     navigation action, not Back.
     ===================================== */

  function onNavigationClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (
      target.closest(
        "#manaV97CoachLogout"
      )
    ) {
      previousCoachScreen = null;
      return;
    }

    if (
      target.closest(
        "#" + NAV_ID + " [data-coach-page]"
      ) &&
      !restoring &&
      !detailVisible()
    ) {
      previousCoachScreen = null;
    }
  }

  /* =====================================
     INITIALISE
     ===================================== */

  function init() {
    wrapClientOpener();

    document.addEventListener(
      "click",
      onBackClick,
      true
    );

    document.addEventListener(
      "click",
      onNavigationClick,
      true
    );

    /* If the existing client opener is
       installed after this file, retry
       once after the page is ready. */

    window.addEventListener(
      "load",
      wrapClientOpener,
      { once: true }
    );

    console.log(
      "[Mana Movement] Smart back " +
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
