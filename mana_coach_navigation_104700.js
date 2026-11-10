
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH HUB — DEDICATED NAVIGATION
   BUILD 104700

   COMPLETE NEW FILE:
   mana_coach_navigation_104700.js

   COACH TABS:
   Home | Clients | Programs | Progress | Profile

   CLIENT TABS:
   Home | Programs | Fuel | Progress | Profile

   FEATURES:
   - Separate coach/client navigation labels
   - Searchable coach client directory
   - Open existing client profiles
   - Preserve original coach page routing
   - Preserve all client-side navigation
   - Premium black/orange/white/silver design

   NO CHANGES TO:
   - Authentication or account permissions
   - Supabase records
   - Program assignments
   - Workout, Fuel or Progress data
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104700";
  const STYLE_ID = "manaCoachNavigationStyle104700";
  const DIRECTORY_ID = "manaCoachClientsPage104700";
  const DIRECTORY_CLASS = "mana-coach-directory-mode";

  if (window.MANA_COACH_NAV_104700) return;
  window.MANA_COACH_NAV_104700 = true;

  const $ = id => document.getElementById(id);

  const clientTabs = {
    home: ["⌂", "Home"],
    programs: ["▣", "Programs"],
    fuel: ["◯", "Fuel"],
    progress: ["↗", "Progress"],
    profile: ["◎", "Profile"]
  };

  const coachTabs = {
    home: ["⌂", "Home"],
    fuel: ["♙", "Clients"],
    programs: ["▦", "Programs"],
    progress: ["↗", "Progress"],
    profile: ["◎", "Profile"]
  };

  let directoryOpen = false;

  function escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]
    );
  }

  /* =====================================
     IDENTIFY WORKSPACE BY VISIBLE SCREEN
     ===================================== */

  function isVisible(id) {
    const element = $(id);

    return Boolean(
      element &&
      !element.classList.contains("hide")
    );
  }

  function coachActive() {
    return (
      isVisible("coachView") ||
      isVisible("coachClientDetailView")
    );
  }

  /* =====================================
     NAVIGATION STYLING
     ===================================== */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* =================================
         COACH BOTTOM NAV ONLY
         ================================= */

      body.mana-coach-nav-104700
      #bottomNav {

        background: rgba(8,9,11,.97) !important;

        border-top: 1px solid #59616C !important;

        box-shadow: none !important;
      }

      body.mana-coach-nav-104700
      #bottomNav .navin {

        width: min(980px,100%) !important;
        max-width: 980px !important;

        display: grid !important;

        grid-template-columns:
          repeat(5,minmax(0,1fr)) !important;

        gap: 7px !important;
      }

      body.mana-coach-nav-104700
      #bottomNav [data-page] {

        min-width: 0 !important;
        min-height: 60px !important;

        padding: 8px 4px !important;

        border: 1px solid #454B53 !important;
        border-radius: 12px !important;

        background: #15171A !important;

        color: #C1C6CE !important;
        -webkit-text-fill-color:
          #C1C6CE !important;

        font-size: 12px !important;
        font-weight: 800 !important;

        text-align: center !important;
      }

      body.mana-coach-nav-104700
      #bottomNav [data-page].active {

        background: #392013 !important;

        border-color: #FF7927 !important;

        color: #FF7927 !important;
        -webkit-text-fill-color:
          #FF7927 !important;
      }

      body.mana-coach-nav-104700
      #bottomNav [data-page]:focus-visible {

        outline: 2px solid #FF7927 !important;
        outline-offset: 2px !important;
      }

      /* =================================
         CLIENT DIRECTORY

         Display alongside existing
         coach home infrastructure.
         ================================= */

      #coachHomePage
      #${DIRECTORY_ID} {

        display: none !important;
      }

      #coachHomePage.${DIRECTORY_CLASS}
      > #manaCoachHubClean103760 {

        display: none !important;
      }

      #coachHomePage.${DIRECTORY_CLASS}
      > #${DIRECTORY_ID} {

        display: block !important;
      }

      #${DIRECTORY_ID} {

        width: 100%;
        max-width: 850px;

        margin: 0 auto 115px;

        color: #FFFFFF;
      }

      #${DIRECTORY_ID} * {
        box-sizing: border-box;
      }

      #${DIRECTORY_ID} .mcn-panel {

        padding: 22px;
        margin-bottom: 15px;

        background: #15171A;

        border: 1px solid #626973;
        border-radius: 21px;
      }

      #${DIRECTORY_ID} .mcn-kicker {

        color: #FF7927;

        font-size: 10px;
        font-weight: 950;
        letter-spacing: .14em;
      }

      #${DIRECTORY_ID} h2 {

        color: #FFFFFF;

        margin: 8px 0;

        font-size: clamp(27px,5vw,36px);
        line-height: 1.12;
      }

      #${DIRECTORY_ID} p {

        color: #C1C6CE;

        font-size: 13px;
        line-height: 1.6;
      }

      #${DIRECTORY_ID} .mcn-search {

        display: block;
        width: 100%;

        margin: 16px 0 0;
        padding: 13px;

        background: #090B0D;

        border: 1px solid #59616C;
        border-radius: 12px;

        color: #FFFFFF;

        font-size: 14px;
      }

      #${DIRECTORY_ID} .mcn-search:focus {

        border-color: #FF7927;
        outline: none;
      }

      #${DIRECTORY_ID} .mcn-client {

        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;

        width: 100%;

        margin-top: 9px;
        padding: 14px;

        background: #20242B;

        border: 1px solid #59616C;
        border-radius: 13px;

        color: #FFFFFF;
        text-align: left;
        cursor: pointer;
      }

      #${DIRECTORY_ID} .mcn-client strong {

        color: #FFFFFF;
        font-size: 14px;
      }

      #${DIRECTORY_ID} .mcn-client span {

        color: #FF7927;
        font-size: 12px;
        font-weight: 850;
      }

      #${DIRECTORY_ID} .mcn-client:focus-visible {

        outline: 2px solid #FF7927;
        outline-offset: 2px;
      }

      #${DIRECTORY_ID} .mcn-empty {

        padding: 16px;

        background: #101216;

        border: 1px solid #454B53;
        border-radius: 12px;

        color: #C1C6CE;
        font-size: 13px;
      }

      @media(max-width:600px) {

        body.mana-coach-nav-104700
        #bottomNav .navin {

          gap: 5px !important;
        }

        body.mana-coach-nav-104700
        #bottomNav [data-page] {

          min-height: 56px !important;
          font-size: 10px !important;
          padding: 8px 2px !important;
        }

        #${DIRECTORY_ID} .mcn-panel {

          padding: 15px;
          border-radius: 17px;
        }

        #${DIRECTORY_ID} .mcn-client {

          padding: 13px 10px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================
     EXISTING COACH CLIENT RECORDS

     Read existing DOM client directory.
     Do not assign or change programs.
     ===================================== */

  function clients() {
    const source = $("coachClientsCard");
    if (!source) return [];

    const map = new Map();

    source.querySelectorAll(
      ".client-open[data-client-id]"
    ).forEach(element => {

      const id = String(
        element.dataset.clientId || ""
      ).trim();

      if (!id || map.has(id)) return;

      const name = String(
        element.dataset.clientName ||
        element.querySelector("strong")?.textContent ||
        "Client"
      ).trim();

      map.set(id,{id,name});
    });

    return [...map.values()].sort(
      (a,b) => a.name.localeCompare(b.name)
    );
  }

  /* =====================================
     CLIENT DIRECTORY SCREEN
     ===================================== */

  function ensureDirectory() {
    const home = $("coachHomePage");

    if (!home) return null;

    let directory = $(DIRECTORY_ID);

    if (!directory) {
      directory = document.createElement("section");

      directory.id = DIRECTORY_ID;
      directory.setAttribute(
        "aria-label",
        "Coach client directory"
      );

      home.appendChild(directory);

      directory.innerHTML = `
        <div class="mcn-panel">

          <div class="mcn-kicker">
            MANA MOVEMENT · COACH OPERATIONS
          </div>

          <h2>Clients</h2>

          <p>
            Find your clients and open their
            existing coaching profiles.
          </p>

          <input
            class="mcn-search"
            type="search"
            id="manaCoachClientSearch104700"
            placeholder="Search clients..."
            aria-label="Search clients"
          >

        </div>

        <div class="mcn-panel">

          <div id="manaCoachClientList104700">
          </div>

        </div>
      `;

      directory.addEventListener(
        "input",
        event => {
          if (
            event.target.id ===
            "manaCoachClientSearch104700"
          ) {
            renderClientList();
          }
        }
      );

      directory.addEventListener(
        "click",
        event => {
          const button = event.target.closest(
            "[data-coach-client-id]"
          );

          if (!button) return;

          const client = clients().find(
            item =>
              item.id ===
              button.dataset.coachClientId
          );

          if (
            client &&
            typeof window.openCoachClientDetail ===
              "function"
          ) {
            window.openCoachClientDetail(
              client.id,
              client.name
            );
          }
        }
      );
    }

    return directory;
  }

  function renderClientList() {
    const list = $("manaCoachClientList104700");
    if (!list) return;

    const search = String(
      $("manaCoachClientSearch104700")?.value ||
      ""
    ).trim().toLowerCase();

    const all = clients();

    const filtered = all.filter(
      item =>
        item.name.toLowerCase().includes(search)
    );

    if (!all.length) {
      list.innerHTML = `
        <div class="mcn-empty">
          No clients are currently loaded.
          Open Coach Home and refresh the
          dashboard if needed.
        </div>
      `;
      return;
    }

    if (!filtered.length) {
      list.innerHTML = `
        <div class="mcn-empty">
          No clients match your search.
        </div>
      `;
      return;
    }

    list.innerHTML = filtered.map(
      item => `
        <button
          type="button"
          class="mcn-client"
          data-coach-client-id="${escapeHTML(item.id)}"
        >
          <strong>${escapeHTML(item.name)}</strong>
          <span>Open Profile →</span>
        </button>
      `
    ).join("");
  }

  /* =====================================
     SHOW / HIDE COACH CLIENT DIRECTORY
     ===================================== */

  function hideDirectory() {
    directoryOpen = false;

    $("coachHomePage")?.classList.remove(
      DIRECTORY_CLASS
    );
  }

  function openDirectory() {
    if (
      typeof window.showCoachPage !== "function"
    ) {
      return;
    }

    ensureDirectory();

    window.showCoachPage("home");

    directoryOpen = true;

    $("coachHomePage")?.classList.add(
      DIRECTORY_CLASS
    );

    renderClientList();

    setActiveTab("fuel");

    window.scrollTo(0,0);
  }

  /* =====================================
     WORKSPACE-SPECIFIC TAB LABELS
     ===================================== */

  function setActiveTab(page) {
    document.querySelectorAll(
      "#bottomNav [data-page]"
    ).forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.page === page
      );
    });
  }

  function updateNavigation() {
    const coach = coachActive();

    document.body.classList.toggle(
      "mana-coach-nav-104700",
      coach
    );

    const labels = coach ? coachTabs : clientTabs;

    document.querySelectorAll(
      "#bottomNav [data-page]"
    ).forEach(button => {

      const item = labels[button.dataset.page];
      if (!item) return;

      const label = item[0] + "\n" + item[1];

      if (button.textContent !== label) {
        button.textContent = label;
        button.style.whiteSpace = "pre-line";
      }
    });

    if (!coach) {
      hideDirectory();
    }
  }

  /* =====================================
     COACH NAVIGATION HANDLER

     Only intercept the old Fuel tab when
     the authorised coach workspace is
     visibly active.

     All other existing page routes remain.
     ===================================== */

  function captureNavigation(event) {
    const button = event.target.closest(
      "#bottomNav [data-page]"
    );

    if (!button || !coachActive()) return;

    if (button.dataset.page === "fuel") {
      event.preventDefault();
      event.stopImmediatePropagation();

      openDirectory();
      return;
    }

    hideDirectory();
  }

  /* =====================================
     INITIALISE
     ===================================== */

  function init() {
    installStyles();
    ensureDirectory();

    document.addEventListener(
      "click",
      captureNavigation,
      true
    );

    const observer = new MutationObserver(
      updateNavigation
    );

    [
      "coachView",
      "coachClientDetailView",
      "clientView"
    ].forEach(id => {
      const element = $(id);

      if (!element) return;

      observer.observe(element,{
        attributes: true,
        attributeFilter: ["class"]
      });
    });

    updateNavigation();

    window.addEventListener(
      "pageshow",
      updateNavigation
    );

    console.log(
      "[Mana Movement] Coach navigation " +
      BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );
  } else {
    init();
  }

})();
