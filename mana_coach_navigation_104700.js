
/* MANA MOVEMENT — COACH HUB + PATHWAY ENROLMENT
   BUILD 104707

   COMPLETE REPLACEMENT:
   mana_coach_navigation_104700.js

   - Automatic Mana Strength recognition
   - Mana28 and ManaLyfe pathway selection
   - ManaLyfe included with verified paid plans
   - No duplicated unique-client counts
   - Optional specialised Program Builder
   - Existing Coach Hub navigation preserved
   - No workout or database record deletion
*/
(() => {
  "use strict";

  if (window.MANA_COACH_NAV_104707) return;
  window.MANA_COACH_NAV_104707 = true;

  const $ = id => document.getElementById(id);

  const HOME = "coachHomePage";
  const HUB = "manaCoachHubClean103760";
  const NAV = "manaV97CoachNav";
  const SUITE = "manaCoachSuite104707";
  const STYLE = "manaCoachSuiteStyle104707";

  const PATHWAYS = [
    [
      "strength",
      "Mana Strength",
      "Personalised training and Circuits",
      "◆"
    ],
    [
      "mana28",
      "Mana28",
      "28-day training pathway",
      "▦"
    ],
    [
      "lyfe",
      "ManaLyfe",
      "Wellbeing · included with paid plans",
      "♡"
    ]
  ];

  const TABS = [
    ["summary", "home", "Summary", "▦"],
    ["clients", "fuel", "Clients", "♙"],
    ["chat", "progress", "Chat", "☏"],
    ["payments", "programs", "Payments", "▤"],
    ["settings", "profile", "Settings", "⚙"]
  ];

  const safe = value =>
    String(value ?? "").replace(
      /[&<>"']/g,
      c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[c]
    );

  let page = "summary";
  let people = [];
  let assignments = [];
  let memberships = [];

  let loaded = false;
  let error = "";
  let loading = false;
  let request = 0;
  let lastCoach = false;

  let pendingChoice = null;
  let saveBusy = false;

  /* =====================================
     CURRENT WORKSPACE
     ===================================== */

  function coachVisible() {
    return Boolean(
      $("coachView") &&
      !$("coachView").classList.contains("hide")
    );
  }

  function classify(value) {
    const n = String(value || "")
      .toLowerCase()
      .replace(/[\s_-]/g, "");

    if (
      n.includes("manastrength") ||
      n.includes("manastrong")
    ) {
      return "strength";
    }

    if (n.includes("mana28")) {
      return "mana28";
    }

    if (
      n.includes("manalyfe") ||
      n.includes("manaforlife")
    ) {
      return "lyfe";
    }

    return "";
  }

  /* =====================================
     PROFILE STATUS
     ===================================== */

  function savedProfile() {
    try {
      const profile = JSON.parse(
        localStorage.getItem(
          "mana-profile-v67"
        ) || "null"
      );

      return Boolean(
        profile &&
        profile.updatedAt
      );

    } catch (_) {
      return false;
    }
  }

  async function dbSession() {
    if (
      typeof window.supabaseClient !== "function"
    ) {
      throw Error("Mana cloud unavailable");
    }

    const db = await window.supabaseClient();

    const { data, error } =
      await db.auth.getUser();

    if (error || !data?.user) {
      throw Error(
        "Sign in to save your pathway"
      );
    }

    return {
      db,
      user: data.user
    };
  }

  /* =====================================
     CLIENT PATHWAY SELECTION

     This records the client's selected
     pathway. It is NOT a paid entitlement.
     ===================================== */

  async function saveChoice(choice) {
    if (
      saveBusy ||
      !["strength", "mana28", "lyfe"].includes(
        choice
      ) ||
      !savedProfile()
    ) {
      return;
    }

    saveBusy = true;

    try {
      const { db, user } =
        await dbSession();

      const {
        data: profile,
        error: profileError
      } = await db
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (
        profileError ||
        profile?.role !== "client"
      ) {
        return;
      }

      const { error } = await db
        .from("mana_client_pathways")
        .upsert({
          user_id: user.id,
          primary_pathway: choice,
          updated_at:
            new Date().toISOString()
        }, {
          onConflict: "user_id"
        });

      if (error) throw error;

      pendingChoice = null;

      window.dispatchEvent(
        new CustomEvent(
          "mana:pathway-selected",
          {
            detail: {
              pathway: choice
            }
          }
        )
      );

    } catch (error) {
      console.warn(
        "[Mana] Pathway selection:",
        error?.message || error
      );

    } finally {
      saveBusy = false;
    }
  }

  function onClientChoice(event) {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const card = target.closest(
      "#manaV80Strength," +
      "#manaV80Mana28," +
      "#manaV80Life"
    );

    if (
      !card ||
      !$("manaV80Home")?.contains(card)
    ) {
      return;
    }

    pendingChoice = {
      manaV80Strength: "strength",
      manaV80Mana28: "mana28",
      manaV80Life: "lyfe"
    }[card.id];

    if (pendingChoice) {
      saveChoice(pendingChoice);
    }
  }

  /* =====================================
     BUNDLED MANALYFE LABELS
     ===================================== */

  function addBundleLabels() {
    for (
      const id of [
        "manaV80Strength",
        "manaV80Mana28"
      ]
    ) {
      const card = $(id);

      if (
        !card ||
        card.querySelector(
          ".mcn-bundle-label"
        )
      ) {
        continue;
      }

      const label =
        document.createElement("span");

      label.className =
        "mcn-bundle-label";

      label.textContent =
        "MANA LYFE INCLUDED WITH PAID MEMBERSHIP";

      card.appendChild(label);
    }
  }

  /* =====================================
     CLOUD CLIENTS AND MEMBERSHIPS

     Coach Hub combines:
     - Existing client directory
     - Automatic pathway records
     - Generated Mana Strength snapshots
     - Existing specialised assignments
     - Verified subscription status
     ===================================== */

  async function loadData() {
    if (
      !coachVisible() ||
      loading
    ) {
      return;
    }

    loading = true;

    const ticket = ++request;

    try {
      const { db, user } =
        await dbSession();

      const {
        data: profile,
        error: profileError
      } = await db
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (
        profileError ||
        profile?.role !== "coach"
      ) {
        throw Error(
          "Coach access required"
        );
      }

      const results = await Promise.all([
        db.rpc(
          "coach_clients_summary"
        ),

        db.rpc(
          "mana_coach_pathway_summary"
        ),

        db
          .from(
            "client_program_assignments"
          )
          .select(
            "client_id,status,custom_programs(name)"
          )
          .eq(
            "coach_id",
            user.id
          )
          .eq(
            "status",
            "active"
          )
      ]);

      if (ticket !== request) {
        return;
      }

      for (const result of results) {
        if (result.error) {
          throw result.error;
        }
      }

      const map = new Map();

      (
        results[0].data || []
      ).forEach(row => {
        if (
          row.user_id &&
          !map.has(row.user_id)
        ) {
          map.set(
            row.user_id,
            {
              id: String(row.user_id),
              name: String(
                row.full_name || "Client"
              )
            }
          );
        }
      });

      people = [...map.values()]
        .sort(
          (a, b) =>
            a.name.localeCompare(
              b.name
            )
        );

      memberships =
        results[1].data || [];

      assignments =
        results[2].data || [];

      loaded = true;
      error = "";

    } catch (err) {
      loaded = false;

      error =
        err?.message ||
        "Could not load Coach Hub";

      console.warn(
        "[Mana Coach]",
        err
      );

    } finally {
      if (ticket === request) {
        loading = false;

        renderSummary();
        renderClients();
      }
    }
  }

  /* =====================================
     CLIENT GROUPING

     One person may appear in multiple
     pathways, but Unique Clients counts
     their user ID once.
     ===================================== */

  function groups() {
    const out = {
      strength: [],
      mana28: [],
      lyfe: [],
      unclassified: [],
      unassigned: []
    };

    const paid = new Set();

    if (!loaded) {
      return {
        out,
        paid
      };
    }

    const index = new Map(
      memberships.map(
        row => [
          String(row.user_id),
          row
        ]
      )
    );

    for (const client of people) {
      const member =
        index.get(client.id) || {};

      const keys = new Set();

      const paidPath =
        member.payment_active
          ? classify(
              member.paid_pathway
            )
          : "";

      const chosen = classify(
        member.primary_pathway
      );

      if (paidPath) {
        keys.add(paidPath);
      }

      if (chosen) {
        keys.add(chosen);
      }

      if (
        member.has_generated_strength
      ) {
        keys.add("strength");
      }

      const related =
        assignments.filter(
          assignment =>
            assignment.client_id ===
            client.id
        );

      let unclassified = false;

      related.forEach(assignment => {
        const program =
          assignment.custom_programs;

        const name =
          Array.isArray(program)
            ? program[0]?.name
            : program?.name;

        const identified =
          classify(name);

        if (identified) {
          keys.add(identified);
        } else {
          unclassified = true;
        }
      });

      /* Only a verified eligible paid
         membership grants bundled
         ManaLyfe status here. */

      if (member.manalyfe_included) {
        keys.add("lyfe");
        paid.add(client.id);
      }

      if (
        unclassified &&
        !keys.size
      ) {
        keys.add("unclassified");
      }

      if (!keys.size) {
        keys.add("unassigned");
      }

      keys.forEach(key => {
        out[key]?.push({
          ...client,

          included:
            key === "lyfe" &&
            Boolean(
              member.manalyfe_included
            )
        });
      });
    }

    return {
      out,
      paid
    };
  }

  /* =====================================
     CLIENT ACTIONS

     View Client uses existing profile.
     Build Program is optional.
     ===================================== */

  function clientRow(client) {
    return `
      <div class="mcn-client-row">

        <div class="mcn-client-name">
          ${safe(client.name)}

          ${client.included ? `
            <small class="mcn-included">
              INCLUDED
            </small>
          ` : ""}
        </div>

        <div class="mcn-client-actions">

          <button
            type="button"
            class="client-open mcn-view"
            data-client-id="${safe(client.id)}"
            data-client-name="${safe(client.name)}"
          >
            View Client
          </button>

          <button
            type="button"
            class="mcn-build"
            data-mcn-build-client="${safe(client.id)}"
          >
            Build Program
          </button>

        </div>
      </div>
    `;
  }

  /* =====================================
     EXPANDABLE PATHWAY CARD
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
            <strong>
              ${safe(title)}
            </strong>

            <small>
              ${safe(subtitle)}
            </small>
          </span>

          <span class="mcn-end">

            <span class="mcn-number">
              <strong>
                ${count}
              </strong>

              <small>
                ${unassigned
                  ? "CLIENTS"
                  : "ENROLLED"}
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
            ? members.map(
                clientRow
              ).join("")
            : `
              <p class="mcn-muted">
                ${loaded
                  ? "No clients in this group yet."
                  : "Loading confirmed enrolments…"}
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
    const host = $(
      "mcnSummary104707"
    );

    if (!host) return;

    const {
      out,
      paid
    } = groups();

    const count = key =>
      loaded
        ? out[key].length
        : "—";

    const classified = loaded
      ? people.filter(
          person =>
            [
              "strength",
              "mana28",
              "lyfe"
            ].some(
              key =>
                out[key].some(
                  client =>
                    client.id ===
                    person.id
                )
            )
        ).length
      : "—";

    host.innerHTML = `
      <div class="mcn-kicker">
        COACH OVERVIEW
      </div>

      <h2>
        Your Programs & Clients
      </h2>

      <p class="mcn-muted">
        Automatic training enrolments
        and included wellbeing access.
        Each person is counted once
        in the unique total.
      </p>

      <div class="mcn-stats">

        <div class="mcn-stat">
          <strong>
            ${loaded
              ? people.length
              : "—"}
          </strong>

          <small>
            Unique clients
          </small>
        </div>

        <div class="mcn-stat">
          <strong>
            ${classified}
          </strong>

          <small>
            Pathway clients
          </small>
        </div>

        <div class="mcn-stat">
          <strong>
            ${loaded
              ? paid.size
              : "—"}
          </strong>

          <small>
            Verified paid bundles
          </small>
        </div>

      </div>

      ${error ? `
        <p class="mcn-notice">
          ${safe(error)}
        </p>
      ` : ""}

      ${PATHWAYS.map(
        program =>
          card(
            program[1],
            program[2],
            program[3],
            out[program[0]],
            count(program[0])
          )
      ).join("")}

      ${loaded &&
        out.unclassified.length
          ? card(
              "Unclassified Program",
              "Custom program without a Mana pathway",
              "?",
              out.unclassified,
              out.unclassified.length
            )
          : ""
      }

      ${loaded &&
        out.unassigned.length
          ? card(
              "Unassigned Clients",
              "No recorded pathway yet",
              "○",
              out.unassigned,
              out.unassigned.length,
              true
            )
          : ""
      }

      <p class="mcn-muted mcn-footnote">
        ManaLyfe inclusion is verified
        from an active or trialing
        Mana Strength/Mana28 subscription.
        Choosing a pathway alone does
        not establish payment.
      </p>

      <div class="mcn-tools">

        <button
          type="button"
          data-mcn-route="clients"
        >
          <strong>
            Manage Clients
          </strong>

          <small>
            Open client profiles
          </small>
        </button>

        <button
          type="button"
          data-mcn-builder="1"
        >
          <strong>
            Specialised Program
          </strong>

          <small>
            Optional custom coaching plans
          </small>
        </button>

      </div>
    `;
  }

  /* =====================================
     CLIENT DIRECTORY
     ===================================== */

  function renderClients() {
    const host = $(
      "mcnList104707"
    );

    if (!host) return;

    const query = String(
      $("mcnSearch104707")
        ?.value || ""
    ).toLowerCase().trim();

    if (!loaded) {
      host.innerHTML = `
        <p class="mcn-muted">
          ${safe(
            error || "Loading clients…"
          )}
        </p>
      `;

      return;
    }

    const rows = people.filter(
      client =>
        client.name
          .toLowerCase()
          .includes(query)
    );

    host.innerHTML =
      rows.length
        ? rows.map(
            clientRow
          ).join("")
        : `
          <p class="mcn-muted">
            No matching clients.
          </p>
        `;
  }

  /* =====================================
     FIVE COACH HUB SCREENS
     ===================================== */

  function ensureSuite() {
    if ($(SUITE)) {
      return $(SUITE);
    }

    const home = $(HOME);
    if (!home) return null;

    const element =
      document.createElement(
        "section"
      );

    element.id = SUITE;

    element.innerHTML = `
      <section data-mcn-view="summary">
        <div id="mcnSummary104707"></div>
      </section>

      <section data-mcn-view="clients">

        <div class="mcn-kicker">
          CLIENT MANAGEMENT
        </div>

        <h2>Clients</h2>

        <p class="mcn-muted">
          Open a client profile, or choose
          Build Program when specialised
          coaching is requested.
        </p>

        <input
          id="mcnSearch104707"
          type="search"
          placeholder="Search clients…"
          aria-label="Search clients"
        >

        <div id="mcnList104707"></div>

      </section>

      <section data-mcn-view="chat">

        <div class="mcn-kicker">
          COACH COMMUNICATION
        </div>

        <h2>Chat</h2>

        <div class="mcn-panel">

          <h3>Coaching Inbox</h3>

          <p class="mcn-notice">
            Messaging connection pending.
            No conversations are fabricated.
          </p>

        </div>
      </section>

      <section data-mcn-view="payments">

        <div class="mcn-kicker">
          MEMBERSHIPS &amp; BILLING
        </div>

        <h2>Payments</h2>

        <div class="mcn-panel">

          <h3>
            Membership Management
          </h3>

          <div class="mcn-pay-grid">

            <div>
              <strong>
                Mana Strength
              </strong>

              <small>
                Paid membership ·
                ManaLyfe included
              </small>
            </div>

            <div>
              <strong>
                Mana28
              </strong>

              <small>
                Paid program ·
                ManaLyfe included
              </small>
            </div>

            <div>
              <strong>
                ManaLyfe
              </strong>

              <small>
                Included with eligible memberships
              </small>
            </div>

          </div>

          <p class="mcn-notice">
            Stripe Coach Hub billing dashboard
            is pending. Payment status is read
            from existing verified subscription
            records, not estimated.
          </p>

        </div>
      </section>

      <section data-mcn-view="settings">

        <div class="mcn-kicker">
          COACH ADMINISTRATION
        </div>

        <h2>Settings</h2>

        <div class="mcn-panel">

          <h3>
            Coaching Tools
          </h3>

          <div class="mcn-tools">

            <button
              type="button"
              data-mcn-builder="1"
            >
              <strong>
                Program Builder
              </strong>

              <small>
                Specialised programs only
              </small>
            </button>

            <button
              type="button"
              data-mcn-route="clients"
            >
              <strong>
                Manage Clients
              </strong>

              <small>
                Profiles and enrolments
              </small>
            </button>

          </div>
        </div>
      </section>
    `;

    home.appendChild(element);

    $("mcnSearch104707")
      ?.addEventListener(
        "input",
        renderClients
      );

    return element;
  }

  /* =====================================
     BOTTOM NAVIGATION
     ===================================== */

  function updateNav() {
    const nav = $(NAV);
    if (!nav) return;

    TABS.forEach(
      (tab, index) => {
        const button =
          nav.querySelector(
            `[data-coach-page="${tab[1]}"]`
          );

        if (!button) return;

        button.dataset.mcnTab =
          tab[0];

        button.style.order =
          String(index + 1);

        let icon =
          button.querySelector(
            ".mana-v970-tab-icon"
          );

        if (!icon) {
          icon =
            document.createElement(
              "span"
            );

          icon.className =
            "mana-v970-tab-icon";

          button.prepend(icon);
        }

        icon.textContent = tab[3];

        [...button.childNodes]
          .filter(
            node =>
              node.nodeType === 3
          )
          .forEach(
            node =>
              node.textContent = ""
          );

        let label =
          button.querySelector(
            ".mcn-tab-label"
          );

        if (!label) {
          label =
            document.createElement(
              "span"
            );

          label.className =
            "mcn-tab-label";

          button.appendChild(label);
        }

        label.textContent = tab[2];

        button.classList.toggle(
          "active",
          page === tab[0]
        );
      }
    );
  }

  function display() {
    ensureSuite()
      ?.querySelectorAll(
        "[data-mcn-view]"
      )
      .forEach(
        element => {
          element.hidden =
            element.dataset.mcnView !==
            page;
        }
      );

    $(HOME)?.classList.toggle(
      "mcn-summary-active",
      page === "summary"
    );
  }

  function go(next) {
    if (!coachVisible()) return;

    page = TABS.some(
      tab => tab[0] === next
    )
      ? next
      : "summary";

    if (
      typeof window.showCoachPage ===
      "function"
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
      (
        page === "summary" ||
        page === "clients"
      ) &&
      !loading
    ) {
      loadData();
    }

    window.scrollTo(0, 0);
  }

  /* =====================================
     OPTIONAL SPECIALISED PROGRAM BUILDER
     ===================================== */

  function builder(client = null) {
    if (
      typeof window.openManaProgramBuilder ===
      "function"
    ) {
      window.openManaProgramBuilder(
        client
      );
    } else {
      window.alert(
        "Program Builder is unavailable."
      );
    }
  }

  /* =====================================
     CLICK HANDLING
     ===================================== */

  function onClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    onClientChoice(event);

    if (!coachVisible()) return;

    const nav = target.closest(
      `#${NAV} [data-coach-page]`
    );

    if (nav) {
      const tab = TABS.find(
        item =>
          item[0] ===
          nav.dataset.mcnTab
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

      go(
        route.dataset.mcnRoute
      );

      return;
    }

    const build = target.closest(
      `#${SUITE} [data-mcn-build-client]`
    );

    if (build) {
      event.preventDefault();
      event.stopImmediatePropagation();

      const selected = people.find(
        client =>
          client.id ===
          build.dataset.mcnBuildClient
      );

      if (selected) {
        builder({
          id: selected.id,
          name: selected.name
        });
      }

      return;
    }

    const generic = target.closest(
      `#${SUITE} [data-mcn-builder]`
    );

    if (generic) {
      event.preventDefault();
      event.stopImmediatePropagation();

      builder();
    }

    /* Existing .client-open handler
       opens the original client profile. */
  }

  /* =====================================
     COACH WORKSPACE RESTORATION
     ===================================== */

  function checkWorkspace() {
    const now = coachVisible();

    if (now && !lastCoach) {
      lastCoach = true;
      page = "summary";

      display();
      updateNav();
      loadData();

    } else if (!now) {
      lastCoach = false;
    }
  }

  /* =====================================
     PREMIUM COLOUR SYSTEM
     ===================================== */

  function styles() {
    if ($(STYLE)) return;

    const element =
      document.createElement("style");

    element.id = STYLE;

    element.textContent = `

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
      }

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
        -webkit-text-fill-color:
          #FF7927 !important;
      }

      #${SUITE},
      #${SUITE} * {
        box-sizing: border-box;
      }

      #${SUITE} {
        color: #FFFFFF;
        font-family: inherit;
      }

      #${SUITE}
      [data-mcn-view][hidden] {
        display: none !important;
      }

      #${SUITE}
      [data-mcn-view] {
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

      #${SUITE} .mcn-footnote {
        margin: 14px 0;
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

      #${SUITE} .mcn-included {
        border: 1px solid #FF7927;
        border-radius: 8px;
        padding: 5px 8px;
        color: #FF7927 !important;
        font-size: 10px;
      }

      #${SUITE} .mcn-client-actions {
        display: grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap: 9px;
      }

      #${SUITE}
      .mcn-client-actions button {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 41px;
        padding: 10px;
        border: 1px solid #FF7927 !important;
        border-radius: 10px;
        background: #15171A !important;
        color: #FFFFFF !important;
        -webkit-text-fill-color:
          #FFFFFF !important;
        font-size: 11px !important;
        font-weight: 900 !important;
        cursor: pointer;
      }

      #${SUITE}
      .mcn-client-actions .mcn-build {
        background: #25190F !important;
        color: #FF7927 !important;
        -webkit-text-fill-color:
          #FF7927 !important;
      }

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

      #${SUITE} #mcnSearch104707 {
        width: 100%;
        padding: 14px;
        margin: 16px 0;
        background: #15171A !important;
        color: #FFFFFF !important;
        border: 1px solid #48515B !important;
        border-radius: 12px;
        font-size: 14px;
      }

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

      #manaV80Strength .mcn-bundle-label,
      #manaV80Mana28 .mcn-bundle-label {
        display: block !important;
        width: 100%;
        margin-top: 9px;
        font: 800 10px/1.35
          system-ui,sans-serif !important;
        letter-spacing: .04em;
        color: #FF7927 !important;
        -webkit-text-fill-color:
          #FF7927 !important;
        text-align: left;
      }

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

    document.head.appendChild(element);
  }

  /* =====================================
     INITIALISE
     ===================================== */

  function checkWorkspace() {
    const now = coachVisible();

    if (now && !lastCoach) {
      lastCoach = true;
      page = "summary";

      display();
      updateNav();
      loadData();

    } else if (!now) {
      lastCoach = false;
    }
  }

  function init() {
    styles();
    ensureSuite();
    display();
    updateNav();
    addBundleLabels();

    document.addEventListener(
      "click",
      onClick,
      true
    );

    window.addEventListener(
      "mana:profile-synced",
      () => {
        if (pendingChoice) {
          saveChoice(pendingChoice);
        }
      }
    );

    window.addEventListener(
      "mana:strength-program-built",
      () => {
        if (
          pendingChoice === "strength"
        ) {
          saveChoice("strength");
        }
      }
    );

    const view = $("coachView");

    if (view) {
      new MutationObserver(
        checkWorkspace
      ).observe(view, {
        attributes: true,
        attributeFilter: [
          "class"
        ]
      });
    }

    window.addEventListener(
      "pageshow",
      () => {
        checkWorkspace();
        addBundleLabels();

        if (coachVisible()) {
          loadData();
        }
      }
    );

    checkWorkspace();

    console.log(
      "[Mana Movement] Coach Hub 104707"
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
