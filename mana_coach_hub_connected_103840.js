
/* MANA MOVEMENT — COACH HUB CONNECTED 103840
   REPLACE mana_coach_hub_clean_103760.js
   Uses existing Supabase client_program_assignments + custom_programs.
   Preserves approved Coach Hub structure and existing profile opening.
   Read-only: no account, assignment or subscription updates. */
(() => {
  "use strict";
  if (window.MANA_COACH_HUB_CONNECTED_103840) return;
  window.MANA_COACH_HUB_CONNECTED_103840 = true;

  const ID = "manaCoachHubClean103760";
  const STYLE = "manaCoachHubConnectedStyle103840";

  const PROGRAMS = [
    { id: "strength", name: "Mana Strength", icon: "◆" },
    { id: "mana28", name: "Mana28", icon: "▦" },
    { id: "lyfe", name: "ManaLyfe", icon: "♡" }
  ];

  const $ = id => document.getElementById(id);

  const esc = v => String(v ?? "").replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c])
  );

  let page = "home";
  let selected = "strength";
  let assignments = [];
  let loading = false;
  let error = "";
  let verified = false;
  let seq = 0;

  const normalise = v => {
    const t = String(v || "")
      .toLowerCase()
      .replace(/[\s_-]/g, "");

    if (t.includes("strength")) return "strength";
    if (t.includes("mana28") || t === "28") return "mana28";
    if (t.includes("manalyfe") || t === "lyfe") return "lyfe";

    return "";
  };

  function directory() {
    const map = new Map();

    $("coachClientsCard")
      ?.querySelectorAll(".client-open[data-client-id]")
      .forEach(el => {
        const id = String(el.dataset.clientId || "").trim();

        if (!id || map.has(id)) return;

        map.set(id, {
          id,
          name: String(
            el.dataset.clientName ||
            el.querySelector("strong")?.textContent ||
            "Client"
          ).trim()
        });
      });

    return [...map.values()].sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }

  function installStyle() {
    if ($(STYLE)) return;

    const el = document.createElement("style");
    el.id = STYLE;

    el.textContent = `
      #coachHomePage {
        width:min(1100px,calc(100% - 24px))!important;
        max-width:1100px!important;
        margin:auto!important;
      }

      #coachHomePage>:not(#${ID}) {
        display:none!important;
      }

      #${ID} {
        color:#fff;
        margin:0 0 115px;
      }

      #${ID} * {
        box-sizing:border-box;
      }

      #${ID} button {
        font:inherit;
        cursor:pointer;
      }

      #${ID} .hub-hero {
        padding:25px;
        border:1px solid #4a4e55;
        border-radius:24px;
        background:#15171b;
        margin-bottom:17px;
      }

      #${ID} .hub-kicker {
        font-size:10px;
        font-weight:900;
        color:#ff7927;
        letter-spacing:.19em;
      }

      #${ID} h2 {
        font-size:clamp(27px,4vw,41px);
        font-weight:950;
        color:#fff;
        margin:7px 0;
      }

      #${ID} .hub-sub {
        color:#c1c6ce;
        font-size:13px;
        line-height:1.6;
      }

      #${ID} .hub-panel {
        background:#15171b;
        border:1px solid #4a4e55;
        border-radius:23px;
        padding:20px;
        margin-bottom:17px;
      }

      #${ID} h3 {
        margin:0 0 15px;
        color:#fff;
        font-size:18px;
      }

      #${ID} .hub-grid {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:12px;
      }

      #${ID} .hub-card {
        border:1px solid #ff7927;
        border-radius:18px;
        padding:20px 11px;
        min-height:160px;
        background:#1d2025;
        color:#fff;
        text-align:center;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:11px;
      }

      #${ID} .hub-symbol {
        font-size:25px;
        color:#ff7927;
      }

      #${ID} .hub-card strong {
        font-size:15px;
      }

      #${ID} .hub-card small,
      #${ID} .hub-help {
        font-size:12px;
        color:#c1c6ce;
        line-height:1.55;
      }

      #${ID} .hub-figure {
        font-size:25px;
        font-weight:900;
        color:#ff7927;
      }

      #${ID} .hub-alert {
        min-height:115px;
        border:1px solid #4a4e55;
        border-radius:15px;
        background:#1d2025;
        padding:14px 8px;
        text-align:center;
        color:#fff;
      }

      #${ID} .hub-alert strong {
        display:block;
        font-size:13px;
        margin-top:7px;
      }

      #${ID} .hub-alert small {
        display:block;
        color:#c1c6ce;
        font-size:11px;
        margin-top:5px;
      }

      #${ID} .hub-back,
      #${ID} .hub-secondary {
        border:1px solid #ff7927;
        border-radius:12px;
        padding:10px 14px;
        background:#1d2025;
        color:#ff7927!important;
        font-size:12px;
        font-weight:900;
      }

      #${ID} .hub-heading {
        display:flex;
        align-items:center;
        gap:13px;
        margin-bottom:18px;
        flex-wrap:wrap;
      }

      #${ID} .hub-heading h3 {
        margin:0;
      }

      #${ID} .hub-item {
        display:flex;
        justify-content:space-between;
        align-items:center;
        width:100%;
        padding:15px 16px;
        margin-top:9px;
        text-align:left;
        border:1px solid #4a4e55;
        border-radius:14px;
        background:#1d2025;
        color:#fff;
      }

      #${ID} .hub-item strong {
        font-size:14px;
      }

      #${ID} .hub-item span {
        color:#ff7927;
      }

      #${ID} .hub-help {
        margin:12px 0;
      }

      #${ID} .hub-card:hover,
      #${ID} .hub-item:hover {
        background:#282b31;
      }

      @media(max-width:600px) {
        #coachHomePage {
          width:calc(100% - 16px)!important;
        }

        #${ID} .hub-hero,
        #${ID} .hub-panel {
          padding:15px;
        }

        #${ID} .hub-grid {
          gap:7px;
        }

        #${ID} .hub-card {
          padding:11px 5px;
          min-height:138px;
        }

        #${ID} .hub-card strong {
          font-size:11px;
        }

        #${ID} .hub-card small,
        #${ID} .hub-alert small {
          font-size:9px;
        }

        #${ID} .hub-alert {
          padding:12px 5px;
        }

        #${ID} .hub-alert strong {
          font-size:10px;
        }
      }
    `;

    document.head.appendChild(el);
  }

  function root() {
    const home = $("coachHomePage");

    if (!home) return null;

    installStyle();

    let node = $(ID);

    if (!node) {
      node = document.createElement("section");
      node.id = ID;
      home.prepend(node);
      node.addEventListener("click", click);
    }

    return node;
  }

  const header = sub => `
    <div class="hub-hero">
      <div class="hub-kicker">
        MANA MOVEMENT · COACH OPERATIONS
      </div>
      <h2>Coach Hub</h2>
      <div class="hub-sub">${esc(sub)}</div>
    </div>
  `;

  const button = c => `
    <button class="hub-item" data-client="${esc(c.id)}">
      <strong>${esc(c.name)}</strong>
      <span>Open profile →</span>
    </button>
  `;

  function draw() {
    const node = root();

    if (!node) return;

    const all = directory();

    const active = assignments.filter(
      a => a.status === "active"
    );

    const matched = new Set(
      active.map(a => a.client_id)
    );

    if (page === "home") {
      node.innerHTML =
        header("Your clients, conversations and priorities.") +
        `
        <div class="hub-panel">
          <h3>Needs your attention</h3>

          <div class="hub-grid">
            <button class="hub-alert" data-action="strengthChats">
              <div class="hub-figure">—</div>
              <strong>Strength chats</strong>
              <small>Inbox connection pending</small>
            </button>

            <button class="hub-alert" data-action="requests">
              <div class="hub-figure">
                ${esc(
                  /^\d+$/.test(
                    String(
                      $("alertCountStrength")?.textContent || ""
                    ).trim()
                  )
                    ? $("alertCountStrength").textContent
                    : "—"
                )}
              </div>
              <strong>Block requests</strong>
              <small>Current Strength alerts</small>
            </button>

            <button class="hub-alert" data-action="lyfeChats">
              <div class="hub-figure">—</div>
              <strong>ManaLyfe chats</strong>
              <small>Inbox connection pending</small>
            </button>
          </div>
        </div>

        <div class="hub-panel">
          <h3>Your programs</h3>

          <div class="hub-grid">
            ${PROGRAMS.map(p => {
              const count = new Set(
                active
                  .filter(a => a.program === p.id)
                  .map(a => a.client_id)
              ).size;

              return `
                <button class="hub-card" data-program="${p.id}">
                  <span class="hub-symbol">${p.icon}</span>
                  <strong>${p.name}</strong>
                  <span class="hub-figure">
                    ${verified ? count : "—"}
                  </span>
                  <small>
                    ${verified
                      ? "Active assigned clients"
                      : "Assignments pending"} · Open →
                  </small>
                </button>
              `;
            }).join("")}
          </div>

          <p class="hub-help">
            ${loading
              ? "Loading saved assignments…"
              : error
                ? esc(error)
                : `${all.length} existing client records available. ${
                    verified
                      ? "Counts reflect active saved program assignments."
                      : "Assignments not confirmed."
                  }`}
          </p>
        </div>
      `;

      return;
    }

    const p = PROGRAMS.find(
      p => p.id === selected
    );

    const ids = new Set(
      active
        .filter(a => a.program === selected)
        .map(a => a.client_id)
    );

    const assigned = all.filter(
      c => ids.has(c.id)
    );

    const unresolved = [...ids].filter(
      id => !all.some(c => c.id === id)
    );

    const unclassified = all.filter(
      c => !matched.has(c.id)
    );

    node.innerHTML =
      header(`${p.name} · Client management`) +
      `
      <div class="hub-panel">
        <div class="hub-heading">
          <button class="hub-back" data-action="back">
            ← Coach Hub
          </button>
          <h3>${p.name}</h3>
        </div>

        <h3>Assigned clients</h3>

        ${assigned.map(button).join("")}

        ${unresolved.length
          ? `<p class="hub-help">
               ${unresolved.length} assigned client record(s)
               are not present in the current directory.
               Refresh the directory to check.
             </p>`
          : ""}

        ${!assigned.length && !unresolved.length
          ? `<p class="hub-help">
               ${loading
                 ? "Loading assignments…"
                 : error
                   ? esc(error)
                   : "No active saved assignment for this program yet."}
             </p>`
          : ""}

        <h3 style="margin-top:23px">
          Existing client directory
        </h3>

        <p class="hub-help">
          Clients below have no active verified program assignment.
          Open their existing profile to assign a saved program.
        </p>

        ${unclassified.length
          ? unclassified.map(button).join("")
          : `<p class="hub-help">
               No unclassified clients in the current directory.
             </p>`}

        <button
          class="hub-secondary"
          style="margin-top:17px"
          data-action="refresh"
        >
          Refresh client directory
        </button>
      </div>
    `;
  }

  async function refresh() {
    const call = ++seq;

    loading = true;
    error = "";
    verified = false;

    draw();

    try {
      if (typeof window.supabaseClient !== "function") {
        throw Error("Secure data connection unavailable.");
      }

      const db = await window.supabaseClient();

      const {
        data: userData,
        error: userError
      } = await db.auth.getUser();

      if (userError) throw userError;

      if (!userData?.user) {
        throw Error("Please sign in again.");
      }

      const coachId = userData.user.id;

      const result = await db
        .from("client_program_assignments")
        .select(
          "client_id,status,program_id,custom_programs(name,source_program)"
        )
        .eq("coach_id", coachId)
        .eq("status", "active");

      if (result.error) throw result.error;

      if (call !== seq) return;

      assignments = (result.data || [])
        .map(row => ({
          client_id: String(row.client_id || ""),
          status: row.status,
          program: normalise(
            row.custom_programs?.source_program ||
            row.custom_programs?.name
          )
        }))
        .filter(row => row.client_id && row.program);

      verified = true;

    } catch (e) {
      if (call !== seq) return;

      assignments = [];
      verified = false;

      error =
        "Couldn't verify assignments: " +
        (e?.message || String(e));

    } finally {
      if (call === seq) {
        loading = false;
        draw();
      }
    }
  }

  function click(e) {
    const btn = e.target.closest("button");

    if (!btn || !$(ID)?.contains(btn)) return;

    if (btn.dataset.program) {
      selected = btn.dataset.program;
      page = "program";
      draw();
      window.scrollTo(0, 0);
      return;
    }

    if (btn.dataset.client) {
      const c = directory().find(
        c => c.id === btn.dataset.client
      );

      if (
        c &&
        typeof window.openCoachClientDetail === "function"
      ) {
        window.openCoachClientDetail(c.id, c.name);
      } else {
        alert(
          "Client profile not available. Refresh the app and try again."
        );
      }

      return;
    }

    if (btn.dataset.action === "back") {
      page = "home";
      draw();
      window.scrollTo(0, 0);
      return;
    }

    if (btn.dataset.action === "refresh") {
      refresh();
      return;
    }

    if (
      btn.dataset.action === "requests" ||
      btn.dataset.action === "strengthChats" ||
      btn.dataset.action === "lyfeChats"
    ) {
      selected =
        btn.dataset.action === "lyfeChats"
          ? "lyfe"
          : "strength";

      page = "program";
      draw();
    }
  }

  function init() {
    if (!$("coachHomePage")) return;

    root();
    draw();
    refresh();

    document.addEventListener("click", e => {
      if (e.target.closest("#" + ID)) return;

      if (
        e.target.closest(
          "[data-coach-page],#backToCoachClients"
        )
      ) {
        setTimeout(() => {
          draw();
          refresh();
        }, 300);
      }
    });

    window.addEventListener("focus", refresh);

    window.refreshManaCoachHubClean = refresh;
    window.MANA_COACH_HUB_BUILD = "103840";
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
