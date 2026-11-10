
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH HUB — PREMIUM RUNNER DASHBOARD
   BUILD 104680

   COMPLETE REPLACEMENT:
   mana_coach_hub_clean_103760.js

   ADDS:
   - Official Mana Movement runner header
   - Premium orange / black / white / silver theme
   - Cleaner coach dashboard and client directory
   - Consistent program cards
   - Mobile and desktop polish

   PRESERVES:
   - Existing client directory data
   - Existing client profile navigation
   - Original program grouping behaviour
   - Current coach alerts
   - Coach authentication and logout
   - Supabase data and program assignments
   - All client-side features

   Does not create or alter database records.
   ===================================================== */

(() => {
  "use strict";

  if (window.MANA_COACH_HUB_CLEAN_103760) return;
  window.MANA_COACH_HUB_CLEAN_103760 = true;

  const BUILD = "104680";
  const ID = "manaCoachHubClean103760";
  const STYLE_ID = "manaCoachHubCleanStyle103760";
  const HOME_ID = "coachHomePage";
  const RUNNER = "ui/mana-runner-logo.png";

  const programs = [
    {
      id: "strength",
      name: "Mana Strength",
      icon: "◆"
    },
    {
      id: "mana28",
      name: "Mana28",
      icon: "▦"
    },
    {
      id: "lyfe",
      name: "ManaLyfe",
      icon: "♡"
    }
  ];

  let page = "home";
  let currentProgram = "strength";
  let lastClientId = "";

  const $ = id => document.getElementById(id);

  function html(value) {
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

  /* =====================================
     EXISTING CLIENT DIRECTORY

     Use real client data from the existing
     coach dashboard. Do not fabricate
     program assignments.
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

      const raw = String(
        element.dataset.program ||
        element.dataset.clientProgram ||
        element.closest("[data-program]")
          ?.dataset.program ||
        ""
      ).toLowerCase().trim();

      const program =
        /^(strength|mana strength)$/.test(raw)
          ? "strength"
          : /^(mana28|mana 28)$/.test(raw)
            ? "mana28"
            : /^(manalyfe|mana lyfe|lyfe|life)$/
                .test(raw)
              ? "lyfe"
              : "";

      map.set(id, {
        id,
        name,
        program
      });
    });

    return [...map.values()].sort(
      (a,b) => a.name.localeCompare(b.name)
    );
  }

  function count(id) {
    const value = String(
      $(id)?.textContent || ""
    ).trim();

    return /^\d+$/.test(value) ? value : "—";
  }

  /* =====================================
     PREMIUM COACH HUB STYLES
     ===================================== */

  function installStyle() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      #coachHomePage {
        width: min(
          1100px,
          calc(100% - 24px)
        ) !important;

        max-width: 1100px !important;
        margin: 0 auto !important;
      }

      #coachHomePage > :not(#${ID}) {
        display: none !important;
      }

      #${ID} {
        color: #FFFFFF;
        margin: 0 0 115px;
        font-family: inherit;
      }

      #${ID} * {
        box-sizing: border-box;
      }

      #${ID} button {
        font: inherit;
        cursor: pointer;
      }

      /* =================================
         RUNNER HEADER
         ================================= */

      #${ID} .hub-hero {
        display: flex;
        align-items: center;
        gap: 18px;

        margin-bottom: 17px;
        padding: 24px;

        border: 1px solid #626973;
        border-radius: 24px;

        background: #15171A;
        background-image: none;
      }

      #${ID} .hub-runner {
        width: 91px;
        height: 76px;
        flex: 0 0 91px;

        display: flex;
        align-items: center;
        justify-content: center;

        background: #08090B;
        border-radius: 15px;
        overflow: hidden;
      }

      #${ID} .hub-runner img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      #${ID} .hub-brand {
        min-width: 0;
        flex: 1;
      }

      #${ID} .hub-kicker {
        color: #FF7927;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .16em;
        line-height: 1.5;
      }

      #${ID} .hub-title {
        margin: 6px 0;

        color: #FFFFFF;
        font-size: clamp(
          27px,
          4vw,
          41px
        );
        font-weight: 950;
        line-height: 1.12;
      }

      #${ID} .hub-sub {
        color: #C1C6CE;
        font-size: 13px;
        line-height: 1.55;
      }

      /* =================================
         DASHBOARD PANELS
         ================================= */

      #${ID} .hub-panel {
        margin-bottom: 17px;
        padding: 20px;

        background: #15171A;
        border: 1px solid #626973;
        border-radius: 22px;
      }

      #${ID} h3 {
        margin: 0 0 15px;
        color: #FFFFFF;
        font-size: 18px;
        font-weight: 900;
      }

      #${ID} .hub-grid {
        display: grid;
        grid-template-columns: repeat(
          3,
          minmax(0,1fr)
        );
        gap: 12px;
      }

      /* =================================
         PROGRAM CARDS
         ================================= */

      #${ID} .hub-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;

        min-height: 160px;
        padding: 18px 11px;

        background: #1B1E23;
        background-image: none;

        border: 1px solid #FF7927;
        border-radius: 18px;

        color: #FFFFFF;
        text-align: center;
        box-shadow: none;
      }

      #${ID} .hub-card:hover,
      #${ID} .hub-item:hover {
        background: #252931;
        border-color: #FF7927;
      }

      #${ID} .hub-symbol {
        color: #FF7927;
        font-size: 25px;
        line-height: 1;
      }

      #${ID} .hub-card strong {
        color: #FFFFFF;
        font-size: 15px;
        font-weight: 900;
      }

      #${ID} .hub-card small {
        color: #C1C6CE;
        font-size: 12px;
        line-height: 1.5;
      }

      #${ID} .hub-figure {
        color: #FF7927;
        font-size: 26px;
        font-weight: 950;
        line-height: 1.15;
      }

      /* =================================
         ATTENTION CARDS
         ================================= */

      #${ID} .hub-alert {
        min-height: 116px;
        padding: 15px 9px;

        background: #1B1E23;
        border: 1px solid #59616C;
        border-radius: 15px;

        color: #FFFFFF;
        text-align: center;
      }

      #${ID} .hub-alert strong {
        display: block;
        margin-top: 8px;

        color: #FFFFFF;
        font-size: 13px;
        font-weight: 850;
      }

      #${ID} .hub-alert small {
        display: block;
        margin-top: 6px;

        color: #C1C6CE;
        font-size: 11px;
        line-height: 1.45;
      }

      /* =================================
         CLIENT DIRECTORY
         ================================= */

      #${ID} .hub-heading {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 13px;

        margin-bottom: 18px;
      }

      #${ID} .hub-heading h3 {
        margin: 0;
      }

      #${ID} .hub-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;

        width: 100%;
        margin-top: 9px;
        padding: 16px;

        background: #20242B;
        border: 1px solid #59616C;
        border-radius: 14px;

        color: #FFFFFF;
        text-align: left;
      }

      #${ID} .hub-item strong {
        color: #FFFFFF;
        font-size: 14px;
        font-weight: 900;
      }

      #${ID} .hub-item span {
        color: #FF7927;
        font-size: 13px;
        font-weight: 800;
      }

      #${ID} .hub-help {
        margin: 12px 0;

        color: #C1C6CE;
        font-size: 12px;
        line-height: 1.65;
      }

      /* =================================
         BACK / REFRESH BUTTONS
         ================================= */

      #${ID} .hub-back,
      #${ID} .hub-secondary {
        padding: 11px 14px;

        background: #171A1F;
        border: 1px solid #FF7927;
        border-radius: 12px;

        color: #FF7927;
        font-size: 12px;
        font-weight: 900;
      }

      #${ID} .hub-back:hover,
      #${ID} .hub-secondary:hover {
        background: #392013;
      }

      #${ID} button:focus-visible {
        outline: 2px solid #FF7927;
        outline-offset: 3px;
      }

      /* =================================
         MOBILE
         ================================= */

      @media (max-width: 600px) {

        #coachHomePage {
          width: calc(
            100% - 16px
          ) !important;
        }

        #${ID} .hub-hero {
          padding: 16px;
          gap: 11px;
          border-radius: 18px;
        }

        #${ID} .hub-runner {
          width: 58px;
          height: 57px;
          flex-basis: 58px;
        }

        #${ID} .hub-kicker {
          font-size: 8px;
          letter-spacing: .10em;
        }

        #${ID} .hub-title {
          font-size: 28px;
        }

        #${ID} .hub-sub {
          font-size: 11px;
        }

        #${ID} .hub-panel {
          padding: 15px;
          border-radius: 18px;
        }

        #${ID} .hub-grid {
          gap: 7px;
        }

        #${ID} .hub-card {
          min-height: 138px;
          padding: 11px 5px;
          gap: 8px;
        }

        #${ID} .hub-card strong {
          font-size: 11px;
        }

        #${ID} .hub-card small {
          font-size: 9px;
        }

        #${ID} .hub-alert {
          padding: 12px 5px;
        }

        #${ID} .hub-alert strong {
          font-size: 10px;
        }

        #${ID} .hub-alert small {
          font-size: 9px;
        }

        #${ID} .hub-item {
          padding: 13px 11px;
        }

        #${ID} .hub-item span {
          font-size: 11px;
          white-space: nowrap;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================
     EXISTING DASHBOARD CONTAINER
     ===================================== */

  function root() {
    const home = $(HOME_ID);

    if (!home) return null;

    if ($(ID)) return $(ID);

    installStyle();

    const section = document.createElement("section");

    section.id = ID;
    section.setAttribute(
      "aria-label",
      "Mana Movement Coach Hub"
    );

    home.prepend(section);

    section.addEventListener(
      "click",
      onClick
    );

    return section;
  }

  /* =====================================
     OFFICIAL RUNNER HEADER
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

        <div class="hub-brand">

          <div class="hub-kicker">
            MANA MOVEMENT · COACH OPERATIONS
          </div>

          <h2 class="hub-title">
            COACH HUB
          </h2>

          <div class="hub-sub">
            ${html(subtitle)}
          </div>

        </div>

      </div>
    `;
  }

  function clientButton(client) {
    return `
      <button
        type="button"
        class="hub-item"
        data-client="${html(client.id)}"
      >
        <strong>
          ${html(client.name)}
        </strong>

        <span>
          Open profile →
        </span>
      </button>
    `;
  }

  /* =====================================
     DRAW DASHBOARD
     ===================================== */

  function draw() {
    const target = root();

    if (!target) return;

    const all = clients();

    if (page === "home") {
      target.innerHTML =
        header(
          "Your clients. Your programs. Your coaching."
        ) +

        `
        <div class="hub-panel">

          <h3>Needs Your Attention</h3>

          <div class="hub-grid">

            <button
              type="button"
              class="hub-alert"
              data-action="strengthChats"
            >
              <div class="hub-figure">—</div>
              <strong>Strength Chats</strong>
              <small>Inbox connection pending</small>
            </button>

            <button
              type="button"
              class="hub-alert"
              data-action="requests"
            >
              <div class="hub-figure">
                ${html(count("alertCountStrength"))}
              </div>
              <strong>Block Requests</strong>
              <small>Current Strength alerts</small>
            </button>

            <button
              type="button"
              class="hub-alert"
              data-action="lyfeChats"
            >
              <div class="hub-figure">—</div>
              <strong>ManaLyfe Chats</strong>
              <small>Inbox connection pending</small>
            </button>

          </div>

        </div>

        <div class="hub-panel">

          <h3>Your Programs</h3>

          <div class="hub-grid">

            ${programs.map(program => {

              const assigned = all.filter(
                client =>
                  client.program === program.id
              ).length;

              const verified =
                all.length > 0 &&
                all.every(client => client.program);

              const metric =
                program.id === "lyfe"
                  ? "Active chats"
                  : "Verified clients";

              const number =
                verified && program.id !== "lyfe"
                  ? assigned
                  : "—";

              return `
                <button
                  type="button"
                  class="hub-card"
                  data-program="${program.id}"
                >

                  <span class="hub-symbol">
                    ${program.icon}
                  </span>

                  <strong>
                    ${html(program.name)}
                  </strong>

                  <span class="hub-figure">
                    ${html(number)}
                  </span>

                  <small>
                    ${metric} · Open →
                  </small>

                </button>
              `;

            }).join("")}

          </div>

          <p class="hub-help">
            ${all.length} existing client records
            available. Program-specific totals
            will appear when assignments are
            connected.
          </p>

        </div>
      `;

      return;
    }

    /* =====================================
       INDIVIDUAL PROGRAM DIRECTORY
       ===================================== */

    const program = programs.find(
      item => item.id === currentProgram
    ) || programs[0];

    const verified = all.filter(
      client => client.program === currentProgram
    );

    const unclassified = all.filter(
      client => !client.program
    );

    target.innerHTML =
      header(
        program.name + " · Client Management"
      ) +

      `
      <div class="hub-panel">

        <div class="hub-heading">

          <button
            type="button"
            class="hub-back"
            data-action="back"
          >
            ← Coach Hub
          </button>

          <h3>
            ${html(program.name)}
          </h3>

        </div>

        ${
          currentProgram === "lyfe"
            ? `
              <p class="hub-help">
                The dedicated ManaLyfe inbox
                requires a verified conversation
                source. No messages are copied
                into this directory.
              </p>
            `
            : ""
        }

        <h3>Assigned Clients</h3>

        ${
          verified.length
            ? verified.map(clientButton).join("")
            : `
              <p class="hub-help">
                No program assignment is confirmed
                in the current dashboard data yet.
              </p>
            `
        }

        <h3 style="margin-top:23px">
          Existing Client Directory
        </h3>

        <p class="hub-help">
          Clients below are not yet classified
          by program. You can still open their
          coaching profiles without changing
          their membership or training program.
        </p>

        ${
          unclassified.length
            ? unclassified.map(clientButton).join("")
            : `
              <p class="hub-help">
                No unclassified clients
                in the current list.
              </p>
            `
        }

        <button
          type="button"
          class="hub-secondary"
          style="margin-top:17px"
          data-action="refresh"
        >
          Refresh Client Directory
        </button>

      </div>
    `;
  }

  /* =====================================
     PRESERVE EXISTING ACTIONS
     ===================================== */

  function onClick(event) {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.program) {
      currentProgram = button.dataset.program;
      page = "program";

      draw();
      window.scrollTo(0,0);

      return;
    }

    if (button.dataset.client) {
      const client = clients().find(
        item => item.id === button.dataset.client
      );

      if (
        client &&
        typeof window.openCoachClientDetail ===
          "function"
      ) {
        lastClientId = client.id;

        window.openCoachClientDetail(
          client.id,
          client.name
        );
      } else {
        alert(
          "Client detail is not available. " +
          "Refresh the app and try again."
        );
      }

      return;
    }

    const action = button.dataset.action;

    if (action === "back") {
      page = "home";

      draw();
      window.scrollTo(0,0);

    } else if (action === "refresh") {
      draw();

    } else if (action === "requests") {
      currentProgram = "strength";
      page = "program";
      draw();

    } else if (
      action === "strengthChats" ||
      action === "lyfeChats"
    ) {
      currentProgram =
        action === "lyfeChats"
          ? "lyfe"
          : "strength";

      page = "program";
      draw();
    }
  }

  /* =====================================
     INITIALISE
     ===================================== */

  function init() {
    if (!$(HOME_ID)) return;

    root();
    draw();

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest(
            "#" + ID
          )
        ) {
          return;
        }

        if (
          event.target.closest(
            "[data-coach-page]," +
            "#backToCoachClients"
          )
        ) {
          setTimeout(draw,300);
        }
      }
    );

    window.addEventListener(
      "focus",
      draw
    );

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
      {once:true}
    );
  } else {
    init();
  }

})();
