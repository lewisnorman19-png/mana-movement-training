
/* MANA MOVEMENT | Coach Hub navigation | Build 104706
   COMPLETE REPLACEMENT: mana_coach_navigation_104700.js
   Summary / Clients / Chat / Payments / Settings
   Client-specific View Client + Build Program actions
   Premium orange and silver borders (no gold)
   No database writes or workout changes.
*/
(() => {
  'use strict';
  if (window.MANA_COACH_NAV_104706) return;
  window.MANA_COACH_NAV_104706 = true;

  const $ = id => document.getElementById(id);
  const HOME = 'coachHomePage';
  const HUB = 'manaCoachHubClean103760';
  const NAV = 'manaV97CoachNav';
  const SUITE = 'manaCoachSuite104706';
  const STYLE = 'manaCoachSuiteStyle104706';

  const TABS = [
    ['summary', 'home', 'Summary', '▦'],
    ['clients', 'fuel', 'Clients', '♙'],
    ['chat', 'progress', 'Chat', '☏'],
    ['payments', 'programs', 'Payments', '▤'],
    ['settings', 'profile', 'Settings', '⚙']
  ];

  const PROGRAMS = [
    ['strength', 'Mana Strength', 'Strength & performance', '◆'],
    ['mana28', 'Mana28', '28-day training', '▦'],
    ['lyfe', 'ManaLyfe', 'Lifestyle & wellbeing', '♡']
  ];

  let page = 'summary';
  let clients = [];
  let assignments = [];
  let clientsReady = false;
  let assignmentsReady = false;
  let errorClients = '';
  let errorAssignments = '';
  let loading = false;
  let request = 0;
  let coachWasVisible = false;

  const safe = v => String(v ?? '').replace(
    /[&<>"']/g,
    c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[c]
  );

  function coachVisible() {
    return Boolean(
      $('coachView') &&
      !$('coachView').classList.contains('hide')
    );
  }

  function pathway(name) {
    const n = String(name || '')
      .toLowerCase()
      .replace(/[\s_-]/g, '');

    if (
      n.includes('manastrength') ||
      n.includes('manastrong')
    ) return 'strength';

    if (n.includes('mana28')) return 'mana28';

    if (
      n.includes('manalyfe') ||
      n.includes('manaforlife')
    ) return 'lyfe';

    return '';
  }

  /* =====================================
     CLIENTS AND PROGRAM ASSIGNMENTS
     ===================================== */

  async function loadData() {
    if (!coachVisible() || loading) return;

    loading = true;
    const token = ++request;

    try {
      if (
        typeof window.supabaseClient !== 'function'
      ) {
        throw Error('Mana cloud unavailable');
      }

      const db = await window.supabaseClient();
      const auth = await db.auth.getUser();
      const user = auth.data?.user;

      if (!user || auth.error) {
        throw Error('Sign in to access Coach Hub');
      }

      const prof = await db
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (
        prof.error ||
        prof.data?.role !== 'coach'
      ) {
        throw Error('Coach access required');
      }

      const outcomes = await Promise.allSettled([
        db.rpc('coach_clients_summary'),

        db.from('client_program_assignments')
          .select(
            'client_id,status,custom_programs(name)'
          )
          .eq('coach_id', user.id)
          .eq('status', 'active')
      ]);

      if (token !== request) return;

      const c =
        outcomes[0].status === 'fulfilled'
          ? outcomes[0].value
          : null;

      if (c && !c.error) {
        const unique = new Map();

        (c.data || []).forEach(r => {
          if (
            r.user_id &&
            !unique.has(r.user_id)
          ) {
            unique.set(r.user_id, {
              id: String(r.user_id),
              name: String(r.full_name || 'Client')
            });
          }
        });

        clients = [...unique.values()].sort(
          (a, b) =>
            a.name.localeCompare(b.name)
        );

        clientsReady = true;
        errorClients = '';

      } else {
        clientsReady = false;
        errorClients =
          c?.error?.message ||
          'Client directory unavailable';
      }

      const a =
        outcomes[1].status === 'fulfilled'
          ? outcomes[1].value
          : null;

      if (a && !a.error) {
        assignments = a.data || [];
        assignmentsReady = true;
        errorAssignments = '';

      } else {
        assignmentsReady = false;
        errorAssignments =
          a?.error?.message ||
          'Program assignments unavailable';
      }

    } catch (e) {
      clientsReady = false;
      assignmentsReady = false;

      errorClients =
        e?.message || 'Unable to load coaching data';

      errorAssignments = errorClients;

      console.warn(
        '[Mana Coach 104706]',
        e
      );

    } finally {
      if (token === request) {
        loading = false;
        renderSummary();
        renderClients();
      }
    }
  }

  function groupClients() {
    const g = {
      strength: [],
      mana28: [],
      lyfe: [],
      unclassified: [],
      unassigned: []
    };

    if (!clientsReady || !assignmentsReady) {
      return g;
    }

    clients.forEach(c => {
      const active = assignments.filter(
        a => a.client_id === c.id
      );

      if (!active.length) {
        g.unassigned.push(c);
        return;
      }

      const keys = new Set();

      active.forEach(a => {
        const p = a.custom_programs;

        const name = Array.isArray(p)
          ? p[0]?.name
          : p?.name;

        keys.add(
          pathway(name) || 'unclassified'
        );
      });

      keys.forEach(k => g[k].push(c));
    });

    return g;
  }

  /* =====================================
     CLIENT ACTIONS
     ===================================== */

  function clientRow(c) {
    return `
      <div class="mcn-client-row">

        <div class="mcn-client-name">
          ${safe(c.name)}
          <span aria-hidden="true">›</span>
        </div>

        <div class="mcn-client-actions">

          <button
            type="button"
            class="mcn-view client-open"
            data-client-id="${safe(c.id)}"
            data-client-name="${safe(c.name)}"
          >
            View Client
          </button>

          <button
            type="button"
            class="mcn-build"
            data-mcn-build-client="${safe(c.id)}"
          >
            Build Program
          </button>

        </div>
      </div>
    `;
  }

  /* =====================================
     EXPANDABLE PROGRAM CARDS
     ===================================== */

  function card(
    title,
    subtitle,
    icon,
    members,
    count,
    unassigned = false
  ) {
    return `
      <details class="mcn-program">

        <summary>

          <span class="mcn-symbol">
            ${icon}
          </span>

          <span class="mcn-program-title">
            <strong>${safe(title)}</strong>
            <small>${safe(subtitle)}</small>
          </span>

          <span class="mcn-end">

            <span class="mcn-number">
              <strong>${count}</strong>
              <small>
                ${unassigned ? 'CLIENTS' : 'ASSIGNED'}
              </small>
            </span>

            <span
              class="mcn-arrow"
              aria-hidden="true"
            >›</span>

          </span>
        </summary>

        <div class="mcn-program-body">

          ${members.length
            ? members.map(clientRow).join('')
            : `
              <p class="mcn-muted">
                ${clientsReady && assignmentsReady
                  ? 'No confirmed clients in this category.'
                  : 'Checking client assignments…'}
              </p>
            `
          }

        </div>
      </details>
    `;
  }

  /* =====================================
     SUMMARY
     ===================================== */

  function renderSummary() {
    const host = $('mcnSummary104706');
    if (!host) return;

    const g = groupClients();
    const ready = clientsReady && assignmentsReady;

    const count = key =>
      ready ? g[key].length : '—';

    host.innerHTML = `
      <div class="mcn-kicker">
        COACH OVERVIEW
      </div>

      <h2>Your Programs & Clients</h2>

      <p class="mcn-muted">
        Select a program to see its assigned clients.
      </p>

      <div class="mcn-stats">

        <div class="mcn-stat">
          <strong>
            ${clientsReady ? clients.length : '—'}
          </strong>
          <small>Client records</small>
        </div>

        <div class="mcn-stat">
          <strong>3</strong>
          <small>Program pathways</small>
        </div>

        <div class="mcn-stat">
          <strong>
            ${assignmentsReady
              ? assignments.length
              : '—'}
          </strong>
          <small>Active assignments</small>
        </div>

      </div>

      ${(errorClients || errorAssignments)
        ? `
          <p class="mcn-muted">
            ${safe(
              errorClients || errorAssignments
            )}
          </p>
        `
        : ''
      }

      ${PROGRAMS.map(p =>
        card(
          p[1],
          p[2],
          p[3],
          g[p[0]],
          count(p[0])
        )
      ).join('')}

      ${ready && g.unclassified.length
        ? card(
            'Unclassified Program',
            'Assigned program needs a Mana pathway label',
            '?',
            g.unclassified,
            g.unclassified.length
          )
        : ''
      }

      ${ready && g.unassigned.length
        ? card(
            'Unassigned Clients',
            'No active program assignment',
            '○',
            g.unassigned,
            g.unassigned.length,
            true
          )
        : ''
      }

      <div class="mcn-tools">

        <button
          type="button"
          data-mcn-route="clients"
        >
          <strong>Manage Clients</strong>
          <small>Profiles and assignments</small>
        </button>

        <button
          type="button"
          data-mcn-builder="1"
        >
          <strong>Create Program</strong>
          <small>Open the Program Builder</small>
        </button>

      </div>
    `;
  }

  /* =====================================
     CLIENT DIRECTORY
     ===================================== */

  function renderClients() {
    const host = $('mcnList104706');
    if (!host) return;

    if (!clientsReady) {
      host.innerHTML = `
        <p class="mcn-muted">
          ${safe(
            errorClients || 'Loading client records…'
          )}
        </p>
      `;
      return;
    }

    const q = String(
      $('mcnSearch104706')?.value || ''
    ).trim().toLowerCase();

    const matches = clients.filter(
      c => c.name.toLowerCase().includes(q)
    );

    host.innerHTML = matches.length
      ? matches.map(clientRow).join('')
      : `
        <p class="mcn-muted">
          No matching clients.
        </p>
      `;
  }

  /* =====================================
     COACH HUB VIEWS
     ===================================== */

  function ensureSuite() {
    if ($(SUITE)) return $(SUITE);

    const home = $(HOME);
    if (!home) return null;

    const suite = document.createElement(
      'section'
    );

    suite.id = SUITE;

    suite.innerHTML = `

      <section data-mcn-view="summary">
        <div id="mcnSummary104706"></div>
      </section>

      <section data-mcn-view="clients">

        <div class="mcn-kicker">
          CLIENT MANAGEMENT
        </div>

        <h2>Clients</h2>

        <p class="mcn-muted">
          Search and manage the clients already
          in your Coach Hub.
        </p>

        <input
          id="mcnSearch104706"
          type="search"
          placeholder="Search clients…"
          aria-label="Search clients"
        >

        <div id="mcnList104706"></div>

      </section>

      <section data-mcn-view="chat">

        <div class="mcn-kicker">
          COACH COMMUNICATION
        </div>

        <h2>Chat</h2>

        <div class="mcn-panel">

          <h3>Coaching Inbox</h3>

          <p class="mcn-muted">
            Messaging integration is pending.
          </p>

          <p class="mcn-notice">
            Messages will appear only after
            the coach inbox is connected.
          </p>

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
              <small>Recurring membership</small>
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

          <p class="mcn-notice">
            Stripe billing dashboard not yet connected.
            No payment or revenue figures are estimated.
          </p>

        </div>
      </section>

      <section data-mcn-view="settings">

        <div class="mcn-kicker">
          COACH ADMINISTRATION
        </div>

        <h2>Settings</h2>

        <div class="mcn-panel">

          <h3>Coaching Tools</h3>

          <div class="mcn-tools">

            <button
              type="button"
              data-mcn-builder="1"
            >
              <strong>Program Builder</strong>
              <small>Create and edit programs</small>
            </button>

            <button
              type="button"
              data-mcn-route="clients"
            >
              <strong>Manage Clients</strong>
              <small>Profiles and assignments</small>
            </button>

          </div>
        </div>
      </section>
    `;

    home.appendChild(suite);

    $('mcnSearch104706')?.addEventListener(
      'input',
      renderClients
    );

    return suite;
  }

  /* =====================================
     BOTTOM NAVIGATION
     ===================================== */

  function updateNav() {
    const nav = $(NAV);
    if (!nav) return;

    TABS.forEach((t, i) => {
      const b = nav.querySelector(
        `[data-coach-page="${t[1]}"]`
      );

      if (!b) return;

      b.dataset.mcnTab = t[0];
      b.style.order = String(i + 1);

      let icon = b.querySelector(
        '.mana-v970-tab-icon'
      );

      if (!icon) {
        icon = document.createElement('span');
        icon.className = 'mana-v970-tab-icon';
        b.prepend(icon);
      }

      icon.textContent = t[3];

      Array.from(b.childNodes)
        .filter(n => n.nodeType === 3)
        .forEach(n => {
          n.textContent = '';
        });

      let label = b.querySelector(
        '.mcn-tab-label'
      );

      if (!label) {
        label = document.createElement('span');
        label.className = 'mcn-tab-label';
        b.appendChild(label);
      }

      label.textContent = t[2];

      b.classList.toggle(
        'active',
        page === t[0]
      );
    });
  }

  function display() {
    ensureSuite()
      ?.querySelectorAll('[data-mcn-view]')
      .forEach(el => {
        el.hidden =
          el.dataset.mcnView !== page;
      });

    $(HOME)?.classList.toggle(
      'mcn-summary-active',
      page === 'summary'
    );
  }

  function go(next) {
    if (!coachVisible()) return;

    page = TABS.some(t => t[0] === next)
      ? next
      : 'summary';

    if (
      typeof window.showCoachPage === 'function'
    ) {
      window.showCoachPage('home');
    }

    display();
    updateNav();

    if (page === 'summary') renderSummary();
    if (page === 'clients') renderClients();

    if (
      (page === 'summary' || page === 'clients') &&
      !loading
    ) {
      loadData();
    }

    window.scrollTo(0, 0);
  }

  /* =====================================
     PROGRAM BUILDER
     ===================================== */

  function openBuilder(client = null) {
    if (
      typeof window.openManaProgramBuilder !==
      'function'
    ) {
      window.alert(
        'Program Builder is unavailable.'
      );
      return;
    }

    window.openManaProgramBuilder(client);
  }

  /* =====================================
     CLICK HANDLING
     ===================================== */

  function click(event) {
    const target = event.target;

    if (
      !(target instanceof Element) ||
      !coachVisible()
    ) {
      return;
    }

    const nav = target.closest(
      `#${NAV} [data-coach-page]`
    );

    if (nav) {
      const tab = TABS.find(
        t => t[0] === nav.dataset.mcnTab
      );

      if (tab) {
        event.preventDefault();
        event.stopImmediatePropagation();
        go(tab[0]);
      }

      return;
    }

    const route = target.closest(
      `#${SUITE} [data-mcn-route]`
    );

    if (route) {
      event.preventDefault();
      go(route.dataset.mcnRoute);
      return;
    }

    const buildClient = target.closest(
      `#${SUITE} [data-mcn-build-client]`
    );

    if (buildClient) {
      event.preventDefault();
      event.stopImmediatePropagation();

      const selected = clients.find(
        c =>
          c.id ===
          buildClient.dataset.mcnBuildClient
      );

      if (selected) {
        openBuilder({
          id: selected.id,
          name: selected.name
        });
      }

      return;
    }

    const builder = target.closest(
      `#${SUITE} [data-mcn-builder]`
    );

    if (builder) {
      event.preventDefault();
      event.stopImmediatePropagation();

      openBuilder();
      return;
    }

    /* Existing .client-open event handler
       continues to open View Client. */
  }

  /* =====================================
     WORKSPACE DETECTION
     ===================================== */

  function checkWorkspace() {
    const now = coachVisible();

    if (now && !coachWasVisible) {
      coachWasVisible = true;

      page = 'summary';

      display();
      updateNav();
      loadData();

    } else if (!now) {
      coachWasVisible = false;
    }
  }

  /* =====================================
     PREMIUM BLACK / ORANGE / WHITE / SILVER
     ===================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement(
      'style'
    );

    style.id = STYLE;

    style.textContent = `

      /* Coach logout */

      #manaV97CoachLogout {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
        border: 1px solid #FF7927 !important;
        background: #15171A !important;
        box-shadow: none !important;

        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      /* Coach Summary spacing */

      #${HOME}.mcn-summary-active > #${HUB} {
        margin-bottom: 10px !important;
        padding-bottom: 0 !important;
      }

      #${HOME} > #${SUITE} {
        display: block !important;
        width: 100% !important;
        margin: 0 auto 90px !important;
      }

      #${HOME}
      > :not(#${HUB}):not(#${SUITE}) {
        display: none !important;
      }

      #${HUB}
      > .hub-panel:not(:first-of-type) {
        display: none !important;
      }

      #${HOME}:not(.mcn-summary-active)
      > #${HUB} {
        display: none !important;
      }

      /* Remove old gold accents
         from the original Coach Hub */

      #${HUB} .hub-hero,
      #${HUB} .hub-panel,
      #${HUB} .hub-alert {
        border-color: #48515B !important;
        box-shadow: none !important;
      }

      #${HUB} .hub-kicker,
      #${HUB} .hub-section-tag,
      #${HUB} .hub-alert-icon,
      #${HUB} .hub-alert-number {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      /* Main suite */

      #${SUITE},
      #${SUITE} * {
        box-sizing: border-box;
      }

      #${SUITE} {
        color: #FFFFFF;
        font-family: inherit;
      }

      #${SUITE} [data-mcn-view][hidden] {
        display: none !important;
      }

      #${SUITE} [data-mcn-view] {
        max-width: 980px;
        margin: 0 auto;
        padding: 8px 0 20px;
      }

      #${SUITE} .mcn-kicker {
        color: #FF7927 !important;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .1em;
        margin: 0 0 9px;
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
        color: #C1C6CE !important;
        font-size: 13px;
        line-height: 1.5;
      }

      /* Summary statistics */

      #${SUITE} .mcn-stats {
        display: grid;
        grid-template-columns:
          repeat(3,minmax(0,1fr));
        gap: 10px;
        margin: 18px 0;
      }

      #${SUITE} .mcn-stat,
      #${SUITE} .mcn-panel {
        background: #15171A !important;
        border: 1px solid #48515B !important;
        border-radius: 16px;
        padding: 17px;
      }

      #${SUITE} .mcn-stat strong {
        display: block;
        color: #FF7927 !important;
        font-size: 29px;
        font-weight: 900;
      }

      #${SUITE} .mcn-stat small {
        display: block;
        color: #C1C6CE !important;
        font-size: 11px;
      }

      /* Program groups */

      #${SUITE} .mcn-program {
        background: #15171A !important;
        border: 1px solid #48515B !important;
        border-radius: 16px;
        margin: 10px 0;
        overflow: hidden;
      }

      #${SUITE} .mcn-program[open] {
        border-color: #FF7927 !important;
      }

      #${SUITE} .mcn-program summary {
        display: flex !important;
        align-items: center !important;
        gap: 13px;
        padding: 16px;
        cursor: pointer;
        list-style: none;
      }

      #${SUITE}
      .mcn-program summary::-webkit-details-marker {
        display: none;
      }

      #${SUITE} .mcn-symbol {
        display: grid;
        place-items: center;

        flex: 0 0 42px;
        width: 42px;
        height: 42px;

        background: #241910 !important;
        border: 1px solid #FF7927 !important;
        border-radius: 12px;

        color: #FF7927 !important;
        font-size: 22px;
      }

      #${SUITE} .mcn-program-title {
        flex: 1;
        min-width: 0;
      }

      #${SUITE} .mcn-program-title strong {
        display: block;
        color: #FFFFFF !important;
        font-size: 15px;
      }

      #${SUITE} .mcn-program-title small {
        display: block;
        color: #C1C6CE !important;
        font-size: 11px;
        margin-top: 5px;
      }

      /* Assigned count and expandable arrow */

      #${SUITE} .mcn-end {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-left: auto;
      }

      #${SUITE} .mcn-number {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 48px;
      }

      #${SUITE} .mcn-number strong {
        color: #FF7927 !important;
        font-size: 23px;
        font-weight: 900;
        line-height: 1;
      }

      #${SUITE} .mcn-number small {
        color: #C1C6CE !important;
        font-size: 9px;
        margin-top: 5px;
      }

      #${SUITE} .mcn-arrow {
        color: #FF7927 !important;
        font-size: 32px;
        font-weight: 700;
        line-height: 1;
        transition: transform .2s;
      }

      #${SUITE}
      .mcn-program[open] .mcn-arrow {
        transform: rotate(90deg);
      }

      #${SUITE} .mcn-program-body {
        padding: 13px;
        border-top: 1px solid #3B424B !important;
      }

      /* Individual client rows */

      #${SUITE} .mcn-client-row {
        background: #101216 !important;
        border: 1px solid #48515B !important;
        border-radius: 13px;
        padding: 14px;
        margin-bottom: 9px;
      }

      #${SUITE} .mcn-client-name {
        display: flex;
        justify-content: space-between;
        align-items: center;

        color: #FFFFFF !important;
        font-size: 14px;
        font-weight: 800;
        margin-bottom: 12px;
      }

      #${SUITE} .mcn-client-name span {
        color: #FF7927 !important;
        font-size: 24px;
        line-height: 1;
      }

      /* View Client and Build Program */

      #${SUITE} .mcn-client-actions {
        display: grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap: 9px;
      }

      #${SUITE} .mcn-client-actions button {
        display: flex;
        justify-content: center;
        align-items: center;

        min-height: 41px;
        padding: 10px;

        border: 1px solid #FF7927 !important;
        border-radius: 10px;

        background: #15171A !important;
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;

        font-size: 11px !important;
        font-weight: 900 !important;
        cursor: pointer;
      }

      #${SUITE} .mcn-client-actions .mcn-build {
        background: #25190F !important;
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      /* Quick actions */

      #${SUITE} .mcn-tools {
        display: grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap: 10px;
        margin: 18px 0;
      }

      #${SUITE} .mcn-tools button {
        padding: 16px;
        text-align: left;
        cursor: pointer;

        background: #191B20 !important;
        border: 1px solid #48515B !important;
        border-radius: 14px;
      }

      #${SUITE} .mcn-tools strong,
      #${SUITE} .mcn-pay-grid strong {
        display: block;
        color: #FFFFFF !important;
        font-size: 13px;
      }

      #${SUITE} .mcn-tools small,
      #${SUITE} .mcn-pay-grid small {
        display: block;
        color: #C1C6CE !important;
        font-size: 11px;
        margin-top: 5px;
      }

      /* Client search */

      #${SUITE} #mcnSearch104706 {
        width: 100%;
        padding: 14px;
        margin: 16px 0;

        background: #15171A !important;
        color: #FFFFFF !important;

        border: 1px solid #48515B !important;
        border-radius: 12px;
        font-size: 14px;
      }

      /* Chat / Payments */

      #${SUITE} .mcn-notice {
        padding: 16px;
        margin-top: 17px;

        background: #111317 !important;
        border: 1px solid #FF7927 !important;
        border-radius: 12px;

        color: #C1C6CE !important;
        font-size: 13px;
        line-height: 1.5;
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
        background: #101216 !important;
        border: 1px solid #48515B !important;
        border-radius: 12px;
      }

      /* Coach Hub bottom tabs */

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
        -webkit-text-fill-color: #C1C6CE !important;
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
        -webkit-text-fill-color: #FF7927 !important;
      }

      /* Mobile */

      @media(max-width:600px) {
        #${SUITE} .mcn-stats,
        #${SUITE} .mcn-pay-grid {
          gap: 6px;
        }

        #${SUITE} .mcn-stat {
          padding: 11px;
        }

        #${SUITE} .mcn-number {
          min-width: 43px;
        }

        #${SUITE} .mcn-end {
          gap: 9px;
        }

        #${SUITE} .mcn-tools {
          grid-template-columns: 1fr;
        }

        #${NAV} .mcn-tab-label {
          font-size: 10px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================
     INITIALISE
     ===================================== */

  function init() {
    installStyles();

    ensureSuite();
    display();
    updateNav();

    document.addEventListener(
      'click',
      click,
      true
    );

    const view = $('coachView');

    if (view) {
      new MutationObserver(
        checkWorkspace
      ).observe(view, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    window.addEventListener(
      'pageshow',
      () => {
        checkWorkspace();

        if (coachVisible()) {
          loadData();
        }
      }
    );

    checkWorkspace();

    console.log(
      '[Mana Movement] Coach Hub 104706'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
