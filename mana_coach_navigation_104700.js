
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH HUB — REAL NAVIGATION FIX
   BUILD 104701

   COMPLETE REPLACEMENT:
   mana_coach_navigation_104700.js

   FIXES:
   - Targets the actual v9.7 Coach Shell
   - Home / Clients / Programs / Progress / Profile
   - Searchable client directory
   - No flash back to old navigation
   - Premium orange, black, white, silver

   PRESERVES:
   - Client navigation
   - Coach login and logout
   - Existing coach page routing
   - Individual client profiles
   - Supabase and saved client data
   - All client-side program functionality

   No database changes.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104701";
  const STYLE_ID = "manaCoachNavigationStyle104701";
  const NAV_ID = "manaV97CoachNav";
  const DIRECTORY_ID = "manaCoachClientsPage104700";
  const DIRECTORY_CLASS = "mana-coach-directory-mode";
  const HOME_ID = "coachHomePage";

  if (window.MANA_COACH_NAV_104701) return;
  window.MANA_COACH_NAV_104701 = true;

  const $ = id => document.getElementById(id);

  let directoryOpen = false;

  const labels = {
    home: ["⌂", "Home"],
    fuel: ["♙", "Clients"],
    programs: ["▦", "Programs"],
    progress: ["↗", "Progress"],
    profile: ["◎", "Profile"]
  };

  function escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[character]
    );
  }

  function coachActive() {
    return Boolean(
      (
        $("coachView") &&
        !$("coachView").classList.contains("hide")
      ) ||
      (
        $("coachClientDetailView") &&
        !$("coachClientDetailView")
          .classList.contains("hide")
      )
    );
  }

  /* =====================================
     COACH NAVIGATION STYLING
     ===================================== */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* Real Coach Shell navigation */

      #${NAV_ID} {
        background: rgba(8,9,11,.98) !important;
        border-top: 1px solid #535B65 !important;
        box-shadow: none !important;
      }

      #${NAV_ID} .mana-v970-nav-inner {
        width: min(980px,100%) !important;
        display: grid !important;

        grid-template-columns:
          repeat(5,minmax(0,1fr)) !important;

        gap: 7px !important;
      }

      #${NAV_ID} .mana-v970-tab {
        min-width: 0 !important;
        min-height: 61px !important;

        padding: 8px 4px !important;

        border: 1px solid #454B53 !important;
        border-radius: 13px !important;

        background: #15171A !important;
        background-image: none !important;

        color: #C1C6CE !important;
        -webkit-text-fill-color: #C1C6CE !important;

        font-size: 12px !important;
        font-weight: 850 !important;
        text-align: center !important;
        box-shadow: none !important;
      }

      #${NAV_ID} .mana-v970-tab-icon {
        display: block !important;
        margin-bottom: 5px !important;

        color: inherit !important;
        font-size: 18px !important;
        line-height: 1 !important;
      }

      #${NAV_ID} .mana-v970-tab.active {
        background: #392013 !important;
        background-image: none !important;

        border-color: #FF7927 !important;

        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      #${NAV_ID} .mana-v970-tab:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: 2px !important;
      }

      /* Coach logout colour */

      #manaV97CoachLogout {
        border-color: #FF7927 !important;
        background: #15171A !important;

        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      /* =================================
         SEARCHABLE CLIENT DIRECTORY
         ================================= */

      #${DIRECTORY_ID} {
        display: none !important;
      }

      #${HOME_ID}.${DIRECTORY_CLASS}
      > #manaCoachHubClean103760 {
        display: none !important;
      }

      #${HOME_ID}.${DIRECTORY_CLASS}
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
        margin: 8px 0;
        color: #FFFFFF;

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

      #${DIRECTORY_ID} .mcn-empty {
        padding: 16px;

        background: #101216;
        border: 1px solid #454B53;
        border-radius: 12px;

        color: #C1C6CE;
        font-size: 13px;
      }

      @media(max-width:600px) {

        #${NAV_ID} .mana-v970-nav-inner {
          gap: 5px !important;
        }

        #${NAV_ID} .mana-v970-tab {
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
     REAL CLIENT DIRECTORY
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
    const home = $(HOME_ID);
    if (!home) return null;

    let directory = $(DIRECTORY_ID);

    if (directory) return directory;

    directory = document.createElement("section");
    directory.id = DIRECTORY_ID;

    directory.setAttribute(
      "aria-label",
      "Coach client directory"
    );

    directory.innerHTML = `
      <div class="mcn-panel">

        <div class="mcn-kicker">
          MANA MOVEMENT · COACH OPERATIONS
        </div>

        <h2>Clients</h2>

        <p>
          Search your client directory and
          open an existing coaching profile.
        </p>

        <input
          id="manaCoachClientSearch104700"
          class="mcn-search"
          type="search"
          placeholder="Search clients..."
          aria-label="Search clients"
        >

      </div>

      <div class="mcn-panel">
        <div id="manaCoachClientList104700"></div>
      </div>
    `;

    home.appendChild(directory);

    directory.addEventListener(
      "input",
      event => {
        if (
          event.target.id ===
          "manaCoachClientSearch104700"
        ) {
          renderClients();
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
            item.id === button.dataset.coachClientId
        );

        if (
          client &&
          typeof window.openCoachClientDetail ===
            "function"
        ) {
          hideDirectory();

          window.openCoachClientDetail(
            client.id,
            client.name
          );
        }
      }
    );

    return directory;
  }

  function renderClients() {
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
          Return to Coach Home and refresh
          the dashboard if needed.
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
      client => `
        <button
          type="button"
          class="mcn-client"
          data-coach-client-id="${escapeHTML(client.id)}"
        >
          <strong>
            ${escapeHTML(client.name)}
          </strong>

          <span>Open Profile →</span>
        </button>
      `
    ).join("");
  }

  /* =====================================
     NAVIGATION STATE
     ===================================== */

  function setActiveTab(page) {
    const nav = $(NAV_ID);
    if (!nav) return;

    nav.querySelectorAll(
      "[data-coach-page]"
    ).forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.coachPage === page
      );
    });
  }

  function hideDirectory() {
    directoryOpen = false;

    $(HOME_ID)?.classList.remove(
      DIRECTORY_CLASS
    );
  }

  function openDirectory() {
    if (!coachActive()) return;

    ensureDirectory();

    if (
      typeof window.showCoachPage === "function"
    ) {
      window.showCoachPage("home");
    }

    directoryOpen = true;

    $(HOME_ID)?.classList.add(
      DIRECTORY_CLASS
    );

    renderClients();

    setActiveTab("fuel");

    window.scrollTo(0,0);
  }

  /* =====================================
     UPDATE REAL COACH TAB LABELS
     ===================================== */

  function updateNav() {
    const nav = $(NAV_ID);

    if (!nav) return;

    for (const [page,parts] of Object.entries(labels)) {
      const button = nav.querySelector(
        `[data-coach-page="${page}"]`
      );

      if (!button) continue;

      const icon = button.querySelector(
        ".mana-v970-tab-icon"
      );

      if (icon && icon.textContent.trim() !== parts[0]) {
        icon.textContent = parts[0];
      }

      /* Reuse existing button.
         No click handlers are removed. */

      let label = button.querySelector(
        ".mana-coach-tab-label-104701"
      );

      if (!label) {
        const childNodes = Array.from(
          button.childNodes
        );

        childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = "";
          }
        });

        label = document.createElement("span");
        label.className =
          "mana-coach-tab-label-104701";

        button.appendChild(label);
      }

      if (label.textContent !== parts[1]) {
        label.textContent = parts[1];
      }
    }

    if (directoryOpen && coachActive()) {
      setActiveTab("fuel");
    }
  }

  /* =====================================
     INTERCEPT CLIENTS TAB ONLY

     Use capture phase so the old coach
     shell doesn't open the Fuel page.
     ===================================== */

  function onClick(event) {
    const button = event.target.closest(
      `#${NAV_ID} [data-coach-page]`
    );

    if (!button || !coachActive()) return;

    if (button.dataset.coachPage === "fuel") {
      event.preventDefault();
      event.stopImmediatePropagation();

      openDirectory();
      return;
    }

    hideDirectory();
  }

  /* =====================================
     KEEP NAV UPDATED
     ===================================== */

  function init() {
    installStyles();
    ensureDirectory();
    updateNav();

    document.addEventListener(
      "click",
      onClick,
      true
    );

    const observer = new MutationObserver(
      () => {
        updateNav();
      }
    );

    const coachView = $("coachView");
    const detailView = $("coachClientDetailView");

    [coachView,detailView].forEach(element => {
      if (!element) return;

      observer.observe(element,{
        attributes: true,
        attributeFilter: ["class"]
      });
    });

    const nav = $(NAV_ID);

    if (nav) {
      observer.observe(nav,{
        childList: true,
        subtree: true
      });
    }

    window.addEventListener(
      "pageshow",
      updateNav
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
