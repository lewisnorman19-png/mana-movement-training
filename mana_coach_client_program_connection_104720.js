
/* ============================================================
   MANA MOVEMENT — COACH PROGRAM CONNECTION
   BUILD 104721

   COMPLETE REPLACEMENT:
   mana_coach_client_program_connection_104720.js

   PRESERVES
   - Assigned Programs in client coaching profiles
   - Existing saved program assignments
   - Optional client-linked Program Builder

   ADDS
   - Live Coach Hub Block Requests count
   - Real program_upgrade_requests queue
   - View Client and Open Program Builder
   - Mark In Progress
   - Mark Next Block Ready, with confirmation

   No changes to Chat, Mana28, Circuits or workouts.
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104721";

  if (window.MANA_COACH_ASSIGNMENTS_104721) return;
  window.MANA_COACH_ASSIGNMENTS_104721 = true;

  const $ = id => document.getElementById(id);

  const PANEL = "manaCoachAssignments104720";
  const STYLE = "manaCoachAssignmentsStyle104721";
  const REQUEST_MODAL = "manaBlockRequests104721";

  const safe = value =>
    String(value ?? "").replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]
    );

  let selected = null;
  let savedPrograms = [];
  let assignments = [];
  let busy = false;
  let requestNumber = 0;

  let blockRequests = [];
  let clientNames = new Map();
  let blockLoading = false;
  let blockSaving = false;
  let lastBlockCount = null;

  const detail = () => $("coachClientDetailView");

  function detailVisible() {
    return Boolean(
      detail() &&
      !detail().classList.contains("hide")
    );
  }

  function coachVisible() {
    const coach = $("coachView");

    return Boolean(
      coach &&
      !coach.classList.contains("hide")
    );
  }

  function styles() {
    if ($(STYLE)) return;

    const sheet = document.createElement("style");
    sheet.id = STYLE;

    sheet.textContent = `

      /* EXISTING CLIENT ASSIGNMENT PANEL */

      #coachClientDetailView #${PANEL} {
        background:#15171A!important;
        color:#FFFFFF!important;
        border:1px solid #626973!important;
        border-radius:20px!important;
        padding:19px!important;
        margin:13px 0 17px!important;
        box-shadow:none!important;
        box-sizing:border-box!important;
      }

      #${PANEL} * {
        box-sizing:border-box;
      }

      #${PANEL} .mca-kicker {
        color:#FF7927!important;
        font:900 10px/1.5 system-ui;
        letter-spacing:.13em;
      }

      #${PANEL} h3 {
        color:#FFFFFF!important;
        font-size:21px!important;
        margin:5px 0!important;
      }

      #${PANEL} .mca-help {
        color:#C1C6CE!important;
        font-size:12px;
        line-height:1.55;
        margin:8px 0 14px;
      }

      #${PANEL} .mca-row {
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        padding:13px;
        background:#0C0F12;
        border:1px solid #48515A;
        border-radius:13px;
        margin:8px 0;
      }

      #${PANEL} .mca-row strong {
        display:block;
        color:#FFFFFF;
        font-size:13px;
      }

      #${PANEL} .mca-row small {
        display:block;
        margin-top:4px;
        color:#C1C6CE;
        font-size:11px;
      }

      #${PANEL} .mca-pill {
        border:1px solid #FF7927;
        border-radius:999px;
        padding:5px 8px;
        color:#FF7927;
        font-size:10px;
        font-weight:900;
      }

      #${PANEL} .mca-actions {
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:8px;
        margin-top:12px;
      }

      #${PANEL} select {
        width:100%!important;
        min-width:0!important;
        padding:12px!important;
        background:#0B0D10!important;
        border:1px solid #68717C!important;
        border-radius:11px!important;
        color:#FFFFFF!important;
        font-size:13px!important;
      }

      #${PANEL} button,
      #${REQUEST_MODAL} button {
        cursor:pointer;
        border:1px solid #FF7927;
        border-radius:11px;
        background:#191B20;
        color:#FF7927;
        -webkit-text-fill-color:#FF7927;
        padding:11px 13px;
        min-height:42px;
        font-size:12px;
        font-weight:850;
      }

      #${PANEL} button.mca-primary,
      #${REQUEST_MODAL} button.mbr-primary {
        background:#FF7927;
        color:#08090B;
        -webkit-text-fill-color:#08090B;
      }

      #${PANEL} button:disabled,
      #${REQUEST_MODAL} button:disabled {
        opacity:.5;
        cursor:wait;
      }

      #${PANEL} .mca-footer {
        display:flex;
        gap:9px;
        flex-wrap:wrap;
        margin-top:13px;
      }

      #${PANEL} .mca-status {
        color:#C1C6CE;
        font-size:12px;
        line-height:1.5;
        margin-top:10px;
      }

      #${PANEL} .mca-status.error {
        color:#FF9A88;
      }

      /* LIVE BLOCK REQUEST ALERT */

      #manaCoachHubClean103760
      [data-action="requests"] {
        cursor:pointer!important;
      }

      #manaCoachHubClean103760
      [data-action="requests"]:focus-visible {
        outline:2px solid #FF7927!important;
        outline-offset:3px!important;
      }

      /* REQUEST REVIEW WINDOW */

      #${REQUEST_MODAL} {
        display:none;
        position:fixed;
        inset:0;
        z-index:100040;
        background:rgba(0,0,0,.85);
        padding:20px;
        overflow-y:auto;
        box-sizing:border-box;
        color:#FFFFFF;
      }

      #${REQUEST_MODAL}.open {
        display:block;
      }

      #${REQUEST_MODAL} *,
      #${REQUEST_MODAL} *::before,
      #${REQUEST_MODAL} *::after {
        box-sizing:border-box;
      }

      #${REQUEST_MODAL} .mbr-inner {
        width:min(820px,100%);
        margin:30px auto;
        padding:23px;
        background:#111317;
        border:1px solid #48515B;
        border-radius:20px;
      }

      #${REQUEST_MODAL} .mbr-header {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:12px;
        margin-bottom:20px;
      }

      #${REQUEST_MODAL} .mbr-kicker {
        color:#FF7927;
        font-size:11px;
        font-weight:900;
        letter-spacing:.1em;
      }

      #${REQUEST_MODAL} h2 {
        color:#FFFFFF!important;
        font-size:28px;
        margin:6px 0!important;
      }

      #${REQUEST_MODAL} .mbr-sub {
        color:#C1C6CE;
        font-size:12px;
        line-height:1.55;
      }

      #${REQUEST_MODAL} .mbr-close {
        flex:0 0 45px;
        font-size:24px;
        padding:5px;
      }

      #${REQUEST_MODAL} .mbr-request {
        background:#191B20;
        border:1px solid #48515B;
        border-radius:15px;
        padding:17px;
        margin:12px 0;
      }

      #${REQUEST_MODAL} .mbr-top {
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
        flex-wrap:wrap;
      }

      #${REQUEST_MODAL} .mbr-name {
        color:#FFFFFF;
        font-size:17px;
        font-weight:900;
      }

      #${REQUEST_MODAL} .mbr-status {
        color:#FF7927;
        border:1px solid #FF7927;
        border-radius:999px;
        padding:5px 9px;
        font-size:10px;
        font-weight:900;
        text-transform:uppercase;
      }

      #${REQUEST_MODAL} .mbr-detail {
        color:#C1C6CE;
        font-size:12px;
        line-height:1.6;
        margin:12px 0;
      }

      #${REQUEST_MODAL} .mbr-actions {
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        margin-top:13px;
      }

      #${REQUEST_MODAL} .mbr-empty {
        border:1px solid #48515B;
        border-radius:13px;
        color:#C1C6CE;
        padding:20px;
        font-size:13px;
      }

      #${REQUEST_MODAL} .mbr-message {
        color:#C1C6CE;
        font-size:12px;
        min-height:18px;
        margin-top:12px;
      }

      @media(max-width:590px) {
        #coachClientDetailView #${PANEL} {
          padding:14px!important;
        }

        #${PANEL} .mca-actions {
          grid-template-columns:1fr;
        }

        #${PANEL} .mca-row {
          flex-wrap:wrap;
        }

        #${REQUEST_MODAL} {
          padding:8px;
        }

        #${REQUEST_MODAL} .mbr-inner {
          margin:8px auto;
          padding:15px;
        }

        #${REQUEST_MODAL} .mbr-actions button {
          flex:1 1 100%;
        }
      }
    `;

    document.head.appendChild(sheet);
  }

  /* =========================================================
     SHARED COACH AUTH
     ========================================================= */

  async function context() {
    if (
      typeof window.supabaseClient !== "function"
    ) {
      throw Error("Mana cloud unavailable.");
    }

    const client = await window.supabaseClient();

    const {data, error} = await client.auth.getUser();

    if (error) throw error;

    if (!data?.user?.id) {
      throw Error("Please sign in as a coach.");
    }

    const {data: profile, error: profileError} =
      await client.from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

    if (
      profileError ||
      profile?.role !== "coach"
    ) {
      throw Error("Coach access required.");
    }

    return {
      client,
      coachId:data.user.id
    };
  }

  /* =========================================================
     EXISTING CLIENT ASSIGNMENT PANEL
     ========================================================= */

  function setStatus(message = "", type = "") {
    const node = $("mcaStatus104720");

    if (node) {
      node.textContent = message;
      node.className = "mca-status " + type;
    }
  }

  function renderSkeleton() {
    const view = detail();

    if (
      !view ||
      !detailVisible() ||
      !selected
    ) return;

    let panel = $(PANEL);

    if (!panel) {
      panel = document.createElement("section");
      panel.id = PANEL;

      const anchor =
        $("manaV998ClientSummary") ||
        $("manaV998ClientHero");

      if (anchor && view.contains(anchor)) {
        anchor.insertAdjacentElement(
          "afterend",
          panel
        );
      } else {
        view.insertBefore(
          panel,
          view.children[1] || null
        );
      }
    }

    panel.innerHTML = `
      <div class="mca-kicker">
        MANA MOVEMENT · CLIENT COACHING
      </div>

      <h3>Assigned Programs</h3>

      <p class="mca-help">
        Review existing assignments for
        <strong>${safe(selected.name)}</strong>.
        Use the builder only when specialist
        programming is requested.
      </p>

      <div id="mcaList104720">
        <div class="mca-status">
          Loading assignments…
        </div>
      </div>

      <div class="mca-actions">
        <select
          id="mcaProgramSelect104720"
          aria-label="Choose saved program"
        >
          <option value="">
            Loading programs…
          </option>
        </select>

        <button
          id="mcaAssign104720"
          type="button"
          class="mca-primary"
          disabled
        >
          Assign Program
        </button>
      </div>

      <div class="mca-footer">
        <button
          id="mcaBuild104720"
          type="button"
        >
          ＋ Build for ${safe(selected.name)}
        </button>

        <button
          id="mcaRefresh104720"
          type="button"
        >
          ↻ Refresh
        </button>
      </div>

      <p
        id="mcaStatus104720"
        class="mca-status"
        aria-live="polite"
      ></p>
    `;

    $("mcaAssign104720").onclick = assignProgram;
    $("mcaRefresh104720").onclick = refreshAssignments;

    $("mcaBuild104720").onclick = () => {
      openBuilder(selected);
    };

    $("mcaProgramSelect104720").onchange = () => {
      $("mcaAssign104720").disabled =
        !$("mcaProgramSelect104720").value;
    };
  }

  function openBuilder(person = null) {
    if (
      typeof window.openManaProgramBuilder !==
      "function"
    ) {
      window.alert(
        "Program Builder is unavailable."
      );
      return;
    }

    if (person) {
      window.openManaProgramBuilder({
        id:person.id,
        name:person.name,
        clientId:person.id,
        clientName:person.name
      });
    } else {
      window.openManaProgramBuilder();
    }
  }

  async function refreshAssignments() {
    if (
      !selected ||
      !detailVisible() ||
      busy
    ) return;

    const ticket = ++requestNumber;
    const id = selected.id;

    setStatus("Loading from Mana cloud…");

    try {
      const {client, coachId} = await context();

      const [programResult, assignmentResult] =
        await Promise.all([
          client.from("custom_programs")
            .select(
              "id,name,description,duration_weeks,status"
            )
            .eq("coach_id",coachId)
            .order("name"),

          client.from("client_program_assignments")
            .select(
              "id,program_id,status,is_primary,assigned_at,custom_programs(id,name,duration_weeks)"
            )
            .eq("client_id",id)
            .eq("coach_id",coachId)
            .neq("status","removed")
            .order("assigned_at",{
              ascending:false
            })
        ]);

      if (programResult.error) {
        throw programResult.error;
      }

      if (assignmentResult.error) {
        throw assignmentResult.error;
      }

      if (
        ticket !== requestNumber ||
        selected?.id !== id ||
        !detailVisible()
      ) return;

      savedPrograms = programResult.data || [];
      assignments = assignmentResult.data || [];

      renderAssignments();
      setStatus("Connected to saved programs.");

    } catch (error) {
      setStatus(
        "Unable to load: " +
        (error.message || "Connection error"),
        "error"
      );
    }
  }

  function renderAssignments() {
    const list = $("mcaList104720");
    if (!list) return;

    list.innerHTML = assignments.length
      ? assignments.map(a => `
          <div class="mca-row">
            <div>
              <strong>
                ${safe(
                  a.custom_programs?.name ||
                  "Saved Program"
                )}
              </strong>
              <small>
                ${safe(a.status)}
              </small>
            </div>
            <span class="mca-pill">
              ${a.is_primary
                ? "PRIMARY"
                : safe(a.status).toUpperCase()}
            </span>
          </div>
        `).join("")
      : `
        <div class="mca-row">
          <div>
            <strong>
              No specialist programs assigned
            </strong>
            <small>
              An automatically generated Mana Strength
              program does not require a manual assignment.
            </small>
          </div>
        </div>
      `;

    const select = $("mcaProgramSelect104720");
    if (!select) return;

    const previous = select.value;

    const available = savedPrograms.filter(
      p => p.status !== "archived"
    );

    select.innerHTML =
      '<option value="">Select a saved program…</option>' +
      available.map(p => `
        <option value="${safe(p.id)}">
          ${safe(p.name)}
        </option>
      `).join("");

    if (available.some(p => p.id === previous)) {
      select.value = previous;
    }

    $("mcaAssign104720").disabled =
      !select.value;
  }

  async function assignProgram() {
    const programId =
      $("mcaProgramSelect104720")?.value;

    if (
      !programId ||
      !selected ||
      busy
    ) return;

    const program = savedPrograms.find(
      p => p.id === programId
    );

    if (!program) return;

    if (!window.confirm(
      `Assign "${program.name}" to ${selected.name}?`
    )) return;

    busy = true;
    const chosen = {...selected};

    setStatus("Saving assignment…");

    try {
      const {client, coachId} = await context();

      const previous = assignments.find(
        a => a.program_id === programId
      );

      const hasPrimary = assignments.some(
        a => a.is_primary && a.status === "active"
      );

      const {error} = await client
        .from("client_program_assignments")
        .upsert({
          client_id:chosen.id,
          coach_id:coachId,
          program_id:programId,
          status:"active",
          is_primary:
            previous?.is_primary ?? !hasPrimary,
          start_date:
            new Date().toISOString().slice(0,10),
          updated_at:
            new Date().toISOString()
        }, {
          onConflict:"client_id,program_id"
        });

      if (error) throw error;

      busy = false;
      await refreshAssignments();

      setStatus(
        "Program assigned successfully."
      );

    } catch (error) {
      setStatus(
        "Assignment not saved: " +
        (error.message || "Please retry"),
        "error"
      );
    } finally {
      busy = false;
    }
  }

  function selectedFromClick(event) {
    const element = event.target.closest(
      "[data-client]," +
      "[data-coach-client-id]," +
      ".client-open[data-client-id]"
    );

    if (!element) return;

    const id =
      element.dataset.client ||
      element.dataset.coachClientId ||
      element.dataset.clientId;

    if (!id) return;

    selected = {
      id:String(id),
      name:String(
        element.dataset.clientName ||
        element.querySelector("strong")?.textContent ||
        element.textContent ||
        "Client"
      ).trim()
    };

    requestNumber++;
    $(PANEL)?.remove();

    setTimeout(showSelected,200);
    setTimeout(showSelected,550);
  }

  function showSelected() {
    if (
      !selected ||
      !detailVisible()
    ) return;

    if (!$(PANEL)) {
      renderSkeleton();
      refreshAssignments();
    }
  }

  /* =========================================================
     BLOCK REQUESTS — LIVE COACH QUEUE
     ========================================================= */

  function requestCard() {
    return document.querySelector(
      '#manaCoachHubClean103760 ' +
      '[data-action="requests"]'
    );
  }

  function setBlockCount(count) {
    lastBlockCount = count;

    const card = requestCard();
    if (!card) return;

    const number = card.querySelector(
      ".hub-alert-number"
    );

    const description = card.querySelector("small");

    if (number) {
      number.textContent = String(count);
    }

    if (description) {
      description.textContent = count
        ? `${count} request${count === 1 ? "" : "s"} awaiting review`
        : "No pending block requests";
    }

    card.setAttribute(
      "aria-label",
      `Open Block Requests, ${count} pending`
    );
  }

  function ensureRequestsModal() {
    let modal = $(REQUEST_MODAL);

    if (!modal) {
      modal = document.createElement("div");
      modal.id = REQUEST_MODAL;
      modal.setAttribute(
        "role",
        "dialog"
      );

      modal.setAttribute(
        "aria-modal",
        "true"
      );

      modal.setAttribute(
        "aria-label",
        "Block Requests"
      );

      document.body.appendChild(modal);
    }

    return modal;
  }

  function closeRequests() {
    $(REQUEST_MODAL)?.classList.remove("open");
  }

  function formatDate(value) {
    const date = new Date(value);

    if (!Number.isFinite(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString([], {
      day:"numeric",
      month:"short",
      year:"numeric"
    });
  }

  function requestName(id) {
    return clientNames.get(String(id)) || "Client";
  }

  function requestRows() {
    if (!blockRequests.length) {
      return `
        <div class="mbr-empty">
          No pending Block Requests.
        </div>
      `;
    }

    return blockRequests.map(r => {
      const name = requestName(r.client_id);

      return `
        <div class="mbr-request">
          <div class="mbr-top">
            <span class="mbr-name">
              ${safe(name)}
            </span>

            <span class="mbr-status">
              ${safe(
                r.status === "in_progress"
                  ? "In Progress"
                  : "Requested"
              )}
            </span>
          </div>

          <div class="mbr-detail">
            <strong>
              ${safe(r.program_name || "Mana Strength")}
            </strong>

            <div>
              Block ${Number(r.current_block) || 1}
              · Week ${Number(r.current_week) || 1}
            </div>

            <div>
              Requested ${safe(formatDate(r.requested_at))}
            </div>

            ${r.client_note ? `
              <div>
                Client note:
                ${safe(r.client_note)}
              </div>
            ` : ""}
          </div>

          <div class="mbr-actions">
            <button
              type="button"
              data-mbr-action="view"
              data-mbr-id="${safe(r.id)}"
            >
              View Client
            </button>

            ${r.status === "requested" ? `
              <button
                type="button"
                data-mbr-action="progress"
                data-mbr-id="${safe(r.id)}"
              >
                Mark In Progress
              </button>
            ` : ""}

            <button
              type="button"
              data-mbr-action="builder"
              data-mbr-id="${safe(r.id)}"
            >
              Open Program Builder
            </button>

            <button
              type="button"
              class="mbr-primary"
              data-mbr-action="ready"
              data-mbr-id="${safe(r.id)}"
            >
              Mark Next Block Ready
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderRequests(message = "") {
    const modal = ensureRequestsModal();

    modal.innerHTML = `
      <div class="mbr-inner">
        <div class="mbr-header">
          <div>
            <div class="mbr-kicker">
              MANA MOVEMENT · COACH PRIORITIES
            </div>

            <h2>Block Requests</h2>

            <div class="mbr-sub">
              Review client requests for a new or
              specialised four-week training block.
            </div>
          </div>

          <button
            type="button"
            class="mbr-close"
            data-mbr-close="1"
            aria-label="Close Block Requests"
          >
            ×
          </button>
        </div>

        <div id="mbrRequestList104721">
          ${requestRows()}
        </div>

        <div
          class="mbr-message"
          aria-live="polite"
        >
          ${safe(message)}
        </div>

        <button
          type="button"
          data-mbr-refresh="1"
        >
          Refresh Requests
        </button>
      </div>
    `;
  }

  async function loadBlockRequests(show = false) {
    if (
      blockLoading ||
      !coachVisible()
    ) return;

    blockLoading = true;

    if (show) {
      ensureRequestsModal().classList.add("open");
      renderRequests("Loading requests…");
    }

    try {
      const {client} = await context();

      const [requestsResult, namesResult] =
        await Promise.all([
          client.from("program_upgrade_requests")
            .select(
              "id,client_id,program_name,current_block,current_week,status,client_note,requested_at"
            )
            .in("status",[
              "requested",
              "in_progress"
            ])
            .order("requested_at",{
              ascending:false
            }),

          client.rpc("coach_clients_summary")
        ]);

      if (requestsResult.error) {
        throw requestsResult.error;
      }

      if (namesResult.error) {
        throw namesResult.error;
      }

      clientNames = new Map(
        (namesResult.data || [])
          .filter(row => row.user_id)
          .map(row => [
            String(row.user_id),
            String(row.full_name || "Client")
          ])
      );

      blockRequests = requestsResult.data || [];

      setBlockCount(blockRequests.length);

      if (
        $(REQUEST_MODAL)?.classList.contains("open")
      ) {
        renderRequests();
      }

    } catch (error) {
      if (
        $(REQUEST_MODAL)?.classList.contains("open")
      ) {
        renderRequests(
          "Unable to load requests: " +
          (error.message || "Connection error")
        );
      }

      console.warn(
        "[Mana Block Requests]",
        error
      );

    } finally {
      blockLoading = false;
    }
  }

  async function changeBlockStatus(id, status) {
    if (blockSaving) return;

    const request = blockRequests.find(
      row => row.id === id
    );

    if (!request) return;

    if (status === "ready") {
      const confirmed = window.confirm(
        "Mark this client's next training block as ready?\n\n" +
        "Only continue if the next block has actually been prepared."
      );

      if (!confirmed) return;
    }

    blockSaving = true;

    try {
      const {client, coachId} = await context();

      const {error} = await client
        .from("program_upgrade_requests")
        .update({
          status,
          reviewed_at:new Date().toISOString(),
          reviewed_by:coachId,
          updated_at:new Date().toISOString()
        })
        .eq("id",id);

      if (error) throw error;

      blockSaving = false;

      await loadBlockRequests();

    } catch (error) {
      window.alert(
        "Unable to update request: " +
        (error.message || "Please retry")
      );
    } finally {
      blockSaving = false;
    }
  }

  function openClientProfile(id) {
    const request = blockRequests.find(
      row => row.id === id
    );

    if (!request) return;

    const name = requestName(request.client_id);

    closeRequests();

    if (
      typeof window.openCoachClientDetail ===
      "function"
    ) {
      window.openCoachClientDetail(
        request.client_id,
        name
      );
    } else {
      window.alert(
        "Client profile is unavailable. " +
        "Open the client from the Clients tab."
      );
    }
  }

  async function handleBlockAction(event) {
    const element = event.target.closest(
      "[data-mbr-action]"
    );

    if (!element || blockSaving) return;

    const id = element.dataset.mbrId;
    const action = element.dataset.mbrAction;

    if (action === "view") {
      openClientProfile(id);
      return;
    }

    if (action === "progress") {
      await changeBlockStatus(
        id,
        "in_progress"
      );
      return;
    }

    if (action === "ready") {
      await changeBlockStatus(
        id,
        "ready"
      );
      return;
    }

    if (action === "builder") {
      const request = blockRequests.find(
        row => row.id === id
      );

      if (!request) return;

      const person = {
        id:request.client_id,
        name:requestName(request.client_id)
      };

      closeRequests();
      openBuilder(person);
    }
  }

  /* =========================================================
     EVENTS + INITIALISATION
     ========================================================= */

  function onDocumentClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const requests = target.closest(
      '#manaCoachHubClean103760 ' +
      '[data-action="requests"]'
    );

    if (requests && coachVisible()) {
      event.preventDefault();

      /* Stop the old Summary handler from
         opening its disconnected Program page. */
      event.stopImmediatePropagation();

      loadBlockRequests(true);
      return;
    }

    if (target.closest("[data-mbr-close]")) {
      event.preventDefault();
      closeRequests();
      return;
    }

    if (target.closest("[data-mbr-refresh]")) {
      event.preventDefault();
      loadBlockRequests();
      return;
    }

    if (target.closest("[data-mbr-action]")) {
      event.preventDefault();
      handleBlockAction(event);
      return;
    }

    selectedFromClick(event);
  }

  function init() {
    styles();
    ensureRequestsModal();

    document.addEventListener(
      "click",
      onDocumentClick,
      true
    );

    const clientView = detail();

    if (clientView) {
      new MutationObserver(() => {
        if (detailVisible()) {
          setTimeout(showSelected,100);
        } else {
          requestNumber++;
        }
      }).observe(clientView,{
        attributes:true,
        attributeFilter:["class"]
      });
    }

    window.addEventListener("pageshow",() => {
      if (coachVisible()) {
        loadBlockRequests();
      }
    });

    window.addEventListener("focus",() => {
      if (coachVisible()) {
        loadBlockRequests();
      }
    });

    window.addEventListener(
      "mana:program-upgrade-requested",
      () => {
        if (coachVisible()) {
          loadBlockRequests();
        }
      }
    );

    /* Refresh Summary count and requests.
       No continuously running DOM observer. */

    setInterval(() => {
      if (
        document.visibilityState === "hidden" ||
        !coachVisible()
      ) return;

      if (lastBlockCount !== null) {
        setBlockCount(lastBlockCount);
      }

      loadBlockRequests();
    },20000);

    setTimeout(() => {
      if (coachVisible()) {
        loadBlockRequests();
      }
    },700);

    window.refreshManaBlockRequests =
      () => loadBlockRequests();

    console.log(
      "[Mana Movement] Coach Block Requests " +
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
