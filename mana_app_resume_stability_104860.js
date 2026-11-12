
/* =====================================================
   MANA MOVEMENT TRAINING
   APP RESUME & COACH SCREEN STABILITY
   BUILD 104860

   COMPLETE NEW FILE:
   mana_app_resume_stability_104860.js

   - Remember active workspace
   - Remember client program and tab
   - Remember Coach Hub section
   - Remember selected coach client
   - Restore location after page reload
   - Protect open Coach Client Detail on resume
   - Avoid recurring profile-render observers
   - Preserve all existing Supabase data

   This is NOT a replacement for Back navigation.
   Smart Back 104770 remains disabled.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104860";
  const KEY = "mana:resume:104860";

  if (window.MANA_RESUME_104860) return;
  window.MANA_RESUME_104860 = true;

  const $ = id => document.getElementById(id);

  let selectedClient = null;
  let restoring = false;
  let userNavigated = false;
  let restoreStarted = false;

  function visible(id) {
    const el = $(id);

    return Boolean(
      el &&
      !el.hidden &&
      !el.classList.contains("hide")
    );
  }

  function shellOpen(id) {
    return Boolean(
      $(id)?.classList.contains("open")
    );
  }

  function activeCoachDetail() {
    return visible("coachClientDetailView");
  }

  function activeCoach() {
    return (
      activeCoachDetail() ||
      visible("coachView")
    );
  }

  function appActive() {
    return (
      activeCoach() ||
      visible("clientView") ||
      [
        "clientProgramsView",
        "clientFuelView",
        "clientProgressView",
        "clientProfileView"
      ].some(visible) ||
      shellOpen("manaV83ProgramShell") ||
      shellOpen("manaProfileScreen")
    );
  }

  function authenticated() {
    return (
      appActive() &&
      !shellOpen("manaV81Intro")
    );
  }

  function save(route) {
    if (!route || restoring) return;

    try {
      sessionStorage.setItem(
        KEY,
        JSON.stringify(route)
      );
    } catch (error) {
      console.warn(
        "[Mana Resume] Could not save screen",
        error
      );
    }
  }

  function load() {
    try {
      const route = JSON.parse(
        sessionStorage.getItem(KEY) || "null"
      );

      return (
        route &&
        typeof route === "object"
      ) ? route : null;
    } catch (_) {
      return null;
    }
  }

  function clear() {
    try {
      sessionStorage.removeItem(KEY);
    } catch (_) {}
  }

  function currentProgram() {
    const title = String(
      $("manaV83Title")?.textContent || ""
    ).trim().toLowerCase();

    if (title.includes("strength")) {
      return "strength";
    }

    if (
      title.includes("mana28") ||
      title.includes("mana 28")
    ) {
      return "mana28";
    }

    if (
      title.includes("lyfe") ||
      title.includes("life")
    ) {
      return "life";
    }

    return null;
  }

  function currentProgramTab() {
    return document.querySelector(
      '#manaV83Tabs [data-v83-tab].active'
    )?.dataset.v83Tab || "overview";
  }

  function currentCoachPage() {
    const pages = {
      coachHomePage: "home",
      coachProgramsPage: "programs",
      coachFuelPage: "fuel",
      coachProgressPage: "progress",
      coachProfilePage: "profile"
    };

    for (const [id, page] of Object.entries(pages)) {
      if (visible(id)) return page;
    }

    return "home";
  }

  function capture() {
    if (
      restoring ||
      !authenticated()
    ) return;

    const scrollY = Math.max(
      0,
      Math.round(window.scrollY)
    );

    if (activeCoachDetail()) {
      const name = String(
        $("detailClientName")?.textContent || ""
      ).trim();

      const previous = load();

      save({
        workspace: "coach",
        page: "client-detail",
        client: selectedClient ||
          (previous?.page === "client-detail"
            ? previous.client
            : null),
        name,
        scrollY
      });

      return;
    }

    if (visible("coachView")) {
      save({
        workspace: "coach",
        page: currentCoachPage(),
        scrollY
      });

      return;
    }

    if (shellOpen("manaV83ProgramShell")) {
      const program = currentProgram();

      if (program) {
        save({
          workspace: "client",
          page: "program",
          program,
          tab: currentProgramTab(),
          scrollY
        });
      }

      return;
    }

    if (shellOpen("manaProfileScreen")) {
      save({
        workspace: "client",
        page: "profile",
        scrollY
      });

      return;
    }

    const clientPages = {
      clientProgramsView: "programs",
      clientFuelView: "fuel",
      clientProgressView: "progress",
      clientProfileView: "profile"
    };

    for (const [id, page] of
      Object.entries(clientPages)) {
      if (visible(id)) {
        save({
          workspace: "client",
          page,
          scrollY
        });
        return;
      }
    }

    if (visible("clientView")) {
      save({
        workspace: "client",
        page: "home",
        scrollY
      });
    }
  }

  /* =====================================
     REMEMBER CLIENT PROFILE SELECTION

     Wrap the existing opener rather than
     replacing the original data loader.
     ===================================== */

  function wrapClientOpener() {
    const original =
      window.openCoachClientDetail;

    if (
      typeof original !== "function" ||
      original.__manaResume104860
    ) {
      return;
    }

    function wrapped(userId, clientName, ...rest) {
      if (!restoring) {
        selectedClient = {
          userId,
          clientName
        };

        userNavigated = true;
      }

      return original.call(
        this,
        userId,
        clientName,
        ...rest
      );
    }

    wrapped.__manaResume104860 = true;

    window.openCoachClientDetail = wrapped;
  }

  /* =====================================
     PROTECT OPEN COACH CLIENT DETAIL

     Older resume handlers treat a hidden
     coachView as having left Coach Hub.

     During an actual tab/app switch,
     don't let those handlers run over an
     already open coaching profile.

     Only suppress resume events while
     Coach Client Detail is already open.
     ===================================== */

  function protectCoachDetail(event) {
    if (!activeCoachDetail()) return;

    if (
      event.type === "visibilitychange" &&
      document.visibilityState !== "visible"
    ) {
      return;
    }

    if (
      event.type === "focus" ||
      event.type === "pageshow" ||
      event.type === "visibilitychange"
    ) {
      event.stopImmediatePropagation();
    }
  }

  /* =====================================
     RESTORE PROGRAM TAB
     ===================================== */

  function restoreProgram(route) {
    if (
      typeof window.openManaProgram !==
      "function"
    ) {
      return false;
    }

    window.openManaProgram(route.program);

    if (
      route.tab &&
      route.tab !== "overview"
    ) {
      setTimeout(() => {
        document.querySelector(
          '#manaV83Tabs [data-v83-tab="' +
          route.tab + '"]'
        )?.click();
      }, 180);
    }

    return true;
  }

  /* =====================================
     RESTORE COACH WORKSPACE
     ===================================== */

  function restoreCoach(route) {
    if (
      !visible("coachView") &&
      !activeCoachDetail()
    ) {
      return false;
    }

    if (route.page === "client-detail") {
      if (
        route.client?.userId &&
        typeof window.openCoachClientDetail ===
        "function"
      ) {
        window.openCoachClientDetail(
          route.client.userId,
          route.client.clientName ||
            route.name ||
            "Client"
        );

        return true;
      }

      return false;
    }

    if (
      typeof window.showCoachPage ===
      "function"
    ) {
      window.showCoachPage(
        route.page || "home"
      );

      return true;
    }

    return false;
  }

  /* =====================================
     ONE-TIME RELOAD RESTORATION

     Do not reroute on ordinary focus.
     Normal tab switching should leave
     the existing DOM exactly as it was.
     ===================================== */

  function restoreOnce() {
    if (
      restoreStarted ||
      userNavigated ||
      restoring
    ) return;

    const route = load();
    if (!route) return;

    if (!appActive()) return;

    if (
      activeCoachDetail() ||
      shellOpen("manaV83ProgramShell")
    ) {
      restoreStarted = true;
      return;
    }

    if (
      shellOpen("manaV81Intro") ||
      !visible("coachView") &&
      !visible("clientView") &&
      ![
        "clientProgramsView",
        "clientFuelView",
        "clientProgressView",
        "clientProfileView"
      ].some(visible)
    ) {
      return;
    }

    /* Never switch an already-open coach
       workspace into client mode, or the
       other way round. */

    if (
      route.workspace === "coach" &&
      !visible("coachView")
    ) return;

    if (
      route.workspace === "client" &&
      visible("coachView")
    ) return;

    restoring = true;

    try {
      let restored = false;

      if (route.workspace === "coach") {
        restored = restoreCoach(route);
      } else if (
        route.page === "program" &&
        route.program
      ) {
        restored = restoreProgram(route);
      } else {
        const pageFunctions = {
          home: "showClientHomeStable",
          programs: "showClientProgramsView",
          fuel: "showClientFuelView",
          progress: "showClientProgressView",
          profile: "showClientProfileView"
        };

        const fn =
          window[pageFunctions[route.page]];

        if (typeof fn === "function") {
          fn();
          restored = true;
        }
      }

      if (restored) {
        restoreStarted = true;

        setTimeout(() => {
          window.scrollTo({
            top: Math.max(
              0,
              Number(route.scrollY) || 0
            ),
            behavior: "instant"
          });
        }, 450);
      }
    } catch (error) {
      console.warn(
        "[Mana Resume] Restoration skipped",
        error
      );
    } finally {
      restoring = false;
    }
  }

  function init() {
    wrapClientOpener();

    /* Save location when leaving the page. */

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.visibilityState === "hidden") {
          capture();
        }
      },
      true
    );

    window.addEventListener(
      "pagehide",
      capture,
      true
    );

    /* Protect an already-open coach detail
       from older resume-on-focus routines. */

    window.addEventListener(
      "focus",
      protectCoachDetail,
      true
    );

    window.addEventListener(
      "pageshow",
      protectCoachDetail,
      true
    );

    document.addEventListener(
      "visibilitychange",
      protectCoachDetail,
      true
    );

    /* Track actual navigation selections. */

    document.addEventListener(
      "click",
      event => {
        const target = event.target;

        if (!(target instanceof Element)) return;

        if (target.closest(
          "#manaV97CoachLogout, " +
          "#coachLogoutButton, " +
          "#clientLogoutBtn"
        )) {
          clear();
          return;
        }

        if (
          target.closest(
            "#manaV83Tabs [data-v83-tab], " +
            "#manaV97CoachNav [data-coach-page], " +
            "#bottomNav [data-page]"
          )
        ) {
          userNavigated = true;
        }

        setTimeout(() => {
          wrapClientOpener();
          capture();
        }, 180);
      },
      true
    );

    window.addEventListener(
      "mana:program-tab-change",
      () => {
        setTimeout(capture, 100);
      }
    );

    /* One bounded startup check.
       No ongoing timers or DOM watchers. */

    [700, 1500, 2800].forEach(delay => {
      setTimeout(restoreOnce, delay);
    });

    console.log(
      "[Mana Movement] Resume stability " +
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
