
/* ============================================================
   MANA MOVEMENT — SHARED COACH CHAT
   BUILD 104095 — MOBILE STABILITY + UNREAD BADGES

   COMPLETE FILE:
   mana_strength_chat_104090.js

   Shared Mana Strength and Mana28 conversations.
   Coach Hub inbox, Summary alerts and unread badges.
   Preserves strength_messages and existing message history.
   No database changes.
   ============================================================ */
(() => {
  "use strict";

  if (window.MANA_STRENGTH_CHAT_104095) return;
  window.MANA_STRENGTH_CHAT_104095 = true;

  const BUILD = "104095";
  const $ = id => document.getElementById(id);
  const MODAL = "manaV95ChatModal";
  const STYLE = "manaChatStyle104095";
  const INBOX = "manaCoachInbox104095";
  const CHAT_VIEW =
    '#manaCoachSuite104707 [data-mcn-view="chat"]';

  const CLIENT_CARD_IDS = [
    "mana28OverviewCoachChat104411",
    "manaStrengthHubChat104080"
  ];

  let active = null;
  let opening = 0;
  let loadingMessages = false;
  let sending = false;
  let loadingInbox = false;
  let loadingUnread = false;
  let lastCoachCount = 0;
  let lastClientCount = 0;
  let chatPoll = null;
  let appPoll = null;
  let previousOverflow = "";

  const escapeHTML = value =>
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

  function coachVisible() {
    const view = $("coachView");
    return !!view &&
      !view.classList.contains("hide");
  }

  function inboxVisible() {
    const view = document.querySelector(CHAT_VIEW);
    return coachVisible() &&
      !!view &&
      !view.hidden &&
      view.getClientRects().length > 0;
  }

  function modalOpen() {
    return !!$(MODAL)?.classList.contains("open");
  }

  async function cloud() {
    if (typeof window.supabaseClient !== "function") {
      throw Error("Chat connection unavailable.");
    }
    const db = await window.supabaseClient();
    if (!db?.auth?.getUser || !db?.from) {
      throw Error("Chat connection unavailable.");
    }
    return db;
  }

  async function session(db) {
    const result = await db.auth.getUser();
    if (result.error || !result.data?.user?.id) {
      throw Error("Please sign in again.");
    }
    return result.data.user;
  }

  async function roleFor(db, id) {
    const result = await db
      .from("profiles")
      .select("role")
      .eq("id", id)
      .single();

    if (result.error) throw result.error;
    return result.data?.role || "";
  }

  function dateLabel(value) {
    if (!value) return "";
    const d = new Date(value);
    if (!Number.isFinite(d.getTime())) return "";
    return d.toLocaleString([], {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit"
    });
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

  /* =========================================================
     STYLES
     ========================================================= */

  function installStyles() {
    if ($(STYLE)) return;

    const sheet = document.createElement("style");
    sheet.id = STYLE;

    sheet.textContent = `
      /* Conversation overlay, including mobile browsers */

      html body #${MODAL} {
        position:fixed!important;
        inset:0!important;
        width:100%!important;
        height:100%!important;
        height:100dvh!important;
        z-index:100050!important;
        display:none!important;
        flex-direction:column!important;
        padding:0!important;
        margin:0!important;
        background:#08090B!important;
        color:#FFFFFF!important;
        overflow:hidden!important;
        box-sizing:border-box!important;
      }

      html body #${MODAL}.open {
        display:flex!important;
      }

      #${MODAL} .mana-v950-header {
        display:flex!important;
        justify-content:space-between!important;
        align-items:center!important;
        gap:12px!important;
        padding:13px 16px!important;
        flex:0 0 auto!important;
        background:#111317!important;
        border-bottom:1px solid #48515B!important;
      }

      #${MODAL} .mana-v950-header-kicker {
        color:#FF7927!important;
        font-size:11px!important;
        font-weight:900!important;
        letter-spacing:.12em!important;
      }

      #${MODAL} .mana-v950-header-title {
        color:#FFFFFF!important;
        font-size:22px!important;
        font-weight:900!important;
      }

      #${MODAL} .mana-v950-header-sub {
        color:#C1C6CE!important;
        font-size:12px!important;
      }

      #${MODAL} .mana-v950-close {
        flex:0 0 44px!important;
        width:44px!important;
        height:44px!important;
        color:#FFFFFF!important;
        background:#191B20!important;
        border:1px solid #707780!important;
        border-radius:11px!important;
        font-size:27px!important;
        cursor:pointer!important;
      }

      #${MODAL} .mana-v950-messages {
        flex:1 1 auto!important;
        display:flex!important;
        flex-direction:column!important;
        gap:10px!important;
        min-height:0!important;
        overflow-y:auto!important;
        overscroll-behavior:contain!important;
        -webkit-overflow-scrolling:touch!important;
        padding:15px!important;
      }

      #${MODAL} .mana-v950-empty {
        padding:14px!important;
        color:#C1C6CE!important;
        font-size:13px!important;
        line-height:1.5!important;
      }

      #${MODAL} .mana-v950-message {
        align-self:flex-start!important;
        max-width:85%!important;
        padding:11px 14px!important;
        border:1px solid #4A535D!important;
        border-radius:14px!important;
        background:#1B2025!important;
        overflow-wrap:anywhere!important;
      }

      #${MODAL} .mana-v950-message.mine {
        align-self:flex-end!important;
        background:#251B14!important;
        border-color:#FF7927!important;
      }

      #${MODAL} .mana-v950-message-name {
        color:#FF7927!important;
        font-size:11px!important;
        font-weight:900!important;
      }

      #${MODAL} .mana-v950-message-body {
        color:#FFFFFF!important;
        font-size:14px!important;
        white-space:pre-wrap!important;
        line-height:1.5!important;
        margin-top:4px!important;
      }

      #${MODAL} .mana-v950-message-time {
        color:#C1C6CE!important;
        font-size:10px!important;
        margin-top:6px!important;
      }

      #${MODAL} .mana-v950-compose {
        flex:0 0 auto!important;
        background:#111317!important;
        border-top:1px solid #48515B!important;
        padding:10px 12px
          max(12px,env(safe-area-inset-bottom))!important;
      }

      #${MODAL} .mana-v950-compose-inner {
        display:flex!important;
        align-items:stretch!important;
        gap:8px!important;
      }

      #${MODAL} .mana-v950-input {
        flex:1 1 auto!important;
        width:auto!important;
        min-width:0!important;
        height:54px!important;
        min-height:54px!important;
        max-height:54px!important;
        padding:12px!important;
        resize:none!important;
        color:#FFFFFF!important;
        background:#08090B!important;
        border:1px solid #606A75!important;
        border-radius:11px!important;
        box-sizing:border-box!important;
        font:500 16px/1.4 system-ui!important;
      }

      #${MODAL} .mana-v950-send {
        flex:0 0 85px!important;
        width:85px!important;
        min-width:85px!important;
        min-height:54px!important;
        height:54px!important;
        padding:5px!important;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        background:#FF7927!important;
        border:1px solid #FF7927!important;
        border-radius:11px!important;
        font:900 12px system-ui!important;
        cursor:pointer!important;
      }

      #${MODAL} .mana-v950-send:disabled {
        opacity:.6!important;
      }

      #${MODAL} .mana-v950-status {
        min-height:17px!important;
        padding-top:6px!important;
        color:#C1C6CE!important;
        font-size:11px!important;
        line-height:1.4!important;
      }

      #${MODAL} .mana-v950-status[data-kind="error"] {
        color:#FF937F!important;
      }

      #${MODAL} .mana-v950-status[data-kind="sent"] {
        color:#20CDD4!important;
      }

      /* Coach inbox */

      #${INBOX} {
        width:100%;
        color:#FFFFFF;
      }

      #${INBOX} .mci-head {
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        flex-wrap:wrap;
        margin-bottom:16px;
      }

      #${INBOX} .mci-title {
        font-size:19px;
        font-weight:900;
        color:#FFFFFF;
      }

      #${INBOX} .mci-sub {
        margin-top:5px;
        font-size:12px;
        color:#C1C6CE;
      }

      #${INBOX} .mci-unread-text {
        color:#FF7927;
        font-size:12px;
        font-weight:850;
        margin-top:7px;
      }

      #${INBOX} .mci-refresh,
      #${INBOX} .mci-open {
        padding:11px 14px;
        border:1px solid #FF7927;
        border-radius:10px;
        background:#26190F;
        color:#FF7927;
        font-size:11px;
        font-weight:900;
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
        gap:14px;
        padding:15px;
        border:1px solid #48515B;
        border-radius:13px;
        background:#101216;
      }

      #${INBOX} .mci-client.unread {
        border-color:#FF7927;
      }

      #${INBOX} .mci-copy {
        flex:1;
        min-width:0;
      }

      #${INBOX} .mci-name {
        color:#FFFFFF;
        font-size:14px;
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

      #${INBOX} .mci-empty {
        padding:17px;
        color:#C1C6CE;
        border:1px solid #48515B;
        border-radius:12px;
        font-size:13px;
      }

      /* Real unread badges */

      #manaV97CoachNav .mci-tab-unread,
      .mana-client-chat-unread,
      #${INBOX} .mci-count {
        display:inline-flex;
        justify-content:center;
        align-items:center;
        min-width:21px;
        height:21px;
        padding:0 6px;
        border-radius:999px;
        background:#FF7927;
        color:#08090B!important;
        -webkit-text-fill-color:#08090B!important;
        box-sizing:border-box;
        font-size:11px!important;
        font-weight:950!important;
        line-height:1!important;
      }

      #manaV97CoachNav
      .mci-tab-unread[hidden],
      .mana-client-chat-unread[hidden] {
        display:none!important;
      }

      #manaV97CoachNav .mci-tab-unread {
        min-width:18px;
        height:18px;
        font-size:10px!important;
      }

      #mana28OverviewCoachChat104411,
      #manaStrengthHubChat104080 {
        position:relative!important;
      }

      #mana28OverviewCoachChat104411
      .mana-client-chat-unread,
      #manaStrengthHubChat104080
      .mana-client-chat-unread {
        position:absolute!important;
        top:7px!important;
        right:12px!important;
        z-index:5!important;
      }

      #manaCoachHubClean103760
      .hub-alert-grid > .hub-alert:first-child {
        cursor:pointer!important;
      }

      @media(max-width:600px) {
        #${MODAL} .mana-v950-header {
          padding:10px 12px!important;
        }

        #${MODAL} .mana-v950-message {
          max-width:92%!important;
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

  /* =========================================================
     CONVERSATION MODAL
     ========================================================= */

  function ensureModal() {
    let modal = $(MODAL);

    if (!modal) {
      modal = document.createElement("div");
      modal.id = MODAL;
      document.body.appendChild(modal);
    }

    if (
      $("manaV95Messages") &&
      $("manaV95Input") &&
      $("manaV95Send") &&
      $("manaV95ChatClose")
    ) return modal;

    modal.innerHTML = `
      <div class="mana-v950-header">
        <div>
          <div class="mana-v950-header-kicker">
            MANA MOVEMENT
          </div>
          <div
            id="manaV95ChatTitle"
            class="mana-v950-header-title"
          >Coach Chat</div>
          <div
            id="manaV95ChatSub"
            class="mana-v950-header-sub"
          >Direct coaching support</div>
        </div>
        <button
          type="button"
          id="manaV95ChatClose"
          class="mana-v950-close"
          aria-label="Close Chat"
        >×</button>
      </div>

      <div
        id="manaV95Messages"
        class="mana-v950-messages"
        aria-live="polite"
      ></div>

      <div class="mana-v950-compose">
        <div class="mana-v950-compose-inner">
          <textarea
            id="manaV95Input"
            class="mana-v950-input"
            rows="1"
            maxlength="2000"
            placeholder="Message your coach..."
          ></textarea>
          <button
            type="button"
            id="manaV95Send"
            class="mana-v950-send"
          >SEND</button>
        </div>
        <div
          id="manaV95Status"
          class="mana-v950-status"
          role="status"
          aria-live="polite"
        ></div>
      </div>
    `;

    return modal;
  }

  function setStatus(message, type = "") {
    const el = $("manaV95Status");
    if (!el) return;
    el.textContent = message || "";
    el.dataset.kind = type;
  }

  function setSendLabel(value) {
    const button = $("manaV95Send");
    if (button) button.textContent = value;
  }

  function startModal() {
    ensureModal();

    if (!modalOpen()) {
      previousOverflow =
        document.body.style.overflow;
    }

    $(MODAL).classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function stopModal() {
    $(MODAL)?.classList.remove("open");
    document.body.style.overflow = previousOverflow;
  }

  function close() {
    ++opening;
    active = null;
    stopChatPoll();
    stopModal();
    setStatus("");

    refreshUnread();

    if (inboxVisible()) {
      loadInbox();
    }
  }

  function renderMessages(messages, userId) {
    const host = $("manaV95Messages");
    if (!host) return;

    if (!messages.length) {
      host.innerHTML = `
        <div class="mana-v950-empty">
          No messages yet. Start a conversation.
        </div>
      `;
      return;
    }

    const html = messages.map(message => {
      const mine =
        String(message.sender_id) === String(userId);

      const author = mine
        ? "You"
        : message.sender_role === "coach"
          ? "Coach"
          : active?.name || "Client";

      return `
        <div class="mana-v950-message${mine ? " mine" : ""}">
          <div class="mana-v950-message-name">
            ${escapeHTML(author)}
          </div>
          <div class="mana-v950-message-body">
            ${escapeHTML(message.body)}
          </div>
          <div class="mana-v950-message-time">
            ${escapeHTML(dateLabel(message.created_at))}
          </div>
        </div>
      `;
    }).join("");

    if (host.innerHTML !== html) {
      host.innerHTML = html;
      host.scrollTop = host.scrollHeight;
    }
  }

  async function markRead(db, clientId, role) {
    const incomingRole =
      role === "coach" ? "client" : "coach";

    const result = await db
      .from("strength_messages")
      .update({
        read_at: new Date().toISOString()
      })
      .eq("client_id", clientId)
      .eq("sender_role", incomingRole)
      .is("read_at", null);

    if (result.error) throw result.error;
  }

  async function refreshConversation() {
    if (
      loadingMessages ||
      !modalOpen() ||
      !active?.id
    ) return;

    loadingMessages = true;

    const ticket = opening;
    const id = active.id;
    const role = active.role;

    try {
      const db = await cloud();
      const user = await session(db);

      const result = await db
        .from("strength_messages")
        .select(
          "id,client_id,sender_id,sender_role,body,created_at,read_at"
        )
        .eq("client_id", id)
        .order("created_at", {ascending:true})
        .limit(100);

      if (result.error) throw result.error;

      if (
        ticket !== opening ||
        !modalOpen() ||
        active?.id !== id
      ) return;

      renderMessages(result.data || [], user.id);

      const incoming =
        role === "coach" ? "client" : "coach";

      const unread = (result.data || []).some(
        row =>
          row.sender_role === incoming &&
          row.read_at === null
      );

      if (unread) {
        try {
          await markRead(db, id, role);
          refreshUnread();
        } catch (error) {
          console.warn(
            "[Mana Chat] Read status:",
            error.message
          );
        }
      }

      setStatus("");

    } catch (error) {
      if (ticket === opening && modalOpen()) {
        setStatus(
          "Unable to refresh: " +
          (error.message || "Connection error."),
          "error"
        );
      }
    } finally {
      loadingMessages = false;
    }
  }

  async function open(
    requestedRole,
    chosenId = "",
    chosenName = "Client"
  ) {
    const ticket = ++opening;

    stopChatPoll();
    active = null;

    /* Authenticate before opening an overlay.
       This prevents the mobile loading lock. */

    try {
      const db = await cloud();
      const user = await session(db);
      const actualRole = await roleFor(db, user.id);

      if (ticket !== opening) return;

      if (actualRole !== requestedRole) {
        if (
          actualRole === "coach" &&
          requestedRole === "client"
        ) {
          window.alert(
            "This is your Coach account. " +
            "To test client Chat, sign in with " +
            "a separate client account."
          );
          return;
        }

        window.alert(
          "Chat is unavailable for this account. " +
          "Please check your sign-in."
        );
        return;
      }

      const id = requestedRole === "client"
        ? user.id
        : String(chosenId || "");

      if (!id) {
        throw Error("No client conversation selected.");
      }

      active = {
        id,
        role: actualRole,
        name: String(chosenName || "Client")
      };

      startModal();

      $("manaV95ChatTitle").textContent =
        actualRole === "coach"
          ? active.name + " • Chat"
          : "Coach Chat";

      $("manaV95ChatSub").textContent =
        actualRole === "coach"
          ? "Your client coaching conversation."
          : "Message your coach about training, Fuel or progress.";

      $("manaV95Input").placeholder =
        actualRole === "coach"
          ? "Message " + active.name + "..."
          : "Message your coach...";

      $("manaV95Messages").innerHTML = `
        <div class="mana-v950-empty">
          Loading your conversation…
        </div>
      `;

      $("manaV95Send").disabled = false;
      setSendLabel("SEND");
      setStatus("");

      await refreshConversation();

      if (ticket === opening && modalOpen()) {
        startChatPoll();
      }

    } catch (error) {
      if (ticket !== opening) return;

      stopModal();
      active = null;

      window.alert(
        "Chat could not open: " +
        (error.message || "Please retry.")
      );
    }
  }

  async function send() {
    if (
      sending ||
      !modalOpen() ||
      !active?.id
    ) return;

    const input = $("manaV95Input");
    const body = String(input?.value || "").trim();

    if (!body) {
      setStatus("Write a message first.", "error");
      return;
    }

    sending = true;

    const button = $("manaV95Send");
    if (button) button.disabled = true;

    setSendLabel("SENDING…");
    setStatus("Sending…");

    const conversation = {...active};

    try {
      const db = await cloud();
      const user = await session(db);

      const result = await db
        .from("strength_messages")
        .insert({
          client_id: conversation.id,
          sender_id: user.id,
          sender_role: conversation.role,
          body
        });

      if (result.error) throw result.error;

      if (
        active?.id === conversation.id &&
        modalOpen()
      ) {
        input.value = "";
        setSendLabel("SENT ✓");
        setStatus("Message sent ✓", "sent");
      }

    } catch (error) {
      setSendLabel("SEND");
      setStatus(
        "Not sent: " +
        (error.message || "Please retry."),
        "error"
      );
    } finally {
      sending = false;
      if (button) button.disabled = false;
    }

    refreshConversation();
  }

  function stopChatPoll() {
    if (chatPoll !== null) {
      clearInterval(chatPoll);
      chatPoll = null;
    }
  }

  function startChatPoll() {
    stopChatPoll();

    chatPoll = setInterval(() => {
      if (
        modalOpen() &&
        !sending &&
        document.visibilityState !== "hidden"
      ) {
        refreshConversation();
      }
    }, 15000);
  }

  /* =========================================================
     UNREAD INDICATORS
     ========================================================= */

  function coachTab() {
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
        ? count + " unread messages. Open Chat."
        : "Open Coach Chat."
    );

    const number = card.querySelector(
      ".hub-alert-number"
    );

    const small = card.querySelector("small");

    if (number && number.textContent !== String(count)) {
      number.textContent = String(count);
    }

    const label = count
      ? count + " unread message" +
        (count === 1 ? "" : "s") +
        " · Open inbox"
      : "All caught up · Open inbox";

    if (small && small.textContent !== label) {
      small.textContent = label;
    }
  }

  function updateCoachBadge(count) {
    const tab = coachTab();
    if (!tab) return;

    let badge = tab.querySelector(".mci-tab-unread");

    if (!badge) {
      badge = document.createElement("span");
      badge.className = "mci-tab-unread";
      tab.appendChild(badge);
    }

    const value = count > 99
      ? "99+"
      : String(count);

    if (badge.textContent !== value) {
      badge.textContent = value;
    }

    badge.hidden = count === 0;
  }

  function updateClientBadges(count) {
    for (const id of CLIENT_CARD_IDS) {
      const card = $(id);
      if (!card) continue;

      let badge = card.querySelector(
        ".mana-client-chat-unread"
      );

      if (!badge) {
        badge = document.createElement("span");
        badge.className = "mana-client-chat-unread";
        card.appendChild(badge);
      }

      const value = count > 99
        ? "99+"
        : String(count);

      if (badge.textContent !== value) {
        badge.textContent = value;
      }

      badge.hidden = count === 0;

      card.setAttribute(
        "aria-label",
        count
          ? "Coach Chat, " + count +
            " unread message" +
            (count === 1 ? "" : "s")
          : "Open Coach Chat"
      );
    }
  }

  async function refreshUnread() {
    if (loadingUnread) return;
    loadingUnread = true;

    try {
      const db = await cloud();
      const user = await session(db);
      const role = await roleFor(db, user.id);

      if (role === "coach") {
        const result = await db
          .from("strength_messages")
          .select("id", {
            count:"exact",
            head:true
          })
          .eq("sender_role", "client")
          .is("read_at", null);

        if (result.error) throw result.error;

        lastCoachCount = result.count || 0;
        updateCoachBadge(lastCoachCount);
        updateSummary(lastCoachCount);

      } else if (role === "client") {
        const result = await db
          .from("strength_messages")
          .select("id", {
            count:"exact",
            head:true
          })
          .eq("client_id", user.id)
          .eq("sender_role", "coach")
          .is("read_at", null);

        if (result.error) throw result.error;

        lastClientCount = result.count || 0;
        updateClientBadges(lastClientCount);
      }

    } catch (error) {
      console.warn(
        "[Mana Chat] Unread refresh:",
        error.message
      );

    } finally {
      loadingUnread = false;
    }
  }

  /* =========================================================
     COACH HUB INBOX
     ========================================================= */

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
    if (!inboxVisible() || loadingInbox) return;

    const host = ensureInbox();
    if (!host) return;

    loadingInbox = true;

    try {
      const db = await cloud();
      const user = await session(db);

      if (await roleFor(db, user.id) !== "coach") {
        throw Error("Coach access required.");
      }

      const [clientsResult, messagesResult] =
        await Promise.all([
          db.rpc("coach_clients_summary"),

          db.from("strength_messages")
            .select(
              "id,client_id,sender_role,body,created_at,read_at"
            )
            .order("created_at", {ascending:false})
            .limit(500)
        ]);

      if (clientsResult.error) {
        throw clientsResult.error;
      }
      if (messagesResult.error) {
        throw messagesResult.error;
      }

      const clients = new Map();

      (clientsResult.data || []).forEach(row => {
        const id = String(row.user_id || "");
        if (!id || clients.has(id)) return;

        clients.set(id, {
          id,
          name: String(row.full_name || "Client"),
          preview: "No messages yet",
          time: "",
          unread: 0
        });
      });

      (messagesResult.data || []).forEach(message => {
        const client = clients.get(
          String(message.client_id || "")
        );

        if (!client) return;

        if (!client.time) {
          client.time = message.created_at;
          client.preview =
            (message.sender_role === "coach"
              ? "Coach: "
              : "Client: ") +
            String(message.body || "").slice(0, 140);
        }

        if (
          message.sender_role === "client" &&
          message.read_at === null
        ) {
          client.unread++;
        }
      });

      const rows = [...clients.values()].sort(
        (a, b) =>
          b.unread - a.unread ||
          (b.time ? new Date(b.time).getTime() : 0) -
          (a.time ? new Date(a.time).getTime() : 0) ||
          a.name.localeCompare(b.name)
      );

      const unreadTotal = rows.reduce(
        (sum, row) => sum + row.unread,
        0
      );

      lastCoachCount = unreadTotal;
      updateSummary(unreadTotal);
      updateCoachBadge(unreadTotal);

      host.innerHTML = `
        <div class="mci-head">
          <div>
            <div class="mci-title">Coaching Inbox</div>
            <div class="mci-sub">
              ${rows.length} clients · Shared Mana Movement messages
            </div>
            ${unreadTotal ? `
              <div class="mci-unread-text">
                ${unreadTotal} unread message${
                  unreadTotal === 1 ? "" : "s"
                }
              </div>
            ` : ""}
          </div>

          <button
            type="button"
            class="mci-refresh"
            data-mci-refresh="1"
          >REFRESH</button>
        </div>

        <div class="mci-list">
          ${rows.length
            ? rows.map(client => `
              <div class="mci-client${
                client.unread ? " unread" : ""
              }">
                <div class="mci-copy">
                  <div class="mci-name">
                    ${escapeHTML(client.name)}
                    ${client.unread ? `
                      <span class="mci-count">
                        ${client.unread}
                      </span>
                    ` : ""}
                  </div>
                  <div class="mci-preview">
                    ${escapeHTML(client.preview)}
                  </div>
                  <div class="mci-time">
                    ${escapeHTML(dateLabel(client.time))}
                  </div>
                </div>

                <button
                  type="button"
                  class="mci-open"
                  data-mci-client="${escapeHTML(client.id)}"
                  data-mci-name="${escapeHTML(client.name)}"
                >OPEN CHAT →</button>
              </div>
            `).join("")
            : `
              <div class="mci-empty">
                No client records found.
              </div>
            `
          }
        </div>
      `;

    } catch (error) {
      host.innerHTML = `
        <div class="mci-empty">
          ${escapeHTML(
            error.message || "Unable to load inbox."
          )}
          <button
            type="button"
            class="mci-refresh"
            data-mci-refresh="1"
          >RETRY</button>
        </div>
      `;

    } finally {
      loadingInbox = false;
    }
  }

  /* =========================================================
     COACH PROFILE CHAT LINK
     ========================================================= */

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
      card.dataset.clientId === selected.id &&
      card.querySelector("#manaV95CoachOpen")
    ) return;

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
      <button
        type="button"
        class="mana-v950-open"
        id="manaV95CoachOpen"
      >OPEN CLIENT CHAT →</button>
    `;
  }

  /* =========================================================
     EVENTS
     ========================================================= */

  function goToCoachChat() {
    coachTab()?.click();
  }

  function onClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const inboxButton = target.closest(
      "[data-mci-client]"
    );

    if (inboxButton) {
      event.preventDefault();

      open(
        "coach",
        inboxButton.dataset.mciClient,
        inboxButton.dataset.mciName
      );
      return;
    }

    if (target.closest("[data-mci-refresh]")) {
      event.preventDefault();
      loadInbox();
      return;
    }

    const alertCard = summaryCard();

    if (
      coachVisible() &&
      alertCard &&
      alertCard.contains(target)
    ) {
      event.preventDefault();
      goToCoachChat();
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
      goToCoachChat();
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
      modalOpen()
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
      setSendLabel("SEND");
      setStatus("");
    }
  }

  function refreshAfterNavigation() {
    /* Cards can be created after a tab click.
       Recheck briefly without DOM observers. */

    [100, 450, 1100].forEach(delay => {
      setTimeout(() => {
        syncCoachClientCard();

        if (!coachVisible()) {
          updateClientBadges(lastClientCount);
        }

        refreshUnread();

        if (inboxVisible() && !loadingInbox) {
          loadInbox();
        }
      }, delay);
    });
  }

  function init() {
    installStyles();
    ensureModal();

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("input", onInput);

    window.openManaStrengthClientChat =
      () => open("client");

    window.openManaStrengthCoachChat =
      (id, name) => open("coach", id, name);

    window.refreshManaStrengthChat =
      () => refreshConversation();

    window.refreshManaCoachInbox = loadInbox;

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        if (
          event.target.closest(
            "#manaV97CoachNav," +
            ".client-open," +
            "#manaV80Mana28," +
            "#manaV80Strength," +
            "#manaV83Tabs," +
            "#manaCoachClientSwitch104870"
          )
        ) {
          refreshAfterNavigation();
        }
      },
      true
    );

    [
      "pageshow",
      "focus",
      "mana:profile-synced",
      "mana:program-tab-change"
    ].forEach(name => {
      window.addEventListener(
        name,
        refreshAfterNavigation
      );
    });

    appPoll = setInterval(() => {
      if (
        document.visibilityState === "hidden"
      ) return;

      refreshUnread();

      if (inboxVisible()) {
        loadInbox();
      }
    }, 30000);

    refreshAfterNavigation();

    window.MANA_STRENGTH_CHAT_BUILD = BUILD;

    console.log(
      "[Mana Movement] Shared Chat " + BUILD
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
