
/* ============================================================
   MANA MOVEMENT — SHARED COACH CHAT
   BUILD 104093

   COMPLETE REPLACEMENT:
   mana_strength_chat_104090.js

   - Existing coach/client messaging
   - Coach Hub inbox
   - Coach unread counts
   - Working Summary Chats card
   - Client unread badges on Mana28 and Strength
   - Read confirmation through Supabase
   - Existing messages and modal IDs preserved
   - No database schema changes
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104093";
  if (window.MANA_STRENGTH_CHAT_104093) return;
  window.MANA_STRENGTH_CHAT_104093 = true;

  const $ = id => document.getElementById(id);
  const MODAL = "manaV95ChatModal";
  const STYLE = "manaStrengthChatStyle104093";
  const INBOX = "manaCoachInbox104093";
  const CHAT_VIEW =
    '#manaCoachSuite104707 [data-mcn-view="chat"]';

  const CLIENT_CARDS = [
    "mana28OverviewCoachChat104411",
    "manaV964CoachChat"
  ];

  let active = {
    role: "client",
    id: "",
    name: "Client"
  };

  let sending = false;
  let loading = false;
  let inboxLoading = false;
  let opening = 0;
  let chatTimer = null;
  let inboxTimer = null;
  let unreadBusy = false;

  const escapeHTML = value =>
    String(value ?? "").replace(
      /[&<>"']/g,
      c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "'": "&#39;"
      })[c]
    );

  function coachVisible() {
    const view = $("coachView");
    return Boolean(
      view && !view.classList.contains("hide")
    );
  }

  function inboxVisible() {
    const view = document.querySelector(CHAT_VIEW);
    return Boolean(
      coachVisible() &&
      view &&
      !view.hidden &&
      view.getClientRects().length
    );
  }

  function conversationOpen() {
    return Boolean($(MODAL)?.classList.contains("open"));
  }

  async function connection() {
    if (typeof window.supabaseClient !== "function") {
      throw Error("Chat connection unavailable.");
    }
    const db = await window.supabaseClient();
    if (!db?.from || !db?.auth?.getUser) {
      throw Error("Please sign in again.");
    }
    return db;
  }

  async function account(db) {
    const {data, error} = await db.auth.getUser();
    if (error || !data?.user?.id) {
      throw Error("Your session has expired.");
    }
    return data.user;
  }

  async function accountRole(db, id) {
    const {data, error} = await db
      .from("profiles")
      .select("role")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data?.role || "";
  }

  function timeLabel(value) {
    const date = new Date(value);
    return Number.isFinite(date.getTime())
      ? date.toLocaleString([], {
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit"
        })
      : "";
  }

  /* =================================================
     PREMIUM STYLING
     ================================================= */

  function styles() {
    if ($(STYLE)) return;

    const sheet = document.createElement("style");
    sheet.id = STYLE;

    sheet.textContent = `
      #${MODAL} {
        position:fixed;
        inset:0;
        z-index:100050;
        display:none;
        flex-direction:column;
        width:100%;
        height:100dvh;
        background:#08090B;
        color:#FFFFFF;
        overflow:hidden;
        box-sizing:border-box;
      }

      #${MODAL}.open {display:flex}

      #${MODAL} .mana-v950-header {
        padding:15px 18px;
        flex:0 0 auto;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:15px;
        background:#111317;
        border-bottom:1px solid #515A65;
      }

      #${MODAL} .mana-v950-header-kicker {
        color:#FF7927;
        font-size:11px;
        font-weight:900;
        letter-spacing:.12em;
      }

      #${MODAL} .mana-v950-header-title {
        color:#FFFFFF;
        font-size:23px;
        font-weight:900;
      }

      #${MODAL} .mana-v950-header-sub {
        color:#C1C6CE;
        font-size:12px;
      }

      #${MODAL} .mana-v950-close {
        width:44px;
        height:44px;
        flex:0 0 44px;
        border:1px solid #707780;
        border-radius:12px;
        background:#171A1F;
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
        padding:18px;
        color:#C1C6CE;
        line-height:1.5;
      }

      #${MODAL} .mana-v950-message {
        max-width:min(82%,600px);
        align-self:flex-start;
        padding:12px 15px;
        background:#1B2025;
        border:1px solid #515A65;
        border-radius:15px;
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
        color:#FFFFFF;
        font-size:14px;
        line-height:1.5;
        white-space:pre-wrap;
      }

      #${MODAL} .mana-v950-message-time {
        color:#C1C6CE;
        font-size:10px;
        margin-top:6px;
      }

      #${MODAL} .mana-v950-compose {
        flex:0 0 auto;
        padding:12px 16px
          max(14px,env(safe-area-inset-bottom));
        background:#111317;
        border-top:1px solid #515A65;
      }

      #${MODAL} .mana-v950-compose-inner {
        display:flex;
        gap:10px;
      }

      #${MODAL} .mana-v950-input {
        flex:1 1 auto;
        min-width:0;
        height:56px;
        resize:none;
        box-sizing:border-box;
        padding:14px;
        background:#08090B;
        border:1px solid #697686;
        border-radius:12px;
        color:#FFFFFF;
        font:500 16px/1.4 system-ui;
      }

      #${MODAL} .mana-v950-input:focus {
        outline:2px solid #FF7927;
      }

      #${MODAL} .mana-v950-send {
        flex:0 0 110px;
        min-height:56px;
        background:#FF7927;
        color:#08090B;
        border:1px solid #FF7927;
        border-radius:12px;
        font:900 14px system-ui;
        cursor:pointer;
      }

      #${MODAL} .mana-v950-send:disabled {
        opacity:.65;
      }

      #${MODAL} .mana-v950-status {
        min-height:20px;
        padding-top:8px;
        font-size:12px;
        color:#C1C6CE;
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
        margin-top:5px;
        color:#C1C6CE;
        font-size:12px;
      }

      #${INBOX} .mci-total {
        margin-top:7px;
        color:#FF7927;
        font-size:12px;
        font-weight:850;
      }

      #${INBOX} .mci-refresh {
        padding:10px 15px;
        color:#FF7927;
        background:#21170F;
        border:1px solid #FF7927;
        border-radius:10px;
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

      #${INBOX} .mci-name {
        color:#FFFFFF;
        font-size:15px;
        font-weight:900;
      }

      #${INBOX} .mci-preview {
        color:#C1C6CE;
        font-size:12px;
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
        padding:12px 15px;
        background:#271A12;
        border:1px solid #FF7927;
        border-radius:10px;
        color:#FF7927;
        font-size:11px;
        font-weight:900;
        cursor:pointer;
      }

      #${INBOX} .mci-empty {
        padding:18px;
        border:1px solid #48515B;
        border-radius:12px;
        color:#C1C6CE;
        font-size:13px;
      }

      /* Orange unread badges */

      .mci-unread,
      #manaV97CoachNav .mci-tab-unread,
      .mana-client-chat-unread {
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-width:22px;
        height:22px;
        padding:0 6px;
        box-sizing:border-box;
        border-radius:999px;
        background:#FF7927;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        font-size:11px;
        font-weight:950;
        line-height:1;
      }

      #manaV97CoachNav .mci-tab-unread {
        min-width:19px;
        height:19px;
        margin-top:3px;
        font-size:10px;
      }

      .mci-tab-unread[hidden],
      .mana-client-chat-unread[hidden] {
        display:none!important;
      }

      /* Client Overview Chat cards */

      #mana28OverviewCoachChat104411,
      #manaV964CoachChat {
        position:relative!important;
      }

      #mana28OverviewCoachChat104411
      .mana-client-chat-unread,
      #manaV964CoachChat
      .mana-client-chat-unread {
        position:absolute;
        top:9px;
        right:12px;
        z-index:3;
        box-shadow:0 0 0 2px #102024;
      }

      /* Original Summary Chats card */

      #manaCoachHubClean103760
      .hub-alert-grid > .hub-alert:first-child {
        cursor:pointer!important;
        border-color:#FF7927!important;
      }

      #manaCoachHubClean103760
      .hub-alert-grid > .hub-alert:first-child
      .hub-alert-number {
        color:#FF7927!important;
      }

      #manaCoachHubClean103760
      .hub-alert-grid > .hub-alert:first-child:focus-visible {
        outline:2px solid #FF7927!important;
        outline-offset:3px!important;
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
        }

        #${INBOX} .mci-open {
          width:100%;
        }
      }
    `;

    document.head.appendChild(sheet);
  }

  /* =================================================
     CHAT MODAL
     ================================================= */

  function ensureModal() {
    let modal = $(MODAL);

    if (!modal) {
      modal = document.createElement("div");
      modal.id = MODAL;
      document.body.appendChild(modal);
    }

    if (
      $("manaV95Input") &&
      $("manaV95Messages") &&
      $("manaV95Send") &&
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

        <button type="button"
          class="mana-v950-close"
          id="manaV95ChatClose"
          aria-label="Close chat">
          ×
        </button>
      </div>

      <div class="mana-v950-messages"
        id="manaV95Messages"
        aria-live="polite"></div>

      <div class="mana-v950-compose">
        <div class="mana-v950-compose-inner">
          <textarea
            id="manaV95Input"
            class="mana-v950-input"
            rows="1"
            maxlength="2000"
            placeholder="Write a message..."
          ></textarea>

          <button type="button"
            id="manaV95Send"
            class="mana-v950-send">
            SEND
          </button>
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

  function sendLabel(value) {
    const button = $("manaV95Send");
    if (button) button.textContent = value;
  }

  /* =================================================
     LIVE UNREAD COUNTS
     ================================================= */

  function coachChatTab() {
    return document.querySelector(
      '#manaV97CoachNav [data-coach-page="progress"]'
    );
  }

  function summaryCard() {
    return document.querySelector(
      "#manaCoachHubClean103760 " +
      ".hub-alert-grid > .hub-alert:first-child"
    );
  }

  function updateSummary(count) {
    const card = summaryCard();
    if (!card) return;

    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute(
      "aria-label",
      count
        ? `Open Chat. ${count} unread messages`
        : "Open Chat. No unread messages"
    );

    const number = card.querySelector(
      ".hub-alert-number"
    );

    const description = card.querySelector("small");

    if (number) {
      const value = String(count);
      if (number.textContent !== value) {
        number.textContent = value;
      }
    }

    if (description) {
      const text = count
        ? `${count} unread message${count === 1 ? "" : "s"} · Open inbox →`
        : "All caught up · Open inbox →";

      if (description.textContent !== text) {
        description.textContent = text;
      }
    }
  }

  function updateCoachBadge(count) {
    const tab = coachChatTab();

    if (!tab) return;

    let badge = tab.querySelector(
      ".mci-tab-unread"
    );

    if (!badge) {
      badge = document.createElement("span");
      badge.className = "mci-tab-unread";
      badge.setAttribute(
        "aria-label",
        "Unread messages"
      );
      tab.appendChild(badge);
    }

    badge.textContent =
      count > 99 ? "99+" : String(count);

    badge.hidden = count === 0;
  }

  function updateClientBadges(count) {
    const selectors = [
      "#mana28OverviewCoachChat104411",
      "#manaV964CoachChat",
      ".mana-hub-chat"
    ];

    const found = new Set();

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(card => {
        if (found.has(card)) return;
        found.add(card);

        let badge = card.querySelector(
          ".mana-client-chat-unread"
        );

        if (!badge) {
          badge = document.createElement("span");
          badge.className = "mana-client-chat-unread";
          badge.setAttribute(
            "aria-label",
            "Unread coach messages"
          );
          card.appendChild(badge);
        }

        badge.textContent =
          count > 99 ? "99+" : String(count);

        badge.hidden = count === 0;
      });
    });
  }

  async function refreshUnread() {
    if (unreadBusy) return;
    unreadBusy = true;

    try {
      const db = await connection();
      const user = await account(db);
      const role = await accountRole(db, user.id);

      if (role === "coach") {
        const {count, error} = await db
          .from("strength_messages")
          .select("id", {
            count: "exact",
            head: true
          })
          .eq("sender_role", "client")
          .is("read_at", null);

        if (error) throw error;

        const unread = count || 0;
        updateCoachBadge(unread);
        updateSummary(unread);

      } else if (role === "client") {
        const {count, error} = await db
          .from("strength_messages")
          .select("id", {
            count: "exact",
            head: true
          })
          .eq("client_id", user.id)
          .eq("sender_role", "coach")
          .is("read_at", null);

        if (error) throw error;

        updateClientBadges(count || 0);
      }
    } catch (error) {
      console.warn(
        "[Mana Chat] Unread:",
        error?.message || error
      );
    } finally {
      unreadBusy = false;
    }
  }

  /* =================================================
     SHARED CONVERSATIONS
     ================================================= */

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

  async function open(
    role,
    clientId = "",
    clientName = "Client"
  ) {
    const ticket = ++opening;
    ensureModal();

    active = {
      role,
      id: String(clientId || ""),
      name: String(clientName || "Client")
    };

    $("manaV95ChatKicker").textContent =
      "MANA MOVEMENT";

    $("manaV95ChatTitle").textContent =
      role === "coach"
        ? `${active.name} • Chat`
        : "Coach Chat";

    $("manaV95ChatSub").textContent =
      role === "coach"
        ? "Your client coaching conversation."
        : "Message your coach about training, Fuel or progress.";

    $("manaV95Input").placeholder =
      role === "coach"
        ? `Message ${active.name}...`
        : "Message your coach...";

    $(MODAL).classList.add("open");
    document.body.style.overflow = "hidden";

    $("manaV95Messages").innerHTML =
      '<div class="mana-v950-empty">' +
      'Loading conversation...</div>';

    $("manaV95Send").disabled = false;
    sendLabel("SEND");
    status("Connecting...");

    try {
      const db = await connection();
      const user = await account(db);

      if (ticket !== opening || !conversationOpen()) {
        return;
      }

      const actualRole = await accountRole(db, user.id);

      if (actualRole !== role) {
        throw Error("Incorrect chat account role.");
      }

      if (role === "client") {
        active.id = user.id;
      }

      if (!active.id) {
        throw Error("No client selected.");
      }

      status("");
      await refreshConversation();
      startChatRefresh();

    } catch (error) {
      if (ticket !== opening) return;

      status(
        error?.message || "Unable to connect.",
        "error"
      );
    }
  }

  function close() {
    opening++;
    $(MODAL)?.classList.remove("open");
    document.body.style.overflow = "";
    stopChatRefresh();

    refreshUnread();

    if (inboxVisible()) {
      loadInbox();
    }
  }

  async function markRead(db, clientId, role) {
    const senderRole =
      role === "coach" ? "client" : "coach";

    const {error} = await db
      .from("strength_messages")
      .update({
        read_at: new Date().toISOString()
      })
      .eq("client_id", clientId)
      .eq("sender_role", senderRole)
      .is("read_at", null);

    if (error) throw error;
    return true;
  }

  function renderMessages(messages, myId) {
    const host = $("manaV95Messages");
    if (!host) return;

    if (!messages.length) {
      host.innerHTML =
        '<div class="mana-v950-empty">' +
        'No messages yet. Start a conversation.</div>';
      return;
    }

    const html = messages.map(item => {
      const mine = String(item.sender_id) ===
        String(myId);

      return `
        <div class="mana-v950-message${mine ? " mine" : ""}">
          <div class="mana-v950-message-name">
            ${mine ? "You" :
              item.sender_role === "coach"
                ? "Coach"
                : escapeHTML(active.name)}
          </div>

          <div class="mana-v950-message-body">
            ${escapeHTML(item.body)}
          </div>

          <div class="mana-v950-message-time">
            ${escapeHTML(timeLabel(item.created_at))}
          </div>
        </div>
      `;
    }).join("");

    if (host.innerHTML !== html) {
      host.innerHTML = html;
      host.scrollTop = host.scrollHeight;
    }
  }

  async function refreshConversation() {
    if (loading || !active.id || !conversationOpen()) {
      return;
    }

    loading = true;
    const id = active.id;
    const role = active.role;

    try {
      const db = await connection();
      const user = await account(db);

      const {data, error} = await db
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
        !conversationOpen() ||
        active.id !== id ||
        active.role !== role
      ) return;

      renderMessages(data || [], user.id);

      const senderRole = role === "coach"
        ? "client"
        : "coach";

      if ((data || []).some(msg =>
        msg.sender_role === senderRole &&
        msg.read_at === null
      )) {
        await markRead(db, id, role);
        await refreshUnread();
      }

    } catch (error) {
      if (conversationOpen()) {
        status(
          "Chat error: " +
          (error?.message || "Please retry."),
          "error"
        );
      }

    } finally {
      loading = false;
    }
  }


  async function send() {
    if (sending || !conversationOpen()) return;

    const input = $("manaV95Input");
    const text = String(input?.value || "").trim();

    if (!text) {
      status("Write a message first.", "error");
      return;
    }

    sending = true;
    $("manaV95Send").disabled = true;
    sendLabel("SENDING...");
    status("Sending...");

    try {
      const db = await connection();
      const user = await account(db);

      const clientId = active.role === "client"
        ? user.id
        : active.id;

      const {error} = await db
        .from("strength_messages")
        .insert({
          client_id: clientId,
          sender_id: user.id,
          sender_role: active.role,
          body: text
        });

      if (error) throw error;

      input.value = "";
      sendLabel("SENT ✓");
      status("Sent ✓ — saved successfully.", "sent");

      await refreshConversation();

    } catch (error) {
      sendLabel("SEND");
      status(
        "Not sent: " +
        (error?.message || "Please retry."),
        "error"
      );

    } finally {
      sending = false;
      $("manaV95Send").disabled = false;
    }
  }

  function startChatRefresh() {
    stopChatRefresh();

    chatTimer = setInterval(() => {
      if (conversationOpen() && !sending) {
        refreshConversation();
      }
    }, 15000);
  }

  function stopChatRefresh() {
    if (chatTimer !== null) {
      clearInterval(chatTimer);
    }
    chatTimer = null;
  }

  /* =================================================
     COACH HUB INBOX
     ================================================= */

  function ensureInbox() {
    const panel = document.querySelector(
      CHAT_VIEW + " .mcn-panel"
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

  async function loadInbox() {
    if (!inboxVisible() || inboxLoading) return;

    const host = ensureInbox();
    if (!host) return;

    inboxLoading = true;

    try {
      const db = await connection();
      const user = await account(db);
      const role = await accountRole(db, user.id);

      if (role !== "coach") {
        throw Error("Coach access required.");
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

      const map = new Map();

      (clientResult.data || []).forEach(row => {
        const id = String(row.user_id || "");
        if (!id) return;

        map.set(id, {
          id,
          name: String(row.full_name || "Client"),
          unread: 0,
          preview: "No messages yet",
          lastAt: ""
        });
      });

      (messageResult.data || []).forEach(msg => {
        const client = map.get(
          String(msg.client_id || "")
        );

        if (!client) return;

        if (!client.lastAt) {
          client.lastAt = msg.created_at;
          client.preview =
            (msg.sender_role === "coach"
              ? "Coach: "
              : "Client: ") +
            String(msg.body || "").slice(0, 140);
        }

        if (
          msg.sender_role === "client" &&
          msg.read_at === null
        ) {
          client.unread++;
        }
      });

      const clients = [...map.values()].sort(
        (a, b) =>
          b.unread - a.unread ||
          (b.lastAt ? new Date(b.lastAt).getTime() : 0) -
          (a.lastAt ? new Date(a.lastAt).getTime() : 0) ||
          a.name.localeCompare(b.name)
      );

      const total = clients.reduce(
        (sum, client) => sum + client.unread,
        0
      );

      updateSummary(total);
      updateCoachBadge(total);

      host.innerHTML = `
        <div class="mci-header">
          <div>
            <div class="mci-title">
              Coaching Inbox
            </div>

            <div class="mci-subtitle">
              ${clients.length} clients · Shared Mana Movement messages
            </div>

            ${total ? `
              <div class="mci-total">
                ${total} unread message${total === 1 ? "" : "s"}
              </div>
            ` : ""}
          </div>

          <button
            class="mci-refresh"
            type="button"
            data-mci-refresh="1">
            REFRESH
          </button>
        </div>

        <div class="mci-list">
          ${clients.map(client => `
            <div class="mci-client${client.unread ? " has-unread" : ""}">
              <div class="mci-copy">
                <div class="mci-name">
                  ${escapeHTML(client.name)}
                  ${client.unread ? `
                    <span class="mci-unread">
                      ${client.unread}
                    </span>
                  ` : ""}
                </div>

                <div class="mci-preview">
                  ${escapeHTML(client.preview)}
                </div>

                <div class="mci-time">
                  ${escapeHTML(timeLabel(client.lastAt))}
                </div>
              </div>

              <button
                class="mci-open"
                type="button"
                data-mci-client="${escapeHTML(client.id)}"
                data-mci-name="${escapeHTML(client.name)}">
                OPEN CHAT →
              </button>
            </div>
          `).join("")}
        </div>
      `;

    } catch (error) {
      host.innerHTML = `
        <div class="mci-empty">
          ${escapeHTML(
            error?.message || "Could not load inbox."
          )}

          <button
            type="button"
            class="mci-refresh"
            data-mci-refresh="1">
            RETRY
          </button>
        </div>
      `;

    } finally {
      inboxLoading = false;
    }
  }

  /* =================================================
     COACH CLIENT PROFILE LAUNCHER
     ================================================= */

  function syncCoachClientCard() {
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

      if (anchor) anchor.before(card);
      else detail.appendChild(card);
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
          Message ${escapeHTML(selected.name)}
          directly inside Mana.
        </div>

        <button type="button"
          class="mana-v950-open"
          id="manaV95CoachOpen">
          OPEN CLIENT CHAT →
        </button>
      `;
    }
  }

  /* =================================================
     EVENTS
     ================================================= */

  function openCoachTab() {
    const button = coachChatTab();
    if (button) button.click();
  }

  function onClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.closest("[data-mci-client]")) {
      const button = target.closest(
        "[data-mci-client]"
      );

      event.preventDefault();

      open(
        "coach",
        button.dataset.mciClient,
        button.dataset.mciName
      );
      return;
    }

    if (target.closest("[data-mci-refresh]")) {
      event.preventDefault();
      loadInbox();
      return;
    }

    const card = summaryCard();

    if (card && card.contains(target)) {
      event.preventDefault();
      openCoachTab();
      return;
    }

    if (target.closest("#manaV95ClientOpen")) {
      open("client");
      return;
    }

    if (target.closest("#manaV95CoachOpen")) {
      const selected = coachSelection();
      if (selected) {
        open("coach", selected.id, selected.name);
      }
      return;
    }

    if (target.closest("#manaV95ChatClose")) {
      close();
      return;
    }

    if (target.closest("#manaV95Send")) {
      send();
    }
  }

  function onKeyDown(event) {
    if (
      (event.key === "Enter" || event.key === " ") &&
      document.activeElement === summaryCard()
    ) {
      event.preventDefault();
      openCoachTab();
      return;
    }

    if (
      event.target?.id === "manaV95Input" &&
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.isComposing
    ) {
      event.preventDefault();
      send();
      return;
    }

    if (
      event.key === "Escape" &&
      conversationOpen()
    ) {
      close();
    }
  }

  function onInput(event) {
    if (event.target?.id !== "manaV95Input") {
      return;
    }

    if (
      $("manaV95Send")?.textContent.includes("SENT")
    ) {
      sendLabel("SEND");
      status("");
    }
  }

  /* =================================================
     INITIALISE
     ================================================= */

  function init() {
    styles();
    ensureModal();

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("input", onInput);

    window.openManaStrengthClientChat =
      () => open("client");

    window.openManaStrengthCoachChat =
      (id, name) => open("coach", id, name);

    window.refreshManaStrengthChat =
      () => {
        syncCoachClientCard();
        return refreshConversation();
      };

    window.refreshManaCoachInbox = loadInbox;

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) return;

        if (
          event.target.closest(
            "#manaV97CoachNav," +
            ".client-open," +
            "#manaV80Mana28," +
            "#manaV83Tabs"
          )
        ) {
          setTimeout(() => {
            syncCoachClientCard();
            refreshUnread();

            if (inboxVisible()) {
              loadInbox();
            }
          }, 60);
        }
      },
      true
    );

    window.addEventListener("pageshow", () => {
      refreshUnread();
    });

    window.addEventListener(
      "mana:program-tab-change",
      () => {
        refreshUnread();
      }
    );

    window.addEventListener(
      "mana:profile-synced",
      refreshUnread
    );

    syncCoachClientCard();

    /* Check for new messages only while
       the application is open. */

    inboxTimer = setInterval(() => {
      if (document.visibilityState === "hidden") {
        return;
      }

      refreshUnread();

      if (inboxVisible()) {
        loadInbox();
      }
    }, 30000);

    refreshUnread();

    window.MANA_STRENGTH_CHAT_BUILD = BUILD;

    console.log(
      "[Mana Movement] Shared Chat 104093"
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
