
/* ============================================================
   MANA MOVEMENT — SHARED COACH CHAT
   BUILD 104092

   COMPLETE FILE REPLACEMENT:
   mana_strength_chat_104090.js

   FEATURES
   - Shared Mana Strength / Mana28 messaging
   - Existing conversation history
   - Coach Hub client inbox
   - Real unread-message counts
   - Orange unread indicators
   - Mark received messages as read
   - Inbox refresh
   - Original public chat functions and modal IDs
   - No new messaging tables
   ============================================================ */

(() => {
  "use strict";

  if (window.MANA_STRENGTH_CHAT_104092) return;
  window.MANA_STRENGTH_CHAT_104092 = true;

  const BUILD = "104092";
  const MODAL = "manaV95ChatModal";
  const STYLE = "manaStrengthChatStyle104092";
  const INBOX = "manaCoachInbox104092";

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
  let inboxLoading = false;

  let chatRequest = 0;
  let inboxRequest = 0;

  let chatTimer = null;
  let inboxTimer = null;

  let currentInbox = [];
  let inboxUnreadTotal = 0;

  const escapeHTML = value =>
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

  function coachVisible() {
    const view = $("coachView");

    return Boolean(
      view &&
      !view.classList.contains("hide")
    );
  }

  function inboxVisible() {
    const view = document.querySelector(
      CHAT_VIEW
    );

    return Boolean(
      coachVisible() &&
      view &&
      !view.hidden &&
      view.getClientRects().length
    );
  }

  /* ======================================
     CLOUD CONNECTION
     ====================================== */

  async function connection() {
    if (
      typeof window.supabaseClient !== "function"
    ) {
      throw Error(
        "Chat connection unavailable. Sign in again."
      );
    }

    const db = await window.supabaseClient();

    if (!db?.from || !db?.auth?.getUser) {
      throw Error("Chat connection unavailable.");
    }

    return db;
  }

  async function authenticated(db) {
    const { data, error } =
      await db.auth.getUser();

    if (error || !data?.user?.id) {
      throw Error(
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
            selectedCoachClient.clientName ||
            "Client"
          )
        };
      }
    } catch (_) {}

    return null;
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

  /* ======================================
     STYLES
     ====================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `
      /* Shared conversation modal */

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

      /* Coach Hub inbox */

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
        font-size:19px;
        font-weight:900;
        color:#FFFFFF;
      }

      #${INBOX} .mci-subtitle {
        color:#C1C6CE;
        font-size:12px;
        margin-top:5px;
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

      #${INBOX} .mci-client.has-unread {
        border-color:#FF7927;
      }

      #${INBOX} .mci-copy {
        flex:1;
        min-width:0;
      }

      #${INBOX} .mci-name-line {
        display:flex;
        align-items:center;
        flex-wrap:wrap;
        gap:9px;
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

      /* Unread badges */

      #${INBOX} .mci-unread,
      #manaV97CoachNav .mci-tab-unread {
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-width:23px;
        height:23px;
        padding:0 6px;
        box-sizing:border-box;
        border-radius:999px;
        background:#FF7927;
        color:#08090B;
        -webkit-text-fill-color:#08090B;
        font-size:11px;
        font-weight:950;
        line-height:1;
        font-variant-numeric:tabular-nums;
      }

      #manaV97CoachNav .mci-tab-unread {
        min-width:19px;
        height:19px;
        font-size:10px;
        margin-top:3px;
      }

      #manaV97CoachNav
      .mci-tab-unread[hidden] {
        display:none!important;
      }

      #${INBOX} .mci-total {
        color:#FF7927;
        font-size:12px;
        font-weight:850;
        margin-top:7px;
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
          flex-direction:column;
          align-items:stretch;
          gap:12px;
        }

        #${INBOX} .mci-open {
          width:100%;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ======================================
     MODAL
     ====================================== */

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

  /* ======================================
     OPEN SHARED CONVERSATION
     ====================================== */

  async function open(
    role,
    chosenId = "",
    chosenName = "Client"
  ) {
    const ticket = ++chatRequest;

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
        ticket !== chatRequest ||
        !$(MODAL)?.classList.contains("open")
      ) {
        return;
      }

      if (role === "client") {
        active.id = user.id;
      }

      if (!active.id) {
        throw Error(
          "No conversation selected."
        );
      }

      status("");

      await refresh();

      if (ticket === chatRequest) {
        startChatRefresh();
      }

    } catch (error) {
      if (ticket !== chatRequest) return;

      status(
        error?.message ||
        "Could not connect to chat.",
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
    chatRequest++;

    $(MODAL)?.classList.remove("open");
    document.body.style.overflow = "";

    stopChatRefresh();

    if (inboxVisible()) {
      loadInbox();
    }
  }

  /* ======================================
     MARK RECEIVED MESSAGES AS READ

     Coach reads CLIENT messages.
     Client reads COACH messages.
     ====================================== */

  async function markRead(db, clientId, role) {
    const senderRole =
      role === "coach"
        ? "client"
        : "coach";

    const { error } = await db
      .from("strength_messages")
      .update({
        read_at: new Date().toISOString()
      })
      .eq("client_id", clientId)
      .eq("sender_role", senderRole)
      .is("read_at", null);

    if (error) {
      console.warn(
        "[Mana Chat] Mark read:",
        error.message
      );
      return false;
    }

    return true;
  }

  function renderMessages(messages, myId) {
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
            ${escapeHTML(
              timeLabel(item.created_at)
            )}
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
    const role = active.role;

    try {
      const db = await connection();
      const user = await authenticated(db);

      const { data, error } = await db
        .from("strength_messages")
        .select(
          "id,client_id,sender_id,sender_role,body,created_at,read_at"
        )
        .eq("client_id", id)
        .order("created_at", {
          ascending: true
        })
        .limit(100);

      if (error) throw error;

      if (
        active.id !== id ||
        active.role !== role ||
        !$(MODAL)?.classList.contains("open")
      ) return;

      renderMessages(
        data || [],
        user.id
      );

      const hasUnread = (data || []).some(
        msg =>
          msg.read_at === null &&
          msg.sender_role === (
            role === "coach"
              ? "client"
              : "coach"
          )
      );

      if (hasUnread) {
        const marked = await markRead(
          db,
          id,
          role
        );

        if (marked && role === "coach") {
          refreshUnreadCount();
        }
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

  /* ======================================
     SEND MESSAGE
     ====================================== */

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
        throw Error(
          "No conversation selected."
        );
      }

      const { error } = await db
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
        "[Mana Coach Chat]",
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

  function startChatRefresh() {
    stopChatRefresh();

    chatTimer = setInterval(() => {
      if (
        $(MODAL)?.classList.contains("open") &&
        !sending
      ) {
        refresh();
      }
    }, 15000);
  }

  function stopChatRefresh() {
    if (chatTimer !== null) {
      clearInterval(chatTimer);
    }

    chatTimer = null;
  }

  /* ======================================
     COACH HUB UNREAD BADGE
     ====================================== */

  function chatTab() {
    return document.querySelector(
      '#manaV97CoachNav [data-coach-page="progress"]'
    );
  }

  function updateTabBadge(total) {
    const tab = chatTab();
    if (!tab) return;

    let badge = tab.querySelector(
      ".mci-tab-unread"
    );

    if (!badge) {
      badge = document.createElement("span");
      badge.className = "mci-tab-unread";
      badge.setAttribute(
        "aria-label",
        "Unread client messages"
      );

      tab.appendChild(badge);
    }

    badge.textContent =
      total > 99 ? "99+" : String(total);

    badge.hidden = total === 0;
  }

  async function refreshUnreadCount() {
    if (!coachVisible()) return;

    try {
      const db = await connection();
      const user = await authenticated(db);

      const { data: profile } = await db
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "coach") {
        return;
      }

      const { count, error } = await db
        .from("strength_messages")
        .select("id", {
          count: "exact",
          head: true
        })
        .eq("sender_role", "client")
        .is("read_at", null);

      if (error) throw error;

      inboxUnreadTotal = count || 0;

      updateTabBadge(inboxUnreadTotal);

    } catch (error) {
      console.warn(
        "[Mana Chat] Unread count:",
        error?.message || error
      );
    }
  }

  /* ======================================
     COACH INBOX
     ====================================== */

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

  function inboxRow(client) {
    return `
      <div class="mci-client${
        client.unread ? " has-unread" : ""
      }">

        <div class="mci-copy">
          <div class="mci-name-line">
            <span class="mci-name">
              ${escapeHTML(client.name)}
            </span>

            ${client.unread ? `
              <span
                class="mci-unread"
                aria-label="${client.unread} unread messages"
              >
                ${client.unread > 99
                  ? "99+"
                  : client.unread}
              </span>
            ` : ""}
          </div>

          <div class="mci-preview">
            ${escapeHTML(
              client.preview ||
              "No messages yet"
            )}
          </div>

          ${client.lastAt ? `
            <div class="mci-time">
              ${escapeHTML(
                timeLabel(client.lastAt)
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
      !inboxVisible() ||
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

      const { data: profile, error: roleError } =
        await db
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

      if (
        roleError ||
        profile?.role !== "coach"
      ) {
        throw Error(
          "Coach access required."
        );
      }

      const [clientResult, messageResult] =
        await Promise.all([
          db.rpc("coach_clients_summary"),

          db.from("strength_messages")
            .select(
              "id,client_id,sender_role,body,created_at,read_at"
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
        const id = String(
          row.user_id || ""
        );

        if (id && !unique.has(id)) {
          unique.set(id, {
            id,
            name: String(
              row.full_name || "Client"
            ),
            preview: "",
            lastAt: "",
            unread: 0
          });
        }
      });

      (messageResult.data || []).forEach(msg => {
        const id = String(
          msg.client_id || ""
        );

        const client = unique.get(id);
        if (!client) return;

        if (!client.lastAt) {
          client.lastAt = msg.created_at;

          client.preview =
            (
              msg.sender_role === "coach"
                ? "Coach: "
                : "Client: "
            ) +
            String(msg.body || "").slice(
              0,
              140
            );
        }

        if (
          msg.sender_role === "client" &&
          msg.read_at === null
        ) {
          client.unread++;
        }
      });

      currentInbox = [...unique.values()];

      currentInbox.sort((a, b) => {
        if (a.unread && !b.unread) return -1;
        if (b.unread && !a.unread) return 1;

        if (a.lastAt && !b.lastAt) return -1;
        if (b.lastAt && !a.lastAt) return 1;

        if (a.lastAt && b.lastAt) {
          const difference =
            new Date(b.lastAt).getTime() -
            new Date(a.lastAt).getTime();

          if (difference) return difference;
        }

        return a.name.localeCompare(b.name);
      });

      const unread = currentInbox.reduce(
        (total, client) =>
          total + client.unread,
        0
      );

      inboxUnreadTotal = unread;
      updateTabBadge(unread);

      inbox.innerHTML = `
        <div class="mci-header">
          <div>
            <div class="mci-title">
              Coaching Inbox
            </div>

            <div class="mci-subtitle">
              ${currentInbox.length}
              client${
                currentInbox.length === 1
                  ? ""
                  : "s"
              } · Shared Mana Movement messages
            </div>

            ${unread ? `
              <div class="mci-total">
                ${unread} unread message${
                  unread === 1 ? "" : "s"
                }
              </div>
            ` : ""}
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
          ${currentInbox.length
            ? currentInbox.map(
                inboxRow
              ).join("")
            : `
              <div class="mci-empty">
                No client records found.
              </div>
            `}
        </div>
      `;

    } catch (error) {
      if (ticket !== inboxRequest) return;

      inbox.innerHTML = `
        <div class="mci-header">
          <span class="mci-title">
            Coaching Inbox
          </span>

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

  function refreshAfterNavigation() {
    setTimeout(() => {
      if (!coachVisible()) return;

      refreshUnreadCount();

      if (inboxVisible()) {
        loadInbox();
      }
    }, 0);
  }

  /* ======================================
     ORIGINAL CLIENT DETAIL CHAT
     ====================================== */

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

      const anchor = $(
        "clientSessionSummaryCard"
      );

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

  /* ======================================
     EVENTS
     ====================================== */

  function onClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) return;

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
      target.closest(
        "[data-mci-refresh]"
      )
    ) {
      event.preventDefault();
      loadInbox();
      return;
    }

    if (
      target.closest("#manaV95ClientOpen")
    ) {
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
      $("manaV95Send")?.textContent.includes(
        "SENT"
      )
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

  /* ======================================
     INITIALISE
     ====================================== */

  function init() {
    installStyles();
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

    /* Preserve public functions used by
       Mana28 and Mana Strength. */

    window.openManaStrengthClientChat = () =>
      open("client");

    window.openManaStrengthCoachChat =
      (id, name) =>
        open("coach", id, name);

    window.refreshManaStrengthChat = () => {
      syncLaunchCards();
      return refresh();
    };

    window.refreshManaCoachInbox =
      loadInbox;

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
          refreshAfterNavigation();
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
      refreshAfterNavigation
    );

    /* Only check the inbox while Coach Hub
       is visible, avoiding a second
       constantly running chat connection. */

    inboxTimer = setInterval(() => {
      if (!coachVisible()) return;

      refreshUnreadCount();

      if (inboxVisible() && !inboxLoading) {
        loadInbox();
      }
    }, 30000);

    if (coachVisible()) {
      refreshUnreadCount();
    }

    window.MANA_STRENGTH_CHAT_BUILD = BUILD;

    console.log(
      "[Mana Movement] Shared Coach Chat " +
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
