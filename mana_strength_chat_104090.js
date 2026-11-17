
/* =========================================================
   MANA MOVEMENT — SHARED COACH CHAT
   BUILD 104091

   COMPLETE REPLACEMENT:
   mana_strength_chat_104090.js

   - Preserves existing client chat modal and history
   - Shared by Mana Strength and Mana28
   - Adds real Coach Hub inbox
   - Uses strength_messages and coach_clients_summary
   - Shows last message, date and sender
   - Opens existing client conversation
   - No fake unread counts or database changes
   - Keeps existing public chat functions and modal IDs
   ========================================================= */

(() => {
  "use strict";

  if (window.MANA_STRENGTH_CHAT_104091) return;
  window.MANA_STRENGTH_CHAT_104091 = true;

  const MODAL = "manaV95ChatModal";
  const STYLE = "manaStrengthChatStyle104091";
  const INBOX = "manaCoachInbox104091";
  const CHAT_VIEW =
    '#manaCoachSuite104707 [data-mcn-view="chat"]';

  const $ = id => document.getElementById(id);

  let active = {
    role: "client",
    id: "",
    name: "Client"
  };

  let sending = false;
  let loading = false;
  let poll = null;
  let requestedOpen = 0;
  let inboxLoading = false;
  let inboxRequest = 0;

  function escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[c]
    );
  }

  function applyStyles() {
    if ($(STYLE)) return;

    const tag = document.createElement("style");
    tag.id = STYLE;

    tag.textContent = `
      /* Shared client / coach chat window */

      #${MODAL} {
        position:fixed;
        inset:0;
        z-index:100050;
        display:none;
        flex-direction:column;
        width:100%;
        height:100dvh;
        max-height:100dvh;
        background:#08090B;
        color:#FFFFFF;
        box-sizing:border-box;
        overflow:hidden;
      }

      #${MODAL}.open {
        display:flex;
      }

      #${MODAL} .mana-v950-header {
        flex:0 0 auto;
        padding:15px 18px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:16px;
        border-bottom:1px solid #515A65;
        background:#111317;
      }

      #${MODAL} .mana-v950-header-kicker {
        color:#FF7927;
        font-size:11px;
        font-weight:850;
        letter-spacing:.12em;
      }

      #${MODAL} .mana-v950-header-title {
        font-size:23px;
        font-weight:900;
        color:#FFFFFF;
      }

      #${MODAL} .mana-v950-header-sub {
        color:#C1C6CE;
        font-size:12px;
        line-height:1.45;
      }

      #${MODAL} .mana-v950-close {
        min-width:44px;
        min-height:44px;
        background:#171A1F;
        border:1px solid #707780;
        border-radius:12px;
        color:#FFFFFF;
        font-size:27px;
        cursor:pointer;
      }

      #${MODAL} .mana-v950-messages {
        flex:1 1 auto;
        min-height:0;
        overflow-y:auto;
        padding:16px;
        display:flex;
        flex-direction:column;
        gap:11px;
      }

      #${MODAL} .mana-v950-empty {
        color:#C1C6CE;
        padding:18px;
        line-height:1.5;
      }

      #${MODAL} .mana-v950-message {
        max-width:min(82%,600px);
        align-self:flex-start;
        padding:12px 15px;
        border-radius:15px;
        background:#1B2025;
        border:1px solid #515A65;
        overflow-wrap:anywhere;
      }

      #${MODAL} .mana-v950-message.mine {
        align-self:flex-end;
        background:#1D1A14;
        border-color:#FF7927;
      }

      #${MODAL} .mana-v950-message-name {
        color:#FF7927;
        font-size:11px;
        font-weight:850;
        margin-bottom:5px;
      }

      #${MODAL} .mana-v950-message-body {
        white-space:pre-wrap;
        color:#FFFFFF;
        font-size:14px;
        line-height:1.5;
      }

      #${MODAL} .mana-v950-message-time {
        color:#C1C6CE;
        font-size:10px;
        margin-top:5px;
      }

      #${MODAL} .mana-v950-compose {
        flex:0 0 auto;
        padding:12px 16px
          max(14px,env(safe-area-inset-bottom));
        border-top:1px solid #515A65;
        background:#111317;
      }

      #${MODAL} .mana-v950-compose-inner {
        display:flex;
        gap:10px;
        align-items:stretch;
        width:100%;
      }

      #${MODAL} .mana-v950-input {
        flex:1 1 auto;
        min-width:0;
        height:56px;
        min-height:56px;
        max-height:56px;
        resize:none;
        box-sizing:border-box;
        padding:14px;
        border-radius:12px;
        background:#08090B;
        border:1px solid #697686;
        color:#FFFFFF;
        font:500 16px/1.4 system-ui;
      }

      #${MODAL} .mana-v950-input:focus {
        outline:2px solid #FF7927;
        outline-offset:1px;
      }

      #${MODAL} .mana-v950-send {
        flex:0 0 110px;
        min-height:56px;
        background:#FF7927;
        border:1px solid #FF7927;
        border-radius:12px;
        color:#08090B;
        font:900 14px system-ui;
        cursor:pointer;
      }

      #${MODAL} .mana-v950-send:disabled {
        opacity:.65;
        cursor:wait;
      }

      #${MODAL} .mana-v950-status {
        min-height:20px;
        padding-top:8px;
        font-size:13px;
        font-weight:750;
        color:#C1C6CE;
        line-height:1.4;
      }

      #${MODAL}
      .mana-v950-status[data-kind="sent"] {
        color:#20CDD4;
      }

      #${MODAL}
      .mana-v950-status[data-kind="error"] {
        color:#FF937F;
      }

      /* Connected Coach Hub inbox */

      #${INBOX} {
        width:100%;
        color:#FFFFFF;
      }

      #${INBOX} .mci-header {
        display:flex;
        justify-content:space-between;
        align-items:center;
        flex-wrap:wrap;
        gap:12px;
        margin-bottom:18px;
      }

      #${INBOX} .mci-title {
        color:#FFFFFF;
        font-size:18px;
        font-weight:900;
      }

      #${INBOX} .mci-subtitle {
        color:#C1C6CE;
        font-size:12px;
        margin-top:5px;
        line-height:1.5;
      }

      #${INBOX} .mci-refresh {
        border:1px solid #FF7927;
        border-radius:10px;
        color:#FF7927;
        background:#21170F;
        padding:10px 15px;
        font-size:12px;
        font-weight:850;
        cursor:pointer;
      }

      #${INBOX} .mci-list {
        display:flex;
        flex-direction:column;
        gap:10px;
      }

      #${INBOX} .mci-client {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:15px;
        padding:16px;
        background:#101216;
        border:1px solid #48515B;
        border-radius:14px;
      }

      #${INBOX} .mci-copy {
        flex:1;
        min-width:0;
      }

      #${INBOX} .mci-name {
        color:#FFFFFF;
        font-size:15px;
        font-weight:900;
      }

      #${INBOX} .mci-preview {
        color:#C1C6CE;
        font-size:12px;
        line-height:1.5;
        margin-top:6px;
        overflow-wrap:anywhere;
      }

      #${INBOX} .mci-time {
        color:#AAB2BC;
        font-size:10px;
        margin-top:7px;
      }

      #${INBOX} .mci-open {
        flex:0 0 auto;
        border:1px solid #FF7927;
        border-radius:10px;
        background:#271A12;
        color:#FF7927;
        padding:12px 15px;
        font-size:11px;
        font-weight:900;
        cursor:pointer;
      }

      #${INBOX} .mci-empty {
        padding:20px;
        border:1px solid #48515B;
        border-radius:14px;
        color:#C1C6CE;
        font-size:13px;
        line-height:1.6;
      }

      @media(max-width:600px) {
        #${MODAL} .mana-v950-header {
          padding:12px;
        }

        #${MODAL} .mana-v950-compose {
          padding:10px 10px
            max(12px,env(safe-area-inset-bottom));
        }

        #${MODAL} .mana-v950-send {
          flex-basis:87px;
          font-size:12px;
        }

        #${MODAL} .mana-v950-message {
          max-width:91%;
        }

        #${INBOX} .mci-client {
          align-items:flex-start;
          flex-direction:column;
          gap:12px;
        }

        #${INBOX} .mci-open {
          width:100%;
        }
      }
    `;

    document.head.appendChild(tag);
  }

  function ensureModal() {
    let modal = $(MODAL);

    if (!modal) {
      modal = document.createElement("div");
      modal.id = MODAL;
      document.body.appendChild(modal);
    }

    if (
      $("manaV95Input") &&
      $("manaV95Send") &&
      $("manaV95Messages") &&
      $("manaV95ChatClose")
    ) {
      return modal;
    }

    modal.innerHTML = `
      <div class="mana-v950-header">
        <div>
          <div class="mana-v950-header-kicker"
            id="manaV95ChatKicker">
            MANA MOVEMENT
          </div>

          <div class="mana-v950-header-title"
            id="manaV95ChatTitle">
            Coach Chat
          </div>

          <div class="mana-v950-header-sub"
            id="manaV95ChatSub">
            Direct coaching support
          </div>
        </div>

        <button
          type="button"
          class="mana-v950-close"
          id="manaV95ChatClose"
          aria-label="Close chat"
        >×</button>
      </div>

      <div class="mana-v950-messages"
        id="manaV95Messages"
        aria-live="polite"></div>

      <div class="mana-v950-compose">
        <div class="mana-v950-compose-inner">
          <textarea
            class="mana-v950-input"
            id="manaV95Input"
            rows="1"
            maxlength="2000"
            placeholder="Write a message..."
          ></textarea>

          <button
            type="button"
            class="mana-v950-send"
            id="manaV95Send"
          >SEND</button>
        </div>

        <div class="mana-v950-status"
          id="manaV95Status"
          role="status"
          aria-live="polite"></div>
      </div>
    `;

    return modal;
  }

  function status(message, kind = "normal") {
    const node = $("manaV95Status");
    if (!node) return;

    node.textContent = message;
    node.dataset.kind = kind;
  }

  function label(value) {
    const node = $("manaV95Send");
    if (node) node.textContent = value;
  }

  async function connection() {
    if (
      typeof window.supabaseClient !== "function"
    ) {
      throw new Error(
        "Chat connection unavailable. Sign in again."
      );
    }

    const db = await window.supabaseClient();

    if (!db?.from || !db?.auth?.getUser) {
      throw new Error(
        "Chat connection unavailable. Sign in again."
      );
    }

    return db;
  }

  async function authenticated(db) {
    const {data, error} = await db.auth.getUser();

    if (error || !data?.user?.id) {
      throw new Error(
        "Your session has expired. Log in again."
      );
    }

    return data.user;
  }

  function coachSelection() {
    try {
      if (
        typeof selectedCoachClient !== "undefined" &&
        selectedCoachClient?.userId
      ) {
        return {
          id: String(selectedCoachClient.userId),
          name: String(
            selectedCoachClient.clientName || "Client"
          )
        };
      }
    } catch (_) {}

    return null;
  }

  /* =========================================
     EXISTING SHARED CONVERSATION
     ========================================= */

  async function open(
    role,
    chosenId = "",
    chosenName = "Client"
  ) {
    const epoch = ++requestedOpen;

    ensureModal();

    active = {
      role,
      id: String(chosenId || ""),
      name: String(chosenName || "Client")
    };

    $("manaV95ChatKicker").textContent =
      "MANA MOVEMENT";

    $("manaV95ChatTitle").textContent =
      role === "coach"
        ? active.name + " • Chat"
        : "Coach Chat";

    $("manaV95ChatSub").textContent =
      role === "coach"
        ? "Your client coaching conversation."
        : "Message your coach about training, Fuel or progress.";

    $("manaV95Input").placeholder =
      role === "coach"
        ? "Message " + active.name + "..."
        : "Message your coach...";

    $(MODAL).classList.add("open");

    document.body.style.overflow = "hidden";

    status("Connecting to chat...");
    label("SEND");

    $("manaV95Send").disabled = false;

    $("manaV95Messages").innerHTML =
      '<div class="mana-v950-empty">' +
      'Loading your conversation...</div>';

    try {
      const db = await connection();
      const user = await authenticated(db);

      if (
        epoch !== requestedOpen ||
        !$(MODAL)?.classList.contains("open")
      ) {
        return;
      }

      if (role === "client") {
        active.id = user.id;
      }

      if (!active.id) {
        throw new Error("No client selected.");
      }

      status("");
      await refresh();

      if (epoch === requestedOpen) {
        startRefresh();
      }

    } catch (error) {
      if (epoch !== requestedOpen) return;

      status(
        error?.message || "Could not connect to chat.",
        "error"
      );

      $("manaV95Messages").innerHTML =
        '<div class="mana-v950-empty">' +
        'Chat is unavailable until you sign in.</div>';
    }

    $("manaV95Input")?.focus({
      preventScroll: true
    });
  }

  function close() {
    requestedOpen++;

    $(MODAL)?.classList.remove("open");

    document.body.style.overflow = "";

    stopRefresh();

    if (coachInboxVisible()) {
      loadInbox();
    }
  }

  function render(messages, myId) {
    const host = $("manaV95Messages");
    if (!host) return;

    if (!messages.length) {
      host.innerHTML =
        '<div class="mana-v950-empty">' +
        'No messages yet. Start a conversation ' +
        'with your coach.</div>';
      return;
    }

    const html = messages.map(item => {
      const mine =
        String(item.sender_id) === String(myId);

      const name = mine
        ? "You"
        : item.sender_role === "coach"
          ? "Coach"
          : active.name;

      const stamp = new Date(item.created_at);

      const time = Number.isFinite(
        stamp.getTime()
      ) ? stamp.toLocaleString([], {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit"
      }) : "";

      return `
        <div class="mana-v950-message${
          mine ? " mine" : ""
        }">
          <div class="mana-v950-message-name">
            ${escapeHTML(name)}
          </div>

          <div class="mana-v950-message-body">
            ${escapeHTML(item.body)}
          </div>

          <div class="mana-v950-message-time">
            ${escapeHTML(time)}
          </div>
        </div>
      `;
    }).join("");

    if (host.innerHTML !== html) {
      host.innerHTML = html;
      host.scrollTop = host.scrollHeight;
    }
  }

  async function refresh() {
    if (
      loading ||
      !active.id ||
      !$(MODAL)?.classList.contains("open")
    ) return;

    loading = true;
    const id = active.id;

    try {
      const db = await connection();
      const user = await authenticated(db);

      const {data, error} = await db
        .from("strength_messages")
        .select(
          "id,client_id,sender_id,sender_role,body,created_at"
        )
        .eq("client_id", id)
        .order("created_at", {
          ascending: true
        })
        .limit(100);

      if (error) throw error;

      if (
        active.id === id &&
        $(MODAL)?.classList.contains("open")
      ) {
        render(data || [], user.id);
      }

    } catch (error) {
      if ($(MODAL)?.classList.contains("open")) {
        status(
          "Conversation load error: " +
          (error?.message || "Try again."),
          "error"
        );
      }

    } finally {
      loading = false;
    }
  }

  async function send() {
    if (
      sending ||
      !$(MODAL)?.classList.contains("open")
    ) return;

    const input = $("manaV95Input");
    const message = String(
      input?.value || ""
    ).trim();

    if (!message) {
      status(
        "Write a message before sending.",
        "error"
      );
      return;
    }

    sending = true;
    $("manaV95Send").disabled = true;
    label("SENDING…");
    status("Sending message…");

    let inserted = false;

    try {
      const db = await connection();
      const user = await authenticated(db);

      const id = active.role === "client"
        ? user.id
        : active.id;

      if (!id) {
        throw new Error(
          "No conversation is selected."
        );
      }

      const {error} = await db
        .from("strength_messages")
        .insert({
          client_id: id,
          sender_id: user.id,
          sender_role: active.role,
          body: message
        });

      if (error) throw error;

      inserted = true;

      if (input) input.value = "";

      label("SENT ✓");

      status(
        "Sent ✓ — message saved successfully.",
        "sent"
      );

      await refresh();

    } catch (error) {
      console.error(
        "Mana Movement Coach Chat:",
        error
      );

      if (!inserted) {
        label("SEND");

        status(
          "Not sent: " +
          (error?.message || "Please retry."),
          "error"
        );
      } else {
        label("SENT ✓");

        status(
          "Sent ✓ — message saved; refresh unavailable.",
          "sent"
        );
      }

    } finally {
      sending = false;
      $("manaV95Send").disabled = false;
    }
  }

  function startRefresh() {
    stopRefresh();

    poll = setInterval(() => {
      if (
        $(MODAL)?.classList.contains("open") &&
        !sending
      ) {
        refresh();
      }
    }, 15000);
  }

  function stopRefresh() {
    if (poll !== null) {
      clearInterval(poll);
    }

    poll = null;
  }

  /* =========================================
     COACH HUB INBOX
     ========================================= */

  function coachInboxVisible() {
    const coach = $("coachView");

    const view = document.querySelector(
      CHAT_VIEW
    );

    return Boolean(
      coach &&
      !coach.classList.contains("hide") &&
      view &&
      !view.hidden &&
      view.getClientRects().length > 0
    );
  }

  function ensureInbox() {
    const view = document.querySelector(
      CHAT_VIEW
    );

    const panel = view?.querySelector(
      ".mcn-panel"
    );

    if (!panel) return null;

    let inbox = $(INBOX);

    if (!inbox) {
      panel.innerHTML = "";

      inbox = document.createElement("div");
      inbox.id = INBOX;

      panel.appendChild(inbox);
    }

    return inbox;
  }

  function timeLabel(value) {
    const date = new Date(value);

    if (!Number.isFinite(date.getTime())) {
      return "";
    }

    return date.toLocaleString([], {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function inboxRow(client, latest) {
    let preview = "No messages yet";

    if (latest) {
      preview =
        (latest.sender_role === "coach"
          ? "Coach: "
          : "Client: ") +
        String(latest.body || "").slice(0, 140);
    }

    return `
      <div class="mci-client">
        <div class="mci-copy">
          <div class="mci-name">
            ${escapeHTML(client.name)}
          </div>

          <div class="mci-preview">
            ${escapeHTML(preview)}
          </div>

          ${latest ? `
            <div class="mci-time">
              ${escapeHTML(
                timeLabel(latest.created_at)
              )}
            </div>
          ` : ""}
        </div>

        <button
          type="button"
          class="mci-open"
          data-mci-client="${escapeHTML(client.id)}"
          data-mci-name="${escapeHTML(client.name)}"
        >
          OPEN CHAT →
        </button>
      </div>
    `;
  }

  async function loadInbox() {
    if (
      !coachInboxVisible() ||
      inboxLoading
    ) return;

    const inbox = ensureInbox();
    if (!inbox) return;

    inboxLoading = true;
    const ticket = ++inboxRequest;

    inbox.innerHTML = `
      <div class="mci-empty">
        Loading your coaching conversations…
      </div>
    `;

    try {
      const db = await connection();
      const user = await authenticated(db);

      const profile = await db
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (
        profile.error ||
        profile.data?.role !== "coach"
      ) {
        throw new Error(
          "Coach access required."
        );
      }

      const [clientResult, messageResult] =
        await Promise.all([
          db.rpc("coach_clients_summary"),

          db.from("strength_messages")
            .select(
              "id,client_id,sender_role,body,created_at"
            )
            .order("created_at", {
              ascending: false
            })
            .limit(500)
        ]);

      if (clientResult.error) {
        throw clientResult.error;
      }

      if (messageResult.error) {
        throw messageResult.error;
      }

      if (ticket !== inboxRequest) return;

      const unique = new Map();

      (clientResult.data || []).forEach(row => {
        if (
          row.user_id &&
          !unique.has(String(row.user_id))
        ) {
          unique.set(String(row.user_id), {
            id: String(row.user_id),
            name: String(
              row.full_name || "Client"
            )
          });
        }
      });

      const clients = [...unique.values()];

      const latest = new Map();

      (messageResult.data || []).forEach(msg => {
        const id = String(msg.client_id || "");

        if (id && !latest.has(id)) {
          latest.set(id, msg);
        }
      });

      clients.sort((a, b) => {
        const ta = latest.get(a.id)?.created_at;
        const tb = latest.get(b.id)?.created_at;

        if (ta && !tb) return -1;
        if (tb && !ta) return 1;

        if (ta && tb) {
          const difference =
            new Date(tb).getTime() -
            new Date(ta).getTime();

          if (difference) return difference;
        }

        return a.name.localeCompare(b.name);
      });

      inbox.innerHTML = `
        <div class="mci-header">
          <div>
            <div class="mci-title">
              Coaching Inbox
            </div>

            <div class="mci-subtitle">
              ${clients.length} client${
                clients.length === 1 ? "" : "s"
              } · Shared Mana Movement messages
            </div>
          </div>

          <button
            type="button"
            class="mci-refresh"
            data-mci-refresh="1"
          >
            REFRESH
          </button>
        </div>

        <div class="mci-list">
          ${clients.length
            ? clients.map(client =>
                inboxRow(
                  client,
                  latest.get(client.id)
                )
              ).join("")
            : `
              <div class="mci-empty">
                No client records found.
              </div>
            `
          }
        </div>
      `;

    } catch (error) {
      if (ticket !== inboxRequest) return;

      inbox.innerHTML = `
        <div class="mci-header">
          <div class="mci-title">
            Coaching Inbox
          </div>

          <button
            type="button"
            class="mci-refresh"
            data-mci-refresh="1"
          >
            RETRY
          </button>
        </div>

        <div class="mci-empty">
          ${escapeHTML(
            error?.message ||
            "Could not load conversations."
          )}
        </div>
      `;

      console.warn(
        "[Mana Coach Inbox]",
        error
      );

    } finally {
      inboxLoading = false;
    }
  }

  function syncInboxAfterNavigation() {
    setTimeout(() => {
      if (coachInboxVisible()) {
        loadInbox();
      }
    }, 0);
  }

  /* =========================================
     ORIGINAL COACH CLIENT DETAIL LAUNCHER
     ========================================= */

  function syncLaunchCards() {
    const detail = $("coachClientDetailView");
    const selected = coachSelection();

    if (
      !detail ||
      detail.classList.contains("hide") ||
      !selected
    ) return;

    let card = $("manaV95CoachChatCard");

    if (!card) {
      card = document.createElement("div");
      card.id = "manaV95CoachChatCard";
      card.className = "card";

      const anchor = $("clientSessionSummaryCard");

      if (anchor) {
        anchor.before(card);
      } else {
        detail.appendChild(card);
      }
    }

    if (
      card.dataset.clientId !== selected.id ||
      !card.querySelector("#manaV95CoachOpen")
    ) {
      card.dataset.clientId = selected.id;

      card.innerHTML = `
        <div class="mana-v950-card-kicker">
          COACHING
        </div>

        <div class="mana-v950-card-title">
          Coach Chat
        </div>

        <div class="mana-v950-card-preview">
          Message ${escapeHTML(
            selected.name
          )} directly inside Mana.
        </div>

        <button
          type="button"
          class="mana-v950-open"
          id="manaV95CoachOpen"
        >
          OPEN CLIENT CHAT →
        </button>
      `;
    }
  }

  /* =========================================
     EVENTS
     ========================================= */

  function onClick(event) {
    if (
      !(event.target instanceof Element)
    ) return;

    const target = event.target;

    const inboxClient = target.closest(
      "[data-mci-client]"
    );

    if (inboxClient) {
      event.preventDefault();
      event.stopPropagation();

      open(
        "coach",
        inboxClient.dataset.mciClient,
        inboxClient.dataset.mciName
      );

      return;
    }

    if (
      target.closest("[data-mci-refresh]")
    ) {
      event.preventDefault();
      loadInbox();
      return;
    }

    if (target.closest("#manaV95ClientOpen")) {
      open("client");

    } else if (
      target.closest("#manaV95CoachOpen")
    ) {
      const selected = coachSelection();

      if (selected) {
        open(
          "coach",
          selected.id,
          selected.name
        );
      }

    } else if (
      target.closest("#manaV95ChatClose")
    ) {
      close();

    } else if (
      target.closest("#manaV95Send")
    ) {
      send();
    }
  }

  function onInput(event) {
    if (
      event.target?.id !== "manaV95Input"
    ) return;

    if (
      $("manaV95Send")?.textContent.includes("SENT")
    ) {
      label("SEND");
      status("");
    }
  }

  function onKeyDown(event) {
    if (
      event.target?.id === "manaV95Input" &&
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.isComposing
    ) {
      event.preventDefault();
      send();

    } else if (
      event.key === "Escape" &&
      $(MODAL)?.classList.contains("open")
    ) {
      close();
    }
  }

  /* =========================================
     INITIALISE
     ========================================= */

  function init() {
    applyStyles();
    ensureModal();

    document.addEventListener(
      "click",
      onClick
    );

    document.addEventListener(
      "input",
      onInput
    );

    document.addEventListener(
      "keydown",
      onKeyDown
    );

    /* Existing public functions remain stable. */

    window.openManaStrengthClientChat = () =>
      open("client");

    window.openManaStrengthCoachChat =
      (id, name) =>
        open("coach", id, name);

    window.refreshManaStrengthChat = () => {
      syncLaunchCards();
      return refresh();
    };

    window.refreshManaCoachInbox = loadInbox;

    syncLaunchCards();

    [
      "mana:program-tab-change",
      "mana:profile-synced",
      "mana:strength-synced"
    ].forEach(name =>
      window.addEventListener(
        name,
        syncLaunchCards
      )
    );

    /* Capture the Coach Hub tab click before
       the navigation script changes views. */

    document.addEventListener(
      "click",
      event => {
        if (
          !(event.target instanceof Element)
        ) return;

        if (
          event.target.closest(
            "#manaV97CoachNav," +
            "#manaCoachClientSwitch104870," +
            ".client-open"
          )
        ) {
          syncInboxAfterNavigation();
        }

        if (
          event.target.closest(
            ".client-open,[data-client-id]"
          )
        ) {
          requestAnimationFrame(
            syncLaunchCards
          );
        }
      },
      true
    );

    window.addEventListener(
      "pageshow",
      syncInboxAfterNavigation
    );

    window.MANA_STRENGTH_CHAT_BUILD =
      "104091";

    console.log(
      "[Mana Movement] Shared Coach Chat + Inbox 104091"
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
