
/* =====================================================
   MANA MOVEMENT — COACH HUB NAVIGATION
   BUILD 104702

   COMPLETE REPLACEMENT:
   mana_coach_navigation_104700.js

   Summary / Clients / Chat / Payments / Settings

   - Removes duplicated Programs navigation
   - Shows real client assignments by pathway
   - Preserves client profiles and Program Builder
   - Reuses the original Coach Hub navigation
   - No database writes
   - No continuous polling
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104702";
  const FLAG = "MANA_COACH_NAV_104702";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const NAV = "manaV97CoachNav";
  const HOME = "coachHomePage";
  const SUMMARY = "manaCoachSummary104702";
  const DIRECTORY = "manaCoachDirectory104702";
  const CHAT = "manaCoachChat104702";
  const PAYMENTS = "manaCoachPayments104702";
  const SETTINGS = "manaCoachSettings104702";
  const STYLE = "manaCoachNavStyle104702";

  const $ = id => document.getElementById(id);

  let active = "summary";
  let assignments = [];
  let loading = false;
  let loaded = false;
  let refreshQueued = false;
  let requestId = 0;

  const tabs = [
    {
      name: "summary",
      original: "home",
      label: "Summary",
      icon: "▦"
    },
    {
      name: "clients",
      original: "fuel",
      label: "Clients",
      icon: "♙"
    },
    {
      name: "chat",
      original: "progress",
      label: "Chat",
      icon: "☏"
    },
    {
      name: "payments",
      original: "programs",
      label: "Payments",
      icon: "▤"
    },
    {
      name: "settings",
      original: "profile",
      label: "Settings",
      icon: "⚙"
    }
  ];

  const pathways = [
    {
      key: "strength",
      title: "Mana Strength",
      description: "Strength & performance",
      icon: "◆"
    },
    {
      key: "mana28",
      title: "Mana28",
      description: "28-day training pathway",
      icon: "▦"
    },
    {
      key: "lyfe",
      title: "ManaLyfe",
      description: "Lifestyle & wellbeing",
      icon: "♡"
    }
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

  function visible(id) {
    const el = $(id);

    return Boolean(
      el &&
      !el.hidden &&
      !el.classList.contains("hide")
    );
  }

  function coachActive() {
    return (
      visible("coachView") ||
      visible("coachClientDetailView")
    );
  }

  function routeFor(page) {
    return {
      summary: "home",
      clients: "home",
      chat: "progress",
      payments: "programs",
      settings: "profile"
    }[page] || "home";
  }

  /* ============================================
     REAL CLIENT DIRECTORY

     Use existing client identities rather than
     inventing new client accounts.
     ============================================ */

  function clients() {
    const source = $("coachClientsCard");
    if (!source) return [];

    const unique = new Map();

    source.querySelectorAll(
      ".client-open[data-client-id]"
    ).forEach(node => {
      const id = String(
        node.dataset.clientId || ""
      ).trim();

      if (!id || unique.has(id)) return;

      const name = String(
        node.dataset.clientName ||
        node.querySelector("strong")?.textContent ||
        "Client"
      ).trim();

      unique.set(id, { id, name });
    });

    return [...unique.values()].sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }

  function pathwayFor(name) {
    const value = String(name || "")
      .toLowerCase()
      .replace(/[\s_-]+/g, "");

    if (
      value.includes("manastrength") ||
      value.includes("manastrong")
    ) return "strength";

    if (
      value.includes("mana28") ||
      value.includes("mana28day")
    ) return "mana28";

    if (
      value.includes("manalyfe") ||
      value.includes("manaforlife")
    ) return "lyfe";

    return null;
  }

  async function loadAssignments() {
    if (loading || !coachActive()) return;

    loading = true;
    const token = ++requestId;

    try {
      if (
        typeof window.supabaseClient !== "function"
      ) {
        throw Error("Cloud connection unavailable");
      }

      const db = await window.supabaseClient();

      const { data, error } =
        await db.auth.getUser();

      if (error || !data?.user) {
        throw Error("Sign in required");
      }

      const coachId = data.user.id;

      /* Coach-only access is additionally
         enforced by existing Supabase RLS. */

      const result = await db
        .from("profiles")
        .select("role")
        .eq("id", coachId)
        .single();

      if (
        result.error ||
        result.data?.role !== "coach"
      ) {
        throw Error("Coach access required");
      }

      const response = await db
        .from("client_program_assignments")
        .select(
          "client_id,status,custom_programs(name)"
        )
        .eq("coach_id", coachId)
        .neq("status", "removed");

      if (response.error) throw response.error;

      if (token !== requestId) return;

      assignments = response.data || [];
      loaded = true;

      renderSummary();
      renderDirectory();

    } catch (error) {
      if (token !== requestId) return;

      console.warn(
        "[Mana] Coach assignments:",
        error
      );

      loaded = false;
      assignments = [];

      renderSummary(
        "Program assignments could not be loaded."
      );

      renderDirectory();

    } finally {
      loading = false;
    }
  }

  function assignedPathways(clientId) {
    const result = new Set();

    assignments.forEach(item => {
      if (item.client_id !== clientId) return;

      const program = item.custom_programs;

      const name = Array.isArray(program)
        ? program[0]?.name
        : program?.name;

      const key = pathwayFor(name);

      if (key) result.add(key);
    });

    return result;
  }

  /* ============================================
     CLIENT PROFILE OPENING
     ============================================ */

  function openClient(id) {
    const client = clients().find(
      item => item.id === id
    );

    if (!client) return;

    if (
      typeof window.openCoachClientDetail ===
      "function"
    ) {
      window.openCoachClientDetail(
        client.id,
        client.name
      );
    }
  }

  function clientButton(client) {
    return `
      <button
        type="button"
        class="mcn-client"
        data-mcn-open="${esc(client.id)}"
      >
        <span>${esc(client.name)}</span>
        <span class="mcn-arrow">›</span>
      </button>
    `;
  }

  /* ============================================
     SUMMARY
     ============================================ */

  function ensureSummary() {
    const home = $(HOME);
    if (!home) return null;

    let panel = $(SUMMARY);

    if (!panel) {
      panel = document.createElement("section");
      panel.id = SUMMARY;

      home.prepend(panel);
    }

    return panel;
  }

  function renderSummary(message = "") {
    const panel = ensureSummary();
    if (!panel) return;

    const all = clients();
    const groups = new Map(
      pathways.map(p => [p.key, []])
    );

    const unassigned = [];

    all.forEach(client => {
      const keys = assignedPathways(client.id);

      if (!keys.size) {
        unassigned.push(client);
        return;
      }

      keys.forEach(key => {
        groups.get(key)?.push(client);
      });
    });

    panel.innerHTML = `
      <div class="mcn-kicker">
        MANA MOVEMENT · COACH HUB
      </div>

      <h2>Coaching Summary</h2>

      <p class="mcn-muted">
        Your clients, pathways and coaching
        priorities in one place.
      </p>

      <div class="mcn-stats">
        <div class="mcn-stat">
          <strong>${all.length}</strong>
          <span>Client records</span>
        </div>

        <div class="mcn-stat">
          <strong>3</strong>
          <span>Mana pathways</span>
        </div>

        <div class="mcn-stat">
          <strong>${loaded ? unassigned.length : "—"}</strong>
          <span>Unassigned</span>
        </div>
      </div>

      <div class="mcn-section-title">
        Your Programs & Clients
      </div>

      ${message ? `
        <p class="mcn-muted">
          ${esc(message)}
        </p>
      ` : ""}

      ${pathways.map(program => {
        const members = groups.get(program.key) || [];

        return `
          <details class="mcn-program">
            <summary>
              <span class="mcn-symbol">
                ${program.icon}
              </span>

              <span class="mcn-program-text">
                <strong>${program.title}</strong>
                <small>${program.description}</small>
              </span>

              <span class="mcn-count">
                ${loaded ? members.length : "—"}
              </span>
            </summary>

            <div class="mcn-program-body">
              ${loaded && members.length
                ? members.map(clientButton).join("")
                : `
                  <p class="mcn-muted">
                    ${loaded
                      ? "No confirmed client assignments yet."
                      : "Assignment data unavailable."}
                  </p>
                `
              }
            </div>
          </details>
        `;
      }).join("")}

      ${loaded && unassigned.length ? `
        <details class="mcn-program">
          <summary>
            <span class="mcn-symbol">○</span>

            <span class="mcn-program-text">
              <strong>Unassigned Clients</strong>
              <small>
                No confirmed Mana pathway assignment
              </small>
            </span>

            <span class="mcn-count">
              ${unassigned.length}
            </span>
          </summary>

          <div class="mcn-program-body">
            ${unassigned.map(clientButton).join("")}
          </div>
        </details>
      ` : ""}

      <div class="mcn-quick">
        <button
          type="button"
          data-mcn-route="clients"
        >
          <strong>Manage Clients</strong>
          <small>Search and open client profiles</small>
        </button>

        <button
          type="button"
          data-mcn-builder="1"
        >
          <strong>Create Program</strong>
          <small>Open your existing Program Builder</small>
        </button>
      </div>
    `;

    /* Hide only the old duplicate
       three-program section.
       Keep other Coach Home tools. */

    const oldGrid = document.querySelector(
      "#manaCoachHubClean103760 .hub-program-grid"
    );

    if (oldGrid?.parentElement) {
      oldGrid.parentElement.classList.add(
        "mcn-old-programs-hidden"
      );
    }
  }

  /* ============================================
     CLIENT DIRECTORY
     ============================================ */

  function ensureDirectory() {
    const home = $(HOME);
    if (!home) return null;

    let panel = $(DIRECTORY);

    if (!panel) {
      panel = document.createElement("section");
      panel.id = DIRECTORY;

      home.prepend(panel);

      panel.innerHTML = `
        <div class="mcn-kicker">
          MANA MOVEMENT · CLIENT MANAGEMENT
        </div>

        <h2>Clients</h2>

        <p class="mcn-muted">
          Search clients and open their
          existing coaching profiles.
        </p>

        <input
          id="manaCoachSearch104702"
          type="search"
          placeholder="Search clients..."
          aria-label="Search clients"
        >

        <div id="manaCoachList104702"></div>
      `;
    }

    return panel;
  }

  function renderDirectory() {
    const panel = ensureDirectory();

    const list = $("manaCoachList104702");
    if (!panel || !list) return;

    const search = String(
      $("manaCoachSearch104702")?.value || ""
    ).trim().toLowerCase();

    const all = clients();

    const shown = all.filter(
      item => item.name.toLowerCase()
        .includes(search)
    );

    list.innerHTML = shown.length
      ? shown.map(clientButton).join("")
      : `
        <p class="mcn-muted">
          ${all.length
            ? "No matching clients."
            : "No client records loaded yet."}
        </p>
      `;
  }

  /* ============================================
     CHAT / PAYMENTS / SETTINGS

     These are clearly labelled connection
     screens, not simulated live services.
     ============================================ */

  function ensurePages() {
    const pages = [
      {
        id: CHAT,
        host: "coachProgressPage",
        kicker: "COACH COMMUNICATION",
        title: "Chat",
        body:
          "Your central coaching inbox will appear here once messaging is connected.",
        detail:
          "Messaging connection pending. No conversations are being fabricated."
      },
      {
        id: PAYMENTS,
        host: "coachProgramsPage",
        kicker: "MEMBERSHIPS & BILLING",
        title: "Payments",
        body:
          "Manage Mana Movement subscriptions and membership billing here.",
        detail:
          "Stripe connection pending. No payment totals are displayed until real billing data is available."
      },
      {
        id: SETTINGS,
        host: "coachProfilePage",
        kicker: "COACH ACCOUNT",
        title: "Settings",
        body:
          "Manage your coaching account and program administration.",
        detail: ""
      }
    ];

    pages.forEach(page => {
      const host = $(page.host);
      if (!host || $(page.id)) return;

      const panel = document.createElement("section");
      panel.id = page.id;
      panel.className = "mcn-page";

      panel.innerHTML = `
        <div class="mcn-kicker">
          ${page.kicker}
        </div>

        <h2>${page.title}</h2>

        <p class="mcn-muted">
          ${page.body}
        </p>

        ${page.detail ? `
          <div class="mcn-status">
            ${page.detail}
          </div>
        ` : ""}

        ${page.id === SETTINGS ? `
          <div class="mcn-quick">
            <button
              type="button"
              data-mcn-builder="1"
            >
              <strong>Program Builder</strong>
              <small>
                Create and edit saved client programs
              </small>
            </button>

            <button
              type="button"
              data-mcn-route="clients"
            >
              <strong>Client Management</strong>
              <small>
                View profiles and program assignments
              </small>
            </button>
          </div>
        ` : ""}
      `;

      host.prepend(panel);
    });
  }

  /* ============================================
     FIVE COACH NAVIGATION BUTTONS

     Reuse the existing buttons so the
     coach shell does not get duplicated.
     ============================================ */

  function updateNav() {
    const nav = $(NAV);
    if (!nav) return;

    tabs.forEach(tab => {
      const button = nav.querySelector(
        `[data-coach-page="${tab.original}"]`
      );

      if (!button) return;

      button.dataset.mcnPage = tab.name;

      let icon = button.querySelector(
        ".mana-v970-tab-icon"
      );

      if (!icon) {
        icon = document.createElement("span");
        icon.className = "mana-v970-tab-icon";
        button.prepend(icon);
      }

      if (icon.textContent !== tab.icon) {
        icon.textContent = tab.icon;
      }

      let label = button.querySelector(
        ".mcn-tab-label"
      );

      if (!label) {
        Array.from(button.childNodes)
          .filter(node => node.nodeType === 3)
          .forEach(node => {
            node.textContent = "";
          });

        label = document.createElement("span");
        label.className = "mcn-tab-label";

        button.appendChild(label);
      }

      if (label.textContent !== tab.label) {
        label.textContent = tab.label;
      }

      button.classList.toggle(
        "active",
        active === tab.name
      );

      button.setAttribute(
        "aria-label",
        tab.label
      );
    });
  }

  function go(page) {
    if (!coachActive()) return;

    active = tabs.some(
      item => item.name === page
    ) ? page : "summary";

    const route = routeFor(active);

    if (
      typeof window.showCoachPage === "function"
    ) {
      window.showCoachPage(route);
    } else {
      const pages = {
        home: "coachHomePage",
        programs: "coachProgramsPage",
        progress: "coachProgressPage",
        profile: "coachProfilePage"
      };

      $("coachClientDetailView")
        ?.classList.add("hide");

      $("coachView")
        ?.classList.remove("hide");

      document.querySelectorAll(
        "#coachView .coach-page"
      ).forEach(item => {
        item.classList.add("hide");
      });

      $(pages[route])?.classList.remove("hide");
    }

    ensurePages();
    ensureSummary();
    ensureDirectory();

    $("coachHomePage")?.classList.toggle(
      "mcn-clients-mode",
      active === "clients"
    );

    document.body.classList.toggle(
      "mcn-chat-mode",
      active === "chat"
    );

    document.body.classList.toggle(
      "mcn-payments-mode",
      active === "payments"
    );

    document.body.classList.toggle(
      "mcn-settings-mode",
      active === "settings"
    );

    updateNav();

    if (active === "summary") {
      renderSummary();

      if (!loaded) loadAssignments();
    }

    if (active === "clients") {
      renderDirectory();
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
      return;
    }

    window.alert(
      "The existing Program Builder is not available on this screen."
    );
  }

  /* ============================================
     STYLING
     ============================================ */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `
      /* Bottom Coach Hub tabs */

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

        padding: 9px 3px !important;

        background: #15171A !important;
        border: 1px solid #454B53 !important;
        border-radius: 13px !important;

        color: #C1C6CE !important;
        -webkit-text-fill-color:
          #C1C6CE !important;

        font-size: 0 !important;
        text-align: center !important;
      }

      #${NAV} .mana-v970-tab-icon {
        display: block !important;
        color: inherit !important;
        font-size: 20px !important;
        line-height: 1 !important;
        margin: 0 0 6px !important;
      }

      #${NAV} .mcn-tab-label {
        display: block !important;
        color: inherit !important;
        font-size: 11px !important;
        font-weight: 850 !important;
        line-height: 1.25 !important;
      }

      #${NAV} .mana-v970-tab.active {
        background: #321D12 !important;
        border-color: #FF7927 !important;
        color: #FF7927 !important;
        -webkit-text-fill-color:
          #FF7927 !important;
      }

      /* Summary and directory */

      #${SUMMARY},
      #${DIRECTORY},
      #${CHAT},
      #${PAYMENTS},
      #${SETTINGS} {
        max-width: 980px;
        margin: 0 auto 22px;
        color: #FFFFFF;
        box-sizing: border-box;
      }

      #${SUMMARY},
      #${DIRECTORY} {
        padding: 16px 0 8px;
      }

      .mcn-kicker {
        color: #FF7927;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .1em;
        margin-bottom: 9px;
      }

      #${SUMMARY} h2,
      #${DIRECTORY} h2,
      .mcn-page h2 {
        color: #FFFFFF !important;
        font-size: clamp(25px,4vw,34px);
        font-weight: 900;
        margin: 0 0 10px;
      }

      .mcn-muted {
        color: #C1C6CE;
        font-size: 13px;
        line-height: 1.55;
      }

      .mcn-stats {
        display: grid;
        grid-template-columns: repeat(3,minmax(0,1fr));
        gap: 10px;
        margin: 18px 0 22px;
      }

      .mcn-stat {
        background: #15171A;
        border: 1px solid #414750;
        border-radius: 15px;
        padding: 15px;
      }

      .mcn-stat strong {
        display: block;
        color: #FF7927;
        font-size: 29px;
      }

      .mcn-stat span {
        display: block;
        color: #C1C6CE;
        font-size: 11px;
      }

      .mcn-section-title {
        color: #FFFFFF;
        font-size: 17px;
        font-weight: 900;
        margin: 20px 0 12px;
      }

      .mcn-program {
        background: #15171A;
        border: 1px solid #454B53;
        border-radius: 16px;
        margin-bottom: 10px;
        overflow: hidden;
      }

      .mcn-program[open] {
        border-color: #FF7927;
      }

      .mcn-program summary {
        display: flex;
        align-items: center;
        gap: 13px;
        padding: 16px;
        cursor: pointer;
        list-style: none;
      }

      .mcn-program summary::-webkit-details-marker {
        display: none;
      }

      .mcn-symbol {
        display: grid;
        place-items: center;

        flex: 0 0 42px;
        width: 42px;
        height: 42px;

        border: 1px solid #FF7927;
        border-radius: 12px;

        color: #FF7927;
        font-size: 22px;
      }

      .mcn-program-text {
        flex: 1;
        min-width: 0;
      }

      .mcn-program-text strong {
        display: block;
        color: #FFFFFF;
        font-size: 15px;
      }

      .mcn-program-text small {
        display: block;
        color: #C1C6CE;
        font-size: 11px;
        margin-top: 5px;
      }

      .mcn-count {
        color: #FF7927;
        font-size: 20px;
        font-weight: 900;
      }

      .mcn-program-body {
        border-top: 1px solid #373E46;
        padding: 12px 15px;
      }

      .mcn-client {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;

        width: 100%;
        padding: 13px;

        background: #101216;
        border: 1px solid #444C56;
        border-radius: 11px;

        color: #FFFFFF;
        font-size: 13px;
        font-weight: 750;
        text-align: left;

        cursor: pointer;
        margin: 0 0 8px;
      }

      .mcn-client:hover {
        border-color: #FF7927;
      }

      .mcn-arrow {
        color: #FF7927;
        font-size: 23px;
      }

      .mcn-quick {
        display: grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap: 10px;
        margin: 18px 0;
      }

      .mcn-quick button {
        background: #181B20;
        border: 1px solid #505965;
        border-radius: 14px;
        padding: 16px;
        text-align: left;
        cursor: pointer;
      }

      .mcn-quick strong {
        display: block;
        color: #FFFFFF;
        font-size: 13px;
      }

      .mcn-quick small {
        display: block;
        color: #C1C6CE;
        font-size: 11px;
        margin-top: 6px;
      }

      /* Hide duplicate program cards
         from the old Summary dashboard. */

      #manaCoachHubClean103760
      .mcn-old-programs-hidden {
        display: none !important;
      }

      /* Clients replaces Summary content
         rather than duplicating it. */

      #${DIRECTORY} {
        display: none;
      }

      #${HOME}.mcn-clients-mode
      > :not(#${DIRECTORY}) {
        display: none !important;
      }

      #${HOME}.mcn-clients-mode
      > #${DIRECTORY} {
        display: block !important;
      }

      #manaCoachSearch104702 {
        width: 100%;
        margin: 16px 0;
        padding: 14px;

        background: #101216;
        border: 1px solid #525B66;
        border-radius: 12px;

        color: #FFFFFF;
        font-size: 14px;
      }

      /* Chat and Payments hide their old
         duplicate page contents only when
         these tabs are selected. */

      body.mcn-chat-mode
      #coachProgressPage > :not(#${CHAT}) {
        display: none !important;
      }

      body.mcn-payments-mode
      #coachProgramsPage > :not(#${PAYMENTS}) {
        display: none !important;
      }

      body.mcn-settings-mode
      #coachProfilePage > :not(#${SETTINGS}) {
        display: none !important;
      }

      .mcn-page {
        background: #15171A;
        border: 1px solid #444C55;
        border-radius: 18px;
        padding: 22px;
        margin-top: 15px;
      }

      .mcn-status {
        margin-top: 20px;
        padding: 16px;

        background: #101216;
        border: 1px solid #FF7927;
        border-radius: 12px;

        color: #C1C6CE;
        font-size: 13px;
      }

      @media(max-width:600px) {
        .mcn-stats {
          gap: 6px;
        }

        .mcn-stat {
          padding: 10px;
        }

        .mcn-stat strong {
          font-size: 23px;
        }

        .mcn-quick {
          grid-template-columns: 1fr;
        }

        #${NAV} .mcn-tab-label {
          font-size: 10px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================
     EVENT HANDLERS
     ============================================ */

  function handleClick(event) {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest(
      `#${NAV} [data-coach-page]`
    );

    if (button && coachActive()) {
      const tab = tabs.find(
        item => item.original ===
          button.dataset.coachPage
      );

      if (!tab) return;

      /* Prevent the old shell routing
         to the duplicated Programs page. */

      event.preventDefault();
      event.stopImmediatePropagation();

      go(tab.name);
      return;
    }

    const client = event.target.closest(
      "[data-mcn-open]"
    );

    if (client && coachActive()) {
      event.preventDefault();
      openClient(client.dataset.mcnOpen);
      return;
    }

    const route = event.target.closest(
      "[data-mcn-route]"
    );

    if (route && coachActive()) {
      event.preventDefault();
      go(route.dataset.mcnRoute);
      return;
    }

    const builder = event.target.closest(
      "[data-mcn-builder]"
    );

    if (builder && coachActive()) {
      event.preventDefault();
      openBuilder();
    }
  }

  function refreshView() {
    refreshQueued = false;

    if (!coachActive()) {
      document.body.classList.remove(
        "mcn-chat-mode",
        "mcn-payments-mode",
        "mcn-settings-mode"
      );
      return;
    }

    ensurePages();
    ensureSummary();
    ensureDirectory();
    updateNav();

    if (active === "summary") {
      renderSummary();
    }

    if (active === "clients") {
      renderDirectory();
    }
  }

  function scheduleRefresh() {
    if (refreshQueued) return;

    refreshQueued = true;
    requestAnimationFrame(refreshView);
  }

  function init() {
    installStyles();

    ensurePages();
    ensureSummary();
    ensureDirectory();

    document.addEventListener(
      "click",
      handleClick,
      true
    );

    $("manaCoachSearch104702")
      ?.addEventListener(
        "input",
        renderDirectory
      );

    const coach = $("coachView");

    if (coach) {
      new MutationObserver(
        scheduleRefresh
      ).observe(coach, {
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    const nav = $(NAV);

    if (nav) {
      new MutationObserver(
        scheduleRefresh
      ).observe(nav, {
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    window.addEventListener(
      "pageshow",
      scheduleRefresh
    );

    [300, 900, 1800].forEach(delay => {
      setTimeout(() => {
        if (!coachActive()) return;

        scheduleRefresh();

        if (!loaded) {
          loadAssignments();
        }
      }, delay);
    });

    scheduleRefresh();

    console.log(
      "[Mana Movement] Coach navigation " +
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
