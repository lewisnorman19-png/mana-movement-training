
/* =====================================================
   MANA MOVEMENT — COACH HUB
   BUILD 104705

   COMPLETE REPLACEMENT:
   mana_coach_navigation_104700.js

   - White logout text, orange border
   - Compact Summary spacing
   - Assigned-client counts on program cards
   - Orange chevrons showing expandable sections
   - Live client directory and assignments
   - Summary / Clients / Chat / Payments / Settings
   - Original client profile and Program Builder
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104705";
  if (window.MANA_COACH_NAV_104705) return;
  window.MANA_COACH_NAV_104705 = true;

  const $ = id => document.getElementById(id);
  const HOME = "coachHomePage";
  const NAV = "manaV97CoachNav";
  const HUB = "manaCoachHubClean103760";
  const SUITE = "manaCoachSuite104705";
  const STYLE = "manaCoachSuiteStyle104705";

  let page = "summary";
  let clients = [];
  let assignments = [];
  let clientsLoaded = false;
  let assignmentsLoaded = false;
  let clientsError = "";
  let assignmentError = "";
  let loading = false;
  let coachWasVisible = false;
  let request = 0;

  const tabs = [
    ["summary", "home", "Summary", "▦"],
    ["clients", "fuel", "Clients", "♙"],
    ["chat", "progress", "Chat", "☏"],
    ["payments", "programs", "Payments", "▤"],
    ["settings", "profile", "Settings", "⚙"]
  ];

  const programs = [
    ["strength", "Mana Strength", "Strength & performance", "◆"],
    ["mana28", "Mana28", "28-day training", "▦"],
    ["lyfe", "ManaLyfe", "Lifestyle & wellbeing", "♡"]
  ];

  function esc(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      ch => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[ch]
    );
  }

  function coachVisible() {
    return Boolean(
      $("coachView") &&
      !$("coachView").classList.contains("hide")
    );
  }

  function classify(name) {
    const value = String(name || "")
      .toLowerCase().replace(/[\s_-]/g, "");

    if (
      value.includes("manastrength") ||
      value.includes("manastrong")
    ) return "strength";

    if (value.includes("mana28")) return "mana28";

    if (
      value.includes("manalyfe") ||
      value.includes("manaforlife")
    ) return "lyfe";

    return "";
  }

  /* ====================================
     CLIENTS AND ASSIGNMENTS
     ==================================== */

  async function loadData() {
    if (loading || !coachVisible()) return;

    loading = true;
    const ticket = ++request;

    try {
      const db = await window.supabaseClient();

      const auth = await db.auth.getUser();
      const user = auth.data?.user;

      if (!user || auth.error) {
        throw Error("Coach sign-in required");
      }

      const profile = await db.from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (
        profile.error ||
        profile.data?.role !== "coach"
      ) throw Error("Coach access required");

      const results = await Promise.allSettled([
        db.rpc("coach_clients_summary"),
        db.from("client_program_assignments")
          .select(
            "client_id,status,custom_programs(name)"
          )
          .eq("coach_id", user.id)
          .eq("status", "active")
      ]);

      if (ticket !== request) return;

      if (results[0].status === "fulfilled" &&
          !results[0].value.error) {
        const map = new Map();

        (results[0].value.data || []).forEach(r => {
          if (r.user_id && !map.has(r.user_id)) {
            map.set(r.user_id, {
              id: r.user_id,
              name: String(r.full_name || "Client")
            });
          }
        });

        clients = [...map.values()].sort(
          (a, b) => a.name.localeCompare(b.name)
        );

        clientsLoaded = true;
        clientsError = "";
      } else {
        clientsLoaded = false;
        clientsError =
          "Client records could not be loaded.";
      }

      if (results[1].status === "fulfilled" &&
          !results[1].value.error) {
        assignments = results[1].value.data || [];
        assignmentsLoaded = true;
        assignmentError = "";
      } else {
        assignmentsLoaded = false;
        assignmentError =
          "Program assignments could not be loaded.";
      }

    } catch (error) {
      clientsLoaded = false;
      assignmentsLoaded = false;

      clientsError =
        error?.message || "Cloud unavailable";

      assignmentError = clientsError;

    } finally {
      loading = false;

      if (ticket === request) {
        renderSummary();
        renderClients();
      }
    }
  }

  function groups() {
    const result = {
      strength: [],
      mana28: [],
      lyfe: [],
      unclassified: [],
      unassigned: []
    };

    if (!clientsLoaded || !assignmentsLoaded) {
      return result;
    }

    clients.forEach(client => {
      const matching = assignments.filter(
        a => a.client_id === client.id
      );

      if (!matching.length) {
        result.unassigned.push(client);
        return;
      }

      const unique = new Set();

      matching.forEach(a => {
        const program = a.custom_programs;
        const name = Array.isArray(program)
          ? program[0]?.name : program?.name;

        unique.add(classify(name) || "unclassified");
      });

      unique.forEach(key => result[key].push(client));
    });

    return result;
  }

  function clientButton(client) {
    return `
      <button
        type="button"
        class="mcn-client client-open"
        data-client-id="${esc(client.id)}"
        data-client-name="${esc(client.name)}"
      >
        <span>${esc(client.name)}</span>
        <span class="mcn-client-arrow">›</span>
      </button>
    `;
  }

  /* ====================================
     PROGRAM CARDS
     ==================================== */

  function programCard(
    title, subtitle, symbol, members, count
  ) {
    return `
      <details class="mcn-program">
        <summary>
          <span class="mcn-symbol">${symbol}</span>

          <span class="mcn-program-text">
            <strong>${esc(title)}</strong>
            <small>${esc(subtitle)}</small>
          </span>

          <span class="mcn-card-end">
            <span class="mcn-assigned">
              <strong>${count}</strong>
              <small>Assigned</small>
            </span>

            <span
              class="mcn-expand-arrow"
              aria-hidden="true"
            >›</span>
          </span>
        </summary>

        <div class="mcn-program-body">
          ${members.length
            ? members.map(clientButton).join("")
            : `
              <p class="mcn-muted">
                ${clientsLoaded && assignmentsLoaded
                  ? "No confirmed assignments yet."
                  : "Checking assignments…"}
              </p>
            `
          }
        </div>
      </details>
    `;
  }

  function renderSummary() {
    const target = $("mcnSummary104705");
    if (!target) return;

    const data = groups();
    const ready =
      clientsLoaded && assignmentsLoaded;

    target.innerHTML = `
      <div class="mcn-kicker">COACH OVERVIEW</div>

      <h2>Your Programs & Clients</h2>

      <p class="mcn-muted">
        Select a program to see its assigned clients.
      </p>

      <div class="mcn-stats">
        <div class="mcn-stat">
          <strong>
            ${clientsLoaded ? clients.length : "—"}
          </strong>
          <span>Client records</span>
        </div>

        <div class="mcn-stat">
          <strong>3</strong>
          <span>Program pathways</span>
        </div>

        <div class="mcn-stat">
          <strong>
            ${assignmentsLoaded
              ? assignments.length : "—"}
          </strong>
          <span>Active assignments</span>
        </div>
      </div>

      ${clientsError || assignmentError ? `
        <p class="mcn-muted">
          ${esc(clientsError || assignmentError)}
        </p>
      ` : ""}

      ${programs.map(p => programCard(
        p[1], p[2], p[3],
        data[p[0]],
        ready ? data[p[0]].length : "—"
      )).join("")}

      ${ready && data.unclassified.length
        ? programCard(
            "Unclassified Program",
            "Assignment awaiting pathway identification",
            "?",
            data.unclassified,
            data.unclassified.length
          ) : ""}

      ${ready && data.unassigned.length
        ? programCard(
            "Unassigned Clients",
            "No active program assignment",
            "○",
            data.unassigned,
            data.unassigned.length
          ) : ""}

      <div class="mcn-actions">
        <button
          type="button"
          data-mcn-route="clients"
        >
          <strong>Manage Clients</strong>
          <small>Open client profiles</small>
        </button>

        <button
          type="button"
          data-mcn-builder="1"
        >
          <strong>Create Program</strong>
          <small>Open Program Builder</small>
        </button>
      </div>
    `;
  }

  function renderClients() {
    const target = $("mcnList104705");
    if (!target) return;

    const query = String(
      $("mcnSearch104705")?.value || ""
    ).toLowerCase().trim();

    const filtered = clients.filter(
      c => c.name.toLowerCase().includes(query)
    );

    target.innerHTML = !clientsLoaded
      ? `<p class="mcn-muted">
          ${esc(clientsError || "Loading clients…")}
         </p>`
      : filtered.length
        ? filtered.map(clientButton).join("")
        : `<p class="mcn-muted">
            No matching clients.
           </p>`;
  }

  /* ====================================
     WORKSPACE VIEWS
     ==================================== */

  function ensureSuite() {
    const home = $(HOME);
    if (!home) return null;

    if ($(SUITE)) return $(SUITE);

    const suite = document.createElement("section");
    suite.id = SUITE;

    suite.innerHTML = `
      <section data-mcn-view="summary">
        <div id="mcnSummary104705"></div>
      </section>

      <section data-mcn-view="clients">
        <div class="mcn-kicker">
          CLIENT MANAGEMENT
        </div>

        <h2>Clients</h2>

        <p class="mcn-muted">
          Search your clients and open their profiles.
        </p>

        <input
          id="mcnSearch104705"
          type="search"
          placeholder="Search clients..."
        >

        <div id="mcnList104705"></div>
      </section>

      <section data-mcn-view="chat">
        <div class="mcn-kicker">
          COACH COMMUNICATION
        </div>

        <h2>Chat</h2>

        <div class="mcn-panel">
          <h3>Coaching Inbox</h3>
          <p class="mcn-muted">
            Client messaging connection pending.
          </p>
          <div class="mcn-notice">
            Conversations will appear when messaging
            has been connected.
          </div>
        </div>
      </section>

      <section data-mcn-view="payments">
        <div class="mcn-kicker">
          MEMBERSHIPS & BILLING
        </div>

        <h2>Payments</h2>

        <div class="mcn-panel">
          <h3>Membership Management</h3>

          <div class="mcn-pay-grid">
            <div>
              <strong>Mana Strength</strong>
              <small>Subscription memberships</small>
            </div>
            <div>
              <strong>Mana28</strong>
              <small>Program payments</small>
            </div>
            <div>
              <strong>ManaLyfe</strong>
              <small>Wellbeing pathway</small>
            </div>
          </div>

          <div class="mcn-notice">
            Stripe connection pending. Payment
            totals will come from actual billing data.
          </div>
        </div>
      </section>

      <section data-mcn-view="settings">
        <div class="mcn-kicker">
          COACH ADMINISTRATION
        </div>

        <h2>Settings</h2>

        <div class="mcn-panel">
          <h3>Coaching Tools</h3>

          <div class="mcn-actions">
            <button type="button"
              data-mcn-builder="1">
              <strong>Program Builder</strong>
              <small>Create and edit programs</small>
            </button>
            <button type="button"
              data-mcn-route="clients">
              <strong>Manage Clients</strong>
              <small>Profiles and assignments</small>
            </button>
          </div>
        </div>
      </section>
    `;

    home.appendChild(suite);

    $("mcnSearch104705")?.addEventListener(
      "input",
      renderClients
    );

    return suite;
  }

  /* ====================================
     NAVIGATION
     ==================================== */

  function updateNav() {
    const nav = $(NAV);
    if (!nav) return;

    tabs.forEach((tab, index) => {
      const button = nav.querySelector(
        `[data-coach-page="${tab[1]}"]`
      );

      if (!button) return;

      button.dataset.mcnTab = tab[0];
      button.style.order = String(index + 1);

      const icon = button.querySelector(
        ".mana-v970-tab-icon"
      );

      if (icon) icon.textContent = tab[3];

      Array.from(button.childNodes)
        .filter(node => node.nodeType === 3)
        .forEach(node => node.textContent = "");

      let label = button.querySelector(
        ".mcn-tab-label"
      );

      if (!label) {
        label = document.createElement("span");
        label.className = "mcn-tab-label";
        button.appendChild(label);
      }

      label.textContent = tab[2];

      button.classList.toggle(
        "active",
        tab[0] === page
      );
    });
  }

  function display() {
    ensureSuite()?.querySelectorAll(
      "[data-mcn-view]"
    ).forEach(view => {
      view.hidden = view.dataset.mcnView !== page;
    });

    $(HOME)?.classList.toggle(
      "mcn-summary-active",
      page === "summary"
    );
  }

  function go(next) {
    if (!coachVisible()) return;

    page = tabs.some(t => t[0] === next)
      ? next : "summary";

    if (
      typeof window.showCoachPage === "function"
    ) {
      window.showCoachPage("home");
    }

    display();
    updateNav();

    if (page === "summary") renderSummary();
    if (page === "clients") renderClients();

    if (
      ["summary", "clients"].includes(page) &&
      !loading
    ) {
      loadData();
    }

    window.scrollTo(0, 0);
  }

  /* ====================================
     STYLES
     ==================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* WHITE LOGOUT / ORANGE BORDER */

      #manaV97CoachLogout {
        color: #FFFFFF !important;
        -webkit-text-fill-color:
          #FFFFFF !important;

        border: 1px solid #FF7927 !important;
        background: #15171A !important;
        box-shadow: none !important;

        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
      }

      /* REMOVE THE OLD 115PX SUMMARY GAP */

      #${HOME}.mcn-summary-active
      > #${HUB} {
        margin-bottom: 10px !important;
        padding-bottom: 0 !important;
      }

      #${HOME}.mcn-summary-active
      > #${HUB} .hub-panel:last-child {
        margin-bottom: 0 !important;
      }

      #${HOME} > #${SUITE} {
        display: block !important;
        width: 100% !important;
        margin: 0 auto 90px !important;
      }

      #${HOME} > :not(#${HUB}):not(#${SUITE}) {
        display: none !important;
      }

      #${HUB} > .hub-panel:not(:first-of-type) {
        display: none !important;
      }

      #${HOME}:not(.mcn-summary-active)
      > #${HUB} {
        display: none !important;
      }

      #${SUITE},
      #${SUITE} * {
        box-sizing: border-box;
      }

      #${SUITE} {
        color: #FFFFFF;
      }

      #${SUITE}
      [data-mcn-view][hidden] {
        display: none !important;
      }

      #${SUITE} [data-mcn-view] {
        max-width: 980px;
        margin: 0 auto;
        padding: 8px 0 20px;
      }

      #${SUITE} .mcn-kicker {
        color: #FF7927;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .1em;
        margin-bottom: 9px;
      }

      #${SUITE} h2 {
        color: #FFFFFF !important;
        font-size: clamp(26px,4vw,35px);
        font-weight: 900;
        margin: 0 0 10px;
      }

      #${SUITE} h3 {
        color: #FFFFFF !important;
        margin: 0 0 12px;
      }

      #${SUITE} .mcn-muted {
        color: #C1C6CE;
        font-size: 13px;
        line-height: 1.5;
      }

      #${SUITE} .mcn-stats {
        display: grid;
        grid-template-columns:
          repeat(3,minmax(0,1fr));
        gap: 10px;
        margin: 18px 0;
      }

      #${SUITE} .mcn-stat,
      #${SUITE} .mcn-panel {
        background: #15171A;
        border: 1px solid #48515B;
        border-radius: 16px;
        padding: 17px;
      }

      #${SUITE} .mcn-stat strong {
        display: block;
        color: #FF7927;
        font-size: 29px;
        font-weight: 900;
      }

      #${SUITE} .mcn-stat span {
        color: #C1C6CE;
        font-size: 11px;
      }

      /* PROGRAM CARDS */

      #${SUITE} .mcn-program {
        background: #15171A;
        border: 1px solid #48515B;
        border-radius: 16px;
        margin: 10px 0;
        overflow: hidden;
      }

      #${SUITE} .mcn-program[open] {
        border-color: #FF7927;
      }

      #${SUITE} .mcn-program summary {
        display: flex !important;
        align-items: center !important;
        gap: 13px;

        padding: 16px;
        cursor: pointer;
        list-style: none;
      }

      #${SUITE} .mcn-program
      summary::-webkit-details-marker {
        display: none;
      }

      #${SUITE} .mcn-symbol {
        display: grid;
        place-items: center;

        flex: 0 0 42px;
        width: 42px;
        height: 42px;

        background: #241910;
        border: 1px solid #FF7927;
        border-radius: 12px;

        color: #FF7927;
        font-size: 22px;
      }

      #${SUITE} .mcn-program-text {
        flex: 1;
        min-width: 0;
      }

      #${SUITE} .mcn-program-text strong {
        display: block;
        color: #FFFFFF !important;
        font-size: 15px;
      }

      #${SUITE} .mcn-program-text small {
        display: block;
        color: #C1C6CE;
        font-size: 11px;
        margin-top: 5px;
      }

      /* COUNT + ORANGE RIGHT ARROW */

      #${SUITE} .mcn-card-end {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 17px;
        margin-left: auto;
      }

      #${SUITE} .mcn-assigned {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 54px;
      }

      #${SUITE} .mcn-assigned strong {
        color: #FF7927 !important;
        font-size: 23px;
        font-weight: 900;
        line-height: 1;
      }

      #${SUITE} .mcn-assigned small {
        color: #C1C6CE;
        font-size: 9px;
        margin-top: 5px;
        text-transform: uppercase;
        letter-spacing: .04em;
      }

      #${SUITE} .mcn-expand-arrow {
        color: #FF7927 !important;
        font-size: 32px;
        font-weight: 700;
        line-height: 1;
        transition: transform .2s ease;
      }

      #${SUITE}
      .mcn-program[open]
      .mcn-expand-arrow {
        transform: rotate(90deg);
      }

      #${SUITE} .mcn-program-body {
        padding: 13px;
        border-top: 1px solid #3B424B;
      }

      #${SUITE} .mcn-client {
        display: flex;
        align-items: center;
        justify-content: space-between;

        width: 100%;
        padding: 14px;
        margin: 0 0 8px;

        background: #101216;
        border: 1px solid #4D5560;
        border-radius: 12px;

        color: #FFFFFF;
        font-size: 13px;
        font-weight: 800;
        text-align: left;
        cursor: pointer;
      }

      #${SUITE} .mcn-client:hover {
        border-color: #FF7927;
      }

      #${SUITE} .mcn-client-arrow {
        color: #FF7927;
        font-size: 23px;
      }

      #${SUITE} .mcn-actions {
        display: grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap: 10px;
        margin: 18px 0;
      }

      #${SUITE} .mcn-actions button {
        padding: 16px;
        background: #191B20;
        border: 1px solid #4E5761;
        border-radius: 14px;
        text-align: left;
        cursor: pointer;
      }

      #${SUITE} .mcn-actions strong,
      #${SUITE} .mcn-pay-grid strong {
        display: block;
        color: #FFFFFF;
        font-size: 13px;
      }

      #${SUITE} .mcn-actions small,
      #${SUITE} .mcn-pay-grid small {
        display: block;
        color: #C1C6CE;
        font-size: 11px;
        margin-top: 5px;
      }

      #${SUITE} #mcnSearch104705 {
        width: 100%;
        padding: 14px;
        margin: 16px 0;

        color: #FFFFFF;
        background: #15171A;

        border: 1px solid #535C68;
        border-radius: 12px;
        font-size: 14px;
      }

      #${SUITE} .mcn-notice {
        padding: 16px;
        margin-top: 17px;

        background: #111317;
        border: 1px solid #FF7927;
        border-radius: 12px;

        color: #C1C6CE;
        font-size: 13px;
      }

      #${SUITE} .mcn-pay-grid {
        display: grid;
        grid-template-columns:
          repeat(3,minmax(0,1fr));
        gap: 10px;
        margin: 18px 0;
      }

      #${SUITE} .mcn-pay-grid > div {
        padding: 15px;
        background: #101216;
        border: 1px solid #444C55;
        border-radius: 12px;
      }

      /* COACH HUB BOTTOM NAVIGATION */

      #${NAV} .mana-v970-nav-inner {
        display: grid !important;
        grid-template-columns:
          repeat(5,minmax(0,1fr)) !important;
        gap: 7px !important;
      }

      #${NAV} .mana-v970-tab {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;

        min-width: 0 !important;
        min-height: 62px !important;
        padding: 8px 3px !important;

        background: #15171A !important;
        border: 1px solid #414750 !important;
        border-radius: 13px !important;

        color: #C1C6CE !important;
        font-size: 0 !important;
      }

      #${NAV} .mana-v970-tab-icon {
        display: block !important;
        color: inherit !important;
        font-size: 20px !important;
        margin-bottom: 6px !important;
      }

      #${NAV} .mcn-tab-label {
        display: block !important;
        color: inherit !important;
        font-size: 11px !important;
        font-weight: 850 !important;
      }

      #${NAV} .mana-v970-tab.active {
        background: #321D12 !important;
        border-color: #FF7927 !important;
        color: #FF7927 !important;
      }

      @media(max-width:600px) {
        #${SUITE} .mcn-stats,
        #${SUITE} .mcn-pay-grid {
          gap: 6px;
        }

        #${SUITE} .mcn-stat {
          padding: 11px;
        }

        #${SUITE} .mcn-card-end {
          gap: 9px;
        }

        #${SUITE} .mcn-assigned {
          min-width: 43px;
        }

        #${SUITE} .mcn-expand-arrow {
          font-size: 27px;
        }

        #${SUITE} .mcn-actions {
          grid-template-columns: 1fr;
        }

        #${NAV} .mcn-tab-label {
          font-size: 10px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ====================================
     EVENTS
     ==================================== */

  function handleClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const nav = target.closest(
      `#${NAV} [data-coach-page]`
    );

    if (nav && coachVisible()) {
      const tab = tabs.find(
        t => t[0] === nav.dataset.mcnTab
      );

      if (!tab) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      go(tab[0]);
      return;
    }

    const route = target.closest(
      "[data-mcn-route]"
    );

    if (route && coachVisible()) {
      event.preventDefault();
      go(route.dataset.mcnRoute);
      return;
    }

    const builder = target.closest(
      "[data-mcn-builder]"
    );

    if (builder && coachVisible()) {
      event.preventDefault();

      if (
        typeof window.openManaProgramBuilder ===
        "function"
      ) {
        window.openManaProgramBuilder();
      }
    }

    /* Original .client-open handler
       continues to open client profiles. */
  }

  function checkWorkspace() {
    const visible = coachVisible();

    if (visible && !coachWasVisible) {
      coachWasVisible = true;
      page = "summary";
      display();
      updateNav();
      loadData();
    } else if (!visible) {
      coachWasVisible = false;
    }
  }

  function init() {
    installStyles();
    ensureSuite();
    display();
    updateNav();

    document.addEventListener(
      "click",
      handleClick,
      true
    );

    const coach = $("coachView");

    if (coach) {
      new MutationObserver(
        checkWorkspace
      ).observe(coach, {
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    window.addEventListener(
      "pageshow",
      () => {
        checkWorkspace();
        if (coachVisible()) loadData();
      }
    );

    checkWorkspace();

    console.log(
      "[Mana Movement] Coach Hub " + BUILD
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
