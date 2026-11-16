
/* =========================================================
   MANA MOVEMENT — COACH HUB
   BUILD 104703

   COMPLETE REPLACEMENT:
   mana_coach_navigation_104700.js

   FIXES
   - Missing Summary program cards
   - Blank Payments and Chat pages
   - Client directory profile links
   - Five correctly ordered Coach Hub tabs
   - Duplicate Programs / Quick Actions sections
   - Legacy dashboard CSS hiding new content

   PRESERVES
   - Existing client profiles and Coach Hub data
   - Supabase program assignments
   - Program Builder
   - Coach / Client workspace switch
   - Mana Strength, Mana28 and ManaLyfe
   - Workout history and Circuits

   No database changes.
   ========================================================= */

(() => {
  "use strict";

  const BUILD = "104703";
  const FLAG = "MANA_COACH_NAV_104703";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  const HOME = "coachHomePage";
  const NAV = "manaV97CoachNav";
  const SUITE = "manaCoachSuite104703";
  const STYLE = "manaCoachSuiteStyle104703";

  let page = "summary";
  let clients = [];
  let assignments = [];
  let assignedLoaded = false;
  let assignmentError = "";
  let refreshing = false;
  let request = 0;

  const tabs = [
    { key: "summary", route: "home", label: "Summary", icon: "▦" },
    { key: "clients", route: "fuel", label: "Clients", icon: "♙" },
    { key: "chat", route: "progress", label: "Chat", icon: "☏" },
    { key: "payments", route: "programs", label: "Payments", icon: "▤" },
    { key: "settings", route: "profile", label: "Settings", icon: "⚙" }
  ];

  const pathways = [
    {
      key: "strength",
      title: "Mana Strength",
      subtitle: "Strength & performance",
      icon: "◆"
    },
    {
      key: "mana28",
      title: "Mana28",
      subtitle: "28-day training",
      icon: "▦"
    },
    {
      key: "lyfe",
      title: "ManaLyfe",
      subtitle: "Lifestyle & wellbeing",
      icon: "♡"
    }
  ];

  function esc(value) {
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

  function coachVisible() {
    const view = $("coachView");
    const detail = $("coachClientDetailView");

    return Boolean(
      (view && !view.classList.contains("hide")) ||
      (detail && !detail.classList.contains("hide"))
    );
  }

  /* =============================================
     EXISTING CLIENT ACCOUNTS
     ============================================= */

  function readClients() {
    const source = $("coachClientsCard");
    const map = new Map();

    if (source) {
      source.querySelectorAll(
        ".client-open[data-client-id]"
      ).forEach(button => {
        const id = String(
          button.dataset.clientId || ""
        ).trim();

        if (!id || map.has(id)) return;

        const name = String(
          button.dataset.clientName ||
          button.querySelector("strong")?.textContent ||
          "Client"
        ).trim();

        map.set(id, { id, name });
      });
    }

    clients = [...map.values()].sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }

  function pathwayKey(name) {
    const value = String(name || "")
      .toLowerCase()
      .replace(/[\s_-]/g, "");

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

  async function loadAssignments() {
    const token = ++request;

    try {
      if (
        typeof window.supabaseClient !== "function"
      ) {
        throw new Error("Cloud connection unavailable");
      }

      const db = await window.supabaseClient();

      const auth = await db.auth.getUser();
      const user = auth.data?.user;

      if (!user || auth.error) {
        throw new Error("Coach sign-in required");
      }

      const profile = await db
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (
        profile.error ||
        profile.data?.role !== "coach"
      ) {
        throw new Error("Coach access required");
      }

      const result = await db
        .from("client_program_assignments")
        .select(
          "client_id,status,custom_programs(name)"
        )
        .eq("coach_id", user.id)
        .eq("status", "active");

      if (result.error) throw result.error;
      if (token !== request) return;

      assignments = result.data || [];
      assignedLoaded = true;
      assignmentError = "";

    } catch (error) {
      if (token !== request) return;

      assignments = [];
      assignedLoaded = false;
      assignmentError =
        error?.message || "Assignments unavailable";

      console.warn(
        "[Mana Coach] Assignments:",
        error
      );
    }

    renderSummary();
  }

  function assignedGroups() {
    const groups = {
      strength: [],
      mana28: [],
      lyfe: [],
      unclassified: [],
      unassigned: []
    };

    clients.forEach(client => {
      if (!assignedLoaded) return;

      const saved = assignments.filter(
        item => item.client_id === client.id
      );

      if (!saved.length) {
        groups.unassigned.push(client);
        return;
      }

      const keys = new Set();

      saved.forEach(item => {
        const program = item.custom_programs;
        const name = Array.isArray(program)
          ? program[0]?.name
          : program?.name;

        const key = pathwayKey(name);

        if (key) keys.add(key);
        else keys.add("unclassified");
      });

      keys.forEach(key => {
        groups[key]?.push(client);
      });
    });

    return groups;
  }

  /* =============================================
     ONE COACH WORKSPACE CONTAINER

     All five tabs use the Coach Home route.
     This avoids competing legacy page layouts.
     ============================================= */

  function ensureSuite() {
    const home = $(HOME);
    if (!home) return null;

    let suite = $(SUITE);

    if (!suite) {
      suite = document.createElement("section");
      suite.id = SUITE;

      suite.innerHTML = `
        <section data-mcn-view="summary">
          <div id="mcnSummaryContent104703"></div>
        </section>

        <section data-mcn-view="clients">
          <div class="mcn-kicker">
            MANA MOVEMENT · CLIENT MANAGEMENT
          </div>

          <h2>Clients</h2>

          <p class="mcn-muted">
            Search and open your existing coaching profiles.
          </p>

          <input
            id="mcnSearch104703"
            type="search"
            placeholder="Search clients..."
            aria-label="Search clients"
          >

          <div id="mcnClientList104703"></div>
        </section>

        <section data-mcn-view="chat">
          <div class="mcn-kicker">
            COACH COMMUNICATION
          </div>

          <h2>Chat</h2>

          <div class="mcn-panel">
            <h3>Coaching Inbox</h3>

            <p class="mcn-muted">
              A dedicated space for coach and client
              messages, questions and support.
            </p>

            <div class="mcn-notice">
              Messaging connection pending.
              No conversations are displayed until
              the Coach Hub inbox is connected.
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

            <p class="mcn-muted">
              Manage memberships for Mana Strength,
              Mana28 and ManaLyfe.
            </p>

            <div class="mcn-pay-grid">
              <div>
                <strong>Mana Strength</strong>
                <small>Membership billing</small>
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
              Stripe payments dashboard not yet connected.
              No revenue or payment totals are being
              estimated.
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
                <small>Create and edit saved programs</small>
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

      $("mcnSearch104703")?.addEventListener(
        "input",
        renderClients
      );
    }

    return suite;
  }

  function clientButton(client) {
    /* Use the original native class and attributes.
       Existing client-profile listeners handle clicks. */

    return `
      <button
        type="button"
        class="mcn-client client-open"
        data-client-id="${esc(client.id)}"
        data-client-name="${esc(client.name)}"
      >
        <span>${esc(client.name)}</span>
        <span class="mcn-chevron">›</span>
      </button>
    `;
  }

  /* =============================================
     SUMMARY PROGRAMS
     ============================================= */

  function renderSummary() {
    const target = $("mcnSummaryContent104703");
    if (!target) return;

    readClients();

    const groups = assignedGroups();

    target.innerHTML = `
      <div class="mcn-kicker">
        COACH OVERVIEW
      </div>

      <h2>Your Programs & Clients</h2>

      <p class="mcn-muted">
        Active assignments grouped by Mana pathway.
        Select a program to see its clients.
      </p>

      <div class="mcn-stats">
        <div class="mcn-stat">
          <strong>${clients.length}</strong>
          <span>Client records</span>
        </div>

        <div class="mcn-stat">
          <strong>3</strong>
          <span>Program pathways</span>
        </div>

        <div class="mcn-stat">
          <strong>
            ${assignedLoaded
              ? assignments.length
              : "—"}
          </strong>
          <span>Active assignments</span>
        </div>
      </div>

      ${assignmentError ? `
        <p class="mcn-muted">
          ${esc(assignmentError)}
        </p>
      ` : ""}

      ${pathways.map(program => {
        const members = groups[program.key];

        return `
          <details class="mcn-program">
            <summary>
              <span class="mcn-program-icon">
                ${program.icon}
              </span>

              <span class="mcn-program-info">
                <strong>${program.title}</strong>
                <small>${program.subtitle}</small>
              </span>

              <span class="mcn-program-count">
                ${assignedLoaded
                  ? members.length
                  : "—"}
              </span>
            </summary>

            <div class="mcn-program-body">
              ${members.length
                ? members.map(clientButton).join("")
                : `
                  <p class="mcn-muted">
                    ${assignedLoaded
                      ? "No confirmed assignments."
                      : "Checking program assignments…"}
                  </p>
                `
              }
            </div>
          </details>
        `;
      }).join("")}

      ${assignedLoaded &&
        groups.unclassified.length ? `
        <details class="mcn-program">
          <summary>
            <span class="mcn-program-icon">?</span>

            <span class="mcn-program-info">
              <strong>Unclassified Program</strong>
              <small>
                Assigned program has no confirmed
                Mana pathway label
              </small>
            </span>

            <span class="mcn-program-count">
              ${groups.unclassified.length}
            </span>
          </summary>

          <div class="mcn-program-body">
            ${groups.unclassified.map(
              clientButton
            ).join("")}
          </div>
        </details>
      ` : ""}

      ${assignedLoaded &&
        groups.unassigned.length ? `
        <details class="mcn-program">
          <summary>
            <span class="mcn-program-icon">○</span>

            <span class="mcn-program-info">
              <strong>Unassigned Clients</strong>
              <small>No active program assignment</small>
            </span>

            <span class="mcn-program-count">
              ${groups.unassigned.length}
            </span>
          </summary>

          <div class="mcn-program-body">
            ${groups.unassigned.map(
              clientButton
            ).join("")}
          </div>
        </details>
      ` : ""}

      <div class="mcn-actions">
        <button type="button"
          data-mcn-route="clients">
          <strong>Manage Clients</strong>
          <small>Open coaching profiles</small>
        </button>

        <button type="button"
          data-mcn-builder="1">
          <strong>Create Program</strong>
          <small>Launch the Program Builder</small>
        </button>
      </div>
    `;
  }

  /* =============================================
     CLIENT DIRECTORY
     ============================================= */

  function renderClients() {
    const target = $("mcnClientList104703");
    if (!target) return;

    readClients();

    const query = String(
      $("mcnSearch104703")?.value || ""
    ).trim().toLowerCase();

    const filtered = clients.filter(
      client => client.name.toLowerCase()
        .includes(query)
    );

    target.innerHTML = filtered.length
      ? filtered.map(clientButton).join("")
      : `
        <div class="mcn-notice">
          ${clients.length
            ? "No matching clients."
            : "No client records loaded."}
        </div>
      `;
  }

  /* =============================================
     NAVIGATION

     Keep original buttons and handlers,
     but intercept navigation before the
     legacy Coach Shell changes pages.
     ============================================= */

  function updateNav() {
    const nav = $(NAV);
    if (!nav) return;

    tabs.forEach((tab, index) => {
      const button = nav.querySelector(
        `[data-coach-page="${tab.route}"]`
      );

      if (!button) return;

      button.dataset.mcnTab = tab.key;
      button.style.order = String(index + 1);

      let icon = button.querySelector(
        ".mana-v970-tab-icon"
      );

      if (!icon) {
        icon = document.createElement("span");
        icon.className = "mana-v970-tab-icon";
        button.prepend(icon);
      }

      icon.textContent = tab.icon;

      Array.from(button.childNodes)
        .filter(node => node.nodeType === 3)
        .forEach(node => {
          node.textContent = "";
        });

      let label = button.querySelector(
        ".mcn-tab-label"
      );

      if (!label) {
        label = document.createElement("span");
        label.className = "mcn-tab-label";
        button.appendChild(label);
      }

      label.textContent = tab.label;

      button.classList.toggle(
        "active",
        tab.key === page
      );
    });
  }

  function display(pageName) {
    const suite = ensureSuite();
    if (!suite) return;

    suite.querySelectorAll(
      "[data-mcn-view]"
    ).forEach(view => {
      view.hidden =
        view.dataset.mcnView !== pageName;
    });

    $(HOME)?.classList.toggle(
      "mcn-summary-active",
      pageName === "summary"
    );
  }

  function go(targetPage) {
    if (!coachVisible()) return;

    page = tabs.some(
      tab => tab.key === targetPage
    ) ? targetPage : "summary";

    /* All five views live inside Coach Home.
       This prevents legacy Pages from
       hiding Payments and Chat. */

    if (
      typeof window.showCoachPage === "function"
    ) {
      window.showCoachPage("home");
    }

    ensureSuite();
    display(page);
    updateNav();

    if (page === "summary") {
      renderSummary();
      if (!assignedLoaded) {
        loadAssignments();
      }
    }

    if (page === "clients") {
      renderClients();
    }

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }

  function openBuilder() {
    if (
      typeof window.openManaProgramBuilder ===
      "function"
    ) {
      window.openManaProgramBuilder();
    } else {
      window.alert(
        "Program Builder is not available."
      );
    }
  }

  /* =============================================
     PREMIUM STYLING
     ============================================= */

  function styles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* Undo the old Coach Hub rule that
         hides all new direct children. */

      #${HOME} > #${SUITE} {
        display: block !important;
        width: 100% !important;
        margin: 0 auto 115px !important;
      }

      /* Hide obsolete original Home cards.
         Keep the existing Coach Hub header
         and Needs Your Attention section. */

      #${HOME} > :not(
        #manaCoachHubClean103760
      ):not(#${SUITE}) {
        display: none !important;
      }

      #manaCoachHubClean103760
      > .hub-panel:not(:first-of-type) {
        display: none !important;
      }

      #${HOME}:not(.mcn-summary-active)
      > #manaCoachHubClean103760 {
        display: none !important;
      }

      #${SUITE} {
        color: #FFFFFF;
        font-family: inherit;
      }

      #${SUITE} * {
        box-sizing: border-box;
      }

      #${SUITE}
      [data-mcn-view][hidden] {
        display: none !important;
      }

      #${SUITE}
      [data-mcn-view] {
        max-width: 980px;
        margin: 0 auto;
        padding: 14px 0 20px;
      }

      #${SUITE} .mcn-kicker {
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .1em;
        color: #FF7927;
        margin-bottom: 9px;
      }

      #${SUITE} h2 {
        font-size: clamp(26px,4vw,35px);
        color: #FFFFFF !important;
        margin: 0 0 10px;
        font-weight: 900;
      }

      #${SUITE} h3 {
        color: #FFFFFF !important;
        font-size: 19px;
        margin: 0 0 12px;
      }

      #${SUITE} .mcn-muted {
        color: #C1C6CE !important;
        font-size: 13px;
        line-height: 1.55;
      }

      #${SUITE} .mcn-stats {
        display: grid;
        grid-template-columns:
          repeat(3,minmax(0,1fr));
        gap: 10px;
        margin: 20px 0;
      }

      #${SUITE} .mcn-stat,
      #${SUITE} .mcn-panel {
        background: #15171A;
        border: 1px solid #48515B;
        border-radius: 16px;
        padding: 18px;
      }

      #${SUITE} .mcn-stat strong {
        display: block;
        color: #FF7927;
        font-size: 29px;
        font-weight: 900;
      }

      #${SUITE} .mcn-stat span {
        display: block;
        color: #C1C6CE;
        font-size: 11px;
      }

      #${SUITE} .mcn-program {
        margin: 10px 0;
        background: #15171A;
        border: 1px solid #48515B;
        border-radius: 16px;
        overflow: hidden;
      }

      #${SUITE} .mcn-program[open] {
        border-color: #FF7927;
      }

      #${SUITE} .mcn-program summary {
        display: flex;
        align-items: center;
        gap: 13px;
        padding: 16px;
        list-style: none;
        cursor: pointer;
      }

      #${SUITE} .mcn-program
      summary::-webkit-details-marker {
        display: none;
      }

      #${SUITE} .mcn-program-icon {
        display: grid;
        place-items: center;

        flex: 0 0 42px;
        width: 42px;
        height: 42px;

        background: #221710;
        border: 1px solid #FF7927;
        border-radius: 12px;

        color: #FF7927;
        font-size: 23px;
      }

      #${SUITE} .mcn-program-info {
        flex: 1;
        min-width: 0;
      }

      #${SUITE} .mcn-program-info strong {
        display: block;
        color: #FFFFFF;
        font-size: 15px;
      }

      #${SUITE} .mcn-program-info small {
        display: block;
        color: #C1C6CE;
        font-size: 11px;
        margin-top: 5px;
      }

      #${SUITE} .mcn-program-count {
        color: #FF7927;
        font-size: 22px;
        font-weight: 900;
      }

      #${SUITE} .mcn-program-body {
        padding: 13px;
        border-top: 1px solid #3B424B;
      }

      #${SUITE} .mcn-client {
        display: flex;
        justify-content: space-between;
        align-items: center;

        width: 100%;
        padding: 14px;
        margin: 0 0 8px;

        background: #101216;
        color: #FFFFFF;

        border: 1px solid #4D5560;
        border-radius: 12px;

        text-align: left;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
      }

      #${SUITE} .mcn-client:hover {
        border-color: #FF7927;
      }

      #${SUITE} .mcn-chevron {
        color: #FF7927;
        font-size: 23px;
      }

      #${SUITE} .mcn-actions {
        display: grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap: 10px;
        margin: 20px 0;
      }

      #${SUITE} .mcn-actions button {
        padding: 16px;
        text-align: left;

        background: #191B20;
        border: 1px solid #4E5761;
        border-radius: 14px;
        cursor: pointer;
      }

      #${SUITE} .mcn-actions strong {
        display: block;
        color: #FFFFFF;
        font-size: 13px;
      }

      #${SUITE} .mcn-actions small {
        display: block;
        color: #C1C6CE;
        font-size: 11px;
        margin-top: 5px;
      }

      #${SUITE} #mcnSearch104703 {
        width: 100%;
        padding: 14px;
        margin: 16px 0;

        background: #15171A;
        color: #FFFFFF;

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
        line-height: 1.6;
      }

      #${SUITE} .mcn-pay-grid {
        display: grid;
        grid-template-columns:
          repeat(3,minmax(0,1fr));
        gap: 10px;
        margin-top: 18px;
      }

      #${SUITE} .mcn-pay-grid > div {
        padding: 15px;
        border: 1px solid #444C55;
        border-radius: 12px;
        background: #101216;
      }

      #${SUITE} .mcn-pay-grid strong {
        display: block;
        color: #FFFFFF;
        font-size: 13px;
      }

      #${SUITE} .mcn-pay-grid small {
        display: block;
        color: #C1C6CE;
        font-size: 11px;
        margin-top: 6px;
      }

      /* Five bottom Coach Hub tabs */

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
        -webkit-text-fill-color:
          #C1C6CE !important;

        font-size: 0 !important;
      }

      #${NAV} .mana-v970-tab-icon {
        display: block !important;
        font-size: 20px !important;
        color: inherit !important;
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
        -webkit-text-fill-color:
          #FF7927 !important;
      }

      @media(max-width:600px) {
        #${SUITE} .mcn-stats,
        #${SUITE} .mcn-pay-grid {
          gap: 6px;
        }

        #${SUITE} .mcn-stat,
        #${SUITE} .mcn-pay-grid > div {
          padding: 11px;
        }

        #${SUITE} .mcn-stat strong {
          font-size: 24px;
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

  /* =============================================
     EVENTS
     ============================================= */

  function click(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const navButton = target.closest(
      `#${NAV} [data-coach-page]`
    );

    if (navButton && coachVisible()) {
      const tab = tabs.find(
        item => item.key ===
          navButton.dataset.mcnTab
      );

      if (!tab) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      go(tab.key);
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
      openBuilder();
    }

    /* Client buttons are intentionally
       NOT intercepted here.
       Original .client-open handler opens
       their existing coaching profiles. */
  }

  function refresh() {
    if (!coachVisible()) return;

    ensureSuite();
    updateNav();

    if (page === "summary") {
      renderSummary();
    }

    if (page === "clients") {
      renderClients();
    }
  }

  function scheduleRefresh() {
    if (refreshing) return;
    refreshing = true;

    requestAnimationFrame(() => {
      refreshing = false;
      refresh();
    });
  }

  function init() {
    styles();

    ensureSuite();
    display(page);
    updateNav();

    document.addEventListener(
      "click",
      click,
      true
    );

    const coach = $("coachView");

    if (coach) {
      new MutationObserver(() => {
        if (coachVisible()) {
          scheduleRefresh();
        }
      }).observe(coach, {
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    window.addEventListener(
      "pageshow",
      scheduleRefresh
    );

    [250, 850, 1800].forEach(delay => {
      setTimeout(() => {
        if (!coachVisible()) return;

        readClients();
        renderSummary();
        renderClients();

        if (!assignedLoaded) {
          loadAssignments();
        }

        updateNav();
      }, delay);
    });

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
