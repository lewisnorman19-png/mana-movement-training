
/* =====================================================
   MANA MOVEMENT — COACH HUB
   BUILD 104704 — LIVE CLIENT DATA FIX

   COMPLETE REPLACEMENT:
   mana_coach_navigation_104700.js

   - Real client list from coach_clients_summary RPC
   - Actual program assignments from Supabase
   - Expandable Mana Strength / Mana28 / ManaLyfe
   - Unclassified and Unassigned clients
   - Functional client profile links
   - Summary / Clients / Chat / Payments / Settings
   - No competing navigation or database changes
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104704";
  const FLAG = "MANA_COACH_NAV_104704";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  const HOME = "coachHomePage";
  const NAV = "manaV97CoachNav";
  const HUB = "manaCoachHubClean103760";
  const SUITE = "manaCoachSuite104704";
  const STYLE = "manaCoachSuiteStyle104704";

  let page = "summary";
  let clients = [];
  let assignments = [];

  let clientsLoaded = false;
  let assignmentsLoaded = false;
  let clientsError = "";
  let assignmentsError = "";

  let loading = false;
  let requestNumber = 0;
  let coachWasVisible = false;

  const tabs = [
    ["summary", "home", "Summary", "▦"],
    ["clients", "fuel", "Clients", "♙"],
    ["chat", "progress", "Chat", "☏"],
    ["payments", "programs", "Payments", "▤"],
    ["settings", "profile", "Settings", "⚙"]
  ];

  const pathways = [
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
    const view = $("coachView");
    return Boolean(
      view &&
      !view.classList.contains("hide")
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

  /* ========================================
     LIVE CLIENT DATA

     Uses the exact RPC already used by
     the original Coach Hub dashboard.
     ======================================== */

  async function loadData() {
    if (loading || !coachVisible()) return;

    loading = true;
    const ticket = ++requestNumber;

    try {
      if (
        typeof window.supabaseClient !== "function"
      ) {
        throw new Error("Cloud connection unavailable");
      }

      const db = await window.supabaseClient();

      const auth = await db.auth.getUser();
      const user = auth.data?.user;

      if (auth.error || !user) {
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

      const [clientResult, assignmentResult] =
        await Promise.allSettled([
          db.rpc("coach_clients_summary"),
          db.from("client_program_assignments")
            .select(
              "client_id,status,custom_programs(name)"
            )
            .eq("coach_id", user.id)
            .eq("status", "active")
        ]);

      if (ticket !== requestNumber) return;

      if (clientResult.status === "fulfilled") {
        const result = clientResult.value;

        if (result.error) {
          clientsLoaded = false;
          clientsError = result.error.message;
        } else {
          const unique = new Map();

          (result.data || []).forEach(row => {
            const id = String(
              row.user_id || ""
            ).trim();

            if (!id || unique.has(id)) return;

            unique.set(id, {
              id,
              name: String(
                row.full_name || "Client"
              ).trim()
            });
          });

          clients = [...unique.values()].sort(
            (a, b) => a.name.localeCompare(b.name)
          );

          clientsLoaded = true;
          clientsError = "";
        }
      } else {
        clientsLoaded = false;
        clientsError = "Could not load clients";
      }

      if (assignmentResult.status === "fulfilled") {
        const result = assignmentResult.value;

        if (result.error) {
          assignmentsLoaded = false;
          assignmentsError = result.error.message;
        } else {
          assignments = result.data || [];
          assignmentsLoaded = true;
          assignmentsError = "";
        }
      } else {
        assignmentsLoaded = false;
        assignmentsError =
          "Could not load program assignments";
      }

    } catch (error) {
      console.warn(
        "[Mana Coach] Dashboard:",
        error
      );

      clientsLoaded = false;
      assignmentsLoaded = false;
      clientsError =
        error?.message || "Cloud connection unavailable";
      assignmentsError = clientsError;

    } finally {
      loading = false;

      if (ticket === requestNumber) {
        renderSummary();
        renderClients();
      }
    }
  }

  function groupedClients() {
    const groups = {
      strength: [],
      mana28: [],
      lyfe: [],
      unclassified: [],
      unassigned: []
    };

    if (!clientsLoaded || !assignmentsLoaded) {
      return groups;
    }

    clients.forEach(client => {
      const records = assignments.filter(
        item => item.client_id === client.id
      );

      if (!records.length) {
        groups.unassigned.push(client);
        return;
      }

      const keys = new Set();

      records.forEach(item => {
        const program = item.custom_programs;

        const name = Array.isArray(program)
          ? program[0]?.name
          : program?.name;

        keys.add(pathwayKey(name) || "unclassified");
      });

      keys.forEach(key => {
        groups[key].push(client);
      });
    });

    return groups;
  }

  /* ========================================
     THE FIVE VIEWS LIVE IN ONE CONTAINER

     Avoids the original app hiding Chat
     and Payments on legacy page routes.
     ======================================== */

  function ensureSuite() {
    const home = $(HOME);
    if (!home) return null;

    let suite = $(SUITE);

    if (suite) return suite;

    suite = document.createElement("section");
    suite.id = SUITE;

    suite.innerHTML = `
      <section data-mcn-view="summary">
        <div id="mcnSummary104704"></div>
      </section>

      <section data-mcn-view="clients">
        <div class="mcn-kicker">
          MANA MOVEMENT · CLIENT MANAGEMENT
        </div>

        <h2>Clients</h2>

        <p class="mcn-muted">
          Search your clients and open their
          existing coaching profiles.
        </p>

        <input
          id="mcnSearch104704"
          type="search"
          placeholder="Search clients..."
          aria-label="Search clients"
        >

        <div id="mcnList104704"></div>
      </section>

      <section data-mcn-view="chat">
        <div class="mcn-kicker">
          COACH COMMUNICATION
        </div>

        <h2>Chat</h2>

        <div class="mcn-panel">
          <h3>Coaching Inbox</h3>

          <p class="mcn-muted">
            Your client conversations and
            coaching messages will appear here.
          </p>

          <div class="mcn-notice">
            Messaging connection pending.
            No messages are being invented.
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
              <small>Membership subscriptions</small>
            </div>

            <div>
              <strong>Mana28</strong>
              <small>Program payments</small>
            </div>

            <div>
              <strong>ManaLyfe</strong>
              <small>Wellbeing memberships</small>
            </div>
          </div>

          <div class="mcn-notice">
            Stripe billing dashboard is not yet
            connected. Revenue and payment
            totals will appear only after
            the real billing integration.
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

    $("mcnSearch104704")?.addEventListener(
      "input",
      renderClients
    );

    return suite;
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
        <span class="mcn-chevron">›</span>
      </button>
    `;
  }

  /* ========================================
     SUMMARY PROGRAM GROUPS
     ======================================== */

  function groupCard(
    title,
    subtitle,
    icon,
    members,
    count
  ) {
    return `
      <details class="mcn-program">
        <summary>
          <span class="mcn-program-icon">
            ${icon}
          </span>

          <span class="mcn-program-info">
            <strong>${esc(title)}</strong>
            <small>${esc(subtitle)}</small>
          </span>

          <span class="mcn-program-count">
            ${count}
          </span>
        </summary>

        <div class="mcn-program-body">
          ${members.length
            ? members.map(clientButton).join("")
            : `
              <p class="mcn-muted">
                ${assignmentsLoaded && clientsLoaded
                  ? "No confirmed clients yet."
                  : "Client assignments unavailable."}
              </p>
            `
          }
        </div>
      </details>
    `;
  }

  function renderSummary() {
    const target = $("mcnSummary104704");
    if (!target) return;

    const groups = groupedClients();
    const ready =
      clientsLoaded && assignmentsLoaded;

    const displayCount = key =>
      ready ? groups[key].length : "—";

    target.innerHTML = `
      <div class="mcn-kicker">
        COACH OVERVIEW
      </div>

      <h2>Your Programs & Clients</h2>

      <p class="mcn-muted">
        Confirmed assignments grouped by Mana pathway.
        Select a program to view its clients.
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

      ${clientsError || assignmentsError ? `
        <p class="mcn-muted">
          ${esc(clientsError || assignmentsError)}
        </p>
      ` : ""}

      ${pathways.map(program =>
        groupCard(
          program[1],
          program[2],
          program[3],
          groups[program[0]],
          displayCount(program[0])
        )
      ).join("")}

      ${ready && groups.unclassified.length
        ? groupCard(
            "Unclassified Program",
            "Saved program awaiting a Mana pathway label",
            "?",
            groups.unclassified,
            groups.unclassified.length
          )
        : ""
      }

      ${ready && groups.unassigned.length
        ? groupCard(
            "Unassigned Clients",
            "No active program assignment",
            "○",
            groups.unassigned,
            groups.unassigned.length
          )
        : ""
      }

      <div class="mcn-actions">
        <button
          type="button"
          data-mcn-route="clients"
        >
          <strong>Manage Clients</strong>
          <small>Open coaching profiles</small>
        </button>

        <button
          type="button"
          data-mcn-builder="1"
        >
          <strong>Create Program</strong>
          <small>Launch Program Builder</small>
        </button>
      </div>
    `;
  }

  /* ========================================
     CLIENT DIRECTORY
     ======================================== */

  function renderClients() {
    const target = $("mcnList104704");
    if (!target) return;

    const search = String(
      $("mcnSearch104704")?.value || ""
    ).trim().toLowerCase();

    const shown = clients.filter(
      client =>
        client.name.toLowerCase().includes(search)
    );

    if (!clientsLoaded) {
      target.innerHTML = `
        <div class="mcn-notice">
          ${esc(clientsError ||
            "Loading client records…")}
        </div>
      `;
      return;
    }

    target.innerHTML = shown.length
      ? shown.map(clientButton).join("")
      : `
        <div class="mcn-notice">
          ${clients.length
            ? "No matching clients."
            : "No client accounts found."}
        </div>
      `;
  }

  /* ========================================
     COACH NAVIGATION
     ======================================== */

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

      let icon = button.querySelector(
        ".mana-v970-tab-icon"
      );

      if (!icon) {
        icon = document.createElement("span");
        icon.className = "mana-v970-tab-icon";
        button.prepend(icon);
      }

      if (icon.textContent !== tab[3]) {
        icon.textContent = tab[3];
      }

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

      label.textContent = tab[2];

      button.classList.toggle(
        "active",
        tab[0] === page
      );
    });
  }

  function display() {
    const suite = ensureSuite();
    if (!suite) return;

    suite.querySelectorAll(
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

    page = tabs.some(
      tab => tab[0] === next
    ) ? next : "summary";

    if (
      typeof window.showCoachPage === "function"
    ) {
      window.showCoachPage("home");
    }

    display();
    updateNav();

    if (page === "summary") {
      renderSummary();
    }

    if (page === "clients") {
      renderClients();
    }

    if (
      (page === "summary" || page === "clients") &&
      !loading
    ) {
      loadData();
    }

    window.scrollTo(0, 0);
  }

  /* ========================================
     STYLES
     ======================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `
      /* Override legacy Coach Hub
         direct-child hiding rule. */

      #${HOME} > #${SUITE} {
        display: block !important;
        width: 100% !important;
        margin: 0 auto 115px !important;
      }

      #${HOME} > :not(#${HUB}):not(#${SUITE}) {
        display: none !important;
      }

      /* Keep original Coach Hub header and
         Needs Your Attention, not duplicate
         Programs / Quick Actions sections. */

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

      #${SUITE} [data-mcn-view][hidden] {
        display: none !important;
      }

      #${SUITE} [data-mcn-view] {
        max-width: 980px;
        margin: 0 auto;
        padding: 14px 0 22px;
      }

      #${SUITE} .mcn-kicker {
        color: #FF7927;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .1em;
        margin-bottom: 10px;
      }

      #${SUITE} h2 {
        color: #FFFFFF !important;
        font-size: clamp(26px,4vw,35px);
        font-weight: 900;
        margin: 0 0 12px;
      }

      #${SUITE} h3 {
        color: #FFFFFF !important;
        margin: 0 0 12px;
      }

      #${SUITE} .mcn-muted {
        color: #C1C6CE;
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
        padding: 18px;
        background: #15171A;
        border: 1px solid #48515B;
        border-radius: 16px;
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
        cursor: pointer;
        list-style: none;
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
        margin-top: 6px;
      }

      #${SUITE} #mcnSearch104704 {
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
        margin: 18px 0;
      }

      #${SUITE} .mcn-pay-grid > div {
        padding: 15px;
        border: 1px solid #444C55;
        border-radius: 12px;
        background: #101216;
      }

      /* Five Coach Hub bottom tabs */

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

  /* ========================================
     EVENTS
     ======================================== */

  function openBuilder() {
    if (
      typeof window.openManaProgramBuilder ===
      "function"
    ) {
      window.openManaProgramBuilder();
    } else {
      window.alert(
        "Program Builder is unavailable."
      );
    }
  }

  function handleClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const navButton = target.closest(
      `#${NAV} [data-coach-page]`
    );

    if (navButton && coachVisible()) {
      const tab = tabs.find(
        item =>
          item[0] === navButton.dataset.mcnTab
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
      openBuilder();
    }

    /* Existing .client-open event handler
       opens the existing coaching profile. */
  }

  function checkWorkspace() {
    const now = coachVisible();

    if (now && !coachWasVisible) {
      coachWasVisible = true;
      page = "summary";
      display();
      updateNav();
      loadData();
    } else if (!now) {
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
