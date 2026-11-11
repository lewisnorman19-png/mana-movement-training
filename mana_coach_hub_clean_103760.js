
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH HUB — CONNECTED PREMIUM DASHBOARD
   BUILD 104730

   COMPLETE REPLACEMENT FILE:
   mana_coach_hub_clean_103760.js

   NEW HOME:
   - Mana Movement runner header
   - Coaching priorities
   - Three program cards
   - Manage Clients quick action
   - Create Program quick action
   - Real existing client directory

   PRESERVES:
   - Coach and Client login choice
   - Existing Coach Shell navigation
   - Individual coaching profiles
   - Assigned Programs panel
   - Existing Program Builder
   - Supabase authentication and data
   - All client-side programs

   No automatic database writes.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104730";
  const ID = "manaCoachHubClean103760";
  const STYLE_ID = "manaCoachHubCleanStyle104730";
  const HOME_ID = "coachHomePage";
  const NAV_ID = "manaV97CoachNav";
  const RUNNER = "ui/mana-runner-logo.png";

  if (window.MANA_COACH_HUB_CLEAN_103760) {
    return;
  }

  window.MANA_COACH_HUB_CLEAN_103760 = true;

  const $ = id => document.getElementById(id);

  let page = "home";
  let currentProgram = "strength";

  const PROGRAMS = [
    {
      id: "strength",
      name: "Mana Strength",
      symbol: "◆",
      description:
        "Personalised strength, performance and coaching."
    },
    {
      id: "mana28",
      name: "Mana28",
      symbol: "▦",
      description:
        "Structured 28-day training and healthy habits."
    },
    {
      id: "lyfe",
      name: "ManaLyfe",
      symbol: "♡",
      description:
        "Movement, routine, mindset and wellbeing."
    }
  ];

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

  /* =====================================
     READ EXISTING CLIENTS

     Never invent program assignments.
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
        element.querySelector("strong")
          ?.textContent ||
        "Client"
      ).trim();

      const raw = String(
        element.dataset.program ||
        element.dataset.clientProgram ||
        ""
      ).trim().toLowerCase();

      let program = "";

      if (
        raw === "strength" ||
        raw === "mana strength"
      ) {
        program = "strength";
      } else if (
        raw === "mana28" ||
        raw === "mana 28"
      ) {
        program = "mana28";
      } else if (
        raw === "manalyfe" ||
        raw === "mana lyfe" ||
        raw === "lyfe"
      ) {
        program = "lyfe";
      }

      map.set(id, {
        id,
        name,
        program
      });
    });

    return Array.from(map.values()).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }

  function liveCount(id) {
    const text = String(
      $(id)?.textContent || ""
    ).trim();

    return /^\d+$/.test(text) ? text : "—";
  }

  /* =====================================
     PREMIUM DASHBOARD CSS
     ===================================== */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      #${HOME_ID} {
        width: min(1100px,calc(100% - 24px))
          !important;

        max-width: 1100px !important;
        margin: 0 auto !important;
      }

      #${HOME_ID} > :not(#${ID}) {
        display: none !important;
      }

      #${ID} {
        width: 100%;
        margin: 0 0 115px;
        color: #FFFFFF;
        font-family: inherit;
      }

      #${ID} * {
        box-sizing: border-box;
      }

      #${ID} button {
        font: inherit;
        cursor: pointer;
      }

      #${ID} button:focus-visible {
        outline: 2px solid #FF7927;
        outline-offset: 3px;
      }

      /* =================================
         RUNNER HEADER
         ================================= */

      #${ID} .hub-hero {
        display: flex;
        align-items: center;
        gap: 15px;

        margin-bottom: 15px;
        padding: 22px;

        background: #15171A;
        border: 1px solid #626973;
        border-radius: 22px;
      }

      #${ID} .hub-runner {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 80px;
        height: 68px;
        flex: 0 0 80px;

        border: 0 !important;
        border-radius: 0 !important;
        outline: 0 !important;
        box-shadow: none !important;
        background: transparent !important;
        overflow: visible;
      }

      #${ID} .hub-runner img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;

        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      #${ID} .hub-kicker {
        color: #FF7927;
        font-size: 10px;
        font-weight: 950;
        letter-spacing: .13em;
      }

      #${ID} .hub-title {
        margin: 7px 0 6px;

        color: #FFFFFF;
        font-size: clamp(29px,4vw,41px);
        font-weight: 950;
        line-height: 1.12;
      }

      #${ID} .hub-sub {
        color: #C1C6CE;
        font-size: 12px;
        line-height: 1.5;
      }

      /* =================================
         SECTIONS
         ================================= */

      #${ID} .hub-panel {
        margin-bottom: 15px;
        padding: 20px;

        background: #15171A;
        border: 1px solid #626973;
        border-radius: 21px;
      }

      #${ID} .hub-section-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;

        margin-bottom: 15px;
      }

      #${ID} .hub-section-heading h3 {
        margin: 0;
        color: #FFFFFF;
        font-size: 18px;
        font-weight: 900;
      }

      #${ID} .hub-section-tag {
        color: #FF7927;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .05em;
      }

      /* =================================
         NEEDS ATTENTION
         ================================= */

      #${ID} .hub-alert-grid {
        display: grid;
        grid-template-columns:
          repeat(3,minmax(0,1fr));
        gap: 10px;
      }

      #${ID} .hub-alert {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        min-height: 144px;
        padding: 13px 8px;

        background: #1B1E23;
        border: 1px solid #535B65;
        border-radius: 16px;

        text-align: center;
        color: #FFFFFF;
      }

      #${ID} .hub-alert-icon {
        color: #FF7927;
        font-size: 24px;
        line-height: 1.1;
      }

      #${ID} .hub-alert-number {
        margin-top: 8px;

        color: #FF7927;
        font-size: 26px;
        font-weight: 950;
        line-height: 1;
      }

      #${ID} .hub-alert strong {
        display: block;
        margin-top: 8px;

        color: #FFFFFF;
        font-size: 13px;
      }

      #${ID} .hub-alert small {
        display: block;
        margin-top: 5px;

        color: #C1C6CE;
        font-size: 11px;
        line-height: 1.45;
      }

      #${ID} .hub-alert:not(button) {
        cursor: default;
      }

      /* =================================
         THREE PROGRAM CARDS
         ================================= */

      #${ID} .hub-program-grid {
        display: grid;
        grid-template-columns:
          repeat(3,minmax(0,1fr));
        gap: 11px;
      }

      #${ID} .hub-program {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 9px;

        min-height: 155px;
        padding: 18px 10px;

        background: #1B1E23;
        border: 1px solid #FF7927;
        border-radius: 17px;

        color: #FFFFFF;
        text-align: center;
      }

      #${ID} .hub-program-symbol {
        color: #FF7927;
        font-size: 24px;
        line-height: 1;
      }

      #${ID} .hub-program strong {
        color: #FFFFFF;
        font-size: 15px;
        font-weight: 900;
      }

      #${ID} .hub-program small {
        color: #C1C6CE;
        font-size: 11px;
        line-height: 1.45;
      }

      #${ID} .hub-program:hover,
      #${ID} .hub-quick:hover,
      #${ID} .hub-client:hover {
        background: #272B32;
      }

      /* =================================
         QUICK ACTIONS
         ================================= */

      #${ID} .hub-quick-grid {
        display: grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap: 11px;
      }

      #${ID} .hub-quick {
        display: flex;
        align-items: center;
        gap: 13px;

        min-height: 76px;
        padding: 15px;

        background: #1B1E23;
        border: 1px solid #59616C;
        border-radius: 15px;

        color: #FFFFFF;
        text-align: left;
      }

      #${ID} .hub-quick-icon {
        display: grid;
        place-items: center;
        flex: 0 0 41px;

        width: 41px;
        height: 41px;

        border: 1px solid #FF7927;
        border-radius: 11px;

        color: #FF7927;
        font-size: 21px;
      }

      #${ID} .hub-quick-content {
        flex: 1;
        min-width: 0;
      }

      #${ID} .hub-quick strong {
        display: block;
        color: #FFFFFF;
        font-size: 14px;
      }

      #${ID} .hub-quick small {
        display: block;
        margin-top: 4px;
        color: #C1C6CE;
        font-size: 11px;
      }

      #${ID} .hub-quick-arrow {
        color: #FF7927;
        font-size: 19px;
      }

      /* =================================
         CLIENT DIRECTORY
         ================================= */

      #${ID} .hub-back {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        padding: 11px 13px;

        background: #171A1F;
        border: 1px solid #FF7927;
        border-radius: 11px;

        color: #FF7927;
        font-size: 12px;
        font-weight: 900;
      }

      #${ID} .hub-directory-title {
        margin: 17px 0 8px;

        color: #FFFFFF;
        font-size: 20px;
        font-weight: 900;
      }

      #${ID} .hub-help {
        margin: 9px 0 16px;

        color: #C1C6CE;
        font-size: 12px;
        line-height: 1.6;
      }

      #${ID} .hub-client {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;

        width: 100%;
        min-height: 58px;
        margin-top: 9px;
        padding: 14px;

        background: #20242B;
        border: 1px solid #59616C;
        border-radius: 13px;

        color: #FFFFFF;
        text-align: left;
      }

      #${ID} .hub-client strong {
        color: #FFFFFF;
        font-size: 14px;
      }

      #${ID} .hub-client span {
        color: #FF7927;
        font-size: 12px;
        font-weight: 850;
      }

      /* =================================
         MOBILE
         ================================= */

      @media(max-width:600px) {

        #${HOME_ID} {
          width: calc(100% - 16px)
            !important;
        }

        #${ID} .hub-hero {
          padding: 15px;
          gap: 11px;
          border-radius: 18px;
        }

        #${ID} .hub-runner {
          width: 56px;
          height: 54px;
          flex-basis: 56px;
        }

        #${ID} .hub-kicker {
          font-size: 8px;
        }

        #${ID} .hub-title {
          font-size: 27px;
        }

        #${ID} .hub-sub {
          font-size: 11px;
        }

        #${ID} .hub-panel {
          padding: 14px;
          border-radius: 17px;
        }

        #${ID} .hub-alert-grid,
        #${ID} .hub-program-grid {
          gap: 6px;
        }

        #${ID} .hub-alert {
          min-height: 135px;
          padding: 12px 4px;
        }

        #${ID} .hub-alert strong {
          font-size: 10px;
        }

        #${ID} .hub-alert small {
          font-size: 9px;
        }

        #${ID} .hub-alert-number {
          font-size: 23px;
        }

        #${ID} .hub-program {
          padding: 12px 5px;
          min-height: 148px;
        }

        #${ID} .hub-program strong {
          font-size: 11px;
        }

        #${ID} .hub-program small {
          font-size: 9px;
        }

        #${ID} .hub-quick-grid {
          grid-template-columns: 1fr;
        }

        #${ID} .hub-client {
          padding: 12px;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================
     COACH HUB ROOT
     ===================================== */

  function root() {
    const home = $(HOME_ID);

    if (!home) return null;

    installStyles();

    let target = $(ID);

    if (!target) {
      target = document.createElement("section");
      target.id = ID;

      target.setAttribute(
        "aria-label",
        "Mana Movement Coach Hub"
      );

      home.prepend(target);

      target.addEventListener("click", onClick);
    }

    return target;
  }

  /* =====================================
     RUNNER HEADER
     ===================================== */

  function header(subtitle) {
    return `
      <div class="hub-hero">
        <div class="hub-runner">
          <img
            src="${RUNNER}"
            alt="Mana Movement runner logo"
          >
        </div>

        <div>
          <div class="hub-kicker">
            MANA MOVEMENT · COACH OPERATIONS
          </div>

          <h2 class="hub-title">
            COACH HUB
          </h2>

          <div class="hub-sub">
            ${escapeHTML(subtitle)}
          </div>
        </div>
      </div>
    `;
  }

  /* =====================================
     HOME DASHBOARD
     ===================================== */

  function homeHTML() {
    const all = clients();

    return `
      ${header(
        "Your clients. Your programs. Your coaching."
      )}

      <section class="hub-panel">
        <div class="hub-section-heading">
          <h3>Needs Your Attention</h3>
          <span class="hub-section-tag">
            COACH PRIORITIES
          </span>
        </div>

        <div class="hub-alert-grid">

          <div class="hub-alert">
            <div class="hub-alert-icon">♧</div>
            <div class="hub-alert-number">—</div>
            <strong>Chats</strong>
            <small>Inbox connection pending</small>
          </div>

          <button
            type="button"
            class="hub-alert"
            data-action="checkins"
          >
            <div class="hub-alert-icon">☷</div>
            <div class="hub-alert-number">
              ${escapeHTML(liveCount(
                "alertCountCheckin"
              ))}
            </div>
            <strong>Check-ins</strong>
            <small>Review client updates</small>
          </button>

          <button
            type="button"
            class="hub-alert"
            data-action="requests"
          >
            <div class="hub-alert-icon">▣</div>
            <div class="hub-alert-number">
              ${escapeHTML(liveCount(
                "alertCountStrength"
              ))}
            </div>
            <strong>Block Requests</strong>
            <small>Strength training alerts</small>
          </button>

        </div>
      </section>

      <section class="hub-panel">
        <div class="hub-section-heading">
          <h3>Your Programs</h3>
          <span class="hub-section-tag">
            THREE PATHWAYS
          </span>
        </div>

        <div class="hub-program-grid">
          ${PROGRAMS.map(program => `
            <button
              type="button"
              class="hub-program"
              data-program="${program.id}"
            >
              <span class="hub-program-symbol">
                ${program.symbol}
              </span>

              <strong>
                ${escapeHTML(program.name)}
              </strong>

              <small>
                ${escapeHTML(program.description)}
              </small>
            </button>
          `).join("")}
        </div>

        <p class="hub-help">
          ${all.length} existing client records
          found. Verified program assignments
          appear inside individual client profiles.
        </p>
      </section>

      <section class="hub-panel">
        <div class="hub-section-heading">
          <h3>Quick Actions</h3>
          <span class="hub-section-tag">
            COACH TOOLS
          </span>
        </div>

        <div class="hub-quick-grid">

          <button
            type="button"
            class="hub-quick"
            data-action="clients"
          >
            <span class="hub-quick-icon">♙</span>

            <span class="hub-quick-content">
              <strong>Manage Clients</strong>
              <small>
                Search and open coaching profiles
              </small>
            </span>

            <span class="hub-quick-arrow">›</span>
          </button>

          <button
            type="button"
            class="hub-quick"
            data-action="builder"
          >
            <span class="hub-quick-icon">＋</span>

            <span class="hub-quick-content">
              <strong>Create Program</strong>
              <small>
                Open the existing Program Builder
              </small>
            </span>

            <span class="hub-quick-arrow">›</span>
          </button>

        </div>
      </section>
    `;
  }

  /* =====================================
     PROGRAM CLIENT DIRECTORY
     ===================================== */

  function clientButton(client) {
    return `
      <button
        type="button"
        class="hub-client"
        data-client="${escapeHTML(client.id)}"
      >
        <strong>${escapeHTML(client.name)}</strong>
        <span>Open Profile →</span>
      </button>
    `;
  }

  function programHTML() {
    const program = PROGRAMS.find(
      item => item.id === currentProgram
    ) || PROGRAMS[0];

    const all = clients();

    const assigned = all.filter(
      client => client.program === currentProgram
    );

    const unclassified = all.filter(
      client => !client.program
    );

    return `
      ${header(
        program.name + " · Client Management"
      )}

      <section class="hub-panel">

        <button
          type="button"
          class="hub-back"
          data-action="back"
        >
          ← Coach Hub
        </button>

        <h3 class="hub-directory-title">
          ${escapeHTML(program.name)}
        </h3>

        <p class="hub-help">
          Open a client profile to review
          their real saved programs,
          training activity and coaching tools.
        </p>

        <h3 class="hub-directory-title">
          Assigned Clients
        </h3>

        ${
          assigned.length
            ? assigned.map(clientButton).join("")
            : `
              <p class="hub-help">
                No assignment for this pathway
                is confirmed in the current
                dashboard directory.
              </p>
            `
        }

        <h3 class="hub-directory-title">
          Existing Client Directory
        </h3>

        <p class="hub-help">
          Clients without confirmed pathway
          classifications remain available
          here. Opening their profile does not
          change their training program.
        </p>

        ${
          unclassified.length
            ? unclassified.map(clientButton).join("")
            : `
              <p class="hub-help">
                No unclassified client records.
              </p>
            `
        }

      </section>
    `;
  }

  /* =====================================
     RENDER
     ===================================== */

  function draw() {
    const target = root();

    if (!target) return;

    target.innerHTML =
      page === "program"
        ? programHTML()
        : homeHTML();
  }

  /* =====================================
     EXISTING COACH NAVIGATION
     ===================================== */

  function openCoachTab(tab) {
    const button = document.querySelector(
      `#${NAV_ID} [data-coach-page="${tab}"]`
    );

    if (button) {
      button.click();
      return true;
    }

    if (
      typeof window.showCoachPage ===
      "function"
    ) {
      window.showCoachPage(tab);
      return true;
    }

    return false;
  }

  function openClientProfile(clientId) {
    const client = clients().find(
      item => item.id === clientId
    );

    if (!client) return;

    if (
      typeof window.openCoachClientDetail !==
      "function"
    ) {
      alert(
        "Client detail is not available. " +
        "Please refresh the app."
      );
      return;
    }

    window.openCoachClientDetail(
      client.id,
      client.name
    );
  }

  /* =====================================
     DASHBOARD BUTTON ACTIONS
     ===================================== */

  function onClick(event) {
    const button = event.target.closest("button");

    if (!button) return;

    const program = button.dataset.program;
    const client = button.dataset.client;
    const action = button.dataset.action;

    if (program) {
      currentProgram = program;
      page = "program";

      draw();
      window.scrollTo(0, 0);
      return;
    }

    if (client) {
      openClientProfile(client);
      return;
    }

    if (action === "back") {
      page = "home";
      draw();
      window.scrollTo(0, 0);
      return;
    }

    if (action === "clients") {
      openCoachTab("fuel");
      return;
    }

    if (action === "builder") {
      if (
        typeof window.openManaProgramBuilder ===
        "function"
      ) {
        window.openManaProgramBuilder();
      } else {
        alert(
          "The Program Builder is unavailable. " +
          "Please refresh the app."
        );
      }
      return;
    }

    if (action === "checkins") {
      if (
        !openCoachTab("progress")
      ) {
        alert(
          "Coach Progress is unavailable."
        );
      }
      return;
    }

    if (action === "requests") {
      page = "program";
      currentProgram = "strength";
      draw();
      window.scrollTo(0, 0);
    }
  }

  /* =====================================
     INITIALISE
     ===================================== */

  function init() {
    if (!$(HOME_ID)) return;

    installStyles();
    root();
    draw();

    /* Return to dashboard when the
       existing Coach Home tab is selected. */

    document.addEventListener(
      "click",
      event => {
        const homeButton = event.target.closest(
          `#${NAV_ID} [data-coach-page="home"]`
        );

        if (!homeButton) return;

        page = "home";

        draw();
      }
    );

    /* Existing client-detail Back button
       retains its original functionality. */

    window.refreshManaCoachHubClean = draw;
    window.MANA_COACH_HUB_BUILD = BUILD;

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
